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

    // 4. Ensure we destroy the heart entity from the remote clients' screens
    if (payload.x !== undefined && payload.y !== undefined) {
      this.removePowerUpAt(payload.x, payload.y);
    }

    // 1. Find the player entity using the payload's playerId
    const entity = this.playerEntities.get(String(payload.playerId));
    if (entity === undefined) return;
    const player = this.world.getComponent(entity, 'Player');
    if (!player) return;

    // 2. Do NOT add +1. Strictly SET the state using the payload
    player.lives = payload.newLives;

    // 3. Update the HUD/UI explicitly with message.payload.newLives
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
    // Explicitly close the old WebSocket to prevent zombie connections
    if (window.socket) {
      window.socket.close();
      window.socket = null;
    }

    // Hard reload to wipe JS memory and start from a clean slate
    window.location.href = '/';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDNUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QsRTs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL2RvbS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29yay5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5LmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jaGF0LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2NvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9ib21iU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL21vdmVtZW50U3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy93b3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvV2luTWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2dhbWUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9sb2JieS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yZWdpc3Rlci5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3NvdW5kLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCBwcm9wcywgLi4uY2hpbGRyZW4pIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gdHlwZSh7IC4uLihwcm9wcyB8fCB7fSksIGNoaWxkcmVuIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcyB8fCB7fSkge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJvblwiKSAmJiB0eXBlb2YgcHJvcHNba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBrZXkuc2xpY2UoMikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGUuc2V0QXR0cmlidXRlKGtleSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmbGF0Q2hpbGRyZW4gPSBjaGlsZHJlbi5mbGF0KEluZmluaXR5KTtcbiAgICBlbGUuYXBwZW5kKC4uLmZsYXRDaGlsZHJlbi5maWx0ZXIoY2hpbGQgPT4gY2hpbGQgIT09IG51bGwgJiYgY2hpbGQgIT09IHVuZGVmaW5lZCAmJiBjaGlsZCAhPT0gZmFsc2UpKTtcblxuICAgIHJldHVybiBlbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgY29udGFpbmVyLnJlcGxhY2VDaGlsZHJlbihlbGVtZW50KTtcbn1cbiIsImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCIuL3JvdXRlci5qc1wiO1xuXG5sZXQgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7IiwiY29uc3QgZWZmZWN0U3RhY2sgPSBbXTtcbmxldCBhY3RpdmVFZmZlY3QgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2lnbmFsKGluaXRpYWxWYWx1ZSkge1xuICAgbGV0IHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgY29uc3QgZWZmZWN0cyA9IG5ldyBTZXQoKTtcblxuICAgY29uc3QgUmVhZCA9ICgpID0+IHtcbiAgICAgIGlmIChhY3RpdmVFZmZlY3QpIHtcbiAgICAgICAgIGVmZmVjdHMuYWRkKGFjdGl2ZUVmZmVjdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICB9XG5cbiAgIGNvbnN0IFdyaXRlID0gKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgIGxldCBmbiA9IG5ld1ZhbHVlO1xuICAgICAgICAgdmFsdWUgPSBmbih2YWx1ZSk7XG4gICAgICB9IFxuICAgICAgZWxzZSB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgZWZmZWN0cy5mb3JFYWNoKGVmZmVjdCA9PiBlZmZlY3QoKSk7XG4gICB9XG5cbiAgIHJldHVybiBbUmVhZCwgV3JpdGVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWZmZWN0KGVmZmVjdCkge1xuICAgZWZmZWN0U3RhY2sucHVzaChlZmZlY3QpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0O1xuICAgZWZmZWN0KCk7XG4gICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdFN0YWNrW2VmZmVjdFN0YWNrLmxlbmd0aCAtIDFdIHx8IG51bGw7XG59XG4iLCJleHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgICAjUm91dGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAjRmlyc3RSZXNvbHZlID0gZmFsc2U7XG5cbiAgICBvbihwYXRoLCBoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuI1JvdXRlc1twYXRoXSA9IGhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBcbiAgICBuYXZpZ2F0ZShwYXRoLCB7IGhpc3RvcnkgPSBcInB1c2hcIiB9ID0ge30pIHtcbiAgICAgICAgcGF0aCA9IHBhdGguc3RhcnRzV2l0aChcIi9cIikgPyBwYXRoIDogXCIvXCIgKyBwYXRoO1xuICAgICAgICByZXR1cm4gbmF2aWdhdGlvbi5uYXZpZ2F0ZShwYXRoLCB7IGhpc3RvcnkgfSk7XG4gICAgfVxuICAgIFxuICAgIHJlc29sdmUocGF0aCA9IGxvY2F0aW9uLnBhdGhuYW1lKSB7XG4gICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3BhdGhdO1xuXG4gICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZuKHsgdXJsOiBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBsaXN0ZW4ob25FcnJvcjQwNCkge1xuICAgICAgICBuYXZpZ2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJuYXZpZ2F0ZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoZXZlbnQuZGVzdGluYXRpb24udXJsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXZlbnQuaW50ZXJjZXB0KHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybC5wYXRobmFtZSwgdGhpcy4jUm91dGVzKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1t1cmwucGF0aG5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yNDA0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm4oeyB1cmwgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdGhpcy4jRmlyc3RSZXNvbHZlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHRoaXMuI0ZpcnN0UmVzb2x2ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHJlbmRlciB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrXCI7XG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCBXaW5NZW51IGZyb20gXCIuLi9wYWdlcy9XaW5NZW51LmpzeFwiO1xuaW1wb3J0IHsgc2V0U3RhdGVzIH0gZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRQbGF5ZXJOYW1lIGFzIHNldEh1ZFBsYXllck5hbWUgfSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IFNvdW5kIGZyb20gXCIuLi91dGlscy9zb3VuZFwiO1xuaW1wb3J0IHsgc2V0TWVzc2FnZXMgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjsgXG5cbmNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIik7XG5jb25zdCB3c3MgPSBuZXcgV2ViU29ja2V0KGB3czovLyR7d2luZG93LmxvY2F0aW9uLmhvc3RuYW1lfTo1MDAwYCk7XG5jb25zdCBzb3VuZCA9IG5ldyBTb3VuZChcIi4vYXNzZXRzL3NvdW5kcy9iYWNrZ3JvdW5kX211c2ljLm1wM1wiKTtcbmxldCBjdXJyZW50R2FtZUVuZ2luZSA9IG51bGw7XG5cbnNvdW5kLmluaXQoKTtcblxucm91dGVyLm9uKFwiL1wiLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcInJlZ2lzdGVyLXBhZ2VcIjtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKHdzKSA9PiB7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJyb29tX3VwZGF0ZVwiOlxuICAgICAgICBjYXNlIFwibG9iYnlfdGltZXJcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJsb2JieS1wYWdlXCI7XG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb25hdGluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXRlcyh7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IG1lc3NhZ2UucGxheWVyc0NvdW50LFxuICAgICAgICAgICAgICAgIHNlY29uZHNMZWZ0OiBtZXNzYWdlLnNlY29uZHNMZWZ0LFxuICAgICAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UudGV4dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfc3RhcnRlZFwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZW5kZXIoPEdhbWUgZ3JpZD17bWVzc2FnZS5ncmlkfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSAobWVzc2FnZS5wbGF5ZXJzIHx8IFtdKS5maW5kKHBsYXllciA9PiBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UueW91clBsYXllcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIGxvY2FsUGxheWVyLm5pY2tuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIdWRQbGF5ZXJOYW1lKGxvY2FsUGxheWVyLm5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBHYW1lRW5naW5lKGdhbWVDb250YWluZXIsIG1lc3NhZ2UuZ3JpZCwgd3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lLmluaXQobWVzc2FnZS55b3VyUGxheWVySWQsIG1lc3NhZ2UucGxheWVycyB8fCBbXSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2FtZSBjb250YWluZXIgd2FzIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwicm9vbV9hbG9uZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJnYW1lX3dvblwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxXaW5NZW51IHdpbm5lck5hbWU9e21lc3NhZ2Uud2lubmVyTmFtZX0gLz4sIHJvb3QpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImNoYXRfbWVzc2FnZVwiOlxuICAgICAgICAgICAgc2V0TWVzc2FnZXMocHJldiA9PiBbLi4ucHJldiAsbWVzc2FnZS5tZXNzYWdlXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBsYXllcl9tb3ZlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlTW92ZShtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib21iX2Ryb3BwZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZUJvbWIobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicG93ZXJ1cF9waWNrZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaXRlbV9waWNrZWRcIjpcbiAgICAgICAgICAgIC8vIEhhbmRsZSByZW1vdGUgaGVhcnQgcGlja3VwIC0gdXBkYXRlIHRoZSBwbGF5ZXIncyBsaXZlcyBvbiBhbGwgY2xpZW50c1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlSXRlbVBpY2t1cChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3JcIiwgZXJyKTtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NlZFwiKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB3c3M7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IHdzcyBmcm9tIFwiLi4vYXBwL2FwcFwiO1xuXG5jb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IGNyZWF0ZVNpZ25hbChbXSk7XG5leHBvcnQgeyBzZXRNZXNzYWdlcyB9O1xuXG5mdW5jdGlvbiBDaGF0UGxheWVycygpIHtcbiAgICBjb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IDxkaXYgY2xhc3M9XCJtZXNzYWdlc1wiPjwvZGl2PjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZ3MgPSBtZXNzYWdlcygpO1xuICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGZvciAobGV0IG1zZyBvZiBtc2dzKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBwLnRleHRDb250ZW50ID0gbXNnO1xuICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXNDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5yZW1vdmVDaGlsZChtZXNzYWdlc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgbXNncy51bnNoaWZ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZm9ybURhdGEuZ2V0KFwibWVzc2FnZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJjaGF0X21lc3NhZ2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH0pKTtcbiAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdFwiIG9uU3VibWl0PXticm9hZGNhc3RNZXNzYWdlfT5cbiAgICAgICAgICAgIHttZXNzYWdlc0NvbnRhaW5lcn1cbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJ0eXBlIHRvIHRoZSBvdGhlciBwbGF5ZXJzIC4uLlwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVyczsiLCIvLyAvc3JjL2Vjcy9jb21wb25lbnRzLmpzXG5cbmV4cG9ydCBjb25zdCBQb3NpdGlvbkNvbXBvbmVudCA9IChneCwgZ3ksIHRpbGVTaXplID0gNjQpID0+ICh7XG4gICAgZ3JpZFg6IGd4LFxuICAgIGdyaWRZOiBneSxcbiAgICB4OiBneCAqIHRpbGVTaXplLFxuICAgIHk6IGd5ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRZOiBneSAqIHRpbGVTaXplXG59KTtcblxuZXhwb3J0IGNvbnN0IFZlbG9jaXR5Q29tcG9uZW50ID0gKGJhc2VTcGVlZCA9IDIuNSkgPT4gKHtcbiAgICBiYXNlU3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBzcGVlZDogYmFzZVNwZWVkLFxuICAgIGlzTW92aW5nOiBmYWxzZSxcbiAgICBkaXJlY3Rpb246ICdkb3duJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBJbnB1dENvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgaW5wdXRRdWV1ZTogW11cbn0pO1xuXG5leHBvcnQgY29uc3QgUmVuZGVyYWJsZUNvbXBvbmVudCA9IChlbCwgZnJhbWVXaWR0aCA9IDY0LCBmcmFtZUhlaWdodCA9IDY0LCB0b3RhbEZyYW1lcyA9IDQsIGZwcyA9IDEyKSA9PiAoe1xuICAgIGVsOiBlbCxcbiAgICBmcmFtZVdpZHRoOiBmcmFtZVdpZHRoLFxuICAgIGZyYW1lSGVpZ2h0OiBmcmFtZUhlaWdodCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IHRvdGFsRnJhbWVzLFxuICAgIHJ1bkZyYW1lczogNCxcbiAgICBpZGxlRnJhbWVzOiAyLFxuICAgIGZwczogZnBzLFxuICAgIGlkbGVGcHM6IDQsXG4gICAgbGFzdEZyYW1lVGltZTogMCxcbiAgICByb3c6IDAsXG4gICAgc3RhdGU6ICdJRExFJyxcbiAgICBsYXN0U3RhdGU6ICdJRExFJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXJDb21wb25lbnQgPSAoaWQsIGNoYXJUeXBlLCBpc0xvY2FsID0gZmFsc2UpID0+ICh7XG4gICAgaWQ6IGlkLFxuICAgIGNoYXJUeXBlOiBjaGFyVHlwZSxcbiAgICBpc0xvY2FsOiBpc0xvY2FsXG59KTtcblxuZXhwb3J0IGNvbnN0IEJvbWJDb21wb25lbnQgPSAob3duZXJJZCwgdGltZXIgPSAyMDAwLCByYW5nZSA9IDQpID0+ICh7XG4gICAgb3duZXJJZDogb3duZXJJZCxcbiAgICB0aW1lcjogdGltZXIsXG4gICAgcmFuZ2U6IHJhbmdlLFxuICAgIGV4cGxvZGVkOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBFeHBsb3Npb25Db21wb25lbnQgPSAoZHVyYXRpb24gPSA1MDApID0+ICh7XG4gICAgZHVyYXRpb246IGR1cmF0aW9uXG59KTtcblxuZXhwb3J0IGNvbnN0IFBvd2VyVXBDb21wb25lbnQgPSAodHlwZSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlLCBcbiAgICBwaWNrZWRVcDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgQmVoYXZpb3JDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGdob3N0TW9kZTogZmFsc2UsXG4gICAgdGhyb3dhYmxlOiBmYWxzZSxcbiAgICBkZXRvbmF0b3I6IGZhbHNlLFxuICAgIGZhc3RTaG9lc0xldmVsOiAxLFxuICAgIGJvbWJzOiB7XG4gICAgICAgIG1heDogMSxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgcmFuZ2U6IDJcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC5qcyc7XG5pbXBvcnQge1xuICAgIFBvc2l0aW9uQ29tcG9uZW50LFxuICAgIFZlbG9jaXR5Q29tcG9uZW50LFxuICAgIElucHV0Q29tcG9uZW50LFxuICAgIFJlbmRlcmFibGVDb21wb25lbnQsXG4gICAgUGxheWVyQ29tcG9uZW50LFxuICAgIEJvbWJDb21wb25lbnRcbn0gZnJvbSAnLi9jb21wb25lbnRzLmpzJztcbmltcG9ydCB7IG1vdmVtZW50U3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL21vdmVtZW50U3lzdGVtLmpzJztcbmltcG9ydCB7IHJlbmRlclN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgYm9tYlN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9ib21iU3lzdGVtLmpzJztcbmltcG9ydCB7IGRhbWFnZVN5c3RlbSwgY2hlY2tHYW1lRW5kQ29uZGl0aW9ucywgc3Bhd25IZWFydFBvd2VyVXAgfSBmcm9tICcuL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzJztcbmltcG9ydCBXaW5NZW51IGZyb20gJy4uL3BhZ2VzL1dpbk1lbnUuanN4JztcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJy4uLy4uL21pbmktZnJhbWV3b3JrL2RvbS5qcyc7XG5cbmltcG9ydCB7IHBvd2VyVXBTeXN0ZW0sIHNwYXduUG93ZXJVcCB9IGZyb20gJy4vc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzJztcbmltcG9ydCB7IHNldEJvbWJzLCBzZXRMaXZlcywgc2V0UmFuZ2UsIHNldFNwZWVkIH0gZnJvbSAnLi4vcGFnZXMvZ2FtZSc7XG5cbmNvbnN0IFRJTEVfU0laRSA9IDY0O1xuY29uc3QgQU5JTUFUSU9OX1JPV1MgPSB7XG4gICAgUlVOOiB7IHVwOiAzOCwgbGVmdDogMzksIGRvd246IDQwLCByaWdodDogNDEgfSxcbiAgICBJRExFOiB7IHVwOiAyMiwgbGVmdDogMjMsIGRvd246IDI0LCByaWdodDogMjUgfVxufTtcblxuZXhwb3J0IGNsYXNzIEdhbWVFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0NvbnRhaW5lciwgbWFwRGF0YSwgc29ja2V0KSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY2FudmFzQ29udGFpbmVyO1xuICAgICAgICB0aGlzLm1hcERhdGEgPSBtYXBEYXRhO1xuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xuICAgICAgICB0aGlzLmxvY2FsUGxheWVyRW50aXR5ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJJbmZvID0gbmV3IE1hcCgpOyAvLyBTdG9yZSBvcmlnaW5hbCBwbGF5ZXIgZGF0YSBsaWtlIG5pY2tuYW1lXG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgLy8gU3RhdGUgZmxhZyB0byBwcmV2ZW50IG11bHRpcGxlIGxvc3MgbW9kYWwgcmVuZGVycyAoVGhlIExvb3AgVHJhcCBmaXgpXG4gICAgICAgIHRoaXMubG9zc01vZGFsVHJpZ2dlcmVkID0gZmFsc2U7XG4gICAgICAgIC8vIEZsYWcgdG8gdHJhY2sgaWYgaW5wdXQgc2hvdWxkIGJlIGRpc2FibGVkXG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gRmxhZyB0byBzdG9wIHRoZSBnYW1lIGxvb3Agb25jZSBhIHdpbm5lciBpcyBkZWNpZGVkXG4gICAgICAgIHRoaXMuZ2FtZUVuZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdChsb2NhbFBsYXllcklkLCBhbGxQbGF5ZXJzKSB7XG4gICAgICAgIHRoaXMudG90YWxQbGF5ZXJzID0gYWxsUGxheWVycy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkID0gU3RyaW5nKGxvY2FsUGxheWVySWQpO1xuXG4gICAgICAgIGFsbFBsYXllcnMuZm9yRWFjaChwRGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IFN0cmluZyhwRGF0YS5pZCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJJbmZvLnNldChwbGF5ZXJJZCwgcERhdGEpOyAvLyBTdG9yZSBvcmlnaW5hbCBwbGF5ZXIgZGF0YVxuICAgICAgICAgICAgY29uc3QgcGxheWVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IHBEYXRhLmNvbG9yIHx8IFwid2hpdGVcIjtcblxuICAgICAgICAgICAgcGxheWVyRGl2LmNsYXNzTmFtZSA9IGBwbGF5ZXIgcGxheWVyLSR7Y29sb3J9YDtcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuekluZGV4ID0gJzEwJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS53aWxsQ2hhbmdlID0gJ3RyYW5zZm9ybSc7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJEaXYpO1xuXG4gICAgICAgICAgICBjb25zdCBzeCA9IHBEYXRhLnggfHwgMTtcbiAgICAgICAgICAgIGNvbnN0IHN5ID0gcERhdGEueSB8fCAxO1xuXG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicsIFBvc2l0aW9uQ29tcG9uZW50KHN4LCBzeSwgVElMRV9TSVpFKSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScsIFZlbG9jaXR5Q29tcG9uZW50KDIuNSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScsIFJlbmRlcmFibGVDb21wb25lbnQocGxheWVyRGl2LCA2NCwgNjQsIDQsIDEyKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaXNMb2NhbCA9IHBsYXllcklkID09PSBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZDtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckNvbXAgPSBQbGF5ZXJDb21wb25lbnQocGxheWVySWQsIGNvbG9yLCBpc0xvY2FsKTtcbiAgICAgICAgICAgIHBsYXllckNvbXAubGl2ZXMgPSAzO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5tYXhCb21icyA9IDE7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmJvbWJSYW5nZSA9IDQ7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInLCBwbGF5ZXJDb21wKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMuc2V0KHBsYXllcklkLCBwbGF5ZXJFbnRpdHkpO1xuXG4gICAgICAgICAgICBpZiAoaXNMb2NhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBwbGF5ZXJFbnRpdHk7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnLCBJbnB1dENvbXBvbmVudCgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHBsYXllckVudGl0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbR2FtZUVuZ2luZV0gTG9jYWwgcGxheWVyIHdhcyBub3QgZm91bmRcIiwge1xuICAgICAgICAgICAgICAgIGxvY2FsUGxheWVySWQsXG4gICAgICAgICAgICAgICAgcGxheWVyczogYWxsUGxheWVycy5tYXAocGxheWVyID0+IHBsYXllci5pZCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTeXN0ZW1zKCk7XG5cbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChub3cpID0+IHRoaXMuZ2FtZUxvb3Aobm93KSk7XG4gICAgfVxuXG4gICAgc2V0dXBJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgaWYgKCFpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGdldEtleURpcmVjdGlvbiA9IChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1VwJyB8fCBrZXkgPT09ICd3JyB8fCBrZXkgPT09ICdaJyB8fCBrZXkgPT09ICd6JykgcmV0dXJuICd1cCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dEb3duJyB8fCBrZXkgPT09ICdzJyB8fCBrZXkgPT09ICdTJykgcmV0dXJuICdkb3duJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0xlZnQnIHx8IGtleSA9PT0gJ2EnIHx8IGtleSA9PT0gJ1EnIHx8IGtleSA9PT0gJ3EnKSByZXR1cm4gJ2xlZnQnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93UmlnaHQnIHx8IGtleSA9PT0gJ2QnIHx8IGtleSA9PT0gJ0QnKSByZXR1cm4gJ3JpZ2h0JztcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgLy8gSU5QVVQgRElTQUJMRUQ6IEltbWVkaWF0ZWx5IGlnbm9yZSBhbGwga2V5Ym9hcmQgaW5wdXRzIHdoZW4gcGxheWVyIGlzIGRlYWRcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dEVuYWJsZWQpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5pbnB1dFF1ZXVlLmluY2x1ZGVzKGRpcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZS51bnNoaWZ0KGRpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICcgJyB8fCBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wQm9tYigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleVVwID0gKGUpID0+IHtcbiAgICAgICAgICAgIC8vIElOUFVUIERJU0FCTEVEOiBJbW1lZGlhdGVseSBpZ25vcmUgYWxsIGtleWJvYXJkIGlucHV0cyB3aGVuIHBsYXllciBpcyBkZWFkXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5wdXRFbmFibGVkKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZSA9IGlucHV0LmlucHV0UXVldWUuZmlsdGVyKGQgPT4gZCAhPT0gZGlyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZHJvcEJvbWIoKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcblxuICAgICAgICBjb25zdCBjdXJyZW50Qm9tYnMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuZmlsdGVyKGJFbnRpdHkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGJFbnRpdHksICdCb21iJykub3duZXJJZCA9PT0gcGxheWVyLmlkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY3VycmVudEJvbWJzLmxlbmd0aCA+PSBwbGF5ZXIubWF4Qm9tYnMpIHJldHVybjtcblxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVCb21iKHBsYXllci5pZCwgcG9zLmdyaWRYLCBwb3MuZ3JpZFksIHBsYXllci5ib21iUmFuZ2UpO1xuICAgICAgICBpZiAoIWNyZWF0ZWQpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdEUk9QX0JPTUInLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHsgaWQ6IHBsYXllci5pZCwgeDogcG9zLmdyaWRYLCB5OiBwb3MuZ3JpZFksIHJhbmdlOiBwbGF5ZXIuYm9tYlJhbmdlIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUJvbWIob3duZXJJZCwgZ3JpZFgsIGdyaWRZLCByYW5nZSkge1xuICAgICAgICBjb25zdCBleGlzdHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuc29tZShlbnRpdHkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IGJvbWIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCb21iJyk7XG4gICAgICAgICAgICByZXR1cm4gYm9tYi5vd25lcklkID09PSBvd25lcklkICYmIHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGV4aXN0cykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGJvbWJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICBjb25zdCBib21iRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGJvbWJEaXYuY2xhc3NOYW1lID0gJ2JvbWInO1xuICAgICAgICBib21iRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnRvcCA9IGAke2dyaWRZICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS56SW5kZXggPSAnNic7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGJvbWJEaXYpO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFgsIGdyaWRZIH0pO1xuXG4gICAgICAgIGNvbnN0IGJvbWJDb21wID0gQm9tYkNvbXBvbmVudChvd25lcklkLCAyMDAwLCByYW5nZSk7XG4gICAgICAgIGJvbWJDb21wLmVsID0gYm9tYkRpdjtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInLCBib21iQ29tcCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZU1vdmUocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltoYW5kbGVSZW1vdGVNb3ZlXSBJbnZhbGlkIHBheWxvYWQ6XCIsIHBheWxvYWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gRW50aXR5IG5vdCBmb3VuZCBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH0uIEF2YWlsYWJsZSBwbGF5ZXJzOmAsIEFycmF5LmZyb20odGhpcy5wbGF5ZXJFbnRpdGllcy5rZXlzKCkpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gSWdub3JpbmcgbG9jYWwgcGxheWVyIHVwZGF0ZSBmb3IgJHtwYXlsb2FkLmlkfWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghcG9zIHx8ICF2ZWwgfHwgIXJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIE1pc3NpbmcgY29tcG9uZW50cyBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH06YCwgeyBwb3M6ICEhcG9zLCB2ZWw6ICEhdmVsLCByZW5kZXJhYmxlOiAhIXJlbmRlcmFibGUgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW2hhbmRsZVJlbW90ZU1vdmVdIFVwZGF0aW5nIHBsYXllciAke3BheWxvYWQuaWR9IHRvICgke3BheWxvYWQuZ3JpZFh9LCAke3BheWxvYWQuZ3JpZFl9KWApO1xuICAgICAgICB2ZWwuZGlyZWN0aW9uID0gcGF5bG9hZC5kaXJlY3Rpb24gfHwgdmVsLmRpcmVjdGlvbjtcbiAgICAgICAgdmVsLmlzTW92aW5nID0gcGF5bG9hZC5pc01vdmluZztcbiAgICAgICAgcG9zLmdyaWRYID0gcGF5bG9hZC5ncmlkWDtcbiAgICAgICAgcG9zLmdyaWRZID0gcGF5bG9hZC5ncmlkWTtcbiAgICAgICAgcG9zLnRhcmdldFggPSBwYXlsb2FkLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcGF5bG9hZC55O1xuICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gcGF5bG9hZC5zdGF0ZSB8fCAocGF5bG9hZC5pc01vdmluZyA/ICdSVU4nIDogJ0lETEUnKTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVCb21iKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3JlYXRlQm9tYihwYXlsb2FkLmlkLCBwYXlsb2FkLngsIHBheWxvYWQueSwgcGF5bG9hZC5yYW5nZSB8fCA0KTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8IHBheWxvYWQueCA9PT0gdW5kZWZpbmVkIHx8IHBheWxvYWQueSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCB8fCBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHJldHVybjtcblxuICAgICAgICB0aGlzLmFwcGx5UG93ZXJVcChlbnRpdHksIHBheWxvYWQudHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyByZW1vdGUgaGVhcnQgcGlja3VwIC0gdXBkYXRlcyBwbGF5ZXIgbGl2ZXMgYW5kIFVJIG9uIGFsbCBjbGllbnRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWQgLSB7IHBsYXllcklkLCBuZXdMaXZlcyB9XG4gICAgICovXG4gICAgaGFuZGxlUmVtb3RlSXRlbVBpY2t1cChwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5wbGF5ZXJJZCB8fCBwYXlsb2FkLm5ld0xpdmVzID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAvLyA0LiBFbnN1cmUgd2UgZGVzdHJveSB0aGUgaGVhcnQgZW50aXR5IGZyb20gdGhlIHJlbW90ZSBjbGllbnRzJyBzY3JlZW5zXG4gICAgICAgIGlmIChwYXlsb2FkLnggIT09IHVuZGVmaW5lZCAmJiBwYXlsb2FkLnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMS4gRmluZCB0aGUgcGxheWVyIGVudGl0eSB1c2luZyB0aGUgcGF5bG9hZCdzIHBsYXllcklkXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLnBsYXllcklkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBsYXllcikgcmV0dXJuO1xuXG4gICAgICAgIC8vIDIuIERvIE5PVCBhZGQgKzEuIFN0cmljdGx5IFNFVCB0aGUgc3RhdGUgdXNpbmcgdGhlIHBheWxvYWRcbiAgICAgICAgcGxheWVyLmxpdmVzID0gcGF5bG9hZC5uZXdMaXZlcztcblxuICAgICAgICAvLyAzLiBVcGRhdGUgdGhlIEhVRC9VSSBleHBsaWNpdGx5IHdpdGggbWVzc2FnZS5wYXlsb2FkLm5ld0xpdmVzXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMoZW50aXR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbUmVtb3RlIEl0ZW0gUGlja3VwXSBQbGF5ZXIgJHtwYXlsb2FkLnBsYXllcklkfSBwaWNrZWQgdXAgaGVhcnQuIE5ldyBsaXZlczogJHtwYXlsb2FkLm5ld0xpdmVzfWApO1xuICAgIH1cblxuICAgIHJlbW92ZVBvd2VyVXBBdChncmlkWCwgZ3JpZFkpIHtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMuYWRkKGAke2dyaWRYfSwke2dyaWRZfWApO1xuICAgICAgICBjb25zdCBwb3dlclVwcyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBvd2VyVXAgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXBvcyB8fCAhcG93ZXJVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwb3dlclVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChwb3dlclVwLmVsICYmIHBvd2VyVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwb3dlclVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG93ZXJVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlQb3dlclVwKGVudGl0eSwgdHlwZSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgdmVsb2NpdHkuc3BlZWQgPSBNYXRoLm1pbih2ZWxvY2l0eS5zcGVlZCArIDEsIDgpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgIC8vIEhFQVJUIHBvd2VyLXVwOiBpbmNyZW1lbnQgbGl2ZXMgKGNhcCBhdCAzKVxuICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5taW4oKHBsYXllci5saXZlcyB8fCAwKSArIDEsIDMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTeXN0ZW1zKCkge1xuICAgICAgICBjb25zdCB1cGRhdGVNYXBDZWxsID0gKHgsIHksIG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubWFwRGF0YVt5XSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm1hcERhdGFbeV1beF0gPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gKTtcbiAgICAgICAgICAgIGlmICghdGlsZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aWxlLmNsYXNzTmFtZSA9ICd0aWxlIHRpbGUtZmxvb3InO1xuICAgICAgICAgICAgdGlsZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiKSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZGVzdHJveUJveENhbGxiYWNrID0gKHgsIHkpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYWltZWRQb3dlclVwcy5oYXMoYCR7eH0sJHt5fWApKSByZXR1cm47XG4gICAgICAgICAgICBzcGF3blBvd2VyVXAodGhpcy53b3JsZCwgeCwgeSwgdGhpcy5jb250YWluZXIsIFRJTEVfU0laRSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25QbGF5ZXJIdXJ0ID0gKGVudGl0eSwgaWQsIHJlbWFpbmluZ0xpdmVzKSA9PiB7XG4gICAgICAgICAgICAvLyBDUklUSUNBTDogT25seSBzZW5kIHBsYXllcl9kaWVkIGlmIFRISVMgSVMgVEhFIExPQ0FMIFBMQVlFUi5cbiAgICAgICAgICAgIC8vIFRoZSBFQ1MgZGFtYWdlU3lzdGVtIHJ1bnMgb24gQUxMIGNsaWVudHMsIHNvIGV2ZXJ5IGNsaWVudCBkZXRlY3RzXG4gICAgICAgICAgICAvLyBldmVyeSBjb2xsaXNpb24uIFdlIG11c3QgZ3VhcmQgdGhlIFdlYlNvY2tldCBtZXNzYWdlIHRvIHByZXZlbnRcbiAgICAgICAgICAgIC8vIGluY29ycmVjdCBkZWF0aCByZXBvcnRzLlxuICAgICAgICAgICAgaWYgKHJlbWFpbmluZ0xpdmVzIDw9IDAgJiYgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5ICYmIHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwbGF5ZXJfZGllZCdcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEhVRCBvbmx5IGZvciB0aGUgbG9jYWwgcGxheWVyLlxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHNldExpdmVzKHJlbWFpbmluZ0xpdmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBvd2VyVXBQaWNrZWQgPSAoaWQsIHR5cGUsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHt4fSwke3l9YCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhpZCkpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IGVudGl0eSA/IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyQ29tcCAmJiBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0TGl2ZXMocGxheWVyQ29tcC5saXZlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyQ29tcCAmJiBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyh0aGlzLmxvY2FsUGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlID09PSAnSEVBUlQnID8gJ0lURU1fUElDS1VQJyA6ICdQT1dFUlVQX1BJQ0tFRCcsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IHR5cGUgPT09ICdIRUFSVCdcbiAgICAgICAgICAgICAgICAgICAgICAgID8geyBwbGF5ZXJJZDogaWQsIG5ld0xpdmVzOiBwbGF5ZXJDb21wID8gcGxheWVyQ29tcC5saXZlcyA6IDAsIHgsIHkgfVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7IGlkLCB0eXBlLCB4LCB5IH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5icm9hZGNhc3RNb3ZlbWVudCA9IChlbnRpdHksIHgsIHksIGdyaWRYLCBncmlkWSwgZGlyZWN0aW9uLCBpc01vdmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAoIXBsYXllciB8fCAhdGhpcy5zb2NrZXQgfHwgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ01PVkVfU1RBVEUnLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBsYXllci5pZCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGlzTW92aW5nLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IG1vdmVtZW50U3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBib21iU3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGRhbWFnZVN5c3RlbSh0aGlzLndvcmxkLCBub3csIG9uUGxheWVySHVydCwgdGhpcy5sb2NhbFBsYXllckVudGl0eSwgVElMRV9TSVpFLCB0aGlzLnNvY2tldCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcG93ZXJVcFN5c3RlbSh3LCBvblBvd2VyVXBQaWNrZWQpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHJlbmRlclN5c3RlbSh3LCBkdCwgbm93LCBBTklNQVRJT05fUk9XUykpO1xuICAgIH1cblxuICAgIGdhbWVMb29wKG5vdykge1xuICAgICAgICBpZiAoIXRoaXMucnVubmluZykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGR0ID0gbm93IC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IG5vdztcbiAgICAgICAgdGhpcy53b3JsZC51cGRhdGUoZHQsIG5vdyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobmV4dE5vdykgPT4gdGhpcy5nYW1lTG9vcChuZXh0Tm93KSk7XG4gICAgfVxuXG4gICAgaGFuZGxlR2FtZU92ZXIod2lubmVyTmFtZSkge1xuICAgICAgICBpZiAodGhpcy5nYW1lRW5kZWQpIHJldHVybjsgLy8gUHJldmVudCBtdWx0aXBsZSB0cmlnZ2Vyc1xuICAgICAgICB0aGlzLmdhbWVFbmRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuXG4gICAgICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9ICdtZW51LXBhZ2UnO1xuICAgICAgICByZW5kZXIoPFdpbk1lbnUgd2lubmVyTmFtZT17d2lubmVyTmFtZX0gLz4sIHJvb3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBnYW1lIGVuZCBjb25kaXRpb25zIHdpdGggcHJvcGVyIHN0YXRlIGZsYWcgbWFuYWdlbWVudC5cbiAgICAgKiBQcmV2ZW50cyB0aGUgXCJMb29wIFRyYXBcIiAtIG1vZGFsIGlzIG9ubHkgcmVuZGVyZWQgT05DRSB3aGVuIGxpdmVzIHJlYWNoIDAuXG4gICAgICogQWxzbyBkaXNhYmxlcyBpbnB1dCBpbW1lZGlhdGVseSB3aGVuIHBsYXllciBkaWVzLlxuICAgICAqL1xuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUh1ZFN0YXRzKGVudGl0eSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgICAgIHNldExpdmVzKHBsYXllci5saXZlcyA/PyAzKTtcbiAgICAgICAgc2V0UmFuZ2UocGxheWVyLmJvbWJSYW5nZSB8fCA0KTtcbiAgICAgICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYm9tYlN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3QgYm9tYnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgYm9tYkVudGl0eSBvZiBib21icykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IGJvbWIgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgXG4gICAgICAgIGJvbWIudGltZXIgLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoYm9tYi50aW1lciA8PSAwICYmICFib21iLmV4cGxvZGVkKSB7XG4gICAgICAgICAgICBib21iLmV4cGxvZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgYWZmZWN0ZWRDZWxscyA9IGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBib21iLnJhbmdlLCBtYXBEYXRhKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWZmZWN0ZWRDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGV4cERpdi5jbGFzc05hbWUgPSAnZXhwbG9zaW9uJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Y2VsbC54ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS50b3AgPSBgJHtjZWxsLnkgKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnpJbmRleCA9ICc3JztcblxuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicsIHsgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYOiBjZWxsLngsIFxuICAgICAgICAgICAgICAgICAgICBncmlkWTogY2VsbC55LCBcbiAgICAgICAgICAgICAgICAgICAgeDogY2VsbC54ICogdGlsZVNpemUsIFxuICAgICAgICAgICAgICAgICAgICB5OiBjZWxsLnkgKiB0aWxlU2l6ZSBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJywgeyBkdXJhdGlvbjogNTAwLCBlbDogZXhwRGl2IH0pO1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChleHBEaXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhW2NlbGwueV0gJiYgbWFwRGF0YVtjZWxsLnldW2NlbGwueF0gPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTWFwQ2VsbChjZWxsLngsIGNlbGwueSwgMik7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzdHJveUJveENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95Qm94Q2FsbGJhY2soY2VsbC54LCBjZWxsLnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChib21iLmVsICYmIGJvbWIuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChib21iLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoYm9tYkVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgIGNvbnN0IGV4cCA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nKTtcbiAgICAgICAgZXhwLmR1cmF0aW9uIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGV4cC5kdXJhdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICBpZiAoZXhwLmVsICYmIGV4cC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZXhwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXhwLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoZXhwRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMoYngsIGJ5LCByYW5nZSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGxzID0gW3sgeDogYngsIHk6IGJ5IH1dO1xuICAgIGNvbnN0IGRpcmVjdGlvbnMgPSBbXG4gICAgICAgIHsgeDogMCwgeTogLTEgfSxcbiAgICAgICAgeyB4OiAwLCB5OiAxIH0sXG4gICAgICAgIHsgeDogLTEsIHk6IDAgfSxcbiAgICAgICAgeyB4OiAxLCB5OiAwIH1cbiAgICBdO1xuICAgIFxuICAgIGNvbnN0IHN0ZXBzID0gcmFuZ2UgLSAxOyBcbiAgICBcbiAgICBkaXJlY3Rpb25zLmZvckVhY2goZGlyID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdHggPSBieCArIChkaXIueCAqIGkpO1xuICAgICAgICAgICAgY29uc3QgdHkgPSBieSArIChkaXIueSAqIGkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW1hcERhdGFbdHldIHx8IG1hcERhdGFbdHldW3R4XSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY2VsbFR5cGUgPSBtYXBEYXRhW3R5XVt0eF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjZWxscy5wdXNoKHsgeDogdHgsIHk6IHR5IH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBjZWxscztcbn1cbiIsIi8qKlxuICogU3Bhd25zIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBzcGVjaWZpZWQgZ3JpZCBjb29yZGluYXRlcy5cbiAqIFRoaXMgY3JlYXRlcyBhIHByb3BlciBFQ1MgZW50aXR5IHdpdGggUG9zaXRpb24sIFBvd2VyVXAsIGFuZCBSZW5kZXJhYmxlIGNvbXBvbmVudHMuXG4gKiBcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBncmlkWCAtIEdyaWQgWCBjb29yZGluYXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZ3JpZFkgLSBHcmlkIFkgY29vcmRpbmF0ZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwYXduSGVhcnRQb3dlclVwKHdvcmxkLCBncmlkWCwgZ3JpZFksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIC8vIENyZWF0ZSBhIG5ldyBlbnRpdHkgZm9yIHRoZSBoZWFydCBwb3dlci11cFxuICAgIGNvbnN0IGhlYXJ0RW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgXG4gICAgLy8gQWRkIFBvc2l0aW9uIGNvbXBvbmVudFxuICAgIHdvcmxkLmFkZENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvc2l0aW9uJywge1xuICAgICAgICBncmlkWDogZ3JpZFgsXG4gICAgICAgIGdyaWRZOiBncmlkWSxcbiAgICAgICAgeDogZ3JpZFggKiB0aWxlU2l6ZSxcbiAgICAgICAgeTogZ3JpZFkgKiB0aWxlU2l6ZVxuICAgIH0pO1xuICAgIFxuICAgIC8vIEFkZCBQb3dlclVwIGNvbXBvbmVudCB3aXRoIHR5cGUgJ0hFQVJUJ1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvd2VyVXAnLCB7XG4gICAgICAgIHR5cGU6ICdIRUFSVCcsXG4gICAgICAgIHBpY2tlZFVwOiBmYWxzZSxcbiAgICAgICAgZWw6IG51bGwgIC8vIFdpbGwgYmUgc2V0IGFmdGVyIGNyZWF0aW5nIHRoZSBET00gZWxlbWVudFxuICAgIH0pO1xuICAgIFxuICAgIC8vIENyZWF0ZSB0aGUgRE9NIGVsZW1lbnQgZm9yIHJlbmRlcmluZ1xuICAgIGNvbnN0IGhlYXJ0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhcnREaXYuY2xhc3NOYW1lID0gJ3Bvd2VydXAgcG93ZXJ1cC1oZWFydCc7XG4gICAgaGVhcnREaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICBoZWFydERpdi5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcbiAgICBoZWFydERpdi5zdHlsZS5mb250U2l6ZSA9ICczMnB4JztcbiAgICBoZWFydERpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgaGVhcnREaXYudGV4dENvbnRlbnQgPSAn4p2k77iPJztcbiAgICBcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaGVhcnREaXYpO1xuICAgIFxuICAgIC8vIFVwZGF0ZSB0aGUgUG93ZXJVcCBjb21wb25lbnQgd2l0aCB0aGUgRE9NIGVsZW1lbnQgcmVmZXJlbmNlXG4gICAgY29uc3QgcG93ZXJVcCA9IHdvcmxkLmdldENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICBpZiAocG93ZXJVcCkge1xuICAgICAgICBwb3dlclVwLmVsID0gaGVhcnREaXY7XG4gICAgfVxuICAgIFxuICAgIGNvbnNvbGUubG9nKGBbSGVhcnQgRHJvcF0gU3Bhd25lZCBIRUFSVCBwb3dlci11cCBhdCAoJHtncmlkWH0sICR7Z3JpZFl9KWApO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgcGxheWVyIGRlYXRoIHRyYW5zaXRpb24gd2hlbiBsaXZlcyByZWFjaCAwLlxuICogUmVtb3ZlcyB0aGUgcGxheWVyJ3MgRE9NIGVsZW1lbnQgYW5kIHNwYXducyBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgZGVhdGggbG9jYXRpb24uXG4gKlxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckVudGl0eSAtIFRoZSBlbnRpdHkgSUQgb2YgdGhlIGR5aW5nIHBsYXllclxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgY29udGFpbmVyID0gbnVsbCkge1xuICAgIC8vIEdldCB0aGUgcGxheWVyJ3MgY29tcG9uZW50c1xuICAgIGNvbnN0IHBvc2l0aW9uID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgaWYgKCFwb3NpdGlvbiB8fCAhcmVuZGVyYWJsZSB8fCAhcGxheWVyKSByZXR1cm47XG5cbiAgICAvLyBTdG9yZSB0aGUgZ3JpZCBjb29yZGluYXRlcyB3aGVyZSB0aGUgcGxheWVyIGRpZWRcbiAgICBjb25zdCBkZWF0aEdyaWRYID0gTWF0aC5mbG9vcigocG9zaXRpb24ueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgY29uc3QgZGVhdGhHcmlkWSA9IE1hdGguZmxvb3IoKHBvc2l0aW9uLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuXG4gICAgLy8gQ1JJVElDQUw6IFJlbW92ZSB0aGUgcGxheWVyJ3MgRE9NIGVsZW1lbnQgZnJvbSB0aGUgZG9jdW1lbnQgQkVGT1JFIHJlbW92aW5nIHRoZSBSZW5kZXJhYmxlIGNvbXBvbmVudC5cbiAgICAvLyBUaGlzIGVuc3VyZXMgdGhlIGRlYWQgcGxheWVyIHZpc3VhbGx5IGRpc2FwcGVhcnMgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHJlbmRlcmFibGUuZWwgJiYgcmVuZGVyYWJsZS5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChyZW5kZXJhYmxlLmVsKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgY29tcG9uZW50cyB0aGF0IGVuYWJsZSBpbnRlcmFjdGlvbiBhbmQgcmVuZGVyaW5nLlxuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgd29ybGQucmVtb3ZlQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgd29ybGQucmVtb3ZlQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ0lucHV0Jyk7XG4gICAgLy8gV2Uga2VlcCBQb3NpdGlvbiBhbmQgUGxheWVyIGNvbXBvbmVudHMgdG8ga25vdyB3aGVyZSB0aGV5IHdlcmUuXG5cbiAgICAvLyBTcGF3biBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgZGVhdGggbG9jYXRpb24gKHByb3BlciBFQ1MgZW50aXR5KVxuICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBjb250YWluZXIgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgc3Bhd25IZWFydFBvd2VyVXAod29ybGQsIGRlYXRoR3JpZFgsIGRlYXRoR3JpZFksIGdhbWVDb250YWluZXIsIHRpbGVTaXplKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgW1BsYXllciBEZWF0aF0gUGxheWVyICR7cGxheWVyLmlkfSBkaWVkIGF0ICgke2RlYXRoR3JpZFh9LCAke2RlYXRoR3JpZFl9KS4gSGVhcnQgcG93ZXItdXAgZHJvcHBlZC5gKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhbWFnZVN5c3RlbSh3b3JsZCwgbm93LCBvblBsYXllckh1cnQsIGxvY2FsUGxheWVyRW50aXR5LCB0aWxlU2l6ZSA9IDY0LCBzb2NrZXQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1BsYXllcicpO1xuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChwbGF5ZXIuaW52aW5jaWJsZVVudGlsICYmIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPiBub3cpIGNvbnRpbnVlO1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICAgICAgY29uc3QgZVBvcyA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHcmlkLWJhc2VkIGNvbGxpc2lvblxuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFggPSBNYXRoLmZsb29yKChwUG9zLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFkgPSBNYXRoLmZsb29yKChwUG9zLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuXG4gICAgICAgICAgICBpZiAocGxheWVyR3JpZFggPT09IGVQb3MuZ3JpZFggJiYgcGxheWVyR3JpZFkgPT09IGVQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c0xpdmVzID0gcGxheWVyLmxpdmVzID8/IDM7XG4gICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5tYXgocHJldmlvdXNMaXZlcyAtIDEsIDApO1xuICAgICAgICAgICAgICAgIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPSBub3cgKyAxNTAwO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgaXMgZGVhZCwgcmVwb3J0IGRlYXRoIE9OQ0UgdXNpbmcgZ3VhcmQgY2xhdXNlXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5saXZlcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuYWxyZWFkeVJlcG9ydGVkRGVhZCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5hbHJlYWR5UmVwb3J0ZWREZWFkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAob25QbGF5ZXJIdXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblBsYXllckh1cnQocGxheWVyRW50aXR5LCBwbGF5ZXIuaWQsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBQbGF5ZXIgc3RpbGwgYWxpdmUsIHJlcG9ydCBub3JtYWwgZGFtYWdlXG4gICAgICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUGxheWVySHVydChwbGF5ZXJFbnRpdHksIHBsYXllci5pZCwgcGxheWVyLmxpdmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBCcmVhayB0aGUgbG9vcCBzaW5jZSB0aGUgcGxheWVyIGhhcyBhbHJlYWR5IHRha2VuIGRhbWFnZSBmcm9tIHRoaXMgZXhwbG9zaW9uLlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImV4cG9ydCBmdW5jdGlvbiBtb3ZlbWVudFN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdGlsZVNpemUgPSA0MCkge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5Jyk7XG4gICAgY29uc3QgZGVsdGEgPSBkdCAvIDE2LjY3O1xuXG4gICAgY29uc3QgUExBWUVSX1NJWkUgPSB0aWxlU2l6ZTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgY29uc3QgYmVoYXZpb3IgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQmVoYXZpb3InKTtcblxuICAgICAgICBpZiAoYmVoYXZpb3IpIHtcbiAgICAgICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQgKyAoYmVoYXZpb3IuZmFzdFNob2VzTGV2ZWwgLSAxKSAqIDAuNTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUlucHV0ID0gaW5wdXQuaW5wdXRRdWV1ZVswXTtcbiAgICAgICAgbGV0IGR4ID0gMDtcbiAgICAgICAgbGV0IGR5ID0gMDtcblxuICAgICAgICBpZiAoYWN0aXZlSW5wdXQgPT09ICd1cCcpIHtcbiAgICAgICAgICAgIGR5ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3VwJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2Rvd24nKSB7XG4gICAgICAgICAgICBkeSA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2Rvd24nO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIGR4ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICBkeCA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3JpZ2h0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhc0lucHV0ID0gZHggIT09IDAgfHwgZHkgIT09IDA7XG5cbiAgICAgICAgaWYgKCFoYXNJbnB1dCkge1xuICAgICAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG4gICAgICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ0lETEUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WSA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBjb25zdCBzbmFwVGhyZXNob2xkID0gMzI7XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmIGR4ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKHBvcy54LCBuZXh0WSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWCA9IE1hdGguZmxvb3IoKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRYID0gY3VycmVudFRpbGVYICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlggPSBwb3MueCAtIHRhcmdldFg7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlgpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gLU1hdGguc2lnbihkaWZmWCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmIGR5ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKG5leHRYLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWSA9IE1hdGguZmxvb3IoKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRZID0gY3VycmVudFRpbGVZICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlkgPSBwb3MueSAtIHRhcmdldFk7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlkpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gLU1hdGguc2lnbihkaWZmWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFhBZnRlclNuYXAgPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZQWZ0ZXJTbmFwID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiAhaXNCbG9ja2VkKG5leHRYQWZ0ZXJTbmFwLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnggPSBuZXh0WEFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiAhaXNCbG9ja2VkKHBvcy54LCBuZXh0WUFmdGVyU25hcCwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnkgPSBuZXh0WUFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlbC5pc01vdmluZyA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ1JVTic7XG4gICAgICAgIH1cblxuICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG5cbiAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpIHtcbiAgICBjb25zdCBzdGVwID0gdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICBpZiAocG9zLnggPCBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWluKHBvcy54ICsgc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH0gZWxzZSBpZiAocG9zLnggPiBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWF4KHBvcy54IC0gc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH1cblxuICAgIGlmIChwb3MueSA8IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5taW4ocG9zLnkgKyBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfSBlbHNlIGlmIChwb3MueSA+IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5tYXgocG9zLnkgLSBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfVxuXG4gICAgdmVsLmlzTW92aW5nID1cbiAgICAgICAgcG9zLnggIT09IHBvcy50YXJnZXRYIHx8XG4gICAgICAgIHBvcy55ICE9PSBwb3MudGFyZ2V0WTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkKHgsIHksIG1hcERhdGEsIHRpbGVTaXplLCBwbGF5ZXJTaXplID0gdGlsZVNpemUpIHtcbiAgICBjb25zdCBwYWRkaW5nID0gNDtcblxuICAgIGNvbnN0IGxlZnQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgcmlnaHQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHRvcCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCBib3R0b20gPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgYm90dG9tLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCBib3R0b20sIG1hcERhdGEpXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkQ2VsbCh4LCB5LCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbCA9IG1hcERhdGFbeV0gJiYgbWFwRGF0YVt5XVt4XTtcblxuICAgIHJldHVybiBjZWxsICE9PSAwICYmIGNlbGwgIT09IDI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcG93ZXJVcFN5c3RlbSh3b3JsZCwgb25Qb3dlclVwUGlja2VkKSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdQbGF5ZXInKTtcbiAgICBjb25zdCBwb3dlclVwcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKCFwUG9zIHx8ICF2ZWwgfHwgIXBsYXllcikgY29udGludWU7XG5cbiAgICAgICAgZm9yIChjb25zdCBwVXBFbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwVXAgPSB3b3JsZC5nZXRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCF1cFBvcyB8fCAhcFVwIHx8IHBVcC5waWNrZWRVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIC8vIEdyaWQtYmFzZWQgY29sbGlzaW9uOiBwbGF5ZXIgZ3JpZCBwb3NpdGlvbiBtYXRjaGVzIHBvd2VyLXVwIGdyaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIChwUG9zLmdyaWRYID09PSB1cFBvcy5ncmlkWCAmJiBwUG9zLmdyaWRZID09PSB1cFBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIHBVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgZGlmZmVyZW50IHBvd2VyLXVwIHR5cGVzXG4gICAgICAgICAgICAgICAgaWYgKHBVcC50eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlbC5zcGVlZCA9IE1hdGgubWluKHZlbC5zcGVlZCArIDEsIDgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5saXZlcyArPSAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcG93ZXItdXAncyBET00gZWxlbWVudCBmcm9tIHRoZSBzY3JlZW5cbiAgICAgICAgICAgICAgICBpZiAocFVwLmVsICYmIHBVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gTm90aWZ5IGdhbWUuanMgdmlhIGNhbGxiYWNrIChoYW5kbGVzIEhVRCB1cGRhdGUgKyBzZXJ2ZXIgc3luYylcbiAgICAgICAgICAgICAgICAvLyBDUklUSUNBTDogVGhpcyB0cmlnZ2VycyB1cGRhdGVIdWRTdGF0cywgTk9UIG9uUGxheWVySHVydFxuICAgICAgICAgICAgICAgIGlmIChvblBvd2VyVXBQaWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb25Qb3dlclVwUGlja2VkKHBsYXllci5pZCwgcFVwLnR5cGUsIHVwUG9zLmdyaWRYLCB1cFBvcy5ncmlkWSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRGVzdHJveSB0aGUgcG93ZXItdXAgZW50aXR5IGZyb20gdGhlIHdvcmxkIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShwVXBFbnRpdHkpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbSEVBUlQgREVTVFJPWUVEXSBIZWFydCBlbnRpdHkgcmVtb3ZlZCBmcm9tIHdvcmxkIGF0ICgke3VwUG9zLmdyaWRYfSwgJHt1cFBvcy5ncmlkWX0pYCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGF3blBvd2VyVXAod29ybGQsIGd4LCBneSwgY29udGFpbmVyLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3Qgc2VlZCA9IGd4ICogNzM4NTYwOTMgXiBneSAqIDE5MzQ5NjYzO1xuICAgIGNvbnN0IHNlZWRSYW5kb20gPSAoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCkgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQpICogMTAwMDApO1xuICAgIFxuICAgIGlmIChzZWVkUmFuZG9tID4gMC4zNSkgcmV0dXJuO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbJ1NQRUVEJywgJ0JPTUJTJywgJ0ZMQU1FJ107XG4gICAgY29uc3QgdHlwZUluZGV4ID0gTWF0aC5mbG9vcigoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDAgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwKSkgKiB0eXBlcy5sZW5ndGgpO1xuICAgIGNvbnN0IHJhbmRvbVR5cGUgPSB0eXBlc1t0eXBlSW5kZXhdO1xuXG4gICAgY29uc3QgcFVwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWDogZ3gsIGdyaWRZOiBneSwgeDogZ3ggKiB0aWxlU2l6ZSwgeTogZ3kgKiB0aWxlU2l6ZSB9KTtcbiAgICBcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gYHBvd2VydXAgcG93ZXJ1cC0ke3JhbmRvbVR5cGUudG9Mb3dlckNhc2UoKX1gO1xuICAgIGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSBgJHtneCAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUudG9wID0gYCR7Z3kgKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJywgeyB0eXBlOiByYW5kb21UeXBlLCBlbDogZGl2IH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclN5c3RlbSh3b3JsZCwgZHQsIG5vdywgYW5pbVJvd3MpIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdSZW5kZXJhYmxlJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuXG4gICAgICAgIGlmICghcmVuZGVyYWJsZS5lbCkgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSByZW5kZXJhYmxlLnN0YXRlO1xuICAgICAgICBjb25zdCB0YXJnZXRSb3cgPSBhbmltUm93c1tzdGF0ZV1bdmVsLmRpcmVjdGlvbl07XG4gICAgICAgIFxuICAgICAgICAvLyBSZXNldCBhbmltYXRpb24gd2hlbiByb3cgb3Igc3RhdGUgY2hhbmdlc1xuICAgICAgICBpZiAocmVuZGVyYWJsZS5yb3cgIT09IHRhcmdldFJvdyB8fCByZW5kZXJhYmxlLmxhc3RTdGF0ZSAhPT0gc3RhdGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUucm93ID0gdGFyZ2V0Um93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0U3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZyYW1lQ291bnQgPSBzdGF0ZSA9PT0gJ1JVTicgPyByZW5kZXJhYmxlLnJ1bkZyYW1lcyA6IHJlbmRlcmFibGUuaWRsZUZyYW1lcztcbiAgICAgICAgY29uc3QgZnJhbWVEZWxheSA9IHN0YXRlID09PSAnUlVOJyA/IDEwMDAgLyByZW5kZXJhYmxlLmZwcyA6IDEwMDAgLyByZW5kZXJhYmxlLmlkbGVGcHM7XG5cbiAgICAgICAgaWYgKG5vdyAtIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA+IGZyYW1lRGVsYXkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICsgMSkgJSBmcmFtZUNvdW50O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zWCA9IC0ocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKiByZW5kZXJhYmxlLmZyYW1lV2lkdGgpO1xuICAgICAgICBjb25zdCBwb3NZID0gLShyZW5kZXJhYmxlLnJvdyAqIHJlbmRlcmFibGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBgJHtwb3NYfXB4ICR7cG9zWX1weGA7XG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7cG9zLnh9cHgsICR7cG9zLnl9cHgsIDApYDtcbiAgICB9XG59XG4iLCIvLyAvc3JjL2Vjcy93b3JsZC5qc1xuXG5leHBvcnQgY2xhc3MgV29ybGQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm5leHRFbnRpdHlJZCA9IDA7XG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IG5ldyBNYXAoKTsgXG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuICAgIH1cblxuICAgIGNyZWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5uZXh0RW50aXR5SWQrKztcbiAgICAgICAgdGhpcy5lbnRpdGllcy5hZGQoZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG5cbiAgICBkZXN0cm95RW50aXR5KGVudGl0eSkge1xuICAgICAgICB0aGlzLmVudGl0aWVzLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICBmb3IgKGNvbnN0IFtjb21wb25lbnROYW1lLCBjb21wb25lbnRNYXBdIG9mIHRoaXMuY29tcG9uZW50cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERhdGEgPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zZXQoY29tcG9uZW50TmFtZSwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpLnNldChlbnRpdHksIGNvbXBvbmVudERhdGEpO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE1hcCA/IGNvbXBvbmVudE1hcC5nZXQoZW50aXR5KSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZW1vdmVDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIGlmIChjb21wb25lbnRNYXApIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHF1ZXJ5KC4uLmNvbXBvbmVudE5hbWVzKSB7XG4gICAgICAgIGlmIChjb21wb25lbnROYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpcnN0TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1swXSk7XG4gICAgICAgIGlmICghZmlyc3RNYXApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZmlyc3RNYXAua2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgaGFzQWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY29tcG9uZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcCB8fCAhbWFwLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0FsbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzQWxsICYmIHRoaXMuZW50aXRpZXMuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRTeXN0ZW0oc3lzdGVtRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zeXN0ZW1zLnB1c2goc3lzdGVtRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHVwZGF0ZShkdCwgbm93KSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3lzdGVtIG9mIHRoaXMuc3lzdGVtcykge1xuICAgICAgICAgICAgc3lzdGVtKHRoaXMsIGR0LCBub3cpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdpbk1lbnUocHJvcHMpIHtcbiAgICBjb25zdCB3aW5uZXJOYW1lID0gcHJvcHMud2lubmVyTmFtZSB8fCBcIkEgUGxheWVyXCI7XG5cbiAgICBjb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbiAgICByZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgLy8gRXhwbGljaXRseSBjbG9zZSB0aGUgb2xkIFdlYlNvY2tldCB0byBwcmV2ZW50IHpvbWJpZSBjb25uZWN0aW9uc1xuICAgICAgICBpZiAod2luZG93LnNvY2tldCkgeyBcbiAgICAgICAgICAgIHdpbmRvdy5zb2NrZXQuY2xvc2UoKTsgXG4gICAgICAgICAgICB3aW5kb3cuc29ja2V0ID0gbnVsbDsgXG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYXJkIHJlbG9hZCB0byB3aXBlIEpTIG1lbW9yeSBhbmQgc3RhcnQgZnJvbSBhIGNsZWFuIHNsYXRlXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgICAgICA8aDE+e3dpbm5lck5hbWUudG9VcHBlckNhc2UoKX0gV09OITwvaDE+XG4gICAgICAgICAgICA8cD5UaGUgbGFzdCBwbGF5ZXIgc3RhbmRpbmcgdGFrZXMgdGhlIGNyb3duLjwvcD5cbiAgICAgICAgICAgIHtyZXBsYXlCdG59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBHUklEX0JPUkRFUl9TSVpFID0gNjtcbmNvbnN0IEdBTUVfQ0hST01FX1dJRFRIID0gNzI7XG5jb25zdCBHQU1FX0NIUk9NRV9IRUlHSFQgPSAxNTA7XG5cbmNvbnN0IGltYWdlcyA9IHtcbiAgICAyOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIixcbiAgICAzOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja193YWxsLnBuZ1wiLFxuICAgIDQ6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2V4cGxvaXQucG5nXCIsXG59O1xuXG5jb25zdCBbcGxheWVyTmFtZSwgc2V0UGxheWVyTmFtZV0gPSBjcmVhdGVTaWduYWwoXCJQbGF5ZXIgMVwiKTtcbmNvbnN0IFtsaXZlcywgc2V0TGl2ZXNdID0gY3JlYXRlU2lnbmFsKDMpO1xuY29uc3QgW3NwZWVkLCBzZXRTcGVlZF0gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbYm9tYnMsIHNldEJvbWJzXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtyYW5nZSwgc2V0UmFuZ2VdID0gY3JlYXRlU2lnbmFsKDEpO1xuZXhwb3J0IHsgc2V0UGxheWVyTmFtZSwgc2V0TGl2ZXMsIHNldFNwZWVkLCBzZXRCb21icywgc2V0UmFuZ2UgfTtcblxuY29uc3QgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IG5hbWVFbC50ZXh0Q29udGVudCA9IHBsYXllck5hbWUoKTsgfSk7XG5cbmNvbnN0IGxpdmVzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGxpdmVzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHNwZWVkRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHNwZWVkLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IGJvbWJzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGJvbWJzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHJhbmdlRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHJhbmdlLXZhbHVlXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbGl2ZXNFbC50ZXh0Q29udGVudCA9IGxpdmVzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgc3BlZWRFbC50ZXh0Q29udGVudCA9IHNwZWVkKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgYm9tYnNFbC50ZXh0Q29udGVudCA9IGJvbWJzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgcmFuZ2VFbC50ZXh0Q29udGVudCA9IHJhbmdlKCk7IH0pO1xuXG5mdW5jdGlvbiBHYW1lKHsgZ3JpZCB9KSB7XG4gICAgY29uc3QgYm9hcmRXaWR0aCA9IGdyaWRbMF0ubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gZ3JpZC5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRPdXRlcldpZHRoID0gYm9hcmRXaWR0aCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJIZWlnaHQgPSBib2FyZEhlaWdodCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRXaWR0aCA6IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGJvYXJkSGVpZ2h0IDogd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHNjYWxlID0gTWF0aC5taW4oXG4gICAgICAgIDEsXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0V2lkdGggLSBHQU1FX0NIUk9NRV9XSURUSCkgLyBib2FyZE91dGVyV2lkdGgpLFxuICAgICAgICBNYXRoLm1heCgwLjIsICh2aWV3cG9ydEhlaWdodCAtIEdBTUVfQ0hST01FX0hFSUdIVCkgLyBib2FyZE91dGVySGVpZ2h0KVxuICAgICk7XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBncmlkLmxlbmd0aDsgcm93SW5kZXgrKykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgZ3JpZFtyb3dJbmRleF0ubGVuZ3RoOyBjb2xJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZ3JpZFtyb3dJbmRleF1bY29sSW5kZXhdO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IFwidGlsZVwiO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gYHdpZHRoOiR7VElMRV9TSVpFfXB4O2hlaWdodDoke1RJTEVfU0laRX1weDtgO1xuXG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMiB8fCBjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtZmxvb3JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtd2FsbFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1szXX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzRdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDAgfHwgY2VsbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1syXX0pYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2VsbHMucHVzaCg8ZGl2IGNsYXNzPXtjbGFzc05hbWV9IGRhdGEteD17Y29sSW5kZXh9IGRhdGEteT17cm93SW5kZXh9IHN0eWxlPXtzdHlsZX0+PC9kaXY+KTtcbiAgICAgICAgfVxuICAgICAgICByb3dzLnB1c2goPGRpdiBjbGFzcz1cImdyaWQtcm93XCI+e2NlbGxzfTwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1nbGFzc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1iYXJcIj5cbiAgICAgICAgICAgICAgICAgICAge25hbWVFbH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLXN0YXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkxpdmVzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsaXZlc0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlNwZWVkPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzcGVlZEVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkJvbWJzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib21ic0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlJhbmdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyYW5nZUVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWJvYXJkLWZyYW1lXCIgc3R5bGU9e2B3aWR0aDoke2JvYXJkT3V0ZXJXaWR0aCAqIHNjYWxlfXB4O2hlaWdodDoke2JvYXJkT3V0ZXJIZWlnaHQgKiBzY2FsZX1weDtgfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJnYW1lLWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImdhbWUtZ3JpZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17YHBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiR7Ym9hcmRXaWR0aH1weDtoZWlnaHQ6JHtib2FyZEhlaWdodH1weDt0cmFuc2Zvcm06c2NhbGUoJHtzY2FsZX0pO2B9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCBDaGF0UGxheWVycyBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmxldCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gY3JlYXRlU2lnbmFsKHt9KTtcbmV4cG9ydCB7IHNldFN0YXRlcyB9O1xuXG5sZXQgcm9vbUlkRWwgPSA8cD5Sb29tIElEOiA8L3A+O1xubGV0IHBsYXllcnNFbCA9IDxwPlBsYXllcnM6ICAvIDQ8L3A+O1xubGV0IHRleHRFbCA9IDxwPjwvcD47XG5sZXQgdGltZXJFbCA9IDxwPlRpbWVyOiA8L3A+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHMgPSBzdGF0ZXMoKTtcbiAgICByb29tSWRFbC50ZXh0Q29udGVudCA9IGBSb29tIElEOiAke3Mucm9vbUlkfWA7XG4gICAgcGxheWVyc0VsLnRleHRDb250ZW50ID0gYFBsYXllcnM6ICR7cy5wbGF5ZXJzQ291bnR9IC8gNGA7XG4gICAgdGV4dEVsLnRleHRDb250ZW50ID0gcy50ZXh0IHx8IFwiXCI7XG5cbiAgICBpZiAocy5nYW1lU3RhcnRlZCkge1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gXCJUaW1lcjogR2FtZSBzdGFydGVkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGltZXJUZXh0ID0gKCFzLnNlY29uZHNMZWZ0KSA/IFwiV2FpdGluZyBmb3Igb25lIG1vcmUgcGxheWVyXCIgOiBgJHtzLnNlY29uZHNMZWZ0fSBzZWNvbmRzYDtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IGBUaW1lcjogJHt0aW1lclRleHR9YDtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gTG9iYnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbmF0aW5lci1sb2JieVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYmJ5LWJveFwiPlxuICAgICAgICAgICAgICAgIDxoMT5Mb2JieTwvaDE+XG4gICAgICAgICAgICAgICAge3Jvb21JZEVsfVxuICAgICAgICAgICAgICAgIHtwbGF5ZXJzRWx9XG4gICAgICAgICAgICAgICAge3RleHRFbH1cbiAgICAgICAgICAgICAgICB7dGltZXJFbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPENoYXRQbGF5ZXJzIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG5yZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5sZXQgbWVudUVsID0gKFxuICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICA8aDE+WW91IFdpbiE8L2gxPlxuICAgICAgICA8cD5BbGwgb3RoZXIgcGxheWVycyBoYXZlIGxlZnQgdGhlIGdhbWUuPC9wPlxuICAgICAgICB7cmVwbGF5QnRufVxuICAgIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVudSgpIHtcbiAgICByZXR1cm4gbWVudUVsO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcblxuZnVuY3Rpb24gUmVnaXN0ZXIoeyB3c3MgfSkge1xuICAgIGxldCBzdWJtaXR0ZWQgPSBmYWxzZTtcblxuICAgIGxldCBwbGF5ZXJFbnRlciA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHN1Ym1pdHRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUgfHwgbmlja25hbWUubGVuZ3RoID4gMjApIHJldHVybjtcblxuICAgICAgICBzdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzZXRQbGF5ZXJOYW1lKG5pY2tuYW1lKTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcIm5pY2tuYW1lX29mX3RoZV9wbGF5ZXJcIixcbiAgICAgICAgICAgIG5pY2tuYW1lOiBuaWNrbmFtZVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgb25TdWJtaXQ9e3BsYXllckVudGVyfT5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5pY2tuYW1lLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVudGVyIHlvdXIgbmFtZVwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMucGxheSgpLCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5tdXNpYy5wbGF5KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5tdXNpYy5wYXVzZWQgfHwgdGhpcy5tdXNpYy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9uXCIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUJ1dHRvbigpIHtcbiAgICAgICAgY29uc3QgaXNNdXRlZCA9IHRoaXMubXVzaWMubXV0ZWQgfHwgdGhpcy5tdXNpYy5wYXVzZWQ7XG5cbiAgICAgICAgdGhpcy5pY29uLmNsYXNzTmFtZSA9IGlzTXV0ZWQgPyBcImZhLXNvbGlkIGZhLXZvbHVtZS1vZmZcIiA6IFwiZmEtc29saWQgZmEtdm9sdW1lLWhpZ2hcIjtcbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImlzLW11dGVkXCIsIGlzTXV0ZWQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291bmQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwL2FwcC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwidHlwZSIsInByb3BzIiwiY2hpbGRyZW4iLCJlbGUiLCJkb2N1bWVudCIsImtleSIsInN0YXJ0c1dpdGgiLCJldmVudE5hbWUiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldEF0dHJpYnV0ZSIsImZsYXRDaGlsZHJlbiIsImZsYXQiLCJJbmZpbml0eSIsImFwcGVuZCIsImZpbHRlciIsImNoaWxkIiwidW5kZWZpbmVkIiwicmVuZGVyIiwiZWxlbWVudCIsImNvbnRhaW5lciIsInJlcGxhY2VDaGlsZHJlbiIsIlJvdXRlciIsInJvdXRlciIsImVmZmVjdFN0YWNrIiwiYWN0aXZlRWZmZWN0IiwiY3JlYXRlU2lnbmFsIiwiaW5pdGlhbFZhbHVlIiwidmFsdWUiLCJlZmZlY3RzIiwiU2V0IiwiUmVhZCIsImFkZCIsIldyaXRlIiwibmV3VmFsdWUiLCJmbiIsImZvckVhY2giLCJlZmZlY3QiLCJjcmVhdGVFZmZlY3QiLCJwdXNoIiwicG9wIiwibGVuZ3RoIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInVybCIsIlVSTCIsImhyZWYiLCJsaXN0ZW4iLCJvbkVycm9yNDA0IiwiZXZlbnQiLCJkZXN0aW5hdGlvbiIsImludGVyY2VwdCIsImNvbnNvbGUiLCJsb2ciLCJSZWdpc3RlciIsIkdhbWUiLCJNZW51IiwiTG9iYnkiLCJXaW5NZW51Iiwic2V0U3RhdGVzIiwic2V0UGxheWVyTmFtZSIsInNldEh1ZFBsYXllck5hbWUiLCJTb3VuZCIsInNldE1lc3NhZ2VzIiwiR2FtZUVuZ2luZSIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsIndpbmRvdyIsImhvc3RuYW1lIiwic291bmQiLCJjdXJyZW50R2FtZUVuZ2luZSIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJ3cyIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicXVlcnlTZWxlY3RvciIsInJvb21JZCIsInBsYXllcnNDb3VudCIsInNlY29uZHNMZWZ0IiwidGV4dCIsImdyaWQiLCJzZXRUaW1lb3V0IiwiZ2FtZUNvbnRhaW5lciIsImRlc3Ryb3kiLCJsb2NhbFBsYXllciIsInBsYXllcnMiLCJmaW5kIiwicGxheWVyIiwiaWQiLCJ5b3VyUGxheWVySWQiLCJuaWNrbmFtZSIsImVuZ2luZSIsImVycm9yIiwid2lubmVyTmFtZSIsInByZXYiLCJoYW5kbGVSZW1vdGVNb3ZlIiwicGF5bG9hZCIsImhhbmRsZVJlbW90ZUJvbWIiLCJoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkIiwiaGFuZGxlUmVtb3RlSXRlbVBpY2t1cCIsImVyciIsIm1lc3NhZ2VzIiwiQ2hhdFBsYXllcnMiLCJtZXNzYWdlc0NvbnRhaW5lciIsImNsYXNzIiwibXNncyIsImlubmVySFRNTCIsIm1zZyIsInAiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsImdldCIsInRyaW0iLCJyZXNldCIsInNlbmQiLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlBvc2l0aW9uQ29tcG9uZW50IiwiZ3giLCJneSIsInRpbGVTaXplIiwiZ3JpZFgiLCJncmlkWSIsIngiLCJ5IiwidGFyZ2V0WCIsInRhcmdldFkiLCJWZWxvY2l0eUNvbXBvbmVudCIsImJhc2VTcGVlZCIsInNwZWVkIiwiaXNNb3ZpbmciLCJkaXJlY3Rpb24iLCJJbnB1dENvbXBvbmVudCIsImlucHV0UXVldWUiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiZWwiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJ0b3RhbEZyYW1lcyIsImZwcyIsImN1cnJlbnRGcmFtZSIsInJ1bkZyYW1lcyIsImlkbGVGcmFtZXMiLCJpZGxlRnBzIiwibGFzdEZyYW1lVGltZSIsInJvdyIsInN0YXRlIiwibGFzdFN0YXRlIiwiUGxheWVyQ29tcG9uZW50IiwiY2hhclR5cGUiLCJpc0xvY2FsIiwiQm9tYkNvbXBvbmVudCIsIm93bmVySWQiLCJ0aW1lciIsInJhbmdlIiwiZXhwbG9kZWQiLCJFeHBsb3Npb25Db21wb25lbnQiLCJkdXJhdGlvbiIsIlBvd2VyVXBDb21wb25lbnQiLCJwaWNrZWRVcCIsIkJlaGF2aW9yQ29tcG9uZW50IiwiZ2hvc3RNb2RlIiwidGhyb3dhYmxlIiwiZGV0b25hdG9yIiwiZmFzdFNob2VzTGV2ZWwiLCJib21icyIsIm1heCIsImN1cnJlbnQiLCJXb3JsZCIsIm1vdmVtZW50U3lzdGVtIiwicmVuZGVyU3lzdGVtIiwiYm9tYlN5c3RlbSIsImRhbWFnZVN5c3RlbSIsImNoZWNrR2FtZUVuZENvbmRpdGlvbnMiLCJzcGF3bkhlYXJ0UG93ZXJVcCIsInBvd2VyVXBTeXN0ZW0iLCJzcGF3blBvd2VyVXAiLCJzZXRCb21icyIsInNldExpdmVzIiwic2V0UmFuZ2UiLCJzZXRTcGVlZCIsIlRJTEVfU0laRSIsIkFOSU1BVElPTl9ST1dTIiwiUlVOIiwidXAiLCJsZWZ0IiwiZG93biIsInJpZ2h0IiwiSURMRSIsImNvbnN0cnVjdG9yIiwiY2FudmFzQ29udGFpbmVyIiwibWFwRGF0YSIsInNvY2tldCIsIndvcmxkIiwibG9jYWxQbGF5ZXJFbnRpdHkiLCJwbGF5ZXJFbnRpdGllcyIsIk1hcCIsInBsYXllckluZm8iLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibG9zc01vZGFsVHJpZ2dlcmVkIiwiaW5wdXRFbmFibGVkIiwiZ2FtZUVuZGVkIiwibG9jYWxQbGF5ZXJJZCIsImFsbFBsYXllcnMiLCJ0b3RhbFBsYXllcnMiLCJub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCIsIlN0cmluZyIsInBEYXRhIiwicGxheWVySWQiLCJwbGF5ZXJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJzZXQiLCJwbGF5ZXJEaXYiLCJjb2xvciIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ3aWxsQ2hhbmdlIiwic3giLCJzeSIsImFkZENvbXBvbmVudCIsInBsYXllckNvbXAiLCJsaXZlcyIsIm1heEJvbWJzIiwiYm9tYlJhbmdlIiwidXBkYXRlSHVkU3RhdHMiLCJzZXR1cElucHV0Iiwid2FybiIsIm1hcCIsInJlZ2lzdGVyU3lzdGVtcyIsInBlcmZvcm1hbmNlIiwibm93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZ2FtZUxvb3AiLCJpbnB1dCIsImdldENvbXBvbmVudCIsImdldEtleURpcmVjdGlvbiIsImhhbmRsZUtleURvd24iLCJkaXIiLCJpbmNsdWRlcyIsImNvZGUiLCJkcm9wQm9tYiIsImhhbmRsZUtleVVwIiwiZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJwb3MiLCJjdXJyZW50Qm9tYnMiLCJxdWVyeSIsImJFbnRpdHkiLCJjcmVhdGVkIiwiY3JlYXRlQm9tYiIsInJlYWR5U3RhdGUiLCJPUEVOIiwiZXhpc3RzIiwic29tZSIsImVudGl0eSIsImJvbWIiLCJib21iRW50aXR5IiwiYm9tYkRpdiIsInRvcCIsImJvbWJDb21wIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsInZlbCIsInJlbmRlcmFibGUiLCJyZW1vdmVQb3dlclVwQXQiLCJhcHBseVBvd2VyVXAiLCJuZXdMaXZlcyIsInBvd2VyVXBzIiwicG93ZXJVcCIsInBhcmVudE5vZGUiLCJkZXN0cm95RW50aXR5IiwidmVsb2NpdHkiLCJNYXRoIiwibWluIiwidXBkYXRlTWFwQ2VsbCIsInRpbGUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJkZXN0cm95Qm94Q2FsbGJhY2siLCJoYXMiLCJvblBsYXllckh1cnQiLCJyZW1haW5pbmdMaXZlcyIsIm9uUG93ZXJVcFBpY2tlZCIsImJyb2FkY2FzdE1vdmVtZW50IiwiYWRkU3lzdGVtIiwidyIsImR0IiwidXBkYXRlIiwibmV4dE5vdyIsImhhbmRsZUdhbWVPdmVyIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJyb3VuZCIsImN1cnJlbnRMb2NhbFBsYXllck5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZ2V0UGxheWVyTmFtZSIsImdldEl0ZW0iLCJhZmZlY3RlZENlbGxzIiwiY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMiLCJjZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2Iiwid2lkdGgiLCJoZWlnaHQiLCJleHBsb3Npb25zIiwiZXhwIiwiYngiLCJieSIsImNlbGxzIiwiZGlyZWN0aW9ucyIsInN0ZXBzIiwiaSIsInR4IiwidHkiLCJjZWxsVHlwZSIsImhlYXJ0RW50aXR5IiwiaGVhcnREaXYiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiZm9udFNpemUiLCJoYW5kbGVQbGF5ZXJEZWF0aCIsImRlYXRoR3JpZFgiLCJmbG9vciIsImRlYXRoR3JpZFkiLCJyZW1vdmVDb21wb25lbnQiLCJwUG9zIiwiaW52aW5jaWJsZVVudGlsIiwiZVBvcyIsInBsYXllckdyaWRYIiwicGxheWVyR3JpZFkiLCJwcmV2aW91c0xpdmVzIiwiYWxyZWFkeVJlcG9ydGVkRGVhZCIsImVudGl0aWVzIiwiZGVsdGEiLCJQTEFZRVJfU0laRSIsImJlaGF2aW9yIiwibW92ZVRvd2FyZFRhcmdldCIsImFjdGl2ZUlucHV0IiwiZHgiLCJkeSIsImhhc0lucHV0IiwibmV4dFgiLCJuZXh0WSIsInNuYXBUaHJlc2hvbGQiLCJpc0Jsb2NrZWQiLCJjdXJyZW50VGlsZVgiLCJkaWZmWCIsImFicyIsInNpZ24iLCJjdXJyZW50VGlsZVkiLCJkaWZmWSIsIm5leHRYQWZ0ZXJTbmFwIiwibmV4dFlBZnRlclNuYXAiLCJzdGVwIiwicGxheWVyU2l6ZSIsInBhZGRpbmciLCJib3R0b20iLCJpc0Jsb2NrZWRDZWxsIiwicFVwRW50aXR5IiwidXBQb3MiLCJwVXAiLCJzZWVkIiwic2VlZFJhbmRvbSIsInNpbiIsInR5cGVzIiwidHlwZUluZGV4IiwicmFuZG9tVHlwZSIsImRpdiIsImFuaW1Sb3dzIiwidGFyZ2V0Um93IiwiZnJhbWVDb3VudCIsImZyYW1lRGVsYXkiLCJwb3NYIiwicG9zWSIsImJhY2tncm91bmRQb3NpdGlvbiIsInRyYW5zZm9ybSIsIm5leHRFbnRpdHlJZCIsImNvbXBvbmVudHMiLCJzeXN0ZW1zIiwiZGVsZXRlIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudE1hcCIsImVudHJpZXMiLCJjb21wb25lbnREYXRhIiwiY29tcG9uZW50TmFtZXMiLCJmaXJzdE1hcCIsInJlc3VsdHMiLCJoYXNBbGwiLCJzeXN0ZW1GdW5jdGlvbiIsInN5c3RlbSIsInJlcGxheUJ0biIsImNsb3NlIiwidG9VcHBlckNhc2UiLCJHUklEX0JPUkRFUl9TSVpFIiwiR0FNRV9DSFJPTUVfV0lEVEgiLCJHQU1FX0NIUk9NRV9IRUlHSFQiLCJpbWFnZXMiLCJwbGF5ZXJOYW1lIiwibmFtZUVsIiwibGl2ZXNFbCIsInNwZWVkRWwiLCJib21ic0VsIiwicmFuZ2VFbCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImJvYXJkT3V0ZXJXaWR0aCIsImJvYXJkT3V0ZXJIZWlnaHQiLCJ2aWV3cG9ydFdpZHRoIiwiaW5uZXJXaWR0aCIsInZpZXdwb3J0SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJzY2FsZSIsInJvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4Iiwic3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsImdhbWVTdGFydGVkIiwidGltZXJUZXh0IiwicmVsb2FkIiwibWVudUVsIiwic3VibWl0dGVkIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImJ1dHRvbiIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwicGxheSIsIm9uY2UiLCJ1cGRhdGVCdXR0b24iLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiXSwic291cmNlUm9vdCI6IiJ9