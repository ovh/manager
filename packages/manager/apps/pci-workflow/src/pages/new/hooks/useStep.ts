import { useState } from 'react';

export interface StepState {
  isOpen: boolean;
  isChecked: boolean;
  isLocked: boolean;
}

// @TODO move to manager-pci-common
export function useStep(initialState?: Readonly<Partial<StepState>>) {
  const [isOpen, setIsOpen] = useState(!!initialState?.isOpen);
  const [isChecked, setIsChecked] = useState(!!initialState?.isChecked);
  const [isLocked, setIsLocked] = useState(!!initialState?.isLocked);
  return {
    isOpen,
    isChecked,
    isLocked,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    check: () => setIsChecked(true),
    uncheck: () => setIsChecked(false),
    lock: () => setIsLocked(true),
    unlock: () => setIsLocked(false),
  };
}
