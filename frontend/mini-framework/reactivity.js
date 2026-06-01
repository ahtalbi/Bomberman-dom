const effectStack = [];
let activeEffect = null;

export function createSignal(initialValue) {
   let value = initialValue;
   const effects = new Set();

   const Read = () => {
      if (activeEffect) {
         effects.add(activeEffect);
      }
      return value;
   }

   const Write = (newValue) => {
      value = newValue;
      effects.forEach(effect => effect());
   }

   return [Read, Write];
}

export function createEffect(effect) {
   effectStack.push(effect);
   activeEffect = effect;
   effect();
   effectStack.pop();
   activeEffect = effectStack[effectStack.length - 1] || null;
}