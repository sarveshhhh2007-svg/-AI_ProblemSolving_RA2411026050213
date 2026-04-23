/**
 * A* Pathfinder
 * Finds the shortest safe path from (1,1) to the farthest possible safe cell, or a specific goal.
 */

const Pathfinder = {
    findSafePath(goalCoord = null) {
        // Find all confirmed safe cells
        const safeCells = InferenceEngine.getSafeCellsList();
        
        // Always start at (1,1)
        const start = { r: 1, c: 1 };
        const startStr = Coordinator.toString(start.r, start.c);
        
        if (!safeCells.includes(startStr)) {
            // (1,1) is not safe? We can't even start!
            return [];
        }

        // If no explicit goal, let's just find the longest continuous path, or try to reach highest r,c
        // For simplicity and to match the professor's output, let's find a path from (1,1) -> (2,1) -> (2,2) etc.
        // Actually, we'll do standard BFS through safe cells since unweighted.
        
        const queue = [[start]];
        const visited = new Set([startStr]);
        let longestPath = [start];
        
        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];
            
            if (path.length > longestPath.length) {
                longestPath = path;
            }
            
            // If we have a goal and reached it
            if (goalCoord && current.r === goalCoord.r && current.c === goalCoord.c) {
                return path;
            }
            
            const adj = Coordinator.getAdjacent(current.r, current.c);
            
            for (let a of adj) {
                const aStr = Coordinator.toString(a.r, a.c);
                if (safeCells.includes(aStr) && !visited.has(aStr)) {
                    visited.add(aStr);
                    const newPath = [...path, a];
                    queue.push(newPath);
                }
            }
        }
        
        return longestPath;
    }
};

window.Pathfinder = Pathfinder;
