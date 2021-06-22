import Board from './Board'
import { Bishop, King, Knight, Pawn, Queen, Rook } from './Pieces'
import Tile from './Tile'

export default class Player {
    public isWhite: boolean
    public rooks: Rook[]
    public king: King
    public queen: Queen
    public bishops: Bishop[]
    public knights: Knight[]
    public ct = 0
    public playerName: string

    public pawns: Pawn[]

    // Piece type for promotion
    public promotions: (Rook | King | Queen | Knight | Pawn | Bishop)[]

    /**
     * @param {Boolean} isWhite determines if the player is white or black.
     * @param {String} playerName the name of the player.
     */
    constructor(isWhite = false, playerName = 'no_name') {
        this.playerName = playerName
        this.rooks = new Array<Rook>()
        this.pawns = new Array<Pawn>()
        this.knights = new Array<Knight>()
        this.bishops = new Array<Bishop>()
        this.isWhite = isWhite
        this.promotions = []
        if (isWhite) {
            this.rooks.push(new Rook(new Tile(1, 1), false, true))
            this.rooks.push(new Rook(new Tile(8, 1), false, true))
            for (let i = 1; i <= 8; i++) {
                this.pawns.push(new Pawn(new Tile(i, 2), false, true))
            }
            this.queen = new Queen(new Tile(4, 1), false, true)
            this.bishops.push(new Bishop(new Tile(3, 1), false, true))
            this.bishops.push(new Bishop(new Tile(6, 1), false, true))
            this.king = new King(new Tile(5, 1), false, true)
            this.knights.push(new Knight(new Tile(2, 1), false, true))
            this.knights.push(new Knight(new Tile(7, 1), false, true))
        } else {
            this.rooks.push(new Rook(new Tile(1, 8)))
            this.rooks.push(new Rook(new Tile(8, 8)))
            for (let i = 1; i <= 8; i++) {
                this.pawns.push(new Pawn(new Tile(i, 7)))
            }
            this.queen = new Queen(new Tile(4, 8))
            this.bishops.push(new Bishop(new Tile(3, 8)))
            this.bishops.push(new Bishop(new Tile(6, 8)))
            this.king = new King(new Tile(5, 8))
            this.knights.push(new Knight(new Tile(2, 8)))
            this.knights.push(new Knight(new Tile(7, 8)))
        }
    }

    /**
     * Static method in turn of copy constructor.
     * @param {Player} player the peice to make a copy of.
     */
    static fromPlayer(player: Player): Player {
        const isWhite = player.isWhite
        const playerName = player.playerName

        const rooks: Array<Rook> = new Array<Rook>()
        for (const rook of player.rooks) {
            rooks.push(Rook.fromRook(rook))
        }

        const promotions = []
        for (const piece of player.promotions) {
            if (piece instanceof Pawn) {
                promotions.push(Pawn.fromPawn(piece))
            } else if (piece instanceof Rook) {
                promotions.push(Rook.fromRook(piece))
            } else if (piece instanceof Bishop) {
                promotions.push(Bishop.fromBishop(piece))
            } else if (piece instanceof Knight) {
                promotions.push(Knight.fromKnight(piece))
            } else if (piece instanceof Queen) {
                promotions.push(Queen.fromQueen(piece))
            }
        }

        const king: King = King.fromKing(player.king)
        const queen: Queen = Queen.fromQueen(player.queen)

        const bishops: Array<Bishop> = new Array<Bishop>()
        for (const bishop of player.bishops) {
            bishops.push(Bishop.fromBishop(bishop))
        }

        const knights: Array<Knight> = new Array<Knight>()
        for (const knight of player.knights) {
            knights.push(Knight.fromKnight(knight))
        }

        const pawns: Array<Pawn> = new Array<Pawn>()
        for (const pawn of player.pawns) {
            pawns.push(Pawn.fromPawn(<Pawn>pawn))
        }

        const ct: number = player.ct

        const newPlayer = new this(isWhite, playerName)

        const playerExtra = {
            rooks: rooks,
            king: king,
            queen: queen,
            bishops: bishops,
            knights: knights,
            pawns: pawns,
            ct: ct,
            promotions: promotions
        }

        return <Player>Object.assign(newPlayer, playerExtra)
    }

    /**
     * Move a piece from one tile to another.
     * @param {Tile} currentTile the tile where the piece is at.
     * @param {Tile} newTile the tile where the pieuce is being moved to.
     * @param {Player} enemyPlayer the enemy player.
     * @param {Board} board the board the peice is playing on.
     * @returns {boolean} returns true if a piece was moved, returns false if the piece couldn't move
     */
    public movePiece(currentTile: Tile, newTile: Tile, enemyPlayer: Player, board: Board): boolean {
        const piece = this.getPieceByTile(currentTile)
        if (piece == null) return false

        if (piece.isLegalMove(currentTile, newTile, this, enemyPlayer, board)) {
            const oldTile = piece.tile

            piece.tile = newTile
            piece.hasMoved = true

            if (piece instanceof Pawn && Math.abs(newTile.y - oldTile.y) == 2) {
                piece.enPassantEligable = true
            }

            // disgusting ugly enPassant logic, I hate it... but it works. I'm sorry :(
            const enemyPiece = enemyPlayer.getPieceByTile(newTile)
            if (enemyPlayer.piecePresent(newTile) && enemyPiece) {
                enemyPiece.captured = true
                this.ct = 0
            } else if (piece instanceof Pawn && Math.abs(newTile.x - oldTile.x) == 1) {
                if (this.isWhite) {
                    const enPassantTile = new Tile(newTile.x, newTile.y - 1)
                    if (enemyPlayer.piecePresent(enPassantTile)) {
                        const enPassantPiece = enemyPlayer.getPieceByTile(enPassantTile)
                        if (enPassantPiece instanceof Pawn) {
                            enPassantPiece.captured = true
                            this.ct = 0
                        } else {
                            this.ct++
                        }
                    } else {
                        this.ct++
                    }
                } else {
                    const enPassantTile = new Tile(newTile.x, newTile.y + 1)
                    if (enemyPlayer.piecePresent(enPassantTile)) {
                        const enPassantPiece = enemyPlayer.getPieceByTile(enPassantTile)
                        if (enPassantPiece instanceof Pawn) {
                            enPassantPiece.captured = true
                            this.ct = 0
                        } else {
                            this.ct++
                        }
                    } else {
                        this.ct++
                    }
                }
            } else {
                this.ct++
            }
            this.removeEnpassant(enemyPlayer)
            return true
        } else {
            return false
        }
    }

    /**
     * @param {Player} player
     */
    public removeEnpassant(player: Player): void {
        for (const pawn of player.pawns) {
            pawn.enPassantEligable = false
        }
    }

    /**
     * Find the peice at a current tile location
     * @param {Tile} tile the tile where the piece is being moved to.
     * @returns {Piece}
     */
    public piecePresent(tile: Tile): boolean {
        return this.getPieceByTile(tile) != null
    }

    /**
     * Find the peice at a current tile location
     * @param {Tile} tile the tile where the piece is being moved to.
     * @returns {boolean}
     */
    public getPieceByTile(tile: Tile): Pawn | Rook | King | Queen | Bishop | Knight | null {
        // loop through each rook
        for (let i = 0; i < this.rooks.length; i++) {
            // if the rook is found at given tile, and it's not captured return the piece
            if (this.rooks[i].tile.equals(tile) && !this.rooks[i].captured) {
                return this.rooks[i]
            }
        }

        // loop through each pawn
        for (let i = 0; i < this.pawns.length; i++) {
            // if the pawn is found at given tile, and it's not captured return the piece
            if (this.pawns[i].tile.equals(tile) && !this.pawns[i].captured) {
                return this.pawns[i]
            }
        }
        // loop through each bishop
        for (let i = 0; i < this.bishops.length; i++) {
            // if the bishop is found at given tile, and it's not captured return the bishop
            if (this.bishops[i].tile.equals(tile) && !this.bishops[i].captured) {
                return this.bishops[i]
            }
        }

        // loop through each knight
        for (let i = 0; i < this.knights.length; i++) {
            // if the knight is found at given tile, and it's not captured return the piece
            if (this.knights[i].tile.equals(tile) && !this.knights[i].captured) {
                return this.knights[i]
            }
        }

        // if the queen is found at the current tile and it isn't captured return the queen.
        if (this.queen.tile.equals(tile) && !this.queen.captured) {
            return this.queen
        }

        // if the queen is found at the current tile and it isn't captured return the queen.
        if (this.king.tile.equals(tile) && !this.king.captured) {
            return this.king
        }

        // loop through each promotion
        for (let i = 0; i < this.promotions.length; i++) {
            if (this.promotions[i].tile.equals(tile) && !this.promotions[i].captured) {
                return this.promotions[i]
            }
        }

        // return null if there is not a piece found at the current location
        return null
    }
}
