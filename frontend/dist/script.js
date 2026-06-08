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
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Game"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Room ID: ", roomId), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Players: ", playersCount));
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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");

function Lobby({
  roomId,
  playersCount,
  secondsLeft,
  text,
  gameStarted
}) {
  const timerText = secondsLeft === null || secondsLeft === undefined ? "Waiting for one more player" : `${secondsLeft} seconds`;
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Lobby"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Room ID: ", roomId), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Players: ", playersCount, " / 4"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, text), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Timer: ", gameStarted ? "Game started" : timerText));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Lobby);

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
    if (!nickname) return;
    wss.send(JSON.stringify({
      type: "nickname_of_the_player",
      nickname: nickname
    }));
  };
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    onSubmit: playerEnter
  }, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    name: "nickname",
    placeholder: "eneter your name"
  }), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "submit"
  }, "start playing"));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Register);

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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/app/app.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mini-framework/dom */ "./mini-framework/dom.js");
/* harmony import */ var _mini_framework_mini_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mini-framework/mini-framework */ "./mini-framework/mini-framework.js");
/* harmony import */ var _pages_register__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pages/register */ "./src/pages/register.jsx");
/* harmony import */ var _pages_lobby__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pages/lobby */ "./src/pages/lobby.jsx");
/* harmony import */ var _pages_game__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../pages/game */ "./src/pages/game.jsx");





const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");
_mini_framework_mini_framework__WEBPACK_IMPORTED_MODULE_1__["default"].on("/", () => {
  console.log("/ we are in this route");
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
  console.log("Received:", message);
  if (message.type === "room_update" || message.type === "lobby_timer") {
    (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_lobby__WEBPACK_IMPORTED_MODULE_3__["default"], {
      roomId: message.roomId,
      playersCount: message.playersCount,
      secondsLeft: message.secondsLeft,
      text: message.text
    }), root);
  }
  if (message.type === "game_started") {
    (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.render)((0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pages_game__WEBPACK_IMPORTED_MODULE_4__["default"], {
      roomId: message.roomId,
      playersCount: message.playersCount
    }), root);
  }
});
wss.addEventListener("error", err => {
  console.log("Error", err);
});
wss.addEventListener("close", () => {
  console.log("Closed");
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (wss);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VSxHQUFHLEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yZWdpc3Rlci5qc3giLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgICNSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICNGaXJzdFJlc29sdmUgPSBmYWxzZTtcblxuICAgIG9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy4jUm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFxuICAgIG5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSA9IFwicHVzaFwiIH0gPSB7fSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBcIi9cIiArIHBhdGg7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzb2x2ZShwYXRoID0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbcGF0aF07XG5cbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm4oeyB1cmw6IG5ldyBVUkwobG9jYXRpb24uaHJlZikgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxpc3RlbihvbkVycm9yNDA0KSB7XG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5pbnRlcmNlcHQoe1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLnBhdGhuYW1lLCB0aGlzLiNSb3V0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3VybC5wYXRobmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I0MDQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbih7IHVybCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNGaXJzdFJlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdGhpcy4jRmlyc3RSZXNvbHZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuZnVuY3Rpb24gR2FtZSh7IHJvb21JZCwgcGxheWVyc0NvdW50IH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGgxPkdhbWU8L2gxPlxuICAgICAgICAgICAgPHA+Um9vbSBJRDoge3Jvb21JZH08L3A+XG4gICAgICAgICAgICA8cD5QbGF5ZXJzOiB7cGxheWVyc0NvdW50fTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuZnVuY3Rpb24gTG9iYnkoeyByb29tSWQsIHBsYXllcnNDb3VudCwgc2Vjb25kc0xlZnQsIHRleHQsIGdhbWVTdGFydGVkIH0pIHtcbiAgICBjb25zdCB0aW1lclRleHQgPSBzZWNvbmRzTGVmdCA9PT0gbnVsbCB8fCBzZWNvbmRzTGVmdCA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gXCJXYWl0aW5nIGZvciBvbmUgbW9yZSBwbGF5ZXJcIlxuICAgICAgICA6IGAke3NlY29uZHNMZWZ0fSBzZWNvbmRzYDtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aDE+TG9iYnk8L2gxPlxuICAgICAgICAgICAgPHA+Um9vbSBJRDoge3Jvb21JZH08L3A+XG4gICAgICAgICAgICA8cD5QbGF5ZXJzOiB7cGxheWVyc0NvdW50fSAvIDQ8L3A+XG4gICAgICAgICAgICA8cD57dGV4dH08L3A+XG4gICAgICAgICAgICA8cD5UaW1lcjoge2dhbWVTdGFydGVkID8gXCJHYW1lIHN0YXJ0ZWRcIiA6IHRpbWVyVGV4dH08L3A+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIikudHJpbSgpO1xuXG4gICAgICAgIGlmICghbmlja25hbWUpIHJldHVybjtcblxuICAgICAgICB3c3Muc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiBcIm5pY2tuYW1lX29mX3RoZV9wbGF5ZXJcIixcbiAgICAgICAgICAgIG5pY2tuYW1lOiBuaWNrbmFtZVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3BsYXllckVudGVyfT5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuaWNrbmFtZVwiIHBsYWNlaG9sZGVyPVwiZW5ldGVyIHlvdXIgbmFtZVwiIC8+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5zdGFydCBwbGF5aW5nPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHJlbmRlciB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL21pbmktZnJhbWV3b3JrXCI7XG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSBcIi4uL3BhZ2VzL3JlZ2lzdGVyXCI7XG5pbXBvcnQgTG9iYnkgZnJvbSBcIi4uL3BhZ2VzL2xvYmJ5XCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vcGFnZXMvZ2FtZVwiO1xuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0OjUwMDBcIik7XG5cbnJvdXRlci5vbihcIi9cIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiLyB3ZSBhcmUgaW4gdGhpcyByb3V0ZVwiKTtcbiAgICBcbiAgICByZW5kZXIoPFJlZ2lzdGVyIHdzcz17d3NzfSAvPiwgcm9vdCk7XG59KTtcblxucm91dGVyLmxpc3RlbigoKSA9PiB7YWxlcnQoXCI0MDRcIil9KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICh3cykgPT4ge1xuICAgIFxufSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkOlwiLCBtZXNzYWdlKTtcblxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IFwicm9vbV91cGRhdGVcIiB8fCBtZXNzYWdlLnR5cGUgPT09IFwibG9iYnlfdGltZXJcIikge1xuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgICA8TG9iYnlcbiAgICAgICAgICAgICAgICByb29tSWQ9e21lc3NhZ2Uucm9vbUlkfVxuICAgICAgICAgICAgICAgIHBsYXllcnNDb3VudD17bWVzc2FnZS5wbGF5ZXJzQ291bnR9XG4gICAgICAgICAgICAgICAgc2Vjb25kc0xlZnQ9e21lc3NhZ2Uuc2Vjb25kc0xlZnR9XG4gICAgICAgICAgICAgICAgdGV4dD17bWVzc2FnZS50ZXh0fVxuICAgICAgICAgICAgLz4sXG4gICAgICAgICAgICByb290XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gXCJnYW1lX3N0YXJ0ZWRcIikge1xuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgICA8R2FtZVxuICAgICAgICAgICAgICAgIHJvb21JZD17bWVzc2FnZS5yb29tSWR9XG4gICAgICAgICAgICAgICAgcGxheWVyc0NvdW50PXttZXNzYWdlLnBsYXllcnNDb3VudH1cbiAgICAgICAgICAgIC8+LFxuICAgICAgICAgICAgcm9vdFxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yXCIsIGVycik7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZWRcIik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgd3NzO1xuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwicHJvcHMiLCJjaGlsZHJlbiIsImVsZSIsImRvY3VtZW50Iiwia2V5Iiwic3RhcnRzV2l0aCIsImV2ZW50TmFtZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwiZmxhdENoaWxkcmVuIiwiZmxhdCIsIkluZmluaXR5IiwiYXBwZW5kIiwiZmlsdGVyIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJyZW5kZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwicmVwbGFjZUNoaWxkcmVuIiwiUm91dGVyIiwicm91dGVyIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImZuIiwidXJsIiwiVVJMIiwiaHJlZiIsImxpc3RlbiIsIm9uRXJyb3I0MDQiLCJldmVudCIsImRlc3RpbmF0aW9uIiwiaW50ZXJjZXB0IiwiY29uc29sZSIsImxvZyIsIkdhbWUiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJMb2JieSIsInNlY29uZHNMZWZ0IiwidGV4dCIsImdhbWVTdGFydGVkIiwidGltZXJUZXh0IiwiUmVnaXN0ZXIiLCJ3c3MiLCJwbGF5ZXJFbnRlciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJjdXJyZW50VGFyZ2V0Iiwibmlja25hbWUiLCJnZXQiLCJ0cmltIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJvblN1Ym1pdCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsInJvb3QiLCJnZXRFbGVtZW50QnlJZCIsIldlYlNvY2tldCIsImFsZXJ0Iiwid3MiLCJtZXNzYWdlIiwicGFyc2UiLCJkYXRhIiwiZXJyIl0sInNvdXJjZVJvb3QiOiIifQ==