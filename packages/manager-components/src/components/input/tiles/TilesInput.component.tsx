import React, { useEffect, useState } from 'react';
import { TabsComponent } from '../../container/tabs/Tabs.component';
import {
  SimpleTilesInputComponent,
  TSimpleProps,
} from './components/SimpleTilesInput.component';

type TProps<T, S = void, G = void> = TSimpleProps<T, S> & {
  group?: {
    by: (item: T) => G;
    label: (items: T[], selected: boolean) => JSX.Element | string;
    selected?: G;
    showAllTab: boolean;
    onChange?: (group: G) => void;
  };
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
          contentElement={(item: G) => (
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
