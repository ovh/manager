import { getURL } from '@ovhcloud/msc-utils';

export type NetworkTileURLs = {
  ipUrl: string;
  updateReverseDns: string;
  deleteReverseDns: string;
};

export const getNetworkTileURLs = ({
  appPublicURL,

  serviceName,
}: {
  appPublicURL: string;
  serviceName: string;
}): NetworkTileURLs => ({
  ipUrl: getURL({
    appPublicURL,
    path: `/dedicated/#/ip?serviceName=${serviceName}`,
  }),
  updateReverseDns: getURL({
    appPublicURL,
    path: `/dedicated/#/server/${serviceName}/update-reverse-dns`,
  }),
  deleteReverseDns: getURL({
    appPublicURL,
    path: `/dedicated/#/server/${serviceName}/delete-reverse-dns`,
  }),
});
