import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import ClusterStatus from '@/components/service/ClusterStatus.component';

describe('ClusterStatus', () => {
  it('renders chip with success color when status is READY', () => {
    const { getByTestId } = render(<ClusterStatus status="READY" />);
    const chip = getByTestId('clusterStatus-chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.success);
  });

  it('renders chip with warning color when status is INSTALLING', () => {
    const { getByTestId } = render(<ClusterStatus status="INSTALLING" />);
    const chip = getByTestId('clusterStatus-chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.warning);
  });

  it('renders chip with error color when status is ERROR', () => {
    const { getByTestId } = render(<ClusterStatus status="ERROR" />);
    const chip = getByTestId('clusterStatus-chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.error);
  });

  it('renders chip with info color when status is unknown', () => {
    const { getByTestId } = render(<ClusterStatus status="UNKNOWN" />);
    const chip = getByTestId('clusterStatus-chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.info);
  });

  it('renders translated status label when translation exists', () => {
    const { getByText } = render(<ClusterStatus status="READY" />);
    expect(getByText('kube_service_cluster_status_READY')).toBeInTheDocument();
  });
});
