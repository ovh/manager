import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { wrapper } from '@/common/utils/test.provider';
import { TtlField } from '@/zone/pages/zone/add/components/fields/TtlField';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

function renderTtlField(ttlSelect: 'global' | 'custom', ttl?: number) {
    function TestTtlField() {
        const methods = useForm<AddEntrySchemaType>({
            defaultValues: { ttlSelect, ttl } as AddEntrySchemaType,
        });
        return (
            <FormProvider {...methods}>
                <TtlField control={methods.control} watch={methods.watch} />
            </FormProvider>
        );
    }
    return render(<TestTtlField />, { wrapper });
}

describe('TtlField', () => {
    it('renders the TTL label', () => {
        renderTtlField('global');
        expect(screen.getByText('zone_page_form_ttl')).toBeInTheDocument();
    });

    it('renders global and custom ttl options', () => {
        renderTtlField('global');
        expect(screen.getAllByText('zone_page_form_ttl_global').length).toBeGreaterThan(0);
        expect(screen.getAllByText('zone_page_form_ttl_custom').length).toBeGreaterThan(0);
    });

    it('does not show custom TTL input when ttlSelect is global', () => {
        renderTtlField('global');
        const inputs = screen.queryAllByRole('spinbutton');
        expect(inputs).toHaveLength(0);
    });

    it('shows custom TTL number input when ttlSelect is custom', () => {
        renderTtlField('custom', 3600);
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('renders tooltip icon when tooltip prop is provided', () => {
        function TestWithTooltip() {
            const methods = useForm<AddEntrySchemaType>({
                defaultValues: { ttlSelect: 'global' } as AddEntrySchemaType,
            });
            return (
                <FormProvider {...methods}>
                    <TtlField
                        control={methods.control}
                        watch={methods.watch}
                        tooltip="TTL tooltip text"
                    />
                </FormProvider>
            );
        }
        render(<TestWithTooltip />, { wrapper });
        expect(screen.getByText('zone_page_form_ttl')).toBeInTheDocument();
    });
});
