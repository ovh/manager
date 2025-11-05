import { useTranslation } from 'react-i18next';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { Link, Text } from '@ovhcloud/ods-react';
import { useGetSubDomainsAndMultiSites } from '@/domain/hooks/data/query';

interface SubDomainMultiSiteProps {
  serviceNames: string[];
}

export default function SubDomainMultiSite({
  serviceNames,
}: SubDomainMultiSiteProps) {
  const { t } = useTranslation(['domain']);

  const subDomainsQueries = useGetSubDomainsAndMultiSites(serviceNames || []);

  const allSubDomains = subDomainsQueries
    .filter((query) => query.isSuccess && query.data)
    .flatMap((query) => query.data || []);

  const hasHosting = allSubDomains.length > 0;

  return (
    <>
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('domain_tab_general_information_associated_subdomains_multisite')}
        </ManagerTile.Item.Label>
        <div className="flex items-center justify-between">
          {hasHosting ? (
            <ul className="list-none space-y-2 p-0 m-0">
              {allSubDomains.map((hosting: string) => {
                return (
                  <li key={hosting} className="flex items-center gap-2">
                    <Link href={`https://${hosting}`}>{hosting}</Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Text>
              {t(
                'domain_tab_general_information_associated_subdomains_multisite_content',
              )}
            </Text>
          )}
        </div>
      </ManagerTile.Item>
    </>
  );
}
