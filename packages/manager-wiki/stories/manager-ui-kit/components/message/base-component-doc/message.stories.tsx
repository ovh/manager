import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  Button,
  BUTTON_COLOR,
  ICON_NAME,
  ICON_NAMES,
  Message,
  MESSAGE_COLOR,
  MESSAGE_COLORS,
  MESSAGE_VARIANT,
  MESSAGE_VARIANTS,
  MessageBody,
  MessageIcon,
  type MessageIconProp,
  type MessageProp,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<MessageProp>;

(Message as any).__docgenInfo = docgenMap.message;
(MessageBody as any).__docgenInfo = docgenMap.messageBody;
(MessageIcon as any).__docgenInfo = docgenMap.messageIcon;

type DemoArg = Partial<MessageProp> & Partial<MessageIconProp>;

const meta: Meta<MessageProp> = {
  argTypes: excludeFromDemoControls(['i18n', 'locale', 'onRemove']),
  component: Message,
  subcomponents: { MessageBody, MessageIcon },
  title: 'Manager UI Kit/Components/Message/Base',
};

export default meta;

export const Demo: StoryObj = {
  render: (arg: DemoArg) => (
    <Message
      color={ arg.color }
      dismissible={ arg.dismissible }
      variant={ arg.variant }>
      <MessageIcon name={ arg.name || ICON_NAME.circleInfo } />

      <MessageBody>
        { arg.children }
      </MessageBody>
    </Message>
  ),
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
        type: { summary: 'MESSAGE_COLOR' },
      },
      control: { type: 'select' },
      options: MESSAGE_COLORS,
    },
    dismissible: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'boolean' },
    },
    name: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'ICON_NAME' },
      },
      control: { type: 'select' },
      options: ICON_NAMES,
    },
    variant: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'MESSAGE_VARIANT' },
      },
      control: { type: 'select' },
      options: MESSAGE_VARIANTS,
    },
  }),
  args: {
    children: 'My message',
  },
};

export const AccessibilityGrouping: Story = {
  globals: {
    imports: `import { ICON_NAME, MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <ul style={{ display: 'flex', flexFlow: 'column', rowGap: '8px', margin: 0, padding: 0, listStyle: 'none' }}>
      <li>
        <Message>
          <MessageIcon name={ ICON_NAME.circleCheck } />

          <MessageBody>
            Your changes have been saved.
          </MessageBody>
        </Message>
      </li>

      <li>
        <Message color={ MESSAGE_COLOR.warning }>
          <MessageIcon name={ ICON_NAME.triangleExclamation } />

          <MessageBody>
            Some fields need your attention.
          </MessageBody>
        </Message>
      </li>
    </ul>
  ),
};

export const AccessibilityAlternativeGrouping: Story = {
  globals: {
    imports: `import { ICON_NAME, MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <div
      role="list"
      style={{ display: 'flex', flexFlow: 'column', rowGap: '8px' }}>
      <Message role="listitem">
        <MessageIcon name={ ICON_NAME.circleCheck } />

        <MessageBody>
          Your changes have been saved.
        </MessageBody>
      </Message>

      <Message
        color={ MESSAGE_COLOR.warning }
        role="listitem">
        <MessageIcon name={ ICON_NAME.triangleExclamation } />

        <MessageBody>
          Some fields need your attention.
        </MessageBody>
      </Message>
    </div>
  ),
};

export const AccessibilityRoles: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { BUTTON_COLOR, ICON_NAME, MESSAGE_COLOR, Button, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [alerts, setAlerts] = useState<string[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);

    return (
      <>
        <div>
          <Button onClick={ () => setStatuses((s) => s.concat([new Date().toString()])) }>
            Add status
          </Button>

          <Button
            color={ BUTTON_COLOR.critical }
            onClick={ () => setAlerts((a) => a.concat([new Date().toString()])) }>
            Add alert
          </Button>
        </div>

        <div role="alert">
          {
            alerts.map((alert) => (
              <Message
                color={ MESSAGE_COLOR.critical }
                key={ alert }>
                <MessageIcon name={ ICON_NAME.hexagonExclamation } />

                <MessageBody >
                  Alert: { alert }
                </MessageBody>
              </Message>
            ))
          }
        </div>

        <div role="status">
          {
            statuses.map((status) => (
              <Message key={ status }>
                <MessageIcon name={ ICON_NAME.circleInfo } />

                <MessageBody >
                  Status: { status }
                </MessageBody>
              </Message>
            ))
          }
        </div>
      </>
    );
  },
};

export const Color: Story = {
  decorators: [(story) => <div style={{ display: 'inline-flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { ICON_NAME, MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Message color={ MESSAGE_COLOR.critical }>
        <MessageIcon name={ ICON_NAME.hexagonExclamation } />

        <MessageBody>Critical message</MessageBody>
      </Message>

      <Message color={ MESSAGE_COLOR.information }>
        <MessageIcon name={ ICON_NAME.circleInfo } />

        <MessageBody>Information message</MessageBody>
      </Message>

      <Message color={ MESSAGE_COLOR.neutral }>
        <MessageIcon name={ ICON_NAME.email } />

        <MessageBody>Neutral message</MessageBody>
      </Message>

      <Message color={ MESSAGE_COLOR.primary }>
        <MessageIcon name={ ICON_NAME.lightbulb } />

        <MessageBody>Primary message</MessageBody>
      </Message>

      <Message color={ MESSAGE_COLOR.success }>
        <MessageIcon name={ ICON_NAME.circleCheck } />

        <MessageBody>Success message</MessageBody>
      </Message>

      <Message color={ MESSAGE_COLOR.warning }>
        <MessageIcon name={ ICON_NAME.triangleExclamation } />

        <MessageBody>Warning message</MessageBody>
      </Message>
    </>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { ICON_NAME, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Message>
      <MessageIcon name={ ICON_NAME.circleInfo } />

      <MessageBody>
        Default message
      </MessageBody>
    </Message>
  ),
};

export const Multiline: Story = {
  globals: {
    imports: `import { ICON_NAME, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Message>
      <MessageIcon name={ ICON_NAME.circleInfo } />

      <MessageBody>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer faucibus, libero et pharetra mattis, ipsum velit semper risus, non ultrices lacus massa sed arcu. Nulla sed tellus.
      </MessageBody>
    </Message>
  ),
};

export const NonDismissible: Story = {
  globals: {
    imports: `import { ICON_NAME, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Message dismissible={ false }>
      <MessageIcon name={ ICON_NAME.circleInfo } />

      <MessageBody>
        Default message
      </MessageBody>
    </Message>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Message>
      <MessageIcon name={ ICON_NAME.circleInfo } />

      <MessageBody>
        Message
      </MessageBody>
    </Message>
  ),
};

export const Variant: Story = {
  decorators: [(story) => <div style={{ display: 'inline-flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { ICON_NAME, MESSAGE_VARIANT, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Message variant={ MESSAGE_VARIANT.default }>
        <MessageIcon name={ ICON_NAME.circleInfo } />

        <MessageBody>
          Default variant Message
        </MessageBody>
      </Message>

      <Message variant={ MESSAGE_VARIANT.light }>
        <MessageIcon name={ ICON_NAME.circleInfo } />

        <MessageBody>
          Light variant Message
        </MessageBody>
      </Message>
    </>
  ),
};
