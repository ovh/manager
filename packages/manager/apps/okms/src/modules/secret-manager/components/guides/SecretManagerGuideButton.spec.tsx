import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { SecretManagerGuidesButton } from './SecretManagerGuideButton';

const GUIDES_TEST_IDS = {
  manager: 'manager',
  kv2Api: 'kv2-api',
  restApi: 'rest-api',
};

vi.mock('./guide-manager/useGuideItemManager', () => ({
  useGuideItemManager: vi.fn(() => ({
    id: 0,
    dataTestid: GUIDES_TEST_IDS.manager,
  })),
}));

vi.mock('./guide-kv2-api/useGuideItemKv2Api', () => ({
  useGuideItemKv2Api: vi.fn(() => ({
    id: 1,
    dataTestid: GUIDES_TEST_IDS.kv2Api,
  })),
}));

vi.mock('./guide-rest-api/useGuideItemRestApi', () => ({
  useGuideItemRestApi: vi.fn(() => ({
    id: 2,
    dataTestid: GUIDES_TEST_IDS.restApi,
  })),
}));

describe('Secret Manager Guide Button test suite', () => {
  it('should display guides items', async () => {
    // GIVEN
    // WHEN
    await renderWithI18n(<SecretManagerGuidesButton />);

    // THEN
    expect(screen.getByTestId(GUIDES_TEST_IDS.manager)).toBeInTheDocument();
    expect(screen.getByTestId(GUIDES_TEST_IDS.kv2Api)).toBeInTheDocument();
    expect(screen.getByTestId(GUIDES_TEST_IDS.restApi)).toBeInTheDocument();
  });
});
