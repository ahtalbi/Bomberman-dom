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
        // Get current lives value, default to 0 if undefined
        const currentLives = player.lives || 0;

        // Increase player's lives by +1 (direct property assignment)
        player.lives = currentLives + 1;

        // Remove the extra-life-drop from DOM immediately
        if (drop.parentNode) {
          drop.parentNode.removeChild(drop);
        }
        console.log(`[Extra Life] Player ${player.id} picked up an extra life! New lives: ${player.lives}`);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QsRTs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL2RvbS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29yay5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5LmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jaGF0LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZWNzL2NvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9ib21iU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9kYW1hZ2VTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy9zeXN0ZW1zL21vdmVtZW50U3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9wb3dlclVwU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3NyYy9lY3Mvc3lzdGVtcy9yZW5kZXJTeXN0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vjcy93b3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvZ2FtZS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2xvYmJ5LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbWVudS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL3JlZ2lzdGVyLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvc291bmQuanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIHByb3BzLCAuLi5jaGlsZHJlbikge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiB0eXBlKHsgLi4uKHByb3BzIHx8IHt9KSwgY2hpbGRyZW4gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzIHx8IHt9KSB7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChcIm9uXCIpICYmIHR5cGVvZiBwcm9wc1trZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGtleS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZS5zZXRBdHRyaWJ1dGUoa2V5LCBwcm9wc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZsYXRDaGlsZHJlbiA9IGNoaWxkcmVuLmZsYXQoSW5maW5pdHkpO1xuICAgIGVsZS5hcHBlbmQoLi4uZmxhdENoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gbnVsbCAmJiBjaGlsZCAhPT0gdW5kZWZpbmVkICYmIGNoaWxkICE9PSBmYWxzZSkpO1xuXG4gICAgcmV0dXJuIGVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICBjb250YWluZXIucmVwbGFjZUNoaWxkcmVuKGVsZW1lbnQpO1xufVxuIiwiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4vcm91dGVyLmpzXCI7XG5cbmxldCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjsiLCJjb25zdCBlZmZlY3RTdGFjayA9IFtdO1xubGV0IGFjdGl2ZUVmZmVjdCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaWduYWwoaW5pdGlhbFZhbHVlKSB7XG4gICBsZXQgdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICBjb25zdCBlZmZlY3RzID0gbmV3IFNldCgpO1xuXG4gICBjb25zdCBSZWFkID0gKCkgPT4ge1xuICAgICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgICAgZWZmZWN0cy5hZGQoYWN0aXZlRWZmZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgIH1cblxuICAgY29uc3QgV3JpdGUgPSAobmV3VmFsdWUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgbGV0IGZuID0gbmV3VmFsdWU7XG4gICAgICAgICB2YWx1ZSA9IGZuKHZhbHVlKTtcbiAgICAgIH0gXG4gICAgICBlbHNlIHZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBlZmZlY3RzLmZvckVhY2goZWZmZWN0ID0+IGVmZmVjdCgpKTtcbiAgIH1cblxuICAgcmV0dXJuIFtSZWFkLCBXcml0ZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFZmZlY3QoZWZmZWN0KSB7XG4gICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3Q7XG4gICBlZmZlY3QoKTtcbiAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbn1cbiIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgICNSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICNGaXJzdFJlc29sdmUgPSBmYWxzZTtcblxuICAgIG9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy4jUm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFxuICAgIG5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSA9IFwicHVzaFwiIH0gPSB7fSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBcIi9cIiArIHBhdGg7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzb2x2ZShwYXRoID0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbcGF0aF07XG5cbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm4oeyB1cmw6IG5ldyBVUkwobG9jYXRpb24uaHJlZikgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxpc3RlbihvbkVycm9yNDA0KSB7XG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5pbnRlcmNlcHQoe1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLnBhdGhuYW1lLCB0aGlzLiNSb3V0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3VybC5wYXRobmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I0MDQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbih7IHVybCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNGaXJzdFJlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdGhpcy4jRmlyc3RSZXNvbHZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgcmVuZGVyIH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmtcIjtcbmltcG9ydCBSZWdpc3RlciBmcm9tIFwiLi4vcGFnZXMvcmVnaXN0ZXJcIjtcbmltcG9ydCBHYW1lIGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgTWVudSBmcm9tIFwiLi4vcGFnZXMvbWVudVwiO1xuaW1wb3J0IExvYmJ5IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0U3RhdGVzIH0gZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRQbGF5ZXJOYW1lIGFzIHNldEh1ZFBsYXllck5hbWUgfSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IFNvdW5kIGZyb20gXCIuLi91dGlscy9zb3VuZFwiO1xuaW1wb3J0IHsgc2V0TWVzc2FnZXMgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmltcG9ydCB7IEdhbWVFbmdpbmUgfSBmcm9tIFwiLi4vZWNzL2dhbWUuanNcIjsgXG5cbmNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIik7XG5jb25zdCB3c3MgPSBuZXcgV2ViU29ja2V0KGB3czovLyR7d2luZG93LmxvY2F0aW9uLmhvc3RuYW1lfTo1MDAwYCk7XG5jb25zdCBzb3VuZCA9IG5ldyBTb3VuZChcIi4vYXNzZXRzL3NvdW5kcy9iYWNrZ3JvdW5kX211c2ljLm1wM1wiKTtcbmxldCBjdXJyZW50R2FtZUVuZ2luZSA9IG51bGw7XG5cbnNvdW5kLmluaXQoKTtcblxucm91dGVyLm9uKFwiL1wiLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcInJlZ2lzdGVyLXBhZ2VcIjtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKHdzKSA9PiB7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJyb29tX3VwZGF0ZVwiOlxuICAgICAgICBjYXNlIFwibG9iYnlfdGltZXJcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJsb2JieS1wYWdlXCI7XG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb25hdGluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXRlcyh7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IG1lc3NhZ2UucGxheWVyc0NvdW50LFxuICAgICAgICAgICAgICAgIHNlY29uZHNMZWZ0OiBtZXNzYWdlLnNlY29uZHNMZWZ0LFxuICAgICAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UudGV4dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdhbWVfc3RhcnRlZFwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZW5kZXIoPEdhbWUgZ3JpZD17bWVzc2FnZS5ncmlkfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChnYW1lQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVFbmdpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSAobWVzc2FnZS5wbGF5ZXJzIHx8IFtdKS5maW5kKHBsYXllciA9PiBwbGF5ZXIuaWQgPT09IG1lc3NhZ2UueW91clBsYXllcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIGxvY2FsUGxheWVyLm5pY2tuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIdWRQbGF5ZXJOYW1lKGxvY2FsUGxheWVyLm5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBHYW1lRW5naW5lKGdhbWVDb250YWluZXIsIG1lc3NhZ2UuZ3JpZCwgd3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lLmluaXQobWVzc2FnZS55b3VyUGxheWVySWQsIG1lc3NhZ2UucGxheWVycyB8fCBbXSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2FtZSBjb250YWluZXIgd2FzIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwicm9vbV9hbG9uZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgIGNhc2UgXCJjaGF0X21lc3NhZ2VcIjpcbiAgICAgICAgICAgIHNldE1lc3NhZ2VzKHByZXYgPT4gWy4uLnByZXYgLG1lc3NhZ2UubWVzc2FnZV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwbGF5ZXJfbW92ZWRcIjpcbiAgICAgICAgICAgIGlmIChjdXJyZW50R2FtZUVuZ2luZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lRW5naW5lLmhhbmRsZVJlbW90ZU1vdmUobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm9tYl9kcm9wcGVkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVCb21iKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBvd2VydXBfcGlja2VkXCI6XG4gICAgICAgICAgICBpZiAoY3VycmVudEdhbWVFbmdpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FtZUVuZ2luZS5oYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvclwiLCBlcnIpO1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdzcztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgd3NzIGZyb20gXCIuLi9hcHAvYXBwXCI7XG5cbmNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gY3JlYXRlU2lnbmFsKFtdKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzIH07XG5cbmZ1bmN0aW9uIENoYXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IG1lc3NhZ2VzQ29udGFpbmVyID0gPGRpdiBjbGFzcz1cIm1lc3NhZ2VzXCI+PC9kaXY+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNncyA9IG1lc3NhZ2VzKCk7XG4gICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgbXNnIG9mIG1zZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBtc2c7XG4gICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG1lc3NhZ2VzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBtc2dzLnVuc2hpZnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBmb3JtRGF0YS5nZXQoXCJtZXNzYWdlXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcImNoYXRfbWVzc2FnZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgfSkpO1xuICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0XCIgb25TdWJtaXQ9e2Jyb2FkY2FzdE1lc3NhZ2V9PlxuICAgICAgICAgICAge21lc3NhZ2VzQ29udGFpbmVyfVxuICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1lc3NhZ2VcIiBwbGFjZWhvbGRlcj1cInR5cGUgdG8gdGhlIG90aGVyIHBsYXllcnMgLi4uXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXRQbGF5ZXJzOyIsIi8vIC9zcmMvZWNzL2NvbXBvbmVudHMuanNcblxuZXhwb3J0IGNvbnN0IFBvc2l0aW9uQ29tcG9uZW50ID0gKGd4LCBneSwgdGlsZVNpemUgPSA2NCkgPT4gKHtcbiAgICBncmlkWDogZ3gsXG4gICAgZ3JpZFk6IGd5LFxuICAgIHg6IGd4ICogdGlsZVNpemUsXG4gICAgeTogZ3kgKiB0aWxlU2l6ZSxcbiAgICB0YXJnZXRYOiBneCAqIHRpbGVTaXplLFxuICAgIHRhcmdldFk6IGd5ICogdGlsZVNpemVcbn0pO1xuXG5leHBvcnQgY29uc3QgVmVsb2NpdHlDb21wb25lbnQgPSAoYmFzZVNwZWVkID0gMi41KSA9PiAoe1xuICAgIGJhc2VTcGVlZDogYmFzZVNwZWVkLFxuICAgIHNwZWVkOiBiYXNlU3BlZWQsXG4gICAgaXNNb3Zpbmc6IGZhbHNlLFxuICAgIGRpcmVjdGlvbjogJ2Rvd24nXG59KTtcblxuZXhwb3J0IGNvbnN0IElucHV0Q29tcG9uZW50ID0gKCkgPT4gKHtcbiAgICBpbnB1dFF1ZXVlOiBbXVxufSk7XG5cbmV4cG9ydCBjb25zdCBSZW5kZXJhYmxlQ29tcG9uZW50ID0gKGVsLCBmcmFtZVdpZHRoID0gNjQsIGZyYW1lSGVpZ2h0ID0gNjQsIHRvdGFsRnJhbWVzID0gNCwgZnBzID0gMTIpID0+ICh7XG4gICAgZWw6IGVsLFxuICAgIGZyYW1lV2lkdGg6IGZyYW1lV2lkdGgsXG4gICAgZnJhbWVIZWlnaHQ6IGZyYW1lSGVpZ2h0LFxuICAgIGN1cnJlbnRGcmFtZTogMCxcbiAgICB0b3RhbEZyYW1lczogdG90YWxGcmFtZXMsXG4gICAgcnVuRnJhbWVzOiA0LFxuICAgIGlkbGVGcmFtZXM6IDIsXG4gICAgZnBzOiBmcHMsXG4gICAgaWRsZUZwczogNCxcbiAgICBsYXN0RnJhbWVUaW1lOiAwLFxuICAgIHJvdzogMCxcbiAgICBzdGF0ZTogJ0lETEUnLFxuICAgIGxhc3RTdGF0ZTogJ0lETEUnXG59KTtcblxuZXhwb3J0IGNvbnN0IFBsYXllckNvbXBvbmVudCA9IChpZCwgY2hhclR5cGUsIGlzTG9jYWwgPSBmYWxzZSkgPT4gKHtcbiAgICBpZDogaWQsXG4gICAgY2hhclR5cGU6IGNoYXJUeXBlLFxuICAgIGlzTG9jYWw6IGlzTG9jYWxcbn0pO1xuXG5leHBvcnQgY29uc3QgQm9tYkNvbXBvbmVudCA9IChvd25lcklkLCB0aW1lciA9IDIwMDAsIHJhbmdlID0gNCkgPT4gKHtcbiAgICBvd25lcklkOiBvd25lcklkLFxuICAgIHRpbWVyOiB0aW1lcixcbiAgICByYW5nZTogcmFuZ2UsXG4gICAgZXhwbG9kZWQ6IGZhbHNlXG59KTtcblxuZXhwb3J0IGNvbnN0IEV4cGxvc2lvbkNvbXBvbmVudCA9IChkdXJhdGlvbiA9IDUwMCkgPT4gKHtcbiAgICBkdXJhdGlvbjogZHVyYXRpb25cbn0pO1xuXG5leHBvcnQgY29uc3QgUG93ZXJVcENvbXBvbmVudCA9ICh0eXBlKSA9PiAoe1xuICAgIHR5cGU6IHR5cGUsIFxuICAgIHBpY2tlZFVwOiBmYWxzZVxufSk7XG5cbmV4cG9ydCBjb25zdCBCZWhhdmlvckNvbXBvbmVudCA9ICgpID0+ICh7XG4gICAgZ2hvc3RNb2RlOiBmYWxzZSxcbiAgICB0aHJvd2FibGU6IGZhbHNlLFxuICAgIGRldG9uYXRvcjogZmFsc2UsXG4gICAgZmFzdFNob2VzTGV2ZWw6IDEsXG4gICAgYm9tYnM6IHtcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICByYW5nZTogMlxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkLmpzJztcbmltcG9ydCB7XG4gICAgUG9zaXRpb25Db21wb25lbnQsXG4gICAgVmVsb2NpdHlDb21wb25lbnQsXG4gICAgSW5wdXRDb21wb25lbnQsXG4gICAgUmVuZGVyYWJsZUNvbXBvbmVudCxcbiAgICBQbGF5ZXJDb21wb25lbnQsXG4gICAgQm9tYkNvbXBvbmVudFxufSBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuXG5pbXBvcnQgeyBtb3ZlbWVudFN5c3RlbSB9IGZyb20gJy4vc3lzdGVtcy9tb3ZlbWVudFN5c3RlbS5qcyc7XG5pbXBvcnQgeyByZW5kZXJTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvcmVuZGVyU3lzdGVtLmpzJztcbmltcG9ydCB7IGJvbWJTeXN0ZW0gfSBmcm9tICcuL3N5c3RlbXMvYm9tYlN5c3RlbS5qcyc7XG5pbXBvcnQgeyBkYW1hZ2VTeXN0ZW0sIGNoZWNrRXh0cmFMaWZlQ29sbGlzaW9uLCBjaGVja0dhbWVFbmRDb25kaXRpb25zIH0gZnJvbSAnLi9zeXN0ZW1zL2RhbWFnZVN5c3RlbS5qcyc7XG5pbXBvcnQgeyBwb3dlclVwU3lzdGVtLCBzcGF3blBvd2VyVXAgfSBmcm9tICcuL3N5c3RlbXMvcG93ZXJVcFN5c3RlbS5qcyc7XG5pbXBvcnQgeyBzZXRCb21icywgc2V0TGl2ZXMsIHNldFJhbmdlLCBzZXRTcGVlZCB9IGZyb20gJy4uL3BhZ2VzL2dhbWUnO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEFOSU1BVElPTl9ST1dTID0ge1xuICAgIFJVTjogeyB1cDogMzgsIGxlZnQ6IDM5LCBkb3duOiA0MCwgcmlnaHQ6IDQxIH0sXG4gICAgSURMRTogeyB1cDogMjIsIGxlZnQ6IDIzLCBkb3duOiAyNCwgcmlnaHQ6IDI1IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBHYW1lRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNDb250YWluZXIsIG1hcERhdGEsIHNvY2tldCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNhbnZhc0NvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gbWFwRGF0YTtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcbiAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IG51bGw7XG4gICAgICAgIHRoaXMucGxheWVyRW50aXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsYWltZWRQb3dlclVwcyA9IG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICBpbml0KGxvY2FsUGxheWVySWQsIGFsbFBsYXllcnMpIHtcbiAgICAgICAgdGhpcy50b3RhbFBsYXllcnMgPSBhbGxQbGF5ZXJzLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZExvY2FsUGxheWVySWQgPSBTdHJpbmcobG9jYWxQbGF5ZXJJZCk7XG5cbiAgICAgICAgYWxsUGxheWVycy5mb3JFYWNoKHBEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcklkID0gU3RyaW5nKHBEYXRhLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllckVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcERhdGEuY29sb3IgfHwgXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gYHBsYXllciBwbGF5ZXItJHtjb2xvcn1gO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHBsYXllckRpdi5zdHlsZS56SW5kZXggPSAnMTAnO1xuICAgICAgICAgICAgcGxheWVyRGl2LnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckRpdik7XG5cbiAgICAgICAgICAgIGNvbnN0IHN4ID0gcERhdGEueCB8fCAxO1xuICAgICAgICAgICAgY29uc3Qgc3kgPSBwRGF0YS55IHx8IDE7XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJywgUG9zaXRpb25Db21wb25lbnQoc3gsIHN5LCBUSUxFX1NJWkUpKTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5JywgVmVsb2NpdHlDb21wb25lbnQoMi41KSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJywgUmVuZGVyYWJsZUNvbXBvbmVudChwbGF5ZXJEaXYsIDY0LCA2NCwgNCwgMTIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpc0xvY2FsID0gcGxheWVySWQgPT09IG5vcm1hbGl6ZWRMb2NhbFBsYXllcklkO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyQ29tcCA9IFBsYXllckNvbXBvbmVudChwbGF5ZXJJZCwgY29sb3IsIGlzTG9jYWwpO1xuICAgICAgICAgICAgcGxheWVyQ29tcC5saXZlcyA9IDM7XG4gICAgICAgICAgICBwbGF5ZXJDb21wLm1heEJvbWJzID0gMTtcbiAgICAgICAgICAgIHBsYXllckNvbXAuYm9tYlJhbmdlID0gNDtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQ29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicsIHBsYXllckNvbXApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFbnRpdGllcy5zZXQocGxheWVySWQsIHBsYXllckVudGl0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc0xvY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFBsYXllckVudGl0eSA9IHBsYXllckVudGl0eTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdJbnB1dCcsIElucHV0Q29tcG9uZW50KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHMocGxheWVyRW50aXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltHYW1lRW5naW5lXSBMb2NhbCBwbGF5ZXIgd2FzIG5vdCBmb3VuZFwiLCB7XG4gICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXJJZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzOiBhbGxQbGF5ZXJzLm1hcChwbGF5ZXIgPT4gcGxheWVyLmlkKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlclN5c3RlbXMoKTtcblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKG5vdykgPT4gdGhpcy5nYW1lTG9vcChub3cpKTtcbiAgICB9XG5cbiAgICBzZXR1cElucHV0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdJbnB1dCcpO1xuICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZ2V0S2V5RGlyZWN0aW9uID0gKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93VXAnIHx8IGtleSA9PT0gJ3cnIHx8IGtleSA9PT0gJ1onIHx8IGtleSA9PT0gJ3onKSByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdBcnJvd0Rvd24nIHx8IGtleSA9PT0gJ3MnIHx8IGtleSA9PT0gJ1MnKSByZXR1cm4gJ2Rvd24nO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0Fycm93TGVmdCcgfHwga2V5ID09PSAnYScgfHwga2V5ID09PSAnUScgfHwga2V5ID09PSAncScpIHJldHVybiAnbGVmdCc7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnQXJyb3dSaWdodCcgfHwga2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpIHJldHVybiAncmlnaHQnO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBnZXRLZXlEaXJlY3Rpb24oZS5rZXkpO1xuICAgICAgICAgICAgaWYgKGRpciAmJiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmlucHV0UXVldWUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlLnVuc2hpZnQoZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BCb21iKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gZ2V0S2V5RGlyZWN0aW9uKGUua2V5KTtcbiAgICAgICAgICAgIGlmIChkaXIgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5pbnB1dFF1ZXVlID0gaW5wdXQuaW5wdXRRdWV1ZS5maWx0ZXIoZCA9PiBkICE9PSBkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUlucHV0TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkcm9wQm9tYigpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxQbGF5ZXJFbnRpdHkgPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudCh0aGlzLmxvY2FsUGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQodGhpcy5sb2NhbFBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRCb21icyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5maWx0ZXIoYkVudGl0eSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoYkVudGl0eSwgJ0JvbWInKS5vd25lcklkID09PSBwbGF5ZXIuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjdXJyZW50Qm9tYnMubGVuZ3RoID49IHBsYXllci5tYXhCb21icykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUJvbWIocGxheWVyLmlkLCBwb3MuZ3JpZFgsIHBvcy5ncmlkWSwgcGxheWVyLmJvbWJSYW5nZSk7XG4gICAgICAgIGlmICghY3JlYXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0RST1BfQk9NQicsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyBpZDogcGxheWVyLmlkLCB4OiBwb3MuZ3JpZFgsIHk6IHBvcy5ncmlkWSwgcmFuZ2U6IHBsYXllci5ib21iUmFuZ2UgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQm9tYihvd25lcklkLCBncmlkWCwgZ3JpZFksIHJhbmdlKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMud29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0JvbWInKS5zb21lKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYm9tYiA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ0JvbWInKTtcbiAgICAgICAgICAgIHJldHVybiBib21iLm93bmVySWQgPT09IG93bmVySWQgJiYgcG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXhpc3RzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYm9tYkVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgIGNvbnN0IGJvbWJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9tYkRpdi5jbGFzc05hbWUgPSAnYm9tYic7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib21iRGl2LnN0eWxlLmxlZnQgPSBgJHtncmlkWCAqIFRJTEVfU0laRX1weGA7XG4gICAgICAgIGJvbWJEaXYuc3R5bGUudG9wID0gYCR7Z3JpZFkgKiBUSUxFX1NJWkV9cHhgO1xuICAgICAgICBib21iRGl2LnN0eWxlLnpJbmRleCA9ICc2JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYm9tYkRpdik7XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRDb21wb25lbnQoYm9tYkVudGl0eSwgJ1Bvc2l0aW9uJywgeyBncmlkWCwgZ3JpZFkgfSk7XG5cbiAgICAgICAgY29uc3QgYm9tYkNvbXAgPSBCb21iQ29tcG9uZW50KG93bmVySWQsIDIwMDAsIHJhbmdlKTtcbiAgICAgICAgYm9tYkNvbXAuZWwgPSBib21iRGl2O1xuICAgICAgICB0aGlzLndvcmxkLmFkZENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicsIGJvbWJDb21wKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFuZGxlUmVtb3RlTW92ZShwYXlsb2FkKSB7XG4gICAgICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5pZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW2hhbmRsZVJlbW90ZU1vdmVdIEludmFsaWQgcGF5bG9hZDpcIiwgcGF5bG9hZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtoYW5kbGVSZW1vdGVNb3ZlXSBFbnRpdHkgbm90IGZvdW5kIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfS4gQXZhaWxhYmxlIHBsYXllcnM6YCwgQXJyYXkuZnJvbSh0aGlzLnBsYXllckVudGl0aWVzLmtleXMoKSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtoYW5kbGVSZW1vdGVNb3ZlXSBJZ25vcmluZyBsb2NhbCBwbGF5ZXIgdXBkYXRlIGZvciAke3BheWxvYWQuaWR9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwb3MgfHwgIXZlbCB8fCAhcmVuZGVyYWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaGFuZGxlUmVtb3RlTW92ZV0gTWlzc2luZyBjb21wb25lbnRzIGZvciBwbGF5ZXIgJHtwYXlsb2FkLmlkfTpgLCB7IHBvczogISFwb3MsIHZlbDogISF2ZWwsIHJlbmRlcmFibGU6ICEhcmVuZGVyYWJsZSB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBbaGFuZGxlUmVtb3RlTW92ZV0gVXBkYXRpbmcgcGxheWVyICR7cGF5bG9hZC5pZH0gdG8gKCR7cGF5bG9hZC5ncmlkWH0sICR7cGF5bG9hZC5ncmlkWX0pYCk7XG4gICAgICAgIHZlbC5kaXJlY3Rpb24gPSBwYXlsb2FkLmRpcmVjdGlvbiB8fCB2ZWwuZGlyZWN0aW9uO1xuICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBwYXlsb2FkLmlzTW92aW5nO1xuICAgICAgICBwb3MuZ3JpZFggPSBwYXlsb2FkLmdyaWRYO1xuICAgICAgICBwb3MuZ3JpZFkgPSBwYXlsb2FkLmdyaWRZO1xuICAgICAgICBwb3MudGFyZ2V0WCA9IHBheWxvYWQueDtcbiAgICAgICAgcG9zLnRhcmdldFkgPSBwYXlsb2FkLnk7XG4gICAgICAgIHJlbmRlcmFibGUuc3RhdGUgPSBwYXlsb2FkLnN0YXRlIHx8IChwYXlsb2FkLmlzTW92aW5nID8gJ1JVTicgOiAnSURMRScpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZUJvbWIocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5jcmVhdGVCb21iKHBheWxvYWQuaWQsIHBheWxvYWQueCwgcGF5bG9hZC55LCBwYXlsb2FkLnJhbmdlIHx8IDQpO1xuICAgIH1cblxuICAgIGhhbmRsZVJlbW90ZVBvd2VyVXBQaWNrZWQocGF5bG9hZCkge1xuICAgICAgICBpZiAoIXBheWxvYWQgfHwgcGF5bG9hZC54ID09PSB1bmRlZmluZWQgfHwgcGF5bG9hZC55ID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnJlbW92ZVBvd2VyVXBBdChwYXlsb2FkLngsIHBheWxvYWQueSk7XG5cbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5wbGF5ZXJFbnRpdGllcy5nZXQoU3RyaW5nKHBheWxvYWQuaWQpKTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkIHx8IGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYXBwbHlQb3dlclVwKGVudGl0eSwgcGF5bG9hZC50eXBlKTtcbiAgICB9XG5cbiAgICByZW1vdmVQb3dlclVwQXQoZ3JpZFgsIGdyaWRZKSB7XG4gICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHtncmlkWH0sJHtncmlkWX1gKTtcbiAgICAgICAgY29uc3QgcG93ZXJVcHMgPSB0aGlzLndvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwb3dlclVwID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCFwb3MgfHwgIXBvd2VyVXApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAocG9zLmdyaWRYID09PSBncmlkWCAmJiBwb3MuZ3JpZFkgPT09IGdyaWRZKSB7XG4gICAgICAgICAgICAgICAgcG93ZXJVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAocG93ZXJVcC5lbCAmJiBwb3dlclVwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG93ZXJVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvd2VyVXAuZWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuZGVzdHJveUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UG93ZXJVcChlbnRpdHksIHR5cGUpIHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgIXZlbG9jaXR5KSByZXR1cm47XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdTUEVFRCcpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5LnNwZWVkID0gTWF0aC5taW4odmVsb2NpdHkuc3BlZWQgKyAxLCA4KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnQk9NQlMnKSB7XG4gICAgICAgICAgICBwbGF5ZXIubWF4Qm9tYnMgPSBwbGF5ZXIubWF4Qm9tYnMgPyBwbGF5ZXIubWF4Qm9tYnMgKyAxIDogMjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnRkxBTUUnKSB7XG4gICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVyU3lzdGVtcygpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlTWFwQ2VsbCA9ICh4LCB5LCBuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm1hcERhdGFbeV0pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5tYXBEYXRhW3ldW3hdID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCk7XG4gICAgICAgICAgICBpZiAoIXRpbGUpIHJldHVybjtcblxuICAgICAgICAgICAgdGlsZS5jbGFzc05hbWUgPSAndGlsZSB0aWxlLWZsb29yJztcbiAgICAgICAgICAgIHRpbGUuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybChcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19mbG9vci5qcGdcIiknO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGRlc3Ryb3lCb3hDYWxsYmFjayA9ICh4LCB5KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGFpbWVkUG93ZXJVcHMuaGFzKGAke3h9LCR7eX1gKSkgcmV0dXJuO1xuICAgICAgICAgICAgc3Bhd25Qb3dlclVwKHRoaXMud29ybGQsIHgsIHksIHRoaXMuY29udGFpbmVyLCBUSUxFX1NJWkUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUGxheWVySHVydCA9IChlbnRpdHksIGlkLCByZW1haW5pbmdMaXZlcykgPT4ge1xuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdGhpcy5sb2NhbFBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgICAgIHNldExpdmVzKHJlbWFpbmluZ0xpdmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblBvd2VyVXBQaWNrZWQgPSAoaWQsIHR5cGUsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xhaW1lZFBvd2VyVXBzLmFkZChgJHt4fSwke3l9YCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxvY2FsUGxheWVyRW50aXR5ID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KHRoaXMubG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgcGxheWVyLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSHVkU3RhdHModGhpcy5sb2NhbFBsYXllckVudGl0eSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9XRVJVUF9QSUNLRUQnLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGlkLCB0eXBlLCB4LCB5IH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5icm9hZGNhc3RNb3ZlbWVudCA9IChlbnRpdHksIHgsIHksIGdyaWRYLCBncmlkWSwgZGlyZWN0aW9uLCBpc01vdmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy53b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBpZiAoIXBsYXllciB8fCAhdGhpcy5zb2NrZXQgfHwgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ01PVkVfU1RBVEUnLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBsYXllci5pZCxcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFgsXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGlzTW92aW5nLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogaXNNb3ZpbmcgPyAnUlVOJyA6ICdJRExFJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IG1vdmVtZW50U3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBib21iU3lzdGVtKHcsIGR0LCBub3csIHRoaXMubWFwRGF0YSwgdXBkYXRlTWFwQ2VsbCwgZGVzdHJveUJveENhbGxiYWNrLCBUSUxFX1NJWkUpKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRTeXN0ZW0oKHcsIGR0LCBub3cpID0+IGRhbWFnZVN5c3RlbSh3LCBub3csIG9uUGxheWVySHVydCwgVElMRV9TSVpFKSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkU3lzdGVtKCh3LCBkdCwgbm93KSA9PiBwb3dlclVwU3lzdGVtKHcsIG9uUG93ZXJVcFBpY2tlZCkpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZFN5c3RlbSgodywgZHQsIG5vdykgPT4gcmVuZGVyU3lzdGVtKHcsIGR0LCBub3csIEFOSU1BVElPTl9ST1dTKSk7XG4gICAgfVxuXG4gICAgZ2FtZUxvb3Aobm93KSB7XG4gICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZHQgPSBub3cgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gbm93O1xuICAgICAgICB0aGlzLndvcmxkLnVwZGF0ZShkdCwgbm93KTtcbiAgICAgICAgXG4gICAgICAgIC8vIENoZWNrIGZvciBleHRyYSBsaWZlIGNvbGxpc2lvbiB3aXRoIHBsYXllcnNcbiAgICAgICAgY2hlY2tFeHRyYUxpZmVDb2xsaXNpb24odGhpcy53b3JsZCwgVElMRV9TSVpFKTtcbiAgICAgICAgXG4gICAgICAgIC8vIENoZWNrIGZvciBnYW1lIGVuZCBjb25kaXRpb25zICh3aW4vbG9zcylcbiAgICAgICAgY2hlY2tHYW1lRW5kQ29uZGl0aW9ucyh0aGlzLndvcmxkLCB0aGlzLmxvY2FsUGxheWVyRW50aXR5LCB0aGlzLnBsYXllckVudGl0aWVzLCB0aGlzLnRvdGFsUGxheWVycyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChuZXh0Tm93KSA9PiB0aGlzLmdhbWVMb29wKG5leHROb3cpKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbnB1dExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlSHVkU3RhdHMoZW50aXR5KSB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1BsYXllcicpO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGlmICghcGxheWVyIHx8ICF2ZWxvY2l0eSkgcmV0dXJuO1xuXG4gICAgICAgIHNldEJvbWJzKHBsYXllci5tYXhCb21icyB8fCAxKTtcbiAgICAgICAgc2V0TGl2ZXMocGxheWVyLmxpdmVzID8/IDMpO1xuICAgICAgICBzZXRSYW5nZShwbGF5ZXIuYm9tYlJhbmdlIHx8IDQpO1xuICAgICAgICBzZXRTcGVlZChNYXRoLnJvdW5kKHZlbG9jaXR5LnNwZWVkKSk7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudExvY2FsUGxheWVyTmFtZSA9IFwiXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKG5hbWUpIHtcbiAgICBjdXJyZW50TG9jYWxQbGF5ZXJOYW1lID0gbmFtZTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJvbWJlcm1hbl9wbGF5ZXJfbmFtZVwiLCBuYW1lKTtcbiAgICBjb25zb2xlLmxvZyhcIlBsYXllciByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVwiLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXllck5hbWUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRMb2NhbFBsYXllck5hbWUgfHwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJib21iZXJtYW5fcGxheWVyX25hbWVcIikgfHwgXCJQbGF5ZXJcIjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBib21iU3lzdGVtKHdvcmxkLCBkdCwgbm93LCBtYXBEYXRhLCB1cGRhdGVNYXBDZWxsLCBkZXN0cm95Qm94Q2FsbGJhY2ssIHRpbGVTaXplID0gNjQpIHtcbiAgICBjb25zdCBib21icyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdCb21iJyk7XG4gICAgXG4gICAgZm9yIChjb25zdCBib21iRW50aXR5IG9mIGJvbWJzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgYm9tYiA9IHdvcmxkLmdldENvbXBvbmVudChib21iRW50aXR5LCAnQm9tYicpO1xuICAgICAgICBcbiAgICAgICAgYm9tYi50aW1lciAtPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmIChib21iLnRpbWVyIDw9IDAgJiYgIWJvbWIuZXhwbG9kZWQpIHtcbiAgICAgICAgICAgIGJvbWIuZXhwbG9kZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBhZmZlY3RlZENlbGxzID0gY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMocG9zLmdyaWRYLCBwb3MuZ3JpZFksIGJvbWIucmFuZ2UsIG1hcERhdGEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhZmZlY3RlZENlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRW50aXR5ID0gd29ybGQuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgZXhwRGl2LmNsYXNzTmFtZSA9ICdleHBsb3Npb24nO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLndpZHRoID0gYCR7dGlsZVNpemV9cHhgO1xuICAgICAgICAgICAgICAgIGV4cERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLmxlZnQgPSBgJHtjZWxsLnggKiB0aWxlU2l6ZX1weGA7XG4gICAgICAgICAgICAgICAgZXhwRGl2LnN0eWxlLnRvcCA9IGAke2NlbGwueSAqIHRpbGVTaXplfXB4YDtcbiAgICAgICAgICAgICAgICBleHBEaXYuc3R5bGUuekluZGV4ID0gJzcnO1xuXG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQ29tcG9uZW50KGV4cEVudGl0eSwgJ1Bvc2l0aW9uJywgeyBcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFg6IGNlbGwueCwgXG4gICAgICAgICAgICAgICAgICAgIGdyaWRZOiBjZWxsLnksIFxuICAgICAgICAgICAgICAgICAgICB4OiBjZWxsLnggKiB0aWxlU2l6ZSwgXG4gICAgICAgICAgICAgICAgICAgIHk6IGNlbGwueSAqIHRpbGVTaXplIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvcmxkLmFkZENvbXBvbmVudChleHBFbnRpdHksICdFeHBsb3Npb24nLCB7IGR1cmF0aW9uOiA1MDAsIGVsOiBleHBEaXYgfSk7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGV4cERpdik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG1hcERhdGFbY2VsbC55XSAmJiBtYXBEYXRhW2NlbGwueV1bY2VsbC54XSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNYXBDZWxsKGNlbGwueCwgY2VsbC55LCAyKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXN0cm95Qm94Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lCb3hDYWxsYmFjayhjZWxsLngsIGNlbGwueSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGJvbWIuZWwgJiYgYm9tYi5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgYm9tYi5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJvbWIuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShib21iRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgY29uc3QgZXhwID0gd29ybGQuZ2V0Q29tcG9uZW50KGV4cEVudGl0eSwgJ0V4cGxvc2lvbicpO1xuICAgICAgICBleHAuZHVyYXRpb24gLT0gZHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoZXhwLmR1cmF0aW9uIDw9IDApIHtcbiAgICAgICAgICAgIGlmIChleHAuZWwgJiYgZXhwLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBleHAuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChleHAuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ybGQuZGVzdHJveUVudGl0eShleHBFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVFeHBsb3Npb25DZWxscyhieCwgYnksIHJhbmdlLCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbHMgPSBbeyB4OiBieCwgeTogYnkgfV07XG4gICAgY29uc3QgZGlyZWN0aW9ucyA9IFtcbiAgICAgICAgeyB4OiAwLCB5OiAtMSB9LFxuICAgICAgICB7IHg6IDAsIHk6IDEgfSxcbiAgICAgICAgeyB4OiAtMSwgeTogMCB9LFxuICAgICAgICB7IHg6IDEsIHk6IDAgfVxuICAgIF07XG4gICAgXG4gICAgY29uc3Qgc3RlcHMgPSByYW5nZSAtIDE7IFxuICAgIFxuICAgIGRpcmVjdGlvbnMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0eCA9IGJ4ICsgKGRpci54ICogaSk7XG4gICAgICAgICAgICBjb25zdCB0eSA9IGJ5ICsgKGRpci55ICogaSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghbWFwRGF0YVt0eV0gfHwgbWFwRGF0YVt0eV1bdHhdID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjZWxsVHlwZSA9IG1hcERhdGFbdHldW3R4XTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNlbGxzLnB1c2goeyB4OiB0eCwgeTogdHkgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGNlbGxzO1xufVxuIiwiaW1wb3J0IHsgZ2V0UGxheWVyTmFtZSB9IGZyb20gJy4uL2dhbWUuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBMb3NzIHBvcC11cCBtb2RhbCBmb3IgdGhlIGVsaW1pbmF0ZWQgcGxheWVyLlxuICogQmxvY2tzIHRoZWlyIHNjcmVlbiBpbW1lZGlhdGVseSBzbyB0aGV5IGNhbm5vdCBzcGVjdGF0ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGF5ZXJOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGVsaW1pbmF0ZWQgcGxheWVyXG4gKi9cbmZ1bmN0aW9uIHNob3dMb3NzUG9wdXAocGxheWVyTmFtZSkge1xuICAgIC8vIENoZWNrIGlmIHBvcHVwIGFscmVhZHkgZXhpc3RzIHRvIGF2b2lkIGR1cGxpY2F0ZXNcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtcmVzdWx0LXBvcHVwJykpIHJldHVybjtcbiAgICBcbiAgICAvLyBDcmVhdGUgb3ZlcmxheSB3aXRoIGV4dHJlbWVseSBoaWdoIHotaW5kZXggdG8gYmxvY2sgZW50aXJlIHNjcmVlblxuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdmVybGF5LmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1wb3B1cCBsb3NzJztcbiAgICBvdmVybGF5LnN0eWxlLnpJbmRleCA9ICc5OTk5OSc7XG4gICAgb3ZlcmxheS5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgb3ZlcmxheS5zdHlsZS50b3AgPSAnMCc7XG4gICAgb3ZlcmxheS5zdHlsZS5sZWZ0ID0gJzAnO1xuICAgIG92ZXJsYXkuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgb3ZlcmxheS5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgb3ZlcmxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLCAwLCAwLCAwLjkpJztcbiAgICBvdmVybGF5LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgb3ZlcmxheS5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgb3ZlcmxheS5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInO1xuICAgIFxuICAgIC8vIENyZWF0ZSBwb3B1cCBjb250ZW50XG4gICAgY29uc3QgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwb3B1cC5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtcG9wdXAtY29udGVudCc7XG4gICAgXG4gICAgY29uc3QgdGl0bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9ICdZb3UgYXJlIHRlcnJpYmxlIGF0IHRoaXMhIFdhY2ggbGEzYiBiIHJqbGlrPyc7XG4gICAgdGl0bGVFbC5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtdGl0bGUnO1xuICAgIHRpdGxlRWwuc3R5bGUuY29sb3IgPSAnI2ZmNDQ0NCc7XG4gICAgdGl0bGVFbC5zdHlsZS5mb250U2l6ZSA9ICczNnB4JztcbiAgICB0aXRsZUVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICczMHB4JztcbiAgICBcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSAnUmVzdGFydCc7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1idXR0b24nO1xuICAgIGJ1dHRvbi5zdHlsZS5wYWRkaW5nID0gJzE1cHggNDBweCc7XG4gICAgYnV0dG9uLnN0eWxlLmZvbnRTaXplID0gJzIwcHgnO1xuICAgIGJ1dHRvbi5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAvLyBGb3JjZSBoYXJkIHJlc2V0IC0gc2VuZCB0byBpbml0aWFsIHBhZ2VcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gICAgfSk7XG4gICAgXG4gICAgcG9wdXAuYXBwZW5kQ2hpbGQodGl0bGVFbCk7XG4gICAgcG9wdXAuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBvdmVybGF5LmFwcGVuZENoaWxkKHBvcHVwKTtcbiAgICBcbiAgICAvLyBBcHBlbmQgdG8gZG9jdW1lbnQuYm9keSB0byBibG9jayB0aGUgZW50aXJlIHNjcmVlbiBpbW1lZGlhdGVseVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIFdpbiBwb3AtdXAgbW9kYWwgZm9yIHRoZSB2aWN0b3Jpb3VzIHBsYXllci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGF5ZXJOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHdpbm5pbmcgcGxheWVyXG4gKi9cbmZ1bmN0aW9uIHNob3dXaW5Qb3B1cChwbGF5ZXJOYW1lKSB7XG4gICAgLy8gQ2hlY2sgaWYgcG9wdXAgYWxyZWFkeSBleGlzdHMgdG8gYXZvaWQgZHVwbGljYXRlc1xuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1yZXN1bHQtcG9wdXAnKSkgcmV0dXJuO1xuICAgIFxuICAgIC8vIENyZWF0ZSBvdmVybGF5IHdpdGggZXh0cmVtZWx5IGhpZ2ggei1pbmRleFxuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdmVybGF5LmNsYXNzTmFtZSA9ICdnYW1lLXJlc3VsdC1wb3B1cCB3aW4nO1xuICAgIG92ZXJsYXkuc3R5bGUuekluZGV4ID0gJzk5OTk5JztcbiAgICBcbiAgICAvLyBDcmVhdGUgcG9wdXAgY29udGVudFxuICAgIGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcG9wdXAuY2xhc3NOYW1lID0gJ2dhbWUtcmVzdWx0LXBvcHVwLWNvbnRlbnQnO1xuICAgIFxuICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgIHRpdGxlRWwudGV4dENvbnRlbnQgPSBgJHtwbGF5ZXJOYW1lLnRvVXBwZXJDYXNlKCl9IFdPTiFgO1xuICAgIHRpdGxlRWwuY2xhc3NOYW1lID0gJ2dhbWUtcmVzdWx0LXRpdGxlJztcbiAgICBcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSAnUmV0dXJuIHRvIEhvbWUnO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAnZ2FtZS1yZXN1bHQtYnV0dG9uJztcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIC8vIE1VU1QgcmVtb3ZlIG1vZGFsIGZyb20gRE9NIGZpcnN0IHRvIHByZXZlbnQgXCJnaG9zdCBtb2RhbFwiIGJ1Z1xuICAgICAgICBvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICAvLyBGb3JjZSBoYXJkIHJlZGlyZWN0IHRvIGVuc3VyZSBjbGVhbiBzbGF0ZSBhbmQgZGVzdHJveSBhbnkgbGVmdG92ZXIgRE9NIGVsZW1lbnRzXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgIH0pO1xuICAgIFxuICAgIHBvcHVwLmFwcGVuZENoaWxkKHRpdGxlRWwpO1xuICAgIHBvcHVwLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgb3ZlcmxheS5hcHBlbmRDaGlsZChwb3B1cCk7XG4gICAgXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHBsYXllciBkZWF0aCB0cmFuc2l0aW9uIHdoZW4gbGl2ZXMgcmVhY2ggMC5cbiAqIFJlbW92ZXMgdGhlIHBsYXllcidzIERPTSBlbGVtZW50IGFuZCBzcGF3bnMgYW4gZXh0cmEtbGlmZSBkcm9wIGF0IHRoZSBkZWF0aCBsb2NhdGlvbi5cbiAqIFxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckVudGl0eSAtIFRoZSBlbnRpdHkgSUQgb2YgdGhlIGR5aW5nIHBsYXllclxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIGdhbWUgY29udGFpbmVyIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gaGFuZGxlUGxheWVyRGVhdGgod29ybGQsIHBsYXllckVudGl0eSwgdGlsZVNpemUgPSA2NCwgY29udGFpbmVyID0gbnVsbCkge1xuICAgIC8vIEdldCB0aGUgcGxheWVyJ3MgY29tcG9uZW50c1xuICAgIGNvbnN0IHBvc2l0aW9uID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgY29uc3QgcGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1BsYXllcicpO1xuICAgIFxuICAgIGlmICghcG9zaXRpb24gfHwgIXJlbmRlcmFibGUgfHwgIXBsYXllcikgcmV0dXJuO1xuICAgIFxuICAgIC8vIFN0b3JlIHRoZSBncmlkIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwbGF5ZXIgZGllZFxuICAgIGNvbnN0IGRlYXRoR3JpZFggPSBNYXRoLmZsb29yKChwb3NpdGlvbi54ICsgdGlsZVNpemUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICBjb25zdCBkZWF0aEdyaWRZID0gTWF0aC5mbG9vcigocG9zaXRpb24ueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgXG4gICAgLy8gMS4gUmVtb3ZlIHRoZSBwbGF5ZXIncyBET00gZWxlbWVudCBlbnRpcmVseVxuICAgIGlmIChyZW5kZXJhYmxlLmVsICYmIHJlbmRlcmFibGUuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZW5kZXJhYmxlLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocmVuZGVyYWJsZS5lbCk7XG4gICAgfVxuICAgIFxuICAgIC8vIDIuIERlc3Ryb3kgdGhlIHBsYXllciBlbnRpdHkgZnJvbSB0aGUgd29ybGQgKHJlbW92ZXMgYWxsIGNvbXBvbmVudHMpXG4gICAgd29ybGQuZGVzdHJveUVudGl0eShwbGF5ZXJFbnRpdHkpO1xuICAgIFxuICAgIC8vIDMuIENyZWF0ZSBhIGRpdiB3aXRoIGhlYXJ0IGVtb2ppIGF0IHRoZSBleGFjdCBkZWF0aCBsb2NhdGlvblxuICAgIGNvbnN0IGhlYXJ0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhcnREaXYuY2xhc3NOYW1lID0gJ2V4dHJhLWxpZmUtZHJvcCc7XG4gICAgaGVhcnREaXYudGV4dENvbnRlbnQgPSAn4p2k77iPJztcbiAgICBoZWFydERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgaGVhcnREaXYuc3R5bGUubGVmdCA9IGAke2RlYXRoR3JpZFggKiB0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUudG9wID0gYCR7ZGVhdGhHcmlkWSAqIHRpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBoZWFydERpdi5zdHlsZS5oZWlnaHQgPSBgJHt0aWxlU2l6ZX1weGA7XG4gICAgaGVhcnREaXYuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICBoZWFydERpdi5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgaGVhcnREaXYuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcbiAgICBoZWFydERpdi5zdHlsZS5mb250U2l6ZSA9ICczMnB4JztcbiAgICBoZWFydERpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgaGVhcnREaXYuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICBcbiAgICAvLyBBcHBlbmQgdG8gdGhlIGdhbWUgY29udGFpbmVyXG4gICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICBpZiAoZ2FtZUNvbnRhaW5lcikge1xuICAgICAgICBnYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGhlYXJ0RGl2KTtcbiAgICB9XG4gICAgXG4gICAgY29uc29sZS5sb2coYFtQbGF5ZXIgRGVhdGhdIFBsYXllciAke3BsYXllci5pZH0gZGllZCBhdCAoJHtkZWF0aEdyaWRYfSwgJHtkZWF0aEdyaWRZfSkuIEhlYXJ0IGRyb3BwZWQuYCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGZvciBjb2xsaXNpb24gYmV0d2VlbiBwbGF5ZXJzIGFuZCBleHRyYS1saWZlLWRyb3AgRE9NIGVsZW1lbnRzLlxuICogV2hlbiBhIHBsYXllciBjb2xsaWRlcyB3aXRoIGFuIGV4dHJhLWxpZmUtZHJvcCwgdGhleSBnYWluICsxIGxpZmUgYW5kIHRoZSBkcm9wIGlzIHJlbW92ZWQuXG4gKiBPbmx5IHRoZSBmaXJzdCBwbGF5ZXIgdG8gdG91Y2ggaXQgZ2V0cyB0aGUgbGlmZS5cbiAqIFxuICogQHBhcmFtIHtXb3JsZH0gd29ybGQgLSBUaGUgZ2FtZSB3b3JsZCBpbnN0YW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IHRpbGVTaXplIC0gVGhlIHNpemUgb2YgZWFjaCBncmlkIHRpbGUgKGRlZmF1bHQ6IDY0KVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tFeHRyYUxpZmVDb2xsaXNpb24od29ybGQsIHRpbGVTaXplID0gNjQpIHtcbiAgICAvLyBGaW5kIGFsbCBleHRyYS1saWZlLWRyb3AgZWxlbWVudHMgaW4gdGhlIERPTVxuICAgIGNvbnN0IGV4dHJhTGlmZURyb3BzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmV4dHJhLWxpZmUtZHJvcCcpO1xuICAgIGlmIChleHRyYUxpZmVEcm9wcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBcbiAgICAvLyBHZXQgYWxsIGFjdGl2ZSBwbGF5ZXJzIHdpdGggUG9zaXRpb24gYW5kIFBsYXllciBjb21wb25lbnRzXG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQbGF5ZXInKTtcbiAgICBpZiAocGxheWVycy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBcbiAgICBmb3IgKGNvbnN0IGRyb3Agb2YgZXh0cmFMaWZlRHJvcHMpIHtcbiAgICAgICAgLy8gUGFyc2UgdGhlIGdyaWQgcG9zaXRpb24gZnJvbSB0aGUgZHJvcCdzIENTUyBsZWZ0L3RvcCBwcm9wZXJ0aWVzXG4gICAgICAgIGNvbnN0IGRyb3BMZWZ0ID0gcGFyc2VJbnQoZHJvcC5zdHlsZS5sZWZ0LCAxMCk7XG4gICAgICAgIGNvbnN0IGRyb3BUb3AgPSBwYXJzZUludChkcm9wLnN0eWxlLnRvcCwgMTApO1xuICAgICAgICBcbiAgICAgICAgaWYgKGlzTmFOKGRyb3BMZWZ0KSB8fCBpc05hTihkcm9wVG9wKSkgY29udGludWU7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkcm9wR3JpZFggPSBNYXRoLnJvdW5kKGRyb3BMZWZ0IC8gdGlsZVNpemUpO1xuICAgICAgICBjb25zdCBkcm9wR3JpZFkgPSBNYXRoLnJvdW5kKGRyb3BUb3AgLyB0aWxlU2l6ZSk7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgICAgICBjb25zdCBwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghcFBvcyB8fCAhcGxheWVyKSBjb250aW51ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHBsYXllcidzIGN1cnJlbnQgZ3JpZCBwb3NpdGlvblxuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFggPSBNYXRoLmZsb29yKChwUG9zLnggKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyR3JpZFkgPSBNYXRoLmZsb29yKChwUG9zLnkgKyB0aWxlU2l6ZSAvIDIpIC8gdGlsZVNpemUpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgY29sbGlzaW9uIChzYW1lIGdyaWQgY2VsbClcbiAgICAgICAgICAgIGlmIChwbGF5ZXJHcmlkWCA9PT0gZHJvcEdyaWRYICYmIHBsYXllckdyaWRZID09PSBkcm9wR3JpZFkpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgY3VycmVudCBsaXZlcyB2YWx1ZSwgZGVmYXVsdCB0byAwIGlmIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRMaXZlcyA9IHBsYXllci5saXZlcyB8fCAwO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEluY3JlYXNlIHBsYXllcidzIGxpdmVzIGJ5ICsxIChkaXJlY3QgcHJvcGVydHkgYXNzaWdubWVudClcbiAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSBjdXJyZW50TGl2ZXMgKyAxO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZXh0cmEtbGlmZS1kcm9wIGZyb20gRE9NIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgaWYgKGRyb3AucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBkcm9wLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbRXh0cmEgTGlmZV0gUGxheWVyICR7cGxheWVyLmlkfSBwaWNrZWQgdXAgYW4gZXh0cmEgbGlmZSEgTmV3IGxpdmVzOiAke3BsYXllci5saXZlc31gKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBCcmVhayBvdXQgb2YgdGhlIGlubmVyIGxvb3Agc2luY2UgdGhpcyBkcm9wIGlzIG5vdyBnb25lXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogQ2hlY2tzIGZvciBwbGF5ZXIgZGVhdGhzIGFuZCBnYW1lIGVuZCBjb25kaXRpb25zLlxuICogU2hvd3MgTG9zcyBwb3AtdXAgZm9yIGVsaW1pbmF0ZWQgcGxheWVycyBhbmQgV2luIHBvcC11cCBmb3IgdGhlIGxhc3Qgc3Vydml2b3IuXG4gKiBcbiAqIEBwYXJhbSB7V29ybGR9IHdvcmxkIC0gVGhlIGdhbWUgd29ybGQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhbFBsYXllckVudGl0eSAtIFRoZSBsb2NhbCBwbGF5ZXIncyBlbnRpdHkgSURcbiAqIEBwYXJhbSB7TWFwfSBwbGF5ZXJFbnRpdGllcyAtIE1hcCBvZiBwbGF5ZXIgSURzIHRvIGVudGl0eSBJRHNcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbFBsYXllcnMgLSBUb3RhbCBudW1iZXIgb2YgcGxheWVycyBhdCBnYW1lIHN0YXJ0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0dhbWVFbmRDb25kaXRpb25zKHdvcmxkLCBsb2NhbFBsYXllckVudGl0eSwgcGxheWVyRW50aXRpZXMsIHRvdGFsUGxheWVycykge1xuICAgIC8vIENvdW50IGFjdGl2ZSBwbGF5ZXJzIChwbGF5ZXJzIHdpdGggbGl2ZXMgPiAwKVxuICAgIGNvbnN0IGFsbFBsYXllcnMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnUGxheWVyJyk7XG4gICAgbGV0IGFjdGl2ZVBsYXllckNvdW50ID0gMDtcbiAgICBsZXQgbGFzdEFjdGl2ZVBsYXllckVudGl0eSA9IG51bGw7XG4gICAgXG4gICAgZm9yIChjb25zdCBwbGF5ZXJFbnRpdHkgb2YgYWxsUGxheWVycykge1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIGlmIChwbGF5ZXIgJiYgKHBsYXllci5saXZlcyA/PyAwKSA+IDApIHtcbiAgICAgICAgICAgIGFjdGl2ZVBsYXllckNvdW50Kys7XG4gICAgICAgICAgICBsYXN0QWN0aXZlUGxheWVyRW50aXR5ID0gcGxheWVyRW50aXR5O1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIEdldCB0aGUgbG9jYWwgcGxheWVyJ3MgbmFtZSBmb3IgZGlzcGxheSBpbiBwb3B1cHNcbiAgICBjb25zdCBsb2NhbFBsYXllck5hbWUgPSBnZXRQbGF5ZXJOYW1lKCk7XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgbG9jYWwgcGxheWVyIGlzIGVsaW1pbmF0ZWRcbiAgICBpZiAobG9jYWxQbGF5ZXJFbnRpdHkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgbG9jYWxQbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQobG9jYWxQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKGxvY2FsUGxheWVyICYmIChsb2NhbFBsYXllci5saXZlcyA/PyAwKSA8PSAwKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBhbHJlYWR5IHNob3dlZCBsb3NzIHBvcHVwXG4gICAgICAgICAgICBpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLXJlc3VsdC1wb3B1cCcpKSB7XG4gICAgICAgICAgICAgICAgc2hvd0xvc3NQb3B1cChsb2NhbFBsYXllck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIENoZWNrIHdpbiBjb25kaXRpb246IEVYQUNUTFkgMSBhY3RpdmUgcGxheWVyIHJlbWFpbnMgb24gdGhlIGJvYXJkXG4gICAgaWYgKGFjdGl2ZVBsYXllckNvdW50ID09PSAxICYmIHRvdGFsUGxheWVycyA+IDEgJiYgbGFzdEFjdGl2ZVBsYXllckVudGl0eSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBsYXN0UGxheWVyID0gd29ybGQuZ2V0Q29tcG9uZW50KGxhc3RBY3RpdmVQbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKGxhc3RQbGF5ZXIpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgdGhlIGxvY2FsIHBsYXllclxuICAgICAgICAgICAgaWYgKGxvY2FsUGxheWVyRW50aXR5ICE9PSBudWxsICYmIGxhc3RBY3RpdmVQbGF5ZXJFbnRpdHkgPT09IGxvY2FsUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1yZXN1bHQtcG9wdXAnKSkge1xuICAgICAgICAgICAgICAgICAgICBzaG93V2luUG9wdXAobG9jYWxQbGF5ZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYW1hZ2VTeXN0ZW0od29ybGQsIG5vdywgb25QbGF5ZXJIdXJ0LCB0aWxlU2l6ZSA9IDY0KSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQbGF5ZXInKTtcbiAgICBjb25zdCBleHBsb3Npb25zID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ0V4cGxvc2lvbicpO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxheWVyRW50aXR5IG9mIHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgcFBvcyA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUGxheWVyJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAocGxheWVyLmludmluY2libGVVbnRpbCAmJiBwbGF5ZXIuaW52aW5jaWJsZVVudGlsID4gbm93KSBjb250aW51ZTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgZXhwRW50aXR5IG9mIGV4cGxvc2lvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQoZXhwRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8oR3JpZC1iYXNlZCBjb2xsaXNpb24pXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWCA9IE1hdGguZmxvb3IoKHBQb3MueCArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkWSA9IE1hdGguZmxvb3IoKHBQb3MueSArIHRpbGVTaXplIC8gMikgLyB0aWxlU2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChwbGF5ZXJHcmlkWCA9PT0gZVBvcy5ncmlkWCAmJiBwbGF5ZXJHcmlkWSA9PT0gZVBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzTGl2ZXMgPSBwbGF5ZXIubGl2ZXMgPz8gMztcbiAgICAgICAgICAgICAgICBwbGF5ZXIubGl2ZXMgPSBNYXRoLm1heChwcmV2aW91c0xpdmVzIC0gMSwgMCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLmludmluY2libGVVbnRpbCA9IG5vdyArIDE1MDA7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIGRlYXRoIHdoZW4gbGl2ZXMgcmVhY2ggMFxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIubGl2ZXMgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVQbGF5ZXJEZWF0aCh3b3JsZCwgcGxheWVyRW50aXR5LCB0aWxlU2l6ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChvblBsYXllckh1cnQpIHtcbiAgICAgICAgICAgICAgICAgICAgb25QbGF5ZXJIdXJ0KHBsYXllckVudGl0eSwgcGxheWVyLmlkLCBwbGF5ZXIubGl2ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBtb3ZlbWVudFN5c3RlbSh3b3JsZCwgZHQsIG5vdywgbWFwRGF0YSwgdGlsZVNpemUgPSA0MCkge1xuICAgIGNvbnN0IGVudGl0aWVzID0gd29ybGQucXVlcnkoJ1Bvc2l0aW9uJywgJ1ZlbG9jaXR5Jyk7XG4gICAgY29uc3QgZGVsdGEgPSBkdCAvIDE2LjY3O1xuXG4gICAgY29uc3QgUExBWUVSX1NJWkUgPSB0aWxlU2l6ZTtcblxuICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdQb3NpdGlvbicpO1xuICAgICAgICBjb25zdCB2ZWwgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnVmVsb2NpdHknKTtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnSW5wdXQnKTtcbiAgICAgICAgY29uc3QgYmVoYXZpb3IgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnQmVoYXZpb3InKTtcblxuICAgICAgICBpZiAoYmVoYXZpb3IpIHtcbiAgICAgICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQgKyAoYmVoYXZpb3IuZmFzdFNob2VzTGV2ZWwgLSAxKSAqIDAuNTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZlbC5zcGVlZCA9IHZlbC5iYXNlU3BlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICBtb3ZlVG93YXJkVGFyZ2V0KHBvcywgdmVsLCBkZWx0YSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUlucHV0ID0gaW5wdXQuaW5wdXRRdWV1ZVswXTtcbiAgICAgICAgbGV0IGR4ID0gMDtcbiAgICAgICAgbGV0IGR5ID0gMDtcblxuICAgICAgICBpZiAoYWN0aXZlSW5wdXQgPT09ICd1cCcpIHtcbiAgICAgICAgICAgIGR5ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3VwJztcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbnB1dCA9PT0gJ2Rvd24nKSB7XG4gICAgICAgICAgICBkeSA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2Rvd24nO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIGR4ID0gLTE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZUlucHV0ID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICBkeCA9IDE7XG4gICAgICAgICAgICB2ZWwuZGlyZWN0aW9uID0gJ3JpZ2h0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhc0lucHV0ID0gZHggIT09IDAgfHwgZHkgIT09IDA7XG5cbiAgICAgICAgaWYgKCFoYXNJbnB1dCkge1xuICAgICAgICAgICAgcG9zLnRhcmdldFggPSBwb3MueDtcbiAgICAgICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG4gICAgICAgICAgICB2ZWwuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmFibGUgPSB3b3JsZC5nZXRDb21wb25lbnQoZW50aXR5LCAnUmVuZGVyYWJsZScpO1xuICAgICAgICAgICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ0lETEUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChwb3MueCArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocG9zLnkgKyBQTEFZRVJfU0laRSAvIDIpIC8gdGlsZVNpemVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICh3b3JsZC5icm9hZGNhc3RNb3ZlbWVudCkge1xuICAgICAgICAgICAgICAgIHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KFxuICAgICAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIHBvcy54LFxuICAgICAgICAgICAgICAgICAgICBwb3MueSxcbiAgICAgICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgICAgICBwb3MuZ3JpZFksXG4gICAgICAgICAgICAgICAgICAgIHZlbC5kaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRYID0gcG9zLnggKyBkeCAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuICAgICAgICBjb25zdCBuZXh0WSA9IHBvcy55ICsgZHkgKiB2ZWwuc3BlZWQgKiBkZWx0YTtcblxuICAgICAgICBjb25zdCBzbmFwVGhyZXNob2xkID0gMzI7XG5cbiAgICAgICAgaWYgKGR5ICE9PSAwICYmIGR4ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKHBvcy54LCBuZXh0WSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWCA9IE1hdGguZmxvb3IoKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRYID0gY3VycmVudFRpbGVYICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlggPSBwb3MueCAtIHRhcmdldFg7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlgpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gLU1hdGguc2lnbihkaWZmWCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR4ICE9PSAwICYmIGR5ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoaXNCbG9ja2VkKG5leHRYLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaWxlWSA9IE1hdGguZmxvb3IoKHBvcy55ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRZID0gY3VycmVudFRpbGVZICogdGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZlkgPSBwb3MueSAtIHRhcmdldFk7XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlkpIDwgc25hcFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGR5ID0gLU1hdGguc2lnbihkaWZmWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dFhBZnRlclNuYXAgPSBwb3MueCArIGR4ICogdmVsLnNwZWVkICogZGVsdGE7XG4gICAgICAgIGNvbnN0IG5leHRZQWZ0ZXJTbmFwID0gcG9zLnkgKyBkeSAqIHZlbC5zcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGlmIChkeCAhPT0gMCAmJiAhaXNCbG9ja2VkKG5leHRYQWZ0ZXJTbmFwLCBwb3MueSwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnggPSBuZXh0WEFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeSAhPT0gMCAmJiAhaXNCbG9ja2VkKHBvcy54LCBuZXh0WUFmdGVyU25hcCwgbWFwRGF0YSwgdGlsZVNpemUsIFBMQVlFUl9TSVpFKSkge1xuICAgICAgICAgICAgcG9zLnkgPSBuZXh0WUFmdGVyU25hcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlbC5pc01vdmluZyA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyYWJsZSA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdSZW5kZXJhYmxlJyk7XG4gICAgICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnN0YXRlID0gJ1JVTic7XG4gICAgICAgIH1cblxuICAgICAgICBwb3MuZ3JpZFggPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKHBvcy54ICsgUExBWUVSX1NJWkUgLyAyKSAvIHRpbGVTaXplXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9zLmdyaWRZID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChwb3MueSArIFBMQVlFUl9TSVpFIC8gMikgLyB0aWxlU2l6ZVxuICAgICAgICApO1xuXG4gICAgICAgIHBvcy50YXJnZXRYID0gcG9zLng7XG4gICAgICAgIHBvcy50YXJnZXRZID0gcG9zLnk7XG5cbiAgICAgICAgaWYgKHdvcmxkLmJyb2FkY2FzdE1vdmVtZW50KSB7XG4gICAgICAgICAgICB3b3JsZC5icm9hZGNhc3RNb3ZlbWVudChcbiAgICAgICAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgICAgICAgcG9zLngsXG4gICAgICAgICAgICAgICAgcG9zLnksXG4gICAgICAgICAgICAgICAgcG9zLmdyaWRYLFxuICAgICAgICAgICAgICAgIHBvcy5ncmlkWSxcbiAgICAgICAgICAgICAgICB2ZWwuZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgIHZlbC5pc01vdmluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZVRvd2FyZFRhcmdldChwb3MsIHZlbCwgZGVsdGEpIHtcbiAgICBjb25zdCBzdGVwID0gdmVsLnNwZWVkICogZGVsdGE7XG5cbiAgICBpZiAocG9zLnggPCBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWluKHBvcy54ICsgc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH0gZWxzZSBpZiAocG9zLnggPiBwb3MudGFyZ2V0WCkge1xuICAgICAgICBwb3MueCA9IE1hdGgubWF4KHBvcy54IC0gc3RlcCwgcG9zLnRhcmdldFgpO1xuICAgIH1cblxuICAgIGlmIChwb3MueSA8IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5taW4ocG9zLnkgKyBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfSBlbHNlIGlmIChwb3MueSA+IHBvcy50YXJnZXRZKSB7XG4gICAgICAgIHBvcy55ID0gTWF0aC5tYXgocG9zLnkgLSBzdGVwLCBwb3MudGFyZ2V0WSk7XG4gICAgfVxuXG4gICAgdmVsLmlzTW92aW5nID1cbiAgICAgICAgcG9zLnggIT09IHBvcy50YXJnZXRYIHx8XG4gICAgICAgIHBvcy55ICE9PSBwb3MudGFyZ2V0WTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkKHgsIHksIG1hcERhdGEsIHRpbGVTaXplLCBwbGF5ZXJTaXplID0gdGlsZVNpemUpIHtcbiAgICBjb25zdCBwYWRkaW5nID0gNDtcblxuICAgIGNvbnN0IGxlZnQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBhZGRpbmcpIC8gdGlsZVNpemVcbiAgICApO1xuXG4gICAgY29uc3QgcmlnaHQgPSBNYXRoLmZsb29yKFxuICAgICAgICAoeCArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIGNvbnN0IHRvcCA9IE1hdGguZmxvb3IoXG4gICAgICAgICh5ICsgcGFkZGluZykgLyB0aWxlU2l6ZVxuICAgICk7XG5cbiAgICBjb25zdCBib3R0b20gPSBNYXRoLmZsb29yKFxuICAgICAgICAoeSArIHBsYXllclNpemUgLSBwYWRkaW5nKSAvIHRpbGVTaXplXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgdG9wLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCB0b3AsIG1hcERhdGEpIHx8XG4gICAgICAgIGlzQmxvY2tlZENlbGwobGVmdCwgYm90dG9tLCBtYXBEYXRhKSB8fFxuICAgICAgICBpc0Jsb2NrZWRDZWxsKHJpZ2h0LCBib3R0b20sIG1hcERhdGEpXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkQ2VsbCh4LCB5LCBtYXBEYXRhKSB7XG4gICAgY29uc3QgY2VsbCA9IG1hcERhdGFbeV0gJiYgbWFwRGF0YVt5XVt4XTtcblxuICAgIHJldHVybiBjZWxsICE9PSAwICYmIGNlbGwgIT09IDI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcG93ZXJVcFN5c3RlbSh3b3JsZCwgb25Qb3dlclVwUGlja2VkKSB7XG4gICAgY29uc3QgcGxheWVycyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdWZWxvY2l0eScsICdQbGF5ZXInKTtcbiAgICBjb25zdCBwb3dlclVwcyA9IHdvcmxkLnF1ZXJ5KCdQb3NpdGlvbicsICdQb3dlclVwJyk7XG5cbiAgICBmb3IgKGNvbnN0IHBsYXllckVudGl0eSBvZiBwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IHBQb3MgPSB3b3JsZC5nZXRDb21wb25lbnQocGxheWVyRW50aXR5LCAnUG9zaXRpb24nKTtcbiAgICAgICAgY29uc3QgdmVsID0gd29ybGQuZ2V0Q29tcG9uZW50KHBsYXllckVudGl0eSwgJ1ZlbG9jaXR5Jyk7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHdvcmxkLmdldENvbXBvbmVudChwbGF5ZXJFbnRpdHksICdQbGF5ZXInKTtcbiAgICAgICAgaWYgKCFwUG9zIHx8ICF2ZWwgfHwgIXBsYXllcikgY29udGludWU7XG5cbiAgICAgICAgZm9yIChjb25zdCBwVXBFbnRpdHkgb2YgcG93ZXJVcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwUG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KHBVcEVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBwVXAgPSB3b3JsZC5nZXRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcpO1xuICAgICAgICAgICAgaWYgKCF1cFBvcyB8fCAhcFVwIHx8IHBVcC5waWNrZWRVcCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChwUG9zLmdyaWRYID09PSB1cFBvcy5ncmlkWCAmJiBwUG9zLmdyaWRZID09PSB1cFBvcy5ncmlkWSkge1xuICAgICAgICAgICAgICAgIHBVcC5waWNrZWRVcCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAocFVwLnR5cGUgPT09ICdTUEVFRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmVsLnNwZWVkID0gTWF0aC5taW4odmVsLnNwZWVkICsgMSwgOCk7IFxuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocFVwLnR5cGUgPT09ICdCT01CUycpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLm1heEJvbWJzID0gcGxheWVyLm1heEJvbWJzID8gcGxheWVyLm1heEJvbWJzICsgMSA6IDI7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwVXAudHlwZSA9PT0gJ0ZMQU1FJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYm9tYlJhbmdlID0gcGxheWVyLmJvbWJSYW5nZSA/IHBsYXllci5ib21iUmFuZ2UgKyAxIDogNTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocFVwLmVsICYmIHBVcC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBVcC5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBVcC5lbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9uUG93ZXJVcFBpY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICBvblBvd2VyVXBQaWNrZWQocGxheWVyLmlkLCBwVXAudHlwZSwgdXBQb3MuZ3JpZFgsIHVwUG9zLmdyaWRZKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3b3JsZC5kZXN0cm95RW50aXR5KHBVcEVudGl0eSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7IFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Bhd25Qb3dlclVwKHdvcmxkLCBneCwgZ3ksIGNvbnRhaW5lciwgdGlsZVNpemUgPSA2NCkge1xuICAgIGNvbnN0IHNlZWQgPSBneCAqIDczODU2MDkzIF4gZ3kgKiAxOTM0OTY2MztcbiAgICBjb25zdCBzZWVkUmFuZG9tID0gKE1hdGguc2luKHNlZWQpICogMTAwMDApIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkKSAqIDEwMDAwKTtcbiAgICBcbiAgICBpZiAoc2VlZFJhbmRvbSA+IDAuMzUpIHJldHVybjtcblxuICAgIGNvbnN0IHR5cGVzID0gWydTUEVFRCcsICdCT01CUycsICdGTEFNRSddO1xuICAgIGNvbnN0IHR5cGVJbmRleCA9IE1hdGguZmxvb3IoKE1hdGguc2luKHNlZWQgKiAyKSAqIDEwMDAwIC0gTWF0aC5mbG9vcihNYXRoLnNpbihzZWVkICogMikgKiAxMDAwMCkpICogdHlwZXMubGVuZ3RoKTtcbiAgICBjb25zdCByYW5kb21UeXBlID0gdHlwZXNbdHlwZUluZGV4XTtcblxuICAgIGNvbnN0IHBVcEVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpO1xuICAgIHdvcmxkLmFkZENvbXBvbmVudChwVXBFbnRpdHksICdQb3NpdGlvbicsIHsgZ3JpZFg6IGd4LCBncmlkWTogZ3ksIHg6IGd4ICogdGlsZVNpemUsIHk6IGd5ICogdGlsZVNpemUgfSk7XG4gICAgXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9IGBwb3dlcnVwIHBvd2VydXAtJHtyYW5kb21UeXBlLnRvTG93ZXJDYXNlKCl9YDtcbiAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9IGAke3RpbGVTaXplfXB4YDtcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gYCR7dGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS5sZWZ0ID0gYCR7Z3ggKiB0aWxlU2l6ZX1weGA7XG4gICAgZGl2LnN0eWxlLnRvcCA9IGAke2d5ICogdGlsZVNpemV9cHhgO1xuICAgIGRpdi5zdHlsZS56SW5kZXggPSAnNSc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB3b3JsZC5hZGRDb21wb25lbnQocFVwRW50aXR5LCAnUG93ZXJVcCcsIHsgdHlwZTogcmFuZG9tVHlwZSwgZWw6IGRpdiB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByZW5kZXJTeXN0ZW0od29ybGQsIGR0LCBub3csIGFuaW1Sb3dzKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB3b3JsZC5xdWVyeSgnUG9zaXRpb24nLCAnVmVsb2NpdHknLCAnUmVuZGVyYWJsZScpO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IHZlbCA9IHdvcmxkLmdldENvbXBvbmVudChlbnRpdHksICdWZWxvY2l0eScpO1xuICAgICAgICBjb25zdCByZW5kZXJhYmxlID0gd29ybGQuZ2V0Q29tcG9uZW50KGVudGl0eSwgJ1JlbmRlcmFibGUnKTtcblxuICAgICAgICBpZiAoIXJlbmRlcmFibGUuZWwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gcmVuZGVyYWJsZS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Um93ID0gYW5pbVJvd3Nbc3RhdGVdW3ZlbC5kaXJlY3Rpb25dO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYW5pbWF0aW9uIHdoZW4gcm93IG9yIHN0YXRlIGNoYW5nZXNcbiAgICAgICAgaWYgKHJlbmRlcmFibGUucm93ICE9PSB0YXJnZXRSb3cgfHwgcmVuZGVyYWJsZS5sYXN0U3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLnJvdyA9IHRhcmdldFJvdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdFN0YXRlID0gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcmFtZUNvdW50ID0gc3RhdGUgPT09ICdSVU4nID8gcmVuZGVyYWJsZS5ydW5GcmFtZXMgOiByZW5kZXJhYmxlLmlkbGVGcmFtZXM7XG4gICAgICAgIGNvbnN0IGZyYW1lRGVsYXkgPSBzdGF0ZSA9PT0gJ1JVTicgPyAxMDAwIC8gcmVuZGVyYWJsZS5mcHMgOiAxMDAwIC8gcmVuZGVyYWJsZS5pZGxlRnBzO1xuXG4gICAgICAgIGlmIChub3cgLSByZW5kZXJhYmxlLmxhc3RGcmFtZVRpbWUgPiBmcmFtZURlbGF5KSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSA9IChyZW5kZXJhYmxlLmN1cnJlbnRGcmFtZSArIDEpICUgZnJhbWVDb3VudDtcbiAgICAgICAgICAgIHJlbmRlcmFibGUubGFzdEZyYW1lVGltZSA9IG5vdztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvc1ggPSAtKHJlbmRlcmFibGUuY3VycmVudEZyYW1lICogcmVuZGVyYWJsZS5mcmFtZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcG9zWSA9IC0ocmVuZGVyYWJsZS5yb3cgKiByZW5kZXJhYmxlLmZyYW1lSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmFibGUuZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYCR7cG9zWH1weCAke3Bvc1l9cHhgO1xuICAgICAgICByZW5kZXJhYmxlLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3Bvcy54fXB4LCAke3Bvcy55fXB4LCAwKWA7XG4gICAgfVxufVxuIiwiLy8gL3NyYy9lY3Mvd29ybGQuanNcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uZXh0RW50aXR5SWQgPSAwO1xuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgTWFwKCk7IFxuICAgICAgICB0aGlzLnN5c3RlbXMgPSBbXTtcbiAgICB9XG5cbiAgICBjcmVhdGVFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMubmV4dEVudGl0eUlkKys7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkKGVudGl0eSk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVudGl0eShlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5kZWxldGUoZW50aXR5KTtcbiAgICAgICAgZm9yIChjb25zdCBbY29tcG9uZW50TmFtZSwgY29tcG9uZW50TWFwXSBvZiB0aGlzLmNvbXBvbmVudHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lLCBjb21wb25lbnREYXRhID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudHMuaGFzKGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIG5ldyBNYXAoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lKS5zZXQoZW50aXR5LCBjb21wb25lbnREYXRhKTtcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRNYXAgPyBjb21wb25lbnRNYXAuZ2V0KGVudGl0eSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRNYXAgPSB0aGlzLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBpZiAoY29tcG9uZW50TWFwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRNYXAuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBxdWVyeSguLi5jb21wb25lbnROYW1lcykge1xuICAgICAgICBpZiAoY29tcG9uZW50TmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaXJzdE1hcCA9IHRoaXMuY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZXNbMF0pO1xuICAgICAgICBpZiAoIWZpcnN0TWFwKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIGZpcnN0TWFwLmtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGhhc0FsbCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNvbXBvbmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gdGhpcy5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXAgfHwgIW1hcC5oYXMoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0FsbCAmJiB0aGlzLmVudGl0aWVzLmhhcyhlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkU3lzdGVtKHN5c3RlbUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbUZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZHQsIG5vdykge1xuICAgICAgICBmb3IgKGNvbnN0IHN5c3RlbSBvZiB0aGlzLnN5c3RlbXMpIHtcbiAgICAgICAgICAgIHN5c3RlbSh0aGlzLCBkdCwgbm93KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA2NDtcbmNvbnN0IEdSSURfQk9SREVSX1NJWkUgPSA2O1xuY29uc3QgR0FNRV9DSFJPTUVfV0lEVEggPSA3MjtcbmNvbnN0IEdBTUVfQ0hST01FX0hFSUdIVCA9IDE1MDtcblxuY29uc3QgaW1hZ2VzID0ge1xuICAgIDI6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiLFxuICAgIDM6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX3dhbGwucG5nXCIsXG4gICAgNDogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZXhwbG9pdC5wbmdcIixcbn07XG5cbmNvbnN0IFtwbGF5ZXJOYW1lLCBzZXRQbGF5ZXJOYW1lXSA9IGNyZWF0ZVNpZ25hbChcIlBsYXllciAxXCIpO1xuY29uc3QgW2xpdmVzLCBzZXRMaXZlc10gPSBjcmVhdGVTaWduYWwoMyk7XG5jb25zdCBbc3BlZWQsIHNldFNwZWVkXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtib21icywgc2V0Qm9tYnNdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW3JhbmdlLCBzZXRSYW5nZV0gPSBjcmVhdGVTaWduYWwoMSk7XG5leHBvcnQgeyBzZXRQbGF5ZXJOYW1lLCBzZXRMaXZlcywgc2V0U3BlZWQsIHNldEJvbWJzLCBzZXRSYW5nZSB9O1xuXG5jb25zdCBuYW1lRWwgPSA8c3BhbiBjbGFzcz1cInBsYXllci1uYW1lXCI+PC9zcGFuPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHsgbmFtZUVsLnRleHRDb250ZW50ID0gcGxheWVyTmFtZSgpOyB9KTtcblxuY29uc3QgbGl2ZXNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgbGl2ZXMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3Qgc3BlZWRFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgc3BlZWQtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgYm9tYnNFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgYm9tYnMtdmFsdWVcIj48L3NwYW4+O1xuY29uc3QgcmFuZ2VFbCA9IDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWUgcmFuZ2UtdmFsdWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBsaXZlc0VsLnRleHRDb250ZW50ID0gbGl2ZXMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBzcGVlZEVsLnRleHRDb250ZW50ID0gc3BlZWQoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyBib21ic0VsLnRleHRDb250ZW50ID0gYm9tYnMoKTsgfSk7XG5jcmVhdGVFZmZlY3QoKCkgPT4geyByYW5nZUVsLnRleHRDb250ZW50ID0gcmFuZ2UoKTsgfSk7XG5cbmZ1bmN0aW9uIEdhbWUoeyBncmlkIH0pIHtcbiAgICBjb25zdCBib2FyZFdpZHRoID0gZ3JpZFswXS5sZW5ndGggKiBUSUxFX1NJWkU7XG4gICAgY29uc3QgYm9hcmRIZWlnaHQgPSBncmlkLmxlbmd0aCAqIFRJTEVfU0laRTtcbiAgICBjb25zdCBib2FyZE91dGVyV2lkdGggPSBib2FyZFdpZHRoICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3QgYm9hcmRPdXRlckhlaWdodCA9IGJvYXJkSGVpZ2h0ICsgR1JJRF9CT1JERVJfU0laRSAqIDI7XG4gICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBib2FyZFdpZHRoIDogd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gYm9hcmRIZWlnaHQgOiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY29uc3Qgc2NhbGUgPSBNYXRoLm1pbihcbiAgICAgICAgMSxcbiAgICAgICAgTWF0aC5tYXgoMC4yLCAodmlld3BvcnRXaWR0aCAtIEdBTUVfQ0hST01FX1dJRFRIKSAvIGJvYXJkT3V0ZXJXaWR0aCksXG4gICAgICAgIE1hdGgubWF4KDAuMiwgKHZpZXdwb3J0SGVpZ2h0IC0gR0FNRV9DSFJPTUVfSEVJR0hUKSAvIGJvYXJkT3V0ZXJIZWlnaHQpXG4gICAgKTtcbiAgICBjb25zdCByb3dzID0gW107XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IGdyaWQubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCBncmlkW3Jvd0luZGV4XS5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBncmlkW3Jvd0luZGV4XVtjb2xJbmRleF07XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gXCJ0aWxlXCI7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBgd2lkdGg6JHtUSUxFX1NJWkV9cHg7aGVpZ2h0OiR7VElMRV9TSVpFfXB4O2A7XG5cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAyIHx8IGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS1mbG9vclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gXCIgdGlsZS13YWxsXCI7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzNdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbNF19KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMCB8fCBjZWxsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzJdfSlgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxscy5wdXNoKDxkaXYgY2xhc3M9e2NsYXNzTmFtZX0gZGF0YS14PXtjb2xJbmRleH0gZGF0YS15PXtyb3dJbmRleH0gc3R5bGU9e3N0eWxlfT48L2Rpdj4pO1xuICAgICAgICB9XG4gICAgICAgIHJvd3MucHVzaCg8ZGl2IGNsYXNzPVwiZ3JpZC1yb3dcIj57Y2VsbHN9PC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWdsYXNzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWJhclwiPlxuICAgICAgICAgICAgICAgICAgICB7bmFtZUVsfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+TGl2ZXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpdmVzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+U3BlZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwZWVkRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+Qm9tYnM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvbWJzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+UmFuZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JhbmdlRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtYm9hcmQtZnJhbWVcIiBzdHlsZT17YHdpZHRoOiR7Ym9hcmRPdXRlcldpZHRoICogc2NhbGV9cHg7aGVpZ2h0OiR7Ym9hcmRPdXRlckhlaWdodCAqIHNjYWxlfXB4O2B9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBpZD1cImdhbWUtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZ2FtZS1ncmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtgcG9zaXRpb246cmVsYXRpdmU7d2lkdGg6JHtib2FyZFdpZHRofXB4O2hlaWdodDoke2JvYXJkSGVpZ2h0fXB4O3RyYW5zZm9ybTpzY2FsZSgke3NjYWxlfSk7YH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IENoYXRQbGF5ZXJzIGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxubGV0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSBjcmVhdGVTaWduYWwoe30pO1xuZXhwb3J0IHsgc2V0U3RhdGVzIH07XG5cbmxldCByb29tSWRFbCA9IDxwPlJvb20gSUQ6IDwvcD47XG5sZXQgcGxheWVyc0VsID0gPHA+UGxheWVyczogIC8gNDwvcD47XG5sZXQgdGV4dEVsID0gPHA+PC9wPjtcbmxldCB0aW1lckVsID0gPHA+VGltZXI6IDwvcD47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcyA9IHN0YXRlcygpO1xuICAgIHJvb21JZEVsLnRleHRDb250ZW50ID0gYFJvb20gSUQ6ICR7cy5yb29tSWR9YDtcbiAgICBwbGF5ZXJzRWwudGV4dENvbnRlbnQgPSBgUGxheWVyczogJHtzLnBsYXllcnNDb3VudH0gLyA0YDtcbiAgICB0ZXh0RWwudGV4dENvbnRlbnQgPSBzLnRleHQgfHwgXCJcIjtcblxuICAgIGlmIChzLmdhbWVTdGFydGVkKSB7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBcIlRpbWVyOiBHYW1lIHN0YXJ0ZWRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0aW1lclRleHQgPSAoIXMuc2Vjb25kc0xlZnQpID8gXCJXYWl0aW5nIGZvciBvbmUgbW9yZSBwbGF5ZXJcIiA6IGAke3Muc2Vjb25kc0xlZnR9IHNlY29uZHNgO1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gYFRpbWVyOiAke3RpbWVyVGV4dH1gO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBMb2JieSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29uYXRpbmVyLWxvYmJ5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9iYnktYm94XCI+XG4gICAgICAgICAgICAgICAgPGgxPkxvYmJ5PC9oMT5cbiAgICAgICAgICAgICAgICB7cm9vbUlkRWx9XG4gICAgICAgICAgICAgICAge3BsYXllcnNFbH1cbiAgICAgICAgICAgICAgICB7dGV4dEVsfVxuICAgICAgICAgICAgICAgIHt0aW1lckVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q2hhdFBsYXllcnMgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2JieTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5jb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbnJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbmxldCBtZW51RWwgPSAoXG4gICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgIDxoMT5Zb3UgV2luITwvaDE+XG4gICAgICAgIDxwPkFsbCBvdGhlciBwbGF5ZXJzIGhhdmUgbGVmdCB0aGUgZ2FtZS48L3A+XG4gICAgICAgIHtyZXBsYXlCdG59XG4gICAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZW51KCkge1xuICAgIHJldHVybiBtZW51RWw7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgc2V0UGxheWVyTmFtZSB9IGZyb20gXCIuLi9lY3MvZ2FtZS5qc1wiO1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHN1Ym1pdHRlZCA9IGZhbHNlO1xuXG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoc3VibWl0dGVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgbmlja25hbWUgPSBmb3JtRGF0YS5nZXQoXCJuaWNrbmFtZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFuaWNrbmFtZSB8fCBuaWNrbmFtZS5sZW5ndGggPiAyMCkgcmV0dXJuO1xuXG4gICAgICAgIHN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHNldFBsYXllck5hbWUobmlja25hbWUpO1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwibmlja25hbWVfb2ZfdGhlX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmlja25hbWUtaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW50ZXIgeW91ciBuYW1lXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmVnaXN0ZXItYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPnN0YXJ0IHBsYXlpbmc8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XG4iLCJjbGFzcyBTb3VuZCB7XG4gICAgY29uc3RydWN0b3Ioc3JjKSB7XG4gICAgICAgIHRoaXMubXVzaWMgPSBuZXcgQXVkaW8oc3JjKTtcbiAgICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcblxuICAgICAgICB0aGlzLm11c2ljLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNDtcblxuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc05hbWUgPSBcInNvdW5kLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5hcHBlbmQodGhpcy5pY29uKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGUoKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5idXR0b24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wbGF5KCksIHsgb25jZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLm11c2ljLnBsYXkoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11c2ljLnBhdXNlZCB8fCB0aGlzLm11c2ljLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb25cIik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQnV0dG9uKCkge1xuICAgICAgICBjb25zdCBpc011dGVkID0gdGhpcy5tdXNpYy5tdXRlZCB8fCB0aGlzLm11c2ljLnBhdXNlZDtcblxuICAgICAgICB0aGlzLmljb24uY2xhc3NOYW1lID0gaXNNdXRlZCA/IFwiZmEtc29saWQgZmEtdm9sdW1lLW9mZlwiIDogXCJmYS1zb2xpZCBmYS12b2x1bWUtaGlnaFwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtbXV0ZWRcIiwgaXNNdXRlZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VuZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAvYXBwLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwicHJvcHMiLCJjaGlsZHJlbiIsImVsZSIsImRvY3VtZW50Iiwia2V5Iiwic3RhcnRzV2l0aCIsImV2ZW50TmFtZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwiZmxhdENoaWxkcmVuIiwiZmxhdCIsIkluZmluaXR5IiwiYXBwZW5kIiwiZmlsdGVyIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJyZW5kZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwicmVwbGFjZUNoaWxkcmVuIiwiUm91dGVyIiwicm91dGVyIiwiZWZmZWN0U3RhY2siLCJhY3RpdmVFZmZlY3QiLCJjcmVhdGVTaWduYWwiLCJpbml0aWFsVmFsdWUiLCJ2YWx1ZSIsImVmZmVjdHMiLCJTZXQiLCJSZWFkIiwiYWRkIiwiV3JpdGUiLCJuZXdWYWx1ZSIsImZuIiwiZm9yRWFjaCIsImVmZmVjdCIsImNyZWF0ZUVmZmVjdCIsInB1c2giLCJwb3AiLCJsZW5ndGgiLCJSb3V0ZXMiLCJPYmplY3QiLCJjcmVhdGUiLCJGaXJzdFJlc29sdmUiLCJvbiIsInBhdGgiLCJoYW5kbGVyIiwibmF2aWdhdGUiLCJoaXN0b3J5IiwibmF2aWdhdGlvbiIsInJlc29sdmUiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwidXJsIiwiVVJMIiwiaHJlZiIsImxpc3RlbiIsIm9uRXJyb3I0MDQiLCJldmVudCIsImRlc3RpbmF0aW9uIiwiaW50ZXJjZXB0IiwiY29uc29sZSIsImxvZyIsIlJlZ2lzdGVyIiwiR2FtZSIsIk1lbnUiLCJMb2JieSIsInNldFN0YXRlcyIsInNldFBsYXllck5hbWUiLCJzZXRIdWRQbGF5ZXJOYW1lIiwiU291bmQiLCJzZXRNZXNzYWdlcyIsIkdhbWVFbmdpbmUiLCJyb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3c3MiLCJXZWJTb2NrZXQiLCJ3aW5kb3ciLCJob3N0bmFtZSIsInNvdW5kIiwiY3VycmVudEdhbWVFbmdpbmUiLCJpbml0IiwiYm9keSIsImNsYXNzTmFtZSIsImFsZXJ0Iiwid3MiLCJtZXNzYWdlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsInF1ZXJ5U2VsZWN0b3IiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJzZWNvbmRzTGVmdCIsInRleHQiLCJncmlkIiwic2V0VGltZW91dCIsImdhbWVDb250YWluZXIiLCJkZXN0cm95IiwibG9jYWxQbGF5ZXIiLCJwbGF5ZXJzIiwiZmluZCIsInBsYXllciIsImlkIiwieW91clBsYXllcklkIiwibmlja25hbWUiLCJlbmdpbmUiLCJlcnJvciIsInByZXYiLCJoYW5kbGVSZW1vdGVNb3ZlIiwicGF5bG9hZCIsImhhbmRsZVJlbW90ZUJvbWIiLCJoYW5kbGVSZW1vdGVQb3dlclVwUGlja2VkIiwiZXJyIiwibWVzc2FnZXMiLCJDaGF0UGxheWVycyIsIm1lc3NhZ2VzQ29udGFpbmVyIiwiY2xhc3MiLCJtc2dzIiwiaW5uZXJIVE1MIiwibXNnIiwicCIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCIsImZpcnN0RWxlbWVudENoaWxkIiwidW5zaGlmdCIsImJyb2FkY2FzdE1lc3NhZ2UiLCJlIiwicHJldmVudERlZmF1bHQiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwidGFyZ2V0IiwiZ2V0IiwidHJpbSIsInJlc2V0Iiwic2VuZCIsInN0cmluZ2lmeSIsIm9uU3VibWl0IiwibmFtZSIsInBsYWNlaG9sZGVyIiwibWF4bGVuZ3RoIiwiUG9zaXRpb25Db21wb25lbnQiLCJneCIsImd5IiwidGlsZVNpemUiLCJncmlkWCIsImdyaWRZIiwieCIsInkiLCJ0YXJnZXRYIiwidGFyZ2V0WSIsIlZlbG9jaXR5Q29tcG9uZW50IiwiYmFzZVNwZWVkIiwic3BlZWQiLCJpc01vdmluZyIsImRpcmVjdGlvbiIsIklucHV0Q29tcG9uZW50IiwiaW5wdXRRdWV1ZSIsIlJlbmRlcmFibGVDb21wb25lbnQiLCJlbCIsImZyYW1lV2lkdGgiLCJmcmFtZUhlaWdodCIsInRvdGFsRnJhbWVzIiwiZnBzIiwiY3VycmVudEZyYW1lIiwicnVuRnJhbWVzIiwiaWRsZUZyYW1lcyIsImlkbGVGcHMiLCJsYXN0RnJhbWVUaW1lIiwicm93Iiwic3RhdGUiLCJsYXN0U3RhdGUiLCJQbGF5ZXJDb21wb25lbnQiLCJjaGFyVHlwZSIsImlzTG9jYWwiLCJCb21iQ29tcG9uZW50Iiwib3duZXJJZCIsInRpbWVyIiwicmFuZ2UiLCJleHBsb2RlZCIsIkV4cGxvc2lvbkNvbXBvbmVudCIsImR1cmF0aW9uIiwiUG93ZXJVcENvbXBvbmVudCIsInBpY2tlZFVwIiwiQmVoYXZpb3JDb21wb25lbnQiLCJnaG9zdE1vZGUiLCJ0aHJvd2FibGUiLCJkZXRvbmF0b3IiLCJmYXN0U2hvZXNMZXZlbCIsImJvbWJzIiwibWF4IiwiY3VycmVudCIsIldvcmxkIiwibW92ZW1lbnRTeXN0ZW0iLCJyZW5kZXJTeXN0ZW0iLCJib21iU3lzdGVtIiwiZGFtYWdlU3lzdGVtIiwiY2hlY2tFeHRyYUxpZmVDb2xsaXNpb24iLCJjaGVja0dhbWVFbmRDb25kaXRpb25zIiwicG93ZXJVcFN5c3RlbSIsInNwYXduUG93ZXJVcCIsInNldEJvbWJzIiwic2V0TGl2ZXMiLCJzZXRSYW5nZSIsInNldFNwZWVkIiwiVElMRV9TSVpFIiwiQU5JTUFUSU9OX1JPV1MiLCJSVU4iLCJ1cCIsImxlZnQiLCJkb3duIiwicmlnaHQiLCJJRExFIiwiY29uc3RydWN0b3IiLCJjYW52YXNDb250YWluZXIiLCJtYXBEYXRhIiwic29ja2V0Iiwid29ybGQiLCJsb2NhbFBsYXllckVudGl0eSIsInBsYXllckVudGl0aWVzIiwiTWFwIiwibGFzdFRpbWUiLCJyZW1vdmVJbnB1dExpc3RlbmVycyIsImFuaW1hdGlvbkZyYW1lIiwicnVubmluZyIsImNsYWltZWRQb3dlclVwcyIsImxvY2FsUGxheWVySWQiLCJhbGxQbGF5ZXJzIiwidG90YWxQbGF5ZXJzIiwibm9ybWFsaXplZExvY2FsUGxheWVySWQiLCJTdHJpbmciLCJwRGF0YSIsInBsYXllcklkIiwicGxheWVyRW50aXR5IiwiY3JlYXRlRW50aXR5IiwicGxheWVyRGl2IiwiY29sb3IiLCJzdHlsZSIsInBvc2l0aW9uIiwiekluZGV4Iiwid2lsbENoYW5nZSIsInN4Iiwic3kiLCJhZGRDb21wb25lbnQiLCJwbGF5ZXJDb21wIiwibGl2ZXMiLCJtYXhCb21icyIsImJvbWJSYW5nZSIsInNldCIsInVwZGF0ZUh1ZFN0YXRzIiwic2V0dXBJbnB1dCIsIndhcm4iLCJtYXAiLCJyZWdpc3RlclN5c3RlbXMiLCJwZXJmb3JtYW5jZSIsIm5vdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImdhbWVMb29wIiwiaW5wdXQiLCJnZXRDb21wb25lbnQiLCJnZXRLZXlEaXJlY3Rpb24iLCJoYW5kbGVLZXlEb3duIiwiZGlyIiwiaW5jbHVkZXMiLCJjb2RlIiwiZHJvcEJvbWIiLCJoYW5kbGVLZXlVcCIsImQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicG9zIiwiY3VycmVudEJvbWJzIiwicXVlcnkiLCJiRW50aXR5IiwiY3JlYXRlZCIsImNyZWF0ZUJvbWIiLCJyZWFkeVN0YXRlIiwiT1BFTiIsImV4aXN0cyIsInNvbWUiLCJlbnRpdHkiLCJib21iIiwiYm9tYkVudGl0eSIsImJvbWJEaXYiLCJ0b3AiLCJib21iQ29tcCIsIkFycmF5IiwiZnJvbSIsImtleXMiLCJ2ZWwiLCJyZW5kZXJhYmxlIiwicmVtb3ZlUG93ZXJVcEF0IiwiYXBwbHlQb3dlclVwIiwicG93ZXJVcHMiLCJwb3dlclVwIiwicGFyZW50Tm9kZSIsImRlc3Ryb3lFbnRpdHkiLCJ2ZWxvY2l0eSIsIk1hdGgiLCJtaW4iLCJ1cGRhdGVNYXBDZWxsIiwidGlsZSIsImJhY2tncm91bmRJbWFnZSIsImRlc3Ryb3lCb3hDYWxsYmFjayIsImhhcyIsIm9uUGxheWVySHVydCIsInJlbWFpbmluZ0xpdmVzIiwib25Qb3dlclVwUGlja2VkIiwiYnJvYWRjYXN0TW92ZW1lbnQiLCJhZGRTeXN0ZW0iLCJ3IiwiZHQiLCJ1cGRhdGUiLCJuZXh0Tm93IiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJyb3VuZCIsImN1cnJlbnRMb2NhbFBsYXllck5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZ2V0UGxheWVyTmFtZSIsImdldEl0ZW0iLCJhZmZlY3RlZENlbGxzIiwiY2FsY3VsYXRlRXhwbG9zaW9uQ2VsbHMiLCJjZWxsIiwiZXhwRW50aXR5IiwiZXhwRGl2Iiwid2lkdGgiLCJoZWlnaHQiLCJleHBsb3Npb25zIiwiZXhwIiwiYngiLCJieSIsImNlbGxzIiwiZGlyZWN0aW9ucyIsInN0ZXBzIiwiaSIsInR4IiwidHkiLCJjZWxsVHlwZSIsInNob3dMb3NzUG9wdXAiLCJwbGF5ZXJOYW1lIiwib3ZlcmxheSIsImJhY2tncm91bmRDb2xvciIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJwb3B1cCIsInRpdGxlRWwiLCJmb250U2l6ZSIsIm1hcmdpbkJvdHRvbSIsImJ1dHRvbiIsInBhZGRpbmciLCJjdXJzb3IiLCJzaG93V2luUG9wdXAiLCJ0b1VwcGVyQ2FzZSIsInJlbW92ZSIsImhhbmRsZVBsYXllckRlYXRoIiwiZGVhdGhHcmlkWCIsImZsb29yIiwiZGVhdGhHcmlkWSIsImhlYXJ0RGl2IiwicG9pbnRlckV2ZW50cyIsImV4dHJhTGlmZURyb3BzIiwicXVlcnlTZWxlY3RvckFsbCIsImRyb3AiLCJkcm9wTGVmdCIsInBhcnNlSW50IiwiZHJvcFRvcCIsImlzTmFOIiwiZHJvcEdyaWRYIiwiZHJvcEdyaWRZIiwicFBvcyIsInBsYXllckdyaWRYIiwicGxheWVyR3JpZFkiLCJjdXJyZW50TGl2ZXMiLCJhY3RpdmVQbGF5ZXJDb3VudCIsImxhc3RBY3RpdmVQbGF5ZXJFbnRpdHkiLCJsb2NhbFBsYXllck5hbWUiLCJsYXN0UGxheWVyIiwiaW52aW5jaWJsZVVudGlsIiwiZVBvcyIsInByZXZpb3VzTGl2ZXMiLCJlbnRpdGllcyIsImRlbHRhIiwiUExBWUVSX1NJWkUiLCJiZWhhdmlvciIsIm1vdmVUb3dhcmRUYXJnZXQiLCJhY3RpdmVJbnB1dCIsImR4IiwiZHkiLCJoYXNJbnB1dCIsIm5leHRYIiwibmV4dFkiLCJzbmFwVGhyZXNob2xkIiwiaXNCbG9ja2VkIiwiY3VycmVudFRpbGVYIiwiZGlmZlgiLCJhYnMiLCJzaWduIiwiY3VycmVudFRpbGVZIiwiZGlmZlkiLCJuZXh0WEFmdGVyU25hcCIsIm5leHRZQWZ0ZXJTbmFwIiwic3RlcCIsInBsYXllclNpemUiLCJib3R0b20iLCJpc0Jsb2NrZWRDZWxsIiwicFVwRW50aXR5IiwidXBQb3MiLCJwVXAiLCJzZWVkIiwic2VlZFJhbmRvbSIsInNpbiIsInR5cGVzIiwidHlwZUluZGV4IiwicmFuZG9tVHlwZSIsImRpdiIsImFuaW1Sb3dzIiwidGFyZ2V0Um93IiwiZnJhbWVDb3VudCIsImZyYW1lRGVsYXkiLCJwb3NYIiwicG9zWSIsImJhY2tncm91bmRQb3NpdGlvbiIsInRyYW5zZm9ybSIsIm5leHRFbnRpdHlJZCIsImNvbXBvbmVudHMiLCJzeXN0ZW1zIiwiZGVsZXRlIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudE1hcCIsImVudHJpZXMiLCJjb21wb25lbnREYXRhIiwicmVtb3ZlQ29tcG9uZW50IiwiY29tcG9uZW50TmFtZXMiLCJmaXJzdE1hcCIsInJlc3VsdHMiLCJoYXNBbGwiLCJzeXN0ZW1GdW5jdGlvbiIsInN5c3RlbSIsIkdSSURfQk9SREVSX1NJWkUiLCJHQU1FX0NIUk9NRV9XSURUSCIsIkdBTUVfQ0hST01FX0hFSUdIVCIsImltYWdlcyIsIm5hbWVFbCIsImxpdmVzRWwiLCJzcGVlZEVsIiwiYm9tYnNFbCIsInJhbmdlRWwiLCJib2FyZFdpZHRoIiwiYm9hcmRIZWlnaHQiLCJib2FyZE91dGVyV2lkdGgiLCJib2FyZE91dGVySGVpZ2h0Iiwidmlld3BvcnRXaWR0aCIsImlubmVyV2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsImlubmVySGVpZ2h0Iiwic2NhbGUiLCJyb3dzIiwicm93SW5kZXgiLCJjb2xJbmRleCIsInN0YXRlcyIsInJvb21JZEVsIiwicGxheWVyc0VsIiwidGV4dEVsIiwidGltZXJFbCIsInMiLCJnYW1lU3RhcnRlZCIsInRpbWVyVGV4dCIsInJlcGxheUJ0biIsInJlbG9hZCIsIm1lbnVFbCIsInN1Ym1pdHRlZCIsInBsYXllckVudGVyIiwiY3VycmVudFRhcmdldCIsInNyYyIsIm11c2ljIiwiQXVkaW8iLCJpY29uIiwibG9vcCIsInZvbHVtZSIsInRvZ2dsZSIsInBsYXkiLCJvbmNlIiwidXBkYXRlQnV0dG9uIiwidGhlbiIsImNhdGNoIiwicGF1c2VkIiwibXV0ZWQiLCJpc011dGVkIiwiY2xhc3NMaXN0Il0sInNvdXJjZVJvb3QiOiIifQ==