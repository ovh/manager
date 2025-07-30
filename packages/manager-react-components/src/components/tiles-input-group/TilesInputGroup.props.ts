import { TilesInputProps } from '../tiles-input/TilesInput.props';

export type TilesInputGroupProps<T, S = void, G = void> = TilesInputProps<
  T,
  S
> & {
  group?: {
    by: (item: T) => G;
    label: (group: G, items: T[]) => JSX.Element | string;
    value?: G;
    showAllTab: boolean;
    onChange?: (group: G) => void;
  };
};

export type TilesInputGroupState<S, G> = {
  selectedGroup: G | undefined;
  selectedStack: S | undefined;
};
