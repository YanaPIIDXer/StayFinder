/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_APP_GOOGLE_MAPS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
