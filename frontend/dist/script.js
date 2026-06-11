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
        roomId: message.roomId,
        playersCount: message.playersCount
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

function Game({
  roomId,
  playersCount
}) {
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "game-box"
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Game"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Room ID: ", roomId), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Players: ", playersCount));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvZG9tLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL21pbmktZnJhbWV3b3JrL3JlYWN0aXZpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NoYXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZW51LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcmVnaXN0ZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy9zb3VuZC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImNvbnN0IGVmZmVjdFN0YWNrID0gW107XG5sZXQgYWN0aXZlRWZmZWN0ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbChpbml0aWFsVmFsdWUpIHtcbiAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgIGNvbnN0IGVmZmVjdHMgPSBuZXcgU2V0KCk7XG5cbiAgIGNvbnN0IFJlYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICAgICBlZmZlY3RzLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgfVxuXG4gICBjb25zdCBXcml0ZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICBsZXQgZm4gPSBuZXdWYWx1ZTtcbiAgICAgICAgIHZhbHVlID0gZm4odmFsdWUpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4gZWZmZWN0KCkpO1xuICAgfVxuXG4gICByZXR1cm4gW1JlYWQsIFdyaXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChlZmZlY3QpIHtcbiAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcbiAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcbiAgIGVmZmVjdCgpO1xuICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xufSIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgICNSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICNGaXJzdFJlc29sdmUgPSBmYWxzZTtcblxuICAgIG9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy4jUm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFxuICAgIG5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSA9IFwicHVzaFwiIH0gPSB7fSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBcIi9cIiArIHBhdGg7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzb2x2ZShwYXRoID0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbcGF0aF07XG5cbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm4oeyB1cmw6IG5ldyBVUkwobG9jYXRpb24uaHJlZikgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxpc3RlbihvbkVycm9yNDA0KSB7XG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5pbnRlcmNlcHQoe1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLnBhdGhuYW1lLCB0aGlzLiNSb3V0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3VybC5wYXRobmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I0MDQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbih7IHVybCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNGaXJzdFJlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdGhpcy4jRmlyc3RSZXNvbHZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgcmVuZGVyIH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmtcIjtcbmltcG9ydCBSZWdpc3RlciBmcm9tIFwiLi4vcGFnZXMvcmVnaXN0ZXJcIjtcbmltcG9ydCBHYW1lIGZyb20gXCIuLi9wYWdlcy9nYW1lXCI7XG5pbXBvcnQgTWVudSBmcm9tIFwiLi4vcGFnZXMvbWVudVwiO1xuaW1wb3J0IExvYmJ5IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IHsgc2V0U3RhdGVzIH0gZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgU291bmQgZnJvbSBcIi4uL3V0aWxzL3NvdW5kXCI7XG5pbXBvcnQgeyBzZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2NoYXRcIjtcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo1MDAwXCIpO1xuY29uc3Qgc291bmQgPSBuZXcgU291bmQoXCIuL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9tdXNpYy5tcDNcIik7XG5cbnNvdW5kLmluaXQoKTtcblxucm91dGVyLm9uKFwiL1wiLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcInJlZ2lzdGVyLXBhZ2VcIjtcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7IGFsZXJ0KFwiNDA0XCIpIH0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKHdzKSA9PiB7XG5cbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInJvb21fdXBkYXRlXCI6XG4gICAgICAgIGNhc2UgXCJsb2JieV90aW1lclwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImxvYmJ5LXBhZ2VcIjtcbiAgICAgICAgICAgIGlmICghcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmNvbmF0aW5lci1sb2JieVwiKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcig8TG9iYnkgLz4sIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdGVzKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudDogbWVzc2FnZS5wbGF5ZXJzQ291bnQsXG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ6IG1lc3NhZ2Uuc2Vjb25kc0xlZnQsXG4gICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZS50ZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImdhbWVfc3RhcnRlZFwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcImdhbWUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxHYW1lIHJvb21JZD17bWVzc2FnZS5yb29tSWR9IHBsYXllcnNDb3VudD17bWVzc2FnZS5wbGF5ZXJzQ291bnR9IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicm9vbV9hbG9uZVwiOlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBcIm1lbnUtcGFnZVwiO1xuICAgICAgICAgICAgcmVuZGVyKDxNZW51IC8+LCByb290KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2hhdF9tZXNzYWdlXCI6XG4gICAgICAgICAgICBzZXRNZXNzYWdlcyhwcmV2ID0+IFsuLi5wcmV2ICxtZXNzYWdlLm1lc3NhZ2VdKTtcbiAgICB9XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvclwiLCBlcnIpO1xufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdzcztcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgd3NzIGZyb20gXCIuLi9hcHAvYXBwXCI7XG5cbmNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gY3JlYXRlU2lnbmFsKFtdKTtcbmV4cG9ydCB7IHNldE1lc3NhZ2VzIH07XG5cbmZ1bmN0aW9uIENoYXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IG1lc3NhZ2VzQ29udGFpbmVyID0gPGRpdiBjbGFzcz1cIm1lc3NhZ2VzXCI+PC9kaXY+O1xuXG4gICAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNncyA9IG1lc3NhZ2VzKCk7XG4gICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgbXNnIG9mIG1zZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHAudGV4dENvbnRlbnQgPSBtc2c7XG4gICAgICAgICAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG1lc3NhZ2VzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBtc2dzLnVuc2hpZnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBmb3JtRGF0YS5nZXQoXCJtZXNzYWdlXCIpLnRyaW0oKTtcblxuICAgICAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgZS50YXJnZXQucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9O1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwiY2hhdF9tZXNzYWdlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICB9KSk7XG4gICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzcz1cImNoYXRcIiBvblN1Ym1pdD17YnJvYWRjYXN0TWVzc2FnZX0+XG4gICAgICAgICAgICB7bWVzc2FnZXNDb250YWluZXJ9XG4gICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibWVzc2FnZVwiIHBsYWNlaG9sZGVyPVwidHlwZSB0byB0aGUgb3RoZXIgcGxheWVycyAuLi5cIiBtYXhsZW5ndGg9XCIyMFwiLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5zZW5kPC9idXR0b24+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhdFBsYXllcnM7IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuZnVuY3Rpb24gR2FtZSh7IHJvb21JZCwgcGxheWVyc0NvdW50IH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1ib3hcIj5cbiAgICAgICAgICAgIDxoMT5HYW1lPC9oMT5cbiAgICAgICAgICAgIDxwPlJvb20gSUQ6IHtyb29tSWR9PC9wPlxuICAgICAgICAgICAgPHA+UGxheWVyczoge3BsYXllcnNDb3VudH08L3A+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVTaWduYWwsIGNyZWF0ZUVmZmVjdCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9yZWFjdGl2aXR5XCI7XG5pbXBvcnQgQ2hhdFBsYXllcnMgZnJvbSBcIi4uL2NvbXBvbmVudHMvY2hhdFwiO1xuXG5sZXQgW3N0YXRlcywgc2V0U3RhdGVzXSA9IGNyZWF0ZVNpZ25hbCh7fSk7XG5leHBvcnQgeyBzZXRTdGF0ZXMgfTtcblxubGV0IHJvb21JZEVsID0gPHA+Um9vbSBJRDogPC9wPjtcbmxldCBwbGF5ZXJzRWwgPSA8cD5QbGF5ZXJzOiAgLyA0PC9wPjtcbmxldCB0ZXh0RWwgPSA8cD48L3A+O1xubGV0IHRpbWVyRWwgPSA8cD5UaW1lcjogPC9wPjtcblxuY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzID0gc3RhdGVzKCk7XG4gICAgcm9vbUlkRWwudGV4dENvbnRlbnQgPSBgUm9vbSBJRDogJHtzLnJvb21JZH1gO1xuICAgIHBsYXllcnNFbC50ZXh0Q29udGVudCA9IGBQbGF5ZXJzOiAke3MucGxheWVyc0NvdW50fSAvIDRgO1xuICAgIHRleHRFbC50ZXh0Q29udGVudCA9IHMudGV4dCB8fCBcIlwiO1xuXG4gICAgaWYgKHMuZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgdGltZXJFbC50ZXh0Q29udGVudCA9IFwiVGltZXI6IEdhbWUgc3RhcnRlZFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRpbWVyVGV4dCA9ICghcy5zZWNvbmRzTGVmdCkgPyBcIldhaXRpbmcgZm9yIG9uZSBtb3JlIHBsYXllclwiIDogYCR7cy5zZWNvbmRzTGVmdH0gc2Vjb25kc2A7XG4gICAgICAgIHRpbWVyRWwudGV4dENvbnRlbnQgPSBgVGltZXI6ICR7dGltZXJUZXh0fWA7XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIExvYmJ5KCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb25hdGluZXItbG9iYnlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2JieS1ib3hcIj5cbiAgICAgICAgICAgICAgICA8aDE+TG9iYnk8L2gxPlxuICAgICAgICAgICAgICAgIHtyb29tSWRFbH1cbiAgICAgICAgICAgICAgICB7cGxheWVyc0VsfVxuICAgICAgICAgICAgICAgIHt0ZXh0RWx9XG4gICAgICAgICAgICAgICAge3RpbWVyRWx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxDaGF0UGxheWVycyAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYmJ5OyIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmNvbnN0IHJlcGxheUJ0biA9IDxidXR0b24gY2xhc3M9XCJyZXBsYXktYnV0dG9uXCI+UGxheSBBZ2FpbjwvYnV0dG9uPjtcblxucmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbG9jYXRpb24ucmVsb2FkKCk7XG59KTtcblxubGV0IG1lbnVFbCA9IChcbiAgICA8ZGl2IGNsYXNzPVwibWVudS1ib3hcIj5cbiAgICAgICAgPGgxPvCfjokgWW91IFdpbiE8L2gxPlxuICAgICAgICA8cD5BbGwgb3RoZXIgcGxheWVycyBoYXZlIGxlZnQgdGhlIGdhbWUuPC9wPlxuICAgICAgICB7cmVwbGF5QnRufVxuICAgIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVudSgpIHtcbiAgICByZXR1cm4gbWVudUVsO1xufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5cbmZ1bmN0aW9uIFJlZ2lzdGVyKHsgd3NzIH0pIHtcbiAgICBsZXQgcGxheWVyRW50ZXIgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgbmlja25hbWUgPSBmb3JtRGF0YS5nZXQoXCJuaWNrbmFtZVwiKS50cmltKCk7XG5cbiAgICAgICAgaWYgKCFuaWNrbmFtZSB8fCBuaWNrbmFtZS5sZW5ndGggPiAyMCkgcmV0dXJuO1xuXG4gICAgICAgIHdzcy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6IFwibmlja25hbWVfb2ZfdGhlX3BsYXllclwiLFxuICAgICAgICAgICAgbmlja25hbWU6IG5pY2tuYW1lXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBvblN1Ym1pdD17cGxheWVyRW50ZXJ9PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmlja25hbWUtaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW50ZXIgeW91ciBuYW1lXCIgbWF4bGVuZ3RoPVwiMjBcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmVnaXN0ZXItYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPnN0YXJ0IHBsYXlpbmc8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XG4iLCJjbGFzcyBTb3VuZCB7XG4gICAgY29uc3RydWN0b3Ioc3JjKSB7XG4gICAgICAgIHRoaXMubXVzaWMgPSBuZXcgQXVkaW8oc3JjKTtcbiAgICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcblxuICAgICAgICB0aGlzLm11c2ljLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNDtcblxuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc05hbWUgPSBcInNvdW5kLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb2ZmXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5hcHBlbmQodGhpcy5pY29uKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGUoKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5idXR0b24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wbGF5KCksIHsgb25jZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLm11c2ljLnBsYXkoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVCdXR0b24oKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnVwZGF0ZUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11c2ljLnBhdXNlZCB8fCB0aGlzLm11c2ljLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLm11c2ljLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVHVybiBzb3VuZCBvZmZcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIlR1cm4gc291bmQgb25cIik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQnV0dG9uKCkge1xuICAgICAgICBjb25zdCBpc011dGVkID0gdGhpcy5tdXNpYy5tdXRlZCB8fCB0aGlzLm11c2ljLnBhdXNlZDtcblxuICAgICAgICB0aGlzLmljb24uY2xhc3NOYW1lID0gaXNNdXRlZCA/IFwiZmEtc29saWQgZmEtdm9sdW1lLW9mZlwiIDogXCJmYS1zb2xpZCBmYS12b2x1bWUtaGlnaFwiO1xuICAgICAgICB0aGlzLmJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtbXV0ZWRcIiwgaXNNdXRlZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VuZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAvYXBwLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwicHJvcHMiLCJjaGlsZHJlbiIsImVsZSIsImRvY3VtZW50Iiwia2V5Iiwic3RhcnRzV2l0aCIsImV2ZW50TmFtZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwiZmxhdENoaWxkcmVuIiwiZmxhdCIsIkluZmluaXR5IiwiYXBwZW5kIiwiZmlsdGVyIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJyZW5kZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwicmVwbGFjZUNoaWxkcmVuIiwiUm91dGVyIiwicm91dGVyIiwiZWZmZWN0U3RhY2siLCJhY3RpdmVFZmZlY3QiLCJjcmVhdGVTaWduYWwiLCJpbml0aWFsVmFsdWUiLCJ2YWx1ZSIsImVmZmVjdHMiLCJTZXQiLCJSZWFkIiwiYWRkIiwiV3JpdGUiLCJuZXdWYWx1ZSIsImZuIiwiZm9yRWFjaCIsImVmZmVjdCIsImNyZWF0ZUVmZmVjdCIsInB1c2giLCJwb3AiLCJsZW5ndGgiLCJSb3V0ZXMiLCJPYmplY3QiLCJjcmVhdGUiLCJGaXJzdFJlc29sdmUiLCJvbiIsInBhdGgiLCJoYW5kbGVyIiwibmF2aWdhdGUiLCJoaXN0b3J5IiwibmF2aWdhdGlvbiIsInJlc29sdmUiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwidXJsIiwiVVJMIiwiaHJlZiIsImxpc3RlbiIsIm9uRXJyb3I0MDQiLCJldmVudCIsImRlc3RpbmF0aW9uIiwiaW50ZXJjZXB0IiwiY29uc29sZSIsImxvZyIsIlJlZ2lzdGVyIiwiR2FtZSIsIk1lbnUiLCJMb2JieSIsInNldFN0YXRlcyIsIlNvdW5kIiwic2V0TWVzc2FnZXMiLCJyb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3c3MiLCJXZWJTb2NrZXQiLCJzb3VuZCIsImluaXQiLCJib2R5IiwiY2xhc3NOYW1lIiwiYWxlcnQiLCJ3cyIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwicXVlcnlTZWxlY3RvciIsInJvb21JZCIsInBsYXllcnNDb3VudCIsInNlY29uZHNMZWZ0IiwidGV4dCIsInByZXYiLCJlcnIiLCJtZXNzYWdlcyIsIkNoYXRQbGF5ZXJzIiwibWVzc2FnZXNDb250YWluZXIiLCJjbGFzcyIsIm1zZ3MiLCJpbm5lckhUTUwiLCJtc2ciLCJwIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJ1bnNoaWZ0IiwiYnJvYWRjYXN0TWVzc2FnZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJ0YXJnZXQiLCJnZXQiLCJ0cmltIiwicmVzZXQiLCJzZW5kIiwic3RyaW5naWZ5Iiwib25TdWJtaXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJtYXhsZW5ndGgiLCJzdGF0ZXMiLCJyb29tSWRFbCIsInBsYXllcnNFbCIsInRleHRFbCIsInRpbWVyRWwiLCJzIiwiZ2FtZVN0YXJ0ZWQiLCJ0aW1lclRleHQiLCJyZXBsYXlCdG4iLCJyZWxvYWQiLCJtZW51RWwiLCJwbGF5ZXJFbnRlciIsImN1cnJlbnRUYXJnZXQiLCJuaWNrbmFtZSIsImNvbnN0cnVjdG9yIiwic3JjIiwibXVzaWMiLCJBdWRpbyIsImJ1dHRvbiIsImljb24iLCJsb29wIiwidm9sdW1lIiwidG9nZ2xlIiwicGxheSIsIm9uY2UiLCJ1cGRhdGVCdXR0b24iLCJ0aGVuIiwiY2F0Y2giLCJwYXVzZWQiLCJtdXRlZCIsImlzTXV0ZWQiLCJjbGFzc0xpc3QiXSwic291cmNlUm9vdCI6IiJ9