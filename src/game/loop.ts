import type { Input } from './input';
import { isOpposite, restart, sameCell, spawnFood, tickIntervalS, type GameState } from './state';
import { collidesBody, inBounds, nextHead } from './physics';

export interface LoopHooks {
  onEat(): void;
  onGameOver(score: number): void;
}

const ATE_FACE_S = 0.4;

export function step(state: GameState, input: Input, dt: number, hooks: LoopHooks, rng: () => number = Math.random): void {
  if (state.phase === 'TITLE') {
    if (input.consumeTap()) restart(state, rng);
    return;
  }
  if (state.phase === 'GAME_OVER') {
    if (input.consumeTap()) restart(state, rng);
    return;
  }

  const pending = input.consumePendingDir();
  if (pending && !isOpposite(pending, state.dir)) state.dir = pending;

  if (state.ateTimer > 0) state.ateTimer = Math.max(0, state.ateTimer - dt);

  state.tickTimer += dt;
  const interval = tickIntervalS(state.score);
  if (state.tickTimer < interval) return;
  state.tickTimer -= interval;

  const head = state.snake[0]!;
  const next = nextHead(head, state.dir);
  const willEat = sameCell(next, state.food);

  if (!inBounds(next) || collidesBody(state.snake, next, willEat)) {
    state.phase = 'GAME_OVER';
    hooks.onGameOver(state.score);
    return;
  }

  state.snake.unshift(next);
  if (willEat) {
    state.score += 1;
    state.ateTimer = ATE_FACE_S;
    state.food = spawnFood(state.snake, rng);
    hooks.onEat();
  } else {
    state.snake.pop();
  }
}
