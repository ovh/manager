import { type Meta, type StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import {
  FormField,
  FormFieldLabel,
  Range,
  type RangeProp,
  type RangeValueChangeDetail,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<RangeProp>;

(Range as any).__docgenInfo = docgenMap.range;

type DemoArg = Partial<RangeProp> & {
  dualRange?: boolean,
};

const meta: Meta<RangeProp> = {
  argTypes: excludeFromDemoControls(['aria-label', 'aria-labelledby', 'defaultValue', 'max', 'min', 'name', 'onDragging', 'onValueChange', 'ticks', 'value']),
  component: Range,
  title: 'Manager UI Kit/Components/Range/Base',
};

export default meta;

export const Demo: StoryObj = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', height: '80vh' }}>{ story() }</div>],
  render: ({ dualRange, ...arg }: DemoArg) => {
    const MAX_VALUE = 100;
    const [values, setValues] = useState([0]);

    useEffect(() => {
      if (dualRange) {
        const step = arg.step || 1;
        const newValue = values[0] === MAX_VALUE ? values[0] - step : values[0];
        setValues([newValue, newValue + step]);
      } else {
        setValues([values[0]]);
      }
    }, [dualRange]);

    return (
      <Range
        { ...arg }
        max={ MAX_VALUE }
        onDragging={ ({ value }) => setValues(value) }
        value={ values } />
    );
  },
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'boolean' },
    },
    displayBounds: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'boolean' },
    },
    displayTooltip: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'boolean' },
    },
    dualRange: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: { type: 'boolean' },
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    step: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'number',
    },
  }),
};

export const Controlled: Story = {
  globals: {
    imports: `import { Range } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [draggingValue, setDraggingValue] = useState<number>();
    const [value, setValue] = useState<number>();

    function onDragging(detail: RangeValueChangeDetail) {
      setDraggingValue(detail.value[0]);
    }

    function onValueChange(detail: RangeValueChangeDetail) {
      setValue(detail.value[0]);
    }

    return (
      <>
        <p>
          <span>Final value: { value }</span>
          <br />
          <span>Dragged value: { draggingValue }</span>
        </p>

        <Range
          onDragging={ onDragging }
          onValueChange={ onValueChange }
          value={ draggingValue ? [draggingValue] : undefined } />
      </>
    );
  },
};

export const Default: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', rowGap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { Range } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Range />

      <Range defaultValue={ [50, 75] } />
    </>
  ),
};

export const Disabled: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', rowGap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { Range } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Range
        defaultValue={ [20] }
        disabled />

      <Range
        defaultValue={ [50, 75] }
        disabled />
    </>
  ),
};

export const InFormField: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', rowGap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { FormField, FormFieldLabel, Range } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Range:
      </FormFieldLabel>

      <Range />
    </FormField>
  ),
};

export const MaxMin: Story = {
  globals: {
    imports: `import { Range } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <p>Max 500</p>
      <Range
        defaultValue={ [50] }
        max={ 500 } />
      <Range
        defaultValue={ [50, 75] }
        max={ 500 } />

      <p>Min 25</p>
      <Range
        defaultValue={ [50] }
        min={ 25 } />
      <Range
        defaultValue={ [50, 75] }
        min={ 25 } />

      <p>Max 75 & Min 25</p>
      <Range
        defaultValue={ [50] }
        max={ 75 }
        min={ 25 } />
      <Range
        defaultValue={ [50, 75] }
        max={ 75 }
        min={ 25 } />
    </>
  ),
};

export const Overview: Story = {
  decorators: [(story) => <div style={{ width: '160px' }}>{ story() }</div>],
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Range defaultValue={ [50] } />
  ),
};

export const Step: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', rowGap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { Range } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Range
        defaultValue={ [20] }
        step={ 5 } />

      <Range
        defaultValue={ [50, 75] }
        step={ 5 } />
    </>
  ),
};

export const Ticks: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', rowGap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { Range } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Range
        defaultValue={ [20] }
        ticks={ [10, 20, 30, 40, 50, 60, 70, 80, 90] } />

      <Range
        defaultValue={ [50, 75] }
        ticks={ [10, 20, 30, 40, 50, 60, 70, 80, 90] } />
    </>
  ),
};

export const TicksLabels: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', rowGap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { Range } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Range ticks={[
        { label: 'Low', value: 25 },
        { label: 'Medium', value: 50 },
        { label: 'High', value: 75 },
      ]} />

      <Range
        displayBounds={ false }
        displayTooltip={ false }
        max={ 5 }
        min={ 1 }
        ticks={[
          { label: 'Very Poor', value: 1 },
          { label: 'Poor', value: 2 },
          { label: 'Average', value: 3 },
          { label: 'Good', value: 4 },
          { label: 'Excellent', value: 5 },
        ]} />
    </>
  ),
};

export const AccessibilityFormField: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, Range } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Volume
      </FormFieldLabel>

      <Range defaultValue={ [50] } />
    </FormField>
  ),
};

export const AccessibilityDescriptiveSubLabel: Story = {
  globals: {
    imports: `import { TEXT_PRESET, FormField, FormFieldLabel, Range, Text } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  tags: ['!dev'],
  render: ({}) => {
    const [values, setValues] = useState([30, 70]);

    return (
      <FormField>
        <FormFieldLabel id="range-label">
          Price range
        </FormFieldLabel>

        <Text
          aria-live="polite"
          id="range-sublabel"
          preset={ TEXT_PRESET.caption }>
          Selected values: { values[0] } - { values[1] }€
        </Text>

        <Range
          aria-labelledby={ ['range-label', 'range-sublabel'] }
          onDragging={ ({ value }) => setValues(value) }
          value={ values } />
      </FormField>
    );
  },
};
