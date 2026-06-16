import { createElement, render } from './dom.js'; 
import { createSignal } from './reactivity.js'; 


const TILE_SIZE = 64;
const GRID_W = 15; 
const GRID_H = 15;
const SPRITE_ROW_HEIGHT = 64; 

const ASSETS = {
    wall: './wall.jpeg',      
    box: './box.jpeg',        
    ground: './ground.jpg',  
    spritesheet: './sample.png' 
};

const ANIM_ROWS = {
    RUN: {
        up: 38,    
        left: 39,  
        down: 40,  
        right: 41  
    },
    IDLE: {
        up: 22,    
        left: 23,  
        down: 24,  
        right: 25  
    }
};

function generateMap() {
    const map = [];
    for (let y = 0; y < GRID_H; y++) {
        const row = [];
        for (let x = 0; x < GRID_W; x++) {
            if (x === 0 || x === GRID_W - 1 || y === 0 || y === GRID_H - 1) row.push(1); 
            else if (x % 2 === 0 && y % 2 === 0) row.push(1); 
            else if ((x < 3 && y < 3) || (x > GRID_W - 4 && y < 3) || 
                     (x < 3 && y > GRID_H - 4) || (x > GRID_W - 4 && y > GRID_H - 4)) row.push(0); 
            else row.push(Math.random() < 0.3 ? 2 : 0); 
        }
        map.push(row);
    }
    return map;
}

const MAP_DATA = generateMap();


function createPlayer(id, gx, gy) {
    const size = 64; 
    const initialSpeed = 2.5; 
    
    return {
        id,
        transform: { 
            x: gx * TILE_SIZE, 
            y: gy * TILE_SIZE, 
            baseSpeed: initialSpeed,
            speed: initialSpeed, 
            size: size
        },
        inputQueue: [], 
        animator: { 
            state: 'IDLE', 
            dir: 'down', 
            currentFrame: 0, 
            frameTimer: 0,
            runFrameDuration: 3,   
            idleFrameDuration: 16,  
            el: null 
        },
        behaviors: {
            ghostMode: false,     
            throwable: false,     
            detonator: false,     
            fastShoesLevel: 1,    
            bombs: {
                max: 1,           
                current: 0,       
                range: 2          
            }
        },
        stats: { lives: createSignal(3) } 
    };
}


function movementSystem(entity, dt) {
    const { transform, animator, inputQueue, behaviors } = entity;
    const size = transform.size;
    
    transform.speed = transform.baseSpeed + (behaviors.fastShoesLevel - 1) * 0.5;

    let dx = 0;
    let dy = 0;
    
    const activeInput = inputQueue.length > 0 ? inputQueue[0] : null;

    if (activeInput === 'up') { dy = -1; animator.dir = 'up'; }
    if (activeInput === 'down') { dy = 1; animator.dir = 'down'; }
    if (activeInput === 'left') { dx = -1; animator.dir = 'left'; }
    if (activeInput === 'right') { dx = 1; animator.dir = 'right'; }

    const isTileBlocked = (gx, gy) => {
        if (gy < 0 || gy >= GRID_H || gx < 0 || gx >= GRID_W) return true;
        if (behaviors.ghostMode) return false; 
        return MAP_DATA[gy][gx] !== 0;
    };

    
    const checkCollisionAt = (x, y) => {
        const p = 4; 
        const x1 = Math.floor((x + p) / TILE_SIZE);
        const x2 = Math.floor((x + size - p) / TILE_SIZE);
        const y1 = Math.floor((y + p) / TILE_SIZE);
        const y2 = Math.floor((y + size - p) / TILE_SIZE);
        
        return isTileBlocked(x1, y1) || isTileBlocked(x2, y1) || 
               isTileBlocked(x1, y2) || isTileBlocked(x2, y2);
    };

    
    const snapThreshold = 24; 

    
    if (dy !== 0 && dx === 0) {
        if (checkCollisionAt(transform.x, transform.y + dy * transform.speed * dt)) {
            const currentTileX = Math.floor((transform.x + size / 2) / TILE_SIZE);
            const targetX = currentTileX * TILE_SIZE;
            const diffX = transform.x - targetX;

            if (Math.abs(diffX) < snapThreshold) {
                
                dy = 0;
                dx = -Math.sign(diffX);
            }
        }
    }

    
    if (dx !== 0 && dy === 0) {
        if (checkCollisionAt(transform.x + dx * transform.speed * dt, transform.y)) {
            const currentTileY = Math.floor((transform.y + size / 2) / TILE_SIZE);
            const targetY = currentTileY * TILE_SIZE;
            const diffY = transform.y - targetY;

            if (Math.abs(diffY) < snapThreshold) {
                
                dx = 0;
                dy = -Math.sign(diffY);
            }
        }
    }

    
    const nextX = transform.x + dx * transform.speed * dt;
    const nextY = transform.y + dy * transform.speed * dt;

    if (!checkCollisionAt(nextX, transform.y)) transform.x = nextX;
    if (!checkCollisionAt(transform.x, nextY)) transform.y = nextY;

    
    const actualMoving = (dx !== 0 || dy !== 0);
    const nextState = actualMoving ? 'RUN' : 'IDLE';

    if (animator.state !== nextState) {
        animator.state = nextState;
        animator.currentFrame = 0;
        animator.frameTimer = 0;
    }

    const totalFrames = (animator.state === 'RUN') ? 8 : 2; 
    const currentDuration = (animator.state === 'RUN') ? animator.runFrameDuration : animator.idleFrameDuration;
    
    animator.frameTimer += dt;
    if (animator.frameTimer >= currentDuration) {
        animator.frameTimer = 0;
        animator.currentFrame = (animator.currentFrame + 1) % totalFrames;
    }
}


function renderSystem(entity) {
    const { transform, animator } = entity;
    if (animator.el) {
        animator.el.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0px)`;
        
        const row = ANIM_ROWS[animator.state][animator.dir];
        const posX = animator.currentFrame * TILE_SIZE; 
        const posY = row * SPRITE_ROW_HEIGHT;           
        
        animator.el.style.backgroundPosition = `-${posX}px -${posY}px`;
    }
}


const app = document.getElementById('app');
const container = createElement('div', { 
    id: 'game-container',
    style: `position: relative; width: ${GRID_W * TILE_SIZE}px; height: ${GRID_H * TILE_SIZE}px; border: 4px solid #fff; overflow: hidden; box-sizing: border-box; background-image: url('${ASSETS.ground}'); background-size: 64px 64px; image-rendering: pixelated;`
}); 

MAP_DATA.forEach((row, y) => row.forEach((cell, x) => {
    let styleStr = `position: absolute; width: 64px; height: 64px; left: ${x*64}px; top: ${y*64}px; box-sizing: border-box; margin: 0; padding: 0; background-size: cover; image-rendering: pixelated;`;
    if (cell === 1) {
        container.appendChild(createElement('div', { style: styleStr + `background-image: url('${ASSETS.wall}');` })); 
    } else if (cell === 2) {
        container.appendChild(createElement('div', { style: styleStr + `background-image: url('${ASSETS.box}');` })); 
    }
}));

const p1 = createPlayer('p1', 1, 1);
const pEl = createElement('div', { 
    style: `
        position: absolute; 
        width: 64px; 
        height: 64px; 
        box-sizing: border-box; 
        z-index: 10; 
        will-change: transform; 
        transition: none;
        background-image: url('${ASSETS.spritesheet}'); 
        background-repeat: no-repeat;
        background-size: 832px 3456px;
        image-rendering: pixelated;
    `
}); 

p1.animator.el = pEl;
container.appendChild(pEl);

render(container, app); 

function getKeyDirection(key) {
    if (key === 'ArrowUp' || key === 'w') return 'up';
    if (key === 'ArrowDown' || key === 's') return 'down';
    if (key === 'ArrowLeft' || key === 'a') return 'left';
    if (key === 'ArrowRight' || key === 'd') return 'right';
    return null;
}

window.addEventListener('keydown', e => {
    const dir = getKeyDirection(e.key);
    if (dir) {
        e.preventDefault();
        if (!p1.inputQueue.includes(dir)) {
            p1.inputQueue.push(dir);
        }
    }
});

window.addEventListener('keyup', e => {
    const dir = getKeyDirection(e.key);
    if (dir) {
        p1.inputQueue = p1.inputQueue.filter(d => d !== dir);
    }
});

let last = performance.now();
function loop(now) {
    const dt = Math.min((now - last) / 16.67, 2);
    last = now;
    
    movementSystem(p1, dt);
    renderSystem(p1);
    
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);