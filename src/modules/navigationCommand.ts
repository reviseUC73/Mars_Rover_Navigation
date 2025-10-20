import type { Rover } from "./rover.js";
import type { Commands, Result, RoverStatus } from "./type.js";
import { CommandFactory } from "./commandFactory.js";

//NavigationCommand class Orchestrates the execution of rover commands
export class NavigationCommand {
  // Execute a series of commands on the rover
  execute(rover: Rover, commands: Commands[]): Result {
    let status: RoverStatus = "Success";

    for (const command of commands) {
      // ใช้ Factory สร้าง Command strategy
      const commandStrategy = CommandFactory.createCommand(command);

      // Execute command
      const result = commandStrategy.execute(rover);

      // Check result and stop if failed
      if (result !== undefined) {
        status = result;
        break;
      }
    }

    return {
      final_position: rover.getPosition(),
      final_direction: rover.getDirection(),
      status: status,
    };
  }
}
