import { describe, expect, it } from 'vitest';
import { collidesBody, inBounds, nextHead } from '../src/game/physics';
import { COLS, ROWS } from '../src/game/state';

describe('inBounds', () => {
  it('accepts cells within the grid', () => {
    expect(inBounds({ x: 0, y: 0 })).toBe(true);
    expect(inBounds({ x: COLS - 1, y: ROWS - 1 })).toBe(true);
  });

  it('rejects cells outside the grid on every edge', () => {
    expect(inBounds({ x: -1, y: 0 })).toBe(false);
    expect(inBounds({ x: COLS, y: 0 })).toBe(false);
    expect(inBounds({ x: 0, y: -1 })).toBe(false);
    expect(inBounds({ x: 0, y: ROWS })).toBe(false);
  });
});

describe('nextHead', () => {
  it('moves one cell in the given direction', () => {
    expect(nextHead({ x: 5, y: 5 }, { x: 1, y: 0 })).toEqual({ x: 6, y: 5 });
    expect(nextHead({ x: 5, y: 5 }, { x: 0, y: -1 })).toEqual({ x: 5, y: 4 });
  });
});

describe('collidesBody', () => {
  const snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 }];

  it('is a collision when the cell hits the middle of the body', () => {
    expect(collidesBody(snake, { x: 4, y: 5 }, false)).toBe(true);
  });

  it('is not a collision with the tail cell when not growing, since the tail vacates', () => {
    expect(collidesBody(snake, { x: 2, y: 5 }, false)).toBe(false);
  });

  it('is a collision with the tail cell when growing, since the tail stays put', () => {
    expect(collidesBody(snake, { x: 2, y: 5 }, true)).toBe(true);
  });

  it('is not a collision with an empty cell', () => {
    expect(collidesBody(snake, { x: 9, y: 9 }, false)).toBe(false);
  });
});
