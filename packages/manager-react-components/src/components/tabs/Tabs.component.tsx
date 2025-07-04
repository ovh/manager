import { useState } from 'react';
import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';
import { TProps } from './Tabs.props';

export function TabsComponent<Item>({
  items = [],
  titleElement = ({ item }) => <>{`${item}`}</>,
  contentElement = ({ item }) => <>{`${item}`}</>,
  className,
  onChange,
}: TProps<Item>): JSX.Element {
  const [selectedTabsItem, setSelectedTabsItem] = useState<string>(
    items?.[0] as string,
  );

  const TitleComponent = titleElement;
  const ContentComponent = contentElement;

  return (
    <div className={className}>
      <Tabs
        onValueChange={(value) => {
          setSelectedTabsItem(value?.value);
          onChange?.(value as Item);
        }}
        value={selectedTabsItem}
      >
        <TabList>
          {items.map((item) => (
            <Tab key={item as string} value={item as string}>
              <TitleComponent
                item={item}
                isSelected={item === selectedTabsItem}
              />
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <div className="bg-[--ods-color-primary-050] border border-solid border-[--ods-color-primary-100] border-t-0">
        <ContentComponent item={selectedTabsItem as Item} />
      </div>
    </div>
  );
}

export default TabsComponent;
