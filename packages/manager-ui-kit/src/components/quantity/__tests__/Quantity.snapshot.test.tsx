import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Quantity, QuantityControl, QuantityInput } from '@/components';

describe('Quantity Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <Quantity max={10}>
        <QuantityControl>
          <QuantityInput />
        </QuantityControl>
      </Quantity>,
    );
    expect(container).toMatchSnapshot();
  });
});
