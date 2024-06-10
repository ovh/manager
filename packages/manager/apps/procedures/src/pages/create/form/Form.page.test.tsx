import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FormCreateRequest from './Form.page';

const mockedUseForm = vi.fn(() => ({
  handleSubmit: vi.fn((fn) => fn),
  control: {},
  reset: vi.fn(),
  formState: { isValid: true },
  watch: vi.fn(() => ({})),
}));

const useUploadDocuments = {
  mutate: vi.fn(),
  isPending: false,
  isError: false,
  reset: vi.fn(),
};

let onSuccessCallback: () => void;
vi.mock('@/data/hooks/useDocments', () => ({
  useUploadDocuments: vi.fn((config) => {
    onSuccessCallback = config.onSuccess;
    return useUploadDocuments;
  }),
}));
const mockedUseTranslation = vi.fn(() => ({
  t: (key: string) => key,
  tdoc: (key: string) => key,
}));

vi.mock('react-hook-form', () => ({
  useForm: () => mockedUseForm(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => mockedUseTranslation(),
}));

vi.mock('@/context/User/useUser', () => ({
  default: () => ({
    user: {
      legalForm: 'other',
      subsidiary: 'FR',
    },
  }),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OsdsButton: ({ children, ...props }: any) => (
    <button {...props} disabled={false}>
      {children}
    </button>
  ),
  OsdsSelect: ({ onOdsValueChange, value = '' }: any) => (
    <select
      data-testid="SELECT"
      onChange={onOdsValueChange}
      value={value && ''}
    >
      <option>administration</option>
      <option>other</option>
    </select>
  ),
  OsdsSelectOption: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  OsdsText: ({ children }: any) => <span>{children}</span>,
  OsdsMessage: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

vi.mock('@ovhcloud/ods-common-theming', () => ({
  ODS_THEME_TYPOGRAPHY_LEVEL: 'ODS_THEME_TYPOGRAPHY_LEVEL',
  ODS_THEME_COLOR_INTENT: 'ODS_THEME_COLOR_INTENT',
  ODS_TEXT_SIZE: {
    _500: '500',
  },
  ODS_BUTTON_TYPE: {
    submit: 'submit',
  },
}));

vi.mock('./FormDocumentFields/FormDocumentFieldList', () => ({
  FormDocumentFieldList: () => (
    <div data-testid="FormDocumentFieldList">FormDocumentFieldList</div>
  ),
}));

vi.mock('./Modal/ConfirmModal', () => ({
  ConfirmModal: ({ onValidate }: any) => (
    <div data-testid="ConfirmModal">
      ConfirmModal
      <button onClick={onValidate}>Validate</button>
    </div>
  ),
}));

vi.mock('./Modal/SuccessModal', () => ({
  SuccessModal: () => <div data-testid="SuccessModal">SuccessModal</div>,
}));

describe('Form.page', () => {
  it('should render select LegalForms correctly when the sub is FR and legalForms is other', () => {
    render(<FormCreateRequest />);

    expect(screen.getByTestId('SELECT')).not.toBeNull();
  });

  it('should render FormDocumentFieldList when legalForm is selected', () => {
    render(<FormCreateRequest />);

    const selectInput = screen.getByTestId('SELECT');
    fireEvent.change(selectInput, {
      target: { value: 'administration' },
    });

    expect(screen.getByTestId('FormDocumentFieldList')).not.toBeNull();
  });

  it('should show ConfirmModal on form submit', () => {
    const { getByText, getByTestId, debug } = render(<FormCreateRequest />);

    const selectInput = getByTestId('SELECT');
    fireEvent.change(selectInput, {
      target: { value: 'administration' },
    });

    const submitBtn = getByText('account-disable-2fa-create-form-submit');
    fireEvent.click(submitBtn);

    expect(getByTestId('ConfirmModal')).not.toBeNull();
  });

  it('should show SuccessModal on successful document upload', () => {
    const { getByTestId } = render(<FormCreateRequest />);

    onSuccessCallback();
    const selectInput = getByTestId('SELECT');
    fireEvent.change(selectInput, {
      target: { value: 'administration' },
    });

    expect(getByTestId('SuccessModal')).not.toBeNull();
  });
});
