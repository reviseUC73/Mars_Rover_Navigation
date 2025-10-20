import { CommandParser } from "./modules/commandParser.js";
import { Grid } from "./modules/grid.js";
import { NavigationCommand } from "./modules/navigationCommand.js";
import { Rover } from "./modules/rover.js";
import type { Position, Result } from "./modules/type.js";

export function navigate_rover(
  grid_size: number,
  obstacles: Position[],
  commands: string
): Result {
  try {
    // 1. สร้าง Grid
    const grid = new Grid(grid_size, obstacles);

    // 2. สร้าง Rover
    const rover = new Rover(grid);

    // 3. Parse Commands
    const parsedCommands = CommandParser.parse(commands);

    // 4. สร้าง NavigationCommand และ execute
    const controller = new NavigationCommand();
    return controller.execute(rover, parsedCommands);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Navigation failed: ${error.message}`);
    }
    throw error;
  }
}

console.log("=".repeat(50));
console.log("Mars Rover Navigation System");
console.log("=".repeat(50));
console.log();


// Example 1: Successful Movement
console.log("Example 1: Successful Movement");
const result1 = navigate_rover(5,[[1, 2],[3, 3],],"MMMRML");
console.log(result1);
console.log();

// Example 2: Out of Bounds
console.log("Example 2: Out of Bounds");
const result2 = navigate_rover(5, [], "MMMMMMMM");
console.log(result2);
console.log();

// Example 3: Obstacle encountered
console.log("Example 3: Out of Bounds");
const result3 = navigate_rover(5,[[1, 2],[3, 3],],"MMRM");
console.log(result3)
console.log();
