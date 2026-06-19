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
const wss = new WebSocket(`ws://${window.location.hostname}:5000`);
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
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_7__.setMessages)(prev => [...prev, message.message]);
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
/* harmony import */ var _systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./systems/powerUpSystem.js */ "./src/ecs/systems/powerUpSystem.js");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pages/game */ "./src/pages/game.jsx");








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
    this.lastTime = 0;
    this.removeInputListeners = null;
    this.animationFrame = null;
    this.running = false;
    this.claimedPowerUps = new Set();
  }
  init(localPlayerId, allPlayers) {
    this.totalPlayers = allPlayers.length;
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
      (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_6__.spawnPowerUp)(this.world, x, y, this.container, TILE_SIZE);
    };
    const onPlayerHurt = (entity, id, remainingLives) => {
      if (entity === this.localPlayerEntity) {
        (0,_pages_game__WEBPACK_IMPORTED_MODULE_7__.setLives)(remainingLives);
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
    this.world.addSystem((w, dt, now) => (0,_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_5__.damageSystem)(w, now, onPlayerHurt, TILE_SIZE));
    this.world.addSystem((w, dt, now) => (0,_systems_powerUpSystem_js__WEBPACK_IMPORTED_MODULE_6__.powerUpSystem)(w, onPowerUpPicked));
    this.world.addSystem((w, dt, now) => (0,_systems_renderSystem_js__WEBPACK_IMPORTED_MODULE_3__.renderSystem)(w, dt, now, ANIMATION_ROWS));
  }
  gameLoop(now) {
    if (!this.running) return;
    const dt = now - this.lastTime;
    this.lastTime = now;
    this.world.update(dt, now);

    // Check for extra life collision with players (with WebSocket sync)
    (0,_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_5__.checkExtraLifeCollision)(this.world, TILE_SIZE, this.socket);

    // Check for game end conditions (win/loss)
    (0,_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_5__.checkGameEndConditions)(this.world, this.localPlayerEntity, this.playerEntities, this.totalPlayers);
    this.animationFrame = requestAnimationFrame(nextNow => this.gameLoop(nextNow));
  }
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
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_7__.setBombs)(player.maxBombs || 1);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_7__.setLives)(player.lives ?? 3);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_7__.setRange)(player.bombRange || 4);
    (0,_pages_game__WEBPACK_IMPORTED_MODULE_7__.setSpeed)(Math.round(velocity.speed));
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
/* harmony export */   checkExtraLifeCollision: () => (/* binding */ checkExtraLifeCollision),
/* harmony export */   checkGameEndConditions: () => (/* binding */ checkGameEndConditions),
/* harmony export */   damageSystem: () => (/* binding */ damageSystem)
/* harmony export */ });
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game.js */ "./src/ecs/game.js");


/**
 * Creates a Loss pop-up modal for the eliminated player.
 * Blocks their screen immediately so they cannot spectate.
 * @param {string} playerName - The name of the eliminated player
 */
function showLossPopup(playerName) {
  // Check if popup already exists to avoid duplicates
  if (document.querySelector('.game-result-popup')) return;

  // Create overlay with extremely high z-index to block entire screen
  const overlay = document.createElement('div');
  overlay.className = 'game-result-popup loss';
  overlay.style.zIndex = '99999';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  // Create popup content
  const popup = document.createElement('div');
  popup.className = 'game-result-popup-content';
  const titleEl = document.createElement('h1');
  titleEl.textContent = 'You are terrible at this! Wach la3b b rjlik?';
  titleEl.className = 'game-result-title';
  titleEl.style.color = '#ff4444';
  titleEl.style.fontSize = '36px';
  titleEl.style.marginBottom = '30px';
  const button = document.createElement('button');
  button.textContent = 'Restart';
  button.className = 'game-result-button';
  button.style.padding = '15px 40px';
  button.style.fontSize = '20px';
  button.style.cursor = 'pointer';
  button.addEventListener('click', () => {
    // Force hard reset - send to initial page
    window.location.href = '/';
  });
  popup.appendChild(titleEl);
  popup.appendChild(button);
  overlay.appendChild(popup);

  // Append to document.body to block the entire screen immediately
  document.body.appendChild(overlay);
}

/**
 * Creates a Win pop-up modal for the victorious player.
 * @param {string} playerName - The name of the winning player
 */
function showWinPopup(playerName) {
  // Check if popup already exists to avoid duplicates
  if (document.querySelector('.game-result-popup')) return;

  // Create overlay with extremely high z-index
  const overlay = document.createElement('div');
  overlay.className = 'game-result-popup win';
  overlay.style.zIndex = '99999';

  // Create popup content
  const popup = document.createElement('div');
  popup.className = 'game-result-popup-content';
  const titleEl = document.createElement('h1');
  titleEl.textContent = `${playerName.toUpperCase()} WON!`;
  titleEl.className = 'game-result-title';
  const button = document.createElement('button');
  button.textContent = 'Return to Home';
  button.className = 'game-result-button';
  button.addEventListener('click', () => {
    // MUST remove modal from DOM first to prevent "ghost modal" bug
    overlay.remove();
    // Force hard redirect to ensure clean slate and destroy any leftover DOM elements
    window.location.href = '/';
  });
  popup.appendChild(titleEl);
  popup.appendChild(button);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

/**
 * Handles player death transition when lives reach 0.
 * Removes the player's DOM element and spawns an extra-life drop at the death location.
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

  // 1. Remove the player's DOM element entirely
  if (renderable.el && renderable.el.parentNode) {
    renderable.el.parentNode.removeChild(renderable.el);
  }

  // 2. Destroy the player entity from the world (removes all components)
  world.destroyEntity(playerEntity);

  // 3. Create a div with heart emoji at the exact death location
  const heartDiv = document.createElement('div');
  heartDiv.className = 'extra-life-drop';
  heartDiv.textContent = '❤️';
  heartDiv.style.position = 'absolute';
  heartDiv.style.left = `${deathGridX * tileSize}px`;
  heartDiv.style.top = `${deathGridY * tileSize}px`;
  heartDiv.style.width = `${tileSize}px`;
  heartDiv.style.height = `${tileSize}px`;
  heartDiv.style.display = 'flex';
  heartDiv.style.alignItems = 'center';
  heartDiv.style.justifyContent = 'center';
  heartDiv.style.fontSize = '32px';
  heartDiv.style.zIndex = '5';
  heartDiv.style.pointerEvents = 'none';

  // Append to the game container
  const gameContainer = container || document.getElementById('game-container');
  if (gameContainer) {
    gameContainer.appendChild(heartDiv);
  }
  console.log(`[Player Death] Player ${player.id} died at (${deathGridX}, ${deathGridY}). Heart dropped.`);
}

/**
 * Checks for collision between players and extra-life-drop DOM elements.
 * When a player collides with an extra-life-drop, they gain +1 life and the drop is removed.
 * Only the first player to touch it gets the life.
 * 
 * @param {World} world - The game world instance
 * @param {number} tileSize - The size of each grid tile (default: 64)
 * @param {WebSocket} socket - WebSocket connection for real-time sync
 */
function checkExtraLifeCollision(world, tileSize = 64, socket = null) {
  // Find all extra-life-drop elements in the DOM
  const extraLifeDrops = document.querySelectorAll('.extra-life-drop');
  if (extraLifeDrops.length === 0) return;

  // Get all active players with Position and Player components
  const players = world.query('Position', 'Player');
  if (players.length === 0) return;
  for (const drop of extraLifeDrops) {
    // Parse the grid position from the drop's CSS left/top properties
    const dropLeft = parseInt(drop.style.left, 10);
    const dropTop = parseInt(drop.style.top, 10);
    if (isNaN(dropLeft) || isNaN(dropTop)) continue;
    const dropGridX = Math.round(dropLeft / tileSize);
    const dropGridY = Math.round(dropTop / tileSize);
    for (const playerEntity of players) {
      const pPos = world.getComponent(playerEntity, 'Position');
      const player = world.getComponent(playerEntity, 'Player');
      if (!pPos || !player) continue;

      // Calculate player's current grid position
      const playerGridX = Math.floor((pPos.x + tileSize / 2) / tileSize);
      const playerGridY = Math.floor((pPos.y + tileSize / 2) / tileSize);

      // Check for collision (same grid cell)
      if (playerGridX === dropGridX && playerGridY === dropGridY) {
        // Get current lives value, default to 0 if undefined
        const currentLives = player.lives || 0;

        // Increase player's lives by +1 (direct property assignment)
        player.lives = currentLives + 1;

        // Remove the extra-life-drop from DOM immediately to prevent multiple triggers
        if (drop.parentNode) {
          drop.parentNode.removeChild(drop);
        }

        // Real-Time Synchronization: Send ITEM_PICKUP event to server
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'ITEM_PICKUP',
            item: 'HEART',
            playerId: player.id,
            newLives: player.lives
          }));
        }
        console.log(`[Extra Life] Player ${player.id} picked up heart! New lives: ${player.lives}`);

        // Break out of the inner loop since this drop is now gone
        break;
      }
    }
  }
}

/**
 * Checks for player deaths and game end conditions.
 * Shows Loss pop-up for eliminated players and Win pop-up for the last survivor.
 * 
 * @param {World} world - The game world instance
 * @param {number} localPlayerEntity - The local player's entity ID
 * @param {Map} playerEntities - Map of player IDs to entity IDs
 * @param {number} totalPlayers - Total number of players at game start
 */
function checkGameEndConditions(world, localPlayerEntity, playerEntities, totalPlayers) {
  // Count active players (players with lives > 0)
  const allPlayers = world.query('Position', 'Player');
  let activePlayerCount = 0;
  let lastActivePlayerEntity = null;
  for (const playerEntity of allPlayers) {
    const player = world.getComponent(playerEntity, 'Player');
    if (player && (player.lives ?? 0) > 0) {
      activePlayerCount++;
      lastActivePlayerEntity = playerEntity;
    }
  }

  // Get the local player's name for display in popups
  const localPlayerName = (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.getPlayerName)();

  // Check if local player is eliminated
  if (localPlayerEntity !== null) {
    const localPlayer = world.getComponent(localPlayerEntity, 'Player');
    if (localPlayer && (localPlayer.lives ?? 0) <= 0) {
      // Check if already showed loss popup
      if (!document.querySelector('.game-result-popup')) {
        showLossPopup(localPlayerName);
      }
    }
  }

  // Check win condition: EXACTLY 1 active player remains on the board
  if (activePlayerCount === 1 && totalPlayers > 1 && lastActivePlayerEntity !== null) {
    const lastPlayer = world.getComponent(lastActivePlayerEntity, 'Player');
    if (lastPlayer) {
      // Check if this is the local player
      if (localPlayerEntity !== null && lastActivePlayerEntity === localPlayerEntity) {
        if (!document.querySelector('.game-result-popup')) {
          showWinPopup(localPlayerName);
        }
      }
    }
  }
}
function damageSystem(world, now, onPlayerHurt, tileSize = 64) {
  const players = world.query('Position', 'Player');
  const explosions = world.query('Position', 'Explosion');
  for (const playerEntity of players) {
    const pPos = world.getComponent(playerEntity, 'Position');
    const player = world.getComponent(playerEntity, 'Player');
    if (player.invincibleUntil && player.invincibleUntil > now) continue;
    for (const expEntity of explosions) {
      const ePos = world.getComponent(expEntity, 'Position');

      //(Grid-based collision)
      const playerGridX = Math.floor((pPos.x + tileSize / 2) / tileSize);
      const playerGridY = Math.floor((pPos.y + tileSize / 2) / tileSize);
      if (playerGridX === ePos.gridX && playerGridY === ePos.gridY) {
        const previousLives = player.lives ?? 3;
        player.lives = Math.max(previousLives - 1, 0);
        player.invincibleUntil = now + 1500;

        // Handle death when lives reach 0
        if (player.lives <= 0) {
          handlePlayerDeath(world, playerEntity, tileSize);
        }
        if (onPlayerHurt) {
          onPlayerHurt(playerEntity, player.id, player.lives);
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q25EcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvZG9tLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NoYXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9lY3MvY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3dvcmxkLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyIGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBNZW51IGZyb20gXCIuLi9wYWdlcy9tZW51XCI7XG5pbXBvcnQgTG9iYnkgZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRTdGF0ZXMgfSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgYXMgc2V0SHVkUGxheWVyTmFtZSB9IGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuaW1wb3J0IHsgR2FtZUVuZ2luZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiOyBcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoYHdzOi8vJHt3aW5kb3cubG9jYXRpb24uaG9zdG5hbWV9OjUwMDBgKTtcbmNvbnN0IHNvdW5kID0gbmV3IFNvdW5kKFwiLi9hc3NldHMvc291bmRzL2JhY2tncm91bmRfbXVzaWMubXAzXCIpO1xubGV0IGN1cnJlbnRHYW1lRW5naW5lID0gbnVsbDtcblxuc291bmQuaW5pdCgpO1xuXG5yb3V0ZXIub24oXCIvXCIsICgpID0+IHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwicmVnaXN0ZXItcGFnZVwiO1xuICAgIHJlbmRlcig8UmVnaXN0ZXIgd3NzPXt3c3N9IC8+LCByb290KTtcbn0pO1xuXG5yb3V0ZXIubGlzdGVuKCgpID0+IHsgYWxlcnQoXCI0MDRcIikgfSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCAod3MpID0+IHtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInJvb21fdXBkYXRlXCI6XG4gICAgICAgIGNhc2UgXCJsb2JieV90aW1lclwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImxvYmJ5LXBhZ2VcIjtcbiAgICAgICAgICAgIGlmICghcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmNvbmF0aW5lci1sb2JieVwiKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcig8TG9iYnkgLz4sIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogbWVzc2FnZS5wbGF5ZXJzQ291bnQsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IG1lc3NhZ2Uuc2Vjb25kc0xlZnQsXG4gICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZ2FtZV9zdGFydGVkXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwiZ2FtZS1wYWdlXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlbmRlcig8R2FtZSBncmlkPXttZXNzYWdlLmdyaWR9IC8+LCByb290KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGdhbWVDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFBsYXllciA9IChtZXNzYWdlLnBsYXllcnMgfHwgW10pLmZpbmQocGxheWVyID0+IHBsYXllci5pZCA9PT0gbWVzc2FnZS55b3VyUGxheWVySWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxQbGF5ZXIgJiYgbG9jYWxQbGF5ZXIubmlja25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEh1ZFBsYXllck5hbWUobG9jYWxQbGF5ZXIubmlja25hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5naW5lID0gbmV3IEdhbWVFbmdpbmUoZ2FtZUNvbnRhaW5lciwgbWVzc2FnZS5ncmlkLCB3c3MpO1xuICAgICAgICAgICAgICAgICAgICBlbmdpbmUuaW5pdChtZXNzYWdlLnlvdXJQbGF5ZXJJZCwgbWVzc2FnZS5wbGF5ZXJzIHx8IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lID0gZW5naW5lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJHYW1lIGNvbnRhaW5lciB3YXMgbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJyb29tX2Fsb25lXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibWVudS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPE1lbnUgLz4sIHJvb3QpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgY2FzZSBcImNoYXRfbWVzc2FnZVwiOlxuICAgICAgICAgICAgc2V0TWVzc2FnZXMocHJldiA9PiBbLi4ucHJldiAsbWVzc2FnZS5tZXNzYWdlXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBsYXllcl9tb3ZlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlTW92ZShtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib21iX2Ryb3BwZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZUJvbWIobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicG93ZXJ1cF9waWNrZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaXRlbV9waWNrZWRcIjpcbiAgICAgICAgICAgIC8vIEhhbmRsZSByZW1vdGUgaGVhcnQgcGlja3VwIC0gdXBkYXRlIHRoZSBwbGF5ZXIncyBsaXZlcyBvbiBhbGwgY2xpZW50c1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlSXRlbVBpY2t1cChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3JcIiwgZXJyKTtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NlZFwiKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB3c3M7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IHdzcyBmcm9tIFwiLi4vYXBwL2FwcFwiO1xuXG5jb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IGNyZWF0ZVNpZ25hbChbXSk7XG5leHBvcnQgeyBzZXRNZXNzYWdlcyB9O1xuXG5mdW5jdGlvbiBDaGF0UGxheWVycygpIHtcbiAgICBjb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IDxkaXYgY2xhc3M9XCJtZXNzYWdlc1wiPjwvZGl2PjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZ3MgPSBtZXNzYWdlcygpO1xuICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGZvciAobGV0IG1zZyBvZiBtc2dzKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBwLnRleHRDb250ZW50ID0gbXNnO1xuICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXNDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5yZW1vdmVDaGlsZChtZXNzYWdlc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgbXNncy51bnNoaWZ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZm9ybURhdGEuZ2V0KFwibWVzc2FnZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJjaGF0X21lc3NhZ2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH0pKTtcbiAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdFwiIG9uU3VibWl0PXticm9hZGNhc3RNZXNzYWdlfT5cbiAgICAgICAgICAgIHttZXNzYWdlc0NvbnRhaW5lcn1cbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJ0eXBlIHRvIHRoZSBvdGhlciBwbGF5ZXJzIC4uLlwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVyczsiLCIvLyAvc3JjL2Vjcy9jb21wb25lbnRzLmpzXG5cbmV4cG9ydCBjb25zdCBQb3NpdGlvbkNvbXBvbmVudCA9IChneCwgZ3ksIHRpbGVTaXplID0gNjQpID0+ICh7XG4gICAgZ3JpZFg6IGd4LFxuICAgIGdyaWRZOiBneSxcbiAgICB4OiBneCAqIHRpbGVTaXplLFxuICAgIHk6IGd5ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRZOiBneSAqIHRpbGVTaXplXG59KTtcblxuZXhwb3J0IGNvbnN0IFZlbG9jaXR5Q29tcG9uZW50ID0gKGJhc2VTcGVlZCA9IDIuNSkgPT4gKHtcbiAgICBiYXNlU3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBzcGVlZDogYmFzZVNwZWVkLFxuICAgIGlzTW92aW5nOiBmYWxzZSxcbiAgICBkaXJlY3Rpb246ICdkb3duJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBJbnB1dENvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgaW5wdXRRdWV1ZTogW11cbn0pO1xuXG5leHBvcnQgY29uc3QgUmVuZGVyYWJsZUNvbXBvbmVudCA9IChlbCwgZnJhbWVXaWR0aCA9IDY0LCBmcmFtZUhlaWdodCA9IDY0LCB0b3RhbEZyYW1lcyA9IDQsIGZwcyA9IDEyKSA9PiAoe1xuICAgIGVsOiBlbCxcbiAgICBmcmFtZVdpZHRoOiBmcmFtZVdpZHRoLFxuICAgIGZyYW1lSGVpZ2h0OiBmcmFtZUhlaWdodCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IHRvdGFsRnJhbWVzLFxuICAgIHJ1bkZyYW1lczogNCxcbiAgICBpZGxlRnJhbWVzOiAyLFxuICAgIGZwczogZnBzLFxuICAgIGlkbGVGcHM6IDQsXG4gICAgbGFzdEZyYW1lVGltZTogMCxcbiAgICByb3c6IDAsXG4gICAgc3RhdGU6ICdJRExFJyxcbiAgICBsYXN0U3RhdGU6ICdJRExFJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXJDb21wb25lbnQgPSAoaWQsIGNoYXJUeXBlLCBpc0xvY2FsID0gZmFsc2UpID0+ICh7XG4gICAgaWQ6IGlkLFxuICAgIGNoYXJUeXBlOiBjaGFyVHlwZSxcbiAgICBpc0xvY2FsOiBpc0xvY2FsXG59KTtcblxuZXhwb3J0IGNvbnN0IEJvbWJDb21wb25lbnQgPSAob3duZXJJZCwgdGltZXIgPSAyMDAwLCByYW5nZSA9IDQpID0+ICh7XG4gICAgb3duZXJJZDogb3duZXJJZCxcbiAgICB0aW1lcjogdGltZXIsXG4gICAgcmFuZ2U6IHJhbmdlLFxuICAgIGV4cGxvZGVkOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBFeHBsb3Npb25Db21wb25lbnQgPSAoZHVyYXRpb24gPSA1MDApID0+ICh7XG4gICAgZHVyYXRpb246IGR1cmF0aW9uXG59KTtcblxuZXhwb3J0IGNvbnN0IFBvd2VyVXBDb21wb25lbnQgPSAodHlwZSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlLCBcbiAgICBwaWNrZWRVcDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgQmVoYXZpb3JDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGdob3N0TW9kZTogZmFsc2UsXG4gICAgdGhyb3dhYmxlOiBmYWxzZSxcbiAgICBkZXRvbmF0b3I6IGZhbHNlLFxuICAgIGZhc3RTaG9lc0xldmVsOiAxLFxuICAgIGJvbWJzOiB7XG4gICAgICAgIG1heDogMSxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgcmFuZ2U6IDJcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC5qcyc7XG5pbXBvcnQge1xuICAgIFBvc2l0aW9uQ29tcG9uZW50LFxuICAgIFZlbG9jaXR5Q29tcG9uZW50LFxuICAgIElucHV0Q29tcG9uZW50LFxuICAgIFJlbmRlcmFibGVDb21wb25lbnQsXG4gICAgUGxheWVyQ29tcG9uZW50LFxuICAgIEJvbWJDb21wb25lbnRcbn0gZnJvbSAnLi9jb21wb25lbnRzLmpzJztcblxuaW1wb3J0IHsgbW92ZW1lbnRTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyc7XG5pbXBvcnQgeyBib21iU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgZGFtYWdlU3lzdGVtLCBjaGVja0V4dHJhTGlmZUNvbGxpc2lvbiwgY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyB9IGZyb20gJy4vc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcG93ZXJVcFN5c3RlbSwgc3Bhd25Qb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMnO1xuaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQgfSBmcm9tICcuLi9wYWdlcy9nYW1lJztcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzQ29udGFpbmVyLCBtYXBEYXRhLCBzb2NrZXQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjYW52YXNDb250YWluZXI7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IG1hcERhdGE7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XG4gICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gMDtcbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgaW5pdChsb2NhbFBsYXllcklkLCBhbGxQbGF5ZXJzKSB7XG4gICAgICAgIHRoaXMudG90YWxQbGF5ZXJzID0gYWxsUGxheWVycy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkID0gU3RyaW5nKGxvY2FsUGxheWVySWQpO1xuXG4gICAgICAgIGFsbFBsYXllcnMuZm9yRWFjaChwRGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IFN0cmluZyhwRGF0YS5pZCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IHBEYXRhLmNvbG9yIHx8IFwid2hpdGVcIjtcblxuICAgICAgICAgICAgcGxheWVyRGl2LmNsYXNzTmFtZSA9IGBwbGF5ZXIgcGxheWVyLSR7Y29sb3J9YDtcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuekluZGV4ID0gJzEwJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS53aWxsQ2hhbmdlID0gJ3RyYW5zZm9ybSc7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJEaXYpO1xuXG4gICAgICAgICAgICBjb25zdCBzeCA9IHBEYXRhLnggfHwgMTtcbiAgICAgICAgICAgIGNvbnN0IHN5ID0gcERhdGEueSB8fCAxO1xuXG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicsIFBvc2l0aW9uQ29tcG9uZW50KHN4LCBzeSwgVElMRV9TSVpFKSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScsIFZlbG9jaXR5Q29tcG9uZW50KDIuNSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScsIFJlbmRlcmFibGVDb21wb25lbnQocGxheWVyRGl2LCA2NCwgNjQsIDQsIDEyKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaXNMb2NhbCA9IHBsYXllcklkID09PSBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZDtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckNvbXAgPSBQbGF5ZXJDb21wb25lbnQocGxheWVySWQsIGNvbG9yLCBpc0xvY2FsKTtcbiAgICAgICAgICAgIHBsYXllckNvbXAubGl2ZXMgPSAzO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5tYXhCb21icyA9IDE7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmJvbWJSYW5nZSA9IDQ7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInLCBwbGF5ZXJDb21wKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMuc2V0KHBsYXllcklkLCBwbGF5ZXJFbnRpdHkpO1xuXG4gICAgICAgICAgICBpZiAoaXNMb2NhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBwbGF5ZXJFbnRpdHk7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnLCBJbnB1dENvbXBvbmVudCgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHBsYXllckVudGl0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbR2FtZUVuZ2luZV0gTG9jYWwgcGxheWVyIHdhcyBub3QgZm91bmRcIiwge1xuICAgICAgICAgICAgICAgIGxvY2FsUGxheWVySWQsXG4gICAgICAgICAgICAgICAgcGxheWVyczogYWxsUGxheWVycy5tYXAocGxheWVyID0+IHBsYXllci5pZCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTeXN0ZW1zKCk7XG5cbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChub3cpID0+IHRoaXMuZ2FtZUxvb3Aobm93KSk7XG4gICAgfVxuXG4gICAgc2V0dXBJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgaWYgKCFpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGdldEtleURpcmVjdGlvbiA9IChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1VwJyB8fCBrZXkgPT09ICd3JyB8fCBrZXkgPT09ICdaJyB8fCBrZXkgPT09ICd6JykgcmV0dXJuICd1cCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dEb3duJyB8fCBrZXkgPT09ICdzJyB8fCBrZXkgPT09ICdTJykgcmV0dXJuICdkb3duJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0xlZnQnIHx8IGtleSA9PT0gJ2EnIHx8IGtleSA9PT0gJ1EnIHx8IGtleSA9PT0gJ3EnKSByZXR1cm4gJ2xlZnQnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93UmlnaHQnIHx8IGtleSA9PT0gJ2QnIHx8IGtleSA9PT0gJ0QnKSByZXR1cm4gJ3JpZ2h0JztcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5pbnB1dFF1ZXVlLmluY2x1ZGVzKGRpcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZS51bnNoaWZ0KGRpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICcgJyB8fCBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wQm9tYigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleVVwID0gKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZSA9IGlucHV0LmlucHV0UXVldWUuZmlsdGVyKGQgPT4gZCAhPT0gZGlyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZHJvcEJvbWIoKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcblxuICAgICAgICBjb25zdCBjdXJyZW50Qm9tYnMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuZmlsdGVyKGJFbnRpdHkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGJFbnRpdHksICdCb21iJykub3duZXJJZCA9PT0gcGxheWVyLmlkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY3VycmVudEJvbWJzLmxlbmd0aCA+PSBwbGF5ZXIubWF4Qm9tYnMpIHJldHVybjtcblxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVCb21iKHBsYXllci5pZCwgcG9zLmdyaWRYLCBwb3MuZ3JpZFksIHBsYXllci5ib21iUmFuZ2UpO1xuICAgICAgICBpZiAoIWNyZWF0ZWQpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdEUk9QX0JPTUInLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHsgaWQ6IHBsYXllci5pZCwgeDogcG9zLmdyaWRYLCB5OiBwb3MuZ3JpZFksIHJhbmdlOiBwbGF5ZXIuYm9tYlJhbmdlIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUJvbWIob3duZXJJZCwgZ3JpZFgsIGdyaWRZLCByYW5nZSkge1xuICAgICAgICBjb25zdCBleGlzdHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuc29tZShlbnRpdHkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IGJvbWIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCb21iJyk7XG4gICAgICAgICAgICByZXR1cm4gYm9tYi5vd25lcklkID09PSBvd25lcklkICYmIHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGV4aXN0cykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGJvbWJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICBjb25zdCBib21iRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGJvbWJEaXYuY2xhc3NOYW1lID0gJ2JvbWInO1xuICAgICAgICBib21iRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnRvcCA9IGAke2dyaWRZICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS56SW5kZXggPSAnNic7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGJvbWJEaXYpO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFgsIGdyaWRZIH0pO1xuXG4gICAgICAgIGNvbnN0IGJvbWJDb21wID0gQm9tYkNvbXBvbmVudChvd25lcklkLCAyMDAwLCByYW5nZSk7XG4gICAgICAgIGJvbWJDb21wLmVsID0gYm9tYkRpdjtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInLCBib21iQ29tcCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZU1vdmUocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltoYW5kbGVSZW1vdGVNb3ZlXSBJbnZhbGlkIHBheWxvYWQ6XCIsIHBheWxvYWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gRW50aXR5IG5vdCBmb3VuZCBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH0uIEF2YWlsYWJsZSBwbGF5ZXJzOmAsIEFycmF5LmZyb20odGhpcy5wbGF5ZXJFbnRpdGllcy5rZXlzKCkpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gSWdub3JpbmcgbG9jYWwgcGxheWVyIHVwZGF0ZSBmb3IgJHtwYXlsb2FkLmlkfWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghcG9zIHx8ICF2ZWwgfHwgIXJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIE1pc3NpbmcgY29tcG9uZW50cyBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH06YCwgeyBwb3M6ICEhcG9zLCB2ZWw6ICEhdmVsLCByZW5kZXJhYmxlOiAhIXJlbmRlcmFibGUgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW2hhbmRsZVJlbW90ZU1vdmVdIFVwZGF0aW5nIHBsYXllciAke3BheWxvYWQuaWR9IHRvICgke3BheWxvYWQuZ3JpZFh9LCAke3BheWxvYWQuZ3JpZFl9KWApO1xuICAgICAgICB2ZWwuZGlyZWN0aW9uID0gcGF5bG9hZC5kaXJlY3Rpb24gfHwgdmVsLmRpcmVjdGlvbjtcbiAgICAgICAgdmVsLmlzTW92aW5nID0gcGF5bG9hZC5pc01vdmluZztcbiAgICAgICAgcG9zLmdyaWRYID0gcGF5bG9hZC5ncmlkWDtcbiAgICAgICAgcG9zLmdyaWRZID0gcGF5bG9hZC5ncmlkWTtcbiAgICAgICAgcG9zLnRhcmdldFggPSBwYXlsb2FkLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcGF5bG9hZC55O1xuICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gcGF5bG9hZC5zdGF0ZSB8fCAocGF5bG9hZC5pc01vdmluZyA/ICdSVU4nIDogJ0lETEUnKTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVCb21iKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3JlYXRlQm9tYihwYXlsb2FkLmlkLCBwYXlsb2FkLngsIHBheWxvYWQueSwgcGF5bG9hZC5yYW5nZSB8fCA0KTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8IHBheWxvYWQueCA9PT0gdW5kZWZpbmVkIHx8IHBheWxvYWQueSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCB8fCBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHJldHVybjtcblxuICAgICAgICB0aGlzLmFwcGx5UG93ZXJVcChlbnRpdHksIHBheWxvYWQudHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyByZW1vdGUgaGVhcnQgcGlja3VwIC0gdXBkYXRlcyBwbGF5ZXIgbGl2ZXMgYW5kIFVJIG9uIGFsbCBjbGllbnRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWQgLSB7IHBsYXllcklkLCBuZXdMaXZlcyB9XG4gICAgICovXG4gICAgaGFuZGxlUmVtb3RlSXRlbVBpY2t1cChwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5wbGF5ZXJJZCB8fCBwYXlsb2FkLm5ld0xpdmVzID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLnBsYXllckVudGl0aWVzLmdldChTdHJpbmcocGF5bG9hZC5wbGF5ZXJJZCkpO1xuICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIpIHJldHVybjtcblxuICAgICAgICAvLyBVcGRhdGUgdGhlIHBsYXllcidzIGxpdmVzXG4gICAgICAgIHBsYXllci5saXZlcyA9IHBheWxvYWQubmV3TGl2ZXM7XG5cbiAgICAgICAgLy8gVXBkYXRlIEhVRCBpZiB0aGlzIGlzIHRoZSBsb2NhbCBwbGF5ZXJcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVIdWRTdGF0cyhlbnRpdHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coYFtSZW1vdGUgSXRlbSBQaWNrdXBdIFBsYXllciAke3BheWxvYWQucGxheWVySWR9IHBpY2tlZCB1cCBoZWFydC4gTmV3IGxpdmVzOiAke3BheWxvYWQubmV3TGl2ZXN9YCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlUG93ZXJVcEF0KGdyaWRYLCBncmlkWSkge1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7Z3JpZFh9LCR7Z3JpZFl9YCk7XG4gICAgICAgIGNvbnN0IHBvd2VyVXBzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcG93ZXJVcCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghcG9zIHx8ICFwb3dlclVwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWSkge1xuICAgICAgICAgICAgICAgIHBvd2VyVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBvd2VyVXAuZWwgJiYgcG93ZXJVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvd2VyVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3dlclVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmRlc3Ryb3lFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseVBvd2VyVXAoZW50aXR5LCB0eXBlKSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICB2ZWxvY2l0eS5zcGVlZCA9IE1hdGgubWluKHZlbG9jaXR5LnNwZWVkICsgMSwgOCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0ZMQU1FJykge1xuICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWdpc3RlclN5c3RlbXMoKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZU1hcENlbGwgPSAoeCwgeSwgbmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXBEYXRhW3ldKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubWFwRGF0YVt5XVt4XSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWApO1xuICAgICAgICAgICAgaWYgKCF0aWxlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRpbGUuY2xhc3NOYW1lID0gJ3RpbGUgdGlsZS1mbG9vcic7XG4gICAgICAgICAgICB0aWxlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIpJztcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkZXN0cm95Qm94Q2FsbGJhY2sgPSAoeCwgeSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xhaW1lZFBvd2VyVXBzLmhhcyhgJHt4fSwke3l9YCkpIHJldHVybjtcbiAgICAgICAgICAgIHNwYXduUG93ZXJVcCh0aGlzLndvcmxkLCB4LCB5LCB0aGlzLmNvbnRhaW5lciwgVElMRV9TSVpFKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBsYXllckh1cnQgPSAoZW50aXR5LCBpZCwgcmVtYWluaW5nTGl2ZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICBzZXRMaXZlcyhyZW1haW5pbmdMaXZlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25Qb3dlclVwUGlja2VkID0gKGlkLCB0eXBlLCB4LCB5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7eH0sJHt5fWApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAocGxheWVyICYmIHBsYXllci5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPV0VSVVBfUElDS0VEJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZCwgdHlwZSwgeCwgeSB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYnJvYWRjYXN0TW92ZW1lbnQgPSAoZW50aXR5LCB4LCB5LCBncmlkWCwgZ3JpZFksIGRpcmVjdGlvbiwgaXNNb3ZpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXRoaXMuc29ja2V0IHx8IHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdNT1ZFX1NUQVRFJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBwbGF5ZXIuaWQsXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBncmlkWSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICBpc01vdmluZyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IGlzTW92aW5nID8gJ1JVTicgOiAnSURMRScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBtb3ZlbWVudFN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gYm9tYlN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBkYW1hZ2VTeXN0ZW0odywgbm93LCBvblBsYXllckh1cnQsIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcG93ZXJVcFN5c3RlbSh3LCBvblBvd2VyVXBQaWNrZWQpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHJlbmRlclN5c3RlbSh3LCBkdCwgbm93LCBBTklNQVRJT05fUk9XUykpO1xuICAgIH1cblxuICAgIGdhbWVMb29wKG5vdykge1xuICAgICAgICBpZiAoIXRoaXMucnVubmluZykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGR0ID0gbm93IC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IG5vdztcbiAgICAgICAgdGhpcy53b3JsZC51cGRhdGUoZHQsIG5vdyk7XG4gICAgICAgIFxuICAgICAgICAvLyBDaGVjayBmb3IgZXh0cmEgbGlmZSBjb2xsaXNpb24gd2l0aCBwbGF5ZXJzICh3aXRoIFdlYlNvY2tldCBzeW5jKVxuICAgICAgICBjaGVja0V4dHJhTGlmZUNvbGxpc2lvbih0aGlzLndvcmxkLCBUSUxFX1NJWkUsIHRoaXMuc29ja2V0KTtcbiAgICAgICAgXG4gICAgICAgIC8vIENoZWNrIGZvciBnYW1lIGVuZCBjb25kaXRpb25zICh3aW4vbG9zcylcbiAgICAgICAgY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyh0aGlzLndvcmxkLCB0aGlzLmxvY2FsUGxheWVyRW50aXR5LCB0aGlzLnBsYXllckVudGl0aWVzLCB0aGlzLnRvdGFsUGxheWVycyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChuZXh0Tm93KSA9PiB0aGlzLmdhbWVMb29wKG5leHROb3cpKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlSHVkU3RhdHMoZW50aXR5KSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIHNldEJvbWJzKHBsYXllci5tYXhCb21icyB8fCAxKTtcbiAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzID8/IDMpO1xuICAgICAgICBzZXRSYW5nZShwbGF5ZXIuYm9tYlJhbmdlIHx8IDQpO1xuICAgICAgICBzZXRTcGVlZChNYXRoLnJvdW5kKHZlbG9jaXR5LnNwZWVkKSk7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IFwiXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKG5hbWUpIHtcbiAgICBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gbmFtZTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiLCBuYW1lKTtcbiAgICBjb25zb2xlLmxvZyhcIlBsYXllciByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVwiLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXllck5hbWUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgfHwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIikgfHwgXCJQbGF5ZXJcIjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBib21iU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB1cGRhdGVNYXBDZWxsLCBkZXN0cm95Qm94Q2FsbGJhY2ssIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBib21icyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBib21iRW50aXR5IG9mIGJvbWJzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgYm9tYiA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicpO1xuICAgICAgICBcbiAgICAgICAgYm9tYi50aW1lciAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChib21iLnRpbWVyIDw9IDAgJiYgIWJvbWIuZXhwbG9kZWQpIHtcbiAgICAgICAgICAgIGJvbWIuZXhwbG9kZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBhZmZlY3RlZENlbGxzID0gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMocG9zLmdyaWRYLCBwb3MuZ3JpZFksIGJvbWIucmFuZ2UsIG1hcERhdGEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhZmZlY3RlZENlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgZXhwRGl2LmNsYXNzTmFtZSA9ICdleHBsb3Npb24nO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmxlZnQgPSBgJHtjZWxsLnggKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnRvcCA9IGAke2NlbGwueSAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuekluZGV4ID0gJzcnO1xuXG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFg6IGNlbGwueCwgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZOiBjZWxsLnksIFxuICAgICAgICAgICAgICAgICAgICB4OiBjZWxsLnggKiB0aWxlU2l6ZSwgXG4gICAgICAgICAgICAgICAgICAgIHk6IGNlbGwueSAqIHRpbGVTaXplIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nLCB7IGR1cmF0aW9uOiA1MDAsIGVsOiBleHBEaXYgfSk7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGV4cERpdik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG1hcERhdGFbY2VsbC55XSAmJiBtYXBEYXRhW2NlbGwueV1bY2VsbC54XSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNYXBDZWxsKGNlbGwueCwgY2VsbC55LCAyKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXN0cm95Qm94Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lCb3hDYWxsYmFjayhjZWxsLngsIGNlbGwueSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGJvbWIuZWwgJiYgYm9tYi5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJvbWIuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShib21iRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgY29uc3QgZXhwID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicpO1xuICAgICAgICBleHAuZHVyYXRpb24gLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoZXhwLmR1cmF0aW9uIDw9IDApIHtcbiAgICAgICAgICAgIGlmIChleHAuZWwgJiYgZXhwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBleHAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChleHAuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShleHBFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhieCwgYnksIHJhbmdlLCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbHMgPSBbeyB4OiBieCwgeTogYnkgfV07XG4gICAgY29uc3QgZGlyZWN0aW9ucyA9IFtcbiAgICAgICAgeyB4OiAwLCB5OiAtMSB9LFxuICAgICAgICB7IHg6IDAsIHk6IDEgfSxcbiAgICAgICAgeyB4OiAtMSwgeTogMCB9LFxuICAgICAgICB7IHg6IDEsIHk6IDAgfVxuICAgIF07XG4gICAgXG4gICAgY29uc3Qgc3RlcHMgPSByYW5nZSAtIDE7IFxuICAgIFxuICAgIGRpcmVjdGlvbnMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0eCA9IGJ4ICsgKGRpci54ICogaSk7XG4gICAgICAgICAgICBjb25zdCB0eSA9IGJ5ICsgKGRpci55ICogaSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghbWFwRGF0YVt0eV0gfHwgbWFwRGF0YVt0eV1bdHhdID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjZWxsVHlwZSA9IG1hcERhdGFbdHldW3R4XTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNlbGxzLnB1c2goeyB4OiB0eCwgeTogdHkgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGNlbGxzO1xufVxuIiwiaW1wb3J0IHsgZ2V0UGxheWVyTmFtZSB9IGZyb20gJy4uL2dhbWUuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBMb3NzIHBvcC11cCBtb2RhbCBmb3IgdGhlIGVsaW1pbmF0ZWQgcGxheWVyLlxuICogQmxvY2tzIHRoZWlyIHNjcmVlbiBpbW1lZGlhdGVseSBzbyB0aGV5IGNhbm5vdCBzcGVjdGF0ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGF5ZXJOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGVsaW1pbmF0ZWQgcGxheWVyXG4gKi9cbmZ1bmN0aW9uIHNob3dMb3NzUG9wdXAocGxheWVyTmFtZSkge1xuICAgIC8vIENoZWNrIGlmIHBvcHVwIGFscmVhZHkgZXhpc3RzIHRvIGF2b2lkIGR1cGxpY2F0ZXNcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtcmVzdWx0LXBvcHVwJykpIHJldHVybjtcbiAgICBcbiAgICAvLyBDcmVhdGUgb3ZlcmxheSB3aXRoIGV4dHJlbWVseSBoaWdoIHotaW5kZXggdG8gYmxvY2sgZW50aXJlIHNjcmVlblxuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdmVybGF5LmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1wb3B1cCBsb3NzJztcbiAgICBvdmVybGF5LnN0eWxlLnpJbmRleCA9ICc5OTk5OSc7XG4gICAgb3ZlcmxheS5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgb3ZlcmxheS5zdHlsZS50b3AgPSAnMCc7XG4gICAgb3ZlcmxheS5zdHlsZS5sZWZ0ID0gJzAnO1xuICAgIG92ZXJsYXkuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgb3ZlcmxheS5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgb3ZlcmxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLCAwLCAwLCAwLjkpJztcbiAgICBvdmVybGF5LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgb3ZlcmxheS5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgb3ZlcmxheS5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInO1xuICAgIFxuICAgIC8vIENyZWF0ZSBwb3B1cCBjb250ZW50XG4gICAgY29uc3QgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwb3B1cC5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtcG9wdXAtY29udGVudCc7XG4gICAgXG4gICAgY29uc3QgdGl0bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9ICdZb3UgYXJlIHRlcnJpYmxlIGF0IHRoaXMhIFdhY2ggbGEzYiBiIHJqbGlrPyc7XG4gICAgdGl0bGVFbC5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtdGl0bGUnO1xuICAgIHRpdGxlRWwuc3R5bGUuY29sb3IgPSAnI2ZmNDQ0NCc7XG4gICAgdGl0bGVFbC5zdHlsZS5mb250U2l6ZSA9ICczNnB4JztcbiAgICB0aXRsZUVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICczMHB4JztcbiAgICBcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSAnUmVzdGFydCc7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1idXR0b24nO1xuICAgIGJ1dHRvbi5zdHlsZS5wYWRkaW5nID0gJzE1cHggNDBweCc7XG4gICAgYnV0dG9uLnN0eWxlLmZvbnRTaXplID0gJzIwcHgnO1xuICAgIGJ1dHRvbi5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAvLyBGb3JjZSBoYXJkIHJlc2V0IC0gc2VuZCB0byBpbml0aWFsIHBhZ2VcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gICAgfSk7XG4gICAgXG4gICAgcG9wdXAuYXBwZW5kQ2hpbGQodGl0bGVFbCk7XG4gICAgcG9wdXAuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBvdmVybGF5LmFwcGVuZENoaWxkKHBvcHVwKTtcbiAgICBcbiAgICAvLyBBcHBlbmQgdG8gZG9jdW1lbnQuYm9keSB0byBibG9jayB0aGUgZW50aXJlIHNjcmVlbiBpbW1lZGlhdGVseVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIFdpbiBwb3AtdXAgbW9kYWwgZm9yIHRoZSB2aWN0b3Jpb3VzIHBsYXllci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGF5ZXJOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHdpbm5pbmcgcGxheWVyXG4gKi9cbmZ1bmN0aW9uIHNob3dXaW5Qb3B1cChwbGF5ZXJOYW1lKSB7XG4gICAgLy8gQ2hlY2sgaWYgcG9wdXAgYWxyZWFkeSBleGlzdHMgdG8gYXZvaWQgZHVwbGljYXRlc1xuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1yZXN1bHQtcG9wdXAnKSkgcmV0dXJuO1xuICAgIFxuICAgIC8vIENyZWF0ZSBvdmVybGF5IHdpdGggZXh0cmVtZWx5IGhpZ2ggei1pbmRleFxuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdmVybGF5LmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1wb3B1cCB3aW4nO1xuICAgIG92ZXJsYXkuc3R5bGUuekluZGV4ID0gJzk5OTk5JztcbiAgICBcbiAgICAvLyBDcmVhdGUgcG9wdXAgY29udGVudFxuICAgIGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcG9wdXAuY2xhc3NOYW1lID0gJ2dhbWUtcmVzdWx0LXBvcHVwLWNvbnRlbnQnO1xuICAgIFxuICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgIHRpdGxlRWwudGV4dENvbnRlbnQgPSBgJHtwbGF5ZXJOYW1lLnRvVXBwZXJDYXNlKCl9IFdPTiFgO1xuICAgIHRpdGxlRWwuY2xhc3NOYW1lID0gJ2dhbWUtcmVzdWx0LXRpdGxlJztcbiAgICBcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSAnUmV0dXJuIHRvIEhvbWUnO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtYnV0dG9uJztcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIC8vIE1VU1QgcmVtb3ZlIG1vZGFsIGZyb20gRE9NIGZpcnN0IHRvIHByZXZlbnQgXCJnaG9zdCBtb2RhbFwiIGJ1Z1xuICAgICAgICBvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICAvLyBGb3JjZSBoYXJkIHJlZGlyZWN0IHRvIGVuc3VyZSBjbGVhbiBzbGF0ZSBhbmQgZGVzdHJveSBhbnkgbGVmdG92ZXIgRE9NIGVsZW1lbnRzXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgIH0pO1xuICAgIFxuICAgIHBvcHVwLmFwcGVuZENoaWxkKHRpdGxlRWwpO1xuICAgIHBvcHVwLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgb3ZlcmxheS5hcHBlbmRDaGlsZChwb3B1cCk7XG4gICAgXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHBsYXllciBkZWF0aCB0cmFuc2l0aW9uIHdoZW4gbGl2ZXMgcmVhY2ggMC5cbiAqIFJlbW92ZXMgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGFuZCBzcGF3bnMgYW4gZXh0cmEtbGlmZSBkcm9wIGF0IHRoZSBkZWF0aCBsb2NhdGlvbi5cbiAqIFxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckVudGl0eSAtIFRoZSBlbnRpdHkgSUQgb2YgdGhlIGR5aW5nIHBsYXllclxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgY29udGFpbmVyID0gbnVsbCkge1xuICAgIC8vIEdldCB0aGUgcGxheWVyJ3MgY29tcG9uZW50c1xuICAgIGNvbnN0IHBvc2l0aW9uID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgIFxuICAgIGlmICghcG9zaXRpb24gfHwgIXJlbmRlcmFibGUgfHwgIXBsYXllcikgcmV0dXJuO1xuICAgIFxuICAgIC8vIFN0b3JlIHRoZSBncmlkIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwbGF5ZXIgZGllZFxuICAgIGNvbnN0IGRlYXRoR3JpZFggPSBNYXRoLmZsb29yKChwb3NpdGlvbi54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICBjb25zdCBkZWF0aEdyaWRZID0gTWF0aC5mbG9vcigocG9zaXRpb24ueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgXG4gICAgLy8gMS4gUmVtb3ZlIHRoZSBwbGF5ZXIncyBET00gZWxlbWVudCBlbnRpcmVseVxuICAgIGlmIChyZW5kZXJhYmxlLmVsICYmIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocmVuZGVyYWJsZS5lbCk7XG4gICAgfVxuICAgIFxuICAgIC8vIDIuIERlc3Ryb3kgdGhlIHBsYXllciBlbnRpdHkgZnJvbSB0aGUgd29ybGQgKHJlbW92ZXMgYWxsIGNvbXBvbmVudHMpXG4gICAgd29ybGQuZGVzdHJveUVudGl0eShwbGF5ZXJFbnRpdHkpO1xuICAgIFxuICAgIC8vIDMuIENyZWF0ZSBhIGRpdiB3aXRoIGhlYXJ0IGVtb2ppIGF0IHRoZSBleGFjdCBkZWF0aCBsb2NhdGlvblxuICAgIGNvbnN0IGhlYXJ0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhcnREaXYuY2xhc3NOYW1lID0gJ2V4dHJhLWxpZmUtZHJvcCc7XG4gICAgaGVhcnREaXYudGV4dENvbnRlbnQgPSAn4p2k77iPJztcbiAgICBoZWFydERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgaGVhcnREaXYuc3R5bGUubGVmdCA9IGAke2RlYXRoR3JpZFggKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUudG9wID0gYCR7ZGVhdGhHcmlkWSAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICBoZWFydERpdi5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcbiAgICBoZWFydERpdi5zdHlsZS5mb250U2l6ZSA9ICczMnB4JztcbiAgICBoZWFydERpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgaGVhcnREaXYuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICBcbiAgICAvLyBBcHBlbmQgdG8gdGhlIGdhbWUgY29udGFpbmVyXG4gICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICBnYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGhlYXJ0RGl2KTtcbiAgICB9XG4gICAgXG4gICAgY29uc29sZS5sb2coYFtQbGF5ZXIgRGVhdGhdIFBsYXllciAke3BsYXllci5pZH0gZGllZCBhdCAoJHtkZWF0aEdyaWRYfSwgJHtkZWF0aEdyaWRZfSkuIEhlYXJ0IGRyb3BwZWQuYCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGZvciBjb2xsaXNpb24gYmV0d2VlbiBwbGF5ZXJzIGFuZCBleHRyYS1saWZlLWRyb3AgRE9NIGVsZW1lbnRzLlxuICogV2hlbiBhIHBsYXllciBjb2xsaWRlcyB3aXRoIGFuIGV4dHJhLWxpZmUtZHJvcCwgdGhleSBnYWluICsxIGxpZmUgYW5kIHRoZSBkcm9wIGlzIHJlbW92ZWQuXG4gKiBPbmx5IHRoZSBmaXJzdCBwbGF5ZXIgdG8gdG91Y2ggaXQgZ2V0cyB0aGUgbGlmZS5cbiAqIFxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICogQHBhcmFtIHtXZWJTb2NrZXR9IHNvY2tldCAtIFdlYlNvY2tldCBjb25uZWN0aW9uIGZvciByZWFsLXRpbWUgc3luY1xuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tFeHRyYUxpZmVDb2xsaXNpb24od29ybGQsIHRpbGVTaXplID0gNjQsIHNvY2tldCA9IG51bGwpIHtcbiAgICAvLyBGaW5kIGFsbCBleHRyYS1saWZlLWRyb3AgZWxlbWVudHMgaW4gdGhlIERPTVxuICAgIGNvbnN0IGV4dHJhTGlmZURyb3BzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmV4dHJhLWxpZmUtZHJvcCcpO1xuICAgIGlmIChleHRyYUxpZmVEcm9wcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBcbiAgICAvLyBHZXQgYWxsIGFjdGl2ZSBwbGF5ZXJzIHdpdGggUG9zaXRpb24gYW5kIFBsYXllciBjb21wb25lbnRzXG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQbGF5ZXInKTtcbiAgICBpZiAocGxheWVycy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBcbiAgICBmb3IgKGNvbnN0IGRyb3Agb2YgZXh0cmFMaWZlRHJvcHMpIHtcbiAgICAgICAgLy8gUGFyc2UgdGhlIGdyaWQgcG9zaXRpb24gZnJvbSB0aGUgZHJvcCdzIENTUyBsZWZ0L3RvcCBwcm9wZXJ0aWVzXG4gICAgICAgIGNvbnN0IGRyb3BMZWZ0ID0gcGFyc2VJbnQoZHJvcC5zdHlsZS5sZWZ0LCAxMCk7XG4gICAgICAgIGNvbnN0IGRyb3BUb3AgPSBwYXJzZUludChkcm9wLnN0eWxlLnRvcCwgMTApO1xuICAgICAgICBcbiAgICAgICAgaWYgKGlzTmFOKGRyb3BMZWZ0KSB8fCBpc05hTihkcm9wVG9wKSkgY29udGludWU7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkcm9wR3JpZFggPSBNYXRoLnJvdW5kKGRyb3BMZWZ0IC8gdGlsZVNpemUpO1xuICAgICAgICBjb25zdCBkcm9wR3JpZFkgPSBNYXRoLnJvdW5kKGRyb3BUb3AgLyB0aWxlU2l6ZSk7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghcFBvcyB8fCAhcGxheWVyKSBjb250aW51ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHBsYXllcidzIGN1cnJlbnQgZ3JpZCBwb3NpdGlvblxuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFggPSBNYXRoLmZsb29yKChwUG9zLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFkgPSBNYXRoLmZsb29yKChwUG9zLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgY29sbGlzaW9uIChzYW1lIGdyaWQgY2VsbClcbiAgICAgICAgICAgIGlmIChwbGF5ZXJHcmlkWCA9PT0gZHJvcEdyaWRYICYmIHBsYXllckdyaWRZID09PSBkcm9wR3JpZFkpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgY3VycmVudCBsaXZlcyB2YWx1ZSwgZGVmYXVsdCB0byAwIGlmIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRMaXZlcyA9IHBsYXllci5saXZlcyB8fCAwO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEluY3JlYXNlIHBsYXllcidzIGxpdmVzIGJ5ICsxIChkaXJlY3QgcHJvcGVydHkgYXNzaWdubWVudClcbiAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSBjdXJyZW50TGl2ZXMgKyAxO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZXh0cmEtbGlmZS1kcm9wIGZyb20gRE9NIGltbWVkaWF0ZWx5IHRvIHByZXZlbnQgbXVsdGlwbGUgdHJpZ2dlcnNcbiAgICAgICAgICAgICAgICBpZiAoZHJvcC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRyb3AucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gUmVhbC1UaW1lIFN5bmNocm9uaXphdGlvbjogU2VuZCBJVEVNX1BJQ0tVUCBldmVudCB0byBzZXJ2ZXJcbiAgICAgICAgICAgICAgICBpZiAoc29ja2V0ICYmIHNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnSVRFTV9QSUNLVVAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0hFQVJUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcklkOiBwbGF5ZXIuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMaXZlczogcGxheWVyLmxpdmVzXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtFeHRyYSBMaWZlXSBQbGF5ZXIgJHtwbGF5ZXIuaWR9IHBpY2tlZCB1cCBoZWFydCEgTmV3IGxpdmVzOiAke3BsYXllci5saXZlc31gKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBCcmVhayBvdXQgb2YgdGhlIGlubmVyIGxvb3Agc2luY2UgdGhpcyBkcm9wIGlzIG5vdyBnb25lXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogQ2hlY2tzIGZvciBwbGF5ZXIgZGVhdGhzIGFuZCBnYW1lIGVuZCBjb25kaXRpb25zLlxuICogU2hvd3MgTG9zcyBwb3AtdXAgZm9yIGVsaW1pbmF0ZWQgcGxheWVycyBhbmQgV2luIHBvcC11cCBmb3IgdGhlIGxhc3Qgc3Vydml2b3IuXG4gKiBcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhbFBsYXllckVudGl0eSAtIFRoZSBsb2NhbCBwbGF5ZXIncyBlbnRpdHkgSURcbiAqIEBwYXJhbSB7TWFwfSBwbGF5ZXJFbnRpdGllcyAtIE1hcCBvZiBwbGF5ZXIgSURzIHRvIGVudGl0eSBJRHNcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbFBsYXllcnMgLSBUb3RhbCBudW1iZXIgb2YgcGxheWVycyBhdCBnYW1lIHN0YXJ0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0dhbWVFbmRDb25kaXRpb25zKHdvcmxkLCBsb2NhbFBsYXllckVudGl0eSwgcGxheWVyRW50aXRpZXMsIHRvdGFsUGxheWVycykge1xuICAgIC8vIENvdW50IGFjdGl2ZSBwbGF5ZXJzIChwbGF5ZXJzIHdpdGggbGl2ZXMgPiAwKVxuICAgIGNvbnN0IGFsbFBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUGxheWVyJyk7XG4gICAgbGV0IGFjdGl2ZVBsYXllckNvdW50ID0gMDtcbiAgICBsZXQgbGFzdEFjdGl2ZVBsYXllckVudGl0eSA9IG51bGw7XG4gICAgXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgYWxsUGxheWVycykge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmIChwbGF5ZXIgJiYgKHBsYXllci5saXZlcyA/PyAwKSA+IDApIHtcbiAgICAgICAgICAgIGFjdGl2ZVBsYXllckNvdW50Kys7XG4gICAgICAgICAgICBsYXN0QWN0aXZlUGxheWVyRW50aXR5ID0gcGxheWVyRW50aXR5O1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIEdldCB0aGUgbG9jYWwgcGxheWVyJ3MgbmFtZSBmb3IgZGlzcGxheSBpbiBwb3B1cHNcbiAgICBjb25zdCBsb2NhbFBsYXllck5hbWUgPSBnZXRQbGF5ZXJOYW1lKCk7XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgbG9jYWwgcGxheWVyIGlzIGVsaW1pbmF0ZWRcbiAgICBpZiAobG9jYWxQbGF5ZXJFbnRpdHkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQobG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIChsb2NhbFBsYXllci5saXZlcyA/PyAwKSA8PSAwKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBhbHJlYWR5IHNob3dlZCBsb3NzIHBvcHVwXG4gICAgICAgICAgICBpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLXJlc3VsdC1wb3B1cCcpKSB7XG4gICAgICAgICAgICAgICAgc2hvd0xvc3NQb3B1cChsb2NhbFBsYXllck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIENoZWNrIHdpbiBjb25kaXRpb246IEVYQUNUTFkgMSBhY3RpdmUgcGxheWVyIHJlbWFpbnMgb24gdGhlIGJvYXJkXG4gICAgaWYgKGFjdGl2ZVBsYXllckNvdW50ID09PSAxICYmIHRvdGFsUGxheWVycyA+IDEgJiYgbGFzdEFjdGl2ZVBsYXllckVudGl0eSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBsYXN0UGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KGxhc3RBY3RpdmVQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKGxhc3RQbGF5ZXIpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgdGhlIGxvY2FsIHBsYXllclxuICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyRW50aXR5ICE9PSBudWxsICYmIGxhc3RBY3RpdmVQbGF5ZXJFbnRpdHkgPT09IGxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1yZXN1bHQtcG9wdXAnKSkge1xuICAgICAgICAgICAgICAgICAgICBzaG93V2luUG9wdXAobG9jYWxQbGF5ZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYW1hZ2VTeXN0ZW0od29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQbGF5ZXInKTtcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAocGxheWVyLmludmluY2libGVVbnRpbCAmJiBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID4gbm93KSBjb250aW51ZTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8oR3JpZC1iYXNlZCBjb2xsaXNpb24pXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWCA9IE1hdGguZmxvb3IoKHBQb3MueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWSA9IE1hdGguZmxvb3IoKHBQb3MueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChwbGF5ZXJHcmlkWCA9PT0gZVBvcy5ncmlkWCAmJiBwbGF5ZXJHcmlkWSA9PT0gZVBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzTGl2ZXMgPSBwbGF5ZXIubGl2ZXMgPz8gMztcbiAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSBNYXRoLm1heChwcmV2aW91c0xpdmVzIC0gMSwgMCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLmludmluY2libGVVbnRpbCA9IG5vdyArIDE1MDA7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIGRlYXRoIHdoZW4gbGl2ZXMgcmVhY2ggMFxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIubGl2ZXMgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVQbGF5ZXJEZWF0aCh3b3JsZCwgcGxheWVyRW50aXR5LCB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCBwbGF5ZXIubGl2ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBtb3ZlbWVudFN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdGlsZVNpemUgPSA0MCkge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5Jyk7XG4gICAgY29uc3QgZGVsdGEgPSBkdCAvIDE2LjY3O1xuXG4gICAgY29uc3QgUExBWUVSX1NJWkUgPSB0aWxlU2l6ZTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgY29uc3QgYmVoYXZpb3IgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQmVoYXZpb3InKTtcblxuICAgICAgICBpZiAoYmVoYXZpb3IpIHtcbiAgICAgICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQgKyAoYmVoYXZpb3IuZmFzdFNob2VzTGV2ZWwgLSAxKSAqIDAuNTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUlucHV0ID0gaW5wdXQuaW5wdXRRdWV1ZVswXTtcbiAgICAgICAgbGV0IGR4ID0gMDtcbiAgICAgICAgbGV0IGR5ID0gMDtcblxuICAgICAgICBpZiAoYWN0aXZlSW5wdXQgPT09ICd1cCcpIHtcbiAgICAgICAgICAgIGR5ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3VwJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2Rvd24nKSB7XG4gICAgICAgICAgICBkeSA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2Rvd24nO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIGR4ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICBkeCA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3JpZ2h0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhc0lucHV0ID0gZHggIT09IDAgfHwgZHkgIT09IDA7XG5cbiAgICAgICAgaWYgKCFoYXNJbnB1dCkge1xuICAgICAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG4gICAgICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ0lETEUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WSA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBjb25zdCBzbmFwVGhyZXNob2xkID0gMzI7XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmIGR4ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKHBvcy54LCBuZXh0WSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWCA9IE1hdGguZmxvb3IoKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRYID0gY3VycmVudFRpbGVYICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlggPSBwb3MueCAtIHRhcmdldFg7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlgpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gLU1hdGguc2lnbihkaWZmWCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmIGR5ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKG5leHRYLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWSA9IE1hdGguZmxvb3IoKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRZID0gY3VycmVudFRpbGVZICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlkgPSBwb3MueSAtIHRhcmdldFk7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlkpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gLU1hdGguc2lnbihkaWZmWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFhBZnRlclNuYXAgPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZQWZ0ZXJTbmFwID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiAhaXNCbG9ja2VkKG5leHRYQWZ0ZXJTbmFwLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnggPSBuZXh0WEFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiAhaXNCbG9ja2VkKHBvcy54LCBuZXh0WUFmdGVyU25hcCwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnkgPSBuZXh0WUFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlbC5pc01vdmluZyA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ1JVTic7XG4gICAgICAgIH1cblxuICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG5cbiAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpIHtcbiAgICBjb25zdCBzdGVwID0gdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICBpZiAocG9zLnggPCBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWluKHBvcy54ICsgc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH0gZWxzZSBpZiAocG9zLnggPiBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWF4KHBvcy54IC0gc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH1cblxuICAgIGlmIChwb3MueSA8IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5taW4ocG9zLnkgKyBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfSBlbHNlIGlmIChwb3MueSA+IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5tYXgocG9zLnkgLSBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfVxuXG4gICAgdmVsLmlzTW92aW5nID1cbiAgICAgICAgcG9zLnggIT09IHBvcy50YXJnZXRYIHx8XG4gICAgICAgIHBvcy55ICE9PSBwb3MudGFyZ2V0WTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkKHgsIHksIG1hcERhdGEsIHRpbGVTaXplLCBwbGF5ZXJTaXplID0gdGlsZVNpemUpIHtcbiAgICBjb25zdCBwYWRkaW5nID0gNDtcblxuICAgIGNvbnN0IGxlZnQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgcmlnaHQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHRvcCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCBib3R0b20gPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgYm90dG9tLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCBib3R0b20sIG1hcERhdGEpXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkQ2VsbCh4LCB5LCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbCA9IG1hcERhdGFbeV0gJiYgbWFwRGF0YVt5XVt4XTtcblxuICAgIHJldHVybiBjZWxsICE9PSAwICYmIGNlbGwgIT09IDI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcG93ZXJVcFN5c3RlbSh3b3JsZCwgb25Qb3dlclVwUGlja2VkKSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdQbGF5ZXInKTtcbiAgICBjb25zdCBwb3dlclVwcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKCFwUG9zIHx8ICF2ZWwgfHwgIXBsYXllcikgY29udGludWU7XG5cbiAgICAgICAgZm9yIChjb25zdCBwVXBFbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwVXAgPSB3b3JsZC5nZXRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCF1cFBvcyB8fCAhcFVwIHx8IHBVcC5waWNrZWRVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChwUG9zLmdyaWRYID09PSB1cFBvcy5ncmlkWCAmJiBwUG9zLmdyaWRZID09PSB1cFBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIHBVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAocFVwLnR5cGUgPT09ICdTUEVFRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmVsLnNwZWVkID0gTWF0aC5taW4odmVsLnNwZWVkICsgMSwgOCk7IFxuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0ZMQU1FJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocFVwLmVsICYmIHBVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9uUG93ZXJVcFBpY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICBvblBvd2VyVXBQaWNrZWQocGxheWVyLmlkLCBwVXAudHlwZSwgdXBQb3MuZ3JpZFgsIHVwUG9zLmdyaWRZKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KHBVcEVudGl0eSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7IFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Bhd25Qb3dlclVwKHdvcmxkLCBneCwgZ3ksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IHNlZWQgPSBneCAqIDczODU2MDkzIF4gZ3kgKiAxOTM0OTY2MztcbiAgICBjb25zdCBzZWVkUmFuZG9tID0gKE1hdGguc2luKHNlZWQpICogMTAwMDApIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkKSAqIDEwMDAwKTtcbiAgICBcbiAgICBpZiAoc2VlZFJhbmRvbSA+IDAuMzUpIHJldHVybjtcblxuICAgIGNvbnN0IHR5cGVzID0gWydTUEVFRCcsICdCT01CUycsICdGTEFNRSddO1xuICAgIGNvbnN0IHR5cGVJbmRleCA9IE1hdGguZmxvb3IoKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCkpICogdHlwZXMubGVuZ3RoKTtcbiAgICBjb25zdCByYW5kb21UeXBlID0gdHlwZXNbdHlwZUluZGV4XTtcblxuICAgIGNvbnN0IHBVcEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogdGlsZVNpemUsIHk6IGd5ICogdGlsZVNpemUgfSk7XG4gICAgXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9IGBwb3dlcnVwIHBvd2VydXAtJHtyYW5kb21UeXBlLnRvTG93ZXJDYXNlKCl9YDtcbiAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnRvcCA9IGAke2d5ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcsIHsgdHlwZTogcmFuZG9tVHlwZSwgZWw6IGRpdiB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByZW5kZXJTeXN0ZW0od29ybGQsIGR0LCBub3csIGFuaW1Sb3dzKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUmVuZGVyYWJsZScpO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcblxuICAgICAgICBpZiAoIXJlbmRlcmFibGUuZWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gcmVuZGVyYWJsZS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Um93ID0gYW5pbVJvd3Nbc3RhdGVdW3ZlbC5kaXJlY3Rpb25dO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYW5pbWF0aW9uIHdoZW4gcm93IG9yIHN0YXRlIGNoYW5nZXNcbiAgICAgICAgaWYgKHJlbmRlcmFibGUucm93ICE9PSB0YXJnZXRSb3cgfHwgcmVuZGVyYWJsZS5sYXN0U3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnJvdyA9IHRhcmdldFJvdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdFN0YXRlID0gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcmFtZUNvdW50ID0gc3RhdGUgPT09ICdSVU4nID8gcmVuZGVyYWJsZS5ydW5GcmFtZXMgOiByZW5kZXJhYmxlLmlkbGVGcmFtZXM7XG4gICAgICAgIGNvbnN0IGZyYW1lRGVsYXkgPSBzdGF0ZSA9PT0gJ1JVTicgPyAxMDAwIC8gcmVuZGVyYWJsZS5mcHMgOiAxMDAwIC8gcmVuZGVyYWJsZS5pZGxlRnBzO1xuXG4gICAgICAgIGlmIChub3cgLSByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPiBmcmFtZURlbGF5KSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IChyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSArIDEpICUgZnJhbWVDb3VudDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvc1ggPSAtKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICogcmVuZGVyYWJsZS5mcmFtZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcG9zWSA9IC0ocmVuZGVyYWJsZS5yb3cgKiByZW5kZXJhYmxlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYCR7cG9zWH1weCAke3Bvc1l9cHhgO1xuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3Bvcy54fXB4LCAke3Bvcy55fXB4LCAwKWA7XG4gICAgfVxufVxuIiwiLy8gL3NyYy9lY3Mvd29ybGQuanNcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uZXh0RW50aXR5SWQgPSAwO1xuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgTWFwKCk7IFxuICAgICAgICB0aGlzLnN5c3RlbXMgPSBbXTtcbiAgICB9XG5cbiAgICBjcmVhdGVFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMubmV4dEVudGl0eUlkKys7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkKGVudGl0eSk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVudGl0eShlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgZm9yIChjb25zdCBbY29tcG9uZW50TmFtZSwgY29tcG9uZW50TWFwXSBvZiB0aGlzLmNvbXBvbmVudHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lLCBjb21wb25lbnREYXRhID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHMuaGFzKGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIG5ldyBNYXAoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKS5zZXQoZW50aXR5LCBjb21wb25lbnREYXRhKTtcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRNYXAgPyBjb21wb25lbnRNYXAuZ2V0KGVudGl0eSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBpZiAoY29tcG9uZW50TWFwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBxdWVyeSguLi5jb21wb25lbnROYW1lcykge1xuICAgICAgICBpZiAoY29tcG9uZW50TmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaXJzdE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbMF0pO1xuICAgICAgICBpZiAoIWZpcnN0TWFwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGZpcnN0TWFwLmtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGhhc0FsbCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNvbXBvbmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXAgfHwgIW1hcC5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0FsbCAmJiB0aGlzLmVudGl0aWVzLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkU3lzdGVtKHN5c3RlbUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbUZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZHQsIG5vdykge1xuICAgICAgICBmb3IgKGNvbnN0IHN5c3RlbSBvZiB0aGlzLnN5c3RlbXMpIHtcbiAgICAgICAgICAgIHN5c3RlbSh0aGlzLCBkdCwgbm93KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEdSSURfQk9SREVSX1NJWkUgPSA2O1xuY29uc3QgR0FNRV9DSFJPTUVfV0lEVEggPSA3MjtcbmNvbnN0IEdBTUVfQ0hST01FX0hFSUdIVCA9IDE1MDtcblxuY29uc3QgaW1hZ2VzID0ge1xuICAgIDI6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiLFxuICAgIDM6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX3dhbGwucG5nXCIsXG4gICAgNDogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZXhwbG9pdC5wbmdcIixcbn07XG5cbmNvbnN0IFtwbGF5ZXJOYW1lLCBzZXRQbGF5ZXJOYW1lXSA9IGNyZWF0ZVNpZ25hbChcIlBsYXllciAxXCIpO1xuY29uc3QgW2xpdmVzLCBzZXRMaXZlc10gPSBjcmVhdGVTaWduYWwoMyk7XG5jb25zdCBbc3BlZWQsIHNldFNwZWVkXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtib21icywgc2V0Qm9tYnNdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW3JhbmdlLCBzZXRSYW5nZV0gPSBjcmVhdGVTaWduYWwoMSk7XG5leHBvcnQgeyBzZXRQbGF5ZXJOYW1lLCBzZXRMaXZlcywgc2V0U3BlZWQsIHNldEJvbWJzLCBzZXRSYW5nZSB9O1xuXG5jb25zdCBuYW1lRWwgPSA8c3BhbiBjbGFzcz1cInBsYXllci1uYW1lXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbmFtZUVsLnRleHRDb250ZW50ID0gcGxheWVyTmFtZSgpOyB9KTtcblxuY29uc3QgbGl2ZXNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgbGl2ZXMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3Qgc3BlZWRFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgc3BlZWQtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgYm9tYnNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgYm9tYnMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgcmFuZ2VFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgcmFuZ2UtdmFsdWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBsaXZlc0VsLnRleHRDb250ZW50ID0gbGl2ZXMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBzcGVlZEVsLnRleHRDb250ZW50ID0gc3BlZWQoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBib21ic0VsLnRleHRDb250ZW50ID0gYm9tYnMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyByYW5nZUVsLnRleHRDb250ZW50ID0gcmFuZ2UoKTsgfSk7XG5cbmZ1bmN0aW9uIEdhbWUoeyBncmlkIH0pIHtcbiAgICBjb25zdCBib2FyZFdpZHRoID0gZ3JpZFswXS5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRIZWlnaHQgPSBncmlkLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZE91dGVyV2lkdGggPSBib2FyZFdpZHRoICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3QgYm9hcmRPdXRlckhlaWdodCA9IGJvYXJkSGVpZ2h0ICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBib2FyZFdpZHRoIDogd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRIZWlnaHQgOiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY29uc3Qgc2NhbGUgPSBNYXRoLm1pbihcbiAgICAgICAgMSxcbiAgICAgICAgTWF0aC5tYXgoMC4yLCAodmlld3BvcnRXaWR0aCAtIEdBTUVfQ0hST01FX1dJRFRIKSAvIGJvYXJkT3V0ZXJXaWR0aCksXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0SGVpZ2h0IC0gR0FNRV9DSFJPTUVfSEVJR0hUKSAvIGJvYXJkT3V0ZXJIZWlnaHQpXG4gICAgKTtcbiAgICBjb25zdCByb3dzID0gW107XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IGdyaWQubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCBncmlkW3Jvd0luZGV4XS5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBncmlkW3Jvd0luZGV4XVtjb2xJbmRleF07XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gXCJ0aWxlXCI7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBgd2lkdGg6JHtUSUxFX1NJWkV9cHg7aGVpZ2h0OiR7VElMRV9TSVpFfXB4O2A7XG5cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAyIHx8IGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS1mbG9vclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS13YWxsXCI7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzNdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbNF19KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMCB8fCBjZWxsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzJdfSlgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxscy5wdXNoKDxkaXYgY2xhc3M9e2NsYXNzTmFtZX0gZGF0YS14PXtjb2xJbmRleH0gZGF0YS15PXtyb3dJbmRleH0gc3R5bGU9e3N0eWxlfT48L2Rpdj4pO1xuICAgICAgICB9XG4gICAgICAgIHJvd3MucHVzaCg8ZGl2IGNsYXNzPVwiZ3JpZC1yb3dcIj57Y2VsbHN9PC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWdsYXNzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWJhclwiPlxuICAgICAgICAgICAgICAgICAgICB7bmFtZUVsfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+TGl2ZXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpdmVzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+U3BlZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwZWVkRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+Qm9tYnM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvbWJzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+UmFuZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JhbmdlRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtYm9hcmQtZnJhbWVcIiBzdHlsZT17YHdpZHRoOiR7Ym9hcmRPdXRlcldpZHRoICogc2NhbGV9cHg7aGVpZ2h0OiR7Ym9hcmRPdXRlckhlaWdodCAqIHNjYWxlfXB4O2B9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBpZD1cImdhbWUtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZ2FtZS1ncmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtgcG9zaXRpb246cmVsYXRpdmU7d2lkdGg6JHtib2FyZFdpZHRofXB4O2hlaWdodDoke2JvYXJkSGVpZ2h0fXB4O3RyYW5zZm9ybTpzY2FsZSgke3NjYWxlfSk7YH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IENoYXRQbGF5ZXJzIGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxubGV0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSBjcmVhdGVTaWduYWwoe30pO1xuZXhwb3J0IHsgc2V0U3RhdGVzIH07XG5cbmxldCByb29tSWRFbCA9IDxwPlJvb20gSUQ6IDwvcD47XG5sZXQgcGxheWVyc0VsID0gPHA+UGxheWVyczogIC8gNDwvcD47XG5sZXQgdGV4dEVsID0gPHA+PC9wPjtcbmxldCB0aW1lckVsID0gPHA+VGltZXI6IDwvcD47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcyA9IHN0YXRlcygpO1xuICAgIHJvb21JZEVsLnRleHRDb250ZW50ID0gYFJvb20gSUQ6ICR7cy5yb29tSWR9YDtcbiAgICBwbGF5ZXJzRWwudGV4dENvbnRlbnQgPSBgUGxheWVyczogJHtzLnBsYXllcnNDb3VudH0gLyA0YDtcbiAgICB0ZXh0RWwudGV4dENvbnRlbnQgPSBzLnRleHQgfHwgXCJcIjtcblxuICAgIGlmIChzLmdhbWVTdGFydGVkKSB7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBcIlRpbWVyOiBHYW1lIHN0YXJ0ZWRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0aW1lclRleHQgPSAoIXMuc2Vjb25kc0xlZnQpID8gXCJXYWl0aW5nIGZvciBvbmUgbW9yZSBwbGF5ZXJcIiA6IGAke3Muc2Vjb25kc0xlZnR9IHNlY29uZHNgO1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gYFRpbWVyOiAke3RpbWVyVGV4dH1gO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBMb2JieSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29uYXRpbmVyLWxvYmJ5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9iYnktYm94XCI+XG4gICAgICAgICAgICAgICAgPGgxPkxvYmJ5PC9oMT5cbiAgICAgICAgICAgICAgICB7cm9vbUlkRWx9XG4gICAgICAgICAgICAgICAge3BsYXllcnNFbH1cbiAgICAgICAgICAgICAgICB7dGV4dEVsfVxuICAgICAgICAgICAgICAgIHt0aW1lckVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q2hhdFBsYXllcnMgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2JieTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5jb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbnJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbmxldCBtZW51RWwgPSAoXG4gICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgIDxoMT5Zb3UgV2luITwvaDE+XG4gICAgICAgIDxwPkFsbCBvdGhlciBwbGF5ZXJzIGhhdmUgbGVmdCB0aGUgZ2FtZS48L3A+XG4gICAgICAgIHtyZXBsYXlCdG59XG4gICAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZW51KCkge1xuICAgIHJldHVybiBtZW51RWw7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHN1Ym1pdHRlZCA9IGZhbHNlO1xuXG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoc3VibWl0dGVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgbmlja25hbWUgPSBmb3JtRGF0YS5nZXQoXCJuaWNrbmFtZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFuaWNrbmFtZSB8fCBuaWNrbmFtZS5sZW5ndGggPiAyMCkgcmV0dXJuO1xuXG4gICAgICAgIHN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHNldFBsYXllck5hbWUobmlja25hbWUpO1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwibmlja25hbWVfb2ZfdGhlX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmlja25hbWUtaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW50ZXIgeW91ciBuYW1lXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmVnaXN0ZXItYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPnN0YXJ0IHBsYXlpbmc8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XG4iLCJjbGFzcyBTb3VuZCB7XG4gICAgY29uc3RydWN0b3Ioc3JjKSB7XG4gICAgICAgIHRoaXMubXVzaWMgPSBuZXcgQXVkaW8oc3JjKTtcbiAgICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcblxuICAgICAgICB0aGlzLm11c2ljLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNDtcblxuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc05hbWUgPSBcInNvdW5kLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5hcHBlbmQodGhpcy5pY29uKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGUoKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5idXR0b24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wbGF5KCksIHsgb25jZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLm11c2ljLnBsYXkoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11c2ljLnBhdXNlZCB8fCB0aGlzLm11c2ljLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb25cIik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQnV0dG9uKCkge1xuICAgICAgICBjb25zdCBpc011dGVkID0gdGhpcy5tdXNpYy5tdXRlZCB8fCB0aGlzLm11c2ljLnBhdXNlZDtcblxuICAgICAgICB0aGlzLmljb24uY2xhc3NOYW1lID0gaXNNdXRlZCA/IFwiZmEtc29saWQgZmEtdm9sdW1lLW9mZlwiIDogXCJmYS1zb2xpZCBmYS12b2x1bWUtaGlnaFwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtbXV0ZWRcIiwgaXNNdXRlZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VuZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAvYXBwLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwicHJvcHMiLCJjaGlsZHJlbiIsImVsZSIsImRvY3VtZW50Iiwia2V5Iiwic3RhcnRzV2l0aCIsImV2ZW50TmFtZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwiZmxhdENoaWxkcmVuIiwiZmxhdCIsIkluZmluaXR5IiwiYXBwZW5kIiwiZmlsdGVyIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJyZW5kZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwicmVwbGFjZUNoaWxkcmVuIiwiUm91dGVyIiwicm91dGVyIiwiZWZmZWN0U3RhY2siLCJhY3RpdmVFZmZlY3QiLCJjcmVhdGVTaWduYWwiLCJpbml0aWFsVmFsdWUiLCJ2YWx1ZSIsImVmZmVjdHMiLCJTZXQiLCJSZWFkIiwiYWRkIiwiV3JpdGUiLCJuZXdWYWx1ZSIsImZuIiwiZm9yRWFjaCIsImVmZmVjdCIsImNyZWF0ZUVmZmVjdCIsInB1c2giLCJwb3AiLCJsZW5ndGgiLCJSb3V0ZXMiLCJPYmplY3QiLCJjcmVhdGUiLCJGaXJzdFJlc29sdmUiLCJvbiIsInBhdGgiLCJoYW5kbGVyIiwibmF2aWdhdGUiLCJoaXN0b3J5IiwibmF2aWdhdGlvbiIsInJlc29sdmUiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwidXJsIiwiVVJMIiwiaHJlZiIsImxpc3RlbiIsIm9uRXJyb3I0MDQiLCJldmVudCIsImRlc3RpbmF0aW9uIiwiaW50ZXJjZXB0IiwiY29uc29sZSIsImxvZyIsIlJlZ2lzdGVyIiwiR2FtZSIsIk1lbnUiLCJMb2JieSIsInNldFN0YXRlcyIsInNldFBsYXllck5hbWUiLCJzZXRIdWRQbGF5ZXJOYW1lIiwiU291bmQiLCJzZXRNZXNzYWdlcyIsIkdhbWVFbmdpbmUiLCJyb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3c3MiLCJXZWJTb2NrZXQiLCJ3aW5kb3ciLCJob3N0bmFtZSIsInNvdW5kIiwiY3VycmVudEdhbWVFbmdpbmUiLCJpbml0IiwiYm9keSIsImNsYXNzTmFtZSIsImFsZXJ0Iiwid3MiLCJtZXNzYWdlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsInF1ZXJ5U2VsZWN0b3IiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJzZWNvbmRzTGVmdCIsInRleHQiLCJncmlkIiwic2V0VGltZW91dCIsImdhbWVDb250YWluZXIiLCJkZXN0cm95IiwibG9jYWxQbGF5ZXIiLCJwbGF5ZXJzIiwiZmluZCIsInBsYXllciIsImlkIiwieW91clBsYXllcklkIiwibmlja25hbWUiLCJlbmdpbmUiLCJlcnJvciIsInByZXYiLCJoYW5kbGVSZW1vdGVNb3ZlIiwicGF5bG9hZCIsImhhbmRsZVJlbW90ZUJvbWIiLCJoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkIiwiaGFuZGxlUmVtb3RlSXRlbVBpY2t1cCIsImVyciIsIm1lc3NhZ2VzIiwiQ2hhdFBsYXllcnMiLCJtZXNzYWdlc0NvbnRhaW5lciIsImNsYXNzIiwibXNncyIsImlubmVySFRNTCIsIm1zZyIsInAiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsImdldCIsInRyaW0iLCJyZXNldCIsInNlbmQiLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlBvc2l0aW9uQ29tcG9uZW50IiwiZ3giLCJneSIsInRpbGVTaXplIiwiZ3JpZFgiLCJncmlkWSIsIngiLCJ5IiwidGFyZ2V0WCIsInRhcmdldFkiLCJWZWxvY2l0eUNvbXBvbmVudCIsImJhc2VTcGVlZCIsInNwZWVkIiwiaXNNb3ZpbmciLCJkaXJlY3Rpb24iLCJJbnB1dENvbXBvbmVudCIsImlucHV0UXVldWUiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiZWwiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJ0b3RhbEZyYW1lcyIsImZwcyIsImN1cnJlbnRGcmFtZSIsInJ1bkZyYW1lcyIsImlkbGVGcmFtZXMiLCJpZGxlRnBzIiwibGFzdEZyYW1lVGltZSIsInJvdyIsInN0YXRlIiwibGFzdFN0YXRlIiwiUGxheWVyQ29tcG9uZW50IiwiY2hhclR5cGUiLCJpc0xvY2FsIiwiQm9tYkNvbXBvbmVudCIsIm93bmVySWQiLCJ0aW1lciIsInJhbmdlIiwiZXhwbG9kZWQiLCJFeHBsb3Npb25Db21wb25lbnQiLCJkdXJhdGlvbiIsIlBvd2VyVXBDb21wb25lbnQiLCJwaWNrZWRVcCIsIkJlaGF2aW9yQ29tcG9uZW50IiwiZ2hvc3RNb2RlIiwidGhyb3dhYmxlIiwiZGV0b25hdG9yIiwiZmFzdFNob2VzTGV2ZWwiLCJib21icyIsIm1heCIsImN1cnJlbnQiLCJXb3JsZCIsIm1vdmVtZW50U3lzdGVtIiwicmVuZGVyU3lzdGVtIiwiYm9tYlN5c3RlbSIsImRhbWFnZVN5c3RlbSIsImNoZWNrRXh0cmFMaWZlQ29sbGlzaW9uIiwiY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyIsInBvd2VyVXBTeXN0ZW0iLCJzcGF3blBvd2VyVXAiLCJzZXRCb21icyIsInNldExpdmVzIiwic2V0UmFuZ2UiLCJzZXRTcGVlZCIsIlRJTEVfU0laRSIsIkFOSU1BVElPTl9ST1dTIiwiUlVOIiwidXAiLCJsZWZ0IiwiZG93biIsInJpZ2h0IiwiSURMRSIsImNvbnN0cnVjdG9yIiwiY2FudmFzQ29udGFpbmVyIiwibWFwRGF0YSIsInNvY2tldCIsIndvcmxkIiwibG9jYWxQbGF5ZXJFbnRpdHkiLCJwbGF5ZXJFbnRpdGllcyIsIk1hcCIsImxhc3RUaW1lIiwicmVtb3ZlSW5wdXRMaXN0ZW5lcnMiLCJhbmltYXRpb25GcmFtZSIsInJ1bm5pbmciLCJjbGFpbWVkUG93ZXJVcHMiLCJsb2NhbFBsYXllcklkIiwiYWxsUGxheWVycyIsInRvdGFsUGxheWVycyIsIm5vcm1hbGl6ZWRMb2NhbFBsYXllcklkIiwiU3RyaW5nIiwicERhdGEiLCJwbGF5ZXJJZCIsInBsYXllckVudGl0eSIsImNyZWF0ZUVudGl0eSIsInBsYXllckRpdiIsImNvbG9yIiwic3R5bGUiLCJwb3NpdGlvbiIsInpJbmRleCIsIndpbGxDaGFuZ2UiLCJzeCIsInN5IiwiYWRkQ29tcG9uZW50IiwicGxheWVyQ29tcCIsImxpdmVzIiwibWF4Qm9tYnMiLCJib21iUmFuZ2UiLCJzZXQiLCJ1cGRhdGVIdWRTdGF0cyIsInNldHVwSW5wdXQiLCJ3YXJuIiwibWFwIiwicmVnaXN0ZXJTeXN0ZW1zIiwicGVyZm9ybWFuY2UiLCJub3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJnYW1lTG9vcCIsImlucHV0IiwiZ2V0Q29tcG9uZW50IiwiZ2V0S2V5RGlyZWN0aW9uIiwiaGFuZGxlS2V5RG93biIsImRpciIsImluY2x1ZGVzIiwiY29kZSIsImRyb3BCb21iIiwiaGFuZGxlS2V5VXAiLCJkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInBvcyIsImN1cnJlbnRCb21icyIsInF1ZXJ5IiwiYkVudGl0eSIsImNyZWF0ZWQiLCJjcmVhdGVCb21iIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJleGlzdHMiLCJzb21lIiwiZW50aXR5IiwiYm9tYiIsImJvbWJFbnRpdHkiLCJib21iRGl2IiwidG9wIiwiYm9tYkNvbXAiLCJBcnJheSIsImZyb20iLCJrZXlzIiwidmVsIiwicmVuZGVyYWJsZSIsInJlbW92ZVBvd2VyVXBBdCIsImFwcGx5UG93ZXJVcCIsIm5ld0xpdmVzIiwicG93ZXJVcHMiLCJwb3dlclVwIiwicGFyZW50Tm9kZSIsImRlc3Ryb3lFbnRpdHkiLCJ2ZWxvY2l0eSIsIk1hdGgiLCJtaW4iLCJ1cGRhdGVNYXBDZWxsIiwidGlsZSIsImJhY2tncm91bmRJbWFnZSIsImRlc3Ryb3lCb3hDYWxsYmFjayIsImhhcyIsIm9uUGxheWVySHVydCIsInJlbWFpbmluZ0xpdmVzIiwib25Qb3dlclVwUGlja2VkIiwiYnJvYWRjYXN0TW92ZW1lbnQiLCJhZGRTeXN0ZW0iLCJ3IiwiZHQiLCJ1cGRhdGUiLCJuZXh0Tm93IiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJyb3VuZCIsImN1cnJlbnRMb2NhbFBsYXllck5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZ2V0UGxheWVyTmFtZSIsImdldEl0ZW0iLCJhZmZlY3RlZENlbGxzIiwiY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMiLCJjZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2Iiwid2lkdGgiLCJoZWlnaHQiLCJleHBsb3Npb25zIiwiZXhwIiwiYngiLCJieSIsImNlbGxzIiwiZGlyZWN0aW9ucyIsInN0ZXBzIiwiaSIsInR4IiwidHkiLCJjZWxsVHlwZSIsInNob3dMb3NzUG9wdXAiLCJwbGF5ZXJOYW1lIiwib3ZlcmxheSIsImJhY2tncm91bmRDb2xvciIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJwb3B1cCIsInRpdGxlRWwiLCJmb250U2l6ZSIsIm1hcmdpbkJvdHRvbSIsImJ1dHRvbiIsInBhZGRpbmciLCJjdXJzb3IiLCJzaG93V2luUG9wdXAiLCJ0b1VwcGVyQ2FzZSIsInJlbW92ZSIsImhhbmRsZVBsYXllckRlYXRoIiwiZGVhdGhHcmlkWCIsImZsb29yIiwiZGVhdGhHcmlkWSIsImhlYXJ0RGl2IiwicG9pbnRlckV2ZW50cyIsImV4dHJhTGlmZURyb3BzIiwicXVlcnlTZWxlY3RvckFsbCIsImRyb3AiLCJkcm9wTGVmdCIsInBhcnNlSW50IiwiZHJvcFRvcCIsImlzTmFOIiwiZHJvcEdyaWRYIiwiZHJvcEdyaWRZIiwicFBvcyIsInBsYXllckdyaWRYIiwicGxheWVyR3JpZFkiLCJjdXJyZW50TGl2ZXMiLCJpdGVtIiwiYWN0aXZlUGxheWVyQ291bnQiLCJsYXN0QWN0aXZlUGxheWVyRW50aXR5IiwibG9jYWxQbGF5ZXJOYW1lIiwibGFzdFBsYXllciIsImludmluY2libGVVbnRpbCIsImVQb3MiLCJwcmV2aW91c0xpdmVzIiwiZW50aXRpZXMiLCJkZWx0YSIsIlBMQVlFUl9TSVpFIiwiYmVoYXZpb3IiLCJtb3ZlVG93YXJkVGFyZ2V0IiwiYWN0aXZlSW5wdXQiLCJkeCIsImR5IiwiaGFzSW5wdXQiLCJuZXh0WCIsIm5leHRZIiwic25hcFRocmVzaG9sZCIsImlzQmxvY2tlZCIsImN1cnJlbnRUaWxlWCIsImRpZmZYIiwiYWJzIiwic2lnbiIsImN1cnJlbnRUaWxlWSIsImRpZmZZIiwibmV4dFhBZnRlclNuYXAiLCJuZXh0WUFmdGVyU25hcCIsInN0ZXAiLCJwbGF5ZXJTaXplIiwiYm90dG9tIiwiaXNCbG9ja2VkQ2VsbCIsInBVcEVudGl0eSIsInVwUG9zIiwicFVwIiwic2VlZCIsInNlZWRSYW5kb20iLCJzaW4iLCJ0eXBlcyIsInR5cGVJbmRleCIsInJhbmRvbVR5cGUiLCJkaXYiLCJhbmltUm93cyIsInRhcmdldFJvdyIsImZyYW1lQ291bnQiLCJmcmFtZURlbGF5IiwicG9zWCIsInBvc1kiLCJiYWNrZ3JvdW5kUG9zaXRpb24iLCJ0cmFuc2Zvcm0iLCJuZXh0RW50aXR5SWQiLCJjb21wb25lbnRzIiwic3lzdGVtcyIsImRlbGV0ZSIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnRNYXAiLCJlbnRyaWVzIiwiY29tcG9uZW50RGF0YSIsInJlbW92ZUNvbXBvbmVudCIsImNvbXBvbmVudE5hbWVzIiwiZmlyc3RNYXAiLCJyZXN1bHRzIiwiaGFzQWxsIiwic3lzdGVtRnVuY3Rpb24iLCJzeXN0ZW0iLCJHUklEX0JPUkRFUl9TSVpFIiwiR0FNRV9DSFJPTUVfV0lEVEgiLCJHQU1FX0NIUk9NRV9IRUlHSFQiLCJpbWFnZXMiLCJuYW1lRWwiLCJsaXZlc0VsIiwic3BlZWRFbCIsImJvbWJzRWwiLCJyYW5nZUVsIiwiYm9hcmRXaWR0aCIsImJvYXJkSGVpZ2h0IiwiYm9hcmRPdXRlcldpZHRoIiwiYm9hcmRPdXRlckhlaWdodCIsInZpZXdwb3J0V2lkdGgiLCJpbm5lcldpZHRoIiwidmlld3BvcnRIZWlnaHQiLCJpbm5lckhlaWdodCIsInNjYWxlIiwicm93cyIsInJvd0luZGV4IiwiY29sSW5kZXgiLCJzdGF0ZXMiLCJyb29tSWRFbCIsInBsYXllcnNFbCIsInRleHRFbCIsInRpbWVyRWwiLCJzIiwiZ2FtZVN0YXJ0ZWQiLCJ0aW1lclRleHQiLCJyZXBsYXlCdG4iLCJyZWxvYWQiLCJtZW51RWwiLCJzdWJtaXR0ZWQiLCJwbGF5ZXJFbnRlciIsImN1cnJlbnRUYXJnZXQiLCJzcmMiLCJtdXNpYyIsIkF1ZGlvIiwiaWNvbiIsImxvb3AiLCJ2b2x1bWUiLCJ0b2dnbGUiLCJwbGF5Iiwib25jZSIsInVwZGF0ZUJ1dHRvbiIsInRoZW4iLCJjYXRjaCIsInBhdXNlZCIsIm11dGVkIiwiaXNNdXRlZCIsImNsYXNzTGlzdCJdLCJzb3VyY2VSb290IjoiIn0=