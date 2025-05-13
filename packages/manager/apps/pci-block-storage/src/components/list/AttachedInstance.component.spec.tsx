import { describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as pciCommonModule from '@ovh-ux/manager-pci-common';
import { TInstance } from '@ovh-ux/manager-pci-common';
import AttachedInstanceComponent from '@/components/list/AttachedInstance.component';

describe('AttachedInstanceComponent', () => {
  it('renders OsdsSkeleton when data is loading', () => {
    vi.spyOn(pciCommonModule, 'useInstance').mockReturnValue({
      data: {},
      isPending: true,
      isLoading: true,
    } as UseQueryResult<TInstance>);
    const { getByTestId } = render(
      <AttachedInstanceComponent
        projectId="project1"
        instanceId="instance1"
        projectUrl="/project"
      />,
    );
    expect(
      getByTestId('AttachedInstanceComponent_skeleton'),
    ).toBeInTheDocument();
  });

  it('renders instance name when data is loaded', async () => {
    vi.spyOn(pciCommonModule, 'useInstance').mockReturnValue({
      data: { name: 'Instance1' },
      isPending: false,
      isLoading: false,
    } as UseQueryResult<TInstance>);
    render(
      <AttachedInstanceComponent
        projectId="project1"
        instanceId="instance1"
        projectUrl="/project"
      />,
    );
    expect(await screen.findByText('Instance1')).toBeInTheDocument();
  });

  it('renders correct instance link when data is loaded', async () => {
    vi.spyOn(pciCommonModule, 'useInstance').mockReturnValue({
      data: { name: 'Instance1' },
      isPending: false,
      isLoading: false,
    } as UseQueryResult<TInstance>);

    const { getByTestId } = render(
      <AttachedInstanceComponent
        projectId="project1"
        instanceId="instance1"
        projectUrl="/project"
      />,
    );
    expect(getByTestId('AttachedInstanceComponent_link')).toHaveAttribute(
      'href',
      '/project/instances/instance1',
    );
  });
});
