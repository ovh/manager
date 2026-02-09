import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';
import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { GuideKv2Card } from './GuideKv2Card.component';
import { GUIDES_KV2 } from './guideKv2.constants';

const MOCKED_LINK = 'mocked-link';

vi.mock('@/common/utils/guides/useGuideLink', () => ({
  useGuideLink: vi.fn(() => MOCKED_LINK),
}));

describe('GuideKv2Card test suite', () => {
  it('should return a card with the correct link and text', async () => {
    // GIVEN
    // WHEN
    const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();
    render(<GuideKv2Card />, { wrapper });

    // THEN
    expect(useGuideLink).toHaveBeenCalledWith(GUIDES_KV2);
    expect(screen.getByRole('link')).toHaveAttribute('href', MOCKED_LINK);
    expect(screen.getByText(labels.common.onboarding.tutorial)).toBeInTheDocument();
    expect(screen.getByText(labels.secretManager.guide_use_with_kv2_api)).toBeInTheDocument();
    expect(
      screen.getByText(labels.secretManager.guide_use_with_kv2_api_description),
    ).toBeInTheDocument();
  });
});
