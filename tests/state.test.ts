import { describe, expect, it } from 'vitest';
import { TICK_BASE_S, TICK_MIN_S, isOpposite, spawnFood, tickIntervalS } from '../src/game/state';

describe('tickIntervalS', () => {
  it('starts at the base interval and speeds up with score', () => {
    expect(tickIntervalS(0)).toBe(TICK_BASE_S);
    expect(tickIntervalS(5)).toBeLessThan(TICK_BASE_S);
  });

  it('floors at the minimum interval instead of speeding up forever', () => {
    expect(tickIntervalS(1000)).toBe(TICK_MIN_S);
  });
});

describe('isOpposite', () => {
  it('detects a direct reversal', () => {
    expect(isOpposite({ x: 1, y: 0 }, { x: -1, y: 0 })).toBe(true);
    expect(isOpposite({ x: 0, y: 1 }, { x: 0, y: -1 })).toBe(true);
  });

  it('does not flag a turn as a reversal', () => {
    expect(isOpposite({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(false);
  });
});

describe('spawnFood', () => {
  it('never spawns on top of the snake', () => {
    const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
    // A biased rng that would otherwise always land on (0,0) first.
    let calls = 0;
    const rng = () => (calls++ < 2 ? 0 : 0.5);
    const food = spawnFood(snake, rng);
    expect(snake.some((s) => s.x === food.x && s.y === food.y)).toBe(false);
  });
});
