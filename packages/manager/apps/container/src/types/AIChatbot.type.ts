export interface AIChatbotConfig {
  locale: string;
  linkPolicy: string;
  onClose?: () => void;
  onTracking?: (event: string) => void;
}

export interface AIChatbotInstance {
  unmount: () => void;
}

export interface AIChatbotModule {
  render: (container: HTMLElement, options: AIChatbotConfig) => AIChatbotInstance;
}
