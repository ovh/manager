import { JSX, useState } from 'react';

import { Tab, TabList, Tabs, TabsValueChangeEvent } from '@ovhcloud/ods-react';

import { TilesInputGroupTabsProps } from './TilesInputGroupTabs.props';

export function TilesInputGroupTabs<Item>({
  items = [],
  titleElement = ({ item }) => <>{String(item)}</>,
  contentElement = ({ item }) => <>{String(item)}</>,
  className,
  onChange,
}: TilesInputGroupTabsProps<Item>): JSX.Element {
  const [selectedTabItem, setSelectedTabItem] = useState<string>(String(items?.[0] ?? ''));

  const TitleComponent = titleElement;
  const ContentComponent = contentElement;

  return (
    <div className={className}>
      <Tabs
        onValueChange={(value: TabsValueChangeEvent) => {
          setSelectedTabItem(value?.value);
          onChange?.(value as Item);
        }}
        value={selectedTabItem}
      >
        <TabList>
          {items.map((item) => {
            const itemValue = String(item);
            return (
              <Tab key={itemValue} value={itemValue}>
                <TitleComponent item={item} isSelected={itemValue === selectedTabItem} />
              </Tab>
            );
          })}
        </TabList>
      </Tabs>
      <div className="bg-(--ods-color-primary-050) border border-solid border-(--ods-color-primary-100) border-t-0">
        <ContentComponent item={selectedTabItem as Item} />
      </div>
    </div>
  );
}

export default TilesInputGroupTabs;
