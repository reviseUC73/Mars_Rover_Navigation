import { describe, it, expect, beforeEach } from "vitest";
import { NavigationCommand } from "../../src/modules/navigationCommand.js";
import { Rover } from "../../src/modules/rover.js";
import { Grid } from "../../src/modules/grid.js";

describe("NavigationCommand", () => {
  let grid: Grid;
  let controller: NavigationCommand;

  beforeEach(() => {
    grid = new Grid(5, [[1, 2], [3, 3]]);
    controller = new NavigationCommand();
  });

  describe("execute - successful navigation", () => {
    it("should execute single move command", () => {
      const rover = new Rover(grid, [0, 0], "N");
      const result = controller.execute(rover, ["M"]);
      
      expect(result).toEqual({
        final_position: [0, 1],
        final_direction: "N",
        status: "Success",
      });
    });

    it("should execute single turn command", () => {
      const rover = new Rover(grid, [0, 0], "N");
      const result = controller.execute(rover, ["L"]);
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "W",
        status: "Success",
      });
    });


    it("should execute only turn commands", () => {
      const rover = new Rover(grid, [0, 0], "N");
      const result = controller.execute(rover, ["R", "R", "R", "R"]);
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "N",
        status: "Success",
      });
    });
  });

  describe("execute - obstacle handling", () => {
    it("should stop at obstacle and return status", () => {
      const rover = new Rover(grid, [0, 0], "N");
      const result = controller.execute(rover, ["M", "M", "R", "M"]);
      
      expect(result).toEqual({
        final_position: [0, 2],
        final_direction: "E",
        status: "Obstacle encountered",
      });
    });


    it("should stop immediately when hitting obstacle", () => {
      const rover = new Rover(grid, [1, 1], "N");
      const result = controller.execute(rover, ["M", "R", "M"]);
      
      expect(result).toEqual({
        final_position: [1, 1],
        final_direction: "N",
        status: "Obstacle encountered",
      });
    });
  });

  describe("execute - boundary handling", () => {
    it("should stop at boundary and return status", () => {
      const rover = new Rover(grid, [0, 0], "S");
      const result = controller.execute(rover, ["M", "R", "M"]);
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "S",
        status: "Out of bounds",
      });
    });

    it("should not execute remaining commands after boundary", () => {
      const rover = new Rover(grid, [4, 4], "N");
      const result = controller.execute(rover, ["M", "L", "M", "M"]);
      
      expect(result).toEqual({
        final_position: [4, 4],
        final_direction: "N",
        status: "Out of bounds",
      });
    });
  });

  describe("execute - edge cases", () => {
    it("should work on minimal 1x1 grid", () => {
      const smallGrid = new Grid(1, []);
      const rover = new Rover(smallGrid, [0, 0], "N");
      const result = controller.execute(rover, ["R", "R"]);
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "S",
        status: "Success",
      });
    });

    it("should handle grid full of obstacles except start", () => {
      const obstacles: [number, number][] = [];
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          if (x !== 0 || y !== 0) {
            obstacles.push([x, y]);
          }
        }
      }
      const blockedGrid = new Grid(3, obstacles);
      const rover = new Rover(blockedGrid, [0, 0], "N");
      const result = controller.execute(rover, ["M", "R", "M", "R", "M"]);
      
      expect(result.status).toBe("Obstacle encountered");
      expect(result.final_position).toEqual([0, 0]);
    });

    it("should maintain rover state after execution", () => {
      const rover = new Rover(grid, [0, 0], "N");
      controller.execute(rover, ["M", "R", "M"]);
      
      expect(rover.getPosition()).toEqual([1, 1]);
      expect(rover.getDirection()).toBe("E");
    });
  });
});