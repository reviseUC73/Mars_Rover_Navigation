import { describe, it, expect } from "vitest";
import { CommandParser } from "../../src/modules/commandParser.js";

describe("CommandParser", () => {
  describe("parse - valid commands", () => {
    it("should parse single command L", () => {
      const result = CommandParser.parse("L");
      expect(result).toEqual(["L"]);
    });

    it("should parse single command R", () => {
      const result = CommandParser.parse("R");
      expect(result).toEqual(["R"]);
    });

    it("should parse single command M", () => {
      const result = CommandParser.parse("M");
      expect(result).toEqual(["M"]);
    });

    it("should parse multiple commands", () => {
      const result = CommandParser.parse("LMLMLMLMM");
      expect(result).toEqual(["L", "M", "L", "M", "L", "M", "L", "M", "M"]);
    });

    it("should parse commands with mixed case", () => {
      const result = CommandParser.parse("lMrMm");
      expect(result).toEqual(["L", "M", "R", "M", "M"]);
    });

    it("should handle lowercase commands", () => {
      const result = CommandParser.parse("lrm");
      expect(result).toEqual(["L", "R", "M"]);
    });

    it("should handle empty string", () => {
      const result = CommandParser.parse("");
      expect(result).toEqual([]);
    });

    it("should parse long command strings", () => {
      const longCommand = "M".repeat(100);
      const result = CommandParser.parse(longCommand);
      expect(result).toHaveLength(100);
      expect(result.every((cmd) => cmd === "M")).toBe(true);
    });
  });

  describe("parse - invalid commands", () => {
    it("should throw error for invalid character", () => {
      expect(() => CommandParser.parse("X")).toThrow(
        "Invalid command character: X"
      );
    });

    it("should throw error for invalid character in sequence", () => {
      expect(() => CommandParser.parse("LMXR")).toThrow(
        "Invalid command character: X"
      );
    });

    it("should throw error for number", () => {
      expect(() => CommandParser.parse("L1M")).toThrow(
        "Invalid command character: 1"
      );
    });

    it("should throw error for special characters", () => {
      expect(() => CommandParser.parse("L@M")).toThrow(
        "Invalid command character: @"
      );
    });

    it("should throw error for space", () => {
      expect(() => CommandParser.parse("L M")).toThrow(
        "Invalid command character:  "
      );
    });

    it("should throw error for multiple invalid characters", () => {
      expect(() => CommandParser.parse("ABCD")).toThrow(
        "Invalid command character"
      );
    });
  });
});