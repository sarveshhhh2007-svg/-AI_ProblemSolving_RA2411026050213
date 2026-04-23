/**
 * Web Audio API synthesizer for completely dependency-free sounds.
 */

const AudioSystem = {
    ctx: null,
    enabled: true,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled) return;
        this.init();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playClick() {
        this.playTone(800, 'sine', 0.1, 0.05);
        setTimeout(() => this.playTone(1200, 'square', 0.05, 0.02), 50);
    },

    playAnalysisStart() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 1.0);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.0);
    },

    playDeductionPop() {
        this.playTone(1200, 'sine', 0.2, 0.1);
    },

    playPathFound() {
        this.init();
        const now = this.ctx.currentTime;
        const playNote = (freq, time) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(time);
            osc.stop(time + 0.3);
        };
        
        playNote(440, now);
        playNote(554, now + 0.15);
        playNote(659, now + 0.3);
        playNote(880, now + 0.45);
    },

    playDangerAlert() {
        this.playTone(200, 'sawtooth', 0.5, 0.2);
        setTimeout(() => this.playTone(200, 'sawtooth', 0.5, 0.2), 600);
    }
};

window.AudioSystem = AudioSystem;
