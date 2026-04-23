/**
 * 4x4 Grid Setup and Raycasting
 */

const Grid = {
    cells: {}, // store mesh references by "(r,c)"
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    camera: null,
    scene: null,

    init(scene, camera, domElement) {
        this.scene = scene;
        this.camera = camera;
        
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 6); // Hexagonal tiles
        geometry.rotateY(Math.PI / 6); // Align hexagons
        
        // Base metallic material
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x333344,
            roughness: 0.4,
            metalness: 0.8,
            transparent: true,
            opacity: 0.9
        });

        // Edges for that neon look
        const edges = new THREE.EdgesGeometry(geometry);

        for (let r = 1; r <= GRID_SIZE; r++) {
            for (let c = 1; c <= GRID_SIZE; c++) {
                const pos = Coordinator.toWorldPos(r, c);
                
                // Main tile
                const tile = new THREE.Mesh(geometry, baseMaterial.clone());
                tile.position.set(pos.x, pos.y, pos.z);
                tile.userData = { r, c, originalY: pos.y };
                
                // Edge lines
                const lineMat = new THREE.LineBasicMaterial({ color: 0x444455, linewidth: 2 });
                const line = new THREE.LineSegments(edges, lineMat);
                tile.add(line);
                tile.userData.edgeLine = line;

                // Create text label using canvas texture
                const labelCanvas = document.createElement('canvas');
                labelCanvas.width = 128;
                labelCanvas.height = 128;
                const ctx = labelCanvas.getContext('2d');
                ctx.fillStyle = 'white';
                ctx.font = '30px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`(${r},${c})`, 64, 64);
                
                const labelTex = new THREE.CanvasTexture(labelCanvas);
                const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, opacity: 0.5 });
                const labelGeo = new THREE.PlaneGeometry(0.6, 0.6);
                const labelMesh = new THREE.Mesh(labelGeo, labelMat);
                labelMesh.rotation.x = -Math.PI / 2;
                labelMesh.position.y = 0.11; // Slightly above tile
                tile.add(labelMesh);
                
                // Add to scene
                scene.add(tile);
                
                // Store reference
                const key = Coordinator.toString(r, c);
                this.cells[key] = tile;
                
                // Init in KnowledgeBase
                KnowledgeBase.setPercept(r, c, PERCEPTS.UNKNOWN);
            }
        }

        // Raycasting for interactivity
        domElement.addEventListener('click', (e) => this.onClick(e), false);
        domElement.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    },

    getIntersect(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const meshes = Object.values(this.cells);
        const intersects = this.raycaster.intersectObjects(meshes);
        if (intersects.length > 0) return intersects[0].object;
        return null;
    },

    onClick(e) {
        const object = this.getIntersect(e);
        if (object) {
            const r = object.userData.r;
            const c = object.userData.c;
            // Cycle percepts: Unknown -> Safe -> Breeze -> Stench -> Unknown
            const current = KnowledgeBase.getPercept(r, c);
            let next = PERCEPTS.UNKNOWN;
            if (current === PERCEPTS.UNKNOWN) next = PERCEPTS.SAFE;
            else if (current === PERCEPTS.SAFE) next = PERCEPTS.BREEZE;
            else if (current === PERCEPTS.BREEZE) next = PERCEPTS.STENCH;
            
            // Update input panel UI which will also trigger visual update
            if (window.InputPanel) {
                InputPanel.setPercept(r, c, next);
            }
            
            // Little bounce animation
            if (window.gsap) {
                gsap.to(object.position, { y: 0.3, duration: 0.1, yoyo: true, repeat: 1 });
            }
            if (window.AudioSystem) AudioSystem.playClick();
        }
    },

    onMouseMove(e) {
        // Highlight logic could go here
        const object = this.getIntersect(e);
        document.body.style.cursor = object ? 'pointer' : 'default';
    },

    getCellMesh(r, c) {
        return this.cells[Coordinator.toString(r, c)];
    }
};

window.Grid = Grid;
