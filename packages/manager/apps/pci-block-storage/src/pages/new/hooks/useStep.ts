import { useState } from 'react';

export interface StepState {
  isOpen: boolean;
  isChecked: boolean;
  isLocked: boolean;
  isShown: boolean;
}

export type Step = StepState & {
  open: () => void;
  close: () => void;
  check: () => void;
  uncheck: () => void;
  lock: () => void;
  unlock: () => void;
  show: () => void;
  hide: () => void;
};

export function useStep(initialState?: Readonly<Partial<StepState>>): Step {
  const [isOpen, setIsOpen] = useState(!!initialState?.isOpen);
  const [isChecked, setIsChecked] = useState(!!initialState?.isChecked);
  const [isLocked, setIsLocked] = useState(!!initialState?.isLocked);
  const [isShown, setIsShown] = useState(
    initialState && 'isShown' in initialState ? initialState.isShown : true,
  );

  return {
    isOpen,
    isChecked,
    isLocked,
    isShown,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    check: () => setIsChecked(true),
    uncheck: () => setIsChecked(false),
    lock: () => setIsLocked(true),
    unlock: () => setIsLocked(false),
    show: () => setIsShown(true),
    hide: () => setIsShown(false),
  };
}
