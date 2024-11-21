import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { FLOATING_IP_TYPES } from '@/constants';

export type TIpStepMessagesProps = {
  type: typeof FLOATING_IP_TYPES[number];
  price: string;
};

export const IpStepMessages = ({
  type,
  price,
}: TIpStepMessagesProps): JSX.Element => {
  const { t: tCreate } = useTranslation('load-balancer/create');

  if (type === 'ip') return <></>;

  return (
    <>
      {type === 'create' ? (
        <OsdsMessage
          className="mt-8"
          type={ODS_MESSAGE_TYPE.info}
          color={ODS_THEME_COLOR_INTENT.info}
        >
          <div className="grid grid-cols-1 gap-8 py-6">
            <div>
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {tCreate(
                  'octavia_load_balancer_create_floating_ip_new_information',
                )}
              </OsdsText>
            </div>
            <div>
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: tCreate(
                      'octavia_load_balancer_create_floating_ip_new_price',
                      {
                        price: `
                          <b>
                            ${price}
                          </b>
                        `,
                      },
                    ),
                  }}
                ></span>
                {tCreate(
                  'octavia_load_balancer_create_floating_ip_new_price_interval',
                )}
              </OsdsText>
            </div>
          </div>
        </OsdsMessage>
      ) : (
        <OsdsMessage
          className="mt-8"
          type={ODS_MESSAGE_TYPE.warning}
          color={ODS_THEME_COLOR_INTENT.warning}
        >
          <OsdsText
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tCreate(
              'octavia_load_balancer_create_floating_ip_no_floating_ip_information',
            )}
          </OsdsText>
        </OsdsMessage>
      )}
    </>
  );
};
