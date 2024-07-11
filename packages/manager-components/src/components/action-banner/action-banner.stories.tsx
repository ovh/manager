import { Meta } from '@storybook/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { ActionBanner, ActionBannerProps } from './action-banner.component';

export const Default = {
  args: {
    title:
      'Lorem ipsum dolor sit amet consectetur. Commodo non egestas libero dictumst orci ',
    description:
      'Lorem ipsum dolor sit amet consectetur. Mattis mattis purus in at in sed scelerisque eget.',
    cta: 'I am a link always under the text',
    onClick: () => console.log('clicked'),
    type: ODS_MESSAGE_TYPE.info,
    isRemovable: true,
  },
};

export const WithoutTitle = {
  args: {
    description:
      'Lorem ipsum dolor sit amet consectetur. Mattis mattis purus in at in sed scelerisque eget.',
    type: ODS_MESSAGE_TYPE.info,
  },
};

export const WithoutLink = {
  args: {
    title:
      'Lorem ipsum dolor sit amet consectetur. Commodo non egestas libero dictumst orci ',
    description:
      'Lorem ipsum dolor sit amet consectetur. Mattis mattis purus in at in sed scelerisque eget.',
    type: ODS_MESSAGE_TYPE.info,
  },
};

export const Warning = {
  args: {
    description:
      'Programme bêta pour Public Cloud : testez nos solutions s’appuyant sur OpenStack (Load Balancer, instance de routage, Floating IP et Bare Metal as a Service).',
    cta: 'Activer le projet',
    type: ODS_MESSAGE_TYPE.warning,
  },
};

const actionBanner: Meta<ActionBannerProps> = {
  title: 'Components/Action Banner',
  component: ActionBanner,
};

export default actionBanner;
