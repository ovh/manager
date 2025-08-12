import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import ApiTerraformDialog from '@/pages/services/create/_components/ApiTerraformDialog.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

const serviceToTerraform = vi.fn().mockName('serviceToTerraform');
const projectId = 'project-123';

describe('ApiTerraformDialog', () => {
  const mockFormData = {
    name: 'myNewPG',
    nbNodes: 2,
    flavor: 'db1',
    region: 'GRA',
    plan: 'plan-1',
    engineWithVersion: {
      engine: 'postgresql',
      version: '14',
    },
    network: {
      type: 'private',
      subnetId: 'subnet-123',
    },
    additionalStorage: 0,
  };

  const onRequestClose = vi.fn();

  const dialogDataMock = {
    availability: {
      availability: {
        engine: 'postgresql',
      },
    },
    flavor: {
      storage: {
        minimum: { value: 50 },
      },
    },
    network: {
      network: {
        regions: [{ region: 'GRA', openstackId: 'os-123' }],
      },
    },
  };

  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
    }),
    Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }));

  vi.mock('@/hooks/useLocale', () => ({
    useLocale: () => 'fr_FR',
  }));

  vi.mock('@/hooks/api/project/usePciProject.hook', () => ({
    default: () => ({
      data: { project_id: projectId },
    }),
  }));

  vi.mock('@/hooks/api/database/terraform/useServiceToTerraform', () => ({
    useServiceToTerraform: () => ({
      serviceToTerraform,
    }),
  }));

  vi.mock('@datatr-ux/uxlib', async () => {
    const mod = await vi.importActual('@datatr-ux/uxlib');
    return {
      ...mod,
      useToast: () => ({
        toast: vi.fn(),
      }),
    };
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should close the dialog on footer close button click', async () => {
    render(
      <ApiTerraformDialog
        onRequestClose={onRequestClose}
        dialogData={dialogDataMock as any}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    const footerCloseButton = screen.getByTestId('dialog-close-button-footer');
    expect(footerCloseButton).toBeInTheDocument();
    fireEvent.click(footerCloseButton);
    expect(onRequestClose).toHaveBeenCalled();
  });
});
