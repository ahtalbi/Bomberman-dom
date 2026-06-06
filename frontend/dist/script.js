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
  gameStarted
}) {
  const timerText = secondsLeft === null || secondsLeft === undefined ? "Waiting for one more player" : `${secondsLeft} seconds`;
  return (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Lobby"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Room ID: ", roomId), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Players: ", playersCount, " / 4"), (0,_mini_framework_dom__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Timer: ", gameStarted ? "Game started" : timerText));
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
    const nickname = formData.get("nickname");
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
      secondsLeft: message.secondsLeft
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFLLENBQUNsQyxLQUFLLENBQUNtQyxJQUFJLENBQUM7RUFDdENoQyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxXQUFXLEVBQUU2QixPQUFPLENBQUM7RUFFakMsSUFBSUEsT0FBTyxDQUFDN0UsSUFBSSxLQUFLLGFBQWEsSUFBSTZFLE9BQU8sQ0FBQzdFLElBQUksS0FBSyxhQUFhLEVBQUU7SUFDbEVtQiwyREFBTSxDQUNGcEIsa0VBQUEsQ0FBQ3FELG9EQUFLO01BQ0ZGLE1BQU0sRUFBRTJCLE9BQU8sQ0FBQzNCLE1BQU87TUFDdkJDLFlBQVksRUFBRTBCLE9BQU8sQ0FBQzFCLFlBQWE7TUFDbkNFLFdBQVcsRUFBRXdCLE9BQU8sQ0FBQ3hCO0lBQVksQ0FDcEMsQ0FBQyxFQUNGbUIsSUFDSixDQUFDO0VBQ0w7RUFFQSxJQUFJSyxPQUFPLENBQUM3RSxJQUFJLEtBQUssY0FBYyxFQUFFO0lBQ2pDbUIsMkRBQU0sQ0FDRnBCLGtFQUFBLENBQUNrRCxtREFBSTtNQUNEQyxNQUFNLEVBQUUyQixPQUFPLENBQUMzQixNQUFPO01BQ3ZCQyxZQUFZLEVBQUUwQixPQUFPLENBQUMxQjtJQUFhLENBQ3RDLENBQUMsRUFDRnFCLElBQ0osQ0FBQztFQUNMO0FBQ0osQ0FBQyxDQUFDO0FBRUZmLEdBQUcsQ0FBQy9DLGdCQUFnQixDQUFDLE9BQU8sRUFBR3NFLEdBQUcsSUFBSztFQUNuQ2pDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLE9BQU8sRUFBRWdDLEdBQUcsQ0FBQztBQUM3QixDQUFDLENBQUM7QUFFRnZCLEdBQUcsQ0FBQy9DLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO0VBQ2hDcUMsT0FBTyxDQUFDQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQUVGLGlFQUFlUyxHQUFHLEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9taW5pLWZyYW1ld29yay9kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvbWluaS1mcmFtZXdvcmsuanMiLCJ3ZWJwYWNrOi8vLy4vbWluaS1mcmFtZXdvcmsvcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9nYW1lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbG9iYnkuanN4Iiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yZWdpc3Rlci5qc3giLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUoeyAuLi4ocHJvcHMgfHwge30pLCBjaGlsZHJlbiB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMgfHwge30pIHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwib25cIikgJiYgdHlwZW9mIHByb3BzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0ga2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrZXksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmxhdENoaWxkcmVuID0gY2hpbGRyZW4uZmxhdChJbmZpbml0eSk7XG4gICAgZWxlLmFwcGVuZCguLi5mbGF0Q2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSBudWxsICYmIGNoaWxkICE9PSB1bmRlZmluZWQgJiYgY2hpbGQgIT09IGZhbHNlKSk7XG5cbiAgICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oZWxlbWVudCk7XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyOyIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgICNSb3V0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICNGaXJzdFJlc29sdmUgPSBmYWxzZTtcblxuICAgIG9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy4jUm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFxuICAgIG5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSA9IFwicHVzaFwiIH0gPSB7fSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBcIi9cIiArIHBhdGg7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm5hdmlnYXRlKHBhdGgsIHsgaGlzdG9yeSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzb2x2ZShwYXRoID0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0aGlzLiNSb3V0ZXNbcGF0aF07XG5cbiAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm4oeyB1cmw6IG5ldyBVUkwobG9jYXRpb24uaHJlZikgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxpc3RlbihvbkVycm9yNDA0KSB7XG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5pbnRlcmNlcHQoe1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLnBhdGhuYW1lLCB0aGlzLiNSb3V0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGhpcy4jUm91dGVzW3VybC5wYXRobmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I0MDQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbih7IHVybCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNGaXJzdFJlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdGhpcy4jRmlyc3RSZXNvbHZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuZnVuY3Rpb24gR2FtZSh7IHJvb21JZCwgcGxheWVyc0NvdW50IH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGgxPkdhbWU8L2gxPlxuICAgICAgICAgICAgPHA+Um9vbSBJRDoge3Jvb21JZH08L3A+XG4gICAgICAgICAgICA8cD5QbGF5ZXJzOiB7cGxheWVyc0NvdW50fTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9kb21cIjtcblxuZnVuY3Rpb24gTG9iYnkoeyByb29tSWQsIHBsYXllcnNDb3VudCwgc2Vjb25kc0xlZnQsIGdhbWVTdGFydGVkIH0pIHtcbiAgICBjb25zdCB0aW1lclRleHQgPSBzZWNvbmRzTGVmdCA9PT0gbnVsbCB8fCBzZWNvbmRzTGVmdCA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gXCJXYWl0aW5nIGZvciBvbmUgbW9yZSBwbGF5ZXJcIlxuICAgICAgICA6IGAke3NlY29uZHNMZWZ0fSBzZWNvbmRzYDtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aDE+TG9iYnk8L2gxPlxuICAgICAgICAgICAgPHA+Um9vbSBJRDoge3Jvb21JZH08L3A+XG4gICAgICAgICAgICA8cD5QbGF5ZXJzOiB7cGxheWVyc0NvdW50fSAvIDQ8L3A+XG4gICAgICAgICAgICA8cD5UaW1lcjoge2dhbWVTdGFydGVkID8gXCJHYW1lIHN0YXJ0ZWRcIiA6IHRpbWVyVGV4dH08L3A+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9iYnk7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uLy4uL21pbmktZnJhbWV3b3JrL2RvbVwiO1xuXG5mdW5jdGlvbiBSZWdpc3Rlcih7IHdzcyB9KSB7XG4gICAgbGV0IHBsYXllckVudGVyID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IG5pY2tuYW1lID0gZm9ybURhdGEuZ2V0KFwibmlja25hbWVcIik7XG5cbiAgICAgICAgd3NzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdHlwZTogXCJuaWNrbmFtZV9vZl90aGVfcGxheWVyXCIsXG4gICAgICAgICAgICBuaWNrbmFtZTogbmlja25hbWVcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXtwbGF5ZXJFbnRlcn0+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmlja25hbWVcIiBwbGFjZWhvbGRlcj1cImVuZXRlciB5b3VyIG5hbWVcIiAvPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+c3RhcnQgcGxheWluZzwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RlcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCByZW5kZXIgfSBmcm9tIFwiLi4vLi4vbWluaS1mcmFtZXdvcmsvZG9tXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi8uLi9taW5pLWZyYW1ld29yay9taW5pLWZyYW1ld29ya1wiO1xuaW1wb3J0IFJlZ2lzdGVyIGZyb20gXCIuLi9wYWdlcy9yZWdpc3RlclwiO1xuaW1wb3J0IExvYmJ5IGZyb20gXCIuLi9wYWdlcy9sb2JieVwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL3BhZ2VzL2dhbWVcIjtcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmNvbnN0IHdzcyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo1MDAwXCIpO1xuXG5yb3V0ZXIub24oXCIvXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIi8gd2UgYXJlIGluIHRoaXMgcm91dGVcIik7XG4gICAgXG4gICAgcmVuZGVyKDxSZWdpc3RlciB3c3M9e3dzc30gLz4sIHJvb3QpO1xufSk7XG5cbnJvdXRlci5saXN0ZW4oKCkgPT4ge2FsZXJ0KFwiNDA0XCIpfSk7XG5cbndzcy5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCAod3MpID0+IHtcbiAgICBcbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgY29uc29sZS5sb2coXCJSZWNlaXZlZDpcIiwgbWVzc2FnZSk7XG5cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSBcInJvb21fdXBkYXRlXCIgfHwgbWVzc2FnZS50eXBlID09PSBcImxvYmJ5X3RpbWVyXCIpIHtcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgICAgPExvYmJ5XG4gICAgICAgICAgICAgICAgcm9vbUlkPXttZXNzYWdlLnJvb21JZH1cbiAgICAgICAgICAgICAgICBwbGF5ZXJzQ291bnQ9e21lc3NhZ2UucGxheWVyc0NvdW50fVxuICAgICAgICAgICAgICAgIHNlY29uZHNMZWZ0PXttZXNzYWdlLnNlY29uZHNMZWZ0fVxuICAgICAgICAgICAgLz4sXG4gICAgICAgICAgICByb290XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gXCJnYW1lX3N0YXJ0ZWRcIikge1xuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgICA8R2FtZVxuICAgICAgICAgICAgICAgIHJvb21JZD17bWVzc2FnZS5yb29tSWR9XG4gICAgICAgICAgICAgICAgcGxheWVyc0NvdW50PXttZXNzYWdlLnBsYXllcnNDb3VudH1cbiAgICAgICAgICAgIC8+LFxuICAgICAgICAgICAgcm9vdFxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG53c3MuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yXCIsIGVycik7XG59KTtcblxud3NzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZWRcIik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgd3NzO1xuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwicHJvcHMiLCJjaGlsZHJlbiIsImVsZSIsImRvY3VtZW50Iiwia2V5Iiwic3RhcnRzV2l0aCIsImV2ZW50TmFtZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwiZmxhdENoaWxkcmVuIiwiZmxhdCIsIkluZmluaXR5IiwiYXBwZW5kIiwiZmlsdGVyIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJyZW5kZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwicmVwbGFjZUNoaWxkcmVuIiwiUm91dGVyIiwicm91dGVyIiwiUm91dGVzIiwiT2JqZWN0IiwiY3JlYXRlIiwiRmlyc3RSZXNvbHZlIiwib24iLCJwYXRoIiwiaGFuZGxlciIsIm5hdmlnYXRlIiwiaGlzdG9yeSIsIm5hdmlnYXRpb24iLCJyZXNvbHZlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImZuIiwidXJsIiwiVVJMIiwiaHJlZiIsImxpc3RlbiIsIm9uRXJyb3I0MDQiLCJldmVudCIsImRlc3RpbmF0aW9uIiwiaW50ZXJjZXB0IiwiY29uc29sZSIsImxvZyIsIkdhbWUiLCJyb29tSWQiLCJwbGF5ZXJzQ291bnQiLCJMb2JieSIsInNlY29uZHNMZWZ0IiwiZ2FtZVN0YXJ0ZWQiLCJ0aW1lclRleHQiLCJSZWdpc3RlciIsIndzcyIsInBsYXllckVudGVyIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImN1cnJlbnRUYXJnZXQiLCJuaWNrbmFtZSIsImdldCIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5Iiwib25TdWJtaXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJyb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJXZWJTb2NrZXQiLCJhbGVydCIsIndzIiwibWVzc2FnZSIsInBhcnNlIiwiZGF0YSIsImVyciJdLCJzb3VyY2VSb290IjoiIn0=