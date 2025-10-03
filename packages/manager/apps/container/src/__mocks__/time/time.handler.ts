import { Handler } from "@ovh-ux/manager-core-test-utils";

const DEFAULT_TIME = 123456;

export const getTimeMocks = (time: number = DEFAULT_TIME): Handler[] => [
  {
    url: 'auth/time',
    response: DEFAULT_TIME,
    api: 'v6',
    delay: 0,
  },
];
