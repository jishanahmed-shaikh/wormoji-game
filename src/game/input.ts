import type { Cell } from './state';

const REDIRECT_THRESHOLD = 26;
const TAP_MAX_MOVE = 10;
const TAP_MAX_MS = 300;

export class Input {
  pendingDir: Cell | null = null;

  private active = false;
  private refX = 0;
  private refY = 0;
  private startX = 0;
  private startY = 0;
  private startT = 0;
  private tapFlag = false;

  down(x: number, y: number): void {
    this.active = true;
    this.refX = x;
    this.refY = y;
    this.startX = x;
    this.startY = y;
    this.startT = Date.now();
  }

  move(x: number, y: number): void {
    if (!this.active) return;
    const dx = x - this.refX;
    const dy = y - this.refY;
    if (Math.abs(dx) < REDIRECT_THRESHOLD && Math.abs(dy) < REDIRECT_THRESHOLD) return;
    this.pendingDir = Math.abs(dx) > Math.abs(dy) ? { x: dx > 0 ? 1 : -1, y: 0 } : { x: 0, y: dy > 0 ? 1 : -1 };
    this.refX = x;
    this.refY = y;
  }

  up(x: number, y: number): void {
    if (!this.active) return;
    const dx = x - this.startX;
    const dy = y - this.startY;
    const dt = Date.now() - this.startT;
    if (Math.abs(dx) < TAP_MAX_MOVE && Math.abs(dy) < TAP_MAX_MOVE && dt < TAP_MAX_MS) this.tapFlag = true;
    this.active = false;
  }

  consumePendingDir(): Cell | null {
    const d = this.pendingDir;
    this.pendingDir = null;
    return d;
  }

  consumeTap(): boolean {
    const t = this.tapFlag;
    this.tapFlag = false;
    return t;
  }
}
