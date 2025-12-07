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
        if ((this as any).lfo) {
            try {
                (this as any).lfo.stop();
                (this as any).lfo.disconnect();
            } catch (e) { /* ignore already stopped */ }
            (this as any).lfo = null;
        }
    }

    playWhiteNoise(volume: number = 0.1) {
        this.stopAmbience();
        this.ensureContext();

        const bufferSize = 4096;
        const process = this.ctx.createScriptProcessor(bufferSize, 1, 1);

        process.onaudioprocess = function (e) {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        };

        this.startNoise(process, volume, 800); // Lowpass for general rain
    }

    playWind(volume: number = 0.1) {
        this.stopAmbience();
        this.ensureContext();

        // Pink Noise Generator
        const bufferSize = 4096;
        const process = this.ctx.createScriptProcessor(bufferSize, 1, 1);

        process.onaudioprocess = function (e) {
            const output = e.outputBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11;
                b6 = white * 0.115926;
            }
        };

        // Add LFO for modulation (Simulate gusts)
        const gain = this.ctx.createGain();
        gain.gain.value = volume * 0.15;

        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.2; // 0.2 Hz cycle

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.3; // Modulation depth

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();

        // Keep ref to stop later
        // Note: ensureContext handles single rainNode, we might need list if we have complex chain
        // simplified: just connect noise -> filter -> gain -> dest

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400; // Deep wind

        process.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        this.rainNode = process;
        this.rainGain = gain;
        // LFO not tracked for stop, it might leak. 
        // Improvement: track lfo to stop it.
        (this as any).lfo = lfo;
    }

    playBrownNoise(volume: number = 0.1) {
        this.stopAmbience();
        this.ensureContext();

        const bufferSize = 4096;
        const process = this.ctx.createScriptProcessor(bufferSize, 1, 1);

        process.onaudioprocess = function (e) {
            const output = e.outputBuffer.getChannelData(0);
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // Compensate for gain
            }
        };

        this.startNoise(process, volume, 400); // Lowpass for Forest/Nature deep
    }

    private startNoise(node: ScriptProcessorNode, volume: number, filterFreq: number) {
        const gain = this.ctx.createGain();
        gain.gain.value = volume * 0.15;

        let lastNode: AudioNode = node;

        if (filterFreq > 0) {
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = filterFreq;
            node.connect(filter);
            lastNode = filter;
        }

        lastNode.connect(gain);
        gain.connect(this.ctx.destination);

        this.rainNode = node;
        this.rainGain = gain;
    }
}
