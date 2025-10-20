import type { Positon } from "./type.js";

export class Grid {
  private readonly size: number;
  private readonly obstacles: Set<string>;

  constructor(size: number, obstacles: Positon[]) {
    if (size < 1) {
      throw new Error("Grid size must be at least 1");
    }
    this.size = size;
    this.obstacles = new Set(
      obstacles.map((value) => `${value[0]},${value[1]}`)
    );
  }

  inBounds([x, y]: Positon): boolean {
    return x <= this.size && y <= this.size && x >= 0 && y >= 0;
  }

  hasObstacles([x, y]: Positon): boolean {
    const key = `${x},${y}`;
    return this.obstacles.has(key);
  }
}
