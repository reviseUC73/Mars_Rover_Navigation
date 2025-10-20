import type { Commands } from "./type.js";

// Parses and validates command strings
export class CommandParser {
  private static readonly validCommands = new Set<string>(["L", "R", "M"]);

  //Parse a command string into an array of commands
  static parse(commandString: string): Commands[] {
    const commands: Commands[] = [];

    for (const char of commandString.toUpperCase()) {
      if (!this.validCommands.has(char)) {
        throw new Error(`Invalid command character: ${char}`);
      }
      commands.push(char as Commands);
    }
    return commands;
  }
}
