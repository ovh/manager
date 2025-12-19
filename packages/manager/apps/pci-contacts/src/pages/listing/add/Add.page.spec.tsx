import React, { PropsWithChildren } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@ovh-ux/manager-core-api';
import * as mrc from '@ovh-ux/manager-react-components';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { useAddAccountAclToProject } from '@/data/hooks/useAcl';
import { createWrapper, shellContext } from '@/wrapperRenders';

import AddPage from './Add.page';

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
    OdsFormField: ({ children, ...props }: PropsWithChildren) => (
      <div data-testid="ods-form-field" {...props}>
        {children}
      </div>
    ),
    OdsInput: ({
      value,
      onOdsChange,
      ...props
    }: PropsWithChildren<{
      value: string;
      onOdsChange: (value: unknown) => unknown;
    }>) => (
      <input
        data-testid="ods-input"
        value={value}
        onChange={(e) => onOdsChange({ detail: { value: e.target.value } })}
        {...props}
      />
    ),
    OdsSelect: ({
      value,
      onOdsChange,
      children,
      ...props
    }: PropsWithChildren<{
      value: string;
      onOdsChange: (value: unknown) => unknown;
    }>) => (
      <select
        data-testid="ods-select"
        value={value}
        onChange={(e) => onOdsChange({ detail: { value: e.target.value } })}
        {...props}
      >
        {children}
      </select>
    ),
  };
});

vi.mock('@/data/hooks/useAcl', () => ({
  useAddAccountAclToProject: vi.fn(),
}));

vi.mock('@/hooks/useParam', () => ({
  useParam: vi.fn().mockReturnValue('p-1'),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof import('react-router-dom') = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

const mockUseAdd = vi.mocked(useAddAccountAclToProject);
const mockUseParams = vi.mocked(useParams);
const mockUseNavigate = vi.mocked(useNavigate);

const baseContextFR = {
  ...shellContext,
  environment: {
    ...shellContext.environment,
    getUser: () => ({ ovhSubsidiary: 'FR', country: 'FR', nichandle: 'me' }),
  },
} as ShellContextType;

describe('AddPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ projectId: 'p-1' });
  });

  it('trims and normalize the NIC submitted to API call', () => {
    const addSpy = vi.fn();
    mockUseAdd.mockReturnValue({
      addAccountAclToProject: addSpy,
      isPending: false,
    } as unknown as ReturnType<typeof useAddAccountAclToProject>);
    const navigateSpy = vi.fn();
    mockUseNavigate.mockReturnValue(navigateSpy);
    const wrapper = createWrapper(baseContextFR);
    render(<AddPage />, { wrapper });

    fireEvent.change(screen.getByTestId('ods-input'), {
      target: { value: '  fake-12345 ' },
    });
    fireEvent.click(screen.getByTestId('primary'));

    expect(addSpy).toHaveBeenCalledWith({
      accountId: 'fake-12345-ovh',
      type: 'readOnly',
    });
  });

  it('does not submit when pending', () => {
    const addSpy = vi.fn();
    mockUseAdd.mockReturnValue({
      addAccountAclToProject: addSpy,
      isPending: true,
    } as unknown as ReturnType<typeof useAddAccountAclToProject>);
    const wrapper = createWrapper(baseContextFR);
    render(<AddPage />, { wrapper });

    fireEvent.change(screen.getByTestId('ods-input'), {
      target: { value: 'user' },
    });
    fireEvent.click(screen.getByTestId('primary'));

    expect(addSpy).not.toHaveBeenCalled();
  });

  it('navigates back and shows success on success callback', () => {
    const addSuccessSpy = vi.fn();
    vi.spyOn(mrc, 'useNotifications').mockReturnValue({
      addSuccess: addSuccessSpy,
      addError: vi.fn(),
      addInfo: vi.fn(),
    });
    mockUseAdd.mockImplementation(
      ({ onSuccess }) =>
        ({
          addAccountAclToProject: () => onSuccess({ accountId: 'fake-account', type: 'readOnly' }),
          isPending: false,
        }) as unknown as ReturnType<typeof useAddAccountAclToProject>,
    );
    const navigateSpy = vi.fn();
    mockUseNavigate.mockReturnValue(navigateSpy);
    const wrapper = createWrapper(baseContextFR);
    render(<AddPage />, { wrapper });

    fireEvent.change(screen.getByTestId('ods-input'), {
      target: { value: 'user' },
    });
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
    } as unknown);
    const mockError = null as unknown as ApiError;
    mockUseAdd.mockImplementation(
      ({ onError }) =>
        ({
          addAccountAclToProject: () =>
            onError(mockError, { accountId: 'fake-account', type: 'readOnly' }),
          isPending: false,
        }) as unknown as ReturnType<typeof useAddAccountAclToProject>,
    );
    const navigateSpy = vi.fn();
    mockUseNavigate.mockReturnValue(navigateSpy);
    const wrapper = createWrapper(baseContextFR);
    render(<AddPage />, { wrapper });

    fireEvent.change(screen.getByTestId('ods-input'), {
      target: { value: 'user' },
    });
    fireEvent.click(screen.getByTestId('primary'));

    expect(addErrorSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('..');
  });
});
