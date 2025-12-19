import { Meta, StoryObj } from '@storybook/react';
import {
  BUTTON_VARIANT,
  ICON_NAME,
  POPOVER_POSITION,
} from '@ovhcloud/ods-react';
import { ActionMenu, ActionMenuItem, ActionMenuProps } from '@ovh-ux/muk';

const actionItems: ActionMenuItem[] = [
  {
    id: 1,
    href: 'https://www.ovhcloud.com',
    target: '_blank',
    label: 'external link',
  },
  {
    id: 2,
    href: `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ name: 'john' }),
    )}`,
    download: 'test.json',
    target: '_blank',
    label: 'download',
  },
  {
    id: 3,
    href: 'https://ovhcloud.com',
    target: '_blank',
    label: 'disabled link',
    isDisabled: true,
  },
  {
    id: 4,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'action',
    isDisabled: true,
  },
  {
    id: 5,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'button disabled',
    isDisabled: true,
  },
  {
    id: 6,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'action without iam permissions',
    urn: 'urn:v9:eu:resource:manager-ui-kit:vrz-a878-dsflkds-fdsfsd',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
];

type Story = StoryObj<typeof ActionMenu>;

export const Default: Story = {
  args: {
    id: 'action-menu-default',
    items: actionItems,
    isCompact: false,
    popoverPosition: POPOVER_POSITION.bottom,
    variant: BUTTON_VARIANT.outline,
    displayIcon: true,
    isDisabled: false,
    isLoading: false,
  },
  parameters: {
    docs: {
      source: {
        code: `const actionItems = [
  {
    id: 1,
    href: 'https://www.ovhcloud.com',
    target: '_blank',
    label: 'external link',
  },
  {
    id: 2,
    onClick: () => handleAction(),
    label: 'action',
  },
];

<ActionMenu
  id="action-menu-default"
  items={actionItems}
  isCompact={false}
  popoverPosition={POPOVER_POSITION.bottom}
  variant={BUTTON_VARIANT.outline}
/>`,
      },
    },
  },
};

export const Compact: Story = {
  args: {
    id: 'action-menu-compact',
    items: actionItems,
    isCompact: true,
    popoverPosition: POPOVER_POSITION.bottom,
  },
  parameters: {
    docs: {
      source: {
        code: `<ActionMenu
  id="action-menu-compact"
  items={actionItems}
  isCompact={true}
  popoverPosition={POPOVER_POSITION.bottom}
/>`,
      },
    },
  },
};

export const Loading: Story = {
  args: {
    id: 'action-menu-loading',
    items: actionItems,
    isLoading: true,
    isCompact: false,
  },
};

export const Disabled: Story = {
  args: {
    id: 'action-menu-disabled',
    items: actionItems,
    isDisabled: true,
    isCompact: false,
  },
};

export const CustomLabel: Story = {
  args: {
    id: 'action-menu-custom-label',
    items: actionItems,
    label: 'Custom Actions',
    isCompact: false,
  },
};

export const DifferentVariants: Story = {
  args: {
    id: 'action-menu-ghost',
    items: actionItems,
    variant: BUTTON_VARIANT.ghost,
    isCompact: false,
  },
};

export const CustomIcon: Story = {
  args: {
    id: 'action-menu-custom-icon',
    items: actionItems,
    icon: ICON_NAME.ellipsisHorizontal,
    isCompact: false,
  },
};

export const PositionTop: Story = {
  args: {
    id: 'action-menu-top',
    items: actionItems,
    popoverPosition: POPOVER_POSITION.top,
    isCompact: false,
  },
};

const meta: Meta<ActionMenuProps> = {
  title: 'Manager UI Kit/Components/ActionMenu',
  component: ActionMenu,
  tags: ['autodocs'],
  args: {
    id: 'action-menu-example',
    items: actionItems,
    isCompact: false,
    popoverPosition: POPOVER_POSITION.bottom,
    variant: BUTTON_VARIANT.outline,
    displayIcon: true,
    isDisabled: false,
    isLoading: false,
  },
  argTypes: {
    // Content
    items: {
      control: { type: 'object' },
      table: { category: 'Content' },
    },
    id: {
      control: { type: 'text' },
      table: { category: 'Content' },
    },
    label: {
      control: { type: 'text' },
      table: { category: 'Content' },
    },
    // Appearance
    isCompact: {
      control: { type: 'boolean' },
      table: { category: 'Appearance' },
    },
    displayIcon: {
      control: { type: 'boolean' },
      table: { category: 'Appearance' },
    },
    icon: {
      control: { type: 'select' },
      options: Object.values(ICON_NAME),
      table: { category: 'Appearance' },
    },
    variant: {
      control: { type: 'select' },
      options: Object.values(BUTTON_VARIANT),
      table: { category: 'Appearance' },
    },
    // Layout
    popoverPosition: {
      control: { type: 'select' },
      options: Object.values(POPOVER_POSITION),
      table: { category: 'Layout' },
    },
    // State
    isDisabled: {
      control: { type: 'boolean' },
      table: { category: 'State' },
    },
    isLoading: {
      control: { type: 'boolean' },
      table: { category: 'State' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `ActionMenu` component provides a dropdown menu with multiple action items. It supports links, downloads, custom actions, IAM permissions, and various styling options. Use it to group related actions in a compact interface.',
      },
    },
  },
};

export default meta;
