export function setupInput() {
    const input = this.world.getComponent(this.localPlayerEntity, 'Input');
    if (!input) return;

    const getKeyDirection = (key) => {
        if (key === 'ArrowUp' || key === 'w' || key === 'Z' || key === 'z') return 'up';
        if (key === 'ArrowDown' || key === 's' || key === 'S') return 'down';
        if (key === 'ArrowLeft' || key === 'a' || key === 'Q' || key === 'q') return 'left';
        if (key === 'ArrowRight' || key === 'd' || key === 'D') return 'right';
        return null;
    };

    const handleKeyDown = (e) => {
        const dir = getKeyDirection(e.key);
        if (dir && input) {
            e.preventDefault();
            if (!input.inputQueue.includes(dir)) {
                input.inputQueue.unshift(dir);
            }
            this.sendInput(input);
        }

        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            this.dropBomb();
        }
    };

    const handleKeyUp = (e) => {
        const dir = getKeyDirection(e.key);
        if (dir && input) {
            input.inputQueue = input.inputQueue.filter(d => d !== dir);
            this.sendInput(input);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    this.removeInputListeners = () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
}

export function sendInput(input) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    if (this.localPlayerEntity === null) return;

    const player = this.world.getComponent(this.localPlayerEntity, 'Player');
    if (!player || !player.alive) return;

    const direction = input.inputQueue[0] || null;
    const isMoving = Boolean(direction);
    const inputState = `${direction || 'idle'}:${isMoving ? 1 : 0}`;

    if (this.lastInputSent === inputState) return;
    this.lastInputSent = inputState;

    this.socket.send(JSON.stringify({
        type: 'MOVE_STATE',
        payload: { direction, isMoving }
    }));
}

export function dropBomb() {
    if (this.localPlayerEntity === null) return;

    const player = this.world.getComponent(this.localPlayerEntity, 'Player');
    if (!player || !player.alive) return;

    const currentBombs = this.world.query('Position', 'Bomb').filter(bEntity => {
        return this.world.getComponent(bEntity, 'Bomb').ownerId === player.id;
    });

    if (currentBombs.length >= player.maxBombs) return;

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
            type: 'DROP_BOMB',
            payload: {}
        }));
    }
}
