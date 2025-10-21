import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_COLORS,
  BUTTON_SIZE,
  BUTTON_SIZES,
  BUTTON_VARIANT,
  BUTTON_VARIANTS,
  type ButtonProp,
  Icon,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import { orderControls } from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';

type Story = StoryObj<ButtonProp>;

const meta: Meta<ButtonProp> = {
  component: Button,
  title: 'Manager UI Kit/Components/Button/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    children: {
      table: {
        category: CONTROL_CATEGORY.slot,
      },
      control: 'text',
    },
    color: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'BUTTON_COLOR' },
      },
      control: { type: 'select' },
      options: BUTTON_COLORS,
    },
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: 'boolean',
    },
    loading: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    size: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'BUTTON_SIZE' }
      },
      control: { type: 'select' },
      options: BUTTON_SIZES,
    },
    variant: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'BUTTON_VARIANT' }
      },
      control: { type: 'select' },
      options: BUTTON_VARIANTS,
    },
  }),
  args: {
    children: 'My button',
  },
};

export const Color: StoryObj = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'row', gap: '8px', alignItems: 'center' }}>{ story() }</div>],
  globals: {
    imports: `import { BUTTON_COLOR, Button } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Button color={ BUTTON_COLOR.critical }>Critical</Button>
      <Button color={ BUTTON_COLOR.information }>Information</Button>
      <Button color={ BUTTON_COLOR.neutral }>Neutral</Button>
      <Button color={ BUTTON_COLOR.primary }>Primary</Button>
      <Button color={ BUTTON_COLOR.success }>Success</Button>
      <Button color={ BUTTON_COLOR.warning }>Warning</Button>
    </>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Button } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Button>
      My button
    </Button>
  ),
};

export const Loading: StoryObj = {
  globals: {
    imports: `import { Button } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Button loading={ true }>
      Loading button
    </Button>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
  },
  render: ({}) => (
    <Button>
      Button
    </Button>
  ),
};

export const Size: StoryObj = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'row', gap: '8px', alignItems: 'center' }}>{ story() }</div>],
  globals: {
    imports: `import { BUTTON_SIZE, Button } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Button size={ BUTTON_SIZE.md }>MD button</Button>
      <Button size={ BUTTON_SIZE.sm }>SM button</Button>
      <Button size={ BUTTON_SIZE.xs }>XS button</Button>
    </>
  ),
};

export const Variant: StoryObj = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'row', gap: '8px', alignItems: 'center' }}>{ story() }</div>],
  globals: {
    imports: `import { BUTTON_VARIANT, Button } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Button variant={ BUTTON_VARIANT.default }>Default button</Button>
      <Button variant={ BUTTON_VARIANT.outline }>Outline button</Button>
      <Button variant={ BUTTON_VARIANT.ghost }>Ghost button</Button>
    </>
  ),
};

export const AccessibilityExplicitTextContent: StoryObj = {
  globals: {
    imports: `import { Button } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Button>
      Clear
    </Button>
  ),
}

export const AccessibilityIconOnly: StoryObj = {
  globals: {
    imports: `import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Button aria-label='Clear'>
        <Icon name={ ICON_NAME.xmark } />
    </Button>
  ),
}

export const AccessibilityBadPracticeIconOnly: StoryObj = {
  globals: {
    imports: `import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Button>
      <Icon name={ ICON_NAME.xmark } />
    </Button>
  ),
}

export const AccessibilityLabelledBy: StoryObj = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'row', gap: '8px', alignItems: 'center' }}>{ story() }</div>],
  globals: {
    imports: `import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Button aria-labelledby="filter-btn">
        <Icon name={ ICON_NAME.filter } />
      </Button>
      <span id="filter-btn">Filter your search results</span>
    </>
  ),
}

export const AccessibilityBadPracticeLabelledBy: StoryObj = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'row', gap: '8px', alignItems: 'center' }}>{ story() }</div>],
  globals: {
    imports: `import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Button>
        <Icon name={ ICON_NAME.filter } />
      </Button>
      <span>Filter your search results</span>
    </>
  ),
}

export const AccessibilityBadPracticesRoleStatus: Story = {
  globals: {
    imports: `import { Button } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: () => {
    const [message, setMessage] = useState('');

    const handleClick = () => {
      setMessage('Copied to clipboard.');
    };

    return (
      <>
        <Button onClick={ handleClick }>
          Copy
        </Button>

        <span style={{ marginLeft: '1rem' }}>
          { message }
        </span>
      </>
    );
  },
};

export const AccessibilityRoleStatus: Story = {
  globals: {
    imports: `import { Button } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: () => {
    const [message, setMessage] = useState('');

    const handleClick = () => {
      setMessage('Copied to clipboard.');
    };

    return (
      <>
        <Button onClick={ handleClick }>
          Copy
        </Button>

        <span
          aria-live="polite"
          role="status"
          style={{ marginLeft: '1rem' }}>
          { message }
        </span>
      </>
    );
  },
};

export const AccessibilityBadPracticesRoleAlert: Story = {
  globals: {
    imports: `import { Button } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: () => {
    const [error, setError] = useState('');

    const handleClick = () => {
      setError('A critical error occurred while saving.');
    };

    return (
      <>
        <Button onClick={ handleClick }>
          Save
        </Button>

        <span style={{ marginLeft: '1rem', color: 'red' }}>
          { error }
        </span>
      </>
    );
  },
};


export const AccessibilityRoleAlert: Story = {
  globals: {
    imports: `import { Button } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: () => {
    const [error, setError] = useState('');

    const handleClick = () => {
      setError('A critical error occurred while saving!');
    };

    return (
      <>
        <Button onClick={ handleClick }>
          Save
        </Button>

        <span
          role="alert"
          style={{ marginLeft: '1rem', color: 'red' }}>
          { error }
        </span>
      </>
    );
  },
};
