import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import AdmissionPlugins from './AdmissionPlugins.component';

const navigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('AdmissionPlugins', () => {
  it('renders plugins correctly', () => {
    const enabled = ['NodeRestriction'];
    const disabled = ['AlwaysPullImages'];

    render(
      <AdmissionPlugins
        enabled={enabled}
        disabled={disabled}
        isProcessing={false}
      />,
    );

    // Check plugin labels
    expect(screen.getByText('Plugin Node Restriction')).toBeInTheDocument();
    expect(screen.getByText('Plugin Always Pull Images')).toBeInTheDocument();

    // Check chip colors and texts
    const nodeRestrictionChip = screen.getByTestId(
      'admission-plugin-chip NodeRestriction',
    );
    expect(nodeRestrictionChip).toHaveStyle(
      `background-color: ${ODS_THEME_COLOR_INTENT.success}`,
    );
    expect(nodeRestrictionChip).toHaveTextContent(
      'kube_service_cluster_admission_plugins_activated',
    );

    const alwaysPullImagesChip = screen.getByTestId(
      'admission-plugin-chip AlwaysPullImages',
    );
    expect(alwaysPullImagesChip).toHaveStyle(
      `background-color: ${ODS_THEME_COLOR_INTENT.warning}`,
    );
    expect(alwaysPullImagesChip).toHaveTextContent(
      'kube_service_cluster_admission_plugins_desactivated',
    );
  });

  it('renders the mutation link', () => {
    render(
      <AdmissionPlugins enabled={[]} disabled={[]} isProcessing={false} />,
    );

    const mutationLink = screen.getByText(
      'kube_service_cluster_admission_plugins_mutation',
    );
    expect(mutationLink).toBeInTheDocument();
  });

  it('disables the mutation link when isProcessing is true', () => {
    render(<AdmissionPlugins enabled={[]} disabled={[]} isProcessing />);

    const mutationLink = screen.getByText(
      'kube_service_cluster_admission_plugins_mutation',
    );
    expect(mutationLink).toBeDisabled();
    mutationLink.click();
    expect(navigate).not.toHaveBeenCalledWith('./admission-plugin');
  });

  it('navigates to the admission-plugin page when the mutation link is clicked', () => {
    render(
      <AdmissionPlugins enabled={[]} disabled={[]} isProcessing={false} />,
    );

    const mutationLink = screen.getByText(
      'kube_service_cluster_admission_plugins_mutation',
    );
    mutationLink.click();

    expect(navigate).toHaveBeenCalledWith('./admission-plugin');
  });
});
