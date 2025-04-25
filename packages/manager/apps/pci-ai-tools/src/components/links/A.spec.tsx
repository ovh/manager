import { render } from '@testing-library/react';
import { vi } from 'vitest';
import A from '@/components/links/A.component';

describe('A', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders anchor element correctly', () => {
    const { container } = render(<A href="#">Link</A>);
    const anchor = container.querySelector('a');
    expect(anchor).toBeTruthy();
    expect(anchor.textContent).toBe('Link');
    expect(anchor.getAttribute('href')).toBe('#');
  });
  it('renders disabled anchor element correctly', () => {
    const { container } = render(
      <A href="#" disabled>
        Link
      </A>,
    );
    const anchor = container.querySelector('a');
    expect(anchor).toBeTruthy();
    expect(anchor.textContent).toBe('Link');
    expect(anchor.getAttribute('href')).toBeNull();
  });
});
