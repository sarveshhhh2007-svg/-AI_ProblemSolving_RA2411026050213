/**
 * Output Panel Logic
 */

const OutputPanel = {
    isAnalyzing: false,

    reset() {
        document.getElementById('inference-results').innerHTML = '<li class="placeholder-text">Awaiting input data...</li>';
        document.getElementById('safe-path-display').innerText = '--';
        document.getElementById('reasoning-log').innerHTML = '<div>[System Ready] Awaiting percepts...</div>';
    },

    addLog(msg) {
        const log = document.getElementById('reasoning-log');
        const div = document.createElement('div');
        div.innerText = `> ${msg}`;
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
    },

    async runAnalysis() {
        if (this.isAnalyzing) return;
        this.isAnalyzing = true;
        this.reset();
        
        if (window.RobotAnimations) RobotAnimations.playThinking();

        this.addLog('[Step 1] Initializing Propositional Logic Engine...');
        await this.delay(800);
        
        this.addLog('[Step 2] Processing explicitly Safe cells...');
        await this.delay(800);
        
        this.addLog('[Step 3] Applying Breeze/Stench rules to adjacent cells...');
        await this.delay(800);
        
        this.addLog('[Step 4] Cross-referencing to find guaranteed Safe cells...');
        
        // Run Logic
        const inferenceSummary = InferenceEngine.run();
        
        // Apply visual deductions to grid
        for (let r = 1; r <= GRID_SIZE; r++) {
            for (let c = 1; c <= GRID_SIZE; c++) {
                const infs = KnowledgeBase.getInferences(r, c);
                if (infs.length > 0) {
                    CellEffects.applyDeductionEffect(r, c, infs);
                    if (window.AudioSystem && Math.random() > 0.5) {
                        AudioSystem.playDeductionPop();
                    }
                    await this.delay(100); // Visual stagger
                }
            }
        }
        
        await this.delay(500);
        
        // Formatter outputs
        const lines = Formatter.formatResults(inferenceSummary, null);
        const ul = document.getElementById('inference-results');
        ul.innerHTML = '';
        lines.forEach(l => {
            const li = document.createElement('li');
            li.innerText = l;
            li.classList.add('highlight-deduction');
            ul.appendChild(li);
        });
        
        this.addLog('[Step 5] Calculating optimal safe path using A*...');
        await this.delay(800);
        
        const path = Pathfinder.findSafePath();
        const pathStr = Formatter.formatPath(path);
        
        const pathElem = document.getElementById('safe-path-display');
        pathElem.innerText = pathStr;
        
        // Trigger path visualization
        if (path.length > 0) {
            CellEffects.highlightPath(path);
            
            if (window.RobotAnimations) {
                RobotAnimations.playDiscovery();
                await this.delay(1000);
                
                // Animate robot along path
                this.animateRobotAlongPath(path, 0);
            }
        } else {
            if (window.RobotAnimations) RobotAnimations.playIdle();
            if (window.AudioSystem) AudioSystem.playDangerAlert();
            this.addLog('[ERROR] No safe path from (1,1)!');
            this.isAnalyzing = false;
        }
    },
    
    animateRobotAlongPath(path, index) {
        if (index >= path.length) {
            // Done
            if (window.RobotAnimations) RobotAnimations.playIdle();
            this.addLog(`[Success] NEXUS-7 reached destination.`);
            this.isAnalyzing = false;
            return;
        }
        
        const coord = path[index];
        const targetPos = Coordinator.toWorldPos(coord.r, coord.c);
        
        if (window.RobotAnimations) {
            RobotAnimations.playMoving(targetPos, coord, () => {
                this.addLog(`[Navigating] Reached (${coord.r},${coord.c})`);
                this.animateRobotAlongPath(path, index + 1);
            });
        }
    },
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

window.OutputPanel = OutputPanel;

// Export functionality
document.getElementById('btn-export').addEventListener('click', () => {
    const results = document.getElementById('inference-results').innerText;
    const path = document.getElementById('safe-path-display').innerText;
    const blob = new Blob([`WUMPUS WORLD AI REPORT\n\nRESULTS:\n${results}\n\nPATH:\n${path}`], {type: "text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wumpus_report.txt';
    a.click();
});
