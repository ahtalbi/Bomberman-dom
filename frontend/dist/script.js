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
/* harmony import */ var _ecs_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../ecs/systems/damageSystem.js */ "./src/ecs/systems/damageSystem.js");













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
    case "lobby_reset":
      if (currentGameEngine) {
        currentGameEngine.destroy();
        currentGameEngine = null;
      }
      document.body.className = "lobby-page";
      if (!root.querySelector(".conatiner-lobby")) {
        (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_lobby__WEBPACK_IMPORTED_MODULE_5__["default"], null), root);
      }
      (0,_pages_lobby__WEBPACK_IMPORTED_MODULE_5__.setStates)({
        roomId: "",
        playersCount: 1,
        secondsLeft: 10,
        text: "Waiting for more players"
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
      root.innerHTML = '';
      root.appendChild((0,_pages_WinMenu_jsx__WEBPACK_IMPORTED_MODULE_6__["default"])({
        winnerName: message.winnerName
      }));
      break;
    case "player_turned_heart":
      if (currentGameEngine) {
        const entity = currentGameEngine.playerEntities.get(String(message.playerId));
        if (entity !== undefined) {
          (0,_ecs_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_10__.handlePlayerDeath)(currentGameEngine.world, entity, 64);
          currentGameEngine.world.destroyEntity(entity);
          currentGameEngine.playerEntities.delete(String(message.playerId));
        }
      }
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
      if (pData.disconnected) {
        return;
      }
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
/* harmony export */   handlePlayerDeath: () => (/* binding */ handlePlayerDeath),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QsRTs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL2RvbS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29yay5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5LmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jaGF0LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2NvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9ib21iU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL21vdmVtZW50U3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy93b3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvV2luTWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2dhbWUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9sb2JieS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yZWdpc3Rlci5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3NvdW5kLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCBwcm9wcywgLi4uY2hpbGRyZW4pIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gdHlwZSh7IC4uLihwcm9wcyB8fCB7fSksIGNoaWxkcmVuIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcyB8fCB7fSkge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJvblwiKSAmJiB0eXBlb2YgcHJvcHNba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBrZXkuc2xpY2UoMikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGUuc2V0QXR0cmlidXRlKGtleSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmbGF0Q2hpbGRyZW4gPSBjaGlsZHJlbi5mbGF0KEluZmluaXR5KTtcbiAgICBlbGUuYXBwZW5kKC4uLmZsYXRDaGlsZHJlbi5maWx0ZXIoY2hpbGQgPT4gY2hpbGQgIT09IG51bGwgJiYgY2hpbGQgIT09IHVuZGVmaW5lZCAmJiBjaGlsZCAhPT0gZmFsc2UpKTtcblxuICAgIHJldHVybiBlbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgY29udGFpbmVyLnJlcGxhY2VDaGlsZHJlbihlbGVtZW50KTtcbn1cbiIsImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCIuL3JvdXRlci5qc1wiO1xuXG5sZXQgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7IiwiY29uc3QgZWZmZWN0U3RhY2sgPSBbXTtcbmxldCBhY3RpdmVFZmZlY3QgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2lnbmFsKGluaXRpYWxWYWx1ZSkge1xuICAgbGV0IHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgY29uc3QgZWZmZWN0cyA9IG5ldyBTZXQoKTtcblxuICAgY29uc3QgUmVhZCA9ICgpID0+IHtcbiAgICAgIGlmIChhY3RpdmVFZmZlY3QpIHtcbiAgICAgICAgIGVmZmVjdHMuYWRkKGFjdGl2ZUVmZmVjdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICB9XG5cbiAgIGNvbnN0IFdyaXRlID0gKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgIGxldCBmbiA9IG5ld1ZhbHVlO1xuICAgICAgICAgdmFsdWUgPSBmbih2YWx1ZSk7XG4gICAgICB9IFxuICAgICAgZWxzZSB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgZWZmZWN0cy5mb3JFYWNoKGVmZmVjdCA9PiBlZmZlY3QoKSk7XG4gICB9XG5cbiAgIHJldHVybiBbUmVhZCwgV3JpdGVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWZmZWN0KGVmZmVjdCkge1xuICAgZWZmZWN0U3RhY2sucHVzaChlZmZlY3QpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0O1xuICAgZWZmZWN0KCk7XG4gICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdFN0YWNrW2VmZmVjdFN0YWNrLmxlbmd0aCAtIDFdIHx8IG51bGw7XG59XG4iLCJleHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgICAjUm91dGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAjRmlyc3RSZXNvbHZlID0gZmFsc2U7XG5cbiAgICBvbihwYXRoLCBoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuI1JvdXRlc1twYXRoXSA9IGhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBcbiAgICBuYXZpZ2F0ZShwYXRoLCB7IGhpc3RvcnkgPSBcInB1c2hcIiB9ID0ge30pIHtcbiAgICAgICAgcGF0aCA9IHBhdGguc3RhcnRzV2l0aChcIi9cIikgPyBwYXRoIDogXCIvXCIgKyBwYXRoO1xuICAgICAgICByZXR1cm4gbmF2aWdhdGlvbi5uYXZpZ2F0ZShwYXRoLCB7IGhpc3RvcnkgfSk7XG4gICAgfVxuICAgIFxuICAgIHJlc29sdmUocGF0aCA9IGxvY2F0aW9uLnBhdGhuYW1lKSB7XG4gICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3BhdGhdO1xuXG4gICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZuKHsgdXJsOiBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBsaXN0ZW4ob25FcnJvcjQwNCkge1xuICAgICAgICBuYXZpZ2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJuYXZpZ2F0ZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoZXZlbnQuZGVzdGluYXRpb24udXJsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXZlbnQuaW50ZXJjZXB0KHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybC5wYXRobmFtZSwgdGhpcy4jUm91dGVzKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1t1cmwucGF0aG5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yNDA0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm4oeyB1cmwgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdGhpcy4jRmlyc3RSZXNvbHZlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHRoaXMuI0ZpcnN0UmVzb2x2ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHJlbmRlciB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrXCI7XG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCBXaW5NZW51IGZyb20gXCIuLi9wYWdlcy9XaW5NZW51LmpzeFwiO1xuaW1wb3J0IHsgc2V0U3RhdGVzIH0gZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRQbGF5ZXJOYW1lIGFzIHNldEh1ZFBsYXllck5hbWUgfSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IFNvdW5kIGZyb20gXCIuLi91dGlscy9zb3VuZFwiO1xuaW1wb3J0IHsgc2V0TWVzc2FnZXMgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjsgXG5pbXBvcnQgeyBoYW5kbGVQbGF5ZXJEZWF0aCB9IGZyb20gXCIuLi9lY3Mvc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanNcIjsgXG5cbmNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIik7XG5jb25zdCB3c3MgPSBuZXcgV2ViU29ja2V0KGB3czovLyR7d2luZG93LmxvY2F0aW9uLmhvc3RuYW1lfTo1MDAwYCk7XG5jb25zdCBzb3VuZCA9IG5ldyBTb3VuZChcIi4vYXNzZXRzL3NvdW5kcy9iYWNrZ3JvdW5kX211c2ljLm1wM1wiKTtcbmxldCBjdXJyZW50R2FtZUVuZ2luZSA9IG51bGw7XG5cbnNvdW5kLmluaXQoKTtcblxucm91dGVyLm9uKFwiL1wiLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcInJlZ2lzdGVyLXBhZ2VcIjtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKHdzKSA9PiB7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJyb29tX3VwZGF0ZVwiOlxuICAgICAgICBjYXNlIFwibG9iYnlfdGltZXJcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJsb2JieS1wYWdlXCI7XG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb25hdGluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXRlcyh7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IG1lc3NhZ2UucGxheWVyc0NvdW50LFxuICAgICAgICAgICAgICAgIHNlY29uZHNMZWZ0OiBtZXNzYWdlLnNlY29uZHNMZWZ0LFxuICAgICAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UudGV4dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImxvYmJ5X3Jlc2V0XCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImxvYmJ5LXBhZ2VcIjtcbiAgICAgICAgICAgIGlmICghcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmNvbmF0aW5lci1sb2JieVwiKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcig8TG9iYnkgLz4sIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IFwiXCIsXG4gICAgICAgICAgICAgICAgcGxheWVyc0NvdW50OiAxLFxuICAgICAgICAgICAgICAgIHNlY29uZHNMZWZ0OiAxMCxcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIldhaXRpbmcgZm9yIG1vcmUgcGxheWVyc1wiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZ2FtZV9zdGFydGVkXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwiZ2FtZS1wYWdlXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlbmRlcig8R2FtZSBncmlkPXttZXNzYWdlLmdyaWR9IC8+LCByb290KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFBsYXllciA9IChtZXNzYWdlLnBsYXllcnMgfHwgW10pLmZpbmQocGxheWVyID0+IHBsYXllci5pZCA9PT0gbWVzc2FnZS55b3VyUGxheWVySWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxQbGF5ZXIgJiYgbG9jYWxQbGF5ZXIubmlja25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEh1ZFBsYXllck5hbWUobG9jYWxQbGF5ZXIubmlja25hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5naW5lID0gbmV3IEdhbWVFbmdpbmUoZ2FtZUNvbnRhaW5lciwgbWVzc2FnZS5ncmlkLCB3c3MpO1xuICAgICAgICAgICAgICAgICAgICBlbmdpbmUuaW5pdChtZXNzYWdlLnlvdXJQbGF5ZXJJZCwgbWVzc2FnZS5wbGF5ZXJzIHx8IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gZW5naW5lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJHYW1lIGNvbnRhaW5lciB3YXMgbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJyb29tX2Fsb25lXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPE1lbnUgLz4sIHJvb3QpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfd29uXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChXaW5NZW51KHsgd2lubmVyTmFtZTogbWVzc2FnZS53aW5uZXJOYW1lIH0pKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfdHVybmVkX2hlYXJ0XCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBjdXJyZW50R2FtZUVuZ2luZS5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKG1lc3NhZ2UucGxheWVySWQpKTtcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlUGxheWVyRGVhdGgoY3VycmVudEdhbWVFbmdpbmUud29ybGQsIGVudGl0eSwgNjQpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5wbGF5ZXJFbnRpdGllcy5kZWxldGUoU3RyaW5nKG1lc3NhZ2UucGxheWVySWQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2ICxtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpdGVtX3BpY2tlZFwiOlxuICAgICAgICAgICAgLy8gSGFuZGxlIHJlbW90ZSBoZWFydCBwaWNrdXAgLSB1cGRhdGUgdGhlIHBsYXllcidzIGxpdmVzIG9uIGFsbCBjbGllbnRzXG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVJdGVtUGlja3VwKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvclwiLCBlcnIpO1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdzcztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgd3NzIGZyb20gXCIuLi9hcHAvYXBwXCI7XG5cbmNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gY3JlYXRlU2lnbmFsKFtdKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzIH07XG5cbmZ1bmN0aW9uIENoYXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IG1lc3NhZ2VzQ29udGFpbmVyID0gPGRpdiBjbGFzcz1cIm1lc3NhZ2VzXCI+PC9kaXY+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNncyA9IG1lc3NhZ2VzKCk7XG4gICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgbXNnIG9mIG1zZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBtc2c7XG4gICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG1lc3NhZ2VzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBtc2dzLnVuc2hpZnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBmb3JtRGF0YS5nZXQoXCJtZXNzYWdlXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcImNoYXRfbWVzc2FnZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgfSkpO1xuICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0XCIgb25TdWJtaXQ9e2Jyb2FkY2FzdE1lc3NhZ2V9PlxuICAgICAgICAgICAge21lc3NhZ2VzQ29udGFpbmVyfVxuICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1lc3NhZ2VcIiBwbGFjZWhvbGRlcj1cInR5cGUgdG8gdGhlIG90aGVyIHBsYXllcnMgLi4uXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXRQbGF5ZXJzOyIsIi8vIC9zcmMvZWNzL2NvbXBvbmVudHMuanNcblxuZXhwb3J0IGNvbnN0IFBvc2l0aW9uQ29tcG9uZW50ID0gKGd4LCBneSwgdGlsZVNpemUgPSA2NCkgPT4gKHtcbiAgICBncmlkWDogZ3gsXG4gICAgZ3JpZFk6IGd5LFxuICAgIHg6IGd4ICogdGlsZVNpemUsXG4gICAgeTogZ3kgKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRYOiBneCAqIHRpbGVTaXplLFxuICAgIHRhcmdldFk6IGd5ICogdGlsZVNpemVcbn0pO1xuXG5leHBvcnQgY29uc3QgVmVsb2NpdHlDb21wb25lbnQgPSAoYmFzZVNwZWVkID0gMi41KSA9PiAoe1xuICAgIGJhc2VTcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkOiBiYXNlU3BlZWQsXG4gICAgaXNNb3Zpbmc6IGZhbHNlLFxuICAgIGRpcmVjdGlvbjogJ2Rvd24nXG59KTtcblxuZXhwb3J0IGNvbnN0IElucHV0Q29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBpbnB1dFF1ZXVlOiBbXVxufSk7XG5cbmV4cG9ydCBjb25zdCBSZW5kZXJhYmxlQ29tcG9uZW50ID0gKGVsLCBmcmFtZVdpZHRoID0gNjQsIGZyYW1lSGVpZ2h0ID0gNjQsIHRvdGFsRnJhbWVzID0gNCwgZnBzID0gMTIpID0+ICh7XG4gICAgZWw6IGVsLFxuICAgIGZyYW1lV2lkdGg6IGZyYW1lV2lkdGgsXG4gICAgZnJhbWVIZWlnaHQ6IGZyYW1lSGVpZ2h0LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogdG90YWxGcmFtZXMsXG4gICAgcnVuRnJhbWVzOiA0LFxuICAgIGlkbGVGcmFtZXM6IDIsXG4gICAgZnBzOiBmcHMsXG4gICAgaWRsZUZwczogNCxcbiAgICBsYXN0RnJhbWVUaW1lOiAwLFxuICAgIHJvdzogMCxcbiAgICBzdGF0ZTogJ0lETEUnLFxuICAgIGxhc3RTdGF0ZTogJ0lETEUnXG59KTtcblxuZXhwb3J0IGNvbnN0IFBsYXllckNvbXBvbmVudCA9IChpZCwgY2hhclR5cGUsIGlzTG9jYWwgPSBmYWxzZSkgPT4gKHtcbiAgICBpZDogaWQsXG4gICAgY2hhclR5cGU6IGNoYXJUeXBlLFxuICAgIGlzTG9jYWw6IGlzTG9jYWxcbn0pO1xuXG5leHBvcnQgY29uc3QgQm9tYkNvbXBvbmVudCA9IChvd25lcklkLCB0aW1lciA9IDIwMDAsIHJhbmdlID0gNCkgPT4gKHtcbiAgICBvd25lcklkOiBvd25lcklkLFxuICAgIHRpbWVyOiB0aW1lcixcbiAgICByYW5nZTogcmFuZ2UsXG4gICAgZXhwbG9kZWQ6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEV4cGxvc2lvbkNvbXBvbmVudCA9IChkdXJhdGlvbiA9IDUwMCkgPT4gKHtcbiAgICBkdXJhdGlvbjogZHVyYXRpb25cbn0pO1xuXG5leHBvcnQgY29uc3QgUG93ZXJVcENvbXBvbmVudCA9ICh0eXBlKSA9PiAoe1xuICAgIHR5cGU6IHR5cGUsIFxuICAgIHBpY2tlZFVwOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBCZWhhdmlvckNvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgZ2hvc3RNb2RlOiBmYWxzZSxcbiAgICB0aHJvd2FibGU6IGZhbHNlLFxuICAgIGRldG9uYXRvcjogZmFsc2UsXG4gICAgZmFzdFNob2VzTGV2ZWw6IDEsXG4gICAgYm9tYnM6IHtcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICByYW5nZTogMlxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkLmpzJztcbmltcG9ydCB7XG4gICAgUG9zaXRpb25Db21wb25lbnQsXG4gICAgVmVsb2NpdHlDb21wb25lbnQsXG4gICAgSW5wdXRDb21wb25lbnQsXG4gICAgUmVuZGVyYWJsZUNvbXBvbmVudCxcbiAgICBQbGF5ZXJDb21wb25lbnQsXG4gICAgQm9tYkNvbXBvbmVudFxufSBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuaW1wb3J0IHsgbW92ZW1lbnRTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyc7XG5pbXBvcnQgeyBib21iU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgZGFtYWdlU3lzdGVtLCBjaGVja0dhbWVFbmRDb25kaXRpb25zLCBzcGF3bkhlYXJ0UG93ZXJVcCB9IGZyb20gJy4vc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMnO1xuaW1wb3J0IFdpbk1lbnUgZnJvbSAnLi4vcGFnZXMvV2luTWVudS5qc3gnO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tLmpzJztcblxuaW1wb3J0IHsgcG93ZXJVcFN5c3RlbSwgc3Bhd25Qb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMnO1xuaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQgfSBmcm9tICcuLi9wYWdlcy9nYW1lJztcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzQ29udGFpbmVyLCBtYXBEYXRhLCBzb2NrZXQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjYW52YXNDb250YWluZXI7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IG1hcERhdGE7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XG4gICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnBsYXllckluZm8gPSBuZXcgTWFwKCk7IC8vIFN0b3JlIG9yaWdpbmFsIHBsYXllciBkYXRhIGxpa2Ugbmlja25hbWVcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IDA7XG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzID0gbmV3IFNldCgpO1xuICAgICAgICAvLyBTdGF0ZSBmbGFnIHRvIHByZXZlbnQgbXVsdGlwbGUgbG9zcyBtb2RhbCByZW5kZXJzIChUaGUgTG9vcCBUcmFwIGZpeClcbiAgICAgICAgdGhpcy5sb3NzTW9kYWxUcmlnZ2VyZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gRmxhZyB0byB0cmFjayBpZiBpbnB1dCBzaG91bGQgYmUgZGlzYWJsZWRcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAvLyBGbGFnIHRvIHN0b3AgdGhlIGdhbWUgbG9vcCBvbmNlIGEgd2lubmVyIGlzIGRlY2lkZWRcbiAgICAgICAgdGhpcy5nYW1lRW5kZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0KGxvY2FsUGxheWVySWQsIGFsbFBsYXllcnMpIHtcbiAgICAgICAgdGhpcy50b3RhbFBsYXllcnMgPSBhbGxQbGF5ZXJzLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZExvY2FsUGxheWVySWQgPSBTdHJpbmcobG9jYWxQbGF5ZXJJZCk7XG5cbiAgICAgICAgYWxsUGxheWVycy5mb3JFYWNoKHBEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gU3RyaW5nKHBEYXRhLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckluZm8uc2V0KHBsYXllcklkLCBwRGF0YSk7IC8vIFN0b3JlIG9yaWdpbmFsIHBsYXllciBkYXRhXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgICAgaWYgKHBEYXRhLmRpc2Nvbm5lY3RlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBwRGF0YS5jb2xvciB8fCBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgIHBsYXllckRpdi5jbGFzc05hbWUgPSBgcGxheWVyIHBsYXllci0ke2NvbG9yfWA7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnpJbmRleCA9ICcxMCc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUud2lsbENoYW5nZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyRGl2KTtcblxuICAgICAgICAgICAgY29uc3Qgc3ggPSBwRGF0YS54IHx8IDE7XG4gICAgICAgICAgICBjb25zdCBzeSA9IHBEYXRhLnkgfHwgMTtcblxuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nLCBQb3NpdGlvbkNvbXBvbmVudChzeCwgc3ksIFRJTEVfU0laRSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknLCBWZWxvY2l0eUNvbXBvbmVudCgyLjUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnLCBSZW5kZXJhYmxlQ29tcG9uZW50KHBsYXllckRpdiwgNjQsIDY0LCA0LCAxMilcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzTG9jYWwgPSBwbGF5ZXJJZCA9PT0gbm9ybWFsaXplZExvY2FsUGxheWVySWQ7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJDb21wID0gUGxheWVyQ29tcG9uZW50KHBsYXllcklkLCBjb2xvciwgaXNMb2NhbCk7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmxpdmVzID0gMztcbiAgICAgICAgICAgIHBsYXllckNvbXAubWF4Qm9tYnMgPSAxO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5ib21iUmFuZ2UgPSA0O1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJywgcGxheWVyQ29tcCk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzLnNldChwbGF5ZXJJZCwgcGxheWVyRW50aXR5KTtcblxuICAgICAgICAgICAgaWYgKGlzTG9jYWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsUGxheWVyRW50aXR5ID0gcGxheWVyRW50aXR5O1xuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ0lucHV0JywgSW5wdXRDb21wb25lbnQoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyhwbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW0dhbWVFbmdpbmVdIExvY2FsIHBsYXllciB3YXMgbm90IGZvdW5kXCIsIHtcbiAgICAgICAgICAgICAgICBsb2NhbFBsYXllcklkLFxuICAgICAgICAgICAgICAgIHBsYXllcnM6IGFsbFBsYXllcnMubWFwKHBsYXllciA9PiBwbGF5ZXIuaWQpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlZ2lzdGVyU3lzdGVtcygpO1xuXG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobm93KSA9PiB0aGlzLmdhbWVMb29wKG5vdykpO1xuICAgIH1cblxuICAgIHNldHVwSW5wdXQoKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgIGlmICghaW5wdXQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBnZXRLZXlEaXJlY3Rpb24gPSAoa2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dVcCcgfHwga2V5ID09PSAndycgfHwga2V5ID09PSAnWicgfHwga2V5ID09PSAneicpIHJldHVybiAndXAnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93RG93bicgfHwga2V5ID09PSAncycgfHwga2V5ID09PSAnUycpIHJldHVybiAnZG93bic7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dMZWZ0JyB8fCBrZXkgPT09ICdhJyB8fCBrZXkgPT09ICdRJyB8fCBrZXkgPT09ICdxJykgcmV0dXJuICdsZWZ0JztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1JpZ2h0JyB8fCBrZXkgPT09ICdkJyB8fCBrZXkgPT09ICdEJykgcmV0dXJuICdyaWdodCc7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYW5kbGVLZXlEb3duID0gKGUpID0+IHtcbiAgICAgICAgICAgIC8vIElOUFVUIERJU0FCTEVEOiBJbW1lZGlhdGVseSBpZ25vcmUgYWxsIGtleWJvYXJkIGlucHV0cyB3aGVuIHBsYXllciBpcyBkZWFkXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5wdXRFbmFibGVkKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICghaW5wdXQuaW5wdXRRdWV1ZS5pbmNsdWRlcyhkaXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUudW5zaGlmdChkaXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnICcgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcEJvbWIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYW5kbGVLZXlVcCA9IChlKSA9PiB7XG4gICAgICAgICAgICAvLyBJTlBVVCBESVNBQkxFRDogSW1tZWRpYXRlbHkgaWdub3JlIGFsbCBrZXlib2FyZCBpbnB1dHMgd2hlbiBwbGF5ZXIgaXMgZGVhZFxuICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0RW5hYmxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUgPSBpbnB1dC5pbnB1dFF1ZXVlLmZpbHRlcihkID0+IGQgIT09IGRpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGRyb3BCb21iKCkge1xuICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudEJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLmZpbHRlcihiRW50aXR5ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndvcmxkLmdldENvbXBvbmVudChiRW50aXR5LCAnQm9tYicpLm93bmVySWQgPT09IHBsYXllci5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRCb21icy5sZW5ndGggPj0gcGxheWVyLm1heEJvbWJzKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuY3JlYXRlQm9tYihwbGF5ZXIuaWQsIHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBwbGF5ZXIuYm9tYlJhbmdlKTtcbiAgICAgICAgaWYgKCFjcmVhdGVkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnRFJPUF9CT01CJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGlkOiBwbGF5ZXIuaWQsIHg6IHBvcy5ncmlkWCwgeTogcG9zLmdyaWRZLCByYW5nZTogcGxheWVyLmJvbWJSYW5nZSB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVCb21iKG93bmVySWQsIGdyaWRYLCBncmlkWSwgcmFuZ2UpIHtcbiAgICAgICAgY29uc3QgZXhpc3RzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLnNvbWUoZW50aXR5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBib21iID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQm9tYicpO1xuICAgICAgICAgICAgcmV0dXJuIGJvbWIub3duZXJJZCA9PT0gb3duZXJJZCAmJiBwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChleGlzdHMpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBib21iRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgY29uc3QgYm9tYkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBib21iRGl2LmNsYXNzTmFtZSA9ICdib21iJztcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUubGVmdCA9IGAke2dyaWRYICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUuekluZGV4ID0gJzYnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChib21iRGl2KTtcblxuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYLCBncmlkWSB9KTtcblxuICAgICAgICBjb25zdCBib21iQ29tcCA9IEJvbWJDb21wb25lbnQob3duZXJJZCwgMjAwMCwgcmFuZ2UpO1xuICAgICAgICBib21iQ29tcC5lbCA9IGJvbWJEaXY7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJywgYm9tYkNvbXApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVNb3ZlKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbaGFuZGxlUmVtb3RlTW92ZV0gSW52YWxpZCBwYXlsb2FkOlwiLCBwYXlsb2FkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIEVudGl0eSBub3QgZm91bmQgZm9yIHBsYXllciAke3BheWxvYWQuaWR9LiBBdmFpbGFibGUgcGxheWVyczpgLCBBcnJheS5mcm9tKHRoaXMucGxheWVyRW50aXRpZXMua2V5cygpKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW2hhbmRsZVJlbW90ZU1vdmVdIElnbm9yaW5nIGxvY2FsIHBsYXllciB1cGRhdGUgZm9yICR7cGF5bG9hZC5pZH1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIXBvcyB8fCAhdmVsIHx8ICFyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBNaXNzaW5nIGNvbXBvbmVudHMgZm9yIHBsYXllciAke3BheWxvYWQuaWR9OmAsIHsgcG9zOiAhIXBvcywgdmVsOiAhIXZlbCwgcmVuZGVyYWJsZTogISFyZW5kZXJhYmxlIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coYFtoYW5kbGVSZW1vdGVNb3ZlXSBVcGRhdGluZyBwbGF5ZXIgJHtwYXlsb2FkLmlkfSB0byAoJHtwYXlsb2FkLmdyaWRYfSwgJHtwYXlsb2FkLmdyaWRZfSlgKTtcbiAgICAgICAgdmVsLmRpcmVjdGlvbiA9IHBheWxvYWQuZGlyZWN0aW9uIHx8IHZlbC5kaXJlY3Rpb247XG4gICAgICAgIHZlbC5pc01vdmluZyA9IHBheWxvYWQuaXNNb3Zpbmc7XG4gICAgICAgIHBvcy5ncmlkWCA9IHBheWxvYWQuZ3JpZFg7XG4gICAgICAgIHBvcy5ncmlkWSA9IHBheWxvYWQuZ3JpZFk7XG4gICAgICAgIHBvcy50YXJnZXRYID0gcGF5bG9hZC54O1xuICAgICAgICBwb3MudGFyZ2V0WSA9IHBheWxvYWQueTtcbiAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9IHBheWxvYWQuc3RhdGUgfHwgKHBheWxvYWQuaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyk7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlQm9tYihwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmNyZWF0ZUJvbWIocGF5bG9hZC5pZCwgcGF5bG9hZC54LCBwYXlsb2FkLnksIHBheWxvYWQucmFuZ2UgfHwgNCk7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCBwYXlsb2FkLnggPT09IHVuZGVmaW5lZCB8fCBwYXlsb2FkLnkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlUG93ZXJVcEF0KHBheWxvYWQueCwgcGF5bG9hZC55KTtcblxuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQgfHwgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5hcHBseVBvd2VyVXAoZW50aXR5LCBwYXlsb2FkLnR5cGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgcmVtb3RlIGhlYXJ0IHBpY2t1cCAtIHVwZGF0ZXMgcGxheWVyIGxpdmVzIGFuZCBVSSBvbiBhbGwgY2xpZW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkIC0geyBwbGF5ZXJJZCwgbmV3TGl2ZXMgfVxuICAgICAqL1xuICAgIGhhbmRsZVJlbW90ZUl0ZW1QaWNrdXAocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQucGxheWVySWQgfHwgcGF5bG9hZC5uZXdMaXZlcyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgLy8gNC4gRW5zdXJlIHdlIGRlc3Ryb3kgdGhlIGhlYXJ0IGVudGl0eSBmcm9tIHRoZSByZW1vdGUgY2xpZW50cycgc2NyZWVuc1xuICAgICAgICBpZiAocGF5bG9hZC54ICE9PSB1bmRlZmluZWQgJiYgcGF5bG9hZC55ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUG93ZXJVcEF0KHBheWxvYWQueCwgcGF5bG9hZC55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDEuIEZpbmQgdGhlIHBsYXllciBlbnRpdHkgdXNpbmcgdGhlIHBheWxvYWQncyBwbGF5ZXJJZFxuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5wbGF5ZXJJZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIpIHJldHVybjtcblxuICAgICAgICAvLyAyLiBEbyBOT1QgYWRkICsxLiBTdHJpY3RseSBTRVQgdGhlIHN0YXRlIHVzaW5nIHRoZSBwYXlsb2FkXG4gICAgICAgIHBsYXllci5saXZlcyA9IHBheWxvYWQubmV3TGl2ZXM7XG5cbiAgICAgICAgLy8gMy4gVXBkYXRlIHRoZSBIVUQvVUkgZXhwbGljaXRseSB3aXRoIG1lc3NhZ2UucGF5bG9hZC5uZXdMaXZlc1xuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKGVudGl0eSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW1JlbW90ZSBJdGVtIFBpY2t1cF0gUGxheWVyICR7cGF5bG9hZC5wbGF5ZXJJZH0gcGlja2VkIHVwIGhlYXJ0LiBOZXcgbGl2ZXM6ICR7cGF5bG9hZC5uZXdMaXZlc31gKTtcbiAgICB9XG5cbiAgICByZW1vdmVQb3dlclVwQXQoZ3JpZFgsIGdyaWRZKSB7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHtncmlkWH0sJHtncmlkWX1gKTtcbiAgICAgICAgY29uc3QgcG93ZXJVcHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwb3dlclVwID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCFwb3MgfHwgIXBvd2VyVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcG93ZXJVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAocG93ZXJVcC5lbCAmJiBwb3dlclVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG93ZXJVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvd2VyVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UG93ZXJVcChlbnRpdHksIHR5cGUpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdTUEVFRCcpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5LnNwZWVkID0gTWF0aC5taW4odmVsb2NpdHkuc3BlZWQgKyAxLCA4KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAvLyBIRUFSVCBwb3dlci11cDogaW5jcmVtZW50IGxpdmVzIChjYXAgYXQgMylcbiAgICAgICAgICAgIHBsYXllci5saXZlcyA9IE1hdGgubWluKChwbGF5ZXIubGl2ZXMgfHwgMCkgKyAxLCAzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVyU3lzdGVtcygpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlTWFwQ2VsbCA9ICh4LCB5LCBuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm1hcERhdGFbeV0pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5tYXBEYXRhW3ldW3hdID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCk7XG4gICAgICAgICAgICBpZiAoIXRpbGUpIHJldHVybjtcblxuICAgICAgICAgICAgdGlsZS5jbGFzc05hbWUgPSAndGlsZSB0aWxlLWZsb29yJztcbiAgICAgICAgICAgIHRpbGUuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybChcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIiknO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGRlc3Ryb3lCb3hDYWxsYmFjayA9ICh4LCB5KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGFpbWVkUG93ZXJVcHMuaGFzKGAke3h9LCR7eX1gKSkgcmV0dXJuO1xuICAgICAgICAgICAgc3Bhd25Qb3dlclVwKHRoaXMud29ybGQsIHgsIHksIHRoaXMuY29udGFpbmVyLCBUSUxFX1NJWkUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUGxheWVySHVydCA9IChlbnRpdHksIGlkLCByZW1haW5pbmdMaXZlcykgPT4ge1xuICAgICAgICAgICAgLy8gQ1JJVElDQUw6IE9ubHkgc2VuZCBwbGF5ZXJfZGllZCBpZiBUSElTIElTIFRIRSBMT0NBTCBQTEFZRVIuXG4gICAgICAgICAgICAvLyBUaGUgRUNTIGRhbWFnZVN5c3RlbSBydW5zIG9uIEFMTCBjbGllbnRzLCBzbyBldmVyeSBjbGllbnQgZGV0ZWN0c1xuICAgICAgICAgICAgLy8gZXZlcnkgY29sbGlzaW9uLiBXZSBtdXN0IGd1YXJkIHRoZSBXZWJTb2NrZXQgbWVzc2FnZSB0byBwcmV2ZW50XG4gICAgICAgICAgICAvLyBpbmNvcnJlY3QgZGVhdGggcmVwb3J0cy5cbiAgICAgICAgICAgIGlmIChyZW1haW5pbmdMaXZlcyA8PSAwICYmIGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSAmJiB0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGxheWVyX2RpZWQnXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBIVUQgb25seSBmb3IgdGhlIGxvY2FsIHBsYXllci5cbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICBzZXRMaXZlcyhyZW1haW5pbmdMaXZlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25Qb3dlclVwUGlja2VkID0gKGlkLCB0eXBlLCB4LCB5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7eH0sJHt5fWApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcoaWQpKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckNvbXAgPSBlbnRpdHkgPyB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKSA6IG51bGw7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllckNvbXAgJiYgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHNldExpdmVzKHBsYXllckNvbXAubGl2ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllckNvbXAgJiYgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHModGhpcy5sb2NhbFBsYXllckVudGl0eSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZSA9PT0gJ0hFQVJUJyA/ICdJVEVNX1BJQ0tVUCcgOiAnUE9XRVJVUF9QSUNLRUQnLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB0eXBlID09PSAnSEVBUlQnXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHsgcGxheWVySWQ6IGlkLCBuZXdMaXZlczogcGxheWVyQ29tcCA/IHBsYXllckNvbXAubGl2ZXMgOiAwLCB4LCB5IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDogeyBpZCwgdHlwZSwgeCwgeSB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYnJvYWRjYXN0TW92ZW1lbnQgPSAoZW50aXR5LCB4LCB5LCBncmlkWCwgZ3JpZFksIGRpcmVjdGlvbiwgaXNNb3ZpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXRoaXMuc29ja2V0IHx8IHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdNT1ZFX1NUQVRFJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBwbGF5ZXIuaWQsXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBncmlkWSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICBpc01vdmluZyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IGlzTW92aW5nID8gJ1JVTicgOiAnSURMRScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBtb3ZlbWVudFN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gYm9tYlN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBkYW1hZ2VTeXN0ZW0odGhpcy53b3JsZCwgbm93LCBvblBsYXllckh1cnQsIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksIFRJTEVfU0laRSwgdGhpcy5zb2NrZXQpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHBvd2VyVXBTeXN0ZW0odywgb25Qb3dlclVwUGlja2VkKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiByZW5kZXJTeXN0ZW0odywgZHQsIG5vdywgQU5JTUFUSU9OX1JPV1MpKTtcbiAgICB9XG5cbiAgICBnYW1lTG9vcChub3cpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHJldHVybjtcblxuICAgICAgICBjb25zdCBkdCA9IG5vdyAtIHRoaXMubGFzdFRpbWU7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBub3c7XG4gICAgICAgIHRoaXMud29ybGQudXBkYXRlKGR0LCBub3cpO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5leHROb3cpID0+IHRoaXMuZ2FtZUxvb3AobmV4dE5vdykpO1xuICAgIH1cblxuICAgIGhhbmRsZUdhbWVPdmVyKHdpbm5lck5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZUVuZGVkKSByZXR1cm47IC8vIFByZXZlbnQgbXVsdGlwbGUgdHJpZ2dlcnNcbiAgICAgICAgdGhpcy5nYW1lRW5kZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcblxuICAgICAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSAnbWVudS1wYWdlJztcbiAgICAgICAgcmVuZGVyKDxXaW5NZW51IHdpbm5lck5hbWU9e3dpbm5lck5hbWV9IC8+LCByb290KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgZ2FtZSBlbmQgY29uZGl0aW9ucyB3aXRoIHByb3BlciBzdGF0ZSBmbGFnIG1hbmFnZW1lbnQuXG4gICAgICogUHJldmVudHMgdGhlIFwiTG9vcCBUcmFwXCIgLSBtb2RhbCBpcyBvbmx5IHJlbmRlcmVkIE9OQ0Ugd2hlbiBsaXZlcyByZWFjaCAwLlxuICAgICAqIEFsc28gZGlzYWJsZXMgaW5wdXQgaW1tZWRpYXRlbHkgd2hlbiBwbGF5ZXIgZGllcy5cbiAgICAgKi9cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVIdWRTdGF0cyhlbnRpdHkpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgc2V0Qm9tYnMocGxheWVyLm1heEJvbWJzIHx8IDEpO1xuICAgICAgICBzZXRMaXZlcyhwbGF5ZXIubGl2ZXMgPz8gMyk7XG4gICAgICAgIHNldFJhbmdlKHBsYXllci5ib21iUmFuZ2UgfHwgNCk7XG4gICAgICAgIHNldFNwZWVkKE1hdGgucm91bmQodmVsb2NpdHkuc3BlZWQpKTtcbiAgICB9XG59XG5cbmxldCBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gXCJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFBsYXllck5hbWUobmFtZSkge1xuICAgIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBuYW1lO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIsIG5hbWUpO1xuICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5XCIsIG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGxheWVyTmFtZSgpIHtcbiAgICByZXR1cm4gY3VycmVudExvY2FsUGxheWVyTmFtZSB8fCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiKSB8fCBcIlBsYXllclwiO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGJvbWJTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IGJvbWJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IGJvbWJFbnRpdHkgb2YgYm9tYnMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBib21iID0gd29ybGQuZ2V0Q29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJyk7XG4gICAgICAgIFxuICAgICAgICBib21iLnRpbWVyIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGJvbWIudGltZXIgPD0gMCAmJiAhYm9tYi5leHBsb2RlZCkge1xuICAgICAgICAgICAgYm9tYi5leHBsb2RlZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGFmZmVjdGVkQ2VsbHMgPSBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgYm9tYi5yYW5nZSwgbWFwRGF0YSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFmZmVjdGVkQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBleHBEaXYuY2xhc3NOYW1lID0gJ2V4cGxvc2lvbic7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUubGVmdCA9IGAke2NlbGwueCAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUudG9wID0gYCR7Y2VsbC55ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS56SW5kZXggPSAnNyc7XG5cbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nLCB7IFxuICAgICAgICAgICAgICAgICAgICBncmlkWDogY2VsbC54LCBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFk6IGNlbGwueSwgXG4gICAgICAgICAgICAgICAgICAgIHg6IGNlbGwueCAqIHRpbGVTaXplLCBcbiAgICAgICAgICAgICAgICAgICAgeTogY2VsbC55ICogdGlsZVNpemUgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicsIHsgZHVyYXRpb246IDUwMCwgZWw6IGV4cERpdiB9KTtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZXhwRGl2KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAobWFwRGF0YVtjZWxsLnldICYmIG1hcERhdGFbY2VsbC55XVtjZWxsLnhdID09PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZU1hcENlbGwoY2VsbC54LCBjZWxsLnksIDIpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc3Ryb3lCb3hDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveUJveENhbGxiYWNrKGNlbGwueCwgY2VsbC55KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYm9tYi5lbCAmJiBib21iLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYm9tYi5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KGJvbWJFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICBjb25zdCBleHAgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJyk7XG4gICAgICAgIGV4cC5kdXJhdGlvbiAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChleHAuZHVyYXRpb24gPD0gMCkge1xuICAgICAgICAgICAgaWYgKGV4cC5lbCAmJiBleHAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGV4cC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGV4cC5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KGV4cEVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKGJ4LCBieSwgcmFuZ2UsIG1hcERhdGEpIHtcbiAgICBjb25zdCBjZWxscyA9IFt7IHg6IGJ4LCB5OiBieSB9XTtcbiAgICBjb25zdCBkaXJlY3Rpb25zID0gW1xuICAgICAgICB7IHg6IDAsIHk6IC0xIH0sXG4gICAgICAgIHsgeDogMCwgeTogMSB9LFxuICAgICAgICB7IHg6IC0xLCB5OiAwIH0sXG4gICAgICAgIHsgeDogMSwgeTogMCB9XG4gICAgXTtcbiAgICBcbiAgICBjb25zdCBzdGVwcyA9IHJhbmdlIC0gMTsgXG4gICAgXG4gICAgZGlyZWN0aW9ucy5mb3JFYWNoKGRpciA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gYnggKyAoZGlyLnggKiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHR5ID0gYnkgKyAoZGlyLnkgKiBpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFtYXBEYXRhW3R5XSB8fCBtYXBEYXRhW3R5XVt0eF0gPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNlbGxUeXBlID0gbWFwRGF0YVt0eV1bdHhdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2VsbHMucHVzaCh7IHg6IHR4LCB5OiB0eSB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gY2VsbHM7XG59XG4iLCIvKipcbiAqIFNwYXducyBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgc3BlY2lmaWVkIGdyaWQgY29vcmRpbmF0ZXMuXG4gKiBUaGlzIGNyZWF0ZXMgYSBwcm9wZXIgRUNTIGVudGl0eSB3aXRoIFBvc2l0aW9uLCBQb3dlclVwLCBhbmQgUmVuZGVyYWJsZSBjb21wb25lbnRzLlxuICogXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gZ3JpZFggLSBHcmlkIFggY29vcmRpbmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGdyaWRZIC0gR3JpZCBZIGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBnYW1lIGNvbnRhaW5lciBlbGVtZW50XG4gKiBAcGFyYW0ge251bWJlcn0gdGlsZVNpemUgLSBUaGUgc2l6ZSBvZiBlYWNoIGdyaWQgdGlsZSAoZGVmYXVsdDogNjQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGF3bkhlYXJ0UG93ZXJVcCh3b3JsZCwgZ3JpZFgsIGdyaWRZLCBjb250YWluZXIsIHRpbGVTaXplID0gNjQpIHtcbiAgICAvLyBDcmVhdGUgYSBuZXcgZW50aXR5IGZvciB0aGUgaGVhcnQgcG93ZXItdXBcbiAgICBjb25zdCBoZWFydEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIFxuICAgIC8vIEFkZCBQb3NpdGlvbiBjb21wb25lbnRcbiAgICB3b3JsZC5hZGRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3NpdGlvbicsIHtcbiAgICAgICAgZ3JpZFg6IGdyaWRYLFxuICAgICAgICBncmlkWTogZ3JpZFksXG4gICAgICAgIHg6IGdyaWRYICogdGlsZVNpemUsXG4gICAgICAgIHk6IGdyaWRZICogdGlsZVNpemVcbiAgICB9KTtcbiAgICBcbiAgICAvLyBBZGQgUG93ZXJVcCBjb21wb25lbnQgd2l0aCB0eXBlICdIRUFSVCdcbiAgICB3b3JsZC5hZGRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3dlclVwJywge1xuICAgICAgICB0eXBlOiAnSEVBUlQnLFxuICAgICAgICBwaWNrZWRVcDogZmFsc2UsXG4gICAgICAgIGVsOiBudWxsICAvLyBXaWxsIGJlIHNldCBhZnRlciBjcmVhdGluZyB0aGUgRE9NIGVsZW1lbnRcbiAgICB9KTtcbiAgICBcbiAgICAvLyBDcmVhdGUgdGhlIERPTSBlbGVtZW50IGZvciByZW5kZXJpbmdcbiAgICBjb25zdCBoZWFydERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYXJ0RGl2LmNsYXNzTmFtZSA9ICdwb3dlcnVwIHBvd2VydXAtaGVhcnQnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBoZWFydERpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgaGVhcnREaXYuc3R5bGUuYWxpZ25JdGVtcyA9ICdjZW50ZXInO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuZm9udFNpemUgPSAnMzJweCc7XG4gICAgaGVhcnREaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIGhlYXJ0RGl2LnRleHRDb250ZW50ID0gJ+KdpO+4jyc7XG4gICAgXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhlYXJ0RGl2KTtcbiAgICBcbiAgICAvLyBVcGRhdGUgdGhlIFBvd2VyVXAgY29tcG9uZW50IHdpdGggdGhlIERPTSBlbGVtZW50IHJlZmVyZW5jZVxuICAgIGNvbnN0IHBvd2VyVXAgPSB3b3JsZC5nZXRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3dlclVwJyk7XG4gICAgaWYgKHBvd2VyVXApIHtcbiAgICAgICAgcG93ZXJVcC5lbCA9IGhlYXJ0RGl2O1xuICAgIH1cbiAgICBcbiAgICBjb25zb2xlLmxvZyhgW0hlYXJ0IERyb3BdIFNwYXduZWQgSEVBUlQgcG93ZXItdXAgYXQgKCR7Z3JpZFh9LCAke2dyaWRZfSlgKTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHBsYXllciBkZWF0aCB0cmFuc2l0aW9uIHdoZW4gbGl2ZXMgcmVhY2ggMC5cbiAqIFJlbW92ZXMgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGFuZCBzcGF3bnMgYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIGRlYXRoIGxvY2F0aW9uLlxuICpcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJFbnRpdHkgLSBUaGUgZW50aXR5IElEIG9mIHRoZSBkeWluZyBwbGF5ZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBnYW1lIGNvbnRhaW5lciBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVQbGF5ZXJEZWF0aCh3b3JsZCwgcGxheWVyRW50aXR5LCB0aWxlU2l6ZSA9IDY0LCBjb250YWluZXIgPSBudWxsKSB7XG4gICAgLy8gR2V0IHRoZSBwbGF5ZXIncyBjb21wb25lbnRzXG4gICAgY29uc3QgcG9zaXRpb24gPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG5cbiAgICBpZiAoIXBvc2l0aW9uIHx8ICFyZW5kZXJhYmxlIHx8ICFwbGF5ZXIpIHJldHVybjtcblxuICAgIC8vIFN0b3JlIHRoZSBncmlkIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwbGF5ZXIgZGllZFxuICAgIGNvbnN0IGRlYXRoR3JpZFggPSBNYXRoLmZsb29yKChwb3NpdGlvbi54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICBjb25zdCBkZWF0aEdyaWRZID0gTWF0aC5mbG9vcigocG9zaXRpb24ueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG5cbiAgICAvLyBDUklUSUNBTDogUmVtb3ZlIHRoZSBwbGF5ZXIncyBET00gZWxlbWVudCBmcm9tIHRoZSBkb2N1bWVudCBCRUZPUkUgcmVtb3ZpbmcgdGhlIFJlbmRlcmFibGUgY29tcG9uZW50LlxuICAgIC8vIFRoaXMgZW5zdXJlcyB0aGUgZGVhZCBwbGF5ZXIgdmlzdWFsbHkgZGlzYXBwZWFycyBpbW1lZGlhdGVseS5cbiAgICBpZiAocmVuZGVyYWJsZS5lbCAmJiByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHJlbmRlcmFibGUuZWwpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBjb21wb25lbnRzIHRoYXQgZW5hYmxlIGludGVyYWN0aW9uIGFuZCByZW5kZXJpbmcuXG4gICAgd29ybGQucmVtb3ZlQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICAvLyBXZSBrZWVwIFBvc2l0aW9uIGFuZCBQbGF5ZXIgY29tcG9uZW50cyB0byBrbm93IHdoZXJlIHRoZXkgd2VyZS5cblxuICAgIC8vIFNwYXduIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBkZWF0aCBsb2NhdGlvbiAocHJvcGVyIEVDUyBlbnRpdHkpXG4gICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICBzcGF3bkhlYXJ0UG93ZXJVcCh3b3JsZCwgZGVhdGhHcmlkWCwgZGVhdGhHcmlkWSwgZ2FtZUNvbnRhaW5lciwgdGlsZVNpemUpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGBbUGxheWVyIERlYXRoXSBQbGF5ZXIgJHtwbGF5ZXIuaWR9IGRpZWQgYXQgKCR7ZGVhdGhHcmlkWH0sICR7ZGVhdGhHcmlkWX0pLiBIZWFydCBwb3dlci11cCBkcm9wcGVkLmApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGFtYWdlU3lzdGVtKHdvcmxkLCBub3csIG9uUGxheWVySHVydCwgbG9jYWxQbGF5ZXJFbnRpdHksIHRpbGVTaXplID0gNjQsIHNvY2tldCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUGxheWVyJyk7XG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHBsYXllci5pbnZpbmNpYmxlVW50aWwgJiYgcGxheWVyLmludmluY2libGVVbnRpbCA+IG5vdykgY29udGludWU7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgICAgICBjb25zdCBlUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdyaWQtYmFzZWQgY29sbGlzaW9uXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWCA9IE1hdGguZmxvb3IoKHBQb3MueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWSA9IE1hdGguZmxvb3IoKHBQb3MueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChwbGF5ZXJHcmlkWCA9PT0gZVBvcy5ncmlkWCAmJiBwbGF5ZXJHcmlkWSA9PT0gZVBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzTGl2ZXMgPSBwbGF5ZXIubGl2ZXMgPz8gMztcbiAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSBNYXRoLm1heChwcmV2aW91c0xpdmVzIC0gMSwgMCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLmludmluY2libGVVbnRpbCA9IG5vdyArIDE1MDA7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHBsYXllciBpcyBkZWFkLCByZXBvcnQgZGVhdGggT05DRSB1c2luZyBndWFyZCBjbGF1c2VcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmxpdmVzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBsYXllci5hbHJlYWR5UmVwb3J0ZWREZWFkKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmFscmVhZHlSZXBvcnRlZERlYWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUGxheWVySHVydChwbGF5ZXJFbnRpdHksIHBsYXllci5pZCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBsYXllciBzdGlsbCBhbGl2ZSwgcmVwb3J0IG5vcm1hbCBkYW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uUGxheWVySHVydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCBwbGF5ZXIubGl2ZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEJyZWFrIHRoZSBsb29wIHNpbmNlIHRoZSBwbGF5ZXIgaGFzIGFscmVhZHkgdGFrZW4gZGFtYWdlIGZyb20gdGhpcyBleHBsb3Npb24uXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGZ1bmN0aW9uIG1vdmVtZW50U3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB0aWxlU2l6ZSA9IDQwKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknKTtcbiAgICBjb25zdCBkZWx0YSA9IGR0IC8gMTYuNjc7XG5cbiAgICBjb25zdCBQTEFZRVJfU0laRSA9IHRpbGVTaXplO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBpbnB1dCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBjb25zdCBiZWhhdmlvciA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCZWhhdmlvcicpO1xuXG4gICAgICAgIGlmIChiZWhhdmlvcikge1xuICAgICAgICAgICAgdmVsLnNwZWVkID0gdmVsLmJhc2VTcGVlZCArIChiZWhhdmlvci5mYXN0U2hvZXNMZXZlbCAtIDEpICogMC41O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmVsLnNwZWVkID0gdmVsLmJhc2VTcGVlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWN0aXZlSW5wdXQgPSBpbnB1dC5pbnB1dFF1ZXVlWzBdO1xuICAgICAgICBsZXQgZHggPSAwO1xuICAgICAgICBsZXQgZHkgPSAwO1xuXG4gICAgICAgIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3VwJykge1xuICAgICAgICAgICAgZHkgPSAtMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAndXAnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnZG93bicpIHtcbiAgICAgICAgICAgIGR5ID0gMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAnZG93bic7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgZHggPSAtMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAnbGVmdCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgIGR4ID0gMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAncmlnaHQnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGFzSW5wdXQgPSBkeCAhPT0gMCB8fCBkeSAhPT0gMDtcblxuICAgICAgICBpZiAoIWhhc0lucHV0KSB7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICAgICAgcG9zLnRhcmdldFkgPSBwb3MueTtcbiAgICAgICAgICAgIHZlbC5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSAnSURMRSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBvcy5ncmlkWCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBwb3MuZ3JpZFkgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdmVsLmlzTW92aW5nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFggPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGNvbnN0IHNuYXBUaHJlc2hvbGQgPSAzMjtcblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgZHggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChpc0Jsb2NrZWQocG9zLngsIG5leHRZLCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbGVYID0gTWF0aC5mbG9vcigocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFggPSBjdXJyZW50VGlsZVggKiB0aWxlU2l6ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmWCA9IHBvcy54IC0gdGFyZ2V0WDtcblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaWZmWCkgPCBzbmFwVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAtTWF0aC5zaWduKGRpZmZYKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgZHkgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChpc0Jsb2NrZWQobmV4dFgsIHBvcy55LCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbGVZID0gTWF0aC5mbG9vcigocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFkgPSBjdXJyZW50VGlsZVkgKiB0aWxlU2l6ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmWSA9IHBvcy55IC0gdGFyZ2V0WTtcblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaWZmWSkgPCBzbmFwVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAtTWF0aC5zaWduKGRpZmZZKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WEFmdGVyU25hcCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFlBZnRlclNuYXAgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmICFpc0Jsb2NrZWQobmV4dFhBZnRlclNuYXAsIHBvcy55LCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICBwb3MueCA9IG5leHRYQWZ0ZXJTbmFwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmICFpc0Jsb2NrZWQocG9zLngsIG5leHRZQWZ0ZXJTbmFwLCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICBwb3MueSA9IG5leHRZQWZ0ZXJTbmFwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmVsLmlzTW92aW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSAnUlVOJztcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcy5ncmlkWCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MuZ3JpZFkgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwb3MueTtcblxuICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgIGVudGl0eSxcbiAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFgsXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgdmVsLmlzTW92aW5nXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSkge1xuICAgIGNvbnN0IHN0ZXAgPSB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgIGlmIChwb3MueCA8IHBvcy50YXJnZXRYKSB7XG4gICAgICAgIHBvcy54ID0gTWF0aC5taW4ocG9zLnggKyBzdGVwLCBwb3MudGFyZ2V0WCk7XG4gICAgfSBlbHNlIGlmIChwb3MueCA+IHBvcy50YXJnZXRYKSB7XG4gICAgICAgIHBvcy54ID0gTWF0aC5tYXgocG9zLnggLSBzdGVwLCBwb3MudGFyZ2V0WCk7XG4gICAgfVxuXG4gICAgaWYgKHBvcy55IDwgcG9zLnRhcmdldFkpIHtcbiAgICAgICAgcG9zLnkgPSBNYXRoLm1pbihwb3MueSArIHN0ZXAsIHBvcy50YXJnZXRZKTtcbiAgICB9IGVsc2UgaWYgKHBvcy55ID4gcG9zLnRhcmdldFkpIHtcbiAgICAgICAgcG9zLnkgPSBNYXRoLm1heChwb3MueSAtIHN0ZXAsIHBvcy50YXJnZXRZKTtcbiAgICB9XG5cbiAgICB2ZWwuaXNNb3ZpbmcgPVxuICAgICAgICBwb3MueCAhPT0gcG9zLnRhcmdldFggfHxcbiAgICAgICAgcG9zLnkgIT09IHBvcy50YXJnZXRZO1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrZWQoeCwgeSwgbWFwRGF0YSwgdGlsZVNpemUsIHBsYXllclNpemUgPSB0aWxlU2l6ZSkge1xuICAgIGNvbnN0IHBhZGRpbmcgPSA0O1xuXG4gICAgY29uc3QgbGVmdCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh4ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCByaWdodCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh4ICsgcGxheWVyU2l6ZSAtIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgdG9wID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IGJvdHRvbSA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGxheWVyU2l6ZSAtIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChsZWZ0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwocmlnaHQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChsZWZ0LCBib3R0b20sIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwocmlnaHQsIGJvdHRvbSwgbWFwRGF0YSlcbiAgICApO1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrZWRDZWxsKHgsIHksIG1hcERhdGEpIHtcbiAgICBjb25zdCBjZWxsID0gbWFwRGF0YVt5XSAmJiBtYXBEYXRhW3ldW3hdO1xuXG4gICAgcmV0dXJuIGNlbGwgIT09IDAgJiYgY2VsbCAhPT0gMjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBwb3dlclVwU3lzdGVtKHdvcmxkLCBvblBvd2VyVXBQaWNrZWQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1BsYXllcicpO1xuICAgIGNvbnN0IHBvd2VyVXBzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBQb3MgfHwgIXZlbCB8fCAhcGxheWVyKSBjb250aW51ZTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBVcEVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgdXBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocFVwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBVcCA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXVwUG9zIHx8ICFwVXAgfHwgcFVwLnBpY2tlZFVwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgLy8gR3JpZC1iYXNlZCBjb2xsaXNpb246IHBsYXllciBncmlkIHBvc2l0aW9uIG1hdGNoZXMgcG93ZXItdXAgZ3JpZCBwb3NpdGlvblxuICAgICAgICAgICAgaWYgKHBQb3MuZ3JpZFggPT09IHVwUG9zLmdyaWRYICYmIHBQb3MuZ3JpZFkgPT09IHVwUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcFVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBkaWZmZXJlbnQgcG93ZXItdXAgdHlwZXNcbiAgICAgICAgICAgICAgICBpZiAocFVwLnR5cGUgPT09ICdTUEVFRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmVsLnNwZWVkID0gTWF0aC5taW4odmVsLnNwZWVkICsgMSwgOCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0ZMQU1FJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBwb3dlci11cCdzIERPTSBlbGVtZW50IGZyb20gdGhlIHNjcmVlblxuICAgICAgICAgICAgICAgIGlmIChwVXAuZWwgJiYgcFVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcFVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocFVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBOb3RpZnkgZ2FtZS5qcyB2aWEgY2FsbGJhY2sgKGhhbmRsZXMgSFVEIHVwZGF0ZSArIHNlcnZlciBzeW5jKVxuICAgICAgICAgICAgICAgIC8vIENSSVRJQ0FMOiBUaGlzIHRyaWdnZXJzIHVwZGF0ZUh1ZFN0YXRzLCBOT1Qgb25QbGF5ZXJIdXJ0XG4gICAgICAgICAgICAgICAgaWYgKG9uUG93ZXJVcFBpY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICBvblBvd2VyVXBQaWNrZWQocGxheWVyLmlkLCBwVXAudHlwZSwgdXBQb3MuZ3JpZFgsIHVwUG9zLmdyaWRZKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBEZXN0cm95IHRoZSBwb3dlci11cCBlbnRpdHkgZnJvbSB0aGUgd29ybGQgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KHBVcEVudGl0eSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtIRUFSVCBERVNUUk9ZRURdIEhlYXJ0IGVudGl0eSByZW1vdmVkIGZyb20gd29ybGQgYXQgKCR7dXBQb3MuZ3JpZFh9LCAke3VwUG9zLmdyaWRZfSlgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwYXduUG93ZXJVcCh3b3JsZCwgZ3gsIGd5LCBjb250YWluZXIsIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBzZWVkID0gZ3ggKiA3Mzg1NjA5MyBeIGd5ICogMTkzNDk2NjM7XG4gICAgY29uc3Qgc2VlZFJhbmRvbSA9IChNYXRoLnNpbihzZWVkKSAqIDEwMDAwKSAtIE1hdGguZmxvb3IoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCk7XG4gICAgXG4gICAgaWYgKHNlZWRSYW5kb20gPiAwLjM1KSByZXR1cm47XG5cbiAgICBjb25zdCB0eXBlcyA9IFsnU1BFRUQnLCAnQk9NQlMnLCAnRkxBTUUnXTtcbiAgICBjb25zdCB0eXBlSW5kZXggPSBNYXRoLmZsb29yKChNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCAtIE1hdGguZmxvb3IoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDApKSAqIHR5cGVzLmxlbmd0aCk7XG4gICAgY29uc3QgcmFuZG9tVHlwZSA9IHR5cGVzW3R5cGVJbmRleF07XG5cbiAgICBjb25zdCBwVXBFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYOiBneCwgZ3JpZFk6IGd5LCB4OiBneCAqIHRpbGVTaXplLCB5OiBneSAqIHRpbGVTaXplIH0pO1xuICAgIFxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSBgcG93ZXJ1cCBwb3dlcnVwLSR7cmFuZG9tVHlwZS50b0xvd2VyQ2FzZSgpfWA7XG4gICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBkaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUubGVmdCA9IGAke2d4ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS50b3AgPSBgJHtneSAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnLCB7IHR5cGU6IHJhbmRvbVR5cGUsIGVsOiBkaXYgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcmVuZGVyU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBhbmltUm93cykge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1JlbmRlcmFibGUnKTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG5cbiAgICAgICAgaWYgKCFyZW5kZXJhYmxlLmVsKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHJlbmRlcmFibGUuc3RhdGU7XG4gICAgICAgIGNvbnN0IHRhcmdldFJvdyA9IGFuaW1Sb3dzW3N0YXRlXVt2ZWwuZGlyZWN0aW9uXTtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlc2V0IGFuaW1hdGlvbiB3aGVuIHJvdyBvciBzdGF0ZSBjaGFuZ2VzXG4gICAgICAgIGlmIChyZW5kZXJhYmxlLnJvdyAhPT0gdGFyZ2V0Um93IHx8IHJlbmRlcmFibGUubGFzdFN0YXRlICE9PSBzdGF0ZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5yb3cgPSB0YXJnZXRSb3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RTdGF0ZSA9IHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZnJhbWVDb3VudCA9IHN0YXRlID09PSAnUlVOJyA/IHJlbmRlcmFibGUucnVuRnJhbWVzIDogcmVuZGVyYWJsZS5pZGxlRnJhbWVzO1xuICAgICAgICBjb25zdCBmcmFtZURlbGF5ID0gc3RhdGUgPT09ICdSVU4nID8gMTAwMCAvIHJlbmRlcmFibGUuZnBzIDogMTAwMCAvIHJlbmRlcmFibGUuaWRsZUZwcztcblxuICAgICAgICBpZiAobm93IC0gcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID4gZnJhbWVEZWxheSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKyAxKSAlIGZyYW1lQ291bnQ7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3NYID0gLShyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSAqIHJlbmRlcmFibGUuZnJhbWVXaWR0aCk7XG4gICAgICAgIGNvbnN0IHBvc1kgPSAtKHJlbmRlcmFibGUucm93ICogcmVuZGVyYWJsZS5mcmFtZUhlaWdodCk7XG4gICAgICAgIFxuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGAke3Bvc1h9cHggJHtwb3NZfXB4YDtcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtwb3MueH1weCwgJHtwb3MueX1weCwgMClgO1xuICAgIH1cbn1cbiIsIi8vIC9zcmMvZWNzL3dvcmxkLmpzXG5cbmV4cG9ydCBjbGFzcyBXb3JsZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubmV4dEVudGl0eUlkID0gMDtcbiAgICAgICAgdGhpcy5lbnRpdGllcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gbmV3IE1hcCgpOyBcbiAgICAgICAgdGhpcy5zeXN0ZW1zID0gW107XG4gICAgfVxuXG4gICAgY3JlYXRlRW50aXR5KCkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLm5leHRFbnRpdHlJZCsrO1xuICAgICAgICB0aGlzLmVudGl0aWVzLmFkZChlbnRpdHkpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cblxuICAgIGRlc3Ryb3lFbnRpdHkoZW50aXR5KSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIGZvciAoY29uc3QgW2NvbXBvbmVudE5hbWUsIGNvbXBvbmVudE1hcF0gb2YgdGhpcy5jb21wb25lbnRzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSwgY29tcG9uZW50RGF0YSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5jb21wb25lbnRzLmhhcyhjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnNldChjb21wb25lbnROYW1lLCBuZXcgTWFwKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSkuc2V0KGVudGl0eSwgY29tcG9uZW50RGF0YSk7XG4gICAgfVxuXG4gICAgZ2V0Q29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50TWFwID8gY29tcG9uZW50TWFwLmdldChlbnRpdHkpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJlbW92ZUNvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudE1hcCkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcXVlcnkoLi4uY29tcG9uZW50TmFtZXMpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudE5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZmlyc3RNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzWzBdKTtcbiAgICAgICAgaWYgKCFmaXJzdE1hcCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBmaXJzdE1hcC5rZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBoYXNBbGwgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb21wb25lbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmICghbWFwIHx8ICFtYXAuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzQWxsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNBbGwgJiYgdGhpcy5lbnRpdGllcy5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZFN5c3RlbShzeXN0ZW1GdW5jdGlvbikge1xuICAgICAgICB0aGlzLnN5c3RlbXMucHVzaChzeXN0ZW1GdW5jdGlvbik7XG4gICAgfVxuXG4gICAgdXBkYXRlKGR0LCBub3cpIHtcbiAgICAgICAgZm9yIChjb25zdCBzeXN0ZW0gb2YgdGhpcy5zeXN0ZW1zKSB7XG4gICAgICAgICAgICBzeXN0ZW0odGhpcywgZHQsIG5vdyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gV2luTWVudShwcm9wcykge1xuICAgIGNvbnN0IHdpbm5lck5hbWUgPSBwcm9wcy53aW5uZXJOYW1lIHx8IFwiQSBQbGF5ZXJcIjtcblxuICAgIGNvbnN0IHJlcGxheUJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+UGxheSBBZ2FpbjwvYnV0dG9uPjtcblxuICAgIHJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAvLyBFeHBsaWNpdGx5IGNsb3NlIHRoZSBvbGQgV2ViU29ja2V0IHRvIHByZXZlbnQgem9tYmllIGNvbm5lY3Rpb25zXG4gICAgICAgIGlmICh3aW5kb3cuc29ja2V0KSB7IFxuICAgICAgICAgICAgd2luZG93LnNvY2tldC5jbG9zZSgpOyBcbiAgICAgICAgICAgIHdpbmRvdy5zb2NrZXQgPSBudWxsOyBcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhcmQgcmVsb2FkIHRvIHdpcGUgSlMgbWVtb3J5IGFuZCBzdGFydCBmcm9tIGEgY2xlYW4gc2xhdGVcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVudS1ib3hcIj5cbiAgICAgICAgICAgIDxoMT57d2lubmVyTmFtZS50b1VwcGVyQ2FzZSgpfSBXT04hPC9oMT5cbiAgICAgICAgICAgIDxwPlRoZSBsYXN0IHBsYXllciBzdGFuZGluZyB0YWtlcyB0aGUgY3Jvd24uPC9wPlxuICAgICAgICAgICAge3JlcGxheUJ0bn1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEdSSURfQk9SREVSX1NJWkUgPSA2O1xuY29uc3QgR0FNRV9DSFJPTUVfV0lEVEggPSA3MjtcbmNvbnN0IEdBTUVfQ0hST01FX0hFSUdIVCA9IDE1MDtcblxuY29uc3QgaW1hZ2VzID0ge1xuICAgIDI6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiLFxuICAgIDM6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX3dhbGwucG5nXCIsXG4gICAgNDogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZXhwbG9pdC5wbmdcIixcbn07XG5cbmNvbnN0IFtwbGF5ZXJOYW1lLCBzZXRQbGF5ZXJOYW1lXSA9IGNyZWF0ZVNpZ25hbChcIlBsYXllciAxXCIpO1xuY29uc3QgW2xpdmVzLCBzZXRMaXZlc10gPSBjcmVhdGVTaWduYWwoMyk7XG5jb25zdCBbc3BlZWQsIHNldFNwZWVkXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtib21icywgc2V0Qm9tYnNdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW3JhbmdlLCBzZXRSYW5nZV0gPSBjcmVhdGVTaWduYWwoMSk7XG5leHBvcnQgeyBzZXRQbGF5ZXJOYW1lLCBzZXRMaXZlcywgc2V0U3BlZWQsIHNldEJvbWJzLCBzZXRSYW5nZSB9O1xuXG5jb25zdCBuYW1lRWwgPSA8c3BhbiBjbGFzcz1cInBsYXllci1uYW1lXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbmFtZUVsLnRleHRDb250ZW50ID0gcGxheWVyTmFtZSgpOyB9KTtcblxuY29uc3QgbGl2ZXNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgbGl2ZXMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3Qgc3BlZWRFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgc3BlZWQtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgYm9tYnNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgYm9tYnMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgcmFuZ2VFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgcmFuZ2UtdmFsdWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBsaXZlc0VsLnRleHRDb250ZW50ID0gbGl2ZXMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBzcGVlZEVsLnRleHRDb250ZW50ID0gc3BlZWQoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBib21ic0VsLnRleHRDb250ZW50ID0gYm9tYnMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyByYW5nZUVsLnRleHRDb250ZW50ID0gcmFuZ2UoKTsgfSk7XG5cbmZ1bmN0aW9uIEdhbWUoeyBncmlkIH0pIHtcbiAgICBjb25zdCBib2FyZFdpZHRoID0gZ3JpZFswXS5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRIZWlnaHQgPSBncmlkLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZE91dGVyV2lkdGggPSBib2FyZFdpZHRoICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3QgYm9hcmRPdXRlckhlaWdodCA9IGJvYXJkSGVpZ2h0ICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBib2FyZFdpZHRoIDogd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRIZWlnaHQgOiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY29uc3Qgc2NhbGUgPSBNYXRoLm1pbihcbiAgICAgICAgMSxcbiAgICAgICAgTWF0aC5tYXgoMC4yLCAodmlld3BvcnRXaWR0aCAtIEdBTUVfQ0hST01FX1dJRFRIKSAvIGJvYXJkT3V0ZXJXaWR0aCksXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0SGVpZ2h0IC0gR0FNRV9DSFJPTUVfSEVJR0hUKSAvIGJvYXJkT3V0ZXJIZWlnaHQpXG4gICAgKTtcbiAgICBjb25zdCByb3dzID0gW107XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IGdyaWQubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCBncmlkW3Jvd0luZGV4XS5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBncmlkW3Jvd0luZGV4XVtjb2xJbmRleF07XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gXCJ0aWxlXCI7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBgd2lkdGg6JHtUSUxFX1NJWkV9cHg7aGVpZ2h0OiR7VElMRV9TSVpFfXB4O2A7XG5cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAyIHx8IGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS1mbG9vclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS13YWxsXCI7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzNdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbNF19KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMCB8fCBjZWxsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzJdfSlgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxscy5wdXNoKDxkaXYgY2xhc3M9e2NsYXNzTmFtZX0gZGF0YS14PXtjb2xJbmRleH0gZGF0YS15PXtyb3dJbmRleH0gc3R5bGU9e3N0eWxlfT48L2Rpdj4pO1xuICAgICAgICB9XG4gICAgICAgIHJvd3MucHVzaCg8ZGl2IGNsYXNzPVwiZ3JpZC1yb3dcIj57Y2VsbHN9PC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWdsYXNzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWJhclwiPlxuICAgICAgICAgICAgICAgICAgICB7bmFtZUVsfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+TGl2ZXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpdmVzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+U3BlZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwZWVkRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+Qm9tYnM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvbWJzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+UmFuZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JhbmdlRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtYm9hcmQtZnJhbWVcIiBzdHlsZT17YHdpZHRoOiR7Ym9hcmRPdXRlcldpZHRoICogc2NhbGV9cHg7aGVpZ2h0OiR7Ym9hcmRPdXRlckhlaWdodCAqIHNjYWxlfXB4O2B9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBpZD1cImdhbWUtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZ2FtZS1ncmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtgcG9zaXRpb246cmVsYXRpdmU7d2lkdGg6JHtib2FyZFdpZHRofXB4O2hlaWdodDoke2JvYXJkSGVpZ2h0fXB4O3RyYW5zZm9ybTpzY2FsZSgke3NjYWxlfSk7YH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IENoYXRQbGF5ZXJzIGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxubGV0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSBjcmVhdGVTaWduYWwoe30pO1xuZXhwb3J0IHsgc2V0U3RhdGVzIH07XG5cbmxldCByb29tSWRFbCA9IDxwPlJvb20gSUQ6IDwvcD47XG5sZXQgcGxheWVyc0VsID0gPHA+UGxheWVyczogIC8gNDwvcD47XG5sZXQgdGV4dEVsID0gPHA+PC9wPjtcbmxldCB0aW1lckVsID0gPHA+VGltZXI6IDwvcD47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcyA9IHN0YXRlcygpO1xuICAgIHJvb21JZEVsLnRleHRDb250ZW50ID0gYFJvb20gSUQ6ICR7cy5yb29tSWR9YDtcbiAgICBwbGF5ZXJzRWwudGV4dENvbnRlbnQgPSBgUGxheWVyczogJHtzLnBsYXllcnNDb3VudH0gLyA0YDtcbiAgICB0ZXh0RWwudGV4dENvbnRlbnQgPSBzLnRleHQgfHwgXCJcIjtcblxuICAgIGlmIChzLmdhbWVTdGFydGVkKSB7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBcIlRpbWVyOiBHYW1lIHN0YXJ0ZWRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0aW1lclRleHQgPSAoIXMuc2Vjb25kc0xlZnQpID8gXCJXYWl0aW5nIGZvciBvbmUgbW9yZSBwbGF5ZXJcIiA6IGAke3Muc2Vjb25kc0xlZnR9IHNlY29uZHNgO1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gYFRpbWVyOiAke3RpbWVyVGV4dH1gO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBMb2JieSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29uYXRpbmVyLWxvYmJ5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9iYnktYm94XCI+XG4gICAgICAgICAgICAgICAgPGgxPkxvYmJ5PC9oMT5cbiAgICAgICAgICAgICAgICB7cm9vbUlkRWx9XG4gICAgICAgICAgICAgICAge3BsYXllcnNFbH1cbiAgICAgICAgICAgICAgICB7dGV4dEVsfVxuICAgICAgICAgICAgICAgIHt0aW1lckVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q2hhdFBsYXllcnMgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2JieTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5jb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbnJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbmxldCBtZW51RWwgPSAoXG4gICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgIDxoMT5Zb3UgV2luITwvaDE+XG4gICAgICAgIDxwPkFsbCBvdGhlciBwbGF5ZXJzIGhhdmUgbGVmdCB0aGUgZ2FtZS48L3A+XG4gICAgICAgIHtyZXBsYXlCdG59XG4gICAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZW51KCkge1xuICAgIHJldHVybiBtZW51RWw7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHN1Ym1pdHRlZCA9IGZhbHNlO1xuXG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoc3VibWl0dGVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgbmlja25hbWUgPSBmb3JtRGF0YS5nZXQoXCJuaWNrbmFtZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFuaWNrbmFtZSB8fCBuaWNrbmFtZS5sZW5ndGggPiAyMCkgcmV0dXJuO1xuXG4gICAgICAgIHN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHNldFBsYXllck5hbWUobmlja25hbWUpO1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwibmlja25hbWVfb2ZfdGhlX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmlja25hbWUtaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW50ZXIgeW91ciBuYW1lXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmVnaXN0ZXItYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPnN0YXJ0IHBsYXlpbmc8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XG4iLCJjbGFzcyBTb3VuZCB7XG4gICAgY29uc3RydWN0b3Ioc3JjKSB7XG4gICAgICAgIHRoaXMubXVzaWMgPSBuZXcgQXVkaW8oc3JjKTtcbiAgICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcblxuICAgICAgICB0aGlzLm11c2ljLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNDtcblxuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc05hbWUgPSBcInNvdW5kLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5hcHBlbmQodGhpcy5pY29uKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGUoKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5idXR0b24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wbGF5KCksIHsgb25jZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLm11c2ljLnBsYXkoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11c2ljLnBhdXNlZCB8fCB0aGlzLm11c2ljLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb25cIik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQnV0dG9uKCkge1xuICAgICAgICBjb25zdCBpc011dGVkID0gdGhpcy5tdXNpYy5tdXRlZCB8fCB0aGlzLm11c2ljLnBhdXNlZDtcblxuICAgICAgICB0aGlzLmljb24uY2xhc3NOYW1lID0gaXNNdXRlZCA/IFwiZmEtc29saWQgZmEtdm9sdW1lLW9mZlwiIDogXCJmYS1zb2xpZCBmYS12b2x1bWUtaGlnaFwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtbXV0ZWRcIiwgaXNNdXRlZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VuZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAvYXBwLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwicHJvcHMiLCJjaGlsZHJlbiIsImVsZSIsImRvY3VtZW50Iiwia2V5Iiwic3RhcnRzV2l0aCIsImV2ZW50TmFtZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwiZmxhdENoaWxkcmVuIiwiZmxhdCIsIkluZmluaXR5IiwiYXBwZW5kIiwiZmlsdGVyIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJyZW5kZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwicmVwbGFjZUNoaWxkcmVuIiwiUm91dGVyIiwicm91dGVyIiwiZWZmZWN0U3RhY2siLCJhY3RpdmVFZmZlY3QiLCJjcmVhdGVTaWduYWwiLCJpbml0aWFsVmFsdWUiLCJ2YWx1ZSIsImVmZmVjdHMiLCJTZXQiLCJSZWFkIiwiYWRkIiwiV3JpdGUiLCJuZXdWYWx1ZSIsImZuIiwiZm9yRWFjaCIsImVmZmVjdCIsImNyZWF0ZUVmZmVjdCIsInB1c2giLCJwb3AiLCJsZW5ndGgiLCJSb3V0ZXMiLCJPYmplY3QiLCJjcmVhdGUiLCJGaXJzdFJlc29sdmUiLCJvbiIsInBhdGgiLCJoYW5kbGVyIiwibmF2aWdhdGUiLCJoaXN0b3J5IiwibmF2aWdhdGlvbiIsInJlc29sdmUiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwidXJsIiwiVVJMIiwiaHJlZiIsImxpc3RlbiIsIm9uRXJyb3I0MDQiLCJldmVudCIsImRlc3RpbmF0aW9uIiwiaW50ZXJjZXB0IiwiY29uc29sZSIsImxvZyIsIlJlZ2lzdGVyIiwiR2FtZSIsIk1lbnUiLCJMb2JieSIsIldpbk1lbnUiLCJzZXRTdGF0ZXMiLCJzZXRQbGF5ZXJOYW1lIiwic2V0SHVkUGxheWVyTmFtZSIsIlNvdW5kIiwic2V0TWVzc2FnZXMiLCJHYW1lRW5naW5lIiwiaGFuZGxlUGxheWVyRGVhdGgiLCJyb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3c3MiLCJXZWJTb2NrZXQiLCJ3aW5kb3ciLCJob3N0bmFtZSIsInNvdW5kIiwiY3VycmVudEdhbWVFbmdpbmUiLCJpbml0IiwiYm9keSIsImNsYXNzTmFtZSIsImFsZXJ0Iiwid3MiLCJtZXNzYWdlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsInF1ZXJ5U2VsZWN0b3IiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJzZWNvbmRzTGVmdCIsInRleHQiLCJkZXN0cm95IiwiZ3JpZCIsInNldFRpbWVvdXQiLCJnYW1lQ29udGFpbmVyIiwibG9jYWxQbGF5ZXIiLCJwbGF5ZXJzIiwiZmluZCIsInBsYXllciIsImlkIiwieW91clBsYXllcklkIiwibmlja25hbWUiLCJlbmdpbmUiLCJlcnJvciIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwid2lubmVyTmFtZSIsImVudGl0eSIsInBsYXllckVudGl0aWVzIiwiZ2V0IiwiU3RyaW5nIiwicGxheWVySWQiLCJ3b3JsZCIsImRlc3Ryb3lFbnRpdHkiLCJkZWxldGUiLCJwcmV2IiwiaGFuZGxlUmVtb3RlTW92ZSIsInBheWxvYWQiLCJoYW5kbGVSZW1vdGVCb21iIiwiaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZCIsImhhbmRsZVJlbW90ZUl0ZW1QaWNrdXAiLCJlcnIiLCJtZXNzYWdlcyIsIkNoYXRQbGF5ZXJzIiwibWVzc2FnZXNDb250YWluZXIiLCJjbGFzcyIsIm1zZ3MiLCJtc2ciLCJwIiwidGV4dENvbnRlbnQiLCJyZW1vdmVDaGlsZCIsImZpcnN0RWxlbWVudENoaWxkIiwidW5zaGlmdCIsImJyb2FkY2FzdE1lc3NhZ2UiLCJlIiwicHJldmVudERlZmF1bHQiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwidGFyZ2V0IiwidHJpbSIsInJlc2V0Iiwic2VuZCIsInN0cmluZ2lmeSIsIm9uU3VibWl0IiwibmFtZSIsInBsYWNlaG9sZGVyIiwibWF4bGVuZ3RoIiwiUG9zaXRpb25Db21wb25lbnQiLCJneCIsImd5IiwidGlsZVNpemUiLCJncmlkWCIsImdyaWRZIiwieCIsInkiLCJ0YXJnZXRYIiwidGFyZ2V0WSIsIlZlbG9jaXR5Q29tcG9uZW50IiwiYmFzZVNwZWVkIiwic3BlZWQiLCJpc01vdmluZyIsImRpcmVjdGlvbiIsIklucHV0Q29tcG9uZW50IiwiaW5wdXRRdWV1ZSIsIlJlbmRlcmFibGVDb21wb25lbnQiLCJlbCIsImZyYW1lV2lkdGgiLCJmcmFtZUhlaWdodCIsInRvdGFsRnJhbWVzIiwiZnBzIiwiY3VycmVudEZyYW1lIiwicnVuRnJhbWVzIiwiaWRsZUZyYW1lcyIsImlkbGVGcHMiLCJsYXN0RnJhbWVUaW1lIiwicm93Iiwic3RhdGUiLCJsYXN0U3RhdGUiLCJQbGF5ZXJDb21wb25lbnQiLCJjaGFyVHlwZSIsImlzTG9jYWwiLCJCb21iQ29tcG9uZW50Iiwib3duZXJJZCIsInRpbWVyIiwicmFuZ2UiLCJleHBsb2RlZCIsIkV4cGxvc2lvbkNvbXBvbmVudCIsImR1cmF0aW9uIiwiUG93ZXJVcENvbXBvbmVudCIsInBpY2tlZFVwIiwiQmVoYXZpb3JDb21wb25lbnQiLCJnaG9zdE1vZGUiLCJ0aHJvd2FibGUiLCJkZXRvbmF0b3IiLCJmYXN0U2hvZXNMZXZlbCIsImJvbWJzIiwibWF4IiwiY3VycmVudCIsIldvcmxkIiwibW92ZW1lbnRTeXN0ZW0iLCJyZW5kZXJTeXN0ZW0iLCJib21iU3lzdGVtIiwiZGFtYWdlU3lzdGVtIiwiY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyIsInNwYXduSGVhcnRQb3dlclVwIiwicG93ZXJVcFN5c3RlbSIsInNwYXduUG93ZXJVcCIsInNldEJvbWJzIiwic2V0TGl2ZXMiLCJzZXRSYW5nZSIsInNldFNwZWVkIiwiVElMRV9TSVpFIiwiQU5JTUFUSU9OX1JPV1MiLCJSVU4iLCJ1cCIsImxlZnQiLCJkb3duIiwicmlnaHQiLCJJRExFIiwiY29uc3RydWN0b3IiLCJjYW52YXNDb250YWluZXIiLCJtYXBEYXRhIiwic29ja2V0IiwibG9jYWxQbGF5ZXJFbnRpdHkiLCJNYXAiLCJwbGF5ZXJJbmZvIiwibGFzdFRpbWUiLCJyZW1vdmVJbnB1dExpc3RlbmVycyIsImFuaW1hdGlvbkZyYW1lIiwicnVubmluZyIsImNsYWltZWRQb3dlclVwcyIsImxvc3NNb2RhbFRyaWdnZXJlZCIsImlucHV0RW5hYmxlZCIsImdhbWVFbmRlZCIsImxvY2FsUGxheWVySWQiLCJhbGxQbGF5ZXJzIiwidG90YWxQbGF5ZXJzIiwibm9ybWFsaXplZExvY2FsUGxheWVySWQiLCJwRGF0YSIsInBsYXllckVudGl0eSIsImNyZWF0ZUVudGl0eSIsInNldCIsInBsYXllckRpdiIsImRpc2Nvbm5lY3RlZCIsImNvbG9yIiwic3R5bGUiLCJwb3NpdGlvbiIsInpJbmRleCIsIndpbGxDaGFuZ2UiLCJzeCIsInN5IiwiYWRkQ29tcG9uZW50IiwicGxheWVyQ29tcCIsImxpdmVzIiwibWF4Qm9tYnMiLCJib21iUmFuZ2UiLCJ1cGRhdGVIdWRTdGF0cyIsInNldHVwSW5wdXQiLCJ3YXJuIiwibWFwIiwicmVnaXN0ZXJTeXN0ZW1zIiwicGVyZm9ybWFuY2UiLCJub3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJnYW1lTG9vcCIsImlucHV0IiwiZ2V0Q29tcG9uZW50IiwiZ2V0S2V5RGlyZWN0aW9uIiwiaGFuZGxlS2V5RG93biIsImRpciIsImluY2x1ZGVzIiwiY29kZSIsImRyb3BCb21iIiwiaGFuZGxlS2V5VXAiLCJkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInBvcyIsImN1cnJlbnRCb21icyIsInF1ZXJ5IiwiYkVudGl0eSIsImNyZWF0ZWQiLCJjcmVhdGVCb21iIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJleGlzdHMiLCJzb21lIiwiYm9tYiIsImJvbWJFbnRpdHkiLCJib21iRGl2IiwidG9wIiwiYm9tYkNvbXAiLCJBcnJheSIsImZyb20iLCJrZXlzIiwidmVsIiwicmVuZGVyYWJsZSIsInJlbW92ZVBvd2VyVXBBdCIsImFwcGx5UG93ZXJVcCIsIm5ld0xpdmVzIiwicG93ZXJVcHMiLCJwb3dlclVwIiwicGFyZW50Tm9kZSIsInZlbG9jaXR5IiwiTWF0aCIsIm1pbiIsInVwZGF0ZU1hcENlbGwiLCJ0aWxlIiwiYmFja2dyb3VuZEltYWdlIiwiZGVzdHJveUJveENhbGxiYWNrIiwiaGFzIiwib25QbGF5ZXJIdXJ0IiwicmVtYWluaW5nTGl2ZXMiLCJvblBvd2VyVXBQaWNrZWQiLCJicm9hZGNhc3RNb3ZlbWVudCIsImFkZFN5c3RlbSIsInciLCJkdCIsInVwZGF0ZSIsIm5leHROb3ciLCJoYW5kbGVHYW1lT3ZlciIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicm91bmQiLCJjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImdldFBsYXllck5hbWUiLCJnZXRJdGVtIiwiYWZmZWN0ZWRDZWxscyIsImNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzIiwiY2VsbCIsImV4cEVudGl0eSIsImV4cERpdiIsIndpZHRoIiwiaGVpZ2h0IiwiZXhwbG9zaW9ucyIsImV4cCIsImJ4IiwiYnkiLCJjZWxscyIsImRpcmVjdGlvbnMiLCJzdGVwcyIsImkiLCJ0eCIsInR5IiwiY2VsbFR5cGUiLCJoZWFydEVudGl0eSIsImhlYXJ0RGl2IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsImZvbnRTaXplIiwiZGVhdGhHcmlkWCIsImZsb29yIiwiZGVhdGhHcmlkWSIsInJlbW92ZUNvbXBvbmVudCIsInBQb3MiLCJpbnZpbmNpYmxlVW50aWwiLCJlUG9zIiwicGxheWVyR3JpZFgiLCJwbGF5ZXJHcmlkWSIsInByZXZpb3VzTGl2ZXMiLCJhbHJlYWR5UmVwb3J0ZWREZWFkIiwiZW50aXRpZXMiLCJkZWx0YSIsIlBMQVlFUl9TSVpFIiwiYmVoYXZpb3IiLCJtb3ZlVG93YXJkVGFyZ2V0IiwiYWN0aXZlSW5wdXQiLCJkeCIsImR5IiwiaGFzSW5wdXQiLCJuZXh0WCIsIm5leHRZIiwic25hcFRocmVzaG9sZCIsImlzQmxvY2tlZCIsImN1cnJlbnRUaWxlWCIsImRpZmZYIiwiYWJzIiwic2lnbiIsImN1cnJlbnRUaWxlWSIsImRpZmZZIiwibmV4dFhBZnRlclNuYXAiLCJuZXh0WUFmdGVyU25hcCIsInN0ZXAiLCJwbGF5ZXJTaXplIiwicGFkZGluZyIsImJvdHRvbSIsImlzQmxvY2tlZENlbGwiLCJwVXBFbnRpdHkiLCJ1cFBvcyIsInBVcCIsInNlZWQiLCJzZWVkUmFuZG9tIiwic2luIiwidHlwZXMiLCJ0eXBlSW5kZXgiLCJyYW5kb21UeXBlIiwiZGl2IiwiYW5pbVJvd3MiLCJ0YXJnZXRSb3ciLCJmcmFtZUNvdW50IiwiZnJhbWVEZWxheSIsInBvc1giLCJwb3NZIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwidHJhbnNmb3JtIiwibmV4dEVudGl0eUlkIiwiY29tcG9uZW50cyIsInN5c3RlbXMiLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50TWFwIiwiZW50cmllcyIsImNvbXBvbmVudERhdGEiLCJjb21wb25lbnROYW1lcyIsImZpcnN0TWFwIiwicmVzdWx0cyIsImhhc0FsbCIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwicmVwbGF5QnRuIiwiY2xvc2UiLCJ0b1VwcGVyQ2FzZSIsIkdSSURfQk9SREVSX1NJWkUiLCJHQU1FX0NIUk9NRV9XSURUSCIsIkdBTUVfQ0hST01FX0hFSUdIVCIsImltYWdlcyIsInBsYXllck5hbWUiLCJuYW1lRWwiLCJsaXZlc0VsIiwic3BlZWRFbCIsImJvbWJzRWwiLCJyYW5nZUVsIiwiYm9hcmRXaWR0aCIsImJvYXJkSGVpZ2h0IiwiYm9hcmRPdXRlcldpZHRoIiwiYm9hcmRPdXRlckhlaWdodCIsInZpZXdwb3J0V2lkdGgiLCJpbm5lcldpZHRoIiwidmlld3BvcnRIZWlnaHQiLCJpbm5lckhlaWdodCIsInNjYWxlIiwicm93cyIsInJvd0luZGV4IiwiY29sSW5kZXgiLCJzdGF0ZXMiLCJyb29tSWRFbCIsInBsYXllcnNFbCIsInRleHRFbCIsInRpbWVyRWwiLCJzIiwiZ2FtZVN0YXJ0ZWQiLCJ0aW1lclRleHQiLCJyZWxvYWQiLCJtZW51RWwiLCJzdWJtaXR0ZWQiLCJwbGF5ZXJFbnRlciIsImN1cnJlbnRUYXJnZXQiLCJzcmMiLCJtdXNpYyIsIkF1ZGlvIiwiYnV0dG9uIiwiaWNvbiIsImxvb3AiLCJ2b2x1bWUiLCJ0b2dnbGUiLCJwbGF5Iiwib25jZSIsInVwZGF0ZUJ1dHRvbiIsInRoZW4iLCJjYXRjaCIsInBhdXNlZCIsIm11dGVkIiwiaXNNdXRlZCIsImNsYXNzTGlzdCJdLCJzb3VyY2VSb290IjoiIn0=