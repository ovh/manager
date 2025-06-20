import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { IAMModal } from './IAMModal';
import { wrapper } from '@/wrapperRenders';

describe('IAM authentication management modal', () => {
  const handleQuit = vi.fn();
  const handleManageIAM = vi.fn();
  const handleFailure = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays enable IAM content if private registry IAM status is disabled', async () => {
    const { getByText } = render(
      <IAMModal
        iamEnabled={false}
        registryStatus="READY"
        onManageIAM={handleManageIAM}
        onQuit={handleQuit}
        onFailure={handleFailure}
      />,
      { wrapper },
    );

    expect(
      getByText(`private_registry_iam_authentication_enable_warning`),
    ).toBeInTheDocument();
    expect(handleFailure).not.toHaveBeenCalled();
  });

  it('displays disable IAM content if private registry IAM status is enabled', async () => {
    const { getByText } = render(
      <IAMModal
        iamEnabled
        registryStatus="READY"
        onManageIAM={handleManageIAM}
        onQuit={handleQuit}
        onFailure={handleFailure}
      />,
      { wrapper },
    );

    expect(
      getByText(`private_registry_iam_authentication_disable_warning`),
    ).toBeInTheDocument();
    expect(handleFailure).not.toHaveBeenCalled();
  });

  it('closes IAM modal if registry status is not "READY"', async () => {
    render(
      <IAMModal
        iamEnabled
        registryStatus="UPDATING"
        onManageIAM={handleManageIAM}
        onQuit={handleQuit}
        onFailure={handleFailure}
      />,
      { wrapper },
    );

    expect(handleFailure).toHaveBeenCalled();
  });
});
