import { Meta } from '@storybook/react';
import { MESSAGE_VARIANT, MESSAGE_COLOR } from '@ovhcloud/ods-react';
import { ActionBanner, ActionBannerProps } from '@ovh-ux/muk';

export const Default = {
  args: {
    message:
      'This is a test message. <strong>This message is in bold.</strong>',
    variant: MESSAGE_VARIANT.default,
    color: MESSAGE_COLOR.information,
    dismissible: true,
  },
};

const SampleActionBanner: Meta<ActionBannerProps> = {
  title: 'Manager UI Kit/Components/Action Banner',
  component: ActionBanner,
};

export const ActionBannerWithMessageVariants: Meta<ActionBannerProps> = {
  decorators: [
    (story) => (
      <div
        style={{
          display: 'inline-flex',
          flexFlow: 'column',
          gap: '8px',
        }}
      >
        {story()}
      </div>
    ),
  ],
  render: () => (
    <>
      <ActionBanner message="Critical message" color={MESSAGE_COLOR.critical} />
      <ActionBanner message="Danger message" color={MESSAGE_COLOR.danger} />
      <ActionBanner
        message="Information message"
        color={MESSAGE_COLOR.information}
      />
      <ActionBanner message="Success message" color={MESSAGE_COLOR.success} />
      <ActionBanner message="Warning message" color={MESSAGE_COLOR.warning} />
    </>
  ),
};

export const ActionBannerWithButton: Meta<ActionBannerProps> = {
  title: 'Manager UI Kit/Components/ActionBanner',
  args: {
    ...Default.args,
    label: 'Click Me!',
    onClick: () => {},
  },
  component: ActionBanner,
};

export const ActionBannerWithLink: Meta<ActionBannerProps> = {
  title: 'Manager UI Kit/Components/ActionBanner',
  args: {
    ...Default.args,
    label: 'Click Me!',
    href: 'https://www.ovhcloud.com/',
  },
  component: ActionBanner,
};

export default SampleActionBanner;
