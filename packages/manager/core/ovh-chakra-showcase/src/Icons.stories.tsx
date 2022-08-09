import { Box, Flex, Icon } from '@chakra-ui/react';
import { Story } from '@ladle/react';

import {
  AddIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  ArrowRightIcon,
  ArrowDownRightIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowTransferIcon,
  BellIcon,
  BinIcon,
  BookIcon,
  CalendarIcon,
  CartIcon,
  ChatIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUpDownIcon,
  ClockWaitIcon,
  CloseIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  EllipsisIcon,
  EqualIcon,
  EmailIcon,
  ErrorIcon,
  ErrorCircleIcon,
  ExternalLinkIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  FileIcon,
  FilterIcon,
  FolderIcon,
  GearIcon,
  GuidesIcon,
  HamburgerIcon,
  HelpIcon,
  HelpCircleIcon,
  HomeIcon,
  IndeterminateIcon,
  InfoIcon,
  InfoCircleIcon,
  LightbulbIcon,
  ListIcon,
  LocationIcon,
  LockIcon,
  MinusIcon,
  OKIcon,
  OVHIcon,
  PenIcon,
  PhoneIcon,
  PlusIcon,
  PrinterIcon,
  RefreshIcon,
  RemoveIcon,
  SearchIcon,
  SettingsIcon,
  ShapeCircleIcon,
  ShapeDotIcon,
  SuccessIcon,
  SuccessCircleIcon,
  SortIcon,
  SortUpIcon,
  SortDownIcon,
  SortInactiveIcon,
  TimeIcon,
  TriangleUpIcon,
  TriangleRightIcon,
  TriangleDownIcon,
  TriangleLeftIcon,
  TruckIcon,
  UserIcon,
  WarningIcon,
  WarningCircleIcon,
} from '@ovh-ux/manager-themes';

export default {
  title: 'Example/Icons',
  component: Icon,
};
function IconCard({ iconProps, iconName, Icon }: any) {
  return (
    <Box textAlign="center" minW="10rem" my="1rem">
      <Box
        h="4rem"
        w="4rem"
        p="1em"
        borderWidth="1px"
        textAlign="center"
        bg="uikit.50"
        boxShadow="secondary"
        m="auto"
        mb=".5rem"
      >
        <Icon {...iconProps} />
      </Box>
      <div>{iconName}</div>
    </Box>
  );
}

const TemplateSystemIcons: Story<typeof Icon> = (args) => (
  <Flex flexWrap="wrap">
    <IconCard iconProps={args} iconName={'AddIcon'} Icon={AddIcon} />
    <IconCard iconProps={args} iconName={'ArrowUpIcon'} Icon={ArrowUpIcon} />
    <IconCard
      iconProps={args}
      iconName={'ArrowUpRightIcon'}
      Icon={ArrowUpRightIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ArrowRightIcon'}
      Icon={ArrowRightIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ArrowDownRightIcon'}
      Icon={ArrowDownRightIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ArrowDownIcon'}
      Icon={ArrowDownIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ArrowLeftIcon'}
      Icon={ArrowLeftIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ArrowTransferIcon'}
      Icon={ArrowTransferIcon}
    />
    <IconCard iconProps={args} iconName={'BellIcon'} Icon={BellIcon} />
    <IconCard iconProps={args} iconName={'BinIcon'} Icon={BinIcon} />
    <IconCard iconProps={args} iconName={'BookIcon'} Icon={BookIcon} />
    <IconCard iconProps={args} iconName={'CalendarIcon'} Icon={CalendarIcon} />
    <IconCard iconProps={args} iconName={'CartIcon'} Icon={CartIcon} />
    <IconCard iconProps={args} iconName={'ChatIcon'} Icon={ChatIcon} />
    <IconCard iconProps={args} iconName={'CheckIcon'} Icon={CheckIcon} />
    <IconCard
      iconProps={args}
      iconName={'ChevronUpIcon'}
      Icon={ChevronUpIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ChevronRightIcon'}
      Icon={ChevronRightIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ChevronDownIcon'}
      Icon={ChevronDownIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ChevronLeftIcon'}
      Icon={ChevronLeftIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ChevronUpDownIcon'}
      Icon={ChevronUpDownIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ClockWaitIcon'}
      Icon={ClockWaitIcon}
    />
    <IconCard iconProps={args} iconName={'CloseIcon'} Icon={CloseIcon} />
    <IconCard iconProps={args} iconName={'CopyIcon'} Icon={CopyIcon} />
    <IconCard
      iconProps={args}
      iconName={'EllipsisVerticalIcon'}
      Icon={EllipsisVerticalIcon}
    />
    <IconCard iconProps={args} iconName={'EllipsisIcon'} Icon={EllipsisIcon} />
    <IconCard iconProps={args} iconName={'EqualIcon'} Icon={EqualIcon} />
    <IconCard iconProps={args} iconName={'EmailIcon'} Icon={EmailIcon} />
    <IconCard iconProps={args} iconName={'ErrorIcon'} Icon={ErrorIcon} />
    <IconCard
      iconProps={args}
      iconName={'ErrorCircleIcon'}
      Icon={ErrorCircleIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'ExternalLinkIcon'}
      Icon={ExternalLinkIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'EyeClosedIcon'}
      Icon={EyeClosedIcon}
    />
    <IconCard iconProps={args} iconName={'EyeOpenIcon'} Icon={EyeOpenIcon} />
    <IconCard iconProps={args} iconName={'FileIcon'} Icon={FileIcon} />
    <IconCard iconProps={args} iconName={'FilterIcon'} Icon={FilterIcon} />
    <IconCard iconProps={args} iconName={'FolderIcon'} Icon={FolderIcon} />
    <IconCard iconProps={args} iconName={'GearIcon'} Icon={GearIcon} />
    <IconCard iconProps={args} iconName={'GuidesIcon'} Icon={GuidesIcon} />
    <IconCard
      iconProps={args}
      iconName={'HamburgerIcon'}
      Icon={HamburgerIcon}
    />
    <IconCard iconProps={args} iconName={'HelpIcon'} Icon={HelpIcon} />
    <IconCard
      iconProps={args}
      iconName={'HelpCircleIcon'}
      Icon={HelpCircleIcon}
    />
    <IconCard iconProps={args} iconName={'HomeIcon'} Icon={HomeIcon} />
    <IconCard
      iconProps={args}
      iconName={'IndeterminateIcon'}
      Icon={IndeterminateIcon}
    />
    <IconCard iconProps={args} iconName={'InfoIcon'} Icon={InfoIcon} />
    <IconCard
      iconProps={args}
      iconName={'InfoCircleIcon'}
      Icon={InfoCircleIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'LightbulbIcon'}
      Icon={LightbulbIcon}
    />
    <IconCard iconProps={args} iconName={'ListIcon'} Icon={ListIcon} />
    <IconCard iconProps={args} iconName={'LocationIcon'} Icon={LocationIcon} />
    <IconCard iconProps={args} iconName={'LockIcon'} Icon={LockIcon} />
    <IconCard iconProps={args} iconName={'MinusIcon'} Icon={MinusIcon} />
    <IconCard iconProps={args} iconName={'OKIcon'} Icon={OKIcon} />
    <IconCard iconProps={args} iconName={'OVHIcon'} Icon={OVHIcon} />
    <IconCard iconProps={args} iconName={'PenIcon'} Icon={PenIcon} />
    <IconCard iconProps={args} iconName={'PhoneIcon'} Icon={PhoneIcon} />
    <IconCard iconProps={args} iconName={'PlusIcon'} Icon={PlusIcon} />
    <IconCard iconProps={args} iconName={'PrinterIcon'} Icon={PrinterIcon} />
    <IconCard iconProps={args} iconName={'RefreshIcon'} Icon={RefreshIcon} />
    <IconCard iconProps={args} iconName={'RemoveIcon'} Icon={RemoveIcon} />
    <IconCard iconProps={args} iconName={'SearchIcon'} Icon={SearchIcon} />
    <IconCard iconProps={args} iconName={'SettingsIcon'} Icon={SettingsIcon} />
    <IconCard
      iconProps={args}
      iconName={'ShapeCircleIcon'}
      Icon={ShapeCircleIcon}
    />
    <IconCard iconProps={args} iconName={'ShapeDotIcon'} Icon={ShapeDotIcon} />
    <IconCard iconProps={args} iconName={'SuccessIcon'} Icon={SuccessIcon} />
    <IconCard
      iconProps={args}
      iconName={'SuccessCircleIcon'}
      Icon={SuccessCircleIcon}
    />
    <IconCard iconProps={args} iconName={'SortIcon'} Icon={SortIcon} />
    <IconCard iconProps={args} iconName={'SortUpIcon'} Icon={SortUpIcon} />
    <IconCard iconProps={args} iconName={'SortDownIcon'} Icon={SortDownIcon} />
    <IconCard
      iconProps={args}
      iconName={'SortInactiveIcon'}
      Icon={SortInactiveIcon}
    />
    <IconCard iconProps={args} iconName={'TimeIcon'} Icon={TimeIcon} />
    <IconCard
      iconProps={args}
      iconName={'TriangleUpIcon'}
      Icon={TriangleUpIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'TriangleRightIcon'}
      Icon={TriangleRightIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'TriangleDownIcon'}
      Icon={TriangleDownIcon}
    />
    <IconCard
      iconProps={args}
      iconName={'TriangleLeftIcon'}
      Icon={TriangleLeftIcon}
    />
    <IconCard iconProps={args} iconName={'TruckIcon'} Icon={TruckIcon} />
    <IconCard iconProps={args} iconName={'UserIcon'} Icon={UserIcon} />
    <IconCard iconProps={args} iconName={'WarningIcon'} Icon={WarningIcon} />
    <IconCard
      iconProps={args}
      iconName={'WarningCircleIcon'}
      Icon={WarningCircleIcon}
    />
  </Flex>
);

export const System = TemplateSystemIcons.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
System.args = {
  boxSize: '2rem',
  color: '#4D5592',
};
