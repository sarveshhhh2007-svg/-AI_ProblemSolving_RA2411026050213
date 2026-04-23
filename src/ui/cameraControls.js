/**
 * Camera Controls
 * Note: Actual OrbitControls is initialized in main.js
 * This file handles extra logic like presets if needed.
 */

const CameraController = {
    setPresetTop() {
        App.camera.position.set(0, 15, 0);
        App.camera.lookAt(0, 0, 0);
    },
    setPresetIso() {
        App.camera.position.set(0, 8, 10);
        App.camera.lookAt(0, 0, 0);
    }
};

window.CameraController = CameraController;
