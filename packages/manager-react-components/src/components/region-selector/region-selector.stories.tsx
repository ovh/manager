import React from 'react';
import { Story } from '@storybook/react';
import { RegionSelector } from './region-selector.component';

const managerRegionSelector = {
  title: 'Components/RegionSelector',
  component: RegionSelector,
};

const Template: Story<any> = (args) => {
  const [selectedRegion, setSelectedRegion] = React.useState(null);
  return (
    <RegionSelector
      selectedRegion={selectedRegion}
      setSelectedRegion={setSelectedRegion}
      {...args}
    />
  );
};

export const DemoRegionSelector = Template.bind({});

const regionList = [
  'eu-west-par',
  'eu-west-gra',
  'eu-west-rbx',
  'eu-west-sbg',
  'eu-west-lim',
  'eu-central-waw',
  'eu-west-eri',
  'us-east-vin',
  'us-west-hil',
  'ca-east-bhs',
  'ap-southeast-sgp',
  'ap-southeast-syd',
  'eu-west-rbx-snc',
  'eu-west-sbg-snc',
  'ca-east-tor',
  'ap-south-mum',
  'labeu-west-1-preprod',
  'labeu-west-1-dev-2',
  'labeu-west-1-dev-1',
  'eu-west-lz-bru',
  'eu-west-lz-mad',
  'eu-west-gra-snc',
  'us-east-lz-dal',
  'us-west-lz-lax',
  'us-east-lz-chi',
  'us-east-lz-nyc',
  'us-east-lz-mia',
  'us-west-lz-pao',
  'us-west-lz-den',
  'us-east-lz-atl',
  'eu-west-lz-mrs',
];

DemoRegionSelector.args = {
  regionList,
};

export default managerRegionSelector;
