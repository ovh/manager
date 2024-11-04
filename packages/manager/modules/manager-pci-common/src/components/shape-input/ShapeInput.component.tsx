import clsx from 'clsx';
import isEqual from 'lodash.isequal';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
    value?: string;
  };
  isMobile?: boolean;
  className?: string;
};

type TState<T> = {
  value: T;
  group: string;
};

export const ShapesInputComponent = function ShapesInputComponent<T>({
  items = [],
  value,
  onInput,
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
    <section className={className} {...props}>
      {!isMobile || !group ? (
        <>
          {group && (
            <ul className="list-none flex flex-row gap-0 m-0 p-0 w-full">
              {[...groupHandler.itemsMap.keys()].map((groupName) => (
                <li
                  key={groupName || 'none'}
                  className={clsx(
                    'border border-solid border-[#bef1ff] rounded-t-lg',
                    groupName === state.group
                      ? 'border-b-0 bg-[#F5FEFF]'
                      : 'border-b bg-white',
                  )}
                >
                  <button
                    className={clsx(GHOST_BUTTON_CLASS, 'w-full h-full')}
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
                className="border-0 border-b border-solid border-b-[#bef1ff] w-full"
              ></li>
            </ul>
          )}
          <div
            className={clsx(
              group &&
                'bg-[#F5FEFF] border border-solid border-t-0 border-[#BEF1FF]',
            )}
          >
            <ul className="list-none grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 m-0 p-4">
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
              />
            </AccordionComponent>
          ))}
        </div>
      )}
    </section>
  );
};
