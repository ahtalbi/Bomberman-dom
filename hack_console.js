// ============================================================
// 💣 BOMBERMAN HACK CONSOLE - Self-contained cheat table
// ============================================================
// Paste this ENTIRE script in F12 > Console
// Works WITHOUT modifying any project source files!
// ============================================================
// ✅ Works out of the box:
//    - hack.chatSpam()       - Flood the chat
//    - hack.moveSpam()       - Spam movement packets
//    - hack.bombSpam()       - Spam bomb drops (at YOUR position)
//    - hack.move(direction)  - Force move in a direction
//    - hack.bomb()           - Drop a bomb at your position
//
// ⚠️  For FULL features (tp, maxStats, setLives, pu),
//     add to source files & rebuild:
//    frontend/src/app/app.js:    window.__wss = wss;
//    frontend/src/ecs/game.js:   window.__engine = this; window.__myId = localPlayerId;
//    Then: cd frontend && npm run build
// ============================================================

(function() {
    'use strict';

    // ── State ──────────────────────────────────────────────
    let wss     = window.__wss || null;
    let engine  = window.__engine || null;
    let myId    = window.__myId || null;
    let foundWss = Boolean(window.__wss);

    // ── WebSocket Auto-Interception ────────────────────────
    if (!wss) {
        console.log('%c🔍 Scanning for WebSocket... (join a game!)', 'color:#ffd93d');

        // Patch the constructor to intercept ALL new WebSocket instances
        const OrigWebSocket = window.WebSocket;
        const origConstructor = OrigWebSocket.bind(window);
        const patchedConstructor = function(url, protocols) {
            const ws = new (Function.prototype.bind.call(OrigWebSocket, window, url, protocols))();
            
            // Capture on first usable socket (ws://localhost:5000)
            if (!wss && url && url.includes('localhost:5000')) {
                wss = ws;
                window.__wss = wss;
                foundWss = true;
                console.log('%c✅ WebSocket auto-captured!', 'color:green;font-weight:bold');
                setupIdExtractor(ws);
            }
            return ws;
        };
        patchedConstructor.prototype = OrigWebSocket.prototype;
        patchedConstructor.prototype.constructor = patchedConstructor;
        // Make static constants work
        ['CONNECTING','OPEN','CLOSING','CLOSED'].forEach(key => {
            patchedConstructor[key] = OrigWebSocket[key];
        });
        window.WebSocket = patchedConstructor;

        // Also patch send() as fallback for already-created sockets
        const origSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(data) {
            if (!wss && this.url && this.url.includes('localhost:5000')) {
                wss = this;
                window.__wss = wss;
                foundWss = true;
                console.log('%c✅ WebSocket captured via send()!', 'color:green;font-weight:bold');
                setupIdExtractor(this);
            }
            return origSend.call(this, data);
        };

        function setupIdExtractor(ws) {
            const origOnMsg = ws.onmessage;
            ws.onmessage = function(event) {
                try {
                    const msg = JSON.parse(event.data);
                    if (msg.type === 'game_started' && msg.yourPlayerId) {
                        myId = msg.yourPlayerId;
                        window.__myId = myId;
                        console.log('%c🎯 My Player ID: ' + myId, 'color:#4ecdc4;font-weight:bold');
                    }
                } catch(e) {}
                if (origOnMsg) origOnMsg.call(this, event);
            };
        }

    } else {
        console.log('%c✅ Using window.__wss', 'color:green');
        // Also capture myId from next game_started message
        const origOnMsg = wss.onmessage;
        wss.addEventListener('message', function(event) {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'game_started' && msg.yourPlayerId) {
                    myId = msg.yourPlayerId;
                    window.__myId = myId;
                    console.log('%c🎯 My Player ID: ' + myId, 'color:#4ecdc4;font-weight:bold');
                }
            } catch(e) {}
        });
    }

    // Try to find engine after game starts (periodic check)
    let engineCheckInterval = null;
    function startEngineWatchdog() {
        if (engine) return;
        if (engineCheckInterval) return;
        engineCheckInterval = setInterval(() => {
            // Look for engine in the DOM (GameEngine attaches to #game-container)
            const container = document.getElementById('game-container');
            if (container) {
                // Check if any React/engine internals are exposed
                // Otherwise we can't find it without source modification
                if (window.__engine) {
                    engine = window.__engine;
                    console.log('%c✅ Engine found via window.__engine', 'color:green');
                    if (engineCheckInterval) {
                        clearInterval(engineCheckInterval);
                        engineCheckInterval = null;
                    }
                }
            }
        }, 500);
        // Stop after 30s
        setTimeout(() => {
            if (engineCheckInterval) {
                clearInterval(engineCheckInterval);
                engineCheckInterval = null;
            }
        }, 30000);
    }
    startEngineWatchdog();

    // ── Send Helper ────────────────────────────────────────
    function send(type, payload) {
        if (!wss || wss.readyState !== WebSocket.OPEN) {
            console.error('❌ WebSocket not connected. Join a game first!');
            return false;
        }
        const msg = JSON.stringify({ type, payload: payload || {} });
        wss.send(msg);
        console.log(`%c📤 ${type}`, 'color:#4ecdc4', payload || '');
        return true;
    }

    // ── Get Local Player Entity (needs engine) ─────────────
    function getLocalPlayer() {
        if (!engine) return null;
        const entities = engine.world.query('Position', 'Player');
        for (const e of entities) {
            const p = engine.world.getComponent(e, 'Player');
            if (p && p.isLocal) return e;
        }
        return null;
    }

    // ── HACKS ──────────────────────────────────────────────
    window.hack = {

        // ── MOVEMENT ───────────────────────────────────────
        move: function(direction) {
            const dirs = ['up','down','left','right'];
            if (!dirs.includes(direction)) {
                console.error('❌ Use: hack.move("up"|"down"|"left"|"right")');
                return;
            }
            send('MOVE_STATE', { direction, isMoving: true });
            // Stop after 200ms
            setTimeout(() => {
                send('MOVE_STATE', { direction, isMoving: false });
            }, 200);
        },

        // ── DROP BOMB AT YOUR POSITION ─────────────────────
        bomb: function() {
            send('DROP_BOMB', {});
            console.log('%c💣 Bomb dropped at your position', 'color:#ff6b6b');
        },

        // ── TELEPORT (needs engine in source) ──────────────
        tp: function(x, y) {
            if (engine) {
                const entity = getLocalPlayer();
                if (!entity) return console.error('❌ Local player not found');
                const pos = engine.world.getComponent(entity, 'Position');
                if (pos) {
                    pos.gridX = x;
                    pos.gridY = y;
                    pos.x = x * 48;
                    pos.y = y * 48;
                }
                console.log(`%c🌀 Teleported to (${x}, ${y})`, 'color:#ff6b6b;font-weight:bold');
            } else {
                // Try via server (won't actually teleport, but sends move command)
                send('MOVE_STATE', { direction: 'down', isMoving: false });
                console.log('%c⚠️  TP needs window.__engine in source. Moved to (x,y) server-side won\'t work without it.', 'color:orange');
            }
        },

        // ── FAKE POWERUP (needs engine) ────────────────────
        pu: function(type) {
            const types = ['SPEED', 'BOMBS', 'FLAME'];
            const t = type ? type.toUpperCase() : types[Math.floor(Math.random() * 3)];
            if (!types.includes(t)) {
                console.error('❌ Type must be SPEED, BOMBS, or FLAME');
                return;
            }
            if (engine) {
                const entity = getLocalPlayer();
                if (!entity) return console.error('❌ Local player not found');
                const player = engine.world.getComponent(entity, 'Player');
                const vel = engine.world.getComponent(entity, 'Velocity');
                if (!player || !vel) return;

                // Apply locally (visual only, server won't know)
                if (t === 'SPEED') vel.speed = Math.min(vel.speed + 0.5, 8);
                else if (t === 'BOMBS') player.maxBombs += 1;
                else if (t === 'FLAME') player.bombRange += 1;

                engine.updateHudStats(entity);
                console.log(`%c⚡ +1 ${t} (local only)`, 'color:#ffd93d');
            } else {
                console.log('%c⚠️  PowerUp needs window.__engine in source', 'color:orange');
            }
        },

        // ── MAX STATS (needs engine) ───────────────────────
        maxStats: function() {
            if (!engine) {
                console.error('❌ Add window.__engine = this; to game.js line 93 then rebuild');
                return;
            }
            const entity = getLocalPlayer();
            if (!entity) return console.error('❌ Local player not found');
            
            const player = engine.world.getComponent(entity, 'Player');
            const vel = engine.world.getComponent(entity, 'Velocity');
            if (!player || !vel) return;

            player.lives = 99;
            player.maxBombs = 20;
            player.bombRange = 15;
            vel.speed = 8;

            engine.updateHudStats(entity);
            console.log('%c💪 MAX STATS: 99 lives, 20 bombs, range 15, speed 8', 'color:#ffd93d;font-weight:bold');
        },

        // ── SET LIVES (needs engine) ───────────────────────
        setLives: function(n) {
            if (!engine) return console.error('❌ Engine not found. Add window.__engine to source.');
            const entity = getLocalPlayer();
            if (!entity) return;
            const player = engine.world.getComponent(entity, 'Player');
            if (player) {
                player.lives = n;
                engine.updateHudStats(entity);
                console.log(`%c❤️ Lives set to ${n}`, 'color:#ff6b6b');
            }
        },

        // ── SPAM BOMBS ─────────────────────────────────────
        bombInterval: null,
        bombSpam: function(ms) {
            if (ms === undefined) ms = 50;
            if (ms < 10) ms = 10;
            this.stop();
            this.bombInterval = setInterval(() => {
                send('DROP_BOMB', {});
            }, ms);
            console.log(`%c💥💥 Bomb spam: every ${ms}ms`, 'color:#ff6b6b;font-weight:bold');
        },

        // ── SPAM MOVEMENT ──────────────────────────────────
        moveInterval: null,
        moveSpam: function(ms) {
            if (ms === undefined) ms = 30;
            if (ms < 10) ms = 10;
            this.stop();
            const dirs = ['up','down','left','right'];
            let i = 0;
            this.moveInterval = setInterval(() => {
                send('MOVE_STATE', {
                    direction: dirs[i % 4],
                    isMoving: true
                });
                i++;
            }, ms);
            console.log(`%c🏃 Movement spam: every ${ms}ms`, 'color:#4ecdc4');
        },

        // ── SPAM CHAT ──────────────────────────────────────
        chatInterval: null,
        chatSpam: function(ms) {
            if (ms === undefined) ms = 5;
            if (ms < 5) ms = 5;
            this.stop();
            this.chatInterval = setInterval(() => {
                if (!wss || wss.readyState !== WebSocket.OPEN) return;
                wss.send(JSON.stringify({
                    type: 'chat_message',
                    message: 'SPAM! ' + Math.random().toString(36).slice(2, 6)
                }));
            }, ms);
            console.log(`%c💬 Chat spam: every ${ms}ms`, 'color:#ffd93d');
        },

        // ── STOP ALL SPAMS ─────────────────────────────────
        stop: function() {
            if (this.bombInterval) { clearInterval(this.bombInterval); this.bombInterval = null; }
            if (this.moveInterval) { clearInterval(this.moveInterval); this.moveInterval = null; }
            if (this.chatInterval) { clearInterval(this.chatInterval); this.chatInterval = null; }
            console.log('%c🛑 All spams stopped', 'color:#ff6b6b;font-weight:bold');
        },

        // ── STATUS ─────────────────────────────────────────
        status: function() {
            console.log(`%c
╔═══════════════════════════════════════╗
║         💣 HACK STATUS               ║
╠═══════════════════════════════════════║
║  WebSocket: ${wss ? '✅ Connected' : '❌ Not found'}             ║
║  Engine:    ${engine ? '✅ Available' : '⚠️  Needs source mod'}       ║
║  My ID:     ${myId || '⚠️  Join a game'}              ║
╚═══════════════════════════════════════╝
            `, 'color:#4ecdc4;font-weight:bold');
        },

        // ── HELP ───────────────────────────────────────────
        help: function() {
            console.log(`%c
╔══════════════════════════════════════════════════════╗
║           💣 BOMBERMAN CHEAT TABLE                 ║
╠══════════════════════════════════════════════════════╣
║  🔹 WORKS NOW (no source mods needed):             ║
║     hack.bomb()              Drop bomb at your pos  ║
║     hack.move('up')          Move direction         ║
║     hack.bombSpam(ms)        Auto bomb spam         ║
║     hack.moveSpam(ms)        Auto move spam         ║
║     hack.chatSpam(ms)        Flood chat             ║
║     hack.stop()              Stop all spams         ║
║     hack.status()            Show connection status ║
║                                                   ║
║  🔸 NEED SOURCE MOD (+ npm run build):            ║
║     hack.tp(x, y)            Teleport              ║
║     hack.pu(type)            Get powerup           ║
║     hack.maxStats()          Max all stats         ║
║     hack.setLives(n)         Set lives             ║
║                                                   ║
║  Source mods (add to files before build):         ║
║   📄 app.js:  window.__wss = wss;                 ║
║   📄 game.js: window.__engine = this;             ║
║               window.__myId = localPlayerId;      ║
╚══════════════════════════════════════════════════════╝
            `, 'color:#ff6b6b;font-weight:bold');
        }
    };

    // ── Auto-detect ID from existing socket messages ──────
    if (wss && wss.readyState === WebSocket.OPEN) {
        // Can't replay messages, but we can listen going forward
        console.log('%c⏳ Waiting for next game to detect your ID...', 'color:#ffd93d');
    }

    // ── Final Report ──────────────────────────────────────
    console.log('%c✅ HACK CONSOLE LOADED', 'color:green;font-weight:bold');
    console.log('%c📌 Type hack.help() for all commands', 'color:#4ecdc4');
    console.log('%c📌 Type hack.status() to check connection', 'color:#4ecdc4');
    window.hack.help();
    window.hack.status();

})();