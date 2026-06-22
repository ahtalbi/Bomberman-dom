# Bomberman DOM

A multiplayer Bomberman-style game built with pure DOM rendering, a custom mini-framework, and WebSockets — no canvas, no WebGL, no external frontend frameworks.

Up to 4 players join a lobby, pick nicknames, and battle on a fixed grid until only one remains.

---

## Features

- 2–4 player real-time multiplayer via WebSockets
- Nickname registration with per-room duplicate checks
- Lobby player counter with automatic countdown logic
- In-lobby chat
- Fixed 17×17 Bomberman grid with walls, floors, and randomly generated destructible blocks
- Four corner spawn positions with protected safe zones
- Server-authoritative movement with collision detection
- Bomb placement, timed explosions, chain destruction, and player damage
- 3 lives per player — last player standing wins
- Power-ups: speed boost, extra bombs, and increased flame range
- Winner and kicked-player screens
- AFK/background-tab detection and kick
- Background music and sound effects
- HUD displaying lives, bomb count, and speed
- 60fps render loop via `requestAnimationFrame`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, native `http`, `ws`, `dotenv` |
| Frontend | Custom mini-framework (DOM, reactivity, routing), JSX via Babel/Webpack |
| Rendering | DOM elements, CSS, sprite sheets, `requestAnimationFrame` |
| Networking | WebSockets on port `5000` |
| Architecture | Entity-Component-System (ECS) on the client |

---

## Project Structure

```
.
├── instructions.md              # Original project requirements
├── README.md
├── backend
│   ├── index.js                 # HTTP and WebSocket server entry point
│   ├── package.json
│   ├── .env                     # Port configuration (default: 5000)
│   └── utils
│       ├── static.js            # Serves frontend files and assets
│       ├── websocket.js         # Routes incoming WebSocket messages
│       ├── rooms_handler.js     # Manages all active rooms
│       ├── room_handler.js      # Single-room lobby/game lifecycle
│       ├── game_engine.js       # Server-side game loop, bombs, power-ups
│       ├── gameState.js         # Player state, movement, and damage helpers
│       ├── map.js               # Grid layout and random block generation
│       ├── player.js            # Player model
│       └── helpers.js           # Shared utilities
└── frontend
    ├── index.html
    ├── style.css
    ├── webpack.config.js
    ├── dist/script.js           # Bundled frontend output
    ├── mini-framework           # Custom DOM/router/reactivity framework
    │   ├── dom.js
    │   ├── mini-framework.js
    │   ├── reactivity.js
    │   └── router.js
    ├── assets                   # Sprites, sounds, blocks, scenes, power-ups
    └── src
        ├── app/app.js           # Frontend app and WebSocket event handling
        ├── pages
        │   ├── register.jsx     # Nickname entry page
        │   ├── lobby.jsx        # Waiting room with player counter and chat
        │   ├── game.jsx         # Main game rendering page
        │   ├── menu.jsx         # Main menu
        │   ├── WinMenu.jsx      # Winner announcement screen
        │   └── KickedMenu.jsx   # AFK kick notification screen
        ├── components/chat.jsx  # Lobby chat component
        ├── utils/sound.js       # Background music helper
        └── ecs                  # Client-side entity/component game layer
            ├── components.js
            ├── game.js
            ├── world.js
            ├── game/
            │   ├── constants.js
            │   ├── entities.js
            │   ├── hud.js
            │   ├── input.js
            │   ├── lifecycle.js
            │   ├── playerName.js
            │   └── remoteHandlers.js
            └── systems/
                ├── bombSystem.js
                ├── damageSystem.js
                ├── powerUpSystem.js
                └── renderSystem.js
```

---

## Getting Started

**Requirements:** Node.js and npm

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies and build

```bash
cd ../frontend
npm install
npm run build
```

### 3. Start the server

```bash
cd ../backend
npm run dev
```

Then open your browser and navigate to `http://localhost:5000`.

---

## How to Play

### Controls

| Action | Keys |
|---|---|
| Move | Arrow keys, `WASD`, or `ZQSD` |
| Drop bomb | `Space` |

### Game Flow

1. **Register** — Enter a nickname (max 20 characters).
2. **Lobby** — Wait for 2–4 players. Chat with others while you wait.
3. **Countdown** — A 10-second countdown starts once enough players are ready.
4. **Battle** — Place bombs, destroy blocks, collect power-ups, and eliminate opponents.
5. **Win** — The last player with lives remaining wins.

### Lobby Timer Logic

| Players in room | Behavior |
|---|---|
| 1 | Wait for more players |
| 2–3 | 20-second timer starts; if it ends before 4 players join, a 10-second start countdown begins |
| 4 | 10-second start countdown begins immediately |

---

## Map

The grid is a fixed 17×17 layout. Cell types:

| Value | Type | Destroyable |
|---|---|---|
| `0` | Protected floor (spawn corners) | No |
| `2` | Normal floor | No |
| `3` | Solid wall | No |
| `4` | Destructible block | Yes |

Destructible blocks are randomly distributed across allowed floor cells at game start. Player spawn corners are always kept clear.

---

## Power-Ups

Power-ups may drop when a destructible block is destroyed.

| Power-Up | Effect |
|---|---|
| 💣 Bombs | +1 bomb that can be placed simultaneously |
| 🔥 Flames | +1 range to explosion in all four directions |
| ⚡ Speed | Temporarily increases movement speed |

---

## Architecture

### Custom Mini-Framework

The frontend is built on a hand-rolled framework in `frontend/mini-framework/`:

- **`dom.js`** — DOM creation and manipulation utilities
- **`reactivity.js`** — Reactive state that automatically updates the DOM on change
- **`router.js`** — Client-side routing between register, lobby, and game pages
- **`mini-framework.js`** — Core entry point that ties everything together

JSX syntax is compiled by Babel and bundled with Webpack, but there is no external frontend framework (no React, Vue, Angular, etc.).

### Client-Side ECS

The game client uses an Entity-Component-System (ECS) pattern in `frontend/src/ecs/`:

- **Entities** — Game objects (players, bombs, explosions, power-ups) identified by unique IDs
- **Components** — Data containers for position, sprite, health, bomb count, speed, etc.
- **Systems** — Per-frame logic processors:
  - `renderSystem.js` — Updates DOM element positions and styles
  - `bombSystem.js` — Handles bomb countdown visuals and explosion animations
  - `damageSystem.js` — Manages invincibility frames and life loss
  - `powerUpSystem.js` — Applies power-up effects to player entities

The game loop runs via `requestAnimationFrame` targeting 60fps.

### Server-Side Authority

All game state is owned by the server:

- Movement is validated and collision-checked before being broadcast
- Bomb placement, explosions, and block destruction are computed server-side
- Power-up spawns and pickups are confirmed server-side
- Player elimination and win conditions are determined server-side

---

## WebSocket Message Reference

### Client → Server

| Message | Description |
|---|---|
| `nickname_of_the_player` | Join a room with a chosen nickname |
| `chat_message` | Send a lobby chat message |
| `MOVE_STATE` | Send movement direction and moving state |
| `DROP_BOMB` | Request bomb placement at current position |
| `POWERUP_PICKED` | Notify server of local power-up collection |
| `leave_room` | Leave the current room |

### Server → Client

| Message | Description |
|---|---|
| `lobby_update` | Room ID, player count, timer, and lobby status text |
| `lobby_reset` | Reset lobby after a player leaves |
| `game_started` | Initial map grid and player positions |
| `chat_message` | Broadcast chat message to all room members |
| `player_moved` | Authoritative player position update |
| `bomb_dropped` | Create a bomb on the frontend |
| `explosion_checked` | Remove bomb, trigger explosion, update map and power-ups |
| `player_damaged` | Update player lives and alive status |
| `powerup_picked` | Remove power-up from map, update player stats |
| `player_turned_heart` | Remove eliminated player from the board |
| `game_won` | Display the winner screen |
| `error` | Validation or game error message |