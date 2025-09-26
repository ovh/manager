import { useParams } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { SERVICE_INFOS_STATUS } from '@/data/types/product/ssl';

import ExpirationDate from './ExpirationDate.component';

const hoistedMock = vi.hoisted(() => ({
  useGetServiceInfos: vi.fn(),
}));

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', async (importActual) => {
  const actual =
    await importActual<typeof import('@/data/hooks/webHostingDashboard/useWebHostingDashboard')>();
  return {
    ...actual,
    useGetServiceInfos: hoistedMock.useGetServiceInfos,
  };
});

type TransProps = {
  i18nKey: string;
  values?: {
    expirationDate?: string;
  };
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey, values }: TransProps) => (
    <span data-testid="expiration-date">{`${i18nKey} ${values?.expirationDate ?? ''}`}</span>
  ),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFormatDate: () => (date: string) => {
    if (date === '2026-02-18') return '18 févr. 2026';
    return `formatted-${date}`;
  },
}));

describe('ExpirationDate', () => {
  beforeEach(() => {
    (useParams as unknown as Mock).mockReturnValue({
      serviceName: 'test-service',
    });
  });

  it('display termination date if not expired, in auto-renew and deleteAtExpiration=true', () => {
    hoistedMock.useGetServiceInfos.mockReturnValue({
      data: {
        status: SERVICE_INFOS_STATUS.Ok,
        expiration: '2026-02-18',
        renew: { automatic: true, deleteAtExpiration: true },
      },
    });

    render(<ExpirationDate />);

    expect(screen.getByTestId('expiration-date')).not.toBeNull();
  });

  it('display renew date if not expired, auto-renew and deleteAtExpiration=false', () => {
    hoistedMock.useGetServiceInfos.mockReturnValue({
      data: {
        status: SERVICE_INFOS_STATUS.Ok,
        expiration: '2026-02-18',
        renew: { automatic: true, deleteAtExpiration: false },
      },
    });

    render(<ExpirationDate />);
    expect(screen.getByTestId('expiration-date')).not.toBeNull();
  });

  it('nothing displayed if expired', () => {
    hoistedMock.useGetServiceInfos.mockReturnValue({
      data: {
        status: SERVICE_INFOS_STATUS.EXPIRED,
        expiration: '2026-02-18',
        renew: { automatic: true, deleteAtExpiration: true },
      },
    });

    const { container } = render(<ExpirationDate />);
    expect(container.childElementCount).to.equal(0);
  });

  it('nothing displayed if not expired but auto-renew=false', () => {
    hoistedMock.useGetServiceInfos.mockReturnValue({
      data: {
        status: SERVICE_INFOS_STATUS.Ok,
        expiration: '2026-02-18',
        renew: { automatic: false, deleteAtExpiration: true },
      },
    });

    const { container } = render(<ExpirationDate />);
    expect(container.childElementCount).to.equal(0);
  });
});
