import { waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { getOkmsList } from '@/data/api/okms';
import {
  promiseWithDelayMock,
  renderHookWithClient,
} from '@/utils/tests/testUtils';
import { OKMS } from '@/types/okms.type';
import { REGION_EU_WEST_RBX } from '@/mocks/catalog/catalog.mock';
import { ErrorResponse } from '@/types/api.type';
import { useBackToOkmsListUrl } from './useBackToOkmsListUrl';
import {
  okmsRoubaix1Mock,
  okmsRoubaix2Mock,
  okmsStrasbourg1Mock,
} from '@/mocks/kms/okms.mock';

// mocks
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(() => ({
    okmsId: 'mocked-okms-id',
  })),
}));

vi.mock('@/data/api/okms', async () => {
  const actual = await vi.importActual('@/data/api/okms');
  return {
    ...actual,
    getOkmsList: vi.fn(),
  };
});
const mockGetOkmsList = vi.mocked(getOkmsList);

vi.mock('@secret-manager/hooks/useCurrentRegion', () => ({
  useCurrentRegion: () => REGION_EU_WEST_RBX,
}));

describe('useBackToOkmsListUrl tests suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when data is loading', () => {
    it('should return null when API call are pending', async () => {
      // GIVEN
      mockGetOkmsList.mockImplementation(() =>
        promiseWithDelayMock<OKMS[]>({} as OKMS[], 2000),
      );

      // WHEN
      const { result } = renderHookWithClient(() => useBackToOkmsListUrl());

      // THEN
      expect(result.current).toBeNull();
    });

    it('should return null when error on API call', async () => {
      // GIVEN
      const mockError: ErrorResponse = {
        response: { data: { message: 'errorOkmsList' }, status: 500 },
      };
      mockGetOkmsList.mockRejectedValue(mockError);

      // WHEN
      const { result } = renderHookWithClient(() => useBackToOkmsListUrl());

      // THEN
      expect(result.current).toBeNull();
    });

    it('should return null when there is one kms on a region', async () => {
      // GIVEN
      mockGetOkmsList.mockResolvedValue([okmsStrasbourg1Mock]);

      // WHEN
      const { result } = renderHookWithClient(() => useBackToOkmsListUrl());
      await waitFor(() => result.current);

      // THEN
      expect(result.current).toBeNull();
    });

    it('should return the okms List url when there is more than one kms on a region ', async () => {
      // GIVEN
      const mockedUrl = SECRET_MANAGER_ROUTES_URLS.okmsList(REGION_EU_WEST_RBX);
      mockGetOkmsList.mockResolvedValue([okmsRoubaix1Mock, okmsRoubaix2Mock]);

      // WHEN
      const { result } = renderHookWithClient(() => useBackToOkmsListUrl());

      await waitFor(() => result.current);

      // THEN
      expect(result.current).toBe(mockedUrl);
    });
  });
});
