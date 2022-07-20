import { ComponentMeta } from '@storybook/react';
import { Select, Stack } from '@chakra-ui/react';

import { ChevronDownIcon } from '@ovh-ux/manager-themes';

export default {
  title: 'Example/Selects',
  component: Select,
} as ComponentMeta<typeof Select>;

const Template = () => (
  <Select icon={<ChevronDownIcon />} placeholder="Select option">
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </Select>
);

const TemplateInvalid = () => (
  <Select icon={<ChevronDownIcon />} placeholder="Select option" isInvalid>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </Select>
);

const TemplateDisabled = () => (
  <Select icon={<ChevronDownIcon />} placeholder="Select option" isDisabled>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </Select>
);

const TemplateVariants = () => (
  <Stack>
    <Select icon={<ChevronDownIcon />} placeholder="Select option" variant="success">
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </Select>
    <Select icon={<ChevronDownIcon />} placeholder="Select option" variant="warning">
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </Select>
    <Select icon={<ChevronDownIcon />} placeholder="Select option">
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </Select>
  </Stack>
);

export const Default = Template.bind({});
export const Disabled = TemplateDisabled.bind({});
export const Invalid = TemplateInvalid.bind({});
export const Statuses = TemplateVariants.bind({});
