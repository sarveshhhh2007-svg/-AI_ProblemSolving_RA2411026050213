/**
 * Main Entry Point for Three.js and App Initialization
 */

const App = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    clock: new THREE.Clock(),

    init() {
        // Init 3D Scene
        const container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0A0E1A, 0.03); // Neon cyberpunk fog

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 8, 10); // Isometric-ish view
        this.camera.lookAt(0, 0, 0);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // Emissive materials glow better if we had post-processing, but for now we'll just use basic materials
        container.appendChild(this.renderer.domElement);

        // Controls
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxPolarAngle = Math.PI / 2 - 0.1; // Don't go below ground
        }

        // Window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Load modules
        if (window.Lighting) Lighting.init(this.scene);
        if (window.Particles) Particles.init(this.scene);
        if (window.Grid) Grid.init(this.scene, this.camera, this.renderer.domElement);
        if (window.Robot) Robot.init(this.scene);

        // Initialize UI
        if (window.InputPanel) InputPanel.init();

        // Start render loop
        this.animate();
    },

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        if (this.controls) this.controls.update();
        if (window.Particles) Particles.update(delta);
        if (window.CellEffects) CellEffects.update(time);
        if (window.RobotAnimations) RobotAnimations.update(time);

        this.renderer.render(this.scene, this.camera);
    }
};

window.onload = () => {
    App.init();
};

window.App = App;
