import React from 'react';
import { Meta, Story } from '@storybook/react';
import { OdsText } from '@ovhcloud/ods-components/react';
import TabsComponent from './Tabs.component';

type TContinent = {
  name: string;
  countries: string[];
  key: string;
};

export default {
  title: 'Components/Tabs',
  component: TabsComponent,
  parameters: {
    docs: {
      description: {
        component: 'This is an interactive tabs component.',
      },
    },
  },
} as Meta;

const Template: Story<any> = (args) => <TabsComponent<TContinent> {...args} />;

export const Demo = Template.bind({});
Demo.args = {
  items: [
    {
      name: 'Africa',
      countries: ['Morocco', 'Algeria', 'Tunisia'],
      key: 'Africa',
    },
    {
      name: 'Europe',
      countries: ['France', 'Germany', 'germany'],
      key: 'Europe',
    },
    {
      name: 'Asia',
      countries: ['China', 'Japan', 'South Corea'],
      key: 'Asia',
    },
  ] as TContinent[],
  titleElement: (item: TContinent) => (
    <div className="py-2">
      <OdsText preset="span">{item.name}</OdsText>
    </div>
  ),
  contentElement: (item: TContinent) => (
    <ul className="mx-5 px-5 list-disc">
      {item?.countries.map((country) => (
        <li key={country}>
          <OdsText preset="span">{country}</OdsText>
        </li>
      ))}
    </ul>
  ),
  mobileBreakPoint: 400,
};
