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

    // Check for extra life collision with players
    (0,_systems_damageSystem_js__WEBPACK_IMPORTED_MODULE_5__.checkExtraLifeCollision)(this.world, TILE_SIZE);

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
 * @param {string} playerName - The name of the eliminated player
 */
function showLossPopup(playerName) {
  // Check if popup already exists to avoid duplicates
  if (document.querySelector('.game-result-popup')) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'game-result-popup loss';

  // Create popup content
  const popup = document.createElement('div');
  popup.className = 'game-result-popup-content';
  const titleEl = document.createElement('h1');
  titleEl.textContent = 'LOSER! Wach la3b b rjlik?';
  titleEl.className = 'game-result-title';
  const button = document.createElement('button');
  button.textContent = 'Return to Home';
  button.className = 'game-result-button';
  button.addEventListener('click', () => {
    window.location.reload();
  });
  popup.appendChild(titleEl);
  popup.appendChild(button);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

/**
 * Creates a Win pop-up modal for the victorious player.
 * @param {string} playerName - The name of the winning player
 */
function showWinPopup(playerName) {
  // Check if popup already exists to avoid duplicates
  if (document.querySelector('.game-result-popup')) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'game-result-popup win';

  // Create popup content
  const popup = document.createElement('div');
  popup.className = 'game-result-popup-content';
  const titleEl = document.createElement('h1');
  titleEl.textContent = `${playerName} Won!`;
  titleEl.className = 'game-result-title';
  const button = document.createElement('button');
  button.textContent = 'Return to Home';
  button.className = 'game-result-button';
  button.addEventListener('click', () => {
    window.location.reload();
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
 */
function checkExtraLifeCollision(world, tileSize = 64) {
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
        // Increase player's lives by +1
        player.lives = (player.lives ?? 0) + 1;

        // Remove the extra-life-drop from DOM
        if (drop.parentNode) {
          drop.parentNode.removeChild(drop);
        }
        console.log(`[Extra Life] Player ${player.id} picked up an extra life! Lives: ${player.lives}`);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2hhdC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9tb3ZlbWVudFN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvcmVuZGVyU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvd29ybGQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2dhbWUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9sb2JieS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yZWdpc3Rlci5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3NvdW5kLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCBwcm9wcywgLi4uY2hpbGRyZW4pIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gdHlwZSh7IC4uLihwcm9wcyB8fCB7fSksIGNoaWxkcmVuIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcyB8fCB7fSkge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJvblwiKSAmJiB0eXBlb2YgcHJvcHNba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBrZXkuc2xpY2UoMikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGUuc2V0QXR0cmlidXRlKGtleSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmbGF0Q2hpbGRyZW4gPSBjaGlsZHJlbi5mbGF0KEluZmluaXR5KTtcbiAgICBlbGUuYXBwZW5kKC4uLmZsYXRDaGlsZHJlbi5maWx0ZXIoY2hpbGQgPT4gY2hpbGQgIT09IG51bGwgJiYgY2hpbGQgIT09IHVuZGVmaW5lZCAmJiBjaGlsZCAhPT0gZmFsc2UpKTtcblxuICAgIHJldHVybiBlbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgY29udGFpbmVyLnJlcGxhY2VDaGlsZHJlbihlbGVtZW50KTtcbn1cbiIsImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCIuL3JvdXRlci5qc1wiO1xuXG5sZXQgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7IiwiY29uc3QgZWZmZWN0U3RhY2sgPSBbXTtcbmxldCBhY3RpdmVFZmZlY3QgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2lnbmFsKGluaXRpYWxWYWx1ZSkge1xuICAgbGV0IHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgY29uc3QgZWZmZWN0cyA9IG5ldyBTZXQoKTtcblxuICAgY29uc3QgUmVhZCA9ICgpID0+IHtcbiAgICAgIGlmIChhY3RpdmVFZmZlY3QpIHtcbiAgICAgICAgIGVmZmVjdHMuYWRkKGFjdGl2ZUVmZmVjdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICB9XG5cbiAgIGNvbnN0IFdyaXRlID0gKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgIGxldCBmbiA9IG5ld1ZhbHVlO1xuICAgICAgICAgdmFsdWUgPSBmbih2YWx1ZSk7XG4gICAgICB9IFxuICAgICAgZWxzZSB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgZWZmZWN0cy5mb3JFYWNoKGVmZmVjdCA9PiBlZmZlY3QoKSk7XG4gICB9XG5cbiAgIHJldHVybiBbUmVhZCwgV3JpdGVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWZmZWN0KGVmZmVjdCkge1xuICAgZWZmZWN0U3RhY2sucHVzaChlZmZlY3QpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0O1xuICAgZWZmZWN0KCk7XG4gICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdFN0YWNrW2VmZmVjdFN0YWNrLmxlbmd0aCAtIDFdIHx8IG51bGw7XG59XG4iLCJleHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgICAjUm91dGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAjRmlyc3RSZXNvbHZlID0gZmFsc2U7XG5cbiAgICBvbihwYXRoLCBoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuI1JvdXRlc1twYXRoXSA9IGhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBcbiAgICBuYXZpZ2F0ZShwYXRoLCB7IGhpc3RvcnkgPSBcInB1c2hcIiB9ID0ge30pIHtcbiAgICAgICAgcGF0aCA9IHBhdGguc3RhcnRzV2l0aChcIi9cIikgPyBwYXRoIDogXCIvXCIgKyBwYXRoO1xuICAgICAgICByZXR1cm4gbmF2aWdhdGlvbi5uYXZpZ2F0ZShwYXRoLCB7IGhpc3RvcnkgfSk7XG4gICAgfVxuICAgIFxuICAgIHJlc29sdmUocGF0aCA9IGxvY2F0aW9uLnBhdGhuYW1lKSB7XG4gICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3BhdGhdO1xuXG4gICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZuKHsgdXJsOiBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBsaXN0ZW4ob25FcnJvcjQwNCkge1xuICAgICAgICBuYXZpZ2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJuYXZpZ2F0ZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoZXZlbnQuZGVzdGluYXRpb24udXJsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXZlbnQuaW50ZXJjZXB0KHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybC5wYXRobmFtZSwgdGhpcy4jUm91dGVzKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1t1cmwucGF0aG5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yNDA0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm4oeyB1cmwgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdGhpcy4jRmlyc3RSZXNvbHZlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHRoaXMuI0ZpcnN0UmVzb2x2ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHJlbmRlciB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrXCI7XG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFN0YXRlcyB9IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSBhcyBzZXRIdWRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBTb3VuZCBmcm9tIFwiLi4vdXRpbHMvc291bmRcIjtcbmltcG9ydCB7IHNldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5pbXBvcnQgeyBHYW1lRW5naW5lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7IFxuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChgd3M6Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZX06NTAwMGApO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5sZXQgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwicm9vbV91cGRhdGVcIjpcbiAgICAgICAgY2FzZSBcImxvYmJ5X3RpbWVyXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuICAgICAgICAgICAgaWYgKCFyb290LnF1ZXJ5U2VsZWN0b3IoXCIuY29uYXRpbmVyLWxvYmJ5XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKDxMb2JieSAvPiwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWQsXG4gICAgICAgICAgICAgICAgcGxheWVyc0NvdW50OiBtZXNzYWdlLnBsYXllcnNDb3VudCxcbiAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogbWVzc2FnZS5zZWNvbmRzTGVmdCxcbiAgICAgICAgICAgICAgICB0ZXh0OiBtZXNzYWdlLnRleHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJnYW1lX3N0YXJ0ZWRcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJnYW1lLXBhZ2VcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVuZGVyKDxHYW1lIGdyaWQ9e21lc3NhZ2UuZ3JpZH0gLz4sIHJvb3QpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsUGxheWVyID0gKG1lc3NhZ2UucGxheWVycyB8fCBbXSkuZmluZChwbGF5ZXIgPT4gcGxheWVyLmlkID09PSBtZXNzYWdlLnlvdXJQbGF5ZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciAmJiBsb2NhbFBsYXllci5uaWNrbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SHVkUGxheWVyTmFtZShsb2NhbFBsYXllci5uaWNrbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmdpbmUgPSBuZXcgR2FtZUVuZ2luZShnYW1lQ29udGFpbmVyLCBtZXNzYWdlLmdyaWQsIHdzcyk7XG4gICAgICAgICAgICAgICAgICAgIGVuZ2luZS5pbml0KG1lc3NhZ2UueW91clBsYXllcklkLCBtZXNzYWdlLnBsYXllcnMgfHwgW10pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBlbmdpbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdhbWUgY29udGFpbmVyIHdhcyBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcInJvb21fYWxvbmVcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgIHJlbmRlcig8TWVudSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2ICxtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3JcIiwgZXJyKTtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NlZFwiKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB3c3M7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IHdzcyBmcm9tIFwiLi4vYXBwL2FwcFwiO1xuXG5jb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IGNyZWF0ZVNpZ25hbChbXSk7XG5leHBvcnQgeyBzZXRNZXNzYWdlcyB9O1xuXG5mdW5jdGlvbiBDaGF0UGxheWVycygpIHtcbiAgICBjb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IDxkaXYgY2xhc3M9XCJtZXNzYWdlc1wiPjwvZGl2PjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZ3MgPSBtZXNzYWdlcygpO1xuICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGZvciAobGV0IG1zZyBvZiBtc2dzKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBwLnRleHRDb250ZW50ID0gbXNnO1xuICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXNDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5yZW1vdmVDaGlsZChtZXNzYWdlc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgbXNncy51bnNoaWZ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZm9ybURhdGEuZ2V0KFwibWVzc2FnZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJjaGF0X21lc3NhZ2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH0pKTtcbiAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdFwiIG9uU3VibWl0PXticm9hZGNhc3RNZXNzYWdlfT5cbiAgICAgICAgICAgIHttZXNzYWdlc0NvbnRhaW5lcn1cbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJ0eXBlIHRvIHRoZSBvdGhlciBwbGF5ZXJzIC4uLlwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVyczsiLCIvLyAvc3JjL2Vjcy9jb21wb25lbnRzLmpzXG5cbmV4cG9ydCBjb25zdCBQb3NpdGlvbkNvbXBvbmVudCA9IChneCwgZ3ksIHRpbGVTaXplID0gNjQpID0+ICh7XG4gICAgZ3JpZFg6IGd4LFxuICAgIGdyaWRZOiBneSxcbiAgICB4OiBneCAqIHRpbGVTaXplLFxuICAgIHk6IGd5ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRZOiBneSAqIHRpbGVTaXplXG59KTtcblxuZXhwb3J0IGNvbnN0IFZlbG9jaXR5Q29tcG9uZW50ID0gKGJhc2VTcGVlZCA9IDIuNSkgPT4gKHtcbiAgICBiYXNlU3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBzcGVlZDogYmFzZVNwZWVkLFxuICAgIGlzTW92aW5nOiBmYWxzZSxcbiAgICBkaXJlY3Rpb246ICdkb3duJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBJbnB1dENvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgaW5wdXRRdWV1ZTogW11cbn0pO1xuXG5leHBvcnQgY29uc3QgUmVuZGVyYWJsZUNvbXBvbmVudCA9IChlbCwgZnJhbWVXaWR0aCA9IDY0LCBmcmFtZUhlaWdodCA9IDY0LCB0b3RhbEZyYW1lcyA9IDQsIGZwcyA9IDEyKSA9PiAoe1xuICAgIGVsOiBlbCxcbiAgICBmcmFtZVdpZHRoOiBmcmFtZVdpZHRoLFxuICAgIGZyYW1lSGVpZ2h0OiBmcmFtZUhlaWdodCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IHRvdGFsRnJhbWVzLFxuICAgIHJ1bkZyYW1lczogNCxcbiAgICBpZGxlRnJhbWVzOiAyLFxuICAgIGZwczogZnBzLFxuICAgIGlkbGVGcHM6IDQsXG4gICAgbGFzdEZyYW1lVGltZTogMCxcbiAgICByb3c6IDAsXG4gICAgc3RhdGU6ICdJRExFJyxcbiAgICBsYXN0U3RhdGU6ICdJRExFJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXJDb21wb25lbnQgPSAoaWQsIGNoYXJUeXBlLCBpc0xvY2FsID0gZmFsc2UpID0+ICh7XG4gICAgaWQ6IGlkLFxuICAgIGNoYXJUeXBlOiBjaGFyVHlwZSxcbiAgICBpc0xvY2FsOiBpc0xvY2FsXG59KTtcblxuZXhwb3J0IGNvbnN0IEJvbWJDb21wb25lbnQgPSAob3duZXJJZCwgdGltZXIgPSAyMDAwLCByYW5nZSA9IDQpID0+ICh7XG4gICAgb3duZXJJZDogb3duZXJJZCxcbiAgICB0aW1lcjogdGltZXIsXG4gICAgcmFuZ2U6IHJhbmdlLFxuICAgIGV4cGxvZGVkOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBFeHBsb3Npb25Db21wb25lbnQgPSAoZHVyYXRpb24gPSA1MDApID0+ICh7XG4gICAgZHVyYXRpb246IGR1cmF0aW9uXG59KTtcblxuZXhwb3J0IGNvbnN0IFBvd2VyVXBDb21wb25lbnQgPSAodHlwZSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlLCBcbiAgICBwaWNrZWRVcDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgQmVoYXZpb3JDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGdob3N0TW9kZTogZmFsc2UsXG4gICAgdGhyb3dhYmxlOiBmYWxzZSxcbiAgICBkZXRvbmF0b3I6IGZhbHNlLFxuICAgIGZhc3RTaG9lc0xldmVsOiAxLFxuICAgIGJvbWJzOiB7XG4gICAgICAgIG1heDogMSxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgcmFuZ2U6IDJcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC5qcyc7XG5pbXBvcnQge1xuICAgIFBvc2l0aW9uQ29tcG9uZW50LFxuICAgIFZlbG9jaXR5Q29tcG9uZW50LFxuICAgIElucHV0Q29tcG9uZW50LFxuICAgIFJlbmRlcmFibGVDb21wb25lbnQsXG4gICAgUGxheWVyQ29tcG9uZW50LFxuICAgIEJvbWJDb21wb25lbnRcbn0gZnJvbSAnLi9jb21wb25lbnRzLmpzJztcblxuaW1wb3J0IHsgbW92ZW1lbnRTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyc7XG5pbXBvcnQgeyBib21iU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgZGFtYWdlU3lzdGVtLCBjaGVja0V4dHJhTGlmZUNvbGxpc2lvbiwgY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyB9IGZyb20gJy4vc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcG93ZXJVcFN5c3RlbSwgc3Bhd25Qb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMnO1xuaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQgfSBmcm9tICcuLi9wYWdlcy9nYW1lJztcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzQ29udGFpbmVyLCBtYXBEYXRhLCBzb2NrZXQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjYW52YXNDb250YWluZXI7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IG1hcERhdGE7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XG4gICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gMDtcbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgaW5pdChsb2NhbFBsYXllcklkLCBhbGxQbGF5ZXJzKSB7XG4gICAgICAgIHRoaXMudG90YWxQbGF5ZXJzID0gYWxsUGxheWVycy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkID0gU3RyaW5nKGxvY2FsUGxheWVySWQpO1xuXG4gICAgICAgIGFsbFBsYXllcnMuZm9yRWFjaChwRGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IFN0cmluZyhwRGF0YS5pZCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IHBEYXRhLmNvbG9yIHx8IFwid2hpdGVcIjtcblxuICAgICAgICAgICAgcGxheWVyRGl2LmNsYXNzTmFtZSA9IGBwbGF5ZXIgcGxheWVyLSR7Y29sb3J9YDtcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuekluZGV4ID0gJzEwJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS53aWxsQ2hhbmdlID0gJ3RyYW5zZm9ybSc7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJEaXYpO1xuXG4gICAgICAgICAgICBjb25zdCBzeCA9IHBEYXRhLnggfHwgMTtcbiAgICAgICAgICAgIGNvbnN0IHN5ID0gcERhdGEueSB8fCAxO1xuXG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicsIFBvc2l0aW9uQ29tcG9uZW50KHN4LCBzeSwgVElMRV9TSVpFKSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScsIFZlbG9jaXR5Q29tcG9uZW50KDIuNSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScsIFJlbmRlcmFibGVDb21wb25lbnQocGxheWVyRGl2LCA2NCwgNjQsIDQsIDEyKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaXNMb2NhbCA9IHBsYXllcklkID09PSBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZDtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckNvbXAgPSBQbGF5ZXJDb21wb25lbnQocGxheWVySWQsIGNvbG9yLCBpc0xvY2FsKTtcbiAgICAgICAgICAgIHBsYXllckNvbXAubGl2ZXMgPSAzO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5tYXhCb21icyA9IDE7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmJvbWJSYW5nZSA9IDQ7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInLCBwbGF5ZXJDb21wKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMuc2V0KHBsYXllcklkLCBwbGF5ZXJFbnRpdHkpO1xuXG4gICAgICAgICAgICBpZiAoaXNMb2NhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBwbGF5ZXJFbnRpdHk7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnLCBJbnB1dENvbXBvbmVudCgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHBsYXllckVudGl0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbR2FtZUVuZ2luZV0gTG9jYWwgcGxheWVyIHdhcyBub3QgZm91bmRcIiwge1xuICAgICAgICAgICAgICAgIGxvY2FsUGxheWVySWQsXG4gICAgICAgICAgICAgICAgcGxheWVyczogYWxsUGxheWVycy5tYXAocGxheWVyID0+IHBsYXllci5pZCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTeXN0ZW1zKCk7XG5cbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChub3cpID0+IHRoaXMuZ2FtZUxvb3Aobm93KSk7XG4gICAgfVxuXG4gICAgc2V0dXBJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgaWYgKCFpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGdldEtleURpcmVjdGlvbiA9IChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1VwJyB8fCBrZXkgPT09ICd3JyB8fCBrZXkgPT09ICdaJyB8fCBrZXkgPT09ICd6JykgcmV0dXJuICd1cCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dEb3duJyB8fCBrZXkgPT09ICdzJyB8fCBrZXkgPT09ICdTJykgcmV0dXJuICdkb3duJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0xlZnQnIHx8IGtleSA9PT0gJ2EnIHx8IGtleSA9PT0gJ1EnIHx8IGtleSA9PT0gJ3EnKSByZXR1cm4gJ2xlZnQnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93UmlnaHQnIHx8IGtleSA9PT0gJ2QnIHx8IGtleSA9PT0gJ0QnKSByZXR1cm4gJ3JpZ2h0JztcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5pbnB1dFF1ZXVlLmluY2x1ZGVzKGRpcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZS51bnNoaWZ0KGRpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICcgJyB8fCBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wQm9tYigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleVVwID0gKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZSA9IGlucHV0LmlucHV0UXVldWUuZmlsdGVyKGQgPT4gZCAhPT0gZGlyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZHJvcEJvbWIoKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcblxuICAgICAgICBjb25zdCBjdXJyZW50Qm9tYnMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuZmlsdGVyKGJFbnRpdHkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGJFbnRpdHksICdCb21iJykub3duZXJJZCA9PT0gcGxheWVyLmlkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY3VycmVudEJvbWJzLmxlbmd0aCA+PSBwbGF5ZXIubWF4Qm9tYnMpIHJldHVybjtcblxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVCb21iKHBsYXllci5pZCwgcG9zLmdyaWRYLCBwb3MuZ3JpZFksIHBsYXllci5ib21iUmFuZ2UpO1xuICAgICAgICBpZiAoIWNyZWF0ZWQpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdEUk9QX0JPTUInLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHsgaWQ6IHBsYXllci5pZCwgeDogcG9zLmdyaWRYLCB5OiBwb3MuZ3JpZFksIHJhbmdlOiBwbGF5ZXIuYm9tYlJhbmdlIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUJvbWIob3duZXJJZCwgZ3JpZFgsIGdyaWRZLCByYW5nZSkge1xuICAgICAgICBjb25zdCBleGlzdHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuc29tZShlbnRpdHkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IGJvbWIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCb21iJyk7XG4gICAgICAgICAgICByZXR1cm4gYm9tYi5vd25lcklkID09PSBvd25lcklkICYmIHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGV4aXN0cykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGJvbWJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICBjb25zdCBib21iRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGJvbWJEaXYuY2xhc3NOYW1lID0gJ2JvbWInO1xuICAgICAgICBib21iRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnRvcCA9IGAke2dyaWRZICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS56SW5kZXggPSAnNic7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGJvbWJEaXYpO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFgsIGdyaWRZIH0pO1xuXG4gICAgICAgIGNvbnN0IGJvbWJDb21wID0gQm9tYkNvbXBvbmVudChvd25lcklkLCAyMDAwLCByYW5nZSk7XG4gICAgICAgIGJvbWJDb21wLmVsID0gYm9tYkRpdjtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInLCBib21iQ29tcCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZU1vdmUocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltoYW5kbGVSZW1vdGVNb3ZlXSBJbnZhbGlkIHBheWxvYWQ6XCIsIHBheWxvYWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gRW50aXR5IG5vdCBmb3VuZCBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH0uIEF2YWlsYWJsZSBwbGF5ZXJzOmAsIEFycmF5LmZyb20odGhpcy5wbGF5ZXJFbnRpdGllcy5rZXlzKCkpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gSWdub3JpbmcgbG9jYWwgcGxheWVyIHVwZGF0ZSBmb3IgJHtwYXlsb2FkLmlkfWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghcG9zIHx8ICF2ZWwgfHwgIXJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIE1pc3NpbmcgY29tcG9uZW50cyBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH06YCwgeyBwb3M6ICEhcG9zLCB2ZWw6ICEhdmVsLCByZW5kZXJhYmxlOiAhIXJlbmRlcmFibGUgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW2hhbmRsZVJlbW90ZU1vdmVdIFVwZGF0aW5nIHBsYXllciAke3BheWxvYWQuaWR9IHRvICgke3BheWxvYWQuZ3JpZFh9LCAke3BheWxvYWQuZ3JpZFl9KWApO1xuICAgICAgICB2ZWwuZGlyZWN0aW9uID0gcGF5bG9hZC5kaXJlY3Rpb24gfHwgdmVsLmRpcmVjdGlvbjtcbiAgICAgICAgdmVsLmlzTW92aW5nID0gcGF5bG9hZC5pc01vdmluZztcbiAgICAgICAgcG9zLmdyaWRYID0gcGF5bG9hZC5ncmlkWDtcbiAgICAgICAgcG9zLmdyaWRZID0gcGF5bG9hZC5ncmlkWTtcbiAgICAgICAgcG9zLnRhcmdldFggPSBwYXlsb2FkLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcGF5bG9hZC55O1xuICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gcGF5bG9hZC5zdGF0ZSB8fCAocGF5bG9hZC5pc01vdmluZyA/ICdSVU4nIDogJ0lETEUnKTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVCb21iKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3JlYXRlQm9tYihwYXlsb2FkLmlkLCBwYXlsb2FkLngsIHBheWxvYWQueSwgcGF5bG9hZC5yYW5nZSB8fCA0KTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8IHBheWxvYWQueCA9PT0gdW5kZWZpbmVkIHx8IHBheWxvYWQueSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCB8fCBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHJldHVybjtcblxuICAgICAgICB0aGlzLmFwcGx5UG93ZXJVcChlbnRpdHksIHBheWxvYWQudHlwZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlUG93ZXJVcEF0KGdyaWRYLCBncmlkWSkge1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7Z3JpZFh9LCR7Z3JpZFl9YCk7XG4gICAgICAgIGNvbnN0IHBvd2VyVXBzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcG93ZXJVcCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghcG9zIHx8ICFwb3dlclVwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWSkge1xuICAgICAgICAgICAgICAgIHBvd2VyVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBvd2VyVXAuZWwgJiYgcG93ZXJVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvd2VyVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3dlclVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmRlc3Ryb3lFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseVBvd2VyVXAoZW50aXR5LCB0eXBlKSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICB2ZWxvY2l0eS5zcGVlZCA9IE1hdGgubWluKHZlbG9jaXR5LnNwZWVkICsgMSwgOCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0ZMQU1FJykge1xuICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWdpc3RlclN5c3RlbXMoKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZU1hcENlbGwgPSAoeCwgeSwgbmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXBEYXRhW3ldKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubWFwRGF0YVt5XVt4XSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWApO1xuICAgICAgICAgICAgaWYgKCF0aWxlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRpbGUuY2xhc3NOYW1lID0gJ3RpbGUgdGlsZS1mbG9vcic7XG4gICAgICAgICAgICB0aWxlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIpJztcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkZXN0cm95Qm94Q2FsbGJhY2sgPSAoeCwgeSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xhaW1lZFBvd2VyVXBzLmhhcyhgJHt4fSwke3l9YCkpIHJldHVybjtcbiAgICAgICAgICAgIHNwYXduUG93ZXJVcCh0aGlzLndvcmxkLCB4LCB5LCB0aGlzLmNvbnRhaW5lciwgVElMRV9TSVpFKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBsYXllckh1cnQgPSAoZW50aXR5LCBpZCwgcmVtYWluaW5nTGl2ZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICBzZXRMaXZlcyhyZW1haW5pbmdMaXZlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25Qb3dlclVwUGlja2VkID0gKGlkLCB0eXBlLCB4LCB5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7eH0sJHt5fWApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAocGxheWVyICYmIHBsYXllci5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPV0VSVVBfUElDS0VEJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZCwgdHlwZSwgeCwgeSB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYnJvYWRjYXN0TW92ZW1lbnQgPSAoZW50aXR5LCB4LCB5LCBncmlkWCwgZ3JpZFksIGRpcmVjdGlvbiwgaXNNb3ZpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXRoaXMuc29ja2V0IHx8IHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdNT1ZFX1NUQVRFJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBwbGF5ZXIuaWQsXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBncmlkWSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICBpc01vdmluZyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IGlzTW92aW5nID8gJ1JVTicgOiAnSURMRScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBtb3ZlbWVudFN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gYm9tYlN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBkYW1hZ2VTeXN0ZW0odywgbm93LCBvblBsYXllckh1cnQsIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcG93ZXJVcFN5c3RlbSh3LCBvblBvd2VyVXBQaWNrZWQpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHJlbmRlclN5c3RlbSh3LCBkdCwgbm93LCBBTklNQVRJT05fUk9XUykpO1xuICAgIH1cblxuICAgIGdhbWVMb29wKG5vdykge1xuICAgICAgICBpZiAoIXRoaXMucnVubmluZykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGR0ID0gbm93IC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IG5vdztcbiAgICAgICAgdGhpcy53b3JsZC51cGRhdGUoZHQsIG5vdyk7XG4gICAgICAgIFxuICAgICAgICAvLyBDaGVjayBmb3IgZXh0cmEgbGlmZSBjb2xsaXNpb24gd2l0aCBwbGF5ZXJzXG4gICAgICAgIGNoZWNrRXh0cmFMaWZlQ29sbGlzaW9uKHRoaXMud29ybGQsIFRJTEVfU0laRSk7XG4gICAgICAgIFxuICAgICAgICAvLyBDaGVjayBmb3IgZ2FtZSBlbmQgY29uZGl0aW9ucyAod2luL2xvc3MpXG4gICAgICAgIGNoZWNrR2FtZUVuZENvbmRpdGlvbnModGhpcy53b3JsZCwgdGhpcy5sb2NhbFBsYXllckVudGl0eSwgdGhpcy5wbGF5ZXJFbnRpdGllcywgdGhpcy50b3RhbFBsYXllcnMpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobmV4dE5vdykgPT4gdGhpcy5nYW1lTG9vcChuZXh0Tm93KSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUh1ZFN0YXRzKGVudGl0eSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgICAgIHNldExpdmVzKHBsYXllci5saXZlcyA/PyAzKTtcbiAgICAgICAgc2V0UmFuZ2UocGxheWVyLmJvbWJSYW5nZSB8fCA0KTtcbiAgICAgICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYm9tYlN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3QgYm9tYnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgYm9tYkVudGl0eSBvZiBib21icykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IGJvbWIgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgXG4gICAgICAgIGJvbWIudGltZXIgLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoYm9tYi50aW1lciA8PSAwICYmICFib21iLmV4cGxvZGVkKSB7XG4gICAgICAgICAgICBib21iLmV4cGxvZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgYWZmZWN0ZWRDZWxscyA9IGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBib21iLnJhbmdlLCBtYXBEYXRhKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWZmZWN0ZWRDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGV4cERpdi5jbGFzc05hbWUgPSAnZXhwbG9zaW9uJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Y2VsbC54ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS50b3AgPSBgJHtjZWxsLnkgKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnpJbmRleCA9ICc3JztcblxuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicsIHsgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYOiBjZWxsLngsIFxuICAgICAgICAgICAgICAgICAgICBncmlkWTogY2VsbC55LCBcbiAgICAgICAgICAgICAgICAgICAgeDogY2VsbC54ICogdGlsZVNpemUsIFxuICAgICAgICAgICAgICAgICAgICB5OiBjZWxsLnkgKiB0aWxlU2l6ZSBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJywgeyBkdXJhdGlvbjogNTAwLCBlbDogZXhwRGl2IH0pO1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChleHBEaXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhW2NlbGwueV0gJiYgbWFwRGF0YVtjZWxsLnldW2NlbGwueF0gPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTWFwQ2VsbChjZWxsLngsIGNlbGwueSwgMik7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzdHJveUJveENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95Qm94Q2FsbGJhY2soY2VsbC54LCBjZWxsLnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChib21iLmVsICYmIGJvbWIuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChib21iLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoYm9tYkVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgIGNvbnN0IGV4cCA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nKTtcbiAgICAgICAgZXhwLmR1cmF0aW9uIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGV4cC5kdXJhdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICBpZiAoZXhwLmVsICYmIGV4cC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZXhwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXhwLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoZXhwRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMoYngsIGJ5LCByYW5nZSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGxzID0gW3sgeDogYngsIHk6IGJ5IH1dO1xuICAgIGNvbnN0IGRpcmVjdGlvbnMgPSBbXG4gICAgICAgIHsgeDogMCwgeTogLTEgfSxcbiAgICAgICAgeyB4OiAwLCB5OiAxIH0sXG4gICAgICAgIHsgeDogLTEsIHk6IDAgfSxcbiAgICAgICAgeyB4OiAxLCB5OiAwIH1cbiAgICBdO1xuICAgIFxuICAgIGNvbnN0IHN0ZXBzID0gcmFuZ2UgLSAxOyBcbiAgICBcbiAgICBkaXJlY3Rpb25zLmZvckVhY2goZGlyID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdHggPSBieCArIChkaXIueCAqIGkpO1xuICAgICAgICAgICAgY29uc3QgdHkgPSBieSArIChkaXIueSAqIGkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW1hcERhdGFbdHldIHx8IG1hcERhdGFbdHldW3R4XSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY2VsbFR5cGUgPSBtYXBEYXRhW3R5XVt0eF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjZWxscy5wdXNoKHsgeDogdHgsIHk6IHR5IH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBjZWxscztcbn1cbiIsImltcG9ydCB7IGdldFBsYXllck5hbWUgfSBmcm9tICcuLi9nYW1lLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgTG9zcyBwb3AtdXAgbW9kYWwgZm9yIHRoZSBlbGltaW5hdGVkIHBsYXllci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGF5ZXJOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGVsaW1pbmF0ZWQgcGxheWVyXG4gKi9cbmZ1bmN0aW9uIHNob3dMb3NzUG9wdXAocGxheWVyTmFtZSkge1xuICAgIC8vIENoZWNrIGlmIHBvcHVwIGFscmVhZHkgZXhpc3RzIHRvIGF2b2lkIGR1cGxpY2F0ZXNcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtcmVzdWx0LXBvcHVwJykpIHJldHVybjtcbiAgICBcbiAgICAvLyBDcmVhdGUgb3ZlcmxheVxuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdmVybGF5LmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1wb3B1cCBsb3NzJztcbiAgICBcbiAgICAvLyBDcmVhdGUgcG9wdXAgY29udGVudFxuICAgIGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcG9wdXAuY2xhc3NOYW1lID0gJ2dhbWUtcmVzdWx0LXBvcHVwLWNvbnRlbnQnO1xuICAgIFxuICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgIHRpdGxlRWwudGV4dENvbnRlbnQgPSAnTE9TRVIhIFdhY2ggbGEzYiBiIHJqbGlrPyc7XG4gICAgdGl0bGVFbC5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtdGl0bGUnO1xuICAgIFxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9ICdSZXR1cm4gdG8gSG9tZSc7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1idXR0b24nO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuICAgIFxuICAgIHBvcHVwLmFwcGVuZENoaWxkKHRpdGxlRWwpO1xuICAgIHBvcHVwLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgb3ZlcmxheS5hcHBlbmRDaGlsZChwb3B1cCk7XG4gICAgXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgV2luIHBvcC11cCBtb2RhbCBmb3IgdGhlIHZpY3RvcmlvdXMgcGxheWVyLlxuICogQHBhcmFtIHtzdHJpbmd9IHBsYXllck5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgd2lubmluZyBwbGF5ZXJcbiAqL1xuZnVuY3Rpb24gc2hvd1dpblBvcHVwKHBsYXllck5hbWUpIHtcbiAgICAvLyBDaGVjayBpZiBwb3B1cCBhbHJlYWR5IGV4aXN0cyB0byBhdm9pZCBkdXBsaWNhdGVzXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLXJlc3VsdC1wb3B1cCcpKSByZXR1cm47XG4gICAgXG4gICAgLy8gQ3JlYXRlIG92ZXJsYXlcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3ZlcmxheS5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtcG9wdXAgd2luJztcbiAgICBcbiAgICAvLyBDcmVhdGUgcG9wdXAgY29udGVudFxuICAgIGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcG9wdXAuY2xhc3NOYW1lID0gJ2dhbWUtcmVzdWx0LXBvcHVwLWNvbnRlbnQnO1xuICAgIFxuICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgIHRpdGxlRWwudGV4dENvbnRlbnQgPSBgJHtwbGF5ZXJOYW1lfSBXb24hYDtcbiAgICB0aXRsZUVsLmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC10aXRsZSc7XG4gICAgXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gJ1JldHVybiB0byBIb21lJztcbiAgICBidXR0b24uY2xhc3NOYW1lID0gJ2dhbWUtcmVzdWx0LWJ1dHRvbic7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG4gICAgXG4gICAgcG9wdXAuYXBwZW5kQ2hpbGQodGl0bGVFbCk7XG4gICAgcG9wdXAuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBvdmVybGF5LmFwcGVuZENoaWxkKHBvcHVwKTtcbiAgICBcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgcGxheWVyIGRlYXRoIHRyYW5zaXRpb24gd2hlbiBsaXZlcyByZWFjaCAwLlxuICogUmVtb3ZlcyB0aGUgcGxheWVyJ3MgRE9NIGVsZW1lbnQgYW5kIHNwYXducyBhbiBleHRyYS1saWZlIGRyb3AgYXQgdGhlIGRlYXRoIGxvY2F0aW9uLlxuICogXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gcGxheWVyRW50aXR5IC0gVGhlIGVudGl0eSBJRCBvZiB0aGUgZHlpbmcgcGxheWVyXG4gKiBAcGFyYW0ge251bWJlcn0gdGlsZVNpemUgLSBUaGUgc2l6ZSBvZiBlYWNoIGdyaWQgdGlsZSAoZGVmYXVsdDogNjQpXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLSBUaGUgZ2FtZSBjb250YWluZXIgZWxlbWVudFxuICovXG5mdW5jdGlvbiBoYW5kbGVQbGF5ZXJEZWF0aCh3b3JsZCwgcGxheWVyRW50aXR5LCB0aWxlU2l6ZSA9IDY0LCBjb250YWluZXIgPSBudWxsKSB7XG4gICAgLy8gR2V0IHRoZSBwbGF5ZXIncyBjb21wb25lbnRzXG4gICAgY29uc3QgcG9zaXRpb24gPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgXG4gICAgaWYgKCFwb3NpdGlvbiB8fCAhcmVuZGVyYWJsZSB8fCAhcGxheWVyKSByZXR1cm47XG4gICAgXG4gICAgLy8gU3RvcmUgdGhlIGdyaWQgY29vcmRpbmF0ZXMgd2hlcmUgdGhlIHBsYXllciBkaWVkXG4gICAgY29uc3QgZGVhdGhHcmlkWCA9IE1hdGguZmxvb3IoKHBvc2l0aW9uLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgIGNvbnN0IGRlYXRoR3JpZFkgPSBNYXRoLmZsb29yKChwb3NpdGlvbi55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICBcbiAgICAvLyAxLiBSZW1vdmUgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGVudGlyZWx5XG4gICAgaWYgKHJlbmRlcmFibGUuZWwgJiYgcmVuZGVyYWJsZS5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChyZW5kZXJhYmxlLmVsKTtcbiAgICB9XG4gICAgXG4gICAgLy8gMi4gRGVzdHJveSB0aGUgcGxheWVyIGVudGl0eSBmcm9tIHRoZSB3b3JsZCAocmVtb3ZlcyBhbGwgY29tcG9uZW50cylcbiAgICB3b3JsZC5kZXN0cm95RW50aXR5KHBsYXllckVudGl0eSk7XG4gICAgXG4gICAgLy8gMy4gQ3JlYXRlIGEgZGl2IHdpdGggaGVhcnQgZW1vamkgYXQgdGhlIGV4YWN0IGRlYXRoIGxvY2F0aW9uXG4gICAgY29uc3QgaGVhcnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFydERpdi5jbGFzc05hbWUgPSAnZXh0cmEtbGlmZS1kcm9wJztcbiAgICBoZWFydERpdi50ZXh0Q29udGVudCA9ICfinaTvuI8nO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBoZWFydERpdi5zdHlsZS5sZWZ0ID0gYCR7ZGVhdGhHcmlkWCAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS50b3AgPSBgJHtkZWF0aEdyaWRZICogdGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmFsaWduSXRlbXMgPSAnY2VudGVyJztcbiAgICBoZWFydERpdi5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInO1xuICAgIGhlYXJ0RGl2LnN0eWxlLmZvbnRTaXplID0gJzMycHgnO1xuICAgIGhlYXJ0RGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICBoZWFydERpdi5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIFxuICAgIC8vIEFwcGVuZCB0byB0aGUgZ2FtZSBjb250YWluZXJcbiAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgIGdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoaGVhcnREaXYpO1xuICAgIH1cbiAgICBcbiAgICBjb25zb2xlLmxvZyhgW1BsYXllciBEZWF0aF0gUGxheWVyICR7cGxheWVyLmlkfSBkaWVkIGF0ICgke2RlYXRoR3JpZFh9LCAke2RlYXRoR3JpZFl9KS4gSGVhcnQgZHJvcHBlZC5gKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgZm9yIGNvbGxpc2lvbiBiZXR3ZWVuIHBsYXllcnMgYW5kIGV4dHJhLWxpZmUtZHJvcCBET00gZWxlbWVudHMuXG4gKiBXaGVuIGEgcGxheWVyIGNvbGxpZGVzIHdpdGggYW4gZXh0cmEtbGlmZS1kcm9wLCB0aGV5IGdhaW4gKzEgbGlmZSBhbmQgdGhlIGRyb3AgaXMgcmVtb3ZlZC5cbiAqIE9ubHkgdGhlIGZpcnN0IHBsYXllciB0byB0b3VjaCBpdCBnZXRzIHRoZSBsaWZlLlxuICogXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gdGlsZVNpemUgLSBUaGUgc2l6ZSBvZiBlYWNoIGdyaWQgdGlsZSAoZGVmYXVsdDogNjQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0V4dHJhTGlmZUNvbGxpc2lvbih3b3JsZCwgdGlsZVNpemUgPSA2NCkge1xuICAgIC8vIEZpbmQgYWxsIGV4dHJhLWxpZmUtZHJvcCBlbGVtZW50cyBpbiB0aGUgRE9NXG4gICAgY29uc3QgZXh0cmFMaWZlRHJvcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZXh0cmEtbGlmZS1kcm9wJyk7XG4gICAgaWYgKGV4dHJhTGlmZURyb3BzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIFxuICAgIC8vIEdldCBhbGwgYWN0aXZlIHBsYXllcnMgd2l0aCBQb3NpdGlvbiBhbmQgUGxheWVyIGNvbXBvbmVudHNcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1BsYXllcicpO1xuICAgIGlmIChwbGF5ZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIFxuICAgIGZvciAoY29uc3QgZHJvcCBvZiBleHRyYUxpZmVEcm9wcykge1xuICAgICAgICAvLyBQYXJzZSB0aGUgZ3JpZCBwb3NpdGlvbiBmcm9tIHRoZSBkcm9wJ3MgQ1NTIGxlZnQvdG9wIHByb3BlcnRpZXNcbiAgICAgICAgY29uc3QgZHJvcExlZnQgPSBwYXJzZUludChkcm9wLnN0eWxlLmxlZnQsIDEwKTtcbiAgICAgICAgY29uc3QgZHJvcFRvcCA9IHBhcnNlSW50KGRyb3Auc3R5bGUudG9wLCAxMCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoaXNOYU4oZHJvcExlZnQpIHx8IGlzTmFOKGRyb3BUb3ApKSBjb250aW51ZTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRyb3BHcmlkWCA9IE1hdGgucm91bmQoZHJvcExlZnQgLyB0aWxlU2l6ZSk7XG4gICAgICAgIGNvbnN0IGRyb3BHcmlkWSA9IE1hdGgucm91bmQoZHJvcFRvcCAvIHRpbGVTaXplKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFwUG9zIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgcGxheWVyJ3MgY3VycmVudCBncmlkIHBvc2l0aW9uXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWCA9IE1hdGguZmxvb3IoKHBQb3MueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWSA9IE1hdGguZmxvb3IoKHBQb3MueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBjb2xsaXNpb24gKHNhbWUgZ3JpZCBjZWxsKVxuICAgICAgICAgICAgaWYgKHBsYXllckdyaWRYID09PSBkcm9wR3JpZFggJiYgcGxheWVyR3JpZFkgPT09IGRyb3BHcmlkWSkge1xuICAgICAgICAgICAgICAgIC8vIEluY3JlYXNlIHBsYXllcidzIGxpdmVzIGJ5ICsxXG4gICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gKHBsYXllci5saXZlcyA/PyAwKSArIDE7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBleHRyYS1saWZlLWRyb3AgZnJvbSBET01cbiAgICAgICAgICAgICAgICBpZiAoZHJvcC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRyb3AucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtFeHRyYSBMaWZlXSBQbGF5ZXIgJHtwbGF5ZXIuaWR9IHBpY2tlZCB1cCBhbiBleHRyYSBsaWZlISBMaXZlczogJHtwbGF5ZXIubGl2ZXN9YCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQnJlYWsgb3V0IG9mIHRoZSBpbm5lciBsb29wIHNpbmNlIHRoaXMgZHJvcCBpcyBub3cgZ29uZVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIENoZWNrcyBmb3IgcGxheWVyIGRlYXRocyBhbmQgZ2FtZSBlbmQgY29uZGl0aW9ucy5cbiAqIFNob3dzIExvc3MgcG9wLXVwIGZvciBlbGltaW5hdGVkIHBsYXllcnMgYW5kIFdpbiBwb3AtdXAgZm9yIHRoZSBsYXN0IHN1cnZpdm9yLlxuICogXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gbG9jYWxQbGF5ZXJFbnRpdHkgLSBUaGUgbG9jYWwgcGxheWVyJ3MgZW50aXR5IElEXG4gKiBAcGFyYW0ge01hcH0gcGxheWVyRW50aXRpZXMgLSBNYXAgb2YgcGxheWVyIElEcyB0byBlbnRpdHkgSURzXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxQbGF5ZXJzIC0gVG90YWwgbnVtYmVyIG9mIHBsYXllcnMgYXQgZ2FtZSBzdGFydFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyh3b3JsZCwgbG9jYWxQbGF5ZXJFbnRpdHksIHBsYXllckVudGl0aWVzLCB0b3RhbFBsYXllcnMpIHtcbiAgICAvLyBDb3VudCBhY3RpdmUgcGxheWVycyAocGxheWVycyB3aXRoIGxpdmVzID4gMClcbiAgICBjb25zdCBhbGxQbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1BsYXllcicpO1xuICAgIGxldCBhY3RpdmVQbGF5ZXJDb3VudCA9IDA7XG4gICAgbGV0IGxhc3RBY3RpdmVQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIGFsbFBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAocGxheWVyICYmIChwbGF5ZXIubGl2ZXMgPz8gMCkgPiAwKSB7XG4gICAgICAgICAgICBhY3RpdmVQbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgbGFzdEFjdGl2ZVBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBHZXQgdGhlIGxvY2FsIHBsYXllcidzIG5hbWUgZm9yIGRpc3BsYXkgaW4gcG9wdXBzXG4gICAgY29uc3QgbG9jYWxQbGF5ZXJOYW1lID0gZ2V0UGxheWVyTmFtZSgpO1xuICAgIFxuICAgIC8vIENoZWNrIGlmIGxvY2FsIHBsYXllciBpcyBlbGltaW5hdGVkXG4gICAgaWYgKGxvY2FsUGxheWVyRW50aXR5ICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsUGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KGxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmIChsb2NhbFBsYXllciAmJiAobG9jYWxQbGF5ZXIubGl2ZXMgPz8gMCkgPD0gMCkge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYWxyZWFkeSBzaG93ZWQgbG9zcyBwb3B1cFxuICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1yZXN1bHQtcG9wdXAnKSkge1xuICAgICAgICAgICAgICAgIHNob3dMb3NzUG9wdXAobG9jYWxQbGF5ZXJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayB3aW4gY29uZGl0aW9uOiBFWEFDVExZIDEgYWN0aXZlIHBsYXllciByZW1haW5zIG9uIHRoZSBib2FyZFxuICAgIGlmIChhY3RpdmVQbGF5ZXJDb3VudCA9PT0gMSAmJiB0b3RhbFBsYXllcnMgPiAxICYmIGxhc3RBY3RpdmVQbGF5ZXJFbnRpdHkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgbGFzdFBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChsYXN0QWN0aXZlUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmIChsYXN0UGxheWVyKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGlzIHRoZSBsb2NhbCBwbGF5ZXJcbiAgICAgICAgICAgIGlmIChsb2NhbFBsYXllckVudGl0eSAhPT0gbnVsbCAmJiBsYXN0QWN0aXZlUGxheWVyRW50aXR5ID09PSBsb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIGlmICghZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtcmVzdWx0LXBvcHVwJykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd1dpblBvcHVwKGxvY2FsUGxheWVyTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGFtYWdlU3lzdGVtKHdvcmxkLCBub3csIG9uUGxheWVySHVydCwgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUGxheWVyJyk7XG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHBsYXllci5pbnZpbmNpYmxlVW50aWwgJiYgcGxheWVyLmludmluY2libGVVbnRpbCA+IG5vdykgY29udGludWU7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgICAgICBjb25zdCBlUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vKEdyaWQtYmFzZWQgY29sbGlzaW9uKVxuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFggPSBNYXRoLmZsb29yKChwUG9zLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFkgPSBNYXRoLmZsb29yKChwUG9zLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuXG4gICAgICAgICAgICBpZiAocGxheWVyR3JpZFggPT09IGVQb3MuZ3JpZFggJiYgcGxheWVyR3JpZFkgPT09IGVQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c0xpdmVzID0gcGxheWVyLmxpdmVzID8/IDM7XG4gICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gTWF0aC5tYXgocHJldmlvdXNMaXZlcyAtIDEsIDApO1xuICAgICAgICAgICAgICAgIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPSBub3cgKyAxNTAwO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBkZWF0aCB3aGVuIGxpdmVzIHJlYWNoIDBcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmxpdmVzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAob25QbGF5ZXJIdXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIG9uUGxheWVySHVydChwbGF5ZXJFbnRpdHksIHBsYXllci5pZCwgcGxheWVyLmxpdmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gbW92ZW1lbnRTeXN0ZW0od29ybGQsIGR0LCBub3csIG1hcERhdGEsIHRpbGVTaXplID0gNDApIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScpO1xuICAgIGNvbnN0IGRlbHRhID0gZHQgLyAxNi42NztcblxuICAgIGNvbnN0IFBMQVlFUl9TSVpFID0gdGlsZVNpemU7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0lucHV0Jyk7XG4gICAgICAgIGNvbnN0IGJlaGF2aW9yID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JlaGF2aW9yJyk7XG5cbiAgICAgICAgaWYgKGJlaGF2aW9yKSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkICsgKGJlaGF2aW9yLmZhc3RTaG9lc0xldmVsIC0gMSkgKiAwLjU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZWwuc3BlZWQgPSB2ZWwuYmFzZVNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3RpdmVJbnB1dCA9IGlucHV0LmlucHV0UXVldWVbMF07XG4gICAgICAgIGxldCBkeCA9IDA7XG4gICAgICAgIGxldCBkeSA9IDA7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUlucHV0ID09PSAndXAnKSB7XG4gICAgICAgICAgICBkeSA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdkb3duJykge1xuICAgICAgICAgICAgZHkgPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdkb3duJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICBkeCA9IC0xO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgZHggPSAxO1xuICAgICAgICAgICAgdmVsLmRpcmVjdGlvbiA9ICdyaWdodCc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNJbnB1dCA9IGR4ICE9PSAwIHx8IGR5ICE9PSAwO1xuXG4gICAgICAgIGlmICghaGFzSW5wdXQpIHtcbiAgICAgICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuICAgICAgICAgICAgdmVsLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdJRExFJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFkgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgY29uc3Qgc25hcFRocmVzaG9sZCA9IDMyO1xuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiBkeCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChwb3MueCwgbmV4dFksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVggPSBNYXRoLmZsb29yKChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WCA9IGN1cnJlbnRUaWxlWCAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZYID0gcG9zLnggLSB0YXJnZXRYO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZYKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeCA9IC1NYXRoLnNpZ24oZGlmZlgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGlzQmxvY2tlZChuZXh0WCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGlsZVkgPSBNYXRoLmZsb29yKChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0WSA9IGN1cnJlbnRUaWxlWSAqIHRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZZID0gcG9zLnkgLSB0YXJnZXRZO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZZKSA8IHNuYXBUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICBkeSA9IC1NYXRoLnNpZ24oZGlmZlkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYQWZ0ZXJTbmFwID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WUFmdGVyU25hcCA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgIWlzQmxvY2tlZChuZXh0WEFmdGVyU25hcCwgcG9zLnksIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy54ID0gbmV4dFhBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgIWlzQmxvY2tlZChwb3MueCwgbmV4dFlBZnRlclNuYXAsIG1hcERhdGEsIHRpbGVTaXplLCBQTEFZRVJfU0laRSkpIHtcbiAgICAgICAgICAgIHBvcy55ID0gbmV4dFlBZnRlclNuYXA7XG4gICAgICAgIH1cblxuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5zdGF0ZSA9ICdSVU4nO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zLmdyaWRYID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy5ncmlkWSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICBwb3MudGFyZ2V0WSA9IHBvcy55O1xuXG4gICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgZW50aXR5LFxuICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWCxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICB2ZWwuaXNNb3ZpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKSB7XG4gICAgY29uc3Qgc3RlcCA9IHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgaWYgKHBvcy54IDwgcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1pbihwb3MueCArIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9IGVsc2UgaWYgKHBvcy54ID4gcG9zLnRhcmdldFgpIHtcbiAgICAgICAgcG9zLnggPSBNYXRoLm1heChwb3MueCAtIHN0ZXAsIHBvcy50YXJnZXRYKTtcbiAgICB9XG5cbiAgICBpZiAocG9zLnkgPCBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWluKHBvcy55ICsgc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH0gZWxzZSBpZiAocG9zLnkgPiBwb3MudGFyZ2V0WSkge1xuICAgICAgICBwb3MueSA9IE1hdGgubWF4KHBvcy55IC0gc3RlcCwgcG9zLnRhcmdldFkpO1xuICAgIH1cblxuICAgIHZlbC5pc01vdmluZyA9XG4gICAgICAgIHBvcy54ICE9PSBwb3MudGFyZ2V0WCB8fFxuICAgICAgICBwb3MueSAhPT0gcG9zLnRhcmdldFk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZCh4LCB5LCBtYXBEYXRhLCB0aWxlU2l6ZSwgcGxheWVyU2l6ZSA9IHRpbGVTaXplKSB7XG4gICAgY29uc3QgcGFkZGluZyA9IDQ7XG5cbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHJpZ2h0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHggKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCB0b3AgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgYm90dG9tID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwbGF5ZXJTaXplIC0gcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKGxlZnQsIGJvdHRvbSwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChyaWdodCwgYm90dG9tLCBtYXBEYXRhKVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tlZENlbGwoeCwgeSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGwgPSBtYXBEYXRhW3ldICYmIG1hcERhdGFbeV1beF07XG5cbiAgICByZXR1cm4gY2VsbCAhPT0gMCAmJiBjZWxsICE9PSAyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHBvd2VyVXBTeXN0ZW0od29ybGQsIG9uUG93ZXJVcFBpY2tlZCkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUGxheWVyJyk7XG4gICAgY29uc3QgcG93ZXJVcHMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmICghcFBvcyB8fCAhdmVsIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcFVwRW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCB1cFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcFVwID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghdXBQb3MgfHwgIXBVcCB8fCBwVXAucGlja2VkVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocFBvcy5ncmlkWCA9PT0gdXBQb3MuZ3JpZFggJiYgcFBvcy5ncmlkWSA9PT0gdXBQb3MuZ3JpZFkpIHtcbiAgICAgICAgICAgICAgICBwVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC50eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlbC5zcGVlZCA9IE1hdGgubWluKHZlbC5zcGVlZCArIDEsIDgpOyBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5tYXhCb21icyA9IHBsYXllci5tYXhCb21icyA/IHBsYXllci5tYXhCb21icyArIDEgOiAyO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdGTEFNRScpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBVcC5lbCAmJiBwVXAuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvblBvd2VyVXBQaWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb25Qb3dlclVwUGlja2VkKHBsYXllci5pZCwgcFVwLnR5cGUsIHVwUG9zLmdyaWRYLCB1cFBvcy5ncmlkWSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShwVXBFbnRpdHkpO1xuICAgICAgICAgICAgICAgIGJyZWFrOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwYXduUG93ZXJVcCh3b3JsZCwgZ3gsIGd5LCBjb250YWluZXIsIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBzZWVkID0gZ3ggKiA3Mzg1NjA5MyBeIGd5ICogMTkzNDk2NjM7XG4gICAgY29uc3Qgc2VlZFJhbmRvbSA9IChNYXRoLnNpbihzZWVkKSAqIDEwMDAwKSAtIE1hdGguZmxvb3IoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCk7XG4gICAgXG4gICAgaWYgKHNlZWRSYW5kb20gPiAwLjM1KSByZXR1cm47XG5cbiAgICBjb25zdCB0eXBlcyA9IFsnU1BFRUQnLCAnQk9NQlMnLCAnRkxBTUUnXTtcbiAgICBjb25zdCB0eXBlSW5kZXggPSBNYXRoLmZsb29yKChNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCAtIE1hdGguZmxvb3IoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDApKSAqIHR5cGVzLmxlbmd0aCk7XG4gICAgY29uc3QgcmFuZG9tVHlwZSA9IHR5cGVzW3R5cGVJbmRleF07XG5cbiAgICBjb25zdCBwVXBFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG9zaXRpb24nLCB7IGdyaWRYOiBneCwgZ3JpZFk6IGd5LCB4OiBneCAqIHRpbGVTaXplLCB5OiBneSAqIHRpbGVTaXplIH0pO1xuICAgIFxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSBgcG93ZXJ1cCBwb3dlcnVwLSR7cmFuZG9tVHlwZS50b0xvd2VyQ2FzZSgpfWA7XG4gICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBkaXYuc3R5bGUud2lkdGggPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmhlaWdodCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUubGVmdCA9IGAke2d4ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS50b3AgPSBgJHtneSAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvd2VyVXAnLCB7IHR5cGU6IHJhbmRvbVR5cGUsIGVsOiBkaXYgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcmVuZGVyU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBhbmltUm93cykge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1JlbmRlcmFibGUnKTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG5cbiAgICAgICAgaWYgKCFyZW5kZXJhYmxlLmVsKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHJlbmRlcmFibGUuc3RhdGU7XG4gICAgICAgIGNvbnN0IHRhcmdldFJvdyA9IGFuaW1Sb3dzW3N0YXRlXVt2ZWwuZGlyZWN0aW9uXTtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlc2V0IGFuaW1hdGlvbiB3aGVuIHJvdyBvciBzdGF0ZSBjaGFuZ2VzXG4gICAgICAgIGlmIChyZW5kZXJhYmxlLnJvdyAhPT0gdGFyZ2V0Um93IHx8IHJlbmRlcmFibGUubGFzdFN0YXRlICE9PSBzdGF0ZSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5yb3cgPSB0YXJnZXRSb3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RTdGF0ZSA9IHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZnJhbWVDb3VudCA9IHN0YXRlID09PSAnUlVOJyA/IHJlbmRlcmFibGUucnVuRnJhbWVzIDogcmVuZGVyYWJsZS5pZGxlRnJhbWVzO1xuICAgICAgICBjb25zdCBmcmFtZURlbGF5ID0gc3RhdGUgPT09ICdSVU4nID8gMTAwMCAvIHJlbmRlcmFibGUuZnBzIDogMTAwMCAvIHJlbmRlcmFibGUuaWRsZUZwcztcblxuICAgICAgICBpZiAobm93IC0gcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID4gZnJhbWVEZWxheSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKyAxKSAlIGZyYW1lQ291bnQ7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPSBub3c7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3NYID0gLShyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSAqIHJlbmRlcmFibGUuZnJhbWVXaWR0aCk7XG4gICAgICAgIGNvbnN0IHBvc1kgPSAtKHJlbmRlcmFibGUucm93ICogcmVuZGVyYWJsZS5mcmFtZUhlaWdodCk7XG4gICAgICAgIFxuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGAke3Bvc1h9cHggJHtwb3NZfXB4YDtcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtwb3MueH1weCwgJHtwb3MueX1weCwgMClgO1xuICAgIH1cbn1cbiIsIi8vIC9zcmMvZWNzL3dvcmxkLmpzXG5cbmV4cG9ydCBjbGFzcyBXb3JsZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubmV4dEVudGl0eUlkID0gMDtcbiAgICAgICAgdGhpcy5lbnRpdGllcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gbmV3IE1hcCgpOyBcbiAgICAgICAgdGhpcy5zeXN0ZW1zID0gW107XG4gICAgfVxuXG4gICAgY3JlYXRlRW50aXR5KCkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLm5leHRFbnRpdHlJZCsrO1xuICAgICAgICB0aGlzLmVudGl0aWVzLmFkZChlbnRpdHkpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cblxuICAgIGRlc3Ryb3lFbnRpdHkoZW50aXR5KSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIGZvciAoY29uc3QgW2NvbXBvbmVudE5hbWUsIGNvbXBvbmVudE1hcF0gb2YgdGhpcy5jb21wb25lbnRzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSwgY29tcG9uZW50RGF0YSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5jb21wb25lbnRzLmhhcyhjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnNldChjb21wb25lbnROYW1lLCBuZXcgTWFwKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSkuc2V0KGVudGl0eSwgY29tcG9uZW50RGF0YSk7XG4gICAgfVxuXG4gICAgZ2V0Q29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50TWFwID8gY29tcG9uZW50TWFwLmdldChlbnRpdHkpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJlbW92ZUNvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudE1hcCkge1xuICAgICAgICAgICAgY29tcG9uZW50TWFwLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcXVlcnkoLi4uY29tcG9uZW50TmFtZXMpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudE5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZmlyc3RNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzWzBdKTtcbiAgICAgICAgaWYgKCFmaXJzdE1hcCkgcmV0dXJuIFtdO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBmaXJzdE1hcC5rZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBoYXNBbGwgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb21wb25lbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmICghbWFwIHx8ICFtYXAuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzQWxsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNBbGwgJiYgdGhpcy5lbnRpdGllcy5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZFN5c3RlbShzeXN0ZW1GdW5jdGlvbikge1xuICAgICAgICB0aGlzLnN5c3RlbXMucHVzaChzeXN0ZW1GdW5jdGlvbik7XG4gICAgfVxuXG4gICAgdXBkYXRlKGR0LCBub3cpIHtcbiAgICAgICAgZm9yIChjb25zdCBzeXN0ZW0gb2YgdGhpcy5zeXN0ZW1zKSB7XG4gICAgICAgICAgICBzeXN0ZW0odGhpcywgZHQsIG5vdyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBHUklEX0JPUkRFUl9TSVpFID0gNjtcbmNvbnN0IEdBTUVfQ0hST01FX1dJRFRIID0gNzI7XG5jb25zdCBHQU1FX0NIUk9NRV9IRUlHSFQgPSAxNTA7XG5cbmNvbnN0IGltYWdlcyA9IHtcbiAgICAyOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIixcbiAgICAzOiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja193YWxsLnBuZ1wiLFxuICAgIDQ6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2V4cGxvaXQucG5nXCIsXG59O1xuXG5jb25zdCBbcGxheWVyTmFtZSwgc2V0UGxheWVyTmFtZV0gPSBjcmVhdGVTaWduYWwoXCJQbGF5ZXIgMVwiKTtcbmNvbnN0IFtsaXZlcywgc2V0TGl2ZXNdID0gY3JlYXRlU2lnbmFsKDMpO1xuY29uc3QgW3NwZWVkLCBzZXRTcGVlZF0gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbYm9tYnMsIHNldEJvbWJzXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtyYW5nZSwgc2V0UmFuZ2VdID0gY3JlYXRlU2lnbmFsKDEpO1xuZXhwb3J0IHsgc2V0UGxheWVyTmFtZSwgc2V0TGl2ZXMsIHNldFNwZWVkLCBzZXRCb21icywgc2V0UmFuZ2UgfTtcblxuY29uc3QgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IG5hbWVFbC50ZXh0Q29udGVudCA9IHBsYXllck5hbWUoKTsgfSk7XG5cbmNvbnN0IGxpdmVzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGxpdmVzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHNwZWVkRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHNwZWVkLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IGJvbWJzRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIGJvbWJzLXZhbHVlXCI+PC9zcGFuPjtcbmNvbnN0IHJhbmdlRWwgPSA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHJhbmdlLXZhbHVlXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbGl2ZXNFbC50ZXh0Q29udGVudCA9IGxpdmVzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgc3BlZWRFbC50ZXh0Q29udGVudCA9IHNwZWVkKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgYm9tYnNFbC50ZXh0Q29udGVudCA9IGJvbWJzKCk7IH0pO1xuY3JlYXRlRWZmZWN0KCgpID0+IHsgcmFuZ2VFbC50ZXh0Q29udGVudCA9IHJhbmdlKCk7IH0pO1xuXG5mdW5jdGlvbiBHYW1lKHsgZ3JpZCB9KSB7XG4gICAgY29uc3QgYm9hcmRXaWR0aCA9IGdyaWRbMF0ubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gZ3JpZC5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRPdXRlcldpZHRoID0gYm9hcmRXaWR0aCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJIZWlnaHQgPSBib2FyZEhlaWdodCArIEdSSURfQk9SREVSX1NJWkUgKiAyO1xuICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRXaWR0aCA6IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGJvYXJkSGVpZ2h0IDogd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHNjYWxlID0gTWF0aC5taW4oXG4gICAgICAgIDEsXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0V2lkdGggLSBHQU1FX0NIUk9NRV9XSURUSCkgLyBib2FyZE91dGVyV2lkdGgpLFxuICAgICAgICBNYXRoLm1heCgwLjIsICh2aWV3cG9ydEhlaWdodCAtIEdBTUVfQ0hST01FX0hFSUdIVCkgLyBib2FyZE91dGVySGVpZ2h0KVxuICAgICk7XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBncmlkLmxlbmd0aDsgcm93SW5kZXgrKykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgZ3JpZFtyb3dJbmRleF0ubGVuZ3RoOyBjb2xJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZ3JpZFtyb3dJbmRleF1bY29sSW5kZXhdO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IFwidGlsZVwiO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gYHdpZHRoOiR7VElMRV9TSVpFfXB4O2hlaWdodDoke1RJTEVfU0laRX1weDtgO1xuXG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMiB8fCBjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtZmxvb3JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtd2FsbFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1szXX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzRdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDAgfHwgY2VsbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1syXX0pYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2VsbHMucHVzaCg8ZGl2IGNsYXNzPXtjbGFzc05hbWV9IGRhdGEteD17Y29sSW5kZXh9IGRhdGEteT17cm93SW5kZXh9IHN0eWxlPXtzdHlsZX0+PC9kaXY+KTtcbiAgICAgICAgfVxuICAgICAgICByb3dzLnB1c2goPGRpdiBjbGFzcz1cImdyaWQtcm93XCI+e2NlbGxzfTwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1nbGFzc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1iYXJcIj5cbiAgICAgICAgICAgICAgICAgICAge25hbWVFbH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLXN0YXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkxpdmVzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsaXZlc0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlNwZWVkPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzcGVlZEVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPkJvbWJzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib21ic0VsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPlJhbmdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyYW5nZUVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWJvYXJkLWZyYW1lXCIgc3R5bGU9e2B3aWR0aDoke2JvYXJkT3V0ZXJXaWR0aCAqIHNjYWxlfXB4O2hlaWdodDoke2JvYXJkT3V0ZXJIZWlnaHQgKiBzY2FsZX1weDtgfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJnYW1lLWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImdhbWUtZ3JpZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17YHBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiR7Ym9hcmRXaWR0aH1weDtoZWlnaHQ6JHtib2FyZEhlaWdodH1weDt0cmFuc2Zvcm06c2NhbGUoJHtzY2FsZX0pO2B9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCBDaGF0UGxheWVycyBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmxldCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gY3JlYXRlU2lnbmFsKHt9KTtcbmV4cG9ydCB7IHNldFN0YXRlcyB9O1xuXG5sZXQgcm9vbUlkRWwgPSA8cD5Sb29tIElEOiA8L3A+O1xubGV0IHBsYXllcnNFbCA9IDxwPlBsYXllcnM6ICAvIDQ8L3A+O1xubGV0IHRleHRFbCA9IDxwPjwvcD47XG5sZXQgdGltZXJFbCA9IDxwPlRpbWVyOiA8L3A+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHMgPSBzdGF0ZXMoKTtcbiAgICByb29tSWRFbC50ZXh0Q29udGVudCA9IGBSb29tIElEOiAke3Mucm9vbUlkfWA7XG4gICAgcGxheWVyc0VsLnRleHRDb250ZW50ID0gYFBsYXllcnM6ICR7cy5wbGF5ZXJzQ291bnR9IC8gNGA7XG4gICAgdGV4dEVsLnRleHRDb250ZW50ID0gcy50ZXh0IHx8IFwiXCI7XG5cbiAgICBpZiAocy5nYW1lU3RhcnRlZCkge1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gXCJUaW1lcjogR2FtZSBzdGFydGVkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGltZXJUZXh0ID0gKCFzLnNlY29uZHNMZWZ0KSA/IFwiV2FpdGluZyBmb3Igb25lIG1vcmUgcGxheWVyXCIgOiBgJHtzLnNlY29uZHNMZWZ0fSBzZWNvbmRzYDtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IGBUaW1lcjogJHt0aW1lclRleHR9YDtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gTG9iYnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbmF0aW5lci1sb2JieVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYmJ5LWJveFwiPlxuICAgICAgICAgICAgICAgIDxoMT5Mb2JieTwvaDE+XG4gICAgICAgICAgICAgICAge3Jvb21JZEVsfVxuICAgICAgICAgICAgICAgIHtwbGF5ZXJzRWx9XG4gICAgICAgICAgICAgICAge3RleHRFbH1cbiAgICAgICAgICAgICAgICB7dGltZXJFbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPENoYXRQbGF5ZXJzIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG5yZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5sZXQgbWVudUVsID0gKFxuICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICA8aDE+WW91IFdpbiE8L2gxPlxuICAgICAgICA8cD5BbGwgb3RoZXIgcGxheWVycyBoYXZlIGxlZnQgdGhlIGdhbWUuPC9wPlxuICAgICAgICB7cmVwbGF5QnRufVxuICAgIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVudSgpIHtcbiAgICByZXR1cm4gbWVudUVsO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IHNldFBsYXllck5hbWUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjtcblxuZnVuY3Rpb24gUmVnaXN0ZXIoeyB3c3MgfSkge1xuICAgIGxldCBzdWJtaXR0ZWQgPSBmYWxzZTtcblxuICAgIGxldCBwbGF5ZXJFbnRlciA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHN1Ym1pdHRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUgfHwgbmlja25hbWUubGVuZ3RoID4gMjApIHJldHVybjtcblxuICAgICAgICBzdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzZXRQbGF5ZXJOYW1lKG5pY2tuYW1lKTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcIm5pY2tuYW1lX29mX3RoZV9wbGF5ZXJcIixcbiAgICAgICAgICAgIG5pY2tuYW1lOiBuaWNrbmFtZVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgb25TdWJtaXQ9e3BsYXllckVudGVyfT5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5pY2tuYW1lLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVudGVyIHlvdXIgbmFtZVwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMucGxheSgpLCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5tdXNpYy5wbGF5KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5tdXNpYy5wYXVzZWQgfHwgdGhpcy5tdXNpYy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9uXCIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUJ1dHRvbigpIHtcbiAgICAgICAgY29uc3QgaXNNdXRlZCA9IHRoaXMubXVzaWMubXV0ZWQgfHwgdGhpcy5tdXNpYy5wYXVzZWQ7XG5cbiAgICAgICAgdGhpcy5pY29uLmNsYXNzTmFtZSA9IGlzTXV0ZWQgPyBcImZhLXNvbGlkIGZhLXZvbHVtZS1vZmZcIiA6IFwiZmEtc29saWQgZmEtdm9sdW1lLWhpZ2hcIjtcbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImlzLW11dGVkXCIsIGlzTXV0ZWQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291bmQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwL2FwcC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwidHlwZSIsInByb3BzIiwiY2hpbGRyZW4iLCJlbGUiLCJkb2N1bWVudCIsImtleSIsInN0YXJ0c1dpdGgiLCJldmVudE5hbWUiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldEF0dHJpYnV0ZSIsImZsYXRDaGlsZHJlbiIsImZsYXQiLCJJbmZpbml0eSIsImFwcGVuZCIsImZpbHRlciIsImNoaWxkIiwidW5kZWZpbmVkIiwicmVuZGVyIiwiZWxlbWVudCIsImNvbnRhaW5lciIsInJlcGxhY2VDaGlsZHJlbiIsIlJvdXRlciIsInJvdXRlciIsImVmZmVjdFN0YWNrIiwiYWN0aXZlRWZmZWN0IiwiY3JlYXRlU2lnbmFsIiwiaW5pdGlhbFZhbHVlIiwidmFsdWUiLCJlZmZlY3RzIiwiU2V0IiwiUmVhZCIsImFkZCIsIldyaXRlIiwibmV3VmFsdWUiLCJmbiIsImZvckVhY2giLCJlZmZlY3QiLCJjcmVhdGVFZmZlY3QiLCJwdXNoIiwicG9wIiwibGVuZ3RoIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInVybCIsIlVSTCIsImhyZWYiLCJsaXN0ZW4iLCJvbkVycm9yNDA0IiwiZXZlbnQiLCJkZXN0aW5hdGlvbiIsImludGVyY2VwdCIsImNvbnNvbGUiLCJsb2ciLCJSZWdpc3RlciIsIkdhbWUiLCJNZW51IiwiTG9iYnkiLCJzZXRTdGF0ZXMiLCJzZXRQbGF5ZXJOYW1lIiwic2V0SHVkUGxheWVyTmFtZSIsIlNvdW5kIiwic2V0TWVzc2FnZXMiLCJHYW1lRW5naW5lIiwicm9vdCIsImdldEVsZW1lbnRCeUlkIiwid3NzIiwiV2ViU29ja2V0Iiwid2luZG93IiwiaG9zdG5hbWUiLCJzb3VuZCIsImN1cnJlbnRHYW1lRW5naW5lIiwiaW5pdCIsImJvZHkiLCJjbGFzc05hbWUiLCJhbGVydCIsIndzIiwibWVzc2FnZSIsIkpTT04iLCJwYXJzZSIsImRhdGEiLCJxdWVyeVNlbGVjdG9yIiwicm9vbUlkIiwicGxheWVyc0NvdW50Iiwic2Vjb25kc0xlZnQiLCJ0ZXh0IiwiZ3JpZCIsInNldFRpbWVvdXQiLCJnYW1lQ29udGFpbmVyIiwiZGVzdHJveSIsImxvY2FsUGxheWVyIiwicGxheWVycyIsImZpbmQiLCJwbGF5ZXIiLCJpZCIsInlvdXJQbGF5ZXJJZCIsIm5pY2tuYW1lIiwiZW5naW5lIiwiZXJyb3IiLCJwcmV2IiwiaGFuZGxlUmVtb3RlTW92ZSIsInBheWxvYWQiLCJoYW5kbGVSZW1vdGVCb21iIiwiaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZCIsImVyciIsIm1lc3NhZ2VzIiwiQ2hhdFBsYXllcnMiLCJtZXNzYWdlc0NvbnRhaW5lciIsImNsYXNzIiwibXNncyIsImlubmVySFRNTCIsIm1zZyIsInAiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsImdldCIsInRyaW0iLCJyZXNldCIsInNlbmQiLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlBvc2l0aW9uQ29tcG9uZW50IiwiZ3giLCJneSIsInRpbGVTaXplIiwiZ3JpZFgiLCJncmlkWSIsIngiLCJ5IiwidGFyZ2V0WCIsInRhcmdldFkiLCJWZWxvY2l0eUNvbXBvbmVudCIsImJhc2VTcGVlZCIsInNwZWVkIiwiaXNNb3ZpbmciLCJkaXJlY3Rpb24iLCJJbnB1dENvbXBvbmVudCIsImlucHV0UXVldWUiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiZWwiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJ0b3RhbEZyYW1lcyIsImZwcyIsImN1cnJlbnRGcmFtZSIsInJ1bkZyYW1lcyIsImlkbGVGcmFtZXMiLCJpZGxlRnBzIiwibGFzdEZyYW1lVGltZSIsInJvdyIsInN0YXRlIiwibGFzdFN0YXRlIiwiUGxheWVyQ29tcG9uZW50IiwiY2hhclR5cGUiLCJpc0xvY2FsIiwiQm9tYkNvbXBvbmVudCIsIm93bmVySWQiLCJ0aW1lciIsInJhbmdlIiwiZXhwbG9kZWQiLCJFeHBsb3Npb25Db21wb25lbnQiLCJkdXJhdGlvbiIsIlBvd2VyVXBDb21wb25lbnQiLCJwaWNrZWRVcCIsIkJlaGF2aW9yQ29tcG9uZW50IiwiZ2hvc3RNb2RlIiwidGhyb3dhYmxlIiwiZGV0b25hdG9yIiwiZmFzdFNob2VzTGV2ZWwiLCJib21icyIsIm1heCIsImN1cnJlbnQiLCJXb3JsZCIsIm1vdmVtZW50U3lzdGVtIiwicmVuZGVyU3lzdGVtIiwiYm9tYlN5c3RlbSIsImRhbWFnZVN5c3RlbSIsImNoZWNrRXh0cmFMaWZlQ29sbGlzaW9uIiwiY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyIsInBvd2VyVXBTeXN0ZW0iLCJzcGF3blBvd2VyVXAiLCJzZXRCb21icyIsInNldExpdmVzIiwic2V0UmFuZ2UiLCJzZXRTcGVlZCIsIlRJTEVfU0laRSIsIkFOSU1BVElPTl9ST1dTIiwiUlVOIiwidXAiLCJsZWZ0IiwiZG93biIsInJpZ2h0IiwiSURMRSIsImNvbnN0cnVjdG9yIiwiY2FudmFzQ29udGFpbmVyIiwibWFwRGF0YSIsInNvY2tldCIsIndvcmxkIiwibG9jYWxQbGF5ZXJFbnRpdHkiLCJwbGF5ZXJFbnRpdGllcyIsIk1hcCIsImxhc3RUaW1lIiwicmVtb3ZlSW5wdXRMaXN0ZW5lcnMiLCJhbmltYXRpb25GcmFtZSIsInJ1bm5pbmciLCJjbGFpbWVkUG93ZXJVcHMiLCJsb2NhbFBsYXllcklkIiwiYWxsUGxheWVycyIsInRvdGFsUGxheWVycyIsIm5vcm1hbGl6ZWRMb2NhbFBsYXllcklkIiwiU3RyaW5nIiwicERhdGEiLCJwbGF5ZXJJZCIsInBsYXllckVudGl0eSIsImNyZWF0ZUVudGl0eSIsInBsYXllckRpdiIsImNvbG9yIiwic3R5bGUiLCJwb3NpdGlvbiIsInpJbmRleCIsIndpbGxDaGFuZ2UiLCJzeCIsInN5IiwiYWRkQ29tcG9uZW50IiwicGxheWVyQ29tcCIsImxpdmVzIiwibWF4Qm9tYnMiLCJib21iUmFuZ2UiLCJzZXQiLCJ1cGRhdGVIdWRTdGF0cyIsInNldHVwSW5wdXQiLCJ3YXJuIiwibWFwIiwicmVnaXN0ZXJTeXN0ZW1zIiwicGVyZm9ybWFuY2UiLCJub3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJnYW1lTG9vcCIsImlucHV0IiwiZ2V0Q29tcG9uZW50IiwiZ2V0S2V5RGlyZWN0aW9uIiwiaGFuZGxlS2V5RG93biIsImRpciIsImluY2x1ZGVzIiwiY29kZSIsImRyb3BCb21iIiwiaGFuZGxlS2V5VXAiLCJkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInBvcyIsImN1cnJlbnRCb21icyIsInF1ZXJ5IiwiYkVudGl0eSIsImNyZWF0ZWQiLCJjcmVhdGVCb21iIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJleGlzdHMiLCJzb21lIiwiZW50aXR5IiwiYm9tYiIsImJvbWJFbnRpdHkiLCJib21iRGl2IiwidG9wIiwiYm9tYkNvbXAiLCJBcnJheSIsImZyb20iLCJrZXlzIiwidmVsIiwicmVuZGVyYWJsZSIsInJlbW92ZVBvd2VyVXBBdCIsImFwcGx5UG93ZXJVcCIsInBvd2VyVXBzIiwicG93ZXJVcCIsInBhcmVudE5vZGUiLCJkZXN0cm95RW50aXR5IiwidmVsb2NpdHkiLCJNYXRoIiwibWluIiwidXBkYXRlTWFwQ2VsbCIsInRpbGUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJkZXN0cm95Qm94Q2FsbGJhY2siLCJoYXMiLCJvblBsYXllckh1cnQiLCJyZW1haW5pbmdMaXZlcyIsIm9uUG93ZXJVcFBpY2tlZCIsImJyb2FkY2FzdE1vdmVtZW50IiwiYWRkU3lzdGVtIiwidyIsImR0IiwidXBkYXRlIiwibmV4dE5vdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicm91bmQiLCJjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImdldFBsYXllck5hbWUiLCJnZXRJdGVtIiwiYWZmZWN0ZWRDZWxscyIsImNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzIiwiY2VsbCIsImV4cEVudGl0eSIsImV4cERpdiIsIndpZHRoIiwiaGVpZ2h0IiwiZXhwbG9zaW9ucyIsImV4cCIsImJ4IiwiYnkiLCJjZWxscyIsImRpcmVjdGlvbnMiLCJzdGVwcyIsImkiLCJ0eCIsInR5IiwiY2VsbFR5cGUiLCJzaG93TG9zc1BvcHVwIiwicGxheWVyTmFtZSIsIm92ZXJsYXkiLCJwb3B1cCIsInRpdGxlRWwiLCJidXR0b24iLCJyZWxvYWQiLCJzaG93V2luUG9wdXAiLCJoYW5kbGVQbGF5ZXJEZWF0aCIsImRlYXRoR3JpZFgiLCJmbG9vciIsImRlYXRoR3JpZFkiLCJoZWFydERpdiIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJmb250U2l6ZSIsInBvaW50ZXJFdmVudHMiLCJleHRyYUxpZmVEcm9wcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJkcm9wIiwiZHJvcExlZnQiLCJwYXJzZUludCIsImRyb3BUb3AiLCJpc05hTiIsImRyb3BHcmlkWCIsImRyb3BHcmlkWSIsInBQb3MiLCJwbGF5ZXJHcmlkWCIsInBsYXllckdyaWRZIiwiYWN0aXZlUGxheWVyQ291bnQiLCJsYXN0QWN0aXZlUGxheWVyRW50aXR5IiwibG9jYWxQbGF5ZXJOYW1lIiwibGFzdFBsYXllciIsImludmluY2libGVVbnRpbCIsImVQb3MiLCJwcmV2aW91c0xpdmVzIiwiZW50aXRpZXMiLCJkZWx0YSIsIlBMQVlFUl9TSVpFIiwiYmVoYXZpb3IiLCJtb3ZlVG93YXJkVGFyZ2V0IiwiYWN0aXZlSW5wdXQiLCJkeCIsImR5IiwiaGFzSW5wdXQiLCJuZXh0WCIsIm5leHRZIiwic25hcFRocmVzaG9sZCIsImlzQmxvY2tlZCIsImN1cnJlbnRUaWxlWCIsImRpZmZYIiwiYWJzIiwic2lnbiIsImN1cnJlbnRUaWxlWSIsImRpZmZZIiwibmV4dFhBZnRlclNuYXAiLCJuZXh0WUFmdGVyU25hcCIsInN0ZXAiLCJwbGF5ZXJTaXplIiwicGFkZGluZyIsImJvdHRvbSIsImlzQmxvY2tlZENlbGwiLCJwVXBFbnRpdHkiLCJ1cFBvcyIsInBVcCIsInNlZWQiLCJzZWVkUmFuZG9tIiwic2luIiwidHlwZXMiLCJ0eXBlSW5kZXgiLCJyYW5kb21UeXBlIiwiZGl2IiwiYW5pbVJvd3MiLCJ0YXJnZXRSb3ciLCJmcmFtZUNvdW50IiwiZnJhbWVEZWxheSIsInBvc1giLCJwb3NZIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwidHJhbnNmb3JtIiwibmV4dEVudGl0eUlkIiwiY29tcG9uZW50cyIsInN5c3RlbXMiLCJkZWxldGUiLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50TWFwIiwiZW50cmllcyIsImNvbXBvbmVudERhdGEiLCJyZW1vdmVDb21wb25lbnQiLCJjb21wb25lbnROYW1lcyIsImZpcnN0TWFwIiwicmVzdWx0cyIsImhhc0FsbCIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwiR1JJRF9CT1JERVJfU0laRSIsIkdBTUVfQ0hST01FX1dJRFRIIiwiR0FNRV9DSFJPTUVfSEVJR0hUIiwiaW1hZ2VzIiwibmFtZUVsIiwibGl2ZXNFbCIsInNwZWVkRWwiLCJib21ic0VsIiwicmFuZ2VFbCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImJvYXJkT3V0ZXJXaWR0aCIsImJvYXJkT3V0ZXJIZWlnaHQiLCJ2aWV3cG9ydFdpZHRoIiwiaW5uZXJXaWR0aCIsInZpZXdwb3J0SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJzY2FsZSIsInJvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4Iiwic3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsImdhbWVTdGFydGVkIiwidGltZXJUZXh0IiwicmVwbGF5QnRuIiwibWVudUVsIiwic3VibWl0dGVkIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwicGxheSIsIm9uY2UiLCJ1cGRhdGVCdXR0b24iLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiXSwic291cmNlUm9vdCI6IiJ9