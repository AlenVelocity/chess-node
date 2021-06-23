import { Bishop, King, Knight, Pawn, Queen, Rook } from './Pieces'
import Player from './Player'
import Tile from './Tile'

export default class Board {
    private size: number
    public tiles = new Array<Tile>()

    /**
     * @param {number} size the height and width of the square board.
     */
    constructor(size: number) {
        this.size = Math.floor(size)

        // populate Tile array with tiles in correct position.
        for (let i = 1; i <= this.size; i++) {
            for (let j = 1; j <= this.size; j++) {
                this.tiles.push(new Tile(j, i))
            }
        }
    }

    static fromBoard(board: Board): Board {
        return new this(board.size)
    }

    /**
     * @return size of the board.
     */
    getSize = (): number => this.size

    /**
     * Determine if a tile is in the board
     * @param {Tile} tile the board of the peice
     */
    inBoard = (tile: Tile): boolean => !(tile.x > this.size || tile.y > this.size || tile.x < 1 || tile.y < 1)

    getPieces = (white: Player, black: Player): string[] => {
        const pieces = new Array<string>()
        for (let i = 0; i < this.tiles.length; i++) {
            if (
                white.getPieceByTile(this.tiles[i]) instanceof Queen &&
                !white.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('wQ')
            } else if (
                white.getPieceByTile(this.tiles[i]) instanceof King &&
                !white.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('wK')
            } else if (
                white.getPieceByTile(this.tiles[i]) instanceof Knight &&
                !white.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('wk')
            } else if (
                white.getPieceByTile(this.tiles[i]) instanceof Rook &&
                !white.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('wR')
            } else if (
                white.getPieceByTile(this.tiles[i]) instanceof Bishop &&
                !white.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('wB')
            } else if (
                white.getPieceByTile(this.tiles[i]) instanceof Pawn &&
                !white.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('wP')
            } else if (
                black.getPieceByTile(this.tiles[i]) instanceof Queen &&
                !black.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('bQ')
            } else if (
                black.getPieceByTile(this.tiles[i]) instanceof King &&
                !black.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('bK')
            } else if (
                black.getPieceByTile(this.tiles[i]) instanceof Knight &&
                !black.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('bk')
            } else if (
                black.getPieceByTile(this.tiles[i]) instanceof Rook &&
                !black.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('bR')
            } else if (
                black.getPieceByTile(this.tiles[i]) instanceof Bishop &&
                !black.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('bB')
            } else if (
                black.getPieceByTile(this.tiles[i]) instanceof Pawn &&
                !black.getPieceByTile(this.tiles[i])?.captured
            ) {
                pieces.push('bP')
            } else pieces.push('  ')
        }
        return pieces
    }
    /**
     * @param {Player} white White player
     * @param {Player} black player
     * @returns {String} the output string
     */
    printBoard(white: Player, black: Player): string {
        let boardString = ''
        const pieces = this.getPieces(white, black)

        // building the final string by accessing the location of the piece in the pieces array and placing it in the baord string
        boardString += '`\n     1    2    3    4    5    6    7    8  \n'
        boardString += '  _________________________________________\n'
        boardString += `A | ${pieces[0]} | ${pieces[1]} | ${pieces[2]} | ${pieces[3]} | ${pieces[4]} | ${pieces[5]} | ${pieces[6]} | ${pieces[7]} |\n`
        boardString += `  |____|____|____|____|____|____|____|____|\n`
        boardString += `B | ${pieces[8]} | ${pieces[9]} | ${pieces[10]} | ${pieces[11]} | ${pieces[12]} | ${pieces[13]} | ${pieces[14]} | ${pieces[15]} |\n`
        boardString += '  |____|____|____|____|____|____|____|____|\n'
        boardString += `C | ${pieces[16]} | ${pieces[17]} | ${pieces[18]} | ${pieces[19]} | ${pieces[20]} | ${pieces[21]} | ${pieces[22]} | ${pieces[23]} |\n`
        boardString += '  |____|____|____|____|____|____|____|____|\n'
        boardString += `D | ${pieces[24]} | ${pieces[25]} | ${pieces[26]} | ${pieces[27]} | ${pieces[28]} | ${pieces[29]} | ${pieces[30]} | ${pieces[31]} |\n`
        boardString += '  |____|____|____|____|____|____|____|____|\n'
        boardString += `E | ${pieces[32]} | ${pieces[33]} | ${pieces[34]} | ${pieces[35]} | ${pieces[36]} | ${pieces[37]} | ${pieces[38]} | ${pieces[39]} |\n`
        boardString += '  |____|____|____|____|____|____|____|____|\n'
        boardString += `F | ${pieces[40]} | ${pieces[41]} | ${pieces[42]} | ${pieces[43]} | ${pieces[44]} | ${pieces[45]} | ${pieces[46]} | ${pieces[47]} |\n`
        boardString += '  |____|____|____|____|____|____|____|____|\n'
        boardString += `G | ${pieces[48]} | ${pieces[49]} | ${pieces[50]} | ${pieces[51]} | ${pieces[52]} | ${pieces[53]} | ${pieces[54]} | ${pieces[55]} |\n`
        boardString += '  |____|____|____|____|____|____|____|____|\n'
        boardString += `H | ${pieces[56]} | ${pieces[57]} | ${pieces[58]} | ${pieces[59]} | ${pieces[60]} | ${pieces[61]} | ${pieces[62]} | ${pieces[63]} |\n`
        boardString += '  |____|____|____|____|____|____|____|____|\n`'

        // returns the board string
        return boardString
    }
}
