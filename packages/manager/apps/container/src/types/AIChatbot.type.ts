export interface AIChatbotConfig {
  baseUrl: string;
  locale: string;
  envIsProd: boolean;
  linkPolicy: string;
  onClose: () => void;
  onTracking: (event: AIChatbotTrackingEvent) => void;
}

export interface AIChatbotTrackingEvent {
  action: string;
  category?: string;
  name?: string;
  value?: string | number;
}

export type AIChatbotSetupFunction = (
  element: HTMLElement,
  options: { configuration: AIChatbotConfig },
) => void | (() => void);
