export function renderSystem(world, dt, now, animRows) {
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
