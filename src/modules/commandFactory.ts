import type { Commands } from "./type.js";
import {
  MoveCommand,
  TurnLeftCommand,
  TurnRightCommand,
  type CommandStrategy,
} from "./commandStrategy.js";

export class CommandFactory {
  // Call createCommand type static (easy)
  static createCommand(command: Commands): CommandStrategy {
    switch (command) {
      case "L":
        return new TurnLeftCommand();
      case "R":
        return new TurnRightCommand();
      case "M":
        return new MoveCommand();
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }

  // Call createCommand type instance
  createCommand(command: Commands): CommandStrategy {
    return CommandFactory.createCommand(command);
  }
}
