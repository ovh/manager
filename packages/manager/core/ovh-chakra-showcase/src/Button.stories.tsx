import { ChevronRightIcon } from '@ovh-ux/manager-themes';
import { Story } from '@ladle/react';

import { Button, Stack, HStack, chakra } from '@chakra-ui/react';

export default {
  title: 'Example/Buttons',
  component: Button,
};

const Template: Story<any> = (args) => <Button {...args}>{args.label}</Button>;
const TemplateAll = () => (
  <Stack spacing={6}>
    <HStack>
      <Button>Button</Button>
      <Button variant="secondary">Button</Button>
      <Button variant="ghost">Button</Button>
      <Button variant="table">Button</Button>
    </HStack>
    <HStack>
      <Button size="large">Button</Button>
      <Button size="large" variant="secondary">
        Button
      </Button>
      <Button size="large" variant="ghost">
        Button
      </Button>
      <Button size="large" variant="table">
        Button
      </Button>
    </HStack>
    <HStack>
      <Button rightIcon={<ChevronRightIcon />} size="small">
        Button
      </Button>
      <Button rightIcon={<ChevronRightIcon />} size="small" variant="secondary">
        Button
      </Button>
      <Button rightIcon={<ChevronRightIcon />} size="small" variant="ghost">
        Button
      </Button>
      <Button rightIcon={<ChevronRightIcon />} size="small" variant="table">
        Table
      </Button>
    </HStack>
    <HStack>
      <Button isDisabled>Button</Button>
      <Button isDisabled variant="secondary">
        Button
      </Button>
      <Button isDisabled variant="ghost">
        Button
      </Button>
    </HStack>
    <HStack>
      <Button isLoading>Button</Button>
      <Button isLoading variant="secondary">
        Button
      </Button>
      <Button isLoading variant="ghost">
        Button
      </Button>
    </HStack>
  </Stack>
);
export const All = TemplateAll.bind({});

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
