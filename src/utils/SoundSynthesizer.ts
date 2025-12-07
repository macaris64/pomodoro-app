// Utility to generate sounds using Web Audio API
// This avoids relying on external URLs that might block hotlinking or 404.

export class SoundSynthesizer {
    private ctx: AudioContext;

    constructor() {
        // Init context lazily or on user interaction usually, but here we init in ctor
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
    }

    private ensureContext() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(frequency: number, type: OscillatorType, duration: number, volume: number = 0.5) {
        this.ensureContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playNotification(type: 'start' | 'complete' | 'break') {
        const vol = 0.3;
        switch (type) {
            case 'start':
                // Rising major triad arpeggio
                this.playTone(523.25, 'sine', 0.2, vol); // C5
                setTimeout(() => this.playTone(659.25, 'sine', 0.2, vol), 100); // E5
                setTimeout(() => this.playTone(783.99, 'sine', 0.4, vol), 200); // G5
                break;
            case 'complete':
                // Victory sound (High C major chord)
                this.playTone(523.25, 'triangle', 0.1, vol); // C5
                setTimeout(() => this.playTone(659.25, 'triangle', 0.1, vol), 100); // E5
                setTimeout(() => this.playTone(783.99, 'triangle', 0.1, vol), 200); // G5
                setTimeout(() => this.playTone(1046.50, 'triangle', 0.6, vol), 300); // C6
                break;
            case 'break':
                // Softer descending
                this.playTone(659.25, 'sine', 0.3, vol); // E5
                setTimeout(() => this.playTone(523.25, 'sine', 0.4, vol), 200); // C5
                break;
        }
    }

    // Advanced: Pink Noise for Rain
    private rainNode: ScriptProcessorNode | null = null;
    private rainGain: GainNode | null = null;

    stopAmbience() {
        if (this.rainGain) {
            this.rainGain.disconnect();
            this.rainGain = null;
        }
        if (this.rainNode) {
            this.rainNode.disconnect();
            this.rainNode = null;
        }
    }

    playWhiteNoise(volume: number = 0.1) {
        this.stopAmbience();
        this.ensureContext();

        const bufferSize = 4096;
        const whiteNoise = this.ctx.createScriptProcessor(bufferSize, 1, 1);

        whiteNoise.onaudioprocess = function (e) {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        };

        const gain = this.ctx.createGain();
        gain.gain.value = volume * 0.15; // Noise is loud

        // Lowpass filter to make it sound like rain (pink-ish)
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        this.rainNode = whiteNoise;
        this.rainGain = gain;
    }
}
