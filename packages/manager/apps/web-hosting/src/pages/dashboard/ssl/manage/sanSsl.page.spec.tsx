import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SanModal from './sanSsl.page';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

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

    await fireEvent.click(screen.getByTestId('secondary-button'));
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('mySAN');
  });

  it('cancel button close modal', async () => {
    render(<SanModal />);

    await fireEvent.click(screen.getByTestId('primary-button'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
