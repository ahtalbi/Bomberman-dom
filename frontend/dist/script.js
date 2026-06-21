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
      (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_WinMenu_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        winnerName: message.winnerName
      }), root);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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d0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2hhdC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9tb3ZlbWVudFN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvcmVuZGVyU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvd29ybGQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL1dpbk1lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyIGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBNZW51IGZyb20gXCIuLi9wYWdlcy9tZW51XCI7XG5pbXBvcnQgTG9iYnkgZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgV2luTWVudSBmcm9tIFwiLi4vcGFnZXMvV2luTWVudS5qc3hcIjtcbmltcG9ydCB7IHNldFN0YXRlcyB9IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSBhcyBzZXRIdWRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBTb3VuZCBmcm9tIFwiLi4vdXRpbHMvc291bmRcIjtcbmltcG9ydCB7IHNldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5pbXBvcnQgeyBHYW1lRW5naW5lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7IFxuaW1wb3J0IHsgaGFuZGxlUGxheWVyRGVhdGggfSBmcm9tIFwiLi4vZWNzL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzXCI7IFxuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChgd3M6Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZX06NTAwMGApO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5sZXQgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwicm9vbV91cGRhdGVcIjpcbiAgICAgICAgY2FzZSBcImxvYmJ5X3RpbWVyXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuICAgICAgICAgICAgaWYgKCFyb290LnF1ZXJ5U2VsZWN0b3IoXCIuY29uYXRpbmVyLWxvYmJ5XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKDxMb2JieSAvPiwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWQsXG4gICAgICAgICAgICAgICAgcGxheWVyc0NvdW50OiBtZXNzYWdlLnBsYXllcnNDb3VudCxcbiAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogbWVzc2FnZS5zZWNvbmRzTGVmdCxcbiAgICAgICAgICAgICAgICB0ZXh0OiBtZXNzYWdlLnRleHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJsb2JieV9yZXNldFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJsb2JieS1wYWdlXCI7XG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb25hdGluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXRlcyh7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBcIlwiLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogMSxcbiAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogMTAsXG4gICAgICAgICAgICAgICAgdGV4dDogXCJXYWl0aW5nIGZvciBtb3JlIHBsYXllcnNcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfc3RhcnRlZFwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZW5kZXIoPEdhbWUgZ3JpZD17bWVzc2FnZS5ncmlkfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSAobWVzc2FnZS5wbGF5ZXJzIHx8IFtdKS5maW5kKHBsYXllciA9PiBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UueW91clBsYXllcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIGxvY2FsUGxheWVyLm5pY2tuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIdWRQbGF5ZXJOYW1lKGxvY2FsUGxheWVyLm5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBHYW1lRW5naW5lKGdhbWVDb250YWluZXIsIG1lc3NhZ2UuZ3JpZCwgd3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lLmluaXQobWVzc2FnZS55b3VyUGxheWVySWQsIG1lc3NhZ2UucGxheWVycyB8fCBbXSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2FtZSBjb250YWluZXIgd2FzIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwicm9vbV9hbG9uZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJnYW1lX3dvblwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxXaW5NZW51IHdpbm5lck5hbWU9e21lc3NhZ2Uud2lubmVyTmFtZX0gLz4sIHJvb3QpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcInBsYXllcl90dXJuZWRfaGVhcnRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGN1cnJlbnRHYW1lRW5naW5lLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcobWVzc2FnZS5wbGF5ZXJJZCkpO1xuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVQbGF5ZXJEZWF0aChjdXJyZW50R2FtZUVuZ2luZS53b3JsZCwgZW50aXR5LCA2NCk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLnBsYXllckVudGl0aWVzLmRlbGV0ZShTdHJpbmcobWVzc2FnZS5wbGF5ZXJJZCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJjaGF0X21lc3NhZ2VcIjpcbiAgICAgICAgICAgIHNldE1lc3NhZ2VzKHByZXYgPT4gWy4uLnByZXYgLG1lc3NhZ2UubWVzc2FnZV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfbW92ZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZU1vdmUobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm9tYl9kcm9wcGVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVCb21iKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBvd2VydXBfcGlja2VkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIml0ZW1fcGlja2VkXCI6XG4gICAgICAgICAgICAvLyBIYW5kbGUgcmVtb3RlIGhlYXJ0IHBpY2t1cCAtIHVwZGF0ZSB0aGUgcGxheWVyJ3MgbGl2ZXMgb24gYWxsIGNsaWVudHNcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZUl0ZW1QaWNrdXAobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yXCIsIGVycik7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZWRcIik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgd3NzO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCB3c3MgZnJvbSBcIi4uL2FwcC9hcHBcIjtcblxuY29uc3QgW21lc3NhZ2VzLCBzZXRNZXNzYWdlc10gPSBjcmVhdGVTaWduYWwoW10pO1xuZXhwb3J0IHsgc2V0TWVzc2FnZXMgfTtcblxuZnVuY3Rpb24gQ2hhdFBsYXllcnMoKSB7XG4gICAgY29uc3QgbWVzc2FnZXNDb250YWluZXIgPSA8ZGl2IGNsYXNzPVwibWVzc2FnZXNcIj48L2Rpdj47XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBtc2dzID0gbWVzc2FnZXMoKTtcbiAgICAgICAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBmb3IgKGxldCBtc2cgb2YgbXNncykge1xuICAgICAgICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IG1zZztcbiAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHApO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIucmVtb3ZlQ2hpbGQobWVzc2FnZXNDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgICAgIG1zZ3MudW5zaGlmdCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYnJvYWRjYXN0TWVzc2FnZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS50YXJnZXQpO1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGZvcm1EYXRhLmdldChcIm1lc3NhZ2VcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbWVzc2FnZSB8fCBtZXNzYWdlLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwiY2hhdF9tZXNzYWdlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICB9KSk7XG4gICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNoYXRcIiBvblN1Ym1pdD17YnJvYWRjYXN0TWVzc2FnZX0+XG4gICAgICAgICAgICB7bWVzc2FnZXNDb250YWluZXJ9XG4gICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibWVzc2FnZVwiIHBsYWNlaG9sZGVyPVwidHlwZSB0byB0aGUgb3RoZXIgcGxheWVycyAuLi5cIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5zZW5kPC9idXR0b24+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhdFBsYXllcnM7IiwiLy8gL3NyYy9lY3MvY29tcG9uZW50cy5qc1xuXG5leHBvcnQgY29uc3QgUG9zaXRpb25Db21wb25lbnQgPSAoZ3gsIGd5LCB0aWxlU2l6ZSA9IDY0KSA9PiAoe1xuICAgIGdyaWRYOiBneCxcbiAgICBncmlkWTogZ3ksXG4gICAgeDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB5OiBneSAqIHRpbGVTaXplLFxuICAgIHRhcmdldFg6IGd4ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WTogZ3kgKiB0aWxlU2l6ZVxufSk7XG5cbmV4cG9ydCBjb25zdCBWZWxvY2l0eUNvbXBvbmVudCA9IChiYXNlU3BlZWQgPSAyLjUpID0+ICh7XG4gICAgYmFzZVNwZWVkOiBiYXNlU3BlZWQsXG4gICAgc3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBpc01vdmluZzogZmFsc2UsXG4gICAgZGlyZWN0aW9uOiAnZG93bidcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5wdXRDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGlucHV0UXVldWU6IFtdXG59KTtcblxuZXhwb3J0IGNvbnN0IFJlbmRlcmFibGVDb21wb25lbnQgPSAoZWwsIGZyYW1lV2lkdGggPSA2NCwgZnJhbWVIZWlnaHQgPSA2NCwgdG90YWxGcmFtZXMgPSA0LCBmcHMgPSAxMikgPT4gKHtcbiAgICBlbDogZWwsXG4gICAgZnJhbWVXaWR0aDogZnJhbWVXaWR0aCxcbiAgICBmcmFtZUhlaWdodDogZnJhbWVIZWlnaHQsXG4gICAgY3VycmVudEZyYW1lOiAwLFxuICAgIHRvdGFsRnJhbWVzOiB0b3RhbEZyYW1lcyxcbiAgICBydW5GcmFtZXM6IDQsXG4gICAgaWRsZUZyYW1lczogMixcbiAgICBmcHM6IGZwcyxcbiAgICBpZGxlRnBzOiA0LFxuICAgIGxhc3RGcmFtZVRpbWU6IDAsXG4gICAgcm93OiAwLFxuICAgIHN0YXRlOiAnSURMRScsXG4gICAgbGFzdFN0YXRlOiAnSURMRSdcbn0pO1xuXG5leHBvcnQgY29uc3QgUGxheWVyQ29tcG9uZW50ID0gKGlkLCBjaGFyVHlwZSwgaXNMb2NhbCA9IGZhbHNlKSA9PiAoe1xuICAgIGlkOiBpZCxcbiAgICBjaGFyVHlwZTogY2hhclR5cGUsXG4gICAgaXNMb2NhbDogaXNMb2NhbFxufSk7XG5cbmV4cG9ydCBjb25zdCBCb21iQ29tcG9uZW50ID0gKG93bmVySWQsIHRpbWVyID0gMjAwMCwgcmFuZ2UgPSA0KSA9PiAoe1xuICAgIG93bmVySWQ6IG93bmVySWQsXG4gICAgdGltZXI6IHRpbWVyLFxuICAgIHJhbmdlOiByYW5nZSxcbiAgICBleHBsb2RlZDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgRXhwbG9zaW9uQ29tcG9uZW50ID0gKGR1cmF0aW9uID0gNTAwKSA9PiAoe1xuICAgIGR1cmF0aW9uOiBkdXJhdGlvblxufSk7XG5cbmV4cG9ydCBjb25zdCBQb3dlclVwQ29tcG9uZW50ID0gKHR5cGUpID0+ICh7XG4gICAgdHlwZTogdHlwZSwgXG4gICAgcGlja2VkVXA6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEJlaGF2aW9yQ29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBnaG9zdE1vZGU6IGZhbHNlLFxuICAgIHRocm93YWJsZTogZmFsc2UsXG4gICAgZGV0b25hdG9yOiBmYWxzZSxcbiAgICBmYXN0U2hvZXNMZXZlbDogMSxcbiAgICBib21iczoge1xuICAgICAgICBtYXg6IDEsXG4gICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgIHJhbmdlOiAyXG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQuanMnO1xuaW1wb3J0IHtcbiAgICBQb3NpdGlvbkNvbXBvbmVudCxcbiAgICBWZWxvY2l0eUNvbXBvbmVudCxcbiAgICBJbnB1dENvbXBvbmVudCxcbiAgICBSZW5kZXJhYmxlQ29tcG9uZW50LFxuICAgIFBsYXllckNvbXBvbmVudCxcbiAgICBCb21iQ29tcG9uZW50XG59IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5pbXBvcnQgeyBtb3ZlbWVudFN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9tb3ZlbWVudFN5c3RlbS5qcyc7XG5pbXBvcnQgeyByZW5kZXJTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvcmVuZGVyU3lzdGVtLmpzJztcbmltcG9ydCB7IGJvbWJTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyc7XG5pbXBvcnQgeyBkYW1hZ2VTeXN0ZW0sIGNoZWNrR2FtZUVuZENvbmRpdGlvbnMsIHNwYXduSGVhcnRQb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyc7XG5pbXBvcnQgV2luTWVudSBmcm9tICcuLi9wYWdlcy9XaW5NZW51LmpzeCc7XG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tICcuLi8uLi9taW5pLWZyYW1ld29yay9kb20uanMnO1xuXG5pbXBvcnQgeyBwb3dlclVwU3lzdGVtLCBzcGF3blBvd2VyVXAgfSBmcm9tICcuL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyc7XG5pbXBvcnQgeyBzZXRCb21icywgc2V0TGl2ZXMsIHNldFJhbmdlLCBzZXRTcGVlZCB9IGZyb20gJy4uL3BhZ2VzL2dhbWUnO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEFOSU1BVElPTl9ST1dTID0ge1xuICAgIFJVTjogeyB1cDogMzgsIGxlZnQ6IDM5LCBkb3duOiA0MCwgcmlnaHQ6IDQxIH0sXG4gICAgSURMRTogeyB1cDogMjIsIGxlZnQ6IDIzLCBkb3duOiAyNCwgcmlnaHQ6IDI1IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBHYW1lRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNDb250YWluZXIsIG1hcERhdGEsIHNvY2tldCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNhbnZhc0NvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gbWFwRGF0YTtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcbiAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IG51bGw7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucGxheWVySW5mbyA9IG5ldyBNYXAoKTsgLy8gU3RvcmUgb3JpZ2luYWwgcGxheWVyIGRhdGEgbGlrZSBuaWNrbmFtZVxuICAgICAgICB0aGlzLmxhc3RUaW1lID0gMDtcbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIC8vIFN0YXRlIGZsYWcgdG8gcHJldmVudCBtdWx0aXBsZSBsb3NzIG1vZGFsIHJlbmRlcnMgKFRoZSBMb29wIFRyYXAgZml4KVxuICAgICAgICB0aGlzLmxvc3NNb2RhbFRyaWdnZXJlZCA9IGZhbHNlO1xuICAgICAgICAvLyBGbGFnIHRvIHRyYWNrIGlmIGlucHV0IHNob3VsZCBiZSBkaXNhYmxlZFxuICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIC8vIEZsYWcgdG8gc3RvcCB0aGUgZ2FtZSBsb29wIG9uY2UgYSB3aW5uZXIgaXMgZGVjaWRlZFxuICAgICAgICB0aGlzLmdhbWVFbmRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXQobG9jYWxQbGF5ZXJJZCwgYWxsUGxheWVycykge1xuICAgICAgICB0aGlzLnRvdGFsUGxheWVycyA9IGFsbFBsYXllcnMubGVuZ3RoO1xuICAgICAgICBjb25zdCBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCA9IFN0cmluZyhsb2NhbFBsYXllcklkKTtcblxuICAgICAgICBhbGxQbGF5ZXJzLmZvckVhY2gocERhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVySWQgPSBTdHJpbmcocERhdGEuaWQpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVySW5mby5zZXQocGxheWVySWQsIHBEYXRhKTsgLy8gU3RvcmUgb3JpZ2luYWwgcGxheWVyIGRhdGFcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgICAgICBpZiAocERhdGEuZGlzY29ubmVjdGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IHBEYXRhLmNvbG9yIHx8IFwid2hpdGVcIjtcblxuICAgICAgICAgICAgcGxheWVyRGl2LmNsYXNzTmFtZSA9IGBwbGF5ZXIgcGxheWVyLSR7Y29sb3J9YDtcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuekluZGV4ID0gJzEwJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS53aWxsQ2hhbmdlID0gJ3RyYW5zZm9ybSc7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJEaXYpO1xuXG4gICAgICAgICAgICBjb25zdCBzeCA9IHBEYXRhLnggfHwgMTtcbiAgICAgICAgICAgIGNvbnN0IHN5ID0gcERhdGEueSB8fCAxO1xuXG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicsIFBvc2l0aW9uQ29tcG9uZW50KHN4LCBzeSwgVElMRV9TSVpFKSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScsIFZlbG9jaXR5Q29tcG9uZW50KDIuNSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScsIFJlbmRlcmFibGVDb21wb25lbnQocGxheWVyRGl2LCA2NCwgNjQsIDQsIDEyKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaXNMb2NhbCA9IHBsYXllcklkID09PSBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZDtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckNvbXAgPSBQbGF5ZXJDb21wb25lbnQocGxheWVySWQsIGNvbG9yLCBpc0xvY2FsKTtcbiAgICAgICAgICAgIHBsYXllckNvbXAubGl2ZXMgPSAzO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5tYXhCb21icyA9IDE7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmJvbWJSYW5nZSA9IDQ7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInLCBwbGF5ZXJDb21wKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMuc2V0KHBsYXllcklkLCBwbGF5ZXJFbnRpdHkpO1xuXG4gICAgICAgICAgICBpZiAoaXNMb2NhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBwbGF5ZXJFbnRpdHk7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnLCBJbnB1dENvbXBvbmVudCgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHBsYXllckVudGl0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbR2FtZUVuZ2luZV0gTG9jYWwgcGxheWVyIHdhcyBub3QgZm91bmRcIiwge1xuICAgICAgICAgICAgICAgIGxvY2FsUGxheWVySWQsXG4gICAgICAgICAgICAgICAgcGxheWVyczogYWxsUGxheWVycy5tYXAocGxheWVyID0+IHBsYXllci5pZCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTeXN0ZW1zKCk7XG5cbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChub3cpID0+IHRoaXMuZ2FtZUxvb3Aobm93KSk7XG4gICAgfVxuXG4gICAgc2V0dXBJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgaWYgKCFpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGdldEtleURpcmVjdGlvbiA9IChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1VwJyB8fCBrZXkgPT09ICd3JyB8fCBrZXkgPT09ICdaJyB8fCBrZXkgPT09ICd6JykgcmV0dXJuICd1cCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dEb3duJyB8fCBrZXkgPT09ICdzJyB8fCBrZXkgPT09ICdTJykgcmV0dXJuICdkb3duJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0xlZnQnIHx8IGtleSA9PT0gJ2EnIHx8IGtleSA9PT0gJ1EnIHx8IGtleSA9PT0gJ3EnKSByZXR1cm4gJ2xlZnQnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93UmlnaHQnIHx8IGtleSA9PT0gJ2QnIHx8IGtleSA9PT0gJ0QnKSByZXR1cm4gJ3JpZ2h0JztcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgLy8gSU5QVVQgRElTQUJMRUQ6IEltbWVkaWF0ZWx5IGlnbm9yZSBhbGwga2V5Ym9hcmQgaW5wdXRzIHdoZW4gcGxheWVyIGlzIGRlYWRcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dEVuYWJsZWQpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5pbnB1dFF1ZXVlLmluY2x1ZGVzKGRpcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZS51bnNoaWZ0KGRpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICcgJyB8fCBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wQm9tYigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleVVwID0gKGUpID0+IHtcbiAgICAgICAgICAgIC8vIElOUFVUIERJU0FCTEVEOiBJbW1lZGlhdGVseSBpZ25vcmUgYWxsIGtleWJvYXJkIGlucHV0cyB3aGVuIHBsYXllciBpcyBkZWFkXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5wdXRFbmFibGVkKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZSA9IGlucHV0LmlucHV0UXVldWUuZmlsdGVyKGQgPT4gZCAhPT0gZGlyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZHJvcEJvbWIoKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcblxuICAgICAgICBjb25zdCBjdXJyZW50Qm9tYnMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuZmlsdGVyKGJFbnRpdHkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGJFbnRpdHksICdCb21iJykub3duZXJJZCA9PT0gcGxheWVyLmlkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY3VycmVudEJvbWJzLmxlbmd0aCA+PSBwbGF5ZXIubWF4Qm9tYnMpIHJldHVybjtcblxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVCb21iKHBsYXllci5pZCwgcG9zLmdyaWRYLCBwb3MuZ3JpZFksIHBsYXllci5ib21iUmFuZ2UpO1xuICAgICAgICBpZiAoIWNyZWF0ZWQpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdEUk9QX0JPTUInLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHsgaWQ6IHBsYXllci5pZCwgeDogcG9zLmdyaWRYLCB5OiBwb3MuZ3JpZFksIHJhbmdlOiBwbGF5ZXIuYm9tYlJhbmdlIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUJvbWIob3duZXJJZCwgZ3JpZFgsIGdyaWRZLCByYW5nZSkge1xuICAgICAgICBjb25zdCBleGlzdHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuc29tZShlbnRpdHkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IGJvbWIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCb21iJyk7XG4gICAgICAgICAgICByZXR1cm4gYm9tYi5vd25lcklkID09PSBvd25lcklkICYmIHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGV4aXN0cykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGJvbWJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICBjb25zdCBib21iRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGJvbWJEaXYuY2xhc3NOYW1lID0gJ2JvbWInO1xuICAgICAgICBib21iRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnRvcCA9IGAke2dyaWRZICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS56SW5kZXggPSAnNic7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGJvbWJEaXYpO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFgsIGdyaWRZIH0pO1xuXG4gICAgICAgIGNvbnN0IGJvbWJDb21wID0gQm9tYkNvbXBvbmVudChvd25lcklkLCAyMDAwLCByYW5nZSk7XG4gICAgICAgIGJvbWJDb21wLmVsID0gYm9tYkRpdjtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInLCBib21iQ29tcCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZU1vdmUocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltoYW5kbGVSZW1vdGVNb3ZlXSBJbnZhbGlkIHBheWxvYWQ6XCIsIHBheWxvYWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gRW50aXR5IG5vdCBmb3VuZCBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH0uIEF2YWlsYWJsZSBwbGF5ZXJzOmAsIEFycmF5LmZyb20odGhpcy5wbGF5ZXJFbnRpdGllcy5rZXlzKCkpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gSWdub3JpbmcgbG9jYWwgcGxheWVyIHVwZGF0ZSBmb3IgJHtwYXlsb2FkLmlkfWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghcG9zIHx8ICF2ZWwgfHwgIXJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIE1pc3NpbmcgY29tcG9uZW50cyBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH06YCwgeyBwb3M6ICEhcG9zLCB2ZWw6ICEhdmVsLCByZW5kZXJhYmxlOiAhIXJlbmRlcmFibGUgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW2hhbmRsZVJlbW90ZU1vdmVdIFVwZGF0aW5nIHBsYXllciAke3BheWxvYWQuaWR9IHRvICgke3BheWxvYWQuZ3JpZFh9LCAke3BheWxvYWQuZ3JpZFl9KWApO1xuICAgICAgICB2ZWwuZGlyZWN0aW9uID0gcGF5bG9hZC5kaXJlY3Rpb24gfHwgdmVsLmRpcmVjdGlvbjtcbiAgICAgICAgdmVsLmlzTW92aW5nID0gcGF5bG9hZC5pc01vdmluZztcbiAgICAgICAgcG9zLmdyaWRYID0gcGF5bG9hZC5ncmlkWDtcbiAgICAgICAgcG9zLmdyaWRZID0gcGF5bG9hZC5ncmlkWTtcbiAgICAgICAgcG9zLnRhcmdldFggPSBwYXlsb2FkLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcGF5bG9hZC55O1xuICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gcGF5bG9hZC5zdGF0ZSB8fCAocGF5bG9hZC5pc01vdmluZyA/ICdSVU4nIDogJ0lETEUnKTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVCb21iKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3JlYXRlQm9tYihwYXlsb2FkLmlkLCBwYXlsb2FkLngsIHBheWxvYWQueSwgcGF5bG9hZC5yYW5nZSB8fCA0KTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8IHBheWxvYWQueCA9PT0gdW5kZWZpbmVkIHx8IHBheWxvYWQueSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCB8fCBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHJldHVybjtcblxuICAgICAgICB0aGlzLmFwcGx5UG93ZXJVcChlbnRpdHksIHBheWxvYWQudHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyByZW1vdGUgaGVhcnQgcGlja3VwIC0gdXBkYXRlcyBwbGF5ZXIgbGl2ZXMgYW5kIFVJIG9uIGFsbCBjbGllbnRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWQgLSB7IHBsYXllcklkLCBuZXdMaXZlcyB9XG4gICAgICovXG4gICAgaGFuZGxlUmVtb3RlSXRlbVBpY2t1cChwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5wbGF5ZXJJZCB8fCBwYXlsb2FkLm5ld0xpdmVzID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAvLyA0LiBFbnN1cmUgd2UgZGVzdHJveSB0aGUgaGVhcnQgZW50aXR5IGZyb20gdGhlIHJlbW90ZSBjbGllbnRzJyBzY3JlZW5zXG4gICAgICAgIGlmIChwYXlsb2FkLnggIT09IHVuZGVmaW5lZCAmJiBwYXlsb2FkLnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMS4gRmluZCB0aGUgcGxheWVyIGVudGl0eSB1c2luZyB0aGUgcGF5bG9hZCdzIHBsYXllcklkXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLnBsYXllcklkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBsYXllcikgcmV0dXJuO1xuXG4gICAgICAgIC8vIDIuIERvIE5PVCBhZGQgKzEuIFN0cmljdGx5IFNFVCB0aGUgc3RhdGUgdXNpbmcgdGhlIHBheWxvYWRcbiAgICAgICAgcGxheWVyLmxpdmVzID0gcGF5bG9hZC5uZXdMaXZlcztcblxuICAgICAgICAvLyAzLiBVcGRhdGUgdGhlIEhVRC9VSSBleHBsaWNpdGx5IHdpdGggbWVzc2FnZS5wYXlsb2FkLm5ld0xpdmVzXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMoZW50aXR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbUmVtb3RlIEl0ZW0gUGlja3VwXSBQbGF5ZXIgJHtwYXlsb2FkLnBsYXllcklkfSBwaWNrZWQgdXAgaGVhcnQuIE5ldyBsaXZlczogJHtwYXlsb2FkLm5ld0xpdmVzfWApO1xuICAgIH1cblxuICAgIHJlbW92ZVBvd2VyVXBBdChncmlkWCwgZ3JpZFkpIHtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMuYWRkKGAke2dyaWRYfSwke2dyaWRZfWApO1xuICAgICAgICBjb25zdCBwb3dlclVwcyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBvd2VyVXAgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXBvcyB8fCAhcG93ZXJVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwb3dlclVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChwb3dlclVwLmVsICYmIHBvd2VyVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwb3dlclVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG93ZXJVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlQb3dlclVwKGVudGl0eSwgdHlwZSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgdmVsb2NpdHkuc3BlZWQgPSBNYXRoLm1pbih2ZWxvY2l0eS5zcGVlZCArIDEsIDgpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgIC8vIEhFQVJUIHBvd2VyLXVwOiBpbmNyZW1lbnQgbGl2ZXMgKGNhcCBhdCAzKVxuICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5taW4oKHBsYXllci5saXZlcyB8fCAwKSArIDEsIDMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTeXN0ZW1zKCkge1xuICAgICAgICBjb25zdCB1cGRhdGVNYXBDZWxsID0gKHgsIHksIG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubWFwRGF0YVt5XSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLm1hcERhdGFbeV1beF0gPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gKTtcbiAgICAgICAgICAgIGlmICghdGlsZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aWxlLmNsYXNzTmFtZSA9ICd0aWxlIHRpbGUtZmxvb3InO1xuICAgICAgICAgICAgdGlsZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiKSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZGVzdHJveUJveENhbGxiYWNrID0gKHgsIHkpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYWltZWRQb3dlclVwcy5oYXMoYCR7eH0sJHt5fWApKSByZXR1cm47XG4gICAgICAgICAgICBzcGF3blBvd2VyVXAodGhpcy53b3JsZCwgeCwgeSwgdGhpcy5jb250YWluZXIsIFRJTEVfU0laRSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25QbGF5ZXJIdXJ0ID0gKGVudGl0eSwgaWQsIHJlbWFpbmluZ0xpdmVzKSA9PiB7XG4gICAgICAgICAgICAvLyBDUklUSUNBTDogT25seSBzZW5kIHBsYXllcl9kaWVkIGlmIFRISVMgSVMgVEhFIExPQ0FMIFBMQVlFUi5cbiAgICAgICAgICAgIC8vIFRoZSBFQ1MgZGFtYWdlU3lzdGVtIHJ1bnMgb24gQUxMIGNsaWVudHMsIHNvIGV2ZXJ5IGNsaWVudCBkZXRlY3RzXG4gICAgICAgICAgICAvLyBldmVyeSBjb2xsaXNpb24uIFdlIG11c3QgZ3VhcmQgdGhlIFdlYlNvY2tldCBtZXNzYWdlIHRvIHByZXZlbnRcbiAgICAgICAgICAgIC8vIGluY29ycmVjdCBkZWF0aCByZXBvcnRzLlxuICAgICAgICAgICAgaWYgKHJlbWFpbmluZ0xpdmVzIDw9IDAgJiYgZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5ICYmIHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwbGF5ZXJfZGllZCdcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEhVRCBvbmx5IGZvciB0aGUgbG9jYWwgcGxheWVyLlxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHNldExpdmVzKHJlbWFpbmluZ0xpdmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBvd2VyVXBQaWNrZWQgPSAoaWQsIHR5cGUsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHt4fSwke3l9YCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhpZCkpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IGVudGl0eSA/IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdIRUFSVCcpIHtcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyQ29tcCAmJiBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0TGl2ZXMocGxheWVyQ29tcC5saXZlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyQ29tcCAmJiBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyh0aGlzLmxvY2FsUGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlID09PSAnSEVBUlQnID8gJ0lURU1fUElDS1VQJyA6ICdQT1dFUlVQX1BJQ0tFRCcsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IHR5cGUgPT09ICdIRUFSVCdcbiAgICAgICAgICAgICAgICAgICAgICAgID8geyBwbGF5ZXJJZDogaWQsIG5ld0xpdmVzOiBwbGF5ZXJDb21wID8gcGxheWVyQ29tcC5saXZlcyA6IDAsIHgsIHkgfVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7IGlkLCB0eXBlLCB4LCB5IH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5icm9hZGNhc3RNb3ZlbWVudCA9IChlbnRpdHksIHgsIHksIGdyaWRYLCBncmlkWSwgZGlyZWN0aW9uLCBpc01vdmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAoIXBsYXllciB8fCAhdGhpcy5zb2NrZXQgfHwgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ01PVkVfU1RBVEUnLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBsYXllci5pZCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGlzTW92aW5nLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IG1vdmVtZW50U3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBib21iU3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGRhbWFnZVN5c3RlbSh0aGlzLndvcmxkLCBub3csIG9uUGxheWVySHVydCwgdGhpcy5sb2NhbFBsYXllckVudGl0eSwgVElMRV9TSVpFLCB0aGlzLnNvY2tldCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcG93ZXJVcFN5c3RlbSh3LCBvblBvd2VyVXBQaWNrZWQpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHJlbmRlclN5c3RlbSh3LCBkdCwgbm93LCBBTklNQVRJT05fUk9XUykpO1xuICAgIH1cblxuICAgIGdhbWVMb29wKG5vdykge1xuICAgICAgICBpZiAoIXRoaXMucnVubmluZykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGR0ID0gbm93IC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IG5vdztcbiAgICAgICAgdGhpcy53b3JsZC51cGRhdGUoZHQsIG5vdyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobmV4dE5vdykgPT4gdGhpcy5nYW1lTG9vcChuZXh0Tm93KSk7XG4gICAgfVxuXG4gICAgaGFuZGxlR2FtZU92ZXIod2lubmVyTmFtZSkge1xuICAgICAgICBpZiAodGhpcy5nYW1lRW5kZWQpIHJldHVybjsgLy8gUHJldmVudCBtdWx0aXBsZSB0cmlnZ2Vyc1xuICAgICAgICB0aGlzLmdhbWVFbmRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuXG4gICAgICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9ICdtZW51LXBhZ2UnO1xuICAgICAgICByZW5kZXIoPFdpbk1lbnUgd2lubmVyTmFtZT17d2lubmVyTmFtZX0gLz4sIHJvb3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBnYW1lIGVuZCBjb25kaXRpb25zIHdpdGggcHJvcGVyIHN0YXRlIGZsYWcgbWFuYWdlbWVudC5cbiAgICAgKiBQcmV2ZW50cyB0aGUgXCJMb29wIFRyYXBcIiAtIG1vZGFsIGlzIG9ubHkgcmVuZGVyZWQgT05DRSB3aGVuIGxpdmVzIHJlYWNoIDAuXG4gICAgICogQWxzbyBkaXNhYmxlcyBpbnB1dCBpbW1lZGlhdGVseSB3aGVuIHBsYXllciBkaWVzLlxuICAgICAqL1xuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUh1ZFN0YXRzKGVudGl0eSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgICAgIHNldExpdmVzKHBsYXllci5saXZlcyA/PyAzKTtcbiAgICAgICAgc2V0UmFuZ2UocGxheWVyLmJvbWJSYW5nZSB8fCA0KTtcbiAgICAgICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYm9tYlN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3QgYm9tYnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgYm9tYkVudGl0eSBvZiBib21icykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IGJvbWIgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgXG4gICAgICAgIGJvbWIudGltZXIgLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoYm9tYi50aW1lciA8PSAwICYmICFib21iLmV4cGxvZGVkKSB7XG4gICAgICAgICAgICBib21iLmV4cGxvZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgYWZmZWN0ZWRDZWxscyA9IGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBib21iLnJhbmdlLCBtYXBEYXRhKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWZmZWN0ZWRDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGV4cERpdi5jbGFzc05hbWUgPSAnZXhwbG9zaW9uJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Y2VsbC54ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS50b3AgPSBgJHtjZWxsLnkgKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnpJbmRleCA9ICc3JztcblxuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicsIHsgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYOiBjZWxsLngsIFxuICAgICAgICAgICAgICAgICAgICBncmlkWTogY2VsbC55LCBcbiAgICAgICAgICAgICAgICAgICAgeDogY2VsbC54ICogdGlsZVNpemUsIFxuICAgICAgICAgICAgICAgICAgICB5OiBjZWxsLnkgKiB0aWxlU2l6ZSBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJywgeyBkdXJhdGlvbjogNTAwLCBlbDogZXhwRGl2IH0pO1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChleHBEaXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhW2NlbGwueV0gJiYgbWFwRGF0YVtjZWxsLnldW2NlbGwueF0gPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTWFwQ2VsbChjZWxsLngsIGNlbGwueSwgMik7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzdHJveUJveENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95Qm94Q2FsbGJhY2soY2VsbC54LCBjZWxsLnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChib21iLmVsICYmIGJvbWIuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChib21iLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoYm9tYkVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgIGNvbnN0IGV4cCA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nKTtcbiAgICAgICAgZXhwLmR1cmF0aW9uIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGV4cC5kdXJhdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICBpZiAoZXhwLmVsICYmIGV4cC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZXhwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXhwLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoZXhwRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMoYngsIGJ5LCByYW5nZSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGxzID0gW3sgeDogYngsIHk6IGJ5IH1dO1xuICAgIGNvbnN0IGRpcmVjdGlvbnMgPSBbXG4gICAgICAgIHsgeDogMCwgeTogLTEgfSxcbiAgICAgICAgeyB4OiAwLCB5OiAxIH0sXG4gICAgICAgIHsgeDogLTEsIHk6IDAgfSxcbiAgICAgICAgeyB4OiAxLCB5OiAwIH1cbiAgICBdO1xuICAgIFxuICAgIGNvbnN0IHN0ZXBzID0gcmFuZ2UgLSAxOyBcbiAgICBcbiAgICBkaXJlY3Rpb25zLmZvckVhY2goZGlyID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdHggPSBieCArIChkaXIueCAqIGkpO1xuICAgICAgICAgICAgY29uc3QgdHkgPSBieSArIChkaXIueSAqIGkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW1hcERhdGFbdHldIHx8IG1hcERhdGFbdHldW3R4XSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY2VsbFR5cGUgPSBtYXBEYXRhW3R5XVt0eF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjZWxscy5wdXNoKHsgeDogdHgsIHk6IHR5IH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBjZWxscztcbn1cbiIsIi8qKlxuICogU3Bhd25zIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBzcGVjaWZpZWQgZ3JpZCBjb29yZGluYXRlcy5cbiAqIFRoaXMgY3JlYXRlcyBhIHByb3BlciBFQ1MgZW50aXR5IHdpdGggUG9zaXRpb24sIFBvd2VyVXAsIGFuZCBSZW5kZXJhYmxlIGNvbXBvbmVudHMuXG4gKiBcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBncmlkWCAtIEdyaWQgWCBjb29yZGluYXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZ3JpZFkgLSBHcmlkIFkgY29vcmRpbmF0ZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwYXduSGVhcnRQb3dlclVwKHdvcmxkLCBncmlkWCwgZ3JpZFksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIC8vIENyZWF0ZSBhIG5ldyBlbnRpdHkgZm9yIHRoZSBoZWFydCBwb3dlci11cFxuICAgIGNvbnN0IGhlYXJ0RW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgXG4gICAgLy8gQWRkIFBvc2l0aW9uIGNvbXBvbmVudFxuICAgIHdvcmxkLmFkZENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvc2l0aW9uJywge1xuICAgICAgICBncmlkWDogZ3JpZFgsXG4gICAgICAgIGdyaWRZOiBncmlkWSxcbiAgICAgICAgeDogZ3JpZFggKiB0aWxlU2l6ZSxcbiAgICAgICAgeTogZ3JpZFkgKiB0aWxlU2l6ZVxuICAgIH0pO1xuICAgIFxuICAgIC8vIEFkZCBQb3dlclVwIGNvbXBvbmVudCB3aXRoIHR5cGUgJ0hFQVJUJ1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvd2VyVXAnLCB7XG4gICAgICAgIHR5cGU6ICdIRUFSVCcsXG4gICAgICAgIHBpY2tlZFVwOiBmYWxzZSxcbiAgICAgICAgZWw6IG51bGwgIC8vIFdpbGwgYmUgc2V0IGFmdGVyIGNyZWF0aW5nIHRoZSBET00gZWxlbWVudFxuICAgIH0pO1xuICAgIFxuICAgIC8vIENyZWF0ZSB0aGUgRE9NIGVsZW1lbnQgZm9yIHJlbmRlcmluZ1xuICAgIGNvbnN0IGhlYXJ0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhcnREaXYuY2xhc3NOYW1lID0gJ3Bvd2VydXAgcG93ZXJ1cC1oZWFydCc7XG4gICAgaGVhcnREaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICBoZWFydERpdi5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcbiAgICBoZWFydERpdi5zdHlsZS5mb250U2l6ZSA9ICczMnB4JztcbiAgICBoZWFydERpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgaGVhcnREaXYudGV4dENvbnRlbnQgPSAn4p2k77iPJztcbiAgICBcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaGVhcnREaXYpO1xuICAgIFxuICAgIC8vIFVwZGF0ZSB0aGUgUG93ZXJVcCBjb21wb25lbnQgd2l0aCB0aGUgRE9NIGVsZW1lbnQgcmVmZXJlbmNlXG4gICAgY29uc3QgcG93ZXJVcCA9IHdvcmxkLmdldENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICBpZiAocG93ZXJVcCkge1xuICAgICAgICBwb3dlclVwLmVsID0gaGVhcnREaXY7XG4gICAgfVxuICAgIFxuICAgIGNvbnNvbGUubG9nKGBbSGVhcnQgRHJvcF0gU3Bhd25lZCBIRUFSVCBwb3dlci11cCBhdCAoJHtncmlkWH0sICR7Z3JpZFl9KWApO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgcGxheWVyIGRlYXRoIHRyYW5zaXRpb24gd2hlbiBsaXZlcyByZWFjaCAwLlxuICogUmVtb3ZlcyB0aGUgcGxheWVyJ3MgRE9NIGVsZW1lbnQgYW5kIHNwYXducyBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgZGVhdGggbG9jYXRpb24uXG4gKlxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckVudGl0eSAtIFRoZSBlbnRpdHkgSUQgb2YgdGhlIGR5aW5nIHBsYXllclxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplID0gNjQsIGNvbnRhaW5lciA9IG51bGwpIHtcbiAgICAvLyBHZXQgdGhlIHBsYXllcidzIGNvbXBvbmVudHNcbiAgICBjb25zdCBwb3NpdGlvbiA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcblxuICAgIGlmICghcG9zaXRpb24gfHwgIXJlbmRlcmFibGUgfHwgIXBsYXllcikgcmV0dXJuO1xuXG4gICAgLy8gU3RvcmUgdGhlIGdyaWQgY29vcmRpbmF0ZXMgd2hlcmUgdGhlIHBsYXllciBkaWVkXG4gICAgY29uc3QgZGVhdGhHcmlkWCA9IE1hdGguZmxvb3IoKHBvc2l0aW9uLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgIGNvbnN0IGRlYXRoR3JpZFkgPSBNYXRoLmZsb29yKChwb3NpdGlvbi55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcblxuICAgIC8vIENSSVRJQ0FMOiBSZW1vdmUgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGZyb20gdGhlIGRvY3VtZW50IEJFRk9SRSByZW1vdmluZyB0aGUgUmVuZGVyYWJsZSBjb21wb25lbnQuXG4gICAgLy8gVGhpcyBlbnN1cmVzIHRoZSBkZWFkIHBsYXllciB2aXN1YWxseSBkaXNhcHBlYXJzIGltbWVkaWF0ZWx5LlxuICAgIGlmIChyZW5kZXJhYmxlLmVsICYmIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocmVuZGVyYWJsZS5lbCk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGNvbXBvbmVudHMgdGhhdCBlbmFibGUgaW50ZXJhY3Rpb24gYW5kIHJlbmRlcmluZy5cbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgIC8vIFdlIGtlZXAgUG9zaXRpb24gYW5kIFBsYXllciBjb21wb25lbnRzIHRvIGtub3cgd2hlcmUgdGhleSB3ZXJlLlxuXG4gICAgLy8gU3Bhd24gYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIGRlYXRoIGxvY2F0aW9uIChwcm9wZXIgRUNTIGVudGl0eSlcbiAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgIHNwYXduSGVhcnRQb3dlclVwKHdvcmxkLCBkZWF0aEdyaWRYLCBkZWF0aEdyaWRZLCBnYW1lQ29udGFpbmVyLCB0aWxlU2l6ZSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYFtQbGF5ZXIgRGVhdGhdIFBsYXllciAke3BsYXllci5pZH0gZGllZCBhdCAoJHtkZWF0aEdyaWRYfSwgJHtkZWF0aEdyaWRZfSkuIEhlYXJ0IHBvd2VyLXVwIGRyb3BwZWQuYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYW1hZ2VTeXN0ZW0od29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCBsb2NhbFBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgc29ja2V0KSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQbGF5ZXInKTtcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAocGxheWVyLmludmluY2libGVVbnRpbCAmJiBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID4gbm93KSBjb250aW51ZTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gR3JpZC1iYXNlZCBjb2xsaXNpb25cbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRYID0gTWF0aC5mbG9vcigocFBvcy54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRZID0gTWF0aC5mbG9vcigocFBvcy55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcblxuICAgICAgICAgICAgaWYgKHBsYXllckdyaWRYID09PSBlUG9zLmdyaWRYICYmIHBsYXllckdyaWRZID09PSBlUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNMaXZlcyA9IHBsYXllci5saXZlcyA/PyAzO1xuICAgICAgICAgICAgICAgIHBsYXllci5saXZlcyA9IE1hdGgubWF4KHByZXZpb3VzTGl2ZXMgLSAxLCAwKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID0gbm93ICsgMTUwMDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcGxheWVyIGlzIGRlYWQsIHJlcG9ydCBkZWF0aCBPTkNFIHVzaW5nIGd1YXJkIGNsYXVzZVxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIubGl2ZXMgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGxheWVyLmFscmVhZHlSZXBvcnRlZERlYWQpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYWxyZWFkeVJlcG9ydGVkRGVhZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uUGxheWVySHVydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVQbGF5ZXJEZWF0aCh3b3JsZCwgcGxheWVyRW50aXR5LCB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUGxheWVyIHN0aWxsIGFsaXZlLCByZXBvcnQgbm9ybWFsIGRhbWFnZVxuICAgICAgICAgICAgICAgICAgICBpZiAob25QbGF5ZXJIdXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblBsYXllckh1cnQocGxheWVyRW50aXR5LCBwbGF5ZXIuaWQsIHBsYXllci5saXZlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQnJlYWsgdGhlIGxvb3Agc2luY2UgdGhlIHBsYXllciBoYXMgYWxyZWFkeSB0YWtlbiBkYW1hZ2UgZnJvbSB0aGlzIGV4cGxvc2lvbi5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgZnVuY3Rpb24gbW92ZW1lbnRTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHRpbGVTaXplID0gNDApIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScpO1xuICAgIGNvbnN0IGRlbHRhID0gZHQgLyAxNi42NztcblxuICAgIGNvbnN0IFBMQVlFUl9TSVpFID0gdGlsZVNpemU7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgIGNvbnN0IGJlaGF2aW9yID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JlaGF2aW9yJyk7XG5cbiAgICAgICAgaWYgKGJlaGF2aW9yKSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkICsgKGJlaGF2aW9yLmZhc3RTaG9lc0xldmVsIC0gMSkgKiAwLjU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3RpdmVJbnB1dCA9IGlucHV0LmlucHV0UXVldWVbMF07XG4gICAgICAgIGxldCBkeCA9IDA7XG4gICAgICAgIGxldCBkeSA9IDA7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUlucHV0ID09PSAndXAnKSB7XG4gICAgICAgICAgICBkeSA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdkb3duJykge1xuICAgICAgICAgICAgZHkgPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdkb3duJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICBkeCA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgZHggPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdyaWdodCc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNJbnB1dCA9IGR4ICE9PSAwIHx8IGR5ICE9PSAwO1xuXG4gICAgICAgIGlmICghaGFzSW5wdXQpIHtcbiAgICAgICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuICAgICAgICAgICAgdmVsLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdJRExFJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFkgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgY29uc3Qgc25hcFRocmVzaG9sZCA9IDMyO1xuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiBkeCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChwb3MueCwgbmV4dFksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVggPSBNYXRoLmZsb29yKChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WCA9IGN1cnJlbnRUaWxlWCAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZYID0gcG9zLnggLSB0YXJnZXRYO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZYKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeCA9IC1NYXRoLnNpZ24oZGlmZlgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChuZXh0WCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVkgPSBNYXRoLmZsb29yKChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WSA9IGN1cnJlbnRUaWxlWSAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZZID0gcG9zLnkgLSB0YXJnZXRZO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZZKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeSA9IC1NYXRoLnNpZ24oZGlmZlkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYQWZ0ZXJTbmFwID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WUFmdGVyU25hcCA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgIWlzQmxvY2tlZChuZXh0WEFmdGVyU25hcCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy54ID0gbmV4dFhBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgIWlzQmxvY2tlZChwb3MueCwgbmV4dFlBZnRlclNuYXAsIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy55ID0gbmV4dFlBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdSVU4nO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuXG4gICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKSB7XG4gICAgY29uc3Qgc3RlcCA9IHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgaWYgKHBvcy54IDwgcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1pbihwb3MueCArIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9IGVsc2UgaWYgKHBvcy54ID4gcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1heChwb3MueCAtIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9XG5cbiAgICBpZiAocG9zLnkgPCBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWluKHBvcy55ICsgc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH0gZWxzZSBpZiAocG9zLnkgPiBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWF4KHBvcy55IC0gc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH1cblxuICAgIHZlbC5pc01vdmluZyA9XG4gICAgICAgIHBvcy54ICE9PSBwb3MudGFyZ2V0WCB8fFxuICAgICAgICBwb3MueSAhPT0gcG9zLnRhcmdldFk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZCh4LCB5LCBtYXBEYXRhLCB0aWxlU2l6ZSwgcGxheWVyU2l6ZSA9IHRpbGVTaXplKSB7XG4gICAgY29uc3QgcGFkZGluZyA9IDQ7XG5cbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHJpZ2h0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCB0b3AgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgYm90dG9tID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIGJvdHRvbSwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgYm90dG9tLCBtYXBEYXRhKVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZENlbGwoeCwgeSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGwgPSBtYXBEYXRhW3ldICYmIG1hcERhdGFbeV1beF07XG5cbiAgICByZXR1cm4gY2VsbCAhPT0gMCAmJiBjZWxsICE9PSAyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHBvd2VyVXBTeXN0ZW0od29ybGQsIG9uUG93ZXJVcFBpY2tlZCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUGxheWVyJyk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcFBvcyB8fCAhdmVsIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcFVwRW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCB1cFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcFVwID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghdXBQb3MgfHwgIXBVcCB8fCBwVXAucGlja2VkVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAvLyBHcmlkLWJhc2VkIGNvbGxpc2lvbjogcGxheWVyIGdyaWQgcG9zaXRpb24gbWF0Y2hlcyBwb3dlci11cCBncmlkIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAocFBvcy5ncmlkWCA9PT0gdXBQb3MuZ3JpZFggJiYgcFBvcy5ncmlkWSA9PT0gdXBQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIGRpZmZlcmVudCBwb3dlci11cCB0eXBlc1xuICAgICAgICAgICAgICAgIGlmIChwVXAudHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgICAgICAgICB2ZWwuc3BlZWQgPSBNYXRoLm1pbih2ZWwuc3BlZWQgKyAxLCA4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0hFQVJUJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHBvd2VyLXVwJ3MgRE9NIGVsZW1lbnQgZnJvbSB0aGUgc2NyZWVuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC5lbCAmJiBwVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE5vdGlmeSBnYW1lLmpzIHZpYSBjYWxsYmFjayAoaGFuZGxlcyBIVUQgdXBkYXRlICsgc2VydmVyIHN5bmMpXG4gICAgICAgICAgICAgICAgLy8gQ1JJVElDQUw6IFRoaXMgdHJpZ2dlcnMgdXBkYXRlSHVkU3RhdHMsIE5PVCBvblBsYXllckh1cnRcbiAgICAgICAgICAgICAgICBpZiAob25Qb3dlclVwUGlja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uUG93ZXJVcFBpY2tlZChwbGF5ZXIuaWQsIHBVcC50eXBlLCB1cFBvcy5ncmlkWCwgdXBQb3MuZ3JpZFkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIERlc3Ryb3kgdGhlIHBvd2VyLXVwIGVudGl0eSBmcm9tIHRoZSB3b3JsZCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkocFVwRW50aXR5KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0hFQVJUIERFU1RST1lFRF0gSGVhcnQgZW50aXR5IHJlbW92ZWQgZnJvbSB3b3JsZCBhdCAoJHt1cFBvcy5ncmlkWH0sICR7dXBQb3MuZ3JpZFl9KWApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Bhd25Qb3dlclVwKHdvcmxkLCBneCwgZ3ksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IHNlZWQgPSBneCAqIDczODU2MDkzIF4gZ3kgKiAxOTM0OTY2MztcbiAgICBjb25zdCBzZWVkUmFuZG9tID0gKE1hdGguc2luKHNlZWQpICogMTAwMDApIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkKSAqIDEwMDAwKTtcbiAgICBcbiAgICBpZiAoc2VlZFJhbmRvbSA+IDAuMzUpIHJldHVybjtcblxuICAgIGNvbnN0IHR5cGVzID0gWydTUEVFRCcsICdCT01CUycsICdGTEFNRSddO1xuICAgIGNvbnN0IHR5cGVJbmRleCA9IE1hdGguZmxvb3IoKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCkpICogdHlwZXMubGVuZ3RoKTtcbiAgICBjb25zdCByYW5kb21UeXBlID0gdHlwZXNbdHlwZUluZGV4XTtcblxuICAgIGNvbnN0IHBVcEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogdGlsZVNpemUsIHk6IGd5ICogdGlsZVNpemUgfSk7XG4gICAgXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9IGBwb3dlcnVwIHBvd2VydXAtJHtyYW5kb21UeXBlLnRvTG93ZXJDYXNlKCl9YDtcbiAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnRvcCA9IGAke2d5ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcsIHsgdHlwZTogcmFuZG9tVHlwZSwgZWw6IGRpdiB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByZW5kZXJTeXN0ZW0od29ybGQsIGR0LCBub3csIGFuaW1Sb3dzKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUmVuZGVyYWJsZScpO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcblxuICAgICAgICBpZiAoIXJlbmRlcmFibGUuZWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gcmVuZGVyYWJsZS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Um93ID0gYW5pbVJvd3Nbc3RhdGVdW3ZlbC5kaXJlY3Rpb25dO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYW5pbWF0aW9uIHdoZW4gcm93IG9yIHN0YXRlIGNoYW5nZXNcbiAgICAgICAgaWYgKHJlbmRlcmFibGUucm93ICE9PSB0YXJnZXRSb3cgfHwgcmVuZGVyYWJsZS5sYXN0U3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnJvdyA9IHRhcmdldFJvdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdFN0YXRlID0gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcmFtZUNvdW50ID0gc3RhdGUgPT09ICdSVU4nID8gcmVuZGVyYWJsZS5ydW5GcmFtZXMgOiByZW5kZXJhYmxlLmlkbGVGcmFtZXM7XG4gICAgICAgIGNvbnN0IGZyYW1lRGVsYXkgPSBzdGF0ZSA9PT0gJ1JVTicgPyAxMDAwIC8gcmVuZGVyYWJsZS5mcHMgOiAxMDAwIC8gcmVuZGVyYWJsZS5pZGxlRnBzO1xuXG4gICAgICAgIGlmIChub3cgLSByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPiBmcmFtZURlbGF5KSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IChyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSArIDEpICUgZnJhbWVDb3VudDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvc1ggPSAtKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICogcmVuZGVyYWJsZS5mcmFtZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcG9zWSA9IC0ocmVuZGVyYWJsZS5yb3cgKiByZW5kZXJhYmxlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYCR7cG9zWH1weCAke3Bvc1l9cHhgO1xuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3Bvcy54fXB4LCAke3Bvcy55fXB4LCAwKWA7XG4gICAgfVxufVxuIiwiLy8gL3NyYy9lY3Mvd29ybGQuanNcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uZXh0RW50aXR5SWQgPSAwO1xuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgTWFwKCk7IFxuICAgICAgICB0aGlzLnN5c3RlbXMgPSBbXTtcbiAgICB9XG5cbiAgICBjcmVhdGVFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMubmV4dEVudGl0eUlkKys7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkKGVudGl0eSk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVudGl0eShlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgZm9yIChjb25zdCBbY29tcG9uZW50TmFtZSwgY29tcG9uZW50TWFwXSBvZiB0aGlzLmNvbXBvbmVudHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lLCBjb21wb25lbnREYXRhID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHMuaGFzKGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIG5ldyBNYXAoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKS5zZXQoZW50aXR5LCBjb21wb25lbnREYXRhKTtcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRNYXAgPyBjb21wb25lbnRNYXAuZ2V0KGVudGl0eSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBpZiAoY29tcG9uZW50TWFwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBxdWVyeSguLi5jb21wb25lbnROYW1lcykge1xuICAgICAgICBpZiAoY29tcG9uZW50TmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaXJzdE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbMF0pO1xuICAgICAgICBpZiAoIWZpcnN0TWFwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGZpcnN0TWFwLmtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGhhc0FsbCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNvbXBvbmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXAgfHwgIW1hcC5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0FsbCAmJiB0aGlzLmVudGl0aWVzLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkU3lzdGVtKHN5c3RlbUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbUZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZHQsIG5vdykge1xuICAgICAgICBmb3IgKGNvbnN0IHN5c3RlbSBvZiB0aGlzLnN5c3RlbXMpIHtcbiAgICAgICAgICAgIHN5c3RlbSh0aGlzLCBkdCwgbm93KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBXaW5NZW51KHByb3BzKSB7XG4gICAgY29uc3Qgd2lubmVyTmFtZSA9IHByb3BzLndpbm5lck5hbWUgfHwgXCJBIFBsYXllclwiO1xuXG4gICAgY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG4gICAgcmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIC8vIEV4cGxpY2l0bHkgY2xvc2UgdGhlIG9sZCBXZWJTb2NrZXQgdG8gcHJldmVudCB6b21iaWUgY29ubmVjdGlvbnNcbiAgICAgICAgaWYgKHdpbmRvdy5zb2NrZXQpIHsgXG4gICAgICAgICAgICB3aW5kb3cuc29ja2V0LmNsb3NlKCk7IFxuICAgICAgICAgICAgd2luZG93LnNvY2tldCA9IG51bGw7IFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGFyZCByZWxvYWQgdG8gd2lwZSBKUyBtZW1vcnkgYW5kIHN0YXJ0IGZyb20gYSBjbGVhbiBzbGF0ZVxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICAgICAgPGgxPnt3aW5uZXJOYW1lLnRvVXBwZXJDYXNlKCl9IFdPTiE8L2gxPlxuICAgICAgICAgICAgPHA+VGhlIGxhc3QgcGxheWVyIHN0YW5kaW5nIHRha2VzIHRoZSBjcm93bi48L3A+XG4gICAgICAgICAgICB7cmVwbGF5QnRufVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5cbmNvbnN0IFRJTEVfU0laRSA9IDY0O1xuY29uc3QgR1JJRF9CT1JERVJfU0laRSA9IDY7XG5jb25zdCBHQU1FX0NIUk9NRV9XSURUSCA9IDcyO1xuY29uc3QgR0FNRV9DSFJPTUVfSEVJR0hUID0gMTUwO1xuXG5jb25zdCBpbWFnZXMgPSB7XG4gICAgMjogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIsXG4gICAgMzogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfd2FsbC5wbmdcIixcbiAgICA0OiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19leHBsb2l0LnBuZ1wiLFxufTtcblxuY29uc3QgW3BsYXllck5hbWUsIHNldFBsYXllck5hbWVdID0gY3JlYXRlU2lnbmFsKFwiUGxheWVyIDFcIik7XG5jb25zdCBbbGl2ZXMsIHNldExpdmVzXSA9IGNyZWF0ZVNpZ25hbCgzKTtcbmNvbnN0IFtzcGVlZCwgc2V0U3BlZWRdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW2JvbWJzLCBzZXRCb21ic10gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbcmFuZ2UsIHNldFJhbmdlXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmV4cG9ydCB7IHNldFBsYXllck5hbWUsIHNldExpdmVzLCBzZXRTcGVlZCwgc2V0Qm9tYnMsIHNldFJhbmdlIH07XG5cbmNvbnN0IG5hbWVFbCA9IDxzcGFuIGNsYXNzPVwicGxheWVyLW5hbWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBuYW1lRWwudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lKCk7IH0pO1xuXG5jb25zdCBsaXZlc0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBsaXZlcy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBzcGVlZEVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBzcGVlZC12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBib21ic0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBib21icy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCByYW5nZUVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSByYW5nZS12YWx1ZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGxpdmVzRWwudGV4dENvbnRlbnQgPSBsaXZlcygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHNwZWVkRWwudGV4dENvbnRlbnQgPSBzcGVlZCgpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGJvbWJzRWwudGV4dENvbnRlbnQgPSBib21icygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHJhbmdlRWwudGV4dENvbnRlbnQgPSByYW5nZSgpOyB9KTtcblxuZnVuY3Rpb24gR2FtZSh7IGdyaWQgfSkge1xuICAgIGNvbnN0IGJvYXJkV2lkdGggPSBncmlkWzBdLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZEhlaWdodCA9IGdyaWQubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJXaWR0aCA9IGJvYXJkV2lkdGggKyBHUklEX0JPUkRFUl9TSVpFICogMjtcbiAgICBjb25zdCBib2FyZE91dGVySGVpZ2h0ID0gYm9hcmRIZWlnaHQgKyBHUklEX0JPUkRFUl9TSVpFICogMjtcbiAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGJvYXJkV2lkdGggOiB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBib2FyZEhlaWdodCA6IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjb25zdCBzY2FsZSA9IE1hdGgubWluKFxuICAgICAgICAxLFxuICAgICAgICBNYXRoLm1heCgwLjIsICh2aWV3cG9ydFdpZHRoIC0gR0FNRV9DSFJPTUVfV0lEVEgpIC8gYm9hcmRPdXRlcldpZHRoKSxcbiAgICAgICAgTWF0aC5tYXgoMC4yLCAodmlld3BvcnRIZWlnaHQgLSBHQU1FX0NIUk9NRV9IRUlHSFQpIC8gYm9hcmRPdXRlckhlaWdodClcbiAgICApO1xuICAgIGNvbnN0IHJvd3MgPSBbXTtcbiAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgZ3JpZC5sZW5ndGg7IHJvd0luZGV4KyspIHtcbiAgICAgICAgY29uc3QgY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IGdyaWRbcm93SW5kZXhdLmxlbmd0aDsgY29sSW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGdyaWRbcm93SW5kZXhdW2NvbEluZGV4XTtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBcInRpbGVcIjtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGB3aWR0aDoke1RJTEVfU0laRX1weDtoZWlnaHQ6JHtUSUxFX1NJWkV9cHg7YDtcblxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDIgfHwgY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLWZsb29yXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLXdhbGxcIjtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbM119KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1s0XX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAwIHx8IGNlbGwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbMl19KWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNlbGxzLnB1c2goPGRpdiBjbGFzcz17Y2xhc3NOYW1lfSBkYXRhLXg9e2NvbEluZGV4fSBkYXRhLXk9e3Jvd0luZGV4fSBzdHlsZT17c3R5bGV9PjwvZGl2Pik7XG4gICAgICAgIH1cbiAgICAgICAgcm93cy5wdXNoKDxkaXYgY2xhc3M9XCJncmlkLXJvd1wiPntjZWxsc308L2Rpdj4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtZ2xhc3NcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtYmFyXCI+XG4gICAgICAgICAgICAgICAgICAgIHtuYW1lRWx9XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1zdGF0c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5MaXZlczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bGl2ZXNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5TcGVlZDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c3BlZWRFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5Cb21iczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Ym9tYnNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5SYW5nZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmFuZ2VFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1ib2FyZC1mcmFtZVwiIHN0eWxlPXtgd2lkdGg6JHtib2FyZE91dGVyV2lkdGggKiBzY2FsZX1weDtoZWlnaHQ6JHtib2FyZE91dGVySGVpZ2h0ICogc2NhbGV9cHg7YH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZ2FtZS1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJnYW1lLWdyaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2Bwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoke2JvYXJkV2lkdGh9cHg7aGVpZ2h0OiR7Ym9hcmRIZWlnaHR9cHg7dHJhbnNmb3JtOnNjYWxlKCR7c2NhbGV9KTtgfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cm93c31cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgQ2hhdFBsYXllcnMgZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5sZXQgW3N0YXRlcywgc2V0U3RhdGVzXSA9IGNyZWF0ZVNpZ25hbCh7fSk7XG5leHBvcnQgeyBzZXRTdGF0ZXMgfTtcblxubGV0IHJvb21JZEVsID0gPHA+Um9vbSBJRDogPC9wPjtcbmxldCBwbGF5ZXJzRWwgPSA8cD5QbGF5ZXJzOiAgLyA0PC9wPjtcbmxldCB0ZXh0RWwgPSA8cD48L3A+O1xubGV0IHRpbWVyRWwgPSA8cD5UaW1lcjogPC9wPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzID0gc3RhdGVzKCk7XG4gICAgcm9vbUlkRWwudGV4dENvbnRlbnQgPSBgUm9vbSBJRDogJHtzLnJvb21JZH1gO1xuICAgIHBsYXllcnNFbC50ZXh0Q29udGVudCA9IGBQbGF5ZXJzOiAke3MucGxheWVyc0NvdW50fSAvIDRgO1xuICAgIHRleHRFbC50ZXh0Q29udGVudCA9IHMudGV4dCB8fCBcIlwiO1xuXG4gICAgaWYgKHMuZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IFwiVGltZXI6IEdhbWUgc3RhcnRlZFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRpbWVyVGV4dCA9ICghcy5zZWNvbmRzTGVmdCkgPyBcIldhaXRpbmcgZm9yIG9uZSBtb3JlIHBsYXllclwiIDogYCR7cy5zZWNvbmRzTGVmdH0gc2Vjb25kc2A7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBgVGltZXI6ICR7dGltZXJUZXh0fWA7XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIExvYmJ5KCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb25hdGluZXItbG9iYnlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2JieS1ib3hcIj5cbiAgICAgICAgICAgICAgICA8aDE+TG9iYnk8L2gxPlxuICAgICAgICAgICAgICAgIHtyb29tSWRFbH1cbiAgICAgICAgICAgICAgICB7cGxheWVyc0VsfVxuICAgICAgICAgICAgICAgIHt0ZXh0RWx9XG4gICAgICAgICAgICAgICAge3RpbWVyRWx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxDaGF0UGxheWVycyAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYmJ5OyIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmNvbnN0IHJlcGxheUJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+UGxheSBBZ2FpbjwvYnV0dG9uPjtcblxucmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbG9jYXRpb24ucmVsb2FkKCk7XG59KTtcblxubGV0IG1lbnVFbCA9IChcbiAgICA8ZGl2IGNsYXNzPVwibWVudS1ib3hcIj5cbiAgICAgICAgPGgxPllvdSBXaW4hPC9oMT5cbiAgICAgICAgPHA+QWxsIG90aGVyIHBsYXllcnMgaGF2ZSBsZWZ0IHRoZSBnYW1lLjwvcD5cbiAgICAgICAge3JlcGxheUJ0bn1cbiAgICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lbnUoKSB7XG4gICAgcmV0dXJuIG1lbnVFbDtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBzZXRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7XG5cbmZ1bmN0aW9uIFJlZ2lzdGVyKHsgd3NzIH0pIHtcbiAgICBsZXQgc3VibWl0dGVkID0gZmFsc2U7XG5cbiAgICBsZXQgcGxheWVyRW50ZXIgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChzdWJtaXR0ZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCBuaWNrbmFtZSA9IGZvcm1EYXRhLmdldChcIm5pY2tuYW1lXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW5pY2tuYW1lIHx8IG5pY2tuYW1lLmxlbmd0aCA+IDIwKSByZXR1cm47XG5cbiAgICAgICAgc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc2V0UGxheWVyTmFtZShuaWNrbmFtZSk7XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJuaWNrbmFtZV9vZl90aGVfcGxheWVyXCIsXG4gICAgICAgICAgICBuaWNrbmFtZTogbmlja25hbWVcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxmb3JtIGNsYXNzPVwicmVnaXN0ZXItZm9ybVwiIG9uU3VibWl0PXtwbGF5ZXJFbnRlcn0+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaWNrbmFtZS1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5pY2tuYW1lXCIgcGxhY2Vob2xkZXI9XCJlbnRlciB5b3VyIG5hbWVcIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJyZWdpc3Rlci1idXR0b25cIiB0eXBlPVwic3VibWl0XCI+c3RhcnQgcGxheWluZzwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RlcjtcbiIsImNsYXNzIFNvdW5kIHtcbiAgICBjb25zdHJ1Y3RvcihzcmMpIHtcbiAgICAgICAgdGhpcy5tdXNpYyA9IG5ldyBBdWRpbyhzcmMpO1xuICAgICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuXG4gICAgICAgIHRoaXMubXVzaWMubG9vcCA9IHRydWU7XG4gICAgICAgIHRoaXMubXVzaWMudm9sdW1lID0gMC40O1xuXG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTmFtZSA9IFwic291bmQtYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFwcGVuZCh0aGlzLmljb24pO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZSgpKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZCh0aGlzLmJ1dHRvbik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnBsYXkoKSwgeyBvbmNlOiB0cnVlIH0pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIHRoaXMubXVzaWMucGxheSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpO1xuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVzaWMucGF1c2VkIHx8IHRoaXMubXVzaWMubXV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvblwiKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVCdXR0b24oKSB7XG4gICAgICAgIGNvbnN0IGlzTXV0ZWQgPSB0aGlzLm11c2ljLm11dGVkIHx8IHRoaXMubXVzaWMucGF1c2VkO1xuXG4gICAgICAgIHRoaXMuaWNvbi5jbGFzc05hbWUgPSBpc011dGVkID8gXCJmYS1zb2xpZCBmYS12b2x1bWUtb2ZmXCIgOiBcImZhLXNvbGlkIGZhLXZvbHVtZS1oaWdoXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1tdXRlZFwiLCBpc011dGVkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvdW5kO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC9hcHAuanNcIik7XG4iLCIiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJwcm9wcyIsImNoaWxkcmVuIiwiZWxlIiwiZG9jdW1lbnQiLCJrZXkiLCJzdGFydHNXaXRoIiwiZXZlbnROYW1lIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRBdHRyaWJ1dGUiLCJmbGF0Q2hpbGRyZW4iLCJmbGF0IiwiSW5maW5pdHkiLCJhcHBlbmQiLCJmaWx0ZXIiLCJjaGlsZCIsInVuZGVmaW5lZCIsInJlbmRlciIsImVsZW1lbnQiLCJjb250YWluZXIiLCJyZXBsYWNlQ2hpbGRyZW4iLCJSb3V0ZXIiLCJyb3V0ZXIiLCJlZmZlY3RTdGFjayIsImFjdGl2ZUVmZmVjdCIsImNyZWF0ZVNpZ25hbCIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwiZWZmZWN0cyIsIlNldCIsIlJlYWQiLCJhZGQiLCJXcml0ZSIsIm5ld1ZhbHVlIiwiZm4iLCJmb3JFYWNoIiwiZWZmZWN0IiwiY3JlYXRlRWZmZWN0IiwicHVzaCIsInBvcCIsImxlbmd0aCIsIlJvdXRlcyIsIk9iamVjdCIsImNyZWF0ZSIsIkZpcnN0UmVzb2x2ZSIsIm9uIiwicGF0aCIsImhhbmRsZXIiLCJuYXZpZ2F0ZSIsImhpc3RvcnkiLCJuYXZpZ2F0aW9uIiwicmVzb2x2ZSIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJ1cmwiLCJVUkwiLCJocmVmIiwibGlzdGVuIiwib25FcnJvcjQwNCIsImV2ZW50IiwiZGVzdGluYXRpb24iLCJpbnRlcmNlcHQiLCJjb25zb2xlIiwibG9nIiwiUmVnaXN0ZXIiLCJHYW1lIiwiTWVudSIsIkxvYmJ5IiwiV2luTWVudSIsInNldFN0YXRlcyIsInNldFBsYXllck5hbWUiLCJzZXRIdWRQbGF5ZXJOYW1lIiwiU291bmQiLCJzZXRNZXNzYWdlcyIsIkdhbWVFbmdpbmUiLCJoYW5kbGVQbGF5ZXJEZWF0aCIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsIndpbmRvdyIsImhvc3RuYW1lIiwic291bmQiLCJjdXJyZW50R2FtZUVuZ2luZSIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJ3cyIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicXVlcnlTZWxlY3RvciIsInJvb21JZCIsInBsYXllcnNDb3VudCIsInNlY29uZHNMZWZ0IiwidGV4dCIsImRlc3Ryb3kiLCJncmlkIiwic2V0VGltZW91dCIsImdhbWVDb250YWluZXIiLCJsb2NhbFBsYXllciIsInBsYXllcnMiLCJmaW5kIiwicGxheWVyIiwiaWQiLCJ5b3VyUGxheWVySWQiLCJuaWNrbmFtZSIsImVuZ2luZSIsImVycm9yIiwid2lubmVyTmFtZSIsImVudGl0eSIsInBsYXllckVudGl0aWVzIiwiZ2V0IiwiU3RyaW5nIiwicGxheWVySWQiLCJ3b3JsZCIsImRlc3Ryb3lFbnRpdHkiLCJkZWxldGUiLCJwcmV2IiwiaGFuZGxlUmVtb3RlTW92ZSIsInBheWxvYWQiLCJoYW5kbGVSZW1vdGVCb21iIiwiaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZCIsImhhbmRsZVJlbW90ZUl0ZW1QaWNrdXAiLCJlcnIiLCJtZXNzYWdlcyIsIkNoYXRQbGF5ZXJzIiwibWVzc2FnZXNDb250YWluZXIiLCJjbGFzcyIsIm1zZ3MiLCJpbm5lckhUTUwiLCJtc2ciLCJwIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJ1bnNoaWZ0IiwiYnJvYWRjYXN0TWVzc2FnZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJ0YXJnZXQiLCJ0cmltIiwicmVzZXQiLCJzZW5kIiwic3RyaW5naWZ5Iiwib25TdWJtaXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJtYXhsZW5ndGgiLCJQb3NpdGlvbkNvbXBvbmVudCIsImd4IiwiZ3kiLCJ0aWxlU2l6ZSIsImdyaWRYIiwiZ3JpZFkiLCJ4IiwieSIsInRhcmdldFgiLCJ0YXJnZXRZIiwiVmVsb2NpdHlDb21wb25lbnQiLCJiYXNlU3BlZWQiLCJzcGVlZCIsImlzTW92aW5nIiwiZGlyZWN0aW9uIiwiSW5wdXRDb21wb25lbnQiLCJpbnB1dFF1ZXVlIiwiUmVuZGVyYWJsZUNvbXBvbmVudCIsImVsIiwiZnJhbWVXaWR0aCIsImZyYW1lSGVpZ2h0IiwidG90YWxGcmFtZXMiLCJmcHMiLCJjdXJyZW50RnJhbWUiLCJydW5GcmFtZXMiLCJpZGxlRnJhbWVzIiwiaWRsZUZwcyIsImxhc3RGcmFtZVRpbWUiLCJyb3ciLCJzdGF0ZSIsImxhc3RTdGF0ZSIsIlBsYXllckNvbXBvbmVudCIsImNoYXJUeXBlIiwiaXNMb2NhbCIsIkJvbWJDb21wb25lbnQiLCJvd25lcklkIiwidGltZXIiLCJyYW5nZSIsImV4cGxvZGVkIiwiRXhwbG9zaW9uQ29tcG9uZW50IiwiZHVyYXRpb24iLCJQb3dlclVwQ29tcG9uZW50IiwicGlja2VkVXAiLCJCZWhhdmlvckNvbXBvbmVudCIsImdob3N0TW9kZSIsInRocm93YWJsZSIsImRldG9uYXRvciIsImZhc3RTaG9lc0xldmVsIiwiYm9tYnMiLCJtYXgiLCJjdXJyZW50IiwiV29ybGQiLCJtb3ZlbWVudFN5c3RlbSIsInJlbmRlclN5c3RlbSIsImJvbWJTeXN0ZW0iLCJkYW1hZ2VTeXN0ZW0iLCJjaGVja0dhbWVFbmRDb25kaXRpb25zIiwic3Bhd25IZWFydFBvd2VyVXAiLCJwb3dlclVwU3lzdGVtIiwic3Bhd25Qb3dlclVwIiwic2V0Qm9tYnMiLCJzZXRMaXZlcyIsInNldFJhbmdlIiwic2V0U3BlZWQiLCJUSUxFX1NJWkUiLCJBTklNQVRJT05fUk9XUyIsIlJVTiIsInVwIiwibGVmdCIsImRvd24iLCJyaWdodCIsIklETEUiLCJjb25zdHJ1Y3RvciIsImNhbnZhc0NvbnRhaW5lciIsIm1hcERhdGEiLCJzb2NrZXQiLCJsb2NhbFBsYXllckVudGl0eSIsIk1hcCIsInBsYXllckluZm8iLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibG9zc01vZGFsVHJpZ2dlcmVkIiwiaW5wdXRFbmFibGVkIiwiZ2FtZUVuZGVkIiwibG9jYWxQbGF5ZXJJZCIsImFsbFBsYXllcnMiLCJ0b3RhbFBsYXllcnMiLCJub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCIsInBEYXRhIiwicGxheWVyRW50aXR5IiwiY3JlYXRlRW50aXR5Iiwic2V0IiwicGxheWVyRGl2IiwiZGlzY29ubmVjdGVkIiwiY29sb3IiLCJzdHlsZSIsInBvc2l0aW9uIiwiekluZGV4Iiwid2lsbENoYW5nZSIsInN4Iiwic3kiLCJhZGRDb21wb25lbnQiLCJwbGF5ZXJDb21wIiwibGl2ZXMiLCJtYXhCb21icyIsImJvbWJSYW5nZSIsInVwZGF0ZUh1ZFN0YXRzIiwic2V0dXBJbnB1dCIsIndhcm4iLCJtYXAiLCJyZWdpc3RlclN5c3RlbXMiLCJwZXJmb3JtYW5jZSIsIm5vdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImdhbWVMb29wIiwiaW5wdXQiLCJnZXRDb21wb25lbnQiLCJnZXRLZXlEaXJlY3Rpb24iLCJoYW5kbGVLZXlEb3duIiwiZGlyIiwiaW5jbHVkZXMiLCJjb2RlIiwiZHJvcEJvbWIiLCJoYW5kbGVLZXlVcCIsImQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicG9zIiwiY3VycmVudEJvbWJzIiwicXVlcnkiLCJiRW50aXR5IiwiY3JlYXRlZCIsImNyZWF0ZUJvbWIiLCJyZWFkeVN0YXRlIiwiT1BFTiIsImV4aXN0cyIsInNvbWUiLCJib21iIiwiYm9tYkVudGl0eSIsImJvbWJEaXYiLCJ0b3AiLCJib21iQ29tcCIsIkFycmF5IiwiZnJvbSIsImtleXMiLCJ2ZWwiLCJyZW5kZXJhYmxlIiwicmVtb3ZlUG93ZXJVcEF0IiwiYXBwbHlQb3dlclVwIiwibmV3TGl2ZXMiLCJwb3dlclVwcyIsInBvd2VyVXAiLCJwYXJlbnROb2RlIiwidmVsb2NpdHkiLCJNYXRoIiwibWluIiwidXBkYXRlTWFwQ2VsbCIsInRpbGUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJkZXN0cm95Qm94Q2FsbGJhY2siLCJoYXMiLCJvblBsYXllckh1cnQiLCJyZW1haW5pbmdMaXZlcyIsIm9uUG93ZXJVcFBpY2tlZCIsImJyb2FkY2FzdE1vdmVtZW50IiwiYWRkU3lzdGVtIiwidyIsImR0IiwidXBkYXRlIiwibmV4dE5vdyIsImhhbmRsZUdhbWVPdmVyIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJyb3VuZCIsImN1cnJlbnRMb2NhbFBsYXllck5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZ2V0UGxheWVyTmFtZSIsImdldEl0ZW0iLCJhZmZlY3RlZENlbGxzIiwiY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMiLCJjZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2Iiwid2lkdGgiLCJoZWlnaHQiLCJleHBsb3Npb25zIiwiZXhwIiwiYngiLCJieSIsImNlbGxzIiwiZGlyZWN0aW9ucyIsInN0ZXBzIiwiaSIsInR4IiwidHkiLCJjZWxsVHlwZSIsImhlYXJ0RW50aXR5IiwiaGVhcnREaXYiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiZm9udFNpemUiLCJkZWF0aEdyaWRYIiwiZmxvb3IiLCJkZWF0aEdyaWRZIiwicmVtb3ZlQ29tcG9uZW50IiwicFBvcyIsImludmluY2libGVVbnRpbCIsImVQb3MiLCJwbGF5ZXJHcmlkWCIsInBsYXllckdyaWRZIiwicHJldmlvdXNMaXZlcyIsImFscmVhZHlSZXBvcnRlZERlYWQiLCJlbnRpdGllcyIsImRlbHRhIiwiUExBWUVSX1NJWkUiLCJiZWhhdmlvciIsIm1vdmVUb3dhcmRUYXJnZXQiLCJhY3RpdmVJbnB1dCIsImR4IiwiZHkiLCJoYXNJbnB1dCIsIm5leHRYIiwibmV4dFkiLCJzbmFwVGhyZXNob2xkIiwiaXNCbG9ja2VkIiwiY3VycmVudFRpbGVYIiwiZGlmZlgiLCJhYnMiLCJzaWduIiwiY3VycmVudFRpbGVZIiwiZGlmZlkiLCJuZXh0WEFmdGVyU25hcCIsIm5leHRZQWZ0ZXJTbmFwIiwic3RlcCIsInBsYXllclNpemUiLCJwYWRkaW5nIiwiYm90dG9tIiwiaXNCbG9ja2VkQ2VsbCIsInBVcEVudGl0eSIsInVwUG9zIiwicFVwIiwic2VlZCIsInNlZWRSYW5kb20iLCJzaW4iLCJ0eXBlcyIsInR5cGVJbmRleCIsInJhbmRvbVR5cGUiLCJkaXYiLCJhbmltUm93cyIsInRhcmdldFJvdyIsImZyYW1lQ291bnQiLCJmcmFtZURlbGF5IiwicG9zWCIsInBvc1kiLCJiYWNrZ3JvdW5kUG9zaXRpb24iLCJ0cmFuc2Zvcm0iLCJuZXh0RW50aXR5SWQiLCJjb21wb25lbnRzIiwic3lzdGVtcyIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnRNYXAiLCJlbnRyaWVzIiwiY29tcG9uZW50RGF0YSIsImNvbXBvbmVudE5hbWVzIiwiZmlyc3RNYXAiLCJyZXN1bHRzIiwiaGFzQWxsIiwic3lzdGVtRnVuY3Rpb24iLCJzeXN0ZW0iLCJyZXBsYXlCdG4iLCJjbG9zZSIsInRvVXBwZXJDYXNlIiwiR1JJRF9CT1JERVJfU0laRSIsIkdBTUVfQ0hST01FX1dJRFRIIiwiR0FNRV9DSFJPTUVfSEVJR0hUIiwiaW1hZ2VzIiwicGxheWVyTmFtZSIsIm5hbWVFbCIsImxpdmVzRWwiLCJzcGVlZEVsIiwiYm9tYnNFbCIsInJhbmdlRWwiLCJib2FyZFdpZHRoIiwiYm9hcmRIZWlnaHQiLCJib2FyZE91dGVyV2lkdGgiLCJib2FyZE91dGVySGVpZ2h0Iiwidmlld3BvcnRXaWR0aCIsImlubmVyV2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsImlubmVySGVpZ2h0Iiwic2NhbGUiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJnYW1lU3RhcnRlZCIsInRpbWVyVGV4dCIsInJlbG9hZCIsIm1lbnVFbCIsInN1Ym1pdHRlZCIsInBsYXllckVudGVyIiwiY3VycmVudFRhcmdldCIsInNyYyIsIm11c2ljIiwiQXVkaW8iLCJidXR0b24iLCJpY29uIiwibG9vcCIsInZvbHVtZSIsInRvZ2dsZSIsInBsYXkiLCJvbmNlIiwidXBkYXRlQnV0dG9uIiwidGhlbiIsImNhdGNoIiwicGF1c2VkIiwibXV0ZWQiLCJpc011dGVkIiwiY2xhc3NMaXN0Il0sInNvdXJjZVJvb3QiOiIifQ==