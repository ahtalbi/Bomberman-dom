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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFHO0lBQ1gsTUFBTU0sT0FBTyxHQUFHLElBQUksQ0FBQ2IsS0FBSyxDQUFDWSxLQUFLLElBQUksSUFBSSxDQUFDWixLQUFLLENBQUNXLE1BQU07SUFFckQsSUFBSSxDQUFDUixJQUFJLENBQUM3VyxTQUFTLEdBQUd1WCxPQUFPLEdBQUcsd0JBQXdCLEdBQUcseUJBQXlCO0lBQ3BGLElBQUksQ0FBQ1gsTUFBTSxDQUFDWSxTQUFTLENBQUNSLE1BQU0sQ0FBQyxVQUFVLEVBQUVPLE9BQU8sQ0FBQztFQUNyRDtBQUNKO0FBRUEsaUVBQWVsWSxLQUFLLEU7Ozs7OztVQ2pEcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvZG9tLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NoYXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9lY3MvY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3dvcmxkLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyIGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBNZW51IGZyb20gXCIuLi9wYWdlcy9tZW51XCI7XG5pbXBvcnQgTG9iYnkgZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiOyBcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo1MDAwXCIpO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5sZXQgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwicm9vbV91cGRhdGVcIjpcbiAgICAgICAgY2FzZSBcImxvYmJ5X3RpbWVyXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuICAgICAgICAgICAgaWYgKCFyb290LnF1ZXJ5U2VsZWN0b3IoXCIuY29uYXRpbmVyLWxvYmJ5XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKDxMb2JieSAvPiwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWQsXG4gICAgICAgICAgICAgICAgcGxheWVyc0NvdW50OiBtZXNzYWdlLnBsYXllcnNDb3VudCxcbiAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogbWVzc2FnZS5zZWNvbmRzTGVmdCxcbiAgICAgICAgICAgICAgICB0ZXh0OiBtZXNzYWdlLnRleHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJnYW1lX3N0YXJ0ZWRcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJnYW1lLXBhZ2VcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVuZGVyKDxHYW1lIGdyaWQ9e21lc3NhZ2UuZ3JpZH0gLz4sIHJvb3QpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsUGxheWVyID0gKG1lc3NhZ2UucGxheWVycyB8fCBbXSkuZmluZChwbGF5ZXIgPT4gcGxheWVyLmlkID09PSBtZXNzYWdlLnlvdXJQbGF5ZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciAmJiBsb2NhbFBsYXllci5uaWNrbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SHVkUGxheWVyTmFtZShsb2NhbFBsYXllci5uaWNrbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmdpbmUgPSBuZXcgR2FtZUVuZ2luZShnYW1lQ29udGFpbmVyLCBtZXNzYWdlLmdyaWQsIHdzcyk7XG4gICAgICAgICAgICAgICAgICAgIGVuZ2luZS5pbml0KG1lc3NhZ2UueW91clBsYXllcklkLCBtZXNzYWdlLnBsYXllcnMgfHwgW10pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBlbmdpbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdhbWUgY29udGFpbmVyIHdhcyBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcInJvb21fYWxvbmVcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgIHJlbmRlcig8TWVudSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2LCB7XG4gICAgICAgICAgICAgICAgbmlja25hbWU6IG1lc3NhZ2Uubmlja25hbWUgfHwgXCJQbGF5ZXJcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLm1lc3NhZ2UsXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBsYXllcl9tb3ZlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlTW92ZShtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib21iX2Ryb3BwZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZUJvbWIobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicG93ZXJ1cF9waWNrZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yXCIsIGVycik7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZWRcIik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgd3NzO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCB3c3MgZnJvbSBcIi4uL2FwcC9hcHBcIjtcblxuY29uc3QgW21lc3NhZ2VzLCBzZXRNZXNzYWdlc10gPSBjcmVhdGVTaWduYWwoW10pO1xuZXhwb3J0IHsgc2V0TWVzc2FnZXMgfTtcblxuZnVuY3Rpb24gQ2hhdFBsYXllcnMoKSB7XG4gICAgY29uc3QgbWVzc2FnZXNDb250YWluZXIgPSA8ZGl2IGNsYXNzPVwibWVzc2FnZXNcIj48L2Rpdj47XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBtc2dzID0gbWVzc2FnZXMoKTtcbiAgICAgICAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBmb3IgKGxldCBtc2cgb2YgbXNncykge1xuICAgICAgICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBtc2cgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBwLnRleHRDb250ZW50ID0gbXNnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwLnRleHRDb250ZW50ID0gYCR7bXNnLm5pY2tuYW1lfTogJHttc2cubWVzc2FnZX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXNDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5yZW1vdmVDaGlsZChtZXNzYWdlc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgbXNncy51bnNoaWZ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZm9ybURhdGEuZ2V0KFwibWVzc2FnZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJjaGF0X21lc3NhZ2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH0pKTtcbiAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdFwiIG9uU3VibWl0PXticm9hZGNhc3RNZXNzYWdlfT5cbiAgICAgICAgICAgIHttZXNzYWdlc0NvbnRhaW5lcn1cbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJ0eXBlIHRvIHRoZSBvdGhlciBwbGF5ZXJzIC4uLlwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVycztcbiIsIi8vIC9zcmMvZWNzL2NvbXBvbmVudHMuanNcblxuZXhwb3J0IGNvbnN0IFBvc2l0aW9uQ29tcG9uZW50ID0gKGd4LCBneSwgdGlsZVNpemUgPSA2NCkgPT4gKHtcbiAgICBncmlkWDogZ3gsXG4gICAgZ3JpZFk6IGd5LFxuICAgIHg6IGd4ICogdGlsZVNpemUsXG4gICAgeTogZ3kgKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRYOiBneCAqIHRpbGVTaXplLFxuICAgIHRhcmdldFk6IGd5ICogdGlsZVNpemVcbn0pO1xuXG5leHBvcnQgY29uc3QgVmVsb2NpdHlDb21wb25lbnQgPSAoYmFzZVNwZWVkID0gMi41KSA9PiAoe1xuICAgIGJhc2VTcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkOiBiYXNlU3BlZWQsXG4gICAgc3BlZWRCb29zdDogMCxcbiAgICBzcGVlZEJvb3N0VGltZVJlbWFpbmluZzogMCxcbiAgICBpc01vdmluZzogZmFsc2UsXG4gICAgZGlyZWN0aW9uOiAnZG93bidcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5wdXRDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGlucHV0UXVldWU6IFtdXG59KTtcblxuZXhwb3J0IGNvbnN0IFJlbmRlcmFibGVDb21wb25lbnQgPSAoZWwsIGZyYW1lV2lkdGggPSA2NCwgZnJhbWVIZWlnaHQgPSA2NCwgdG90YWxGcmFtZXMgPSA0LCBmcHMgPSAxMikgPT4gKHtcbiAgICBlbDogZWwsXG4gICAgZnJhbWVXaWR0aDogZnJhbWVXaWR0aCxcbiAgICBmcmFtZUhlaWdodDogZnJhbWVIZWlnaHQsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiB0b3RhbEZyYW1lcyxcbiAgICBydW5GcmFtZXM6IDQsXG4gICAgaWRsZUZyYW1lczogMixcbiAgICBmcHM6IGZwcyxcbiAgICBpZGxlRnBzOiA0LFxuICAgIGxhc3RGcmFtZVRpbWU6IDAsXG4gICAgcm93OiAwLFxuICAgIHN0YXRlOiAnSURMRScsXG4gICAgbGFzdFN0YXRlOiAnSURMRSdcbn0pO1xuXG5leHBvcnQgY29uc3QgUGxheWVyQ29tcG9uZW50ID0gKGlkLCBjaGFyVHlwZSwgaXNMb2NhbCA9IGZhbHNlKSA9PiAoe1xuICAgIGlkOiBpZCxcbiAgICBjaGFyVHlwZTogY2hhclR5cGUsXG4gICAgaXNMb2NhbDogaXNMb2NhbFxufSk7XG5cbmV4cG9ydCBjb25zdCBCb21iQ29tcG9uZW50ID0gKG93bmVySWQsIHRpbWVyID0gMjAwMCwgcmFuZ2UgPSAyKSA9PiAoe1xuICAgIG93bmVySWQ6IG93bmVySWQsXG4gICAgdGltZXI6IHRpbWVyLFxuICAgIHJhbmdlOiByYW5nZSxcbiAgICBleHBsb2RlZDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgRXhwbG9zaW9uQ29tcG9uZW50ID0gKGR1cmF0aW9uID0gNTAwKSA9PiAoe1xuICAgIGR1cmF0aW9uOiBkdXJhdGlvblxufSk7XG5cbmV4cG9ydCBjb25zdCBQb3dlclVwQ29tcG9uZW50ID0gKHR5cGUpID0+ICh7XG4gICAgdHlwZTogdHlwZSwgXG4gICAgcGlja2VkVXA6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEJlaGF2aW9yQ29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBnaG9zdE1vZGU6IGZhbHNlLFxuICAgIHRocm93YWJsZTogZmFsc2UsXG4gICAgZGV0b25hdG9yOiBmYWxzZSxcbiAgICBmYXN0U2hvZXNMZXZlbDogMSxcbiAgICBib21iczoge1xuICAgICAgICBtYXg6IDEsXG4gICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgIHJhbmdlOiAyXG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQuanMnO1xuaW1wb3J0IHtcbiAgICBQb3NpdGlvbkNvbXBvbmVudCxcbiAgICBWZWxvY2l0eUNvbXBvbmVudCxcbiAgICBJbnB1dENvbXBvbmVudCxcbiAgICBSZW5kZXJhYmxlQ29tcG9uZW50LFxuICAgIFBsYXllckNvbXBvbmVudCxcbiAgICBCb21iQ29tcG9uZW50XG59IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5cbmltcG9ydCB7IG1vdmVtZW50U3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL21vdmVtZW50U3lzdGVtLmpzJztcbmltcG9ydCB7IHJlbmRlclN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgYm9tYlN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9ib21iU3lzdGVtLmpzJztcbmltcG9ydCB7IGRhbWFnZVN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMnO1xuaW1wb3J0IHsgYXBwbHlTcGVlZFBvd2VyVXAsIHBvd2VyVXBTeXN0ZW0sIHNwYXduUG93ZXJVcCB9IGZyb20gJy4vc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzJztcbmltcG9ydCB7IHNldEJvbWJzLCBzZXRMaXZlcywgc2V0UmFuZ2UsIHNldFNwZWVkLCBUSUxFX1NJWkUgfSBmcm9tICcuLi9wYWdlcy9nYW1lJztcblxuY29uc3QgU1BSSVRFX0NPTFVNTlMgPSAxMztcbmNvbnN0IFNQUklURV9ST1dTID0gNTQ7XG5jb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzQ29udGFpbmVyLCBtYXBEYXRhLCBzb2NrZXQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjYW52YXNDb250YWluZXI7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IG1hcERhdGE7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XG4gICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gMDtcbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgaW5pdChsb2NhbFBsYXllcklkLCBhbGxQbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkID0gU3RyaW5nKGxvY2FsUGxheWVySWQpO1xuXG4gICAgICAgIGFsbFBsYXllcnMuZm9yRWFjaChwRGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IFN0cmluZyhwRGF0YS5pZCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IHBEYXRhLmNvbG9yIHx8IFwid2hpdGVcIjtcblxuICAgICAgICAgICAgcGxheWVyRGl2LmNsYXNzTmFtZSA9IGBwbGF5ZXIgcGxheWVyLSR7Y29sb3J9YDtcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuekluZGV4ID0gJzEwJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS53aWxsQ2hhbmdlID0gJ3RyYW5zZm9ybSc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUud2lkdGggPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLmhlaWdodCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBgJHtTUFJJVEVfQ09MVU1OUyAqIFRJTEVfU0laRX1weCAke1NQUklURV9ST1dTICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckRpdik7XG5cbiAgICAgICAgICAgIGNvbnN0IHN4ID0gcERhdGEueCB8fCAxO1xuICAgICAgICAgICAgY29uc3Qgc3kgPSBwRGF0YS55IHx8IDE7XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJywgUG9zaXRpb25Db21wb25lbnQoc3gsIHN5LCBUSUxFX1NJWkUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5JywgVmVsb2NpdHlDb21wb25lbnQoMi41KSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJywgUmVuZGVyYWJsZUNvbXBvbmVudChwbGF5ZXJEaXYsIFRJTEVfU0laRSwgVElMRV9TSVpFLCA0LCAxMilcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzTG9jYWwgPSBwbGF5ZXJJZCA9PT0gbm9ybWFsaXplZExvY2FsUGxheWVySWQ7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJDb21wID0gUGxheWVyQ29tcG9uZW50KHBsYXllcklkLCBjb2xvciwgaXNMb2NhbCk7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmxpdmVzID0gMztcbiAgICAgICAgICAgIHBsYXllckNvbXAubWF4Qm9tYnMgPSAxO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5ib21iUmFuZ2UgPSAyO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJywgcGxheWVyQ29tcCk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzLnNldChwbGF5ZXJJZCwgcGxheWVyRW50aXR5KTtcblxuICAgICAgICAgICAgaWYgKGlzTG9jYWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsUGxheWVyRW50aXR5ID0gcGxheWVyRW50aXR5O1xuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ0lucHV0JywgSW5wdXRDb21wb25lbnQoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyhwbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW0dhbWVFbmdpbmVdIExvY2FsIHBsYXllciB3YXMgbm90IGZvdW5kXCIsIHtcbiAgICAgICAgICAgICAgICBsb2NhbFBsYXllcklkLFxuICAgICAgICAgICAgICAgIHBsYXllcnM6IGFsbFBsYXllcnMubWFwKHBsYXllciA9PiBwbGF5ZXIuaWQpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlZ2lzdGVyU3lzdGVtcygpO1xuXG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobm93KSA9PiB0aGlzLmdhbWVMb29wKG5vdykpO1xuICAgIH1cblxuICAgIHNldHVwSW5wdXQoKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgIGlmICghaW5wdXQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBnZXRLZXlEaXJlY3Rpb24gPSAoa2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dVcCcgfHwga2V5ID09PSAndycgfHwga2V5ID09PSAnWicgfHwga2V5ID09PSAneicpIHJldHVybiAndXAnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93RG93bicgfHwga2V5ID09PSAncycgfHwga2V5ID09PSAnUycpIHJldHVybiAnZG93bic7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dMZWZ0JyB8fCBrZXkgPT09ICdhJyB8fCBrZXkgPT09ICdRJyB8fCBrZXkgPT09ICdxJykgcmV0dXJuICdsZWZ0JztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1JpZ2h0JyB8fCBrZXkgPT09ICdkJyB8fCBrZXkgPT09ICdEJykgcmV0dXJuICdyaWdodCc7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYW5kbGVLZXlEb3duID0gKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICghaW5wdXQuaW5wdXRRdWV1ZS5pbmNsdWRlcyhkaXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUudW5zaGlmdChkaXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnICcgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcEJvbWIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYW5kbGVLZXlVcCA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUgPSBpbnB1dC5pbnB1dFF1ZXVlLmZpbHRlcihkID0+IGQgIT09IGRpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGRyb3BCb21iKCkge1xuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudEJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLmZpbHRlcihiRW50aXR5ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndvcmxkLmdldENvbXBvbmVudChiRW50aXR5LCAnQm9tYicpLm93bmVySWQgPT09IHBsYXllci5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRCb21icy5sZW5ndGggPj0gcGxheWVyLm1heEJvbWJzKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuY3JlYXRlQm9tYihwbGF5ZXIuaWQsIHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBwbGF5ZXIuYm9tYlJhbmdlKTtcbiAgICAgICAgaWYgKCFjcmVhdGVkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnRFJPUF9CT01CJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGlkOiBwbGF5ZXIuaWQsIHg6IHBvcy5ncmlkWCwgeTogcG9zLmdyaWRZLCByYW5nZTogcGxheWVyLmJvbWJSYW5nZSB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVCb21iKG93bmVySWQsIGdyaWRYLCBncmlkWSwgcmFuZ2UpIHtcbiAgICAgICAgY29uc3QgZXhpc3RzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLnNvbWUoZW50aXR5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBib21iID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQm9tYicpO1xuICAgICAgICAgICAgcmV0dXJuIGJvbWIub3duZXJJZCA9PT0gb3duZXJJZCAmJiBwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChleGlzdHMpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBib21iRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgY29uc3QgYm9tYkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBib21iRGl2LmNsYXNzTmFtZSA9ICdib21iJztcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUud2lkdGggPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLmhlaWdodCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUubGVmdCA9IGAke2dyaWRYICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUuekluZGV4ID0gJzYnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChib21iRGl2KTtcblxuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYLCBncmlkWSB9KTtcblxuICAgICAgICBjb25zdCBib21iQ29tcCA9IEJvbWJDb21wb25lbnQob3duZXJJZCwgMjAwMCwgcmFuZ2UpO1xuICAgICAgICBib21iQ29tcC5lbCA9IGJvbWJEaXY7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJywgYm9tYkNvbXApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVNb3ZlKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbaGFuZGxlUmVtb3RlTW92ZV0gSW52YWxpZCBwYXlsb2FkOlwiLCBwYXlsb2FkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIEVudGl0eSBub3QgZm91bmQgZm9yIHBsYXllciAke3BheWxvYWQuaWR9LiBBdmFpbGFibGUgcGxheWVyczpgLCBBcnJheS5mcm9tKHRoaXMucGxheWVyRW50aXRpZXMua2V5cygpKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW2hhbmRsZVJlbW90ZU1vdmVdIElnbm9yaW5nIGxvY2FsIHBsYXllciB1cGRhdGUgZm9yICR7cGF5bG9hZC5pZH1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIXBvcyB8fCAhdmVsIHx8ICFyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBNaXNzaW5nIGNvbXBvbmVudHMgZm9yIHBsYXllciAke3BheWxvYWQuaWR9OmAsIHsgcG9zOiAhIXBvcywgdmVsOiAhIXZlbCwgcmVuZGVyYWJsZTogISFyZW5kZXJhYmxlIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coYFtoYW5kbGVSZW1vdGVNb3ZlXSBVcGRhdGluZyBwbGF5ZXIgJHtwYXlsb2FkLmlkfSB0byAoJHtwYXlsb2FkLmdyaWRYfSwgJHtwYXlsb2FkLmdyaWRZfSlgKTtcbiAgICAgICAgdmVsLmRpcmVjdGlvbiA9IHBheWxvYWQuZGlyZWN0aW9uIHx8IHZlbC5kaXJlY3Rpb247XG4gICAgICAgIHZlbC5pc01vdmluZyA9IHBheWxvYWQuaXNNb3Zpbmc7XG4gICAgICAgIHBvcy5ncmlkWCA9IHBheWxvYWQuZ3JpZFg7XG4gICAgICAgIHBvcy5ncmlkWSA9IHBheWxvYWQuZ3JpZFk7XG4gICAgICAgIHBvcy50YXJnZXRYID0gcGF5bG9hZC54O1xuICAgICAgICBwb3MudGFyZ2V0WSA9IHBheWxvYWQueTtcbiAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9IHBheWxvYWQuc3RhdGUgfHwgKHBheWxvYWQuaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyk7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlQm9tYihwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmNyZWF0ZUJvbWIocGF5bG9hZC5pZCwgcGF5bG9hZC54LCBwYXlsb2FkLnksIHBheWxvYWQucmFuZ2UgfHwgNCk7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCBwYXlsb2FkLnggPT09IHVuZGVmaW5lZCB8fCBwYXlsb2FkLnkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlUG93ZXJVcEF0KHBheWxvYWQueCwgcGF5bG9hZC55KTtcblxuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQgfHwgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5hcHBseVBvd2VyVXAoZW50aXR5LCBwYXlsb2FkLnR5cGUpO1xuICAgIH1cblxuICAgIHJlbW92ZVBvd2VyVXBBdChncmlkWCwgZ3JpZFkpIHtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMuYWRkKGAke2dyaWRYfSwke2dyaWRZfWApO1xuICAgICAgICBjb25zdCBwb3dlclVwcyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBvd2VyVXAgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXBvcyB8fCAhcG93ZXJVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwb3dlclVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChwb3dlclVwLmVsICYmIHBvd2VyVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwb3dlclVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG93ZXJVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlQb3dlclVwKGVudGl0eSwgdHlwZSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgYXBwbHlTcGVlZFBvd2VyVXAodmVsb2NpdHkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTeXN0ZW1zKCkge1xuICAgICAgICBjb25zdCB1cGRhdGVNYXBDZWxsID0gKHgsIHksIG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubWFwRGF0YVt5XSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm1hcERhdGFbeV1beF0gPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gKTtcbiAgICAgICAgICAgIGlmICghdGlsZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aWxlLmNsYXNzTmFtZSA9ICd0aWxlIHRpbGUtZmxvb3InO1xuICAgICAgICAgICAgdGlsZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiKSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZGVzdHJveUJveENhbGxiYWNrID0gKHgsIHkpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYWltZWRQb3dlclVwcy5oYXMoYCR7eH0sJHt5fWApKSByZXR1cm47XG4gICAgICAgICAgICBzcGF3blBvd2VyVXAodGhpcy53b3JsZCwgeCwgeSwgdGhpcy5jb250YWluZXIsIFRJTEVfU0laRSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25QbGF5ZXJIdXJ0ID0gKGVudGl0eSwgaWQsIHJlbWFpbmluZ0xpdmVzKSA9PiB7XG4gICAgICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICAgICAgc2V0TGl2ZXMocmVtYWluaW5nTGl2ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUG93ZXJVcFBpY2tlZCA9IChpZCwgdHlwZSwgeCwgeSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMuYWRkKGAke3h9LCR7eX1gKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICAgICAgaWYgKHBsYXllciAmJiBwbGF5ZXIuaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyh0aGlzLmxvY2FsUGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1dFUlVQX1BJQ0tFRCcsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IHsgaWQsIHR5cGUsIHgsIHkgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLndvcmxkLmJyb2FkY2FzdE1vdmVtZW50ID0gKGVudGl0eSwgeCwgeSwgZ3JpZFgsIGdyaWRZLCBkaXJlY3Rpb24sIGlzTW92aW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIGlmICghcGxheWVyIHx8ICF0aGlzLnNvY2tldCB8fCB0aGlzLnNvY2tldC5yZWFkeVN0YXRlICE9PSBXZWJTb2NrZXQuT1BFTikgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnTU9WRV9TVEFURScsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICAgICAgICBpZDogcGxheWVyLmlkLFxuICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICBncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgaXNNb3ZpbmcsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBpc01vdmluZyA/ICdSVU4nIDogJ0lETEUnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gbW92ZW1lbnRTeXN0ZW0odywgZHQsIG5vdywgdGhpcy5tYXBEYXRhLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGJvbWJTeXN0ZW0odywgZHQsIG5vdywgdGhpcy5tYXBEYXRhLCB1cGRhdGVNYXBDZWxsLCBkZXN0cm95Qm94Q2FsbGJhY2ssIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gZGFtYWdlU3lzdGVtKHcsIG5vdywgb25QbGF5ZXJIdXJ0LCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHBvd2VyVXBTeXN0ZW0odywgb25Qb3dlclVwUGlja2VkKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiByZW5kZXJTeXN0ZW0odywgZHQsIG5vdywgQU5JTUFUSU9OX1JPV1MpKTtcbiAgICB9XG5cbiAgICBnYW1lTG9vcChub3cpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHJldHVybjtcblxuICAgICAgICBjb25zdCBkdCA9IG5vdyAtIHRoaXMubGFzdFRpbWU7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBub3c7XG4gICAgICAgIHRoaXMud29ybGQudXBkYXRlKGR0LCBub3cpO1xuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyh0aGlzLmxvY2FsUGxheWVyRW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChuZXh0Tm93KSA9PiB0aGlzLmdhbWVMb29wKG5leHROb3cpKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlSHVkU3RhdHMoZW50aXR5KSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIHNldEJvbWJzKHBsYXllci5tYXhCb21icyB8fCAxKTtcbiAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzID8/IDMpO1xuICAgICAgICBzZXRSYW5nZShwbGF5ZXIuYm9tYlJhbmdlIHx8IDQpO1xuICAgICAgICBzZXRTcGVlZChNYXRoLnJvdW5kKHZlbG9jaXR5LnNwZWVkKSk7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IFwiXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKG5hbWUpIHtcbiAgICBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gbmFtZTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiLCBuYW1lKTtcbiAgICBjb25zb2xlLmxvZyhcIlBsYXllciByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVwiLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXllck5hbWUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgfHwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIikgfHwgXCJQbGF5ZXJcIjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBib21iU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB1cGRhdGVNYXBDZWxsLCBkZXN0cm95Qm94Q2FsbGJhY2ssIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBib21icyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBib21iRW50aXR5IG9mIGJvbWJzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgYm9tYiA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicpO1xuICAgICAgICBcbiAgICAgICAgYm9tYi50aW1lciAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChib21iLnRpbWVyIDw9IDAgJiYgIWJvbWIuZXhwbG9kZWQpIHtcbiAgICAgICAgICAgIGJvbWIuZXhwbG9kZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBhZmZlY3RlZENlbGxzID0gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMocG9zLmdyaWRYLCBwb3MuZ3JpZFksIGJvbWIucmFuZ2UsIG1hcERhdGEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhZmZlY3RlZENlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgZXhwRGl2LmNsYXNzTmFtZSA9ICdleHBsb3Npb24nO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmxlZnQgPSBgJHtjZWxsLnggKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnRvcCA9IGAke2NlbGwueSAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuekluZGV4ID0gJzcnO1xuXG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFg6IGNlbGwueCwgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZOiBjZWxsLnksIFxuICAgICAgICAgICAgICAgICAgICB4OiBjZWxsLnggKiB0aWxlU2l6ZSwgXG4gICAgICAgICAgICAgICAgICAgIHk6IGNlbGwueSAqIHRpbGVTaXplIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nLCB7IGR1cmF0aW9uOiA1MDAsIGVsOiBleHBEaXYgfSk7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGV4cERpdik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG1hcERhdGFbY2VsbC55XSAmJiBtYXBEYXRhW2NlbGwueV1bY2VsbC54XSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNYXBDZWxsKGNlbGwueCwgY2VsbC55LCAyKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXN0cm95Qm94Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lCb3hDYWxsYmFjayhjZWxsLngsIGNlbGwueSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGJvbWIuZWwgJiYgYm9tYi5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJvbWIuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShib21iRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgY29uc3QgZXhwID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicpO1xuICAgICAgICBleHAuZHVyYXRpb24gLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoZXhwLmR1cmF0aW9uIDw9IDApIHtcbiAgICAgICAgICAgIGlmIChleHAuZWwgJiYgZXhwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBleHAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChleHAuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShleHBFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhieCwgYnksIHJhbmdlLCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbHMgPSBbeyB4OiBieCwgeTogYnkgfV07XG4gICAgY29uc3QgZGlyZWN0aW9ucyA9IFtcbiAgICAgICAgeyB4OiAwLCB5OiAtMSB9LFxuICAgICAgICB7IHg6IDAsIHk6IDEgfSxcbiAgICAgICAgeyB4OiAtMSwgeTogMCB9LFxuICAgICAgICB7IHg6IDEsIHk6IDAgfVxuICAgIF07XG4gICAgXG4gICAgY29uc3Qgc3RlcHMgPSByYW5nZSAtIDE7IFxuICAgIFxuICAgIGRpcmVjdGlvbnMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0eCA9IGJ4ICsgKGRpci54ICogaSk7XG4gICAgICAgICAgICBjb25zdCB0eSA9IGJ5ICsgKGRpci55ICogaSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghbWFwRGF0YVt0eV0gfHwgbWFwRGF0YVt0eV1bdHhdID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjZWxsVHlwZSA9IG1hcERhdGFbdHldW3R4XTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNlbGxzLnB1c2goeyB4OiB0eCwgeTogdHkgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGNlbGxzO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGRhbWFnZVN5c3RlbSh3b3JsZCwgbm93LCBvblBsYXllckh1cnQsIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1BsYXllcicpO1xuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChwbGF5ZXIuaW52aW5jaWJsZVVudGlsICYmIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPiBub3cpIGNvbnRpbnVlO1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICAgICAgY29uc3QgZVBvcyA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyhHcmlkLWJhc2VkIGNvbGxpc2lvbilcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRYID0gTWF0aC5mbG9vcigocFBvcy54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRZID0gTWF0aC5mbG9vcigocFBvcy55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcblxuICAgICAgICAgICAgaWYgKHBsYXllckdyaWRYID09PSBlUG9zLmdyaWRYICYmIHBsYXllckdyaWRZID09PSBlUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5tYXgoKHBsYXllci5saXZlcyA/PyAzKSAtIDEsIDApO1xuICAgICAgICAgICAgICAgIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPSBub3cgKyAxNTAwO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCBwbGF5ZXIubGl2ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBtb3ZlbWVudFN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdGlsZVNpemUgPSA0MCkge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5Jyk7XG4gICAgY29uc3QgZGVsdGEgPSBkdCAvIDE2LjY3O1xuXG4gICAgY29uc3QgUExBWUVSX1NJWkUgPSB0aWxlU2l6ZTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgY29uc3QgYmVoYXZpb3IgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQmVoYXZpb3InKTtcblxuICAgICAgICBpZiAodmVsLnNwZWVkQm9vc3RUaW1lUmVtYWluaW5nID4gMCkge1xuICAgICAgICAgICAgdmVsLnNwZWVkQm9vc3RUaW1lUmVtYWluaW5nID0gTWF0aC5tYXgodmVsLnNwZWVkQm9vc3RUaW1lUmVtYWluaW5nIC0gZHQsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmVsLnNwZWVkQm9vc3QgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGltZWRCb29zdCA9IHZlbC5zcGVlZEJvb3N0VGltZVJlbWFpbmluZyA+IDAgPyB2ZWwuc3BlZWRCb29zdCB8fCAwIDogMDtcbiAgICAgICAgY29uc3QgYmVoYXZpb3JCb29zdCA9IGJlaGF2aW9yID8gKGJlaGF2aW9yLmZhc3RTaG9lc0xldmVsIC0gMSkgKiAwLjUgOiAwO1xuICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkICsgdGltZWRCb29zdCArIGJlaGF2aW9yQm9vc3Q7XG5cbiAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3RpdmVJbnB1dCA9IGlucHV0LmlucHV0UXVldWVbMF07XG4gICAgICAgIGxldCBkeCA9IDA7XG4gICAgICAgIGxldCBkeSA9IDA7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUlucHV0ID09PSAndXAnKSB7XG4gICAgICAgICAgICBkeSA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdkb3duJykge1xuICAgICAgICAgICAgZHkgPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdkb3duJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICBkeCA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgZHggPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdyaWdodCc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNJbnB1dCA9IGR4ICE9PSAwIHx8IGR5ICE9PSAwO1xuXG4gICAgICAgIGlmICghaGFzSW5wdXQpIHtcbiAgICAgICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuICAgICAgICAgICAgdmVsLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdJRExFJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFkgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgY29uc3Qgc25hcFRocmVzaG9sZCA9IDMyO1xuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiBkeCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChwb3MueCwgbmV4dFksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVggPSBNYXRoLmZsb29yKChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WCA9IGN1cnJlbnRUaWxlWCAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZYID0gcG9zLnggLSB0YXJnZXRYO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZYKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeCA9IC1NYXRoLnNpZ24oZGlmZlgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChuZXh0WCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVkgPSBNYXRoLmZsb29yKChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WSA9IGN1cnJlbnRUaWxlWSAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZZID0gcG9zLnkgLSB0YXJnZXRZO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZZKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeSA9IC1NYXRoLnNpZ24oZGlmZlkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYQWZ0ZXJTbmFwID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WUFmdGVyU25hcCA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgIWlzQmxvY2tlZChuZXh0WEFmdGVyU25hcCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy54ID0gbmV4dFhBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgIWlzQmxvY2tlZChwb3MueCwgbmV4dFlBZnRlclNuYXAsIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy55ID0gbmV4dFlBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdSVU4nO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuXG4gICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKSB7XG4gICAgY29uc3Qgc3RlcCA9IHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgaWYgKHBvcy54IDwgcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1pbihwb3MueCArIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9IGVsc2UgaWYgKHBvcy54ID4gcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1heChwb3MueCAtIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9XG5cbiAgICBpZiAocG9zLnkgPCBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWluKHBvcy55ICsgc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH0gZWxzZSBpZiAocG9zLnkgPiBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWF4KHBvcy55IC0gc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH1cblxuICAgIHZlbC5pc01vdmluZyA9XG4gICAgICAgIHBvcy54ICE9PSBwb3MudGFyZ2V0WCB8fFxuICAgICAgICBwb3MueSAhPT0gcG9zLnRhcmdldFk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZCh4LCB5LCBtYXBEYXRhLCB0aWxlU2l6ZSwgcGxheWVyU2l6ZSA9IHRpbGVTaXplKSB7XG4gICAgY29uc3QgcGFkZGluZyA9IDQ7XG5cbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHJpZ2h0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCB0b3AgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgYm90dG9tID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIGJvdHRvbSwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgYm90dG9tLCBtYXBEYXRhKVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZENlbGwoeCwgeSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGwgPSBtYXBEYXRhW3ldICYmIG1hcERhdGFbeV1beF07XG5cbiAgICByZXR1cm4gY2VsbCAhPT0gMCAmJiBjZWxsICE9PSAyO1xufVxuIiwiZXhwb3J0IGNvbnN0IFNQRUVEX1BPV0VSVVBfQU1PVU5UID0gMTtcbmV4cG9ydCBjb25zdCBNQVhfUExBWUVSX1NQRUVEID0gODtcbmV4cG9ydCBjb25zdCBTUEVFRF9QT1dFUlVQX0RVUkFUSU9OID0gNTAwMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5U3BlZWRQb3dlclVwKHZlbG9jaXR5KSB7XG4gICAgY29uc3QgY3VycmVudEJvb3N0ID0gdmVsb2NpdHkuc3BlZWRCb29zdCB8fCAwO1xuICAgIGNvbnN0IG1heEJvb3N0ID0gTWF0aC5tYXgoTUFYX1BMQVlFUl9TUEVFRCAtIHZlbG9jaXR5LmJhc2VTcGVlZCwgMCk7XG4gICAgdmVsb2NpdHkuc3BlZWRCb29zdCA9IE1hdGgubWluKGN1cnJlbnRCb29zdCArIFNQRUVEX1BPV0VSVVBfQU1PVU5ULCBtYXhCb29zdCk7XG4gICAgdmVsb2NpdHkuc3BlZWRCb29zdFRpbWVSZW1haW5pbmcgPSBTUEVFRF9QT1dFUlVQX0RVUkFUSU9OO1xuICAgIHZlbG9jaXR5LnNwZWVkID0gTWF0aC5taW4odmVsb2NpdHkuYmFzZVNwZWVkICsgdmVsb2NpdHkuc3BlZWRCb29zdCwgTUFYX1BMQVlFUl9TUEVFRCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3dlclVwU3lzdGVtKHdvcmxkLCBvblBvd2VyVXBQaWNrZWQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1BsYXllcicpO1xuICAgIGNvbnN0IHBvd2VyVXBzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBQb3MgfHwgIXZlbCB8fCAhcGxheWVyKSBjb250aW51ZTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBVcEVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgdXBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocFVwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBVcCA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXVwUG9zIHx8ICFwVXAgfHwgcFVwLnBpY2tlZFVwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKHBQb3MuZ3JpZFggPT09IHVwUG9zLmdyaWRYICYmIHBQb3MuZ3JpZFkgPT09IHVwUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcFVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChwVXAudHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgICAgICAgICBhcHBseVNwZWVkUG93ZXJVcCh2ZWwpO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0ZMQU1FJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocFVwLmVsICYmIHBVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9uUG93ZXJVcFBpY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICBvblBvd2VyVXBQaWNrZWQocGxheWVyLmlkLCBwVXAudHlwZSwgdXBQb3MuZ3JpZFgsIHVwUG9zLmdyaWRZKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KHBVcEVudGl0eSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7IFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Bhd25Qb3dlclVwKHdvcmxkLCBneCwgZ3ksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IHNlZWQgPSBneCAqIDczODU2MDkzIF4gZ3kgKiAxOTM0OTY2MztcbiAgICBjb25zdCBzZWVkUmFuZG9tID0gKE1hdGguc2luKHNlZWQpICogMTAwMDApIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkKSAqIDEwMDAwKTtcbiAgICBcbiAgICBpZiAoc2VlZFJhbmRvbSA+IDAuMzUpIHJldHVybjtcblxuICAgIGNvbnN0IHR5cGVzID0gWydTUEVFRCcsICdCT01CUycsICdGTEFNRSddO1xuICAgIGNvbnN0IHR5cGVJbmRleCA9IE1hdGguZmxvb3IoKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCkpICogdHlwZXMubGVuZ3RoKTtcbiAgICBjb25zdCByYW5kb21UeXBlID0gdHlwZXNbdHlwZUluZGV4XTtcblxuICAgIGNvbnN0IHBVcEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogdGlsZVNpemUsIHk6IGd5ICogdGlsZVNpemUgfSk7XG4gICAgXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9IGBwb3dlcnVwIHBvd2VydXAtJHtyYW5kb21UeXBlLnRvTG93ZXJDYXNlKCl9YDtcbiAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnRvcCA9IGAke2d5ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcsIHsgdHlwZTogcmFuZG9tVHlwZSwgZWw6IGRpdiB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByZW5kZXJTeXN0ZW0od29ybGQsIGR0LCBub3csIGFuaW1Sb3dzKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUmVuZGVyYWJsZScpO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcblxuICAgICAgICBpZiAoIXJlbmRlcmFibGUuZWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gcmVuZGVyYWJsZS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Um93ID0gYW5pbVJvd3Nbc3RhdGVdW3ZlbC5kaXJlY3Rpb25dO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYW5pbWF0aW9uIHdoZW4gcm93IG9yIHN0YXRlIGNoYW5nZXNcbiAgICAgICAgaWYgKHJlbmRlcmFibGUucm93ICE9PSB0YXJnZXRSb3cgfHwgcmVuZGVyYWJsZS5sYXN0U3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnJvdyA9IHRhcmdldFJvdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdFN0YXRlID0gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcmFtZUNvdW50ID0gc3RhdGUgPT09ICdSVU4nID8gcmVuZGVyYWJsZS5ydW5GcmFtZXMgOiByZW5kZXJhYmxlLmlkbGVGcmFtZXM7XG4gICAgICAgIGNvbnN0IGZyYW1lRGVsYXkgPSBzdGF0ZSA9PT0gJ1JVTicgPyAxMDAwIC8gcmVuZGVyYWJsZS5mcHMgOiAxMDAwIC8gcmVuZGVyYWJsZS5pZGxlRnBzO1xuXG4gICAgICAgIGlmIChub3cgLSByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPiBmcmFtZURlbGF5KSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IChyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSArIDEpICUgZnJhbWVDb3VudDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvc1ggPSAtKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICogcmVuZGVyYWJsZS5mcmFtZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcG9zWSA9IC0ocmVuZGVyYWJsZS5yb3cgKiByZW5kZXJhYmxlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYCR7cG9zWH1weCAke3Bvc1l9cHhgO1xuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3Bvcy54fXB4LCAke3Bvcy55fXB4LCAwKWA7XG4gICAgfVxufVxuIiwiLy8gL3NyYy9lY3Mvd29ybGQuanNcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uZXh0RW50aXR5SWQgPSAwO1xuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgTWFwKCk7IFxuICAgICAgICB0aGlzLnN5c3RlbXMgPSBbXTtcbiAgICB9XG5cbiAgICBjcmVhdGVFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMubmV4dEVudGl0eUlkKys7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkKGVudGl0eSk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVudGl0eShlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgZm9yIChjb25zdCBbY29tcG9uZW50TmFtZSwgY29tcG9uZW50TWFwXSBvZiB0aGlzLmNvbXBvbmVudHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lLCBjb21wb25lbnREYXRhID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHMuaGFzKGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIG5ldyBNYXAoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKS5zZXQoZW50aXR5LCBjb21wb25lbnREYXRhKTtcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRNYXAgPyBjb21wb25lbnRNYXAuZ2V0KGVudGl0eSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBpZiAoY29tcG9uZW50TWFwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBxdWVyeSguLi5jb21wb25lbnROYW1lcykge1xuICAgICAgICBpZiAoY29tcG9uZW50TmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaXJzdE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbMF0pO1xuICAgICAgICBpZiAoIWZpcnN0TWFwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGZpcnN0TWFwLmtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGhhc0FsbCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNvbXBvbmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXAgfHwgIW1hcC5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0FsbCAmJiB0aGlzLmVudGl0aWVzLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkU3lzdGVtKHN5c3RlbUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbUZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZHQsIG5vdykge1xuICAgICAgICBmb3IgKGNvbnN0IHN5c3RlbSBvZiB0aGlzLnN5c3RlbXMpIHtcbiAgICAgICAgICAgIHN5c3RlbSh0aGlzLCBkdCwgbm93KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5leHBvcnQgY29uc3QgVElMRV9TSVpFID0gNDg7XG5jb25zdCBHUklEX0JPUkRFUl9TSVpFID0gNjtcblxuY29uc3QgaW1hZ2VzID0ge1xuICAgIDI6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiLFxuICAgIDM6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX3dhbGwucG5nXCIsXG4gICAgNDogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZXhwbG9pdC5wbmdcIixcbn07XG5cbmNvbnN0IFtwbGF5ZXJOYW1lLCBzZXRQbGF5ZXJOYW1lXSA9IGNyZWF0ZVNpZ25hbChcIlBsYXllciAxXCIpO1xuY29uc3QgW2xpdmVzLCBzZXRMaXZlc10gPSBjcmVhdGVTaWduYWwoMyk7XG5jb25zdCBbc3BlZWQsIHNldFNwZWVkXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtib21icywgc2V0Qm9tYnNdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW3JhbmdlLCBzZXRSYW5nZV0gPSBjcmVhdGVTaWduYWwoMSk7XG5leHBvcnQgeyBzZXRQbGF5ZXJOYW1lLCBzZXRMaXZlcywgc2V0U3BlZWQsIHNldEJvbWJzLCBzZXRSYW5nZSB9O1xuXG5jb25zdCBuYW1lRWwgPSA8c3BhbiBjbGFzcz1cInBsYXllci1uYW1lXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbmFtZUVsLnRleHRDb250ZW50ID0gcGxheWVyTmFtZSgpOyB9KTtcblxuY29uc3QgbGl2ZXNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgbGl2ZXMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3Qgc3BlZWRFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgc3BlZWQtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgYm9tYnNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgYm9tYnMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgcmFuZ2VFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgcmFuZ2UtdmFsdWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBsaXZlc0VsLnRleHRDb250ZW50ID0gbGl2ZXMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBzcGVlZEVsLnRleHRDb250ZW50ID0gc3BlZWQoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBib21ic0VsLnRleHRDb250ZW50ID0gYm9tYnMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyByYW5nZUVsLnRleHRDb250ZW50ID0gcmFuZ2UoKTsgfSk7XG5cbmZ1bmN0aW9uIEdhbWUoeyBncmlkIH0pIHtcbiAgICBjb25zdCBib2FyZFdpZHRoID0gZ3JpZFswXS5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRIZWlnaHQgPSBncmlkLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZE91dGVyV2lkdGggPSBib2FyZFdpZHRoICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3QgYm9hcmRPdXRlckhlaWdodCA9IGJvYXJkSGVpZ2h0ICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBncmlkLmxlbmd0aDsgcm93SW5kZXgrKykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgZ3JpZFtyb3dJbmRleF0ubGVuZ3RoOyBjb2xJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZ3JpZFtyb3dJbmRleF1bY29sSW5kZXhdO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IFwidGlsZVwiO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gYHdpZHRoOiR7VElMRV9TSVpFfXB4O2hlaWdodDoke1RJTEVfU0laRX1weDtgO1xuXG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMiB8fCBjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtZmxvb3JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtd2FsbFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1szXX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzRdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDAgfHwgY2VsbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1syXX0pYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2VsbHMucHVzaCg8ZGl2IGNsYXNzPXtjbGFzc05hbWV9IGRhdGEteD17Y29sSW5kZXh9IGRhdGEteT17cm93SW5kZXh9IHN0eWxlPXtzdHlsZX0+PC9kaXY+KTtcbiAgICAgICAgfVxuICAgICAgICByb3dzLnB1c2goPGRpdiBjbGFzcz1cImdyaWQtcm93XCI+e2NlbGxzfTwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1nbGFzc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1iYXJcIj5cbiAgICAgICAgICAgICAgICAgICAge25hbWVFbH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLXN0YXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkxpdmVzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsaXZlc0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlNwZWVkPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzcGVlZEVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkJvbWJzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib21ic0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlJhbmdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyYW5nZUVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWJvYXJkLWZyYW1lXCIgc3R5bGU9e2B3aWR0aDoke2JvYXJkT3V0ZXJXaWR0aH1weDtoZWlnaHQ6JHtib2FyZE91dGVySGVpZ2h0fXB4O2B9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBpZD1cImdhbWUtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZ2FtZS1ncmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtgcG9zaXRpb246cmVsYXRpdmU7d2lkdGg6JHtib2FyZFdpZHRofXB4O2hlaWdodDoke2JvYXJkSGVpZ2h0fXB4O2B9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCBDaGF0UGxheWVycyBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmxldCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gY3JlYXRlU2lnbmFsKHt9KTtcbmV4cG9ydCB7IHNldFN0YXRlcyB9O1xuXG5sZXQgcm9vbUlkRWwgPSA8cD5Sb29tIElEOiA8L3A+O1xubGV0IHBsYXllcnNFbCA9IDxwPlBsYXllcnM6ICAvIDQ8L3A+O1xubGV0IHRleHRFbCA9IDxwPjwvcD47XG5sZXQgdGltZXJFbCA9IDxwPlRpbWVyOiA8L3A+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHMgPSBzdGF0ZXMoKTtcbiAgICByb29tSWRFbC50ZXh0Q29udGVudCA9IGBSb29tIElEOiAke3Mucm9vbUlkfWA7XG4gICAgcGxheWVyc0VsLnRleHRDb250ZW50ID0gYFBsYXllcnM6ICR7cy5wbGF5ZXJzQ291bnR9IC8gNGA7XG4gICAgdGV4dEVsLnRleHRDb250ZW50ID0gcy50ZXh0IHx8IFwiXCI7XG5cbiAgICBpZiAocy5nYW1lU3RhcnRlZCkge1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gXCJUaW1lcjogR2FtZSBzdGFydGVkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGltZXJUZXh0ID0gKCFzLnNlY29uZHNMZWZ0KSA/IFwiV2FpdGluZyBmb3Igb25lIG1vcmUgcGxheWVyXCIgOiBgJHtzLnNlY29uZHNMZWZ0fSBzZWNvbmRzYDtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IGBUaW1lcjogJHt0aW1lclRleHR9YDtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gTG9iYnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbmF0aW5lci1sb2JieVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYmJ5LWJveFwiPlxuICAgICAgICAgICAgICAgIDxoMT5Mb2JieTwvaDE+XG4gICAgICAgICAgICAgICAge3Jvb21JZEVsfVxuICAgICAgICAgICAgICAgIHtwbGF5ZXJzRWx9XG4gICAgICAgICAgICAgICAge3RleHRFbH1cbiAgICAgICAgICAgICAgICB7dGltZXJFbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPENoYXRQbGF5ZXJzIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG5yZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5sZXQgbWVudUVsID0gKFxuICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICA8aDE+WW91IFdpbiE8L2gxPlxuICAgICAgICA8cD5BbGwgb3RoZXIgcGxheWVycyBoYXZlIGxlZnQgdGhlIGdhbWUuPC9wPlxuICAgICAgICB7cmVwbGF5QnRufVxuICAgIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVudSgpIHtcbiAgICByZXR1cm4gbWVudUVsO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcblxuZnVuY3Rpb24gUmVnaXN0ZXIoeyB3c3MgfSkge1xuICAgIGxldCBzdWJtaXR0ZWQgPSBmYWxzZTtcblxuICAgIGxldCBwbGF5ZXJFbnRlciA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHN1Ym1pdHRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUgfHwgbmlja25hbWUubGVuZ3RoID4gMjApIHJldHVybjtcblxuICAgICAgICBzdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzZXRQbGF5ZXJOYW1lKG5pY2tuYW1lKTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcIm5pY2tuYW1lX29mX3RoZV9wbGF5ZXJcIixcbiAgICAgICAgICAgIG5pY2tuYW1lOiBuaWNrbmFtZVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgb25TdWJtaXQ9e3BsYXllckVudGVyfT5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5pY2tuYW1lLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVudGVyIHlvdXIgbmFtZVwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIHRoaXMubXVzaWMucGxheSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpO1xuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVzaWMucGF1c2VkIHx8IHRoaXMubXVzaWMubXV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvblwiKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVCdXR0b24oKSB7XG4gICAgICAgIGNvbnN0IGlzTXV0ZWQgPSB0aGlzLm11c2ljLm11dGVkIHx8IHRoaXMubXVzaWMucGF1c2VkO1xuXG4gICAgICAgIHRoaXMuaWNvbi5jbGFzc05hbWUgPSBpc011dGVkID8gXCJmYS1zb2xpZCBmYS12b2x1bWUtb2ZmXCIgOiBcImZhLXNvbGlkIGZhLXZvbHVtZS1oaWdoXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1tdXRlZFwiLCBpc011dGVkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvdW5kO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC9hcHAuanNcIik7XG4iLCIiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJwcm9wcyIsImNoaWxkcmVuIiwiZWxlIiwiZG9jdW1lbnQiLCJrZXkiLCJzdGFydHNXaXRoIiwiZXZlbnROYW1lIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRBdHRyaWJ1dGUiLCJmbGF0Q2hpbGRyZW4iLCJmbGF0IiwiSW5maW5pdHkiLCJhcHBlbmQiLCJmaWx0ZXIiLCJjaGlsZCIsInVuZGVmaW5lZCIsInJlbmRlciIsImVsZW1lbnQiLCJjb250YWluZXIiLCJyZXBsYWNlQ2hpbGRyZW4iLCJSb3V0ZXIiLCJyb3V0ZXIiLCJlZmZlY3RTdGFjayIsImFjdGl2ZUVmZmVjdCIsImNyZWF0ZVNpZ25hbCIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwiZWZmZWN0cyIsIlNldCIsIlJlYWQiLCJhZGQiLCJXcml0ZSIsIm5ld1ZhbHVlIiwiZm4iLCJmb3JFYWNoIiwiZWZmZWN0IiwiY3JlYXRlRWZmZWN0IiwicHVzaCIsInBvcCIsImxlbmd0aCIsIlJvdXRlcyIsIk9iamVjdCIsImNyZWF0ZSIsIkZpcnN0UmVzb2x2ZSIsIm9uIiwicGF0aCIsImhhbmRsZXIiLCJuYXZpZ2F0ZSIsImhpc3RvcnkiLCJuYXZpZ2F0aW9uIiwicmVzb2x2ZSIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJ1cmwiLCJVUkwiLCJocmVmIiwibGlzdGVuIiwib25FcnJvcjQwNCIsImV2ZW50IiwiZGVzdGluYXRpb24iLCJpbnRlcmNlcHQiLCJjb25zb2xlIiwibG9nIiwiUmVnaXN0ZXIiLCJHYW1lIiwiTWVudSIsIkxvYmJ5Iiwic2V0U3RhdGVzIiwic2V0UGxheWVyTmFtZSIsInNldEh1ZFBsYXllck5hbWUiLCJTb3VuZCIsInNldE1lc3NhZ2VzIiwiR2FtZUVuZ2luZSIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsInNvdW5kIiwiY3VycmVudEdhbWVFbmdpbmUiLCJpbml0IiwiYm9keSIsImNsYXNzTmFtZSIsImFsZXJ0Iiwid3MiLCJtZXNzYWdlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsInF1ZXJ5U2VsZWN0b3IiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJzZWNvbmRzTGVmdCIsInRleHQiLCJncmlkIiwic2V0VGltZW91dCIsImdhbWVDb250YWluZXIiLCJkZXN0cm95IiwibG9jYWxQbGF5ZXIiLCJwbGF5ZXJzIiwiZmluZCIsInBsYXllciIsImlkIiwieW91clBsYXllcklkIiwibmlja25hbWUiLCJlbmdpbmUiLCJlcnJvciIsInByZXYiLCJoYW5kbGVSZW1vdGVNb3ZlIiwicGF5bG9hZCIsImhhbmRsZVJlbW90ZUJvbWIiLCJoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkIiwiZXJyIiwibWVzc2FnZXMiLCJDaGF0UGxheWVycyIsIm1lc3NhZ2VzQ29udGFpbmVyIiwiY2xhc3MiLCJtc2dzIiwiaW5uZXJIVE1MIiwibXNnIiwicCIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCIsImZpcnN0RWxlbWVudENoaWxkIiwidW5zaGlmdCIsImJyb2FkY2FzdE1lc3NhZ2UiLCJlIiwicHJldmVudERlZmF1bHQiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwidGFyZ2V0IiwiZ2V0IiwidHJpbSIsInJlc2V0Iiwic2VuZCIsInN0cmluZ2lmeSIsIm9uU3VibWl0IiwibmFtZSIsInBsYWNlaG9sZGVyIiwibWF4bGVuZ3RoIiwiUG9zaXRpb25Db21wb25lbnQiLCJneCIsImd5IiwidGlsZVNpemUiLCJncmlkWCIsImdyaWRZIiwieCIsInkiLCJ0YXJnZXRYIiwidGFyZ2V0WSIsIlZlbG9jaXR5Q29tcG9uZW50IiwiYmFzZVNwZWVkIiwic3BlZWQiLCJzcGVlZEJvb3N0Iiwic3BlZWRCb29zdFRpbWVSZW1haW5pbmciLCJpc01vdmluZyIsImRpcmVjdGlvbiIsIklucHV0Q29tcG9uZW50IiwiaW5wdXRRdWV1ZSIsIlJlbmRlcmFibGVDb21wb25lbnQiLCJlbCIsImZyYW1lV2lkdGgiLCJmcmFtZUhlaWdodCIsInRvdGFsRnJhbWVzIiwiZnBzIiwiY3VycmVudEZyYW1lIiwicnVuRnJhbWVzIiwiaWRsZUZyYW1lcyIsImlkbGVGcHMiLCJsYXN0RnJhbWVUaW1lIiwicm93Iiwic3RhdGUiLCJsYXN0U3RhdGUiLCJQbGF5ZXJDb21wb25lbnQiLCJjaGFyVHlwZSIsImlzTG9jYWwiLCJCb21iQ29tcG9uZW50Iiwib3duZXJJZCIsInRpbWVyIiwicmFuZ2UiLCJleHBsb2RlZCIsIkV4cGxvc2lvbkNvbXBvbmVudCIsImR1cmF0aW9uIiwiUG93ZXJVcENvbXBvbmVudCIsInBpY2tlZFVwIiwiQmVoYXZpb3JDb21wb25lbnQiLCJnaG9zdE1vZGUiLCJ0aHJvd2FibGUiLCJkZXRvbmF0b3IiLCJmYXN0U2hvZXNMZXZlbCIsImJvbWJzIiwibWF4IiwiY3VycmVudCIsIldvcmxkIiwibW92ZW1lbnRTeXN0ZW0iLCJyZW5kZXJTeXN0ZW0iLCJib21iU3lzdGVtIiwiZGFtYWdlU3lzdGVtIiwiYXBwbHlTcGVlZFBvd2VyVXAiLCJwb3dlclVwU3lzdGVtIiwic3Bhd25Qb3dlclVwIiwic2V0Qm9tYnMiLCJzZXRMaXZlcyIsInNldFJhbmdlIiwic2V0U3BlZWQiLCJUSUxFX1NJWkUiLCJTUFJJVEVfQ09MVU1OUyIsIlNQUklURV9ST1dTIiwiQU5JTUFUSU9OX1JPV1MiLCJSVU4iLCJ1cCIsImxlZnQiLCJkb3duIiwicmlnaHQiLCJJRExFIiwiY29uc3RydWN0b3IiLCJjYW52YXNDb250YWluZXIiLCJtYXBEYXRhIiwic29ja2V0Iiwid29ybGQiLCJsb2NhbFBsYXllckVudGl0eSIsInBsYXllckVudGl0aWVzIiwiTWFwIiwibGFzdFRpbWUiLCJyZW1vdmVJbnB1dExpc3RlbmVycyIsImFuaW1hdGlvbkZyYW1lIiwicnVubmluZyIsImNsYWltZWRQb3dlclVwcyIsImxvY2FsUGxheWVySWQiLCJhbGxQbGF5ZXJzIiwibm9ybWFsaXplZExvY2FsUGxheWVySWQiLCJTdHJpbmciLCJwRGF0YSIsInBsYXllcklkIiwicGxheWVyRW50aXR5IiwiY3JlYXRlRW50aXR5IiwicGxheWVyRGl2IiwiY29sb3IiLCJzdHlsZSIsInBvc2l0aW9uIiwiekluZGV4Iiwid2lsbENoYW5nZSIsIndpZHRoIiwiaGVpZ2h0IiwiYmFja2dyb3VuZFNpemUiLCJzeCIsInN5IiwiYWRkQ29tcG9uZW50IiwicGxheWVyQ29tcCIsImxpdmVzIiwibWF4Qm9tYnMiLCJib21iUmFuZ2UiLCJzZXQiLCJ1cGRhdGVIdWRTdGF0cyIsInNldHVwSW5wdXQiLCJ3YXJuIiwibWFwIiwicmVnaXN0ZXJTeXN0ZW1zIiwicGVyZm9ybWFuY2UiLCJub3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJnYW1lTG9vcCIsImlucHV0IiwiZ2V0Q29tcG9uZW50IiwiZ2V0S2V5RGlyZWN0aW9uIiwiaGFuZGxlS2V5RG93biIsImRpciIsImluY2x1ZGVzIiwiY29kZSIsImRyb3BCb21iIiwiaGFuZGxlS2V5VXAiLCJkIiwid2luZG93IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInBvcyIsImN1cnJlbnRCb21icyIsInF1ZXJ5IiwiYkVudGl0eSIsImNyZWF0ZWQiLCJjcmVhdGVCb21iIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJleGlzdHMiLCJzb21lIiwiZW50aXR5IiwiYm9tYiIsImJvbWJFbnRpdHkiLCJib21iRGl2IiwidG9wIiwiYm9tYkNvbXAiLCJBcnJheSIsImZyb20iLCJrZXlzIiwidmVsIiwicmVuZGVyYWJsZSIsInJlbW92ZVBvd2VyVXBBdCIsImFwcGx5UG93ZXJVcCIsInBvd2VyVXBzIiwicG93ZXJVcCIsInBhcmVudE5vZGUiLCJkZXN0cm95RW50aXR5IiwidmVsb2NpdHkiLCJ1cGRhdGVNYXBDZWxsIiwidGlsZSIsImJhY2tncm91bmRJbWFnZSIsImRlc3Ryb3lCb3hDYWxsYmFjayIsImhhcyIsIm9uUGxheWVySHVydCIsInJlbWFpbmluZ0xpdmVzIiwib25Qb3dlclVwUGlja2VkIiwiYnJvYWRjYXN0TW92ZW1lbnQiLCJhZGRTeXN0ZW0iLCJ3IiwiZHQiLCJ1cGRhdGUiLCJuZXh0Tm93IiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJNYXRoIiwicm91bmQiLCJjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImdldFBsYXllck5hbWUiLCJnZXRJdGVtIiwiYWZmZWN0ZWRDZWxscyIsImNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzIiwiY2VsbCIsImV4cEVudGl0eSIsImV4cERpdiIsImV4cGxvc2lvbnMiLCJleHAiLCJieCIsImJ5IiwiY2VsbHMiLCJkaXJlY3Rpb25zIiwic3RlcHMiLCJpIiwidHgiLCJ0eSIsImNlbGxUeXBlIiwicFBvcyIsImludmluY2libGVVbnRpbCIsImVQb3MiLCJwbGF5ZXJHcmlkWCIsImZsb29yIiwicGxheWVyR3JpZFkiLCJlbnRpdGllcyIsImRlbHRhIiwiUExBWUVSX1NJWkUiLCJiZWhhdmlvciIsInRpbWVkQm9vc3QiLCJiZWhhdmlvckJvb3N0IiwibW92ZVRvd2FyZFRhcmdldCIsImFjdGl2ZUlucHV0IiwiZHgiLCJkeSIsImhhc0lucHV0IiwibmV4dFgiLCJuZXh0WSIsInNuYXBUaHJlc2hvbGQiLCJpc0Jsb2NrZWQiLCJjdXJyZW50VGlsZVgiLCJkaWZmWCIsImFicyIsInNpZ24iLCJjdXJyZW50VGlsZVkiLCJkaWZmWSIsIm5leHRYQWZ0ZXJTbmFwIiwibmV4dFlBZnRlclNuYXAiLCJzdGVwIiwibWluIiwicGxheWVyU2l6ZSIsInBhZGRpbmciLCJib3R0b20iLCJpc0Jsb2NrZWRDZWxsIiwiU1BFRURfUE9XRVJVUF9BTU9VTlQiLCJNQVhfUExBWUVSX1NQRUVEIiwiU1BFRURfUE9XRVJVUF9EVVJBVElPTiIsImN1cnJlbnRCb29zdCIsIm1heEJvb3N0IiwicFVwRW50aXR5IiwidXBQb3MiLCJwVXAiLCJzZWVkIiwic2VlZFJhbmRvbSIsInNpbiIsInR5cGVzIiwidHlwZUluZGV4IiwicmFuZG9tVHlwZSIsImRpdiIsImFuaW1Sb3dzIiwidGFyZ2V0Um93IiwiZnJhbWVDb3VudCIsImZyYW1lRGVsYXkiLCJwb3NYIiwicG9zWSIsImJhY2tncm91bmRQb3NpdGlvbiIsInRyYW5zZm9ybSIsIm5leHRFbnRpdHlJZCIsImNvbXBvbmVudHMiLCJzeXN0ZW1zIiwiZGVsZXRlIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudE1hcCIsImVudHJpZXMiLCJjb21wb25lbnREYXRhIiwicmVtb3ZlQ29tcG9uZW50IiwiY29tcG9uZW50TmFtZXMiLCJmaXJzdE1hcCIsInJlc3VsdHMiLCJoYXNBbGwiLCJzeXN0ZW1GdW5jdGlvbiIsInN5c3RlbSIsIkdSSURfQk9SREVSX1NJWkUiLCJpbWFnZXMiLCJwbGF5ZXJOYW1lIiwibmFtZUVsIiwibGl2ZXNFbCIsInNwZWVkRWwiLCJib21ic0VsIiwicmFuZ2VFbCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImJvYXJkT3V0ZXJXaWR0aCIsImJvYXJkT3V0ZXJIZWlnaHQiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJnYW1lU3RhcnRlZCIsInRpbWVyVGV4dCIsInJlcGxheUJ0biIsInJlbG9hZCIsIm1lbnVFbCIsInN1Ym1pdHRlZCIsInBsYXllckVudGVyIiwiY3VycmVudFRhcmdldCIsInNyYyIsIm11c2ljIiwiQXVkaW8iLCJidXR0b24iLCJpY29uIiwibG9vcCIsInZvbHVtZSIsInRvZ2dsZSIsInVwZGF0ZUJ1dHRvbiIsInBsYXkiLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiXSwic291cmNlUm9vdCI6IiJ9