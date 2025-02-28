import { render } from '@testing-library/react';
import { vi } from 'vitest';
import LinkUserSelector from './LinkUserSelector.component';
import { wrapper } from '@/wrapperRenders';

describe('LinkUserSelector', () => {
  it('should display correctly', () => {
    const { container } = render(
      <LinkUserSelector
        onCancel={vi.fn()}
        onSelectOwner={vi.fn()}
        userId={1}
      />,
      {
        wrapper,
      },
    );
    expect(container).toMatchSnapshot();
  });
});
