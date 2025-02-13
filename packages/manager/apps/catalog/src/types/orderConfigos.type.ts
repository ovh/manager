export type ConfigoModuleFederationOptions = {
  // i18n?: any;
  subsidiary: string;
  language?: string;
  useLab?: boolean;
  usePreprod?: boolean;
  assets: {
    flagsPath: string;
  };
  orderId?: string;
  express?: {
    url?: string;
    backUrl?: string;
    openTarget?: '_blank' | '_self' | '_parent';
  };
  navbar?: {
    enable: boolean;
    backUrl?: string;
  };
  cart?: {
    enable: boolean;
    maxCollapsibleWidth?: number;
    stickyTopStyle?: number;
  };
};

export type ConfigoModuleFederationCallbacks = {
  error: (error: Error) => void;
  ready: () => void;
  update: () => void;
  navigation: () => void;
};

export type ConfigoNasHaModule = {
  default: (
    element: HTMLElement,
    config: {
      options: ConfigoModuleFederationOptions;
      callbacks: ConfigoModuleFederationCallbacks;
    },
  ) => void;
};
