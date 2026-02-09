import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';
import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { GuideRestApiCard } from './GuideRestApiCard.component';
import { GUIDES_REST_API } from './guideRestApi.constants';

const MOCKED_LINK = 'mocked-link';

vi.mock('@/common/utils/guides/useGuideLink', () => ({
  useGuideLink: vi.fn(() => MOCKED_LINK),
}));

describe('GuideRestApiCard test suite', () => {
  it('should return a card with the correct link and text', async () => {
    // GIVEN
    // WHEN
    const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();
    render(<GuideRestApiCard />, { wrapper });

    // THEN
    expect(useGuideLink).toHaveBeenCalledWith(GUIDES_REST_API);
    expect(screen.getByRole('link')).toHaveAttribute('href', MOCKED_LINK);
    expect(screen.getByText(labels.common.onboarding.tutorial)).toBeInTheDocument();
    expect(screen.getByText(labels.secretManager.guide_use_with_rest_api)).toBeInTheDocument();
    expect(
      screen.getByText(labels.secretManager.guide_use_with_rest_api_description),
    ).toBeInTheDocument();
  });
});
