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
/* harmony import */ var _systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./systems/damageSystem.js */ "./src/ecs/systems/damageSystem.js");
/* harmony import */ var _systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./systems/powerUpSystem.js */ "./src/ecs/systems/powerUpSystem.js");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pages/game */ "./src/pages/game.jsx");








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
      playerDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE}px`;
      playerDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE}px`;
      playerDiv.style.backgroundSize = `${SPRITE_COLUMNS * _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE}px ${SPRITE_ROWS * _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE}px`;
      this.container.appendChild(playerDiv);
      const sx = pData.x || 1;
      const sy = pData.y || 1;
      this.world.addComponent(playerEntity, 'Position', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.PositionComponent)(sx, sy, _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE));
      this.world.addComponent(playerEntity, 'Velocity', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.VelocityComponent)(2.5));
      this.world.addComponent(playerEntity, 'Renderable', (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.RenderableComponent)(playerDiv, _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE, _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE, 4, 12));
      const isLocal = playerId === normalizedLocalPlayerId;
      const playerComp = (0,_components_js__WEBPACK_IMPORTED_MODULE_1__.PlayerComponent)(playerId, color, isLocal);
      playerComp.lives = 3;
      playerComp.maxBombs = 1;
      playerComp.bombRange = 2;
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
    bombDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE}px`;
    bombDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE}px`;
    bombDiv.style.left = `${gridX * _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE}px`;
    bombDiv.style.top = `${gridY * _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE}px`;
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
      (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_6__.applySpeedPowerUp)(velocity);
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
      (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_6__.spawnPowerUp)(this.world, x, y, this.container, _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE);
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
    this.world.addSystem((w, dt, now) => (0,_systems_movementSystem_js__WEBPACK_IMPORTED_MODULE_2__.movementSystem)(w, dt, now, this.mapData, _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE));
    this.world.addSystem((w, dt, now) => (0,_systems_bombSystem_js__WEBPACK_IMPORTED_MODULE_4__.bombSystem)(w, dt, now, this.mapData, updateMapCell, destroyBoxCallback, _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE));
    this.world.addSystem((w, dt, now) => (0,_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_5__.damageSystem)(w, now, onPlayerHurt, _pages_game__WEBPACK_IMPORTED_MODULE_7__.TILE_SIZE));
    this.world.addSystem((w, dt, now) => (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_6__.powerUpSystem)(w, onPowerUpPicked));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvZG9tLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NoYXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9lY3MvY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3dvcmxkLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyLCB7IHNldEVycm9yIH0gZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFN0YXRlcyB9IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSBhcyBzZXRIdWRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBTb3VuZCBmcm9tIFwiLi4vdXRpbHMvc291bmRcIjtcbmltcG9ydCB7IHNldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5pbXBvcnQgeyBHYW1lRW5naW5lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7IFxuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0OjUwMDBcIik7XG5jb25zdCBzb3VuZCA9IG5ldyBTb3VuZChcIi4vYXNzZXRzL3NvdW5kcy9iYWNrZ3JvdW5kX211c2ljLm1wM1wiKTtcbmxldCBjdXJyZW50R2FtZUVuZ2luZSA9IG51bGw7XG5cbnNvdW5kLmluaXQoKTtcblxucm91dGVyLm9uKFwiL1wiLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcInJlZ2lzdGVyLXBhZ2VcIjtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKHdzKSA9PiB7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJyb29tX3VwZGF0ZVwiOlxuICAgICAgICBjYXNlIFwibG9iYnlfdGltZXJcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJsb2JieS1wYWdlXCI7XG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb25hdGluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXRlcyh7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IG1lc3NhZ2UucGxheWVyc0NvdW50LFxuICAgICAgICAgICAgICAgIHNlY29uZHNMZWZ0OiBtZXNzYWdlLnNlY29uZHNMZWZ0LFxuICAgICAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UudGV4dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfc3RhcnRlZFwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZW5kZXIoPEdhbWUgZ3JpZD17bWVzc2FnZS5ncmlkfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSAobWVzc2FnZS5wbGF5ZXJzIHx8IFtdKS5maW5kKHBsYXllciA9PiBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UueW91clBsYXllcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIGxvY2FsUGxheWVyLm5pY2tuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIdWRQbGF5ZXJOYW1lKGxvY2FsUGxheWVyLm5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBHYW1lRW5naW5lKGdhbWVDb250YWluZXIsIG1lc3NhZ2UuZ3JpZCwgd3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lLmluaXQobWVzc2FnZS55b3VyUGxheWVySWQsIG1lc3NhZ2UucGxheWVycyB8fCBbXSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2FtZSBjb250YWluZXIgd2FzIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwicm9vbV9hbG9uZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgIGNhc2UgXCJjaGF0X21lc3NhZ2VcIjpcbiAgICAgICAgICAgIHNldE1lc3NhZ2VzKHByZXYgPT4gWy4uLnByZXYsIHtcbiAgICAgICAgICAgICAgICBuaWNrbmFtZTogbWVzc2FnZS5uaWNrbmFtZSB8fCBcIlBsYXllclwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UubWVzc2FnZSxcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID09PSBcInJlZ2lzdGVyLXBhZ2VcIikge1xuICAgICAgICAgICAgICAgIHNldEVycm9yKG1lc3NhZ2UubWVzc2FnZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvclwiLCBlcnIpO1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdzcztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgd3NzIGZyb20gXCIuLi9hcHAvYXBwXCI7XG5cbmNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gY3JlYXRlU2lnbmFsKFtdKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzIH07XG5cbmZ1bmN0aW9uIENoYXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IG1lc3NhZ2VzQ29udGFpbmVyID0gPGRpdiBjbGFzcz1cIm1lc3NhZ2VzXCI+PC9kaXY+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNncyA9IG1lc3NhZ2VzKCk7XG4gICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgbXNnIG9mIG1zZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbXNnID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IG1zZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IGAke21zZy5uaWNrbmFtZX06ICR7bXNnLm1lc3NhZ2V9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHApO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIucmVtb3ZlQ2hpbGQobWVzc2FnZXNDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgICAgIG1zZ3MudW5zaGlmdCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYnJvYWRjYXN0TWVzc2FnZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS50YXJnZXQpO1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGZvcm1EYXRhLmdldChcIm1lc3NhZ2VcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbWVzc2FnZSB8fCBtZXNzYWdlLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwiY2hhdF9tZXNzYWdlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICB9KSk7XG4gICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNoYXRcIiBvblN1Ym1pdD17YnJvYWRjYXN0TWVzc2FnZX0+XG4gICAgICAgICAgICB7bWVzc2FnZXNDb250YWluZXJ9XG4gICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibWVzc2FnZVwiIHBsYWNlaG9sZGVyPVwidHlwZSB0byB0aGUgb3RoZXIgcGxheWVycyAuLi5cIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5zZW5kPC9idXR0b24+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhdFBsYXllcnM7XG4iLCIvLyAvc3JjL2Vjcy9jb21wb25lbnRzLmpzXG5cbmV4cG9ydCBjb25zdCBQb3NpdGlvbkNvbXBvbmVudCA9IChneCwgZ3ksIHRpbGVTaXplID0gNjQpID0+ICh7XG4gICAgZ3JpZFg6IGd4LFxuICAgIGdyaWRZOiBneSxcbiAgICB4OiBneCAqIHRpbGVTaXplLFxuICAgIHk6IGd5ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRZOiBneSAqIHRpbGVTaXplXG59KTtcblxuZXhwb3J0IGNvbnN0IFZlbG9jaXR5Q29tcG9uZW50ID0gKGJhc2VTcGVlZCA9IDIuNSkgPT4gKHtcbiAgICBiYXNlU3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBzcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkQm9vc3Q6IDAsXG4gICAgc3BlZWRCb29zdFRpbWVSZW1haW5pbmc6IDAsXG4gICAgaXNNb3Zpbmc6IGZhbHNlLFxuICAgIGRpcmVjdGlvbjogJ2Rvd24nXG59KTtcblxuZXhwb3J0IGNvbnN0IElucHV0Q29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBpbnB1dFF1ZXVlOiBbXVxufSk7XG5cbmV4cG9ydCBjb25zdCBSZW5kZXJhYmxlQ29tcG9uZW50ID0gKGVsLCBmcmFtZVdpZHRoID0gNjQsIGZyYW1lSGVpZ2h0ID0gNjQsIHRvdGFsRnJhbWVzID0gNCwgZnBzID0gMTIpID0+ICh7XG4gICAgZWw6IGVsLFxuICAgIGZyYW1lV2lkdGg6IGZyYW1lV2lkdGgsXG4gICAgZnJhbWVIZWlnaHQ6IGZyYW1lSGVpZ2h0LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogdG90YWxGcmFtZXMsXG4gICAgcnVuRnJhbWVzOiA0LFxuICAgIGlkbGVGcmFtZXM6IDIsXG4gICAgZnBzOiBmcHMsXG4gICAgaWRsZUZwczogNCxcbiAgICBsYXN0RnJhbWVUaW1lOiAwLFxuICAgIHJvdzogMCxcbiAgICBzdGF0ZTogJ0lETEUnLFxuICAgIGxhc3RTdGF0ZTogJ0lETEUnXG59KTtcblxuZXhwb3J0IGNvbnN0IFBsYXllckNvbXBvbmVudCA9IChpZCwgY2hhclR5cGUsIGlzTG9jYWwgPSBmYWxzZSkgPT4gKHtcbiAgICBpZDogaWQsXG4gICAgY2hhclR5cGU6IGNoYXJUeXBlLFxuICAgIGlzTG9jYWw6IGlzTG9jYWxcbn0pO1xuXG5leHBvcnQgY29uc3QgQm9tYkNvbXBvbmVudCA9IChvd25lcklkLCB0aW1lciA9IDIwMDAsIHJhbmdlID0gMikgPT4gKHtcbiAgICBvd25lcklkOiBvd25lcklkLFxuICAgIHRpbWVyOiB0aW1lcixcbiAgICByYW5nZTogcmFuZ2UsXG4gICAgZXhwbG9kZWQ6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEV4cGxvc2lvbkNvbXBvbmVudCA9IChkdXJhdGlvbiA9IDUwMCkgPT4gKHtcbiAgICBkdXJhdGlvbjogZHVyYXRpb25cbn0pO1xuXG5leHBvcnQgY29uc3QgUG93ZXJVcENvbXBvbmVudCA9ICh0eXBlKSA9PiAoe1xuICAgIHR5cGU6IHR5cGUsIFxuICAgIHBpY2tlZFVwOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBCZWhhdmlvckNvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgZ2hvc3RNb2RlOiBmYWxzZSxcbiAgICB0aHJvd2FibGU6IGZhbHNlLFxuICAgIGRldG9uYXRvcjogZmFsc2UsXG4gICAgZmFzdFNob2VzTGV2ZWw6IDEsXG4gICAgYm9tYnM6IHtcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICByYW5nZTogMlxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkLmpzJztcbmltcG9ydCB7XG4gICAgUG9zaXRpb25Db21wb25lbnQsXG4gICAgVmVsb2NpdHlDb21wb25lbnQsXG4gICAgSW5wdXRDb21wb25lbnQsXG4gICAgUmVuZGVyYWJsZUNvbXBvbmVudCxcbiAgICBQbGF5ZXJDb21wb25lbnQsXG4gICAgQm9tYkNvbXBvbmVudFxufSBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuXG5pbXBvcnQgeyBtb3ZlbWVudFN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9tb3ZlbWVudFN5c3RlbS5qcyc7XG5pbXBvcnQgeyByZW5kZXJTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvcmVuZGVyU3lzdGVtLmpzJztcbmltcG9ydCB7IGJvbWJTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyc7XG5pbXBvcnQgeyBkYW1hZ2VTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzJztcbmltcG9ydCB7IGFwcGx5U3BlZWRQb3dlclVwLCBwb3dlclVwU3lzdGVtLCBzcGF3blBvd2VyVXAgfSBmcm9tICcuL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyc7XG5pbXBvcnQgeyBzZXRCb21icywgc2V0TGl2ZXMsIHNldFJhbmdlLCBzZXRTcGVlZCwgVElMRV9TSVpFIH0gZnJvbSAnLi4vcGFnZXMvZ2FtZSc7XG5cbmNvbnN0IFNQUklURV9DT0xVTU5TID0gMTM7XG5jb25zdCBTUFJJVEVfUk9XUyA9IDU0O1xuY29uc3QgQU5JTUFUSU9OX1JPV1MgPSB7XG4gICAgUlVOOiB7IHVwOiAzOCwgbGVmdDogMzksIGRvd246IDQwLCByaWdodDogNDEgfSxcbiAgICBJRExFOiB7IHVwOiAyMiwgbGVmdDogMjMsIGRvd246IDI0LCByaWdodDogMjUgfVxufTtcblxuZXhwb3J0IGNsYXNzIEdhbWVFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0NvbnRhaW5lciwgbWFwRGF0YSwgc29ja2V0KSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY2FudmFzQ29udGFpbmVyO1xuICAgICAgICB0aGlzLm1hcERhdGEgPSBtYXBEYXRhO1xuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xuICAgICAgICB0aGlzLmxvY2FsUGxheWVyRW50aXR5ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IDA7XG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzID0gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIGluaXQobG9jYWxQbGF5ZXJJZCwgYWxsUGxheWVycykge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCA9IFN0cmluZyhsb2NhbFBsYXllcklkKTtcblxuICAgICAgICBhbGxQbGF5ZXJzLmZvckVhY2gocERhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVySWQgPSBTdHJpbmcocERhdGEuaWQpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBwRGF0YS5jb2xvciB8fCBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgIHBsYXllckRpdi5jbGFzc05hbWUgPSBgcGxheWVyIHBsYXllci0ke2NvbG9yfWA7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnpJbmRleCA9ICcxMCc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUud2lsbENoYW5nZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLmJhY2tncm91bmRTaXplID0gYCR7U1BSSVRFX0NPTFVNTlMgKiBUSUxFX1NJWkV9cHggJHtTUFJJVEVfUk9XUyAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJEaXYpO1xuXG4gICAgICAgICAgICBjb25zdCBzeCA9IHBEYXRhLnggfHwgMTtcbiAgICAgICAgICAgIGNvbnN0IHN5ID0gcERhdGEueSB8fCAxO1xuXG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicsIFBvc2l0aW9uQ29tcG9uZW50KHN4LCBzeSwgVElMRV9TSVpFKSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScsIFZlbG9jaXR5Q29tcG9uZW50KDIuNSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScsIFJlbmRlcmFibGVDb21wb25lbnQocGxheWVyRGl2LCBUSUxFX1NJWkUsIFRJTEVfU0laRSwgNCwgMTIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpc0xvY2FsID0gcGxheWVySWQgPT09IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IFBsYXllckNvbXBvbmVudChwbGF5ZXJJZCwgY29sb3IsIGlzTG9jYWwpO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5saXZlcyA9IDM7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLm1heEJvbWJzID0gMTtcbiAgICAgICAgICAgIHBsYXllckNvbXAuYm9tYlJhbmdlID0gMjtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicsIHBsYXllckNvbXApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcy5zZXQocGxheWVySWQsIHBsYXllckVudGl0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc0xvY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcsIElucHV0Q29tcG9uZW50KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMocGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltHYW1lRW5naW5lXSBMb2NhbCBwbGF5ZXIgd2FzIG5vdCBmb3VuZFwiLCB7XG4gICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXJJZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzOiBhbGxQbGF5ZXJzLm1hcChwbGF5ZXIgPT4gcGxheWVyLmlkKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlclN5c3RlbXMoKTtcblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5vdykgPT4gdGhpcy5nYW1lTG9vcChub3cpKTtcbiAgICB9XG5cbiAgICBzZXR1cElucHV0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZ2V0S2V5RGlyZWN0aW9uID0gKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93VXAnIHx8IGtleSA9PT0gJ3cnIHx8IGtleSA9PT0gJ1onIHx8IGtleSA9PT0gJ3onKSByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93TGVmdCcgfHwga2V5ID09PSAnYScgfHwga2V5ID09PSAnUScgfHwga2V5ID09PSAncScpIHJldHVybiAnbGVmdCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dSaWdodCcgfHwga2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpIHJldHVybiAncmlnaHQnO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlLnVuc2hpZnQoZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkcm9wQm9tYigpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRCb21icyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5maWx0ZXIoYkVudGl0eSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoYkVudGl0eSwgJ0JvbWInKS5vd25lcklkID09PSBwbGF5ZXIuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjdXJyZW50Qm9tYnMubGVuZ3RoID49IHBsYXllci5tYXhCb21icykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUJvbWIocGxheWVyLmlkLCBwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgcGxheWVyLmJvbWJSYW5nZSk7XG4gICAgICAgIGlmICghY3JlYXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0RST1BfQk9NQicsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZDogcGxheWVyLmlkLCB4OiBwb3MuZ3JpZFgsIHk6IHBvcy5ncmlkWSwgcmFuZ2U6IHBsYXllci5ib21iUmFuZ2UgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiBib21iLm93bmVySWQgPT09IG93bmVySWQgJiYgcG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuZWwgPSBib21iRGl2O1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicsIGJvbWJDb21wKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlTW92ZShwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW2hhbmRsZVJlbW90ZU1vdmVdIEludmFsaWQgcGF5bG9hZDpcIiwgcGF5bG9hZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBFbnRpdHkgbm90IGZvdW5kIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfS4gQXZhaWxhYmxlIHBsYXllcnM6YCwgQXJyYXkuZnJvbSh0aGlzLnBsYXllckVudGl0aWVzLmtleXMoKSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghcG9zIHx8ICF2ZWwgfHwgIXJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIE1pc3NpbmcgY29tcG9uZW50cyBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH06YCwgeyBwb3M6ICEhcG9zLCB2ZWw6ICEhdmVsLCByZW5kZXJhYmxlOiAhIXJlbmRlcmFibGUgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW2hhbmRsZVJlbW90ZU1vdmVdIFVwZGF0aW5nIHBsYXllciAke3BheWxvYWQuaWR9IHRvICgke3BheWxvYWQuZ3JpZFh9LCAke3BheWxvYWQuZ3JpZFl9KWApO1xuICAgICAgICB2ZWwuZGlyZWN0aW9uID0gcGF5bG9hZC5kaXJlY3Rpb24gfHwgdmVsLmRpcmVjdGlvbjtcbiAgICAgICAgdmVsLmlzTW92aW5nID0gcGF5bG9hZC5pc01vdmluZztcbiAgICAgICAgcG9zLmdyaWRYID0gcGF5bG9hZC5ncmlkWDtcbiAgICAgICAgcG9zLmdyaWRZID0gcGF5bG9hZC5ncmlkWTtcbiAgICAgICAgcG9zLnRhcmdldFggPSBwYXlsb2FkLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcGF5bG9hZC55O1xuICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gcGF5bG9hZC5zdGF0ZSB8fCAocGF5bG9hZC5pc01vdmluZyA/ICdSVU4nIDogJ0lETEUnKTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVCb21iKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3JlYXRlQm9tYihwYXlsb2FkLmlkLCBwYXlsb2FkLngsIHBheWxvYWQueSwgcGF5bG9hZC5yYW5nZSB8fCA0KTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8IHBheWxvYWQueCA9PT0gdW5kZWZpbmVkIHx8IHBheWxvYWQueSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCB8fCBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHJldHVybjtcblxuICAgICAgICB0aGlzLmFwcGx5UG93ZXJVcChlbnRpdHksIHBheWxvYWQudHlwZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlUG93ZXJVcEF0KGdyaWRYLCBncmlkWSkge1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7Z3JpZFh9LCR7Z3JpZFl9YCk7XG4gICAgICAgIGNvbnN0IHBvd2VyVXBzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcG93ZXJVcCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghcG9zIHx8ICFwb3dlclVwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWSkge1xuICAgICAgICAgICAgICAgIHBvd2VyVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBvd2VyVXAuZWwgJiYgcG93ZXJVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvd2VyVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3dlclVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmRlc3Ryb3lFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseVBvd2VyVXAoZW50aXR5LCB0eXBlKSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICBhcHBseVNwZWVkUG93ZXJVcCh2ZWxvY2l0eSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0ZMQU1FJykge1xuICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWdpc3RlclN5c3RlbXMoKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZU1hcENlbGwgPSAoeCwgeSwgbmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXBEYXRhW3ldKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubWFwRGF0YVt5XVt4XSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWApO1xuICAgICAgICAgICAgaWYgKCF0aWxlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRpbGUuY2xhc3NOYW1lID0gJ3RpbGUgdGlsZS1mbG9vcic7XG4gICAgICAgICAgICB0aWxlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIpJztcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkZXN0cm95Qm94Q2FsbGJhY2sgPSAoeCwgeSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xhaW1lZFBvd2VyVXBzLmhhcyhgJHt4fSwke3l9YCkpIHJldHVybjtcbiAgICAgICAgICAgIHNwYXduUG93ZXJVcCh0aGlzLndvcmxkLCB4LCB5LCB0aGlzLmNvbnRhaW5lciwgVElMRV9TSVpFKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBsYXllckh1cnQgPSAoZW50aXR5LCBpZCwgcmVtYWluaW5nTGl2ZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICBzZXRMaXZlcyhyZW1haW5pbmdMaXZlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25Qb3dlclVwUGlja2VkID0gKGlkLCB0eXBlLCB4LCB5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7eH0sJHt5fWApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAocGxheWVyICYmIHBsYXllci5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPV0VSVVBfUElDS0VEJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZCwgdHlwZSwgeCwgeSB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYnJvYWRjYXN0TW92ZW1lbnQgPSAoZW50aXR5LCB4LCB5LCBncmlkWCwgZ3JpZFksIGRpcmVjdGlvbiwgaXNNb3ZpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXRoaXMuc29ja2V0IHx8IHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdNT1ZFX1NUQVRFJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBwbGF5ZXIuaWQsXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBncmlkWSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICBpc01vdmluZyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IGlzTW92aW5nID8gJ1JVTicgOiAnSURMRScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBtb3ZlbWVudFN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gYm9tYlN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBkYW1hZ2VTeXN0ZW0odywgbm93LCBvblBsYXllckh1cnQsIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcG93ZXJVcFN5c3RlbSh3LCBvblBvd2VyVXBQaWNrZWQpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHJlbmRlclN5c3RlbSh3LCBkdCwgbm93LCBBTklNQVRJT05fUk9XUykpO1xuICAgIH1cblxuICAgIGdhbWVMb29wKG5vdykge1xuICAgICAgICBpZiAoIXRoaXMucnVubmluZykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGR0ID0gbm93IC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IG5vdztcbiAgICAgICAgdGhpcy53b3JsZC51cGRhdGUoZHQsIG5vdyk7XG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5leHROb3cpID0+IHRoaXMuZ2FtZUxvb3AobmV4dE5vdykpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVIdWRTdGF0cyhlbnRpdHkpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgc2V0Qm9tYnMocGxheWVyLm1heEJvbWJzIHx8IDEpO1xuICAgICAgICBzZXRMaXZlcyhwbGF5ZXIubGl2ZXMgPz8gMyk7XG4gICAgICAgIHNldFJhbmdlKHBsYXllci5ib21iUmFuZ2UgfHwgNCk7XG4gICAgICAgIHNldFNwZWVkKE1hdGgucm91bmQodmVsb2NpdHkuc3BlZWQpKTtcbiAgICB9XG59XG5cbmxldCBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gXCJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFBsYXllck5hbWUobmFtZSkge1xuICAgIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBuYW1lO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIsIG5hbWUpO1xuICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5XCIsIG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGxheWVyTmFtZSgpIHtcbiAgICByZXR1cm4gY3VycmVudExvY2FsUGxheWVyTmFtZSB8fCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiKSB8fCBcIlBsYXllclwiO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGJvbWJTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IGJvbWJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IGJvbWJFbnRpdHkgb2YgYm9tYnMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBib21iID0gd29ybGQuZ2V0Q29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJyk7XG4gICAgICAgIFxuICAgICAgICBib21iLnRpbWVyIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGJvbWIudGltZXIgPD0gMCAmJiAhYm9tYi5leHBsb2RlZCkge1xuICAgICAgICAgICAgYm9tYi5leHBsb2RlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGFmZmVjdGVkQ2VsbHMgPSBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgYm9tYi5yYW5nZSwgbWFwRGF0YSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFmZmVjdGVkQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBleHBEaXYuY2xhc3NOYW1lID0gJ2V4cGxvc2lvbic7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUubGVmdCA9IGAke2NlbGwueCAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUudG9wID0gYCR7Y2VsbC55ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS56SW5kZXggPSAnNyc7XG5cbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nLCB7IFxuICAgICAgICAgICAgICAgICAgICBncmlkWDogY2VsbC54LCBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFk6IGNlbGwueSwgXG4gICAgICAgICAgICAgICAgICAgIHg6IGNlbGwueCAqIHRpbGVTaXplLCBcbiAgICAgICAgICAgICAgICAgICAgeTogY2VsbC55ICogdGlsZVNpemUgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicsIHsgZHVyYXRpb246IDUwMCwgZWw6IGV4cERpdiB9KTtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZXhwRGl2KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAobWFwRGF0YVtjZWxsLnldICYmIG1hcERhdGFbY2VsbC55XVtjZWxsLnhdID09PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZU1hcENlbGwoY2VsbC54LCBjZWxsLnksIDIpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc3Ryb3lCb3hDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveUJveENhbGxiYWNrKGNlbGwueCwgY2VsbC55KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYm9tYi5lbCAmJiBib21iLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYm9tYi5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KGJvbWJFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICBjb25zdCBleHAgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJyk7XG4gICAgICAgIGV4cC5kdXJhdGlvbiAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChleHAuZHVyYXRpb24gPD0gMCkge1xuICAgICAgICAgICAgaWYgKGV4cC5lbCAmJiBleHAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGV4cC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGV4cC5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KGV4cEVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKGJ4LCBieSwgcmFuZ2UsIG1hcERhdGEpIHtcbiAgICBjb25zdCBjZWxscyA9IFt7IHg6IGJ4LCB5OiBieSB9XTtcbiAgICBjb25zdCBkaXJlY3Rpb25zID0gW1xuICAgICAgICB7IHg6IDAsIHk6IC0xIH0sXG4gICAgICAgIHsgeDogMCwgeTogMSB9LFxuICAgICAgICB7IHg6IC0xLCB5OiAwIH0sXG4gICAgICAgIHsgeDogMSwgeTogMCB9XG4gICAgXTtcbiAgICBcbiAgICBjb25zdCBzdGVwcyA9IHJhbmdlIC0gMTsgXG4gICAgXG4gICAgZGlyZWN0aW9ucy5mb3JFYWNoKGRpciA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gYnggKyAoZGlyLnggKiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHR5ID0gYnkgKyAoZGlyLnkgKiBpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFtYXBEYXRhW3R5XSB8fCBtYXBEYXRhW3R5XVt0eF0gPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNlbGxUeXBlID0gbWFwRGF0YVt0eV1bdHhdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2VsbHMucHVzaCh7IHg6IHR4LCB5OiB0eSB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gY2VsbHM7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGFtYWdlU3lzdGVtKHdvcmxkLCBub3csIG9uUGxheWVySHVydCwgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUGxheWVyJyk7XG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHBsYXllci5pbnZpbmNpYmxlVW50aWwgJiYgcGxheWVyLmludmluY2libGVVbnRpbCA+IG5vdykgY29udGludWU7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgICAgICBjb25zdCBlUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vKEdyaWQtYmFzZWQgY29sbGlzaW9uKVxuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFggPSBNYXRoLmZsb29yKChwUG9zLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFkgPSBNYXRoLmZsb29yKChwUG9zLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuXG4gICAgICAgICAgICBpZiAocGxheWVyR3JpZFggPT09IGVQb3MuZ3JpZFggJiYgcGxheWVyR3JpZFkgPT09IGVQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSBNYXRoLm1heCgocGxheWVyLmxpdmVzID8/IDMpIC0gMSwgMCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLmludmluY2libGVVbnRpbCA9IG5vdyArIDE1MDA7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG9uUGxheWVySHVydCkge1xuICAgICAgICAgICAgICAgICAgICBvblBsYXllckh1cnQocGxheWVyRW50aXR5LCBwbGF5ZXIuaWQsIHBsYXllci5saXZlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIG1vdmVtZW50U3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB0aWxlU2l6ZSA9IDQwKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknKTtcbiAgICBjb25zdCBkZWx0YSA9IGR0IC8gMTYuNjc7XG5cbiAgICBjb25zdCBQTEFZRVJfU0laRSA9IHRpbGVTaXplO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBpbnB1dCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBjb25zdCBiZWhhdmlvciA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCZWhhdmlvcicpO1xuXG4gICAgICAgIGlmICh2ZWwuc3BlZWRCb29zdFRpbWVSZW1haW5pbmcgPiAwKSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWRCb29zdFRpbWVSZW1haW5pbmcgPSBNYXRoLm1heCh2ZWwuc3BlZWRCb29zdFRpbWVSZW1haW5pbmcgLSBkdCwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWRCb29zdCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aW1lZEJvb3N0ID0gdmVsLnNwZWVkQm9vc3RUaW1lUmVtYWluaW5nID4gMCA/IHZlbC5zcGVlZEJvb3N0IHx8IDAgOiAwO1xuICAgICAgICBjb25zdCBiZWhhdmlvckJvb3N0ID0gYmVoYXZpb3IgPyAoYmVoYXZpb3IuZmFzdFNob2VzTGV2ZWwgLSAxKSAqIDAuNSA6IDA7XG4gICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQgKyB0aW1lZEJvb3N0ICsgYmVoYXZpb3JCb29zdDtcblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUlucHV0ID0gaW5wdXQuaW5wdXRRdWV1ZVswXTtcbiAgICAgICAgbGV0IGR4ID0gMDtcbiAgICAgICAgbGV0IGR5ID0gMDtcblxuICAgICAgICBpZiAoYWN0aXZlSW5wdXQgPT09ICd1cCcpIHtcbiAgICAgICAgICAgIGR5ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3VwJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2Rvd24nKSB7XG4gICAgICAgICAgICBkeSA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2Rvd24nO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIGR4ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICBkeCA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3JpZ2h0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhc0lucHV0ID0gZHggIT09IDAgfHwgZHkgIT09IDA7XG5cbiAgICAgICAgaWYgKCFoYXNJbnB1dCkge1xuICAgICAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG4gICAgICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ0lETEUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WSA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBjb25zdCBzbmFwVGhyZXNob2xkID0gMzI7XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmIGR4ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKHBvcy54LCBuZXh0WSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWCA9IE1hdGguZmxvb3IoKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRYID0gY3VycmVudFRpbGVYICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlggPSBwb3MueCAtIHRhcmdldFg7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlgpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gLU1hdGguc2lnbihkaWZmWCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmIGR5ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKG5leHRYLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWSA9IE1hdGguZmxvb3IoKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRZID0gY3VycmVudFRpbGVZICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlkgPSBwb3MueSAtIHRhcmdldFk7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlkpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gLU1hdGguc2lnbihkaWZmWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFhBZnRlclNuYXAgPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZQWZ0ZXJTbmFwID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiAhaXNCbG9ja2VkKG5leHRYQWZ0ZXJTbmFwLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnggPSBuZXh0WEFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiAhaXNCbG9ja2VkKHBvcy54LCBuZXh0WUFmdGVyU25hcCwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnkgPSBuZXh0WUFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlbC5pc01vdmluZyA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ1JVTic7XG4gICAgICAgIH1cblxuICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG5cbiAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpIHtcbiAgICBjb25zdCBzdGVwID0gdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICBpZiAocG9zLnggPCBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWluKHBvcy54ICsgc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH0gZWxzZSBpZiAocG9zLnggPiBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWF4KHBvcy54IC0gc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH1cblxuICAgIGlmIChwb3MueSA8IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5taW4ocG9zLnkgKyBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfSBlbHNlIGlmIChwb3MueSA+IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5tYXgocG9zLnkgLSBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfVxuXG4gICAgdmVsLmlzTW92aW5nID1cbiAgICAgICAgcG9zLnggIT09IHBvcy50YXJnZXRYIHx8XG4gICAgICAgIHBvcy55ICE9PSBwb3MudGFyZ2V0WTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkKHgsIHksIG1hcERhdGEsIHRpbGVTaXplLCBwbGF5ZXJTaXplID0gdGlsZVNpemUpIHtcbiAgICBjb25zdCBwYWRkaW5nID0gNDtcblxuICAgIGNvbnN0IGxlZnQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgcmlnaHQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHRvcCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCBib3R0b20gPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgYm90dG9tLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCBib3R0b20sIG1hcERhdGEpXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkQ2VsbCh4LCB5LCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbCA9IG1hcERhdGFbeV0gJiYgbWFwRGF0YVt5XVt4XTtcblxuICAgIHJldHVybiBjZWxsICE9PSAwICYmIGNlbGwgIT09IDI7XG59XG4iLCJleHBvcnQgY29uc3QgU1BFRURfUE9XRVJVUF9BTU9VTlQgPSAxO1xuZXhwb3J0IGNvbnN0IE1BWF9QTEFZRVJfU1BFRUQgPSA4O1xuZXhwb3J0IGNvbnN0IFNQRUVEX1BPV0VSVVBfRFVSQVRJT04gPSA1MDAwO1xuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlTcGVlZFBvd2VyVXAodmVsb2NpdHkpIHtcbiAgICBjb25zdCBjdXJyZW50Qm9vc3QgPSB2ZWxvY2l0eS5zcGVlZEJvb3N0IHx8IDA7XG4gICAgY29uc3QgbWF4Qm9vc3QgPSBNYXRoLm1heChNQVhfUExBWUVSX1NQRUVEIC0gdmVsb2NpdHkuYmFzZVNwZWVkLCAwKTtcbiAgICB2ZWxvY2l0eS5zcGVlZEJvb3N0ID0gTWF0aC5taW4oY3VycmVudEJvb3N0ICsgU1BFRURfUE9XRVJVUF9BTU9VTlQsIG1heEJvb3N0KTtcbiAgICB2ZWxvY2l0eS5zcGVlZEJvb3N0VGltZVJlbWFpbmluZyA9IFNQRUVEX1BPV0VSVVBfRFVSQVRJT047XG4gICAgdmVsb2NpdHkuc3BlZWQgPSBNYXRoLm1pbih2ZWxvY2l0eS5iYXNlU3BlZWQgKyB2ZWxvY2l0eS5zcGVlZEJvb3N0LCBNQVhfUExBWUVSX1NQRUVEKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvd2VyVXBTeXN0ZW0od29ybGQsIG9uUG93ZXJVcFBpY2tlZCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUGxheWVyJyk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcFBvcyB8fCAhdmVsIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcFVwRW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCB1cFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcFVwID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghdXBQb3MgfHwgIXBVcCB8fCBwVXAucGlja2VkVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocFBvcy5ncmlkWCA9PT0gdXBQb3MuZ3JpZFggJiYgcFBvcy5ncmlkWSA9PT0gdXBQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC50eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5U3BlZWRQb3dlclVwKHZlbCk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwVXAuZWwgJiYgcFVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcFVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocFVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob25Qb3dlclVwUGlja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uUG93ZXJVcFBpY2tlZChwbGF5ZXIuaWQsIHBVcC50eXBlLCB1cFBvcy5ncmlkWCwgdXBQb3MuZ3JpZFkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkocFVwRW50aXR5KTtcbiAgICAgICAgICAgICAgICBicmVhazsgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGF3blBvd2VyVXAod29ybGQsIGd4LCBneSwgY29udGFpbmVyLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3Qgc2VlZCA9IGd4ICogNzM4NTYwOTMgXiBneSAqIDE5MzQ5NjYzO1xuICAgIGNvbnN0IHNlZWRSYW5kb20gPSAoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCkgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQpICogMTAwMDApO1xuICAgIFxuICAgIGlmIChzZWVkUmFuZG9tID4gMC4zNSkgcmV0dXJuO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbJ1NQRUVEJywgJ0JPTUJTJywgJ0ZMQU1FJ107XG4gICAgY29uc3QgdHlwZUluZGV4ID0gTWF0aC5mbG9vcigoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDAgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwKSkgKiB0eXBlcy5sZW5ndGgpO1xuICAgIGNvbnN0IHJhbmRvbVR5cGUgPSB0eXBlc1t0eXBlSW5kZXhdO1xuXG4gICAgY29uc3QgcFVwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWDogZ3gsIGdyaWRZOiBneSwgeDogZ3ggKiB0aWxlU2l6ZSwgeTogZ3kgKiB0aWxlU2l6ZSB9KTtcbiAgICBcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gYHBvd2VydXAgcG93ZXJ1cC0ke3JhbmRvbVR5cGUudG9Mb3dlckNhc2UoKX1gO1xuICAgIGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSBgJHtneCAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUudG9wID0gYCR7Z3kgKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJywgeyB0eXBlOiByYW5kb21UeXBlLCBlbDogZGl2IH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclN5c3RlbSh3b3JsZCwgZHQsIG5vdywgYW5pbVJvd3MpIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdSZW5kZXJhYmxlJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuXG4gICAgICAgIGlmICghcmVuZGVyYWJsZS5lbCkgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSByZW5kZXJhYmxlLnN0YXRlO1xuICAgICAgICBjb25zdCB0YXJnZXRSb3cgPSBhbmltUm93c1tzdGF0ZV1bdmVsLmRpcmVjdGlvbl07XG4gICAgICAgIFxuICAgICAgICAvLyBSZXNldCBhbmltYXRpb24gd2hlbiByb3cgb3Igc3RhdGUgY2hhbmdlc1xuICAgICAgICBpZiAocmVuZGVyYWJsZS5yb3cgIT09IHRhcmdldFJvdyB8fCByZW5kZXJhYmxlLmxhc3RTdGF0ZSAhPT0gc3RhdGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUucm93ID0gdGFyZ2V0Um93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0U3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZyYW1lQ291bnQgPSBzdGF0ZSA9PT0gJ1JVTicgPyByZW5kZXJhYmxlLnJ1bkZyYW1lcyA6IHJlbmRlcmFibGUuaWRsZUZyYW1lcztcbiAgICAgICAgY29uc3QgZnJhbWVEZWxheSA9IHN0YXRlID09PSAnUlVOJyA/IDEwMDAgLyByZW5kZXJhYmxlLmZwcyA6IDEwMDAgLyByZW5kZXJhYmxlLmlkbGVGcHM7XG5cbiAgICAgICAgaWYgKG5vdyAtIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA+IGZyYW1lRGVsYXkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICsgMSkgJSBmcmFtZUNvdW50O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zWCA9IC0ocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKiByZW5kZXJhYmxlLmZyYW1lV2lkdGgpO1xuICAgICAgICBjb25zdCBwb3NZID0gLShyZW5kZXJhYmxlLnJvdyAqIHJlbmRlcmFibGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBgJHtwb3NYfXB4ICR7cG9zWX1weGA7XG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7cG9zLnh9cHgsICR7cG9zLnl9cHgsIDApYDtcbiAgICB9XG59XG4iLCIvLyAvc3JjL2Vjcy93b3JsZC5qc1xuXG5leHBvcnQgY2xhc3MgV29ybGQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm5leHRFbnRpdHlJZCA9IDA7XG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IG5ldyBNYXAoKTsgXG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuICAgIH1cblxuICAgIGNyZWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5uZXh0RW50aXR5SWQrKztcbiAgICAgICAgdGhpcy5lbnRpdGllcy5hZGQoZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG5cbiAgICBkZXN0cm95RW50aXR5KGVudGl0eSkge1xuICAgICAgICB0aGlzLmVudGl0aWVzLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICBmb3IgKGNvbnN0IFtjb21wb25lbnROYW1lLCBjb21wb25lbnRNYXBdIG9mIHRoaXMuY29tcG9uZW50cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERhdGEgPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zZXQoY29tcG9uZW50TmFtZSwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpLnNldChlbnRpdHksIGNvbXBvbmVudERhdGEpO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE1hcCA/IGNvbXBvbmVudE1hcC5nZXQoZW50aXR5KSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZW1vdmVDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIGlmIChjb21wb25lbnRNYXApIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHF1ZXJ5KC4uLmNvbXBvbmVudE5hbWVzKSB7XG4gICAgICAgIGlmIChjb21wb25lbnROYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpcnN0TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1swXSk7XG4gICAgICAgIGlmICghZmlyc3RNYXApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZmlyc3RNYXAua2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgaGFzQWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY29tcG9uZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcCB8fCAhbWFwLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0FsbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzQWxsICYmIHRoaXMuZW50aXRpZXMuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRTeXN0ZW0oc3lzdGVtRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zeXN0ZW1zLnB1c2goc3lzdGVtRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHVwZGF0ZShkdCwgbm93KSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3lzdGVtIG9mIHRoaXMuc3lzdGVtcykge1xuICAgICAgICAgICAgc3lzdGVtKHRoaXMsIGR0LCBub3cpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5cbmV4cG9ydCBjb25zdCBUSUxFX1NJWkUgPSA0ODtcbmNvbnN0IEdSSURfQk9SREVSX1NJWkUgPSA2O1xuXG5jb25zdCBpbWFnZXMgPSB7XG4gICAgMjogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIsXG4gICAgMzogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfd2FsbC5wbmdcIixcbiAgICA0OiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19leHBsb2l0LnBuZ1wiLFxufTtcblxuY29uc3QgW3BsYXllck5hbWUsIHNldFBsYXllck5hbWVdID0gY3JlYXRlU2lnbmFsKFwiUGxheWVyIDFcIik7XG5jb25zdCBbbGl2ZXMsIHNldExpdmVzXSA9IGNyZWF0ZVNpZ25hbCgzKTtcbmNvbnN0IFtzcGVlZCwgc2V0U3BlZWRdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW2JvbWJzLCBzZXRCb21ic10gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbcmFuZ2UsIHNldFJhbmdlXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmV4cG9ydCB7IHNldFBsYXllck5hbWUsIHNldExpdmVzLCBzZXRTcGVlZCwgc2V0Qm9tYnMsIHNldFJhbmdlIH07XG5cbmNvbnN0IG5hbWVFbCA9IDxzcGFuIGNsYXNzPVwicGxheWVyLW5hbWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBuYW1lRWwudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lKCk7IH0pO1xuXG5jb25zdCBsaXZlc0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBsaXZlcy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBzcGVlZEVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBzcGVlZC12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBib21ic0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBib21icy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCByYW5nZUVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSByYW5nZS12YWx1ZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGxpdmVzRWwudGV4dENvbnRlbnQgPSBsaXZlcygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHNwZWVkRWwudGV4dENvbnRlbnQgPSBzcGVlZCgpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGJvbWJzRWwudGV4dENvbnRlbnQgPSBib21icygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHJhbmdlRWwudGV4dENvbnRlbnQgPSByYW5nZSgpOyB9KTtcblxuZnVuY3Rpb24gR2FtZSh7IGdyaWQgfSkge1xuICAgIGNvbnN0IGJvYXJkV2lkdGggPSBncmlkWzBdLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZEhlaWdodCA9IGdyaWQubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJXaWR0aCA9IGJvYXJkV2lkdGggKyBHUklEX0JPUkRFUl9TSVpFICogMjtcbiAgICBjb25zdCBib2FyZE91dGVySGVpZ2h0ID0gYm9hcmRIZWlnaHQgKyBHUklEX0JPUkRFUl9TSVpFICogMjtcbiAgICBjb25zdCByb3dzID0gW107XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IGdyaWQubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCBncmlkW3Jvd0luZGV4XS5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBncmlkW3Jvd0luZGV4XVtjb2xJbmRleF07XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gXCJ0aWxlXCI7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBgd2lkdGg6JHtUSUxFX1NJWkV9cHg7aGVpZ2h0OiR7VElMRV9TSVpFfXB4O2A7XG5cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAyIHx8IGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS1mbG9vclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS13YWxsXCI7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzNdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbNF19KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMCB8fCBjZWxsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzJdfSlgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxscy5wdXNoKDxkaXYgY2xhc3M9e2NsYXNzTmFtZX0gZGF0YS14PXtjb2xJbmRleH0gZGF0YS15PXtyb3dJbmRleH0gc3R5bGU9e3N0eWxlfT48L2Rpdj4pO1xuICAgICAgICB9XG4gICAgICAgIHJvd3MucHVzaCg8ZGl2IGNsYXNzPVwiZ3JpZC1yb3dcIj57Y2VsbHN9PC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWdsYXNzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWJhclwiPlxuICAgICAgICAgICAgICAgICAgICB7bmFtZUVsfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+TGl2ZXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpdmVzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+U3BlZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwZWVkRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+Qm9tYnM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvbWJzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+UmFuZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JhbmdlRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtYm9hcmQtZnJhbWVcIiBzdHlsZT17YHdpZHRoOiR7Ym9hcmRPdXRlcldpZHRofXB4O2hlaWdodDoke2JvYXJkT3V0ZXJIZWlnaHR9cHg7YH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZ2FtZS1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJnYW1lLWdyaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2Bwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoke2JvYXJkV2lkdGh9cHg7aGVpZ2h0OiR7Ym9hcmRIZWlnaHR9cHg7YH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IENoYXRQbGF5ZXJzIGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxubGV0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSBjcmVhdGVTaWduYWwoe30pO1xuZXhwb3J0IHsgc2V0U3RhdGVzIH07XG5cbmxldCByb29tSWRFbCA9IDxwPlJvb20gSUQ6IDwvcD47XG5sZXQgcGxheWVyc0VsID0gPHA+UGxheWVyczogIC8gNDwvcD47XG5sZXQgdGV4dEVsID0gPHA+PC9wPjtcbmxldCB0aW1lckVsID0gPHA+VGltZXI6IDwvcD47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcyA9IHN0YXRlcygpO1xuICAgIHJvb21JZEVsLnRleHRDb250ZW50ID0gYFJvb20gSUQ6ICR7cy5yb29tSWR9YDtcbiAgICBwbGF5ZXJzRWwudGV4dENvbnRlbnQgPSBgUGxheWVyczogJHtzLnBsYXllcnNDb3VudH0gLyA0YDtcbiAgICB0ZXh0RWwudGV4dENvbnRlbnQgPSBzLnRleHQgfHwgXCJcIjtcblxuICAgIGlmIChzLmdhbWVTdGFydGVkKSB7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBcIlRpbWVyOiBHYW1lIHN0YXJ0ZWRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0aW1lclRleHQgPSAoIXMuc2Vjb25kc0xlZnQpID8gXCJXYWl0aW5nIGZvciBvbmUgbW9yZSBwbGF5ZXJcIiA6IGAke3Muc2Vjb25kc0xlZnR9IHNlY29uZHNgO1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gYFRpbWVyOiAke3RpbWVyVGV4dH1gO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBMb2JieSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29uYXRpbmVyLWxvYmJ5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9iYnktYm94XCI+XG4gICAgICAgICAgICAgICAgPGgxPkxvYmJ5PC9oMT5cbiAgICAgICAgICAgICAgICB7cm9vbUlkRWx9XG4gICAgICAgICAgICAgICAge3BsYXllcnNFbH1cbiAgICAgICAgICAgICAgICB7dGV4dEVsfVxuICAgICAgICAgICAgICAgIHt0aW1lckVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q2hhdFBsYXllcnMgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2JieTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5jb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbnJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbmxldCBtZW51RWwgPSAoXG4gICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgIDxoMT5Zb3UgV2luITwvaDE+XG4gICAgICAgIDxwPkFsbCBvdGhlciBwbGF5ZXJzIGhhdmUgbGVmdCB0aGUgZ2FtZS48L3A+XG4gICAgICAgIHtyZXBsYXlCdG59XG4gICAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZW51KCkge1xuICAgIHJldHVybiBtZW51RWw7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5jb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IGNyZWF0ZVNpZ25hbChcIlwiKTtcbmV4cG9ydCB7IHNldEVycm9yIH07XG5cbmZ1bmN0aW9uIFJlZ2lzdGVyKHsgd3NzIH0pIHtcbiAgICBsZXQgc3VibWl0dGVkID0gZmFsc2U7XG4gICAgY29uc3QgZXJyb3JFbCA9IDxwIGNsYXNzPVwicmVnaXN0ZXItZXJyb3JcIj48L3A+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgZXJyb3JFbC50ZXh0Q29udGVudCA9IGVycm9yKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgcGxheWVyRW50ZXIgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCBuaWNrbmFtZSA9IGZvcm1EYXRhLmdldChcIm5pY2tuYW1lXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW5pY2tuYW1lIHx8IG5pY2tuYW1lLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBzZXRFcnJvcihcIkludmFsaWQgbmlja25hbWVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcbiAgICAgICAgc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc2V0UGxheWVyTmFtZShuaWNrbmFtZSk7XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJuaWNrbmFtZV9vZl90aGVfcGxheWVyXCIsXG4gICAgICAgICAgICBuaWNrbmFtZTogbmlja25hbWVcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxmb3JtIGNsYXNzPVwicmVnaXN0ZXItZm9ybVwiIG9uU3VibWl0PXtwbGF5ZXJFbnRlcn0+XG4gICAgICAgICAgICB7ZXJyb3JFbH1cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5pY2tuYW1lLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVudGVyIHlvdXIgbmFtZVwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIHRoaXMubXVzaWMucGxheSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpO1xuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVzaWMucGF1c2VkIHx8IHRoaXMubXVzaWMubXV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvblwiKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVCdXR0b24oKSB7XG4gICAgICAgIGNvbnN0IGlzTXV0ZWQgPSB0aGlzLm11c2ljLm11dGVkIHx8IHRoaXMubXVzaWMucGF1c2VkO1xuXG4gICAgICAgIHRoaXMuaWNvbi5jbGFzc05hbWUgPSBpc011dGVkID8gXCJmYS1zb2xpZCBmYS12b2x1bWUtb2ZmXCIgOiBcImZhLXNvbGlkIGZhLXZvbHVtZS1oaWdoXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1tdXRlZFwiLCBpc011dGVkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvdW5kO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC9hcHAuanNcIik7XG4iLCIiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJwcm9wcyIsImNoaWxkcmVuIiwiZWxlIiwiZG9jdW1lbnQiLCJrZXkiLCJzdGFydHNXaXRoIiwiZXZlbnROYW1lIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRBdHRyaWJ1dGUiLCJmbGF0Q2hpbGRyZW4iLCJmbGF0IiwiSW5maW5pdHkiLCJhcHBlbmQiLCJmaWx0ZXIiLCJjaGlsZCIsInVuZGVmaW5lZCIsInJlbmRlciIsImVsZW1lbnQiLCJjb250YWluZXIiLCJyZXBsYWNlQ2hpbGRyZW4iLCJSb3V0ZXIiLCJyb3V0ZXIiLCJlZmZlY3RTdGFjayIsImFjdGl2ZUVmZmVjdCIsImNyZWF0ZVNpZ25hbCIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwiZWZmZWN0cyIsIlNldCIsIlJlYWQiLCJhZGQiLCJXcml0ZSIsIm5ld1ZhbHVlIiwiZm4iLCJmb3JFYWNoIiwiZWZmZWN0IiwiY3JlYXRlRWZmZWN0IiwicHVzaCIsInBvcCIsImxlbmd0aCIsIlJvdXRlcyIsIk9iamVjdCIsImNyZWF0ZSIsIkZpcnN0UmVzb2x2ZSIsIm9uIiwicGF0aCIsImhhbmRsZXIiLCJuYXZpZ2F0ZSIsImhpc3RvcnkiLCJuYXZpZ2F0aW9uIiwicmVzb2x2ZSIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJ1cmwiLCJVUkwiLCJocmVmIiwibGlzdGVuIiwib25FcnJvcjQwNCIsImV2ZW50IiwiZGVzdGluYXRpb24iLCJpbnRlcmNlcHQiLCJjb25zb2xlIiwibG9nIiwiUmVnaXN0ZXIiLCJzZXRFcnJvciIsIkdhbWUiLCJNZW51IiwiTG9iYnkiLCJzZXRTdGF0ZXMiLCJzZXRQbGF5ZXJOYW1lIiwic2V0SHVkUGxheWVyTmFtZSIsIlNvdW5kIiwic2V0TWVzc2FnZXMiLCJHYW1lRW5naW5lIiwicm9vdCIsImdldEVsZW1lbnRCeUlkIiwid3NzIiwiV2ViU29ja2V0Iiwic291bmQiLCJjdXJyZW50R2FtZUVuZ2luZSIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJ3cyIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicXVlcnlTZWxlY3RvciIsInJvb21JZCIsInBsYXllcnNDb3VudCIsInNlY29uZHNMZWZ0IiwidGV4dCIsImdyaWQiLCJzZXRUaW1lb3V0IiwiZ2FtZUNvbnRhaW5lciIsImRlc3Ryb3kiLCJsb2NhbFBsYXllciIsInBsYXllcnMiLCJmaW5kIiwicGxheWVyIiwiaWQiLCJ5b3VyUGxheWVySWQiLCJuaWNrbmFtZSIsImVuZ2luZSIsImVycm9yIiwicHJldiIsImhhbmRsZVJlbW90ZU1vdmUiLCJwYXlsb2FkIiwiaGFuZGxlUmVtb3RlQm9tYiIsImhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQiLCJlcnIiLCJtZXNzYWdlcyIsIkNoYXRQbGF5ZXJzIiwibWVzc2FnZXNDb250YWluZXIiLCJjbGFzcyIsIm1zZ3MiLCJpbm5lckhUTUwiLCJtc2ciLCJwIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJ1bnNoaWZ0IiwiYnJvYWRjYXN0TWVzc2FnZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJ0YXJnZXQiLCJnZXQiLCJ0cmltIiwicmVzZXQiLCJzZW5kIiwic3RyaW5naWZ5Iiwib25TdWJtaXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJtYXhsZW5ndGgiLCJQb3NpdGlvbkNvbXBvbmVudCIsImd4IiwiZ3kiLCJ0aWxlU2l6ZSIsImdyaWRYIiwiZ3JpZFkiLCJ4IiwieSIsInRhcmdldFgiLCJ0YXJnZXRZIiwiVmVsb2NpdHlDb21wb25lbnQiLCJiYXNlU3BlZWQiLCJzcGVlZCIsInNwZWVkQm9vc3QiLCJzcGVlZEJvb3N0VGltZVJlbWFpbmluZyIsImlzTW92aW5nIiwiZGlyZWN0aW9uIiwiSW5wdXRDb21wb25lbnQiLCJpbnB1dFF1ZXVlIiwiUmVuZGVyYWJsZUNvbXBvbmVudCIsImVsIiwiZnJhbWVXaWR0aCIsImZyYW1lSGVpZ2h0IiwidG90YWxGcmFtZXMiLCJmcHMiLCJjdXJyZW50RnJhbWUiLCJydW5GcmFtZXMiLCJpZGxlRnJhbWVzIiwiaWRsZUZwcyIsImxhc3RGcmFtZVRpbWUiLCJyb3ciLCJzdGF0ZSIsImxhc3RTdGF0ZSIsIlBsYXllckNvbXBvbmVudCIsImNoYXJUeXBlIiwiaXNMb2NhbCIsIkJvbWJDb21wb25lbnQiLCJvd25lcklkIiwidGltZXIiLCJyYW5nZSIsImV4cGxvZGVkIiwiRXhwbG9zaW9uQ29tcG9uZW50IiwiZHVyYXRpb24iLCJQb3dlclVwQ29tcG9uZW50IiwicGlja2VkVXAiLCJCZWhhdmlvckNvbXBvbmVudCIsImdob3N0TW9kZSIsInRocm93YWJsZSIsImRldG9uYXRvciIsImZhc3RTaG9lc0xldmVsIiwiYm9tYnMiLCJtYXgiLCJjdXJyZW50IiwiV29ybGQiLCJtb3ZlbWVudFN5c3RlbSIsInJlbmRlclN5c3RlbSIsImJvbWJTeXN0ZW0iLCJkYW1hZ2VTeXN0ZW0iLCJhcHBseVNwZWVkUG93ZXJVcCIsInBvd2VyVXBTeXN0ZW0iLCJzcGF3blBvd2VyVXAiLCJzZXRCb21icyIsInNldExpdmVzIiwic2V0UmFuZ2UiLCJzZXRTcGVlZCIsIlRJTEVfU0laRSIsIlNQUklURV9DT0xVTU5TIiwiU1BSSVRFX1JPV1MiLCJBTklNQVRJT05fUk9XUyIsIlJVTiIsInVwIiwibGVmdCIsImRvd24iLCJyaWdodCIsIklETEUiLCJjb25zdHJ1Y3RvciIsImNhbnZhc0NvbnRhaW5lciIsIm1hcERhdGEiLCJzb2NrZXQiLCJ3b3JsZCIsImxvY2FsUGxheWVyRW50aXR5IiwicGxheWVyRW50aXRpZXMiLCJNYXAiLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibG9jYWxQbGF5ZXJJZCIsImFsbFBsYXllcnMiLCJub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCIsIlN0cmluZyIsInBEYXRhIiwicGxheWVySWQiLCJwbGF5ZXJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJwbGF5ZXJEaXYiLCJjb2xvciIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ3aWxsQ2hhbmdlIiwid2lkdGgiLCJoZWlnaHQiLCJiYWNrZ3JvdW5kU2l6ZSIsInN4Iiwic3kiLCJhZGRDb21wb25lbnQiLCJwbGF5ZXJDb21wIiwibGl2ZXMiLCJtYXhCb21icyIsImJvbWJSYW5nZSIsInNldCIsInVwZGF0ZUh1ZFN0YXRzIiwic2V0dXBJbnB1dCIsIndhcm4iLCJtYXAiLCJyZWdpc3RlclN5c3RlbXMiLCJwZXJmb3JtYW5jZSIsIm5vdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImdhbWVMb29wIiwiaW5wdXQiLCJnZXRDb21wb25lbnQiLCJnZXRLZXlEaXJlY3Rpb24iLCJoYW5kbGVLZXlEb3duIiwiZGlyIiwiaW5jbHVkZXMiLCJjb2RlIiwiZHJvcEJvbWIiLCJoYW5kbGVLZXlVcCIsImQiLCJ3aW5kb3ciLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicG9zIiwiY3VycmVudEJvbWJzIiwicXVlcnkiLCJiRW50aXR5IiwiY3JlYXRlZCIsImNyZWF0ZUJvbWIiLCJyZWFkeVN0YXRlIiwiT1BFTiIsImV4aXN0cyIsInNvbWUiLCJlbnRpdHkiLCJib21iIiwiYm9tYkVudGl0eSIsImJvbWJEaXYiLCJ0b3AiLCJib21iQ29tcCIsIkFycmF5IiwiZnJvbSIsImtleXMiLCJ2ZWwiLCJyZW5kZXJhYmxlIiwicmVtb3ZlUG93ZXJVcEF0IiwiYXBwbHlQb3dlclVwIiwicG93ZXJVcHMiLCJwb3dlclVwIiwicGFyZW50Tm9kZSIsImRlc3Ryb3lFbnRpdHkiLCJ2ZWxvY2l0eSIsInVwZGF0ZU1hcENlbGwiLCJ0aWxlIiwiYmFja2dyb3VuZEltYWdlIiwiZGVzdHJveUJveENhbGxiYWNrIiwiaGFzIiwib25QbGF5ZXJIdXJ0IiwicmVtYWluaW5nTGl2ZXMiLCJvblBvd2VyVXBQaWNrZWQiLCJicm9hZGNhc3RNb3ZlbWVudCIsImFkZFN5c3RlbSIsInciLCJkdCIsInVwZGF0ZSIsIm5leHROb3ciLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsIk1hdGgiLCJyb3VuZCIsImN1cnJlbnRMb2NhbFBsYXllck5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZ2V0UGxheWVyTmFtZSIsImdldEl0ZW0iLCJhZmZlY3RlZENlbGxzIiwiY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMiLCJjZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2IiwiZXhwbG9zaW9ucyIsImV4cCIsImJ4IiwiYnkiLCJjZWxscyIsImRpcmVjdGlvbnMiLCJzdGVwcyIsImkiLCJ0eCIsInR5IiwiY2VsbFR5cGUiLCJwUG9zIiwiaW52aW5jaWJsZVVudGlsIiwiZVBvcyIsInBsYXllckdyaWRYIiwiZmxvb3IiLCJwbGF5ZXJHcmlkWSIsImVudGl0aWVzIiwiZGVsdGEiLCJQTEFZRVJfU0laRSIsImJlaGF2aW9yIiwidGltZWRCb29zdCIsImJlaGF2aW9yQm9vc3QiLCJtb3ZlVG93YXJkVGFyZ2V0IiwiYWN0aXZlSW5wdXQiLCJkeCIsImR5IiwiaGFzSW5wdXQiLCJuZXh0WCIsIm5leHRZIiwic25hcFRocmVzaG9sZCIsImlzQmxvY2tlZCIsImN1cnJlbnRUaWxlWCIsImRpZmZYIiwiYWJzIiwic2lnbiIsImN1cnJlbnRUaWxlWSIsImRpZmZZIiwibmV4dFhBZnRlclNuYXAiLCJuZXh0WUFmdGVyU25hcCIsInN0ZXAiLCJtaW4iLCJwbGF5ZXJTaXplIiwicGFkZGluZyIsImJvdHRvbSIsImlzQmxvY2tlZENlbGwiLCJTUEVFRF9QT1dFUlVQX0FNT1VOVCIsIk1BWF9QTEFZRVJfU1BFRUQiLCJTUEVFRF9QT1dFUlVQX0RVUkFUSU9OIiwiY3VycmVudEJvb3N0IiwibWF4Qm9vc3QiLCJwVXBFbnRpdHkiLCJ1cFBvcyIsInBVcCIsInNlZWQiLCJzZWVkUmFuZG9tIiwic2luIiwidHlwZXMiLCJ0eXBlSW5kZXgiLCJyYW5kb21UeXBlIiwiZGl2IiwiYW5pbVJvd3MiLCJ0YXJnZXRSb3ciLCJmcmFtZUNvdW50IiwiZnJhbWVEZWxheSIsInBvc1giLCJwb3NZIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwidHJhbnNmb3JtIiwibmV4dEVudGl0eUlkIiwiY29tcG9uZW50cyIsInN5c3RlbXMiLCJkZWxldGUiLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50TWFwIiwiZW50cmllcyIsImNvbXBvbmVudERhdGEiLCJyZW1vdmVDb21wb25lbnQiLCJjb21wb25lbnROYW1lcyIsImZpcnN0TWFwIiwicmVzdWx0cyIsImhhc0FsbCIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwiR1JJRF9CT1JERVJfU0laRSIsImltYWdlcyIsInBsYXllck5hbWUiLCJuYW1lRWwiLCJsaXZlc0VsIiwic3BlZWRFbCIsImJvbWJzRWwiLCJyYW5nZUVsIiwiYm9hcmRXaWR0aCIsImJvYXJkSGVpZ2h0IiwiYm9hcmRPdXRlcldpZHRoIiwiYm9hcmRPdXRlckhlaWdodCIsInJvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4Iiwic3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsImdhbWVTdGFydGVkIiwidGltZXJUZXh0IiwicmVwbGF5QnRuIiwicmVsb2FkIiwibWVudUVsIiwic3VibWl0dGVkIiwiZXJyb3JFbCIsInBsYXllckVudGVyIiwiY3VycmVudFRhcmdldCIsInNyYyIsIm11c2ljIiwiQXVkaW8iLCJidXR0b24iLCJpY29uIiwibG9vcCIsInZvbHVtZSIsInRvZ2dsZSIsInVwZGF0ZUJ1dHRvbiIsInBsYXkiLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiXSwic291cmNlUm9vdCI6IiJ9