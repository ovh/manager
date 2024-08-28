import React, { useMemo, useState } from 'react';
import isEqual from 'lodash.isequal';
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

type TState<S, G> = {
  selectedGroup: G;
  selectedStack: S;
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
        newGroups.set(undefined, [...items]);
      }

      items.forEach((item) => {
        const groupId = group.by(item);
        if (!newGroups.has(groupId)) {
          newGroups.set(groupId, []);
        }
        newGroups.get(groupId).push(item);
      });
    }

    return newGroups;
  }, [items, group]);

  return (
    <>
      {group ? (
        <TabsComponent<G>
          items={[...groups?.keys()]}
          titleElement={(key) => group.label(key, groups.get(key))}
          contentElement={(item: G) => (
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
            if (group.onChange && !isEqual(state.selectedGroup, g))
              group.onChange(g);
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
