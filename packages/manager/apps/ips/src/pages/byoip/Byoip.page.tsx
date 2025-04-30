import React from 'react';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import { urls } from '@/routes/routes.constant';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { useHeader } from '@/components/Header/Header';
import { ByoipOrder } from './ByoipOrder.component';
import { ByoipContextProvider } from './Byoip.context';

export const ByoipPage: React.FC = () => {
  const { t: tByoip } = useTranslation('byoip');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const header = useHeader(tByoip('title'));

  return (
    <BaseLayout
      backLinkLabel={tCommon('back_link')}
      onClickReturn={() => navigate(urls.listing)}
      header={header}
      breadcrumb={<Breadcrumb />}
    >
      <div>
        <OdsText>{tByoip('description')}</OdsText>
      </div>
      <ByoipContextProvider>
        <ByoipOrder />
      </ByoipContextProvider>
    </BaseLayout>
  );
};

export default ByoipPage;
