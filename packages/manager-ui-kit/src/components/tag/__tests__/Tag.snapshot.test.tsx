import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tag } from '@/components';

describe('Tag Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <Tag color="critical">Critical</Tag>
        <Tag color="information">Information</Tag>
        <Tag color="neutral">Neutral</Tag>
        <Tag color="primary">Primary</Tag>
        <Tag color="success">Success</Tag>
        <Tag color="warning">Warning</Tag>
        <Tag size="md">MD tag</Tag>
        <Tag size="lg">LG tag</Tag>
        <Tag disabled>My tag</Tag>
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
