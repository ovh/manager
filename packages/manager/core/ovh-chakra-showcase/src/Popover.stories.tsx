import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@ovh-ux/manager-themes';

export default {
  title: 'Example/Popover',
  component: Popover,
};

const Template = () => (
  <Popover>
    <PopoverTrigger>
      <Button variant="secondary">Trigger</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverBody>
        <VStack spacing="4">
          <FormControl>
            <FormLabel>Column</FormLabel>
            <Select icon={<ChevronDownIcon />}>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Operator</FormLabel>
            <Select icon={<ChevronDownIcon />}>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Value</FormLabel>
            <Input></Input>
          </FormControl>
          <Button w="100%">Add</Button>
        </VStack>
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

const TemplateHeader = () => (
  <Popover>
    <PopoverTrigger>
      <Button>Trigger</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Confirmation!</PopoverHeader>
      <PopoverBody>
        <VStack spacing="4">
          <FormControl>
            <FormLabel>Column</FormLabel>
            <Select icon={<ChevronDownIcon />}>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Operator</FormLabel>
            <Select icon={<ChevronDownIcon />}>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Value</FormLabel>
            <Input></Input>
          </FormControl>
          <Button w="100%">Add</Button>
        </VStack>
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

export const Default = Template.bind({});
export const Header = TemplateHeader.bind({});
