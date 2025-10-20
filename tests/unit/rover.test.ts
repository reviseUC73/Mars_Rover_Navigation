import { describe, it, expect, beforeEach } from "vitest";
import { Rover } from "../../src/modules/rover.js";
import { Grid } from "../../src/modules/grid.js";

describe("Rover", () => {
  let grid: Grid;

  beforeEach(() => {
    grid = new Grid(5, [[1, 2], [3, 3]]);
  });

  describe("constructor and initial state", () => {
    it("should start at position (0,0) facing North by default", () => {
      const rover = new Rover(grid);
      expect(rover.getPosition()).toEqual([0, 0]);
      expect(rover.getDirection()).toBe("N");
    });

    it("should accept custom starting position", () => {
      const rover = new Rover(grid, [2, 3], "E");
      expect(rover.getPosition()).toEqual([2, 3]);
      expect(rover.getDirection()).toBe("E");
    });
  });

  describe("turnLeft", () => {
    it("should turn from N to W", () => {
      const rover = new Rover(grid, [0, 0], "N");
      rover.turnLeft();
      expect(rover.getDirection()).toBe("W");
    });


    it("should turn from E to N", () => {
      const rover = new Rover(grid, [0, 0], "E");
      rover.turnLeft();
      expect(rover.getDirection()).toBe("N");
    });

    it("should complete full circle (4 left turns)", () => {
      const rover = new Rover(grid, [0, 0], "N");
      rover.turnLeft();
      rover.turnLeft();
      rover.turnLeft();
      rover.turnLeft();
      expect(rover.getDirection()).toBe("N");
    });

    it("should not change position when turning", () => {
      const rover = new Rover(grid, [2, 2], "N");
      rover.turnLeft();
      expect(rover.getPosition()).toEqual([2, 2]);
    });
  });

  describe("turnRight", () => {
    it("should turn from N to E", () => {
      const rover = new Rover(grid, [0, 0], "N");
      rover.turnRight();
      expect(rover.getDirection()).toBe("E");
    });


    it("should turn from W to N", () => {
      const rover = new Rover(grid, [0, 0], "W");
      rover.turnRight();
      expect(rover.getDirection()).toBe("N");
    });

    it("should complete full circle (4 right turns)", () => {
      const rover = new Rover(grid, [0, 0], "N");
      rover.turnRight();
      rover.turnRight();
      rover.turnRight();
      rover.turnRight();
      expect(rover.getDirection()).toBe("N");
    });

    it("should not change position when turning", () => {
      const rover = new Rover(grid, [2, 2], "N");
      rover.turnRight();
      expect(rover.getPosition()).toEqual([2, 2]);
    });
  });

  describe("move - successful movements", () => {
    it("should move north from (0,0) to (0,1)", () => {
      const rover = new Rover(grid, [0, 0], "N");
      const result = rover.move();
      expect(result).toBeUndefined();
      expect(rover.getPosition()).toEqual([0, 1]);
    });


    it("should move west from (2,0) to (1,0)", () => {
      const rover = new Rover(grid, [2, 0], "W");
      const result = rover.move();
      expect(result).toBeUndefined();
      expect(rover.getPosition()).toEqual([1, 0]);
    });

  });

  describe("move - obstacle detection", () => {
    it("should detect obstacle at (1,2) when moving north from (1,1)", () => {
      const rover = new Rover(grid, [1, 1], "N");
      const result = rover.move();
      expect(result).toBe("Obstacle encountered");
      expect(rover.getPosition()).toEqual([1, 1]);
    });


    it("should detect obstacle and not change position", () => {
      const rover = new Rover(grid, [0, 2], "E");
      const initialPos = rover.getPosition();
      rover.move();
      expect(rover.getPosition()).toEqual(initialPos);
    });
  });

  describe("edge cases", () => {
    it("should handle movement on 1x1 grid", () => {
      const smallGrid = new Grid(1, []);
      const rover = new Rover(smallGrid, [0, 0], "N");
      const result = rover.move();
      expect(result).toBe("Out of bounds");
      expect(rover.getPosition()).toEqual([0, 0]);
    });

    it("should handle rover at corner with multiple boundaries", () => {
      const rover = new Rover(grid, [4, 4], "N");
      expect(rover.move()).toBe("Out of bounds");
      rover.turnRight();
      expect(rover.move()).toBe("Out of bounds");
      expect(rover.getPosition()).toEqual([4, 4]);
    });

    it("should maintain direction after failed move", () => {
      const rover = new Rover(grid, [0, 0], "S");
      rover.move();
      expect(rover.getDirection()).toBe("S");
    });
  });
});