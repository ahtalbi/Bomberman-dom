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
    case "lobby_update":
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
    case "explosion_checked":
      if (currentGameEngine) {
        currentGameEngine.handleExplosionChecked(message.payload);
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
/* harmony import */ var _systems_renderSystem_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./systems/renderSystem.js */ "./src/ecs/systems/renderSystem.js");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pages/game */ "./src/pages/game.jsx");




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
    this.lastInputSent = "";
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
      playerDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
      playerDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
      playerDiv.style.backgroundSize = `${SPRITE_COLUMNS * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px ${SPRITE_ROWS * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
      this.container.appendChild(playerDiv);
      const sx = pData.x || 1;
      const sy = pData.y || 1;
      this.world.addComponent(playerEntity, 'Position', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.PositionComponent)(sx, sy, _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE));
      this.world.addComponent(playerEntity, 'Velocity', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.VelocityComponent)(pData.speed || 2.5));
      this.world.addComponent(playerEntity, 'Renderable', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.RenderableComponent)(playerDiv, _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE, _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE, 4, 12));
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
        this.sendInput(input);
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
        this.sendInput(input);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    this.removeInputListeners = () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }
  sendInput(input) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    if (this.localPlayerEntity === null) return;
    const player = this.world.getComponent(this.localPlayerEntity, 'Player');
    if (!player || !player.alive) return;
    const direction = input.inputQueue[0] || null;
    const isMoving = Boolean(direction);
    const inputState = `${direction || 'idle'}:${isMoving ? 1 : 0}`;
    if (this.lastInputSent === inputState) return;
    this.lastInputSent = inputState;
    this.socket.send(JSON.stringify({
      type: 'MOVE_STATE',
      payload: {
        direction,
        isMoving
      }
    }));
  }
  dropBomb() {
    if (this.localPlayerEntity === null) return;
    const player = this.world.getComponent(this.localPlayerEntity, 'Player');
    if (!player || !player.alive) return;
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
    bombDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    bombDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    bombDiv.style.left = `${gridX * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    bombDiv.style.top = `${gridY * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
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
    pos.x = payload.x;
    pos.y = payload.y;
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
      (0,_pages_game__WEBPACK_IMPORTED_MODULE_3__.setLives)(player.lives);
    }
  }
  handleGameOver(payload) {
    this.running = false;
    const winnerName = payload && payload.winnerName ? payload.winnerName : "A player";
    setTimeout(() => alert(`${winnerName} wins!`), 50);
  }
  handleExplosionChecked(payload) {
    if (!payload) return;
    this.removeBomb(payload.bombId, payload.cells && payload.cells[0]);
    (payload.destroyedBlocks || []).forEach(cell => {
      this.updateMapCell(cell.x, cell.y, 2);
    });
    (payload.spawnedPowerUps || []).forEach(powerUp => {
      this.createPowerUp(powerUp.x, powerUp.y, powerUp.type);
    });
    (payload.cells || []).forEach(cell => {
      this.createExplosion(cell.x, cell.y, 500);
    });
  }
  updateMapCell(x, y, newValue) {
    if (!this.mapData[y]) return;
    this.mapData[y][x] = newValue;
    const tile = this.container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (!tile) return;
    tile.className = 'tile tile-floor';
    tile.style.backgroundImage = 'url("./assets/blocks/block_floor.jpg")';
  }
  removeBomb(bombId, fallbackCell) {
    const bombs = this.world.query('Position', 'Bomb');
    for (const entity of bombs) {
      const pos = this.world.getComponent(entity, 'Position');
      const bomb = this.world.getComponent(entity, 'Bomb');
      const sameId = bombId && bomb && bomb.bombId === bombId;
      const sameCell = fallbackCell && pos && pos.gridX === fallbackCell.x && pos.gridY === fallbackCell.y;
      if (!sameId && !sameCell) continue;
      if (bomb.el && bomb.el.parentNode) {
        bomb.el.parentNode.removeChild(bomb.el);
      }
      this.world.destroyEntity(entity);
      return;
    }
  }
  createExplosion(gridX, gridY, duration) {
    const expEntity = this.world.createEntity();
    const expDiv = document.createElement('div');
    expDiv.className = 'explosion';
    expDiv.style.position = 'absolute';
    expDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    expDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    expDiv.style.left = `${gridX * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    expDiv.style.top = `${gridY * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    expDiv.style.zIndex = '7';
    this.container.appendChild(expDiv);
    this.world.addComponent(expEntity, 'Position', {
      gridX,
      gridY,
      x: gridX * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE,
      y: gridY * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE
    });
    this.world.addComponent(expEntity, 'Explosion', {
      duration,
      el: expDiv
    });
    setTimeout(() => {
      if (expDiv.parentNode) {
        expDiv.parentNode.removeChild(expDiv);
      }
      this.world.destroyEntity(expEntity);
    }, duration);
  }
  createPowerUp(gx, gy, type) {
    if (!type || this.claimedPowerUps.has(`${gx},${gy}`)) return;
    const pUpEntity = this.world.createEntity();
    this.world.addComponent(pUpEntity, 'Position', {
      gridX: gx,
      gridY: gy,
      x: gx * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE,
      y: gy * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE
    });
    const div = document.createElement('div');
    div.className = `powerup powerup-${type.toLowerCase()}`;
    div.style.position = 'absolute';
    div.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    div.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    div.style.left = `${gx * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    div.style.top = `${gy * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    div.style.zIndex = '5';
    this.container.appendChild(div);
    this.world.addComponent(pUpEntity, 'PowerUp', {
      type,
      el: div
    });
  }
  registerSystems() {
    this.world.addSystem((w, dt, now) => (0,_systems_renderSystem_js__WEBPACK_IMPORTED_MODULE_2__.renderSystem)(w, dt, now, ANIMATION_ROWS));
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
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_3__.setBombs)(player.maxBombs || 1);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_3__.setLives)(player.lives ?? 3);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_3__.setRange)(player.bombRange || 4);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_3__.setSpeed)(Math.round(velocity.speed));
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
  const boardDisplayWidth = boardWidth + GRID_BORDER_SIZE * 2 * 0.95;
  const boardDisplayHeight = boardHeight + GRID_BORDER_SIZE * 2 * 0.95;
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
    style: `width:${boardDisplayWidth}px;height:${boardDisplayHeight}px;`
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: "game-container",
    class: "game-grid",
    style: `position:relative;width:${boardWidth}px;height:${boardHeight}px;transform:scale(0.95);`
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
  textEl.textContent = s.text;
  if (s.secondsLeft) timerEl.textContent = "Time : " + s.secondsLeft;else timerEl.textContent = "";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUk7TUFDdkIsSUFBSSxDQUFDVixNQUFNLENBQUMvWCxZQUFZLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQztNQUN2RCxJQUFJLENBQUNvWSxZQUFZLENBQUMsQ0FBQztJQUN2QjtFQUNKO0VBRUFBLFlBQVlBLENBQUEsRUFBRztJQUNYLE1BQU1NLE9BQU8sR0FBRyxJQUFJLENBQUNiLEtBQUssQ0FBQ1ksS0FBSyxJQUFJLElBQUksQ0FBQ1osS0FBSyxDQUFDVyxNQUFNO0lBRXJELElBQUksQ0FBQ1IsSUFBSSxDQUFDdFQsU0FBUyxHQUFHZ1UsT0FBTyxHQUFHLHdCQUF3QixHQUFHLHlCQUF5QjtJQUNwRixJQUFJLENBQUNYLE1BQU0sQ0FBQ1ksU0FBUyxDQUFDUixNQUFNLENBQUMsVUFBVSxFQUFFTyxPQUFPLENBQUM7RUFDckQ7QUFDSjtBQUVBLGlFQUFlM1UsS0FBSyxFOzs7Ozs7VUNqRHBCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDNUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QsRTs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL2RvbS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29yay5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5LmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jaGF0LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2NvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy93b3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvZ2FtZS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2xvYmJ5LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL3JlZ2lzdGVyLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvc291bmQuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIHByb3BzLCAuLi5jaGlsZHJlbikge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiB0eXBlKHsgLi4uKHByb3BzIHx8IHt9KSwgY2hpbGRyZW4gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzIHx8IHt9KSB7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChcIm9uXCIpICYmIHR5cGVvZiBwcm9wc1trZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGtleS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZS5zZXRBdHRyaWJ1dGUoa2V5LCBwcm9wc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZsYXRDaGlsZHJlbiA9IGNoaWxkcmVuLmZsYXQoSW5maW5pdHkpO1xuICAgIGVsZS5hcHBlbmQoLi4uZmxhdENoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gbnVsbCAmJiBjaGlsZCAhPT0gdW5kZWZpbmVkICYmIGNoaWxkICE9PSBmYWxzZSkpO1xuXG4gICAgcmV0dXJuIGVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICBjb250YWluZXIucmVwbGFjZUNoaWxkcmVuKGVsZW1lbnQpO1xufVxuIiwiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4vcm91dGVyLmpzXCI7XG5cbmxldCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjsiLCJjb25zdCBlZmZlY3RTdGFjayA9IFtdO1xubGV0IGFjdGl2ZUVmZmVjdCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaWduYWwoaW5pdGlhbFZhbHVlKSB7XG4gICBsZXQgdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICBjb25zdCBlZmZlY3RzID0gbmV3IFNldCgpO1xuXG4gICBjb25zdCBSZWFkID0gKCkgPT4ge1xuICAgICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgICAgZWZmZWN0cy5hZGQoYWN0aXZlRWZmZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgIH1cblxuICAgY29uc3QgV3JpdGUgPSAobmV3VmFsdWUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgbGV0IGZuID0gbmV3VmFsdWU7XG4gICAgICAgICB2YWx1ZSA9IGZuKHZhbHVlKTtcbiAgICAgIH0gXG4gICAgICBlbHNlIHZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBlZmZlY3RzLmZvckVhY2goZWZmZWN0ID0+IGVmZmVjdCgpKTtcbiAgIH1cblxuICAgcmV0dXJuIFtSZWFkLCBXcml0ZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFZmZlY3QoZWZmZWN0KSB7XG4gICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3Q7XG4gICBlZmZlY3QoKTtcbiAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbn1cbiIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgICNSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICNGaXJzdFJlc29sdmUgPSBmYWxzZTtcblxuICAgIG9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy4jUm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFxuICAgIG5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSA9IFwicHVzaFwiIH0gPSB7fSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBcIi9cIiArIHBhdGg7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzb2x2ZShwYXRoID0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbcGF0aF07XG5cbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm4oeyB1cmw6IG5ldyBVUkwobG9jYXRpb24uaHJlZikgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxpc3RlbihvbkVycm9yNDA0KSB7XG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5pbnRlcmNlcHQoe1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLnBhdGhuYW1lLCB0aGlzLiNSb3V0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3VybC5wYXRobmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I0MDQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbih7IHVybCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNGaXJzdFJlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdGhpcy4jRmlyc3RSZXNvbHZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgcmVuZGVyIH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmtcIjtcbmltcG9ydCBSZWdpc3RlciwgeyBzZXRFcnJvciB9IGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBNZW51IGZyb20gXCIuLi9wYWdlcy9tZW51XCI7XG5pbXBvcnQgTG9iYnkgZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiOyBcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo1MDAwXCIpO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5sZXQgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwibG9iYnlfdXBkYXRlXCI6XG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb25hdGluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXRlcyh7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IG1lc3NhZ2UucGxheWVyc0NvdW50LFxuICAgICAgICAgICAgICAgIHNlY29uZHNMZWZ0OiBtZXNzYWdlLnNlY29uZHNMZWZ0LFxuICAgICAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UudGV4dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfc3RhcnRlZFwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZW5kZXIoPEdhbWUgZ3JpZD17bWVzc2FnZS5ncmlkfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSAobWVzc2FnZS5wbGF5ZXJzIHx8IFtdKS5maW5kKHBsYXllciA9PiBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UueW91clBsYXllcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIGxvY2FsUGxheWVyLm5pY2tuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIdWRQbGF5ZXJOYW1lKGxvY2FsUGxheWVyLm5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBHYW1lRW5naW5lKGdhbWVDb250YWluZXIsIG1lc3NhZ2UuZ3JpZCwgd3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lLmluaXQobWVzc2FnZS55b3VyUGxheWVySWQsIG1lc3NhZ2UucGxheWVycyB8fCBbXSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2FtZSBjb250YWluZXIgd2FzIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwicm9vbV9hbG9uZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgIGNhc2UgXCJjaGF0X21lc3NhZ2VcIjpcbiAgICAgICAgICAgIHNldE1lc3NhZ2VzKHByZXYgPT4gWy4uLnByZXYsIHtcbiAgICAgICAgICAgICAgICBuaWNrbmFtZTogbWVzc2FnZS5uaWNrbmFtZSB8fCBcIlBsYXllclwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UubWVzc2FnZSxcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJleHBsb3Npb25fY2hlY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfZGFtYWdlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUGxheWVyRGFtYWdlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJnYW1lX292ZXJcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZUdhbWVPdmVyKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVycm9yXCI6XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPT09IFwicmVnaXN0ZXItcGFnZVwiKSB7XG4gICAgICAgICAgICAgICAgc2V0RXJyb3IobWVzc2FnZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQobWVzc2FnZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yXCIsIGVycik7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZWRcIik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgd3NzO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCB3c3MgZnJvbSBcIi4uL2FwcC9hcHBcIjtcblxuY29uc3QgW21lc3NhZ2VzLCBzZXRNZXNzYWdlc10gPSBjcmVhdGVTaWduYWwoW10pO1xuZXhwb3J0IHsgc2V0TWVzc2FnZXMgfTtcblxuZnVuY3Rpb24gQ2hhdFBsYXllcnMoKSB7XG4gICAgY29uc3QgbWVzc2FnZXNDb250YWluZXIgPSA8ZGl2IGNsYXNzPVwibWVzc2FnZXNcIj48L2Rpdj47XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBtc2dzID0gbWVzc2FnZXMoKTtcbiAgICAgICAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBmb3IgKGxldCBtc2cgb2YgbXNncykge1xuICAgICAgICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBtc2cgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBwLnRleHRDb250ZW50ID0gbXNnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwLnRleHRDb250ZW50ID0gYCR7bXNnLm5pY2tuYW1lfTogJHttc2cubWVzc2FnZX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXNDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5yZW1vdmVDaGlsZChtZXNzYWdlc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgbXNncy51bnNoaWZ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZm9ybURhdGEuZ2V0KFwibWVzc2FnZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJjaGF0X21lc3NhZ2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH0pKTtcbiAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdFwiIG9uU3VibWl0PXticm9hZGNhc3RNZXNzYWdlfT5cbiAgICAgICAgICAgIHttZXNzYWdlc0NvbnRhaW5lcn1cbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJ0eXBlIHRvIHRoZSBvdGhlciBwbGF5ZXJzIC4uLlwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVycztcbiIsIi8vIC9zcmMvZWNzL2NvbXBvbmVudHMuanNcblxuZXhwb3J0IGNvbnN0IFBvc2l0aW9uQ29tcG9uZW50ID0gKGd4LCBneSwgdGlsZVNpemUgPSA2NCkgPT4gKHtcbiAgICBncmlkWDogZ3gsXG4gICAgZ3JpZFk6IGd5LFxuICAgIHg6IGd4ICogdGlsZVNpemUsXG4gICAgeTogZ3kgKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRYOiBneCAqIHRpbGVTaXplLFxuICAgIHRhcmdldFk6IGd5ICogdGlsZVNpemVcbn0pO1xuXG5leHBvcnQgY29uc3QgVmVsb2NpdHlDb21wb25lbnQgPSAoYmFzZVNwZWVkID0gMi41KSA9PiAoe1xuICAgIGJhc2VTcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkOiBiYXNlU3BlZWQsXG4gICAgc3BlZWRCb29zdDogMCxcbiAgICBzcGVlZEJvb3N0VGltZVJlbWFpbmluZzogMCxcbiAgICBpc01vdmluZzogZmFsc2UsXG4gICAgZGlyZWN0aW9uOiAnZG93bidcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5wdXRDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGlucHV0UXVldWU6IFtdXG59KTtcblxuZXhwb3J0IGNvbnN0IFJlbmRlcmFibGVDb21wb25lbnQgPSAoZWwsIGZyYW1lV2lkdGggPSA2NCwgZnJhbWVIZWlnaHQgPSA2NCwgdG90YWxGcmFtZXMgPSA0LCBmcHMgPSAxMikgPT4gKHtcbiAgICBlbDogZWwsXG4gICAgZnJhbWVXaWR0aDogZnJhbWVXaWR0aCxcbiAgICBmcmFtZUhlaWdodDogZnJhbWVIZWlnaHQsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiB0b3RhbEZyYW1lcyxcbiAgICBydW5GcmFtZXM6IDQsXG4gICAgaWRsZUZyYW1lczogMixcbiAgICBmcHM6IGZwcyxcbiAgICBpZGxlRnBzOiA0LFxuICAgIGxhc3RGcmFtZVRpbWU6IDAsXG4gICAgcm93OiAwLFxuICAgIHN0YXRlOiAnSURMRScsXG4gICAgbGFzdFN0YXRlOiAnSURMRSdcbn0pO1xuXG5leHBvcnQgY29uc3QgUGxheWVyQ29tcG9uZW50ID0gKGlkLCBjaGFyVHlwZSwgaXNMb2NhbCA9IGZhbHNlKSA9PiAoe1xuICAgIGlkOiBpZCxcbiAgICBjaGFyVHlwZTogY2hhclR5cGUsXG4gICAgaXNMb2NhbDogaXNMb2NhbFxufSk7XG5cbmV4cG9ydCBjb25zdCBCb21iQ29tcG9uZW50ID0gKG93bmVySWQsIHRpbWVyID0gMjAwMCwgcmFuZ2UgPSAyKSA9PiAoe1xuICAgIG93bmVySWQ6IG93bmVySWQsXG4gICAgdGltZXI6IHRpbWVyLFxuICAgIHJhbmdlOiByYW5nZSxcbiAgICBleHBsb2RlZDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgRXhwbG9zaW9uQ29tcG9uZW50ID0gKGR1cmF0aW9uID0gNTAwKSA9PiAoe1xuICAgIGR1cmF0aW9uOiBkdXJhdGlvblxufSk7XG5cbmV4cG9ydCBjb25zdCBQb3dlclVwQ29tcG9uZW50ID0gKHR5cGUpID0+ICh7XG4gICAgdHlwZTogdHlwZSwgXG4gICAgcGlja2VkVXA6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEJlaGF2aW9yQ29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBmYXN0U2hvZXNMZXZlbDogMSxcbiAgICBib21iczoge1xuICAgICAgICBtYXg6IDEsXG4gICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgIHJhbmdlOiAyXG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQuanMnO1xuaW1wb3J0IHtcbiAgICBQb3NpdGlvbkNvbXBvbmVudCxcbiAgICBWZWxvY2l0eUNvbXBvbmVudCxcbiAgICBJbnB1dENvbXBvbmVudCxcbiAgICBSZW5kZXJhYmxlQ29tcG9uZW50LFxuICAgIFBsYXllckNvbXBvbmVudCxcbiAgICBCb21iQ29tcG9uZW50XG59IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5cbmltcG9ydCB7IHJlbmRlclN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQsIFRJTEVfU0laRSB9IGZyb20gJy4uL3BhZ2VzL2dhbWUnO1xuXG5jb25zdCBTUFJJVEVfQ09MVU1OUyA9IDEzO1xuY29uc3QgU1BSSVRFX1JPV1MgPSA1NDtcbmNvbnN0IEFOSU1BVElPTl9ST1dTID0ge1xuICAgIFJVTjogeyB1cDogMzgsIGxlZnQ6IDM5LCBkb3duOiA0MCwgcmlnaHQ6IDQxIH0sXG4gICAgSURMRTogeyB1cDogMjIsIGxlZnQ6IDIzLCBkb3duOiAyNCwgcmlnaHQ6IDI1IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBHYW1lRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNDb250YWluZXIsIG1hcERhdGEsIHNvY2tldCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNhbnZhc0NvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gbWFwRGF0YTtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcbiAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IG51bGw7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5sYXN0SW5wdXRTZW50ID0gXCJcIjtcbiAgICB9XG5cbiAgICBpbml0KGxvY2FsUGxheWVySWQsIGFsbFBsYXllcnMpIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZExvY2FsUGxheWVySWQgPSBTdHJpbmcobG9jYWxQbGF5ZXJJZCk7XG5cbiAgICAgICAgYWxsUGxheWVycy5mb3JFYWNoKHBEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gU3RyaW5nKHBEYXRhLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcERhdGEuY29sb3IgfHwgXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gYHBsYXllciBwbGF5ZXItJHtjb2xvcn1gO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS56SW5kZXggPSAnMTAnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS53aWR0aCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IGAke1NQUklURV9DT0xVTU5TICogVElMRV9TSVpFfXB4ICR7U1BSSVRFX1JPV1MgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyRGl2KTtcblxuICAgICAgICAgICAgY29uc3Qgc3ggPSBwRGF0YS54IHx8IDE7XG4gICAgICAgICAgICBjb25zdCBzeSA9IHBEYXRhLnkgfHwgMTtcblxuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nLCBQb3NpdGlvbkNvbXBvbmVudChzeCwgc3ksIFRJTEVfU0laRSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknLCBWZWxvY2l0eUNvbXBvbmVudChwRGF0YS5zcGVlZCB8fCAyLjUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnLCBSZW5kZXJhYmxlQ29tcG9uZW50KHBsYXllckRpdiwgVElMRV9TSVpFLCBUSUxFX1NJWkUsIDQsIDEyKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaXNMb2NhbCA9IHBsYXllcklkID09PSBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZDtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckNvbXAgPSBQbGF5ZXJDb21wb25lbnQocGxheWVySWQsIGNvbG9yLCBpc0xvY2FsKTtcbiAgICAgICAgICAgIHBsYXllckNvbXAubGl2ZXMgPSBwRGF0YS5saXZlcyA/PyAzO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5tYXhCb21icyA9IHBEYXRhLm1heEJvbWJzID8/IDE7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmJvbWJSYW5nZSA9IHBEYXRhLmJvbWJSYW5nZSA/PyAyO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5hbGl2ZSA9IHBEYXRhLmFsaXZlID8/IHRydWU7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInLCBwbGF5ZXJDb21wKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMuc2V0KHBsYXllcklkLCBwbGF5ZXJFbnRpdHkpO1xuXG4gICAgICAgICAgICBpZiAoaXNMb2NhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBwbGF5ZXJFbnRpdHk7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnLCBJbnB1dENvbXBvbmVudCgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHBsYXllckVudGl0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbR2FtZUVuZ2luZV0gTG9jYWwgcGxheWVyIHdhcyBub3QgZm91bmRcIiwge1xuICAgICAgICAgICAgICAgIGxvY2FsUGxheWVySWQsXG4gICAgICAgICAgICAgICAgcGxheWVyczogYWxsUGxheWVycy5tYXAocGxheWVyID0+IHBsYXllci5pZCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTeXN0ZW1zKCk7XG5cbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChub3cpID0+IHRoaXMuZ2FtZUxvb3Aobm93KSk7XG4gICAgfVxuXG4gICAgc2V0dXBJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgaWYgKCFpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGdldEtleURpcmVjdGlvbiA9IChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1VwJyB8fCBrZXkgPT09ICd3JyB8fCBrZXkgPT09ICdaJyB8fCBrZXkgPT09ICd6JykgcmV0dXJuICd1cCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dEb3duJyB8fCBrZXkgPT09ICdzJyB8fCBrZXkgPT09ICdTJykgcmV0dXJuICdkb3duJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0xlZnQnIHx8IGtleSA9PT0gJ2EnIHx8IGtleSA9PT0gJ1EnIHx8IGtleSA9PT0gJ3EnKSByZXR1cm4gJ2xlZnQnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93UmlnaHQnIHx8IGtleSA9PT0gJ2QnIHx8IGtleSA9PT0gJ0QnKSByZXR1cm4gJ3JpZ2h0JztcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5pbnB1dFF1ZXVlLmluY2x1ZGVzKGRpcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZS51bnNoaWZ0KGRpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZElucHV0KGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnICcgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcEJvbWIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYW5kbGVLZXlVcCA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUgPSBpbnB1dC5pbnB1dFF1ZXVlLmZpbHRlcihkID0+IGQgIT09IGRpcik7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kSW5wdXQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzZW5kSW5wdXQoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNvY2tldCB8fCB0aGlzLnNvY2tldC5yZWFkeVN0YXRlICE9PSBXZWJTb2NrZXQuT1BFTikgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXBsYXllci5hbGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGlucHV0LmlucHV0UXVldWVbMF0gfHwgbnVsbDtcbiAgICAgICAgY29uc3QgaXNNb3ZpbmcgPSBCb29sZWFuKGRpcmVjdGlvbik7XG4gICAgICAgIGNvbnN0IGlucHV0U3RhdGUgPSBgJHtkaXJlY3Rpb24gfHwgJ2lkbGUnfToke2lzTW92aW5nID8gMSA6IDB9YDtcblxuICAgICAgICBpZiAodGhpcy5sYXN0SW5wdXRTZW50ID09PSBpbnB1dFN0YXRlKSByZXR1cm47XG4gICAgICAgIHRoaXMubGFzdElucHV0U2VudCA9IGlucHV0U3RhdGU7XG5cbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiAnTU9WRV9TVEFURScsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGRpcmVjdGlvbiwgaXNNb3ZpbmcgfVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgZHJvcEJvbWIoKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhcGxheWVyLmFsaXZlKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgY3VycmVudEJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLmZpbHRlcihiRW50aXR5ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndvcmxkLmdldENvbXBvbmVudChiRW50aXR5LCAnQm9tYicpLm93bmVySWQgPT09IHBsYXllci5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRCb21icy5sZW5ndGggPj0gcGxheWVyLm1heEJvbWJzKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnRFJPUF9CT01CJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7fVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlLCBib21iSWQgPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiAoYm9tYklkICYmIGJvbWIuYm9tYklkID09PSBib21iSWQpIHx8XG4gICAgICAgICAgICAgICAgKGJvbWIub3duZXJJZCA9PT0gb3duZXJJZCAmJiBwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuYm9tYklkID0gYm9tYklkO1xuICAgICAgICBib21iQ29tcC5lbCA9IGJvbWJEaXY7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJywgYm9tYkNvbXApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVNb3ZlKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbaGFuZGxlUmVtb3RlTW92ZV0gSW52YWxpZCBwYXlsb2FkOlwiLCBwYXlsb2FkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIEVudGl0eSBub3QgZm91bmQgZm9yIHBsYXllciAke3BheWxvYWQuaWR9LiBBdmFpbGFibGUgcGxheWVyczpgLCBBcnJheS5mcm9tKHRoaXMucGxheWVyRW50aXRpZXMua2V5cygpKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwb3MgfHwgIXZlbCB8fCAhcmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgICAgICBwb3MuZ3JpZFggPSBwYXlsb2FkLmdyaWRYO1xuICAgICAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgICAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwYXlsb2FkLnk7XG4gICAgICAgIHBvcy54ID0gcGF5bG9hZC54O1xuICAgICAgICBwb3MueSA9IHBheWxvYWQueTtcblxuICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gcGF5bG9hZC5zdGF0ZSB8fCAocGF5bG9hZC5pc01vdmluZyA/ICdSVU4nIDogJ0lETEUnKTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVCb21iKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3JlYXRlQm9tYihwYXlsb2FkLmlkLCBwYXlsb2FkLngsIHBheWxvYWQueSwgcGF5bG9hZC5yYW5nZSB8fCAyLCBwYXlsb2FkLmJvbWJJZCk7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCBwYXlsb2FkLnggPT09IHVuZGVmaW5lZCB8fCBwYXlsb2FkLnkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlUG93ZXJVcEF0KHBheWxvYWQueCwgcGF5bG9hZC55KTtcblxuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICBpZiAocGF5bG9hZC5zdGF0cykge1xuICAgICAgICAgICAgdGhpcy5hcHBseVNlcnZlclN0YXRzKGVudGl0eSwgcGF5bG9hZC5zdGF0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVQb3dlclVwQXQoZ3JpZFgsIGdyaWRZKSB7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHtncmlkWH0sJHtncmlkWX1gKTtcbiAgICAgICAgY29uc3QgcG93ZXJVcHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwb3dlclVwID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCFwb3MgfHwgIXBvd2VyVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcG93ZXJVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAocG93ZXJVcC5lbCAmJiBwb3dlclVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG93ZXJVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvd2VyVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5U2VydmVyU3RhdHMoZW50aXR5LCBzdGF0cykge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhc3RhdHMpIHJldHVybjtcblxuICAgICAgICBwbGF5ZXIubGl2ZXMgPSBzdGF0cy5saXZlcyA/PyBwbGF5ZXIubGl2ZXM7XG4gICAgICAgIHBsYXllci5tYXhCb21icyA9IHN0YXRzLm1heEJvbWJzID8/IHBsYXllci5tYXhCb21icztcbiAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHN0YXRzLmJvbWJSYW5nZSA/PyBwbGF5ZXIuYm9tYlJhbmdlO1xuICAgICAgICBwbGF5ZXIuYWxpdmUgPSBzdGF0cy5hbGl2ZSA/PyBwbGF5ZXIuYWxpdmU7XG5cbiAgICAgICAgaWYgKHZlbG9jaXR5ICYmIHR5cGVvZiBzdGF0cy5zcGVlZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5LnNwZWVkID0gc3RhdHMuc3BlZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVQbGF5ZXJEYW1hZ2VkKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcGxheWVyKSByZXR1cm47XG5cbiAgICAgICAgcGxheWVyLmxpdmVzID0gcGF5bG9hZC5saXZlcyA/PyBwbGF5ZXIubGl2ZXM7XG4gICAgICAgIHBsYXllci5hbGl2ZSA9IHBheWxvYWQuYWxpdmUgPz8gcGxheWVyLmFsaXZlO1xuXG4gICAgICAgIGlmICghcGxheWVyLmFsaXZlKSB7XG4gICAgICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgICAgICBpZiAodmVsb2NpdHkpIHZlbG9jaXR5LmlzTW92aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLnJlbW92ZUNvbXBvbmVudChlbnRpdHksICdJbnB1dCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUdhbWVPdmVyKHBheWxvYWQpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHdpbm5lck5hbWUgPSBwYXlsb2FkICYmIHBheWxvYWQud2lubmVyTmFtZSA/IHBheWxvYWQud2lubmVyTmFtZSA6IFwiQSBwbGF5ZXJcIjtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBhbGVydChgJHt3aW5uZXJOYW1lfSB3aW5zIWApLCA1MCk7XG4gICAgfVxuXG4gICAgaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZChwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlQm9tYihwYXlsb2FkLmJvbWJJZCwgcGF5bG9hZC5jZWxscyAmJiBwYXlsb2FkLmNlbGxzWzBdKTtcblxuICAgICAgICAocGF5bG9hZC5kZXN0cm95ZWRCbG9ja3MgfHwgW10pLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1hcENlbGwoY2VsbC54LCBjZWxsLnksIDIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAocGF5bG9hZC5zcGF3bmVkUG93ZXJVcHMgfHwgW10pLmZvckVhY2gocG93ZXJVcCA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBvd2VyVXAocG93ZXJVcC54LCBwb3dlclVwLnksIHBvd2VyVXAudHlwZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIChwYXlsb2FkLmNlbGxzIHx8IFtdKS5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFeHBsb3Npb24oY2VsbC54LCBjZWxsLnksIDUwMCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZU1hcENlbGwoeCwgeSwgbmV3VmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1hcERhdGFbeV0pIHJldHVybjtcblxuICAgICAgICB0aGlzLm1hcERhdGFbeV1beF0gPSBuZXdWYWx1ZTtcblxuICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWApO1xuICAgICAgICBpZiAoIXRpbGUpIHJldHVybjtcblxuICAgICAgICB0aWxlLmNsYXNzTmFtZSA9ICd0aWxlIHRpbGUtZmxvb3InO1xuICAgICAgICB0aWxlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIpJztcbiAgICB9XG5cbiAgICByZW1vdmVCb21iKGJvbWJJZCwgZmFsbGJhY2tDZWxsKSB7XG4gICAgICAgIGNvbnN0IGJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpO1xuXG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGJvbWJzKSB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIGNvbnN0IHNhbWVJZCA9IGJvbWJJZCAmJiBib21iICYmIGJvbWIuYm9tYklkID09PSBib21iSWQ7XG4gICAgICAgICAgICBjb25zdCBzYW1lQ2VsbCA9IGZhbGxiYWNrQ2VsbCAmJiBwb3MgJiYgcG9zLmdyaWRYID09PSBmYWxsYmFja0NlbGwueCAmJiBwb3MuZ3JpZFkgPT09IGZhbGxiYWNrQ2VsbC55O1xuXG4gICAgICAgICAgICBpZiAoIXNhbWVJZCAmJiAhc2FtZUNlbGwpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAoYm9tYi5lbCAmJiBib21iLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYm9tYi5lbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlRXhwbG9zaW9uKGdyaWRYLCBncmlkWSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgZXhwRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgY29uc3QgZXhwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGV4cERpdi5jbGFzc05hbWUgPSAnZXhwbG9zaW9uJztcbiAgICAgICAgZXhwRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZXhwRGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgZXhwRGl2LnN0eWxlLmhlaWdodCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBleHBEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBleHBEaXYuc3R5bGUuekluZGV4ID0gJzcnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChleHBEaXYpO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFksIHg6IGdyaWRYICogVElMRV9TSVpFLCB5OiBncmlkWSAqIFRJTEVfU0laRSB9KTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJywgeyBkdXJhdGlvbiwgZWw6IGV4cERpdiB9KTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmIChleHBEaXYucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGV4cERpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGV4cERpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLndvcmxkLmRlc3Ryb3lFbnRpdHkoZXhwRW50aXR5KTtcbiAgICAgICAgfSwgZHVyYXRpb24pO1xuICAgIH1cblxuICAgIGNyZWF0ZVBvd2VyVXAoZ3gsIGd5LCB0eXBlKSB7XG4gICAgICAgIGlmICghdHlwZSB8fCB0aGlzLmNsYWltZWRQb3dlclVwcy5oYXMoYCR7Z3h9LCR7Z3l9YCkpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwVXBFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogVElMRV9TSVpFLCB5OiBneSAqIFRJTEVfU0laRSB9KTtcblxuICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IGBwb3dlcnVwIHBvd2VydXAtJHt0eXBlLnRvTG93ZXJDYXNlKCl9YDtcbiAgICAgICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgZGl2LnN0eWxlLmhlaWdodCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBkaXYuc3R5bGUudG9wID0gYCR7Z3kgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBkaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnLCB7IHR5cGUsIGVsOiBkaXYgfSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTeXN0ZW1zKCkge1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcmVuZGVyU3lzdGVtKHcsIGR0LCBub3csIEFOSU1BVElPTl9ST1dTKSk7XG4gICAgfVxuXG4gICAgZ2FtZUxvb3Aobm93KSB7XG4gICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZHQgPSBub3cgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gbm93O1xuICAgICAgICB0aGlzLndvcmxkLnVwZGF0ZShkdCwgbm93KTtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHModGhpcy5sb2NhbFBsYXllckVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobmV4dE5vdykgPT4gdGhpcy5nYW1lTG9vcChuZXh0Tm93KSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUh1ZFN0YXRzKGVudGl0eSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgICAgIHNldExpdmVzKHBsYXllci5saXZlcyA/PyAzKTtcbiAgICAgICAgc2V0UmFuZ2UocGxheWVyLmJvbWJSYW5nZSB8fCA0KTtcbiAgICAgICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcmVuZGVyU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBhbmltUm93cykge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1JlbmRlcmFibGUnKTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG5cbiAgICAgICAgaWYgKCFyZW5kZXJhYmxlLmVsKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHJlbmRlcmFibGUuc3RhdGU7XG4gICAgICAgIGNvbnN0IHRhcmdldFJvdyA9IGFuaW1Sb3dzW3N0YXRlXVt2ZWwuZGlyZWN0aW9uXTtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlc2V0IGFuaW1hdGlvbiB3aGVuIHJvdyBvciBzdGF0ZSBjaGFuZ2VzXG4gICAgICAgIGlmIChyZW5kZXJhYmxlLnJvdyAhPT0gdGFyZ2V0Um93IHx8IHJlbmRlcmFibGUubGFzdFN0YXRlICE9PSBzdGF0ZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5yb3cgPSB0YXJnZXRSb3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RTdGF0ZSA9IHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZnJhbWVDb3VudCA9IHN0YXRlID09PSAnUlVOJyA/IHJlbmRlcmFibGUucnVuRnJhbWVzIDogcmVuZGVyYWJsZS5pZGxlRnJhbWVzO1xuICAgICAgICBjb25zdCBmcmFtZURlbGF5ID0gc3RhdGUgPT09ICdSVU4nID8gMTAwMCAvIHJlbmRlcmFibGUuZnBzIDogMTAwMCAvIHJlbmRlcmFibGUuaWRsZUZwcztcblxuICAgICAgICBpZiAobm93IC0gcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID4gZnJhbWVEZWxheSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKyAxKSAlIGZyYW1lQ291bnQ7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3NYID0gLShyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSAqIHJlbmRlcmFibGUuZnJhbWVXaWR0aCk7XG4gICAgICAgIGNvbnN0IHBvc1kgPSAtKHJlbmRlcmFibGUucm93ICogcmVuZGVyYWJsZS5mcmFtZUhlaWdodCk7XG4gICAgICAgIFxuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGAke3Bvc1h9cHggJHtwb3NZfXB4YDtcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtwb3MueH1weCwgJHtwb3MueX1weCwgMClgO1xuICAgIH1cbn1cbiIsIi8vIC9zcmMvZWNzL3dvcmxkLmpzXG5cbmV4cG9ydCBjbGFzcyBXb3JsZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubmV4dEVudGl0eUlkID0gMDtcbiAgICAgICAgdGhpcy5lbnRpdGllcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gbmV3IE1hcCgpOyBcbiAgICAgICAgdGhpcy5zeXN0ZW1zID0gW107XG4gICAgfVxuXG4gICAgY3JlYXRlRW50aXR5KCkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLm5leHRFbnRpdHlJZCsrO1xuICAgICAgICB0aGlzLmVudGl0aWVzLmFkZChlbnRpdHkpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cblxuICAgIGRlc3Ryb3lFbnRpdHkoZW50aXR5KSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIGZvciAoY29uc3QgW2NvbXBvbmVudE5hbWUsIGNvbXBvbmVudE1hcF0gb2YgdGhpcy5jb21wb25lbnRzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSwgY29tcG9uZW50RGF0YSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5jb21wb25lbnRzLmhhcyhjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnNldChjb21wb25lbnROYW1lLCBuZXcgTWFwKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSkuc2V0KGVudGl0eSwgY29tcG9uZW50RGF0YSk7XG4gICAgfVxuXG4gICAgZ2V0Q29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50TWFwID8gY29tcG9uZW50TWFwLmdldChlbnRpdHkpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJlbW92ZUNvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudE1hcCkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcXVlcnkoLi4uY29tcG9uZW50TmFtZXMpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudE5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZmlyc3RNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzWzBdKTtcbiAgICAgICAgaWYgKCFmaXJzdE1hcCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBmaXJzdE1hcC5rZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBoYXNBbGwgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb21wb25lbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmICghbWFwIHx8ICFtYXAuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzQWxsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNBbGwgJiYgdGhpcy5lbnRpdGllcy5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZFN5c3RlbShzeXN0ZW1GdW5jdGlvbikge1xuICAgICAgICB0aGlzLnN5c3RlbXMucHVzaChzeXN0ZW1GdW5jdGlvbik7XG4gICAgfVxuXG4gICAgdXBkYXRlKGR0LCBub3cpIHtcbiAgICAgICAgZm9yIChjb25zdCBzeXN0ZW0gb2YgdGhpcy5zeXN0ZW1zKSB7XG4gICAgICAgICAgICBzeXN0ZW0odGhpcywgZHQsIG5vdyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuZXhwb3J0IGNvbnN0IFRJTEVfU0laRSA9IDQ4O1xuY29uc3QgR1JJRF9CT1JERVJfU0laRSA9IDY7XG5cbmNvbnN0IGltYWdlcyA9IHtcbiAgICAyOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIixcbiAgICAzOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja193YWxsLnBuZ1wiLFxuICAgIDQ6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2V4cGxvaXQucG5nXCIsXG59O1xuXG5jb25zdCBbcGxheWVyTmFtZSwgc2V0UGxheWVyTmFtZV0gPSBjcmVhdGVTaWduYWwoXCJQbGF5ZXIgMVwiKTtcbmNvbnN0IFtsaXZlcywgc2V0TGl2ZXNdID0gY3JlYXRlU2lnbmFsKDMpO1xuY29uc3QgW3NwZWVkLCBzZXRTcGVlZF0gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbYm9tYnMsIHNldEJvbWJzXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtyYW5nZSwgc2V0UmFuZ2VdID0gY3JlYXRlU2lnbmFsKDEpO1xuZXhwb3J0IHsgc2V0UGxheWVyTmFtZSwgc2V0TGl2ZXMsIHNldFNwZWVkLCBzZXRCb21icywgc2V0UmFuZ2UgfTtcblxuY29uc3QgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IG5hbWVFbC50ZXh0Q29udGVudCA9IHBsYXllck5hbWUoKTsgfSk7XG5cbmNvbnN0IGxpdmVzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGxpdmVzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHNwZWVkRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHNwZWVkLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IGJvbWJzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGJvbWJzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHJhbmdlRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHJhbmdlLXZhbHVlXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbGl2ZXNFbC50ZXh0Q29udGVudCA9IGxpdmVzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgc3BlZWRFbC50ZXh0Q29udGVudCA9IHNwZWVkKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgYm9tYnNFbC50ZXh0Q29udGVudCA9IGJvbWJzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgcmFuZ2VFbC50ZXh0Q29udGVudCA9IHJhbmdlKCk7IH0pO1xuXG5mdW5jdGlvbiBHYW1lKHsgZ3JpZCB9KSB7XG4gICAgY29uc3QgYm9hcmRXaWR0aCA9IGdyaWRbMF0ubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gZ3JpZC5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmREaXNwbGF5V2lkdGggPSBib2FyZFdpZHRoICsgR1JJRF9CT1JERVJfU0laRSAqIDIgKiAwLjk1O1xuICAgIGNvbnN0IGJvYXJkRGlzcGxheUhlaWdodCA9IGJvYXJkSGVpZ2h0ICsgR1JJRF9CT1JERVJfU0laRSAqIDIgKiAwLjk1O1xuICAgIGNvbnN0IHJvd3MgPSBbXTtcbiAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgZ3JpZC5sZW5ndGg7IHJvd0luZGV4KyspIHtcbiAgICAgICAgY29uc3QgY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IGdyaWRbcm93SW5kZXhdLmxlbmd0aDsgY29sSW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGdyaWRbcm93SW5kZXhdW2NvbEluZGV4XTtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBcInRpbGVcIjtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGB3aWR0aDoke1RJTEVfU0laRX1weDtoZWlnaHQ6JHtUSUxFX1NJWkV9cHg7YDtcblxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDIgfHwgY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLWZsb29yXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLXdhbGxcIjtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbM119KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1s0XX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAwIHx8IGNlbGwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbMl19KWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNlbGxzLnB1c2goPGRpdiBjbGFzcz17Y2xhc3NOYW1lfSBkYXRhLXg9e2NvbEluZGV4fSBkYXRhLXk9e3Jvd0luZGV4fSBzdHlsZT17c3R5bGV9PjwvZGl2Pik7XG4gICAgICAgIH1cbiAgICAgICAgcm93cy5wdXNoKDxkaXYgY2xhc3M9XCJncmlkLXJvd1wiPntjZWxsc308L2Rpdj4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtZ2xhc3NcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtYmFyXCI+XG4gICAgICAgICAgICAgICAgICAgIHtuYW1lRWx9XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1zdGF0c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5MaXZlczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bGl2ZXNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5TcGVlZDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c3BlZWRFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5Cb21iczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Ym9tYnNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5SYW5nZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmFuZ2VFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1ib2FyZC1mcmFtZVwiIHN0eWxlPXtgd2lkdGg6JHtib2FyZERpc3BsYXlXaWR0aH1weDtoZWlnaHQ6JHtib2FyZERpc3BsYXlIZWlnaHR9cHg7YH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZ2FtZS1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJnYW1lLWdyaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2Bwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoke2JvYXJkV2lkdGh9cHg7aGVpZ2h0OiR7Ym9hcmRIZWlnaHR9cHg7dHJhbnNmb3JtOnNjYWxlKDAuOTUpO2B9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCBDaGF0UGxheWVycyBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmxldCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gY3JlYXRlU2lnbmFsKHt9KTtcbmV4cG9ydCB7IHNldFN0YXRlcyB9O1xuXG5sZXQgcm9vbUlkRWwgPSA8cD5Sb29tIElEOiA8L3A+O1xubGV0IHBsYXllcnNFbCA9IDxwPlBsYXllcnM6ICAvIDQ8L3A+O1xubGV0IHRleHRFbCA9IDxwPjwvcD47XG5sZXQgdGltZXJFbCA9IDxwPlRpbWVyOiA8L3A+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHMgPSBzdGF0ZXMoKTtcbiAgICByb29tSWRFbC50ZXh0Q29udGVudCA9IGBSb29tIElEOiAke3Mucm9vbUlkfWA7XG4gICAgcGxheWVyc0VsLnRleHRDb250ZW50ID0gYFBsYXllcnM6ICR7cy5wbGF5ZXJzQ291bnR9IC8gNGA7XG4gICAgdGV4dEVsLnRleHRDb250ZW50ID0gcy50ZXh0O1xuICAgIGlmIChzLnNlY29uZHNMZWZ0KSB0aW1lckVsLnRleHRDb250ZW50ID0gXCJUaW1lIDogXCIgKyBzLnNlY29uZHNMZWZ0O1xuICAgIGVsc2UgdGltZXJFbC50ZXh0Q29udGVudCA9IFwiXCI7XG59KTtcblxuZnVuY3Rpb24gTG9iYnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbmF0aW5lci1sb2JieVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYmJ5LWJveFwiPlxuICAgICAgICAgICAgICAgIDxoMT5Mb2JieTwvaDE+XG4gICAgICAgICAgICAgICAge3Jvb21JZEVsfVxuICAgICAgICAgICAgICAgIHtwbGF5ZXJzRWx9XG4gICAgICAgICAgICAgICAge3RleHRFbH1cbiAgICAgICAgICAgICAgICB7dGltZXJFbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPENoYXRQbGF5ZXJzIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG5yZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5sZXQgbWVudUVsID0gKFxuICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICA8aDE+WW91IFdpbiE8L2gxPlxuICAgICAgICA8cD5BbGwgb3RoZXIgcGxheWVycyBoYXZlIGxlZnQgdGhlIGdhbWUuPC9wPlxuICAgICAgICB7cmVwbGF5QnRufVxuICAgIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVudSgpIHtcbiAgICByZXR1cm4gbWVudUVsO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSBjcmVhdGVTaWduYWwoXCJcIik7XG5leHBvcnQgeyBzZXRFcnJvciB9O1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGVycm9yRWwgPSA8cCBjbGFzcz1cInJlZ2lzdGVyLWVycm9yXCI+PC9wPjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGVycm9yRWwudGV4dENvbnRlbnQgPSBlcnJvcigpO1xuICAgIH0pO1xuXG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgbmlja25hbWUgPSBmb3JtRGF0YS5nZXQoXCJuaWNrbmFtZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFuaWNrbmFtZSB8fCBuaWNrbmFtZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgc2V0RXJyb3IoXCJJbnZhbGlkIG5pY2tuYW1lXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0RXJyb3IoXCJcIik7XG4gICAgICAgIHN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHNldFBsYXllck5hbWUobmlja25hbWUpO1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwibmlja25hbWVfb2ZfdGhlX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAge2Vycm9yRWx9XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaWNrbmFtZS1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5pY2tuYW1lXCIgcGxhY2Vob2xkZXI9XCJlbnRlciB5b3VyIG5hbWVcIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJyZWdpc3Rlci1idXR0b25cIiB0eXBlPVwic3VibWl0XCI+c3RhcnQgcGxheWluZzwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RlcjtcbiIsImNsYXNzIFNvdW5kIHtcbiAgICBjb25zdHJ1Y3RvcihzcmMpIHtcbiAgICAgICAgdGhpcy5tdXNpYyA9IG5ldyBBdWRpbyhzcmMpO1xuICAgICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuXG4gICAgICAgIHRoaXMubXVzaWMubG9vcCA9IHRydWU7XG4gICAgICAgIHRoaXMubXVzaWMudm9sdW1lID0gMC40O1xuXG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTmFtZSA9IFwic291bmQtYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFwcGVuZCh0aGlzLmljb24pO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZSgpKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZCh0aGlzLmJ1dHRvbik7XG5cbiAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLm11c2ljLnBsYXkoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11c2ljLnBhdXNlZCB8fCB0aGlzLm11c2ljLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb25cIik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQnV0dG9uKCkge1xuICAgICAgICBjb25zdCBpc011dGVkID0gdGhpcy5tdXNpYy5tdXRlZCB8fCB0aGlzLm11c2ljLnBhdXNlZDtcblxuICAgICAgICB0aGlzLmljb24uY2xhc3NOYW1lID0gaXNNdXRlZCA/IFwiZmEtc29saWQgZmEtdm9sdW1lLW9mZlwiIDogXCJmYS1zb2xpZCBmYS12b2x1bWUtaGlnaFwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtbXV0ZWRcIiwgaXNNdXRlZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VuZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAvYXBwLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwicHJvcHMiLCJjaGlsZHJlbiIsImVsZSIsImRvY3VtZW50Iiwia2V5Iiwic3RhcnRzV2l0aCIsImV2ZW50TmFtZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwiZmxhdENoaWxkcmVuIiwiZmxhdCIsIkluZmluaXR5IiwiYXBwZW5kIiwiZmlsdGVyIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJyZW5kZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwicmVwbGFjZUNoaWxkcmVuIiwiUm91dGVyIiwicm91dGVyIiwiZWZmZWN0U3RhY2siLCJhY3RpdmVFZmZlY3QiLCJjcmVhdGVTaWduYWwiLCJpbml0aWFsVmFsdWUiLCJ2YWx1ZSIsImVmZmVjdHMiLCJTZXQiLCJSZWFkIiwiYWRkIiwiV3JpdGUiLCJuZXdWYWx1ZSIsImZuIiwiZm9yRWFjaCIsImVmZmVjdCIsImNyZWF0ZUVmZmVjdCIsInB1c2giLCJwb3AiLCJsZW5ndGgiLCJSb3V0ZXMiLCJPYmplY3QiLCJjcmVhdGUiLCJGaXJzdFJlc29sdmUiLCJvbiIsInBhdGgiLCJoYW5kbGVyIiwibmF2aWdhdGUiLCJoaXN0b3J5IiwibmF2aWdhdGlvbiIsInJlc29sdmUiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwidXJsIiwiVVJMIiwiaHJlZiIsImxpc3RlbiIsIm9uRXJyb3I0MDQiLCJldmVudCIsImRlc3RpbmF0aW9uIiwiaW50ZXJjZXB0IiwiY29uc29sZSIsImxvZyIsIlJlZ2lzdGVyIiwic2V0RXJyb3IiLCJHYW1lIiwiTWVudSIsIkxvYmJ5Iiwic2V0U3RhdGVzIiwic2V0UGxheWVyTmFtZSIsInNldEh1ZFBsYXllck5hbWUiLCJTb3VuZCIsInNldE1lc3NhZ2VzIiwiR2FtZUVuZ2luZSIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsInNvdW5kIiwiY3VycmVudEdhbWVFbmdpbmUiLCJpbml0IiwiYm9keSIsImNsYXNzTmFtZSIsImFsZXJ0Iiwid3MiLCJtZXNzYWdlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsInF1ZXJ5U2VsZWN0b3IiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJzZWNvbmRzTGVmdCIsInRleHQiLCJncmlkIiwic2V0VGltZW91dCIsImdhbWVDb250YWluZXIiLCJkZXN0cm95IiwibG9jYWxQbGF5ZXIiLCJwbGF5ZXJzIiwiZmluZCIsInBsYXllciIsImlkIiwieW91clBsYXllcklkIiwibmlja25hbWUiLCJlbmdpbmUiLCJlcnJvciIsInByZXYiLCJoYW5kbGVSZW1vdGVNb3ZlIiwicGF5bG9hZCIsImhhbmRsZVJlbW90ZUJvbWIiLCJoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkIiwiaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZCIsImhhbmRsZVBsYXllckRhbWFnZWQiLCJoYW5kbGVHYW1lT3ZlciIsImVyciIsIm1lc3NhZ2VzIiwiQ2hhdFBsYXllcnMiLCJtZXNzYWdlc0NvbnRhaW5lciIsImNsYXNzIiwibXNncyIsImlubmVySFRNTCIsIm1zZyIsInAiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsImdldCIsInRyaW0iLCJyZXNldCIsInNlbmQiLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlBvc2l0aW9uQ29tcG9uZW50IiwiZ3giLCJneSIsInRpbGVTaXplIiwiZ3JpZFgiLCJncmlkWSIsIngiLCJ5IiwidGFyZ2V0WCIsInRhcmdldFkiLCJWZWxvY2l0eUNvbXBvbmVudCIsImJhc2VTcGVlZCIsInNwZWVkIiwic3BlZWRCb29zdCIsInNwZWVkQm9vc3RUaW1lUmVtYWluaW5nIiwiaXNNb3ZpbmciLCJkaXJlY3Rpb24iLCJJbnB1dENvbXBvbmVudCIsImlucHV0UXVldWUiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiZWwiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJ0b3RhbEZyYW1lcyIsImZwcyIsImN1cnJlbnRGcmFtZSIsInJ1bkZyYW1lcyIsImlkbGVGcmFtZXMiLCJpZGxlRnBzIiwibGFzdEZyYW1lVGltZSIsInJvdyIsInN0YXRlIiwibGFzdFN0YXRlIiwiUGxheWVyQ29tcG9uZW50IiwiY2hhclR5cGUiLCJpc0xvY2FsIiwiQm9tYkNvbXBvbmVudCIsIm93bmVySWQiLCJ0aW1lciIsInJhbmdlIiwiZXhwbG9kZWQiLCJFeHBsb3Npb25Db21wb25lbnQiLCJkdXJhdGlvbiIsIlBvd2VyVXBDb21wb25lbnQiLCJwaWNrZWRVcCIsIkJlaGF2aW9yQ29tcG9uZW50IiwiZmFzdFNob2VzTGV2ZWwiLCJib21icyIsIm1heCIsImN1cnJlbnQiLCJXb3JsZCIsInJlbmRlclN5c3RlbSIsInNldEJvbWJzIiwic2V0TGl2ZXMiLCJzZXRSYW5nZSIsInNldFNwZWVkIiwiVElMRV9TSVpFIiwiU1BSSVRFX0NPTFVNTlMiLCJTUFJJVEVfUk9XUyIsIkFOSU1BVElPTl9ST1dTIiwiUlVOIiwidXAiLCJsZWZ0IiwiZG93biIsInJpZ2h0IiwiSURMRSIsImNvbnN0cnVjdG9yIiwiY2FudmFzQ29udGFpbmVyIiwibWFwRGF0YSIsInNvY2tldCIsIndvcmxkIiwibG9jYWxQbGF5ZXJFbnRpdHkiLCJwbGF5ZXJFbnRpdGllcyIsIk1hcCIsImxhc3RUaW1lIiwicmVtb3ZlSW5wdXRMaXN0ZW5lcnMiLCJhbmltYXRpb25GcmFtZSIsInJ1bm5pbmciLCJjbGFpbWVkUG93ZXJVcHMiLCJsYXN0SW5wdXRTZW50IiwibG9jYWxQbGF5ZXJJZCIsImFsbFBsYXllcnMiLCJub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCIsIlN0cmluZyIsInBEYXRhIiwicGxheWVySWQiLCJwbGF5ZXJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJwbGF5ZXJEaXYiLCJjb2xvciIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ3aWxsQ2hhbmdlIiwid2lkdGgiLCJoZWlnaHQiLCJiYWNrZ3JvdW5kU2l6ZSIsInN4Iiwic3kiLCJhZGRDb21wb25lbnQiLCJwbGF5ZXJDb21wIiwibGl2ZXMiLCJtYXhCb21icyIsImJvbWJSYW5nZSIsImFsaXZlIiwic2V0IiwidXBkYXRlSHVkU3RhdHMiLCJzZXR1cElucHV0Iiwid2FybiIsIm1hcCIsInJlZ2lzdGVyU3lzdGVtcyIsInBlcmZvcm1hbmNlIiwibm93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZ2FtZUxvb3AiLCJpbnB1dCIsImdldENvbXBvbmVudCIsImdldEtleURpcmVjdGlvbiIsImhhbmRsZUtleURvd24iLCJkaXIiLCJpbmNsdWRlcyIsInNlbmRJbnB1dCIsImNvZGUiLCJkcm9wQm9tYiIsImhhbmRsZUtleVVwIiwiZCIsIndpbmRvdyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZWFkeVN0YXRlIiwiT1BFTiIsIkJvb2xlYW4iLCJpbnB1dFN0YXRlIiwiY3VycmVudEJvbWJzIiwicXVlcnkiLCJiRW50aXR5IiwiY3JlYXRlQm9tYiIsImJvbWJJZCIsImV4aXN0cyIsInNvbWUiLCJlbnRpdHkiLCJwb3MiLCJib21iIiwiYm9tYkVudGl0eSIsImJvbWJEaXYiLCJ0b3AiLCJib21iQ29tcCIsIkFycmF5IiwiZnJvbSIsImtleXMiLCJ2ZWwiLCJyZW5kZXJhYmxlIiwicmVtb3ZlUG93ZXJVcEF0Iiwic3RhdHMiLCJhcHBseVNlcnZlclN0YXRzIiwicG93ZXJVcHMiLCJwb3dlclVwIiwicGFyZW50Tm9kZSIsImRlc3Ryb3lFbnRpdHkiLCJ2ZWxvY2l0eSIsInJlbW92ZUNvbXBvbmVudCIsIndpbm5lck5hbWUiLCJyZW1vdmVCb21iIiwiY2VsbHMiLCJkZXN0cm95ZWRCbG9ja3MiLCJjZWxsIiwidXBkYXRlTWFwQ2VsbCIsInNwYXduZWRQb3dlclVwcyIsImNyZWF0ZVBvd2VyVXAiLCJjcmVhdGVFeHBsb3Npb24iLCJ0aWxlIiwiYmFja2dyb3VuZEltYWdlIiwiZmFsbGJhY2tDZWxsIiwic2FtZUlkIiwic2FtZUNlbGwiLCJleHBFbnRpdHkiLCJleHBEaXYiLCJoYXMiLCJwVXBFbnRpdHkiLCJkaXYiLCJhZGRTeXN0ZW0iLCJ3IiwiZHQiLCJ1cGRhdGUiLCJuZXh0Tm93IiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJNYXRoIiwicm91bmQiLCJjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImdldFBsYXllck5hbWUiLCJnZXRJdGVtIiwiYW5pbVJvd3MiLCJlbnRpdGllcyIsInRhcmdldFJvdyIsImZyYW1lQ291bnQiLCJmcmFtZURlbGF5IiwicG9zWCIsInBvc1kiLCJiYWNrZ3JvdW5kUG9zaXRpb24iLCJ0cmFuc2Zvcm0iLCJuZXh0RW50aXR5SWQiLCJjb21wb25lbnRzIiwic3lzdGVtcyIsImRlbGV0ZSIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnRNYXAiLCJlbnRyaWVzIiwiY29tcG9uZW50RGF0YSIsImNvbXBvbmVudE5hbWVzIiwiZmlyc3RNYXAiLCJyZXN1bHRzIiwiaGFzQWxsIiwiaSIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwiR1JJRF9CT1JERVJfU0laRSIsImltYWdlcyIsInBsYXllck5hbWUiLCJuYW1lRWwiLCJsaXZlc0VsIiwic3BlZWRFbCIsImJvbWJzRWwiLCJyYW5nZUVsIiwiYm9hcmRXaWR0aCIsImJvYXJkSGVpZ2h0IiwiYm9hcmREaXNwbGF5V2lkdGgiLCJib2FyZERpc3BsYXlIZWlnaHQiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJyZXBsYXlCdG4iLCJyZWxvYWQiLCJtZW51RWwiLCJzdWJtaXR0ZWQiLCJlcnJvckVsIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImJ1dHRvbiIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwidXBkYXRlQnV0dG9uIiwicGxheSIsInRoZW4iLCJjYXRjaCIsInBhdXNlZCIsIm11dGVkIiwiaXNNdXRlZCIsImNsYXNzTGlzdCJdLCJzb3VyY2VSb290IjoiIn0=