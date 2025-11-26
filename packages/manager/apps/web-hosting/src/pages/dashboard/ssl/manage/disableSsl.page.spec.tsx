import React, { ComponentType } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createTestWrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import DisableSslModal from './disableSsl.page';

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

vi.mock('@ovh-ux/muk', () => ({
  Modal: vi.fn(
    ({
      children,
      primaryButton,
      secondaryButton,
    }: {
      children: React.ReactNode;
      primaryButton?: { label: string; onClick: () => void };
      secondaryButton?: { label: string; onClick: () => void };
    }) => (
      <div data-testid="modal">
        {children}
        {primaryButton && (
          <button data-testid="primary-button" onClick={primaryButton.onClick}>
            {primaryButton.label}
          </button>
        )}
        {secondaryButton && (
          <button data-testid="secondary-button" onClick={secondaryButton.onClick}>
            {secondaryButton.label}
          </button>
        )}
      </div>
    ),
  ),
  useNotifications: vi.fn(() => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
    addWarning: vi.fn(),
    addInfo: vi.fn(),
  })),
}));

const Wrappers = createTestWrapper();

describe('DisableSslModal', () => {
  it('call deleteDomainCertificate and close modal', async () => {
    render(<DisableSslModal />, { wrapper: Wrappers as ComponentType });

    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain/domain/ssl');
    });
  });

  it('cancel button close modal', () => {
    render(<DisableSslModal />, { wrapper: Wrappers as ComponentType });

    fireEvent.click(screen.getByTestId('secondary-button'));
    expect(navigate).toHaveBeenCalled();
  });
});
