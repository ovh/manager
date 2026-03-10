import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/common/utils/test.provider';
import { FormProvider, useForm } from 'react-hook-form';
import { DynamicRecordForm } from '@/zone/pages/zone/components/DynamicRecordForm';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';

function renderForm(
  recordType: string,
  defaults: Record<string, unknown> = {},
) {
  function Wrapper() {
    const methods = useForm<AddEntrySchemaType>({
      defaultValues: {
        subDomain: '',
        ttlSelect: 'global',
        ...defaults,
      } as AddEntrySchemaType,
    });
    return (
      <FormProvider {...methods}>
        <DynamicRecordForm
          recordType={recordType}
          control={methods.control}
          watch={methods.watch}
          domainSuffix="example.com"
        />
      </FormProvider>
    );
  }
  return render(<Wrapper />);
}

describe('DynamicRecordForm — RecordPreview', () => {
  it('renders the preview label', () => {
    renderForm('A');
    expect(screen.getByText('zone_page_form_record_preview_label')).toBeInTheDocument();
  });

  it('displays the placeholder when target is empty', () => {
    renderForm('A', { subDomain: 'www' });
    expect(screen.getByDisplayValue(/www\.example\.com\. IN A …/)).toBeInTheDocument();
  });

  it('builds the correct A record preview', () => {
    renderForm('A', { subDomain: 'www', target: '1.2.3.4' });
    expect(screen.getByDisplayValue(/www\.example\.com\. IN A 1\.2\.3\.4/)).toBeInTheDocument();
  });

  it('uses the zone apex when subDomain is @', () => {
    renderForm('A', { subDomain: '@', target: '1.2.3.4' });
    expect(screen.getByDisplayValue(/^example\.com\. IN A/)).toBeInTheDocument();
  });

  it('appends a trailing dot to the MX target in the preview', () => {
    renderForm('MX', { subDomain: '', target: 'mail.example.com', priority: 10 });
    expect(screen.getByDisplayValue(/mail\.example\.com\./)).toBeInTheDocument();
  });

  it('wraps the TXT record value in quotes in the preview', () => {
    renderForm('TXT', { subDomain: '', target: 'v=spf1 ~all' });
    expect(screen.getByDisplayValue(/"v=spf1 ~all"/)).toBeInTheDocument();
  });

  it('appends the ._domainkey suffix in the DKIM preview name', () => {
    renderForm('DKIM', { subDomain: 'selector1' });
    expect(screen.getByDisplayValue(/selector1\._domainkey\.example\.com\./)).toBeInTheDocument();
  });
});
