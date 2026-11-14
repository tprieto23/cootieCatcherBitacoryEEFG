export const FLAP_COUNT = 8;

// -1 is the start, just before flap 1. Positions inside the game are zero-based.
export function advance(position, steps) {
  return (position + steps) % FLAP_COUNT;
}

export const initialState = {
  position: -1,
  phase: 'idle',
  die: null,
  remaining: 0,
  discovered: [],
};

export function gameReducer(state, action) {
  switch (action.type) {
    case 'roll':
      if (!['idle', 'ready'].includes(state.phase)) return state;
      return { ...state, phase: 'rolling' };
    case 'land':
      if (state.phase !== 'rolling' || !Number.isInteger(action.value) || action.value < 1 || action.value > 6) return state;
      return { ...state, die: action.value, remaining: action.value, phase: 'moving' };
    case 'step':
      if (state.phase !== 'moving') return state;
      return {
        ...state,
        position: advance(state.position, 1),
        remaining: state.remaining - 1,
        phase: state.remaining === 1 ? 'ready' : 'moving',
      };
    case 'read':
      if (state.phase !== 'ready' || state.discovered.includes(state.position)) return state;
      return { ...state, discovered: [...state.discovered, state.position] };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}
