import { Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { ThumbnailRadio } from '@ovh-ux/manager-themes';

export default {
  title: 'Example/Radios',
  component: Radio,
};

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

const TemplateRadio = () => {
  return (
    <>
      <RadioGroup defaultValue="b">
        <ThumbnailRadio value="a" radioTitle="Value A"></ThumbnailRadio>
        <ThumbnailRadio value="b" radioTitle="Value B">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
        </ThumbnailRadio>
        <ThumbnailRadio isInvalid value="c" radioTitle="Value C">
          Pellentesque euismod magna rutrum lectus gravida semper.{' '}
        </ThumbnailRadio>
        <ThumbnailRadio
          isInvalid
          value="d"
          radioTitle="Value D"
          footerText="Check this footer"
        >
          Pellentesque euismod magna rutrum lectus gravida semper.{' '}
        </ThumbnailRadio>
      </RadioGroup>
    </>
  );
};

export const Default = Template.bind({});
export const Disabled = TemplateDisabled.bind({});
export const Invalid = TemplateInvalid.bind({});
export const Thumbnail = TemplateRadio.bind({});
