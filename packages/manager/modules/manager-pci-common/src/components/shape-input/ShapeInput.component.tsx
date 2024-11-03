import clsx from 'clsx';
import isEqual from 'lodash.isequal';
import { useCallback, useMemo, useState } from 'react';
import { AccordionComponent } from '../accordion/Accordion.component';

export type TInputProps<T> = {
  value: T;
  items: T[];
  item: {
    LabelComponent: ({
      item,
      isItemSelected,
      isMobile,
    }: {
      item: T;
      isItemSelected: boolean;
      isMobile: boolean;
    }) => JSX.Element;
    getId: (item: T) => string;
    isDisabled?: (item: T) => boolean;
  };
  onInput: (value: T) => void;
  stack?: {
    by: (item: T) => string;
    LabelComponent: ({
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
    TitleComponent: ({
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
    LabelComponent: ({
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

export const ShapesInputComponent = function ShapesInputComponent<T>({
  value,
  items,
  item,
  onInput,
  stack,
  group,
  className,
  isMobile = false,
  ...props
}: Readonly<TInputProps<T>>): JSX.Element {
  const [selectedGroupName, setSelectedGroupName] = useState<string>(undefined);

  const groupHandler = {
    itemsMap: useMemo(() => {
      const map = new Map<string, T[]>([[undefined, items]]);

      items.forEach((i) => {
        if (group) {
          const groupKey = group.by(i) ?? '';
          if (!map.has(groupKey)) {
            map.set(groupKey, []);
          }
          map.get(groupKey).push(i);
        } else {
          map.set(item.getId(i), [i]);
        }
      });
      return map;
    }, [group, items]),
  };

  const stackHandler = {
    itemsMap: useMemo(() => {
      const map = new Map<string, T[]>();

      (group && selectedGroupName
        ? items.filter((i) => group.by(i) === selectedGroupName)
        : items
      ).forEach((i) => {
        if (stack) {
          const stackKey = stack.by(i) ?? '';
          if (!map.has(stackKey)) {
            map.set(stackKey, []);
          }
          map.get(stackKey).push(i);
        } else {
          map.set(item.getId(i), [i]);
        }
      });
      return map;
    }, [items, stack, selectedGroupName, group, item.getId]),
    is: {
      stackSingle: useCallback(
        (stackKey: string) => stackHandler.itemsMap.get(stackKey).length === 1,
        [items],
      ),
      stackDisabled: useCallback(
        (stackKey: string) =>
          item.isDisabled &&
          stackHandler.itemsMap.get(stackKey)?.every(item.isDisabled),
        [items, item.isDisabled],
      ),
      stackSelected: useCallback(
        (stackKey: string) =>
          stackHandler.itemsMap.get(stackKey)?.some((i) => isEqual(i, value)),
        [items, value],
      ),
    },
  };

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
                    'p-4 cursor-pointer border border-solid border-[#bef1ff] rounded-t-lg',
                    groupName === selectedGroupName
                      ? 'border-b-0 bg-[#F5FEFF]'
                      : 'border-b bg-white',
                  )}
                  onClick={() => {
                    setSelectedGroupName(groupName);
                  }}
                >
                  <group.LabelComponent
                    groupName={groupName}
                    isGroupSelected={groupName === selectedGroupName}
                    groupItems={items.filter((i) => group.by(i) === groupName)}
                    isMobile={isMobile}
                  />
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
                <li
                  key={stackKey}
                  className={clsx(
                    'border-solid border-2 rounded-lg cursor-pointer p-2',
                    stackHandler.is.stackDisabled(stackKey) &&
                      'cursor-not-allowed pointer-events-none opacity-50',
                    stackHandler.is.stackSelected(stackKey)
                      ? 'border-[--ods-color-blue-600] bg-[--ods-color-blue-100]'
                      : 'bg-white border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]',
                  )}
                  onClick={() => {
                    const firstEnabledItem = stackHandler.itemsMap
                      .get(stackKey)
                      .find((i) => !item.isDisabled || !item.isDisabled(i));
                    onInput(firstEnabledItem);
                  }}
                >
                  {stackHandler.is.stackSingle(stackKey) ? (
                    <>
                      <item.LabelComponent
                        item={stackHandler.itemsMap.get(stackKey)[0]}
                        isItemSelected={isEqual(
                          value,
                          stackHandler.itemsMap.get(stackKey)[0],
                        )}
                        isMobile={isMobile}
                      />
                    </>
                  ) : (
                    <stack.LabelComponent
                      stackKey={stackKey}
                      isStackSelected={stackHandler.is.stackSelected(stackKey)}
                      stackItems={stackHandler.itemsMap.get(stackKey)}
                      isMobile={isMobile}
                    />
                  )}
                </li>
              ))}
            </ul>
            {stack &&
              value &&
              stackHandler.itemsMap.get(stack.by(value))?.length > 1 && (
                <div className="pl-4">
                  <stack.TitleComponent
                    stackKey={stack.by(value)}
                    stackItems={
                      stackHandler.itemsMap.get(stack.by(value)) || []
                    }
                    isMobile={isMobile}
                  />
                  <ShapesInputComponent
                    value={value}
                    items={stackHandler.itemsMap.get(stack.by(value))}
                    item={{
                      LabelComponent: item.LabelComponent,
                      getId: item.getId,
                      isDisabled: item.isDisabled,
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
                  isGroupSelected={groupName === selectedGroupName}
                  groupItems={items.filter((i) => group.by(i) === groupName)}
                  isMobile={isMobile}
                />
              }
              isOpen={!groupName}
            >
              <ShapesInputComponent
                value={value}
                items={groupHandler.itemsMap.get(groupName)}
                item={{
                  LabelComponent: item.LabelComponent,
                  getId: item.getId,
                  isDisabled: item.isDisabled,
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
