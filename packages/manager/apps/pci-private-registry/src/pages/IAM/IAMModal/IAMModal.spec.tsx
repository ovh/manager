import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { IAMModal } from './IAMModal';
import { wrapper } from '@/wrapperRenders';

describe('IAM authentication management modal', () => {
  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string): string => `${key}`,
    }),
    Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
  }));

  const handleQuit = vi.fn();
  const handleManageIAM = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays enable IAM content if private registry IAM status is disabled', async () => {
    const { getByText } = render(
      <IAMModal
        iamEnabled={false}
        onManageIAM={handleManageIAM}
        onQuit={handleQuit}
      />,
      { wrapper },
    );

    expect(
      getByText(`private_registry_iam_authentication_enable_warning`),
    ).toBeInTheDocument();
  });

  it('displays disable IAM content if private registry IAM status is enabled', async () => {
    const { getByText } = render(
      <IAMModal iamEnabled onManageIAM={handleManageIAM} onQuit={handleQuit} />,
      { wrapper },
    );

    expect(
      getByText(`private_registry_iam_authentication_disable_warning`),
    ).toBeInTheDocument();
  });
});
