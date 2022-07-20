import {
  Accordion,
  AccordionPanel,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  Box,
} from '@chakra-ui/react';
import { ComponentMeta } from '@storybook/react';

export default {
  title: 'Example/Accordion',
  component: Accordion,
} as ComponentMeta<typeof Accordion>;

const TemplateBasic = () => (
  <Accordion allowToggle>
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          Section 1 title
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>

    <AccordionItem>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          Section 2 title
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          Section 3 title
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);
export const Basic = TemplateBasic.bind({});
