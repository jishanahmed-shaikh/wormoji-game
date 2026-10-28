import { COLS, ROWS, sameCell, type Cell } from './state';

export function inBounds(cell: Cell): boolean {
  return cell.x >= 0 && cell.x < COLS && cell.y >= 0 && cell.y < ROWS;
}

export function nextHead(head: Cell, dir: Cell): Cell {
  return { x: head.x + dir.x, y: head.y + dir.y };
}

/** Whether `cell` collides with the snake's body, given whether it's about to grow
 *  (a growing snake's tail doesn't vacate its cell this tick, so it still counts). */
export function collidesBody(snake: Cell[], cell: Cell, growing: boolean): boolean {
  const body = growing ? snake : snake.slice(0, -1);
  return body.some((s) => sameCell(s, cell));
}
