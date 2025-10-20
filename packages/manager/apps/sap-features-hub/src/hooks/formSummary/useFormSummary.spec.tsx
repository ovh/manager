import React from 'react';
import { describe, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { mockedValues } from '@/mocks/installationForm.mock';
import { useFormSummary } from '@/hooks/formSummary/useFormSummary';
import { mockedFormSummary } from '@/mocks/formSummary.mock';
import { InstallationFormContextProvider } from '@/context/InstallationForm.context';
import { InstallationFormValues } from '@/types/form.type';
import { labels } from '@/test-utils';
import { FORM_LABELS } from '@/constants/form.constants';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';

type ProviderProps = {
  children: React.ReactNode;
};

vi.mock('@/context/InstallationForm.context', () => ({
  InstallationFormContextProvider: (props: ProviderProps) => (
    <>{props.children}</>
  ),
}));

const renderTest = async (values: InstallationFormValues) => {
  const CustomWrapper = await testWrapperBuilder()
    .withI18next()
    .build();

  return renderHook(() => useFormSummary(values), {
    wrapper: ({ children }) => (
      <CustomWrapper>
        <InstallationFormContextProvider>
          {children}
        </InstallationFormContextProvider>
      </CustomWrapper>
    ),
  });
};

describe('useFormSummary hook test suite', () => {
  const { installation: l, system: lSystem } = labels;
  it('should return the full StepSummary list when everything is filled', async () => {
    // when
    const { result } = await renderTest(mockedValues);

    // then
    expect(result.current).toEqual(mockedFormSummary);
  });

  it('should remove optional fields when the parent object is undefined', async () => {
    // when
    const { result } = await renderTest({
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
          lSystem.key_access,
          lSystem.key_secret,
          l.enablement_input_logstash_entrypoint,
          l.enablement_input_logstash_certificat,
        ].includes(field.label),
    );

    expect(withRequiredFields).toBe(true);
    expect(withoutOptionalFields).toBe(true);
  });
});
