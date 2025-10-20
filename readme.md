# ✨  Mars Rover Navigation System

A robust TypeScript implementation for controlling a Mars Rover navigating a 2D grid with obstacle avoidance and boundary detection using multiple design patterns.

## 🧱 Project Description

This project implements a navigation system for a Mars Rover operating on a 2D grid. The rover can move forward, rotate left or right, detect and avoid obstacles, and prevent movement beyond grid boundaries.

**Programming Language:** TypeScript 5.0+

### 🛠 Problem Statement

The system controls a Mars Rover on an NxN grid where:
- The rover starts at position (0, 0) facing North
- The rover can execute three commands: L (turn left), R (turn right), M (move forward)
- The rover must avoid obstacles and stay within grid boundaries
- Navigation stops immediately upon encountering an obstacle or boundary

### 📦 Solution Implemented

The solution uses **three design patterns** working together:
1. **Factory Pattern** - Creates command strategy instances
2. **Strategy Pattern** - Encapsulates command execution logic
3. **Command Pattern** - Orchestrates navigation and manages state

### 🧱 Design Goals

* **Separation of concerns**: parsing, command creation, executing, and rover state are decoupled.
* **Open/Closed**: add new commands by introducing a new `CommandStrategy` and wiring it in the `CommandFactory`.
* **Deterministic & pure**: business rules live in small, easily tested units.

## 📚 Table of Contents
- [🧱 Project Description](#-project-description)
- [🛠 Problem Statement](#-problem-statement)
- [📦 Solution Implemented](#-solution-implemented)
- [🧱 Design Goals](#-design-Goals)
- [📁 Project Structure](#project-structure)
- [🎨 Design Patterns](#design-patterns)
  - [🏭 Factory Pattern](#-factory-pattern)
  - [🎯 Strategy Pattern](#-strategy-pattern)
  - [📋 Command Pattern](#-command-pattern)
- [🧭 Flowchart](#-flowchart)
- [🏗 Architecture Flow](#architecture-flow)
- [✨ Features](#features)
- [⚙️ Installation Instructions](#installation-instructions)
- [🚀 Usage Instructions](#usage-instructions)
- [🧩 Types & Coordinate System](#-types--coordinate-system)
- [✅ Testing Instructions](#-testing-instructions)
- [💡 Code Examples](#code-examples)
- [🔑 Key Components](#-key-components)
- [🚫 Error Handling](#error-handling)
- [🧾 Additional Notes](#additional-notes)
  - [Assumptions](#assumptions)
  - [Known Limitations](#known-limitations)
  - [Future Enhancements](#future-enhancements)
  - [Optional Features Implemented (Beyond Requirements)](#optional-features-implemented-beyond-requirements)
  - [Performance Considerations](#performance-considerations)
- [🧰 NPM Scripts](#npm-scripts)
- [📦 Dependencies](#dependencies)
- [⚖️ License](#license)
- [🤝 Contributing](#contributing)

## Project Structure

```
Mars_Rover_Navigation/
├── src/
│   ├── main.ts                      # Entry point & navigate_rover function
│   └── modules/
│       ├── type.ts                  # TypeScript type definitions
│       ├── grid.ts                  # Grid class (terrain management)
│       ├── rover.ts                 # Rover class (state & movement)
│       ├── commandStrategy.ts       # Strategy Pattern implementation
│       ├── commandFactory.ts        # Factory Pattern implementation
│       ├── commandParser.ts         # Command validation & parsing
│       └── navigationCommand.ts     # Command Pattern implementation
│
├── tests/
│   ├── unit/                        # Unit tests for each module
│   │   ├── grid.test.ts
│   │   ├── rover.test.ts
│   │   ├── commandStrategy.test.ts
│   │   ├── commandFactory.test.ts
│   │   ├── commandParser.test.ts
│   │   └── navigationCommand.test.ts
│   └── integration/
│       └── navigation.test.ts       # End-to-end integration tests
│
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.base.json               # Shared base TypeScript config
├── tsconfig.test.json               # Test-specific TypeScript config
├── pnpm-lock.yaml                   # Lockfile for deterministic installs (pnpm)
└── README.md                        # This file

```
## Design Patterns

### 🏭 Factory Pattern
**Location:** `src/modules/commandFactory.ts`

Creates appropriate command strategy objects based on command type.

```typescript
// Factory creates the right strategy for each command
CommandFactory.createCommand('L') → TurnLeftCommand
CommandFactory.createCommand('R') → TurnRightCommand
CommandFactory.createCommand('M') → MoveCommand
```

**Benefits:**
- Centralizes object creation logic
- Easy to extend with new commands
- Decouples command creation from usage

### 🎯 Strategy Pattern
**Location:** `src/modules/commandStrategy.ts`

Encapsulates each command's execution logic in separate strategy classes.

```typescript
interface CommandStrategy {
  execute(rover: Rover): void | RoverStatus;
}

// Concrete strategies
TurnLeftCommand  → Rotates rover 90° counter-clockwise
TurnRightCommand → Rotates rover 90° clockwise
MoveCommand      → Moves rover forward one unit
```

**Benefits:**
- Separates command algorithms
- Easy to add new commands without modifying existing code
- Each strategy is independently testable

### 📋 Command Pattern
**Location:** `src/modules/navigationCommand.ts`

The `NavigationCommand` class acts as the invoker that:
- Receives command sequences
- Uses Factory to create strategies
- Executes strategies on the rover
- Manages navigation state and status

```typescript
// Command Pattern orchestrates everything
NavigationCommand.execute(rover, commands)
    ↓
For each command:
    Factory creates Strategy → Strategy executes → Check result
    ↓
Return final navigation result
```

**Benefits:**
- Orchestrates the entire navigation flow
- Manages success/failure states
- Stops execution on errors
- Provides final navigation result

## Design Pattern Implementation Details

### 1. Factory Pattern Usage

The `CommandFactory` creates strategy instances:

```typescript
export class CommandFactory {
  static createCommand(command: Commands): CommandStrategy {
    switch (command) {
      case "L": return new TurnLeftCommand();
      case "R": return new TurnRightCommand();
      case "M": return new MoveCommand();
      default: throw new Error(`Unknown command: ${command}`);
    }
  }
}
```

### 2. Strategy Pattern Usage

Each command implements the `CommandStrategy` interface:

```typescript
export interface CommandStrategy {
  execute(rover: Rover): void | RoverStatus;
}

export class MoveCommand implements CommandStrategy {
  execute(rover: Rover): void | RoverStatus {
    return rover.move(); // Delegates to rover
  }
}
```

### 3. Command Pattern Usage

The `NavigationCommand` orchestrates execution:

```typescript
export class NavigationCommand {
  execute(rover: Rover, commands: Commands[]): Result {
    let status: RoverStatus = "Success";
    
    for (const command of commands) {
      // Use Factory to create Strategy
      const commandStrategy = CommandFactory.createCommand(command);
      
      // Execute Strategy
      const result = commandStrategy.execute(rover);
      
      // Handle result
      if (result !== undefined) {
        status = result;
        break; // Stop on error
      }
    }
    
    return {
      final_position: rover.getPosition(),
      final_direction: rover.getDirection(),
      status
    };
  }
}
```

## 🧭 Flowchart

```mermaid
flowchart TD
  A[Command string] -->|parse| B[CommandParser]
  B --> C[Commands[]]
  C --> D[NavigationCommand (Command Pattern)]
  D --> E{Factory}
  E --> F[TurnLeftCommand]
  E --> G[TurnRightCommand]
  E --> H[MoveCommand]
  F --> I[Rover]
  G --> I
  H --> I
  I -->|uses| J[Grid]
```

* **CommandParser**: validates and normalizes the command string to `Commands[]` (e.g., `"lMr" → ["L","M","R"]`).
* **CommandFactory**: maps a command token to a concrete strategy object.
* **CommandStrategy**: executes behavior on the `Rover` (turn left/right, move).
* **NavigationCommand**: orchestrates the list, stops on error status, returns `Result`.
* **Rover**: holds mutable state (position, direction) and knows how to move/turn within a **Grid**.
* **Grid**: bounds + obstacle map.

## Architecture Flow

```bash
navigate_rover(grid_size, obstacles, commands)
    │
    ├─> Create Grid (terrain + obstacles)
    ├─> Create Rover (position + direction)
    ├─> Parse commands string → ['L', 'M', 'R']
    │
    └─> NavigationCommand.execute(rover, commands) ← # Command Pattern
         │
         └─> For each command:
              │
              ├─> CommandFactory.createCommand(cmd) ← # Factory Pattern
              │    └─→ Returns Strategy instance
              │
              ├─> Strategy.execute(rover) ← # Strategy Pattern
              │    └─→ Executes command logic
              │
              └─> Check result (Success/Obstacle/Boundary)
                   └─> Stop if error, continue if success

Return: { final_position, final_direction, status }
```
1.  **Create Grid (terrain + obstacles)**
    -   Initialize the grid with specified dimensions.
    -   Place obstacles on the grid based on input data.
2.  **Create Rover (position + direction)**
    -   Instantiate a rover object with a starting position and facing
        direction.
3.  **Parse Commands**
    -   Convert the command string (e.g., `"LMRMM"`) into a list of
        discrete commands: `['L', 'M', 'R', 'M', 'M']`.

## Features

1. **Object-Oriented Design** with clean separation of concerns  
2. **Factory Pattern** for command creation  
3. **Strategy Pattern** for command execution  
4. **Command Pattern** for navigation orchestration  
5. **Type-safe** with TypeScript strict mode  
6. **Comprehensive Testing** with 100+ test cases using Vitest  
7. **Error Handling** for invalid inputs and edge cases  
6. **Modular Architecture** for easy maintenance and extension

## Installation Instructions

### Prerequisites
-   Node.js **>= 18** (ESM support)

-   pnpm **(recommended)** or npm/yarn

-   TypeScript / Vitest are installed as dev deps

### Steps

1. Clone the repository:
```bash
git clone https://github.com/reviseUC73/Mars_Rover_Navigation
cd Mars_Rover_Navigation
```

2. Install dependencies:
```bash
# with pnpm (recommended)
pnpm install

# or 
npm install
```

3. run the project:
```bash
npm run dev
```


## Usage Instructions

### Running the Program

Execute the main script:
```bash
npm start 
# or
npm run dev
```

### Using the `navigate_rover` Function

```typescript
import { navigate_rover } from './src/main.js';

// Example: Successful navigation
const result = navigate_rover(
  5,                          // Grid size (5x5)
  [[1, 2], [3, 3]],           // Obstacles at positions
  'MMMRML'                    // Commands string
);

console.log(result);
                              // Output:
                              // {
                              //   final_position: [1, 3],
                              //   final_direction: 'N',
                              //   status: 'Success'
                              // }
```

### Input Format

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `grid_size` | `number` | Size of the square grid (NxN) | `5` for 5x5 grid |
| `obstacles` | `Position[]` | Array of [x, y] obstacle coordinates | `[[1, 2], [3, 3]]` |
| `commands` | `string` | Command string (L/R/M) | `"LMLMLMLMM"` |


## 🧩 Types & Coordinate System

### Commands

| Command | Description |
|---------|-------------|
| `L` | Turn left (rotate 90° counter-clockwise) |
| `R` | Turn right (rotate 90° clockwise) |
| `M` | Move forward one unit in current direction |

### Directions

| Direction | Meaning |
|-----------|---------|
| `N` | North (positive Y) |
| `E` | East (positive X) |
| `S` | South (negative Y) |
| `W` | West (negative X) |

### Position
| Position | Meaning |
|-----------|---------|
| `X` | Position on `x` axis |
| `Y` | Position on `y` axis|
### Result


| Property | Type | Description |
| --- | --- | --- |
| `final_position` | `[number, number]` | The rover's ending coordinates. |
| `final_direction` | `"N" or "E" or "S" or "W"` | The rover's final facing direction. |
| `status` | `"Success" or "Obstacle encountered" or "Out of bounds"` | Indicates the simulation outcome. |
### Output Format

Returns an object with:
```typescript
{
  final_position: [x, y],           // Final coordinates
  final_direction: "N"|"E"|"S"|"W", // Final direction
  status: "Success" | "Obstacle encountered" | "Out of bounds"
}
```

## ✅ Testing Instructions

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Test Coverage

The project includes **100+ test cases** covering:

**Unit Tests:**
- Grid class (boundary and obstacle detection)
- Rover class (movement and rotation)
- CommandStrategy classes (all three commands)
- CommandFactory (command creation)
- CommandParser (validation and parsing)
- NavigationCommand (orchestration)

**Integration Tests:**
- Example scenarios from requirements
- Edge cases (1x1 grid, large grids, empty commands)
- Obstacle detection in all directions
- Invalid command handling
- Real-world navigation scenarios

### Expected Test Results

All tests should pass with output similar to:
```
✓ Integration Tests (29 tests)
✓ CommandFactory Tests (7 tests)
✓ CommandParser Tests (14 tests)
✓ CommandStrategy Tests (14 tests)
✓ Grid Tests (14 tests)
✓ NavigationCommand Tests (10 tests)
✓ Rover Tests (17 tests)

Test Files  7 passed (7)
Tests  167 passed (105)
```


## Code Examples

### Example 1: Successful Movement
```typescript
const result = navigate_rover(5, [[1, 2], [3, 3]], "MMMRML");
// Output: { final_position: [1, 3], final_direction: 'N', status: 'Success' }
```

### Example 2: Obstacle Encountered
```typescript
const result = navigate_rover(5, [[1, 2], [3, 3]], "MMRM");
// Output: { final_position: [0, 2], final_direction: 'E', status: 'Obstacle encountered' }
```

### Example 3: Out of Bounds
```typescript
const result = navigate_rover(5, [], "MMMMMMMM");
// Output: { final_position: [0, 4], final_direction: 'N', status: 'Out of bounds' }
```


## 🔑 Key Components

### Grid Class
- Manages grid size and boundaries
- Tracks obstacle positions
- Validates positions are within bounds
- Checks for obstacles at positions

### Rover Class
- Maintains current position and direction
- Handles rotation (left/right)
- Executes movement with collision detection
- Returns status for move operations

### Command Strategies
- **TurnLeftCommand**: Rotates rover 90° left
- **TurnRightCommand**: Rotates rover 90° right
- **MoveCommand**: Moves rover forward with validation

### CommandFactory
- Creates appropriate strategy based on command type
- Centralizes object creation
- Throws errors for invalid commands

### CommandParser
- Validates command strings
- Converts strings to command arrays
- Handles case-insensitive input
- Throws errors for invalid characters

### NavigationCommand
- Orchestrates navigation flow
- Uses Factory to create strategies
- Manages execution state
- Returns final navigation result

## Error Handling

The system handles various error conditions:

### Invalid Commands
```typescript
navigate_rover(5, [], "LMXR");
// Throws: "Navigation failed: Invalid command character: X"
```

### Invalid Grid Size
```typescript
navigate_rover(0, [], "LMR");
// Throws: "Navigation failed: Grid size must be at least 1"
```

### Obstacles and Boundaries
- Returns status in result object
- Stops command execution immediately
- Maintains rover position before error

## Additional Notes

### Assumptions
- Grid coordinates are zero-indexed (0 to size-1)
- Rover always starts at (0, 0) facing North
- program doesn’t care whether the commands are written in uppercase or lowercase
- Navigation stops on first obstacle/boundary encounter

### Known Limitations
- Grid size must be at least 1x1
- Single rover only (no multi-rover support)

### Future Enhancements
- Support for multiple rovers
- Diagonal movement capabilities
- Path planning algorithms (Dijkstra)
- Visualization of rover movement
- Save/load rover state
- Replay command history

### Optional Features Implemented (Beyond Requirements)
-  **Fast obstacle checks (O(1))** — Obstacles stored in a `Set` (`"x,y"`) for constant-time lookup.
- **Case-insensitive commands** — Accepts mixed-case inputs (e.g., `mmRmL`).
- **Clean, extensible architecture** — Factory + Strategy + Command patterns enable easy feature growth.
- **Robust Type Management** — Strong use of TypeScript types and interfaces (`Grid`, `Rover`, `Commands`, `Result`), ensuring compile-time safety, clear contracts, and easier refactoring.



### Performance Considerations

- Obstacles stored in Set for O(1) lookup
- Command strategies created on-demand
- Minimal memory footprint
- Efficient coordinate calculations


## NPM Scripts

```bash
npm start               # Run the main program
npm test                # Run all tests
npm run dev             # Run project on dev mode
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run build           # Compile TypeScript
```

## Dependencies

### Development Dependencies
- `typescript` - TypeScript compiler
- `vitest` - Testing framework
- `@types/node` - Node.js type definitions

## License

MIT

## Contributing

Contributions are welcome! Please ensure:
1. All tests pass
2. Code follows existing patterns
3. New features include tests
4. Documentation is updated

