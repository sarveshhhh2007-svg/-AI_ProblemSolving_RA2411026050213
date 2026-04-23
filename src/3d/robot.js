/**
 * NEXUS-7 Robot Model Construction
 */

const Robot = {
    group: null,
    parts: {},
    currentCoord: { r: 1, c: 1 },

    init(scene) {
        this.group = new THREE.Group();
        
        // Materials
        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            metalness: 0.9,
            roughness: 0.2
        });
        const darkMetalMat = new THREE.MeshStandardMaterial({
            color: 0x222233,
            metalness: 0.7,
            roughness: 0.5
        });
        const cyanGlowMat = new THREE.MeshBasicMaterial({
            color: 0x00F0FF
        });
        const redGlowMat = new THREE.MeshBasicMaterial({
            color: 0xFF0040
        });

        // 1. Torso (Cylindrical Core)
        const torsoGeo = new THREE.CylinderGeometry(0.3, 0.25, 0.8, 16);
        const torso = new THREE.Mesh(torsoGeo, chromeMat);
        torso.position.y = 1.0;
        this.group.add(torso);
        this.parts.torso = torso;

        // Torso Holographic Ring
        const ringGeo = new THREE.TorusGeometry(0.35, 0.02, 8, 24);
        const ring = new THREE.Mesh(ringGeo, cyanGlowMat);
        ring.rotation.x = Math.PI / 2;
        torso.add(ring);
        this.parts.torsoRing = ring;

        // Chest display panel (canvas)
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 128, 64);
        ctx.fillStyle = '#00F0FF';
        ctx.font = '30px "Orbitron"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('(1,1)', 64, 32);
        
        const tex = new THREE.CanvasTexture(canvas);
        const panelMat = new THREE.MeshBasicMaterial({ map: tex });
        const panelGeo = new THREE.PlaneGeometry(0.4, 0.2);
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.set(0, 0.1, 0.31);
        torso.add(panel);
        this.parts.chestPanel = panel;
        this.parts.chestCtx = ctx;
        this.parts.chestTex = tex;

        // 2. Head
        const headGroup = new THREE.Group();
        headGroup.position.y = 0.6;
        torso.add(headGroup);
        this.parts.headGroup = headGroup;

        const headGeo = new THREE.IcosahedronGeometry(0.2, 1);
        const head = new THREE.Mesh(headGeo, chromeMat);
        headGroup.add(head);
        
        // Eye
        const eyeGeo = new THREE.TorusGeometry(0.08, 0.02, 8, 16);
        const eye = new THREE.Mesh(eyeGeo, cyanGlowMat);
        eye.position.z = 0.18;
        headGroup.add(eye);
        this.parts.eye = eye;

        // Antenna
        const antGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.2);
        const ant = new THREE.Mesh(antGeo, darkMetalMat);
        ant.position.y = 0.25;
        headGroup.add(ant);
        const antTipGeo = new THREE.SphereGeometry(0.03);
        const antTip = new THREE.Mesh(antTipGeo, cyanGlowMat);
        antTip.position.y = 0.1;
        ant.add(antTip);
        this.parts.antennaTip = antTip;

        // 3. Arms
        const createArm = (side) => {
            const armGroup = new THREE.Group();
            armGroup.position.set(side * 0.4, 0.2, 0);
            
            const shoulderGeo = new THREE.SphereGeometry(0.1);
            const shoulder = new THREE.Mesh(shoulderGeo, cyanGlowMat);
            armGroup.add(shoulder);

            const bicepGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
            const bicep = new THREE.Mesh(bicepGeo, chromeMat);
            bicep.position.y = -0.2;
            armGroup.add(bicep);

            return armGroup;
        };

        const leftArm = createArm(-1);
        const rightArm = createArm(1);
        torso.add(leftArm);
        torso.add(rightArm);
        this.parts.leftArm = leftArm;
        this.parts.rightArm = rightArm;

        // 4. Hover Base
        const baseGeo = new THREE.ConeGeometry(0.25, 0.4, 16);
        const base = new THREE.Mesh(baseGeo, darkMetalMat);
        base.rotation.x = Math.PI;
        base.position.y = -0.6;
        torso.add(base);

        const thrustRingGeo = new THREE.TorusGeometry(0.2, 0.03, 8, 16);
        const thrustRing = new THREE.Mesh(thrustRingGeo, cyanGlowMat);
        thrustRing.rotation.x = Math.PI / 2;
        thrustRing.position.y = 0.2;
        base.add(thrustRing);
        this.parts.thrustRing = thrustRing;

        // Initial Position (1,1)
        const startPos = Coordinator.toWorldPos(1, 1);
        this.group.position.set(startPos.x, startPos.y, startPos.z);
        scene.add(this.group);

        if (window.RobotAnimations) {
            RobotAnimations.init(this);
            RobotAnimations.playIdle();
        }
    },

    updateCoordDisplay(r, c) {
        this.currentCoord = { r, c };
        const ctx = this.parts.chestCtx;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 128, 64);
        ctx.fillStyle = '#00F0FF';
        ctx.fillText(`(${r},${c})`, 64, 32);
        this.parts.chestTex.needsUpdate = true;
    },
    
    setEyeColor(hex) {
        this.parts.eye.material.color.setHex(hex);
    }
};

window.Robot = Robot;
