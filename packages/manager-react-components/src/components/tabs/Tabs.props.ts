export type TProps<Item> = {
  items?: Item[];
  titleElement?: ({
    item,
    isSelected,
  }: {
    item: Item;
    isSelected?: boolean;
  }) => JSX.Element;
  contentElement?: ({ item }: { item: Item }) => JSX.Element;
  className?: string;
  onChange?: (item: Item) => void;
  TitleComponent?: ({
    item,
    isSelected,
  }: {
    item: Item;
    isSelected?: boolean;
  }) => JSX.Element | string;
  ContentComponent?: ({ item }: { item: Item }) => JSX.Element;
};
