import { Tag, HStack, TagCloseButton, TagLabel } from '@chakra-ui/react';
import { ComponentMeta } from '@storybook/react';

import { CloseIcon } from '@ovh-ux/manager-themes';

export default {
  title: 'Example/Tags',
  component: Tag,
} as ComponentMeta<typeof Tag>;

const TemplateChip = () => (
  <HStack>
    <Tag variant="chip">
      <TagLabel>Dolor</TagLabel>
    </Tag>
    <Tag variant="chip">
      <TagLabel>Sir</TagLabel>
    </Tag>
    <Tag variant="chip">
      <TagLabel>Amet</TagLabel>
    </Tag>
    <Tag variant="chip">
      <TagLabel>Lorem</TagLabel>
    </Tag>
  </HStack>
);

const TemplateClosable = () => (
  <HStack>
    <Tag variant="closable-chip" as="button">
      <TagLabel>Dolor</TagLabel>
      <TagCloseButton as={CloseIcon} />
    </Tag>
    <Tag variant="closable-chip" as="button">
      <TagLabel>Sir</TagLabel>
      <TagCloseButton as={CloseIcon} />
    </Tag>
    <Tag variant="closable-chip" as="button">
      <TagLabel>Amet</TagLabel>
      <TagCloseButton as={CloseIcon} />
    </Tag>
    <Tag variant="closable-chip" as="button">
      <TagLabel>Lorem</TagLabel>
      <TagCloseButton as={CloseIcon} />
    </Tag>
  </HStack>
);

export const Chip = TemplateChip.bind({});
export const Closable = TemplateClosable.bind({});
