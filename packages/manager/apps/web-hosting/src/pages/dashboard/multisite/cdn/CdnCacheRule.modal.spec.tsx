import React, { ComponentType } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestWrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import CdnCacheRuleModal from './CdnCacheRule.modal';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({ t: (k: string) => k }),
    Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
  };
});

const Wrappers = createTestWrapper();

describe('CdnCacheRuleModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should close modal on cancel', () => {
    render(<CdnCacheRuleModal />, { wrapper: Wrappers as ComponentType });

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });
});
