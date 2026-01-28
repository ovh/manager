import { Navigate } from 'react-router-dom';

import { OKMS } from '@key-management-service/types/okms.type';
import { UseQueryResult } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';
import {
  UseFeatureAvailabilityResult,
  useFeatureAvailability,
} from '@ovh-ux/manager-module-common-api';

import { ProductType, useProductType } from '@/common/hooks/useProductType';
import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';

import OkmsLogsPage from './OkmsLogs.page';

vi.mock('react-router-dom', async (importOriginal) => {
  const module = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...module,
    Navigate: vi.fn(),
    useParams: () => ({ okmsId: 'okmsId' }),
  };
});

vi.mock('@key-management-service/data/hooks/useOkms', () => ({
  useOkmsById: (id: string) =>
    ({ data: { id, iam: { urn: `urn:${id}` } } }) as UseQueryResult<OKMS>,
}));

vi.mock('@ovh-ux/manager-module-common-api', async (importOriginal) => {
  const module = await importOriginal<typeof import('@ovh-ux/manager-module-common-api')>();
  return { ...module, useFeatureAvailability: vi.fn() };
});

vi.mock('@ovh-ux/logs-to-customer', async (importOriginal) => {
  const module = await importOriginal<typeof import('@ovh-ux/logs-to-customer')>();
  return {
    ...module,
    LogsToCustomerModule: vi.fn().mockReturnValue(<div>LogsToCustomerModule</div>),
  };
});

vi.mock('@/common/hooks/useProductType');

describe('Logs page tests suite', () => {
  beforeEach(() => {
    vi.mocked(useProductType).mockReturnValue('key-management-service');
  });
  afterEach(() => vi.clearAllMocks());

  const renderLogsPage = () => render(<OkmsLogsPage />);

  it('should display logs if logs feature is enabled', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [KMS_FEATURES.LOGS]: true },
    } as unknown as UseFeatureAvailabilityResult);

    renderLogsPage();

    expect(Navigate).not.toHaveBeenCalled();
    expect(LogsToCustomerModule).toHaveBeenCalledWith(
      {
        logApiVersion: 'v2',
        logApiUrls: {
          logKind: `/okms/resource/okmsId/log/kind`,
          logSubscription: `/okms/resource/okmsId/log/subscription`,
          logUrl: `/okms/resource/okmsId/log/url`,
        },
        logIamActions: {
          postSubscription: ['okms:apiovh:log/subscription/create'],
          deleteSubscription: ['okms:apiovh:log/subscription/delete'],
        },
        resourceURN: 'urn:okmsId',
        trackingOptions: { trackingSuffix: 'kms' },
      },
      {},
    );
  });

  it.each<{
    productType: ProductType;
    expectedRedirectRoute: string;
  }>([
    {
      productType: 'key-management-service',
      expectedRedirectRoute: '/key-management-service/okmsId',
    },
    {
      productType: 'secret-manager',
      expectedRedirectRoute: '/secret-manager/okmsId/dashboard',
    },
  ])(
    'should redirect to $expectedRedirectRoute if logs feature is disabled and productType is $productType',
    ({ productType, expectedRedirectRoute }) => {
      vi.mocked(useProductType).mockReturnValue(productType);
      vi.mocked(useFeatureAvailability).mockReturnValue({
        data: { [KMS_FEATURES.LOGS]: false },
      } as unknown as UseFeatureAvailabilityResult);

      renderLogsPage();

      expect(Navigate).toHaveBeenCalledWith({ to: expectedRedirectRoute }, {});
      expect(LogsToCustomerModule).not.toHaveBeenCalled();
    },
  );
});
