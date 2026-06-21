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
  // heartDiv.textContent = '❤️';

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
    const renderable = world.getComponent(playerEntity, 'Renderable');
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

        // Visual blink effect
        if (renderable && renderable.el) {
          renderable.el.classList.add('damaged-blink');
          setTimeout(() => {
            // Re-fetch renderable in case it was removed (e.g. death)
            if (renderable.el) {
              renderable.el.classList.remove('damaged-blink');
            }
          }, 1500);
        }

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
  }, "\u2764\uFE0F"), livesEl), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "\u26A1"), speedEl), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "\uD83D\uDCA3"), bombsEl), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "\uD83C\uDFAF"), rangeEl))), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setError: () => (/* binding */ setError)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _ecs_game_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ecs/game.js */ "./src/ecs/game.js");
/* harmony import */ var _mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mini-framework/reactivity */ "./mini-framework/reactivity.js");



const [error, setError] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_2__.createSignal)("");

function Register({
  wss
}) {
  let submitted = false;
  const errorEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "register-error"
  });
  (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_2__.createEffect)(() => {
    errorEl.textContent = error();
  });
  let playerEnter = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nickname = formData.get("nickname").trim();
    if (!nickname || nickname.length > 20) {
      setError("Invalid nickname");
      return;
    }
    setError("");
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
  }, errorEl, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
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
/* harmony import */ var _pages_register__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pages/register */ "./src/pages/register.jsx");









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

    // this case for errors (like nickname taken)
    case "error":
      if (document.body.className === "register-page") {
        (0,_pages_register__WEBPACK_IMPORTED_MODULE_6__.setError)(message.message);
      } else {
        alert(message.message);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDNUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QsRTs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL2RvbS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29yay5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5LmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jaGF0LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2NvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9ib21iU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL21vdmVtZW50U3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy93b3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvZ2FtZS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2xvYmJ5LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL3JlZ2lzdGVyLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvc291bmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3dlYnNvY2tldC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyIGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IFNvdW5kIGZyb20gXCIuLi91dGlscy9zb3VuZFwiO1xuaW1wb3J0IHsgaGFuZGxlV2Vic29ja2V0IH0gZnJvbSBcIi4uL3V0aWxzL3dlYnNvY2tldC5qc1wiO1xuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChgd3M6Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZX06NTAwMGApO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5cbnNvdW5kLmluaXQoKTtcblxucm91dGVyLm9uKFwiL1wiLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcInJlZ2lzdGVyLXBhZ2VcIjtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgaGFuZGxlV2Vic29ja2V0KG1lc3NhZ2UsIHJvb3QsIHdzcyk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgd3NzO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCB3c3MgZnJvbSBcIi4uL2FwcC9hcHBcIjtcblxuY29uc3QgW21lc3NhZ2VzLCBzZXRNZXNzYWdlc10gPSBjcmVhdGVTaWduYWwoW10pO1xuZXhwb3J0IHsgc2V0TWVzc2FnZXMgfTtcblxuZnVuY3Rpb24gQ2hhdFBsYXllcnMoKSB7XG4gICAgY29uc3QgbWVzc2FnZXNDb250YWluZXIgPSA8ZGl2IGNsYXNzPVwibWVzc2FnZXNcIj48L2Rpdj47XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBtc2dzID0gbWVzc2FnZXMoKTtcbiAgICAgICAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBmb3IgKGxldCBtc2cgb2YgbXNncykge1xuICAgICAgICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IG1zZztcbiAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHApO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIucmVtb3ZlQ2hpbGQobWVzc2FnZXNDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgICAgIG1zZ3MudW5zaGlmdCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYnJvYWRjYXN0TWVzc2FnZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS50YXJnZXQpO1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGZvcm1EYXRhLmdldChcIm1lc3NhZ2VcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbWVzc2FnZSB8fCBtZXNzYWdlLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwiY2hhdF9tZXNzYWdlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICB9KSk7XG4gICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNoYXRcIiBvblN1Ym1pdD17YnJvYWRjYXN0TWVzc2FnZX0+XG4gICAgICAgICAgICB7bWVzc2FnZXNDb250YWluZXJ9XG4gICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibWVzc2FnZVwiIHBsYWNlaG9sZGVyPVwidHlwZSB0byB0aGUgb3RoZXIgcGxheWVycyAuLi5cIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5zZW5kPC9idXR0b24+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhdFBsYXllcnM7IiwiLy8gL3NyYy9lY3MvY29tcG9uZW50cy5qc1xuXG5leHBvcnQgY29uc3QgUG9zaXRpb25Db21wb25lbnQgPSAoZ3gsIGd5LCB0aWxlU2l6ZSA9IDY0KSA9PiAoe1xuICAgIGdyaWRYOiBneCxcbiAgICBncmlkWTogZ3ksXG4gICAgeDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB5OiBneSAqIHRpbGVTaXplLFxuICAgIHRhcmdldFg6IGd4ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WTogZ3kgKiB0aWxlU2l6ZVxufSk7XG5cbmV4cG9ydCBjb25zdCBWZWxvY2l0eUNvbXBvbmVudCA9IChiYXNlU3BlZWQgPSAyLjUpID0+ICh7XG4gICAgYmFzZVNwZWVkOiBiYXNlU3BlZWQsXG4gICAgc3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBpc01vdmluZzogZmFsc2UsXG4gICAgZGlyZWN0aW9uOiAnZG93bidcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5wdXRDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGlucHV0UXVldWU6IFtdXG59KTtcblxuZXhwb3J0IGNvbnN0IFJlbmRlcmFibGVDb21wb25lbnQgPSAoZWwsIGZyYW1lV2lkdGggPSA2NCwgZnJhbWVIZWlnaHQgPSA2NCwgdG90YWxGcmFtZXMgPSA0LCBmcHMgPSAxMikgPT4gKHtcbiAgICBlbDogZWwsXG4gICAgZnJhbWVXaWR0aDogZnJhbWVXaWR0aCxcbiAgICBmcmFtZUhlaWdodDogZnJhbWVIZWlnaHQsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiB0b3RhbEZyYW1lcyxcbiAgICBydW5GcmFtZXM6IDQsXG4gICAgaWRsZUZyYW1lczogMixcbiAgICBmcHM6IGZwcyxcbiAgICBpZGxlRnBzOiA0LFxuICAgIGxhc3RGcmFtZVRpbWU6IDAsXG4gICAgcm93OiAwLFxuICAgIHN0YXRlOiAnSURMRScsXG4gICAgbGFzdFN0YXRlOiAnSURMRSdcbn0pO1xuXG5leHBvcnQgY29uc3QgUGxheWVyQ29tcG9uZW50ID0gKGlkLCBjaGFyVHlwZSwgaXNMb2NhbCA9IGZhbHNlKSA9PiAoe1xuICAgIGlkOiBpZCxcbiAgICBjaGFyVHlwZTogY2hhclR5cGUsXG4gICAgaXNMb2NhbDogaXNMb2NhbFxufSk7XG5cbmV4cG9ydCBjb25zdCBCb21iQ29tcG9uZW50ID0gKG93bmVySWQsIHRpbWVyID0gMjAwMCwgcmFuZ2UgPSA0KSA9PiAoe1xuICAgIG93bmVySWQ6IG93bmVySWQsXG4gICAgdGltZXI6IHRpbWVyLFxuICAgIHJhbmdlOiByYW5nZSxcbiAgICBleHBsb2RlZDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgRXhwbG9zaW9uQ29tcG9uZW50ID0gKGR1cmF0aW9uID0gNTAwKSA9PiAoe1xuICAgIGR1cmF0aW9uOiBkdXJhdGlvblxufSk7XG5cbmV4cG9ydCBjb25zdCBQb3dlclVwQ29tcG9uZW50ID0gKHR5cGUpID0+ICh7XG4gICAgdHlwZTogdHlwZSwgXG4gICAgcGlja2VkVXA6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEJlaGF2aW9yQ29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBnaG9zdE1vZGU6IGZhbHNlLFxuICAgIHRocm93YWJsZTogZmFsc2UsXG4gICAgZGV0b25hdG9yOiBmYWxzZSxcbiAgICBmYXN0U2hvZXNMZXZlbDogMSxcbiAgICBib21iczoge1xuICAgICAgICBtYXg6IDEsXG4gICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgIHJhbmdlOiAyXG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQuanMnO1xuaW1wb3J0IHtcbiAgICBQb3NpdGlvbkNvbXBvbmVudCxcbiAgICBWZWxvY2l0eUNvbXBvbmVudCxcbiAgICBJbnB1dENvbXBvbmVudCxcbiAgICBSZW5kZXJhYmxlQ29tcG9uZW50LFxuICAgIFBsYXllckNvbXBvbmVudCxcbiAgICBCb21iQ29tcG9uZW50XG59IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5pbXBvcnQgeyBtb3ZlbWVudFN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9tb3ZlbWVudFN5c3RlbS5qcyc7XG5pbXBvcnQgeyByZW5kZXJTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvcmVuZGVyU3lzdGVtLmpzJztcbmltcG9ydCB7IGJvbWJTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyc7XG5pbXBvcnQgeyBkYW1hZ2VTeXN0ZW0sIGNoZWNrR2FtZUVuZENvbmRpdGlvbnMsIHNwYXduSGVhcnRQb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyc7XG5pbXBvcnQgTWVudSBmcm9tICcuLi9wYWdlcy9tZW51LmpzeCc7XG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tICcuLi8uLi9taW5pLWZyYW1ld29yay9kb20uanMnO1xuXG5pbXBvcnQgeyBwb3dlclVwU3lzdGVtLCBzcGF3blBvd2VyVXAgfSBmcm9tICcuL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyc7XG5pbXBvcnQgeyBzZXRCb21icywgc2V0TGl2ZXMsIHNldFJhbmdlLCBzZXRTcGVlZCB9IGZyb20gJy4uL3BhZ2VzL2dhbWUnO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEFOSU1BVElPTl9ST1dTID0ge1xuICAgIFJVTjogeyB1cDogMzgsIGxlZnQ6IDM5LCBkb3duOiA0MCwgcmlnaHQ6IDQxIH0sXG4gICAgSURMRTogeyB1cDogMjIsIGxlZnQ6IDIzLCBkb3duOiAyNCwgcmlnaHQ6IDI1IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBHYW1lRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNDb250YWluZXIsIG1hcERhdGEsIHNvY2tldCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNhbnZhc0NvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gbWFwRGF0YTtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcbiAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IG51bGw7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucGxheWVySW5mbyA9IG5ldyBNYXAoKTsgLy8gU3RvcmUgb3JpZ2luYWwgcGxheWVyIGRhdGEgbGlrZSBuaWNrbmFtZVxuICAgICAgICB0aGlzLmxhc3RUaW1lID0gMDtcbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIC8vIFN0YXRlIGZsYWcgdG8gcHJldmVudCBtdWx0aXBsZSBsb3NzIG1vZGFsIHJlbmRlcnMgKFRoZSBMb29wIFRyYXAgZml4KVxuICAgICAgICB0aGlzLmxvc3NNb2RhbFRyaWdnZXJlZCA9IGZhbHNlO1xuICAgICAgICAvLyBGbGFnIHRvIHRyYWNrIGlmIGlucHV0IHNob3VsZCBiZSBkaXNhYmxlZFxuICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIC8vIEZsYWcgdG8gc3RvcCB0aGUgZ2FtZSBsb29wIG9uY2UgYSB3aW5uZXIgaXMgZGVjaWRlZFxuICAgICAgICB0aGlzLmdhbWVFbmRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXQobG9jYWxQbGF5ZXJJZCwgYWxsUGxheWVycykge1xuICAgICAgICB0aGlzLnRvdGFsUGxheWVycyA9IGFsbFBsYXllcnMubGVuZ3RoO1xuICAgICAgICBjb25zdCBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCA9IFN0cmluZyhsb2NhbFBsYXllcklkKTtcblxuICAgICAgICBhbGxQbGF5ZXJzLmZvckVhY2gocERhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVySWQgPSBTdHJpbmcocERhdGEuaWQpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVySW5mby5zZXQocGxheWVySWQsIHBEYXRhKTsgLy8gU3RvcmUgb3JpZ2luYWwgcGxheWVyIGRhdGFcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBwRGF0YS5jb2xvciB8fCBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgIHBsYXllckRpdi5jbGFzc05hbWUgPSBgcGxheWVyIHBsYXllci0ke2NvbG9yfWA7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnpJbmRleCA9ICcxMCc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUud2lsbENoYW5nZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyRGl2KTtcblxuICAgICAgICAgICAgY29uc3Qgc3ggPSBwRGF0YS54IHx8IDE7XG4gICAgICAgICAgICBjb25zdCBzeSA9IHBEYXRhLnkgfHwgMTtcblxuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nLCBQb3NpdGlvbkNvbXBvbmVudChzeCwgc3ksIFRJTEVfU0laRSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknLCBWZWxvY2l0eUNvbXBvbmVudCgyLjUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnLCBSZW5kZXJhYmxlQ29tcG9uZW50KHBsYXllckRpdiwgNjQsIDY0LCA0LCAxMilcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzTG9jYWwgPSBwbGF5ZXJJZCA9PT0gbm9ybWFsaXplZExvY2FsUGxheWVySWQ7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJDb21wID0gUGxheWVyQ29tcG9uZW50KHBsYXllcklkLCBjb2xvciwgaXNMb2NhbCk7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmxpdmVzID0gMztcbiAgICAgICAgICAgIHBsYXllckNvbXAubWF4Qm9tYnMgPSAxO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5ib21iUmFuZ2UgPSA0O1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJywgcGxheWVyQ29tcCk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzLnNldChwbGF5ZXJJZCwgcGxheWVyRW50aXR5KTtcblxuICAgICAgICAgICAgaWYgKGlzTG9jYWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsUGxheWVyRW50aXR5ID0gcGxheWVyRW50aXR5O1xuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ0lucHV0JywgSW5wdXRDb21wb25lbnQoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyhwbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW0dhbWVFbmdpbmVdIExvY2FsIHBsYXllciB3YXMgbm90IGZvdW5kXCIsIHtcbiAgICAgICAgICAgICAgICBsb2NhbFBsYXllcklkLFxuICAgICAgICAgICAgICAgIHBsYXllcnM6IGFsbFBsYXllcnMubWFwKHBsYXllciA9PiBwbGF5ZXIuaWQpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlZ2lzdGVyU3lzdGVtcygpO1xuXG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobm93KSA9PiB0aGlzLmdhbWVMb29wKG5vdykpO1xuICAgIH1cblxuICAgIHNldHVwSW5wdXQoKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgIGlmICghaW5wdXQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBnZXRLZXlEaXJlY3Rpb24gPSAoa2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dVcCcgfHwga2V5ID09PSAndycgfHwga2V5ID09PSAnWicgfHwga2V5ID09PSAneicpIHJldHVybiAndXAnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93RG93bicgfHwga2V5ID09PSAncycgfHwga2V5ID09PSAnUycpIHJldHVybiAnZG93bic7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dMZWZ0JyB8fCBrZXkgPT09ICdhJyB8fCBrZXkgPT09ICdRJyB8fCBrZXkgPT09ICdxJykgcmV0dXJuICdsZWZ0JztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1JpZ2h0JyB8fCBrZXkgPT09ICdkJyB8fCBrZXkgPT09ICdEJykgcmV0dXJuICdyaWdodCc7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYW5kbGVLZXlEb3duID0gKGUpID0+IHtcbiAgICAgICAgICAgIC8vIElOUFVUIERJU0FCTEVEOiBJbW1lZGlhdGVseSBpZ25vcmUgYWxsIGtleWJvYXJkIGlucHV0cyB3aGVuIHBsYXllciBpcyBkZWFkXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5wdXRFbmFibGVkKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICghaW5wdXQuaW5wdXRRdWV1ZS5pbmNsdWRlcyhkaXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUudW5zaGlmdChkaXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnICcgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcEJvbWIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYW5kbGVLZXlVcCA9IChlKSA9PiB7XG4gICAgICAgICAgICAvLyBJTlBVVCBESVNBQkxFRDogSW1tZWRpYXRlbHkgaWdub3JlIGFsbCBrZXlib2FyZCBpbnB1dHMgd2hlbiBwbGF5ZXIgaXMgZGVhZFxuICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0RW5hYmxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUgPSBpbnB1dC5pbnB1dFF1ZXVlLmZpbHRlcihkID0+IGQgIT09IGRpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGRyb3BCb21iKCkge1xuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudEJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLmZpbHRlcihiRW50aXR5ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndvcmxkLmdldENvbXBvbmVudChiRW50aXR5LCAnQm9tYicpLm93bmVySWQgPT09IHBsYXllci5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRCb21icy5sZW5ndGggPj0gcGxheWVyLm1heEJvbWJzKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuY3JlYXRlQm9tYihwbGF5ZXIuaWQsIHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBwbGF5ZXIuYm9tYlJhbmdlKTtcbiAgICAgICAgaWYgKCFjcmVhdGVkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZHJvcF9ib21iJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGlkOiBwbGF5ZXIuaWQsIHg6IHBvcy5ncmlkWCwgeTogcG9zLmdyaWRZLCByYW5nZTogcGxheWVyLmJvbWJSYW5nZSB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVCb21iKG93bmVySWQsIGdyaWRYLCBncmlkWSwgcmFuZ2UpIHtcbiAgICAgICAgY29uc3QgZXhpc3RzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLnNvbWUoZW50aXR5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBib21iID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQm9tYicpO1xuICAgICAgICAgICAgcmV0dXJuIGJvbWIub3duZXJJZCA9PT0gb3duZXJJZCAmJiBwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChleGlzdHMpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBib21iRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgY29uc3QgYm9tYkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBib21iRGl2LmNsYXNzTmFtZSA9ICdib21iJztcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUubGVmdCA9IGAke2dyaWRYICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUuekluZGV4ID0gJzYnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChib21iRGl2KTtcblxuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYLCBncmlkWSB9KTtcblxuICAgICAgICBjb25zdCBib21iQ29tcCA9IEJvbWJDb21wb25lbnQob3duZXJJZCwgMjAwMCwgcmFuZ2UpO1xuICAgICAgICBib21iQ29tcC5lbCA9IGJvbWJEaXY7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJywgYm9tYkNvbXApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVNb3ZlKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbaGFuZGxlUmVtb3RlTW92ZV0gSW52YWxpZCBwYXlsb2FkOlwiLCBwYXlsb2FkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIEVudGl0eSBub3QgZm91bmQgZm9yIHBsYXllciAke3BheWxvYWQuaWR9LiBBdmFpbGFibGUgcGxheWVyczpgLCBBcnJheS5mcm9tKHRoaXMucGxheWVyRW50aXRpZXMua2V5cygpKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwb3MgfHwgIXZlbCB8fCAhcmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gVXBkYXRpbmcgcGxheWVyICR7cGF5bG9hZC5pZH0gdG8gKCR7cGF5bG9hZC5ncmlkWH0sICR7cGF5bG9hZC5ncmlkWX0pYCk7XG4gICAgICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgICAgICBwb3MuZ3JpZFggPSBwYXlsb2FkLmdyaWRYO1xuICAgICAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgICAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwYXlsb2FkLnk7XG4gICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZUJvbWIocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDQpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgcGF5bG9hZC54ID09PSB1bmRlZmluZWQgfHwgcGF5bG9hZC55ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnJlbW92ZVBvd2VyVXBBdChwYXlsb2FkLngsIHBheWxvYWQueSk7XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHBheWxvYWQudHlwZSA9PT0gJ0hFQVJUJykge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAoIXBsYXllciB8fCBwYXlsb2FkLm5ld0xpdmVzID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gcGF5bG9hZC5uZXdMaXZlcztcblxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMoZW50aXR5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coYFtSZW1vdGUgUG93ZXJVcCBQaWNrdXBdIFBsYXllciAke3BheWxvYWQuaWR9IHBpY2tlZCB1cCBoZWFydC4gTmV3IGxpdmVzOiAke3BheWxvYWQubmV3TGl2ZXN9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5hcHBseVBvd2VyVXAoZW50aXR5LCBwYXlsb2FkLnR5cGUpO1xuICAgIH1cblxuICAgIHJlbW92ZVBvd2VyVXBBdChncmlkWCwgZ3JpZFkpIHtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMuYWRkKGAke2dyaWRYfSwke2dyaWRZfWApO1xuICAgICAgICBjb25zdCBwb3dlclVwcyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBvd2VyVXAgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXBvcyB8fCAhcG93ZXJVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwb3dlclVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChwb3dlclVwLmVsICYmIHBvd2VyVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwb3dlclVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG93ZXJVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlQb3dlclVwKGVudGl0eSwgdHlwZSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgdmVsb2NpdHkuc3BlZWQgPSBNYXRoLm1pbih2ZWxvY2l0eS5zcGVlZCArIDEsIDgpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgIC8vIEhFQVJUIHBvd2VyLXVwOiBpbmNyZW1lbnQgbGl2ZXMgKGNhcCBhdCAzKVxuICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5taW4oKHBsYXllci5saXZlcyB8fCAwKSArIDEsIDMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTeXN0ZW1zKCkge1xuICAgICAgICBjb25zdCB1cGRhdGVNYXBDZWxsID0gKHgsIHksIG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubWFwRGF0YVt5XSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm1hcERhdGFbeV1beF0gPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gKTtcbiAgICAgICAgICAgIGlmICghdGlsZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aWxlLmNsYXNzTmFtZSA9ICd0aWxlIHRpbGUtZmxvb3InO1xuICAgICAgICAgICAgdGlsZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiKSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZGVzdHJveUJveENhbGxiYWNrID0gKHgsIHkpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYWltZWRQb3dlclVwcy5oYXMoYCR7eH0sJHt5fWApKSByZXR1cm47XG4gICAgICAgICAgICBzcGF3blBvd2VyVXAodGhpcy53b3JsZCwgeCwgeSwgdGhpcy5jb250YWluZXIsIFRJTEVfU0laRSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25QbGF5ZXJIdXJ0ID0gKGVudGl0eSwgaWQsIHJlbWFpbmluZ0xpdmVzKSA9PiB7XG4gICAgICAgICAgICAvLyBDUklUSUNBTDogT25seSBzZW5kIHBsYXllcl9kaWVkIGlmIFRISVMgSVMgVEhFIExPQ0FMIFBMQVlFUi5cbiAgICAgICAgICAgIC8vIFRoZSBFQ1MgZGFtYWdlU3lzdGVtIHJ1bnMgb24gQUxMIGNsaWVudHMsIHNvIGV2ZXJ5IGNsaWVudCBkZXRlY3RzXG4gICAgICAgICAgICAvLyBldmVyeSBjb2xsaXNpb24uIFdlIG11c3QgZ3VhcmQgdGhlIFdlYlNvY2tldCBtZXNzYWdlIHRvIHByZXZlbnRcbiAgICAgICAgICAgIC8vIGluY29ycmVjdCBkZWF0aCByZXBvcnRzLlxuICAgICAgICAgICAgaWYgKHJlbWFpbmluZ0xpdmVzIDw9IDAgJiYgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5ICYmIHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwbGF5ZXJfZGllZCdcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEhVRCBvbmx5IGZvciB0aGUgbG9jYWwgcGxheWVyLlxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHNldExpdmVzKHJlbWFpbmluZ0xpdmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBvd2VyVXBQaWNrZWQgPSAoaWQsIHR5cGUsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHt4fSwke3l9YCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhpZCkpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IGVudGl0eSA/IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyQ29tcCAmJiBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0TGl2ZXMocGxheWVyQ29tcC5saXZlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyQ29tcCAmJiBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyh0aGlzLmxvY2FsUGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG93ZXJ1cF9waWNrZWQnLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih0eXBlID09PSAnSEVBUlQnID8geyBuZXdMaXZlczogcGxheWVyQ29tcCA/IHBsYXllckNvbXAubGl2ZXMgOiAwIH0gOiB7fSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLndvcmxkLmJyb2FkY2FzdE1vdmVtZW50ID0gKGVudGl0eSwgeCwgeSwgZ3JpZFgsIGdyaWRZLCBkaXJlY3Rpb24sIGlzTW92aW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIGlmICghcGxheWVyIHx8ICF0aGlzLnNvY2tldCB8fCB0aGlzLnNvY2tldC5yZWFkeVN0YXRlICE9PSBXZWJTb2NrZXQuT1BFTikgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbW92ZV9zdGF0ZScsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICAgICAgICBpZDogcGxheWVyLmlkLFxuICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICBncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgaXNNb3ZpbmcsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBpc01vdmluZyA/ICdSVU4nIDogJ0lETEUnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gbW92ZW1lbnRTeXN0ZW0odywgZHQsIG5vdywgdGhpcy5tYXBEYXRhLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGJvbWJTeXN0ZW0odywgZHQsIG5vdywgdGhpcy5tYXBEYXRhLCB1cGRhdGVNYXBDZWxsLCBkZXN0cm95Qm94Q2FsbGJhY2ssIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gZGFtYWdlU3lzdGVtKHRoaXMud29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCB0aGlzLmxvY2FsUGxheWVyRW50aXR5LCBUSUxFX1NJWkUsIHRoaXMuc29ja2V0KSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBwb3dlclVwU3lzdGVtKHcsIG9uUG93ZXJVcFBpY2tlZCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcmVuZGVyU3lzdGVtKHcsIGR0LCBub3csIEFOSU1BVElPTl9ST1dTKSk7XG4gICAgfVxuXG4gICAgZ2FtZUxvb3Aobm93KSB7XG4gICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZHQgPSBub3cgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gbm93O1xuICAgICAgICB0aGlzLndvcmxkLnVwZGF0ZShkdCwgbm93KTtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChuZXh0Tm93KSA9PiB0aGlzLmdhbWVMb29wKG5leHROb3cpKTtcbiAgICB9XG5cbiAgICBoYW5kbGVHYW1lT3Zlcih3aW5uZXJOYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmdhbWVFbmRlZCkgcmV0dXJuOyAvLyBQcmV2ZW50IG11bHRpcGxlIHRyaWdnZXJzXG4gICAgICAgIHRoaXMuZ2FtZUVuZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG5cbiAgICAgICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gJ21lbnUtcGFnZSc7XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICAgIDxNZW51XG4gICAgICAgICAgICAgICAgdGl0bGU9e2Akeyh3aW5uZXJOYW1lIHx8IFwiQSBQbGF5ZXJcIikudG9VcHBlckNhc2UoKX0gV09OIWB9XG4gICAgICAgICAgICAgICAgbWVzc2FnZT1cIlRoZSBsYXN0IHBsYXllciBzdGFuZGluZyB0YWtlcyB0aGUgY3Jvd24uXCJcbiAgICAgICAgICAgIC8+LFxuICAgICAgICAgICAgcm9vdFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBnYW1lIGVuZCBjb25kaXRpb25zIHdpdGggcHJvcGVyIHN0YXRlIGZsYWcgbWFuYWdlbWVudC5cbiAgICAgKiBQcmV2ZW50cyB0aGUgXCJMb29wIFRyYXBcIiAtIG1vZGFsIGlzIG9ubHkgcmVuZGVyZWQgT05DRSB3aGVuIGxpdmVzIHJlYWNoIDAuXG4gICAgICogQWxzbyBkaXNhYmxlcyBpbnB1dCBpbW1lZGlhdGVseSB3aGVuIHBsYXllciBkaWVzLlxuICAgICAqL1xuXG4gICAgcmVtb3ZlUmVtb3RlUGxheWVyKHBsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwbGF5ZXJJZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBpZiAocmVuZGVyYWJsZSAmJiByZW5kZXJhYmxlLmVsICYmIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHJlbmRlcmFibGUuZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMuZGVsZXRlKFN0cmluZyhwbGF5ZXJJZCkpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVIdWRTdGF0cyhlbnRpdHkpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgc2V0Qm9tYnMocGxheWVyLm1heEJvbWJzIHx8IDEpO1xuICAgICAgICBzZXRMaXZlcyhwbGF5ZXIubGl2ZXMgPz8gMyk7XG4gICAgICAgIHNldFJhbmdlKHBsYXllci5ib21iUmFuZ2UgfHwgNCk7XG4gICAgICAgIHNldFNwZWVkKE1hdGgucm91bmQodmVsb2NpdHkuc3BlZWQpKTtcbiAgICB9XG59XG5cbmxldCBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gXCJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFBsYXllck5hbWUobmFtZSkge1xuICAgIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBuYW1lO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIsIG5hbWUpO1xuICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5XCIsIG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGxheWVyTmFtZSgpIHtcbiAgICByZXR1cm4gY3VycmVudExvY2FsUGxheWVyTmFtZSB8fCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiKSB8fCBcIlBsYXllclwiO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGJvbWJTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IGJvbWJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IGJvbWJFbnRpdHkgb2YgYm9tYnMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBib21iID0gd29ybGQuZ2V0Q29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJyk7XG4gICAgICAgIFxuICAgICAgICBib21iLnRpbWVyIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGJvbWIudGltZXIgPD0gMCAmJiAhYm9tYi5leHBsb2RlZCkge1xuICAgICAgICAgICAgYm9tYi5leHBsb2RlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGFmZmVjdGVkQ2VsbHMgPSBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgYm9tYi5yYW5nZSwgbWFwRGF0YSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFmZmVjdGVkQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBleHBEaXYuY2xhc3NOYW1lID0gJ2V4cGxvc2lvbic7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUubGVmdCA9IGAke2NlbGwueCAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUudG9wID0gYCR7Y2VsbC55ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS56SW5kZXggPSAnNyc7XG5cbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nLCB7IFxuICAgICAgICAgICAgICAgICAgICBncmlkWDogY2VsbC54LCBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFk6IGNlbGwueSwgXG4gICAgICAgICAgICAgICAgICAgIHg6IGNlbGwueCAqIHRpbGVTaXplLCBcbiAgICAgICAgICAgICAgICAgICAgeTogY2VsbC55ICogdGlsZVNpemUgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicsIHsgZHVyYXRpb246IDUwMCwgZWw6IGV4cERpdiB9KTtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZXhwRGl2KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAobWFwRGF0YVtjZWxsLnldICYmIG1hcERhdGFbY2VsbC55XVtjZWxsLnhdID09PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZU1hcENlbGwoY2VsbC54LCBjZWxsLnksIDIpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc3Ryb3lCb3hDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveUJveENhbGxiYWNrKGNlbGwueCwgY2VsbC55KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYm9tYi5lbCAmJiBib21iLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYm9tYi5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KGJvbWJFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICBjb25zdCBleHAgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJyk7XG4gICAgICAgIGV4cC5kdXJhdGlvbiAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChleHAuZHVyYXRpb24gPD0gMCkge1xuICAgICAgICAgICAgaWYgKGV4cC5lbCAmJiBleHAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGV4cC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGV4cC5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KGV4cEVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKGJ4LCBieSwgcmFuZ2UsIG1hcERhdGEpIHtcbiAgICBjb25zdCBjZWxscyA9IFt7IHg6IGJ4LCB5OiBieSB9XTtcbiAgICBjb25zdCBkaXJlY3Rpb25zID0gW1xuICAgICAgICB7IHg6IDAsIHk6IC0xIH0sXG4gICAgICAgIHsgeDogMCwgeTogMSB9LFxuICAgICAgICB7IHg6IC0xLCB5OiAwIH0sXG4gICAgICAgIHsgeDogMSwgeTogMCB9XG4gICAgXTtcbiAgICBcbiAgICBjb25zdCBzdGVwcyA9IHJhbmdlIC0gMTsgXG4gICAgXG4gICAgZGlyZWN0aW9ucy5mb3JFYWNoKGRpciA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gYnggKyAoZGlyLnggKiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHR5ID0gYnkgKyAoZGlyLnkgKiBpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFtYXBEYXRhW3R5XSB8fCBtYXBEYXRhW3R5XVt0eF0gPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNlbGxUeXBlID0gbWFwRGF0YVt0eV1bdHhdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2VsbHMucHVzaCh7IHg6IHR4LCB5OiB0eSB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gY2VsbHM7XG59XG4iLCIvKipcbiAqIFNwYXducyBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgc3BlY2lmaWVkIGdyaWQgY29vcmRpbmF0ZXMuXG4gKiBUaGlzIGNyZWF0ZXMgYSBwcm9wZXIgRUNTIGVudGl0eSB3aXRoIFBvc2l0aW9uLCBQb3dlclVwLCBhbmQgUmVuZGVyYWJsZSBjb21wb25lbnRzLlxuICogXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gZ3JpZFggLSBHcmlkIFggY29vcmRpbmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGdyaWRZIC0gR3JpZCBZIGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBnYW1lIGNvbnRhaW5lciBlbGVtZW50XG4gKiBAcGFyYW0ge251bWJlcn0gdGlsZVNpemUgLSBUaGUgc2l6ZSBvZiBlYWNoIGdyaWQgdGlsZSAoZGVmYXVsdDogNjQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGF3bkhlYXJ0UG93ZXJVcCh3b3JsZCwgZ3JpZFgsIGdyaWRZLCBjb250YWluZXIsIHRpbGVTaXplID0gNjQpIHtcbiAgICAvLyBDcmVhdGUgYSBuZXcgZW50aXR5IGZvciB0aGUgaGVhcnQgcG93ZXItdXBcbiAgICBjb25zdCBoZWFydEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIFxuICAgIC8vIEFkZCBQb3NpdGlvbiBjb21wb25lbnRcbiAgICB3b3JsZC5hZGRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3NpdGlvbicsIHtcbiAgICAgICAgZ3JpZFg6IGdyaWRYLFxuICAgICAgICBncmlkWTogZ3JpZFksXG4gICAgICAgIHg6IGdyaWRYICogdGlsZVNpemUsXG4gICAgICAgIHk6IGdyaWRZICogdGlsZVNpemVcbiAgICB9KTtcbiAgICBcbiAgICAvLyBBZGQgUG93ZXJVcCBjb21wb25lbnQgd2l0aCB0eXBlICdIRUFSVCdcbiAgICB3b3JsZC5hZGRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3dlclVwJywge1xuICAgICAgICB0eXBlOiAnSEVBUlQnLFxuICAgICAgICBwaWNrZWRVcDogZmFsc2UsXG4gICAgICAgIGVsOiBudWxsICAvLyBXaWxsIGJlIHNldCBhZnRlciBjcmVhdGluZyB0aGUgRE9NIGVsZW1lbnRcbiAgICB9KTtcbiAgICBcbiAgICAvLyBDcmVhdGUgdGhlIERPTSBlbGVtZW50IGZvciByZW5kZXJpbmdcbiAgICBjb25zdCBoZWFydERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYXJ0RGl2LmNsYXNzTmFtZSA9ICdwb3dlcnVwIHBvd2VydXAtaGVhcnQnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBoZWFydERpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgaGVhcnREaXYuc3R5bGUuYWxpZ25JdGVtcyA9ICdjZW50ZXInO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuZm9udFNpemUgPSAnMzJweCc7XG4gICAgaGVhcnREaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIC8vIGhlYXJ0RGl2LnRleHRDb250ZW50ID0gJ+KdpO+4jyc7XG4gICAgXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhlYXJ0RGl2KTtcbiAgICBcbiAgICAvLyBVcGRhdGUgdGhlIFBvd2VyVXAgY29tcG9uZW50IHdpdGggdGhlIERPTSBlbGVtZW50IHJlZmVyZW5jZVxuICAgIGNvbnN0IHBvd2VyVXAgPSB3b3JsZC5nZXRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3dlclVwJyk7XG4gICAgaWYgKHBvd2VyVXApIHtcbiAgICAgICAgcG93ZXJVcC5lbCA9IGhlYXJ0RGl2O1xuICAgIH1cbiAgICBcbiAgICBjb25zb2xlLmxvZyhgW0hlYXJ0IERyb3BdIFNwYXduZWQgSEVBUlQgcG93ZXItdXAgYXQgKCR7Z3JpZFh9LCAke2dyaWRZfSlgKTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHBsYXllciBkZWF0aCB0cmFuc2l0aW9uIHdoZW4gbGl2ZXMgcmVhY2ggMC5cbiAqIFJlbW92ZXMgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGFuZCBzcGF3bnMgYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIGRlYXRoIGxvY2F0aW9uLlxuICpcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJFbnRpdHkgLSBUaGUgZW50aXR5IElEIG9mIHRoZSBkeWluZyBwbGF5ZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBnYW1lIGNvbnRhaW5lciBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplID0gNjQsIGNvbnRhaW5lciA9IG51bGwpIHtcbiAgICAvLyBHZXQgdGhlIHBsYXllcidzIGNvbXBvbmVudHNcbiAgICBjb25zdCBwb3NpdGlvbiA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcblxuICAgIGlmICghcG9zaXRpb24gfHwgIXJlbmRlcmFibGUgfHwgIXBsYXllcikgcmV0dXJuO1xuXG4gICAgLy8gU3RvcmUgdGhlIGdyaWQgY29vcmRpbmF0ZXMgd2hlcmUgdGhlIHBsYXllciBkaWVkXG4gICAgY29uc3QgZGVhdGhHcmlkWCA9IE1hdGguZmxvb3IoKHBvc2l0aW9uLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgIGNvbnN0IGRlYXRoR3JpZFkgPSBNYXRoLmZsb29yKChwb3NpdGlvbi55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcblxuICAgIC8vIENSSVRJQ0FMOiBSZW1vdmUgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGZyb20gdGhlIGRvY3VtZW50IEJFRk9SRSByZW1vdmluZyB0aGUgUmVuZGVyYWJsZSBjb21wb25lbnQuXG4gICAgLy8gVGhpcyBlbnN1cmVzIHRoZSBkZWFkIHBsYXllciB2aXN1YWxseSBkaXNhcHBlYXJzIGltbWVkaWF0ZWx5LlxuICAgIGlmIChyZW5kZXJhYmxlLmVsICYmIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocmVuZGVyYWJsZS5lbCk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGNvbXBvbmVudHMgdGhhdCBlbmFibGUgaW50ZXJhY3Rpb24gYW5kIHJlbmRlcmluZy5cbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgIC8vIFdlIGtlZXAgUG9zaXRpb24gYW5kIFBsYXllciBjb21wb25lbnRzIHRvIGtub3cgd2hlcmUgdGhleSB3ZXJlLlxuXG4gICAgLy8gU3Bhd24gYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIGRlYXRoIGxvY2F0aW9uIChwcm9wZXIgRUNTIGVudGl0eSlcbiAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgIHNwYXduSGVhcnRQb3dlclVwKHdvcmxkLCBkZWF0aEdyaWRYLCBkZWF0aEdyaWRZLCBnYW1lQ29udGFpbmVyLCB0aWxlU2l6ZSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYFtQbGF5ZXIgRGVhdGhdIFBsYXllciAke3BsYXllci5pZH0gZGllZCBhdCAoJHtkZWF0aEdyaWRYfSwgJHtkZWF0aEdyaWRZfSkuIEhlYXJ0IHBvd2VyLXVwIGRyb3BwZWQuYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYW1hZ2VTeXN0ZW0od29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCBsb2NhbFBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgc29ja2V0KSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQbGF5ZXInKTtcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHBsYXllci5pbnZpbmNpYmxlVW50aWwgJiYgcGxheWVyLmludmluY2libGVVbnRpbCA+IG5vdykgY29udGludWU7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgICAgICBjb25zdCBlUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdyaWQtYmFzZWQgY29sbGlzaW9uXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWCA9IE1hdGguZmxvb3IoKHBQb3MueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWSA9IE1hdGguZmxvb3IoKHBQb3MueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChwbGF5ZXJHcmlkWCA9PT0gZVBvcy5ncmlkWCAmJiBwbGF5ZXJHcmlkWSA9PT0gZVBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzTGl2ZXMgPSBwbGF5ZXIubGl2ZXMgPz8gMztcbiAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSBNYXRoLm1heChwcmV2aW91c0xpdmVzIC0gMSwgMCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLmludmluY2libGVVbnRpbCA9IG5vdyArIDE1MDA7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gVmlzdWFsIGJsaW5rIGVmZmVjdFxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXJhYmxlICYmIHJlbmRlcmFibGUuZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyYWJsZS5lbC5jbGFzc0xpc3QuYWRkKCdkYW1hZ2VkLWJsaW5rJyk7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmUtZmV0Y2ggcmVuZGVyYWJsZSBpbiBjYXNlIGl0IHdhcyByZW1vdmVkIChlLmcuIGRlYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlcmFibGUuZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJhYmxlLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2RhbWFnZWQtYmxpbmsnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHBsYXllciBpcyBkZWFkLCByZXBvcnQgZGVhdGggT05DRSB1c2luZyBndWFyZCBjbGF1c2VcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmxpdmVzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBsYXllci5hbHJlYWR5UmVwb3J0ZWREZWFkKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmFscmVhZHlSZXBvcnRlZERlYWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUGxheWVySHVydChwbGF5ZXJFbnRpdHksIHBsYXllci5pZCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBsYXllciBzdGlsbCBhbGl2ZSwgcmVwb3J0IG5vcm1hbCBkYW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uUGxheWVySHVydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCBwbGF5ZXIubGl2ZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEJyZWFrIHRoZSBsb29wIHNpbmNlIHRoZSBwbGF5ZXIgaGFzIGFscmVhZHkgdGFrZW4gZGFtYWdlIGZyb20gdGhpcyBleHBsb3Npb24uXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGZ1bmN0aW9uIG1vdmVtZW50U3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB0aWxlU2l6ZSA9IDQwKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknKTtcbiAgICBjb25zdCBkZWx0YSA9IGR0IC8gMTYuNjc7XG5cbiAgICBjb25zdCBQTEFZRVJfU0laRSA9IHRpbGVTaXplO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBpbnB1dCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBjb25zdCBiZWhhdmlvciA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCZWhhdmlvcicpO1xuXG4gICAgICAgIGlmIChiZWhhdmlvcikge1xuICAgICAgICAgICAgdmVsLnNwZWVkID0gdmVsLmJhc2VTcGVlZCArIChiZWhhdmlvci5mYXN0U2hvZXNMZXZlbCAtIDEpICogMC41O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmVsLnNwZWVkID0gdmVsLmJhc2VTcGVlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWN0aXZlSW5wdXQgPSBpbnB1dC5pbnB1dFF1ZXVlWzBdO1xuICAgICAgICBsZXQgZHggPSAwO1xuICAgICAgICBsZXQgZHkgPSAwO1xuXG4gICAgICAgIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3VwJykge1xuICAgICAgICAgICAgZHkgPSAtMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAndXAnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnZG93bicpIHtcbiAgICAgICAgICAgIGR5ID0gMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAnZG93bic7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgZHggPSAtMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAnbGVmdCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgIGR4ID0gMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAncmlnaHQnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGFzSW5wdXQgPSBkeCAhPT0gMCB8fCBkeSAhPT0gMDtcblxuICAgICAgICBpZiAoIWhhc0lucHV0KSB7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICAgICAgcG9zLnRhcmdldFkgPSBwb3MueTtcbiAgICAgICAgICAgIHZlbC5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSAnSURMRSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBvcy5ncmlkWCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBwb3MuZ3JpZFkgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdmVsLmlzTW92aW5nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFggPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGNvbnN0IHNuYXBUaHJlc2hvbGQgPSAzMjtcblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgZHggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChpc0Jsb2NrZWQocG9zLngsIG5leHRZLCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbGVYID0gTWF0aC5mbG9vcigocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFggPSBjdXJyZW50VGlsZVggKiB0aWxlU2l6ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmWCA9IHBvcy54IC0gdGFyZ2V0WDtcblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaWZmWCkgPCBzbmFwVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAtTWF0aC5zaWduKGRpZmZYKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgZHkgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChpc0Jsb2NrZWQobmV4dFgsIHBvcy55LCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbGVZID0gTWF0aC5mbG9vcigocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFkgPSBjdXJyZW50VGlsZVkgKiB0aWxlU2l6ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmWSA9IHBvcy55IC0gdGFyZ2V0WTtcblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaWZmWSkgPCBzbmFwVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAtTWF0aC5zaWduKGRpZmZZKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WEFmdGVyU25hcCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFlBZnRlclNuYXAgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmICFpc0Jsb2NrZWQobmV4dFhBZnRlclNuYXAsIHBvcy55LCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICBwb3MueCA9IG5leHRYQWZ0ZXJTbmFwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmICFpc0Jsb2NrZWQocG9zLngsIG5leHRZQWZ0ZXJTbmFwLCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICBwb3MueSA9IG5leHRZQWZ0ZXJTbmFwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmVsLmlzTW92aW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSAnUlVOJztcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcy5ncmlkWCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MuZ3JpZFkgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwb3MueTtcblxuICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgIGVudGl0eSxcbiAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFgsXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgdmVsLmlzTW92aW5nXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSkge1xuICAgIGNvbnN0IHN0ZXAgPSB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgIGlmIChwb3MueCA8IHBvcy50YXJnZXRYKSB7XG4gICAgICAgIHBvcy54ID0gTWF0aC5taW4ocG9zLnggKyBzdGVwLCBwb3MudGFyZ2V0WCk7XG4gICAgfSBlbHNlIGlmIChwb3MueCA+IHBvcy50YXJnZXRYKSB7XG4gICAgICAgIHBvcy54ID0gTWF0aC5tYXgocG9zLnggLSBzdGVwLCBwb3MudGFyZ2V0WCk7XG4gICAgfVxuXG4gICAgaWYgKHBvcy55IDwgcG9zLnRhcmdldFkpIHtcbiAgICAgICAgcG9zLnkgPSBNYXRoLm1pbihwb3MueSArIHN0ZXAsIHBvcy50YXJnZXRZKTtcbiAgICB9IGVsc2UgaWYgKHBvcy55ID4gcG9zLnRhcmdldFkpIHtcbiAgICAgICAgcG9zLnkgPSBNYXRoLm1heChwb3MueSAtIHN0ZXAsIHBvcy50YXJnZXRZKTtcbiAgICB9XG5cbiAgICB2ZWwuaXNNb3ZpbmcgPVxuICAgICAgICBwb3MueCAhPT0gcG9zLnRhcmdldFggfHxcbiAgICAgICAgcG9zLnkgIT09IHBvcy50YXJnZXRZO1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrZWQoeCwgeSwgbWFwRGF0YSwgdGlsZVNpemUsIHBsYXllclNpemUgPSB0aWxlU2l6ZSkge1xuICAgIGNvbnN0IHBhZGRpbmcgPSA0O1xuXG4gICAgY29uc3QgbGVmdCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh4ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCByaWdodCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh4ICsgcGxheWVyU2l6ZSAtIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgdG9wID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IGJvdHRvbSA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGxheWVyU2l6ZSAtIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChsZWZ0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwocmlnaHQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChsZWZ0LCBib3R0b20sIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwocmlnaHQsIGJvdHRvbSwgbWFwRGF0YSlcbiAgICApO1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrZWRDZWxsKHgsIHksIG1hcERhdGEpIHtcbiAgICBjb25zdCBjZWxsID0gbWFwRGF0YVt5XSAmJiBtYXBEYXRhW3ldW3hdO1xuXG4gICAgcmV0dXJuIGNlbGwgIT09IDAgJiYgY2VsbCAhPT0gMjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBwb3dlclVwU3lzdGVtKHdvcmxkLCBvblBvd2VyVXBQaWNrZWQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1BsYXllcicpO1xuICAgIGNvbnN0IHBvd2VyVXBzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBQb3MgfHwgIXZlbCB8fCAhcGxheWVyKSBjb250aW51ZTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBVcEVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgdXBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocFVwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBVcCA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXVwUG9zIHx8ICFwVXAgfHwgcFVwLnBpY2tlZFVwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgLy8gR3JpZC1iYXNlZCBjb2xsaXNpb246IHBsYXllciBncmlkIHBvc2l0aW9uIG1hdGNoZXMgcG93ZXItdXAgZ3JpZCBwb3NpdGlvblxuICAgICAgICAgICAgaWYgKHBQb3MuZ3JpZFggPT09IHVwUG9zLmdyaWRYICYmIHBQb3MuZ3JpZFkgPT09IHVwUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcFVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBkaWZmZXJlbnQgcG93ZXItdXAgdHlwZXNcbiAgICAgICAgICAgICAgICBpZiAocFVwLnR5cGUgPT09ICdTUEVFRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmVsLnNwZWVkID0gTWF0aC5taW4odmVsLnNwZWVkICsgMSwgOCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0ZMQU1FJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBwb3dlci11cCdzIERPTSBlbGVtZW50IGZyb20gdGhlIHNjcmVlblxuICAgICAgICAgICAgICAgIGlmIChwVXAuZWwgJiYgcFVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcFVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocFVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBOb3RpZnkgZ2FtZS5qcyB2aWEgY2FsbGJhY2sgKGhhbmRsZXMgSFVEIHVwZGF0ZSArIHNlcnZlciBzeW5jKVxuICAgICAgICAgICAgICAgIC8vIENSSVRJQ0FMOiBUaGlzIHRyaWdnZXJzIHVwZGF0ZUh1ZFN0YXRzLCBOT1Qgb25QbGF5ZXJIdXJ0XG4gICAgICAgICAgICAgICAgaWYgKG9uUG93ZXJVcFBpY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICBvblBvd2VyVXBQaWNrZWQocGxheWVyLmlkLCBwVXAudHlwZSwgdXBQb3MuZ3JpZFgsIHVwUG9zLmdyaWRZKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBEZXN0cm95IHRoZSBwb3dlci11cCBlbnRpdHkgZnJvbSB0aGUgd29ybGQgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KHBVcEVudGl0eSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtIRUFSVCBERVNUUk9ZRURdIEhlYXJ0IGVudGl0eSByZW1vdmVkIGZyb20gd29ybGQgYXQgKCR7dXBQb3MuZ3JpZFh9LCAke3VwUG9zLmdyaWRZfSlgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwYXduUG93ZXJVcCh3b3JsZCwgZ3gsIGd5LCBjb250YWluZXIsIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBzZWVkID0gZ3ggKiA3Mzg1NjA5MyBeIGd5ICogMTkzNDk2NjM7XG4gICAgY29uc3Qgc2VlZFJhbmRvbSA9IChNYXRoLnNpbihzZWVkKSAqIDEwMDAwKSAtIE1hdGguZmxvb3IoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCk7XG4gICAgXG4gICAgaWYgKHNlZWRSYW5kb20gPiAwLjM1KSByZXR1cm47XG5cbiAgICBjb25zdCB0eXBlcyA9IFsnU1BFRUQnLCAnQk9NQlMnLCAnRkxBTUUnXTtcbiAgICBjb25zdCB0eXBlSW5kZXggPSBNYXRoLmZsb29yKChNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCAtIE1hdGguZmxvb3IoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDApKSAqIHR5cGVzLmxlbmd0aCk7XG4gICAgY29uc3QgcmFuZG9tVHlwZSA9IHR5cGVzW3R5cGVJbmRleF07XG5cbiAgICBjb25zdCBwVXBFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYOiBneCwgZ3JpZFk6IGd5LCB4OiBneCAqIHRpbGVTaXplLCB5OiBneSAqIHRpbGVTaXplIH0pO1xuICAgIFxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSBgcG93ZXJ1cCBwb3dlcnVwLSR7cmFuZG9tVHlwZS50b0xvd2VyQ2FzZSgpfWA7XG4gICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBkaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUubGVmdCA9IGAke2d4ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS50b3AgPSBgJHtneSAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnLCB7IHR5cGU6IHJhbmRvbVR5cGUsIGVsOiBkaXYgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcmVuZGVyU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBhbmltUm93cykge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1JlbmRlcmFibGUnKTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG5cbiAgICAgICAgaWYgKCFyZW5kZXJhYmxlLmVsKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHJlbmRlcmFibGUuc3RhdGU7XG4gICAgICAgIGNvbnN0IHRhcmdldFJvdyA9IGFuaW1Sb3dzW3N0YXRlXVt2ZWwuZGlyZWN0aW9uXTtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlc2V0IGFuaW1hdGlvbiB3aGVuIHJvdyBvciBzdGF0ZSBjaGFuZ2VzXG4gICAgICAgIGlmIChyZW5kZXJhYmxlLnJvdyAhPT0gdGFyZ2V0Um93IHx8IHJlbmRlcmFibGUubGFzdFN0YXRlICE9PSBzdGF0ZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5yb3cgPSB0YXJnZXRSb3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RTdGF0ZSA9IHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZnJhbWVDb3VudCA9IHN0YXRlID09PSAnUlVOJyA/IHJlbmRlcmFibGUucnVuRnJhbWVzIDogcmVuZGVyYWJsZS5pZGxlRnJhbWVzO1xuICAgICAgICBjb25zdCBmcmFtZURlbGF5ID0gc3RhdGUgPT09ICdSVU4nID8gMTAwMCAvIHJlbmRlcmFibGUuZnBzIDogMTAwMCAvIHJlbmRlcmFibGUuaWRsZUZwcztcblxuICAgICAgICBpZiAobm93IC0gcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID4gZnJhbWVEZWxheSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKyAxKSAlIGZyYW1lQ291bnQ7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3NYID0gLShyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSAqIHJlbmRlcmFibGUuZnJhbWVXaWR0aCk7XG4gICAgICAgIGNvbnN0IHBvc1kgPSAtKHJlbmRlcmFibGUucm93ICogcmVuZGVyYWJsZS5mcmFtZUhlaWdodCk7XG4gICAgICAgIFxuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGAke3Bvc1h9cHggJHtwb3NZfXB4YDtcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtwb3MueH1weCwgJHtwb3MueX1weCwgMClgO1xuICAgIH1cbn1cbiIsIi8vIC9zcmMvZWNzL3dvcmxkLmpzXG5cbmV4cG9ydCBjbGFzcyBXb3JsZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubmV4dEVudGl0eUlkID0gMDtcbiAgICAgICAgdGhpcy5lbnRpdGllcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gbmV3IE1hcCgpOyBcbiAgICAgICAgdGhpcy5zeXN0ZW1zID0gW107XG4gICAgfVxuXG4gICAgY3JlYXRlRW50aXR5KCkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLm5leHRFbnRpdHlJZCsrO1xuICAgICAgICB0aGlzLmVudGl0aWVzLmFkZChlbnRpdHkpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cblxuICAgIGRlc3Ryb3lFbnRpdHkoZW50aXR5KSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIGZvciAoY29uc3QgW2NvbXBvbmVudE5hbWUsIGNvbXBvbmVudE1hcF0gb2YgdGhpcy5jb21wb25lbnRzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSwgY29tcG9uZW50RGF0YSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5jb21wb25lbnRzLmhhcyhjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnNldChjb21wb25lbnROYW1lLCBuZXcgTWFwKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSkuc2V0KGVudGl0eSwgY29tcG9uZW50RGF0YSk7XG4gICAgfVxuXG4gICAgZ2V0Q29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50TWFwID8gY29tcG9uZW50TWFwLmdldChlbnRpdHkpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJlbW92ZUNvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudE1hcCkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcXVlcnkoLi4uY29tcG9uZW50TmFtZXMpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudE5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZmlyc3RNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzWzBdKTtcbiAgICAgICAgaWYgKCFmaXJzdE1hcCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBmaXJzdE1hcC5rZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBoYXNBbGwgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb21wb25lbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmICghbWFwIHx8ICFtYXAuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzQWxsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNBbGwgJiYgdGhpcy5lbnRpdGllcy5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZFN5c3RlbShzeXN0ZW1GdW5jdGlvbikge1xuICAgICAgICB0aGlzLnN5c3RlbXMucHVzaChzeXN0ZW1GdW5jdGlvbik7XG4gICAgfVxuXG4gICAgdXBkYXRlKGR0LCBub3cpIHtcbiAgICAgICAgZm9yIChjb25zdCBzeXN0ZW0gb2YgdGhpcy5zeXN0ZW1zKSB7XG4gICAgICAgICAgICBzeXN0ZW0odGhpcywgZHQsIG5vdyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBHUklEX0JPUkRFUl9TSVpFID0gNjtcbmNvbnN0IEdBTUVfQ0hST01FX1dJRFRIID0gNzI7XG5jb25zdCBHQU1FX0NIUk9NRV9IRUlHSFQgPSAxNTA7XG5cbmNvbnN0IGltYWdlcyA9IHtcbiAgICAyOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIixcbiAgICAzOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja193YWxsLnBuZ1wiLFxuICAgIDQ6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2V4cGxvaXQucG5nXCIsXG59O1xuXG5jb25zdCBbcGxheWVyTmFtZSwgc2V0UGxheWVyTmFtZV0gPSBjcmVhdGVTaWduYWwoXCJQbGF5ZXIgMVwiKTtcbmNvbnN0IFtsaXZlcywgc2V0TGl2ZXNdID0gY3JlYXRlU2lnbmFsKDMpO1xuY29uc3QgW3NwZWVkLCBzZXRTcGVlZF0gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbYm9tYnMsIHNldEJvbWJzXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtyYW5nZSwgc2V0UmFuZ2VdID0gY3JlYXRlU2lnbmFsKDEpO1xuZXhwb3J0IHsgc2V0UGxheWVyTmFtZSwgc2V0TGl2ZXMsIHNldFNwZWVkLCBzZXRCb21icywgc2V0UmFuZ2UgfTtcblxuY29uc3QgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IG5hbWVFbC50ZXh0Q29udGVudCA9IHBsYXllck5hbWUoKTsgfSk7XG5cbmNvbnN0IGxpdmVzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGxpdmVzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHNwZWVkRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHNwZWVkLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IGJvbWJzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGJvbWJzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHJhbmdlRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHJhbmdlLXZhbHVlXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbGl2ZXNFbC50ZXh0Q29udGVudCA9IGxpdmVzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgc3BlZWRFbC50ZXh0Q29udGVudCA9IHNwZWVkKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgYm9tYnNFbC50ZXh0Q29udGVudCA9IGJvbWJzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgcmFuZ2VFbC50ZXh0Q29udGVudCA9IHJhbmdlKCk7IH0pO1xuXG5mdW5jdGlvbiBHYW1lKHsgZ3JpZCB9KSB7XG4gICAgY29uc3QgYm9hcmRXaWR0aCA9IGdyaWRbMF0ubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gZ3JpZC5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRPdXRlcldpZHRoID0gYm9hcmRXaWR0aCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJIZWlnaHQgPSBib2FyZEhlaWdodCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRXaWR0aCA6IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGJvYXJkSGVpZ2h0IDogd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHNjYWxlID0gTWF0aC5taW4oXG4gICAgICAgIDEsXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0V2lkdGggLSBHQU1FX0NIUk9NRV9XSURUSCkgLyBib2FyZE91dGVyV2lkdGgpLFxuICAgICAgICBNYXRoLm1heCgwLjIsICh2aWV3cG9ydEhlaWdodCAtIEdBTUVfQ0hST01FX0hFSUdIVCkgLyBib2FyZE91dGVySGVpZ2h0KVxuICAgICk7XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBncmlkLmxlbmd0aDsgcm93SW5kZXgrKykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgZ3JpZFtyb3dJbmRleF0ubGVuZ3RoOyBjb2xJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZ3JpZFtyb3dJbmRleF1bY29sSW5kZXhdO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IFwidGlsZVwiO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gYHdpZHRoOiR7VElMRV9TSVpFfXB4O2hlaWdodDoke1RJTEVfU0laRX1weDtgO1xuXG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMiB8fCBjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtZmxvb3JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtd2FsbFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1szXX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzRdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDAgfHwgY2VsbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1syXX0pYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2VsbHMucHVzaCg8ZGl2IGNsYXNzPXtjbGFzc05hbWV9IGRhdGEteD17Y29sSW5kZXh9IGRhdGEteT17cm93SW5kZXh9IHN0eWxlPXtzdHlsZX0+PC9kaXY+KTtcbiAgICAgICAgfVxuICAgICAgICByb3dzLnB1c2goPGRpdiBjbGFzcz1cImdyaWQtcm93XCI+e2NlbGxzfTwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1nbGFzc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1iYXJcIj5cbiAgICAgICAgICAgICAgICAgICAge25hbWVFbH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLXN0YXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPuKdpO+4jzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bGl2ZXNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj7imqE8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwZWVkRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+8J+Sozwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Ym9tYnNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj7wn46vPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyYW5nZUVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWJvYXJkLWZyYW1lXCIgc3R5bGU9e2B3aWR0aDoke2JvYXJkT3V0ZXJXaWR0aCAqIHNjYWxlfXB4O2hlaWdodDoke2JvYXJkT3V0ZXJIZWlnaHQgKiBzY2FsZX1weDtgfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJnYW1lLWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImdhbWUtZ3JpZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17YHBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiR7Ym9hcmRXaWR0aH1weDtoZWlnaHQ6JHtib2FyZEhlaWdodH1weDt0cmFuc2Zvcm06c2NhbGUoJHtzY2FsZX0pO2B9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCBDaGF0UGxheWVycyBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmxldCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gY3JlYXRlU2lnbmFsKHt9KTtcbmV4cG9ydCB7IHNldFN0YXRlcyB9O1xuXG5sZXQgcm9vbUlkRWwgPSA8cD5Sb29tIElEOiA8L3A+O1xubGV0IHBsYXllcnNFbCA9IDxwPlBsYXllcnM6ICAvIDQ8L3A+O1xubGV0IHRleHRFbCA9IDxwPjwvcD47XG5sZXQgdGltZXJFbCA9IDxwPlRpbWVyOiA8L3A+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHMgPSBzdGF0ZXMoKTtcbiAgICByb29tSWRFbC50ZXh0Q29udGVudCA9IGBSb29tIElEOiAke3Mucm9vbUlkfWA7XG4gICAgcGxheWVyc0VsLnRleHRDb250ZW50ID0gYFBsYXllcnM6ICR7cy5wbGF5ZXJzQ291bnR9IC8gNGA7XG4gICAgdGV4dEVsLnRleHRDb250ZW50ID0gcy50ZXh0IHx8IFwiXCI7XG5cbiAgICBpZiAocy5nYW1lU3RhcnRlZCkge1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gXCJUaW1lcjogR2FtZSBzdGFydGVkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGltZXJUZXh0ID0gKCFzLnNlY29uZHNMZWZ0KSA/IFwiV2FpdGluZyBmb3Igb25lIG1vcmUgcGxheWVyXCIgOiBgJHtzLnNlY29uZHNMZWZ0fSBzZWNvbmRzYDtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IGBUaW1lcjogJHt0aW1lclRleHR9YDtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gTG9iYnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1sb2JieVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYmJ5LWJveFwiPlxuICAgICAgICAgICAgICAgIDxoMT5Mb2JieTwvaDE+XG4gICAgICAgICAgICAgICAge3Jvb21JZEVsfVxuICAgICAgICAgICAgICAgIHtwbGF5ZXJzRWx9XG4gICAgICAgICAgICAgICAge3RleHRFbH1cbiAgICAgICAgICAgICAgICB7dGltZXJFbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPENoYXRQbGF5ZXJzIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVudSh7XG4gICAgICAgIHRpdGxlID0gXCJZb3UgV2luIVwiLFxuICAgICAgICBtZXNzYWdlID0gXCJBbGwgb3RoZXIgcGxheWVycyBoYXZlIGxlZnQgdGhlIGdhbWUuXCIsXG4gICAgICAgIGJ1dHRvblRleHQgPSBcIlBsYXkgQWdhaW5cIixcbiAgICB9ID0ge30pIHtcbiAgICBjb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPntidXR0b25UZXh0fTwvYnV0dG9uPjtcblxuICAgIHJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL1wiO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgICAgICA8aDE+e3RpdGxlfTwvaDE+XG4gICAgICAgICAgICA8cD57bWVzc2FnZX08L3A+XG4gICAgICAgICAgICB7cmVwbGF5QnRufVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSBjcmVhdGVTaWduYWwoXCJcIik7XG5leHBvcnQgeyBzZXRFcnJvciB9O1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGVycm9yRWwgPSA8cCBjbGFzcz1cInJlZ2lzdGVyLWVycm9yXCI+PC9wPjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGVycm9yRWwudGV4dENvbnRlbnQgPSBlcnJvcigpO1xuICAgIH0pO1xuXG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgbmlja25hbWUgPSBmb3JtRGF0YS5nZXQoXCJuaWNrbmFtZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFuaWNrbmFtZSB8fCBuaWNrbmFtZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgc2V0RXJyb3IoXCJJbnZhbGlkIG5pY2tuYW1lXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0RXJyb3IoXCJcIik7XG4gICAgICAgIHN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHNldFBsYXllck5hbWUobmlja25hbWUpO1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwibmlja25hbWVfb2ZfdGhlX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAge2Vycm9yRWx9XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaWNrbmFtZS1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5pY2tuYW1lXCIgcGxhY2Vob2xkZXI9XCJlbnRlciB5b3VyIG5hbWVcIiBtYXhsZW5ndGg9XCIyMFwiIC8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmVnaXN0ZXItYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPnN0YXJ0IHBsYXlpbmc8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XG4iLCJjbGFzcyBTb3VuZCB7XG4gICAgY29uc3RydWN0b3Ioc3JjKSB7XG4gICAgICAgIHRoaXMubXVzaWMgPSBuZXcgQXVkaW8oc3JjKTtcbiAgICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcblxuICAgICAgICB0aGlzLm11c2ljLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNDtcblxuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc05hbWUgPSBcInNvdW5kLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5hcHBlbmQodGhpcy5pY29uKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGUoKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5idXR0b24pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5tdXNpYy5wbGF5KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5tdXNpYy5wYXVzZWQgfHwgdGhpcy5tdXNpYy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9uXCIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUJ1dHRvbigpIHtcbiAgICAgICAgY29uc3QgaXNNdXRlZCA9IHRoaXMubXVzaWMubXV0ZWQgfHwgdGhpcy5tdXNpYy5wYXVzZWQ7XG5cbiAgICAgICAgdGhpcy5pY29uLmNsYXNzTmFtZSA9IGlzTXV0ZWQgPyBcImZhLXNvbGlkIGZhLXZvbHVtZS1vZmZcIiA6IFwiZmEtc29saWQgZmEtdm9sdW1lLWhpZ2hcIjtcbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImlzLW11dGVkXCIsIGlzTXV0ZWQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291bmQ7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFN0YXRlcyB9IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSBhcyBzZXRIdWRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCB7IHNldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuaW1wb3J0IHsgc2V0RXJyb3IgfSBmcm9tIFwiLi4vcGFnZXMvcmVnaXN0ZXJcIjtcblxubGV0IGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVdlYnNvY2tldChtZXNzYWdlLCByb290LCB3c3MpIHtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICAvLyB0aGlzIGNhc2UgaXMgZm9yIHVwZGF0ZSB0aGUgbG9iYnlcbiAgICAgICAgY2FzZSBcInJvb21fdXBkYXRlXCI6XG4gICAgICAgIGNhc2UgXCJsb2JieV90aW1lclwiOlxuICAgICAgICAgICAgLy8gRml4OiBJZiB3ZSBhcmUgYWxyZWFkeSBpbiBhIGdhbWUsIGRvbid0IHN3aXRjaCBiYWNrIHRvIHRoZSBsb2JieSBzY3JlZW4gd2hlbiBzb21lb25lIHF1aXRzXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPT09IFwiZ2FtZS1wYWdlXCIpIHtcbiAgICAgICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IG1lc3NhZ2UucGxheWVyc0NvdW50LFxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogbWVzc2FnZS5zZWNvbmRzTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuXG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb250YWluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogbWVzc2FnZS5wbGF5ZXJzQ291bnQsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IG1lc3NhZ2Uuc2Vjb25kc0xlZnQsXG4gICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAvLyB0aGlzIGNhc2UgaXMgZm9yIHN0YXJ0IHRoZSBnYW1lXG4gICAgICAgIGNhc2UgXCJnYW1lX3N0YXJ0ZWRcIjpcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxHYW1lIGdyaWQ9e21lc3NhZ2UuZ3JpZH0gLz4sIHJvb3QpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvbnRhaW5lclwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSAobWVzc2FnZS5wbGF5ZXJzIHx8IFtdKS5maW5kKHBsYXllciA9PiBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UueW91clBsYXllcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIGxvY2FsUGxheWVyLm5pY2tuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIdWRQbGF5ZXJOYW1lKGxvY2FsUGxheWVyLm5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBHYW1lRW5naW5lKGdhbWVDb250YWluZXIsIG1lc3NhZ2UuZ3JpZCwgd3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lLmluaXQobWVzc2FnZS55b3VyUGxheWVySWQsIG1lc3NhZ2UucGxheWVycyB8fCBbXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBlbmdpbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdhbWUgY29udGFpbmVyIHdhcyBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLy8gdGhpcyBjYXNlIGlzIGZvciByZXR1cm4gdG8gbWVudSB3aGVuIHJvb20gaXMgYWxvbmVcbiAgICAgICAgY2FzZSBcInJvb21fYWxvbmVcIjpcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8vIHRoaXMgY2FzZSBpcyBmb3IgZ2FtZSByZXN1bHRzICh3aW4sIGxvc3QsIGRyYXcpXG4gICAgICAgIGNhc2UgXCJnYW1lX292ZXJcIjpcbiAgICAgICAgY2FzZSBcImdhbWVfd29uXCI6IC8vIEtlZXAgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgaWYgbmVlZGVkXG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuXG4gICAgICAgICAgICBsZXQgdGl0bGUgPSBcIkdBTUUgT1ZFUlwiO1xuICAgICAgICAgICAgbGV0IG1lc3NhZ2VUZXh0ID0gXCJUaGUgZ2FtZSBoYXMgZW5kZWQuXCI7XG4gICAgICAgICAgICBsZXQgYnRuVGV4dCA9IFwiUGxheSBBZ2FpblwiO1xuXG4gICAgICAgICAgICBpZiAobWVzc2FnZS5yZXN1bHQgPT09IFwid29uXCIpIHtcbiAgICAgICAgICAgICAgICB0aXRsZSA9IGAkeyhtZXNzYWdlLndpbm5lck5hbWUgfHwgXCJZT1VcIikudG9VcHBlckNhc2UoKX0gV09OIWA7XG4gICAgICAgICAgICAgICAgbWVzc2FnZVRleHQgPSBcIlRoZSBsYXN0IHBsYXllciBzdGFuZGluZyB0YWtlcyB0aGUgY3Jvd24uXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UucmVzdWx0ID09PSBcImxvc3RcIikge1xuICAgICAgICAgICAgICAgIHRpdGxlID0gXCJZT1UgTE9TVCFcIjtcbiAgICAgICAgICAgICAgICBtZXNzYWdlVGV4dCA9IFwiQmV0dGVyIGx1Y2sgbmV4dCB0aW1lIVwiO1xuICAgICAgICAgICAgICAgIGJ0blRleHQgPSBcIlBsYXkgQW5vdGhlciBUaW1lXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UucmVzdWx0ID09PSBcImRyYXdcIikge1xuICAgICAgICAgICAgICAgIHRpdGxlID0gXCJJVCdTIEEgRFJBVyFcIjtcbiAgICAgICAgICAgICAgICBtZXNzYWdlVGV4dCA9IFwiRXZlcnlvbmUgd2VudCBkb3duIGluIGEgYmxhemUgb2YgZ2xvcnkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbmRlcihcbiAgICAgICAgICAgICAgICA8TWVudVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17dGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U9e21lc3NhZ2VUZXh0fVxuICAgICAgICAgICAgICAgICAgICBidXR0b25UZXh0PXtidG5UZXh0fVxuICAgICAgICAgICAgICAgIC8+LFxuICAgICAgICAgICAgICAgIHJvb3RcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAvLyB0aGlzIGNhc2UgaXMgZm9yIHJlY2VpdmUgYSBjaGF0IG1lc3NhZ2VcbiAgICAgICAgY2FzZSBcImNoYXRfbWVzc2FnZVwiOlxuXG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2LCBtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8vIHRoaXMgY2FzZSBpcyBmb3IgbW92ZSBhbm90aGVyIHBsYXllclxuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZU1vdmUobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8vIHRoaXMgY2FzZSBpcyBmb3IgZHJvcCBhIGJvbWIgZnJvbSBhbm90aGVyIHBsYXllclxuICAgICAgICBjYXNlIFwiYm9tYl9kcm9wcGVkXCI6XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZUJvbWIobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8vIHRoaXMgY2FzZSBpcyBmb3IgcGljayB1cCBhIHBvd2VyIHVwIG9yIGhlYXJ0XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuXG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAvLyB0aGlzIGNhc2UgaXMgZm9yIHdoZW4gYSBwbGF5ZXIgcXVpdHMgb3IgcmVmcmVzaGVzXG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfcXVpdFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUucmVtb3ZlUmVtb3RlUGxheWVyKG1lc3NhZ2UucGxheWVySWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLy8gdGhpcyBjYXNlIGZvciBlcnJvcnMgKGxpa2Ugbmlja25hbWUgdGFrZW4pXG4gICAgICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID09PSBcInJlZ2lzdGVyLXBhZ2VcIikge1xuICAgICAgICAgICAgICAgIHNldEVycm9yKG1lc3NhZ2UubWVzc2FnZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwL2FwcC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwidHlwZSIsInByb3BzIiwiY2hpbGRyZW4iLCJlbGUiLCJkb2N1bWVudCIsImtleSIsInN0YXJ0c1dpdGgiLCJldmVudE5hbWUiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldEF0dHJpYnV0ZSIsImZsYXRDaGlsZHJlbiIsImZsYXQiLCJJbmZpbml0eSIsImFwcGVuZCIsImZpbHRlciIsImNoaWxkIiwidW5kZWZpbmVkIiwicmVuZGVyIiwiZWxlbWVudCIsImNvbnRhaW5lciIsInJlcGxhY2VDaGlsZHJlbiIsIlJvdXRlciIsInJvdXRlciIsImVmZmVjdFN0YWNrIiwiYWN0aXZlRWZmZWN0IiwiY3JlYXRlU2lnbmFsIiwiaW5pdGlhbFZhbHVlIiwidmFsdWUiLCJlZmZlY3RzIiwiU2V0IiwiUmVhZCIsImFkZCIsIldyaXRlIiwibmV3VmFsdWUiLCJmbiIsImZvckVhY2giLCJlZmZlY3QiLCJjcmVhdGVFZmZlY3QiLCJwdXNoIiwicG9wIiwibGVuZ3RoIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInVybCIsIlVSTCIsImhyZWYiLCJsaXN0ZW4iLCJvbkVycm9yNDA0IiwiZXZlbnQiLCJkZXN0aW5hdGlvbiIsImludGVyY2VwdCIsImNvbnNvbGUiLCJsb2ciLCJSZWdpc3RlciIsIlNvdW5kIiwiaGFuZGxlV2Vic29ja2V0Iiwicm9vdCIsImdldEVsZW1lbnRCeUlkIiwid3NzIiwiV2ViU29ja2V0Iiwid2luZG93IiwiaG9zdG5hbWUiLCJzb3VuZCIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJtZXNzYWdlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsIm1lc3NhZ2VzIiwic2V0TWVzc2FnZXMiLCJDaGF0UGxheWVycyIsIm1lc3NhZ2VzQ29udGFpbmVyIiwiY2xhc3MiLCJtc2dzIiwiaW5uZXJIVE1MIiwibXNnIiwicCIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCIsImZpcnN0RWxlbWVudENoaWxkIiwidW5zaGlmdCIsImJyb2FkY2FzdE1lc3NhZ2UiLCJlIiwicHJldmVudERlZmF1bHQiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwidGFyZ2V0IiwiZ2V0IiwidHJpbSIsInJlc2V0Iiwic2VuZCIsInN0cmluZ2lmeSIsIm9uU3VibWl0IiwibmFtZSIsInBsYWNlaG9sZGVyIiwibWF4bGVuZ3RoIiwiUG9zaXRpb25Db21wb25lbnQiLCJneCIsImd5IiwidGlsZVNpemUiLCJncmlkWCIsImdyaWRZIiwieCIsInkiLCJ0YXJnZXRYIiwidGFyZ2V0WSIsIlZlbG9jaXR5Q29tcG9uZW50IiwiYmFzZVNwZWVkIiwic3BlZWQiLCJpc01vdmluZyIsImRpcmVjdGlvbiIsIklucHV0Q29tcG9uZW50IiwiaW5wdXRRdWV1ZSIsIlJlbmRlcmFibGVDb21wb25lbnQiLCJlbCIsImZyYW1lV2lkdGgiLCJmcmFtZUhlaWdodCIsInRvdGFsRnJhbWVzIiwiZnBzIiwiY3VycmVudEZyYW1lIiwicnVuRnJhbWVzIiwiaWRsZUZyYW1lcyIsImlkbGVGcHMiLCJsYXN0RnJhbWVUaW1lIiwicm93Iiwic3RhdGUiLCJsYXN0U3RhdGUiLCJQbGF5ZXJDb21wb25lbnQiLCJpZCIsImNoYXJUeXBlIiwiaXNMb2NhbCIsIkJvbWJDb21wb25lbnQiLCJvd25lcklkIiwidGltZXIiLCJyYW5nZSIsImV4cGxvZGVkIiwiRXhwbG9zaW9uQ29tcG9uZW50IiwiZHVyYXRpb24iLCJQb3dlclVwQ29tcG9uZW50IiwicGlja2VkVXAiLCJCZWhhdmlvckNvbXBvbmVudCIsImdob3N0TW9kZSIsInRocm93YWJsZSIsImRldG9uYXRvciIsImZhc3RTaG9lc0xldmVsIiwiYm9tYnMiLCJtYXgiLCJjdXJyZW50IiwiV29ybGQiLCJtb3ZlbWVudFN5c3RlbSIsInJlbmRlclN5c3RlbSIsImJvbWJTeXN0ZW0iLCJkYW1hZ2VTeXN0ZW0iLCJjaGVja0dhbWVFbmRDb25kaXRpb25zIiwic3Bhd25IZWFydFBvd2VyVXAiLCJNZW51IiwicG93ZXJVcFN5c3RlbSIsInNwYXduUG93ZXJVcCIsInNldEJvbWJzIiwic2V0TGl2ZXMiLCJzZXRSYW5nZSIsInNldFNwZWVkIiwiVElMRV9TSVpFIiwiQU5JTUFUSU9OX1JPV1MiLCJSVU4iLCJ1cCIsImxlZnQiLCJkb3duIiwicmlnaHQiLCJJRExFIiwiR2FtZUVuZ2luZSIsImNvbnN0cnVjdG9yIiwiY2FudmFzQ29udGFpbmVyIiwibWFwRGF0YSIsInNvY2tldCIsIndvcmxkIiwibG9jYWxQbGF5ZXJFbnRpdHkiLCJwbGF5ZXJFbnRpdGllcyIsIk1hcCIsInBsYXllckluZm8iLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibG9zc01vZGFsVHJpZ2dlcmVkIiwiaW5wdXRFbmFibGVkIiwiZ2FtZUVuZGVkIiwibG9jYWxQbGF5ZXJJZCIsImFsbFBsYXllcnMiLCJ0b3RhbFBsYXllcnMiLCJub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCIsIlN0cmluZyIsInBEYXRhIiwicGxheWVySWQiLCJwbGF5ZXJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJzZXQiLCJwbGF5ZXJEaXYiLCJjb2xvciIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ3aWxsQ2hhbmdlIiwic3giLCJzeSIsImFkZENvbXBvbmVudCIsInBsYXllckNvbXAiLCJsaXZlcyIsIm1heEJvbWJzIiwiYm9tYlJhbmdlIiwidXBkYXRlSHVkU3RhdHMiLCJzZXR1cElucHV0Iiwid2FybiIsInBsYXllcnMiLCJtYXAiLCJwbGF5ZXIiLCJyZWdpc3RlclN5c3RlbXMiLCJwZXJmb3JtYW5jZSIsIm5vdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImdhbWVMb29wIiwiaW5wdXQiLCJnZXRDb21wb25lbnQiLCJnZXRLZXlEaXJlY3Rpb24iLCJoYW5kbGVLZXlEb3duIiwiZGlyIiwiaW5jbHVkZXMiLCJjb2RlIiwiZHJvcEJvbWIiLCJoYW5kbGVLZXlVcCIsImQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicG9zIiwiY3VycmVudEJvbWJzIiwicXVlcnkiLCJiRW50aXR5IiwiY3JlYXRlZCIsImNyZWF0ZUJvbWIiLCJyZWFkeVN0YXRlIiwiT1BFTiIsInBheWxvYWQiLCJleGlzdHMiLCJzb21lIiwiZW50aXR5IiwiYm9tYiIsImJvbWJFbnRpdHkiLCJib21iRGl2IiwidG9wIiwiYm9tYkNvbXAiLCJoYW5kbGVSZW1vdGVNb3ZlIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsInZlbCIsInJlbmRlcmFibGUiLCJoYW5kbGVSZW1vdGVCb21iIiwiaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZCIsInJlbW92ZVBvd2VyVXBBdCIsIm5ld0xpdmVzIiwiYXBwbHlQb3dlclVwIiwicG93ZXJVcHMiLCJwb3dlclVwIiwicGFyZW50Tm9kZSIsImRlc3Ryb3lFbnRpdHkiLCJ2ZWxvY2l0eSIsIk1hdGgiLCJtaW4iLCJ1cGRhdGVNYXBDZWxsIiwidGlsZSIsInF1ZXJ5U2VsZWN0b3IiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJkZXN0cm95Qm94Q2FsbGJhY2siLCJoYXMiLCJvblBsYXllckh1cnQiLCJyZW1haW5pbmdMaXZlcyIsIm9uUG93ZXJVcFBpY2tlZCIsImJyb2FkY2FzdE1vdmVtZW50IiwiYWRkU3lzdGVtIiwidyIsImR0IiwidXBkYXRlIiwibmV4dE5vdyIsImhhbmRsZUdhbWVPdmVyIiwid2lubmVyTmFtZSIsImRlc3Ryb3kiLCJ0aXRsZSIsInRvVXBwZXJDYXNlIiwicmVtb3ZlUmVtb3RlUGxheWVyIiwiZGVsZXRlIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJyb3VuZCIsImN1cnJlbnRMb2NhbFBsYXllck5hbWUiLCJzZXRQbGF5ZXJOYW1lIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImdldFBsYXllck5hbWUiLCJnZXRJdGVtIiwiYWZmZWN0ZWRDZWxscyIsImNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzIiwiY2VsbCIsImV4cEVudGl0eSIsImV4cERpdiIsIndpZHRoIiwiaGVpZ2h0IiwiZXhwbG9zaW9ucyIsImV4cCIsImJ4IiwiYnkiLCJjZWxscyIsImRpcmVjdGlvbnMiLCJzdGVwcyIsImkiLCJ0eCIsInR5IiwiY2VsbFR5cGUiLCJoZWFydEVudGl0eSIsImhlYXJ0RGl2IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsImZvbnRTaXplIiwiaGFuZGxlUGxheWVyRGVhdGgiLCJkZWF0aEdyaWRYIiwiZmxvb3IiLCJkZWF0aEdyaWRZIiwicmVtb3ZlQ29tcG9uZW50IiwiZ2FtZUNvbnRhaW5lciIsInBQb3MiLCJpbnZpbmNpYmxlVW50aWwiLCJlUG9zIiwicGxheWVyR3JpZFgiLCJwbGF5ZXJHcmlkWSIsInByZXZpb3VzTGl2ZXMiLCJjbGFzc0xpc3QiLCJzZXRUaW1lb3V0IiwicmVtb3ZlIiwiYWxyZWFkeVJlcG9ydGVkRGVhZCIsImVudGl0aWVzIiwiZGVsdGEiLCJQTEFZRVJfU0laRSIsImJlaGF2aW9yIiwibW92ZVRvd2FyZFRhcmdldCIsImFjdGl2ZUlucHV0IiwiZHgiLCJkeSIsImhhc0lucHV0IiwibmV4dFgiLCJuZXh0WSIsInNuYXBUaHJlc2hvbGQiLCJpc0Jsb2NrZWQiLCJjdXJyZW50VGlsZVgiLCJkaWZmWCIsImFicyIsInNpZ24iLCJjdXJyZW50VGlsZVkiLCJkaWZmWSIsIm5leHRYQWZ0ZXJTbmFwIiwibmV4dFlBZnRlclNuYXAiLCJzdGVwIiwicGxheWVyU2l6ZSIsInBhZGRpbmciLCJib3R0b20iLCJpc0Jsb2NrZWRDZWxsIiwicFVwRW50aXR5IiwidXBQb3MiLCJwVXAiLCJzZWVkIiwic2VlZFJhbmRvbSIsInNpbiIsInR5cGVzIiwidHlwZUluZGV4IiwicmFuZG9tVHlwZSIsImRpdiIsImFuaW1Sb3dzIiwidGFyZ2V0Um93IiwiZnJhbWVDb3VudCIsImZyYW1lRGVsYXkiLCJwb3NYIiwicG9zWSIsImJhY2tncm91bmRQb3NpdGlvbiIsInRyYW5zZm9ybSIsIm5leHRFbnRpdHlJZCIsImNvbXBvbmVudHMiLCJzeXN0ZW1zIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudE1hcCIsImVudHJpZXMiLCJjb21wb25lbnREYXRhIiwiY29tcG9uZW50TmFtZXMiLCJmaXJzdE1hcCIsInJlc3VsdHMiLCJoYXNBbGwiLCJzeXN0ZW1GdW5jdGlvbiIsInN5c3RlbSIsIkdSSURfQk9SREVSX1NJWkUiLCJHQU1FX0NIUk9NRV9XSURUSCIsIkdBTUVfQ0hST01FX0hFSUdIVCIsImltYWdlcyIsInBsYXllck5hbWUiLCJuYW1lRWwiLCJsaXZlc0VsIiwic3BlZWRFbCIsImJvbWJzRWwiLCJyYW5nZUVsIiwiR2FtZSIsImdyaWQiLCJib2FyZFdpZHRoIiwiYm9hcmRIZWlnaHQiLCJib2FyZE91dGVyV2lkdGgiLCJib2FyZE91dGVySGVpZ2h0Iiwidmlld3BvcnRXaWR0aCIsImlubmVyV2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsImlubmVySGVpZ2h0Iiwic2NhbGUiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInNldFN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJ0ZXh0IiwiZ2FtZVN0YXJ0ZWQiLCJ0aW1lclRleHQiLCJzZWNvbmRzTGVmdCIsIkxvYmJ5IiwiYnV0dG9uVGV4dCIsInJlcGxheUJ0biIsImVycm9yIiwic2V0RXJyb3IiLCJzdWJtaXR0ZWQiLCJlcnJvckVsIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwibmlja25hbWUiLCJzcmMiLCJtdXNpYyIsIkF1ZGlvIiwiYnV0dG9uIiwiaWNvbiIsImxvb3AiLCJ2b2x1bWUiLCJ0b2dnbGUiLCJ1cGRhdGVCdXR0b24iLCJwbGF5IiwidGhlbiIsImNhdGNoIiwicGF1c2VkIiwibXV0ZWQiLCJpc011dGVkIiwic2V0SHVkUGxheWVyTmFtZSIsImN1cnJlbnRHYW1lRW5naW5lIiwibG9jYWxQbGF5ZXIiLCJmaW5kIiwieW91clBsYXllcklkIiwiZW5naW5lIiwibWVzc2FnZVRleHQiLCJidG5UZXh0IiwicmVzdWx0IiwicHJldiJdLCJzb3VyY2VSb290IjoiIn0=