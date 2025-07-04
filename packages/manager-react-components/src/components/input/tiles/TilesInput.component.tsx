import React, { useMemo, useState, useCallback } from 'react';
import isEqual from 'lodash.isequal';
import { TabsComponent } from '../../tabs/Tabs.component';

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

type TState<S, G> = {
  selectedGroup: G | undefined;
  selectedStack: S | undefined;
};

export const TilesInputComponent = function TilesInputComponent<
  T,
  S = void,
  G = void,
>({
  id,
  items,
  value,
  onInput,
  label,
  tileClass,
  stack,
  group,
}: TProps<T, S, G>): JSX.Element {
  const [state, setState] = useState<TState<S, G>>({
    selectedGroup: group?.value,
    selectedStack: stack?.value,
  });

  const groups = useMemo(() => {
    const newGroups = new Map<G, T[]>();
    if (group && typeof group.by === 'function') {
      if (group.showAllTab) {
        newGroups.set('ALL' as G, [...items]);
      }

      items.forEach((item) => {
        const groupId = group.by(item);
        if (!newGroups.has(groupId)) {
          newGroups.set(groupId, []);
        }
        const groupItems = newGroups.get(groupId);
        if (groupItems) {
          groupItems.push(item);
        }
      });
    }

    return newGroups;
  }, [items, group]);

  const handleGroupChange = useCallback(
    (g: G) => {
      if (!isEqual(state.selectedGroup, g)) {
        setState((prev) => ({ ...prev, selectedGroup: g }));
        if (group?.onChange) {
          group.onChange(g);
        }
      }
    },
    [state.selectedGroup, group?.onChange],
  );

  return (
    <>
      {group ? (
        <TabsComponent<G>
          items={[...groups?.keys()]}
          titleElement={({ item }: { item: G }) => (
            <>{group.label(item, groups.get(item) || [])}</>
          )}
          contentElement={({ item }: { item: G }) => (
            <SimpleTilesInputComponent
              id={id}
              items={groups.get(item) || []}
              value={value}
              onInput={onInput}
              label={label}
              tileClass={tileClass}
              stack={
                stack
                  ? {
                      ...stack,
                      onChange: (s) => {
                        if (stack?.onChange) stack?.onChange(s);
                      },
                    }
                  : undefined
              }
            />
          )}
          onChange={handleGroupChange}
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
