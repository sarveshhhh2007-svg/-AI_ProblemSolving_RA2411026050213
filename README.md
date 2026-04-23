# 🤖 WUMPUS WORLD AI NAVIGATOR
### *Intelligent Decision System using Propositional Logic Inference*

![Demo](docs/screenshots/robot_animation.gif)

---

## 📋 Problem Description

**Problem 15: Wumpus World Decision System**

Navigate a 4×4 Wumpus World grid using an AI agent that employs propositional logic to deduce safe paths while avoiding:
- **Pits** (detected via Breeze percepts in adjacent cells)
- **Wumpus** (detected via Stench percepts in adjacent cells)

The system accepts grid percepts as input and outputs:
1. Logical inference results
2. Identified safe cells
3. Optimal safe path from start to goal

---

## 🧠 Algorithms Implemented

### 1. **Propositional Logic Knowledge Base**
- **Inference Rules:**
  - `Breeze(x,y) → Pit(adjacent cells)`
  - `Stench(x,y) → Wumpus(adjacent cells)`
  - `¬Breeze(x,y) → ¬Pit(adjacent cells)`
  - `¬Stench(x,y) → ¬Wumpus(adjacent cells)`
  
- **Deduction Method:** Forward chaining with modus ponens

### 2. **A* Pathfinding Algorithm**
- **Heuristic:** Manhattan distance to goal
- **Constraint:** Only traverse confirmed safe cells
- **Output:** Optimal coordinate sequence (using BFS since unweighted)

### 3. **State Space Search**
- Explores all possible cell states
- Cross-references percepts to eliminate impossibilities
- Guarantees safe path if one exists

---

## 📥 Sample Input Format

```
Grid Percepts:
(1,1) → Safe
(1,2) → Breeze
(1,3) → Stench
(2,1) → Breeze
(2,2) → Safe
(2,3) → Unknown
```

---

## 📤 Sample Output Format

```
Inference Results:
• Cells near Breeze → Possible Pit nearby
• Cells near Stench → Possible Wumpus nearby
• Safe Cells → (1,1), (2,2)

Also print the safe path:
Safe Path: (1,1) → (2,1) → (2,2) → Goal
```

---

## ✨ Features

### 🎮 Interactive 3D Interface
- **Three.js powered environment** with orbital camera controls
- **Click-to-configure** percept system
- **Real-time visual feedback** for all cell states

### 🤖 NEXUS-7 AI Robot Agent
- Fully animated 3D character with:
  - Idle floating animation
  - Thinking mode (during inference)
  - Smooth path traversal
  - State-based visual responses
- Displays current coordinates on chest panel

### 🎨 Visual Encoding System
- **Breeze:** Swirling cyan wind particles
- **Stench:** Pulsing lime toxic gas
- **Safe:** Green holographic shield + light beam
- **Hazards:** Red warning overlays + danger symbols
- **Path:** Glowing blue energy trail

### 📊 Live Inference Display
- Step-by-step reasoning log
- Formatted output matching academic requirements
- Exportable analysis report

---

## 🚀 Execution Steps

### Local Development
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/problem_15_wumpus_world.git
cd problem_15_wumpus_world

# 2. Start local server
python -m http.server 8000

# 3. Open in browser
http://localhost:8000
```

### GitHub Pages Deployment
```bash
# 1. Push to GitHub
git add .
git commit -m "🚀 Deploy Wumpus World Navigator"
git push origin main

# 2. Enable GitHub Pages
# Settings → Pages → Source: main branch → Save

# 3. Access live site
https://yourusername.github.io/problem_15_wumpus_world/
```

---

## 🏗️ Technical Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **3D Engine:** Three.js (r128)
- **Animation:** GSAP 3.12
- **AI Logic:** Custom vanilla JavaScript implementation
- **Audio:** Web Audio API
- **Deployment:** GitHub Pages

---

## 🎯 Key Achievements

✅ **100% Academic Compliance:** Input/output matches sample exactly  
✅ **Robust AI Logic:** Handles all percept combinations correctly  
✅ **Professional UI/UX:** Industry-grade 3D interface  
✅ **Fully Responsive:** Works on desktop and tablets  
✅ **Zero Dependencies:** AI logic implemented from scratch  
✅ **Documented Codebase:** Comprehensive inline comments  

---


