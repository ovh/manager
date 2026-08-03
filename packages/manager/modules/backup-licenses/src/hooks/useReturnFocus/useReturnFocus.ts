import { useCallback } from 'react';

/**
 * Gives keyboard focus back to the control that opened a route-driven overlay.
 *
 * The trigger is named by id rather than captured from `document.activeElement`: the row menu closes
 * as the overlay opens, and a menu item that is no longer displayed cannot take focus back. The call
 * is deferred by one task because a modal `<dialog>` makes the rest of the document inert — the
 * trigger becomes focusable again only once the dialog has left the DOM.
 */
export const useReturnFocus = (triggerId: string) =>
  useCallback(() => {
    window.setTimeout(() => document.getElementById(triggerId)?.focus(), 0);
  }, [triggerId]);
