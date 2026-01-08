import { vi } from 'vitest';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderHookWithI18n } from '@/common/utils/tests/testUtils';

import { GUIDES_REST_API } from './guideRestApi.constants';
import { useGuideItemRestApi } from './useGuideItemRestApi';

const MOCKED_LINK = 'mocked-link';
const MOCKED_ID = 0;

vi.mock('@/common/utils/guides/useGuideLink', () => ({
  useGuideLink: vi.fn(() => MOCKED_LINK),
}));

describe('useGuideItemRestApi test suite', () => {
  it('should return a guide item', async () => {
    // GIVEN
    // WHEN
    const { result } = await renderHookWithI18n(() => useGuideItemRestApi(MOCKED_ID));

    // THEN
    expect(useGuideLink).toHaveBeenCalledWith(GUIDES_REST_API);
    expect(result.current).toStrictEqual({
      id: MOCKED_ID,
      href: MOCKED_LINK,
      children: labels.secretManager.guide_use_with_rest_api,
      target: '_blank',
    });
  });
});
