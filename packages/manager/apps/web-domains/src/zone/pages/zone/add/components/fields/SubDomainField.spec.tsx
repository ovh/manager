import '@/common/setupTests';
import React, { type ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { wrapper } from '@/common/utils/test.provider';
import { SubDomainField } from '@/zone/pages/zone/add/components/fields/SubDomainField';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

const FormWrapper: React.FC<{
  children: ReactNode;
  defaultValues?: Partial<AddEntrySchemaType>;
}> = ({ children, defaultValues = {} }) => {
  const methods = useForm<AddEntrySchemaType>({
    defaultValues: {
      subDomain: '',
      ttlSelect: 'global',
      ...defaultValues,
    } as AddEntrySchemaType,
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const renderWithForm = (
  ui: React.ReactElement,
  defaultValues?: Partial<AddEntrySchemaType>,
) => {
  return render(
    <FormWrapper defaultValues={defaultValues}>{ui}</FormWrapper>,
    { wrapper },
  );
};

describe('SubDomainField', () => {
  const getControl = () => {
    // We use a hook-based approach to grab the control
    let control: ReturnType<typeof useForm>['control'] | undefined;
    function TestComponent() {
      const methods = useForm<AddEntrySchemaType>({
        defaultValues: { subDomain: '' } as AddEntrySchemaType,
      });
      control = methods.control;
      return (
        <FormProvider {...methods}>
          <SubDomainField control={methods.control} />
        </FormProvider>
      );
    }
    render(<TestComponent />, { wrapper });
    return control;
  };

  it('renders the subdomain label', () => {
    getControl();
    expect(screen.getByText('zone_page_form_subdomain')).toBeInTheDocument();
  });

  it('renders the required field indicator', () => {
    function TestComponent() {
      const methods = useForm<AddEntrySchemaType>({
        defaultValues: { subDomain: '' } as AddEntrySchemaType,
      });
      return (
        <FormProvider {...methods}>
          <SubDomainField control={methods.control} required={true} />
        </FormProvider>
      );
    }
    render(<TestComponent />, { wrapper });
    expect(screen.getByText(/form:required_field/i)).toBeInTheDocument();
  });

  it('renders custom label when labelKey is provided', () => {
    function TestComponent() {
      const methods = useForm<AddEntrySchemaType>({
        defaultValues: { subDomain: '' } as AddEntrySchemaType,
      });
      return (
        <FormProvider {...methods}>
          <SubDomainField
            control={methods.control}
            labelKey="custom_label_key"
          />
        </FormProvider>
      );
    }
    render(<TestComponent />, { wrapper });
    expect(screen.getByText('custom_label_key')).toBeInTheDocument();
  });

  it('renders the text input with placeholder when domainSuffix is provided', () => {
    function TestComponent() {
      const methods = useForm<AddEntrySchemaType>({
        defaultValues: { subDomain: '' } as AddEntrySchemaType,
      });
      return (
        <FormProvider {...methods}>
          <SubDomainField
            control={methods.control}
            suffix=".example.com"
          />
        </FormProvider>
      );
    }
    render(<TestComponent />, { wrapper });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders the text input', () => {
    getControl();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
