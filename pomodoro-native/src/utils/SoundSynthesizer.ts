import { Platform } from 'react-native';

// Utility to generate sounds using Web Audio API on Web
// On Native, this class does nothing (AudioContext handles it via expo-av)

export class SoundSynthesizer {
    private ctx: any; // AudioContext type strictly available only on DOM lib, using any for RN compat

    constructor() {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
    }

    private ensureContext() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(frequency: number, type: any, duration: number, volume: number = 0.5) {
        if (!this.ctx) return;

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
        if (!this.ctx) return;

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
    private rainNode: any = null; // ScriptProcessorNode
    private rainGain: any = null; // GainNode

    stopAmbience() {
        if (!this.ctx) return;

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
        if (!this.ctx) return;

        this.stopAmbience();
        this.ensureContext();

        const bufferSize = 4096;
        const whiteNoise = this.ctx.createScriptProcessor(bufferSize, 1, 1);

        whiteNoise.onaudioprocess = function (e: any) {
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
