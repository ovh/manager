import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as pciCommon from '@ovh-ux/manager-pci-common';
import StatusComponent from '@/components/list/Status.component';

vi.mock('react-i18next', async (importOrig) => {
  const orig = await importOrig<typeof import('react-i18next')>();
  return {
    ...orig,
    useTranslation: () => ({
      ...orig.useTranslation(),
      i18n: {
        exists: () => true,
      },
    }),
  };
});

const badgeSpy = vi.spyOn(pciCommon, 'Badge');

afterEach(() => {
  vi.clearAllMocks();
});

describe('StatusComponent', () => {
  it('renders correct color for ACTIVE status', () => {
    const { getByText } = render(
      <StatusComponent statusGroup="ACTIVE" status="ACTIVE" />,
    );
    expect(getByText('ACTIVE')).toBeInTheDocument();
    expect(badgeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        color: 'success',
      }),
      expect.anything(),
    );
  });

  it('renders correct color for PENDING status', () => {
    const { getByText } = render(
      <StatusComponent statusGroup="PENDING" status="PENDING" />,
    );
    expect(getByText('PENDING')).toBeInTheDocument();
    expect(badgeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ color: 'warning' }),
      expect.anything(),
    );
  });

  it('renders correct color for ERROR status', () => {
    const { getByText } = render(
      <StatusComponent statusGroup="ERROR" status="ERROR" />,
    );
    expect(getByText('ERROR')).toBeInTheDocument();
    expect(badgeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ color: 'critical' }),
      expect.anything(),
    );
  });

  it('renders correct color for unknown status', () => {
    const { getByText } = render(
      <StatusComponent statusGroup="UNKNOWN" status="UNKNOWN" />,
    );
    expect(getByText('UNKNOWN')).toBeInTheDocument();
    expect(badgeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ color: 'information' }),
      expect.anything(),
    );
  });

  it('renders correct translation when status and statusGroup are different', () => {
    const { getByText } = render(
      <StatusComponent statusGroup="ACTIVE" status="PENDING" />,
    );
    expect(getByText('PENDING')).toBeInTheDocument();
  });
});
