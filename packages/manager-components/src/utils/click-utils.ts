import { MouseEventHandler, KeyboardEvent } from 'react';

/**
 * Assign the function passed to the onClick event handler
 * as welll as the onKeyDown event handler when using the keys Space or Enter
 */
export const handleClick = (fn: (ev: Event) => void) => ({
  onClick: fn as unknown as MouseEventHandler,
  onKeyDown: (event: KeyboardEvent) => {
    if ([' ', 'Enter'].includes(event.key)) {
      fn(event as unknown as Event);
    }
  },
});

export default handleClick;
