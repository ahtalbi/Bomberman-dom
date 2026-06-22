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
/* harmony import */ var _utils_sound__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/sound */ "./src/utils/sound.js");
/* harmony import */ var _components_chat__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/chat */ "./src/components/chat.jsx");
/* harmony import */ var _ecs_game_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ecs/game.js */ "./src/ecs/game.js");











const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");
const sound = new _utils_sound__WEBPACK_IMPORTED_MODULE_6__["default"]("./assets/sounds/background_music.mp3");
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
          const engine = new _ecs_game_js__WEBPACK_IMPORTED_MODULE_8__.GameEngine(gameContainer, message.grid, wss);
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
    case "chat_message":
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_7__.setMessages)(prev => [...prev, {
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
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pages/game */ "./src/pages/game.jsx");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.js */ "./src/ecs/game/constants.js");




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
    playerDiv.style.width = `${_pages_game__WEBPACK_IMPORTED_MODULE_2__.TILE_SIZE}px`;
    playerDiv.style.height = `${_pages_game__WEBPACK_IMPORTED_MODULE_2__.TILE_SIZE}px`;
    playerDiv.style.backgroundSize = `${_constants_js__WEBPACK_IMPORTED_MODULE_3__.SPRITE_COLUMNS * _pages_game__WEBPACK_IMPORTED_MODULE_2__.TILE_SIZE}px ${_constants_js__WEBPACK_IMPORTED_MODULE_3__.SPRITE_ROWS * _pages_game__WEBPACK_IMPORTED_MODULE_2__.TILE_SIZE}px`;
    this.container.appendChild(playerDiv);
    const sx = pData.x || 1;
    const sy = pData.y || 1;
    this.world.addComponent(playerEntity, 'Position', (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.PositionComponent)(sx, sy, _pages_game__WEBPACK_IMPORTED_MODULE_2__.TILE_SIZE));
    this.world.addComponent(playerEntity, 'Velocity', (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.VelocityComponent)(pData.speed || 2.5));
    this.world.addComponent(playerEntity, 'Renderable', (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.RenderableComponent)(playerDiv, _pages_game__WEBPACK_IMPORTED_MODULE_2__.TILE_SIZE, _pages_game__WEBPACK_IMPORTED_MODULE_2__.TILE_SIZE, 4, 12));
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
  this.world.addSystem((w, dt, now) => (0,_systems_renderSystem_js__WEBPACK_IMPORTED_MODULE_1__.renderSystem)(w, dt, now, _constants_js__WEBPACK_IMPORTED_MODULE_3__.ANIMATION_ROWS));
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
  const boardDisplayWidth = (boardWidth + GRID_BORDER_SIZE * 2) * 0.95;
  const boardDisplayHeight = (boardHeight + GRID_BORDER_SIZE * 2) * 0.95;
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
    style: `position:relative;width:${boardWidth}px;height:${boardHeight}px;transform:scale(0.95);`
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LElBQUksQ0FBQ29ZLFlBQVksQ0FBQyxDQUFDO0lBQ3ZCO0VBQ0o7RUFFQUEsWUFBWUEsQ0FBQSxFQUFHO0lBQ1gsTUFBTU0sT0FBTyxHQUFHLElBQUksQ0FBQ2IsS0FBSyxDQUFDWSxLQUFLLElBQUksSUFBSSxDQUFDWixLQUFLLENBQUNXLE1BQU07SUFFckQsSUFBSSxDQUFDUixJQUFJLENBQUN0VCxTQUFTLEdBQUdnVSxPQUFPLEdBQUcsd0JBQXdCLEdBQUcseUJBQXlCO0lBQ3BGLElBQUksQ0FBQ1gsTUFBTSxDQUFDWSxTQUFTLENBQUNSLE1BQU0sQ0FBQyxVQUFVLEVBQUVPLE9BQU8sQ0FBQztFQUNyRDtBQUNKO0FBRUEsaUVBQWUzVSxLQUFLLEU7Ozs7OztVQ2pEcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvZG9tLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NoYXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9lY3MvY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9nYW1lL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUvZW50aXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9nYW1lL2h1ZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUvaW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9nYW1lL2xpZmVjeWNsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUvcGxheWVyTmFtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUvcmVtb3RlSGFuZGxlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3dvcmxkLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyLCB7IHNldEVycm9yIH0gZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFN0YXRlcyB9IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSBhcyBzZXRIdWRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBTb3VuZCBmcm9tIFwiLi4vdXRpbHMvc291bmRcIjtcbmltcG9ydCB7IHNldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5pbXBvcnQgeyBHYW1lRW5naW5lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7IFxuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0OjUwMDBcIik7XG5jb25zdCBzb3VuZCA9IG5ldyBTb3VuZChcIi4vYXNzZXRzL3NvdW5kcy9iYWNrZ3JvdW5kX211c2ljLm1wM1wiKTtcbmxldCBjdXJyZW50R2FtZUVuZ2luZSA9IG51bGw7XG5cbnNvdW5kLmluaXQoKTtcblxucm91dGVyLm9uKFwiL1wiLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcInJlZ2lzdGVyLXBhZ2VcIjtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKHdzKSA9PiB7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJsb2JieV91cGRhdGVcIjpcbiAgICAgICAgICAgIGlmICghcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmNvbmF0aW5lci1sb2JieVwiKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcig8TG9iYnkgLz4sIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogbWVzc2FnZS5wbGF5ZXJzQ291bnQsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IG1lc3NhZ2Uuc2Vjb25kc0xlZnQsXG4gICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZ2FtZV9zdGFydGVkXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwiZ2FtZS1wYWdlXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlbmRlcig8R2FtZSBncmlkPXttZXNzYWdlLmdyaWR9IC8+LCByb290KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFBsYXllciA9IChtZXNzYWdlLnBsYXllcnMgfHwgW10pLmZpbmQocGxheWVyID0+IHBsYXllci5pZCA9PT0gbWVzc2FnZS55b3VyUGxheWVySWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxQbGF5ZXIgJiYgbG9jYWxQbGF5ZXIubmlja25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEh1ZFBsYXllck5hbWUobG9jYWxQbGF5ZXIubmlja25hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5naW5lID0gbmV3IEdhbWVFbmdpbmUoZ2FtZUNvbnRhaW5lciwgbWVzc2FnZS5ncmlkLCB3c3MpO1xuICAgICAgICAgICAgICAgICAgICBlbmdpbmUuaW5pdChtZXNzYWdlLnlvdXJQbGF5ZXJJZCwgbWVzc2FnZS5wbGF5ZXJzIHx8IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gZW5naW5lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJHYW1lIGNvbnRhaW5lciB3YXMgbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJyb29tX2Fsb25lXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPE1lbnUgLz4sIHJvb3QpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgY2FzZSBcImNoYXRfbWVzc2FnZVwiOlxuICAgICAgICAgICAgc2V0TWVzc2FnZXMocHJldiA9PiBbLi4ucHJldiwge1xuICAgICAgICAgICAgICAgIG5pY2tuYW1lOiBtZXNzYWdlLm5pY2tuYW1lIHx8IFwiUGxheWVyXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZS5tZXNzYWdlLFxuICAgICAgICAgICAgfV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfbW92ZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZU1vdmUobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm9tYl9kcm9wcGVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVCb21iKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBvd2VydXBfcGlja2VkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImV4cGxvc2lvbl9jaGVja2VkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVFeHBsb3Npb25DaGVja2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBsYXllcl9kYW1hZ2VkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVQbGF5ZXJEYW1hZ2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImdhbWVfb3ZlclwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlR2FtZU92ZXIobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZXJyb3JcIjpcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9PT0gXCJyZWdpc3Rlci1wYWdlXCIpIHtcbiAgICAgICAgICAgICAgICBzZXRFcnJvcihtZXNzYWdlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydChtZXNzYWdlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3JcIiwgZXJyKTtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NlZFwiKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB3c3M7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IHdzcyBmcm9tIFwiLi4vYXBwL2FwcFwiO1xuXG5jb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IGNyZWF0ZVNpZ25hbChbXSk7XG5leHBvcnQgeyBzZXRNZXNzYWdlcyB9O1xuXG5mdW5jdGlvbiBDaGF0UGxheWVycygpIHtcbiAgICBjb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IDxkaXYgY2xhc3M9XCJtZXNzYWdlc1wiPjwvZGl2PjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZ3MgPSBtZXNzYWdlcygpO1xuICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGZvciAobGV0IG1zZyBvZiBtc2dzKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG1zZyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBtc2c7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBgJHttc2cubmlja25hbWV9OiAke21zZy5tZXNzYWdlfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG1lc3NhZ2VzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBtc2dzLnVuc2hpZnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBmb3JtRGF0YS5nZXQoXCJtZXNzYWdlXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcImNoYXRfbWVzc2FnZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgfSkpO1xuICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0XCIgb25TdWJtaXQ9e2Jyb2FkY2FzdE1lc3NhZ2V9PlxuICAgICAgICAgICAge21lc3NhZ2VzQ29udGFpbmVyfVxuICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1lc3NhZ2VcIiBwbGFjZWhvbGRlcj1cInR5cGUgdG8gdGhlIG90aGVyIHBsYXllcnMgLi4uXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXRQbGF5ZXJzO1xuIiwiLy8gL3NyYy9lY3MvY29tcG9uZW50cy5qc1xuXG5leHBvcnQgY29uc3QgUG9zaXRpb25Db21wb25lbnQgPSAoZ3gsIGd5LCB0aWxlU2l6ZSA9IDY0KSA9PiAoe1xuICAgIGdyaWRYOiBneCxcbiAgICBncmlkWTogZ3ksXG4gICAgeDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB5OiBneSAqIHRpbGVTaXplLFxuICAgIHRhcmdldFg6IGd4ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WTogZ3kgKiB0aWxlU2l6ZVxufSk7XG5cbmV4cG9ydCBjb25zdCBWZWxvY2l0eUNvbXBvbmVudCA9IChiYXNlU3BlZWQgPSAyLjUpID0+ICh7XG4gICAgYmFzZVNwZWVkOiBiYXNlU3BlZWQsXG4gICAgc3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBzcGVlZEJvb3N0OiAwLFxuICAgIHNwZWVkQm9vc3RUaW1lUmVtYWluaW5nOiAwLFxuICAgIGlzTW92aW5nOiBmYWxzZSxcbiAgICBkaXJlY3Rpb246ICdkb3duJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBJbnB1dENvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgaW5wdXRRdWV1ZTogW11cbn0pO1xuXG5leHBvcnQgY29uc3QgUmVuZGVyYWJsZUNvbXBvbmVudCA9IChlbCwgZnJhbWVXaWR0aCA9IDY0LCBmcmFtZUhlaWdodCA9IDY0LCB0b3RhbEZyYW1lcyA9IDQsIGZwcyA9IDEyKSA9PiAoe1xuICAgIGVsOiBlbCxcbiAgICBmcmFtZVdpZHRoOiBmcmFtZVdpZHRoLFxuICAgIGZyYW1lSGVpZ2h0OiBmcmFtZUhlaWdodCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IHRvdGFsRnJhbWVzLFxuICAgIHJ1bkZyYW1lczogNCxcbiAgICBpZGxlRnJhbWVzOiAyLFxuICAgIGZwczogZnBzLFxuICAgIGlkbGVGcHM6IDQsXG4gICAgbGFzdEZyYW1lVGltZTogMCxcbiAgICByb3c6IDAsXG4gICAgc3RhdGU6ICdJRExFJyxcbiAgICBsYXN0U3RhdGU6ICdJRExFJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXJDb21wb25lbnQgPSAoaWQsIGNoYXJUeXBlLCBpc0xvY2FsID0gZmFsc2UpID0+ICh7XG4gICAgaWQ6IGlkLFxuICAgIGNoYXJUeXBlOiBjaGFyVHlwZSxcbiAgICBpc0xvY2FsOiBpc0xvY2FsXG59KTtcblxuZXhwb3J0IGNvbnN0IEJvbWJDb21wb25lbnQgPSAob3duZXJJZCwgdGltZXIgPSAyMDAwLCByYW5nZSA9IDIpID0+ICh7XG4gICAgb3duZXJJZDogb3duZXJJZCxcbiAgICB0aW1lcjogdGltZXIsXG4gICAgcmFuZ2U6IHJhbmdlLFxuICAgIGV4cGxvZGVkOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBFeHBsb3Npb25Db21wb25lbnQgPSAoZHVyYXRpb24gPSA1MDApID0+ICh7XG4gICAgZHVyYXRpb246IGR1cmF0aW9uXG59KTtcblxuZXhwb3J0IGNvbnN0IFBvd2VyVXBDb21wb25lbnQgPSAodHlwZSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlLCBcbiAgICBwaWNrZWRVcDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgQmVoYXZpb3JDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGZhc3RTaG9lc0xldmVsOiAxLFxuICAgIGJvbWJzOiB7XG4gICAgICAgIG1heDogMSxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgcmFuZ2U6IDJcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC5qcyc7XG5pbXBvcnQgeyBpbml0LCByZWdpc3RlclN5c3RlbXMsIGdhbWVMb29wLCBkZXN0cm95IH0gZnJvbSAnLi9nYW1lL2xpZmVjeWNsZS5qcyc7XG5pbXBvcnQgeyBzZXR1cElucHV0LCBzZW5kSW5wdXQsIGRyb3BCb21iIH0gZnJvbSAnLi9nYW1lL2lucHV0LmpzJztcbmltcG9ydCB7IGNyZWF0ZUJvbWIsIHJlbW92ZVBvd2VyVXBBdCwgdXBkYXRlTWFwQ2VsbCwgcmVtb3ZlQm9tYiwgY3JlYXRlRXhwbG9zaW9uLCBjcmVhdGVQb3dlclVwIH0gZnJvbSAnLi9nYW1lL2VudGl0aWVzLmpzJztcbmltcG9ydCB7XG4gICAgaGFuZGxlUmVtb3RlTW92ZSxcbiAgICBoYW5kbGVSZW1vdGVCb21iLFxuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQsXG4gICAgYXBwbHlTZXJ2ZXJTdGF0cyxcbiAgICBoYW5kbGVQbGF5ZXJEYW1hZ2VkLFxuICAgIGhhbmRsZUdhbWVPdmVyLFxuICAgIGhhbmRsZUV4cGxvc2lvbkNoZWNrZWRcbn0gZnJvbSAnLi9nYW1lL3JlbW90ZUhhbmRsZXJzLmpzJztcbmltcG9ydCB7IHVwZGF0ZUh1ZFN0YXRzIH0gZnJvbSAnLi9nYW1lL2h1ZC5qcyc7XG5cbmV4cG9ydCB7IHNldFBsYXllck5hbWUsIGdldFBsYXllck5hbWUgfSBmcm9tICcuL2dhbWUvcGxheWVyTmFtZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBHYW1lRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNDb250YWluZXIsIG1hcERhdGEsIHNvY2tldCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNhbnZhc0NvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gbWFwRGF0YTtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcbiAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IG51bGw7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5sYXN0SW5wdXRTZW50ID0gXCJcIjtcbiAgICB9XG5cbiAgICBpbml0ID0gaW5pdDtcbiAgICBzZXR1cElucHV0ID0gc2V0dXBJbnB1dDtcbiAgICBzZW5kSW5wdXQgPSBzZW5kSW5wdXQ7XG4gICAgZHJvcEJvbWIgPSBkcm9wQm9tYjtcbiAgICBjcmVhdGVCb21iID0gY3JlYXRlQm9tYjtcbiAgICBoYW5kbGVSZW1vdGVNb3ZlID0gaGFuZGxlUmVtb3RlTW92ZTtcbiAgICBoYW5kbGVSZW1vdGVCb21iID0gaGFuZGxlUmVtb3RlQm9tYjtcbiAgICBoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkID0gaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZDtcbiAgICByZW1vdmVQb3dlclVwQXQgPSByZW1vdmVQb3dlclVwQXQ7XG4gICAgYXBwbHlTZXJ2ZXJTdGF0cyA9IGFwcGx5U2VydmVyU3RhdHM7XG4gICAgaGFuZGxlUGxheWVyRGFtYWdlZCA9IGhhbmRsZVBsYXllckRhbWFnZWQ7XG4gICAgaGFuZGxlR2FtZU92ZXIgPSBoYW5kbGVHYW1lT3ZlcjtcbiAgICBoYW5kbGVFeHBsb3Npb25DaGVja2VkID0gaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZDtcbiAgICB1cGRhdGVNYXBDZWxsID0gdXBkYXRlTWFwQ2VsbDtcbiAgICByZW1vdmVCb21iID0gcmVtb3ZlQm9tYjtcbiAgICBjcmVhdGVFeHBsb3Npb24gPSBjcmVhdGVFeHBsb3Npb247XG4gICAgY3JlYXRlUG93ZXJVcCA9IGNyZWF0ZVBvd2VyVXA7XG4gICAgcmVnaXN0ZXJTeXN0ZW1zID0gcmVnaXN0ZXJTeXN0ZW1zO1xuICAgIGdhbWVMb29wID0gZ2FtZUxvb3A7XG4gICAgZGVzdHJveSA9IGRlc3Ryb3k7XG4gICAgdXBkYXRlSHVkU3RhdHMgPSB1cGRhdGVIdWRTdGF0cztcbn1cbiIsImV4cG9ydCBjb25zdCBTUFJJVEVfQ09MVU1OUyA9IDEzO1xuZXhwb3J0IGNvbnN0IFNQUklURV9ST1dTID0gNTQ7XG5cbmV4cG9ydCBjb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuIiwiaW1wb3J0IHsgQm9tYkNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMuanMnO1xuaW1wb3J0IHsgVElMRV9TSVpFIH0gZnJvbSAnLi4vLi4vcGFnZXMvZ2FtZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCb21iKG93bmVySWQsIGdyaWRYLCBncmlkWSwgcmFuZ2UsIGJvbWJJZCA9IG51bGwpIHtcbiAgICBjb25zdCBleGlzdHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuc29tZShlbnRpdHkgPT4ge1xuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBib21iID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQm9tYicpO1xuICAgICAgICByZXR1cm4gKGJvbWJJZCAmJiBib21iLmJvbWJJZCA9PT0gYm9tYklkKSB8fFxuICAgICAgICAgICAgKGJvbWIub3duZXJJZCA9PT0gb3duZXJJZCAmJiBwb3MuZ3JpZFggPT09IGdyaWRYICYmIHBvcy5ncmlkWSA9PT0gZ3JpZFkpO1xuICAgIH0pO1xuXG4gICAgaWYgKGV4aXN0cykgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgY29uc3QgYm9tYkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJvbWJEaXYuY2xhc3NOYW1lID0gJ2JvbWInO1xuICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGJvbWJEaXYuc3R5bGUud2lkdGggPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGJvbWJEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgYm9tYkRpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIFRJTEVfU0laRX1weGA7XG4gICAgYm9tYkRpdi5zdHlsZS56SW5kZXggPSAnNic7XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYLCBncmlkWSB9KTtcblxuICAgIGNvbnN0IGJvbWJDb21wID0gQm9tYkNvbXBvbmVudChvd25lcklkLCAyMDAwLCByYW5nZSk7XG4gICAgYm9tYkNvbXAuYm9tYklkID0gYm9tYklkO1xuICAgIGJvbWJDb21wLmVsID0gYm9tYkRpdjtcbiAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicsIGJvbWJDb21wKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVBvd2VyVXBBdChncmlkWCwgZ3JpZFkpIHtcbiAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7Z3JpZFh9LCR7Z3JpZFl9YCk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwb3dlclVwID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICBpZiAoIXBvcyB8fCAhcG93ZXJVcCkgY29udGludWU7XG5cbiAgICAgICAgaWYgKHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWSkge1xuICAgICAgICAgICAgcG93ZXJVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChwb3dlclVwLmVsICYmIHBvd2VyVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHBvd2VyVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3dlclVwLmVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy53b3JsZC5kZXN0cm95RW50aXR5KGVudGl0eSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVNYXBDZWxsKHgsIHksIG5ld1ZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLm1hcERhdGFbeV0pIHJldHVybjtcblxuICAgIHRoaXMubWFwRGF0YVt5XVt4XSA9IG5ld1ZhbHVlO1xuXG4gICAgY29uc3QgdGlsZSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gKTtcbiAgICBpZiAoIXRpbGUpIHJldHVybjtcblxuICAgIHRpbGUuY2xhc3NOYW1lID0gJ3RpbGUgdGlsZS1mbG9vcic7XG4gICAgdGlsZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiKSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVCb21iKGJvbWJJZCwgZmFsbGJhY2tDZWxsKSB7XG4gICAgY29uc3QgYm9tYnMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBib21icykge1xuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBib21iID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQm9tYicpO1xuICAgICAgICBjb25zdCBzYW1lSWQgPSBib21iSWQgJiYgYm9tYiAmJiBib21iLmJvbWJJZCA9PT0gYm9tYklkO1xuICAgICAgICBjb25zdCBzYW1lQ2VsbCA9IGZhbGxiYWNrQ2VsbCAmJiBwb3MgJiYgcG9zLmdyaWRYID09PSBmYWxsYmFja0NlbGwueCAmJiBwb3MuZ3JpZFkgPT09IGZhbGxiYWNrQ2VsbC55O1xuXG4gICAgICAgIGlmICghc2FtZUlkICYmICFzYW1lQ2VsbCkgY29udGludWU7XG5cbiAgICAgICAgaWYgKGJvbWIuZWwgJiYgYm9tYi5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBib21iLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYm9tYi5lbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLndvcmxkLmRlc3Ryb3lFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUV4cGxvc2lvbihncmlkWCwgZ3JpZFksIGR1cmF0aW9uKSB7XG4gICAgY29uc3QgZXhwRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICBjb25zdCBleHBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBleHBEaXYuY2xhc3NOYW1lID0gJ2V4cGxvc2lvbic7XG4gICAgZXhwRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBleHBEaXYuc3R5bGUud2lkdGggPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGV4cERpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiBUSUxFX1NJWkV9cHhgO1xuICAgIGV4cERpdi5zdHlsZS50b3AgPSBgJHtncmlkWSAqIFRJTEVfU0laRX1weGA7XG4gICAgZXhwRGl2LnN0eWxlLnpJbmRleCA9ICc3JztcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChleHBEaXYpO1xuXG4gICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYLCBncmlkWSwgeDogZ3JpZFggKiBUSUxFX1NJWkUsIHk6IGdyaWRZICogVElMRV9TSVpFIH0pO1xuICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicsIHsgZHVyYXRpb24sIGVsOiBleHBEaXYgfSk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGV4cERpdi5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBleHBEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChleHBEaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShleHBFbnRpdHkpO1xuICAgIH0sIGR1cmF0aW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBvd2VyVXAoZ3gsIGd5LCB0eXBlKSB7XG4gICAgaWYgKCF0eXBlIHx8IHRoaXMuY2xhaW1lZFBvd2VyVXBzLmhhcyhgJHtneH0sJHtneX1gKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgcFVwRW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogVElMRV9TSVpFLCB5OiBneSAqIFRJTEVfU0laRSB9KTtcblxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSBgcG93ZXJ1cCBwb3dlcnVwLSR7dHlwZS50b0xvd2VyQ2FzZSgpfWA7XG4gICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBkaXYuc3R5bGUud2lkdGggPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBgJHtUSUxFX1NJWkV9cHhgO1xuICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiBUSUxFX1NJWkV9cHhgO1xuICAgIGRpdi5zdHlsZS50b3AgPSBgJHtneSAqIFRJTEVfU0laRX1weGA7XG4gICAgZGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcsIHsgdHlwZSwgZWw6IGRpdiB9KTtcbn1cbiIsImltcG9ydCB7IHNldEJvbWJzLCBzZXRMaXZlcywgc2V0UmFuZ2UsIHNldFNwZWVkIH0gZnJvbSAnLi4vLi4vcGFnZXMvZ2FtZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVIdWRTdGF0cyhlbnRpdHkpIHtcbiAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzID8/IDMpO1xuICAgIHNldFJhbmdlKHBsYXllci5ib21iUmFuZ2UgfHwgNCk7XG4gICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNldHVwSW5wdXQoKSB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICBjb25zdCBnZXRLZXlEaXJlY3Rpb24gPSAoa2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1VwJyB8fCBrZXkgPT09ICd3JyB8fCBrZXkgPT09ICdaJyB8fCBrZXkgPT09ICd6JykgcmV0dXJuICd1cCc7XG4gICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dMZWZ0JyB8fCBrZXkgPT09ICdhJyB8fCBrZXkgPT09ICdRJyB8fCBrZXkgPT09ICdxJykgcmV0dXJuICdsZWZ0JztcbiAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93UmlnaHQnIHx8IGtleSA9PT0gJ2QnIHx8IGtleSA9PT0gJ0QnKSByZXR1cm4gJ3JpZ2h0JztcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZSkgPT4ge1xuICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgIGlucHV0LmlucHV0UXVldWUudW5zaGlmdChkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZW5kSW5wdXQoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUua2V5ID09PSAnICcgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgdGhpcy5zZW5kSW5wdXQoaW5wdXQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuXG4gICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZW5kSW5wdXQoaW5wdXQpIHtcbiAgICBpZiAoIXRoaXMuc29ja2V0IHx8IHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSByZXR1cm47XG4gICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICBpZiAoIXBsYXllciB8fCAhcGxheWVyLmFsaXZlKSByZXR1cm47XG5cbiAgICBjb25zdCBkaXJlY3Rpb24gPSBpbnB1dC5pbnB1dFF1ZXVlWzBdIHx8IG51bGw7XG4gICAgY29uc3QgaXNNb3ZpbmcgPSBCb29sZWFuKGRpcmVjdGlvbik7XG4gICAgY29uc3QgaW5wdXRTdGF0ZSA9IGAke2RpcmVjdGlvbiB8fCAnaWRsZSd9OiR7aXNNb3ZpbmcgPyAxIDogMH1gO1xuXG4gICAgaWYgKHRoaXMubGFzdElucHV0U2VudCA9PT0gaW5wdXRTdGF0ZSkgcmV0dXJuO1xuICAgIHRoaXMubGFzdElucHV0U2VudCA9IGlucHV0U3RhdGU7XG5cbiAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdHlwZTogJ01PVkVfU1RBVEUnLFxuICAgICAgICBwYXlsb2FkOiB7IGRpcmVjdGlvbiwgaXNNb3ZpbmcgfVxuICAgIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyb3BCb21iKCkge1xuICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgaWYgKCFwbGF5ZXIgfHwgIXBsYXllci5hbGl2ZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgY3VycmVudEJvbWJzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpLmZpbHRlcihiRW50aXR5ID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGJFbnRpdHksICdCb21iJykub3duZXJJZCA9PT0gcGxheWVyLmlkO1xuICAgIH0pO1xuXG4gICAgaWYgKGN1cnJlbnRCb21icy5sZW5ndGggPj0gcGxheWVyLm1heEJvbWJzKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiAnRFJPUF9CT01CJyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHt9XG4gICAgICAgIH0pKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge1xuICAgIFBvc2l0aW9uQ29tcG9uZW50LFxuICAgIFZlbG9jaXR5Q29tcG9uZW50LFxuICAgIElucHV0Q29tcG9uZW50LFxuICAgIFJlbmRlcmFibGVDb21wb25lbnQsXG4gICAgUGxheWVyQ29tcG9uZW50XG59IGZyb20gJy4uL2NvbXBvbmVudHMuanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi4vc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgVElMRV9TSVpFIH0gZnJvbSAnLi4vLi4vcGFnZXMvZ2FtZSc7XG5pbXBvcnQgeyBBTklNQVRJT05fUk9XUywgU1BSSVRFX0NPTFVNTlMsIFNQUklURV9ST1dTIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdChsb2NhbFBsYXllcklkLCBhbGxQbGF5ZXJzKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZExvY2FsUGxheWVySWQgPSBTdHJpbmcobG9jYWxQbGF5ZXJJZCk7XG5cbiAgICBhbGxQbGF5ZXJzLmZvckVhY2gocERhdGEgPT4ge1xuICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IFN0cmluZyhwRGF0YS5pZCk7XG4gICAgICAgIGNvbnN0IHBsYXllckVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IHBsYXllckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb25zdCBjb2xvciA9IHBEYXRhLmNvbG9yIHx8IFwid2hpdGVcIjtcblxuICAgICAgICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gYHBsYXllciBwbGF5ZXItJHtjb2xvcn1gO1xuICAgICAgICBwbGF5ZXJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuekluZGV4ID0gJzEwJztcbiAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpZHRoID0gYCR7VElMRV9TSVpFfXB4YDtcbiAgICAgICAgcGxheWVyRGl2LnN0eWxlLmhlaWdodCA9IGAke1RJTEVfU0laRX1weGA7XG4gICAgICAgIHBsYXllckRpdi5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IGAke1NQUklURV9DT0xVTU5TICogVElMRV9TSVpFfXB4ICR7U1BSSVRFX1JPV1MgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJEaXYpO1xuXG4gICAgICAgIGNvbnN0IHN4ID0gcERhdGEueCB8fCAxO1xuICAgICAgICBjb25zdCBzeSA9IHBEYXRhLnkgfHwgMTtcblxuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicsIFBvc2l0aW9uQ29tcG9uZW50KHN4LCBzeSwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5JywgVmVsb2NpdHlDb21wb25lbnQocERhdGEuc3BlZWQgfHwgMi41KSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnLCBSZW5kZXJhYmxlQ29tcG9uZW50KHBsYXllckRpdiwgVElMRV9TSVpFLCBUSUxFX1NJWkUsIDQsIDEyKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGlzTG9jYWwgPSBwbGF5ZXJJZCA9PT0gbm9ybWFsaXplZExvY2FsUGxheWVySWQ7XG4gICAgICAgIGNvbnN0IHBsYXllckNvbXAgPSBQbGF5ZXJDb21wb25lbnQocGxheWVySWQsIGNvbG9yLCBpc0xvY2FsKTtcbiAgICAgICAgcGxheWVyQ29tcC5saXZlcyA9IHBEYXRhLmxpdmVzID8/IDM7XG4gICAgICAgIHBsYXllckNvbXAubWF4Qm9tYnMgPSBwRGF0YS5tYXhCb21icyA/PyAxO1xuICAgICAgICBwbGF5ZXJDb21wLmJvbWJSYW5nZSA9IHBEYXRhLmJvbWJSYW5nZSA/PyAyO1xuICAgICAgICBwbGF5ZXJDb21wLmFsaXZlID0gcERhdGEuYWxpdmUgPz8gdHJ1ZTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJywgcGxheWVyQ29tcCk7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMuc2V0KHBsYXllcklkLCBwbGF5ZXJFbnRpdHkpO1xuXG4gICAgICAgIGlmIChpc0xvY2FsKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsUGxheWVyRW50aXR5ID0gcGxheWVyRW50aXR5O1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnLCBJbnB1dENvbXBvbmVudCgpKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMocGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBJbnB1dCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJbR2FtZUVuZ2luZV0gTG9jYWwgcGxheWVyIHdhcyBub3QgZm91bmRcIiwge1xuICAgICAgICAgICAgbG9jYWxQbGF5ZXJJZCxcbiAgICAgICAgICAgIHBsYXllcnM6IGFsbFBsYXllcnMubWFwKHBsYXllciA9PiBwbGF5ZXIuaWQpLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnJlZ2lzdGVyU3lzdGVtcygpO1xuXG4gICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobm93KSA9PiB0aGlzLmdhbWVMb29wKG5vdykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJTeXN0ZW1zKCkge1xuICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiByZW5kZXJTeXN0ZW0odywgZHQsIG5vdywgQU5JTUFUSU9OX1JPV1MpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdhbWVMb29wKG5vdykge1xuICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICBjb25zdCBkdCA9IG5vdyAtIHRoaXMubGFzdFRpbWU7XG4gICAgdGhpcy5sYXN0VGltZSA9IG5vdztcbiAgICB0aGlzLndvcmxkLnVwZGF0ZShkdCwgbm93KTtcbiAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpO1xuICAgIH1cbiAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChuZXh0Tm93KSA9PiB0aGlzLmdhbWVMb29wKG5leHROb3cpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycykge1xuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzKCk7XG4gICAgfVxufVxuIiwibGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJpbXBvcnQgeyBzZXRMaXZlcyB9IGZyb20gJy4uLy4uL3BhZ2VzL2dhbWUnO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUmVtb3RlTW92ZShwYXlsb2FkKSB7XG4gICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIltoYW5kbGVSZW1vdGVNb3ZlXSBJbnZhbGlkIHBheWxvYWQ6XCIsIHBheWxvYWQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIEVudGl0eSBub3QgZm91bmQgZm9yIHBsYXllciAke3BheWxvYWQuaWR9LiBBdmFpbGFibGUgcGxheWVyczpgLCBBcnJheS5mcm9tKHRoaXMucGxheWVyRW50aXRpZXMua2V5cygpKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgIGNvbnN0IHZlbCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgY29uc3QgcmVuZGVyYWJsZSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICBcbiAgICBpZiAoIXBvcyB8fCAhdmVsIHx8ICFyZW5kZXJhYmxlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIE1pc3NpbmcgY29tcG9uZW50cyBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH06YCwgeyBwb3M6ICEhcG9zLCB2ZWw6ICEhdmVsLCByZW5kZXJhYmxlOiAhIXJlbmRlcmFibGUgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2ZWwuZGlyZWN0aW9uID0gcGF5bG9hZC5kaXJlY3Rpb24gfHwgdmVsLmRpcmVjdGlvbjtcbiAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgIHBvcy5ncmlkWCA9IHBheWxvYWQuZ3JpZFg7XG4gICAgcG9zLmdyaWRZID0gcGF5bG9hZC5ncmlkWTtcbiAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICBwb3MudGFyZ2V0WSA9IHBheWxvYWQueTtcbiAgICBwb3MueCA9IHBheWxvYWQueDtcbiAgICBwb3MueSA9IHBheWxvYWQueTtcblxuICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUmVtb3RlQm9tYihwYXlsb2FkKSB7XG4gICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG4gICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDIsIHBheWxvYWQuYm9tYklkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQocGF5bG9hZCkge1xuICAgIGlmICghcGF5bG9hZCB8fCBwYXlsb2FkLnggPT09IHVuZGVmaW5lZCB8fCBwYXlsb2FkLnkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuXG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgIGlmIChwYXlsb2FkLnN0YXRzKSB7XG4gICAgICAgIHRoaXMuYXBwbHlTZXJ2ZXJTdGF0cyhlbnRpdHksIHBheWxvYWQuc3RhdHMpO1xuICAgIH1cblxuICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyhlbnRpdHkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5U2VydmVyU3RhdHMoZW50aXR5LCBzdGF0cykge1xuICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICBpZiAoIXBsYXllciB8fCAhc3RhdHMpIHJldHVybjtcblxuICAgIHBsYXllci5saXZlcyA9IHN0YXRzLmxpdmVzID8/IHBsYXllci5saXZlcztcbiAgICBwbGF5ZXIubWF4Qm9tYnMgPSBzdGF0cy5tYXhCb21icyA/PyBwbGF5ZXIubWF4Qm9tYnM7XG4gICAgcGxheWVyLmJvbWJSYW5nZSA9IHN0YXRzLmJvbWJSYW5nZSA/PyBwbGF5ZXIuYm9tYlJhbmdlO1xuICAgIHBsYXllci5hbGl2ZSA9IHN0YXRzLmFsaXZlID8/IHBsYXllci5hbGl2ZTtcblxuICAgIGlmICh2ZWxvY2l0eSAmJiB0eXBlb2Ygc3RhdHMuc3BlZWQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHZlbG9jaXR5LnNwZWVkID0gc3RhdHMuc3BlZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUGxheWVyRGFtYWdlZChwYXlsb2FkKSB7XG4gICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG5cbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5pZCkpO1xuICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgaWYgKCFwbGF5ZXIpIHJldHVybjtcblxuICAgIHBsYXllci5saXZlcyA9IHBheWxvYWQubGl2ZXMgPz8gcGxheWVyLmxpdmVzO1xuICAgIHBsYXllci5hbGl2ZSA9IHBheWxvYWQuYWxpdmUgPz8gcGxheWVyLmFsaXZlO1xuXG4gICAgaWYgKCFwbGF5ZXIuYWxpdmUpIHtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAodmVsb2NpdHkpIHZlbG9jaXR5LmlzTW92aW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgdGhpcy53b3JsZC5yZW1vdmVDb21wb25lbnQoZW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVHYW1lT3ZlcihwYXlsb2FkKSB7XG4gICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgY29uc3Qgd2lubmVyTmFtZSA9IHBheWxvYWQgJiYgcGF5bG9hZC53aW5uZXJOYW1lID8gcGF5bG9hZC53aW5uZXJOYW1lIDogXCJBIHBsYXllclwiO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gYWxlcnQoYCR7d2lubmVyTmFtZX0gd2lucyFgKSwgNTApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZChwYXlsb2FkKSB7XG4gICAgaWYgKCFwYXlsb2FkKSByZXR1cm47XG5cbiAgICB0aGlzLnJlbW92ZUJvbWIocGF5bG9hZC5ib21iSWQsIHBheWxvYWQuY2VsbHMgJiYgcGF5bG9hZC5jZWxsc1swXSk7XG5cbiAgICAocGF5bG9hZC5kZXN0cm95ZWRCbG9ja3MgfHwgW10pLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlTWFwQ2VsbChjZWxsLngsIGNlbGwueSwgMik7XG4gICAgfSk7XG5cbiAgICAocGF5bG9hZC5zcGF3bmVkUG93ZXJVcHMgfHwgW10pLmZvckVhY2gocG93ZXJVcCA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlUG93ZXJVcChwb3dlclVwLngsIHBvd2VyVXAueSwgcG93ZXJVcC50eXBlKTtcbiAgICB9KTtcblxuICAgIChwYXlsb2FkLmNlbGxzIHx8IFtdKS5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0ZUV4cGxvc2lvbihjZWxsLngsIGNlbGwueSwgNTAwKTtcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByZW5kZXJTeXN0ZW0od29ybGQsIGR0LCBub3csIGFuaW1Sb3dzKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUmVuZGVyYWJsZScpO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcblxuICAgICAgICBpZiAoIXJlbmRlcmFibGUuZWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gcmVuZGVyYWJsZS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Um93ID0gYW5pbVJvd3Nbc3RhdGVdW3ZlbC5kaXJlY3Rpb25dO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYW5pbWF0aW9uIHdoZW4gcm93IG9yIHN0YXRlIGNoYW5nZXNcbiAgICAgICAgaWYgKHJlbmRlcmFibGUucm93ICE9PSB0YXJnZXRSb3cgfHwgcmVuZGVyYWJsZS5sYXN0U3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnJvdyA9IHRhcmdldFJvdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdFN0YXRlID0gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcmFtZUNvdW50ID0gc3RhdGUgPT09ICdSVU4nID8gcmVuZGVyYWJsZS5ydW5GcmFtZXMgOiByZW5kZXJhYmxlLmlkbGVGcmFtZXM7XG4gICAgICAgIGNvbnN0IGZyYW1lRGVsYXkgPSBzdGF0ZSA9PT0gJ1JVTicgPyAxMDAwIC8gcmVuZGVyYWJsZS5mcHMgOiAxMDAwIC8gcmVuZGVyYWJsZS5pZGxlRnBzO1xuXG4gICAgICAgIGlmIChub3cgLSByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPiBmcmFtZURlbGF5KSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IChyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSArIDEpICUgZnJhbWVDb3VudDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvc1ggPSAtKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICogcmVuZGVyYWJsZS5mcmFtZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcG9zWSA9IC0ocmVuZGVyYWJsZS5yb3cgKiByZW5kZXJhYmxlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYCR7cG9zWH1weCAke3Bvc1l9cHhgO1xuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3Bvcy54fXB4LCAke3Bvcy55fXB4LCAwKWA7XG4gICAgfVxufVxuIiwiLy8gL3NyYy9lY3Mvd29ybGQuanNcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uZXh0RW50aXR5SWQgPSAwO1xuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgTWFwKCk7IFxuICAgICAgICB0aGlzLnN5c3RlbXMgPSBbXTtcbiAgICB9XG5cbiAgICBjcmVhdGVFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMubmV4dEVudGl0eUlkKys7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkKGVudGl0eSk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVudGl0eShlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgZm9yIChjb25zdCBbY29tcG9uZW50TmFtZSwgY29tcG9uZW50TWFwXSBvZiB0aGlzLmNvbXBvbmVudHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lLCBjb21wb25lbnREYXRhID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHMuaGFzKGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIG5ldyBNYXAoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKS5zZXQoZW50aXR5LCBjb21wb25lbnREYXRhKTtcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRNYXAgPyBjb21wb25lbnRNYXAuZ2V0KGVudGl0eSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBpZiAoY29tcG9uZW50TWFwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBxdWVyeSguLi5jb21wb25lbnROYW1lcykge1xuICAgICAgICBpZiAoY29tcG9uZW50TmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaXJzdE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbMF0pO1xuICAgICAgICBpZiAoIWZpcnN0TWFwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGZpcnN0TWFwLmtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGhhc0FsbCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNvbXBvbmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXAgfHwgIW1hcC5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0FsbCAmJiB0aGlzLmVudGl0aWVzLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkU3lzdGVtKHN5c3RlbUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbUZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZHQsIG5vdykge1xuICAgICAgICBmb3IgKGNvbnN0IHN5c3RlbSBvZiB0aGlzLnN5c3RlbXMpIHtcbiAgICAgICAgICAgIHN5c3RlbSh0aGlzLCBkdCwgbm93KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5leHBvcnQgY29uc3QgVElMRV9TSVpFID0gNDg7XG5jb25zdCBHUklEX0JPUkRFUl9TSVpFID0gNjtcblxuY29uc3QgaW1hZ2VzID0ge1xuICAgIDI6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiLFxuICAgIDM6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX3dhbGwucG5nXCIsXG4gICAgNDogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZXhwbG9pdC5wbmdcIixcbn07XG5cbmNvbnN0IFtwbGF5ZXJOYW1lLCBzZXRQbGF5ZXJOYW1lXSA9IGNyZWF0ZVNpZ25hbChcIlBsYXllciAxXCIpO1xuY29uc3QgW2xpdmVzLCBzZXRMaXZlc10gPSBjcmVhdGVTaWduYWwoMyk7XG5jb25zdCBbc3BlZWQsIHNldFNwZWVkXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtib21icywgc2V0Qm9tYnNdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW3JhbmdlLCBzZXRSYW5nZV0gPSBjcmVhdGVTaWduYWwoMSk7XG5leHBvcnQgeyBzZXRQbGF5ZXJOYW1lLCBzZXRMaXZlcywgc2V0U3BlZWQsIHNldEJvbWJzLCBzZXRSYW5nZSB9O1xuXG5jb25zdCBuYW1lRWwgPSA8c3BhbiBjbGFzcz1cInBsYXllci1uYW1lXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbmFtZUVsLnRleHRDb250ZW50ID0gcGxheWVyTmFtZSgpOyB9KTtcblxuY29uc3QgbGl2ZXNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgbGl2ZXMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3Qgc3BlZWRFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgc3BlZWQtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgYm9tYnNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgYm9tYnMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgcmFuZ2VFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgcmFuZ2UtdmFsdWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBsaXZlc0VsLnRleHRDb250ZW50ID0gbGl2ZXMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBzcGVlZEVsLnRleHRDb250ZW50ID0gc3BlZWQoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBib21ic0VsLnRleHRDb250ZW50ID0gYm9tYnMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyByYW5nZUVsLnRleHRDb250ZW50ID0gcmFuZ2UoKTsgfSk7XG5cbmZ1bmN0aW9uIEdhbWUoeyBncmlkIH0pIHtcbiAgICBjb25zdCBib2FyZFdpZHRoID0gZ3JpZFswXS5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRIZWlnaHQgPSBncmlkLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZERpc3BsYXlXaWR0aCA9IChib2FyZFdpZHRoICsgR1JJRF9CT1JERVJfU0laRSAqIDIpICogMC45NTtcbiAgICBjb25zdCBib2FyZERpc3BsYXlIZWlnaHQgPSAoYm9hcmRIZWlnaHQgKyBHUklEX0JPUkRFUl9TSVpFICogMikgKiAwLjk1O1xuICAgIGNvbnN0IHJvd3MgPSBbXTtcbiAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgZ3JpZC5sZW5ndGg7IHJvd0luZGV4KyspIHtcbiAgICAgICAgY29uc3QgY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IGdyaWRbcm93SW5kZXhdLmxlbmd0aDsgY29sSW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGdyaWRbcm93SW5kZXhdW2NvbEluZGV4XTtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBcInRpbGVcIjtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGB3aWR0aDoke1RJTEVfU0laRX1weDtoZWlnaHQ6JHtUSUxFX1NJWkV9cHg7YDtcblxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDIgfHwgY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLWZsb29yXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLXdhbGxcIjtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbM119KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1s0XX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAwIHx8IGNlbGwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbMl19KWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNlbGxzLnB1c2goPGRpdiBjbGFzcz17Y2xhc3NOYW1lfSBkYXRhLXg9e2NvbEluZGV4fSBkYXRhLXk9e3Jvd0luZGV4fSBzdHlsZT17c3R5bGV9PjwvZGl2Pik7XG4gICAgICAgIH1cbiAgICAgICAgcm93cy5wdXNoKDxkaXYgY2xhc3M9XCJncmlkLXJvd1wiPntjZWxsc308L2Rpdj4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtZ2xhc3NcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtYmFyXCI+XG4gICAgICAgICAgICAgICAgICAgIHtuYW1lRWx9XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1zdGF0c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5MaXZlczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bGl2ZXNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5TcGVlZDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c3BlZWRFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5Cb21iczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Ym9tYnNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5SYW5nZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmFuZ2VFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1ib2FyZC1mcmFtZVwiIHN0eWxlPXtgd2lkdGg6JHtib2FyZERpc3BsYXlXaWR0aH1weDtoZWlnaHQ6JHtib2FyZERpc3BsYXlIZWlnaHR9cHg7YH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZ2FtZS1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJnYW1lLWdyaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2Bwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoke2JvYXJkV2lkdGh9cHg7aGVpZ2h0OiR7Ym9hcmRIZWlnaHR9cHg7dHJhbnNmb3JtOnNjYWxlKDAuOTUpO2B9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCBDaGF0UGxheWVycyBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmxldCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gY3JlYXRlU2lnbmFsKHt9KTtcbmV4cG9ydCB7IHNldFN0YXRlcyB9O1xuXG5sZXQgcm9vbUlkRWwgPSA8cD5Sb29tIElEOiA8L3A+O1xubGV0IHBsYXllcnNFbCA9IDxwPlBsYXllcnM6ICAvIDQ8L3A+O1xubGV0IHRleHRFbCA9IDxwPjwvcD47XG5sZXQgdGltZXJFbCA9IDxwPlRpbWVyOiA8L3A+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHMgPSBzdGF0ZXMoKTtcbiAgICByb29tSWRFbC50ZXh0Q29udGVudCA9IGBSb29tIElEOiAke3Mucm9vbUlkfWA7XG4gICAgcGxheWVyc0VsLnRleHRDb250ZW50ID0gYFBsYXllcnM6ICR7cy5wbGF5ZXJzQ291bnR9IC8gNGA7XG4gICAgdGV4dEVsLnRleHRDb250ZW50ID0gcy50ZXh0O1xuICAgIGlmIChzLnNlY29uZHNMZWZ0KSB0aW1lckVsLnRleHRDb250ZW50ID0gXCJUaW1lIDogXCIgKyBzLnNlY29uZHNMZWZ0O1xuICAgIGVsc2UgdGltZXJFbC50ZXh0Q29udGVudCA9IFwiXCI7XG59KTtcblxuZnVuY3Rpb24gTG9iYnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbmF0aW5lci1sb2JieVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYmJ5LWJveFwiPlxuICAgICAgICAgICAgICAgIDxoMT5Mb2JieTwvaDE+XG4gICAgICAgICAgICAgICAge3Jvb21JZEVsfVxuICAgICAgICAgICAgICAgIHtwbGF5ZXJzRWx9XG4gICAgICAgICAgICAgICAge3RleHRFbH1cbiAgICAgICAgICAgICAgICB7dGltZXJFbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPENoYXRQbGF5ZXJzIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG5yZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5sZXQgbWVudUVsID0gKFxuICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICA8aDE+WW91IFdpbiE8L2gxPlxuICAgICAgICA8cD5BbGwgb3RoZXIgcGxheWVycyBoYXZlIGxlZnQgdGhlIGdhbWUuPC9wPlxuICAgICAgICB7cmVwbGF5QnRufVxuICAgIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVudSgpIHtcbiAgICByZXR1cm4gbWVudUVsO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSBjcmVhdGVTaWduYWwoXCJcIik7XG5leHBvcnQgeyBzZXRFcnJvciB9O1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGVycm9yRWwgPSA8cCBjbGFzcz1cInJlZ2lzdGVyLWVycm9yXCI+PC9wPjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGVycm9yRWwudGV4dENvbnRlbnQgPSBlcnJvcigpO1xuICAgIH0pO1xuXG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgbmlja25hbWUgPSBmb3JtRGF0YS5nZXQoXCJuaWNrbmFtZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFuaWNrbmFtZSB8fCBuaWNrbmFtZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgc2V0RXJyb3IoXCJJbnZhbGlkIG5pY2tuYW1lXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0RXJyb3IoXCJcIik7XG4gICAgICAgIHN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHNldFBsYXllck5hbWUobmlja25hbWUpO1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwibmlja25hbWVfb2ZfdGhlX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAge2Vycm9yRWx9XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaWNrbmFtZS1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5pY2tuYW1lXCIgcGxhY2Vob2xkZXI9XCJlbnRlciB5b3VyIG5hbWVcIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJyZWdpc3Rlci1idXR0b25cIiB0eXBlPVwic3VibWl0XCI+c3RhcnQgcGxheWluZzwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RlcjtcbiIsImNsYXNzIFNvdW5kIHtcbiAgICBjb25zdHJ1Y3RvcihzcmMpIHtcbiAgICAgICAgdGhpcy5tdXNpYyA9IG5ldyBBdWRpbyhzcmMpO1xuICAgICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuXG4gICAgICAgIHRoaXMubXVzaWMubG9vcCA9IHRydWU7XG4gICAgICAgIHRoaXMubXVzaWMudm9sdW1lID0gMC40O1xuXG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTmFtZSA9IFwic291bmQtYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFwcGVuZCh0aGlzLmljb24pO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZSgpKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZCh0aGlzLmJ1dHRvbik7XG5cbiAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLm11c2ljLnBsYXkoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11c2ljLnBhdXNlZCB8fCB0aGlzLm11c2ljLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb25cIik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQnV0dG9uKCkge1xuICAgICAgICBjb25zdCBpc011dGVkID0gdGhpcy5tdXNpYy5tdXRlZCB8fCB0aGlzLm11c2ljLnBhdXNlZDtcblxuICAgICAgICB0aGlzLmljb24uY2xhc3NOYW1lID0gaXNNdXRlZCA/IFwiZmEtc29saWQgZmEtdm9sdW1lLW9mZlwiIDogXCJmYS1zb2xpZCBmYS12b2x1bWUtaGlnaFwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtbXV0ZWRcIiwgaXNNdXRlZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VuZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAvYXBwLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwicHJvcHMiLCJjaGlsZHJlbiIsImVsZSIsImRvY3VtZW50Iiwia2V5Iiwic3RhcnRzV2l0aCIsImV2ZW50TmFtZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwiZmxhdENoaWxkcmVuIiwiZmxhdCIsIkluZmluaXR5IiwiYXBwZW5kIiwiZmlsdGVyIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJyZW5kZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwicmVwbGFjZUNoaWxkcmVuIiwiUm91dGVyIiwicm91dGVyIiwiZWZmZWN0U3RhY2siLCJhY3RpdmVFZmZlY3QiLCJjcmVhdGVTaWduYWwiLCJpbml0aWFsVmFsdWUiLCJ2YWx1ZSIsImVmZmVjdHMiLCJTZXQiLCJSZWFkIiwiYWRkIiwiV3JpdGUiLCJuZXdWYWx1ZSIsImZuIiwiZm9yRWFjaCIsImVmZmVjdCIsImNyZWF0ZUVmZmVjdCIsInB1c2giLCJwb3AiLCJsZW5ndGgiLCJSb3V0ZXMiLCJPYmplY3QiLCJjcmVhdGUiLCJGaXJzdFJlc29sdmUiLCJvbiIsInBhdGgiLCJoYW5kbGVyIiwibmF2aWdhdGUiLCJoaXN0b3J5IiwibmF2aWdhdGlvbiIsInJlc29sdmUiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwidXJsIiwiVVJMIiwiaHJlZiIsImxpc3RlbiIsIm9uRXJyb3I0MDQiLCJldmVudCIsImRlc3RpbmF0aW9uIiwiaW50ZXJjZXB0IiwiY29uc29sZSIsImxvZyIsIlJlZ2lzdGVyIiwic2V0RXJyb3IiLCJHYW1lIiwiTWVudSIsIkxvYmJ5Iiwic2V0U3RhdGVzIiwic2V0UGxheWVyTmFtZSIsInNldEh1ZFBsYXllck5hbWUiLCJTb3VuZCIsInNldE1lc3NhZ2VzIiwiR2FtZUVuZ2luZSIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsInNvdW5kIiwiY3VycmVudEdhbWVFbmdpbmUiLCJpbml0IiwiYm9keSIsImNsYXNzTmFtZSIsImFsZXJ0Iiwid3MiLCJtZXNzYWdlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsInF1ZXJ5U2VsZWN0b3IiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJzZWNvbmRzTGVmdCIsInRleHQiLCJncmlkIiwic2V0VGltZW91dCIsImdhbWVDb250YWluZXIiLCJkZXN0cm95IiwibG9jYWxQbGF5ZXIiLCJwbGF5ZXJzIiwiZmluZCIsInBsYXllciIsImlkIiwieW91clBsYXllcklkIiwibmlja25hbWUiLCJlbmdpbmUiLCJlcnJvciIsInByZXYiLCJoYW5kbGVSZW1vdGVNb3ZlIiwicGF5bG9hZCIsImhhbmRsZVJlbW90ZUJvbWIiLCJoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkIiwiaGFuZGxlRXhwbG9zaW9uQ2hlY2tlZCIsImhhbmRsZVBsYXllckRhbWFnZWQiLCJoYW5kbGVHYW1lT3ZlciIsImVyciIsIm1lc3NhZ2VzIiwiQ2hhdFBsYXllcnMiLCJtZXNzYWdlc0NvbnRhaW5lciIsImNsYXNzIiwibXNncyIsImlubmVySFRNTCIsIm1zZyIsInAiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsImdldCIsInRyaW0iLCJyZXNldCIsInNlbmQiLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlBvc2l0aW9uQ29tcG9uZW50IiwiZ3giLCJneSIsInRpbGVTaXplIiwiZ3JpZFgiLCJncmlkWSIsIngiLCJ5IiwidGFyZ2V0WCIsInRhcmdldFkiLCJWZWxvY2l0eUNvbXBvbmVudCIsImJhc2VTcGVlZCIsInNwZWVkIiwic3BlZWRCb29zdCIsInNwZWVkQm9vc3RUaW1lUmVtYWluaW5nIiwiaXNNb3ZpbmciLCJkaXJlY3Rpb24iLCJJbnB1dENvbXBvbmVudCIsImlucHV0UXVldWUiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiZWwiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJ0b3RhbEZyYW1lcyIsImZwcyIsImN1cnJlbnRGcmFtZSIsInJ1bkZyYW1lcyIsImlkbGVGcmFtZXMiLCJpZGxlRnBzIiwibGFzdEZyYW1lVGltZSIsInJvdyIsInN0YXRlIiwibGFzdFN0YXRlIiwiUGxheWVyQ29tcG9uZW50IiwiY2hhclR5cGUiLCJpc0xvY2FsIiwiQm9tYkNvbXBvbmVudCIsIm93bmVySWQiLCJ0aW1lciIsInJhbmdlIiwiZXhwbG9kZWQiLCJFeHBsb3Npb25Db21wb25lbnQiLCJkdXJhdGlvbiIsIlBvd2VyVXBDb21wb25lbnQiLCJwaWNrZWRVcCIsIkJlaGF2aW9yQ29tcG9uZW50IiwiZmFzdFNob2VzTGV2ZWwiLCJib21icyIsIm1heCIsImN1cnJlbnQiLCJXb3JsZCIsInJlZ2lzdGVyU3lzdGVtcyIsImdhbWVMb29wIiwic2V0dXBJbnB1dCIsInNlbmRJbnB1dCIsImRyb3BCb21iIiwiY3JlYXRlQm9tYiIsInJlbW92ZVBvd2VyVXBBdCIsInVwZGF0ZU1hcENlbGwiLCJyZW1vdmVCb21iIiwiY3JlYXRlRXhwbG9zaW9uIiwiY3JlYXRlUG93ZXJVcCIsImFwcGx5U2VydmVyU3RhdHMiLCJ1cGRhdGVIdWRTdGF0cyIsImdldFBsYXllck5hbWUiLCJjb25zdHJ1Y3RvciIsImNhbnZhc0NvbnRhaW5lciIsIm1hcERhdGEiLCJzb2NrZXQiLCJ3b3JsZCIsImxvY2FsUGxheWVyRW50aXR5IiwicGxheWVyRW50aXRpZXMiLCJNYXAiLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibGFzdElucHV0U2VudCIsIlNQUklURV9DT0xVTU5TIiwiU1BSSVRFX1JPV1MiLCJBTklNQVRJT05fUk9XUyIsIlJVTiIsInVwIiwibGVmdCIsImRvd24iLCJyaWdodCIsIklETEUiLCJUSUxFX1NJWkUiLCJib21iSWQiLCJleGlzdHMiLCJxdWVyeSIsInNvbWUiLCJlbnRpdHkiLCJwb3MiLCJnZXRDb21wb25lbnQiLCJib21iIiwiYm9tYkVudGl0eSIsImNyZWF0ZUVudGl0eSIsImJvbWJEaXYiLCJzdHlsZSIsInBvc2l0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJ0b3AiLCJ6SW5kZXgiLCJhZGRDb21wb25lbnQiLCJib21iQ29tcCIsInBvd2VyVXBzIiwicG93ZXJVcCIsInBhcmVudE5vZGUiLCJkZXN0cm95RW50aXR5IiwidGlsZSIsImJhY2tncm91bmRJbWFnZSIsImZhbGxiYWNrQ2VsbCIsInNhbWVJZCIsInNhbWVDZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2IiwiaGFzIiwicFVwRW50aXR5IiwiZGl2Iiwic2V0Qm9tYnMiLCJzZXRMaXZlcyIsInNldFJhbmdlIiwic2V0U3BlZWQiLCJ2ZWxvY2l0eSIsIm1heEJvbWJzIiwibGl2ZXMiLCJib21iUmFuZ2UiLCJNYXRoIiwicm91bmQiLCJpbnB1dCIsImdldEtleURpcmVjdGlvbiIsImhhbmRsZUtleURvd24iLCJkaXIiLCJpbmNsdWRlcyIsImNvZGUiLCJoYW5kbGVLZXlVcCIsImQiLCJ3aW5kb3ciLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJhbGl2ZSIsIkJvb2xlYW4iLCJpbnB1dFN0YXRlIiwiY3VycmVudEJvbWJzIiwiYkVudGl0eSIsInJlbmRlclN5c3RlbSIsImxvY2FsUGxheWVySWQiLCJhbGxQbGF5ZXJzIiwibm9ybWFsaXplZExvY2FsUGxheWVySWQiLCJTdHJpbmciLCJwRGF0YSIsInBsYXllcklkIiwicGxheWVyRW50aXR5IiwicGxheWVyRGl2IiwiY29sb3IiLCJ3aWxsQ2hhbmdlIiwiYmFja2dyb3VuZFNpemUiLCJzeCIsInN5IiwicGxheWVyQ29tcCIsInNldCIsIndhcm4iLCJtYXAiLCJwZXJmb3JtYW5jZSIsIm5vdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImFkZFN5c3RlbSIsInciLCJkdCIsInVwZGF0ZSIsIm5leHROb3ciLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImN1cnJlbnRMb2NhbFBsYXllck5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZ2V0SXRlbSIsIkFycmF5IiwiZnJvbSIsImtleXMiLCJ2ZWwiLCJyZW5kZXJhYmxlIiwic3RhdHMiLCJyZW1vdmVDb21wb25lbnQiLCJ3aW5uZXJOYW1lIiwiY2VsbHMiLCJkZXN0cm95ZWRCbG9ja3MiLCJjZWxsIiwic3Bhd25lZFBvd2VyVXBzIiwiYW5pbVJvd3MiLCJlbnRpdGllcyIsInRhcmdldFJvdyIsImZyYW1lQ291bnQiLCJmcmFtZURlbGF5IiwicG9zWCIsInBvc1kiLCJiYWNrZ3JvdW5kUG9zaXRpb24iLCJ0cmFuc2Zvcm0iLCJuZXh0RW50aXR5SWQiLCJjb21wb25lbnRzIiwic3lzdGVtcyIsImRlbGV0ZSIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnRNYXAiLCJlbnRyaWVzIiwiY29tcG9uZW50RGF0YSIsImNvbXBvbmVudE5hbWVzIiwiZmlyc3RNYXAiLCJyZXN1bHRzIiwiaGFzQWxsIiwiaSIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwiR1JJRF9CT1JERVJfU0laRSIsImltYWdlcyIsInBsYXllck5hbWUiLCJuYW1lRWwiLCJsaXZlc0VsIiwic3BlZWRFbCIsImJvbWJzRWwiLCJyYW5nZUVsIiwiYm9hcmRXaWR0aCIsImJvYXJkSGVpZ2h0IiwiYm9hcmREaXNwbGF5V2lkdGgiLCJib2FyZERpc3BsYXlIZWlnaHQiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJyZXBsYXlCdG4iLCJyZWxvYWQiLCJtZW51RWwiLCJzdWJtaXR0ZWQiLCJlcnJvckVsIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImJ1dHRvbiIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwidXBkYXRlQnV0dG9uIiwicGxheSIsInRoZW4iLCJjYXRjaCIsInBhdXNlZCIsIm11dGVkIiwiaXNNdXRlZCIsImNsYXNzTGlzdCJdLCJzb3VyY2VSb290IjoiIn0=