import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  chakra,
} from '@chakra-ui/react';
import { ComponentMeta } from '@storybook/react';

export default {
  title: 'Example/Breadcrumb',
  component: Breadcrumb,
} as ComponentMeta<typeof Breadcrumb>;

const TemplateBasic = () => (
  <Breadcrumb>
    <BreadcrumbItem>
      <BreadcrumbLink href='#'>Home</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem>
      <BreadcrumbLink href='#'>Docs</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem isCurrentPage>
      <BreadcrumbLink href='#' as={chakra.span}>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
);
export const Basic = TemplateBasic.bind({});
