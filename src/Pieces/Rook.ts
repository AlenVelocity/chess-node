import Tile from '../Tile'
import { Piece } from './Piece'
import { Direction } from '../Direction'
import Player from '../Player'
import Board from '../Board'

export class Rook extends Piece {
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
     * @param {Player} currentPlayer The player who's legal moves this function will return.
     * @param {Player} enemyPlayer this player is required to calculate legal moves for the currentPlayer
     * @param {Board} board the board that the two players exist in.
     * @return {Array<Tile>} returns an array of legal moves.
     */
    public generateMoves = (currentPlayer: Player, enemyPlayer: Player, board: Board): Tile[] => {
        const right = this.genMovesLin(Direction.Right, currentPlayer, enemyPlayer, board)
        const left = this.genMovesLin(Direction.Left, currentPlayer, enemyPlayer, board)
        const up = this.genMovesLin(Direction.Up, currentPlayer, enemyPlayer, board)
        const down = this.genMovesLin(Direction.Down, currentPlayer, enemyPlayer, board)

        return right.concat(left, up, down)
    }

    static fromRook = (rook: Rook): Rook =>
        new Rook(Tile.fromTile(rook.tile), rook.captured, rook.isWhite, rook.hasMoved)
}
