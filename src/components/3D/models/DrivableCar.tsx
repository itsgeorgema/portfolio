"use client";
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { usePhysics } from '../PhysicsProvider';
import { setCarTarget, setCarDriving } from '../CarTrackingStore';
import { addResetListener, removeResetListener } from '../CarResetStore';
import { Vec3Tuple } from '@/types/three';

interface DrivableCarProps {
  position: Vec3Tuple;
}

export default function DrivableCar({ position }: DrivableCarProps) {
  const { world } = usePhysics();
  const chassisGltf = useLoader(GLTFLoader, '/models/car/chassis.gltf');
  const wheelGltf = useLoader(GLTFLoader, '/models/car/wheel.gltf');
  
  const carRef = useRef<CANNON.RaycastVehicle | undefined>(undefined);
  const chassisRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Group[]>([]);
  const [keysPressed, setKeysPressed] = useState<string[]>([]);
  const initialPositionRef = useRef(position); // Store initial position in ref
  // Settling state: lock rotation briefly so the car drops straight down
  const isSettlingRef = useRef(true);
  const settleStartTimeRef = useRef<number>(0);

    // Car configuration
  const chassisDimension = { x: 1.96, y: 1, z: 3.56 };
  const chassisModelPos = { x: 0, y: -0.59, z: 0.06 };
  const wheelScale = { frontWheel: 0.29, hindWheel: 0.29 };
  const mass = 180; // Reduced from 400 to 180 to match roadster for better stability

  // Process models
  const chassisScene = useMemo(() => {
    const scene = chassisGltf.scene.clone();
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return scene;
  }, [chassisGltf.scene]);

  const wheelScenes = useMemo(() => {
    const wheels = [];
    for (let i = 0; i < 4; i++) {
      const wheelScene = wheelGltf.scene.clone();
      wheelScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Scale wheels (flip odd-indexed wheels)
      if (i === 1 || i === 3) {
        wheelScene.scale.set(
          -1 * wheelScale.frontWheel,
          1 * wheelScale.frontWheel,
          -1 * wheelScale.frontWheel
        );
      } else {
        wheelScene.scale.set(
          1 * wheelScale.frontWheel,
          1 * wheelScale.frontWheel,
          1 * wheelScale.frontWheel
        );
      }
      wheels.push(wheelScene);
    }
    return wheels;
  }, [wheelGltf.scene, wheelScale.frontWheel]);

  // Initialize physics car
  useEffect(() => {
    if (!world) return;

    // Ensure we don't create multiple cars
    if (carRef.current) return;

    // Create chassis
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(
        chassisDimension.x * 0.5,
        chassisDimension.y * 0.5,
        chassisDimension.z * 0.5
      )
    );
    const chassisBody = new CANNON.Body({
      mass: mass,
      material: new CANNON.Material({ friction: 0 })
    });
    chassisBody.addShape(chassisShape);
    // Add damping to reduce wobble/roll on contact
    chassisBody.linearDamping = 0.03;
    chassisBody.angularDamping = 0.4;
    chassisBody.position.set(initialPositionRef.current[0], initialPositionRef.current[1] + 4, initialPositionRef.current[2]);
    // Start in a "settling" mode: prevent any rotation so it drops straight
    chassisBody.quaternion.set(0, 0, 0, 1);
    chassisBody.angularVelocity.set(0, 0, 0);
    chassisBody.velocity.set(0, 0, 0);
    chassisBody.angularFactor.set(0, 0, 0);
    isSettlingRef.current = true;
    settleStartTimeRef.current = performance.now();

    // Create raycast vehicle
    const car = new CANNON.RaycastVehicle({
      chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2
    });

    // Add wheels
    const wheelConfig = {
      radius: 0.28,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 55, // Reset to roadster value for proven stability
      suspensionRestLength: 0.5, // Reset to roadster value 
      frictionSlip: 30,
      dampingRelaxation: 2.3, // Reset to roadster value
      dampingCompression: 4.3, // Reset to roadster value
      maxSuspensionForce: 500000, // MASSIVE increase from 25000 to 500000 (roadster value)
      rollInfluence: 0.01, // Slightly increased from 0.005 to match roadster
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      maxSuspensionTravel: 1, // Reset to roadster value for more flexibility
      customSlidingRotationalSpeed: 30,
    };

    // Wheel positions (front left, front right, rear left, rear right)
    const wheelPositions = [
      // Make pairs perfectly symmetric to avoid any tiny torque on spawn
      new CANNON.Vec3(0.60, 0.12, -1.00),  // Front right
      new CANNON.Vec3(-0.60, 0.12, -1.00), // Front left
      new CANNON.Vec3(0.60, 0.12, 1.00),   // Rear right
      new CANNON.Vec3(-0.60, 0.12, 1.00),  // Rear left
    ];

    wheelPositions.forEach((wheelPos) => {
      car.addWheel({
        ...wheelConfig,
        chassisConnectionPointLocal: wheelPos,
      });
    });

    // Add wheel bodies
    car.wheelInfos.forEach(() => {
      const cylinderShape = new CANNON.Cylinder(wheelConfig.radius, wheelConfig.radius, wheelConfig.radius / 2, 20);
      const wheelBody = new CANNON.Body({
        mass: 1,
        material: new CANNON.Material({ friction: 0 }),
      });
      const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0);
      wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion);
    });

  car.addToWorld(world);
    carRef.current = car;

    return () => {
      if (carRef.current) {
        world.removeBody(carRef.current.chassisBody);
        carRef.current = undefined;
      }
    };
  }, [world, chassisDimension.x, chassisDimension.y, chassisDimension.z, mass]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeysPressed(prev => {
        if (!prev.includes(key)) {
          return [...prev, key];
        }
        return prev;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeysPressed(prev => prev.filter(k => k !== key));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Add state to track if car has come to a stop via braking
  const [hasStoppedViaBraking, setHasStoppedViaBraking] = useState(false);

  // Car reset function
  const resetCar = () => {
    const car = carRef.current;
    if (!car) return;
    
    // Reset to initial hero position
    car.chassisBody.position.set(initialPositionRef.current[0], initialPositionRef.current[1] + 4, initialPositionRef.current[2]);
    car.chassisBody.quaternion.set(0, 0, 0, 1);
    car.chassisBody.angularVelocity.set(0, 0, 0);
    car.chassisBody.velocity.set(0, 0, 0);
    // Re-enter settling: lock rotation so it drops straight
    car.chassisBody.angularFactor.set(0, 0, 0);
    isSettlingRef.current = true;
    settleStartTimeRef.current = performance.now();
    setHasStoppedViaBraking(false);
  };

  // Register reset listener
  useEffect(() => {
    addResetListener(resetCar);
    return () => removeResetListener(resetCar);
  }, []);

  // Apply controls
  useEffect(() => {
    const car = carRef.current;
    if (!car) return;

    const maxSteerVal = 0.5;
    const maxForce = 600; // Keep the decreased acceleration force
    const brakeForce = 35; // Increased from 15 to 35 for faster braking while maintaining stability

    // Reset car (back to hero section)
    if (keysPressed.includes('r')) {
      resetCar();
      return;
    }

    // Check if currently turning
    const isTurning = keysPressed.includes('a') || keysPressed.includes('arrowleft') || 
                     keysPressed.includes('d') || keysPressed.includes('arrowright');

    // Brake with reduced force when turning - this is the actual brake that stops the car
    if (keysPressed.includes('shift')) {
      const currentBrakeForce = isTurning ? brakeForce * 0.6 : brakeForce; // 40% reduction when turning
      car.setBrake(currentBrakeForce, 0);
      car.setBrake(currentBrakeForce, 1);
      car.setBrake(currentBrakeForce, 2);
      car.setBrake(currentBrakeForce, 3);
      
      // When braking, check if we've come to a stop - more aggressive threshold
      const velocity = car.chassisBody.velocity;
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
      if (speed < 0.5) { // Higher speed threshold for more responsive anti-creep
        setHasStoppedViaBraking(true);
        // Immediately stop the car when braking at low speeds
        car.chassisBody.velocity.set(0, 0, 0);
        car.chassisBody.angularVelocity.set(0, 0, 0);
      }
      return;
    }

    // Clear brakes when not actively braking
    car.setBrake(0, 0);
    car.setBrake(0, 1);
    car.setBrake(0, 2);
    car.setBrake(0, 3);

    // Steering (reverted to original wheel indices: 2 and 3)
    if (keysPressed.includes('a') || keysPressed.includes('arrowleft')) {
      car.setSteeringValue(maxSteerVal * 1, 2);
      car.setSteeringValue(maxSteerVal * 1, 3);
    } else if (keysPressed.includes('d') || keysPressed.includes('arrowright')) {
      car.setSteeringValue(maxSteerVal * -1, 2);
      car.setSteeringValue(maxSteerVal * -1, 3);
    } else {
      car.setSteeringValue(0, 2);
      car.setSteeringValue(0, 3);
    }

    // Engine force and motion control
    if (keysPressed.includes('w') || keysPressed.includes('arrowup')) {
      // Clear anti-creep state when starting to move
      setHasStoppedViaBraking(false);
      
      car.applyEngineForce(maxForce * -1, 0);
      car.applyEngineForce(maxForce * -1, 1);
      car.applyEngineForce(maxForce * -1, 2);
      car.applyEngineForce(maxForce * -1, 3);
      setCarDriving(true);
    } else if (keysPressed.includes('s') || keysPressed.includes('arrowdown')) {
      // Clear anti-creep state when starting to move
      setHasStoppedViaBraking(false);
      
      car.applyEngineForce(maxForce * 1, 0);
      car.applyEngineForce(maxForce * 1, 1);
      car.applyEngineForce(maxForce * 1, 2);
      car.applyEngineForce(maxForce * 1, 3);
      setCarDriving(true);
    } else {
      // No engine force when not accelerating
      car.applyEngineForce(0, 0);
      car.applyEngineForce(0, 1);
      car.applyEngineForce(0, 2);
      car.applyEngineForce(0, 3);
      setCarDriving(false);
    }
  }, [keysPressed]);

  // Update visual positions and handle physics
  useFrame(() => {
    const car = carRef.current;
    const chassis = chassisRef.current;
    
    if (!car || !chassis || !car.wheelInfos || !car.chassisBody) return;

    // Only update visual position if physics body exists and is active
    if (car.chassisBody.world) {
      // Handle settling: keep the car perfectly upright and prevent rotation until it has landed
    if (isSettlingRef.current) {
        const elapsed = (performance.now() - settleStartTimeRef.current) / 1000;
        const vy = car.chassisBody.velocity.y;
        // Criteria to end settling: small vertical speed for a few frames or timeout safeguard
        if (Math.abs(vy) < 0.1 && elapsed > 0.15 || elapsed > 2.0) {
          car.chassisBody.angularFactor.set(1, 1, 1); // restore full rotation
          isSettlingRef.current = false;
        } else {
          // Enforce upright orientation while settling
      // Preserve yaw only
      const cq = car.chassisBody.quaternion;
      const yaw = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(cq.x, cq.y, cq.z, cq.w), 'YXZ').y;
      const upright = new CANNON.Quaternion();
      upright.setFromEuler(0, yaw, 0);
      car.chassisBody.quaternion.copy(upright);
          car.chassisBody.angularVelocity.set(0, car.chassisBody.angularVelocity.y, 0);
          // Light braking to avoid sliding while landing
          car.setBrake(5, 0);
          car.setBrake(5, 1);
          car.setBrake(5, 2);
          car.setBrake(5, 3);
        }
      }

      // Handle anti-creep physics when stopped via braking
      if (hasStoppedViaBraking) {
        // Aggressively prevent any creeping motion
        const velocity = car.chassisBody.velocity;
        const angularVelocity = car.chassisBody.angularVelocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
        const angularSpeed = Math.sqrt(angularVelocity.x * angularVelocity.x + angularVelocity.y * angularVelocity.y + angularVelocity.z * angularVelocity.z);
        
        // Completely stop any motion when in anti-creep mode
        if (speed < 2.0 || angularSpeed < 1.0) { // Higher thresholds for more aggressive stopping
          car.chassisBody.velocity.set(0, 0, 0);
          car.chassisBody.angularVelocity.set(0, 0, 0);
          
          // Also apply strong braking to prevent any physics drift
          car.setBrake(100, 0); // Very strong brake force
          car.setBrake(100, 1);
          car.setBrake(100, 2);
          car.setBrake(100, 3);
        }
      } else {
        const isMoving = keysPressed.includes('w') || keysPressed.includes('arrowup') || 
                        keysPressed.includes('s') || keysPressed.includes('arrowdown');
        const isBraking = keysPressed.includes('shift');
        
        if (!isMoving && !isBraking) {

          const velocity = car.chassisBody.velocity;
          const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
          
          if (speed > 0.05) { // Only apply if there's significant movement
            // 1) Strongly cancel lateral (sideways) velocity to keep straight coasting
            const cq = car.chassisBody.quaternion;
            const threeQ = new THREE.Quaternion(cq.x, cq.y, cq.z, cq.w);
            // Vehicle forward axis is +Z for our raycast vehicle setup
            const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(threeQ);
            forward.y = 0; forward.normalize();
            const velXZ = new THREE.Vector3(velocity.x, 0, velocity.z);
            const forwardProj = forward.clone().multiplyScalar(velXZ.dot(forward));
            const lateral = velXZ.clone().sub(forwardProj);
            if (lateral.lengthSq() > 1e-6) {
              const lateralDampStrength = 2.0; // strong lateral damping
              const lateralImpulse = new CANNON.Vec3(
                -lateral.x * lateralDampStrength,
                0,
                -lateral.z * lateralDampStrength
              );
              car.chassisBody.applyImpulse(lateralImpulse, car.chassisBody.position);
            }

            // 2) Create slowdown force proportional to current velocity (overall decel)
            const slowdownStrength = 0.38; // Stronger coasting decel
            const slowdownForce = new CANNON.Vec3(
              -velocity.x * slowdownStrength,
              -velocity.y * slowdownStrength,
              -velocity.z * slowdownStrength
            );
            car.chassisBody.applyImpulse(slowdownForce, car.chassisBody.position);

            // 3) Reduce yaw drift while coasting (helps keep straight path)
            const av = car.chassisBody.angularVelocity;
            // Heavily damp yaw, lightly damp roll/pitch
            car.chassisBody.angularVelocity.set(av.x * 0.8, av.y * 0.5, av.z * 0.8);
          } else if (speed > 0) {
            // For very low speeds, apply gentle braking to come to complete stop
            car.setBrake(20, 0);
            car.setBrake(20, 1);
            car.setBrake(20, 2);
            car.setBrake(20, 3);
            // Kill residual drift when extremely slow
            if (speed < 0.03) {
              car.chassisBody.velocity.set(0, 0, 0);
              car.chassisBody.angularVelocity.set(0, 0, 0);
            }
          }
        }
      }

  // Flip detection - check if car is upside down or on its side
      const upVector = new THREE.Vector3(0, 1, 0);
      const carUpVector = new THREE.Vector3(0, 1, 0);
      carUpVector.applyQuaternion(car.chassisBody.quaternion);
      
      // Calculate dot product to determine orientation
      // If dot product is negative, car is flipped
      const dotProduct = upVector.dot(carUpVector);
      
      // Auto-correct if car is significantly flipped (threshold: 0.3)
      if (dotProduct < 0.3) {
        // Reset to upright position with current location
        const currentPos = car.chassisBody.position;
        car.chassisBody.position.set(currentPos.x, currentPos.y + 2, currentPos.z);
        // Preserve yaw only when correcting
        const cq = car.chassisBody.quaternion;
        const yaw = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(cq.x, cq.y, cq.z, cq.w), 'YXZ').y;
        const upright = new CANNON.Quaternion();
        upright.setFromEuler(0, yaw, 0);
        car.chassisBody.quaternion.copy(upright);
        car.chassisBody.angularVelocity.set(0, 0, 0);
        // Reduce velocity but don't completely stop forward motion
        car.chassisBody.velocity.set(
          car.chassisBody.velocity.x * 0.5,
          0,
          car.chassisBody.velocity.z * 0.5
        );
        // Clear anti-creep state when flipping
        setHasStoppedViaBraking(false);
        // Briefly lock rotation again to stabilize upright recovery
        car.chassisBody.angularFactor.set(0, 0, 0);
        isSettlingRef.current = true;
        settleStartTimeRef.current = performance.now();
      }

      // Update chassis position
      chassis.position.set(
        car.chassisBody.position.x + chassisModelPos.x,
        car.chassisBody.position.y + chassisModelPos.y,
        car.chassisBody.position.z + chassisModelPos.z
      );
      chassis.quaternion.copy(car.chassisBody.quaternion);

      // Publish target for camera tracking (use chassis center)
      setCarTarget(
        car.chassisBody.position.x,
        car.chassisBody.position.y,
        car.chassisBody.position.z
      );

      // Update wheel positions
      for (let i = 0; i < 4; i++) {
        const wheel = wheelRefs.current[i];
        if (wheel && car.wheelInfos[i]) {
          car.updateWheelTransform(i);
          wheel.position.copy(car.wheelInfos[i].worldTransform.position);
          wheel.quaternion.copy(car.wheelInfos[i].worldTransform.quaternion);
        }
      }
    }
  });

  return (
    <group>
      {/* Chassis */}
      <group ref={chassisRef}>
        <primitive object={chassisScene} />
      </group>
      
      {/* Wheels */}
      {wheelScenes.map((wheelScene, index) => (
        <group
          key={index}
          ref={el => {
            if (el) wheelRefs.current[index] = el;
          }}
        >
          <primitive object={wheelScene} />
        </group>
      ))}
    </group>
  );
}
