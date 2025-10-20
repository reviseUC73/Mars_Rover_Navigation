export type Commands = "L" | "R" | "M";
export type Directions = "N" | "E" | "S" | "W";
export type Position = [number, number];
export type RoverStatus = "Success" | "Obstacle encountered" | "Out of bounds";
export type Result = {
  final_position: Position;
  final_direction: Directions;
  status: RoverStatus;
};