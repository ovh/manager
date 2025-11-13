import React, { PropsWithChildren } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Environment } from '@ovh-ux/manager-config';
import { ApiError } from '@ovh-ux/manager-core-api';
import * as mrc from '@ovh-ux/manager-react-components';

import { useDeleteAccountAclFromProject } from '@/data/hooks/useAcl';
import { createWrapper, shellContext } from '@/wrapperRenders';

import RemovePage from './Remove.page';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...actual,
    Modal: ({
      children,
      onPrimaryButtonClick,
      onSecondaryButtonClick,
      primaryLabel,
      secondaryLabel,
    }: mrc.ModalProps) => (
      <div data-testid="modal">
        <div>{children}</div>
        <button data-testid="primary" onClick={onPrimaryButtonClick}>
          {primaryLabel}
        </button>
        <button data-testid="secondary" onClick={onSecondaryButtonClick}>
          {secondaryLabel}
        </button>
      </div>
    ),
  };
});

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual: typeof import('@ovhcloud/ods-components/react') = await importOriginal();
  return {
    ...actual,
    OdsText: ({ children }: PropsWithChildren) => <div data-testid="ods-text">{children}</div>,
  };
});

vi.mock('@/data/hooks/useAcl', () => ({
  useDeleteAccountAclFromProject: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof import('react-router-dom') = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

vi.mock('@/hooks/useParam', () => ({
  useParam: vi.fn().mockReturnValue('p-1'),
}));

const mockUseDelete = vi.mocked(useDeleteAccountAclFromProject);
const mockUseParams = vi.mocked(useParams);
const mockUseNavigate = vi.mocked(useNavigate);

const baseWrapper = createWrapper({
  ...shellContext,
  environment: {
    ...shellContext.environment,
    getUser: () => ({ ovhSubsidiary: 'FR', country: 'FR', nichandle: 'me' }),
  } as Environment,
});

describe('RemovePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({
      projectId: 'p-1',
      accountId: 'user-ovh',
    });
  });

  it('renders confirmation text with accountId', () => {
    mockUseDelete.mockReturnValue({
      deleteAccountAclFromProject: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteAccountAclFromProject>);
    render(<RemovePage />, { wrapper: baseWrapper });
    expect(screen.getByTestId('ods-text')).toHaveTextContent('cpb_rights_delete_question');
  });

  it('submits deletion with accountId', () => {
    const delSpy = vi.fn();
    mockUseDelete.mockReturnValue({
      deleteAccountAclFromProject: delSpy,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteAccountAclFromProject>);
    render(<RemovePage />, { wrapper: baseWrapper });

    fireEvent.click(screen.getByTestId('primary'));
    expect(delSpy).toHaveBeenCalledWith('user-ovh');
  });

  it('does not submit when pending or missing accountId', () => {
    const delSpy = vi.fn();
    mockUseDelete.mockReturnValue({
      deleteAccountAclFromProject: delSpy,
      isPending: true,
    } as unknown as ReturnType<typeof useDeleteAccountAclFromProject>);
    const { getByTestId, unmount } = render(<RemovePage />, {
      wrapper: baseWrapper,
    });
    fireEvent.click(getByTestId('primary'));
    expect(delSpy).not.toHaveBeenCalled();

    unmount();

    mockUseParams.mockReturnValue({ projectId: 'p-1' });
    mockUseDelete.mockReturnValue({
      deleteAccountAclFromProject: delSpy,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteAccountAclFromProject>);
    const { getByTestId: getByTestId2 } = render(<RemovePage />, {
      wrapper: baseWrapper,
    });
    fireEvent.click(getByTestId2('primary'));
    expect(delSpy).not.toHaveBeenCalled();
  });

  it('navigates back and shows success on success callback', () => {
    const addSuccessSpy = vi.fn();
    vi.spyOn(mrc, 'useNotifications').mockReturnValue({
      addSuccess: addSuccessSpy,
      addError: vi.fn(),
      addInfo: vi.fn(),
    } as ReturnType<typeof mrc.useNotifications>);
    mockUseDelete.mockImplementation(
      ({ onSuccess }) =>
        ({
          deleteAccountAclFromProject: () => onSuccess('fake-account'),
          isPending: false,
        }) as unknown as ReturnType<typeof useDeleteAccountAclFromProject>,
    );
    const navigateSpy = vi.fn();
    mockUseNavigate.mockReturnValue(navigateSpy);
    render(<RemovePage />, { wrapper: baseWrapper });

    fireEvent.click(screen.getByTestId('primary'));
    expect(addSuccessSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('..');
  });

  it('navigates back and shows error on error callback', () => {
    const addErrorSpy = vi.fn();
    vi.spyOn(mrc, 'useNotifications').mockReturnValue({
      addSuccess: vi.fn(),
      addError: addErrorSpy,
      addInfo: vi.fn(),
    });
    const mockError = null as unknown as ApiError;
    mockUseDelete.mockImplementation(
      ({ onError }) =>
        ({
          deleteAccountAclFromProject: () => onError(mockError, 'fake-account'),
          isPending: false,
        }) as unknown as ReturnType<typeof useDeleteAccountAclFromProject>,
    );
    const navigateSpy = vi.fn();
    mockUseNavigate.mockReturnValue(navigateSpy);
    render(<RemovePage />, { wrapper: baseWrapper });

    fireEvent.click(screen.getByTestId('primary'));
    expect(addErrorSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('..');
  });
});
