export const ONBOARDING_STATUS_ENUM = {
  DISPLAYED: 'DISPLAYED', // widget has been displayed but the user didn't interact with it
  STARTED: 'STARTED', // the user has started the onboarding
  CLOSED: 'CLOSED', // the user has closed the widget
  DONE: 'DONE', // the user has closed the widget
};

export const ONBOARDING_OPENED_STATE_ENUM = {
  CLOSED: 'CLOSED', // the widget is closed nothing is displayed
  BUTTON: 'BUTTON', // only the button must be shown
  WELCOME: 'WELCOME', // the button and the welcome button is shown
  WALKME: 'WALKME', // the onboarding has started
};

export default {
  ONBOARDING_STATUS_ENUM,
  ONBOARDING_OPENED_STATE_ENUM,
};
