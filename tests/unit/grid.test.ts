import { describe, it, expect } from "vitest";
import { Grid } from "../../src/modules/grid.js";

describe("Grid", () => {
  describe("constructor", () => {
    it("should create grid with given size", () => {
      const grid = new Grid(5, []);
      expect(grid).toBeInstanceOf(Grid);
    });

    it("should create grid with obstacles", () => {
      const grid = new Grid(5, [[1, 2], [3, 3]]);
      expect(grid.hasObstacles([1, 2])).toBe(true);
      expect(grid.hasObstacles([3, 3])).toBe(true);
    });

    it("should handle empty obstacles array", () => {
      const grid = new Grid(5, []);
      expect(grid.hasObstacles([1, 2])).toBe(false);
    });

    it("should create minimal 1x1 grid", () => {
      const grid = new Grid(1, []);
      expect(grid.inBounds([0, 0])).toBe(true);
    });

    it("should create large grid", () => {
      const grid = new Grid(1000, []);
      expect(grid.inBounds([999, 999])).toBe(true);
    });
  });

  describe("inBounds", () => {
    const grid = new Grid(5, []);

    it("should return true for position at origin", () => {
      expect(grid.inBounds([0, 0])).toBe(true);
    });

    it("should return true for position at max bounds", () => {
      expect(grid.inBounds([4, 4])).toBe(true);
    });

    it("should return false for negative y", () => {
      expect(grid.inBounds([0, -1])).toBe(false);
    });

    it("should handle edge case at boundary", () => {
      const grid1x1 = new Grid(1, []);
      expect(grid1x1.inBounds([0, 0])).toBe(true);
      expect(grid1x1.inBounds([1, 0])).toBe(false);
      expect(grid1x1.inBounds([0, 1])).toBe(false);
    });
  });

  describe("hasObstacles", () => {
    const grid = new Grid(5, [[1, 2], [3, 3], [0, 4]]);

    it("should return true for existing obstacle", () => {
      expect(grid.hasObstacles([1, 2])).toBe(true);
    });

    it("should return true for all defined obstacles", () => {
      expect(grid.hasObstacles([1, 2])).toBe(true);
      expect(grid.hasObstacles([3, 3])).toBe(true);
      expect(grid.hasObstacles([0, 4])).toBe(true);
    });

    it("should return false for non-obstacle position", () => {
      expect(grid.hasObstacles([0, 0])).toBe(false);
    });


    it("should handle obstacle at origin", () => {
      const gridWithOriginObstacle = new Grid(5, [[0, 0]]);
      expect(gridWithOriginObstacle.hasObstacles([0, 0])).toBe(true);
    });

    it("should handle many obstacles", () => {
      const obstacles = Array.from({ length: 10 }, (_, i) => [i, i] as [number, number]);
      const denseGrid = new Grid(20, obstacles);
      expect(denseGrid.hasObstacles([5, 5])).toBe(true);
      expect(denseGrid.hasObstacles([5, 6])).toBe(false);
    });
  });
});