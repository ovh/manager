import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { testIds } from '@/utils/testIds.constants';
import FormLayout, { FormLayoutProps } from './FormLayout.component';
import { labels } from '@/test-utils';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';

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

const renderComponent = async () => {
  const wrapper = await testWrapperBuilder()
    .withI18next()
    .build();
  return render(<FormLayout {...layoutProps} />, { wrapper });
};

describe('FormLayout component unit test suite', () => {
  it('should render field with title, CTAs and children', async () => {
    // when
    await renderComponent();

    // then
    const title = screen.getByText(layoutProps.title);
    expect(title).toBeVisible();
    expect(title).toHaveAttribute('preset', 'heading-2');

    // and
    const submitCTA = screen.getByTestId(testIds.formSubmitCta);
    expect(submitCTA).toBeVisible();
    expect(submitCTA).toHaveAttribute('variant', 'default');
    expect(submitCTA).toHaveAttribute('label', layoutProps.submitLabel);

    // and
    const previousCTA = screen.getByTestId(testIds.formPreviousCta);
    expect(previousCTA).toBeVisible();
    expect(previousCTA).toHaveAttribute('variant', 'outline');
    expect(previousCTA).toHaveAttribute('label', labels.actions.previous);

    // and
    expect(screen.getByText(childrenLabel)).toBeVisible();
  });
});
