import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from '@/components';

describe('Spinner Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <Spinner />
        <Spinner color="neutral" />
        <Spinner color="primary" />
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
