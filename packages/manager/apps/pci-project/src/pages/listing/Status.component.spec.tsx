/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import StatusComponent from './Status.component';
import { TProjectWithService } from '@/data/types/project.type';

const createMockProject = (
  status: string,
  billingState = 'ok',
): TProjectWithService =>
  ({
    project_id: 'test-project',
    status,
    isUnpaid: billingState === 'unpaid',
    service: {
      billing: {
        lifecycle: {
          current: {
            state: billingState,
          },
        },
      },
    },
  } as TProjectWithService);

describe('StatusComponent', () => {
  it('renders with ok status', async () => {
    const project = createMockProject('ok');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'success');
    expect(badge).toHaveTextContent('pci_projects_status_ok');
  });

  it('renders with deleted status', async () => {
    const project = createMockProject('deleted');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'critical');
    expect(badge).toHaveTextContent('pci_projects_status_deleted');
  });

  it('renders with suspended status', async () => {
    const project = createMockProject('suspended');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'critical');
    expect(badge).toHaveTextContent('pci_projects_status_suspended');
  });

  it('renders with deleting status', async () => {
    const project = createMockProject('deleting');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'warning');
    expect(badge).toHaveTextContent('pci_projects_status_deleting');
  });

  it('renders with unpaid status and shows pending debt', async () => {
    const project = createMockProject('ok', 'unpaid');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'critical');
    expect(badge).toHaveTextContent('pci_projects_status_pendingDebt');
  });

  it('renders with unpaid and suspended statuses and shows suspeded status', async () => {
    const project = createMockProject('suspended', 'unpaid');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'critical');
    expect(badge).toHaveTextContent('pci_projects_status_suspended');
  });

  it('renders with default information color for unknown status', async () => {
    const project = createMockProject('unknown_status');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'information');
    expect(badge).toHaveTextContent('pci_projects_status_unknown_status');
  });
});
