import { Piece } from './Piece'
import Tile from '../Tile'
import Player from '../Player'
import Board from '../Board'

export class King extends Piece {
    /**
     * @param {Tile} tile this this.tile of the piece.
     * @param {boolean} captured the captured status of the peice.
     * @param {boolean} isWhite is the piece white or black.
     * @param {boolean} hasMoves has the piece moved or not.
     */
    constructor(tile: Tile, captured = false, isWhite = false, hasMoved = false) {
        super(tile, captured, isWhite, hasMoved)
    }

    /**
     * Generate an array of moves for a king.
     * @param {Player} currentPlayer The player who's legal moves this function will return.
     * @param {Player} enemyPlayer this player is required to calculate legal moves for the currentPlayer
     * @param {Board} board the board that the two players exist in.
     * @return {Array} returns an array of legal moves.
     */
    generateMoves(currentPlayer: Player, enemyPlayer: Player, board: Board): Array<Tile> {
        const moves: Array<Tile> = new Array<Tile>()

        let tempTile = new Tile(this.tile.x + 1, this.tile.y)
        if (!currentPlayer.piecePresent(tempTile) && board.inBoard(tempTile)) {
            moves.push(tempTile)
        }

        tempTile = new Tile(this.tile.x + 1, this.tile.y + 1)
        if (!currentPlayer.piecePresent(tempTile) && board.inBoard(tempTile)) {
            moves.push(tempTile)
        }

        tempTile = new Tile(this.tile.x + 1, this.tile.y - 1)
        if (!currentPlayer.piecePresent(tempTile) && board.inBoard(tempTile)) {
            moves.push(tempTile)
        }

        tempTile = new Tile(this.tile.x - 1, this.tile.y + 1)
        if (!currentPlayer.piecePresent(tempTile) && board.inBoard(tempTile)) {
            moves.push(tempTile)
        }

        tempTile = new Tile(this.tile.x - 1, this.tile.y - 1)
        if (!currentPlayer.piecePresent(tempTile) && board.inBoard(tempTile)) {
            moves.push(tempTile)
        }

        tempTile = new Tile(this.tile.x - 1, this.tile.y)
        if (!currentPlayer.piecePresent(tempTile) && board.inBoard(tempTile)) {
            moves.push(tempTile)
        }

        tempTile = new Tile(this.tile.x, this.tile.y + 1)
        if (!currentPlayer.piecePresent(tempTile) && board.inBoard(tempTile)) {
            moves.push(tempTile)
        }

        tempTile = new Tile(this.tile.x, this.tile.y - 1)
        if (!currentPlayer.piecePresent(tempTile) && board.inBoard(tempTile)) {
            moves.push(tempTile)
        }

        return moves
    }

    static fromKing = (king: King): King =>
        new King(Tile.fromTile(king.tile), king.captured, king.isWhite, king.hasMoved)
}
