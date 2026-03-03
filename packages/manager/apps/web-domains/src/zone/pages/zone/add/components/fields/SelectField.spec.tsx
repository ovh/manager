import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { wrapper } from '@/common/utils/test.provider';
import { SelectField } from '@/zone/pages/zone/add/components/fields/SelectField';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

const selectItems = [
    { label: 'Option A', value: 'A' },
    { label: 'Option B', value: 'B', description: 'Description B' },
    { label: 'Option C', value: 'C' },
];

function renderSelectField(
    props: { label?: string; required?: boolean; items?: typeof selectItems } = {},
) {
    const { label = 'Record Tag', required, items = selectItems } = props;

    function TestSelectField() {
        const methods = useForm<AddEntrySchemaType>({
            defaultValues: { tag: '' } as AddEntrySchemaType,
        });
        return (
            <FormProvider {...methods}>
                <SelectField
                    name="tag"
                    control={methods.control}
                    label={label}
                    items={items}
                    required={required}
                />
            </FormProvider>
        );
    }
    return render(<TestSelectField />, { wrapper });
}

describe('SelectField', () => {
    it('renders the label', () => {
        renderSelectField();
        expect(screen.getByText('Record Tag')).toBeInTheDocument();
    });

    it('renders the required field indicator when required is true', () => {
        renderSelectField({ required: true });
        expect(screen.getByText(/form:required_field/i)).toBeInTheDocument();
    });

    it('does not render required indicator when required is false', () => {
        renderSelectField({ required: false });
        expect(
            screen.queryByText(/form:required_field/i),
        ).not.toBeInTheDocument();
    });

    it('renders a combobox/listbox for selection', () => {
        renderSelectField();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders items in the select', () => {
        renderSelectField();
        expect(screen.getAllByText('Option A').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Option B').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Option C').length).toBeGreaterThan(0);
    });
});
