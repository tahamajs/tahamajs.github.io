// src/react-shim.js
// Bridge between esbuild ESM imports and the React 18 UMD global.

const R = window.React;

export default R;

// Named re-exports — esbuild needs these statically analyzable.
export const {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  useLayoutEffect,
  useContext,
  useImperativeHandle,
  useDebugValue,
  useDeferredValue,
  useTransition,
  useId,
  useSyncExternalStore,
  createContext,
  createElement,
  cloneElement,
  isValidElement,
  Children,
  Fragment,
  StrictMode,
  Suspense,
  forwardRef,
  memo,
  lazy,
} = R;
