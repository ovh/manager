import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
} from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { NetworkGroup, networks, Subnet } from '@/pages/tmp/data';
import './index.scss';

const networkGroups: Map<string, NetworkGroup> = new Map();

networks
  .filter((network: { id: string }) => network.vlanId !== null)
  .sort((n1, n2) => n1.vlanId - n2.vlanId)
  .forEach((network) => {
    if (!networkGroups.has(network.name)) {
      networkGroups.set(network.name, {
        name: network.name,
        vlanId: `${network.vlanId}`,
        subnets: [],
      } as NetworkGroup);
    }

    const subnets = network.subnets.map((sub) => {
      return {
        name: network.name,
        vlanId: `${network.vlanId}`,
        region: network.region,
        cidr: sub.cidr,
        gateway: sub.gatewayIp,
        dhcpEnabled: sub.dhcpEnabled,
        ipAddress: {
          start: 'start',
          end: 'end',
        },
      } as Subnet;
    });

    networkGroups.get(network.name)!.subnets!.push(...subnets);
  });

export default function TmpPage() {
  const [fold, setFold] = useState(
    new Map([...networkGroups.keys()].map((key) => [key, true])),
  );
  const toggle = (key: string) => {
    const value = fold.get(key);
    setFold((map) => new Map(map.set(key, !value)));
  };
  const elementOf = (
    networkGroup: NetworkGroup,
  ): JSX.Element | JSX.Element[] => {
    if (fold.get(networkGroup.name)) {
      return (
        <tr
          className="border border-[var(--ods-color-blue-200)]"
          key={networkGroup.name}
          style={{ borderBottomWidth: '2px' }}
        >
          <td>
            <OsdsText
              className="whitespace-nowrap"
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            >
              {networkGroup.vlanId}
            </OsdsText>
          </td>

          <td>
            <OsdsText
              className="whitespace-nowrap"
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            >
              {networkGroup.name}
            </OsdsText>
          </td>
          <td colSpan={5} className="cursor-pointer text-center">
            <OsdsIcon
              name={ODS_ICON_NAME.CHEVRON_DOWN}
              size={ODS_ICON_SIZE.xs}
              className="bg-[var(--ods-color-blue-200)]"
              onClick={() => toggle(networkGroup.name)}
            />
          </td>
        </tr>
      );
    }
    return (
      <>
        {networkGroup.subnets.map((sub: Subnet, index) => (
          <tr
            key={sub.name + index}
            className="border border-[var(--ods-color-blue-200)]"
          >
            {index === 0 && (
              <>
                <td rowSpan={networkGroup.subnets.length + 1}>
                  <OsdsText
                    className="whitespace-nowrap"
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  >
                    {networkGroup.vlanId}
                  </OsdsText>
                </td>

                <td rowSpan={networkGroup.subnets.length + 1}>
                  <OsdsText
                    className="whitespace-nowrap"
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  >
                    {networkGroup.name}
                  </OsdsText>
                </td>
              </>
            )}
            <td>
              <OsdsText
                className="whitespace-nowrap"
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {sub.region}
              </OsdsText>
            </td>
            <td>
              <OsdsText
                className="whitespace-nowrap"
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {sub.cidr}
              </OsdsText>
            </td>
            <td>
              <OsdsText
                className="whitespace-nowrap"
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {sub.gateway}
              </OsdsText>
            </td>
            <td>
              <OsdsText
                className="whitespace-nowrap"
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {sub.dhcpEnabled ? 'actif' : 'non actif'}
              </OsdsText>
            </td>
            <td>
              <OsdsText
                className="whitespace-nowrap"
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {sub.vlanId}
              </OsdsText>
            </td>
          </tr>
        ))}
        <tr
          key={`fold${networkGroup.name}`}
          className="border border-[var(--ods-color-blue-200)]"
          style={{ borderBottomWidth: '2px' }}
        >
          <td colSpan={5} className="cursor-pointer text-center">
            <OsdsIcon
              name={ODS_ICON_NAME.CHEVRON_UP}
              size={ODS_ICON_SIZE.xs}
              className="bg-[var(--ods-color-blue-200)]"
              onClick={() => toggle(networkGroup.name)}
            />
          </td>
        </tr>
      </>
    );
  };

  return (
    <div className="container overflow-x-scroll p-5 ml-2">
      <table className="w-full mb-2">
        <thead>
          <tr className="bg-[var(--ods-color-blue-200)] border border-[var(--ods-color-blue-200)]">
            <th className="p-4">
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                hue={ODS_TEXT_COLOR_HUE._600}
                className="whitespace-nowrap text-[--ods-color-text-500]"
              >
                VLAN ID
              </OsdsText>
            </th>
            <th className="p-4">
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                hue={ODS_TEXT_COLOR_HUE._600}
                className="whitespace-nowrap text-[--ods-color-text-500]"
              >
                Nom
              </OsdsText>
            </th>
            <th className="p-4">
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                hue={ODS_TEXT_COLOR_HUE._600}
                className="whitespace-nowrap text-[--ods-color-text-500]"
              >
                Région
              </OsdsText>
            </th>
            <th className="p-4">
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                hue={ODS_TEXT_COLOR_HUE._600}
                className="whitespace-nowrap text-[--ods-color-text-500]"
              >
                CIDR
              </OsdsText>
            </th>
            <th className="p-4">
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                hue={ODS_TEXT_COLOR_HUE._600}
                className="whitespace-nowrap text-[--ods-color-text-500]"
              >
                Passerelle
              </OsdsText>
            </th>
            <th className="p-4">
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                hue={ODS_TEXT_COLOR_HUE._600}
                className="whitespace-nowrap text-[--ods-color-text-500]"
              >
                DHCP
              </OsdsText>
            </th>
            <th className="p-4">
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                hue={ODS_TEXT_COLOR_HUE._600}
                className="whitespace-nowrap text-[--ods-color-text-500]"
              >
                Adresse IP allouées
              </OsdsText>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...networkGroups.values()].map((networkGroup) =>
            elementOf(networkGroup),
          )}
        </tbody>
      </table>
    </div>
  );
}
