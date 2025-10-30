import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { navigate } from '@/utils/test.setup';

import CdnEditUrlsModal from './CdnEditUrls.modal';

const queryClient = new QueryClient();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

describe('CdnEditUrlsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should close modal on cancel', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CdnEditUrlsModal />
      </QueryClientProvider>,
    );

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });
});
