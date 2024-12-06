import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import { clsx } from 'clsx';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useMedia } from 'react-use';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useMe } from '@/api/hooks/useMe';
import { IPTypeEnum, TIpType } from '@/api/types';
import { CatalogPriceComponent } from '@/components/CatalogPrice.component';

export const IpTypeInputComponent = ({
  ipTypes,
  value,
  onInput,
}: {
  ipTypes: TIpType[];
  value: string;
  onInput: (newValue: string) => void;
}): JSX.Element => {
  const { t: tOrder } = useTranslation('order');
  const { me } = useMe();
  const isDesktop: boolean = useMedia(`(min-width: 760px)`);

  const context = useContext(ShellContext);

  return (
    <ul
      className={clsx(
        'grid gap-5 list-none p-0 m-0',
        isDesktop ? 'grid-cols-3' : 'grid-cols-1',
      )}
    >
      {ipTypes.map((ipType) => (
        <li key={ipType.name}>
          <OsdsTile
            onClick={() => onInput(ipType.name)}
            className={clsx(
              'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-075] hover:border-[--ods-color-blue-600]',
              value === ipType.name &&
                'bg-[--ods-color-blue-075] border-[--ods-color-blue-600]',
            )}
          >
            <div>
              <div className="border-solid border-0 border-b border-b-[#bef1ff] w-full mx-4 pb-2 text-[#4d5592] text-sm">
                <div
                  className={clsx(
                    'border-b-[--ods-color-blue-100] font-bold pb-2',
                    value === ipType.name && 'font-bold',
                  )}
                >
                  <span>{ipType.label}</span>
                </div>
                <div className="pt-2 pb-8 text-[#4d5592] font-sans text-xs">
                  {ipType.description}
                </div>
              </div>
              <div className="text-center border-t border-t-[#bef1ff]">
                <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                  {ipType.name === IPTypeEnum.FAILOVER ? (
                    <strong>
                      {tOrder('pci_additional_ip_price_per_month', {
                        price: ipType.price,
                      })}
                    </strong>
                  ) : (
                    <CatalogPriceComponent
                      price={Number(ipType.price)}
                      user={me}
                      interval="hour"
                      maximumFractionDigits={4}
                      locale={context.environment.getUserLocale()}
                    />
                  )}
                </OsdsText>
              </div>
            </div>
          </OsdsTile>
        </li>
      ))}
    </ul>
  );
};
