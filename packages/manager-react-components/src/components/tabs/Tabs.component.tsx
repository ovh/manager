import { useState } from 'react';
import { Tabs, TabList, Tab, TabsValueChangeEvent } from '@ovhcloud/ods-react';
import { TabsProps } from './Tabs.props';

export function TabsComponent<Item>({
  items = [],
  titleElement = ({ item }) => <>{`${item}`}</>,
  contentElement = ({ item }) => <>{`${item}`}</>,
  className,
  onChange,
}: TabsProps<Item>): JSX.Element {
  const [selectedTabItem, setselectedTabItem] = useState<string>(
    items?.[0] as string,
  );

  const TitleComponent = titleElement;
  const ContentComponent = contentElement;

  return (
    <div className={className}>
      <Tabs
        onValueChange={(value: TabsValueChangeEvent) => {
          setselectedTabItem(value?.value);
          onChange?.(value as Item);
        }}
        value={selectedTabItem}
      >
        <TabList>
          {items.map((item) => (
            <Tab key={item as string} value={item as string}>
              <TitleComponent
                item={item}
                isSelected={item === selectedTabItem}
              />
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <div className="bg-[--ods-color-primary-050] border border-solid border-[--ods-color-primary-100] border-t-0">
        <ContentComponent item={selectedTabItem as Item} />
      </div>
    </div>
  );
}

export default TabsComponent;
