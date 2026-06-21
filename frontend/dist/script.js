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
/* harmony import */ var _utils_sound__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/sound */ "./src/utils/sound.js");
/* harmony import */ var _utils_websocket__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/websocket */ "./src/utils/websocket.js");





const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");
const sound = new _utils_sound__WEBPACK_IMPORTED_MODULE_3__["default"]("./assets/sounds/background_music.mp3");
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
wss.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  (0,_utils_websocket__WEBPACK_IMPORTED_MODULE_4__.WebSocketHandler)(message);
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
/* harmony export */   setChatError: () => (/* binding */ setChatError),
/* harmony export */   setMessages: () => (/* binding */ setMessages)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/reactivity */ "./mini-framework/reactivity.js");
/* harmony import */ var _app_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app/app */ "./src/app/app.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/debounce.js */ "./src/utils/debounce.js");




const [messages, setMessages] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)([]);
const [chatError, setChatError] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)("");

function ChatPlayers() {
  const messagesContainer = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "messages"
  });
  const errorChat = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null);
  (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
    const err = chatError();
    errorChat.textContent = err;
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
    }
  });
  function broadcastMessage(e) {
    e.preventDefault();
    let fn = (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_3__.debounce)(() => {
      let formData = new FormData(e.target);
      let message = formData.get("message").trim();
      if (!message || message.length > 20) {
        e.target.reset();
        return;
      }
      _app_app__WEBPACK_IMPORTED_MODULE_2__["default"].send(JSON.stringify({
        type: "chat_message",
        message: message
      }));
      e.target.reset();
    }, 1000);
    fn();
  }
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "chat",
    onSubmit: broadcastMessage
  }, errorChat, messagesContainer, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", null, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
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


const TILE_SIZE = 40;
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
  }, "\u2764\uFE0F"), livesEl), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "\u26A1"), speedEl), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "\uD83D\uDCA3"), bombsEl), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "\uD83C\uDFAF"), rangeEl))), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "game-grid"
  }, rows)));
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
let playersEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Players: / 4");
let textEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null);
let timerEl = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Timer: ");
(0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
  const s = states();
  roomIdEl.textContent = `Room ID: ${s.roomId}`;
  playersEl.textContent = `Players: ${s.players?.length} / 4`;
  textEl.textContent = s.text;
  timerEl.textContent = s.secondsLeft ? `Timer: ${s.secondsLeft}` : ``;
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
}, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "\uD83C\uDF89 You Win!"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "All other players have left the game."), replayBtn);
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
/* harmony export */   setNicknameError: () => (/* binding */ setNicknameError)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/reactivity */ "./mini-framework/reactivity.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game */ "./src/pages/game.jsx");



const [nicknameError, setNicknameError] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)("");

function Register({
  wss
}) {
  const errorNickname = (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "error-nickname"
  });
  (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
    errorNickname.textContent = nicknameError();
  });
  let playerEnter = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nickname = formData.get("nickname").trim();
    if (!nickname || nickname.length > 20) return;
    (0,_game__WEBPACK_IMPORTED_MODULE_2__.setPlayerName)(nickname);
    wss.send(JSON.stringify({
      type: "register_player",
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
  }, "start playing"), errorNickname);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Register);

/***/ },

/***/ "./src/utils/debounce.js"
/*!*******************************!*\
  !*** ./src/utils/debounce.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   debounce: () => (/* binding */ debounce)
/* harmony export */ });
function debounce(func, wait) {
  let timeout = null;
  let fn = () => {
    if (timeout) {
      return;
    } else {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        timeout = null;
      }, wait);
      return func();
    }
  };
  return fn;
}

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

/***/ },

/***/ "./src/utils/websocket.js"
/*!********************************!*\
  !*** ./src/utils/websocket.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebSocketHandler: () => (/* binding */ WebSocketHandler)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../pages/game */ "./src/pages/game.jsx");
/* harmony import */ var _pages_menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pages/menu */ "./src/pages/menu.jsx");
/* harmony import */ var _pages_lobby__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pages/lobby */ "./src/pages/lobby.jsx");
/* harmony import */ var _components_chat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/chat */ "./src/components/chat.jsx");
/* harmony import */ var _pages_register__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../pages/register */ "./src/pages/register.jsx");







function WebSocketHandler(message) {
  switch (message.type) {
    case "lobby_update":
      document.body.className = "lobby-page";
      if (!root.querySelector(".conatiner-lobby")) {
        (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_lobby__WEBPACK_IMPORTED_MODULE_3__["default"], null), root);
      }
      (0,_pages_lobby__WEBPACK_IMPORTED_MODULE_3__.setStates)({
        roomId: message.roomId,
        players: message.players,
        secondsLeft: message.secondsLeft,
        text: message.text
      });
      break;
    case "game_started":
      document.body.className = "game-page";
      (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_game__WEBPACK_IMPORTED_MODULE_1__["default"], {
        grid: message.grid
      }), root);
      break;
    case "room_alone":
      document.body.className = "menu-page";
      (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_menu__WEBPACK_IMPORTED_MODULE_2__["default"], null), root);
      break;
    case "chat_message":
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_4__.setMessages)(prev => [...prev, message.message]);
      break;
    case "error_nickname":
      (0,_pages_register__WEBPACK_IMPORTED_MODULE_5__.setNicknameError)(message.message);
      break;
    case "error_message":
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_4__.setChatError)(message.message);
      break;
  }
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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dUUsSUFBSSxDQUFDQyxTQUFTLEdBQUcsV0FBVztNQUNyQ3pELDJEQUFNLENBQUNwQixrRUFBQSxDQUFDNkosbURBQUksTUFBRSxDQUFDLEVBQUV2RixJQUFJLENBQUM7TUFDdEI7SUFDSixLQUFLLGNBQWM7TUFDZmUsNkRBQVcsQ0FBQ3NHLElBQUksSUFBSSxDQUFDLEdBQUdBLElBQUksRUFBRTVHLE9BQU8sQ0FBQ0EsT0FBTyxDQUFDLENBQUM7TUFDL0M7SUFDSixLQUFLLGdCQUFnQjtNQUNqQmdGLGlFQUFnQixDQUFDaEYsT0FBTyxDQUFDQSxPQUFPLENBQUM7TUFDakM7SUFDSixLQUFLLGVBQWU7TUFDaEJRLDhEQUFZLENBQUNSLE9BQU8sQ0FBQ0EsT0FBTyxDQUFDO01BQzdCO0VBQ1I7QUFDSixDOzs7Ozs7VUN4Q0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvZG9tLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NoYXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9kZWJvdW5jZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvc291bmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3dlYnNvY2tldC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufVxuIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgI1JvdXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgI0ZpcnN0UmVzb2x2ZSA9IGZhbHNlO1xuXG4gICAgb24ocGF0aCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLiNSb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgXG4gICAgbmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5ID0gXCJwdXNoXCIgfSA9IHt9KSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aCA6IFwiL1wiICsgcGF0aDtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRpb24ubmF2aWdhdGUocGF0aCwgeyBoaXN0b3J5IH0pO1xuICAgIH1cbiAgICBcbiAgICByZXNvbHZlKHBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1twYXRoXTtcblxuICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmbih7IHVybDogbmV3IFVSTChsb2NhdGlvbi5ocmVmKSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGlzdGVuKG9uRXJyb3I0MDQpIHtcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LmludGVyY2VwdCh7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwucGF0aG5hbWUsIHRoaXMuI1JvdXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbdXJsLnBhdGhuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjQwNCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZuKHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuI0ZpcnN0UmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0aGlzLiNGaXJzdFJlc29sdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyIGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IFNvdW5kIGZyb20gXCIuLi91dGlscy9zb3VuZFwiO1xuaW1wb3J0IHsgV2ViU29ja2V0SGFuZGxlciB9IGZyb20gXCIuLi91dGlscy93ZWJzb2NrZXRcIjtcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo1MDAwXCIpO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5cbnNvdW5kLmluaXQoKTtcblxucm91dGVyLm9uKFwiL1wiLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcInJlZ2lzdGVyLXBhZ2VcIjtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgV2ViU29ja2V0SGFuZGxlcihtZXNzYWdlKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB3c3M7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IHdzcyBmcm9tIFwiLi4vYXBwL2FwcFwiO1xuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tIFwiLi4vdXRpbHMvZGVib3VuY2UuanNcIjtcblxuY29uc3QgW21lc3NhZ2VzLCBzZXRNZXNzYWdlc10gPSBjcmVhdGVTaWduYWwoW10pO1xuY29uc3QgW2NoYXRFcnJvciwgc2V0Q2hhdEVycm9yXSA9IGNyZWF0ZVNpZ25hbChcIlwiKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzLCBzZXRDaGF0RXJyb3IgfTtcblxuZnVuY3Rpb24gQ2hhdFBsYXllcnMoKSB7XG4gICAgY29uc3QgbWVzc2FnZXNDb250YWluZXIgPSA8ZGl2IGNsYXNzPVwibWVzc2FnZXNcIj48L2Rpdj47XG4gICAgY29uc3QgZXJyb3JDaGF0ID0gPHA+PC9wPjtcblxuICAgIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVyciA9IGNoYXRFcnJvcigpO1xuICAgICAgICBlcnJvckNoYXQudGV4dENvbnRlbnQgPSBlcnI7XG4gICAgfSk7XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBtc2dzID0gbWVzc2FnZXMoKTtcbiAgICAgICAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBmb3IgKGxldCBtc2cgb2YgbXNncykge1xuICAgICAgICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IG1zZztcbiAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHApO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXNDb250YWluZXIucmVtb3ZlQ2hpbGQobWVzc2FnZXNDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgICAgIG1zZ3MudW5zaGlmdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBmbiA9IGRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG4gICAgICAgICAgICBsZXQgbWVzc2FnZSA9IGZvcm1EYXRhLmdldChcIm1lc3NhZ2VcIikudHJpbSgpO1xuXG4gICAgICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3c3Muc2VuZChcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hhdF9tZXNzYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIGZuKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNoYXRcIiBvblN1Ym1pdD17YnJvYWRjYXN0TWVzc2FnZX0+XG4gICAgICAgICAgICB7ZXJyb3JDaGF0fVxuICAgICAgICAgICAge21lc3NhZ2VzQ29udGFpbmVyfVxuICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cIm1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInR5cGUgdG8gdGhlIG90aGVyIHBsYXllcnMgLi4uXCJcbiAgICAgICAgICAgICAgICAgICAgbWF4bGVuZ3RoPVwiMjBcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0UGxheWVycztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5cbmNvbnN0IFRJTEVfU0laRSA9IDQwO1xuXG5jb25zdCBpbWFnZXMgPSB7XG4gICAgMjogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZmxvb3IuanBnXCIsXG4gICAgMzogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfd2FsbC5wbmdcIixcbiAgICA0OiBcIi4vYXNzZXRzL2Jsb2Nrcy9ibG9ja19leHBsb2l0LnBuZ1wiLFxufTtcblxuY29uc3QgW3BsYXllck5hbWUsIHNldFBsYXllck5hbWVdID0gY3JlYXRlU2lnbmFsKFwiUGxheWVyIDFcIik7XG5jb25zdCBbbGl2ZXMsIHNldExpdmVzXSA9IGNyZWF0ZVNpZ25hbCgzKTtcbmNvbnN0IFtzcGVlZCwgc2V0U3BlZWRdID0gY3JlYXRlU2lnbmFsKDEpO1xuY29uc3QgW2JvbWJzLCBzZXRCb21ic10gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbcmFuZ2UsIHNldFJhbmdlXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmV4cG9ydCB7IHNldFBsYXllck5hbWUsIHNldExpdmVzLCBzZXRTcGVlZCwgc2V0Qm9tYnMsIHNldFJhbmdlIH07XG5cbmNvbnN0IG5hbWVFbCA9IDxzcGFuIGNsYXNzPVwicGxheWVyLW5hbWVcIj48L3NwYW4+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4geyBuYW1lRWwudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lKCk7IH0pO1xuXG5jb25zdCBsaXZlc0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBsaXZlcy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBzcGVlZEVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBzcGVlZC12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCBib21ic0VsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSBib21icy12YWx1ZVwiPjwvc3Bhbj47XG5jb25zdCByYW5nZUVsID0gPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZSByYW5nZS12YWx1ZVwiPjwvc3Bhbj47XG5cbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGxpdmVzRWwudGV4dENvbnRlbnQgPSBsaXZlcygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHNwZWVkRWwudGV4dENvbnRlbnQgPSBzcGVlZCgpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IGJvbWJzRWwudGV4dENvbnRlbnQgPSBib21icygpOyB9KTtcbmNyZWF0ZUVmZmVjdCgoKSA9PiB7IHJhbmdlRWwudGV4dENvbnRlbnQgPSByYW5nZSgpOyB9KTtcblxuZnVuY3Rpb24gR2FtZSh7IGdyaWQgfSkge1xuICAgIGNvbnN0IHJvd3MgPSBbXTtcbiAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgZ3JpZC5sZW5ndGg7IHJvd0luZGV4KyspIHtcbiAgICAgICAgY29uc3QgY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IGdyaWRbcm93SW5kZXhdLmxlbmd0aDsgY29sSW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGdyaWRbcm93SW5kZXhdW2NvbEluZGV4XTtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBcInRpbGVcIjtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGB3aWR0aDoke1RJTEVfU0laRX1weDtoZWlnaHQ6JHtUSUxFX1NJWkV9cHg7YDtcblxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDIgfHwgY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLWZsb29yXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSBcIiB0aWxlLXdhbGxcIjtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbM119KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1s0XX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAwIHx8IGNlbGwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgYmFja2dyb3VuZC1pbWFnZTp1cmwoJHtpbWFnZXNbMl19KWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNlbGxzLnB1c2goPGRpdiBjbGFzcz17Y2xhc3NOYW1lfSBzdHlsZT17c3R5bGV9PjwvZGl2Pik7XG4gICAgICAgIH1cbiAgICAgICAgcm93cy5wdXNoKDxkaXYgY2xhc3M9XCJncmlkLXJvd1wiPntjZWxsc308L2Rpdj4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtZ2xhc3NcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtYmFyXCI+XG4gICAgICAgICAgICAgICAgICAgIHtuYW1lRWx9XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1zdGF0c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj7inaTvuI88L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpdmVzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+4pqhPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzcGVlZEVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPvCfkqM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvbWJzRWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+8J+Orzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmFuZ2VFbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1ncmlkXCI+e3Jvd3N9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsLCBjcmVhdGVFZmZlY3QgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuaW1wb3J0IENoYXRQbGF5ZXJzIGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxubGV0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSBjcmVhdGVTaWduYWwoe30pO1xuZXhwb3J0IHsgc2V0U3RhdGVzIH07XG5cbmxldCByb29tSWRFbCA9IDxwPlJvb20gSUQ6IDwvcD47XG5sZXQgcGxheWVyc0VsID0gPHA+UGxheWVyczogLyA0PC9wPjtcbmxldCB0ZXh0RWwgPSA8cD48L3A+O1xubGV0IHRpbWVyRWwgPSA8cD5UaW1lcjogPC9wPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzID0gc3RhdGVzKCk7XG4gICAgcm9vbUlkRWwudGV4dENvbnRlbnQgPSBgUm9vbSBJRDogJHtzLnJvb21JZH1gO1xuICAgIHBsYXllcnNFbC50ZXh0Q29udGVudCA9IGBQbGF5ZXJzOiAke3MucGxheWVycz8ubGVuZ3RofSAvIDRgO1xuICAgIHRleHRFbC50ZXh0Q29udGVudCA9IHMudGV4dDtcbiAgICB0aW1lckVsLnRleHRDb250ZW50ID0gcy5zZWNvbmRzTGVmdCA/IGBUaW1lcjogJHtzLnNlY29uZHNMZWZ0fWAgOiBgYDtcbn0pO1xuXG5mdW5jdGlvbiBMb2JieSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29uYXRpbmVyLWxvYmJ5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9iYnktYm94XCI+XG4gICAgICAgICAgICAgICAgPGgxPkxvYmJ5PC9oMT5cbiAgICAgICAgICAgICAgICB7cm9vbUlkRWx9XG4gICAgICAgICAgICAgICAge3BsYXllcnNFbH1cbiAgICAgICAgICAgICAgICB7dGV4dEVsfVxuICAgICAgICAgICAgICAgIHt0aW1lckVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Q2hhdFBsYXllcnMgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5jb25zdCByZXBsYXlCdG4gPSA8YnV0dG9uIGNsYXNzPVwicmVwbGF5LWJ1dHRvblwiPlBsYXkgQWdhaW48L2J1dHRvbj47XG5cbnJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbmxldCBtZW51RWwgPSAoXG4gICAgPGRpdiBjbGFzcz1cIm1lbnUtYm94XCI+XG4gICAgICAgIDxoMT7wn46JIFlvdSBXaW4hPC9oMT5cbiAgICAgICAgPHA+QWxsIG90aGVyIHBsYXllcnMgaGF2ZSBsZWZ0IHRoZSBnYW1lLjwvcD5cbiAgICAgICAge3JlcGxheUJ0bn1cbiAgICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lbnUoKSB7XG4gICAgcmV0dXJuIG1lbnVFbDtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgeyBzZXRQbGF5ZXJOYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xuXG5jb25zdCBbbmlja25hbWVFcnJvciwgc2V0Tmlja25hbWVFcnJvcl0gPSBjcmVhdGVTaWduYWwoXCJcIik7XG5leHBvcnQgeyBzZXROaWNrbmFtZUVycm9yIH07XG5cbmZ1bmN0aW9uIFJlZ2lzdGVyKHsgd3NzIH0pIHtcbiAgICBjb25zdCBlcnJvck5pY2tuYW1lID0gPHAgY2xhc3M9XCJlcnJvci1uaWNrbmFtZVwiPjwvcD47XG5cbiAgICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgICAgICBlcnJvck5pY2tuYW1lLnRleHRDb250ZW50ID0gbmlja25hbWVFcnJvcigpO1xuICAgIH0pO1xuXG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUgfHwgbmlja25hbWUubGVuZ3RoID4gMjApIHJldHVybjtcblxuICAgICAgICBzZXRQbGF5ZXJOYW1lKG5pY2tuYW1lKTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcInJlZ2lzdGVyX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmlja25hbWUtaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW50ZXIgeW91ciBuYW1lXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmVnaXN0ZXItYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPnN0YXJ0IHBsYXlpbmc8L2J1dHRvbj5cbiAgICAgICAgICAgIHtlcnJvck5pY2tuYW1lfVxuICAgICAgICA8L2Zvcm0+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RlcjtcbiIsImV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0KSB7XG4gICAgbGV0IHRpbWVvdXQgPSBudWxsO1xuICAgIGxldCBmbiA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICB9LCB3YWl0KTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZuO1xufSIsImNsYXNzIFNvdW5kIHtcbiAgICBjb25zdHJ1Y3RvcihzcmMpIHtcbiAgICAgICAgdGhpcy5tdXNpYyA9IG5ldyBBdWRpbyhzcmMpO1xuICAgICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuXG4gICAgICAgIHRoaXMubXVzaWMubG9vcCA9IHRydWU7XG4gICAgICAgIHRoaXMubXVzaWMudm9sdW1lID0gMC40O1xuXG4gICAgICAgIHRoaXMuYnV0dG9uLmNsYXNzTmFtZSA9IFwic291bmQtYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFwcGVuZCh0aGlzLmljb24pO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZSgpKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZCh0aGlzLmJ1dHRvbik7XG5cbiAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLm11c2ljLnBsYXkoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11c2ljLnBhdXNlZCB8fCB0aGlzLm11c2ljLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb25cIik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQnV0dG9uKCkge1xuICAgICAgICBjb25zdCBpc011dGVkID0gdGhpcy5tdXNpYy5tdXRlZCB8fCB0aGlzLm11c2ljLnBhdXNlZDtcblxuICAgICAgICB0aGlzLmljb24uY2xhc3NOYW1lID0gaXNNdXRlZCA/IFwiZmEtc29saWQgZmEtdm9sdW1lLW9mZlwiIDogXCJmYS1zb2xpZCBmYS12b2x1bWUtaGlnaFwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtbXV0ZWRcIiwgaXNNdXRlZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VuZDtcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHJlbmRlciB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCBHYW1lIGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgTWVudSBmcm9tIFwiLi4vcGFnZXMvbWVudVwiO1xuaW1wb3J0IExvYmJ5IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0U3RhdGVzIH0gZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcywgc2V0Q2hhdEVycm9yIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuaW1wb3J0IHsgc2V0Tmlja25hbWVFcnJvciB9IGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gV2ViU29ja2V0SGFuZGxlcihtZXNzYWdlKSB7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcImxvYmJ5X3VwZGF0ZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImxvYmJ5LXBhZ2VcIjtcbiAgICAgICAgICAgIGlmICghcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmNvbmF0aW5lci1sb2JieVwiKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcig8TG9iYnkgLz4sIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnM6IG1lc3NhZ2UucGxheWVycyxcbiAgICAgICAgICAgICAgICBzZWNvbmRzTGVmdDogbWVzc2FnZS5zZWNvbmRzTGVmdCxcbiAgICAgICAgICAgICAgICB0ZXh0OiBtZXNzYWdlLnRleHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZ2FtZV9zdGFydGVkXCI6XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IFwiZ2FtZS1wYWdlXCI7XG4gICAgICAgICAgICByZW5kZXIoPEdhbWUgZ3JpZD17bWVzc2FnZS5ncmlkfSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJvb21fYWxvbmVcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJtZW51LXBhZ2VcIjtcbiAgICAgICAgICAgIHJlbmRlcig8TWVudSAvPiwgcm9vdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNoYXRfbWVzc2FnZVwiOlxuICAgICAgICAgICAgc2V0TWVzc2FnZXMocHJldiA9PiBbLi4ucHJldiAsbWVzc2FnZS5tZXNzYWdlXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVycm9yX25pY2tuYW1lXCI6XG4gICAgICAgICAgICBzZXROaWNrbmFtZUVycm9yKG1lc3NhZ2UubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVycm9yX21lc3NhZ2VcIjpcbiAgICAgICAgICAgIHNldENoYXRFcnJvcihtZXNzYWdlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC9hcHAuanNcIik7XG4iLCIiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJwcm9wcyIsImNoaWxkcmVuIiwiZWxlIiwiZG9jdW1lbnQiLCJrZXkiLCJzdGFydHNXaXRoIiwiZXZlbnROYW1lIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRBdHRyaWJ1dGUiLCJmbGF0Q2hpbGRyZW4iLCJmbGF0IiwiSW5maW5pdHkiLCJhcHBlbmQiLCJmaWx0ZXIiLCJjaGlsZCIsInVuZGVmaW5lZCIsInJlbmRlciIsImVsZW1lbnQiLCJjb250YWluZXIiLCJyZXBsYWNlQ2hpbGRyZW4iLCJSb3V0ZXIiLCJyb3V0ZXIiLCJlZmZlY3RTdGFjayIsImFjdGl2ZUVmZmVjdCIsImNyZWF0ZVNpZ25hbCIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwiZWZmZWN0cyIsIlNldCIsIlJlYWQiLCJhZGQiLCJXcml0ZSIsIm5ld1ZhbHVlIiwiZm4iLCJmb3JFYWNoIiwiZWZmZWN0IiwiY3JlYXRlRWZmZWN0IiwicHVzaCIsInBvcCIsImxlbmd0aCIsIlJvdXRlcyIsIk9iamVjdCIsImNyZWF0ZSIsIkZpcnN0UmVzb2x2ZSIsIm9uIiwicGF0aCIsImhhbmRsZXIiLCJuYXZpZ2F0ZSIsImhpc3RvcnkiLCJuYXZpZ2F0aW9uIiwicmVzb2x2ZSIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJ1cmwiLCJVUkwiLCJocmVmIiwibGlzdGVuIiwib25FcnJvcjQwNCIsImV2ZW50IiwiZGVzdGluYXRpb24iLCJpbnRlcmNlcHQiLCJjb25zb2xlIiwibG9nIiwiUmVnaXN0ZXIiLCJTb3VuZCIsIldlYlNvY2tldEhhbmRsZXIiLCJyb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3c3MiLCJXZWJTb2NrZXQiLCJzb3VuZCIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJtZXNzYWdlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsImRlYm91bmNlIiwibWVzc2FnZXMiLCJzZXRNZXNzYWdlcyIsImNoYXRFcnJvciIsInNldENoYXRFcnJvciIsIkNoYXRQbGF5ZXJzIiwibWVzc2FnZXNDb250YWluZXIiLCJjbGFzcyIsImVycm9yQ2hhdCIsImVyciIsInRleHRDb250ZW50IiwibXNncyIsImlubmVySFRNTCIsIm1zZyIsInAiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJ1bnNoaWZ0IiwiYnJvYWRjYXN0TWVzc2FnZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJ0YXJnZXQiLCJnZXQiLCJ0cmltIiwicmVzZXQiLCJzZW5kIiwic3RyaW5naWZ5Iiwib25TdWJtaXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJtYXhsZW5ndGgiLCJUSUxFX1NJWkUiLCJpbWFnZXMiLCJwbGF5ZXJOYW1lIiwic2V0UGxheWVyTmFtZSIsImxpdmVzIiwic2V0TGl2ZXMiLCJzcGVlZCIsInNldFNwZWVkIiwiYm9tYnMiLCJzZXRCb21icyIsInJhbmdlIiwic2V0UmFuZ2UiLCJuYW1lRWwiLCJsaXZlc0VsIiwic3BlZWRFbCIsImJvbWJzRWwiLCJyYW5nZUVsIiwiR2FtZSIsImdyaWQiLCJyb3dzIiwicm93SW5kZXgiLCJjZWxscyIsImNvbEluZGV4IiwiY2VsbCIsInN0eWxlIiwic3RhdGVzIiwic2V0U3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsInJvb21JZCIsInBsYXllcnMiLCJ0ZXh0Iiwic2Vjb25kc0xlZnQiLCJMb2JieSIsInJlcGxheUJ0biIsInJlbG9hZCIsIm1lbnVFbCIsIk1lbnUiLCJuaWNrbmFtZUVycm9yIiwic2V0Tmlja25hbWVFcnJvciIsImVycm9yTmlja25hbWUiLCJwbGF5ZXJFbnRlciIsImN1cnJlbnRUYXJnZXQiLCJuaWNrbmFtZSIsImZ1bmMiLCJ3YWl0IiwidGltZW91dCIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJjb25zdHJ1Y3RvciIsInNyYyIsIm11c2ljIiwiQXVkaW8iLCJidXR0b24iLCJpY29uIiwibG9vcCIsInZvbHVtZSIsInRvZ2dsZSIsInVwZGF0ZUJ1dHRvbiIsInBsYXkiLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiLCJxdWVyeVNlbGVjdG9yIiwicHJldiJdLCJzb3VyY2VSb290IjoiIn0=