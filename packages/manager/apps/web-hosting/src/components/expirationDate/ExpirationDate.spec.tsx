import { useParams } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { DeepPartial } from 'react-hook-form';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGetServiceInfos } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { ServiceInfosType } from '@/data/types/product/service';
import { SERVICE_INFOS_STATUS } from '@/data/types/product/ssl';

import ExpirationDate from './ExpirationDate.component';

type UseGetServiceInfosReturn = ReturnType<typeof useGetServiceInfos>;

type TransProps = {
  i18nKey: string;
  values?: {
    expirationDate?: string;
  };
};

vi.mock('react-i18next', async (importActual) => {
  const actual = await importActual<typeof import('react-i18next')>();
  return {
    ...actual,
    Trans: ({ i18nKey, values }: TransProps) => (
      <span data-testid="expiration-date">{`${i18nKey} ${values?.expirationDate ?? ''}`}</span>
    ),
  };
});

vi.mock('@ovh-ux/muk', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/muk')>();
  return {
    ...actual,
    // keep real MUK exports like Text, Button, etc.
    useNotifications: () => ({
      addSuccess: vi.fn(),
      addWarning: vi.fn(),
    }),
    useFormatDate: () => (date: string) =>
      date === '2026-02-18' ? '18 févr. 2026' : `formatted-${date}`,
  };
});

describe('ExpirationDate', () => {
  beforeEach(() => {
    (useParams as Mock).mockReturnValue({
      serviceName: 'test-service',
    });
  });

  it('display termination date if not expired, in auto-renew and deleteAtExpiration=true', () => {
    const partial = {
      status: SERVICE_INFOS_STATUS.Ok,
      expiration: '2026-02-18',
      renew: { automatic: true, deleteAtExpiration: true },
    } as DeepPartial<ServiceInfosType>;

    vi.mocked(useGetServiceInfos).mockReturnValue({
      data: partial as ServiceInfosType,
    } as UseGetServiceInfosReturn);

    render(<ExpirationDate />);

    expect(screen.getByTestId('expiration-date')).not.toBeNull();
  });

  it('display renew date if not expired, auto-renew and deleteAtExpiration=false', () => {
    const partial = {
      status: SERVICE_INFOS_STATUS.Ok,
      expiration: '2026-02-18',
      renew: { automatic: true, deleteAtExpiration: false },
    } as DeepPartial<ServiceInfosType>;

    vi.mocked(useGetServiceInfos).mockReturnValue({
      data: partial as ServiceInfosType,
    } as UseGetServiceInfosReturn);

    render(<ExpirationDate />);
    expect(screen.getByTestId('expiration-date')).not.toBeNull();
  });

  it('nothing displayed if expired', () => {
    const partial = {
      status: SERVICE_INFOS_STATUS.EXPIRED,
      expiration: '2026-02-18',
      renew: { automatic: true, deleteAtExpiration: true },
    } as DeepPartial<ServiceInfosType>;

    vi.mocked(useGetServiceInfos).mockReturnValue({
      data: partial as ServiceInfosType,
    } as UseGetServiceInfosReturn);

    const { container } = render(<ExpirationDate />);
    expect(container.childElementCount).to.equal(0);
  });

  it('nothing displayed if not expired but auto-renew=false', () => {
    const partial = {
      status: SERVICE_INFOS_STATUS.Ok,
      expiration: '2026-02-18',
      renew: { automatic: false, deleteAtExpiration: true },
    } as DeepPartial<ServiceInfosType>;

    vi.mocked(useGetServiceInfos).mockReturnValue({
      data: partial as ServiceInfosType,
    } as UseGetServiceInfosReturn);

    const { container } = render(<ExpirationDate />);
    expect(container.childElementCount).to.equal(0);
  });
});
