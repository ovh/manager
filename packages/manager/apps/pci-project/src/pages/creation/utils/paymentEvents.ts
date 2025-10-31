/**
 * Utility functions for WillPayment DOM events
 * Centralizes DOM manipulation for better testability
 */

const EVENT_BUS_ID = 'will-payment-event-bus';
const SAVE_PAYMENT_METHOD_EVENT = 'GO_SAVE_PAYMENT_METHOD';
const NO_USER_ACTION_NEEDED_EVENT = 'WP::USER_ACTION::NO_USER_ACTION_NEEDED';
const REQUIRED_CHALLENGE_EVENT =
  'WP::USER_ACTION::DEFAULT_PAYMENT_METHOD_CHALLENGE_REQUIRED';
const SUBMIT_CHALLENGE_EVENT = 'WP::DEFAULT_PAYMENT_METHOD_CHALLENGE::SUBMIT';

/**
 * Triggers the save payment method event via DOM
 * @returns boolean indicating if the event was dispatched successfully
 */
export const triggerSavePaymentMethodEvent = (): boolean => {
  const eventBus = document.getElementById(EVENT_BUS_ID);
  if (eventBus) {
    eventBus.dispatchEvent(new CustomEvent(SAVE_PAYMENT_METHOD_EVENT));
    return true;
  }
  return false;
};

/**
 * Triggers the submit challenge event via DOM
 * @returns boolean indicating if the event was dispatched successfully
 */
export const triggerSubmitChallengeEvent = (): boolean => {
  const eventBus = document.getElementById(EVENT_BUS_ID);
  if (eventBus) {
    eventBus.dispatchEvent(new CustomEvent(SUBMIT_CHALLENGE_EVENT));
    return true;
  }
  return false;
};

/**
 * Sets up listener for no user action needed event
 * @param handler - Function to handle the event
 * @returns cleanup function to remove the listener
 */
export const setupRequiredActionsMethodListener = (
  noUserActionNeededHandler: (event: CustomEvent) => void,
  challengeHandler: (event: CustomEvent) => void,
): (() => void) | null => {
  const eventBus = document.getElementById(EVENT_BUS_ID);
  if (!eventBus) {
    return null;
  }

  const noUserActionNeededEventHandler = (event: Event) => {
    noUserActionNeededHandler(event as CustomEvent);
  };
  const challengeEventHandler = (event: Event) => {
    challengeHandler(event as CustomEvent);
  };

  eventBus.addEventListener(
    NO_USER_ACTION_NEEDED_EVENT,
    noUserActionNeededEventHandler,
  );
  eventBus.addEventListener(REQUIRED_CHALLENGE_EVENT, challengeEventHandler);

  // Return cleanup function
  return () => {
    eventBus.removeEventListener(
      NO_USER_ACTION_NEEDED_EVENT,
      noUserActionNeededEventHandler,
    );
    eventBus.removeEventListener(
      REQUIRED_CHALLENGE_EVENT,
      challengeEventHandler,
    );
  };
};
