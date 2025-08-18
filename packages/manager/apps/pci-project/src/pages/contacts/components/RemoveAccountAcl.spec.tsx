/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { useParams, useNavigate } from 'react-router-dom';
import * as mrc from '@ovh-ux/manager-react-components';
import RemoveAccountAcl from './RemoveAccountAcl';
import { createWrapper, shellContext } from '@/wrapperRenders';
import { useDeleteAccountAclFromProject } from '@/data/hooks/useAcl';

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
    }: any) => (
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
    OdsText: ({ children }: any) => (
      <div data-testid="ods-text">{children}</div>
    ),
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
  },
} as any);

describe('RemoveAccountAcl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({
      projectId: 'p-1',
      accountId: 'user-ovh',
    } as any);
  });

  it('renders confirmation text with accountId', () => {
    mockUseDelete.mockReturnValue({
      deleteAccountAclFromProject: vi.fn(),
      isPending: false,
    } as any);
    render(<RemoveAccountAcl />, { wrapper: baseWrapper });
    expect(screen.getByTestId('ods-text')).toHaveTextContent(
      'cpb_rights_delete_question',
    );
  });

  it('submits deletion with accountId', () => {
    const delSpy = vi.fn();
    mockUseDelete.mockReturnValue({
      deleteAccountAclFromProject: delSpy,
      isPending: false,
    } as any);
    render(<RemoveAccountAcl />, { wrapper: baseWrapper });

    fireEvent.click(screen.getByTestId('primary'));
    expect(delSpy).toHaveBeenCalledWith('user-ovh');
  });

  it('does not submit when pending or missing accountId', () => {
    const delSpy = vi.fn();
    mockUseDelete.mockReturnValue({
      deleteAccountAclFromProject: delSpy,
      isPending: true,
    } as any);
    const { getByTestId, unmount } = render(<RemoveAccountAcl />, {
      wrapper: baseWrapper,
    });
    fireEvent.click(getByTestId('primary'));
    expect(delSpy).not.toHaveBeenCalled();

    unmount();

    mockUseParams.mockReturnValue({ projectId: 'p-1' } as any);
    mockUseDelete.mockReturnValue({
      deleteAccountAclFromProject: delSpy,
      isPending: false,
    } as any);
    const { getByTestId: getByTestId2 } = render(<RemoveAccountAcl />, {
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
    } as any);
    mockUseDelete.mockImplementation(
      ({ onSuccess }: any) =>
        ({
          deleteAccountAclFromProject: () => onSuccess(),
          isPending: false,
        } as any),
    );
    const navigateSpy = vi.fn();
    mockUseNavigate.mockReturnValue(navigateSpy);
    render(<RemoveAccountAcl />, { wrapper: baseWrapper });

    fireEvent.click(screen.getByTestId('primary'));
    expect(addSuccessSpy).toHaveBeenCalledWith(
      'cpb_rights_table_rights_remove_success',
    );
    expect(navigateSpy).toHaveBeenCalledWith('..');
  });

  it('navigates back and shows error on error callback', () => {
    const addErrorSpy = vi.fn();
    vi.spyOn(mrc, 'useNotifications').mockReturnValue({
      addSuccess: vi.fn(),
      addError: addErrorSpy,
      addInfo: vi.fn(),
    } as any);
    mockUseDelete.mockImplementation(
      ({ onError }: any) =>
        ({
          deleteAccountAclFromProject: () => onError(),
          isPending: false,
        } as any),
    );
    const navigateSpy = vi.fn();
    mockUseNavigate.mockReturnValue(navigateSpy);
    render(<RemoveAccountAcl />, { wrapper: baseWrapper });

    fireEvent.click(screen.getByTestId('primary'));
    expect(addErrorSpy).toHaveBeenCalledWith('cpb_rights_remove_error');
    expect(navigateSpy).toHaveBeenCalledWith('..');
  });
});
