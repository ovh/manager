import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Network, NetworkTypeEnum, Subnet } from '@/models/network';
import { NetworkOptionValue } from '@/models/order-funnel';
import { database } from '@/models/database';
import { Skeleton } from '@/components/ui/skeleton';

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
          <select
            name="networkId"
            className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"
            value={value.networkId}
            onChange={(event) =>
              onChange({
                ...value,
                networkId: event.target.value,
                subnetId: undefined,
              })
            }
          >
            {networks.map((network: Network, index: number) => (
              <option key={index} value={network.id}>
                {network.name}
              </option>
            ))}
          </select>
        );
      }

      return <p>You don't have a network for this region</p>;
    };

    const renderSubnetSelect = () => {
      if (subnetQuery.isFetching) {
        return <Skeleton className="h-4 w-56" />;
      }

      if (subnets.length > 0) {
        return (
          <select
            name="subnetId"
            className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"
            value={value.subnetId}
            onChange={(event) =>
              onChange({
                ...value,
                subnetId: event.target.value,
              })
            }
          >
            {subnets.map((subnet, index) => (
              <option key={index} value={subnet.id}>
                {subnet.cidr}
              </option>
            ))}
          </select>
        );
      }

      return <p>You don't have a subnet for this region</p>;
    };

    const renderNetworkOptions = () => {
      if (!hasPrivateNetwork) {
        return <p>Cette offre n'est pas compatible avec les réseaux privés</p>;
      }

      if (value.type === database.NetworkTypeEnum.private) {
        return (
          <>
            <div className="flex items-center mb-2">
              <label className="mr-2">Network:</label>
              {renderNetworkSelect()}
            </div>
            <div className="flex items-center mb-2">
              <label className="mr-2">Subnet:</label>
              {renderSubnetSelect()}
            </div>
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
