import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  chakra,
} from '@chakra-ui/react';

export default {
  title: 'Example/Breadcrumb',
  component: Breadcrumb,
};

const TemplateBasic = () => (
  <Breadcrumb>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem>
      <BreadcrumbLink href="#">Docs</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem isCurrentPage>
      <BreadcrumbLink href="#" as={chakra.span}>
        Breadcrumb
      </BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
);
export const Basic = TemplateBasic.bind({});
