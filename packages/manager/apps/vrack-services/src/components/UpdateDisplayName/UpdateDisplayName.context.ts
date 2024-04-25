import React from 'react';

export type UpdateDisplayNameContextType = {
  hiddenMessages: number[];
  hideMessage: (submittedAt: number) => void;
};

export const UpdateDisplayNameContext = React.createContext<
  UpdateDisplayNameContextType
>({
  hiddenMessages: [],
  hideMessage: () => undefined,
});
