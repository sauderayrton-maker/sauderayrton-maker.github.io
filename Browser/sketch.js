<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>p5.js Liquid OS Concept</title>
    <!-- Load p5.js and p5.sound/dom -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <style>
        body, html {
            margin: 0; padding: 0; overflow: hidden; background: #030303;
            font-family: 'Inter', system-ui, sans-serif;
            color: white; user-select: none;
        }
        /* Style the DOM elements mapped over the canvas */
        .dom-element {
            position: absolute;
            border: none;
            outline: none;
            border-radius: 0 0 16px 16px;
            background: rgba(255,255,255,0.95);
            transition: opacity 0.2s, box-shadow 0.2s;
            z-index: 10;
        }
        #liquid-editor {
            background: rgba(10, 10, 15, 0.6);
            backdrop-filter: blur(20px);
            color: #a5b4fc;
            font-family: 'Courier New', Courier, monospace;
            padding: 20px;
            resize: none;
            line-height: 1.6;
        }
        #liquid-browser {
            background: white;
        }
    </style>
</head>
<body>

<script>
// ==========================================
// CORE SYSTEM VARIABLES
// ==========================================
let apps = [];
let dock = [];
let theme = { bg1: [99, 102, 241], bg2: [236, 72, 153], glass: 20 };
let physics = { speed: 0.1, parallax: 0.05, phoneScrollTarget: 0, phoneScrollCurrent: 0 };
let blobs = [];
let toast = { msg: "", alpha: 0, timer: 0 };

// DOM Elements mapped to canvas
let domBrowser, domEditor;

// ==========================================
// SETUP & INITIALIZATION
// ==========================================
function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Background Blobs
    for(let i=0; i<3; i++) blobs.push({ x: random(width), y: random(height), r: random(400, 800), vx: random(-1, 1), vy: random(-1, 1) });

    // Initialize Apps (Tiling Engine objects)
    apps = [
        { id: 'browser', title: 'Liquid Web', active: true, flex: 2, tx: 0, ty: 0, tw: 0, th: 0, x: 0, y: 0, w: 0, h: 0, minW: 400, color: [255,255,255] },
        { id: 'editor', title: 'p5_Code', active: false, flex: 1.2, tx: 0, ty: 0, tw: 0, th: 0, x: 0, y: 0, w: 0, h: 0, minW: 300, color: [165, 180, 252] },
        { id: 'phone', title: 'Feed', active: false, flex: 0.8, tx: 0, ty: 0, tw: 0, th: 0, x: 0, y: 0, w: 0, h: 0, minW: 320, color: [250, 250, 250] },
        { id: 'settings', title: 'OS Settings', active: false, flex: 0.8, tx: 0, ty: 0, tw: 0, th: 0, x: 0, y: 0, w: 0, h: 0, minW: 300, color: [200, 200, 200] }
    ];

    // Initialize Taskbar Dock
    dock = [
        { id: 'browser', label: 'Web (Ctrl+B)', icon: '🌐' },
        { id: 'editor', label: 'Code (Ctrl+E)', icon: '💻' },
        { id: 'phone', label: 'Feed (Ctrl+M)', icon: '📱' },
        { id: 'settings', label: 'Config (Ctrl+S)', icon: '⚙️' }
    ];

    // Setup DOM Elements
    domBrowser = createElement('iframe');
    domBrowser.class('dom-element');
    domBrowser.id('liquid-browser');
    domBrowser.attribute('src', 'https://en.wikipedia.org/wiki/P5.js');

    domEditor = createElement('textarea');
    domEditor.class('dom-element');
    domEditor.id('liquid-editor');
    domEditor.value('// Welcome to pure p5.js OS\n\nfunction setup() {\n  createCanvas(windowWidth, windowHeight);\n  console.log("Locked in.");\n}\n\nfunction draw() {\n  background(0);\n}');
    domEditor.hide();

    calculateLayout();
    
    // Snap to initial layout instantly
    apps.forEach(app => { app.x = app.tx; app.y = app.ty; app.w = app.tw; app.h = app.th; });
}

// ==========================================
// MAIN DRAW LOOP
// ==========================================
function draw() {
    background(10, 10, 15);
    drawFluidBackground();
    
    calculateLayout(); // Continuously update target positions
    
    // Draw Apps
    let activeApps = apps.filter(a => a.active);
    for (let app of apps) {
        // Physics Interpolation (Lerp)
        app.x = lerp(app.x, app.tx, physics.speed);
        app.y = lerp(app.y, app.ty, physics.speed);
        app.w = lerp(app.w, app.tw, physics.speed);
        app.h = lerp(app.h, app.th, physics.speed);

        if (app.w > 10) { // Only draw if big enough (not fully closed)
            drawWindow(app);
            if (app.id === 'phone') drawPhoneApp(app);
            if (app.id === 'settings') drawSettingsApp(app);
        }
    }

    // Sync DOM elements to calculated p5 coords
    syncDOM();
    
    drawDock();
    drawToast();
}

// ==========================================
// LAYOUT ENGINE (TILING MATH)
// ==========================================
function calculateLayout() {
    let margin = 40;
    let gap = 20;
    let topOffset = 40;
    let bottomSpace = 120; // Room for dock
    let activeApps = apps.filter(a => a.active);
    
    if (activeApps.length === 0) return;

    let totalFlex = activeApps.reduce((sum, app) => sum + app.flex, 0);
    let totalAvailableWidth = width - (margin * 2) - (gap * (activeApps.length - 1));
    
    let currentX = margin;
    
    for (let app of apps) {
        if (app.active) {
            let targetW = (app.flex / totalFlex) * totalAvailableWidth;
            // Enforce constraints
            if (app.id === 'phone') targetW = min(targetW, 360);
            if (app.id === 'settings') targetW = min(targetW, 340);
            
            app.tw = targetW;
            app.th = height - margin - topOffset - bottomSpace;
            app.tx = currentX;
            app.ty = margin + topOffset;
            
            currentX += app.tw + gap;
        } else {
            // Shrink to nothing in the center of where it was
            app.tw = 0;
            app.tx = app.x + app.w/2; 
        }
    }
}

// ==========================================
// DRAWING FUNCTIONS
// ==========================================
function drawFluidBackground() {
    noStroke();
    drawingContext.filter = 'blur(100px)'; // Heavy canvas blur
    
    for(let i=0; i<blobs.length; i++) {
        let b = blobs[i];
        b.x += b.vx; b.y += b.vy;
        if(b.x < 0 || b.x > width) b.vx *= -1;
        if(b.y < 0 || b.y > height) b.vy *= -1;
        
        let col = i % 2 === 0 ? theme.bg1 : theme.bg2;
        fill(col[0], col[1], col[2], 150);
        circle(b.x, b.y, b.r);
    }
    drawingContext.filter = 'none'; // Reset filter for UI
}

function drawWindow(app) {
    push();
    translate(app.x, app.y);
    
    // Calculate Parallax based on mouse proximity to window center
    let centerX = app.x + app.w/2;
    let centerY = app.y + app.h/2;
    let pX = (mouseX - centerX) * physics.parallax;
    let pY = (mouseY - centerY) * physics.parallax;

    // Glass Shadow
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = 'rgba(0,0,0,0.5)';
    
    // Glass Background
    fill(255, 255, 255, theme.glass);
    stroke(255, 255, 255, 40);
    strokeWeight(1.5);
    rect(0, 0, app.w, app.h, 16);
    
    drawingContext.shadowBlur = 0; // Reset shadow

    // Chrome / Header (affected by parallax)
    translate(pX * 0.2, pY * 0.2); // Subtle shift for header
    
    // Top Bar
    fill(0, 0, 0, 100);
    noStroke();
    rect(0, 0, app.w, 40, 16, 16, 0, 0);
    
    // Window Controls
    fill(255, 95, 86); circle(20, 20, 12); // Close
    fill(255, 189, 46); circle(40, 20, 12); // Min
    fill(39, 201, 63); circle(60, 20, 12); // Max
    
    // Title
    fill(app.color[0], app.color[1], app.color[2]);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(app.title.toUpperCase(), app.w/2, 20);
    
    pop();
}

function syncDOM() {
    let browser = apps.find(a => a.id === 'browser');
    if (browser.active && browser.w > 100) {
        domBrowser.show();
        // Shift DOM down to account for the drawn header (40px)
        domBrowser.position(browser.x, browser.y + 40);
        domBrowser.size(browser.w, browser.h - 40);
        domBrowser.style('opacity', map(browser.w, 0, browser.tw, 0, 1));
    } else {
        domBrowser.hide();
    }

    let editor = apps.find(a => a.id === 'editor');
    if (editor.active && editor.w > 100) {
        domEditor.show();
        domEditor.position(editor.x, editor.y + 40);
        domEditor.size(editor.w, editor.h - 40);
        domEditor.style('opacity', map(editor.w, 0, editor.tw, 0, 1));
    } else {
        domEditor.hide();
    }
}

// ==========================================
// TIKTOK P5 ENGINE (The Phone App)
// ==========================================
function drawPhoneApp(app) {
    if (app.w < 200) return; // Wait until large enough
    push();
    translate(app.x, app.y + 40); // Move inside content area
    
    // Smooth scrolling physics
    physics.phoneScrollCurrent = lerp(physics.phoneScrollCurrent, physics.phoneScrollTarget, 0.1);
    let sY = physics.phoneScrollCurrent;
    let feedH = app.h - 40;

    // Create a clipping mask for the phone content
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.roundRect(0, 0, app.w, feedH, [0, 0, 16, 16]);
    drawingContext.clip();

    // Draw 3 "Generative Videos" stacked
    for (let i = 0; i < 4; i++) {
        let videoY = sY + (i * feedH);
        if (videoY > feedH || videoY + feedH < 0) continue; // Culling
        
        // Draw Generative Background for Video
        push();
        translate(0, videoY);
        fill(20 + i*40, 30, 50 + i*20);
        rect(0, 0, app.w, feedH);
        
        // Generative art specific to this "video"
        strokeWeight(2);
        for(let j=0; j<20; j++) {
            stroke(255, 100 + j*5);
            noFill();
            let phase = millis() * 0.001 + (i*10);
            bezier(
                map(sin(phase+j), -1, 1, 0, app.w), j * 30,
                app.w/2, app.h/2,
                mouseX - app.x, mouseY - app.y,
                map(cos(phase-j), -1, 1, 0, app.w), feedH - j*20
            );
        }

        // Overlay UI
        fill(0, 0, 0, 100);
        rect(0, feedH - 120, app.w, 120); // Gradient overlay
        
        fill(255);
        textAlign(LEFT, TOP);
        textSize(16); textStyle(BOLD);
        text("@p5_wizard_" + i, 20, feedH - 100);
        textSize(12); textStyle(NORMAL);
        text("Generative mathematics go brrr ✨ #codeart", 20, feedH - 75, app.w - 80, 50);
        
        // Buttons right side
        textAlign(CENTER, CENTER);
        textSize(24);
        fill(255);
        text("🤍", app.w - 30, feedH - 180);
        textSize(10); text(Math.floor(noise(i)*100) + "k", app.w - 30, feedH - 155);
        
        textSize(24);
        text("💬", app.w - 30, feedH - 110);
        textSize(10); text(Math.floor(noise(i+5)*1000), app.w - 30, feedH - 85);

        pop();
    }
    
    // Phone Notch
    fill(0);
    rect(app.w/2 - 60, -5, 120, 25, 0, 0, 12, 12);

    drawingContext.restore(); // End clip
    pop();
}

// ==========================================
// SETTINGS APP
// ==========================================
function drawSettingsApp(app) {
    if (app.w < 200) return;
    push();
    translate(app.x, app.y + 40);
    let pX = (mouseX - (app.x + app.w/2)) * physics.parallax;
    
    fill(255);
    textAlign(LEFT, TOP);
    textSize(24); textStyle(BOLD);
    text("Customization", 20 + pX, 20);
    
    textSize(10); fill(255, 150); text("THEME COLORS", 20 + pX, 70);
    
    // Color Buttons (Visual only, logic in mousePressed)
    let colors = [
        {name: "VAPOR", c1: [99,102,241], c2: [236,72,153]},
        {name: "MATRIX", c1: [16,185,129], c2: [6,78,59]},
        {name: "ICE", c1: [56,189,248], c2: [248,250,252]}
    ];
    
    for(let i=0; i<colors.length; i++) {
        let btnY = 90 + (i*50);
        fill(colors[i].c1[0], colors[i].c1[1], colors[i].c1[2], 50);
        stroke(colors[i].c1); strokeWeight(1);
        rect(20 + pX, btnY, app.w - 40, 40, 8);
        fill(255); noStroke(); textAlign(CENTER, CENTER); textSize(12);
        text(colors[i].name, app.w/2 + pX, btnY + 20);
    }
    
    textSize(10); fill(255, 150); textAlign(LEFT, TOP); text("TILING SPEED", 20 + pX, 260);
    // Draw fake slider
    fill(255, 50); rect(20 + pX, 280, app.w - 40, 6, 3);
    fill(255); circle(20 + pX + map(physics.speed, 0.05, 0.3, 0, app.w-40), 283, 14);

    pop();
}

// ==========================================
// MAGNIFYING DOCK
// ==========================================
function drawDock() {
    let dockW = (dock.length * 60) + 20;
    let dockX = width/2 - dockW/2;
    let dockY = height - 80;
    
    // Dock Background
    fill(255, 255, 255, 10);
    stroke(255, 255, 255, 30);
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(0,0,0,0.5)';
    rect(dockX, dockY, dockW, 60, 20);
    drawingContext.shadowBlur = 0;

    // Draw Icons with Magnification
    for(let i=0; i<dock.length; i++) {
        let item = dock[i];
        let appData = apps.find(a => a.id === item.id);
        let baseY = dockY + 10;
        let baseX = dockX + 20 + (i * 60);
        
        // Distance from mouse for magnification
        let d = dist(mouseX, mouseY, baseX + 20, baseY + 20);
        let scale = map(constrain(d, 0, 150), 0, 150, 1.8, 1);
        if (mouseY < dockY - 50) scale = 1; // Only magnify if close

        let sSize = 40 * scale;
        let sX = baseX - (sSize - 40)/2;
        let sY = baseY - (sSize - 40);

        // Icon bg
        fill(appData.active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)');
        stroke(255, 50);
        rect(sX, sY, sSize, sSize, 12 * scale);
        
        // Active indicator dot
        if (appData.active) {
            fill(255); noStroke();
            circle(baseX + 20, dockY + 55, 4);
        }

        // Emoji
        textAlign(CENTER, CENTER);
        textSize(20 * scale);
        fill(255);
        text(item.icon, sX + sSize/2, sY + sSize/2);
        
        // Hover Label
        if (d < 30 && mouseY > dockY - 20) {
            textSize(12);
            fill(0, 150); rect(sX + sSize/2 - textWidth(item.label)/2 - 10, sY - 30, textWidth(item.label) + 20, 24, 12);
            fill(255); text(item.label, sX + sSize/2, sY - 18);
        }
    }
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message) {
    toast.msg = message;
    toast.alpha = 255;
    toast.timer = millis() + 2000;
}

function drawToast() {
    if (toast.alpha <= 0) return;
    if (millis() > toast.timer) toast.alpha -= 10; // Fade out
    
    push();
    drawingContext.shadowBlur = 20; drawingContext.shadowColor = 'rgba(0,0,0,0.5)';
    fill(255, 255, 255, map(toast.alpha, 0, 255, 0, 30));
    stroke(255, map(toast.alpha, 0, 255, 0, 100));
    translate(width/2, height - 120 - map(toast.alpha, 0, 255, -20, 0));
    rect(-100, 0, 200, 40, 20);
    
    fill(255, toast.alpha); noStroke();
    textAlign(CENTER, CENTER); textSize(12); textStyle(BOLD); text(toast.msg, 0, 20);
    pop();
}

// ==========================================
// INTERACTION & EVENTS
// ==========================================
function toggleApp(id) {
    let app = apps.find(a => a.id === id);
    let activeCount = apps.filter(a => a.active).length;
    
    if (!app.active) {
        app.active = true;
        showToast(app.title + " Opened");
    } else {
        if (activeCount <= 1) {
            showToast("Cannot close last window");
            return;
        }
        app.active = false;
        showToast(app.title + " Closed");
    }
}

function mousePressed() {
    // Check Dock Clicks
    let dockW = (dock.length * 60) + 20;
    let dockX = width/2 - dockW/2;
    let dockY = height - 80;
    
    if (mouseY > dockY && mouseY < dockY + 60 && mouseX > dockX && mouseX < dockX + dockW) {
        let index = Math.floor((mouseX - dockX - 10) / 60);
        if (index >= 0 && index < dock.length) toggleApp(dock[index].id);
        return;
    }

    // Check Settings App Clicks (Color themes)
    let setApp = apps.find(a => a.id === 'settings');
    if (setApp.active && mouseX > setApp.x && mouseX < setApp.x + setApp.w && mouseY > setApp.y && mouseY < setApp.y + setApp.h) {
        let relX = mouseX - setApp.x; let relY = mouseY - setApp.y - 40;
        if (relX > 20 && relX < setApp.w - 20) {
            if (relY > 90 && relY < 130) { theme.bg1 = [99,102,241]; theme.bg2 = [236,72,153]; showToast("Vapor Theme Applied"); }
            if (relY > 140 && relY < 180) { theme.bg1 = [16,185,129]; theme.bg2 = [6,78,59]; showToast("Matrix Theme Applied");}
            if (relY > 190 && relY < 230) { theme.bg1 = [56,189,248]; theme.bg2 = [248,250,252]; showToast("Ice Theme Applied");}
            
            // Speed Slider Hitbox
            if(relY > 270 && relY < 300) {
                physics.speed = map(relX, 20, setApp.w-20, 0.05, 0.3);
                physics.speed = constrain(physics.speed, 0.05, 0.3);
            }
        }
    }
}

function mouseWheel(event) {
    // Scroll routing for Phone app
    let phone = apps.find(a => a.id === 'phone');
    if (phone.active && mouseX > phone.x && mouseX < phone.x + phone.w && mouseY > phone.y && mouseY < phone.y + phone.h) {
        physics.phoneScrollTarget -= event.delta * 0.5; // Invert and dampen
        let maxScroll = -((4 * (phone.h - 40)) - (phone.h - 40)); 
        physics.phoneScrollTarget = constrain(physics.phoneScrollTarget, maxScroll, 0);
    }
}

function mouseDragged() {
    // Allow dragging the speed slider in settings
    let setApp = apps.find(a => a.id === 'settings');
    if (setApp.active && mouseX > setApp.x && mouseX < setApp.x + setApp.w && mouseY > setApp.y && mouseY < setApp.y + setApp.h) {
        let relX = mouseX - setApp.x; let relY = mouseY - setApp.y - 40;
        if(relY > 270 && relY < 300) {
            physics.speed = map(relX, 20, setApp.w-20, 0.05, 0.3);
            physics.speed = constrain(physics.speed, 0.05, 0.3);
        }
    }
}

function keyPressed() {
    // Global Keyboard Shortcuts
    if (keyIsDown(CONTROL)) {
        if (keyCode === 66) { toggleApp('browser'); return false; } // B
        if (keyCode === 69) { toggleApp('editor'); return false; }  // E
        if (keyCode === 77) { toggleApp('phone'); return false; }   // M
        if (keyCode === 83) { toggleApp('settings'); return false; } // S
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calculateLayout();
}
</script>
</body>
</html>