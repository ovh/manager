import { describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as useInstanceModule from '@/api/hooks/useInstance';
import AttachedInstanceComponent from '@/components/list/AttachedInstance.component';
import { Instance } from '@/api/data/instance';

describe('AttachedInstanceComponent', () => {
  it('renders OsdsSkeleton when data is loading', () => {
    vi.spyOn(useInstanceModule, 'useInstance').mockReturnValue({
      data: {},
      isPending: true,
      isLoading: true,
    } as UseQueryResult<Instance>);
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
    vi.spyOn(useInstanceModule, 'useInstance').mockReturnValue({
      data: { name: 'Instance1' },
      isPending: false,
      isLoading: false,
    } as UseQueryResult<Instance>);
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
    vi.spyOn(useInstanceModule, 'useInstance').mockReturnValue({
      data: { name: 'Instance1' },
      isPending: false,
      isLoading: false,
    } as UseQueryResult<Instance>);

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
