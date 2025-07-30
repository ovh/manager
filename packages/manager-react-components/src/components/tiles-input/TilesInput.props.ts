export type TilesInputProps<T, S = void> = {
  id?: (() => string) | string;
  items: T[];
  value: T | null;
  onInput: (value: T) => void;
  label: (item: T) => JSX.Element | string;
  tileClass?: {
    active?: string;
    inactive?: string;
  };
  stack?: {
    by: (item: T) => S;
    label: (stack: S, items: T[]) => JSX.Element | string;
    title: (stack: S, items: T[]) => JSX.Element | string;
    value?: S;
    onChange?: (stack: S) => void;
  };
};

export type TilesInputState<T, S> = {
  stacks: Map<S | undefined, T[]>;
  selectedStack: S | undefined;
  activeClass: string;
  inactiveClass: string;
};
