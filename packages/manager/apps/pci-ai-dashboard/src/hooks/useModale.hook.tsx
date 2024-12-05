import { useQueryState } from './useQueryState.hook';

export const DEFAULT_OPEN_VALUE = 'true';

export interface ModalController {
  open: boolean;
  onOpenChange: (newValue: boolean) => void;
}
export function useModale(queryParamKey: string) {
  const [modalState, setModalState] = useQueryState(queryParamKey);

  const setOpen = (value = DEFAULT_OPEN_VALUE) => setModalState(value);
  const setClose = () => setModalState(undefined);
  const toggle = () => (modalState ? setClose() : setOpen());
  const isOpen = !!modalState;
  const controller: ModalController = {
    open: isOpen,
    onOpenChange: (newStatus: boolean) =>
      newStatus === false ? setClose() : null,
  };
  return {
    isOpen,
    value: modalState,
    open: setOpen,
    close: setClose,
    toggle,
    controller,
  };
}
