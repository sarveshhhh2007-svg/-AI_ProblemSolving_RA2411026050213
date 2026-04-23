/**
 * Input Panel Logic
 */

const InputPanel = {
    init() {
        const container = document.getElementById('grid-controls');
        
        for (let r = 1; r <= GRID_SIZE; r++) {
            for (let c = 1; c <= GRID_SIZE; c++) {
                const coordStr = Coordinator.toString(r, c);
                
                const wrapper = document.createElement('div');
                wrapper.className = 'cell-input';
                
                const label = document.createElement('label');
                label.innerText = `${coordStr} →`;
                
                const select = document.createElement('select');
                select.id = `select-${r}-${c}`;
                
                // Add options
                Object.values(PERCEPTS).forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p;
                    opt.innerText = p;
                    if (p === PERCEPTS.UNKNOWN) opt.selected = true;
                    select.appendChild(opt);
                });
                
                select.addEventListener('change', (e) => {
                    this.setPercept(r, c, e.target.value);
                });
                
                wrapper.appendChild(label);
                wrapper.appendChild(select);
                container.appendChild(wrapper);
            }
        }
        
        // Buttons
        document.getElementById('btn-analyze').addEventListener('click', () => {
            if (window.AudioSystem) AudioSystem.playAnalysisStart();
            if (window.OutputPanel) OutputPanel.runAnalysis();
        });
        
        document.getElementById('btn-reset').addEventListener('click', () => {
            this.resetGrid();
        });

        // Set professor's sample input as default
        setTimeout(() => this.setSampleInput(), 500);
    },
    
    setPercept(r, c, val) {
        KnowledgeBase.setPercept(r, c, val);
        const select = document.getElementById(`select-${r}-${c}`);
        if (select) select.value = val;
        
        if (window.CellEffects) {
            CellEffects.applyPerceptEffect(r, c, val);
        }
        if (window.AudioSystem) AudioSystem.playClick();
    },
    
    resetGrid() {
        KnowledgeBase.reset();
        for (let r = 1; r <= GRID_SIZE; r++) {
            for (let c = 1; c <= GRID_SIZE; c++) {
                this.setPercept(r, c, PERCEPTS.UNKNOWN);
                if (window.CellEffects) {
                    const cell = Grid.getCellMesh(r, c);
                    CellEffects.resetCell(cell);
                }
            }
        }
        if (window.OutputPanel) OutputPanel.reset();
        if (window.RobotAnimations) RobotAnimations.playIdle();
        
        // Reset robot position
        if (window.Robot) {
            const startPos = Coordinator.toWorldPos(1, 1);
            Robot.group.position.set(startPos.x, startPos.y, startPos.z);
            Robot.updateCoordDisplay(1, 1);
        }
    },
    
    setSampleInput() {
        this.resetGrid();
        this.setPercept(1, 1, PERCEPTS.SAFE);
        this.setPercept(1, 2, PERCEPTS.BREEZE);
        this.setPercept(1, 3, PERCEPTS.STENCH);
        this.setPercept(2, 1, PERCEPTS.BREEZE);
        this.setPercept(2, 2, PERCEPTS.SAFE);
        this.setPercept(2, 3, PERCEPTS.UNKNOWN);
        // Others are already unknown
    }
};

window.InputPanel = InputPanel;
