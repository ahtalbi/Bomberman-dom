// /src/ecs/world.js

export class World {
    constructor() {
        this.nextEntityId = 0;
        this.entities = new Set();
        this.components = new Map(); 
        this.systems = [];
    }

    createEntity() {
        const entity = this.nextEntityId++;
        this.entities.add(entity);
        return entity;
    }

    destroyEntity(entity) {
        this.entities.delete(entity);
        for (const [componentName, componentMap] of this.components.entries()) {
            componentMap.delete(entity);
        }
    }

    addComponent(entity, componentName, componentData = {}) {
        if (!this.components.has(componentName)) {
            this.components.set(componentName, new Map());
        }
        this.components.get(componentName).set(entity, componentData);
    }

    getComponent(entity, componentName) {
        const componentMap = this.components.get(componentName);
        return componentMap ? componentMap.get(entity) : undefined;
    }

    removeComponent(entity, componentName) {
        const componentMap = this.components.get(componentName);
        if (componentMap) {
            componentMap.delete(entity);
        }
    }

    query(...componentNames) {
        if (componentNames.length === 0) return [];
        
        const firstMap = this.components.get(componentNames[0]);
        if (!firstMap) return [];
        
        const results = [];
        for (const entity of firstMap.keys()) {
            let hasAll = true;
            for (let i = 1; i < componentNames.length; i++) {
                const map = this.components.get(componentNames[i]);
                if (!map || !map.has(entity)) {
                    hasAll = false;
                    break;
                }
            }
            if (hasAll && this.entities.has(entity)) {
                results.push(entity);
            }
        }
        return results;
    }

    addSystem(systemFunction) {
        this.systems.push(systemFunction);
    }

    update(dt, now) {
        for (const system of this.systems) {
            system(this, dt, now);
        }
    }
}