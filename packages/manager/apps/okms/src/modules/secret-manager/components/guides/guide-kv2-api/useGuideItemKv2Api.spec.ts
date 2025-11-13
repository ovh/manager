import { vi } from 'vitest';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderHookWithI18n } from '@/common/utils/tests/testUtils';
import { useGuideItemKv2Api } from './useGuideItemKv2Api';
import { GUIDES_KV2 } from './guideKv2.constants';
import { useGuideLink } from '@/common/utils/guides/useGuideLink';

const MOCKED_LINK = 'mocked-link';
const MOCKED_ID = 0;

vi.mock('@/common/utils/guides/useGuideLink', () => ({
  useGuideLink: vi.fn(() => MOCKED_LINK),
}));

describe('useGuideItemKv2Api test suite', () => {
  it('should return a guide item', async () => {
    // GIVEN
    // WHEN
    const { result } = await renderHookWithI18n(() =>
      useGuideItemKv2Api(MOCKED_ID),
    );

    // THEN
    expect(useGuideLink).toHaveBeenCalledWith(GUIDES_KV2);
    expect(result.current).toStrictEqual({
      id: MOCKED_ID,
      href: MOCKED_LINK,
      label: labels.secretManager.guide_use_with_kv2_api,
      target: '_blank',
    });
  });
});
