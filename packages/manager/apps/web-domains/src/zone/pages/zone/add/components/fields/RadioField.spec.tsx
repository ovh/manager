import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { wrapper } from '@/common/utils/test.provider';
import { RadioField } from '@/zone/pages/zone/add/components/fields/RadioField';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

const radioOptions = [
    { value: 'optionA', label: 'Option A' },
    { value: 'optionB', label: 'Option B' },
    { value: 'optionC', label: 'Option C' },
];

function renderRadioField(defaultTagValue: string) {
    function TestRadioField() {
        const methods = useForm<AddEntrySchemaType>({
            defaultValues: { tag: defaultTagValue } as AddEntrySchemaType,
        });
        return (
            <FormProvider {...methods}>
                <RadioField
                    name="tag"
                    control={methods.control}
                    label="Choose Option"
                    options={radioOptions}
                />
            </FormProvider>
        );
    }
    return render(<TestRadioField />, { wrapper });
}

describe('RadioField', () => {
    it('renders the field label', () => {
        renderRadioField('');
        expect(screen.getByText('Choose Option')).toBeInTheDocument();
    });

    it('renders all radio options', () => {
        renderRadioField('');
        expect(screen.getByText('Option A')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
        expect(screen.getByText('Option C')).toBeInTheDocument();
    });

    it('renders radio inputs for each option', () => {
        renderRadioField('');
        const radios = screen.getAllByRole('radio');
        expect(radios).toHaveLength(3);
    });

    it('pre-selects option matching default value', () => {
        renderRadioField('optionB');
        const radios = screen.getAllByRole('radio');
        const optionBRadio = radios[1];
        expect(optionBRadio).toBeChecked();
    });
});
