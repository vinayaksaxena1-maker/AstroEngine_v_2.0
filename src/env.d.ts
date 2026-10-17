/// <reference types="vite/client" />

declare module '*?url' {
  const url: string;
  export default url;
}

declare module '*.wasm' {
  const url: string;
  export default url;
}

interface ImportMeta {
  env: Record<string, any>;
}
