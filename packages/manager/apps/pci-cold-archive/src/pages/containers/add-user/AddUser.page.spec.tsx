import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TUser } from '@/api/data/users';
import { useAddUser } from '@/api/hooks/useArchive';
import { useUsers } from '@/api/hooks/useUsers';
import { useNotifications } from '@/hooks/useNotifications';
import { useTracking } from '@/hooks/useTracking';
import AddUserPage from './AddUser.page';

vi.mock('@ovhcloud/ods-components/react', async () => {
  const originalModule = await vi.importActual(
    '@ovhcloud/ods-components/react',
  );

  return {
    ...originalModule,
    OdsRadio: (props) => <input type="radio" {...props} />,
  };
});

vi.mock('@/api/hooks/useUsers', () => ({
  useUsers: vi.fn(),
}));

vi.mock('@/api/hooks/useArchive', () => ({
  useAddUser: vi.fn(),
}));

vi.mock('@/hooks/useTracking', () => ({
  useTracking: vi.fn(),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

describe('AddUserPage', () => {
  const mockUsers = [
    { id: 1, description: 'User 1' },
    { id: 2, description: 'User 2' },
  ] as TUser[];

  const mockNavigate = vi.fn();
  const mockAddUser = vi.fn();
  const mockTrackConfirmAction = vi.fn();
  const mockTrackCancelAction = vi.fn();
  const mockTrackSuccessPage = vi.fn();
  const mockTrackErrorPage = vi.fn();
  const mockTrackActionClick = vi.fn();
  const mockTrackNavigationClick = vi.fn();
  const mockTackCopyClipboardClick = vi.fn();
  const mockAddSuccessMessage = vi.fn();
  const mockAddErrorMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useUsers).mockReturnValue({
      validUsersWithCredentials: mockUsers,
      isPending: false,
    } as ReturnType<typeof useUsers>);

    vi.mocked(useAddUser).mockReturnValue({
      addUser: () => mockAddUser(),
      isPending: false,
    } as ReturnType<typeof useAddUser>);

    vi.mocked(useTracking).mockReturnValue({
      trackConfirmAction: mockTrackConfirmAction,
      trackCancelAction: mockTrackCancelAction,
      trackSuccessPage: mockTrackSuccessPage,
      trackErrorPage: mockTrackErrorPage,
      trackActionClick: mockTrackActionClick,
      trackNavigationClick: mockTrackNavigationClick,
      trackCopyClipboardClick: mockTackCopyClipboardClick,
    });

    vi.mocked(useNotifications).mockReturnValue({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    });
  });

  it('renders the modal with step one initially', () => {
    render(<AddUserPage />);

    expect(
      screen.getByText(
        'pci_projects_project_storages_coldArchive_containers_addUser_container_title',
      ),
    ).toBeVisible();
    expect(screen.getByTestId('addUser_stepOne')).toBeInTheDocument();
    expect(screen.queryByTestId('addUser_stepTwo')).not.toBeInTheDocument();
  });

  it('should display a spinner when data is loading', () => {
    vi.mocked(useUsers).mockReturnValue({
      validUsersWithCredentials: null,
      isPending: true,
    } as ReturnType<typeof useUsers>);

    const { container } = render(<AddUserPage />);

    expect(container.querySelector('ods-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('addUser_stepOne')).not.toBeInTheDocument();
    expect(screen.queryByTestId('addUser_stepTwo')).not.toBeInTheDocument();
  });

  it('should moves to step two when next button is clicked with a selected user', async () => {
    const { container } = render(<AddUserPage />);

    fireEvent.change(screen.getByTestId('addUser-user_select'), {
      target: { value: 'user1' },
    });

    const nextButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_coldArchive_containers_addUser_next_label"]',
    );
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.queryByTestId('addUser_stepOne')).not.toBeInTheDocument();
      expect(screen.getByTestId('addUser_stepTwo')).toBeInTheDocument();
    });
  });

  it('should goes back to step one when back button is clicked', async () => {
    const { container } = render(<AddUserPage />);

    fireEvent.change(screen.getByTestId('addUser-user_select'), {
      target: { value: 'user1' },
    });

    const nextButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_coldArchive_containers_addUser_next_label"]',
    );
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('addUser_stepTwo')).toBeInTheDocument();
    });

    const backButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_coldArchive_containers_addUser_back_label"]',
    );
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByTestId('addUser_stepOne')).toBeInTheDocument();
      expect(screen.queryByTestId('addUser_stepTwo')).not.toBeInTheDocument();
    });
  });

  it('should submit the form when confirm button is clicked on step two', async () => {
    const { container } = render(<AddUserPage />);

    fireEvent.change(screen.getByTestId('addUser-user_select'), {
      target: { value: 'user1' },
    });

    const nextButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_coldArchive_containers_addUser_next_label"]',
    );
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('addUser_stepTwo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByTestId('AddUser-role_radio')[0]);

    const submitButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_coldArchive_containers_addUser_submit_label"]',
    );
    fireEvent.click(submitButton);

    expect(mockTrackConfirmAction).toHaveBeenCalled();
    expect(mockAddUser).toHaveBeenCalled();
  });

  it('should navigate back when cancel button is clicked', () => {
    const { container } = render(<AddUserPage />);

    const cancelButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_coldArchive_containers_addUser_cancel_label"]',
    );
    fireEvent.click(cancelButton);

    expect(mockTrackCancelAction).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('disables the submit button when no role is selected', async () => {
    const { container } = render(<AddUserPage />);

    fireEvent.change(screen.getByTestId('addUser-user_select'), {
      target: { value: 'user1' },
    });

    const nextButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_coldArchive_containers_addUser_next_label"]',
    );
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('addUser_stepTwo')).toBeInTheDocument();
    });

    const submitButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_coldArchive_containers_addUser_submit_label"]',
    );
    fireEvent.click(submitButton);

    await (() => {
      expect(submitButton).toBeDisabled();
    });

    fireEvent.click(screen.getAllByTestId('AddUser-role_radio')[0]);

    await (() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
