/**
 * Utility functions for WillPayment DOM events
 * Centralizes DOM manipulation for better testability
 */

const EVENT_BUS_ID = 'will-payment-event-bus';
const SAVE_PAYMENT_METHOD_EVENT = 'GO_SAVE_PAYMENT_METHOD';
const REGISTERED_PM_EVENT = 'WP::USER_ACTION::REGISTERED_PM_SELECTED';

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
 * Sets up listener for registered payment method selection
 * @param handler - Function to handle the event
 * @returns cleanup function to remove the listener
 */
export const setupRegisteredPaymentMethodListener = (
  handler: (event: CustomEvent) => void,
): (() => void) | null => {
  const eventBus = document.getElementById(EVENT_BUS_ID);
  if (!eventBus) {
    return null;
  }

  const eventHandler = (event: Event) => {
    handler(event as CustomEvent);
  };

  eventBus.addEventListener(REGISTERED_PM_EVENT, eventHandler);

  // Return cleanup function
  return () => {
    eventBus.removeEventListener(REGISTERED_PM_EVENT, eventHandler);
  };
};
