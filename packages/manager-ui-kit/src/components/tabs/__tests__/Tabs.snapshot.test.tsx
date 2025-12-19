import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tabs } from '@/components/tabs/Tabs.component';
import { TabContent } from '@/components/tabs/tab-content/TabContent.component';
import { TabList } from '@/components/tabs/tab-list/TabList.component';
import { Tab } from '@/components/tabs/tab/Tab.component';

describe('Tabs Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <Tabs>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
        <TabContent value="tab1">Tab 1 Content</TabContent>
        <TabContent value="tab2">Tab 2 Content</TabContent>
        <TabContent value="tab3">Tab 3 Content</TabContent>
      </Tabs>,
    );
    expect(container).toMatchSnapshot();
  });
});
