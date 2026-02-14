import { JSX, useCallback, useEffect, useMemo, useState } from 'react';

import { clsx } from 'clsx';
import isEqual from 'lodash.isequal';

import { Card } from '@ovhcloud/ods-react';

import { hashCode } from '@/commons/utils/MukHelper';
import { TilesInputProps } from '@/components/tiles-input/TilesInput.props';

import { stackItems } from './TilesInput.utils';

export const TilesInputComponent = <T, S>({
  items,
  value,
  onInput,
  label,
  tileClass,
  stack,
  id,
}: TilesInputProps<T, S>): JSX.Element => {
  const [selectedStack, setSelectedStack] = useState<S | undefined>(stack?.value);

  const stacks = useMemo(() => stackItems(items, stack?.by), [items, stack]);

  const activeClass = useMemo(
    () =>
      clsx(
        `cursor-pointer font-bold bg-(--ods-color-blue-100) border-(--ods-color-blue-600) ${tileClass?.active}`,
      ),
    [tileClass?.active],
  );

  const inactiveClass = useMemo(
    () =>
      clsx(
        `cursor-pointer border-(--ods-color-blue-100) hover:bg-(--ods-color-blue-100) hover:border-(--ods-color-blue-600) ${tileClass?.inactive}`,
      ),
    [tileClass?.inactive],
  );

  const set = useMemo(
    () => ({
      selectedStack: (s: S) => {
        setSelectedStack(s);
      },
      value: (t: T) => onInput(t),
    }),
    [onInput],
  );

  const is = {
    stack: {
      checked: useCallback(
        (s: S | undefined) => {
          if (s === undefined) return false;
          const stackItem = stacks?.get(s);
          return stackItem && stackItem.length > 1
            ? isEqual(selectedStack, s)
            : stackItem && stackItem.length === 1 && isEqual(stackItem[0], value);
        },
        [stacks, selectedStack, value],
      ),
      singleton: useCallback(
        (s: S | undefined) => {
          if (s === undefined) return false;
          const stackItem = stacks.get(s);
          return stackItem?.length === 1;
        },
        [stacks],
      ),
    },
  };

  // Warn parent on stack change
  useEffect(() => {
    if (typeof stack?.onChange === 'function' && selectedStack !== undefined) {
      stack.onChange(selectedStack);
    }
  }, [selectedStack, stack?.onChange, stack]);

  // Update selected stack from value
  useEffect(() => {
    if (stack && value) {
      set.selectedStack(stack.by(value));
    }
  }, [value, stack, set]);

  // Update value from selected stack
  useEffect(() => {
    if (stack && selectedStack !== undefined && value) {
      const stackItem = stacks.get(selectedStack);
      if (stackItem?.length && stackItem[0] && !isEqual(selectedStack, stack.by(value))) {
        set.value(stackItem[0]);
      }
    }
  }, [selectedStack, stacks, stack, value, set]);

  return (
    <div id={typeof id === 'function' ? id() : id}>
      <ul className="simple-tiles-input-ul grid gap-6 list-none p-6 m-0 grid-cols-1 md:grid-cols-3">
        {stack
          ? [...stacks.keys()].map((key) => {
              const stackItem = stacks.get(key);
              if (!stackItem) return null;

              return (
                <li className="w-full px-1" key={hashCode(key)}>
                  <Card
                    onClick={() => {
                      if (is.stack.singleton(key) && stackItem[0] !== undefined) {
                        set.value(stackItem[0]);
                      } else if (key !== undefined) {
                        set.selectedStack(key);
                      }
                    }}
                    className={`${clsx(
                      is.stack.checked(key) ? activeClass : inactiveClass,
                    )} w-full px-[24px] py-[16px]`}
                  >
                    {is.stack.singleton(key) && stackItem[0] !== undefined
                      ? label(stackItem[0])
                      : key !== undefined && stack?.label(key, stackItem)}
                  </Card>
                </li>
              );
            })
          : items.map((item: T) => (
              <li className="w-full px-1" key={hashCode(item)}>
                <Card
                  onClick={() => set.value(item)}
                  className={`${clsx(
                    isEqual(value, item) ? activeClass : inactiveClass,
                  )} w-full px-[24px] py-[16px]`}
                >
                  {label(item)}
                </Card>
              </li>
            ))}
      </ul>
      {selectedStack !== undefined &&
        (() => {
          const selectedStackItems = stacks.get(selectedStack);
          return selectedStackItems && selectedStackItems.length > 1;
        })() && (
          <>
            <div className="mt-6 ml-8">
              <span className="text-(--ods-color-heading) leading-[22px] font-bold">
                {stack?.title(selectedStack, stacks.get(selectedStack) || [])}
              </span>
            </div>
            <TilesInputComponent
              value={value}
              items={stacks.get(selectedStack) || []}
              label={label}
              onInput={onInput}
              tileClass={tileClass}
            />
          </>
        )}
    </div>
  );
};
