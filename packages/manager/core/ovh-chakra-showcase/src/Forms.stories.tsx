import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';
import { useState } from 'react';

export default {
  title: 'Example/Forms',
  component: FormControl,
};

const Template = () => (
  <FormControl>
    <FormLabel>Label</FormLabel>
    <Input placeholder="Please insert your text..."></Input>
    <FormErrorMessage>Mandatory.</FormErrorMessage>
  </FormControl>
);

const TemplateHelper = () => (
  <FormControl>
    <FormLabel>Label</FormLabel>
    <Input placeholder="Please insert your text..."></Input>
    <FormHelperText>Lorem ipsum dolor sit amet</FormHelperText>
    <FormErrorMessage>Mandatory.</FormErrorMessage>
  </FormControl>
);

const TemplateInvalid = () => {
  const [value, setValue] = useState<string>('');

  return (
    <FormControl isInvalid={value === ''}>
      <FormLabel>Label</FormLabel>
      <Input
        placeholder="Please insert your text..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></Input>
      <FormErrorMessage>Mandatory.</FormErrorMessage>
    </FormControl>
  );
};

export const Inputs = Template.bind({});
export const InputHelper = TemplateHelper.bind({});
export const InputInvalid = TemplateInvalid.bind({});
