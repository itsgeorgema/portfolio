"use client";
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { nardoGrayColors } from '@/styles/colors';

export default function GradientFloor() {
	const materialRef = useRef<THREE.ShaderMaterial | null>(null);


	// Pick four corner colors from the Nardo palette (bottomLeft, bottomRight, topLeft, topRight)
				const colors = useMemo(() => ({
					// Darker on top, lighter on bottom for a sky-like vertical gradient
					topLeft: new THREE.Color(nardoGrayColors.primary[700]),
					topRight: new THREE.Color(nardoGrayColors.primary[700]),
					bottomRight: new THREE.Color(nardoGrayColors.primary[500]),
					bottomLeft: new THREE.Color(nardoGrayColors.primary[500])
				}), []);

	const backgroundTexture = useMemo(() => {
		const tl = colors.topLeft.clone(); tl.convertLinearToSRGB();
		const tr = colors.topRight.clone(); tr.convertLinearToSRGB();
		const br = colors.bottomRight.clone(); br.convertLinearToSRGB();
		const bl = colors.bottomLeft.clone(); bl.convertLinearToSRGB();

		const data = new Uint8Array([
			// bottom-left (0,0), bottom-right (1,0), top-left (0,1), top-right (1,1)
			Math.round(bl.r * 255), Math.round(bl.g * 255), Math.round(bl.b * 255), 255,
			Math.round(br.r * 255), Math.round(br.g * 255), Math.round(br.b * 255), 255,
			Math.round(tl.r * 255), Math.round(tl.g * 255), Math.round(tl.b * 255), 255,
			Math.round(tr.r * 255), Math.round(tr.g * 255), Math.round(tr.b * 255), 255,
		]);

		const tex = new THREE.DataTexture(data, 2, 2);
		// Ensure correct color management and smooth sampling
		// In r150+, use colorSpace instead of encoding; in older, fallback to encoding
		if ('colorSpace' in tex) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(tex as any).colorSpace = (THREE as any).SRGBColorSpace;
		}
		tex.magFilter = THREE.LinearFilter;
		tex.minFilter = THREE.LinearFilter;
		tex.generateMipmaps = false;
		tex.needsUpdate = true;
		return tex;
	}, [colors]);

	const material = useMemo(() => {
		const uniforms = {
			tBackground: { value: backgroundTexture },
		};

		const vertex = `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				vec3 newPosition = position;
				newPosition.z = 1.0; // push to far plane
				gl_Position = vec4(newPosition, 1.0);
			}
		`;

			const fragment = `
				uniform sampler2D tBackground;
				varying vec2 vUv;
				void main() {
					vec4 backgroundColor = texture2D(tBackground, vUv);
					gl_FragColor = backgroundColor;
					#include <colorspace_fragment>
				}
			`;

		const mat = new THREE.ShaderMaterial({
			uniforms,
			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: false,
			depthTest: false, // always as background
			depthWrite: false,
		});
		materialRef.current = mat;
		return mat;
	}, [backgroundTexture]);

	return (
		<mesh frustumCulled={false} matrixAutoUpdate={false} renderOrder={-1000}>
			{/* 2x2 plane with UVs, will be rendered in clip space by the shader */}
			<planeGeometry args={[2, 2, 1, 1]} />
			<primitive object={material} attach="material" />
		</mesh>
	);
}

