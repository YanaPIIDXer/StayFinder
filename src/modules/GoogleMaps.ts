import { createClient } from "@google/maps";

const client = createClient({
  key: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
  Promise: Promise,
});

export default client;
