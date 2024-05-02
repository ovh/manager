import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import { clsx } from 'clsx';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TabsComponent } from '../container';

type TSimpleProps<T, S = void> = {
  value: T;
  items: T[];
  label: (item: T) => JSX.Element | string;
  id?: (item: T) => string;
  stack?: {
    by: (item: T) => S;
    label: (items: T) => JSX.Element | string;
    title: string;
  };
  onInput: (value: T) => void;
};

type TProps<T, S = void, G = void> = TSimpleProps<T, S> & {
  group?: {
    by: (item: T) => G;
    label: (items: T[]) => JSX.Element | string;
    showAllTab: boolean;
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

export const SimpleTileInputComponent = function SimpleTileInputComponent<
  T,
  S,
>({
  items,
  value,
  onInput,
  label,
  stack,
  id,
}: TSimpleProps<T, S>): JSX.Element {
  const [stackItems, setStackItems] = useState<T[]>([]);
  const [selectedStack, setSelectedStack] = useState<S>(undefined);

  const isItemStacked = useCallback(
    (item: T) =>
      stack &&
      items.filter((i) => Object.is(stack.by(i), stack.by(item))).length > 1,
    [items, stack],
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
              data-testid={`cta-${label(item)}`}
              checked={Object.is(value, item)}
              onClick={() => {
                setSelectedStack(undefined);
                if (isItemStacked(item)) {
                  setSelectedStack(stack.by(item));
                  onInput(undefined);
                } else {
                  onInput(item);
                }
              }}
              className={clsx(
                'cursor-pointer p-8 border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]',
                ((isItemStacked(item) &&
                  Object.is(selectedStack, stack.by(item))) ||
                  Object.is(value, item)) &&
                  'font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]',
              )}
            >
              {isItemStacked(item) ? stack.label(item) : label(item)}
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
          <SimpleTileInputComponent
            value={value}
            items={items.filter((item) =>
              Object.is(stack.by(item), selectedStack),
            )}
            label={label}
            onInput={onInput}
          />
        </>
      )}
    </>
  );
};

export const TileInputComponent = function TileInputComponent<T, S, G>({
  items,
  value,
  onInput,
  label,
  group,
  stack,
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
          titleElement={(key, selected) => (
            <OsdsText
              breakSpaces={false}
              size={ODS_THEME_TYPOGRAPHY_SIZE._600}
              color={
                selected
                  ? ODS_THEME_COLOR_INTENT.text
                  : ODS_THEME_COLOR_INTENT.primary
              }
            >
              <div className="whitespace-nowrap px-2 text-lg font-bold">
                {group.label(groups.get(key))}
              </div>
            </OsdsText>
          )}
          contentElement={(item) => (
            <SimpleTileInputComponent
              value={value}
              items={groups.get(item) || []}
              label={label}
              onInput={onInput}
              stack={stack}
            />
          )}
        />
      ) : (
        <SimpleTileInputComponent<T, S>
          value={value}
          items={items}
          label={label}
          onInput={onInput}
          stack={stack}
        />
      )}
    </>
  );
};
