import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, vi, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InstallationWizard from './InstallationWizard.page';
import { InstallationFormContextProvider } from '@/context/InstallationForm.context';
import { testIds } from '@/utils/testIds.constants';
import { WIZARD_SETTINGS } from './installationWizard.constants';

vi.mock('react-router-dom', () => ({
  useNavigate: () => ({ navigate: vi.fn() }),
}));

const renderComponent = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <InstallationFormContextProvider>
        <InstallationWizard />
      </InstallationFormContextProvider>
    </QueryClientProvider>,
  );

describe('InstallationWizard page unit test suite', () => {
  it('should render field with correct titles and content', () => {
    renderComponent();

    const elements = ['wizard_title', 'wizard_subtitle', 'wizard_content'];
    const upload = screen.getByTestId(testIds.formFileUpload);
    const submitCta = screen.getByTestId('primary-button');

    elements.forEach((el) => expect(screen.getByText(el)).toBeVisible());

    expect(submitCta).toHaveAttribute('label', 'wizard_cta');
    expect(upload).toHaveAttribute('accept', WIZARD_SETTINGS.accept);
    expect(upload).toHaveAttribute('max-file', `${WIZARD_SETTINGS.maxFile}`);
    expect(upload).toHaveAttribute('max-size', `${WIZARD_SETTINGS.maxSize}`);
  });
});
