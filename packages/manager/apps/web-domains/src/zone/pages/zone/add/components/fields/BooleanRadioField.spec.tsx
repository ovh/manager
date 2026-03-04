import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { wrapper } from '@/common/utils/test.provider';
import { BooleanRadioField } from '@/zone/pages/zone/add/components/fields/BooleanRadioField';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

function renderBooleanField(defaultValue: boolean, label = 'Enable Feature') {
    function TestBooleanField() {
        const methods = useForm<AddEntrySchemaType>({
            defaultValues: { dkimV: defaultValue } as AddEntrySchemaType,
        });
        return (
            <FormProvider {...methods}>
                <BooleanRadioField
                    name="dkimV"
                    control={methods.control}
                    label={label}
                />
            </FormProvider>
        );
    }
    return render(<TestBooleanField />, { wrapper });
}

describe('BooleanRadioField', () => {
    it('renders the field label', () => {
        renderBooleanField(false);
        expect(screen.getByText('Enable Feature')).toBeInTheDocument();
    });

    it('renders yes and no radio options', () => {
        renderBooleanField(false);
        expect(screen.getAllByText('@ovh-ux/manager-common-translations/form:yes').length).toBeGreaterThan(0);
        expect(screen.getAllByText('@ovh-ux/manager-common-translations/form:no').length).toBeGreaterThan(0);
    });

    it('renders two radio inputs', () => {
        renderBooleanField(true);
        const radios = screen.getAllByRole('radio');
        expect(radios).toHaveLength(2);
    });

    it('pre-selects "true" radio when default value is true', () => {
        renderBooleanField(true);
        const radios = screen.getAllByRole('radio');
        expect(radios[0]).toBeChecked();
        expect(radios[1]).not.toBeChecked();
    });

    it('pre-selects "false" radio when default value is false', () => {
        renderBooleanField(false);
        const radios = screen.getAllByRole('radio');
        expect(radios[0]).not.toBeChecked();
        expect(radios[1]).toBeChecked();
    });
});
