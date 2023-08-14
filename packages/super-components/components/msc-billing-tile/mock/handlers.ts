import { rest } from 'msw';
import { apiClient } from '@ovh-ux/manager-core-api';
import vpsServiceInfos from './v6/vps-service-infos.json';
import vpsServiceDetails from './v6/vsp-service-details.json';
import nashaServiceInfos from './v6/nasha-service-infos.json';
import nashaServiceDetails from './v6/nasha-service-details.json';
import expiredServiceInfos from './v6/expired-service-infos.json';
import expiredServiceDetails from './v6/expired-service-details.json';
import domainServiceInfos from './v6/domain-service-infos.json';
import domainServiceDetails from './v6/domain-service-details.json';
import domainPropertiess from './v6/domain-properties.json';
import contactResponse from './v6/me-contact.json';
import deleteAtExpirationServiceInfos from './v6/delete-at-expiration-service-infos.json';
import deleteAtExpirationServiceDetails from './v6/delete-at-expiration-service-details.json';
import emailsServiceInfos from './v6/emails-service-infos.json';
import emailsServiceDetails from './v6/emails-service-details.json';
import emailsProperties from './v6/emails-properties.json';
import hostingWebServiceInfos from './v6/hosting-web-service-infos.json';
import hostingWebServiceDetails from './v6/hosting-web-service-details.json';
import hostingWebProperties from './v6/hosting-web-properties.json';

type Handler = {
  url: string;
  response?: any;
  delay?: number;
  method?:
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'all'
    | 'head'
    | 'options'
    | 'patch';
  status?: number;
  api?: 'v2' | 'v6' | 'aapi' | 'ws';
  baseUrl?: string;
};

export const config: Handler[] = [
  {
    url: 'vps/vps-00000000.vps.ovh.net',
    response: {},
  },
  {
    url: 'vps/vps-00000000.vps.ovh.net/serviceInfos',
    response: vpsServiceInfos,
  },
  {
    url: 'services/111111111',
    response: vpsServiceDetails,
  },

  {
    url: 'dedicated/nasha/zpool-111111',
    response: {},
  },
  {
    url: 'dedicated/nasha/zpool-111111/serviceInfos',
    response: nashaServiceInfos,
  },
  {
    url: 'services/222222222',
    response: nashaServiceDetails,
  },

  {
    url: 'vps/vps-33333333.vps.ovh.net',
    response: {},
  },
  {
    url: 'vps/vps-33333333.vps.ovh.net/serviceInfos',
    response: expiredServiceInfos,
  },
  {
    url: 'services/33333333',
    response: expiredServiceDetails,
  },

  {
    url: 'vps/vps-99999999.vps.ovh.net',
    response: {},
  },
  {
    url: 'vps/vps-99999999.vps.ovh.net/serviceInfos',
    response: deleteAtExpirationServiceInfos,
  },
  {
    url: 'services/999999999',
    response: deleteAtExpirationServiceDetails,
  },

  {
    url: 'domain/domain-test.ovh',
    response: domainPropertiess,
  },
  {
    url: 'domain/domain-test.ovh/serviceInfos',
    response: domainServiceInfos,
  },
  {
    url: 'services/44444444',
    response: domainServiceDetails,
  },
  {
    url: 'domain/contact/:id',
    response: contactResponse,
  },

  {
    url: 'emails/domain/domain-test.ovh',
    response: emailsProperties,
  },
  {
    url: 'services/555555555',
    response: emailsServiceDetails,
  },
  {
    url: 'emails/domain/domain-test.ovh/serviceInfos',
    response: emailsServiceInfos,
  },

  {
    url: 'hosting/web/abcdef.test.hosting.ovh.net',
    response: hostingWebProperties,
  },
  {
    url: 'services/666666666',
    response: hostingWebServiceDetails,
  },
  {
    url: 'hosting/web/abcdef.test.hosting.ovh.net/serviceInfos',
    response: hostingWebServiceInfos,
  },
];

export default config.map(
  ({
    url,
    method = 'get',
    delay = 5000,
    status = 200,
    response = {},
    api = 'v6',
    baseUrl,
  }: Handler) =>
    rest[method](
      `${baseUrl ?? apiClient[api].getUri()}/${url}`,
      (_, res, ctx) =>
        res(
          ...[
            delay && ctx.delay(delay),
            response && ctx.json(response),
            status && ctx.status(status),
          ].filter(Boolean),
        ),
    ),
);
