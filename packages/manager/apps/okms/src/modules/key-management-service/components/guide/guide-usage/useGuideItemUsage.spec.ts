import { vi } from 'vitest';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderHookWithI18n } from '@/common/utils/tests/testUtils';

import { GUIDES_USAGE } from './guideUsage.constants';
import { useGuideItemUsage } from './useGuideItemUsage';

const MOCKED_LINK = 'mocked-link';
const MOCKED_ID = 0;

vi.mock('@/common/utils/guides/useGuideLink', () => ({
  useGuideLink: vi.fn(() => MOCKED_LINK),
}));

vi.mock('@/common/hooks/useOkmsTracking', () => ({
  useOkmsTracking: () => ({ trackClick: vi.fn() }),
}));

describe('useGuideItemUsage test suite', () => {
  it('should return a guide item', async () => {
    // GIVEN MOCKED_SUBSIDIARY and MOCKED_ID

    // WHEN
    const { result } = await renderHookWithI18n(() => useGuideItemUsage(MOCKED_ID));

    // THEN
    expect(useGuideLink).toHaveBeenCalledWith(GUIDES_USAGE);
    expect(result.current).toEqual(
      expect.objectContaining({
        id: MOCKED_ID,
        href: MOCKED_LINK,
        label: labels.guide.guides_header_kms_usage,
        target: '_blank',
      }),
    );
  });
});
