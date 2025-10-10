import { Meta } from '@storybook/react';
import { BADGE_COLOR, BADGE_SIZE, Icon, ICON_NAME } from '@ovhcloud/ods-react';
import { Badge, BadgeProps } from '@ovh-ux/muk';

export const Default = {
  args: {
    children: 'Active',
    color: BADGE_COLOR.information,
    size: BADGE_SIZE.md,
  },
};

function renderComponent({ children, ...args }) {
  return <Badge {...args}>{children}</Badge>;
}

const simpleBadge: Meta<BadgeProps> = {
  title: 'Manager UI Kit/Components/Badges/Badge',
  render: renderComponent,
  parameters: {
    docs: {
      description: {
        component:
          'The `Badge` component is used display information for a status.',
      },
    },
  },
};

export const BadgeWithIcon: Meta<BadgeProps> = {
  title: 'Manager UI Kit/Components/Badge',
  args: {
    ...Default.args,
    children: (
      <>
        <Icon name={ICON_NAME.circleInfo}></Icon> Active
      </>
    ),
  },
  render: renderComponent,
  parameters: {
    docs: {
      description: {
        component:
          'The `Badge` component is used display information for a status.',
      },
    },
  },
};

export const BadgeWithLoader: Meta<BadgeProps> = {
  title: 'Manager UI Kit/Components/Badge',
  args: {
    isLoading: true,
    ...Default.args,
    children: (
      <>
        <Icon name={ICON_NAME.circleInfo}></Icon> Active
      </>
    ),
  },
  render: renderComponent,
  parameters: {
    docs: {
      description: {
        component:
          'The `Badge` component is used display information for a status.',
      },
    },
  },
};

export default simpleBadge;
