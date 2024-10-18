import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import AdmissionPluginsModal from './AdmissionPlugins.page';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { wrapper } from '@/wrapperRenders';

const navigate = vi.fn();
const plugState = vi.fn();
const updateAdmissionPlugin = vi.fn();

vi.mock('@/api/hooks/useKubernetes', () => ({
  useKubernetesCluster: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => navigate,
  useParams: () => ({}),
}));

vi.mock('../hooks/usePluginState', () => plugState);
vi.mock('@/api/hooks/useAdmissionPlugin/useAdmissionPlugin', () => ({
  useUpdateAdmissionPlugin: () => ({
    updateAdmissionPlugins: updateAdmissionPlugin,
  }),
}));

describe('AdmissionPluginsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    plugState.mockReturnValue(() => 'enabled');
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

  it('handles save button click', () => {
    render(<AdmissionPluginsModal />, { wrapper });
    const saveButton = screen.getByText('common:common_save_button_label');
    fireEvent.click(saveButton);
    expect(updateAdmissionPlugin).toHaveBeenCalled();
  });
});
