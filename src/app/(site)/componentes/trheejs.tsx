'use client'
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeGScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = 40; // Ancho de la visualización 3D
    const height = 40; // Alto de la visualización 3D

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Fondo transparente
    containerRef.current?.appendChild(renderer.domElement);

    const material = new THREE.MeshBasicMaterial({ color: 0x4285F4, transparent: true }); // Azul Google
    const torusGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
    const torus = new THREE.Mesh(torusGeometry, material);
    torus.rotation.x = Math.PI / 2; // Ajustar la orientación

    const boxGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.2);
    const box = new THREE.Mesh(boxGeometry, material);
    box.position.x = 0.6;
    box.position.y = 0.5;

    scene.add(torus);
    scene.add(box);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeGScene;
