import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { navigate } from '@/utils/test.setup';

import CdnConfirmationModal from './CdnConfirmation.modal';

const queryClient = new QueryClient();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

describe('CdnConfirmationModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should close modal on cancel', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CdnConfirmationModal />
      </QueryClientProvider>,
    );

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });
});
