import type { Directions, Position, RoverStatus } from "./type.js";
import type { Grid } from "./grid.js";

// Handles position, direction, and movement logic on grid
export class Rover {
  private currentPositon: Position;
  private currentDirection: Directions;
  private grid: Grid;
  private readonly leftDirectionMap: Record<Directions, Directions> = {
    N: "W",
    W: "S",
    S: "E",
    E: "N",
  };
  private readonly rightDirectionMap: Record<Directions, Directions> = {
    N: "E",
    W: "N",
    S: "W",
    E: "S",
  };
  constructor(
    currentPositon: Position = [0, 0],
    currentDirection: Directions = "N",
    grid: Grid
  ) {
    this.currentDirection = currentDirection;
    this.currentPositon = currentPositon;
    this.grid = grid;
  }

  getPositon(): Position {
    return this.currentPositon;
  }

  getDirection(): Directions {
    return this.currentDirection;
  }

  turnLeft(): void{
    this.currentDirection = this.leftDirectionMap[this.currentDirection];
  }

  turnRight(): void {
    this.currentDirection = this.rightDirectionMap[this.currentDirection];
  }

  move(): void | RoverStatus {
    const nextPosition = this.movePostion(this.currentPositon,this.currentDirection)

    if(this.grid.hasObstacles(nextPosition)){
        return "Obstacle encountered"
    }
    else if(!this.grid.inBounds(nextPosition)){
        return "Out of bounds"
    }
    this.currentPositon = nextPosition
  }

  private movePostion(position: Position, direction: Directions): Position {
    const [x, y] = position;
    const [dx, dy] = this.toDirection(direction);
    return [x + dx, y + dy];
  }

  private toDirection(targetDirection: Directions): Position {
    switch (targetDirection) {
      case "N":
        return [0, 1];
      case "E":
        return [1, 0];
      case "S":
        return [0, -1];
      case "W":
        return [-1, 0];
    }
  }
}
