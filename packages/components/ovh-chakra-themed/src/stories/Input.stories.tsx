import { ComponentMeta } from '@storybook/react';
import { Input, chakra } from '@chakra-ui/react';

export default {
  title: 'Example/Inputs',
  component: Input,
} as ComponentMeta<typeof Input>;

const TemplateInvalid = () => (
  <>
    <Input placeholder="Please insert your text..." isInvalid></Input>
  </>
);
const Template = () => <Input placeholder="Please insert your text..."></Input>;
const TemplateDisabled = () => (
  <Input placeholder="Please insert your text..." disabled></Input>
);
const TemplateReadOnly = () => (
  <Input placeholder="Please insert your text..." readOnly></Input>
);
const TemplateVariants = () => (
  <>
    <chakra.p color="uikit.800-text" fontWeight="bold">
      Warning
    </chakra.p>
    <Input placeholder="Please insert your text..." variant="warning"></Input>
    <chakra.p color="uikit.800-text" fontWeight="bold">
      Success
    </chakra.p>
    <Input placeholder="Please insert your text..." variant="success"></Input>
  </>
);

export const Inputs = Template.bind({});
export const InputDisabled = TemplateDisabled.bind({});
export const InputReadonly = TemplateReadOnly.bind({});
export const InputInvalid = TemplateInvalid.bind({});

export const InputVariants = TemplateVariants.bind({});
