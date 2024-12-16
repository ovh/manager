import { Url, UrlTypeEnum } from '../types/dbaas/logs';

export const logStreamUrlMock: Url[] = [
  {
    address: 'https://get.logs.ovh.com/mock/url',
    type: UrlTypeEnum.GRAYLOG_WEBUI,
  },
  {
    address: 'https://get.logs.ovh.com/mock/url2',
    type: UrlTypeEnum.GRAYLOG_WEBUI,
  },
  {
    address: 'https://get.logs.ovh.com/mock/url3',
    type: UrlTypeEnum.GRAYLOG_WEBUI,
  },
  {
    address: 'https://get.logs.ovh.com/mock/url',
    type: UrlTypeEnum.GRAYLOG_API,
  },
];
