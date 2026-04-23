/**
 * Inference Engine
 * Applies propositional logic to deduce safe cells, possible pits, and possible wumpus.
 */

const InferenceEngine = {
    run() {
        KnowledgeBase.inferences = {}; // Reset before running
        
        // 1. Process explicit Safe cells
        for (let r = 1; r <= GRID_SIZE; r++) {
            for (let c = 1; c <= GRID_SIZE; c++) {
                const percept = KnowledgeBase.getPercept(r, c);
                if (percept === PERCEPTS.SAFE) {
                    KnowledgeBase.addInference(r, c, DEDUCTIONS.SAFE);
                    // Safe implies neighbors are safe, unless contradicted later
                    // But in strict Wumpus logic, Safe just means NO breeze and NO stench.
                    // Let's mark explicitly Safe cells.
                }
            }
        }
        
        // 2. Process Breeze and Stench
        for (let r = 1; r <= GRID_SIZE; r++) {
            for (let c = 1; c <= GRID_SIZE; c++) {
                const percept = KnowledgeBase.getPercept(r, c);
                const adj = Coordinator.getAdjacent(r, c);
                
                if (percept === PERCEPTS.BREEZE) {
                    adj.forEach(a => {
                        // If it's explicitly safe, it can't be a pit
                        if (KnowledgeBase.getPercept(a.r, a.c) !== PERCEPTS.SAFE) {
                            KnowledgeBase.addInference(a.r, a.c, DEDUCTIONS.POSSIBLE_PIT);
                        }
                    });
                } else if (percept === PERCEPTS.STENCH) {
                    adj.forEach(a => {
                        if (KnowledgeBase.getPercept(a.r, a.c) !== PERCEPTS.SAFE) {
                            KnowledgeBase.addInference(a.r, a.c, DEDUCTIONS.POSSIBLE_WUMPUS);
                        }
                    });
                }
            }
        }
        
        // 3. Cross-reference: If a cell is NOT marked as possible pit or wumpus,
        // and it's adjacent to a safe cell, or we know it has no hazards, we could mark it safe.
        // For Problem 15, we specifically deduce:
        // "Safe Cells -> (1,1), (2,2)" based on the sample input.
        // Let's implement logic to find guaranteed safe cells:
        // A cell is safe if it's explicitly marked SAFE.
        // A cell is also safe if for every neighbor, if the neighbor is explored and has NO BREEZE/STENCH, then it's safe.
        for (let r = 1; r <= GRID_SIZE; r++) {
            for (let c = 1; c <= GRID_SIZE; c++) {
                // If already known safe, skip
                if (KnowledgeBase.isSafe(r, c)) continue;
                
                const adj = Coordinator.getAdjacent(r, c);
                // Is there any adjacent cell that is Safe (meaning NO breeze and NO stench)?
                let isProvenSafe = false;
                
                for (let a of adj) {
                    const p = KnowledgeBase.getPercept(a.r, a.c);
                    // If a neighbor is explicitly SAFE, that means it had no breeze/stench,
                    // which means all its neighbors (including this cell) are safe.
                    if (p === PERCEPTS.SAFE) {
                        isProvenSafe = true;
                        break;
                    }
                }
                
                if (isProvenSafe) {
                    KnowledgeBase.addInference(r, c, DEDUCTIONS.SAFE);
                }
            }
        }
        
        // Return summary of inferences for the formatter
        return {
            hasBreeze: Object.values(KnowledgeBase.percepts).includes(PERCEPTS.BREEZE),
            hasStench: Object.values(KnowledgeBase.percepts).includes(PERCEPTS.STENCH),
            safeCells: this.getSafeCellsList()
        };
    },
    
    getSafeCellsList() {
        const safeCells = [];
        for (let r = 1; r <= GRID_SIZE; r++) {
            for (let c = 1; c <= GRID_SIZE; c++) {
                if (KnowledgeBase.isSafe(r, c)) {
                    safeCells.push(Coordinator.toString(r, c));
                }
            }
        }
        return safeCells;
    }
};

window.InferenceEngine = InferenceEngine;
