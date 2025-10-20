import { describe, it, expect } from "vitest";
import { navigate_rover } from "../../src/main.js";

describe("Integration Tests - navigate_rover", () => {
  describe("Success cases", () => {
    it("should complete successful navigation - Test Case 1", () => {
      const result = navigate_rover(5, [[1, 2], [3, 3]], "MMMRML");
      
      expect(result).toEqual({
        final_position: [1, 3],
        final_direction: "N",
        status: "Success",
      });
    });

    it("should handle only turning commands", () => {
      const result = navigate_rover(5, [], "RRRRLLLL");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "N",
        status: "Success",
      });
    });


    it("should handle complex path with multiple turns", () => {
      const result = navigate_rover(10, [[5, 5]], "MMMMRMMMMRMMMMRMMMMR");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "N",
        status: "Success",
      });
    });

    it("should handle empty command string", () => {
      const result = navigate_rover(5, [[1, 2]], "");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "N",
        status: "Success",
      });
    });

    it("should navigate to edge of grid successfully", () => {
      const result = navigate_rover(5, [], "MMMM");
      
      expect(result).toEqual({
        final_position: [0, 4],
        final_direction: "N",
        status: "Success",
      });
    });
  });

  describe("Obstacle cases", () => {
    it("should stop at obstacle - Test Case 2", () => {
      const result = navigate_rover(5, [[1, 2], [3, 3]], "MMRM");
      
      expect(result).toEqual({
        final_position: [0, 2],
        final_direction: "E",
        status: "Obstacle encountered",
      });
    });

    it("should detect obstacle immediately in front", () => {
      const result = navigate_rover(5, [[0, 1]], "M");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "N",
        status: "Obstacle encountered",
      });
    });

    it("should stop before obstacle from east", () => {
      const result = navigate_rover(5, [[2, 0]], "RM");
      
      expect(result).toEqual({
        final_position: [1, 0],
        final_direction: "E",
        status: "Success",
      });
    });


    it("should not execute commands after hitting obstacle", () => {
      const result = navigate_rover(5, [[0, 1]], "MMMMM");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "N",
        status: "Obstacle encountered",
      });
    });

    it("should handle multiple obstacles in path", () => {
      const result = navigate_rover(5, [[1, 0], [0, 1]], "RM");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "E",
        status: "Obstacle encountered",
      });
    });
  });

  describe("Boundary cases", () => {
    it("should stop at north boundary", () => {
      const result = navigate_rover(5, [], "MMMMM");
      
      expect(result).toEqual({
        final_position: [0, 4],
        final_direction: "N",
        status: "Out of bounds",
      });
    });

    it("should stop at east boundary", () => {
      const result = navigate_rover(5, [], "RMMMMM");
      
      expect(result).toEqual({
        final_position: [4, 0],
        final_direction: "E",
        status: "Out of bounds",
      });
    });

    it("should stop at south boundary", () => {
      const result = navigate_rover(5, [], "RRM");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "S",
        status: "Out of bounds",
      });
    });

    it("should stop at west boundary", () => {
      const result = navigate_rover(5, [], "LM");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "W",
        status: "Out of bounds",
      });
    });

    it("should handle boundary at corner", () => {
      const result = navigate_rover(5, [], "MMMMRMMMM");
      
      expect(result).toEqual({
        final_position: [4, 4],
        final_direction: "E",
        status: "Success",
      });
    });
  });

  describe("Invalid commands", () => {
    it("should throw error for invalid command character", () => {
      expect(() => navigate_rover(5, [], "LMX")).toThrow(
        "Navigation failed: Invalid command character: X"
      );
    });

    it("should throw error for numeric characters", () => {
      expect(() => navigate_rover(5, [], "M1M")).toThrow(
        "Navigation failed: Invalid command character: 1"
      );
    });

    it("should throw error for special characters", () => {
      expect(() => navigate_rover(5, [], "L@R")).toThrow(
        "Navigation failed: Invalid command character: @"
      );
    });

    it("should throw error for space in commands", () => {
      expect(() => navigate_rover(5, [], "L M")).toThrow(
        "Navigation failed: Invalid command character:  "
      );
    });
  });

  describe("Edge cases", () => {
    it("should work on minimal 1x1 grid", () => {
      const result = navigate_rover(1, [], "RRRR");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "N",
        status: "Success",
      });
    });

    it("should handle 1x1 grid with any move command", () => {
      const result = navigate_rover(1, [], "M");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "N",
        status: "Out of bounds",
      });
    });

    it("should work on large grid", () => {
      const result = navigate_rover(100, [], "M".repeat(50));
      
      expect(result).toEqual({
        final_position: [0, 50],
        final_direction: "N",
        status: "Success",
      });
    });

    it("should handle grid with many obstacles", () => {
      const obstacles: [number, number][] = [];
      for (let i = 1; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          obstacles.push([i, j]);
        }
      }
      const result = navigate_rover(5, obstacles, "RMMMMM");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "E",
        status: "Obstacle encountered",
      });
    });

    it("should handle case-insensitive commands", () => {
      const result = navigate_rover(5, [], "mmRmL");
      
      expect(result).toEqual({
        final_position: [1, 2],
        final_direction: "N",
        status: "Success",
      });
    });

    it("should handle mixed case commands", () => {
      const result = navigate_rover(5, [], "MmRrLl");
      
      expect(result).toEqual({
        final_position: [0, 2],
        final_direction: "N",
        status: "Success",
      });
    });
  });

  describe("Real-world scenarios", () => {
    it("should navigate around obstacle to reach destination", () => {
      const result = navigate_rover(5, [[1, 0], [1, 1]], "RMLMMRM");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "E",
        status: "Obstacle encountered",
      });
    });

    it("should handle trapped rover (surrounded by obstacles)", () => {
      const obstacles: [number, number][] = [[0, 1], [1, 0]];
      const result = navigate_rover(5, obstacles, "MRM");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "N",
        status: "Obstacle encountered",
      });
    });

    it("should complete square path", () => {
      const result = navigate_rover(10, [], "MMRMMRMMRMM");
      
      expect(result).toEqual({
        final_position: [0, 0],
        final_direction: "W",
        status: "Success",
      });
    });

    it("should handle zigzag pattern", () => {
      const result = navigate_rover(10, [], "MRMLMRM");
      
      expect(result).toEqual({
        final_position: [2, 2],
        final_direction: "E",
        status: "Success",
      });
    });
  });
});