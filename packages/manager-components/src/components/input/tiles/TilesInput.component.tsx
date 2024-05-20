import { clsx } from 'clsx';
import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TabsComponent } from '../../container/tabs/Tabs.component';

type TSimpleProps<T, S = void> = {
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

type TProps<T, S = void, G = void> = TSimpleProps<T, S> & {
  group?: {
    by: (item: T) => G;
    label: (items: T[], selected: boolean) => JSX.Element | string;
    selected?: G;
    showAllTab: boolean;
    onChange?: (group: G) => void;
  };
};

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

export const SimpleTilesInputComponent = function SimpleTilesInputComponent<
  T,
  S,
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

export const TilesInputComponent = function TilesInputComponent<T, S, G>({
  id,
  value,
  items,
  label,
  tileClass,
  stack,
  group,
  onInput,
}: TProps<T, S, G>): JSX.Element {
  const [groups, setGroups] = useState<Map<G, T[]>>(new Map());

  useEffect(() => {
    if (group && typeof group.by === 'function') {
      const newGroups = new Map<G, T[]>();

      if (group.showAllTab) {
        newGroups.set(undefined, [...items]);
      }

      items.forEach((item) => {
        const groupId = group.by(item);
        if (!newGroups.has(groupId)) {
          newGroups.set(groupId, []);
        }
        newGroups.get(groupId).push(item);
      });

      setGroups(newGroups);
    }
  }, [items, group]);

  return (
    <>
      {group ? (
        <TabsComponent<G>
          id={'t'}
          items={[...groups.keys()]}
          titleElement={(key, selected) =>
            group.label(groups.get(key), selected)
          }
          contentElement={(item) => (
            <SimpleTilesInputComponent
              id={id}
              value={value}
              items={groups.get(item) || []}
              label={label}
              tileClass={tileClass}
              stack={stack}
              onInput={onInput}
            />
          )}
          onChange={group.onChange}
        />
      ) : (
        <SimpleTilesInputComponent<T, S>
          id={id}
          value={value}
          items={items}
          label={label}
          tileClass={tileClass}
          stack={stack}
          onInput={onInput}
        />
      )}
    </>
  );
};

export default TilesInputComponent;
