import React, { useEffect, useMemo, useState } from 'react';
import { TabsComponent } from '../../container/tabs/Tabs.component';
import {
  SimpleTilesInputComponent,
  TSimpleProps,
} from './components/SimpleTilesInput.component';

type TProps<T, S = void, G = void> = TSimpleProps<T, S> & {
  group?: {
    by: (item: T) => G;
    label: (group: G, items: T[]) => JSX.Element | string;
    value?: G;
    showAllTab: boolean;
    onChange?: (group: G) => void;
  };
};

type TState<T, S, G> = {
  groups: Map<G, T[]>;
  selectedGroup: G;
  selectedStack: S;
};

export const TilesInputComponent = function TilesInputComponent<T, S, G>({
  id,
  items,
  value,
  onInput,
  label,
  tileClass,
  stack,
  group,
}: TProps<T, S, G>): JSX.Element {
  const [state, setState] = useState<TState<T, S, G>>({
    groups: new Map<G, T[]>(),
    selectedGroup: group?.value,
    selectedStack: stack?.value,
  });

  useEffect(() => {
    if (group && typeof group.by === 'function') {
      const groups = new Map<G, T[]>();

      if (group.showAllTab) {
        groups.set(undefined, [...items]);
      }

      items.forEach((item) => {
        const groupId = group.by(item);
        if (!groups.has(groupId)) {
          groups.set(groupId, []);
        }
        groups.get(groupId).push(item);
      });

      setState((prev) => ({ ...prev, groups }));
    }
  }, [items, group]);

  useEffect(() => {
    if (group && group.onChange) {
      group.onChange(state.selectedGroup);
    }
  }, [state.selectedGroup]);

  return (
    <>
      {group ? (
        <TabsComponent<G>
          id={'t'}
          items={[...state.groups?.keys()]}
          titleElement={(key) => group.label(key, state.groups.get(key))}
          contentElement={(item: G) => (
            <SimpleTilesInputComponent
              id={id}
              items={state.groups.get(item) || []}
              value={value}
              onInput={onInput}
              label={label}
              tileClass={tileClass}
              stack={
                stack
                  ? {
                      ...stack,
                      onChange: (s) => {
                        setState((prev) => ({ ...prev, selectedStack: s }));
                        if (stack?.onChange) stack?.onChange(s);
                      },
                    }
                  : undefined
              }
            />
          )}
          onChange={(g) => {
            setState((prev) => ({ ...prev, selectedGroup: g }));
          }}
        />
      ) : (
        <SimpleTilesInputComponent<T, S>
          id={id}
          items={items}
          value={value}
          onInput={onInput}
          label={label}
          tileClass={tileClass}
          stack={stack}
        />
      )}
    </>
  );
};

export default TilesInputComponent;
