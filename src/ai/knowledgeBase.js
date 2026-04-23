/**
 * Knowledge Base (Propositional Logic representation)
 */

const PERCEPTS = {
    SAFE: 'Safe',
    BREEZE: 'Breeze',
    STENCH: 'Stench',
    UNKNOWN: 'Unknown'
};

const DEDUCTIONS = {
    SAFE: 'ConfirmedSafe',
    POSSIBLE_PIT: 'PossiblePit',
    POSSIBLE_WUMPUS: 'PossibleWumpus',
    CONFIRMED_PIT: 'ConfirmedPit',
    CONFIRMED_WUMPUS: 'ConfirmedWumpus'
};

const KnowledgeBase = {
    percepts: {}, // format: "(r,c)": "Safe"
    inferences: {}, // format: "(r,c)": ["ConfirmedSafe", "PossiblePit"]
    
    reset() {
        this.percepts = {};
        this.inferences = {};
    },

    setPercept(r, c, type) {
        this.percepts[Coordinator.toString(r, c)] = type;
    },

    getPercept(r, c) {
        return this.percepts[Coordinator.toString(r, c)] || PERCEPTS.UNKNOWN;
    },

    addInference(r, c, deduction) {
        const key = Coordinator.toString(r, c);
        if (!this.inferences[key]) {
            this.inferences[key] = new Set();
        }
        this.inferences[key].add(deduction);
    },

    getInferences(r, c) {
        const key = Coordinator.toString(r, c);
        return this.inferences[key] ? Array.from(this.inferences[key]) : [];
    },

    isSafe(r, c) {
        const infs = this.getInferences(r, c);
        return infs.includes(DEDUCTIONS.SAFE);
    }
};

window.KnowledgeBase = KnowledgeBase;
window.PERCEPTS = PERCEPTS;
window.DEDUCTIONS = DEDUCTIONS;
