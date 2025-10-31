import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from '@/components';

describe('Icon Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <Icon aria-label="home" name="home" role="img" />
        <Icon aria-label="Help" name="circle-question" role="img" />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
