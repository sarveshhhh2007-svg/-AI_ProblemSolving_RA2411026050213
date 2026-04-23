/**
 * Formatter
 * Formats the output exactly to the professor's specifications.
 */

const Formatter = {
    formatResults(inferenceSummary, safePath) {
        const lines = [];
        
        if (inferenceSummary.hasBreeze) {
            lines.push('• Cells near Breeze → Possible Pit nearby');
        }
        if (inferenceSummary.hasStench) {
            lines.push('• Cells near Stench → Possible Wumpus nearby');
        }
        
        // Always show safe cells
        const safeStr = inferenceSummary.safeCells.join(', ');
        lines.push(`• Safe Cells → ${safeStr}`);
        
        return lines;
    },

    formatPath(safePath) {
        if (!safePath || safePath.length === 0) return 'No safe path available.';
        
        let str = safePath.map(p => Coordinator.toString(p.r, p.c)).join(' → ');
        
        // Add "Goal" at the end if we want to match the sample exactly, 
        // though the prompt output said "(1,1) -> (2,1) -> (2,2) -> [goal]"
        str += ' → Goal';
        return str;
    }
};

window.Formatter = Formatter;
