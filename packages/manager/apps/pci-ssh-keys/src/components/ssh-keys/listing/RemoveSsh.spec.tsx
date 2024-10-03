import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import RemoveSsh from './RemoveSsh';
import { wrapper } from '@/setupTests';

vi.mock('react-router-dom', () => ({
  useHref: vi.fn().mockReturnValue('/123/remove'),
}));

describe('RemoveSsh', () => {
  it('renders remove SSH button with correct text', () => {
    const { container } = render(<RemoveSsh sshId="123" />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should have the correct link', async () => {
    const { getByTestId } = render(<RemoveSsh sshId="123" />, { wrapper });
    expect(getByTestId('RemoveSsh-href')).toHaveAttribute(
      'href',
      '/123/remove',
    );
  });
});
