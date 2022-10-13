import { ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { EllipsisIcon } from '@ovh-ux/manager-themes';
import {
  Menu,
  MenuButton,
  Button,
  IconButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';

export default {
  title: 'Example/Menu',
  component: Menu,
};

const TemplateMenu = () => (
  <Menu>
    <MenuButton
      as={Button}
      variant={'menu'}
      rightIcon={<ChevronDownIcon boxSize={'1.5rem'} />}
    >
      Actions
    </MenuButton>
    <MenuList>
      <MenuGroup title="Lorem ipsum">
        <MenuItem>Action 1 (button)</MenuItem>
        <MenuItem>Action 2 (link / href)</MenuItem>
      </MenuGroup>
      <MenuGroup title="Dolor sit amet">
        <MenuItem isDisabled>Action 3 (disabled)</MenuItem>
      </MenuGroup>
      <MenuDivider />
      <MenuItem icon={<ExternalLinkIcon />}>External link</MenuItem>
      <MenuItem>Start guided tour</MenuItem>
    </MenuList>
  </Menu>
);

const TemplateCompact = () => (
  <Menu>
    <MenuButton
      as={IconButton}
      variant={'iconMenu'}
      icon={<EllipsisIcon boxSize={'1.5rem'} />}
    >
      Actions
    </MenuButton>
    <MenuList>
      <MenuGroup title="Lorem ipsum">
        <MenuItem>Action 1 (button)</MenuItem>
        <MenuItem>Action 2 (link / href)</MenuItem>
      </MenuGroup>
      <MenuGroup title="Dolor sit amet">
        <MenuItem isDisabled>Action 3 (disabled)</MenuItem>
      </MenuGroup>
      <MenuDivider />
      <MenuItem icon={<ExternalLinkIcon />}>External link</MenuItem>
      <MenuItem>Start guided tour</MenuItem>
    </MenuList>
  </Menu>
);

export const Basic = TemplateMenu.bind({});
export const Compact = TemplateCompact.bind({});
