import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { SetupServer, setupServer } from 'msw/node';
import { vi } from 'vitest';
import { fetch } from 'cross-fetch';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var server: SetupServer;
  // eslint-disable-next-line vars-on-top, no-var, @typescript-eslint/naming-convention
  var __VERSION__: string;
}

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
  global.__VERSION__ = '';
  global.server = server;
  global.fetch = fetch;
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  server.resetHandlers();
});

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackClick: trackClickMock,
      trackCurrentPage: vi.fn(),
    }),
  };
});

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => ({
  ...(await importOriginal()),
  OdsCheckbox: ({
    name,
    inputId,
    isDisabled,
    isChecked,
    onOdsChange,
  }: {
    name: string;
    inputId: string;
    isDisabled: boolean;
    isChecked: boolean;
    onOdsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      type="checkbox"
      name={name}
      id={inputId}
      checked={isChecked}
      disabled={isDisabled}
      onChange={onOdsChange}
    />
  ),
}));
