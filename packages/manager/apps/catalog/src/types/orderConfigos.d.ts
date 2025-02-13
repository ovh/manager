import {
  ConfigoModuleFederationCallbacks,
  ConfigoModuleFederationOptions,
} from './orderConfigos.type';

declare module 'order_fm/ConfigoNasHa' {
  export default function setupNasHa(
    element: HTMLElement,
    config: {
      options: ConfigoModuleFederationOptions;
      callbacks: ConfigoModuleFederationCallbacks;
    },
  ): void;
}
