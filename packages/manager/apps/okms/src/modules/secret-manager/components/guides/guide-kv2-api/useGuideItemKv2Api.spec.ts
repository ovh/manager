import { vi } from 'vitest';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderHookWithI18n } from '@/common/utils/tests/testUtils';

import { GUIDES_KV2 } from './guideKv2.constants';
import { useGuideItemKv2Api } from './useGuideItemKv2Api';

const MOCKED_LINK = 'mocked-link';
const MOCKED_ID = 0;

vi.mock('@/common/utils/guides/useGuideLink', () => ({
  useGuideLink: vi.fn(() => MOCKED_LINK),
}));

describe('useGuideItemKv2Api test suite', () => {
  it('should return a guide item', async () => {
    // GIVEN
    // WHEN
    const { result } = await renderHookWithI18n(() => useGuideItemKv2Api(MOCKED_ID));

    // THEN
    expect(useGuideLink).toHaveBeenCalledWith(GUIDES_KV2);
    expect(result.current).toStrictEqual({
      id: MOCKED_ID,
      href: MOCKED_LINK,
      children: labels.secretManager.guide_use_with_kv2_api,
      target: '_blank',
    });
  });
});
