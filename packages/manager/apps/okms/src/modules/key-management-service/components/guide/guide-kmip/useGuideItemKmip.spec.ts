import { vi } from 'vitest';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderHookWithI18n } from '@/common/utils/tests/testUtils';

import { GUIDES_KMIP } from './guideKmip.constants';
import { useGuideItemKmip } from './useGuideItemKmip';

const MOCKED_LINK = 'mocked-link';
const MOCKED_ID = 0;

vi.mock('@/common/utils/guides/useGuideLink', () => ({
  useGuideLink: vi.fn(() => MOCKED_LINK),
}));

vi.mock('@/common/hooks/useOkmsTracking', () => ({
  useOkmsTracking: () => ({ trackClick: vi.fn() }),
}));

describe('useGuideItemKmip test suite', () => {
  it('should return a guide item', async () => {
    // GIVEN
    // WHEN
    const { result } = await renderHookWithI18n(() => useGuideItemKmip(MOCKED_ID));

    // THEN
    expect(useGuideLink).toHaveBeenCalledWith(GUIDES_KMIP);
    expect(result.current).toEqual(
      expect.objectContaining({
        id: MOCKED_ID,
        href: MOCKED_LINK,
        children: labels.guide.guides_header_connect_kmip_product,
        target: '_blank',
      }),
    );
  });
});
