export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export class TimerEngine {
    private startTime: number | null = null;
    private remainingTime: number;
    private duration: number;
    private timerId: number | null = null;
    private onTick: (remaining: number) => void;
    private onComplete: () => void;

    constructor(
        durationInSeconds: number,
        onTick: (remaining: number) => void,
        onComplete: () => void
    ) {
        this.duration = durationInSeconds * 1000;
        this.remainingTime = this.duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
    }

    public start() {
        if (this.timerId) return; // Already running

        this.startTime = Date.now();

        const loop = () => {
            if (!this.startTime) return;

            const now = Date.now();
            const elapsed = now - this.startTime;
            const currentRemaining = Math.max(0, this.remainingTime - elapsed);

            this.onTick(Math.ceil(currentRemaining / 1000));

            if (currentRemaining <= 0) {
                this.remainingTime = 0;
                this.stop();
                this.onComplete();
            } else {
                this.timerId = requestAnimationFrame(loop);
            }
        };

        this.timerId = requestAnimationFrame(loop);
    }

    public pause() {
        if (!this.timerId || !this.startTime) return;

        cancelAnimationFrame(this.timerId);
        this.timerId = null;

        // Calculate how much time passed before pausing and deduct it from remaining
        const elapsed = Date.now() - this.startTime;
        this.remainingTime = Math.max(0, this.remainingTime - elapsed);
        this.startTime = null;
    }

    public reset(newDurationInSeconds?: number) {
        this.stop();
        if (newDurationInSeconds) {
            this.duration = newDurationInSeconds * 1000;
        }
        this.remainingTime = this.duration;
        this.onTick(Math.ceil(this.remainingTime / 1000));
    }

    public stop() {
        if (this.timerId) {
            cancelAnimationFrame(this.timerId);
            this.timerId = null;
        }
        this.startTime = null;
    }

    public setDuration(seconds: number) {
        this.duration = seconds * 1000;
        if (!this.timerId) {
            this.remainingTime = this.duration;
            this.onTick(seconds);
        }
    }
}
