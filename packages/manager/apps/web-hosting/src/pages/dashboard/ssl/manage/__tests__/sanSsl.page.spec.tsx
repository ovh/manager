import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import SanModal from '../sanSsl.page';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importActual) => {
  return {
    ...(await importActual<typeof import('react-router-dom')>()),

    useSearchParams: () => [new URLSearchParams({ san: 'mySAN' })],
    useNavigate: () => mockNavigate,
  };
});

describe('SanModal', () => {
  it('call deleteDomainCertificate and close modal', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    const { getByTestId } = render(<SanModal />, { wrapper });

    fireEvent.click(getByTestId('secondary-button'));
    const spy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();

    await window.navigator.clipboard.writeText('mySAN');
    expect(spy).toHaveBeenCalledWith('mySAN');
  });

  it('cancel button close modal', () => {
    const { getByTestId } = render(<SanModal />, { wrapper });

    fireEvent.click(getByTestId('primary-button'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
