import { ChevronRightIcon } from '@ovh-ux/manager-themes';
import { Story } from '@ladle/react';

import { Button } from '@chakra-ui/react';

export default {
  title: 'Example/Buttons',
  component: Button,
};

const Template: Story<any> = (args) => <Button {...args}>{args.label}</Button>;

export const PrimaryLarge = Template.bind({});
PrimaryLarge.args = {
  label: 'Button',
  size: 'large' as 'large' | 'small',
};

export const PrimarySmall = Template.bind({});
PrimarySmall.args = {
  label: 'Button',
  size: 'small',
};

export const SecondaryLarge = Template.bind({});
SecondaryLarge.args = {
  label: 'Button',
  variant: 'secondary',
  size: 'large',
};

export const SecondarySmall = Template.bind({});
SecondarySmall.args = {
  label: 'Button',
  variant: 'secondary',
  size: 'small',
};

export const GhostLarge = Template.bind({});
GhostLarge.args = {
  label: 'Button',
  variant: 'ghost',
  size: 'large',
};

export const GhostSmall = Template.bind({});
GhostSmall.args = {
  label: 'Button',
  variant: 'ghost',
  size: 'small',
};

export const PrimaryIcon = Template.bind({});
PrimaryIcon.args = {
  label: 'Button',
  variant: 'primary',
  size: 'small',
  rightIcon: <ChevronRightIcon></ChevronRightIcon>,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled',
  isDisabled: true,
  variant: 'primary',
};

export const Loading = Template.bind({});
Loading.args = {
  label: 'Loading',
  isLoading: true,
  size: 'large',
  variant: 'primary',
};
