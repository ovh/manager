import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { wrapper } from '@/common/utils/test.provider';
import { TextareaField } from '@/zone/pages/zone/add/components/fields/TextareaField';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

function renderTextareaField(props: {
    label?: string;
    required?: boolean;
    placeholder?: string;
} = {}) {
    const { label = 'Record Value', required, placeholder } = props;

    function TestTextareaField() {
        const methods = useForm<AddEntrySchemaType>({
            defaultValues: { txt: '' } as AddEntrySchemaType,
        });
        return (
            <FormProvider {...methods}>
                <TextareaField
                    name="txt"
                    control={methods.control}
                    label={label}
                    required={required}
                    placeholder={placeholder}
                />
            </FormProvider>
        );
    }
    return render(<TestTextareaField />, { wrapper });
}

describe('TextareaField', () => {
    it('renders the label', () => {
        renderTextareaField();
        expect(screen.getByText('Record Value')).toBeInTheDocument();
    });

    it('renders the required field indicator when required is true', () => {
        renderTextareaField({ required: true });
        expect(screen.getByText(/form:required_field/i)).toBeInTheDocument();
    });

    it('renders the textarea element', () => {
        renderTextareaField();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders the placeholder text when provided', () => {
        renderTextareaField({ placeholder: 'Enter record value...' });
        expect(
            screen.getByPlaceholderText('Enter record value...'),
        ).toBeInTheDocument();
    });
});
