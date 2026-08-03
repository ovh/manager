import { createContext, useContext } from 'react';

/** Raises the confirmation rendered by `CopyConfirmation`, the modal's own live region. */
export const CopyConfirmationContext = createContext<() => void>(() => undefined);

export const useCopyCredential = () => {
  const confirmCopy = useContext(CopyConfirmationContext);

  return (value: string) => {
    void navigator.clipboard.writeText(value).then(
      () => confirmCopy(),
      // A refused clipboard permission has no specified surface, so the confirmation simply stays away.
      () => undefined,
    );
  };
};
