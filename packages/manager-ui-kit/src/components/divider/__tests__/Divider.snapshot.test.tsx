import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Divider } from '@/components';

describe('Divider Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <Divider color="neutral" />
        <Divider color="primary" />
        <Divider spacing="0" />
        <Divider spacing="2" />
        <Divider spacing="4" />
        <Divider spacing="6" />
        <Divider spacing="8" />
        <Divider spacing="12" />
        <Divider spacing="16" />
        <Divider spacing="24" />
        <Divider spacing="32" />
        <Divider spacing="40" />
        <Divider spacing="48" />
        <Divider spacing="64" />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
