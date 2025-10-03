import { getAuthenticationMocks, Handler, toMswHandlers } from "@ovh-ux/manager-core-test-utils";

export type ConfigureTestParams = {
  route?: string;
  mocks?: Handler[];
};

export const configureTest = ({
  route,
  mocks,
}: ConfigureTestParams) => {
  if (mocks) {
    global.server?.resetHandlers(
      ...toMswHandlers([
        ...getAuthenticationMocks({ isAuthMocked: true }),
        ...mocks
      ]),
    );
  }

  if (route) {
    Object.defineProperty(window, 'location', {
      value: {
        href: route,
      },
      writable: true,
    });
  }
};
