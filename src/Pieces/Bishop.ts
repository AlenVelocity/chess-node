import { Piece } from './Piece'
import Tile from '../Tile'
import Player from '../Player'
import Board from '../Board'
import { DirectionAngle } from '../Direction'

export class Bishop extends Piece {
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
    public generateMoves = (currentPlayer: Player, enemyPlayer: Player, board: Board): Array<Tile> => {
        const upRight = this.genMovesAng(DirectionAngle.UpRight, currentPlayer, enemyPlayer, board)
        const upLeft = this.genMovesAng(DirectionAngle.UpLeft, currentPlayer, enemyPlayer, board)
        const downRight = this.genMovesAng(DirectionAngle.DownRight, currentPlayer, enemyPlayer, board)
        const downLeft = this.genMovesAng(DirectionAngle.DownLeft, currentPlayer, enemyPlayer, board)
        return upRight.concat(upLeft, downLeft, downRight)
    }

    static fromBishop = (bishop: Bishop): Bishop =>
        new Bishop(Tile.fromTile(bishop.tile), bishop.captured, bishop.isWhite, bishop.hasMoved)
}
