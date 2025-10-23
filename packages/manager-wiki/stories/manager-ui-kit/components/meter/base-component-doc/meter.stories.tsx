import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import { Meter, type MeterProp, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import { orderControls } from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<MeterProp>;

(Meter as any).__docgenInfo = docgenMap.meter;

const meta: Meta<MeterProp> = {
  component: Meter,
  tags: ['new'],
  title: 'Manager UI Kit/Components/Meter/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    high : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    low : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    max : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    min : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    optimum : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    value : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
  }),
};

export const AccessibilityAriaLabel: Story = {
  globals: {
    imports: `import { Meter } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Meter
      aria-label="Gauge"
      low={ 40 }
      value={ 35 } />
  ),
};

export const AccessibilityAriaLabelledby: Story = {
  globals: {
    imports: `import { TEXT_PRESET, Meter, Text } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Text
        id="meter-label"
        preset={ TEXT_PRESET.label }>
        Gauge:
      </Text>

      <Meter
        aria-labelledby="meter-label"
        low={ 40 }
        value={ 35 } />
    </>
  ),
};

export const AccessibilityAriaValuetext: Story = {
  globals: {
    imports: `import { Meter } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Meter
      aria-label="Gauge"
      aria-valuetext="35 files uploaded"
      low={ 40 }
      value={ 35 } />
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Meter } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Meter />
  ),
};

export const Optimum: Story = {
  globals: {
    imports: `import { Meter } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <p>Low optimum and low value:</p>
      <Meter
        high={ 80 }
        low={ 40 }
        optimum={ 30 }
        value={ 20 } />

      <p>Low optimum and high value:</p>
      <Meter
        high={ 80 }
        low={ 40 }
        optimum={ 30 }
        value={ 60 } />

      <p>Low optimum and very high value:</p>
      <Meter
        high={ 80 }
        low={ 40 }
        optimum={ 30 }
        value={ 90 } />
    </>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Meter
      low={ 40 }
      value={ 35 } />
  ),
};

export const Thresholds: Story = {
  globals: {
    imports: `import { Meter } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <p>Value under low threshold:</p>
      <Meter
        low={ 40 }
        value={ 35 } />

      <p>Value between both thresholds:</p>
      <Meter
        high={ 80 }
        low={ 40 }
        value={ 60 } />

      <p>Value above high threshold:</p>
      <Meter
        high={ 80 }
        value={ 90 } />
    </>
  ),
};
