import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormCreateRequest from './Form.page';

const mockedUseForm = vi.fn(() => ({
  handleSubmit: vi.fn((fn) => fn),
  control: {},
  reset: vi.fn(),
  formState: { isValid: true },
  watch: vi.fn(() => ({})),
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
    <button {...props}>{children}</button>
  ),
  OsdsSelect: () => <div>SELECT</div>,
  OsdsSelectOption: () => <div>OPTION</div>,
  OsdsText: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('./FormDocumentFields/FormDocumentFieldList', () => ({
  FormDocumentFieldList: () => <div>FormDocumentFieldList</div>,
}));

describe('Form.page', () => {
  it('should render select LegalForms correctly when the sub is FR and legalForms is other', () => {
    render(<FormCreateRequest />);

    expect(screen.getByText('SELECT')).not.toBeNull();
  });
});
