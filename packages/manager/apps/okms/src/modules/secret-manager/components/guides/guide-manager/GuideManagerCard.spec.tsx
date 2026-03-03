import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';
import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { GuideManagerCard } from './GuideManagerCard.component';
import { GUIDES_MANAGER } from './guideManager.constants';

const MOCKED_LINK = 'mocked-link';

vi.mock('@/common/utils/guides/useGuideLink', () => ({
  useGuideLink: vi.fn(() => MOCKED_LINK),
}));

describe('GuideManagerCard test suite', () => {
  it('should return a card with the correct link and text', async () => {
    // GIVEN
    // WHEN
    const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();
    render(<GuideManagerCard />, { wrapper });

    // THEN
    expect(useGuideLink).toHaveBeenCalledWith(GUIDES_MANAGER);
    expect(screen.getByRole('link')).toHaveAttribute('href', MOCKED_LINK);
    expect(screen.getByText(labels.common.onboarding.tutorial)).toBeInTheDocument();
    expect(screen.getByText(labels.secretManager.guide_use_in_manager)).toBeInTheDocument();
    expect(
      screen.getByText(labels.secretManager.guide_use_in_manager_description),
    ).toBeInTheDocument();
  });
});
