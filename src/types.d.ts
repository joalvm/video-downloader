/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_KEY: string;
      APP_PORT: string;
      TRUST_PROXY: string;
      // Añade aquí otras variables de entorno según sea necesario
      [key: string]: string | undefined;
    }
  }

  // Aquí puedes añadir tus propias interfaces globales o extender interfaces existentes
  // Por ejemplo:
  // interface Window {
  //   customProperty: string;
  // }
}

// Este export vacío es necesario para que TypeScript trate este archivo como un módulo
export {};
