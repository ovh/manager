import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Pagination } from '@/components';

describe('Pagination Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <Pagination pageSize={25} totalItems={500} />
        <Pagination defaultPage={5} siblingCount={2} totalItems={500} />
        <Pagination
          labelTooltipNext="Go to next page"
          labelTooltipPrev="Go to previous page"
          totalItems={500}
        />
        <Pagination
          renderTotalItemsLabel={({ totalItems }) => `of ${totalItems} results`}
          totalItems={500}
          withPageSizeSelector
        />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
