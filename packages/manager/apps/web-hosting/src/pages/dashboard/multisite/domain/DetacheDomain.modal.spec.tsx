import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { navigate } from '@/utils/test.setup';

import DetacheDomainModal from './DetacheDomain.modal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

const queryClient = new QueryClient();

describe('DetacheDomainModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should close modal on cancel', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DetacheDomainModal />
      </QueryClientProvider>,
    );

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });
});
