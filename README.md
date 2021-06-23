<div align="center">

# Chess-Node
> Event-Based chess Algorithm for NodeJS

</div>

## Installation

```SH
npm i chess-node
```

## Importing

Typescript

```TS
import * as chess from 'chess-node'
```
or
> Only import the Game Class
```TS
import Game from 'chess-node'
```

JavaScript w/ CommonJs
```JS 
const chess = require('chess-node')
```
or
> Only import the Game Class
```JS
const Game = require('chess-node').default
```
-----------------
### Buckle Up. Things are gonna get complex.

## Creating an Instance

The default export or the `Game` Class takes in 5 arguements while consturcting. 3 of them are optional. Let's go through all of them.

- EventEmitter
- gameEventString
- white
- black
- board

### 1. EventEmitter

It's an instance of the EventEmitter class from the [events](https://nodejs.org/api/events.html) module of NodeJS

Note: You should provide a fresh instance of the EventEmitter class

### 2. gameEventString

A unique string with which the `Game` class can listen to events emmited. We'll come back to this later

### 3, 4. White, Black

3rd and 4th Param is an instance of the `Player` Class. You can ignore these as the Game Class will create them for you.

### 5. Board

The `Board` class. You can Ignore this as well. Basically it's the chess board for the Game.


Construction Example:

```TS
import { EventEmitter } from 'events'
import Game from 'chess-node'

const game = new Game(new EventEmitter(), 'chess-game-1')

```

### **Fun Fact: Every Export is a Class.**
> This fact is not that fun now that I think about it. Well, Anyway.

## Starting The Game

Now that you have created a new instance of `Game`, you can now call methods inside it.

The method `start` starts a new game in the instance of the Game you just created.

`Game.start()` takes 4 arguements. 3 of them are required.

- func
- whitePlayer
- blackPlayer
- pre

### 1. func

This a function which prints the board each time a move occurs

### 2. whitePlayer 

The ID of the white player

### 3. blackPlayer

The ID of the black player

### 4. pre

A function which will execute right after the move has been made.

Example:

```TS
game.start((message) => {
    //This will print the board on to the console each time
    console.log(message)
}, 'cool_unique_id', 'cooler_unique_id', () => console.log(game.board.getPieces()))
```

### **Fun Fact: Every TypeScript user thinks they're gods. AND THEY'RE RIGHT!**

## Making A Move

Now we get to the fun part, Making a move. Step 1: Flir- oh wait, Wrong guide. Sorry about that. Where were we? Ah yes, Making a move IN THE GAME. 

To make a move, you have to emit an event in the eventEmitter object you passed in while consturcting

## Emiting

While emiting you need to pass 3 arguments.

- gameEventString
- move
- func
- playerString

### 1. gameEventString
The string you passed in while constructing.

### 2. move
The move you want to make.
It is an object which has 2 fields 
Those are `from` the current position of the piece and `to` the position to the piece move to.
```TS
interface Move = {
    to: Tile
    from: Tile
}
```
#### `genMove()`
The `genMove(): Tile | null` function takes in 1 argument and returns the the `Tile` object if it's a valid position.

### 3. func
Function to print the board

### 4. playerString

The ID of the player whose making the move.

Example: 
```TS
import { EventEmitter } from 'events'
import Game, { genMove } from 'chess-node'

const game = new Game(new EventEmitter(), 'chess-game-1')
game.start((message) => console.log, 'player_1', 'player_2')

// Moves from B1 to C1
const [from ,to] = [genMove('B1'), genMove('C1')]

// Only allow valid moves to get passed
if (!from || !to) return throw new Error('Invalid Move')

game.eventEmitter.emit('chess-game-1', move, (message) => console.log(message), 'player')
```
## Ending the Game

The eventEmitter will emit `gameOver` when the game ends.
and It'll also print the board and winner in the `func` parameter while the game ends
```TS
game.eventEmitter.emit('chess-game-1', move, (message) => console.log(message), 'player')
```

if the game ends, it'll log one of the following strings: 

- `<Colour_1> is in checkmate, <Colour_2> wins!`
- `Stalemate`

That's about it. Better docs comming soon, Hopefully. Now try it out. Have a great day!