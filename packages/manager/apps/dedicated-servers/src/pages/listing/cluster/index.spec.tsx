import '@/test-utils/setupTests';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  prettyDOM,
} from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';
import { labels, renderTest } from '@/test-utils';

describe('cluster listing page', () => {
  it('should redirect to the onboarding page when the list is empty', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: [],
      isLoading: true,
    });
    const navigate = vi.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    await renderTest({});
    expect(navigate).toHaveBeenCalled();
  });
});
