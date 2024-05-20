import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { clsx } from 'clsx';
import { v4 as uuidV4 } from 'uuid';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type TProps<Item> = {
  id?: string;
  items?: Item[];
  titleElement?: (item: Item, selected: boolean) => JSX.Element | string;
  contentElement?: (item: Item) => JSX.Element;
  mobileBreakPoint?: number;
  className?: string;
  onChange?: (item: Item) => void;
};

type TState<Item> = {
  items: { payload: Item; isOpen: boolean }[];
  selectedItem?: Item;
};

export const TabsComponent = function TabsComponent<Item>({
  id = uuidV4(),
  items = [],
  titleElement = (item, selected) => (
    <div className={selected && 'selected'}>{`title ${item}`}</div>
  ),
  contentElement = (item) => <div>{`content ${item}`}</div>,
  mobileBreakPoint,
  className,
  onChange,
}: TProps<Item>): JSX.Element {
  const [state, setState] = useState<TState<Item>>({
    selectedItem: undefined,
    items: [],
  });

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(state.selectedItem);
    }
  }, [state.selectedItem]);

  const toggle = (index: number) => {
    if (index >= 0 && index < state.items.length) {
      setState((prev) => ({
        ...prev,
        items: prev.items.map((item, i) => ({
          ...item,
          isOpen: index === i ? !item.isOpen : item.isOpen,
        })),
      }));
    }
  };

  const isDesktop = useMedia(`(min-width: ${mobileBreakPoint || 760}px)`);

  useEffect(() => {
    if (Array.isArray(items) && items.length) {
      setState((prev) => ({
        ...prev,
        items: items.map((item) => ({ payload: item, isOpen: false })),
        selectedItem: items[0],
      }));
    } else {
      setState({ selectedItem: undefined, items: [] });
    }
  }, [items]);

  return (
    <>
      {isDesktop ? (
        <section
          className={clsx('rounded-sm', className)}
          data-testid="desktop"
        >
          <ul
            className="flex flex-row list-none p-0 m-0 w-full"
            data-testid="titles"
          >
            {state.items.map((item, index) => (
              <li
                key={`tabs-${id}title-${index}`}
                className={clsx(
                  'px-4 py-4 cursor-pointer border border-solid border-[#bef1ff] rounded-t-lg',
                  item.payload === state.selectedItem
                    ? 'border-b-0 bg-[#F5FEFF]'
                    : 'border-b bg-white',
                )}
                onClick={() =>
                  setState((prev) => ({ ...prev, selectedItem: item.payload }))
                }
                onKeyDown={() =>
                  setState((prev) => ({ ...prev, selectedItem: item.payload }))
                }
                role="button"
              >
                {titleElement(
                  item.payload,
                  Object.is(item.payload, state.selectedItem),
                )}
              </li>
            ))}
            <li
              key={'none'}
              className="border-0 border-b border-solid border-b-[#bef1ff] w-full"
            ></li>
          </ul>
          <div className="bg-[#F5FEFF] border border-solid border-[#bef1ff] border-t-0">
            {contentElement(state.selectedItem)}
          </div>
        </section>
      ) : (
        <section
          className={clsx('grid gap-6 grid-cols-1', className)}
          data-testid="mobile"
        >
          {state.items.map(($item, index) => (
            <div
              key={`item-${index}`}
              className="px-2 bg-[#F5FEFF] border border-solid border-[#bef1ff] rounded-lg"
            >
              <div
                className="flex cursor-pointer px-4"
                onClick={() => toggle(index)}
              >
                <div className="w-full">
                  {titleElement(
                    $item.payload,
                    Object.is($item.payload, state.selectedItem),
                  )}
                </div>
                <div className="w-fit flex items-center">
                  {!$item.isOpen ? (
                    <OsdsIcon
                      className=""
                      name={ODS_ICON_NAME.CHEVRON_DOWN}
                      size={ODS_ICON_SIZE.sm}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    ></OsdsIcon>
                  ) : (
                    <OsdsIcon
                      className=""
                      name={ODS_ICON_NAME.CHEVRON_UP}
                      size={ODS_ICON_SIZE.sm}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    ></OsdsIcon>
                  )}
                </div>
              </div>
              {$item.isOpen && <div>{contentElement($item.payload)}</div>}
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export default TabsComponent;
