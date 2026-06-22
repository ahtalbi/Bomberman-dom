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
const wss = new WebSocket("ws://localhost:5000");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxZQUFZLEVBQUUsZUFBZSxDQUFDO01BQ3ZELElBQUksQ0FBQ3dhLFlBQVksQ0FBQyxDQUFDO0lBQ3ZCO0VBQ0o7RUFFQUEsWUFBWUEsQ0FBQSxFQUFHO0lBQ1gsTUFBTU0sT0FBTyxHQUFHLElBQUksQ0FBQ2IsS0FBSyxDQUFDWSxLQUFLLElBQUksSUFBSSxDQUFDWixLQUFLLENBQUNXLE1BQU07SUFFckQsSUFBSSxDQUFDUixJQUFJLENBQUNwVixTQUFTLEdBQUc4VixPQUFPLEdBQUcsd0JBQXdCLEdBQUcseUJBQXlCO0lBQ3BGLElBQUksQ0FBQ1gsTUFBTSxDQUFDekYsU0FBUyxDQUFDNkYsTUFBTSxDQUFDLFVBQVUsRUFBRU8sT0FBTyxDQUFDO0VBQ3JEO0FBQ0o7QUFFQSxpRUFBZTdXLEtBQUssRTs7Ozs7O1VDakRwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQzVCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2hhdC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS9lbnRpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUvaHVkLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS9pbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUvbGlmZWN5Y2xlLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS9wbGF5ZXJOYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS9yZW1vdGVIYW5kbGVycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy93b3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvS2lja2VkTWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL1dpbk1lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyLCB7IHNldEVycm9yIH0gZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCBXaW5NZW51IGZyb20gXCIuLi9wYWdlcy9XaW5NZW51LmpzeFwiO1xuaW1wb3J0IEtpY2tlZE1lbnUgZnJvbSBcIi4uL3BhZ2VzL0tpY2tlZE1lbnUuanN4XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiOyBcbmltcG9ydCB7IGhhbmRsZVBsYXllckRlYXRoIH0gZnJvbSBcIi4uL2Vjcy9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgVElMRV9TSVpFIH0gZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo1MDAwXCIpO1xud2luZG93LnNvY2tldCA9IHdzcztcbmNvbnN0IHNvdW5kID0gbmV3IFNvdW5kKFwiLi9hc3NldHMvc291bmRzL2JhY2tncm91bmRfbXVzaWMubXAzXCIpO1xubGV0IGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcblxuc291bmQuaW5pdCgpO1xuXG5yb3V0ZXIub24oXCIvXCIsICgpID0+IHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwicmVnaXN0ZXItcGFnZVwiO1xuICAgIHNldE1lc3NhZ2VzKFtdKTtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKHdzKSA9PiB7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJsb2JieV91cGRhdGVcIjpcbiAgICAgICAgICAgIGlmICghcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmNvbmF0aW5lci1sb2JieVwiKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcig8TG9iYnkgLz4sIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogbWVzc2FnZS5wbGF5ZXJzQ291bnQsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IG1lc3NhZ2Uuc2Vjb25kc0xlZnQsXG4gICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwibG9iYnlfcmVzZXRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuICAgICAgICAgICAgaWYgKCFyb290LnF1ZXJ5U2VsZWN0b3IoXCIuY29uYXRpbmVyLWxvYmJ5XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKDxMb2JieSAvPiwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgIHJvb21JZDogXCJcIixcbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IDEsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IDIwLFxuICAgICAgICAgICAgICAgIHRleHQ6IFwiV2FpdGluZyBmb3IgbW9yZSBwbGF5ZXJzXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNldE1lc3NhZ2VzKFtdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJnYW1lX3N0YXJ0ZWRcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJnYW1lLXBhZ2VcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVuZGVyKDxHYW1lIGdyaWQ9e21lc3NhZ2UuZ3JpZH0gLz4sIHJvb3QpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsUGxheWVyID0gKG1lc3NhZ2UucGxheWVycyB8fCBbXSkuZmluZChwbGF5ZXIgPT4gcGxheWVyLmlkID09PSBtZXNzYWdlLnlvdXJQbGF5ZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciAmJiBsb2NhbFBsYXllci5uaWNrbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SHVkUGxheWVyTmFtZShsb2NhbFBsYXllci5uaWNrbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmdpbmUgPSBuZXcgR2FtZUVuZ2luZShnYW1lQ29udGFpbmVyLCBtZXNzYWdlLmdyaWQsIHdzcyk7XG4gICAgICAgICAgICAgICAgICAgIGVuZ2luZS5pbml0KG1lc3NhZ2UueW91clBsYXllcklkLCBtZXNzYWdlLnBsYXllcnMgfHwgW10pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBlbmdpbmU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiBcImxlYXZlX3Jvb21cIiB9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoS2lja2VkTWVudSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBmdW5jdGlvbiBvbkFGSygpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBvbkFGSyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7IHR5cGU6IFwibGVhdmVfcm9vbVwiIH0pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290LmFwcGVuZENoaWxkKEtpY2tlZE1lbnUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdhbWUgY29udGFpbmVyIHdhcyBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcInJvb21fYWxvbmVcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgIHJlbmRlcig8TWVudSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICBjYXNlIFwiZ2FtZV93b25cIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKFdpbk1lbnUoeyB3aW5uZXJOYW1lOiBtZXNzYWdlLndpbm5lck5hbWUgfSkpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcInBsYXllcl90dXJuZWRfaGVhcnRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGN1cnJlbnRHYW1lRW5naW5lLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcobWVzc2FnZS5wbGF5ZXJJZCkpO1xuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZVBsYXllckRlYXRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVQbGF5ZXJEZWF0aChjdXJyZW50R2FtZUVuZ2luZS53b3JsZCwgZW50aXR5LCBUSUxFX1NJWkUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLndvcmxkLmRlc3Ryb3lFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUucGxheWVyRW50aXRpZXMuZGVsZXRlKFN0cmluZyhtZXNzYWdlLnBsYXllcklkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImNoYXRfbWVzc2FnZVwiOlxuICAgICAgICAgICAgc2V0TWVzc2FnZXMocHJldiA9PiBbLi4ucHJldiwge1xuICAgICAgICAgICAgICAgIG5pY2tuYW1lOiBtZXNzYWdlLm5pY2tuYW1lIHx8IFwiUGxheWVyXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZS5tZXNzYWdlLFxuICAgICAgICAgICAgfV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfbW92ZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZU1vdmUobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm9tYl9kcm9wcGVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVCb21iKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBvd2VydXBfcGlja2VkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImV4cGxvc2lvbl9jaGVja2VkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVFeHBsb3Npb25DaGVja2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBsYXllcl9kYW1hZ2VkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVQbGF5ZXJEYW1hZ2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImdhbWVfb3ZlclwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlR2FtZU92ZXIobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZXJyb3JcIjpcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9PT0gXCJyZWdpc3Rlci1wYWdlXCIpIHtcbiAgICAgICAgICAgICAgICBzZXRFcnJvcihtZXNzYWdlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydChtZXNzYWdlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3JcIiwgZXJyKTtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NlZFwiKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB3c3M7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IHdzcyBmcm9tIFwiLi4vYXBwL2FwcFwiO1xuXG5jb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IGNyZWF0ZVNpZ25hbChbXSk7XG5leHBvcnQgeyBzZXRNZXNzYWdlcyB9O1xuXG5mdW5jdGlvbiBDaGF0UGxheWVycygpIHtcbiAgICBjb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IDxkaXYgY2xhc3M9XCJtZXNzYWdlc1wiPjwvZGl2PjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZ3MgPSBtZXNzYWdlcygpO1xuICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGZvciAobGV0IG1zZyBvZiBtc2dzKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG1zZyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBtc2c7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBgJHttc2cubmlja25hbWV9OiAke21zZy5tZXNzYWdlfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG1lc3NhZ2VzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBtc2dzLnVuc2hpZnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBmb3JtRGF0YS5nZXQoXCJtZXNzYWdlXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcImNoYXRfbWVzc2FnZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgfSkpO1xuICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0XCIgb25TdWJtaXQ9e2Jyb2FkY2FzdE1lc3NhZ2V9PlxuICAgICAgICAgICAge21lc3NhZ2VzQ29udGFpbmVyfVxuICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1lc3NhZ2VcIiBwbGFjZWhvbGRlcj1cInR5cGUgdG8gdGhlIG90aGVyIHBsYXllcnMgLi4uXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXRQbGF5ZXJzO1xuIiwiLy8gL3NyYy9lY3MvY29tcG9uZW50cy5qc1xuXG5leHBvcnQgY29uc3QgUG9zaXRpb25Db21wb25lbnQgPSAoZ3gsIGd5LCB0aWxlU2l6ZSA9IDY0KSA9PiAoe1xuICAgIGdyaWRYOiBneCxcbiAgICBncmlkWTogZ3ksXG4gICAgeDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB5OiBneSAqIHRpbGVTaXplLFxuICAgIHRhcmdldFg6IGd4ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WTogZ3kgKiB0aWxlU2l6ZVxufSk7XG5cbmV4cG9ydCBjb25zdCBWZWxvY2l0eUNvbXBvbmVudCA9IChiYXNlU3BlZWQgPSAyLjUpID0+ICh7XG4gICAgYmFzZVNwZWVkOiBiYXNlU3BlZWQsXG4gICAgc3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBzcGVlZEJvb3N0OiAwLFxuICAgIHNwZWVkQm9vc3RUaW1lUmVtYWluaW5nOiAwLFxuICAgIGlzTW92aW5nOiBmYWxzZSxcbiAgICBkaXJlY3Rpb246ICdkb3duJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBJbnB1dENvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgaW5wdXRRdWV1ZTogW11cbn0pO1xuXG5leHBvcnQgY29uc3QgUmVuZGVyYWJsZUNvbXBvbmVudCA9IChlbCwgZnJhbWVXaWR0aCA9IDY0LCBmcmFtZUhlaWdodCA9IDY0LCB0b3RhbEZyYW1lcyA9IDQsIGZwcyA9IDEyKSA9PiAoe1xuICAgIGVsOiBlbCxcbiAgICBmcmFtZVdpZHRoOiBmcmFtZVdpZHRoLFxuICAgIGZyYW1lSGVpZ2h0OiBmcmFtZUhlaWdodCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IHRvdGFsRnJhbWVzLFxuICAgIHJ1bkZyYW1lczogNCxcbiAgICBpZGxlRnJhbWVzOiAyLFxuICAgIGZwczogZnBzLFxuICAgIGlkbGVGcHM6IDQsXG4gICAgbGFzdEZyYW1lVGltZTogMCxcbiAgICByb3c6IDAsXG4gICAgc3RhdGU6ICdJRExFJyxcbiAgICBsYXN0U3RhdGU6ICdJRExFJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXJDb21wb25lbnQgPSAoaWQsIGNoYXJUeXBlLCBpc0xvY2FsID0gZmFsc2UpID0+ICh7XG4gICAgaWQ6IGlkLFxuICAgIGNoYXJUeXBlOiBjaGFyVHlwZSxcbiAgICBpc0xvY2FsOiBpc0xvY2FsXG59KTtcblxuZXhwb3J0IGNvbnN0IEJvbWJDb21wb25lbnQgPSAob3duZXJJZCwgdGltZXIgPSAyMDAwLCByYW5nZSA9IDIpID0+ICh7XG4gICAgb3duZXJJZDogb3duZXJJZCxcbiAgICB0aW1lcjogdGltZXIsXG4gICAgcmFuZ2U6IHJhbmdlLFxuICAgIGV4cGxvZGVkOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBFeHBsb3Npb25Db21wb25lbnQgPSAoZHVyYXRpb24gPSA1MDApID0+ICh7XG4gICAgZHVyYXRpb246IGR1cmF0aW9uXG59KTtcblxuZXhwb3J0IGNvbnN0IFBvd2VyVXBDb21wb25lbnQgPSAodHlwZSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlLCBcbiAgICBwaWNrZWRVcDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgQmVoYXZpb3JDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGZhc3RTaG9lc0xldmVsOiAxLFxuICAgIGJvbWJzOiB7XG4gICAgICAgIG1heDogMSxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgcmFuZ2U6IDJcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC5qcyc7XG5pbXBvcnQgeyBpbml0LCByZWdpc3RlclN5c3RlbXMsIGdhbWVMb29wLCBkZXN0cm95IH0gZnJvbSAnLi9nYW1lL2xpZmVjeWNsZS5qcyc7XG5pbXBvcnQgeyBzZXR1cElucHV0LCBzZW5kSW5wdXQsIGRyb3BCb21iIH0gZnJvbSAnLi9nYW1lL2lucHV0LmpzJztcbmltcG9ydCB7IGNyZWF0ZUJvbWIsIHJlbW92ZVBvd2VyVXBBdCwgdXBkYXRlTWFwQ2VsbCwgcmVtb3ZlQm9tYiwgY3JlYXRlRXhwbG9zaW9uLCBjcmVhdGVQb3dlclVwIH0gZnJvbSAnLi9nYW1lL2VudGl0aWVzLmpzJztcbmltcG9ydCB7XG4gICAgaGFuZGxlUmVtb3RlTW92ZSxcbiAgICBoYW5kbGVSZW1vdGVCb21iLFxuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQsXG4gICAgYXBwbHlTZXJ2ZXJTdGF0cyxcbiAgICBoYW5kbGVQbGF5ZXJEYW1hZ2VkLFxuICAgIGhhbmRsZUdhbWVPdmVyLFxuICAgIGhhbmRsZUV4cGxvc2lvbkNoZWNrZWRcbn0gZnJvbSAnLi9nYW1lL3JlbW90ZUhhbmRsZXJzLmpzJztcbmltcG9ydCB7IHVwZGF0ZUh1ZFN0YXRzIH0gZnJvbSAnLi9nYW1lL2h1ZC5qcyc7XG5cbmV4cG9ydCB7IHNldFBsYXllck5hbWUsIGdldFBsYXllck5hbWUgfSBmcm9tICcuL2dhbWUvcGxheWVyTmFtZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBHYW1lRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNDb250YWluZXIsIG1hcERhdGEsIHNvY2tldCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNhbnZhc0NvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gbWFwRGF0YTtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcbiAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IG51bGw7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5sYXN0SW5wdXRTZW50ID0gXCJcIjtcbiAgICB9XG5cbiAgICBpbml0ID0gaW5pdDtcbiAgICBzZXR1cElucHV0ID0gc2V0dXBJbnB1dDtcbiAgICBzZW5kSW5wdXQgPSBzZW5kSW5wdXQ7XG4gICAgZHJvcEJvbWIgPSBkcm9wQm9tYjtcbiAgICBjcmVhdGVCb21iID0gY3JlYXRlQm9tYjtcbiAgICBoYW5kbGVSZW1vdGVNb3ZlID0gaGFuZGxlUmVtb3RlTW92ZTtcbiAgICBoYW5kbGVSZW1vdGVCb21iID0gaGFuZGxlUmVtb3RlQm9tYjtcbiAgICBoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkID0gaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZDtcbiAgICByZW1vdmVQb3dlclVwQXQgPSByZW1vdmVQb3dlclVwQXQ7XG4gICAgYXBwbHlTZXJ2ZXJTdGF0cyA9IGFwcGx5U2VydmVyU3RhdHM7XG4gICAgaGFuZGxlUGxheWVyRGFtYWdlZCA9IGhhbmRsZVBsYXllckRhbWFnZWQ7XG4gICAgaGFuZGxlR2FtZU92ZXIgPSBoYW5kbGVHYW1lT3ZlcjtcbiAgICBoYW5kbGVFeHBsb3Npb25DaGVja2VkID0gaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZDtcbiAgICB1cGRhdGVNYXBDZWxsID0gdXBkYXRlTWFwQ2VsbDtcbiAgICByZW1vdmVCb21iID0gcmVtb3ZlQm9tYjtcbiAgICBjcmVhdGVFeHBsb3Npb24gPSBjcmVhdGVFeHBsb3Npb247XG4gICAgY3JlYXRlUG93ZXJVcCA9IGNyZWF0ZVBvd2VyVXA7XG4gICAgcmVnaXN0ZXJTeXN0ZW1zID0gcmVnaXN0ZXJTeXN0ZW1zO1xuICAgIGdhbWVMb29wID0gZ2FtZUxvb3A7XG4gICAgZGVzdHJveSA9IGRlc3Ryb3k7XG4gICAgdXBkYXRlSHVkU3RhdHMgPSB1cGRhdGVIdWRTdGF0cztcbn1cbiIsImV4cG9ydCBjb25zdCBTUFJJVEVfQ09MVU1OUyA9IDEzO1xuZXhwb3J0IGNvbnN0IFNQUklURV9ST1dTID0gNTQ7XG5cbmV4cG9ydCBjb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuIiwiaW1wb3J0IHsgQm9tYkNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMuanMnO1xuaW1wb3J0IHsgVElMRV9TSVpFIH0gZnJvbSAnLi4vLi4vcGFnZXMvZ2FtZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCb21iKG93bmVySWQsIGdyaWRYLCBncmlkWSwgcmFuZ2UsIGJvbWJJZCA9IG51bGwpIHtcbiAgICBjb25zdCBleGlzdHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuc29tZShlbnRpdHkgPT4ge1xuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBib21iID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQm9tYicpO1xuICAgICAgICByZXR1cm4gKGJvbWJJZCAmJiBib21iLmJvbWJJZCA9PT0gYm9tYklkKSB8fFxuICAgICAgICAgICAgKGJvbWIub3duZXJJZCA9PT0gb3duZXJJZCAmJiBwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpO1xuICAgIH0pO1xuXG4gICAgaWYgKGV4aXN0cykgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgY29uc3QgYm9tYkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJvbWJEaXYuY2xhc3NOYW1lID0gJ2JvbWInO1xuICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGJvbWJEaXYuc3R5bGUud2lkdGggPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGJvbWJEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgYm9tYkRpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIFRJTEVfU0laRX1weGA7XG4gICAgYm9tYkRpdi5zdHlsZS56SW5kZXggPSAnNic7XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYLCBncmlkWSB9KTtcblxuICAgIGNvbnN0IGJvbWJDb21wID0gQm9tYkNvbXBvbmVudChvd25lcklkLCAyMDAwLCByYW5nZSk7XG4gICAgYm9tYkNvbXAuYm9tYklkID0gYm9tYklkO1xuICAgIGJvbWJDb21wLmVsID0gYm9tYkRpdjtcbiAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicsIGJvbWJDb21wKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVBvd2VyVXBBdChncmlkWCwgZ3JpZFkpIHtcbiAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7Z3JpZFh9LCR7Z3JpZFl9YCk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwb3dlclVwID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICBpZiAoIXBvcyB8fCAhcG93ZXJVcCkgY29udGludWU7XG5cbiAgICAgICAgaWYgKHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWSkge1xuICAgICAgICAgICAgcG93ZXJVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChwb3dlclVwLmVsICYmIHBvd2VyVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHBvd2VyVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3dlclVwLmVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVNYXBDZWxsKHgsIHksIG5ld1ZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLm1hcERhdGFbeV0pIHJldHVybjtcblxuICAgIHRoaXMubWFwRGF0YVt5XVt4XSA9IG5ld1ZhbHVlO1xuXG4gICAgY29uc3QgdGlsZSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gKTtcbiAgICBpZiAoIXRpbGUpIHJldHVybjtcblxuICAgIHRpbGUuY2xhc3NOYW1lID0gJ3RpbGUgdGlsZS1mbG9vcic7XG4gICAgdGlsZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiKSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVCb21iKGJvbWJJZCwgZmFsbGJhY2tDZWxsKSB7XG4gICAgY29uc3QgYm9tYnMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBib21icykge1xuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBib21iID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQm9tYicpO1xuICAgICAgICBjb25zdCBzYW1lSWQgPSBib21iSWQgJiYgYm9tYiAmJiBib21iLmJvbWJJZCA9PT0gYm9tYklkO1xuICAgICAgICBjb25zdCBzYW1lQ2VsbCA9IGZhbGxiYWNrQ2VsbCAmJiBwb3MgJiYgcG9zLmdyaWRYID09PSBmYWxsYmFja0NlbGwueCAmJiBwb3MuZ3JpZFkgPT09IGZhbGxiYWNrQ2VsbC55O1xuXG4gICAgICAgIGlmICghc2FtZUlkICYmICFzYW1lQ2VsbCkgY29udGludWU7XG5cbiAgICAgICAgaWYgKGJvbWIuZWwgJiYgYm9tYi5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYm9tYi5lbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLndvcmxkLmRlc3Ryb3lFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUV4cGxvc2lvbihncmlkWCwgZ3JpZFksIGR1cmF0aW9uKSB7XG4gICAgY29uc3QgZXhwRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICBjb25zdCBleHBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBleHBEaXYuY2xhc3NOYW1lID0gJ2V4cGxvc2lvbic7XG4gICAgZXhwRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBleHBEaXYuc3R5bGUud2lkdGggPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGV4cERpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiBUSUxFX1NJWkV9cHhgO1xuICAgIGV4cERpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIFRJTEVfU0laRX1weGA7XG4gICAgZXhwRGl2LnN0eWxlLnpJbmRleCA9ICc3JztcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChleHBEaXYpO1xuXG4gICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYLCBncmlkWSwgeDogZ3JpZFggKiBUSUxFX1NJWkUsIHk6IGdyaWRZICogVElMRV9TSVpFIH0pO1xuICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicsIHsgZHVyYXRpb24sIGVsOiBleHBEaXYgfSk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGV4cERpdi5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBleHBEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChleHBEaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShleHBFbnRpdHkpO1xuICAgIH0sIGR1cmF0aW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBvd2VyVXAoZ3gsIGd5LCB0eXBlKSB7XG4gICAgaWYgKCF0eXBlIHx8IHRoaXMuY2xhaW1lZFBvd2VyVXBzLmhhcyhgJHtneH0sJHtneX1gKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgcFVwRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogVElMRV9TSVpFLCB5OiBneSAqIFRJTEVfU0laRSB9KTtcblxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSBgcG93ZXJ1cCBwb3dlcnVwLSR7dHlwZS50b0xvd2VyQ2FzZSgpfWA7XG4gICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBkaXYuc3R5bGUud2lkdGggPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiBUSUxFX1NJWkV9cHhgO1xuICAgIGRpdi5zdHlsZS50b3AgPSBgJHtneSAqIFRJTEVfU0laRX1weGA7XG4gICAgZGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcsIHsgdHlwZSwgZWw6IGRpdiB9KTtcbn1cbiIsImltcG9ydCB7IHNldEJvbWJzLCBzZXRMaXZlcywgc2V0UmFuZ2UsIHNldFNwZWVkIH0gZnJvbSAnLi4vLi4vcGFnZXMvZ2FtZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVIdWRTdGF0cyhlbnRpdHkpIHtcbiAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzID8/IDMpO1xuICAgIHNldFJhbmdlKHBsYXllci5ib21iUmFuZ2UgfHwgNCk7XG4gICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNldHVwSW5wdXQoKSB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICBjb25zdCBnZXRLZXlEaXJlY3Rpb24gPSAoa2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1VwJyB8fCBrZXkgPT09ICd3JyB8fCBrZXkgPT09ICdaJyB8fCBrZXkgPT09ICd6JykgcmV0dXJuICd1cCc7XG4gICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dMZWZ0JyB8fCBrZXkgPT09ICdhJyB8fCBrZXkgPT09ICdRJyB8fCBrZXkgPT09ICdxJykgcmV0dXJuICdsZWZ0JztcbiAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93UmlnaHQnIHx8IGtleSA9PT0gJ2QnIHx8IGtleSA9PT0gJ0QnKSByZXR1cm4gJ3JpZ2h0JztcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZSkgPT4ge1xuICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUudW5zaGlmdChkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZW5kSW5wdXQoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUua2V5ID09PSAnICcgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgdGhpcy5zZW5kSW5wdXQoaW5wdXQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuXG4gICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZW5kSW5wdXQoaW5wdXQpIHtcbiAgICBpZiAoIXRoaXMuc29ja2V0IHx8IHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSByZXR1cm47XG4gICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICBpZiAoIXBsYXllciB8fCAhcGxheWVyLmFsaXZlKSByZXR1cm47XG5cbiAgICBjb25zdCBkaXJlY3Rpb24gPSBpbnB1dC5pbnB1dFF1ZXVlWzBdIHx8IG51bGw7XG4gICAgY29uc3QgaXNNb3ZpbmcgPSBCb29sZWFuKGRpcmVjdGlvbik7XG4gICAgY29uc3QgaW5wdXRTdGF0ZSA9IGAke2RpcmVjdGlvbiB8fCAnaWRsZSd9OiR7aXNNb3ZpbmcgPyAxIDogMH1gO1xuXG4gICAgaWYgKHRoaXMubGFzdElucHV0U2VudCA9PT0gaW5wdXRTdGF0ZSkgcmV0dXJuO1xuICAgIHRoaXMubGFzdElucHV0U2VudCA9IGlucHV0U3RhdGU7XG5cbiAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdHlwZTogJ01PVkVfU1RBVEUnLFxuICAgICAgICBwYXlsb2FkOiB7IGRpcmVjdGlvbiwgaXNNb3ZpbmcgfVxuICAgIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyb3BCb21iKCkge1xuICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgaWYgKCFwbGF5ZXIgfHwgIXBsYXllci5hbGl2ZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgY3VycmVudEJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLmZpbHRlcihiRW50aXR5ID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGJFbnRpdHksICdCb21iJykub3duZXJJZCA9PT0gcGxheWVyLmlkO1xuICAgIH0pO1xuXG4gICAgaWYgKGN1cnJlbnRCb21icy5sZW5ndGggPj0gcGxheWVyLm1heEJvbWJzKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiAnRFJPUF9CT01CJyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHt9XG4gICAgICAgIH0pKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge1xuICAgIFBvc2l0aW9uQ29tcG9uZW50LFxuICAgIFZlbG9jaXR5Q29tcG9uZW50LFxuICAgIElucHV0Q29tcG9uZW50LFxuICAgIFJlbmRlcmFibGVDb21wb25lbnQsXG4gICAgUGxheWVyQ29tcG9uZW50XG59IGZyb20gJy4uL2NvbXBvbmVudHMuanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi4vc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcG93ZXJVcFN5c3RlbSB9IGZyb20gJy4uL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyc7XG5pbXBvcnQgeyBUSUxFX1NJWkUgfSBmcm9tICcuLi8uLi9wYWdlcy9nYW1lJztcbmltcG9ydCB7IEFOSU1BVElPTl9ST1dTLCBTUFJJVEVfQ09MVU1OUywgU1BSSVRFX1JPV1MgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KGxvY2FsUGxheWVySWQsIGFsbFBsYXllcnMpIHtcbiAgICBjb25zdCBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCA9IFN0cmluZyhsb2NhbFBsYXllcklkKTtcblxuICAgIGFsbFBsYXllcnMuZm9yRWFjaChwRGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IHBsYXllcklkID0gU3RyaW5nKHBEYXRhLmlkKTtcbiAgICAgICAgY29uc3QgcGxheWVyRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAgICAgY29uc3QgcGxheWVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gcERhdGEuY29sb3IgfHwgXCJ3aGl0ZVwiO1xuXG4gICAgICAgIHBsYXllckRpdi5jbGFzc05hbWUgPSBgcGxheWVyIHBsYXllci0ke2NvbG9yfWA7XG4gICAgICAgIHBsYXllckRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIHBsYXllckRpdi5zdHlsZS56SW5kZXggPSAnMTAnO1xuICAgICAgICBwbGF5ZXJEaXYuc3R5bGUud2lsbENoYW5nZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICBwbGF5ZXJEaXYuc3R5bGUud2lkdGggPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgcGxheWVyRGl2LnN0eWxlLmJhY2tncm91bmRTaXplID0gYCR7U1BSSVRFX0NPTFVNTlMgKiBUSUxFX1NJWkV9cHggJHtTUFJJVEVfUk9XUyAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckRpdik7XG5cbiAgICAgICAgY29uc3Qgc3ggPSBwRGF0YS54IHx8IDE7XG4gICAgICAgIGNvbnN0IHN5ID0gcERhdGEueSB8fCAxO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJywgUG9zaXRpb25Db21wb25lbnQoc3gsIHN5LCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknLCBWZWxvY2l0eUNvbXBvbmVudChwRGF0YS5zcGVlZCB8fCAyLjUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScsIFJlbmRlcmFibGVDb21wb25lbnQocGxheWVyRGl2LCBUSUxFX1NJWkUsIFRJTEVfU0laRSwgNCwgMTIpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgaXNMb2NhbCA9IHBsYXllcklkID09PSBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZDtcbiAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IFBsYXllckNvbXBvbmVudChwbGF5ZXJJZCwgY29sb3IsIGlzTG9jYWwpO1xuICAgICAgICBwbGF5ZXJDb21wLmxpdmVzID0gcERhdGEubGl2ZXMgPz8gMztcbiAgICAgICAgcGxheWVyQ29tcC5tYXhCb21icyA9IHBEYXRhLm1heEJvbWJzID8/IDE7XG4gICAgICAgIHBsYXllckNvbXAuYm9tYlJhbmdlID0gcERhdGEuYm9tYlJhbmdlID8/IDI7XG4gICAgICAgIHBsYXllckNvbXAuYWxpdmUgPSBwRGF0YS5hbGl2ZSA/PyB0cnVlO1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInLCBwbGF5ZXJDb21wKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcy5zZXQocGxheWVySWQsIHBsYXllckVudGl0eSk7XG5cbiAgICAgICAgaWYgKGlzTG9jYWwpIHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBwbGF5ZXJFbnRpdHk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcsIElucHV0Q29tcG9uZW50KCkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyhwbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgdGhpcy5zZXR1cElucHV0KCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIltHYW1lRW5naW5lXSBMb2NhbCBwbGF5ZXIgd2FzIG5vdCBmb3VuZFwiLCB7XG4gICAgICAgICAgICBsb2NhbFBsYXllcklkLFxuICAgICAgICAgICAgcGxheWVyczogYWxsUGxheWVycy5tYXAocGxheWVyID0+IHBsYXllci5pZCksXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucmVnaXN0ZXJTeXN0ZW1zKCk7XG5cbiAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgIHRoaXMubGFzdFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChub3cpID0+IHRoaXMuZ2FtZUxvb3Aobm93KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclN5c3RlbXMoKSB7XG4gICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHJlbmRlclN5c3RlbSh3LCBkdCwgbm93LCBBTklNQVRJT05fUk9XUykpO1xuICAgIFxuICAgIC8vIFJlZ2lzdGVyIHRoZSBsb2NhbCBwb3dlci11cCBjb2xsaXNpb24gc3lzdGVtXG4gICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHBvd2VyVXBTeXN0ZW0odywgKHBsYXllcklkLCB0eXBlLCBncmlkWCwgZ3JpZFkpID0+IHtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdIRUFSVCcgJiYgdGhpcy5sb2NhbFBsYXllckVudGl0eSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBIVUQgaW1tZWRpYXRlbHkgd2hlbiBhIGhlYXJ0IGlzIHBpY2tlZCB1cFxuICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyh0aGlzLmxvY2FsUGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQnJvYWRjYXN0IGhlYXJ0IHBpY2t1cCB0byBhbGwgcGxheWVycyBzbyB0aGV5IHJlbW92ZSBpdCBmcm9tIHRoZWlyIHNjcmVlblxuICAgICAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1dFUlVQX1BJQ0tFRCcsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IHsgaWQ6IHBsYXllcklkLCB0eXBlOiB0eXBlLCB4OiBncmlkWCwgeTogZ3JpZFkgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdhbWVMb29wKG5vdykge1xuICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICBjb25zdCBkdCA9IG5vdyAtIHRoaXMubGFzdFRpbWU7XG4gICAgdGhpcy5sYXN0VGltZSA9IG5vdztcbiAgICB0aGlzLndvcmxkLnVwZGF0ZShkdCwgbm93KTtcbiAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpO1xuICAgIH1cbiAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChuZXh0Tm93KSA9PiB0aGlzLmdhbWVMb29wKG5leHROb3cpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycykge1xuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKCk7XG4gICAgfVxufVxuIiwibGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJpbXBvcnQgeyBzZXRMaXZlcyB9IGZyb20gJy4uLy4uL3BhZ2VzL2dhbWUnO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUmVtb3RlTW92ZShwYXlsb2FkKSB7XG4gICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIltoYW5kbGVSZW1vdGVNb3ZlXSBJbnZhbGlkIHBheWxvYWQ6XCIsIHBheWxvYWQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIEVudGl0eSBub3QgZm91bmQgZm9yIHBsYXllciAke3BheWxvYWQuaWR9LiBBdmFpbGFibGUgcGxheWVyczpgLCBBcnJheS5mcm9tKHRoaXMucGxheWVyRW50aXRpZXMua2V5cygpKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgIGNvbnN0IHZlbCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgY29uc3QgcmVuZGVyYWJsZSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICBcbiAgICBpZiAoIXBvcyB8fCAhdmVsIHx8ICFyZW5kZXJhYmxlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIE1pc3NpbmcgY29tcG9uZW50cyBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH06YCwgeyBwb3M6ICEhcG9zLCB2ZWw6ICEhdmVsLCByZW5kZXJhYmxlOiAhIXJlbmRlcmFibGUgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2ZWwuZGlyZWN0aW9uID0gcGF5bG9hZC5kaXJlY3Rpb24gfHwgdmVsLmRpcmVjdGlvbjtcbiAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgIHBvcy5ncmlkWCA9IHBheWxvYWQuZ3JpZFg7XG4gICAgcG9zLmdyaWRZID0gcGF5bG9hZC5ncmlkWTtcbiAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICBwb3MudGFyZ2V0WSA9IHBheWxvYWQueTtcbiAgICBwb3MueCA9IHBheWxvYWQueDtcbiAgICBwb3MueSA9IHBheWxvYWQueTtcblxuICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUmVtb3RlQm9tYihwYXlsb2FkKSB7XG4gICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG4gICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDIsIHBheWxvYWQuYm9tYklkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQocGF5bG9hZCkge1xuICAgIGlmICghcGF5bG9hZCB8fCBwYXlsb2FkLnggPT09IHVuZGVmaW5lZCB8fCBwYXlsb2FkLnkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuXG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgIGlmIChwYXlsb2FkLnN0YXRzKSB7XG4gICAgICAgIHRoaXMuYXBwbHlTZXJ2ZXJTdGF0cyhlbnRpdHksIHBheWxvYWQuc3RhdHMpO1xuICAgIH1cblxuICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyhlbnRpdHkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5U2VydmVyU3RhdHMoZW50aXR5LCBzdGF0cykge1xuICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICBpZiAoIXBsYXllciB8fCAhc3RhdHMpIHJldHVybjtcblxuICAgIHBsYXllci5saXZlcyA9IHN0YXRzLmxpdmVzID8/IHBsYXllci5saXZlcztcbiAgICBwbGF5ZXIubWF4Qm9tYnMgPSBzdGF0cy5tYXhCb21icyA/PyBwbGF5ZXIubWF4Qm9tYnM7XG4gICAgcGxheWVyLmJvbWJSYW5nZSA9IHN0YXRzLmJvbWJSYW5nZSA/PyBwbGF5ZXIuYm9tYlJhbmdlO1xuICAgIHBsYXllci5hbGl2ZSA9IHN0YXRzLmFsaXZlID8/IHBsYXllci5hbGl2ZTtcblxuICAgIGlmICh2ZWxvY2l0eSAmJiB0eXBlb2Ygc3RhdHMuc3BlZWQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHZlbG9jaXR5LnNwZWVkID0gc3RhdHMuc3BlZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUGxheWVyRGFtYWdlZChwYXlsb2FkKSB7XG4gICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG5cbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgaWYgKCFwbGF5ZXIpIHJldHVybjtcblxuICAgIGNvbnN0IHJlbmRlcmFibGUgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgaWYgKHJlbmRlcmFibGUgJiYgcmVuZGVyYWJsZS5lbCkge1xuICAgICAgICByZW5kZXJhYmxlLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYXllci1kYW1hZ2VkJyk7XG4gICAgICAgIHZvaWQgcmVuZGVyYWJsZS5lbC5vZmZzZXRXaWR0aDtcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItZGFtYWdlZCcpO1xuICAgIH1cblxuICAgIHBsYXllci5saXZlcyA9IHBheWxvYWQubGl2ZXMgPz8gcGxheWVyLmxpdmVzO1xuICAgIHBsYXllci5hbGl2ZSA9IHBheWxvYWQuYWxpdmUgPz8gcGxheWVyLmFsaXZlO1xuXG4gICAgaWYgKCFwbGF5ZXIuYWxpdmUpIHtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAodmVsb2NpdHkpIHZlbG9jaXR5LmlzTW92aW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgdGhpcy53b3JsZC5yZW1vdmVDb21wb25lbnQoZW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVHYW1lT3ZlcihwYXlsb2FkKSB7XG4gICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgY29uc3Qgd2lubmVyTmFtZSA9IHBheWxvYWQgJiYgcGF5bG9hZC53aW5uZXJOYW1lID8gcGF5bG9hZC53aW5uZXJOYW1lIDogXCJBIHBsYXllclwiO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gYWxlcnQoYCR7d2lubmVyTmFtZX0gd2lucyFgKSwgNTApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZChwYXlsb2FkKSB7XG4gICAgaWYgKCFwYXlsb2FkKSByZXR1cm47XG5cbiAgICB0aGlzLnJlbW92ZUJvbWIocGF5bG9hZC5ib21iSWQsIHBheWxvYWQuY2VsbHMgJiYgcGF5bG9hZC5jZWxsc1swXSk7XG5cbiAgICAocGF5bG9hZC5kZXN0cm95ZWRCbG9ja3MgfHwgW10pLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlTWFwQ2VsbChjZWxsLngsIGNlbGwueSwgMik7XG4gICAgfSk7XG5cbiAgICAocGF5bG9hZC5zcGF3bmVkUG93ZXJVcHMgfHwgW10pLmZvckVhY2gocG93ZXJVcCA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlUG93ZXJVcChwb3dlclVwLngsIHBvd2VyVXAueSwgcG93ZXJVcC50eXBlKTtcbiAgICB9KTtcblxuICAgIChwYXlsb2FkLmNlbGxzIHx8IFtdKS5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0ZUV4cGxvc2lvbihjZWxsLngsIGNlbGwueSwgNTAwKTtcbiAgICB9KTtcbn1cbiIsIi8qKlxuICogU3Bhd25zIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBzcGVjaWZpZWQgZ3JpZCBjb29yZGluYXRlcy5cbiAqIFRoaXMgY3JlYXRlcyBhIHByb3BlciBFQ1MgZW50aXR5IHdpdGggUG9zaXRpb24sIFBvd2VyVXAsIGFuZCBSZW5kZXJhYmxlIGNvbXBvbmVudHMuXG4gKiBcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBncmlkWCAtIEdyaWQgWCBjb29yZGluYXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZ3JpZFkgLSBHcmlkIFkgY29vcmRpbmF0ZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWxlU2l6ZSAtIFRoZSBzaXplIG9mIGVhY2ggZ3JpZCB0aWxlIChkZWZhdWx0OiA2NClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwYXduSGVhcnRQb3dlclVwKHdvcmxkLCBwbGF5ZXJYLCBwbGF5ZXJZLCBjb250YWluZXIsIHRpbGVTaXplID0gNjQpIHtcbiAgICAvLyBDcmVhdGUgYSBuZXcgZW50aXR5IGZvciB0aGUgaGVhcnQgcG93ZXItdXBcbiAgICBjb25zdCBoZWFydEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIFxuICAgIC8vIENSSVRJQ0FMIEFMSUdOTUVOVCBGSVg6IFNuYXAgdGhlIGhlYXJ0IHRvIHRoZSBnYW1lJ3MgZ3JpZCB1c2luZyBhY3R1YWwgdGlsZVNpemVcbiAgICBjb25zdCBzbmFwcGVkWCA9IE1hdGgucm91bmQocGxheWVyWCAvIHRpbGVTaXplKSAqIHRpbGVTaXplO1xuICAgIGNvbnN0IHNuYXBwZWRZID0gTWF0aC5yb3VuZChwbGF5ZXJZIC8gdGlsZVNpemUpICogdGlsZVNpemU7XG4gICAgY29uc3QgZ3JpZFggPSBNYXRoLnJvdW5kKHBsYXllclggLyB0aWxlU2l6ZSk7XG4gICAgY29uc3QgZ3JpZFkgPSBNYXRoLnJvdW5kKHBsYXllclkgLyB0aWxlU2l6ZSk7XG5cbiAgICAvLyBBZGQgUG9zaXRpb24gY29tcG9uZW50IHdpdGggY29ycmVjdCBncmlkWC9ncmlkWSBmb3IgY29sbGlzaW9uIGRldGVjdGlvblxuICAgIHdvcmxkLmFkZENvbXBvbmVudChoZWFydEVudGl0eSwgJ1Bvc2l0aW9uJywge1xuICAgICAgICBncmlkWDogZ3JpZFgsXG4gICAgICAgIGdyaWRZOiBncmlkWSxcbiAgICAgICAgeDogc25hcHBlZFgsXG4gICAgICAgIHk6IHNuYXBwZWRZXG4gICAgfSk7XG4gICAgXG4gICAgLy8gQWRkIFBvd2VyVXAgY29tcG9uZW50IHdpdGggdHlwZSAnSEVBUlQnXG4gICAgd29ybGQuYWRkQ29tcG9uZW50KGhlYXJ0RW50aXR5LCAnUG93ZXJVcCcsIHtcbiAgICAgICAgdHlwZTogJ0hFQVJUJyxcbiAgICAgICAgcGlja2VkVXA6IGZhbHNlLFxuICAgICAgICBlbDogbnVsbCAgLy8gV2lsbCBiZSBzZXQgYWZ0ZXIgY3JlYXRpbmcgdGhlIERPTSBlbGVtZW50XG4gICAgfSk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIHRoZSBET00gZWxlbWVudCBmb3IgcmVuZGVyaW5nXG4gICAgY29uc3QgaGVhcnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFydERpdi5jbGFzc05hbWUgPSAncG93ZXJ1cCBwb3dlcnVwLWhlYXJ0JztcbiAgICBoZWFydERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgaGVhcnREaXYuc3R5bGUubGVmdCA9IHNuYXBwZWRYICsgJ3B4JztcbiAgICBoZWFydERpdi5zdHlsZS50b3AgPSBzbmFwcGVkWSArICdweCc7XG4gICAgaGVhcnREaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgaGVhcnREaXYuc3R5bGUuYWxpZ25JdGVtcyA9ICdjZW50ZXInO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuZm9udFNpemUgPSAnMzJweCc7XG4gICAgaGVhcnREaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIGhlYXJ0RGl2LnRleHRDb250ZW50ID0gJ+KdpO+4jyc7XG4gICAgXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhlYXJ0RGl2KTtcbiAgICBcbiAgICAvLyBVcGRhdGUgdGhlIFBvd2VyVXAgY29tcG9uZW50IHdpdGggdGhlIERPTSBlbGVtZW50IHJlZmVyZW5jZVxuICAgIGNvbnN0IHBvd2VyVXAgPSB3b3JsZC5nZXRDb21wb25lbnQoaGVhcnRFbnRpdHksICdQb3dlclVwJyk7XG4gICAgaWYgKHBvd2VyVXApIHtcbiAgICAgICAgcG93ZXJVcC5lbCA9IGhlYXJ0RGl2O1xuICAgIH1cbiAgICBcbiAgICBjb25zb2xlLmxvZyhgW0hlYXJ0IERyb3BdIFNwYXduZWQgYXQgZ3JpZCAoJHtncmlkWH0sICR7Z3JpZFl9KSwgcGl4ZWwgKCR7c25hcHBlZFh9LCAke3NuYXBwZWRZfSksIHRpbGVTaXplPSR7dGlsZVNpemV9YCk7XG59XG5cbi8qKlxuICogSGFuZGxlcyBwbGF5ZXIgZGVhdGggdHJhbnNpdGlvbiB3aGVuIGxpdmVzIHJlYWNoIDAuXG4gKiBSZW1vdmVzIHRoZSBwbGF5ZXIncyBET00gZWxlbWVudCBhbmQgc3Bhd25zIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBkZWF0aCBsb2NhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gcGxheWVyRW50aXR5IC0gVGhlIGVudGl0eSBJRCBvZiB0aGUgZHlpbmcgcGxheWVyXG4gKiBAcGFyYW0ge251bWJlcn0gdGlsZVNpemUgLSBUaGUgc2l6ZSBvZiBlYWNoIGdyaWQgdGlsZSAoZGVmYXVsdDogNjQpXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLSBUaGUgZ2FtZSBjb250YWluZXIgZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgY29udGFpbmVyID0gbnVsbCkge1xuICAgIC8vIEdldCB0aGUgcGxheWVyJ3MgY29tcG9uZW50c1xuICAgIGNvbnN0IHBvc2l0aW9uID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgaWYgKCFwb3NpdGlvbiB8fCAhcmVuZGVyYWJsZSB8fCAhcGxheWVyKSByZXR1cm47XG5cbiAgICAvLyBDUklUSUNBTDogUmVtb3ZlIHRoZSBwbGF5ZXIncyBET00gZWxlbWVudCBmcm9tIHRoZSBkb2N1bWVudCBCRUZPUkUgcmVtb3ZpbmcgdGhlIFJlbmRlcmFibGUgY29tcG9uZW50LlxuICAgIC8vIFRoaXMgZW5zdXJlcyB0aGUgZGVhZCBwbGF5ZXIgdmlzdWFsbHkgZGlzYXBwZWFycyBpbW1lZGlhdGVseS5cbiAgICBpZiAocmVuZGVyYWJsZS5lbCAmJiByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHJlbmRlcmFibGUuZWwpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBjb21wb25lbnRzIHRoYXQgZW5hYmxlIGludGVyYWN0aW9uIGFuZCByZW5kZXJpbmcuXG4gICAgd29ybGQucmVtb3ZlQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICB3b3JsZC5yZW1vdmVDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICAvLyBXZSBrZWVwIFBvc2l0aW9uIGFuZCBQbGF5ZXIgY29tcG9uZW50cyB0byBrbm93IHdoZXJlIHRoZXkgd2VyZS5cblxuICAgIC8vIFNwYXduIGEgSEVBUlQgcG93ZXItdXAgZW50aXR5IGF0IHRoZSBkZWF0aCBsb2NhdGlvbiAocHJvcGVyIEVDUyBlbnRpdHkpXG4gICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICBzcGF3bkhlYXJ0UG93ZXJVcCh3b3JsZCwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSwgZ2FtZUNvbnRhaW5lciwgdGlsZVNpemUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhbWFnZVN5c3RlbSh3b3JsZCwgbm93LCBvblBsYXllckh1cnQsIGxvY2FsUGxheWVyRW50aXR5LCB0aWxlU2l6ZSA9IDY0LCBzb2NrZXQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1BsYXllcicpO1xuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChwbGF5ZXIuaW52aW5jaWJsZVVudGlsICYmIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPiBub3cpIGNvbnRpbnVlO1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICAgICAgY29uc3QgZVBvcyA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHcmlkLWJhc2VkIGNvbGxpc2lvblxuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFggPSBNYXRoLmZsb29yKChwUG9zLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFkgPSBNYXRoLmZsb29yKChwUG9zLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuXG4gICAgICAgICAgICBpZiAocGxheWVyR3JpZFggPT09IGVQb3MuZ3JpZFggJiYgcGxheWVyR3JpZFkgPT09IGVQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c0xpdmVzID0gcGxheWVyLmxpdmVzID8/IDM7XG4gICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5tYXgocHJldmlvdXNMaXZlcyAtIDEsIDApO1xuICAgICAgICAgICAgICAgIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPSBub3cgKyAxNTAwO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgaXMgZGVhZCwgcmVwb3J0IGRlYXRoIE9OQ0UgdXNpbmcgZ3VhcmQgY2xhdXNlXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5saXZlcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuYWxyZWFkeVJlcG9ydGVkRGVhZCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5hbHJlYWR5UmVwb3J0ZWREZWFkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAob25QbGF5ZXJIdXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblBsYXllckh1cnQocGxheWVyRW50aXR5LCBwbGF5ZXIuaWQsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBQbGF5ZXIgc3RpbGwgYWxpdmUsIHJlcG9ydCBub3JtYWwgZGFtYWdlXG4gICAgICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUGxheWVySHVydChwbGF5ZXJFbnRpdHksIHBsYXllci5pZCwgcGxheWVyLmxpdmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBCcmVhayB0aGUgbG9vcCBzaW5jZSB0aGUgcGxheWVyIGhhcyBhbHJlYWR5IHRha2VuIGRhbWFnZSBmcm9tIHRoaXMgZXhwbG9zaW9uLlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IHNldExpdmVzIH0gZnJvbSAnLi4vLi4vcGFnZXMvZ2FtZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3dlclVwU3lzdGVtKHdvcmxkLCBvblBvd2VyVXBQaWNrZWQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1BsYXllcicpO1xuICAgIGNvbnN0IHBvd2VyVXBzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBQb3MgfHwgIXZlbCB8fCAhcGxheWVyKSBjb250aW51ZTtcblxuICAgICAgICAvLyBPTkxZIGxvY2FsIHBsYXllciBoYW5kbGVzIGNvbGxpc2lvbiB0byBhdm9pZCBtdWx0aS1waWNrdXAgYnVnc1xuICAgICAgICBpZiAoIXBsYXllci5pc0xvY2FsKSBjb250aW51ZTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBVcEVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgdXBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocFVwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBVcCA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXVwUG9zIHx8ICFwVXAgfHwgcFVwLnBpY2tlZFVwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgLy8gR3JpZC1iYXNlZCBjb2xsaXNpb246IHBsYXllciBncmlkIHBvc2l0aW9uIG1hdGNoZXMgcG93ZXItdXAgZ3JpZCBwb3NpdGlvblxuICAgICAgICAgICAgaWYgKHBQb3MuZ3JpZFggPT09IHVwUG9zLmdyaWRYICYmIHBQb3MuZ3JpZFkgPT09IHVwUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcFVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChwVXAudHlwZSA9PT0gJ0hFQVJUJykge1xuICAgICAgICAgICAgICAgICAgICAvLyAyLiBJbmNyZW1lbnQgdGhlIHBsYXllcidzIGxpdmVzXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5saXZlcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gMy4gVXBkYXRlIHRoZSBVSSBsaXZlcyBjb3VudGVyIGltbWVkaWF0ZWx5IG9uIHRoZSBzY3JlZW5cbiAgICAgICAgICAgICAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyAxLiBSZW1vdmUgdGhlIHNwZWNpZmljIEhlYXJ0IERPTSBlbGVtZW50IGZyb20gdGhlIHNjcmVlbiBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgIGlmIChwVXAuZWwgJiYgcFVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcFVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocFVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBOb3RpZnkgZ2FtZS5qcyB2aWEgY2FsbGJhY2sgZm9yIGFueSBzZXJ2ZXIgc3luYyBuZWVkZWRcbiAgICAgICAgICAgICAgICBpZiAob25Qb3dlclVwUGlja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uUG93ZXJVcFBpY2tlZChwbGF5ZXIuaWQsIHBVcC50eXBlLCB1cFBvcy5ncmlkWCwgdXBQb3MuZ3JpZFkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIDQuIFJlbW92ZSB0aGUgaGVhcnQgZnJvbSB0aGUgYWN0aXZlIGdhbWUgc3RhdGUgc28gaXQgY2Fubm90IGJlIHRyaWdnZXJlZCB0d2ljZVxuICAgICAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkocFVwRW50aXR5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByZW5kZXJTeXN0ZW0od29ybGQsIGR0LCBub3csIGFuaW1Sb3dzKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUmVuZGVyYWJsZScpO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcblxuICAgICAgICBpZiAoIXJlbmRlcmFibGUuZWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gcmVuZGVyYWJsZS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Um93ID0gYW5pbVJvd3Nbc3RhdGVdW3ZlbC5kaXJlY3Rpb25dO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYW5pbWF0aW9uIHdoZW4gcm93IG9yIHN0YXRlIGNoYW5nZXNcbiAgICAgICAgaWYgKHJlbmRlcmFibGUucm93ICE9PSB0YXJnZXRSb3cgfHwgcmVuZGVyYWJsZS5sYXN0U3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnJvdyA9IHRhcmdldFJvdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdFN0YXRlID0gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcmFtZUNvdW50ID0gc3RhdGUgPT09ICdSVU4nID8gcmVuZGVyYWJsZS5ydW5GcmFtZXMgOiByZW5kZXJhYmxlLmlkbGVGcmFtZXM7XG4gICAgICAgIGNvbnN0IGZyYW1lRGVsYXkgPSBzdGF0ZSA9PT0gJ1JVTicgPyAxMDAwIC8gcmVuZGVyYWJsZS5mcHMgOiAxMDAwIC8gcmVuZGVyYWJsZS5pZGxlRnBzO1xuXG4gICAgICAgIGlmIChub3cgLSByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPiBmcmFtZURlbGF5KSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IChyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSArIDEpICUgZnJhbWVDb3VudDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvc1ggPSAtKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICogcmVuZGVyYWJsZS5mcmFtZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcG9zWSA9IC0ocmVuZGVyYWJsZS5yb3cgKiByZW5kZXJhYmxlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYCR7cG9zWH1weCAke3Bvc1l9cHhgO1xuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3Bvcy54fXB4LCAke3Bvcy55fXB4LCAwKWA7XG4gICAgfVxufVxuIiwiLy8gL3NyYy9lY3Mvd29ybGQuanNcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uZXh0RW50aXR5SWQgPSAwO1xuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgTWFwKCk7IFxuICAgICAgICB0aGlzLnN5c3RlbXMgPSBbXTtcbiAgICB9XG5cbiAgICBjcmVhdGVFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMubmV4dEVudGl0eUlkKys7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkKGVudGl0eSk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVudGl0eShlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgZm9yIChjb25zdCBbY29tcG9uZW50TmFtZSwgY29tcG9uZW50TWFwXSBvZiB0aGlzLmNvbXBvbmVudHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lLCBjb21wb25lbnREYXRhID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHMuaGFzKGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIG5ldyBNYXAoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKS5zZXQoZW50aXR5LCBjb21wb25lbnREYXRhKTtcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRNYXAgPyBjb21wb25lbnRNYXAuZ2V0KGVudGl0eSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBpZiAoY29tcG9uZW50TWFwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBxdWVyeSguLi5jb21wb25lbnROYW1lcykge1xuICAgICAgICBpZiAoY29tcG9uZW50TmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaXJzdE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbMF0pO1xuICAgICAgICBpZiAoIWZpcnN0TWFwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGZpcnN0TWFwLmtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGhhc0FsbCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNvbXBvbmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXAgfHwgIW1hcC5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0FsbCAmJiB0aGlzLmVudGl0aWVzLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkU3lzdGVtKHN5c3RlbUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbUZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZHQsIG5vdykge1xuICAgICAgICBmb3IgKGNvbnN0IHN5c3RlbSBvZiB0aGlzLnN5c3RlbXMpIHtcbiAgICAgICAgICAgIHN5c3RlbSh0aGlzLCBkdCwgbm93KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmtcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gS2lja2VkTWVudSgpIHtcbiAgICBjb25zdCByZXR1cm5CdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlJldHVybiB0byBNYWluIE1lbnU8L2J1dHRvbj47XG5cbiAgICByZXR1cm5CdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHdpbmRvdy5zb2NrZXQgJiYgd2luZG93LnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgd2luZG93LnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgdHlwZTogXCJsZWF2ZV9yb29tXCIgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwiL1wiKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICAgICAgPGgxPktJQ0tFRCBGT1IgQUZLITwvaDE+XG4gICAgICAgICAgICA8cD5Zb3Ugd2VyZSByZW1vdmVkIGZyb20gdGhlIG1hdGNoIGZvciBzd2l0Y2hpbmcgdGFicy48L3A+XG4gICAgICAgICAgICB7cmV0dXJuQnRufVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdpbk1lbnUocHJvcHMpIHtcbiAgICBjb25zdCB3aW5uZXJOYW1lID0gcHJvcHMud2lubmVyTmFtZSB8fCBcIkEgUGxheWVyXCI7XG5cbiAgICBjb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbiAgICByZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHdpbmRvdy5zb2NrZXQgJiYgd2luZG93LnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgd2luZG93LnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgdHlwZTogXCJsZWF2ZV9yb29tXCIgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwiL1wiKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICAgICAgPGgxPnt3aW5uZXJOYW1lLnRvVXBwZXJDYXNlKCl9IFdPTiE8L2gxPlxuICAgICAgICAgICAgPHA+VGhlIGxhc3QgcGxheWVyIHN0YW5kaW5nIHRha2VzIHRoZSBjcm93bi48L3A+XG4gICAgICAgICAgICB7cmVwbGF5QnRufVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5cbmV4cG9ydCBjb25zdCBUSUxFX1NJWkUgPSA0ODtcbmNvbnN0IEdSSURfQk9SREVSX1NJWkUgPSA2O1xuXG5jb25zdCBpbWFnZXMgPSB7XG4gICAgMjogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIsXG4gICAgMzogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfd2FsbC5wbmdcIixcbiAgICA0OiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19leHBsb2l0LnBuZ1wiLFxufTtcblxuY29uc3QgW3BsYXllck5hbWUsIHNldFBsYXllck5hbWVdID0gY3JlYXRlU2lnbmFsKFwiUGxheWVyIDFcIik7XG5jb25zdCBbbGl2ZXMsIHNldExpdmVzXSA9IGNyZWF0ZVNpZ25hbCgzKTtcbmNvbnN0IFtzcGVlZCwgc2V0U3BlZWRdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW2JvbWJzLCBzZXRCb21ic10gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbcmFuZ2UsIHNldFJhbmdlXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmV4cG9ydCB7IHNldFBsYXllck5hbWUsIHNldExpdmVzLCBzZXRTcGVlZCwgc2V0Qm9tYnMsIHNldFJhbmdlIH07XG5cbmNvbnN0IG5hbWVFbCA9IDxzcGFuIGNsYXNzPVwicGxheWVyLW5hbWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBuYW1lRWwudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lKCk7IH0pO1xuXG5jb25zdCBsaXZlc0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBsaXZlcy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBzcGVlZEVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBzcGVlZC12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBib21ic0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBib21icy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCByYW5nZUVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSByYW5nZS12YWx1ZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGxpdmVzRWwudGV4dENvbnRlbnQgPSBsaXZlcygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHNwZWVkRWwudGV4dENvbnRlbnQgPSBzcGVlZCgpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGJvbWJzRWwudGV4dENvbnRlbnQgPSBib21icygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHJhbmdlRWwudGV4dENvbnRlbnQgPSByYW5nZSgpOyB9KTtcblxuZnVuY3Rpb24gR2FtZSh7IGdyaWQgfSkge1xuICAgIGNvbnN0IGJvYXJkV2lkdGggPSBncmlkWzBdLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZEhlaWdodCA9IGdyaWQubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkRGlzcGxheVdpZHRoID0gKGJvYXJkV2lkdGggKyBHUklEX0JPUkRFUl9TSVpFICogMikgKiAwLjgwO1xuICAgIGNvbnN0IGJvYXJkRGlzcGxheUhlaWdodCA9IChib2FyZEhlaWdodCArIEdSSURfQk9SREVSX1NJWkUgKiAyKSAqIDAuODA7XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBncmlkLmxlbmd0aDsgcm93SW5kZXgrKykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgZ3JpZFtyb3dJbmRleF0ubGVuZ3RoOyBjb2xJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZ3JpZFtyb3dJbmRleF1bY29sSW5kZXhdO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IFwidGlsZVwiO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gYHdpZHRoOiR7VElMRV9TSVpFfXB4O2hlaWdodDoke1RJTEVfU0laRX1weDtgO1xuXG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMiB8fCBjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtZmxvb3JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtd2FsbFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1szXX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzRdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDAgfHwgY2VsbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1syXX0pYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2VsbHMucHVzaCg8ZGl2IGNsYXNzPXtjbGFzc05hbWV9IGRhdGEteD17Y29sSW5kZXh9IGRhdGEteT17cm93SW5kZXh9IHN0eWxlPXtzdHlsZX0+PC9kaXY+KTtcbiAgICAgICAgfVxuICAgICAgICByb3dzLnB1c2goPGRpdiBjbGFzcz1cImdyaWQtcm93XCI+e2NlbGxzfTwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1nbGFzc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1iYXJcIj5cbiAgICAgICAgICAgICAgICAgICAge25hbWVFbH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLXN0YXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkxpdmVzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsaXZlc0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlNwZWVkPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzcGVlZEVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkJvbWJzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib21ic0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlJhbmdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyYW5nZUVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWJvYXJkLWZyYW1lXCIgc3R5bGU9e2B3aWR0aDoke2JvYXJkRGlzcGxheVdpZHRofXB4O2hlaWdodDoke2JvYXJkRGlzcGxheUhlaWdodH1weDtgfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJnYW1lLWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImdhbWUtZ3JpZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17YHBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiR7Ym9hcmRXaWR0aH1weDtoZWlnaHQ6JHtib2FyZEhlaWdodH1weDt0cmFuc2Zvcm06c2NhbGUoMC44MCk7YH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IENoYXRQbGF5ZXJzIGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxubGV0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSBjcmVhdGVTaWduYWwoe30pO1xuZXhwb3J0IHsgc2V0U3RhdGVzIH07XG5cbmxldCByb29tSWRFbCA9IDxwPlJvb20gSUQ6IDwvcD47XG5sZXQgcGxheWVyc0VsID0gPHA+UGxheWVyczogIC8gNDwvcD47XG5sZXQgdGV4dEVsID0gPHA+PC9wPjtcbmxldCB0aW1lckVsID0gPHA+VGltZXI6IDwvcD47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcyA9IHN0YXRlcygpO1xuICAgIHJvb21JZEVsLnRleHRDb250ZW50ID0gYFJvb20gSUQ6ICR7cy5yb29tSWR9YDtcbiAgICBwbGF5ZXJzRWwudGV4dENvbnRlbnQgPSBgUGxheWVyczogJHtzLnBsYXllcnNDb3VudH0gLyA0YDtcbiAgICB0ZXh0RWwudGV4dENvbnRlbnQgPSBzLnRleHQ7XG4gICAgaWYgKHMuc2Vjb25kc0xlZnQpIHRpbWVyRWwudGV4dENvbnRlbnQgPSBcIlRpbWUgOiBcIiArIHMuc2Vjb25kc0xlZnQ7XG4gICAgZWxzZSB0aW1lckVsLnRleHRDb250ZW50ID0gXCJcIjtcbn0pO1xuXG5mdW5jdGlvbiBMb2JieSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29uYXRpbmVyLWxvYmJ5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9iYnktYm94XCI+XG4gICAgICAgICAgICAgICAgPGgxPkxvYmJ5PC9oMT5cbiAgICAgICAgICAgICAgICB7cm9vbUlkRWx9XG4gICAgICAgICAgICAgICAge3BsYXllcnNFbH1cbiAgICAgICAgICAgICAgICB7dGV4dEVsfVxuICAgICAgICAgICAgICAgIHt0aW1lckVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q2hhdFBsYXllcnMgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2JieTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5jb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbnJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbmxldCBtZW51RWwgPSAoXG4gICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgIDxoMT5Zb3UgV2luITwvaDE+XG4gICAgICAgIDxwPkFsbCBvdGhlciBwbGF5ZXJzIGhhdmUgbGVmdCB0aGUgZ2FtZS48L3A+XG4gICAgICAgIHtyZXBsYXlCdG59XG4gICAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZW51KCkge1xuICAgIHJldHVybiBtZW51RWw7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5jb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IGNyZWF0ZVNpZ25hbChcIlwiKTtcbmV4cG9ydCB7IHNldEVycm9yIH07XG5cbmZ1bmN0aW9uIFJlZ2lzdGVyKHsgd3NzIH0pIHtcbiAgICBsZXQgc3VibWl0dGVkID0gZmFsc2U7XG4gICAgY29uc3QgZXJyb3JFbCA9IDxwIGNsYXNzPVwicmVnaXN0ZXItZXJyb3JcIj48L3A+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgZXJyb3JFbC50ZXh0Q29udGVudCA9IGVycm9yKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgcGxheWVyRW50ZXIgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCBuaWNrbmFtZSA9IGZvcm1EYXRhLmdldChcIm5pY2tuYW1lXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW5pY2tuYW1lIHx8IG5pY2tuYW1lLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBzZXRFcnJvcihcIkludmFsaWQgbmlja25hbWVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcbiAgICAgICAgc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc2V0UGxheWVyTmFtZShuaWNrbmFtZSk7XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJuaWNrbmFtZV9vZl90aGVfcGxheWVyXCIsXG4gICAgICAgICAgICBuaWNrbmFtZTogbmlja25hbWVcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxmb3JtIGNsYXNzPVwicmVnaXN0ZXItZm9ybVwiIG9uU3VibWl0PXtwbGF5ZXJFbnRlcn0+XG4gICAgICAgICAgICB7ZXJyb3JFbH1cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5pY2tuYW1lLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVudGVyIHlvdXIgbmFtZVwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIHRoaXMubXVzaWMucGxheSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpO1xuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVzaWMucGF1c2VkIHx8IHRoaXMubXVzaWMubXV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvblwiKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVCdXR0b24oKSB7XG4gICAgICAgIGNvbnN0IGlzTXV0ZWQgPSB0aGlzLm11c2ljLm11dGVkIHx8IHRoaXMubXVzaWMucGF1c2VkO1xuXG4gICAgICAgIHRoaXMuaWNvbi5jbGFzc05hbWUgPSBpc011dGVkID8gXCJmYS1zb2xpZCBmYS12b2x1bWUtb2ZmXCIgOiBcImZhLXNvbGlkIGZhLXZvbHVtZS1oaWdoXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1tdXRlZFwiLCBpc011dGVkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvdW5kO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC9hcHAuanNcIik7XG4iLCIiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJwcm9wcyIsImNoaWxkcmVuIiwiZWxlIiwiZG9jdW1lbnQiLCJrZXkiLCJzdGFydHNXaXRoIiwiZXZlbnROYW1lIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRBdHRyaWJ1dGUiLCJmbGF0Q2hpbGRyZW4iLCJmbGF0IiwiSW5maW5pdHkiLCJhcHBlbmQiLCJmaWx0ZXIiLCJjaGlsZCIsInVuZGVmaW5lZCIsInJlbmRlciIsImVsZW1lbnQiLCJjb250YWluZXIiLCJyZXBsYWNlQ2hpbGRyZW4iLCJSb3V0ZXIiLCJyb3V0ZXIiLCJlZmZlY3RTdGFjayIsImFjdGl2ZUVmZmVjdCIsImNyZWF0ZVNpZ25hbCIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwiZWZmZWN0cyIsIlNldCIsIlJlYWQiLCJhZGQiLCJXcml0ZSIsIm5ld1ZhbHVlIiwiZm4iLCJmb3JFYWNoIiwiZWZmZWN0IiwiY3JlYXRlRWZmZWN0IiwicHVzaCIsInBvcCIsImxlbmd0aCIsIlJvdXRlcyIsIk9iamVjdCIsImNyZWF0ZSIsIkZpcnN0UmVzb2x2ZSIsIm9uIiwicGF0aCIsImhhbmRsZXIiLCJuYXZpZ2F0ZSIsImhpc3RvcnkiLCJuYXZpZ2F0aW9uIiwicmVzb2x2ZSIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJ1cmwiLCJVUkwiLCJocmVmIiwibGlzdGVuIiwib25FcnJvcjQwNCIsImV2ZW50IiwiZGVzdGluYXRpb24iLCJpbnRlcmNlcHQiLCJjb25zb2xlIiwibG9nIiwiUmVnaXN0ZXIiLCJzZXRFcnJvciIsIkdhbWUiLCJNZW51IiwiTG9iYnkiLCJXaW5NZW51IiwiS2lja2VkTWVudSIsInNldFN0YXRlcyIsInNldFBsYXllck5hbWUiLCJzZXRIdWRQbGF5ZXJOYW1lIiwiU291bmQiLCJzZXRNZXNzYWdlcyIsIkdhbWVFbmdpbmUiLCJoYW5kbGVQbGF5ZXJEZWF0aCIsIlRJTEVfU0laRSIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsIndpbmRvdyIsInNvY2tldCIsInNvdW5kIiwiY3VycmVudEdhbWVFbmdpbmUiLCJpbml0IiwiYm9keSIsImNsYXNzTmFtZSIsImFsZXJ0Iiwid3MiLCJtZXNzYWdlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsInF1ZXJ5U2VsZWN0b3IiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJzZWNvbmRzTGVmdCIsInRleHQiLCJkZXN0cm95IiwiZ3JpZCIsInNldFRpbWVvdXQiLCJnYW1lQ29udGFpbmVyIiwibG9jYWxQbGF5ZXIiLCJwbGF5ZXJzIiwiZmluZCIsInBsYXllciIsImlkIiwieW91clBsYXllcklkIiwibmlja25hbWUiLCJlbmdpbmUiLCJoaWRkZW4iLCJzZW5kIiwic3RyaW5naWZ5IiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJvbkFGSyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJlcnJvciIsIndpbm5lck5hbWUiLCJlbnRpdHkiLCJwbGF5ZXJFbnRpdGllcyIsImdldCIsIlN0cmluZyIsInBsYXllcklkIiwid29ybGQiLCJkZXN0cm95RW50aXR5IiwiZGVsZXRlIiwicHJldiIsImhhbmRsZVJlbW90ZU1vdmUiLCJwYXlsb2FkIiwiaGFuZGxlUmVtb3RlQm9tYiIsImhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQiLCJoYW5kbGVFeHBsb3Npb25DaGVja2VkIiwiaGFuZGxlUGxheWVyRGFtYWdlZCIsImhhbmRsZUdhbWVPdmVyIiwiZXJyIiwibWVzc2FnZXMiLCJDaGF0UGxheWVycyIsIm1lc3NhZ2VzQ29udGFpbmVyIiwiY2xhc3MiLCJtc2dzIiwibXNnIiwicCIsInRleHRDb250ZW50IiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsInRyaW0iLCJyZXNldCIsIm9uU3VibWl0IiwibmFtZSIsInBsYWNlaG9sZGVyIiwibWF4bGVuZ3RoIiwiUG9zaXRpb25Db21wb25lbnQiLCJneCIsImd5IiwidGlsZVNpemUiLCJncmlkWCIsImdyaWRZIiwieCIsInkiLCJ0YXJnZXRYIiwidGFyZ2V0WSIsIlZlbG9jaXR5Q29tcG9uZW50IiwiYmFzZVNwZWVkIiwic3BlZWQiLCJzcGVlZEJvb3N0Iiwic3BlZWRCb29zdFRpbWVSZW1haW5pbmciLCJpc01vdmluZyIsImRpcmVjdGlvbiIsIklucHV0Q29tcG9uZW50IiwiaW5wdXRRdWV1ZSIsIlJlbmRlcmFibGVDb21wb25lbnQiLCJlbCIsImZyYW1lV2lkdGgiLCJmcmFtZUhlaWdodCIsInRvdGFsRnJhbWVzIiwiZnBzIiwiY3VycmVudEZyYW1lIiwicnVuRnJhbWVzIiwiaWRsZUZyYW1lcyIsImlkbGVGcHMiLCJsYXN0RnJhbWVUaW1lIiwicm93Iiwic3RhdGUiLCJsYXN0U3RhdGUiLCJQbGF5ZXJDb21wb25lbnQiLCJjaGFyVHlwZSIsImlzTG9jYWwiLCJCb21iQ29tcG9uZW50Iiwib3duZXJJZCIsInRpbWVyIiwicmFuZ2UiLCJleHBsb2RlZCIsIkV4cGxvc2lvbkNvbXBvbmVudCIsImR1cmF0aW9uIiwiUG93ZXJVcENvbXBvbmVudCIsInBpY2tlZFVwIiwiQmVoYXZpb3JDb21wb25lbnQiLCJmYXN0U2hvZXNMZXZlbCIsImJvbWJzIiwibWF4IiwiY3VycmVudCIsIldvcmxkIiwicmVnaXN0ZXJTeXN0ZW1zIiwiZ2FtZUxvb3AiLCJzZXR1cElucHV0Iiwic2VuZElucHV0IiwiZHJvcEJvbWIiLCJjcmVhdGVCb21iIiwicmVtb3ZlUG93ZXJVcEF0IiwidXBkYXRlTWFwQ2VsbCIsInJlbW92ZUJvbWIiLCJjcmVhdGVFeHBsb3Npb24iLCJjcmVhdGVQb3dlclVwIiwiYXBwbHlTZXJ2ZXJTdGF0cyIsInVwZGF0ZUh1ZFN0YXRzIiwiZ2V0UGxheWVyTmFtZSIsImNvbnN0cnVjdG9yIiwiY2FudmFzQ29udGFpbmVyIiwibWFwRGF0YSIsImxvY2FsUGxheWVyRW50aXR5IiwiTWFwIiwibGFzdFRpbWUiLCJyZW1vdmVJbnB1dExpc3RlbmVycyIsImFuaW1hdGlvbkZyYW1lIiwicnVubmluZyIsImNsYWltZWRQb3dlclVwcyIsImxhc3RJbnB1dFNlbnQiLCJTUFJJVEVfQ09MVU1OUyIsIlNQUklURV9ST1dTIiwiQU5JTUFUSU9OX1JPV1MiLCJSVU4iLCJ1cCIsImxlZnQiLCJkb3duIiwicmlnaHQiLCJJRExFIiwiYm9tYklkIiwiZXhpc3RzIiwicXVlcnkiLCJzb21lIiwicG9zIiwiZ2V0Q29tcG9uZW50IiwiYm9tYiIsImJvbWJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJib21iRGl2Iiwic3R5bGUiLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwidG9wIiwiekluZGV4IiwiYWRkQ29tcG9uZW50IiwiYm9tYkNvbXAiLCJwb3dlclVwcyIsInBvd2VyVXAiLCJwYXJlbnROb2RlIiwidGlsZSIsImJhY2tncm91bmRJbWFnZSIsImZhbGxiYWNrQ2VsbCIsInNhbWVJZCIsInNhbWVDZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2IiwiaGFzIiwicFVwRW50aXR5IiwiZGl2Iiwic2V0Qm9tYnMiLCJzZXRMaXZlcyIsInNldFJhbmdlIiwic2V0U3BlZWQiLCJ2ZWxvY2l0eSIsIm1heEJvbWJzIiwibGl2ZXMiLCJib21iUmFuZ2UiLCJNYXRoIiwicm91bmQiLCJpbnB1dCIsImdldEtleURpcmVjdGlvbiIsImhhbmRsZUtleURvd24iLCJkaXIiLCJpbmNsdWRlcyIsImNvZGUiLCJoYW5kbGVLZXlVcCIsImQiLCJyZWFkeVN0YXRlIiwiT1BFTiIsImFsaXZlIiwiQm9vbGVhbiIsImlucHV0U3RhdGUiLCJjdXJyZW50Qm9tYnMiLCJiRW50aXR5IiwicmVuZGVyU3lzdGVtIiwicG93ZXJVcFN5c3RlbSIsImxvY2FsUGxheWVySWQiLCJhbGxQbGF5ZXJzIiwibm9ybWFsaXplZExvY2FsUGxheWVySWQiLCJwRGF0YSIsInBsYXllckVudGl0eSIsInBsYXllckRpdiIsImNvbG9yIiwid2lsbENoYW5nZSIsImJhY2tncm91bmRTaXplIiwic3giLCJzeSIsInBsYXllckNvbXAiLCJzZXQiLCJ3YXJuIiwibWFwIiwicGVyZm9ybWFuY2UiLCJub3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJhZGRTeXN0ZW0iLCJ3IiwiZHQiLCJ1cGRhdGUiLCJuZXh0Tm93IiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImdldEl0ZW0iLCJBcnJheSIsImZyb20iLCJrZXlzIiwidmVsIiwicmVuZGVyYWJsZSIsInN0YXRzIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwib2Zmc2V0V2lkdGgiLCJyZW1vdmVDb21wb25lbnQiLCJjZWxscyIsImRlc3Ryb3llZEJsb2NrcyIsImNlbGwiLCJzcGF3bmVkUG93ZXJVcHMiLCJzcGF3bkhlYXJ0UG93ZXJVcCIsInBsYXllclgiLCJwbGF5ZXJZIiwiaGVhcnRFbnRpdHkiLCJzbmFwcGVkWCIsInNuYXBwZWRZIiwiaGVhcnREaXYiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiZm9udFNpemUiLCJkYW1hZ2VTeXN0ZW0iLCJvblBsYXllckh1cnQiLCJleHBsb3Npb25zIiwicFBvcyIsImludmluY2libGVVbnRpbCIsImVQb3MiLCJwbGF5ZXJHcmlkWCIsImZsb29yIiwicGxheWVyR3JpZFkiLCJwcmV2aW91c0xpdmVzIiwiYWxyZWFkeVJlcG9ydGVkRGVhZCIsIm9uUG93ZXJVcFBpY2tlZCIsInVwUG9zIiwicFVwIiwiYW5pbVJvd3MiLCJlbnRpdGllcyIsInRhcmdldFJvdyIsImZyYW1lQ291bnQiLCJmcmFtZURlbGF5IiwicG9zWCIsInBvc1kiLCJiYWNrZ3JvdW5kUG9zaXRpb24iLCJ0cmFuc2Zvcm0iLCJuZXh0RW50aXR5SWQiLCJjb21wb25lbnRzIiwic3lzdGVtcyIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnRNYXAiLCJlbnRyaWVzIiwiY29tcG9uZW50RGF0YSIsImNvbXBvbmVudE5hbWVzIiwiZmlyc3RNYXAiLCJyZXN1bHRzIiwiaGFzQWxsIiwiaSIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwicmV0dXJuQnRuIiwicmVwbGF5QnRuIiwidG9VcHBlckNhc2UiLCJHUklEX0JPUkRFUl9TSVpFIiwiaW1hZ2VzIiwicGxheWVyTmFtZSIsIm5hbWVFbCIsImxpdmVzRWwiLCJzcGVlZEVsIiwiYm9tYnNFbCIsInJhbmdlRWwiLCJib2FyZFdpZHRoIiwiYm9hcmRIZWlnaHQiLCJib2FyZERpc3BsYXlXaWR0aCIsImJvYXJkRGlzcGxheUhlaWdodCIsInJvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4Iiwic3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsInJlbG9hZCIsIm1lbnVFbCIsInN1Ym1pdHRlZCIsImVycm9yRWwiLCJwbGF5ZXJFbnRlciIsImN1cnJlbnRUYXJnZXQiLCJzcmMiLCJtdXNpYyIsIkF1ZGlvIiwiYnV0dG9uIiwiaWNvbiIsImxvb3AiLCJ2b2x1bWUiLCJ0b2dnbGUiLCJ1cGRhdGVCdXR0b24iLCJwbGF5IiwidGhlbiIsImNhdGNoIiwicGF1c2VkIiwibXV0ZWQiLCJpc011dGVkIl0sInNvdXJjZVJvb3QiOiIifQ==