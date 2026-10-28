import { BOARD_H, BOARD_W, CELL, type GameState } from '../game/state';

const bgImg = new Image();
let bgReady = false;
bgImg.onload = () => { bgReady = true; };
bgImg.src = 'assets/bg.jpg';

function drawBackdrop(ctx: CanvasRenderingContext2D): void {
  if (bgReady) {
    ctx.drawImage(bgImg, 0, 0, BOARD_W, BOARD_H);
  } else {
    ctx.fillStyle = '#0a0a1f';
    ctx.fillRect(0, 0, BOARD_W, BOARD_H);
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawGrid(ctx: CanvasRenderingContext2D): void {
  drawBackdrop(ctx);
}

function headFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: { x: number; y: number }, yum: boolean): void {
  ctx.fillStyle = '#0a0a1f';
  const ahead = { x: dir.x * CELL * 0.22, y: dir.y * CELL * 0.22 };
  const side = { x: -dir.y * CELL * 0.18, y: dir.x * CELL * 0.18 };
  const r = CELL * 0.08;
  for (const s of [1, -1]) {
    ctx.beginPath();
    ctx.arc(cx + ahead.x + side.x * s, cy + ahead.y + side.y * s, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  if (yum) {
    ctx.arc(cx + dir.x * CELL * 0.3, cy + dir.y * CELL * 0.3, CELL * 0.1, 0, Math.PI * 2);
  } else {
    const mx = cx + dir.x * CELL * 0.3;
    const my = cy + dir.y * CELL * 0.3;
    ctx.arc(mx, my, CELL * 0.12, 0, Math.PI * 2);
  }
  ctx.fill();
}

export function drawSnake(ctx: CanvasRenderingContext2D, state: GameState): void {
  const n = state.snake.length;
  for (let i = n - 1; i >= 0; i--) {
    const seg = state.snake[i]!;
    const t = i / Math.max(1, n - 1);
    const cx = seg.x * CELL + CELL / 2;
    const cy = seg.y * CELL + CELL / 2;
    const hue = 150 - t * 30; // bright green head fading toward teal tail
    ctx.fillStyle = `hsl(${hue}, 85%, ${58 - t * 18}%)`;
    if (i === 0) {
      ctx.shadowColor = 'rgba(57,255,143,0.65)';
      ctx.shadowBlur = 18;
    } else {
      ctx.shadowBlur = 0;
    }
    roundRect(ctx, cx - CELL * 0.46, cy - CELL * 0.46, CELL * 0.92, CELL * 0.92, CELL * 0.3);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  const head = state.snake[0]!;
  headFace(ctx, head.x * CELL + CELL / 2, head.y * CELL + CELL / 2, state.dir, state.ateTimer > 0);
}

export function drawFood(ctx: CanvasRenderingContext2D, state: GameState, pulseT: number): void {
  const cx = state.food.x * CELL + CELL / 2;
  const cy = state.food.y * CELL + CELL / 2;
  const pulse = 1 + Math.sin(pulseT * 6) * 0.1;
  ctx.shadowColor = 'rgba(255,61,241,0.8)';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#ff3df1';
  ctx.beginPath();
  ctx.arc(cx, cy, CELL * 0.38 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(10,10,31,0.85)';
  ctx.beginPath();
  ctx.arc(cx - CELL * 0.1, cy - CELL * 0.05, CELL * 0.05, 0, Math.PI * 2);
  ctx.arc(cx + CELL * 0.1, cy - CELL * 0.05, CELL * 0.05, 0, Math.PI * 2);
  ctx.fill();
}

export function drawHud(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f2f6ff';
  ctx.font = '800 48px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.shadowColor = 'rgba(57,255,143,0.5)';
  ctx.shadowBlur = 14;
  ctx.fillText(`${state.score}`, BOARD_W / 2, 70);
  ctx.shadowBlur = 0;
}

function pillButton(ctx: CanvasRenderingContext2D, cx: number, cy: number, text: string): void {
  ctx.font = '700 26px system-ui, -apple-system, Segoe UI, sans-serif';
  const w = ctx.measureText(text).width + 64;
  ctx.save();
  ctx.shadowColor = 'rgba(57,255,143,0.5)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#39ff8f';
  roundRect(ctx, cx - w / 2, cy - 32, w, 64, 32);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#071308';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy + 2);
  ctx.textBaseline = 'alphabetic';
}

export function drawAvatarBadge(ctx: CanvasRenderingContext2D, avatar: HTMLImageElement | null): void {
  if (!avatar) return;
  const r = 34;
  const cx = 70;
  const cy = 70;
  ctx.save();
  ctx.shadowColor = 'rgba(57,255,143,0.5)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
  ctx.strokeStyle = '#39ff8f';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avatar, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

export function drawTitle(ctx: CanvasRenderingContext2D, pulseT: number): void {
  drawBackdrop(ctx);
  const cx = BOARD_W / 2;

  const segs = [[-1, 1], [0, 1], [1, 0], [1, -1]];
  ctx.shadowColor = 'rgba(57,255,143,0.6)';
  ctx.shadowBlur = 16;
  segs.forEach(([ox, oy], i) => {
    const t = i / (segs.length - 1);
    ctx.fillStyle = `hsl(${150 - t * 30}, 85%, ${58 - t * 18}%)`;
    roundRect(ctx, cx + ox! * 42 - 18, 420 + oy! * 42 - 18, 36, 36, 12);
    ctx.fill();
  });
  ctx.shadowBlur = 0;

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f2f6ff';
  ctx.shadowColor = 'rgba(57,255,143,0.45)';
  ctx.shadowBlur = 24;
  ctx.font = '800 60px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillText('WORMOJI', cx, 560);
  ctx.shadowBlur = 0;
  ctx.font = '500 20px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillStyle = 'rgba(242,246,255,0.75)';
  ctx.fillText('drag to steer · eat the glow', cx, 598);

  const pulse = 1 + Math.sin(pulseT * 4) * 0.06;
  ctx.save();
  ctx.translate(cx, 680);
  ctx.scale(pulse, pulse);
  pillButton(ctx, 0, 0, 'TAP TO START');
  ctx.restore();
}

export function drawGameOver(ctx: CanvasRenderingContext2D, state: GameState, best: number): void {
  ctx.fillStyle = 'rgba(6,6,16,0.8)';
  ctx.fillRect(0, 0, BOARD_W, BOARD_H);
  const cx = BOARD_W / 2;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f2f6ff';
  ctx.font = '800 48px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillText('GAME OVER', cx, BOARD_H / 2 - 120);
  ctx.font = '700 40px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillText(`${state.score}`, cx, BOARD_H / 2 - 56);
  ctx.font = '500 18px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillStyle = 'rgba(242,246,255,0.75)';
  ctx.fillText(state.score > best ? 'new best!' : `best: ${best}`, cx, BOARD_H / 2 - 24);
  ctx.font = '600 16px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillStyle = 'rgba(242,246,255,0.6)';
  ctx.fillText('view leaderboard', cx, BOARD_H / 2 + 8);
  pillButton(ctx, cx, BOARD_H / 2 + 90, 'TAP TO RETRY');
}

export const LEADERBOARD_HIT = { x: BOARD_W / 2 - 90, y: BOARD_H / 2 - 10, w: 180, h: 30 };
