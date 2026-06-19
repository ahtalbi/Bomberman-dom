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
/* harmony import */ var _pages_WinMenu_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pages/WinMenu.jsx */ "./src/pages/WinMenu.jsx");
/* harmony import */ var _utils_sound__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/sound */ "./src/utils/sound.js");
/* harmony import */ var _components_chat__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/chat */ "./src/components/chat.jsx");
/* harmony import */ var _ecs_game_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../ecs/game.js */ "./src/ecs/game.js");












const root = document.getElementById("root");
const wss = new WebSocket(`ws://${window.location.hostname}:5000`);
const sound = new _utils_sound__WEBPACK_IMPORTED_MODULE_7__["default"]("./assets/sounds/background_music.mp3");
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
          const engine = new _ecs_game_js__WEBPACK_IMPORTED_MODULE_9__.GameEngine(gameContainer, message.grid, wss);
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
    case "game_won":
      if (currentGameEngine) {
        currentGameEngine.destroy();
      }
      document.body.className = "menu-page";
      (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_WinMenu_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        winnerName: message.winnerName
      }), root);
      break;
    case "chat_message":
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_8__.setMessages)(prev => [...prev, message.message]);
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
    case "item_picked":
      // Handle remote heart pickup - update the player's lives on all clients
      if (currentGameEngine) {
        currentGameEngine.handleRemoteItemPickup(message.payload);
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
/* harmony import */ var _pages_WinMenu_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pages/WinMenu.jsx */ "./src/pages/WinMenu.jsx");
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

  /**
   * Handles remote heart pickup - updates player lives and UI on all clients
   * @param {Object} payload - { playerId, newLives }
   */
  handleRemoteItemPickup(payload) {
    if (!payload || !payload.playerId || payload.newLives === undefined) return;
    const entity = this.playerEntities.get(String(payload.playerId));
    if (entity === undefined) return;
    const player = this.world.getComponent(entity, 'Player');
    if (!player) return;

    // Update the player's lives
    player.lives = payload.newLives;

    // Update HUD if this is the local player
    if (entity === this.localPlayerEntity) {
      this.updateHudStats(entity);
    }
    console.log(`[Remote Item Pickup] Player ${payload.playerId} picked up heart. New lives: ${payload.newLives}`);
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
          type: type === 'HEART' ? 'ITEM_PICKUP' : 'POWERUP_PICKED',
          payload: type === 'HEART' ? {
            playerId: id,
            newLives: playerComp ? playerComp.lives : 0,
            x,
            y
          } : {
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
    (0,_mini_framework_dom_js__WEBPACK_IMPORTED_MODULE_7__.render)(createElement(_pages_WinMenu_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
      winnerName: winnerName
    }), root);
  }

  /**
   * Checks game end conditions with proper state flag management.
   * Prevents the "Loop Trap" - modal is only rendered ONCE when lives reach 0.
   * Also disables input immediately when player dies.
   */

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

/***/ "./src/pages/WinMenu.jsx"
/*!*******************************!*\
  !*** ./src/pages/WinMenu.jsx ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WinMenu)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");

function WinMenu(props) {
  const winnerName = props.winnerName || "A Player";
  const replayBtn = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    class: "replay-button"
  }, "Play Again");
  replayBtn.addEventListener("click", () => {
    // This hard reload is a reliable way to reset the game state and return to the start.
    location.reload();
  });
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "menu-box"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, winnerName.toUpperCase(), " WON!"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "The last player standing takes the crown."), replayBtn);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUN4RCxJQUFJLENBQUM2YyxJQUFJLENBQUMsQ0FBQztJQUNmLENBQUMsTUFBTTtNQUNILElBQUksQ0FBQ1AsS0FBSyxDQUFDYSxLQUFLLEdBQUcsSUFBSTtNQUN2QixJQUFJLENBQUNYLE1BQU0sQ0FBQ3hjLFlBQVksQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDO01BQ3ZELElBQUksQ0FBQytjLFlBQVksQ0FBQyxDQUFDO0lBQ3ZCO0VBQ0o7RUFFQUEsWUFBWUEsQ0FBQSxFQUFHO0lBQ1gsTUFBTUssT0FBTyxHQUFHLElBQUksQ0FBQ2QsS0FBSyxDQUFDYSxLQUFLLElBQUksSUFBSSxDQUFDYixLQUFLLENBQUNZLE1BQU07SUFFckQsSUFBSSxDQUFDVCxJQUFJLENBQUM3WCxTQUFTLEdBQUd3WSxPQUFPLEdBQUcsd0JBQXdCLEdBQUcseUJBQXlCO0lBQ3BGLElBQUksQ0FBQ1osTUFBTSxDQUFDYSxTQUFTLENBQUNULE1BQU0sQ0FBQyxVQUFVLEVBQUVRLE9BQU8sQ0FBQztFQUNyRDtBQUNKO0FBRUEsaUVBQWVyWixLQUFLLEU7Ozs7OztVQ25EcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvZG9tLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NoYXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9lY3MvY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3dvcmxkLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9XaW5NZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvZ2FtZS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2xvYmJ5LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL3JlZ2lzdGVyLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvc291bmQuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIHByb3BzLCAuLi5jaGlsZHJlbikge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiB0eXBlKHsgLi4uKHByb3BzIHx8IHt9KSwgY2hpbGRyZW4gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzIHx8IHt9KSB7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChcIm9uXCIpICYmIHR5cGVvZiBwcm9wc1trZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGtleS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZS5zZXRBdHRyaWJ1dGUoa2V5LCBwcm9wc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZsYXRDaGlsZHJlbiA9IGNoaWxkcmVuLmZsYXQoSW5maW5pdHkpO1xuICAgIGVsZS5hcHBlbmQoLi4uZmxhdENoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gbnVsbCAmJiBjaGlsZCAhPT0gdW5kZWZpbmVkICYmIGNoaWxkICE9PSBmYWxzZSkpO1xuXG4gICAgcmV0dXJuIGVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICBjb250YWluZXIucmVwbGFjZUNoaWxkcmVuKGVsZW1lbnQpO1xufVxuIiwiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4vcm91dGVyLmpzXCI7XG5cbmxldCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjsiLCJjb25zdCBlZmZlY3RTdGFjayA9IFtdO1xubGV0IGFjdGl2ZUVmZmVjdCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaWduYWwoaW5pdGlhbFZhbHVlKSB7XG4gICBsZXQgdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICBjb25zdCBlZmZlY3RzID0gbmV3IFNldCgpO1xuXG4gICBjb25zdCBSZWFkID0gKCkgPT4ge1xuICAgICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgICAgZWZmZWN0cy5hZGQoYWN0aXZlRWZmZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgIH1cblxuICAgY29uc3QgV3JpdGUgPSAobmV3VmFsdWUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgbGV0IGZuID0gbmV3VmFsdWU7XG4gICAgICAgICB2YWx1ZSA9IGZuKHZhbHVlKTtcbiAgICAgIH0gXG4gICAgICBlbHNlIHZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBlZmZlY3RzLmZvckVhY2goZWZmZWN0ID0+IGVmZmVjdCgpKTtcbiAgIH1cblxuICAgcmV0dXJuIFtSZWFkLCBXcml0ZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFZmZlY3QoZWZmZWN0KSB7XG4gICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3Q7XG4gICBlZmZlY3QoKTtcbiAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbn1cbiIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgICNSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICNGaXJzdFJlc29sdmUgPSBmYWxzZTtcblxuICAgIG9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy4jUm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFxuICAgIG5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSA9IFwicHVzaFwiIH0gPSB7fSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBcIi9cIiArIHBhdGg7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzb2x2ZShwYXRoID0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbcGF0aF07XG5cbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm4oeyB1cmw6IG5ldyBVUkwobG9jYXRpb24uaHJlZikgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxpc3RlbihvbkVycm9yNDA0KSB7XG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5pbnRlcmNlcHQoe1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLnBhdGhuYW1lLCB0aGlzLiNSb3V0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3VybC5wYXRobmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I0MDQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbih7IHVybCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNGaXJzdFJlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdGhpcy4jRmlyc3RSZXNvbHZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgcmVuZGVyIH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmtcIjtcbmltcG9ydCBSZWdpc3RlciBmcm9tIFwiLi4vcGFnZXMvcmVnaXN0ZXJcIjtcbmltcG9ydCBHYW1lIGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgTWVudSBmcm9tIFwiLi4vcGFnZXMvbWVudVwiO1xuaW1wb3J0IExvYmJ5IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IFdpbk1lbnUgZnJvbSBcIi4uL3BhZ2VzL1dpbk1lbnUuanN4XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiOyBcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoYHdzOi8vJHt3aW5kb3cubG9jYXRpb24uaG9zdG5hbWV9OjUwMDBgKTtcbmNvbnN0IHNvdW5kID0gbmV3IFNvdW5kKFwiLi9hc3NldHMvc291bmRzL2JhY2tncm91bmRfbXVzaWMubXAzXCIpO1xubGV0IGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcblxuc291bmQuaW5pdCgpO1xuXG5yb3V0ZXIub24oXCIvXCIsICgpID0+IHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwicmVnaXN0ZXItcGFnZVwiO1xuICAgIHJlbmRlcig8UmVnaXN0ZXIgd3NzPXt3c3N9IC8+LCByb290KTtcbn0pO1xuXG5yb3V0ZXIubGlzdGVuKCgpID0+IHsgYWxlcnQoXCI0MDRcIikgfSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCAod3MpID0+IHtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInJvb21fdXBkYXRlXCI6XG4gICAgICAgIGNhc2UgXCJsb2JieV90aW1lclwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImxvYmJ5LXBhZ2VcIjtcbiAgICAgICAgICAgIGlmICghcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmNvbmF0aW5lci1sb2JieVwiKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcig8TG9iYnkgLz4sIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogbWVzc2FnZS5wbGF5ZXJzQ291bnQsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IG1lc3NhZ2Uuc2Vjb25kc0xlZnQsXG4gICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZ2FtZV9zdGFydGVkXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwiZ2FtZS1wYWdlXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlbmRlcig8R2FtZSBncmlkPXttZXNzYWdlLmdyaWR9IC8+LCByb290KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFBsYXllciA9IChtZXNzYWdlLnBsYXllcnMgfHwgW10pLmZpbmQocGxheWVyID0+IHBsYXllci5pZCA9PT0gbWVzc2FnZS55b3VyUGxheWVySWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxQbGF5ZXIgJiYgbG9jYWxQbGF5ZXIubmlja25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEh1ZFBsYXllck5hbWUobG9jYWxQbGF5ZXIubmlja25hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5naW5lID0gbmV3IEdhbWVFbmdpbmUoZ2FtZUNvbnRhaW5lciwgbWVzc2FnZS5ncmlkLCB3c3MpO1xuICAgICAgICAgICAgICAgICAgICBlbmdpbmUuaW5pdChtZXNzYWdlLnlvdXJQbGF5ZXJJZCwgbWVzc2FnZS5wbGF5ZXJzIHx8IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gZW5naW5lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJHYW1lIGNvbnRhaW5lciB3YXMgbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJyb29tX2Fsb25lXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPE1lbnUgLz4sIHJvb3QpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfd29uXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPFdpbk1lbnUgd2lubmVyTmFtZT17bWVzc2FnZS53aW5uZXJOYW1lfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2ICxtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpdGVtX3BpY2tlZFwiOlxuICAgICAgICAgICAgLy8gSGFuZGxlIHJlbW90ZSBoZWFydCBwaWNrdXAgLSB1cGRhdGUgdGhlIHBsYXllcidzIGxpdmVzIG9uIGFsbCBjbGllbnRzXG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVJdGVtUGlja3VwKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvclwiLCBlcnIpO1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdzcztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgd3NzIGZyb20gXCIuLi9hcHAvYXBwXCI7XG5cbmNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gY3JlYXRlU2lnbmFsKFtdKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzIH07XG5cbmZ1bmN0aW9uIENoYXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IG1lc3NhZ2VzQ29udGFpbmVyID0gPGRpdiBjbGFzcz1cIm1lc3NhZ2VzXCI+PC9kaXY+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNncyA9IG1lc3NhZ2VzKCk7XG4gICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgbXNnIG9mIG1zZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBtc2c7XG4gICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG1lc3NhZ2VzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBtc2dzLnVuc2hpZnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBmb3JtRGF0YS5nZXQoXCJtZXNzYWdlXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcImNoYXRfbWVzc2FnZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgfSkpO1xuICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0XCIgb25TdWJtaXQ9e2Jyb2FkY2FzdE1lc3NhZ2V9PlxuICAgICAgICAgICAge21lc3NhZ2VzQ29udGFpbmVyfVxuICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1lc3NhZ2VcIiBwbGFjZWhvbGRlcj1cInR5cGUgdG8gdGhlIG90aGVyIHBsYXllcnMgLi4uXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXRQbGF5ZXJzOyIsIi8vIC9zcmMvZWNzL2NvbXBvbmVudHMuanNcblxuZXhwb3J0IGNvbnN0IFBvc2l0aW9uQ29tcG9uZW50ID0gKGd4LCBneSwgdGlsZVNpemUgPSA2NCkgPT4gKHtcbiAgICBncmlkWDogZ3gsXG4gICAgZ3JpZFk6IGd5LFxuICAgIHg6IGd4ICogdGlsZVNpemUsXG4gICAgeTogZ3kgKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRYOiBneCAqIHRpbGVTaXplLFxuICAgIHRhcmdldFk6IGd5ICogdGlsZVNpemVcbn0pO1xuXG5leHBvcnQgY29uc3QgVmVsb2NpdHlDb21wb25lbnQgPSAoYmFzZVNwZWVkID0gMi41KSA9PiAoe1xuICAgIGJhc2VTcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkOiBiYXNlU3BlZWQsXG4gICAgaXNNb3Zpbmc6IGZhbHNlLFxuICAgIGRpcmVjdGlvbjogJ2Rvd24nXG59KTtcblxuZXhwb3J0IGNvbnN0IElucHV0Q29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBpbnB1dFF1ZXVlOiBbXVxufSk7XG5cbmV4cG9ydCBjb25zdCBSZW5kZXJhYmxlQ29tcG9uZW50ID0gKGVsLCBmcmFtZVdpZHRoID0gNjQsIGZyYW1lSGVpZ2h0ID0gNjQsIHRvdGFsRnJhbWVzID0gNCwgZnBzID0gMTIpID0+ICh7XG4gICAgZWw6IGVsLFxuICAgIGZyYW1lV2lkdGg6IGZyYW1lV2lkdGgsXG4gICAgZnJhbWVIZWlnaHQ6IGZyYW1lSGVpZ2h0LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogdG90YWxGcmFtZXMsXG4gICAgcnVuRnJhbWVzOiA0LFxuICAgIGlkbGVGcmFtZXM6IDIsXG4gICAgZnBzOiBmcHMsXG4gICAgaWRsZUZwczogNCxcbiAgICBsYXN0RnJhbWVUaW1lOiAwLFxuICAgIHJvdzogMCxcbiAgICBzdGF0ZTogJ0lETEUnLFxuICAgIGxhc3RTdGF0ZTogJ0lETEUnXG59KTtcblxuZXhwb3J0IGNvbnN0IFBsYXllckNvbXBvbmVudCA9IChpZCwgY2hhclR5cGUsIGlzTG9jYWwgPSBmYWxzZSkgPT4gKHtcbiAgICBpZDogaWQsXG4gICAgY2hhclR5cGU6IGNoYXJUeXBlLFxuICAgIGlzTG9jYWw6IGlzTG9jYWxcbn0pO1xuXG5leHBvcnQgY29uc3QgQm9tYkNvbXBvbmVudCA9IChvd25lcklkLCB0aW1lciA9IDIwMDAsIHJhbmdlID0gNCkgPT4gKHtcbiAgICBvd25lcklkOiBvd25lcklkLFxuICAgIHRpbWVyOiB0aW1lcixcbiAgICByYW5nZTogcmFuZ2UsXG4gICAgZXhwbG9kZWQ6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEV4cGxvc2lvbkNvbXBvbmVudCA9IChkdXJhdGlvbiA9IDUwMCkgPT4gKHtcbiAgICBkdXJhdGlvbjogZHVyYXRpb25cbn0pO1xuXG5leHBvcnQgY29uc3QgUG93ZXJVcENvbXBvbmVudCA9ICh0eXBlKSA9PiAoe1xuICAgIHR5cGU6IHR5cGUsIFxuICAgIHBpY2tlZFVwOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBCZWhhdmlvckNvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgZ2hvc3RNb2RlOiBmYWxzZSxcbiAgICB0aHJvd2FibGU6IGZhbHNlLFxuICAgIGRldG9uYXRvcjogZmFsc2UsXG4gICAgZmFzdFNob2VzTGV2ZWw6IDEsXG4gICAgYm9tYnM6IHtcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICByYW5nZTogMlxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkLmpzJztcbmltcG9ydCB7XG4gICAgUG9zaXRpb25Db21wb25lbnQsXG4gICAgVmVsb2NpdHlDb21wb25lbnQsXG4gICAgSW5wdXRDb21wb25lbnQsXG4gICAgUmVuZGVyYWJsZUNvbXBvbmVudCxcbiAgICBQbGF5ZXJDb21wb25lbnQsXG4gICAgQm9tYkNvbXBvbmVudFxufSBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuaW1wb3J0IHsgbW92ZW1lbnRTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyc7XG5pbXBvcnQgeyBib21iU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgZGFtYWdlU3lzdGVtLCBjaGVja0dhbWVFbmRDb25kaXRpb25zLCBzcGF3bkhlYXJ0UG93ZXJVcCB9IGZyb20gJy4vc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMnO1xuaW1wb3J0IFdpbk1lbnUgZnJvbSAnLi4vcGFnZXMvV2luTWVudS5qc3gnO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tLmpzJztcblxuaW1wb3J0IHsgcG93ZXJVcFN5c3RlbSwgc3Bhd25Qb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMnO1xuaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQgfSBmcm9tICcuLi9wYWdlcy9nYW1lJztcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzQ29udGFpbmVyLCBtYXBEYXRhLCBzb2NrZXQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjYW52YXNDb250YWluZXI7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IG1hcERhdGE7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XG4gICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnBsYXllckluZm8gPSBuZXcgTWFwKCk7IC8vIFN0b3JlIG9yaWdpbmFsIHBsYXllciBkYXRhIGxpa2Ugbmlja25hbWVcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IDA7XG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzID0gbmV3IFNldCgpO1xuICAgICAgICAvLyBTdGF0ZSBmbGFnIHRvIHByZXZlbnQgbXVsdGlwbGUgbG9zcyBtb2RhbCByZW5kZXJzIChUaGUgTG9vcCBUcmFwIGZpeClcbiAgICAgICAgdGhpcy5sb3NzTW9kYWxUcmlnZ2VyZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gRmxhZyB0byB0cmFjayBpZiBpbnB1dCBzaG91bGQgYmUgZGlzYWJsZWRcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAvLyBGbGFnIHRvIHN0b3AgdGhlIGdhbWUgbG9vcCBvbmNlIGEgd2lubmVyIGlzIGRlY2lkZWRcbiAgICAgICAgdGhpcy5nYW1lRW5kZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0KGxvY2FsUGxheWVySWQsIGFsbFBsYXllcnMpIHtcbiAgICAgICAgdGhpcy50b3RhbFBsYXllcnMgPSBhbGxQbGF5ZXJzLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZExvY2FsUGxheWVySWQgPSBTdHJpbmcobG9jYWxQbGF5ZXJJZCk7XG5cbiAgICAgICAgYWxsUGxheWVycy5mb3JFYWNoKHBEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gU3RyaW5nKHBEYXRhLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckluZm8uc2V0KHBsYXllcklkLCBwRGF0YSk7IC8vIFN0b3JlIG9yaWdpbmFsIHBsYXllciBkYXRhXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcERhdGEuY29sb3IgfHwgXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gYHBsYXllciBwbGF5ZXItJHtjb2xvcn1gO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS56SW5kZXggPSAnMTAnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckRpdik7XG5cbiAgICAgICAgICAgIGNvbnN0IHN4ID0gcERhdGEueCB8fCAxO1xuICAgICAgICAgICAgY29uc3Qgc3kgPSBwRGF0YS55IHx8IDE7XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJywgUG9zaXRpb25Db21wb25lbnQoc3gsIHN5LCBUSUxFX1NJWkUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5JywgVmVsb2NpdHlDb21wb25lbnQoMi41KSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJywgUmVuZGVyYWJsZUNvbXBvbmVudChwbGF5ZXJEaXYsIDY0LCA2NCwgNCwgMTIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpc0xvY2FsID0gcGxheWVySWQgPT09IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IFBsYXllckNvbXBvbmVudChwbGF5ZXJJZCwgY29sb3IsIGlzTG9jYWwpO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5saXZlcyA9IDM7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLm1heEJvbWJzID0gMTtcbiAgICAgICAgICAgIHBsYXllckNvbXAuYm9tYlJhbmdlID0gNDtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicsIHBsYXllckNvbXApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcy5zZXQocGxheWVySWQsIHBsYXllckVudGl0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc0xvY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcsIElucHV0Q29tcG9uZW50KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMocGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltHYW1lRW5naW5lXSBMb2NhbCBwbGF5ZXIgd2FzIG5vdCBmb3VuZFwiLCB7XG4gICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXJJZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzOiBhbGxQbGF5ZXJzLm1hcChwbGF5ZXIgPT4gcGxheWVyLmlkKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlclN5c3RlbXMoKTtcblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5vdykgPT4gdGhpcy5nYW1lTG9vcChub3cpKTtcbiAgICB9XG5cbiAgICBzZXR1cElucHV0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZ2V0S2V5RGlyZWN0aW9uID0gKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93VXAnIHx8IGtleSA9PT0gJ3cnIHx8IGtleSA9PT0gJ1onIHx8IGtleSA9PT0gJ3onKSByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93TGVmdCcgfHwga2V5ID09PSAnYScgfHwga2V5ID09PSAnUScgfHwga2V5ID09PSAncScpIHJldHVybiAnbGVmdCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dSaWdodCcgfHwga2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpIHJldHVybiAncmlnaHQnO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgICAgICAgICAvLyBJTlBVVCBESVNBQkxFRDogSW1tZWRpYXRlbHkgaWdub3JlIGFsbCBrZXlib2FyZCBpbnB1dHMgd2hlbiBwbGF5ZXIgaXMgZGVhZFxuICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0RW5hYmxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlLnVuc2hpZnQoZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICAgICAgLy8gSU5QVVQgRElTQUJMRUQ6IEltbWVkaWF0ZWx5IGlnbm9yZSBhbGwga2V5Ym9hcmQgaW5wdXRzIHdoZW4gcGxheWVyIGlzIGRlYWRcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dEVuYWJsZWQpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkcm9wQm9tYigpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRCb21icyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5maWx0ZXIoYkVudGl0eSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoYkVudGl0eSwgJ0JvbWInKS5vd25lcklkID09PSBwbGF5ZXIuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjdXJyZW50Qm9tYnMubGVuZ3RoID49IHBsYXllci5tYXhCb21icykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUJvbWIocGxheWVyLmlkLCBwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgcGxheWVyLmJvbWJSYW5nZSk7XG4gICAgICAgIGlmICghY3JlYXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0RST1BfQk9NQicsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZDogcGxheWVyLmlkLCB4OiBwb3MuZ3JpZFgsIHk6IHBvcy5ncmlkWSwgcmFuZ2U6IHBsYXllci5ib21iUmFuZ2UgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiBib21iLm93bmVySWQgPT09IG93bmVySWQgJiYgcG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuZWwgPSBib21iRGl2O1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicsIGJvbWJDb21wKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlTW92ZShwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW2hhbmRsZVJlbW90ZU1vdmVdIEludmFsaWQgcGF5bG9hZDpcIiwgcGF5bG9hZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBFbnRpdHkgbm90IGZvdW5kIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfS4gQXZhaWxhYmxlIHBsYXllcnM6YCwgQXJyYXkuZnJvbSh0aGlzLnBsYXllckVudGl0aWVzLmtleXMoKSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtoYW5kbGVSZW1vdGVNb3ZlXSBJZ25vcmluZyBsb2NhbCBwbGF5ZXIgdXBkYXRlIGZvciAke3BheWxvYWQuaWR9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwb3MgfHwgIXZlbCB8fCAhcmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gVXBkYXRpbmcgcGxheWVyICR7cGF5bG9hZC5pZH0gdG8gKCR7cGF5bG9hZC5ncmlkWH0sICR7cGF5bG9hZC5ncmlkWX0pYCk7XG4gICAgICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgICAgICBwb3MuZ3JpZFggPSBwYXlsb2FkLmdyaWRYO1xuICAgICAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgICAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwYXlsb2FkLnk7XG4gICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZUJvbWIocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDQpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgcGF5bG9hZC54ID09PSB1bmRlZmluZWQgfHwgcGF5bG9hZC55ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnJlbW92ZVBvd2VyVXBBdChwYXlsb2FkLngsIHBheWxvYWQueSk7XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkIHx8IGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYXBwbHlQb3dlclVwKGVudGl0eSwgcGF5bG9hZC50eXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHJlbW90ZSBoZWFydCBwaWNrdXAgLSB1cGRhdGVzIHBsYXllciBsaXZlcyBhbmQgVUkgb24gYWxsIGNsaWVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIHsgcGxheWVySWQsIG5ld0xpdmVzIH1cbiAgICAgKi9cbiAgICBoYW5kbGVSZW1vdGVJdGVtUGlja3VwKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLnBsYXllcklkIHx8IHBheWxvYWQubmV3TGl2ZXMgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLnBsYXllcklkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBsYXllcikgcmV0dXJuO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgcGxheWVyJ3MgbGl2ZXNcbiAgICAgICAgcGxheWVyLmxpdmVzID0gcGF5bG9hZC5uZXdMaXZlcztcblxuICAgICAgICAvLyBVcGRhdGUgSFVEIGlmIHRoaXMgaXMgdGhlIGxvY2FsIHBsYXllclxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKGVudGl0eSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW1JlbW90ZSBJdGVtIFBpY2t1cF0gUGxheWVyICR7cGF5bG9hZC5wbGF5ZXJJZH0gcGlja2VkIHVwIGhlYXJ0LiBOZXcgbGl2ZXM6ICR7cGF5bG9hZC5uZXdMaXZlc31gKTtcbiAgICB9XG5cbiAgICByZW1vdmVQb3dlclVwQXQoZ3JpZFgsIGdyaWRZKSB7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHtncmlkWH0sJHtncmlkWX1gKTtcbiAgICAgICAgY29uc3QgcG93ZXJVcHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwb3dlclVwID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCFwb3MgfHwgIXBvd2VyVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcG93ZXJVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAocG93ZXJVcC5lbCAmJiBwb3dlclVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG93ZXJVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvd2VyVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UG93ZXJVcChlbnRpdHksIHR5cGUpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdTUEVFRCcpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5LnNwZWVkID0gTWF0aC5taW4odmVsb2NpdHkuc3BlZWQgKyAxLCA4KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAvLyBIRUFSVCBwb3dlci11cDogaW5jcmVtZW50IGxpdmVzIChjYXAgYXQgMylcbiAgICAgICAgICAgIHBsYXllci5saXZlcyA9IE1hdGgubWluKChwbGF5ZXIubGl2ZXMgfHwgMCkgKyAxLCAzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVyU3lzdGVtcygpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlTWFwQ2VsbCA9ICh4LCB5LCBuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm1hcERhdGFbeV0pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5tYXBEYXRhW3ldW3hdID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCk7XG4gICAgICAgICAgICBpZiAoIXRpbGUpIHJldHVybjtcblxuICAgICAgICAgICAgdGlsZS5jbGFzc05hbWUgPSAndGlsZSB0aWxlLWZsb29yJztcbiAgICAgICAgICAgIHRpbGUuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybChcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIiknO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGRlc3Ryb3lCb3hDYWxsYmFjayA9ICh4LCB5KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGFpbWVkUG93ZXJVcHMuaGFzKGAke3h9LCR7eX1gKSkgcmV0dXJuO1xuICAgICAgICAgICAgc3Bhd25Qb3dlclVwKHRoaXMud29ybGQsIHgsIHksIHRoaXMuY29udGFpbmVyLCBUSUxFX1NJWkUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUGxheWVySHVydCA9IChlbnRpdHksIGlkLCByZW1haW5pbmdMaXZlcykgPT4ge1xuICAgICAgICAgICAgLy8gQ1JJVElDQUw6IE9ubHkgc2VuZCBwbGF5ZXJfZGllZCBpZiBUSElTIElTIFRIRSBMT0NBTCBQTEFZRVIuXG4gICAgICAgICAgICAvLyBUaGUgRUNTIGRhbWFnZVN5c3RlbSBydW5zIG9uIEFMTCBjbGllbnRzLCBzbyBldmVyeSBjbGllbnQgZGV0ZWN0c1xuICAgICAgICAgICAgLy8gZXZlcnkgY29sbGlzaW9uLiBXZSBtdXN0IGd1YXJkIHRoZSBXZWJTb2NrZXQgbWVzc2FnZSB0byBwcmV2ZW50XG4gICAgICAgICAgICAvLyBpbmNvcnJlY3QgZGVhdGggcmVwb3J0cy5cbiAgICAgICAgICAgIGlmIChyZW1haW5pbmdMaXZlcyA8PSAwICYmIGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSAmJiB0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGxheWVyX2RpZWQnXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBIVUQgb25seSBmb3IgdGhlIGxvY2FsIHBsYXllci5cbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICBzZXRMaXZlcyhyZW1haW5pbmdMaXZlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25Qb3dlclVwUGlja2VkID0gKGlkLCB0eXBlLCB4LCB5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7eH0sJHt5fWApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcoaWQpKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckNvbXAgPSBlbnRpdHkgPyB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKSA6IG51bGw7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllckNvbXAgJiYgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHNldExpdmVzKHBsYXllckNvbXAubGl2ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllckNvbXAgJiYgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHModGhpcy5sb2NhbFBsYXllckVudGl0eSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZSA9PT0gJ0hFQVJUJyA/ICdJVEVNX1BJQ0tVUCcgOiAnUE9XRVJVUF9QSUNLRUQnLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB0eXBlID09PSAnSEVBUlQnXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHsgcGxheWVySWQ6IGlkLCBuZXdMaXZlczogcGxheWVyQ29tcCA/IHBsYXllckNvbXAubGl2ZXMgOiAwLCB4LCB5IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDogeyBpZCwgdHlwZSwgeCwgeSB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYnJvYWRjYXN0TW92ZW1lbnQgPSAoZW50aXR5LCB4LCB5LCBncmlkWCwgZ3JpZFksIGRpcmVjdGlvbiwgaXNNb3ZpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXRoaXMuc29ja2V0IHx8IHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdNT1ZFX1NUQVRFJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBwbGF5ZXIuaWQsXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBncmlkWSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICBpc01vdmluZyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IGlzTW92aW5nID8gJ1JVTicgOiAnSURMRScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBtb3ZlbWVudFN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gYm9tYlN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBkYW1hZ2VTeXN0ZW0odGhpcy53b3JsZCwgbm93LCBvblBsYXllckh1cnQsIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksIFRJTEVfU0laRSwgdGhpcy5zb2NrZXQpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHBvd2VyVXBTeXN0ZW0odywgb25Qb3dlclVwUGlja2VkKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiByZW5kZXJTeXN0ZW0odywgZHQsIG5vdywgQU5JTUFUSU9OX1JPV1MpKTtcbiAgICB9XG5cbiAgICBnYW1lTG9vcChub3cpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHJldHVybjtcblxuICAgICAgICBjb25zdCBkdCA9IG5vdyAtIHRoaXMubGFzdFRpbWU7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBub3c7XG4gICAgICAgIHRoaXMud29ybGQudXBkYXRlKGR0LCBub3cpO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5leHROb3cpID0+IHRoaXMuZ2FtZUxvb3AobmV4dE5vdykpO1xuICAgIH1cblxuICAgIGhhbmRsZUdhbWVPdmVyKHdpbm5lck5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZUVuZGVkKSByZXR1cm47IC8vIFByZXZlbnQgbXVsdGlwbGUgdHJpZ2dlcnNcbiAgICAgICAgdGhpcy5nYW1lRW5kZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcblxuICAgICAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSAnbWVudS1wYWdlJztcbiAgICAgICAgcmVuZGVyKDxXaW5NZW51IHdpbm5lck5hbWU9e3dpbm5lck5hbWV9IC8+LCByb290KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgZ2FtZSBlbmQgY29uZGl0aW9ucyB3aXRoIHByb3BlciBzdGF0ZSBmbGFnIG1hbmFnZW1lbnQuXG4gICAgICogUHJldmVudHMgdGhlIFwiTG9vcCBUcmFwXCIgLSBtb2RhbCBpcyBvbmx5IHJlbmRlcmVkIE9OQ0Ugd2hlbiBsaXZlcyByZWFjaCAwLlxuICAgICAqIEFsc28gZGlzYWJsZXMgaW5wdXQgaW1tZWRpYXRlbHkgd2hlbiBwbGF5ZXIgZGllcy5cbiAgICAgKi9cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVIdWRTdGF0cyhlbnRpdHkpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgc2V0Qm9tYnMocGxheWVyLm1heEJvbWJzIHx8IDEpO1xuICAgICAgICBzZXRMaXZlcyhwbGF5ZXIubGl2ZXMgPz8gMyk7XG4gICAgICAgIHNldFJhbmdlKHBsYXllci5ib21iUmFuZ2UgfHwgNCk7XG4gICAgICAgIHNldFNwZWVkKE1hdGgucm91bmQodmVsb2NpdHkuc3BlZWQpKTtcbiAgICB9XG59XG5cbmxldCBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gXCJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFBsYXllck5hbWUobmFtZSkge1xuICAgIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBuYW1lO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIsIG5hbWUpO1xuICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5XCIsIG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGxheWVyTmFtZSgpIHtcbiAgICByZXR1cm4gY3VycmVudExvY2FsUGxheWVyTmFtZSB8fCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiKSB8fCBcIlBsYXllclwiO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGJvbWJTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IGJvbWJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IGJvbWJFbnRpdHkgb2YgYm9tYnMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBib21iID0gd29ybGQuZ2V0Q29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJyk7XG4gICAgICAgIFxuICAgICAgICBib21iLnRpbWVyIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGJvbWIudGltZXIgPD0gMCAmJiAhYm9tYi5leHBsb2RlZCkge1xuICAgICAgICAgICAgYm9tYi5leHBsb2RlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGFmZmVjdGVkQ2VsbHMgPSBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgYm9tYi5yYW5nZSwgbWFwRGF0YSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFmZmVjdGVkQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBleHBEaXYuY2xhc3NOYW1lID0gJ2V4cGxvc2lvbic7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUubGVmdCA9IGAke2NlbGwueCAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUudG9wID0gYCR7Y2VsbC55ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS56SW5kZXggPSAnNyc7XG5cbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nLCB7IFxuICAgICAgICAgICAgICAgICAgICBncmlkWDogY2VsbC54LCBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFk6IGNlbGwueSwgXG4gICAgICAgICAgICAgICAgICAgIHg6IGNlbGwueCAqIHRpbGVTaXplLCBcbiAgICAgICAgICAgICAgICAgICAgeTogY2VsbC55ICogdGlsZVNpemUgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicsIHsgZHVyYXRpb246IDUwMCwgZWw6IGV4cERpdiB9KTtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZXhwRGl2KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAobWFwRGF0YVtjZWxsLnldICYmIG1hcERhdGFbY2VsbC55XVtjZWxsLnhdID09PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZU1hcENlbGwoY2VsbC54LCBjZWxsLnksIDIpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc3Ryb3lCb3hDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveUJveENhbGxiYWNrKGNlbGwueCwgY2VsbC55KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYm9tYi5lbCAmJiBib21iLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYm9tYi5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KGJvbWJFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICBjb25zdCBleHAgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJyk7XG4gICAgICAgIGV4cC5kdXJhdGlvbiAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChleHAuZHVyYXRpb24gPD0gMCkge1xuICAgICAgICAgICAgaWYgKGV4cC5lbCAmJiBleHAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGV4cC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGV4cC5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KGV4cEVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKGJ4LCBieSwgcmFuZ2UsIG1hcERhdGEpIHtcbiAgICBjb25zdCBjZWxscyA9IFt7IHg6IGJ4LCB5OiBieSB9XTtcbiAgICBjb25zdCBkaXJlY3Rpb25zID0gW1xuICAgICAgICB7IHg6IDAsIHk6IC0xIH0sXG4gICAgICAgIHsgeDogMCwgeTogMSB9LFxuICAgICAgICB7IHg6IC0xLCB5OiAwIH0sXG4gICAgICAgIHsgeDogMSwgeTogMCB9XG4gICAgXTtcbiAgICBcbiAgICBjb25zdCBzdGVwcyA9IHJhbmdlIC0gMTsgXG4gICAgXG4gICAgZGlyZWN0aW9ucy5mb3JFYWNoKGRpciA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gYnggKyAoZGlyLnggKiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHR5ID0gYnkgKyAoZGlyLnkgKiBpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFtYXBEYXRhW3R5XSB8fCBtYXBEYXRhW3R5XVt0eF0gPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNlbGxUeXBlID0gbWFwRGF0YVt0eV1bdHhdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2VsbHMucHVzaCh7IHg6IHR4LCB5OiB0eSB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gY2VsbHM7XG59XG4iLCIvKipcbiAqIFNwYXducyBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgc3BlY2lmaWVkIGdyaWQgY29vcmRpbmF0ZXMuXG4gKiBUaGlzIGNyZWF0ZXMgYSBwcm9wZXIgRUNTIGVudGl0eSB3aXRoIFBvc2l0aW9uLCBQb3dlclVwLCBhbmQgUmVuZGVyYWJsZSBjb21wb25lbnRzLlxuICogXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gZ3JpZFggLSBHcmlkIFggY29vcmRpbmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGdyaWRZIC0gR3JpZCBZIGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBnYW1lIGNvbnRhaW5lciBlbGVtZW50XG4gKiBAcGFyYW0ge251bWJlcn0gdGlsZVNpemUgLSBUaGUgc2l6ZSBvZiBlYWNoIGdyaWQgdGlsZSAoZGVmYXVsdDogNjQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGF3bkhlYXJ0UG93ZXJVcCh3b3JsZCwgZ3JpZFgsIGdyaWRZLCBjb250YWluZXIsIHRpbGVTaXplID0gNjQpIHtcbiAgICAvLyBDcmVhdGUgYSBuZXcgZW50aXR5IGZvciB0aGUgaGVhcnQgcG93ZXItdXBcbiAgICBjb25zdCBoZWFydEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIFxuICAgIC8vIEFkZCBQb3NpdGlvbiBjb21wb25lbnRcbiAgICB3b3JsZC5hZGRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3NpdGlvbicsIHtcbiAgICAgICAgZ3JpZFg6IGdyaWRYLFxuICAgICAgICBncmlkWTogZ3JpZFksXG4gICAgICAgIHg6IGdyaWRYICogdGlsZVNpemUsXG4gICAgICAgIHk6IGdyaWRZICogdGlsZVNpemVcbiAgICB9KTtcbiAgICBcbiAgICAvLyBBZGQgUG93ZXJVcCBjb21wb25lbnQgd2l0aCB0eXBlICdIRUFSVCdcbiAgICB3b3JsZC5hZGRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3dlclVwJywge1xuICAgICAgICB0eXBlOiAnSEVBUlQnLFxuICAgICAgICBwaWNrZWRVcDogZmFsc2UsXG4gICAgICAgIGVsOiBudWxsICAvLyBXaWxsIGJlIHNldCBhZnRlciBjcmVhdGluZyB0aGUgRE9NIGVsZW1lbnRcbiAgICB9KTtcbiAgICBcbiAgICAvLyBDcmVhdGUgdGhlIERPTSBlbGVtZW50IGZvciByZW5kZXJpbmdcbiAgICBjb25zdCBoZWFydERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYXJ0RGl2LmNsYXNzTmFtZSA9ICdwb3dlcnVwIHBvd2VydXAtaGVhcnQnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBoZWFydERpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgaGVhcnREaXYuc3R5bGUuYWxpZ25JdGVtcyA9ICdjZW50ZXInO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuZm9udFNpemUgPSAnMzJweCc7XG4gICAgaGVhcnREaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIGhlYXJ0RGl2LnRleHRDb250ZW50ID0gJ+KdpO+4jyc7XG4gICAgXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhlYXJ0RGl2KTtcbiAgICBcbiAgICAvLyBVcGRhdGUgdGhlIFBvd2VyVXAgY29tcG9uZW50IHdpdGggdGhlIERPTSBlbGVtZW50IHJlZmVyZW5jZVxuICAgIGNvbnN0IHBvd2VyVXAgPSB3b3JsZC5nZXRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3dlclVwJyk7XG4gICAgaWYgKHBvd2VyVXApIHtcbiAgICAgICAgcG93ZXJVcC5lbCA9IGhlYXJ0RGl2O1xuICAgIH1cbiAgICBcbiAgICBjb25zb2xlLmxvZyhgW0hlYXJ0IERyb3BdIFNwYXduZWQgSEVBUlQgcG93ZXItdXAgYXQgKCR7Z3JpZFh9LCAke2dyaWRZfSlgKTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHBsYXllciBkZWF0aCB0cmFuc2l0aW9uIHdoZW4gbGl2ZXMgcmVhY2ggMC5cbiAqIFJlbW92ZXMgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGFuZCBzcGF3bnMgYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIGRlYXRoIGxvY2F0aW9uLlxuICpcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJFbnRpdHkgLSBUaGUgZW50aXR5IElEIG9mIHRoZSBkeWluZyBwbGF5ZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBnYW1lIGNvbnRhaW5lciBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplID0gNjQsIGNvbnRhaW5lciA9IG51bGwpIHtcbiAgICAvLyBHZXQgdGhlIHBsYXllcidzIGNvbXBvbmVudHNcbiAgICBjb25zdCBwb3NpdGlvbiA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcblxuICAgIGlmICghcG9zaXRpb24gfHwgIXJlbmRlcmFibGUgfHwgIXBsYXllcikgcmV0dXJuO1xuXG4gICAgLy8gU3RvcmUgdGhlIGdyaWQgY29vcmRpbmF0ZXMgd2hlcmUgdGhlIHBsYXllciBkaWVkXG4gICAgY29uc3QgZGVhdGhHcmlkWCA9IE1hdGguZmxvb3IoKHBvc2l0aW9uLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgIGNvbnN0IGRlYXRoR3JpZFkgPSBNYXRoLmZsb29yKChwb3NpdGlvbi55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcblxuICAgIC8vIENSSVRJQ0FMOiBSZW1vdmUgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGZyb20gdGhlIGRvY3VtZW50IEJFRk9SRSByZW1vdmluZyB0aGUgUmVuZGVyYWJsZSBjb21wb25lbnQuXG4gICAgLy8gVGhpcyBlbnN1cmVzIHRoZSBkZWFkIHBsYXllciB2aXN1YWxseSBkaXNhcHBlYXJzIGltbWVkaWF0ZWx5LlxuICAgIGlmIChyZW5kZXJhYmxlLmVsICYmIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocmVuZGVyYWJsZS5lbCk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGNvbXBvbmVudHMgdGhhdCBlbmFibGUgaW50ZXJhY3Rpb24gYW5kIHJlbmRlcmluZy5cbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgIC8vIFdlIGtlZXAgUG9zaXRpb24gYW5kIFBsYXllciBjb21wb25lbnRzIHRvIGtub3cgd2hlcmUgdGhleSB3ZXJlLlxuXG4gICAgLy8gU3Bhd24gYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIGRlYXRoIGxvY2F0aW9uIChwcm9wZXIgRUNTIGVudGl0eSlcbiAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgIHNwYXduSGVhcnRQb3dlclVwKHdvcmxkLCBkZWF0aEdyaWRYLCBkZWF0aEdyaWRZLCBnYW1lQ29udGFpbmVyLCB0aWxlU2l6ZSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYFtQbGF5ZXIgRGVhdGhdIFBsYXllciAke3BsYXllci5pZH0gZGllZCBhdCAoJHtkZWF0aEdyaWRYfSwgJHtkZWF0aEdyaWRZfSkuIEhlYXJ0IHBvd2VyLXVwIGRyb3BwZWQuYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYW1hZ2VTeXN0ZW0od29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCBsb2NhbFBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgc29ja2V0KSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQbGF5ZXInKTtcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAocGxheWVyLmludmluY2libGVVbnRpbCAmJiBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID4gbm93KSBjb250aW51ZTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gR3JpZC1iYXNlZCBjb2xsaXNpb25cbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRYID0gTWF0aC5mbG9vcigocFBvcy54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRZID0gTWF0aC5mbG9vcigocFBvcy55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcblxuICAgICAgICAgICAgaWYgKHBsYXllckdyaWRYID09PSBlUG9zLmdyaWRYICYmIHBsYXllckdyaWRZID09PSBlUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNMaXZlcyA9IHBsYXllci5saXZlcyA/PyAzO1xuICAgICAgICAgICAgICAgIHBsYXllci5saXZlcyA9IE1hdGgubWF4KHByZXZpb3VzTGl2ZXMgLSAxLCAwKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID0gbm93ICsgMTUwMDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcGxheWVyIGlzIGRlYWQsIHJlcG9ydCBkZWF0aCBPTkNFIHVzaW5nIGd1YXJkIGNsYXVzZVxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIubGl2ZXMgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGxheWVyLmFscmVhZHlSZXBvcnRlZERlYWQpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYWxyZWFkeVJlcG9ydGVkRGVhZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uUGxheWVySHVydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVQbGF5ZXJEZWF0aCh3b3JsZCwgcGxheWVyRW50aXR5LCB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUGxheWVyIHN0aWxsIGFsaXZlLCByZXBvcnQgbm9ybWFsIGRhbWFnZVxuICAgICAgICAgICAgICAgICAgICBpZiAob25QbGF5ZXJIdXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblBsYXllckh1cnQocGxheWVyRW50aXR5LCBwbGF5ZXIuaWQsIHBsYXllci5saXZlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQnJlYWsgdGhlIGxvb3Agc2luY2UgdGhlIHBsYXllciBoYXMgYWxyZWFkeSB0YWtlbiBkYW1hZ2UgZnJvbSB0aGlzIGV4cGxvc2lvbi5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgZnVuY3Rpb24gbW92ZW1lbnRTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHRpbGVTaXplID0gNDApIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScpO1xuICAgIGNvbnN0IGRlbHRhID0gZHQgLyAxNi42NztcblxuICAgIGNvbnN0IFBMQVlFUl9TSVpFID0gdGlsZVNpemU7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgIGNvbnN0IGJlaGF2aW9yID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JlaGF2aW9yJyk7XG5cbiAgICAgICAgaWYgKGJlaGF2aW9yKSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkICsgKGJlaGF2aW9yLmZhc3RTaG9lc0xldmVsIC0gMSkgKiAwLjU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3RpdmVJbnB1dCA9IGlucHV0LmlucHV0UXVldWVbMF07XG4gICAgICAgIGxldCBkeCA9IDA7XG4gICAgICAgIGxldCBkeSA9IDA7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUlucHV0ID09PSAndXAnKSB7XG4gICAgICAgICAgICBkeSA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdkb3duJykge1xuICAgICAgICAgICAgZHkgPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdkb3duJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICBkeCA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgZHggPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdyaWdodCc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNJbnB1dCA9IGR4ICE9PSAwIHx8IGR5ICE9PSAwO1xuXG4gICAgICAgIGlmICghaGFzSW5wdXQpIHtcbiAgICAgICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuICAgICAgICAgICAgdmVsLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdJRExFJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFkgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgY29uc3Qgc25hcFRocmVzaG9sZCA9IDMyO1xuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiBkeCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChwb3MueCwgbmV4dFksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVggPSBNYXRoLmZsb29yKChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WCA9IGN1cnJlbnRUaWxlWCAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZYID0gcG9zLnggLSB0YXJnZXRYO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZYKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeCA9IC1NYXRoLnNpZ24oZGlmZlgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChuZXh0WCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVkgPSBNYXRoLmZsb29yKChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WSA9IGN1cnJlbnRUaWxlWSAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZZID0gcG9zLnkgLSB0YXJnZXRZO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZZKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeSA9IC1NYXRoLnNpZ24oZGlmZlkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYQWZ0ZXJTbmFwID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WUFmdGVyU25hcCA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgIWlzQmxvY2tlZChuZXh0WEFmdGVyU25hcCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy54ID0gbmV4dFhBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgIWlzQmxvY2tlZChwb3MueCwgbmV4dFlBZnRlclNuYXAsIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy55ID0gbmV4dFlBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdSVU4nO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuXG4gICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKSB7XG4gICAgY29uc3Qgc3RlcCA9IHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgaWYgKHBvcy54IDwgcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1pbihwb3MueCArIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9IGVsc2UgaWYgKHBvcy54ID4gcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1heChwb3MueCAtIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9XG5cbiAgICBpZiAocG9zLnkgPCBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWluKHBvcy55ICsgc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH0gZWxzZSBpZiAocG9zLnkgPiBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWF4KHBvcy55IC0gc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH1cblxuICAgIHZlbC5pc01vdmluZyA9XG4gICAgICAgIHBvcy54ICE9PSBwb3MudGFyZ2V0WCB8fFxuICAgICAgICBwb3MueSAhPT0gcG9zLnRhcmdldFk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZCh4LCB5LCBtYXBEYXRhLCB0aWxlU2l6ZSwgcGxheWVyU2l6ZSA9IHRpbGVTaXplKSB7XG4gICAgY29uc3QgcGFkZGluZyA9IDQ7XG5cbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHJpZ2h0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCB0b3AgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgYm90dG9tID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIGJvdHRvbSwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgYm90dG9tLCBtYXBEYXRhKVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZENlbGwoeCwgeSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGwgPSBtYXBEYXRhW3ldICYmIG1hcERhdGFbeV1beF07XG5cbiAgICByZXR1cm4gY2VsbCAhPT0gMCAmJiBjZWxsICE9PSAyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHBvd2VyVXBTeXN0ZW0od29ybGQsIG9uUG93ZXJVcFBpY2tlZCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUGxheWVyJyk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcFBvcyB8fCAhdmVsIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcFVwRW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCB1cFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcFVwID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghdXBQb3MgfHwgIXBVcCB8fCBwVXAucGlja2VkVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAvLyBHcmlkLWJhc2VkIGNvbGxpc2lvbjogcGxheWVyIGdyaWQgcG9zaXRpb24gbWF0Y2hlcyBwb3dlci11cCBncmlkIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAocFBvcy5ncmlkWCA9PT0gdXBQb3MuZ3JpZFggJiYgcFBvcy5ncmlkWSA9PT0gdXBQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIGRpZmZlcmVudCBwb3dlci11cCB0eXBlc1xuICAgICAgICAgICAgICAgIGlmIChwVXAudHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgICAgICAgICB2ZWwuc3BlZWQgPSBNYXRoLm1pbih2ZWwuc3BlZWQgKyAxLCA4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0hFQVJUJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHBvd2VyLXVwJ3MgRE9NIGVsZW1lbnQgZnJvbSB0aGUgc2NyZWVuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC5lbCAmJiBwVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE5vdGlmeSBnYW1lLmpzIHZpYSBjYWxsYmFjayAoaGFuZGxlcyBIVUQgdXBkYXRlICsgc2VydmVyIHN5bmMpXG4gICAgICAgICAgICAgICAgLy8gQ1JJVElDQUw6IFRoaXMgdHJpZ2dlcnMgdXBkYXRlSHVkU3RhdHMsIE5PVCBvblBsYXllckh1cnRcbiAgICAgICAgICAgICAgICBpZiAob25Qb3dlclVwUGlja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uUG93ZXJVcFBpY2tlZChwbGF5ZXIuaWQsIHBVcC50eXBlLCB1cFBvcy5ncmlkWCwgdXBQb3MuZ3JpZFkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIERlc3Ryb3kgdGhlIHBvd2VyLXVwIGVudGl0eSBmcm9tIHRoZSB3b3JsZCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkocFVwRW50aXR5KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0hFQVJUIERFU1RST1lFRF0gSGVhcnQgZW50aXR5IHJlbW92ZWQgZnJvbSB3b3JsZCBhdCAoJHt1cFBvcy5ncmlkWH0sICR7dXBQb3MuZ3JpZFl9KWApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Bhd25Qb3dlclVwKHdvcmxkLCBneCwgZ3ksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IHNlZWQgPSBneCAqIDczODU2MDkzIF4gZ3kgKiAxOTM0OTY2MztcbiAgICBjb25zdCBzZWVkUmFuZG9tID0gKE1hdGguc2luKHNlZWQpICogMTAwMDApIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkKSAqIDEwMDAwKTtcbiAgICBcbiAgICBpZiAoc2VlZFJhbmRvbSA+IDAuMzUpIHJldHVybjtcblxuICAgIGNvbnN0IHR5cGVzID0gWydTUEVFRCcsICdCT01CUycsICdGTEFNRSddO1xuICAgIGNvbnN0IHR5cGVJbmRleCA9IE1hdGguZmxvb3IoKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCkpICogdHlwZXMubGVuZ3RoKTtcbiAgICBjb25zdCByYW5kb21UeXBlID0gdHlwZXNbdHlwZUluZGV4XTtcblxuICAgIGNvbnN0IHBVcEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogdGlsZVNpemUsIHk6IGd5ICogdGlsZVNpemUgfSk7XG4gICAgXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9IGBwb3dlcnVwIHBvd2VydXAtJHtyYW5kb21UeXBlLnRvTG93ZXJDYXNlKCl9YDtcbiAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnRvcCA9IGAke2d5ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcsIHsgdHlwZTogcmFuZG9tVHlwZSwgZWw6IGRpdiB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByZW5kZXJTeXN0ZW0od29ybGQsIGR0LCBub3csIGFuaW1Sb3dzKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUmVuZGVyYWJsZScpO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcblxuICAgICAgICBpZiAoIXJlbmRlcmFibGUuZWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gcmVuZGVyYWJsZS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Um93ID0gYW5pbVJvd3Nbc3RhdGVdW3ZlbC5kaXJlY3Rpb25dO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYW5pbWF0aW9uIHdoZW4gcm93IG9yIHN0YXRlIGNoYW5nZXNcbiAgICAgICAgaWYgKHJlbmRlcmFibGUucm93ICE9PSB0YXJnZXRSb3cgfHwgcmVuZGVyYWJsZS5sYXN0U3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnJvdyA9IHRhcmdldFJvdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdFN0YXRlID0gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcmFtZUNvdW50ID0gc3RhdGUgPT09ICdSVU4nID8gcmVuZGVyYWJsZS5ydW5GcmFtZXMgOiByZW5kZXJhYmxlLmlkbGVGcmFtZXM7XG4gICAgICAgIGNvbnN0IGZyYW1lRGVsYXkgPSBzdGF0ZSA9PT0gJ1JVTicgPyAxMDAwIC8gcmVuZGVyYWJsZS5mcHMgOiAxMDAwIC8gcmVuZGVyYWJsZS5pZGxlRnBzO1xuXG4gICAgICAgIGlmIChub3cgLSByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPiBmcmFtZURlbGF5KSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IChyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSArIDEpICUgZnJhbWVDb3VudDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvc1ggPSAtKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICogcmVuZGVyYWJsZS5mcmFtZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcG9zWSA9IC0ocmVuZGVyYWJsZS5yb3cgKiByZW5kZXJhYmxlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYCR7cG9zWH1weCAke3Bvc1l9cHhgO1xuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3Bvcy54fXB4LCAke3Bvcy55fXB4LCAwKWA7XG4gICAgfVxufVxuIiwiLy8gL3NyYy9lY3Mvd29ybGQuanNcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uZXh0RW50aXR5SWQgPSAwO1xuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgTWFwKCk7IFxuICAgICAgICB0aGlzLnN5c3RlbXMgPSBbXTtcbiAgICB9XG5cbiAgICBjcmVhdGVFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMubmV4dEVudGl0eUlkKys7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkKGVudGl0eSk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVudGl0eShlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgZm9yIChjb25zdCBbY29tcG9uZW50TmFtZSwgY29tcG9uZW50TWFwXSBvZiB0aGlzLmNvbXBvbmVudHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lLCBjb21wb25lbnREYXRhID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHMuaGFzKGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIG5ldyBNYXAoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKS5zZXQoZW50aXR5LCBjb21wb25lbnREYXRhKTtcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRNYXAgPyBjb21wb25lbnRNYXAuZ2V0KGVudGl0eSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBpZiAoY29tcG9uZW50TWFwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBxdWVyeSguLi5jb21wb25lbnROYW1lcykge1xuICAgICAgICBpZiAoY29tcG9uZW50TmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaXJzdE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbMF0pO1xuICAgICAgICBpZiAoIWZpcnN0TWFwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGZpcnN0TWFwLmtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGhhc0FsbCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNvbXBvbmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXAgfHwgIW1hcC5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0FsbCAmJiB0aGlzLmVudGl0aWVzLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkU3lzdGVtKHN5c3RlbUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbUZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZHQsIG5vdykge1xuICAgICAgICBmb3IgKGNvbnN0IHN5c3RlbSBvZiB0aGlzLnN5c3RlbXMpIHtcbiAgICAgICAgICAgIHN5c3RlbSh0aGlzLCBkdCwgbm93KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBXaW5NZW51KHByb3BzKSB7XG4gICAgY29uc3Qgd2lubmVyTmFtZSA9IHByb3BzLndpbm5lck5hbWUgfHwgXCJBIFBsYXllclwiO1xuXG4gICAgY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG4gICAgcmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIC8vIFRoaXMgaGFyZCByZWxvYWQgaXMgYSByZWxpYWJsZSB3YXkgdG8gcmVzZXQgdGhlIGdhbWUgc3RhdGUgYW5kIHJldHVybiB0byB0aGUgc3RhcnQuXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgICAgICA8aDE+e3dpbm5lck5hbWUudG9VcHBlckNhc2UoKX0gV09OITwvaDE+XG4gICAgICAgICAgICA8cD5UaGUgbGFzdCBwbGF5ZXIgc3RhbmRpbmcgdGFrZXMgdGhlIGNyb3duLjwvcD5cbiAgICAgICAgICAgIHtyZXBsYXlCdG59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBHUklEX0JPUkRFUl9TSVpFID0gNjtcbmNvbnN0IEdBTUVfQ0hST01FX1dJRFRIID0gNzI7XG5jb25zdCBHQU1FX0NIUk9NRV9IRUlHSFQgPSAxNTA7XG5cbmNvbnN0IGltYWdlcyA9IHtcbiAgICAyOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIixcbiAgICAzOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja193YWxsLnBuZ1wiLFxuICAgIDQ6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2V4cGxvaXQucG5nXCIsXG59O1xuXG5jb25zdCBbcGxheWVyTmFtZSwgc2V0UGxheWVyTmFtZV0gPSBjcmVhdGVTaWduYWwoXCJQbGF5ZXIgMVwiKTtcbmNvbnN0IFtsaXZlcywgc2V0TGl2ZXNdID0gY3JlYXRlU2lnbmFsKDMpO1xuY29uc3QgW3NwZWVkLCBzZXRTcGVlZF0gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbYm9tYnMsIHNldEJvbWJzXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtyYW5nZSwgc2V0UmFuZ2VdID0gY3JlYXRlU2lnbmFsKDEpO1xuZXhwb3J0IHsgc2V0UGxheWVyTmFtZSwgc2V0TGl2ZXMsIHNldFNwZWVkLCBzZXRCb21icywgc2V0UmFuZ2UgfTtcblxuY29uc3QgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IG5hbWVFbC50ZXh0Q29udGVudCA9IHBsYXllck5hbWUoKTsgfSk7XG5cbmNvbnN0IGxpdmVzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGxpdmVzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHNwZWVkRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHNwZWVkLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IGJvbWJzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGJvbWJzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHJhbmdlRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHJhbmdlLXZhbHVlXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbGl2ZXNFbC50ZXh0Q29udGVudCA9IGxpdmVzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgc3BlZWRFbC50ZXh0Q29udGVudCA9IHNwZWVkKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgYm9tYnNFbC50ZXh0Q29udGVudCA9IGJvbWJzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgcmFuZ2VFbC50ZXh0Q29udGVudCA9IHJhbmdlKCk7IH0pO1xuXG5mdW5jdGlvbiBHYW1lKHsgZ3JpZCB9KSB7XG4gICAgY29uc3QgYm9hcmRXaWR0aCA9IGdyaWRbMF0ubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gZ3JpZC5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRPdXRlcldpZHRoID0gYm9hcmRXaWR0aCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJIZWlnaHQgPSBib2FyZEhlaWdodCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRXaWR0aCA6IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGJvYXJkSGVpZ2h0IDogd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHNjYWxlID0gTWF0aC5taW4oXG4gICAgICAgIDEsXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0V2lkdGggLSBHQU1FX0NIUk9NRV9XSURUSCkgLyBib2FyZE91dGVyV2lkdGgpLFxuICAgICAgICBNYXRoLm1heCgwLjIsICh2aWV3cG9ydEhlaWdodCAtIEdBTUVfQ0hST01FX0hFSUdIVCkgLyBib2FyZE91dGVySGVpZ2h0KVxuICAgICk7XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBncmlkLmxlbmd0aDsgcm93SW5kZXgrKykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgZ3JpZFtyb3dJbmRleF0ubGVuZ3RoOyBjb2xJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZ3JpZFtyb3dJbmRleF1bY29sSW5kZXhdO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IFwidGlsZVwiO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gYHdpZHRoOiR7VElMRV9TSVpFfXB4O2hlaWdodDoke1RJTEVfU0laRX1weDtgO1xuXG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMiB8fCBjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtZmxvb3JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtd2FsbFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1szXX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzRdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDAgfHwgY2VsbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1syXX0pYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2VsbHMucHVzaCg8ZGl2IGNsYXNzPXtjbGFzc05hbWV9IGRhdGEteD17Y29sSW5kZXh9IGRhdGEteT17cm93SW5kZXh9IHN0eWxlPXtzdHlsZX0+PC9kaXY+KTtcbiAgICAgICAgfVxuICAgICAgICByb3dzLnB1c2goPGRpdiBjbGFzcz1cImdyaWQtcm93XCI+e2NlbGxzfTwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1nbGFzc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1iYXJcIj5cbiAgICAgICAgICAgICAgICAgICAge25hbWVFbH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLXN0YXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkxpdmVzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsaXZlc0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlNwZWVkPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzcGVlZEVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkJvbWJzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib21ic0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlJhbmdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyYW5nZUVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWJvYXJkLWZyYW1lXCIgc3R5bGU9e2B3aWR0aDoke2JvYXJkT3V0ZXJXaWR0aCAqIHNjYWxlfXB4O2hlaWdodDoke2JvYXJkT3V0ZXJIZWlnaHQgKiBzY2FsZX1weDtgfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJnYW1lLWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImdhbWUtZ3JpZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17YHBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiR7Ym9hcmRXaWR0aH1weDtoZWlnaHQ6JHtib2FyZEhlaWdodH1weDt0cmFuc2Zvcm06c2NhbGUoJHtzY2FsZX0pO2B9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCBDaGF0UGxheWVycyBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmxldCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gY3JlYXRlU2lnbmFsKHt9KTtcbmV4cG9ydCB7IHNldFN0YXRlcyB9O1xuXG5sZXQgcm9vbUlkRWwgPSA8cD5Sb29tIElEOiA8L3A+O1xubGV0IHBsYXllcnNFbCA9IDxwPlBsYXllcnM6ICAvIDQ8L3A+O1xubGV0IHRleHRFbCA9IDxwPjwvcD47XG5sZXQgdGltZXJFbCA9IDxwPlRpbWVyOiA8L3A+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHMgPSBzdGF0ZXMoKTtcbiAgICByb29tSWRFbC50ZXh0Q29udGVudCA9IGBSb29tIElEOiAke3Mucm9vbUlkfWA7XG4gICAgcGxheWVyc0VsLnRleHRDb250ZW50ID0gYFBsYXllcnM6ICR7cy5wbGF5ZXJzQ291bnR9IC8gNGA7XG4gICAgdGV4dEVsLnRleHRDb250ZW50ID0gcy50ZXh0IHx8IFwiXCI7XG5cbiAgICBpZiAocy5nYW1lU3RhcnRlZCkge1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gXCJUaW1lcjogR2FtZSBzdGFydGVkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGltZXJUZXh0ID0gKCFzLnNlY29uZHNMZWZ0KSA/IFwiV2FpdGluZyBmb3Igb25lIG1vcmUgcGxheWVyXCIgOiBgJHtzLnNlY29uZHNMZWZ0fSBzZWNvbmRzYDtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IGBUaW1lcjogJHt0aW1lclRleHR9YDtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gTG9iYnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbmF0aW5lci1sb2JieVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYmJ5LWJveFwiPlxuICAgICAgICAgICAgICAgIDxoMT5Mb2JieTwvaDE+XG4gICAgICAgICAgICAgICAge3Jvb21JZEVsfVxuICAgICAgICAgICAgICAgIHtwbGF5ZXJzRWx9XG4gICAgICAgICAgICAgICAge3RleHRFbH1cbiAgICAgICAgICAgICAgICB7dGltZXJFbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPENoYXRQbGF5ZXJzIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG5yZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5sZXQgbWVudUVsID0gKFxuICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICA8aDE+WW91IFdpbiE8L2gxPlxuICAgICAgICA8cD5BbGwgb3RoZXIgcGxheWVycyBoYXZlIGxlZnQgdGhlIGdhbWUuPC9wPlxuICAgICAgICB7cmVwbGF5QnRufVxuICAgIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVudSgpIHtcbiAgICByZXR1cm4gbWVudUVsO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcblxuZnVuY3Rpb24gUmVnaXN0ZXIoeyB3c3MgfSkge1xuICAgIGxldCBzdWJtaXR0ZWQgPSBmYWxzZTtcblxuICAgIGxldCBwbGF5ZXJFbnRlciA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHN1Ym1pdHRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUgfHwgbmlja25hbWUubGVuZ3RoID4gMjApIHJldHVybjtcblxuICAgICAgICBzdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzZXRQbGF5ZXJOYW1lKG5pY2tuYW1lKTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcIm5pY2tuYW1lX29mX3RoZV9wbGF5ZXJcIixcbiAgICAgICAgICAgIG5pY2tuYW1lOiBuaWNrbmFtZVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgb25TdWJtaXQ9e3BsYXllckVudGVyfT5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5pY2tuYW1lLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVudGVyIHlvdXIgbmFtZVwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMucGxheSgpLCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5tdXNpYy5wbGF5KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5tdXNpYy5wYXVzZWQgfHwgdGhpcy5tdXNpYy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9uXCIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUJ1dHRvbigpIHtcbiAgICAgICAgY29uc3QgaXNNdXRlZCA9IHRoaXMubXVzaWMubXV0ZWQgfHwgdGhpcy5tdXNpYy5wYXVzZWQ7XG5cbiAgICAgICAgdGhpcy5pY29uLmNsYXNzTmFtZSA9IGlzTXV0ZWQgPyBcImZhLXNvbGlkIGZhLXZvbHVtZS1vZmZcIiA6IFwiZmEtc29saWQgZmEtdm9sdW1lLWhpZ2hcIjtcbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImlzLW11dGVkXCIsIGlzTXV0ZWQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291bmQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwL2FwcC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwidHlwZSIsInByb3BzIiwiY2hpbGRyZW4iLCJlbGUiLCJkb2N1bWVudCIsImtleSIsInN0YXJ0c1dpdGgiLCJldmVudE5hbWUiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldEF0dHJpYnV0ZSIsImZsYXRDaGlsZHJlbiIsImZsYXQiLCJJbmZpbml0eSIsImFwcGVuZCIsImZpbHRlciIsImNoaWxkIiwidW5kZWZpbmVkIiwicmVuZGVyIiwiZWxlbWVudCIsImNvbnRhaW5lciIsInJlcGxhY2VDaGlsZHJlbiIsIlJvdXRlciIsInJvdXRlciIsImVmZmVjdFN0YWNrIiwiYWN0aXZlRWZmZWN0IiwiY3JlYXRlU2lnbmFsIiwiaW5pdGlhbFZhbHVlIiwidmFsdWUiLCJlZmZlY3RzIiwiU2V0IiwiUmVhZCIsImFkZCIsIldyaXRlIiwibmV3VmFsdWUiLCJmbiIsImZvckVhY2giLCJlZmZlY3QiLCJjcmVhdGVFZmZlY3QiLCJwdXNoIiwicG9wIiwibGVuZ3RoIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInVybCIsIlVSTCIsImhyZWYiLCJsaXN0ZW4iLCJvbkVycm9yNDA0IiwiZXZlbnQiLCJkZXN0aW5hdGlvbiIsImludGVyY2VwdCIsImNvbnNvbGUiLCJsb2ciLCJSZWdpc3RlciIsIkdhbWUiLCJNZW51IiwiTG9iYnkiLCJXaW5NZW51Iiwic2V0U3RhdGVzIiwic2V0UGxheWVyTmFtZSIsInNldEh1ZFBsYXllck5hbWUiLCJTb3VuZCIsInNldE1lc3NhZ2VzIiwiR2FtZUVuZ2luZSIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsIndpbmRvdyIsImhvc3RuYW1lIiwic291bmQiLCJjdXJyZW50R2FtZUVuZ2luZSIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJ3cyIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicXVlcnlTZWxlY3RvciIsInJvb21JZCIsInBsYXllcnNDb3VudCIsInNlY29uZHNMZWZ0IiwidGV4dCIsImdyaWQiLCJzZXRUaW1lb3V0IiwiZ2FtZUNvbnRhaW5lciIsImRlc3Ryb3kiLCJsb2NhbFBsYXllciIsInBsYXllcnMiLCJmaW5kIiwicGxheWVyIiwiaWQiLCJ5b3VyUGxheWVySWQiLCJuaWNrbmFtZSIsImVuZ2luZSIsImVycm9yIiwid2lubmVyTmFtZSIsInByZXYiLCJoYW5kbGVSZW1vdGVNb3ZlIiwicGF5bG9hZCIsImhhbmRsZVJlbW90ZUJvbWIiLCJoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkIiwiaGFuZGxlUmVtb3RlSXRlbVBpY2t1cCIsImVyciIsIm1lc3NhZ2VzIiwiQ2hhdFBsYXllcnMiLCJtZXNzYWdlc0NvbnRhaW5lciIsImNsYXNzIiwibXNncyIsImlubmVySFRNTCIsIm1zZyIsInAiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsImdldCIsInRyaW0iLCJyZXNldCIsInNlbmQiLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlBvc2l0aW9uQ29tcG9uZW50IiwiZ3giLCJneSIsInRpbGVTaXplIiwiZ3JpZFgiLCJncmlkWSIsIngiLCJ5IiwidGFyZ2V0WCIsInRhcmdldFkiLCJWZWxvY2l0eUNvbXBvbmVudCIsImJhc2VTcGVlZCIsInNwZWVkIiwiaXNNb3ZpbmciLCJkaXJlY3Rpb24iLCJJbnB1dENvbXBvbmVudCIsImlucHV0UXVldWUiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiZWwiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJ0b3RhbEZyYW1lcyIsImZwcyIsImN1cnJlbnRGcmFtZSIsInJ1bkZyYW1lcyIsImlkbGVGcmFtZXMiLCJpZGxlRnBzIiwibGFzdEZyYW1lVGltZSIsInJvdyIsInN0YXRlIiwibGFzdFN0YXRlIiwiUGxheWVyQ29tcG9uZW50IiwiY2hhclR5cGUiLCJpc0xvY2FsIiwiQm9tYkNvbXBvbmVudCIsIm93bmVySWQiLCJ0aW1lciIsInJhbmdlIiwiZXhwbG9kZWQiLCJFeHBsb3Npb25Db21wb25lbnQiLCJkdXJhdGlvbiIsIlBvd2VyVXBDb21wb25lbnQiLCJwaWNrZWRVcCIsIkJlaGF2aW9yQ29tcG9uZW50IiwiZ2hvc3RNb2RlIiwidGhyb3dhYmxlIiwiZGV0b25hdG9yIiwiZmFzdFNob2VzTGV2ZWwiLCJib21icyIsIm1heCIsImN1cnJlbnQiLCJXb3JsZCIsIm1vdmVtZW50U3lzdGVtIiwicmVuZGVyU3lzdGVtIiwiYm9tYlN5c3RlbSIsImRhbWFnZVN5c3RlbSIsImNoZWNrR2FtZUVuZENvbmRpdGlvbnMiLCJzcGF3bkhlYXJ0UG93ZXJVcCIsInBvd2VyVXBTeXN0ZW0iLCJzcGF3blBvd2VyVXAiLCJzZXRCb21icyIsInNldExpdmVzIiwic2V0UmFuZ2UiLCJzZXRTcGVlZCIsIlRJTEVfU0laRSIsIkFOSU1BVElPTl9ST1dTIiwiUlVOIiwidXAiLCJsZWZ0IiwiZG93biIsInJpZ2h0IiwiSURMRSIsImNvbnN0cnVjdG9yIiwiY2FudmFzQ29udGFpbmVyIiwibWFwRGF0YSIsInNvY2tldCIsIndvcmxkIiwibG9jYWxQbGF5ZXJFbnRpdHkiLCJwbGF5ZXJFbnRpdGllcyIsIk1hcCIsInBsYXllckluZm8iLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibG9zc01vZGFsVHJpZ2dlcmVkIiwiaW5wdXRFbmFibGVkIiwiZ2FtZUVuZGVkIiwibG9jYWxQbGF5ZXJJZCIsImFsbFBsYXllcnMiLCJ0b3RhbFBsYXllcnMiLCJub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCIsIlN0cmluZyIsInBEYXRhIiwicGxheWVySWQiLCJwbGF5ZXJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJzZXQiLCJwbGF5ZXJEaXYiLCJjb2xvciIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ3aWxsQ2hhbmdlIiwic3giLCJzeSIsImFkZENvbXBvbmVudCIsInBsYXllckNvbXAiLCJsaXZlcyIsIm1heEJvbWJzIiwiYm9tYlJhbmdlIiwidXBkYXRlSHVkU3RhdHMiLCJzZXR1cElucHV0Iiwid2FybiIsIm1hcCIsInJlZ2lzdGVyU3lzdGVtcyIsInBlcmZvcm1hbmNlIiwibm93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZ2FtZUxvb3AiLCJpbnB1dCIsImdldENvbXBvbmVudCIsImdldEtleURpcmVjdGlvbiIsImhhbmRsZUtleURvd24iLCJkaXIiLCJpbmNsdWRlcyIsImNvZGUiLCJkcm9wQm9tYiIsImhhbmRsZUtleVVwIiwiZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJwb3MiLCJjdXJyZW50Qm9tYnMiLCJxdWVyeSIsImJFbnRpdHkiLCJjcmVhdGVkIiwiY3JlYXRlQm9tYiIsInJlYWR5U3RhdGUiLCJPUEVOIiwiZXhpc3RzIiwic29tZSIsImVudGl0eSIsImJvbWIiLCJib21iRW50aXR5IiwiYm9tYkRpdiIsInRvcCIsImJvbWJDb21wIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsInZlbCIsInJlbmRlcmFibGUiLCJyZW1vdmVQb3dlclVwQXQiLCJhcHBseVBvd2VyVXAiLCJuZXdMaXZlcyIsInBvd2VyVXBzIiwicG93ZXJVcCIsInBhcmVudE5vZGUiLCJkZXN0cm95RW50aXR5IiwidmVsb2NpdHkiLCJNYXRoIiwibWluIiwidXBkYXRlTWFwQ2VsbCIsInRpbGUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJkZXN0cm95Qm94Q2FsbGJhY2siLCJoYXMiLCJvblBsYXllckh1cnQiLCJyZW1haW5pbmdMaXZlcyIsIm9uUG93ZXJVcFBpY2tlZCIsImJyb2FkY2FzdE1vdmVtZW50IiwiYWRkU3lzdGVtIiwidyIsImR0IiwidXBkYXRlIiwibmV4dE5vdyIsImhhbmRsZUdhbWVPdmVyIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJyb3VuZCIsImN1cnJlbnRMb2NhbFBsYXllck5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZ2V0UGxheWVyTmFtZSIsImdldEl0ZW0iLCJhZmZlY3RlZENlbGxzIiwiY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMiLCJjZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2Iiwid2lkdGgiLCJoZWlnaHQiLCJleHBsb3Npb25zIiwiZXhwIiwiYngiLCJieSIsImNlbGxzIiwiZGlyZWN0aW9ucyIsInN0ZXBzIiwiaSIsInR4IiwidHkiLCJjZWxsVHlwZSIsImhlYXJ0RW50aXR5IiwiaGVhcnREaXYiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiZm9udFNpemUiLCJoYW5kbGVQbGF5ZXJEZWF0aCIsImRlYXRoR3JpZFgiLCJmbG9vciIsImRlYXRoR3JpZFkiLCJyZW1vdmVDb21wb25lbnQiLCJwUG9zIiwiaW52aW5jaWJsZVVudGlsIiwiZVBvcyIsInBsYXllckdyaWRYIiwicGxheWVyR3JpZFkiLCJwcmV2aW91c0xpdmVzIiwiYWxyZWFkeVJlcG9ydGVkRGVhZCIsImVudGl0aWVzIiwiZGVsdGEiLCJQTEFZRVJfU0laRSIsImJlaGF2aW9yIiwibW92ZVRvd2FyZFRhcmdldCIsImFjdGl2ZUlucHV0IiwiZHgiLCJkeSIsImhhc0lucHV0IiwibmV4dFgiLCJuZXh0WSIsInNuYXBUaHJlc2hvbGQiLCJpc0Jsb2NrZWQiLCJjdXJyZW50VGlsZVgiLCJkaWZmWCIsImFicyIsInNpZ24iLCJjdXJyZW50VGlsZVkiLCJkaWZmWSIsIm5leHRYQWZ0ZXJTbmFwIiwibmV4dFlBZnRlclNuYXAiLCJzdGVwIiwicGxheWVyU2l6ZSIsInBhZGRpbmciLCJib3R0b20iLCJpc0Jsb2NrZWRDZWxsIiwicFVwRW50aXR5IiwidXBQb3MiLCJwVXAiLCJzZWVkIiwic2VlZFJhbmRvbSIsInNpbiIsInR5cGVzIiwidHlwZUluZGV4IiwicmFuZG9tVHlwZSIsImRpdiIsImFuaW1Sb3dzIiwidGFyZ2V0Um93IiwiZnJhbWVDb3VudCIsImZyYW1lRGVsYXkiLCJwb3NYIiwicG9zWSIsImJhY2tncm91bmRQb3NpdGlvbiIsInRyYW5zZm9ybSIsIm5leHRFbnRpdHlJZCIsImNvbXBvbmVudHMiLCJzeXN0ZW1zIiwiZGVsZXRlIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudE1hcCIsImVudHJpZXMiLCJjb21wb25lbnREYXRhIiwiY29tcG9uZW50TmFtZXMiLCJmaXJzdE1hcCIsInJlc3VsdHMiLCJoYXNBbGwiLCJzeXN0ZW1GdW5jdGlvbiIsInN5c3RlbSIsInJlcGxheUJ0biIsInJlbG9hZCIsInRvVXBwZXJDYXNlIiwiR1JJRF9CT1JERVJfU0laRSIsIkdBTUVfQ0hST01FX1dJRFRIIiwiR0FNRV9DSFJPTUVfSEVJR0hUIiwiaW1hZ2VzIiwicGxheWVyTmFtZSIsIm5hbWVFbCIsImxpdmVzRWwiLCJzcGVlZEVsIiwiYm9tYnNFbCIsInJhbmdlRWwiLCJib2FyZFdpZHRoIiwiYm9hcmRIZWlnaHQiLCJib2FyZE91dGVyV2lkdGgiLCJib2FyZE91dGVySGVpZ2h0Iiwidmlld3BvcnRXaWR0aCIsImlubmVyV2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsImlubmVySGVpZ2h0Iiwic2NhbGUiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJnYW1lU3RhcnRlZCIsInRpbWVyVGV4dCIsIm1lbnVFbCIsInN1Ym1pdHRlZCIsInBsYXllckVudGVyIiwiY3VycmVudFRhcmdldCIsInNyYyIsIm11c2ljIiwiQXVkaW8iLCJidXR0b24iLCJpY29uIiwibG9vcCIsInZvbHVtZSIsInRvZ2dsZSIsInBsYXkiLCJvbmNlIiwidXBkYXRlQnV0dG9uIiwidGhlbiIsImNhdGNoIiwicGF1c2VkIiwibXV0ZWQiLCJpc011dGVkIiwiY2xhc3NMaXN0Il0sInNvdXJjZVJvb3QiOiIifQ==