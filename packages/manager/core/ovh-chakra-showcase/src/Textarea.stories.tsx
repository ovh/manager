import { Stack, Textarea } from '@chakra-ui/react';

export default {
  title: 'Example/Textareas',
  component: Textarea,
};

const Template = () => <Textarea>Lorem Ipsum</Textarea>;
const TemplateDisabled = () => <Textarea isDisabled>Lorem Ipsum</Textarea>;
const TemplateInvalid = () => <Textarea isInvalid>Lorem Ipsum</Textarea>;
const TemplateStatuses = () => (
  <Stack>
    <Textarea>Lorem Ipsum</Textarea>
    <Textarea variant="success">Lorem Ipsum</Textarea>
    <Textarea variant="warning">Lorem Ipsum</Textarea>
  </Stack>
);

export const Default = Template.bind({});
export const Disabled = TemplateDisabled.bind({});
export const Invalid = TemplateInvalid.bind({});
export const Statuses = TemplateStatuses.bind({});
