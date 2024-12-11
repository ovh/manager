import { FC, useState, useMemo } from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useFormContext } from 'react-hook-form';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import DNSInputEdit from './DNSInputEdit.component';
import { DNS_SERVER_LIMIT } from './DNSCustom.constant';

const DNSCustom: FC = () => {
  const [newPosition, setNewPosition] = useState<number>(0);
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<NewPrivateNetworkForm>();
  const dnsServers = watch('subnet.dnsNameServers');

  const isErrors =
    !dnsServers?.[newPosition] ||
    !!errors.subnet?.dnsNameServers?.[newPosition];

  const isAddUnAvailable = isErrors || newPosition === DNS_SERVER_LIMIT;

  const onAddNewDnsServer = () => setNewPosition((position) => position + 1);

  const onRemoveDnsServer = (index: number) => {
    const updatedDnsServers = dnsServers.filter((_, i) => index !== i);
    setValue('subnet.dnsNameServers', updatedDnsServers);
    setNewPosition((position) => position - 1);
  };

  const editableDnsServers = useMemo(
    () => Array.from({ length: newPosition }, (_, index) => index),
    [newPosition],
  );

  return (
    <div className="mt-4 ml-9">
      {editableDnsServers.map((item) => (
        <DNSInputEdit key={item} position={item}>
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="self-end"
            onClick={() => onRemoveDnsServer(item)}
          >
            <OsdsIcon
              name={ODS_ICON_NAME.TRASH}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsButton>
        </DNSInputEdit>
      ))}
      <DNSInputEdit position={newPosition}>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="self-end"
          disabled={isAddUnAvailable ? true : undefined}
          onClick={onAddNewDnsServer}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </OsdsButton>
      </DNSInputEdit>
    </div>
  );
};

export default DNSCustom;
