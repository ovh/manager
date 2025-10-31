import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import DeploymentZone from './DeploymentZone.component';

vi.mock('@/components/pciCard/PciCard.component', () => ({
  PciCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('DeploymentZone component', () => {
  const baseZones = [
    { zone: 'GRA1', checked: false },
    { zone: 'BHS5', checked: true },
  ];

  const setup = (props?: Partial<React.ComponentProps<typeof DeploymentZone>>) => {
    const onSelect = vi.fn();
    render(
      <DeploymentZone
        availabilityZones={baseZones}
        multiple={false}
        onSelect={onSelect}
        {...props}
      />,
    );
    return { onSelect };
  };

  it.each([
    { multiple: true, desc: 'renders checkboxes for multiple selection' },
    { multiple: false, desc: 'renders radios for single selection' },
  ])('should render correctly when $desc', ({ multiple }) => {
    setup({ multiple });
    const inputs = screen.queryAllByRole('radio', { hidden: true }).length
      ? screen.getAllByRole('radio', { hidden: true })
      : screen.getAllByRole('checkbox', { hidden: true });

    expect(inputs.length).toBe(2);
  });

  it.each([
    { multiple: true, expectedKey: 'checkbox' },
    { multiple: false, expectedKey: 'radio' },
  ])('calls onSelect correctly when changing a $expectedKey', async ({ multiple }) => {
    const { onSelect } = setup({ multiple });

    const label = screen.getByText('GRA1');
    await userEvent.click(label);

    expect(onSelect).toHaveBeenCalledWith([
      expect.objectContaining({ zone: 'GRA1' }),
      expect.objectContaining({ zone: 'BHS5' }),
    ]);
  });

  it('shows a validation message when multiple=true and no zones are selected', () => {
    setup({
      multiple: true,
      availabilityZones: [
        { zone: 'GRA1', checked: false },
        { zone: 'BHS5', checked: false },
      ],
    });

    expect(screen.getByText('kube_common_node_pool_select_zone')).toBeInTheDocument();
  });
});
