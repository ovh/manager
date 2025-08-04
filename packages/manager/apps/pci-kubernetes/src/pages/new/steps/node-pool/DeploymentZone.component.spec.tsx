import { vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import DeploymentZone from './DeploymentZone.component';

describe('DeploymentZone component', () => {
  const availabilityZones = ['zone1', 'zone2', 'zone3'];
  const selectedAvailibilityZone = 'zone1';
  const setNodePoolState = vi.fn();

  it('renders correctly', () => {
    const { getByText } = render(
      <DeploymentZone
        onSelect={setNodePoolState}
        selectedAvailibilityZone={selectedAvailibilityZone}
        availabilityZones={availabilityZones}
      />,
    );

    expect(getByText('kube_common_node_pool_deploy_title')).toBeInTheDocument();
    expect(
      getByText('kube_common_node_pool_deploy_description'),
    ).toBeInTheDocument();
    availabilityZones.forEach((zone) => {
      expect(getByText(zone)).toBeInTheDocument();
    });
  });

  it('calls setNodePoolState when a zone is clicked', () => {
    const { getAllByRole } = render(
      <DeploymentZone
        onSelect={setNodePoolState}
        selectedAvailibilityZone={selectedAvailibilityZone}
        availabilityZones={availabilityZones}
      />,
    );

    const buttons = getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(setNodePoolState).toHaveBeenCalledWith('zone1');
  });

  it('highlights the selected zone', () => {
    const { getAllByRole } = render(
      <DeploymentZone
        onSelect={setNodePoolState}
        selectedAvailibilityZone={selectedAvailibilityZone}
        availabilityZones={availabilityZones}
      />,
    );

    const buttons = getAllByRole('button');
    expect(buttons[0]).toHaveClass('selectedTileClass');
  });
});
