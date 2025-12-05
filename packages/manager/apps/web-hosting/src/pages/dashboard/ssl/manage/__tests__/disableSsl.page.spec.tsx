import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import DisableSslModal from '../disableSsl.page';

const { mockDelete } = vi.hoisted(() => ({
  mockDelete: vi.fn(),
}));
vi.mock(
  '@ovh-ux/manager-core-api',
  async (importOriginal: () => Promise<typeof import('@ovh-ux/manager-core-api')>) => {
    const actual = await importOriginal();
    return {
      ...actual,
      v6: {
        delete: mockDelete,
      },
    };
  },
);

vi.mock('@/data/hooks/ssl/useSsl', () => ({
  useDeleteDomainCertificate: vi.fn((serviceName: string) => ({
    deleteDomainCertificate: (domain: string) => {
      mockDelete(`/hosting/web/${serviceName}/attachedDomain/${domain}/ssl`);
    },
  })),
}));

describe('DisableSslModal', () => {
  it('call deleteDomainCertificate and close modal', async () => {
    const { getByTestId } = render(<DisableSslModal />, { wrapper });

    const primaryBtn = getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(
        '/hosting/web/test-service/attachedDomain/test-domain.com/ssl',
      );
    });
  });

  it('cancel button close modal', () => {
    const { getByTestId } = render(<DisableSslModal />, { wrapper });

    fireEvent.click(getByTestId('secondary-button'));
    expect(navigate).toHaveBeenCalled();
  });
});
