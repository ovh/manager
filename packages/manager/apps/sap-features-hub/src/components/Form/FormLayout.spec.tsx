import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { testIds } from '@/utils/testIds.constants';
import FormLayout, { FormLayoutProps } from './FormLayout.component';

const previousSpy = vi.fn();
const submitSpy = vi.fn();
const childrenLabel = 'testChildren';

const layoutProps: FormLayoutProps = {
  title: 'testTitle',
  submitLabel: 'testSubmitLabel',
  children: <>{childrenLabel}</>,
  onSubmit: submitSpy,
  onPrevious: previousSpy,
};

describe('FormLayout component unit test suite', () => {
  it('should render field with title, CTAs and children', () => {
    // when
    const { getByText, getByTestId } = render(<FormLayout {...layoutProps} />);

    // then
    const title = getByText(layoutProps.title);
    expect(title).toBeVisible();
    expect(title).toHaveAttribute('preset', 'heading-2');

    // and
    const submitCTA = getByTestId(testIds.formSubmitCta);
    expect(submitCTA).toBeVisible();
    expect(submitCTA).toHaveAttribute('variant', 'default');
    expect(submitCTA).toHaveAttribute('label', layoutProps.submitLabel);

    // and
    const previousCTA = getByTestId(testIds.formPreviousCta);
    expect(previousCTA).toBeVisible();
    expect(previousCTA).toHaveAttribute('variant', 'outline');
    expect(previousCTA).toHaveAttribute('label', 'previous_step_cta');

    // and
    expect(getByText(childrenLabel)).toBeVisible();
  });
});
