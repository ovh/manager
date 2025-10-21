import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  type BreadcrumbProp,
  Icon,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';

type Story = StoryObj<BreadcrumbProp>;

const meta: Meta<BreadcrumbProp> = {
  argTypes: excludeFromDemoControls(['i18n', 'id', 'locale', 'noCollapse', 'onExpand']),
  component: Breadcrumb,
  subcomponents: { BreadcrumbItem, BreadcrumbLink },
  title: 'Manager UI Kit/Components/Breadcrumb/Base',
};

export default meta;

export const Demo: Story = {
  render: (arg) => (
    <Breadcrumb
      collapseThreshold={ arg.collapseThreshold }
      nbItemsAfterEllipsis={ arg.nbItemsAfterEllipsis }
      nbItemsBeforeEllipsis={ arg.nbItemsBeforeEllipsis }>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Page 1
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Page 2
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Page 3
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Current page
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
  argTypes: orderControls({
    collapseThreshold: {
      table: {
        category: CONTROL_CATEGORY.design,
      },
    },
    nbItemsAfterEllipsis: {
      table: {
        category: CONTROL_CATEGORY.design,
      },
    },
    nbItemsBeforeEllipsis: {
      table: {
        category: CONTROL_CATEGORY.design,
      },
    },
  }),
};

export const Collapsed: Story = {
  globals: {
    imports: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink aria-label="Homepage" href="#">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Products
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Hosting
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Servers
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Dedicated
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Rise
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          RISE-2
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const CustomAfterBeforeCollapse: Story = {
  globals: {
    imports: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Breadcrumb
      nbItemsBeforeEllipsis={ 1 }
      nbItemsAfterEllipsis={ 4 }>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Products
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Hosting
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Servers
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Dedicated
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Rise
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          RISE-2
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const CustomCollapseThreshold: Story = {
  globals: {
    imports: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Breadcrumb collapseThreshold={ 7 }>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Products
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Hosting
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Servers
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Dedicated
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Rise
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          RISE-2
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { ICON_NAME, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink aria-label="Home" href="#">
          <Icon name={ ICON_NAME.home } />
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Parent
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Current
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const NoCollapse: Story = {
  globals: {
    imports: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Breadcrumb noCollapse>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Products
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Hosting
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Servers
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Dedicated
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Rise
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          RISE-2
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
  },
  render: ({}) => (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink aria-label="Home" href="#">
          <Icon name={ ICON_NAME.home } />
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Parent
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Current
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};


export const AccessibilityWithAriaLabel: Story = {
  globals: {
    imports: `import { ICON_NAME, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
  },
  render: ({}) => (
    <Breadcrumb aria-label="Breadcrumb">
      <BreadcrumbItem>
        <BreadcrumbLink aria-label="Home" href="#">
          <Icon name={ ICON_NAME.home } />
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Category
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Subcategory
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          Current page
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
}
