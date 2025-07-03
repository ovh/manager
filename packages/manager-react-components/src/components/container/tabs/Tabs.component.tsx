import { useState } from 'react';
import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';

type TProps<Item> = {
  items?: Item[];
  titleElement?: (item: Item, isSelected?: boolean) => JSX.Element | string;
  contentElement?: (item: Item) => JSX.Element;
  className?: string;
  onChange?: (item: Item) => void;
};

export function TabsComponent<Item>({
  items = [],
  titleElement = (item) => <div>{`title ${item}`}</div>,
  contentElement = (item) => <div>{`content ${item}`}</div>,
  className,
  onChange,
}: TProps<Item>): JSX.Element {
  const [selectedTabsItem, setSelectedTabsItem] = useState<string>(
    items?.[0] as string,
  );

  return (
    <section className={className}>
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
              {titleElement(item, item === selectedTabsItem)}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <div className="bg-[--ods-color-primary-050] border border-solid border-[--ods-color-primary-100] border-t-0">
        {contentElement(selectedTabsItem as Item)}
      </div>
    </section>
  );
}

export default TabsComponent;
