import React from 'react';
import { waitFor } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { ErrorBanner } from './error.component';
import userEvent from '@testing-library/user-event';
import tradFr from './translations/Messages_fr_FR.json';
import { ErrorObject, ErrorBannerProps } from './error.types';
import { defaultProps } from './error.stories';
import { vitest } from 'vitest';

const setupSpecTest = async (
  customProps?: Partial<ErrorBannerProps>,
  error?: ErrorObject,
) =>
  waitFor(() =>
    render(
      <ErrorBanner error={error ?? defaultProps.error} {...customProps} />,
    ),
  );

describe('specs:error.component', () => {
  it('renders without error', async () => {
    const screen = await setupSpecTest();
    const img = screen.getByAltText('OOPS');
    const title = screen.queryByText(tradFr.manager_error_page_title);
    const errorMessage = screen.queryByText(tradFr.manager_error_page_default);

    expect(img).not.toBeNull();
    expect(title).toBeTruthy();
    expect(errorMessage).toBeTruthy();
  });

  describe('contents', () => {
    it('displays error details if present', async () => {
      const customError: ErrorObject = {
        status: 500,
        data: { message: 'Custom data message' },
        headers: { 'x-ovh-queryid': '123456789' },
      };

      const screen = await setupSpecTest(
        { onRedirectHome: vitest.fn() },
        customError,
      );

      const strongMessage = screen.queryByText('Custom data message');

      expect(strongMessage).toBeTruthy();
    });

    it('calls onRedirectHome when home button is clicked', async () => {
      const onRedirectHomeMock = vitest.fn();
      const { getByTestId } = await setupSpecTest({
        onRedirectHome: onRedirectHomeMock,
      });

      const homeButton = getByTestId('error-template-action-home');
      await userEvent.click(homeButton);
      expect(onRedirectHomeMock).toHaveBeenCalled();
    });

    it('calls onReloadPage when reload button is clicked', async () => {
      const onReloadPageMock = vitest.fn();
      const { getByTestId } = await setupSpecTest({
        onReloadPage: onReloadPageMock,
      });

      const reloadButton = getByTestId('error-template-action-reload');
      await userEvent.click(reloadButton);
      expect(onReloadPageMock).toHaveBeenCalled();
    });
  });
});
