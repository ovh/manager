import { Meta } from '@storybook/react';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { Badge, BadgeProps } from './badge.component';

export const Default = {
  args: {
    color: ODS_BADGE_COLOR.information,
    label: 'active',
    size: ODS_BADGE_SIZE.md,
    icon: ODS_ICON_NAME.circleInfo,
  },
};

const simpleBadge: Meta<BadgeProps> = {
  title: 'Core/manager-react-components/Components/Badge',
  component: Badge,
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
