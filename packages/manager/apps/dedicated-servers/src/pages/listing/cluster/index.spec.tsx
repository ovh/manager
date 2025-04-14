import '@/test-utils/setupTests';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '@/test-utils';
import { urls } from '@/routes/routes.constant';

vi.mock('@ovh-ux/manager-core-api', () => ({
  get: vi.fn(() =>
    Promise.resolve({
      data: {
        /* fake response */
      },
    }),
  ),
  fetchIcebergV2: vi.fn(() =>
  Promise.resolve({
    data: {
      /* fake response */
    },
  }),
),
  fetchIcebergV6: vi.fn(() =>
    Promise.resolve({
      data: {
        /* fake response */
      },
    }),
  ),
  apiClient: vi.fn(() =>
    Promise.resolve({
      data: {
        /* fake response */
      },
    }),
  ),
}));

describe('cluster listing page', () => {
  it.skip('should redirect to the onboarding page when the list is empty', async () => {
    await renderTest({});

    await assertTextVisibility(labels.dedicated.title);
  });

  it.skip('displays loading spinner while main request are loading', async () => {
    const { container } = await renderTest({
      initialRoute: urls.server,
    });
  });
});
