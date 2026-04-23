/**
 * Robot Animation Controllers using GSAP
 */

const RobotAnimations = {
    robot: null,
    idleTween: null,
    ringTween: null,
    headScanTween: null,
    armSwayTween: null,

    init(robotRef) {
        this.robot = robotRef;
    },

    update(time) {
        // Continuous updates if not handled by GSAP (though GSAP handles most)
        if (this.robot && this.robot.parts.torsoRing) {
            // Base rotation, can be sped up during thinking
            this.robot.parts.torsoRing.rotation.z += this.ringSpeed || 0.02;
        }
    },

    playIdle() {
        if (!window.gsap) return;
        this.stopAll();

        this.ringSpeed = 0.02;
        this.robot.setEyeColor(0x00F0FF); // Cyan

        // Gentle float
        this.idleTween = gsap.to(this.robot.group.position, {
            y: "+=0.1",
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

        // Eye pulse
        this.robot.parts.eye.material.opacity = 1;
        this.robot.parts.eye.material.transparent = true;
        gsap.to(this.robot.parts.eye.material, {
            opacity: 0.4,
            duration: 1.5,
            yoyo: true,
            repeat: -1
        });

        // Head scan
        this.headScanTween = gsap.to(this.robot.parts.headGroup.rotation, {
            y: Math.PI / 4,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
            delay: 1
        });

        // Arm sway
        this.armSwayTween = gsap.to([this.robot.parts.leftArm.rotation, this.robot.parts.rightArm.rotation], {
            z: 0.1,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    },

    playThinking() {
        if (!window.gsap) return;
        this.stopAll();

        this.ringSpeed = 0.1; // Faster spin
        this.robot.setEyeColor(0xFFB000); // Amber

        // Micro shakes
        this.idleTween = gsap.to(this.robot.group.position, {
            y: "+=0.05",
            x: "+=0.02",
            duration: 0.1,
            yoyo: true,
            repeat: -1
        });

        // Head tilt
        gsap.to(this.robot.parts.headGroup.rotation, {
            z: 0.2,
            y: 0,
            duration: 0.5
        });

        // Antenna blink
        this.robot.parts.antennaTip.material.color.setHex(0xFFB000);
        gsap.to(this.robot.parts.antennaTip.material, {
            opacity: 0,
            duration: 0.1,
            yoyo: true,
            repeat: -1
        });
    },

    playMoving(targetPos, coord, onComplete) {
        if (!window.gsap) return;
        this.stopAll();

        this.ringSpeed = 0.05;
        this.robot.setEyeColor(0x00F0FF); // Cyan
        
        // Lean into movement
        const dx = targetPos.x - this.robot.group.position.x;
        const dz = targetPos.z - this.robot.group.position.z;
        const angle = Math.atan2(dx, dz);
        
        gsap.to(this.robot.parts.torso.rotation, {
            x: 0.2, // Lean forward
            y: angle, // Face direction
            duration: 0.3
        });

        gsap.to(this.robot.group.position, {
            x: targetPos.x,
            z: targetPos.z,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => {
                // Emit thruster particles
                if (Math.random() > 0.5) {
                    Particles.createSystem(
                        { x: this.robot.group.position.x, y: 0.2, z: this.robot.group.position.z },
                        0x00F0FF, 2, 0.5, 0.05
                    );
                }
            },
            onComplete: () => {
                this.robot.updateCoordDisplay(coord.r, coord.c);
                // Reset lean
                gsap.to(this.robot.parts.torso.rotation, {
                    x: 0,
                    duration: 0.3
                });
                if (onComplete) onComplete();
            }
        });
    },

    playDiscovery() {
        if (!window.gsap) return;
        this.stopAll();
        
        this.ringSpeed = 0.05;
        this.robot.setEyeColor(0x39FF14); // Green
        this.robot.parts.antennaTip.material.color.setHex(0x39FF14);

        // Excited bounce
        gsap.to(this.robot.group.position, {
            y: "+=0.5",
            duration: 0.3,
            yoyo: true,
            repeat: 3,
            ease: "power1.out"
        });

        // Arms raise
        gsap.to(this.robot.parts.leftArm.rotation, { z: Math.PI / 2, duration: 0.3 });
        gsap.to(this.robot.parts.rightArm.rotation, { z: -Math.PI / 2, duration: 0.3 });

        if (window.AudioSystem) AudioSystem.playPathFound();
    },

    stopAll() {
        if (this.idleTween) this.idleTween.kill();
        if (this.headScanTween) this.headScanTween.kill();
        if (this.armSwayTween) this.armSwayTween.kill();
        gsap.killTweensOf(this.robot.parts.headGroup.rotation);
        gsap.killTweensOf(this.robot.parts.eye.material);
        gsap.killTweensOf(this.robot.parts.antennaTip.material);
        gsap.killTweensOf(this.robot.parts.torso.rotation);
        gsap.killTweensOf(this.robot.parts.leftArm.rotation);
        gsap.killTweensOf(this.robot.parts.rightArm.rotation);
        
        // Reset some states
        this.robot.parts.antennaTip.material.opacity = 1;
        this.robot.parts.headGroup.rotation.set(0,0,0);
    }
};

window.RobotAnimations = RobotAnimations;
