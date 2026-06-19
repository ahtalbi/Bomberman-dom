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
      // Always notify the server when ANY player dies.
      // The server will validate the death event.
      if (remainingLives <= 0 && this.socket && this.socket.readyState === WebSocket.OPEN) {
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

  // 1. Instead of destroying the entity, remove components that enable interaction and rendering.
  // This effectively turns the player into a non-interactive "ghost" or spectator.
  world.removeComponent(playerEntity, 'Renderable'); // This will stop it from being drawn
  world.removeComponent(playerEntity, 'Velocity');
  world.removeComponent(playerEntity, 'Input');
  // We keep Position and Player components to know where they are and who they are.

  // 2. Spawn a HEART power-up entity at the death location (proper ECS entity)
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

        // Always call the callback to update HUD or notify server.
        if (onPlayerHurt) {
          onPlayerHurt(playerEntity, player.id, player.lives);
        }

        // If the player is dead, THEN perform local cleanup.
        // This happens AFTER the server has been notified via the callback.
        if (player.lives <= 0) {
          handlePlayerDeath(world, playerEntity, tileSize);
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
      if (pPos.gridX === upPos.gridX && pPos.gridY === upPos.gridY) {
        pUp.pickedUp = true;
        if (pUp.type === 'SPEED') {
          vel.speed = Math.min(vel.speed + 1, 8);
        } else if (pUp.type === 'BOMBS') {
          player.maxBombs = player.maxBombs ? player.maxBombs + 1 : 2;
        } else if (pUp.type === 'FLAME') {
          player.bombRange = player.bombRange ? player.bombRange + 1 : 5;
        } else if (pUp.type === 'HEART') {
          // Heart power-up: increment player's lives by 1
          player.lives = (player.lives || 0) + 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUsZUFBZSxDQUFDO01BQ3ZELElBQUksQ0FBQzhjLFlBQVksQ0FBQyxDQUFDO0lBQ3ZCO0VBQ0o7RUFFQUEsWUFBWUEsQ0FBQSxFQUFHO0lBQ1gsTUFBTUssT0FBTyxHQUFHLElBQUksQ0FBQ2QsS0FBSyxDQUFDYSxLQUFLLElBQUksSUFBSSxDQUFDYixLQUFLLENBQUNZLE1BQU07SUFFckQsSUFBSSxDQUFDVCxJQUFJLENBQUM1WCxTQUFTLEdBQUd1WSxPQUFPLEdBQUcsd0JBQXdCLEdBQUcseUJBQXlCO0lBQ3BGLElBQUksQ0FBQ1osTUFBTSxDQUFDYSxTQUFTLENBQUNULE1BQU0sQ0FBQyxVQUFVLEVBQUVRLE9BQU8sQ0FBQztFQUNyRDtBQUNKO0FBRUEsaUVBQWVwWixLQUFLLEU7Ozs7OztVQ25EcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvZG9tLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NoYXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9lY3MvY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3dvcmxkLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9XaW5NZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvZ2FtZS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2xvYmJ5LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL3JlZ2lzdGVyLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvc291bmQuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIHByb3BzLCAuLi5jaGlsZHJlbikge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiB0eXBlKHsgLi4uKHByb3BzIHx8IHt9KSwgY2hpbGRyZW4gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzIHx8IHt9KSB7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChcIm9uXCIpICYmIHR5cGVvZiBwcm9wc1trZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGtleS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZS5zZXRBdHRyaWJ1dGUoa2V5LCBwcm9wc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZsYXRDaGlsZHJlbiA9IGNoaWxkcmVuLmZsYXQoSW5maW5pdHkpO1xuICAgIGVsZS5hcHBlbmQoLi4uZmxhdENoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gbnVsbCAmJiBjaGlsZCAhPT0gdW5kZWZpbmVkICYmIGNoaWxkICE9PSBmYWxzZSkpO1xuXG4gICAgcmV0dXJuIGVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICBjb250YWluZXIucmVwbGFjZUNoaWxkcmVuKGVsZW1lbnQpO1xufVxuIiwiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4vcm91dGVyLmpzXCI7XG5cbmxldCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjsiLCJjb25zdCBlZmZlY3RTdGFjayA9IFtdO1xubGV0IGFjdGl2ZUVmZmVjdCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaWduYWwoaW5pdGlhbFZhbHVlKSB7XG4gICBsZXQgdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICBjb25zdCBlZmZlY3RzID0gbmV3IFNldCgpO1xuXG4gICBjb25zdCBSZWFkID0gKCkgPT4ge1xuICAgICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgICAgZWZmZWN0cy5hZGQoYWN0aXZlRWZmZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgIH1cblxuICAgY29uc3QgV3JpdGUgPSAobmV3VmFsdWUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgbGV0IGZuID0gbmV3VmFsdWU7XG4gICAgICAgICB2YWx1ZSA9IGZuKHZhbHVlKTtcbiAgICAgIH0gXG4gICAgICBlbHNlIHZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBlZmZlY3RzLmZvckVhY2goZWZmZWN0ID0+IGVmZmVjdCgpKTtcbiAgIH1cblxuICAgcmV0dXJuIFtSZWFkLCBXcml0ZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFZmZlY3QoZWZmZWN0KSB7XG4gICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3Q7XG4gICBlZmZlY3QoKTtcbiAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbn1cbiIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgICNSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICNGaXJzdFJlc29sdmUgPSBmYWxzZTtcblxuICAgIG9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy4jUm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFxuICAgIG5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSA9IFwicHVzaFwiIH0gPSB7fSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBcIi9cIiArIHBhdGg7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzb2x2ZShwYXRoID0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbcGF0aF07XG5cbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm4oeyB1cmw6IG5ldyBVUkwobG9jYXRpb24uaHJlZikgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxpc3RlbihvbkVycm9yNDA0KSB7XG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5pbnRlcmNlcHQoe1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLnBhdGhuYW1lLCB0aGlzLiNSb3V0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3VybC5wYXRobmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I0MDQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbih7IHVybCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNGaXJzdFJlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdGhpcy4jRmlyc3RSZXNvbHZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgcmVuZGVyIH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmtcIjtcbmltcG9ydCBSZWdpc3RlciBmcm9tIFwiLi4vcGFnZXMvcmVnaXN0ZXJcIjtcbmltcG9ydCBHYW1lIGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgTWVudSBmcm9tIFwiLi4vcGFnZXMvbWVudVwiO1xuaW1wb3J0IExvYmJ5IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IFdpbk1lbnUgZnJvbSBcIi4uL3BhZ2VzL1dpbk1lbnUuanN4XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiOyBcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoYHdzOi8vJHt3aW5kb3cubG9jYXRpb24uaG9zdG5hbWV9OjUwMDBgKTtcbmNvbnN0IHNvdW5kID0gbmV3IFNvdW5kKFwiLi9hc3NldHMvc291bmRzL2JhY2tncm91bmRfbXVzaWMubXAzXCIpO1xubGV0IGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcblxuc291bmQuaW5pdCgpO1xuXG5yb3V0ZXIub24oXCIvXCIsICgpID0+IHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwicmVnaXN0ZXItcGFnZVwiO1xuICAgIHJlbmRlcig8UmVnaXN0ZXIgd3NzPXt3c3N9IC8+LCByb290KTtcbn0pO1xuXG5yb3V0ZXIubGlzdGVuKCgpID0+IHsgYWxlcnQoXCI0MDRcIikgfSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCAod3MpID0+IHtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInJvb21fdXBkYXRlXCI6XG4gICAgICAgIGNhc2UgXCJsb2JieV90aW1lclwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImxvYmJ5LXBhZ2VcIjtcbiAgICAgICAgICAgIGlmICghcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmNvbmF0aW5lci1sb2JieVwiKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcig8TG9iYnkgLz4sIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogbWVzc2FnZS5wbGF5ZXJzQ291bnQsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IG1lc3NhZ2Uuc2Vjb25kc0xlZnQsXG4gICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZ2FtZV9zdGFydGVkXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwiZ2FtZS1wYWdlXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlbmRlcig8R2FtZSBncmlkPXttZXNzYWdlLmdyaWR9IC8+LCByb290KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFBsYXllciA9IChtZXNzYWdlLnBsYXllcnMgfHwgW10pLmZpbmQocGxheWVyID0+IHBsYXllci5pZCA9PT0gbWVzc2FnZS55b3VyUGxheWVySWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxQbGF5ZXIgJiYgbG9jYWxQbGF5ZXIubmlja25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEh1ZFBsYXllck5hbWUobG9jYWxQbGF5ZXIubmlja25hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5naW5lID0gbmV3IEdhbWVFbmdpbmUoZ2FtZUNvbnRhaW5lciwgbWVzc2FnZS5ncmlkLCB3c3MpO1xuICAgICAgICAgICAgICAgICAgICBlbmdpbmUuaW5pdChtZXNzYWdlLnlvdXJQbGF5ZXJJZCwgbWVzc2FnZS5wbGF5ZXJzIHx8IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gZW5naW5lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJHYW1lIGNvbnRhaW5lciB3YXMgbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJyb29tX2Fsb25lXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPE1lbnUgLz4sIHJvb3QpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfd29uXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPFdpbk1lbnUgd2lubmVyTmFtZT17bWVzc2FnZS53aW5uZXJOYW1lfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2ICxtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpdGVtX3BpY2tlZFwiOlxuICAgICAgICAgICAgLy8gSGFuZGxlIHJlbW90ZSBoZWFydCBwaWNrdXAgLSB1cGRhdGUgdGhlIHBsYXllcidzIGxpdmVzIG9uIGFsbCBjbGllbnRzXG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVJdGVtUGlja3VwKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvclwiLCBlcnIpO1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdzcztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgd3NzIGZyb20gXCIuLi9hcHAvYXBwXCI7XG5cbmNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gY3JlYXRlU2lnbmFsKFtdKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzIH07XG5cbmZ1bmN0aW9uIENoYXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IG1lc3NhZ2VzQ29udGFpbmVyID0gPGRpdiBjbGFzcz1cIm1lc3NhZ2VzXCI+PC9kaXY+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNncyA9IG1lc3NhZ2VzKCk7XG4gICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgbXNnIG9mIG1zZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBtc2c7XG4gICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG1lc3NhZ2VzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBtc2dzLnVuc2hpZnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBmb3JtRGF0YS5nZXQoXCJtZXNzYWdlXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcImNoYXRfbWVzc2FnZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgfSkpO1xuICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0XCIgb25TdWJtaXQ9e2Jyb2FkY2FzdE1lc3NhZ2V9PlxuICAgICAgICAgICAge21lc3NhZ2VzQ29udGFpbmVyfVxuICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1lc3NhZ2VcIiBwbGFjZWhvbGRlcj1cInR5cGUgdG8gdGhlIG90aGVyIHBsYXllcnMgLi4uXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXRQbGF5ZXJzOyIsIi8vIC9zcmMvZWNzL2NvbXBvbmVudHMuanNcblxuZXhwb3J0IGNvbnN0IFBvc2l0aW9uQ29tcG9uZW50ID0gKGd4LCBneSwgdGlsZVNpemUgPSA2NCkgPT4gKHtcbiAgICBncmlkWDogZ3gsXG4gICAgZ3JpZFk6IGd5LFxuICAgIHg6IGd4ICogdGlsZVNpemUsXG4gICAgeTogZ3kgKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRYOiBneCAqIHRpbGVTaXplLFxuICAgIHRhcmdldFk6IGd5ICogdGlsZVNpemVcbn0pO1xuXG5leHBvcnQgY29uc3QgVmVsb2NpdHlDb21wb25lbnQgPSAoYmFzZVNwZWVkID0gMi41KSA9PiAoe1xuICAgIGJhc2VTcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkOiBiYXNlU3BlZWQsXG4gICAgaXNNb3Zpbmc6IGZhbHNlLFxuICAgIGRpcmVjdGlvbjogJ2Rvd24nXG59KTtcblxuZXhwb3J0IGNvbnN0IElucHV0Q29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBpbnB1dFF1ZXVlOiBbXVxufSk7XG5cbmV4cG9ydCBjb25zdCBSZW5kZXJhYmxlQ29tcG9uZW50ID0gKGVsLCBmcmFtZVdpZHRoID0gNjQsIGZyYW1lSGVpZ2h0ID0gNjQsIHRvdGFsRnJhbWVzID0gNCwgZnBzID0gMTIpID0+ICh7XG4gICAgZWw6IGVsLFxuICAgIGZyYW1lV2lkdGg6IGZyYW1lV2lkdGgsXG4gICAgZnJhbWVIZWlnaHQ6IGZyYW1lSGVpZ2h0LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogdG90YWxGcmFtZXMsXG4gICAgcnVuRnJhbWVzOiA0LFxuICAgIGlkbGVGcmFtZXM6IDIsXG4gICAgZnBzOiBmcHMsXG4gICAgaWRsZUZwczogNCxcbiAgICBsYXN0RnJhbWVUaW1lOiAwLFxuICAgIHJvdzogMCxcbiAgICBzdGF0ZTogJ0lETEUnLFxuICAgIGxhc3RTdGF0ZTogJ0lETEUnXG59KTtcblxuZXhwb3J0IGNvbnN0IFBsYXllckNvbXBvbmVudCA9IChpZCwgY2hhclR5cGUsIGlzTG9jYWwgPSBmYWxzZSkgPT4gKHtcbiAgICBpZDogaWQsXG4gICAgY2hhclR5cGU6IGNoYXJUeXBlLFxuICAgIGlzTG9jYWw6IGlzTG9jYWxcbn0pO1xuXG5leHBvcnQgY29uc3QgQm9tYkNvbXBvbmVudCA9IChvd25lcklkLCB0aW1lciA9IDIwMDAsIHJhbmdlID0gNCkgPT4gKHtcbiAgICBvd25lcklkOiBvd25lcklkLFxuICAgIHRpbWVyOiB0aW1lcixcbiAgICByYW5nZTogcmFuZ2UsXG4gICAgZXhwbG9kZWQ6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEV4cGxvc2lvbkNvbXBvbmVudCA9IChkdXJhdGlvbiA9IDUwMCkgPT4gKHtcbiAgICBkdXJhdGlvbjogZHVyYXRpb25cbn0pO1xuXG5leHBvcnQgY29uc3QgUG93ZXJVcENvbXBvbmVudCA9ICh0eXBlKSA9PiAoe1xuICAgIHR5cGU6IHR5cGUsIFxuICAgIHBpY2tlZFVwOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBCZWhhdmlvckNvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgZ2hvc3RNb2RlOiBmYWxzZSxcbiAgICB0aHJvd2FibGU6IGZhbHNlLFxuICAgIGRldG9uYXRvcjogZmFsc2UsXG4gICAgZmFzdFNob2VzTGV2ZWw6IDEsXG4gICAgYm9tYnM6IHtcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICByYW5nZTogMlxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkLmpzJztcbmltcG9ydCB7XG4gICAgUG9zaXRpb25Db21wb25lbnQsXG4gICAgVmVsb2NpdHlDb21wb25lbnQsXG4gICAgSW5wdXRDb21wb25lbnQsXG4gICAgUmVuZGVyYWJsZUNvbXBvbmVudCxcbiAgICBQbGF5ZXJDb21wb25lbnQsXG4gICAgQm9tYkNvbXBvbmVudFxufSBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuaW1wb3J0IHsgbW92ZW1lbnRTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyc7XG5pbXBvcnQgeyBib21iU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgZGFtYWdlU3lzdGVtLCBjaGVja0dhbWVFbmRDb25kaXRpb25zLCBzcGF3bkhlYXJ0UG93ZXJVcCB9IGZyb20gJy4vc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMnO1xuaW1wb3J0IFdpbk1lbnUgZnJvbSAnLi4vcGFnZXMvV2luTWVudS5qc3gnO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tLmpzJztcblxuaW1wb3J0IHsgcG93ZXJVcFN5c3RlbSwgc3Bhd25Qb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMnO1xuaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQgfSBmcm9tICcuLi9wYWdlcy9nYW1lJztcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzQ29udGFpbmVyLCBtYXBEYXRhLCBzb2NrZXQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjYW52YXNDb250YWluZXI7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IG1hcERhdGE7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XG4gICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnBsYXllckluZm8gPSBuZXcgTWFwKCk7IC8vIFN0b3JlIG9yaWdpbmFsIHBsYXllciBkYXRhIGxpa2Ugbmlja25hbWVcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IDA7XG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzID0gbmV3IFNldCgpO1xuICAgICAgICAvLyBTdGF0ZSBmbGFnIHRvIHByZXZlbnQgbXVsdGlwbGUgbG9zcyBtb2RhbCByZW5kZXJzIChUaGUgTG9vcCBUcmFwIGZpeClcbiAgICAgICAgdGhpcy5sb3NzTW9kYWxUcmlnZ2VyZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gRmxhZyB0byB0cmFjayBpZiBpbnB1dCBzaG91bGQgYmUgZGlzYWJsZWRcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAvLyBGbGFnIHRvIHN0b3AgdGhlIGdhbWUgbG9vcCBvbmNlIGEgd2lubmVyIGlzIGRlY2lkZWRcbiAgICAgICAgdGhpcy5nYW1lRW5kZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0KGxvY2FsUGxheWVySWQsIGFsbFBsYXllcnMpIHtcbiAgICAgICAgdGhpcy50b3RhbFBsYXllcnMgPSBhbGxQbGF5ZXJzLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZExvY2FsUGxheWVySWQgPSBTdHJpbmcobG9jYWxQbGF5ZXJJZCk7XG5cbiAgICAgICAgYWxsUGxheWVycy5mb3JFYWNoKHBEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gU3RyaW5nKHBEYXRhLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckluZm8uc2V0KHBsYXllcklkLCBwRGF0YSk7IC8vIFN0b3JlIG9yaWdpbmFsIHBsYXllciBkYXRhXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcERhdGEuY29sb3IgfHwgXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gYHBsYXllciBwbGF5ZXItJHtjb2xvcn1gO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS56SW5kZXggPSAnMTAnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckRpdik7XG5cbiAgICAgICAgICAgIGNvbnN0IHN4ID0gcERhdGEueCB8fCAxO1xuICAgICAgICAgICAgY29uc3Qgc3kgPSBwRGF0YS55IHx8IDE7XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJywgUG9zaXRpb25Db21wb25lbnQoc3gsIHN5LCBUSUxFX1NJWkUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5JywgVmVsb2NpdHlDb21wb25lbnQoMi41KSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJywgUmVuZGVyYWJsZUNvbXBvbmVudChwbGF5ZXJEaXYsIDY0LCA2NCwgNCwgMTIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpc0xvY2FsID0gcGxheWVySWQgPT09IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IFBsYXllckNvbXBvbmVudChwbGF5ZXJJZCwgY29sb3IsIGlzTG9jYWwpO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5saXZlcyA9IDM7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLm1heEJvbWJzID0gMTtcbiAgICAgICAgICAgIHBsYXllckNvbXAuYm9tYlJhbmdlID0gNDtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicsIHBsYXllckNvbXApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcy5zZXQocGxheWVySWQsIHBsYXllckVudGl0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc0xvY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcsIElucHV0Q29tcG9uZW50KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMocGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltHYW1lRW5naW5lXSBMb2NhbCBwbGF5ZXIgd2FzIG5vdCBmb3VuZFwiLCB7XG4gICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXJJZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzOiBhbGxQbGF5ZXJzLm1hcChwbGF5ZXIgPT4gcGxheWVyLmlkKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlclN5c3RlbXMoKTtcblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5vdykgPT4gdGhpcy5nYW1lTG9vcChub3cpKTtcbiAgICB9XG5cbiAgICBzZXR1cElucHV0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZ2V0S2V5RGlyZWN0aW9uID0gKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93VXAnIHx8IGtleSA9PT0gJ3cnIHx8IGtleSA9PT0gJ1onIHx8IGtleSA9PT0gJ3onKSByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93TGVmdCcgfHwga2V5ID09PSAnYScgfHwga2V5ID09PSAnUScgfHwga2V5ID09PSAncScpIHJldHVybiAnbGVmdCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dSaWdodCcgfHwga2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpIHJldHVybiAncmlnaHQnO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgICAgICAgICAvLyBJTlBVVCBESVNBQkxFRDogSW1tZWRpYXRlbHkgaWdub3JlIGFsbCBrZXlib2FyZCBpbnB1dHMgd2hlbiBwbGF5ZXIgaXMgZGVhZFxuICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0RW5hYmxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlLnVuc2hpZnQoZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICAgICAgLy8gSU5QVVQgRElTQUJMRUQ6IEltbWVkaWF0ZWx5IGlnbm9yZSBhbGwga2V5Ym9hcmQgaW5wdXRzIHdoZW4gcGxheWVyIGlzIGRlYWRcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dEVuYWJsZWQpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkcm9wQm9tYigpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRCb21icyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5maWx0ZXIoYkVudGl0eSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoYkVudGl0eSwgJ0JvbWInKS5vd25lcklkID09PSBwbGF5ZXIuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjdXJyZW50Qm9tYnMubGVuZ3RoID49IHBsYXllci5tYXhCb21icykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUJvbWIocGxheWVyLmlkLCBwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgcGxheWVyLmJvbWJSYW5nZSk7XG4gICAgICAgIGlmICghY3JlYXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0RST1BfQk9NQicsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZDogcGxheWVyLmlkLCB4OiBwb3MuZ3JpZFgsIHk6IHBvcy5ncmlkWSwgcmFuZ2U6IHBsYXllci5ib21iUmFuZ2UgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiBib21iLm93bmVySWQgPT09IG93bmVySWQgJiYgcG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuZWwgPSBib21iRGl2O1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicsIGJvbWJDb21wKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlTW92ZShwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW2hhbmRsZVJlbW90ZU1vdmVdIEludmFsaWQgcGF5bG9hZDpcIiwgcGF5bG9hZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBFbnRpdHkgbm90IGZvdW5kIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfS4gQXZhaWxhYmxlIHBsYXllcnM6YCwgQXJyYXkuZnJvbSh0aGlzLnBsYXllckVudGl0aWVzLmtleXMoKSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtoYW5kbGVSZW1vdGVNb3ZlXSBJZ25vcmluZyBsb2NhbCBwbGF5ZXIgdXBkYXRlIGZvciAke3BheWxvYWQuaWR9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwb3MgfHwgIXZlbCB8fCAhcmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gVXBkYXRpbmcgcGxheWVyICR7cGF5bG9hZC5pZH0gdG8gKCR7cGF5bG9hZC5ncmlkWH0sICR7cGF5bG9hZC5ncmlkWX0pYCk7XG4gICAgICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgICAgICBwb3MuZ3JpZFggPSBwYXlsb2FkLmdyaWRYO1xuICAgICAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgICAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwYXlsb2FkLnk7XG4gICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZUJvbWIocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDQpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgcGF5bG9hZC54ID09PSB1bmRlZmluZWQgfHwgcGF5bG9hZC55ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnJlbW92ZVBvd2VyVXBBdChwYXlsb2FkLngsIHBheWxvYWQueSk7XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkIHx8IGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYXBwbHlQb3dlclVwKGVudGl0eSwgcGF5bG9hZC50eXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHJlbW90ZSBoZWFydCBwaWNrdXAgLSB1cGRhdGVzIHBsYXllciBsaXZlcyBhbmQgVUkgb24gYWxsIGNsaWVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIHsgcGxheWVySWQsIG5ld0xpdmVzIH1cbiAgICAgKi9cbiAgICBoYW5kbGVSZW1vdGVJdGVtUGlja3VwKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLnBsYXllcklkIHx8IHBheWxvYWQubmV3TGl2ZXMgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLnBsYXllcklkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBsYXllcikgcmV0dXJuO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgcGxheWVyJ3MgbGl2ZXNcbiAgICAgICAgcGxheWVyLmxpdmVzID0gcGF5bG9hZC5uZXdMaXZlcztcblxuICAgICAgICAvLyBVcGRhdGUgSFVEIGlmIHRoaXMgaXMgdGhlIGxvY2FsIHBsYXllclxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKGVudGl0eSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW1JlbW90ZSBJdGVtIFBpY2t1cF0gUGxheWVyICR7cGF5bG9hZC5wbGF5ZXJJZH0gcGlja2VkIHVwIGhlYXJ0LiBOZXcgbGl2ZXM6ICR7cGF5bG9hZC5uZXdMaXZlc31gKTtcbiAgICB9XG5cbiAgICByZW1vdmVQb3dlclVwQXQoZ3JpZFgsIGdyaWRZKSB7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHtncmlkWH0sJHtncmlkWX1gKTtcbiAgICAgICAgY29uc3QgcG93ZXJVcHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwb3dlclVwID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCFwb3MgfHwgIXBvd2VyVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcG93ZXJVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAocG93ZXJVcC5lbCAmJiBwb3dlclVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG93ZXJVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvd2VyVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UG93ZXJVcChlbnRpdHksIHR5cGUpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdTUEVFRCcpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5LnNwZWVkID0gTWF0aC5taW4odmVsb2NpdHkuc3BlZWQgKyAxLCA4KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVyU3lzdGVtcygpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlTWFwQ2VsbCA9ICh4LCB5LCBuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm1hcERhdGFbeV0pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5tYXBEYXRhW3ldW3hdID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCk7XG4gICAgICAgICAgICBpZiAoIXRpbGUpIHJldHVybjtcblxuICAgICAgICAgICAgdGlsZS5jbGFzc05hbWUgPSAndGlsZSB0aWxlLWZsb29yJztcbiAgICAgICAgICAgIHRpbGUuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybChcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIiknO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGRlc3Ryb3lCb3hDYWxsYmFjayA9ICh4LCB5KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGFpbWVkUG93ZXJVcHMuaGFzKGAke3h9LCR7eX1gKSkgcmV0dXJuO1xuICAgICAgICAgICAgc3Bhd25Qb3dlclVwKHRoaXMud29ybGQsIHgsIHksIHRoaXMuY29udGFpbmVyLCBUSUxFX1NJWkUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUGxheWVySHVydCA9IChlbnRpdHksIGlkLCByZW1haW5pbmdMaXZlcykgPT4ge1xuICAgICAgICAgICAgLy8gQWx3YXlzIG5vdGlmeSB0aGUgc2VydmVyIHdoZW4gQU5ZIHBsYXllciBkaWVzLlxuICAgICAgICAgICAgLy8gVGhlIHNlcnZlciB3aWxsIHZhbGlkYXRlIHRoZSBkZWF0aCBldmVudC5cbiAgICAgICAgICAgIGlmIChyZW1haW5pbmdMaXZlcyA8PSAwICYmIHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwbGF5ZXJfZGllZCdcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEhVRCBvbmx5IGZvciB0aGUgbG9jYWwgcGxheWVyLlxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHNldExpdmVzKHJlbWFpbmluZ0xpdmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBvd2VyVXBQaWNrZWQgPSAoaWQsIHR5cGUsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHt4fSwke3l9YCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgcGxheWVyLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHModGhpcy5sb2NhbFBsYXllckVudGl0eSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9XRVJVUF9QSUNLRUQnLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGlkLCB0eXBlLCB4LCB5IH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5icm9hZGNhc3RNb3ZlbWVudCA9IChlbnRpdHksIHgsIHksIGdyaWRYLCBncmlkWSwgZGlyZWN0aW9uLCBpc01vdmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAoIXBsYXllciB8fCAhdGhpcy5zb2NrZXQgfHwgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ01PVkVfU1RBVEUnLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBsYXllci5pZCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGlzTW92aW5nLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IG1vdmVtZW50U3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBib21iU3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGRhbWFnZVN5c3RlbSh0aGlzLndvcmxkLCBub3csIG9uUGxheWVySHVydCwgdGhpcy5sb2NhbFBsYXllckVudGl0eSwgVElMRV9TSVpFLCB0aGlzLnNvY2tldCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcG93ZXJVcFN5c3RlbSh3LCBvblBvd2VyVXBQaWNrZWQpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHJlbmRlclN5c3RlbSh3LCBkdCwgbm93LCBBTklNQVRJT05fUk9XUykpO1xuICAgIH1cblxuICAgIGdhbWVMb29wKG5vdykge1xuICAgICAgICBpZiAoIXRoaXMucnVubmluZykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGR0ID0gbm93IC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IG5vdztcbiAgICAgICAgdGhpcy53b3JsZC51cGRhdGUoZHQsIG5vdyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobmV4dE5vdykgPT4gdGhpcy5nYW1lTG9vcChuZXh0Tm93KSk7XG4gICAgfVxuXG4gICAgaGFuZGxlR2FtZU92ZXIod2lubmVyTmFtZSkge1xuICAgICAgICBpZiAodGhpcy5nYW1lRW5kZWQpIHJldHVybjsgLy8gUHJldmVudCBtdWx0aXBsZSB0cmlnZ2Vyc1xuICAgICAgICB0aGlzLmdhbWVFbmRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuXG4gICAgICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9ICdtZW51LXBhZ2UnO1xuICAgICAgICByZW5kZXIoPFdpbk1lbnUgd2lubmVyTmFtZT17d2lubmVyTmFtZX0gLz4sIHJvb3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBnYW1lIGVuZCBjb25kaXRpb25zIHdpdGggcHJvcGVyIHN0YXRlIGZsYWcgbWFuYWdlbWVudC5cbiAgICAgKiBQcmV2ZW50cyB0aGUgXCJMb29wIFRyYXBcIiAtIG1vZGFsIGlzIG9ubHkgcmVuZGVyZWQgT05DRSB3aGVuIGxpdmVzIHJlYWNoIDAuXG4gICAgICogQWxzbyBkaXNhYmxlcyBpbnB1dCBpbW1lZGlhdGVseSB3aGVuIHBsYXllciBkaWVzLlxuICAgICAqL1xuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUh1ZFN0YXRzKGVudGl0eSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgICAgIHNldExpdmVzKHBsYXllci5saXZlcyA/PyAzKTtcbiAgICAgICAgc2V0UmFuZ2UocGxheWVyLmJvbWJSYW5nZSB8fCA0KTtcbiAgICAgICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYm9tYlN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3QgYm9tYnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgYm9tYkVudGl0eSBvZiBib21icykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IGJvbWIgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgXG4gICAgICAgIGJvbWIudGltZXIgLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoYm9tYi50aW1lciA8PSAwICYmICFib21iLmV4cGxvZGVkKSB7XG4gICAgICAgICAgICBib21iLmV4cGxvZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgYWZmZWN0ZWRDZWxscyA9IGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBib21iLnJhbmdlLCBtYXBEYXRhKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWZmZWN0ZWRDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGV4cERpdi5jbGFzc05hbWUgPSAnZXhwbG9zaW9uJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Y2VsbC54ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS50b3AgPSBgJHtjZWxsLnkgKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnpJbmRleCA9ICc3JztcblxuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicsIHsgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYOiBjZWxsLngsIFxuICAgICAgICAgICAgICAgICAgICBncmlkWTogY2VsbC55LCBcbiAgICAgICAgICAgICAgICAgICAgeDogY2VsbC54ICogdGlsZVNpemUsIFxuICAgICAgICAgICAgICAgICAgICB5OiBjZWxsLnkgKiB0aWxlU2l6ZSBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJywgeyBkdXJhdGlvbjogNTAwLCBlbDogZXhwRGl2IH0pO1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChleHBEaXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhW2NlbGwueV0gJiYgbWFwRGF0YVtjZWxsLnldW2NlbGwueF0gPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTWFwQ2VsbChjZWxsLngsIGNlbGwueSwgMik7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzdHJveUJveENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95Qm94Q2FsbGJhY2soY2VsbC54LCBjZWxsLnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChib21iLmVsICYmIGJvbWIuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChib21iLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoYm9tYkVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgIGNvbnN0IGV4cCA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nKTtcbiAgICAgICAgZXhwLmR1cmF0aW9uIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGV4cC5kdXJhdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICBpZiAoZXhwLmVsICYmIGV4cC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZXhwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXhwLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoZXhwRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMoYngsIGJ5LCByYW5nZSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGxzID0gW3sgeDogYngsIHk6IGJ5IH1dO1xuICAgIGNvbnN0IGRpcmVjdGlvbnMgPSBbXG4gICAgICAgIHsgeDogMCwgeTogLTEgfSxcbiAgICAgICAgeyB4OiAwLCB5OiAxIH0sXG4gICAgICAgIHsgeDogLTEsIHk6IDAgfSxcbiAgICAgICAgeyB4OiAxLCB5OiAwIH1cbiAgICBdO1xuICAgIFxuICAgIGNvbnN0IHN0ZXBzID0gcmFuZ2UgLSAxOyBcbiAgICBcbiAgICBkaXJlY3Rpb25zLmZvckVhY2goZGlyID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdHggPSBieCArIChkaXIueCAqIGkpO1xuICAgICAgICAgICAgY29uc3QgdHkgPSBieSArIChkaXIueSAqIGkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW1hcERhdGFbdHldIHx8IG1hcERhdGFbdHldW3R4XSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY2VsbFR5cGUgPSBtYXBEYXRhW3R5XVt0eF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjZWxscy5wdXNoKHsgeDogdHgsIHk6IHR5IH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBjZWxscztcbn1cbiIsIi8qKlxuICogU3Bhd25zIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBzcGVjaWZpZWQgZ3JpZCBjb29yZGluYXRlcy5cbiAqIFRoaXMgY3JlYXRlcyBhIHByb3BlciBFQ1MgZW50aXR5IHdpdGggUG9zaXRpb24sIFBvd2VyVXAsIGFuZCBSZW5kZXJhYmxlIGNvbXBvbmVudHMuXG4gKiBcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBncmlkWCAtIEdyaWQgWCBjb29yZGluYXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZ3JpZFkgLSBHcmlkIFkgY29vcmRpbmF0ZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwYXduSGVhcnRQb3dlclVwKHdvcmxkLCBncmlkWCwgZ3JpZFksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIC8vIENyZWF0ZSBhIG5ldyBlbnRpdHkgZm9yIHRoZSBoZWFydCBwb3dlci11cFxuICAgIGNvbnN0IGhlYXJ0RW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgXG4gICAgLy8gQWRkIFBvc2l0aW9uIGNvbXBvbmVudFxuICAgIHdvcmxkLmFkZENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvc2l0aW9uJywge1xuICAgICAgICBncmlkWDogZ3JpZFgsXG4gICAgICAgIGdyaWRZOiBncmlkWSxcbiAgICAgICAgeDogZ3JpZFggKiB0aWxlU2l6ZSxcbiAgICAgICAgeTogZ3JpZFkgKiB0aWxlU2l6ZVxuICAgIH0pO1xuICAgIFxuICAgIC8vIEFkZCBQb3dlclVwIGNvbXBvbmVudCB3aXRoIHR5cGUgJ0hFQVJUJ1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvd2VyVXAnLCB7XG4gICAgICAgIHR5cGU6ICdIRUFSVCcsXG4gICAgICAgIHBpY2tlZFVwOiBmYWxzZSxcbiAgICAgICAgZWw6IG51bGwgIC8vIFdpbGwgYmUgc2V0IGFmdGVyIGNyZWF0aW5nIHRoZSBET00gZWxlbWVudFxuICAgIH0pO1xuICAgIFxuICAgIC8vIENyZWF0ZSB0aGUgRE9NIGVsZW1lbnQgZm9yIHJlbmRlcmluZ1xuICAgIGNvbnN0IGhlYXJ0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhcnREaXYuY2xhc3NOYW1lID0gJ3Bvd2VydXAgcG93ZXJ1cC1oZWFydCc7XG4gICAgaGVhcnREaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICBoZWFydERpdi5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcbiAgICBoZWFydERpdi5zdHlsZS5mb250U2l6ZSA9ICczMnB4JztcbiAgICBoZWFydERpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgaGVhcnREaXYudGV4dENvbnRlbnQgPSAn4p2k77iPJztcbiAgICBcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaGVhcnREaXYpO1xuICAgIFxuICAgIC8vIFVwZGF0ZSB0aGUgUG93ZXJVcCBjb21wb25lbnQgd2l0aCB0aGUgRE9NIGVsZW1lbnQgcmVmZXJlbmNlXG4gICAgY29uc3QgcG93ZXJVcCA9IHdvcmxkLmdldENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICBpZiAocG93ZXJVcCkge1xuICAgICAgICBwb3dlclVwLmVsID0gaGVhcnREaXY7XG4gICAgfVxuICAgIFxuICAgIGNvbnNvbGUubG9nKGBbSGVhcnQgRHJvcF0gU3Bhd25lZCBIRUFSVCBwb3dlci11cCBhdCAoJHtncmlkWH0sICR7Z3JpZFl9KWApO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgcGxheWVyIGRlYXRoIHRyYW5zaXRpb24gd2hlbiBsaXZlcyByZWFjaCAwLlxuICogUmVtb3ZlcyB0aGUgcGxheWVyJ3MgRE9NIGVsZW1lbnQgYW5kIHNwYXducyBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgZGVhdGggbG9jYXRpb24uXG4gKiBcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJFbnRpdHkgLSBUaGUgZW50aXR5IElEIG9mIHRoZSBkeWluZyBwbGF5ZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBnYW1lIGNvbnRhaW5lciBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplID0gNjQsIGNvbnRhaW5lciA9IG51bGwpIHtcbiAgICAvLyBHZXQgdGhlIHBsYXllcidzIGNvbXBvbmVudHNcbiAgICBjb25zdCBwb3NpdGlvbiA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICBcbiAgICBpZiAoIXBvc2l0aW9uIHx8ICFyZW5kZXJhYmxlIHx8ICFwbGF5ZXIpIHJldHVybjtcbiAgICBcbiAgICAvLyBTdG9yZSB0aGUgZ3JpZCBjb29yZGluYXRlcyB3aGVyZSB0aGUgcGxheWVyIGRpZWRcbiAgICBjb25zdCBkZWF0aEdyaWRYID0gTWF0aC5mbG9vcigocG9zaXRpb24ueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgY29uc3QgZGVhdGhHcmlkWSA9IE1hdGguZmxvb3IoKHBvc2l0aW9uLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgIFxuICAgIC8vIDEuIEluc3RlYWQgb2YgZGVzdHJveWluZyB0aGUgZW50aXR5LCByZW1vdmUgY29tcG9uZW50cyB0aGF0IGVuYWJsZSBpbnRlcmFjdGlvbiBhbmQgcmVuZGVyaW5nLlxuICAgIC8vIFRoaXMgZWZmZWN0aXZlbHkgdHVybnMgdGhlIHBsYXllciBpbnRvIGEgbm9uLWludGVyYWN0aXZlIFwiZ2hvc3RcIiBvciBzcGVjdGF0b3IuXG4gICAgd29ybGQucmVtb3ZlQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnKTsgLy8gVGhpcyB3aWxsIHN0b3AgaXQgZnJvbSBiZWluZyBkcmF3blxuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgIC8vIFdlIGtlZXAgUG9zaXRpb24gYW5kIFBsYXllciBjb21wb25lbnRzIHRvIGtub3cgd2hlcmUgdGhleSBhcmUgYW5kIHdobyB0aGV5IGFyZS5cbiAgICBcbiAgICAvLyAyLiBTcGF3biBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgZGVhdGggbG9jYXRpb24gKHByb3BlciBFQ1MgZW50aXR5KVxuICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBjb250YWluZXIgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgc3Bhd25IZWFydFBvd2VyVXAod29ybGQsIGRlYXRoR3JpZFgsIGRlYXRoR3JpZFksIGdhbWVDb250YWluZXIsIHRpbGVTaXplKTtcbiAgICB9XG4gICAgXG4gICAgY29uc29sZS5sb2coYFtQbGF5ZXIgRGVhdGhdIFBsYXllciAke3BsYXllci5pZH0gZGllZCBhdCAoJHtkZWF0aEdyaWRYfSwgJHtkZWF0aEdyaWRZfSkuIEhlYXJ0IHBvd2VyLXVwIGRyb3BwZWQuYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYW1hZ2VTeXN0ZW0od29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCBsb2NhbFBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgc29ja2V0KSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQbGF5ZXInKTtcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAocGxheWVyLmludmluY2libGVVbnRpbCAmJiBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID4gbm93KSBjb250aW51ZTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gR3JpZC1iYXNlZCBjb2xsaXNpb25cbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRYID0gTWF0aC5mbG9vcigocFBvcy54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRZID0gTWF0aC5mbG9vcigocFBvcy55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcblxuICAgICAgICAgICAgaWYgKHBsYXllckdyaWRYID09PSBlUG9zLmdyaWRYICYmIHBsYXllckdyaWRZID09PSBlUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNMaXZlcyA9IHBsYXllci5saXZlcyA/PyAzO1xuICAgICAgICAgICAgICAgIHBsYXllci5saXZlcyA9IE1hdGgubWF4KHByZXZpb3VzTGl2ZXMgLSAxLCAwKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID0gbm93ICsgMTUwMDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBBbHdheXMgY2FsbCB0aGUgY2FsbGJhY2sgdG8gdXBkYXRlIEhVRCBvciBub3RpZnkgc2VydmVyLlxuICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCBwbGF5ZXIubGl2ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcGxheWVyIGlzIGRlYWQsIFRIRU4gcGVyZm9ybSBsb2NhbCBjbGVhbnVwLlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaGFwcGVucyBBRlRFUiB0aGUgc2VydmVyIGhhcyBiZWVuIG5vdGlmaWVkIHZpYSB0aGUgY2FsbGJhY2suXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5saXZlcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQnJlYWsgdGhlIGxvb3Agc2luY2UgdGhlIHBsYXllciBoYXMgYWxyZWFkeSB0YWtlbiBkYW1hZ2UgZnJvbSB0aGlzIGV4cGxvc2lvbi5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgZnVuY3Rpb24gbW92ZW1lbnRTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHRpbGVTaXplID0gNDApIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScpO1xuICAgIGNvbnN0IGRlbHRhID0gZHQgLyAxNi42NztcblxuICAgIGNvbnN0IFBMQVlFUl9TSVpFID0gdGlsZVNpemU7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgIGNvbnN0IGJlaGF2aW9yID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JlaGF2aW9yJyk7XG5cbiAgICAgICAgaWYgKGJlaGF2aW9yKSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkICsgKGJlaGF2aW9yLmZhc3RTaG9lc0xldmVsIC0gMSkgKiAwLjU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3RpdmVJbnB1dCA9IGlucHV0LmlucHV0UXVldWVbMF07XG4gICAgICAgIGxldCBkeCA9IDA7XG4gICAgICAgIGxldCBkeSA9IDA7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUlucHV0ID09PSAndXAnKSB7XG4gICAgICAgICAgICBkeSA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdkb3duJykge1xuICAgICAgICAgICAgZHkgPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdkb3duJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICBkeCA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgZHggPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdyaWdodCc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNJbnB1dCA9IGR4ICE9PSAwIHx8IGR5ICE9PSAwO1xuXG4gICAgICAgIGlmICghaGFzSW5wdXQpIHtcbiAgICAgICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuICAgICAgICAgICAgdmVsLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdJRExFJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFkgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgY29uc3Qgc25hcFRocmVzaG9sZCA9IDMyO1xuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiBkeCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChwb3MueCwgbmV4dFksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVggPSBNYXRoLmZsb29yKChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WCA9IGN1cnJlbnRUaWxlWCAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZYID0gcG9zLnggLSB0YXJnZXRYO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZYKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeCA9IC1NYXRoLnNpZ24oZGlmZlgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChuZXh0WCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVkgPSBNYXRoLmZsb29yKChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WSA9IGN1cnJlbnRUaWxlWSAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZZID0gcG9zLnkgLSB0YXJnZXRZO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZZKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeSA9IC1NYXRoLnNpZ24oZGlmZlkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYQWZ0ZXJTbmFwID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WUFmdGVyU25hcCA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgIWlzQmxvY2tlZChuZXh0WEFmdGVyU25hcCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy54ID0gbmV4dFhBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgIWlzQmxvY2tlZChwb3MueCwgbmV4dFlBZnRlclNuYXAsIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy55ID0gbmV4dFlBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdSVU4nO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuXG4gICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKSB7XG4gICAgY29uc3Qgc3RlcCA9IHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgaWYgKHBvcy54IDwgcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1pbihwb3MueCArIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9IGVsc2UgaWYgKHBvcy54ID4gcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1heChwb3MueCAtIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9XG5cbiAgICBpZiAocG9zLnkgPCBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWluKHBvcy55ICsgc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH0gZWxzZSBpZiAocG9zLnkgPiBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWF4KHBvcy55IC0gc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH1cblxuICAgIHZlbC5pc01vdmluZyA9XG4gICAgICAgIHBvcy54ICE9PSBwb3MudGFyZ2V0WCB8fFxuICAgICAgICBwb3MueSAhPT0gcG9zLnRhcmdldFk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZCh4LCB5LCBtYXBEYXRhLCB0aWxlU2l6ZSwgcGxheWVyU2l6ZSA9IHRpbGVTaXplKSB7XG4gICAgY29uc3QgcGFkZGluZyA9IDQ7XG5cbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHJpZ2h0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCB0b3AgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgYm90dG9tID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIGJvdHRvbSwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgYm90dG9tLCBtYXBEYXRhKVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZENlbGwoeCwgeSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGwgPSBtYXBEYXRhW3ldICYmIG1hcERhdGFbeV1beF07XG5cbiAgICByZXR1cm4gY2VsbCAhPT0gMCAmJiBjZWxsICE9PSAyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHBvd2VyVXBTeXN0ZW0od29ybGQsIG9uUG93ZXJVcFBpY2tlZCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUGxheWVyJyk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcFBvcyB8fCAhdmVsIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcFVwRW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCB1cFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcFVwID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghdXBQb3MgfHwgIXBVcCB8fCBwVXAucGlja2VkVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocFBvcy5ncmlkWCA9PT0gdXBQb3MuZ3JpZFggJiYgcFBvcy5ncmlkWSA9PT0gdXBQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC50eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlbC5zcGVlZCA9IE1hdGgubWluKHZlbC5zcGVlZCArIDEsIDgpOyBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEhlYXJ0IHBvd2VyLXVwOiBpbmNyZW1lbnQgcGxheWVyJ3MgbGl2ZXMgYnkgMVxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSAocGxheWVyLmxpdmVzIHx8IDApICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocFVwLmVsICYmIHBVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9uUG93ZXJVcFBpY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICBvblBvd2VyVXBQaWNrZWQocGxheWVyLmlkLCBwVXAudHlwZSwgdXBQb3MuZ3JpZFgsIHVwUG9zLmdyaWRZKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KHBVcEVudGl0eSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7IFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Bhd25Qb3dlclVwKHdvcmxkLCBneCwgZ3ksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IHNlZWQgPSBneCAqIDczODU2MDkzIF4gZ3kgKiAxOTM0OTY2MztcbiAgICBjb25zdCBzZWVkUmFuZG9tID0gKE1hdGguc2luKHNlZWQpICogMTAwMDApIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkKSAqIDEwMDAwKTtcbiAgICBcbiAgICBpZiAoc2VlZFJhbmRvbSA+IDAuMzUpIHJldHVybjtcblxuICAgIGNvbnN0IHR5cGVzID0gWydTUEVFRCcsICdCT01CUycsICdGTEFNRSddO1xuICAgIGNvbnN0IHR5cGVJbmRleCA9IE1hdGguZmxvb3IoKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCkpICogdHlwZXMubGVuZ3RoKTtcbiAgICBjb25zdCByYW5kb21UeXBlID0gdHlwZXNbdHlwZUluZGV4XTtcblxuICAgIGNvbnN0IHBVcEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogdGlsZVNpemUsIHk6IGd5ICogdGlsZVNpemUgfSk7XG4gICAgXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9IGBwb3dlcnVwIHBvd2VydXAtJHtyYW5kb21UeXBlLnRvTG93ZXJDYXNlKCl9YDtcbiAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnRvcCA9IGAke2d5ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcsIHsgdHlwZTogcmFuZG9tVHlwZSwgZWw6IGRpdiB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByZW5kZXJTeXN0ZW0od29ybGQsIGR0LCBub3csIGFuaW1Sb3dzKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUmVuZGVyYWJsZScpO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcblxuICAgICAgICBpZiAoIXJlbmRlcmFibGUuZWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gcmVuZGVyYWJsZS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Um93ID0gYW5pbVJvd3Nbc3RhdGVdW3ZlbC5kaXJlY3Rpb25dO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYW5pbWF0aW9uIHdoZW4gcm93IG9yIHN0YXRlIGNoYW5nZXNcbiAgICAgICAgaWYgKHJlbmRlcmFibGUucm93ICE9PSB0YXJnZXRSb3cgfHwgcmVuZGVyYWJsZS5sYXN0U3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnJvdyA9IHRhcmdldFJvdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdFN0YXRlID0gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcmFtZUNvdW50ID0gc3RhdGUgPT09ICdSVU4nID8gcmVuZGVyYWJsZS5ydW5GcmFtZXMgOiByZW5kZXJhYmxlLmlkbGVGcmFtZXM7XG4gICAgICAgIGNvbnN0IGZyYW1lRGVsYXkgPSBzdGF0ZSA9PT0gJ1JVTicgPyAxMDAwIC8gcmVuZGVyYWJsZS5mcHMgOiAxMDAwIC8gcmVuZGVyYWJsZS5pZGxlRnBzO1xuXG4gICAgICAgIGlmIChub3cgLSByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPiBmcmFtZURlbGF5KSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IChyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSArIDEpICUgZnJhbWVDb3VudDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvc1ggPSAtKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICogcmVuZGVyYWJsZS5mcmFtZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcG9zWSA9IC0ocmVuZGVyYWJsZS5yb3cgKiByZW5kZXJhYmxlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYCR7cG9zWH1weCAke3Bvc1l9cHhgO1xuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3Bvcy54fXB4LCAke3Bvcy55fXB4LCAwKWA7XG4gICAgfVxufVxuIiwiLy8gL3NyYy9lY3Mvd29ybGQuanNcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uZXh0RW50aXR5SWQgPSAwO1xuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgTWFwKCk7IFxuICAgICAgICB0aGlzLnN5c3RlbXMgPSBbXTtcbiAgICB9XG5cbiAgICBjcmVhdGVFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMubmV4dEVudGl0eUlkKys7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkKGVudGl0eSk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVudGl0eShlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgZm9yIChjb25zdCBbY29tcG9uZW50TmFtZSwgY29tcG9uZW50TWFwXSBvZiB0aGlzLmNvbXBvbmVudHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lLCBjb21wb25lbnREYXRhID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHMuaGFzKGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIG5ldyBNYXAoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKS5zZXQoZW50aXR5LCBjb21wb25lbnREYXRhKTtcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRNYXAgPyBjb21wb25lbnRNYXAuZ2V0KGVudGl0eSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBpZiAoY29tcG9uZW50TWFwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBxdWVyeSguLi5jb21wb25lbnROYW1lcykge1xuICAgICAgICBpZiAoY29tcG9uZW50TmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaXJzdE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbMF0pO1xuICAgICAgICBpZiAoIWZpcnN0TWFwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGZpcnN0TWFwLmtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGhhc0FsbCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNvbXBvbmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXAgfHwgIW1hcC5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0FsbCAmJiB0aGlzLmVudGl0aWVzLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkU3lzdGVtKHN5c3RlbUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbUZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZHQsIG5vdykge1xuICAgICAgICBmb3IgKGNvbnN0IHN5c3RlbSBvZiB0aGlzLnN5c3RlbXMpIHtcbiAgICAgICAgICAgIHN5c3RlbSh0aGlzLCBkdCwgbm93KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBXaW5NZW51KHByb3BzKSB7XG4gICAgY29uc3Qgd2lubmVyTmFtZSA9IHByb3BzLndpbm5lck5hbWUgfHwgXCJBIFBsYXllclwiO1xuXG4gICAgY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG4gICAgcmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIC8vIFRoaXMgaGFyZCByZWxvYWQgaXMgYSByZWxpYWJsZSB3YXkgdG8gcmVzZXQgdGhlIGdhbWUgc3RhdGUgYW5kIHJldHVybiB0byB0aGUgc3RhcnQuXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgICAgICA8aDE+e3dpbm5lck5hbWUudG9VcHBlckNhc2UoKX0gV09OITwvaDE+XG4gICAgICAgICAgICA8cD5UaGUgbGFzdCBwbGF5ZXIgc3RhbmRpbmcgdGFrZXMgdGhlIGNyb3duLjwvcD5cbiAgICAgICAgICAgIHtyZXBsYXlCdG59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBHUklEX0JPUkRFUl9TSVpFID0gNjtcbmNvbnN0IEdBTUVfQ0hST01FX1dJRFRIID0gNzI7XG5jb25zdCBHQU1FX0NIUk9NRV9IRUlHSFQgPSAxNTA7XG5cbmNvbnN0IGltYWdlcyA9IHtcbiAgICAyOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIixcbiAgICAzOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja193YWxsLnBuZ1wiLFxuICAgIDQ6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2V4cGxvaXQucG5nXCIsXG59O1xuXG5jb25zdCBbcGxheWVyTmFtZSwgc2V0UGxheWVyTmFtZV0gPSBjcmVhdGVTaWduYWwoXCJQbGF5ZXIgMVwiKTtcbmNvbnN0IFtsaXZlcywgc2V0TGl2ZXNdID0gY3JlYXRlU2lnbmFsKDMpO1xuY29uc3QgW3NwZWVkLCBzZXRTcGVlZF0gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbYm9tYnMsIHNldEJvbWJzXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtyYW5nZSwgc2V0UmFuZ2VdID0gY3JlYXRlU2lnbmFsKDEpO1xuZXhwb3J0IHsgc2V0UGxheWVyTmFtZSwgc2V0TGl2ZXMsIHNldFNwZWVkLCBzZXRCb21icywgc2V0UmFuZ2UgfTtcblxuY29uc3QgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IG5hbWVFbC50ZXh0Q29udGVudCA9IHBsYXllck5hbWUoKTsgfSk7XG5cbmNvbnN0IGxpdmVzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGxpdmVzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHNwZWVkRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHNwZWVkLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IGJvbWJzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGJvbWJzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHJhbmdlRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHJhbmdlLXZhbHVlXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbGl2ZXNFbC50ZXh0Q29udGVudCA9IGxpdmVzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgc3BlZWRFbC50ZXh0Q29udGVudCA9IHNwZWVkKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgYm9tYnNFbC50ZXh0Q29udGVudCA9IGJvbWJzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgcmFuZ2VFbC50ZXh0Q29udGVudCA9IHJhbmdlKCk7IH0pO1xuXG5mdW5jdGlvbiBHYW1lKHsgZ3JpZCB9KSB7XG4gICAgY29uc3QgYm9hcmRXaWR0aCA9IGdyaWRbMF0ubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gZ3JpZC5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRPdXRlcldpZHRoID0gYm9hcmRXaWR0aCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJIZWlnaHQgPSBib2FyZEhlaWdodCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRXaWR0aCA6IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGJvYXJkSGVpZ2h0IDogd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHNjYWxlID0gTWF0aC5taW4oXG4gICAgICAgIDEsXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0V2lkdGggLSBHQU1FX0NIUk9NRV9XSURUSCkgLyBib2FyZE91dGVyV2lkdGgpLFxuICAgICAgICBNYXRoLm1heCgwLjIsICh2aWV3cG9ydEhlaWdodCAtIEdBTUVfQ0hST01FX0hFSUdIVCkgLyBib2FyZE91dGVySGVpZ2h0KVxuICAgICk7XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBncmlkLmxlbmd0aDsgcm93SW5kZXgrKykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgZ3JpZFtyb3dJbmRleF0ubGVuZ3RoOyBjb2xJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZ3JpZFtyb3dJbmRleF1bY29sSW5kZXhdO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IFwidGlsZVwiO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gYHdpZHRoOiR7VElMRV9TSVpFfXB4O2hlaWdodDoke1RJTEVfU0laRX1weDtgO1xuXG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMiB8fCBjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtZmxvb3JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtd2FsbFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1szXX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzRdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDAgfHwgY2VsbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1syXX0pYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2VsbHMucHVzaCg8ZGl2IGNsYXNzPXtjbGFzc05hbWV9IGRhdGEteD17Y29sSW5kZXh9IGRhdGEteT17cm93SW5kZXh9IHN0eWxlPXtzdHlsZX0+PC9kaXY+KTtcbiAgICAgICAgfVxuICAgICAgICByb3dzLnB1c2goPGRpdiBjbGFzcz1cImdyaWQtcm93XCI+e2NlbGxzfTwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1nbGFzc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1iYXJcIj5cbiAgICAgICAgICAgICAgICAgICAge25hbWVFbH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLXN0YXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkxpdmVzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsaXZlc0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlNwZWVkPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzcGVlZEVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkJvbWJzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib21ic0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlJhbmdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyYW5nZUVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWJvYXJkLWZyYW1lXCIgc3R5bGU9e2B3aWR0aDoke2JvYXJkT3V0ZXJXaWR0aCAqIHNjYWxlfXB4O2hlaWdodDoke2JvYXJkT3V0ZXJIZWlnaHQgKiBzY2FsZX1weDtgfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJnYW1lLWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImdhbWUtZ3JpZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17YHBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiR7Ym9hcmRXaWR0aH1weDtoZWlnaHQ6JHtib2FyZEhlaWdodH1weDt0cmFuc2Zvcm06c2NhbGUoJHtzY2FsZX0pO2B9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCBDaGF0UGxheWVycyBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmxldCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gY3JlYXRlU2lnbmFsKHt9KTtcbmV4cG9ydCB7IHNldFN0YXRlcyB9O1xuXG5sZXQgcm9vbUlkRWwgPSA8cD5Sb29tIElEOiA8L3A+O1xubGV0IHBsYXllcnNFbCA9IDxwPlBsYXllcnM6ICAvIDQ8L3A+O1xubGV0IHRleHRFbCA9IDxwPjwvcD47XG5sZXQgdGltZXJFbCA9IDxwPlRpbWVyOiA8L3A+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHMgPSBzdGF0ZXMoKTtcbiAgICByb29tSWRFbC50ZXh0Q29udGVudCA9IGBSb29tIElEOiAke3Mucm9vbUlkfWA7XG4gICAgcGxheWVyc0VsLnRleHRDb250ZW50ID0gYFBsYXllcnM6ICR7cy5wbGF5ZXJzQ291bnR9IC8gNGA7XG4gICAgdGV4dEVsLnRleHRDb250ZW50ID0gcy50ZXh0IHx8IFwiXCI7XG5cbiAgICBpZiAocy5nYW1lU3RhcnRlZCkge1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gXCJUaW1lcjogR2FtZSBzdGFydGVkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGltZXJUZXh0ID0gKCFzLnNlY29uZHNMZWZ0KSA/IFwiV2FpdGluZyBmb3Igb25lIG1vcmUgcGxheWVyXCIgOiBgJHtzLnNlY29uZHNMZWZ0fSBzZWNvbmRzYDtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IGBUaW1lcjogJHt0aW1lclRleHR9YDtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gTG9iYnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbmF0aW5lci1sb2JieVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYmJ5LWJveFwiPlxuICAgICAgICAgICAgICAgIDxoMT5Mb2JieTwvaDE+XG4gICAgICAgICAgICAgICAge3Jvb21JZEVsfVxuICAgICAgICAgICAgICAgIHtwbGF5ZXJzRWx9XG4gICAgICAgICAgICAgICAge3RleHRFbH1cbiAgICAgICAgICAgICAgICB7dGltZXJFbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPENoYXRQbGF5ZXJzIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG5yZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5sZXQgbWVudUVsID0gKFxuICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICA8aDE+WW91IFdpbiE8L2gxPlxuICAgICAgICA8cD5BbGwgb3RoZXIgcGxheWVycyBoYXZlIGxlZnQgdGhlIGdhbWUuPC9wPlxuICAgICAgICB7cmVwbGF5QnRufVxuICAgIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVudSgpIHtcbiAgICByZXR1cm4gbWVudUVsO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcblxuZnVuY3Rpb24gUmVnaXN0ZXIoeyB3c3MgfSkge1xuICAgIGxldCBzdWJtaXR0ZWQgPSBmYWxzZTtcblxuICAgIGxldCBwbGF5ZXJFbnRlciA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHN1Ym1pdHRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUgfHwgbmlja25hbWUubGVuZ3RoID4gMjApIHJldHVybjtcblxuICAgICAgICBzdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzZXRQbGF5ZXJOYW1lKG5pY2tuYW1lKTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcIm5pY2tuYW1lX29mX3RoZV9wbGF5ZXJcIixcbiAgICAgICAgICAgIG5pY2tuYW1lOiBuaWNrbmFtZVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgb25TdWJtaXQ9e3BsYXllckVudGVyfT5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5pY2tuYW1lLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVudGVyIHlvdXIgbmFtZVwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMucGxheSgpLCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5tdXNpYy5wbGF5KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5tdXNpYy5wYXVzZWQgfHwgdGhpcy5tdXNpYy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9uXCIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUJ1dHRvbigpIHtcbiAgICAgICAgY29uc3QgaXNNdXRlZCA9IHRoaXMubXVzaWMubXV0ZWQgfHwgdGhpcy5tdXNpYy5wYXVzZWQ7XG5cbiAgICAgICAgdGhpcy5pY29uLmNsYXNzTmFtZSA9IGlzTXV0ZWQgPyBcImZhLXNvbGlkIGZhLXZvbHVtZS1vZmZcIiA6IFwiZmEtc29saWQgZmEtdm9sdW1lLWhpZ2hcIjtcbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImlzLW11dGVkXCIsIGlzTXV0ZWQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291bmQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwL2FwcC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwidHlwZSIsInByb3BzIiwiY2hpbGRyZW4iLCJlbGUiLCJkb2N1bWVudCIsImtleSIsInN0YXJ0c1dpdGgiLCJldmVudE5hbWUiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldEF0dHJpYnV0ZSIsImZsYXRDaGlsZHJlbiIsImZsYXQiLCJJbmZpbml0eSIsImFwcGVuZCIsImZpbHRlciIsImNoaWxkIiwidW5kZWZpbmVkIiwicmVuZGVyIiwiZWxlbWVudCIsImNvbnRhaW5lciIsInJlcGxhY2VDaGlsZHJlbiIsIlJvdXRlciIsInJvdXRlciIsImVmZmVjdFN0YWNrIiwiYWN0aXZlRWZmZWN0IiwiY3JlYXRlU2lnbmFsIiwiaW5pdGlhbFZhbHVlIiwidmFsdWUiLCJlZmZlY3RzIiwiU2V0IiwiUmVhZCIsImFkZCIsIldyaXRlIiwibmV3VmFsdWUiLCJmbiIsImZvckVhY2giLCJlZmZlY3QiLCJjcmVhdGVFZmZlY3QiLCJwdXNoIiwicG9wIiwibGVuZ3RoIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInVybCIsIlVSTCIsImhyZWYiLCJsaXN0ZW4iLCJvbkVycm9yNDA0IiwiZXZlbnQiLCJkZXN0aW5hdGlvbiIsImludGVyY2VwdCIsImNvbnNvbGUiLCJsb2ciLCJSZWdpc3RlciIsIkdhbWUiLCJNZW51IiwiTG9iYnkiLCJXaW5NZW51Iiwic2V0U3RhdGVzIiwic2V0UGxheWVyTmFtZSIsInNldEh1ZFBsYXllck5hbWUiLCJTb3VuZCIsInNldE1lc3NhZ2VzIiwiR2FtZUVuZ2luZSIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsIndpbmRvdyIsImhvc3RuYW1lIiwic291bmQiLCJjdXJyZW50R2FtZUVuZ2luZSIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJ3cyIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicXVlcnlTZWxlY3RvciIsInJvb21JZCIsInBsYXllcnNDb3VudCIsInNlY29uZHNMZWZ0IiwidGV4dCIsImdyaWQiLCJzZXRUaW1lb3V0IiwiZ2FtZUNvbnRhaW5lciIsImRlc3Ryb3kiLCJsb2NhbFBsYXllciIsInBsYXllcnMiLCJmaW5kIiwicGxheWVyIiwiaWQiLCJ5b3VyUGxheWVySWQiLCJuaWNrbmFtZSIsImVuZ2luZSIsImVycm9yIiwid2lubmVyTmFtZSIsInByZXYiLCJoYW5kbGVSZW1vdGVNb3ZlIiwicGF5bG9hZCIsImhhbmRsZVJlbW90ZUJvbWIiLCJoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkIiwiaGFuZGxlUmVtb3RlSXRlbVBpY2t1cCIsImVyciIsIm1lc3NhZ2VzIiwiQ2hhdFBsYXllcnMiLCJtZXNzYWdlc0NvbnRhaW5lciIsImNsYXNzIiwibXNncyIsImlubmVySFRNTCIsIm1zZyIsInAiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsImdldCIsInRyaW0iLCJyZXNldCIsInNlbmQiLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlBvc2l0aW9uQ29tcG9uZW50IiwiZ3giLCJneSIsInRpbGVTaXplIiwiZ3JpZFgiLCJncmlkWSIsIngiLCJ5IiwidGFyZ2V0WCIsInRhcmdldFkiLCJWZWxvY2l0eUNvbXBvbmVudCIsImJhc2VTcGVlZCIsInNwZWVkIiwiaXNNb3ZpbmciLCJkaXJlY3Rpb24iLCJJbnB1dENvbXBvbmVudCIsImlucHV0UXVldWUiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiZWwiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJ0b3RhbEZyYW1lcyIsImZwcyIsImN1cnJlbnRGcmFtZSIsInJ1bkZyYW1lcyIsImlkbGVGcmFtZXMiLCJpZGxlRnBzIiwibGFzdEZyYW1lVGltZSIsInJvdyIsInN0YXRlIiwibGFzdFN0YXRlIiwiUGxheWVyQ29tcG9uZW50IiwiY2hhclR5cGUiLCJpc0xvY2FsIiwiQm9tYkNvbXBvbmVudCIsIm93bmVySWQiLCJ0aW1lciIsInJhbmdlIiwiZXhwbG9kZWQiLCJFeHBsb3Npb25Db21wb25lbnQiLCJkdXJhdGlvbiIsIlBvd2VyVXBDb21wb25lbnQiLCJwaWNrZWRVcCIsIkJlaGF2aW9yQ29tcG9uZW50IiwiZ2hvc3RNb2RlIiwidGhyb3dhYmxlIiwiZGV0b25hdG9yIiwiZmFzdFNob2VzTGV2ZWwiLCJib21icyIsIm1heCIsImN1cnJlbnQiLCJXb3JsZCIsIm1vdmVtZW50U3lzdGVtIiwicmVuZGVyU3lzdGVtIiwiYm9tYlN5c3RlbSIsImRhbWFnZVN5c3RlbSIsImNoZWNrR2FtZUVuZENvbmRpdGlvbnMiLCJzcGF3bkhlYXJ0UG93ZXJVcCIsInBvd2VyVXBTeXN0ZW0iLCJzcGF3blBvd2VyVXAiLCJzZXRCb21icyIsInNldExpdmVzIiwic2V0UmFuZ2UiLCJzZXRTcGVlZCIsIlRJTEVfU0laRSIsIkFOSU1BVElPTl9ST1dTIiwiUlVOIiwidXAiLCJsZWZ0IiwiZG93biIsInJpZ2h0IiwiSURMRSIsImNvbnN0cnVjdG9yIiwiY2FudmFzQ29udGFpbmVyIiwibWFwRGF0YSIsInNvY2tldCIsIndvcmxkIiwibG9jYWxQbGF5ZXJFbnRpdHkiLCJwbGF5ZXJFbnRpdGllcyIsIk1hcCIsInBsYXllckluZm8iLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibG9zc01vZGFsVHJpZ2dlcmVkIiwiaW5wdXRFbmFibGVkIiwiZ2FtZUVuZGVkIiwibG9jYWxQbGF5ZXJJZCIsImFsbFBsYXllcnMiLCJ0b3RhbFBsYXllcnMiLCJub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCIsIlN0cmluZyIsInBEYXRhIiwicGxheWVySWQiLCJwbGF5ZXJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJzZXQiLCJwbGF5ZXJEaXYiLCJjb2xvciIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ3aWxsQ2hhbmdlIiwic3giLCJzeSIsImFkZENvbXBvbmVudCIsInBsYXllckNvbXAiLCJsaXZlcyIsIm1heEJvbWJzIiwiYm9tYlJhbmdlIiwidXBkYXRlSHVkU3RhdHMiLCJzZXR1cElucHV0Iiwid2FybiIsIm1hcCIsInJlZ2lzdGVyU3lzdGVtcyIsInBlcmZvcm1hbmNlIiwibm93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZ2FtZUxvb3AiLCJpbnB1dCIsImdldENvbXBvbmVudCIsImdldEtleURpcmVjdGlvbiIsImhhbmRsZUtleURvd24iLCJkaXIiLCJpbmNsdWRlcyIsImNvZGUiLCJkcm9wQm9tYiIsImhhbmRsZUtleVVwIiwiZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJwb3MiLCJjdXJyZW50Qm9tYnMiLCJxdWVyeSIsImJFbnRpdHkiLCJjcmVhdGVkIiwiY3JlYXRlQm9tYiIsInJlYWR5U3RhdGUiLCJPUEVOIiwiZXhpc3RzIiwic29tZSIsImVudGl0eSIsImJvbWIiLCJib21iRW50aXR5IiwiYm9tYkRpdiIsInRvcCIsImJvbWJDb21wIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsInZlbCIsInJlbmRlcmFibGUiLCJyZW1vdmVQb3dlclVwQXQiLCJhcHBseVBvd2VyVXAiLCJuZXdMaXZlcyIsInBvd2VyVXBzIiwicG93ZXJVcCIsInBhcmVudE5vZGUiLCJkZXN0cm95RW50aXR5IiwidmVsb2NpdHkiLCJNYXRoIiwibWluIiwidXBkYXRlTWFwQ2VsbCIsInRpbGUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJkZXN0cm95Qm94Q2FsbGJhY2siLCJoYXMiLCJvblBsYXllckh1cnQiLCJyZW1haW5pbmdMaXZlcyIsIm9uUG93ZXJVcFBpY2tlZCIsImJyb2FkY2FzdE1vdmVtZW50IiwiYWRkU3lzdGVtIiwidyIsImR0IiwidXBkYXRlIiwibmV4dE5vdyIsImhhbmRsZUdhbWVPdmVyIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJyb3VuZCIsImN1cnJlbnRMb2NhbFBsYXllck5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZ2V0UGxheWVyTmFtZSIsImdldEl0ZW0iLCJhZmZlY3RlZENlbGxzIiwiY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMiLCJjZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2Iiwid2lkdGgiLCJoZWlnaHQiLCJleHBsb3Npb25zIiwiZXhwIiwiYngiLCJieSIsImNlbGxzIiwiZGlyZWN0aW9ucyIsInN0ZXBzIiwiaSIsInR4IiwidHkiLCJjZWxsVHlwZSIsImhlYXJ0RW50aXR5IiwiaGVhcnREaXYiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiZm9udFNpemUiLCJoYW5kbGVQbGF5ZXJEZWF0aCIsImRlYXRoR3JpZFgiLCJmbG9vciIsImRlYXRoR3JpZFkiLCJyZW1vdmVDb21wb25lbnQiLCJwUG9zIiwiaW52aW5jaWJsZVVudGlsIiwiZVBvcyIsInBsYXllckdyaWRYIiwicGxheWVyR3JpZFkiLCJwcmV2aW91c0xpdmVzIiwiZW50aXRpZXMiLCJkZWx0YSIsIlBMQVlFUl9TSVpFIiwiYmVoYXZpb3IiLCJtb3ZlVG93YXJkVGFyZ2V0IiwiYWN0aXZlSW5wdXQiLCJkeCIsImR5IiwiaGFzSW5wdXQiLCJuZXh0WCIsIm5leHRZIiwic25hcFRocmVzaG9sZCIsImlzQmxvY2tlZCIsImN1cnJlbnRUaWxlWCIsImRpZmZYIiwiYWJzIiwic2lnbiIsImN1cnJlbnRUaWxlWSIsImRpZmZZIiwibmV4dFhBZnRlclNuYXAiLCJuZXh0WUFmdGVyU25hcCIsInN0ZXAiLCJwbGF5ZXJTaXplIiwicGFkZGluZyIsImJvdHRvbSIsImlzQmxvY2tlZENlbGwiLCJwVXBFbnRpdHkiLCJ1cFBvcyIsInBVcCIsInNlZWQiLCJzZWVkUmFuZG9tIiwic2luIiwidHlwZXMiLCJ0eXBlSW5kZXgiLCJyYW5kb21UeXBlIiwiZGl2IiwiYW5pbVJvd3MiLCJ0YXJnZXRSb3ciLCJmcmFtZUNvdW50IiwiZnJhbWVEZWxheSIsInBvc1giLCJwb3NZIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwidHJhbnNmb3JtIiwibmV4dEVudGl0eUlkIiwiY29tcG9uZW50cyIsInN5c3RlbXMiLCJkZWxldGUiLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50TWFwIiwiZW50cmllcyIsImNvbXBvbmVudERhdGEiLCJjb21wb25lbnROYW1lcyIsImZpcnN0TWFwIiwicmVzdWx0cyIsImhhc0FsbCIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwicmVwbGF5QnRuIiwicmVsb2FkIiwidG9VcHBlckNhc2UiLCJHUklEX0JPUkRFUl9TSVpFIiwiR0FNRV9DSFJPTUVfV0lEVEgiLCJHQU1FX0NIUk9NRV9IRUlHSFQiLCJpbWFnZXMiLCJwbGF5ZXJOYW1lIiwibmFtZUVsIiwibGl2ZXNFbCIsInNwZWVkRWwiLCJib21ic0VsIiwicmFuZ2VFbCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImJvYXJkT3V0ZXJXaWR0aCIsImJvYXJkT3V0ZXJIZWlnaHQiLCJ2aWV3cG9ydFdpZHRoIiwiaW5uZXJXaWR0aCIsInZpZXdwb3J0SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJzY2FsZSIsInJvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4Iiwic3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsImdhbWVTdGFydGVkIiwidGltZXJUZXh0IiwibWVudUVsIiwic3VibWl0dGVkIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImJ1dHRvbiIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwicGxheSIsIm9uY2UiLCJ1cGRhdGVCdXR0b24iLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiXSwic291cmNlUm9vdCI6IiJ9