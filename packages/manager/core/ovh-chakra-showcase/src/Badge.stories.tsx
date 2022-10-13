import { Badge, HStack } from '@chakra-ui/react';

export default {
  title: 'Example/Badges',
  component: Badge,
};

const Template = () => (
  <>
    <HStack>
      <Badge>Default</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </HStack>
    <br />
    <HStack>
      <Badge size="small">Default</Badge>
      <Badge size="small" variant="info">
        Info
      </Badge>
      <Badge size="small" variant="success">
        Success
      </Badge>
      <Badge size="small" variant="warning">
        Warning
      </Badge>
      <Badge size="small" variant="error">
        Error
      </Badge>
    </HStack>
  </>
);

const TemplateProducts = () => (
  <>
    <HStack>
      <Badge variant="alpha">Alpha</Badge>
      <Badge variant="beta">Beta</Badge>
      <Badge variant="new">New</Badge>
      <Badge variant="soon">Soon</Badge>
      <Badge variant="promotion">Promotion</Badge>
      <Badge variant="price-drop">Price Drop</Badge>
      <Badge variant="sold-out">Sold out</Badge>
      <Badge variant="best-seller">Best Seller</Badge>
      <Badge variant="limited-edition">Limited Edition</Badge>
    </HStack>
    <br />
    <HStack>
      <Badge size="small" variant="alpha">
        Alpha
      </Badge>
      <Badge size="small" variant="beta">
        Beta
      </Badge>
      <Badge size="small" variant="new">
        New
      </Badge>
      <Badge size="small" variant="soon">
        Soon
      </Badge>
      <Badge size="small" variant="promotion">
        Promotion
      </Badge>
      <Badge size="small" variant="price-drop">
        Price Drop
      </Badge>
      <Badge size="small" variant="sold-out">
        Sold out
      </Badge>
      <Badge size="small" variant="best-seller">
        Best Seller
      </Badge>
      <Badge size="small" variant="limited-edition">
        Limited Edition
      </Badge>
    </HStack>
  </>
);

export const Basic = Template.bind({});
export const Product = TemplateProducts.bind({});
