import React, { useCallback, useEffect, useState } from 'react';
import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import { clsx } from 'clsx';
import isEqual from 'lodash.isequal';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { hashCode } from '../../../../utils';

const uniqBy = function uniqBy<I, U>(items: I[], cb: (item: I) => U): I[] {
  return [
    ...items
      .reduce((map: Map<U, I>, item?: I) => {
        if (!map.has(cb(item))) map.set(cb(item), item);

        return map;
      }, new Map())
      .values(),
  ];
};

const stackItems = function stackItems<I, U>(
  items: I[],
  cb: (item: I) => U,
): Map<U, I[]> {
  const stacks = new Map<U, I[]>();

  if (cb) {
    const uniques = uniqBy<I, U>(items, cb);
    uniques.forEach((unique) => {
      const key = cb(unique);
      stacks.set(key, []);
      stacks.get(key).push(...items.filter((item) => isEqual(key, cb(item))));
    });
  } else {
    stacks.set(undefined, items);
  }

  return stacks;
};

export type TSimpleProps<T, S = void> = {
  id?: (() => string) | string;
  items: T[];
  value: T;
  onInput: (value: T) => void;
  label: (item: T) => JSX.Element | string;
  tileClass?: {
    active?: string;
    inactive?: string;
  };
  stack?: {
    by: (item: T) => S;
    label: (stack: S, items: T[]) => JSX.Element | string;
    title: (stack: S, items: T[]) => JSX.Element | string;
    value?: S;
    onChange?: (stack: S) => void;
  };
};

type IState<T, S> = {
  stacks: Map<S, T[]>;
  selectedStack: S;
  activeClass: string;
  inactiveClass: string;
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
  const [state, setState] = useState<IState<T, S>>({
    stacks: stackItems(items, stack?.by),
    selectedStack: stack?.value,
    activeClass: `cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600] ${tileClass?.active}`,
    inactiveClass: `cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600] ${tileClass?.inactive}`,
  });

  const set = {
    selectedStack: (s: S) => {
      setState((prev) => ({ ...prev, selectedStack: s }));
    },
    value: (t: T) => onInput(t),
  };

  const is = {
    stack: {
      checked: useCallback(
        (s: S) =>
          state.stacks?.get(s)?.length > 1
            ? isEqual(state.selectedStack, s)
            : isEqual(state.stacks.get(s)[0], value),
        [state.stacks, state.selectedStack, value],
      ),
      singleton: useCallback(
        (s: S) => state.stacks.get(s)?.length === 1,
        [state.stacks],
      ),
    },
  };

  // Update stacks from props
  useEffect(() => {
    setState((prev) => ({ ...prev, stacks: stackItems(items, stack?.by) }));
  }, [items, stack]);

  // Update active/inactive class from props
  useEffect(() => {
    if (tileClass) {
      setState((prev) => ({
        ...prev,
        activeClass: `cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600] ${tileClass?.active}`,
        inactiveClass: `cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600] ${tileClass?.inactive}`,
      }));
    }
  }, [tileClass]);

  // Warn parent on stack change
  useEffect(() => {
    if (typeof stack?.onChange === 'function') {
      stack.onChange(state.selectedStack);
    }
  }, [state.selectedStack]);

  // Update selected stack from value
  useEffect(() => {
    if (stack) {
      set.selectedStack(value ? stack.by(value) : undefined);
    }
  }, [value]);

  // Update value from selected stack
  useEffect(() => {
    if (
      stack &&
      state.stacks.get(state.selectedStack)?.length &&
      !isEqual(state.selectedStack, stack.by(value))
    ) {
      set.value(state.stacks.get(state.selectedStack)[0]);
    }
  }, [state.selectedStack]);

  return (
    <div id={typeof id === 'function' ? id() : id}>
      <ul className="grid gap-6 list-none p-6 m-0 grid-cols-1 md:grid-cols-3">
        {stack
          ? [...state.stacks.keys()].map((key) => (
              <li className="w-full px-1" key={hashCode(key)}>
                <OsdsTile
                  checked={is.stack.checked(key)}
                  onClick={() =>
                    is.stack.singleton(key)
                      ? set.value(state.stacks.get(key)[0])
                      : set.selectedStack(key)
                  }
                  className={clsx(
                    is.stack.checked(key)
                      ? state.activeClass
                      : state.inactiveClass,
                  )}
                >
                  {is.stack.singleton(key)
                    ? label(state.stacks.get(key)[0])
                    : stack?.label(key, state.stacks.get(key))}
                </OsdsTile>
              </li>
            ))
          : items.map((item: T) => (
              <li className="w-full px-1" key={hashCode(item)}>
                <OsdsTile
                  checked={isEqual(value, item)}
                  onClick={() => set.value(item)}
                  className={clsx(
                    isEqual(value, item)
                      ? state.activeClass
                      : state.inactiveClass,
                  )}
                >
                  {label(item)}
                </OsdsTile>
              </li>
            ))}
      </ul>
      {state.selectedStack &&
        state.stacks.get(state.selectedStack)?.length > 1 && (
          <>
            <div className="mt-6 ml-8">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {stack.title(
                  state.selectedStack,
                  state.stacks.get(state.selectedStack),
                )}
              </OsdsText>
            </div>
            <SimpleTilesInputComponent
              value={value}
              items={state.stacks.get(state.selectedStack)}
              label={label}
              onInput={onInput}
              tileClass={tileClass}
            />
          </>
        )}
    </div>
  );
};
