import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import { clsx } from 'clsx';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

const uniqBy = function uniqBy<I, U>(arr: I[], cb: (item: I) => U) {
  return [
    ...arr
      .reduce((map: Map<U, I>, item?: I) => {
        if (!map.has(cb(item))) map.set(cb(item), item);

        return map;
      }, new Map())
      .values(),
  ];
};

export type TSimpleProps<T, S = void> = {
  id?: ((item: T) => string) | string;
  value: T;
  items: T[];
  label: (item: T) => JSX.Element | string;
  tileClass?: {
    active?: string;
    inactive?: string;
  };
  stack?: {
    by: (item: T) => S;
    label: (items: T[]) => JSX.Element | string;
    title: string;
    onChange?: (stack: S) => void;
  };
  onInput: (value: T) => void;
};

export const SimpleTilesInputComponent = function SimpleTilesInputComponent<
  T,
  S
>({
  items,
  value,
  onInput,
  label,
  tileClass,
  stack,
  id,
}: TSimpleProps<T, S>): JSX.Element {
  const [stackItems, setStackItems] = useState<T[]>([]);
  const [selectedStack, setSelectedStack] = useState<S>(undefined);

  useEffect(() => {
    if (typeof stack?.onChange === 'function') {
      stack.onChange(selectedStack);
    }
  }, [selectedStack]);

  const getItemStack = useCallback(
    (item: T) =>
      stack && items.filter((i) => Object.is(stack.by(i), stack.by(item))),
    [items, stack],
  );

  const getItemTilesClass = useCallback(
    (item: T): string => {
      const isTileActive =
        (getItemStack(item)?.length > 1 &&
          Object.is(selectedStack, stack.by(item))) ||
        Object.is(value, item);

      let cls = ``;
      if (isTileActive) {
        cls += tileClass?.active
          ? tileClass.active
          : 'font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';
      } else {
        cls += tileClass?.inactive
          ? tileClass.inactive
          : 'border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';
      }

      return cls;
    },
    [tileClass, items, value],
  );

  useEffect(() => {
    if (stack) {
      setStackItems(uniqBy<T, S>(items, stack.by));
    } else {
      setStackItems(items);
    }
  }, [items, stack]);

  return (
    <>
      <ul className="grid gap-6 list-none p-6 m-0 grid-cols-1 md:grid-cols-3">
        {stackItems.map((item) => (
          <li
            key={typeof id === 'function' ? id(item) : uuidv4()}
            className="w-full px-1"
          >
            <OsdsTile
              checked={Object.is(value, item)}
              onClick={() => {
                setSelectedStack(undefined);
                if (getItemStack(item)?.length > 1) {
                  setSelectedStack(stack.by(item));
                  onInput(undefined);
                } else {
                  onInput(item);
                }
              }}
              className={clsx('cursor-pointer', getItemTilesClass(item))}
            >
              {getItemStack(item)?.length > 1
                ? stack.label(getItemStack(item))
                : label(item)}
            </OsdsTile>
          </li>
        ))}
      </ul>
      {selectedStack && (
        <>
          <div className="mt-6 ml-8">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {stack.title}
            </OsdsText>
          </div>
          <SimpleTilesInputComponent
            value={value}
            items={items.filter((item) =>
              Object.is(stack.by(item), selectedStack),
            )}
            label={label}
            tileClass={tileClass}
            onInput={onInput}
          />
        </>
      )}
    </>
  );
};
