import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleGlobeProps {
  dotColor?: string;
  particleCount?: number;
  rotationSpeed?: number;
}

export const ParticleGlobe: React.FC<ParticleGlobeProps> = ({
  dotColor = "#71717a", // Muted slate gray (not harsh white)
  particleCount = 5500,
  rotationSpeed = 0.0016,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create World Map Mask Canvas to sample continents
    const mapCanvas = document.createElement("canvas");
    mapCanvas.width = 360;
    mapCanvas.height = 180;
    const ctx = mapCanvas.getContext("2d");

    // Continent approximate landmass layout
    if (ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, 360, 180);
      ctx.fillStyle = "#ffffff";

      // North America
      ctx.beginPath();
      ctx.ellipse(80, 50, 42, 28, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(100, 30, 26, 18, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // South America
      ctx.beginPath();
      ctx.ellipse(115, 120, 24, 44, 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Europe
      ctx.beginPath();
      ctx.ellipse(190, 48, 25, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Africa
      ctx.beginPath();
      ctx.ellipse(195, 100, 30, 42, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Asia
      ctx.beginPath();
      ctx.ellipse(260, 55, 58, 32, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Australia
      ctx.beginPath();
      ctx.ellipse(300, 130, 24, 18, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const mapData = ctx ? ctx.getImageData(0, 0, 360, 180).data : null;

    const isLand = (lat: number, lon: number): boolean => {
      if (!mapData) return true;
      const x = Math.floor(((lon + 180) / 360) * 360);
      const y = Math.floor(((90 - lat) / 180) * 180);
      const idx = (y * 360 + x) * 4;
      return mapData[idx] > 80;
    };

    // Generate Evenly Spaced Spherical Particles (Fibonacci Sphere Algorithm)
    const radius = 80;
    const positions: number[] = [];
    const opacities: number[] = [];
    const sizes: number[] = [];

    const phi = Math.PI * (Math.sqrt(5) - 1); // Golden ratio angle

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(x, z) * (180 / Math.PI);

      const land = isLand(lat, lon);

      // Higher density & brightness on continents, subtle grid on oceans
      if (land || i % 3 === 0) {
        positions.push(x * radius, y * radius, z * radius);
        opacities.push(land ? 0.75 : 0.22);
        sizes.push(land ? 1.9 : 1.2);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "customOpacity",
      new THREE.Float32BufferAttribute(opacities, 1)
    );
    geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1)
    );

    // Particle Dot Shader with Soft Muted Gray / Depth Shading
    const particleTexture = createDotTexture();
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(dotColor),
      size: 2.2,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.x = 0.28; // Subtle aesthetic tilt
    points.rotation.z = -0.12;
    scene.add(points);

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      points.rotation.y += rotationSpeed;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [dotColor, particleCount, rotationSpeed]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 80%)",
      }}
    />
  );
};

// Create a smooth round circular dot texture
function createDotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(220, 220, 230, 0.7)");
    gradient.addColorStop(1, "rgba(200, 200, 210, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}
export default ParticleGlobe;
