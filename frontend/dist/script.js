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
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pages/game */ "./src/pages/game.jsx");
/* harmony import */ var _pages_menu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../pages/menu */ "./src/pages/menu.jsx");
/* harmony import */ var _pages_lobby__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../pages/lobby */ "./src/pages/lobby.jsx");
/* harmony import */ var _utils_sound__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/sound */ "./src/utils/sound.js");
/* harmony import */ var _components_chat__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/chat */ "./src/components/chat.jsx");
/* harmony import */ var _ecs_game_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ecs/game.js */ "./src/ecs/game.js");











const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");
const sound = new _utils_sound__WEBPACK_IMPORTED_MODULE_6__["default"]("./assets/sounds/background_music.mp3");
let currentGameEngine = null;
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
wss.addEventListener("open", ws => {});
wss.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case "room_update":
    case "lobby_timer":
      document.body.className = "lobby-page";
      if (!root.querySelector(".conatiner-lobby")) {
        (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_lobby__WEBPACK_IMPORTED_MODULE_5__["default"], null), root);
      }
      (0,_pages_lobby__WEBPACK_IMPORTED_MODULE_5__.setStates)({
        roomId: message.roomId,
        playersCount: message.playersCount,
        secondsLeft: message.secondsLeft,
        text: message.text
      });
      break;
    case "game_started":
      document.body.className = "game-page";
      (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_game__WEBPACK_IMPORTED_MODULE_3__["default"], {
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
            (0,_pages_game__WEBPACK_IMPORTED_MODULE_3__.setPlayerName)(localPlayer.nickname);
          }
          const engine = new _ecs_game_js__WEBPACK_IMPORTED_MODULE_8__.GameEngine(gameContainer, message.grid, wss);
          engine.init(message.yourPlayerId, message.players || []);
          currentGameEngine = engine;
        } else {
          console.error("Game container was not found");
        }
      }, 50);
      break;
    case "room_alone":
      document.body.className = "menu-page";
      (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_menu__WEBPACK_IMPORTED_MODULE_4__["default"], null), root);
      break;
    case "chat_message":
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_7__.setMessages)(prev => [...prev, message.message]);
      break;
    case "player_moved":
      if (currentGameEngine) {
        currentGameEngine.handleRemoteMove(message.payload);
      }
      break;
    case "bomb_dropped":
      if (currentGameEngine) {
        currentGameEngine.handleRemoteBomb(message.payload);
      }
      break;
    case "powerup_picked":
      if (currentGameEngine) {
        currentGameEngine.handleRemotePowerUpPicked(message.payload);
      }
      break;
  }
});
wss.addEventListener("error", err => {
  console.log("Error", err);
});
wss.addEventListener("close", () => {
  console.log("Closed");
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
/* harmony import */ var _systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./systems/powerUpSystem.js */ "./src/ecs/systems/powerUpSystem.js");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pages/game */ "./src/pages/game.jsx");








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
    this.lastTime = 0;
    this.removeInputListeners = null;
    this.animationFrame = null;
    this.running = false;
    this.claimedPowerUps = new Set();
  }
  init(localPlayerId, allPlayers) {
    const normalizedLocalPlayerId = String(localPlayerId);
    allPlayers.forEach(pData => {
      const playerId = String(pData.id);
      const playerEntity = this.world.createEntity();
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
        type: 'DROP_BOMB',
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
    if (entity === undefined || entity === this.localPlayerEntity) return;
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
      (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_6__.spawnPowerUp)(this.world, x, y, this.container, TILE_SIZE);
    };
    const onPlayerHurt = (entity, id, remainingLives) => {
      if (entity === this.localPlayerEntity) {
        (0,_pages_game__WEBPACK_IMPORTED_MODULE_7__.setLives)(remainingLives);
      }
    };
    const onPowerUpPicked = (id, type, x, y) => {
      this.claimedPowerUps.add(`${x},${y}`);
      if (this.localPlayerEntity === null) return;
      const player = this.world.getComponent(this.localPlayerEntity, 'Player');
      if (player && player.id === id) {
        this.updateHudStats(this.localPlayerEntity);
      }
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'POWERUP_PICKED',
          payload: {
            id,
            type,
            x,
            y
          }
        }));
      }
    };
    this.world.broadcastMovement = (entity, x, y, gridX, gridY, direction, isMoving) => {
      const player = this.world.getComponent(entity, 'Player');
      if (!player || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
      this.socket.send(JSON.stringify({
        type: 'MOVE_STATE',
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
    this.world.addSystem((w, dt, now) => (0,_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_5__.damageSystem)(w, now, onPlayerHurt, TILE_SIZE));
    this.world.addSystem((w, dt, now) => (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_6__.powerUpSystem)(w, onPowerUpPicked));
    this.world.addSystem((w, dt, now) => (0,_systems_renderSystem_js__WEBPACK_IMPORTED_MODULE_3__.renderSystem)(w, dt, now, ANIMATION_ROWS));
  }
  gameLoop(now) {
    if (!this.running) return;
    const dt = now - this.lastTime;
    this.lastTime = now;
    this.world.update(dt, now);
    this.animationFrame = requestAnimationFrame(nextNow => this.gameLoop(nextNow));
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
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_7__.setBombs)(player.maxBombs || 1);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_7__.setLives)(player.lives ?? 3);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_7__.setRange)(player.bombRange || 4);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_7__.setSpeed)(Math.round(velocity.speed));
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
/* harmony export */   damageSystem: () => (/* binding */ damageSystem)
/* harmony export */ });
function damageSystem(world, now, onPlayerHurt, tileSize = 64) {
  const players = world.query('Position', 'Player');
  const explosions = world.query('Position', 'Explosion');
  for (const playerEntity of players) {
    const pPos = world.getComponent(playerEntity, 'Position');
    const player = world.getComponent(playerEntity, 'Player');
    if (player.invincibleUntil && player.invincibleUntil > now) continue;
    for (const expEntity of explosions) {
      const ePos = world.getComponent(expEntity, 'Position');

      //(Grid-based collision)
      const playerGridX = Math.floor((pPos.x + tileSize / 2) / tileSize);
      const playerGridY = Math.floor((pPos.y + tileSize / 2) / tileSize);
      if (playerGridX === ePos.gridX && playerGridY === ePos.gridY) {
        player.lives = Math.max((player.lives ?? 3) - 1, 0);
        player.invincibleUntil = now + 1500;
        if (onPlayerHurt) {
          onPlayerHurt(playerEntity, player.id, player.lives);
        }
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
      if (pPos.gridX === upPos.gridX && pPos.gridY === upPos.gridY) {
        pUp.pickedUp = true;
        if (pUp.type === 'SPEED') {
          vel.speed = Math.min(vel.speed + 1, 8);
        } else if (pUp.type === 'BOMBS') {
          player.maxBombs = player.maxBombs ? player.maxBombs + 1 : 2;
        } else if (pUp.type === 'FLAME') {
          player.bombRange = player.bombRange ? player.bombRange + 1 : 5;
        }
        if (pUp.el && pUp.el.parentNode) {
          pUp.el.parentNode.removeChild(pUp.el);
        }
        if (onPowerUpPicked) {
          onPowerUpPicked(player.id, pUp.type, upPos.gridX, upPos.gridY);
        }
        world.destroyEntity(pUpEntity);
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
    class: "conatiner-lobby"
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

const replayBtn = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
  class: "replay-button"
}, "Play Again");
replayBtn.addEventListener("click", () => {
  location.reload();
});
let menuEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
  class: "menu-box"
}, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "You Win!"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "All other players have left the game."), replayBtn);
function Menu() {
  return menuEl;
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
    document.addEventListener("click", () => this.play(), {
      once: true
    });
    this.updateButton();
    this.play();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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STtNQUN2QixJQUFJLENBQUNYLE1BQU0sQ0FBQy9hLFlBQVksQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDO01BQ3ZELElBQUksQ0FBQ3NiLFlBQVksQ0FBQyxDQUFDO0lBQ3ZCO0VBQ0o7RUFFQUEsWUFBWUEsQ0FBQSxFQUFHO0lBQ1gsTUFBTUssT0FBTyxHQUFHLElBQUksQ0FBQ2QsS0FBSyxDQUFDYSxLQUFLLElBQUksSUFBSSxDQUFDYixLQUFLLENBQUNZLE1BQU07SUFFckQsSUFBSSxDQUFDVCxJQUFJLENBQUN2VyxTQUFTLEdBQUdrWCxPQUFPLEdBQUcsd0JBQXdCLEdBQUcseUJBQXlCO0lBQ3BGLElBQUksQ0FBQ1osTUFBTSxDQUFDYSxTQUFTLENBQUNULE1BQU0sQ0FBQyxVQUFVLEVBQUVRLE9BQU8sQ0FBQztFQUNyRDtBQUNKO0FBRUEsaUVBQWU3WCxLQUFLLEU7Ozs7OztVQ25EcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvZG9tLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NoYXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9lY3MvY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3dvcmxkLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyIGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBNZW51IGZyb20gXCIuLi9wYWdlcy9tZW51XCI7XG5pbXBvcnQgTG9iYnkgZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiOyBcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo1MDAwXCIpO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5sZXQgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwicm9vbV91cGRhdGVcIjpcbiAgICAgICAgY2FzZSBcImxvYmJ5X3RpbWVyXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuICAgICAgICAgICAgaWYgKCFyb290LnF1ZXJ5U2VsZWN0b3IoXCIuY29uYXRpbmVyLWxvYmJ5XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKDxMb2JieSAvPiwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWQsXG4gICAgICAgICAgICAgICAgcGxheWVyc0NvdW50OiBtZXNzYWdlLnBsYXllcnNDb3VudCxcbiAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogbWVzc2FnZS5zZWNvbmRzTGVmdCxcbiAgICAgICAgICAgICAgICB0ZXh0OiBtZXNzYWdlLnRleHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJnYW1lX3N0YXJ0ZWRcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJnYW1lLXBhZ2VcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVuZGVyKDxHYW1lIGdyaWQ9e21lc3NhZ2UuZ3JpZH0gLz4sIHJvb3QpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsUGxheWVyID0gKG1lc3NhZ2UucGxheWVycyB8fCBbXSkuZmluZChwbGF5ZXIgPT4gcGxheWVyLmlkID09PSBtZXNzYWdlLnlvdXJQbGF5ZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciAmJiBsb2NhbFBsYXllci5uaWNrbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SHVkUGxheWVyTmFtZShsb2NhbFBsYXllci5uaWNrbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmdpbmUgPSBuZXcgR2FtZUVuZ2luZShnYW1lQ29udGFpbmVyLCBtZXNzYWdlLmdyaWQsIHdzcyk7XG4gICAgICAgICAgICAgICAgICAgIGVuZ2luZS5pbml0KG1lc3NhZ2UueW91clBsYXllcklkLCBtZXNzYWdlLnBsYXllcnMgfHwgW10pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBlbmdpbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdhbWUgY29udGFpbmVyIHdhcyBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcInJvb21fYWxvbmVcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgIHJlbmRlcig8TWVudSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2ICxtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3JcIiwgZXJyKTtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NlZFwiKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB3c3M7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IHdzcyBmcm9tIFwiLi4vYXBwL2FwcFwiO1xuXG5jb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IGNyZWF0ZVNpZ25hbChbXSk7XG5leHBvcnQgeyBzZXRNZXNzYWdlcyB9O1xuXG5mdW5jdGlvbiBDaGF0UGxheWVycygpIHtcbiAgICBjb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IDxkaXYgY2xhc3M9XCJtZXNzYWdlc1wiPjwvZGl2PjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZ3MgPSBtZXNzYWdlcygpO1xuICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGZvciAobGV0IG1zZyBvZiBtc2dzKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBwLnRleHRDb250ZW50ID0gbXNnO1xuICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXNDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5yZW1vdmVDaGlsZChtZXNzYWdlc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgbXNncy51bnNoaWZ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZm9ybURhdGEuZ2V0KFwibWVzc2FnZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJjaGF0X21lc3NhZ2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH0pKTtcbiAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdFwiIG9uU3VibWl0PXticm9hZGNhc3RNZXNzYWdlfT5cbiAgICAgICAgICAgIHttZXNzYWdlc0NvbnRhaW5lcn1cbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJ0eXBlIHRvIHRoZSBvdGhlciBwbGF5ZXJzIC4uLlwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVyczsiLCIvLyAvc3JjL2Vjcy9jb21wb25lbnRzLmpzXG5cbmV4cG9ydCBjb25zdCBQb3NpdGlvbkNvbXBvbmVudCA9IChneCwgZ3ksIHRpbGVTaXplID0gNjQpID0+ICh7XG4gICAgZ3JpZFg6IGd4LFxuICAgIGdyaWRZOiBneSxcbiAgICB4OiBneCAqIHRpbGVTaXplLFxuICAgIHk6IGd5ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRZOiBneSAqIHRpbGVTaXplXG59KTtcblxuZXhwb3J0IGNvbnN0IFZlbG9jaXR5Q29tcG9uZW50ID0gKGJhc2VTcGVlZCA9IDIuNSkgPT4gKHtcbiAgICBiYXNlU3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBzcGVlZDogYmFzZVNwZWVkLFxuICAgIGlzTW92aW5nOiBmYWxzZSxcbiAgICBkaXJlY3Rpb246ICdkb3duJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBJbnB1dENvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgaW5wdXRRdWV1ZTogW11cbn0pO1xuXG5leHBvcnQgY29uc3QgUmVuZGVyYWJsZUNvbXBvbmVudCA9IChlbCwgZnJhbWVXaWR0aCA9IDY0LCBmcmFtZUhlaWdodCA9IDY0LCB0b3RhbEZyYW1lcyA9IDQsIGZwcyA9IDEyKSA9PiAoe1xuICAgIGVsOiBlbCxcbiAgICBmcmFtZVdpZHRoOiBmcmFtZVdpZHRoLFxuICAgIGZyYW1lSGVpZ2h0OiBmcmFtZUhlaWdodCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IHRvdGFsRnJhbWVzLFxuICAgIHJ1bkZyYW1lczogNCxcbiAgICBpZGxlRnJhbWVzOiAyLFxuICAgIGZwczogZnBzLFxuICAgIGlkbGVGcHM6IDQsXG4gICAgbGFzdEZyYW1lVGltZTogMCxcbiAgICByb3c6IDAsXG4gICAgc3RhdGU6ICdJRExFJyxcbiAgICBsYXN0U3RhdGU6ICdJRExFJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXJDb21wb25lbnQgPSAoaWQsIGNoYXJUeXBlLCBpc0xvY2FsID0gZmFsc2UpID0+ICh7XG4gICAgaWQ6IGlkLFxuICAgIGNoYXJUeXBlOiBjaGFyVHlwZSxcbiAgICBpc0xvY2FsOiBpc0xvY2FsXG59KTtcblxuZXhwb3J0IGNvbnN0IEJvbWJDb21wb25lbnQgPSAob3duZXJJZCwgdGltZXIgPSAyMDAwLCByYW5nZSA9IDQpID0+ICh7XG4gICAgb3duZXJJZDogb3duZXJJZCxcbiAgICB0aW1lcjogdGltZXIsXG4gICAgcmFuZ2U6IHJhbmdlLFxuICAgIGV4cGxvZGVkOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBFeHBsb3Npb25Db21wb25lbnQgPSAoZHVyYXRpb24gPSA1MDApID0+ICh7XG4gICAgZHVyYXRpb246IGR1cmF0aW9uXG59KTtcblxuZXhwb3J0IGNvbnN0IFBvd2VyVXBDb21wb25lbnQgPSAodHlwZSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlLCBcbiAgICBwaWNrZWRVcDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgQmVoYXZpb3JDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGdob3N0TW9kZTogZmFsc2UsXG4gICAgdGhyb3dhYmxlOiBmYWxzZSxcbiAgICBkZXRvbmF0b3I6IGZhbHNlLFxuICAgIGZhc3RTaG9lc0xldmVsOiAxLFxuICAgIGJvbWJzOiB7XG4gICAgICAgIG1heDogMSxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgcmFuZ2U6IDJcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC5qcyc7XG5pbXBvcnQge1xuICAgIFBvc2l0aW9uQ29tcG9uZW50LFxuICAgIFZlbG9jaXR5Q29tcG9uZW50LFxuICAgIElucHV0Q29tcG9uZW50LFxuICAgIFJlbmRlcmFibGVDb21wb25lbnQsXG4gICAgUGxheWVyQ29tcG9uZW50LFxuICAgIEJvbWJDb21wb25lbnRcbn0gZnJvbSAnLi9jb21wb25lbnRzLmpzJztcblxuaW1wb3J0IHsgbW92ZW1lbnRTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyc7XG5pbXBvcnQgeyBib21iU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgZGFtYWdlU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyc7XG5pbXBvcnQgeyBwb3dlclVwU3lzdGVtLCBzcGF3blBvd2VyVXAgfSBmcm9tICcuL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyc7XG5pbXBvcnQgeyBzZXRCb21icywgc2V0TGl2ZXMsIHNldFJhbmdlLCBzZXRTcGVlZCB9IGZyb20gJy4uL3BhZ2VzL2dhbWUnO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEFOSU1BVElPTl9ST1dTID0ge1xuICAgIFJVTjogeyB1cDogMzgsIGxlZnQ6IDM5LCBkb3duOiA0MCwgcmlnaHQ6IDQxIH0sXG4gICAgSURMRTogeyB1cDogMjIsIGxlZnQ6IDIzLCBkb3duOiAyNCwgcmlnaHQ6IDI1IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBHYW1lRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNDb250YWluZXIsIG1hcERhdGEsIHNvY2tldCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNhbnZhc0NvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gbWFwRGF0YTtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcbiAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IG51bGw7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcyA9IG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICBpbml0KGxvY2FsUGxheWVySWQsIGFsbFBsYXllcnMpIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZExvY2FsUGxheWVySWQgPSBTdHJpbmcobG9jYWxQbGF5ZXJJZCk7XG5cbiAgICAgICAgYWxsUGxheWVycy5mb3JFYWNoKHBEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gU3RyaW5nKHBEYXRhLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcERhdGEuY29sb3IgfHwgXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gYHBsYXllciBwbGF5ZXItJHtjb2xvcn1gO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS56SW5kZXggPSAnMTAnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckRpdik7XG5cbiAgICAgICAgICAgIGNvbnN0IHN4ID0gcERhdGEueCB8fCAxO1xuICAgICAgICAgICAgY29uc3Qgc3kgPSBwRGF0YS55IHx8IDE7XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJywgUG9zaXRpb25Db21wb25lbnQoc3gsIHN5LCBUSUxFX1NJWkUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5JywgVmVsb2NpdHlDb21wb25lbnQoMi41KSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJywgUmVuZGVyYWJsZUNvbXBvbmVudChwbGF5ZXJEaXYsIDY0LCA2NCwgNCwgMTIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpc0xvY2FsID0gcGxheWVySWQgPT09IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IFBsYXllckNvbXBvbmVudChwbGF5ZXJJZCwgY29sb3IsIGlzTG9jYWwpO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5saXZlcyA9IDM7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLm1heEJvbWJzID0gMTtcbiAgICAgICAgICAgIHBsYXllckNvbXAuYm9tYlJhbmdlID0gNDtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicsIHBsYXllckNvbXApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcy5zZXQocGxheWVySWQsIHBsYXllckVudGl0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc0xvY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcsIElucHV0Q29tcG9uZW50KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMocGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltHYW1lRW5naW5lXSBMb2NhbCBwbGF5ZXIgd2FzIG5vdCBmb3VuZFwiLCB7XG4gICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXJJZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzOiBhbGxQbGF5ZXJzLm1hcChwbGF5ZXIgPT4gcGxheWVyLmlkKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlclN5c3RlbXMoKTtcblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5vdykgPT4gdGhpcy5nYW1lTG9vcChub3cpKTtcbiAgICB9XG5cbiAgICBzZXR1cElucHV0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZ2V0S2V5RGlyZWN0aW9uID0gKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93VXAnIHx8IGtleSA9PT0gJ3cnIHx8IGtleSA9PT0gJ1onIHx8IGtleSA9PT0gJ3onKSByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93TGVmdCcgfHwga2V5ID09PSAnYScgfHwga2V5ID09PSAnUScgfHwga2V5ID09PSAncScpIHJldHVybiAnbGVmdCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dSaWdodCcgfHwga2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpIHJldHVybiAncmlnaHQnO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlLnVuc2hpZnQoZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkcm9wQm9tYigpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRCb21icyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5maWx0ZXIoYkVudGl0eSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoYkVudGl0eSwgJ0JvbWInKS5vd25lcklkID09PSBwbGF5ZXIuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjdXJyZW50Qm9tYnMubGVuZ3RoID49IHBsYXllci5tYXhCb21icykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUJvbWIocGxheWVyLmlkLCBwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgcGxheWVyLmJvbWJSYW5nZSk7XG4gICAgICAgIGlmICghY3JlYXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0RST1BfQk9NQicsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZDogcGxheWVyLmlkLCB4OiBwb3MuZ3JpZFgsIHk6IHBvcy5ncmlkWSwgcmFuZ2U6IHBsYXllci5ib21iUmFuZ2UgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiBib21iLm93bmVySWQgPT09IG93bmVySWQgJiYgcG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuZWwgPSBib21iRGl2O1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicsIGJvbWJDb21wKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlTW92ZShwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW2hhbmRsZVJlbW90ZU1vdmVdIEludmFsaWQgcGF5bG9hZDpcIiwgcGF5bG9hZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBFbnRpdHkgbm90IGZvdW5kIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfS4gQXZhaWxhYmxlIHBsYXllcnM6YCwgQXJyYXkuZnJvbSh0aGlzLnBsYXllckVudGl0aWVzLmtleXMoKSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtoYW5kbGVSZW1vdGVNb3ZlXSBJZ25vcmluZyBsb2NhbCBwbGF5ZXIgdXBkYXRlIGZvciAke3BheWxvYWQuaWR9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwb3MgfHwgIXZlbCB8fCAhcmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gVXBkYXRpbmcgcGxheWVyICR7cGF5bG9hZC5pZH0gdG8gKCR7cGF5bG9hZC5ncmlkWH0sICR7cGF5bG9hZC5ncmlkWX0pYCk7XG4gICAgICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgICAgICBwb3MuZ3JpZFggPSBwYXlsb2FkLmdyaWRYO1xuICAgICAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgICAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwYXlsb2FkLnk7XG4gICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZUJvbWIocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDQpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgcGF5bG9hZC54ID09PSB1bmRlZmluZWQgfHwgcGF5bG9hZC55ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnJlbW92ZVBvd2VyVXBBdChwYXlsb2FkLngsIHBheWxvYWQueSk7XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkIHx8IGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYXBwbHlQb3dlclVwKGVudGl0eSwgcGF5bG9hZC50eXBlKTtcbiAgICB9XG5cbiAgICByZW1vdmVQb3dlclVwQXQoZ3JpZFgsIGdyaWRZKSB7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHtncmlkWH0sJHtncmlkWX1gKTtcbiAgICAgICAgY29uc3QgcG93ZXJVcHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwb3dlclVwID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCFwb3MgfHwgIXBvd2VyVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcG93ZXJVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAocG93ZXJVcC5lbCAmJiBwb3dlclVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG93ZXJVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvd2VyVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UG93ZXJVcChlbnRpdHksIHR5cGUpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdTUEVFRCcpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5LnNwZWVkID0gTWF0aC5taW4odmVsb2NpdHkuc3BlZWQgKyAxLCA4KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVyU3lzdGVtcygpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlTWFwQ2VsbCA9ICh4LCB5LCBuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm1hcERhdGFbeV0pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5tYXBEYXRhW3ldW3hdID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCk7XG4gICAgICAgICAgICBpZiAoIXRpbGUpIHJldHVybjtcblxuICAgICAgICAgICAgdGlsZS5jbGFzc05hbWUgPSAndGlsZSB0aWxlLWZsb29yJztcbiAgICAgICAgICAgIHRpbGUuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybChcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIiknO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGRlc3Ryb3lCb3hDYWxsYmFjayA9ICh4LCB5KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGFpbWVkUG93ZXJVcHMuaGFzKGAke3h9LCR7eX1gKSkgcmV0dXJuO1xuICAgICAgICAgICAgc3Bhd25Qb3dlclVwKHRoaXMud29ybGQsIHgsIHksIHRoaXMuY29udGFpbmVyLCBUSUxFX1NJWkUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUGxheWVySHVydCA9IChlbnRpdHksIGlkLCByZW1haW5pbmdMaXZlcykgPT4ge1xuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHNldExpdmVzKHJlbWFpbmluZ0xpdmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBvd2VyVXBQaWNrZWQgPSAoaWQsIHR5cGUsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHt4fSwke3l9YCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgcGxheWVyLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHModGhpcy5sb2NhbFBsYXllckVudGl0eSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9XRVJVUF9QSUNLRUQnLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGlkLCB0eXBlLCB4LCB5IH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5icm9hZGNhc3RNb3ZlbWVudCA9IChlbnRpdHksIHgsIHksIGdyaWRYLCBncmlkWSwgZGlyZWN0aW9uLCBpc01vdmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAoIXBsYXllciB8fCAhdGhpcy5zb2NrZXQgfHwgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ01PVkVfU1RBVEUnLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBsYXllci5pZCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGlzTW92aW5nLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IG1vdmVtZW50U3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBib21iU3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGRhbWFnZVN5c3RlbSh3LCBub3csIG9uUGxheWVySHVydCwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBwb3dlclVwU3lzdGVtKHcsIG9uUG93ZXJVcFBpY2tlZCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcmVuZGVyU3lzdGVtKHcsIGR0LCBub3csIEFOSU1BVElPTl9ST1dTKSk7XG4gICAgfVxuXG4gICAgZ2FtZUxvb3Aobm93KSB7XG4gICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZHQgPSBub3cgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gbm93O1xuICAgICAgICB0aGlzLndvcmxkLnVwZGF0ZShkdCwgbm93KTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobmV4dE5vdykgPT4gdGhpcy5nYW1lTG9vcChuZXh0Tm93KSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUh1ZFN0YXRzKGVudGl0eSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgICAgIHNldExpdmVzKHBsYXllci5saXZlcyA/PyAzKTtcbiAgICAgICAgc2V0UmFuZ2UocGxheWVyLmJvbWJSYW5nZSB8fCA0KTtcbiAgICAgICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYm9tYlN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3QgYm9tYnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgYm9tYkVudGl0eSBvZiBib21icykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IGJvbWIgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgXG4gICAgICAgIGJvbWIudGltZXIgLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoYm9tYi50aW1lciA8PSAwICYmICFib21iLmV4cGxvZGVkKSB7XG4gICAgICAgICAgICBib21iLmV4cGxvZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgYWZmZWN0ZWRDZWxscyA9IGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBib21iLnJhbmdlLCBtYXBEYXRhKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWZmZWN0ZWRDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGV4cERpdi5jbGFzc05hbWUgPSAnZXhwbG9zaW9uJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Y2VsbC54ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS50b3AgPSBgJHtjZWxsLnkgKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnpJbmRleCA9ICc3JztcblxuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicsIHsgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYOiBjZWxsLngsIFxuICAgICAgICAgICAgICAgICAgICBncmlkWTogY2VsbC55LCBcbiAgICAgICAgICAgICAgICAgICAgeDogY2VsbC54ICogdGlsZVNpemUsIFxuICAgICAgICAgICAgICAgICAgICB5OiBjZWxsLnkgKiB0aWxlU2l6ZSBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJywgeyBkdXJhdGlvbjogNTAwLCBlbDogZXhwRGl2IH0pO1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChleHBEaXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhW2NlbGwueV0gJiYgbWFwRGF0YVtjZWxsLnldW2NlbGwueF0gPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTWFwQ2VsbChjZWxsLngsIGNlbGwueSwgMik7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzdHJveUJveENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95Qm94Q2FsbGJhY2soY2VsbC54LCBjZWxsLnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChib21iLmVsICYmIGJvbWIuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChib21iLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoYm9tYkVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgIGNvbnN0IGV4cCA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nKTtcbiAgICAgICAgZXhwLmR1cmF0aW9uIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGV4cC5kdXJhdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICBpZiAoZXhwLmVsICYmIGV4cC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZXhwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXhwLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoZXhwRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMoYngsIGJ5LCByYW5nZSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGxzID0gW3sgeDogYngsIHk6IGJ5IH1dO1xuICAgIGNvbnN0IGRpcmVjdGlvbnMgPSBbXG4gICAgICAgIHsgeDogMCwgeTogLTEgfSxcbiAgICAgICAgeyB4OiAwLCB5OiAxIH0sXG4gICAgICAgIHsgeDogLTEsIHk6IDAgfSxcbiAgICAgICAgeyB4OiAxLCB5OiAwIH1cbiAgICBdO1xuICAgIFxuICAgIGNvbnN0IHN0ZXBzID0gcmFuZ2UgLSAxOyBcbiAgICBcbiAgICBkaXJlY3Rpb25zLmZvckVhY2goZGlyID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdHggPSBieCArIChkaXIueCAqIGkpO1xuICAgICAgICAgICAgY29uc3QgdHkgPSBieSArIChkaXIueSAqIGkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW1hcERhdGFbdHldIHx8IG1hcERhdGFbdHldW3R4XSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY2VsbFR5cGUgPSBtYXBEYXRhW3R5XVt0eF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjZWxscy5wdXNoKHsgeDogdHgsIHk6IHR5IH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBjZWxscztcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBkYW1hZ2VTeXN0ZW0od29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQbGF5ZXInKTtcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAocGxheWVyLmludmluY2libGVVbnRpbCAmJiBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID4gbm93KSBjb250aW51ZTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8oR3JpZC1iYXNlZCBjb2xsaXNpb24pXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWCA9IE1hdGguZmxvb3IoKHBQb3MueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWSA9IE1hdGguZmxvb3IoKHBQb3MueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChwbGF5ZXJHcmlkWCA9PT0gZVBvcy5ncmlkWCAmJiBwbGF5ZXJHcmlkWSA9PT0gZVBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIHBsYXllci5saXZlcyA9IE1hdGgubWF4KChwbGF5ZXIubGl2ZXMgPz8gMykgLSAxLCAwKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID0gbm93ICsgMTUwMDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAob25QbGF5ZXJIdXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIG9uUGxheWVySHVydChwbGF5ZXJFbnRpdHksIHBsYXllci5pZCwgcGxheWVyLmxpdmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gbW92ZW1lbnRTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHRpbGVTaXplID0gNDApIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScpO1xuICAgIGNvbnN0IGRlbHRhID0gZHQgLyAxNi42NztcblxuICAgIGNvbnN0IFBMQVlFUl9TSVpFID0gdGlsZVNpemU7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgIGNvbnN0IGJlaGF2aW9yID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JlaGF2aW9yJyk7XG5cbiAgICAgICAgaWYgKGJlaGF2aW9yKSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkICsgKGJlaGF2aW9yLmZhc3RTaG9lc0xldmVsIC0gMSkgKiAwLjU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3RpdmVJbnB1dCA9IGlucHV0LmlucHV0UXVldWVbMF07XG4gICAgICAgIGxldCBkeCA9IDA7XG4gICAgICAgIGxldCBkeSA9IDA7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUlucHV0ID09PSAndXAnKSB7XG4gICAgICAgICAgICBkeSA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdkb3duJykge1xuICAgICAgICAgICAgZHkgPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdkb3duJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICBkeCA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgZHggPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdyaWdodCc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNJbnB1dCA9IGR4ICE9PSAwIHx8IGR5ICE9PSAwO1xuXG4gICAgICAgIGlmICghaGFzSW5wdXQpIHtcbiAgICAgICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuICAgICAgICAgICAgdmVsLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdJRExFJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFkgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgY29uc3Qgc25hcFRocmVzaG9sZCA9IDMyO1xuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiBkeCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChwb3MueCwgbmV4dFksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVggPSBNYXRoLmZsb29yKChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WCA9IGN1cnJlbnRUaWxlWCAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZYID0gcG9zLnggLSB0YXJnZXRYO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZYKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeCA9IC1NYXRoLnNpZ24oZGlmZlgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChuZXh0WCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVkgPSBNYXRoLmZsb29yKChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WSA9IGN1cnJlbnRUaWxlWSAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZZID0gcG9zLnkgLSB0YXJnZXRZO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZZKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeSA9IC1NYXRoLnNpZ24oZGlmZlkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYQWZ0ZXJTbmFwID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WUFmdGVyU25hcCA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgIWlzQmxvY2tlZChuZXh0WEFmdGVyU25hcCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy54ID0gbmV4dFhBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgIWlzQmxvY2tlZChwb3MueCwgbmV4dFlBZnRlclNuYXAsIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy55ID0gbmV4dFlBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdSVU4nO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuXG4gICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKSB7XG4gICAgY29uc3Qgc3RlcCA9IHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgaWYgKHBvcy54IDwgcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1pbihwb3MueCArIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9IGVsc2UgaWYgKHBvcy54ID4gcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1heChwb3MueCAtIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9XG5cbiAgICBpZiAocG9zLnkgPCBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWluKHBvcy55ICsgc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH0gZWxzZSBpZiAocG9zLnkgPiBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWF4KHBvcy55IC0gc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH1cblxuICAgIHZlbC5pc01vdmluZyA9XG4gICAgICAgIHBvcy54ICE9PSBwb3MudGFyZ2V0WCB8fFxuICAgICAgICBwb3MueSAhPT0gcG9zLnRhcmdldFk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZCh4LCB5LCBtYXBEYXRhLCB0aWxlU2l6ZSwgcGxheWVyU2l6ZSA9IHRpbGVTaXplKSB7XG4gICAgY29uc3QgcGFkZGluZyA9IDQ7XG5cbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHJpZ2h0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCB0b3AgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgYm90dG9tID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIGJvdHRvbSwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgYm90dG9tLCBtYXBEYXRhKVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZENlbGwoeCwgeSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGwgPSBtYXBEYXRhW3ldICYmIG1hcERhdGFbeV1beF07XG5cbiAgICByZXR1cm4gY2VsbCAhPT0gMCAmJiBjZWxsICE9PSAyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHBvd2VyVXBTeXN0ZW0od29ybGQsIG9uUG93ZXJVcFBpY2tlZCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUGxheWVyJyk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcFBvcyB8fCAhdmVsIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcFVwRW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCB1cFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcFVwID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghdXBQb3MgfHwgIXBVcCB8fCBwVXAucGlja2VkVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocFBvcy5ncmlkWCA9PT0gdXBQb3MuZ3JpZFggJiYgcFBvcy5ncmlkWSA9PT0gdXBQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC50eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlbC5zcGVlZCA9IE1hdGgubWluKHZlbC5zcGVlZCArIDEsIDgpOyBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC5lbCAmJiBwVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvblBvd2VyVXBQaWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb25Qb3dlclVwUGlja2VkKHBsYXllci5pZCwgcFVwLnR5cGUsIHVwUG9zLmdyaWRYLCB1cFBvcy5ncmlkWSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShwVXBFbnRpdHkpO1xuICAgICAgICAgICAgICAgIGJyZWFrOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwYXduUG93ZXJVcCh3b3JsZCwgZ3gsIGd5LCBjb250YWluZXIsIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBzZWVkID0gZ3ggKiA3Mzg1NjA5MyBeIGd5ICogMTkzNDk2NjM7XG4gICAgY29uc3Qgc2VlZFJhbmRvbSA9IChNYXRoLnNpbihzZWVkKSAqIDEwMDAwKSAtIE1hdGguZmxvb3IoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCk7XG4gICAgXG4gICAgaWYgKHNlZWRSYW5kb20gPiAwLjM1KSByZXR1cm47XG5cbiAgICBjb25zdCB0eXBlcyA9IFsnU1BFRUQnLCAnQk9NQlMnLCAnRkxBTUUnXTtcbiAgICBjb25zdCB0eXBlSW5kZXggPSBNYXRoLmZsb29yKChNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCAtIE1hdGguZmxvb3IoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDApKSAqIHR5cGVzLmxlbmd0aCk7XG4gICAgY29uc3QgcmFuZG9tVHlwZSA9IHR5cGVzW3R5cGVJbmRleF07XG5cbiAgICBjb25zdCBwVXBFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYOiBneCwgZ3JpZFk6IGd5LCB4OiBneCAqIHRpbGVTaXplLCB5OiBneSAqIHRpbGVTaXplIH0pO1xuICAgIFxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSBgcG93ZXJ1cCBwb3dlcnVwLSR7cmFuZG9tVHlwZS50b0xvd2VyQ2FzZSgpfWA7XG4gICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBkaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUubGVmdCA9IGAke2d4ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS50b3AgPSBgJHtneSAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnLCB7IHR5cGU6IHJhbmRvbVR5cGUsIGVsOiBkaXYgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcmVuZGVyU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBhbmltUm93cykge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1JlbmRlcmFibGUnKTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG5cbiAgICAgICAgaWYgKCFyZW5kZXJhYmxlLmVsKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHJlbmRlcmFibGUuc3RhdGU7XG4gICAgICAgIGNvbnN0IHRhcmdldFJvdyA9IGFuaW1Sb3dzW3N0YXRlXVt2ZWwuZGlyZWN0aW9uXTtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlc2V0IGFuaW1hdGlvbiB3aGVuIHJvdyBvciBzdGF0ZSBjaGFuZ2VzXG4gICAgICAgIGlmIChyZW5kZXJhYmxlLnJvdyAhPT0gdGFyZ2V0Um93IHx8IHJlbmRlcmFibGUubGFzdFN0YXRlICE9PSBzdGF0ZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5yb3cgPSB0YXJnZXRSb3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RTdGF0ZSA9IHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZnJhbWVDb3VudCA9IHN0YXRlID09PSAnUlVOJyA/IHJlbmRlcmFibGUucnVuRnJhbWVzIDogcmVuZGVyYWJsZS5pZGxlRnJhbWVzO1xuICAgICAgICBjb25zdCBmcmFtZURlbGF5ID0gc3RhdGUgPT09ICdSVU4nID8gMTAwMCAvIHJlbmRlcmFibGUuZnBzIDogMTAwMCAvIHJlbmRlcmFibGUuaWRsZUZwcztcblxuICAgICAgICBpZiAobm93IC0gcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID4gZnJhbWVEZWxheSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKyAxKSAlIGZyYW1lQ291bnQ7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3NYID0gLShyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSAqIHJlbmRlcmFibGUuZnJhbWVXaWR0aCk7XG4gICAgICAgIGNvbnN0IHBvc1kgPSAtKHJlbmRlcmFibGUucm93ICogcmVuZGVyYWJsZS5mcmFtZUhlaWdodCk7XG4gICAgICAgIFxuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGAke3Bvc1h9cHggJHtwb3NZfXB4YDtcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtwb3MueH1weCwgJHtwb3MueX1weCwgMClgO1xuICAgIH1cbn1cbiIsIi8vIC9zcmMvZWNzL3dvcmxkLmpzXG5cbmV4cG9ydCBjbGFzcyBXb3JsZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubmV4dEVudGl0eUlkID0gMDtcbiAgICAgICAgdGhpcy5lbnRpdGllcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gbmV3IE1hcCgpOyBcbiAgICAgICAgdGhpcy5zeXN0ZW1zID0gW107XG4gICAgfVxuXG4gICAgY3JlYXRlRW50aXR5KCkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLm5leHRFbnRpdHlJZCsrO1xuICAgICAgICB0aGlzLmVudGl0aWVzLmFkZChlbnRpdHkpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cblxuICAgIGRlc3Ryb3lFbnRpdHkoZW50aXR5KSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIGZvciAoY29uc3QgW2NvbXBvbmVudE5hbWUsIGNvbXBvbmVudE1hcF0gb2YgdGhpcy5jb21wb25lbnRzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSwgY29tcG9uZW50RGF0YSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5jb21wb25lbnRzLmhhcyhjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnNldChjb21wb25lbnROYW1lLCBuZXcgTWFwKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSkuc2V0KGVudGl0eSwgY29tcG9uZW50RGF0YSk7XG4gICAgfVxuXG4gICAgZ2V0Q29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50TWFwID8gY29tcG9uZW50TWFwLmdldChlbnRpdHkpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJlbW92ZUNvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudE1hcCkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcXVlcnkoLi4uY29tcG9uZW50TmFtZXMpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudE5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZmlyc3RNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzWzBdKTtcbiAgICAgICAgaWYgKCFmaXJzdE1hcCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBmaXJzdE1hcC5rZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBoYXNBbGwgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb21wb25lbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmICghbWFwIHx8ICFtYXAuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzQWxsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNBbGwgJiYgdGhpcy5lbnRpdGllcy5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZFN5c3RlbShzeXN0ZW1GdW5jdGlvbikge1xuICAgICAgICB0aGlzLnN5c3RlbXMucHVzaChzeXN0ZW1GdW5jdGlvbik7XG4gICAgfVxuXG4gICAgdXBkYXRlKGR0LCBub3cpIHtcbiAgICAgICAgZm9yIChjb25zdCBzeXN0ZW0gb2YgdGhpcy5zeXN0ZW1zKSB7XG4gICAgICAgICAgICBzeXN0ZW0odGhpcywgZHQsIG5vdyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBHUklEX0JPUkRFUl9TSVpFID0gNjtcbmNvbnN0IEdBTUVfQ0hST01FX1dJRFRIID0gNzI7XG5jb25zdCBHQU1FX0NIUk9NRV9IRUlHSFQgPSAxNTA7XG5cbmNvbnN0IGltYWdlcyA9IHtcbiAgICAyOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIixcbiAgICAzOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja193YWxsLnBuZ1wiLFxuICAgIDQ6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2V4cGxvaXQucG5nXCIsXG59O1xuXG5jb25zdCBbcGxheWVyTmFtZSwgc2V0UGxheWVyTmFtZV0gPSBjcmVhdGVTaWduYWwoXCJQbGF5ZXIgMVwiKTtcbmNvbnN0IFtsaXZlcywgc2V0TGl2ZXNdID0gY3JlYXRlU2lnbmFsKDMpO1xuY29uc3QgW3NwZWVkLCBzZXRTcGVlZF0gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbYm9tYnMsIHNldEJvbWJzXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtyYW5nZSwgc2V0UmFuZ2VdID0gY3JlYXRlU2lnbmFsKDEpO1xuZXhwb3J0IHsgc2V0UGxheWVyTmFtZSwgc2V0TGl2ZXMsIHNldFNwZWVkLCBzZXRCb21icywgc2V0UmFuZ2UgfTtcblxuY29uc3QgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IG5hbWVFbC50ZXh0Q29udGVudCA9IHBsYXllck5hbWUoKTsgfSk7XG5cbmNvbnN0IGxpdmVzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGxpdmVzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHNwZWVkRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHNwZWVkLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IGJvbWJzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGJvbWJzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHJhbmdlRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHJhbmdlLXZhbHVlXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbGl2ZXNFbC50ZXh0Q29udGVudCA9IGxpdmVzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgc3BlZWRFbC50ZXh0Q29udGVudCA9IHNwZWVkKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgYm9tYnNFbC50ZXh0Q29udGVudCA9IGJvbWJzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgcmFuZ2VFbC50ZXh0Q29udGVudCA9IHJhbmdlKCk7IH0pO1xuXG5mdW5jdGlvbiBHYW1lKHsgZ3JpZCB9KSB7XG4gICAgY29uc3QgYm9hcmRXaWR0aCA9IGdyaWRbMF0ubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gZ3JpZC5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRPdXRlcldpZHRoID0gYm9hcmRXaWR0aCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJIZWlnaHQgPSBib2FyZEhlaWdodCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRXaWR0aCA6IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGJvYXJkSGVpZ2h0IDogd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHNjYWxlID0gTWF0aC5taW4oXG4gICAgICAgIDEsXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0V2lkdGggLSBHQU1FX0NIUk9NRV9XSURUSCkgLyBib2FyZE91dGVyV2lkdGgpLFxuICAgICAgICBNYXRoLm1heCgwLjIsICh2aWV3cG9ydEhlaWdodCAtIEdBTUVfQ0hST01FX0hFSUdIVCkgLyBib2FyZE91dGVySGVpZ2h0KVxuICAgICk7XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBncmlkLmxlbmd0aDsgcm93SW5kZXgrKykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgZ3JpZFtyb3dJbmRleF0ubGVuZ3RoOyBjb2xJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZ3JpZFtyb3dJbmRleF1bY29sSW5kZXhdO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IFwidGlsZVwiO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gYHdpZHRoOiR7VElMRV9TSVpFfXB4O2hlaWdodDoke1RJTEVfU0laRX1weDtgO1xuXG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMiB8fCBjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtZmxvb3JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtd2FsbFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1szXX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzRdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDAgfHwgY2VsbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1syXX0pYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2VsbHMucHVzaCg8ZGl2IGNsYXNzPXtjbGFzc05hbWV9IGRhdGEteD17Y29sSW5kZXh9IGRhdGEteT17cm93SW5kZXh9IHN0eWxlPXtzdHlsZX0+PC9kaXY+KTtcbiAgICAgICAgfVxuICAgICAgICByb3dzLnB1c2goPGRpdiBjbGFzcz1cImdyaWQtcm93XCI+e2NlbGxzfTwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1nbGFzc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1iYXJcIj5cbiAgICAgICAgICAgICAgICAgICAge25hbWVFbH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLXN0YXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkxpdmVzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsaXZlc0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlNwZWVkPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzcGVlZEVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkJvbWJzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib21ic0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlJhbmdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyYW5nZUVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWJvYXJkLWZyYW1lXCIgc3R5bGU9e2B3aWR0aDoke2JvYXJkT3V0ZXJXaWR0aCAqIHNjYWxlfXB4O2hlaWdodDoke2JvYXJkT3V0ZXJIZWlnaHQgKiBzY2FsZX1weDtgfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJnYW1lLWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImdhbWUtZ3JpZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17YHBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiR7Ym9hcmRXaWR0aH1weDtoZWlnaHQ6JHtib2FyZEhlaWdodH1weDt0cmFuc2Zvcm06c2NhbGUoJHtzY2FsZX0pO2B9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCBDaGF0UGxheWVycyBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmxldCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gY3JlYXRlU2lnbmFsKHt9KTtcbmV4cG9ydCB7IHNldFN0YXRlcyB9O1xuXG5sZXQgcm9vbUlkRWwgPSA8cD5Sb29tIElEOiA8L3A+O1xubGV0IHBsYXllcnNFbCA9IDxwPlBsYXllcnM6ICAvIDQ8L3A+O1xubGV0IHRleHRFbCA9IDxwPjwvcD47XG5sZXQgdGltZXJFbCA9IDxwPlRpbWVyOiA8L3A+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHMgPSBzdGF0ZXMoKTtcbiAgICByb29tSWRFbC50ZXh0Q29udGVudCA9IGBSb29tIElEOiAke3Mucm9vbUlkfWA7XG4gICAgcGxheWVyc0VsLnRleHRDb250ZW50ID0gYFBsYXllcnM6ICR7cy5wbGF5ZXJzQ291bnR9IC8gNGA7XG4gICAgdGV4dEVsLnRleHRDb250ZW50ID0gcy50ZXh0IHx8IFwiXCI7XG5cbiAgICBpZiAocy5nYW1lU3RhcnRlZCkge1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gXCJUaW1lcjogR2FtZSBzdGFydGVkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGltZXJUZXh0ID0gKCFzLnNlY29uZHNMZWZ0KSA/IFwiV2FpdGluZyBmb3Igb25lIG1vcmUgcGxheWVyXCIgOiBgJHtzLnNlY29uZHNMZWZ0fSBzZWNvbmRzYDtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IGBUaW1lcjogJHt0aW1lclRleHR9YDtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gTG9iYnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbmF0aW5lci1sb2JieVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYmJ5LWJveFwiPlxuICAgICAgICAgICAgICAgIDxoMT5Mb2JieTwvaDE+XG4gICAgICAgICAgICAgICAge3Jvb21JZEVsfVxuICAgICAgICAgICAgICAgIHtwbGF5ZXJzRWx9XG4gICAgICAgICAgICAgICAge3RleHRFbH1cbiAgICAgICAgICAgICAgICB7dGltZXJFbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPENoYXRQbGF5ZXJzIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG5yZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5sZXQgbWVudUVsID0gKFxuICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICA8aDE+WW91IFdpbiE8L2gxPlxuICAgICAgICA8cD5BbGwgb3RoZXIgcGxheWVycyBoYXZlIGxlZnQgdGhlIGdhbWUuPC9wPlxuICAgICAgICB7cmVwbGF5QnRufVxuICAgIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVudSgpIHtcbiAgICByZXR1cm4gbWVudUVsO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcblxuZnVuY3Rpb24gUmVnaXN0ZXIoeyB3c3MgfSkge1xuICAgIGxldCBzdWJtaXR0ZWQgPSBmYWxzZTtcblxuICAgIGxldCBwbGF5ZXJFbnRlciA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHN1Ym1pdHRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUgfHwgbmlja25hbWUubGVuZ3RoID4gMjApIHJldHVybjtcblxuICAgICAgICBzdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzZXRQbGF5ZXJOYW1lKG5pY2tuYW1lKTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcIm5pY2tuYW1lX29mX3RoZV9wbGF5ZXJcIixcbiAgICAgICAgICAgIG5pY2tuYW1lOiBuaWNrbmFtZVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgb25TdWJtaXQ9e3BsYXllckVudGVyfT5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5pY2tuYW1lLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVudGVyIHlvdXIgbmFtZVwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMucGxheSgpLCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5tdXNpYy5wbGF5KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5tdXNpYy5wYXVzZWQgfHwgdGhpcy5tdXNpYy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9uXCIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUJ1dHRvbigpIHtcbiAgICAgICAgY29uc3QgaXNNdXRlZCA9IHRoaXMubXVzaWMubXV0ZWQgfHwgdGhpcy5tdXNpYy5wYXVzZWQ7XG5cbiAgICAgICAgdGhpcy5pY29uLmNsYXNzTmFtZSA9IGlzTXV0ZWQgPyBcImZhLXNvbGlkIGZhLXZvbHVtZS1vZmZcIiA6IFwiZmEtc29saWQgZmEtdm9sdW1lLWhpZ2hcIjtcbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImlzLW11dGVkXCIsIGlzTXV0ZWQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291bmQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwL2FwcC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwidHlwZSIsInByb3BzIiwiY2hpbGRyZW4iLCJlbGUiLCJkb2N1bWVudCIsImtleSIsInN0YXJ0c1dpdGgiLCJldmVudE5hbWUiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldEF0dHJpYnV0ZSIsImZsYXRDaGlsZHJlbiIsImZsYXQiLCJJbmZpbml0eSIsImFwcGVuZCIsImZpbHRlciIsImNoaWxkIiwidW5kZWZpbmVkIiwicmVuZGVyIiwiZWxlbWVudCIsImNvbnRhaW5lciIsInJlcGxhY2VDaGlsZHJlbiIsIlJvdXRlciIsInJvdXRlciIsImVmZmVjdFN0YWNrIiwiYWN0aXZlRWZmZWN0IiwiY3JlYXRlU2lnbmFsIiwiaW5pdGlhbFZhbHVlIiwidmFsdWUiLCJlZmZlY3RzIiwiU2V0IiwiUmVhZCIsImFkZCIsIldyaXRlIiwibmV3VmFsdWUiLCJmbiIsImZvckVhY2giLCJlZmZlY3QiLCJjcmVhdGVFZmZlY3QiLCJwdXNoIiwicG9wIiwibGVuZ3RoIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInVybCIsIlVSTCIsImhyZWYiLCJsaXN0ZW4iLCJvbkVycm9yNDA0IiwiZXZlbnQiLCJkZXN0aW5hdGlvbiIsImludGVyY2VwdCIsImNvbnNvbGUiLCJsb2ciLCJSZWdpc3RlciIsIkdhbWUiLCJNZW51IiwiTG9iYnkiLCJzZXRTdGF0ZXMiLCJzZXRQbGF5ZXJOYW1lIiwic2V0SHVkUGxheWVyTmFtZSIsIlNvdW5kIiwic2V0TWVzc2FnZXMiLCJHYW1lRW5naW5lIiwicm9vdCIsImdldEVsZW1lbnRCeUlkIiwid3NzIiwiV2ViU29ja2V0Iiwic291bmQiLCJjdXJyZW50R2FtZUVuZ2luZSIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJ3cyIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicXVlcnlTZWxlY3RvciIsInJvb21JZCIsInBsYXllcnNDb3VudCIsInNlY29uZHNMZWZ0IiwidGV4dCIsImdyaWQiLCJzZXRUaW1lb3V0IiwiZ2FtZUNvbnRhaW5lciIsImRlc3Ryb3kiLCJsb2NhbFBsYXllciIsInBsYXllcnMiLCJmaW5kIiwicGxheWVyIiwiaWQiLCJ5b3VyUGxheWVySWQiLCJuaWNrbmFtZSIsImVuZ2luZSIsImVycm9yIiwicHJldiIsImhhbmRsZVJlbW90ZU1vdmUiLCJwYXlsb2FkIiwiaGFuZGxlUmVtb3RlQm9tYiIsImhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQiLCJlcnIiLCJtZXNzYWdlcyIsIkNoYXRQbGF5ZXJzIiwibWVzc2FnZXNDb250YWluZXIiLCJjbGFzcyIsIm1zZ3MiLCJpbm5lckhUTUwiLCJtc2ciLCJwIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJ1bnNoaWZ0IiwiYnJvYWRjYXN0TWVzc2FnZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJ0YXJnZXQiLCJnZXQiLCJ0cmltIiwicmVzZXQiLCJzZW5kIiwic3RyaW5naWZ5Iiwib25TdWJtaXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJtYXhsZW5ndGgiLCJQb3NpdGlvbkNvbXBvbmVudCIsImd4IiwiZ3kiLCJ0aWxlU2l6ZSIsImdyaWRYIiwiZ3JpZFkiLCJ4IiwieSIsInRhcmdldFgiLCJ0YXJnZXRZIiwiVmVsb2NpdHlDb21wb25lbnQiLCJiYXNlU3BlZWQiLCJzcGVlZCIsImlzTW92aW5nIiwiZGlyZWN0aW9uIiwiSW5wdXRDb21wb25lbnQiLCJpbnB1dFF1ZXVlIiwiUmVuZGVyYWJsZUNvbXBvbmVudCIsImVsIiwiZnJhbWVXaWR0aCIsImZyYW1lSGVpZ2h0IiwidG90YWxGcmFtZXMiLCJmcHMiLCJjdXJyZW50RnJhbWUiLCJydW5GcmFtZXMiLCJpZGxlRnJhbWVzIiwiaWRsZUZwcyIsImxhc3RGcmFtZVRpbWUiLCJyb3ciLCJzdGF0ZSIsImxhc3RTdGF0ZSIsIlBsYXllckNvbXBvbmVudCIsImNoYXJUeXBlIiwiaXNMb2NhbCIsIkJvbWJDb21wb25lbnQiLCJvd25lcklkIiwidGltZXIiLCJyYW5nZSIsImV4cGxvZGVkIiwiRXhwbG9zaW9uQ29tcG9uZW50IiwiZHVyYXRpb24iLCJQb3dlclVwQ29tcG9uZW50IiwicGlja2VkVXAiLCJCZWhhdmlvckNvbXBvbmVudCIsImdob3N0TW9kZSIsInRocm93YWJsZSIsImRldG9uYXRvciIsImZhc3RTaG9lc0xldmVsIiwiYm9tYnMiLCJtYXgiLCJjdXJyZW50IiwiV29ybGQiLCJtb3ZlbWVudFN5c3RlbSIsInJlbmRlclN5c3RlbSIsImJvbWJTeXN0ZW0iLCJkYW1hZ2VTeXN0ZW0iLCJwb3dlclVwU3lzdGVtIiwic3Bhd25Qb3dlclVwIiwic2V0Qm9tYnMiLCJzZXRMaXZlcyIsInNldFJhbmdlIiwic2V0U3BlZWQiLCJUSUxFX1NJWkUiLCJBTklNQVRJT05fUk9XUyIsIlJVTiIsInVwIiwibGVmdCIsImRvd24iLCJyaWdodCIsIklETEUiLCJjb25zdHJ1Y3RvciIsImNhbnZhc0NvbnRhaW5lciIsIm1hcERhdGEiLCJzb2NrZXQiLCJ3b3JsZCIsImxvY2FsUGxheWVyRW50aXR5IiwicGxheWVyRW50aXRpZXMiLCJNYXAiLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibG9jYWxQbGF5ZXJJZCIsImFsbFBsYXllcnMiLCJub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCIsIlN0cmluZyIsInBEYXRhIiwicGxheWVySWQiLCJwbGF5ZXJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJwbGF5ZXJEaXYiLCJjb2xvciIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ3aWxsQ2hhbmdlIiwic3giLCJzeSIsImFkZENvbXBvbmVudCIsInBsYXllckNvbXAiLCJsaXZlcyIsIm1heEJvbWJzIiwiYm9tYlJhbmdlIiwic2V0IiwidXBkYXRlSHVkU3RhdHMiLCJzZXR1cElucHV0Iiwid2FybiIsIm1hcCIsInJlZ2lzdGVyU3lzdGVtcyIsInBlcmZvcm1hbmNlIiwibm93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZ2FtZUxvb3AiLCJpbnB1dCIsImdldENvbXBvbmVudCIsImdldEtleURpcmVjdGlvbiIsImhhbmRsZUtleURvd24iLCJkaXIiLCJpbmNsdWRlcyIsImNvZGUiLCJkcm9wQm9tYiIsImhhbmRsZUtleVVwIiwiZCIsIndpbmRvdyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJwb3MiLCJjdXJyZW50Qm9tYnMiLCJxdWVyeSIsImJFbnRpdHkiLCJjcmVhdGVkIiwiY3JlYXRlQm9tYiIsInJlYWR5U3RhdGUiLCJPUEVOIiwiZXhpc3RzIiwic29tZSIsImVudGl0eSIsImJvbWIiLCJib21iRW50aXR5IiwiYm9tYkRpdiIsInRvcCIsImJvbWJDb21wIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsInZlbCIsInJlbmRlcmFibGUiLCJyZW1vdmVQb3dlclVwQXQiLCJhcHBseVBvd2VyVXAiLCJwb3dlclVwcyIsInBvd2VyVXAiLCJwYXJlbnROb2RlIiwiZGVzdHJveUVudGl0eSIsInZlbG9jaXR5IiwiTWF0aCIsIm1pbiIsInVwZGF0ZU1hcENlbGwiLCJ0aWxlIiwiYmFja2dyb3VuZEltYWdlIiwiZGVzdHJveUJveENhbGxiYWNrIiwiaGFzIiwib25QbGF5ZXJIdXJ0IiwicmVtYWluaW5nTGl2ZXMiLCJvblBvd2VyVXBQaWNrZWQiLCJicm9hZGNhc3RNb3ZlbWVudCIsImFkZFN5c3RlbSIsInciLCJkdCIsInVwZGF0ZSIsIm5leHROb3ciLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJvdW5kIiwiY3VycmVudExvY2FsUGxheWVyTmFtZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJnZXRQbGF5ZXJOYW1lIiwiZ2V0SXRlbSIsImFmZmVjdGVkQ2VsbHMiLCJjYWxjdWxhdGVFeHBsb3Npb25DZWxscyIsImNlbGwiLCJleHBFbnRpdHkiLCJleHBEaXYiLCJ3aWR0aCIsImhlaWdodCIsImV4cGxvc2lvbnMiLCJleHAiLCJieCIsImJ5IiwiY2VsbHMiLCJkaXJlY3Rpb25zIiwic3RlcHMiLCJpIiwidHgiLCJ0eSIsImNlbGxUeXBlIiwicFBvcyIsImludmluY2libGVVbnRpbCIsImVQb3MiLCJwbGF5ZXJHcmlkWCIsImZsb29yIiwicGxheWVyR3JpZFkiLCJlbnRpdGllcyIsImRlbHRhIiwiUExBWUVSX1NJWkUiLCJiZWhhdmlvciIsIm1vdmVUb3dhcmRUYXJnZXQiLCJhY3RpdmVJbnB1dCIsImR4IiwiZHkiLCJoYXNJbnB1dCIsIm5leHRYIiwibmV4dFkiLCJzbmFwVGhyZXNob2xkIiwiaXNCbG9ja2VkIiwiY3VycmVudFRpbGVYIiwiZGlmZlgiLCJhYnMiLCJzaWduIiwiY3VycmVudFRpbGVZIiwiZGlmZlkiLCJuZXh0WEFmdGVyU25hcCIsIm5leHRZQWZ0ZXJTbmFwIiwic3RlcCIsInBsYXllclNpemUiLCJwYWRkaW5nIiwiYm90dG9tIiwiaXNCbG9ja2VkQ2VsbCIsInBVcEVudGl0eSIsInVwUG9zIiwicFVwIiwic2VlZCIsInNlZWRSYW5kb20iLCJzaW4iLCJ0eXBlcyIsInR5cGVJbmRleCIsInJhbmRvbVR5cGUiLCJkaXYiLCJhbmltUm93cyIsInRhcmdldFJvdyIsImZyYW1lQ291bnQiLCJmcmFtZURlbGF5IiwicG9zWCIsInBvc1kiLCJiYWNrZ3JvdW5kUG9zaXRpb24iLCJ0cmFuc2Zvcm0iLCJuZXh0RW50aXR5SWQiLCJjb21wb25lbnRzIiwic3lzdGVtcyIsImRlbGV0ZSIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnRNYXAiLCJlbnRyaWVzIiwiY29tcG9uZW50RGF0YSIsInJlbW92ZUNvbXBvbmVudCIsImNvbXBvbmVudE5hbWVzIiwiZmlyc3RNYXAiLCJyZXN1bHRzIiwiaGFzQWxsIiwic3lzdGVtRnVuY3Rpb24iLCJzeXN0ZW0iLCJHUklEX0JPUkRFUl9TSVpFIiwiR0FNRV9DSFJPTUVfV0lEVEgiLCJHQU1FX0NIUk9NRV9IRUlHSFQiLCJpbWFnZXMiLCJwbGF5ZXJOYW1lIiwibmFtZUVsIiwibGl2ZXNFbCIsInNwZWVkRWwiLCJib21ic0VsIiwicmFuZ2VFbCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImJvYXJkT3V0ZXJXaWR0aCIsImJvYXJkT3V0ZXJIZWlnaHQiLCJ2aWV3cG9ydFdpZHRoIiwiaW5uZXJXaWR0aCIsInZpZXdwb3J0SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJzY2FsZSIsInJvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4Iiwic3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsImdhbWVTdGFydGVkIiwidGltZXJUZXh0IiwicmVwbGF5QnRuIiwicmVsb2FkIiwibWVudUVsIiwic3VibWl0dGVkIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImJ1dHRvbiIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwicGxheSIsIm9uY2UiLCJ1cGRhdGVCdXR0b24iLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiXSwic291cmNlUm9vdCI6IiJ9