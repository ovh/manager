import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { clsx } from 'clsx';
import { v4 as uuidV4 } from 'uuid';
import { OdsIcon, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { hashCode } from '../../../utils';

type TProps<Item> = {
  id?: string;
  items?: Item[];
  itemKey?: (item: Item) => string;
  titleElement?: (item: Item, isSelected?: boolean) => JSX.Element | string;
  contentElement?: (item: Item) => JSX.Element;
  mobileBreakPoint?: number;
  className?: string;
  onChange?: (item: Item) => void;
};

type TState<Item> = {
  items: Item[];
  selectedItem?: Item;
};

export function TabsComponent<Item>({
  id = uuidV4(),
  items = [],
  itemKey,
  titleElement = (item) => <div>{`title ${item}`}</div>,
  contentElement = (item) => <div>{`content ${item}`}</div>,
  mobileBreakPoint,
  className,
  onChange,
}: TProps<Item>): JSX.Element {
  const [state, setState] = useState<TState<Item>>({
    items,
    selectedItem: items?.[0],
  });

  const setSelectedItem = (item: Item): void => {
    setState((prev) => ({
      ...prev,
      selectedItem: item,
    }));
  };

  const uniqKey = (item: Item): string =>
    itemKey ? itemKey(item) : `${hashCode(item)}`;

  useEffect(() => {
    if (
      Array.isArray(items) &&
      items.length &&
      (items.length !== state.items.length ||
        items.some((item, index) => !Object.is(item, state.items[index])))
    ) {
      setState(() => ({
        items,
        selectedItem: items[0],
      }));
    }
  }, [items]);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(state.selectedItem);
    }
  }, [state.selectedItem]);

  const isDesktop = useMedia(`(min-width: ${mobileBreakPoint || 760}px)`);

  return (
    <>
      {isDesktop ? (
        <section
          className={clsx('rounded-sm flex flex-col', className)}
          data-testid="desktop"
        >
          <ul
            className="flex flex-row list-none p-0 m-0 w-full"
            data-testid="titles"
          >
            {state.items.map((item) => (
              <li
                key={`tabs-${id}title-${uniqKey(item)}`}
                className={clsx(
                  'px-4 py-4 cursor-pointer border border-solid border-[--ods-color-primary-100] rounded-t-lg',
                  item === state.selectedItem
                    ? 'border-b-0 bg-[--ods-color-primary-050]'
                    : 'border-b bg-white',
                )}
              >
                <button
                  className="border-0 bg-transparent cursor-pointer w-full"
                  onClick={() => setSelectedItem(item)}
                  onKeyDown={() => setSelectedItem(item)}
                >
                  {titleElement(item, item === state.selectedItem)}
                </button>
              </li>
            ))}
            <li
              key={'none'}
              className="border-0 border-b border-solid border-b-[--ods-color-primary-100] w-full"
            ></li>
          </ul>
          <div className="bg-[--ods-color-primary-050] border border-solid border-[--ods-color-primary-100] border-t-0">
            {contentElement(state.selectedItem)}
          </div>
        </section>
      ) : (
        <section
          className={clsx('grid gap-6 grid-cols-1', className)}
          data-testid="mobile"
        >
          {state.items.map((item) => (
            <div
              key={`tabs-${id}title-${uniqKey(item)}`}
              className="px-2 bg-[--ods-color-primary-050] border border-solid border-[--ods-color-primary-100] rounded-lg"
            >
              <button
                className="flex cursor-pointer px-4 py-4 w-full border-0 bg-transparent"
                onClick={() => setSelectedItem(item)}
                onKeyDown={() => setSelectedItem(item)}
              >
                <div className="w-full">
                  <OdsText>
                    {titleElement(item, item === state.selectedItem)}
                  </OdsText>
                </div>
                <div className="w-fit flex items-center">
                  {!Object.is(state.selectedItem, item) ? (
                    <OdsIcon name={ODS_ICON_NAME.chevronDown}></OdsIcon>
                  ) : (
                    <OdsIcon name={ODS_ICON_NAME.chevronUp}></OdsIcon>
                  )}
                </div>
              </button>
              {Object.is(state.selectedItem, item) && (
                <div>{contentElement(item)}</div>
              )}
            </div>
          ))}
        </section>
      )}
    </>
  );
}

export default TabsComponent;
