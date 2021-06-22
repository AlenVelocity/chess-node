import { Piece } from './Piece'
import Tile from '../Tile'
import Player from '../Player'
import Board from '../Board'

export class Pawn extends Piece {
    public enPassantEligable: boolean

    /**
     * @param {Tile} tile this this.tile of the piece.
     * @param {boolean} captured the captured status of the peice.
     * @param {boolean} isWhite is the piece white or black.
     * @param {boolean} hasMoves has the piece moved or not.
     */
    constructor(tile: Tile, captured = false, isWhite = false, hasMoved = false, enPassant = false) {
        super(tile, captured, isWhite, hasMoved)
        this.enPassantEligable = enPassant
    }

    /**
     * Static method in turn of copy constructor.
     * @param {Pawn} pawn the peice to make a copy of.
     */
    static fromPawn = (pawn: Pawn): Pawn =>
        new Pawn(Tile.fromTile(pawn.tile), pawn.captured, pawn.isWhite, pawn.hasMoved, pawn.enPassantEligable)

    /**
     * Generate an array of moves for a king.
     * @param {Player} currentPlayer The player who's legal moves this function will return.
     * @param {Player} enemyPlayer this player is required to calculate legal moves for the currentPlayer
     * @param {Board} board the board that the two players exist in.
     * @return {Array} returns an array of legal moves.
     */
    public generateMoves(currentPlayer: Player, enemyPlayer: Player, board: Board): Array<Tile> {
        const position = this.tile

        const moves = new Array<Tile>()

        if (currentPlayer.isWhite) {
            if (!this.hasMoved && !enemyPlayer.piecePresent(new Tile(position.x, position.y + 2))) {
                moves.push(new Tile(position.x, position.y + 2))
            }

            if (!enemyPlayer.piecePresent(new Tile(position.x, position.y + 1))) {
                moves.push(new Tile(position.x, position.y + 1))
            }

            if (enemyPlayer.piecePresent(new Tile(position.x - 1, position.y + 1))) {
                moves.push(new Tile(position.x - 1, position.y + 1))
            }
            if (enemyPlayer.piecePresent(new Tile(position.x - 1, position.y))) {
                const ePiece = enemyPlayer.getPieceByTile(new Tile(position.x - 1, position.y))
                if (ePiece instanceof Pawn && ePiece.enPassantEligable) {
                    moves.push(new Tile(position.x - 1, position.y + 1))
                }
            }

            if (enemyPlayer.piecePresent(new Tile(position.x + 1, position.y + 1))) {
                moves.push(new Tile(position.x + 1, position.y + 1))
            }
            if (enemyPlayer.piecePresent(new Tile(position.x + 1, position.y))) {
                const ePiece = enemyPlayer.getPieceByTile(new Tile(position.x + 1, position.y))
                if (ePiece instanceof Pawn && ePiece.enPassantEligable) {
                    moves.push(new Tile(position.x + 1, position.y + 1))
                }
            }
        } else {
            if (!this.hasMoved && !enemyPlayer.piecePresent(new Tile(position.x, position.y - 2))) {
                moves.push(new Tile(position.x, position.y - 2))
            }

            if (!enemyPlayer.piecePresent(new Tile(position.x, position.y - 1))) {
                moves.push(new Tile(position.x, position.y - 1))
            }
            if (enemyPlayer.piecePresent(new Tile(position.x - 1, position.y - 1))) {
                moves.push(new Tile(position.x - 1, position.y - 1))
            }
            if (enemyPlayer.piecePresent(new Tile(position.x - 1, position.y))) {
                const ePiece = enemyPlayer.getPieceByTile(new Tile(position.x - 1, position.y))
                if (ePiece instanceof Pawn && ePiece.enPassantEligable) {
                    moves.push(new Tile(position.x - 1, position.y - 1))
                }
            }

            if (enemyPlayer.piecePresent(new Tile(position.x + 1, position.y - 1))) {
                moves.push(new Tile(position.x + 1, position.y - 1))
            }
            if (enemyPlayer.piecePresent(new Tile(position.x + 1, position.y))) {
                const ePiece = enemyPlayer.getPieceByTile(new Tile(position.x + 1, position.y))
                if (ePiece instanceof Pawn && ePiece.enPassantEligable) {
                    moves.push(new Tile(position.x + 1, position.y - 1))
                }
            }
        }

        for (let i = 0; i < moves.length; i++) {
            if (currentPlayer.piecePresent(moves[i]) || !board.inBoard(moves[i])) {
                moves.splice(i, 1)
                i--
            }
        }

        return moves
    }
}
