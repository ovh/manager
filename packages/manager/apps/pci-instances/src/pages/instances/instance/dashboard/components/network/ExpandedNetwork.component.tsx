import { FC, useState } from 'react';
import { Button, Icon } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import NetworkItem from './NetworkItem.component';
import { TInstanceAddress } from '@/types/instance/entity.type';

const ExpandedNetwork: FC<{ networks: TInstanceAddress[] }> = ({
  networks,
}) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <>
      <div className="flex justify-end">
        <Button variant="ghost" onClick={handleExpand}>
          {t('load_more')}
          <Icon name={isExpanded ? 'chevron-right' : 'chevron-down'} />
        </Button>
      </div>
      {isExpanded &&
        networks.map((network) => (
          <NetworkItem key={network.ip} address={network} />
        ))}
    </>
  );
};

export default ExpandedNetwork;
