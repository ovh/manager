import clsx from 'clsx';
import isEqual from 'lodash.isequal';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AccordionComponent } from '../accordion/Accordion.component';
import { DefaultItemLabelComponent } from './default-components/item-label';
import { DefaultStackLabelComponent } from './default-components/stack-label';
import { DefaultStackTitleComponent } from './default-components/stack-title';
import { DefaultGroupLabelComponent } from './default-components/group-label';
import { DefaultShapeComponent } from './default-components/default-shape';
import { GHOST_BUTTON_CLASS } from './constants';

export type TShapesInputProps<T> = {
  items?: T[];
  value?: T;
  onInput?: (value: T) => void;
  columnsCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  item?: {
    LabelComponent?: ({
      item,
      isItemSelected,
      isMobile,
    }: {
      item: T;
      isItemSelected: boolean;
      isMobile: boolean;
    }) => JSX.Element;
    getId?: (item: T) => string;
    isDisabled?: (item: T) => boolean;
  };
  stack?: {
    by: (item: T) => string;
    LabelComponent?: ({
      stackKey,
      isStackSelected,
      stackItems,
      isMobile,
    }: {
      stackKey: string;
      isStackSelected: boolean;
      stackItems: T[];
      isMobile: boolean;
    }) => JSX.Element;
    TitleComponent?: ({
      stackKey,
      stackItems,
      isMobile,
    }: {
      stackKey?: string;
      stackItems?: T[];
      isMobile: boolean;
    }) => JSX.Element;
  };
  group?: {
    by: (item: T) => string;
    LabelComponent?: ({
      groupName,
      isGroupSelected,
      groupItems,
      isMobile,
    }: {
      groupName: string;
      isGroupSelected: boolean;
      groupItems: T[];
      isMobile: boolean;
    }) => JSX.Element;
  };
  isMobile?: boolean;
  className?: string;
};

type TState<T> = {
  value: T;
  group: string;
};

/**
 * ShapesInputComponent
 * An input component that allows the user to select an item from a list of items
 * It's like a select, but items are displayed as shapes/tiles
 * shapes can be grouped and stacked based on a common function value(common value), thus we can have group of inputs and stack of inputs
 * The component is generic, meaning the items can be of any type
 * @param items {Array} list of items to be displayed, default is an empty array
 * @param value {Any} the selected item, default is undefined
 * @param onInput {function} callback function to be called when the selected item changes,is optional
 * @param columnsCount number of columns to display the items in,range from 1 to 12, default is 3
 * @param item an optional object that contains the following properties:
 * - LabelComponent: a component that will be used to display the item, is optional, a default component will be used if not provided
 * - getId: a function that returns a unique id for the item, is optional, the index of the item will be used if not provided
 * - isDisabled: a function that returns a boolean indicating if the item is disabled, is optional
 * @param stack an optional object that contains the following properties:
 * - by: a function that returns a common value for a group of items
 * - LabelComponent: a component that will be used to display the stack, is optional, a default component will be used if not provided
 * - TitleComponent: a component that will be used to display the title of the stack, is optional, a default component will be used if not provided
 * If the stack is not provided, the items will be displayed as single items
 * @param group an object that contains the following properties:
 * - by: a function that returns a common value for a group of items
 * - LabelComponent: a component that will be used to display the group, is optional, a default component will be used if not provided
 * If the group is not provided, the items will be displayed as a single group
 * @param className additional classes to be added to the component
 * @param isMobile boolean indicating if the component is being displayed on a mobile device, default is false
 * @param props additional props to be passed to the component
 * @constructor Creates a ShapesInputComponent
 */
export const ShapesInputComponent = function ShapesInputComponent<T>({
  items = [],
  value,
  onInput,
  columnsCount = 3,
  item,
  stack,
  group,
  className,
  isMobile = false,
  ...props
}: Readonly<TShapesInputProps<T>>): JSX.Element {
  const [state, setState] = useState<TState<T>>({
    value,
    group: undefined,
  });

  const LabelComponent = memo(
    item?.LabelComponent || DefaultItemLabelComponent,
  );
  const StackLabelComponent = memo(
    stack?.LabelComponent || DefaultStackLabelComponent,
  );
  const StackTitleComponent = memo(
    stack?.TitleComponent || DefaultStackTitleComponent,
  );
  const GroupLabelComponent = memo(
    group?.LabelComponent || DefaultGroupLabelComponent,
  );
  const ShapeComponent = memo(DefaultShapeComponent);

  const groupHandler = {
    itemsMap: useMemo(() => {
      const map = new Map<string, T[]>([[undefined, items]]);

      items.forEach((i, index) => {
        if (group) {
          const groupKey = group.by(i) ?? '';
          if (!map.has(groupKey)) {
            map.set(groupKey, []);
          }
          map.get(groupKey).push(i);
        } else {
          map.set(
            typeof item?.getId === 'function'
              ? item.getId(i)
              : `group-${index}`,
            [i],
          );
        }
      });
      return map;
    }, [group, items]),
  };

  const stackHandler = {
    itemsMap: useMemo(() => {
      const map = new Map<string, T[]>();

      (group && state.group
        ? items.filter((i) => group.by(i) === state.group)
        : items
      ).forEach((i, index) => {
        if (stack) {
          const stackKey = stack.by(i) ?? '';
          if (!map.has(stackKey)) {
            map.set(stackKey, []);
          }
          map.get(stackKey).push(i);
        } else {
          map.set(
            typeof item?.getId === 'function'
              ? item.getId(i)
              : `stack-${index}`,
            [i],
          );
        }
      });
      return map;
    }, [items, stack, state.group, group, item?.getId]),
    is: {
      stackSingle: useCallback(
        (stackKey: string) => stackHandler.itemsMap.get(stackKey).length === 1,
        [items],
      ),
      stackDisabled: useCallback(
        (stackKey: string) =>
          item?.isDisabled &&
          stackHandler.itemsMap.get(stackKey)?.every(item.isDisabled),
        [items, item?.isDisabled],
      ),
      stackSelected: useCallback(
        (stackKey: string) =>
          stackHandler.itemsMap
            .get(stackKey)
            ?.some((i) => isEqual(i, state.value)),
        [items, state.value],
      ),
    },
  };

  // Update state.value if value prop changes
  useEffect(() => {
    if (value && !isEqual(value, state.value)) {
      setState((prev) => ({ ...prev, value }));
    }
  }, [value]);

  // Notify parent if value changes
  useEffect(() => {
    if (onInput) {
      onInput(state.value);
    }
  }, [state.value]);

  return (
    <section className={className} {...props} style={{ maxWidth: '100%' }}>
      {!isMobile || !group ? (
        <>
          {group && (
            <ul className="list-none flex flex-row gap-0 m-0 p-0 max-w-full w-full">
              {[...groupHandler.itemsMap.keys()].map((groupName) => (
                <li
                  key={groupName || 'none'}
                  className={clsx(
                    'border border-solid border-[#bef1ff] rounded-t-lg overflow-hidden',
                    groupName === state.group
                      ? 'border-b-0 bg-[#F5FEFF] m-t[1px]'
                      : 'border-b bg-white',
                  )}
                >
                  <button
                    className={clsx(GHOST_BUTTON_CLASS, 'h-full w-full')}
                    onClick={() => {
                      setState((prev) => ({ ...prev, group: groupName }));
                    }}
                  >
                    <GroupLabelComponent
                      groupName={groupName}
                      isGroupSelected={groupName === state.group}
                      groupItems={
                        !groupName
                          ? items
                          : items.filter((i) => group.by(i) === groupName)
                      }
                      isMobile={isMobile}
                    />
                  </button>
                </li>
              ))}
              <li
                key="none"
                className="border-0 border-b border-solid border-b-[#bef1ff] grow"
              ></li>
            </ul>
          )}
          <div
            className={clsx(
              group &&
                'bg-[#F5FEFF] border border-t-0 border-solid border-[#BEF1FF]',
            )}
          >
            <ul
              className="list-none grid gap-6 m-0 p-4"
              style={{
                gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`,
              }}
            >
              {[...stackHandler.itemsMap.keys()].map((stackKey) => (
                <li key={stackKey}>
                  <ShapeComponent
                    isSelected={stackHandler.is.stackSelected(stackKey)}
                    isDisabled={stackHandler.is.stackDisabled(stackKey)}
                    action={() => {
                      const firstEnabledItem = stackHandler.itemsMap
                        .get(stackKey)
                        .find(
                          (i) =>
                            typeof item?.isDisabled !== 'function' ||
                            !item.isDisabled(i),
                        );
                      setState((prev) => ({
                        ...prev,
                        value: firstEnabledItem,
                      }));
                    }}
                  >
                    {stackHandler.is.stackSingle(stackKey) ? (
                      <>
                        <LabelComponent
                          item={stackHandler.itemsMap.get(stackKey)[0]}
                          isItemSelected={isEqual(
                            state.value,
                            stackHandler.itemsMap.get(stackKey)[0],
                          )}
                          isMobile={isMobile}
                        />
                      </>
                    ) : (
                      <StackLabelComponent
                        stackKey={stackKey}
                        isStackSelected={stackHandler.is.stackSelected(
                          stackKey,
                        )}
                        stackItems={stackHandler.itemsMap.get(stackKey)}
                        isMobile={isMobile}
                      />
                    )}
                  </ShapeComponent>
                </li>
              ))}
            </ul>
            {stack &&
              state.value &&
              stackHandler.itemsMap.get(stack.by(state.value))?.length > 1 && (
                <div className="pl-4">
                  <StackTitleComponent
                    stackKey={stack.by(state.value)}
                    stackItems={
                      stackHandler.itemsMap.get(stack.by(state.value)) || []
                    }
                    isMobile={isMobile}
                  />
                  <ShapesInputComponent
                    value={state.value}
                    items={stackHandler.itemsMap.get(stack.by(state.value))}
                    item={{
                      LabelComponent: item.LabelComponent,
                      getId: item.getId,
                      isDisabled: item?.isDisabled,
                    }}
                    onInput={onInput}
                  />
                </div>
              )}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {[...groupHandler.itemsMap.keys()].map((groupName) => (
            <AccordionComponent
              key={groupName || 'none'}
              title={
                <group.LabelComponent
                  groupName={groupName}
                  isGroupSelected={groupName === state.group}
                  groupItems={items.filter((i) => group.by(i) === groupName)}
                  isMobile={isMobile}
                />
              }
              isOpen={!groupName}
            >
              <ShapesInputComponent
                value={state.value}
                items={groupHandler.itemsMap.get(groupName)}
                item={{
                  LabelComponent: item.LabelComponent,
                  getId: item.getId,
                  isDisabled: item?.isDisabled,
                }}
                onInput={onInput}
                stack={stack}
                columnsCount={1}
              />
            </AccordionComponent>
          ))}
        </div>
      )}
    </section>
  );
};
