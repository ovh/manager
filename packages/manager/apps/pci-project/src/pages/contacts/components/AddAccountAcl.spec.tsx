/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import * as mrc from '@ovh-ux/manager-react-components';
import AddAccountAcl from './AddAccountAcl';
import { createWrapper, shellContext } from '@/wrapperRenders';
import { useAddAccountAclToProject } from '@/data/hooks/useAcl';

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
    OdsFormField: ({ children, ...props }: any) => (
      <div data-testid="ods-form-field" {...props}>
        {children}
      </div>
    ),
    OdsInput: ({ value, onOdsChange, ...props }: any) => (
      <input
        data-testid="ods-input"
        value={value}
        onChange={(e) => onOdsChange({ detail: { value: e.target.value } })}
        {...props}
      />
    ),
    OdsSelect: ({ value, onOdsChange, children, ...props }: any) => (
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
} as any;

const baseContextUS = {
  ...shellContext,
  environment: {
    ...shellContext.environment,
    getUser: () => ({ ovhSubsidiary: 'US', country: 'US', nichandle: 'me' }),
  },
} as any;

describe('AddAccountAcl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ projectId: 'p-1' } as any);
  });

  it('trims and normalize the NIC submitted to API call', () => {
    const addSpy = vi.fn();
    mockUseAdd.mockReturnValue({
      addAccountAclToProject: addSpy,
      isPending: false,
    } as any);
    const navigateSpy = vi.fn();
    mockUseNavigate.mockReturnValue(navigateSpy);
    const wrapper = createWrapper(baseContextFR);
    render(<AddAccountAcl />, { wrapper });

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
    } as any);
    const wrapper = createWrapper(baseContextFR);
    render(<AddAccountAcl />, { wrapper });

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
    } as any);
    mockUseAdd.mockImplementation(
      ({ onSuccess }: any) =>
        ({
          addAccountAclToProject: () => onSuccess(),
          isPending: false,
        } as any),
    );
    const navigateSpy = vi.fn();
    mockUseNavigate.mockReturnValue(navigateSpy);
    const wrapper = createWrapper(baseContextFR);
    render(<AddAccountAcl />, { wrapper });

    fireEvent.change(screen.getByTestId('ods-input'), {
      target: { value: 'user' },
    });
    fireEvent.click(screen.getByTestId('primary'));

    expect(addSuccessSpy).toHaveBeenCalledWith(
      'cpb_rights_table_rights_add_success',
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
    mockUseAdd.mockImplementation(
      ({ onError }: any) =>
        ({
          addAccountAclToProject: () => onError(),
          isPending: false,
        } as any),
    );
    const navigateSpy = vi.fn();
    mockUseNavigate.mockReturnValue(navigateSpy);
    const wrapper = createWrapper(baseContextFR);
    render(<AddAccountAcl />, { wrapper });

    fireEvent.change(screen.getByTestId('ods-input'), {
      target: { value: 'user' },
    });
    fireEvent.click(screen.getByTestId('primary'));

    expect(addErrorSpy).toHaveBeenCalledWith('cpb_rights_add_error');
    expect(navigateSpy).toHaveBeenCalledWith('..');
  });
});
