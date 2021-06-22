export class Tile {
    public x: number
    public y: number

    /**
     * @param {number} x x location on board
     * @param {number} y y location on board
     */
    constructor(x = 0, y = 0) {
        this.x = Math.floor(x)
        this.y = Math.floor(y)
    }

    /**
     * Static method in turn of copy constructor.
     * @param {Tile} tile the tile to make a copy of.
     */
    static fromTile = (tile: Tile): Tile => new Tile(tile.x, tile.y)

    /**
     * Determine if two tiles are in the same location.
     * @param {Tile} tile tile to compare to.
     */
    public equals = (tile: Tile): boolean => this.x == tile.x && this.y == tile.y
}
