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
  titleEl.textContent = 'YOU LOST';
  titleEl.className = 'game-result-title';
  const messageEl = document.createElement('p');
  messageEl.textContent = `${playerName}, you have been eliminated!`;
  messageEl.className = 'game-result-message';
  const button = document.createElement('button');
  button.textContent = 'Reload Page';
  button.className = 'game-result-button';
  button.addEventListener('click', () => {
    window.location.reload();
  });
  popup.appendChild(titleEl);
  popup.appendChild(messageEl);
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
  titleEl.textContent = 'YOU WON!';
  titleEl.className = 'game-result-title';
  const messageEl = document.createElement('p');
  messageEl.textContent = `Congratulations ${playerName}, you are the last one standing!`;
  messageEl.className = 'game-result-message';
  const button = document.createElement('button');
  button.textContent = 'Reload Page';
  button.className = 'game-result-button';
  button.addEventListener('click', () => {
    window.location.reload();
  });
  popup.appendChild(titleEl);
  popup.appendChild(messageEl);
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

  // 3. Create an img element at the exact death location with heart image
  const heartImg = document.createElement('img');
  heartImg.className = 'extra-life-drop';
  heartImg.src = '../../assets/images/heart.png'; // Path to heart image (adjust as needed)
  heartImg.style.position = 'absolute';
  heartImg.style.left = `${deathGridX * tileSize}px`;
  heartImg.style.top = `${deathGridY * tileSize}px`;
  heartImg.style.width = `${tileSize}px`;
  heartImg.style.height = `${tileSize}px`;
  heartImg.style.zIndex = '5';
  heartImg.style.objectFit = 'contain';
  heartImg.style.animation = 'pulse 1s ease-in-out infinite';

  // Append to the game container
  const gameContainer = container || document.getElementById('game-container');
  if (gameContainer) {
    gameContainer.appendChild(heartImg);
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

  // Check if local player is eliminated
  if (localPlayerEntity !== null) {
    const localPlayer = world.getComponent(localPlayerEntity, 'Player');
    if (localPlayer && (localPlayer.lives ?? 0) <= 0) {
      // Check if already showed loss popup
      if (!document.querySelector('.game-result-popup')) {
        showLossPopup(localPlayer.id || 'Player');
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
          showWinPopup(lastPlayer.id || 'Player');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVUsRUFBRVEsT0FBTyxDQUFDO0VBQ3JEO0FBQ0o7QUFFQSxpRUFBZTFaLEtBQUssRTs7Ozs7O1VDbkRwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQzVCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2hhdC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3MvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvZGFtYWdlU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9tb3ZlbWVudFN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL3N5c3RlbXMvcmVuZGVyU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvd29ybGQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2dhbWUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9sb2JieS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yZWdpc3Rlci5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3NvdW5kLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCBwcm9wcywgLi4uY2hpbGRyZW4pIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gdHlwZSh7IC4uLihwcm9wcyB8fCB7fSksIGNoaWxkcmVuIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcyB8fCB7fSkge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJvblwiKSAmJiB0eXBlb2YgcHJvcHNba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBrZXkuc2xpY2UoMikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGUuc2V0QXR0cmlidXRlKGtleSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmbGF0Q2hpbGRyZW4gPSBjaGlsZHJlbi5mbGF0KEluZmluaXR5KTtcbiAgICBlbGUuYXBwZW5kKC4uLmZsYXRDaGlsZHJlbi5maWx0ZXIoY2hpbGQgPT4gY2hpbGQgIT09IG51bGwgJiYgY2hpbGQgIT09IHVuZGVmaW5lZCAmJiBjaGlsZCAhPT0gZmFsc2UpKTtcblxuICAgIHJldHVybiBlbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgY29udGFpbmVyLnJlcGxhY2VDaGlsZHJlbihlbGVtZW50KTtcbn1cbiIsImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCIuL3JvdXRlci5qc1wiO1xuXG5sZXQgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7IiwiY29uc3QgZWZmZWN0U3RhY2sgPSBbXTtcbmxldCBhY3RpdmVFZmZlY3QgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2lnbmFsKGluaXRpYWxWYWx1ZSkge1xuICAgbGV0IHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgY29uc3QgZWZmZWN0cyA9IG5ldyBTZXQoKTtcblxuICAgY29uc3QgUmVhZCA9ICgpID0+IHtcbiAgICAgIGlmIChhY3RpdmVFZmZlY3QpIHtcbiAgICAgICAgIGVmZmVjdHMuYWRkKGFjdGl2ZUVmZmVjdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICB9XG5cbiAgIGNvbnN0IFdyaXRlID0gKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgIGxldCBmbiA9IG5ld1ZhbHVlO1xuICAgICAgICAgdmFsdWUgPSBmbih2YWx1ZSk7XG4gICAgICB9IFxuICAgICAgZWxzZSB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgZWZmZWN0cy5mb3JFYWNoKGVmZmVjdCA9PiBlZmZlY3QoKSk7XG4gICB9XG5cbiAgIHJldHVybiBbUmVhZCwgV3JpdGVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWZmZWN0KGVmZmVjdCkge1xuICAgZWZmZWN0U3RhY2sucHVzaChlZmZlY3QpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0O1xuICAgZWZmZWN0KCk7XG4gICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdFN0YWNrW2VmZmVjdFN0YWNrLmxlbmd0aCAtIDFdIHx8IG51bGw7XG59XG4iLCJleHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgICAjUm91dGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAjRmlyc3RSZXNvbHZlID0gZmFsc2U7XG5cbiAgICBvbihwYXRoLCBoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuI1JvdXRlc1twYXRoXSA9IGhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBcbiAgICBuYXZpZ2F0ZShwYXRoLCB7IGhpc3RvcnkgPSBcInB1c2hcIiB9ID0ge30pIHtcbiAgICAgICAgcGF0aCA9IHBhdGguc3RhcnRzV2l0aChcIi9cIikgPyBwYXRoIDogXCIvXCIgKyBwYXRoO1xuICAgICAgICByZXR1cm4gbmF2aWdhdGlvbi5uYXZpZ2F0ZShwYXRoLCB7IGhpc3RvcnkgfSk7XG4gICAgfVxuICAgIFxuICAgIHJlc29sdmUocGF0aCA9IGxvY2F0aW9uLnBhdGhuYW1lKSB7XG4gICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3BhdGhdO1xuXG4gICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZuKHsgdXJsOiBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBsaXN0ZW4ob25FcnJvcjQwNCkge1xuICAgICAgICBuYXZpZ2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJuYXZpZ2F0ZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoZXZlbnQuZGVzdGluYXRpb24udXJsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXZlbnQuaW50ZXJjZXB0KHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybC5wYXRobmFtZSwgdGhpcy4jUm91dGVzKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1t1cmwucGF0aG5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yNDA0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm4oeyB1cmwgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdGhpcy4jRmlyc3RSZXNvbHZlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHRoaXMuI0ZpcnN0UmVzb2x2ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHJlbmRlciB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrXCI7XG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFN0YXRlcyB9IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSBhcyBzZXRIdWRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcbmltcG9ydCBTb3VuZCBmcm9tIFwiLi4vdXRpbHMvc291bmRcIjtcbmltcG9ydCB7IHNldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5pbXBvcnQgeyBHYW1lRW5naW5lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7IFxuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChgd3M6Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZX06NTAwMGApO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5sZXQgY3VycmVudEdhbWVFbmdpbmUgPSBudWxsO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwicm9vbV91cGRhdGVcIjpcbiAgICAgICAgY2FzZSBcImxvYmJ5X3RpbWVyXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwibG9iYnktcGFnZVwiO1xuICAgICAgICAgICAgaWYgKCFyb290LnF1ZXJ5U2VsZWN0b3IoXCIuY29uYXRpbmVyLWxvYmJ5XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKDxMb2JieSAvPiwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRTdGF0ZXMoe1xuICAgICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWQsXG4gICAgICAgICAgICAgICAgcGxheWVyc0NvdW50OiBtZXNzYWdlLnBsYXllcnNDb3VudCxcbiAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogbWVzc2FnZS5zZWNvbmRzTGVmdCxcbiAgICAgICAgICAgICAgICB0ZXh0OiBtZXNzYWdlLnRleHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJnYW1lX3N0YXJ0ZWRcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJnYW1lLXBhZ2VcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVuZGVyKDxHYW1lIGdyaWQ9e21lc3NhZ2UuZ3JpZH0gLz4sIHJvb3QpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsUGxheWVyID0gKG1lc3NhZ2UucGxheWVycyB8fCBbXSkuZmluZChwbGF5ZXIgPT4gcGxheWVyLmlkID09PSBtZXNzYWdlLnlvdXJQbGF5ZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbFBsYXllciAmJiBsb2NhbFBsYXllci5uaWNrbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SHVkUGxheWVyTmFtZShsb2NhbFBsYXllci5uaWNrbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmdpbmUgPSBuZXcgR2FtZUVuZ2luZShnYW1lQ29udGFpbmVyLCBtZXNzYWdlLmdyaWQsIHdzcyk7XG4gICAgICAgICAgICAgICAgICAgIGVuZ2luZS5pbml0KG1lc3NhZ2UueW91clBsYXllcklkLCBtZXNzYWdlLnBsYXllcnMgfHwgW10pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUgPSBlbmdpbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdhbWUgY29udGFpbmVyIHdhcyBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcInJvb21fYWxvbmVcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgIHJlbmRlcig8TWVudSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2ICxtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGxheWVyX21vdmVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVNb3ZlKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJvbWJfZHJvcHBlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlQm9tYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb3dlcnVwX3BpY2tlZFwiOlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYW1lRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuaGFuZGxlUmVtb3RlUG93ZXJVcFBpY2tlZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3JcIiwgZXJyKTtcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsb3NlZFwiKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB3c3M7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IHdzcyBmcm9tIFwiLi4vYXBwL2FwcFwiO1xuXG5jb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IGNyZWF0ZVNpZ25hbChbXSk7XG5leHBvcnQgeyBzZXRNZXNzYWdlcyB9O1xuXG5mdW5jdGlvbiBDaGF0UGxheWVycygpIHtcbiAgICBjb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IDxkaXYgY2xhc3M9XCJtZXNzYWdlc1wiPjwvZGl2PjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZ3MgPSBtZXNzYWdlcygpO1xuICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGZvciAobGV0IG1zZyBvZiBtc2dzKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBwLnRleHRDb250ZW50ID0gbXNnO1xuICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXNDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5yZW1vdmVDaGlsZChtZXNzYWdlc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgbXNncy51bnNoaWZ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZm9ybURhdGEuZ2V0KFwibWVzc2FnZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJjaGF0X21lc3NhZ2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIH0pKTtcbiAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdFwiIG9uU3VibWl0PXticm9hZGNhc3RNZXNzYWdlfT5cbiAgICAgICAgICAgIHttZXNzYWdlc0NvbnRhaW5lcn1cbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJ0eXBlIHRvIHRoZSBvdGhlciBwbGF5ZXJzIC4uLlwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVyczsiLCIvLyAvc3JjL2Vjcy9jb21wb25lbnRzLmpzXG5cbmV4cG9ydCBjb25zdCBQb3NpdGlvbkNvbXBvbmVudCA9IChneCwgZ3ksIHRpbGVTaXplID0gNjQpID0+ICh7XG4gICAgZ3JpZFg6IGd4LFxuICAgIGdyaWRZOiBneSxcbiAgICB4OiBneCAqIHRpbGVTaXplLFxuICAgIHk6IGd5ICogdGlsZVNpemUsXG4gICAgdGFyZ2V0WDogZ3ggKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRZOiBneSAqIHRpbGVTaXplXG59KTtcblxuZXhwb3J0IGNvbnN0IFZlbG9jaXR5Q29tcG9uZW50ID0gKGJhc2VTcGVlZCA9IDIuNSkgPT4gKHtcbiAgICBiYXNlU3BlZWQ6IGJhc2VTcGVlZCxcbiAgICBzcGVlZDogYmFzZVNwZWVkLFxuICAgIGlzTW92aW5nOiBmYWxzZSxcbiAgICBkaXJlY3Rpb246ICdkb3duJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBJbnB1dENvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgaW5wdXRRdWV1ZTogW11cbn0pO1xuXG5leHBvcnQgY29uc3QgUmVuZGVyYWJsZUNvbXBvbmVudCA9IChlbCwgZnJhbWVXaWR0aCA9IDY0LCBmcmFtZUhlaWdodCA9IDY0LCB0b3RhbEZyYW1lcyA9IDQsIGZwcyA9IDEyKSA9PiAoe1xuICAgIGVsOiBlbCxcbiAgICBmcmFtZVdpZHRoOiBmcmFtZVdpZHRoLFxuICAgIGZyYW1lSGVpZ2h0OiBmcmFtZUhlaWdodCxcbiAgICBjdXJyZW50RnJhbWU6IDAsXG4gICAgdG90YWxGcmFtZXM6IHRvdGFsRnJhbWVzLFxuICAgIHJ1bkZyYW1lczogNCxcbiAgICBpZGxlRnJhbWVzOiAyLFxuICAgIGZwczogZnBzLFxuICAgIGlkbGVGcHM6IDQsXG4gICAgbGFzdEZyYW1lVGltZTogMCxcbiAgICByb3c6IDAsXG4gICAgc3RhdGU6ICdJRExFJyxcbiAgICBsYXN0U3RhdGU6ICdJRExFJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXJDb21wb25lbnQgPSAoaWQsIGNoYXJUeXBlLCBpc0xvY2FsID0gZmFsc2UpID0+ICh7XG4gICAgaWQ6IGlkLFxuICAgIGNoYXJUeXBlOiBjaGFyVHlwZSxcbiAgICBpc0xvY2FsOiBpc0xvY2FsXG59KTtcblxuZXhwb3J0IGNvbnN0IEJvbWJDb21wb25lbnQgPSAob3duZXJJZCwgdGltZXIgPSAyMDAwLCByYW5nZSA9IDQpID0+ICh7XG4gICAgb3duZXJJZDogb3duZXJJZCxcbiAgICB0aW1lcjogdGltZXIsXG4gICAgcmFuZ2U6IHJhbmdlLFxuICAgIGV4cGxvZGVkOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBFeHBsb3Npb25Db21wb25lbnQgPSAoZHVyYXRpb24gPSA1MDApID0+ICh7XG4gICAgZHVyYXRpb246IGR1cmF0aW9uXG59KTtcblxuZXhwb3J0IGNvbnN0IFBvd2VyVXBDb21wb25lbnQgPSAodHlwZSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlLCBcbiAgICBwaWNrZWRVcDogZmFsc2Vcbn0pO1xuXG5leHBvcnQgY29uc3QgQmVoYXZpb3JDb21wb25lbnQgPSAoKSA9PiAoe1xuICAgIGdob3N0TW9kZTogZmFsc2UsXG4gICAgdGhyb3dhYmxlOiBmYWxzZSxcbiAgICBkZXRvbmF0b3I6IGZhbHNlLFxuICAgIGZhc3RTaG9lc0xldmVsOiAxLFxuICAgIGJvbWJzOiB7XG4gICAgICAgIG1heDogMSxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgcmFuZ2U6IDJcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC5qcyc7XG5pbXBvcnQge1xuICAgIFBvc2l0aW9uQ29tcG9uZW50LFxuICAgIFZlbG9jaXR5Q29tcG9uZW50LFxuICAgIElucHV0Q29tcG9uZW50LFxuICAgIFJlbmRlcmFibGVDb21wb25lbnQsXG4gICAgUGxheWVyQ29tcG9uZW50LFxuICAgIEJvbWJDb21wb25lbnRcbn0gZnJvbSAnLi9jb21wb25lbnRzLmpzJztcblxuaW1wb3J0IHsgbW92ZW1lbnRTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvbW92ZW1lbnRTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcmVuZGVyU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL3JlbmRlclN5c3RlbS5qcyc7XG5pbXBvcnQgeyBib21iU3lzdGVtIH0gZnJvbSAnLi9zeXN0ZW1zL2JvbWJTeXN0ZW0uanMnO1xuaW1wb3J0IHsgZGFtYWdlU3lzdGVtLCBjaGVja0V4dHJhTGlmZUNvbGxpc2lvbiwgY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyB9IGZyb20gJy4vc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMnO1xuaW1wb3J0IHsgcG93ZXJVcFN5c3RlbSwgc3Bhd25Qb3dlclVwIH0gZnJvbSAnLi9zeXN0ZW1zL3Bvd2VyVXBTeXN0ZW0uanMnO1xuaW1wb3J0IHsgc2V0Qm9tYnMsIHNldExpdmVzLCBzZXRSYW5nZSwgc2V0U3BlZWQgfSBmcm9tICcuLi9wYWdlcy9nYW1lJztcblxuY29uc3QgVElMRV9TSVpFID0gNjQ7XG5jb25zdCBBTklNQVRJT05fUk9XUyA9IHtcbiAgICBSVU46IHsgdXA6IDM4LCBsZWZ0OiAzOSwgZG93bjogNDAsIHJpZ2h0OiA0MSB9LFxuICAgIElETEU6IHsgdXA6IDIyLCBsZWZ0OiAyMywgZG93bjogMjQsIHJpZ2h0OiAyNSB9XG59O1xuXG5leHBvcnQgY2xhc3MgR2FtZUVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzQ29udGFpbmVyLCBtYXBEYXRhLCBzb2NrZXQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjYW52YXNDb250YWluZXI7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IG1hcERhdGE7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XG4gICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXllckVudGl0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gMDtcbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGFpbWVkUG93ZXJVcHMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgaW5pdChsb2NhbFBsYXllcklkLCBhbGxQbGF5ZXJzKSB7XG4gICAgICAgIHRoaXMudG90YWxQbGF5ZXJzID0gYWxsUGxheWVycy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkID0gU3RyaW5nKGxvY2FsUGxheWVySWQpO1xuXG4gICAgICAgIGFsbFBsYXllcnMuZm9yRWFjaChwRGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IFN0cmluZyhwRGF0YS5pZCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IHBEYXRhLmNvbG9yIHx8IFwid2hpdGVcIjtcblxuICAgICAgICAgICAgcGxheWVyRGl2LmNsYXNzTmFtZSA9IGBwbGF5ZXIgcGxheWVyLSR7Y29sb3J9YDtcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBwbGF5ZXJEaXYuc3R5bGUuekluZGV4ID0gJzEwJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS53aWxsQ2hhbmdlID0gJ3RyYW5zZm9ybSc7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJEaXYpO1xuXG4gICAgICAgICAgICBjb25zdCBzeCA9IHBEYXRhLnggfHwgMTtcbiAgICAgICAgICAgIGNvbnN0IHN5ID0gcERhdGEueSB8fCAxO1xuXG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicsIFBvc2l0aW9uQ29tcG9uZW50KHN4LCBzeSwgVElMRV9TSVpFKSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdWZWxvY2l0eScsIFZlbG9jaXR5Q29tcG9uZW50KDIuNSkpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUmVuZGVyYWJsZScsIFJlbmRlcmFibGVDb21wb25lbnQocGxheWVyRGl2LCA2NCwgNjQsIDQsIDEyKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaXNMb2NhbCA9IHBsYXllcklkID09PSBub3JtYWxpemVkTG9jYWxQbGF5ZXJJZDtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckNvbXAgPSBQbGF5ZXJDb21wb25lbnQocGxheWVySWQsIGNvbG9yLCBpc0xvY2FsKTtcbiAgICAgICAgICAgIHBsYXllckNvbXAubGl2ZXMgPSAzO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5tYXhCb21icyA9IDE7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLmJvbWJSYW5nZSA9IDQ7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInLCBwbGF5ZXJDb21wKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMuc2V0KHBsYXllcklkLCBwbGF5ZXJFbnRpdHkpO1xuXG4gICAgICAgICAgICBpZiAoaXNMb2NhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPSBwbGF5ZXJFbnRpdHk7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQocGxheWVyRW50aXR5LCAnSW5wdXQnLCBJbnB1dENvbXBvbmVudCgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHBsYXllckVudGl0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbR2FtZUVuZ2luZV0gTG9jYWwgcGxheWVyIHdhcyBub3QgZm91bmRcIiwge1xuICAgICAgICAgICAgICAgIGxvY2FsUGxheWVySWQsXG4gICAgICAgICAgICAgICAgcGxheWVyczogYWxsUGxheWVycy5tYXAocGxheWVyID0+IHBsYXllci5pZCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTeXN0ZW1zKCk7XG5cbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChub3cpID0+IHRoaXMuZ2FtZUxvb3Aobm93KSk7XG4gICAgfVxuXG4gICAgc2V0dXBJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgaWYgKCFpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGdldEtleURpcmVjdGlvbiA9IChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd1VwJyB8fCBrZXkgPT09ICd3JyB8fCBrZXkgPT09ICdaJyB8fCBrZXkgPT09ICd6JykgcmV0dXJuICd1cCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dEb3duJyB8fCBrZXkgPT09ICdzJyB8fCBrZXkgPT09ICdTJykgcmV0dXJuICdkb3duJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0xlZnQnIHx8IGtleSA9PT0gJ2EnIHx8IGtleSA9PT0gJ1EnIHx8IGtleSA9PT0gJ3EnKSByZXR1cm4gJ2xlZnQnO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93UmlnaHQnIHx8IGtleSA9PT0gJ2QnIHx8IGtleSA9PT0gJ0QnKSByZXR1cm4gJ3JpZ2h0JztcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5pbnB1dFF1ZXVlLmluY2x1ZGVzKGRpcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZS51bnNoaWZ0KGRpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICcgJyB8fCBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wQm9tYigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleVVwID0gKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IGdldEtleURpcmVjdGlvbihlLmtleSk7XG4gICAgICAgICAgICBpZiAoZGlyICYmIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuaW5wdXRRdWV1ZSA9IGlucHV0LmlucHV0UXVldWUuZmlsdGVyKGQgPT4gZCAhPT0gZGlyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZHJvcEJvbWIoKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcblxuICAgICAgICBjb25zdCBjdXJyZW50Qm9tYnMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuZmlsdGVyKGJFbnRpdHkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGJFbnRpdHksICdCb21iJykub3duZXJJZCA9PT0gcGxheWVyLmlkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY3VycmVudEJvbWJzLmxlbmd0aCA+PSBwbGF5ZXIubWF4Qm9tYnMpIHJldHVybjtcblxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVCb21iKHBsYXllci5pZCwgcG9zLmdyaWRYLCBwb3MuZ3JpZFksIHBsYXllci5ib21iUmFuZ2UpO1xuICAgICAgICBpZiAoIWNyZWF0ZWQpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdEUk9QX0JPTUInLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHsgaWQ6IHBsYXllci5pZCwgeDogcG9zLmdyaWRYLCB5OiBwb3MuZ3JpZFksIHJhbmdlOiBwbGF5ZXIuYm9tYlJhbmdlIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUJvbWIob3duZXJJZCwgZ3JpZFgsIGdyaWRZLCByYW5nZSkge1xuICAgICAgICBjb25zdCBleGlzdHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJykuc29tZShlbnRpdHkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IGJvbWIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCb21iJyk7XG4gICAgICAgICAgICByZXR1cm4gYm9tYi5vd25lcklkID09PSBvd25lcklkICYmIHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGV4aXN0cykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGJvbWJFbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICBjb25zdCBib21iRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGJvbWJEaXYuY2xhc3NOYW1lID0gJ2JvbWInO1xuICAgICAgICBib21iRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgYm9tYkRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3JpZFggKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnRvcCA9IGAke2dyaWRZICogVElMRV9TSVpFfXB4YDtcbiAgICAgICAgYm9tYkRpdi5zdHlsZS56SW5kZXggPSAnNic7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGJvbWJEaXYpO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KGJvbWJFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFgsIGdyaWRZIH0pO1xuXG4gICAgICAgIGNvbnN0IGJvbWJDb21wID0gQm9tYkNvbXBvbmVudChvd25lcklkLCAyMDAwLCByYW5nZSk7XG4gICAgICAgIGJvbWJDb21wLmVsID0gYm9tYkRpdjtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInLCBib21iQ29tcCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZU1vdmUocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltoYW5kbGVSZW1vdGVNb3ZlXSBJbnZhbGlkIHBheWxvYWQ6XCIsIHBheWxvYWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gRW50aXR5IG5vdCBmb3VuZCBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH0uIEF2YWlsYWJsZSBwbGF5ZXJzOmAsIEFycmF5LmZyb20odGhpcy5wbGF5ZXJFbnRpdGllcy5rZXlzKCkpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gSWdub3JpbmcgbG9jYWwgcGxheWVyIHVwZGF0ZSBmb3IgJHtwYXlsb2FkLmlkfWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghcG9zIHx8ICF2ZWwgfHwgIXJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW2hhbmRsZVJlbW90ZU1vdmVdIE1pc3NpbmcgY29tcG9uZW50cyBmb3IgcGxheWVyICR7cGF5bG9hZC5pZH06YCwgeyBwb3M6ICEhcG9zLCB2ZWw6ICEhdmVsLCByZW5kZXJhYmxlOiAhIXJlbmRlcmFibGUgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW2hhbmRsZVJlbW90ZU1vdmVdIFVwZGF0aW5nIHBsYXllciAke3BheWxvYWQuaWR9IHRvICgke3BheWxvYWQuZ3JpZFh9LCAke3BheWxvYWQuZ3JpZFl9KWApO1xuICAgICAgICB2ZWwuZGlyZWN0aW9uID0gcGF5bG9hZC5kaXJlY3Rpb24gfHwgdmVsLmRpcmVjdGlvbjtcbiAgICAgICAgdmVsLmlzTW92aW5nID0gcGF5bG9hZC5pc01vdmluZztcbiAgICAgICAgcG9zLmdyaWRYID0gcGF5bG9hZC5ncmlkWDtcbiAgICAgICAgcG9zLmdyaWRZID0gcGF5bG9hZC5ncmlkWTtcbiAgICAgICAgcG9zLnRhcmdldFggPSBwYXlsb2FkLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcGF5bG9hZC55O1xuICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gcGF5bG9hZC5zdGF0ZSB8fCAocGF5bG9hZC5pc01vdmluZyA/ICdSVU4nIDogJ0lETEUnKTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVCb21iKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8ICFwYXlsb2FkLmlkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3JlYXRlQm9tYihwYXlsb2FkLmlkLCBwYXlsb2FkLngsIHBheWxvYWQueSwgcGF5bG9hZC5yYW5nZSB8fCA0KTtcbiAgICB9XG5cbiAgICBoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKHBheWxvYWQpIHtcbiAgICAgICAgaWYgKCFwYXlsb2FkIHx8IHBheWxvYWQueCA9PT0gdW5kZWZpbmVkIHx8IHBheWxvYWQueSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5yZW1vdmVQb3dlclVwQXQocGF5bG9hZC54LCBwYXlsb2FkLnkpO1xuXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMucGxheWVyRW50aXRpZXMuZ2V0KFN0cmluZyhwYXlsb2FkLmlkKSk7XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCB8fCBlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHJldHVybjtcblxuICAgICAgICB0aGlzLmFwcGx5UG93ZXJVcChlbnRpdHksIHBheWxvYWQudHlwZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlUG93ZXJVcEF0KGdyaWRYLCBncmlkWSkge1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7Z3JpZFh9LCR7Z3JpZFl9YCk7XG4gICAgICAgIGNvbnN0IHBvd2VyVXBzID0gdGhpcy53b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUG93ZXJVcCcpO1xuXG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHBvd2VyVXBzKSB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgcG93ZXJVcCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvd2VyVXAnKTtcbiAgICAgICAgICAgIGlmICghcG9zIHx8ICFwb3dlclVwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKHBvcy5ncmlkWCA9PT0gZ3JpZFggJiYgcG9zLmdyaWRZID09PSBncmlkWSkge1xuICAgICAgICAgICAgICAgIHBvd2VyVXAucGlja2VkVXAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBvd2VyVXAuZWwgJiYgcG93ZXJVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvd2VyVXAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3dlclVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmRlc3Ryb3lFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseVBvd2VyVXAoZW50aXR5LCB0eXBlKSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAnU1BFRUQnKSB7XG4gICAgICAgICAgICB2ZWxvY2l0eS5zcGVlZCA9IE1hdGgubWluKHZlbG9jaXR5LnNwZWVkICsgMSwgOCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0ZMQU1FJykge1xuICAgICAgICAgICAgcGxheWVyLmJvbWJSYW5nZSA9IHBsYXllci5ib21iUmFuZ2UgPyBwbGF5ZXIuYm9tYlJhbmdlICsgMSA6IDU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWdpc3RlclN5c3RlbXMoKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZU1hcENlbGwgPSAoeCwgeSwgbmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXBEYXRhW3ldKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMubWFwRGF0YVt5XVt4XSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWApO1xuICAgICAgICAgICAgaWYgKCF0aWxlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRpbGUuY2xhc3NOYW1lID0gJ3RpbGUgdGlsZS1mbG9vcic7XG4gICAgICAgICAgICB0aWxlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIpJztcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkZXN0cm95Qm94Q2FsbGJhY2sgPSAoeCwgeSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xhaW1lZFBvd2VyVXBzLmhhcyhgJHt4fSwke3l9YCkpIHJldHVybjtcbiAgICAgICAgICAgIHNwYXduUG93ZXJVcCh0aGlzLndvcmxkLCB4LCB5LCB0aGlzLmNvbnRhaW5lciwgVElMRV9TSVpFKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBsYXllckh1cnQgPSAoZW50aXR5LCBpZCwgcmVtYWluaW5nTGl2ZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgICAgICAgICBzZXRMaXZlcyhyZW1haW5pbmdMaXZlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25Qb3dlclVwUGlja2VkID0gKGlkLCB0eXBlLCB4LCB5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcy5hZGQoYCR7eH0sJHt5fWApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sb2NhbFBsYXllckVudGl0eSA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAocGxheWVyICYmIHBsYXllci5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUh1ZFN0YXRzKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPV0VSVVBfUElDS0VEJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZCwgdHlwZSwgeCwgeSB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYnJvYWRjYXN0TW92ZW1lbnQgPSAoZW50aXR5LCB4LCB5LCBncmlkWCwgZ3JpZFksIGRpcmVjdGlvbiwgaXNNb3ZpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXRoaXMuc29ja2V0IHx8IHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdNT1ZFX1NUQVRFJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBwbGF5ZXIuaWQsXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBncmlkWSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICBpc01vdmluZyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IGlzTW92aW5nID8gJ1JVTicgOiAnSURMRScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBtb3ZlbWVudFN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gYm9tYlN5c3RlbSh3LCBkdCwgbm93LCB0aGlzLm1hcERhdGEsIHVwZGF0ZU1hcENlbGwsIGRlc3Ryb3lCb3hDYWxsYmFjaywgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBkYW1hZ2VTeXN0ZW0odywgbm93LCBvblBsYXllckh1cnQsIFRJTEVfU0laRSkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcG93ZXJVcFN5c3RlbSh3LCBvblBvd2VyVXBQaWNrZWQpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IHJlbmRlclN5c3RlbSh3LCBkdCwgbm93LCBBTklNQVRJT05fUk9XUykpO1xuICAgIH1cblxuICAgIGdhbWVMb29wKG5vdykge1xuICAgICAgICBpZiAoIXRoaXMucnVubmluZykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGR0ID0gbm93IC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IG5vdztcbiAgICAgICAgdGhpcy53b3JsZC51cGRhdGUoZHQsIG5vdyk7XG4gICAgICAgIFxuICAgICAgICAvLyBDaGVjayBmb3IgZXh0cmEgbGlmZSBjb2xsaXNpb24gd2l0aCBwbGF5ZXJzXG4gICAgICAgIGNoZWNrRXh0cmFMaWZlQ29sbGlzaW9uKHRoaXMud29ybGQsIFRJTEVfU0laRSk7XG4gICAgICAgIFxuICAgICAgICAvLyBDaGVjayBmb3IgZ2FtZSBlbmQgY29uZGl0aW9ucyAod2luL2xvc3MpXG4gICAgICAgIGNoZWNrR2FtZUVuZENvbmRpdGlvbnModGhpcy53b3JsZCwgdGhpcy5sb2NhbFBsYXllckVudGl0eSwgdGhpcy5wbGF5ZXJFbnRpdGllcywgdGhpcy50b3RhbFBsYXllcnMpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgobmV4dE5vdykgPT4gdGhpcy5nYW1lTG9vcChuZXh0Tm93KSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW5wdXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUh1ZFN0YXRzKGVudGl0eSkge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBpZiAoIXBsYXllciB8fCAhdmVsb2NpdHkpIHJldHVybjtcblxuICAgICAgICBzZXRCb21icyhwbGF5ZXIubWF4Qm9tYnMgfHwgMSk7XG4gICAgICAgIHNldExpdmVzKHBsYXllci5saXZlcyA/PyAzKTtcbiAgICAgICAgc2V0UmFuZ2UocGxheWVyLmJvbWJSYW5nZSB8fCA0KTtcbiAgICAgICAgc2V0U3BlZWQoTWF0aC5yb3VuZCh2ZWxvY2l0eS5zcGVlZCkpO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRMb2NhbFBsYXllck5hbWUgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGxheWVyTmFtZShuYW1lKSB7XG4gICAgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IG5hbWU7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIiwgbmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcIiwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lIHx8IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9tYmVybWFuX3BsYXllcl9uYW1lXCIpIHx8IFwiUGxheWVyXCI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYm9tYlN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3QgYm9tYnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnQm9tYicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgYm9tYkVudGl0eSBvZiBib21icykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IGJvbWIgPSB3b3JsZC5nZXRDb21wb25lbnQoYm9tYkVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgXG4gICAgICAgIGJvbWIudGltZXIgLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoYm9tYi50aW1lciA8PSAwICYmICFib21iLmV4cGxvZGVkKSB7XG4gICAgICAgICAgICBib21iLmV4cGxvZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgYWZmZWN0ZWRDZWxscyA9IGNhbGN1bGF0ZUV4cGxvc2lvbkNlbGxzKHBvcy5ncmlkWCwgcG9zLmdyaWRZLCBib21iLnJhbmdlLCBtYXBEYXRhKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWZmZWN0ZWRDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGV4cERpdi5jbGFzc05hbWUgPSAnZXhwbG9zaW9uJztcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5sZWZ0ID0gYCR7Y2VsbC54ICogdGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS50b3AgPSBgJHtjZWxsLnkgKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnpJbmRleCA9ICc3JztcblxuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicsIHsgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRYOiBjZWxsLngsIFxuICAgICAgICAgICAgICAgICAgICBncmlkWTogY2VsbC55LCBcbiAgICAgICAgICAgICAgICAgICAgeDogY2VsbC54ICogdGlsZVNpemUsIFxuICAgICAgICAgICAgICAgICAgICB5OiBjZWxsLnkgKiB0aWxlU2l6ZSBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b3JsZC5hZGRDb21wb25lbnQoZXhwRW50aXR5LCAnRXhwbG9zaW9uJywgeyBkdXJhdGlvbjogNTAwLCBlbDogZXhwRGl2IH0pO1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChleHBEaXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhW2NlbGwueV0gJiYgbWFwRGF0YVtjZWxsLnldW2NlbGwueF0gPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTWFwQ2VsbChjZWxsLngsIGNlbGwueSwgMik7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzdHJveUJveENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95Qm94Q2FsbGJhY2soY2VsbC54LCBjZWxsLnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChib21iLmVsICYmIGJvbWIuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGJvbWIuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChib21iLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoYm9tYkVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3QgZXhwbG9zaW9ucyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdFeHBsb3Npb24nKTtcbiAgICBmb3IgKGNvbnN0IGV4cEVudGl0eSBvZiBleHBsb3Npb25zKSB7XG4gICAgICAgIGNvbnN0IGV4cCA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nKTtcbiAgICAgICAgZXhwLmR1cmF0aW9uIC09IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGV4cC5kdXJhdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICBpZiAoZXhwLmVsICYmIGV4cC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZXhwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXhwLmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkoZXhwRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMoYngsIGJ5LCByYW5nZSwgbWFwRGF0YSkge1xuICAgIGNvbnN0IGNlbGxzID0gW3sgeDogYngsIHk6IGJ5IH1dO1xuICAgIGNvbnN0IGRpcmVjdGlvbnMgPSBbXG4gICAgICAgIHsgeDogMCwgeTogLTEgfSxcbiAgICAgICAgeyB4OiAwLCB5OiAxIH0sXG4gICAgICAgIHsgeDogLTEsIHk6IDAgfSxcbiAgICAgICAgeyB4OiAxLCB5OiAwIH1cbiAgICBdO1xuICAgIFxuICAgIGNvbnN0IHN0ZXBzID0gcmFuZ2UgLSAxOyBcbiAgICBcbiAgICBkaXJlY3Rpb25zLmZvckVhY2goZGlyID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdHggPSBieCArIChkaXIueCAqIGkpO1xuICAgICAgICAgICAgY29uc3QgdHkgPSBieSArIChkaXIueSAqIGkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW1hcERhdGFbdHldIHx8IG1hcERhdGFbdHldW3R4XSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY2VsbFR5cGUgPSBtYXBEYXRhW3R5XVt0eF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjZWxscy5wdXNoKHsgeDogdHgsIHk6IHR5IH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBjZWxscztcbn1cbiIsIi8qKlxuICogQ3JlYXRlcyBhIExvc3MgcG9wLXVwIG1vZGFsIGZvciB0aGUgZWxpbWluYXRlZCBwbGF5ZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGxheWVyTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBlbGltaW5hdGVkIHBsYXllclxuICovXG5mdW5jdGlvbiBzaG93TG9zc1BvcHVwKHBsYXllck5hbWUpIHtcbiAgICAvLyBDaGVjayBpZiBwb3B1cCBhbHJlYWR5IGV4aXN0cyB0byBhdm9pZCBkdXBsaWNhdGVzXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLXJlc3VsdC1wb3B1cCcpKSByZXR1cm47XG4gICAgXG4gICAgLy8gQ3JlYXRlIG92ZXJsYXlcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3ZlcmxheS5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtcG9wdXAgbG9zcyc7XG4gICAgXG4gICAgLy8gQ3JlYXRlIHBvcHVwIGNvbnRlbnRcbiAgICBjb25zdCBwb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBvcHVwLmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1wb3B1cC1jb250ZW50JztcbiAgICBcbiAgICBjb25zdCB0aXRsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gJ1lPVSBMT1NUJztcbiAgICB0aXRsZUVsLmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC10aXRsZSc7XG4gICAgXG4gICAgY29uc3QgbWVzc2FnZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIG1lc3NhZ2VFbC50ZXh0Q29udGVudCA9IGAke3BsYXllck5hbWV9LCB5b3UgaGF2ZSBiZWVuIGVsaW1pbmF0ZWQhYDtcbiAgICBtZXNzYWdlRWwuY2xhc3NOYW1lID0gJ2dhbWUtcmVzdWx0LW1lc3NhZ2UnO1xuICAgIFxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9ICdSZWxvYWQgUGFnZSc7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1idXR0b24nO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuICAgIFxuICAgIHBvcHVwLmFwcGVuZENoaWxkKHRpdGxlRWwpO1xuICAgIHBvcHVwLmFwcGVuZENoaWxkKG1lc3NhZ2VFbCk7XG4gICAgcG9wdXAuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBvdmVybGF5LmFwcGVuZENoaWxkKHBvcHVwKTtcbiAgICBcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBXaW4gcG9wLXVwIG1vZGFsIGZvciB0aGUgdmljdG9yaW91cyBwbGF5ZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGxheWVyTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSB3aW5uaW5nIHBsYXllclxuICovXG5mdW5jdGlvbiBzaG93V2luUG9wdXAocGxheWVyTmFtZSkge1xuICAgIC8vIENoZWNrIGlmIHBvcHVwIGFscmVhZHkgZXhpc3RzIHRvIGF2b2lkIGR1cGxpY2F0ZXNcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtcmVzdWx0LXBvcHVwJykpIHJldHVybjtcbiAgICBcbiAgICAvLyBDcmVhdGUgb3ZlcmxheVxuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdmVybGF5LmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1wb3B1cCB3aW4nO1xuICAgIFxuICAgIC8vIENyZWF0ZSBwb3B1cCBjb250ZW50XG4gICAgY29uc3QgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwb3B1cC5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtcG9wdXAtY29udGVudCc7XG4gICAgXG4gICAgY29uc3QgdGl0bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9ICdZT1UgV09OISc7XG4gICAgdGl0bGVFbC5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtdGl0bGUnO1xuICAgIFxuICAgIGNvbnN0IG1lc3NhZ2VFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBtZXNzYWdlRWwudGV4dENvbnRlbnQgPSBgQ29uZ3JhdHVsYXRpb25zICR7cGxheWVyTmFtZX0sIHlvdSBhcmUgdGhlIGxhc3Qgb25lIHN0YW5kaW5nIWA7XG4gICAgbWVzc2FnZUVsLmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1tZXNzYWdlJztcbiAgICBcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSAnUmVsb2FkIFBhZ2UnO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtYnV0dG9uJztcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcbiAgICBcbiAgICBwb3B1cC5hcHBlbmRDaGlsZCh0aXRsZUVsKTtcbiAgICBwb3B1cC5hcHBlbmRDaGlsZChtZXNzYWdlRWwpO1xuICAgIHBvcHVwLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgb3ZlcmxheS5hcHBlbmRDaGlsZChwb3B1cCk7XG4gICAgXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHBsYXllciBkZWF0aCB0cmFuc2l0aW9uIHdoZW4gbGl2ZXMgcmVhY2ggMC5cbiAqIFJlbW92ZXMgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGFuZCBzcGF3bnMgYW4gZXh0cmEtbGlmZSBkcm9wIGF0IHRoZSBkZWF0aCBsb2NhdGlvbi5cbiAqIFxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckVudGl0eSAtIFRoZSBlbnRpdHkgSUQgb2YgdGhlIGR5aW5nIHBsYXllclxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgY29udGFpbmVyID0gbnVsbCkge1xuICAgIC8vIEdldCB0aGUgcGxheWVyJ3MgY29tcG9uZW50c1xuICAgIGNvbnN0IHBvc2l0aW9uID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgIFxuICAgIGlmICghcG9zaXRpb24gfHwgIXJlbmRlcmFibGUgfHwgIXBsYXllcikgcmV0dXJuO1xuICAgIFxuICAgIC8vIFN0b3JlIHRoZSBncmlkIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwbGF5ZXIgZGllZFxuICAgIGNvbnN0IGRlYXRoR3JpZFggPSBNYXRoLmZsb29yKChwb3NpdGlvbi54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICBjb25zdCBkZWF0aEdyaWRZID0gTWF0aC5mbG9vcigocG9zaXRpb24ueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgXG4gICAgLy8gMS4gUmVtb3ZlIHRoZSBwbGF5ZXIncyBET00gZWxlbWVudCBlbnRpcmVseVxuICAgIGlmIChyZW5kZXJhYmxlLmVsICYmIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocmVuZGVyYWJsZS5lbCk7XG4gICAgfVxuICAgIFxuICAgIC8vIDIuIERlc3Ryb3kgdGhlIHBsYXllciBlbnRpdHkgZnJvbSB0aGUgd29ybGQgKHJlbW92ZXMgYWxsIGNvbXBvbmVudHMpXG4gICAgd29ybGQuZGVzdHJveUVudGl0eShwbGF5ZXJFbnRpdHkpO1xuICAgIFxuICAgIC8vIDMuIENyZWF0ZSBhbiBpbWcgZWxlbWVudCBhdCB0aGUgZXhhY3QgZGVhdGggbG9jYXRpb24gd2l0aCBoZWFydCBpbWFnZVxuICAgIGNvbnN0IGhlYXJ0SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaGVhcnRJbWcuY2xhc3NOYW1lID0gJ2V4dHJhLWxpZmUtZHJvcCc7XG4gICAgaGVhcnRJbWcuc3JjID0gJy4uLy4uL2Fzc2V0cy9pbWFnZXMvaGVhcnQucG5nJzsgLy8gUGF0aCB0byBoZWFydCBpbWFnZSAoYWRqdXN0IGFzIG5lZWRlZClcbiAgICBoZWFydEltZy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgaGVhcnRJbWcuc3R5bGUubGVmdCA9IGAke2RlYXRoR3JpZFggKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnRJbWcuc3R5bGUudG9wID0gYCR7ZGVhdGhHcmlkWSAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydEltZy5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydEltZy5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnRJbWcuc3R5bGUuekluZGV4ID0gJzUnO1xuICAgIGhlYXJ0SW1nLnN0eWxlLm9iamVjdEZpdCA9ICdjb250YWluJztcbiAgICBoZWFydEltZy5zdHlsZS5hbmltYXRpb24gPSAncHVsc2UgMXMgZWFzZS1pbi1vdXQgaW5maW5pdGUnO1xuICAgIFxuICAgIC8vIEFwcGVuZCB0byB0aGUgZ2FtZSBjb250YWluZXJcbiAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgIGdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoaGVhcnRJbWcpO1xuICAgIH1cbiAgICBcbiAgICBjb25zb2xlLmxvZyhgW1BsYXllciBEZWF0aF0gUGxheWVyICR7cGxheWVyLmlkfSBkaWVkIGF0ICgke2RlYXRoR3JpZFh9LCAke2RlYXRoR3JpZFl9KS4gSGVhcnQgZHJvcHBlZC5gKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgZm9yIGNvbGxpc2lvbiBiZXR3ZWVuIHBsYXllcnMgYW5kIGV4dHJhLWxpZmUtZHJvcCBET00gZWxlbWVudHMuXG4gKiBXaGVuIGEgcGxheWVyIGNvbGxpZGVzIHdpdGggYW4gZXh0cmEtbGlmZS1kcm9wLCB0aGV5IGdhaW4gKzEgbGlmZSBhbmQgdGhlIGRyb3AgaXMgcmVtb3ZlZC5cbiAqIE9ubHkgdGhlIGZpcnN0IHBsYXllciB0byB0b3VjaCBpdCBnZXRzIHRoZSBsaWZlLlxuICogXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gdGlsZVNpemUgLSBUaGUgc2l6ZSBvZiBlYWNoIGdyaWQgdGlsZSAoZGVmYXVsdDogNjQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0V4dHJhTGlmZUNvbGxpc2lvbih3b3JsZCwgdGlsZVNpemUgPSA2NCkge1xuICAgIC8vIEZpbmQgYWxsIGV4dHJhLWxpZmUtZHJvcCBlbGVtZW50cyBpbiB0aGUgRE9NXG4gICAgY29uc3QgZXh0cmFMaWZlRHJvcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZXh0cmEtbGlmZS1kcm9wJyk7XG4gICAgaWYgKGV4dHJhTGlmZURyb3BzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIFxuICAgIC8vIEdldCBhbGwgYWN0aXZlIHBsYXllcnMgd2l0aCBQb3NpdGlvbiBhbmQgUGxheWVyIGNvbXBvbmVudHNcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1BsYXllcicpO1xuICAgIGlmIChwbGF5ZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIFxuICAgIGZvciAoY29uc3QgZHJvcCBvZiBleHRyYUxpZmVEcm9wcykge1xuICAgICAgICAvLyBQYXJzZSB0aGUgZ3JpZCBwb3NpdGlvbiBmcm9tIHRoZSBkcm9wJ3MgQ1NTIGxlZnQvdG9wIHByb3BlcnRpZXNcbiAgICAgICAgY29uc3QgZHJvcExlZnQgPSBwYXJzZUludChkcm9wLnN0eWxlLmxlZnQsIDEwKTtcbiAgICAgICAgY29uc3QgZHJvcFRvcCA9IHBhcnNlSW50KGRyb3Auc3R5bGUudG9wLCAxMCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoaXNOYU4oZHJvcExlZnQpIHx8IGlzTmFOKGRyb3BUb3ApKSBjb250aW51ZTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRyb3BHcmlkWCA9IE1hdGgucm91bmQoZHJvcExlZnQgLyB0aWxlU2l6ZSk7XG4gICAgICAgIGNvbnN0IGRyb3BHcmlkWSA9IE1hdGgucm91bmQoZHJvcFRvcCAvIHRpbGVTaXplKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFwUG9zIHx8ICFwbGF5ZXIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgcGxheWVyJ3MgY3VycmVudCBncmlkIHBvc2l0aW9uXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWCA9IE1hdGguZmxvb3IoKHBQb3MueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWSA9IE1hdGguZmxvb3IoKHBQb3MueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBjb2xsaXNpb24gKHNhbWUgZ3JpZCBjZWxsKVxuICAgICAgICAgICAgaWYgKHBsYXllckdyaWRYID09PSBkcm9wR3JpZFggJiYgcGxheWVyR3JpZFkgPT09IGRyb3BHcmlkWSkge1xuICAgICAgICAgICAgICAgIC8vIEluY3JlYXNlIHBsYXllcidzIGxpdmVzIGJ5ICsxXG4gICAgICAgICAgICAgICAgcGxheWVyLmxpdmVzID0gKHBsYXllci5saXZlcyA/PyAwKSArIDE7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBleHRyYS1saWZlLWRyb3AgZnJvbSBET01cbiAgICAgICAgICAgICAgICBpZiAoZHJvcC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRyb3AucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtFeHRyYSBMaWZlXSBQbGF5ZXIgJHtwbGF5ZXIuaWR9IHBpY2tlZCB1cCBhbiBleHRyYSBsaWZlISBMaXZlczogJHtwbGF5ZXIubGl2ZXN9YCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQnJlYWsgb3V0IG9mIHRoZSBpbm5lciBsb29wIHNpbmNlIHRoaXMgZHJvcCBpcyBub3cgZ29uZVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIENoZWNrcyBmb3IgcGxheWVyIGRlYXRocyBhbmQgZ2FtZSBlbmQgY29uZGl0aW9ucy5cbiAqIFNob3dzIExvc3MgcG9wLXVwIGZvciBlbGltaW5hdGVkIHBsYXllcnMgYW5kIFdpbiBwb3AtdXAgZm9yIHRoZSBsYXN0IHN1cnZpdm9yLlxuICogXG4gKiBAcGFyYW0ge1dvcmxkfSB3b3JsZCAtIFRoZSBnYW1lIHdvcmxkIGluc3RhbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gbG9jYWxQbGF5ZXJFbnRpdHkgLSBUaGUgbG9jYWwgcGxheWVyJ3MgZW50aXR5IElEXG4gKiBAcGFyYW0ge01hcH0gcGxheWVyRW50aXRpZXMgLSBNYXAgb2YgcGxheWVyIElEcyB0byBlbnRpdHkgSURzXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxQbGF5ZXJzIC0gVG90YWwgbnVtYmVyIG9mIHBsYXllcnMgYXQgZ2FtZSBzdGFydFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyh3b3JsZCwgbG9jYWxQbGF5ZXJFbnRpdHksIHBsYXllckVudGl0aWVzLCB0b3RhbFBsYXllcnMpIHtcbiAgICAvLyBDb3VudCBhY3RpdmUgcGxheWVycyAocGxheWVycyB3aXRoIGxpdmVzID4gMClcbiAgICBjb25zdCBhbGxQbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1BsYXllcicpO1xuICAgIGxldCBhY3RpdmVQbGF5ZXJDb3VudCA9IDA7XG4gICAgbGV0IGxhc3RBY3RpdmVQbGF5ZXJFbnRpdHkgPSBudWxsO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIGFsbFBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAocGxheWVyICYmIChwbGF5ZXIubGl2ZXMgPz8gMCkgPiAwKSB7XG4gICAgICAgICAgICBhY3RpdmVQbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgbGFzdEFjdGl2ZVBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayBpZiBsb2NhbCBwbGF5ZXIgaXMgZWxpbWluYXRlZFxuICAgIGlmIChsb2NhbFBsYXllckVudGl0eSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBsb2NhbFBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChsb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAobG9jYWxQbGF5ZXIgJiYgKGxvY2FsUGxheWVyLmxpdmVzID8/IDApIDw9IDApIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGFscmVhZHkgc2hvd2VkIGxvc3MgcG9wdXBcbiAgICAgICAgICAgIGlmICghZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtcmVzdWx0LXBvcHVwJykpIHtcbiAgICAgICAgICAgICAgICBzaG93TG9zc1BvcHVwKGxvY2FsUGxheWVyLmlkIHx8ICdQbGF5ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayB3aW4gY29uZGl0aW9uOiBFWEFDVExZIDEgYWN0aXZlIHBsYXllciByZW1haW5zIG9uIHRoZSBib2FyZFxuICAgIGlmIChhY3RpdmVQbGF5ZXJDb3VudCA9PT0gMSAmJiB0b3RhbFBsYXllcnMgPiAxICYmIGxhc3RBY3RpdmVQbGF5ZXJFbnRpdHkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgbGFzdFBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChsYXN0QWN0aXZlUGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmIChsYXN0UGxheWVyKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGlzIHRoZSBsb2NhbCBwbGF5ZXJcbiAgICAgICAgICAgIGlmIChsb2NhbFBsYXllckVudGl0eSAhPT0gbnVsbCAmJiBsYXN0QWN0aXZlUGxheWVyRW50aXR5ID09PSBsb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIGlmICghZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtcmVzdWx0LXBvcHVwJykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd1dpblBvcHVwKGxhc3RQbGF5ZXIuaWQgfHwgJ1BsYXllcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhbWFnZVN5c3RlbSh3b3JsZCwgbm93LCBvblBsYXllckh1cnQsIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1BsYXllcicpO1xuICAgIGNvbnN0IGV4cGxvc2lvbnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnRXhwbG9zaW9uJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgcGxheWVycykge1xuICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChwbGF5ZXIuaW52aW5jaWJsZVVudGlsICYmIHBsYXllci5pbnZpbmNpYmxlVW50aWwgPiBub3cpIGNvbnRpbnVlO1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBleHBFbnRpdHkgb2YgZXhwbG9zaW9ucykge1xuICAgICAgICAgICAgY29uc3QgZVBvcyA9IHdvcmxkLmdldENvbXBvbmVudChleHBFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyhHcmlkLWJhc2VkIGNvbGxpc2lvbilcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRYID0gTWF0aC5mbG9vcigocFBvcy54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckdyaWRZID0gTWF0aC5mbG9vcigocFBvcy55ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcblxuICAgICAgICAgICAgaWYgKHBsYXllckdyaWRYID09PSBlUG9zLmdyaWRYICYmIHBsYXllckdyaWRZID09PSBlUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNMaXZlcyA9IHBsYXllci5saXZlcyA/PyAzO1xuICAgICAgICAgICAgICAgIHBsYXllci5saXZlcyA9IE1hdGgubWF4KHByZXZpb3VzTGl2ZXMgLSAxLCAwKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID0gbm93ICsgMTUwMDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgZGVhdGggd2hlbiBsaXZlcyByZWFjaCAwXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5saXZlcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVBsYXllckRlYXRoKHdvcmxkLCBwbGF5ZXJFbnRpdHksIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG9uUGxheWVySHVydCkge1xuICAgICAgICAgICAgICAgICAgICBvblBsYXllckh1cnQocGxheWVyRW50aXR5LCBwbGF5ZXIuaWQsIHBsYXllci5saXZlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIG1vdmVtZW50U3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB0aWxlU2l6ZSA9IDQwKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknKTtcbiAgICBjb25zdCBkZWx0YSA9IGR0IC8gMTYuNjc7XG5cbiAgICBjb25zdCBQTEFZRVJfU0laRSA9IHRpbGVTaXplO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCBpbnB1dCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBjb25zdCBiZWhhdmlvciA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdCZWhhdmlvcicpO1xuXG4gICAgICAgIGlmIChiZWhhdmlvcikge1xuICAgICAgICAgICAgdmVsLnNwZWVkID0gdmVsLmJhc2VTcGVlZCArIChiZWhhdmlvci5mYXN0U2hvZXNMZXZlbCAtIDEpICogMC41O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmVsLnNwZWVkID0gdmVsLmJhc2VTcGVlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIG1vdmVUb3dhcmRUYXJnZXQocG9zLCB2ZWwsIGRlbHRhKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWN0aXZlSW5wdXQgPSBpbnB1dC5pbnB1dFF1ZXVlWzBdO1xuICAgICAgICBsZXQgZHggPSAwO1xuICAgICAgICBsZXQgZHkgPSAwO1xuXG4gICAgICAgIGlmIChhY3RpdmVJbnB1dCA9PT0gJ3VwJykge1xuICAgICAgICAgICAgZHkgPSAtMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAndXAnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnZG93bicpIHtcbiAgICAgICAgICAgIGR5ID0gMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAnZG93bic7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgZHggPSAtMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAnbGVmdCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5wdXQgPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgIGR4ID0gMTtcbiAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24gPSAncmlnaHQnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGFzSW5wdXQgPSBkeCAhPT0gMCB8fCBkeSAhPT0gMDtcblxuICAgICAgICBpZiAoIWhhc0lucHV0KSB7XG4gICAgICAgICAgICBwb3MudGFyZ2V0WCA9IHBvcy54O1xuICAgICAgICAgICAgcG9zLnRhcmdldFkgPSBwb3MueTtcbiAgICAgICAgICAgIHZlbC5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgICAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSAnSURMRSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBvcy5ncmlkWCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBwb3MuZ3JpZFkgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICAgICAgd29ybGQuYnJvYWRjYXN0TW92ZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgICAgIHBvcy55LFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICAgICAgdmVsLmRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdmVsLmlzTW92aW5nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFggPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGNvbnN0IHNuYXBUaHJlc2hvbGQgPSAzMjtcblxuICAgICAgICBpZiAoZHkgIT09IDAgJiYgZHggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChpc0Jsb2NrZWQocG9zLngsIG5leHRZLCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbGVYID0gTWF0aC5mbG9vcigocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFggPSBjdXJyZW50VGlsZVggKiB0aWxlU2l6ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmWCA9IHBvcy54IC0gdGFyZ2V0WDtcblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaWZmWCkgPCBzbmFwVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZHggPSAtTWF0aC5zaWduKGRpZmZYKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHggIT09IDAgJiYgZHkgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChpc0Jsb2NrZWQobmV4dFgsIHBvcy55LCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbGVZID0gTWF0aC5mbG9vcigocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFkgPSBjdXJyZW50VGlsZVkgKiB0aWxlU2l6ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmWSA9IHBvcy55IC0gdGFyZ2V0WTtcblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaWZmWSkgPCBzbmFwVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZHkgPSAtTWF0aC5zaWduKGRpZmZZKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0WEFmdGVyU25hcCA9IHBvcy54ICsgZHggKiB2ZWwuc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgY29uc3QgbmV4dFlBZnRlclNuYXAgPSBwb3MueSArIGR5ICogdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmICFpc0Jsb2NrZWQobmV4dFhBZnRlclNuYXAsIHBvcy55LCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICBwb3MueCA9IG5leHRYQWZ0ZXJTbmFwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmICFpc0Jsb2NrZWQocG9zLngsIG5leHRZQWZ0ZXJTbmFwLCBtYXBEYXRhLCB0aWxlU2l6ZSwgUExBWUVSX1NJWkUpKSB7XG4gICAgICAgICAgICBwb3MueSA9IG5leHRZQWZ0ZXJTbmFwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmVsLmlzTW92aW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcbiAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSAnUlVOJztcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcy5ncmlkWCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAocG9zLnggKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBwb3MuZ3JpZFkgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwb3MueTtcblxuICAgICAgICBpZiAod29ybGQuYnJvYWRjYXN0TW92ZW1lbnQpIHtcbiAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgIGVudGl0eSxcbiAgICAgICAgICAgICAgICBwb3MueCxcbiAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICBwb3MuZ3JpZFgsXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRZLFxuICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgdmVsLmlzTW92aW5nXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSkge1xuICAgIGNvbnN0IHN0ZXAgPSB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgIGlmIChwb3MueCA8IHBvcy50YXJnZXRYKSB7XG4gICAgICAgIHBvcy54ID0gTWF0aC5taW4ocG9zLnggKyBzdGVwLCBwb3MudGFyZ2V0WCk7XG4gICAgfSBlbHNlIGlmIChwb3MueCA+IHBvcy50YXJnZXRYKSB7XG4gICAgICAgIHBvcy54ID0gTWF0aC5tYXgocG9zLnggLSBzdGVwLCBwb3MudGFyZ2V0WCk7XG4gICAgfVxuXG4gICAgaWYgKHBvcy55IDwgcG9zLnRhcmdldFkpIHtcbiAgICAgICAgcG9zLnkgPSBNYXRoLm1pbihwb3MueSArIHN0ZXAsIHBvcy50YXJnZXRZKTtcbiAgICB9IGVsc2UgaWYgKHBvcy55ID4gcG9zLnRhcmdldFkpIHtcbiAgICAgICAgcG9zLnkgPSBNYXRoLm1heChwb3MueSAtIHN0ZXAsIHBvcy50YXJnZXRZKTtcbiAgICB9XG5cbiAgICB2ZWwuaXNNb3ZpbmcgPVxuICAgICAgICBwb3MueCAhPT0gcG9zLnRhcmdldFggfHxcbiAgICAgICAgcG9zLnkgIT09IHBvcy50YXJnZXRZO1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrZWQoeCwgeSwgbWFwRGF0YSwgdGlsZVNpemUsIHBsYXllclNpemUgPSB0aWxlU2l6ZSkge1xuICAgIGNvbnN0IHBhZGRpbmcgPSA0O1xuXG4gICAgY29uc3QgbGVmdCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh4ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCByaWdodCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh4ICsgcGxheWVyU2l6ZSAtIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgdG9wID0gTWF0aC5mbG9vcihcbiAgICAgICAgKHkgKyBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IGJvdHRvbSA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGxheWVyU2l6ZSAtIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChsZWZ0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwocmlnaHQsIHRvcCwgbWFwRGF0YSkgfHxcbiAgICAgICAgaXNCbG9ja2VkQ2VsbChsZWZ0LCBib3R0b20sIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwocmlnaHQsIGJvdHRvbSwgbWFwRGF0YSlcbiAgICApO1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrZWRDZWxsKHgsIHksIG1hcERhdGEpIHtcbiAgICBjb25zdCBjZWxsID0gbWFwRGF0YVt5XSAmJiBtYXBEYXRhW3ldW3hdO1xuXG4gICAgcmV0dXJuIGNlbGwgIT09IDAgJiYgY2VsbCAhPT0gMjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBwb3dlclVwU3lzdGVtKHdvcmxkLCBvblBvd2VyVXBQaWNrZWQpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5JywgJ1BsYXllcicpO1xuICAgIGNvbnN0IHBvd2VyVXBzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1Bvd2VyVXAnKTtcblxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBpZiAoIXBQb3MgfHwgIXZlbCB8fCAhcGxheWVyKSBjb250aW51ZTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBVcEVudGl0eSBvZiBwb3dlclVwcykge1xuICAgICAgICAgICAgY29uc3QgdXBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocFVwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHBVcCA9IHdvcmxkLmdldENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJyk7XG4gICAgICAgICAgICBpZiAoIXVwUG9zIHx8ICFwVXAgfHwgcFVwLnBpY2tlZFVwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKHBQb3MuZ3JpZFggPT09IHVwUG9zLmdyaWRYICYmIHBQb3MuZ3JpZFkgPT09IHVwUG9zLmdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcFVwLnBpY2tlZFVwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChwVXAudHlwZSA9PT0gJ1NQRUVEJykge1xuICAgICAgICAgICAgICAgICAgICB2ZWwuc3BlZWQgPSBNYXRoLm1pbih2ZWwuc3BlZWQgKyAxLCA4KTsgXG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0JPTUJTJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBVcC50eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5ib21iUmFuZ2UgPSBwbGF5ZXIuYm9tYlJhbmdlID8gcGxheWVyLmJvbWJSYW5nZSArIDEgOiA1O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwVXAuZWwgJiYgcFVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcFVwLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocFVwLmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob25Qb3dlclVwUGlja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uUG93ZXJVcFBpY2tlZChwbGF5ZXIuaWQsIHBVcC50eXBlLCB1cFBvcy5ncmlkWCwgdXBQb3MuZ3JpZFkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdvcmxkLmRlc3Ryb3lFbnRpdHkocFVwRW50aXR5KTtcbiAgICAgICAgICAgICAgICBicmVhazsgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGF3blBvd2VyVXAod29ybGQsIGd4LCBneSwgY29udGFpbmVyLCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3Qgc2VlZCA9IGd4ICogNzM4NTYwOTMgXiBneSAqIDE5MzQ5NjYzO1xuICAgIGNvbnN0IHNlZWRSYW5kb20gPSAoTWF0aC5zaW4oc2VlZCkgKiAxMDAwMCkgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQpICogMTAwMDApO1xuICAgIFxuICAgIGlmIChzZWVkUmFuZG9tID4gMC4zNSkgcmV0dXJuO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbJ1NQRUVEJywgJ0JPTUJTJywgJ0ZMQU1FJ107XG4gICAgY29uc3QgdHlwZUluZGV4ID0gTWF0aC5mbG9vcigoTWF0aC5zaW4oc2VlZCAqIDIpICogMTAwMDAgLSBNYXRoLmZsb29yKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwKSkgKiB0eXBlcy5sZW5ndGgpO1xuICAgIGNvbnN0IHJhbmRvbVR5cGUgPSB0eXBlc1t0eXBlSW5kZXhdO1xuXG4gICAgY29uc3QgcFVwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgd29ybGQuYWRkQ29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWDogZ3gsIGdyaWRZOiBneSwgeDogZ3ggKiB0aWxlU2l6ZSwgeTogZ3kgKiB0aWxlU2l6ZSB9KTtcbiAgICBcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gYHBvd2VydXAgcG93ZXJ1cC0ke3JhbmRvbVR5cGUudG9Mb3dlckNhc2UoKX1gO1xuICAgIGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSBgJHtneCAqIHRpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUudG9wID0gYCR7Z3kgKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnpJbmRleCA9ICc1JztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3dlclVwJywgeyB0eXBlOiByYW5kb21UeXBlLCBlbDogZGl2IH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclN5c3RlbSh3b3JsZCwgZHQsIG5vdywgYW5pbVJvd3MpIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdSZW5kZXJhYmxlJyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgICAgICBjb25zdCBwb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuXG4gICAgICAgIGlmICghcmVuZGVyYWJsZS5lbCkgY29udGludWU7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSByZW5kZXJhYmxlLnN0YXRlO1xuICAgICAgICBjb25zdCB0YXJnZXRSb3cgPSBhbmltUm93c1tzdGF0ZV1bdmVsLmRpcmVjdGlvbl07XG4gICAgICAgIFxuICAgICAgICAvLyBSZXNldCBhbmltYXRpb24gd2hlbiByb3cgb3Igc3RhdGUgY2hhbmdlc1xuICAgICAgICBpZiAocmVuZGVyYWJsZS5yb3cgIT09IHRhcmdldFJvdyB8fCByZW5kZXJhYmxlLmxhc3RTdGF0ZSAhPT0gc3RhdGUpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUucm93ID0gdGFyZ2V0Um93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0U3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZyYW1lQ291bnQgPSBzdGF0ZSA9PT0gJ1JVTicgPyByZW5kZXJhYmxlLnJ1bkZyYW1lcyA6IHJlbmRlcmFibGUuaWRsZUZyYW1lcztcbiAgICAgICAgY29uc3QgZnJhbWVEZWxheSA9IHN0YXRlID09PSAnUlVOJyA/IDEwMDAgLyByZW5kZXJhYmxlLmZwcyA6IDEwMDAgLyByZW5kZXJhYmxlLmlkbGVGcHM7XG5cbiAgICAgICAgaWYgKG5vdyAtIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA+IGZyYW1lRGVsYXkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICsgMSkgJSBmcmFtZUNvdW50O1xuICAgICAgICAgICAgcmVuZGVyYWJsZS5sYXN0RnJhbWVUaW1lID0gbm93O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zWCA9IC0ocmVuZGVyYWJsZS5jdXJyZW50RnJhbWUgKiByZW5kZXJhYmxlLmZyYW1lV2lkdGgpO1xuICAgICAgICBjb25zdCBwb3NZID0gLShyZW5kZXJhYmxlLnJvdyAqIHJlbmRlcmFibGUuZnJhbWVIZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgcmVuZGVyYWJsZS5lbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBgJHtwb3NYfXB4ICR7cG9zWX1weGA7XG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7cG9zLnh9cHgsICR7cG9zLnl9cHgsIDApYDtcbiAgICB9XG59XG4iLCIvLyAvc3JjL2Vjcy93b3JsZC5qc1xuXG5leHBvcnQgY2xhc3MgV29ybGQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm5leHRFbnRpdHlJZCA9IDA7XG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IG5ldyBNYXAoKTsgXG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuICAgIH1cblxuICAgIGNyZWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5uZXh0RW50aXR5SWQrKztcbiAgICAgICAgdGhpcy5lbnRpdGllcy5hZGQoZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG5cbiAgICBkZXN0cm95RW50aXR5KGVudGl0eSkge1xuICAgICAgICB0aGlzLmVudGl0aWVzLmRlbGV0ZShlbnRpdHkpO1xuICAgICAgICBmb3IgKGNvbnN0IFtjb21wb25lbnROYW1lLCBjb21wb25lbnRNYXBdIG9mIHRoaXMuY29tcG9uZW50cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERhdGEgPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zZXQoY29tcG9uZW50TmFtZSwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpLnNldChlbnRpdHksIGNvbXBvbmVudERhdGEpO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE1hcCA/IGNvbXBvbmVudE1hcC5nZXQoZW50aXR5KSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZW1vdmVDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIGlmIChjb21wb25lbnRNYXApIHtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hcC5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHF1ZXJ5KC4uLmNvbXBvbmVudE5hbWVzKSB7XG4gICAgICAgIGlmIChjb21wb25lbnROYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpcnN0TWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1swXSk7XG4gICAgICAgIGlmICghZmlyc3RNYXApIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZmlyc3RNYXAua2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgaGFzQWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY29tcG9uZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcCB8fCAhbWFwLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0FsbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzQWxsICYmIHRoaXMuZW50aXRpZXMuaGFzKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRTeXN0ZW0oc3lzdGVtRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zeXN0ZW1zLnB1c2goc3lzdGVtRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHVwZGF0ZShkdCwgbm93KSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3lzdGVtIG9mIHRoaXMuc3lzdGVtcykge1xuICAgICAgICAgICAgc3lzdGVtKHRoaXMsIGR0LCBub3cpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5cbmNvbnN0IFRJTEVfU0laRSA9IDY0O1xuY29uc3QgR1JJRF9CT1JERVJfU0laRSA9IDY7XG5jb25zdCBHQU1FX0NIUk9NRV9XSURUSCA9IDcyO1xuY29uc3QgR0FNRV9DSFJPTUVfSEVJR0hUID0gMTUwO1xuXG5jb25zdCBpbWFnZXMgPSB7XG4gICAgMjogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIsXG4gICAgMzogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfd2FsbC5wbmdcIixcbiAgICA0OiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19leHBsb2l0LnBuZ1wiLFxufTtcblxuY29uc3QgW3BsYXllck5hbWUsIHNldFBsYXllck5hbWVdID0gY3JlYXRlU2lnbmFsKFwiUGxheWVyIDFcIik7XG5jb25zdCBbbGl2ZXMsIHNldExpdmVzXSA9IGNyZWF0ZVNpZ25hbCgzKTtcbmNvbnN0IFtzcGVlZCwgc2V0U3BlZWRdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW2JvbWJzLCBzZXRCb21ic10gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbcmFuZ2UsIHNldFJhbmdlXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmV4cG9ydCB7IHNldFBsYXllck5hbWUsIHNldExpdmVzLCBzZXRTcGVlZCwgc2V0Qm9tYnMsIHNldFJhbmdlIH07XG5cbmNvbnN0IG5hbWVFbCA9IDxzcGFuIGNsYXNzPVwicGxheWVyLW5hbWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBuYW1lRWwudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lKCk7IH0pO1xuXG5jb25zdCBsaXZlc0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBsaXZlcy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBzcGVlZEVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBzcGVlZC12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBib21ic0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBib21icy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCByYW5nZUVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSByYW5nZS12YWx1ZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGxpdmVzRWwudGV4dENvbnRlbnQgPSBsaXZlcygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHNwZWVkRWwudGV4dENvbnRlbnQgPSBzcGVlZCgpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGJvbWJzRWwudGV4dENvbnRlbnQgPSBib21icygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHJhbmdlRWwudGV4dENvbnRlbnQgPSByYW5nZSgpOyB9KTtcblxuZnVuY3Rpb24gR2FtZSh7IGdyaWQgfSkge1xuICAgIGNvbnN0IGJvYXJkV2lkdGggPSBncmlkWzBdLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZEhlaWdodCA9IGdyaWQubGVuZ3RoICogVElMRV9TSVpFO1xuICAgIGNvbnN0IGJvYXJkT3V0ZXJXaWR0aCA9IGJvYXJkV2lkdGggKyBHUklEX0JPUkRFUl9TSVpFICogMjtcbiAgICBjb25zdCBib2FyZE91dGVySGVpZ2h0ID0gYm9hcmRIZWlnaHQgKyBHUklEX0JPUkRFUl9TSVpFICogMjtcbiAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGJvYXJkV2lkdGggOiB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBib2FyZEhlaWdodCA6IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjb25zdCBzY2FsZSA9IE1hdGgubWluKFxuICAgICAgICAxLFxuICAgICAgICBNYXRoLm1heCgwLjIsICh2aWV3cG9ydFdpZHRoIC0gR0FNRV9DSFJPTUVfV0lEVEgpIC8gYm9hcmRPdXRlcldpZHRoKSxcbiAgICAgICAgTWF0aC5tYXgoMC4yLCAodmlld3BvcnRIZWlnaHQgLSBHQU1FX0NIUk9NRV9IRUlHSFQpIC8gYm9hcmRPdXRlckhlaWdodClcbiAgICApO1xuICAgIGNvbnN0IHJvd3MgPSBbXTtcbiAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgZ3JpZC5sZW5ndGg7IHJvd0luZGV4KyspIHtcbiAgICAgICAgY29uc3QgY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IGdyaWRbcm93SW5kZXhdLmxlbmd0aDsgY29sSW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGdyaWRbcm93SW5kZXhdW2NvbEluZGV4XTtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBcInRpbGVcIjtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGB3aWR0aDoke1RJTEVfU0laRX1weDtoZWlnaHQ6JHtUSUxFX1NJWkV9cHg7YDtcblxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDIgfHwgY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLWZsb29yXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLXdhbGxcIjtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbM119KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1s0XX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAwIHx8IGNlbGwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbMl19KWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNlbGxzLnB1c2goPGRpdiBjbGFzcz17Y2xhc3NOYW1lfSBkYXRhLXg9e2NvbEluZGV4fSBkYXRhLXk9e3Jvd0luZGV4fSBzdHlsZT17c3R5bGV9PjwvZGl2Pik7XG4gICAgICAgIH1cbiAgICAgICAgcm93cy5wdXNoKDxkaXYgY2xhc3M9XCJncmlkLXJvd1wiPntjZWxsc308L2Rpdj4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtZ2xhc3NcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtYmFyXCI+XG4gICAgICAgICAgICAgICAgICAgIHtuYW1lRWx9XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1zdGF0c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5MaXZlczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bGl2ZXNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5TcGVlZDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c3BlZWRFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5Cb21iczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Ym9tYnNFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj5SYW5nZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmFuZ2VFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1ib2FyZC1mcmFtZVwiIHN0eWxlPXtgd2lkdGg6JHtib2FyZE91dGVyV2lkdGggKiBzY2FsZX1weDtoZWlnaHQ6JHtib2FyZE91dGVySGVpZ2h0ICogc2NhbGV9cHg7YH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZ2FtZS1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJnYW1lLWdyaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2Bwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoke2JvYXJkV2lkdGh9cHg7aGVpZ2h0OiR7Ym9hcmRIZWlnaHR9cHg7dHJhbnNmb3JtOnNjYWxlKCR7c2NhbGV9KTtgfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cm93c31cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgQ2hhdFBsYXllcnMgZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5sZXQgW3N0YXRlcywgc2V0U3RhdGVzXSA9IGNyZWF0ZVNpZ25hbCh7fSk7XG5leHBvcnQgeyBzZXRTdGF0ZXMgfTtcblxubGV0IHJvb21JZEVsID0gPHA+Um9vbSBJRDogPC9wPjtcbmxldCBwbGF5ZXJzRWwgPSA8cD5QbGF5ZXJzOiAgLyA0PC9wPjtcbmxldCB0ZXh0RWwgPSA8cD48L3A+O1xubGV0IHRpbWVyRWwgPSA8cD5UaW1lcjogPC9wPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzID0gc3RhdGVzKCk7XG4gICAgcm9vbUlkRWwudGV4dENvbnRlbnQgPSBgUm9vbSBJRDogJHtzLnJvb21JZH1gO1xuICAgIHBsYXllcnNFbC50ZXh0Q29udGVudCA9IGBQbGF5ZXJzOiAke3MucGxheWVyc0NvdW50fSAvIDRgO1xuICAgIHRleHRFbC50ZXh0Q29udGVudCA9IHMudGV4dCB8fCBcIlwiO1xuXG4gICAgaWYgKHMuZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IFwiVGltZXI6IEdhbWUgc3RhcnRlZFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRpbWVyVGV4dCA9ICghcy5zZWNvbmRzTGVmdCkgPyBcIldhaXRpbmcgZm9yIG9uZSBtb3JlIHBsYXllclwiIDogYCR7cy5zZWNvbmRzTGVmdH0gc2Vjb25kc2A7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBgVGltZXI6ICR7dGltZXJUZXh0fWA7XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIExvYmJ5KCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb25hdGluZXItbG9iYnlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2JieS1ib3hcIj5cbiAgICAgICAgICAgICAgICA8aDE+TG9iYnk8L2gxPlxuICAgICAgICAgICAgICAgIHtyb29tSWRFbH1cbiAgICAgICAgICAgICAgICB7cGxheWVyc0VsfVxuICAgICAgICAgICAgICAgIHt0ZXh0RWx9XG4gICAgICAgICAgICAgICAge3RpbWVyRWx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxDaGF0UGxheWVycyAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYmJ5OyIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmNvbnN0IHJlcGxheUJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+UGxheSBBZ2FpbjwvYnV0dG9uPjtcblxucmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbG9jYXRpb24ucmVsb2FkKCk7XG59KTtcblxubGV0IG1lbnVFbCA9IChcbiAgICA8ZGl2IGNsYXNzPVwibWVudS1ib3hcIj5cbiAgICAgICAgPGgxPllvdSBXaW4hPC9oMT5cbiAgICAgICAgPHA+QWxsIG90aGVyIHBsYXllcnMgaGF2ZSBsZWZ0IHRoZSBnYW1lLjwvcD5cbiAgICAgICAge3JlcGxheUJ0bn1cbiAgICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lbnUoKSB7XG4gICAgcmV0dXJuIG1lbnVFbDtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBzZXRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4uL2Vjcy9nYW1lLmpzXCI7XG5cbmZ1bmN0aW9uIFJlZ2lzdGVyKHsgd3NzIH0pIHtcbiAgICBsZXQgc3VibWl0dGVkID0gZmFsc2U7XG5cbiAgICBsZXQgcGxheWVyRW50ZXIgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChzdWJtaXR0ZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCBuaWNrbmFtZSA9IGZvcm1EYXRhLmdldChcIm5pY2tuYW1lXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW5pY2tuYW1lIHx8IG5pY2tuYW1lLmxlbmd0aCA+IDIwKSByZXR1cm47XG5cbiAgICAgICAgc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc2V0UGxheWVyTmFtZShuaWNrbmFtZSk7XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJuaWNrbmFtZV9vZl90aGVfcGxheWVyXCIsXG4gICAgICAgICAgICBuaWNrbmFtZTogbmlja25hbWVcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxmb3JtIGNsYXNzPVwicmVnaXN0ZXItZm9ybVwiIG9uU3VibWl0PXtwbGF5ZXJFbnRlcn0+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaWNrbmFtZS1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5pY2tuYW1lXCIgcGxhY2Vob2xkZXI9XCJlbnRlciB5b3VyIG5hbWVcIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJyZWdpc3Rlci1idXR0b25cIiB0eXBlPVwic3VibWl0XCI+c3RhcnQgcGxheWluZzwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RlcjtcbiIsImNsYXNzIFNvdW5kIHtcbiAgICBjb25zdHJ1Y3RvcihzcmMpIHtcbiAgICAgICAgdGhpcy5tdXNpYyA9IG5ldyBBdWRpbyhzcmMpO1xuICAgICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuXG4gICAgICAgIHRoaXMubXVzaWMubG9vcCA9IHRydWU7XG4gICAgICAgIHRoaXMubXVzaWMudm9sdW1lID0gMC40O1xuXG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTmFtZSA9IFwic291bmQtYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFwcGVuZCh0aGlzLmljb24pO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZSgpKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZCh0aGlzLmJ1dHRvbik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnBsYXkoKSwgeyBvbmNlOiB0cnVlIH0pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIHRoaXMubXVzaWMucGxheSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpO1xuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVzaWMucGF1c2VkIHx8IHRoaXMubXVzaWMubXV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvblwiKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVCdXR0b24oKSB7XG4gICAgICAgIGNvbnN0IGlzTXV0ZWQgPSB0aGlzLm11c2ljLm11dGVkIHx8IHRoaXMubXVzaWMucGF1c2VkO1xuXG4gICAgICAgIHRoaXMuaWNvbi5jbGFzc05hbWUgPSBpc011dGVkID8gXCJmYS1zb2xpZCBmYS12b2x1bWUtb2ZmXCIgOiBcImZhLXNvbGlkIGZhLXZvbHVtZS1oaWdoXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1tdXRlZFwiLCBpc011dGVkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvdW5kO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC9hcHAuanNcIik7XG4iLCIiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJwcm9wcyIsImNoaWxkcmVuIiwiZWxlIiwiZG9jdW1lbnQiLCJrZXkiLCJzdGFydHNXaXRoIiwiZXZlbnROYW1lIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRBdHRyaWJ1dGUiLCJmbGF0Q2hpbGRyZW4iLCJmbGF0IiwiSW5maW5pdHkiLCJhcHBlbmQiLCJmaWx0ZXIiLCJjaGlsZCIsInVuZGVmaW5lZCIsInJlbmRlciIsImVsZW1lbnQiLCJjb250YWluZXIiLCJyZXBsYWNlQ2hpbGRyZW4iLCJSb3V0ZXIiLCJyb3V0ZXIiLCJlZmZlY3RTdGFjayIsImFjdGl2ZUVmZmVjdCIsImNyZWF0ZVNpZ25hbCIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwiZWZmZWN0cyIsIlNldCIsIlJlYWQiLCJhZGQiLCJXcml0ZSIsIm5ld1ZhbHVlIiwiZm4iLCJmb3JFYWNoIiwiZWZmZWN0IiwiY3JlYXRlRWZmZWN0IiwicHVzaCIsInBvcCIsImxlbmd0aCIsIlJvdXRlcyIsIk9iamVjdCIsImNyZWF0ZSIsIkZpcnN0UmVzb2x2ZSIsIm9uIiwicGF0aCIsImhhbmRsZXIiLCJuYXZpZ2F0ZSIsImhpc3RvcnkiLCJuYXZpZ2F0aW9uIiwicmVzb2x2ZSIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJ1cmwiLCJVUkwiLCJocmVmIiwibGlzdGVuIiwib25FcnJvcjQwNCIsImV2ZW50IiwiZGVzdGluYXRpb24iLCJpbnRlcmNlcHQiLCJjb25zb2xlIiwibG9nIiwiUmVnaXN0ZXIiLCJHYW1lIiwiTWVudSIsIkxvYmJ5Iiwic2V0U3RhdGVzIiwic2V0UGxheWVyTmFtZSIsInNldEh1ZFBsYXllck5hbWUiLCJTb3VuZCIsInNldE1lc3NhZ2VzIiwiR2FtZUVuZ2luZSIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIndzcyIsIldlYlNvY2tldCIsIndpbmRvdyIsImhvc3RuYW1lIiwic291bmQiLCJjdXJyZW50R2FtZUVuZ2luZSIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJ3cyIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicXVlcnlTZWxlY3RvciIsInJvb21JZCIsInBsYXllcnNDb3VudCIsInNlY29uZHNMZWZ0IiwidGV4dCIsImdyaWQiLCJzZXRUaW1lb3V0IiwiZ2FtZUNvbnRhaW5lciIsImRlc3Ryb3kiLCJsb2NhbFBsYXllciIsInBsYXllcnMiLCJmaW5kIiwicGxheWVyIiwiaWQiLCJ5b3VyUGxheWVySWQiLCJuaWNrbmFtZSIsImVuZ2luZSIsImVycm9yIiwicHJldiIsImhhbmRsZVJlbW90ZU1vdmUiLCJwYXlsb2FkIiwiaGFuZGxlUmVtb3RlQm9tYiIsImhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQiLCJlcnIiLCJtZXNzYWdlcyIsIkNoYXRQbGF5ZXJzIiwibWVzc2FnZXNDb250YWluZXIiLCJjbGFzcyIsIm1zZ3MiLCJpbm5lckhUTUwiLCJtc2ciLCJwIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJ1bnNoaWZ0IiwiYnJvYWRjYXN0TWVzc2FnZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJ0YXJnZXQiLCJnZXQiLCJ0cmltIiwicmVzZXQiLCJzZW5kIiwic3RyaW5naWZ5Iiwib25TdWJtaXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJtYXhsZW5ndGgiLCJQb3NpdGlvbkNvbXBvbmVudCIsImd4IiwiZ3kiLCJ0aWxlU2l6ZSIsImdyaWRYIiwiZ3JpZFkiLCJ4IiwieSIsInRhcmdldFgiLCJ0YXJnZXRZIiwiVmVsb2NpdHlDb21wb25lbnQiLCJiYXNlU3BlZWQiLCJzcGVlZCIsImlzTW92aW5nIiwiZGlyZWN0aW9uIiwiSW5wdXRDb21wb25lbnQiLCJpbnB1dFF1ZXVlIiwiUmVuZGVyYWJsZUNvbXBvbmVudCIsImVsIiwiZnJhbWVXaWR0aCIsImZyYW1lSGVpZ2h0IiwidG90YWxGcmFtZXMiLCJmcHMiLCJjdXJyZW50RnJhbWUiLCJydW5GcmFtZXMiLCJpZGxlRnJhbWVzIiwiaWRsZUZwcyIsImxhc3RGcmFtZVRpbWUiLCJyb3ciLCJzdGF0ZSIsImxhc3RTdGF0ZSIsIlBsYXllckNvbXBvbmVudCIsImNoYXJUeXBlIiwiaXNMb2NhbCIsIkJvbWJDb21wb25lbnQiLCJvd25lcklkIiwidGltZXIiLCJyYW5nZSIsImV4cGxvZGVkIiwiRXhwbG9zaW9uQ29tcG9uZW50IiwiZHVyYXRpb24iLCJQb3dlclVwQ29tcG9uZW50IiwicGlja2VkVXAiLCJCZWhhdmlvckNvbXBvbmVudCIsImdob3N0TW9kZSIsInRocm93YWJsZSIsImRldG9uYXRvciIsImZhc3RTaG9lc0xldmVsIiwiYm9tYnMiLCJtYXgiLCJjdXJyZW50IiwiV29ybGQiLCJtb3ZlbWVudFN5c3RlbSIsInJlbmRlclN5c3RlbSIsImJvbWJTeXN0ZW0iLCJkYW1hZ2VTeXN0ZW0iLCJjaGVja0V4dHJhTGlmZUNvbGxpc2lvbiIsImNoZWNrR2FtZUVuZENvbmRpdGlvbnMiLCJwb3dlclVwU3lzdGVtIiwic3Bhd25Qb3dlclVwIiwic2V0Qm9tYnMiLCJzZXRMaXZlcyIsInNldFJhbmdlIiwic2V0U3BlZWQiLCJUSUxFX1NJWkUiLCJBTklNQVRJT05fUk9XUyIsIlJVTiIsInVwIiwibGVmdCIsImRvd24iLCJyaWdodCIsIklETEUiLCJjb25zdHJ1Y3RvciIsImNhbnZhc0NvbnRhaW5lciIsIm1hcERhdGEiLCJzb2NrZXQiLCJ3b3JsZCIsImxvY2FsUGxheWVyRW50aXR5IiwicGxheWVyRW50aXRpZXMiLCJNYXAiLCJsYXN0VGltZSIsInJlbW92ZUlucHV0TGlzdGVuZXJzIiwiYW5pbWF0aW9uRnJhbWUiLCJydW5uaW5nIiwiY2xhaW1lZFBvd2VyVXBzIiwibG9jYWxQbGF5ZXJJZCIsImFsbFBsYXllcnMiLCJ0b3RhbFBsYXllcnMiLCJub3JtYWxpemVkTG9jYWxQbGF5ZXJJZCIsIlN0cmluZyIsInBEYXRhIiwicGxheWVySWQiLCJwbGF5ZXJFbnRpdHkiLCJjcmVhdGVFbnRpdHkiLCJwbGF5ZXJEaXYiLCJjb2xvciIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ3aWxsQ2hhbmdlIiwic3giLCJzeSIsImFkZENvbXBvbmVudCIsInBsYXllckNvbXAiLCJsaXZlcyIsIm1heEJvbWJzIiwiYm9tYlJhbmdlIiwic2V0IiwidXBkYXRlSHVkU3RhdHMiLCJzZXR1cElucHV0Iiwid2FybiIsIm1hcCIsInJlZ2lzdGVyU3lzdGVtcyIsInBlcmZvcm1hbmNlIiwibm93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZ2FtZUxvb3AiLCJpbnB1dCIsImdldENvbXBvbmVudCIsImdldEtleURpcmVjdGlvbiIsImhhbmRsZUtleURvd24iLCJkaXIiLCJpbmNsdWRlcyIsImNvZGUiLCJkcm9wQm9tYiIsImhhbmRsZUtleVVwIiwiZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJwb3MiLCJjdXJyZW50Qm9tYnMiLCJxdWVyeSIsImJFbnRpdHkiLCJjcmVhdGVkIiwiY3JlYXRlQm9tYiIsInJlYWR5U3RhdGUiLCJPUEVOIiwiZXhpc3RzIiwic29tZSIsImVudGl0eSIsImJvbWIiLCJib21iRW50aXR5IiwiYm9tYkRpdiIsInRvcCIsImJvbWJDb21wIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsInZlbCIsInJlbmRlcmFibGUiLCJyZW1vdmVQb3dlclVwQXQiLCJhcHBseVBvd2VyVXAiLCJwb3dlclVwcyIsInBvd2VyVXAiLCJwYXJlbnROb2RlIiwiZGVzdHJveUVudGl0eSIsInZlbG9jaXR5IiwiTWF0aCIsIm1pbiIsInVwZGF0ZU1hcENlbGwiLCJ0aWxlIiwiYmFja2dyb3VuZEltYWdlIiwiZGVzdHJveUJveENhbGxiYWNrIiwiaGFzIiwib25QbGF5ZXJIdXJ0IiwicmVtYWluaW5nTGl2ZXMiLCJvblBvd2VyVXBQaWNrZWQiLCJicm9hZGNhc3RNb3ZlbWVudCIsImFkZFN5c3RlbSIsInciLCJkdCIsInVwZGF0ZSIsIm5leHROb3ciLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJvdW5kIiwiY3VycmVudExvY2FsUGxheWVyTmFtZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJnZXRQbGF5ZXJOYW1lIiwiZ2V0SXRlbSIsImFmZmVjdGVkQ2VsbHMiLCJjYWxjdWxhdGVFeHBsb3Npb25DZWxscyIsImNlbGwiLCJleHBFbnRpdHkiLCJleHBEaXYiLCJ3aWR0aCIsImhlaWdodCIsImV4cGxvc2lvbnMiLCJleHAiLCJieCIsImJ5IiwiY2VsbHMiLCJkaXJlY3Rpb25zIiwic3RlcHMiLCJpIiwidHgiLCJ0eSIsImNlbGxUeXBlIiwic2hvd0xvc3NQb3B1cCIsInBsYXllck5hbWUiLCJvdmVybGF5IiwicG9wdXAiLCJ0aXRsZUVsIiwibWVzc2FnZUVsIiwiYnV0dG9uIiwicmVsb2FkIiwic2hvd1dpblBvcHVwIiwiaGFuZGxlUGxheWVyRGVhdGgiLCJkZWF0aEdyaWRYIiwiZmxvb3IiLCJkZWF0aEdyaWRZIiwiaGVhcnRJbWciLCJzcmMiLCJvYmplY3RGaXQiLCJhbmltYXRpb24iLCJleHRyYUxpZmVEcm9wcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJkcm9wIiwiZHJvcExlZnQiLCJwYXJzZUludCIsImRyb3BUb3AiLCJpc05hTiIsImRyb3BHcmlkWCIsImRyb3BHcmlkWSIsInBQb3MiLCJwbGF5ZXJHcmlkWCIsInBsYXllckdyaWRZIiwiYWN0aXZlUGxheWVyQ291bnQiLCJsYXN0QWN0aXZlUGxheWVyRW50aXR5IiwibGFzdFBsYXllciIsImludmluY2libGVVbnRpbCIsImVQb3MiLCJwcmV2aW91c0xpdmVzIiwiZW50aXRpZXMiLCJkZWx0YSIsIlBMQVlFUl9TSVpFIiwiYmVoYXZpb3IiLCJtb3ZlVG93YXJkVGFyZ2V0IiwiYWN0aXZlSW5wdXQiLCJkeCIsImR5IiwiaGFzSW5wdXQiLCJuZXh0WCIsIm5leHRZIiwic25hcFRocmVzaG9sZCIsImlzQmxvY2tlZCIsImN1cnJlbnRUaWxlWCIsImRpZmZYIiwiYWJzIiwic2lnbiIsImN1cnJlbnRUaWxlWSIsImRpZmZZIiwibmV4dFhBZnRlclNuYXAiLCJuZXh0WUFmdGVyU25hcCIsInN0ZXAiLCJwbGF5ZXJTaXplIiwicGFkZGluZyIsImJvdHRvbSIsImlzQmxvY2tlZENlbGwiLCJwVXBFbnRpdHkiLCJ1cFBvcyIsInBVcCIsInNlZWQiLCJzZWVkUmFuZG9tIiwic2luIiwidHlwZXMiLCJ0eXBlSW5kZXgiLCJyYW5kb21UeXBlIiwiZGl2IiwiYW5pbVJvd3MiLCJ0YXJnZXRSb3ciLCJmcmFtZUNvdW50IiwiZnJhbWVEZWxheSIsInBvc1giLCJwb3NZIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwidHJhbnNmb3JtIiwibmV4dEVudGl0eUlkIiwiY29tcG9uZW50cyIsInN5c3RlbXMiLCJkZWxldGUiLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50TWFwIiwiZW50cmllcyIsImNvbXBvbmVudERhdGEiLCJyZW1vdmVDb21wb25lbnQiLCJjb21wb25lbnROYW1lcyIsImZpcnN0TWFwIiwicmVzdWx0cyIsImhhc0FsbCIsInN5c3RlbUZ1bmN0aW9uIiwic3lzdGVtIiwiR1JJRF9CT1JERVJfU0laRSIsIkdBTUVfQ0hST01FX1dJRFRIIiwiR0FNRV9DSFJPTUVfSEVJR0hUIiwiaW1hZ2VzIiwibmFtZUVsIiwibGl2ZXNFbCIsInNwZWVkRWwiLCJib21ic0VsIiwicmFuZ2VFbCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImJvYXJkT3V0ZXJXaWR0aCIsImJvYXJkT3V0ZXJIZWlnaHQiLCJ2aWV3cG9ydFdpZHRoIiwiaW5uZXJXaWR0aCIsInZpZXdwb3J0SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJzY2FsZSIsInJvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4Iiwic3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsImdhbWVTdGFydGVkIiwidGltZXJUZXh0IiwicmVwbGF5QnRuIiwibWVudUVsIiwic3VibWl0dGVkIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0IiwibXVzaWMiLCJBdWRpbyIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwicGxheSIsIm9uY2UiLCJ1cGRhdGVCdXR0b24iLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiXSwic291cmNlUm9vdCI6IiJ9