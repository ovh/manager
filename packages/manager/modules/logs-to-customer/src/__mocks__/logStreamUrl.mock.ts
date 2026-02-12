import { Url, UrlTypeEnum } from '@/data/types/dbaas/logs/Logs.type';

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
