import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { VCDResourceStatus } from '@ovh-ux/manager-module-vcd-api';
import { useMessageContext } from '../../context/Message.context';
import MessageSuspendedService from './MessageSuspendedService.component';

const renderComponent = (status: VCDResourceStatus) =>
  render(<MessageSuspendedService status={status} />);

vi.mocked(useMessageContext);
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn().mockReturnValue('path'),
}));

describe('<MessageSuspendedService /> test suites', () => {
  afterAll(vi.clearAllMocks);

  it('when service is suspended a warning message should be displayed', () => {
    renderComponent('SUSPENDED');

    const message = screen.getByText('cancel_service_success');
    expect(message.getAttribute('is-dismissible')).toBe('false');
    expect(message.getAttribute('color')).toBe('warning');
  });

  it('when service is not suspended no warning message should be displayed', () => {
    renderComponent('READY');

    const message = screen.queryByText('cancel_service_success');
    expect(message).not.toBeInTheDocument();
  });
});
