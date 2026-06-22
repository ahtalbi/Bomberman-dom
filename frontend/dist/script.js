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
/* harmony import */ var _pages_KickedMenu_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pages/KickedMenu.jsx */ "./src/pages/KickedMenu.jsx");
/* harmony import */ var _utils_sound__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/sound */ "./src/utils/sound.js");
/* harmony import */ var _components_chat__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/chat */ "./src/components/chat.jsx");
/* harmony import */ var _ecs_game_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../ecs/game.js */ "./src/ecs/game.js");
/* harmony import */ var _ecs_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../ecs/systems/damageSystem.js */ "./src/ecs/systems/damageSystem.js");















const root = document.getElementById("root");
const wss = new WebSocket(`ws://${window.location.hostname}:5000`);
window.socket = wss;
const sound = new _utils_sound__WEBPACK_IMPORTED_MODULE_8__["default"]("./assets/sounds/background_music.mp3");
let currentGameEngine = null;
sound.init();
_mini_framework_mini_framework__WEBPACK_IMPORTED_MODULE_1__["default"].on("/", () => {
  document.body.className = "register-page";
  (0,_components_chat__WEBPACK_IMPORTED_MODULE_9__.setMessages)([]);
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
    case "lobby_update":
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
        secondsLeft: 20,
        text: "Waiting for more players"
      });
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_9__.setMessages)([]);
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
          if (document.hidden) {
            wss.send(JSON.stringify({
              type: "leave_room"
            }));
            currentGameEngine.destroy();
            currentGameEngine = null;
            document.body.className = "menu-page";
            root.innerHTML = '';
            root.appendChild((0,_pages_KickedMenu_jsx__WEBPACK_IMPORTED_MODULE_7__["default"])());
            return;
          }
          document.addEventListener("visibilitychange", function onAFK() {
            if (document.hidden) {
              document.removeEventListener("visibilitychange", onAFK);
              wss.send(JSON.stringify({
                type: "leave_room"
              }));
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
          if (typeof _ecs_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_11__.handlePlayerDeath === 'function') {
            (0,_ecs_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_11__.handlePlayerDeath)(currentGameEngine.world, entity, _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE);
          }
          currentGameEngine.world.destroyEntity(entity);
          currentGameEngine.playerEntities.delete(String(message.playerId));
        }
      }
      break;
    case "chat_message":
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_9__.setMessages)(prev => [...prev, {
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
    case "explosion_checked":
      if (currentGameEngine) {
        currentGameEngine.handleExplosionChecked(message.payload);
      }
      break;
    case "player_damaged":
      if (currentGameEngine) {
        currentGameEngine.handlePlayerDamaged(message.payload);
      }
      break;
    case "game_over":
      if (currentGameEngine) {
        currentGameEngine.handleGameOver(message.payload);
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
/* harmony export */   getPlayerName: () => (/* reexport safe */ _game_playerName_js__WEBPACK_IMPORTED_MODULE_6__.getPlayerName),
/* harmony export */   setPlayerName: () => (/* reexport safe */ _game_playerName_js__WEBPACK_IMPORTED_MODULE_6__.setPlayerName)
/* harmony export */ });
/* harmony import */ var _world_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./world.js */ "./src/ecs/world.js");
/* harmony import */ var _game_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game/lifecycle.js */ "./src/ecs/game/lifecycle.js");
/* harmony import */ var _game_input_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game/input.js */ "./src/ecs/game/input.js");
/* harmony import */ var _game_entities_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./game/entities.js */ "./src/ecs/game/entities.js");
/* harmony import */ var _game_remoteHandlers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./game/remoteHandlers.js */ "./src/ecs/game/remoteHandlers.js");
/* harmony import */ var _game_hud_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./game/hud.js */ "./src/ecs/game/hud.js");
/* harmony import */ var _game_playerName_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./game/playerName.js */ "./src/ecs/game/playerName.js");







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
    this.lastInputSent = "";
  }
  init = _game_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__.init;
  setupInput = _game_input_js__WEBPACK_IMPORTED_MODULE_2__.setupInput;
  sendInput = _game_input_js__WEBPACK_IMPORTED_MODULE_2__.sendInput;
  dropBomb = _game_input_js__WEBPACK_IMPORTED_MODULE_2__.dropBomb;
  createBomb = _game_entities_js__WEBPACK_IMPORTED_MODULE_3__.createBomb;
  handleRemoteMove = _game_remoteHandlers_js__WEBPACK_IMPORTED_MODULE_4__.handleRemoteMove;
  handleRemoteBomb = _game_remoteHandlers_js__WEBPACK_IMPORTED_MODULE_4__.handleRemoteBomb;
  handleRemotePowerUpPicked = _game_remoteHandlers_js__WEBPACK_IMPORTED_MODULE_4__.handleRemotePowerUpPicked;
  removePowerUpAt = _game_entities_js__WEBPACK_IMPORTED_MODULE_3__.removePowerUpAt;
  applyServerStats = _game_remoteHandlers_js__WEBPACK_IMPORTED_MODULE_4__.applyServerStats;
  handlePlayerDamaged = _game_remoteHandlers_js__WEBPACK_IMPORTED_MODULE_4__.handlePlayerDamaged;
  handleGameOver = _game_remoteHandlers_js__WEBPACK_IMPORTED_MODULE_4__.handleGameOver;
  handleExplosionChecked = _game_remoteHandlers_js__WEBPACK_IMPORTED_MODULE_4__.handleExplosionChecked;
  updateMapCell = _game_entities_js__WEBPACK_IMPORTED_MODULE_3__.updateMapCell;
  removeBomb = _game_entities_js__WEBPACK_IMPORTED_MODULE_3__.removeBomb;
  createExplosion = _game_entities_js__WEBPACK_IMPORTED_MODULE_3__.createExplosion;
  createPowerUp = _game_entities_js__WEBPACK_IMPORTED_MODULE_3__.createPowerUp;
  registerSystems = _game_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__.registerSystems;
  gameLoop = _game_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__.gameLoop;
  destroy = _game_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__.destroy;
  updateHudStats = _game_hud_js__WEBPACK_IMPORTED_MODULE_5__.updateHudStats;
}

/***/ },

/***/ "./src/ecs/game/constants.js"
/*!***********************************!*\
  !*** ./src/ecs/game/constants.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANIMATION_ROWS: () => (/* binding */ ANIMATION_ROWS),
/* harmony export */   SPRITE_COLUMNS: () => (/* binding */ SPRITE_COLUMNS),
/* harmony export */   SPRITE_ROWS: () => (/* binding */ SPRITE_ROWS)
/* harmony export */ });
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

/***/ },

/***/ "./src/ecs/game/entities.js"
/*!**********************************!*\
  !*** ./src/ecs/game/entities.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBomb: () => (/* binding */ createBomb),
/* harmony export */   createExplosion: () => (/* binding */ createExplosion),
/* harmony export */   createPowerUp: () => (/* binding */ createPowerUp),
/* harmony export */   removeBomb: () => (/* binding */ removeBomb),
/* harmony export */   removePowerUpAt: () => (/* binding */ removePowerUpAt),
/* harmony export */   updateMapCell: () => (/* binding */ updateMapCell)
/* harmony export */ });
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components.js */ "./src/ecs/components.js");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pages/game */ "./src/pages/game.jsx");


function createBomb(ownerId, gridX, gridY, range, bombId = null) {
  const exists = this.world.query('Position', 'Bomb').some(entity => {
    const pos = this.world.getComponent(entity, 'Position');
    const bomb = this.world.getComponent(entity, 'Bomb');
    return bombId && bomb.bombId === bombId || bomb.ownerId === ownerId && pos.gridX === gridX && pos.gridY === gridY;
  });
  if (exists) return false;
  const bombEntity = this.world.createEntity();
  const bombDiv = document.createElement('div');
  bombDiv.className = 'bomb';
  bombDiv.style.position = 'absolute';
  bombDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  bombDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  bombDiv.style.left = `${gridX * _pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  bombDiv.style.top = `${gridY * _pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  bombDiv.style.zIndex = '6';
  this.container.appendChild(bombDiv);
  this.world.addComponent(bombEntity, 'Position', {
    gridX,
    gridY
  });
  const bombComp = (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.BombComponent)(ownerId, 2000, range);
  bombComp.bombId = bombId;
  bombComp.el = bombDiv;
  this.world.addComponent(bombEntity, 'Bomb', bombComp);
  return true;
}
function removePowerUpAt(gridX, gridY) {
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
function updateMapCell(x, y, newValue) {
  if (!this.mapData[y]) return;
  this.mapData[y][x] = newValue;
  const tile = this.container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  if (!tile) return;
  tile.className = 'tile tile-floor';
  tile.style.backgroundImage = 'url("./assets/blocks/block_floor.jpg")';
}
function removeBomb(bombId, fallbackCell) {
  const bombs = this.world.query('Position', 'Bomb');
  for (const entity of bombs) {
    const pos = this.world.getComponent(entity, 'Position');
    const bomb = this.world.getComponent(entity, 'Bomb');
    const sameId = bombId && bomb && bomb.bombId === bombId;
    const sameCell = fallbackCell && pos && pos.gridX === fallbackCell.x && pos.gridY === fallbackCell.y;
    if (!sameId && !sameCell) continue;
    if (bomb.el && bomb.el.parentNode) {
      bomb.el.parentNode.removeChild(bomb.el);
    }
    this.world.destroyEntity(entity);
    return;
  }
}
function createExplosion(gridX, gridY, duration) {
  const expEntity = this.world.createEntity();
  const expDiv = document.createElement('div');
  expDiv.className = 'explosion';
  expDiv.style.position = 'absolute';
  expDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  expDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  expDiv.style.left = `${gridX * _pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  expDiv.style.top = `${gridY * _pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  expDiv.style.zIndex = '7';
  this.container.appendChild(expDiv);
  this.world.addComponent(expEntity, 'Position', {
    gridX,
    gridY,
    x: gridX * _pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE,
    y: gridY * _pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE
  });
  this.world.addComponent(expEntity, 'Explosion', {
    duration,
    el: expDiv
  });
  setTimeout(() => {
    if (expDiv.parentNode) {
      expDiv.parentNode.removeChild(expDiv);
    }
    this.world.destroyEntity(expEntity);
  }, duration);
}
function createPowerUp(gx, gy, type) {
  if (!type || this.claimedPowerUps.has(`${gx},${gy}`)) return;
  const pUpEntity = this.world.createEntity();
  this.world.addComponent(pUpEntity, 'Position', {
    gridX: gx,
    gridY: gy,
    x: gx * _pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE,
    y: gy * _pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE
  });
  const div = document.createElement('div');
  div.className = `powerup powerup-${type.toLowerCase()}`;
  div.style.position = 'absolute';
  div.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  div.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  div.style.left = `${gx * _pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  div.style.top = `${gy * _pages_game__WEBPACK_IMPORTED_MODULE_1__.TILE_SIZE}px`;
  div.style.zIndex = '5';
  this.container.appendChild(div);
  this.world.addComponent(pUpEntity, 'PowerUp', {
    type,
    el: div
  });
}

/***/ },

/***/ "./src/ecs/game/hud.js"
/*!*****************************!*\
  !*** ./src/ecs/game/hud.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateHudStats: () => (/* binding */ updateHudStats)
/* harmony export */ });
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pages/game */ "./src/pages/game.jsx");

function updateHudStats(entity) {
  const player = this.world.getComponent(entity, 'Player');
  const velocity = this.world.getComponent(entity, 'Velocity');
  if (!player || !velocity) return;
  (0,_pages_game__WEBPACK_IMPORTED_MODULE_0__.setBombs)(player.maxBombs || 1);
  (0,_pages_game__WEBPACK_IMPORTED_MODULE_0__.setLives)(player.lives ?? 3);
  (0,_pages_game__WEBPACK_IMPORTED_MODULE_0__.setRange)(player.bombRange || 4);
  (0,_pages_game__WEBPACK_IMPORTED_MODULE_0__.setSpeed)(Math.round(velocity.speed));
}

/***/ },

/***/ "./src/ecs/game/input.js"
/*!*******************************!*\
  !*** ./src/ecs/game/input.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dropBomb: () => (/* binding */ dropBomb),
/* harmony export */   sendInput: () => (/* binding */ sendInput),
/* harmony export */   setupInput: () => (/* binding */ setupInput)
/* harmony export */ });
function setupInput() {
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
      this.sendInput(input);
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
      this.sendInput(input);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  this.removeInputListeners = () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}
function sendInput(input) {
  if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
  if (this.localPlayerEntity === null) return;
  const player = this.world.getComponent(this.localPlayerEntity, 'Player');
  if (!player || !player.alive) return;
  const direction = input.inputQueue[0] || null;
  const isMoving = Boolean(direction);
  const inputState = `${direction || 'idle'}:${isMoving ? 1 : 0}`;
  if (this.lastInputSent === inputState) return;
  this.lastInputSent = inputState;
  this.socket.send(JSON.stringify({
    type: 'MOVE_STATE',
    payload: {
      direction,
      isMoving
    }
  }));
}
function dropBomb() {
  if (this.localPlayerEntity === null) return;
  const player = this.world.getComponent(this.localPlayerEntity, 'Player');
  if (!player || !player.alive) return;
  const currentBombs = this.world.query('Position', 'Bomb').filter(bEntity => {
    return this.world.getComponent(bEntity, 'Bomb').ownerId === player.id;
  });
  if (currentBombs.length >= player.maxBombs) return;
  if (this.socket && this.socket.readyState === WebSocket.OPEN) {
    this.socket.send(JSON.stringify({
      type: 'DROP_BOMB',
      payload: {}
    }));
  }
}

/***/ },

/***/ "./src/ecs/game/lifecycle.js"
/*!***********************************!*\
  !*** ./src/ecs/game/lifecycle.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   destroy: () => (/* binding */ destroy),
/* harmony export */   gameLoop: () => (/* binding */ gameLoop),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   registerSystems: () => (/* binding */ registerSystems)
/* harmony export */ });
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components.js */ "./src/ecs/components.js");
/* harmony import */ var _systems_renderSystem_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../systems/renderSystem.js */ "./src/ecs/systems/renderSystem.js");
/* harmony import */ var _systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../systems/powerUpSystem.js */ "./src/ecs/systems/powerUpSystem.js");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pages/game */ "./src/pages/game.jsx");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants.js */ "./src/ecs/game/constants.js");





function init(localPlayerId, allPlayers) {
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
    playerDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    playerDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    playerDiv.style.backgroundSize = `${_constants_js__WEBPACK_IMPORTED_MODULE_4__.SPRITE_COLUMNS * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px ${_constants_js__WEBPACK_IMPORTED_MODULE_4__.SPRITE_ROWS * _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE}px`;
    this.container.appendChild(playerDiv);
    const sx = pData.x || 1;
    const sy = pData.y || 1;
    this.world.addComponent(playerEntity, 'Position', (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.PositionComponent)(sx, sy, _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE));
    this.world.addComponent(playerEntity, 'Velocity', (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.VelocityComponent)(pData.speed || 2.5));
    this.world.addComponent(playerEntity, 'Renderable', (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.RenderableComponent)(playerDiv, _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE, _pages_game__WEBPACK_IMPORTED_MODULE_3__.TILE_SIZE, 4, 12));
    const isLocal = playerId === normalizedLocalPlayerId;
    const playerComp = (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.PlayerComponent)(playerId, color, isLocal);
    playerComp.lives = pData.lives ?? 3;
    playerComp.maxBombs = pData.maxBombs ?? 1;
    playerComp.bombRange = pData.bombRange ?? 2;
    playerComp.alive = pData.alive ?? true;
    this.world.addComponent(playerEntity, 'Player', playerComp);
    this.playerEntities.set(playerId, playerEntity);
    if (isLocal) {
      this.localPlayerEntity = playerEntity;
      this.world.addComponent(playerEntity, 'Input', (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.InputComponent)());
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
function registerSystems() {
  this.world.addSystem((w, dt, now) => (0,_systems_renderSystem_js__WEBPACK_IMPORTED_MODULE_1__.renderSystem)(w, dt, now, _constants_js__WEBPACK_IMPORTED_MODULE_4__.ANIMATION_ROWS));

  // Register the local power-up collision system
  this.world.addSystem((w, dt, now) => (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_2__.powerUpSystem)(w, (playerId, type, gridX, gridY) => {
    if (type === 'HEART' && this.localPlayerEntity !== null) {
      // Update the HUD immediately when a heart is picked up
      this.updateHudStats(this.localPlayerEntity);

      // Broadcast heart pickup to all players so they remove it from their screen
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'POWERUP_PICKED',
          payload: {
            id: playerId,
            type: type,
            x: gridX,
            y: gridY
          }
        }));
      }
    }
  }));
}
function gameLoop(now) {
  if (!this.running) return;
  const dt = now - this.lastTime;
  this.lastTime = now;
  this.world.update(dt, now);
  if (this.localPlayerEntity !== null) {
    this.updateHudStats(this.localPlayerEntity);
  }
  this.animationFrame = requestAnimationFrame(nextNow => this.gameLoop(nextNow));
}
function destroy() {
  this.running = false;
  if (this.animationFrame) {
    cancelAnimationFrame(this.animationFrame);
  }
  if (this.removeInputListeners) {
    this.removeInputListeners();
  }
}

/***/ },

/***/ "./src/ecs/game/playerName.js"
/*!************************************!*\
  !*** ./src/ecs/game/playerName.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPlayerName: () => (/* binding */ getPlayerName),
/* harmony export */   setPlayerName: () => (/* binding */ setPlayerName)
/* harmony export */ });
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

/***/ "./src/ecs/game/remoteHandlers.js"
/*!****************************************!*\
  !*** ./src/ecs/game/remoteHandlers.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyServerStats: () => (/* binding */ applyServerStats),
/* harmony export */   handleExplosionChecked: () => (/* binding */ handleExplosionChecked),
/* harmony export */   handleGameOver: () => (/* binding */ handleGameOver),
/* harmony export */   handlePlayerDamaged: () => (/* binding */ handlePlayerDamaged),
/* harmony export */   handleRemoteBomb: () => (/* binding */ handleRemoteBomb),
/* harmony export */   handleRemoteMove: () => (/* binding */ handleRemoteMove),
/* harmony export */   handleRemotePowerUpPicked: () => (/* binding */ handleRemotePowerUpPicked)
/* harmony export */ });
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pages/game */ "./src/pages/game.jsx");

function handleRemoteMove(payload) {
  if (!payload || !payload.id) {
    console.warn("[handleRemoteMove] Invalid payload:", payload);
    return;
  }
  let entity = this.playerEntities.get(String(payload.id));
  if (entity === undefined) {
    console.warn(`[handleRemoteMove] Entity not found for player ${payload.id}. Available players:`, Array.from(this.playerEntities.keys()));
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
  vel.direction = payload.direction || vel.direction;
  vel.isMoving = payload.isMoving;
  pos.gridX = payload.gridX;
  pos.gridY = payload.gridY;
  pos.targetX = payload.x;
  pos.targetY = payload.y;
  pos.x = payload.x;
  pos.y = payload.y;
  renderable.state = payload.state || (payload.isMoving ? 'RUN' : 'IDLE');
}
function handleRemoteBomb(payload) {
  if (!payload || !payload.id) return;
  this.createBomb(payload.id, payload.x, payload.y, payload.range || 2, payload.bombId);
}
function handleRemotePowerUpPicked(payload) {
  if (!payload || payload.x === undefined || payload.y === undefined) return;
  this.removePowerUpAt(payload.x, payload.y);
  const entity = this.playerEntities.get(String(payload.id));
  if (entity === undefined) return;
  if (payload.stats) {
    this.applyServerStats(entity, payload.stats);
  }
  if (entity === this.localPlayerEntity) {
    this.updateHudStats(entity);
  }
}
function applyServerStats(entity, stats) {
  const player = this.world.getComponent(entity, 'Player');
  const velocity = this.world.getComponent(entity, 'Velocity');
  if (!player || !stats) return;
  player.lives = stats.lives ?? player.lives;
  player.maxBombs = stats.maxBombs ?? player.maxBombs;
  player.bombRange = stats.bombRange ?? player.bombRange;
  player.alive = stats.alive ?? player.alive;
  if (velocity && typeof stats.speed === 'number') {
    velocity.speed = stats.speed;
  }
}
function handlePlayerDamaged(payload) {
  if (!payload || !payload.id) return;
  const entity = this.playerEntities.get(String(payload.id));
  if (entity === undefined) return;
  const player = this.world.getComponent(entity, 'Player');
  if (!player) return;
  const renderable = this.world.getComponent(entity, 'Renderable');
  if (renderable && renderable.el) {
    renderable.el.classList.remove('player-damaged');
    void renderable.el.offsetWidth;
    renderable.el.classList.add('player-damaged');
  }
  player.lives = payload.lives ?? player.lives;
  player.alive = payload.alive ?? player.alive;
  if (!player.alive) {
    const velocity = this.world.getComponent(entity, 'Velocity');
    if (velocity) velocity.isMoving = false;
    if (entity === this.localPlayerEntity) {
      this.world.removeComponent(entity, 'Input');
    }
  }
  if (entity === this.localPlayerEntity) {
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_0__.setLives)(player.lives);
  }
}
function handleGameOver(payload) {
  this.running = false;
  const winnerName = payload && payload.winnerName ? payload.winnerName : "A player";
  setTimeout(() => alert(`${winnerName} wins!`), 50);
}
function handleExplosionChecked(payload) {
  if (!payload) return;
  this.removeBomb(payload.bombId, payload.cells && payload.cells[0]);
  (payload.destroyedBlocks || []).forEach(cell => {
    this.updateMapCell(cell.x, cell.y, 2);
  });
  (payload.spawnedPowerUps || []).forEach(powerUp => {
    this.createPowerUp(powerUp.x, powerUp.y, powerUp.type);
  });
  (payload.cells || []).forEach(cell => {
    this.createExplosion(cell.x, cell.y, 500);
  });
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
function spawnHeartPowerUp(world, playerX, playerY, container, tileSize = 64) {
  // Create a new entity for the heart power-up
  const heartEntity = world.createEntity();

  // CRITICAL ALIGNMENT FIX: Snap the heart to the game's grid using actual tileSize
  const snappedX = Math.round(playerX / tileSize) * tileSize;
  const snappedY = Math.round(playerY / tileSize) * tileSize;
  const gridX = Math.round(playerX / tileSize);
  const gridY = Math.round(playerY / tileSize);

  // Add Position component with correct gridX/gridY for collision detection
  world.addComponent(heartEntity, 'Position', {
    gridX: gridX,
    gridY: gridY,
    x: snappedX,
    y: snappedY
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
  heartDiv.style.left = snappedX + 'px';
  heartDiv.style.top = snappedY + 'px';
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
  console.log(`[Heart Drop] Spawned at grid (${gridX}, ${gridY}), pixel (${snappedX}, ${snappedY}), tileSize=${tileSize}`);
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
    spawnHeartPowerUp(world, position.x, position.y, gameContainer, tileSize);
  }
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

/***/ "./src/ecs/systems/powerUpSystem.js"
/*!******************************************!*\
  !*** ./src/ecs/systems/powerUpSystem.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   powerUpSystem: () => (/* binding */ powerUpSystem)
/* harmony export */ });
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pages/game */ "./src/pages/game.jsx");

function powerUpSystem(world, onPowerUpPicked) {
  const players = world.query('Position', 'Velocity', 'Player');
  const powerUps = world.query('Position', 'PowerUp');
  for (const playerEntity of players) {
    const pPos = world.getComponent(playerEntity, 'Position');
    const vel = world.getComponent(playerEntity, 'Velocity');
    const player = world.getComponent(playerEntity, 'Player');
    if (!pPos || !vel || !player) continue;

    // ONLY local player handles collision to avoid multi-pickup bugs
    if (!player.isLocal) continue;
    for (const pUpEntity of powerUps) {
      const upPos = world.getComponent(pUpEntity, 'Position');
      const pUp = world.getComponent(pUpEntity, 'PowerUp');
      if (!upPos || !pUp || pUp.pickedUp) continue;

      // Grid-based collision: player grid position matches power-up grid position
      if (pPos.gridX === upPos.gridX && pPos.gridY === upPos.gridY) {
        pUp.pickedUp = true;
        if (pUp.type === 'HEART') {
          // 2. Increment the player's lives
          player.lives += 1;

          // 3. Update the UI lives counter immediately on the screen
          (0,_pages_game__WEBPACK_IMPORTED_MODULE_0__.setLives)(player.lives);
        }

        // 1. Remove the specific Heart DOM element from the screen immediately
        if (pUp.el && pUp.el.parentNode) {
          pUp.el.parentNode.removeChild(pUp.el);
        }

        // Notify game.js via callback for any server sync needed
        if (onPowerUpPicked) {
          onPowerUpPicked(player.id, pUp.type, upPos.gridX, upPos.gridY);
        }

        // 4. Remove the heart from the active game state so it cannot be triggered twice
        world.destroyEntity(pUpEntity);
        break;
      }
    }
  }
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
/* harmony import */ var _mini_framework_mini_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/mini-framework */ "./mini-framework/mini-framework.js");


function KickedMenu() {
  const returnBtn = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    class: "replay-button"
  }, "Return to Main Menu");
  returnBtn.addEventListener("click", () => {
    if (window.socket && window.socket.readyState === WebSocket.OPEN) {
      window.socket.send(JSON.stringify({
        type: "leave_room"
      }));
    }
    _mini_framework_mini_framework__WEBPACK_IMPORTED_MODULE_1__["default"].navigate("/");
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
/* harmony import */ var _mini_framework_mini_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/mini-framework */ "./mini-framework/mini-framework.js");


function WinMenu(props) {
  const winnerName = props.winnerName || "A Player";
  const replayBtn = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    class: "replay-button"
  }, "Play Again");
  replayBtn.addEventListener("click", () => {
    if (window.socket && window.socket.readyState === WebSocket.OPEN) {
      window.socket.send(JSON.stringify({
        type: "leave_room"
      }));
    }
    _mini_framework_mini_framework__WEBPACK_IMPORTED_MODULE_1__["default"].navigate("/");
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
  const boardDisplayWidth = (boardWidth + GRID_BORDER_SIZE * 2) * 0.80;
  const boardDisplayHeight = (boardHeight + GRID_BORDER_SIZE * 2) * 0.80;
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
    style: `width:${boardDisplayWidth}px;height:${boardDisplayHeight}px;`
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: "game-container",
    class: "game-grid",
    style: `position:relative;width:${boardWidth}px;height:${boardHeight}px;transform:scale(0.80);`
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
  textEl.textContent = s.text;
  if (s.secondsLeft) timerEl.textContent = "Time : " + s.secondsLeft;else timerEl.textContent = "";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixJQUFJLENBQUNWLE1BQU0sQ0FBQ3BhLFlBQVksQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDO01BQ3ZELElBQUksQ0FBQ3lhLFlBQVksQ0FBQyxDQUFDO0lBQ3ZCO0VBQ0o7RUFFQUEsWUFBWUEsQ0FBQSxFQUFHO0lBQ1gsTUFBTU0sT0FBTyxHQUFHLElBQUksQ0FBQ2IsS0FBSyxDQUFDWSxLQUFLLElBQUksSUFBSSxDQUFDWixLQUFLLENBQUNXLE1BQU07SUFFckQsSUFBSSxDQUFDUixJQUFJLENBQUNwVixTQUFTLEdBQUc4VixPQUFPLEdBQUcsd0JBQXdCLEdBQUcseUJBQXlCO0lBQ3BGLElBQUksQ0FBQ1gsTUFBTSxDQUFDekYsU0FBUyxDQUFDNkYsTUFBTSxDQUFDLFVBQVUsRUFBRU8sT0FBTyxDQUFDO0VBQ3JEO0FBQ0o7QUFFQSxpRUFBZTlXLEtBQUssRTs7Ozs7O1VDakRwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQzVCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2hhdC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS9lbnRpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUvaHVkLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS9pbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUvbGlmZWN5Y2xlLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS9wbGF5ZXJOYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS9yZW1vdGVIYW5kbGVycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy93b3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvS2lja2VkTWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL1dpbk1lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyLCB7IHNldEVycm9yIH0gZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCBXaW5NZW51IGZyb20gXCIuLi9wYWdlcy9XaW5NZW51LmpzeFwiO1xuaW1wb3J0IEtpY2tlZE1lbnUgZnJvbSBcIi4uL3BhZ2VzL0tpY2tlZE1lbnUuanN4XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuaW1wb3J0IHsgaGFuZGxlUGxheWVyRGVhdGggfSBmcm9tIFwiLi4vZWNzL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBUSUxFX1NJWkUgfSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChgd3M6Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZX06NTAwMGApO1xud2luZG93LnNvY2tldCA9IHdzcztcbmNvbnN0IHNvdW5kID0gbmV3IFNvdW5kKFwiLi9hc3NldHMvc291bmRzL2JhY2tncm91bmRfbXVzaWMubXAzXCIpO1xubGV0IGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcblxuc291bmQuaW5pdCgpO1xuXG5yb3V0ZXIub24oXCIvXCIsICgpID0+IHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwicmVnaXN0ZXItcGFnZVwiO1xuICAgIHNldE1lc3NhZ2VzKFtdKTtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKHdzKSA9PiB7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJsb2JieV91cGRhdGVcIjpcbiAgICAgICAgICAgIGlmICghcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmNvbmF0aW5lci1sb2JieVwiKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcig8TG9iYnkgLz4sIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogbWVzc2FnZS5wbGF5ZXJzQ291bnQsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IG1lc3NhZ2Uuc2Vjb25kc0xlZnQsXG4gICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwibG9iYnlfcmVzZXRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuICAgICAgICAgICAgaWYgKCFyb290LnF1ZXJ5U2VsZWN0b3IoXCIuY29uYXRpbmVyLWxvYmJ5XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKDxMb2JieSAvPiwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgIHJvb21JZDogXCJcIixcbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IDEsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IDIwLFxuICAgICAgICAgICAgICAgIHRleHQ6IFwiV2FpdGluZyBmb3IgbW9yZSBwbGF5ZXJzXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNldE1lc3NhZ2VzKFtdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJnYW1lX3N0YXJ0ZWRcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJnYW1lLXBhZ2VcIjtcblxuICAgICAgICAgICAgcmVuZGVyKDxHYW1lIGdyaWQ9e21lc3NhZ2UuZ3JpZH0gLz4sIHJvb3QpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvbnRhaW5lclwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSAobWVzc2FnZS5wbGF5ZXJzIHx8IFtdKS5maW5kKHBsYXllciA9PiBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UueW91clBsYXllcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIGxvY2FsUGxheWVyLm5pY2tuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIdWRQbGF5ZXJOYW1lKGxvY2FsUGxheWVyLm5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBHYW1lRW5naW5lKGdhbWVDb250YWluZXIsIG1lc3NhZ2UuZ3JpZCwgd3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lLmluaXQobWVzc2FnZS55b3VyUGxheWVySWQsIG1lc3NhZ2UucGxheWVycyB8fCBbXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBlbmdpbmU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiBcImxlYXZlX3Jvb21cIiB9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoS2lja2VkTWVudSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIGZ1bmN0aW9uIG9uQUZLKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIG9uQUZLKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHsgdHlwZTogXCJsZWF2ZV9yb29tXCIgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoS2lja2VkTWVudSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2FtZSBjb250YWluZXIgd2FzIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwicm9vbV9hbG9uZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJnYW1lX3dvblwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoV2luTWVudSh7IHdpbm5lck5hbWU6IG1lc3NhZ2Uud2lubmVyTmFtZSB9KSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwicGxheWVyX3R1cm5lZF9oZWFydFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gY3VycmVudEdhbWVFbmdpbmUucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhtZXNzYWdlLnBsYXllcklkKSk7XG4gICAgICAgICAgICAgICAgaWYgKGVudGl0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlUGxheWVyRGVhdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVBsYXllckRlYXRoKGN1cnJlbnRHYW1lRW5naW5lLndvcmxkLCBlbnRpdHksIFRJTEVfU0laRSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5wbGF5ZXJFbnRpdGllcy5kZWxldGUoU3RyaW5nKG1lc3NhZ2UucGxheWVySWQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2LCB7XG4gICAgICAgICAgICAgICAgbmlja25hbWU6IG1lc3NhZ2Uubmlja25hbWUgfHwgXCJQbGF5ZXJcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLm1lc3NhZ2UsXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBsYXllcl9tb3ZlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlTW92ZShtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib21iX2Ryb3BwZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZUJvbWIobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicG93ZXJ1cF9waWNrZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZXhwbG9zaW9uX2NoZWNrZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZUV4cGxvc2lvbkNoZWNrZWQobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX2RhbWFnZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVBsYXllckRhbWFnZWQobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZ2FtZV9vdmVyXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVHYW1lT3ZlcihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID09PSBcInJlZ2lzdGVyLXBhZ2VcIikge1xuICAgICAgICAgICAgICAgIHNldEVycm9yKG1lc3NhZ2UubWVzc2FnZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvclwiLCBlcnIpO1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdzcztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgd3NzIGZyb20gXCIuLi9hcHAvYXBwXCI7XG5cbmNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gY3JlYXRlU2lnbmFsKFtdKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzIH07XG5cbmZ1bmN0aW9uIENoYXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IG1lc3NhZ2VzQ29udGFpbmVyID0gPGRpdiBjbGFzcz1cIm1lc3NhZ2VzXCI+PC9kaXY+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNncyA9IG1lc3NhZ2VzKCk7XG4gICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgbXNnIG9mIG1zZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbXNnID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IG1zZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IGAke21zZy5uaWNrbmFtZX06ICR7bXNnLm1lc3NhZ2V9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHApO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIucmVtb3ZlQ2hpbGQobWVzc2FnZXNDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgICAgIG1zZ3MudW5zaGlmdCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYnJvYWRjYXN0TWVzc2FnZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS50YXJnZXQpO1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGZvcm1EYXRhLmdldChcIm1lc3NhZ2VcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbWVzc2FnZSB8fCBtZXNzYWdlLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwiY2hhdF9tZXNzYWdlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICB9KSk7XG4gICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNoYXRcIiBvblN1Ym1pdD17YnJvYWRjYXN0TWVzc2FnZX0+XG4gICAgICAgICAgICB7bWVzc2FnZXNDb250YWluZXJ9XG4gICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibWVzc2FnZVwiIHBsYWNlaG9sZGVyPVwidHlwZSB0byB0aGUgb3RoZXIgcGxheWVycyAuLi5cIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5zZW5kPC9idXR0b24+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhdFBsYXllcnM7XG4iLCIvLyAvc3JjL2Vjcy9jb21wb25lbnRzLmpzXG5cbmV4cG9ydCBjb25zdCBQb3NpdGlvbkNvbXBvbmVudCA9IChneCwgZ3ksIHRpbGVTaXplID0gNjQpID0+ICh7XG4gICAgZ3JpZFg6IGd4LFxuICAgIGdyaWRZOiBneSxcbiAgICB4OiBneCAqIHRpbGVTaXplLFxuICAgIHk6IGd5ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRZOiBneSAqIHRpbGVTaXplXG59KTtcblxuZXhwb3J0IGNvbnN0IFZlbG9jaXR5Q29tcG9uZW50ID0gKGJhc2VTcGVlZCA9IDIuNSkgPT4gKHtcbiAgICBiYXNlU3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBzcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkQm9vc3Q6IDAsXG4gICAgc3BlZWRCb29zdFRpbWVSZW1haW5pbmc6IDAsXG4gICAgaXNNb3Zpbmc6IGZhbHNlLFxuICAgIGRpcmVjdGlvbjogJ2Rvd24nXG59KTtcblxuZXhwb3J0IGNvbnN0IElucHV0Q29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBpbnB1dFF1ZXVlOiBbXVxufSk7XG5cbmV4cG9ydCBjb25zdCBSZW5kZXJhYmxlQ29tcG9uZW50ID0gKGVsLCBmcmFtZVdpZHRoID0gNjQsIGZyYW1lSGVpZ2h0ID0gNjQsIHRvdGFsRnJhbWVzID0gNCwgZnBzID0gMTIpID0+ICh7XG4gICAgZWw6IGVsLFxuICAgIGZyYW1lV2lkdGg6IGZyYW1lV2lkdGgsXG4gICAgZnJhbWVIZWlnaHQ6IGZyYW1lSGVpZ2h0LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogdG90YWxGcmFtZXMsXG4gICAgcnVuRnJhbWVzOiA0LFxuICAgIGlkbGVGcmFtZXM6IDIsXG4gICAgZnBzOiBmcHMsXG4gICAgaWRsZUZwczogNCxcbiAgICBsYXN0RnJhbWVUaW1lOiAwLFxuICAgIHJvdzogMCxcbiAgICBzdGF0ZTogJ0lETEUnLFxuICAgIGxhc3RTdGF0ZTogJ0lETEUnXG59KTtcblxuZXhwb3J0IGNvbnN0IFBsYXllckNvbXBvbmVudCA9IChpZCwgY2hhclR5cGUsIGlzTG9jYWwgPSBmYWxzZSkgPT4gKHtcbiAgICBpZDogaWQsXG4gICAgY2hhclR5cGU6IGNoYXJUeXBlLFxuICAgIGlzTG9jYWw6IGlzTG9jYWxcbn0pO1xuXG5leHBvcnQgY29uc3QgQm9tYkNvbXBvbmVudCA9IChvd25lcklkLCB0aW1lciA9IDIwMDAsIHJhbmdlID0gMikgPT4gKHtcbiAgICBvd25lcklkOiBvd25lcklkLFxuICAgIHRpbWVyOiB0aW1lcixcbiAgICByYW5nZTogcmFuZ2UsXG4gICAgZXhwbG9kZWQ6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEV4cGxvc2lvbkNvbXBvbmVudCA9IChkdXJhdGlvbiA9IDUwMCkgPT4gKHtcbiAgICBkdXJhdGlvbjogZHVyYXRpb25cbn0pO1xuXG5leHBvcnQgY29uc3QgUG93ZXJVcENvbXBvbmVudCA9ICh0eXBlKSA9PiAoe1xuICAgIHR5cGU6IHR5cGUsIFxuICAgIHBpY2tlZFVwOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBCZWhhdmlvckNvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgZmFzdFNob2VzTGV2ZWw6IDEsXG4gICAgYm9tYnM6IHtcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICByYW5nZTogMlxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkLmpzJztcbmltcG9ydCB7IGluaXQsIHJlZ2lzdGVyU3lzdGVtcywgZ2FtZUxvb3AsIGRlc3Ryb3kgfSBmcm9tICcuL2dhbWUvbGlmZWN5Y2xlLmpzJztcbmltcG9ydCB7IHNldHVwSW5wdXQsIHNlbmRJbnB1dCwgZHJvcEJvbWIgfSBmcm9tICcuL2dhbWUvaW5wdXQuanMnO1xuaW1wb3J0IHsgY3JlYXRlQm9tYiwgcmVtb3ZlUG93ZXJVcEF0LCB1cGRhdGVNYXBDZWxsLCByZW1vdmVCb21iLCBjcmVhdGVFeHBsb3Npb24sIGNyZWF0ZVBvd2VyVXAgfSBmcm9tICcuL2dhbWUvZW50aXRpZXMuanMnO1xuaW1wb3J0IHtcbiAgICBoYW5kbGVSZW1vdGVNb3ZlLFxuICAgIGhhbmRsZVJlbW90ZUJvbWIsXG4gICAgaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZCxcbiAgICBhcHBseVNlcnZlclN0YXRzLFxuICAgIGhhbmRsZVBsYXllckRhbWFnZWQsXG4gICAgaGFuZGxlR2FtZU92ZXIsXG4gICAgaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZFxufSBmcm9tICcuL2dhbWUvcmVtb3RlSGFuZGxlcnMuanMnO1xuaW1wb3J0IHsgdXBkYXRlSHVkU3RhdHMgfSBmcm9tICcuL2dhbWUvaHVkLmpzJztcblxuZXhwb3J0IHsgc2V0UGxheWVyTmFtZSwgZ2V0UGxheWVyTmFtZSB9IGZyb20gJy4vZ2FtZS9wbGF5ZXJOYW1lLmpzJztcblxuZXhwb3J0IGNsYXNzIEdhbWVFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0NvbnRhaW5lciwgbWFwRGF0YSwgc29ja2V0KSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY2FudmFzQ29udGFpbmVyO1xuICAgICAgICB0aGlzLm1hcERhdGEgPSBtYXBEYXRhO1xuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xuICAgICAgICB0aGlzLmxvY2FsUGxheWVyRW50aXR5ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IDA7XG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmxhc3RJbnB1dFNlbnQgPSBcIlwiO1xuICAgIH1cblxuICAgIGluaXQgPSBpbml0O1xuICAgIHNldHVwSW5wdXQgPSBzZXR1cElucHV0O1xuICAgIHNlbmRJbnB1dCA9IHNlbmRJbnB1dDtcbiAgICBkcm9wQm9tYiA9IGRyb3BCb21iO1xuICAgIGNyZWF0ZUJvbWIgPSBjcmVhdGVCb21iO1xuICAgIGhhbmRsZVJlbW90ZU1vdmUgPSBoYW5kbGVSZW1vdGVNb3ZlO1xuICAgIGhhbmRsZVJlbW90ZUJvbWIgPSBoYW5kbGVSZW1vdGVCb21iO1xuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQgPSBoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkO1xuICAgIHJlbW92ZVBvd2VyVXBBdCA9IHJlbW92ZVBvd2VyVXBBdDtcbiAgICBhcHBseVNlcnZlclN0YXRzID0gYXBwbHlTZXJ2ZXJTdGF0cztcbiAgICBoYW5kbGVQbGF5ZXJEYW1hZ2VkID0gaGFuZGxlUGxheWVyRGFtYWdlZDtcbiAgICBoYW5kbGVHYW1lT3ZlciA9IGhhbmRsZUdhbWVPdmVyO1xuICAgIGhhbmRsZUV4cGxvc2lvbkNoZWNrZWQgPSBoYW5kbGVFeHBsb3Npb25DaGVja2VkO1xuICAgIHVwZGF0ZU1hcENlbGwgPSB1cGRhdGVNYXBDZWxsO1xuICAgIHJlbW92ZUJvbWIgPSByZW1vdmVCb21iO1xuICAgIGNyZWF0ZUV4cGxvc2lvbiA9IGNyZWF0ZUV4cGxvc2lvbjtcbiAgICBjcmVhdGVQb3dlclVwID0gY3JlYXRlUG93ZXJVcDtcbiAgICByZWdpc3RlclN5c3RlbXMgPSByZWdpc3RlclN5c3RlbXM7XG4gICAgZ2FtZUxvb3AgPSBnYW1lTG9vcDtcbiAgICBkZXN0cm95ID0gZGVzdHJveTtcbiAgICB1cGRhdGVIdWRTdGF0cyA9IHVwZGF0ZUh1ZFN0YXRzO1xufVxuIiwiZXhwb3J0IGNvbnN0IFNQUklURV9DT0xVTU5TID0gMTM7XG5leHBvcnQgY29uc3QgU1BSSVRFX1JPV1MgPSA1NDtcblxuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9ST1dTID0ge1xuICAgIFJVTjogeyB1cDogMzgsIGxlZnQ6IDM5LCBkb3duOiA0MCwgcmlnaHQ6IDQxIH0sXG4gICAgSURMRTogeyB1cDogMjIsIGxlZnQ6IDIzLCBkb3duOiAyNCwgcmlnaHQ6IDI1IH1cbn07XG4iLCJpbXBvcnQgeyBCb21iQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy5qcyc7XG5pbXBvcnQgeyBUSUxFX1NJWkUgfSBmcm9tICcuLi8uLi9wYWdlcy9nYW1lJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJvbWIob3duZXJJZCwgZ3JpZFgsIGdyaWRZLCByYW5nZSwgYm9tYklkID0gbnVsbCkge1xuICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IGJvbWIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCb21iJyk7XG4gICAgICAgIHJldHVybiAoYm9tYklkICYmIGJvbWIuYm9tYklkID09PSBib21iSWQpIHx8XG4gICAgICAgICAgICAoYm9tYi5vd25lcklkID09PSBvd25lcklkICYmIHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWSk7XG4gICAgfSk7XG5cbiAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBib21iRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICBjb25zdCBib21iRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgYm9tYkRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgYm9tYkRpdi5zdHlsZS53aWR0aCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgYm9tYkRpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGJvbWJEaXYuc3R5bGUubGVmdCA9IGAke2dyaWRYICogVElMRV9TSVpFfXB4YDtcbiAgICBib21iRGl2LnN0eWxlLnRvcCA9IGAke2dyaWRZICogVElMRV9TSVpFfXB4YDtcbiAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChib21iRGl2KTtcblxuICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFgsIGdyaWRZIH0pO1xuXG4gICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICBib21iQ29tcC5ib21iSWQgPSBib21iSWQ7XG4gICAgYm9tYkNvbXAuZWwgPSBib21iRGl2O1xuICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdCb21iJywgYm9tYkNvbXApO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlUG93ZXJVcEF0KGdyaWRYLCBncmlkWSkge1xuICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHtncmlkWH0sJHtncmlkWX1gKTtcbiAgICBjb25zdCBwb3dlclVwcyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBvd2VyVXAgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgIGlmICghcG9zIHx8ICFwb3dlclVwKSBjb250aW51ZTtcblxuICAgICAgICBpZiAocG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZKSB7XG4gICAgICAgICAgICBwb3dlclVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHBvd2VyVXAuZWwgJiYgcG93ZXJVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgcG93ZXJVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvd2VyVXAuZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLndvcmxkLmRlc3Ryb3lFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU1hcENlbGwoeCwgeSwgbmV3VmFsdWUpIHtcbiAgICBpZiAoIXRoaXMubWFwRGF0YVt5XSkgcmV0dXJuO1xuXG4gICAgdGhpcy5tYXBEYXRhW3ldW3hdID0gbmV3VmFsdWU7XG5cbiAgICBjb25zdCB0aWxlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWApO1xuICAgIGlmICghdGlsZSkgcmV0dXJuO1xuXG4gICAgdGlsZS5jbGFzc05hbWUgPSAndGlsZSB0aWxlLWZsb29yJztcbiAgICB0aWxlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIpJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUJvbWIoYm9tYklkLCBmYWxsYmFja0NlbGwpIHtcbiAgICBjb25zdCBib21icyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGJvbWJzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IGJvbWIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCb21iJyk7XG4gICAgICAgIGNvbnN0IHNhbWVJZCA9IGJvbWJJZCAmJiBib21iICYmIGJvbWIuYm9tYklkID09PSBib21iSWQ7XG4gICAgICAgIGNvbnN0IHNhbWVDZWxsID0gZmFsbGJhY2tDZWxsICYmIHBvcyAmJiBwb3MuZ3JpZFggPT09IGZhbGxiYWNrQ2VsbC54ICYmIHBvcy5ncmlkWSA9PT0gZmFsbGJhY2tDZWxsLnk7XG5cbiAgICAgICAgaWYgKCFzYW1lSWQgJiYgIXNhbWVDZWxsKSBjb250aW51ZTtcblxuICAgICAgICBpZiAoYm9tYi5lbCAmJiBib21iLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChib21iLmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRXhwbG9zaW9uKGdyaWRYLCBncmlkWSwgZHVyYXRpb24pIHtcbiAgICBjb25zdCBleHBFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIGNvbnN0IGV4cERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGV4cERpdi5jbGFzc05hbWUgPSAnZXhwbG9zaW9uJztcbiAgICBleHBEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGV4cERpdi5zdHlsZS53aWR0aCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgZXhwRGl2LnN0eWxlLmhlaWdodCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgZXhwRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgZXhwRGl2LnN0eWxlLnRvcCA9IGAke2dyaWRZICogVElMRV9TSVpFfXB4YDtcbiAgICBleHBEaXYuc3R5bGUuekluZGV4ID0gJzcnO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGV4cERpdik7XG5cbiAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFgsIGdyaWRZLCB4OiBncmlkWCAqIFRJTEVfU0laRSwgeTogZ3JpZFkgKiBUSUxFX1NJWkUgfSk7XG4gICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJywgeyBkdXJhdGlvbiwgZWw6IGV4cERpdiB9KTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoZXhwRGl2LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGV4cERpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGV4cERpdik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGV4cEVudGl0eSk7XG4gICAgfSwgZHVyYXRpb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUG93ZXJVcChneCwgZ3ksIHR5cGUpIHtcbiAgICBpZiAoIXR5cGUgfHwgdGhpcy5jbGFpbWVkUG93ZXJVcHMuaGFzKGAke2d4fSwke2d5fWApKSByZXR1cm47XG5cbiAgICBjb25zdCBwVXBFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWDogZ3gsIGdyaWRZOiBneSwgeDogZ3ggKiBUSUxFX1NJWkUsIHk6IGd5ICogVElMRV9TSVpFIH0pO1xuXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9IGBwb3dlcnVwIHBvd2VydXAtJHt0eXBlLnRvTG93ZXJDYXNlKCl9YDtcbiAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgZGl2LnN0eWxlLmhlaWdodCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSBgJHtneCAqIFRJTEVfU0laRX1weGA7XG4gICAgZGl2LnN0eWxlLnRvcCA9IGAke2d5ICogVElMRV9TSVpFfXB4YDtcbiAgICBkaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJywgeyB0eXBlLCBlbDogZGl2IH0pO1xufVxuIiwiaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQgfSBmcm9tICcuLi8uLi9wYWdlcy9nYW1lJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUh1ZFN0YXRzKGVudGl0eSkge1xuICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgIHNldEJvbWJzKHBsYXllci5tYXhCb21icyB8fCAxKTtcbiAgICBzZXRMaXZlcyhwbGF5ZXIubGl2ZXMgPz8gMyk7XG4gICAgc2V0UmFuZ2UocGxheWVyLmJvbWJSYW5nZSB8fCA0KTtcbiAgICBzZXRTcGVlZChNYXRoLnJvdW5kKHZlbG9jaXR5LnNwZWVkKSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc2V0dXBJbnB1dCgpIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgIGlmICghaW5wdXQpIHJldHVybjtcblxuICAgIGNvbnN0IGdldEtleURpcmVjdGlvbiA9IChrZXkpID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93VXAnIHx8IGtleSA9PT0gJ3cnIHx8IGtleSA9PT0gJ1onIHx8IGtleSA9PT0gJ3onKSByZXR1cm4gJ3VwJztcbiAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93RG93bicgfHwga2V5ID09PSAncycgfHwga2V5ID09PSAnUycpIHJldHVybiAnZG93bic7XG4gICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0xlZnQnIHx8IGtleSA9PT0gJ2EnIHx8IGtleSA9PT0gJ1EnIHx8IGtleSA9PT0gJ3EnKSByZXR1cm4gJ2xlZnQnO1xuICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dSaWdodCcgfHwga2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpIHJldHVybiAncmlnaHQnO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmICghaW5wdXQuaW5wdXRRdWV1ZS5pbmNsdWRlcyhkaXIpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZS51bnNoaWZ0KGRpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbmRJbnB1dChpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZS5rZXkgPT09ICcgJyB8fCBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcEJvbWIoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBoYW5kbGVLZXlVcCA9IChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUgPSBpbnB1dC5pbnB1dFF1ZXVlLmZpbHRlcihkID0+IGQgIT09IGRpcik7XG4gICAgICAgICAgICB0aGlzLnNlbmRJbnB1dChpbnB1dCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG5cbiAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRJbnB1dChpbnB1dCkge1xuICAgIGlmICghdGhpcy5zb2NrZXQgfHwgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHJldHVybjtcbiAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgIGlmICghcGxheWVyIHx8ICFwbGF5ZXIuYWxpdmUpIHJldHVybjtcblxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IGlucHV0LmlucHV0UXVldWVbMF0gfHwgbnVsbDtcbiAgICBjb25zdCBpc01vdmluZyA9IEJvb2xlYW4oZGlyZWN0aW9uKTtcbiAgICBjb25zdCBpbnB1dFN0YXRlID0gYCR7ZGlyZWN0aW9uIHx8ICdpZGxlJ306JHtpc01vdmluZyA/IDEgOiAwfWA7XG5cbiAgICBpZiAodGhpcy5sYXN0SW5wdXRTZW50ID09PSBpbnB1dFN0YXRlKSByZXR1cm47XG4gICAgdGhpcy5sYXN0SW5wdXRTZW50ID0gaW5wdXRTdGF0ZTtcblxuICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB0eXBlOiAnTU9WRV9TVEFURScsXG4gICAgICAgIHBheWxvYWQ6IHsgZGlyZWN0aW9uLCBpc01vdmluZyB9XG4gICAgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJvcEJvbWIoKSB7XG4gICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICBpZiAoIXBsYXllciB8fCAhcGxheWVyLmFsaXZlKSByZXR1cm47XG5cbiAgICBjb25zdCBjdXJyZW50Qm9tYnMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuZmlsdGVyKGJFbnRpdHkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoYkVudGl0eSwgJ0JvbWInKS5vd25lcklkID09PSBwbGF5ZXIuaWQ7XG4gICAgfSk7XG5cbiAgICBpZiAoY3VycmVudEJvbWJzLmxlbmd0aCA+PSBwbGF5ZXIubWF4Qm9tYnMpIHJldHVybjtcblxuICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdEUk9QX0JPTUInLFxuICAgICAgICAgICAgcGF5bG9hZDoge31cbiAgICAgICAgfSkpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7XG4gICAgUG9zaXRpb25Db21wb25lbnQsXG4gICAgVmVsb2NpdHlDb21wb25lbnQsXG4gICAgSW5wdXRDb21wb25lbnQsXG4gICAgUmVuZGVyYWJsZUNvbXBvbmVudCxcbiAgICBQbGF5ZXJDb21wb25lbnRcbn0gZnJvbSAnLi4vY29tcG9uZW50cy5qcyc7XG5pbXBvcnQgeyByZW5kZXJTeXN0ZW0gfSBmcm9tICcuLi9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyc7XG5pbXBvcnQgeyBwb3dlclVwU3lzdGVtIH0gZnJvbSAnLi4vc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzJztcbmltcG9ydCB7IFRJTEVfU0laRSB9IGZyb20gJy4uLy4uL3BhZ2VzL2dhbWUnO1xuaW1wb3J0IHsgQU5JTUFUSU9OX1JPV1MsIFNQUklURV9DT0xVTU5TLCBTUFJJVEVfUk9XUyB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQobG9jYWxQbGF5ZXJJZCwgYWxsUGxheWVycykge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkID0gU3RyaW5nKGxvY2FsUGxheWVySWQpO1xuXG4gICAgYWxsUGxheWVycy5mb3JFYWNoKHBEYXRhID0+IHtcbiAgICAgICAgY29uc3QgcGxheWVySWQgPSBTdHJpbmcocERhdGEuaWQpO1xuICAgICAgICBjb25zdCBwbGF5ZXJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29uc3QgY29sb3IgPSBwRGF0YS5jb2xvciB8fCBcIndoaXRlXCI7XG5cbiAgICAgICAgcGxheWVyRGl2LmNsYXNzTmFtZSA9IGBwbGF5ZXIgcGxheWVyLSR7Y29sb3J9YDtcbiAgICAgICAgcGxheWVyRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgcGxheWVyRGl2LnN0eWxlLnpJbmRleCA9ICcxMCc7XG4gICAgICAgIHBsYXllckRpdi5zdHlsZS53aWxsQ2hhbmdlID0gJ3RyYW5zZm9ybSc7XG4gICAgICAgIHBsYXllckRpdi5zdHlsZS53aWR0aCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgICAgIHBsYXllckRpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBgJHtTUFJJVEVfQ09MVU1OUyAqIFRJTEVfU0laRX1weCAke1NQUklURV9ST1dTICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyRGl2KTtcblxuICAgICAgICBjb25zdCBzeCA9IHBEYXRhLnggfHwgMTtcbiAgICAgICAgY29uc3Qgc3kgPSBwRGF0YS55IHx8IDE7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nLCBQb3NpdGlvbkNvbXBvbmVudChzeCwgc3ksIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScsIFZlbG9jaXR5Q29tcG9uZW50KHBEYXRhLnNwZWVkIHx8IDIuNSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJywgUmVuZGVyYWJsZUNvbXBvbmVudChwbGF5ZXJEaXYsIFRJTEVfU0laRSwgVElMRV9TSVpFLCA0LCAxMilcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBpc0xvY2FsID0gcGxheWVySWQgPT09IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkO1xuICAgICAgICBjb25zdCBwbGF5ZXJDb21wID0gUGxheWVyQ29tcG9uZW50KHBsYXllcklkLCBjb2xvciwgaXNMb2NhbCk7XG4gICAgICAgIHBsYXllckNvbXAubGl2ZXMgPSBwRGF0YS5saXZlcyA/PyAzO1xuICAgICAgICBwbGF5ZXJDb21wLm1heEJvbWJzID0gcERhdGEubWF4Qm9tYnMgPz8gMTtcbiAgICAgICAgcGxheWVyQ29tcC5ib21iUmFuZ2UgPSBwRGF0YS5ib21iUmFuZ2UgPz8gMjtcbiAgICAgICAgcGxheWVyQ29tcC5hbGl2ZSA9IHBEYXRhLmFsaXZlID8/IHRydWU7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicsIHBsYXllckNvbXApO1xuICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzLnNldChwbGF5ZXJJZCwgcGxheWVyRW50aXR5KTtcblxuICAgICAgICBpZiAoaXNMb2NhbCkge1xuICAgICAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ0lucHV0JywgSW5wdXRDb21wb25lbnQoKSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHBsYXllckVudGl0eSk7XG4gICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiW0dhbWVFbmdpbmVdIExvY2FsIHBsYXllciB3YXMgbm90IGZvdW5kXCIsIHtcbiAgICAgICAgICAgIGxvY2FsUGxheWVySWQsXG4gICAgICAgICAgICBwbGF5ZXJzOiBhbGxQbGF5ZXJzLm1hcChwbGF5ZXIgPT4gcGxheWVyLmlkKSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWdpc3RlclN5c3RlbXMoKTtcblxuICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgdGhpcy5sYXN0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5vdykgPT4gdGhpcy5nYW1lTG9vcChub3cpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyU3lzdGVtcygpIHtcbiAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcmVuZGVyU3lzdGVtKHcsIGR0LCBub3csIEFOSU1BVElPTl9ST1dTKSk7XG4gICAgXG4gICAgLy8gUmVnaXN0ZXIgdGhlIGxvY2FsIHBvd2VyLXVwIGNvbGxpc2lvbiBzeXN0ZW1cbiAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcG93ZXJVcFN5c3RlbSh3LCAocGxheWVySWQsIHR5cGUsIGdyaWRYLCBncmlkWSkgPT4ge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ0hFQVJUJyAmJiB0aGlzLmxvY2FsUGxheWVyRW50aXR5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEhVRCBpbW1lZGlhdGVseSB3aGVuIGEgaGVhcnQgaXMgcGlja2VkIHVwXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBCcm9hZGNhc3QgaGVhcnQgcGlja3VwIHRvIGFsbCBwbGF5ZXJzIHNvIHRoZXkgcmVtb3ZlIGl0IGZyb20gdGhlaXIgc2NyZWVuXG4gICAgICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPV0VSVVBfUElDS0VEJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZDogcGxheWVySWQsIHR5cGU6IHR5cGUsIHg6IGdyaWRYLCB5OiBncmlkWSB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2FtZUxvb3Aobm93KSB7XG4gICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHJldHVybjtcblxuICAgIGNvbnN0IGR0ID0gbm93IC0gdGhpcy5sYXN0VGltZTtcbiAgICB0aGlzLmxhc3RUaW1lID0gbm93O1xuICAgIHRoaXMud29ybGQudXBkYXRlKGR0LCBub3cpO1xuICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHModGhpcy5sb2NhbFBsYXllckVudGl0eSk7XG4gICAgfVxuICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5leHROb3cpID0+IHRoaXMuZ2FtZUxvb3AobmV4dE5vdykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMoKTtcbiAgICB9XG59XG4iLCJsZXQgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IFwiXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKG5hbWUpIHtcbiAgICBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gbmFtZTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiLCBuYW1lKTtcbiAgICBjb25zb2xlLmxvZyhcIlBsYXllciByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVwiLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXllck5hbWUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgfHwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIikgfHwgXCJQbGF5ZXJcIjtcbn1cbiIsImltcG9ydCB7IHNldExpdmVzIH0gZnJvbSAnLi4vLi4vcGFnZXMvZ2FtZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVSZW1vdGVNb3ZlKHBheWxvYWQpIHtcbiAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiW2hhbmRsZVJlbW90ZU1vdmVdIEludmFsaWQgcGF5bG9hZDpcIiwgcGF5bG9hZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gRW50aXR5IG5vdCBmb3VuZCBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH0uIEF2YWlsYWJsZSBwbGF5ZXJzOmAsIEFycmF5LmZyb20odGhpcy5wbGF5ZXJFbnRpdGllcy5rZXlzKCkpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgY29uc3QgdmVsID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIFxuICAgIGlmICghcG9zIHx8ICF2ZWwgfHwgIXJlbmRlcmFibGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgIHZlbC5pc01vdmluZyA9IHBheWxvYWQuaXNNb3Zpbmc7XG4gICAgcG9zLmdyaWRYID0gcGF5bG9hZC5ncmlkWDtcbiAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgIHBvcy50YXJnZXRYID0gcGF5bG9hZC54O1xuICAgIHBvcy50YXJnZXRZID0gcGF5bG9hZC55O1xuICAgIHBvcy54ID0gcGF5bG9hZC54O1xuICAgIHBvcy55ID0gcGF5bG9hZC55O1xuXG4gICAgcmVuZGVyYWJsZS5zdGF0ZSA9IHBheWxvYWQuc3RhdGUgfHwgKHBheWxvYWQuaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVSZW1vdGVCb21iKHBheWxvYWQpIHtcbiAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcbiAgICB0aGlzLmNyZWF0ZUJvbWIocGF5bG9hZC5pZCwgcGF5bG9hZC54LCBwYXlsb2FkLnksIHBheWxvYWQucmFuZ2UgfHwgMiwgcGF5bG9hZC5ib21iSWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChwYXlsb2FkKSB7XG4gICAgaWYgKCFwYXlsb2FkIHx8IHBheWxvYWQueCA9PT0gdW5kZWZpbmVkIHx8IHBheWxvYWQueSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICB0aGlzLnJlbW92ZVBvd2VyVXBBdChwYXlsb2FkLngsIHBheWxvYWQueSk7XG5cbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgaWYgKHBheWxvYWQuc3RhdHMpIHtcbiAgICAgICAgdGhpcy5hcHBseVNlcnZlclN0YXRzKGVudGl0eSwgcGF5bG9hZC5zdGF0cyk7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKGVudGl0eSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlTZXJ2ZXJTdGF0cyhlbnRpdHksIHN0YXRzKSB7XG4gICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgIGlmICghcGxheWVyIHx8ICFzdGF0cykgcmV0dXJuO1xuXG4gICAgcGxheWVyLmxpdmVzID0gc3RhdHMubGl2ZXMgPz8gcGxheWVyLmxpdmVzO1xuICAgIHBsYXllci5tYXhCb21icyA9IHN0YXRzLm1heEJvbWJzID8/IHBsYXllci5tYXhCb21icztcbiAgICBwbGF5ZXIuYm9tYlJhbmdlID0gc3RhdHMuYm9tYlJhbmdlID8/IHBsYXllci5ib21iUmFuZ2U7XG4gICAgcGxheWVyLmFsaXZlID0gc3RhdHMuYWxpdmUgPz8gcGxheWVyLmFsaXZlO1xuXG4gICAgaWYgKHZlbG9jaXR5ICYmIHR5cGVvZiBzdGF0cy5zcGVlZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdmVsb2NpdHkuc3BlZWQgPSBzdGF0cy5zcGVlZDtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVQbGF5ZXJEYW1hZ2VkKHBheWxvYWQpIHtcbiAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcblxuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICBpZiAoIXBsYXllcikgcmV0dXJuO1xuXG4gICAgY29uc3QgcmVuZGVyYWJsZSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICBpZiAocmVuZGVyYWJsZSAmJiByZW5kZXJhYmxlLmVsKSB7XG4gICAgICAgIHJlbmRlcmFibGUuZWwuY2xhc3NMaXN0LnJlbW92ZSgncGxheWVyLWRhbWFnZWQnKTtcbiAgICAgICAgdm9pZCByZW5kZXJhYmxlLmVsLm9mZnNldFdpZHRoO1xuICAgICAgICByZW5kZXJhYmxlLmVsLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1kYW1hZ2VkJyk7XG4gICAgfVxuXG4gICAgcGxheWVyLmxpdmVzID0gcGF5bG9hZC5saXZlcyA/PyBwbGF5ZXIubGl2ZXM7XG4gICAgcGxheWVyLmFsaXZlID0gcGF5bG9hZC5hbGl2ZSA/PyBwbGF5ZXIuYWxpdmU7XG5cbiAgICBpZiAoIXBsYXllci5hbGl2ZSkge1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICh2ZWxvY2l0eSkgdmVsb2NpdHkuaXNNb3ZpbmcgPSBmYWxzZTtcblxuICAgICAgICBpZiAoZW50aXR5ID09PSB0aGlzLmxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICB0aGlzLndvcmxkLnJlbW92ZUNvbXBvbmVudChlbnRpdHksICdJbnB1dCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICBzZXRMaXZlcyhwbGF5ZXIubGl2ZXMpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUdhbWVPdmVyKHBheWxvYWQpIHtcbiAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICBjb25zdCB3aW5uZXJOYW1lID0gcGF5bG9hZCAmJiBwYXlsb2FkLndpbm5lck5hbWUgPyBwYXlsb2FkLndpbm5lck5hbWUgOiBcIkEgcGxheWVyXCI7XG4gICAgc2V0VGltZW91dCgoKSA9PiBhbGVydChgJHt3aW5uZXJOYW1lfSB3aW5zIWApLCA1MCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVFeHBsb3Npb25DaGVja2VkKHBheWxvYWQpIHtcbiAgICBpZiAoIXBheWxvYWQpIHJldHVybjtcblxuICAgIHRoaXMucmVtb3ZlQm9tYihwYXlsb2FkLmJvbWJJZCwgcGF5bG9hZC5jZWxscyAmJiBwYXlsb2FkLmNlbGxzWzBdKTtcblxuICAgIChwYXlsb2FkLmRlc3Ryb3llZEJsb2NrcyB8fCBbXSkuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVNYXBDZWxsKGNlbGwueCwgY2VsbC55LCAyKTtcbiAgICB9KTtcblxuICAgIChwYXlsb2FkLnNwYXduZWRQb3dlclVwcyB8fCBbXSkuZm9yRWFjaChwb3dlclVwID0+IHtcbiAgICAgICAgdGhpcy5jcmVhdGVQb3dlclVwKHBvd2VyVXAueCwgcG93ZXJVcC55LCBwb3dlclVwLnR5cGUpO1xuICAgIH0pO1xuXG4gICAgKHBheWxvYWQuY2VsbHMgfHwgW10pLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlRXhwbG9zaW9uKGNlbGwueCwgY2VsbC55LCA1MDApO1xuICAgIH0pO1xufVxuIiwiLyoqXG4gKiBTcGF3bnMgYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIHNwZWNpZmllZCBncmlkIGNvb3JkaW5hdGVzLlxuICogVGhpcyBjcmVhdGVzIGEgcHJvcGVyIEVDUyBlbnRpdHkgd2l0aCBQb3NpdGlvbiwgUG93ZXJVcCwgYW5kIFJlbmRlcmFibGUgY29tcG9uZW50cy5cbiAqIFxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IGdyaWRYIC0gR3JpZCBYIGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBncmlkWSAtIEdyaWQgWSBjb29yZGluYXRlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLSBUaGUgZ2FtZSBjb250YWluZXIgZWxlbWVudFxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3Bhd25IZWFydFBvd2VyVXAod29ybGQsIHBsYXllclgsIHBsYXllclksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIC8vIENyZWF0ZSBhIG5ldyBlbnRpdHkgZm9yIHRoZSBoZWFydCBwb3dlci11cFxuICAgIGNvbnN0IGhlYXJ0RW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgXG4gICAgLy8gQ1JJVElDQUwgQUxJR05NRU5UIEZJWDogU25hcCB0aGUgaGVhcnQgdG8gdGhlIGdhbWUncyBncmlkIHVzaW5nIGFjdHVhbCB0aWxlU2l6ZVxuICAgIGNvbnN0IHNuYXBwZWRYID0gTWF0aC5yb3VuZChwbGF5ZXJYIC8gdGlsZVNpemUpICogdGlsZVNpemU7XG4gICAgY29uc3Qgc25hcHBlZFkgPSBNYXRoLnJvdW5kKHBsYXllclkgLyB0aWxlU2l6ZSkgKiB0aWxlU2l6ZTtcbiAgICBjb25zdCBncmlkWCA9IE1hdGgucm91bmQocGxheWVyWCAvIHRpbGVTaXplKTtcbiAgICBjb25zdCBncmlkWSA9IE1hdGgucm91bmQocGxheWVyWSAvIHRpbGVTaXplKTtcblxuICAgIC8vIEFkZCBQb3NpdGlvbiBjb21wb25lbnQgd2l0aCBjb3JyZWN0IGdyaWRYL2dyaWRZIGZvciBjb2xsaXNpb24gZGV0ZWN0aW9uXG4gICAgd29ybGQuYWRkQ29tcG9uZW50KGhlYXJ0RW50aXR5LCAnUG9zaXRpb24nLCB7XG4gICAgICAgIGdyaWRYOiBncmlkWCxcbiAgICAgICAgZ3JpZFk6IGdyaWRZLFxuICAgICAgICB4OiBzbmFwcGVkWCxcbiAgICAgICAgeTogc25hcHBlZFlcbiAgICB9KTtcbiAgICBcbiAgICAvLyBBZGQgUG93ZXJVcCBjb21wb25lbnQgd2l0aCB0eXBlICdIRUFSVCdcbiAgICB3b3JsZC5hZGRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3dlclVwJywge1xuICAgICAgICB0eXBlOiAnSEVBUlQnLFxuICAgICAgICBwaWNrZWRVcDogZmFsc2UsXG4gICAgICAgIGVsOiBudWxsICAvLyBXaWxsIGJlIHNldCBhZnRlciBjcmVhdGluZyB0aGUgRE9NIGVsZW1lbnRcbiAgICB9KTtcbiAgICBcbiAgICAvLyBDcmVhdGUgdGhlIERPTSBlbGVtZW50IGZvciByZW5kZXJpbmdcbiAgICBjb25zdCBoZWFydERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYXJ0RGl2LmNsYXNzTmFtZSA9ICdwb3dlcnVwIHBvd2VydXAtaGVhcnQnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBoZWFydERpdi5zdHlsZS5sZWZ0ID0gc25hcHBlZFggKyAncHgnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnRvcCA9IHNuYXBwZWRZICsgJ3B4JztcbiAgICBoZWFydERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICBoZWFydERpdi5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcbiAgICBoZWFydERpdi5zdHlsZS5mb250U2l6ZSA9ICczMnB4JztcbiAgICBoZWFydERpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgaGVhcnREaXYudGV4dENvbnRlbnQgPSAn4p2k77iPJztcbiAgICBcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaGVhcnREaXYpO1xuICAgIFxuICAgIC8vIFVwZGF0ZSB0aGUgUG93ZXJVcCBjb21wb25lbnQgd2l0aCB0aGUgRE9NIGVsZW1lbnQgcmVmZXJlbmNlXG4gICAgY29uc3QgcG93ZXJVcCA9IHdvcmxkLmdldENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICBpZiAocG93ZXJVcCkge1xuICAgICAgICBwb3dlclVwLmVsID0gaGVhcnREaXY7XG4gICAgfVxuICAgIFxuICAgIGNvbnNvbGUubG9nKGBbSGVhcnQgRHJvcF0gU3Bhd25lZCBhdCBncmlkICgke2dyaWRYfSwgJHtncmlkWX0pLCBwaXhlbCAoJHtzbmFwcGVkWH0sICR7c25hcHBlZFl9KSwgdGlsZVNpemU9JHt0aWxlU2l6ZX1gKTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHBsYXllciBkZWF0aCB0cmFuc2l0aW9uIHdoZW4gbGl2ZXMgcmVhY2ggMC5cbiAqIFJlbW92ZXMgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGFuZCBzcGF3bnMgYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIGRlYXRoIGxvY2F0aW9uLlxuICpcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJFbnRpdHkgLSBUaGUgZW50aXR5IElEIG9mIHRoZSBkeWluZyBwbGF5ZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSBnYW1lIGNvbnRhaW5lciBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVQbGF5ZXJEZWF0aCh3b3JsZCwgcGxheWVyRW50aXR5LCB0aWxlU2l6ZSA9IDY0LCBjb250YWluZXIgPSBudWxsKSB7XG4gICAgLy8gR2V0IHRoZSBwbGF5ZXIncyBjb21wb25lbnRzXG4gICAgY29uc3QgcG9zaXRpb24gPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG5cbiAgICBpZiAoIXBvc2l0aW9uIHx8ICFyZW5kZXJhYmxlIHx8ICFwbGF5ZXIpIHJldHVybjtcblxuICAgIC8vIENSSVRJQ0FMOiBSZW1vdmUgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGZyb20gdGhlIGRvY3VtZW50IEJFRk9SRSByZW1vdmluZyB0aGUgUmVuZGVyYWJsZSBjb21wb25lbnQuXG4gICAgLy8gVGhpcyBlbnN1cmVzIHRoZSBkZWFkIHBsYXllciB2aXN1YWxseSBkaXNhcHBlYXJzIGltbWVkaWF0ZWx5LlxuICAgIGlmIChyZW5kZXJhYmxlLmVsICYmIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocmVuZGVyYWJsZS5lbCk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGNvbXBvbmVudHMgdGhhdCBlbmFibGUgaW50ZXJhY3Rpb24gYW5kIHJlbmRlcmluZy5cbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgIHdvcmxkLnJlbW92ZUNvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgIC8vIFdlIGtlZXAgUG9zaXRpb24gYW5kIFBsYXllciBjb21wb25lbnRzIHRvIGtub3cgd2hlcmUgdGhleSB3ZXJlLlxuXG4gICAgLy8gU3Bhd24gYSBIRUFSVCBwb3dlci11cCBlbnRpdHkgYXQgdGhlIGRlYXRoIGxvY2F0aW9uIChwcm9wZXIgRUNTIGVudGl0eSlcbiAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgIHNwYXduSGVhcnRQb3dlclVwKHdvcmxkLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55LCBnYW1lQ29udGFpbmVyLCB0aWxlU2l6ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGFtYWdlU3lzdGVtKHdvcmxkLCBub3csIG9uUGxheWVySHVydCwgbG9jYWxQbGF5ZXJFbnRpdHksIHRpbGVTaXplID0gNjQsIHNvY2tldCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUGxheWVyJyk7XG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHBsYXllci5pbnZpbmNpYmxlVW50aWwgJiYgcGxheWVyLmludmluY2libGVVbnRpbCA+IG5vdykgY29udGludWU7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgICAgICBjb25zdCBlUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdyaWQtYmFzZWQgY29sbGlzaW9uXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWCA9IE1hdGguZmxvb3IoKHBQb3MueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWSA9IE1hdGguZmxvb3IoKHBQb3MueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChwbGF5ZXJHcmlkWCA9PT0gZVBvcy5ncmlkWCAmJiBwbGF5ZXJHcmlkWSA9PT0gZVBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzTGl2ZXMgPSBwbGF5ZXIubGl2ZXMgPz8gMztcbiAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSBNYXRoLm1heChwcmV2aW91c0xpdmVzIC0gMSwgMCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLmludmluY2libGVVbnRpbCA9IG5vdyArIDE1MDA7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHBsYXllciBpcyBkZWFkLCByZXBvcnQgZGVhdGggT05DRSB1c2luZyBndWFyZCBjbGF1c2VcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmxpdmVzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBsYXllci5hbHJlYWR5UmVwb3J0ZWREZWFkKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmFscmVhZHlSZXBvcnRlZERlYWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUGxheWVySHVydChwbGF5ZXJFbnRpdHksIHBsYXllci5pZCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBsYXllciBzdGlsbCBhbGl2ZSwgcmVwb3J0IG5vcm1hbCBkYW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uUGxheWVySHVydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCBwbGF5ZXIubGl2ZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEJyZWFrIHRoZSBsb29wIHNpbmNlIHRoZSBwbGF5ZXIgaGFzIGFscmVhZHkgdGFrZW4gZGFtYWdlIGZyb20gdGhpcyBleHBsb3Npb24uXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgc2V0TGl2ZXMgfSBmcm9tICcuLi8uLi9wYWdlcy9nYW1lJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBvd2VyVXBTeXN0ZW0od29ybGQsIG9uUG93ZXJVcFBpY2tlZCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUGxheWVyJyk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcFBvcyB8fCAhdmVsIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuXG4gICAgICAgIC8vIE9OTFkgbG9jYWwgcGxheWVyIGhhbmRsZXMgY29sbGlzaW9uIHRvIGF2b2lkIG11bHRpLXBpY2t1cCBidWdzXG4gICAgICAgIGlmICghcGxheWVyLmlzTG9jYWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcFVwRW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCB1cFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcFVwID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghdXBQb3MgfHwgIXBVcCB8fCBwVXAucGlja2VkVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAvLyBHcmlkLWJhc2VkIGNvbGxpc2lvbjogcGxheWVyIGdyaWQgcG9zaXRpb24gbWF0Y2hlcyBwb3dlci11cCBncmlkIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAocFBvcy5ncmlkWCA9PT0gdXBQb3MuZ3JpZFggJiYgcFBvcy5ncmlkWSA9PT0gdXBQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC50eXBlID09PSAnSEVBUlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDIuIEluY3JlbWVudCB0aGUgcGxheWVyJ3MgbGl2ZXNcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyAzLiBVcGRhdGUgdGhlIFVJIGxpdmVzIGNvdW50ZXIgaW1tZWRpYXRlbHkgb24gdGhlIHNjcmVlblxuICAgICAgICAgICAgICAgICAgICBzZXRMaXZlcyhwbGF5ZXIubGl2ZXMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIDEuIFJlbW92ZSB0aGUgc3BlY2lmaWMgSGVhcnQgRE9NIGVsZW1lbnQgZnJvbSB0aGUgc2NyZWVuIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgaWYgKHBVcC5lbCAmJiBwVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE5vdGlmeSBnYW1lLmpzIHZpYSBjYWxsYmFjayBmb3IgYW55IHNlcnZlciBzeW5jIG5lZWRlZFxuICAgICAgICAgICAgICAgIGlmIChvblBvd2VyVXBQaWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb25Qb3dlclVwUGlja2VkKHBsYXllci5pZCwgcFVwLnR5cGUsIHVwUG9zLmdyaWRYLCB1cFBvcy5ncmlkWSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gNC4gUmVtb3ZlIHRoZSBoZWFydCBmcm9tIHRoZSBhY3RpdmUgZ2FtZSBzdGF0ZSBzbyBpdCBjYW5ub3QgYmUgdHJpZ2dlcmVkIHR3aWNlXG4gICAgICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShwVXBFbnRpdHkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclN5c3RlbSh3b3JsZCwgZHQsIG5vdywgYW5pbVJvd3MpIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdSZW5kZXJhYmxlJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuXG4gICAgICAgIGlmICghcmVuZGVyYWJsZS5lbCkgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSByZW5kZXJhYmxlLnN0YXRlO1xuICAgICAgICBjb25zdCB0YXJnZXRSb3cgPSBhbmltUm93c1tzdGF0ZV1bdmVsLmRpcmVjdGlvbl07XG4gICAgICAgIFxuICAgICAgICAvLyBSZXNldCBhbmltYXRpb24gd2hlbiByb3cgb3Igc3RhdGUgY2hhbmdlc1xuICAgICAgICBpZiAocmVuZGVyYWJsZS5yb3cgIT09IHRhcmdldFJvdyB8fCByZW5kZXJhYmxlLmxhc3RTdGF0ZSAhPT0gc3RhdGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUucm93ID0gdGFyZ2V0Um93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0U3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZyYW1lQ291bnQgPSBzdGF0ZSA9PT0gJ1JVTicgPyByZW5kZXJhYmxlLnJ1bkZyYW1lcyA6IHJlbmRlcmFibGUuaWRsZUZyYW1lcztcbiAgICAgICAgY29uc3QgZnJhbWVEZWxheSA9IHN0YXRlID09PSAnUlVOJyA/IDEwMDAgLyByZW5kZXJhYmxlLmZwcyA6IDEwMDAgLyByZW5kZXJhYmxlLmlkbGVGcHM7XG5cbiAgICAgICAgaWYgKG5vdyAtIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA+IGZyYW1lRGVsYXkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICsgMSkgJSBmcmFtZUNvdW50O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zWCA9IC0ocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKiByZW5kZXJhYmxlLmZyYW1lV2lkdGgpO1xuICAgICAgICBjb25zdCBwb3NZID0gLShyZW5kZXJhYmxlLnJvdyAqIHJlbmRlcmFibGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBgJHtwb3NYfXB4ICR7cG9zWX1weGA7XG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7cG9zLnh9cHgsICR7cG9zLnl9cHgsIDApYDtcbiAgICB9XG59XG4iLCIvLyAvc3JjL2Vjcy93b3JsZC5qc1xuXG5leHBvcnQgY2xhc3MgV29ybGQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm5leHRFbnRpdHlJZCA9IDA7XG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IG5ldyBNYXAoKTsgXG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuICAgIH1cblxuICAgIGNyZWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5uZXh0RW50aXR5SWQrKztcbiAgICAgICAgdGhpcy5lbnRpdGllcy5hZGQoZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG5cbiAgICBkZXN0cm95RW50aXR5KGVudGl0eSkge1xuICAgICAgICB0aGlzLmVudGl0aWVzLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICBmb3IgKGNvbnN0IFtjb21wb25lbnROYW1lLCBjb21wb25lbnRNYXBdIG9mIHRoaXMuY29tcG9uZW50cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERhdGEgPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zZXQoY29tcG9uZW50TmFtZSwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpLnNldChlbnRpdHksIGNvbXBvbmVudERhdGEpO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE1hcCA/IGNvbXBvbmVudE1hcC5nZXQoZW50aXR5KSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZW1vdmVDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIGlmIChjb21wb25lbnRNYXApIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHF1ZXJ5KC4uLmNvbXBvbmVudE5hbWVzKSB7XG4gICAgICAgIGlmIChjb21wb25lbnROYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpcnN0TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1swXSk7XG4gICAgICAgIGlmICghZmlyc3RNYXApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZmlyc3RNYXAua2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgaGFzQWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY29tcG9uZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcCB8fCAhbWFwLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0FsbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzQWxsICYmIHRoaXMuZW50aXRpZXMuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRTeXN0ZW0oc3lzdGVtRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zeXN0ZW1zLnB1c2goc3lzdGVtRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHVwZGF0ZShkdCwgbm93KSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3lzdGVtIG9mIHRoaXMuc3lzdGVtcykge1xuICAgICAgICAgICAgc3lzdGVtKHRoaXMsIGR0LCBub3cpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBLaWNrZWRNZW51KCkge1xuICAgIGNvbnN0IHJldHVybkJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+UmV0dXJuIHRvIE1haW4gTWVudTwvYnV0dG9uPjtcblxuICAgIHJldHVybkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAod2luZG93LnNvY2tldCAmJiB3aW5kb3cuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICB3aW5kb3cuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiBcImxlYXZlX3Jvb21cIiB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICByb3V0ZXIubmF2aWdhdGUoXCIvXCIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgICAgICA8aDE+S0lDS0VEIEZPUiBBRkshPC9oMT5cbiAgICAgICAgICAgIDxwPllvdSB3ZXJlIHJlbW92ZWQgZnJvbSB0aGUgbWF0Y2ggZm9yIHN3aXRjaGluZyB0YWJzLjwvcD5cbiAgICAgICAgICAgIHtyZXR1cm5CdG59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmtcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gV2luTWVudShwcm9wcykge1xuICAgIGNvbnN0IHdpbm5lck5hbWUgPSBwcm9wcy53aW5uZXJOYW1lIHx8IFwiQSBQbGF5ZXJcIjtcblxuICAgIGNvbnN0IHJlcGxheUJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+UGxheSBBZ2FpbjwvYnV0dG9uPjtcblxuICAgIHJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAod2luZG93LnNvY2tldCAmJiB3aW5kb3cuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICB3aW5kb3cuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiBcImxlYXZlX3Jvb21cIiB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICByb3V0ZXIubmF2aWdhdGUoXCIvXCIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgICAgICA8aDE+e3dpbm5lck5hbWUudG9VcHBlckNhc2UoKX0gV09OITwvaDE+XG4gICAgICAgICAgICA8cD5UaGUgbGFzdCBwbGF5ZXIgc3RhbmRpbmcgdGFrZXMgdGhlIGNyb3duLjwvcD5cbiAgICAgICAgICAgIHtyZXBsYXlCdG59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuZXhwb3J0IGNvbnN0IFRJTEVfU0laRSA9IDQ4O1xuY29uc3QgR1JJRF9CT1JERVJfU0laRSA9IDY7XG5cbmNvbnN0IGltYWdlcyA9IHtcbiAgICAyOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIixcbiAgICAzOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja193YWxsLnBuZ1wiLFxuICAgIDQ6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2V4cGxvaXQucG5nXCIsXG59O1xuXG5jb25zdCBbcGxheWVyTmFtZSwgc2V0UGxheWVyTmFtZV0gPSBjcmVhdGVTaWduYWwoXCJQbGF5ZXIgMVwiKTtcbmNvbnN0IFtsaXZlcywgc2V0TGl2ZXNdID0gY3JlYXRlU2lnbmFsKDMpO1xuY29uc3QgW3NwZWVkLCBzZXRTcGVlZF0gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbYm9tYnMsIHNldEJvbWJzXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtyYW5nZSwgc2V0UmFuZ2VdID0gY3JlYXRlU2lnbmFsKDEpO1xuZXhwb3J0IHsgc2V0UGxheWVyTmFtZSwgc2V0TGl2ZXMsIHNldFNwZWVkLCBzZXRCb21icywgc2V0UmFuZ2UgfTtcblxuY29uc3QgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IG5hbWVFbC50ZXh0Q29udGVudCA9IHBsYXllck5hbWUoKTsgfSk7XG5cbmNvbnN0IGxpdmVzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGxpdmVzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHNwZWVkRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHNwZWVkLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IGJvbWJzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGJvbWJzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHJhbmdlRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHJhbmdlLXZhbHVlXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbGl2ZXNFbC50ZXh0Q29udGVudCA9IGxpdmVzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgc3BlZWRFbC50ZXh0Q29udGVudCA9IHNwZWVkKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgYm9tYnNFbC50ZXh0Q29udGVudCA9IGJvbWJzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgcmFuZ2VFbC50ZXh0Q29udGVudCA9IHJhbmdlKCk7IH0pO1xuXG5mdW5jdGlvbiBHYW1lKHsgZ3JpZCB9KSB7XG4gICAgY29uc3QgYm9hcmRXaWR0aCA9IGdyaWRbMF0ubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gZ3JpZC5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmREaXNwbGF5V2lkdGggPSAoYm9hcmRXaWR0aCArIEdSSURfQk9SREVSX1NJWkUgKiAyKSAqIDAuODA7XG4gICAgY29uc3QgYm9hcmREaXNwbGF5SGVpZ2h0ID0gKGJvYXJkSGVpZ2h0ICsgR1JJRF9CT1JERVJfU0laRSAqIDIpICogMC44MDtcbiAgICBjb25zdCByb3dzID0gW107XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IGdyaWQubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCBncmlkW3Jvd0luZGV4XS5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBncmlkW3Jvd0luZGV4XVtjb2xJbmRleF07XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gXCJ0aWxlXCI7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBgd2lkdGg6JHtUSUxFX1NJWkV9cHg7aGVpZ2h0OiR7VElMRV9TSVpFfXB4O2A7XG5cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAyIHx8IGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS1mbG9vclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS13YWxsXCI7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzNdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbNF19KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMCB8fCBjZWxsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzJdfSlgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxscy5wdXNoKDxkaXYgY2xhc3M9e2NsYXNzTmFtZX0gZGF0YS14PXtjb2xJbmRleH0gZGF0YS15PXtyb3dJbmRleH0gc3R5bGU9e3N0eWxlfT48L2Rpdj4pO1xuICAgICAgICB9XG4gICAgICAgIHJvd3MucHVzaCg8ZGl2IGNsYXNzPVwiZ3JpZC1yb3dcIj57Y2VsbHN9PC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWdsYXNzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWJhclwiPlxuICAgICAgICAgICAgICAgICAgICB7bmFtZUVsfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+TGl2ZXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpdmVzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+U3BlZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwZWVkRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+Qm9tYnM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvbWJzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+UmFuZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JhbmdlRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtYm9hcmQtZnJhbWVcIiBzdHlsZT17YHdpZHRoOiR7Ym9hcmREaXNwbGF5V2lkdGh9cHg7aGVpZ2h0OiR7Ym9hcmREaXNwbGF5SGVpZ2h0fXB4O2B9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBpZD1cImdhbWUtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZ2FtZS1ncmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtgcG9zaXRpb246cmVsYXRpdmU7d2lkdGg6JHtib2FyZFdpZHRofXB4O2hlaWdodDoke2JvYXJkSGVpZ2h0fXB4O3RyYW5zZm9ybTpzY2FsZSgwLjgwKTtgfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cm93c31cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgQ2hhdFBsYXllcnMgZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5sZXQgW3N0YXRlcywgc2V0U3RhdGVzXSA9IGNyZWF0ZVNpZ25hbCh7fSk7XG5leHBvcnQgeyBzZXRTdGF0ZXMgfTtcblxubGV0IHJvb21JZEVsID0gPHA+Um9vbSBJRDogPC9wPjtcbmxldCBwbGF5ZXJzRWwgPSA8cD5QbGF5ZXJzOiAgLyA0PC9wPjtcbmxldCB0ZXh0RWwgPSA8cD48L3A+O1xubGV0IHRpbWVyRWwgPSA8cD5UaW1lcjogPC9wPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzID0gc3RhdGVzKCk7XG4gICAgcm9vbUlkRWwudGV4dENvbnRlbnQgPSBgUm9vbSBJRDogJHtzLnJvb21JZH1gO1xuICAgIHBsYXllcnNFbC50ZXh0Q29udGVudCA9IGBQbGF5ZXJzOiAke3MucGxheWVyc0NvdW50fSAvIDRgO1xuICAgIHRleHRFbC50ZXh0Q29udGVudCA9IHMudGV4dDtcbiAgICBpZiAocy5zZWNvbmRzTGVmdCkgdGltZXJFbC50ZXh0Q29udGVudCA9IFwiVGltZSA6IFwiICsgcy5zZWNvbmRzTGVmdDtcbiAgICBlbHNlIHRpbWVyRWwudGV4dENvbnRlbnQgPSBcIlwiO1xufSk7XG5cbmZ1bmN0aW9uIExvYmJ5KCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb25hdGluZXItbG9iYnlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2JieS1ib3hcIj5cbiAgICAgICAgICAgICAgICA8aDE+TG9iYnk8L2gxPlxuICAgICAgICAgICAgICAgIHtyb29tSWRFbH1cbiAgICAgICAgICAgICAgICB7cGxheWVyc0VsfVxuICAgICAgICAgICAgICAgIHt0ZXh0RWx9XG4gICAgICAgICAgICAgICAge3RpbWVyRWx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxDaGF0UGxheWVycyAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYmJ5OyIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmNvbnN0IHJlcGxheUJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+UGxheSBBZ2FpbjwvYnV0dG9uPjtcblxucmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbG9jYXRpb24ucmVsb2FkKCk7XG59KTtcblxubGV0IG1lbnVFbCA9IChcbiAgICA8ZGl2IGNsYXNzPVwibWVudS1ib3hcIj5cbiAgICAgICAgPGgxPllvdSBXaW4hPC9oMT5cbiAgICAgICAgPHA+QWxsIG90aGVyIHBsYXllcnMgaGF2ZSBsZWZ0IHRoZSBnYW1lLjwvcD5cbiAgICAgICAge3JlcGxheUJ0bn1cbiAgICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lbnUoKSB7XG4gICAgcmV0dXJuIG1lbnVFbDtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBzZXRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5cbmNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gY3JlYXRlU2lnbmFsKFwiXCIpO1xuZXhwb3J0IHsgc2V0RXJyb3IgfTtcblxuZnVuY3Rpb24gUmVnaXN0ZXIoeyB3c3MgfSkge1xuICAgIGxldCBzdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICBjb25zdCBlcnJvckVsID0gPHAgY2xhc3M9XCJyZWdpc3Rlci1lcnJvclwiPjwvcD47XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBlcnJvckVsLnRleHRDb250ZW50ID0gZXJyb3IoKTtcbiAgICB9KTtcblxuICAgIGxldCBwbGF5ZXJFbnRlciA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUgfHwgbmlja25hbWUubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIHNldEVycm9yKFwiSW52YWxpZCBuaWNrbmFtZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldEVycm9yKFwiXCIpO1xuICAgICAgICBzdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzZXRQbGF5ZXJOYW1lKG5pY2tuYW1lKTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcIm5pY2tuYW1lX29mX3RoZV9wbGF5ZXJcIixcbiAgICAgICAgICAgIG5pY2tuYW1lOiBuaWNrbmFtZVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgb25TdWJtaXQ9e3BsYXllckVudGVyfT5cbiAgICAgICAgICAgIHtlcnJvckVsfVxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmlja25hbWUtaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW50ZXIgeW91ciBuYW1lXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmVnaXN0ZXItYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPnN0YXJ0IHBsYXlpbmc8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XG4iLCJjbGFzcyBTb3VuZCB7XG4gICAgY29uc3RydWN0b3Ioc3JjKSB7XG4gICAgICAgIHRoaXMubXVzaWMgPSBuZXcgQXVkaW8oc3JjKTtcbiAgICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcblxuICAgICAgICB0aGlzLm11c2ljLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNDtcblxuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc05hbWUgPSBcInNvdW5kLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5hcHBlbmQodGhpcy5pY29uKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGUoKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5idXR0b24pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5tdXNpYy5wbGF5KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5tdXNpYy5wYXVzZWQgfHwgdGhpcy5tdXNpYy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9uXCIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUJ1dHRvbigpIHtcbiAgICAgICAgY29uc3QgaXNNdXRlZCA9IHRoaXMubXVzaWMubXV0ZWQgfHwgdGhpcy5tdXNpYy5wYXVzZWQ7XG5cbiAgICAgICAgdGhpcy5pY29uLmNsYXNzTmFtZSA9IGlzTXV0ZWQgPyBcImZhLXNvbGlkIGZhLXZvbHVtZS1vZmZcIiA6IFwiZmEtc29saWQgZmEtdm9sdW1lLWhpZ2hcIjtcbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImlzLW11dGVkXCIsIGlzTXV0ZWQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291bmQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwL2FwcC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwidHlwZSIsInByb3BzIiwiY2hpbGRyZW4iLCJlbGUiLCJkb2N1bWVudCIsImtleSIsInN0YXJ0c1dpdGgiLCJldmVudE5hbWUiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldEF0dHJpYnV0ZSIsImZsYXRDaGlsZHJlbiIsImZsYXQiLCJJbmZpbml0eSIsImFwcGVuZCIsImZpbHRlciIsImNoaWxkIiwidW5kZWZpbmVkIiwicmVuZGVyIiwiZWxlbWVudCIsImNvbnRhaW5lciIsInJlcGxhY2VDaGlsZHJlbiIsIlJvdXRlciIsInJvdXRlciIsImVmZmVjdFN0YWNrIiwiYWN0aXZlRWZmZWN0IiwiY3JlYXRlU2lnbmFsIiwiaW5pdGlhbFZhbHVlIiwidmFsdWUiLCJlZmZlY3RzIiwiU2V0IiwiUmVhZCIsImFkZCIsIldyaXRlIiwibmV3VmFsdWUiLCJmbiIsImZvckVhY2giLCJlZmZlY3QiLCJjcmVhdGVFZmZlY3QiLCJwdXNoIiwicG9wIiwibGVuZ3RoIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInVybCIsIlVSTCIsImhyZWYiLCJsaXN0ZW4iLCJvbkVycm9yNDA0IiwiZXZlbnQiLCJkZXN0aW5hdGlvbiIsImludGVyY2VwdCIsImNvbnNvbGUiLCJsb2ciLCJSZWdpc3RlciIsInNldEVycm9yIiwiR2FtZSIsIk1lbnUiLCJMb2JieSIsIldpbk1lbnUiLCJLaWNrZWRNZW51Iiwic2V0U3RhdGVzIiwic2V0UGxheWVyTmFtZSIsInNldEh1ZFBsYXllck5hbWUiLCJTb3VuZCIsInNldE1lc3NhZ2VzIiwiR2FtZUVuZ2luZSIsImhhbmRsZVBsYXllckRlYXRoIiwiVElMRV9TSVpFIiwicm9vdCIsImdldEVsZW1lbnRCeUlkIiwid3NzIiwiV2ViU29ja2V0Iiwid2luZG93IiwiaG9zdG5hbWUiLCJzb2NrZXQiLCJzb3VuZCIsImN1cnJlbnRHYW1lRW5naW5lIiwiaW5pdCIsImJvZHkiLCJjbGFzc05hbWUiLCJhbGVydCIsIndzIiwibWVzc2FnZSIsIkpTT04iLCJwYXJzZSIsImRhdGEiLCJxdWVyeVNlbGVjdG9yIiwicm9vbUlkIiwicGxheWVyc0NvdW50Iiwic2Vjb25kc0xlZnQiLCJ0ZXh0IiwiZGVzdHJveSIsImdyaWQiLCJzZXRUaW1lb3V0IiwiZ2FtZUNvbnRhaW5lciIsImxvY2FsUGxheWVyIiwicGxheWVycyIsImZpbmQiLCJwbGF5ZXIiLCJpZCIsInlvdXJQbGF5ZXJJZCIsIm5pY2tuYW1lIiwiZW5naW5lIiwiaGlkZGVuIiwic2VuZCIsInN0cmluZ2lmeSIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwib25BRksiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZXJyb3IiLCJ3aW5uZXJOYW1lIiwiZW50aXR5IiwicGxheWVyRW50aXRpZXMiLCJnZXQiLCJTdHJpbmciLCJwbGF5ZXJJZCIsIndvcmxkIiwiZGVzdHJveUVudGl0eSIsImRlbGV0ZSIsInByZXYiLCJoYW5kbGVSZW1vdGVNb3ZlIiwicGF5bG9hZCIsImhhbmRsZVJlbW90ZUJvbWIiLCJoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkIiwiaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZCIsImhhbmRsZVBsYXllckRhbWFnZWQiLCJoYW5kbGVHYW1lT3ZlciIsImVyciIsIm1lc3NhZ2VzIiwiQ2hhdFBsYXllcnMiLCJtZXNzYWdlc0NvbnRhaW5lciIsImNsYXNzIiwibXNncyIsIm1zZyIsInAiLCJ0ZXh0Q29udGVudCIsInJlbW92ZUNoaWxkIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJ1bnNoaWZ0IiwiYnJvYWRjYXN0TWVzc2FnZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJ0YXJnZXQiLCJ0cmltIiwicmVzZXQiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlBvc2l0aW9uQ29tcG9uZW50IiwiZ3giLCJneSIsInRpbGVTaXplIiwiZ3JpZFgiLCJncmlkWSIsIngiLCJ5IiwidGFyZ2V0WCIsInRhcmdldFkiLCJWZWxvY2l0eUNvbXBvbmVudCIsImJhc2VTcGVlZCIsInNwZWVkIiwic3BlZWRCb29zdCIsInNwZWVkQm9vc3RUaW1lUmVtYWluaW5nIiwiaXNNb3ZpbmciLCJkaXJlY3Rpb24iLCJJbnB1dENvbXBvbmVudCIsImlucHV0UXVldWUiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiZWwiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJ0b3RhbEZyYW1lcyIsImZwcyIsImN1cnJlbnRGcmFtZSIsInJ1bkZyYW1lcyIsImlkbGVGcmFtZXMiLCJpZGxlRnBzIiwibGFzdEZyYW1lVGltZSIsInJvdyIsInN0YXRlIiwibGFzdFN0YXRlIiwiUGxheWVyQ29tcG9uZW50IiwiY2hhclR5cGUiLCJpc0xvY2FsIiwiQm9tYkNvbXBvbmVudCIsIm93bmVySWQiLCJ0aW1lciIsInJhbmdlIiwiZXhwbG9kZWQiLCJFeHBsb3Npb25Db21wb25lbnQiLCJkdXJhdGlvbiIsIlBvd2VyVXBDb21wb25lbnQiLCJwaWNrZWRVcCIsIkJlaGF2aW9yQ29tcG9uZW50IiwiZmFzdFNob2VzTGV2ZWwiLCJib21icyIsIm1heCIsImN1cnJlbnQiLCJXb3JsZCIsInJlZ2lzdGVyU3lzdGVtcyIsImdhbWVMb29wIiwic2V0dXBJbnB1dCIsInNlbmRJbnB1dCIsImRyb3BCb21iIiwiY3JlYXRlQm9tYiIsInJlbW92ZVBvd2VyVXBBdCIsInVwZGF0ZU1hcENlbGwiLCJyZW1vdmVCb21iIiwiY3JlYXRlRXhwbG9zaW9uIiwiY3JlYXRlUG93ZXJVcCIsImFwcGx5U2VydmVyU3RhdHMiLCJ1cGRhdGVIdWRTdGF0cyIsImdldFBsYXllck5hbWUiLCJjb25zdHJ1Y3RvciIsImNhbnZhc0NvbnRhaW5lciIsIm1hcERhdGEiLCJsb2NhbFBsYXllckVudGl0eSIsIk1hcCIsImxhc3RUaW1lIiwicmVtb3ZlSW5wdXRMaXN0ZW5lcnMiLCJhbmltYXRpb25GcmFtZSIsInJ1bm5pbmciLCJjbGFpbWVkUG93ZXJVcHMiLCJsYXN0SW5wdXRTZW50IiwiU1BSSVRFX0NPTFVNTlMiLCJTUFJJVEVfUk9XUyIsIkFOSU1BVElPTl9ST1dTIiwiUlVOIiwidXAiLCJsZWZ0IiwiZG93biIsInJpZ2h0IiwiSURMRSIsImJvbWJJZCIsImV4aXN0cyIsInF1ZXJ5Iiwic29tZSIsInBvcyIsImdldENvbXBvbmVudCIsImJvbWIiLCJib21iRW50aXR5IiwiY3JlYXRlRW50aXR5IiwiYm9tYkRpdiIsInN0eWxlIiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsInRvcCIsInpJbmRleCIsImFkZENvbXBvbmVudCIsImJvbWJDb21wIiwicG93ZXJVcHMiLCJwb3dlclVwIiwicGFyZW50Tm9kZSIsInRpbGUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJmYWxsYmFja0NlbGwiLCJzYW1lSWQiLCJzYW1lQ2VsbCIsImV4cEVudGl0eSIsImV4cERpdiIsImhhcyIsInBVcEVudGl0eSIsImRpdiIsInNldEJvbWJzIiwic2V0TGl2ZXMiLCJzZXRSYW5nZSIsInNldFNwZWVkIiwidmVsb2NpdHkiLCJtYXhCb21icyIsImxpdmVzIiwiYm9tYlJhbmdlIiwiTWF0aCIsInJvdW5kIiwiaW5wdXQiLCJnZXRLZXlEaXJlY3Rpb24iLCJoYW5kbGVLZXlEb3duIiwiZGlyIiwiaW5jbHVkZXMiLCJjb2RlIiwiaGFuZGxlS2V5VXAiLCJkIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJhbGl2ZSIsIkJvb2xlYW4iLCJpbnB1dFN0YXRlIiwiY3VycmVudEJvbWJzIiwiYkVudGl0eSIsInJlbmRlclN5c3RlbSIsInBvd2VyVXBTeXN0ZW0iLCJsb2NhbFBsYXllcklkIiwiYWxsUGxheWVycyIsIm5vcm1hbGl6ZWRMb2NhbFBsYXllcklkIiwicERhdGEiLCJwbGF5ZXJFbnRpdHkiLCJwbGF5ZXJEaXYiLCJjb2xvciIsIndpbGxDaGFuZ2UiLCJiYWNrZ3JvdW5kU2l6ZSIsInN4Iiwic3kiLCJwbGF5ZXJDb21wIiwic2V0Iiwid2FybiIsIm1hcCIsInBlcmZvcm1hbmNlIiwibm93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiYWRkU3lzdGVtIiwidyIsImR0IiwidXBkYXRlIiwibmV4dE5vdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY3VycmVudExvY2FsUGxheWVyTmFtZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJnZXRJdGVtIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsInZlbCIsInJlbmRlcmFibGUiLCJzdGF0cyIsImNsYXNzTGlzdCIsInJlbW92ZSIsIm9mZnNldFdpZHRoIiwicmVtb3ZlQ29tcG9uZW50IiwiY2VsbHMiLCJkZXN0cm95ZWRCbG9ja3MiLCJjZWxsIiwic3Bhd25lZFBvd2VyVXBzIiwic3Bhd25IZWFydFBvd2VyVXAiLCJwbGF5ZXJYIiwicGxheWVyWSIsImhlYXJ0RW50aXR5Iiwic25hcHBlZFgiLCJzbmFwcGVkWSIsImhlYXJ0RGl2IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsImZvbnRTaXplIiwiZGFtYWdlU3lzdGVtIiwib25QbGF5ZXJIdXJ0IiwiZXhwbG9zaW9ucyIsInBQb3MiLCJpbnZpbmNpYmxlVW50aWwiLCJlUG9zIiwicGxheWVyR3JpZFgiLCJmbG9vciIsInBsYXllckdyaWRZIiwicHJldmlvdXNMaXZlcyIsImFscmVhZHlSZXBvcnRlZERlYWQiLCJvblBvd2VyVXBQaWNrZWQiLCJ1cFBvcyIsInBVcCIsImFuaW1Sb3dzIiwiZW50aXRpZXMiLCJ0YXJnZXRSb3ciLCJmcmFtZUNvdW50IiwiZnJhbWVEZWxheSIsInBvc1giLCJwb3NZIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwidHJhbnNmb3JtIiwibmV4dEVudGl0eUlkIiwiY29tcG9uZW50cyIsInN5c3RlbXMiLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50TWFwIiwiZW50cmllcyIsImNvbXBvbmVudERhdGEiLCJjb21wb25lbnROYW1lcyIsImZpcnN0TWFwIiwicmVzdWx0cyIsImhhc0FsbCIsImkiLCJzeXN0ZW1GdW5jdGlvbiIsInN5c3RlbSIsInJldHVybkJ0biIsInJlcGxheUJ0biIsInRvVXBwZXJDYXNlIiwiR1JJRF9CT1JERVJfU0laRSIsImltYWdlcyIsInBsYXllck5hbWUiLCJuYW1lRWwiLCJsaXZlc0VsIiwic3BlZWRFbCIsImJvbWJzRWwiLCJyYW5nZUVsIiwiYm9hcmRXaWR0aCIsImJvYXJkSGVpZ2h0IiwiYm9hcmREaXNwbGF5V2lkdGgiLCJib2FyZERpc3BsYXlIZWlnaHQiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJyZWxvYWQiLCJtZW51RWwiLCJzdWJtaXR0ZWQiLCJlcnJvckVsIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImJ1dHRvbiIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwidXBkYXRlQnV0dG9uIiwicGxheSIsInRoZW4iLCJjYXRjaCIsInBhdXNlZCIsIm11dGVkIiwiaXNNdXRlZCJdLCJzb3VyY2VSb290IjoiIn0=