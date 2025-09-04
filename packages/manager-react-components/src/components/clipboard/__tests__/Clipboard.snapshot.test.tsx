import { describe, it, expect, vitest } from 'vitest';
import { render } from '@testing-library/react';
import { Clipboard } from '../Clipboard.component';

describe('Clipboard Snapshot Tests', () => {
  it('Displays Clipboard', () => {
    const { container } = render(<Clipboard value="Test Message" />);
    expect(container).toMatchSnapshot();
  });

  it('Displays disabled Clipboard', () => {
    const { container } = render(<Clipboard value="Test Message" disabled />);
    expect(container).toMatchSnapshot();
  });

  it('Displays loading Clipboard', () => {
    const { container } = render(<Clipboard value="Test Message" loading />);
    expect(container).toMatchSnapshot();
  });

  it('Displays masked Clipboard', () => {
    const { container } = render(<Clipboard value="Test Message" masked />);
    expect(container).toMatchSnapshot();
  });
});
