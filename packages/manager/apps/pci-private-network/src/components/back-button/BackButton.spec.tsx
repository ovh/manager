import '@testing-library/jest-dom';
import { describe, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BackButton from './BackButton.component';

const { projectId, clearNotifications, resetNetworks } = vi.hoisted(() => ({
  projectId: 'projectIdMocked',
  clearNotifications: vi.fn(),
  resetNetworks: vi.fn(),
}));

vi.mock('react-router-dom');

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProject: vi.fn().mockReturnValue({ data: { project_id: projectId } }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: vi.fn().mockReturnValue({ clearNotifications }),
}));

vi.mock('@/queryClient', () => ({ resetNetworks }));

describe('BackButton', () => {
  it('should reset cache and clearNotification on click', async () => {
    render(<BackButton />);

    const btn = screen.getByTestId('back-btn');
    fireEvent.click(btn);

    await waitFor(() => expect(resetNetworks).toHaveBeenCalledWith(projectId));
    expect(clearNotifications).toHaveBeenCalled();
  });
});
