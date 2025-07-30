import { useCallback, useEffect, useState } from 'react';
import { OdsCard } from '@ovhcloud/ods-components/react';
import { clsx } from 'clsx';
import isEqual from 'lodash.isequal';
import { hashCode } from '../../utils';
import { TilesInputProps, TilesInputState } from './TilesInput.props';
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
  const [state, setState] = useState<TilesInputState<T, S>>({
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
        (s: S | undefined) => {
          if (s === undefined) return false;
          const stackItem = state.stacks?.get(s);
          return stackItem && stackItem.length > 1
            ? isEqual(state.selectedStack, s)
            : stackItem &&
                stackItem.length === 1 &&
                isEqual(stackItem[0], value);
        },
        [state.stacks, state.selectedStack, value],
      ),
      singleton: useCallback(
        (s: S | undefined) => {
          if (s === undefined) return false;
          const stackItem = state.stacks.get(s);
          return stackItem?.length === 1;
        },
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
    if (
      typeof stack?.onChange === 'function' &&
      state.selectedStack !== undefined
    ) {
      stack.onChange(state.selectedStack);
    }
  }, [state.selectedStack, stack?.onChange]);

  // Update selected stack from value
  useEffect(() => {
    if (stack && value) {
      set.selectedStack(stack.by(value));
    }
  }, [value, stack]);

  // Update value from selected stack
  useEffect(() => {
    if (stack && state.selectedStack !== undefined && value) {
      const stackItem = state.stacks.get(state.selectedStack);
      if (stackItem?.length && !isEqual(state.selectedStack, stack.by(value))) {
        set.value(stackItem[0]);
      }
    }
  }, [state.selectedStack, state.stacks, stack, value]);

  return (
    <div id={typeof id === 'function' ? id() : id}>
      <ul className="simple-tiles-input-ul grid gap-6 list-none p-6 m-0 grid-cols-1 md:grid-cols-3">
        {stack
          ? [...state.stacks.keys()].map((key) => {
              const stackItem = state.stacks.get(key);
              if (!stackItem) return null;

              return (
                <li className="w-full px-1" key={hashCode(key)}>
                  <OdsCard
                    onClick={() =>
                      is.stack.singleton(key)
                        ? set.value(stackItem[0])
                        : key !== undefined && set.selectedStack(key)
                    }
                    className={`${clsx(
                      is.stack.checked(key)
                        ? state.activeClass
                        : state.inactiveClass,
                    )} w-full px-[24px] py-[16px]`}
                  >
                    {is.stack.singleton(key)
                      ? label(stackItem[0])
                      : key !== undefined && stack?.label(key, stackItem)}
                  </OdsCard>
                </li>
              );
            })
          : items.map((item: T) => (
              <li className="w-full px-1" key={hashCode(item)}>
                <OdsCard
                  onClick={() => set.value(item)}
                  className={`${clsx(
                    isEqual(value, item)
                      ? state.activeClass
                      : state.inactiveClass,
                  )} w-full px-[24px] py-[16px]`}
                >
                  {label(item)}
                </OdsCard>
              </li>
            ))}
      </ul>
      {state.selectedStack !== undefined &&
        (() => {
          const selectedStackItems = state.stacks.get(state.selectedStack);
          return selectedStackItems && selectedStackItems.length > 1;
        })() && (
          <>
            <div className="mt-6 ml-8">
              <span className="text-[--ods-color-heading] leading-[22px] font-bold">
                {stack?.title(
                  state.selectedStack,
                  state.stacks.get(state.selectedStack) || [],
                )}
              </span>
            </div>
            <TilesInputComponent
              value={value}
              items={state.stacks.get(state.selectedStack) || []}
              label={label}
              onInput={onInput}
              tileClass={tileClass}
            />
          </>
        )}
    </div>
  );
};
