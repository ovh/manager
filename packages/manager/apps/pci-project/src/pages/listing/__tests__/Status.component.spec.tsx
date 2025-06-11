import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TProjectWithService } from '@/data/models/Project.type';

import StatusComponent from '../Status.component';

const createMockProject = (status: string, billingState = 'ok'): TProjectWithService =>
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
  }) as TProjectWithService;

describe('StatusComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with ok status', () => {
    const project = createMockProject('ok');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'success');
    expect(badge).toHaveTextContent('ok');
  });

  it('renders with deleted status', () => {
    const project = createMockProject('deleted');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'critical');
    expect(badge).toHaveTextContent('service_state_deleted');
  });

  it('renders with suspended status', () => {
    const project = createMockProject('suspended');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'critical');
    expect(badge).toHaveTextContent('suspended');
  });

  it('renders with deleting status', () => {
    const project = createMockProject('deleting');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'warning');
    expect(badge).toHaveTextContent('deleting');
  });

  it('renders with unpaid status and shows pending debt', () => {
    const project = createMockProject('ok', 'unpaid');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'critical');
    expect(badge).toHaveTextContent('pendingDebt');
  });

  it('renders with unpaid and suspended statuses and shows suspeded status', () => {
    const project = createMockProject('suspended', 'unpaid');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'critical');
    expect(badge).toHaveTextContent('suspended');
  });

  it('renders with default information color for unknown status', () => {
    const project = createMockProject('unknown_status');
    const { getByTestId } = render(<StatusComponent project={project} />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'information');
    expect(badge).toHaveTextContent('unknown_status');
  });
});
