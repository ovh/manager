import { Story } from '@storybook/react';
import RegionLabel from './region-label.component';

const managerRegionLabel = {
  title: 'Components/Region Label',
  component: RegionLabel,
};

const Template: Story<any> = (args) => <RegionLabel {...args} />;

export const DemoRegion = Template.bind({});

DemoRegion.args = {
  mode: 'region',
  name: 'ca-east-bhs',
};

export const DemoDatacenter = Template.bind({});

DemoDatacenter.args = {
  mode: 'datacenter',
  name: 'RBX',
  micro: 2,
};

export default managerRegionLabel;
