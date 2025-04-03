import React from 'react';
import { describe, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { mockedValues } from '@/mocks/installationForm.mock';
import { useFormSummary } from '@/hooks/formSummary/useFormSummary';
import { mockedFormSummary } from '@/mocks/formSummary.mock';
import { InstallationFormContextProvider } from '@/context/InstallationForm.context';
import translations from '../../../public/translations/installation/Messages_fr_FR.json';
import { InstallationFormValues } from '@/types/form.type';
import { labels } from '@/test-utils';
import { FORM_LABELS } from '@/constants/form.constants';

type TranslationKey = keyof typeof translations;
type ProviderProps = {
  children: React.ReactNode;
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key: TranslationKey) => translations[key]),
  }),
}));
vi.mock('@/context/InstallationForm.context', () => ({
  InstallationFormContextProvider: (props: ProviderProps) => (
    <>{props.children}</>
  ),
}));

const renderTest = (values: InstallationFormValues) =>
  renderHook(() => useFormSummary(values), {
    wrapper: ({ children }) => (
      <InstallationFormContextProvider>
        {children}
      </InstallationFormContextProvider>
    ),
  });

describe('useFormSummary hook test suite', () => {
  const l = labels.installation;
  it('should return the full StepSummary list when everything is filled', async () => {
    // when
    const { result } = renderTest(mockedValues);

    // then
    expect(result.current).toEqual(mockedFormSummary);
  });

  it('should remove optional fields when the parent object is undefined', async () => {
    // when
    const { result } = renderTest({
      ...mockedValues,
      bucketBackint: undefined,
      logsDataPlatform: undefined,
    });

    // then
    const stepWithOptionalFields = result.current.formSummary.find(
      (step) => step.title === l.enablement_summary,
    );

    expect(stepWithOptionalFields).toBeDefined();
    expect(stepWithOptionalFields.fields).toBeDefined();

    // and
    const withRequiredFields = stepWithOptionalFields.fields.every((field) =>
      [
        l.enablement_input_has_backup,
        l.enablement_input_has_logs_ldp_ovh,
      ].includes(field.label),
    );
    const withoutOptionalFields = stepWithOptionalFields.fields.every(
      (field) =>
        ![
          l.common_input_container,
          FORM_LABELS.endpoint,
          l.common_input_access_key,
          l.common_input_secret_key,
          l.enablement_input_logstash_entrypoint,
          l.enablement_input_logstash_certificat,
        ].includes(field.label),
    );

    expect(withRequiredFields).toBe(true);
    expect(withoutOptionalFields).toBe(true);
  });
});
