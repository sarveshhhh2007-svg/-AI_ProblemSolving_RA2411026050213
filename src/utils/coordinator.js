/**
 * Utilities for coordinate conversion and grid management.
 * Grid is 4x4.
 * Coordinates are (row, col) 1-indexed.
 * Array index is 0-indexed.
 */

const GRID_SIZE = 4;

const Coordinator = {
    // Convert (row, col) string "(1,2)" to object {r: 1, c: 2}
    parseString(coordStr) {
        const match = coordStr.match(/\((\d+),(\d+)\)/);
        if (match) {
            return { r: parseInt(match[1]), c: parseInt(match[2]) };
        }
        return null;
    },

    // Convert object {r: 1, c: 2} to string "(1,2)"
    toString(r, c) {
        return `(${r},${c})`;
    },

    // Get 0-15 array index from 1-indexed row,col
    toIndex(r, c) {
        return (r - 1) * GRID_SIZE + (c - 1);
    },

    // Get {r, c} from 0-15 index
    fromIndex(index) {
        return {
            r: Math.floor(index / GRID_SIZE) + 1,
            c: (index % GRID_SIZE) + 1
        };
    },

    // Get adjacent coordinates for a given (r,c)
    getAdjacent(r, c) {
        const adj = [];
        if (r > 1) adj.push({ r: r - 1, c: c });
        if (r < GRID_SIZE) adj.push({ r: r + 1, c: c });
        if (c > 1) adj.push({ r: r, c: c - 1 });
        if (c < GRID_SIZE) adj.push({ r: r, c: c + 1 });
        return adj;
    },

    // Convert to Three.js world coordinates (assuming tiles are 1x1, centered at origin)
    // We'll place (1,1) at top-left or bottom-left depending on setup. Let's do (1,1) top-left.
    toWorldPos(r, c) {
        const tileSize = 1.1; // 1 size + 0.1 gap
        const offsetX = (GRID_SIZE * tileSize) / 2 - (tileSize / 2);
        const offsetZ = (GRID_SIZE * tileSize) / 2 - (tileSize / 2);
        
        return {
            x: (c - 1) * tileSize - offsetX,
            y: 0,
            z: (r - 1) * tileSize - offsetZ
        };
    }
};

window.Coordinator = Coordinator;
