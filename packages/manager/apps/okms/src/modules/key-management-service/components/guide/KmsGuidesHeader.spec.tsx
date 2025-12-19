import { screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import {
  UseFeatureAvailabilityResult,
  useFeatureAvailability,
} from '@ovh-ux/manager-module-common-api';

import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import KmsGuidesHeader from './KmsGuidesHeader';

const MOCKED_GUIDE_ITEM_TEST_IDS = {
  quickStart: 'quick-start',
  usage: 'usage',
  kmip: 'kmip',
};

vi.mock('./guide-quick-start/useGuideItemQuickStart', () => ({
  useGuideItemQuickStart: vi.fn(() => ({
    id: 0,
    dataTestid: MOCKED_GUIDE_ITEM_TEST_IDS.quickStart,
  })),
}));

vi.mock('./guide-usage/useGuideItemUsage', () => ({
  useGuideItemUsage: vi.fn(() => ({
    id: 1,
    dataTestid: MOCKED_GUIDE_ITEM_TEST_IDS.usage,
  })),
}));

vi.mock('./guide-kmip/useGuideItemKmip', () => ({
  useGuideItemKmip: vi.fn(() => ({
    id: 2,
    dataTestid: MOCKED_GUIDE_ITEM_TEST_IDS.kmip,
  })),
}));

vi.mock('@ovh-ux/manager-module-common-api', async (importOriginal) => {
  const module = await importOriginal<typeof import('@ovh-ux/manager-module-common-api')>();
  return { ...module, useFeatureAvailability: vi.fn() };
});

describe('KMS Guides Header tests suite', () => {
  it('should display all guides when feature flipping is true', async () => {
    // GIVEN
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: {
        [KMS_FEATURES.KMIP_CONNECTION_GUIDE]: true,
        [KMS_FEATURES.KMS_USAGE_GUIDE]: true,
      },
    } as unknown as UseFeatureAvailabilityResult);

    // WHEN
    await renderWithI18n(<KmsGuidesHeader />);

    // THEN
    expect(screen.getByTestId(MOCKED_GUIDE_ITEM_TEST_IDS.quickStart)).toBeInTheDocument();
    expect(screen.getByTestId(MOCKED_GUIDE_ITEM_TEST_IDS.usage)).toBeInTheDocument();
    expect(screen.getByTestId(MOCKED_GUIDE_ITEM_TEST_IDS.kmip)).toBeInTheDocument();
  });

  it('should only display quick start guide when feature flipping is false', async () => {
    // GIVEN
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: {
        [KMS_FEATURES.KMIP_CONNECTION_GUIDE]: false,
        [KMS_FEATURES.KMS_USAGE_GUIDE]: false,
      },
    } as unknown as UseFeatureAvailabilityResult);

    // WHEN
    await renderWithI18n(<KmsGuidesHeader />);

    // THEN
    expect(screen.getByTestId(MOCKED_GUIDE_ITEM_TEST_IDS.quickStart)).toBeInTheDocument();
    expect(screen.queryByTestId(MOCKED_GUIDE_ITEM_TEST_IDS.usage)).not.toBeInTheDocument();
    expect(screen.queryByTestId(MOCKED_GUIDE_ITEM_TEST_IDS.kmip)).not.toBeInTheDocument();
  });
});
