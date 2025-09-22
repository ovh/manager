import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import ClusterTile from '@/components/service/ClusterTile.component';

describe('ClusterTile', () => {
  it('renders the cluster quota text', () => {
    render(<ClusterTile />);

    // Check if the translated quota text is rendered
    expect(screen.getByText('kube_service_cluster_etcd_quota')).toBeInTheDocument();
  });

  it('renders the help icon with correct color and size', () => {
    const { container } = render(<ClusterTile />);
    const icon = container.querySelector('osds-icon'); // Assuming the icon has a role of 'img'
    expect(icon).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.primary);
    fireEvent.click(icon);
    expect(screen.getByText('kube_service_cluster_etcd_quota_info')).toBeVisible();
  });
});
