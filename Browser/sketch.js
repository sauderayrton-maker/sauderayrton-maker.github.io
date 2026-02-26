<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>p5.js Liquid OS - Pro Build</title>
    <!-- Load p5.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <style>
        body, html {
            margin: 0; padding: 0; overflow: hidden; background: #050505;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: white; user-select: none;
        }
        /* DOM Elements mapped perfectly to canvas */
        .app-dom-node {
            position: absolute; border: none; outline: none;
            border-radius: 0 0 16px 16px;
            background: rgba(255,255,255,0.98);
            transition: opacity 0.15s ease-out;
            z-index: 10;
        }
        #app-editor {
            background: rgba(15, 15, 20, 0.8); backdrop-filter: blur(10px);
            color: #c7d2fe; font-family: 'Fira Code', 'Courier New', monospace;
            padding: 20px; resize: none; line-height: 1.5; font-size: 14px;
        }
        /* Hide DOM elements when interacting with the p5 Dock */
        .dock-hover .app-dom-node { pointer-events: none; }
    </style>
</head>
<body>

<script>
// ==========================================
// SYSTEM CORE
// ==========================================
let os;

function setup() {
    createCanvas(windowWidth, windowHeight);
    os = new LiquidOS();
}

function draw() {
    os.update();
    os.render();
}

// ==========================================
// EVENT ROUTING
// ==========================================
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    os.layoutEngine.recalculate();
    os.bgBuffer = os.createBackgroundBuffer(); // Redraw background on resize
}

function mousePressed() { os.handleMousePress(); }
function mouseWheel(e) { os.handleScroll(e); }
function keyPressed() { os.handleKeyPress(); }

// ==========================================
// CLASSES
// ==========================================

class LiquidOS {
    constructor() {
        this.theme = { primary: [99, 102, 241], secondary: [236, 72, 153] };
        this.bgBuffer = this.createBackgroundBuffer();
        this.toastTimer = 0;
        this.toastMsg = "";
        
        // Initialize Apps
        this.apps = [
            new Window('browser', 'Liquid Web', 2, 'iframe', 'https://example.com'),
            new Window('editor', 'p5_Code', 1.2, 'textarea', '// Welcome to pure p5.js OS\n\nfunction setup() {\n  createCanvas(windowWidth, windowHeight);\n  console.log("Locked in.");\n}'),
            new Window('phone', 'Feed', 0.8, 'canvas_only', null),
            new Window('settings', 'Config', 0.8, 'canvas_only', null)
        ];
        
        // Default active states
        this.getApp('browser').open();
        this.getApp('phone').open();

        this.dock = new Dock(this);
        this.layoutEngine = new LayoutEngine(this.apps);
        this.layoutEngine.recalculate();
    }

    getApp(id) {
        return this.apps.find(a => a.id === id);
    }

    createBackgroundBuffer() {
        let pg = createGraphics(windowWidth, windowHeight);
        pg.noStroke();
        // Create a fast, static blurred background
        for (let i = 0; i < 5; i++) {
            pg.fill(i % 2 === 0 ? this.theme.primary[0] : this.theme.secondary[0], 
                    i % 2 === 0 ? this.theme.primary[1] : this.theme.secondary[1], 
                    i % 2 === 0 ? this.theme.primary[2] : this.theme.secondary[2], 100);
            pg.circle(random(width), random(height), random(600, 1000));
        }
        pg.drawingContext.filter = 'blur(80px)';
        // Draw one final circle to apply the blur filter inside the buffer
        pg.circle(width/2, height/2, 10); 
        return pg;
    }

    showToast(msg) {
        this.toastMsg = msg;
        this.toastTimer = 255; // Alpha
    }

    update() {
        this.layoutEngine.update();
        for (let app of this.apps) app.update();
        this.dock.update();
        
        // Manage iframe pointer events based on dock proximity
        if (mouseY > height - 100) document.body.classList.add('dock-hover');
        else document.body.classList.remove('dock-hover');
    }

    render() {
        // 1. Draw Static Blurred Background
        image(this.bgBuffer, 0, 0);

        // 2. Draw Floating Particles (Fast)
        noStroke();
        fill(255, 20);
        let t = millis() * 0.0005;
        for (let i = 0; i < 20; i++) {
            circle(noise(i, t)*width, noise(i+100, t)*height, noise(i)*30);
        }

        // 3. Draw Windows
        for (let app of this.apps) {
            if (app.w > 5) app.render(); // Only draw if not completely closed
        }

        // 4. Draw Dock & UI
        this.dock.render();
        this.renderToast();
    }

    renderToast() {
        if (this.toastTimer <= 0) return;
        this.toastTimer -= 5;
        
        push();
        translate(width/2, height - 120 - map(this.toastTimer, 0, 255, -20, 0));
        drawingContext.shadowBlur = 20; drawingContext.shadowColor = 'rgba(0,0,0,0.5)';
        fill(255, 255, 255, map(this.toastTimer, 0, 255, 0, 40));
        stroke(255, map(this.toastTimer, 0, 255, 0, 100));
        rect(-100, 0, 200, 40, 20);
        
        fill(255, this.toastTimer); noStroke();
        textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD); 
        text(this.toastMsg, 0, 20);
        pop();
    }

    handleMousePress() {
        if (this.dock.checkClicks()) return;
        for (let app of this.apps) app.checkClicks();
    }

    handleScroll(e) {
        let phone = this.getApp('phone');
        if (phone.isOpen && mouseX > phone.x && mouseX < phone.x + phone.w && mouseY > phone.y && mouseY < phone.y + phone.h) {
            phone.scrollTarget -= e.delta * 0.8;
            phone.scrollTarget = constrain(phone.scrollTarget, -1500, 0);
        }
    }

    handleKeyPress() {
        if (keyIsDown(CONTROL)) {
            if (keyCode === 66) this.getApp('browser').toggle();
            if (keyCode === 69) this.getApp('editor').toggle();
            if (keyCode === 77) this.getApp('phone').toggle();
            if (keyCode === 83) this.getApp('settings').toggle();
            this.layoutEngine.recalculate();
        }
    }
}

// ==========================================
// WINDOW CLASS
// ==========================================
class Window {
    constructor(id, title, flex, domType, domContent) {
        this.id = id;
        this.title = title;
        this.flex = flex;
        this.isOpen = false;
        
        // Physics
        this.x = width/2; this.y = height/2; this.w = 0; this.h = 0;
        this.tx = width/2; this.ty = height/2; this.tw = 0; this.th = 0;
        
        // App specific state
        this.scrollTarget = 0;
        this.scrollCurrent = 0;

        // DOM Element setup
        this.domNode = null;
        if (domType !== 'canvas_only') {
            this.domNode = createElement(domType);
            this.domNode.class('app-dom-node');
            this.domNode.id('app-' + id);
            if (domType === 'iframe') this.domNode.attribute('src', domContent);
            if (domType === 'textarea') this.domNode.value(domContent);
            this.domNode.hide();
        }
    }

    open() { this.isOpen = true; if(os) os.showToast(this.title + " Opened"); }
    close() { 
        let openCount = os.apps.filter(a => a.isOpen).length;
        if (openCount <= 1) { os.showToast("Cannot close last window"); return; }
        this.isOpen = false; 
        if(os) os.showToast(this.title + " Closed"); 
    }
    toggle() { this.isOpen ? this.close() : this.open(); }

    update() {
        // Physics lerp
        let speed = 0.15;
        this.x = lerp(this.x, this.tx, speed);
        this.y = lerp(this.y, this.ty, speed);
        this.w = lerp(this.w, this.tw, speed);
        this.h = lerp(this.h, this.th, speed);

        // Sync DOM
        if (this.domNode) {
            let isAnimating = abs(this.w - this.tw) > 2; // Threshold
            if (this.isOpen && this.w > 100) {
                this.domNode.show();
                this.domNode.position(this.x, this.y + 40);
                this.domNode.size(this.w, this.h - 40);
                
                // Fade out slightly during rapid movement for performance & aesthetics
                this.domNode.style('opacity', isAnimating ? '0.3' : '1');
            } else {
                this.domNode.hide();
            }
        }
    }

    render() {
        push();
        translate(this.x, this.y);
        
        // Window Glass Base
        drawingContext.shadowBlur = 30; drawingContext.shadowColor = 'rgba(0,0,0,0.4)';
        fill(255, 255, 255, 15); stroke(255, 255, 255, 40); strokeWeight(1);
        rect(0, 0, this.w, this.h, 16);
        drawingContext.shadowBlur = 0;

        // Header Chrome
        fill(0, 0, 0, 150); noStroke();
        rect(0, 0, this.w, 40, 16, 16, 0, 0);
        
        // Window Buttons & Hitboxes
        let mX = mouseX - this.x; let mY = mouseY - this.y;
        
        // Close Button (Red)
        let rHover = dist(mX, mY, 20, 20) < 6;
        fill(rHover ? color(255, 120, 110) : color(255, 95, 86)); circle(20, 20, 12);
        
        // Min/Max (Decorative for now)
        fill(255, 189, 46); circle(40, 20, 12);
        fill(39, 201, 63); circle(60, 20, 12);
        
        // Title
        fill(255); textAlign(CENTER, CENTER); textSize(12); textStyle(BOLD);
        text(this.title.toUpperCase(), this.w/2, 20);

        // App Specific Canvas Content
        if (this.id === 'phone' && this.w > 100) this.renderPhoneApp();
        if (this.id === 'settings' && this.w > 100) this.renderSettingsApp();

        pop();
    }

    renderPhoneApp() {
        this.scrollCurrent = lerp(this.scrollCurrent, this.scrollTarget, 0.1);
        let contentH = this.h - 40;
        
        drawingContext.save();
        drawingContext.beginPath();
        translate(0, 40);
        drawingContext.roundRect(0, 0, this.w, contentH, [0, 0, 16, 16]);
        drawingContext.clip();

        // Feed Items
        for (let i = 0; i < 4; i++) {
            let itemY = this.scrollCurrent + (i * contentH);
            if (itemY > contentH || itemY + contentH < 0) continue; // Culling

            push();
            translate(0, itemY);
            
            // Background
            fill(10 + i*20, 15, 25 + i*10); rect(0, 0, this.w, contentH);
            
            // Generative Math Art
            strokeWeight(1.5);
            let time = millis() * 0.001 + i*100;
            for(let j=0; j<15; j++) {
                stroke(255, 50 + j*10); noFill();
                beginShape();
                for(let x=0; x<this.w; x+=20) {
                    let y = contentH/2 + sin(x*0.01 + time + j)*50 + cos(x*0.02 - time)*50;
                    vertex(x, y);
                }
                endShape();
            }

            // Overlay UI
            fill(0, 150); rect(0, contentH - 120, this.w, 120);
            fill(255); textAlign(LEFT, TOP); textSize(16); textStyle(BOLD);
            text("@p5_master_" + i, 20, contentH - 100);
            textSize(13); textStyle(NORMAL); fill(200);
            text("Procedural wave engine 🌊 #creativecode", 20, contentH - 75, this.w - 80, 50);

            // Floating Hearts
            textSize(24); fill(255);
            text("🤍", this.w - 40, contentH - 160);
            text("💬", this.w - 40, contentH - 100);
            pop();
        }
        drawingContext.restore();
    }

    renderSettingsApp() {
        push();
        translate(0, 40);
        fill(255); textAlign(LEFT, TOP); textSize(24); textStyle(BOLD);
        text("System Preferences", 30, 30);
        
        textSize(12); fill(150); text("SYSTEM LOAD", 30, 80);
        
        // Fancy CPU Graph
        stroke(os.theme.primary); strokeWeight(2); noFill();
        beginShape();
        for(let i=0; i<this.w - 60; i+=10) {
            vertex(30 + i, 150 - noise(i*0.05, millis()*0.002)*50);
        }
        endShape();
        
        textSize(12); fill(150); noStroke(); text("ARCHITECTURE", 30, 180);
        fill(255); textSize(14);
        text("LiquidOS v2.0 (Pro Build)\np5.js v1.9.0 Engine\nES6 Object-Oriented Core", 30, 210);
        pop();
    }

    checkClicks() {
        if (!this.isOpen) return false;
        let mX = mouseX - this.x; let mY = mouseY - this.y;
        
        // Header bar clicks
        if (mY > 0 && mY < 40 && mX > 0 && mX < this.w) {
            // Close Button
            if (dist(mX, mY, 20, 20) < 10) {
                this.close();
                os.layoutEngine.recalculate();
                return true;
            }
        }
        return false;
    }
}

// ==========================================
// LAYOUT ENGINE
// ==========================================
class LayoutEngine {
    constructor(apps) {
        this.apps = apps;
        this.margin = 30;
        this.gap = 20;
        this.topOffset = 30;
        this.bottomSpace = 100;
    }

    recalculate() {
        let activeApps = this.apps.filter(a => a.isOpen);
        if (activeApps.length === 0) return;

        let totalFlex = activeApps.reduce((sum, app) => sum + app.flex, 0);
        let totalW = width - (this.margin * 2) - (this.gap * (activeApps.length - 1));
        
        let currentX = this.margin;
        
        for (let app of this.apps) {
            if (app.isOpen) {
                let targetW = (app.flex / totalFlex) * totalW;
                // Min/Max constraints
                if (app.id === 'phone' || app.id === 'settings') targetW = min(targetW, 400);
                
                app.tw = targetW;
                app.th = height - this.margin - this.topOffset - this.bottomSpace;
                app.tx = currentX;
                app.ty = this.margin + this.topOffset;
                
                currentX += app.tw + this.gap;
            } else {
                // Shrink out of existence perfectly
                app.tw = 0;
                app.tx = app.x + app.w/2; 
            }
        }
    }

    update() {
        // Continuous layout enforcement (if window resizes dynamically)
    }
}

// ==========================================
// MAC-STYLE DOCK
// ==========================================
class Dock {
    constructor(osRef) {
        this.os = osRef;
        this.items = [
            { id: 'browser', icon: '🌐' },
            { id: 'editor', icon: '💻' },
            { id: 'phone', icon: '📱' },
            { id: 'settings', icon: '⚙️' }
        ];
        this.baseSize = 48;
        this.maxSize = 80;
        this.range = 150; // How far the wave affects icons
    }

    update() {
        // Update math is handled in render for immediate mouse response
    }

    render() {
        let dockW = (this.items.length * (this.baseSize + 15)) + 30;
        let dockX = width/2 - dockW/2;
        let dockY = height - 70;
        
        // Dock Glass Panel
        drawingContext.shadowBlur = 25; drawingContext.shadowColor = 'rgba(0,0,0,0.5)';
        fill(255, 255, 255, 15); stroke(255, 255, 255, 40); strokeWeight(1);
        rect(dockX, dockY, dockW, this.baseSize + 16, 20);
        drawingContext.shadowBlur = 0;

        let currentX = dockX + 20;
        let isHoveringDockArea = mouseY > height - 120;

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let appData = this.os.getApp(item.id);
            
            // True macOS Wave Math
            let scale = 1;
            let iconCenterX = currentX + this.baseSize/2;
            
            if (isHoveringDockArea) {
                let distToMouseX = abs(mouseX - iconCenterX);
                if (distToMouseX < this.range) {
                    // Cosine interpolation for smooth curve
                    let factor = cos(map(distToMouseX, 0, this.range, 0, PI/2));
                    scale = map(factor, 0, 1, 1, this.maxSize / this.baseSize);
                }
            }

            let size = this.baseSize * scale;
            let yOffset = dockY + 8 - (size - this.baseSize); // Push up when growing
            
            // Draw Icon Background
            fill(appData.isOpen ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)');
            stroke(255, 60);
            rect(currentX, yOffset, size, size, 14 * scale);

            // Active indicator
            if (appData.isOpen) {
                fill(255); noStroke();
                circle(currentX + size/2, dockY + this.baseSize + 10, 4);
            }

            // Draw Emoji
            textAlign(CENTER, CENTER); textSize(size * 0.5); fill(255);
            text(item.icon, currentX + size/2, yOffset + size/2 + 2);

            // Hover Tooltip
            if (isHoveringDockArea && abs(mouseX - (currentX + size/2)) < size/2) {
                fill(0, 200); noStroke();
                let txtW = textWidth(appData.title) + 20;
                rect(currentX + size/2 - txtW/2, yOffset - 35, txtW, 26, 8);
                fill(255); textSize(12);
                text(appData.title, currentX + size/2, yOffset - 22);
            }

            // Advance X for next icon. Icons take up more space when magnified.
            currentX += size + 15;
        }
    }

    checkClicks() {
        let isHoveringDockArea = mouseY > height - 100;
        if (!isHoveringDockArea) return false;

        let dockW = (this.items.length * (this.baseSize + 15)) + 30;
        let dockX = width/2 - dockW/2;
        let currentX = dockX + 20;

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let distToMouseX = abs(mouseX - (currentX + this.baseSize/2));
            
            let scale = 1;
            if (distToMouseX < this.range) {
                let factor = cos(map(distToMouseX, 0, this.range, 0, PI/2));
                scale = map(factor, 0, 1, 1, this.maxSize / this.baseSize);
            }
            let size = this.baseSize * scale;

            if (abs(mouseX - (currentX + size/2)) < size/2) {
                this.os.getApp(item.id).toggle();
                this.os.layoutEngine.recalculate();
                return true;
            }
            currentX += size + 15;
        }
        return false;
    }
}
</script>
</body>
</html>