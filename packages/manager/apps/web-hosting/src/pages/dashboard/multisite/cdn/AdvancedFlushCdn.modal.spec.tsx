import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { navigate } from '@/utils/test.setup';

import AdvancedFlushCdnModal from './AdvancedFlushCdn.modal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

describe('AdvancedFlushCdnModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should close modal on cancel', () => {
    render(<AdvancedFlushCdnModal />);

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });

  it('validate and open upgrade cdn page and close modal', () => {
    render(<AdvancedFlushCdnModal />);

    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    expect(window.location.href).toBe('http://localhost:3000/');
  });
});
