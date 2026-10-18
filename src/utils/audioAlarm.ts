// Web Audio API Synthesizer for instant B2B distributor incoming order alarm

class OrderSoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a loud, distinctive two-tone industrial B2B dispatch alarm
   */
  public playNewOrderAlarm() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Play 3 successive pulses
      const pulses = [0, 0.28, 0.56];

      pulses.forEach((startTime) => {
        if (!this.ctx) return;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now + startTime); // A5
        osc1.frequency.exponentialRampToValueAtTime(1174.66, now + startTime + 0.15); // D6

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(440, now + startTime);
        osc2.frequency.exponentialRampToValueAtTime(587.33, now + startTime + 0.15);

        gainNode.gain.setValueAtTime(0, now + startTime);
        gainNode.gain.linearRampToValueAtTime(0.65, now + startTime + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + startTime + 0.24);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc1.start(now + startTime);
        osc2.start(now + startTime);
        osc1.stop(now + startTime + 0.25);
        osc2.stop(now + startTime + 0.25);
      });
    } catch (e) {
      console.warn('Audio alarm could not play:', e);
    }
  }

  /**
   * Play gentle order placed confirmation sound for retailer
   */
  public playSuccessChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Success sound could not play:', e);
    }
  }
}

export const soundManager = new OrderSoundManager();
