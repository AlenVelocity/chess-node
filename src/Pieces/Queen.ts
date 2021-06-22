import { Piece } from './Piece'
import Tile from '../Tile'
import Player from '../Player'
import Board from '../Board'
import { Direction, DirectionAngle } from '../Direction'

export class Queen extends Piece {
    /**
     * @param {Tile} tile this this.tile of the Queen.
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
        const upRight = this.genMovesAng(DirectionAngle.UpRight, currentPlayer, enemyPlayer, board)
        const upLeft = this.genMovesAng(DirectionAngle.UpLeft, currentPlayer, enemyPlayer, board)
        const downRight = this.genMovesAng(DirectionAngle.DownRight, currentPlayer, enemyPlayer, board)
        const downLeft = this.genMovesAng(DirectionAngle.DownLeft, currentPlayer, enemyPlayer, board)

        return right.concat(left, up, down, upRight, upLeft, downLeft, downRight)
    }

    static fromQueen = (queen: Queen): Queen =>
        new Queen(Tile.fromTile(queen.tile), queen.captured, queen.isWhite, queen.hasMoved)
}
