import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import {
  UseFeatureAvailabilityResult,
  useFeatureAvailability,
} from '@ovh-ux/manager-module-common-api';

import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import KmsGuidesHeader from './KmsGuidesHeader';

const labels = {
  quickStart: 'quick-start',
  usage: 'usage',
  kmip: 'kmip',
};

vi.mock('./guide-quick-start/useGuideItemQuickStart', () => ({
  useGuideItemQuickStart: vi.fn(() => ({
    id: 0,
    children: labels.quickStart,
  })),
}));

vi.mock('./guide-usage/useGuideItemUsage', () => ({
  useGuideItemUsage: vi.fn(() => ({
    id: 1,
    children: labels.usage,
  })),
}));

vi.mock('./guide-kmip/useGuideItemKmip', () => ({
  useGuideItemKmip: vi.fn(() => ({
    id: 2,
    children: labels.kmip,
  })),
}));

vi.mock('@ovh-ux/manager-module-common-api', () => ({
  useFeatureAvailability: vi.fn(),
}));

describe('KMS Guides Header tests suite', () => {
  it('should display all guides when feature flipping is true', async () => {
    // GIVEN
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: {
        [KMS_FEATURES.KMIP_CONNECTION_GUIDE]: true,
        [KMS_FEATURES.KMS_USAGE_GUIDE]: true,
      },
      isPending: false,
    } as unknown as UseFeatureAvailabilityResult);

    // WHEN
    const wrapper = await testWrapperBuilder().withQueryClient().withI18next().build();
    render(<KmsGuidesHeader />, { wrapper });

    // THEN
    expect(screen.getByText(labels.quickStart)).toBeInTheDocument();
    expect(screen.getByText(labels.usage)).toBeInTheDocument();
    expect(screen.getByText(labels.kmip)).toBeInTheDocument();
  });

  it('should only display quick start guide when feature flipping is false', async () => {
    // GIVEN
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: {
        [KMS_FEATURES.KMIP_CONNECTION_GUIDE]: false,
        [KMS_FEATURES.KMS_USAGE_GUIDE]: false,
      },
      isPending: false,
    } as unknown as UseFeatureAvailabilityResult);

    // WHEN
    const wrapper = await testWrapperBuilder().withQueryClient().withI18next().build();
    render(<KmsGuidesHeader />, { wrapper });

    // THEN
    expect(screen.getByText(labels.quickStart)).toBeInTheDocument();
    expect(screen.queryByText(labels.usage)).not.toBeInTheDocument();
    expect(screen.queryByText(labels.kmip)).not.toBeInTheDocument();
  });
});
