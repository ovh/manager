import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { wrapper } from '@/common/utils/test.provider';
import { TextField } from '@/zone/pages/zone/add/components/fields/TextField';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

function renderTextField(props: {
    label?: string;
    required?: boolean;
    readOnly?: boolean;
} = {}) {
    const { label = 'Test Label', required, readOnly } = props;

    function TestTextField() {
        const methods = useForm<AddEntrySchemaType>({
            defaultValues: { target: '' } as AddEntrySchemaType,
        });
        return (
            <FormProvider {...methods}>
                <TextField
                    name="target"
                    control={methods.control}
                    label={label}
                    required={required}
                    readOnly={readOnly}
                />
            </FormProvider>
        );
    }
    return render(<TestTextField />, { wrapper });
}

describe('TextField', () => {
    it('renders the label', () => {
        renderTextField();
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders the required field indicator when required is true', () => {
        renderTextField({ required: true });
        expect(screen.getByText(/form:required_field/i)).toBeInTheDocument();
    });

    it('does not render required indicator when required is false', () => {
        renderTextField({ required: false });
        expect(
            screen.queryByText(/form:required_field/i),
        ).not.toBeInTheDocument();
    });

    it('renders the text input', () => {
        renderTextField();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders as readonly when readOnly is true', () => {
        renderTextField({ readOnly: true });
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
    });
});
