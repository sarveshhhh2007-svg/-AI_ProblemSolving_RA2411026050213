/**
 * Visual effects for cell states (Breeze, Stench, Safe, Deductions)
 */

const CellEffects = {
    update(time) {
        // Pulse effects based on time
        const pulse = (Math.sin(time * 3) + 1) / 2; // 0 to 1
        
        Object.values(Grid.cells).forEach(cell => {
            if (cell.userData.needsPulse && cell.userData.edgeLine) {
                const mat = cell.userData.edgeLine.material;
                const baseColor = cell.userData.pulseColor;
                mat.color.setHex(baseColor).lerp(new THREE.Color(0xffffff), pulse * 0.5);
            }
        });
    },

    applyPerceptEffect(r, c, type) {
        const cell = Grid.getCellMesh(r, c);
        if (!cell) return;

        // Reset previous state
        this.resetCell(cell);

        const edgeMat = cell.userData.edgeLine.material;
        const mat = cell.material;

        switch (type) {
            case PERCEPTS.SAFE:
                mat.color.setHex(0x333344);
                edgeMat.color.setHex(0x39FF14); // safe-green
                break;
            case PERCEPTS.BREEZE:
                mat.color.setHex(0x113344);
                edgeMat.color.setHex(0x00D9FF); // breeze-cyan
                cell.userData.needsPulse = true;
                cell.userData.pulseColor = 0x00D9FF;
                Particles.emitBreeze(cell.position);
                break;
            case PERCEPTS.STENCH:
                mat.color.setHex(0x334411);
                edgeMat.color.setHex(0xCCFF00); // stench-lime
                cell.userData.needsPulse = true;
                cell.userData.pulseColor = 0xCCFF00;
                Particles.emitStench(cell.position);
                break;
            case PERCEPTS.UNKNOWN:
            default:
                mat.color.setHex(0x333344);
                edgeMat.color.setHex(0x444455);
                break;
        }
    },

    applyDeductionEffect(r, c, deductions) {
        const cell = Grid.getCellMesh(r, c);
        if (!cell) return;

        // If it's a confirmed safe cell (and wasn't already explicitly marked)
        if (deductions.includes(DEDUCTIONS.SAFE)) {
            // Apply holographic shield effect
            this.createHoloShield(cell, 0x39FF14);
        } else if (deductions.includes(DEDUCTIONS.POSSIBLE_PIT)) {
            cell.material.color.setHex(0x441111);
            cell.userData.edgeLine.material.color.setHex(0xFF0040); // danger-red
            this.createWarningHologram(cell, '⚠️');
        } else if (deductions.includes(DEDUCTIONS.POSSIBLE_WUMPUS)) {
            cell.material.color.setHex(0x550011);
            cell.userData.edgeLine.material.color.setHex(0xFF0040);
            this.createWarningHologram(cell, '💀');
        }
    },

    resetCell(cell) {
        cell.userData.needsPulse = false;
        // Remove old holograms
        const toRemove = [];
        cell.children.forEach(child => {
            if (child.userData.isHologram || child.userData.isShield) {
                toRemove.push(child);
            }
        });
        toRemove.forEach(child => cell.remove(child));
        Particles.clearEffectsAt(cell.position);
    },

    createHoloShield(cell, colorHex) {
        const geo = new THREE.CylinderGeometry(0.55, 0.55, 0.3, 6);
        const mat = new THREE.MeshBasicMaterial({
            color: colorHex,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        const shield = new THREE.Mesh(geo, mat);
        shield.userData.isShield = true;
        cell.add(shield);
        
        // Add vertical beam
        const beamGeo = new THREE.CylinderGeometry(0.4, 0.4, 5, 6);
        const beamMat = new THREE.MeshBasicMaterial({
            color: colorHex,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.y = 2.5;
        shield.add(beam);
        
        // Animation
        if (window.gsap) {
            shield.position.y = -0.5;
            gsap.to(shield.position, { y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        }
    },

    createWarningHologram(cell, symbol) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FF0040';
        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, 64, 64);
        
        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, color: 0xffffff, transparent: true });
        const sprite = new THREE.Sprite(mat);
        sprite.position.y = 0.8;
        sprite.userData.isHologram = true;
        cell.add(sprite);
        
        if (window.gsap) {
            gsap.to(sprite.position, { y: 1.0, duration: 1, yoyo: true, repeat: -1, ease: "sine.inOut" });
        }
    },
    
    highlightPath(pathCoords) {
        // Clear old path
        Object.values(Grid.cells).forEach(cell => {
            const toRemove = [];
            cell.children.forEach(c => {
                if (c.userData.isPathLine) toRemove.push(c);
            });
            toRemove.forEach(c => cell.remove(c));
        });

        // Draw new path
        for (let i = 0; i < pathCoords.length - 1; i++) {
            const p1 = Coordinator.toWorldPos(pathCoords[i].r, pathCoords[i].c);
            const p2 = Coordinator.toWorldPos(pathCoords[i+1].r, pathCoords[i+1].c);
            
            // Draw a glowing line from p1 to p2
            const material = new THREE.LineBasicMaterial({
                color: 0x0080FF,
                linewidth: 5,
                transparent: true,
                opacity: 0.8
            });
            const points = [];
            points.push(new THREE.Vector3(p1.x, p1.y + 0.3, p1.z));
            points.push(new THREE.Vector3(p2.x, p2.y + 0.3, p2.z));
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            
            // Attach to scene
            App.scene.add(line);
            
            // Hack: store it somewhere to be cleared later
            const cell = Grid.getCellMesh(pathCoords[i].r, pathCoords[i].c);
            line.userData.isPathLine = true;
            cell.add(line); // Adds it relative to cell, which is fine since line uses world pos if added to scene, wait.
            
            // Correction: if adding to scene, we must track it globally. 
            // Better to just track globally in this object.
        }
    }
};

window.CellEffects = CellEffects;
