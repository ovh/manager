import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Message, MESSAGE_COLOR } from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { EOL_LV1_LV2_SERVICES_LINK_INFO } from '@/constants/nasha.constants';

interface EolBannerProps {
  serviceName: string;
}

export const EolBanner: React.FC<EolBannerProps> = ({ serviceName }) => {
  const { t } = useTranslation('components');
  const { environment } = useContext(ShellContext);

  const ovhSubsidiary = environment?.getUser?.()?.ovhSubsidiary || 'DEFAULT';
  const eolLink =
    EOL_LV1_LV2_SERVICES_LINK_INFO[ovhSubsidiary] ||
    EOL_LV1_LV2_SERVICES_LINK_INFO.DEFAULT;

  return (
    <Message color={MESSAGE_COLOR.warning} dismissible className="mb-4">
      <p>
        {t('nasha_components_eol_lv1_lv2_services_banner_description_part_1', {
          serviceName,
        })}
      </p>
      <p>
        {t('nasha_components_eol_lv1_lv2_services_banner_description_part_2')}
      </p>
      <p className="m-0">
        <Link href={eolLink} target="_blank" rel="noopener">
          {t('nasha_components_eol_lv1_lv2_services_banner_info_link')}
        </Link>
      </p>
    </Message>
  );
};

export default EolBanner;

