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
      if (event.navigationType === 'reload') return;
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
/* harmony import */ var _pages_KickedMenu_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pages/KickedMenu.jsx */ "./src/pages/KickedMenu.jsx");
/* harmony import */ var _utils_sound__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/sound */ "./src/utils/sound.js");
/* harmony import */ var _components_chat__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/chat */ "./src/components/chat.jsx");
/* harmony import */ var _ecs_game_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../ecs/game.js */ "./src/ecs/game.js");
/* harmony import */ var _ecs_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../ecs/systems/damageSystem.js */ "./src/ecs/systems/damageSystem.js");














const root = document.getElementById("root");
const wss = new WebSocket(`ws://${window.location.hostname}:5000`);
const sound = new _utils_sound__WEBPACK_IMPORTED_MODULE_8__["default"]("./assets/sounds/background_music.mp3");
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
          const engine = new _ecs_game_js__WEBPACK_IMPORTED_MODULE_10__.GameEngine(gameContainer, message.grid, wss);
          engine.init(message.yourPlayerId, message.players || []);
          currentGameEngine = engine;

          // Immediately check if the player is already AFK before they even start playing
          if (document.hidden) {
            if (window.socket) {
              window.socket.close();
              window.socket = null;
            }
            wss.close();
            currentGameEngine.destroy();
            currentGameEngine = null;
            document.body.className = "menu-page";
            root.innerHTML = '';
            root.appendChild((0,_pages_KickedMenu_jsx__WEBPACK_IMPORTED_MODULE_7__["default"])());
            return; // Stop further listeners
          }

          // AFK / Tab-switch kick: handle future tab switches during the match
          document.addEventListener("visibilitychange", function onAFK() {
            if (document.hidden) {
              document.removeEventListener("visibilitychange", onAFK);
              if (window.socket) {
                window.socket.close();
                window.socket = null;
              }
              wss.close();
              if (currentGameEngine) {
                currentGameEngine.destroy();
                currentGameEngine = null;
              }
              document.body.className = "menu-page";
              root.innerHTML = '';
              root.appendChild((0,_pages_KickedMenu_jsx__WEBPACK_IMPORTED_MODULE_7__["default"])());
            }
          });
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
          (0,_ecs_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_11__.handlePlayerDeath)(currentGameEngine.world, entity, 64);
          currentGameEngine.world.destroyEntity(entity);
          currentGameEngine.playerEntities.delete(String(message.playerId));
        }
      }
      break;
    case "chat_message":
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_9__.setMessages)(prev => [...prev, message.message]);
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

/***/ "./src/pages/KickedMenu.jsx"
/*!**********************************!*\
  !*** ./src/pages/KickedMenu.jsx ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ KickedMenu)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");

function KickedMenu() {
  const returnBtn = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    class: "replay-button"
  }, "Return to Main Menu");
  returnBtn.addEventListener("click", () => {
    // Hard reload using replace + timeout to avoid SPA routing race conditions
    window.location.replace('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  });
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "menu-box"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "KICKED FOR AFK!"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "You were removed from the match for switching tabs."), returnBtn);
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

    // Hard reload using replace + timeout to avoid SPA routing race conditions
    window.location.replace('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVNBLGFBQWFBLENBQUNDLElBQUksRUFBRUMsS0FBSyxFQUFFLEdBQUdDLFFBQVEsRUFBRTtFQUNwRCxJQUFJLE9BQU9GLElBQUksS0FBSyxVQUFVLEVBQUU7SUFDNUIsT0FBT0EsSUFBSSxDQUFDO01BQUUsSUFBSUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQUVDO0lBQVMsQ0FBQyxDQUFDO0VBQy9DO0VBRUEsTUFBTUMsR0FBRyxHQUFHQyxRQUFRLENBQUNMLGFBQWEsQ0FBQ0MsSUFBSSxDQUFDO0VBRXhDLEtBQUssTUFBTUssR0FBRyxJQUFJSixLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUU7SUFDM0IsSUFBSUksR0FBRyxDQUFDQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksT0FBT0wsS0FBSyxDQUFDSSxHQUFHLENBQUMsS0FBSyxVQUFVLEVBQUU7TUFDMUQsTUFBTUUsU0FBUyxHQUFHRixHQUFHLENBQUNHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsV0FBVyxDQUFDLENBQUM7TUFDNUNOLEdBQUcsQ0FBQ08sZ0JBQWdCLENBQUNILFNBQVMsRUFBRU4sS0FBSyxDQUFDSSxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDLE1BQU07TUFDSEYsR0FBRyxDQUFDUSxZQUFZLENBQUNOLEdBQUcsRUFBRUosS0FBSyxDQUFDSSxHQUFHLENBQUMsQ0FBQztJQUNyQztFQUNKO0VBRUEsTUFBTU8sWUFBWSxHQUFHVixRQUFRLENBQUNXLElBQUksQ0FBQ0MsUUFBUSxDQUFDO0VBQzVDWCxHQUFHLENBQUNZLE1BQU0sQ0FBQyxHQUFHSCxZQUFZLENBQUNJLE1BQU0sQ0FBQ0MsS0FBSyxJQUFJQSxLQUFLLEtBQUssSUFBSSxJQUFJQSxLQUFLLEtBQUtDLFNBQVMsSUFBSUQsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDO0VBRXJHLE9BQU9kLEdBQUc7QUFDZDtBQUVPLFNBQVNnQixNQUFNQSxDQUFDQyxPQUFPLEVBQUVDLFNBQVMsRUFBRTtFQUN2Q0EsU0FBUyxDQUFDQyxlQUFlLENBQUNGLE9BQU8sQ0FBQztBQUN0QyxDOzs7Ozs7Ozs7Ozs7Ozs7QUN4QnFDO0FBRXJDLElBQUlJLE1BQU0sR0FBRyxJQUFJRCw4Q0FBTSxDQUFDLENBQUM7QUFFekIsaUVBQWVDLE1BQU0sRTs7Ozs7Ozs7Ozs7Ozs7O0FDSnJCLE1BQU1DLFdBQVcsR0FBRyxFQUFFO0FBQ3RCLElBQUlDLFlBQVksR0FBRyxJQUFJO0FBRWhCLFNBQVNDLFlBQVlBLENBQUNDLFlBQVksRUFBRTtFQUN4QyxJQUFJQyxLQUFLLEdBQUdELFlBQVk7RUFDeEIsTUFBTUUsT0FBTyxHQUFHLElBQUlDLEdBQUcsQ0FBQyxDQUFDO0VBRXpCLE1BQU1DLElBQUksR0FBR0EsQ0FBQSxLQUFNO0lBQ2hCLElBQUlOLFlBQVksRUFBRTtNQUNmSSxPQUFPLENBQUNHLEdBQUcsQ0FBQ1AsWUFBWSxDQUFDO0lBQzVCO0lBQ0EsT0FBT0csS0FBSztFQUNmLENBQUM7RUFFRCxNQUFNSyxLQUFLLEdBQUlDLFFBQVEsSUFBSztJQUN6QixJQUFJLE9BQU9BLFFBQVEsS0FBSyxVQUFVLEVBQUU7TUFDakMsSUFBSUMsRUFBRSxHQUFHRCxRQUFRO01BQ2pCTixLQUFLLEdBQUdPLEVBQUUsQ0FBQ1AsS0FBSyxDQUFDO0lBQ3BCLENBQUMsTUFDSUEsS0FBSyxHQUFHTSxRQUFRO0lBQ3JCTCxPQUFPLENBQUNPLE9BQU8sQ0FBQ0MsTUFBTSxJQUFJQSxNQUFNLENBQUMsQ0FBQyxDQUFDO0VBQ3RDLENBQUM7RUFFRCxPQUFPLENBQUNOLElBQUksRUFBRUUsS0FBSyxDQUFDO0FBQ3ZCO0FBRU8sU0FBU0ssWUFBWUEsQ0FBQ0QsTUFBTSxFQUFFO0VBQ2xDYixXQUFXLENBQUNlLElBQUksQ0FBQ0YsTUFBTSxDQUFDO0VBQ3hCWixZQUFZLEdBQUdZLE1BQU07RUFDckJBLE1BQU0sQ0FBQyxDQUFDO0VBQ1JiLFdBQVcsQ0FBQ2dCLEdBQUcsQ0FBQyxDQUFDO0VBQ2pCZixZQUFZLEdBQUdELFdBQVcsQ0FBQ0EsV0FBVyxDQUFDaUIsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUk7QUFDN0QsQzs7Ozs7Ozs7Ozs7Ozs7QUNoQ08sTUFBTW5CLE1BQU0sQ0FBQztFQUNoQixDQUFDb0IsTUFBTSxHQUFHQyxNQUFNLENBQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUM7RUFDN0IsQ0FBQ0MsWUFBWSxHQUFHLEtBQUs7RUFFckJDLEVBQUVBLENBQUNDLElBQUksRUFBRUMsT0FBTyxFQUFFO0lBQ2QsSUFBSSxDQUFDLENBQUNOLE1BQU0sQ0FBQ0ssSUFBSSxDQUFDLEdBQUdDLE9BQU87SUFDNUIsT0FBTyxJQUFJO0VBQ2Y7RUFFQUMsUUFBUUEsQ0FBQ0YsSUFBSSxFQUFFO0lBQUVHLE9BQU8sR0FBRztFQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtJQUN0Q0gsSUFBSSxHQUFHQSxJQUFJLENBQUMxQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcwQyxJQUFJLEdBQUcsR0FBRyxHQUFHQSxJQUFJO0lBQy9DLE9BQU9JLFVBQVUsQ0FBQ0YsUUFBUSxDQUFDRixJQUFJLEVBQUU7TUFBRUc7SUFBUSxDQUFDLENBQUM7RUFDakQ7RUFFQUUsT0FBT0EsQ0FBQ0wsSUFBSSxHQUFHTSxRQUFRLENBQUNDLFFBQVEsRUFBRTtJQUM5QixNQUFNbkIsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDTyxNQUFNLENBQUNLLElBQUksQ0FBQztJQUU3QixJQUFJLENBQUNaLEVBQUUsRUFBRTtNQUNMLE9BQU8sS0FBSztJQUNoQjtJQUVBQSxFQUFFLENBQUM7TUFBRW9CLEdBQUcsRUFBRSxJQUFJQyxHQUFHLENBQUNILFFBQVEsQ0FBQ0ksSUFBSTtJQUFFLENBQUMsQ0FBQztJQUNuQyxPQUFPLElBQUk7RUFDZjtFQUVBQyxNQUFNQSxDQUFDQyxVQUFVLEVBQUU7SUFDZlIsVUFBVSxDQUFDMUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFHbUQsS0FBSyxJQUFLO01BQy9DLElBQUlBLEtBQUssQ0FBQ0MsY0FBYyxLQUFLLFFBQVEsRUFBRTtNQUN2QyxNQUFNTixHQUFHLEdBQUcsSUFBSUMsR0FBRyxDQUFDSSxLQUFLLENBQUNFLFdBQVcsQ0FBQ1AsR0FBRyxDQUFDO01BRTFDSyxLQUFLLENBQUNHLFNBQVMsQ0FBQztRQUNaZixPQUFPLEVBQUVBLENBQUEsS0FBTTtVQUNYZ0IsT0FBTyxDQUFDQyxHQUFHLENBQUNWLEdBQUcsQ0FBQ0QsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDWixNQUFNLENBQUM7VUFFdkMsTUFBTVAsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDTyxNQUFNLENBQUNhLEdBQUcsQ0FBQ0QsUUFBUSxDQUFDO1VBQ3JDLElBQUksQ0FBQ25CLEVBQUUsRUFBRTtZQUNMd0IsVUFBVSxDQUFDLENBQUM7WUFDWjtVQUNKO1VBQ0F4QixFQUFFLENBQUM7WUFBRW9CO1VBQUksQ0FBQyxDQUFDO1FBQ2Y7TUFDSixDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7SUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUNWLFlBQVksRUFBRTtNQUNyQixJQUFJLENBQUNPLE9BQU8sQ0FBQyxDQUFDO01BQ2QsSUFBSSxDQUFDLENBQUNQLFlBQVksR0FBRyxJQUFJO0lBQzdCO0lBQ0EsT0FBTyxJQUFJO0VBQ2Y7QUFDSixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xEaUU7QUFDUjtBQUNoQjtBQUNSO0FBQ0E7QUFDRTtBQUNRO0FBQ007QUFDTjtBQUN1QjtBQUMvQjtBQUNjO0FBRUw7QUFDdUI7QUFFbkUsTUFBTWtDLElBQUksR0FBRzVFLFFBQVEsQ0FBQzZFLGNBQWMsQ0FBQyxNQUFNLENBQUM7QUFDNUMsTUFBTUMsR0FBRyxHQUFHLElBQUlDLFNBQVMsQ0FBQyxRQUFRQyxNQUFNLENBQUM5QixRQUFRLENBQUMrQixRQUFRLE9BQU8sQ0FBQztBQUNsRSxNQUFNQyxLQUFLLEdBQUcsSUFBSVYsb0RBQUssQ0FBQyxzQ0FBc0MsQ0FBQztBQUMvRCxJQUFJVyxpQkFBaUIsR0FBRyxJQUFJO0FBRTVCRCxLQUFLLENBQUNFLElBQUksQ0FBQyxDQUFDO0FBRVpoRSxzRUFBTSxDQUFDdUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxNQUFNO0VBQ2pCM0MsUUFBUSxDQUFDcUYsSUFBSSxDQUFDQyxTQUFTLEdBQUcsZUFBZTtFQUN6Q3ZFLDJEQUFNLENBQUNwQixrRUFBQSxDQUFDb0UsdURBQVE7SUFBQ2UsR0FBRyxFQUFFQTtFQUFJLENBQUUsQ0FBQyxFQUFFRixJQUFJLENBQUM7QUFDeEMsQ0FBQyxDQUFDO0FBRUZ4RCxzRUFBTSxDQUFDbUMsTUFBTSxDQUFDLE1BQU07RUFBRWdDLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFBQyxDQUFDLENBQUM7QUFFckNULEdBQUcsQ0FBQ3hFLGdCQUFnQixDQUFDLE1BQU0sRUFBR2tGLEVBQUUsSUFBSyxDQUNyQyxDQUFDLENBQUM7QUFFRlYsR0FBRyxDQUFDeEUsZ0JBQWdCLENBQUMsU0FBUyxFQUFHbUQsS0FBSyxJQUFLO0VBQ3ZDLE1BQU1nQyxPQUFPLEdBQUdDLElBQUksQ0FBQ0MsS0FBSyxDQUFDbEMsS0FBSyxDQUFDbUMsSUFBSSxDQUFDO0VBQ3RDLFFBQVFILE9BQU8sQ0FBQzdGLElBQUk7SUFDaEIsS0FBSyxhQUFhO0lBQ2xCLEtBQUssYUFBYTtNQUNkSSxRQUFRLENBQUNxRixJQUFJLENBQUNDLFNBQVMsR0FBRyxZQUFZO01BQ3RDLElBQUksQ0FBQ1YsSUFBSSxDQUFDaUIsYUFBYSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7UUFDekM5RSwyREFBTSxDQUFDcEIsa0VBQUEsQ0FBQ3VFLG9EQUFLLE1BQUUsQ0FBQyxFQUFFVSxJQUFJLENBQUM7TUFDM0I7TUFDQVAsdURBQVMsQ0FBQztRQUNOeUIsTUFBTSxFQUFFTCxPQUFPLENBQUNLLE1BQU07UUFDdEJDLFlBQVksRUFBRU4sT0FBTyxDQUFDTSxZQUFZO1FBQ2xDQyxXQUFXLEVBQUVQLE9BQU8sQ0FBQ08sV0FBVztRQUNoQ0MsSUFBSSxFQUFFUixPQUFPLENBQUNRO01BQ2xCLENBQUMsQ0FBQztNQUNGO0lBRUosS0FBSyxhQUFhO01BQ2QsSUFBSWQsaUJBQWlCLEVBQUU7UUFDbkJBLGlCQUFpQixDQUFDZSxPQUFPLENBQUMsQ0FBQztRQUMzQmYsaUJBQWlCLEdBQUcsSUFBSTtNQUM1QjtNQUNBbkYsUUFBUSxDQUFDcUYsSUFBSSxDQUFDQyxTQUFTLEdBQUcsWUFBWTtNQUN0QyxJQUFJLENBQUNWLElBQUksQ0FBQ2lCLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO1FBQ3pDOUUsMkRBQU0sQ0FBQ3BCLGtFQUFBLENBQUN1RSxvREFBSyxNQUFFLENBQUMsRUFBRVUsSUFBSSxDQUFDO01BQzNCO01BQ0FQLHVEQUFTLENBQUM7UUFDTnlCLE1BQU0sRUFBRSxFQUFFO1FBQ1ZDLFlBQVksRUFBRSxDQUFDO1FBQ2ZDLFdBQVcsRUFBRSxFQUFFO1FBQ2ZDLElBQUksRUFBRTtNQUNWLENBQUMsQ0FBQztNQUNGO0lBRUosS0FBSyxjQUFjO01BQ2ZqRyxRQUFRLENBQUNxRixJQUFJLENBQUNDLFNBQVMsR0FBRyxXQUFXO01BRXJDdkUsMkRBQU0sQ0FBQ3BCLGtFQUFBLENBQUNxRSxtREFBSTtRQUFDbUMsSUFBSSxFQUFFVixPQUFPLENBQUNVO01BQUssQ0FBRSxDQUFDLEVBQUV2QixJQUFJLENBQUM7TUFFMUN3QixVQUFVLENBQUMsTUFBTTtRQUNiLE1BQU1DLGFBQWEsR0FBR3JHLFFBQVEsQ0FBQzZFLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUUvRCxJQUFJd0IsYUFBYSxFQUFFO1VBQ2YsSUFBSWxCLGlCQUFpQixFQUFFO1lBQ25CQSxpQkFBaUIsQ0FBQ2UsT0FBTyxDQUFDLENBQUM7VUFDL0I7VUFFQSxNQUFNSSxXQUFXLEdBQUcsQ0FBQ2IsT0FBTyxDQUFDYyxPQUFPLElBQUksRUFBRSxFQUFFQyxJQUFJLENBQUNDLE1BQU0sSUFBSUEsTUFBTSxDQUFDQyxFQUFFLEtBQUtqQixPQUFPLENBQUNrQixZQUFZLENBQUM7VUFDOUYsSUFBSUwsV0FBVyxJQUFJQSxXQUFXLENBQUNNLFFBQVEsRUFBRTtZQUNyQ3JDLDBEQUFnQixDQUFDK0IsV0FBVyxDQUFDTSxRQUFRLENBQUM7VUFDMUM7VUFFQSxNQUFNQyxNQUFNLEdBQUcsSUFBSW5DLHFEQUFVLENBQUMyQixhQUFhLEVBQUVaLE9BQU8sQ0FBQ1UsSUFBSSxFQUFFckIsR0FBRyxDQUFDO1VBQy9EK0IsTUFBTSxDQUFDekIsSUFBSSxDQUFDSyxPQUFPLENBQUNrQixZQUFZLEVBQUVsQixPQUFPLENBQUNjLE9BQU8sSUFBSSxFQUFFLENBQUM7VUFFeERwQixpQkFBaUIsR0FBRzBCLE1BQU07O1VBRTFCO1VBQ0EsSUFBSTdHLFFBQVEsQ0FBQzhHLE1BQU0sRUFBRTtZQUNqQixJQUFJOUIsTUFBTSxDQUFDK0IsTUFBTSxFQUFFO2NBQ2YvQixNQUFNLENBQUMrQixNQUFNLENBQUNDLEtBQUssQ0FBQyxDQUFDO2NBQ3JCaEMsTUFBTSxDQUFDK0IsTUFBTSxHQUFHLElBQUk7WUFDeEI7WUFDQWpDLEdBQUcsQ0FBQ2tDLEtBQUssQ0FBQyxDQUFDO1lBRVg3QixpQkFBaUIsQ0FBQ2UsT0FBTyxDQUFDLENBQUM7WUFDM0JmLGlCQUFpQixHQUFHLElBQUk7WUFFeEJuRixRQUFRLENBQUNxRixJQUFJLENBQUNDLFNBQVMsR0FBRyxXQUFXO1lBQ3JDVixJQUFJLENBQUNxQyxTQUFTLEdBQUcsRUFBRTtZQUNuQnJDLElBQUksQ0FBQ3NDLFdBQVcsQ0FBQzlDLGlFQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sQ0FBQztVQUNaOztVQUVBO1VBQ0FwRSxRQUFRLENBQUNNLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFNBQVM2RyxLQUFLQSxDQUFBLEVBQUc7WUFDM0QsSUFBSW5ILFFBQVEsQ0FBQzhHLE1BQU0sRUFBRTtjQUNqQjlHLFFBQVEsQ0FBQ29ILG1CQUFtQixDQUFDLGtCQUFrQixFQUFFRCxLQUFLLENBQUM7Y0FFdkQsSUFBSW5DLE1BQU0sQ0FBQytCLE1BQU0sRUFBRTtnQkFDZi9CLE1BQU0sQ0FBQytCLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDLENBQUM7Z0JBQ3JCaEMsTUFBTSxDQUFDK0IsTUFBTSxHQUFHLElBQUk7Y0FDeEI7Y0FDQWpDLEdBQUcsQ0FBQ2tDLEtBQUssQ0FBQyxDQUFDO2NBRVgsSUFBSTdCLGlCQUFpQixFQUFFO2dCQUNuQkEsaUJBQWlCLENBQUNlLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQmYsaUJBQWlCLEdBQUcsSUFBSTtjQUM1QjtjQUVBbkYsUUFBUSxDQUFDcUYsSUFBSSxDQUFDQyxTQUFTLEdBQUcsV0FBVztjQUNyQ1YsSUFBSSxDQUFDcUMsU0FBUyxHQUFHLEVBQUU7Y0FDbkJyQyxJQUFJLENBQUNzQyxXQUFXLENBQUM5QyxpRUFBVSxDQUFDLENBQUMsQ0FBQztZQUNsQztVQUNKLENBQUMsQ0FBQztRQUNOLENBQUMsTUFBTTtVQUNIUCxPQUFPLENBQUN3RCxLQUFLLENBQUMsOEJBQThCLENBQUM7UUFDakQ7TUFDSixDQUFDLEVBQUUsRUFBRSxDQUFDO01BQ047SUFFSixLQUFLLFlBQVk7TUFDYnJILFFBQVEsQ0FBQ3FGLElBQUksQ0FBQ0MsU0FBUyxHQUFHLFdBQVc7TUFDckN2RSwyREFBTSxDQUFDcEIsa0VBQUEsQ0FBQ3NFLG1EQUFJLE1BQUUsQ0FBQyxFQUFFVyxJQUFJLENBQUM7TUFDdEI7SUFFSixLQUFLLFVBQVU7TUFDWCxJQUFJTyxpQkFBaUIsRUFBRTtRQUNuQkEsaUJBQWlCLENBQUNlLE9BQU8sQ0FBQyxDQUFDO01BQy9CO01BQ0FsRyxRQUFRLENBQUNxRixJQUFJLENBQUNDLFNBQVMsR0FBRyxXQUFXO01BQ3JDVixJQUFJLENBQUNxQyxTQUFTLEdBQUcsRUFBRTtNQUNuQnJDLElBQUksQ0FBQ3NDLFdBQVcsQ0FBQy9DLDhEQUFPLENBQUM7UUFBRW1ELFVBQVUsRUFBRTdCLE9BQU8sQ0FBQzZCO01BQVcsQ0FBQyxDQUFDLENBQUM7TUFDN0Q7SUFFSixLQUFLLHFCQUFxQjtNQUN0QixJQUFJbkMsaUJBQWlCLEVBQUU7UUFDbkIsTUFBTW9DLE1BQU0sR0FBR3BDLGlCQUFpQixDQUFDcUMsY0FBYyxDQUFDQyxHQUFHLENBQUNDLE1BQU0sQ0FBQ2pDLE9BQU8sQ0FBQ2tDLFFBQVEsQ0FBQyxDQUFDO1FBQzdFLElBQUlKLE1BQU0sS0FBS3pHLFNBQVMsRUFBRTtVQUN0QjZELGdGQUFpQixDQUFDUSxpQkFBaUIsQ0FBQ3lDLEtBQUssRUFBRUwsTUFBTSxFQUFFLEVBQUUsQ0FBQztVQUV0RHBDLGlCQUFpQixDQUFDeUMsS0FBSyxDQUFDQyxhQUFhLENBQUNOLE1BQU0sQ0FBQztVQUM3Q3BDLGlCQUFpQixDQUFDcUMsY0FBYyxDQUFDTSxNQUFNLENBQUNKLE1BQU0sQ0FBQ2pDLE9BQU8sQ0FBQ2tDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFO01BQ0o7TUFDQTtJQUVKLEtBQUssY0FBYztNQUNmbEQsNkRBQVcsQ0FBQ3NELElBQUksSUFBSSxDQUFDLEdBQUdBLElBQUksRUFBRXRDLE9BQU8sQ0FBQ0EsT0FBTyxDQUFDLENBQUM7TUFDL0M7SUFDSixLQUFLLGNBQWM7TUFDZixJQUFJTixpQkFBaUIsRUFBRTtRQUNuQkEsaUJBQWlCLENBQUM2QyxnQkFBZ0IsQ0FBQ3ZDLE9BQU8sQ0FBQ3dDLE9BQU8sQ0FBQztNQUN2RDtNQUNBO0lBQ0osS0FBSyxjQUFjO01BQ2YsSUFBSTlDLGlCQUFpQixFQUFFO1FBQ25CQSxpQkFBaUIsQ0FBQytDLGdCQUFnQixDQUFDekMsT0FBTyxDQUFDd0MsT0FBTyxDQUFDO01BQ3ZEO01BQ0E7SUFDSixLQUFLLGdCQUFnQjtNQUNqQixJQUFJOUMsaUJBQWlCLEVBQUU7UUFDbkJBLGlCQUFpQixDQUFDZ0QseUJBQXlCLENBQUMxQyxPQUFPLENBQUN3QyxPQUFPLENBQUM7TUFDaEU7TUFDQTtJQUNKLEtBQUssYUFBYTtNQUNkO01BQ0EsSUFBSTlDLGlCQUFpQixFQUFFO1FBQ25CQSxpQkFBaUIsQ0FBQ2lELHNCQUFzQixDQUFDM0MsT0FBTyxDQUFDd0MsT0FBTyxDQUFDO01BQzdEO01BQ0E7RUFDUjtBQUNKLENBQUMsQ0FBQztBQUVGbkQsR0FBRyxDQUFDeEUsZ0JBQWdCLENBQUMsT0FBTyxFQUFHK0gsR0FBRyxJQUFLO0VBQ25DeEUsT0FBTyxDQUFDQyxHQUFHLENBQUMsT0FBTyxFQUFFdUUsR0FBRyxDQUFDO0FBQzdCLENBQUMsQ0FBQztBQUVGdkQsR0FBRyxDQUFDeEUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07RUFDaEN1RCxPQUFPLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDekIsQ0FBQyxDQUFDO0FBRUYsaUVBQWVnQixHQUFHLEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25NdUM7QUFDb0I7QUFDaEQ7QUFFN0IsTUFBTSxDQUFDd0QsUUFBUSxFQUFFN0QsV0FBVyxDQUFDLEdBQUdsRCx3RUFBWSxDQUFDLEVBQUUsQ0FBQztBQUN6QjtBQUV2QixTQUFTZ0gsV0FBV0EsQ0FBQSxFQUFHO0VBQ25CLE1BQU1DLGlCQUFpQixHQUFHN0ksa0VBQUE7SUFBSzhJLEtBQUssRUFBQztFQUFVLENBQU0sQ0FBQztFQUV0RHRHLHdFQUFZLENBQUMsTUFBTTtJQUNmLE1BQU11RyxJQUFJLEdBQUdKLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZCRSxpQkFBaUIsQ0FBQ3ZCLFNBQVMsR0FBRyxFQUFFO0lBRWhDLEtBQUssSUFBSTBCLEdBQUcsSUFBSUQsSUFBSSxFQUFFO01BQ2xCLE1BQU1FLENBQUMsR0FBRzVJLFFBQVEsQ0FBQ0wsYUFBYSxDQUFDLEdBQUcsQ0FBQztNQUNyQ2lKLENBQUMsQ0FBQ0MsV0FBVyxHQUFHRixHQUFHO01BQ25CSCxpQkFBaUIsQ0FBQ3RCLFdBQVcsQ0FBQzBCLENBQUMsQ0FBQztNQUNoQyxJQUFJSixpQkFBaUIsQ0FBQzFJLFFBQVEsQ0FBQ3dDLE1BQU0sR0FBRyxFQUFFLEVBQUU7UUFDeENrRyxpQkFBaUIsQ0FBQ00sV0FBVyxDQUFDTixpQkFBaUIsQ0FBQ08saUJBQWlCLENBQUM7UUFDbEVMLElBQUksQ0FBQ00sT0FBTyxDQUFDLENBQUM7TUFDbEI7TUFBQztJQUVMO0lBQUM7RUFDTCxDQUFDLENBQUM7RUFFRixTQUFTQyxnQkFBZ0JBLENBQUNDLENBQUMsRUFBRTtJQUN6QkEsQ0FBQyxDQUFDQyxjQUFjLENBQUMsQ0FBQztJQUVsQixJQUFJQyxRQUFRLEdBQUcsSUFBSUMsUUFBUSxDQUFDSCxDQUFDLENBQUNJLE1BQU0sQ0FBQztJQUNyQyxJQUFJN0QsT0FBTyxHQUFHMkQsUUFBUSxDQUFDM0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDOEIsSUFBSSxDQUFDLENBQUM7SUFFNUMsSUFBSSxDQUFDOUQsT0FBTyxJQUFJQSxPQUFPLENBQUNuRCxNQUFNLEdBQUcsRUFBRSxFQUFFO01BQ2pDNEcsQ0FBQyxDQUFDSSxNQUFNLENBQUNFLEtBQUssQ0FBQyxDQUFDO01BQ2hCO0lBQ0o7SUFBQztJQUVEMUUsZ0RBQUcsQ0FBQzJFLElBQUksQ0FBQy9ELElBQUksQ0FBQ2dFLFNBQVMsQ0FBQztNQUNwQjlKLElBQUksRUFBRSxjQUFjO01BQ3BCNkYsT0FBTyxFQUFFQTtJQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ0h5RCxDQUFDLENBQUNJLE1BQU0sQ0FBQ0UsS0FBSyxDQUFDLENBQUM7RUFDcEI7RUFFQSxPQUNJN0osa0VBQUE7SUFBSzhJLEtBQUssRUFBQyxNQUFNO0lBQUNrQixRQUFRLEVBQUVWO0VBQWlCLEdBQ3hDVCxpQkFBaUIsRUFDbEI3SSxrRUFBQSxlQUNJQSxrRUFBQTtJQUFPQyxJQUFJLEVBQUMsTUFBTTtJQUFDZ0ssSUFBSSxFQUFDLFNBQVM7SUFBQ0MsV0FBVyxFQUFDLCtCQUErQjtJQUFDQyxTQUFTLEVBQUM7RUFBSSxDQUFDLENBQUMsRUFDOUZuSyxrRUFBQTtJQUFRQyxJQUFJLEVBQUM7RUFBUSxHQUFDLE1BQVksQ0FDaEMsQ0FDTCxDQUFDO0FBRWQ7QUFFQSxpRUFBZTJJLFdBQVcsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZEMUI7O0FBRU8sTUFBTXdCLGlCQUFpQixHQUFHQSxDQUFDQyxFQUFFLEVBQUVDLEVBQUUsRUFBRUMsUUFBUSxHQUFHLEVBQUUsTUFBTTtFQUN6REMsS0FBSyxFQUFFSCxFQUFFO0VBQ1RJLEtBQUssRUFBRUgsRUFBRTtFQUNUSSxDQUFDLEVBQUVMLEVBQUUsR0FBR0UsUUFBUTtFQUNoQkksQ0FBQyxFQUFFTCxFQUFFLEdBQUdDLFFBQVE7RUFDaEJLLE9BQU8sRUFBRVAsRUFBRSxHQUFHRSxRQUFRO0VBQ3RCTSxPQUFPLEVBQUVQLEVBQUUsR0FBR0M7QUFDbEIsQ0FBQyxDQUFDO0FBRUssTUFBTU8saUJBQWlCLEdBQUdBLENBQUNDLFNBQVMsR0FBRyxHQUFHLE1BQU07RUFDbkRBLFNBQVMsRUFBRUEsU0FBUztFQUNwQkMsS0FBSyxFQUFFRCxTQUFTO0VBQ2hCRSxRQUFRLEVBQUUsS0FBSztFQUNmQyxTQUFTLEVBQUU7QUFDZixDQUFDLENBQUM7QUFFSyxNQUFNQyxjQUFjLEdBQUdBLENBQUEsTUFBTztFQUNqQ0MsVUFBVSxFQUFFO0FBQ2hCLENBQUMsQ0FBQztBQUVLLE1BQU1DLG1CQUFtQixHQUFHQSxDQUFDQyxFQUFFLEVBQUVDLFVBQVUsR0FBRyxFQUFFLEVBQUVDLFdBQVcsR0FBRyxFQUFFLEVBQUVDLFdBQVcsR0FBRyxDQUFDLEVBQUVDLEdBQUcsR0FBRyxFQUFFLE1BQU07RUFDdEdKLEVBQUUsRUFBRUEsRUFBRTtFQUNOQyxVQUFVLEVBQUVBLFVBQVU7RUFDdEJDLFdBQVcsRUFBRUEsV0FBVztFQUN4QkcsWUFBWSxFQUFFLENBQUM7RUFDZkYsV0FBVyxFQUFFQSxXQUFXO0VBQ3hCRyxTQUFTLEVBQUUsQ0FBQztFQUNaQyxVQUFVLEVBQUUsQ0FBQztFQUNiSCxHQUFHLEVBQUVBLEdBQUc7RUFDUkksT0FBTyxFQUFFLENBQUM7RUFDVkMsYUFBYSxFQUFFLENBQUM7RUFDaEJDLEdBQUcsRUFBRSxDQUFDO0VBQ05DLEtBQUssRUFBRSxNQUFNO0VBQ2JDLFNBQVMsRUFBRTtBQUNmLENBQUMsQ0FBQztBQUVLLE1BQU1DLGVBQWUsR0FBR0EsQ0FBQ3BGLEVBQUUsRUFBRXFGLFFBQVEsRUFBRUMsT0FBTyxHQUFHLEtBQUssTUFBTTtFQUMvRHRGLEVBQUUsRUFBRUEsRUFBRTtFQUNOcUYsUUFBUSxFQUFFQSxRQUFRO0VBQ2xCQyxPQUFPLEVBQUVBO0FBQ2IsQ0FBQyxDQUFDO0FBRUssTUFBTUMsYUFBYSxHQUFHQSxDQUFDQyxPQUFPLEVBQUVDLEtBQUssR0FBRyxJQUFJLEVBQUVDLEtBQUssR0FBRyxDQUFDLE1BQU07RUFDaEVGLE9BQU8sRUFBRUEsT0FBTztFQUNoQkMsS0FBSyxFQUFFQSxLQUFLO0VBQ1pDLEtBQUssRUFBRUEsS0FBSztFQUNaQyxRQUFRLEVBQUU7QUFDZCxDQUFDLENBQUM7QUFFSyxNQUFNQyxrQkFBa0IsR0FBR0EsQ0FBQ0MsUUFBUSxHQUFHLEdBQUcsTUFBTTtFQUNuREEsUUFBUSxFQUFFQTtBQUNkLENBQUMsQ0FBQztBQUVLLE1BQU1DLGdCQUFnQixHQUFJNU0sSUFBSSxLQUFNO0VBQ3ZDQSxJQUFJLEVBQUVBLElBQUk7RUFDVjZNLFFBQVEsRUFBRTtBQUNkLENBQUMsQ0FBQztBQUVLLE1BQU1DLGlCQUFpQixHQUFHQSxDQUFBLE1BQU87RUFDcENDLFNBQVMsRUFBRSxLQUFLO0VBQ2hCQyxTQUFTLEVBQUUsS0FBSztFQUNoQkMsU0FBUyxFQUFFLEtBQUs7RUFDaEJDLGNBQWMsRUFBRSxDQUFDO0VBQ2pCQyxLQUFLLEVBQUU7SUFDSEMsR0FBRyxFQUFFLENBQUM7SUFDTkMsT0FBTyxFQUFFLENBQUM7SUFDVmIsS0FBSyxFQUFFO0VBQ1g7QUFDSixDQUFDLENBQUMsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0RWlDO0FBUVY7QUFDb0M7QUFDSjtBQUNKO0FBQytDO0FBQ3pEO0FBQ1U7QUFFb0I7QUFDRjtBQUV2RSxNQUFNMkIsU0FBUyxHQUFHLEVBQUU7QUFDcEIsTUFBTUMsY0FBYyxHQUFHO0VBQ25CQyxHQUFHLEVBQUU7SUFBRUMsRUFBRSxFQUFFLEVBQUU7SUFBRUMsSUFBSSxFQUFFLEVBQUU7SUFBRUMsSUFBSSxFQUFFLEVBQUU7SUFBRUMsS0FBSyxFQUFFO0VBQUcsQ0FBQztFQUM5Q0MsSUFBSSxFQUFFO0lBQUVKLEVBQUUsRUFBRSxFQUFFO0lBQUVDLElBQUksRUFBRSxFQUFFO0lBQUVDLElBQUksRUFBRSxFQUFFO0lBQUVDLEtBQUssRUFBRTtFQUFHO0FBQ2xELENBQUM7QUFFTSxNQUFNM0osVUFBVSxDQUFDO0VBQ3BCNkosV0FBV0EsQ0FBQ0MsZUFBZSxFQUFFQyxPQUFPLEVBQUUxSCxNQUFNLEVBQUU7SUFDMUMsSUFBSSxDQUFDOUYsU0FBUyxHQUFHdU4sZUFBZTtJQUNoQyxJQUFJLENBQUNDLE9BQU8sR0FBR0EsT0FBTztJQUN0QixJQUFJLENBQUMxSCxNQUFNLEdBQUdBLE1BQU07SUFDcEIsSUFBSSxDQUFDYSxLQUFLLEdBQUcsSUFBSXNGLDRDQUFLLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUN3QixpQkFBaUIsR0FBRyxJQUFJO0lBQzdCLElBQUksQ0FBQ2xILGNBQWMsR0FBRyxJQUFJbUgsR0FBRyxDQUFDLENBQUM7SUFDL0IsSUFBSSxDQUFDQyxVQUFVLEdBQUcsSUFBSUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdCLElBQUksQ0FBQ0UsUUFBUSxHQUFHLENBQUM7SUFDakIsSUFBSSxDQUFDQyxvQkFBb0IsR0FBRyxJQUFJO0lBQ2hDLElBQUksQ0FBQ0MsY0FBYyxHQUFHLElBQUk7SUFDMUIsSUFBSSxDQUFDQyxPQUFPLEdBQUcsS0FBSztJQUNwQixJQUFJLENBQUNDLGVBQWUsR0FBRyxJQUFJdE4sR0FBRyxDQUFDLENBQUM7SUFDaEM7SUFDQSxJQUFJLENBQUN1TixrQkFBa0IsR0FBRyxLQUFLO0lBQy9CO0lBQ0EsSUFBSSxDQUFDQyxZQUFZLEdBQUcsSUFBSTtJQUN4QjtJQUNBLElBQUksQ0FBQ0MsU0FBUyxHQUFHLEtBQUs7RUFDMUI7RUFFQWhLLElBQUlBLENBQUNpSyxhQUFhLEVBQUVDLFVBQVUsRUFBRTtJQUM1QixJQUFJLENBQUNDLFlBQVksR0FBR0QsVUFBVSxDQUFDaE4sTUFBTTtJQUNyQyxNQUFNa04sdUJBQXVCLEdBQUc5SCxNQUFNLENBQUMySCxhQUFhLENBQUM7SUFFckRDLFVBQVUsQ0FBQ3JOLE9BQU8sQ0FBQ3dOLEtBQUssSUFBSTtNQUN4QixNQUFNOUgsUUFBUSxHQUFHRCxNQUFNLENBQUMrSCxLQUFLLENBQUMvSSxFQUFFLENBQUM7TUFDakMsTUFBTWdKLFlBQVksR0FBRyxJQUFJLENBQUM5SCxLQUFLLENBQUMrSCxZQUFZLENBQUMsQ0FBQztNQUM5QyxJQUFJLENBQUNmLFVBQVUsQ0FBQ2dCLEdBQUcsQ0FBQ2pJLFFBQVEsRUFBRThILEtBQUssQ0FBQyxDQUFDLENBQUM7TUFDdEMsTUFBTUksU0FBUyxHQUFHN1AsUUFBUSxDQUFDTCxhQUFhLENBQUMsS0FBSyxDQUFDO01BRS9DLElBQUk4UCxLQUFLLENBQUNLLFlBQVksRUFBRTtRQUNwQjtNQUNKO01BRUEsTUFBTUMsS0FBSyxHQUFHTixLQUFLLENBQUNNLEtBQUssSUFBSSxPQUFPO01BRXBDRixTQUFTLENBQUN2SyxTQUFTLEdBQUcsaUJBQWlCeUssS0FBSyxFQUFFO01BQzlDRixTQUFTLENBQUNHLEtBQUssQ0FBQ0MsUUFBUSxHQUFHLFVBQVU7TUFDckNKLFNBQVMsQ0FBQ0csS0FBSyxDQUFDRSxNQUFNLEdBQUcsSUFBSTtNQUM3QkwsU0FBUyxDQUFDRyxLQUFLLENBQUNHLFVBQVUsR0FBRyxXQUFXO01BQ3hDLElBQUksQ0FBQ2xQLFNBQVMsQ0FBQ2lHLFdBQVcsQ0FBQzJJLFNBQVMsQ0FBQztNQUVyQyxNQUFNTyxFQUFFLEdBQUdYLEtBQUssQ0FBQ3BGLENBQUMsSUFBSSxDQUFDO01BQ3ZCLE1BQU1nRyxFQUFFLEdBQUdaLEtBQUssQ0FBQ25GLENBQUMsSUFBSSxDQUFDO01BRXZCLElBQUksQ0FBQzFDLEtBQUssQ0FBQzBJLFlBQVksQ0FBQ1osWUFBWSxFQUFFLFVBQVUsRUFBRTNGLGlFQUFpQixDQUFDcUcsRUFBRSxFQUFFQyxFQUFFLEVBQUV0QyxTQUFTLENBQUMsQ0FBQztNQUN2RixJQUFJLENBQUNuRyxLQUFLLENBQUMwSSxZQUFZLENBQUNaLFlBQVksRUFBRSxVQUFVLEVBQUVqRixpRUFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUN6RSxJQUFJLENBQUM3QyxLQUFLLENBQUMwSSxZQUFZLENBQUNaLFlBQVksRUFBRSxZQUFZLEVBQUUxRSxtRUFBbUIsQ0FBQzZFLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQ2hHLENBQUM7TUFFRCxNQUFNN0QsT0FBTyxHQUFHckUsUUFBUSxLQUFLNkgsdUJBQXVCO01BQ3BELE1BQU1lLFVBQVUsR0FBR3pFLCtEQUFlLENBQUNuRSxRQUFRLEVBQUVvSSxLQUFLLEVBQUUvRCxPQUFPLENBQUM7TUFDNUR1RSxVQUFVLENBQUNDLEtBQUssR0FBRyxDQUFDO01BQ3BCRCxVQUFVLENBQUNFLFFBQVEsR0FBRyxDQUFDO01BQ3ZCRixVQUFVLENBQUNHLFNBQVMsR0FBRyxDQUFDO01BQ3hCLElBQUksQ0FBQzlJLEtBQUssQ0FBQzBJLFlBQVksQ0FBQ1osWUFBWSxFQUFFLFFBQVEsRUFBRWEsVUFBVSxDQUFDO01BQzNELElBQUksQ0FBQy9JLGNBQWMsQ0FBQ29JLEdBQUcsQ0FBQ2pJLFFBQVEsRUFBRStILFlBQVksQ0FBQztNQUUvQyxJQUFJMUQsT0FBTyxFQUFFO1FBQ1QsSUFBSSxDQUFDMEMsaUJBQWlCLEdBQUdnQixZQUFZO1FBQ3JDLElBQUksQ0FBQzlILEtBQUssQ0FBQzBJLFlBQVksQ0FBQ1osWUFBWSxFQUFFLE9BQU8sRUFBRTVFLDhEQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQzZGLGNBQWMsQ0FBQ2pCLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUNrQixVQUFVLENBQUMsQ0FBQztNQUNyQjtJQUNKLENBQUMsQ0FBQztJQUVGLElBQUksSUFBSSxDQUFDbEMsaUJBQWlCLEtBQUssSUFBSSxFQUFFO01BQ2pDN0ssT0FBTyxDQUFDZ04sSUFBSSxDQUFDLHlDQUF5QyxFQUFFO1FBQ3BEeEIsYUFBYTtRQUNiOUksT0FBTyxFQUFFK0ksVUFBVSxDQUFDd0IsR0FBRyxDQUFDckssTUFBTSxJQUFJQSxNQUFNLENBQUNDLEVBQUU7TUFDL0MsQ0FBQyxDQUFDO0lBQ047SUFFQSxJQUFJLENBQUNxSyxlQUFlLENBQUMsQ0FBQztJQUV0QixJQUFJLENBQUMvQixPQUFPLEdBQUcsSUFBSTtJQUNuQixJQUFJLENBQUNILFFBQVEsR0FBR21DLFdBQVcsQ0FBQ0MsR0FBRyxDQUFDLENBQUM7SUFDakMsSUFBSSxDQUFDbEMsY0FBYyxHQUFHbUMscUJBQXFCLENBQUVELEdBQUcsSUFBSyxJQUFJLENBQUNFLFFBQVEsQ0FBQ0YsR0FBRyxDQUFDLENBQUM7RUFDNUU7RUFFQUwsVUFBVUEsQ0FBQSxFQUFHO0lBQ1QsTUFBTVEsS0FBSyxHQUFHLElBQUksQ0FBQ3hKLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQyxJQUFJLENBQUMzQyxpQkFBaUIsRUFBRSxPQUFPLENBQUM7SUFDdEUsSUFBSSxDQUFDMEMsS0FBSyxFQUFFO0lBRVosTUFBTUUsZUFBZSxHQUFJclIsR0FBRyxJQUFLO01BQzdCLElBQUlBLEdBQUcsS0FBSyxTQUFTLElBQUlBLEdBQUcsS0FBSyxHQUFHLElBQUlBLEdBQUcsS0FBSyxHQUFHLElBQUlBLEdBQUcsS0FBSyxHQUFHLEVBQUUsT0FBTyxJQUFJO01BQy9FLElBQUlBLEdBQUcsS0FBSyxXQUFXLElBQUlBLEdBQUcsS0FBSyxHQUFHLElBQUlBLEdBQUcsS0FBSyxHQUFHLEVBQUUsT0FBTyxNQUFNO01BQ3BFLElBQUlBLEdBQUcsS0FBSyxXQUFXLElBQUlBLEdBQUcsS0FBSyxHQUFHLElBQUlBLEdBQUcsS0FBSyxHQUFHLElBQUlBLEdBQUcsS0FBSyxHQUFHLEVBQUUsT0FBTyxNQUFNO01BQ25GLElBQUlBLEdBQUcsS0FBSyxZQUFZLElBQUlBLEdBQUcsS0FBSyxHQUFHLElBQUlBLEdBQUcsS0FBSyxHQUFHLEVBQUUsT0FBTyxPQUFPO01BQ3RFLE9BQU8sSUFBSTtJQUNmLENBQUM7SUFFRCxNQUFNc1IsYUFBYSxHQUFJckksQ0FBQyxJQUFLO01BQ3pCO01BQ0EsSUFBSSxDQUFDLElBQUksQ0FBQ2lHLFlBQVksRUFBRTtNQUV4QixNQUFNcUMsR0FBRyxHQUFHRixlQUFlLENBQUNwSSxDQUFDLENBQUNqSixHQUFHLENBQUM7TUFDbEMsSUFBSXVSLEdBQUcsSUFBSUosS0FBSyxFQUFFO1FBQ2RsSSxDQUFDLENBQUNDLGNBQWMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQ2lJLEtBQUssQ0FBQ3JHLFVBQVUsQ0FBQzBHLFFBQVEsQ0FBQ0QsR0FBRyxDQUFDLEVBQUU7VUFDakNKLEtBQUssQ0FBQ3JHLFVBQVUsQ0FBQy9CLE9BQU8sQ0FBQ3dJLEdBQUcsQ0FBQztRQUNqQztNQUNKO01BRUEsSUFBSXRJLENBQUMsQ0FBQ2pKLEdBQUcsS0FBSyxHQUFHLElBQUlpSixDQUFDLENBQUN3SSxJQUFJLEtBQUssT0FBTyxFQUFFO1FBQ3JDeEksQ0FBQyxDQUFDQyxjQUFjLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUN3SSxRQUFRLENBQUMsQ0FBQztNQUNuQjtJQUNKLENBQUM7SUFFRCxNQUFNQyxXQUFXLEdBQUkxSSxDQUFDLElBQUs7TUFDdkI7TUFDQSxJQUFJLENBQUMsSUFBSSxDQUFDaUcsWUFBWSxFQUFFO01BRXhCLE1BQU1xQyxHQUFHLEdBQUdGLGVBQWUsQ0FBQ3BJLENBQUMsQ0FBQ2pKLEdBQUcsQ0FBQztNQUNsQyxJQUFJdVIsR0FBRyxJQUFJSixLQUFLLEVBQUU7UUFDZEEsS0FBSyxDQUFDckcsVUFBVSxHQUFHcUcsS0FBSyxDQUFDckcsVUFBVSxDQUFDbkssTUFBTSxDQUFDaVIsQ0FBQyxJQUFJQSxDQUFDLEtBQUtMLEdBQUcsQ0FBQztNQUM5RDtJQUNKLENBQUM7SUFFRHhNLE1BQU0sQ0FBQzFFLGdCQUFnQixDQUFDLFNBQVMsRUFBRWlSLGFBQWEsQ0FBQztJQUNqRHZNLE1BQU0sQ0FBQzFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRXNSLFdBQVcsQ0FBQztJQUU3QyxJQUFJLENBQUM5QyxvQkFBb0IsR0FBRyxNQUFNO01BQzlCOUosTUFBTSxDQUFDb0MsbUJBQW1CLENBQUMsU0FBUyxFQUFFbUssYUFBYSxDQUFDO01BQ3BEdk0sTUFBTSxDQUFDb0MsbUJBQW1CLENBQUMsT0FBTyxFQUFFd0ssV0FBVyxDQUFDO0lBQ3BELENBQUM7RUFDTDtFQUVBRCxRQUFRQSxDQUFBLEVBQUc7SUFDUCxJQUFJLElBQUksQ0FBQ2pELGlCQUFpQixLQUFLLElBQUksRUFBRTtJQUVyQyxNQUFNb0QsR0FBRyxHQUFHLElBQUksQ0FBQ2xLLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQyxJQUFJLENBQUMzQyxpQkFBaUIsRUFBRSxVQUFVLENBQUM7SUFDdkUsTUFBTWpJLE1BQU0sR0FBRyxJQUFJLENBQUNtQixLQUFLLENBQUN5SixZQUFZLENBQUMsSUFBSSxDQUFDM0MsaUJBQWlCLEVBQUUsUUFBUSxDQUFDO0lBRXhFLE1BQU1xRCxZQUFZLEdBQUcsSUFBSSxDQUFDbkssS0FBSyxDQUFDb0ssS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQ3BSLE1BQU0sQ0FBQ3FSLE9BQU8sSUFBSTtNQUN4RSxPQUFPLElBQUksQ0FBQ3JLLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQ1ksT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDL0YsT0FBTyxLQUFLekYsTUFBTSxDQUFDQyxFQUFFO0lBQ3pFLENBQUMsQ0FBQztJQUVGLElBQUlxTCxZQUFZLENBQUN6UCxNQUFNLElBQUltRSxNQUFNLENBQUNnSyxRQUFRLEVBQUU7SUFFNUMsTUFBTXlCLE9BQU8sR0FBRyxJQUFJLENBQUNDLFVBQVUsQ0FBQzFMLE1BQU0sQ0FBQ0MsRUFBRSxFQUFFb0wsR0FBRyxDQUFDM0gsS0FBSyxFQUFFMkgsR0FBRyxDQUFDMUgsS0FBSyxFQUFFM0QsTUFBTSxDQUFDaUssU0FBUyxDQUFDO0lBQ2xGLElBQUksQ0FBQ3dCLE9BQU8sRUFBRTtJQUVkLElBQUksSUFBSSxDQUFDbkwsTUFBTSxJQUFJLElBQUksQ0FBQ0EsTUFBTSxDQUFDcUwsVUFBVSxLQUFLck4sU0FBUyxDQUFDc04sSUFBSSxFQUFFO01BQzFELElBQUksQ0FBQ3RMLE1BQU0sQ0FBQzBDLElBQUksQ0FBQy9ELElBQUksQ0FBQ2dFLFNBQVMsQ0FBQztRQUM1QjlKLElBQUksRUFBRSxXQUFXO1FBQ2pCcUksT0FBTyxFQUFFO1VBQUV2QixFQUFFLEVBQUVELE1BQU0sQ0FBQ0MsRUFBRTtVQUFFMkQsQ0FBQyxFQUFFeUgsR0FBRyxDQUFDM0gsS0FBSztVQUFFRyxDQUFDLEVBQUV3SCxHQUFHLENBQUMxSCxLQUFLO1VBQUVnQyxLQUFLLEVBQUUzRixNQUFNLENBQUNpSztRQUFVO01BQ2xGLENBQUMsQ0FBQyxDQUFDO0lBQ1A7RUFDSjtFQUVBeUIsVUFBVUEsQ0FBQ2pHLE9BQU8sRUFBRS9CLEtBQUssRUFBRUMsS0FBSyxFQUFFZ0MsS0FBSyxFQUFFO0lBQ3JDLE1BQU1rRyxNQUFNLEdBQUcsSUFBSSxDQUFDMUssS0FBSyxDQUFDb0ssS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQ08sSUFBSSxDQUFDaEwsTUFBTSxJQUFJO01BQy9ELE1BQU11SyxHQUFHLEdBQUcsSUFBSSxDQUFDbEssS0FBSyxDQUFDeUosWUFBWSxDQUFDOUosTUFBTSxFQUFFLFVBQVUsQ0FBQztNQUN2RCxNQUFNaUwsSUFBSSxHQUFHLElBQUksQ0FBQzVLLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQzlKLE1BQU0sRUFBRSxNQUFNLENBQUM7TUFDcEQsT0FBT2lMLElBQUksQ0FBQ3RHLE9BQU8sS0FBS0EsT0FBTyxJQUFJNEYsR0FBRyxDQUFDM0gsS0FBSyxLQUFLQSxLQUFLLElBQUkySCxHQUFHLENBQUMxSCxLQUFLLEtBQUtBLEtBQUs7SUFDakYsQ0FBQyxDQUFDO0lBRUYsSUFBSWtJLE1BQU0sRUFBRSxPQUFPLEtBQUs7SUFFeEIsTUFBTUcsVUFBVSxHQUFHLElBQUksQ0FBQzdLLEtBQUssQ0FBQytILFlBQVksQ0FBQyxDQUFDO0lBQzVDLE1BQU0rQyxPQUFPLEdBQUcxUyxRQUFRLENBQUNMLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDN0MrUyxPQUFPLENBQUNwTixTQUFTLEdBQUcsTUFBTTtJQUMxQm9OLE9BQU8sQ0FBQzFDLEtBQUssQ0FBQ0MsUUFBUSxHQUFHLFVBQVU7SUFDbkN5QyxPQUFPLENBQUMxQyxLQUFLLENBQUM3QixJQUFJLEdBQUcsR0FBR2hFLEtBQUssR0FBRzRELFNBQVMsSUFBSTtJQUM3QzJFLE9BQU8sQ0FBQzFDLEtBQUssQ0FBQzJDLEdBQUcsR0FBRyxHQUFHdkksS0FBSyxHQUFHMkQsU0FBUyxJQUFJO0lBQzVDMkUsT0FBTyxDQUFDMUMsS0FBSyxDQUFDRSxNQUFNLEdBQUcsR0FBRztJQUMxQixJQUFJLENBQUNqUCxTQUFTLENBQUNpRyxXQUFXLENBQUN3TCxPQUFPLENBQUM7SUFFbkMsSUFBSSxDQUFDOUssS0FBSyxDQUFDMEksWUFBWSxDQUFDbUMsVUFBVSxFQUFFLFVBQVUsRUFBRTtNQUFFdEksS0FBSztNQUFFQztJQUFNLENBQUMsQ0FBQztJQUVqRSxNQUFNd0ksUUFBUSxHQUFHM0csNkRBQWEsQ0FBQ0MsT0FBTyxFQUFFLElBQUksRUFBRUUsS0FBSyxDQUFDO0lBQ3BEd0csUUFBUSxDQUFDM0gsRUFBRSxHQUFHeUgsT0FBTztJQUNyQixJQUFJLENBQUM5SyxLQUFLLENBQUMwSSxZQUFZLENBQUNtQyxVQUFVLEVBQUUsTUFBTSxFQUFFRyxRQUFRLENBQUM7SUFDckQsT0FBTyxJQUFJO0VBQ2Y7RUFFQTVLLGdCQUFnQkEsQ0FBQ0MsT0FBTyxFQUFFO0lBQ3RCLElBQUksQ0FBQ0EsT0FBTyxJQUFJLENBQUNBLE9BQU8sQ0FBQ3ZCLEVBQUUsRUFBRTtNQUN6QjdDLE9BQU8sQ0FBQ2dOLElBQUksQ0FBQyxxQ0FBcUMsRUFBRTVJLE9BQU8sQ0FBQztNQUM1RDtJQUNKO0lBRUEsSUFBSVYsTUFBTSxHQUFHLElBQUksQ0FBQ0MsY0FBYyxDQUFDQyxHQUFHLENBQUNDLE1BQU0sQ0FBQ08sT0FBTyxDQUFDdkIsRUFBRSxDQUFDLENBQUM7SUFDeEQsSUFBSWEsTUFBTSxLQUFLekcsU0FBUyxFQUFFO01BQ3RCK0MsT0FBTyxDQUFDZ04sSUFBSSxDQUFDLGtEQUFrRDVJLE9BQU8sQ0FBQ3ZCLEVBQUUsc0JBQXNCLEVBQUVtTSxLQUFLLENBQUNDLElBQUksQ0FBQyxJQUFJLENBQUN0TCxjQUFjLENBQUN1TCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDeEk7SUFDSjtJQUVBLElBQUl4TCxNQUFNLEtBQUssSUFBSSxDQUFDbUgsaUJBQWlCLEVBQUU7TUFDbkM3SyxPQUFPLENBQUNDLEdBQUcsQ0FBQyx1REFBdURtRSxPQUFPLENBQUN2QixFQUFFLEVBQUUsQ0FBQztNQUNoRjtJQUNKO0lBRUEsTUFBTW9MLEdBQUcsR0FBRyxJQUFJLENBQUNsSyxLQUFLLENBQUN5SixZQUFZLENBQUM5SixNQUFNLEVBQUUsVUFBVSxDQUFDO0lBQ3ZELE1BQU15TCxHQUFHLEdBQUcsSUFBSSxDQUFDcEwsS0FBSyxDQUFDeUosWUFBWSxDQUFDOUosTUFBTSxFQUFFLFVBQVUsQ0FBQztJQUN2RCxNQUFNMEwsVUFBVSxHQUFHLElBQUksQ0FBQ3JMLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQzlKLE1BQU0sRUFBRSxZQUFZLENBQUM7SUFFaEUsSUFBSSxDQUFDdUssR0FBRyxJQUFJLENBQUNrQixHQUFHLElBQUksQ0FBQ0MsVUFBVSxFQUFFO01BQzdCcFAsT0FBTyxDQUFDZ04sSUFBSSxDQUFDLG9EQUFvRDVJLE9BQU8sQ0FBQ3ZCLEVBQUUsR0FBRyxFQUFFO1FBQUVvTCxHQUFHLEVBQUUsQ0FBQyxDQUFDQSxHQUFHO1FBQUVrQixHQUFHLEVBQUUsQ0FBQyxDQUFDQSxHQUFHO1FBQUVDLFVBQVUsRUFBRSxDQUFDLENBQUNBO01BQVcsQ0FBQyxDQUFDO01BQ3JJO0lBQ0o7SUFFQXBQLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLHNDQUFzQ21FLE9BQU8sQ0FBQ3ZCLEVBQUUsUUFBUXVCLE9BQU8sQ0FBQ2tDLEtBQUssS0FBS2xDLE9BQU8sQ0FBQ21DLEtBQUssR0FBRyxDQUFDO0lBQ3ZHNEksR0FBRyxDQUFDbkksU0FBUyxHQUFHNUMsT0FBTyxDQUFDNEMsU0FBUyxJQUFJbUksR0FBRyxDQUFDbkksU0FBUztJQUNsRG1JLEdBQUcsQ0FBQ3BJLFFBQVEsR0FBRzNDLE9BQU8sQ0FBQzJDLFFBQVE7SUFDL0JrSCxHQUFHLENBQUMzSCxLQUFLLEdBQUdsQyxPQUFPLENBQUNrQyxLQUFLO0lBQ3pCMkgsR0FBRyxDQUFDMUgsS0FBSyxHQUFHbkMsT0FBTyxDQUFDbUMsS0FBSztJQUN6QjBILEdBQUcsQ0FBQ3ZILE9BQU8sR0FBR3RDLE9BQU8sQ0FBQ29DLENBQUM7SUFDdkJ5SCxHQUFHLENBQUN0SCxPQUFPLEdBQUd2QyxPQUFPLENBQUNxQyxDQUFDO0lBQ3ZCMkksVUFBVSxDQUFDckgsS0FBSyxHQUFHM0QsT0FBTyxDQUFDMkQsS0FBSyxLQUFLM0QsT0FBTyxDQUFDMkMsUUFBUSxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUM7RUFDM0U7RUFFQTFDLGdCQUFnQkEsQ0FBQ0QsT0FBTyxFQUFFO0lBQ3RCLElBQUksQ0FBQ0EsT0FBTyxJQUFJLENBQUNBLE9BQU8sQ0FBQ3ZCLEVBQUUsRUFBRTtJQUM3QixJQUFJLENBQUN5TCxVQUFVLENBQUNsSyxPQUFPLENBQUN2QixFQUFFLEVBQUV1QixPQUFPLENBQUNvQyxDQUFDLEVBQUVwQyxPQUFPLENBQUNxQyxDQUFDLEVBQUVyQyxPQUFPLENBQUNtRSxLQUFLLElBQUksQ0FBQyxDQUFDO0VBQ3pFO0VBRUFqRSx5QkFBeUJBLENBQUNGLE9BQU8sRUFBRTtJQUMvQixJQUFJLENBQUNBLE9BQU8sSUFBSUEsT0FBTyxDQUFDb0MsQ0FBQyxLQUFLdkosU0FBUyxJQUFJbUgsT0FBTyxDQUFDcUMsQ0FBQyxLQUFLeEosU0FBUyxFQUFFO0lBRXBFLElBQUksQ0FBQ29TLGVBQWUsQ0FBQ2pMLE9BQU8sQ0FBQ29DLENBQUMsRUFBRXBDLE9BQU8sQ0FBQ3FDLENBQUMsQ0FBQztJQUUxQyxNQUFNL0MsTUFBTSxHQUFHLElBQUksQ0FBQ0MsY0FBYyxDQUFDQyxHQUFHLENBQUNDLE1BQU0sQ0FBQ08sT0FBTyxDQUFDdkIsRUFBRSxDQUFDLENBQUM7SUFDMUQsSUFBSWEsTUFBTSxLQUFLekcsU0FBUyxJQUFJeUcsTUFBTSxLQUFLLElBQUksQ0FBQ21ILGlCQUFpQixFQUFFO0lBRS9ELElBQUksQ0FBQ3lFLFlBQVksQ0FBQzVMLE1BQU0sRUFBRVUsT0FBTyxDQUFDckksSUFBSSxDQUFDO0VBQzNDOztFQUVBO0FBQ0o7QUFDQTtBQUNBO0VBQ0l3SSxzQkFBc0JBLENBQUNILE9BQU8sRUFBRTtJQUM1QixJQUFJLENBQUNBLE9BQU8sSUFBSSxDQUFDQSxPQUFPLENBQUNOLFFBQVEsSUFBSU0sT0FBTyxDQUFDbUwsUUFBUSxLQUFLdFMsU0FBUyxFQUFFOztJQUVyRTtJQUNBLElBQUltSCxPQUFPLENBQUNvQyxDQUFDLEtBQUt2SixTQUFTLElBQUltSCxPQUFPLENBQUNxQyxDQUFDLEtBQUt4SixTQUFTLEVBQUU7TUFDcEQsSUFBSSxDQUFDb1MsZUFBZSxDQUFDakwsT0FBTyxDQUFDb0MsQ0FBQyxFQUFFcEMsT0FBTyxDQUFDcUMsQ0FBQyxDQUFDO0lBQzlDOztJQUVBO0lBQ0EsTUFBTS9DLE1BQU0sR0FBRyxJQUFJLENBQUNDLGNBQWMsQ0FBQ0MsR0FBRyxDQUFDQyxNQUFNLENBQUNPLE9BQU8sQ0FBQ04sUUFBUSxDQUFDLENBQUM7SUFDaEUsSUFBSUosTUFBTSxLQUFLekcsU0FBUyxFQUFFO0lBRTFCLE1BQU0yRixNQUFNLEdBQUcsSUFBSSxDQUFDbUIsS0FBSyxDQUFDeUosWUFBWSxDQUFDOUosTUFBTSxFQUFFLFFBQVEsQ0FBQztJQUN4RCxJQUFJLENBQUNkLE1BQU0sRUFBRTs7SUFFYjtJQUNBQSxNQUFNLENBQUMrSixLQUFLLEdBQUd2SSxPQUFPLENBQUNtTCxRQUFROztJQUUvQjtJQUNBLElBQUk3TCxNQUFNLEtBQUssSUFBSSxDQUFDbUgsaUJBQWlCLEVBQUU7TUFDbkMsSUFBSSxDQUFDaUMsY0FBYyxDQUFDcEosTUFBTSxDQUFDO0lBQy9CO0lBRUExRCxPQUFPLENBQUNDLEdBQUcsQ0FBQywrQkFBK0JtRSxPQUFPLENBQUNOLFFBQVEsZ0NBQWdDTSxPQUFPLENBQUNtTCxRQUFRLEVBQUUsQ0FBQztFQUNsSDtFQUVBRixlQUFlQSxDQUFDL0ksS0FBSyxFQUFFQyxLQUFLLEVBQUU7SUFDMUIsSUFBSSxDQUFDNkUsZUFBZSxDQUFDcE4sR0FBRyxDQUFDLEdBQUdzSSxLQUFLLElBQUlDLEtBQUssRUFBRSxDQUFDO0lBQzdDLE1BQU1pSixRQUFRLEdBQUcsSUFBSSxDQUFDekwsS0FBSyxDQUFDb0ssS0FBSyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUM7SUFFeEQsS0FBSyxNQUFNekssTUFBTSxJQUFJOEwsUUFBUSxFQUFFO01BQzNCLE1BQU12QixHQUFHLEdBQUcsSUFBSSxDQUFDbEssS0FBSyxDQUFDeUosWUFBWSxDQUFDOUosTUFBTSxFQUFFLFVBQVUsQ0FBQztNQUN2RCxNQUFNK0wsT0FBTyxHQUFHLElBQUksQ0FBQzFMLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQzlKLE1BQU0sRUFBRSxTQUFTLENBQUM7TUFDMUQsSUFBSSxDQUFDdUssR0FBRyxJQUFJLENBQUN3QixPQUFPLEVBQUU7TUFFdEIsSUFBSXhCLEdBQUcsQ0FBQzNILEtBQUssS0FBS0EsS0FBSyxJQUFJMkgsR0FBRyxDQUFDMUgsS0FBSyxLQUFLQSxLQUFLLEVBQUU7UUFDNUNrSixPQUFPLENBQUM3RyxRQUFRLEdBQUcsSUFBSTtRQUV2QixJQUFJNkcsT0FBTyxDQUFDckksRUFBRSxJQUFJcUksT0FBTyxDQUFDckksRUFBRSxDQUFDc0ksVUFBVSxFQUFFO1VBQ3JDRCxPQUFPLENBQUNySSxFQUFFLENBQUNzSSxVQUFVLENBQUN6SyxXQUFXLENBQUN3SyxPQUFPLENBQUNySSxFQUFFLENBQUM7UUFDakQ7UUFFQSxJQUFJLENBQUNyRCxLQUFLLENBQUNDLGFBQWEsQ0FBQ04sTUFBTSxDQUFDO1FBQ2hDO01BQ0o7SUFDSjtFQUNKO0VBRUE0TCxZQUFZQSxDQUFDNUwsTUFBTSxFQUFFM0gsSUFBSSxFQUFFO0lBQ3ZCLE1BQU02RyxNQUFNLEdBQUcsSUFBSSxDQUFDbUIsS0FBSyxDQUFDeUosWUFBWSxDQUFDOUosTUFBTSxFQUFFLFFBQVEsQ0FBQztJQUN4RCxNQUFNaU0sUUFBUSxHQUFHLElBQUksQ0FBQzVMLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQzlKLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDNUQsSUFBSSxDQUFDZCxNQUFNLElBQUksQ0FBQytNLFFBQVEsRUFBRTtJQUUxQixJQUFJNVQsSUFBSSxLQUFLLE9BQU8sRUFBRTtNQUNsQjRULFFBQVEsQ0FBQzdJLEtBQUssR0FBRzhJLElBQUksQ0FBQ0MsR0FBRyxDQUFDRixRQUFRLENBQUM3SSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwRCxDQUFDLE1BQU0sSUFBSS9LLElBQUksS0FBSyxPQUFPLEVBQUU7TUFDekI2RyxNQUFNLENBQUNnSyxRQUFRLEdBQUdoSyxNQUFNLENBQUNnSyxRQUFRLEdBQUdoSyxNQUFNLENBQUNnSyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDL0QsQ0FBQyxNQUFNLElBQUk3USxJQUFJLEtBQUssT0FBTyxFQUFFO01BQ3pCNkcsTUFBTSxDQUFDaUssU0FBUyxHQUFHakssTUFBTSxDQUFDaUssU0FBUyxHQUFHakssTUFBTSxDQUFDaUssU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2xFLENBQUMsTUFBTSxJQUFJOVEsSUFBSSxLQUFLLE9BQU8sRUFBRTtNQUN6QjtNQUNBNkcsTUFBTSxDQUFDK0osS0FBSyxHQUFHaUQsSUFBSSxDQUFDQyxHQUFHLENBQUMsQ0FBQ2pOLE1BQU0sQ0FBQytKLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2RDtFQUNKO0VBRUFPLGVBQWVBLENBQUEsRUFBRztJQUNkLE1BQU00QyxhQUFhLEdBQUdBLENBQUN0SixDQUFDLEVBQUVDLENBQUMsRUFBRXZJLFFBQVEsS0FBSztNQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDME0sT0FBTyxDQUFDbkUsQ0FBQyxDQUFDLEVBQUU7TUFFdEIsSUFBSSxDQUFDbUUsT0FBTyxDQUFDbkUsQ0FBQyxDQUFDLENBQUNELENBQUMsQ0FBQyxHQUFHdEksUUFBUTtNQUU3QixNQUFNNlIsSUFBSSxHQUFHLElBQUksQ0FBQzNTLFNBQVMsQ0FBQzRFLGFBQWEsQ0FBQyxZQUFZd0UsQ0FBQyxjQUFjQyxDQUFDLElBQUksQ0FBQztNQUMzRSxJQUFJLENBQUNzSixJQUFJLEVBQUU7TUFFWEEsSUFBSSxDQUFDdE8sU0FBUyxHQUFHLGlCQUFpQjtNQUNsQ3NPLElBQUksQ0FBQzVELEtBQUssQ0FBQzZELGVBQWUsR0FBRyx3Q0FBd0M7SUFDekUsQ0FBQztJQUVELE1BQU1DLGtCQUFrQixHQUFHQSxDQUFDekosQ0FBQyxFQUFFQyxDQUFDLEtBQUs7TUFDakMsSUFBSSxJQUFJLENBQUMyRSxlQUFlLENBQUM4RSxHQUFHLENBQUMsR0FBRzFKLENBQUMsSUFBSUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUMzQ29ELHVFQUFZLENBQUMsSUFBSSxDQUFDOUYsS0FBSyxFQUFFeUMsQ0FBQyxFQUFFQyxDQUFDLEVBQUUsSUFBSSxDQUFDckosU0FBUyxFQUFFOE0sU0FBUyxDQUFDO0lBQzdELENBQUM7SUFFRCxNQUFNaUcsWUFBWSxHQUFHQSxDQUFDek0sTUFBTSxFQUFFYixFQUFFLEVBQUV1TixjQUFjLEtBQUs7TUFDakQ7TUFDQTtNQUNBO01BQ0E7TUFDQSxJQUFJQSxjQUFjLElBQUksQ0FBQyxJQUFJMU0sTUFBTSxLQUFLLElBQUksQ0FBQ21ILGlCQUFpQixJQUFJLElBQUksQ0FBQzNILE1BQU0sSUFBSSxJQUFJLENBQUNBLE1BQU0sQ0FBQ3FMLFVBQVUsS0FBS3JOLFNBQVMsQ0FBQ3NOLElBQUksRUFBRTtRQUN0SCxJQUFJLENBQUN0TCxNQUFNLENBQUMwQyxJQUFJLENBQUMvRCxJQUFJLENBQUNnRSxTQUFTLENBQUM7VUFDNUI5SixJQUFJLEVBQUU7UUFDVixDQUFDLENBQUMsQ0FBQztNQUNQO01BQ0E7TUFDQSxJQUFJMkgsTUFBTSxLQUFLLElBQUksQ0FBQ21ILGlCQUFpQixFQUFFO1FBQ25DZCxxREFBUSxDQUFDcUcsY0FBYyxDQUFDO01BQzVCO0lBQ0osQ0FBQztJQUVELE1BQU1DLGVBQWUsR0FBR0EsQ0FBQ3hOLEVBQUUsRUFBRTlHLElBQUksRUFBRXlLLENBQUMsRUFBRUMsQ0FBQyxLQUFLO01BQ3hDLElBQUksQ0FBQzJFLGVBQWUsQ0FBQ3BOLEdBQUcsQ0FBQyxHQUFHd0ksQ0FBQyxJQUFJQyxDQUFDLEVBQUUsQ0FBQztNQUVyQyxJQUFJLElBQUksQ0FBQ29FLGlCQUFpQixLQUFLLElBQUksRUFBRTtNQUVyQyxNQUFNbkgsTUFBTSxHQUFHLElBQUksQ0FBQ0MsY0FBYyxDQUFDQyxHQUFHLENBQUNDLE1BQU0sQ0FBQ2hCLEVBQUUsQ0FBQyxDQUFDO01BQ2xELE1BQU02SixVQUFVLEdBQUdoSixNQUFNLEdBQUcsSUFBSSxDQUFDSyxLQUFLLENBQUN5SixZQUFZLENBQUM5SixNQUFNLEVBQUUsUUFBUSxDQUFDLEdBQUcsSUFBSTtNQUU1RSxJQUFJM0gsSUFBSSxLQUFLLE9BQU8sRUFBRTtRQUNsQixJQUFJMlEsVUFBVSxJQUFJaEosTUFBTSxLQUFLLElBQUksQ0FBQ21ILGlCQUFpQixFQUFFO1VBQ2pEZCxxREFBUSxDQUFDMkMsVUFBVSxDQUFDQyxLQUFLLENBQUM7UUFDOUI7TUFDSixDQUFDLE1BQU07UUFDSCxJQUFJRCxVQUFVLElBQUloSixNQUFNLEtBQUssSUFBSSxDQUFDbUgsaUJBQWlCLEVBQUU7VUFDakQsSUFBSSxDQUFDaUMsY0FBYyxDQUFDLElBQUksQ0FBQ2pDLGlCQUFpQixDQUFDO1FBQy9DO01BQ0o7TUFFQSxJQUFJLElBQUksQ0FBQzNILE1BQU0sSUFBSSxJQUFJLENBQUNBLE1BQU0sQ0FBQ3FMLFVBQVUsS0FBS3JOLFNBQVMsQ0FBQ3NOLElBQUksRUFBRTtRQUMxRCxJQUFJLENBQUN0TCxNQUFNLENBQUMwQyxJQUFJLENBQUMvRCxJQUFJLENBQUNnRSxTQUFTLENBQUM7VUFDNUI5SixJQUFJLEVBQUVBLElBQUksS0FBSyxPQUFPLEdBQUcsYUFBYSxHQUFHLGdCQUFnQjtVQUN6RHFJLE9BQU8sRUFBRXJJLElBQUksS0FBSyxPQUFPLEdBQ25CO1lBQUUrSCxRQUFRLEVBQUVqQixFQUFFO1lBQUUwTSxRQUFRLEVBQUU3QyxVQUFVLEdBQUdBLFVBQVUsQ0FBQ0MsS0FBSyxHQUFHLENBQUM7WUFBRW5HLENBQUM7WUFBRUM7VUFBRSxDQUFDLEdBQ25FO1lBQUU1RCxFQUFFO1lBQUU5RyxJQUFJO1lBQUV5SyxDQUFDO1lBQUVDO1VBQUU7UUFDM0IsQ0FBQyxDQUFDLENBQUM7TUFDUDtJQUNKLENBQUM7SUFFRCxJQUFJLENBQUMxQyxLQUFLLENBQUN1TSxpQkFBaUIsR0FBRyxDQUFDNU0sTUFBTSxFQUFFOEMsQ0FBQyxFQUFFQyxDQUFDLEVBQUVILEtBQUssRUFBRUMsS0FBSyxFQUFFUyxTQUFTLEVBQUVELFFBQVEsS0FBSztNQUNoRixNQUFNbkUsTUFBTSxHQUFHLElBQUksQ0FBQ21CLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQzlKLE1BQU0sRUFBRSxRQUFRLENBQUM7TUFDeEQsSUFBSSxDQUFDZCxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUNNLE1BQU0sSUFBSSxJQUFJLENBQUNBLE1BQU0sQ0FBQ3FMLFVBQVUsS0FBS3JOLFNBQVMsQ0FBQ3NOLElBQUksRUFBRTtNQUUxRSxJQUFJLENBQUN0TCxNQUFNLENBQUMwQyxJQUFJLENBQUMvRCxJQUFJLENBQUNnRSxTQUFTLENBQUM7UUFDNUI5SixJQUFJLEVBQUUsWUFBWTtRQUNsQnFJLE9BQU8sRUFBRTtVQUNMdkIsRUFBRSxFQUFFRCxNQUFNLENBQUNDLEVBQUU7VUFDYjJELENBQUM7VUFDREMsQ0FBQztVQUNESCxLQUFLO1VBQ0xDLEtBQUs7VUFDTFMsU0FBUztVQUNURCxRQUFRO1VBQ1JnQixLQUFLLEVBQUVoQixRQUFRLEdBQUcsS0FBSyxHQUFHO1FBQzlCO01BQ0osQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsSUFBSSxDQUFDaEQsS0FBSyxDQUFDd00sU0FBUyxDQUFDLENBQUNDLENBQUMsRUFBRUMsRUFBRSxFQUFFckQsR0FBRyxLQUFLOUQsMEVBQWMsQ0FBQ2tILENBQUMsRUFBRUMsRUFBRSxFQUFFckQsR0FBRyxFQUFFLElBQUksQ0FBQ3hDLE9BQU8sRUFBRVYsU0FBUyxDQUFDLENBQUM7SUFDekYsSUFBSSxDQUFDbkcsS0FBSyxDQUFDd00sU0FBUyxDQUFDLENBQUNDLENBQUMsRUFBRUMsRUFBRSxFQUFFckQsR0FBRyxLQUFLNUQsa0VBQVUsQ0FBQ2dILENBQUMsRUFBRUMsRUFBRSxFQUFFckQsR0FBRyxFQUFFLElBQUksQ0FBQ3hDLE9BQU8sRUFBRWtGLGFBQWEsRUFBRUcsa0JBQWtCLEVBQUUvRixTQUFTLENBQUMsQ0FBQztJQUN4SCxJQUFJLENBQUNuRyxLQUFLLENBQUN3TSxTQUFTLENBQUMsQ0FBQ0MsQ0FBQyxFQUFFQyxFQUFFLEVBQUVyRCxHQUFHLEtBQUszRCxzRUFBWSxDQUFDLElBQUksQ0FBQzFGLEtBQUssRUFBRXFKLEdBQUcsRUFBRStDLFlBQVksRUFBRSxJQUFJLENBQUN0RixpQkFBaUIsRUFBRVgsU0FBUyxFQUFFLElBQUksQ0FBQ2hILE1BQU0sQ0FBQyxDQUFDO0lBQ2pJLElBQUksQ0FBQ2EsS0FBSyxDQUFDd00sU0FBUyxDQUFDLENBQUNDLENBQUMsRUFBRUMsRUFBRSxFQUFFckQsR0FBRyxLQUFLeEQsd0VBQWEsQ0FBQzRHLENBQUMsRUFBRUgsZUFBZSxDQUFDLENBQUM7SUFDdkUsSUFBSSxDQUFDdE0sS0FBSyxDQUFDd00sU0FBUyxDQUFDLENBQUNDLENBQUMsRUFBRUMsRUFBRSxFQUFFckQsR0FBRyxLQUFLN0Qsc0VBQVksQ0FBQ2lILENBQUMsRUFBRUMsRUFBRSxFQUFFckQsR0FBRyxFQUFFakQsY0FBYyxDQUFDLENBQUM7RUFDbEY7RUFFQW1ELFFBQVFBLENBQUNGLEdBQUcsRUFBRTtJQUNWLElBQUksQ0FBQyxJQUFJLENBQUNqQyxPQUFPLEVBQUU7SUFFbkIsTUFBTXNGLEVBQUUsR0FBR3JELEdBQUcsR0FBRyxJQUFJLENBQUNwQyxRQUFRO0lBQzlCLElBQUksQ0FBQ0EsUUFBUSxHQUFHb0MsR0FBRztJQUNuQixJQUFJLENBQUNySixLQUFLLENBQUMyTSxNQUFNLENBQUNELEVBQUUsRUFBRXJELEdBQUcsQ0FBQztJQUUxQixJQUFJLENBQUNsQyxjQUFjLEdBQUdtQyxxQkFBcUIsQ0FBRXNELE9BQU8sSUFBSyxJQUFJLENBQUNyRCxRQUFRLENBQUNxRCxPQUFPLENBQUMsQ0FBQztFQUNwRjtFQUVBQyxjQUFjQSxDQUFDbk4sVUFBVSxFQUFFO0lBQ3ZCLElBQUksSUFBSSxDQUFDOEgsU0FBUyxFQUFFLE9BQU8sQ0FBQztJQUM1QixJQUFJLENBQUNBLFNBQVMsR0FBRyxJQUFJO0lBQ3JCLElBQUksQ0FBQ2xKLE9BQU8sQ0FBQyxDQUFDO0lBRWQsTUFBTXRCLElBQUksR0FBRzVFLFFBQVEsQ0FBQzZFLGNBQWMsQ0FBQyxNQUFNLENBQUM7SUFDNUM3RSxRQUFRLENBQUNxRixJQUFJLENBQUNDLFNBQVMsR0FBRyxXQUFXO0lBQ3JDdkUsOERBQU0sQ0FBQ3BCLGFBQUEsQ0FBQ3dFLDBEQUFPO01BQUNtRCxVQUFVLEVBQUVBO0lBQVcsQ0FBRSxDQUFDLEVBQUUxQyxJQUFJLENBQUM7RUFDckQ7O0VBRUE7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7RUFFSXNCLE9BQU9BLENBQUEsRUFBRztJQUNOLElBQUksQ0FBQzhJLE9BQU8sR0FBRyxLQUFLO0lBRXBCLElBQUksSUFBSSxDQUFDRCxjQUFjLEVBQUU7TUFDckIyRixvQkFBb0IsQ0FBQyxJQUFJLENBQUMzRixjQUFjLENBQUM7SUFDN0M7SUFFQSxJQUFJLElBQUksQ0FBQ0Qsb0JBQW9CLEVBQUU7TUFDM0IsSUFBSSxDQUFDQSxvQkFBb0IsQ0FBQyxDQUFDO0lBQy9CO0VBQ0o7RUFFQTZCLGNBQWNBLENBQUNwSixNQUFNLEVBQUU7SUFDbkIsTUFBTWQsTUFBTSxHQUFHLElBQUksQ0FBQ21CLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQzlKLE1BQU0sRUFBRSxRQUFRLENBQUM7SUFDeEQsTUFBTWlNLFFBQVEsR0FBRyxJQUFJLENBQUM1TCxLQUFLLENBQUN5SixZQUFZLENBQUM5SixNQUFNLEVBQUUsVUFBVSxDQUFDO0lBQzVELElBQUksQ0FBQ2QsTUFBTSxJQUFJLENBQUMrTSxRQUFRLEVBQUU7SUFFMUI3RixxREFBUSxDQUFDbEgsTUFBTSxDQUFDZ0ssUUFBUSxJQUFJLENBQUMsQ0FBQztJQUM5QjdDLHFEQUFRLENBQUNuSCxNQUFNLENBQUMrSixLQUFLLElBQUksQ0FBQyxDQUFDO0lBQzNCM0MscURBQVEsQ0FBQ3BILE1BQU0sQ0FBQ2lLLFNBQVMsSUFBSSxDQUFDLENBQUM7SUFDL0I1QyxxREFBUSxDQUFDMkYsSUFBSSxDQUFDa0IsS0FBSyxDQUFDbkIsUUFBUSxDQUFDN0ksS0FBSyxDQUFDLENBQUM7RUFDeEM7QUFDSjtBQUVBLElBQUlpSyxzQkFBc0IsR0FBRyxFQUFFO0FBRXhCLFNBQVN0USxhQUFhQSxDQUFDc0YsSUFBSSxFQUFFO0VBQ2hDZ0wsc0JBQXNCLEdBQUdoTCxJQUFJO0VBQzdCaUwsWUFBWSxDQUFDQyxPQUFPLENBQUMsdUJBQXVCLEVBQUVsTCxJQUFJLENBQUM7RUFDbkQvRixPQUFPLENBQUNDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRThGLElBQUksQ0FBQztBQUN2RDtBQUVPLFNBQVNtTCxhQUFhQSxDQUFBLEVBQUc7RUFDNUIsT0FBT0gsc0JBQXNCLElBQUlDLFlBQVksQ0FBQ0csT0FBTyxDQUFDLHVCQUF1QixDQUFDLElBQUksUUFBUTtBQUM5RixDOzs7Ozs7Ozs7Ozs7OztBQzFkTyxTQUFTM0gsVUFBVUEsQ0FBQ3pGLEtBQUssRUFBRTBNLEVBQUUsRUFBRXJELEdBQUcsRUFBRXhDLE9BQU8sRUFBRWtGLGFBQWEsRUFBRUcsa0JBQWtCLEVBQUU1SixRQUFRLEdBQUcsRUFBRSxFQUFFO0VBQ2xHLE1BQU02QyxLQUFLLEdBQUduRixLQUFLLENBQUNvSyxLQUFLLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQztFQUU3QyxLQUFLLE1BQU1TLFVBQVUsSUFBSTFGLEtBQUssRUFBRTtJQUM1QixNQUFNK0UsR0FBRyxHQUFHbEssS0FBSyxDQUFDeUosWUFBWSxDQUFDb0IsVUFBVSxFQUFFLFVBQVUsQ0FBQztJQUN0RCxNQUFNRCxJQUFJLEdBQUc1SyxLQUFLLENBQUN5SixZQUFZLENBQUNvQixVQUFVLEVBQUUsTUFBTSxDQUFDO0lBRW5ERCxJQUFJLENBQUNyRyxLQUFLLElBQUltSSxFQUFFO0lBRWhCLElBQUk5QixJQUFJLENBQUNyRyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUNxRyxJQUFJLENBQUNuRyxRQUFRLEVBQUU7TUFDbkNtRyxJQUFJLENBQUNuRyxRQUFRLEdBQUcsSUFBSTtNQUVwQixNQUFNNEksYUFBYSxHQUFHQyx1QkFBdUIsQ0FBQ3BELEdBQUcsQ0FBQzNILEtBQUssRUFBRTJILEdBQUcsQ0FBQzFILEtBQUssRUFBRW9JLElBQUksQ0FBQ3BHLEtBQUssRUFBRXFDLE9BQU8sQ0FBQztNQUV4RndHLGFBQWEsQ0FBQ2hULE9BQU8sQ0FBQ2tULElBQUksSUFBSTtRQUMxQixNQUFNQyxTQUFTLEdBQUd4TixLQUFLLENBQUMrSCxZQUFZLENBQUMsQ0FBQztRQUN0QyxNQUFNMEYsTUFBTSxHQUFHclYsUUFBUSxDQUFDTCxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzVDMFYsTUFBTSxDQUFDL1AsU0FBUyxHQUFHLFdBQVc7UUFDOUIrUCxNQUFNLENBQUNyRixLQUFLLENBQUNDLFFBQVEsR0FBRyxVQUFVO1FBQ2xDb0YsTUFBTSxDQUFDckYsS0FBSyxDQUFDc0YsS0FBSyxHQUFHLEdBQUdwTCxRQUFRLElBQUk7UUFDcENtTCxNQUFNLENBQUNyRixLQUFLLENBQUN1RixNQUFNLEdBQUcsR0FBR3JMLFFBQVEsSUFBSTtRQUNyQ21MLE1BQU0sQ0FBQ3JGLEtBQUssQ0FBQzdCLElBQUksR0FBRyxHQUFHZ0gsSUFBSSxDQUFDOUssQ0FBQyxHQUFHSCxRQUFRLElBQUk7UUFDNUNtTCxNQUFNLENBQUNyRixLQUFLLENBQUMyQyxHQUFHLEdBQUcsR0FBR3dDLElBQUksQ0FBQzdLLENBQUMsR0FBR0osUUFBUSxJQUFJO1FBQzNDbUwsTUFBTSxDQUFDckYsS0FBSyxDQUFDRSxNQUFNLEdBQUcsR0FBRztRQUV6QnRJLEtBQUssQ0FBQzBJLFlBQVksQ0FBQzhFLFNBQVMsRUFBRSxVQUFVLEVBQUU7VUFDdENqTCxLQUFLLEVBQUVnTCxJQUFJLENBQUM5SyxDQUFDO1VBQ2JELEtBQUssRUFBRStLLElBQUksQ0FBQzdLLENBQUM7VUFDYkQsQ0FBQyxFQUFFOEssSUFBSSxDQUFDOUssQ0FBQyxHQUFHSCxRQUFRO1VBQ3BCSSxDQUFDLEVBQUU2SyxJQUFJLENBQUM3SyxDQUFDLEdBQUdKO1FBQ2hCLENBQUMsQ0FBQztRQUNGdEMsS0FBSyxDQUFDMEksWUFBWSxDQUFDOEUsU0FBUyxFQUFFLFdBQVcsRUFBRTtVQUFFN0ksUUFBUSxFQUFFLEdBQUc7VUFBRXRCLEVBQUUsRUFBRW9LO1FBQU8sQ0FBQyxDQUFDO1FBQ3pFN0MsSUFBSSxDQUFDdkgsRUFBRSxDQUFDc0ksVUFBVSxDQUFDck0sV0FBVyxDQUFDbU8sTUFBTSxDQUFDO1FBRXRDLElBQUk1RyxPQUFPLENBQUMwRyxJQUFJLENBQUM3SyxDQUFDLENBQUMsSUFBSW1FLE9BQU8sQ0FBQzBHLElBQUksQ0FBQzdLLENBQUMsQ0FBQyxDQUFDNkssSUFBSSxDQUFDOUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1VBQ2xEc0osYUFBYSxDQUFDd0IsSUFBSSxDQUFDOUssQ0FBQyxFQUFFOEssSUFBSSxDQUFDN0ssQ0FBQyxFQUFFLENBQUMsQ0FBQztVQUVoQyxJQUFJd0osa0JBQWtCLEVBQUU7WUFDcEJBLGtCQUFrQixDQUFDcUIsSUFBSSxDQUFDOUssQ0FBQyxFQUFFOEssSUFBSSxDQUFDN0ssQ0FBQyxDQUFDO1VBQ3RDO1FBQ0o7TUFDSixDQUFDLENBQUM7TUFFRixJQUFJa0ksSUFBSSxDQUFDdkgsRUFBRSxJQUFJdUgsSUFBSSxDQUFDdkgsRUFBRSxDQUFDc0ksVUFBVSxFQUFFO1FBQy9CZixJQUFJLENBQUN2SCxFQUFFLENBQUNzSSxVQUFVLENBQUN6SyxXQUFXLENBQUMwSixJQUFJLENBQUN2SCxFQUFFLENBQUM7TUFDM0M7TUFDQXJELEtBQUssQ0FBQ0MsYUFBYSxDQUFDNEssVUFBVSxDQUFDO0lBQ25DO0VBQ0o7RUFFQSxNQUFNK0MsVUFBVSxHQUFHNU4sS0FBSyxDQUFDb0ssS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUM7RUFDdkQsS0FBSyxNQUFNb0QsU0FBUyxJQUFJSSxVQUFVLEVBQUU7SUFDaEMsTUFBTUMsR0FBRyxHQUFHN04sS0FBSyxDQUFDeUosWUFBWSxDQUFDK0QsU0FBUyxFQUFFLFdBQVcsQ0FBQztJQUN0REssR0FBRyxDQUFDbEosUUFBUSxJQUFJK0gsRUFBRTtJQUVsQixJQUFJbUIsR0FBRyxDQUFDbEosUUFBUSxJQUFJLENBQUMsRUFBRTtNQUNuQixJQUFJa0osR0FBRyxDQUFDeEssRUFBRSxJQUFJd0ssR0FBRyxDQUFDeEssRUFBRSxDQUFDc0ksVUFBVSxFQUFFO1FBQzdCa0MsR0FBRyxDQUFDeEssRUFBRSxDQUFDc0ksVUFBVSxDQUFDekssV0FBVyxDQUFDMk0sR0FBRyxDQUFDeEssRUFBRSxDQUFDO01BQ3pDO01BQ0FyRCxLQUFLLENBQUNDLGFBQWEsQ0FBQ3VOLFNBQVMsQ0FBQztJQUNsQztFQUNKO0FBQ0o7QUFFQSxTQUFTRix1QkFBdUJBLENBQUNRLEVBQUUsRUFBRUMsRUFBRSxFQUFFdkosS0FBSyxFQUFFcUMsT0FBTyxFQUFFO0VBQ3JELE1BQU1tSCxLQUFLLEdBQUcsQ0FBQztJQUFFdkwsQ0FBQyxFQUFFcUwsRUFBRTtJQUFFcEwsQ0FBQyxFQUFFcUw7RUFBRyxDQUFDLENBQUM7RUFDaEMsTUFBTUUsVUFBVSxHQUFHLENBQ2Y7SUFBRXhMLENBQUMsRUFBRSxDQUFDO0lBQUVDLENBQUMsRUFBRSxDQUFDO0VBQUUsQ0FBQyxFQUNmO0lBQUVELENBQUMsRUFBRSxDQUFDO0lBQUVDLENBQUMsRUFBRTtFQUFFLENBQUMsRUFDZDtJQUFFRCxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQUVDLENBQUMsRUFBRTtFQUFFLENBQUMsRUFDZjtJQUFFRCxDQUFDLEVBQUUsQ0FBQztJQUFFQyxDQUFDLEVBQUU7RUFBRSxDQUFDLENBQ2pCO0VBRUQsTUFBTXdMLEtBQUssR0FBRzFKLEtBQUssR0FBRyxDQUFDO0VBRXZCeUosVUFBVSxDQUFDNVQsT0FBTyxDQUFDdVAsR0FBRyxJQUFJO0lBQ3RCLEtBQUssSUFBSXVFLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsSUFBSUQsS0FBSyxFQUFFQyxDQUFDLEVBQUUsRUFBRTtNQUM3QixNQUFNQyxFQUFFLEdBQUdOLEVBQUUsR0FBSWxFLEdBQUcsQ0FBQ25ILENBQUMsR0FBRzBMLENBQUU7TUFDM0IsTUFBTUUsRUFBRSxHQUFHTixFQUFFLEdBQUluRSxHQUFHLENBQUNsSCxDQUFDLEdBQUd5TCxDQUFFO01BRTNCLElBQUksQ0FBQ3RILE9BQU8sQ0FBQ3dILEVBQUUsQ0FBQyxJQUFJeEgsT0FBTyxDQUFDd0gsRUFBRSxDQUFDLENBQUNELEVBQUUsQ0FBQyxLQUFLbFYsU0FBUyxFQUFFO01BRW5ELE1BQU1vVixRQUFRLEdBQUd6SCxPQUFPLENBQUN3SCxFQUFFLENBQUMsQ0FBQ0QsRUFBRSxDQUFDO01BRWhDLElBQUlFLFFBQVEsS0FBSyxDQUFDLEVBQUU7UUFDaEI7TUFDSjtNQUVBTixLQUFLLENBQUN4VCxJQUFJLENBQUM7UUFBRWlJLENBQUMsRUFBRTJMLEVBQUU7UUFBRTFMLENBQUMsRUFBRTJMO01BQUcsQ0FBQyxDQUFDO01BRTVCLElBQUlDLFFBQVEsS0FBSyxDQUFDLEVBQUU7UUFDaEI7TUFDSjtJQUNKO0VBQ0osQ0FBQyxDQUFDO0VBRUYsT0FBT04sS0FBSztBQUNoQixDOzs7Ozs7Ozs7Ozs7Ozs7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBU3BJLGlCQUFpQkEsQ0FBQzVGLEtBQUssRUFBRXVDLEtBQUssRUFBRUMsS0FBSyxFQUFFbkosU0FBUyxFQUFFaUosUUFBUSxHQUFHLEVBQUUsRUFBRTtFQUM3RTtFQUNBLE1BQU1pTSxXQUFXLEdBQUd2TyxLQUFLLENBQUMrSCxZQUFZLENBQUMsQ0FBQzs7RUFFeEM7RUFDQS9ILEtBQUssQ0FBQzBJLFlBQVksQ0FBQzZGLFdBQVcsRUFBRSxVQUFVLEVBQUU7SUFDeENoTSxLQUFLLEVBQUVBLEtBQUs7SUFDWkMsS0FBSyxFQUFFQSxLQUFLO0lBQ1pDLENBQUMsRUFBRUYsS0FBSyxHQUFHRCxRQUFRO0lBQ25CSSxDQUFDLEVBQUVGLEtBQUssR0FBR0Y7RUFDZixDQUFDLENBQUM7O0VBRUY7RUFDQXRDLEtBQUssQ0FBQzBJLFlBQVksQ0FBQzZGLFdBQVcsRUFBRSxTQUFTLEVBQUU7SUFDdkN2VyxJQUFJLEVBQUUsT0FBTztJQUNiNk0sUUFBUSxFQUFFLEtBQUs7SUFDZnhCLEVBQUUsRUFBRSxJQUFJLENBQUU7RUFDZCxDQUFDLENBQUM7O0VBRUY7RUFDQSxNQUFNbUwsUUFBUSxHQUFHcFcsUUFBUSxDQUFDTCxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQzlDeVcsUUFBUSxDQUFDOVEsU0FBUyxHQUFHLHVCQUF1QjtFQUM1QzhRLFFBQVEsQ0FBQ3BHLEtBQUssQ0FBQ0MsUUFBUSxHQUFHLFVBQVU7RUFDcENtRyxRQUFRLENBQUNwRyxLQUFLLENBQUM3QixJQUFJLEdBQUcsR0FBR2hFLEtBQUssR0FBR0QsUUFBUSxJQUFJO0VBQzdDa00sUUFBUSxDQUFDcEcsS0FBSyxDQUFDMkMsR0FBRyxHQUFHLEdBQUd2SSxLQUFLLEdBQUdGLFFBQVEsSUFBSTtFQUM1Q2tNLFFBQVEsQ0FBQ3BHLEtBQUssQ0FBQ3NGLEtBQUssR0FBRyxHQUFHcEwsUUFBUSxJQUFJO0VBQ3RDa00sUUFBUSxDQUFDcEcsS0FBSyxDQUFDdUYsTUFBTSxHQUFHLEdBQUdyTCxRQUFRLElBQUk7RUFDdkNrTSxRQUFRLENBQUNwRyxLQUFLLENBQUNxRyxPQUFPLEdBQUcsTUFBTTtFQUMvQkQsUUFBUSxDQUFDcEcsS0FBSyxDQUFDc0csVUFBVSxHQUFHLFFBQVE7RUFDcENGLFFBQVEsQ0FBQ3BHLEtBQUssQ0FBQ3VHLGNBQWMsR0FBRyxRQUFRO0VBQ3hDSCxRQUFRLENBQUNwRyxLQUFLLENBQUN3RyxRQUFRLEdBQUcsTUFBTTtFQUNoQ0osUUFBUSxDQUFDcEcsS0FBSyxDQUFDRSxNQUFNLEdBQUcsR0FBRztFQUMzQmtHLFFBQVEsQ0FBQ3ZOLFdBQVcsR0FBRyxJQUFJO0VBRTNCNUgsU0FBUyxDQUFDaUcsV0FBVyxDQUFDa1AsUUFBUSxDQUFDOztFQUUvQjtFQUNBLE1BQU05QyxPQUFPLEdBQUcxTCxLQUFLLENBQUN5SixZQUFZLENBQUM4RSxXQUFXLEVBQUUsU0FBUyxDQUFDO0VBQzFELElBQUk3QyxPQUFPLEVBQUU7SUFDVEEsT0FBTyxDQUFDckksRUFBRSxHQUFHbUwsUUFBUTtFQUN6QjtFQUVBdlMsT0FBTyxDQUFDQyxHQUFHLENBQUMsMkNBQTJDcUcsS0FBSyxLQUFLQyxLQUFLLEdBQUcsQ0FBQztBQUM5RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTekYsaUJBQWlCQSxDQUFDaUQsS0FBSyxFQUFFOEgsWUFBWSxFQUFFeEYsUUFBUSxHQUFHLEVBQUUsRUFBRWpKLFNBQVMsR0FBRyxJQUFJLEVBQUU7RUFDcEY7RUFDQSxNQUFNZ1AsUUFBUSxHQUFHckksS0FBSyxDQUFDeUosWUFBWSxDQUFDM0IsWUFBWSxFQUFFLFVBQVUsQ0FBQztFQUM3RCxNQUFNdUQsVUFBVSxHQUFHckwsS0FBSyxDQUFDeUosWUFBWSxDQUFDM0IsWUFBWSxFQUFFLFlBQVksQ0FBQztFQUNqRSxNQUFNakosTUFBTSxHQUFHbUIsS0FBSyxDQUFDeUosWUFBWSxDQUFDM0IsWUFBWSxFQUFFLFFBQVEsQ0FBQztFQUV6RCxJQUFJLENBQUNPLFFBQVEsSUFBSSxDQUFDZ0QsVUFBVSxJQUFJLENBQUN4TSxNQUFNLEVBQUU7O0VBRXpDO0VBQ0EsTUFBTWdRLFVBQVUsR0FBR2hELElBQUksQ0FBQ2lELEtBQUssQ0FBQyxDQUFDekcsUUFBUSxDQUFDNUYsQ0FBQyxHQUFHSCxRQUFRLEdBQUcsQ0FBQyxJQUFJQSxRQUFRLENBQUM7RUFDckUsTUFBTXlNLFVBQVUsR0FBR2xELElBQUksQ0FBQ2lELEtBQUssQ0FBQyxDQUFDekcsUUFBUSxDQUFDM0YsQ0FBQyxHQUFHSixRQUFRLEdBQUcsQ0FBQyxJQUFJQSxRQUFRLENBQUM7O0VBRXJFO0VBQ0E7RUFDQSxJQUFJK0ksVUFBVSxDQUFDaEksRUFBRSxJQUFJZ0ksVUFBVSxDQUFDaEksRUFBRSxDQUFDc0ksVUFBVSxFQUFFO0lBQzNDTixVQUFVLENBQUNoSSxFQUFFLENBQUNzSSxVQUFVLENBQUN6SyxXQUFXLENBQUNtSyxVQUFVLENBQUNoSSxFQUFFLENBQUM7RUFDdkQ7O0VBRUE7RUFDQXJELEtBQUssQ0FBQ2dQLGVBQWUsQ0FBQ2xILFlBQVksRUFBRSxZQUFZLENBQUM7RUFDakQ5SCxLQUFLLENBQUNnUCxlQUFlLENBQUNsSCxZQUFZLEVBQUUsVUFBVSxDQUFDO0VBQy9DOUgsS0FBSyxDQUFDZ1AsZUFBZSxDQUFDbEgsWUFBWSxFQUFFLE9BQU8sQ0FBQztFQUM1Qzs7RUFFQTtFQUNBLE1BQU1ySixhQUFhLEdBQUdwRixTQUFTLElBQUlqQixRQUFRLENBQUM2RSxjQUFjLENBQUMsZ0JBQWdCLENBQUM7RUFDNUUsSUFBSXdCLGFBQWEsRUFBRTtJQUNmbUgsaUJBQWlCLENBQUM1RixLQUFLLEVBQUU2TyxVQUFVLEVBQUVFLFVBQVUsRUFBRXRRLGFBQWEsRUFBRTZELFFBQVEsQ0FBQztFQUM3RTtFQUVBckcsT0FBTyxDQUFDQyxHQUFHLENBQUMseUJBQXlCMkMsTUFBTSxDQUFDQyxFQUFFLGFBQWErUCxVQUFVLEtBQUtFLFVBQVUsNEJBQTRCLENBQUM7QUFDckg7QUFFTyxTQUFTckosWUFBWUEsQ0FBQzFGLEtBQUssRUFBRXFKLEdBQUcsRUFBRStDLFlBQVksRUFBRXRGLGlCQUFpQixFQUFFeEUsUUFBUSxHQUFHLEVBQUUsRUFBRW5ELE1BQU0sRUFBRTtFQUM3RixNQUFNUixPQUFPLEdBQUdxQixLQUFLLENBQUNvSyxLQUFLLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQztFQUNqRCxNQUFNd0QsVUFBVSxHQUFHNU4sS0FBSyxDQUFDb0ssS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUM7RUFFdkQsS0FBSyxNQUFNdEMsWUFBWSxJQUFJbkosT0FBTyxFQUFFO0lBQ2hDLE1BQU1zUSxJQUFJLEdBQUdqUCxLQUFLLENBQUN5SixZQUFZLENBQUMzQixZQUFZLEVBQUUsVUFBVSxDQUFDO0lBQ3pELE1BQU1qSixNQUFNLEdBQUdtQixLQUFLLENBQUN5SixZQUFZLENBQUMzQixZQUFZLEVBQUUsUUFBUSxDQUFDO0lBRXpELElBQUlqSixNQUFNLENBQUNxUSxlQUFlLElBQUlyUSxNQUFNLENBQUNxUSxlQUFlLEdBQUc3RixHQUFHLEVBQUU7SUFFNUQsS0FBSyxNQUFNbUUsU0FBUyxJQUFJSSxVQUFVLEVBQUU7TUFDaEMsTUFBTXVCLElBQUksR0FBR25QLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQytELFNBQVMsRUFBRSxVQUFVLENBQUM7O01BRXREO01BQ0EsTUFBTTRCLFdBQVcsR0FBR3ZELElBQUksQ0FBQ2lELEtBQUssQ0FBQyxDQUFDRyxJQUFJLENBQUN4TSxDQUFDLEdBQUdILFFBQVEsR0FBRyxDQUFDLElBQUlBLFFBQVEsQ0FBQztNQUNsRSxNQUFNK00sV0FBVyxHQUFHeEQsSUFBSSxDQUFDaUQsS0FBSyxDQUFDLENBQUNHLElBQUksQ0FBQ3ZNLENBQUMsR0FBR0osUUFBUSxHQUFHLENBQUMsSUFBSUEsUUFBUSxDQUFDO01BRWxFLElBQUk4TSxXQUFXLEtBQUtELElBQUksQ0FBQzVNLEtBQUssSUFBSThNLFdBQVcsS0FBS0YsSUFBSSxDQUFDM00sS0FBSyxFQUFFO1FBQzFELE1BQU04TSxhQUFhLEdBQUd6USxNQUFNLENBQUMrSixLQUFLLElBQUksQ0FBQztRQUN2Qy9KLE1BQU0sQ0FBQytKLEtBQUssR0FBR2lELElBQUksQ0FBQ3pHLEdBQUcsQ0FBQ2tLLGFBQWEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDelEsTUFBTSxDQUFDcVEsZUFBZSxHQUFHN0YsR0FBRyxHQUFHLElBQUk7O1FBRW5DO1FBQ0EsSUFBSXhLLE1BQU0sQ0FBQytKLEtBQUssSUFBSSxDQUFDLEVBQUU7VUFDbkIsSUFBSS9KLE1BQU0sQ0FBQzBRLG1CQUFtQixFQUFFO1VBQ2hDMVEsTUFBTSxDQUFDMFEsbUJBQW1CLEdBQUcsSUFBSTtVQUVqQyxJQUFJbkQsWUFBWSxFQUFFO1lBQ2RBLFlBQVksQ0FBQ3RFLFlBQVksRUFBRWpKLE1BQU0sQ0FBQ0MsRUFBRSxFQUFFLENBQUMsQ0FBQztVQUM1QztVQUNBL0IsaUJBQWlCLENBQUNpRCxLQUFLLEVBQUU4SCxZQUFZLEVBQUV4RixRQUFRLENBQUM7UUFDcEQsQ0FBQyxNQUFNO1VBQ0g7VUFDQSxJQUFJOEosWUFBWSxFQUFFO1lBQ2RBLFlBQVksQ0FBQ3RFLFlBQVksRUFBRWpKLE1BQU0sQ0FBQ0MsRUFBRSxFQUFFRCxNQUFNLENBQUMrSixLQUFLLENBQUM7VUFDdkQ7UUFDSjs7UUFFQTtRQUNBO01BQ0o7SUFDSjtFQUNKO0FBQ0osQzs7Ozs7Ozs7Ozs7Ozs7QUM1SU8sU0FBU3JELGNBQWNBLENBQUN2RixLQUFLLEVBQUUwTSxFQUFFLEVBQUVyRCxHQUFHLEVBQUV4QyxPQUFPLEVBQUV2RSxRQUFRLEdBQUcsRUFBRSxFQUFFO0VBQ25FLE1BQU1rTixRQUFRLEdBQUd4UCxLQUFLLENBQUNvSyxLQUFLLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztFQUNwRCxNQUFNcUYsS0FBSyxHQUFHL0MsRUFBRSxHQUFHLEtBQUs7RUFFeEIsTUFBTWdELFdBQVcsR0FBR3BOLFFBQVE7RUFFNUIsS0FBSyxNQUFNM0MsTUFBTSxJQUFJNlAsUUFBUSxFQUFFO0lBQzNCLE1BQU10RixHQUFHLEdBQUdsSyxLQUFLLENBQUN5SixZQUFZLENBQUM5SixNQUFNLEVBQUUsVUFBVSxDQUFDO0lBQ2xELE1BQU15TCxHQUFHLEdBQUdwTCxLQUFLLENBQUN5SixZQUFZLENBQUM5SixNQUFNLEVBQUUsVUFBVSxDQUFDO0lBQ2xELE1BQU02SixLQUFLLEdBQUd4SixLQUFLLENBQUN5SixZQUFZLENBQUM5SixNQUFNLEVBQUUsT0FBTyxDQUFDO0lBQ2pELE1BQU1nUSxRQUFRLEdBQUczUCxLQUFLLENBQUN5SixZQUFZLENBQUM5SixNQUFNLEVBQUUsVUFBVSxDQUFDO0lBRXZELElBQUlnUSxRQUFRLEVBQUU7TUFDVnZFLEdBQUcsQ0FBQ3JJLEtBQUssR0FBR3FJLEdBQUcsQ0FBQ3RJLFNBQVMsR0FBRyxDQUFDNk0sUUFBUSxDQUFDekssY0FBYyxHQUFHLENBQUMsSUFBSSxHQUFHO0lBQ25FLENBQUMsTUFBTTtNQUNIa0csR0FBRyxDQUFDckksS0FBSyxHQUFHcUksR0FBRyxDQUFDdEksU0FBUztJQUM3QjtJQUVBLElBQUksQ0FBQzBHLEtBQUssRUFBRTtNQUNSb0csZ0JBQWdCLENBQUMxRixHQUFHLEVBQUVrQixHQUFHLEVBQUVxRSxLQUFLLENBQUM7TUFDakM7SUFDSjtJQUVBLE1BQU1JLFdBQVcsR0FBR3JHLEtBQUssQ0FBQ3JHLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDdkMsSUFBSTJNLEVBQUUsR0FBRyxDQUFDO0lBQ1YsSUFBSUMsRUFBRSxHQUFHLENBQUM7SUFFVixJQUFJRixXQUFXLEtBQUssSUFBSSxFQUFFO01BQ3RCRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO01BQ1AzRSxHQUFHLENBQUNuSSxTQUFTLEdBQUcsSUFBSTtJQUN4QixDQUFDLE1BQU0sSUFBSTRNLFdBQVcsS0FBSyxNQUFNLEVBQUU7TUFDL0JFLEVBQUUsR0FBRyxDQUFDO01BQ04zRSxHQUFHLENBQUNuSSxTQUFTLEdBQUcsTUFBTTtJQUMxQixDQUFDLE1BQU0sSUFBSTRNLFdBQVcsS0FBSyxNQUFNLEVBQUU7TUFDL0JDLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDUDFFLEdBQUcsQ0FBQ25JLFNBQVMsR0FBRyxNQUFNO0lBQzFCLENBQUMsTUFBTSxJQUFJNE0sV0FBVyxLQUFLLE9BQU8sRUFBRTtNQUNoQ0MsRUFBRSxHQUFHLENBQUM7TUFDTjFFLEdBQUcsQ0FBQ25JLFNBQVMsR0FBRyxPQUFPO0lBQzNCO0lBRUEsTUFBTStNLFFBQVEsR0FBR0YsRUFBRSxLQUFLLENBQUMsSUFBSUMsRUFBRSxLQUFLLENBQUM7SUFFckMsSUFBSSxDQUFDQyxRQUFRLEVBQUU7TUFDWDlGLEdBQUcsQ0FBQ3ZILE9BQU8sR0FBR3VILEdBQUcsQ0FBQ3pILENBQUM7TUFDbkJ5SCxHQUFHLENBQUN0SCxPQUFPLEdBQUdzSCxHQUFHLENBQUN4SCxDQUFDO01BQ25CMEksR0FBRyxDQUFDcEksUUFBUSxHQUFHLEtBQUs7TUFDcEIsTUFBTXFJLFVBQVUsR0FBR3JMLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQzlKLE1BQU0sRUFBRSxZQUFZLENBQUM7TUFDM0QsSUFBSTBMLFVBQVUsRUFBRTtRQUNaQSxVQUFVLENBQUNySCxLQUFLLEdBQUcsTUFBTTtNQUM3QjtNQUVBa0csR0FBRyxDQUFDM0gsS0FBSyxHQUFHc0osSUFBSSxDQUFDaUQsS0FBSyxDQUNsQixDQUFDNUUsR0FBRyxDQUFDekgsQ0FBQyxHQUFHaU4sV0FBVyxHQUFHLENBQUMsSUFBSXBOLFFBQ2hDLENBQUM7TUFFRDRILEdBQUcsQ0FBQzFILEtBQUssR0FBR3FKLElBQUksQ0FBQ2lELEtBQUssQ0FDbEIsQ0FBQzVFLEdBQUcsQ0FBQ3hILENBQUMsR0FBR2dOLFdBQVcsR0FBRyxDQUFDLElBQUlwTixRQUNoQyxDQUFDO01BRUQsSUFBSXRDLEtBQUssQ0FBQ3VNLGlCQUFpQixFQUFFO1FBQ3pCdk0sS0FBSyxDQUFDdU0saUJBQWlCLENBQ25CNU0sTUFBTSxFQUNOdUssR0FBRyxDQUFDekgsQ0FBQyxFQUNMeUgsR0FBRyxDQUFDeEgsQ0FBQyxFQUNMd0gsR0FBRyxDQUFDM0gsS0FBSyxFQUNUMkgsR0FBRyxDQUFDMUgsS0FBSyxFQUNUNEksR0FBRyxDQUFDbkksU0FBUyxFQUNibUksR0FBRyxDQUFDcEksUUFDUixDQUFDO01BQ0w7TUFDQTtJQUNKO0lBRUEsTUFBTWlOLEtBQUssR0FBRy9GLEdBQUcsQ0FBQ3pILENBQUMsR0FBR3FOLEVBQUUsR0FBRzFFLEdBQUcsQ0FBQ3JJLEtBQUssR0FBRzBNLEtBQUs7SUFDNUMsTUFBTVMsS0FBSyxHQUFHaEcsR0FBRyxDQUFDeEgsQ0FBQyxHQUFHcU4sRUFBRSxHQUFHM0UsR0FBRyxDQUFDckksS0FBSyxHQUFHME0sS0FBSztJQUU1QyxNQUFNVSxhQUFhLEdBQUcsRUFBRTtJQUV4QixJQUFJSixFQUFFLEtBQUssQ0FBQyxJQUFJRCxFQUFFLEtBQUssQ0FBQyxFQUFFO01BQ3RCLElBQUlNLFNBQVMsQ0FBQ2xHLEdBQUcsQ0FBQ3pILENBQUMsRUFBRXlOLEtBQUssRUFBRXJKLE9BQU8sRUFBRXZFLFFBQVEsRUFBRW9OLFdBQVcsQ0FBQyxFQUFFO1FBQ3pELE1BQU1XLFlBQVksR0FBR3hFLElBQUksQ0FBQ2lELEtBQUssQ0FBQyxDQUFDNUUsR0FBRyxDQUFDekgsQ0FBQyxHQUFHaU4sV0FBVyxHQUFHLENBQUMsSUFBSXBOLFFBQVEsQ0FBQztRQUNyRSxNQUFNSyxPQUFPLEdBQUcwTixZQUFZLEdBQUcvTixRQUFRO1FBQ3ZDLE1BQU1nTyxLQUFLLEdBQUdwRyxHQUFHLENBQUN6SCxDQUFDLEdBQUdFLE9BQU87UUFFN0IsSUFBSWtKLElBQUksQ0FBQzBFLEdBQUcsQ0FBQ0QsS0FBSyxDQUFDLEdBQUdILGFBQWEsRUFBRTtVQUNqQ0osRUFBRSxHQUFHLENBQUM7VUFDTkQsRUFBRSxHQUFHLENBQUNqRSxJQUFJLENBQUMyRSxJQUFJLENBQUNGLEtBQUssQ0FBQztRQUMxQjtNQUNKO0lBQ0o7SUFFQSxJQUFJUixFQUFFLEtBQUssQ0FBQyxJQUFJQyxFQUFFLEtBQUssQ0FBQyxFQUFFO01BQ3RCLElBQUlLLFNBQVMsQ0FBQ0gsS0FBSyxFQUFFL0YsR0FBRyxDQUFDeEgsQ0FBQyxFQUFFbUUsT0FBTyxFQUFFdkUsUUFBUSxFQUFFb04sV0FBVyxDQUFDLEVBQUU7UUFDekQsTUFBTWUsWUFBWSxHQUFHNUUsSUFBSSxDQUFDaUQsS0FBSyxDQUFDLENBQUM1RSxHQUFHLENBQUN4SCxDQUFDLEdBQUdnTixXQUFXLEdBQUcsQ0FBQyxJQUFJcE4sUUFBUSxDQUFDO1FBQ3JFLE1BQU1NLE9BQU8sR0FBRzZOLFlBQVksR0FBR25PLFFBQVE7UUFDdkMsTUFBTW9PLEtBQUssR0FBR3hHLEdBQUcsQ0FBQ3hILENBQUMsR0FBR0UsT0FBTztRQUU3QixJQUFJaUosSUFBSSxDQUFDMEUsR0FBRyxDQUFDRyxLQUFLLENBQUMsR0FBR1AsYUFBYSxFQUFFO1VBQ2pDTCxFQUFFLEdBQUcsQ0FBQztVQUNOQyxFQUFFLEdBQUcsQ0FBQ2xFLElBQUksQ0FBQzJFLElBQUksQ0FBQ0UsS0FBSyxDQUFDO1FBQzFCO01BQ0o7SUFDSjtJQUVBLE1BQU1DLGNBQWMsR0FBR3pHLEdBQUcsQ0FBQ3pILENBQUMsR0FBR3FOLEVBQUUsR0FBRzFFLEdBQUcsQ0FBQ3JJLEtBQUssR0FBRzBNLEtBQUs7SUFDckQsTUFBTW1CLGNBQWMsR0FBRzFHLEdBQUcsQ0FBQ3hILENBQUMsR0FBR3FOLEVBQUUsR0FBRzNFLEdBQUcsQ0FBQ3JJLEtBQUssR0FBRzBNLEtBQUs7SUFFckQsSUFBSUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDTSxTQUFTLENBQUNPLGNBQWMsRUFBRXpHLEdBQUcsQ0FBQ3hILENBQUMsRUFBRW1FLE9BQU8sRUFBRXZFLFFBQVEsRUFBRW9OLFdBQVcsQ0FBQyxFQUFFO01BQy9FeEYsR0FBRyxDQUFDekgsQ0FBQyxHQUFHa08sY0FBYztJQUMxQjtJQUVBLElBQUlaLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQ0ssU0FBUyxDQUFDbEcsR0FBRyxDQUFDekgsQ0FBQyxFQUFFbU8sY0FBYyxFQUFFL0osT0FBTyxFQUFFdkUsUUFBUSxFQUFFb04sV0FBVyxDQUFDLEVBQUU7TUFDL0V4RixHQUFHLENBQUN4SCxDQUFDLEdBQUdrTyxjQUFjO0lBQzFCO0lBRUF4RixHQUFHLENBQUNwSSxRQUFRLEdBQUcsSUFBSTtJQUVuQixNQUFNcUksVUFBVSxHQUFHckwsS0FBSyxDQUFDeUosWUFBWSxDQUFDOUosTUFBTSxFQUFFLFlBQVksQ0FBQztJQUMzRCxJQUFJMEwsVUFBVSxFQUFFO01BQ1pBLFVBQVUsQ0FBQ3JILEtBQUssR0FBRyxLQUFLO0lBQzVCO0lBRUFrRyxHQUFHLENBQUMzSCxLQUFLLEdBQUdzSixJQUFJLENBQUNpRCxLQUFLLENBQ2xCLENBQUM1RSxHQUFHLENBQUN6SCxDQUFDLEdBQUdpTixXQUFXLEdBQUcsQ0FBQyxJQUFJcE4sUUFDaEMsQ0FBQztJQUVENEgsR0FBRyxDQUFDMUgsS0FBSyxHQUFHcUosSUFBSSxDQUFDaUQsS0FBSyxDQUNsQixDQUFDNUUsR0FBRyxDQUFDeEgsQ0FBQyxHQUFHZ04sV0FBVyxHQUFHLENBQUMsSUFBSXBOLFFBQ2hDLENBQUM7SUFFRDRILEdBQUcsQ0FBQ3ZILE9BQU8sR0FBR3VILEdBQUcsQ0FBQ3pILENBQUM7SUFDbkJ5SCxHQUFHLENBQUN0SCxPQUFPLEdBQUdzSCxHQUFHLENBQUN4SCxDQUFDO0lBRW5CLElBQUkxQyxLQUFLLENBQUN1TSxpQkFBaUIsRUFBRTtNQUN6QnZNLEtBQUssQ0FBQ3VNLGlCQUFpQixDQUNuQjVNLE1BQU0sRUFDTnVLLEdBQUcsQ0FBQ3pILENBQUMsRUFDTHlILEdBQUcsQ0FBQ3hILENBQUMsRUFDTHdILEdBQUcsQ0FBQzNILEtBQUssRUFDVDJILEdBQUcsQ0FBQzFILEtBQUssRUFDVDRJLEdBQUcsQ0FBQ25JLFNBQVMsRUFDYm1JLEdBQUcsQ0FBQ3BJLFFBQ1IsQ0FBQztJQUNMO0VBQ0o7QUFDSjtBQUVBLFNBQVM0TSxnQkFBZ0JBLENBQUMxRixHQUFHLEVBQUVrQixHQUFHLEVBQUVxRSxLQUFLLEVBQUU7RUFDdkMsTUFBTW9CLElBQUksR0FBR3pGLEdBQUcsQ0FBQ3JJLEtBQUssR0FBRzBNLEtBQUs7RUFFOUIsSUFBSXZGLEdBQUcsQ0FBQ3pILENBQUMsR0FBR3lILEdBQUcsQ0FBQ3ZILE9BQU8sRUFBRTtJQUNyQnVILEdBQUcsQ0FBQ3pILENBQUMsR0FBR29KLElBQUksQ0FBQ0MsR0FBRyxDQUFDNUIsR0FBRyxDQUFDekgsQ0FBQyxHQUFHb08sSUFBSSxFQUFFM0csR0FBRyxDQUFDdkgsT0FBTyxDQUFDO0VBQy9DLENBQUMsTUFBTSxJQUFJdUgsR0FBRyxDQUFDekgsQ0FBQyxHQUFHeUgsR0FBRyxDQUFDdkgsT0FBTyxFQUFFO0lBQzVCdUgsR0FBRyxDQUFDekgsQ0FBQyxHQUFHb0osSUFBSSxDQUFDekcsR0FBRyxDQUFDOEUsR0FBRyxDQUFDekgsQ0FBQyxHQUFHb08sSUFBSSxFQUFFM0csR0FBRyxDQUFDdkgsT0FBTyxDQUFDO0VBQy9DO0VBRUEsSUFBSXVILEdBQUcsQ0FBQ3hILENBQUMsR0FBR3dILEdBQUcsQ0FBQ3RILE9BQU8sRUFBRTtJQUNyQnNILEdBQUcsQ0FBQ3hILENBQUMsR0FBR21KLElBQUksQ0FBQ0MsR0FBRyxDQUFDNUIsR0FBRyxDQUFDeEgsQ0FBQyxHQUFHbU8sSUFBSSxFQUFFM0csR0FBRyxDQUFDdEgsT0FBTyxDQUFDO0VBQy9DLENBQUMsTUFBTSxJQUFJc0gsR0FBRyxDQUFDeEgsQ0FBQyxHQUFHd0gsR0FBRyxDQUFDdEgsT0FBTyxFQUFFO0lBQzVCc0gsR0FBRyxDQUFDeEgsQ0FBQyxHQUFHbUosSUFBSSxDQUFDekcsR0FBRyxDQUFDOEUsR0FBRyxDQUFDeEgsQ0FBQyxHQUFHbU8sSUFBSSxFQUFFM0csR0FBRyxDQUFDdEgsT0FBTyxDQUFDO0VBQy9DO0VBRUF3SSxHQUFHLENBQUNwSSxRQUFRLEdBQ1JrSCxHQUFHLENBQUN6SCxDQUFDLEtBQUt5SCxHQUFHLENBQUN2SCxPQUFPLElBQ3JCdUgsR0FBRyxDQUFDeEgsQ0FBQyxLQUFLd0gsR0FBRyxDQUFDdEgsT0FBTztBQUM3QjtBQUVBLFNBQVN3TixTQUFTQSxDQUFDM04sQ0FBQyxFQUFFQyxDQUFDLEVBQUVtRSxPQUFPLEVBQUV2RSxRQUFRLEVBQUV3TyxVQUFVLEdBQUd4TyxRQUFRLEVBQUU7RUFDL0QsTUFBTXlPLE9BQU8sR0FBRyxDQUFDO0VBRWpCLE1BQU14SyxJQUFJLEdBQUdzRixJQUFJLENBQUNpRCxLQUFLLENBQ25CLENBQUNyTSxDQUFDLEdBQUdzTyxPQUFPLElBQUl6TyxRQUNwQixDQUFDO0VBRUQsTUFBTW1FLEtBQUssR0FBR29GLElBQUksQ0FBQ2lELEtBQUssQ0FDcEIsQ0FBQ3JNLENBQUMsR0FBR3FPLFVBQVUsR0FBR0MsT0FBTyxJQUFJek8sUUFDakMsQ0FBQztFQUVELE1BQU15SSxHQUFHLEdBQUdjLElBQUksQ0FBQ2lELEtBQUssQ0FDbEIsQ0FBQ3BNLENBQUMsR0FBR3FPLE9BQU8sSUFBSXpPLFFBQ3BCLENBQUM7RUFFRCxNQUFNME8sTUFBTSxHQUFHbkYsSUFBSSxDQUFDaUQsS0FBSyxDQUNyQixDQUFDcE0sQ0FBQyxHQUFHb08sVUFBVSxHQUFHQyxPQUFPLElBQUl6TyxRQUNqQyxDQUFDO0VBRUQsT0FDSTJPLGFBQWEsQ0FBQzFLLElBQUksRUFBRXdFLEdBQUcsRUFBRWxFLE9BQU8sQ0FBQyxJQUNqQ29LLGFBQWEsQ0FBQ3hLLEtBQUssRUFBRXNFLEdBQUcsRUFBRWxFLE9BQU8sQ0FBQyxJQUNsQ29LLGFBQWEsQ0FBQzFLLElBQUksRUFBRXlLLE1BQU0sRUFBRW5LLE9BQU8sQ0FBQyxJQUNwQ29LLGFBQWEsQ0FBQ3hLLEtBQUssRUFBRXVLLE1BQU0sRUFBRW5LLE9BQU8sQ0FBQztBQUU3QztBQUVBLFNBQVNvSyxhQUFhQSxDQUFDeE8sQ0FBQyxFQUFFQyxDQUFDLEVBQUVtRSxPQUFPLEVBQUU7RUFDbEMsTUFBTTBHLElBQUksR0FBRzFHLE9BQU8sQ0FBQ25FLENBQUMsQ0FBQyxJQUFJbUUsT0FBTyxDQUFDbkUsQ0FBQyxDQUFDLENBQUNELENBQUMsQ0FBQztFQUV4QyxPQUFPOEssSUFBSSxLQUFLLENBQUMsSUFBSUEsSUFBSSxLQUFLLENBQUM7QUFDbkMsQzs7Ozs7Ozs7Ozs7Ozs7O0FDdk1PLFNBQVMxSCxhQUFhQSxDQUFDN0YsS0FBSyxFQUFFc00sZUFBZSxFQUFFO0VBQ2xELE1BQU0zTixPQUFPLEdBQUdxQixLQUFLLENBQUNvSyxLQUFLLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUM7RUFDN0QsTUFBTXFCLFFBQVEsR0FBR3pMLEtBQUssQ0FBQ29LLEtBQUssQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO0VBRW5ELEtBQUssTUFBTXRDLFlBQVksSUFBSW5KLE9BQU8sRUFBRTtJQUNoQyxNQUFNc1EsSUFBSSxHQUFHalAsS0FBSyxDQUFDeUosWUFBWSxDQUFDM0IsWUFBWSxFQUFFLFVBQVUsQ0FBQztJQUN6RCxNQUFNc0QsR0FBRyxHQUFHcEwsS0FBSyxDQUFDeUosWUFBWSxDQUFDM0IsWUFBWSxFQUFFLFVBQVUsQ0FBQztJQUN4RCxNQUFNakosTUFBTSxHQUFHbUIsS0FBSyxDQUFDeUosWUFBWSxDQUFDM0IsWUFBWSxFQUFFLFFBQVEsQ0FBQztJQUN6RCxJQUFJLENBQUNtSCxJQUFJLElBQUksQ0FBQzdELEdBQUcsSUFBSSxDQUFDdk0sTUFBTSxFQUFFO0lBRTlCLEtBQUssTUFBTXFTLFNBQVMsSUFBSXpGLFFBQVEsRUFBRTtNQUM5QixNQUFNMEYsS0FBSyxHQUFHblIsS0FBSyxDQUFDeUosWUFBWSxDQUFDeUgsU0FBUyxFQUFFLFVBQVUsQ0FBQztNQUN2RCxNQUFNRSxHQUFHLEdBQUdwUixLQUFLLENBQUN5SixZQUFZLENBQUN5SCxTQUFTLEVBQUUsU0FBUyxDQUFDO01BQ3BELElBQUksQ0FBQ0MsS0FBSyxJQUFJLENBQUNDLEdBQUcsSUFBSUEsR0FBRyxDQUFDdk0sUUFBUSxFQUFFOztNQUVwQztNQUNBLElBQUlvSyxJQUFJLENBQUMxTSxLQUFLLEtBQUs0TyxLQUFLLENBQUM1TyxLQUFLLElBQUkwTSxJQUFJLENBQUN6TSxLQUFLLEtBQUsyTyxLQUFLLENBQUMzTyxLQUFLLEVBQUU7UUFDMUQ0TyxHQUFHLENBQUN2TSxRQUFRLEdBQUcsSUFBSTs7UUFFbkI7UUFDQSxJQUFJdU0sR0FBRyxDQUFDcFosSUFBSSxLQUFLLE9BQU8sRUFBRTtVQUN0Qm9ULEdBQUcsQ0FBQ3JJLEtBQUssR0FBRzhJLElBQUksQ0FBQ0MsR0FBRyxDQUFDVixHQUFHLENBQUNySSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxDQUFDLE1BQ0ksSUFBSXFPLEdBQUcsQ0FBQ3BaLElBQUksS0FBSyxPQUFPLEVBQUU7VUFDM0I2RyxNQUFNLENBQUNnSyxRQUFRLEdBQUdoSyxNQUFNLENBQUNnSyxRQUFRLEdBQUdoSyxNQUFNLENBQUNnSyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDL0QsQ0FBQyxNQUNJLElBQUl1SSxHQUFHLENBQUNwWixJQUFJLEtBQUssT0FBTyxFQUFFO1VBQzNCNkcsTUFBTSxDQUFDaUssU0FBUyxHQUFHakssTUFBTSxDQUFDaUssU0FBUyxHQUFHakssTUFBTSxDQUFDaUssU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDO1FBQ2xFLENBQUMsTUFDSSxJQUFJc0ksR0FBRyxDQUFDcFosSUFBSSxLQUFLLE9BQU8sRUFBRTtVQUMzQjZHLE1BQU0sQ0FBQytKLEtBQUssSUFBSSxDQUFDO1FBQ3JCOztRQUVBO1FBQ0EsSUFBSXdJLEdBQUcsQ0FBQy9OLEVBQUUsSUFBSStOLEdBQUcsQ0FBQy9OLEVBQUUsQ0FBQ3NJLFVBQVUsRUFBRTtVQUM3QnlGLEdBQUcsQ0FBQy9OLEVBQUUsQ0FBQ3NJLFVBQVUsQ0FBQ3pLLFdBQVcsQ0FBQ2tRLEdBQUcsQ0FBQy9OLEVBQUUsQ0FBQztRQUN6Qzs7UUFFQTtRQUNBO1FBQ0EsSUFBSWlKLGVBQWUsRUFBRTtVQUNqQkEsZUFBZSxDQUFDek4sTUFBTSxDQUFDQyxFQUFFLEVBQUVzUyxHQUFHLENBQUNwWixJQUFJLEVBQUVtWixLQUFLLENBQUM1TyxLQUFLLEVBQUU0TyxLQUFLLENBQUMzTyxLQUFLLENBQUM7UUFDbEU7O1FBRUE7UUFDQXhDLEtBQUssQ0FBQ0MsYUFBYSxDQUFDaVIsU0FBUyxDQUFDO1FBQzlCalYsT0FBTyxDQUFDQyxHQUFHLENBQUMseURBQXlEaVYsS0FBSyxDQUFDNU8sS0FBSyxLQUFLNE8sS0FBSyxDQUFDM08sS0FBSyxHQUFHLENBQUM7UUFDcEc7TUFDSjtJQUNKO0VBQ0o7QUFDSjtBQUVPLFNBQVNzRCxZQUFZQSxDQUFDOUYsS0FBSyxFQUFFb0MsRUFBRSxFQUFFQyxFQUFFLEVBQUVoSixTQUFTLEVBQUVpSixRQUFRLEdBQUcsRUFBRSxFQUFFO0VBQ2xFLE1BQU0rTyxJQUFJLEdBQUdqUCxFQUFFLEdBQUcsUUFBUSxHQUFHQyxFQUFFLEdBQUcsUUFBUTtFQUMxQyxNQUFNaVAsVUFBVSxHQUFJekYsSUFBSSxDQUFDMEYsR0FBRyxDQUFDRixJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUl4RixJQUFJLENBQUNpRCxLQUFLLENBQUNqRCxJQUFJLENBQUMwRixHQUFHLENBQUNGLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztFQUVoRixJQUFJQyxVQUFVLEdBQUcsSUFBSSxFQUFFO0VBRXZCLE1BQU1FLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0VBQ3pDLE1BQU1DLFNBQVMsR0FBRzVGLElBQUksQ0FBQ2lELEtBQUssQ0FBQyxDQUFDakQsSUFBSSxDQUFDMEYsR0FBRyxDQUFDRixJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHeEYsSUFBSSxDQUFDaUQsS0FBSyxDQUFDakQsSUFBSSxDQUFDMEYsR0FBRyxDQUFDRixJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUlHLEtBQUssQ0FBQzlXLE1BQU0sQ0FBQztFQUNsSCxNQUFNZ1gsVUFBVSxHQUFHRixLQUFLLENBQUNDLFNBQVMsQ0FBQztFQUVuQyxNQUFNUCxTQUFTLEdBQUdsUixLQUFLLENBQUMrSCxZQUFZLENBQUMsQ0FBQztFQUN0Qy9ILEtBQUssQ0FBQzBJLFlBQVksQ0FBQ3dJLFNBQVMsRUFBRSxVQUFVLEVBQUU7SUFBRTNPLEtBQUssRUFBRUgsRUFBRTtJQUFFSSxLQUFLLEVBQUVILEVBQUU7SUFBRUksQ0FBQyxFQUFFTCxFQUFFLEdBQUdFLFFBQVE7SUFBRUksQ0FBQyxFQUFFTCxFQUFFLEdBQUdDO0VBQVMsQ0FBQyxDQUFDO0VBRXZHLE1BQU1xUCxHQUFHLEdBQUd2WixRQUFRLENBQUNMLGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDekM0WixHQUFHLENBQUNqVSxTQUFTLEdBQUcsbUJBQW1CZ1UsVUFBVSxDQUFDalosV0FBVyxDQUFDLENBQUMsRUFBRTtFQUM3RGtaLEdBQUcsQ0FBQ3ZKLEtBQUssQ0FBQ0MsUUFBUSxHQUFHLFVBQVU7RUFDL0JzSixHQUFHLENBQUN2SixLQUFLLENBQUNzRixLQUFLLEdBQUcsR0FBR3BMLFFBQVEsSUFBSTtFQUNqQ3FQLEdBQUcsQ0FBQ3ZKLEtBQUssQ0FBQ3VGLE1BQU0sR0FBRyxHQUFHckwsUUFBUSxJQUFJO0VBQ2xDcVAsR0FBRyxDQUFDdkosS0FBSyxDQUFDN0IsSUFBSSxHQUFHLEdBQUduRSxFQUFFLEdBQUdFLFFBQVEsSUFBSTtFQUNyQ3FQLEdBQUcsQ0FBQ3ZKLEtBQUssQ0FBQzJDLEdBQUcsR0FBRyxHQUFHMUksRUFBRSxHQUFHQyxRQUFRLElBQUk7RUFDcENxUCxHQUFHLENBQUN2SixLQUFLLENBQUNFLE1BQU0sR0FBRyxHQUFHO0VBQ3RCalAsU0FBUyxDQUFDaUcsV0FBVyxDQUFDcVMsR0FBRyxDQUFDO0VBRTFCM1IsS0FBSyxDQUFDMEksWUFBWSxDQUFDd0ksU0FBUyxFQUFFLFNBQVMsRUFBRTtJQUFFbFosSUFBSSxFQUFFMFosVUFBVTtJQUFFck8sRUFBRSxFQUFFc087RUFBSSxDQUFDLENBQUM7QUFDM0UsQzs7Ozs7Ozs7Ozs7Ozs7QUM3RU8sU0FBU25NLFlBQVlBLENBQUN4RixLQUFLLEVBQUUwTSxFQUFFLEVBQUVyRCxHQUFHLEVBQUV1SSxRQUFRLEVBQUU7RUFDbkQsTUFBTXBDLFFBQVEsR0FBR3hQLEtBQUssQ0FBQ29LLEtBQUssQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQztFQUVsRSxLQUFLLE1BQU16SyxNQUFNLElBQUk2UCxRQUFRLEVBQUU7SUFDM0IsTUFBTXRGLEdBQUcsR0FBR2xLLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQzlKLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDbEQsTUFBTXlMLEdBQUcsR0FBR3BMLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQzlKLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDbEQsTUFBTTBMLFVBQVUsR0FBR3JMLEtBQUssQ0FBQ3lKLFlBQVksQ0FBQzlKLE1BQU0sRUFBRSxZQUFZLENBQUM7SUFFM0QsSUFBSSxDQUFDMEwsVUFBVSxDQUFDaEksRUFBRSxFQUFFO0lBRXBCLE1BQU1XLEtBQUssR0FBR3FILFVBQVUsQ0FBQ3JILEtBQUs7SUFDOUIsTUFBTTZOLFNBQVMsR0FBR0QsUUFBUSxDQUFDNU4sS0FBSyxDQUFDLENBQUNvSCxHQUFHLENBQUNuSSxTQUFTLENBQUM7O0lBRWhEO0lBQ0EsSUFBSW9JLFVBQVUsQ0FBQ3RILEdBQUcsS0FBSzhOLFNBQVMsSUFBSXhHLFVBQVUsQ0FBQ3BILFNBQVMsS0FBS0QsS0FBSyxFQUFFO01BQ2hFcUgsVUFBVSxDQUFDdEgsR0FBRyxHQUFHOE4sU0FBUztNQUMxQnhHLFVBQVUsQ0FBQzNILFlBQVksR0FBRyxDQUFDO01BQzNCMkgsVUFBVSxDQUFDdkgsYUFBYSxHQUFHdUYsR0FBRztNQUM5QmdDLFVBQVUsQ0FBQ3BILFNBQVMsR0FBR0QsS0FBSztJQUNoQztJQUVBLE1BQU04TixVQUFVLEdBQUc5TixLQUFLLEtBQUssS0FBSyxHQUFHcUgsVUFBVSxDQUFDMUgsU0FBUyxHQUFHMEgsVUFBVSxDQUFDekgsVUFBVTtJQUNqRixNQUFNbU8sVUFBVSxHQUFHL04sS0FBSyxLQUFLLEtBQUssR0FBRyxJQUFJLEdBQUdxSCxVQUFVLENBQUM1SCxHQUFHLEdBQUcsSUFBSSxHQUFHNEgsVUFBVSxDQUFDeEgsT0FBTztJQUV0RixJQUFJd0YsR0FBRyxHQUFHZ0MsVUFBVSxDQUFDdkgsYUFBYSxHQUFHaU8sVUFBVSxFQUFFO01BQzdDMUcsVUFBVSxDQUFDM0gsWUFBWSxHQUFHLENBQUMySCxVQUFVLENBQUMzSCxZQUFZLEdBQUcsQ0FBQyxJQUFJb08sVUFBVTtNQUNwRXpHLFVBQVUsQ0FBQ3ZILGFBQWEsR0FBR3VGLEdBQUc7SUFDbEM7SUFFQSxNQUFNMkksSUFBSSxHQUFHLEVBQUUzRyxVQUFVLENBQUMzSCxZQUFZLEdBQUcySCxVQUFVLENBQUMvSCxVQUFVLENBQUM7SUFDL0QsTUFBTTJPLElBQUksR0FBRyxFQUFFNUcsVUFBVSxDQUFDdEgsR0FBRyxHQUFHc0gsVUFBVSxDQUFDOUgsV0FBVyxDQUFDO0lBRXZEOEgsVUFBVSxDQUFDaEksRUFBRSxDQUFDK0UsS0FBSyxDQUFDOEosa0JBQWtCLEdBQUcsR0FBR0YsSUFBSSxNQUFNQyxJQUFJLElBQUk7SUFDOUQ1RyxVQUFVLENBQUNoSSxFQUFFLENBQUMrRSxLQUFLLENBQUMrSixTQUFTLEdBQUcsZUFBZWpJLEdBQUcsQ0FBQ3pILENBQUMsT0FBT3lILEdBQUcsQ0FBQ3hILENBQUMsUUFBUTtFQUM1RTtBQUNKLEM7Ozs7Ozs7Ozs7Ozs7O0FDbkNBOztBQUVPLE1BQU00QyxLQUFLLENBQUM7RUFDZnFCLFdBQVdBLENBQUEsRUFBRztJQUNWLElBQUksQ0FBQ3lMLFlBQVksR0FBRyxDQUFDO0lBQ3JCLElBQUksQ0FBQzVDLFFBQVEsR0FBRyxJQUFJelYsR0FBRyxDQUFDLENBQUM7SUFDekIsSUFBSSxDQUFDc1ksVUFBVSxHQUFHLElBQUl0TCxHQUFHLENBQUMsQ0FBQztJQUMzQixJQUFJLENBQUN1TCxPQUFPLEdBQUcsRUFBRTtFQUNyQjtFQUVBdkssWUFBWUEsQ0FBQSxFQUFHO0lBQ1gsTUFBTXBJLE1BQU0sR0FBRyxJQUFJLENBQUN5UyxZQUFZLEVBQUU7SUFDbEMsSUFBSSxDQUFDNUMsUUFBUSxDQUFDdlYsR0FBRyxDQUFDMEYsTUFBTSxDQUFDO0lBQ3pCLE9BQU9BLE1BQU07RUFDakI7RUFFQU0sYUFBYUEsQ0FBQ04sTUFBTSxFQUFFO0lBQ2xCLElBQUksQ0FBQzZQLFFBQVEsQ0FBQ3RQLE1BQU0sQ0FBQ1AsTUFBTSxDQUFDO0lBQzVCLEtBQUssTUFBTSxDQUFDNFMsYUFBYSxFQUFFQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUNILFVBQVUsQ0FBQ0ksT0FBTyxDQUFDLENBQUMsRUFBRTtNQUNuRUQsWUFBWSxDQUFDdFMsTUFBTSxDQUFDUCxNQUFNLENBQUM7SUFDL0I7RUFDSjtFQUVBK0ksWUFBWUEsQ0FBQy9JLE1BQU0sRUFBRTRTLGFBQWEsRUFBRUcsYUFBYSxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ3BELElBQUksQ0FBQyxJQUFJLENBQUNMLFVBQVUsQ0FBQ2xHLEdBQUcsQ0FBQ29HLGFBQWEsQ0FBQyxFQUFFO01BQ3JDLElBQUksQ0FBQ0YsVUFBVSxDQUFDckssR0FBRyxDQUFDdUssYUFBYSxFQUFFLElBQUl4TCxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2pEO0lBQ0EsSUFBSSxDQUFDc0wsVUFBVSxDQUFDeFMsR0FBRyxDQUFDMFMsYUFBYSxDQUFDLENBQUN2SyxHQUFHLENBQUNySSxNQUFNLEVBQUUrUyxhQUFhLENBQUM7RUFDakU7RUFFQWpKLFlBQVlBLENBQUM5SixNQUFNLEVBQUU0UyxhQUFhLEVBQUU7SUFDaEMsTUFBTUMsWUFBWSxHQUFHLElBQUksQ0FBQ0gsVUFBVSxDQUFDeFMsR0FBRyxDQUFDMFMsYUFBYSxDQUFDO0lBQ3ZELE9BQU9DLFlBQVksR0FBR0EsWUFBWSxDQUFDM1MsR0FBRyxDQUFDRixNQUFNLENBQUMsR0FBR3pHLFNBQVM7RUFDOUQ7RUFFQThWLGVBQWVBLENBQUNyUCxNQUFNLEVBQUU0UyxhQUFhLEVBQUU7SUFDbkMsTUFBTUMsWUFBWSxHQUFHLElBQUksQ0FBQ0gsVUFBVSxDQUFDeFMsR0FBRyxDQUFDMFMsYUFBYSxDQUFDO0lBQ3ZELElBQUlDLFlBQVksRUFBRTtNQUNkQSxZQUFZLENBQUN0UyxNQUFNLENBQUNQLE1BQU0sQ0FBQztJQUMvQjtFQUNKO0VBRUF5SyxLQUFLQSxDQUFDLEdBQUd1SSxjQUFjLEVBQUU7SUFDckIsSUFBSUEsY0FBYyxDQUFDalksTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUU7SUFFMUMsTUFBTWtZLFFBQVEsR0FBRyxJQUFJLENBQUNQLFVBQVUsQ0FBQ3hTLEdBQUcsQ0FBQzhTLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RCxJQUFJLENBQUNDLFFBQVEsRUFBRSxPQUFPLEVBQUU7SUFFeEIsTUFBTUMsT0FBTyxHQUFHLEVBQUU7SUFDbEIsS0FBSyxNQUFNbFQsTUFBTSxJQUFJaVQsUUFBUSxDQUFDekgsSUFBSSxDQUFDLENBQUMsRUFBRTtNQUNsQyxJQUFJMkgsTUFBTSxHQUFHLElBQUk7TUFDakIsS0FBSyxJQUFJM0UsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHd0UsY0FBYyxDQUFDalksTUFBTSxFQUFFeVQsQ0FBQyxFQUFFLEVBQUU7UUFDNUMsTUFBTWpGLEdBQUcsR0FBRyxJQUFJLENBQUNtSixVQUFVLENBQUN4UyxHQUFHLENBQUM4UyxjQUFjLENBQUN4RSxDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUNqRixHQUFHLElBQUksQ0FBQ0EsR0FBRyxDQUFDaUQsR0FBRyxDQUFDeE0sTUFBTSxDQUFDLEVBQUU7VUFDMUJtVCxNQUFNLEdBQUcsS0FBSztVQUNkO1FBQ0o7TUFDSjtNQUNBLElBQUlBLE1BQU0sSUFBSSxJQUFJLENBQUN0RCxRQUFRLENBQUNyRCxHQUFHLENBQUN4TSxNQUFNLENBQUMsRUFBRTtRQUNyQ2tULE9BQU8sQ0FBQ3JZLElBQUksQ0FBQ21GLE1BQU0sQ0FBQztNQUN4QjtJQUNKO0lBQ0EsT0FBT2tULE9BQU87RUFDbEI7RUFFQXJHLFNBQVNBLENBQUN1RyxjQUFjLEVBQUU7SUFDdEIsSUFBSSxDQUFDVCxPQUFPLENBQUM5WCxJQUFJLENBQUN1WSxjQUFjLENBQUM7RUFDckM7RUFFQXBHLE1BQU1BLENBQUNELEVBQUUsRUFBRXJELEdBQUcsRUFBRTtJQUNaLEtBQUssTUFBTTJKLE1BQU0sSUFBSSxJQUFJLENBQUNWLE9BQU8sRUFBRTtNQUMvQlUsTUFBTSxDQUFDLElBQUksRUFBRXRHLEVBQUUsRUFBRXJELEdBQUcsQ0FBQztJQUN6QjtFQUNKO0FBQ0osQzs7Ozs7Ozs7Ozs7Ozs7O0FDMUV5RDtBQUUxQyxTQUFTN00sVUFBVUEsQ0FBQSxFQUFHO0VBQ2pDLE1BQU15VyxTQUFTLEdBQUdsYixrRUFBQTtJQUFROEksS0FBSyxFQUFDO0VBQWUsR0FBQyxxQkFBMkIsQ0FBQztFQUU1RW9TLFNBQVMsQ0FBQ3ZhLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQ3RDO0lBQ0EwRSxNQUFNLENBQUM5QixRQUFRLENBQUM0WCxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQzVCMVUsVUFBVSxDQUFDLE1BQU07TUFDYnBCLE1BQU0sQ0FBQzlCLFFBQVEsQ0FBQzZYLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUMsRUFBRSxHQUFHLENBQUM7RUFDWCxDQUFDLENBQUM7RUFFRixPQUNJcGIsa0VBQUE7SUFBSzhJLEtBQUssRUFBQztFQUFVLEdBQ2pCOUksa0VBQUEsYUFBSSxpQkFBbUIsQ0FBQyxFQUN4QkEsa0VBQUEsWUFBRyxxREFBc0QsQ0FBQyxFQUN6RGtiLFNBQ0EsQ0FBQztBQUVkLEM7Ozs7Ozs7Ozs7Ozs7OztBQ3BCeUQ7QUFFMUMsU0FBUzFXLE9BQU9BLENBQUN0RSxLQUFLLEVBQUU7RUFDbkMsTUFBTXlILFVBQVUsR0FBR3pILEtBQUssQ0FBQ3lILFVBQVUsSUFBSSxVQUFVO0VBRWpELE1BQU0wVCxTQUFTLEdBQUdyYixrRUFBQTtJQUFROEksS0FBSyxFQUFDO0VBQWUsR0FBQyxZQUFrQixDQUFDO0VBRW5FdVMsU0FBUyxDQUFDMWEsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07SUFDdEM7SUFDQSxJQUFJMEUsTUFBTSxDQUFDK0IsTUFBTSxFQUFFO01BQ2YvQixNQUFNLENBQUMrQixNQUFNLENBQUNDLEtBQUssQ0FBQyxDQUFDO01BQ3JCaEMsTUFBTSxDQUFDK0IsTUFBTSxHQUFHLElBQUk7SUFDeEI7O0lBRUE7SUFDQS9CLE1BQU0sQ0FBQzlCLFFBQVEsQ0FBQzRYLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDNUIxVSxVQUFVLENBQUMsTUFBTTtNQUNicEIsTUFBTSxDQUFDOUIsUUFBUSxDQUFDNlgsTUFBTSxDQUFDLENBQUM7SUFDNUIsQ0FBQyxFQUFFLEdBQUcsQ0FBQztFQUNYLENBQUMsQ0FBQztFQUVGLE9BQ0lwYixrRUFBQTtJQUFLOEksS0FBSyxFQUFDO0VBQVUsR0FDakI5SSxrRUFBQSxhQUFLMkgsVUFBVSxDQUFDMlQsV0FBVyxDQUFDLENBQUMsRUFBQyxPQUFTLENBQUMsRUFDeEN0YixrRUFBQSxZQUFHLDJDQUE0QyxDQUFDLEVBQy9DcWIsU0FDQSxDQUFDO0FBRWQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUJ5RDtBQUNvQjtBQUU3RSxNQUFNak4sU0FBUyxHQUFHLEVBQUU7QUFDcEIsTUFBTW1OLGdCQUFnQixHQUFHLENBQUM7QUFDMUIsTUFBTUMsaUJBQWlCLEdBQUcsRUFBRTtBQUM1QixNQUFNQyxrQkFBa0IsR0FBRyxHQUFHO0FBRTlCLE1BQU1DLE1BQU0sR0FBRztFQUNYLENBQUMsRUFBRSxpQ0FBaUM7RUFDcEMsQ0FBQyxFQUFFLGdDQUFnQztFQUNuQyxDQUFDLEVBQUU7QUFDUCxDQUFDO0FBRUQsTUFBTSxDQUFDQyxVQUFVLEVBQUVoWCxhQUFhLENBQUMsR0FBRy9DLHdFQUFZLENBQUMsVUFBVSxDQUFDO0FBQzVELE1BQU0sQ0FBQ2lQLEtBQUssRUFBRTVDLFFBQVEsQ0FBQyxHQUFHck0sd0VBQVksQ0FBQyxDQUFDLENBQUM7QUFDekMsTUFBTSxDQUFDb0osS0FBSyxFQUFFbUQsUUFBUSxDQUFDLEdBQUd2TSx3RUFBWSxDQUFDLENBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUN3TCxLQUFLLEVBQUVZLFFBQVEsQ0FBQyxHQUFHcE0sd0VBQVksQ0FBQyxDQUFDLENBQUM7QUFDekMsTUFBTSxDQUFDNkssS0FBSyxFQUFFeUIsUUFBUSxDQUFDLEdBQUd0TSx3RUFBWSxDQUFDLENBQUMsQ0FBQztBQUN3QjtBQUVqRSxNQUFNZ2EsTUFBTSxHQUFHNWIsa0VBQUE7RUFBTThJLEtBQUssRUFBQztBQUFhLENBQU8sQ0FBQztBQUVoRHRHLHdFQUFZLENBQUMsTUFBTTtFQUFFb1osTUFBTSxDQUFDMVMsV0FBVyxHQUFHeVMsVUFBVSxDQUFDLENBQUM7QUFBRSxDQUFDLENBQUM7QUFFMUQsTUFBTUUsT0FBTyxHQUFHN2Isa0VBQUE7RUFBTThJLEtBQUssRUFBQztBQUF5QixDQUFPLENBQUM7QUFDN0QsTUFBTWdULE9BQU8sR0FBRzliLGtFQUFBO0VBQU04SSxLQUFLLEVBQUM7QUFBeUIsQ0FBTyxDQUFDO0FBQzdELE1BQU1pVCxPQUFPLEdBQUcvYixrRUFBQTtFQUFNOEksS0FBSyxFQUFDO0FBQXlCLENBQU8sQ0FBQztBQUM3RCxNQUFNa1QsT0FBTyxHQUFHaGMsa0VBQUE7RUFBTThJLEtBQUssRUFBQztBQUF5QixDQUFPLENBQUM7QUFFN0R0Ryx3RUFBWSxDQUFDLE1BQU07RUFBRXFaLE9BQU8sQ0FBQzNTLFdBQVcsR0FBRzJILEtBQUssQ0FBQyxDQUFDO0FBQUUsQ0FBQyxDQUFDO0FBQ3REck8sd0VBQVksQ0FBQyxNQUFNO0VBQUVzWixPQUFPLENBQUM1UyxXQUFXLEdBQUc4QixLQUFLLENBQUMsQ0FBQztBQUFFLENBQUMsQ0FBQztBQUN0RHhJLHdFQUFZLENBQUMsTUFBTTtFQUFFdVosT0FBTyxDQUFDN1MsV0FBVyxHQUFHa0UsS0FBSyxDQUFDLENBQUM7QUFBRSxDQUFDLENBQUM7QUFDdEQ1Syx3RUFBWSxDQUFDLE1BQU07RUFBRXdaLE9BQU8sQ0FBQzlTLFdBQVcsR0FBR3VELEtBQUssQ0FBQyxDQUFDO0FBQUUsQ0FBQyxDQUFDO0FBRXRELFNBQVNwSSxJQUFJQSxDQUFDO0VBQUVtQztBQUFLLENBQUMsRUFBRTtFQUNwQixNQUFNeVYsVUFBVSxHQUFHelYsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDN0QsTUFBTSxHQUFHeUwsU0FBUztFQUM3QyxNQUFNOE4sV0FBVyxHQUFHMVYsSUFBSSxDQUFDN0QsTUFBTSxHQUFHeUwsU0FBUztFQUMzQyxNQUFNK04sZUFBZSxHQUFHRixVQUFVLEdBQUdWLGdCQUFnQixHQUFHLENBQUM7RUFDekQsTUFBTWEsZ0JBQWdCLEdBQUdGLFdBQVcsR0FBR1gsZ0JBQWdCLEdBQUcsQ0FBQztFQUMzRCxNQUFNYyxhQUFhLEdBQUcsT0FBT2hYLE1BQU0sS0FBSyxXQUFXLEdBQUc0VyxVQUFVLEdBQUc1VyxNQUFNLENBQUNpWCxVQUFVO0VBQ3BGLE1BQU1DLGNBQWMsR0FBRyxPQUFPbFgsTUFBTSxLQUFLLFdBQVcsR0FBRzZXLFdBQVcsR0FBRzdXLE1BQU0sQ0FBQ21YLFdBQVc7RUFDdkYsTUFBTUMsS0FBSyxHQUFHM0ksSUFBSSxDQUFDQyxHQUFHLENBQ2xCLENBQUMsRUFDREQsSUFBSSxDQUFDekcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDZ1AsYUFBYSxHQUFHYixpQkFBaUIsSUFBSVcsZUFBZSxDQUFDLEVBQ3BFckksSUFBSSxDQUFDekcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDa1AsY0FBYyxHQUFHZCxrQkFBa0IsSUFBSVcsZ0JBQWdCLENBQzFFLENBQUM7RUFDRCxNQUFNTSxJQUFJLEdBQUcsRUFBRTtFQUNmLEtBQUssSUFBSUMsUUFBUSxHQUFHLENBQUMsRUFBRUEsUUFBUSxHQUFHblcsSUFBSSxDQUFDN0QsTUFBTSxFQUFFZ2EsUUFBUSxFQUFFLEVBQUU7SUFDdkQsTUFBTTFHLEtBQUssR0FBRyxFQUFFO0lBQ2hCLEtBQUssSUFBSTJHLFFBQVEsR0FBRyxDQUFDLEVBQUVBLFFBQVEsR0FBR3BXLElBQUksQ0FBQ21XLFFBQVEsQ0FBQyxDQUFDaGEsTUFBTSxFQUFFaWEsUUFBUSxFQUFFLEVBQUU7TUFDakUsTUFBTXBILElBQUksR0FBR2hQLElBQUksQ0FBQ21XLFFBQVEsQ0FBQyxDQUFDQyxRQUFRLENBQUM7TUFDckMsSUFBSWpYLFNBQVMsR0FBRyxNQUFNO01BQ3RCLElBQUkwSyxLQUFLLEdBQUcsU0FBU2pDLFNBQVMsYUFBYUEsU0FBUyxLQUFLO01BRXpELElBQUlvSCxJQUFJLEtBQUssQ0FBQyxJQUFJQSxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQzFCN1AsU0FBUyxJQUFJLGFBQWE7TUFDOUI7TUFDQSxJQUFJNlAsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNaN1AsU0FBUyxJQUFJLFlBQVk7UUFDekIwSyxLQUFLLElBQUksd0JBQXdCcUwsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHO01BQ2pEO01BQ0EsSUFBSWxHLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDWm5GLEtBQUssSUFBSSx3QkFBd0JxTCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUc7TUFDakQ7TUFDQSxJQUFJbEcsSUFBSSxLQUFLLENBQUMsSUFBSUEsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUMxQm5GLEtBQUssSUFBSSx3QkFBd0JxTCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUc7TUFDakQ7TUFFQXpGLEtBQUssQ0FBQ3hULElBQUksQ0FBQ3pDLGtFQUFBO1FBQUs4SSxLQUFLLEVBQUVuRCxTQUFVO1FBQUMsVUFBUWlYLFFBQVM7UUFBQyxVQUFRRCxRQUFTO1FBQUN0TSxLQUFLLEVBQUVBO01BQU0sQ0FBTSxDQUFDLENBQUM7SUFDL0Y7SUFDQXFNLElBQUksQ0FBQ2phLElBQUksQ0FBQ3pDLGtFQUFBO01BQUs4SSxLQUFLLEVBQUM7SUFBVSxHQUFFbU4sS0FBVyxDQUFDLENBQUM7RUFDbEQ7RUFFQSxPQUNJalcsa0VBQUE7SUFBSzhJLEtBQUssRUFBQztFQUFnQixHQUN2QjlJLGtFQUFBO0lBQUs4SSxLQUFLLEVBQUM7RUFBWSxHQUNuQjlJLGtFQUFBO0lBQUs4SSxLQUFLLEVBQUM7RUFBVyxHQUNqQjhTLE1BQU0sRUFDUDViLGtFQUFBO0lBQUs4SSxLQUFLLEVBQUM7RUFBYSxHQUNwQjlJLGtFQUFBO0lBQUs4SSxLQUFLLEVBQUM7RUFBWSxHQUNuQjlJLGtFQUFBO0lBQU04SSxLQUFLLEVBQUM7RUFBWSxHQUFDLE9BQVcsQ0FBQyxFQUNwQytTLE9BQ0EsQ0FBQyxFQUNON2Isa0VBQUE7SUFBSzhJLEtBQUssRUFBQztFQUFZLEdBQ25COUksa0VBQUE7SUFBTThJLEtBQUssRUFBQztFQUFZLEdBQUMsT0FBVyxDQUFDLEVBQ3BDZ1QsT0FDQSxDQUFDLEVBQ045YixrRUFBQTtJQUFLOEksS0FBSyxFQUFDO0VBQVksR0FDbkI5SSxrRUFBQTtJQUFNOEksS0FBSyxFQUFDO0VBQVksR0FBQyxPQUFXLENBQUMsRUFDcENpVCxPQUNBLENBQUMsRUFDTi9iLGtFQUFBO0lBQUs4SSxLQUFLLEVBQUM7RUFBWSxHQUNuQjlJLGtFQUFBO0lBQU04SSxLQUFLLEVBQUM7RUFBWSxHQUFDLE9BQVcsQ0FBQyxFQUNwQ2tULE9BQ0EsQ0FDSixDQUNKLENBQUMsRUFDTmhjLGtFQUFBO0lBQUs4SSxLQUFLLEVBQUMsa0JBQWtCO0lBQUN1SCxLQUFLLEVBQUUsU0FBUzhMLGVBQWUsR0FBR00sS0FBSyxhQUFhTCxnQkFBZ0IsR0FBR0ssS0FBSztFQUFNLEdBQzVHemMsa0VBQUE7SUFDSStHLEVBQUUsRUFBQyxnQkFBZ0I7SUFDbkIrQixLQUFLLEVBQUMsV0FBVztJQUNqQnVILEtBQUssRUFBRSwyQkFBMkI0TCxVQUFVLGFBQWFDLFdBQVcsc0JBQXNCTyxLQUFLO0VBQUssR0FFbkdDLElBQ0EsQ0FDSixDQUNKLENBQ0osQ0FBQztBQUVkO0FBRUEsaUVBQWVyWSxJQUFJLEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hIc0M7QUFDb0I7QUFDaEM7QUFFN0MsSUFBSSxDQUFDd1ksTUFBTSxFQUFFblksU0FBUyxDQUFDLEdBQUc5Qyx3RUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCO0FBRXJCLElBQUlrYixRQUFRLEdBQUc5YyxrRUFBQSxZQUFHLFdBQVksQ0FBQztBQUMvQixJQUFJK2MsU0FBUyxHQUFHL2Msa0VBQUEsWUFBRyxlQUFnQixDQUFDO0FBQ3BDLElBQUlnZCxNQUFNLEdBQUdoZCxrRUFBQSxVQUFNLENBQUM7QUFDcEIsSUFBSWlkLE9BQU8sR0FBR2pkLGtFQUFBLFlBQUcsU0FBVSxDQUFDO0FBRTVCd0Msd0VBQVksQ0FBQyxNQUFNO0VBQ2YsTUFBTTBhLENBQUMsR0FBR0wsTUFBTSxDQUFDLENBQUM7RUFDbEJDLFFBQVEsQ0FBQzVULFdBQVcsR0FBRyxZQUFZZ1UsQ0FBQyxDQUFDL1csTUFBTSxFQUFFO0VBQzdDNFcsU0FBUyxDQUFDN1QsV0FBVyxHQUFHLFlBQVlnVSxDQUFDLENBQUM5VyxZQUFZLE1BQU07RUFDeEQ0VyxNQUFNLENBQUM5VCxXQUFXLEdBQUdnVSxDQUFDLENBQUM1VyxJQUFJLElBQUksRUFBRTtFQUVqQyxJQUFJNFcsQ0FBQyxDQUFDQyxXQUFXLEVBQUU7SUFDZkYsT0FBTyxDQUFDL1QsV0FBVyxHQUFHLHFCQUFxQjtFQUMvQyxDQUFDLE1BQU07SUFDSCxNQUFNa1UsU0FBUyxHQUFJLENBQUNGLENBQUMsQ0FBQzdXLFdBQVcsR0FBSSw2QkFBNkIsR0FBRyxHQUFHNlcsQ0FBQyxDQUFDN1csV0FBVyxVQUFVO0lBQy9GNFcsT0FBTyxDQUFDL1QsV0FBVyxHQUFHLFVBQVVrVSxTQUFTLEVBQUU7RUFDL0M7QUFDSixDQUFDLENBQUM7QUFFRixTQUFTN1ksS0FBS0EsQ0FBQSxFQUFHO0VBQ2IsT0FDSXZFLGtFQUFBO0lBQUs4SSxLQUFLLEVBQUM7RUFBaUIsR0FDeEI5SSxrRUFBQTtJQUFLOEksS0FBSyxFQUFDO0VBQVcsR0FDbEI5SSxrRUFBQSxhQUFJLE9BQVMsQ0FBQyxFQUNiOGMsUUFBUSxFQUNSQyxTQUFTLEVBQ1RDLE1BQU0sRUFDTkMsT0FDQSxDQUFDLEVBQ05qZCxrRUFBQSxDQUFDNEksd0RBQVcsTUFBRSxDQUNiLENBQUM7QUFFZDtBQUVBLGlFQUFlckUsS0FBSyxFOzs7Ozs7Ozs7Ozs7Ozs7QUN6Q3FDO0FBRXpELE1BQU04VyxTQUFTLEdBQUdyYixrRUFBQTtFQUFROEksS0FBSyxFQUFDO0FBQWUsR0FBQyxZQUFrQixDQUFDO0FBRW5FdVMsU0FBUyxDQUFDMWEsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07RUFDdEM0QyxRQUFRLENBQUM2WCxNQUFNLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUM7QUFFRixJQUFJaUMsTUFBTSxHQUNOcmQsa0VBQUE7RUFBSzhJLEtBQUssRUFBQztBQUFVLEdBQ2pCOUksa0VBQUEsYUFBSSxVQUFZLENBQUMsRUFDakJBLGtFQUFBLFlBQUcsdUNBQXdDLENBQUMsRUFDM0NxYixTQUNBLENBQ1I7QUFFYyxTQUFTL1csSUFBSUEsQ0FBQSxFQUFHO0VBQzNCLE9BQU8rWSxNQUFNO0FBQ2pCLEM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQnlEO0FBQ1Y7QUFFL0MsU0FBU2paLFFBQVFBLENBQUM7RUFBRWU7QUFBSSxDQUFDLEVBQUU7RUFDdkIsSUFBSW1ZLFNBQVMsR0FBRyxLQUFLO0VBRXJCLElBQUlDLFdBQVcsR0FBSWhVLENBQUMsSUFBSztJQUNyQkEsQ0FBQyxDQUFDQyxjQUFjLENBQUMsQ0FBQztJQUNsQixJQUFJOFQsU0FBUyxFQUFFO0lBRWYsTUFBTTdULFFBQVEsR0FBRyxJQUFJQyxRQUFRLENBQUNILENBQUMsQ0FBQ2lVLGFBQWEsQ0FBQztJQUM5QyxNQUFNdlcsUUFBUSxHQUFHd0MsUUFBUSxDQUFDM0IsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDOEIsSUFBSSxDQUFDLENBQUM7SUFFaEQsSUFBSSxDQUFDM0MsUUFBUSxJQUFJQSxRQUFRLENBQUN0RSxNQUFNLEdBQUcsRUFBRSxFQUFFO0lBRXZDMmEsU0FBUyxHQUFHLElBQUk7SUFDaEIzWSwyREFBYSxDQUFDc0MsUUFBUSxDQUFDO0lBRXZCOUIsR0FBRyxDQUFDMkUsSUFBSSxDQUFDL0QsSUFBSSxDQUFDZ0UsU0FBUyxDQUFDO01BQ3BCOUosSUFBSSxFQUFFLHdCQUF3QjtNQUM5QmdILFFBQVEsRUFBRUE7SUFDZCxDQUFDLENBQUMsQ0FBQztFQUNQLENBQUM7RUFFRCxPQUNJakgsa0VBQUE7SUFBTThJLEtBQUssRUFBQyxlQUFlO0lBQUNrQixRQUFRLEVBQUV1VDtFQUFZLEdBQzlDdmQsa0VBQUE7SUFBTzhJLEtBQUssRUFBQyxnQkFBZ0I7SUFBQzdJLElBQUksRUFBQyxNQUFNO0lBQUNnSyxJQUFJLEVBQUMsVUFBVTtJQUFDQyxXQUFXLEVBQUMsaUJBQWlCO0lBQUNDLFNBQVMsRUFBQztFQUFJLENBQUMsQ0FBQyxFQUN4R25LLGtFQUFBO0lBQVE4SSxLQUFLLEVBQUMsaUJBQWlCO0lBQUM3SSxJQUFJLEVBQUM7RUFBUSxHQUFDLGVBQXFCLENBQ2pFLENBQUM7QUFFZjtBQUVBLGlFQUFlbUUsUUFBUSxFOzs7Ozs7Ozs7Ozs7OztBQ2hDdkIsTUFBTVMsS0FBSyxDQUFDO0VBQ1IrSixXQUFXQSxDQUFDNk8sR0FBRyxFQUFFO0lBQ2IsSUFBSSxDQUFDQyxLQUFLLEdBQUcsSUFBSUMsS0FBSyxDQUFDRixHQUFHLENBQUM7SUFDM0IsSUFBSSxDQUFDRyxNQUFNLEdBQUd2ZCxRQUFRLENBQUNMLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDOUMsSUFBSSxDQUFDNmQsSUFBSSxHQUFHeGQsUUFBUSxDQUFDTCxhQUFhLENBQUMsR0FBRyxDQUFDO0lBRXZDLElBQUksQ0FBQzBkLEtBQUssQ0FBQ0ksSUFBSSxHQUFHLElBQUk7SUFDdEIsSUFBSSxDQUFDSixLQUFLLENBQUNLLE1BQU0sR0FBRyxHQUFHO0lBRXZCLElBQUksQ0FBQ0gsTUFBTSxDQUFDalksU0FBUyxHQUFHLGNBQWM7SUFDdEMsSUFBSSxDQUFDaVksTUFBTSxDQUFDM2QsSUFBSSxHQUFHLFFBQVE7SUFDM0IsSUFBSSxDQUFDMmQsTUFBTSxDQUFDaGQsWUFBWSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztJQUN4RCxJQUFJLENBQUNnZCxNQUFNLENBQUM1YyxNQUFNLENBQUMsSUFBSSxDQUFDNmMsSUFBSSxDQUFDO0VBQ2pDO0VBRUFwWSxJQUFJQSxDQUFBLEVBQUc7SUFDSCxJQUFJLENBQUNtWSxNQUFNLENBQUNqZCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUNxZCxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRTFEM2QsUUFBUSxDQUFDcUYsSUFBSSxDQUFDMUUsTUFBTSxDQUFDLElBQUksQ0FBQzRjLE1BQU0sQ0FBQztJQUNqQ3ZkLFFBQVEsQ0FBQ00sZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDc2QsSUFBSSxDQUFDLENBQUMsRUFBRTtNQUFFQyxJQUFJLEVBQUU7SUFBSyxDQUFDLENBQUM7SUFFckUsSUFBSSxDQUFDQyxZQUFZLENBQUMsQ0FBQztJQUNuQixJQUFJLENBQUNGLElBQUksQ0FBQyxDQUFDO0VBQ2Y7RUFFQUEsSUFBSUEsQ0FBQSxFQUFHO0lBQ0gsSUFBSSxDQUFDUCxLQUFLLENBQUNPLElBQUksQ0FBQyxDQUFDLENBQ1pHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQ0QsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUMvQkUsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDRixZQUFZLENBQUMsQ0FBQyxDQUFDO0VBQ3pDO0VBRUFILE1BQU1BLENBQUEsRUFBRztJQUNMLElBQUksSUFBSSxDQUFDTixLQUFLLENBQUNZLE1BQU0sSUFBSSxJQUFJLENBQUNaLEtBQUssQ0FBQ2EsS0FBSyxFQUFFO01BQ3ZDLElBQUksQ0FBQ2IsS0FBSyxDQUFDYSxLQUFLLEdBQUcsS0FBSztNQUN4QixJQUFJLENBQUNYLE1BQU0sQ0FBQ2hkLFlBQVksQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7TUFDeEQsSUFBSSxDQUFDcWQsSUFBSSxDQUFDLENBQUM7SUFDZixDQUFDLE1BQU07TUFDSCxJQUFJLENBQUNQLEtBQUssQ0FBQ2EsS0FBSyxHQUFHLElBQUk7TUFDdkIsSUFBSSxDQUFDWCxNQUFNLENBQUNoZCxZQUFZLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQztNQUN2RCxJQUFJLENBQUN1ZCxZQUFZLENBQUMsQ0FBQztJQUN2QjtFQUNKO0VBRUFBLFlBQVlBLENBQUEsRUFBRztJQUNYLE1BQU1LLE9BQU8sR0FBRyxJQUFJLENBQUNkLEtBQUssQ0FBQ2EsS0FBSyxJQUFJLElBQUksQ0FBQ2IsS0FBSyxDQUFDWSxNQUFNO0lBRXJELElBQUksQ0FBQ1QsSUFBSSxDQUFDbFksU0FBUyxHQUFHNlksT0FBTyxHQUFHLHdCQUF3QixHQUFHLHlCQUF5QjtJQUNwRixJQUFJLENBQUNaLE1BQU0sQ0FBQ2EsU0FBUyxDQUFDVCxNQUFNLENBQUMsVUFBVSxFQUFFUSxPQUFPLENBQUM7RUFDckQ7QUFDSjtBQUVBLGlFQUFlM1osS0FBSyxFOzs7Ozs7VUNuRHBCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDNUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QsRTs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL2RvbS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29yay5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5LmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jaGF0LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2NvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9ib21iU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL21vdmVtZW50U3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy93b3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvS2lja2VkTWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL1dpbk1lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQubmF2aWdhdGlvblR5cGUgPT09ICdyZWxvYWQnKSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyIGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBNZW51IGZyb20gXCIuLi9wYWdlcy9tZW51XCI7XG5pbXBvcnQgTG9iYnkgZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgV2luTWVudSBmcm9tIFwiLi4vcGFnZXMvV2luTWVudS5qc3hcIjtcbmltcG9ydCBLaWNrZWRNZW51IGZyb20gXCIuLi9wYWdlcy9LaWNrZWRNZW51LmpzeFwiO1xuaW1wb3J0IHsgc2V0U3RhdGVzIH0gZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRQbGF5ZXJOYW1lIGFzIHNldEh1ZFBsYXllck5hbWUgfSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IFNvdW5kIGZyb20gXCIuLi91dGlscy9zb3VuZFwiO1xuaW1wb3J0IHsgc2V0TWVzc2FnZXMgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcbmltcG9ydCB7IGhhbmRsZVBsYXllckRlYXRoIH0gZnJvbSBcIi4uL2Vjcy9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qc1wiO1xuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChgd3M6Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZX06NTAwMGApO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5sZXQgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwicm9vbV91cGRhdGVcIjpcbiAgICAgICAgY2FzZSBcImxvYmJ5X3RpbWVyXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuICAgICAgICAgICAgaWYgKCFyb290LnF1ZXJ5U2VsZWN0b3IoXCIuY29uYXRpbmVyLWxvYmJ5XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKDxMb2JieSAvPiwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWQsXG4gICAgICAgICAgICAgICAgcGxheWVyc0NvdW50OiBtZXNzYWdlLnBsYXllcnNDb3VudCxcbiAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogbWVzc2FnZS5zZWNvbmRzTGVmdCxcbiAgICAgICAgICAgICAgICB0ZXh0OiBtZXNzYWdlLnRleHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJsb2JieV9yZXNldFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJsb2JieS1wYWdlXCI7XG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb25hdGluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXRlcyh7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBcIlwiLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogMSxcbiAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogMTAsXG4gICAgICAgICAgICAgICAgdGV4dDogXCJXYWl0aW5nIGZvciBtb3JlIHBsYXllcnNcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfc3RhcnRlZFwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuXG4gICAgICAgICAgICByZW5kZXIoPEdhbWUgZ3JpZD17bWVzc2FnZS5ncmlkfSAvPiwgcm9vdCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udGFpbmVyXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFBsYXllciA9IChtZXNzYWdlLnBsYXllcnMgfHwgW10pLmZpbmQocGxheWVyID0+IHBsYXllci5pZCA9PT0gbWVzc2FnZS55b3VyUGxheWVySWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxQbGF5ZXIgJiYgbG9jYWxQbGF5ZXIubmlja25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEh1ZFBsYXllck5hbWUobG9jYWxQbGF5ZXIubmlja25hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5naW5lID0gbmV3IEdhbWVFbmdpbmUoZ2FtZUNvbnRhaW5lciwgbWVzc2FnZS5ncmlkLCB3c3MpO1xuICAgICAgICAgICAgICAgICAgICBlbmdpbmUuaW5pdChtZXNzYWdlLnlvdXJQbGF5ZXJJZCwgbWVzc2FnZS5wbGF5ZXJzIHx8IFtdKTtcblxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IGVuZ2luZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbW1lZGlhdGVseSBjaGVjayBpZiB0aGUgcGxheWVyIGlzIGFscmVhZHkgQUZLIGJlZm9yZSB0aGV5IGV2ZW4gc3RhcnQgcGxheWluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93LnNvY2tldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc29ja2V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdzcy5jbG9zZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICByb290LmFwcGVuZENoaWxkKEtpY2tlZE1lbnUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIFN0b3AgZnVydGhlciBsaXN0ZW5lcnNcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFGSyAvIFRhYi1zd2l0Y2gga2ljazogaGFuZGxlIGZ1dHVyZSB0YWIgc3dpdGNoZXMgZHVyaW5nIHRoZSBtYXRjaFxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBmdW5jdGlvbiBvbkFGSygpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBvbkFGSyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93LnNvY2tldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zb2NrZXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3c3MuY2xvc2UoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290LmFwcGVuZENoaWxkKEtpY2tlZE1lbnUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJHYW1lIGNvbnRhaW5lciB3YXMgbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJyb29tX2Fsb25lXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPE1lbnUgLz4sIHJvb3QpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfd29uXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChXaW5NZW51KHsgd2lubmVyTmFtZTogbWVzc2FnZS53aW5uZXJOYW1lIH0pKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfdHVybmVkX2hlYXJ0XCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBjdXJyZW50R2FtZUVuZ2luZS5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKG1lc3NhZ2UucGxheWVySWQpKTtcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlUGxheWVyRGVhdGgoY3VycmVudEdhbWVFbmdpbmUud29ybGQsIGVudGl0eSwgNjQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLndvcmxkLmRlc3Ryb3lFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUucGxheWVyRW50aXRpZXMuZGVsZXRlKFN0cmluZyhtZXNzYWdlLnBsYXllcklkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImNoYXRfbWVzc2FnZVwiOlxuICAgICAgICAgICAgc2V0TWVzc2FnZXMocHJldiA9PiBbLi4ucHJldiwgbWVzc2FnZS5tZXNzYWdlXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBsYXllcl9tb3ZlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlTW92ZShtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib21iX2Ryb3BwZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZUJvbWIobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicG93ZXJ1cF9waWNrZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaXRlbV9waWNrZWRcIjpcbiAgICAgICAgICAgIC8vIEhhbmRsZSByZW1vdGUgaGVhcnQgcGlja3VwIC0gdXBkYXRlIHRoZSBwbGF5ZXIncyBsaXZlcyBvbiBhbGwgY2xpZW50c1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlSXRlbVBpY2t1cChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3JcIiwgZXJyKTtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NlZFwiKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB3c3M7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IHdzcyBmcm9tIFwiLi4vYXBwL2FwcFwiO1xuXG5jb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IGNyZWF0ZVNpZ25hbChbXSk7XG5leHBvcnQgeyBzZXRNZXNzYWdlcyB9O1xuXG5mdW5jdGlvbiBDaGF0UGxheWVycygpIHtcbiAgICBjb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IDxkaXYgY2xhc3M9XCJtZXNzYWdlc1wiPjwvZGl2PjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZ3MgPSBtZXNzYWdlcygpO1xuICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGZvciAobGV0IG1zZyBvZiBtc2dzKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBwLnRleHRDb250ZW50ID0gbXNnO1xuICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXNDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5yZW1vdmVDaGlsZChtZXNzYWdlc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgbXNncy51bnNoaWZ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZm9ybURhdGEuZ2V0KFwibWVzc2FnZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJjaGF0X21lc3NhZ2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH0pKTtcbiAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdFwiIG9uU3VibWl0PXticm9hZGNhc3RNZXNzYWdlfT5cbiAgICAgICAgICAgIHttZXNzYWdlc0NvbnRhaW5lcn1cbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJ0eXBlIHRvIHRoZSBvdGhlciBwbGF5ZXJzIC4uLlwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVyczsiLCIvLyAvc3JjL2Vjcy9jb21wb25lbnRzLmpzXG5cbmV4cG9ydCBjb25zdCBQb3NpdGlvbkNvbXBvbmVudCA9IChneCwgZ3ksIHRpbGVTaXplID0gNjQpID0+ICh7XG4gICAgZ3JpZFg6IGd4LFxuICAgIGdyaWRZOiBneSxcbiAgICB4OiBneCAqIHRpbGVTaXplLFxuICAgIHk6IGd5ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRZOiBneSAqIHRpbGVTaXplXG59KTtcblxuZXhwb3J0IGNvbnN0IFZlbG9jaXR5Q29tcG9uZW50ID0gKGJhc2VTcGVlZCA9IDIuNSkgPT4gKHtcbiAgICBiYXNlU3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBzcGVlZDogYmFzZVNwZWVkLFxuICAgIGlzTW92aW5nOiBmYWxzZSxcbiAgICBkaXJlY3Rpb246ICdkb3duJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBJbnB1dENvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgaW5wdXRRdWV1ZTogW11cbn0pO1xuXG5leHBvcnQgY29uc3QgUmVuZGVyYWJsZUNvbXBvbmVudCA9IChlbCwgZnJhbWVXaWR0aCA9IDY0LCBmcmFtZUhlaWdodCA9IDY0LCB0b3RhbEZyYW1lcyA9IDQsIGZwcyA9IDEyKSA9PiAoe1xuICAgIGVsOiBlbCxcbiAgICBmcmFtZVdpZHRoOiBmcmFtZVdpZHRoLFxuICAgIGZyYW1lSGVpZ2h0OiBmcmFtZUhlaWdodCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IHRvdGFsRnJhbWVzLFxuICAgIHJ1bkZyYW1lczogNCxcbiAgICBpZGxlRnJhbWVzOiAyLFxuICAgIGZwczogZnBzLFxuICAgIGlkbGVGcHM6IDQsXG4gICAgbGFzdEZyYW1lVGltZTogMCxcbiAgICByb3c6IDAsXG4gICAgc3RhdGU6ICdJRExFJyxcbiAgICBsYXN0U3RhdGU6ICdJRExFJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXJDb21wb25lbnQgPSAoaWQsIGNoYXJUeXBlLCBpc0xvY2FsID0gZmFsc2UpID0+ICh7XG4gICAgaWQ6IGlkLFxuICAgIGNoYXJUeXBlOiBjaGFyVHlwZSxcbiAgICBpc0xvY2FsOiBpc0xvY2FsXG59KTtcblxuZXhwb3J0IGNvbnN0IEJvbWJDb21wb25lbnQgPSAob3duZXJJZCwgdGltZXIgPSAyMDAwLCByYW5nZSA9IDQpID0+ICh7XG4gICAgb3duZXJJZDogb3duZXJJZCxcbiAgICB0aW1lcjogdGltZXIsXG4gICAgcmFuZ2U6IHJhbmdlLFxuICAgIGV4cGxvZGVkOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBFeHBsb3Npb25Db21wb25lbnQgPSAoZHVyYXRpb24gPSA1MDApID0+ICh7XG4gICAgZHVyYXRpb246IGR1cmF0aW9uXG59KTtcblxuZXhwb3J0IGNvbnN0IFBvd2VyVXBDb21wb25lbnQgPSAodHlwZSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlLCBcbiAgICBwaWNrZWRVcDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgQmVoYXZpb3JDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGdob3N0TW9kZTogZmFsc2UsXG4gICAgdGhyb3dhYmxlOiBmYWxzZSxcbiAgICBkZXRvbmF0b3I6IGZhbHNlLFxuICAgIGZhc3RTaG9lc0xldmVsOiAxLFxuICAgIGJvbWJzOiB7XG4gICAgICAgIG1heDogMSxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgcmFuZ2U6IDJcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC5qcyc7XG5pbXBvcnQge1xuICAgIFBvc2l0aW9uQ29tcG9uZW50LFxuICAgIFZlbG9jaXR5Q29tcG9uZW50LFxuICAgIElucHV0Q29tcG9uZW50LFxuICAgIFJlbmRlcmFibGVDb21wb25lbnQsXG4gICAgUGxheWVyQ29tcG9uZW50LFxuICAgIEJvbWJDb21wb25lbnRcbn0gZnJvbSAnLi9jb21wb25lbnRzLmpzJztcbmltcG9ydCB7IG1vdmVtZW50U3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL21vdmVtZW50U3lzdGVtLmpzJztcbmltcG9ydCB7IHJlbmRlclN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgYm9tYlN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9ib21iU3lzdGVtLmpzJztcbmltcG9ydCB7IGRhbWFnZVN5c3RlbSwgY2hlY2tHYW1lRW5kQ29uZGl0aW9ucywgc3Bhd25IZWFydFBvd2VyVXAgfSBmcm9tICcuL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzJztcbmltcG9ydCBXaW5NZW51IGZyb20gJy4uL3BhZ2VzL1dpbk1lbnUuanN4JztcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJy4uLy4uL21pbmktZnJhbWV3b3JrL2RvbS5qcyc7XG5cbmltcG9ydCB7IHBvd2VyVXBTeXN0ZW0sIHNwYXduUG93ZXJVcCB9IGZyb20gJy4vc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzJztcbmltcG9ydCB7IHNldEJvbWJzLCBzZXRMaXZlcywgc2V0UmFuZ2UsIHNldFNwZWVkIH0gZnJvbSAnLi4vcGFnZXMvZ2FtZSc7XG5cbmNvbnN0IFRJTEVfU0laRSA9IDY0O1xuY29uc3QgQU5JTUFUSU9OX1JPV1MgPSB7XG4gICAgUlVOOiB7IHVwOiAzOCwgbGVmdDogMzksIGRvd246IDQwLCByaWdodDogNDEgfSxcbiAgICBJRExFOiB7IHVwOiAyMiwgbGVmdDogMjMsIGRvd246IDI0LCByaWdodDogMjUgfVxufTtcblxuZXhwb3J0IGNsYXNzIEdhbWVFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0NvbnRhaW5lciwgbWFwRGF0YSwgc29ja2V0KSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY2FudmFzQ29udGFpbmVyO1xuICAgICAgICB0aGlzLm1hcERhdGEgPSBtYXBEYXRhO1xuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xuICAgICAgICB0aGlzLmxvY2FsUGxheWVyRW50aXR5ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJJbmZvID0gbmV3IE1hcCgpOyAvLyBTdG9yZSBvcmlnaW5hbCBwbGF5ZXIgZGF0YSBsaWtlIG5pY2tuYW1lXG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgLy8gU3RhdGUgZmxhZyB0byBwcmV2ZW50IG11bHRpcGxlIGxvc3MgbW9kYWwgcmVuZGVycyAoVGhlIExvb3AgVHJhcCBmaXgpXG4gICAgICAgIHRoaXMubG9zc01vZGFsVHJpZ2dlcmVkID0gZmFsc2U7XG4gICAgICAgIC8vIEZsYWcgdG8gdHJhY2sgaWYgaW5wdXQgc2hvdWxkIGJlIGRpc2FibGVkXG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gRmxhZyB0byBzdG9wIHRoZSBnYW1lIGxvb3Agb25jZSBhIHdpbm5lciBpcyBkZWNpZGVkXG4gICAgICAgIHRoaXMuZ2FtZUVuZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdChsb2NhbFBsYXllcklkLCBhbGxQbGF5ZXJzKSB7XG4gICAgICAgIHRoaXMudG90YWxQbGF5ZXJzID0gYWxsUGxheWVycy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkID0gU3RyaW5nKGxvY2FsUGxheWVySWQpO1xuXG4gICAgICAgIGFsbFBsYXllcnMuZm9yRWFjaChwRGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IFN0cmluZyhwRGF0YS5pZCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJJbmZvLnNldChwbGF5ZXJJZCwgcERhdGEpOyAvLyBTdG9yZSBvcmlnaW5hbCBwbGF5ZXIgZGF0YVxuICAgICAgICAgICAgY29uc3QgcGxheWVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgICAgIGlmIChwRGF0YS5kaXNjb25uZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcERhdGEuY29sb3IgfHwgXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gYHBsYXllciBwbGF5ZXItJHtjb2xvcn1gO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS56SW5kZXggPSAnMTAnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckRpdik7XG5cbiAgICAgICAgICAgIGNvbnN0IHN4ID0gcERhdGEueCB8fCAxO1xuICAgICAgICAgICAgY29uc3Qgc3kgPSBwRGF0YS55IHx8IDE7XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJywgUG9zaXRpb25Db21wb25lbnQoc3gsIHN5LCBUSUxFX1NJWkUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5JywgVmVsb2NpdHlDb21wb25lbnQoMi41KSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJywgUmVuZGVyYWJsZUNvbXBvbmVudChwbGF5ZXJEaXYsIDY0LCA2NCwgNCwgMTIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpc0xvY2FsID0gcGxheWVySWQgPT09IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IFBsYXllckNvbXBvbmVudChwbGF5ZXJJZCwgY29sb3IsIGlzTG9jYWwpO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5saXZlcyA9IDM7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLm1heEJvbWJzID0gMTtcbiAgICAgICAgICAgIHBsYXllckNvbXAuYm9tYlJhbmdlID0gNDtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicsIHBsYXllckNvbXApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcy5zZXQocGxheWVySWQsIHBsYXllckVudGl0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc0xvY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcsIElucHV0Q29tcG9uZW50KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMocGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltHYW1lRW5naW5lXSBMb2NhbCBwbGF5ZXIgd2FzIG5vdCBmb3VuZFwiLCB7XG4gICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXJJZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzOiBhbGxQbGF5ZXJzLm1hcChwbGF5ZXIgPT4gcGxheWVyLmlkKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlclN5c3RlbXMoKTtcblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5vdykgPT4gdGhpcy5nYW1lTG9vcChub3cpKTtcbiAgICB9XG5cbiAgICBzZXR1cElucHV0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZ2V0S2V5RGlyZWN0aW9uID0gKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93VXAnIHx8IGtleSA9PT0gJ3cnIHx8IGtleSA9PT0gJ1onIHx8IGtleSA9PT0gJ3onKSByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93TGVmdCcgfHwga2V5ID09PSAnYScgfHwga2V5ID09PSAnUScgfHwga2V5ID09PSAncScpIHJldHVybiAnbGVmdCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dSaWdodCcgfHwga2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpIHJldHVybiAncmlnaHQnO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgICAgICAgICAvLyBJTlBVVCBESVNBQkxFRDogSW1tZWRpYXRlbHkgaWdub3JlIGFsbCBrZXlib2FyZCBpbnB1dHMgd2hlbiBwbGF5ZXIgaXMgZGVhZFxuICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0RW5hYmxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlLnVuc2hpZnQoZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICAgICAgLy8gSU5QVVQgRElTQUJMRUQ6IEltbWVkaWF0ZWx5IGlnbm9yZSBhbGwga2V5Ym9hcmQgaW5wdXRzIHdoZW4gcGxheWVyIGlzIGRlYWRcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dEVuYWJsZWQpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkcm9wQm9tYigpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRCb21icyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5maWx0ZXIoYkVudGl0eSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoYkVudGl0eSwgJ0JvbWInKS5vd25lcklkID09PSBwbGF5ZXIuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjdXJyZW50Qm9tYnMubGVuZ3RoID49IHBsYXllci5tYXhCb21icykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUJvbWIocGxheWVyLmlkLCBwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgcGxheWVyLmJvbWJSYW5nZSk7XG4gICAgICAgIGlmICghY3JlYXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0RST1BfQk9NQicsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZDogcGxheWVyLmlkLCB4OiBwb3MuZ3JpZFgsIHk6IHBvcy5ncmlkWSwgcmFuZ2U6IHBsYXllci5ib21iUmFuZ2UgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiBib21iLm93bmVySWQgPT09IG93bmVySWQgJiYgcG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuZWwgPSBib21iRGl2O1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicsIGJvbWJDb21wKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlTW92ZShwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW2hhbmRsZVJlbW90ZU1vdmVdIEludmFsaWQgcGF5bG9hZDpcIiwgcGF5bG9hZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBFbnRpdHkgbm90IGZvdW5kIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfS4gQXZhaWxhYmxlIHBsYXllcnM6YCwgQXJyYXkuZnJvbSh0aGlzLnBsYXllckVudGl0aWVzLmtleXMoKSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtoYW5kbGVSZW1vdGVNb3ZlXSBJZ25vcmluZyBsb2NhbCBwbGF5ZXIgdXBkYXRlIGZvciAke3BheWxvYWQuaWR9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwb3MgfHwgIXZlbCB8fCAhcmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gVXBkYXRpbmcgcGxheWVyICR7cGF5bG9hZC5pZH0gdG8gKCR7cGF5bG9hZC5ncmlkWH0sICR7cGF5bG9hZC5ncmlkWX0pYCk7XG4gICAgICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgICAgICBwb3MuZ3JpZFggPSBwYXlsb2FkLmdyaWRYO1xuICAgICAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgICAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwYXlsb2FkLnk7XG4gICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZUJvbWIocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDQpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgcGF5bG9hZC54ID09PSB1bmRlZmluZWQgfHwgcGF5bG9hZC55ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnJlbW92ZVBvd2VyVXBBdChwYXlsb2FkLngsIHBheWxvYWQueSk7XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkIHx8IGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYXBwbHlQb3dlclVwKGVudGl0eSwgcGF5bG9hZC50eXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHJlbW90ZSBoZWFydCBwaWNrdXAgLSB1cGRhdGVzIHBsYXllciBsaXZlcyBhbmQgVUkgb24gYWxsIGNsaWVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIHsgcGxheWVySWQsIG5ld0xpdmVzIH1cbiAgICAgKi9cbiAgICBoYW5kbGVSZW1vdGVJdGVtUGlja3VwKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLnBsYXllcklkIHx8IHBheWxvYWQubmV3TGl2ZXMgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIDQuIEVuc3VyZSB3ZSBkZXN0cm95IHRoZSBoZWFydCBlbnRpdHkgZnJvbSB0aGUgcmVtb3RlIGNsaWVudHMnIHNjcmVlbnNcbiAgICAgICAgaWYgKHBheWxvYWQueCAhPT0gdW5kZWZpbmVkICYmIHBheWxvYWQueSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVBvd2VyVXBBdChwYXlsb2FkLngsIHBheWxvYWQueSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAxLiBGaW5kIHRoZSBwbGF5ZXIgZW50aXR5IHVzaW5nIHRoZSBwYXlsb2FkJ3MgcGxheWVySWRcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQucGxheWVySWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcGxheWVyKSByZXR1cm47XG5cbiAgICAgICAgLy8gMi4gRG8gTk9UIGFkZCArMS4gU3RyaWN0bHkgU0VUIHRoZSBzdGF0ZSB1c2luZyB0aGUgcGF5bG9hZFxuICAgICAgICBwbGF5ZXIubGl2ZXMgPSBwYXlsb2FkLm5ld0xpdmVzO1xuXG4gICAgICAgIC8vIDMuIFVwZGF0ZSB0aGUgSFVEL1VJIGV4cGxpY2l0bHkgd2l0aCBtZXNzYWdlLnBheWxvYWQubmV3TGl2ZXNcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyhlbnRpdHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coYFtSZW1vdGUgSXRlbSBQaWNrdXBdIFBsYXllciAke3BheWxvYWQucGxheWVySWR9IHBpY2tlZCB1cCBoZWFydC4gTmV3IGxpdmVzOiAke3BheWxvYWQubmV3TGl2ZXN9YCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlUG93ZXJVcEF0KGdyaWRYLCBncmlkWSkge1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7Z3JpZFh9LCR7Z3JpZFl9YCk7XG4gICAgICAgIGNvbnN0IHBvd2VyVXBzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcG93ZXJVcCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghcG9zIHx8ICFwb3dlclVwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWSkge1xuICAgICAgICAgICAgICAgIHBvd2VyVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBvd2VyVXAuZWwgJiYgcG93ZXJVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvd2VyVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3dlclVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmRlc3Ryb3lFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseVBvd2VyVXAoZW50aXR5LCB0eXBlKSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICB2ZWxvY2l0eS5zcGVlZCA9IE1hdGgubWluKHZlbG9jaXR5LnNwZWVkICsgMSwgOCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0ZMQU1FJykge1xuICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0hFQVJUJykge1xuICAgICAgICAgICAgLy8gSEVBUlQgcG93ZXItdXA6IGluY3JlbWVudCBsaXZlcyAoY2FwIGF0IDMpXG4gICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSBNYXRoLm1pbigocGxheWVyLmxpdmVzIHx8IDApICsgMSwgMyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWdpc3RlclN5c3RlbXMoKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZU1hcENlbGwgPSAoeCwgeSwgbmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXBEYXRhW3ldKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubWFwRGF0YVt5XVt4XSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWApO1xuICAgICAgICAgICAgaWYgKCF0aWxlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRpbGUuY2xhc3NOYW1lID0gJ3RpbGUgdGlsZS1mbG9vcic7XG4gICAgICAgICAgICB0aWxlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIpJztcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkZXN0cm95Qm94Q2FsbGJhY2sgPSAoeCwgeSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xhaW1lZFBvd2VyVXBzLmhhcyhgJHt4fSwke3l9YCkpIHJldHVybjtcbiAgICAgICAgICAgIHNwYXduUG93ZXJVcCh0aGlzLndvcmxkLCB4LCB5LCB0aGlzLmNvbnRhaW5lciwgVElMRV9TSVpFKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBsYXllckh1cnQgPSAoZW50aXR5LCBpZCwgcmVtYWluaW5nTGl2ZXMpID0+IHtcbiAgICAgICAgICAgIC8vIENSSVRJQ0FMOiBPbmx5IHNlbmQgcGxheWVyX2RpZWQgaWYgVEhJUyBJUyBUSEUgTE9DQUwgUExBWUVSLlxuICAgICAgICAgICAgLy8gVGhlIEVDUyBkYW1hZ2VTeXN0ZW0gcnVucyBvbiBBTEwgY2xpZW50cywgc28gZXZlcnkgY2xpZW50IGRldGVjdHNcbiAgICAgICAgICAgIC8vIGV2ZXJ5IGNvbGxpc2lvbi4gV2UgbXVzdCBndWFyZCB0aGUgV2ViU29ja2V0IG1lc3NhZ2UgdG8gcHJldmVudFxuICAgICAgICAgICAgLy8gaW5jb3JyZWN0IGRlYXRoIHJlcG9ydHMuXG4gICAgICAgICAgICBpZiAocmVtYWluaW5nTGl2ZXMgPD0gMCAmJiBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgJiYgdGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BsYXllcl9kaWVkJ1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgSFVEIG9ubHkgZm9yIHRoZSBsb2NhbCBwbGF5ZXIuXG4gICAgICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICAgICAgc2V0TGl2ZXMocmVtYWluaW5nTGl2ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUG93ZXJVcFBpY2tlZCA9IChpZCwgdHlwZSwgeCwgeSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMuYWRkKGAke3h9LCR7eX1gKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKGlkKSk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJDb21wID0gZW50aXR5ID8gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJykgOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ0hFQVJUJykge1xuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXJDb21wICYmIGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRMaXZlcyhwbGF5ZXJDb21wLmxpdmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXJDb21wICYmIGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUgPT09ICdIRUFSVCcgPyAnSVRFTV9QSUNLVVAnIDogJ1BPV0VSVVBfUElDS0VEJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogdHlwZSA9PT0gJ0hFQVJUJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyB7IHBsYXllcklkOiBpZCwgbmV3TGl2ZXM6IHBsYXllckNvbXAgPyBwbGF5ZXJDb21wLmxpdmVzIDogMCwgeCwgeSB9XG4gICAgICAgICAgICAgICAgICAgICAgICA6IHsgaWQsIHR5cGUsIHgsIHkgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLndvcmxkLmJyb2FkY2FzdE1vdmVtZW50ID0gKGVudGl0eSwgeCwgeSwgZ3JpZFgsIGdyaWRZLCBkaXJlY3Rpb24sIGlzTW92aW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIGlmICghcGxheWVyIHx8ICF0aGlzLnNvY2tldCB8fCB0aGlzLnNvY2tldC5yZWFkeVN0YXRlICE9PSBXZWJTb2NrZXQuT1BFTikgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnTU9WRV9TVEFURScsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICAgICAgICBpZDogcGxheWVyLmlkLFxuICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICBncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgaXNNb3ZpbmcsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBpc01vdmluZyA/ICdSVU4nIDogJ0lETEUnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gbW92ZW1lbnRTeXN0ZW0odywgZHQsIG5vdywgdGhpcy5tYXBEYXRhLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGJvbWJTeXN0ZW0odywgZHQsIG5vdywgdGhpcy5tYXBEYXRhLCB1cGRhdGVNYXBDZWxsLCBkZXN0cm95Qm94Q2FsbGJhY2ssIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gZGFtYWdlU3lzdGVtKHRoaXMud29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCB0aGlzLmxvY2FsUGxheWVyRW50aXR5LCBUSUxFX1NJWkUsIHRoaXMuc29ja2V0KSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBwb3dlclVwU3lzdGVtKHcsIG9uUG93ZXJVcFBpY2tlZCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcmVuZGVyU3lzdGVtKHcsIGR0LCBub3csIEFOSU1BVElPTl9ST1dTKSk7XG4gICAgfVxuXG4gICAgZ2FtZUxvb3Aobm93KSB7XG4gICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZHQgPSBub3cgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gbm93O1xuICAgICAgICB0aGlzLndvcmxkLnVwZGF0ZShkdCwgbm93KTtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChuZXh0Tm93KSA9PiB0aGlzLmdhbWVMb29wKG5leHROb3cpKTtcbiAgICB9XG5cbiAgICBoYW5kbGVHYW1lT3Zlcih3aW5uZXJOYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmdhbWVFbmRlZCkgcmV0dXJuOyAvLyBQcmV2ZW50IG11bHRpcGxlIHRyaWdnZXJzXG4gICAgICAgIHRoaXMuZ2FtZUVuZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG5cbiAgICAgICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gJ21lbnUtcGFnZSc7XG4gICAgICAgIHJlbmRlcig8V2luTWVudSB3aW5uZXJOYW1lPXt3aW5uZXJOYW1lfSAvPiwgcm9vdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGdhbWUgZW5kIGNvbmRpdGlvbnMgd2l0aCBwcm9wZXIgc3RhdGUgZmxhZyBtYW5hZ2VtZW50LlxuICAgICAqIFByZXZlbnRzIHRoZSBcIkxvb3AgVHJhcFwiIC0gbW9kYWwgaXMgb25seSByZW5kZXJlZCBPTkNFIHdoZW4gbGl2ZXMgcmVhY2ggMC5cbiAgICAgKiBBbHNvIGRpc2FibGVzIGlucHV0IGltbWVkaWF0ZWx5IHdoZW4gcGxheWVyIGRpZXMuXG4gICAgICovXG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlSHVkU3RhdHMoZW50aXR5KSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIHNldEJvbWJzKHBsYXllci5tYXhCb21icyB8fCAxKTtcbiAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzID8/IDMpO1xuICAgICAgICBzZXRSYW5nZShwbGF5ZXIuYm9tYlJhbmdlIHx8IDQpO1xuICAgICAgICBzZXRTcGVlZChNYXRoLnJvdW5kKHZlbG9jaXR5LnNwZWVkKSk7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IFwiXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKG5hbWUpIHtcbiAgICBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gbmFtZTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiLCBuYW1lKTtcbiAgICBjb25zb2xlLmxvZyhcIlBsYXllciByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVwiLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXllck5hbWUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgfHwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIikgfHwgXCJQbGF5ZXJcIjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBib21iU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB1cGRhdGVNYXBDZWxsLCBkZXN0cm95Qm94Q2FsbGJhY2ssIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBib21icyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBib21iRW50aXR5IG9mIGJvbWJzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgYm9tYiA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicpO1xuICAgICAgICBcbiAgICAgICAgYm9tYi50aW1lciAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChib21iLnRpbWVyIDw9IDAgJiYgIWJvbWIuZXhwbG9kZWQpIHtcbiAgICAgICAgICAgIGJvbWIuZXhwbG9kZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBhZmZlY3RlZENlbGxzID0gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMocG9zLmdyaWRYLCBwb3MuZ3JpZFksIGJvbWIucmFuZ2UsIG1hcERhdGEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhZmZlY3RlZENlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgZXhwRGl2LmNsYXNzTmFtZSA9ICdleHBsb3Npb24nO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmxlZnQgPSBgJHtjZWxsLnggKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnRvcCA9IGAke2NlbGwueSAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuekluZGV4ID0gJzcnO1xuXG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFg6IGNlbGwueCwgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZOiBjZWxsLnksIFxuICAgICAgICAgICAgICAgICAgICB4OiBjZWxsLnggKiB0aWxlU2l6ZSwgXG4gICAgICAgICAgICAgICAgICAgIHk6IGNlbGwueSAqIHRpbGVTaXplIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nLCB7IGR1cmF0aW9uOiA1MDAsIGVsOiBleHBEaXYgfSk7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGV4cERpdik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG1hcERhdGFbY2VsbC55XSAmJiBtYXBEYXRhW2NlbGwueV1bY2VsbC54XSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNYXBDZWxsKGNlbGwueCwgY2VsbC55LCAyKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXN0cm95Qm94Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lCb3hDYWxsYmFjayhjZWxsLngsIGNlbGwueSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGJvbWIuZWwgJiYgYm9tYi5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJvbWIuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShib21iRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgY29uc3QgZXhwID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicpO1xuICAgICAgICBleHAuZHVyYXRpb24gLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoZXhwLmR1cmF0aW9uIDw9IDApIHtcbiAgICAgICAgICAgIGlmIChleHAuZWwgJiYgZXhwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBleHAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChleHAuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShleHBFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhieCwgYnksIHJhbmdlLCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbHMgPSBbeyB4OiBieCwgeTogYnkgfV07XG4gICAgY29uc3QgZGlyZWN0aW9ucyA9IFtcbiAgICAgICAgeyB4OiAwLCB5OiAtMSB9LFxuICAgICAgICB7IHg6IDAsIHk6IDEgfSxcbiAgICAgICAgeyB4OiAtMSwgeTogMCB9LFxuICAgICAgICB7IHg6IDEsIHk6IDAgfVxuICAgIF07XG4gICAgXG4gICAgY29uc3Qgc3RlcHMgPSByYW5nZSAtIDE7IFxuICAgIFxuICAgIGRpcmVjdGlvbnMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0eCA9IGJ4ICsgKGRpci54ICogaSk7XG4gICAgICAgICAgICBjb25zdCB0eSA9IGJ5ICsgKGRpci55ICogaSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghbWFwRGF0YVt0eV0gfHwgbWFwRGF0YVt0eV1bdHhdID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjZWxsVHlwZSA9IG1hcERhdGFbdHldW3R4XTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNlbGxzLnB1c2goeyB4OiB0eCwgeTogdHkgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGNlbGxzO1xufVxuIiwiLyoqXG4gKiBTcGF3bnMgYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIHNwZWNpZmllZCBncmlkIGNvb3JkaW5hdGVzLlxuICogVGhpcyBjcmVhdGVzIGEgcHJvcGVyIEVDUyBlbnRpdHkgd2l0aCBQb3NpdGlvbiwgUG93ZXJVcCwgYW5kIFJlbmRlcmFibGUgY29tcG9uZW50cy5cbiAqIFxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IGdyaWRYIC0gR3JpZCBYIGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBncmlkWSAtIEdyaWQgWSBjb29yZGluYXRlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLSBUaGUgZ2FtZSBjb250YWluZXIgZWxlbWVudFxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3Bhd25IZWFydFBvd2VyVXAod29ybGQsIGdyaWRYLCBncmlkWSwgY29udGFpbmVyLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgLy8gQ3JlYXRlIGEgbmV3IGVudGl0eSBmb3IgdGhlIGhlYXJ0IHBvd2VyLXVwXG4gICAgY29uc3QgaGVhcnRFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICBcbiAgICAvLyBBZGQgUG9zaXRpb24gY29tcG9uZW50XG4gICAgd29ybGQuYWRkQ29tcG9uZW50KGhlYXJ0RW50aXR5LCAnUG9zaXRpb24nLCB7XG4gICAgICAgIGdyaWRYOiBncmlkWCxcbiAgICAgICAgZ3JpZFk6IGdyaWRZLFxuICAgICAgICB4OiBncmlkWCAqIHRpbGVTaXplLFxuICAgICAgICB5OiBncmlkWSAqIHRpbGVTaXplXG4gICAgfSk7XG4gICAgXG4gICAgLy8gQWRkIFBvd2VyVXAgY29tcG9uZW50IHdpdGggdHlwZSAnSEVBUlQnXG4gICAgd29ybGQuYWRkQ29tcG9uZW50KGhlYXJ0RW50aXR5LCAnUG93ZXJVcCcsIHtcbiAgICAgICAgdHlwZTogJ0hFQVJUJyxcbiAgICAgICAgcGlja2VkVXA6IGZhbHNlLFxuICAgICAgICBlbDogbnVsbCAgLy8gV2lsbCBiZSBzZXQgYWZ0ZXIgY3JlYXRpbmcgdGhlIERPTSBlbGVtZW50XG4gICAgfSk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIHRoZSBET00gZWxlbWVudCBmb3IgcmVuZGVyaW5nXG4gICAgY29uc3QgaGVhcnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFydERpdi5jbGFzc05hbWUgPSAncG93ZXJ1cCBwb3dlcnVwLWhlYXJ0JztcbiAgICBoZWFydERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgaGVhcnREaXYuc3R5bGUubGVmdCA9IGAke2dyaWRYICogdGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnRvcCA9IGAke2dyaWRZICogdGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmFsaWduSXRlbXMgPSAnY2VudGVyJztcbiAgICBoZWFydERpdi5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmZvbnRTaXplID0gJzMycHgnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICBoZWFydERpdi50ZXh0Q29udGVudCA9ICfinaTvuI8nO1xuICAgIFxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChoZWFydERpdik7XG4gICAgXG4gICAgLy8gVXBkYXRlIHRoZSBQb3dlclVwIGNvbXBvbmVudCB3aXRoIHRoZSBET00gZWxlbWVudCByZWZlcmVuY2VcbiAgICBjb25zdCBwb3dlclVwID0gd29ybGQuZ2V0Q29tcG9uZW50KGhlYXJ0RW50aXR5LCAnUG93ZXJVcCcpO1xuICAgIGlmIChwb3dlclVwKSB7XG4gICAgICAgIHBvd2VyVXAuZWwgPSBoZWFydERpdjtcbiAgICB9XG4gICAgXG4gICAgY29uc29sZS5sb2coYFtIZWFydCBEcm9wXSBTcGF3bmVkIEhFQVJUIHBvd2VyLXVwIGF0ICgke2dyaWRYfSwgJHtncmlkWX0pYCk7XG59XG5cbi8qKlxuICogSGFuZGxlcyBwbGF5ZXIgZGVhdGggdHJhbnNpdGlvbiB3aGVuIGxpdmVzIHJlYWNoIDAuXG4gKiBSZW1vdmVzIHRoZSBwbGF5ZXIncyBET00gZWxlbWVudCBhbmQgc3Bhd25zIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBkZWF0aCBsb2NhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gcGxheWVyRW50aXR5IC0gVGhlIGVudGl0eSBJRCBvZiB0aGUgZHlpbmcgcGxheWVyXG4gKiBAcGFyYW0ge251bWJlcn0gdGlsZVNpemUgLSBUaGUgc2l6ZSBvZiBlYWNoIGdyaWQgdGlsZSAoZGVmYXVsdDogNjQpXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLSBUaGUgZ2FtZSBjb250YWluZXIgZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgY29udGFpbmVyID0gbnVsbCkge1xuICAgIC8vIEdldCB0aGUgcGxheWVyJ3MgY29tcG9uZW50c1xuICAgIGNvbnN0IHBvc2l0aW9uID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgaWYgKCFwb3NpdGlvbiB8fCAhcmVuZGVyYWJsZSB8fCAhcGxheWVyKSByZXR1cm47XG5cbiAgICAvLyBTdG9yZSB0aGUgZ3JpZCBjb29yZGluYXRlcyB3aGVyZSB0aGUgcGxheWVyIGRpZWRcbiAgICBjb25zdCBkZWF0aEdyaWRYID0gTWF0aC5mbG9vcigocG9zaXRpb24ueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgY29uc3QgZGVhdGhHcmlkWSA9IE1hdGguZmxvb3IoKHBvc2l0aW9uLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuXG4gICAgLy8gQ1JJVElDQUw6IFJlbW92ZSB0aGUgcGxheWVyJ3MgRE9NIGVsZW1lbnQgZnJvbSB0aGUgZG9jdW1lbnQgQkVGT1JFIHJlbW92aW5nIHRoZSBSZW5kZXJhYmxlIGNvbXBvbmVudC5cbiAgICAvLyBUaGlzIGVuc3VyZXMgdGhlIGRlYWQgcGxheWVyIHZpc3VhbGx5IGRpc2FwcGVhcnMgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHJlbmRlcmFibGUuZWwgJiYgcmVuZGVyYWJsZS5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChyZW5kZXJhYmxlLmVsKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgY29tcG9uZW50cyB0aGF0IGVuYWJsZSBpbnRlcmFjdGlvbiBhbmQgcmVuZGVyaW5nLlxuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgd29ybGQucmVtb3ZlQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgd29ybGQucmVtb3ZlQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ0lucHV0Jyk7XG4gICAgLy8gV2Uga2VlcCBQb3NpdGlvbiBhbmQgUGxheWVyIGNvbXBvbmVudHMgdG8ga25vdyB3aGVyZSB0aGV5IHdlcmUuXG5cbiAgICAvLyBTcGF3biBhIEhFQVJUIHBvd2VyLXVwIGVudGl0eSBhdCB0aGUgZGVhdGggbG9jYXRpb24gKHByb3BlciBFQ1MgZW50aXR5KVxuICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBjb250YWluZXIgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgc3Bhd25IZWFydFBvd2VyVXAod29ybGQsIGRlYXRoR3JpZFgsIGRlYXRoR3JpZFksIGdhbWVDb250YWluZXIsIHRpbGVTaXplKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgW1BsYXllciBEZWF0aF0gUGxheWVyICR7cGxheWVyLmlkfSBkaWVkIGF0ICgke2RlYXRoR3JpZFh9LCAke2RlYXRoR3JpZFl9KS4gSGVhcnQgcG93ZXItdXAgZHJvcHBlZC5gKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhbWFnZVN5c3RlbSh3b3JsZCwgbm93LCBvblBsYXllckh1cnQsIGxvY2FsUGxheWVyRW50aXR5LCB0aWxlU2l6ZSA9IDY0LCBzb2NrZXQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1BsYXllcicpO1xuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChwbGF5ZXIuaW52aW5jaWJsZVVudGlsICYmIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPiBub3cpIGNvbnRpbnVlO1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICAgICAgY29uc3QgZVBvcyA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHcmlkLWJhc2VkIGNvbGxpc2lvblxuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFggPSBNYXRoLmZsb29yKChwUG9zLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFkgPSBNYXRoLmZsb29yKChwUG9zLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuXG4gICAgICAgICAgICBpZiAocGxheWVyR3JpZFggPT09IGVQb3MuZ3JpZFggJiYgcGxheWVyR3JpZFkgPT09IGVQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c0xpdmVzID0gcGxheWVyLmxpdmVzID8/IDM7XG4gICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5tYXgocHJldmlvdXNMaXZlcyAtIDEsIDApO1xuICAgICAgICAgICAgICAgIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPSBub3cgKyAxNTAwO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgaXMgZGVhZCwgcmVwb3J0IGRlYXRoIE9OQ0UgdXNpbmcgZ3VhcmQgY2xhdXNlXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5saXZlcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuYWxyZWFkeVJlcG9ydGVkRGVhZCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5hbHJlYWR5UmVwb3J0ZWREZWFkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAob25QbGF5ZXJIdXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblBsYXllckh1cnQocGxheWVyRW50aXR5LCBwbGF5ZXIuaWQsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBQbGF5ZXIgc3RpbGwgYWxpdmUsIHJlcG9ydCBub3JtYWwgZGFtYWdlXG4gICAgICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUGxheWVySHVydChwbGF5ZXJFbnRpdHksIHBsYXllci5pZCwgcGxheWVyLmxpdmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBCcmVhayB0aGUgbG9vcCBzaW5jZSB0aGUgcGxheWVyIGhhcyBhbHJlYWR5IHRha2VuIGRhbWFnZSBmcm9tIHRoaXMgZXhwbG9zaW9uLlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImV4cG9ydCBmdW5jdGlvbiBtb3ZlbWVudFN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdGlsZVNpemUgPSA0MCkge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5Jyk7XG4gICAgY29uc3QgZGVsdGEgPSBkdCAvIDE2LjY3O1xuXG4gICAgY29uc3QgUExBWUVSX1NJWkUgPSB0aWxlU2l6ZTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgY29uc3QgYmVoYXZpb3IgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQmVoYXZpb3InKTtcblxuICAgICAgICBpZiAoYmVoYXZpb3IpIHtcbiAgICAgICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQgKyAoYmVoYXZpb3IuZmFzdFNob2VzTGV2ZWwgLSAxKSAqIDAuNTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUlucHV0ID0gaW5wdXQuaW5wdXRRdWV1ZVswXTtcbiAgICAgICAgbGV0IGR4ID0gMDtcbiAgICAgICAgbGV0IGR5ID0gMDtcblxuICAgICAgICBpZiAoYWN0aXZlSW5wdXQgPT09ICd1cCcpIHtcbiAgICAgICAgICAgIGR5ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3VwJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2Rvd24nKSB7XG4gICAgICAgICAgICBkeSA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2Rvd24nO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIGR4ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICBkeCA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3JpZ2h0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhc0lucHV0ID0gZHggIT09IDAgfHwgZHkgIT09IDA7XG5cbiAgICAgICAgaWYgKCFoYXNJbnB1dCkge1xuICAgICAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG4gICAgICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ0lETEUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WSA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBjb25zdCBzbmFwVGhyZXNob2xkID0gMzI7XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmIGR4ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKHBvcy54LCBuZXh0WSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWCA9IE1hdGguZmxvb3IoKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRYID0gY3VycmVudFRpbGVYICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlggPSBwb3MueCAtIHRhcmdldFg7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlgpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gLU1hdGguc2lnbihkaWZmWCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmIGR5ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKG5leHRYLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWSA9IE1hdGguZmxvb3IoKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRZID0gY3VycmVudFRpbGVZICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlkgPSBwb3MueSAtIHRhcmdldFk7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlkpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gLU1hdGguc2lnbihkaWZmWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFhBZnRlclNuYXAgPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZQWZ0ZXJTbmFwID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiAhaXNCbG9ja2VkKG5leHRYQWZ0ZXJTbmFwLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnggPSBuZXh0WEFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiAhaXNCbG9ja2VkKHBvcy54LCBuZXh0WUFmdGVyU25hcCwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnkgPSBuZXh0WUFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlbC5pc01vdmluZyA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ1JVTic7XG4gICAgICAgIH1cblxuICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG5cbiAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpIHtcbiAgICBjb25zdCBzdGVwID0gdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICBpZiAocG9zLnggPCBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWluKHBvcy54ICsgc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH0gZWxzZSBpZiAocG9zLnggPiBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWF4KHBvcy54IC0gc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH1cblxuICAgIGlmIChwb3MueSA8IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5taW4ocG9zLnkgKyBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfSBlbHNlIGlmIChwb3MueSA+IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5tYXgocG9zLnkgLSBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfVxuXG4gICAgdmVsLmlzTW92aW5nID1cbiAgICAgICAgcG9zLnggIT09IHBvcy50YXJnZXRYIHx8XG4gICAgICAgIHBvcy55ICE9PSBwb3MudGFyZ2V0WTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkKHgsIHksIG1hcERhdGEsIHRpbGVTaXplLCBwbGF5ZXJTaXplID0gdGlsZVNpemUpIHtcbiAgICBjb25zdCBwYWRkaW5nID0gNDtcblxuICAgIGNvbnN0IGxlZnQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgcmlnaHQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHRvcCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCBib3R0b20gPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgYm90dG9tLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCBib3R0b20sIG1hcERhdGEpXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkQ2VsbCh4LCB5LCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbCA9IG1hcERhdGFbeV0gJiYgbWFwRGF0YVt5XVt4XTtcblxuICAgIHJldHVybiBjZWxsICE9PSAwICYmIGNlbGwgIT09IDI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcG93ZXJVcFN5c3RlbSh3b3JsZCwgb25Qb3dlclVwUGlja2VkKSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdQbGF5ZXInKTtcbiAgICBjb25zdCBwb3dlclVwcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKCFwUG9zIHx8ICF2ZWwgfHwgIXBsYXllcikgY29udGludWU7XG5cbiAgICAgICAgZm9yIChjb25zdCBwVXBFbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwVXAgPSB3b3JsZC5nZXRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCF1cFBvcyB8fCAhcFVwIHx8IHBVcC5waWNrZWRVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIC8vIEdyaWQtYmFzZWQgY29sbGlzaW9uOiBwbGF5ZXIgZ3JpZCBwb3NpdGlvbiBtYXRjaGVzIHBvd2VyLXVwIGdyaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIChwUG9zLmdyaWRYID09PSB1cFBvcy5ncmlkWCAmJiBwUG9zLmdyaWRZID09PSB1cFBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIHBVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgZGlmZmVyZW50IHBvd2VyLXVwIHR5cGVzXG4gICAgICAgICAgICAgICAgaWYgKHBVcC50eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlbC5zcGVlZCA9IE1hdGgubWluKHZlbC5zcGVlZCArIDEsIDgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5saXZlcyArPSAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcG93ZXItdXAncyBET00gZWxlbWVudCBmcm9tIHRoZSBzY3JlZW5cbiAgICAgICAgICAgICAgICBpZiAocFVwLmVsICYmIHBVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gTm90aWZ5IGdhbWUuanMgdmlhIGNhbGxiYWNrIChoYW5kbGVzIEhVRCB1cGRhdGUgKyBzZXJ2ZXIgc3luYylcbiAgICAgICAgICAgICAgICAvLyBDUklUSUNBTDogVGhpcyB0cmlnZ2VycyB1cGRhdGVIdWRTdGF0cywgTk9UIG9uUGxheWVySHVydFxuICAgICAgICAgICAgICAgIGlmIChvblBvd2VyVXBQaWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb25Qb3dlclVwUGlja2VkKHBsYXllci5pZCwgcFVwLnR5cGUsIHVwUG9zLmdyaWRYLCB1cFBvcy5ncmlkWSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRGVzdHJveSB0aGUgcG93ZXItdXAgZW50aXR5IGZyb20gdGhlIHdvcmxkIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShwVXBFbnRpdHkpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbSEVBUlQgREVTVFJPWUVEXSBIZWFydCBlbnRpdHkgcmVtb3ZlZCBmcm9tIHdvcmxkIGF0ICgke3VwUG9zLmdyaWRYfSwgJHt1cFBvcy5ncmlkWX0pYCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGF3blBvd2VyVXAod29ybGQsIGd4LCBneSwgY29udGFpbmVyLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3Qgc2VlZCA9IGd4ICogNzM4NTYwOTMgXiBneSAqIDE5MzQ5NjYzO1xuICAgIGNvbnN0IHNlZWRSYW5kb20gPSAoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCkgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQpICogMTAwMDApO1xuICAgIFxuICAgIGlmIChzZWVkUmFuZG9tID4gMC4zNSkgcmV0dXJuO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbJ1NQRUVEJywgJ0JPTUJTJywgJ0ZMQU1FJ107XG4gICAgY29uc3QgdHlwZUluZGV4ID0gTWF0aC5mbG9vcigoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDAgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwKSkgKiB0eXBlcy5sZW5ndGgpO1xuICAgIGNvbnN0IHJhbmRvbVR5cGUgPSB0eXBlc1t0eXBlSW5kZXhdO1xuXG4gICAgY29uc3QgcFVwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWDogZ3gsIGdyaWRZOiBneSwgeDogZ3ggKiB0aWxlU2l6ZSwgeTogZ3kgKiB0aWxlU2l6ZSB9KTtcbiAgICBcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gYHBvd2VydXAgcG93ZXJ1cC0ke3JhbmRvbVR5cGUudG9Mb3dlckNhc2UoKX1gO1xuICAgIGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSBgJHtneCAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUudG9wID0gYCR7Z3kgKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJywgeyB0eXBlOiByYW5kb21UeXBlLCBlbDogZGl2IH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclN5c3RlbSh3b3JsZCwgZHQsIG5vdywgYW5pbVJvd3MpIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdSZW5kZXJhYmxlJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuXG4gICAgICAgIGlmICghcmVuZGVyYWJsZS5lbCkgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSByZW5kZXJhYmxlLnN0YXRlO1xuICAgICAgICBjb25zdCB0YXJnZXRSb3cgPSBhbmltUm93c1tzdGF0ZV1bdmVsLmRpcmVjdGlvbl07XG4gICAgICAgIFxuICAgICAgICAvLyBSZXNldCBhbmltYXRpb24gd2hlbiByb3cgb3Igc3RhdGUgY2hhbmdlc1xuICAgICAgICBpZiAocmVuZGVyYWJsZS5yb3cgIT09IHRhcmdldFJvdyB8fCByZW5kZXJhYmxlLmxhc3RTdGF0ZSAhPT0gc3RhdGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUucm93ID0gdGFyZ2V0Um93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0U3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZyYW1lQ291bnQgPSBzdGF0ZSA9PT0gJ1JVTicgPyByZW5kZXJhYmxlLnJ1bkZyYW1lcyA6IHJlbmRlcmFibGUuaWRsZUZyYW1lcztcbiAgICAgICAgY29uc3QgZnJhbWVEZWxheSA9IHN0YXRlID09PSAnUlVOJyA/IDEwMDAgLyByZW5kZXJhYmxlLmZwcyA6IDEwMDAgLyByZW5kZXJhYmxlLmlkbGVGcHM7XG5cbiAgICAgICAgaWYgKG5vdyAtIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA+IGZyYW1lRGVsYXkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICsgMSkgJSBmcmFtZUNvdW50O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zWCA9IC0ocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKiByZW5kZXJhYmxlLmZyYW1lV2lkdGgpO1xuICAgICAgICBjb25zdCBwb3NZID0gLShyZW5kZXJhYmxlLnJvdyAqIHJlbmRlcmFibGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBgJHtwb3NYfXB4ICR7cG9zWX1weGA7XG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7cG9zLnh9cHgsICR7cG9zLnl9cHgsIDApYDtcbiAgICB9XG59XG4iLCIvLyAvc3JjL2Vjcy93b3JsZC5qc1xuXG5leHBvcnQgY2xhc3MgV29ybGQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm5leHRFbnRpdHlJZCA9IDA7XG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IG5ldyBNYXAoKTsgXG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuICAgIH1cblxuICAgIGNyZWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5uZXh0RW50aXR5SWQrKztcbiAgICAgICAgdGhpcy5lbnRpdGllcy5hZGQoZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG5cbiAgICBkZXN0cm95RW50aXR5KGVudGl0eSkge1xuICAgICAgICB0aGlzLmVudGl0aWVzLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICBmb3IgKGNvbnN0IFtjb21wb25lbnROYW1lLCBjb21wb25lbnRNYXBdIG9mIHRoaXMuY29tcG9uZW50cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERhdGEgPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zZXQoY29tcG9uZW50TmFtZSwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpLnNldChlbnRpdHksIGNvbXBvbmVudERhdGEpO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE1hcCA/IGNvbXBvbmVudE1hcC5nZXQoZW50aXR5KSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZW1vdmVDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIGlmIChjb21wb25lbnRNYXApIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHF1ZXJ5KC4uLmNvbXBvbmVudE5hbWVzKSB7XG4gICAgICAgIGlmIChjb21wb25lbnROYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpcnN0TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1swXSk7XG4gICAgICAgIGlmICghZmlyc3RNYXApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZmlyc3RNYXAua2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgaGFzQWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY29tcG9uZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcCB8fCAhbWFwLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0FsbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzQWxsICYmIHRoaXMuZW50aXRpZXMuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRTeXN0ZW0oc3lzdGVtRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zeXN0ZW1zLnB1c2goc3lzdGVtRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHVwZGF0ZShkdCwgbm93KSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3lzdGVtIG9mIHRoaXMuc3lzdGVtcykge1xuICAgICAgICAgICAgc3lzdGVtKHRoaXMsIGR0LCBub3cpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEtpY2tlZE1lbnUoKSB7XG4gICAgY29uc3QgcmV0dXJuQnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5SZXR1cm4gdG8gTWFpbiBNZW51PC9idXR0b24+O1xuXG4gICAgcmV0dXJuQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIC8vIEhhcmQgcmVsb2FkIHVzaW5nIHJlcGxhY2UgKyB0aW1lb3V0IHRvIGF2b2lkIFNQQSByb3V0aW5nIHJhY2UgY29uZGl0aW9uc1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgnLycpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICAgICAgPGgxPktJQ0tFRCBGT1IgQUZLITwvaDE+XG4gICAgICAgICAgICA8cD5Zb3Ugd2VyZSByZW1vdmVkIGZyb20gdGhlIG1hdGNoIGZvciBzd2l0Y2hpbmcgdGFicy48L3A+XG4gICAgICAgICAgICB7cmV0dXJuQnRufVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gV2luTWVudShwcm9wcykge1xuICAgIGNvbnN0IHdpbm5lck5hbWUgPSBwcm9wcy53aW5uZXJOYW1lIHx8IFwiQSBQbGF5ZXJcIjtcblxuICAgIGNvbnN0IHJlcGxheUJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+UGxheSBBZ2FpbjwvYnV0dG9uPjtcblxuICAgIHJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAvLyBFeHBsaWNpdGx5IGNsb3NlIHRoZSBvbGQgV2ViU29ja2V0IHRvIHByZXZlbnQgem9tYmllIGNvbm5lY3Rpb25zXG4gICAgICAgIGlmICh3aW5kb3cuc29ja2V0KSB7IFxuICAgICAgICAgICAgd2luZG93LnNvY2tldC5jbG9zZSgpOyBcbiAgICAgICAgICAgIHdpbmRvdy5zb2NrZXQgPSBudWxsOyBcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhcmQgcmVsb2FkIHVzaW5nIHJlcGxhY2UgKyB0aW1lb3V0IHRvIGF2b2lkIFNQQSByb3V0aW5nIHJhY2UgY29uZGl0aW9uc1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgnLycpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICAgICAgPGgxPnt3aW5uZXJOYW1lLnRvVXBwZXJDYXNlKCl9IFdPTiE8L2gxPlxuICAgICAgICAgICAgPHA+VGhlIGxhc3QgcGxheWVyIHN0YW5kaW5nIHRha2VzIHRoZSBjcm93bi48L3A+XG4gICAgICAgICAgICB7cmVwbGF5QnRufVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5cbmNvbnN0IFRJTEVfU0laRSA9IDY0O1xuY29uc3QgR1JJRF9CT1JERVJfU0laRSA9IDY7XG5jb25zdCBHQU1FX0NIUk9NRV9XSURUSCA9IDcyO1xuY29uc3QgR0FNRV9DSFJPTUVfSEVJR0hUID0gMTUwO1xuXG5jb25zdCBpbWFnZXMgPSB7XG4gICAgMjogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIsXG4gICAgMzogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfd2FsbC5wbmdcIixcbiAgICA0OiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19leHBsb2l0LnBuZ1wiLFxufTtcblxuY29uc3QgW3BsYXllck5hbWUsIHNldFBsYXllck5hbWVdID0gY3JlYXRlU2lnbmFsKFwiUGxheWVyIDFcIik7XG5jb25zdCBbbGl2ZXMsIHNldExpdmVzXSA9IGNyZWF0ZVNpZ25hbCgzKTtcbmNvbnN0IFtzcGVlZCwgc2V0U3BlZWRdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW2JvbWJzLCBzZXRCb21ic10gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbcmFuZ2UsIHNldFJhbmdlXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmV4cG9ydCB7IHNldFBsYXllck5hbWUsIHNldExpdmVzLCBzZXRTcGVlZCwgc2V0Qm9tYnMsIHNldFJhbmdlIH07XG5cbmNvbnN0IG5hbWVFbCA9IDxzcGFuIGNsYXNzPVwicGxheWVyLW5hbWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBuYW1lRWwudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lKCk7IH0pO1xuXG5jb25zdCBsaXZlc0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBsaXZlcy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBzcGVlZEVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBzcGVlZC12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBib21ic0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBib21icy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCByYW5nZUVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSByYW5nZS12YWx1ZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGxpdmVzRWwudGV4dENvbnRlbnQgPSBsaXZlcygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHNwZWVkRWwudGV4dENvbnRlbnQgPSBzcGVlZCgpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGJvbWJzRWwudGV4dENvbnRlbnQgPSBib21icygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHJhbmdlRWwudGV4dENvbnRlbnQgPSByYW5nZSgpOyB9KTtcblxuZnVuY3Rpb24gR2FtZSh7IGdyaWQgfSkge1xuICAgIGNvbnN0IGJvYXJkV2lkdGggPSBncmlkWzBdLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZEhlaWdodCA9IGdyaWQubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJXaWR0aCA9IGJvYXJkV2lkdGggKyBHUklEX0JPUkRFUl9TSVpFICogMjtcbiAgICBjb25zdCBib2FyZE91dGVySGVpZ2h0ID0gYm9hcmRIZWlnaHQgKyBHUklEX0JPUkRFUl9TSVpFICogMjtcbiAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGJvYXJkV2lkdGggOiB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBib2FyZEhlaWdodCA6IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjb25zdCBzY2FsZSA9IE1hdGgubWluKFxuICAgICAgICAxLFxuICAgICAgICBNYXRoLm1heCgwLjIsICh2aWV3cG9ydFdpZHRoIC0gR0FNRV9DSFJPTUVfV0lEVEgpIC8gYm9hcmRPdXRlcldpZHRoKSxcbiAgICAgICAgTWF0aC5tYXgoMC4yLCAodmlld3BvcnRIZWlnaHQgLSBHQU1FX0NIUk9NRV9IRUlHSFQpIC8gYm9hcmRPdXRlckhlaWdodClcbiAgICApO1xuICAgIGNvbnN0IHJvd3MgPSBbXTtcbiAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgZ3JpZC5sZW5ndGg7IHJvd0luZGV4KyspIHtcbiAgICAgICAgY29uc3QgY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IGdyaWRbcm93SW5kZXhdLmxlbmd0aDsgY29sSW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGdyaWRbcm93SW5kZXhdW2NvbEluZGV4XTtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBcInRpbGVcIjtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGB3aWR0aDoke1RJTEVfU0laRX1weDtoZWlnaHQ6JHtUSUxFX1NJWkV9cHg7YDtcblxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDIgfHwgY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLWZsb29yXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLXdhbGxcIjtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbM119KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1s0XX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAwIHx8IGNlbGwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbMl19KWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNlbGxzLnB1c2goPGRpdiBjbGFzcz17Y2xhc3NOYW1lfSBkYXRhLXg9e2NvbEluZGV4fSBkYXRhLXk9e3Jvd0luZGV4fSBzdHlsZT17c3R5bGV9PjwvZGl2Pik7XG4gICAgICAgIH1cbiAgICAgICAgcm93cy5wdXNoKDxkaXYgY2xhc3M9XCJncmlkLXJvd1wiPntjZWxsc308L2Rpdj4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtZ2xhc3NcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtYmFyXCI+XG4gICAgICAgICAgICAgICAgICAgIHtuYW1lRWx9XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1zdGF0c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5MaXZlczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bGl2ZXNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5TcGVlZDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c3BlZWRFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5Cb21iczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Ym9tYnNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5SYW5nZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmFuZ2VFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1ib2FyZC1mcmFtZVwiIHN0eWxlPXtgd2lkdGg6JHtib2FyZE91dGVyV2lkdGggKiBzY2FsZX1weDtoZWlnaHQ6JHtib2FyZE91dGVySGVpZ2h0ICogc2NhbGV9cHg7YH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZ2FtZS1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJnYW1lLWdyaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2Bwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoke2JvYXJkV2lkdGh9cHg7aGVpZ2h0OiR7Ym9hcmRIZWlnaHR9cHg7dHJhbnNmb3JtOnNjYWxlKCR7c2NhbGV9KTtgfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cm93c31cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgQ2hhdFBsYXllcnMgZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5sZXQgW3N0YXRlcywgc2V0U3RhdGVzXSA9IGNyZWF0ZVNpZ25hbCh7fSk7XG5leHBvcnQgeyBzZXRTdGF0ZXMgfTtcblxubGV0IHJvb21JZEVsID0gPHA+Um9vbSBJRDogPC9wPjtcbmxldCBwbGF5ZXJzRWwgPSA8cD5QbGF5ZXJzOiAgLyA0PC9wPjtcbmxldCB0ZXh0RWwgPSA8cD48L3A+O1xubGV0IHRpbWVyRWwgPSA8cD5UaW1lcjogPC9wPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzID0gc3RhdGVzKCk7XG4gICAgcm9vbUlkRWwudGV4dENvbnRlbnQgPSBgUm9vbSBJRDogJHtzLnJvb21JZH1gO1xuICAgIHBsYXllcnNFbC50ZXh0Q29udGVudCA9IGBQbGF5ZXJzOiAke3MucGxheWVyc0NvdW50fSAvIDRgO1xuICAgIHRleHRFbC50ZXh0Q29udGVudCA9IHMudGV4dCB8fCBcIlwiO1xuXG4gICAgaWYgKHMuZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IFwiVGltZXI6IEdhbWUgc3RhcnRlZFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRpbWVyVGV4dCA9ICghcy5zZWNvbmRzTGVmdCkgPyBcIldhaXRpbmcgZm9yIG9uZSBtb3JlIHBsYXllclwiIDogYCR7cy5zZWNvbmRzTGVmdH0gc2Vjb25kc2A7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBgVGltZXI6ICR7dGltZXJUZXh0fWA7XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIExvYmJ5KCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb25hdGluZXItbG9iYnlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2JieS1ib3hcIj5cbiAgICAgICAgICAgICAgICA8aDE+TG9iYnk8L2gxPlxuICAgICAgICAgICAgICAgIHtyb29tSWRFbH1cbiAgICAgICAgICAgICAgICB7cGxheWVyc0VsfVxuICAgICAgICAgICAgICAgIHt0ZXh0RWx9XG4gICAgICAgICAgICAgICAge3RpbWVyRWx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxDaGF0UGxheWVycyAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYmJ5OyIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmNvbnN0IHJlcGxheUJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+UGxheSBBZ2FpbjwvYnV0dG9uPjtcblxucmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbG9jYXRpb24ucmVsb2FkKCk7XG59KTtcblxubGV0IG1lbnVFbCA9IChcbiAgICA8ZGl2IGNsYXNzPVwibWVudS1ib3hcIj5cbiAgICAgICAgPGgxPllvdSBXaW4hPC9oMT5cbiAgICAgICAgPHA+QWxsIG90aGVyIHBsYXllcnMgaGF2ZSBsZWZ0IHRoZSBnYW1lLjwvcD5cbiAgICAgICAge3JlcGxheUJ0bn1cbiAgICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lbnUoKSB7XG4gICAgcmV0dXJuIG1lbnVFbDtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBzZXRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7XG5cbmZ1bmN0aW9uIFJlZ2lzdGVyKHsgd3NzIH0pIHtcbiAgICBsZXQgc3VibWl0dGVkID0gZmFsc2U7XG5cbiAgICBsZXQgcGxheWVyRW50ZXIgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChzdWJtaXR0ZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCBuaWNrbmFtZSA9IGZvcm1EYXRhLmdldChcIm5pY2tuYW1lXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW5pY2tuYW1lIHx8IG5pY2tuYW1lLmxlbmd0aCA+IDIwKSByZXR1cm47XG5cbiAgICAgICAgc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc2V0UGxheWVyTmFtZShuaWNrbmFtZSk7XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJuaWNrbmFtZV9vZl90aGVfcGxheWVyXCIsXG4gICAgICAgICAgICBuaWNrbmFtZTogbmlja25hbWVcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxmb3JtIGNsYXNzPVwicmVnaXN0ZXItZm9ybVwiIG9uU3VibWl0PXtwbGF5ZXJFbnRlcn0+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaWNrbmFtZS1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5pY2tuYW1lXCIgcGxhY2Vob2xkZXI9XCJlbnRlciB5b3VyIG5hbWVcIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJyZWdpc3Rlci1idXR0b25cIiB0eXBlPVwic3VibWl0XCI+c3RhcnQgcGxheWluZzwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RlcjtcbiIsImNsYXNzIFNvdW5kIHtcbiAgICBjb25zdHJ1Y3RvcihzcmMpIHtcbiAgICAgICAgdGhpcy5tdXNpYyA9IG5ldyBBdWRpbyhzcmMpO1xuICAgICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuXG4gICAgICAgIHRoaXMubXVzaWMubG9vcCA9IHRydWU7XG4gICAgICAgIHRoaXMubXVzaWMudm9sdW1lID0gMC40O1xuXG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTmFtZSA9IFwic291bmQtYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFwcGVuZCh0aGlzLmljb24pO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZSgpKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZCh0aGlzLmJ1dHRvbik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnBsYXkoKSwgeyBvbmNlOiB0cnVlIH0pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIHRoaXMubXVzaWMucGxheSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpO1xuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVzaWMucGF1c2VkIHx8IHRoaXMubXVzaWMubXV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvblwiKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVCdXR0b24oKSB7XG4gICAgICAgIGNvbnN0IGlzTXV0ZWQgPSB0aGlzLm11c2ljLm11dGVkIHx8IHRoaXMubXVzaWMucGF1c2VkO1xuXG4gICAgICAgIHRoaXMuaWNvbi5jbGFzc05hbWUgPSBpc011dGVkID8gXCJmYS1zb2xpZCBmYS12b2x1bWUtb2ZmXCIgOiBcImZhLXNvbGlkIGZhLXZvbHVtZS1oaWdoXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1tdXRlZFwiLCBpc011dGVkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvdW5kO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC9hcHAuanNcIik7XG4iLCIiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJwcm9wcyIsImNoaWxkcmVuIiwiZWxlIiwiZG9jdW1lbnQiLCJrZXkiLCJzdGFydHNXaXRoIiwiZXZlbnROYW1lIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRBdHRyaWJ1dGUiLCJmbGF0Q2hpbGRyZW4iLCJmbGF0IiwiSW5maW5pdHkiLCJhcHBlbmQiLCJmaWx0ZXIiLCJjaGlsZCIsInVuZGVmaW5lZCIsInJlbmRlciIsImVsZW1lbnQiLCJjb250YWluZXIiLCJyZXBsYWNlQ2hpbGRyZW4iLCJSb3V0ZXIiLCJyb3V0ZXIiLCJlZmZlY3RTdGFjayIsImFjdGl2ZUVmZmVjdCIsImNyZWF0ZVNpZ25hbCIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwiZWZmZWN0cyIsIlNldCIsIlJlYWQiLCJhZGQiLCJXcml0ZSIsIm5ld1ZhbHVlIiwiZm4iLCJmb3JFYWNoIiwiZWZmZWN0IiwiY3JlYXRlRWZmZWN0IiwicHVzaCIsInBvcCIsImxlbmd0aCIsIlJvdXRlcyIsIk9iamVjdCIsImNyZWF0ZSIsIkZpcnN0UmVzb2x2ZSIsIm9uIiwicGF0aCIsImhhbmRsZXIiLCJuYXZpZ2F0ZSIsImhpc3RvcnkiLCJuYXZpZ2F0aW9uIiwicmVzb2x2ZSIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJ1cmwiLCJVUkwiLCJocmVmIiwibGlzdGVuIiwib25FcnJvcjQwNCIsImV2ZW50IiwibmF2aWdhdGlvblR5cGUiLCJkZXN0aW5hdGlvbiIsImludGVyY2VwdCIsImNvbnNvbGUiLCJsb2ciLCJSZWdpc3RlciIsIkdhbWUiLCJNZW51IiwiTG9iYnkiLCJXaW5NZW51IiwiS2lja2VkTWVudSIsInNldFN0YXRlcyIsInNldFBsYXllck5hbWUiLCJzZXRIdWRQbGF5ZXJOYW1lIiwiU291bmQiLCJzZXRNZXNzYWdlcyIsIkdhbWVFbmdpbmUiLCJoYW5kbGVQbGF5ZXJEZWF0aCIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsIndpbmRvdyIsImhvc3RuYW1lIiwic291bmQiLCJjdXJyZW50R2FtZUVuZ2luZSIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJ3cyIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicXVlcnlTZWxlY3RvciIsInJvb21JZCIsInBsYXllcnNDb3VudCIsInNlY29uZHNMZWZ0IiwidGV4dCIsImRlc3Ryb3kiLCJncmlkIiwic2V0VGltZW91dCIsImdhbWVDb250YWluZXIiLCJsb2NhbFBsYXllciIsInBsYXllcnMiLCJmaW5kIiwicGxheWVyIiwiaWQiLCJ5b3VyUGxheWVySWQiLCJuaWNrbmFtZSIsImVuZ2luZSIsImhpZGRlbiIsInNvY2tldCIsImNsb3NlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJvbkFGSyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJlcnJvciIsIndpbm5lck5hbWUiLCJlbnRpdHkiLCJwbGF5ZXJFbnRpdGllcyIsImdldCIsIlN0cmluZyIsInBsYXllcklkIiwid29ybGQiLCJkZXN0cm95RW50aXR5IiwiZGVsZXRlIiwicHJldiIsImhhbmRsZVJlbW90ZU1vdmUiLCJwYXlsb2FkIiwiaGFuZGxlUmVtb3RlQm9tYiIsImhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQiLCJoYW5kbGVSZW1vdGVJdGVtUGlja3VwIiwiZXJyIiwibWVzc2FnZXMiLCJDaGF0UGxheWVycyIsIm1lc3NhZ2VzQ29udGFpbmVyIiwiY2xhc3MiLCJtc2dzIiwibXNnIiwicCIsInRleHRDb250ZW50IiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsInRyaW0iLCJyZXNldCIsInNlbmQiLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlBvc2l0aW9uQ29tcG9uZW50IiwiZ3giLCJneSIsInRpbGVTaXplIiwiZ3JpZFgiLCJncmlkWSIsIngiLCJ5IiwidGFyZ2V0WCIsInRhcmdldFkiLCJWZWxvY2l0eUNvbXBvbmVudCIsImJhc2VTcGVlZCIsInNwZWVkIiwiaXNNb3ZpbmciLCJkaXJlY3Rpb24iLCJJbnB1dENvbXBvbmVudCIsImlucHV0UXVldWUiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiZWwiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJ0b3RhbEZyYW1lcyIsImZwcyIsImN1cnJlbnRGcmFtZSIsInJ1bkZyYW1lcyIsImlkbGVGcmFtZXMiLCJpZGxlRnBzIiwibGFzdEZyYW1lVGltZSIsInJvdyIsInN0YXRlIiwibGFzdFN0YXRlIiwiUGxheWVyQ29tcG9uZW50IiwiY2hhclR5cGUiLCJpc0xvY2FsIiwiQm9tYkNvbXBvbmVudCIsIm93bmVySWQiLCJ0aW1lciIsInJhbmdlIiwiZXhwbG9kZWQiLCJFeHBsb3Npb25Db21wb25lbnQiLCJkdXJhdGlvbiIsIlBvd2VyVXBDb21wb25lbnQiLCJwaWNrZWRVcCIsIkJlaGF2aW9yQ29tcG9uZW50IiwiZ2hvc3RNb2RlIiwidGhyb3dhYmxlIiwiZGV0b25hdG9yIiwiZmFzdFNob2VzTGV2ZWwiLCJib21icyIsIm1heCIsImN1cnJlbnQiLCJXb3JsZCIsIm1vdmVtZW50U3lzdGVtIiwicmVuZGVyU3lzdGVtIiwiYm9tYlN5c3RlbSIsImRhbWFnZVN5c3RlbSIsImNoZWNrR2FtZUVuZENvbmRpdGlvbnMiLCJzcGF3bkhlYXJ0UG93ZXJVcCIsInBvd2VyVXBTeXN0ZW0iLCJzcGF3blBvd2VyVXAiLCJzZXRCb21icyIsInNldExpdmVzIiwic2V0UmFuZ2UiLCJzZXRTcGVlZCIsIlRJTEVfU0laRSIsIkFOSU1BVElPTl9ST1dTIiwiUlVOIiwidXAiLCJsZWZ0IiwiZG93biIsInJpZ2h0IiwiSURMRSIsImNvbnN0cnVjdG9yIiwiY2FudmFzQ29udGFpbmVyIiwibWFwRGF0YSIsImxvY2FsUGxheWVyRW50aXR5IiwiTWFwIiwicGxheWVySW5mbyIsImxhc3RUaW1lIiwicmVtb3ZlSW5wdXRMaXN0ZW5lcnMiLCJhbmltYXRpb25GcmFtZSIsInJ1bm5pbmciLCJjbGFpbWVkUG93ZXJVcHMiLCJsb3NzTW9kYWxUcmlnZ2VyZWQiLCJpbnB1dEVuYWJsZWQiLCJnYW1lRW5kZWQiLCJsb2NhbFBsYXllcklkIiwiYWxsUGxheWVycyIsInRvdGFsUGxheWVycyIsIm5vcm1hbGl6ZWRMb2NhbFBsYXllcklkIiwicERhdGEiLCJwbGF5ZXJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJzZXQiLCJwbGF5ZXJEaXYiLCJkaXNjb25uZWN0ZWQiLCJjb2xvciIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ3aWxsQ2hhbmdlIiwic3giLCJzeSIsImFkZENvbXBvbmVudCIsInBsYXllckNvbXAiLCJsaXZlcyIsIm1heEJvbWJzIiwiYm9tYlJhbmdlIiwidXBkYXRlSHVkU3RhdHMiLCJzZXR1cElucHV0Iiwid2FybiIsIm1hcCIsInJlZ2lzdGVyU3lzdGVtcyIsInBlcmZvcm1hbmNlIiwibm93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZ2FtZUxvb3AiLCJpbnB1dCIsImdldENvbXBvbmVudCIsImdldEtleURpcmVjdGlvbiIsImhhbmRsZUtleURvd24iLCJkaXIiLCJpbmNsdWRlcyIsImNvZGUiLCJkcm9wQm9tYiIsImhhbmRsZUtleVVwIiwiZCIsInBvcyIsImN1cnJlbnRCb21icyIsInF1ZXJ5IiwiYkVudGl0eSIsImNyZWF0ZWQiLCJjcmVhdGVCb21iIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJleGlzdHMiLCJzb21lIiwiYm9tYiIsImJvbWJFbnRpdHkiLCJib21iRGl2IiwidG9wIiwiYm9tYkNvbXAiLCJBcnJheSIsImZyb20iLCJrZXlzIiwidmVsIiwicmVuZGVyYWJsZSIsInJlbW92ZVBvd2VyVXBBdCIsImFwcGx5UG93ZXJVcCIsIm5ld0xpdmVzIiwicG93ZXJVcHMiLCJwb3dlclVwIiwicGFyZW50Tm9kZSIsInZlbG9jaXR5IiwiTWF0aCIsIm1pbiIsInVwZGF0ZU1hcENlbGwiLCJ0aWxlIiwiYmFja2dyb3VuZEltYWdlIiwiZGVzdHJveUJveENhbGxiYWNrIiwiaGFzIiwib25QbGF5ZXJIdXJ0IiwicmVtYWluaW5nTGl2ZXMiLCJvblBvd2VyVXBQaWNrZWQiLCJicm9hZGNhc3RNb3ZlbWVudCIsImFkZFN5c3RlbSIsInciLCJkdCIsInVwZGF0ZSIsIm5leHROb3ciLCJoYW5kbGVHYW1lT3ZlciIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicm91bmQiLCJjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImdldFBsYXllck5hbWUiLCJnZXRJdGVtIiwiYWZmZWN0ZWRDZWxscyIsImNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzIiwiY2VsbCIsImV4cEVudGl0eSIsImV4cERpdiIsIndpZHRoIiwiaGVpZ2h0IiwiZXhwbG9zaW9ucyIsImV4cCIsImJ4IiwiYnkiLCJjZWxscyIsImRpcmVjdGlvbnMiLCJzdGVwcyIsImkiLCJ0eCIsInR5IiwiY2VsbFR5cGUiLCJoZWFydEVudGl0eSIsImhlYXJ0RGl2IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsImZvbnRTaXplIiwiZGVhdGhHcmlkWCIsImZsb29yIiwiZGVhdGhHcmlkWSIsInJlbW92ZUNvbXBvbmVudCIsInBQb3MiLCJpbnZpbmNpYmxlVW50aWwiLCJlUG9zIiwicGxheWVyR3JpZFgiLCJwbGF5ZXJHcmlkWSIsInByZXZpb3VzTGl2ZXMiLCJhbHJlYWR5UmVwb3J0ZWREZWFkIiwiZW50aXRpZXMiLCJkZWx0YSIsIlBMQVlFUl9TSVpFIiwiYmVoYXZpb3IiLCJtb3ZlVG93YXJkVGFyZ2V0IiwiYWN0aXZlSW5wdXQiLCJkeCIsImR5IiwiaGFzSW5wdXQiLCJuZXh0WCIsIm5leHRZIiwic25hcFRocmVzaG9sZCIsImlzQmxvY2tlZCIsImN1cnJlbnRUaWxlWCIsImRpZmZYIiwiYWJzIiwic2lnbiIsImN1cnJlbnRUaWxlWSIsImRpZmZZIiwibmV4dFhBZnRlclNuYXAiLCJuZXh0WUFmdGVyU25hcCIsInN0ZXAiLCJwbGF5ZXJTaXplIiwicGFkZGluZyIsImJvdHRvbSIsImlzQmxvY2tlZENlbGwiLCJwVXBFbnRpdHkiLCJ1cFBvcyIsInBVcCIsInNlZWQiLCJzZWVkUmFuZG9tIiwic2luIiwidHlwZXMiLCJ0eXBlSW5kZXgiLCJyYW5kb21UeXBlIiwiZGl2IiwiYW5pbVJvd3MiLCJ0YXJnZXRSb3ciLCJmcmFtZUNvdW50IiwiZnJhbWVEZWxheSIsInBvc1giLCJwb3NZIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwidHJhbnNmb3JtIiwibmV4dEVudGl0eUlkIiwiY29tcG9uZW50cyIsInN5c3RlbXMiLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50TWFwIiwiZW50cmllcyIsImNvbXBvbmVudERhdGEiLCJjb21wb25lbnROYW1lcyIsImZpcnN0TWFwIiwicmVzdWx0cyIsImhhc0FsbCIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwicmV0dXJuQnRuIiwicmVwbGFjZSIsInJlbG9hZCIsInJlcGxheUJ0biIsInRvVXBwZXJDYXNlIiwiR1JJRF9CT1JERVJfU0laRSIsIkdBTUVfQ0hST01FX1dJRFRIIiwiR0FNRV9DSFJPTUVfSEVJR0hUIiwiaW1hZ2VzIiwicGxheWVyTmFtZSIsIm5hbWVFbCIsImxpdmVzRWwiLCJzcGVlZEVsIiwiYm9tYnNFbCIsInJhbmdlRWwiLCJib2FyZFdpZHRoIiwiYm9hcmRIZWlnaHQiLCJib2FyZE91dGVyV2lkdGgiLCJib2FyZE91dGVySGVpZ2h0Iiwidmlld3BvcnRXaWR0aCIsImlubmVyV2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsImlubmVySGVpZ2h0Iiwic2NhbGUiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJnYW1lU3RhcnRlZCIsInRpbWVyVGV4dCIsIm1lbnVFbCIsInN1Ym1pdHRlZCIsInBsYXllckVudGVyIiwiY3VycmVudFRhcmdldCIsInNyYyIsIm11c2ljIiwiQXVkaW8iLCJidXR0b24iLCJpY29uIiwibG9vcCIsInZvbHVtZSIsInRvZ2dsZSIsInBsYXkiLCJvbmNlIiwidXBkYXRlQnV0dG9uIiwidGhlbiIsImNhdGNoIiwicGF1c2VkIiwibXV0ZWQiLCJpc011dGVkIiwiY2xhc3NMaXN0Il0sInNvdXJjZVJvb3QiOiIifQ==