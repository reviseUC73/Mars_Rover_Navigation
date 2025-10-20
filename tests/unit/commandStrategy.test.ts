import { describe, it, expect, beforeEach } from "vitest";
import {
  TurnLeftCommand,
  TurnRightCommand,
  MoveCommand,
} from "../../src/modules/commandStrategy.js";
import { Rover } from "../../src/modules/rover.js";
import { Grid } from "../../src/modules/grid.js";

describe("CommandStrategy", () => {
  let grid: Grid;

  beforeEach(() => {
    grid = new Grid(5, [[1, 2]]);
  });

  describe("TurnLeftCommand", () => {
    it("should turn rover left", () => {
      const rover = new Rover(grid, [0, 0], "N");
      const command = new TurnLeftCommand();
      command.execute(rover);
      expect(rover.getDirection()).toBe("W");
    });

    it("should not return any value", () => {
      const rover = new Rover(grid, [0, 0], "N");
      const command = new TurnLeftCommand();
      const result = command.execute(rover);
      expect(result).toBeUndefined();
    });

    it("should not change rover position", () => {
      const rover = new Rover(grid, [2, 3], "E");
      const command = new TurnLeftCommand();
      command.execute(rover);
      expect(rover.getPosition()).toEqual([2, 3]);
    });

    it("should work from any direction", () => {
      const directions = ["N", "E", "S", "W"] as const;
      const expected = ["W", "N", "E", "S"];
      
      directions.forEach((dir, i) => {
        const rover = new Rover(grid, [0, 0], dir);
        const command = new TurnLeftCommand();
        command.execute(rover);
        expect(rover.getDirection()).toBe(expected[i]);
      });
    });
  });

  describe("TurnRightCommand", () => {
    it("should turn rover right", () => {
      const rover = new Rover(grid, [0, 0], "N");
      const command = new TurnRightCommand();
      command.execute(rover);
      expect(rover.getDirection()).toBe("E");
    });

    it("should not return any value", () => {
      const rover = new Rover(grid, [0, 0], "N");
      const command = new TurnRightCommand();
      const result = command.execute(rover);
      expect(result).toBeUndefined();
    });

    it("should not change rover position", () => {
      const rover = new Rover(grid, [2, 3], "E");
      const command = new TurnRightCommand();
      command.execute(rover);
      expect(rover.getPosition()).toEqual([2, 3]);
    });

    it("should work from any direction", () => {
      const directions = ["N", "E", "S", "W"] as const;
      const expected = ["E", "S", "W", "N"];
      
      directions.forEach((dir, i) => {
        const rover = new Rover(grid, [0, 0], dir);
        const command = new TurnRightCommand();
        command.execute(rover);
        expect(rover.getDirection()).toBe(expected[i]);
      });
    });
  });

  describe("MoveCommand", () => {
    it("should move rover forward successfully", () => {
      const rover = new Rover(grid, [0, 0], "N");
      const command = new MoveCommand();
      const result = command.execute(rover);
      expect(result).toBeUndefined();
      expect(rover.getPosition()).toEqual([0, 1]);
    });

    it("should return 'Obstacle encountered' when hitting obstacle", () => {
      const rover = new Rover(grid, [1, 1], "N");
      const command = new MoveCommand();
      const result = command.execute(rover);
      expect(result).toBe("Obstacle encountered");
      expect(rover.getPosition()).toEqual([1, 1]);
    });

    it("should return 'Out of bounds' when hitting boundary", () => {
      const rover = new Rover(grid, [0, 0], "S");
      const command = new MoveCommand();
      const result = command.execute(rover);
      expect(result).toBe("Out of bounds");
      expect(rover.getPosition()).toEqual([0, 0]);
    });


    it("should not change direction after move", () => {
      const rover = new Rover(grid, [0, 0], "E");
      const command = new MoveCommand();
      command.execute(rover);
      expect(rover.getDirection()).toBe("E");
    });
  });

  describe("Command chaining", () => {
    it("should execute multiple commands in sequence", () => {
      const rover = new Rover(grid, [0, 0], "N");
      
      new MoveCommand().execute(rover);
      expect(rover.getPosition()).toEqual([0, 1]);
      
      new TurnRightCommand().execute(rover);
      expect(rover.getDirection()).toBe("E");
      
      new MoveCommand().execute(rover);
      expect(rover.getPosition()).toEqual([1, 1]);
    });

    it("should handle failed move in chain", () => {
      const rover = new Rover(grid, [1, 1], "N");
      
      const result1 = new MoveCommand().execute(rover);
      expect(result1).toBe("Obstacle encountered");
      expect(rover.getPosition()).toEqual([1, 1]);
      
      new TurnRightCommand().execute(rover);
      const result2 = new MoveCommand().execute(rover);
      expect(result2).toBeUndefined();
      expect(rover.getPosition()).toEqual([2, 1]);
    });
  });
});