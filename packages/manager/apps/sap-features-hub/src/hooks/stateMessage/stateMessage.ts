import { useState } from 'react';

export const useStateMessage = () => {
  const [stateMessage, setStateMessage] = useState<string>(undefined);

  const clearMessage = () => {
    if (stateMessage !== undefined) {
      setStateMessage(undefined);
    }
  };

  return {
    stateMessage,
    setStateMessage,
    clearMessage,
  };
};
