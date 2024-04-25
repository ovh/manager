/* eslint-disable import/prefer-default-export */
import React from 'react';

export const handleClick = (
  fn: React.KeyboardEventHandler & React.MouseEventHandler,
) => ({
  onClick: fn,
  onKeyDown: (event: React.KeyboardEvent) => {
    if ([' ', 'Enter'].includes(event.key)) {
      fn(event as React.KeyboardEvent & React.MouseEvent);
    }
  },
});
