import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  Pagination,
  PaginationPageChangeDetail,
  type PaginationProp,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';

type Story = StoryObj<PaginationProp>;

const meta: Meta<PaginationProp> = {
  argTypes: excludeFromDemoControls(['defaultPage', 'onPageChange', 'onPageSizeChange', 'page', 'pageSize', 'renderTotalItemsLabel']),
  component: Pagination,
  title: 'Manager UI Kit/Components/Pagination/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    disabled : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    labelTooltipNext : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    labelTooltipPrev : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    pageSize : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    page : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    siblingCount : {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
    totalItems: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
    },
    withPageSizeSelector: {
      table: {
        category: CONTROL_CATEGORY.general
      },
    },
  }),
  args: {
    totalItems: 5000,
  },
};

export const AccessibilityLabel: Story = {
  globals: {
    imports: `import { Pagination } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Pagination
      aria-label="Pagination"
      totalItems={ 5000 } />
  ),
};

export const Controlled: Story = {
  globals: {
    imports: `import { Pagination } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [page, setPage] = useState(1);

    function handlePageChange({ page }: PaginationPageChangeDetail){
      setPage(page);
    }

    return (
      <Pagination
        onPageChange={ handlePageChange }
        page={ page }
        totalItems={ 500 } />
    );
  },
};

export const Default: Story = {
  globals: {
    imports: `import { Pagination } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Pagination totalItems={ 5000 } />
  ),
};

export const Disabled: Story = {
  globals: {
    imports: `import { Pagination } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Pagination
      disabled
      totalItems={ 500 } />
  ),
};

export const ItemsPerPage: Story = {
  globals: {
    imports: `import { Pagination } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Pagination
      pageSize={ 25 }
      totalItems={ 500 } />
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Pagination totalItems={ 100 } withPageSizeSelector />
  ),
};

export const SiblingCount: Story = {
  globals: {
    imports: `import { Pagination } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Pagination
      defaultPage={ 5 }
      siblingCount={ 2 }
      totalItems={ 500 } />
  ),
}

export const WithLabels: Story = {
  globals: {
    imports: `import { Pagination } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Pagination
      labelTooltipPrev={ 'Go to previous page' }
      labelTooltipNext={ 'Go to next page' }
      totalItems={ 500 } />
  ),
};

export const TotalItems: Story = {
  globals: {
    imports: `import { Pagination } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Pagination
      renderTotalItemsLabel={ ({ totalItems }) => `of ${totalItems} results` }
      totalItems={ 500 }
      withPageSizeSelector />
  ),
};
