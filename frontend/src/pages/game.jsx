import { createElement } from "../../mini-framework/dom";
import { createSignal, createEffect } from "../../mini-framework/reactivity";

export const TILE_SIZE = 48;
const GRID_BORDER_SIZE = 6;

const images = {
    2: "./assets/blocks/block_floor.jpg",
    3: "./assets/blocks/block_wall.png",
    4: "./assets/blocks/block_exploit.png",
};

const [playerName, setPlayerName] = createSignal("Player 1");
const [lives, setLives] = createSignal(3);
const [speed, setSpeed] = createSignal(1);
const [bombs, setBombs] = createSignal(1);
const [range, setRange] = createSignal(1);
export { setPlayerName, setLives, setSpeed, setBombs, setRange };

const nameEl = <span class="player-name"></span>;

createEffect(() => { nameEl.textContent = playerName(); });

const livesEl = <span class="score-value lives-value"></span>;
const speedEl = <span class="score-value speed-value"></span>;
const bombsEl = <span class="score-value bombs-value"></span>;
const rangeEl = <span class="score-value range-value"></span>;

createEffect(() => { livesEl.textContent = lives(); });
createEffect(() => { speedEl.textContent = speed(); });
createEffect(() => { bombsEl.textContent = bombs(); });
createEffect(() => { rangeEl.textContent = range(); });

function Game({ grid }) {
    const boardWidth = grid[0].length * TILE_SIZE;
    const boardHeight = grid.length * TILE_SIZE;
    const boardOuterWidth = boardWidth + GRID_BORDER_SIZE * 2;
    const boardOuterHeight = boardHeight + GRID_BORDER_SIZE * 2;
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

            cells.push(<div class={className} data-x={colIndex} data-y={rowIndex} style={style}></div>);
        }
        rows.push(<div class="grid-row">{cells}</div>);
    }

    return (
        <div class="game-container">
            <div class="game-glass">
                <div class="score-bar">
                    {nameEl}
                    <div class="score-stats">
                        <div class="score-item">
                            <span class="score-icon">Lives</span>
                            {livesEl}
                        </div>
                        <div class="score-item">
                            <span class="score-icon">Speed</span>
                            {speedEl}
                        </div>
                        <div class="score-item">
                            <span class="score-icon">Bombs</span>
                            {bombsEl}
                        </div>
                        <div class="score-item">
                            <span class="score-icon">Range</span>
                            {rangeEl}
                        </div>
                    </div>
                </div>
                <div class="game-board-frame" style={`width:${boardOuterWidth}px;height:${boardOuterHeight}px;`}>
                    <div
                        id="game-container"
                        class="game-grid"
                        style={`position:relative;width:${boardWidth}px;height:${boardHeight}px;`}
                    >
                        {rows}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;
