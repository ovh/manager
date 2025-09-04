import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SanModal from './sanSsl.page';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useParams: () => ({
    serviceName: 'serviceName',
    domain: 'domain',
  }),
  useSearchParams: () => [new URLSearchParams({ san: 'mySAN' })],
  useNavigate: () => mockNavigate,
}));

describe('SanModal', () => {
  it('call deleteDomainCertificate and close modal', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<SanModal />);

    fireEvent.click(screen.getByTestId('secondary-button'));
    const spy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();

    await window.navigator.clipboard.writeText('mySAN');
    expect(spy).toHaveBeenCalledWith('mySAN');
  });

  it('cancel button close modal', () => {
    render(<SanModal />);

    fireEvent.click(screen.getByTestId('primary-button'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
