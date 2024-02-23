import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Network, NetworkTypeEnum, Subnet } from '@/models/network';
import { H4 } from '@/components/typography';
import { NetworkOptionValue } from '@/models/order-funnel';

interface NetworkOptionsProps {
  value: NetworkOptionValue;
  onChange: (newNetwork: NetworkOptionValue) => void;
  networks: Network[];
  subnets: Subnet[];
}
const NetworkOptions = React.forwardRef<HTMLInputElement, NetworkOptionsProps>(
  ({ value, onChange, networks, subnets }, ref) => {
    return (
      <>
        <H4>Network</H4>
        <RadioGroup
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
            <RadioGroupItem value="public" id="public-network" />
            <Label htmlFor="public-network">Réseau public (Internet)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private-network" />
            <Label htmlFor="private-network">Réseau privé (vRack)</Label>
          </div>
        </RadioGroup>
        {value.type === 'private' && (
          <div>
            <div>
              {networks.length > 0 ? (
                <div className="flex items-center mb-2">
                  <label className="mr-2">Network:</label>
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
                </div>
              ) : (
                <p>You don't have a network for this region</p>
              )}
            </div>
            <div>
              {subnets.length > 0 ? (
                <div className="flex items-center mb-2">
                  <label className="mr-2">Subnet:</label>
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
                </div>
              ) : (
                <p>You don't have a subnet for this region</p>
              )}
            </div>
          </div>
        )}
      </>
    );
  },
);
NetworkOptions.displayName = 'NetworkOptions';

export default NetworkOptions;
