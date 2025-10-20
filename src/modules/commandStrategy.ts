import type { Rover } from "./rover.js";
import type { RoverStatus } from "./type.js";

// Interface Strategy
export interface CommandStrategy {
  execute(rover: Rover): void | RoverStatus;
}

// Concrete Strategies
export class TurnLeftCommand implements CommandStrategy {
  execute(rover: Rover): void {
    rover.turnLeft();
  }
}

export class TurnRightCommand implements CommandStrategy {
  execute(rover: Rover): void {
    rover.turnRight();
  }
}
export class MoveCommand implements CommandStrategy {
  execute(rover: Rover): void | RoverStatus {
    return rover.move();
  }
}
