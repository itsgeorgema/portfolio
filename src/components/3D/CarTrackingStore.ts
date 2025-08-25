"use client";
import * as THREE from 'three';

type TargetListener = (pos: THREE.Vector3) => void;
type BoolListener = (val: boolean) => void;

const carTarget = new THREE.Vector3(0, 0, -100);
let isDriving = false;

const targetListeners = new Set<TargetListener>();
const drivingListeners = new Set<BoolListener>();

export function setCarTarget(x: number, y: number, z: number) {
  carTarget.set(x, y, z);
  for (const l of targetListeners) l(carTarget);
}

export function getCarTarget(): THREE.Vector3 {
  return carTarget;
}

export function subscribeCarTarget(listener: TargetListener) {
  targetListeners.add(listener);
  return () => targetListeners.delete(listener);
}

export function setCarDriving(val: boolean) {
  if (isDriving === val) return;
  isDriving = val;
  for (const l of drivingListeners) l(isDriving);
}

export function getCarDriving(): boolean {
  return isDriving;
}

export function subscribeCarDriving(listener: BoolListener) {
  drivingListeners.add(listener);
  return () => drivingListeners.delete(listener);
}
