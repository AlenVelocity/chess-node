import Board from '../Board'
import { Direction, DirectionAngle } from '../Direction'
import Player from '../Player'
import Tile from '../Tile'

export class Piece {
    public tile: Tile
    public captured: boolean
    public isWhite: boolean
    public hasMoved: boolean

    /**
     * @param {Tile} tile this this.tile of the piece.
     * @param {boolean} captured the captured status of the peice.
     * @param {boolean} isWhite is the piece white or black.
     * @param {boolean} hasMoves has the piece moved or not.
     */
    constructor(tile: Tile, captured = false, isWhite = false, hasMoved = false) {
        this.tile = tile
        this.captured = captured
        this.isWhite = isWhite
        this.hasMoved = hasMoved
    }

    /**
     * Static method in turn of copy constructor.
     * @param {Piece} piece the peice to make a copy of.
     */
    static fromPiece = (piece: Piece): Piece =>
        new Piece(Tile.fromTile(piece.tile), piece.captured, piece.isWhite, piece.hasMoved)

    /**
     * Determine if a tiles peice is in the board
     * @param {Board} board the board of the peice
     */
    inBoard = (board: Board): boolean =>
        !(this.tile.x > board.getSize() || this.tile.y > board.getSize() || this.tile.x < 1 || this.tile.y < 1)

    /**
     * @param {Direction} dir the direction to generate moves in
     * @param {Player} currentPlayer The player who's legal moves this function will return.
     * @param {Player} enemyPlayer this player is required to calculate legal moves for the currentPlayer
     * @param {Board} board the board that the two players exist in.
     * @return {Tile[]} returns an array of legal moves.
     */
    genMovesLin = (dir: Direction, currentPlayer: Player, enemyPlayer: Player, board: Board): Tile[] => {
        const moves = new Array<Tile>()
        let limit: number
        let yMultiplier: number
        let xMultiplier: number

        switch (dir) {
            case Direction.Down:
                limit = board.getSize() - this.tile.y
                xMultiplier = 0
                yMultiplier = 1
                break
            case Direction.Up:
                limit = this.tile.y - 1
                xMultiplier = 0
                yMultiplier = -1
                break
            case Direction.Right:
                limit = board.getSize() - this.tile.x
                xMultiplier = 1
                yMultiplier = 0
                break
            default:
                limit = this.tile.x - 1
                xMultiplier = -1
                yMultiplier = 0
        }

        for (let i = 1; i <= limit; i++) {
            const tempTile = new Tile(this.tile.x + i * xMultiplier, this.tile.y + i * yMultiplier)

            if (enemyPlayer.piecePresent(tempTile)) {
                moves.push(tempTile)
                break
            } else if (currentPlayer.piecePresent(tempTile)) {
                break
            } else {
                moves.push(tempTile)
            }
        }
        return moves
    }

    /**
     * @param {DirectionAngle} dir the direction to generate moves in
     * @param {Player} currentPlayer The player who's legal moves this function will return.
     * @param {Player} enemyPlayer this player is required to calculate legal moves for the currentPlayer
     * @param {Board} board the board that the two players exist in.
     * @return {Array<Tile>} returns an array of legal moves.
     */
    genMovesAng = (dir: DirectionAngle, currentPlayer: Player, enemyPlayer: Player, board: Board): Tile[] => {
        const moves = new Array<Tile>()
        const limit: number = board.getSize()
        let yMultiplier: number
        let xMultiplier: number

        switch (dir) {
            case DirectionAngle.UpRight:
                xMultiplier = 1
                yMultiplier = 1
                break
            case DirectionAngle.UpLeft:
                xMultiplier = -1
                yMultiplier = 1
                break
            case DirectionAngle.DownRight:
                xMultiplier = 1
                yMultiplier = -1
                break
            default:
                xMultiplier = -1
                yMultiplier = -1
        }

        for (let i = 1; i <= limit; i++) {
            const tempTile = new Tile(this.tile.x + i * xMultiplier, this.tile.y + i * yMultiplier)

            if (board.inBoard(tempTile)) {
                if (enemyPlayer.piecePresent(tempTile)) {
                    moves.push(tempTile)
                    break
                } else if (currentPlayer.piecePresent(tempTile)) {
                    break
                } else {
                    moves.push(tempTile)
                }
            }
        }
        return moves
    }

    /**
     * check to see if a move is infact a legal move.
     * @param {Player} currentPlayer
     * @param {Player} enemyPlayer
     * @param {Board} board
     * @param {Tile} oldtile
     * @param {Tile} tile
     */
    public isLegalMove(oldtile: Tile, tile: Tile, currentPlayer: Player, enemyPlayer: Player, board: Board): boolean {
        if (board.inBoard(tile)) {
            const currPiece = currentPlayer.getPieceByTile(oldtile)
            let moves: Array<Tile> = new Array<Tile>()

            if (currPiece != null) {
                moves = currPiece.generateMoves(currentPlayer, enemyPlayer, board)

                if (moves.length > 0) {
                    for (let i = 0; i < moves.length; i++) {
                        if (moves[i].equals(tile) && !currentPlayer.piecePresent(tile)) {
                            return true
                        }
                    }
                }
            }
        }
        return false
    }
}
