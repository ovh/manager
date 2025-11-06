import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from '@/components';

describe('Card Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <div role="list">
        <Card role="listitem">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          <br />
          Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </Card>
        <Card role="listitem">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          <br />
          Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </Card>
      </div>,
    );
    expect(container).toMatchSnapshot();
  });
});
