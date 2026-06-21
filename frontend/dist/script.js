/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./mini-framework/dom.js"
/*!*******************************!*\
  !*** ./mini-framework/dom.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   render: () => (/* binding */ render)
/* harmony export */ });
function createElement(type, props, ...children) {
  if (typeof type === "function") {
    return type({
      ...(props || {}),
      children
    });
  }
  const ele = document.createElement(type);
  for (const key in props || {}) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const eventName = key.slice(2).toLowerCase();
      ele.addEventListener(eventName, props[key]);
    } else {
      ele.setAttribute(key, props[key]);
    }
  }
  const flatChildren = children.flat(Infinity);
  ele.append(...flatChildren.filter(child => child !== null && child !== undefined && child !== false));
  return ele;
}
function render(element, container) {
  container.replaceChildren(element);
}

/***/ },

/***/ "./mini-framework/mini-framework.js"
/*!******************************************!*\
  !*** ./mini-framework/mini-framework.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router.js */ "./mini-framework/router.js");

let router = new _router_js__WEBPACK_IMPORTED_MODULE_0__.Router();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);

/***/ },

/***/ "./mini-framework/reactivity.js"
/*!**************************************!*\
  !*** ./mini-framework/reactivity.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createEffect: () => (/* binding */ createEffect),
/* harmony export */   createSignal: () => (/* binding */ createSignal)
/* harmony export */ });
const effectStack = [];
let activeEffect = null;
function createSignal(initialValue) {
  let value = initialValue;
  const effects = new Set();
  const Read = () => {
    if (activeEffect) {
      effects.add(activeEffect);
    }
    return value;
  };
  const Write = newValue => {
    if (typeof newValue === "function") {
      let fn = newValue;
      value = fn(value);
    } else value = newValue;
    effects.forEach(effect => effect());
  };
  return [Read, Write];
}
function createEffect(effect) {
  effectStack.push(effect);
  activeEffect = effect;
  effect();
  effectStack.pop();
  activeEffect = effectStack[effectStack.length - 1] || null;
}

/***/ },

/***/ "./mini-framework/router.js"
/*!**********************************!*\
  !*** ./mini-framework/router.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Router: () => (/* binding */ Router)
/* harmony export */ });
class Router {
  #Routes = Object.create(null);
  #FirstResolve = false;
  on(path, handler) {
    this.#Routes[path] = handler;
    return this;
  }
  navigate(path, {
    history = "push"
  } = {}) {
    path = path.startsWith("/") ? path : "/" + path;
    return navigation.navigate(path, {
      history
    });
  }
  resolve(path = location.pathname) {
    const fn = this.#Routes[path];
    if (!fn) {
      return false;
    }
    fn({
      url: new URL(location.href)
    });
    return true;
  }
  listen(onError404) {
    navigation.addEventListener("navigate", event => {
      const url = new URL(event.destination.url);
      event.intercept({
        handler: () => {
          console.log(url.pathname, this.#Routes);
          const fn = this.#Routes[url.pathname];
          if (!fn) {
            onError404();
            return;
          }
          fn({
            url
          });
        }
      });
    });
    if (!this.#FirstResolve) {
      this.resolve();
      this.#FirstResolve = true;
    }
    return this;
  }
}

/***/ },

/***/ "./src/app/app.js"
/*!************************!*\
  !*** ./src/app/app.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _mini_framework_mini_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/mini-framework */ "./mini-framework/mini-framework.js");
/* harmony import */ var _pages_register__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pages/register */ "./src/pages/register.jsx");
/* harmony import */ var _utils_sound__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/sound */ "./src/utils/sound.js");
/* harmony import */ var _utils_websocket_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/websocket.js */ "./src/utils/websocket.js");





const root = document.getElementById("root");
const wss = new WebSocket(`ws://${window.location.hostname}:5000`);
const sound = new _utils_sound__WEBPACK_IMPORTED_MODULE_3__["default"]("./assets/sounds/background_music.mp3");
sound.init();
_mini_framework_mini_framework__WEBPACK_IMPORTED_MODULE_1__["default"].on("/", () => {
  document.body.className = "register-page";
  (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_register__WEBPACK_IMPORTED_MODULE_2__["default"], {
    wss: wss
  }), root);
});
_mini_framework_mini_framework__WEBPACK_IMPORTED_MODULE_1__["default"].listen(() => {
  alert("404");
});
wss.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  (0,_utils_websocket_js__WEBPACK_IMPORTED_MODULE_4__.handleWebsocket)(message, root, wss);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (wss);

/***/ },

/***/ "./src/components/chat.jsx"
/*!*********************************!*\
  !*** ./src/components/chat.jsx ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setMessages: () => (/* binding */ setMessages)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/reactivity */ "./mini-framework/reactivity.js");
/* harmony import */ var _app_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app/app */ "./src/app/app.js");



const [messages, setMessages] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)([]);

function ChatPlayers() {
  const messagesContainer = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "messages"
  });
  (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
    const msgs = messages();
    messagesContainer.innerHTML = "";
    for (let msg of msgs) {
      const p = document.createElement("p");
      p.textContent = msg;
      messagesContainer.appendChild(p);
      if (messagesContainer.children.length > 20) {
        messagesContainer.removeChild(messagesContainer.firstElementChild);
        msgs.unshift();
      }
      ;
    }
    ;
  });
  function broadcastMessage(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let message = formData.get("message").trim();
    if (!message || message.length > 20) {
      e.target.reset();
      return;
    }
    ;
    _app_app__WEBPACK_IMPORTED_MODULE_2__["default"].send(JSON.stringify({
      type: "chat_message",
      message: message
    }));
    e.target.reset();
  }
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "chat",
    onSubmit: broadcastMessage
  }, messagesContainer, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", null, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    name: "message",
    placeholder: "type to the other players ...",
    maxlength: "20"
  }), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "submit"
  }, "send")));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatPlayers);

/***/ },

/***/ "./src/ecs/components.js"
/*!*******************************!*\
  !*** ./src/ecs/components.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BehaviorComponent: () => (/* binding */ BehaviorComponent),
/* harmony export */   BombComponent: () => (/* binding */ BombComponent),
/* harmony export */   ExplosionComponent: () => (/* binding */ ExplosionComponent),
/* harmony export */   InputComponent: () => (/* binding */ InputComponent),
/* harmony export */   PlayerComponent: () => (/* binding */ PlayerComponent),
/* harmony export */   PositionComponent: () => (/* binding */ PositionComponent),
/* harmony export */   PowerUpComponent: () => (/* binding */ PowerUpComponent),
/* harmony export */   RenderableComponent: () => (/* binding */ RenderableComponent),
/* harmony export */   VelocityComponent: () => (/* binding */ VelocityComponent)
/* harmony export */ });
// /src/ecs/components.js

const PositionComponent = (gx, gy, tileSize = 64) => ({
  gridX: gx,
  gridY: gy,
  x: gx * tileSize,
  y: gy * tileSize,
  targetX: gx * tileSize,
  targetY: gy * tileSize
});
const VelocityComponent = (baseSpeed = 2.5) => ({
  baseSpeed: baseSpeed,
  speed: baseSpeed,
  isMoving: false,
  direction: 'down'
});
const InputComponent = () => ({
  inputQueue: []
});
const RenderableComponent = (el, frameWidth = 64, frameHeight = 64, totalFrames = 4, fps = 12) => ({
  el: el,
  frameWidth: frameWidth,
  frameHeight: frameHeight,
  currentFrame: 0,
  totalFrames: totalFrames,
  runFrames: 4,
  idleFrames: 2,
  fps: fps,
  idleFps: 4,
  lastFrameTime: 0,
  row: 0,
  state: 'IDLE',
  lastState: 'IDLE'
});
const PlayerComponent = (id, charType, isLocal = false) => ({
  id: id,
  charType: charType,
  isLocal: isLocal
});
const BombComponent = (ownerId, timer = 2000, range = 4) => ({
  ownerId: ownerId,
  timer: timer,
  range: range,
  exploded: false
});
const ExplosionComponent = (duration = 500) => ({
  duration: duration
});
const PowerUpComponent = type => ({
  type: type,
  pickedUp: false
});
const BehaviorComponent = () => ({
  ghostMode: false,
  throwable: false,
  detonator: false,
  fastShoesLevel: 1,
  bombs: {
    max: 1,
    current: 0,
    range: 2
  }
});

/***/ },

/***/ "./src/ecs/game.js"
/*!*************************!*\
  !*** ./src/ecs/game.js ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameEngine: () => (/* binding */ GameEngine),
/* harmony export */   getPlayerName: () => (/* binding */ getPlayerName),
/* harmony export */   setPlayerName: () => (/* binding */ setPlayerName)
/* harmony export */ });
/* harmony import */ var _world_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./world.js */ "./src/ecs/world.js");
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components.js */ "./src/ecs/components.js");
/* harmony import */ var _systems_movementSystem_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./systems/movementSystem.js */ "./src/ecs/systems/movementSystem.js");
/* harmony import */ var _systems_renderSystem_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./systems/renderSystem.js */ "./src/ecs/systems/renderSystem.js");
/* harmony import */ var _systems_bombSystem_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./systems/bombSystem.js */ "./src/ecs/systems/bombSystem.js");
/* harmony import */ var _systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./systems/damageSystem.js */ "./src/ecs/systems/damageSystem.js");
/* harmony import */ var _pages_menu_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pages/menu.jsx */ "./src/pages/menu.jsx");
/* harmony import */ var _mini_framework_dom_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../mini-framework/dom.js */ "./mini-framework/dom.js");
/* harmony import */ var _systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./systems/powerUpSystem.js */ "./src/ecs/systems/powerUpSystem.js");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../pages/game */ "./src/pages/game.jsx");










const TILE_SIZE = 64;
const ANIMATION_ROWS = {
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
class GameEngine {
  constructor(canvasContainer, mapData, socket) {
    this.container = canvasContainer;
    this.mapData = mapData;
    this.socket = socket;
    this.world = new _world_js__WEBPACK_IMPORTED_MODULE_0__.World();
    this.localPlayerEntity = null;
    this.playerEntities = new Map();
    this.playerInfo = new Map(); // Store original player data like nickname
    this.lastTime = 0;
    this.removeInputListeners = null;
    this.animationFrame = null;
    this.running = false;
    this.claimedPowerUps = new Set();
    // State flag to prevent multiple loss modal renders (The Loop Trap fix)
    this.lossModalTriggered = false;
    // Flag to track if input should be disabled
    this.inputEnabled = true;
    // Flag to stop the game loop once a winner is decided
    this.gameEnded = false;
  }
  init(localPlayerId, allPlayers) {
    this.totalPlayers = allPlayers.length;
    const normalizedLocalPlayerId = String(localPlayerId);
    allPlayers.forEach(pData => {
      const playerId = String(pData.id);
      const playerEntity = this.world.createEntity();
      this.playerInfo.set(playerId, pData); // Store original player data
      const playerDiv = document.createElement('div');
      const color = pData.color || "white";
      playerDiv.className = `player player-${color}`;
      playerDiv.style.position = 'absolute';
      playerDiv.style.zIndex = '10';
      playerDiv.style.willChange = 'transform';
      this.container.appendChild(playerDiv);
      const sx = pData.x || 1;
      const sy = pData.y || 1;
      this.world.addComponent(playerEntity, 'Position', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.PositionComponent)(sx, sy, TILE_SIZE));
      this.world.addComponent(playerEntity, 'Velocity', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.VelocityComponent)(2.5));
      this.world.addComponent(playerEntity, 'Renderable', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.RenderableComponent)(playerDiv, 64, 64, 4, 12));
      const isLocal = playerId === normalizedLocalPlayerId;
      const playerComp = (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.PlayerComponent)(playerId, color, isLocal);
      playerComp.lives = 3;
      playerComp.maxBombs = 1;
      playerComp.bombRange = 4;
      this.world.addComponent(playerEntity, 'Player', playerComp);
      this.playerEntities.set(playerId, playerEntity);
      if (isLocal) {
        this.localPlayerEntity = playerEntity;
        this.world.addComponent(playerEntity, 'Input', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.InputComponent)());
        this.updateHudStats(playerEntity);
        this.setupInput();
      }
    });
    if (this.localPlayerEntity === null) {
      console.warn("[GameEngine] Local player was not found", {
        localPlayerId,
        players: allPlayers.map(player => player.id)
      });
    }
    this.registerSystems();
    this.running = true;
    this.lastTime = performance.now();
    this.animationFrame = requestAnimationFrame(now => this.gameLoop(now));
  }
  setupInput() {
    const input = this.world.getComponent(this.localPlayerEntity, 'Input');
    if (!input) return;
    const getKeyDirection = key => {
      if (key === 'ArrowUp' || key === 'w' || key === 'Z' || key === 'z') return 'up';
      if (key === 'ArrowDown' || key === 's' || key === 'S') return 'down';
      if (key === 'ArrowLeft' || key === 'a' || key === 'Q' || key === 'q') return 'left';
      if (key === 'ArrowRight' || key === 'd' || key === 'D') return 'right';
      return null;
    };
    const handleKeyDown = e => {
      // INPUT DISABLED: Immediately ignore all keyboard inputs when player is dead
      if (!this.inputEnabled) return;
      const dir = getKeyDirection(e.key);
      if (dir && input) {
        e.preventDefault();
        if (!input.inputQueue.includes(dir)) {
          input.inputQueue.unshift(dir);
        }
      }
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.dropBomb();
      }
    };
    const handleKeyUp = e => {
      // INPUT DISABLED: Immediately ignore all keyboard inputs when player is dead
      if (!this.inputEnabled) return;
      const dir = getKeyDirection(e.key);
      if (dir && input) {
        input.inputQueue = input.inputQueue.filter(d => d !== dir);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    this.removeInputListeners = () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }
  dropBomb() {
    if (this.localPlayerEntity === null) return;
    const pos = this.world.getComponent(this.localPlayerEntity, 'Position');
    const player = this.world.getComponent(this.localPlayerEntity, 'Player');
    const currentBombs = this.world.query('Position', 'Bomb').filter(bEntity => {
      return this.world.getComponent(bEntity, 'Bomb').ownerId === player.id;
    });
    if (currentBombs.length >= player.maxBombs) return;
    const created = this.createBomb(player.id, pos.gridX, pos.gridY, player.bombRange);
    if (!created) return;
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'drop_bomb',
        payload: {
          id: player.id,
          x: pos.gridX,
          y: pos.gridY,
          range: player.bombRange
        }
      }));
    }
  }
  createBomb(ownerId, gridX, gridY, range) {
    const exists = this.world.query('Position', 'Bomb').some(entity => {
      const pos = this.world.getComponent(entity, 'Position');
      const bomb = this.world.getComponent(entity, 'Bomb');
      return bomb.ownerId === ownerId && pos.gridX === gridX && pos.gridY === gridY;
    });
    if (exists) return false;
    const bombEntity = this.world.createEntity();
    const bombDiv = document.createElement('div');
    bombDiv.className = 'bomb';
    bombDiv.style.position = 'absolute';
    bombDiv.style.left = `${gridX * TILE_SIZE}px`;
    bombDiv.style.top = `${gridY * TILE_SIZE}px`;
    bombDiv.style.zIndex = '6';
    this.container.appendChild(bombDiv);
    this.world.addComponent(bombEntity, 'Position', {
      gridX,
      gridY
    });
    const bombComp = (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.BombComponent)(ownerId, 2000, range);
    bombComp.el = bombDiv;
    this.world.addComponent(bombEntity, 'Bomb', bombComp);
    return true;
  }
  handleRemoteMove(payload) {
    if (!payload || !payload.id) {
      console.warn("[handleRemoteMove] Invalid payload:", payload);
      return;
    }
    let entity = this.playerEntities.get(String(payload.id));
    if (entity === undefined) {
      console.warn(`[handleRemoteMove] Entity not found for player ${payload.id}. Available players:`, Array.from(this.playerEntities.keys()));
      return;
    }
    if (entity === this.localPlayerEntity) {
      console.log(`[handleRemoteMove] Ignoring local player update for ${payload.id}`);
      return;
    }
    const pos = this.world.getComponent(entity, 'Position');
    const vel = this.world.getComponent(entity, 'Velocity');
    const renderable = this.world.getComponent(entity, 'Renderable');
    if (!pos || !vel || !renderable) {
      console.warn(`[handleRemoteMove] Missing components for player ${payload.id}:`, {
        pos: !!pos,
        vel: !!vel,
        renderable: !!renderable
      });
      return;
    }
    console.log(`[handleRemoteMove] Updating player ${payload.id} to (${payload.gridX}, ${payload.gridY})`);
    vel.direction = payload.direction || vel.direction;
    vel.isMoving = payload.isMoving;
    pos.gridX = payload.gridX;
    pos.gridY = payload.gridY;
    pos.targetX = payload.x;
    pos.targetY = payload.y;
    renderable.state = payload.state || (payload.isMoving ? 'RUN' : 'IDLE');
  }
  handleRemoteBomb(payload) {
    if (!payload || !payload.id) return;
    this.createBomb(payload.id, payload.x, payload.y, payload.range || 4);
  }
  handleRemotePowerUpPicked(payload) {
    if (!payload || payload.x === undefined || payload.y === undefined) return;
    this.removePowerUpAt(payload.x, payload.y);
    const entity = this.playerEntities.get(String(payload.id));
    if (entity === undefined) return;
    if (payload.type === 'HEART') {
      const player = this.world.getComponent(entity, 'Player');
      if (!player || payload.newLives === undefined) return;
      player.lives = payload.newLives;
      if (entity === this.localPlayerEntity) {
        this.updateHudStats(entity);
      }
      console.log(`[Remote PowerUp Pickup] Player ${payload.id} picked up heart. New lives: ${payload.newLives}`);
      return;
    }
    if (entity === this.localPlayerEntity) return;
    this.applyPowerUp(entity, payload.type);
  }
  removePowerUpAt(gridX, gridY) {
    this.claimedPowerUps.add(`${gridX},${gridY}`);
    const powerUps = this.world.query('Position', 'PowerUp');
    for (const entity of powerUps) {
      const pos = this.world.getComponent(entity, 'Position');
      const powerUp = this.world.getComponent(entity, 'PowerUp');
      if (!pos || !powerUp) continue;
      if (pos.gridX === gridX && pos.gridY === gridY) {
        powerUp.pickedUp = true;
        if (powerUp.el && powerUp.el.parentNode) {
          powerUp.el.parentNode.removeChild(powerUp.el);
        }
        this.world.destroyEntity(entity);
        return;
      }
    }
  }
  applyPowerUp(entity, type) {
    const player = this.world.getComponent(entity, 'Player');
    const velocity = this.world.getComponent(entity, 'Velocity');
    if (!player || !velocity) return;
    if (type === 'SPEED') {
      velocity.speed = Math.min(velocity.speed + 1, 8);
    } else if (type === 'BOMBS') {
      player.maxBombs = player.maxBombs ? player.maxBombs + 1 : 2;
    } else if (type === 'FLAME') {
      player.bombRange = player.bombRange ? player.bombRange + 1 : 5;
    } else if (type === 'HEART') {
      // HEART power-up: increment lives (cap at 3)
      player.lives = Math.min((player.lives || 0) + 1, 3);
    }
  }
  registerSystems() {
    const updateMapCell = (x, y, newValue) => {
      if (!this.mapData[y]) return;
      this.mapData[y][x] = newValue;
      const tile = this.container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      if (!tile) return;
      tile.className = 'tile tile-floor';
      tile.style.backgroundImage = 'url("./assets/blocks/block_floor.jpg")';
    };
    const destroyBoxCallback = (x, y) => {
      if (this.claimedPowerUps.has(`${x},${y}`)) return;
      (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_8__.spawnPowerUp)(this.world, x, y, this.container, TILE_SIZE);
    };
    const onPlayerHurt = (entity, id, remainingLives) => {
      // CRITICAL: Only send player_died if THIS IS THE LOCAL PLAYER.
      // The ECS damageSystem runs on ALL clients, so every client detects
      // every collision. We must guard the WebSocket message to prevent
      // incorrect death reports.
      if (remainingLives <= 0 && entity === this.localPlayerEntity && this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'player_died'
        }));
      }
      // Update the HUD only for the local player.
      if (entity === this.localPlayerEntity) {
        (0,_pages_game__WEBPACK_IMPORTED_MODULE_9__.setLives)(remainingLives);
      }
    };
    const onPowerUpPicked = (id, type, x, y) => {
      this.claimedPowerUps.add(`${x},${y}`);
      if (this.localPlayerEntity === null) return;
      const entity = this.playerEntities.get(String(id));
      const playerComp = entity ? this.world.getComponent(entity, 'Player') : null;
      if (type === 'HEART') {
        if (playerComp && entity === this.localPlayerEntity) {
          (0,_pages_game__WEBPACK_IMPORTED_MODULE_9__.setLives)(playerComp.lives);
        }
      } else {
        if (playerComp && entity === this.localPlayerEntity) {
          this.updateHudStats(this.localPlayerEntity);
        }
      }
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'powerup_picked',
          payload: {
            id,
            type,
            x,
            y,
            ...(type === 'HEART' ? {
              newLives: playerComp ? playerComp.lives : 0
            } : {})
          }
        }));
      }
    };
    this.world.broadcastMovement = (entity, x, y, gridX, gridY, direction, isMoving) => {
      const player = this.world.getComponent(entity, 'Player');
      if (!player || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
      this.socket.send(JSON.stringify({
        type: 'move_state',
        payload: {
          id: player.id,
          x,
          y,
          gridX,
          gridY,
          direction,
          isMoving,
          state: isMoving ? 'RUN' : 'IDLE'
        }
      }));
    };
    this.world.addSystem((w, dt, now) => (0,_systems_movementSystem_js__WEBPACK_IMPORTED_MODULE_2__.movementSystem)(w, dt, now, this.mapData, TILE_SIZE));
    this.world.addSystem((w, dt, now) => (0,_systems_bombSystem_js__WEBPACK_IMPORTED_MODULE_4__.bombSystem)(w, dt, now, this.mapData, updateMapCell, destroyBoxCallback, TILE_SIZE));
    this.world.addSystem((w, dt, now) => (0,_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_5__.damageSystem)(this.world, now, onPlayerHurt, this.localPlayerEntity, TILE_SIZE, this.socket));
    this.world.addSystem((w, dt, now) => (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_8__.powerUpSystem)(w, onPowerUpPicked));
    this.world.addSystem((w, dt, now) => (0,_systems_renderSystem_js__WEBPACK_IMPORTED_MODULE_3__.renderSystem)(w, dt, now, ANIMATION_ROWS));
  }
  gameLoop(now) {
    if (!this.running) return;
    const dt = now - this.lastTime;
    this.lastTime = now;
    this.world.update(dt, now);
    this.animationFrame = requestAnimationFrame(nextNow => this.gameLoop(nextNow));
  }
  handleGameOver(winnerName) {
    if (this.gameEnded) return; // Prevent multiple triggers
    this.gameEnded = true;
    this.destroy();
    const root = document.getElementById('root');
    document.body.className = 'menu-page';
    (0,_mini_framework_dom_js__WEBPACK_IMPORTED_MODULE_7__.render)(createElement(_pages_menu_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
      title: `${(winnerName || "A Player").toUpperCase()} WON!`,
      message: "The last player standing takes the crown."
    }), root);
  }

  /**
   * Checks game end conditions with proper state flag management.
   * Prevents the "Loop Trap" - modal is only rendered ONCE when lives reach 0.
   * Also disables input immediately when player dies.
   */

  removeRemotePlayer(playerId) {
    const entity = this.playerEntities.get(String(playerId));
    if (entity === undefined) return;
    const renderable = this.world.getComponent(entity, 'Renderable');
    if (renderable && renderable.el && renderable.el.parentNode) {
      renderable.el.parentNode.removeChild(renderable.el);
    }
    this.world.destroyEntity(entity);
    this.playerEntities.delete(String(playerId));
  }
  destroy() {
    this.running = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.removeInputListeners) {
      this.removeInputListeners();
    }
  }
  updateHudStats(entity) {
    const player = this.world.getComponent(entity, 'Player');
    const velocity = this.world.getComponent(entity, 'Velocity');
    if (!player || !velocity) return;
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_9__.setBombs)(player.maxBombs || 1);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_9__.setLives)(player.lives ?? 3);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_9__.setRange)(player.bombRange || 4);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_9__.setSpeed)(Math.round(velocity.speed));
  }
}
let currentLocalPlayerName = "";
function setPlayerName(name) {
  currentLocalPlayerName = name;
  localStorage.setItem("bomberman_player_name", name);
  console.log("Player registered successfully", name);
}
function getPlayerName() {
  return currentLocalPlayerName || localStorage.getItem("bomberman_player_name") || "Player";
}

/***/ },

/***/ "./src/ecs/systems/bombSystem.js"
/*!***************************************!*\
  !*** ./src/ecs/systems/bombSystem.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bombSystem: () => (/* binding */ bombSystem)
/* harmony export */ });
function bombSystem(world, dt, now, mapData, updateMapCell, destroyBoxCallback, tileSize = 64) {
  const bombs = world.query('Position', 'Bomb');
  for (const bombEntity of bombs) {
    const pos = world.getComponent(bombEntity, 'Position');
    const bomb = world.getComponent(bombEntity, 'Bomb');
    bomb.timer -= dt;
    if (bomb.timer <= 0 && !bomb.exploded) {
      bomb.exploded = true;
      const affectedCells = calculateExplosionCells(pos.gridX, pos.gridY, bomb.range, mapData);
      affectedCells.forEach(cell => {
        const expEntity = world.createEntity();
        const expDiv = document.createElement('div');
        expDiv.className = 'explosion';
        expDiv.style.position = 'absolute';
        expDiv.style.width = `${tileSize}px`;
        expDiv.style.height = `${tileSize}px`;
        expDiv.style.left = `${cell.x * tileSize}px`;
        expDiv.style.top = `${cell.y * tileSize}px`;
        expDiv.style.zIndex = '7';
        world.addComponent(expEntity, 'Position', {
          gridX: cell.x,
          gridY: cell.y,
          x: cell.x * tileSize,
          y: cell.y * tileSize
        });
        world.addComponent(expEntity, 'Explosion', {
          duration: 500,
          el: expDiv
        });
        bomb.el.parentNode.appendChild(expDiv);
        if (mapData[cell.y] && mapData[cell.y][cell.x] === 4) {
          updateMapCell(cell.x, cell.y, 2);
          if (destroyBoxCallback) {
            destroyBoxCallback(cell.x, cell.y);
          }
        }
      });
      if (bomb.el && bomb.el.parentNode) {
        bomb.el.parentNode.removeChild(bomb.el);
      }
      world.destroyEntity(bombEntity);
    }
  }
  const explosions = world.query('Position', 'Explosion');
  for (const expEntity of explosions) {
    const exp = world.getComponent(expEntity, 'Explosion');
    exp.duration -= dt;
    if (exp.duration <= 0) {
      if (exp.el && exp.el.parentNode) {
        exp.el.parentNode.removeChild(exp.el);
      }
      world.destroyEntity(expEntity);
    }
  }
}
function calculateExplosionCells(bx, by, range, mapData) {
  const cells = [{
    x: bx,
    y: by
  }];
  const directions = [{
    x: 0,
    y: -1
  }, {
    x: 0,
    y: 1
  }, {
    x: -1,
    y: 0
  }, {
    x: 1,
    y: 0
  }];
  const steps = range - 1;
  directions.forEach(dir => {
    for (let i = 1; i <= steps; i++) {
      const tx = bx + dir.x * i;
      const ty = by + dir.y * i;
      if (!mapData[ty] || mapData[ty][tx] === undefined) break;
      const cellType = mapData[ty][tx];
      if (cellType === 3) {
        break;
      }
      cells.push({
        x: tx,
        y: ty
      });
      if (cellType === 4) {
        break;
      }
    }
  });
  return cells;
}

/***/ },

/***/ "./src/ecs/systems/damageSystem.js"
/*!*****************************************!*\
  !*** ./src/ecs/systems/damageSystem.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   damageSystem: () => (/* binding */ damageSystem),
/* harmony export */   spawnHeartPowerUp: () => (/* binding */ spawnHeartPowerUp)
/* harmony export */ });
/**
 * Spawns a HEART power-up entity at the specified grid coordinates.
 * This creates a proper ECS entity with Position, PowerUp, and Renderable components.
 * 
 * @param {World} world - The game world instance
 * @param {number} gridX - Grid X coordinate
 * @param {number} gridY - Grid Y coordinate
 * @param {HTMLElement} container - The game container element
 * @param {number} tileSize - The size of each grid tile (default: 64)
 */
function spawnHeartPowerUp(world, gridX, gridY, container, tileSize = 64) {
  // Create a new entity for the heart power-up
  const heartEntity = world.createEntity();

  // Add Position component
  world.addComponent(heartEntity, 'Position', {
    gridX: gridX,
    gridY: gridY,
    x: gridX * tileSize,
    y: gridY * tileSize
  });

  // Add PowerUp component with type 'HEART'
  world.addComponent(heartEntity, 'PowerUp', {
    type: 'HEART',
    pickedUp: false,
    el: null // Will be set after creating the DOM element
  });

  // Create the DOM element for rendering
  const heartDiv = document.createElement('div');
  heartDiv.className = 'powerup powerup-heart';
  heartDiv.style.position = 'absolute';
  heartDiv.style.left = `${gridX * tileSize}px`;
  heartDiv.style.top = `${gridY * tileSize}px`;
  heartDiv.style.width = `${tileSize}px`;
  heartDiv.style.height = `${tileSize}px`;
  heartDiv.style.display = 'flex';
  heartDiv.style.alignItems = 'center';
  heartDiv.style.justifyContent = 'center';
  heartDiv.style.fontSize = '32px';
  heartDiv.style.zIndex = '5';
  heartDiv.textContent = '❤️';
  container.appendChild(heartDiv);

  // Update the PowerUp component with the DOM element reference
  const powerUp = world.getComponent(heartEntity, 'PowerUp');
  if (powerUp) {
    powerUp.el = heartDiv;
  }
  console.log(`[Heart Drop] Spawned HEART power-up at (${gridX}, ${gridY})`);
}

/**
 * Handles player death transition when lives reach 0.
 * Removes the player's DOM element and spawns a HEART power-up entity at the death location.
 *
 * @param {World} world - The game world instance
 * @param {number} playerEntity - The entity ID of the dying player
 * @param {number} tileSize - The size of each grid tile (default: 64)
 * @param {HTMLElement} container - The game container element
 */
function handlePlayerDeath(world, playerEntity, tileSize = 64, container = null) {
  // Get the player's components
  const position = world.getComponent(playerEntity, 'Position');
  const renderable = world.getComponent(playerEntity, 'Renderable');
  const player = world.getComponent(playerEntity, 'Player');
  if (!position || !renderable || !player) return;

  // Store the grid coordinates where the player died
  const deathGridX = Math.floor((position.x + tileSize / 2) / tileSize);
  const deathGridY = Math.floor((position.y + tileSize / 2) / tileSize);

  // CRITICAL: Remove the player's DOM element from the document BEFORE removing the Renderable component.
  // This ensures the dead player visually disappears immediately.
  if (renderable.el && renderable.el.parentNode) {
    renderable.el.parentNode.removeChild(renderable.el);
  }

  // Remove components that enable interaction and rendering.
  world.removeComponent(playerEntity, 'Renderable');
  world.removeComponent(playerEntity, 'Velocity');
  world.removeComponent(playerEntity, 'Input');
  // We keep Position and Player components to know where they were.

  // Spawn a HEART power-up entity at the death location (proper ECS entity)
  const gameContainer = container || document.getElementById('game-container');
  if (gameContainer) {
    spawnHeartPowerUp(world, deathGridX, deathGridY, gameContainer, tileSize);
  }
  console.log(`[Player Death] Player ${player.id} died at (${deathGridX}, ${deathGridY}). Heart power-up dropped.`);
}
function damageSystem(world, now, onPlayerHurt, localPlayerEntity, tileSize = 64, socket) {
  const players = world.query('Position', 'Player');
  const explosions = world.query('Position', 'Explosion');
  for (const playerEntity of players) {
    const pPos = world.getComponent(playerEntity, 'Position');
    const player = world.getComponent(playerEntity, 'Player');
    if (player.invincibleUntil && player.invincibleUntil > now) continue;
    for (const expEntity of explosions) {
      const ePos = world.getComponent(expEntity, 'Position');

      // Grid-based collision
      const playerGridX = Math.floor((pPos.x + tileSize / 2) / tileSize);
      const playerGridY = Math.floor((pPos.y + tileSize / 2) / tileSize);
      if (playerGridX === ePos.gridX && playerGridY === ePos.gridY) {
        const previousLives = player.lives ?? 3;
        player.lives = Math.max(previousLives - 1, 0);
        player.invincibleUntil = now + 1500;

        // If the player is dead, report death ONCE using guard clause
        if (player.lives <= 0) {
          if (player.alreadyReportedDead) break;
          player.alreadyReportedDead = true;
          if (onPlayerHurt) {
            onPlayerHurt(playerEntity, player.id, 0);
          }
          handlePlayerDeath(world, playerEntity, tileSize);
        } else {
          // Player still alive, report normal damage
          if (onPlayerHurt) {
            onPlayerHurt(playerEntity, player.id, player.lives);
          }
        }

        // Break the loop since the player has already taken damage from this explosion.
        break;
      }
    }
  }
}

/***/ },

/***/ "./src/ecs/systems/movementSystem.js"
/*!*******************************************!*\
  !*** ./src/ecs/systems/movementSystem.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   movementSystem: () => (/* binding */ movementSystem)
/* harmony export */ });
function movementSystem(world, dt, now, mapData, tileSize = 40) {
  const entities = world.query('Position', 'Velocity');
  const delta = dt / 16.67;
  const PLAYER_SIZE = tileSize;
  for (const entity of entities) {
    const pos = world.getComponent(entity, 'Position');
    const vel = world.getComponent(entity, 'Velocity');
    const input = world.getComponent(entity, 'Input');
    const behavior = world.getComponent(entity, 'Behavior');
    if (behavior) {
      vel.speed = vel.baseSpeed + (behavior.fastShoesLevel - 1) * 0.5;
    } else {
      vel.speed = vel.baseSpeed;
    }
    if (!input) {
      moveTowardTarget(pos, vel, delta);
      continue;
    }
    const activeInput = input.inputQueue[0];
    let dx = 0;
    let dy = 0;
    if (activeInput === 'up') {
      dy = -1;
      vel.direction = 'up';
    } else if (activeInput === 'down') {
      dy = 1;
      vel.direction = 'down';
    } else if (activeInput === 'left') {
      dx = -1;
      vel.direction = 'left';
    } else if (activeInput === 'right') {
      dx = 1;
      vel.direction = 'right';
    }
    const hasInput = dx !== 0 || dy !== 0;
    if (!hasInput) {
      pos.targetX = pos.x;
      pos.targetY = pos.y;
      vel.isMoving = false;
      const renderable = world.getComponent(entity, 'Renderable');
      if (renderable) {
        renderable.state = 'IDLE';
      }
      pos.gridX = Math.floor((pos.x + PLAYER_SIZE / 2) / tileSize);
      pos.gridY = Math.floor((pos.y + PLAYER_SIZE / 2) / tileSize);
      if (world.broadcastMovement) {
        world.broadcastMovement(entity, pos.x, pos.y, pos.gridX, pos.gridY, vel.direction, vel.isMoving);
      }
      continue;
    }
    const nextX = pos.x + dx * vel.speed * delta;
    const nextY = pos.y + dy * vel.speed * delta;
    const snapThreshold = 32;
    if (dy !== 0 && dx === 0) {
      if (isBlocked(pos.x, nextY, mapData, tileSize, PLAYER_SIZE)) {
        const currentTileX = Math.floor((pos.x + PLAYER_SIZE / 2) / tileSize);
        const targetX = currentTileX * tileSize;
        const diffX = pos.x - targetX;
        if (Math.abs(diffX) < snapThreshold) {
          dy = 0;
          dx = -Math.sign(diffX);
        }
      }
    }
    if (dx !== 0 && dy === 0) {
      if (isBlocked(nextX, pos.y, mapData, tileSize, PLAYER_SIZE)) {
        const currentTileY = Math.floor((pos.y + PLAYER_SIZE / 2) / tileSize);
        const targetY = currentTileY * tileSize;
        const diffY = pos.y - targetY;
        if (Math.abs(diffY) < snapThreshold) {
          dx = 0;
          dy = -Math.sign(diffY);
        }
      }
    }
    const nextXAfterSnap = pos.x + dx * vel.speed * delta;
    const nextYAfterSnap = pos.y + dy * vel.speed * delta;
    if (dx !== 0 && !isBlocked(nextXAfterSnap, pos.y, mapData, tileSize, PLAYER_SIZE)) {
      pos.x = nextXAfterSnap;
    }
    if (dy !== 0 && !isBlocked(pos.x, nextYAfterSnap, mapData, tileSize, PLAYER_SIZE)) {
      pos.y = nextYAfterSnap;
    }
    vel.isMoving = true;
    const renderable = world.getComponent(entity, 'Renderable');
    if (renderable) {
      renderable.state = 'RUN';
    }
    pos.gridX = Math.floor((pos.x + PLAYER_SIZE / 2) / tileSize);
    pos.gridY = Math.floor((pos.y + PLAYER_SIZE / 2) / tileSize);
    pos.targetX = pos.x;
    pos.targetY = pos.y;
    if (world.broadcastMovement) {
      world.broadcastMovement(entity, pos.x, pos.y, pos.gridX, pos.gridY, vel.direction, vel.isMoving);
    }
  }
}
function moveTowardTarget(pos, vel, delta) {
  const step = vel.speed * delta;
  if (pos.x < pos.targetX) {
    pos.x = Math.min(pos.x + step, pos.targetX);
  } else if (pos.x > pos.targetX) {
    pos.x = Math.max(pos.x - step, pos.targetX);
  }
  if (pos.y < pos.targetY) {
    pos.y = Math.min(pos.y + step, pos.targetY);
  } else if (pos.y > pos.targetY) {
    pos.y = Math.max(pos.y - step, pos.targetY);
  }
  vel.isMoving = pos.x !== pos.targetX || pos.y !== pos.targetY;
}
function isBlocked(x, y, mapData, tileSize, playerSize = tileSize) {
  const padding = 4;
  const left = Math.floor((x + padding) / tileSize);
  const right = Math.floor((x + playerSize - padding) / tileSize);
  const top = Math.floor((y + padding) / tileSize);
  const bottom = Math.floor((y + playerSize - padding) / tileSize);
  return isBlockedCell(left, top, mapData) || isBlockedCell(right, top, mapData) || isBlockedCell(left, bottom, mapData) || isBlockedCell(right, bottom, mapData);
}
function isBlockedCell(x, y, mapData) {
  const cell = mapData[y] && mapData[y][x];
  return cell !== 0 && cell !== 2;
}

/***/ },

/***/ "./src/ecs/systems/powerUpSystem.js"
/*!******************************************!*\
  !*** ./src/ecs/systems/powerUpSystem.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   powerUpSystem: () => (/* binding */ powerUpSystem),
/* harmony export */   spawnPowerUp: () => (/* binding */ spawnPowerUp)
/* harmony export */ });
function powerUpSystem(world, onPowerUpPicked) {
  const players = world.query('Position', 'Velocity', 'Player');
  const powerUps = world.query('Position', 'PowerUp');
  for (const playerEntity of players) {
    const pPos = world.getComponent(playerEntity, 'Position');
    const vel = world.getComponent(playerEntity, 'Velocity');
    const player = world.getComponent(playerEntity, 'Player');
    if (!pPos || !vel || !player) continue;
    for (const pUpEntity of powerUps) {
      const upPos = world.getComponent(pUpEntity, 'Position');
      const pUp = world.getComponent(pUpEntity, 'PowerUp');
      if (!upPos || !pUp || pUp.pickedUp) continue;

      // Grid-based collision: player grid position matches power-up grid position
      if (pPos.gridX === upPos.gridX && pPos.gridY === upPos.gridY) {
        pUp.pickedUp = true;

        // Handle different power-up types
        if (pUp.type === 'SPEED') {
          vel.speed = Math.min(vel.speed + 1, 8);
        } else if (pUp.type === 'BOMBS') {
          player.maxBombs = player.maxBombs ? player.maxBombs + 1 : 2;
        } else if (pUp.type === 'FLAME') {
          player.bombRange = player.bombRange ? player.bombRange + 1 : 5;
        } else if (pUp.type === 'HEART') {
          player.lives += 1;
        }

        // Remove the power-up's DOM element from the screen
        if (pUp.el && pUp.el.parentNode) {
          pUp.el.parentNode.removeChild(pUp.el);
        }

        // Notify game.js via callback (handles HUD update + server sync)
        // CRITICAL: This triggers updateHudStats, NOT onPlayerHurt
        if (onPowerUpPicked) {
          onPowerUpPicked(player.id, pUp.type, upPos.gridX, upPos.gridY);
        }

        // Destroy the power-up entity from the world immediately
        world.destroyEntity(pUpEntity);
        console.log(`[HEART DESTROYED] Heart entity removed from world at (${upPos.gridX}, ${upPos.gridY})`);
        break;
      }
    }
  }
}
function spawnPowerUp(world, gx, gy, container, tileSize = 64) {
  const seed = gx * 73856093 ^ gy * 19349663;
  const seedRandom = Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
  if (seedRandom > 0.35) return;
  const types = ['SPEED', 'BOMBS', 'FLAME'];
  const typeIndex = Math.floor((Math.sin(seed * 2) * 10000 - Math.floor(Math.sin(seed * 2) * 10000)) * types.length);
  const randomType = types[typeIndex];
  const pUpEntity = world.createEntity();
  world.addComponent(pUpEntity, 'Position', {
    gridX: gx,
    gridY: gy,
    x: gx * tileSize,
    y: gy * tileSize
  });
  const div = document.createElement('div');
  div.className = `powerup powerup-${randomType.toLowerCase()}`;
  div.style.position = 'absolute';
  div.style.width = `${tileSize}px`;
  div.style.height = `${tileSize}px`;
  div.style.left = `${gx * tileSize}px`;
  div.style.top = `${gy * tileSize}px`;
  div.style.zIndex = '5';
  container.appendChild(div);
  world.addComponent(pUpEntity, 'PowerUp', {
    type: randomType,
    el: div
  });
}

/***/ },

/***/ "./src/ecs/systems/renderSystem.js"
/*!*****************************************!*\
  !*** ./src/ecs/systems/renderSystem.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSystem: () => (/* binding */ renderSystem)
/* harmony export */ });
function renderSystem(world, dt, now, animRows) {
  const entities = world.query('Position', 'Velocity', 'Renderable');
  for (const entity of entities) {
    const pos = world.getComponent(entity, 'Position');
    const vel = world.getComponent(entity, 'Velocity');
    const renderable = world.getComponent(entity, 'Renderable');
    if (!renderable.el) continue;
    const state = renderable.state;
    const targetRow = animRows[state][vel.direction];

    // Reset animation when row or state changes
    if (renderable.row !== targetRow || renderable.lastState !== state) {
      renderable.row = targetRow;
      renderable.currentFrame = 0;
      renderable.lastFrameTime = now;
      renderable.lastState = state;
    }
    const frameCount = state === 'RUN' ? renderable.runFrames : renderable.idleFrames;
    const frameDelay = state === 'RUN' ? 1000 / renderable.fps : 1000 / renderable.idleFps;
    if (now - renderable.lastFrameTime > frameDelay) {
      renderable.currentFrame = (renderable.currentFrame + 1) % frameCount;
      renderable.lastFrameTime = now;
    }
    const posX = -(renderable.currentFrame * renderable.frameWidth);
    const posY = -(renderable.row * renderable.frameHeight);
    renderable.el.style.backgroundPosition = `${posX}px ${posY}px`;
    renderable.el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
  }
}

/***/ },

/***/ "./src/ecs/world.js"
/*!**************************!*\
  !*** ./src/ecs/world.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   World: () => (/* binding */ World)
/* harmony export */ });
// /src/ecs/world.js

class World {
  constructor() {
    this.nextEntityId = 0;
    this.entities = new Set();
    this.components = new Map();
    this.systems = [];
  }
  createEntity() {
    const entity = this.nextEntityId++;
    this.entities.add(entity);
    return entity;
  }
  destroyEntity(entity) {
    this.entities.delete(entity);
    for (const [componentName, componentMap] of this.components.entries()) {
      componentMap.delete(entity);
    }
  }
  addComponent(entity, componentName, componentData = {}) {
    if (!this.components.has(componentName)) {
      this.components.set(componentName, new Map());
    }
    this.components.get(componentName).set(entity, componentData);
  }
  getComponent(entity, componentName) {
    const componentMap = this.components.get(componentName);
    return componentMap ? componentMap.get(entity) : undefined;
  }
  removeComponent(entity, componentName) {
    const componentMap = this.components.get(componentName);
    if (componentMap) {
      componentMap.delete(entity);
    }
  }
  query(...componentNames) {
    if (componentNames.length === 0) return [];
    const firstMap = this.components.get(componentNames[0]);
    if (!firstMap) return [];
    const results = [];
    for (const entity of firstMap.keys()) {
      let hasAll = true;
      for (let i = 1; i < componentNames.length; i++) {
        const map = this.components.get(componentNames[i]);
        if (!map || !map.has(entity)) {
          hasAll = false;
          break;
        }
      }
      if (hasAll && this.entities.has(entity)) {
        results.push(entity);
      }
    }
    return results;
  }
  addSystem(systemFunction) {
    this.systems.push(systemFunction);
  }
  update(dt, now) {
    for (const system of this.systems) {
      system(this, dt, now);
    }
  }
}

/***/ },

/***/ "./src/pages/game.jsx"
/*!****************************!*\
  !*** ./src/pages/game.jsx ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setBombs: () => (/* binding */ setBombs),
/* harmony export */   setLives: () => (/* binding */ setLives),
/* harmony export */   setPlayerName: () => (/* binding */ setPlayerName),
/* harmony export */   setRange: () => (/* binding */ setRange),
/* harmony export */   setSpeed: () => (/* binding */ setSpeed)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/reactivity */ "./mini-framework/reactivity.js");


const TILE_SIZE = 64;
const GRID_BORDER_SIZE = 6;
const GAME_CHROME_WIDTH = 72;
const GAME_CHROME_HEIGHT = 150;
const images = {
  2: "./assets/blocks/block_floor.jpg",
  3: "./assets/blocks/block_wall.png",
  4: "./assets/blocks/block_exploit.png"
};
const [playerName, setPlayerName] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)("Player 1");
const [lives, setLives] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)(3);
const [speed, setSpeed] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)(1);
const [bombs, setBombs] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)(1);
const [range, setRange] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)(1);

const nameEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "player-name"
});
(0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
  nameEl.textContent = playerName();
});
const livesEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "score-value lives-value"
});
const speedEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "score-value speed-value"
});
const bombsEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "score-value bombs-value"
});
const rangeEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "score-value range-value"
});
(0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
  livesEl.textContent = lives();
});
(0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
  speedEl.textContent = speed();
});
(0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
  bombsEl.textContent = bombs();
});
(0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
  rangeEl.textContent = range();
});
function Game({
  grid
}) {
  const boardWidth = grid[0].length * TILE_SIZE;
  const boardHeight = grid.length * TILE_SIZE;
  const boardOuterWidth = boardWidth + GRID_BORDER_SIZE * 2;
  const boardOuterHeight = boardHeight + GRID_BORDER_SIZE * 2;
  const viewportWidth = typeof window === "undefined" ? boardWidth : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? boardHeight : window.innerHeight;
  const scale = Math.min(1, Math.max(0.2, (viewportWidth - GAME_CHROME_WIDTH) / boardOuterWidth), Math.max(0.2, (viewportHeight - GAME_CHROME_HEIGHT) / boardOuterHeight));
  const rows = [];
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const cells = [];
    for (let colIndex = 0; colIndex < grid[rowIndex].length; colIndex++) {
      const cell = grid[rowIndex][colIndex];
      let className = "tile";
      let style = `width:${TILE_SIZE}px;height:${TILE_SIZE}px;`;
      if (cell === 2 || cell === 4) {
        className += " tile-floor";
      }
      if (cell === 3) {
        className += " tile-wall";
        style += `background-image:url(${images[3]})`;
      }
      if (cell === 4) {
        style += `background-image:url(${images[4]})`;
      }
      if (cell === 0 || cell === 1) {
        style += `background-image:url(${images[2]})`;
      }
      cells.push((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        class: className,
        "data-x": colIndex,
        "data-y": rowIndex,
        style: style
      }));
    }
    rows.push((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "grid-row"
    }, cells));
  }
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "game-container"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "game-glass"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-bar"
  }, nameEl, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-stats"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "Lives"), livesEl), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "Speed"), speedEl), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "Bombs"), bombsEl), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "Range"), rangeEl))), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "game-board-frame",
    style: `width:${boardOuterWidth * scale}px;height:${boardOuterHeight * scale}px;`
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: "game-container",
    class: "game-grid",
    style: `position:relative;width:${boardWidth}px;height:${boardHeight}px;transform:scale(${scale});`
  }, rows))));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ },

/***/ "./src/pages/lobby.jsx"
/*!*****************************!*\
  !*** ./src/pages/lobby.jsx ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setStates: () => (/* binding */ setStates)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/reactivity */ "./mini-framework/reactivity.js");
/* harmony import */ var _components_chat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/chat */ "./src/components/chat.jsx");



let [states, setStates] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)({});

let roomIdEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Room ID: ");
let playersEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Players:  / 4");
let textEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null);
let timerEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Timer: ");
(0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
  const s = states();
  roomIdEl.textContent = `Room ID: ${s.roomId}`;
  playersEl.textContent = `Players: ${s.playersCount} / 4`;
  textEl.textContent = s.text || "";
  if (s.gameStarted) {
    timerEl.textContent = "Timer: Game started";
  } else {
    const timerText = !s.secondsLeft ? "Waiting for one more player" : `${s.secondsLeft} seconds`;
    timerEl.textContent = `Timer: ${timerText}`;
  }
});
function Lobby() {
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "container-lobby"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "lobby-box"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Lobby"), roomIdEl, playersEl, textEl, timerEl), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_chat__WEBPACK_IMPORTED_MODULE_2__["default"], null));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Lobby);

/***/ },

/***/ "./src/pages/menu.jsx"
/*!****************************!*\
  !*** ./src/pages/menu.jsx ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Menu)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");

function Menu({
  title = "You Win!",
  message = "All other players have left the game.",
  buttonText = "Play Again"
} = {}) {
  const replayBtn = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    class: "replay-button"
  }, buttonText);
  replayBtn.addEventListener("click", () => {
    window.location.href = "/";
  });
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "menu-box"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, title), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, message), replayBtn);
}

/***/ },

/***/ "./src/pages/register.jsx"
/*!********************************!*\
  !*** ./src/pages/register.jsx ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _ecs_game_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ecs/game.js */ "./src/ecs/game.js");


function Register({
  wss
}) {
  let submitted = false;
  let playerEnter = e => {
    e.preventDefault();
    if (submitted) return;
    const formData = new FormData(e.currentTarget);
    const nickname = formData.get("nickname").trim();
    if (!nickname || nickname.length > 20) return;
    submitted = true;
    (0,_ecs_game_js__WEBPACK_IMPORTED_MODULE_1__.setPlayerName)(nickname);
    wss.send(JSON.stringify({
      type: "nickname_of_the_player",
      nickname: nickname
    }));
  };
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    class: "register-form",
    onSubmit: playerEnter
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    class: "nickname-input",
    type: "text",
    name: "nickname",
    placeholder: "enter your name",
    maxlength: "20"
  }), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    class: "register-button",
    type: "submit"
  }, "start playing"));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Register);

/***/ },

/***/ "./src/utils/sound.js"
/*!****************************!*\
  !*** ./src/utils/sound.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Sound {
  constructor(src) {
    this.music = new Audio(src);
    this.button = document.createElement("button");
    this.icon = document.createElement("i");
    this.music.loop = true;
    this.music.volume = 0.4;
    this.button.className = "sound-button";
    this.button.type = "button";
    this.button.setAttribute("aria-label", "Turn sound off");
    this.button.append(this.icon);
  }
  init() {
    this.button.addEventListener("click", () => this.toggle());
    document.body.append(this.button);
    this.updateButton();
  }
  play() {
    this.music.play().then(() => this.updateButton()).catch(() => this.updateButton());
  }
  toggle() {
    if (this.music.paused || this.music.muted) {
      this.music.muted = false;
      this.button.setAttribute("aria-label", "Turn sound off");
      this.play();
    } else {
      this.music.muted = true;
      this.button.setAttribute("aria-label", "Turn sound on");
      this.updateButton();
    }
  }
  updateButton() {
    const isMuted = this.music.muted || this.music.paused;
    this.icon.className = isMuted ? "fa-solid fa-volume-off" : "fa-solid fa-volume-high";
    this.button.classList.toggle("is-muted", isMuted);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Sound);

/***/ },

/***/ "./src/utils/websocket.js"
/*!********************************!*\
  !*** ./src/utils/websocket.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleWebsocket: () => (/* binding */ handleWebsocket)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../pages/game */ "./src/pages/game.jsx");
/* harmony import */ var _pages_menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pages/menu */ "./src/pages/menu.jsx");
/* harmony import */ var _pages_lobby__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pages/lobby */ "./src/pages/lobby.jsx");
/* harmony import */ var _components_chat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/chat */ "./src/components/chat.jsx");
/* harmony import */ var _ecs_game_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ecs/game.js */ "./src/ecs/game.js");








let currentGameEngine = null;
function handleWebsocket(message, root, wss) {
  switch (message.type) {
    // this case is for update the lobby
    case "room_update":
    case "lobby_timer":
      // Fix: If we are already in a game, don't switch back to the lobby screen when someone quits
      if (document.body.className === "game-page") {
        (0,_pages_lobby__WEBPACK_IMPORTED_MODULE_3__.setStates)({
          roomId: message.roomId,
          playersCount: message.playersCount,
          secondsLeft: message.secondsLeft,
          text: message.text
        });
        break;
      }
      document.body.className = "lobby-page";
      if (!root.querySelector(".container-lobby")) {
        (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_lobby__WEBPACK_IMPORTED_MODULE_3__["default"], null), root);
      }
      (0,_pages_lobby__WEBPACK_IMPORTED_MODULE_3__.setStates)({
        roomId: message.roomId,
        playersCount: message.playersCount,
        secondsLeft: message.secondsLeft,
        text: message.text
      });
      break;

    // this case is for start the game
    case "game_started":
      document.body.className = "game-page";
      (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_game__WEBPACK_IMPORTED_MODULE_1__["default"], {
        grid: message.grid
      }), root);
      setTimeout(() => {
        const gameContainer = document.getElementById("game-container");
        if (gameContainer) {
          if (currentGameEngine) {
            currentGameEngine.destroy();
          }
          const localPlayer = (message.players || []).find(player => player.id === message.yourPlayerId);
          if (localPlayer && localPlayer.nickname) {
            (0,_pages_game__WEBPACK_IMPORTED_MODULE_1__.setPlayerName)(localPlayer.nickname);
          }
          const engine = new _ecs_game_js__WEBPACK_IMPORTED_MODULE_5__.GameEngine(gameContainer, message.grid, wss);
          engine.init(message.yourPlayerId, message.players || []);
          currentGameEngine = engine;
        } else {
          console.error("Game container was not found");
        }
      }, 50);
      break;

    // this case is for return to menu when room is alone
    case "room_alone":
      document.body.className = "menu-page";
      (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_menu__WEBPACK_IMPORTED_MODULE_2__["default"], null), root);
      break;

    // this case is for game results (win, lost, draw)
    case "game_over":
    case "game_won":
      // Keep for backward compatibility if needed

      if (currentGameEngine) {
        currentGameEngine.destroy();
      }
      document.body.className = "menu-page";
      let title = "GAME OVER";
      let messageText = "The game has ended.";
      let btnText = "Play Again";
      if (message.result === "won") {
        title = `${(message.winnerName || "YOU").toUpperCase()} WON!`;
        messageText = "The last player standing takes the crown.";
      } else if (message.result === "lost") {
        title = "YOU LOST!";
        messageText = "Better luck next time!";
        btnText = "Play Another Time";
      } else if (message.result === "draw") {
        title = "IT'S A DRAW!";
        messageText = "Everyone went down in a blaze of glory.";
      }
      (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_menu__WEBPACK_IMPORTED_MODULE_2__["default"], {
        title: title,
        message: messageText,
        buttonText: btnText
      }), root);
      break;

    // this case is for receive a chat message
    case "chat_message":
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_4__.setMessages)(prev => [...prev, message.message]);
      break;

    // this case is for move another player
    case "player_moved":
      if (currentGameEngine) {
        currentGameEngine.handleRemoteMove(message.payload);
      }
      break;

    // this case is for drop a bomb from another player
    case "bomb_dropped":
      if (currentGameEngine) {
        currentGameEngine.handleRemoteBomb(message.payload);
      }
      break;

    // this case is for pick up a power up or heart
    case "powerup_picked":
      if (currentGameEngine) {
        currentGameEngine.handleRemotePowerUpPicked(message.payload);
      }
      break;

    // this case is for when a player quits or refreshes
    case "player_quit":
      if (currentGameEngine) {
        currentGameEngine.removeRemotePlayer(message.playerId);
      }
      break;
  }
}

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app/app.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q3JLLGtCQUFrQixDQUFDak8sT0FBTyxDQUFDbUksUUFBUSxDQUFDO01BQzFEO01BQ0E7RUFDUjtBQUNKLEM7Ozs7OztVQ3RKQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQzVCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2hhdC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9tb3ZlbWVudFN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvcmVuZGVyU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvd29ybGQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2dhbWUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9sb2JieS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yZWdpc3Rlci5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3NvdW5kLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy93ZWJzb2NrZXQuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIHByb3BzLCAuLi5jaGlsZHJlbikge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiB0eXBlKHsgLi4uKHByb3BzIHx8IHt9KSwgY2hpbGRyZW4gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzIHx8IHt9KSB7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChcIm9uXCIpICYmIHR5cGVvZiBwcm9wc1trZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGtleS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZS5zZXRBdHRyaWJ1dGUoa2V5LCBwcm9wc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZsYXRDaGlsZHJlbiA9IGNoaWxkcmVuLmZsYXQoSW5maW5pdHkpO1xuICAgIGVsZS5hcHBlbmQoLi4uZmxhdENoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gbnVsbCAmJiBjaGlsZCAhPT0gdW5kZWZpbmVkICYmIGNoaWxkICE9PSBmYWxzZSkpO1xuXG4gICAgcmV0dXJuIGVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICBjb250YWluZXIucmVwbGFjZUNoaWxkcmVuKGVsZW1lbnQpO1xufVxuIiwiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4vcm91dGVyLmpzXCI7XG5cbmxldCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjsiLCJjb25zdCBlZmZlY3RTdGFjayA9IFtdO1xubGV0IGFjdGl2ZUVmZmVjdCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaWduYWwoaW5pdGlhbFZhbHVlKSB7XG4gICBsZXQgdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICBjb25zdCBlZmZlY3RzID0gbmV3IFNldCgpO1xuXG4gICBjb25zdCBSZWFkID0gKCkgPT4ge1xuICAgICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgICAgZWZmZWN0cy5hZGQoYWN0aXZlRWZmZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgIH1cblxuICAgY29uc3QgV3JpdGUgPSAobmV3VmFsdWUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgbGV0IGZuID0gbmV3VmFsdWU7XG4gICAgICAgICB2YWx1ZSA9IGZuKHZhbHVlKTtcbiAgICAgIH0gXG4gICAgICBlbHNlIHZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBlZmZlY3RzLmZvckVhY2goZWZmZWN0ID0+IGVmZmVjdCgpKTtcbiAgIH1cblxuICAgcmV0dXJuIFtSZWFkLCBXcml0ZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFZmZlY3QoZWZmZWN0KSB7XG4gICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3Q7XG4gICBlZmZlY3QoKTtcbiAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbn1cbiIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgICNSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICNGaXJzdFJlc29sdmUgPSBmYWxzZTtcblxuICAgIG9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy4jUm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFxuICAgIG5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSA9IFwicHVzaFwiIH0gPSB7fSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBcIi9cIiArIHBhdGg7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzb2x2ZShwYXRoID0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbcGF0aF07XG5cbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm4oeyB1cmw6IG5ldyBVUkwobG9jYXRpb24uaHJlZikgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxpc3RlbihvbkVycm9yNDA0KSB7XG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5pbnRlcmNlcHQoe1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLnBhdGhuYW1lLCB0aGlzLiNSb3V0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3VybC5wYXRobmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I0MDQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbih7IHVybCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNGaXJzdFJlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdGhpcy4jRmlyc3RSZXNvbHZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgcmVuZGVyIH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmtcIjtcbmltcG9ydCBSZWdpc3RlciBmcm9tIFwiLi4vcGFnZXMvcmVnaXN0ZXJcIjtcbmltcG9ydCBTb3VuZCBmcm9tIFwiLi4vdXRpbHMvc291bmRcIjtcbmltcG9ydCB7IGhhbmRsZVdlYnNvY2tldCB9IGZyb20gXCIuLi91dGlscy93ZWJzb2NrZXQuanNcIjtcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoYHdzOi8vJHt3aW5kb3cubG9jYXRpb24uaG9zdG5hbWV9OjUwMDBgKTtcbmNvbnN0IHNvdW5kID0gbmV3IFNvdW5kKFwiLi9hc3NldHMvc291bmRzL2JhY2tncm91bmRfbXVzaWMubXAzXCIpO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIGhhbmRsZVdlYnNvY2tldChtZXNzYWdlLCByb290LCB3c3MpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdzcztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgd3NzIGZyb20gXCIuLi9hcHAvYXBwXCI7XG5cbmNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gY3JlYXRlU2lnbmFsKFtdKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzIH07XG5cbmZ1bmN0aW9uIENoYXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IG1lc3NhZ2VzQ29udGFpbmVyID0gPGRpdiBjbGFzcz1cIm1lc3NhZ2VzXCI+PC9kaXY+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNncyA9IG1lc3NhZ2VzKCk7XG4gICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgbXNnIG9mIG1zZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBtc2c7XG4gICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG1lc3NhZ2VzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBtc2dzLnVuc2hpZnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBmb3JtRGF0YS5nZXQoXCJtZXNzYWdlXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcImNoYXRfbWVzc2FnZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgfSkpO1xuICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0XCIgb25TdWJtaXQ9e2Jyb2FkY2FzdE1lc3NhZ2V9PlxuICAgICAgICAgICAge21lc3NhZ2VzQ29udGFpbmVyfVxuICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1lc3NhZ2VcIiBwbGFjZWhvbGRlcj1cInR5cGUgdG8gdGhlIG90aGVyIHBsYXllcnMgLi4uXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXRQbGF5ZXJzOyIsIi8vIC9zcmMvZWNzL2NvbXBvbmVudHMuanNcblxuZXhwb3J0IGNvbnN0IFBvc2l0aW9uQ29tcG9uZW50ID0gKGd4LCBneSwgdGlsZVNpemUgPSA2NCkgPT4gKHtcbiAgICBncmlkWDogZ3gsXG4gICAgZ3JpZFk6IGd5LFxuICAgIHg6IGd4ICogdGlsZVNpemUsXG4gICAgeTogZ3kgKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRYOiBneCAqIHRpbGVTaXplLFxuICAgIHRhcmdldFk6IGd5ICogdGlsZVNpemVcbn0pO1xuXG5leHBvcnQgY29uc3QgVmVsb2NpdHlDb21wb25lbnQgPSAoYmFzZVNwZWVkID0gMi41KSA9PiAoe1xuICAgIGJhc2VTcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkOiBiYXNlU3BlZWQsXG4gICAgaXNNb3Zpbmc6IGZhbHNlLFxuICAgIGRpcmVjdGlvbjogJ2Rvd24nXG59KTtcblxuZXhwb3J0IGNvbnN0IElucHV0Q29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBpbnB1dFF1ZXVlOiBbXVxufSk7XG5cbmV4cG9ydCBjb25zdCBSZW5kZXJhYmxlQ29tcG9uZW50ID0gKGVsLCBmcmFtZVdpZHRoID0gNjQsIGZyYW1lSGVpZ2h0ID0gNjQsIHRvdGFsRnJhbWVzID0gNCwgZnBzID0gMTIpID0+ICh7XG4gICAgZWw6IGVsLFxuICAgIGZyYW1lV2lkdGg6IGZyYW1lV2lkdGgsXG4gICAgZnJhbWVIZWlnaHQ6IGZyYW1lSGVpZ2h0LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogdG90YWxGcmFtZXMsXG4gICAgcnVuRnJhbWVzOiA0LFxuICAgIGlkbGVGcmFtZXM6IDIsXG4gICAgZnBzOiBmcHMsXG4gICAgaWRsZUZwczogNCxcbiAgICBsYXN0RnJhbWVUaW1lOiAwLFxuICAgIHJvdzogMCxcbiAgICBzdGF0ZTogJ0lETEUnLFxuICAgIGxhc3RTdGF0ZTogJ0lETEUnXG59KTtcblxuZXhwb3J0IGNvbnN0IFBsYXllckNvbXBvbmVudCA9IChpZCwgY2hhclR5cGUsIGlzTG9jYWwgPSBmYWxzZSkgPT4gKHtcbiAgICBpZDogaWQsXG4gICAgY2hhclR5cGU6IGNoYXJUeXBlLFxuICAgIGlzTG9jYWw6IGlzTG9jYWxcbn0pO1xuXG5leHBvcnQgY29uc3QgQm9tYkNvbXBvbmVudCA9IChvd25lcklkLCB0aW1lciA9IDIwMDAsIHJhbmdlID0gNCkgPT4gKHtcbiAgICBvd25lcklkOiBvd25lcklkLFxuICAgIHRpbWVyOiB0aW1lcixcbiAgICByYW5nZTogcmFuZ2UsXG4gICAgZXhwbG9kZWQ6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEV4cGxvc2lvbkNvbXBvbmVudCA9IChkdXJhdGlvbiA9IDUwMCkgPT4gKHtcbiAgICBkdXJhdGlvbjogZHVyYXRpb25cbn0pO1xuXG5leHBvcnQgY29uc3QgUG93ZXJVcENvbXBvbmVudCA9ICh0eXBlKSA9PiAoe1xuICAgIHR5cGU6IHR5cGUsIFxuICAgIHBpY2tlZFVwOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBCZWhhdmlvckNvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgZ2hvc3RNb2RlOiBmYWxzZSxcbiAgICB0aHJvd2FibGU6IGZhbHNlLFxuICAgIGRldG9uYXRvcjogZmFsc2UsXG4gICAgZmFzdFNob2VzTGV2ZWw6IDEsXG4gICAgYm9tYnM6IHtcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICByYW5nZTogMlxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkLmpzJztcbmltcG9ydCB7XG4gICAgUG9zaXRpb25Db21wb25lbnQsXG4gICAgVmVsb2NpdHlDb21wb25lbnQsXG4gICAgSW5wdXRDb21wb25lbnQsXG4gICAgUmVuZGVyYWJsZUNvbXBvbmVudCxcbiAgICBQbGF5ZXJDb21wb25lbnQsXG4gICAgQm9tYkNvbXBvbmVudFxufSBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuaW1wb3J0IHsgbW92ZW1lbnRTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyc7XG5pbXBvcnQgeyBib21iU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgZGFtYWdlU3lzdGVtLCBjaGVja0dhbWVFbmRDb25kaXRpb25zLCBzcGF3bkhlYXJ0UG93ZXJVcCB9IGZyb20gJy4vc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMnO1xuaW1wb3J0IE1lbnUgZnJvbSAnLi4vcGFnZXMvbWVudS5qc3gnO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tLmpzJztcblxuaW1wb3J0IHsgcG93ZXJVcFN5c3RlbSwgc3Bhd25Qb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMnO1xuaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQgfSBmcm9tICcuLi9wYWdlcy9nYW1lJztcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzQ29udGFpbmVyLCBtYXBEYXRhLCBzb2NrZXQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjYW52YXNDb250YWluZXI7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IG1hcERhdGE7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XG4gICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnBsYXllckluZm8gPSBuZXcgTWFwKCk7IC8vIFN0b3JlIG9yaWdpbmFsIHBsYXllciBkYXRhIGxpa2Ugbmlja25hbWVcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IDA7XG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzID0gbmV3IFNldCgpO1xuICAgICAgICAvLyBTdGF0ZSBmbGFnIHRvIHByZXZlbnQgbXVsdGlwbGUgbG9zcyBtb2RhbCByZW5kZXJzIChUaGUgTG9vcCBUcmFwIGZpeClcbiAgICAgICAgdGhpcy5sb3NzTW9kYWxUcmlnZ2VyZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gRmxhZyB0byB0cmFjayBpZiBpbnB1dCBzaG91bGQgYmUgZGlzYWJsZWRcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAvLyBGbGFnIHRvIHN0b3AgdGhlIGdhbWUgbG9vcCBvbmNlIGEgd2lubmVyIGlzIGRlY2lkZWRcbiAgICAgICAgdGhpcy5nYW1lRW5kZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0KGxvY2FsUGxheWVySWQsIGFsbFBsYXllcnMpIHtcbiAgICAgICAgdGhpcy50b3RhbFBsYXllcnMgPSBhbGxQbGF5ZXJzLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZExvY2FsUGxheWVySWQgPSBTdHJpbmcobG9jYWxQbGF5ZXJJZCk7XG5cbiAgICAgICAgYWxsUGxheWVycy5mb3JFYWNoKHBEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gU3RyaW5nKHBEYXRhLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckluZm8uc2V0KHBsYXllcklkLCBwRGF0YSk7IC8vIFN0b3JlIG9yaWdpbmFsIHBsYXllciBkYXRhXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcERhdGEuY29sb3IgfHwgXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gYHBsYXllciBwbGF5ZXItJHtjb2xvcn1gO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS56SW5kZXggPSAnMTAnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckRpdik7XG5cbiAgICAgICAgICAgIGNvbnN0IHN4ID0gcERhdGEueCB8fCAxO1xuICAgICAgICAgICAgY29uc3Qgc3kgPSBwRGF0YS55IHx8IDE7XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJywgUG9zaXRpb25Db21wb25lbnQoc3gsIHN5LCBUSUxFX1NJWkUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5JywgVmVsb2NpdHlDb21wb25lbnQoMi41KSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJywgUmVuZGVyYWJsZUNvbXBvbmVudChwbGF5ZXJEaXYsIDY0LCA2NCwgNCwgMTIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpc0xvY2FsID0gcGxheWVySWQgPT09IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IFBsYXllckNvbXBvbmVudChwbGF5ZXJJZCwgY29sb3IsIGlzTG9jYWwpO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5saXZlcyA9IDM7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLm1heEJvbWJzID0gMTtcbiAgICAgICAgICAgIHBsYXllckNvbXAuYm9tYlJhbmdlID0gNDtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicsIHBsYXllckNvbXApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcy5zZXQocGxheWVySWQsIHBsYXllckVudGl0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc0xvY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcsIElucHV0Q29tcG9uZW50KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMocGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltHYW1lRW5naW5lXSBMb2NhbCBwbGF5ZXIgd2FzIG5vdCBmb3VuZFwiLCB7XG4gICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXJJZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzOiBhbGxQbGF5ZXJzLm1hcChwbGF5ZXIgPT4gcGxheWVyLmlkKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlclN5c3RlbXMoKTtcblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5vdykgPT4gdGhpcy5nYW1lTG9vcChub3cpKTtcbiAgICB9XG5cbiAgICBzZXR1cElucHV0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZ2V0S2V5RGlyZWN0aW9uID0gKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93VXAnIHx8IGtleSA9PT0gJ3cnIHx8IGtleSA9PT0gJ1onIHx8IGtleSA9PT0gJ3onKSByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93TGVmdCcgfHwga2V5ID09PSAnYScgfHwga2V5ID09PSAnUScgfHwga2V5ID09PSAncScpIHJldHVybiAnbGVmdCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dSaWdodCcgfHwga2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpIHJldHVybiAncmlnaHQnO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgICAgICAgICAvLyBJTlBVVCBESVNBQkxFRDogSW1tZWRpYXRlbHkgaWdub3JlIGFsbCBrZXlib2FyZCBpbnB1dHMgd2hlbiBwbGF5ZXIgaXMgZGVhZFxuICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0RW5hYmxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlLnVuc2hpZnQoZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICAgICAgLy8gSU5QVVQgRElTQUJMRUQ6IEltbWVkaWF0ZWx5IGlnbm9yZSBhbGwga2V5Ym9hcmQgaW5wdXRzIHdoZW4gcGxheWVyIGlzIGRlYWRcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dEVuYWJsZWQpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkcm9wQm9tYigpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRCb21icyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5maWx0ZXIoYkVudGl0eSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoYkVudGl0eSwgJ0JvbWInKS5vd25lcklkID09PSBwbGF5ZXIuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjdXJyZW50Qm9tYnMubGVuZ3RoID49IHBsYXllci5tYXhCb21icykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUJvbWIocGxheWVyLmlkLCBwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgcGxheWVyLmJvbWJSYW5nZSk7XG4gICAgICAgIGlmICghY3JlYXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2Ryb3BfYm9tYicsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZDogcGxheWVyLmlkLCB4OiBwb3MuZ3JpZFgsIHk6IHBvcy5ncmlkWSwgcmFuZ2U6IHBsYXllci5ib21iUmFuZ2UgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiBib21iLm93bmVySWQgPT09IG93bmVySWQgJiYgcG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuZWwgPSBib21iRGl2O1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicsIGJvbWJDb21wKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlTW92ZShwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW2hhbmRsZVJlbW90ZU1vdmVdIEludmFsaWQgcGF5bG9hZDpcIiwgcGF5bG9hZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBFbnRpdHkgbm90IGZvdW5kIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfS4gQXZhaWxhYmxlIHBsYXllcnM6YCwgQXJyYXkuZnJvbSh0aGlzLnBsYXllckVudGl0aWVzLmtleXMoKSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtoYW5kbGVSZW1vdGVNb3ZlXSBJZ25vcmluZyBsb2NhbCBwbGF5ZXIgdXBkYXRlIGZvciAke3BheWxvYWQuaWR9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwb3MgfHwgIXZlbCB8fCAhcmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gVXBkYXRpbmcgcGxheWVyICR7cGF5bG9hZC5pZH0gdG8gKCR7cGF5bG9hZC5ncmlkWH0sICR7cGF5bG9hZC5ncmlkWX0pYCk7XG4gICAgICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgICAgICBwb3MuZ3JpZFggPSBwYXlsb2FkLmdyaWRYO1xuICAgICAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgICAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwYXlsb2FkLnk7XG4gICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZUJvbWIocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDQpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgcGF5bG9hZC54ID09PSB1bmRlZmluZWQgfHwgcGF5bG9hZC55ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnJlbW92ZVBvd2VyVXBBdChwYXlsb2FkLngsIHBheWxvYWQueSk7XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHBheWxvYWQudHlwZSA9PT0gJ0hFQVJUJykge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAoIXBsYXllciB8fCBwYXlsb2FkLm5ld0xpdmVzID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gcGF5bG9hZC5uZXdMaXZlcztcblxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMoZW50aXR5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coYFtSZW1vdGUgUG93ZXJVcCBQaWNrdXBdIFBsYXllciAke3BheWxvYWQuaWR9IHBpY2tlZCB1cCBoZWFydC4gTmV3IGxpdmVzOiAke3BheWxvYWQubmV3TGl2ZXN9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5hcHBseVBvd2VyVXAoZW50aXR5LCBwYXlsb2FkLnR5cGUpO1xuICAgIH1cblxuICAgIHJlbW92ZVBvd2VyVXBBdChncmlkWCwgZ3JpZFkpIHtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMuYWRkKGAke2dyaWRYfSwke2dyaWRZfWApO1xuICAgICAgICBjb25zdCBwb3dlclVwcyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBvd2VyVXAgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXBvcyB8fCAhcG93ZXJVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwb3dlclVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChwb3dlclVwLmVsICYmIHBvd2VyVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwb3dlclVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG93ZXJVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlQb3dlclVwKGVudGl0eSwgdHlwZSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgdmVsb2NpdHkuc3BlZWQgPSBNYXRoLm1pbih2ZWxvY2l0eS5zcGVlZCArIDEsIDgpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgIC8vIEhFQVJUIHBvd2VyLXVwOiBpbmNyZW1lbnQgbGl2ZXMgKGNhcCBhdCAzKVxuICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5taW4oKHBsYXllci5saXZlcyB8fCAwKSArIDEsIDMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTeXN0ZW1zKCkge1xuICAgICAgICBjb25zdCB1cGRhdGVNYXBDZWxsID0gKHgsIHksIG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubWFwRGF0YVt5XSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm1hcERhdGFbeV1beF0gPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gKTtcbiAgICAgICAgICAgIGlmICghdGlsZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aWxlLmNsYXNzTmFtZSA9ICd0aWxlIHRpbGUtZmxvb3InO1xuICAgICAgICAgICAgdGlsZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiKSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZGVzdHJveUJveENhbGxiYWNrID0gKHgsIHkpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYWltZWRQb3dlclVwcy5oYXMoYCR7eH0sJHt5fWApKSByZXR1cm47XG4gICAgICAgICAgICBzcGF3blBvd2VyVXAodGhpcy53b3JsZCwgeCwgeSwgdGhpcy5jb250YWluZXIsIFRJTEVfU0laRSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25QbGF5ZXJIdXJ0ID0gKGVudGl0eSwgaWQsIHJlbWFpbmluZ0xpdmVzKSA9PiB7XG4gICAgICAgICAgICAvLyBDUklUSUNBTDogT25seSBzZW5kIHBsYXllcl9kaWVkIGlmIFRISVMgSVMgVEhFIExPQ0FMIFBMQVlFUi5cbiAgICAgICAgICAgIC8vIFRoZSBFQ1MgZGFtYWdlU3lzdGVtIHJ1bnMgb24gQUxMIGNsaWVudHMsIHNvIGV2ZXJ5IGNsaWVudCBkZXRlY3RzXG4gICAgICAgICAgICAvLyBldmVyeSBjb2xsaXNpb24uIFdlIG11c3QgZ3VhcmQgdGhlIFdlYlNvY2tldCBtZXNzYWdlIHRvIHByZXZlbnRcbiAgICAgICAgICAgIC8vIGluY29ycmVjdCBkZWF0aCByZXBvcnRzLlxuICAgICAgICAgICAgaWYgKHJlbWFpbmluZ0xpdmVzIDw9IDAgJiYgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5ICYmIHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwbGF5ZXJfZGllZCdcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEhVRCBvbmx5IGZvciB0aGUgbG9jYWwgcGxheWVyLlxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHNldExpdmVzKHJlbWFpbmluZ0xpdmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBvd2VyVXBQaWNrZWQgPSAoaWQsIHR5cGUsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHt4fSwke3l9YCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhpZCkpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IGVudGl0eSA/IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyQ29tcCAmJiBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0TGl2ZXMocGxheWVyQ29tcC5saXZlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyQ29tcCAmJiBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyh0aGlzLmxvY2FsUGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG93ZXJ1cF9waWNrZWQnLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih0eXBlID09PSAnSEVBUlQnID8geyBuZXdMaXZlczogcGxheWVyQ29tcCA/IHBsYXllckNvbXAubGl2ZXMgOiAwIH0gOiB7fSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLndvcmxkLmJyb2FkY2FzdE1vdmVtZW50ID0gKGVudGl0eSwgeCwgeSwgZ3JpZFgsIGdyaWRZLCBkaXJlY3Rpb24sIGlzTW92aW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIGlmICghcGxheWVyIHx8ICF0aGlzLnNvY2tldCB8fCB0aGlzLnNvY2tldC5yZWFkeVN0YXRlICE9PSBXZWJTb2NrZXQuT1BFTikgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbW92ZV9zdGF0ZScsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICAgICAgICBpZDogcGxheWVyLmlkLFxuICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICBncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgaXNNb3ZpbmcsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBpc01vdmluZyA/ICdSVU4nIDogJ0lETEUnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gbW92ZW1lbnRTeXN0ZW0odywgZHQsIG5vdywgdGhpcy5tYXBEYXRhLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGJvbWJTeXN0ZW0odywgZHQsIG5vdywgdGhpcy5tYXBEYXRhLCB1cGRhdGVNYXBDZWxsLCBkZXN0cm95Qm94Q2FsbGJhY2ssIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gZGFtYWdlU3lzdGVtKHRoaXMud29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCB0aGlzLmxvY2FsUGxheWVyRW50aXR5LCBUSUxFX1NJWkUsIHRoaXMuc29ja2V0KSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBwb3dlclVwU3lzdGVtKHcsIG9uUG93ZXJVcFBpY2tlZCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcmVuZGVyU3lzdGVtKHcsIGR0LCBub3csIEFOSU1BVElPTl9ST1dTKSk7XG4gICAgfVxuXG4gICAgZ2FtZUxvb3Aobm93KSB7XG4gICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZHQgPSBub3cgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gbm93O1xuICAgICAgICB0aGlzLndvcmxkLnVwZGF0ZShkdCwgbm93KTtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChuZXh0Tm93KSA9PiB0aGlzLmdhbWVMb29wKG5leHROb3cpKTtcbiAgICB9XG5cbiAgICBoYW5kbGVHYW1lT3Zlcih3aW5uZXJOYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmdhbWVFbmRlZCkgcmV0dXJuOyAvLyBQcmV2ZW50IG11bHRpcGxlIHRyaWdnZXJzXG4gICAgICAgIHRoaXMuZ2FtZUVuZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG5cbiAgICAgICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gJ21lbnUtcGFnZSc7XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICAgIDxNZW51XG4gICAgICAgICAgICAgICAgdGl0bGU9e2Akeyh3aW5uZXJOYW1lIHx8IFwiQSBQbGF5ZXJcIikudG9VcHBlckNhc2UoKX0gV09OIWB9XG4gICAgICAgICAgICAgICAgbWVzc2FnZT1cIlRoZSBsYXN0IHBsYXllciBzdGFuZGluZyB0YWtlcyB0aGUgY3Jvd24uXCJcbiAgICAgICAgICAgIC8+LFxuICAgICAgICAgICAgcm9vdFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBnYW1lIGVuZCBjb25kaXRpb25zIHdpdGggcHJvcGVyIHN0YXRlIGZsYWcgbWFuYWdlbWVudC5cbiAgICAgKiBQcmV2ZW50cyB0aGUgXCJMb29wIFRyYXBcIiAtIG1vZGFsIGlzIG9ubHkgcmVuZGVyZWQgT05DRSB3aGVuIGxpdmVzIHJlYWNoIDAuXG4gICAgICogQWxzbyBkaXNhYmxlcyBpbnB1dCBpbW1lZGlhdGVseSB3aGVuIHBsYXllciBkaWVzLlxuICAgICAqL1xuXG4gICAgcmVtb3ZlUmVtb3RlUGxheWVyKHBsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwbGF5ZXJJZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBpZiAocmVuZGVyYWJsZSAmJiByZW5kZXJhYmxlLmVsICYmIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHJlbmRlcmFibGUuZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMuZGVsZXRlKFN0cmluZyhwbGF5ZXJJZCkpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVIdWRTdGF0cyhlbnRpdHkpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgc2V0Qm9tYnMocGxheWVyLm1heEJvbWJzIHx8IDEpO1xuICAgICAgICBzZXRMaXZlcyhwbGF5ZXIubGl2ZXMgPz8gMyk7XG4gICAgICAgIHNldFJhbmdlKHBsYXllci5ib21iUmFuZ2UgfHwgNCk7XG4gICAgICAgIHNldFNwZWVkKE1hdGgucm91bmQodmVsb2NpdHkuc3BlZWQpKTtcbiAgICB9XG59XG5cbmxldCBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gXCJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFBsYXllck5hbWUobmFtZSkge1xuICAgIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBuYW1lO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIsIG5hbWUpO1xuICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5XCIsIG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGxheWVyTmFtZSgpIHtcbiAgICByZXR1cm4gY3VycmVudExvY2FsUGxheWVyTmFtZSB8fCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiKSB8fCBcIlBsYXllclwiO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGJvbWJTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IGJvbWJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IGJvbWJFbnRpdHkgb2YgYm9tYnMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBib21iID0gd29ybGQuZ2V0Q29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJyk7XG4gICAgICAgIFxuICAgICAgICBib21iLnRpbWVyIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGJvbWIudGltZXIgPD0gMCAmJiAhYm9tYi5leHBsb2RlZCkge1xuICAgICAgICAgICAgYm9tYi5leHBsb2RlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGFmZmVjdGVkQ2VsbHMgPSBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgYm9tYi5yYW5nZSwgbWFwRGF0YSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFmZmVjdGVkQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBleHBEaXYuY2xhc3NOYW1lID0gJ2V4cGxvc2lvbic7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUubGVmdCA9IGAke2NlbGwueCAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUudG9wID0gYCR7Y2VsbC55ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS56SW5kZXggPSAnNyc7XG5cbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nLCB7IFxuICAgICAgICAgICAgICAgICAgICBncmlkWDogY2VsbC54LCBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFk6IGNlbGwueSwgXG4gICAgICAgICAgICAgICAgICAgIHg6IGNlbGwueCAqIHRpbGVTaXplLCBcbiAgICAgICAgICAgICAgICAgICAgeTogY2VsbC55ICogdGlsZVNpemUgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicsIHsgZHVyYXRpb246IDUwMCwgZWw6IGV4cERpdiB9KTtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZXhwRGl2KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAobWFwRGF0YVtjZWxsLnldICYmIG1hcERhdGFbY2VsbC55XVtjZWxsLnhdID09PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZU1hcENlbGwoY2VsbC54LCBjZWxsLnksIDIpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc3Ryb3lCb3hDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveUJveENhbGxiYWNrKGNlbGwueCwgY2VsbC55KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYm9tYi5lbCAmJiBib21iLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYm9tYi5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KGJvbWJFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICBjb25zdCBleHAgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJyk7XG4gICAgICAgIGV4cC5kdXJhdGlvbiAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChleHAuZHVyYXRpb24gPD0gMCkge1xuICAgICAgICAgICAgaWYgKGV4cC5lbCAmJiBleHAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGV4cC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGV4cC5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KGV4cEVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKGJ4LCBieSwgcmFuZ2UsIG1hcERhdGEpIHtcbiAgICBjb25zdCBjZWxscyA9IFt7IHg6IGJ4LCB5OiBieSB9XTtcbiAgICBjb25zdCBkaXJlY3Rpb25zID0gW1xuICAgICAgICB7IHg6IDAsIHk6IC0xIH0sXG4gICAgICAgIHsgeDogMCwgeTogMSB9LFxuICAgICAgICB7IHg6IC0xLCB5OiAwIH0sXG4gICAgICAgIHsgeDogMSwgeTogMCB9XG4gICAgXTtcbiAgICBcbiAgICBjb25zdCBzdGVwcyA9IHJhbmdlIC0gMTsgXG4gICAgXG4gICAgZGlyZWN0aW9ucy5mb3JFYWNoKGRpciA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gYnggKyAoZGlyLnggKiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHR5ID0gYnkgKyAoZGlyLnkgKiBpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFtYXBEYXRhW3R5XSB8fCBtYXBEYXRhW3R5XVt0eF0gPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNlbGxUeXBlID0gbWFwRGF0YVt0eV1bdHhdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2VsbHMucHVzaCh7IHg6IHR4LCB5OiB0eSB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gY2VsbHM7XG59XG4iLCIvKipcbiAqIFNwYXducyBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgc3BlY2lmaWVkIGdyaWQgY29vcmRpbmF0ZXMuXG4gKiBUaGlzIGNyZWF0ZXMgYSBwcm9wZXIgRUNTIGVudGl0eSB3aXRoIFBvc2l0aW9uLCBQb3dlclVwLCBhbmQgUmVuZGVyYWJsZSBjb21wb25lbnRzLlxuICogXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gZ3JpZFggLSBHcmlkIFggY29vcmRpbmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGdyaWRZIC0gR3JpZCBZIGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBnYW1lIGNvbnRhaW5lciBlbGVtZW50XG4gKiBAcGFyYW0ge251bWJlcn0gdGlsZVNpemUgLSBUaGUgc2l6ZSBvZiBlYWNoIGdyaWQgdGlsZSAoZGVmYXVsdDogNjQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGF3bkhlYXJ0UG93ZXJVcCh3b3JsZCwgZ3JpZFgsIGdyaWRZLCBjb250YWluZXIsIHRpbGVTaXplID0gNjQpIHtcbiAgICAvLyBDcmVhdGUgYSBuZXcgZW50aXR5IGZvciB0aGUgaGVhcnQgcG93ZXItdXBcbiAgICBjb25zdCBoZWFydEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIFxuICAgIC8vIEFkZCBQb3NpdGlvbiBjb21wb25lbnRcbiAgICB3b3JsZC5hZGRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3NpdGlvbicsIHtcbiAgICAgICAgZ3JpZFg6IGdyaWRYLFxuICAgICAgICBncmlkWTogZ3JpZFksXG4gICAgICAgIHg6IGdyaWRYICogdGlsZVNpemUsXG4gICAgICAgIHk6IGdyaWRZICogdGlsZVNpemVcbiAgICB9KTtcbiAgICBcbiAgICAvLyBBZGQgUG93ZXJVcCBjb21wb25lbnQgd2l0aCB0eXBlICdIRUFSVCdcbiAgICB3b3JsZC5hZGRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3dlclVwJywge1xuICAgICAgICB0eXBlOiAnSEVBUlQnLFxuICAgICAgICBwaWNrZWRVcDogZmFsc2UsXG4gICAgICAgIGVsOiBudWxsICAvLyBXaWxsIGJlIHNldCBhZnRlciBjcmVhdGluZyB0aGUgRE9NIGVsZW1lbnRcbiAgICB9KTtcbiAgICBcbiAgICAvLyBDcmVhdGUgdGhlIERPTSBlbGVtZW50IGZvciByZW5kZXJpbmdcbiAgICBjb25zdCBoZWFydERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYXJ0RGl2LmNsYXNzTmFtZSA9ICdwb3dlcnVwIHBvd2VydXAtaGVhcnQnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBoZWFydERpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgaGVhcnREaXYuc3R5bGUuYWxpZ25JdGVtcyA9ICdjZW50ZXInO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuZm9udFNpemUgPSAnMzJweCc7XG4gICAgaGVhcnREaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIGhlYXJ0RGl2LnRleHRDb250ZW50ID0gJ+KdpO+4jyc7XG4gICAgXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhlYXJ0RGl2KTtcbiAgICBcbiAgICAvLyBVcGRhdGUgdGhlIFBvd2VyVXAgY29tcG9uZW50IHdpdGggdGhlIERPTSBlbGVtZW50IHJlZmVyZW5jZVxuICAgIGNvbnN0IHBvd2VyVXAgPSB3b3JsZC5nZXRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3dlclVwJyk7XG4gICAgaWYgKHBvd2VyVXApIHtcbiAgICAgICAgcG93ZXJVcC5lbCA9IGhlYXJ0RGl2O1xuICAgIH1cbiAgICBcbiAgICBjb25zb2xlLmxvZyhgW0hlYXJ0IERyb3BdIFNwYXduZWQgSEVBUlQgcG93ZXItdXAgYXQgKCR7Z3JpZFh9LCAke2dyaWRZfSlgKTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHBsYXllciBkZWF0aCB0cmFuc2l0aW9uIHdoZW4gbGl2ZXMgcmVhY2ggMC5cbiAqIFJlbW92ZXMgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGFuZCBzcGF3bnMgYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIGRlYXRoIGxvY2F0aW9uLlxuICpcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJFbnRpdHkgLSBUaGUgZW50aXR5IElEIG9mIHRoZSBkeWluZyBwbGF5ZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBnYW1lIGNvbnRhaW5lciBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplID0gNjQsIGNvbnRhaW5lciA9IG51bGwpIHtcbiAgICAvLyBHZXQgdGhlIHBsYXllcidzIGNvbXBvbmVudHNcbiAgICBjb25zdCBwb3NpdGlvbiA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcblxuICAgIGlmICghcG9zaXRpb24gfHwgIXJlbmRlcmFibGUgfHwgIXBsYXllcikgcmV0dXJuO1xuXG4gICAgLy8gU3RvcmUgdGhlIGdyaWQgY29vcmRpbmF0ZXMgd2hlcmUgdGhlIHBsYXllciBkaWVkXG4gICAgY29uc3QgZGVhdGhHcmlkWCA9IE1hdGguZmxvb3IoKHBvc2l0aW9uLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgIGNvbnN0IGRlYXRoR3JpZFkgPSBNYXRoLmZsb29yKChwb3NpdGlvbi55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcblxuICAgIC8vIENSSVRJQ0FMOiBSZW1vdmUgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGZyb20gdGhlIGRvY3VtZW50IEJFRk9SRSByZW1vdmluZyB0aGUgUmVuZGVyYWJsZSBjb21wb25lbnQuXG4gICAgLy8gVGhpcyBlbnN1cmVzIHRoZSBkZWFkIHBsYXllciB2aXN1YWxseSBkaXNhcHBlYXJzIGltbWVkaWF0ZWx5LlxuICAgIGlmIChyZW5kZXJhYmxlLmVsICYmIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocmVuZGVyYWJsZS5lbCk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGNvbXBvbmVudHMgdGhhdCBlbmFibGUgaW50ZXJhY3Rpb24gYW5kIHJlbmRlcmluZy5cbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgIC8vIFdlIGtlZXAgUG9zaXRpb24gYW5kIFBsYXllciBjb21wb25lbnRzIHRvIGtub3cgd2hlcmUgdGhleSB3ZXJlLlxuXG4gICAgLy8gU3Bhd24gYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIGRlYXRoIGxvY2F0aW9uIChwcm9wZXIgRUNTIGVudGl0eSlcbiAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgIHNwYXduSGVhcnRQb3dlclVwKHdvcmxkLCBkZWF0aEdyaWRYLCBkZWF0aEdyaWRZLCBnYW1lQ29udGFpbmVyLCB0aWxlU2l6ZSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYFtQbGF5ZXIgRGVhdGhdIFBsYXllciAke3BsYXllci5pZH0gZGllZCBhdCAoJHtkZWF0aEdyaWRYfSwgJHtkZWF0aEdyaWRZfSkuIEhlYXJ0IHBvd2VyLXVwIGRyb3BwZWQuYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYW1hZ2VTeXN0ZW0od29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCBsb2NhbFBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgc29ja2V0KSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQbGF5ZXInKTtcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAocGxheWVyLmludmluY2libGVVbnRpbCAmJiBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID4gbm93KSBjb250aW51ZTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gR3JpZC1iYXNlZCBjb2xsaXNpb25cbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRYID0gTWF0aC5mbG9vcigocFBvcy54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRZID0gTWF0aC5mbG9vcigocFBvcy55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcblxuICAgICAgICAgICAgaWYgKHBsYXllckdyaWRYID09PSBlUG9zLmdyaWRYICYmIHBsYXllckdyaWRZID09PSBlUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNMaXZlcyA9IHBsYXllci5saXZlcyA/PyAzO1xuICAgICAgICAgICAgICAgIHBsYXllci5saXZlcyA9IE1hdGgubWF4KHByZXZpb3VzTGl2ZXMgLSAxLCAwKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID0gbm93ICsgMTUwMDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcGxheWVyIGlzIGRlYWQsIHJlcG9ydCBkZWF0aCBPTkNFIHVzaW5nIGd1YXJkIGNsYXVzZVxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIubGl2ZXMgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGxheWVyLmFscmVhZHlSZXBvcnRlZERlYWQpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYWxyZWFkeVJlcG9ydGVkRGVhZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uUGxheWVySHVydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVQbGF5ZXJEZWF0aCh3b3JsZCwgcGxheWVyRW50aXR5LCB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUGxheWVyIHN0aWxsIGFsaXZlLCByZXBvcnQgbm9ybWFsIGRhbWFnZVxuICAgICAgICAgICAgICAgICAgICBpZiAob25QbGF5ZXJIdXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblBsYXllckh1cnQocGxheWVyRW50aXR5LCBwbGF5ZXIuaWQsIHBsYXllci5saXZlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQnJlYWsgdGhlIGxvb3Agc2luY2UgdGhlIHBsYXllciBoYXMgYWxyZWFkeSB0YWtlbiBkYW1hZ2UgZnJvbSB0aGlzIGV4cGxvc2lvbi5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgZnVuY3Rpb24gbW92ZW1lbnRTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHRpbGVTaXplID0gNDApIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScpO1xuICAgIGNvbnN0IGRlbHRhID0gZHQgLyAxNi42NztcblxuICAgIGNvbnN0IFBMQVlFUl9TSVpFID0gdGlsZVNpemU7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgIGNvbnN0IGJlaGF2aW9yID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JlaGF2aW9yJyk7XG5cbiAgICAgICAgaWYgKGJlaGF2aW9yKSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkICsgKGJlaGF2aW9yLmZhc3RTaG9lc0xldmVsIC0gMSkgKiAwLjU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3RpdmVJbnB1dCA9IGlucHV0LmlucHV0UXVldWVbMF07XG4gICAgICAgIGxldCBkeCA9IDA7XG4gICAgICAgIGxldCBkeSA9IDA7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUlucHV0ID09PSAndXAnKSB7XG4gICAgICAgICAgICBkeSA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdkb3duJykge1xuICAgICAgICAgICAgZHkgPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdkb3duJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICBkeCA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgZHggPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdyaWdodCc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNJbnB1dCA9IGR4ICE9PSAwIHx8IGR5ICE9PSAwO1xuXG4gICAgICAgIGlmICghaGFzSW5wdXQpIHtcbiAgICAgICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuICAgICAgICAgICAgdmVsLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdJRExFJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFkgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgY29uc3Qgc25hcFRocmVzaG9sZCA9IDMyO1xuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiBkeCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChwb3MueCwgbmV4dFksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVggPSBNYXRoLmZsb29yKChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WCA9IGN1cnJlbnRUaWxlWCAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZYID0gcG9zLnggLSB0YXJnZXRYO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZYKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeCA9IC1NYXRoLnNpZ24oZGlmZlgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChuZXh0WCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVkgPSBNYXRoLmZsb29yKChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WSA9IGN1cnJlbnRUaWxlWSAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZZID0gcG9zLnkgLSB0YXJnZXRZO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZZKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeSA9IC1NYXRoLnNpZ24oZGlmZlkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYQWZ0ZXJTbmFwID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WUFmdGVyU25hcCA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgIWlzQmxvY2tlZChuZXh0WEFmdGVyU25hcCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy54ID0gbmV4dFhBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgIWlzQmxvY2tlZChwb3MueCwgbmV4dFlBZnRlclNuYXAsIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy55ID0gbmV4dFlBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdSVU4nO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuXG4gICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKSB7XG4gICAgY29uc3Qgc3RlcCA9IHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgaWYgKHBvcy54IDwgcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1pbihwb3MueCArIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9IGVsc2UgaWYgKHBvcy54ID4gcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1heChwb3MueCAtIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9XG5cbiAgICBpZiAocG9zLnkgPCBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWluKHBvcy55ICsgc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH0gZWxzZSBpZiAocG9zLnkgPiBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWF4KHBvcy55IC0gc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH1cblxuICAgIHZlbC5pc01vdmluZyA9XG4gICAgICAgIHBvcy54ICE9PSBwb3MudGFyZ2V0WCB8fFxuICAgICAgICBwb3MueSAhPT0gcG9zLnRhcmdldFk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZCh4LCB5LCBtYXBEYXRhLCB0aWxlU2l6ZSwgcGxheWVyU2l6ZSA9IHRpbGVTaXplKSB7XG4gICAgY29uc3QgcGFkZGluZyA9IDQ7XG5cbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHJpZ2h0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCB0b3AgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgYm90dG9tID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIGJvdHRvbSwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgYm90dG9tLCBtYXBEYXRhKVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZENlbGwoeCwgeSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGwgPSBtYXBEYXRhW3ldICYmIG1hcERhdGFbeV1beF07XG5cbiAgICByZXR1cm4gY2VsbCAhPT0gMCAmJiBjZWxsICE9PSAyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHBvd2VyVXBTeXN0ZW0od29ybGQsIG9uUG93ZXJVcFBpY2tlZCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUGxheWVyJyk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcFBvcyB8fCAhdmVsIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcFVwRW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCB1cFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcFVwID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghdXBQb3MgfHwgIXBVcCB8fCBwVXAucGlja2VkVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAvLyBHcmlkLWJhc2VkIGNvbGxpc2lvbjogcGxheWVyIGdyaWQgcG9zaXRpb24gbWF0Y2hlcyBwb3dlci11cCBncmlkIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAocFBvcy5ncmlkWCA9PT0gdXBQb3MuZ3JpZFggJiYgcFBvcy5ncmlkWSA9PT0gdXBQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIGRpZmZlcmVudCBwb3dlci11cCB0eXBlc1xuICAgICAgICAgICAgICAgIGlmIChwVXAudHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgICAgICAgICB2ZWwuc3BlZWQgPSBNYXRoLm1pbih2ZWwuc3BlZWQgKyAxLCA4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0hFQVJUJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHBvd2VyLXVwJ3MgRE9NIGVsZW1lbnQgZnJvbSB0aGUgc2NyZWVuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC5lbCAmJiBwVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE5vdGlmeSBnYW1lLmpzIHZpYSBjYWxsYmFjayAoaGFuZGxlcyBIVUQgdXBkYXRlICsgc2VydmVyIHN5bmMpXG4gICAgICAgICAgICAgICAgLy8gQ1JJVElDQUw6IFRoaXMgdHJpZ2dlcnMgdXBkYXRlSHVkU3RhdHMsIE5PVCBvblBsYXllckh1cnRcbiAgICAgICAgICAgICAgICBpZiAob25Qb3dlclVwUGlja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uUG93ZXJVcFBpY2tlZChwbGF5ZXIuaWQsIHBVcC50eXBlLCB1cFBvcy5ncmlkWCwgdXBQb3MuZ3JpZFkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIERlc3Ryb3kgdGhlIHBvd2VyLXVwIGVudGl0eSBmcm9tIHRoZSB3b3JsZCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkocFVwRW50aXR5KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0hFQVJUIERFU1RST1lFRF0gSGVhcnQgZW50aXR5IHJlbW92ZWQgZnJvbSB3b3JsZCBhdCAoJHt1cFBvcy5ncmlkWH0sICR7dXBQb3MuZ3JpZFl9KWApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Bhd25Qb3dlclVwKHdvcmxkLCBneCwgZ3ksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IHNlZWQgPSBneCAqIDczODU2MDkzIF4gZ3kgKiAxOTM0OTY2MztcbiAgICBjb25zdCBzZWVkUmFuZG9tID0gKE1hdGguc2luKHNlZWQpICogMTAwMDApIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkKSAqIDEwMDAwKTtcbiAgICBcbiAgICBpZiAoc2VlZFJhbmRvbSA+IDAuMzUpIHJldHVybjtcblxuICAgIGNvbnN0IHR5cGVzID0gWydTUEVFRCcsICdCT01CUycsICdGTEFNRSddO1xuICAgIGNvbnN0IHR5cGVJbmRleCA9IE1hdGguZmxvb3IoKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCkpICogdHlwZXMubGVuZ3RoKTtcbiAgICBjb25zdCByYW5kb21UeXBlID0gdHlwZXNbdHlwZUluZGV4XTtcblxuICAgIGNvbnN0IHBVcEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogdGlsZVNpemUsIHk6IGd5ICogdGlsZVNpemUgfSk7XG4gICAgXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9IGBwb3dlcnVwIHBvd2VydXAtJHtyYW5kb21UeXBlLnRvTG93ZXJDYXNlKCl9YDtcbiAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnRvcCA9IGAke2d5ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcsIHsgdHlwZTogcmFuZG9tVHlwZSwgZWw6IGRpdiB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByZW5kZXJTeXN0ZW0od29ybGQsIGR0LCBub3csIGFuaW1Sb3dzKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUmVuZGVyYWJsZScpO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcblxuICAgICAgICBpZiAoIXJlbmRlcmFibGUuZWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gcmVuZGVyYWJsZS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Um93ID0gYW5pbVJvd3Nbc3RhdGVdW3ZlbC5kaXJlY3Rpb25dO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYW5pbWF0aW9uIHdoZW4gcm93IG9yIHN0YXRlIGNoYW5nZXNcbiAgICAgICAgaWYgKHJlbmRlcmFibGUucm93ICE9PSB0YXJnZXRSb3cgfHwgcmVuZGVyYWJsZS5sYXN0U3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnJvdyA9IHRhcmdldFJvdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdFN0YXRlID0gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcmFtZUNvdW50ID0gc3RhdGUgPT09ICdSVU4nID8gcmVuZGVyYWJsZS5ydW5GcmFtZXMgOiByZW5kZXJhYmxlLmlkbGVGcmFtZXM7XG4gICAgICAgIGNvbnN0IGZyYW1lRGVsYXkgPSBzdGF0ZSA9PT0gJ1JVTicgPyAxMDAwIC8gcmVuZGVyYWJsZS5mcHMgOiAxMDAwIC8gcmVuZGVyYWJsZS5pZGxlRnBzO1xuXG4gICAgICAgIGlmIChub3cgLSByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPiBmcmFtZURlbGF5KSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IChyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSArIDEpICUgZnJhbWVDb3VudDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvc1ggPSAtKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICogcmVuZGVyYWJsZS5mcmFtZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcG9zWSA9IC0ocmVuZGVyYWJsZS5yb3cgKiByZW5kZXJhYmxlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYCR7cG9zWH1weCAke3Bvc1l9cHhgO1xuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3Bvcy54fXB4LCAke3Bvcy55fXB4LCAwKWA7XG4gICAgfVxufVxuIiwiLy8gL3NyYy9lY3Mvd29ybGQuanNcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uZXh0RW50aXR5SWQgPSAwO1xuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgTWFwKCk7IFxuICAgICAgICB0aGlzLnN5c3RlbXMgPSBbXTtcbiAgICB9XG5cbiAgICBjcmVhdGVFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMubmV4dEVudGl0eUlkKys7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkKGVudGl0eSk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVudGl0eShlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgZm9yIChjb25zdCBbY29tcG9uZW50TmFtZSwgY29tcG9uZW50TWFwXSBvZiB0aGlzLmNvbXBvbmVudHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lLCBjb21wb25lbnREYXRhID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHMuaGFzKGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIG5ldyBNYXAoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKS5zZXQoZW50aXR5LCBjb21wb25lbnREYXRhKTtcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRNYXAgPyBjb21wb25lbnRNYXAuZ2V0KGVudGl0eSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBpZiAoY29tcG9uZW50TWFwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBxdWVyeSguLi5jb21wb25lbnROYW1lcykge1xuICAgICAgICBpZiAoY29tcG9uZW50TmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaXJzdE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbMF0pO1xuICAgICAgICBpZiAoIWZpcnN0TWFwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGZpcnN0TWFwLmtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGhhc0FsbCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNvbXBvbmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXAgfHwgIW1hcC5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0FsbCAmJiB0aGlzLmVudGl0aWVzLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkU3lzdGVtKHN5c3RlbUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbUZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZHQsIG5vdykge1xuICAgICAgICBmb3IgKGNvbnN0IHN5c3RlbSBvZiB0aGlzLnN5c3RlbXMpIHtcbiAgICAgICAgICAgIHN5c3RlbSh0aGlzLCBkdCwgbm93KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEdSSURfQk9SREVSX1NJWkUgPSA2O1xuY29uc3QgR0FNRV9DSFJPTUVfV0lEVEggPSA3MjtcbmNvbnN0IEdBTUVfQ0hST01FX0hFSUdIVCA9IDE1MDtcblxuY29uc3QgaW1hZ2VzID0ge1xuICAgIDI6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiLFxuICAgIDM6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX3dhbGwucG5nXCIsXG4gICAgNDogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZXhwbG9pdC5wbmdcIixcbn07XG5cbmNvbnN0IFtwbGF5ZXJOYW1lLCBzZXRQbGF5ZXJOYW1lXSA9IGNyZWF0ZVNpZ25hbChcIlBsYXllciAxXCIpO1xuY29uc3QgW2xpdmVzLCBzZXRMaXZlc10gPSBjcmVhdGVTaWduYWwoMyk7XG5jb25zdCBbc3BlZWQsIHNldFNwZWVkXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtib21icywgc2V0Qm9tYnNdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW3JhbmdlLCBzZXRSYW5nZV0gPSBjcmVhdGVTaWduYWwoMSk7XG5leHBvcnQgeyBzZXRQbGF5ZXJOYW1lLCBzZXRMaXZlcywgc2V0U3BlZWQsIHNldEJvbWJzLCBzZXRSYW5nZSB9O1xuXG5jb25zdCBuYW1lRWwgPSA8c3BhbiBjbGFzcz1cInBsYXllci1uYW1lXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbmFtZUVsLnRleHRDb250ZW50ID0gcGxheWVyTmFtZSgpOyB9KTtcblxuY29uc3QgbGl2ZXNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgbGl2ZXMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3Qgc3BlZWRFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgc3BlZWQtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgYm9tYnNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgYm9tYnMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgcmFuZ2VFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgcmFuZ2UtdmFsdWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBsaXZlc0VsLnRleHRDb250ZW50ID0gbGl2ZXMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBzcGVlZEVsLnRleHRDb250ZW50ID0gc3BlZWQoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBib21ic0VsLnRleHRDb250ZW50ID0gYm9tYnMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyByYW5nZUVsLnRleHRDb250ZW50ID0gcmFuZ2UoKTsgfSk7XG5cbmZ1bmN0aW9uIEdhbWUoeyBncmlkIH0pIHtcbiAgICBjb25zdCBib2FyZFdpZHRoID0gZ3JpZFswXS5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRIZWlnaHQgPSBncmlkLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZE91dGVyV2lkdGggPSBib2FyZFdpZHRoICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3QgYm9hcmRPdXRlckhlaWdodCA9IGJvYXJkSGVpZ2h0ICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBib2FyZFdpZHRoIDogd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRIZWlnaHQgOiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY29uc3Qgc2NhbGUgPSBNYXRoLm1pbihcbiAgICAgICAgMSxcbiAgICAgICAgTWF0aC5tYXgoMC4yLCAodmlld3BvcnRXaWR0aCAtIEdBTUVfQ0hST01FX1dJRFRIKSAvIGJvYXJkT3V0ZXJXaWR0aCksXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0SGVpZ2h0IC0gR0FNRV9DSFJPTUVfSEVJR0hUKSAvIGJvYXJkT3V0ZXJIZWlnaHQpXG4gICAgKTtcbiAgICBjb25zdCByb3dzID0gW107XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IGdyaWQubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCBncmlkW3Jvd0luZGV4XS5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBncmlkW3Jvd0luZGV4XVtjb2xJbmRleF07XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gXCJ0aWxlXCI7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBgd2lkdGg6JHtUSUxFX1NJWkV9cHg7aGVpZ2h0OiR7VElMRV9TSVpFfXB4O2A7XG5cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAyIHx8IGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS1mbG9vclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS13YWxsXCI7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzNdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbNF19KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMCB8fCBjZWxsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzJdfSlgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxscy5wdXNoKDxkaXYgY2xhc3M9e2NsYXNzTmFtZX0gZGF0YS14PXtjb2xJbmRleH0gZGF0YS15PXtyb3dJbmRleH0gc3R5bGU9e3N0eWxlfT48L2Rpdj4pO1xuICAgICAgICB9XG4gICAgICAgIHJvd3MucHVzaCg8ZGl2IGNsYXNzPVwiZ3JpZC1yb3dcIj57Y2VsbHN9PC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWdsYXNzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWJhclwiPlxuICAgICAgICAgICAgICAgICAgICB7bmFtZUVsfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+TGl2ZXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpdmVzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+U3BlZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwZWVkRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+Qm9tYnM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvbWJzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+UmFuZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JhbmdlRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtYm9hcmQtZnJhbWVcIiBzdHlsZT17YHdpZHRoOiR7Ym9hcmRPdXRlcldpZHRoICogc2NhbGV9cHg7aGVpZ2h0OiR7Ym9hcmRPdXRlckhlaWdodCAqIHNjYWxlfXB4O2B9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBpZD1cImdhbWUtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZ2FtZS1ncmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtgcG9zaXRpb246cmVsYXRpdmU7d2lkdGg6JHtib2FyZFdpZHRofXB4O2hlaWdodDoke2JvYXJkSGVpZ2h0fXB4O3RyYW5zZm9ybTpzY2FsZSgke3NjYWxlfSk7YH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IENoYXRQbGF5ZXJzIGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxubGV0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSBjcmVhdGVTaWduYWwoe30pO1xuZXhwb3J0IHsgc2V0U3RhdGVzIH07XG5cbmxldCByb29tSWRFbCA9IDxwPlJvb20gSUQ6IDwvcD47XG5sZXQgcGxheWVyc0VsID0gPHA+UGxheWVyczogIC8gNDwvcD47XG5sZXQgdGV4dEVsID0gPHA+PC9wPjtcbmxldCB0aW1lckVsID0gPHA+VGltZXI6IDwvcD47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcyA9IHN0YXRlcygpO1xuICAgIHJvb21JZEVsLnRleHRDb250ZW50ID0gYFJvb20gSUQ6ICR7cy5yb29tSWR9YDtcbiAgICBwbGF5ZXJzRWwudGV4dENvbnRlbnQgPSBgUGxheWVyczogJHtzLnBsYXllcnNDb3VudH0gLyA0YDtcbiAgICB0ZXh0RWwudGV4dENvbnRlbnQgPSBzLnRleHQgfHwgXCJcIjtcblxuICAgIGlmIChzLmdhbWVTdGFydGVkKSB7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBcIlRpbWVyOiBHYW1lIHN0YXJ0ZWRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0aW1lclRleHQgPSAoIXMuc2Vjb25kc0xlZnQpID8gXCJXYWl0aW5nIGZvciBvbmUgbW9yZSBwbGF5ZXJcIiA6IGAke3Muc2Vjb25kc0xlZnR9IHNlY29uZHNgO1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gYFRpbWVyOiAke3RpbWVyVGV4dH1gO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBMb2JieSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWxvYmJ5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9iYnktYm94XCI+XG4gICAgICAgICAgICAgICAgPGgxPkxvYmJ5PC9oMT5cbiAgICAgICAgICAgICAgICB7cm9vbUlkRWx9XG4gICAgICAgICAgICAgICAge3BsYXllcnNFbH1cbiAgICAgICAgICAgICAgICB7dGV4dEVsfVxuICAgICAgICAgICAgICAgIHt0aW1lckVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q2hhdFBsYXllcnMgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2JieTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZW51KHtcbiAgICAgICAgdGl0bGUgPSBcIllvdSBXaW4hXCIsXG4gICAgICAgIG1lc3NhZ2UgPSBcIkFsbCBvdGhlciBwbGF5ZXJzIGhhdmUgbGVmdCB0aGUgZ2FtZS5cIixcbiAgICAgICAgYnV0dG9uVGV4dCA9IFwiUGxheSBBZ2FpblwiLFxuICAgIH0gPSB7fSkge1xuICAgIGNvbnN0IHJlcGxheUJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+e2J1dHRvblRleHR9PC9idXR0b24+O1xuXG4gICAgcmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvXCI7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVudS1ib3hcIj5cbiAgICAgICAgICAgIDxoMT57dGl0bGV9PC9oMT5cbiAgICAgICAgICAgIDxwPnttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgIHtyZXBsYXlCdG59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHN1Ym1pdHRlZCA9IGZhbHNlO1xuXG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoc3VibWl0dGVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgbmlja25hbWUgPSBmb3JtRGF0YS5nZXQoXCJuaWNrbmFtZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFuaWNrbmFtZSB8fCBuaWNrbmFtZS5sZW5ndGggPiAyMCkgcmV0dXJuO1xuXG4gICAgICAgIHN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHNldFBsYXllck5hbWUobmlja25hbWUpO1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwibmlja25hbWVfb2ZfdGhlX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmlja25hbWUtaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW50ZXIgeW91ciBuYW1lXCIgbWF4bGVuZ3RoPVwiMjBcIiAvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIHRoaXMubXVzaWMucGxheSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpO1xuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVzaWMucGF1c2VkIHx8IHRoaXMubXVzaWMubXV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvblwiKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVCdXR0b24oKSB7XG4gICAgICAgIGNvbnN0IGlzTXV0ZWQgPSB0aGlzLm11c2ljLm11dGVkIHx8IHRoaXMubXVzaWMucGF1c2VkO1xuXG4gICAgICAgIHRoaXMuaWNvbi5jbGFzc05hbWUgPSBpc011dGVkID8gXCJmYS1zb2xpZCBmYS12b2x1bWUtb2ZmXCIgOiBcImZhLXNvbGlkIGZhLXZvbHVtZS1oaWdoXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1tdXRlZFwiLCBpc011dGVkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvdW5kO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgcmVuZGVyIH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBNZW51IGZyb20gXCIuLi9wYWdlcy9tZW51XCI7XG5pbXBvcnQgTG9iYnkgZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcbmltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcblxubGV0IGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVdlYnNvY2tldChtZXNzYWdlLCByb290LCB3c3MpIHtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICAvLyB0aGlzIGNhc2UgaXMgZm9yIHVwZGF0ZSB0aGUgbG9iYnlcbiAgICAgICAgY2FzZSBcInJvb21fdXBkYXRlXCI6XG4gICAgICAgIGNhc2UgXCJsb2JieV90aW1lclwiOlxuICAgICAgICAgICAgLy8gRml4OiBJZiB3ZSBhcmUgYWxyZWFkeSBpbiBhIGdhbWUsIGRvbid0IHN3aXRjaCBiYWNrIHRvIHRoZSBsb2JieSBzY3JlZW4gd2hlbiBzb21lb25lIHF1aXRzXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPT09IFwiZ2FtZS1wYWdlXCIpIHtcbiAgICAgICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IG1lc3NhZ2UucGxheWVyc0NvdW50LFxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogbWVzc2FnZS5zZWNvbmRzTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuXG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb250YWluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogbWVzc2FnZS5wbGF5ZXJzQ291bnQsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IG1lc3NhZ2Uuc2Vjb25kc0xlZnQsXG4gICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAvLyB0aGlzIGNhc2UgaXMgZm9yIHN0YXJ0IHRoZSBnYW1lXG4gICAgICAgIGNhc2UgXCJnYW1lX3N0YXJ0ZWRcIjpcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxHYW1lIGdyaWQ9e21lc3NhZ2UuZ3JpZH0gLz4sIHJvb3QpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvbnRhaW5lclwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSAobWVzc2FnZS5wbGF5ZXJzIHx8IFtdKS5maW5kKHBsYXllciA9PiBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UueW91clBsYXllcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIGxvY2FsUGxheWVyLm5pY2tuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIdWRQbGF5ZXJOYW1lKGxvY2FsUGxheWVyLm5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBHYW1lRW5naW5lKGdhbWVDb250YWluZXIsIG1lc3NhZ2UuZ3JpZCwgd3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lLmluaXQobWVzc2FnZS55b3VyUGxheWVySWQsIG1lc3NhZ2UucGxheWVycyB8fCBbXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBlbmdpbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdhbWUgY29udGFpbmVyIHdhcyBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLy8gdGhpcyBjYXNlIGlzIGZvciByZXR1cm4gdG8gbWVudSB3aGVuIHJvb20gaXMgYWxvbmVcbiAgICAgICAgY2FzZSBcInJvb21fYWxvbmVcIjpcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8vIHRoaXMgY2FzZSBpcyBmb3IgZ2FtZSByZXN1bHRzICh3aW4sIGxvc3QsIGRyYXcpXG4gICAgICAgIGNhc2UgXCJnYW1lX292ZXJcIjpcbiAgICAgICAgY2FzZSBcImdhbWVfd29uXCI6IC8vIEtlZXAgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgaWYgbmVlZGVkXG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuXG4gICAgICAgICAgICBsZXQgdGl0bGUgPSBcIkdBTUUgT1ZFUlwiO1xuICAgICAgICAgICAgbGV0IG1lc3NhZ2VUZXh0ID0gXCJUaGUgZ2FtZSBoYXMgZW5kZWQuXCI7XG4gICAgICAgICAgICBsZXQgYnRuVGV4dCA9IFwiUGxheSBBZ2FpblwiO1xuXG4gICAgICAgICAgICBpZiAobWVzc2FnZS5yZXN1bHQgPT09IFwid29uXCIpIHtcbiAgICAgICAgICAgICAgICB0aXRsZSA9IGAkeyhtZXNzYWdlLndpbm5lck5hbWUgfHwgXCJZT1VcIikudG9VcHBlckNhc2UoKX0gV09OIWA7XG4gICAgICAgICAgICAgICAgbWVzc2FnZVRleHQgPSBcIlRoZSBsYXN0IHBsYXllciBzdGFuZGluZyB0YWtlcyB0aGUgY3Jvd24uXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UucmVzdWx0ID09PSBcImxvc3RcIikge1xuICAgICAgICAgICAgICAgIHRpdGxlID0gXCJZT1UgTE9TVCFcIjtcbiAgICAgICAgICAgICAgICBtZXNzYWdlVGV4dCA9IFwiQmV0dGVyIGx1Y2sgbmV4dCB0aW1lIVwiO1xuICAgICAgICAgICAgICAgIGJ0blRleHQgPSBcIlBsYXkgQW5vdGhlciBUaW1lXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UucmVzdWx0ID09PSBcImRyYXdcIikge1xuICAgICAgICAgICAgICAgIHRpdGxlID0gXCJJVCdTIEEgRFJBVyFcIjtcbiAgICAgICAgICAgICAgICBtZXNzYWdlVGV4dCA9IFwiRXZlcnlvbmUgd2VudCBkb3duIGluIGEgYmxhemUgb2YgZ2xvcnkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbmRlcihcbiAgICAgICAgICAgICAgICA8TWVudVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17dGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U9e21lc3NhZ2VUZXh0fVxuICAgICAgICAgICAgICAgICAgICBidXR0b25UZXh0PXtidG5UZXh0fVxuICAgICAgICAgICAgICAgIC8+LFxuICAgICAgICAgICAgICAgIHJvb3RcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAvLyB0aGlzIGNhc2UgaXMgZm9yIHJlY2VpdmUgYSBjaGF0IG1lc3NhZ2VcbiAgICAgICAgY2FzZSBcImNoYXRfbWVzc2FnZVwiOlxuXG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2LCBtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8vIHRoaXMgY2FzZSBpcyBmb3IgbW92ZSBhbm90aGVyIHBsYXllclxuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZU1vdmUobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8vIHRoaXMgY2FzZSBpcyBmb3IgZHJvcCBhIGJvbWIgZnJvbSBhbm90aGVyIHBsYXllclxuICAgICAgICBjYXNlIFwiYm9tYl9kcm9wcGVkXCI6XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZUJvbWIobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8vIHRoaXMgY2FzZSBpcyBmb3IgcGljayB1cCBhIHBvd2VyIHVwIG9yIGhlYXJ0XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuXG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAvLyB0aGlzIGNhc2UgaXMgZm9yIHdoZW4gYSBwbGF5ZXIgcXVpdHMgb3IgcmVmcmVzaGVzXG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfcXVpdFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUucmVtb3ZlUmVtb3RlUGxheWVyKG1lc3NhZ2UucGxheWVySWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC9hcHAuanNcIik7XG4iLCIiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJwcm9wcyIsImNoaWxkcmVuIiwiZWxlIiwiZG9jdW1lbnQiLCJrZXkiLCJzdGFydHNXaXRoIiwiZXZlbnROYW1lIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRBdHRyaWJ1dGUiLCJmbGF0Q2hpbGRyZW4iLCJmbGF0IiwiSW5maW5pdHkiLCJhcHBlbmQiLCJmaWx0ZXIiLCJjaGlsZCIsInVuZGVmaW5lZCIsInJlbmRlciIsImVsZW1lbnQiLCJjb250YWluZXIiLCJyZXBsYWNlQ2hpbGRyZW4iLCJSb3V0ZXIiLCJyb3V0ZXIiLCJlZmZlY3RTdGFjayIsImFjdGl2ZUVmZmVjdCIsImNyZWF0ZVNpZ25hbCIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwiZWZmZWN0cyIsIlNldCIsIlJlYWQiLCJhZGQiLCJXcml0ZSIsIm5ld1ZhbHVlIiwiZm4iLCJmb3JFYWNoIiwiZWZmZWN0IiwiY3JlYXRlRWZmZWN0IiwicHVzaCIsInBvcCIsImxlbmd0aCIsIlJvdXRlcyIsIk9iamVjdCIsImNyZWF0ZSIsIkZpcnN0UmVzb2x2ZSIsIm9uIiwicGF0aCIsImhhbmRsZXIiLCJuYXZpZ2F0ZSIsImhpc3RvcnkiLCJuYXZpZ2F0aW9uIiwicmVzb2x2ZSIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJ1cmwiLCJVUkwiLCJocmVmIiwibGlzdGVuIiwib25FcnJvcjQwNCIsImV2ZW50IiwiZGVzdGluYXRpb24iLCJpbnRlcmNlcHQiLCJjb25zb2xlIiwibG9nIiwiUmVnaXN0ZXIiLCJTb3VuZCIsImhhbmRsZVdlYnNvY2tldCIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsIndpbmRvdyIsImhvc3RuYW1lIiwic291bmQiLCJpbml0IiwiYm9keSIsImNsYXNzTmFtZSIsImFsZXJ0IiwibWVzc2FnZSIsIkpTT04iLCJwYXJzZSIsImRhdGEiLCJtZXNzYWdlcyIsInNldE1lc3NhZ2VzIiwiQ2hhdFBsYXllcnMiLCJtZXNzYWdlc0NvbnRhaW5lciIsImNsYXNzIiwibXNncyIsImlubmVySFRNTCIsIm1zZyIsInAiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsImdldCIsInRyaW0iLCJyZXNldCIsInNlbmQiLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlBvc2l0aW9uQ29tcG9uZW50IiwiZ3giLCJneSIsInRpbGVTaXplIiwiZ3JpZFgiLCJncmlkWSIsIngiLCJ5IiwidGFyZ2V0WCIsInRhcmdldFkiLCJWZWxvY2l0eUNvbXBvbmVudCIsImJhc2VTcGVlZCIsInNwZWVkIiwiaXNNb3ZpbmciLCJkaXJlY3Rpb24iLCJJbnB1dENvbXBvbmVudCIsImlucHV0UXVldWUiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiZWwiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJ0b3RhbEZyYW1lcyIsImZwcyIsImN1cnJlbnRGcmFtZSIsInJ1bkZyYW1lcyIsImlkbGVGcmFtZXMiLCJpZGxlRnBzIiwibGFzdEZyYW1lVGltZSIsInJvdyIsInN0YXRlIiwibGFzdFN0YXRlIiwiUGxheWVyQ29tcG9uZW50IiwiaWQiLCJjaGFyVHlwZSIsImlzTG9jYWwiLCJCb21iQ29tcG9uZW50Iiwib3duZXJJZCIsInRpbWVyIiwicmFuZ2UiLCJleHBsb2RlZCIsIkV4cGxvc2lvbkNvbXBvbmVudCIsImR1cmF0aW9uIiwiUG93ZXJVcENvbXBvbmVudCIsInBpY2tlZFVwIiwiQmVoYXZpb3JDb21wb25lbnQiLCJnaG9zdE1vZGUiLCJ0aHJvd2FibGUiLCJkZXRvbmF0b3IiLCJmYXN0U2hvZXNMZXZlbCIsImJvbWJzIiwibWF4IiwiY3VycmVudCIsIldvcmxkIiwibW92ZW1lbnRTeXN0ZW0iLCJyZW5kZXJTeXN0ZW0iLCJib21iU3lzdGVtIiwiZGFtYWdlU3lzdGVtIiwiY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyIsInNwYXduSGVhcnRQb3dlclVwIiwiTWVudSIsInBvd2VyVXBTeXN0ZW0iLCJzcGF3blBvd2VyVXAiLCJzZXRCb21icyIsInNldExpdmVzIiwic2V0UmFuZ2UiLCJzZXRTcGVlZCIsIlRJTEVfU0laRSIsIkFOSU1BVElPTl9ST1dTIiwiUlVOIiwidXAiLCJsZWZ0IiwiZG93biIsInJpZ2h0IiwiSURMRSIsIkdhbWVFbmdpbmUiLCJjb25zdHJ1Y3RvciIsImNhbnZhc0NvbnRhaW5lciIsIm1hcERhdGEiLCJzb2NrZXQiLCJ3b3JsZCIsImxvY2FsUGxheWVyRW50aXR5IiwicGxheWVyRW50aXRpZXMiLCJNYXAiLCJwbGF5ZXJJbmZvIiwibGFzdFRpbWUiLCJyZW1vdmVJbnB1dExpc3RlbmVycyIsImFuaW1hdGlvbkZyYW1lIiwicnVubmluZyIsImNsYWltZWRQb3dlclVwcyIsImxvc3NNb2RhbFRyaWdnZXJlZCIsImlucHV0RW5hYmxlZCIsImdhbWVFbmRlZCIsImxvY2FsUGxheWVySWQiLCJhbGxQbGF5ZXJzIiwidG90YWxQbGF5ZXJzIiwibm9ybWFsaXplZExvY2FsUGxheWVySWQiLCJTdHJpbmciLCJwRGF0YSIsInBsYXllcklkIiwicGxheWVyRW50aXR5IiwiY3JlYXRlRW50aXR5Iiwic2V0IiwicGxheWVyRGl2IiwiY29sb3IiLCJzdHlsZSIsInBvc2l0aW9uIiwiekluZGV4Iiwid2lsbENoYW5nZSIsInN4Iiwic3kiLCJhZGRDb21wb25lbnQiLCJwbGF5ZXJDb21wIiwibGl2ZXMiLCJtYXhCb21icyIsImJvbWJSYW5nZSIsInVwZGF0ZUh1ZFN0YXRzIiwic2V0dXBJbnB1dCIsIndhcm4iLCJwbGF5ZXJzIiwibWFwIiwicGxheWVyIiwicmVnaXN0ZXJTeXN0ZW1zIiwicGVyZm9ybWFuY2UiLCJub3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJnYW1lTG9vcCIsImlucHV0IiwiZ2V0Q29tcG9uZW50IiwiZ2V0S2V5RGlyZWN0aW9uIiwiaGFuZGxlS2V5RG93biIsImRpciIsImluY2x1ZGVzIiwiY29kZSIsImRyb3BCb21iIiwiaGFuZGxlS2V5VXAiLCJkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInBvcyIsImN1cnJlbnRCb21icyIsInF1ZXJ5IiwiYkVudGl0eSIsImNyZWF0ZWQiLCJjcmVhdGVCb21iIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJwYXlsb2FkIiwiZXhpc3RzIiwic29tZSIsImVudGl0eSIsImJvbWIiLCJib21iRW50aXR5IiwiYm9tYkRpdiIsInRvcCIsImJvbWJDb21wIiwiaGFuZGxlUmVtb3RlTW92ZSIsIkFycmF5IiwiZnJvbSIsImtleXMiLCJ2ZWwiLCJyZW5kZXJhYmxlIiwiaGFuZGxlUmVtb3RlQm9tYiIsImhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQiLCJyZW1vdmVQb3dlclVwQXQiLCJuZXdMaXZlcyIsImFwcGx5UG93ZXJVcCIsInBvd2VyVXBzIiwicG93ZXJVcCIsInBhcmVudE5vZGUiLCJkZXN0cm95RW50aXR5IiwidmVsb2NpdHkiLCJNYXRoIiwibWluIiwidXBkYXRlTWFwQ2VsbCIsInRpbGUiLCJxdWVyeVNlbGVjdG9yIiwiYmFja2dyb3VuZEltYWdlIiwiZGVzdHJveUJveENhbGxiYWNrIiwiaGFzIiwib25QbGF5ZXJIdXJ0IiwicmVtYWluaW5nTGl2ZXMiLCJvblBvd2VyVXBQaWNrZWQiLCJicm9hZGNhc3RNb3ZlbWVudCIsImFkZFN5c3RlbSIsInciLCJkdCIsInVwZGF0ZSIsIm5leHROb3ciLCJoYW5kbGVHYW1lT3ZlciIsIndpbm5lck5hbWUiLCJkZXN0cm95IiwidGl0bGUiLCJ0b1VwcGVyQ2FzZSIsInJlbW92ZVJlbW90ZVBsYXllciIsImRlbGV0ZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicm91bmQiLCJjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIiwic2V0UGxheWVyTmFtZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJnZXRQbGF5ZXJOYW1lIiwiZ2V0SXRlbSIsImFmZmVjdGVkQ2VsbHMiLCJjYWxjdWxhdGVFeHBsb3Npb25DZWxscyIsImNlbGwiLCJleHBFbnRpdHkiLCJleHBEaXYiLCJ3aWR0aCIsImhlaWdodCIsImV4cGxvc2lvbnMiLCJleHAiLCJieCIsImJ5IiwiY2VsbHMiLCJkaXJlY3Rpb25zIiwic3RlcHMiLCJpIiwidHgiLCJ0eSIsImNlbGxUeXBlIiwiaGVhcnRFbnRpdHkiLCJoZWFydERpdiIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJmb250U2l6ZSIsImhhbmRsZVBsYXllckRlYXRoIiwiZGVhdGhHcmlkWCIsImZsb29yIiwiZGVhdGhHcmlkWSIsInJlbW92ZUNvbXBvbmVudCIsImdhbWVDb250YWluZXIiLCJwUG9zIiwiaW52aW5jaWJsZVVudGlsIiwiZVBvcyIsInBsYXllckdyaWRYIiwicGxheWVyR3JpZFkiLCJwcmV2aW91c0xpdmVzIiwiYWxyZWFkeVJlcG9ydGVkRGVhZCIsImVudGl0aWVzIiwiZGVsdGEiLCJQTEFZRVJfU0laRSIsImJlaGF2aW9yIiwibW92ZVRvd2FyZFRhcmdldCIsImFjdGl2ZUlucHV0IiwiZHgiLCJkeSIsImhhc0lucHV0IiwibmV4dFgiLCJuZXh0WSIsInNuYXBUaHJlc2hvbGQiLCJpc0Jsb2NrZWQiLCJjdXJyZW50VGlsZVgiLCJkaWZmWCIsImFicyIsInNpZ24iLCJjdXJyZW50VGlsZVkiLCJkaWZmWSIsIm5leHRYQWZ0ZXJTbmFwIiwibmV4dFlBZnRlclNuYXAiLCJzdGVwIiwicGxheWVyU2l6ZSIsInBhZGRpbmciLCJib3R0b20iLCJpc0Jsb2NrZWRDZWxsIiwicFVwRW50aXR5IiwidXBQb3MiLCJwVXAiLCJzZWVkIiwic2VlZFJhbmRvbSIsInNpbiIsInR5cGVzIiwidHlwZUluZGV4IiwicmFuZG9tVHlwZSIsImRpdiIsImFuaW1Sb3dzIiwidGFyZ2V0Um93IiwiZnJhbWVDb3VudCIsImZyYW1lRGVsYXkiLCJwb3NYIiwicG9zWSIsImJhY2tncm91bmRQb3NpdGlvbiIsInRyYW5zZm9ybSIsIm5leHRFbnRpdHlJZCIsImNvbXBvbmVudHMiLCJzeXN0ZW1zIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudE1hcCIsImVudHJpZXMiLCJjb21wb25lbnREYXRhIiwiY29tcG9uZW50TmFtZXMiLCJmaXJzdE1hcCIsInJlc3VsdHMiLCJoYXNBbGwiLCJzeXN0ZW1GdW5jdGlvbiIsInN5c3RlbSIsIkdSSURfQk9SREVSX1NJWkUiLCJHQU1FX0NIUk9NRV9XSURUSCIsIkdBTUVfQ0hST01FX0hFSUdIVCIsImltYWdlcyIsInBsYXllck5hbWUiLCJuYW1lRWwiLCJsaXZlc0VsIiwic3BlZWRFbCIsImJvbWJzRWwiLCJyYW5nZUVsIiwiR2FtZSIsImdyaWQiLCJib2FyZFdpZHRoIiwiYm9hcmRIZWlnaHQiLCJib2FyZE91dGVyV2lkdGgiLCJib2FyZE91dGVySGVpZ2h0Iiwidmlld3BvcnRXaWR0aCIsImlubmVyV2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsImlubmVySGVpZ2h0Iiwic2NhbGUiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInNldFN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJ0ZXh0IiwiZ2FtZVN0YXJ0ZWQiLCJ0aW1lclRleHQiLCJzZWNvbmRzTGVmdCIsIkxvYmJ5IiwiYnV0dG9uVGV4dCIsInJlcGxheUJ0biIsInN1Ym1pdHRlZCIsInBsYXllckVudGVyIiwiY3VycmVudFRhcmdldCIsIm5pY2tuYW1lIiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImJ1dHRvbiIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwidXBkYXRlQnV0dG9uIiwicGxheSIsInRoZW4iLCJjYXRjaCIsInBhdXNlZCIsIm11dGVkIiwiaXNNdXRlZCIsImNsYXNzTGlzdCIsInNldEh1ZFBsYXllck5hbWUiLCJjdXJyZW50R2FtZUVuZ2luZSIsInNldFRpbWVvdXQiLCJsb2NhbFBsYXllciIsImZpbmQiLCJ5b3VyUGxheWVySWQiLCJlbmdpbmUiLCJlcnJvciIsIm1lc3NhZ2VUZXh0IiwiYnRuVGV4dCIsInJlc3VsdCIsInByZXYiXSwic291cmNlUm9vdCI6IiJ9