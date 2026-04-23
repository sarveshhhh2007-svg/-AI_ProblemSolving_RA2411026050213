/**
 * Simple Particle System
 */

const Particles = {
    systems: [],

    init(scene) {
        this.scene = scene;
    },

    update(delta) {
        this.systems.forEach(sys => sys.update(delta));
    },

    createSystem(pos, color, count, speed, size) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = [];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = pos.x + (Math.random() - 0.5) * 0.5;
            positions[i * 3 + 1] = pos.y + Math.random() * 0.5;
            positions[i * 3 + 2] = pos.z + (Math.random() - 0.5) * 0.5;

            velocities.push({
                x: (Math.random() - 0.5) * speed,
                y: Math.random() * speed,
                z: (Math.random() - 0.5) * speed
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Create a simple circular canvas texture for particles
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(8, 8, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        const tex = new THREE.CanvasTexture(canvas);

        const material = new THREE.PointsMaterial({
            color: color,
            size: size,
            map: tex,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const points = new THREE.Points(geometry, material);
        this.scene.add(points);

        const system = {
            mesh: points,
            velocities: velocities,
            origin: { ...pos },
            update: function(delta) {
                const posAttr = this.mesh.geometry.attributes.position;
                for (let i = 0; i < count; i++) {
                    posAttr.array[i * 3] += this.velocities[i].x * delta;
                    posAttr.array[i * 3 + 1] += this.velocities[i].y * delta;
                    posAttr.array[i * 3 + 2] += this.velocities[i].z * delta;

                    // Reset if too high
                    if (posAttr.array[i * 3 + 1] > this.origin.y + 1.5) {
                        posAttr.array[i * 3] = this.origin.x + (Math.random() - 0.5) * 0.5;
                        posAttr.array[i * 3 + 1] = this.origin.y;
                        posAttr.array[i * 3 + 2] = this.origin.z + (Math.random() - 0.5) * 0.5;
                    }
                }
                posAttr.needsUpdate = true;
            }
        };

        this.systems.push(system);
        return system;
    },

    emitBreeze(pos) {
        this.createSystem(pos, 0x00D9FF, 20, 1.0, 0.1); // Swirling cyan
    },

    emitStench(pos) {
        this.createSystem(pos, 0xCCFF00, 30, 0.5, 0.15); // Slow lime
    },

    clearEffectsAt(pos) {
        // Very simplistic cleanup: remove systems near pos
        const toRemove = [];
        this.systems.forEach((sys, idx) => {
            const dx = sys.origin.x - pos.x;
            const dz = sys.origin.z - pos.z;
            if (Math.sqrt(dx*dx + dz*dz) < 0.1) {
                this.scene.remove(sys.mesh);
                sys.mesh.geometry.dispose();
                sys.mesh.material.dispose();
                toRemove.push(idx);
            }
        });
        
        for (let i = toRemove.length - 1; i >= 0; i--) {
            this.systems.splice(toRemove[i], 1);
        }
    }
};

window.Particles = Particles;
