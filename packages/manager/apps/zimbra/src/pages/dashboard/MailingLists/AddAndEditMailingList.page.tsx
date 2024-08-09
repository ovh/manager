import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Links, LinkType, Subtitle } from '@ovh-ux/manager-react-components';
import {
  useDomains,
  useGenerateUrl,
  usePlatform,
  useMailingList,
} from '@/hooks';
import Loading from '@/components/Loading/Loading';
import MailingListSettings from './MailingListSettings.page';

export default function AddAndEditMailingList() {
  const { t } = useTranslation('mailinglists/addAndEdit');
  const location = useLocation();
  const navigate = useNavigate();
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const editMailingListId = searchParams.get('editMailingListId');
  const [isLoading, setIsLoading] = useState(true);
  const goBackUrl = useGenerateUrl('..', 'path');

  const goBack = () => {
    return navigate(goBackUrl);
  };

  const {
    data: editMailingListDetail,
    isLoading: isLoadingMailingListDetailRequest,
  } = useMailingList({ mailingListId: editMailingListId });

  const { data: domainList, isLoading: isLoadingDomainRequest } = useDomains();

  useEffect(() => {
    if (
      !isLoadingMailingListDetailRequest &&
      !isLoadingDomainRequest &&
      platformId
    ) {
      setIsLoading(false);
    }
  }, [
    isLoadingMailingListDetailRequest,
    isLoadingDomainRequest,
    location.pathname,
  ]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <div
            className="flex flex-col items-start space-y-4 mb-5"
            data-testid="page-title"
          >
            <Links
              data-testid="back-btn"
              type={LinkType.back}
              onClickReturn={goBack}
              label={t('zimbra_mailinglist_add_cta_back')}
            />
            <Subtitle>
              {!editMailingListDetail
                ? t('zimbra_mailinglist_add_title')
                : t('zimbra_mailinglist_edit_title')}
            </Subtitle>
          </div>
          <MailingListSettings
            domainList={domainList}
            editMailingListDetail={editMailingListDetail}
          />
        </>
      )}
    </>
  );
}
