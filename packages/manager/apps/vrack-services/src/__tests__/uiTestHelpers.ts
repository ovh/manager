import React from 'react';

import { QueryClient } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import type { i18n } from 'i18next';
import type { SetupServer } from 'msw/node';
import { vi } from 'vitest';

import {
  WAIT_FOR_DEFAULT_OPTIONS,
  getAuthenticationMocks,
  toMswHandlers,
} from '@ovh-ux/manager-core-test-utils';
import { getServicesMocks } from '@ovh-ux/manager-module-common-api';
import type { GetServicesMocksParams } from '@ovh-ux/manager-module-common-api';
import { getNetworkConfig } from '@ovh-ux/manager-network-common';
import type { NetworkConfigParams } from '@ovh-ux/manager-network-common';
import { initShellContext } from '@ovh-ux/manager-react-shell-client';
import type { ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { GetIamMocksParams, getIamMocks } from '../__mocks__/iam';
import { RenderTestComponent } from './render-test-component';
import { initTestI18n, translations } from './test-i18n';

export const DEFAULT_LISTING_ERROR = 'An error occured while fetching data';

const APP_NAME = 'vrack-services';

let context: ShellContextType;
let i18nState: i18n;

export const renderTestComponent = async ({
  component,
  ...mockParams
}: {
  component: React.JSX.Element;
} & GetServicesMocksParams &
  GetIamMocksParams &
  NetworkConfigParams): Promise<RenderResult> => {
  // eslint-disable-next-line no-undef
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
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

const getOdsComponent =
  (componentTag: string) =>
  async ({
    container,
    odsData,
    nth = 0,
  }: {
    container: HTMLElement;
    odsData: string;
    nth?: number;
  }): Promise<HTMLElement | undefined> => {
    let component: HTMLElement | undefined;
    await waitFor(() => {
      component = Array.from(container.querySelectorAll(`${componentTag}[data-ods=${odsData}]`))[
        nth
      ] as HTMLElement;
      return expect(component).toBeInTheDocument();
    }, WAIT_FOR_DEFAULT_OPTIONS);
    return component;
  };

export const getSpanByOdsData = getOdsComponent('span');

export const assertDisabled = async (element: HTMLElement) =>
  waitFor(() => expect(element).toBeDisabled(), WAIT_FOR_DEFAULT_OPTIONS);

export const assertEnabled = async (element: HTMLElement) =>
  waitFor(() => expect(element).toBeEnabled(), WAIT_FOR_DEFAULT_OPTIONS);

export const doActionOnElementUntil = async (
  actionFunction: () => void,
  assertionFunction: () => void,
) =>
  waitFor(() => {
    actionFunction();
    assertionFunction();
  }, WAIT_FOR_DEFAULT_OPTIONS);

export const getElementByText = async ({
  value,
  nth = 0,
}: {
  value: string;
  nth?: number;
}): Promise<HTMLElement | undefined> => {
  let component: HTMLElement | undefined;
  await waitFor(() => {
    component = screen.getAllByText(value)?.[nth];
    return expect(component).toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return component;
};

export const changeInputValueByTestId = async ({
  testId,
  value,
}: {
  testId: string;
  value: string;
}) => {
  const input = await screen.findByTestId(testId);
  input.setAttribute('value', value);
  await waitFor(() => fireEvent.change(input, { target: { value } }));
  return waitFor(() => expect(input).toHaveAttribute('value', value), WAIT_FOR_DEFAULT_OPTIONS);
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
  const odsSelect = container.querySelector(`div[data-testid="${testId}"]>select`) as HTMLElement;
  const event = new CustomEvent('onChange', {
    detail: { value },
  });

  await waitFor(() => fireEvent(odsSelect, event));
  return odsSelect;
};

export const assertModalText = (text: string): Promise<HTMLElement | undefined> =>
  getElementByText({ value: text });
