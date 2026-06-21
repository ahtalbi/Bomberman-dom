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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29yay5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5LmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jaGF0LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2NvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy93b3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvZ2FtZS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2xvYmJ5LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL3JlZ2lzdGVyLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvc291bmQuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIHByb3BzLCAuLi5jaGlsZHJlbikge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiB0eXBlKHsgLi4uKHByb3BzIHx8IHt9KSwgY2hpbGRyZW4gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzIHx8IHt9KSB7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChcIm9uXCIpICYmIHR5cGVvZiBwcm9wc1trZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGtleS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZS5zZXRBdHRyaWJ1dGUoa2V5LCBwcm9wc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZsYXRDaGlsZHJlbiA9IGNoaWxkcmVuLmZsYXQoSW5maW5pdHkpO1xuICAgIGVsZS5hcHBlbmQoLi4uZmxhdENoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gbnVsbCAmJiBjaGlsZCAhPT0gdW5kZWZpbmVkICYmIGNoaWxkICE9PSBmYWxzZSkpO1xuXG4gICAgcmV0dXJuIGVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICBjb250YWluZXIucmVwbGFjZUNoaWxkcmVuKGVsZW1lbnQpO1xufVxuIiwiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4vcm91dGVyLmpzXCI7XG5cbmxldCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjsiLCJjb25zdCBlZmZlY3RTdGFjayA9IFtdO1xubGV0IGFjdGl2ZUVmZmVjdCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaWduYWwoaW5pdGlhbFZhbHVlKSB7XG4gICBsZXQgdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICBjb25zdCBlZmZlY3RzID0gbmV3IFNldCgpO1xuXG4gICBjb25zdCBSZWFkID0gKCkgPT4ge1xuICAgICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgICAgZWZmZWN0cy5hZGQoYWN0aXZlRWZmZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgIH1cblxuICAgY29uc3QgV3JpdGUgPSAobmV3VmFsdWUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgbGV0IGZuID0gbmV3VmFsdWU7XG4gICAgICAgICB2YWx1ZSA9IGZuKHZhbHVlKTtcbiAgICAgIH0gXG4gICAgICBlbHNlIHZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBlZmZlY3RzLmZvckVhY2goZWZmZWN0ID0+IGVmZmVjdCgpKTtcbiAgIH1cblxuICAgcmV0dXJuIFtSZWFkLCBXcml0ZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFZmZlY3QoZWZmZWN0KSB7XG4gICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3Q7XG4gICBlZmZlY3QoKTtcbiAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbn1cbiIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgICNSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICNGaXJzdFJlc29sdmUgPSBmYWxzZTtcblxuICAgIG9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy4jUm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFxuICAgIG5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSA9IFwicHVzaFwiIH0gPSB7fSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBcIi9cIiArIHBhdGg7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzb2x2ZShwYXRoID0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbcGF0aF07XG5cbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm4oeyB1cmw6IG5ldyBVUkwobG9jYXRpb24uaHJlZikgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxpc3RlbihvbkVycm9yNDA0KSB7XG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5pbnRlcmNlcHQoe1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLnBhdGhuYW1lLCB0aGlzLiNSb3V0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3VybC5wYXRobmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I0MDQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbih7IHVybCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNGaXJzdFJlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdGhpcy4jRmlyc3RSZXNvbHZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgcmVuZGVyIH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmtcIjtcbmltcG9ydCBSZWdpc3RlciwgeyBzZXRFcnJvciB9IGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBNZW51IGZyb20gXCIuLi9wYWdlcy9tZW51XCI7XG5pbXBvcnQgTG9iYnkgZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiOyBcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo1MDAwXCIpO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5sZXQgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwicm9vbV91cGRhdGVcIjpcbiAgICAgICAgY2FzZSBcImxvYmJ5X3RpbWVyXCI6XG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb25hdGluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXRlcyh7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IG1lc3NhZ2UucGxheWVyc0NvdW50LFxuICAgICAgICAgICAgICAgIHNlY29uZHNMZWZ0OiBtZXNzYWdlLnNlY29uZHNMZWZ0LFxuICAgICAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UudGV4dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfc3RhcnRlZFwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZW5kZXIoPEdhbWUgZ3JpZD17bWVzc2FnZS5ncmlkfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSAobWVzc2FnZS5wbGF5ZXJzIHx8IFtdKS5maW5kKHBsYXllciA9PiBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UueW91clBsYXllcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIGxvY2FsUGxheWVyLm5pY2tuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIdWRQbGF5ZXJOYW1lKGxvY2FsUGxheWVyLm5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBHYW1lRW5naW5lKGdhbWVDb250YWluZXIsIG1lc3NhZ2UuZ3JpZCwgd3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lLmluaXQobWVzc2FnZS55b3VyUGxheWVySWQsIG1lc3NhZ2UucGxheWVycyB8fCBbXSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2FtZSBjb250YWluZXIgd2FzIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwicm9vbV9hbG9uZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgIGNhc2UgXCJjaGF0X21lc3NhZ2VcIjpcbiAgICAgICAgICAgIHNldE1lc3NhZ2VzKHByZXYgPT4gWy4uLnByZXYsIHtcbiAgICAgICAgICAgICAgICBuaWNrbmFtZTogbWVzc2FnZS5uaWNrbmFtZSB8fCBcIlBsYXllclwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UubWVzc2FnZSxcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJleHBsb3Npb25fY2hlY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfZGFtYWdlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUGxheWVyRGFtYWdlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJnYW1lX292ZXJcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZUdhbWVPdmVyKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVycm9yXCI6XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPT09IFwicmVnaXN0ZXItcGFnZVwiKSB7XG4gICAgICAgICAgICAgICAgc2V0RXJyb3IobWVzc2FnZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQobWVzc2FnZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yXCIsIGVycik7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZWRcIik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgd3NzO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCB3c3MgZnJvbSBcIi4uL2FwcC9hcHBcIjtcblxuY29uc3QgW21lc3NhZ2VzLCBzZXRNZXNzYWdlc10gPSBjcmVhdGVTaWduYWwoW10pO1xuZXhwb3J0IHsgc2V0TWVzc2FnZXMgfTtcblxuZnVuY3Rpb24gQ2hhdFBsYXllcnMoKSB7XG4gICAgY29uc3QgbWVzc2FnZXNDb250YWluZXIgPSA8ZGl2IGNsYXNzPVwibWVzc2FnZXNcIj48L2Rpdj47XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBtc2dzID0gbWVzc2FnZXMoKTtcbiAgICAgICAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBmb3IgKGxldCBtc2cgb2YgbXNncykge1xuICAgICAgICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBtc2cgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBwLnRleHRDb250ZW50ID0gbXNnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwLnRleHRDb250ZW50ID0gYCR7bXNnLm5pY2tuYW1lfTogJHttc2cubWVzc2FnZX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXNDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5yZW1vdmVDaGlsZChtZXNzYWdlc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgbXNncy51bnNoaWZ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZm9ybURhdGEuZ2V0KFwibWVzc2FnZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJjaGF0X21lc3NhZ2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH0pKTtcbiAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdFwiIG9uU3VibWl0PXticm9hZGNhc3RNZXNzYWdlfT5cbiAgICAgICAgICAgIHttZXNzYWdlc0NvbnRhaW5lcn1cbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJ0eXBlIHRvIHRoZSBvdGhlciBwbGF5ZXJzIC4uLlwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVycztcbiIsIi8vIC9zcmMvZWNzL2NvbXBvbmVudHMuanNcblxuZXhwb3J0IGNvbnN0IFBvc2l0aW9uQ29tcG9uZW50ID0gKGd4LCBneSwgdGlsZVNpemUgPSA2NCkgPT4gKHtcbiAgICBncmlkWDogZ3gsXG4gICAgZ3JpZFk6IGd5LFxuICAgIHg6IGd4ICogdGlsZVNpemUsXG4gICAgeTogZ3kgKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRYOiBneCAqIHRpbGVTaXplLFxuICAgIHRhcmdldFk6IGd5ICogdGlsZVNpemVcbn0pO1xuXG5leHBvcnQgY29uc3QgVmVsb2NpdHlDb21wb25lbnQgPSAoYmFzZVNwZWVkID0gMi41KSA9PiAoe1xuICAgIGJhc2VTcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkOiBiYXNlU3BlZWQsXG4gICAgc3BlZWRCb29zdDogMCxcbiAgICBzcGVlZEJvb3N0VGltZVJlbWFpbmluZzogMCxcbiAgICBpc01vdmluZzogZmFsc2UsXG4gICAgZGlyZWN0aW9uOiAnZG93bidcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5wdXRDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGlucHV0UXVldWU6IFtdXG59KTtcblxuZXhwb3J0IGNvbnN0IFJlbmRlcmFibGVDb21wb25lbnQgPSAoZWwsIGZyYW1lV2lkdGggPSA2NCwgZnJhbWVIZWlnaHQgPSA2NCwgdG90YWxGcmFtZXMgPSA0LCBmcHMgPSAxMikgPT4gKHtcbiAgICBlbDogZWwsXG4gICAgZnJhbWVXaWR0aDogZnJhbWVXaWR0aCxcbiAgICBmcmFtZUhlaWdodDogZnJhbWVIZWlnaHQsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiB0b3RhbEZyYW1lcyxcbiAgICBydW5GcmFtZXM6IDQsXG4gICAgaWRsZUZyYW1lczogMixcbiAgICBmcHM6IGZwcyxcbiAgICBpZGxlRnBzOiA0LFxuICAgIGxhc3RGcmFtZVRpbWU6IDAsXG4gICAgcm93OiAwLFxuICAgIHN0YXRlOiAnSURMRScsXG4gICAgbGFzdFN0YXRlOiAnSURMRSdcbn0pO1xuXG5leHBvcnQgY29uc3QgUGxheWVyQ29tcG9uZW50ID0gKGlkLCBjaGFyVHlwZSwgaXNMb2NhbCA9IGZhbHNlKSA9PiAoe1xuICAgIGlkOiBpZCxcbiAgICBjaGFyVHlwZTogY2hhclR5cGUsXG4gICAgaXNMb2NhbDogaXNMb2NhbFxufSk7XG5cbmV4cG9ydCBjb25zdCBCb21iQ29tcG9uZW50ID0gKG93bmVySWQsIHRpbWVyID0gMjAwMCwgcmFuZ2UgPSAyKSA9PiAoe1xuICAgIG93bmVySWQ6IG93bmVySWQsXG4gICAgdGltZXI6IHRpbWVyLFxuICAgIHJhbmdlOiByYW5nZSxcbiAgICBleHBsb2RlZDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgRXhwbG9zaW9uQ29tcG9uZW50ID0gKGR1cmF0aW9uID0gNTAwKSA9PiAoe1xuICAgIGR1cmF0aW9uOiBkdXJhdGlvblxufSk7XG5cbmV4cG9ydCBjb25zdCBQb3dlclVwQ29tcG9uZW50ID0gKHR5cGUpID0+ICh7XG4gICAgdHlwZTogdHlwZSwgXG4gICAgcGlja2VkVXA6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEJlaGF2aW9yQ29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBnaG9zdE1vZGU6IGZhbHNlLFxuICAgIHRocm93YWJsZTogZmFsc2UsXG4gICAgZGV0b25hdG9yOiBmYWxzZSxcbiAgICBmYXN0U2hvZXNMZXZlbDogMSxcbiAgICBib21iczoge1xuICAgICAgICBtYXg6IDEsXG4gICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgIHJhbmdlOiAyXG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQuanMnO1xuaW1wb3J0IHtcbiAgICBQb3NpdGlvbkNvbXBvbmVudCxcbiAgICBWZWxvY2l0eUNvbXBvbmVudCxcbiAgICBJbnB1dENvbXBvbmVudCxcbiAgICBSZW5kZXJhYmxlQ29tcG9uZW50LFxuICAgIFBsYXllckNvbXBvbmVudCxcbiAgICBCb21iQ29tcG9uZW50XG59IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5cbmltcG9ydCB7IHJlbmRlclN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQsIFRJTEVfU0laRSB9IGZyb20gJy4uL3BhZ2VzL2dhbWUnO1xuXG5jb25zdCBTUFJJVEVfQ09MVU1OUyA9IDEzO1xuY29uc3QgU1BSSVRFX1JPV1MgPSA1NDtcbmNvbnN0IEFOSU1BVElPTl9ST1dTID0ge1xuICAgIFJVTjogeyB1cDogMzgsIGxlZnQ6IDM5LCBkb3duOiA0MCwgcmlnaHQ6IDQxIH0sXG4gICAgSURMRTogeyB1cDogMjIsIGxlZnQ6IDIzLCBkb3duOiAyNCwgcmlnaHQ6IDI1IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBHYW1lRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNDb250YWluZXIsIG1hcERhdGEsIHNvY2tldCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNhbnZhc0NvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gbWFwRGF0YTtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcbiAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IG51bGw7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5sYXN0SW5wdXRTZW50ID0gXCJcIjtcbiAgICB9XG5cbiAgICBpbml0KGxvY2FsUGxheWVySWQsIGFsbFBsYXllcnMpIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZExvY2FsUGxheWVySWQgPSBTdHJpbmcobG9jYWxQbGF5ZXJJZCk7XG5cbiAgICAgICAgYWxsUGxheWVycy5mb3JFYWNoKHBEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gU3RyaW5nKHBEYXRhLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcERhdGEuY29sb3IgfHwgXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gYHBsYXllciBwbGF5ZXItJHtjb2xvcn1gO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS56SW5kZXggPSAnMTAnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS53aWR0aCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IGAke1NQUklURV9DT0xVTU5TICogVElMRV9TSVpFfXB4ICR7U1BSSVRFX1JPV1MgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyRGl2KTtcblxuICAgICAgICAgICAgY29uc3Qgc3ggPSBwRGF0YS54IHx8IDE7XG4gICAgICAgICAgICBjb25zdCBzeSA9IHBEYXRhLnkgfHwgMTtcblxuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nLCBQb3NpdGlvbkNvbXBvbmVudChzeCwgc3ksIFRJTEVfU0laRSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknLCBWZWxvY2l0eUNvbXBvbmVudChwRGF0YS5zcGVlZCB8fCAyLjUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnLCBSZW5kZXJhYmxlQ29tcG9uZW50KHBsYXllckRpdiwgVElMRV9TSVpFLCBUSUxFX1NJWkUsIDQsIDEyKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaXNMb2NhbCA9IHBsYXllcklkID09PSBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZDtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckNvbXAgPSBQbGF5ZXJDb21wb25lbnQocGxheWVySWQsIGNvbG9yLCBpc0xvY2FsKTtcbiAgICAgICAgICAgIHBsYXllckNvbXAubGl2ZXMgPSBwRGF0YS5saXZlcyA/PyAzO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5tYXhCb21icyA9IHBEYXRhLm1heEJvbWJzID8/IDE7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmJvbWJSYW5nZSA9IHBEYXRhLmJvbWJSYW5nZSA/PyAyO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5hbGl2ZSA9IHBEYXRhLmFsaXZlID8/IHRydWU7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInLCBwbGF5ZXJDb21wKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMuc2V0KHBsYXllcklkLCBwbGF5ZXJFbnRpdHkpO1xuXG4gICAgICAgICAgICBpZiAoaXNMb2NhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBwbGF5ZXJFbnRpdHk7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnLCBJbnB1dENvbXBvbmVudCgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHBsYXllckVudGl0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbR2FtZUVuZ2luZV0gTG9jYWwgcGxheWVyIHdhcyBub3QgZm91bmRcIiwge1xuICAgICAgICAgICAgICAgIGxvY2FsUGxheWVySWQsXG4gICAgICAgICAgICAgICAgcGxheWVyczogYWxsUGxheWVycy5tYXAocGxheWVyID0+IHBsYXllci5pZCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTeXN0ZW1zKCk7XG5cbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChub3cpID0+IHRoaXMuZ2FtZUxvb3Aobm93KSk7XG4gICAgfVxuXG4gICAgc2V0dXBJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgaWYgKCFpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGdldEtleURpcmVjdGlvbiA9IChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1VwJyB8fCBrZXkgPT09ICd3JyB8fCBrZXkgPT09ICdaJyB8fCBrZXkgPT09ICd6JykgcmV0dXJuICd1cCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dEb3duJyB8fCBrZXkgPT09ICdzJyB8fCBrZXkgPT09ICdTJykgcmV0dXJuICdkb3duJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0xlZnQnIHx8IGtleSA9PT0gJ2EnIHx8IGtleSA9PT0gJ1EnIHx8IGtleSA9PT0gJ3EnKSByZXR1cm4gJ2xlZnQnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93UmlnaHQnIHx8IGtleSA9PT0gJ2QnIHx8IGtleSA9PT0gJ0QnKSByZXR1cm4gJ3JpZ2h0JztcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5pbnB1dFF1ZXVlLmluY2x1ZGVzKGRpcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZS51bnNoaWZ0KGRpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZElucHV0KGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnICcgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcEJvbWIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYW5kbGVLZXlVcCA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUgPSBpbnB1dC5pbnB1dFF1ZXVlLmZpbHRlcihkID0+IGQgIT09IGRpcik7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kSW5wdXQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzZW5kSW5wdXQoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNvY2tldCB8fCB0aGlzLnNvY2tldC5yZWFkeVN0YXRlICE9PSBXZWJTb2NrZXQuT1BFTikgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXBsYXllci5hbGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGlucHV0LmlucHV0UXVldWVbMF0gfHwgbnVsbDtcbiAgICAgICAgY29uc3QgaXNNb3ZpbmcgPSBCb29sZWFuKGRpcmVjdGlvbik7XG4gICAgICAgIGNvbnN0IGlucHV0U3RhdGUgPSBgJHtkaXJlY3Rpb24gfHwgJ2lkbGUnfToke2lzTW92aW5nID8gMSA6IDB9YDtcblxuICAgICAgICBpZiAodGhpcy5sYXN0SW5wdXRTZW50ID09PSBpbnB1dFN0YXRlKSByZXR1cm47XG4gICAgICAgIHRoaXMubGFzdElucHV0U2VudCA9IGlucHV0U3RhdGU7XG5cbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiAnTU9WRV9TVEFURScsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IGRpcmVjdGlvbiwgaXNNb3ZpbmcgfVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgZHJvcEJvbWIoKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhcGxheWVyLmFsaXZlKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgY3VycmVudEJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLmZpbHRlcihiRW50aXR5ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndvcmxkLmdldENvbXBvbmVudChiRW50aXR5LCAnQm9tYicpLm93bmVySWQgPT09IHBsYXllci5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRCb21icy5sZW5ndGggPj0gcGxheWVyLm1heEJvbWJzKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnRFJPUF9CT01CJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7fVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlLCBib21iSWQgPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiAoYm9tYklkICYmIGJvbWIuYm9tYklkID09PSBib21iSWQpIHx8XG4gICAgICAgICAgICAgICAgKGJvbWIub3duZXJJZCA9PT0gb3duZXJJZCAmJiBwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuYm9tYklkID0gYm9tYklkO1xuICAgICAgICBib21iQ29tcC5lbCA9IGJvbWJEaXY7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJywgYm9tYkNvbXApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVNb3ZlKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbaGFuZGxlUmVtb3RlTW92ZV0gSW52YWxpZCBwYXlsb2FkOlwiLCBwYXlsb2FkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIEVudGl0eSBub3QgZm91bmQgZm9yIHBsYXllciAke3BheWxvYWQuaWR9LiBBdmFpbGFibGUgcGxheWVyczpgLCBBcnJheS5mcm9tKHRoaXMucGxheWVyRW50aXRpZXMua2V5cygpKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwb3MgfHwgIXZlbCB8fCAhcmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgICAgICBwb3MuZ3JpZFggPSBwYXlsb2FkLmdyaWRYO1xuICAgICAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgICAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwYXlsb2FkLnk7XG4gICAgICAgIHBvcy54ID0gcGF5bG9hZC54O1xuICAgICAgICBwb3MueSA9IHBheWxvYWQueTtcblxuICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gcGF5bG9hZC5zdGF0ZSB8fCAocGF5bG9hZC5pc01vdmluZyA/ICdSVU4nIDogJ0lETEUnKTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVCb21iKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3JlYXRlQm9tYihwYXlsb2FkLmlkLCBwYXlsb2FkLngsIHBheWxvYWQueSwgcGF5bG9hZC5yYW5nZSB8fCAyLCBwYXlsb2FkLmJvbWJJZCk7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCBwYXlsb2FkLnggPT09IHVuZGVmaW5lZCB8fCBwYXlsb2FkLnkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlUG93ZXJVcEF0KHBheWxvYWQueCwgcGF5bG9hZC55KTtcblxuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICBpZiAocGF5bG9hZC5zdGF0cykge1xuICAgICAgICAgICAgdGhpcy5hcHBseVNlcnZlclN0YXRzKGVudGl0eSwgcGF5bG9hZC5zdGF0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVQb3dlclVwQXQoZ3JpZFgsIGdyaWRZKSB7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHtncmlkWH0sJHtncmlkWX1gKTtcbiAgICAgICAgY29uc3QgcG93ZXJVcHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwb3dlclVwID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCFwb3MgfHwgIXBvd2VyVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcG93ZXJVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAocG93ZXJVcC5lbCAmJiBwb3dlclVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG93ZXJVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvd2VyVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5U2VydmVyU3RhdHMoZW50aXR5LCBzdGF0cykge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhc3RhdHMpIHJldHVybjtcblxuICAgICAgICBwbGF5ZXIubGl2ZXMgPSBzdGF0cy5saXZlcyA/PyBwbGF5ZXIubGl2ZXM7XG4gICAgICAgIHBsYXllci5tYXhCb21icyA9IHN0YXRzLm1heEJvbWJzID8/IHBsYXllci5tYXhCb21icztcbiAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHN0YXRzLmJvbWJSYW5nZSA/PyBwbGF5ZXIuYm9tYlJhbmdlO1xuICAgICAgICBwbGF5ZXIuYWxpdmUgPSBzdGF0cy5hbGl2ZSA/PyBwbGF5ZXIuYWxpdmU7XG5cbiAgICAgICAgaWYgKHZlbG9jaXR5ICYmIHR5cGVvZiBzdGF0cy5zcGVlZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5LnNwZWVkID0gc3RhdHMuc3BlZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVQbGF5ZXJEYW1hZ2VkKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcGxheWVyKSByZXR1cm47XG5cbiAgICAgICAgcGxheWVyLmxpdmVzID0gcGF5bG9hZC5saXZlcyA/PyBwbGF5ZXIubGl2ZXM7XG4gICAgICAgIHBsYXllci5hbGl2ZSA9IHBheWxvYWQuYWxpdmUgPz8gcGxheWVyLmFsaXZlO1xuXG4gICAgICAgIGlmICghcGxheWVyLmFsaXZlKSB7XG4gICAgICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgICAgICBpZiAodmVsb2NpdHkpIHZlbG9jaXR5LmlzTW92aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLnJlbW92ZUNvbXBvbmVudChlbnRpdHksICdJbnB1dCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUdhbWVPdmVyKHBheWxvYWQpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHdpbm5lck5hbWUgPSBwYXlsb2FkICYmIHBheWxvYWQud2lubmVyTmFtZSA/IHBheWxvYWQud2lubmVyTmFtZSA6IFwiQSBwbGF5ZXJcIjtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBhbGVydChgJHt3aW5uZXJOYW1lfSB3aW5zIWApLCA1MCk7XG4gICAgfVxuXG4gICAgaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZChwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlQm9tYihwYXlsb2FkLmJvbWJJZCwgcGF5bG9hZC5jZWxscyAmJiBwYXlsb2FkLmNlbGxzWzBdKTtcblxuICAgICAgICAocGF5bG9hZC5kZXN0cm95ZWRCbG9ja3MgfHwgW10pLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1hcENlbGwoY2VsbC54LCBjZWxsLnksIDIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAocGF5bG9hZC5zcGF3bmVkUG93ZXJVcHMgfHwgW10pLmZvckVhY2gocG93ZXJVcCA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBvd2VyVXAocG93ZXJVcC54LCBwb3dlclVwLnksIHBvd2VyVXAudHlwZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIChwYXlsb2FkLmNlbGxzIHx8IFtdKS5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFeHBsb3Npb24oY2VsbC54LCBjZWxsLnksIDUwMCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZU1hcENlbGwoeCwgeSwgbmV3VmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1hcERhdGFbeV0pIHJldHVybjtcblxuICAgICAgICB0aGlzLm1hcERhdGFbeV1beF0gPSBuZXdWYWx1ZTtcblxuICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWApO1xuICAgICAgICBpZiAoIXRpbGUpIHJldHVybjtcblxuICAgICAgICB0aWxlLmNsYXNzTmFtZSA9ICd0aWxlIHRpbGUtZmxvb3InO1xuICAgICAgICB0aWxlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIpJztcbiAgICB9XG5cbiAgICByZW1vdmVCb21iKGJvbWJJZCwgZmFsbGJhY2tDZWxsKSB7XG4gICAgICAgIGNvbnN0IGJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpO1xuXG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGJvbWJzKSB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIGNvbnN0IHNhbWVJZCA9IGJvbWJJZCAmJiBib21iICYmIGJvbWIuYm9tYklkID09PSBib21iSWQ7XG4gICAgICAgICAgICBjb25zdCBzYW1lQ2VsbCA9IGZhbGxiYWNrQ2VsbCAmJiBwb3MgJiYgcG9zLmdyaWRYID09PSBmYWxsYmFja0NlbGwueCAmJiBwb3MuZ3JpZFkgPT09IGZhbGxiYWNrQ2VsbC55O1xuXG4gICAgICAgICAgICBpZiAoIXNhbWVJZCAmJiAhc2FtZUNlbGwpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAoYm9tYi5lbCAmJiBib21iLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYm9tYi5lbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlRXhwbG9zaW9uKGdyaWRYLCBncmlkWSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgZXhwRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgY29uc3QgZXhwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGV4cERpdi5jbGFzc05hbWUgPSAnZXhwbG9zaW9uJztcbiAgICAgICAgZXhwRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZXhwRGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgZXhwRGl2LnN0eWxlLmhlaWdodCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBleHBEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBleHBEaXYuc3R5bGUuekluZGV4ID0gJzcnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChleHBEaXYpO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFksIHg6IGdyaWRYICogVElMRV9TSVpFLCB5OiBncmlkWSAqIFRJTEVfU0laRSB9KTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJywgeyBkdXJhdGlvbiwgZWw6IGV4cERpdiB9KTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmIChleHBEaXYucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGV4cERpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGV4cERpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLndvcmxkLmRlc3Ryb3lFbnRpdHkoZXhwRW50aXR5KTtcbiAgICAgICAgfSwgZHVyYXRpb24pO1xuICAgIH1cblxuICAgIGNyZWF0ZVBvd2VyVXAoZ3gsIGd5LCB0eXBlKSB7XG4gICAgICAgIGlmICghdHlwZSB8fCB0aGlzLmNsYWltZWRQb3dlclVwcy5oYXMoYCR7Z3h9LCR7Z3l9YCkpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwVXBFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogVElMRV9TSVpFLCB5OiBneSAqIFRJTEVfU0laRSB9KTtcblxuICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IGBwb3dlcnVwIHBvd2VydXAtJHt0eXBlLnRvTG93ZXJDYXNlKCl9YDtcbiAgICAgICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgZGl2LnN0eWxlLmhlaWdodCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBkaXYuc3R5bGUudG9wID0gYCR7Z3kgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBkaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnLCB7IHR5cGUsIGVsOiBkaXYgfSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTeXN0ZW1zKCkge1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcmVuZGVyU3lzdGVtKHcsIGR0LCBub3csIEFOSU1BVElPTl9ST1dTKSk7XG4gICAgfVxuXG4gICAgZ2FtZUxvb3Aobm93KSB7XG4gICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZHQgPSBub3cgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gbm93O1xuICAgICAgICB0aGlzLndvcmxkLnVwZGF0ZShkdCwgbm93KTtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHModGhpcy5sb2NhbFBsYXllckVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobmV4dE5vdykgPT4gdGhpcy5nYW1lTG9vcChuZXh0Tm93KSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUh1ZFN0YXRzKGVudGl0eSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgICAgIHNldExpdmVzKHBsYXllci5saXZlcyA/PyAzKTtcbiAgICAgICAgc2V0UmFuZ2UocGxheWVyLmJvbWJSYW5nZSB8fCA0KTtcbiAgICAgICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcmVuZGVyU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBhbmltUm93cykge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1JlbmRlcmFibGUnKTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG5cbiAgICAgICAgaWYgKCFyZW5kZXJhYmxlLmVsKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHJlbmRlcmFibGUuc3RhdGU7XG4gICAgICAgIGNvbnN0IHRhcmdldFJvdyA9IGFuaW1Sb3dzW3N0YXRlXVt2ZWwuZGlyZWN0aW9uXTtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlc2V0IGFuaW1hdGlvbiB3aGVuIHJvdyBvciBzdGF0ZSBjaGFuZ2VzXG4gICAgICAgIGlmIChyZW5kZXJhYmxlLnJvdyAhPT0gdGFyZ2V0Um93IHx8IHJlbmRlcmFibGUubGFzdFN0YXRlICE9PSBzdGF0ZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5yb3cgPSB0YXJnZXRSb3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RTdGF0ZSA9IHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZnJhbWVDb3VudCA9IHN0YXRlID09PSAnUlVOJyA/IHJlbmRlcmFibGUucnVuRnJhbWVzIDogcmVuZGVyYWJsZS5pZGxlRnJhbWVzO1xuICAgICAgICBjb25zdCBmcmFtZURlbGF5ID0gc3RhdGUgPT09ICdSVU4nID8gMTAwMCAvIHJlbmRlcmFibGUuZnBzIDogMTAwMCAvIHJlbmRlcmFibGUuaWRsZUZwcztcblxuICAgICAgICBpZiAobm93IC0gcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID4gZnJhbWVEZWxheSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKyAxKSAlIGZyYW1lQ291bnQ7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3NYID0gLShyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSAqIHJlbmRlcmFibGUuZnJhbWVXaWR0aCk7XG4gICAgICAgIGNvbnN0IHBvc1kgPSAtKHJlbmRlcmFibGUucm93ICogcmVuZGVyYWJsZS5mcmFtZUhlaWdodCk7XG4gICAgICAgIFxuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGAke3Bvc1h9cHggJHtwb3NZfXB4YDtcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtwb3MueH1weCwgJHtwb3MueX1weCwgMClgO1xuICAgIH1cbn1cbiIsIi8vIC9zcmMvZWNzL3dvcmxkLmpzXG5cbmV4cG9ydCBjbGFzcyBXb3JsZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubmV4dEVudGl0eUlkID0gMDtcbiAgICAgICAgdGhpcy5lbnRpdGllcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gbmV3IE1hcCgpOyBcbiAgICAgICAgdGhpcy5zeXN0ZW1zID0gW107XG4gICAgfVxuXG4gICAgY3JlYXRlRW50aXR5KCkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLm5leHRFbnRpdHlJZCsrO1xuICAgICAgICB0aGlzLmVudGl0aWVzLmFkZChlbnRpdHkpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cblxuICAgIGRlc3Ryb3lFbnRpdHkoZW50aXR5KSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIGZvciAoY29uc3QgW2NvbXBvbmVudE5hbWUsIGNvbXBvbmVudE1hcF0gb2YgdGhpcy5jb21wb25lbnRzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSwgY29tcG9uZW50RGF0YSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5jb21wb25lbnRzLmhhcyhjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnNldChjb21wb25lbnROYW1lLCBuZXcgTWFwKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSkuc2V0KGVudGl0eSwgY29tcG9uZW50RGF0YSk7XG4gICAgfVxuXG4gICAgZ2V0Q29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50TWFwID8gY29tcG9uZW50TWFwLmdldChlbnRpdHkpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJlbW92ZUNvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudE1hcCkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcXVlcnkoLi4uY29tcG9uZW50TmFtZXMpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudE5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZmlyc3RNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzWzBdKTtcbiAgICAgICAgaWYgKCFmaXJzdE1hcCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBmaXJzdE1hcC5rZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBoYXNBbGwgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb21wb25lbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmICghbWFwIHx8ICFtYXAuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzQWxsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNBbGwgJiYgdGhpcy5lbnRpdGllcy5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZFN5c3RlbShzeXN0ZW1GdW5jdGlvbikge1xuICAgICAgICB0aGlzLnN5c3RlbXMucHVzaChzeXN0ZW1GdW5jdGlvbik7XG4gICAgfVxuXG4gICAgdXBkYXRlKGR0LCBub3cpIHtcbiAgICAgICAgZm9yIChjb25zdCBzeXN0ZW0gb2YgdGhpcy5zeXN0ZW1zKSB7XG4gICAgICAgICAgICBzeXN0ZW0odGhpcywgZHQsIG5vdyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuZXhwb3J0IGNvbnN0IFRJTEVfU0laRSA9IDQ4O1xuY29uc3QgR1JJRF9CT1JERVJfU0laRSA9IDY7XG5cbmNvbnN0IGltYWdlcyA9IHtcbiAgICAyOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIixcbiAgICAzOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja193YWxsLnBuZ1wiLFxuICAgIDQ6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2V4cGxvaXQucG5nXCIsXG59O1xuXG5jb25zdCBbcGxheWVyTmFtZSwgc2V0UGxheWVyTmFtZV0gPSBjcmVhdGVTaWduYWwoXCJQbGF5ZXIgMVwiKTtcbmNvbnN0IFtsaXZlcywgc2V0TGl2ZXNdID0gY3JlYXRlU2lnbmFsKDMpO1xuY29uc3QgW3NwZWVkLCBzZXRTcGVlZF0gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbYm9tYnMsIHNldEJvbWJzXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtyYW5nZSwgc2V0UmFuZ2VdID0gY3JlYXRlU2lnbmFsKDEpO1xuZXhwb3J0IHsgc2V0UGxheWVyTmFtZSwgc2V0TGl2ZXMsIHNldFNwZWVkLCBzZXRCb21icywgc2V0UmFuZ2UgfTtcblxuY29uc3QgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IG5hbWVFbC50ZXh0Q29udGVudCA9IHBsYXllck5hbWUoKTsgfSk7XG5cbmNvbnN0IGxpdmVzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGxpdmVzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHNwZWVkRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHNwZWVkLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IGJvbWJzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGJvbWJzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHJhbmdlRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHJhbmdlLXZhbHVlXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbGl2ZXNFbC50ZXh0Q29udGVudCA9IGxpdmVzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgc3BlZWRFbC50ZXh0Q29udGVudCA9IHNwZWVkKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgYm9tYnNFbC50ZXh0Q29udGVudCA9IGJvbWJzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgcmFuZ2VFbC50ZXh0Q29udGVudCA9IHJhbmdlKCk7IH0pO1xuXG5mdW5jdGlvbiBHYW1lKHsgZ3JpZCB9KSB7XG4gICAgY29uc3QgYm9hcmRXaWR0aCA9IGdyaWRbMF0ubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gZ3JpZC5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRPdXRlcldpZHRoID0gYm9hcmRXaWR0aCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJIZWlnaHQgPSBib2FyZEhlaWdodCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IHJvd3MgPSBbXTtcbiAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgZ3JpZC5sZW5ndGg7IHJvd0luZGV4KyspIHtcbiAgICAgICAgY29uc3QgY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IGdyaWRbcm93SW5kZXhdLmxlbmd0aDsgY29sSW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGdyaWRbcm93SW5kZXhdW2NvbEluZGV4XTtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBcInRpbGVcIjtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGB3aWR0aDoke1RJTEVfU0laRX1weDtoZWlnaHQ6JHtUSUxFX1NJWkV9cHg7YDtcblxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDIgfHwgY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLWZsb29yXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLXdhbGxcIjtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbM119KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1s0XX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAwIHx8IGNlbGwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbMl19KWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNlbGxzLnB1c2goPGRpdiBjbGFzcz17Y2xhc3NOYW1lfSBkYXRhLXg9e2NvbEluZGV4fSBkYXRhLXk9e3Jvd0luZGV4fSBzdHlsZT17c3R5bGV9PjwvZGl2Pik7XG4gICAgICAgIH1cbiAgICAgICAgcm93cy5wdXNoKDxkaXYgY2xhc3M9XCJncmlkLXJvd1wiPntjZWxsc308L2Rpdj4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtZ2xhc3NcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtYmFyXCI+XG4gICAgICAgICAgICAgICAgICAgIHtuYW1lRWx9XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1zdGF0c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5MaXZlczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bGl2ZXNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5TcGVlZDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c3BlZWRFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5Cb21iczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Ym9tYnNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5SYW5nZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmFuZ2VFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1ib2FyZC1mcmFtZVwiIHN0eWxlPXtgd2lkdGg6JHtib2FyZE91dGVyV2lkdGh9cHg7aGVpZ2h0OiR7Ym9hcmRPdXRlckhlaWdodH1weDtgfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJnYW1lLWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImdhbWUtZ3JpZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17YHBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiR7Ym9hcmRXaWR0aH1weDtoZWlnaHQ6JHtib2FyZEhlaWdodH1weDtgfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cm93c31cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgQ2hhdFBsYXllcnMgZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5sZXQgW3N0YXRlcywgc2V0U3RhdGVzXSA9IGNyZWF0ZVNpZ25hbCh7fSk7XG5leHBvcnQgeyBzZXRTdGF0ZXMgfTtcblxubGV0IHJvb21JZEVsID0gPHA+Um9vbSBJRDogPC9wPjtcbmxldCBwbGF5ZXJzRWwgPSA8cD5QbGF5ZXJzOiAgLyA0PC9wPjtcbmxldCB0ZXh0RWwgPSA8cD48L3A+O1xubGV0IHRpbWVyRWwgPSA8cD5UaW1lcjogPC9wPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzID0gc3RhdGVzKCk7XG4gICAgcm9vbUlkRWwudGV4dENvbnRlbnQgPSBgUm9vbSBJRDogJHtzLnJvb21JZH1gO1xuICAgIHBsYXllcnNFbC50ZXh0Q29udGVudCA9IGBQbGF5ZXJzOiAke3MucGxheWVyc0NvdW50fSAvIDRgO1xuICAgIHRleHRFbC50ZXh0Q29udGVudCA9IHMudGV4dCB8fCBcIlwiO1xuXG4gICAgaWYgKHMuZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IFwiVGltZXI6IEdhbWUgc3RhcnRlZFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRpbWVyVGV4dCA9ICghcy5zZWNvbmRzTGVmdCkgPyBcIldhaXRpbmcgZm9yIG9uZSBtb3JlIHBsYXllclwiIDogYCR7cy5zZWNvbmRzTGVmdH0gc2Vjb25kc2A7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBgVGltZXI6ICR7dGltZXJUZXh0fWA7XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIExvYmJ5KCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb25hdGluZXItbG9iYnlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2JieS1ib3hcIj5cbiAgICAgICAgICAgICAgICA8aDE+TG9iYnk8L2gxPlxuICAgICAgICAgICAgICAgIHtyb29tSWRFbH1cbiAgICAgICAgICAgICAgICB7cGxheWVyc0VsfVxuICAgICAgICAgICAgICAgIHt0ZXh0RWx9XG4gICAgICAgICAgICAgICAge3RpbWVyRWx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxDaGF0UGxheWVycyAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYmJ5OyIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmNvbnN0IHJlcGxheUJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+UGxheSBBZ2FpbjwvYnV0dG9uPjtcblxucmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbG9jYXRpb24ucmVsb2FkKCk7XG59KTtcblxubGV0IG1lbnVFbCA9IChcbiAgICA8ZGl2IGNsYXNzPVwibWVudS1ib3hcIj5cbiAgICAgICAgPGgxPllvdSBXaW4hPC9oMT5cbiAgICAgICAgPHA+QWxsIG90aGVyIHBsYXllcnMgaGF2ZSBsZWZ0IHRoZSBnYW1lLjwvcD5cbiAgICAgICAge3JlcGxheUJ0bn1cbiAgICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lbnUoKSB7XG4gICAgcmV0dXJuIG1lbnVFbDtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBzZXRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5cbmNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gY3JlYXRlU2lnbmFsKFwiXCIpO1xuZXhwb3J0IHsgc2V0RXJyb3IgfTtcblxuZnVuY3Rpb24gUmVnaXN0ZXIoeyB3c3MgfSkge1xuICAgIGxldCBzdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICBjb25zdCBlcnJvckVsID0gPHAgY2xhc3M9XCJyZWdpc3Rlci1lcnJvclwiPjwvcD47XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBlcnJvckVsLnRleHRDb250ZW50ID0gZXJyb3IoKTtcbiAgICB9KTtcblxuICAgIGxldCBwbGF5ZXJFbnRlciA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUgfHwgbmlja25hbWUubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIHNldEVycm9yKFwiSW52YWxpZCBuaWNrbmFtZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldEVycm9yKFwiXCIpO1xuICAgICAgICBzdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzZXRQbGF5ZXJOYW1lKG5pY2tuYW1lKTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcIm5pY2tuYW1lX29mX3RoZV9wbGF5ZXJcIixcbiAgICAgICAgICAgIG5pY2tuYW1lOiBuaWNrbmFtZVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgb25TdWJtaXQ9e3BsYXllckVudGVyfT5cbiAgICAgICAgICAgIHtlcnJvckVsfVxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmlja25hbWUtaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW50ZXIgeW91ciBuYW1lXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmVnaXN0ZXItYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPnN0YXJ0IHBsYXlpbmc8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XG4iLCJjbGFzcyBTb3VuZCB7XG4gICAgY29uc3RydWN0b3Ioc3JjKSB7XG4gICAgICAgIHRoaXMubXVzaWMgPSBuZXcgQXVkaW8oc3JjKTtcbiAgICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcblxuICAgICAgICB0aGlzLm11c2ljLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNDtcblxuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc05hbWUgPSBcInNvdW5kLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5hcHBlbmQodGhpcy5pY29uKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGUoKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5idXR0b24pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5tdXNpYy5wbGF5KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5tdXNpYy5wYXVzZWQgfHwgdGhpcy5tdXNpYy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9uXCIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUJ1dHRvbigpIHtcbiAgICAgICAgY29uc3QgaXNNdXRlZCA9IHRoaXMubXVzaWMubXV0ZWQgfHwgdGhpcy5tdXNpYy5wYXVzZWQ7XG5cbiAgICAgICAgdGhpcy5pY29uLmNsYXNzTmFtZSA9IGlzTXV0ZWQgPyBcImZhLXNvbGlkIGZhLXZvbHVtZS1vZmZcIiA6IFwiZmEtc29saWQgZmEtdm9sdW1lLWhpZ2hcIjtcbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImlzLW11dGVkXCIsIGlzTXV0ZWQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291bmQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwL2FwcC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwidHlwZSIsInByb3BzIiwiY2hpbGRyZW4iLCJlbGUiLCJkb2N1bWVudCIsImtleSIsInN0YXJ0c1dpdGgiLCJldmVudE5hbWUiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldEF0dHJpYnV0ZSIsImZsYXRDaGlsZHJlbiIsImZsYXQiLCJJbmZpbml0eSIsImFwcGVuZCIsImZpbHRlciIsImNoaWxkIiwidW5kZWZpbmVkIiwicmVuZGVyIiwiZWxlbWVudCIsImNvbnRhaW5lciIsInJlcGxhY2VDaGlsZHJlbiIsIlJvdXRlciIsInJvdXRlciIsImVmZmVjdFN0YWNrIiwiYWN0aXZlRWZmZWN0IiwiY3JlYXRlU2lnbmFsIiwiaW5pdGlhbFZhbHVlIiwidmFsdWUiLCJlZmZlY3RzIiwiU2V0IiwiUmVhZCIsImFkZCIsIldyaXRlIiwibmV3VmFsdWUiLCJmbiIsImZvckVhY2giLCJlZmZlY3QiLCJjcmVhdGVFZmZlY3QiLCJwdXNoIiwicG9wIiwibGVuZ3RoIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInVybCIsIlVSTCIsImhyZWYiLCJsaXN0ZW4iLCJvbkVycm9yNDA0IiwiZXZlbnQiLCJkZXN0aW5hdGlvbiIsImludGVyY2VwdCIsImNvbnNvbGUiLCJsb2ciLCJSZWdpc3RlciIsInNldEVycm9yIiwiR2FtZSIsIk1lbnUiLCJMb2JieSIsInNldFN0YXRlcyIsInNldFBsYXllck5hbWUiLCJzZXRIdWRQbGF5ZXJOYW1lIiwiU291bmQiLCJzZXRNZXNzYWdlcyIsIkdhbWVFbmdpbmUiLCJyb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3c3MiLCJXZWJTb2NrZXQiLCJzb3VuZCIsImN1cnJlbnRHYW1lRW5naW5lIiwiaW5pdCIsImJvZHkiLCJjbGFzc05hbWUiLCJhbGVydCIsIndzIiwibWVzc2FnZSIsIkpTT04iLCJwYXJzZSIsImRhdGEiLCJxdWVyeVNlbGVjdG9yIiwicm9vbUlkIiwicGxheWVyc0NvdW50Iiwic2Vjb25kc0xlZnQiLCJ0ZXh0IiwiZ3JpZCIsInNldFRpbWVvdXQiLCJnYW1lQ29udGFpbmVyIiwiZGVzdHJveSIsImxvY2FsUGxheWVyIiwicGxheWVycyIsImZpbmQiLCJwbGF5ZXIiLCJpZCIsInlvdXJQbGF5ZXJJZCIsIm5pY2tuYW1lIiwiZW5naW5lIiwiZXJyb3IiLCJwcmV2IiwiaGFuZGxlUmVtb3RlTW92ZSIsInBheWxvYWQiLCJoYW5kbGVSZW1vdGVCb21iIiwiaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZCIsImhhbmRsZUV4cGxvc2lvbkNoZWNrZWQiLCJoYW5kbGVQbGF5ZXJEYW1hZ2VkIiwiaGFuZGxlR2FtZU92ZXIiLCJlcnIiLCJtZXNzYWdlcyIsIkNoYXRQbGF5ZXJzIiwibWVzc2FnZXNDb250YWluZXIiLCJjbGFzcyIsIm1zZ3MiLCJpbm5lckhUTUwiLCJtc2ciLCJwIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJ1bnNoaWZ0IiwiYnJvYWRjYXN0TWVzc2FnZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJ0YXJnZXQiLCJnZXQiLCJ0cmltIiwicmVzZXQiLCJzZW5kIiwic3RyaW5naWZ5Iiwib25TdWJtaXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJtYXhsZW5ndGgiLCJQb3NpdGlvbkNvbXBvbmVudCIsImd4IiwiZ3kiLCJ0aWxlU2l6ZSIsImdyaWRYIiwiZ3JpZFkiLCJ4IiwieSIsInRhcmdldFgiLCJ0YXJnZXRZIiwiVmVsb2NpdHlDb21wb25lbnQiLCJiYXNlU3BlZWQiLCJzcGVlZCIsInNwZWVkQm9vc3QiLCJzcGVlZEJvb3N0VGltZVJlbWFpbmluZyIsImlzTW92aW5nIiwiZGlyZWN0aW9uIiwiSW5wdXRDb21wb25lbnQiLCJpbnB1dFF1ZXVlIiwiUmVuZGVyYWJsZUNvbXBvbmVudCIsImVsIiwiZnJhbWVXaWR0aCIsImZyYW1lSGVpZ2h0IiwidG90YWxGcmFtZXMiLCJmcHMiLCJjdXJyZW50RnJhbWUiLCJydW5GcmFtZXMiLCJpZGxlRnJhbWVzIiwiaWRsZUZwcyIsImxhc3RGcmFtZVRpbWUiLCJyb3ciLCJzdGF0ZSIsImxhc3RTdGF0ZSIsIlBsYXllckNvbXBvbmVudCIsImNoYXJUeXBlIiwiaXNMb2NhbCIsIkJvbWJDb21wb25lbnQiLCJvd25lcklkIiwidGltZXIiLCJyYW5nZSIsImV4cGxvZGVkIiwiRXhwbG9zaW9uQ29tcG9uZW50IiwiZHVyYXRpb24iLCJQb3dlclVwQ29tcG9uZW50IiwicGlja2VkVXAiLCJCZWhhdmlvckNvbXBvbmVudCIsImdob3N0TW9kZSIsInRocm93YWJsZSIsImRldG9uYXRvciIsImZhc3RTaG9lc0xldmVsIiwiYm9tYnMiLCJtYXgiLCJjdXJyZW50IiwiV29ybGQiLCJyZW5kZXJTeXN0ZW0iLCJzZXRCb21icyIsInNldExpdmVzIiwic2V0UmFuZ2UiLCJzZXRTcGVlZCIsIlRJTEVfU0laRSIsIlNQUklURV9DT0xVTU5TIiwiU1BSSVRFX1JPV1MiLCJBTklNQVRJT05fUk9XUyIsIlJVTiIsInVwIiwibGVmdCIsImRvd24iLCJyaWdodCIsIklETEUiLCJjb25zdHJ1Y3RvciIsImNhbnZhc0NvbnRhaW5lciIsIm1hcERhdGEiLCJzb2NrZXQiLCJ3b3JsZCIsImxvY2FsUGxheWVyRW50aXR5IiwicGxheWVyRW50aXRpZXMiLCJNYXAiLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibGFzdElucHV0U2VudCIsImxvY2FsUGxheWVySWQiLCJhbGxQbGF5ZXJzIiwibm9ybWFsaXplZExvY2FsUGxheWVySWQiLCJTdHJpbmciLCJwRGF0YSIsInBsYXllcklkIiwicGxheWVyRW50aXR5IiwiY3JlYXRlRW50aXR5IiwicGxheWVyRGl2IiwiY29sb3IiLCJzdHlsZSIsInBvc2l0aW9uIiwiekluZGV4Iiwid2lsbENoYW5nZSIsIndpZHRoIiwiaGVpZ2h0IiwiYmFja2dyb3VuZFNpemUiLCJzeCIsInN5IiwiYWRkQ29tcG9uZW50IiwicGxheWVyQ29tcCIsImxpdmVzIiwibWF4Qm9tYnMiLCJib21iUmFuZ2UiLCJhbGl2ZSIsInNldCIsInVwZGF0ZUh1ZFN0YXRzIiwic2V0dXBJbnB1dCIsIndhcm4iLCJtYXAiLCJyZWdpc3RlclN5c3RlbXMiLCJwZXJmb3JtYW5jZSIsIm5vdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImdhbWVMb29wIiwiaW5wdXQiLCJnZXRDb21wb25lbnQiLCJnZXRLZXlEaXJlY3Rpb24iLCJoYW5kbGVLZXlEb3duIiwiZGlyIiwiaW5jbHVkZXMiLCJzZW5kSW5wdXQiLCJjb2RlIiwiZHJvcEJvbWIiLCJoYW5kbGVLZXlVcCIsImQiLCJ3aW5kb3ciLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJCb29sZWFuIiwiaW5wdXRTdGF0ZSIsImN1cnJlbnRCb21icyIsInF1ZXJ5IiwiYkVudGl0eSIsImNyZWF0ZUJvbWIiLCJib21iSWQiLCJleGlzdHMiLCJzb21lIiwiZW50aXR5IiwicG9zIiwiYm9tYiIsImJvbWJFbnRpdHkiLCJib21iRGl2IiwidG9wIiwiYm9tYkNvbXAiLCJBcnJheSIsImZyb20iLCJrZXlzIiwidmVsIiwicmVuZGVyYWJsZSIsInJlbW92ZVBvd2VyVXBBdCIsInN0YXRzIiwiYXBwbHlTZXJ2ZXJTdGF0cyIsInBvd2VyVXBzIiwicG93ZXJVcCIsInBhcmVudE5vZGUiLCJkZXN0cm95RW50aXR5IiwidmVsb2NpdHkiLCJyZW1vdmVDb21wb25lbnQiLCJ3aW5uZXJOYW1lIiwicmVtb3ZlQm9tYiIsImNlbGxzIiwiZGVzdHJveWVkQmxvY2tzIiwiY2VsbCIsInVwZGF0ZU1hcENlbGwiLCJzcGF3bmVkUG93ZXJVcHMiLCJjcmVhdGVQb3dlclVwIiwiY3JlYXRlRXhwbG9zaW9uIiwidGlsZSIsImJhY2tncm91bmRJbWFnZSIsImZhbGxiYWNrQ2VsbCIsInNhbWVJZCIsInNhbWVDZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2IiwiaGFzIiwicFVwRW50aXR5IiwiZGl2IiwiYWRkU3lzdGVtIiwidyIsImR0IiwidXBkYXRlIiwibmV4dE5vdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiTWF0aCIsInJvdW5kIiwiY3VycmVudExvY2FsUGxheWVyTmFtZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJnZXRQbGF5ZXJOYW1lIiwiZ2V0SXRlbSIsImFuaW1Sb3dzIiwiZW50aXRpZXMiLCJ0YXJnZXRSb3ciLCJmcmFtZUNvdW50IiwiZnJhbWVEZWxheSIsInBvc1giLCJwb3NZIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwidHJhbnNmb3JtIiwibmV4dEVudGl0eUlkIiwiY29tcG9uZW50cyIsInN5c3RlbXMiLCJkZWxldGUiLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50TWFwIiwiZW50cmllcyIsImNvbXBvbmVudERhdGEiLCJjb21wb25lbnROYW1lcyIsImZpcnN0TWFwIiwicmVzdWx0cyIsImhhc0FsbCIsImkiLCJzeXN0ZW1GdW5jdGlvbiIsInN5c3RlbSIsIkdSSURfQk9SREVSX1NJWkUiLCJpbWFnZXMiLCJwbGF5ZXJOYW1lIiwibmFtZUVsIiwibGl2ZXNFbCIsInNwZWVkRWwiLCJib21ic0VsIiwicmFuZ2VFbCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImJvYXJkT3V0ZXJXaWR0aCIsImJvYXJkT3V0ZXJIZWlnaHQiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJnYW1lU3RhcnRlZCIsInRpbWVyVGV4dCIsInJlcGxheUJ0biIsInJlbG9hZCIsIm1lbnVFbCIsInN1Ym1pdHRlZCIsImVycm9yRWwiLCJwbGF5ZXJFbnRlciIsImN1cnJlbnRUYXJnZXQiLCJzcmMiLCJtdXNpYyIsIkF1ZGlvIiwiYnV0dG9uIiwiaWNvbiIsImxvb3AiLCJ2b2x1bWUiLCJ0b2dnbGUiLCJ1cGRhdGVCdXR0b24iLCJwbGF5IiwidGhlbiIsImNhdGNoIiwicGF1c2VkIiwibXV0ZWQiLCJpc011dGVkIiwiY2xhc3NMaXN0Il0sInNvdXJjZVJvb3QiOiIifQ==