import { ComponentMeta } from '@storybook/react';
import { Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { useState } from 'react';

export default {
  title: 'Example/Radios',
  component: Radio,
} as ComponentMeta<typeof Radio>;

const Template = () => {
  const [value, setValue] = useState('1');

  return (
    <RadioGroup onChange={setValue} value={value}>
      <Stack>
        <Radio value="1">Value A</Radio>
        <Radio value="2">Value B</Radio>
        <Radio value="3">Value C</Radio>
      </Stack>
    </RadioGroup>
  );
};

const TemplateDisabled = () => (
  <RadioGroup value="b">
    <Stack>
      <Radio value="a" isDisabled>
        Value B
      </Radio>
      <Radio value="b" isDisabled>
        Value C
      </Radio>
      <Radio value="c" isChecked isInvalid isDisabled>
        Value D
      </Radio>
    </Stack>
  </RadioGroup>
);

const TemplateInvalid = () => (
  <RadioGroup>
    <Stack>
      <Radio value="x" isInvalid>
        Value B
      </Radio>
      <Radio value="y" isChecked isInvalid>
        Value C
      </Radio>
    </Stack>
  </RadioGroup>
);

export const Default = Template.bind({});
export const Disabled = TemplateDisabled.bind({});
export const Invalid = TemplateInvalid.bind({});
