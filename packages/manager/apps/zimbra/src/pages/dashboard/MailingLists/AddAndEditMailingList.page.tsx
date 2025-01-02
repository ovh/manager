import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  IconLinkAlignmentType,
  Links,
  LinkType,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  useDomains,
  useGenerateUrl,
  usePlatform,
  useMailingList,
} from '@/hooks';
import Loading from '@/components/Loading/Loading';
import MailingListSettings from './MailingListSettings.page';
import {
  ADD_MAILING_LIST,
  BACK_PREVIOUS_PAGE,
  EDIT_MAILING_LIST,
} from '@/tracking.constant';

export default function AddAndEditMailingList() {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('mailinglists/addAndEdit');
  const location = useLocation();
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const editMailingListId = searchParams.get('editMailingListId');
  const [isLoading, setIsLoading] = useState(true);
  const goBackUrl = useGenerateUrl('..', 'path');

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
              iconAlignment={IconLinkAlignmentType.left}
              href={goBackUrl}
              onClickReturn={() => {
                trackClick({
                  location: PageLocation.page,
                  buttonType: ButtonType.link,
                  actionType: 'navigation',
                  actions: [
                    editMailingListId ? EDIT_MAILING_LIST : ADD_MAILING_LIST,
                    BACK_PREVIOUS_PAGE,
                  ],
                });
              }}
              color={ODS_LINK_COLOR.primary}
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
