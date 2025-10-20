import { describe, it, expect } from "vitest";
import { CommandFactory } from "../../src/modules/commandFactory.js";
import {
  TurnLeftCommand,
  TurnRightCommand,
  MoveCommand,
} from "../../src/modules/commandStrategy.js";

describe("CommandFactory", () => {
  describe("static createCommand", () => {
    it("should create TurnLeftCommand for L", () => {
      const command = CommandFactory.createCommand("L");
      expect(command).toBeInstanceOf(TurnLeftCommand);
    });

    it("should create TurnRightCommand for R", () => {
      const command = CommandFactory.createCommand("R");
      expect(command).toBeInstanceOf(TurnRightCommand);
    });

    it("should create MoveCommand for M", () => {
      const command = CommandFactory.createCommand("M");
      expect(command).toBeInstanceOf(MoveCommand);
    });

    it("should throw error for unknown command", () => {
      // @ts-expect-error Testing invalid input
      expect(() => CommandFactory.createCommand("X")).toThrow(
        "Unknown command: X"
      );
    });

    it("should create different instances for each call", () => {
      const command1 = CommandFactory.createCommand("L");
      const command2 = CommandFactory.createCommand("L");
      expect(command1).not.toBe(command2);
    });
  });

  describe("instance createCommand", () => {
    it("should create command using instance method", () => {
      const factory = new CommandFactory();
      const command = factory.createCommand("L");
      expect(command).toBeInstanceOf(TurnLeftCommand);
    });

    it("should work the same as static method", () => {
      const factory = new CommandFactory();
      const staticCommand = CommandFactory.createCommand("M");
      const instanceCommand = factory.createCommand("M");
      expect(instanceCommand).toBeInstanceOf(MoveCommand);
      expect(staticCommand).toBeInstanceOf(MoveCommand);
    });
  });
});