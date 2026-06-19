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
    const onHeartPickedUp = (entity, playerId, newLives, gridX, gridY) => {
      this.claimedPowerUps.add(`${gridX},${gridY}`);

      // CRITICAL: Update HUD immediately for local player
      if (entity === this.localPlayerEntity) {
        (0,_pages_game__WEBPACK_IMPORTED_MODULE_9__.setLives)(newLives);
      }

      // Notify the server about the item pickup so it broadcasts to all clients
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'ITEM_PICKUP',
          payload: {
            playerId,
            newLives,
            gridX,
            gridY
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
    this.world.addSystem((w, dt, now) => (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_8__.powerUpSystem)(w, onPowerUpPicked, onHeartPickedUp));
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
function powerUpSystem(world, onPowerUpPicked, onHeartPickedUp) {
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
          // Heart power-up: increment player's lives by 1 (cap at 3)
          player.lives = Math.min((player.lives || 0) + 1, 3);
          // CRITICAL: Call the heart-specific callback immediately to update HUD
          if (onHeartPickedUp) {
            onHeartPickedUp(playerEntity, player.id, player.lives, upPos.gridX, upPos.gridY);
          }
        }
        if (pUp.el && pUp.el.parentNode) {
          pUp.el.parentNode.removeChild(pUp.el);
        }
        if (onPowerUpPicked && pUp.type !== 'HEART') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2hhdC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9tb3ZlbWVudFN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvcmVuZGVyU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvd29ybGQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL1dpbk1lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyIGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBNZW51IGZyb20gXCIuLi9wYWdlcy9tZW51XCI7XG5pbXBvcnQgTG9iYnkgZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgV2luTWVudSBmcm9tIFwiLi4vcGFnZXMvV2luTWVudS5qc3hcIjtcbmltcG9ydCB7IHNldFN0YXRlcyB9IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSBhcyBzZXRIdWRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBTb3VuZCBmcm9tIFwiLi4vdXRpbHMvc291bmRcIjtcbmltcG9ydCB7IHNldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5pbXBvcnQgeyBHYW1lRW5naW5lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7IFxuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChgd3M6Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZX06NTAwMGApO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5sZXQgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwicm9vbV91cGRhdGVcIjpcbiAgICAgICAgY2FzZSBcImxvYmJ5X3RpbWVyXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuICAgICAgICAgICAgaWYgKCFyb290LnF1ZXJ5U2VsZWN0b3IoXCIuY29uYXRpbmVyLWxvYmJ5XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKDxMb2JieSAvPiwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWQsXG4gICAgICAgICAgICAgICAgcGxheWVyc0NvdW50OiBtZXNzYWdlLnBsYXllcnNDb3VudCxcbiAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogbWVzc2FnZS5zZWNvbmRzTGVmdCxcbiAgICAgICAgICAgICAgICB0ZXh0OiBtZXNzYWdlLnRleHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJnYW1lX3N0YXJ0ZWRcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJnYW1lLXBhZ2VcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVuZGVyKDxHYW1lIGdyaWQ9e21lc3NhZ2UuZ3JpZH0gLz4sIHJvb3QpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsUGxheWVyID0gKG1lc3NhZ2UucGxheWVycyB8fCBbXSkuZmluZChwbGF5ZXIgPT4gcGxheWVyLmlkID09PSBtZXNzYWdlLnlvdXJQbGF5ZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciAmJiBsb2NhbFBsYXllci5uaWNrbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SHVkUGxheWVyTmFtZShsb2NhbFBsYXllci5uaWNrbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmdpbmUgPSBuZXcgR2FtZUVuZ2luZShnYW1lQ29udGFpbmVyLCBtZXNzYWdlLmdyaWQsIHdzcyk7XG4gICAgICAgICAgICAgICAgICAgIGVuZ2luZS5pbml0KG1lc3NhZ2UueW91clBsYXllcklkLCBtZXNzYWdlLnBsYXllcnMgfHwgW10pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBlbmdpbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdhbWUgY29udGFpbmVyIHdhcyBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcInJvb21fYWxvbmVcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgIHJlbmRlcig8TWVudSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZ2FtZV93b25cIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgIHJlbmRlcig8V2luTWVudSB3aW5uZXJOYW1lPXttZXNzYWdlLndpbm5lck5hbWV9IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJjaGF0X21lc3NhZ2VcIjpcbiAgICAgICAgICAgIHNldE1lc3NhZ2VzKHByZXYgPT4gWy4uLnByZXYgLG1lc3NhZ2UubWVzc2FnZV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfbW92ZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZU1vdmUobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm9tYl9kcm9wcGVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVCb21iKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBvd2VydXBfcGlja2VkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIml0ZW1fcGlja2VkXCI6XG4gICAgICAgICAgICAvLyBIYW5kbGUgcmVtb3RlIGhlYXJ0IHBpY2t1cCAtIHVwZGF0ZSB0aGUgcGxheWVyJ3MgbGl2ZXMgb24gYWxsIGNsaWVudHNcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZUl0ZW1QaWNrdXAobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yXCIsIGVycik7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZWRcIik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgd3NzO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCB3c3MgZnJvbSBcIi4uL2FwcC9hcHBcIjtcblxuY29uc3QgW21lc3NhZ2VzLCBzZXRNZXNzYWdlc10gPSBjcmVhdGVTaWduYWwoW10pO1xuZXhwb3J0IHsgc2V0TWVzc2FnZXMgfTtcblxuZnVuY3Rpb24gQ2hhdFBsYXllcnMoKSB7XG4gICAgY29uc3QgbWVzc2FnZXNDb250YWluZXIgPSA8ZGl2IGNsYXNzPVwibWVzc2FnZXNcIj48L2Rpdj47XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBtc2dzID0gbWVzc2FnZXMoKTtcbiAgICAgICAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBmb3IgKGxldCBtc2cgb2YgbXNncykge1xuICAgICAgICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IG1zZztcbiAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHApO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIucmVtb3ZlQ2hpbGQobWVzc2FnZXNDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgICAgIG1zZ3MudW5zaGlmdCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYnJvYWRjYXN0TWVzc2FnZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS50YXJnZXQpO1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGZvcm1EYXRhLmdldChcIm1lc3NhZ2VcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbWVzc2FnZSB8fCBtZXNzYWdlLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwiY2hhdF9tZXNzYWdlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICB9KSk7XG4gICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNoYXRcIiBvblN1Ym1pdD17YnJvYWRjYXN0TWVzc2FnZX0+XG4gICAgICAgICAgICB7bWVzc2FnZXNDb250YWluZXJ9XG4gICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibWVzc2FnZVwiIHBsYWNlaG9sZGVyPVwidHlwZSB0byB0aGUgb3RoZXIgcGxheWVycyAuLi5cIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5zZW5kPC9idXR0b24+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhdFBsYXllcnM7IiwiLy8gL3NyYy9lY3MvY29tcG9uZW50cy5qc1xuXG5leHBvcnQgY29uc3QgUG9zaXRpb25Db21wb25lbnQgPSAoZ3gsIGd5LCB0aWxlU2l6ZSA9IDY0KSA9PiAoe1xuICAgIGdyaWRYOiBneCxcbiAgICBncmlkWTogZ3ksXG4gICAgeDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB5OiBneSAqIHRpbGVTaXplLFxuICAgIHRhcmdldFg6IGd4ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WTogZ3kgKiB0aWxlU2l6ZVxufSk7XG5cbmV4cG9ydCBjb25zdCBWZWxvY2l0eUNvbXBvbmVudCA9IChiYXNlU3BlZWQgPSAyLjUpID0+ICh7XG4gICAgYmFzZVNwZWVkOiBiYXNlU3BlZWQsXG4gICAgc3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBpc01vdmluZzogZmFsc2UsXG4gICAgZGlyZWN0aW9uOiAnZG93bidcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5wdXRDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGlucHV0UXVldWU6IFtdXG59KTtcblxuZXhwb3J0IGNvbnN0IFJlbmRlcmFibGVDb21wb25lbnQgPSAoZWwsIGZyYW1lV2lkdGggPSA2NCwgZnJhbWVIZWlnaHQgPSA2NCwgdG90YWxGcmFtZXMgPSA0LCBmcHMgPSAxMikgPT4gKHtcbiAgICBlbDogZWwsXG4gICAgZnJhbWVXaWR0aDogZnJhbWVXaWR0aCxcbiAgICBmcmFtZUhlaWdodDogZnJhbWVIZWlnaHQsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiB0b3RhbEZyYW1lcyxcbiAgICBydW5GcmFtZXM6IDQsXG4gICAgaWRsZUZyYW1lczogMixcbiAgICBmcHM6IGZwcyxcbiAgICBpZGxlRnBzOiA0LFxuICAgIGxhc3RGcmFtZVRpbWU6IDAsXG4gICAgcm93OiAwLFxuICAgIHN0YXRlOiAnSURMRScsXG4gICAgbGFzdFN0YXRlOiAnSURMRSdcbn0pO1xuXG5leHBvcnQgY29uc3QgUGxheWVyQ29tcG9uZW50ID0gKGlkLCBjaGFyVHlwZSwgaXNMb2NhbCA9IGZhbHNlKSA9PiAoe1xuICAgIGlkOiBpZCxcbiAgICBjaGFyVHlwZTogY2hhclR5cGUsXG4gICAgaXNMb2NhbDogaXNMb2NhbFxufSk7XG5cbmV4cG9ydCBjb25zdCBCb21iQ29tcG9uZW50ID0gKG93bmVySWQsIHRpbWVyID0gMjAwMCwgcmFuZ2UgPSA0KSA9PiAoe1xuICAgIG93bmVySWQ6IG93bmVySWQsXG4gICAgdGltZXI6IHRpbWVyLFxuICAgIHJhbmdlOiByYW5nZSxcbiAgICBleHBsb2RlZDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgRXhwbG9zaW9uQ29tcG9uZW50ID0gKGR1cmF0aW9uID0gNTAwKSA9PiAoe1xuICAgIGR1cmF0aW9uOiBkdXJhdGlvblxufSk7XG5cbmV4cG9ydCBjb25zdCBQb3dlclVwQ29tcG9uZW50ID0gKHR5cGUpID0+ICh7XG4gICAgdHlwZTogdHlwZSwgXG4gICAgcGlja2VkVXA6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEJlaGF2aW9yQ29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBnaG9zdE1vZGU6IGZhbHNlLFxuICAgIHRocm93YWJsZTogZmFsc2UsXG4gICAgZGV0b25hdG9yOiBmYWxzZSxcbiAgICBmYXN0U2hvZXNMZXZlbDogMSxcbiAgICBib21iczoge1xuICAgICAgICBtYXg6IDEsXG4gICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgIHJhbmdlOiAyXG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQuanMnO1xuaW1wb3J0IHtcbiAgICBQb3NpdGlvbkNvbXBvbmVudCxcbiAgICBWZWxvY2l0eUNvbXBvbmVudCxcbiAgICBJbnB1dENvbXBvbmVudCxcbiAgICBSZW5kZXJhYmxlQ29tcG9uZW50LFxuICAgIFBsYXllckNvbXBvbmVudCxcbiAgICBCb21iQ29tcG9uZW50XG59IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5pbXBvcnQgeyBtb3ZlbWVudFN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9tb3ZlbWVudFN5c3RlbS5qcyc7XG5pbXBvcnQgeyByZW5kZXJTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvcmVuZGVyU3lzdGVtLmpzJztcbmltcG9ydCB7IGJvbWJTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyc7XG5pbXBvcnQgeyBkYW1hZ2VTeXN0ZW0sIGNoZWNrR2FtZUVuZENvbmRpdGlvbnMsIHNwYXduSGVhcnRQb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyc7XG5pbXBvcnQgV2luTWVudSBmcm9tICcuLi9wYWdlcy9XaW5NZW51LmpzeCc7XG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tICcuLi8uLi9taW5pLWZyYW1ld29yay9kb20uanMnO1xuXG5pbXBvcnQgeyBwb3dlclVwU3lzdGVtLCBzcGF3blBvd2VyVXAgfSBmcm9tICcuL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyc7XG5pbXBvcnQgeyBzZXRCb21icywgc2V0TGl2ZXMsIHNldFJhbmdlLCBzZXRTcGVlZCB9IGZyb20gJy4uL3BhZ2VzL2dhbWUnO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEFOSU1BVElPTl9ST1dTID0ge1xuICAgIFJVTjogeyB1cDogMzgsIGxlZnQ6IDM5LCBkb3duOiA0MCwgcmlnaHQ6IDQxIH0sXG4gICAgSURMRTogeyB1cDogMjIsIGxlZnQ6IDIzLCBkb3duOiAyNCwgcmlnaHQ6IDI1IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBHYW1lRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNDb250YWluZXIsIG1hcERhdGEsIHNvY2tldCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNhbnZhc0NvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gbWFwRGF0YTtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcbiAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IG51bGw7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucGxheWVySW5mbyA9IG5ldyBNYXAoKTsgLy8gU3RvcmUgb3JpZ2luYWwgcGxheWVyIGRhdGEgbGlrZSBuaWNrbmFtZVxuICAgICAgICB0aGlzLmxhc3RUaW1lID0gMDtcbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIC8vIFN0YXRlIGZsYWcgdG8gcHJldmVudCBtdWx0aXBsZSBsb3NzIG1vZGFsIHJlbmRlcnMgKFRoZSBMb29wIFRyYXAgZml4KVxuICAgICAgICB0aGlzLmxvc3NNb2RhbFRyaWdnZXJlZCA9IGZhbHNlO1xuICAgICAgICAvLyBGbGFnIHRvIHRyYWNrIGlmIGlucHV0IHNob3VsZCBiZSBkaXNhYmxlZFxuICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIC8vIEZsYWcgdG8gc3RvcCB0aGUgZ2FtZSBsb29wIG9uY2UgYSB3aW5uZXIgaXMgZGVjaWRlZFxuICAgICAgICB0aGlzLmdhbWVFbmRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXQobG9jYWxQbGF5ZXJJZCwgYWxsUGxheWVycykge1xuICAgICAgICB0aGlzLnRvdGFsUGxheWVycyA9IGFsbFBsYXllcnMubGVuZ3RoO1xuICAgICAgICBjb25zdCBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCA9IFN0cmluZyhsb2NhbFBsYXllcklkKTtcblxuICAgICAgICBhbGxQbGF5ZXJzLmZvckVhY2gocERhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVySWQgPSBTdHJpbmcocERhdGEuaWQpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVySW5mby5zZXQocGxheWVySWQsIHBEYXRhKTsgLy8gU3RvcmUgb3JpZ2luYWwgcGxheWVyIGRhdGFcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBwRGF0YS5jb2xvciB8fCBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgIHBsYXllckRpdi5jbGFzc05hbWUgPSBgcGxheWVyIHBsYXllci0ke2NvbG9yfWA7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnpJbmRleCA9ICcxMCc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUud2lsbENoYW5nZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyRGl2KTtcblxuICAgICAgICAgICAgY29uc3Qgc3ggPSBwRGF0YS54IHx8IDE7XG4gICAgICAgICAgICBjb25zdCBzeSA9IHBEYXRhLnkgfHwgMTtcblxuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nLCBQb3NpdGlvbkNvbXBvbmVudChzeCwgc3ksIFRJTEVfU0laRSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknLCBWZWxvY2l0eUNvbXBvbmVudCgyLjUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnLCBSZW5kZXJhYmxlQ29tcG9uZW50KHBsYXllckRpdiwgNjQsIDY0LCA0LCAxMilcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzTG9jYWwgPSBwbGF5ZXJJZCA9PT0gbm9ybWFsaXplZExvY2FsUGxheWVySWQ7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJDb21wID0gUGxheWVyQ29tcG9uZW50KHBsYXllcklkLCBjb2xvciwgaXNMb2NhbCk7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmxpdmVzID0gMztcbiAgICAgICAgICAgIHBsYXllckNvbXAubWF4Qm9tYnMgPSAxO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5ib21iUmFuZ2UgPSA0O1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJywgcGxheWVyQ29tcCk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzLnNldChwbGF5ZXJJZCwgcGxheWVyRW50aXR5KTtcblxuICAgICAgICAgICAgaWYgKGlzTG9jYWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsUGxheWVyRW50aXR5ID0gcGxheWVyRW50aXR5O1xuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ0lucHV0JywgSW5wdXRDb21wb25lbnQoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyhwbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW0dhbWVFbmdpbmVdIExvY2FsIHBsYXllciB3YXMgbm90IGZvdW5kXCIsIHtcbiAgICAgICAgICAgICAgICBsb2NhbFBsYXllcklkLFxuICAgICAgICAgICAgICAgIHBsYXllcnM6IGFsbFBsYXllcnMubWFwKHBsYXllciA9PiBwbGF5ZXIuaWQpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlZ2lzdGVyU3lzdGVtcygpO1xuXG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobm93KSA9PiB0aGlzLmdhbWVMb29wKG5vdykpO1xuICAgIH1cblxuICAgIHNldHVwSW5wdXQoKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgIGlmICghaW5wdXQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBnZXRLZXlEaXJlY3Rpb24gPSAoa2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dVcCcgfHwga2V5ID09PSAndycgfHwga2V5ID09PSAnWicgfHwga2V5ID09PSAneicpIHJldHVybiAndXAnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93RG93bicgfHwga2V5ID09PSAncycgfHwga2V5ID09PSAnUycpIHJldHVybiAnZG93bic7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dMZWZ0JyB8fCBrZXkgPT09ICdhJyB8fCBrZXkgPT09ICdRJyB8fCBrZXkgPT09ICdxJykgcmV0dXJuICdsZWZ0JztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1JpZ2h0JyB8fCBrZXkgPT09ICdkJyB8fCBrZXkgPT09ICdEJykgcmV0dXJuICdyaWdodCc7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYW5kbGVLZXlEb3duID0gKGUpID0+IHtcbiAgICAgICAgICAgIC8vIElOUFVUIERJU0FCTEVEOiBJbW1lZGlhdGVseSBpZ25vcmUgYWxsIGtleWJvYXJkIGlucHV0cyB3aGVuIHBsYXllciBpcyBkZWFkXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5wdXRFbmFibGVkKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICghaW5wdXQuaW5wdXRRdWV1ZS5pbmNsdWRlcyhkaXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUudW5zaGlmdChkaXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnICcgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcEJvbWIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYW5kbGVLZXlVcCA9IChlKSA9PiB7XG4gICAgICAgICAgICAvLyBJTlBVVCBESVNBQkxFRDogSW1tZWRpYXRlbHkgaWdub3JlIGFsbCBrZXlib2FyZCBpbnB1dHMgd2hlbiBwbGF5ZXIgaXMgZGVhZFxuICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0RW5hYmxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUgPSBpbnB1dC5pbnB1dFF1ZXVlLmZpbHRlcihkID0+IGQgIT09IGRpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGRyb3BCb21iKCkge1xuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudEJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLmZpbHRlcihiRW50aXR5ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndvcmxkLmdldENvbXBvbmVudChiRW50aXR5LCAnQm9tYicpLm93bmVySWQgPT09IHBsYXllci5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRCb21icy5sZW5ndGggPj0gcGxheWVyLm1heEJvbWJzKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuY3JlYXRlQm9tYihwbGF5ZXIuaWQsIHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBwbGF5ZXIuYm9tYlJhbmdlKTtcbiAgICAgICAgaWYgKCFjcmVhdGVkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnRFJPUF9CT01CJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGlkOiBwbGF5ZXIuaWQsIHg6IHBvcy5ncmlkWCwgeTogcG9zLmdyaWRZLCByYW5nZTogcGxheWVyLmJvbWJSYW5nZSB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVCb21iKG93bmVySWQsIGdyaWRYLCBncmlkWSwgcmFuZ2UpIHtcbiAgICAgICAgY29uc3QgZXhpc3RzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLnNvbWUoZW50aXR5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBib21iID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQm9tYicpO1xuICAgICAgICAgICAgcmV0dXJuIGJvbWIub3duZXJJZCA9PT0gb3duZXJJZCAmJiBwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChleGlzdHMpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBib21iRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgY29uc3QgYm9tYkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBib21iRGl2LmNsYXNzTmFtZSA9ICdib21iJztcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUubGVmdCA9IGAke2dyaWRYICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUuekluZGV4ID0gJzYnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChib21iRGl2KTtcblxuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYLCBncmlkWSB9KTtcblxuICAgICAgICBjb25zdCBib21iQ29tcCA9IEJvbWJDb21wb25lbnQob3duZXJJZCwgMjAwMCwgcmFuZ2UpO1xuICAgICAgICBib21iQ29tcC5lbCA9IGJvbWJEaXY7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJywgYm9tYkNvbXApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVNb3ZlKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbaGFuZGxlUmVtb3RlTW92ZV0gSW52YWxpZCBwYXlsb2FkOlwiLCBwYXlsb2FkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIEVudGl0eSBub3QgZm91bmQgZm9yIHBsYXllciAke3BheWxvYWQuaWR9LiBBdmFpbGFibGUgcGxheWVyczpgLCBBcnJheS5mcm9tKHRoaXMucGxheWVyRW50aXRpZXMua2V5cygpKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW2hhbmRsZVJlbW90ZU1vdmVdIElnbm9yaW5nIGxvY2FsIHBsYXllciB1cGRhdGUgZm9yICR7cGF5bG9hZC5pZH1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIXBvcyB8fCAhdmVsIHx8ICFyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBNaXNzaW5nIGNvbXBvbmVudHMgZm9yIHBsYXllciAke3BheWxvYWQuaWR9OmAsIHsgcG9zOiAhIXBvcywgdmVsOiAhIXZlbCwgcmVuZGVyYWJsZTogISFyZW5kZXJhYmxlIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coYFtoYW5kbGVSZW1vdGVNb3ZlXSBVcGRhdGluZyBwbGF5ZXIgJHtwYXlsb2FkLmlkfSB0byAoJHtwYXlsb2FkLmdyaWRYfSwgJHtwYXlsb2FkLmdyaWRZfSlgKTtcbiAgICAgICAgdmVsLmRpcmVjdGlvbiA9IHBheWxvYWQuZGlyZWN0aW9uIHx8IHZlbC5kaXJlY3Rpb247XG4gICAgICAgIHZlbC5pc01vdmluZyA9IHBheWxvYWQuaXNNb3Zpbmc7XG4gICAgICAgIHBvcy5ncmlkWCA9IHBheWxvYWQuZ3JpZFg7XG4gICAgICAgIHBvcy5ncmlkWSA9IHBheWxvYWQuZ3JpZFk7XG4gICAgICAgIHBvcy50YXJnZXRYID0gcGF5bG9hZC54O1xuICAgICAgICBwb3MudGFyZ2V0WSA9IHBheWxvYWQueTtcbiAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9IHBheWxvYWQuc3RhdGUgfHwgKHBheWxvYWQuaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyk7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlQm9tYihwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmNyZWF0ZUJvbWIocGF5bG9hZC5pZCwgcGF5bG9hZC54LCBwYXlsb2FkLnksIHBheWxvYWQucmFuZ2UgfHwgNCk7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCBwYXlsb2FkLnggPT09IHVuZGVmaW5lZCB8fCBwYXlsb2FkLnkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlUG93ZXJVcEF0KHBheWxvYWQueCwgcGF5bG9hZC55KTtcblxuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQgfHwgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5hcHBseVBvd2VyVXAoZW50aXR5LCBwYXlsb2FkLnR5cGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgcmVtb3RlIGhlYXJ0IHBpY2t1cCAtIHVwZGF0ZXMgcGxheWVyIGxpdmVzIGFuZCBVSSBvbiBhbGwgY2xpZW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkIC0geyBwbGF5ZXJJZCwgbmV3TGl2ZXMgfVxuICAgICAqL1xuICAgIGhhbmRsZVJlbW90ZUl0ZW1QaWNrdXAocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQucGxheWVySWQgfHwgcGF5bG9hZC5uZXdMaXZlcyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQucGxheWVySWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcGxheWVyKSByZXR1cm47XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBwbGF5ZXIncyBsaXZlc1xuICAgICAgICBwbGF5ZXIubGl2ZXMgPSBwYXlsb2FkLm5ld0xpdmVzO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBIVUQgaWYgdGhpcyBpcyB0aGUgbG9jYWwgcGxheWVyXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMoZW50aXR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbUmVtb3RlIEl0ZW0gUGlja3VwXSBQbGF5ZXIgJHtwYXlsb2FkLnBsYXllcklkfSBwaWNrZWQgdXAgaGVhcnQuIE5ldyBsaXZlczogJHtwYXlsb2FkLm5ld0xpdmVzfWApO1xuICAgIH1cblxuICAgIHJlbW92ZVBvd2VyVXBBdChncmlkWCwgZ3JpZFkpIHtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMuYWRkKGAke2dyaWRYfSwke2dyaWRZfWApO1xuICAgICAgICBjb25zdCBwb3dlclVwcyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBvd2VyVXAgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXBvcyB8fCAhcG93ZXJVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwb3dlclVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChwb3dlclVwLmVsICYmIHBvd2VyVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwb3dlclVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG93ZXJVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlQb3dlclVwKGVudGl0eSwgdHlwZSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgdmVsb2NpdHkuc3BlZWQgPSBNYXRoLm1pbih2ZWxvY2l0eS5zcGVlZCArIDEsIDgpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgIC8vIEhFQVJUIHBvd2VyLXVwOiBpbmNyZW1lbnQgbGl2ZXMgKGNhcCBhdCAzKVxuICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5taW4oKHBsYXllci5saXZlcyB8fCAwKSArIDEsIDMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTeXN0ZW1zKCkge1xuICAgICAgICBjb25zdCB1cGRhdGVNYXBDZWxsID0gKHgsIHksIG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubWFwRGF0YVt5XSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm1hcERhdGFbeV1beF0gPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gKTtcbiAgICAgICAgICAgIGlmICghdGlsZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aWxlLmNsYXNzTmFtZSA9ICd0aWxlIHRpbGUtZmxvb3InO1xuICAgICAgICAgICAgdGlsZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiKSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZGVzdHJveUJveENhbGxiYWNrID0gKHgsIHkpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYWltZWRQb3dlclVwcy5oYXMoYCR7eH0sJHt5fWApKSByZXR1cm47XG4gICAgICAgICAgICBzcGF3blBvd2VyVXAodGhpcy53b3JsZCwgeCwgeSwgdGhpcy5jb250YWluZXIsIFRJTEVfU0laRSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25QbGF5ZXJIdXJ0ID0gKGVudGl0eSwgaWQsIHJlbWFpbmluZ0xpdmVzKSA9PiB7XG4gICAgICAgICAgICAvLyBDUklUSUNBTDogT25seSBzZW5kIHBsYXllcl9kaWVkIGlmIFRISVMgSVMgVEhFIExPQ0FMIFBMQVlFUi5cbiAgICAgICAgICAgIC8vIFRoZSBFQ1MgZGFtYWdlU3lzdGVtIHJ1bnMgb24gQUxMIGNsaWVudHMsIHNvIGV2ZXJ5IGNsaWVudCBkZXRlY3RzXG4gICAgICAgICAgICAvLyBldmVyeSBjb2xsaXNpb24uIFdlIG11c3QgZ3VhcmQgdGhlIFdlYlNvY2tldCBtZXNzYWdlIHRvIHByZXZlbnRcbiAgICAgICAgICAgIC8vIGluY29ycmVjdCBkZWF0aCByZXBvcnRzLlxuICAgICAgICAgICAgaWYgKHJlbWFpbmluZ0xpdmVzIDw9IDAgJiYgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5ICYmIHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwbGF5ZXJfZGllZCdcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEhVRCBvbmx5IGZvciB0aGUgbG9jYWwgcGxheWVyLlxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHNldExpdmVzKHJlbWFpbmluZ0xpdmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBvd2VyVXBQaWNrZWQgPSAoaWQsIHR5cGUsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHt4fSwke3l9YCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgcGxheWVyLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHModGhpcy5sb2NhbFBsYXllckVudGl0eSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9XRVJVUF9QSUNLRUQnLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGlkLCB0eXBlLCB4LCB5IH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25IZWFydFBpY2tlZFVwID0gKGVudGl0eSwgcGxheWVySWQsIG5ld0xpdmVzLCBncmlkWCwgZ3JpZFkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHtncmlkWH0sJHtncmlkWX1gKTtcblxuICAgICAgICAgICAgLy8gQ1JJVElDQUw6IFVwZGF0ZSBIVUQgaW1tZWRpYXRlbHkgZm9yIGxvY2FsIHBsYXllclxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHNldExpdmVzKG5ld0xpdmVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTm90aWZ5IHRoZSBzZXJ2ZXIgYWJvdXQgdGhlIGl0ZW0gcGlja3VwIHNvIGl0IGJyb2FkY2FzdHMgdG8gYWxsIGNsaWVudHNcbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnSVRFTV9QSUNLVVAnLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IHBsYXllcklkLCBuZXdMaXZlcywgZ3JpZFgsIGdyaWRZIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5icm9hZGNhc3RNb3ZlbWVudCA9IChlbnRpdHksIHgsIHksIGdyaWRYLCBncmlkWSwgZGlyZWN0aW9uLCBpc01vdmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAoIXBsYXllciB8fCAhdGhpcy5zb2NrZXQgfHwgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ01PVkVfU1RBVEUnLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBsYXllci5pZCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGlzTW92aW5nLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IG1vdmVtZW50U3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBib21iU3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGRhbWFnZVN5c3RlbSh0aGlzLndvcmxkLCBub3csIG9uUGxheWVySHVydCwgdGhpcy5sb2NhbFBsYXllckVudGl0eSwgVElMRV9TSVpFLCB0aGlzLnNvY2tldCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcG93ZXJVcFN5c3RlbSh3LCBvblBvd2VyVXBQaWNrZWQsIG9uSGVhcnRQaWNrZWRVcCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcmVuZGVyU3lzdGVtKHcsIGR0LCBub3csIEFOSU1BVElPTl9ST1dTKSk7XG4gICAgfVxuXG4gICAgZ2FtZUxvb3Aobm93KSB7XG4gICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZHQgPSBub3cgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gbm93O1xuICAgICAgICB0aGlzLndvcmxkLnVwZGF0ZShkdCwgbm93KTtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChuZXh0Tm93KSA9PiB0aGlzLmdhbWVMb29wKG5leHROb3cpKTtcbiAgICB9XG5cbiAgICBoYW5kbGVHYW1lT3Zlcih3aW5uZXJOYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmdhbWVFbmRlZCkgcmV0dXJuOyAvLyBQcmV2ZW50IG11bHRpcGxlIHRyaWdnZXJzXG4gICAgICAgIHRoaXMuZ2FtZUVuZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG5cbiAgICAgICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gJ21lbnUtcGFnZSc7XG4gICAgICAgIHJlbmRlcig8V2luTWVudSB3aW5uZXJOYW1lPXt3aW5uZXJOYW1lfSAvPiwgcm9vdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGdhbWUgZW5kIGNvbmRpdGlvbnMgd2l0aCBwcm9wZXIgc3RhdGUgZmxhZyBtYW5hZ2VtZW50LlxuICAgICAqIFByZXZlbnRzIHRoZSBcIkxvb3AgVHJhcFwiIC0gbW9kYWwgaXMgb25seSByZW5kZXJlZCBPTkNFIHdoZW4gbGl2ZXMgcmVhY2ggMC5cbiAgICAgKiBBbHNvIGRpc2FibGVzIGlucHV0IGltbWVkaWF0ZWx5IHdoZW4gcGxheWVyIGRpZXMuXG4gICAgICovXG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlSHVkU3RhdHMoZW50aXR5KSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIHNldEJvbWJzKHBsYXllci5tYXhCb21icyB8fCAxKTtcbiAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzID8/IDMpO1xuICAgICAgICBzZXRSYW5nZShwbGF5ZXIuYm9tYlJhbmdlIHx8IDQpO1xuICAgICAgICBzZXRTcGVlZChNYXRoLnJvdW5kKHZlbG9jaXR5LnNwZWVkKSk7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IFwiXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKG5hbWUpIHtcbiAgICBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gbmFtZTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiLCBuYW1lKTtcbiAgICBjb25zb2xlLmxvZyhcIlBsYXllciByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVwiLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXllck5hbWUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgfHwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIikgfHwgXCJQbGF5ZXJcIjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBib21iU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB1cGRhdGVNYXBDZWxsLCBkZXN0cm95Qm94Q2FsbGJhY2ssIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBib21icyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBib21iRW50aXR5IG9mIGJvbWJzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgYm9tYiA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicpO1xuICAgICAgICBcbiAgICAgICAgYm9tYi50aW1lciAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChib21iLnRpbWVyIDw9IDAgJiYgIWJvbWIuZXhwbG9kZWQpIHtcbiAgICAgICAgICAgIGJvbWIuZXhwbG9kZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBhZmZlY3RlZENlbGxzID0gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMocG9zLmdyaWRYLCBwb3MuZ3JpZFksIGJvbWIucmFuZ2UsIG1hcERhdGEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhZmZlY3RlZENlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgZXhwRGl2LmNsYXNzTmFtZSA9ICdleHBsb3Npb24nO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmxlZnQgPSBgJHtjZWxsLnggKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnRvcCA9IGAke2NlbGwueSAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuekluZGV4ID0gJzcnO1xuXG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFg6IGNlbGwueCwgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZOiBjZWxsLnksIFxuICAgICAgICAgICAgICAgICAgICB4OiBjZWxsLnggKiB0aWxlU2l6ZSwgXG4gICAgICAgICAgICAgICAgICAgIHk6IGNlbGwueSAqIHRpbGVTaXplIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nLCB7IGR1cmF0aW9uOiA1MDAsIGVsOiBleHBEaXYgfSk7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGV4cERpdik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG1hcERhdGFbY2VsbC55XSAmJiBtYXBEYXRhW2NlbGwueV1bY2VsbC54XSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNYXBDZWxsKGNlbGwueCwgY2VsbC55LCAyKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXN0cm95Qm94Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lCb3hDYWxsYmFjayhjZWxsLngsIGNlbGwueSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGJvbWIuZWwgJiYgYm9tYi5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJvbWIuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShib21iRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgY29uc3QgZXhwID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicpO1xuICAgICAgICBleHAuZHVyYXRpb24gLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoZXhwLmR1cmF0aW9uIDw9IDApIHtcbiAgICAgICAgICAgIGlmIChleHAuZWwgJiYgZXhwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBleHAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChleHAuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShleHBFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhieCwgYnksIHJhbmdlLCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbHMgPSBbeyB4OiBieCwgeTogYnkgfV07XG4gICAgY29uc3QgZGlyZWN0aW9ucyA9IFtcbiAgICAgICAgeyB4OiAwLCB5OiAtMSB9LFxuICAgICAgICB7IHg6IDAsIHk6IDEgfSxcbiAgICAgICAgeyB4OiAtMSwgeTogMCB9LFxuICAgICAgICB7IHg6IDEsIHk6IDAgfVxuICAgIF07XG4gICAgXG4gICAgY29uc3Qgc3RlcHMgPSByYW5nZSAtIDE7IFxuICAgIFxuICAgIGRpcmVjdGlvbnMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0eCA9IGJ4ICsgKGRpci54ICogaSk7XG4gICAgICAgICAgICBjb25zdCB0eSA9IGJ5ICsgKGRpci55ICogaSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghbWFwRGF0YVt0eV0gfHwgbWFwRGF0YVt0eV1bdHhdID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjZWxsVHlwZSA9IG1hcERhdGFbdHldW3R4XTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNlbGxzLnB1c2goeyB4OiB0eCwgeTogdHkgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGNlbGxzO1xufVxuIiwiLyoqXG4gKiBTcGF3bnMgYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIHNwZWNpZmllZCBncmlkIGNvb3JkaW5hdGVzLlxuICogVGhpcyBjcmVhdGVzIGEgcHJvcGVyIEVDUyBlbnRpdHkgd2l0aCBQb3NpdGlvbiwgUG93ZXJVcCwgYW5kIFJlbmRlcmFibGUgY29tcG9uZW50cy5cbiAqIFxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IGdyaWRYIC0gR3JpZCBYIGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBncmlkWSAtIEdyaWQgWSBjb29yZGluYXRlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLSBUaGUgZ2FtZSBjb250YWluZXIgZWxlbWVudFxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3Bhd25IZWFydFBvd2VyVXAod29ybGQsIGdyaWRYLCBncmlkWSwgY29udGFpbmVyLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgLy8gQ3JlYXRlIGEgbmV3IGVudGl0eSBmb3IgdGhlIGhlYXJ0IHBvd2VyLXVwXG4gICAgY29uc3QgaGVhcnRFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICBcbiAgICAvLyBBZGQgUG9zaXRpb24gY29tcG9uZW50XG4gICAgd29ybGQuYWRkQ29tcG9uZW50KGhlYXJ0RW50aXR5LCAnUG9zaXRpb24nLCB7XG4gICAgICAgIGdyaWRYOiBncmlkWCxcbiAgICAgICAgZ3JpZFk6IGdyaWRZLFxuICAgICAgICB4OiBncmlkWCAqIHRpbGVTaXplLFxuICAgICAgICB5OiBncmlkWSAqIHRpbGVTaXplXG4gICAgfSk7XG4gICAgXG4gICAgLy8gQWRkIFBvd2VyVXAgY29tcG9uZW50IHdpdGggdHlwZSAnSEVBUlQnXG4gICAgd29ybGQuYWRkQ29tcG9uZW50KGhlYXJ0RW50aXR5LCAnUG93ZXJVcCcsIHtcbiAgICAgICAgdHlwZTogJ0hFQVJUJyxcbiAgICAgICAgcGlja2VkVXA6IGZhbHNlLFxuICAgICAgICBlbDogbnVsbCAgLy8gV2lsbCBiZSBzZXQgYWZ0ZXIgY3JlYXRpbmcgdGhlIERPTSBlbGVtZW50XG4gICAgfSk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIHRoZSBET00gZWxlbWVudCBmb3IgcmVuZGVyaW5nXG4gICAgY29uc3QgaGVhcnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFydERpdi5jbGFzc05hbWUgPSAncG93ZXJ1cCBwb3dlcnVwLWhlYXJ0JztcbiAgICBoZWFydERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgaGVhcnREaXYuc3R5bGUubGVmdCA9IGAke2dyaWRYICogdGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnRvcCA9IGAke2dyaWRZICogdGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmFsaWduSXRlbXMgPSAnY2VudGVyJztcbiAgICBoZWFydERpdi5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmZvbnRTaXplID0gJzMycHgnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICBoZWFydERpdi50ZXh0Q29udGVudCA9ICfinaTvuI8nO1xuICAgIFxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChoZWFydERpdik7XG4gICAgXG4gICAgLy8gVXBkYXRlIHRoZSBQb3dlclVwIGNvbXBvbmVudCB3aXRoIHRoZSBET00gZWxlbWVudCByZWZlcmVuY2VcbiAgICBjb25zdCBwb3dlclVwID0gd29ybGQuZ2V0Q29tcG9uZW50KGhlYXJ0RW50aXR5LCAnUG93ZXJVcCcpO1xuICAgIGlmIChwb3dlclVwKSB7XG4gICAgICAgIHBvd2VyVXAuZWwgPSBoZWFydERpdjtcbiAgICB9XG4gICAgXG4gICAgY29uc29sZS5sb2coYFtIZWFydCBEcm9wXSBTcGF3bmVkIEhFQVJUIHBvd2VyLXVwIGF0ICgke2dyaWRYfSwgJHtncmlkWX0pYCk7XG59XG5cbi8qKlxuICogSGFuZGxlcyBwbGF5ZXIgZGVhdGggdHJhbnNpdGlvbiB3aGVuIGxpdmVzIHJlYWNoIDAuXG4gKiBSZW1vdmVzIHRoZSBwbGF5ZXIncyBET00gZWxlbWVudCBhbmQgc3Bhd25zIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBkZWF0aCBsb2NhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gcGxheWVyRW50aXR5IC0gVGhlIGVudGl0eSBJRCBvZiB0aGUgZHlpbmcgcGxheWVyXG4gKiBAcGFyYW0ge251bWJlcn0gdGlsZVNpemUgLSBUaGUgc2l6ZSBvZiBlYWNoIGdyaWQgdGlsZSAoZGVmYXVsdDogNjQpXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLSBUaGUgZ2FtZSBjb250YWluZXIgZWxlbWVudFxuICovXG5mdW5jdGlvbiBoYW5kbGVQbGF5ZXJEZWF0aCh3b3JsZCwgcGxheWVyRW50aXR5LCB0aWxlU2l6ZSA9IDY0LCBjb250YWluZXIgPSBudWxsKSB7XG4gICAgLy8gR2V0IHRoZSBwbGF5ZXIncyBjb21wb25lbnRzXG4gICAgY29uc3QgcG9zaXRpb24gPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG5cbiAgICBpZiAoIXBvc2l0aW9uIHx8ICFyZW5kZXJhYmxlIHx8ICFwbGF5ZXIpIHJldHVybjtcblxuICAgIC8vIFN0b3JlIHRoZSBncmlkIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwbGF5ZXIgZGllZFxuICAgIGNvbnN0IGRlYXRoR3JpZFggPSBNYXRoLmZsb29yKChwb3NpdGlvbi54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICBjb25zdCBkZWF0aEdyaWRZID0gTWF0aC5mbG9vcigocG9zaXRpb24ueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG5cbiAgICAvLyBDUklUSUNBTDogUmVtb3ZlIHRoZSBwbGF5ZXIncyBET00gZWxlbWVudCBmcm9tIHRoZSBkb2N1bWVudCBCRUZPUkUgcmVtb3ZpbmcgdGhlIFJlbmRlcmFibGUgY29tcG9uZW50LlxuICAgIC8vIFRoaXMgZW5zdXJlcyB0aGUgZGVhZCBwbGF5ZXIgdmlzdWFsbHkgZGlzYXBwZWFycyBpbW1lZGlhdGVseS5cbiAgICBpZiAocmVuZGVyYWJsZS5lbCAmJiByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHJlbmRlcmFibGUuZWwpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBjb21wb25lbnRzIHRoYXQgZW5hYmxlIGludGVyYWN0aW9uIGFuZCByZW5kZXJpbmcuXG4gICAgd29ybGQucmVtb3ZlQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICAvLyBXZSBrZWVwIFBvc2l0aW9uIGFuZCBQbGF5ZXIgY29tcG9uZW50cyB0byBrbm93IHdoZXJlIHRoZXkgd2VyZS5cblxuICAgIC8vIFNwYXduIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBkZWF0aCBsb2NhdGlvbiAocHJvcGVyIEVDUyBlbnRpdHkpXG4gICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICBzcGF3bkhlYXJ0UG93ZXJVcCh3b3JsZCwgZGVhdGhHcmlkWCwgZGVhdGhHcmlkWSwgZ2FtZUNvbnRhaW5lciwgdGlsZVNpemUpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGBbUGxheWVyIERlYXRoXSBQbGF5ZXIgJHtwbGF5ZXIuaWR9IGRpZWQgYXQgKCR7ZGVhdGhHcmlkWH0sICR7ZGVhdGhHcmlkWX0pLiBIZWFydCBwb3dlci11cCBkcm9wcGVkLmApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGFtYWdlU3lzdGVtKHdvcmxkLCBub3csIG9uUGxheWVySHVydCwgbG9jYWxQbGF5ZXJFbnRpdHksIHRpbGVTaXplID0gNjQsIHNvY2tldCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUGxheWVyJyk7XG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHBsYXllci5pbnZpbmNpYmxlVW50aWwgJiYgcGxheWVyLmludmluY2libGVVbnRpbCA+IG5vdykgY29udGludWU7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgICAgICBjb25zdCBlUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdyaWQtYmFzZWQgY29sbGlzaW9uXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWCA9IE1hdGguZmxvb3IoKHBQb3MueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWSA9IE1hdGguZmxvb3IoKHBQb3MueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChwbGF5ZXJHcmlkWCA9PT0gZVBvcy5ncmlkWCAmJiBwbGF5ZXJHcmlkWSA9PT0gZVBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzTGl2ZXMgPSBwbGF5ZXIubGl2ZXMgPz8gMztcbiAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSBNYXRoLm1heChwcmV2aW91c0xpdmVzIC0gMSwgMCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLmludmluY2libGVVbnRpbCA9IG5vdyArIDE1MDA7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHBsYXllciBpcyBkZWFkLCByZXBvcnQgZGVhdGggT05DRSB1c2luZyBndWFyZCBjbGF1c2VcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmxpdmVzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBsYXllci5hbHJlYWR5UmVwb3J0ZWREZWFkKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmFscmVhZHlSZXBvcnRlZERlYWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUGxheWVySHVydChwbGF5ZXJFbnRpdHksIHBsYXllci5pZCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBsYXllciBzdGlsbCBhbGl2ZSwgcmVwb3J0IG5vcm1hbCBkYW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uUGxheWVySHVydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCBwbGF5ZXIubGl2ZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEJyZWFrIHRoZSBsb29wIHNpbmNlIHRoZSBwbGF5ZXIgaGFzIGFscmVhZHkgdGFrZW4gZGFtYWdlIGZyb20gdGhpcyBleHBsb3Npb24uXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGZ1bmN0aW9uIG1vdmVtZW50U3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB0aWxlU2l6ZSA9IDQwKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknKTtcbiAgICBjb25zdCBkZWx0YSA9IGR0IC8gMTYuNjc7XG5cbiAgICBjb25zdCBQTEFZRVJfU0laRSA9IHRpbGVTaXplO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBpbnB1dCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBjb25zdCBiZWhhdmlvciA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCZWhhdmlvcicpO1xuXG4gICAgICAgIGlmIChiZWhhdmlvcikge1xuICAgICAgICAgICAgdmVsLnNwZWVkID0gdmVsLmJhc2VTcGVlZCArIChiZWhhdmlvci5mYXN0U2hvZXNMZXZlbCAtIDEpICogMC41O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmVsLnNwZWVkID0gdmVsLmJhc2VTcGVlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWN0aXZlSW5wdXQgPSBpbnB1dC5pbnB1dFF1ZXVlWzBdO1xuICAgICAgICBsZXQgZHggPSAwO1xuICAgICAgICBsZXQgZHkgPSAwO1xuXG4gICAgICAgIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3VwJykge1xuICAgICAgICAgICAgZHkgPSAtMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAndXAnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnZG93bicpIHtcbiAgICAgICAgICAgIGR5ID0gMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAnZG93bic7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgZHggPSAtMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAnbGVmdCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgIGR4ID0gMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAncmlnaHQnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGFzSW5wdXQgPSBkeCAhPT0gMCB8fCBkeSAhPT0gMDtcblxuICAgICAgICBpZiAoIWhhc0lucHV0KSB7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICAgICAgcG9zLnRhcmdldFkgPSBwb3MueTtcbiAgICAgICAgICAgIHZlbC5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSAnSURMRSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBvcy5ncmlkWCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBwb3MuZ3JpZFkgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdmVsLmlzTW92aW5nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFggPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGNvbnN0IHNuYXBUaHJlc2hvbGQgPSAzMjtcblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgZHggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChpc0Jsb2NrZWQocG9zLngsIG5leHRZLCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbGVYID0gTWF0aC5mbG9vcigocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFggPSBjdXJyZW50VGlsZVggKiB0aWxlU2l6ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmWCA9IHBvcy54IC0gdGFyZ2V0WDtcblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaWZmWCkgPCBzbmFwVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAtTWF0aC5zaWduKGRpZmZYKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgZHkgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChpc0Jsb2NrZWQobmV4dFgsIHBvcy55LCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbGVZID0gTWF0aC5mbG9vcigocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFkgPSBjdXJyZW50VGlsZVkgKiB0aWxlU2l6ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmWSA9IHBvcy55IC0gdGFyZ2V0WTtcblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaWZmWSkgPCBzbmFwVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAtTWF0aC5zaWduKGRpZmZZKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WEFmdGVyU25hcCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFlBZnRlclNuYXAgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmICFpc0Jsb2NrZWQobmV4dFhBZnRlclNuYXAsIHBvcy55LCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICBwb3MueCA9IG5leHRYQWZ0ZXJTbmFwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmICFpc0Jsb2NrZWQocG9zLngsIG5leHRZQWZ0ZXJTbmFwLCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICBwb3MueSA9IG5leHRZQWZ0ZXJTbmFwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmVsLmlzTW92aW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSAnUlVOJztcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcy5ncmlkWCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MuZ3JpZFkgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwb3MueTtcblxuICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgIGVudGl0eSxcbiAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFgsXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgdmVsLmlzTW92aW5nXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSkge1xuICAgIGNvbnN0IHN0ZXAgPSB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgIGlmIChwb3MueCA8IHBvcy50YXJnZXRYKSB7XG4gICAgICAgIHBvcy54ID0gTWF0aC5taW4ocG9zLnggKyBzdGVwLCBwb3MudGFyZ2V0WCk7XG4gICAgfSBlbHNlIGlmIChwb3MueCA+IHBvcy50YXJnZXRYKSB7XG4gICAgICAgIHBvcy54ID0gTWF0aC5tYXgocG9zLnggLSBzdGVwLCBwb3MudGFyZ2V0WCk7XG4gICAgfVxuXG4gICAgaWYgKHBvcy55IDwgcG9zLnRhcmdldFkpIHtcbiAgICAgICAgcG9zLnkgPSBNYXRoLm1pbihwb3MueSArIHN0ZXAsIHBvcy50YXJnZXRZKTtcbiAgICB9IGVsc2UgaWYgKHBvcy55ID4gcG9zLnRhcmdldFkpIHtcbiAgICAgICAgcG9zLnkgPSBNYXRoLm1heChwb3MueSAtIHN0ZXAsIHBvcy50YXJnZXRZKTtcbiAgICB9XG5cbiAgICB2ZWwuaXNNb3ZpbmcgPVxuICAgICAgICBwb3MueCAhPT0gcG9zLnRhcmdldFggfHxcbiAgICAgICAgcG9zLnkgIT09IHBvcy50YXJnZXRZO1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrZWQoeCwgeSwgbWFwRGF0YSwgdGlsZVNpemUsIHBsYXllclNpemUgPSB0aWxlU2l6ZSkge1xuICAgIGNvbnN0IHBhZGRpbmcgPSA0O1xuXG4gICAgY29uc3QgbGVmdCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh4ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCByaWdodCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh4ICsgcGxheWVyU2l6ZSAtIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgdG9wID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IGJvdHRvbSA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGxheWVyU2l6ZSAtIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChsZWZ0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwocmlnaHQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChsZWZ0LCBib3R0b20sIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwocmlnaHQsIGJvdHRvbSwgbWFwRGF0YSlcbiAgICApO1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrZWRDZWxsKHgsIHksIG1hcERhdGEpIHtcbiAgICBjb25zdCBjZWxsID0gbWFwRGF0YVt5XSAmJiBtYXBEYXRhW3ldW3hdO1xuXG4gICAgcmV0dXJuIGNlbGwgIT09IDAgJiYgY2VsbCAhPT0gMjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBwb3dlclVwU3lzdGVtKHdvcmxkLCBvblBvd2VyVXBQaWNrZWQsIG9uSGVhcnRQaWNrZWRVcCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUGxheWVyJyk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcFBvcyB8fCAhdmVsIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcFVwRW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCB1cFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcFVwID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghdXBQb3MgfHwgIXBVcCB8fCBwVXAucGlja2VkVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocFBvcy5ncmlkWCA9PT0gdXBQb3MuZ3JpZFggJiYgcFBvcy5ncmlkWSA9PT0gdXBQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC50eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlbC5zcGVlZCA9IE1hdGgubWluKHZlbC5zcGVlZCArIDEsIDgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEhlYXJ0IHBvd2VyLXVwOiBpbmNyZW1lbnQgcGxheWVyJ3MgbGl2ZXMgYnkgMSAoY2FwIGF0IDMpXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5saXZlcyA9IE1hdGgubWluKChwbGF5ZXIubGl2ZXMgfHwgMCkgKyAxLCAzKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ1JJVElDQUw6IENhbGwgdGhlIGhlYXJ0LXNwZWNpZmljIGNhbGxiYWNrIGltbWVkaWF0ZWx5IHRvIHVwZGF0ZSBIVURcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uSGVhcnRQaWNrZWRVcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25IZWFydFBpY2tlZFVwKHBsYXllckVudGl0eSwgcGxheWVyLmlkLCBwbGF5ZXIubGl2ZXMsIHVwUG9zLmdyaWRYLCB1cFBvcy5ncmlkWSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocFVwLmVsICYmIHBVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9uUG93ZXJVcFBpY2tlZCAmJiBwVXAudHlwZSAhPT0gJ0hFQVJUJykge1xuICAgICAgICAgICAgICAgICAgICBvblBvd2VyVXBQaWNrZWQocGxheWVyLmlkLCBwVXAudHlwZSwgdXBQb3MuZ3JpZFgsIHVwUG9zLmdyaWRZKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KHBVcEVudGl0eSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGF3blBvd2VyVXAod29ybGQsIGd4LCBneSwgY29udGFpbmVyLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3Qgc2VlZCA9IGd4ICogNzM4NTYwOTMgXiBneSAqIDE5MzQ5NjYzO1xuICAgIGNvbnN0IHNlZWRSYW5kb20gPSAoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCkgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQpICogMTAwMDApO1xuICAgIFxuICAgIGlmIChzZWVkUmFuZG9tID4gMC4zNSkgcmV0dXJuO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbJ1NQRUVEJywgJ0JPTUJTJywgJ0ZMQU1FJ107XG4gICAgY29uc3QgdHlwZUluZGV4ID0gTWF0aC5mbG9vcigoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDAgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwKSkgKiB0eXBlcy5sZW5ndGgpO1xuICAgIGNvbnN0IHJhbmRvbVR5cGUgPSB0eXBlc1t0eXBlSW5kZXhdO1xuXG4gICAgY29uc3QgcFVwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWDogZ3gsIGdyaWRZOiBneSwgeDogZ3ggKiB0aWxlU2l6ZSwgeTogZ3kgKiB0aWxlU2l6ZSB9KTtcbiAgICBcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gYHBvd2VydXAgcG93ZXJ1cC0ke3JhbmRvbVR5cGUudG9Mb3dlckNhc2UoKX1gO1xuICAgIGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSBgJHtneCAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUudG9wID0gYCR7Z3kgKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJywgeyB0eXBlOiByYW5kb21UeXBlLCBlbDogZGl2IH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclN5c3RlbSh3b3JsZCwgZHQsIG5vdywgYW5pbVJvd3MpIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdSZW5kZXJhYmxlJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuXG4gICAgICAgIGlmICghcmVuZGVyYWJsZS5lbCkgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSByZW5kZXJhYmxlLnN0YXRlO1xuICAgICAgICBjb25zdCB0YXJnZXRSb3cgPSBhbmltUm93c1tzdGF0ZV1bdmVsLmRpcmVjdGlvbl07XG4gICAgICAgIFxuICAgICAgICAvLyBSZXNldCBhbmltYXRpb24gd2hlbiByb3cgb3Igc3RhdGUgY2hhbmdlc1xuICAgICAgICBpZiAocmVuZGVyYWJsZS5yb3cgIT09IHRhcmdldFJvdyB8fCByZW5kZXJhYmxlLmxhc3RTdGF0ZSAhPT0gc3RhdGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUucm93ID0gdGFyZ2V0Um93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0U3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZyYW1lQ291bnQgPSBzdGF0ZSA9PT0gJ1JVTicgPyByZW5kZXJhYmxlLnJ1bkZyYW1lcyA6IHJlbmRlcmFibGUuaWRsZUZyYW1lcztcbiAgICAgICAgY29uc3QgZnJhbWVEZWxheSA9IHN0YXRlID09PSAnUlVOJyA/IDEwMDAgLyByZW5kZXJhYmxlLmZwcyA6IDEwMDAgLyByZW5kZXJhYmxlLmlkbGVGcHM7XG5cbiAgICAgICAgaWYgKG5vdyAtIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA+IGZyYW1lRGVsYXkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICsgMSkgJSBmcmFtZUNvdW50O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zWCA9IC0ocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKiByZW5kZXJhYmxlLmZyYW1lV2lkdGgpO1xuICAgICAgICBjb25zdCBwb3NZID0gLShyZW5kZXJhYmxlLnJvdyAqIHJlbmRlcmFibGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBgJHtwb3NYfXB4ICR7cG9zWX1weGA7XG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7cG9zLnh9cHgsICR7cG9zLnl9cHgsIDApYDtcbiAgICB9XG59XG4iLCIvLyAvc3JjL2Vjcy93b3JsZC5qc1xuXG5leHBvcnQgY2xhc3MgV29ybGQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm5leHRFbnRpdHlJZCA9IDA7XG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IG5ldyBNYXAoKTsgXG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuICAgIH1cblxuICAgIGNyZWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5uZXh0RW50aXR5SWQrKztcbiAgICAgICAgdGhpcy5lbnRpdGllcy5hZGQoZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG5cbiAgICBkZXN0cm95RW50aXR5KGVudGl0eSkge1xuICAgICAgICB0aGlzLmVudGl0aWVzLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICBmb3IgKGNvbnN0IFtjb21wb25lbnROYW1lLCBjb21wb25lbnRNYXBdIG9mIHRoaXMuY29tcG9uZW50cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERhdGEgPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zZXQoY29tcG9uZW50TmFtZSwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpLnNldChlbnRpdHksIGNvbXBvbmVudERhdGEpO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE1hcCA/IGNvbXBvbmVudE1hcC5nZXQoZW50aXR5KSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZW1vdmVDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIGlmIChjb21wb25lbnRNYXApIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHF1ZXJ5KC4uLmNvbXBvbmVudE5hbWVzKSB7XG4gICAgICAgIGlmIChjb21wb25lbnROYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpcnN0TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1swXSk7XG4gICAgICAgIGlmICghZmlyc3RNYXApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZmlyc3RNYXAua2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgaGFzQWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY29tcG9uZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcCB8fCAhbWFwLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0FsbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzQWxsICYmIHRoaXMuZW50aXRpZXMuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRTeXN0ZW0oc3lzdGVtRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zeXN0ZW1zLnB1c2goc3lzdGVtRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHVwZGF0ZShkdCwgbm93KSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3lzdGVtIG9mIHRoaXMuc3lzdGVtcykge1xuICAgICAgICAgICAgc3lzdGVtKHRoaXMsIGR0LCBub3cpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdpbk1lbnUocHJvcHMpIHtcbiAgICBjb25zdCB3aW5uZXJOYW1lID0gcHJvcHMud2lubmVyTmFtZSB8fCBcIkEgUGxheWVyXCI7XG5cbiAgICBjb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbiAgICByZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgLy8gVGhpcyBoYXJkIHJlbG9hZCBpcyBhIHJlbGlhYmxlIHdheSB0byByZXNldCB0aGUgZ2FtZSBzdGF0ZSBhbmQgcmV0dXJuIHRvIHRoZSBzdGFydC5cbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVudS1ib3hcIj5cbiAgICAgICAgICAgIDxoMT57d2lubmVyTmFtZS50b1VwcGVyQ2FzZSgpfSBXT04hPC9oMT5cbiAgICAgICAgICAgIDxwPlRoZSBsYXN0IHBsYXllciBzdGFuZGluZyB0YWtlcyB0aGUgY3Jvd24uPC9wPlxuICAgICAgICAgICAge3JlcGxheUJ0bn1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEdSSURfQk9SREVSX1NJWkUgPSA2O1xuY29uc3QgR0FNRV9DSFJPTUVfV0lEVEggPSA3MjtcbmNvbnN0IEdBTUVfQ0hST01FX0hFSUdIVCA9IDE1MDtcblxuY29uc3QgaW1hZ2VzID0ge1xuICAgIDI6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiLFxuICAgIDM6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX3dhbGwucG5nXCIsXG4gICAgNDogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZXhwbG9pdC5wbmdcIixcbn07XG5cbmNvbnN0IFtwbGF5ZXJOYW1lLCBzZXRQbGF5ZXJOYW1lXSA9IGNyZWF0ZVNpZ25hbChcIlBsYXllciAxXCIpO1xuY29uc3QgW2xpdmVzLCBzZXRMaXZlc10gPSBjcmVhdGVTaWduYWwoMyk7XG5jb25zdCBbc3BlZWQsIHNldFNwZWVkXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtib21icywgc2V0Qm9tYnNdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW3JhbmdlLCBzZXRSYW5nZV0gPSBjcmVhdGVTaWduYWwoMSk7XG5leHBvcnQgeyBzZXRQbGF5ZXJOYW1lLCBzZXRMaXZlcywgc2V0U3BlZWQsIHNldEJvbWJzLCBzZXRSYW5nZSB9O1xuXG5jb25zdCBuYW1lRWwgPSA8c3BhbiBjbGFzcz1cInBsYXllci1uYW1lXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbmFtZUVsLnRleHRDb250ZW50ID0gcGxheWVyTmFtZSgpOyB9KTtcblxuY29uc3QgbGl2ZXNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgbGl2ZXMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3Qgc3BlZWRFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgc3BlZWQtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgYm9tYnNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgYm9tYnMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgcmFuZ2VFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgcmFuZ2UtdmFsdWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBsaXZlc0VsLnRleHRDb250ZW50ID0gbGl2ZXMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBzcGVlZEVsLnRleHRDb250ZW50ID0gc3BlZWQoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBib21ic0VsLnRleHRDb250ZW50ID0gYm9tYnMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyByYW5nZUVsLnRleHRDb250ZW50ID0gcmFuZ2UoKTsgfSk7XG5cbmZ1bmN0aW9uIEdhbWUoeyBncmlkIH0pIHtcbiAgICBjb25zdCBib2FyZFdpZHRoID0gZ3JpZFswXS5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRIZWlnaHQgPSBncmlkLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZE91dGVyV2lkdGggPSBib2FyZFdpZHRoICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3QgYm9hcmRPdXRlckhlaWdodCA9IGJvYXJkSGVpZ2h0ICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBib2FyZFdpZHRoIDogd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRIZWlnaHQgOiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY29uc3Qgc2NhbGUgPSBNYXRoLm1pbihcbiAgICAgICAgMSxcbiAgICAgICAgTWF0aC5tYXgoMC4yLCAodmlld3BvcnRXaWR0aCAtIEdBTUVfQ0hST01FX1dJRFRIKSAvIGJvYXJkT3V0ZXJXaWR0aCksXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0SGVpZ2h0IC0gR0FNRV9DSFJPTUVfSEVJR0hUKSAvIGJvYXJkT3V0ZXJIZWlnaHQpXG4gICAgKTtcbiAgICBjb25zdCByb3dzID0gW107XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IGdyaWQubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCBncmlkW3Jvd0luZGV4XS5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBncmlkW3Jvd0luZGV4XVtjb2xJbmRleF07XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gXCJ0aWxlXCI7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBgd2lkdGg6JHtUSUxFX1NJWkV9cHg7aGVpZ2h0OiR7VElMRV9TSVpFfXB4O2A7XG5cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAyIHx8IGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS1mbG9vclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS13YWxsXCI7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzNdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbNF19KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMCB8fCBjZWxsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzJdfSlgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxscy5wdXNoKDxkaXYgY2xhc3M9e2NsYXNzTmFtZX0gZGF0YS14PXtjb2xJbmRleH0gZGF0YS15PXtyb3dJbmRleH0gc3R5bGU9e3N0eWxlfT48L2Rpdj4pO1xuICAgICAgICB9XG4gICAgICAgIHJvd3MucHVzaCg8ZGl2IGNsYXNzPVwiZ3JpZC1yb3dcIj57Y2VsbHN9PC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWdsYXNzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWJhclwiPlxuICAgICAgICAgICAgICAgICAgICB7bmFtZUVsfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+TGl2ZXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpdmVzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+U3BlZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwZWVkRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+Qm9tYnM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvbWJzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+UmFuZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JhbmdlRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtYm9hcmQtZnJhbWVcIiBzdHlsZT17YHdpZHRoOiR7Ym9hcmRPdXRlcldpZHRoICogc2NhbGV9cHg7aGVpZ2h0OiR7Ym9hcmRPdXRlckhlaWdodCAqIHNjYWxlfXB4O2B9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBpZD1cImdhbWUtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZ2FtZS1ncmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtgcG9zaXRpb246cmVsYXRpdmU7d2lkdGg6JHtib2FyZFdpZHRofXB4O2hlaWdodDoke2JvYXJkSGVpZ2h0fXB4O3RyYW5zZm9ybTpzY2FsZSgke3NjYWxlfSk7YH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IENoYXRQbGF5ZXJzIGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxubGV0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSBjcmVhdGVTaWduYWwoe30pO1xuZXhwb3J0IHsgc2V0U3RhdGVzIH07XG5cbmxldCByb29tSWRFbCA9IDxwPlJvb20gSUQ6IDwvcD47XG5sZXQgcGxheWVyc0VsID0gPHA+UGxheWVyczogIC8gNDwvcD47XG5sZXQgdGV4dEVsID0gPHA+PC9wPjtcbmxldCB0aW1lckVsID0gPHA+VGltZXI6IDwvcD47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcyA9IHN0YXRlcygpO1xuICAgIHJvb21JZEVsLnRleHRDb250ZW50ID0gYFJvb20gSUQ6ICR7cy5yb29tSWR9YDtcbiAgICBwbGF5ZXJzRWwudGV4dENvbnRlbnQgPSBgUGxheWVyczogJHtzLnBsYXllcnNDb3VudH0gLyA0YDtcbiAgICB0ZXh0RWwudGV4dENvbnRlbnQgPSBzLnRleHQgfHwgXCJcIjtcblxuICAgIGlmIChzLmdhbWVTdGFydGVkKSB7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBcIlRpbWVyOiBHYW1lIHN0YXJ0ZWRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0aW1lclRleHQgPSAoIXMuc2Vjb25kc0xlZnQpID8gXCJXYWl0aW5nIGZvciBvbmUgbW9yZSBwbGF5ZXJcIiA6IGAke3Muc2Vjb25kc0xlZnR9IHNlY29uZHNgO1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gYFRpbWVyOiAke3RpbWVyVGV4dH1gO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBMb2JieSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29uYXRpbmVyLWxvYmJ5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9iYnktYm94XCI+XG4gICAgICAgICAgICAgICAgPGgxPkxvYmJ5PC9oMT5cbiAgICAgICAgICAgICAgICB7cm9vbUlkRWx9XG4gICAgICAgICAgICAgICAge3BsYXllcnNFbH1cbiAgICAgICAgICAgICAgICB7dGV4dEVsfVxuICAgICAgICAgICAgICAgIHt0aW1lckVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q2hhdFBsYXllcnMgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2JieTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5jb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbnJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbmxldCBtZW51RWwgPSAoXG4gICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgIDxoMT5Zb3UgV2luITwvaDE+XG4gICAgICAgIDxwPkFsbCBvdGhlciBwbGF5ZXJzIGhhdmUgbGVmdCB0aGUgZ2FtZS48L3A+XG4gICAgICAgIHtyZXBsYXlCdG59XG4gICAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZW51KCkge1xuICAgIHJldHVybiBtZW51RWw7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHN1Ym1pdHRlZCA9IGZhbHNlO1xuXG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoc3VibWl0dGVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgbmlja25hbWUgPSBmb3JtRGF0YS5nZXQoXCJuaWNrbmFtZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFuaWNrbmFtZSB8fCBuaWNrbmFtZS5sZW5ndGggPiAyMCkgcmV0dXJuO1xuXG4gICAgICAgIHN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHNldFBsYXllck5hbWUobmlja25hbWUpO1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwibmlja25hbWVfb2ZfdGhlX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmlja25hbWUtaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW50ZXIgeW91ciBuYW1lXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmVnaXN0ZXItYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPnN0YXJ0IHBsYXlpbmc8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XG4iLCJjbGFzcyBTb3VuZCB7XG4gICAgY29uc3RydWN0b3Ioc3JjKSB7XG4gICAgICAgIHRoaXMubXVzaWMgPSBuZXcgQXVkaW8oc3JjKTtcbiAgICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcblxuICAgICAgICB0aGlzLm11c2ljLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNDtcblxuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc05hbWUgPSBcInNvdW5kLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5hcHBlbmQodGhpcy5pY29uKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGUoKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5idXR0b24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wbGF5KCksIHsgb25jZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLm11c2ljLnBsYXkoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11c2ljLnBhdXNlZCB8fCB0aGlzLm11c2ljLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb25cIik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQnV0dG9uKCkge1xuICAgICAgICBjb25zdCBpc011dGVkID0gdGhpcy5tdXNpYy5tdXRlZCB8fCB0aGlzLm11c2ljLnBhdXNlZDtcblxuICAgICAgICB0aGlzLmljb24uY2xhc3NOYW1lID0gaXNNdXRlZCA/IFwiZmEtc29saWQgZmEtdm9sdW1lLW9mZlwiIDogXCJmYS1zb2xpZCBmYS12b2x1bWUtaGlnaFwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtbXV0ZWRcIiwgaXNNdXRlZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VuZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAvYXBwLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwicHJvcHMiLCJjaGlsZHJlbiIsImVsZSIsImRvY3VtZW50Iiwia2V5Iiwic3RhcnRzV2l0aCIsImV2ZW50TmFtZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwiZmxhdENoaWxkcmVuIiwiZmxhdCIsIkluZmluaXR5IiwiYXBwZW5kIiwiZmlsdGVyIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJyZW5kZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwicmVwbGFjZUNoaWxkcmVuIiwiUm91dGVyIiwicm91dGVyIiwiZWZmZWN0U3RhY2siLCJhY3RpdmVFZmZlY3QiLCJjcmVhdGVTaWduYWwiLCJpbml0aWFsVmFsdWUiLCJ2YWx1ZSIsImVmZmVjdHMiLCJTZXQiLCJSZWFkIiwiYWRkIiwiV3JpdGUiLCJuZXdWYWx1ZSIsImZuIiwiZm9yRWFjaCIsImVmZmVjdCIsImNyZWF0ZUVmZmVjdCIsInB1c2giLCJwb3AiLCJsZW5ndGgiLCJSb3V0ZXMiLCJPYmplY3QiLCJjcmVhdGUiLCJGaXJzdFJlc29sdmUiLCJvbiIsInBhdGgiLCJoYW5kbGVyIiwibmF2aWdhdGUiLCJoaXN0b3J5IiwibmF2aWdhdGlvbiIsInJlc29sdmUiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwidXJsIiwiVVJMIiwiaHJlZiIsImxpc3RlbiIsIm9uRXJyb3I0MDQiLCJldmVudCIsImRlc3RpbmF0aW9uIiwiaW50ZXJjZXB0IiwiY29uc29sZSIsImxvZyIsIlJlZ2lzdGVyIiwiR2FtZSIsIk1lbnUiLCJMb2JieSIsIldpbk1lbnUiLCJzZXRTdGF0ZXMiLCJzZXRQbGF5ZXJOYW1lIiwic2V0SHVkUGxheWVyTmFtZSIsIlNvdW5kIiwic2V0TWVzc2FnZXMiLCJHYW1lRW5naW5lIiwicm9vdCIsImdldEVsZW1lbnRCeUlkIiwid3NzIiwiV2ViU29ja2V0Iiwid2luZG93IiwiaG9zdG5hbWUiLCJzb3VuZCIsImN1cnJlbnRHYW1lRW5naW5lIiwiaW5pdCIsImJvZHkiLCJjbGFzc05hbWUiLCJhbGVydCIsIndzIiwibWVzc2FnZSIsIkpTT04iLCJwYXJzZSIsImRhdGEiLCJxdWVyeVNlbGVjdG9yIiwicm9vbUlkIiwicGxheWVyc0NvdW50Iiwic2Vjb25kc0xlZnQiLCJ0ZXh0IiwiZ3JpZCIsInNldFRpbWVvdXQiLCJnYW1lQ29udGFpbmVyIiwiZGVzdHJveSIsImxvY2FsUGxheWVyIiwicGxheWVycyIsImZpbmQiLCJwbGF5ZXIiLCJpZCIsInlvdXJQbGF5ZXJJZCIsIm5pY2tuYW1lIiwiZW5naW5lIiwiZXJyb3IiLCJ3aW5uZXJOYW1lIiwicHJldiIsImhhbmRsZVJlbW90ZU1vdmUiLCJwYXlsb2FkIiwiaGFuZGxlUmVtb3RlQm9tYiIsImhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQiLCJoYW5kbGVSZW1vdGVJdGVtUGlja3VwIiwiZXJyIiwibWVzc2FnZXMiLCJDaGF0UGxheWVycyIsIm1lc3NhZ2VzQ29udGFpbmVyIiwiY2xhc3MiLCJtc2dzIiwiaW5uZXJIVE1MIiwibXNnIiwicCIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCIsImZpcnN0RWxlbWVudENoaWxkIiwidW5zaGlmdCIsImJyb2FkY2FzdE1lc3NhZ2UiLCJlIiwicHJldmVudERlZmF1bHQiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwidGFyZ2V0IiwiZ2V0IiwidHJpbSIsInJlc2V0Iiwic2VuZCIsInN0cmluZ2lmeSIsIm9uU3VibWl0IiwibmFtZSIsInBsYWNlaG9sZGVyIiwibWF4bGVuZ3RoIiwiUG9zaXRpb25Db21wb25lbnQiLCJneCIsImd5IiwidGlsZVNpemUiLCJncmlkWCIsImdyaWRZIiwieCIsInkiLCJ0YXJnZXRYIiwidGFyZ2V0WSIsIlZlbG9jaXR5Q29tcG9uZW50IiwiYmFzZVNwZWVkIiwic3BlZWQiLCJpc01vdmluZyIsImRpcmVjdGlvbiIsIklucHV0Q29tcG9uZW50IiwiaW5wdXRRdWV1ZSIsIlJlbmRlcmFibGVDb21wb25lbnQiLCJlbCIsImZyYW1lV2lkdGgiLCJmcmFtZUhlaWdodCIsInRvdGFsRnJhbWVzIiwiZnBzIiwiY3VycmVudEZyYW1lIiwicnVuRnJhbWVzIiwiaWRsZUZyYW1lcyIsImlkbGVGcHMiLCJsYXN0RnJhbWVUaW1lIiwicm93Iiwic3RhdGUiLCJsYXN0U3RhdGUiLCJQbGF5ZXJDb21wb25lbnQiLCJjaGFyVHlwZSIsImlzTG9jYWwiLCJCb21iQ29tcG9uZW50Iiwib3duZXJJZCIsInRpbWVyIiwicmFuZ2UiLCJleHBsb2RlZCIsIkV4cGxvc2lvbkNvbXBvbmVudCIsImR1cmF0aW9uIiwiUG93ZXJVcENvbXBvbmVudCIsInBpY2tlZFVwIiwiQmVoYXZpb3JDb21wb25lbnQiLCJnaG9zdE1vZGUiLCJ0aHJvd2FibGUiLCJkZXRvbmF0b3IiLCJmYXN0U2hvZXNMZXZlbCIsImJvbWJzIiwibWF4IiwiY3VycmVudCIsIldvcmxkIiwibW92ZW1lbnRTeXN0ZW0iLCJyZW5kZXJTeXN0ZW0iLCJib21iU3lzdGVtIiwiZGFtYWdlU3lzdGVtIiwiY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyIsInNwYXduSGVhcnRQb3dlclVwIiwicG93ZXJVcFN5c3RlbSIsInNwYXduUG93ZXJVcCIsInNldEJvbWJzIiwic2V0TGl2ZXMiLCJzZXRSYW5nZSIsInNldFNwZWVkIiwiVElMRV9TSVpFIiwiQU5JTUFUSU9OX1JPV1MiLCJSVU4iLCJ1cCIsImxlZnQiLCJkb3duIiwicmlnaHQiLCJJRExFIiwiY29uc3RydWN0b3IiLCJjYW52YXNDb250YWluZXIiLCJtYXBEYXRhIiwic29ja2V0Iiwid29ybGQiLCJsb2NhbFBsYXllckVudGl0eSIsInBsYXllckVudGl0aWVzIiwiTWFwIiwicGxheWVySW5mbyIsImxhc3RUaW1lIiwicmVtb3ZlSW5wdXRMaXN0ZW5lcnMiLCJhbmltYXRpb25GcmFtZSIsInJ1bm5pbmciLCJjbGFpbWVkUG93ZXJVcHMiLCJsb3NzTW9kYWxUcmlnZ2VyZWQiLCJpbnB1dEVuYWJsZWQiLCJnYW1lRW5kZWQiLCJsb2NhbFBsYXllcklkIiwiYWxsUGxheWVycyIsInRvdGFsUGxheWVycyIsIm5vcm1hbGl6ZWRMb2NhbFBsYXllcklkIiwiU3RyaW5nIiwicERhdGEiLCJwbGF5ZXJJZCIsInBsYXllckVudGl0eSIsImNyZWF0ZUVudGl0eSIsInNldCIsInBsYXllckRpdiIsImNvbG9yIiwic3R5bGUiLCJwb3NpdGlvbiIsInpJbmRleCIsIndpbGxDaGFuZ2UiLCJzeCIsInN5IiwiYWRkQ29tcG9uZW50IiwicGxheWVyQ29tcCIsImxpdmVzIiwibWF4Qm9tYnMiLCJib21iUmFuZ2UiLCJ1cGRhdGVIdWRTdGF0cyIsInNldHVwSW5wdXQiLCJ3YXJuIiwibWFwIiwicmVnaXN0ZXJTeXN0ZW1zIiwicGVyZm9ybWFuY2UiLCJub3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJnYW1lTG9vcCIsImlucHV0IiwiZ2V0Q29tcG9uZW50IiwiZ2V0S2V5RGlyZWN0aW9uIiwiaGFuZGxlS2V5RG93biIsImRpciIsImluY2x1ZGVzIiwiY29kZSIsImRyb3BCb21iIiwiaGFuZGxlS2V5VXAiLCJkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInBvcyIsImN1cnJlbnRCb21icyIsInF1ZXJ5IiwiYkVudGl0eSIsImNyZWF0ZWQiLCJjcmVhdGVCb21iIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJleGlzdHMiLCJzb21lIiwiZW50aXR5IiwiYm9tYiIsImJvbWJFbnRpdHkiLCJib21iRGl2IiwidG9wIiwiYm9tYkNvbXAiLCJBcnJheSIsImZyb20iLCJrZXlzIiwidmVsIiwicmVuZGVyYWJsZSIsInJlbW92ZVBvd2VyVXBBdCIsImFwcGx5UG93ZXJVcCIsIm5ld0xpdmVzIiwicG93ZXJVcHMiLCJwb3dlclVwIiwicGFyZW50Tm9kZSIsImRlc3Ryb3lFbnRpdHkiLCJ2ZWxvY2l0eSIsIk1hdGgiLCJtaW4iLCJ1cGRhdGVNYXBDZWxsIiwidGlsZSIsImJhY2tncm91bmRJbWFnZSIsImRlc3Ryb3lCb3hDYWxsYmFjayIsImhhcyIsIm9uUGxheWVySHVydCIsInJlbWFpbmluZ0xpdmVzIiwib25Qb3dlclVwUGlja2VkIiwib25IZWFydFBpY2tlZFVwIiwiYnJvYWRjYXN0TW92ZW1lbnQiLCJhZGRTeXN0ZW0iLCJ3IiwiZHQiLCJ1cGRhdGUiLCJuZXh0Tm93IiwiaGFuZGxlR2FtZU92ZXIiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJvdW5kIiwiY3VycmVudExvY2FsUGxheWVyTmFtZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJnZXRQbGF5ZXJOYW1lIiwiZ2V0SXRlbSIsImFmZmVjdGVkQ2VsbHMiLCJjYWxjdWxhdGVFeHBsb3Npb25DZWxscyIsImNlbGwiLCJleHBFbnRpdHkiLCJleHBEaXYiLCJ3aWR0aCIsImhlaWdodCIsImV4cGxvc2lvbnMiLCJleHAiLCJieCIsImJ5IiwiY2VsbHMiLCJkaXJlY3Rpb25zIiwic3RlcHMiLCJpIiwidHgiLCJ0eSIsImNlbGxUeXBlIiwiaGVhcnRFbnRpdHkiLCJoZWFydERpdiIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJmb250U2l6ZSIsImhhbmRsZVBsYXllckRlYXRoIiwiZGVhdGhHcmlkWCIsImZsb29yIiwiZGVhdGhHcmlkWSIsInJlbW92ZUNvbXBvbmVudCIsInBQb3MiLCJpbnZpbmNpYmxlVW50aWwiLCJlUG9zIiwicGxheWVyR3JpZFgiLCJwbGF5ZXJHcmlkWSIsInByZXZpb3VzTGl2ZXMiLCJhbHJlYWR5UmVwb3J0ZWREZWFkIiwiZW50aXRpZXMiLCJkZWx0YSIsIlBMQVlFUl9TSVpFIiwiYmVoYXZpb3IiLCJtb3ZlVG93YXJkVGFyZ2V0IiwiYWN0aXZlSW5wdXQiLCJkeCIsImR5IiwiaGFzSW5wdXQiLCJuZXh0WCIsIm5leHRZIiwic25hcFRocmVzaG9sZCIsImlzQmxvY2tlZCIsImN1cnJlbnRUaWxlWCIsImRpZmZYIiwiYWJzIiwic2lnbiIsImN1cnJlbnRUaWxlWSIsImRpZmZZIiwibmV4dFhBZnRlclNuYXAiLCJuZXh0WUFmdGVyU25hcCIsInN0ZXAiLCJwbGF5ZXJTaXplIiwicGFkZGluZyIsImJvdHRvbSIsImlzQmxvY2tlZENlbGwiLCJwVXBFbnRpdHkiLCJ1cFBvcyIsInBVcCIsInNlZWQiLCJzZWVkUmFuZG9tIiwic2luIiwidHlwZXMiLCJ0eXBlSW5kZXgiLCJyYW5kb21UeXBlIiwiZGl2IiwiYW5pbVJvd3MiLCJ0YXJnZXRSb3ciLCJmcmFtZUNvdW50IiwiZnJhbWVEZWxheSIsInBvc1giLCJwb3NZIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwidHJhbnNmb3JtIiwibmV4dEVudGl0eUlkIiwiY29tcG9uZW50cyIsInN5c3RlbXMiLCJkZWxldGUiLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50TWFwIiwiZW50cmllcyIsImNvbXBvbmVudERhdGEiLCJjb21wb25lbnROYW1lcyIsImZpcnN0TWFwIiwicmVzdWx0cyIsImhhc0FsbCIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwicmVwbGF5QnRuIiwicmVsb2FkIiwidG9VcHBlckNhc2UiLCJHUklEX0JPUkRFUl9TSVpFIiwiR0FNRV9DSFJPTUVfV0lEVEgiLCJHQU1FX0NIUk9NRV9IRUlHSFQiLCJpbWFnZXMiLCJwbGF5ZXJOYW1lIiwibmFtZUVsIiwibGl2ZXNFbCIsInNwZWVkRWwiLCJib21ic0VsIiwicmFuZ2VFbCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImJvYXJkT3V0ZXJXaWR0aCIsImJvYXJkT3V0ZXJIZWlnaHQiLCJ2aWV3cG9ydFdpZHRoIiwiaW5uZXJXaWR0aCIsInZpZXdwb3J0SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJzY2FsZSIsInJvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4Iiwic3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsImdhbWVTdGFydGVkIiwidGltZXJUZXh0IiwibWVudUVsIiwic3VibWl0dGVkIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImJ1dHRvbiIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwicGxheSIsIm9uY2UiLCJ1cGRhdGVCdXR0b24iLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiXSwic291cmNlUm9vdCI6IiJ9