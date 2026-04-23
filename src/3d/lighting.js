/**
 * Lighting Setup for Neon Cyberpunk Theme
 */

const Lighting = {
    init(scene) {
        // Ambient light (very dark)
        const ambientLight = new THREE.AmbientLight(0x111122, 0.4);
        scene.add(ambientLight);

        // Directional light for subtle shadows
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(5, 10, 5);
        scene.add(dirLight);

        // Neon Accent Lights
        const cyanLight = new THREE.PointLight(0x00F0FF, 1.5, 20);
        cyanLight.position.set(-3, 2, -3);
        scene.add(cyanLight);

        const magentaLight = new THREE.PointLight(0xFF00FF, 1.0, 20);
        magentaLight.position.set(3, 2, 3);
        scene.add(magentaLight);

        // Create a faint grid floor background to look cool
        const gridHelper = new THREE.GridHelper(40, 40, 0x00F0FF, 0x0A0E1A);
        gridHelper.position.y = -2; // Below the main platform
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);
    }
};

window.Lighting = Lighting;
