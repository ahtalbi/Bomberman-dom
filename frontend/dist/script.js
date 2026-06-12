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









const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");
const sound = new _utils_sound__WEBPACK_IMPORTED_MODULE_6__["default"]("./assets/sounds/background_music.mp3");
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
      break;
    case "room_alone":
      document.body.className = "menu-page";
      (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_menu__WEBPACK_IMPORTED_MODULE_4__["default"], null), root);
      break;
    case "chat_message":
      (0,_components_chat__WEBPACK_IMPORTED_MODULE_7__.setMessages)(prev => [...prev, message.message]);
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

/***/ "./src/pages/game.jsx"
/*!****************************!*\
  !*** ./src/pages/game.jsx ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/reactivity */ "./mini-framework/reactivity.js");


const TILE_SIZE = 40;
const images = {
  2: "./assets/blocks/block_floor.jpg",
  3: "./assets/blocks/block_wall.png",
  4: "./assets/blocks/block_exploit.png"
};
const [lives, setLives] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)(3);
const [speed, setSpeed] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)(1);
const [bombs, setBombs] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)(1);
const [range, setRange] = (0,_mini_framework_reactivity__WEBPACK_IMPORTED_MODULE_1__.createSignal)(1);
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
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "player-name"
  }, "Player 1"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-stats"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "\u2764\uFE0F"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-value"
  }, lives())), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "\u26A1"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-label"
  }, "speed"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-value"
  }, speed())), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "\uD83D\uDCA3"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-value"
  }, bombs())), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "score-item"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-icon"
  }, "\uD83C\uDFAF"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "score-value"
  }, range())))), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");

function Register({
  wss
}) {
  let playerEnter = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nickname = formData.get("nickname").trim();
    if (!nickname || nickname.length > 20) return;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBRyx3QkFBd0IsR0FBRyx5QkFBeUI7SUFDcEYsSUFBSSxDQUFDWixNQUFNLENBQUNhLFNBQVMsQ0FBQ1QsTUFBTSxDQUFDLFVBQVUsRUFBRVEsT0FBTyxDQUFDO0VBQ3JEO0FBQ0o7QUFFQSxpRUFBZWxHLEtBQUssRTs7Ozs7O1VDbkRwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQzVCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eS5qcyIsIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2hhdC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2dhbWUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9sb2JieS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lbnUuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yZWdpc3Rlci5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3NvdW5kLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCBwcm9wcywgLi4uY2hpbGRyZW4pIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gdHlwZSh7IC4uLihwcm9wcyB8fCB7fSksIGNoaWxkcmVuIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcyB8fCB7fSkge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJvblwiKSAmJiB0eXBlb2YgcHJvcHNba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBrZXkuc2xpY2UoMikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGUuc2V0QXR0cmlidXRlKGtleSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmbGF0Q2hpbGRyZW4gPSBjaGlsZHJlbi5mbGF0KEluZmluaXR5KTtcbiAgICBlbGUuYXBwZW5kKC4uLmZsYXRDaGlsZHJlbi5maWx0ZXIoY2hpbGQgPT4gY2hpbGQgIT09IG51bGwgJiYgY2hpbGQgIT09IHVuZGVmaW5lZCAmJiBjaGlsZCAhPT0gZmFsc2UpKTtcblxuICAgIHJldHVybiBlbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgY29udGFpbmVyLnJlcGxhY2VDaGlsZHJlbihlbGVtZW50KTtcbn1cbiIsImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCIuL3JvdXRlci5qc1wiO1xuXG5sZXQgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7IiwiY29uc3QgZWZmZWN0U3RhY2sgPSBbXTtcbmxldCBhY3RpdmVFZmZlY3QgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2lnbmFsKGluaXRpYWxWYWx1ZSkge1xuICAgbGV0IHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgY29uc3QgZWZmZWN0cyA9IG5ldyBTZXQoKTtcblxuICAgY29uc3QgUmVhZCA9ICgpID0+IHtcbiAgICAgIGlmIChhY3RpdmVFZmZlY3QpIHtcbiAgICAgICAgIGVmZmVjdHMuYWRkKGFjdGl2ZUVmZmVjdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICB9XG5cbiAgIGNvbnN0IFdyaXRlID0gKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgIGxldCBmbiA9IG5ld1ZhbHVlO1xuICAgICAgICAgdmFsdWUgPSBmbih2YWx1ZSk7XG4gICAgICB9IFxuICAgICAgZWxzZSB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgZWZmZWN0cy5mb3JFYWNoKGVmZmVjdCA9PiBlZmZlY3QoKSk7XG4gICB9XG5cbiAgIHJldHVybiBbUmVhZCwgV3JpdGVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWZmZWN0KGVmZmVjdCkge1xuICAgZWZmZWN0U3RhY2sucHVzaChlZmZlY3QpO1xuICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0O1xuICAgZWZmZWN0KCk7XG4gICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdFN0YWNrW2VmZmVjdFN0YWNrLmxlbmd0aCAtIDFdIHx8IG51bGw7XG59XG4iLCJleHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgICAjUm91dGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAjRmlyc3RSZXNvbHZlID0gZmFsc2U7XG5cbiAgICBvbihwYXRoLCBoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuI1JvdXRlc1twYXRoXSA9IGhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBcbiAgICBuYXZpZ2F0ZShwYXRoLCB7IGhpc3RvcnkgPSBcInB1c2hcIiB9ID0ge30pIHtcbiAgICAgICAgcGF0aCA9IHBhdGguc3RhcnRzV2l0aChcIi9cIikgPyBwYXRoIDogXCIvXCIgKyBwYXRoO1xuICAgICAgICByZXR1cm4gbmF2aWdhdGlvbi5uYXZpZ2F0ZShwYXRoLCB7IGhpc3RvcnkgfSk7XG4gICAgfVxuICAgIFxuICAgIHJlc29sdmUocGF0aCA9IGxvY2F0aW9uLnBhdGhuYW1lKSB7XG4gICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3BhdGhdO1xuXG4gICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZuKHsgdXJsOiBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBsaXN0ZW4ob25FcnJvcjQwNCkge1xuICAgICAgICBuYXZpZ2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJuYXZpZ2F0ZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoZXZlbnQuZGVzdGluYXRpb24udXJsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXZlbnQuaW50ZXJjZXB0KHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybC5wYXRobmFtZSwgdGhpcy4jUm91dGVzKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmbiA9IHRoaXMuI1JvdXRlc1t1cmwucGF0aG5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yNDA0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm4oeyB1cmwgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdGhpcy4jRmlyc3RSZXNvbHZlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHRoaXMuI0ZpcnN0UmVzb2x2ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHJlbmRlciB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrXCI7XG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4uL3BhZ2VzL21lbnVcIjtcbmltcG9ydCBMb2JieSBmcm9tIFwiLi4vcGFnZXMvbG9iYnlcIjtcbmltcG9ydCB7IHNldFN0YXRlcyB9IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IFNvdW5kIGZyb20gXCIuLi91dGlscy9zb3VuZFwiO1xuaW1wb3J0IHsgc2V0TWVzc2FnZXMgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIik7XG5jb25zdCB3c3MgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9sb2NhbGhvc3Q6NTAwMFwiKTtcbmNvbnN0IHNvdW5kID0gbmV3IFNvdW5kKFwiLi9hc3NldHMvc291bmRzL2JhY2tncm91bmRfbXVzaWMubXAzXCIpO1xuXG5zb3VuZC5pbml0KCk7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJyZWdpc3Rlci1wYWdlXCI7XG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4geyBhbGVydChcIjQwNFwiKSB9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xuXG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJyb29tX3VwZGF0ZVwiOlxuICAgICAgICBjYXNlIFwibG9iYnlfdGltZXJcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJsb2JieS1wYWdlXCI7XG4gICAgICAgICAgICBpZiAoIXJvb3QucXVlcnlTZWxlY3RvcihcIi5jb25hdGluZXItbG9iYnlcIikpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoPExvYmJ5IC8+LCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXRlcyh7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZCxcbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ6IG1lc3NhZ2UucGxheWVyc0NvdW50LFxuICAgICAgICAgICAgICAgIHNlY29uZHNMZWZ0OiBtZXNzYWdlLnNlY29uZHNMZWZ0LFxuICAgICAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UudGV4dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJnYW1lX3N0YXJ0ZWRcIjpcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gXCJnYW1lLXBhZ2VcIjtcbiAgICAgICAgICAgIHJlbmRlcig8R2FtZSBncmlkPXttZXNzYWdlLmdyaWR9IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicm9vbV9hbG9uZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2ICxtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICB9XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvclwiLCBlcnIpO1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdzcztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgd3NzIGZyb20gXCIuLi9hcHAvYXBwXCI7XG5cbmNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gY3JlYXRlU2lnbmFsKFtdKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzIH07XG5cbmZ1bmN0aW9uIENoYXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IG1lc3NhZ2VzQ29udGFpbmVyID0gPGRpdiBjbGFzcz1cIm1lc3NhZ2VzXCI+PC9kaXY+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNncyA9IG1lc3NhZ2VzKCk7XG4gICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgbXNnIG9mIG1zZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBtc2c7XG4gICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG1lc3NhZ2VzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBtc2dzLnVuc2hpZnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBmb3JtRGF0YS5nZXQoXCJtZXNzYWdlXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcImNoYXRfbWVzc2FnZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgfSkpO1xuICAgICAgICBlLnRhcmdldC5yZXNldCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0XCIgb25TdWJtaXQ9e2Jyb2FkY2FzdE1lc3NhZ2V9PlxuICAgICAgICAgICAge21lc3NhZ2VzQ29udGFpbmVyfVxuICAgICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1lc3NhZ2VcIiBwbGFjZWhvbGRlcj1cInR5cGUgdG8gdGhlIG90aGVyIHBsYXllcnMgLi4uXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXRQbGF5ZXJzOyIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvcmVhY3Rpdml0eVwiO1xuXG5jb25zdCBUSUxFX1NJWkUgPSA0MDtcblxuY29uc3QgaW1hZ2VzID0ge1xuICAgIDI6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX2Zsb29yLmpwZ1wiLFxuICAgIDM6IFwiLi9hc3NldHMvYmxvY2tzL2Jsb2NrX3dhbGwucG5nXCIsXG4gICAgNDogXCIuL2Fzc2V0cy9ibG9ja3MvYmxvY2tfZXhwbG9pdC5wbmdcIixcbn07XG5cbmNvbnN0IFtsaXZlcywgc2V0TGl2ZXNdID0gY3JlYXRlU2lnbmFsKDMpO1xuY29uc3QgW3NwZWVkLCBzZXRTcGVlZF0gPSBjcmVhdGVTaWduYWwoMSk7XG5jb25zdCBbYm9tYnMsIHNldEJvbWJzXSA9IGNyZWF0ZVNpZ25hbCgxKTtcbmNvbnN0IFtyYW5nZSwgc2V0UmFuZ2VdID0gY3JlYXRlU2lnbmFsKDEpO1xuXG5mdW5jdGlvbiBHYW1lKHsgZ3JpZCB9KSB7XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBncmlkLmxlbmd0aDsgcm93SW5kZXgrKykge1xuICAgICAgICBjb25zdCBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgZ3JpZFtyb3dJbmRleF0ubGVuZ3RoOyBjb2xJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZ3JpZFtyb3dJbmRleF1bY29sSW5kZXhdO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IFwidGlsZVwiO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gYHdpZHRoOiR7VElMRV9TSVpFfXB4O2hlaWdodDoke1RJTEVfU0laRX1weDtgO1xuXG4gICAgICAgICAgICBpZiAoY2VsbCA9PT0gMiB8fCBjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtZmxvb3JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSAzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IFwiIHRpbGUtd2FsbFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1szXX0pYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjZWxsID09PSA0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYGJhY2tncm91bmQtaW1hZ2U6dXJsKCR7aW1hZ2VzWzRdfSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNlbGwgPT09IDAgfHwgY2VsbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGBiYWNrZ3JvdW5kLWltYWdlOnVybCgke2ltYWdlc1syXX0pYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2VsbHMucHVzaCg8ZGl2IGNsYXNzPXtjbGFzc05hbWV9IHN0eWxlPXtzdHlsZX0+PC9kaXY+KTtcbiAgICAgICAgfVxuICAgICAgICByb3dzLnB1c2goPGRpdiBjbGFzcz1cImdyaWQtcm93XCI+e2NlbGxzfTwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1nbGFzc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1iYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwbGF5ZXItbmFtZVwiPlBsYXllciAxPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+4p2k77iPPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWVcIj57bGl2ZXMoKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS1pY29uXCI+4pqhPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtbGFiZWxcIj5zcGVlZDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlXCI+e3NwZWVkKCl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtaWNvblwiPvCfkqM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY29yZS12YWx1ZVwiPntib21icygpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLWljb25cIj7wn46vPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NvcmUtdmFsdWVcIj57cmFuZ2UoKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtZ3JpZFwiPntyb3dzfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCwgY3JlYXRlRWZmZWN0IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHlcIjtcbmltcG9ydCBDaGF0UGxheWVycyBmcm9tIFwiLi4vY29tcG9uZW50cy9jaGF0XCI7XG5cbmxldCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gY3JlYXRlU2lnbmFsKHt9KTtcbmV4cG9ydCB7IHNldFN0YXRlcyB9O1xuXG5sZXQgcm9vbUlkRWwgPSA8cD5Sb29tIElEOiA8L3A+O1xubGV0IHBsYXllcnNFbCA9IDxwPlBsYXllcnM6ICAvIDQ8L3A+O1xubGV0IHRleHRFbCA9IDxwPjwvcD47XG5sZXQgdGltZXJFbCA9IDxwPlRpbWVyOiA8L3A+O1xuXG5jcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHMgPSBzdGF0ZXMoKTtcbiAgICByb29tSWRFbC50ZXh0Q29udGVudCA9IGBSb29tIElEOiAke3Mucm9vbUlkfWA7XG4gICAgcGxheWVyc0VsLnRleHRDb250ZW50ID0gYFBsYXllcnM6ICR7cy5wbGF5ZXJzQ291bnR9IC8gNGA7XG4gICAgdGV4dEVsLnRleHRDb250ZW50ID0gcy50ZXh0IHx8IFwiXCI7XG5cbiAgICBpZiAocy5nYW1lU3RhcnRlZCkge1xuICAgICAgICB0aW1lckVsLnRleHRDb250ZW50ID0gXCJUaW1lcjogR2FtZSBzdGFydGVkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGltZXJUZXh0ID0gKCFzLnNlY29uZHNMZWZ0KSA/IFwiV2FpdGluZyBmb3Igb25lIG1vcmUgcGxheWVyXCIgOiBgJHtzLnNlY29uZHNMZWZ0fSBzZWNvbmRzYDtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IGBUaW1lcjogJHt0aW1lclRleHR9YDtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gTG9iYnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbmF0aW5lci1sb2JieVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYmJ5LWJveFwiPlxuICAgICAgICAgICAgICAgIDxoMT5Mb2JieTwvaDE+XG4gICAgICAgICAgICAgICAge3Jvb21JZEVsfVxuICAgICAgICAgICAgICAgIHtwbGF5ZXJzRWx9XG4gICAgICAgICAgICAgICAge3RleHRFbH1cbiAgICAgICAgICAgICAgICB7dGltZXJFbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPENoYXRQbGF5ZXJzIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuY29uc3QgcmVwbGF5QnRuID0gPGJ1dHRvbiBjbGFzcz1cInJlcGxheS1idXR0b25cIj5QbGF5IEFnYWluPC9idXR0b24+O1xuXG5yZXBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5sZXQgbWVudUVsID0gKFxuICAgIDxkaXYgY2xhc3M9XCJtZW51LWJveFwiPlxuICAgICAgICA8aDE+8J+OiSBZb3UgV2luITwvaDE+XG4gICAgICAgIDxwPkFsbCBvdGhlciBwbGF5ZXJzIGhhdmUgbGVmdCB0aGUgZ2FtZS48L3A+XG4gICAgICAgIHtyZXBsYXlCdG59XG4gICAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZW51KCkge1xuICAgIHJldHVybiBtZW51RWw7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUgfHwgbmlja25hbWUubGVuZ3RoID4gMjApIHJldHVybjtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcIm5pY2tuYW1lX29mX3RoZV9wbGF5ZXJcIixcbiAgICAgICAgICAgIG5pY2tuYW1lOiBuaWNrbmFtZVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgb25TdWJtaXQ9e3BsYXllckVudGVyfT5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5pY2tuYW1lLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVudGVyIHlvdXIgbmFtZVwiIG1heGxlbmd0aD1cIjIwXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyLWJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuICAgICAgICB0aGlzLm11c2ljID0gbmV3IEF1ZGlvKHNyYyk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5pY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgdGhpcy5tdXNpYy5sb29wID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NOYW1lID0gXCJzb3VuZC1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9mZlwiKTtcbiAgICAgICAgdGhpcy5idXR0b24uYXBwZW5kKHRoaXMuaWNvbik7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuYnV0dG9uKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMucGxheSgpLCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5tdXNpYy5wbGF5KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMudXBkYXRlQnV0dG9uKCkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5tdXNpYy5wYXVzZWQgfHwgdGhpcy5tdXNpYy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpYy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJUdXJuIHNvdW5kIG9uXCIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUJ1dHRvbigpIHtcbiAgICAgICAgY29uc3QgaXNNdXRlZCA9IHRoaXMubXVzaWMubXV0ZWQgfHwgdGhpcy5tdXNpYy5wYXVzZWQ7XG5cbiAgICAgICAgdGhpcy5pY29uLmNsYXNzTmFtZSA9IGlzTXV0ZWQgPyBcImZhLXNvbGlkIGZhLXZvbHVtZS1vZmZcIiA6IFwiZmEtc29saWQgZmEtdm9sdW1lLWhpZ2hcIjtcbiAgICAgICAgdGhpcy5idXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImlzLW11dGVkXCIsIGlzTXV0ZWQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291bmQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwL2FwcC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwidHlwZSIsInByb3BzIiwiY2hpbGRyZW4iLCJlbGUiLCJkb2N1bWVudCIsImtleSIsInN0YXJ0c1dpdGgiLCJldmVudE5hbWUiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldEF0dHJpYnV0ZSIsImZsYXRDaGlsZHJlbiIsImZsYXQiLCJJbmZpbml0eSIsImFwcGVuZCIsImZpbHRlciIsImNoaWxkIiwidW5kZWZpbmVkIiwicmVuZGVyIiwiZWxlbWVudCIsImNvbnRhaW5lciIsInJlcGxhY2VDaGlsZHJlbiIsIlJvdXRlciIsInJvdXRlciIsImVmZmVjdFN0YWNrIiwiYWN0aXZlRWZmZWN0IiwiY3JlYXRlU2lnbmFsIiwiaW5pdGlhbFZhbHVlIiwidmFsdWUiLCJlZmZlY3RzIiwiU2V0IiwiUmVhZCIsImFkZCIsIldyaXRlIiwibmV3VmFsdWUiLCJmbiIsImZvckVhY2giLCJlZmZlY3QiLCJjcmVhdGVFZmZlY3QiLCJwdXNoIiwicG9wIiwibGVuZ3RoIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInVybCIsIlVSTCIsImhyZWYiLCJsaXN0ZW4iLCJvbkVycm9yNDA0IiwiZXZlbnQiLCJkZXN0aW5hdGlvbiIsImludGVyY2VwdCIsImNvbnNvbGUiLCJsb2ciLCJSZWdpc3RlciIsIkdhbWUiLCJNZW51IiwiTG9iYnkiLCJzZXRTdGF0ZXMiLCJTb3VuZCIsInNldE1lc3NhZ2VzIiwicm9vdCIsImdldEVsZW1lbnRCeUlkIiwid3NzIiwiV2ViU29ja2V0Iiwic291bmQiLCJpbml0IiwiYm9keSIsImNsYXNzTmFtZSIsImFsZXJ0Iiwid3MiLCJtZXNzYWdlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsInF1ZXJ5U2VsZWN0b3IiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJzZWNvbmRzTGVmdCIsInRleHQiLCJncmlkIiwicHJldiIsImVyciIsIm1lc3NhZ2VzIiwiQ2hhdFBsYXllcnMiLCJtZXNzYWdlc0NvbnRhaW5lciIsImNsYXNzIiwibXNncyIsImlubmVySFRNTCIsIm1zZyIsInAiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInVuc2hpZnQiLCJicm9hZGNhc3RNZXNzYWdlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInRhcmdldCIsImdldCIsInRyaW0iLCJyZXNldCIsInNlbmQiLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIm1heGxlbmd0aCIsIlRJTEVfU0laRSIsImltYWdlcyIsImxpdmVzIiwic2V0TGl2ZXMiLCJzcGVlZCIsInNldFNwZWVkIiwiYm9tYnMiLCJzZXRCb21icyIsInJhbmdlIiwic2V0UmFuZ2UiLCJyb3dzIiwicm93SW5kZXgiLCJjZWxscyIsImNvbEluZGV4IiwiY2VsbCIsInN0eWxlIiwic3RhdGVzIiwicm9vbUlkRWwiLCJwbGF5ZXJzRWwiLCJ0ZXh0RWwiLCJ0aW1lckVsIiwicyIsImdhbWVTdGFydGVkIiwidGltZXJUZXh0IiwicmVwbGF5QnRuIiwicmVsb2FkIiwibWVudUVsIiwicGxheWVyRW50ZXIiLCJjdXJyZW50VGFyZ2V0Iiwibmlja25hbWUiLCJjb25zdHJ1Y3RvciIsInNyYyIsIm11c2ljIiwiQXVkaW8iLCJidXR0b24iLCJpY29uIiwibG9vcCIsInZvbHVtZSIsInRvZ2dsZSIsInBsYXkiLCJvbmNlIiwidXBkYXRlQnV0dG9uIiwidGhlbiIsImNhdGNoIiwicGF1c2VkIiwibXV0ZWQiLCJpc011dGVkIiwiY2xhc3NMaXN0Il0sInNvdXJjZVJvb3QiOiIifQ==