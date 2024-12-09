import {
  DataGridTextCell,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CLOUD_GEOLOCALISATION, CLOUD_UNIT_CONVERSION } from '@/constants';
import { TInstanceBandWith } from '@/api/hook/useConsumption';

const FREE_TRAFFIC_PER_APAC_REGION = 1024;

export function useOutgoingTrafficListColumns() {
  const { t } = useTranslation('consumption/hourly-instance/outgoing-traffic');
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { currency } = useContext(ShellContext).environment.getUser();

  const isAPACRegion = (region: string) =>
    CLOUD_GEOLOCALISATION.instance.APAC.includes(region);

  const getPriceByRegion = (bandwidth: TInstanceBandWith) => {
    if (isAPACRegion(bandwidth.region)) {
      const bandwidthUsedInTb = bandwidth.outgoingBandwidth.quantity.value;
      if (bandwidthUsedInTb > 1) {
        const totalPrice = bandwidth.outgoingBandwidth
          ? bandwidth.outgoingBandwidth.totalPrice
          : 0;
        return `${totalPrice} ${currency.symbol}`;
      }
    }
    return t('cpbc_hourly_instance_trafic_included');
  };

  const getTrafficByRegion = (bandwidth: TInstanceBandWith) => {
    if (isAPACRegion(bandwidth.region)) {
      const bandwidthUsedInGiB =
        bandwidth.outgoingBandwidth.quantity.value || 0;

      // convert GiB to GB
      const bandwidthUsedInGB =
        (CLOUD_UNIT_CONVERSION.GIBIBYTE_TO_BYTE * bandwidthUsedInGiB) /
        CLOUD_UNIT_CONVERSION.GIGABYTE_TO_BYTE;
      return `${bandwidthUsedInGB.toFixed(
        2,
      )}/${FREE_TRAFFIC_PER_APAC_REGION} ${t('unit_size_GB')}`;
    }
    return t('cpbc_hourly_instance_trafic_unlimitted');
  };

  return [
    {
      id: 'region',
      cell: (row: TInstanceBandWith) => (
        <DataGridTextCell>{translateMicroRegion(row.region)}</DataGridTextCell>
      ),
      label: t('cpbc_hourly_instance_trafic_region'),
    },
    {
      id: 'traffic',
      cell: (row: TInstanceBandWith) => (
        <div>
          <DataGridTextCell>{getTrafficByRegion(row)}</DataGridTextCell>
        </div>
      ),
      label: t('cpbc_hourly_instance_trafic_trafic'),
    },

    {
      id: 'price',
      cell: (row: TInstanceBandWith) => (
        <div>
          <DataGridTextCell>{getPriceByRegion(row)}</DataGridTextCell>
        </div>
      ),
      label: t('cpbc_hourly_instance_trafic_price'),
    },
  ];
}
