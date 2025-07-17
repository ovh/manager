import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { describe } from 'vitest';
import { testIds } from '@/utils/testIds.constants';
import { StepFieldData } from '@/types/formStep.type';
import { FormFieldSummary } from './FormFieldSummary.component';
import { FORM_LABELS } from '@/constants/form.constants';

describe('FormFieldSummary component unit test suite', () => {
  const testField: StepFieldData = {
    label: 'fieldLabel',
    value: 'fieldValue',
  };

  test.each([
    [
      'should render field with the label and value',
      testField,
      testField.value,
    ],
    [
      'should render field with secretText when value is secret',
      { ...testField, isSecretValue: true },
      FORM_LABELS.secretText,
    ],
    [
      'should render field with unknownText when value is undefined',
      { ...testField, value: undefined },
      FORM_LABELS.unknownText,
    ],
    [
      'should render field with unknownText when value is undefined and secret',
      { ...testField, value: undefined, isSecretValue: true },
      FORM_LABELS.unknownText,
    ],
  ])('%s', (_, input, expectedText) => {
    // when
    const { getByText, getByTestId } = render(
      <FormFieldSummary field={input} />,
    );

    // then
    expect(getByText(input.label)).toBeVisible();

    // and
    const fieldValue = getByTestId(testIds.summaryFieldValue);
    expect(fieldValue).toBeVisible();
    expect(fieldValue).toHaveTextContent(expectedText);
  });
});
