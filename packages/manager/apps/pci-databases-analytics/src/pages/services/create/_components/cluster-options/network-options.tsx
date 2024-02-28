import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { Network as NetworkIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Network, NetworkTypeEnum, Subnet } from '@/models/network';
import { NetworkOptionValue } from '@/models/order-funnel';
import { database } from '@/models/database';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { A, P } from '@/components/typography';

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
    const hasPrivateNetwork = availableNetworks.includes(
      database.NetworkTypeEnum.private,
    );

    const renderNetworkSelect = () => {
      if (networkQuery.isFetching) {
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
              <SelectValue placeholder="Select a network" />
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
        <Alert variant="warning">
          <NetworkIcon className="h-4 w-4" />
          <AlertTitle>No network found</AlertTitle>
          <AlertDescription>
            You don't have a network for this region. Please use this link to
            create one:{' '}
            <A href="" disabled>
              create a private network
            </A>
          </AlertDescription>
        </Alert>
      );
    };

    const renderSubnetSelect = () => {
      if (subnetQuery.isFetching) {
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
              <SelectValue placeholder="Select a subnet" />
            </SelectTrigger>
            <SelectContent>
              {subnets.map((subnet) => (
                <SelectItem key={subnet.id} value={subnet.id}>
                  {subnet.cidr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return (
        <Alert variant="warning">
          <NetworkIcon className="h-4 w-4" />
          <AlertTitle>No subnet found</AlertTitle>
          <AlertDescription>
            You don't have a subnet for this region attached to the selected
            network. Please visit the network section to configure your
            networks: <A href="">create a private network</A>
          </AlertDescription>
        </Alert>
      );
    };

    const renderNetworkOptions = () => {
      if (!hasPrivateNetwork) {
        return <P>Cette offre n'est pas compatible avec les réseaux privés</P>;
      }

      if (value.type === database.NetworkTypeEnum.private) {
        return (
          <>
            <div>
              <Label>Network</Label>
              {renderNetworkSelect()}
            </div>
            {networkQuery.isFetching ||
              (networks.length > 0 && (
                <div>
                  <Label>Subnet</Label>
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
            <Label htmlFor="public-network">Réseau public (Internet)</Label>
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
              Réseau privé (vRack)
            </Label>
          </div>
        </RadioGroup>
        {renderNetworkOptions()}
      </>
    );
  },
);
NetworkOptions.displayName = 'NetworkOptions';

export default NetworkOptions;
