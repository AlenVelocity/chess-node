import { EventEmitter } from 'events'
import Board from './Board'
import { Bishop, King, Knight, Pawn, Queen, Rook } from './Pieces'
import Player from './Player'
import Tile from './Tile'

// class to handle the game logic
export class Game {
    over = false
    ct = 0
    /**
     * constuctor for a game
     * @constructor
     * @param {Player} white The white player.
     * @param {Player} black The black player.
     * @param {Board} board The board for the game.
     * @param {EventEmitter} eventEmitter The event emitter for the game
     * @param {string} gameEventString the string used to identify what event to listen to.
     */
    constructor(
        public eventEmitter: EventEmitter,
        public gameEventString: string,
        public white: Player = new Player(true, 'White'),
        public black: Player = new Player(false, 'Black'),
        public board = new Board(8)
    ) {}

    static fromGame = (game: Game): Game => {
        const newGame = new Game(
            game.eventEmitter,
            game.gameEventString,
            Player.fromPlayer(game.white),
            Player.fromPlayer(game.black),
            Board.fromBoard(game.board)
        )

        const gameExtra = {
            over: game.over,
            ct: game.ct
        }
        return <Game>Object.assign(newGame, gameExtra)
    }

    /**
     * @param func referance to a function that prints information
     */
    start = (func: (move: string) => void, whitePlayer: string, blackPlayer: string): void => {
        if (!this.over) {
            let whiteTurn = true // variable to determine who's turn it is
            // prints the board to discord.
            func('White move' + this.board.printBoard(this.white, this.black))

            // starts the event emitter.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.eventEmitter.on(this.gameEventString, (move: any, myFunc: typeof func, author: string) => {
                if (whiteTurn && author == whitePlayer) {
                    // temp game for the purposes of calculating check
                    const tempGame = Game.fromGame(this)
                    console.log(move)
                    let isCheck = false
                    if (typeof move.piece != 'undefined') {
                        // checks to see if moving will put the king in check, if it does then it's an illegal move
                        if (tempGame.castle(move.piece, tempGame.white, tempGame.black)) {
                            if (tempGame.check(tempGame.white, tempGame.black, tempGame.board)) {
                                myFunc('illegal move')
                                isCheck = true
                            }
                        }
                    } else {
                        // checks to see if moving will put the king in check, if it does then it's an illegal move
                        if (tempGame.white.movePiece(move.from, move.to, tempGame.black, tempGame.board)) {
                            if (tempGame.check(tempGame.white, tempGame.black, tempGame.board)) {
                                myFunc('illegal move')
                                isCheck = true
                            }
                        }
                    }

                    // if the player isn't in check then proceed as normal
                    if (!isCheck) {
                        // tries to moves the piece, if it's false send message saying illegal move
                        let success
                        if (typeof move.piece != 'undefined') {
                            success = this.castle(move.piece, this.white, this.black)
                        } else {
                            success = this.white.movePiece(move.from, move.to, this.black, this.board)
                        }
                        if (!success) {
                            myFunc('illegal move')
                        } else {
                            // run the pawn promotion function on white.
                            this.promotePawn(this.white)
                            // updated board
                            myFunc('Black move' + this.board.printBoard(this.white, this.black))
                            // switch turn to black
                            whiteTurn = !success
                        }
                    }
                    // if the player is in check then send a message stating so
                    if (this.check(this.black, this.white, this.board)) {
                        myFunc('Black is now in check')
                    }
                } else if (!whiteTurn && author == blackPlayer) {
                    // temp game for the purposes of calculating check
                    const tempGame = Game.fromGame(this)
                    let isCheck = false

                    if (typeof move.piece != 'undefined') {
                        // checks to see if moving will put the king in check, if it does then it's an illegal move
                        if (tempGame.castle(move.piece, tempGame.black, tempGame.white)) {
                            if (tempGame.check(tempGame.black, tempGame.white, tempGame.board)) {
                                myFunc('illegal move')
                                isCheck = true
                            }
                        }
                    } else {
                        // checks to see if moving will put the king in check, if it does then it's an illegal move
                        if (tempGame.black.movePiece(move.from, move.to, tempGame.white, tempGame.board)) {
                            if (tempGame.check(tempGame.black, tempGame.white, tempGame.board)) {
                                myFunc('illegal move')
                                isCheck = true
                            }
                        }
                    }
                    // if the palyer isn't in check then proceed as normal
                    if (!isCheck) {
                        // tries to moves the piece, if it's false send message saying illegal move
                        let success
                        if (typeof move.piece != 'undefined') {
                            success = this.castle(move.piece, this.black, this.white)
                        } else {
                            success = this.black.movePiece(move.from, move.to, this.white, this.board)
                        }
                        if (!success) {
                            myFunc('illegal move')
                        } else {
                            // run the pawn promotion function on black.
                            this.promotePawn(this.black)

                            // update board
                            myFunc('White move' + this.board.printBoard(this.white, this.black))

                            // switch turn to white
                            whiteTurn = success
                        }
                    }
                    // if the player is in check then send a message stating so
                    if (this.check(this.white, this.black, this.board)) {
                        myFunc('White is now in check')
                    }
                } else {
                    myFunc('Not your turn')
                }

                // check to see if game is a stalemate, if so end game
                if (this.stalemate()) {
                    this.over = true
                    myFunc('Stalemate.')
                    this.eventEmitter.emit('gameOver')
                }

                // check to see if white player is in check mate, if so end game
                if (this.checkMate(this.white, this.black, this.board)) {
                    this.over = true
                    myFunc('White is in check mate, Black wins!!')
                    myFunc('over')
                    this.eventEmitter.emit('gameOver')
                } else if (this.checkMate(this.black, this.white, this.board)) {
                    // check to see if black  player is in check mate, if so end game
                    this.over = true
                    myFunc('Black is in check mate, White wins!!')
                    myFunc('over')
                    this.eventEmitter.emit('gameOver')
                }
            })
        }
    }

    /** Algorithm for determining check.
     * @returns {boolean} true if the current player is in check, false if not
     */
    public check(currentPlayer: Player, enemyPlayer: Player, board: Board): boolean {
        // loop through all of the tiles of the board.
        for (const tile of board.tiles) {
            const currPiece = enemyPlayer.getPieceByTile(tile)
            let moves: Array<Tile> = new Array<Tile>()
            if (currPiece != null) {
                if (currPiece instanceof Pawn) {
                    const piece = <Pawn>currPiece
                    moves = piece.generateMoves(enemyPlayer, currentPlayer, board)
                } else if (currPiece instanceof Rook) {
                    const piece = <Rook>currPiece
                    moves = piece.generateMoves(enemyPlayer, currentPlayer, board)
                } else if (currPiece instanceof Bishop) {
                    const piece = <Bishop>currPiece
                    moves = piece.generateMoves(enemyPlayer, currentPlayer, board)
                } else if (currPiece instanceof Knight) {
                    const piece = <Knight>currPiece
                    moves = piece.generateMoves(enemyPlayer, currentPlayer, board)
                } else if (currPiece instanceof Queen) {
                    const piece = <Queen>currPiece
                    moves = piece.generateMoves(enemyPlayer, currentPlayer, board)
                } else {
                    const piece = <King>currPiece
                    moves = piece.generateMoves(enemyPlayer, currentPlayer, board)
                }

                if (moves.length != 0) {
                    for (const move of moves) {
                        if (currentPlayer.king.tile.equals(move)) {
                            return true
                        }
                    }
                }
            }
        }

        return false
    }

    /** Algorithm for determining check mate.
     * @returns {boolean} true if the current player is in checkMate, false if not
     */
    public checkMate(currentPlayer: Player, enemyPlayer: Player, theBoard: Board): boolean {
        // checks to see if the player is in check
        if (this.check(currentPlayer, enemyPlayer, theBoard)) {
            let moves // variable for storing all of the moves that will be calculated.

            // checks to see if the queen is captured.
            if (!currentPlayer.queen.captured) {
                // generates the queens moves
                moves = currentPlayer.queen.generateMoves(currentPlayer, enemyPlayer, theBoard)

                // loops through all of the queens moves
                for (const tile of moves) {
                    // creates a deep copy of the current Player using the deep copy constructor from Player
                    const tempPlayer = Player.fromPlayer(currentPlayer)

                    // creates a deep copy of the enemy Player using the deep copy constructor from Player
                    const tempEPlayer = Player.fromPlayer(enemyPlayer)

                    // moves the queen of the tempPlayer
                    tempPlayer.movePiece(tempPlayer.queen.tile, tile, tempEPlayer, theBoard)

                    // return false if said moves gets the king out of check.
                    if (!this.check(tempPlayer, tempEPlayer, theBoard)) return false
                }
            }

            // generates the legal moves for the king
            moves = currentPlayer.king.generateMoves(currentPlayer, enemyPlayer, theBoard)

            // loops through all of the legal moves.
            for (const tile of moves) {
                // creates a temporary new player which is a deep copy for each player.
                const tempPlayer = Player.fromPlayer(currentPlayer)
                const tempEPlayer = Player.fromPlayer(enemyPlayer)
                // moves the peice
                tempPlayer.movePiece(tempPlayer.king.tile, tile, tempEPlayer, theBoard)

                // return false if said moves gets the king out of check.
                if (!this.check(tempPlayer, tempEPlayer, theBoard)) return false
            }

            // Same algorithm as the above two, but with the modification that we loop through each pawn,
            // and check to see if the pawns are captured before computing the moves
            for (const pawn of currentPlayer.pawns) {
                if (!pawn.captured) {
                    moves = pawn.generateMoves(currentPlayer, enemyPlayer, theBoard)
                    for (const tile of moves) {
                        const tempPlayer = Player.fromPlayer(currentPlayer)
                        const tempEPlayer = Player.fromPlayer(enemyPlayer)

                        tempPlayer.movePiece(pawn.tile, tile, tempEPlayer, theBoard)
                        if (!this.check(tempPlayer, tempEPlayer, theBoard)) return false
                    }
                }
            }

            // Same algorithm as the abov
            for (const rook of currentPlayer.rooks) {
                if (!rook.captured) {
                    moves = rook.generateMoves(currentPlayer, enemyPlayer, theBoard)
                    for (const tile of moves) {
                        const tempPlayer = Player.fromPlayer(currentPlayer)
                        const tempEPlayer = Player.fromPlayer(enemyPlayer)

                        tempPlayer.movePiece(rook.tile, tile, tempEPlayer, theBoard)
                        if (!this.check(tempPlayer, tempEPlayer, theBoard)) return false
                    }
                }
            }

            // Same algorithm as the above but for bishops
            for (const bishop of currentPlayer.bishops) {
                if (!bishop.captured) {
                    moves = bishop.generateMoves(currentPlayer, enemyPlayer, theBoard)
                    for (const tile of moves) {
                        const tempPlayer = Player.fromPlayer(currentPlayer)
                        const tempEPlayer = Player.fromPlayer(enemyPlayer)

                        tempPlayer.movePiece(bishop.tile, tile, tempEPlayer, theBoard)
                        if (!this.check(tempPlayer, tempEPlayer, theBoard)) return false
                    }
                }
            }

            // Same algorithm as the above but for knights.
            for (const knight of currentPlayer.knights) {
                if (!knight.captured) {
                    moves = knight.generateMoves(currentPlayer, enemyPlayer, theBoard)
                    for (const tile of moves) {
                        const tempPlayer = Player.fromPlayer(currentPlayer)
                        const tempEPlayer = Player.fromPlayer(enemyPlayer)

                        tempPlayer.movePiece(knight.tile, tile, tempEPlayer, theBoard)
                        if (!this.check(tempPlayer, tempEPlayer, theBoard)) return false
                    }
                }
            }

            return true
        }
        // return false because the king ins't even in check.
        return false
    }

    /**
     * @TODO Not implemented
     */
    stalemate = (): void | true => {
        if (this.white.ct + this.black.ct > 50) {
            return true
        }
    }

    /**
     * @TODO Not implemented
     * @param {Tile} tile
     * @param {Player} player
     * @param {Player} enemyPlayer
     */
    public castle(tile: Tile, player: Player, enemyPlayer: Player): boolean {
        if (!player.piecePresent(tile)) {
            return false
        }

        const rook = player.getPieceByTile(tile)
        if (!(rook instanceof Rook)) return false

        if (!(rook.hasMoved || player.king.hasMoved)) {
            if (rook.tile.x == 1) {
                if (player.isWhite) {
                    if (
                        !(
                            player.piecePresent(new Tile(2, 1)) ||
                            player.piecePresent(new Tile(3, 1)) ||
                            player.piecePresent(new Tile(4, 1)) ||
                            enemyPlayer.piecePresent(new Tile(2, 1)) ||
                            enemyPlayer.piecePresent(new Tile(3, 1)) ||
                            enemyPlayer.piecePresent(new Tile(4, 1))
                        )
                    ) {
                        rook.tile = new Tile(4, 1)
                        player.king.tile = new Tile(3, 1)
                        rook.hasMoved = true
                        player.king.hasMoved = true

                        return true
                    } else return false
                } else {
                    if (
                        !(
                            player.piecePresent(new Tile(2, 8)) ||
                            player.piecePresent(new Tile(3, 8)) ||
                            player.piecePresent(new Tile(4, 8)) ||
                            enemyPlayer.piecePresent(new Tile(2, 8)) ||
                            enemyPlayer.piecePresent(new Tile(3, 8)) ||
                            enemyPlayer.piecePresent(new Tile(4, 8))
                        )
                    ) {
                        rook.tile = new Tile(4, 8)
                        player.king.tile = new Tile(3, 8)
                        rook.hasMoved = true
                        player.king.hasMoved = true

                        return true
                    } else {
                        return false
                    }
                }
            } else {
                if (player.isWhite) {
                    if (
                        !(
                            player.piecePresent(new Tile(7, 1)) ||
                            player.piecePresent(new Tile(6, 1)) ||
                            enemyPlayer.piecePresent(new Tile(7, 1)) ||
                            enemyPlayer.piecePresent(new Tile(6, 1))
                        )
                    ) {
                        rook.tile = new Tile(6, 1)
                        player.king.tile = new Tile(7, 1)
                        rook.hasMoved = true
                        player.king.hasMoved = true
                        return true
                    } else {
                        return false
                    }
                } else {
                    if (
                        !(
                            player.piecePresent(new Tile(7, 8)) ||
                            player.piecePresent(new Tile(6, 8)) ||
                            enemyPlayer.piecePresent(new Tile(7, 8)) ||
                            enemyPlayer.piecePresent(new Tile(6, 8))
                        )
                    ) {
                        rook.tile = new Tile(6, 8)
                        player.king.tile = new Tile(7, 8)
                        rook.hasMoved = true
                        player.king.hasMoved = true

                        return true
                    } else {
                        return false
                    }
                }
            }
        } else {
            return false
        }
    }

    /**
     * Will promote pawn to a Queen
     * if the pawn is black, when the pawn reaches the top of the board.
     * if the pawn is white, when the pawn reaches the bottom of the board.
     * @param {Player} currentPlayer
     */
    public promotePawn(currentPlayer: Player): void {
        for (let i = 0; i < currentPlayer.pawns.length; i++) {
            if (!currentPlayer.pawns[i].captured) {
                if (currentPlayer.pawns[i].tile.y == 8 && currentPlayer.isWhite) {
                    currentPlayer.pawns[i].captured = true
                    currentPlayer.promotions.push(new Queen(currentPlayer.pawns[i].tile))
                } else if (currentPlayer.pawns[i].tile.y == 1 && !currentPlayer.isWhite) {
                    currentPlayer.pawns[i].captured = true
                    currentPlayer.promotions.push(new Queen(currentPlayer.pawns[i].tile))
                }
            }
        }
    }
}

export const genMove = (str: string): Tile | null => {
    let num1
    if (str.length > 2) {
        return null
    }
    str = str.toUpperCase()
    switch (str[0]) {
        case 'A':
            num1 = 1
            break
        case 'B':
            num1 = 2
            break
        case 'C':
            num1 = 3
            break
        case 'D':
            num1 = 4
            break
        case 'E':
            num1 = 5
            break
        case 'F':
            num1 = 6
            break
        case 'G':
            num1 = 7
            break
        case 'H':
            num1 = 8
            break
        default:
            num1 = null
    }

    const num2 = parseInt(str[1])

    if (typeof num2 === 'number' && typeof num1 === 'number' && num1 && num2) return new Tile(num2, num1)
    return null
}
