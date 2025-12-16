import {
  render,
  waitFor,
  screen,
  fireEvent,
  RenderResult,
} from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import {
  initShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { i18n } from 'i18next';
import { SetupServer } from 'msw/node';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  getAuthenticationMocks,
  toMswHandlers,
} from '@ovh-ux/manager-core-test-utils';
import {
  getServicesMocks,
  GetServicesMocksParams,
} from '@ovh-ux/manager-module-common-api';
import {
  NetworkConfigParams,
  getNetworkConfig,
} from '@ovh-ux/manager-network-common';
import { QueryClient } from '@tanstack/react-query';
import { translations, labels, initTestI18n } from './test-i18n';
import { GetIamMocksParams, getIamMocks } from '../__mocks__/iam';
import { RenderTest } from './render-test';
import { RenderTestComponent } from './render-test-component';

export const DEFAULT_LISTING_ERROR = 'An error occured while fetching data';

const APP_NAME = 'vrack-services';

let context: ShellContextType;
let i18nState: i18n;

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: {
  initialRoute?: string;
} & GetServicesMocksParams &
  GetIamMocksParams &
  NetworkConfigParams = {}): Promise<RenderResult> => {
  ((global as unknown) as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getServicesMocks(mockParams),
      ...getNetworkConfig(mockParams),
      ...getIamMocks(mockParams),
    ]),
  );

  if (!context) {
    context = await initShellContext(APP_NAME);
  }

  if (!i18nState) {
    i18nState = await initTestI18n(APP_NAME, translations);
  }

  const result = render(
    RenderTest({
      initialRoute,
      shellContext: context,
      i18nState,
    }),
  );

  if (!initialRoute || initialRoute === '/') {
    await waitFor(
      () =>
        expect(
          screen.getAllByText(labels.listing.listingTitle, {
            exact: false,
          }).length,
        ).toBeGreaterThan(0),
      { timeout: 30000 },
    );
  }

  return result;
};

export const renderTestComponent = async ({
  component,
  ...mockParams
}: {
  component?: React.JSX.Element;
} & GetServicesMocksParams &
  GetIamMocksParams &
  NetworkConfigParams = {}): Promise<RenderResult> => {
  ((global as unknown) as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getServicesMocks(mockParams),
      ...getNetworkConfig(mockParams),
      ...getIamMocks(mockParams),
    ]),
  );

  if (!context) {
    context = await initShellContext(APP_NAME);
  }

  if (!i18nState) {
    i18nState = await initTestI18n(APP_NAME, translations);
  }

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  queryClient.setQueryData = vi.fn();

  const result = render(
    RenderTestComponent({
      component,
      shellContext: context,
      i18nState,
      queryClient,
    }),
  );

  return result;
};

const getOdsComponent = <T, A = string>(componentTag: string) => async ({
  container,
  odsData,
  nth = 0,
}: {
  container: HTMLElement;
  odsData: A;
  nth?: number;
}): Promise<HTMLElement> => {
  let component = null as HTMLElement;
  await waitFor(() => {
    component = Array.from(
      container.querySelectorAll(`${componentTag}[data-ods=${odsData}]`),
    )[nth] as HTMLElement;
    return expect(component).toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return component;
};

export const getSpanByOdsData = getOdsComponent('span');
export const getButtonByOdsData = getOdsComponent('button');

export const assertDisabled = async (element: HTMLElement) =>
  waitFor(() => expect(element).toBeDisabled(), WAIT_FOR_DEFAULT_OPTIONS);

export const assertEnabled = async (element: HTMLElement) =>
  waitFor(() => expect(element).toBeEnabled(), WAIT_FOR_DEFAULT_OPTIONS);

export const doActionOnElementUntil = async (
  actionFunction: () => void,
  assertionFunction: () => void,
) => {
  await waitFor(async () => {
    actionFunction();
    assertionFunction();
  }, WAIT_FOR_DEFAULT_OPTIONS);
};

export const getElementByText = async ({
  value,
  nth = 0,
}: {
  value: string;
  nth?: number;
}): Promise<HTMLElement> => {
  let component = null as HTMLElement;
  await waitFor(() => {
    component = screen.getAllByText(value)?.[nth];
    return expect(component).toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return component;
};

export const changeInputValueByTestId = async ({
  testId,
  value,
  nth = 0,
}: {
  testId: string;
  value: string;
  nth?: number;
}) => {
  const input = await screen.findByTestId(testId);
  input.setAttribute('value', value);
  await waitFor(() => fireEvent.change(input, { target: { value } }));
  return waitFor(
    () => expect(input).toHaveAttribute('value', value),
    WAIT_FOR_DEFAULT_OPTIONS,
  );
};

export const changeSelectValueByTestId = async ({
  testId,
  container,
  value,
}: {
  testId: string;
  container: HTMLElement;
  value: string;
}) => {
  const odsSelect = container.querySelector(
    `div[data-testid="${testId}"]>select`,
  ) as HTMLOdsSelectElement;
  // odsSelect.setAttribute('value', value);
  const event = new CustomEvent('onChange', {
    detail: { value },
  });

  await waitFor(() => fireEvent(odsSelect, event));
  return odsSelect;
};

export const assertModalText = ({
  container,
  text,
}: {
  container: HTMLElement;
  text: string;
}): Promise<HTMLElement> => getElementByText({ value: text });
