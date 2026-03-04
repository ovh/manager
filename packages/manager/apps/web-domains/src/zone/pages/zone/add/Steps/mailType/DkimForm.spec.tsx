import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { wrapper } from '@/common/utils/test.provider';
import { DkimFormContent } from '@/zone/pages/zone/add/Steps/mailType/DkimForm.component';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

function renderDkimForm(defaultValues: Partial<AddEntrySchemaType> = {}) {
    function TestDkimForm() {
        const methods = useForm<AddEntrySchemaType>({
            defaultValues: {
                dkimV: false,
                dkimG: '',
                dkimHsha1: false,
                dkimHsha256: false,
                dkimKrsa: false,
                dkimN: '',
                dkimPublicKey: '',
                dkimPRevoke: false,
                dkimS: '',
                ...defaultValues,
            } as AddEntrySchemaType,
        });
        return (
            <FormProvider {...methods}>
                <DkimFormContent />
            </FormProvider>
        );
    }
    return render(<TestDkimForm />, { wrapper });
}

describe('DkimFormContent', () => {
    it('renders the dkim form container', () => {
        renderDkimForm();
        expect(screen.getByTestId('dkim-form')).toBeInTheDocument();
    });

    it('renders the version checkbox', () => {
        renderDkimForm();
        expect(
            screen.getByText(
                'zone_page_add_entry_modal_step_2_dkim_label_version',
            ),
        ).toBeInTheDocument();
    });

    it('renders the granularity field label', () => {
        renderDkimForm();
        expect(
            screen.getByText(
                'zone_page_add_entry_modal_step_2_dkim_label_granularity',
            ),
        ).toBeInTheDocument();
    });

    it('renders the hash algorithm field', () => {
        renderDkimForm();
        expect(
            screen.getByText(
                'zone_page_add_entry_modal_step_2_dkim_label_algorithm_hash',
            ),
        ).toBeInTheDocument();
    });

    it('renders SHA-1 hash checkbox', () => {
        renderDkimForm();
        expect(
            screen.getByText(
                'zone_page_add_entry_modal_step_2_dkim_hash_1',
            ),
        ).toBeInTheDocument();
    });

    it('renders SHA-256 hash checkbox', () => {
        renderDkimForm();
        expect(
            screen.getByText(
                'zone_page_add_entry_modal_step_2_dkim_hash_256',
            ),
        ).toBeInTheDocument();
    });

    it('renders the notes/public key fields', () => {
        renderDkimForm();
        expect(
            screen.getByText(
                'zone_page_add_entry_modal_step_2_dkim_label_notes',
            ),
        ).toBeInTheDocument();
        expect(
            screen.getAllByText(
                /zone_page_add_entry_modal_step_2_dkim_label_publickey/,
            ).length,
        ).toBeGreaterThan(0);
    });

    it('renders the revoke public key checkbox', () => {
        renderDkimForm();
        expect(
            screen.getByText(
                'zone_page_add_entry_modal_step_2_dkim_label_publickey_revoke',
            ),
        ).toBeInTheDocument();
    });

    it('renders the service types label', () => {
        renderDkimForm();
        expect(
            screen.getByText(
                'zone_page_add_entry_modal_step_2_dkim_label_servicetypes',
            ),
        ).toBeInTheDocument();
    });

    it('public key textarea is disabled when dkimPRevoke is true', () => {
        renderDkimForm({ dkimPRevoke: true });
        const textareas = screen.getAllByRole('textbox');
        const disabledTextareas = textareas.filter(
            (el) => (el as HTMLTextAreaElement).disabled,
        );
        expect(disabledTextareas.length).toBeGreaterThan(0);
    });
});
