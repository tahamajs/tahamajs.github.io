// src/react-dom-client-shim.js
const RDC = {
  createRoot: (container, options) => window.ReactDOM.createRoot(container, options),
  hydrateRoot: (container, element) => window.ReactDOM.hydrateRoot(container, element),
};
export default RDC;
export const { createRoot, hydrateRoot } = RDC;
