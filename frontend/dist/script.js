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
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_7__.setMessages)(prev => [...prev, {
        nickname: message.nickname || "Player",
        message: message.message
      }]);
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
    case "player_damaged":
      if (currentGameEngine) {
        currentGameEngine.handlePlayerDamaged(message.payload);
      }
      break;
    case "game_over":
      if (currentGameEngine) {
        currentGameEngine.handleGameOver(message.payload);
      }
      break;
    case "error":
      if (document.body.className === "register-page") {
        (0,_pages_register__WEBPACK_IMPORTED_MODULE_2__.setError)(message.message);
      } else {
        alert(message.message);
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
      if (typeof msg === "string") {
        p.textContent = msg;
      } else {
        p.textContent = `${msg.nickname}: ${msg.message}`;
      }
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
  speedBoost: 0,
  speedBoostTimeRemaining: 0,
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
const BombComponent = (ownerId, timer = 2000, range = 2) => ({
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
/* harmony import */ var _systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./systems/powerUpSystem.js */ "./src/ecs/systems/powerUpSystem.js");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pages/game */ "./src/pages/game.jsx");







const SPRITE_COLUMNS = 13;
const SPRITE_ROWS = 54;
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
      playerDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE}px`;
      playerDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE}px`;
      playerDiv.style.backgroundSize = `${SPRITE_COLUMNS * _pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE}px ${SPRITE_ROWS * _pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE}px`;
      this.container.appendChild(playerDiv);
      const sx = pData.x || 1;
      const sy = pData.y || 1;
      this.world.addComponent(playerEntity, 'Position', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.PositionComponent)(sx, sy, _pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE));
      this.world.addComponent(playerEntity, 'Velocity', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.VelocityComponent)(2.5));
      this.world.addComponent(playerEntity, 'Renderable', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.RenderableComponent)(playerDiv, _pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE, _pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE, 4, 12));
      const isLocal = playerId === normalizedLocalPlayerId;
      const playerComp = (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.PlayerComponent)(playerId, color, isLocal);
      playerComp.lives = pData.lives ?? 3;
      playerComp.maxBombs = pData.maxBombs ?? 1;
      playerComp.bombRange = pData.bombRange ?? 2;
      playerComp.alive = pData.alive ?? true;
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
    const player = this.world.getComponent(this.localPlayerEntity, 'Player');
    const currentBombs = this.world.query('Position', 'Bomb').filter(bEntity => {
      return this.world.getComponent(bEntity, 'Bomb').ownerId === player.id;
    });
    if (currentBombs.length >= player.maxBombs) return;
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'DROP_BOMB',
        payload: {}
      }));
    }
  }
  createBomb(ownerId, gridX, gridY, range, bombId = null) {
    const exists = this.world.query('Position', 'Bomb').some(entity => {
      const pos = this.world.getComponent(entity, 'Position');
      const bomb = this.world.getComponent(entity, 'Bomb');
      return bombId && bomb.bombId === bombId || bomb.ownerId === ownerId && pos.gridX === gridX && pos.gridY === gridY;
    });
    if (exists) return false;
    const bombEntity = this.world.createEntity();
    const bombDiv = document.createElement('div');
    bombDiv.className = 'bomb';
    bombDiv.style.position = 'absolute';
    bombDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE}px`;
    bombDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE}px`;
    bombDiv.style.left = `${gridX * _pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE}px`;
    bombDiv.style.top = `${gridY * _pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE}px`;
    bombDiv.style.zIndex = '6';
    this.container.appendChild(bombDiv);
    this.world.addComponent(bombEntity, 'Position', {
      gridX,
      gridY
    });
    const bombComp = (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.BombComponent)(ownerId, 2000, range);
    bombComp.bombId = bombId;
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
    if (entity === this.localPlayerEntity && !payload.corrected) {
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
    vel.direction = payload.direction || vel.direction;
    vel.isMoving = payload.isMoving;
    pos.gridX = payload.gridX;
    pos.gridY = payload.gridY;
    pos.targetX = payload.x;
    pos.targetY = payload.y;
    if (payload.corrected) {
      pos.x = payload.x;
      pos.y = payload.y;
    }
    renderable.state = payload.state || (payload.isMoving ? 'RUN' : 'IDLE');
  }
  handleRemoteBomb(payload) {
    if (!payload || !payload.id) return;
    this.createBomb(payload.id, payload.x, payload.y, payload.range || 2, payload.bombId);
  }
  handleRemotePowerUpPicked(payload) {
    if (!payload || payload.x === undefined || payload.y === undefined) return;
    this.removePowerUpAt(payload.x, payload.y);
    const entity = this.playerEntities.get(String(payload.id));
    if (entity === undefined) return;
    if (payload.stats) {
      this.applyServerStats(entity, payload.stats);
    } else {
      this.applyPowerUp(entity, payload.type);
    }
    if (entity === this.localPlayerEntity) {
      this.updateHudStats(entity);
    }
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
      (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_5__.applySpeedPowerUp)(velocity);
    } else if (type === 'BOMBS') {
      player.maxBombs = player.maxBombs ? player.maxBombs + 1 : 2;
    } else if (type === 'FLAME') {
      player.bombRange = player.bombRange ? player.bombRange + 1 : 5;
    }
  }
  applyServerStats(entity, stats) {
    const player = this.world.getComponent(entity, 'Player');
    const velocity = this.world.getComponent(entity, 'Velocity');
    if (!player || !stats) return;
    player.lives = stats.lives ?? player.lives;
    player.maxBombs = stats.maxBombs ?? player.maxBombs;
    player.bombRange = stats.bombRange ?? player.bombRange;
    player.alive = stats.alive ?? player.alive;
    if (velocity && typeof stats.speed === 'number') {
      velocity.speed = stats.speed;
    }
  }
  handlePlayerDamaged(payload) {
    if (!payload || !payload.id) return;
    const entity = this.playerEntities.get(String(payload.id));
    if (entity === undefined) return;
    const player = this.world.getComponent(entity, 'Player');
    if (!player) return;
    player.lives = payload.lives ?? player.lives;
    player.alive = payload.alive ?? player.alive;
    if (!player.alive) {
      const velocity = this.world.getComponent(entity, 'Velocity');
      if (velocity) velocity.isMoving = false;
      if (entity === this.localPlayerEntity) {
        this.world.removeComponent(entity, 'Input');
      }
    }
    if (entity === this.localPlayerEntity) {
      (0,_pages_game__WEBPACK_IMPORTED_MODULE_6__.setLives)(player.lives);
    }
  }
  handleGameOver(payload) {
    this.running = false;
    const winnerName = payload && payload.winnerName ? payload.winnerName : "A player";
    setTimeout(() => alert(`${winnerName} wins!`), 50);
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
      (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_5__.spawnPowerUp)(this.world, x, y, this.container, _pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE);
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
    this.world.addSystem((w, dt, now) => (0,_systems_movementSystem_js__WEBPACK_IMPORTED_MODULE_2__.movementSystem)(w, dt, now, this.mapData, _pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE));
    this.world.addSystem((w, dt, now) => (0,_systems_bombSystem_js__WEBPACK_IMPORTED_MODULE_4__.bombSystem)(w, dt, now, this.mapData, updateMapCell, destroyBoxCallback, _pages_game__WEBPACK_IMPORTED_MODULE_6__.TILE_SIZE));
    this.world.addSystem((w, dt, now) => (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_5__.powerUpSystem)(w, onPowerUpPicked));
    this.world.addSystem((w, dt, now) => (0,_systems_renderSystem_js__WEBPACK_IMPORTED_MODULE_3__.renderSystem)(w, dt, now, ANIMATION_ROWS));
  }
  gameLoop(now) {
    if (!this.running) return;
    const dt = now - this.lastTime;
    this.lastTime = now;
    this.world.update(dt, now);
    if (this.localPlayerEntity !== null) {
      this.updateHudStats(this.localPlayerEntity);
    }
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
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_6__.setBombs)(player.maxBombs || 1);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_6__.setLives)(player.lives ?? 3);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_6__.setRange)(player.bombRange || 4);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_6__.setSpeed)(Math.round(velocity.speed));
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
    if (vel.speedBoostTimeRemaining > 0) {
      vel.speedBoostTimeRemaining = Math.max(vel.speedBoostTimeRemaining - dt, 0);
    } else {
      vel.speedBoost = 0;
    }
    const timedBoost = vel.speedBoostTimeRemaining > 0 ? vel.speedBoost || 0 : 0;
    const behaviorBoost = behavior ? (behavior.fastShoesLevel - 1) * 0.5 : 0;
    vel.speed = vel.baseSpeed + timedBoost + behaviorBoost;
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
/* harmony export */   MAX_PLAYER_SPEED: () => (/* binding */ MAX_PLAYER_SPEED),
/* harmony export */   SPEED_POWERUP_AMOUNT: () => (/* binding */ SPEED_POWERUP_AMOUNT),
/* harmony export */   SPEED_POWERUP_DURATION: () => (/* binding */ SPEED_POWERUP_DURATION),
/* harmony export */   applySpeedPowerUp: () => (/* binding */ applySpeedPowerUp),
/* harmony export */   powerUpSystem: () => (/* binding */ powerUpSystem),
/* harmony export */   spawnPowerUp: () => (/* binding */ spawnPowerUp)
/* harmony export */ });
const SPEED_POWERUP_AMOUNT = 1;
const MAX_PLAYER_SPEED = 8;
const SPEED_POWERUP_DURATION = 5000;
function applySpeedPowerUp(velocity) {
  const currentBoost = velocity.speedBoost || 0;
  const maxBoost = Math.max(MAX_PLAYER_SPEED - velocity.baseSpeed, 0);
  velocity.speedBoost = Math.min(currentBoost + SPEED_POWERUP_AMOUNT, maxBoost);
  velocity.speedBoostTimeRemaining = SPEED_POWERUP_DURATION;
  velocity.speed = Math.min(velocity.baseSpeed + velocity.speedBoost, MAX_PLAYER_SPEED);
}
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
          applySpeedPowerUp(vel);
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
/* harmony export */   TILE_SIZE: () => (/* binding */ TILE_SIZE),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setBombs: () => (/* binding */ setBombs),
/* harmony export */   setLives: () => (/* binding */ setLives),
/* harmony export */   setPlayerName: () => (/* binding */ setPlayerName),
/* harmony export */   setRange: () => (/* binding */ setRange),
/* harmony export */   setSpeed: () => (/* binding */ setSpeed)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/reactivity */ "./mini-framework/reactivity.js");


const TILE_SIZE = 48;
const GRID_BORDER_SIZE = 6;
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
    style: `width:${boardOuterWidth}px;height:${boardOuterHeight}px;`
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: "game-container",
    class: "game-grid",
    style: `position:relative;width:${boardWidth}px;height:${boardHeight}px;`
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVNBLGFBQWFBLENBQUNDLElBQUksRUFBRUMsS0FBSyxFQUFFLEdBQUdDLFFBQVEsRUFBRTtFQUNwRCxJQUFJLE9BQU9GLElBQUksS0FBSyxVQUFVLEVBQUU7SUFDNUIsT0FBT0EsSUFBSSxDQUFDO01BQUUsSUFBSUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQUVDO0lBQVMsQ0FBQyxDQUFDO0VBQy9DO0VBRUEsTUFBTUMsR0FBRyxHQUFHQyxRQUFRLENBQUNMLGFBQWEsQ0FBQ0MsSUFBSSxDQUFDO0VBRXhDLEtBQUssTUFBTUssR0FBRyxJQUFJSixLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUU7SUFDM0IsSUFBSUksR0FBRyxDQUFDQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksT0FBT0wsS0FBSyxDQUFDSSxHQUFHLENBQUMsS0FBSyxVQUFVLEVBQUU7TUFDMUQsTUFBTUUsU0FBUyxHQUFHRixHQUFHLENBQUNHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsV0FBVyxDQUFDLENBQUM7TUFDNUNOLEdBQUcsQ0FBQ08sZ0JBQWdCLENBQUNILFNBQVMsRUFBRU4sS0FBSyxDQUFDSSxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDLE1BQU07TUFDSEYsR0FBRyxDQUFDUSxZQUFZLENBQUNOLEdBQUcsRUFBRUosS0FBSyxDQUFDSSxHQUFHLENBQUMsQ0FBQztJQUNyQztFQUNKO0VBRUEsTUFBTU8sWUFBWSxHQUFHVixRQUFRLENBQUNXLElBQUksQ0FBQ0MsUUFBUSxDQUFDO0VBQzVDWCxHQUFHLENBQUNZLE1BQU0sQ0FBQyxHQUFHSCxZQUFZLENBQUNJLE1BQU0sQ0FBQ0MsS0FBSyxJQUFJQSxLQUFLLEtBQUssSUFBSSxJQUFJQSxLQUFLLEtBQUtDLFNBQVMsSUFBSUQsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDO0VBRXJHLE9BQU9kLEdBQUc7QUFDZDtBQUVPLFNBQVNnQixNQUFNQSxDQUFDQyxPQUFPLEVBQUVDLFNBQVMsRUFBRTtFQUN2Q0EsU0FBUyxDQUFDQyxlQUFlLENBQUNGLE9BQU8sQ0FBQztBQUN0QyxDOzs7Ozs7Ozs7Ozs7Ozs7QUN4QnFDO0FBRXJDLElBQUlJLE1BQU0sR0FBRyxJQUFJRCw4Q0FBTSxDQUFDLENBQUM7QUFFekIsaUVBQWVDLE1BQU0sRTs7Ozs7Ozs7Ozs7Ozs7O0FDSnJCLE1BQU1DLFdBQVcsR0FBRyxFQUFFO0FBQ3RCLElBQUlDLFlBQVksR0FBRyxJQUFJO0FBRWhCLFNBQVNDLFlBQVlBLENBQUNDLFlBQVksRUFBRTtFQUN4QyxJQUFJQyxLQUFLLEdBQUdELFlBQVk7RUFDeEIsTUFBTUUsT0FBTyxHQUFHLElBQUlDLEdBQUcsQ0FBQyxDQUFDO0VBRXpCLE1BQU1DLElBQUksR0FBR0EsQ0FBQSxLQUFNO0lBQ2hCLElBQUlOLFlBQVksRUFBRTtNQUNmSSxPQUFPLENBQUNHLEdBQUcsQ0FBQ1AsWUFBWSxDQUFDO0lBQzVCO0lBQ0EsT0FBT0csS0FBSztFQUNmLENBQUM7RUFFRCxNQUFNSyxLQUFLLEdBQUlDLFFBQVEsSUFBSztJQUN6QixJQUFJLE9BQU9BLFFBQVEsS0FBSyxVQUFVLEVBQUU7TUFDakMsSUFBSUMsRUFBRSxHQUFHRCxRQUFRO01BQ2pCTixLQUFLLEdBQUdPLEVBQUUsQ0FBQ1AsS0FBSyxDQUFDO0lBQ3BCLENBQUMsTUFDSUEsS0FBSyxHQUFHTSxRQUFRO0lBQ3JCTCxPQUFPLENBQUNPLE9BQU8sQ0FBQ0MsTUFBTSxJQUFJQSxNQUFNLENBQUMsQ0FBQyxDQUFDO0VBQ3RDLENBQUM7RUFFRCxPQUFPLENBQUNOLElBQUksRUFBRUUsS0FBSyxDQUFDO0FBQ3ZCO0FBRU8sU0FBU0ssWUFBWUEsQ0FBQ0QsTUFBTSxFQUFFO0VBQ2xDYixXQUFXLENBQUNlLElBQUksQ0FBQ0YsTUFBTSxDQUFDO0VBQ3hCWixZQUFZLEdBQUdZLE1BQU07RUFDckJBLE1BQU0sQ0FBQyxDQUFDO0VBQ1JiLFdBQVcsQ0FBQ2dCLEdBQUcsQ0FBQyxDQUFDO0VBQ2pCZixZQUFZLEdBQUdELFdBQVcsQ0FBQ0EsV0FBVyxDQUFDaUIsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUk7QUFDN0QsQzs7Ozs7Ozs7Ozs7Ozs7QUNoQ08sTUFBTW5CLE1BQU0sQ0FBQztFQUNoQixDQUFDb0IsTUFBTSxHQUFHQyxNQUFNLENBQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUM7RUFDN0IsQ0FBQ0MsWUFBWSxHQUFHLEtBQUs7RUFFckJDLEVBQUVBLENBQUNDLElBQUksRUFBRUMsT0FBTyxFQUFFO0lBQ2QsSUFBSSxDQUFDLENBQUNOLE1BQU0sQ0FBQ0ssSUFBSSxDQUFDLEdBQUdDLE9BQU87SUFDNUIsT0FBTyxJQUFJO0VBQ2Y7RUFFQUMsUUFBUUEsQ0FBQ0YsSUFBSSxFQUFFO0lBQUVHLE9BQU8sR0FBRztFQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtJQUN0Q0gsSUFBSSxHQUFHQSxJQUFJLENBQUMxQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcwQyxJQUFJLEdBQUcsR0FBRyxHQUFHQSxJQUFJO0lBQy9DLE9BQU9JLFVBQVUsQ0FBQ0YsUUFBUSxDQUFDRixJQUFJLEVBQUU7TUFBRUc7SUFBUSxDQUFDLENBQUM7RUFDakQ7RUFFQUUsT0FBT0EsQ0FBQ0wsSUFBSSxHQUFHTSxRQUFRLENBQUNDLFFBQVEsRUFBRTtJQUM5QixNQUFNbkIsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDTyxNQUFNLENBQUNLLElBQUksQ0FBQztJQUU3QixJQUFJLENBQUNaLEVBQUUsRUFBRTtNQUNMLE9BQU8sS0FBSztJQUNoQjtJQUVBQSxFQUFFLENBQUM7TUFBRW9CLEdBQUcsRUFBRSxJQUFJQyxHQUFHLENBQUNILFFBQVEsQ0FBQ0ksSUFBSTtJQUFFLENBQUMsQ0FBQztJQUNuQyxPQUFPLElBQUk7RUFDZjtFQUVBQyxNQUFNQSxDQUFDQyxVQUFVLEVBQUU7SUFDZlIsVUFBVSxDQUFDMUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFHbUQsS0FBSyxJQUFLO01BQy9DLE1BQU1MLEdBQUcsR0FBRyxJQUFJQyxHQUFHLENBQUNJLEtBQUssQ0FBQ0MsV0FBVyxDQUFDTixHQUFHLENBQUM7TUFFMUNLLEtBQUssQ0FBQ0UsU0FBUyxDQUFDO1FBQ1pkLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO1VBQ1hlLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDVCxHQUFHLENBQUNELFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQ1osTUFBTSxDQUFDO1VBRXZDLE1BQU1QLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQ08sTUFBTSxDQUFDYSxHQUFHLENBQUNELFFBQVEsQ0FBQztVQUNyQyxJQUFJLENBQUNuQixFQUFFLEVBQUU7WUFDTHdCLFVBQVUsQ0FBQyxDQUFDO1lBQ1o7VUFDSjtVQUNBeEIsRUFBRSxDQUFDO1lBQUVvQjtVQUFJLENBQUMsQ0FBQztRQUNmO01BQ0osQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDVixZQUFZLEVBQUU7TUFDckIsSUFBSSxDQUFDTyxPQUFPLENBQUMsQ0FBQztNQUNkLElBQUksQ0FBQyxDQUFDUCxZQUFZLEdBQUcsSUFBSTtJQUM3QjtJQUNBLE9BQU8sSUFBSTtFQUNmO0FBQ0osQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqRGlFO0FBQ1I7QUFDRjtBQUN0QjtBQUNBO0FBQ0U7QUFDUTtBQUN1QjtBQUMvQjtBQUNjO0FBRUw7QUFFNUMsTUFBTStCLElBQUksR0FBR3pFLFFBQVEsQ0FBQzBFLGNBQWMsQ0FBQyxNQUFNLENBQUM7QUFDNUMsTUFBTUMsR0FBRyxHQUFHLElBQUlDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQztBQUNoRCxNQUFNQyxLQUFLLEdBQUcsSUFBSVAsb0RBQUssQ0FBQyxzQ0FBc0MsQ0FBQztBQUMvRCxJQUFJUSxpQkFBaUIsR0FBRyxJQUFJO0FBRTVCRCxLQUFLLENBQUNFLElBQUksQ0FBQyxDQUFDO0FBRVozRCxzRUFBTSxDQUFDdUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxNQUFNO0VBQ2pCM0MsUUFBUSxDQUFDZ0YsSUFBSSxDQUFDQyxTQUFTLEdBQUcsZUFBZTtFQUN6Q2xFLDJEQUFNLENBQUNwQixrRUFBQSxDQUFDbUUsdURBQVE7SUFBQ2EsR0FBRyxFQUFFQTtFQUFJLENBQUUsQ0FBQyxFQUFFRixJQUFJLENBQUM7QUFDeEMsQ0FBQyxDQUFDO0FBRUZyRCxzRUFBTSxDQUFDbUMsTUFBTSxDQUFDLE1BQU07RUFBRTJCLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFBQyxDQUFDLENBQUM7QUFFckNQLEdBQUcsQ0FBQ3JFLGdCQUFnQixDQUFDLE1BQU0sRUFBRzZFLEVBQUUsSUFBSyxDQUNyQyxDQUFDLENBQUM7QUFFRlIsR0FBRyxDQUFDckUsZ0JBQWdCLENBQUMsU0FBUyxFQUFHbUQsS0FBSyxJQUFLO0VBQ3ZDLE1BQU0yQixPQUFPLEdBQUdDLElBQUksQ0FBQ0MsS0FBSyxDQUFDN0IsS0FBSyxDQUFDOEIsSUFBSSxDQUFDO0VBQ3RDLFFBQVFILE9BQU8sQ0FBQ3hGLElBQUk7SUFDaEIsS0FBSyxhQUFhO0lBQ2xCLEtBQUssYUFBYTtNQUNkSSxRQUFRLENBQUNnRixJQUFJLENBQUNDLFNBQVMsR0FBRyxZQUFZO01BQ3RDLElBQUksQ0FBQ1IsSUFBSSxDQUFDZSxhQUFhLENBQUMsa0JBQWtCLENBQUMsRUFBRTtRQUN6Q3pFLDJEQUFNLENBQUNwQixrRUFBQSxDQUFDdUUsb0RBQUssTUFBRSxDQUFDLEVBQUVPLElBQUksQ0FBQztNQUMzQjtNQUNBTix1REFBUyxDQUFDO1FBQ05zQixNQUFNLEVBQUVMLE9BQU8sQ0FBQ0ssTUFBTTtRQUN0QkMsWUFBWSxFQUFFTixPQUFPLENBQUNNLFlBQVk7UUFDbENDLFdBQVcsRUFBRVAsT0FBTyxDQUFDTyxXQUFXO1FBQ2hDQyxJQUFJLEVBQUVSLE9BQU8sQ0FBQ1E7TUFDbEIsQ0FBQyxDQUFDO01BQ0Y7SUFFSixLQUFLLGNBQWM7TUFDZjVGLFFBQVEsQ0FBQ2dGLElBQUksQ0FBQ0MsU0FBUyxHQUFHLFdBQVc7TUFFckNsRSwyREFBTSxDQUFDcEIsa0VBQUEsQ0FBQ3FFLG1EQUFJO1FBQUM2QixJQUFJLEVBQUVULE9BQU8sQ0FBQ1M7TUFBSyxDQUFFLENBQUMsRUFBRXBCLElBQUksQ0FBQztNQUUxQ3FCLFVBQVUsQ0FBQyxNQUFNO1FBQ2IsTUFBTUMsYUFBYSxHQUFHL0YsUUFBUSxDQUFDMEUsY0FBYyxDQUFDLGdCQUFnQixDQUFDO1FBRS9ELElBQUlxQixhQUFhLEVBQUU7VUFDZixJQUFJakIsaUJBQWlCLEVBQUU7WUFDbkJBLGlCQUFpQixDQUFDa0IsT0FBTyxDQUFDLENBQUM7VUFDL0I7VUFFQSxNQUFNQyxXQUFXLEdBQUcsQ0FBQ2IsT0FBTyxDQUFDYyxPQUFPLElBQUksRUFBRSxFQUFFQyxJQUFJLENBQUNDLE1BQU0sSUFBSUEsTUFBTSxDQUFDQyxFQUFFLEtBQUtqQixPQUFPLENBQUNrQixZQUFZLENBQUM7VUFDOUYsSUFBSUwsV0FBVyxJQUFJQSxXQUFXLENBQUNNLFFBQVEsRUFBRTtZQUNyQ2xDLDBEQUFnQixDQUFDNEIsV0FBVyxDQUFDTSxRQUFRLENBQUM7VUFDMUM7VUFFQSxNQUFNQyxNQUFNLEdBQUcsSUFBSWhDLG9EQUFVLENBQUN1QixhQUFhLEVBQUVYLE9BQU8sQ0FBQ1MsSUFBSSxFQUFFbEIsR0FBRyxDQUFDO1VBQy9ENkIsTUFBTSxDQUFDekIsSUFBSSxDQUFDSyxPQUFPLENBQUNrQixZQUFZLEVBQUVsQixPQUFPLENBQUNjLE9BQU8sSUFBSSxFQUFFLENBQUM7VUFFeERwQixpQkFBaUIsR0FBRzBCLE1BQU07UUFDOUIsQ0FBQyxNQUFNO1VBQ0g1QyxPQUFPLENBQUM2QyxLQUFLLENBQUMsOEJBQThCLENBQUM7UUFDakQ7TUFDSixDQUFDLEVBQUUsRUFBRSxDQUFDO01BQ047SUFFSixLQUFLLFlBQVk7TUFDYnpHLFFBQVEsQ0FBQ2dGLElBQUksQ0FBQ0MsU0FBUyxHQUFHLFdBQVc7TUFDckNsRSwyREFBTSxDQUFDcEIsa0VBQUEsQ0FBQ3NFLG1EQUFJLE1BQUUsQ0FBQyxFQUFFUSxJQUFJLENBQUM7TUFDdEI7SUFFSixLQUFLLGNBQWM7TUFDZkYsNkRBQVcsQ0FBQ21DLElBQUksSUFBSSxDQUFDLEdBQUdBLElBQUksRUFBRTtRQUMxQkgsUUFBUSxFQUFFbkIsT0FBTyxDQUFDbUIsUUFBUSxJQUFJLFFBQVE7UUFDdENuQixPQUFPLEVBQUVBLE9BQU8sQ0FBQ0E7TUFDckIsQ0FBQyxDQUFDLENBQUM7TUFDSDtJQUNKLEtBQUssY0FBYztNQUNmLElBQUlOLGlCQUFpQixFQUFFO1FBQ25CQSxpQkFBaUIsQ0FBQzZCLGdCQUFnQixDQUFDdkIsT0FBTyxDQUFDd0IsT0FBTyxDQUFDO01BQ3ZEO01BQ0E7SUFDSixLQUFLLGNBQWM7TUFDZixJQUFJOUIsaUJBQWlCLEVBQUU7UUFDbkJBLGlCQUFpQixDQUFDK0IsZ0JBQWdCLENBQUN6QixPQUFPLENBQUN3QixPQUFPLENBQUM7TUFDdkQ7TUFDQTtJQUNKLEtBQUssZ0JBQWdCO01BQ2pCLElBQUk5QixpQkFBaUIsRUFBRTtRQUNuQkEsaUJBQWlCLENBQUNnQyx5QkFBeUIsQ0FBQzFCLE9BQU8sQ0FBQ3dCLE9BQU8sQ0FBQztNQUNoRTtNQUNBO0lBQ0osS0FBSyxnQkFBZ0I7TUFDakIsSUFBSTlCLGlCQUFpQixFQUFFO1FBQ25CQSxpQkFBaUIsQ0FBQ2lDLG1CQUFtQixDQUFDM0IsT0FBTyxDQUFDd0IsT0FBTyxDQUFDO01BQzFEO01BQ0E7SUFDSixLQUFLLFdBQVc7TUFDWixJQUFJOUIsaUJBQWlCLEVBQUU7UUFDbkJBLGlCQUFpQixDQUFDa0MsY0FBYyxDQUFDNUIsT0FBTyxDQUFDd0IsT0FBTyxDQUFDO01BQ3JEO01BQ0E7SUFDSixLQUFLLE9BQU87TUFDUixJQUFJNUcsUUFBUSxDQUFDZ0YsSUFBSSxDQUFDQyxTQUFTLEtBQUssZUFBZSxFQUFFO1FBQzdDbEIseURBQVEsQ0FBQ3FCLE9BQU8sQ0FBQ0EsT0FBTyxDQUFDO01BQzdCLENBQUMsTUFBTTtRQUNIRixLQUFLLENBQUNFLE9BQU8sQ0FBQ0EsT0FBTyxDQUFDO01BQzFCO01BQ0E7RUFDUjtBQUNKLENBQUMsQ0FBQztBQUVGVCxHQUFHLENBQUNyRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUcyRyxHQUFHLElBQUs7RUFDbkNyRCxPQUFPLENBQUNDLEdBQUcsQ0FBQyxPQUFPLEVBQUVvRCxHQUFHLENBQUM7QUFDN0IsQ0FBQyxDQUFDO0FBRUZ0QyxHQUFHLENBQUNyRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtFQUNoQ3NELE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUN6QixDQUFDLENBQUM7QUFFRixpRUFBZWMsR0FBRyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqSXVDO0FBQ29CO0FBQ2hEO0FBRTdCLE1BQU0sQ0FBQ3VDLFFBQVEsRUFBRTNDLFdBQVcsQ0FBQyxHQUFHaEQsd0VBQVksQ0FBQyxFQUFFLENBQUM7QUFDekI7QUFFdkIsU0FBUzRGLFdBQVdBLENBQUEsRUFBRztFQUNuQixNQUFNQyxpQkFBaUIsR0FBR3pILGtFQUFBO0lBQUswSCxLQUFLLEVBQUM7RUFBVSxDQUFNLENBQUM7RUFFdERsRix3RUFBWSxDQUFDLE1BQU07SUFDZixNQUFNbUYsSUFBSSxHQUFHSixRQUFRLENBQUMsQ0FBQztJQUN2QkUsaUJBQWlCLENBQUNHLFNBQVMsR0FBRyxFQUFFO0lBRWhDLEtBQUssSUFBSUMsR0FBRyxJQUFJRixJQUFJLEVBQUU7TUFDbEIsTUFBTUcsQ0FBQyxHQUFHekgsUUFBUSxDQUFDTCxhQUFhLENBQUMsR0FBRyxDQUFDO01BQ3JDLElBQUksT0FBTzZILEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFDekJDLENBQUMsQ0FBQ0MsV0FBVyxHQUFHRixHQUFHO01BQ3ZCLENBQUMsTUFBTTtRQUNIQyxDQUFDLENBQUNDLFdBQVcsR0FBRyxHQUFHRixHQUFHLENBQUNqQixRQUFRLEtBQUtpQixHQUFHLENBQUNwQyxPQUFPLEVBQUU7TUFDckQ7TUFDQWdDLGlCQUFpQixDQUFDTyxXQUFXLENBQUNGLENBQUMsQ0FBQztNQUNoQyxJQUFJTCxpQkFBaUIsQ0FBQ3RILFFBQVEsQ0FBQ3dDLE1BQU0sR0FBRyxFQUFFLEVBQUU7UUFDeEM4RSxpQkFBaUIsQ0FBQ1EsV0FBVyxDQUFDUixpQkFBaUIsQ0FBQ1MsaUJBQWlCLENBQUM7UUFDbEVQLElBQUksQ0FBQ1EsT0FBTyxDQUFDLENBQUM7TUFDbEI7TUFBQztJQUVMO0lBQUM7RUFDTCxDQUFDLENBQUM7RUFFRixTQUFTQyxnQkFBZ0JBLENBQUNDLENBQUMsRUFBRTtJQUN6QkEsQ0FBQyxDQUFDQyxjQUFjLENBQUMsQ0FBQztJQUVsQixJQUFJQyxRQUFRLEdBQUcsSUFBSUMsUUFBUSxDQUFDSCxDQUFDLENBQUNJLE1BQU0sQ0FBQztJQUNyQyxJQUFJaEQsT0FBTyxHQUFHOEMsUUFBUSxDQUFDRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUNDLElBQUksQ0FBQyxDQUFDO0lBRTVDLElBQUksQ0FBQ2xELE9BQU8sSUFBSUEsT0FBTyxDQUFDOUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtNQUNqQzBGLENBQUMsQ0FBQ0ksTUFBTSxDQUFDRyxLQUFLLENBQUMsQ0FBQztNQUNoQjtJQUNKO0lBQUM7SUFFRDVELGdEQUFHLENBQUM2RCxJQUFJLENBQUNuRCxJQUFJLENBQUNvRCxTQUFTLENBQUM7TUFDcEI3SSxJQUFJLEVBQUUsY0FBYztNQUNwQndGLE9BQU8sRUFBRUE7SUFDYixDQUFDLENBQUMsQ0FBQztJQUNINEMsQ0FBQyxDQUFDSSxNQUFNLENBQUNHLEtBQUssQ0FBQyxDQUFDO0VBQ3BCO0VBRUEsT0FDSTVJLGtFQUFBO0lBQUswSCxLQUFLLEVBQUMsTUFBTTtJQUFDcUIsUUFBUSxFQUFFWDtFQUFpQixHQUN4Q1gsaUJBQWlCLEVBQ2xCekgsa0VBQUEsZUFDSUEsa0VBQUE7SUFBT0MsSUFBSSxFQUFDLE1BQU07SUFBQytJLElBQUksRUFBQyxTQUFTO0lBQUNDLFdBQVcsRUFBQywrQkFBK0I7SUFBQ0MsU0FBUyxFQUFDO0VBQUksQ0FBQyxDQUFDLEVBQzlGbEosa0VBQUE7SUFBUUMsSUFBSSxFQUFDO0VBQVEsR0FBQyxNQUFZLENBQ2hDLENBQ0wsQ0FBQztBQUVkO0FBRUEsaUVBQWV1SCxXQUFXLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRDFCOztBQUVPLE1BQU0yQixpQkFBaUIsR0FBR0EsQ0FBQ0MsRUFBRSxFQUFFQyxFQUFFLEVBQUVDLFFBQVEsR0FBRyxFQUFFLE1BQU07RUFDekRDLEtBQUssRUFBRUgsRUFBRTtFQUNUSSxLQUFLLEVBQUVILEVBQUU7RUFDVEksQ0FBQyxFQUFFTCxFQUFFLEdBQUdFLFFBQVE7RUFDaEJJLENBQUMsRUFBRUwsRUFBRSxHQUFHQyxRQUFRO0VBQ2hCSyxPQUFPLEVBQUVQLEVBQUUsR0FBR0UsUUFBUTtFQUN0Qk0sT0FBTyxFQUFFUCxFQUFFLEdBQUdDO0FBQ2xCLENBQUMsQ0FBQztBQUVLLE1BQU1PLGlCQUFpQixHQUFHQSxDQUFDQyxTQUFTLEdBQUcsR0FBRyxNQUFNO0VBQ25EQSxTQUFTLEVBQUVBLFNBQVM7RUFDcEJDLEtBQUssRUFBRUQsU0FBUztFQUNoQkUsVUFBVSxFQUFFLENBQUM7RUFDYkMsdUJBQXVCLEVBQUUsQ0FBQztFQUMxQkMsUUFBUSxFQUFFLEtBQUs7RUFDZkMsU0FBUyxFQUFFO0FBQ2YsQ0FBQyxDQUFDO0FBRUssTUFBTUMsY0FBYyxHQUFHQSxDQUFBLE1BQU87RUFDakNDLFVBQVUsRUFBRTtBQUNoQixDQUFDLENBQUM7QUFFSyxNQUFNQyxtQkFBbUIsR0FBR0EsQ0FBQ0MsRUFBRSxFQUFFQyxVQUFVLEdBQUcsRUFBRSxFQUFFQyxXQUFXLEdBQUcsRUFBRSxFQUFFQyxXQUFXLEdBQUcsQ0FBQyxFQUFFQyxHQUFHLEdBQUcsRUFBRSxNQUFNO0VBQ3RHSixFQUFFLEVBQUVBLEVBQUU7RUFDTkMsVUFBVSxFQUFFQSxVQUFVO0VBQ3RCQyxXQUFXLEVBQUVBLFdBQVc7RUFDeEJHLFlBQVksRUFBRSxDQUFDO0VBQ2ZGLFdBQVcsRUFBRUEsV0FBVztFQUN4QkcsU0FBUyxFQUFFLENBQUM7RUFDWkMsVUFBVSxFQUFFLENBQUM7RUFDYkgsR0FBRyxFQUFFQSxHQUFHO0VBQ1JJLE9BQU8sRUFBRSxDQUFDO0VBQ1ZDLGFBQWEsRUFBRSxDQUFDO0VBQ2hCQyxHQUFHLEVBQUUsQ0FBQztFQUNOQyxLQUFLLEVBQUUsTUFBTTtFQUNiQyxTQUFTLEVBQUU7QUFDZixDQUFDLENBQUM7QUFFSyxNQUFNQyxlQUFlLEdBQUdBLENBQUMxRSxFQUFFLEVBQUUyRSxRQUFRLEVBQUVDLE9BQU8sR0FBRyxLQUFLLE1BQU07RUFDL0Q1RSxFQUFFLEVBQUVBLEVBQUU7RUFDTjJFLFFBQVEsRUFBRUEsUUFBUTtFQUNsQkMsT0FBTyxFQUFFQTtBQUNiLENBQUMsQ0FBQztBQUVLLE1BQU1DLGFBQWEsR0FBR0EsQ0FBQ0MsT0FBTyxFQUFFQyxLQUFLLEdBQUcsSUFBSSxFQUFFQyxLQUFLLEdBQUcsQ0FBQyxNQUFNO0VBQ2hFRixPQUFPLEVBQUVBLE9BQU87RUFDaEJDLEtBQUssRUFBRUEsS0FBSztFQUNaQyxLQUFLLEVBQUVBLEtBQUs7RUFDWkMsUUFBUSxFQUFFO0FBQ2QsQ0FBQyxDQUFDO0FBRUssTUFBTUMsa0JBQWtCLEdBQUdBLENBQUNDLFFBQVEsR0FBRyxHQUFHLE1BQU07RUFDbkRBLFFBQVEsRUFBRUE7QUFDZCxDQUFDLENBQUM7QUFFSyxNQUFNQyxnQkFBZ0IsR0FBSTdMLElBQUksS0FBTTtFQUN2Q0EsSUFBSSxFQUFFQSxJQUFJO0VBQ1Y4TCxRQUFRLEVBQUU7QUFDZCxDQUFDLENBQUM7QUFFSyxNQUFNQyxpQkFBaUIsR0FBR0EsQ0FBQSxNQUFPO0VBQ3BDQyxTQUFTLEVBQUUsS0FBSztFQUNoQkMsU0FBUyxFQUFFLEtBQUs7RUFDaEJDLFNBQVMsRUFBRSxLQUFLO0VBQ2hCQyxjQUFjLEVBQUUsQ0FBQztFQUNqQkMsS0FBSyxFQUFFO0lBQ0hDLEdBQUcsRUFBRSxDQUFDO0lBQ05DLE9BQU8sRUFBRSxDQUFDO0lBQ1ZiLEtBQUssRUFBRTtFQUNYO0FBQ0osQ0FBQyxDQUFDLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEVpQztBQVFWO0FBRW9DO0FBQ0o7QUFDSjtBQUN1QztBQUNWO0FBRWxGLE1BQU0wQixjQUFjLEdBQUcsRUFBRTtBQUN6QixNQUFNQyxXQUFXLEdBQUcsRUFBRTtBQUN0QixNQUFNQyxjQUFjLEdBQUc7RUFDbkJDLEdBQUcsRUFBRTtJQUFFQyxFQUFFLEVBQUUsRUFBRTtJQUFFQyxJQUFJLEVBQUUsRUFBRTtJQUFFQyxJQUFJLEVBQUUsRUFBRTtJQUFFQyxLQUFLLEVBQUU7RUFBRyxDQUFDO0VBQzlDQyxJQUFJLEVBQUU7SUFBRUosRUFBRSxFQUFFLEVBQUU7SUFBRUMsSUFBSSxFQUFFLEVBQUU7SUFBRUMsSUFBSSxFQUFFLEVBQUU7SUFBRUMsS0FBSyxFQUFFO0VBQUc7QUFDbEQsQ0FBQztBQUVNLE1BQU05SSxVQUFVLENBQUM7RUFDcEJnSixXQUFXQSxDQUFDQyxlQUFlLEVBQUVDLE9BQU8sRUFBRUMsTUFBTSxFQUFFO0lBQzFDLElBQUksQ0FBQzFNLFNBQVMsR0FBR3dNLGVBQWU7SUFDaEMsSUFBSSxDQUFDQyxPQUFPLEdBQUdBLE9BQU87SUFDdEIsSUFBSSxDQUFDQyxNQUFNLEdBQUdBLE1BQU07SUFDcEIsSUFBSSxDQUFDQyxLQUFLLEdBQUcsSUFBSXpCLDRDQUFLLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUMwQixpQkFBaUIsR0FBRyxJQUFJO0lBQzdCLElBQUksQ0FBQ0MsY0FBYyxHQUFHLElBQUlDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLElBQUksQ0FBQ0MsUUFBUSxHQUFHLENBQUM7SUFDakIsSUFBSSxDQUFDQyxvQkFBb0IsR0FBRyxJQUFJO0lBQ2hDLElBQUksQ0FBQ0MsY0FBYyxHQUFHLElBQUk7SUFDMUIsSUFBSSxDQUFDQyxPQUFPLEdBQUcsS0FBSztJQUNwQixJQUFJLENBQUNDLGVBQWUsR0FBRyxJQUFJek0sR0FBRyxDQUFDLENBQUM7RUFDcEM7RUFFQW9ELElBQUlBLENBQUNzSixhQUFhLEVBQUVDLFVBQVUsRUFBRTtJQUM1QixNQUFNQyx1QkFBdUIsR0FBR0MsTUFBTSxDQUFDSCxhQUFhLENBQUM7SUFFckRDLFVBQVUsQ0FBQ3JNLE9BQU8sQ0FBQ3dNLEtBQUssSUFBSTtNQUN4QixNQUFNQyxRQUFRLEdBQUdGLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDcEksRUFBRSxDQUFDO01BQ2pDLE1BQU1zSSxZQUFZLEdBQUcsSUFBSSxDQUFDZixLQUFLLENBQUNnQixZQUFZLENBQUMsQ0FBQztNQUM5QyxNQUFNQyxTQUFTLEdBQUc3TyxRQUFRLENBQUNMLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDL0MsTUFBTW1QLEtBQUssR0FBR0wsS0FBSyxDQUFDSyxLQUFLLElBQUksT0FBTztNQUVwQ0QsU0FBUyxDQUFDNUosU0FBUyxHQUFHLGlCQUFpQjZKLEtBQUssRUFBRTtNQUM5Q0QsU0FBUyxDQUFDRSxLQUFLLENBQUNDLFFBQVEsR0FBRyxVQUFVO01BQ3JDSCxTQUFTLENBQUNFLEtBQUssQ0FBQ0UsTUFBTSxHQUFHLElBQUk7TUFDN0JKLFNBQVMsQ0FBQ0UsS0FBSyxDQUFDRyxVQUFVLEdBQUcsV0FBVztNQUN4Q0wsU0FBUyxDQUFDRSxLQUFLLENBQUNJLEtBQUssR0FBRyxHQUFHckMsa0RBQVMsSUFBSTtNQUN4QytCLFNBQVMsQ0FBQ0UsS0FBSyxDQUFDSyxNQUFNLEdBQUcsR0FBR3RDLGtEQUFTLElBQUk7TUFDekMrQixTQUFTLENBQUNFLEtBQUssQ0FBQ00sY0FBYyxHQUFHLEdBQUd0QyxjQUFjLEdBQUdELGtEQUFTLE1BQU1FLFdBQVcsR0FBR0Ysa0RBQVMsSUFBSTtNQUMvRixJQUFJLENBQUM3TCxTQUFTLENBQUMwRyxXQUFXLENBQUNrSCxTQUFTLENBQUM7TUFFckMsTUFBTVMsRUFBRSxHQUFHYixLQUFLLENBQUNyRixDQUFDLElBQUksQ0FBQztNQUN2QixNQUFNbUcsRUFBRSxHQUFHZCxLQUFLLENBQUNwRixDQUFDLElBQUksQ0FBQztNQUV2QixJQUFJLENBQUN1RSxLQUFLLENBQUM0QixZQUFZLENBQUNiLFlBQVksRUFBRSxVQUFVLEVBQUU3RixpRUFBaUIsQ0FBQ3dHLEVBQUUsRUFBRUMsRUFBRSxFQUFFekMsa0RBQVMsQ0FBQyxDQUFDO01BQ3ZGLElBQUksQ0FBQ2MsS0FBSyxDQUFDNEIsWUFBWSxDQUFDYixZQUFZLEVBQUUsVUFBVSxFQUFFbkYsaUVBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDekUsSUFBSSxDQUFDb0UsS0FBSyxDQUFDNEIsWUFBWSxDQUFDYixZQUFZLEVBQUUsWUFBWSxFQUFFMUUsbUVBQW1CLENBQUM0RSxTQUFTLEVBQUUvQixrREFBUyxFQUFFQSxrREFBUyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQzlHLENBQUM7TUFFRCxNQUFNN0IsT0FBTyxHQUFHeUQsUUFBUSxLQUFLSCx1QkFBdUI7TUFDcEQsTUFBTWtCLFVBQVUsR0FBRzFFLCtEQUFlLENBQUMyRCxRQUFRLEVBQUVJLEtBQUssRUFBRTdELE9BQU8sQ0FBQztNQUM1RHdFLFVBQVUsQ0FBQ0MsS0FBSyxHQUFHakIsS0FBSyxDQUFDaUIsS0FBSyxJQUFJLENBQUM7TUFDbkNELFVBQVUsQ0FBQ0UsUUFBUSxHQUFHbEIsS0FBSyxDQUFDa0IsUUFBUSxJQUFJLENBQUM7TUFDekNGLFVBQVUsQ0FBQ0csU0FBUyxHQUFHbkIsS0FBSyxDQUFDbUIsU0FBUyxJQUFJLENBQUM7TUFDM0NILFVBQVUsQ0FBQ0ksS0FBSyxHQUFHcEIsS0FBSyxDQUFDb0IsS0FBSyxJQUFJLElBQUk7TUFDdEMsSUFBSSxDQUFDakMsS0FBSyxDQUFDNEIsWUFBWSxDQUFDYixZQUFZLEVBQUUsUUFBUSxFQUFFYyxVQUFVLENBQUM7TUFDM0QsSUFBSSxDQUFDM0IsY0FBYyxDQUFDZ0MsR0FBRyxDQUFDcEIsUUFBUSxFQUFFQyxZQUFZLENBQUM7TUFFL0MsSUFBSTFELE9BQU8sRUFBRTtRQUNULElBQUksQ0FBQzRDLGlCQUFpQixHQUFHYyxZQUFZO1FBQ3JDLElBQUksQ0FBQ2YsS0FBSyxDQUFDNEIsWUFBWSxDQUFDYixZQUFZLEVBQUUsT0FBTyxFQUFFNUUsOERBQWMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDZ0csY0FBYyxDQUFDcEIsWUFBWSxDQUFDO1FBQ2pDLElBQUksQ0FBQ3FCLFVBQVUsQ0FBQyxDQUFDO01BQ3JCO0lBQ0osQ0FBQyxDQUFDO0lBRUYsSUFBSSxJQUFJLENBQUNuQyxpQkFBaUIsS0FBSyxJQUFJLEVBQUU7TUFDakNqSyxPQUFPLENBQUNxTSxJQUFJLENBQUMseUNBQXlDLEVBQUU7UUFDcEQ1QixhQUFhO1FBQ2JuSSxPQUFPLEVBQUVvSSxVQUFVLENBQUM0QixHQUFHLENBQUM5SixNQUFNLElBQUlBLE1BQU0sQ0FBQ0MsRUFBRTtNQUMvQyxDQUFDLENBQUM7SUFDTjtJQUVBLElBQUksQ0FBQzhKLGVBQWUsQ0FBQyxDQUFDO0lBRXRCLElBQUksQ0FBQ2hDLE9BQU8sR0FBRyxJQUFJO0lBQ25CLElBQUksQ0FBQ0gsUUFBUSxHQUFHb0MsV0FBVyxDQUFDQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxJQUFJLENBQUNuQyxjQUFjLEdBQUdvQyxxQkFBcUIsQ0FBRUQsR0FBRyxJQUFLLElBQUksQ0FBQ0UsUUFBUSxDQUFDRixHQUFHLENBQUMsQ0FBQztFQUM1RTtFQUVBTCxVQUFVQSxDQUFBLEVBQUc7SUFDVCxNQUFNUSxLQUFLLEdBQUcsSUFBSSxDQUFDNUMsS0FBSyxDQUFDNkMsWUFBWSxDQUFDLElBQUksQ0FBQzVDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQztJQUN0RSxJQUFJLENBQUMyQyxLQUFLLEVBQUU7SUFFWixNQUFNRSxlQUFlLEdBQUl6USxHQUFHLElBQUs7TUFDN0IsSUFBSUEsR0FBRyxLQUFLLFNBQVMsSUFBSUEsR0FBRyxLQUFLLEdBQUcsSUFBSUEsR0FBRyxLQUFLLEdBQUcsSUFBSUEsR0FBRyxLQUFLLEdBQUcsRUFBRSxPQUFPLElBQUk7TUFDL0UsSUFBSUEsR0FBRyxLQUFLLFdBQVcsSUFBSUEsR0FBRyxLQUFLLEdBQUcsSUFBSUEsR0FBRyxLQUFLLEdBQUcsRUFBRSxPQUFPLE1BQU07TUFDcEUsSUFBSUEsR0FBRyxLQUFLLFdBQVcsSUFBSUEsR0FBRyxLQUFLLEdBQUcsSUFBSUEsR0FBRyxLQUFLLEdBQUcsSUFBSUEsR0FBRyxLQUFLLEdBQUcsRUFBRSxPQUFPLE1BQU07TUFDbkYsSUFBSUEsR0FBRyxLQUFLLFlBQVksSUFBSUEsR0FBRyxLQUFLLEdBQUcsSUFBSUEsR0FBRyxLQUFLLEdBQUcsRUFBRSxPQUFPLE9BQU87TUFDdEUsT0FBTyxJQUFJO0lBQ2YsQ0FBQztJQUVELE1BQU0wUSxhQUFhLEdBQUkzSSxDQUFDLElBQUs7TUFDekIsTUFBTTRJLEdBQUcsR0FBR0YsZUFBZSxDQUFDMUksQ0FBQyxDQUFDL0gsR0FBRyxDQUFDO01BQ2xDLElBQUkyUSxHQUFHLElBQUlKLEtBQUssRUFBRTtRQUNkeEksQ0FBQyxDQUFDQyxjQUFjLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUN1SSxLQUFLLENBQUN4RyxVQUFVLENBQUM2RyxRQUFRLENBQUNELEdBQUcsQ0FBQyxFQUFFO1VBQ2pDSixLQUFLLENBQUN4RyxVQUFVLENBQUNsQyxPQUFPLENBQUM4SSxHQUFHLENBQUM7UUFDakM7TUFDSjtNQUVBLElBQUk1SSxDQUFDLENBQUMvSCxHQUFHLEtBQUssR0FBRyxJQUFJK0gsQ0FBQyxDQUFDOEksSUFBSSxLQUFLLE9BQU8sRUFBRTtRQUNyQzlJLENBQUMsQ0FBQ0MsY0FBYyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDOEksUUFBUSxDQUFDLENBQUM7TUFDbkI7SUFDSixDQUFDO0lBRUQsTUFBTUMsV0FBVyxHQUFJaEosQ0FBQyxJQUFLO01BQ3ZCLE1BQU00SSxHQUFHLEdBQUdGLGVBQWUsQ0FBQzFJLENBQUMsQ0FBQy9ILEdBQUcsQ0FBQztNQUNsQyxJQUFJMlEsR0FBRyxJQUFJSixLQUFLLEVBQUU7UUFDZEEsS0FBSyxDQUFDeEcsVUFBVSxHQUFHd0csS0FBSyxDQUFDeEcsVUFBVSxDQUFDcEosTUFBTSxDQUFDcVEsQ0FBQyxJQUFJQSxDQUFDLEtBQUtMLEdBQUcsQ0FBQztNQUM5RDtJQUNKLENBQUM7SUFFRE0sTUFBTSxDQUFDNVEsZ0JBQWdCLENBQUMsU0FBUyxFQUFFcVEsYUFBYSxDQUFDO0lBQ2pETyxNQUFNLENBQUM1USxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUwUSxXQUFXLENBQUM7SUFFN0MsSUFBSSxDQUFDL0Msb0JBQW9CLEdBQUcsTUFBTTtNQUM5QmlELE1BQU0sQ0FBQ0MsbUJBQW1CLENBQUMsU0FBUyxFQUFFUixhQUFhLENBQUM7TUFDcERPLE1BQU0sQ0FBQ0MsbUJBQW1CLENBQUMsT0FBTyxFQUFFSCxXQUFXLENBQUM7SUFDcEQsQ0FBQztFQUNMO0VBRUFELFFBQVFBLENBQUEsRUFBRztJQUNQLElBQUksSUFBSSxDQUFDbEQsaUJBQWlCLEtBQUssSUFBSSxFQUFFO0lBRXJDLE1BQU16SCxNQUFNLEdBQUcsSUFBSSxDQUFDd0gsS0FBSyxDQUFDNkMsWUFBWSxDQUFDLElBQUksQ0FBQzVDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQztJQUV4RSxNQUFNdUQsWUFBWSxHQUFHLElBQUksQ0FBQ3hELEtBQUssQ0FBQ3lELEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUN6USxNQUFNLENBQUMwUSxPQUFPLElBQUk7TUFDeEUsT0FBTyxJQUFJLENBQUMxRCxLQUFLLENBQUM2QyxZQUFZLENBQUNhLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQ25HLE9BQU8sS0FBSy9FLE1BQU0sQ0FBQ0MsRUFBRTtJQUN6RSxDQUFDLENBQUM7SUFFRixJQUFJK0ssWUFBWSxDQUFDOU8sTUFBTSxJQUFJOEQsTUFBTSxDQUFDdUosUUFBUSxFQUFFO0lBRTVDLElBQUksSUFBSSxDQUFDaEMsTUFBTSxJQUFJLElBQUksQ0FBQ0EsTUFBTSxDQUFDNEQsVUFBVSxLQUFLM00sU0FBUyxDQUFDNE0sSUFBSSxFQUFFO01BQzFELElBQUksQ0FBQzdELE1BQU0sQ0FBQ25GLElBQUksQ0FBQ25ELElBQUksQ0FBQ29ELFNBQVMsQ0FBQztRQUM1QjdJLElBQUksRUFBRSxXQUFXO1FBQ2pCZ0gsT0FBTyxFQUFFLENBQUM7TUFDZCxDQUFDLENBQUMsQ0FBQztJQUNQO0VBQ0o7RUFFQTZLLFVBQVVBLENBQUN0RyxPQUFPLEVBQUVqQyxLQUFLLEVBQUVDLEtBQUssRUFBRWtDLEtBQUssRUFBRXFHLE1BQU0sR0FBRyxJQUFJLEVBQUU7SUFDcEQsTUFBTUMsTUFBTSxHQUFHLElBQUksQ0FBQy9ELEtBQUssQ0FBQ3lELEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUNPLElBQUksQ0FBQ0MsTUFBTSxJQUFJO01BQy9ELE1BQU1DLEdBQUcsR0FBRyxJQUFJLENBQUNsRSxLQUFLLENBQUM2QyxZQUFZLENBQUNvQixNQUFNLEVBQUUsVUFBVSxDQUFDO01BQ3ZELE1BQU1FLElBQUksR0FBRyxJQUFJLENBQUNuRSxLQUFLLENBQUM2QyxZQUFZLENBQUNvQixNQUFNLEVBQUUsTUFBTSxDQUFDO01BQ3BELE9BQVFILE1BQU0sSUFBSUssSUFBSSxDQUFDTCxNQUFNLEtBQUtBLE1BQU0sSUFDbkNLLElBQUksQ0FBQzVHLE9BQU8sS0FBS0EsT0FBTyxJQUFJMkcsR0FBRyxDQUFDNUksS0FBSyxLQUFLQSxLQUFLLElBQUk0SSxHQUFHLENBQUMzSSxLQUFLLEtBQUtBLEtBQU07SUFDaEYsQ0FBQyxDQUFDO0lBRUYsSUFBSXdJLE1BQU0sRUFBRSxPQUFPLEtBQUs7SUFFeEIsTUFBTUssVUFBVSxHQUFHLElBQUksQ0FBQ3BFLEtBQUssQ0FBQ2dCLFlBQVksQ0FBQyxDQUFDO0lBQzVDLE1BQU1xRCxPQUFPLEdBQUdqUyxRQUFRLENBQUNMLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDN0NzUyxPQUFPLENBQUNoTixTQUFTLEdBQUcsTUFBTTtJQUMxQmdOLE9BQU8sQ0FBQ2xELEtBQUssQ0FBQ0MsUUFBUSxHQUFHLFVBQVU7SUFDbkNpRCxPQUFPLENBQUNsRCxLQUFLLENBQUNJLEtBQUssR0FBRyxHQUFHckMsa0RBQVMsSUFBSTtJQUN0Q21GLE9BQU8sQ0FBQ2xELEtBQUssQ0FBQ0ssTUFBTSxHQUFHLEdBQUd0QyxrREFBUyxJQUFJO0lBQ3ZDbUYsT0FBTyxDQUFDbEQsS0FBSyxDQUFDM0IsSUFBSSxHQUFHLEdBQUdsRSxLQUFLLEdBQUc0RCxrREFBUyxJQUFJO0lBQzdDbUYsT0FBTyxDQUFDbEQsS0FBSyxDQUFDbUQsR0FBRyxHQUFHLEdBQUcvSSxLQUFLLEdBQUcyRCxrREFBUyxJQUFJO0lBQzVDbUYsT0FBTyxDQUFDbEQsS0FBSyxDQUFDRSxNQUFNLEdBQUcsR0FBRztJQUMxQixJQUFJLENBQUNoTyxTQUFTLENBQUMwRyxXQUFXLENBQUNzSyxPQUFPLENBQUM7SUFFbkMsSUFBSSxDQUFDckUsS0FBSyxDQUFDNEIsWUFBWSxDQUFDd0MsVUFBVSxFQUFFLFVBQVUsRUFBRTtNQUFFOUksS0FBSztNQUFFQztJQUFNLENBQUMsQ0FBQztJQUVqRSxNQUFNZ0osUUFBUSxHQUFHakgsNkRBQWEsQ0FBQ0MsT0FBTyxFQUFFLElBQUksRUFBRUUsS0FBSyxDQUFDO0lBQ3BEOEcsUUFBUSxDQUFDVCxNQUFNLEdBQUdBLE1BQU07SUFDeEJTLFFBQVEsQ0FBQ2pJLEVBQUUsR0FBRytILE9BQU87SUFDckIsSUFBSSxDQUFDckUsS0FBSyxDQUFDNEIsWUFBWSxDQUFDd0MsVUFBVSxFQUFFLE1BQU0sRUFBRUcsUUFBUSxDQUFDO0lBQ3JELE9BQU8sSUFBSTtFQUNmO0VBRUF4TCxnQkFBZ0JBLENBQUNDLE9BQU8sRUFBRTtJQUN0QixJQUFJLENBQUNBLE9BQU8sSUFBSSxDQUFDQSxPQUFPLENBQUNQLEVBQUUsRUFBRTtNQUN6QnpDLE9BQU8sQ0FBQ3FNLElBQUksQ0FBQyxxQ0FBcUMsRUFBRXJKLE9BQU8sQ0FBQztNQUM1RDtJQUNKO0lBRUEsSUFBSWlMLE1BQU0sR0FBRyxJQUFJLENBQUMvRCxjQUFjLENBQUN6RixHQUFHLENBQUNtRyxNQUFNLENBQUM1SCxPQUFPLENBQUNQLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELElBQUl3TCxNQUFNLEtBQUsvUSxTQUFTLEVBQUU7TUFDdEI4QyxPQUFPLENBQUNxTSxJQUFJLENBQUMsa0RBQWtEckosT0FBTyxDQUFDUCxFQUFFLHNCQUFzQixFQUFFK0wsS0FBSyxDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDdkUsY0FBYyxDQUFDd0UsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3hJO0lBQ0o7SUFFQSxJQUFJVCxNQUFNLEtBQUssSUFBSSxDQUFDaEUsaUJBQWlCLElBQUksQ0FBQ2pILE9BQU8sQ0FBQzJMLFNBQVMsRUFBRTtNQUN6RDtJQUNKO0lBRUEsTUFBTVQsR0FBRyxHQUFHLElBQUksQ0FBQ2xFLEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDdkQsTUFBTVcsR0FBRyxHQUFHLElBQUksQ0FBQzVFLEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDdkQsTUFBTVksVUFBVSxHQUFHLElBQUksQ0FBQzdFLEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxZQUFZLENBQUM7SUFFaEUsSUFBSSxDQUFDQyxHQUFHLElBQUksQ0FBQ1UsR0FBRyxJQUFJLENBQUNDLFVBQVUsRUFBRTtNQUM3QjdPLE9BQU8sQ0FBQ3FNLElBQUksQ0FBQyxvREFBb0RySixPQUFPLENBQUNQLEVBQUUsR0FBRyxFQUFFO1FBQUV5TCxHQUFHLEVBQUUsQ0FBQyxDQUFDQSxHQUFHO1FBQUVVLEdBQUcsRUFBRSxDQUFDLENBQUNBLEdBQUc7UUFBRUMsVUFBVSxFQUFFLENBQUMsQ0FBQ0E7TUFBVyxDQUFDLENBQUM7TUFDckk7SUFDSjtJQUVBRCxHQUFHLENBQUMxSSxTQUFTLEdBQUdsRCxPQUFPLENBQUNrRCxTQUFTLElBQUkwSSxHQUFHLENBQUMxSSxTQUFTO0lBQ2xEMEksR0FBRyxDQUFDM0ksUUFBUSxHQUFHakQsT0FBTyxDQUFDaUQsUUFBUTtJQUMvQmlJLEdBQUcsQ0FBQzVJLEtBQUssR0FBR3RDLE9BQU8sQ0FBQ3NDLEtBQUs7SUFDekI0SSxHQUFHLENBQUMzSSxLQUFLLEdBQUd2QyxPQUFPLENBQUN1QyxLQUFLO0lBQ3pCMkksR0FBRyxDQUFDeEksT0FBTyxHQUFHMUMsT0FBTyxDQUFDd0MsQ0FBQztJQUN2QjBJLEdBQUcsQ0FBQ3ZJLE9BQU8sR0FBRzNDLE9BQU8sQ0FBQ3lDLENBQUM7SUFFdkIsSUFBSXpDLE9BQU8sQ0FBQzJMLFNBQVMsRUFBRTtNQUNuQlQsR0FBRyxDQUFDMUksQ0FBQyxHQUFHeEMsT0FBTyxDQUFDd0MsQ0FBQztNQUNqQjBJLEdBQUcsQ0FBQ3pJLENBQUMsR0FBR3pDLE9BQU8sQ0FBQ3lDLENBQUM7SUFDckI7SUFFQW9KLFVBQVUsQ0FBQzVILEtBQUssR0FBR2pFLE9BQU8sQ0FBQ2lFLEtBQUssS0FBS2pFLE9BQU8sQ0FBQ2lELFFBQVEsR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDO0VBQzNFO0VBRUFoRCxnQkFBZ0JBLENBQUNELE9BQU8sRUFBRTtJQUN0QixJQUFJLENBQUNBLE9BQU8sSUFBSSxDQUFDQSxPQUFPLENBQUNQLEVBQUUsRUFBRTtJQUM3QixJQUFJLENBQUNvTCxVQUFVLENBQUM3SyxPQUFPLENBQUNQLEVBQUUsRUFBRU8sT0FBTyxDQUFDd0MsQ0FBQyxFQUFFeEMsT0FBTyxDQUFDeUMsQ0FBQyxFQUFFekMsT0FBTyxDQUFDeUUsS0FBSyxJQUFJLENBQUMsRUFBRXpFLE9BQU8sQ0FBQzhLLE1BQU0sQ0FBQztFQUN6RjtFQUVBNUsseUJBQXlCQSxDQUFDRixPQUFPLEVBQUU7SUFDL0IsSUFBSSxDQUFDQSxPQUFPLElBQUlBLE9BQU8sQ0FBQ3dDLENBQUMsS0FBS3RJLFNBQVMsSUFBSThGLE9BQU8sQ0FBQ3lDLENBQUMsS0FBS3ZJLFNBQVMsRUFBRTtJQUVwRSxJQUFJLENBQUM0UixlQUFlLENBQUM5TCxPQUFPLENBQUN3QyxDQUFDLEVBQUV4QyxPQUFPLENBQUN5QyxDQUFDLENBQUM7SUFFMUMsTUFBTXdJLE1BQU0sR0FBRyxJQUFJLENBQUMvRCxjQUFjLENBQUN6RixHQUFHLENBQUNtRyxNQUFNLENBQUM1SCxPQUFPLENBQUNQLEVBQUUsQ0FBQyxDQUFDO0lBQzFELElBQUl3TCxNQUFNLEtBQUsvUSxTQUFTLEVBQUU7SUFFMUIsSUFBSThGLE9BQU8sQ0FBQytMLEtBQUssRUFBRTtNQUNmLElBQUksQ0FBQ0MsZ0JBQWdCLENBQUNmLE1BQU0sRUFBRWpMLE9BQU8sQ0FBQytMLEtBQUssQ0FBQztJQUNoRCxDQUFDLE1BQU07TUFDSCxJQUFJLENBQUNFLFlBQVksQ0FBQ2hCLE1BQU0sRUFBRWpMLE9BQU8sQ0FBQ2hILElBQUksQ0FBQztJQUMzQztJQUVBLElBQUlpUyxNQUFNLEtBQUssSUFBSSxDQUFDaEUsaUJBQWlCLEVBQUU7TUFDbkMsSUFBSSxDQUFDa0MsY0FBYyxDQUFDOEIsTUFBTSxDQUFDO0lBQy9CO0VBQ0o7RUFFQWEsZUFBZUEsQ0FBQ3hKLEtBQUssRUFBRUMsS0FBSyxFQUFFO0lBQzFCLElBQUksQ0FBQ2lGLGVBQWUsQ0FBQ3ZNLEdBQUcsQ0FBQyxHQUFHcUgsS0FBSyxJQUFJQyxLQUFLLEVBQUUsQ0FBQztJQUM3QyxNQUFNMkosUUFBUSxHQUFHLElBQUksQ0FBQ2xGLEtBQUssQ0FBQ3lELEtBQUssQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO0lBRXhELEtBQUssTUFBTVEsTUFBTSxJQUFJaUIsUUFBUSxFQUFFO01BQzNCLE1BQU1oQixHQUFHLEdBQUcsSUFBSSxDQUFDbEUsS0FBSyxDQUFDNkMsWUFBWSxDQUFDb0IsTUFBTSxFQUFFLFVBQVUsQ0FBQztNQUN2RCxNQUFNa0IsT0FBTyxHQUFHLElBQUksQ0FBQ25GLEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxTQUFTLENBQUM7TUFDMUQsSUFBSSxDQUFDQyxHQUFHLElBQUksQ0FBQ2lCLE9BQU8sRUFBRTtNQUV0QixJQUFJakIsR0FBRyxDQUFDNUksS0FBSyxLQUFLQSxLQUFLLElBQUk0SSxHQUFHLENBQUMzSSxLQUFLLEtBQUtBLEtBQUssRUFBRTtRQUM1QzRKLE9BQU8sQ0FBQ3JILFFBQVEsR0FBRyxJQUFJO1FBRXZCLElBQUlxSCxPQUFPLENBQUM3SSxFQUFFLElBQUk2SSxPQUFPLENBQUM3SSxFQUFFLENBQUM4SSxVQUFVLEVBQUU7VUFDckNELE9BQU8sQ0FBQzdJLEVBQUUsQ0FBQzhJLFVBQVUsQ0FBQ3BMLFdBQVcsQ0FBQ21MLE9BQU8sQ0FBQzdJLEVBQUUsQ0FBQztRQUNqRDtRQUVBLElBQUksQ0FBQzBELEtBQUssQ0FBQ3FGLGFBQWEsQ0FBQ3BCLE1BQU0sQ0FBQztRQUNoQztNQUNKO0lBQ0o7RUFDSjtFQUVBZ0IsWUFBWUEsQ0FBQ2hCLE1BQU0sRUFBRWpTLElBQUksRUFBRTtJQUN2QixNQUFNd0csTUFBTSxHQUFHLElBQUksQ0FBQ3dILEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxRQUFRLENBQUM7SUFDeEQsTUFBTXFCLFFBQVEsR0FBRyxJQUFJLENBQUN0RixLQUFLLENBQUM2QyxZQUFZLENBQUNvQixNQUFNLEVBQUUsVUFBVSxDQUFDO0lBQzVELElBQUksQ0FBQ3pMLE1BQU0sSUFBSSxDQUFDOE0sUUFBUSxFQUFFO0lBRTFCLElBQUl0VCxJQUFJLEtBQUssT0FBTyxFQUFFO01BQ2xCMk0sNEVBQWlCLENBQUMyRyxRQUFRLENBQUM7SUFDL0IsQ0FBQyxNQUFNLElBQUl0VCxJQUFJLEtBQUssT0FBTyxFQUFFO01BQ3pCd0csTUFBTSxDQUFDdUosUUFBUSxHQUFHdkosTUFBTSxDQUFDdUosUUFBUSxHQUFHdkosTUFBTSxDQUFDdUosUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQy9ELENBQUMsTUFBTSxJQUFJL1AsSUFBSSxLQUFLLE9BQU8sRUFBRTtNQUN6QndHLE1BQU0sQ0FBQ3dKLFNBQVMsR0FBR3hKLE1BQU0sQ0FBQ3dKLFNBQVMsR0FBR3hKLE1BQU0sQ0FBQ3dKLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNsRTtFQUNKO0VBRUFnRCxnQkFBZ0JBLENBQUNmLE1BQU0sRUFBRWMsS0FBSyxFQUFFO0lBQzVCLE1BQU12TSxNQUFNLEdBQUcsSUFBSSxDQUFDd0gsS0FBSyxDQUFDNkMsWUFBWSxDQUFDb0IsTUFBTSxFQUFFLFFBQVEsQ0FBQztJQUN4RCxNQUFNcUIsUUFBUSxHQUFHLElBQUksQ0FBQ3RGLEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDNUQsSUFBSSxDQUFDekwsTUFBTSxJQUFJLENBQUN1TSxLQUFLLEVBQUU7SUFFdkJ2TSxNQUFNLENBQUNzSixLQUFLLEdBQUdpRCxLQUFLLENBQUNqRCxLQUFLLElBQUl0SixNQUFNLENBQUNzSixLQUFLO0lBQzFDdEosTUFBTSxDQUFDdUosUUFBUSxHQUFHZ0QsS0FBSyxDQUFDaEQsUUFBUSxJQUFJdkosTUFBTSxDQUFDdUosUUFBUTtJQUNuRHZKLE1BQU0sQ0FBQ3dKLFNBQVMsR0FBRytDLEtBQUssQ0FBQy9DLFNBQVMsSUFBSXhKLE1BQU0sQ0FBQ3dKLFNBQVM7SUFDdER4SixNQUFNLENBQUN5SixLQUFLLEdBQUc4QyxLQUFLLENBQUM5QyxLQUFLLElBQUl6SixNQUFNLENBQUN5SixLQUFLO0lBRTFDLElBQUlxRCxRQUFRLElBQUksT0FBT1AsS0FBSyxDQUFDakosS0FBSyxLQUFLLFFBQVEsRUFBRTtNQUM3Q3dKLFFBQVEsQ0FBQ3hKLEtBQUssR0FBR2lKLEtBQUssQ0FBQ2pKLEtBQUs7SUFDaEM7RUFDSjtFQUVBM0MsbUJBQW1CQSxDQUFDSCxPQUFPLEVBQUU7SUFDekIsSUFBSSxDQUFDQSxPQUFPLElBQUksQ0FBQ0EsT0FBTyxDQUFDUCxFQUFFLEVBQUU7SUFFN0IsTUFBTXdMLE1BQU0sR0FBRyxJQUFJLENBQUMvRCxjQUFjLENBQUN6RixHQUFHLENBQUNtRyxNQUFNLENBQUM1SCxPQUFPLENBQUNQLEVBQUUsQ0FBQyxDQUFDO0lBQzFELElBQUl3TCxNQUFNLEtBQUsvUSxTQUFTLEVBQUU7SUFFMUIsTUFBTXNGLE1BQU0sR0FBRyxJQUFJLENBQUN3SCxLQUFLLENBQUM2QyxZQUFZLENBQUNvQixNQUFNLEVBQUUsUUFBUSxDQUFDO0lBQ3hELElBQUksQ0FBQ3pMLE1BQU0sRUFBRTtJQUViQSxNQUFNLENBQUNzSixLQUFLLEdBQUc5SSxPQUFPLENBQUM4SSxLQUFLLElBQUl0SixNQUFNLENBQUNzSixLQUFLO0lBQzVDdEosTUFBTSxDQUFDeUosS0FBSyxHQUFHakosT0FBTyxDQUFDaUosS0FBSyxJQUFJekosTUFBTSxDQUFDeUosS0FBSztJQUU1QyxJQUFJLENBQUN6SixNQUFNLENBQUN5SixLQUFLLEVBQUU7TUFDZixNQUFNcUQsUUFBUSxHQUFHLElBQUksQ0FBQ3RGLEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxVQUFVLENBQUM7TUFDNUQsSUFBSXFCLFFBQVEsRUFBRUEsUUFBUSxDQUFDckosUUFBUSxHQUFHLEtBQUs7TUFFdkMsSUFBSWdJLE1BQU0sS0FBSyxJQUFJLENBQUNoRSxpQkFBaUIsRUFBRTtRQUNuQyxJQUFJLENBQUNELEtBQUssQ0FBQ3VGLGVBQWUsQ0FBQ3RCLE1BQU0sRUFBRSxPQUFPLENBQUM7TUFDL0M7SUFDSjtJQUVBLElBQUlBLE1BQU0sS0FBSyxJQUFJLENBQUNoRSxpQkFBaUIsRUFBRTtNQUNuQ2xCLHFEQUFRLENBQUN2RyxNQUFNLENBQUNzSixLQUFLLENBQUM7SUFDMUI7RUFDSjtFQUVBMUksY0FBY0EsQ0FBQ0osT0FBTyxFQUFFO0lBQ3BCLElBQUksQ0FBQ3VILE9BQU8sR0FBRyxLQUFLO0lBQ3BCLE1BQU1pRixVQUFVLEdBQUd4TSxPQUFPLElBQUlBLE9BQU8sQ0FBQ3dNLFVBQVUsR0FBR3hNLE9BQU8sQ0FBQ3dNLFVBQVUsR0FBRyxVQUFVO0lBQ2xGdE4sVUFBVSxDQUFDLE1BQU1aLEtBQUssQ0FBQyxHQUFHa08sVUFBVSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUM7RUFDdEQ7RUFFQWpELGVBQWVBLENBQUEsRUFBRztJQUNkLE1BQU1rRCxhQUFhLEdBQUdBLENBQUNqSyxDQUFDLEVBQUVDLENBQUMsRUFBRXRILFFBQVEsS0FBSztNQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDMkwsT0FBTyxDQUFDckUsQ0FBQyxDQUFDLEVBQUU7TUFFdEIsSUFBSSxDQUFDcUUsT0FBTyxDQUFDckUsQ0FBQyxDQUFDLENBQUNELENBQUMsQ0FBQyxHQUFHckgsUUFBUTtNQUU3QixNQUFNdVIsSUFBSSxHQUFHLElBQUksQ0FBQ3JTLFNBQVMsQ0FBQ3VFLGFBQWEsQ0FBQyxZQUFZNEQsQ0FBQyxjQUFjQyxDQUFDLElBQUksQ0FBQztNQUMzRSxJQUFJLENBQUNpSyxJQUFJLEVBQUU7TUFFWEEsSUFBSSxDQUFDck8sU0FBUyxHQUFHLGlCQUFpQjtNQUNsQ3FPLElBQUksQ0FBQ3ZFLEtBQUssQ0FBQ3dFLGVBQWUsR0FBRyx3Q0FBd0M7SUFDekUsQ0FBQztJQUVELE1BQU1DLGtCQUFrQixHQUFHQSxDQUFDcEssQ0FBQyxFQUFFQyxDQUFDLEtBQUs7TUFDakMsSUFBSSxJQUFJLENBQUMrRSxlQUFlLENBQUNxRixHQUFHLENBQUMsR0FBR3JLLENBQUMsSUFBSUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUMzQ29ELHVFQUFZLENBQUMsSUFBSSxDQUFDbUIsS0FBSyxFQUFFeEUsQ0FBQyxFQUFFQyxDQUFDLEVBQUUsSUFBSSxDQUFDcEksU0FBUyxFQUFFNkwsa0RBQVMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsTUFBTTRHLGVBQWUsR0FBR0EsQ0FBQ3JOLEVBQUUsRUFBRXpHLElBQUksRUFBRXdKLENBQUMsRUFBRUMsQ0FBQyxLQUFLO01BQ3hDLElBQUksQ0FBQytFLGVBQWUsQ0FBQ3ZNLEdBQUcsQ0FBQyxHQUFHdUgsQ0FBQyxJQUFJQyxDQUFDLEVBQUUsQ0FBQztNQUVyQyxJQUFJLElBQUksQ0FBQ3dFLGlCQUFpQixLQUFLLElBQUksRUFBRTtNQUVyQyxNQUFNekgsTUFBTSxHQUFHLElBQUksQ0FBQ3dILEtBQUssQ0FBQzZDLFlBQVksQ0FBQyxJQUFJLENBQUM1QyxpQkFBaUIsRUFBRSxRQUFRLENBQUM7TUFDeEUsSUFBSXpILE1BQU0sSUFBSUEsTUFBTSxDQUFDQyxFQUFFLEtBQUtBLEVBQUUsRUFBRTtRQUM1QixJQUFJLENBQUMwSixjQUFjLENBQUMsSUFBSSxDQUFDbEMsaUJBQWlCLENBQUM7TUFDL0M7TUFFQSxJQUFJLElBQUksQ0FBQ0YsTUFBTSxJQUFJLElBQUksQ0FBQ0EsTUFBTSxDQUFDNEQsVUFBVSxLQUFLM00sU0FBUyxDQUFDNE0sSUFBSSxFQUFFO1FBQzFELElBQUksQ0FBQzdELE1BQU0sQ0FBQ25GLElBQUksQ0FBQ25ELElBQUksQ0FBQ29ELFNBQVMsQ0FBQztVQUM1QjdJLElBQUksRUFBRSxnQkFBZ0I7VUFDdEJnSCxPQUFPLEVBQUU7WUFBRVAsRUFBRTtZQUFFekcsSUFBSTtZQUFFd0osQ0FBQztZQUFFQztVQUFFO1FBQzlCLENBQUMsQ0FBQyxDQUFDO01BQ1A7SUFDSixDQUFDO0lBRUQsSUFBSSxDQUFDdUUsS0FBSyxDQUFDK0YsaUJBQWlCLEdBQUcsQ0FBQzlCLE1BQU0sRUFBRXpJLENBQUMsRUFBRUMsQ0FBQyxFQUFFSCxLQUFLLEVBQUVDLEtBQUssRUFBRVcsU0FBUyxFQUFFRCxRQUFRLEtBQUs7TUFDaEYsTUFBTXpELE1BQU0sR0FBRyxJQUFJLENBQUN3SCxLQUFLLENBQUM2QyxZQUFZLENBQUNvQixNQUFNLEVBQUUsUUFBUSxDQUFDO01BQ3hELElBQUksQ0FBQ3pMLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQ3VILE1BQU0sSUFBSSxJQUFJLENBQUNBLE1BQU0sQ0FBQzRELFVBQVUsS0FBSzNNLFNBQVMsQ0FBQzRNLElBQUksRUFBRTtNQUUxRSxJQUFJLENBQUM3RCxNQUFNLENBQUNuRixJQUFJLENBQUNuRCxJQUFJLENBQUNvRCxTQUFTLENBQUM7UUFDNUI3SSxJQUFJLEVBQUUsWUFBWTtRQUNsQmdILE9BQU8sRUFBRTtVQUNMUCxFQUFFLEVBQUVELE1BQU0sQ0FBQ0MsRUFBRTtVQUNiK0MsQ0FBQztVQUNEQyxDQUFDO1VBQ0RILEtBQUs7VUFDTEMsS0FBSztVQUNMVyxTQUFTO1VBQ1RELFFBQVE7VUFDUmdCLEtBQUssRUFBRWhCLFFBQVEsR0FBRyxLQUFLLEdBQUc7UUFDOUI7TUFDSixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxJQUFJLENBQUMrRCxLQUFLLENBQUNnRyxTQUFTLENBQUMsQ0FBQ0MsQ0FBQyxFQUFFQyxFQUFFLEVBQUV6RCxHQUFHLEtBQUtqRSwwRUFBYyxDQUFDeUgsQ0FBQyxFQUFFQyxFQUFFLEVBQUV6RCxHQUFHLEVBQUUsSUFBSSxDQUFDM0MsT0FBTyxFQUFFWixrREFBUyxDQUFDLENBQUM7SUFDekYsSUFBSSxDQUFDYyxLQUFLLENBQUNnRyxTQUFTLENBQUMsQ0FBQ0MsQ0FBQyxFQUFFQyxFQUFFLEVBQUV6RCxHQUFHLEtBQUsvRCxrRUFBVSxDQUFDdUgsQ0FBQyxFQUFFQyxFQUFFLEVBQUV6RCxHQUFHLEVBQUUsSUFBSSxDQUFDM0MsT0FBTyxFQUFFMkYsYUFBYSxFQUFFRyxrQkFBa0IsRUFBRTFHLGtEQUFTLENBQUMsQ0FBQztJQUN4SCxJQUFJLENBQUNjLEtBQUssQ0FBQ2dHLFNBQVMsQ0FBQyxDQUFDQyxDQUFDLEVBQUVDLEVBQUUsRUFBRXpELEdBQUcsS0FBSzdELHdFQUFhLENBQUNxSCxDQUFDLEVBQUVILGVBQWUsQ0FBQyxDQUFDO0lBQ3ZFLElBQUksQ0FBQzlGLEtBQUssQ0FBQ2dHLFNBQVMsQ0FBQyxDQUFDQyxDQUFDLEVBQUVDLEVBQUUsRUFBRXpELEdBQUcsS0FBS2hFLHNFQUFZLENBQUN3SCxDQUFDLEVBQUVDLEVBQUUsRUFBRXpELEdBQUcsRUFBRXBELGNBQWMsQ0FBQyxDQUFDO0VBQ2xGO0VBRUFzRCxRQUFRQSxDQUFDRixHQUFHLEVBQUU7SUFDVixJQUFJLENBQUMsSUFBSSxDQUFDbEMsT0FBTyxFQUFFO0lBRW5CLE1BQU0yRixFQUFFLEdBQUd6RCxHQUFHLEdBQUcsSUFBSSxDQUFDckMsUUFBUTtJQUM5QixJQUFJLENBQUNBLFFBQVEsR0FBR3FDLEdBQUc7SUFDbkIsSUFBSSxDQUFDekMsS0FBSyxDQUFDbUcsTUFBTSxDQUFDRCxFQUFFLEVBQUV6RCxHQUFHLENBQUM7SUFDMUIsSUFBSSxJQUFJLENBQUN4QyxpQkFBaUIsS0FBSyxJQUFJLEVBQUU7TUFDakMsSUFBSSxDQUFDa0MsY0FBYyxDQUFDLElBQUksQ0FBQ2xDLGlCQUFpQixDQUFDO0lBQy9DO0lBQ0EsSUFBSSxDQUFDSyxjQUFjLEdBQUdvQyxxQkFBcUIsQ0FBRTBELE9BQU8sSUFBSyxJQUFJLENBQUN6RCxRQUFRLENBQUN5RCxPQUFPLENBQUMsQ0FBQztFQUNwRjtFQUVBaE8sT0FBT0EsQ0FBQSxFQUFHO0lBQ04sSUFBSSxDQUFDbUksT0FBTyxHQUFHLEtBQUs7SUFFcEIsSUFBSSxJQUFJLENBQUNELGNBQWMsRUFBRTtNQUNyQitGLG9CQUFvQixDQUFDLElBQUksQ0FBQy9GLGNBQWMsQ0FBQztJQUM3QztJQUVBLElBQUksSUFBSSxDQUFDRCxvQkFBb0IsRUFBRTtNQUMzQixJQUFJLENBQUNBLG9CQUFvQixDQUFDLENBQUM7SUFDL0I7RUFDSjtFQUVBOEIsY0FBY0EsQ0FBQzhCLE1BQU0sRUFBRTtJQUNuQixNQUFNekwsTUFBTSxHQUFHLElBQUksQ0FBQ3dILEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxRQUFRLENBQUM7SUFDeEQsTUFBTXFCLFFBQVEsR0FBRyxJQUFJLENBQUN0RixLQUFLLENBQUM2QyxZQUFZLENBQUNvQixNQUFNLEVBQUUsVUFBVSxDQUFDO0lBQzVELElBQUksQ0FBQ3pMLE1BQU0sSUFBSSxDQUFDOE0sUUFBUSxFQUFFO0lBRTFCeEcscURBQVEsQ0FBQ3RHLE1BQU0sQ0FBQ3VKLFFBQVEsSUFBSSxDQUFDLENBQUM7SUFDOUJoRCxxREFBUSxDQUFDdkcsTUFBTSxDQUFDc0osS0FBSyxJQUFJLENBQUMsQ0FBQztJQUMzQjlDLHFEQUFRLENBQUN4RyxNQUFNLENBQUN3SixTQUFTLElBQUksQ0FBQyxDQUFDO0lBQy9CL0MscURBQVEsQ0FBQ3FILElBQUksQ0FBQ0MsS0FBSyxDQUFDakIsUUFBUSxDQUFDeEosS0FBSyxDQUFDLENBQUM7RUFDeEM7QUFDSjtBQUVBLElBQUkwSyxzQkFBc0IsR0FBRyxFQUFFO0FBRXhCLFNBQVNoUSxhQUFhQSxDQUFDdUUsSUFBSSxFQUFFO0VBQ2hDeUwsc0JBQXNCLEdBQUd6TCxJQUFJO0VBQzdCMEwsWUFBWSxDQUFDQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUzTCxJQUFJLENBQUM7RUFDbkQvRSxPQUFPLENBQUNDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRThFLElBQUksQ0FBQztBQUN2RDtBQUVPLFNBQVM0TCxhQUFhQSxDQUFBLEVBQUc7RUFDNUIsT0FBT0gsc0JBQXNCLElBQUlDLFlBQVksQ0FBQ0csT0FBTyxDQUFDLHVCQUF1QixDQUFDLElBQUksUUFBUTtBQUM5RixDOzs7Ozs7Ozs7Ozs7OztBQ3piTyxTQUFTbEksVUFBVUEsQ0FBQ3NCLEtBQUssRUFBRWtHLEVBQUUsRUFBRXpELEdBQUcsRUFBRTNDLE9BQU8sRUFBRTJGLGFBQWEsRUFBRUcsa0JBQWtCLEVBQUV2SyxRQUFRLEdBQUcsRUFBRSxFQUFFO0VBQ2xHLE1BQU0rQyxLQUFLLEdBQUc0QixLQUFLLENBQUN5RCxLQUFLLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQztFQUU3QyxLQUFLLE1BQU1XLFVBQVUsSUFBSWhHLEtBQUssRUFBRTtJQUM1QixNQUFNOEYsR0FBRyxHQUFHbEUsS0FBSyxDQUFDNkMsWUFBWSxDQUFDdUIsVUFBVSxFQUFFLFVBQVUsQ0FBQztJQUN0RCxNQUFNRCxJQUFJLEdBQUduRSxLQUFLLENBQUM2QyxZQUFZLENBQUN1QixVQUFVLEVBQUUsTUFBTSxDQUFDO0lBRW5ERCxJQUFJLENBQUMzRyxLQUFLLElBQUkwSSxFQUFFO0lBRWhCLElBQUkvQixJQUFJLENBQUMzRyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMyRyxJQUFJLENBQUN6RyxRQUFRLEVBQUU7TUFDbkN5RyxJQUFJLENBQUN6RyxRQUFRLEdBQUcsSUFBSTtNQUVwQixNQUFNbUosYUFBYSxHQUFHQyx1QkFBdUIsQ0FBQzVDLEdBQUcsQ0FBQzVJLEtBQUssRUFBRTRJLEdBQUcsQ0FBQzNJLEtBQUssRUFBRTRJLElBQUksQ0FBQzFHLEtBQUssRUFBRXFDLE9BQU8sQ0FBQztNQUV4RitHLGFBQWEsQ0FBQ3hTLE9BQU8sQ0FBQzBTLElBQUksSUFBSTtRQUMxQixNQUFNQyxTQUFTLEdBQUdoSCxLQUFLLENBQUNnQixZQUFZLENBQUMsQ0FBQztRQUN0QyxNQUFNaUcsTUFBTSxHQUFHN1UsUUFBUSxDQUFDTCxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzVDa1YsTUFBTSxDQUFDNVAsU0FBUyxHQUFHLFdBQVc7UUFDOUI0UCxNQUFNLENBQUM5RixLQUFLLENBQUNDLFFBQVEsR0FBRyxVQUFVO1FBQ2xDNkYsTUFBTSxDQUFDOUYsS0FBSyxDQUFDSSxLQUFLLEdBQUcsR0FBR2xHLFFBQVEsSUFBSTtRQUNwQzRMLE1BQU0sQ0FBQzlGLEtBQUssQ0FBQ0ssTUFBTSxHQUFHLEdBQUduRyxRQUFRLElBQUk7UUFDckM0TCxNQUFNLENBQUM5RixLQUFLLENBQUMzQixJQUFJLEdBQUcsR0FBR3VILElBQUksQ0FBQ3ZMLENBQUMsR0FBR0gsUUFBUSxJQUFJO1FBQzVDNEwsTUFBTSxDQUFDOUYsS0FBSyxDQUFDbUQsR0FBRyxHQUFHLEdBQUd5QyxJQUFJLENBQUN0TCxDQUFDLEdBQUdKLFFBQVEsSUFBSTtRQUMzQzRMLE1BQU0sQ0FBQzlGLEtBQUssQ0FBQ0UsTUFBTSxHQUFHLEdBQUc7UUFFekJyQixLQUFLLENBQUM0QixZQUFZLENBQUNvRixTQUFTLEVBQUUsVUFBVSxFQUFFO1VBQ3RDMUwsS0FBSyxFQUFFeUwsSUFBSSxDQUFDdkwsQ0FBQztVQUNiRCxLQUFLLEVBQUV3TCxJQUFJLENBQUN0TCxDQUFDO1VBQ2JELENBQUMsRUFBRXVMLElBQUksQ0FBQ3ZMLENBQUMsR0FBR0gsUUFBUTtVQUNwQkksQ0FBQyxFQUFFc0wsSUFBSSxDQUFDdEwsQ0FBQyxHQUFHSjtRQUNoQixDQUFDLENBQUM7UUFDRjJFLEtBQUssQ0FBQzRCLFlBQVksQ0FBQ29GLFNBQVMsRUFBRSxXQUFXLEVBQUU7VUFBRXBKLFFBQVEsRUFBRSxHQUFHO1VBQUV0QixFQUFFLEVBQUUySztRQUFPLENBQUMsQ0FBQztRQUN6RTlDLElBQUksQ0FBQzdILEVBQUUsQ0FBQzhJLFVBQVUsQ0FBQ3JMLFdBQVcsQ0FBQ2tOLE1BQU0sQ0FBQztRQUV0QyxJQUFJbkgsT0FBTyxDQUFDaUgsSUFBSSxDQUFDdEwsQ0FBQyxDQUFDLElBQUlxRSxPQUFPLENBQUNpSCxJQUFJLENBQUN0TCxDQUFDLENBQUMsQ0FBQ3NMLElBQUksQ0FBQ3ZMLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtVQUNsRGlLLGFBQWEsQ0FBQ3NCLElBQUksQ0FBQ3ZMLENBQUMsRUFBRXVMLElBQUksQ0FBQ3RMLENBQUMsRUFBRSxDQUFDLENBQUM7VUFFaEMsSUFBSW1LLGtCQUFrQixFQUFFO1lBQ3BCQSxrQkFBa0IsQ0FBQ21CLElBQUksQ0FBQ3ZMLENBQUMsRUFBRXVMLElBQUksQ0FBQ3RMLENBQUMsQ0FBQztVQUN0QztRQUNKO01BQ0osQ0FBQyxDQUFDO01BRUYsSUFBSTBJLElBQUksQ0FBQzdILEVBQUUsSUFBSTZILElBQUksQ0FBQzdILEVBQUUsQ0FBQzhJLFVBQVUsRUFBRTtRQUMvQmpCLElBQUksQ0FBQzdILEVBQUUsQ0FBQzhJLFVBQVUsQ0FBQ3BMLFdBQVcsQ0FBQ21LLElBQUksQ0FBQzdILEVBQUUsQ0FBQztNQUMzQztNQUNBMEQsS0FBSyxDQUFDcUYsYUFBYSxDQUFDakIsVUFBVSxDQUFDO0lBQ25DO0VBQ0o7RUFFQSxNQUFNOEMsVUFBVSxHQUFHbEgsS0FBSyxDQUFDeUQsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUM7RUFDdkQsS0FBSyxNQUFNdUQsU0FBUyxJQUFJRSxVQUFVLEVBQUU7SUFDaEMsTUFBTUMsR0FBRyxHQUFHbkgsS0FBSyxDQUFDNkMsWUFBWSxDQUFDbUUsU0FBUyxFQUFFLFdBQVcsQ0FBQztJQUN0REcsR0FBRyxDQUFDdkosUUFBUSxJQUFJc0ksRUFBRTtJQUVsQixJQUFJaUIsR0FBRyxDQUFDdkosUUFBUSxJQUFJLENBQUMsRUFBRTtNQUNuQixJQUFJdUosR0FBRyxDQUFDN0ssRUFBRSxJQUFJNkssR0FBRyxDQUFDN0ssRUFBRSxDQUFDOEksVUFBVSxFQUFFO1FBQzdCK0IsR0FBRyxDQUFDN0ssRUFBRSxDQUFDOEksVUFBVSxDQUFDcEwsV0FBVyxDQUFDbU4sR0FBRyxDQUFDN0ssRUFBRSxDQUFDO01BQ3pDO01BQ0EwRCxLQUFLLENBQUNxRixhQUFhLENBQUMyQixTQUFTLENBQUM7SUFDbEM7RUFDSjtBQUNKO0FBRUEsU0FBU0YsdUJBQXVCQSxDQUFDTSxFQUFFLEVBQUVDLEVBQUUsRUFBRTVKLEtBQUssRUFBRXFDLE9BQU8sRUFBRTtFQUNyRCxNQUFNd0gsS0FBSyxHQUFHLENBQUM7SUFBRTlMLENBQUMsRUFBRTRMLEVBQUU7SUFBRTNMLENBQUMsRUFBRTRMO0VBQUcsQ0FBQyxDQUFDO0VBQ2hDLE1BQU1FLFVBQVUsR0FBRyxDQUNmO0lBQUUvTCxDQUFDLEVBQUUsQ0FBQztJQUFFQyxDQUFDLEVBQUUsQ0FBQztFQUFFLENBQUMsRUFDZjtJQUFFRCxDQUFDLEVBQUUsQ0FBQztJQUFFQyxDQUFDLEVBQUU7RUFBRSxDQUFDLEVBQ2Q7SUFBRUQsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUFFQyxDQUFDLEVBQUU7RUFBRSxDQUFDLEVBQ2Y7SUFBRUQsQ0FBQyxFQUFFLENBQUM7SUFBRUMsQ0FBQyxFQUFFO0VBQUUsQ0FBQyxDQUNqQjtFQUVELE1BQU0rTCxLQUFLLEdBQUcvSixLQUFLLEdBQUcsQ0FBQztFQUV2QjhKLFVBQVUsQ0FBQ2xULE9BQU8sQ0FBQzJPLEdBQUcsSUFBSTtJQUN0QixLQUFLLElBQUl5RSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLElBQUlELEtBQUssRUFBRUMsQ0FBQyxFQUFFLEVBQUU7TUFDN0IsTUFBTUMsRUFBRSxHQUFHTixFQUFFLEdBQUlwRSxHQUFHLENBQUN4SCxDQUFDLEdBQUdpTSxDQUFFO01BQzNCLE1BQU1FLEVBQUUsR0FBR04sRUFBRSxHQUFJckUsR0FBRyxDQUFDdkgsQ0FBQyxHQUFHZ00sQ0FBRTtNQUUzQixJQUFJLENBQUMzSCxPQUFPLENBQUM2SCxFQUFFLENBQUMsSUFBSTdILE9BQU8sQ0FBQzZILEVBQUUsQ0FBQyxDQUFDRCxFQUFFLENBQUMsS0FBS3hVLFNBQVMsRUFBRTtNQUVuRCxNQUFNMFUsUUFBUSxHQUFHOUgsT0FBTyxDQUFDNkgsRUFBRSxDQUFDLENBQUNELEVBQUUsQ0FBQztNQUVoQyxJQUFJRSxRQUFRLEtBQUssQ0FBQyxFQUFFO1FBQ2hCO01BQ0o7TUFFQU4sS0FBSyxDQUFDOVMsSUFBSSxDQUFDO1FBQUVnSCxDQUFDLEVBQUVrTSxFQUFFO1FBQUVqTSxDQUFDLEVBQUVrTTtNQUFHLENBQUMsQ0FBQztNQUU1QixJQUFJQyxRQUFRLEtBQUssQ0FBQyxFQUFFO1FBQ2hCO01BQ0o7SUFDSjtFQUNKLENBQUMsQ0FBQztFQUVGLE9BQU9OLEtBQUs7QUFDaEIsQzs7Ozs7Ozs7Ozs7Ozs7QUNqR08sU0FBUzlJLGNBQWNBLENBQUN3QixLQUFLLEVBQUVrRyxFQUFFLEVBQUV6RCxHQUFHLEVBQUUzQyxPQUFPLEVBQUV6RSxRQUFRLEdBQUcsRUFBRSxFQUFFO0VBQ25FLE1BQU13TSxRQUFRLEdBQUc3SCxLQUFLLENBQUN5RCxLQUFLLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztFQUNwRCxNQUFNcUUsS0FBSyxHQUFHNUIsRUFBRSxHQUFHLEtBQUs7RUFFeEIsTUFBTTZCLFdBQVcsR0FBRzFNLFFBQVE7RUFFNUIsS0FBSyxNQUFNNEksTUFBTSxJQUFJNEQsUUFBUSxFQUFFO0lBQzNCLE1BQU0zRCxHQUFHLEdBQUdsRSxLQUFLLENBQUM2QyxZQUFZLENBQUNvQixNQUFNLEVBQUUsVUFBVSxDQUFDO0lBQ2xELE1BQU1XLEdBQUcsR0FBRzVFLEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDbEQsTUFBTXJCLEtBQUssR0FBRzVDLEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxPQUFPLENBQUM7SUFDakQsTUFBTStELFFBQVEsR0FBR2hJLEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFFdkQsSUFBSVcsR0FBRyxDQUFDNUksdUJBQXVCLEdBQUcsQ0FBQyxFQUFFO01BQ2pDNEksR0FBRyxDQUFDNUksdUJBQXVCLEdBQUdzSyxJQUFJLENBQUNqSSxHQUFHLENBQUN1RyxHQUFHLENBQUM1SSx1QkFBdUIsR0FBR2tLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0UsQ0FBQyxNQUFNO01BQ0h0QixHQUFHLENBQUM3SSxVQUFVLEdBQUcsQ0FBQztJQUN0QjtJQUVBLE1BQU1rTSxVQUFVLEdBQUdyRCxHQUFHLENBQUM1SSx1QkFBdUIsR0FBRyxDQUFDLEdBQUc0SSxHQUFHLENBQUM3SSxVQUFVLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDNUUsTUFBTW1NLGFBQWEsR0FBR0YsUUFBUSxHQUFHLENBQUNBLFFBQVEsQ0FBQzdKLGNBQWMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDeEV5RyxHQUFHLENBQUM5SSxLQUFLLEdBQUc4SSxHQUFHLENBQUMvSSxTQUFTLEdBQUdvTSxVQUFVLEdBQUdDLGFBQWE7SUFFdEQsSUFBSSxDQUFDdEYsS0FBSyxFQUFFO01BQ1J1RixnQkFBZ0IsQ0FBQ2pFLEdBQUcsRUFBRVUsR0FBRyxFQUFFa0QsS0FBSyxDQUFDO01BQ2pDO0lBQ0o7SUFFQSxNQUFNTSxXQUFXLEdBQUd4RixLQUFLLENBQUN4RyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLElBQUlpTSxFQUFFLEdBQUcsQ0FBQztJQUNWLElBQUlDLEVBQUUsR0FBRyxDQUFDO0lBRVYsSUFBSUYsV0FBVyxLQUFLLElBQUksRUFBRTtNQUN0QkUsRUFBRSxHQUFHLENBQUMsQ0FBQztNQUNQMUQsR0FBRyxDQUFDMUksU0FBUyxHQUFHLElBQUk7SUFDeEIsQ0FBQyxNQUFNLElBQUlrTSxXQUFXLEtBQUssTUFBTSxFQUFFO01BQy9CRSxFQUFFLEdBQUcsQ0FBQztNQUNOMUQsR0FBRyxDQUFDMUksU0FBUyxHQUFHLE1BQU07SUFDMUIsQ0FBQyxNQUFNLElBQUlrTSxXQUFXLEtBQUssTUFBTSxFQUFFO01BQy9CQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO01BQ1B6RCxHQUFHLENBQUMxSSxTQUFTLEdBQUcsTUFBTTtJQUMxQixDQUFDLE1BQU0sSUFBSWtNLFdBQVcsS0FBSyxPQUFPLEVBQUU7TUFDaENDLEVBQUUsR0FBRyxDQUFDO01BQ056RCxHQUFHLENBQUMxSSxTQUFTLEdBQUcsT0FBTztJQUMzQjtJQUVBLE1BQU1xTSxRQUFRLEdBQUdGLEVBQUUsS0FBSyxDQUFDLElBQUlDLEVBQUUsS0FBSyxDQUFDO0lBRXJDLElBQUksQ0FBQ0MsUUFBUSxFQUFFO01BQ1hyRSxHQUFHLENBQUN4SSxPQUFPLEdBQUd3SSxHQUFHLENBQUMxSSxDQUFDO01BQ25CMEksR0FBRyxDQUFDdkksT0FBTyxHQUFHdUksR0FBRyxDQUFDekksQ0FBQztNQUNuQm1KLEdBQUcsQ0FBQzNJLFFBQVEsR0FBRyxLQUFLO01BQ3BCLE1BQU00SSxVQUFVLEdBQUc3RSxLQUFLLENBQUM2QyxZQUFZLENBQUNvQixNQUFNLEVBQUUsWUFBWSxDQUFDO01BQzNELElBQUlZLFVBQVUsRUFBRTtRQUNaQSxVQUFVLENBQUM1SCxLQUFLLEdBQUcsTUFBTTtNQUM3QjtNQUVBaUgsR0FBRyxDQUFDNUksS0FBSyxHQUFHZ0wsSUFBSSxDQUFDa0MsS0FBSyxDQUNsQixDQUFDdEUsR0FBRyxDQUFDMUksQ0FBQyxHQUFHdU0sV0FBVyxHQUFHLENBQUMsSUFBSTFNLFFBQ2hDLENBQUM7TUFFRDZJLEdBQUcsQ0FBQzNJLEtBQUssR0FBRytLLElBQUksQ0FBQ2tDLEtBQUssQ0FDbEIsQ0FBQ3RFLEdBQUcsQ0FBQ3pJLENBQUMsR0FBR3NNLFdBQVcsR0FBRyxDQUFDLElBQUkxTSxRQUNoQyxDQUFDO01BRUQsSUFBSTJFLEtBQUssQ0FBQytGLGlCQUFpQixFQUFFO1FBQ3pCL0YsS0FBSyxDQUFDK0YsaUJBQWlCLENBQ25COUIsTUFBTSxFQUNOQyxHQUFHLENBQUMxSSxDQUFDLEVBQ0wwSSxHQUFHLENBQUN6SSxDQUFDLEVBQ0x5SSxHQUFHLENBQUM1SSxLQUFLLEVBQ1Q0SSxHQUFHLENBQUMzSSxLQUFLLEVBQ1RxSixHQUFHLENBQUMxSSxTQUFTLEVBQ2IwSSxHQUFHLENBQUMzSSxRQUNSLENBQUM7TUFDTDtNQUNBO0lBQ0o7SUFFQSxNQUFNd00sS0FBSyxHQUFHdkUsR0FBRyxDQUFDMUksQ0FBQyxHQUFHNk0sRUFBRSxHQUFHekQsR0FBRyxDQUFDOUksS0FBSyxHQUFHZ00sS0FBSztJQUM1QyxNQUFNWSxLQUFLLEdBQUd4RSxHQUFHLENBQUN6SSxDQUFDLEdBQUc2TSxFQUFFLEdBQUcxRCxHQUFHLENBQUM5SSxLQUFLLEdBQUdnTSxLQUFLO0lBRTVDLE1BQU1hLGFBQWEsR0FBRyxFQUFFO0lBRXhCLElBQUlMLEVBQUUsS0FBSyxDQUFDLElBQUlELEVBQUUsS0FBSyxDQUFDLEVBQUU7TUFDdEIsSUFBSU8sU0FBUyxDQUFDMUUsR0FBRyxDQUFDMUksQ0FBQyxFQUFFa04sS0FBSyxFQUFFNUksT0FBTyxFQUFFekUsUUFBUSxFQUFFME0sV0FBVyxDQUFDLEVBQUU7UUFDekQsTUFBTWMsWUFBWSxHQUFHdkMsSUFBSSxDQUFDa0MsS0FBSyxDQUFDLENBQUN0RSxHQUFHLENBQUMxSSxDQUFDLEdBQUd1TSxXQUFXLEdBQUcsQ0FBQyxJQUFJMU0sUUFBUSxDQUFDO1FBQ3JFLE1BQU1LLE9BQU8sR0FBR21OLFlBQVksR0FBR3hOLFFBQVE7UUFDdkMsTUFBTXlOLEtBQUssR0FBRzVFLEdBQUcsQ0FBQzFJLENBQUMsR0FBR0UsT0FBTztRQUU3QixJQUFJNEssSUFBSSxDQUFDeUMsR0FBRyxDQUFDRCxLQUFLLENBQUMsR0FBR0gsYUFBYSxFQUFFO1VBQ2pDTCxFQUFFLEdBQUcsQ0FBQztVQUNORCxFQUFFLEdBQUcsQ0FBQy9CLElBQUksQ0FBQzBDLElBQUksQ0FBQ0YsS0FBSyxDQUFDO1FBQzFCO01BQ0o7SUFDSjtJQUVBLElBQUlULEVBQUUsS0FBSyxDQUFDLElBQUlDLEVBQUUsS0FBSyxDQUFDLEVBQUU7TUFDdEIsSUFBSU0sU0FBUyxDQUFDSCxLQUFLLEVBQUV2RSxHQUFHLENBQUN6SSxDQUFDLEVBQUVxRSxPQUFPLEVBQUV6RSxRQUFRLEVBQUUwTSxXQUFXLENBQUMsRUFBRTtRQUN6RCxNQUFNa0IsWUFBWSxHQUFHM0MsSUFBSSxDQUFDa0MsS0FBSyxDQUFDLENBQUN0RSxHQUFHLENBQUN6SSxDQUFDLEdBQUdzTSxXQUFXLEdBQUcsQ0FBQyxJQUFJMU0sUUFBUSxDQUFDO1FBQ3JFLE1BQU1NLE9BQU8sR0FBR3NOLFlBQVksR0FBRzVOLFFBQVE7UUFDdkMsTUFBTTZOLEtBQUssR0FBR2hGLEdBQUcsQ0FBQ3pJLENBQUMsR0FBR0UsT0FBTztRQUU3QixJQUFJMkssSUFBSSxDQUFDeUMsR0FBRyxDQUFDRyxLQUFLLENBQUMsR0FBR1AsYUFBYSxFQUFFO1VBQ2pDTixFQUFFLEdBQUcsQ0FBQztVQUNOQyxFQUFFLEdBQUcsQ0FBQ2hDLElBQUksQ0FBQzBDLElBQUksQ0FBQ0UsS0FBSyxDQUFDO1FBQzFCO01BQ0o7SUFDSjtJQUVBLE1BQU1DLGNBQWMsR0FBR2pGLEdBQUcsQ0FBQzFJLENBQUMsR0FBRzZNLEVBQUUsR0FBR3pELEdBQUcsQ0FBQzlJLEtBQUssR0FBR2dNLEtBQUs7SUFDckQsTUFBTXNCLGNBQWMsR0FBR2xGLEdBQUcsQ0FBQ3pJLENBQUMsR0FBRzZNLEVBQUUsR0FBRzFELEdBQUcsQ0FBQzlJLEtBQUssR0FBR2dNLEtBQUs7SUFFckQsSUFBSU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDTyxTQUFTLENBQUNPLGNBQWMsRUFBRWpGLEdBQUcsQ0FBQ3pJLENBQUMsRUFBRXFFLE9BQU8sRUFBRXpFLFFBQVEsRUFBRTBNLFdBQVcsQ0FBQyxFQUFFO01BQy9FN0QsR0FBRyxDQUFDMUksQ0FBQyxHQUFHMk4sY0FBYztJQUMxQjtJQUVBLElBQUliLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQ00sU0FBUyxDQUFDMUUsR0FBRyxDQUFDMUksQ0FBQyxFQUFFNE4sY0FBYyxFQUFFdEosT0FBTyxFQUFFekUsUUFBUSxFQUFFME0sV0FBVyxDQUFDLEVBQUU7TUFDL0U3RCxHQUFHLENBQUN6SSxDQUFDLEdBQUcyTixjQUFjO0lBQzFCO0lBRUF4RSxHQUFHLENBQUMzSSxRQUFRLEdBQUcsSUFBSTtJQUVuQixNQUFNNEksVUFBVSxHQUFHN0UsS0FBSyxDQUFDNkMsWUFBWSxDQUFDb0IsTUFBTSxFQUFFLFlBQVksQ0FBQztJQUMzRCxJQUFJWSxVQUFVLEVBQUU7TUFDWkEsVUFBVSxDQUFDNUgsS0FBSyxHQUFHLEtBQUs7SUFDNUI7SUFFQWlILEdBQUcsQ0FBQzVJLEtBQUssR0FBR2dMLElBQUksQ0FBQ2tDLEtBQUssQ0FDbEIsQ0FBQ3RFLEdBQUcsQ0FBQzFJLENBQUMsR0FBR3VNLFdBQVcsR0FBRyxDQUFDLElBQUkxTSxRQUNoQyxDQUFDO0lBRUQ2SSxHQUFHLENBQUMzSSxLQUFLLEdBQUcrSyxJQUFJLENBQUNrQyxLQUFLLENBQ2xCLENBQUN0RSxHQUFHLENBQUN6SSxDQUFDLEdBQUdzTSxXQUFXLEdBQUcsQ0FBQyxJQUFJMU0sUUFDaEMsQ0FBQztJQUVENkksR0FBRyxDQUFDeEksT0FBTyxHQUFHd0ksR0FBRyxDQUFDMUksQ0FBQztJQUNuQjBJLEdBQUcsQ0FBQ3ZJLE9BQU8sR0FBR3VJLEdBQUcsQ0FBQ3pJLENBQUM7SUFFbkIsSUFBSXVFLEtBQUssQ0FBQytGLGlCQUFpQixFQUFFO01BQ3pCL0YsS0FBSyxDQUFDK0YsaUJBQWlCLENBQ25COUIsTUFBTSxFQUNOQyxHQUFHLENBQUMxSSxDQUFDLEVBQ0wwSSxHQUFHLENBQUN6SSxDQUFDLEVBQ0x5SSxHQUFHLENBQUM1SSxLQUFLLEVBQ1Q0SSxHQUFHLENBQUMzSSxLQUFLLEVBQ1RxSixHQUFHLENBQUMxSSxTQUFTLEVBQ2IwSSxHQUFHLENBQUMzSSxRQUNSLENBQUM7SUFDTDtFQUNKO0FBQ0o7QUFFQSxTQUFTa00sZ0JBQWdCQSxDQUFDakUsR0FBRyxFQUFFVSxHQUFHLEVBQUVrRCxLQUFLLEVBQUU7RUFDdkMsTUFBTXVCLElBQUksR0FBR3pFLEdBQUcsQ0FBQzlJLEtBQUssR0FBR2dNLEtBQUs7RUFFOUIsSUFBSTVELEdBQUcsQ0FBQzFJLENBQUMsR0FBRzBJLEdBQUcsQ0FBQ3hJLE9BQU8sRUFBRTtJQUNyQndJLEdBQUcsQ0FBQzFJLENBQUMsR0FBRzhLLElBQUksQ0FBQ2dELEdBQUcsQ0FBQ3BGLEdBQUcsQ0FBQzFJLENBQUMsR0FBRzZOLElBQUksRUFBRW5GLEdBQUcsQ0FBQ3hJLE9BQU8sQ0FBQztFQUMvQyxDQUFDLE1BQU0sSUFBSXdJLEdBQUcsQ0FBQzFJLENBQUMsR0FBRzBJLEdBQUcsQ0FBQ3hJLE9BQU8sRUFBRTtJQUM1QndJLEdBQUcsQ0FBQzFJLENBQUMsR0FBRzhLLElBQUksQ0FBQ2pJLEdBQUcsQ0FBQzZGLEdBQUcsQ0FBQzFJLENBQUMsR0FBRzZOLElBQUksRUFBRW5GLEdBQUcsQ0FBQ3hJLE9BQU8sQ0FBQztFQUMvQztFQUVBLElBQUl3SSxHQUFHLENBQUN6SSxDQUFDLEdBQUd5SSxHQUFHLENBQUN2SSxPQUFPLEVBQUU7SUFDckJ1SSxHQUFHLENBQUN6SSxDQUFDLEdBQUc2SyxJQUFJLENBQUNnRCxHQUFHLENBQUNwRixHQUFHLENBQUN6SSxDQUFDLEdBQUc0TixJQUFJLEVBQUVuRixHQUFHLENBQUN2SSxPQUFPLENBQUM7RUFDL0MsQ0FBQyxNQUFNLElBQUl1SSxHQUFHLENBQUN6SSxDQUFDLEdBQUd5SSxHQUFHLENBQUN2SSxPQUFPLEVBQUU7SUFDNUJ1SSxHQUFHLENBQUN6SSxDQUFDLEdBQUc2SyxJQUFJLENBQUNqSSxHQUFHLENBQUM2RixHQUFHLENBQUN6SSxDQUFDLEdBQUc0TixJQUFJLEVBQUVuRixHQUFHLENBQUN2SSxPQUFPLENBQUM7RUFDL0M7RUFFQWlKLEdBQUcsQ0FBQzNJLFFBQVEsR0FDUmlJLEdBQUcsQ0FBQzFJLENBQUMsS0FBSzBJLEdBQUcsQ0FBQ3hJLE9BQU8sSUFDckJ3SSxHQUFHLENBQUN6SSxDQUFDLEtBQUt5SSxHQUFHLENBQUN2SSxPQUFPO0FBQzdCO0FBRUEsU0FBU2lOLFNBQVNBLENBQUNwTixDQUFDLEVBQUVDLENBQUMsRUFBRXFFLE9BQU8sRUFBRXpFLFFBQVEsRUFBRWtPLFVBQVUsR0FBR2xPLFFBQVEsRUFBRTtFQUMvRCxNQUFNbU8sT0FBTyxHQUFHLENBQUM7RUFFakIsTUFBTWhLLElBQUksR0FBRzhHLElBQUksQ0FBQ2tDLEtBQUssQ0FDbkIsQ0FBQ2hOLENBQUMsR0FBR2dPLE9BQU8sSUFBSW5PLFFBQ3BCLENBQUM7RUFFRCxNQUFNcUUsS0FBSyxHQUFHNEcsSUFBSSxDQUFDa0MsS0FBSyxDQUNwQixDQUFDaE4sQ0FBQyxHQUFHK04sVUFBVSxHQUFHQyxPQUFPLElBQUluTyxRQUNqQyxDQUFDO0VBRUQsTUFBTWlKLEdBQUcsR0FBR2dDLElBQUksQ0FBQ2tDLEtBQUssQ0FDbEIsQ0FBQy9NLENBQUMsR0FBRytOLE9BQU8sSUFBSW5PLFFBQ3BCLENBQUM7RUFFRCxNQUFNb08sTUFBTSxHQUFHbkQsSUFBSSxDQUFDa0MsS0FBSyxDQUNyQixDQUFDL00sQ0FBQyxHQUFHOE4sVUFBVSxHQUFHQyxPQUFPLElBQUluTyxRQUNqQyxDQUFDO0VBRUQsT0FDSXFPLGFBQWEsQ0FBQ2xLLElBQUksRUFBRThFLEdBQUcsRUFBRXhFLE9BQU8sQ0FBQyxJQUNqQzRKLGFBQWEsQ0FBQ2hLLEtBQUssRUFBRTRFLEdBQUcsRUFBRXhFLE9BQU8sQ0FBQyxJQUNsQzRKLGFBQWEsQ0FBQ2xLLElBQUksRUFBRWlLLE1BQU0sRUFBRTNKLE9BQU8sQ0FBQyxJQUNwQzRKLGFBQWEsQ0FBQ2hLLEtBQUssRUFBRStKLE1BQU0sRUFBRTNKLE9BQU8sQ0FBQztBQUU3QztBQUVBLFNBQVM0SixhQUFhQSxDQUFDbE8sQ0FBQyxFQUFFQyxDQUFDLEVBQUVxRSxPQUFPLEVBQUU7RUFDbEMsTUFBTWlILElBQUksR0FBR2pILE9BQU8sQ0FBQ3JFLENBQUMsQ0FBQyxJQUFJcUUsT0FBTyxDQUFDckUsQ0FBQyxDQUFDLENBQUNELENBQUMsQ0FBQztFQUV4QyxPQUFPdUwsSUFBSSxLQUFLLENBQUMsSUFBSUEsSUFBSSxLQUFLLENBQUM7QUFDbkMsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNNTyxNQUFNNEMsb0JBQW9CLEdBQUcsQ0FBQztBQUM5QixNQUFNQyxnQkFBZ0IsR0FBRyxDQUFDO0FBQzFCLE1BQU1DLHNCQUFzQixHQUFHLElBQUk7QUFFbkMsU0FBU2xMLGlCQUFpQkEsQ0FBQzJHLFFBQVEsRUFBRTtFQUN4QyxNQUFNd0UsWUFBWSxHQUFHeEUsUUFBUSxDQUFDdkosVUFBVSxJQUFJLENBQUM7RUFDN0MsTUFBTWdPLFFBQVEsR0FBR3pELElBQUksQ0FBQ2pJLEdBQUcsQ0FBQ3VMLGdCQUFnQixHQUFHdEUsUUFBUSxDQUFDekosU0FBUyxFQUFFLENBQUMsQ0FBQztFQUNuRXlKLFFBQVEsQ0FBQ3ZKLFVBQVUsR0FBR3VLLElBQUksQ0FBQ2dELEdBQUcsQ0FBQ1EsWUFBWSxHQUFHSCxvQkFBb0IsRUFBRUksUUFBUSxDQUFDO0VBQzdFekUsUUFBUSxDQUFDdEosdUJBQXVCLEdBQUc2TixzQkFBc0I7RUFDekR2RSxRQUFRLENBQUN4SixLQUFLLEdBQUd3SyxJQUFJLENBQUNnRCxHQUFHLENBQUNoRSxRQUFRLENBQUN6SixTQUFTLEdBQUd5SixRQUFRLENBQUN2SixVQUFVLEVBQUU2TixnQkFBZ0IsQ0FBQztBQUN6RjtBQUVPLFNBQVNoTCxhQUFhQSxDQUFDb0IsS0FBSyxFQUFFOEYsZUFBZSxFQUFFO0VBQ2xELE1BQU14TixPQUFPLEdBQUcwSCxLQUFLLENBQUN5RCxLQUFLLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUM7RUFDN0QsTUFBTXlCLFFBQVEsR0FBR2xGLEtBQUssQ0FBQ3lELEtBQUssQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO0VBRW5ELEtBQUssTUFBTTFDLFlBQVksSUFBSXpJLE9BQU8sRUFBRTtJQUNoQyxNQUFNMFIsSUFBSSxHQUFHaEssS0FBSyxDQUFDNkMsWUFBWSxDQUFDOUIsWUFBWSxFQUFFLFVBQVUsQ0FBQztJQUN6RCxNQUFNNkQsR0FBRyxHQUFHNUUsS0FBSyxDQUFDNkMsWUFBWSxDQUFDOUIsWUFBWSxFQUFFLFVBQVUsQ0FBQztJQUN4RCxNQUFNdkksTUFBTSxHQUFHd0gsS0FBSyxDQUFDNkMsWUFBWSxDQUFDOUIsWUFBWSxFQUFFLFFBQVEsQ0FBQztJQUN6RCxJQUFJLENBQUNpSixJQUFJLElBQUksQ0FBQ3BGLEdBQUcsSUFBSSxDQUFDcE0sTUFBTSxFQUFFO0lBRTlCLEtBQUssTUFBTXlSLFNBQVMsSUFBSS9FLFFBQVEsRUFBRTtNQUM5QixNQUFNZ0YsS0FBSyxHQUFHbEssS0FBSyxDQUFDNkMsWUFBWSxDQUFDb0gsU0FBUyxFQUFFLFVBQVUsQ0FBQztNQUN2RCxNQUFNRSxHQUFHLEdBQUduSyxLQUFLLENBQUM2QyxZQUFZLENBQUNvSCxTQUFTLEVBQUUsU0FBUyxDQUFDO01BQ3BELElBQUksQ0FBQ0MsS0FBSyxJQUFJLENBQUNDLEdBQUcsSUFBSUEsR0FBRyxDQUFDck0sUUFBUSxFQUFFO01BRXBDLElBQUlrTSxJQUFJLENBQUMxTyxLQUFLLEtBQUs0TyxLQUFLLENBQUM1TyxLQUFLLElBQUkwTyxJQUFJLENBQUN6TyxLQUFLLEtBQUsyTyxLQUFLLENBQUMzTyxLQUFLLEVBQUU7UUFDMUQ0TyxHQUFHLENBQUNyTSxRQUFRLEdBQUcsSUFBSTtRQUVuQixJQUFJcU0sR0FBRyxDQUFDblksSUFBSSxLQUFLLE9BQU8sRUFBRTtVQUN0QjJNLGlCQUFpQixDQUFDaUcsR0FBRyxDQUFDO1FBQzFCLENBQUMsTUFDSSxJQUFJdUYsR0FBRyxDQUFDblksSUFBSSxLQUFLLE9BQU8sRUFBRTtVQUMzQndHLE1BQU0sQ0FBQ3VKLFFBQVEsR0FBR3ZKLE1BQU0sQ0FBQ3VKLFFBQVEsR0FBR3ZKLE1BQU0sQ0FBQ3VKLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUMvRCxDQUFDLE1BQ0ksSUFBSW9JLEdBQUcsQ0FBQ25ZLElBQUksS0FBSyxPQUFPLEVBQUU7VUFDM0J3RyxNQUFNLENBQUN3SixTQUFTLEdBQUd4SixNQUFNLENBQUN3SixTQUFTLEdBQUd4SixNQUFNLENBQUN3SixTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDbEU7UUFFQSxJQUFJbUksR0FBRyxDQUFDN04sRUFBRSxJQUFJNk4sR0FBRyxDQUFDN04sRUFBRSxDQUFDOEksVUFBVSxFQUFFO1VBQzdCK0UsR0FBRyxDQUFDN04sRUFBRSxDQUFDOEksVUFBVSxDQUFDcEwsV0FBVyxDQUFDbVEsR0FBRyxDQUFDN04sRUFBRSxDQUFDO1FBQ3pDO1FBRUEsSUFBSXdKLGVBQWUsRUFBRTtVQUNqQkEsZUFBZSxDQUFDdE4sTUFBTSxDQUFDQyxFQUFFLEVBQUUwUixHQUFHLENBQUNuWSxJQUFJLEVBQUVrWSxLQUFLLENBQUM1TyxLQUFLLEVBQUU0TyxLQUFLLENBQUMzTyxLQUFLLENBQUM7UUFDbEU7UUFFQXlFLEtBQUssQ0FBQ3FGLGFBQWEsQ0FBQzRFLFNBQVMsQ0FBQztRQUM5QjtNQUNKO0lBQ0o7RUFDSjtBQUNKO0FBRU8sU0FBU3BMLFlBQVlBLENBQUNtQixLQUFLLEVBQUU3RSxFQUFFLEVBQUVDLEVBQUUsRUFBRS9ILFNBQVMsRUFBRWdJLFFBQVEsR0FBRyxFQUFFLEVBQUU7RUFDbEUsTUFBTStPLElBQUksR0FBR2pQLEVBQUUsR0FBRyxRQUFRLEdBQUdDLEVBQUUsR0FBRyxRQUFRO0VBQzFDLE1BQU1pUCxVQUFVLEdBQUkvRCxJQUFJLENBQUNnRSxHQUFHLENBQUNGLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBSTlELElBQUksQ0FBQ2tDLEtBQUssQ0FBQ2xDLElBQUksQ0FBQ2dFLEdBQUcsQ0FBQ0YsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0VBRWhGLElBQUlDLFVBQVUsR0FBRyxJQUFJLEVBQUU7RUFFdkIsTUFBTUUsS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7RUFDekMsTUFBTUMsU0FBUyxHQUFHbEUsSUFBSSxDQUFDa0MsS0FBSyxDQUFDLENBQUNsQyxJQUFJLENBQUNnRSxHQUFHLENBQUNGLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUc5RCxJQUFJLENBQUNrQyxLQUFLLENBQUNsQyxJQUFJLENBQUNnRSxHQUFHLENBQUNGLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSUcsS0FBSyxDQUFDN1YsTUFBTSxDQUFDO0VBQ2xILE1BQU0rVixVQUFVLEdBQUdGLEtBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBRW5DLE1BQU1QLFNBQVMsR0FBR2pLLEtBQUssQ0FBQ2dCLFlBQVksQ0FBQyxDQUFDO0VBQ3RDaEIsS0FBSyxDQUFDNEIsWUFBWSxDQUFDcUksU0FBUyxFQUFFLFVBQVUsRUFBRTtJQUFFM08sS0FBSyxFQUFFSCxFQUFFO0lBQUVJLEtBQUssRUFBRUgsRUFBRTtJQUFFSSxDQUFDLEVBQUVMLEVBQUUsR0FBR0UsUUFBUTtJQUFFSSxDQUFDLEVBQUVMLEVBQUUsR0FBR0M7RUFBUyxDQUFDLENBQUM7RUFFdkcsTUFBTXFQLEdBQUcsR0FBR3RZLFFBQVEsQ0FBQ0wsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUN6QzJZLEdBQUcsQ0FBQ3JULFNBQVMsR0FBRyxtQkFBbUJvVCxVQUFVLENBQUNoWSxXQUFXLENBQUMsQ0FBQyxFQUFFO0VBQzdEaVksR0FBRyxDQUFDdkosS0FBSyxDQUFDQyxRQUFRLEdBQUcsVUFBVTtFQUMvQnNKLEdBQUcsQ0FBQ3ZKLEtBQUssQ0FBQ0ksS0FBSyxHQUFHLEdBQUdsRyxRQUFRLElBQUk7RUFDakNxUCxHQUFHLENBQUN2SixLQUFLLENBQUNLLE1BQU0sR0FBRyxHQUFHbkcsUUFBUSxJQUFJO0VBQ2xDcVAsR0FBRyxDQUFDdkosS0FBSyxDQUFDM0IsSUFBSSxHQUFHLEdBQUdyRSxFQUFFLEdBQUdFLFFBQVEsSUFBSTtFQUNyQ3FQLEdBQUcsQ0FBQ3ZKLEtBQUssQ0FBQ21ELEdBQUcsR0FBRyxHQUFHbEosRUFBRSxHQUFHQyxRQUFRLElBQUk7RUFDcENxUCxHQUFHLENBQUN2SixLQUFLLENBQUNFLE1BQU0sR0FBRyxHQUFHO0VBQ3RCaE8sU0FBUyxDQUFDMEcsV0FBVyxDQUFDMlEsR0FBRyxDQUFDO0VBRTFCMUssS0FBSyxDQUFDNEIsWUFBWSxDQUFDcUksU0FBUyxFQUFFLFNBQVMsRUFBRTtJQUFFalksSUFBSSxFQUFFeVksVUFBVTtJQUFFbk8sRUFBRSxFQUFFb087RUFBSSxDQUFDLENBQUM7QUFDM0UsQzs7Ozs7Ozs7Ozs7Ozs7QUMvRU8sU0FBU2pNLFlBQVlBLENBQUN1QixLQUFLLEVBQUVrRyxFQUFFLEVBQUV6RCxHQUFHLEVBQUVrSSxRQUFRLEVBQUU7RUFDbkQsTUFBTTlDLFFBQVEsR0FBRzdILEtBQUssQ0FBQ3lELEtBQUssQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQztFQUVsRSxLQUFLLE1BQU1RLE1BQU0sSUFBSTRELFFBQVEsRUFBRTtJQUMzQixNQUFNM0QsR0FBRyxHQUFHbEUsS0FBSyxDQUFDNkMsWUFBWSxDQUFDb0IsTUFBTSxFQUFFLFVBQVUsQ0FBQztJQUNsRCxNQUFNVyxHQUFHLEdBQUc1RSxLQUFLLENBQUM2QyxZQUFZLENBQUNvQixNQUFNLEVBQUUsVUFBVSxDQUFDO0lBQ2xELE1BQU1ZLFVBQVUsR0FBRzdFLEtBQUssQ0FBQzZDLFlBQVksQ0FBQ29CLE1BQU0sRUFBRSxZQUFZLENBQUM7SUFFM0QsSUFBSSxDQUFDWSxVQUFVLENBQUN2SSxFQUFFLEVBQUU7SUFFcEIsTUFBTVcsS0FBSyxHQUFHNEgsVUFBVSxDQUFDNUgsS0FBSztJQUM5QixNQUFNMk4sU0FBUyxHQUFHRCxRQUFRLENBQUMxTixLQUFLLENBQUMsQ0FBQzJILEdBQUcsQ0FBQzFJLFNBQVMsQ0FBQzs7SUFFaEQ7SUFDQSxJQUFJMkksVUFBVSxDQUFDN0gsR0FBRyxLQUFLNE4sU0FBUyxJQUFJL0YsVUFBVSxDQUFDM0gsU0FBUyxLQUFLRCxLQUFLLEVBQUU7TUFDaEU0SCxVQUFVLENBQUM3SCxHQUFHLEdBQUc0TixTQUFTO01BQzFCL0YsVUFBVSxDQUFDbEksWUFBWSxHQUFHLENBQUM7TUFDM0JrSSxVQUFVLENBQUM5SCxhQUFhLEdBQUcwRixHQUFHO01BQzlCb0MsVUFBVSxDQUFDM0gsU0FBUyxHQUFHRCxLQUFLO0lBQ2hDO0lBRUEsTUFBTTROLFVBQVUsR0FBRzVOLEtBQUssS0FBSyxLQUFLLEdBQUc0SCxVQUFVLENBQUNqSSxTQUFTLEdBQUdpSSxVQUFVLENBQUNoSSxVQUFVO0lBQ2pGLE1BQU1pTyxVQUFVLEdBQUc3TixLQUFLLEtBQUssS0FBSyxHQUFHLElBQUksR0FBRzRILFVBQVUsQ0FBQ25JLEdBQUcsR0FBRyxJQUFJLEdBQUdtSSxVQUFVLENBQUMvSCxPQUFPO0lBRXRGLElBQUkyRixHQUFHLEdBQUdvQyxVQUFVLENBQUM5SCxhQUFhLEdBQUcrTixVQUFVLEVBQUU7TUFDN0NqRyxVQUFVLENBQUNsSSxZQUFZLEdBQUcsQ0FBQ2tJLFVBQVUsQ0FBQ2xJLFlBQVksR0FBRyxDQUFDLElBQUlrTyxVQUFVO01BQ3BFaEcsVUFBVSxDQUFDOUgsYUFBYSxHQUFHMEYsR0FBRztJQUNsQztJQUVBLE1BQU1zSSxJQUFJLEdBQUcsRUFBRWxHLFVBQVUsQ0FBQ2xJLFlBQVksR0FBR2tJLFVBQVUsQ0FBQ3RJLFVBQVUsQ0FBQztJQUMvRCxNQUFNeU8sSUFBSSxHQUFHLEVBQUVuRyxVQUFVLENBQUM3SCxHQUFHLEdBQUc2SCxVQUFVLENBQUNySSxXQUFXLENBQUM7SUFFdkRxSSxVQUFVLENBQUN2SSxFQUFFLENBQUM2RSxLQUFLLENBQUM4SixrQkFBa0IsR0FBRyxHQUFHRixJQUFJLE1BQU1DLElBQUksSUFBSTtJQUM5RG5HLFVBQVUsQ0FBQ3ZJLEVBQUUsQ0FBQzZFLEtBQUssQ0FBQytKLFNBQVMsR0FBRyxlQUFlaEgsR0FBRyxDQUFDMUksQ0FBQyxPQUFPMEksR0FBRyxDQUFDekksQ0FBQyxRQUFRO0VBQzVFO0FBQ0osQzs7Ozs7Ozs7Ozs7Ozs7QUNuQ0E7O0FBRU8sTUFBTThDLEtBQUssQ0FBQztFQUNmcUIsV0FBV0EsQ0FBQSxFQUFHO0lBQ1YsSUFBSSxDQUFDdUwsWUFBWSxHQUFHLENBQUM7SUFDckIsSUFBSSxDQUFDdEQsUUFBUSxHQUFHLElBQUk5VCxHQUFHLENBQUMsQ0FBQztJQUN6QixJQUFJLENBQUNxWCxVQUFVLEdBQUcsSUFBSWpMLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLElBQUksQ0FBQ2tMLE9BQU8sR0FBRyxFQUFFO0VBQ3JCO0VBRUFySyxZQUFZQSxDQUFBLEVBQUc7SUFDWCxNQUFNaUQsTUFBTSxHQUFHLElBQUksQ0FBQ2tILFlBQVksRUFBRTtJQUNsQyxJQUFJLENBQUN0RCxRQUFRLENBQUM1VCxHQUFHLENBQUNnUSxNQUFNLENBQUM7SUFDekIsT0FBT0EsTUFBTTtFQUNqQjtFQUVBb0IsYUFBYUEsQ0FBQ3BCLE1BQU0sRUFBRTtJQUNsQixJQUFJLENBQUM0RCxRQUFRLENBQUN5RCxNQUFNLENBQUNySCxNQUFNLENBQUM7SUFDNUIsS0FBSyxNQUFNLENBQUNzSCxhQUFhLEVBQUVDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQ0osVUFBVSxDQUFDSyxPQUFPLENBQUMsQ0FBQyxFQUFFO01BQ25FRCxZQUFZLENBQUNGLE1BQU0sQ0FBQ3JILE1BQU0sQ0FBQztJQUMvQjtFQUNKO0VBRUFyQyxZQUFZQSxDQUFDcUMsTUFBTSxFQUFFc0gsYUFBYSxFQUFFRyxhQUFhLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQ04sVUFBVSxDQUFDdkYsR0FBRyxDQUFDMEYsYUFBYSxDQUFDLEVBQUU7TUFDckMsSUFBSSxDQUFDSCxVQUFVLENBQUNsSixHQUFHLENBQUNxSixhQUFhLEVBQUUsSUFBSXBMLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakQ7SUFDQSxJQUFJLENBQUNpTCxVQUFVLENBQUMzUSxHQUFHLENBQUM4USxhQUFhLENBQUMsQ0FBQ3JKLEdBQUcsQ0FBQytCLE1BQU0sRUFBRXlILGFBQWEsQ0FBQztFQUNqRTtFQUVBN0ksWUFBWUEsQ0FBQ29CLE1BQU0sRUFBRXNILGFBQWEsRUFBRTtJQUNoQyxNQUFNQyxZQUFZLEdBQUcsSUFBSSxDQUFDSixVQUFVLENBQUMzUSxHQUFHLENBQUM4USxhQUFhLENBQUM7SUFDdkQsT0FBT0MsWUFBWSxHQUFHQSxZQUFZLENBQUMvUSxHQUFHLENBQUN3SixNQUFNLENBQUMsR0FBRy9RLFNBQVM7RUFDOUQ7RUFFQXFTLGVBQWVBLENBQUN0QixNQUFNLEVBQUVzSCxhQUFhLEVBQUU7SUFDbkMsTUFBTUMsWUFBWSxHQUFHLElBQUksQ0FBQ0osVUFBVSxDQUFDM1EsR0FBRyxDQUFDOFEsYUFBYSxDQUFDO0lBQ3ZELElBQUlDLFlBQVksRUFBRTtNQUNkQSxZQUFZLENBQUNGLE1BQU0sQ0FBQ3JILE1BQU0sQ0FBQztJQUMvQjtFQUNKO0VBRUFSLEtBQUtBLENBQUMsR0FBR2tJLGNBQWMsRUFBRTtJQUNyQixJQUFJQSxjQUFjLENBQUNqWCxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRTtJQUUxQyxNQUFNa1gsUUFBUSxHQUFHLElBQUksQ0FBQ1IsVUFBVSxDQUFDM1EsR0FBRyxDQUFDa1IsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELElBQUksQ0FBQ0MsUUFBUSxFQUFFLE9BQU8sRUFBRTtJQUV4QixNQUFNQyxPQUFPLEdBQUcsRUFBRTtJQUNsQixLQUFLLE1BQU01SCxNQUFNLElBQUkySCxRQUFRLENBQUNsSCxJQUFJLENBQUMsQ0FBQyxFQUFFO01BQ2xDLElBQUlvSCxNQUFNLEdBQUcsSUFBSTtNQUNqQixLQUFLLElBQUlyRSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdrRSxjQUFjLENBQUNqWCxNQUFNLEVBQUUrUyxDQUFDLEVBQUUsRUFBRTtRQUM1QyxNQUFNbkYsR0FBRyxHQUFHLElBQUksQ0FBQzhJLFVBQVUsQ0FBQzNRLEdBQUcsQ0FBQ2tSLGNBQWMsQ0FBQ2xFLENBQUMsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQ25GLEdBQUcsSUFBSSxDQUFDQSxHQUFHLENBQUN1RCxHQUFHLENBQUM1QixNQUFNLENBQUMsRUFBRTtVQUMxQjZILE1BQU0sR0FBRyxLQUFLO1VBQ2Q7UUFDSjtNQUNKO01BQ0EsSUFBSUEsTUFBTSxJQUFJLElBQUksQ0FBQ2pFLFFBQVEsQ0FBQ2hDLEdBQUcsQ0FBQzVCLE1BQU0sQ0FBQyxFQUFFO1FBQ3JDNEgsT0FBTyxDQUFDclgsSUFBSSxDQUFDeVAsTUFBTSxDQUFDO01BQ3hCO0lBQ0o7SUFDQSxPQUFPNEgsT0FBTztFQUNsQjtFQUVBN0YsU0FBU0EsQ0FBQytGLGNBQWMsRUFBRTtJQUN0QixJQUFJLENBQUNWLE9BQU8sQ0FBQzdXLElBQUksQ0FBQ3VYLGNBQWMsQ0FBQztFQUNyQztFQUVBNUYsTUFBTUEsQ0FBQ0QsRUFBRSxFQUFFekQsR0FBRyxFQUFFO0lBQ1osS0FBSyxNQUFNdUosTUFBTSxJQUFJLElBQUksQ0FBQ1gsT0FBTyxFQUFFO01BQy9CVyxNQUFNLENBQUMsSUFBSSxFQUFFOUYsRUFBRSxFQUFFekQsR0FBRyxDQUFDO0lBQ3pCO0VBQ0o7QUFDSixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUV5RDtBQUNvQjtBQUV0RSxNQUFNdkQsU0FBUyxHQUFHLEVBQUU7QUFDM0IsTUFBTStNLGdCQUFnQixHQUFHLENBQUM7QUFFMUIsTUFBTUMsTUFBTSxHQUFHO0VBQ1gsQ0FBQyxFQUFFLGlDQUFpQztFQUNwQyxDQUFDLEVBQUUsZ0NBQWdDO0VBQ25DLENBQUMsRUFBRTtBQUNQLENBQUM7QUFFRCxNQUFNLENBQUNDLFVBQVUsRUFBRTNWLGFBQWEsQ0FBQyxHQUFHN0Msd0VBQVksQ0FBQyxVQUFVLENBQUM7QUFDNUQsTUFBTSxDQUFDbU8sS0FBSyxFQUFFL0MsUUFBUSxDQUFDLEdBQUdwTCx3RUFBWSxDQUFDLENBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUNtSSxLQUFLLEVBQUVtRCxRQUFRLENBQUMsR0FBR3RMLHdFQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLE1BQU0sQ0FBQ3lLLEtBQUssRUFBRVUsUUFBUSxDQUFDLEdBQUduTCx3RUFBWSxDQUFDLENBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUM4SixLQUFLLEVBQUV1QixRQUFRLENBQUMsR0FBR3JMLHdFQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ3dCO0FBRWpFLE1BQU15WSxNQUFNLEdBQUdyYSxrRUFBQTtFQUFNMEgsS0FBSyxFQUFDO0FBQWEsQ0FBTyxDQUFDO0FBRWhEbEYsd0VBQVksQ0FBQyxNQUFNO0VBQUU2WCxNQUFNLENBQUN0UyxXQUFXLEdBQUdxUyxVQUFVLENBQUMsQ0FBQztBQUFFLENBQUMsQ0FBQztBQUUxRCxNQUFNRSxPQUFPLEdBQUd0YSxrRUFBQTtFQUFNMEgsS0FBSyxFQUFDO0FBQXlCLENBQU8sQ0FBQztBQUM3RCxNQUFNNlMsT0FBTyxHQUFHdmEsa0VBQUE7RUFBTTBILEtBQUssRUFBQztBQUF5QixDQUFPLENBQUM7QUFDN0QsTUFBTThTLE9BQU8sR0FBR3hhLGtFQUFBO0VBQU0wSCxLQUFLLEVBQUM7QUFBeUIsQ0FBTyxDQUFDO0FBQzdELE1BQU0rUyxPQUFPLEdBQUd6YSxrRUFBQTtFQUFNMEgsS0FBSyxFQUFDO0FBQXlCLENBQU8sQ0FBQztBQUU3RGxGLHdFQUFZLENBQUMsTUFBTTtFQUFFOFgsT0FBTyxDQUFDdlMsV0FBVyxHQUFHZ0ksS0FBSyxDQUFDLENBQUM7QUFBRSxDQUFDLENBQUM7QUFDdER2Tix3RUFBWSxDQUFDLE1BQU07RUFBRStYLE9BQU8sQ0FBQ3hTLFdBQVcsR0FBR2dDLEtBQUssQ0FBQyxDQUFDO0FBQUUsQ0FBQyxDQUFDO0FBQ3REdkgsd0VBQVksQ0FBQyxNQUFNO0VBQUVnWSxPQUFPLENBQUN6UyxXQUFXLEdBQUdzRSxLQUFLLENBQUMsQ0FBQztBQUFFLENBQUMsQ0FBQztBQUN0RDdKLHdFQUFZLENBQUMsTUFBTTtFQUFFaVksT0FBTyxDQUFDMVMsV0FBVyxHQUFHMkQsS0FBSyxDQUFDLENBQUM7QUFBRSxDQUFDLENBQUM7QUFFdEQsU0FBU3JILElBQUlBLENBQUM7RUFBRTZCO0FBQUssQ0FBQyxFQUFFO0VBQ3BCLE1BQU13VSxVQUFVLEdBQUd4VSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUN2RCxNQUFNLEdBQUd3SyxTQUFTO0VBQzdDLE1BQU13TixXQUFXLEdBQUd6VSxJQUFJLENBQUN2RCxNQUFNLEdBQUd3SyxTQUFTO0VBQzNDLE1BQU15TixlQUFlLEdBQUdGLFVBQVUsR0FBR1IsZ0JBQWdCLEdBQUcsQ0FBQztFQUN6RCxNQUFNVyxnQkFBZ0IsR0FBR0YsV0FBVyxHQUFHVCxnQkFBZ0IsR0FBRyxDQUFDO0VBQzNELE1BQU1ZLElBQUksR0FBRyxFQUFFO0VBQ2YsS0FBSyxJQUFJQyxRQUFRLEdBQUcsQ0FBQyxFQUFFQSxRQUFRLEdBQUc3VSxJQUFJLENBQUN2RCxNQUFNLEVBQUVvWSxRQUFRLEVBQUUsRUFBRTtJQUN2RCxNQUFNeEYsS0FBSyxHQUFHLEVBQUU7SUFDaEIsS0FBSyxJQUFJeUYsUUFBUSxHQUFHLENBQUMsRUFBRUEsUUFBUSxHQUFHOVUsSUFBSSxDQUFDNlUsUUFBUSxDQUFDLENBQUNwWSxNQUFNLEVBQUVxWSxRQUFRLEVBQUUsRUFBRTtNQUNqRSxNQUFNaEcsSUFBSSxHQUFHOU8sSUFBSSxDQUFDNlUsUUFBUSxDQUFDLENBQUNDLFFBQVEsQ0FBQztNQUNyQyxJQUFJMVYsU0FBUyxHQUFHLE1BQU07TUFDdEIsSUFBSThKLEtBQUssR0FBRyxTQUFTakMsU0FBUyxhQUFhQSxTQUFTLEtBQUs7TUFFekQsSUFBSTZILElBQUksS0FBSyxDQUFDLElBQUlBLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDMUIxUCxTQUFTLElBQUksYUFBYTtNQUM5QjtNQUNBLElBQUkwUCxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ1oxUCxTQUFTLElBQUksWUFBWTtRQUN6QjhKLEtBQUssSUFBSSx3QkFBd0IrSyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUc7TUFDakQ7TUFDQSxJQUFJbkYsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNaNUYsS0FBSyxJQUFJLHdCQUF3QitLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRztNQUNqRDtNQUNBLElBQUluRixJQUFJLEtBQUssQ0FBQyxJQUFJQSxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQzFCNUYsS0FBSyxJQUFJLHdCQUF3QitLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRztNQUNqRDtNQUVBNUUsS0FBSyxDQUFDOVMsSUFBSSxDQUFDekMsa0VBQUE7UUFBSzBILEtBQUssRUFBRXBDLFNBQVU7UUFBQyxVQUFRMFYsUUFBUztRQUFDLFVBQVFELFFBQVM7UUFBQzNMLEtBQUssRUFBRUE7TUFBTSxDQUFNLENBQUMsQ0FBQztJQUMvRjtJQUNBMEwsSUFBSSxDQUFDclksSUFBSSxDQUFDekMsa0VBQUE7TUFBSzBILEtBQUssRUFBQztJQUFVLEdBQUU2TixLQUFXLENBQUMsQ0FBQztFQUNsRDtFQUVBLE9BQ0l2VixrRUFBQTtJQUFLMEgsS0FBSyxFQUFDO0VBQWdCLEdBQ3ZCMUgsa0VBQUE7SUFBSzBILEtBQUssRUFBQztFQUFZLEdBQ25CMUgsa0VBQUE7SUFBSzBILEtBQUssRUFBQztFQUFXLEdBQ2pCMlMsTUFBTSxFQUNQcmEsa0VBQUE7SUFBSzBILEtBQUssRUFBQztFQUFhLEdBQ3BCMUgsa0VBQUE7SUFBSzBILEtBQUssRUFBQztFQUFZLEdBQ25CMUgsa0VBQUE7SUFBTTBILEtBQUssRUFBQztFQUFZLEdBQUMsT0FBVyxDQUFDLEVBQ3BDNFMsT0FDQSxDQUFDLEVBQ050YSxrRUFBQTtJQUFLMEgsS0FBSyxFQUFDO0VBQVksR0FDbkIxSCxrRUFBQTtJQUFNMEgsS0FBSyxFQUFDO0VBQVksR0FBQyxPQUFXLENBQUMsRUFDcEM2UyxPQUNBLENBQUMsRUFDTnZhLGtFQUFBO0lBQUswSCxLQUFLLEVBQUM7RUFBWSxHQUNuQjFILGtFQUFBO0lBQU0wSCxLQUFLLEVBQUM7RUFBWSxHQUFDLE9BQVcsQ0FBQyxFQUNwQzhTLE9BQ0EsQ0FBQyxFQUNOeGEsa0VBQUE7SUFBSzBILEtBQUssRUFBQztFQUFZLEdBQ25CMUgsa0VBQUE7SUFBTTBILEtBQUssRUFBQztFQUFZLEdBQUMsT0FBVyxDQUFDLEVBQ3BDK1MsT0FDQSxDQUNKLENBQ0osQ0FBQyxFQUNOemEsa0VBQUE7SUFBSzBILEtBQUssRUFBQyxrQkFBa0I7SUFBQzBILEtBQUssRUFBRSxTQUFTd0wsZUFBZSxhQUFhQyxnQkFBZ0I7RUFBTSxHQUM1RjdhLGtFQUFBO0lBQ0kwRyxFQUFFLEVBQUMsZ0JBQWdCO0lBQ25CZ0IsS0FBSyxFQUFDLFdBQVc7SUFDakIwSCxLQUFLLEVBQUUsMkJBQTJCc0wsVUFBVSxhQUFhQyxXQUFXO0VBQU0sR0FFekVHLElBQ0EsQ0FDSixDQUNKLENBQ0osQ0FBQztBQUVkO0FBRUEsaUVBQWV6VyxJQUFJLEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZHc0M7QUFDb0I7QUFDaEM7QUFFN0MsSUFBSSxDQUFDNFcsTUFBTSxFQUFFelcsU0FBUyxDQUFDLEdBQUc1Qyx3RUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCO0FBRXJCLElBQUlzWixRQUFRLEdBQUdsYixrRUFBQSxZQUFHLFdBQVksQ0FBQztBQUMvQixJQUFJbWIsU0FBUyxHQUFHbmIsa0VBQUEsWUFBRyxlQUFnQixDQUFDO0FBQ3BDLElBQUlvYixNQUFNLEdBQUdwYixrRUFBQSxVQUFNLENBQUM7QUFDcEIsSUFBSXFiLE9BQU8sR0FBR3JiLGtFQUFBLFlBQUcsU0FBVSxDQUFDO0FBRTVCd0Msd0VBQVksQ0FBQyxNQUFNO0VBQ2YsTUFBTThZLENBQUMsR0FBR0wsTUFBTSxDQUFDLENBQUM7RUFDbEJDLFFBQVEsQ0FBQ25ULFdBQVcsR0FBRyxZQUFZdVQsQ0FBQyxDQUFDeFYsTUFBTSxFQUFFO0VBQzdDcVYsU0FBUyxDQUFDcFQsV0FBVyxHQUFHLFlBQVl1VCxDQUFDLENBQUN2VixZQUFZLE1BQU07RUFDeERxVixNQUFNLENBQUNyVCxXQUFXLEdBQUd1VCxDQUFDLENBQUNyVixJQUFJLElBQUksRUFBRTtFQUVqQyxJQUFJcVYsQ0FBQyxDQUFDQyxXQUFXLEVBQUU7SUFDZkYsT0FBTyxDQUFDdFQsV0FBVyxHQUFHLHFCQUFxQjtFQUMvQyxDQUFDLE1BQU07SUFDSCxNQUFNeVQsU0FBUyxHQUFJLENBQUNGLENBQUMsQ0FBQ3RWLFdBQVcsR0FBSSw2QkFBNkIsR0FBRyxHQUFHc1YsQ0FBQyxDQUFDdFYsV0FBVyxVQUFVO0lBQy9GcVYsT0FBTyxDQUFDdFQsV0FBVyxHQUFHLFVBQVV5VCxTQUFTLEVBQUU7RUFDL0M7QUFDSixDQUFDLENBQUM7QUFFRixTQUFTalgsS0FBS0EsQ0FBQSxFQUFHO0VBQ2IsT0FDSXZFLGtFQUFBO0lBQUswSCxLQUFLLEVBQUM7RUFBaUIsR0FDeEIxSCxrRUFBQTtJQUFLMEgsS0FBSyxFQUFDO0VBQVcsR0FDbEIxSCxrRUFBQSxhQUFJLE9BQVMsQ0FBQyxFQUNia2IsUUFBUSxFQUNSQyxTQUFTLEVBQ1RDLE1BQU0sRUFDTkMsT0FDQSxDQUFDLEVBQ05yYixrRUFBQSxDQUFDd0gsd0RBQVcsTUFBRSxDQUNiLENBQUM7QUFFZDtBQUVBLGlFQUFlakQsS0FBSyxFOzs7Ozs7Ozs7Ozs7Ozs7QUN6Q3FDO0FBRXpELE1BQU1rWCxTQUFTLEdBQUd6YixrRUFBQTtFQUFRMEgsS0FBSyxFQUFDO0FBQWUsR0FBQyxZQUFrQixDQUFDO0FBRW5FK1QsU0FBUyxDQUFDOWEsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07RUFDdEM0QyxRQUFRLENBQUNtWSxNQUFNLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUM7QUFFRixJQUFJQyxNQUFNLEdBQ04zYixrRUFBQTtFQUFLMEgsS0FBSyxFQUFDO0FBQVUsR0FDakIxSCxrRUFBQSxhQUFJLFVBQVksQ0FBQyxFQUNqQkEsa0VBQUEsWUFBRyx1Q0FBd0MsQ0FBQyxFQUMzQ3liLFNBQ0EsQ0FDUjtBQUVjLFNBQVNuWCxJQUFJQSxDQUFBLEVBQUc7RUFDM0IsT0FBT3FYLE1BQU07QUFDakIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEJ5RDtBQUNWO0FBQzhCO0FBRTdFLE1BQU0sQ0FBQzdVLEtBQUssRUFBRTFDLFFBQVEsQ0FBQyxHQUFHeEMsd0VBQVksQ0FBQyxFQUFFLENBQUM7QUFDdEI7QUFFcEIsU0FBU3VDLFFBQVFBLENBQUM7RUFBRWE7QUFBSSxDQUFDLEVBQUU7RUFDdkIsSUFBSTRXLFNBQVMsR0FBRyxLQUFLO0VBQ3JCLE1BQU1DLE9BQU8sR0FBRzdiLGtFQUFBO0lBQUcwSCxLQUFLLEVBQUM7RUFBZ0IsQ0FBSSxDQUFDO0VBRTlDbEYsd0VBQVksQ0FBQyxNQUFNO0lBQ2ZxWixPQUFPLENBQUM5VCxXQUFXLEdBQUdqQixLQUFLLENBQUMsQ0FBQztFQUNqQyxDQUFDLENBQUM7RUFFRixJQUFJZ1YsV0FBVyxHQUFJelQsQ0FBQyxJQUFLO0lBQ3JCQSxDQUFDLENBQUNDLGNBQWMsQ0FBQyxDQUFDO0lBRWxCLE1BQU1DLFFBQVEsR0FBRyxJQUFJQyxRQUFRLENBQUNILENBQUMsQ0FBQzBULGFBQWEsQ0FBQztJQUM5QyxNQUFNblYsUUFBUSxHQUFHMkIsUUFBUSxDQUFDRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUNDLElBQUksQ0FBQyxDQUFDO0lBRWhELElBQUksQ0FBQy9CLFFBQVEsSUFBSUEsUUFBUSxDQUFDakUsTUFBTSxHQUFHLEVBQUUsRUFBRTtNQUNuQ3lCLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQztNQUM1QjtJQUNKO0lBRUFBLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDWndYLFNBQVMsR0FBRyxJQUFJO0lBQ2hCblgsMkRBQWEsQ0FBQ21DLFFBQVEsQ0FBQztJQUV2QjVCLEdBQUcsQ0FBQzZELElBQUksQ0FBQ25ELElBQUksQ0FBQ29ELFNBQVMsQ0FBQztNQUNwQjdJLElBQUksRUFBRSx3QkFBd0I7TUFDOUIyRyxRQUFRLEVBQUVBO0lBQ2QsQ0FBQyxDQUFDLENBQUM7RUFDUCxDQUFDO0VBRUQsT0FDSTVHLGtFQUFBO0lBQU0wSCxLQUFLLEVBQUMsZUFBZTtJQUFDcUIsUUFBUSxFQUFFK1M7RUFBWSxHQUM3Q0QsT0FBTyxFQUNSN2Isa0VBQUE7SUFBTzBILEtBQUssRUFBQyxnQkFBZ0I7SUFBQ3pILElBQUksRUFBQyxNQUFNO0lBQUMrSSxJQUFJLEVBQUMsVUFBVTtJQUFDQyxXQUFXLEVBQUMsaUJBQWlCO0lBQUNDLFNBQVMsRUFBQztFQUFJLENBQUMsQ0FBQyxFQUN4R2xKLGtFQUFBO0lBQVEwSCxLQUFLLEVBQUMsaUJBQWlCO0lBQUN6SCxJQUFJLEVBQUM7RUFBUSxHQUFDLGVBQXFCLENBQ2pFLENBQUM7QUFFZjtBQUVBLGlFQUFla0UsUUFBUSxFOzs7Ozs7Ozs7Ozs7OztBQzdDdkIsTUFBTVEsS0FBSyxDQUFDO0VBQ1JrSixXQUFXQSxDQUFDbU8sR0FBRyxFQUFFO0lBQ2IsSUFBSSxDQUFDQyxLQUFLLEdBQUcsSUFBSUMsS0FBSyxDQUFDRixHQUFHLENBQUM7SUFDM0IsSUFBSSxDQUFDRyxNQUFNLEdBQUc5YixRQUFRLENBQUNMLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDOUMsSUFBSSxDQUFDb2MsSUFBSSxHQUFHL2IsUUFBUSxDQUFDTCxhQUFhLENBQUMsR0FBRyxDQUFDO0lBRXZDLElBQUksQ0FBQ2ljLEtBQUssQ0FBQ0ksSUFBSSxHQUFHLElBQUk7SUFDdEIsSUFBSSxDQUFDSixLQUFLLENBQUNLLE1BQU0sR0FBRyxHQUFHO0lBRXZCLElBQUksQ0FBQ0gsTUFBTSxDQUFDN1csU0FBUyxHQUFHLGNBQWM7SUFDdEMsSUFBSSxDQUFDNlcsTUFBTSxDQUFDbGMsSUFBSSxHQUFHLFFBQVE7SUFDM0IsSUFBSSxDQUFDa2MsTUFBTSxDQUFDdmIsWUFBWSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztJQUN4RCxJQUFJLENBQUN1YixNQUFNLENBQUNuYixNQUFNLENBQUMsSUFBSSxDQUFDb2IsSUFBSSxDQUFDO0VBQ2pDO0VBRUFoWCxJQUFJQSxDQUFBLEVBQUc7SUFDSCxJQUFJLENBQUMrVyxNQUFNLENBQUN4YixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUM0YixNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRTFEbGMsUUFBUSxDQUFDZ0YsSUFBSSxDQUFDckUsTUFBTSxDQUFDLElBQUksQ0FBQ21iLE1BQU0sQ0FBQztJQUVqQyxJQUFJLENBQUNLLFlBQVksQ0FBQyxDQUFDO0VBQ3ZCO0VBRUFDLElBQUlBLENBQUEsRUFBRztJQUNILElBQUksQ0FBQ1IsS0FBSyxDQUFDUSxJQUFJLENBQUMsQ0FBQyxDQUNaQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUNGLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FDL0JHLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQ0gsWUFBWSxDQUFDLENBQUMsQ0FBQztFQUN6QztFQUVBRCxNQUFNQSxDQUFBLEVBQUc7SUFDTCxJQUFJLElBQUksQ0FBQ04sS0FBSyxDQUFDVyxNQUFNLElBQUksSUFBSSxDQUFDWCxLQUFLLENBQUNZLEtBQUssRUFBRTtNQUN2QyxJQUFJLENBQUNaLEtBQUssQ0FBQ1ksS0FBSyxHQUFHLEtBQUs7TUFDeEIsSUFBSSxDQUFDVixNQUFNLENBQUN2YixZQUFZLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDO01BQ3hELElBQUksQ0FBQzZiLElBQUksQ0FBQyxDQUFDO0lBQ2YsQ0FBQyxNQUFNO01BQ0gsSUFBSSxDQUFDUixLQUFLLENBQUNZLEtBQUssR0FBRyxJQUFJO01BQ3ZCLElBQUksQ0FBQ1YsTUFBTSxDQUFDdmIsWUFBWSxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUM7TUFDdkQsSUFBSSxDQUFDNGIsWUFBWSxDQUFDLENBQUM7SUFDdkI7RUFDSjtFQUVBQSxZQUFZQSxDQUFBLEVBQUc7SUFDWCxNQUFNTSxPQUFPLEdBQUcsSUFBSSxDQUFDYixLQUFLLENBQUNZLEtBQUssSUFBSSxJQUFJLENBQUNaLEtBQUssQ0FBQ1csTUFBTTtJQUVyRCxJQUFJLENBQUNSLElBQUksQ0FBQzlXLFNBQVMsR0FBR3dYLE9BQU8sR0FBRyx3QkFBd0IsR0FBRyx5QkFBeUI7SUFDcEYsSUFBSSxDQUFDWCxNQUFNLENBQUNZLFNBQVMsQ0FBQ1IsTUFBTSxDQUFDLFVBQVUsRUFBRU8sT0FBTyxDQUFDO0VBQ3JEO0FBQ0o7QUFFQSxpRUFBZW5ZLEtBQUssRTs7Ozs7O1VDakRwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQzVCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2hhdC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3dvcmxkLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyLCB7IHNldEVycm9yIH0gZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFN0YXRlcyB9IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSBhcyBzZXRIdWRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBTb3VuZCBmcm9tIFwiLi4vdXRpbHMvc291bmRcIjtcbmltcG9ydCB7IHNldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5pbXBvcnQgeyBHYW1lRW5naW5lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7IFxuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0OjUwMDBcIik7XG5jb25zdCBzb3VuZCA9IG5ldyBTb3VuZChcIi4vYXNzZXRzL3NvdW5kcy9iYWNrZ3JvdW5kX211c2ljLm1wM1wiKTtcbmxldCBjdXJyZW50R2FtZUVuZ2luZSA9IG51bGw7XG5cbnNvdW5kLmluaXQoKTtcblxucm91dGVyLm9uKFwiL1wiLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcInJlZ2lzdGVyLXBhZ2VcIjtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKHdzKSA9PiB7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJyb29tX3VwZGF0ZVwiOlxuICAgICAgICBjYXNlIFwibG9iYnlfdGltZXJcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJsb2JieS1wYWdlXCI7XG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb25hdGluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXRlcyh7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IG1lc3NhZ2UucGxheWVyc0NvdW50LFxuICAgICAgICAgICAgICAgIHNlY29uZHNMZWZ0OiBtZXNzYWdlLnNlY29uZHNMZWZ0LFxuICAgICAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UudGV4dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfc3RhcnRlZFwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZW5kZXIoPEdhbWUgZ3JpZD17bWVzc2FnZS5ncmlkfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSAobWVzc2FnZS5wbGF5ZXJzIHx8IFtdKS5maW5kKHBsYXllciA9PiBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UueW91clBsYXllcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIGxvY2FsUGxheWVyLm5pY2tuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIdWRQbGF5ZXJOYW1lKGxvY2FsUGxheWVyLm5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBHYW1lRW5naW5lKGdhbWVDb250YWluZXIsIG1lc3NhZ2UuZ3JpZCwgd3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lLmluaXQobWVzc2FnZS55b3VyUGxheWVySWQsIG1lc3NhZ2UucGxheWVycyB8fCBbXSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2FtZSBjb250YWluZXIgd2FzIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwicm9vbV9hbG9uZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgIGNhc2UgXCJjaGF0X21lc3NhZ2VcIjpcbiAgICAgICAgICAgIHNldE1lc3NhZ2VzKHByZXYgPT4gWy4uLnByZXYsIHtcbiAgICAgICAgICAgICAgICBuaWNrbmFtZTogbWVzc2FnZS5uaWNrbmFtZSB8fCBcIlBsYXllclwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UubWVzc2FnZSxcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfZGFtYWdlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUGxheWVyRGFtYWdlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJnYW1lX292ZXJcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZUdhbWVPdmVyKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVycm9yXCI6XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPT09IFwicmVnaXN0ZXItcGFnZVwiKSB7XG4gICAgICAgICAgICAgICAgc2V0RXJyb3IobWVzc2FnZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQobWVzc2FnZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yXCIsIGVycik7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZWRcIik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgd3NzO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCB3c3MgZnJvbSBcIi4uL2FwcC9hcHBcIjtcblxuY29uc3QgW21lc3NhZ2VzLCBzZXRNZXNzYWdlc10gPSBjcmVhdGVTaWduYWwoW10pO1xuZXhwb3J0IHsgc2V0TWVzc2FnZXMgfTtcblxuZnVuY3Rpb24gQ2hhdFBsYXllcnMoKSB7XG4gICAgY29uc3QgbWVzc2FnZXNDb250YWluZXIgPSA8ZGl2IGNsYXNzPVwibWVzc2FnZXNcIj48L2Rpdj47XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBtc2dzID0gbWVzc2FnZXMoKTtcbiAgICAgICAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBmb3IgKGxldCBtc2cgb2YgbXNncykge1xuICAgICAgICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBtc2cgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBwLnRleHRDb250ZW50ID0gbXNnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwLnRleHRDb250ZW50ID0gYCR7bXNnLm5pY2tuYW1lfTogJHttc2cubWVzc2FnZX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXNDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5yZW1vdmVDaGlsZChtZXNzYWdlc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgbXNncy51bnNoaWZ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZm9ybURhdGEuZ2V0KFwibWVzc2FnZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJjaGF0X21lc3NhZ2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH0pKTtcbiAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdFwiIG9uU3VibWl0PXticm9hZGNhc3RNZXNzYWdlfT5cbiAgICAgICAgICAgIHttZXNzYWdlc0NvbnRhaW5lcn1cbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJ0eXBlIHRvIHRoZSBvdGhlciBwbGF5ZXJzIC4uLlwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVycztcbiIsIi8vIC9zcmMvZWNzL2NvbXBvbmVudHMuanNcblxuZXhwb3J0IGNvbnN0IFBvc2l0aW9uQ29tcG9uZW50ID0gKGd4LCBneSwgdGlsZVNpemUgPSA2NCkgPT4gKHtcbiAgICBncmlkWDogZ3gsXG4gICAgZ3JpZFk6IGd5LFxuICAgIHg6IGd4ICogdGlsZVNpemUsXG4gICAgeTogZ3kgKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRYOiBneCAqIHRpbGVTaXplLFxuICAgIHRhcmdldFk6IGd5ICogdGlsZVNpemVcbn0pO1xuXG5leHBvcnQgY29uc3QgVmVsb2NpdHlDb21wb25lbnQgPSAoYmFzZVNwZWVkID0gMi41KSA9PiAoe1xuICAgIGJhc2VTcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkOiBiYXNlU3BlZWQsXG4gICAgc3BlZWRCb29zdDogMCxcbiAgICBzcGVlZEJvb3N0VGltZVJlbWFpbmluZzogMCxcbiAgICBpc01vdmluZzogZmFsc2UsXG4gICAgZGlyZWN0aW9uOiAnZG93bidcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5wdXRDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGlucHV0UXVldWU6IFtdXG59KTtcblxuZXhwb3J0IGNvbnN0IFJlbmRlcmFibGVDb21wb25lbnQgPSAoZWwsIGZyYW1lV2lkdGggPSA2NCwgZnJhbWVIZWlnaHQgPSA2NCwgdG90YWxGcmFtZXMgPSA0LCBmcHMgPSAxMikgPT4gKHtcbiAgICBlbDogZWwsXG4gICAgZnJhbWVXaWR0aDogZnJhbWVXaWR0aCxcbiAgICBmcmFtZUhlaWdodDogZnJhbWVIZWlnaHQsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiB0b3RhbEZyYW1lcyxcbiAgICBydW5GcmFtZXM6IDQsXG4gICAgaWRsZUZyYW1lczogMixcbiAgICBmcHM6IGZwcyxcbiAgICBpZGxlRnBzOiA0LFxuICAgIGxhc3RGcmFtZVRpbWU6IDAsXG4gICAgcm93OiAwLFxuICAgIHN0YXRlOiAnSURMRScsXG4gICAgbGFzdFN0YXRlOiAnSURMRSdcbn0pO1xuXG5leHBvcnQgY29uc3QgUGxheWVyQ29tcG9uZW50ID0gKGlkLCBjaGFyVHlwZSwgaXNMb2NhbCA9IGZhbHNlKSA9PiAoe1xuICAgIGlkOiBpZCxcbiAgICBjaGFyVHlwZTogY2hhclR5cGUsXG4gICAgaXNMb2NhbDogaXNMb2NhbFxufSk7XG5cbmV4cG9ydCBjb25zdCBCb21iQ29tcG9uZW50ID0gKG93bmVySWQsIHRpbWVyID0gMjAwMCwgcmFuZ2UgPSAyKSA9PiAoe1xuICAgIG93bmVySWQ6IG93bmVySWQsXG4gICAgdGltZXI6IHRpbWVyLFxuICAgIHJhbmdlOiByYW5nZSxcbiAgICBleHBsb2RlZDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgRXhwbG9zaW9uQ29tcG9uZW50ID0gKGR1cmF0aW9uID0gNTAwKSA9PiAoe1xuICAgIGR1cmF0aW9uOiBkdXJhdGlvblxufSk7XG5cbmV4cG9ydCBjb25zdCBQb3dlclVwQ29tcG9uZW50ID0gKHR5cGUpID0+ICh7XG4gICAgdHlwZTogdHlwZSwgXG4gICAgcGlja2VkVXA6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEJlaGF2aW9yQ29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBnaG9zdE1vZGU6IGZhbHNlLFxuICAgIHRocm93YWJsZTogZmFsc2UsXG4gICAgZGV0b25hdG9yOiBmYWxzZSxcbiAgICBmYXN0U2hvZXNMZXZlbDogMSxcbiAgICBib21iczoge1xuICAgICAgICBtYXg6IDEsXG4gICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgIHJhbmdlOiAyXG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQuanMnO1xuaW1wb3J0IHtcbiAgICBQb3NpdGlvbkNvbXBvbmVudCxcbiAgICBWZWxvY2l0eUNvbXBvbmVudCxcbiAgICBJbnB1dENvbXBvbmVudCxcbiAgICBSZW5kZXJhYmxlQ29tcG9uZW50LFxuICAgIFBsYXllckNvbXBvbmVudCxcbiAgICBCb21iQ29tcG9uZW50XG59IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5cbmltcG9ydCB7IG1vdmVtZW50U3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL21vdmVtZW50U3lzdGVtLmpzJztcbmltcG9ydCB7IHJlbmRlclN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgYm9tYlN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9ib21iU3lzdGVtLmpzJztcbmltcG9ydCB7IGFwcGx5U3BlZWRQb3dlclVwLCBwb3dlclVwU3lzdGVtLCBzcGF3blBvd2VyVXAgfSBmcm9tICcuL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyc7XG5pbXBvcnQgeyBzZXRCb21icywgc2V0TGl2ZXMsIHNldFJhbmdlLCBzZXRTcGVlZCwgVElMRV9TSVpFIH0gZnJvbSAnLi4vcGFnZXMvZ2FtZSc7XG5cbmNvbnN0IFNQUklURV9DT0xVTU5TID0gMTM7XG5jb25zdCBTUFJJVEVfUk9XUyA9IDU0O1xuY29uc3QgQU5JTUFUSU9OX1JPV1MgPSB7XG4gICAgUlVOOiB7IHVwOiAzOCwgbGVmdDogMzksIGRvd246IDQwLCByaWdodDogNDEgfSxcbiAgICBJRExFOiB7IHVwOiAyMiwgbGVmdDogMjMsIGRvd246IDI0LCByaWdodDogMjUgfVxufTtcblxuZXhwb3J0IGNsYXNzIEdhbWVFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0NvbnRhaW5lciwgbWFwRGF0YSwgc29ja2V0KSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY2FudmFzQ29udGFpbmVyO1xuICAgICAgICB0aGlzLm1hcERhdGEgPSBtYXBEYXRhO1xuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xuICAgICAgICB0aGlzLmxvY2FsUGxheWVyRW50aXR5ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IDA7XG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzID0gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIGluaXQobG9jYWxQbGF5ZXJJZCwgYWxsUGxheWVycykge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCA9IFN0cmluZyhsb2NhbFBsYXllcklkKTtcblxuICAgICAgICBhbGxQbGF5ZXJzLmZvckVhY2gocERhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVySWQgPSBTdHJpbmcocERhdGEuaWQpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBwRGF0YS5jb2xvciB8fCBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgIHBsYXllckRpdi5jbGFzc05hbWUgPSBgcGxheWVyIHBsYXllci0ke2NvbG9yfWA7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnpJbmRleCA9ICcxMCc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUud2lsbENoYW5nZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLmJhY2tncm91bmRTaXplID0gYCR7U1BSSVRFX0NPTFVNTlMgKiBUSUxFX1NJWkV9cHggJHtTUFJJVEVfUk9XUyAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJEaXYpO1xuXG4gICAgICAgICAgICBjb25zdCBzeCA9IHBEYXRhLnggfHwgMTtcbiAgICAgICAgICAgIGNvbnN0IHN5ID0gcERhdGEueSB8fCAxO1xuXG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicsIFBvc2l0aW9uQ29tcG9uZW50KHN4LCBzeSwgVElMRV9TSVpFKSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScsIFZlbG9jaXR5Q29tcG9uZW50KDIuNSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScsIFJlbmRlcmFibGVDb21wb25lbnQocGxheWVyRGl2LCBUSUxFX1NJWkUsIFRJTEVfU0laRSwgNCwgMTIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpc0xvY2FsID0gcGxheWVySWQgPT09IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IFBsYXllckNvbXBvbmVudChwbGF5ZXJJZCwgY29sb3IsIGlzTG9jYWwpO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5saXZlcyA9IHBEYXRhLmxpdmVzID8/IDM7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLm1heEJvbWJzID0gcERhdGEubWF4Qm9tYnMgPz8gMTtcbiAgICAgICAgICAgIHBsYXllckNvbXAuYm9tYlJhbmdlID0gcERhdGEuYm9tYlJhbmdlID8/IDI7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmFsaXZlID0gcERhdGEuYWxpdmUgPz8gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicsIHBsYXllckNvbXApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcy5zZXQocGxheWVySWQsIHBsYXllckVudGl0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc0xvY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcsIElucHV0Q29tcG9uZW50KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMocGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltHYW1lRW5naW5lXSBMb2NhbCBwbGF5ZXIgd2FzIG5vdCBmb3VuZFwiLCB7XG4gICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXJJZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzOiBhbGxQbGF5ZXJzLm1hcChwbGF5ZXIgPT4gcGxheWVyLmlkKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlclN5c3RlbXMoKTtcblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5vdykgPT4gdGhpcy5nYW1lTG9vcChub3cpKTtcbiAgICB9XG5cbiAgICBzZXR1cElucHV0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZ2V0S2V5RGlyZWN0aW9uID0gKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93VXAnIHx8IGtleSA9PT0gJ3cnIHx8IGtleSA9PT0gJ1onIHx8IGtleSA9PT0gJ3onKSByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93TGVmdCcgfHwga2V5ID09PSAnYScgfHwga2V5ID09PSAnUScgfHwga2V5ID09PSAncScpIHJldHVybiAnbGVmdCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dSaWdodCcgfHwga2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpIHJldHVybiAncmlnaHQnO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlLnVuc2hpZnQoZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkcm9wQm9tYigpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudEJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLmZpbHRlcihiRW50aXR5ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndvcmxkLmdldENvbXBvbmVudChiRW50aXR5LCAnQm9tYicpLm93bmVySWQgPT09IHBsYXllci5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRCb21icy5sZW5ndGggPj0gcGxheWVyLm1heEJvbWJzKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnRFJPUF9CT01CJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7fVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlLCBib21iSWQgPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiAoYm9tYklkICYmIGJvbWIuYm9tYklkID09PSBib21iSWQpIHx8XG4gICAgICAgICAgICAgICAgKGJvbWIub3duZXJJZCA9PT0gb3duZXJJZCAmJiBwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuYm9tYklkID0gYm9tYklkO1xuICAgICAgICBib21iQ29tcC5lbCA9IGJvbWJEaXY7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJywgYm9tYkNvbXApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVNb3ZlKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbaGFuZGxlUmVtb3RlTW92ZV0gSW52YWxpZCBwYXlsb2FkOlwiLCBwYXlsb2FkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIEVudGl0eSBub3QgZm91bmQgZm9yIHBsYXllciAke3BheWxvYWQuaWR9LiBBdmFpbGFibGUgcGxheWVyczpgLCBBcnJheS5mcm9tKHRoaXMucGxheWVyRW50aXRpZXMua2V5cygpKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5ICYmICFwYXlsb2FkLmNvcnJlY3RlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghcG9zIHx8ICF2ZWwgfHwgIXJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIE1pc3NpbmcgY29tcG9uZW50cyBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH06YCwgeyBwb3M6ICEhcG9zLCB2ZWw6ICEhdmVsLCByZW5kZXJhYmxlOiAhIXJlbmRlcmFibGUgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2ZWwuZGlyZWN0aW9uID0gcGF5bG9hZC5kaXJlY3Rpb24gfHwgdmVsLmRpcmVjdGlvbjtcbiAgICAgICAgdmVsLmlzTW92aW5nID0gcGF5bG9hZC5pc01vdmluZztcbiAgICAgICAgcG9zLmdyaWRYID0gcGF5bG9hZC5ncmlkWDtcbiAgICAgICAgcG9zLmdyaWRZID0gcGF5bG9hZC5ncmlkWTtcbiAgICAgICAgcG9zLnRhcmdldFggPSBwYXlsb2FkLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcGF5bG9hZC55O1xuXG4gICAgICAgIGlmIChwYXlsb2FkLmNvcnJlY3RlZCkge1xuICAgICAgICAgICAgcG9zLnggPSBwYXlsb2FkLng7XG4gICAgICAgICAgICBwb3MueSA9IHBheWxvYWQueTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZUJvbWIocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDIsIHBheWxvYWQuYm9tYklkKTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8IHBheWxvYWQueCA9PT0gdW5kZWZpbmVkIHx8IHBheWxvYWQueSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChwYXlsb2FkLnN0YXRzKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGx5U2VydmVyU3RhdHMoZW50aXR5LCBwYXlsb2FkLnN0YXRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlQb3dlclVwKGVudGl0eSwgcGF5bG9hZC50eXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZVBvd2VyVXBBdChncmlkWCwgZ3JpZFkpIHtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMuYWRkKGAke2dyaWRYfSwke2dyaWRZfWApO1xuICAgICAgICBjb25zdCBwb3dlclVwcyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBvd2VyVXAgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXBvcyB8fCAhcG93ZXJVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwb3dlclVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChwb3dlclVwLmVsICYmIHBvd2VyVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwb3dlclVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG93ZXJVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlQb3dlclVwKGVudGl0eSwgdHlwZSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgYXBwbHlTcGVlZFBvd2VyVXAodmVsb2NpdHkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlTZXJ2ZXJTdGF0cyhlbnRpdHksIHN0YXRzKSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICFzdGF0cykgcmV0dXJuO1xuXG4gICAgICAgIHBsYXllci5saXZlcyA9IHN0YXRzLmxpdmVzID8/IHBsYXllci5saXZlcztcbiAgICAgICAgcGxheWVyLm1heEJvbWJzID0gc3RhdHMubWF4Qm9tYnMgPz8gcGxheWVyLm1heEJvbWJzO1xuICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gc3RhdHMuYm9tYlJhbmdlID8/IHBsYXllci5ib21iUmFuZ2U7XG4gICAgICAgIHBsYXllci5hbGl2ZSA9IHN0YXRzLmFsaXZlID8/IHBsYXllci5hbGl2ZTtcblxuICAgICAgICBpZiAodmVsb2NpdHkgJiYgdHlwZW9mIHN0YXRzLnNwZWVkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmVsb2NpdHkuc3BlZWQgPSBzdGF0cy5zcGVlZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVBsYXllckRhbWFnZWQocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIpIHJldHVybjtcblxuICAgICAgICBwbGF5ZXIubGl2ZXMgPSBwYXlsb2FkLmxpdmVzID8/IHBsYXllci5saXZlcztcbiAgICAgICAgcGxheWVyLmFsaXZlID0gcGF5bG9hZC5hbGl2ZSA/PyBwbGF5ZXIuYWxpdmU7XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIuYWxpdmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgICAgIGlmICh2ZWxvY2l0eSkgdmVsb2NpdHkuaXNNb3ZpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMud29ybGQucmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICBzZXRMaXZlcyhwbGF5ZXIubGl2ZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlR2FtZU92ZXIocGF5bG9hZCkge1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3Qgd2lubmVyTmFtZSA9IHBheWxvYWQgJiYgcGF5bG9hZC53aW5uZXJOYW1lID8gcGF5bG9hZC53aW5uZXJOYW1lIDogXCJBIHBsYXllclwiO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGFsZXJ0KGAke3dpbm5lck5hbWV9IHdpbnMhYCksIDUwKTtcbiAgICB9XG5cbiAgICByZWdpc3RlclN5c3RlbXMoKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZU1hcENlbGwgPSAoeCwgeSwgbmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXBEYXRhW3ldKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubWFwRGF0YVt5XVt4XSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWApO1xuICAgICAgICAgICAgaWYgKCF0aWxlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRpbGUuY2xhc3NOYW1lID0gJ3RpbGUgdGlsZS1mbG9vcic7XG4gICAgICAgICAgICB0aWxlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIpJztcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkZXN0cm95Qm94Q2FsbGJhY2sgPSAoeCwgeSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xhaW1lZFBvd2VyVXBzLmhhcyhgJHt4fSwke3l9YCkpIHJldHVybjtcbiAgICAgICAgICAgIHNwYXduUG93ZXJVcCh0aGlzLndvcmxkLCB4LCB5LCB0aGlzLmNvbnRhaW5lciwgVElMRV9TSVpFKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBvd2VyVXBQaWNrZWQgPSAoaWQsIHR5cGUsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHt4fSwke3l9YCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgcGxheWVyLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHModGhpcy5sb2NhbFBsYXllckVudGl0eSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9XRVJVUF9QSUNLRUQnLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGlkLCB0eXBlLCB4LCB5IH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5icm9hZGNhc3RNb3ZlbWVudCA9IChlbnRpdHksIHgsIHksIGdyaWRYLCBncmlkWSwgZGlyZWN0aW9uLCBpc01vdmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAoIXBsYXllciB8fCAhdGhpcy5zb2NrZXQgfHwgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ01PVkVfU1RBVEUnLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBsYXllci5pZCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGlzTW92aW5nLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IG1vdmVtZW50U3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBib21iU3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHBvd2VyVXBTeXN0ZW0odywgb25Qb3dlclVwUGlja2VkKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiByZW5kZXJTeXN0ZW0odywgZHQsIG5vdywgQU5JTUFUSU9OX1JPV1MpKTtcbiAgICB9XG5cbiAgICBnYW1lTG9vcChub3cpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHJldHVybjtcblxuICAgICAgICBjb25zdCBkdCA9IG5vdyAtIHRoaXMubGFzdFRpbWU7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBub3c7XG4gICAgICAgIHRoaXMud29ybGQudXBkYXRlKGR0LCBub3cpO1xuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyh0aGlzLmxvY2FsUGxheWVyRW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChuZXh0Tm93KSA9PiB0aGlzLmdhbWVMb29wKG5leHROb3cpKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlSHVkU3RhdHMoZW50aXR5KSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIHNldEJvbWJzKHBsYXllci5tYXhCb21icyB8fCAxKTtcbiAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzID8/IDMpO1xuICAgICAgICBzZXRSYW5nZShwbGF5ZXIuYm9tYlJhbmdlIHx8IDQpO1xuICAgICAgICBzZXRTcGVlZChNYXRoLnJvdW5kKHZlbG9jaXR5LnNwZWVkKSk7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IFwiXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKG5hbWUpIHtcbiAgICBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gbmFtZTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiLCBuYW1lKTtcbiAgICBjb25zb2xlLmxvZyhcIlBsYXllciByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVwiLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXllck5hbWUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgfHwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIikgfHwgXCJQbGF5ZXJcIjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBib21iU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB1cGRhdGVNYXBDZWxsLCBkZXN0cm95Qm94Q2FsbGJhY2ssIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBib21icyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBib21iRW50aXR5IG9mIGJvbWJzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgYm9tYiA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicpO1xuICAgICAgICBcbiAgICAgICAgYm9tYi50aW1lciAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChib21iLnRpbWVyIDw9IDAgJiYgIWJvbWIuZXhwbG9kZWQpIHtcbiAgICAgICAgICAgIGJvbWIuZXhwbG9kZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBhZmZlY3RlZENlbGxzID0gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMocG9zLmdyaWRYLCBwb3MuZ3JpZFksIGJvbWIucmFuZ2UsIG1hcERhdGEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhZmZlY3RlZENlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgZXhwRGl2LmNsYXNzTmFtZSA9ICdleHBsb3Npb24nO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmxlZnQgPSBgJHtjZWxsLnggKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnRvcCA9IGAke2NlbGwueSAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuekluZGV4ID0gJzcnO1xuXG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFg6IGNlbGwueCwgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZOiBjZWxsLnksIFxuICAgICAgICAgICAgICAgICAgICB4OiBjZWxsLnggKiB0aWxlU2l6ZSwgXG4gICAgICAgICAgICAgICAgICAgIHk6IGNlbGwueSAqIHRpbGVTaXplIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nLCB7IGR1cmF0aW9uOiA1MDAsIGVsOiBleHBEaXYgfSk7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGV4cERpdik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG1hcERhdGFbY2VsbC55XSAmJiBtYXBEYXRhW2NlbGwueV1bY2VsbC54XSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNYXBDZWxsKGNlbGwueCwgY2VsbC55LCAyKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXN0cm95Qm94Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lCb3hDYWxsYmFjayhjZWxsLngsIGNlbGwueSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGJvbWIuZWwgJiYgYm9tYi5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJvbWIuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShib21iRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgY29uc3QgZXhwID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicpO1xuICAgICAgICBleHAuZHVyYXRpb24gLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoZXhwLmR1cmF0aW9uIDw9IDApIHtcbiAgICAgICAgICAgIGlmIChleHAuZWwgJiYgZXhwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBleHAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChleHAuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShleHBFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhieCwgYnksIHJhbmdlLCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbHMgPSBbeyB4OiBieCwgeTogYnkgfV07XG4gICAgY29uc3QgZGlyZWN0aW9ucyA9IFtcbiAgICAgICAgeyB4OiAwLCB5OiAtMSB9LFxuICAgICAgICB7IHg6IDAsIHk6IDEgfSxcbiAgICAgICAgeyB4OiAtMSwgeTogMCB9LFxuICAgICAgICB7IHg6IDEsIHk6IDAgfVxuICAgIF07XG4gICAgXG4gICAgY29uc3Qgc3RlcHMgPSByYW5nZSAtIDE7IFxuICAgIFxuICAgIGRpcmVjdGlvbnMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0eCA9IGJ4ICsgKGRpci54ICogaSk7XG4gICAgICAgICAgICBjb25zdCB0eSA9IGJ5ICsgKGRpci55ICogaSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghbWFwRGF0YVt0eV0gfHwgbWFwRGF0YVt0eV1bdHhdID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjZWxsVHlwZSA9IG1hcERhdGFbdHldW3R4XTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNlbGxzLnB1c2goeyB4OiB0eCwgeTogdHkgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGNlbGxzO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIG1vdmVtZW50U3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB0aWxlU2l6ZSA9IDQwKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknKTtcbiAgICBjb25zdCBkZWx0YSA9IGR0IC8gMTYuNjc7XG5cbiAgICBjb25zdCBQTEFZRVJfU0laRSA9IHRpbGVTaXplO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBpbnB1dCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBjb25zdCBiZWhhdmlvciA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCZWhhdmlvcicpO1xuXG4gICAgICAgIGlmICh2ZWwuc3BlZWRCb29zdFRpbWVSZW1haW5pbmcgPiAwKSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWRCb29zdFRpbWVSZW1haW5pbmcgPSBNYXRoLm1heCh2ZWwuc3BlZWRCb29zdFRpbWVSZW1haW5pbmcgLSBkdCwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWRCb29zdCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aW1lZEJvb3N0ID0gdmVsLnNwZWVkQm9vc3RUaW1lUmVtYWluaW5nID4gMCA/IHZlbC5zcGVlZEJvb3N0IHx8IDAgOiAwO1xuICAgICAgICBjb25zdCBiZWhhdmlvckJvb3N0ID0gYmVoYXZpb3IgPyAoYmVoYXZpb3IuZmFzdFNob2VzTGV2ZWwgLSAxKSAqIDAuNSA6IDA7XG4gICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQgKyB0aW1lZEJvb3N0ICsgYmVoYXZpb3JCb29zdDtcblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUlucHV0ID0gaW5wdXQuaW5wdXRRdWV1ZVswXTtcbiAgICAgICAgbGV0IGR4ID0gMDtcbiAgICAgICAgbGV0IGR5ID0gMDtcblxuICAgICAgICBpZiAoYWN0aXZlSW5wdXQgPT09ICd1cCcpIHtcbiAgICAgICAgICAgIGR5ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3VwJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2Rvd24nKSB7XG4gICAgICAgICAgICBkeSA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2Rvd24nO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIGR4ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICBkeCA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3JpZ2h0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhc0lucHV0ID0gZHggIT09IDAgfHwgZHkgIT09IDA7XG5cbiAgICAgICAgaWYgKCFoYXNJbnB1dCkge1xuICAgICAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG4gICAgICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ0lETEUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WSA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBjb25zdCBzbmFwVGhyZXNob2xkID0gMzI7XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmIGR4ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKHBvcy54LCBuZXh0WSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWCA9IE1hdGguZmxvb3IoKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRYID0gY3VycmVudFRpbGVYICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlggPSBwb3MueCAtIHRhcmdldFg7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlgpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gLU1hdGguc2lnbihkaWZmWCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmIGR5ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKG5leHRYLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWSA9IE1hdGguZmxvb3IoKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRZID0gY3VycmVudFRpbGVZICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlkgPSBwb3MueSAtIHRhcmdldFk7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlkpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gLU1hdGguc2lnbihkaWZmWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFhBZnRlclNuYXAgPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZQWZ0ZXJTbmFwID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiAhaXNCbG9ja2VkKG5leHRYQWZ0ZXJTbmFwLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnggPSBuZXh0WEFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiAhaXNCbG9ja2VkKHBvcy54LCBuZXh0WUFmdGVyU25hcCwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnkgPSBuZXh0WUFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlbC5pc01vdmluZyA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ1JVTic7XG4gICAgICAgIH1cblxuICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG5cbiAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpIHtcbiAgICBjb25zdCBzdGVwID0gdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICBpZiAocG9zLnggPCBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWluKHBvcy54ICsgc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH0gZWxzZSBpZiAocG9zLnggPiBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWF4KHBvcy54IC0gc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH1cblxuICAgIGlmIChwb3MueSA8IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5taW4ocG9zLnkgKyBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfSBlbHNlIGlmIChwb3MueSA+IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5tYXgocG9zLnkgLSBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfVxuXG4gICAgdmVsLmlzTW92aW5nID1cbiAgICAgICAgcG9zLnggIT09IHBvcy50YXJnZXRYIHx8XG4gICAgICAgIHBvcy55ICE9PSBwb3MudGFyZ2V0WTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkKHgsIHksIG1hcERhdGEsIHRpbGVTaXplLCBwbGF5ZXJTaXplID0gdGlsZVNpemUpIHtcbiAgICBjb25zdCBwYWRkaW5nID0gNDtcblxuICAgIGNvbnN0IGxlZnQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgcmlnaHQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHRvcCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCBib3R0b20gPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgYm90dG9tLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCBib3R0b20sIG1hcERhdGEpXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkQ2VsbCh4LCB5LCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbCA9IG1hcERhdGFbeV0gJiYgbWFwRGF0YVt5XVt4XTtcblxuICAgIHJldHVybiBjZWxsICE9PSAwICYmIGNlbGwgIT09IDI7XG59XG4iLCJleHBvcnQgY29uc3QgU1BFRURfUE9XRVJVUF9BTU9VTlQgPSAxO1xuZXhwb3J0IGNvbnN0IE1BWF9QTEFZRVJfU1BFRUQgPSA4O1xuZXhwb3J0IGNvbnN0IFNQRUVEX1BPV0VSVVBfRFVSQVRJT04gPSA1MDAwO1xuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlTcGVlZFBvd2VyVXAodmVsb2NpdHkpIHtcbiAgICBjb25zdCBjdXJyZW50Qm9vc3QgPSB2ZWxvY2l0eS5zcGVlZEJvb3N0IHx8IDA7XG4gICAgY29uc3QgbWF4Qm9vc3QgPSBNYXRoLm1heChNQVhfUExBWUVSX1NQRUVEIC0gdmVsb2NpdHkuYmFzZVNwZWVkLCAwKTtcbiAgICB2ZWxvY2l0eS5zcGVlZEJvb3N0ID0gTWF0aC5taW4oY3VycmVudEJvb3N0ICsgU1BFRURfUE9XRVJVUF9BTU9VTlQsIG1heEJvb3N0KTtcbiAgICB2ZWxvY2l0eS5zcGVlZEJvb3N0VGltZVJlbWFpbmluZyA9IFNQRUVEX1BPV0VSVVBfRFVSQVRJT047XG4gICAgdmVsb2NpdHkuc3BlZWQgPSBNYXRoLm1pbih2ZWxvY2l0eS5iYXNlU3BlZWQgKyB2ZWxvY2l0eS5zcGVlZEJvb3N0LCBNQVhfUExBWUVSX1NQRUVEKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvd2VyVXBTeXN0ZW0od29ybGQsIG9uUG93ZXJVcFBpY2tlZCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUGxheWVyJyk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcFBvcyB8fCAhdmVsIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcFVwRW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCB1cFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcFVwID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghdXBQb3MgfHwgIXBVcCB8fCBwVXAucGlja2VkVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocFBvcy5ncmlkWCA9PT0gdXBQb3MuZ3JpZFggJiYgcFBvcy5ncmlkWSA9PT0gdXBQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC50eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5U3BlZWRQb3dlclVwKHZlbCk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwVXAuZWwgJiYgcFVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcFVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocFVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob25Qb3dlclVwUGlja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uUG93ZXJVcFBpY2tlZChwbGF5ZXIuaWQsIHBVcC50eXBlLCB1cFBvcy5ncmlkWCwgdXBQb3MuZ3JpZFkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkocFVwRW50aXR5KTtcbiAgICAgICAgICAgICAgICBicmVhazsgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGF3blBvd2VyVXAod29ybGQsIGd4LCBneSwgY29udGFpbmVyLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3Qgc2VlZCA9IGd4ICogNzM4NTYwOTMgXiBneSAqIDE5MzQ5NjYzO1xuICAgIGNvbnN0IHNlZWRSYW5kb20gPSAoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCkgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQpICogMTAwMDApO1xuICAgIFxuICAgIGlmIChzZWVkUmFuZG9tID4gMC4zNSkgcmV0dXJuO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbJ1NQRUVEJywgJ0JPTUJTJywgJ0ZMQU1FJ107XG4gICAgY29uc3QgdHlwZUluZGV4ID0gTWF0aC5mbG9vcigoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDAgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwKSkgKiB0eXBlcy5sZW5ndGgpO1xuICAgIGNvbnN0IHJhbmRvbVR5cGUgPSB0eXBlc1t0eXBlSW5kZXhdO1xuXG4gICAgY29uc3QgcFVwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWDogZ3gsIGdyaWRZOiBneSwgeDogZ3ggKiB0aWxlU2l6ZSwgeTogZ3kgKiB0aWxlU2l6ZSB9KTtcbiAgICBcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gYHBvd2VydXAgcG93ZXJ1cC0ke3JhbmRvbVR5cGUudG9Mb3dlckNhc2UoKX1gO1xuICAgIGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSBgJHtneCAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUudG9wID0gYCR7Z3kgKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJywgeyB0eXBlOiByYW5kb21UeXBlLCBlbDogZGl2IH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclN5c3RlbSh3b3JsZCwgZHQsIG5vdywgYW5pbVJvd3MpIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdSZW5kZXJhYmxlJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuXG4gICAgICAgIGlmICghcmVuZGVyYWJsZS5lbCkgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSByZW5kZXJhYmxlLnN0YXRlO1xuICAgICAgICBjb25zdCB0YXJnZXRSb3cgPSBhbmltUm93c1tzdGF0ZV1bdmVsLmRpcmVjdGlvbl07XG4gICAgICAgIFxuICAgICAgICAvLyBSZXNldCBhbmltYXRpb24gd2hlbiByb3cgb3Igc3RhdGUgY2hhbmdlc1xuICAgICAgICBpZiAocmVuZGVyYWJsZS5yb3cgIT09IHRhcmdldFJvdyB8fCByZW5kZXJhYmxlLmxhc3RTdGF0ZSAhPT0gc3RhdGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUucm93ID0gdGFyZ2V0Um93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0U3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZyYW1lQ291bnQgPSBzdGF0ZSA9PT0gJ1JVTicgPyByZW5kZXJhYmxlLnJ1bkZyYW1lcyA6IHJlbmRlcmFibGUuaWRsZUZyYW1lcztcbiAgICAgICAgY29uc3QgZnJhbWVEZWxheSA9IHN0YXRlID09PSAnUlVOJyA/IDEwMDAgLyByZW5kZXJhYmxlLmZwcyA6IDEwMDAgLyByZW5kZXJhYmxlLmlkbGVGcHM7XG5cbiAgICAgICAgaWYgKG5vdyAtIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA+IGZyYW1lRGVsYXkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICsgMSkgJSBmcmFtZUNvdW50O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zWCA9IC0ocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKiByZW5kZXJhYmxlLmZyYW1lV2lkdGgpO1xuICAgICAgICBjb25zdCBwb3NZID0gLShyZW5kZXJhYmxlLnJvdyAqIHJlbmRlcmFibGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBgJHtwb3NYfXB4ICR7cG9zWX1weGA7XG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7cG9zLnh9cHgsICR7cG9zLnl9cHgsIDApYDtcbiAgICB9XG59XG4iLCIvLyAvc3JjL2Vjcy93b3JsZC5qc1xuXG5leHBvcnQgY2xhc3MgV29ybGQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm5leHRFbnRpdHlJZCA9IDA7XG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IG5ldyBNYXAoKTsgXG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuICAgIH1cblxuICAgIGNyZWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5uZXh0RW50aXR5SWQrKztcbiAgICAgICAgdGhpcy5lbnRpdGllcy5hZGQoZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG5cbiAgICBkZXN0cm95RW50aXR5KGVudGl0eSkge1xuICAgICAgICB0aGlzLmVudGl0aWVzLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICBmb3IgKGNvbnN0IFtjb21wb25lbnROYW1lLCBjb21wb25lbnRNYXBdIG9mIHRoaXMuY29tcG9uZW50cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERhdGEgPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zZXQoY29tcG9uZW50TmFtZSwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpLnNldChlbnRpdHksIGNvbXBvbmVudERhdGEpO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE1hcCA/IGNvbXBvbmVudE1hcC5nZXQoZW50aXR5KSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZW1vdmVDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIGlmIChjb21wb25lbnRNYXApIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHF1ZXJ5KC4uLmNvbXBvbmVudE5hbWVzKSB7XG4gICAgICAgIGlmIChjb21wb25lbnROYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpcnN0TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1swXSk7XG4gICAgICAgIGlmICghZmlyc3RNYXApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZmlyc3RNYXAua2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgaGFzQWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY29tcG9uZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcCB8fCAhbWFwLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0FsbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzQWxsICYmIHRoaXMuZW50aXRpZXMuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRTeXN0ZW0oc3lzdGVtRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zeXN0ZW1zLnB1c2goc3lzdGVtRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHVwZGF0ZShkdCwgbm93KSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3lzdGVtIG9mIHRoaXMuc3lzdGVtcykge1xuICAgICAgICAgICAgc3lzdGVtKHRoaXMsIGR0LCBub3cpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5cbmV4cG9ydCBjb25zdCBUSUxFX1NJWkUgPSA0ODtcbmNvbnN0IEdSSURfQk9SREVSX1NJWkUgPSA2O1xuXG5jb25zdCBpbWFnZXMgPSB7XG4gICAgMjogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIsXG4gICAgMzogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfd2FsbC5wbmdcIixcbiAgICA0OiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19leHBsb2l0LnBuZ1wiLFxufTtcblxuY29uc3QgW3BsYXllck5hbWUsIHNldFBsYXllck5hbWVdID0gY3JlYXRlU2lnbmFsKFwiUGxheWVyIDFcIik7XG5jb25zdCBbbGl2ZXMsIHNldExpdmVzXSA9IGNyZWF0ZVNpZ25hbCgzKTtcbmNvbnN0IFtzcGVlZCwgc2V0U3BlZWRdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW2JvbWJzLCBzZXRCb21ic10gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbcmFuZ2UsIHNldFJhbmdlXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmV4cG9ydCB7IHNldFBsYXllck5hbWUsIHNldExpdmVzLCBzZXRTcGVlZCwgc2V0Qm9tYnMsIHNldFJhbmdlIH07XG5cbmNvbnN0IG5hbWVFbCA9IDxzcGFuIGNsYXNzPVwicGxheWVyLW5hbWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBuYW1lRWwudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lKCk7IH0pO1xuXG5jb25zdCBsaXZlc0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBsaXZlcy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBzcGVlZEVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBzcGVlZC12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBib21ic0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBib21icy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCByYW5nZUVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSByYW5nZS12YWx1ZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGxpdmVzRWwudGV4dENvbnRlbnQgPSBsaXZlcygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHNwZWVkRWwudGV4dENvbnRlbnQgPSBzcGVlZCgpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGJvbWJzRWwudGV4dENvbnRlbnQgPSBib21icygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHJhbmdlRWwudGV4dENvbnRlbnQgPSByYW5nZSgpOyB9KTtcblxuZnVuY3Rpb24gR2FtZSh7IGdyaWQgfSkge1xuICAgIGNvbnN0IGJvYXJkV2lkdGggPSBncmlkWzBdLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZEhlaWdodCA9IGdyaWQubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJXaWR0aCA9IGJvYXJkV2lkdGggKyBHUklEX0JPUkRFUl9TSVpFICogMjtcbiAgICBjb25zdCBib2FyZE91dGVySGVpZ2h0ID0gYm9hcmRIZWlnaHQgKyBHUklEX0JPUkRFUl9TSVpFICogMjtcbiAgICBjb25zdCByb3dzID0gW107XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IGdyaWQubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCBncmlkW3Jvd0luZGV4XS5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBncmlkW3Jvd0luZGV4XVtjb2xJbmRleF07XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gXCJ0aWxlXCI7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBgd2lkdGg6JHtUSUxFX1NJWkV9cHg7aGVpZ2h0OiR7VElMRV9TSVpFfXB4O2A7XG5cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAyIHx8IGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS1mbG9vclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS13YWxsXCI7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzNdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbNF19KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMCB8fCBjZWxsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzJdfSlgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxscy5wdXNoKDxkaXYgY2xhc3M9e2NsYXNzTmFtZX0gZGF0YS14PXtjb2xJbmRleH0gZGF0YS15PXtyb3dJbmRleH0gc3R5bGU9e3N0eWxlfT48L2Rpdj4pO1xuICAgICAgICB9XG4gICAgICAgIHJvd3MucHVzaCg8ZGl2IGNsYXNzPVwiZ3JpZC1yb3dcIj57Y2VsbHN9PC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWdsYXNzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWJhclwiPlxuICAgICAgICAgICAgICAgICAgICB7bmFtZUVsfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+TGl2ZXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpdmVzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+U3BlZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwZWVkRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+Qm9tYnM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvbWJzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+UmFuZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JhbmdlRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtYm9hcmQtZnJhbWVcIiBzdHlsZT17YHdpZHRoOiR7Ym9hcmRPdXRlcldpZHRofXB4O2hlaWdodDoke2JvYXJkT3V0ZXJIZWlnaHR9cHg7YH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZ2FtZS1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJnYW1lLWdyaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2Bwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoke2JvYXJkV2lkdGh9cHg7aGVpZ2h0OiR7Ym9hcmRIZWlnaHR9cHg7YH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IENoYXRQbGF5ZXJzIGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxubGV0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSBjcmVhdGVTaWduYWwoe30pO1xuZXhwb3J0IHsgc2V0U3RhdGVzIH07XG5cbmxldCByb29tSWRFbCA9IDxwPlJvb20gSUQ6IDwvcD47XG5sZXQgcGxheWVyc0VsID0gPHA+UGxheWVyczogIC8gNDwvcD47XG5sZXQgdGV4dEVsID0gPHA+PC9wPjtcbmxldCB0aW1lckVsID0gPHA+VGltZXI6IDwvcD47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcyA9IHN0YXRlcygpO1xuICAgIHJvb21JZEVsLnRleHRDb250ZW50ID0gYFJvb20gSUQ6ICR7cy5yb29tSWR9YDtcbiAgICBwbGF5ZXJzRWwudGV4dENvbnRlbnQgPSBgUGxheWVyczogJHtzLnBsYXllcnNDb3VudH0gLyA0YDtcbiAgICB0ZXh0RWwudGV4dENvbnRlbnQgPSBzLnRleHQgfHwgXCJcIjtcblxuICAgIGlmIChzLmdhbWVTdGFydGVkKSB7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBcIlRpbWVyOiBHYW1lIHN0YXJ0ZWRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0aW1lclRleHQgPSAoIXMuc2Vjb25kc0xlZnQpID8gXCJXYWl0aW5nIGZvciBvbmUgbW9yZSBwbGF5ZXJcIiA6IGAke3Muc2Vjb25kc0xlZnR9IHNlY29uZHNgO1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gYFRpbWVyOiAke3RpbWVyVGV4dH1gO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBMb2JieSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29uYXRpbmVyLWxvYmJ5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9iYnktYm94XCI+XG4gICAgICAgICAgICAgICAgPGgxPkxvYmJ5PC9oMT5cbiAgICAgICAgICAgICAgICB7cm9vbUlkRWx9XG4gICAgICAgICAgICAgICAge3BsYXllcnNFbH1cbiAgICAgICAgICAgICAgICB7dGV4dEVsfVxuICAgICAgICAgICAgICAgIHt0aW1lckVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q2hhdFBsYXllcnMgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2JieTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5jb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbnJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbmxldCBtZW51RWwgPSAoXG4gICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgIDxoMT5Zb3UgV2luITwvaDE+XG4gICAgICAgIDxwPkFsbCBvdGhlciBwbGF5ZXJzIGhhdmUgbGVmdCB0aGUgZ2FtZS48L3A+XG4gICAgICAgIHtyZXBsYXlCdG59XG4gICAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZW51KCkge1xuICAgIHJldHVybiBtZW51RWw7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5jb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IGNyZWF0ZVNpZ25hbChcIlwiKTtcbmV4cG9ydCB7IHNldEVycm9yIH07XG5cbmZ1bmN0aW9uIFJlZ2lzdGVyKHsgd3NzIH0pIHtcbiAgICBsZXQgc3VibWl0dGVkID0gZmFsc2U7XG4gICAgY29uc3QgZXJyb3JFbCA9IDxwIGNsYXNzPVwicmVnaXN0ZXItZXJyb3JcIj48L3A+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgZXJyb3JFbC50ZXh0Q29udGVudCA9IGVycm9yKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgcGxheWVyRW50ZXIgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCBuaWNrbmFtZSA9IGZvcm1EYXRhLmdldChcIm5pY2tuYW1lXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW5pY2tuYW1lIHx8IG5pY2tuYW1lLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBzZXRFcnJvcihcIkludmFsaWQgbmlja25hbWVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcbiAgICAgICAgc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc2V0UGxheWVyTmFtZShuaWNrbmFtZSk7XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJuaWNrbmFtZV9vZl90aGVfcGxheWVyXCIsXG4gICAgICAgICAgICBuaWNrbmFtZTogbmlja25hbWVcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxmb3JtIGNsYXNzPVwicmVnaXN0ZXItZm9ybVwiIG9uU3VibWl0PXtwbGF5ZXJFbnRlcn0+XG4gICAgICAgICAgICB7ZXJyb3JFbH1cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5pY2tuYW1lLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVudGVyIHlvdXIgbmFtZVwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIHRoaXMubXVzaWMucGxheSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpO1xuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVzaWMucGF1c2VkIHx8IHRoaXMubXVzaWMubXV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvblwiKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVCdXR0b24oKSB7XG4gICAgICAgIGNvbnN0IGlzTXV0ZWQgPSB0aGlzLm11c2ljLm11dGVkIHx8IHRoaXMubXVzaWMucGF1c2VkO1xuXG4gICAgICAgIHRoaXMuaWNvbi5jbGFzc05hbWUgPSBpc011dGVkID8gXCJmYS1zb2xpZCBmYS12b2x1bWUtb2ZmXCIgOiBcImZhLXNvbGlkIGZhLXZvbHVtZS1oaWdoXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1tdXRlZFwiLCBpc011dGVkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvdW5kO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC9hcHAuanNcIik7XG4iLCIiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJwcm9wcyIsImNoaWxkcmVuIiwiZWxlIiwiZG9jdW1lbnQiLCJrZXkiLCJzdGFydHNXaXRoIiwiZXZlbnROYW1lIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRBdHRyaWJ1dGUiLCJmbGF0Q2hpbGRyZW4iLCJmbGF0IiwiSW5maW5pdHkiLCJhcHBlbmQiLCJmaWx0ZXIiLCJjaGlsZCIsInVuZGVmaW5lZCIsInJlbmRlciIsImVsZW1lbnQiLCJjb250YWluZXIiLCJyZXBsYWNlQ2hpbGRyZW4iLCJSb3V0ZXIiLCJyb3V0ZXIiLCJlZmZlY3RTdGFjayIsImFjdGl2ZUVmZmVjdCIsImNyZWF0ZVNpZ25hbCIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwiZWZmZWN0cyIsIlNldCIsIlJlYWQiLCJhZGQiLCJXcml0ZSIsIm5ld1ZhbHVlIiwiZm4iLCJmb3JFYWNoIiwiZWZmZWN0IiwiY3JlYXRlRWZmZWN0IiwicHVzaCIsInBvcCIsImxlbmd0aCIsIlJvdXRlcyIsIk9iamVjdCIsImNyZWF0ZSIsIkZpcnN0UmVzb2x2ZSIsIm9uIiwicGF0aCIsImhhbmRsZXIiLCJuYXZpZ2F0ZSIsImhpc3RvcnkiLCJuYXZpZ2F0aW9uIiwicmVzb2x2ZSIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJ1cmwiLCJVUkwiLCJocmVmIiwibGlzdGVuIiwib25FcnJvcjQwNCIsImV2ZW50IiwiZGVzdGluYXRpb24iLCJpbnRlcmNlcHQiLCJjb25zb2xlIiwibG9nIiwiUmVnaXN0ZXIiLCJzZXRFcnJvciIsIkdhbWUiLCJNZW51IiwiTG9iYnkiLCJzZXRTdGF0ZXMiLCJzZXRQbGF5ZXJOYW1lIiwic2V0SHVkUGxheWVyTmFtZSIsIlNvdW5kIiwic2V0TWVzc2FnZXMiLCJHYW1lRW5naW5lIiwicm9vdCIsImdldEVsZW1lbnRCeUlkIiwid3NzIiwiV2ViU29ja2V0Iiwic291bmQiLCJjdXJyZW50R2FtZUVuZ2luZSIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJ3cyIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicXVlcnlTZWxlY3RvciIsInJvb21JZCIsInBsYXllcnNDb3VudCIsInNlY29uZHNMZWZ0IiwidGV4dCIsImdyaWQiLCJzZXRUaW1lb3V0IiwiZ2FtZUNvbnRhaW5lciIsImRlc3Ryb3kiLCJsb2NhbFBsYXllciIsInBsYXllcnMiLCJmaW5kIiwicGxheWVyIiwiaWQiLCJ5b3VyUGxheWVySWQiLCJuaWNrbmFtZSIsImVuZ2luZSIsImVycm9yIiwicHJldiIsImhhbmRsZVJlbW90ZU1vdmUiLCJwYXlsb2FkIiwiaGFuZGxlUmVtb3RlQm9tYiIsImhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQiLCJoYW5kbGVQbGF5ZXJEYW1hZ2VkIiwiaGFuZGxlR2FtZU92ZXIiLCJlcnIiLCJtZXNzYWdlcyIsIkNoYXRQbGF5ZXJzIiwibWVzc2FnZXNDb250YWluZXIiLCJjbGFzcyIsIm1zZ3MiLCJpbm5lckhUTUwiLCJtc2ciLCJwIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJ1bnNoaWZ0IiwiYnJvYWRjYXN0TWVzc2FnZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJ0YXJnZXQiLCJnZXQiLCJ0cmltIiwicmVzZXQiLCJzZW5kIiwic3RyaW5naWZ5Iiwib25TdWJtaXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJtYXhsZW5ndGgiLCJQb3NpdGlvbkNvbXBvbmVudCIsImd4IiwiZ3kiLCJ0aWxlU2l6ZSIsImdyaWRYIiwiZ3JpZFkiLCJ4IiwieSIsInRhcmdldFgiLCJ0YXJnZXRZIiwiVmVsb2NpdHlDb21wb25lbnQiLCJiYXNlU3BlZWQiLCJzcGVlZCIsInNwZWVkQm9vc3QiLCJzcGVlZEJvb3N0VGltZVJlbWFpbmluZyIsImlzTW92aW5nIiwiZGlyZWN0aW9uIiwiSW5wdXRDb21wb25lbnQiLCJpbnB1dFF1ZXVlIiwiUmVuZGVyYWJsZUNvbXBvbmVudCIsImVsIiwiZnJhbWVXaWR0aCIsImZyYW1lSGVpZ2h0IiwidG90YWxGcmFtZXMiLCJmcHMiLCJjdXJyZW50RnJhbWUiLCJydW5GcmFtZXMiLCJpZGxlRnJhbWVzIiwiaWRsZUZwcyIsImxhc3RGcmFtZVRpbWUiLCJyb3ciLCJzdGF0ZSIsImxhc3RTdGF0ZSIsIlBsYXllckNvbXBvbmVudCIsImNoYXJUeXBlIiwiaXNMb2NhbCIsIkJvbWJDb21wb25lbnQiLCJvd25lcklkIiwidGltZXIiLCJyYW5nZSIsImV4cGxvZGVkIiwiRXhwbG9zaW9uQ29tcG9uZW50IiwiZHVyYXRpb24iLCJQb3dlclVwQ29tcG9uZW50IiwicGlja2VkVXAiLCJCZWhhdmlvckNvbXBvbmVudCIsImdob3N0TW9kZSIsInRocm93YWJsZSIsImRldG9uYXRvciIsImZhc3RTaG9lc0xldmVsIiwiYm9tYnMiLCJtYXgiLCJjdXJyZW50IiwiV29ybGQiLCJtb3ZlbWVudFN5c3RlbSIsInJlbmRlclN5c3RlbSIsImJvbWJTeXN0ZW0iLCJhcHBseVNwZWVkUG93ZXJVcCIsInBvd2VyVXBTeXN0ZW0iLCJzcGF3blBvd2VyVXAiLCJzZXRCb21icyIsInNldExpdmVzIiwic2V0UmFuZ2UiLCJzZXRTcGVlZCIsIlRJTEVfU0laRSIsIlNQUklURV9DT0xVTU5TIiwiU1BSSVRFX1JPV1MiLCJBTklNQVRJT05fUk9XUyIsIlJVTiIsInVwIiwibGVmdCIsImRvd24iLCJyaWdodCIsIklETEUiLCJjb25zdHJ1Y3RvciIsImNhbnZhc0NvbnRhaW5lciIsIm1hcERhdGEiLCJzb2NrZXQiLCJ3b3JsZCIsImxvY2FsUGxheWVyRW50aXR5IiwicGxheWVyRW50aXRpZXMiLCJNYXAiLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibG9jYWxQbGF5ZXJJZCIsImFsbFBsYXllcnMiLCJub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCIsIlN0cmluZyIsInBEYXRhIiwicGxheWVySWQiLCJwbGF5ZXJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJwbGF5ZXJEaXYiLCJjb2xvciIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ3aWxsQ2hhbmdlIiwid2lkdGgiLCJoZWlnaHQiLCJiYWNrZ3JvdW5kU2l6ZSIsInN4Iiwic3kiLCJhZGRDb21wb25lbnQiLCJwbGF5ZXJDb21wIiwibGl2ZXMiLCJtYXhCb21icyIsImJvbWJSYW5nZSIsImFsaXZlIiwic2V0IiwidXBkYXRlSHVkU3RhdHMiLCJzZXR1cElucHV0Iiwid2FybiIsIm1hcCIsInJlZ2lzdGVyU3lzdGVtcyIsInBlcmZvcm1hbmNlIiwibm93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZ2FtZUxvb3AiLCJpbnB1dCIsImdldENvbXBvbmVudCIsImdldEtleURpcmVjdGlvbiIsImhhbmRsZUtleURvd24iLCJkaXIiLCJpbmNsdWRlcyIsImNvZGUiLCJkcm9wQm9tYiIsImhhbmRsZUtleVVwIiwiZCIsIndpbmRvdyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjdXJyZW50Qm9tYnMiLCJxdWVyeSIsImJFbnRpdHkiLCJyZWFkeVN0YXRlIiwiT1BFTiIsImNyZWF0ZUJvbWIiLCJib21iSWQiLCJleGlzdHMiLCJzb21lIiwiZW50aXR5IiwicG9zIiwiYm9tYiIsImJvbWJFbnRpdHkiLCJib21iRGl2IiwidG9wIiwiYm9tYkNvbXAiLCJBcnJheSIsImZyb20iLCJrZXlzIiwiY29ycmVjdGVkIiwidmVsIiwicmVuZGVyYWJsZSIsInJlbW92ZVBvd2VyVXBBdCIsInN0YXRzIiwiYXBwbHlTZXJ2ZXJTdGF0cyIsImFwcGx5UG93ZXJVcCIsInBvd2VyVXBzIiwicG93ZXJVcCIsInBhcmVudE5vZGUiLCJkZXN0cm95RW50aXR5IiwidmVsb2NpdHkiLCJyZW1vdmVDb21wb25lbnQiLCJ3aW5uZXJOYW1lIiwidXBkYXRlTWFwQ2VsbCIsInRpbGUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJkZXN0cm95Qm94Q2FsbGJhY2siLCJoYXMiLCJvblBvd2VyVXBQaWNrZWQiLCJicm9hZGNhc3RNb3ZlbWVudCIsImFkZFN5c3RlbSIsInciLCJkdCIsInVwZGF0ZSIsIm5leHROb3ciLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsIk1hdGgiLCJyb3VuZCIsImN1cnJlbnRMb2NhbFBsYXllck5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZ2V0UGxheWVyTmFtZSIsImdldEl0ZW0iLCJhZmZlY3RlZENlbGxzIiwiY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMiLCJjZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2IiwiZXhwbG9zaW9ucyIsImV4cCIsImJ4IiwiYnkiLCJjZWxscyIsImRpcmVjdGlvbnMiLCJzdGVwcyIsImkiLCJ0eCIsInR5IiwiY2VsbFR5cGUiLCJlbnRpdGllcyIsImRlbHRhIiwiUExBWUVSX1NJWkUiLCJiZWhhdmlvciIsInRpbWVkQm9vc3QiLCJiZWhhdmlvckJvb3N0IiwibW92ZVRvd2FyZFRhcmdldCIsImFjdGl2ZUlucHV0IiwiZHgiLCJkeSIsImhhc0lucHV0IiwiZmxvb3IiLCJuZXh0WCIsIm5leHRZIiwic25hcFRocmVzaG9sZCIsImlzQmxvY2tlZCIsImN1cnJlbnRUaWxlWCIsImRpZmZYIiwiYWJzIiwic2lnbiIsImN1cnJlbnRUaWxlWSIsImRpZmZZIiwibmV4dFhBZnRlclNuYXAiLCJuZXh0WUFmdGVyU25hcCIsInN0ZXAiLCJtaW4iLCJwbGF5ZXJTaXplIiwicGFkZGluZyIsImJvdHRvbSIsImlzQmxvY2tlZENlbGwiLCJTUEVFRF9QT1dFUlVQX0FNT1VOVCIsIk1BWF9QTEFZRVJfU1BFRUQiLCJTUEVFRF9QT1dFUlVQX0RVUkFUSU9OIiwiY3VycmVudEJvb3N0IiwibWF4Qm9vc3QiLCJwUG9zIiwicFVwRW50aXR5IiwidXBQb3MiLCJwVXAiLCJzZWVkIiwic2VlZFJhbmRvbSIsInNpbiIsInR5cGVzIiwidHlwZUluZGV4IiwicmFuZG9tVHlwZSIsImRpdiIsImFuaW1Sb3dzIiwidGFyZ2V0Um93IiwiZnJhbWVDb3VudCIsImZyYW1lRGVsYXkiLCJwb3NYIiwicG9zWSIsImJhY2tncm91bmRQb3NpdGlvbiIsInRyYW5zZm9ybSIsIm5leHRFbnRpdHlJZCIsImNvbXBvbmVudHMiLCJzeXN0ZW1zIiwiZGVsZXRlIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudE1hcCIsImVudHJpZXMiLCJjb21wb25lbnREYXRhIiwiY29tcG9uZW50TmFtZXMiLCJmaXJzdE1hcCIsInJlc3VsdHMiLCJoYXNBbGwiLCJzeXN0ZW1GdW5jdGlvbiIsInN5c3RlbSIsIkdSSURfQk9SREVSX1NJWkUiLCJpbWFnZXMiLCJwbGF5ZXJOYW1lIiwibmFtZUVsIiwibGl2ZXNFbCIsInNwZWVkRWwiLCJib21ic0VsIiwicmFuZ2VFbCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImJvYXJkT3V0ZXJXaWR0aCIsImJvYXJkT3V0ZXJIZWlnaHQiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJnYW1lU3RhcnRlZCIsInRpbWVyVGV4dCIsInJlcGxheUJ0biIsInJlbG9hZCIsIm1lbnVFbCIsInN1Ym1pdHRlZCIsImVycm9yRWwiLCJwbGF5ZXJFbnRlciIsImN1cnJlbnRUYXJnZXQiLCJzcmMiLCJtdXNpYyIsIkF1ZGlvIiwiYnV0dG9uIiwiaWNvbiIsImxvb3AiLCJ2b2x1bWUiLCJ0b2dnbGUiLCJ1cGRhdGVCdXR0b24iLCJwbGF5IiwidGhlbiIsImNhdGNoIiwicGF1c2VkIiwibXV0ZWQiLCJpc011dGVkIiwiY2xhc3NMaXN0Il0sInNvdXJjZVJvb3QiOiIifQ==