// /src/ecs/components.js

export const PositionComponent = (gx, gy, tileSize = 64) => ({
    gridX: gx,
    gridY: gy,
    x: gx * tileSize,
    y: gy * tileSize,
    targetX: gx * tileSize,
    targetY: gy * tileSize
});

export const VelocityComponent = (baseSpeed = 2.5) => ({
    baseSpeed: baseSpeed,
    speed: baseSpeed,
    isMoving: false,
    direction: 'down'
});

export const InputComponent = () => ({
    inputQueue: []
});

export const RenderableComponent = (el, frameWidth = 64, frameHeight = 64, totalFrames = 4, fps = 12) => ({
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

export const PlayerComponent = (id, charType, isLocal = false) => ({
    id: id,
    charType: charType,
    isLocal: isLocal
});

export const BombComponent = (ownerId, timer = 2000, range = 4) => ({
    ownerId: ownerId,
    timer: timer,
    range: range,
    exploded: false
});

export const ExplosionComponent = (duration = 500) => ({
    duration: duration
});

export const PowerUpComponent = (type) => ({
    type: type, 
    pickedUp: false
});

export const BehaviorComponent = () => ({
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
