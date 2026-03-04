import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { wrapper } from '@/common/utils/test.provider';
import { NumberField } from '@/zone/pages/zone/add/components/fields/NumberField';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

describe('NumberField', () => {
    it('renders the label', () => {
        function TestComponent() {
            const methods = useForm<AddEntrySchemaType>({
                defaultValues: { priority: 10 } as AddEntrySchemaType,
            });
            return (
                <FormProvider {...methods}>
                    <NumberField
                        name="priority"
                        control={methods.control}
                        label="Priority"
                    />
                </FormProvider>
            );
        }
        render(<TestComponent />, { wrapper });
        expect(screen.getByText('Priority')).toBeInTheDocument();
    });

    it('renders the required field indicator when required is true', () => {
        function TestComponent() {
            const methods = useForm<AddEntrySchemaType>({
                defaultValues: { priority: 0 } as AddEntrySchemaType,
            });
            return (
                <FormProvider {...methods}>
                    <NumberField
                        name="priority"
                        control={methods.control}
                        label="Priority"
                        required={true}
                    />
                </FormProvider>
            );
        }
        render(<TestComponent />, { wrapper });
        expect(screen.getByText(/form:required_field/i)).toBeInTheDocument();
    });

    it('renders a number input', () => {
        function TestComponent() {
            const methods = useForm<AddEntrySchemaType>({
                defaultValues: { priority: 5 } as AddEntrySchemaType,
            });
            return (
                <FormProvider {...methods}>
                    <NumberField
                        name="priority"
                        control={methods.control}
                        label="Priority"
                    />
                </FormProvider>
            );
        }
        render(<TestComponent />, { wrapper });
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('renders suffix when suffix prop is provided', () => {
        function TestComponent() {
            const methods = useForm<AddEntrySchemaType>({
                defaultValues: { priority: 0 } as AddEntrySchemaType,
            });
            return (
                <FormProvider {...methods}>
                    <NumberField
                        name="priority"
                        control={methods.control}
                        label="Priority"
                        suffix="s"
                    />
                </FormProvider>
            );
        }
        render(<TestComponent />, { wrapper });
        expect(screen.getByText('s')).toBeInTheDocument();
    });
});
