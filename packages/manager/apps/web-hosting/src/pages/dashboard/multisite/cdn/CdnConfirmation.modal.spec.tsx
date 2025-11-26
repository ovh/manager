import React, { ComponentType } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { navigate } from '@/utils/test.setup';
import { createTestWrapper } from '@/utils/test.provider';

import CdnConfirmationModal from './CdnConfirmation.modal';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({ t: (k: string) => k }),
    Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
  };
});

const Wrappers = createTestWrapper();

describe('CdnConfirmationModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should close modal on cancel', () => {
    render(<CdnConfirmationModal />, { wrapper: Wrappers as ComponentType });

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });
});
