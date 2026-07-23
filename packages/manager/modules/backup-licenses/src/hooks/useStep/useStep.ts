import { useState } from 'react';

/**
 * État d'une étape du stepper vertical (BKP-1208).
 * Recopié de `apps/pci-workflow/src/pages/new/hooks/useStep.ts` — non exporté par un
 * package partagé, cf. spec §6.
 */
export interface StepState {
  isOpen: boolean;
  isChecked: boolean;
  isLocked: boolean;
}

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
