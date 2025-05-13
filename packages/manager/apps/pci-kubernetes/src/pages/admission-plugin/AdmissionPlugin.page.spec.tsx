import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OsdsSwitch } from '@ovhcloud/ods-components';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import AdmissionPluginsModal from './AdmissionPlugins.page';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { wrapper } from '@/wrapperRenders';

const navigate = vi.fn();

const updateAdmissionPlugin = vi.fn();

vi.mock('@/api/hooks/useKubernetes', () => ({
  useKubernetesCluster: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => navigate,
  useParams: () => ({}),
}));

vi.mock('@/api/hooks/useAdmissionPlugin/useAdmissionPlugin', () => ({
  useUpdateAdmissionPlugin: () => ({
    updateAdmissionPlugins: updateAdmissionPlugin,
  }),
}));

describe('AdmissionPluginsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    updateAdmissionPlugin.mockReturnValue({
      updateAdmissionPlugins: vi.fn(),
      isPending: false,
    });
  });

  it('renders the modal with a spinner when loading', async () => {
    (useKubernetesModule.useKubernetesCluster as Mock).mockReturnValue({
      data: null,
      isPending: true,
    });

    render(<AdmissionPluginsModal />, { wrapper });
    expect(screen.getByTestId('wrapper')).toBeInTheDocument();
  });

  it('renders the modal with plugins when data is available', async () => {
    (useKubernetesModule.useKubernetesCluster as Mock).mockReturnValue({
      data: {
        customization: {
          apiServer: {
            admissionPlugins: { enabled: ['NodeRestrictions'], disabled: [] },
          },
        },
        plugins: [
          {
            name: 'NodeRestrictions',
            state: 'enabled',
            tip: 'node_restrictions_tip',
          },
        ],
      },
      isPending: false,
    });

    const { container } = render(<AdmissionPluginsModal />, { wrapper });
    const modal = container.querySelector('osds-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveProperty(
      'headline',
      'kube_service_cluster_admission_plugins_mutation',
    );
  });

  it('handles plugin switch change', () => {
    (useKubernetesModule.useKubernetesCluster as Mock).mockReturnValue({
      data: {
        customization: {
          apiServer: {
            admissionPlugins: { enabled: ['AlwaysPullImages'], disabled: [] },
          },
        },
        plugins: [
          {
            name: 'AlwaysPullImages',
            state: 'enabled',
            tip: 'always_pull_images_tip',
          },
        ],
      },
      isPending: false,
    });

    render(<AdmissionPluginsModal />, { wrapper });
    const switchElement = screen.getAllByText(
      'kube_service_cluster_admission_plugins_to_activate',
    );
    fireEvent.change(switchElement[0], { detail: { current: 'enabled' } });
  });

  it('handles cancel button click', () => {
    render(<AdmissionPluginsModal />, { wrapper });
    const cancelButton = screen.getByText(
      'common:common_stepper_cancel_button_label',
    );
    fireEvent.click(cancelButton);
    expect(navigate).toHaveBeenCalledWith('..');
  });

  it('handles save button click', async () => {
    (useKubernetesModule.useKubernetesCluster as Mock).mockReturnValue({
      data: {
        customization: {
          apiServer: {
            admissionPlugins: { enabled: ['AlwaysPullImages'], disabled: [] },
          },
        },
        plugins: [
          {
            name: 'AlwaysPullImages',
            state: 'enabled',
            tip: 'always_pull_images_tip',
            disabled: false,
          },
        ],
      },
      isPending: false,
    });

    render(<AdmissionPluginsModal />, { wrapper });

    const saveButton = screen.getByText('common:common_save_button_label');
    const input = (screen.getByTestId(
      'AlwaysPullImages-switch',
    ) as unknown) as OsdsSwitch;

    input.odsSwitchChanged.emit({
      current: 'disabled',
    });
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
      fireEvent.click(saveButton);

      expect(updateAdmissionPlugin).toHaveBeenCalledWith({
        apiServer: {
          admissionPlugins: {
            disabled: ['AlwaysPullImages'],
            enabled: [],
          },
        },
      });
    });
  });
});
