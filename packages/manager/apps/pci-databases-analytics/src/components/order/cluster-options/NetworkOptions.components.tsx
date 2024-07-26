import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { HelpCircle, Network as NetworkIcon } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Network, NetworkTypeEnum, Subnet } from '@/types/cloud/network';
import { NetworkOptionValue } from '@/types/orderFunnel';
import * as database from '@/types/cloud/project/database';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import A from '@/components/links/A.component';
import OvhLink from '@/components/links/OvhLink.component';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface NetworkOptionsProps {
  value: NetworkOptionValue;
  onChange: (newNetwork: NetworkOptionValue) => void;
  networks: Network[];
  subnets: Subnet[];
  networkQuery: UseQueryResult<Network[], Error>;
  subnetQuery: UseQueryResult<Subnet[], Error>;
  availableNetworks: database.NetworkTypeEnum[];
}
const NetworkOptions = React.forwardRef<HTMLInputElement, NetworkOptionsProps>(
  (
    {
      value,
      onChange,
      networks,
      subnets,
      networkQuery,
      subnetQuery,
      availableNetworks,
    },
    ref,
  ) => {
    const { projectId } = useParams();
    const { t } = useTranslation(
      'pci-databases-analytics/components/order-options',
    );
    const hasPrivateNetwork = availableNetworks.includes(
      database.NetworkTypeEnum.private,
    );

    const renderNetworkSelect = () => {
      if (networkQuery.isPending) {
        return <Skeleton className="h-4 w-56" />;
      }

      if (networks.length > 0) {
        return (
          <Select
            name="networkId"
            value={value.networkId}
            onValueChange={(newNetworkId) =>
              onChange({
                ...value,
                networkId: newNetworkId,
                subnetId: undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue
                data-testid="network-placeholder"
                placeholder={t('networkInputPlaceholder')}
              />
            </SelectTrigger>
            <SelectContent>
              {networks.map((network: Network) => (
                <SelectItem key={network.id} value={network.id}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return (
        <Alert data-testid="AlertNoNetwork" variant="warning">
          <NetworkIcon className="h-4 w-4" />
          <AlertTitle>{t('noNetworkFoundTitle')}</AlertTitle>
          <AlertDescription>
            <Trans
              t={t}
              i18nKey={'noNetworkFoundDescription'}
              components={{
                anchor: (
                  <OvhLink
                    application="public-cloud"
                    path={`#/pci/projects/${projectId}/private-networks/new`}
                  ></OvhLink>
                ),
              }}
            ></Trans>
          </AlertDescription>
        </Alert>
      );
    };

    const renderSubnetSelect = () => {
      if (subnetQuery.isPending) {
        return <Skeleton className="h-4 w-56" />;
      }

      if (subnets.length > 0) {
        return (
          <Select
            name="subnetId"
            value={value.subnetId}
            onValueChange={(newSubnetId) =>
              onChange({
                ...value,
                subnetId: newSubnetId,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={'subnetInputPlaceholder'} />
            </SelectTrigger>
            <SelectContent>
              {subnets.map((subnet) => (
                <SelectItem key={subnet.id} value={subnet.id}>
                  {`${subnet.ipPools[0].network} - ${subnet.ipPools[0].region}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return (
        <Alert variant="warning">
          <NetworkIcon className="h-4 w-4" />
          <AlertTitle>{t('noNetworkFoundTitle')}</AlertTitle>
          <AlertDescription>
            <Trans
              t={t}
              i18nKey={'noNetworkFoundDescription'}
              components={{
                anchor: (
                  <OvhLink
                    application="public-cloud"
                    path={`#/pci/projects/${projectId}/gateway/new`}
                  ></OvhLink>
                ),
              }}
            ></Trans>
          </AlertDescription>
        </Alert>
      );
    };
    const renderNetworkOptions = () => {
      if (!hasPrivateNetwork) {
        return <p>{t('noPrivateNetworkOffer')}</p>;
      }

      if (value.type === database.NetworkTypeEnum.private) {
        return (
          <>
            <div>
              <Label>{t('networkInputLabel')}</Label>
              {renderNetworkSelect()}
            </div>
            {networkQuery.isFetching ||
              (networks.length > 0 && (
                <div>
                  <Label>{t('subnetInputLabel')}</Label>
                  {renderSubnetSelect()}
                </div>
              ))}
          </>
        );
      }

      return null;
    };

    return (
      <>
        <RadioGroup
          ref={ref}
          className="mb-2"
          name="network-type"
          value={value.type}
          onValueChange={(newNetworkValue) =>
            onChange({
              ...value,
              networkId: networks.length > 0 ? networks[0].id : undefined,
              type: newNetworkValue as NetworkTypeEnum,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={database.NetworkTypeEnum.public}
              id="public-network"
            />
            <Label htmlFor="public-network">{t('networkType-public')}</Label>
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="size-4" />
              </PopoverTrigger>
              <PopoverContent>
                <p>{t('networkDescription-public')}</p>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={database.NetworkTypeEnum.private}
              id="private-network-radio"
              disabled={!hasPrivateNetwork}
              className="peer"
            />
            <Label
              htmlFor="private-network-radio"
              className="peer-disabled:text-gray-500 peer-disabled:opacity-50"
            >
              {t('networkType-private')}
            </Label>
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="size-4" />
              </PopoverTrigger>
              <PopoverContent>
                <p>{t('networkDescription-private')}</p>
              </PopoverContent>
            </Popover>
          </div>
          <p>
            <Trans
              t={t}
              i18nKey={'networkConfigurationLink'}
              components={{
                anchor: (
                  <A
                    href="https://docs.ovh.com/fr/public-cloud/public-cloud-vrack/"
                    target="_blank"
                    rel="noopener"
                  ></A>
                ),
              }}
            ></Trans>
          </p>
        </RadioGroup>
        {renderNetworkOptions()}
      </>
    );
  },
);
NetworkOptions.displayName = 'NetworkOptions';

export default NetworkOptions;
