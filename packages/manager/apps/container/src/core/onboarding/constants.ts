export const ONBOARDING_STATUS_ENUM = {
  DISPLAYED: 'DISPLAYED', // widget has been displayed but the user didn't interact with it
  STARTED: 'STARTED', // the user has started the onboarding
  CLOSED: 'CLOSED', // the user has closed the widget
  DONE: 'DONE', // the user has closed the widget
};

export const MAX_DISPLAY_COUNT = 3;
export const MINIMUM_TIME_INTERVAL_IN_MS = 86400000; //24h

export const ONBOARDING_OPENED_STATE_ENUM = {
  CLOSED: 'CLOSED', // the widget is closed nothing is displayed
  WELCOME: 'WELCOME', // the button and the welcome button is shown
  WALKME: 'WALKME', // the onboarding has started
} as const;

export type OnboardingOpenedStatusEnum = typeof ONBOARDING_OPENED_STATE_ENUM;
export type OnboardingStatusEnum = typeof ONBOARDING_STATUS_ENUM;
