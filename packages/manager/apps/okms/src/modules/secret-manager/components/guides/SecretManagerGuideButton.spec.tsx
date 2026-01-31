import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { SecretManagerGuidesButton } from './SecretManagerGuideButton';

const labels = {
  manager: 'manager',
  kv2Api: 'kv2-api',
  restApi: 'rest-api',
};

vi.mock('./guide-manager/useGuideItemManager', () => ({
  useGuideItemManager: vi.fn(() => ({
    id: 0,
    children: labels.manager,
  })),
}));

vi.mock('./guide-kv2-api/useGuideItemKv2Api', () => ({
  useGuideItemKv2Api: vi.fn(() => ({
    id: 1,
    children: labels.kv2Api,
  })),
}));

vi.mock('./guide-rest-api/useGuideItemRestApi', () => ({
  useGuideItemRestApi: vi.fn(() => ({
    id: 2,
    children: labels.restApi,
  })),
}));

describe('Secret Manager Guide Button test suite', () => {
  it('should display guides items', async () => {
    // GIVEN
    // WHEN
    const wrapper = await testWrapperBuilder().withQueryClient().withI18next().build();
    render(<SecretManagerGuidesButton />, { wrapper });

    // THEN
    expect(screen.getByText(labels.manager)).toBeInTheDocument();
    expect(screen.getByText(labels.kv2Api)).toBeInTheDocument();
    expect(screen.getByText(labels.restApi)).toBeInTheDocument();
  });
});
