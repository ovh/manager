import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { testIds } from '@/utils/testIds.constants';
import { FormStepSummary } from './FormStepSummary.component';
import { StepSummary } from '@/types/formStep.type';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/somewhere' }),
  useNavigate: () => ({ navigate: vi.fn() }),
  useParams: () => ({ stepId: '1' }),
}));

describe('FormStepSummary component unit test suite', () => {
  it('should render field with title, updateCTA and stepLabels', () => {
    const testStep: StepSummary = {
      title: 'stepTitle',
      id: '1',
      fields: [
        { type: 'subtitle', label: 'stepSubtitle' },
        { type: 'data', label: 'stepLambda', value: 'stepLambdaValue' },
      ],
    };

    // when
    const { getByText, getByTestId } = render(
      <FormStepSummary step={testStep} />,
    );

    // then
    const stepTitle = getByText(testStep.title);
    expect(stepTitle).toBeVisible();
    expect(stepTitle).toHaveAttribute('preset', 'heading-3');

    // and
    const updateCta = getByTestId(testIds.summaryUpdateCta);
    expect(updateCta).toBeVisible();
    expect(updateCta).toHaveAttribute('variant', 'ghost');

    // and
    testStep.fields.forEach((field) => {
      const label = getByText(field.label);
      expect(label).toBeVisible();
      if (field.type === 'subtitle') {
        expect(label).toHaveAttribute('preset', 'heading-4');
      } else {
        expect(label).not.toHaveAttribute('preset', 'heading-4');
      }
    });
  });
});
