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
      // Update HUD for local player when they pick up ANY power-up (including HEART)
      if (player && player.id === id) {
        this.updateHudStats(this.localPlayerEntity);
      }

      // Notify server for sync across all clients
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: type === 'HEART' ? 'ITEM_PICKUP' : 'POWERUP_PICKED',
          payload: type === 'HEART' ? {
            playerId: id,
            newLives: player?.lives,
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
          // ========== CRITICAL HEART PICKUP LOGIC ==========
          // Step 1: Get current lives from THIS player (not from heart entity!)
          const currentLives = player.lives || 0;

          // Step 2: Forcefully increment by 1 (simple addition, no other logic)
          const newLives = currentLives + 1;
          player.lives = newLives;
          console.log(`[HEART PICKUP] Player ${player.id} gained a life: ${currentLives} → ${newLives}`);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SyxDQUFDYSxLQUFLLEdBQUcsSUFBSTtNQUN2QixJQUFJLENBQUNYLE1BQU0sQ0FBQ3pjLFlBQVksQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDO01BQ3ZELElBQUksQ0FBQ2dkLFlBQVksQ0FBQyxDQUFDO0lBQ3ZCO0VBQ0o7RUFFQUEsWUFBWUEsQ0FBQSxFQUFHO0lBQ1gsTUFBTUssT0FBTyxHQUFHLElBQUksQ0FBQ2QsS0FBSyxDQUFDYSxLQUFLLElBQUksSUFBSSxDQUFDYixLQUFLLENBQUNZLE1BQU07SUFFckQsSUFBSSxDQUFDVCxJQUFJLENBQUM5WCxTQUFTLEdBQUd5WSxPQUFPLEdBQUcsd0JBQXdCLEdBQUcseUJBQXlCO0lBQ3BGLElBQUksQ0FBQ1osTUFBTSxDQUFDYSxTQUFTLENBQUNULE1BQU0sQ0FBQyxVQUFVLEVBQUVRLE9BQU8sQ0FBQztFQUNyRDtBQUNKO0FBRUEsaUVBQWV0WixLQUFLLEU7Ozs7OztVQ25EcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvZG9tLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NoYXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9lY3MvY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3dvcmxkLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9XaW5NZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvZ2FtZS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2xvYmJ5LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL3JlZ2lzdGVyLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvc291bmQuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIHByb3BzLCAuLi5jaGlsZHJlbikge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiB0eXBlKHsgLi4uKHByb3BzIHx8IHt9KSwgY2hpbGRyZW4gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzIHx8IHt9KSB7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChcIm9uXCIpICYmIHR5cGVvZiBwcm9wc1trZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGtleS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZS5zZXRBdHRyaWJ1dGUoa2V5LCBwcm9wc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZsYXRDaGlsZHJlbiA9IGNoaWxkcmVuLmZsYXQoSW5maW5pdHkpO1xuICAgIGVsZS5hcHBlbmQoLi4uZmxhdENoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gbnVsbCAmJiBjaGlsZCAhPT0gdW5kZWZpbmVkICYmIGNoaWxkICE9PSBmYWxzZSkpO1xuXG4gICAgcmV0dXJuIGVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICBjb250YWluZXIucmVwbGFjZUNoaWxkcmVuKGVsZW1lbnQpO1xufVxuIiwiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4vcm91dGVyLmpzXCI7XG5cbmxldCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjsiLCJjb25zdCBlZmZlY3RTdGFjayA9IFtdO1xubGV0IGFjdGl2ZUVmZmVjdCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaWduYWwoaW5pdGlhbFZhbHVlKSB7XG4gICBsZXQgdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICBjb25zdCBlZmZlY3RzID0gbmV3IFNldCgpO1xuXG4gICBjb25zdCBSZWFkID0gKCkgPT4ge1xuICAgICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgICAgZWZmZWN0cy5hZGQoYWN0aXZlRWZmZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgIH1cblxuICAgY29uc3QgV3JpdGUgPSAobmV3VmFsdWUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgbGV0IGZuID0gbmV3VmFsdWU7XG4gICAgICAgICB2YWx1ZSA9IGZuKHZhbHVlKTtcbiAgICAgIH0gXG4gICAgICBlbHNlIHZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBlZmZlY3RzLmZvckVhY2goZWZmZWN0ID0+IGVmZmVjdCgpKTtcbiAgIH1cblxuICAgcmV0dXJuIFtSZWFkLCBXcml0ZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFZmZlY3QoZWZmZWN0KSB7XG4gICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3Q7XG4gICBlZmZlY3QoKTtcbiAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbn1cbiIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgICNSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICNGaXJzdFJlc29sdmUgPSBmYWxzZTtcblxuICAgIG9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy4jUm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFxuICAgIG5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSA9IFwicHVzaFwiIH0gPSB7fSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBcIi9cIiArIHBhdGg7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzb2x2ZShwYXRoID0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbcGF0aF07XG5cbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm4oeyB1cmw6IG5ldyBVUkwobG9jYXRpb24uaHJlZikgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxpc3RlbihvbkVycm9yNDA0KSB7XG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5pbnRlcmNlcHQoe1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLnBhdGhuYW1lLCB0aGlzLiNSb3V0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3VybC5wYXRobmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I0MDQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbih7IHVybCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNGaXJzdFJlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdGhpcy4jRmlyc3RSZXNvbHZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgcmVuZGVyIH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmtcIjtcbmltcG9ydCBSZWdpc3RlciBmcm9tIFwiLi4vcGFnZXMvcmVnaXN0ZXJcIjtcbmltcG9ydCBHYW1lIGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgTWVudSBmcm9tIFwiLi4vcGFnZXMvbWVudVwiO1xuaW1wb3J0IExvYmJ5IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IFdpbk1lbnUgZnJvbSBcIi4uL3BhZ2VzL1dpbk1lbnUuanN4XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiOyBcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoYHdzOi8vJHt3aW5kb3cubG9jYXRpb24uaG9zdG5hbWV9OjUwMDBgKTtcbmNvbnN0IHNvdW5kID0gbmV3IFNvdW5kKFwiLi9hc3NldHMvc291bmRzL2JhY2tncm91bmRfbXVzaWMubXAzXCIpO1xubGV0IGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcblxuc291bmQuaW5pdCgpO1xuXG5yb3V0ZXIub24oXCIvXCIsICgpID0+IHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwicmVnaXN0ZXItcGFnZVwiO1xuICAgIHJlbmRlcig8UmVnaXN0ZXIgd3NzPXt3c3N9IC8+LCByb290KTtcbn0pO1xuXG5yb3V0ZXIubGlzdGVuKCgpID0+IHsgYWxlcnQoXCI0MDRcIikgfSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCAod3MpID0+IHtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInJvb21fdXBkYXRlXCI6XG4gICAgICAgIGNhc2UgXCJsb2JieV90aW1lclwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImxvYmJ5LXBhZ2VcIjtcbiAgICAgICAgICAgIGlmICghcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmNvbmF0aW5lci1sb2JieVwiKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcig8TG9iYnkgLz4sIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogbWVzc2FnZS5wbGF5ZXJzQ291bnQsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IG1lc3NhZ2Uuc2Vjb25kc0xlZnQsXG4gICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZ2FtZV9zdGFydGVkXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwiZ2FtZS1wYWdlXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlbmRlcig8R2FtZSBncmlkPXttZXNzYWdlLmdyaWR9IC8+LCByb290KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFBsYXllciA9IChtZXNzYWdlLnBsYXllcnMgfHwgW10pLmZpbmQocGxheWVyID0+IHBsYXllci5pZCA9PT0gbWVzc2FnZS55b3VyUGxheWVySWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxQbGF5ZXIgJiYgbG9jYWxQbGF5ZXIubmlja25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEh1ZFBsYXllck5hbWUobG9jYWxQbGF5ZXIubmlja25hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5naW5lID0gbmV3IEdhbWVFbmdpbmUoZ2FtZUNvbnRhaW5lciwgbWVzc2FnZS5ncmlkLCB3c3MpO1xuICAgICAgICAgICAgICAgICAgICBlbmdpbmUuaW5pdChtZXNzYWdlLnlvdXJQbGF5ZXJJZCwgbWVzc2FnZS5wbGF5ZXJzIHx8IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gZW5naW5lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJHYW1lIGNvbnRhaW5lciB3YXMgbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJyb29tX2Fsb25lXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPE1lbnUgLz4sIHJvb3QpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfd29uXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPFdpbk1lbnUgd2lubmVyTmFtZT17bWVzc2FnZS53aW5uZXJOYW1lfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2ICxtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpdGVtX3BpY2tlZFwiOlxuICAgICAgICAgICAgLy8gSGFuZGxlIHJlbW90ZSBoZWFydCBwaWNrdXAgLSB1cGRhdGUgdGhlIHBsYXllcidzIGxpdmVzIG9uIGFsbCBjbGllbnRzXG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVJdGVtUGlja3VwKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvclwiLCBlcnIpO1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdzcztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgd3NzIGZyb20gXCIuLi9hcHAvYXBwXCI7XG5cbmNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gY3JlYXRlU2lnbmFsKFtdKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzIH07XG5cbmZ1bmN0aW9uIENoYXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IG1lc3NhZ2VzQ29udGFpbmVyID0gPGRpdiBjbGFzcz1cIm1lc3NhZ2VzXCI+PC9kaXY+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNncyA9IG1lc3NhZ2VzKCk7XG4gICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgbXNnIG9mIG1zZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBtc2c7XG4gICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG1lc3NhZ2VzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBtc2dzLnVuc2hpZnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBmb3JtRGF0YS5nZXQoXCJtZXNzYWdlXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcImNoYXRfbWVzc2FnZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgfSkpO1xuICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0XCIgb25TdWJtaXQ9e2Jyb2FkY2FzdE1lc3NhZ2V9PlxuICAgICAgICAgICAge21lc3NhZ2VzQ29udGFpbmVyfVxuICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1lc3NhZ2VcIiBwbGFjZWhvbGRlcj1cInR5cGUgdG8gdGhlIG90aGVyIHBsYXllcnMgLi4uXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXRQbGF5ZXJzOyIsIi8vIC9zcmMvZWNzL2NvbXBvbmVudHMuanNcblxuZXhwb3J0IGNvbnN0IFBvc2l0aW9uQ29tcG9uZW50ID0gKGd4LCBneSwgdGlsZVNpemUgPSA2NCkgPT4gKHtcbiAgICBncmlkWDogZ3gsXG4gICAgZ3JpZFk6IGd5LFxuICAgIHg6IGd4ICogdGlsZVNpemUsXG4gICAgeTogZ3kgKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRYOiBneCAqIHRpbGVTaXplLFxuICAgIHRhcmdldFk6IGd5ICogdGlsZVNpemVcbn0pO1xuXG5leHBvcnQgY29uc3QgVmVsb2NpdHlDb21wb25lbnQgPSAoYmFzZVNwZWVkID0gMi41KSA9PiAoe1xuICAgIGJhc2VTcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkOiBiYXNlU3BlZWQsXG4gICAgaXNNb3Zpbmc6IGZhbHNlLFxuICAgIGRpcmVjdGlvbjogJ2Rvd24nXG59KTtcblxuZXhwb3J0IGNvbnN0IElucHV0Q29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBpbnB1dFF1ZXVlOiBbXVxufSk7XG5cbmV4cG9ydCBjb25zdCBSZW5kZXJhYmxlQ29tcG9uZW50ID0gKGVsLCBmcmFtZVdpZHRoID0gNjQsIGZyYW1lSGVpZ2h0ID0gNjQsIHRvdGFsRnJhbWVzID0gNCwgZnBzID0gMTIpID0+ICh7XG4gICAgZWw6IGVsLFxuICAgIGZyYW1lV2lkdGg6IGZyYW1lV2lkdGgsXG4gICAgZnJhbWVIZWlnaHQ6IGZyYW1lSGVpZ2h0LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogdG90YWxGcmFtZXMsXG4gICAgcnVuRnJhbWVzOiA0LFxuICAgIGlkbGVGcmFtZXM6IDIsXG4gICAgZnBzOiBmcHMsXG4gICAgaWRsZUZwczogNCxcbiAgICBsYXN0RnJhbWVUaW1lOiAwLFxuICAgIHJvdzogMCxcbiAgICBzdGF0ZTogJ0lETEUnLFxuICAgIGxhc3RTdGF0ZTogJ0lETEUnXG59KTtcblxuZXhwb3J0IGNvbnN0IFBsYXllckNvbXBvbmVudCA9IChpZCwgY2hhclR5cGUsIGlzTG9jYWwgPSBmYWxzZSkgPT4gKHtcbiAgICBpZDogaWQsXG4gICAgY2hhclR5cGU6IGNoYXJUeXBlLFxuICAgIGlzTG9jYWw6IGlzTG9jYWxcbn0pO1xuXG5leHBvcnQgY29uc3QgQm9tYkNvbXBvbmVudCA9IChvd25lcklkLCB0aW1lciA9IDIwMDAsIHJhbmdlID0gNCkgPT4gKHtcbiAgICBvd25lcklkOiBvd25lcklkLFxuICAgIHRpbWVyOiB0aW1lcixcbiAgICByYW5nZTogcmFuZ2UsXG4gICAgZXhwbG9kZWQ6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEV4cGxvc2lvbkNvbXBvbmVudCA9IChkdXJhdGlvbiA9IDUwMCkgPT4gKHtcbiAgICBkdXJhdGlvbjogZHVyYXRpb25cbn0pO1xuXG5leHBvcnQgY29uc3QgUG93ZXJVcENvbXBvbmVudCA9ICh0eXBlKSA9PiAoe1xuICAgIHR5cGU6IHR5cGUsIFxuICAgIHBpY2tlZFVwOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBCZWhhdmlvckNvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgZ2hvc3RNb2RlOiBmYWxzZSxcbiAgICB0aHJvd2FibGU6IGZhbHNlLFxuICAgIGRldG9uYXRvcjogZmFsc2UsXG4gICAgZmFzdFNob2VzTGV2ZWw6IDEsXG4gICAgYm9tYnM6IHtcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICByYW5nZTogMlxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkLmpzJztcbmltcG9ydCB7XG4gICAgUG9zaXRpb25Db21wb25lbnQsXG4gICAgVmVsb2NpdHlDb21wb25lbnQsXG4gICAgSW5wdXRDb21wb25lbnQsXG4gICAgUmVuZGVyYWJsZUNvbXBvbmVudCxcbiAgICBQbGF5ZXJDb21wb25lbnQsXG4gICAgQm9tYkNvbXBvbmVudFxufSBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuaW1wb3J0IHsgbW92ZW1lbnRTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyc7XG5pbXBvcnQgeyBib21iU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgZGFtYWdlU3lzdGVtLCBjaGVja0dhbWVFbmRDb25kaXRpb25zLCBzcGF3bkhlYXJ0UG93ZXJVcCB9IGZyb20gJy4vc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMnO1xuaW1wb3J0IFdpbk1lbnUgZnJvbSAnLi4vcGFnZXMvV2luTWVudS5qc3gnO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tLmpzJztcblxuaW1wb3J0IHsgcG93ZXJVcFN5c3RlbSwgc3Bhd25Qb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMnO1xuaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQgfSBmcm9tICcuLi9wYWdlcy9nYW1lJztcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzQ29udGFpbmVyLCBtYXBEYXRhLCBzb2NrZXQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjYW52YXNDb250YWluZXI7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IG1hcERhdGE7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XG4gICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnBsYXllckluZm8gPSBuZXcgTWFwKCk7IC8vIFN0b3JlIG9yaWdpbmFsIHBsYXllciBkYXRhIGxpa2Ugbmlja25hbWVcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IDA7XG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzID0gbmV3IFNldCgpO1xuICAgICAgICAvLyBTdGF0ZSBmbGFnIHRvIHByZXZlbnQgbXVsdGlwbGUgbG9zcyBtb2RhbCByZW5kZXJzIChUaGUgTG9vcCBUcmFwIGZpeClcbiAgICAgICAgdGhpcy5sb3NzTW9kYWxUcmlnZ2VyZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gRmxhZyB0byB0cmFjayBpZiBpbnB1dCBzaG91bGQgYmUgZGlzYWJsZWRcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAvLyBGbGFnIHRvIHN0b3AgdGhlIGdhbWUgbG9vcCBvbmNlIGEgd2lubmVyIGlzIGRlY2lkZWRcbiAgICAgICAgdGhpcy5nYW1lRW5kZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0KGxvY2FsUGxheWVySWQsIGFsbFBsYXllcnMpIHtcbiAgICAgICAgdGhpcy50b3RhbFBsYXllcnMgPSBhbGxQbGF5ZXJzLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZExvY2FsUGxheWVySWQgPSBTdHJpbmcobG9jYWxQbGF5ZXJJZCk7XG5cbiAgICAgICAgYWxsUGxheWVycy5mb3JFYWNoKHBEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gU3RyaW5nKHBEYXRhLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckluZm8uc2V0KHBsYXllcklkLCBwRGF0YSk7IC8vIFN0b3JlIG9yaWdpbmFsIHBsYXllciBkYXRhXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcERhdGEuY29sb3IgfHwgXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gYHBsYXllciBwbGF5ZXItJHtjb2xvcn1gO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS56SW5kZXggPSAnMTAnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckRpdik7XG5cbiAgICAgICAgICAgIGNvbnN0IHN4ID0gcERhdGEueCB8fCAxO1xuICAgICAgICAgICAgY29uc3Qgc3kgPSBwRGF0YS55IHx8IDE7XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJywgUG9zaXRpb25Db21wb25lbnQoc3gsIHN5LCBUSUxFX1NJWkUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5JywgVmVsb2NpdHlDb21wb25lbnQoMi41KSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJywgUmVuZGVyYWJsZUNvbXBvbmVudChwbGF5ZXJEaXYsIDY0LCA2NCwgNCwgMTIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpc0xvY2FsID0gcGxheWVySWQgPT09IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IFBsYXllckNvbXBvbmVudChwbGF5ZXJJZCwgY29sb3IsIGlzTG9jYWwpO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5saXZlcyA9IDM7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLm1heEJvbWJzID0gMTtcbiAgICAgICAgICAgIHBsYXllckNvbXAuYm9tYlJhbmdlID0gNDtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicsIHBsYXllckNvbXApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcy5zZXQocGxheWVySWQsIHBsYXllckVudGl0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc0xvY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcsIElucHV0Q29tcG9uZW50KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMocGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltHYW1lRW5naW5lXSBMb2NhbCBwbGF5ZXIgd2FzIG5vdCBmb3VuZFwiLCB7XG4gICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXJJZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzOiBhbGxQbGF5ZXJzLm1hcChwbGF5ZXIgPT4gcGxheWVyLmlkKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlclN5c3RlbXMoKTtcblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5vdykgPT4gdGhpcy5nYW1lTG9vcChub3cpKTtcbiAgICB9XG5cbiAgICBzZXR1cElucHV0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZ2V0S2V5RGlyZWN0aW9uID0gKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93VXAnIHx8IGtleSA9PT0gJ3cnIHx8IGtleSA9PT0gJ1onIHx8IGtleSA9PT0gJ3onKSByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93TGVmdCcgfHwga2V5ID09PSAnYScgfHwga2V5ID09PSAnUScgfHwga2V5ID09PSAncScpIHJldHVybiAnbGVmdCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dSaWdodCcgfHwga2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpIHJldHVybiAncmlnaHQnO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgICAgICAgICAvLyBJTlBVVCBESVNBQkxFRDogSW1tZWRpYXRlbHkgaWdub3JlIGFsbCBrZXlib2FyZCBpbnB1dHMgd2hlbiBwbGF5ZXIgaXMgZGVhZFxuICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0RW5hYmxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlLnVuc2hpZnQoZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICAgICAgLy8gSU5QVVQgRElTQUJMRUQ6IEltbWVkaWF0ZWx5IGlnbm9yZSBhbGwga2V5Ym9hcmQgaW5wdXRzIHdoZW4gcGxheWVyIGlzIGRlYWRcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dEVuYWJsZWQpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkcm9wQm9tYigpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRCb21icyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5maWx0ZXIoYkVudGl0eSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoYkVudGl0eSwgJ0JvbWInKS5vd25lcklkID09PSBwbGF5ZXIuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjdXJyZW50Qm9tYnMubGVuZ3RoID49IHBsYXllci5tYXhCb21icykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUJvbWIocGxheWVyLmlkLCBwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgcGxheWVyLmJvbWJSYW5nZSk7XG4gICAgICAgIGlmICghY3JlYXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0RST1BfQk9NQicsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZDogcGxheWVyLmlkLCB4OiBwb3MuZ3JpZFgsIHk6IHBvcy5ncmlkWSwgcmFuZ2U6IHBsYXllci5ib21iUmFuZ2UgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiBib21iLm93bmVySWQgPT09IG93bmVySWQgJiYgcG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuZWwgPSBib21iRGl2O1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicsIGJvbWJDb21wKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlTW92ZShwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW2hhbmRsZVJlbW90ZU1vdmVdIEludmFsaWQgcGF5bG9hZDpcIiwgcGF5bG9hZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBFbnRpdHkgbm90IGZvdW5kIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfS4gQXZhaWxhYmxlIHBsYXllcnM6YCwgQXJyYXkuZnJvbSh0aGlzLnBsYXllckVudGl0aWVzLmtleXMoKSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtoYW5kbGVSZW1vdGVNb3ZlXSBJZ25vcmluZyBsb2NhbCBwbGF5ZXIgdXBkYXRlIGZvciAke3BheWxvYWQuaWR9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwb3MgfHwgIXZlbCB8fCAhcmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gVXBkYXRpbmcgcGxheWVyICR7cGF5bG9hZC5pZH0gdG8gKCR7cGF5bG9hZC5ncmlkWH0sICR7cGF5bG9hZC5ncmlkWX0pYCk7XG4gICAgICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgICAgICBwb3MuZ3JpZFggPSBwYXlsb2FkLmdyaWRYO1xuICAgICAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgICAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwYXlsb2FkLnk7XG4gICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZUJvbWIocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDQpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgcGF5bG9hZC54ID09PSB1bmRlZmluZWQgfHwgcGF5bG9hZC55ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnJlbW92ZVBvd2VyVXBBdChwYXlsb2FkLngsIHBheWxvYWQueSk7XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkIHx8IGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYXBwbHlQb3dlclVwKGVudGl0eSwgcGF5bG9hZC50eXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHJlbW90ZSBoZWFydCBwaWNrdXAgLSB1cGRhdGVzIHBsYXllciBsaXZlcyBhbmQgVUkgb24gYWxsIGNsaWVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIHsgcGxheWVySWQsIG5ld0xpdmVzIH1cbiAgICAgKi9cbiAgICBoYW5kbGVSZW1vdGVJdGVtUGlja3VwKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLnBsYXllcklkIHx8IHBheWxvYWQubmV3TGl2ZXMgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLnBsYXllcklkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBsYXllcikgcmV0dXJuO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgcGxheWVyJ3MgbGl2ZXNcbiAgICAgICAgcGxheWVyLmxpdmVzID0gcGF5bG9hZC5uZXdMaXZlcztcblxuICAgICAgICAvLyBVcGRhdGUgSFVEIGlmIHRoaXMgaXMgdGhlIGxvY2FsIHBsYXllclxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKGVudGl0eSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW1JlbW90ZSBJdGVtIFBpY2t1cF0gUGxheWVyICR7cGF5bG9hZC5wbGF5ZXJJZH0gcGlja2VkIHVwIGhlYXJ0LiBOZXcgbGl2ZXM6ICR7cGF5bG9hZC5uZXdMaXZlc31gKTtcbiAgICB9XG5cbiAgICByZW1vdmVQb3dlclVwQXQoZ3JpZFgsIGdyaWRZKSB7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHtncmlkWH0sJHtncmlkWX1gKTtcbiAgICAgICAgY29uc3QgcG93ZXJVcHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwb3dlclVwID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCFwb3MgfHwgIXBvd2VyVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcG93ZXJVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAocG93ZXJVcC5lbCAmJiBwb3dlclVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG93ZXJVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvd2VyVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UG93ZXJVcChlbnRpdHksIHR5cGUpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdTUEVFRCcpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5LnNwZWVkID0gTWF0aC5taW4odmVsb2NpdHkuc3BlZWQgKyAxLCA4KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAvLyBIRUFSVCBwb3dlci11cDogaW5jcmVtZW50IGxpdmVzIChjYXAgYXQgMylcbiAgICAgICAgICAgIHBsYXllci5saXZlcyA9IE1hdGgubWluKChwbGF5ZXIubGl2ZXMgfHwgMCkgKyAxLCAzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVyU3lzdGVtcygpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlTWFwQ2VsbCA9ICh4LCB5LCBuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm1hcERhdGFbeV0pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5tYXBEYXRhW3ldW3hdID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCk7XG4gICAgICAgICAgICBpZiAoIXRpbGUpIHJldHVybjtcblxuICAgICAgICAgICAgdGlsZS5jbGFzc05hbWUgPSAndGlsZSB0aWxlLWZsb29yJztcbiAgICAgICAgICAgIHRpbGUuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybChcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIiknO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGRlc3Ryb3lCb3hDYWxsYmFjayA9ICh4LCB5KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGFpbWVkUG93ZXJVcHMuaGFzKGAke3h9LCR7eX1gKSkgcmV0dXJuO1xuICAgICAgICAgICAgc3Bhd25Qb3dlclVwKHRoaXMud29ybGQsIHgsIHksIHRoaXMuY29udGFpbmVyLCBUSUxFX1NJWkUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUGxheWVySHVydCA9IChlbnRpdHksIGlkLCByZW1haW5pbmdMaXZlcykgPT4ge1xuICAgICAgICAgICAgLy8gQ1JJVElDQUw6IE9ubHkgc2VuZCBwbGF5ZXJfZGllZCBpZiBUSElTIElTIFRIRSBMT0NBTCBQTEFZRVIuXG4gICAgICAgICAgICAvLyBUaGUgRUNTIGRhbWFnZVN5c3RlbSBydW5zIG9uIEFMTCBjbGllbnRzLCBzbyBldmVyeSBjbGllbnQgZGV0ZWN0c1xuICAgICAgICAgICAgLy8gZXZlcnkgY29sbGlzaW9uLiBXZSBtdXN0IGd1YXJkIHRoZSBXZWJTb2NrZXQgbWVzc2FnZSB0byBwcmV2ZW50XG4gICAgICAgICAgICAvLyBpbmNvcnJlY3QgZGVhdGggcmVwb3J0cy5cbiAgICAgICAgICAgIGlmIChyZW1haW5pbmdMaXZlcyA8PSAwICYmIGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSAmJiB0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGxheWVyX2RpZWQnXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBIVUQgb25seSBmb3IgdGhlIGxvY2FsIHBsYXllci5cbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICBzZXRMaXZlcyhyZW1haW5pbmdMaXZlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25Qb3dlclVwUGlja2VkID0gKGlkLCB0eXBlLCB4LCB5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7eH0sJHt5fWApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICAvLyBVcGRhdGUgSFVEIGZvciBsb2NhbCBwbGF5ZXIgd2hlbiB0aGV5IHBpY2sgdXAgQU5ZIHBvd2VyLXVwIChpbmNsdWRpbmcgSEVBUlQpXG4gICAgICAgICAgICBpZiAocGxheWVyICYmIHBsYXllci5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBOb3RpZnkgc2VydmVyIGZvciBzeW5jIGFjcm9zcyBhbGwgY2xpZW50c1xuICAgICAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUgPT09ICdIRUFSVCcgPyAnSVRFTV9QSUNLVVAnIDogJ1BPV0VSVVBfUElDS0VEJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogdHlwZSA9PT0gJ0hFQVJUJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyB7IHBsYXllcklkOiBpZCwgbmV3TGl2ZXM6IHBsYXllcj8ubGl2ZXMsIHgsIHkgfVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7IGlkLCB0eXBlLCB4LCB5IH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5icm9hZGNhc3RNb3ZlbWVudCA9IChlbnRpdHksIHgsIHksIGdyaWRYLCBncmlkWSwgZGlyZWN0aW9uLCBpc01vdmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAoIXBsYXllciB8fCAhdGhpcy5zb2NrZXQgfHwgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ01PVkVfU1RBVEUnLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBsYXllci5pZCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGlzTW92aW5nLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IG1vdmVtZW50U3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBib21iU3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGRhbWFnZVN5c3RlbSh0aGlzLndvcmxkLCBub3csIG9uUGxheWVySHVydCwgdGhpcy5sb2NhbFBsYXllckVudGl0eSwgVElMRV9TSVpFLCB0aGlzLnNvY2tldCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcG93ZXJVcFN5c3RlbSh3LCBvblBvd2VyVXBQaWNrZWQpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHJlbmRlclN5c3RlbSh3LCBkdCwgbm93LCBBTklNQVRJT05fUk9XUykpO1xuICAgIH1cblxuICAgIGdhbWVMb29wKG5vdykge1xuICAgICAgICBpZiAoIXRoaXMucnVubmluZykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGR0ID0gbm93IC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IG5vdztcbiAgICAgICAgdGhpcy53b3JsZC51cGRhdGUoZHQsIG5vdyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobmV4dE5vdykgPT4gdGhpcy5nYW1lTG9vcChuZXh0Tm93KSk7XG4gICAgfVxuXG4gICAgaGFuZGxlR2FtZU92ZXIod2lubmVyTmFtZSkge1xuICAgICAgICBpZiAodGhpcy5nYW1lRW5kZWQpIHJldHVybjsgLy8gUHJldmVudCBtdWx0aXBsZSB0cmlnZ2Vyc1xuICAgICAgICB0aGlzLmdhbWVFbmRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuXG4gICAgICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9ICdtZW51LXBhZ2UnO1xuICAgICAgICByZW5kZXIoPFdpbk1lbnUgd2lubmVyTmFtZT17d2lubmVyTmFtZX0gLz4sIHJvb3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBnYW1lIGVuZCBjb25kaXRpb25zIHdpdGggcHJvcGVyIHN0YXRlIGZsYWcgbWFuYWdlbWVudC5cbiAgICAgKiBQcmV2ZW50cyB0aGUgXCJMb29wIFRyYXBcIiAtIG1vZGFsIGlzIG9ubHkgcmVuZGVyZWQgT05DRSB3aGVuIGxpdmVzIHJlYWNoIDAuXG4gICAgICogQWxzbyBkaXNhYmxlcyBpbnB1dCBpbW1lZGlhdGVseSB3aGVuIHBsYXllciBkaWVzLlxuICAgICAqL1xuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUh1ZFN0YXRzKGVudGl0eSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgICAgIHNldExpdmVzKHBsYXllci5saXZlcyA/PyAzKTtcbiAgICAgICAgc2V0UmFuZ2UocGxheWVyLmJvbWJSYW5nZSB8fCA0KTtcbiAgICAgICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYm9tYlN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3QgYm9tYnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgYm9tYkVudGl0eSBvZiBib21icykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IGJvbWIgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgXG4gICAgICAgIGJvbWIudGltZXIgLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoYm9tYi50aW1lciA8PSAwICYmICFib21iLmV4cGxvZGVkKSB7XG4gICAgICAgICAgICBib21iLmV4cGxvZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgYWZmZWN0ZWRDZWxscyA9IGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBib21iLnJhbmdlLCBtYXBEYXRhKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWZmZWN0ZWRDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGV4cERpdi5jbGFzc05hbWUgPSAnZXhwbG9zaW9uJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Y2VsbC54ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS50b3AgPSBgJHtjZWxsLnkgKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnpJbmRleCA9ICc3JztcblxuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicsIHsgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYOiBjZWxsLngsIFxuICAgICAgICAgICAgICAgICAgICBncmlkWTogY2VsbC55LCBcbiAgICAgICAgICAgICAgICAgICAgeDogY2VsbC54ICogdGlsZVNpemUsIFxuICAgICAgICAgICAgICAgICAgICB5OiBjZWxsLnkgKiB0aWxlU2l6ZSBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJywgeyBkdXJhdGlvbjogNTAwLCBlbDogZXhwRGl2IH0pO1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChleHBEaXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhW2NlbGwueV0gJiYgbWFwRGF0YVtjZWxsLnldW2NlbGwueF0gPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTWFwQ2VsbChjZWxsLngsIGNlbGwueSwgMik7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzdHJveUJveENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95Qm94Q2FsbGJhY2soY2VsbC54LCBjZWxsLnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChib21iLmVsICYmIGJvbWIuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChib21iLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoYm9tYkVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgIGNvbnN0IGV4cCA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nKTtcbiAgICAgICAgZXhwLmR1cmF0aW9uIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGV4cC5kdXJhdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICBpZiAoZXhwLmVsICYmIGV4cC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZXhwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXhwLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoZXhwRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMoYngsIGJ5LCByYW5nZSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGxzID0gW3sgeDogYngsIHk6IGJ5IH1dO1xuICAgIGNvbnN0IGRpcmVjdGlvbnMgPSBbXG4gICAgICAgIHsgeDogMCwgeTogLTEgfSxcbiAgICAgICAgeyB4OiAwLCB5OiAxIH0sXG4gICAgICAgIHsgeDogLTEsIHk6IDAgfSxcbiAgICAgICAgeyB4OiAxLCB5OiAwIH1cbiAgICBdO1xuICAgIFxuICAgIGNvbnN0IHN0ZXBzID0gcmFuZ2UgLSAxOyBcbiAgICBcbiAgICBkaXJlY3Rpb25zLmZvckVhY2goZGlyID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdHggPSBieCArIChkaXIueCAqIGkpO1xuICAgICAgICAgICAgY29uc3QgdHkgPSBieSArIChkaXIueSAqIGkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW1hcERhdGFbdHldIHx8IG1hcERhdGFbdHldW3R4XSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY2VsbFR5cGUgPSBtYXBEYXRhW3R5XVt0eF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjZWxscy5wdXNoKHsgeDogdHgsIHk6IHR5IH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBjZWxscztcbn1cbiIsIi8qKlxuICogU3Bhd25zIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBzcGVjaWZpZWQgZ3JpZCBjb29yZGluYXRlcy5cbiAqIFRoaXMgY3JlYXRlcyBhIHByb3BlciBFQ1MgZW50aXR5IHdpdGggUG9zaXRpb24sIFBvd2VyVXAsIGFuZCBSZW5kZXJhYmxlIGNvbXBvbmVudHMuXG4gKiBcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBncmlkWCAtIEdyaWQgWCBjb29yZGluYXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZ3JpZFkgLSBHcmlkIFkgY29vcmRpbmF0ZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwYXduSGVhcnRQb3dlclVwKHdvcmxkLCBncmlkWCwgZ3JpZFksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIC8vIENyZWF0ZSBhIG5ldyBlbnRpdHkgZm9yIHRoZSBoZWFydCBwb3dlci11cFxuICAgIGNvbnN0IGhlYXJ0RW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgXG4gICAgLy8gQWRkIFBvc2l0aW9uIGNvbXBvbmVudFxuICAgIHdvcmxkLmFkZENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvc2l0aW9uJywge1xuICAgICAgICBncmlkWDogZ3JpZFgsXG4gICAgICAgIGdyaWRZOiBncmlkWSxcbiAgICAgICAgeDogZ3JpZFggKiB0aWxlU2l6ZSxcbiAgICAgICAgeTogZ3JpZFkgKiB0aWxlU2l6ZVxuICAgIH0pO1xuICAgIFxuICAgIC8vIEFkZCBQb3dlclVwIGNvbXBvbmVudCB3aXRoIHR5cGUgJ0hFQVJUJ1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvd2VyVXAnLCB7XG4gICAgICAgIHR5cGU6ICdIRUFSVCcsXG4gICAgICAgIHBpY2tlZFVwOiBmYWxzZSxcbiAgICAgICAgZWw6IG51bGwgIC8vIFdpbGwgYmUgc2V0IGFmdGVyIGNyZWF0aW5nIHRoZSBET00gZWxlbWVudFxuICAgIH0pO1xuICAgIFxuICAgIC8vIENyZWF0ZSB0aGUgRE9NIGVsZW1lbnQgZm9yIHJlbmRlcmluZ1xuICAgIGNvbnN0IGhlYXJ0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhcnREaXYuY2xhc3NOYW1lID0gJ3Bvd2VydXAgcG93ZXJ1cC1oZWFydCc7XG4gICAgaGVhcnREaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICBoZWFydERpdi5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcbiAgICBoZWFydERpdi5zdHlsZS5mb250U2l6ZSA9ICczMnB4JztcbiAgICBoZWFydERpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgaGVhcnREaXYudGV4dENvbnRlbnQgPSAn4p2k77iPJztcbiAgICBcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaGVhcnREaXYpO1xuICAgIFxuICAgIC8vIFVwZGF0ZSB0aGUgUG93ZXJVcCBjb21wb25lbnQgd2l0aCB0aGUgRE9NIGVsZW1lbnQgcmVmZXJlbmNlXG4gICAgY29uc3QgcG93ZXJVcCA9IHdvcmxkLmdldENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICBpZiAocG93ZXJVcCkge1xuICAgICAgICBwb3dlclVwLmVsID0gaGVhcnREaXY7XG4gICAgfVxuICAgIFxuICAgIGNvbnNvbGUubG9nKGBbSGVhcnQgRHJvcF0gU3Bhd25lZCBIRUFSVCBwb3dlci11cCBhdCAoJHtncmlkWH0sICR7Z3JpZFl9KWApO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgcGxheWVyIGRlYXRoIHRyYW5zaXRpb24gd2hlbiBsaXZlcyByZWFjaCAwLlxuICogUmVtb3ZlcyB0aGUgcGxheWVyJ3MgRE9NIGVsZW1lbnQgYW5kIHNwYXducyBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgZGVhdGggbG9jYXRpb24uXG4gKlxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckVudGl0eSAtIFRoZSBlbnRpdHkgSUQgb2YgdGhlIGR5aW5nIHBsYXllclxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgY29udGFpbmVyID0gbnVsbCkge1xuICAgIC8vIEdldCB0aGUgcGxheWVyJ3MgY29tcG9uZW50c1xuICAgIGNvbnN0IHBvc2l0aW9uID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgaWYgKCFwb3NpdGlvbiB8fCAhcmVuZGVyYWJsZSB8fCAhcGxheWVyKSByZXR1cm47XG5cbiAgICAvLyBTdG9yZSB0aGUgZ3JpZCBjb29yZGluYXRlcyB3aGVyZSB0aGUgcGxheWVyIGRpZWRcbiAgICBjb25zdCBkZWF0aEdyaWRYID0gTWF0aC5mbG9vcigocG9zaXRpb24ueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgY29uc3QgZGVhdGhHcmlkWSA9IE1hdGguZmxvb3IoKHBvc2l0aW9uLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuXG4gICAgLy8gQ1JJVElDQUw6IFJlbW92ZSB0aGUgcGxheWVyJ3MgRE9NIGVsZW1lbnQgZnJvbSB0aGUgZG9jdW1lbnQgQkVGT1JFIHJlbW92aW5nIHRoZSBSZW5kZXJhYmxlIGNvbXBvbmVudC5cbiAgICAvLyBUaGlzIGVuc3VyZXMgdGhlIGRlYWQgcGxheWVyIHZpc3VhbGx5IGRpc2FwcGVhcnMgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHJlbmRlcmFibGUuZWwgJiYgcmVuZGVyYWJsZS5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChyZW5kZXJhYmxlLmVsKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgY29tcG9uZW50cyB0aGF0IGVuYWJsZSBpbnRlcmFjdGlvbiBhbmQgcmVuZGVyaW5nLlxuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgd29ybGQucmVtb3ZlQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgd29ybGQucmVtb3ZlQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ0lucHV0Jyk7XG4gICAgLy8gV2Uga2VlcCBQb3NpdGlvbiBhbmQgUGxheWVyIGNvbXBvbmVudHMgdG8ga25vdyB3aGVyZSB0aGV5IHdlcmUuXG5cbiAgICAvLyBTcGF3biBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgZGVhdGggbG9jYXRpb24gKHByb3BlciBFQ1MgZW50aXR5KVxuICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBjb250YWluZXIgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgc3Bhd25IZWFydFBvd2VyVXAod29ybGQsIGRlYXRoR3JpZFgsIGRlYXRoR3JpZFksIGdhbWVDb250YWluZXIsIHRpbGVTaXplKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgW1BsYXllciBEZWF0aF0gUGxheWVyICR7cGxheWVyLmlkfSBkaWVkIGF0ICgke2RlYXRoR3JpZFh9LCAke2RlYXRoR3JpZFl9KS4gSGVhcnQgcG93ZXItdXAgZHJvcHBlZC5gKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhbWFnZVN5c3RlbSh3b3JsZCwgbm93LCBvblBsYXllckh1cnQsIGxvY2FsUGxheWVyRW50aXR5LCB0aWxlU2l6ZSA9IDY0LCBzb2NrZXQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1BsYXllcicpO1xuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChwbGF5ZXIuaW52aW5jaWJsZVVudGlsICYmIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPiBub3cpIGNvbnRpbnVlO1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICAgICAgY29uc3QgZVBvcyA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHcmlkLWJhc2VkIGNvbGxpc2lvblxuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFggPSBNYXRoLmZsb29yKChwUG9zLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFkgPSBNYXRoLmZsb29yKChwUG9zLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuXG4gICAgICAgICAgICBpZiAocGxheWVyR3JpZFggPT09IGVQb3MuZ3JpZFggJiYgcGxheWVyR3JpZFkgPT09IGVQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c0xpdmVzID0gcGxheWVyLmxpdmVzID8/IDM7XG4gICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5tYXgocHJldmlvdXNMaXZlcyAtIDEsIDApO1xuICAgICAgICAgICAgICAgIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPSBub3cgKyAxNTAwO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgaXMgZGVhZCwgcmVwb3J0IGRlYXRoIE9OQ0UgdXNpbmcgZ3VhcmQgY2xhdXNlXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5saXZlcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuYWxyZWFkeVJlcG9ydGVkRGVhZCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5hbHJlYWR5UmVwb3J0ZWREZWFkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAob25QbGF5ZXJIdXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblBsYXllckh1cnQocGxheWVyRW50aXR5LCBwbGF5ZXIuaWQsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBQbGF5ZXIgc3RpbGwgYWxpdmUsIHJlcG9ydCBub3JtYWwgZGFtYWdlXG4gICAgICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUGxheWVySHVydChwbGF5ZXJFbnRpdHksIHBsYXllci5pZCwgcGxheWVyLmxpdmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBCcmVhayB0aGUgbG9vcCBzaW5jZSB0aGUgcGxheWVyIGhhcyBhbHJlYWR5IHRha2VuIGRhbWFnZSBmcm9tIHRoaXMgZXhwbG9zaW9uLlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImV4cG9ydCBmdW5jdGlvbiBtb3ZlbWVudFN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdGlsZVNpemUgPSA0MCkge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5Jyk7XG4gICAgY29uc3QgZGVsdGEgPSBkdCAvIDE2LjY3O1xuXG4gICAgY29uc3QgUExBWUVSX1NJWkUgPSB0aWxlU2l6ZTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgY29uc3QgYmVoYXZpb3IgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQmVoYXZpb3InKTtcblxuICAgICAgICBpZiAoYmVoYXZpb3IpIHtcbiAgICAgICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQgKyAoYmVoYXZpb3IuZmFzdFNob2VzTGV2ZWwgLSAxKSAqIDAuNTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUlucHV0ID0gaW5wdXQuaW5wdXRRdWV1ZVswXTtcbiAgICAgICAgbGV0IGR4ID0gMDtcbiAgICAgICAgbGV0IGR5ID0gMDtcblxuICAgICAgICBpZiAoYWN0aXZlSW5wdXQgPT09ICd1cCcpIHtcbiAgICAgICAgICAgIGR5ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3VwJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2Rvd24nKSB7XG4gICAgICAgICAgICBkeSA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2Rvd24nO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIGR4ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICBkeCA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3JpZ2h0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhc0lucHV0ID0gZHggIT09IDAgfHwgZHkgIT09IDA7XG5cbiAgICAgICAgaWYgKCFoYXNJbnB1dCkge1xuICAgICAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG4gICAgICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ0lETEUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WSA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBjb25zdCBzbmFwVGhyZXNob2xkID0gMzI7XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmIGR4ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKHBvcy54LCBuZXh0WSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWCA9IE1hdGguZmxvb3IoKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRYID0gY3VycmVudFRpbGVYICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlggPSBwb3MueCAtIHRhcmdldFg7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlgpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gLU1hdGguc2lnbihkaWZmWCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmIGR5ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKG5leHRYLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWSA9IE1hdGguZmxvb3IoKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRZID0gY3VycmVudFRpbGVZICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlkgPSBwb3MueSAtIHRhcmdldFk7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlkpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gLU1hdGguc2lnbihkaWZmWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFhBZnRlclNuYXAgPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZQWZ0ZXJTbmFwID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiAhaXNCbG9ja2VkKG5leHRYQWZ0ZXJTbmFwLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnggPSBuZXh0WEFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiAhaXNCbG9ja2VkKHBvcy54LCBuZXh0WUFmdGVyU25hcCwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnkgPSBuZXh0WUFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlbC5pc01vdmluZyA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ1JVTic7XG4gICAgICAgIH1cblxuICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG5cbiAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpIHtcbiAgICBjb25zdCBzdGVwID0gdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICBpZiAocG9zLnggPCBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWluKHBvcy54ICsgc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH0gZWxzZSBpZiAocG9zLnggPiBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWF4KHBvcy54IC0gc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH1cblxuICAgIGlmIChwb3MueSA8IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5taW4ocG9zLnkgKyBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfSBlbHNlIGlmIChwb3MueSA+IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5tYXgocG9zLnkgLSBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfVxuXG4gICAgdmVsLmlzTW92aW5nID1cbiAgICAgICAgcG9zLnggIT09IHBvcy50YXJnZXRYIHx8XG4gICAgICAgIHBvcy55ICE9PSBwb3MudGFyZ2V0WTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkKHgsIHksIG1hcERhdGEsIHRpbGVTaXplLCBwbGF5ZXJTaXplID0gdGlsZVNpemUpIHtcbiAgICBjb25zdCBwYWRkaW5nID0gNDtcblxuICAgIGNvbnN0IGxlZnQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgcmlnaHQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHRvcCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCBib3R0b20gPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgYm90dG9tLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCBib3R0b20sIG1hcERhdGEpXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkQ2VsbCh4LCB5LCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbCA9IG1hcERhdGFbeV0gJiYgbWFwRGF0YVt5XVt4XTtcblxuICAgIHJldHVybiBjZWxsICE9PSAwICYmIGNlbGwgIT09IDI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcG93ZXJVcFN5c3RlbSh3b3JsZCwgb25Qb3dlclVwUGlja2VkKSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdQbGF5ZXInKTtcbiAgICBjb25zdCBwb3dlclVwcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKCFwUG9zIHx8ICF2ZWwgfHwgIXBsYXllcikgY29udGludWU7XG5cbiAgICAgICAgZm9yIChjb25zdCBwVXBFbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwVXAgPSB3b3JsZC5nZXRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCF1cFBvcyB8fCAhcFVwIHx8IHBVcC5waWNrZWRVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIC8vIEdyaWQtYmFzZWQgY29sbGlzaW9uOiBwbGF5ZXIgZ3JpZCBwb3NpdGlvbiBtYXRjaGVzIHBvd2VyLXVwIGdyaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIChwUG9zLmdyaWRYID09PSB1cFBvcy5ncmlkWCAmJiBwUG9zLmdyaWRZID09PSB1cFBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIHBVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgZGlmZmVyZW50IHBvd2VyLXVwIHR5cGVzXG4gICAgICAgICAgICAgICAgaWYgKHBVcC50eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlbC5zcGVlZCA9IE1hdGgubWluKHZlbC5zcGVlZCArIDEsIDgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vID09PT09PT09PT0gQ1JJVElDQUwgSEVBUlQgUElDS1VQIExPR0lDID09PT09PT09PT1cbiAgICAgICAgICAgICAgICAgICAgLy8gU3RlcCAxOiBHZXQgY3VycmVudCBsaXZlcyBmcm9tIFRISVMgcGxheWVyIChub3QgZnJvbSBoZWFydCBlbnRpdHkhKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50TGl2ZXMgPSBwbGF5ZXIubGl2ZXMgfHwgMDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBTdGVwIDI6IEZvcmNlZnVsbHkgaW5jcmVtZW50IGJ5IDEgKHNpbXBsZSBhZGRpdGlvbiwgbm8gb3RoZXIgbG9naWMpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xpdmVzID0gY3VycmVudExpdmVzICsgMTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gbmV3TGl2ZXM7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtIRUFSVCBQSUNLVVBdIFBsYXllciAke3BsYXllci5pZH0gZ2FpbmVkIGEgbGlmZTogJHtjdXJyZW50TGl2ZXN9IOKGkiAke25ld0xpdmVzfWApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcG93ZXItdXAncyBET00gZWxlbWVudCBmcm9tIHRoZSBzY3JlZW5cbiAgICAgICAgICAgICAgICBpZiAocFVwLmVsICYmIHBVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gTm90aWZ5IGdhbWUuanMgdmlhIGNhbGxiYWNrIChoYW5kbGVzIEhVRCB1cGRhdGUgKyBzZXJ2ZXIgc3luYylcbiAgICAgICAgICAgICAgICAvLyBDUklUSUNBTDogVGhpcyB0cmlnZ2VycyB1cGRhdGVIdWRTdGF0cywgTk9UIG9uUGxheWVySHVydFxuICAgICAgICAgICAgICAgIGlmIChvblBvd2VyVXBQaWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb25Qb3dlclVwUGlja2VkKHBsYXllci5pZCwgcFVwLnR5cGUsIHVwUG9zLmdyaWRYLCB1cFBvcy5ncmlkWSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRGVzdHJveSB0aGUgcG93ZXItdXAgZW50aXR5IGZyb20gdGhlIHdvcmxkIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShwVXBFbnRpdHkpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbSEVBUlQgREVTVFJPWUVEXSBIZWFydCBlbnRpdHkgcmVtb3ZlZCBmcm9tIHdvcmxkIGF0ICgke3VwUG9zLmdyaWRYfSwgJHt1cFBvcy5ncmlkWX0pYCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGF3blBvd2VyVXAod29ybGQsIGd4LCBneSwgY29udGFpbmVyLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3Qgc2VlZCA9IGd4ICogNzM4NTYwOTMgXiBneSAqIDE5MzQ5NjYzO1xuICAgIGNvbnN0IHNlZWRSYW5kb20gPSAoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCkgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQpICogMTAwMDApO1xuICAgIFxuICAgIGlmIChzZWVkUmFuZG9tID4gMC4zNSkgcmV0dXJuO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbJ1NQRUVEJywgJ0JPTUJTJywgJ0ZMQU1FJ107XG4gICAgY29uc3QgdHlwZUluZGV4ID0gTWF0aC5mbG9vcigoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDAgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwKSkgKiB0eXBlcy5sZW5ndGgpO1xuICAgIGNvbnN0IHJhbmRvbVR5cGUgPSB0eXBlc1t0eXBlSW5kZXhdO1xuXG4gICAgY29uc3QgcFVwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWDogZ3gsIGdyaWRZOiBneSwgeDogZ3ggKiB0aWxlU2l6ZSwgeTogZ3kgKiB0aWxlU2l6ZSB9KTtcbiAgICBcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gYHBvd2VydXAgcG93ZXJ1cC0ke3JhbmRvbVR5cGUudG9Mb3dlckNhc2UoKX1gO1xuICAgIGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSBgJHtneCAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUudG9wID0gYCR7Z3kgKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJywgeyB0eXBlOiByYW5kb21UeXBlLCBlbDogZGl2IH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclN5c3RlbSh3b3JsZCwgZHQsIG5vdywgYW5pbVJvd3MpIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdSZW5kZXJhYmxlJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuXG4gICAgICAgIGlmICghcmVuZGVyYWJsZS5lbCkgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSByZW5kZXJhYmxlLnN0YXRlO1xuICAgICAgICBjb25zdCB0YXJnZXRSb3cgPSBhbmltUm93c1tzdGF0ZV1bdmVsLmRpcmVjdGlvbl07XG4gICAgICAgIFxuICAgICAgICAvLyBSZXNldCBhbmltYXRpb24gd2hlbiByb3cgb3Igc3RhdGUgY2hhbmdlc1xuICAgICAgICBpZiAocmVuZGVyYWJsZS5yb3cgIT09IHRhcmdldFJvdyB8fCByZW5kZXJhYmxlLmxhc3RTdGF0ZSAhPT0gc3RhdGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUucm93ID0gdGFyZ2V0Um93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0U3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZyYW1lQ291bnQgPSBzdGF0ZSA9PT0gJ1JVTicgPyByZW5kZXJhYmxlLnJ1bkZyYW1lcyA6IHJlbmRlcmFibGUuaWRsZUZyYW1lcztcbiAgICAgICAgY29uc3QgZnJhbWVEZWxheSA9IHN0YXRlID09PSAnUlVOJyA/IDEwMDAgLyByZW5kZXJhYmxlLmZwcyA6IDEwMDAgLyByZW5kZXJhYmxlLmlkbGVGcHM7XG5cbiAgICAgICAgaWYgKG5vdyAtIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA+IGZyYW1lRGVsYXkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICsgMSkgJSBmcmFtZUNvdW50O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zWCA9IC0ocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKiByZW5kZXJhYmxlLmZyYW1lV2lkdGgpO1xuICAgICAgICBjb25zdCBwb3NZID0gLShyZW5kZXJhYmxlLnJvdyAqIHJlbmRlcmFibGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBgJHtwb3NYfXB4ICR7cG9zWX1weGA7XG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7cG9zLnh9cHgsICR7cG9zLnl9cHgsIDApYDtcbiAgICB9XG59XG4iLCIvLyAvc3JjL2Vjcy93b3JsZC5qc1xuXG5leHBvcnQgY2xhc3MgV29ybGQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm5leHRFbnRpdHlJZCA9IDA7XG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IG5ldyBNYXAoKTsgXG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuICAgIH1cblxuICAgIGNyZWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5uZXh0RW50aXR5SWQrKztcbiAgICAgICAgdGhpcy5lbnRpdGllcy5hZGQoZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG5cbiAgICBkZXN0cm95RW50aXR5KGVudGl0eSkge1xuICAgICAgICB0aGlzLmVudGl0aWVzLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICBmb3IgKGNvbnN0IFtjb21wb25lbnROYW1lLCBjb21wb25lbnRNYXBdIG9mIHRoaXMuY29tcG9uZW50cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERhdGEgPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zZXQoY29tcG9uZW50TmFtZSwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpLnNldChlbnRpdHksIGNvbXBvbmVudERhdGEpO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE1hcCA/IGNvbXBvbmVudE1hcC5nZXQoZW50aXR5KSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZW1vdmVDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIGlmIChjb21wb25lbnRNYXApIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHF1ZXJ5KC4uLmNvbXBvbmVudE5hbWVzKSB7XG4gICAgICAgIGlmIChjb21wb25lbnROYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpcnN0TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1swXSk7XG4gICAgICAgIGlmICghZmlyc3RNYXApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZmlyc3RNYXAua2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgaGFzQWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY29tcG9uZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcCB8fCAhbWFwLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0FsbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzQWxsICYmIHRoaXMuZW50aXRpZXMuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRTeXN0ZW0oc3lzdGVtRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zeXN0ZW1zLnB1c2goc3lzdGVtRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHVwZGF0ZShkdCwgbm93KSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3lzdGVtIG9mIHRoaXMuc3lzdGVtcykge1xuICAgICAgICAgICAgc3lzdGVtKHRoaXMsIGR0LCBub3cpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdpbk1lbnUocHJvcHMpIHtcbiAgICBjb25zdCB3aW5uZXJOYW1lID0gcHJvcHMud2lubmVyTmFtZSB8fCBcIkEgUGxheWVyXCI7XG5cbiAgICBjb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbiAgICByZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgLy8gVGhpcyBoYXJkIHJlbG9hZCBpcyBhIHJlbGlhYmxlIHdheSB0byByZXNldCB0aGUgZ2FtZSBzdGF0ZSBhbmQgcmV0dXJuIHRvIHRoZSBzdGFydC5cbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVudS1ib3hcIj5cbiAgICAgICAgICAgIDxoMT57d2lubmVyTmFtZS50b1VwcGVyQ2FzZSgpfSBXT04hPC9oMT5cbiAgICAgICAgICAgIDxwPlRoZSBsYXN0IHBsYXllciBzdGFuZGluZyB0YWtlcyB0aGUgY3Jvd24uPC9wPlxuICAgICAgICAgICAge3JlcGxheUJ0bn1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEdSSURfQk9SREVSX1NJWkUgPSA2O1xuY29uc3QgR0FNRV9DSFJPTUVfV0lEVEggPSA3MjtcbmNvbnN0IEdBTUVfQ0hST01FX0hFSUdIVCA9IDE1MDtcblxuY29uc3QgaW1hZ2VzID0ge1xuICAgIDI6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiLFxuICAgIDM6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX3dhbGwucG5nXCIsXG4gICAgNDogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZXhwbG9pdC5wbmdcIixcbn07XG5cbmNvbnN0IFtwbGF5ZXJOYW1lLCBzZXRQbGF5ZXJOYW1lXSA9IGNyZWF0ZVNpZ25hbChcIlBsYXllciAxXCIpO1xuY29uc3QgW2xpdmVzLCBzZXRMaXZlc10gPSBjcmVhdGVTaWduYWwoMyk7XG5jb25zdCBbc3BlZWQsIHNldFNwZWVkXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtib21icywgc2V0Qm9tYnNdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW3JhbmdlLCBzZXRSYW5nZV0gPSBjcmVhdGVTaWduYWwoMSk7XG5leHBvcnQgeyBzZXRQbGF5ZXJOYW1lLCBzZXRMaXZlcywgc2V0U3BlZWQsIHNldEJvbWJzLCBzZXRSYW5nZSB9O1xuXG5jb25zdCBuYW1lRWwgPSA8c3BhbiBjbGFzcz1cInBsYXllci1uYW1lXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbmFtZUVsLnRleHRDb250ZW50ID0gcGxheWVyTmFtZSgpOyB9KTtcblxuY29uc3QgbGl2ZXNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgbGl2ZXMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3Qgc3BlZWRFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgc3BlZWQtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgYm9tYnNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgYm9tYnMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgcmFuZ2VFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgcmFuZ2UtdmFsdWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBsaXZlc0VsLnRleHRDb250ZW50ID0gbGl2ZXMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBzcGVlZEVsLnRleHRDb250ZW50ID0gc3BlZWQoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBib21ic0VsLnRleHRDb250ZW50ID0gYm9tYnMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyByYW5nZUVsLnRleHRDb250ZW50ID0gcmFuZ2UoKTsgfSk7XG5cbmZ1bmN0aW9uIEdhbWUoeyBncmlkIH0pIHtcbiAgICBjb25zdCBib2FyZFdpZHRoID0gZ3JpZFswXS5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRIZWlnaHQgPSBncmlkLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZE91dGVyV2lkdGggPSBib2FyZFdpZHRoICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3QgYm9hcmRPdXRlckhlaWdodCA9IGJvYXJkSGVpZ2h0ICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBib2FyZFdpZHRoIDogd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRIZWlnaHQgOiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY29uc3Qgc2NhbGUgPSBNYXRoLm1pbihcbiAgICAgICAgMSxcbiAgICAgICAgTWF0aC5tYXgoMC4yLCAodmlld3BvcnRXaWR0aCAtIEdBTUVfQ0hST01FX1dJRFRIKSAvIGJvYXJkT3V0ZXJXaWR0aCksXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0SGVpZ2h0IC0gR0FNRV9DSFJPTUVfSEVJR0hUKSAvIGJvYXJkT3V0ZXJIZWlnaHQpXG4gICAgKTtcbiAgICBjb25zdCByb3dzID0gW107XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IGdyaWQubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCBncmlkW3Jvd0luZGV4XS5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBncmlkW3Jvd0luZGV4XVtjb2xJbmRleF07XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gXCJ0aWxlXCI7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBgd2lkdGg6JHtUSUxFX1NJWkV9cHg7aGVpZ2h0OiR7VElMRV9TSVpFfXB4O2A7XG5cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAyIHx8IGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS1mbG9vclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS13YWxsXCI7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzNdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbNF19KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMCB8fCBjZWxsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzJdfSlgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxscy5wdXNoKDxkaXYgY2xhc3M9e2NsYXNzTmFtZX0gZGF0YS14PXtjb2xJbmRleH0gZGF0YS15PXtyb3dJbmRleH0gc3R5bGU9e3N0eWxlfT48L2Rpdj4pO1xuICAgICAgICB9XG4gICAgICAgIHJvd3MucHVzaCg8ZGl2IGNsYXNzPVwiZ3JpZC1yb3dcIj57Y2VsbHN9PC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWdsYXNzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWJhclwiPlxuICAgICAgICAgICAgICAgICAgICB7bmFtZUVsfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+TGl2ZXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpdmVzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+U3BlZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwZWVkRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+Qm9tYnM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvbWJzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+UmFuZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JhbmdlRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtYm9hcmQtZnJhbWVcIiBzdHlsZT17YHdpZHRoOiR7Ym9hcmRPdXRlcldpZHRoICogc2NhbGV9cHg7aGVpZ2h0OiR7Ym9hcmRPdXRlckhlaWdodCAqIHNjYWxlfXB4O2B9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBpZD1cImdhbWUtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZ2FtZS1ncmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtgcG9zaXRpb246cmVsYXRpdmU7d2lkdGg6JHtib2FyZFdpZHRofXB4O2hlaWdodDoke2JvYXJkSGVpZ2h0fXB4O3RyYW5zZm9ybTpzY2FsZSgke3NjYWxlfSk7YH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IENoYXRQbGF5ZXJzIGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxubGV0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSBjcmVhdGVTaWduYWwoe30pO1xuZXhwb3J0IHsgc2V0U3RhdGVzIH07XG5cbmxldCByb29tSWRFbCA9IDxwPlJvb20gSUQ6IDwvcD47XG5sZXQgcGxheWVyc0VsID0gPHA+UGxheWVyczogIC8gNDwvcD47XG5sZXQgdGV4dEVsID0gPHA+PC9wPjtcbmxldCB0aW1lckVsID0gPHA+VGltZXI6IDwvcD47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcyA9IHN0YXRlcygpO1xuICAgIHJvb21JZEVsLnRleHRDb250ZW50ID0gYFJvb20gSUQ6ICR7cy5yb29tSWR9YDtcbiAgICBwbGF5ZXJzRWwudGV4dENvbnRlbnQgPSBgUGxheWVyczogJHtzLnBsYXllcnNDb3VudH0gLyA0YDtcbiAgICB0ZXh0RWwudGV4dENvbnRlbnQgPSBzLnRleHQgfHwgXCJcIjtcblxuICAgIGlmIChzLmdhbWVTdGFydGVkKSB7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBcIlRpbWVyOiBHYW1lIHN0YXJ0ZWRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0aW1lclRleHQgPSAoIXMuc2Vjb25kc0xlZnQpID8gXCJXYWl0aW5nIGZvciBvbmUgbW9yZSBwbGF5ZXJcIiA6IGAke3Muc2Vjb25kc0xlZnR9IHNlY29uZHNgO1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gYFRpbWVyOiAke3RpbWVyVGV4dH1gO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBMb2JieSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29uYXRpbmVyLWxvYmJ5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9iYnktYm94XCI+XG4gICAgICAgICAgICAgICAgPGgxPkxvYmJ5PC9oMT5cbiAgICAgICAgICAgICAgICB7cm9vbUlkRWx9XG4gICAgICAgICAgICAgICAge3BsYXllcnNFbH1cbiAgICAgICAgICAgICAgICB7dGV4dEVsfVxuICAgICAgICAgICAgICAgIHt0aW1lckVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q2hhdFBsYXllcnMgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2JieTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5jb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbnJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbmxldCBtZW51RWwgPSAoXG4gICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgIDxoMT5Zb3UgV2luITwvaDE+XG4gICAgICAgIDxwPkFsbCBvdGhlciBwbGF5ZXJzIGhhdmUgbGVmdCB0aGUgZ2FtZS48L3A+XG4gICAgICAgIHtyZXBsYXlCdG59XG4gICAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZW51KCkge1xuICAgIHJldHVybiBtZW51RWw7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHN1Ym1pdHRlZCA9IGZhbHNlO1xuXG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoc3VibWl0dGVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgbmlja25hbWUgPSBmb3JtRGF0YS5nZXQoXCJuaWNrbmFtZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFuaWNrbmFtZSB8fCBuaWNrbmFtZS5sZW5ndGggPiAyMCkgcmV0dXJuO1xuXG4gICAgICAgIHN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHNldFBsYXllck5hbWUobmlja25hbWUpO1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwibmlja25hbWVfb2ZfdGhlX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmlja25hbWUtaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW50ZXIgeW91ciBuYW1lXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmVnaXN0ZXItYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPnN0YXJ0IHBsYXlpbmc8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XG4iLCJjbGFzcyBTb3VuZCB7XG4gICAgY29uc3RydWN0b3Ioc3JjKSB7XG4gICAgICAgIHRoaXMubXVzaWMgPSBuZXcgQXVkaW8oc3JjKTtcbiAgICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcblxuICAgICAgICB0aGlzLm11c2ljLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNDtcblxuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc05hbWUgPSBcInNvdW5kLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5hcHBlbmQodGhpcy5pY29uKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGUoKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5idXR0b24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wbGF5KCksIHsgb25jZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLm11c2ljLnBsYXkoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11c2ljLnBhdXNlZCB8fCB0aGlzLm11c2ljLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb25cIik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQnV0dG9uKCkge1xuICAgICAgICBjb25zdCBpc011dGVkID0gdGhpcy5tdXNpYy5tdXRlZCB8fCB0aGlzLm11c2ljLnBhdXNlZDtcblxuICAgICAgICB0aGlzLmljb24uY2xhc3NOYW1lID0gaXNNdXRlZCA/IFwiZmEtc29saWQgZmEtdm9sdW1lLW9mZlwiIDogXCJmYS1zb2xpZCBmYS12b2x1bWUtaGlnaFwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtbXV0ZWRcIiwgaXNNdXRlZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VuZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAvYXBwLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwicHJvcHMiLCJjaGlsZHJlbiIsImVsZSIsImRvY3VtZW50Iiwia2V5Iiwic3RhcnRzV2l0aCIsImV2ZW50TmFtZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwiZmxhdENoaWxkcmVuIiwiZmxhdCIsIkluZmluaXR5IiwiYXBwZW5kIiwiZmlsdGVyIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJyZW5kZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwicmVwbGFjZUNoaWxkcmVuIiwiUm91dGVyIiwicm91dGVyIiwiZWZmZWN0U3RhY2siLCJhY3RpdmVFZmZlY3QiLCJjcmVhdGVTaWduYWwiLCJpbml0aWFsVmFsdWUiLCJ2YWx1ZSIsImVmZmVjdHMiLCJTZXQiLCJSZWFkIiwiYWRkIiwiV3JpdGUiLCJuZXdWYWx1ZSIsImZuIiwiZm9yRWFjaCIsImVmZmVjdCIsImNyZWF0ZUVmZmVjdCIsInB1c2giLCJwb3AiLCJsZW5ndGgiLCJSb3V0ZXMiLCJPYmplY3QiLCJjcmVhdGUiLCJGaXJzdFJlc29sdmUiLCJvbiIsInBhdGgiLCJoYW5kbGVyIiwibmF2aWdhdGUiLCJoaXN0b3J5IiwibmF2aWdhdGlvbiIsInJlc29sdmUiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwidXJsIiwiVVJMIiwiaHJlZiIsImxpc3RlbiIsIm9uRXJyb3I0MDQiLCJldmVudCIsImRlc3RpbmF0aW9uIiwiaW50ZXJjZXB0IiwiY29uc29sZSIsImxvZyIsIlJlZ2lzdGVyIiwiR2FtZSIsIk1lbnUiLCJMb2JieSIsIldpbk1lbnUiLCJzZXRTdGF0ZXMiLCJzZXRQbGF5ZXJOYW1lIiwic2V0SHVkUGxheWVyTmFtZSIsIlNvdW5kIiwic2V0TWVzc2FnZXMiLCJHYW1lRW5naW5lIiwicm9vdCIsImdldEVsZW1lbnRCeUlkIiwid3NzIiwiV2ViU29ja2V0Iiwid2luZG93IiwiaG9zdG5hbWUiLCJzb3VuZCIsImN1cnJlbnRHYW1lRW5naW5lIiwiaW5pdCIsImJvZHkiLCJjbGFzc05hbWUiLCJhbGVydCIsIndzIiwibWVzc2FnZSIsIkpTT04iLCJwYXJzZSIsImRhdGEiLCJxdWVyeVNlbGVjdG9yIiwicm9vbUlkIiwicGxheWVyc0NvdW50Iiwic2Vjb25kc0xlZnQiLCJ0ZXh0IiwiZ3JpZCIsInNldFRpbWVvdXQiLCJnYW1lQ29udGFpbmVyIiwiZGVzdHJveSIsImxvY2FsUGxheWVyIiwicGxheWVycyIsImZpbmQiLCJwbGF5ZXIiLCJpZCIsInlvdXJQbGF5ZXJJZCIsIm5pY2tuYW1lIiwiZW5naW5lIiwiZXJyb3IiLCJ3aW5uZXJOYW1lIiwicHJldiIsImhhbmRsZVJlbW90ZU1vdmUiLCJwYXlsb2FkIiwiaGFuZGxlUmVtb3RlQm9tYiIsImhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQiLCJoYW5kbGVSZW1vdGVJdGVtUGlja3VwIiwiZXJyIiwibWVzc2FnZXMiLCJDaGF0UGxheWVycyIsIm1lc3NhZ2VzQ29udGFpbmVyIiwiY2xhc3MiLCJtc2dzIiwiaW5uZXJIVE1MIiwibXNnIiwicCIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCIsImZpcnN0RWxlbWVudENoaWxkIiwidW5zaGlmdCIsImJyb2FkY2FzdE1lc3NhZ2UiLCJlIiwicHJldmVudERlZmF1bHQiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwidGFyZ2V0IiwiZ2V0IiwidHJpbSIsInJlc2V0Iiwic2VuZCIsInN0cmluZ2lmeSIsIm9uU3VibWl0IiwibmFtZSIsInBsYWNlaG9sZGVyIiwibWF4bGVuZ3RoIiwiUG9zaXRpb25Db21wb25lbnQiLCJneCIsImd5IiwidGlsZVNpemUiLCJncmlkWCIsImdyaWRZIiwieCIsInkiLCJ0YXJnZXRYIiwidGFyZ2V0WSIsIlZlbG9jaXR5Q29tcG9uZW50IiwiYmFzZVNwZWVkIiwic3BlZWQiLCJpc01vdmluZyIsImRpcmVjdGlvbiIsIklucHV0Q29tcG9uZW50IiwiaW5wdXRRdWV1ZSIsIlJlbmRlcmFibGVDb21wb25lbnQiLCJlbCIsImZyYW1lV2lkdGgiLCJmcmFtZUhlaWdodCIsInRvdGFsRnJhbWVzIiwiZnBzIiwiY3VycmVudEZyYW1lIiwicnVuRnJhbWVzIiwiaWRsZUZyYW1lcyIsImlkbGVGcHMiLCJsYXN0RnJhbWVUaW1lIiwicm93Iiwic3RhdGUiLCJsYXN0U3RhdGUiLCJQbGF5ZXJDb21wb25lbnQiLCJjaGFyVHlwZSIsImlzTG9jYWwiLCJCb21iQ29tcG9uZW50Iiwib3duZXJJZCIsInRpbWVyIiwicmFuZ2UiLCJleHBsb2RlZCIsIkV4cGxvc2lvbkNvbXBvbmVudCIsImR1cmF0aW9uIiwiUG93ZXJVcENvbXBvbmVudCIsInBpY2tlZFVwIiwiQmVoYXZpb3JDb21wb25lbnQiLCJnaG9zdE1vZGUiLCJ0aHJvd2FibGUiLCJkZXRvbmF0b3IiLCJmYXN0U2hvZXNMZXZlbCIsImJvbWJzIiwibWF4IiwiY3VycmVudCIsIldvcmxkIiwibW92ZW1lbnRTeXN0ZW0iLCJyZW5kZXJTeXN0ZW0iLCJib21iU3lzdGVtIiwiZGFtYWdlU3lzdGVtIiwiY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyIsInNwYXduSGVhcnRQb3dlclVwIiwicG93ZXJVcFN5c3RlbSIsInNwYXduUG93ZXJVcCIsInNldEJvbWJzIiwic2V0TGl2ZXMiLCJzZXRSYW5nZSIsInNldFNwZWVkIiwiVElMRV9TSVpFIiwiQU5JTUFUSU9OX1JPV1MiLCJSVU4iLCJ1cCIsImxlZnQiLCJkb3duIiwicmlnaHQiLCJJRExFIiwiY29uc3RydWN0b3IiLCJjYW52YXNDb250YWluZXIiLCJtYXBEYXRhIiwic29ja2V0Iiwid29ybGQiLCJsb2NhbFBsYXllckVudGl0eSIsInBsYXllckVudGl0aWVzIiwiTWFwIiwicGxheWVySW5mbyIsImxhc3RUaW1lIiwicmVtb3ZlSW5wdXRMaXN0ZW5lcnMiLCJhbmltYXRpb25GcmFtZSIsInJ1bm5pbmciLCJjbGFpbWVkUG93ZXJVcHMiLCJsb3NzTW9kYWxUcmlnZ2VyZWQiLCJpbnB1dEVuYWJsZWQiLCJnYW1lRW5kZWQiLCJsb2NhbFBsYXllcklkIiwiYWxsUGxheWVycyIsInRvdGFsUGxheWVycyIsIm5vcm1hbGl6ZWRMb2NhbFBsYXllcklkIiwiU3RyaW5nIiwicERhdGEiLCJwbGF5ZXJJZCIsInBsYXllckVudGl0eSIsImNyZWF0ZUVudGl0eSIsInNldCIsInBsYXllckRpdiIsImNvbG9yIiwic3R5bGUiLCJwb3NpdGlvbiIsInpJbmRleCIsIndpbGxDaGFuZ2UiLCJzeCIsInN5IiwiYWRkQ29tcG9uZW50IiwicGxheWVyQ29tcCIsImxpdmVzIiwibWF4Qm9tYnMiLCJib21iUmFuZ2UiLCJ1cGRhdGVIdWRTdGF0cyIsInNldHVwSW5wdXQiLCJ3YXJuIiwibWFwIiwicmVnaXN0ZXJTeXN0ZW1zIiwicGVyZm9ybWFuY2UiLCJub3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJnYW1lTG9vcCIsImlucHV0IiwiZ2V0Q29tcG9uZW50IiwiZ2V0S2V5RGlyZWN0aW9uIiwiaGFuZGxlS2V5RG93biIsImRpciIsImluY2x1ZGVzIiwiY29kZSIsImRyb3BCb21iIiwiaGFuZGxlS2V5VXAiLCJkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInBvcyIsImN1cnJlbnRCb21icyIsInF1ZXJ5IiwiYkVudGl0eSIsImNyZWF0ZWQiLCJjcmVhdGVCb21iIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJleGlzdHMiLCJzb21lIiwiZW50aXR5IiwiYm9tYiIsImJvbWJFbnRpdHkiLCJib21iRGl2IiwidG9wIiwiYm9tYkNvbXAiLCJBcnJheSIsImZyb20iLCJrZXlzIiwidmVsIiwicmVuZGVyYWJsZSIsInJlbW92ZVBvd2VyVXBBdCIsImFwcGx5UG93ZXJVcCIsIm5ld0xpdmVzIiwicG93ZXJVcHMiLCJwb3dlclVwIiwicGFyZW50Tm9kZSIsImRlc3Ryb3lFbnRpdHkiLCJ2ZWxvY2l0eSIsIk1hdGgiLCJtaW4iLCJ1cGRhdGVNYXBDZWxsIiwidGlsZSIsImJhY2tncm91bmRJbWFnZSIsImRlc3Ryb3lCb3hDYWxsYmFjayIsImhhcyIsIm9uUGxheWVySHVydCIsInJlbWFpbmluZ0xpdmVzIiwib25Qb3dlclVwUGlja2VkIiwiYnJvYWRjYXN0TW92ZW1lbnQiLCJhZGRTeXN0ZW0iLCJ3IiwiZHQiLCJ1cGRhdGUiLCJuZXh0Tm93IiwiaGFuZGxlR2FtZU92ZXIiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJvdW5kIiwiY3VycmVudExvY2FsUGxheWVyTmFtZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJnZXRQbGF5ZXJOYW1lIiwiZ2V0SXRlbSIsImFmZmVjdGVkQ2VsbHMiLCJjYWxjdWxhdGVFeHBsb3Npb25DZWxscyIsImNlbGwiLCJleHBFbnRpdHkiLCJleHBEaXYiLCJ3aWR0aCIsImhlaWdodCIsImV4cGxvc2lvbnMiLCJleHAiLCJieCIsImJ5IiwiY2VsbHMiLCJkaXJlY3Rpb25zIiwic3RlcHMiLCJpIiwidHgiLCJ0eSIsImNlbGxUeXBlIiwiaGVhcnRFbnRpdHkiLCJoZWFydERpdiIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJmb250U2l6ZSIsImhhbmRsZVBsYXllckRlYXRoIiwiZGVhdGhHcmlkWCIsImZsb29yIiwiZGVhdGhHcmlkWSIsInJlbW92ZUNvbXBvbmVudCIsInBQb3MiLCJpbnZpbmNpYmxlVW50aWwiLCJlUG9zIiwicGxheWVyR3JpZFgiLCJwbGF5ZXJHcmlkWSIsInByZXZpb3VzTGl2ZXMiLCJhbHJlYWR5UmVwb3J0ZWREZWFkIiwiZW50aXRpZXMiLCJkZWx0YSIsIlBMQVlFUl9TSVpFIiwiYmVoYXZpb3IiLCJtb3ZlVG93YXJkVGFyZ2V0IiwiYWN0aXZlSW5wdXQiLCJkeCIsImR5IiwiaGFzSW5wdXQiLCJuZXh0WCIsIm5leHRZIiwic25hcFRocmVzaG9sZCIsImlzQmxvY2tlZCIsImN1cnJlbnRUaWxlWCIsImRpZmZYIiwiYWJzIiwic2lnbiIsImN1cnJlbnRUaWxlWSIsImRpZmZZIiwibmV4dFhBZnRlclNuYXAiLCJuZXh0WUFmdGVyU25hcCIsInN0ZXAiLCJwbGF5ZXJTaXplIiwicGFkZGluZyIsImJvdHRvbSIsImlzQmxvY2tlZENlbGwiLCJwVXBFbnRpdHkiLCJ1cFBvcyIsInBVcCIsImN1cnJlbnRMaXZlcyIsInNlZWQiLCJzZWVkUmFuZG9tIiwic2luIiwidHlwZXMiLCJ0eXBlSW5kZXgiLCJyYW5kb21UeXBlIiwiZGl2IiwiYW5pbVJvd3MiLCJ0YXJnZXRSb3ciLCJmcmFtZUNvdW50IiwiZnJhbWVEZWxheSIsInBvc1giLCJwb3NZIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwidHJhbnNmb3JtIiwibmV4dEVudGl0eUlkIiwiY29tcG9uZW50cyIsInN5c3RlbXMiLCJkZWxldGUiLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50TWFwIiwiZW50cmllcyIsImNvbXBvbmVudERhdGEiLCJjb21wb25lbnROYW1lcyIsImZpcnN0TWFwIiwicmVzdWx0cyIsImhhc0FsbCIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwicmVwbGF5QnRuIiwicmVsb2FkIiwidG9VcHBlckNhc2UiLCJHUklEX0JPUkRFUl9TSVpFIiwiR0FNRV9DSFJPTUVfV0lEVEgiLCJHQU1FX0NIUk9NRV9IRUlHSFQiLCJpbWFnZXMiLCJwbGF5ZXJOYW1lIiwibmFtZUVsIiwibGl2ZXNFbCIsInNwZWVkRWwiLCJib21ic0VsIiwicmFuZ2VFbCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImJvYXJkT3V0ZXJXaWR0aCIsImJvYXJkT3V0ZXJIZWlnaHQiLCJ2aWV3cG9ydFdpZHRoIiwiaW5uZXJXaWR0aCIsInZpZXdwb3J0SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJzY2FsZSIsInJvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4Iiwic3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsImdhbWVTdGFydGVkIiwidGltZXJUZXh0IiwibWVudUVsIiwic3VibWl0dGVkIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImJ1dHRvbiIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwicGxheSIsIm9uY2UiLCJ1cGRhdGVCdXR0b24iLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiXSwic291cmNlUm9vdCI6IiJ9