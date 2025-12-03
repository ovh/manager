import { Navigate } from 'react-router-dom';

import { OKMS } from '@key-management-service/types/okms.type';
import { UseQueryResult } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  UseFeatureAvailabilityResult,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';

import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';

import KmsLogs from './Logs.page';

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
    ({ data: { data: { id, iam: { urn: `urn:${id}` } } } }) as UseQueryResult<ApiResponse<OKMS>>,
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const module = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return { ...module, useFeatureAvailability: vi.fn() };
});

vi.mock('@ovh-ux/logs-to-customer/src/LogsToCustomer.module');

describe('Logs page tests suite', () => {
  afterEach(() => vi.clearAllMocks());

  const renderLogsPage = () => render(<KmsLogs />);

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

  it('should redirect to dashboard if logs feature is disabled', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [KMS_FEATURES.LOGS]: false },
    } as unknown as UseFeatureAvailabilityResult);

    renderLogsPage();

    expect(Navigate).toHaveBeenCalledWith({ to: '/key-management-service/okmsId' }, {});
    expect(LogsToCustomerModule).not.toHaveBeenCalled();
  });
});
