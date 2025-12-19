import { JSX, useCallback, useMemo, useState } from 'react';

import isEqual from 'lodash.isequal';

import {
  TilesInputGroupProps,
  TilesInputGroupState,
} from '@/components/tiles-input-group/TilesInputGroup.props';
import { TilesInputGroupTabs } from '@/components/tiles-input-group/tiles-input-group-tabs/TilesInputGroupTabs.component';
import { TilesInputComponent } from '@/components/tiles-input/TilesInput.component';

function TilesInputGroupComponent<T, S = void, G = void>({
  id,
  items,
  value,
  onInput,
  label,
  tileClass,
  stack,
  group,
}: TilesInputGroupProps<T, S, G>): JSX.Element {
  const [state, seTilesInputGroupState] = useState<TilesInputGroupState<S, G>>({
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
        seTilesInputGroupState((prev) => ({ ...prev, selectedGroup: g }));
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
        <TilesInputGroupTabs<G>
          items={[...(groups?.keys?.() || [])]}
          titleElement={({ item }: { item: G }) => <>{group.label(item, groups.get(item) || [])}</>}
          contentElement={({ item }: { item: G }) => (
            <TilesInputComponent
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
        <TilesInputComponent<T, S>
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
}

export { TilesInputGroupComponent };
