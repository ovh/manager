import { vitest } from 'vitest';
import {
  ShellContext,
  ShellContextType,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import { Error } from '../Error.component';
import { render } from '../../../utils/test.provider';
import tradFr from '../translations/Messages_fr_FR.json';
import { ErrorObject, ErrorProps } from '../Error.types';

export const mockTrackPage = vitest.fn();
export const mockGetEnvironment = vitest.fn();

export const shellContext = {
  shell: {
    environment: {
      getEnvironment: mockGetEnvironment,
    },
    tracking: {
      trackPage: mockTrackPage,
    },
  },
};

export const defaultProps: ErrorProps = {
  error: {
    headers: { 'x-ovh-queryid': '123456789' },
    data: { message: "Votre requête n'a pas abouti" },
    status: 404,
  },
};

export const setupSpecTest = (
  customProps?: Partial<ErrorProps>,
  error?: ErrorObject,
) =>
  render(
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      <Error error={error ?? defaultProps.error} {...customProps} />
    </ShellContext.Provider>,
  );

describe('specs:error.component', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
    mockGetEnvironment.mockResolvedValue({
      applicationName: 'test-application',
    });
  });

  it('renders without error', () => {
    setupSpecTest();
    const img = screen.getByAltText('OOPS');
    const title = screen.queryByText(tradFr.manager_error_page_title);
    const errorMessage = screen.queryByText(tradFr.manager_error_page_default);

    expect(img).not.toBeNull();
    expect(title).toBeTruthy();
    expect(errorMessage).toBeTruthy();
  });

  describe('tracking functionality', async () => {
    it('calls tracking with correct parameters for 404 error', async () => {
      const error404: ErrorObject = {
        status: 404,
        data: { message: 'Not found' },
        headers: { 'x-ovh-queryid': '123456789' },
      };

      setupSpecTest({}, error404);

      await waitFor(() => {
        expect(true).toBe(true);
        expect(mockGetEnvironment).toHaveBeenCalled();
        expect(mockTrackPage).toHaveBeenCalledWith({
          name: 'errors::service_not_found::test-application',
          level2: '81',
          type: 'navigation',
          page_category: PageType.bannerError,
        });
      });
    });

    it('calls tracking with correct parameters for 401 error', () => {
      const error401: ErrorObject = {
        status: 401,
        data: { message: 'Unauthorized' },
        headers: { 'x-ovh-queryid': '123456789' },
      };

      setupSpecTest({}, error401);

      waitFor(() => {
        expect(mockGetEnvironment).toHaveBeenCalled();
        expect(mockTrackPage).toHaveBeenCalledWith({
          name: 'errors::unauthorized::test-application',
          level2: '81',
          type: 'navigation',
          page_category: PageType.bannerError,
        });
      });
    });

    it('calls tracking with correct parameters for 500 error', async () => {
      const error500: ErrorObject = {
        status: 500,
        data: { message: 'Internal server error' },
        headers: { 'x-ovh-queryid': '123456789' },
      };

      setupSpecTest({}, error500);

      await waitFor(() => {
        expect(mockGetEnvironment).toHaveBeenCalled();
        expect(mockTrackPage).toHaveBeenCalledWith({
          name: 'errors::error_during_page_loading::test-application',
          level2: '81',
          type: 'navigation',
          page_category: PageType.bannerError,
        });
      });
    });
  });

  describe('contents', () => {
    it('displays error details if present', () => {
      const customError: ErrorObject = {
        status: 500,
        data: { message: 'Custom data message' },
        headers: { 'x-ovh-queryid': '123456789' },
      };
      setupSpecTest({ onRedirectHome: vitest.fn() }, customError);
      const strongMessage = screen.queryByText('Custom data message');
      expect(strongMessage).toBeTruthy();
    });

    it('calls onRedirectHome when home button is clicked', () => {
      const onRedirectHomeMock = vitest.fn();
      const { getByTestId } = setupSpecTest({
        onRedirectHome: onRedirectHomeMock,
      });
      const homeButton = getByTestId('error-template-action-home');
      fireEvent.click(homeButton);
      expect(onRedirectHomeMock).toHaveBeenCalled();
    });

    it('calls onReloadPage when reload button is clicked', () => {
      const onReloadPageMock = vitest.fn();
      const { getByTestId } = setupSpecTest({
        onReloadPage: onReloadPageMock,
      });
      const reloadButton = getByTestId('error-template-action-reload');
      fireEvent.click(reloadButton);
      expect(onReloadPageMock).toHaveBeenCalled();
    });
  });
});
