export const COLS = 18;
export const ROWS = 32;
export const CELL = 40;
export const BOARD_W = COLS * CELL; // 720
export const BOARD_H = ROWS * CELL; // 1280
export const TICK_BASE_S = 0.15;
export const TICK_MIN_S = 0.075;
export const TICK_SHRINK_PER_FOOD = 0.004;

export interface Cell {
  x: number;
  y: number;
}

export type Phase = 'TITLE' | 'PLAYING' | 'GAME_OVER';

export interface GameState {
  phase: Phase;
  snake: Cell[];
  dir: Cell;
  food: Cell;
  score: number;
  tickTimer: number;
  ateTimer: number; // >0 for a brief moment right after eating, drives the head's "yum" face
}

export function tickIntervalS(score: number): number {
  return Math.max(TICK_MIN_S, TICK_BASE_S - score * TICK_SHRINK_PER_FOOD);
}

export function sameCell(a: Cell, b: Cell): boolean {
  return a.x === b.x && a.y === b.y;
}

export function isOpposite(a: Cell, b: Cell): boolean {
  return a.x === -b.x && a.y === -b.y;
}

export function spawnFood(snake: Cell[], rng: () => number): Cell {
  let cell: Cell;
  do {
    cell = { x: Math.floor(rng() * COLS), y: Math.floor(rng() * ROWS) };
  } while (snake.some((s) => sameCell(s, cell)));
  return cell;
}

function initialSnake(): Cell[] {
  const hx = Math.floor(COLS / 2);
  const hy = Math.floor(ROWS / 2);
  return [{ x: hx, y: hy }, { x: hx - 1, y: hy }, { x: hx - 2, y: hy }];
}

export function createGame(): GameState {
  const snake = initialSnake();
  return {
    phase: 'TITLE',
    snake,
    dir: { x: 1, y: 0 },
    food: spawnFood(snake, Math.random),
    score: 0,
    tickTimer: 0,
    ateTimer: 0,
  };
}

export function restart(state: GameState, rng: () => number = Math.random): void {
  state.snake = initialSnake();
  state.dir = { x: 1, y: 0 };
  state.food = spawnFood(state.snake, rng);
  state.score = 0;
  state.tickTimer = 0;
  state.ateTimer = 0;
  state.phase = 'PLAYING';
}
