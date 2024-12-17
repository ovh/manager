import React from 'react';
import { TileChoice } from './TileChoice.component';

interface Item {
  id: string;
  isDisabled?: boolean;
}

export interface TileInputChoiceProps<T extends Item> {
  items: T[];
  selectedItem?: T;
  onSelectItem?: (T: Item) => void;
  columnsCount?: 1 | 2 | 3 | 4 | 5 | 6;
  isSubmitted?: boolean;
  children: (item: T, isSelected: boolean) => JSX.Element;
}

export function TileInputChoice<T extends Item>({
  items,
  selectedItem,
  onSelectItem,
  columnsCount,
  isSubmitted,
  children: renderItem,
}: Readonly<TileInputChoiceProps<T>>) {
  return (
    <ul
      className="list-none grid gap-6 mx-0 px-0"
      style={{
        gridTemplateColumns: `repeat(${columnsCount || 3}, minmax(0, 1fr))`,
      }}
    >
      {isSubmitted && selectedItem && (
        <li key={selectedItem?.id}>
          <TileChoice isSelected isDisabled>
            {renderItem(selectedItem, true)}
          </TileChoice>
        </li>
      )}
      {!isSubmitted &&
        items.map((item) => (
          <li key={item.id}>
            <button
              className="appearance-none bg-transparent border-0 m-0 p-0 cursor-pointer text-left w-full h-full"
              disabled={item.isDisabled}
              onClick={() => onSelectItem?.(item)}
            >
              <TileChoice
                isSelected={selectedItem === item}
                isDisabled={item.isDisabled}
              >
                {renderItem(item, selectedItem === item)}
              </TileChoice>
            </button>
          </li>
        ))}
    </ul>
  );
}
