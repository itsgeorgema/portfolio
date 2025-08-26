type ResetListener = () => void;

const resetListeners = new Set<ResetListener>();

export function addResetListener(listener: ResetListener) {
  resetListeners.add(listener);
}

export function removeResetListener(listener: ResetListener) {
  resetListeners.delete(listener);
}

export function triggerCarReset() {
  for (const listener of resetListeners) {
    listener();
  }
}
