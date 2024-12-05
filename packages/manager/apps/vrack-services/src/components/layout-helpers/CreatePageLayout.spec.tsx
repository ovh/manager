// V Should be first V
import '@/test-utils/setupTests';
// -----
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { getButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import {
  CreatePageLayout,
  CreatePageLayoutProps,
} from './CreatePageLayout.component';

const onSubmitMock = vi.fn();

const renderComponent = ({ ...args }: CreatePageLayoutProps) => {
  return render(<CreatePageLayout {...args} />);
};

describe('CreatePageLayout Component', () => {
  it('should display creation form', async () => {
    const { container, getByText } = renderComponent({
      title: 'create-title',
      description: 'create-description',
      onSubmit: onSubmitMock,
      createButtonLabel: 'create-button-label',
      isFormSubmittable: true,
      goBackLinkLabel: 'create-go-back',
      goBackUrl: 'create-go-back-url',
      hasFormError: true,
      formErrorMessage: 'create-form-error',
    });

    const title = getByText('create-title');
    expect(title).toBeDefined();
    expect(title).toHaveAttribute('size', ODS_TEXT_SIZE._600);

    const description = getByText('create-description');
    expect(description).toBeDefined();

    const createButton = await getButtonByLabel({
      label: 'create-button-label',
      container,
    });
    expect(createButton).toBeDefined();

    await act(() => {
      return fireEvent.click(createButton);
    });

    expect(onSubmitMock).toHaveBeenCalledOnce();

    const goBackLink = await getButtonByLabel({
      label: 'create-go-back',
      container,
      isLink: true,
    });
    expect(goBackLink).toBeDefined();

    expect(getByText('create-form-error')).toBeDefined();
  });
});
