import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
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
import { useDomains, useGenerateUrl, useMailingList } from '@/hooks';
import Loading from '@/components/Loading/Loading';
import MailingListSettings from './MailingListSettings.page';
import {
  ADD_MAILING_LIST,
  BACK_PREVIOUS_PAGE,
  EDIT_MAILING_LIST,
} from '@/tracking.constant';

export default function AddAndEditMailingList() {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['mailing-lists/form', 'common']);
  const location = useLocation();
  const { platformId, mailingListId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const goBackUrl = useGenerateUrl(mailingListId ? '../..' : '..', 'href');

  const {
    data: mailingList,
    isLoading: isLoadingMailingListDetailRequest,
  } = useMailingList({ mailingListId });

  const { data: domains, isLoading: isLoadingDomainRequest } = useDomains({
    shouldFetchAll: true,
  });

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
                    mailingListId ? EDIT_MAILING_LIST : ADD_MAILING_LIST,
                    BACK_PREVIOUS_PAGE,
                  ],
                });
              }}
              color={ODS_LINK_COLOR.primary}
              label={t('zimbra_mailinglist_add_cta_back')}
            />
            <Subtitle>
              {mailingListId
                ? t('common:edit_mailing_list')
                : t('common:add_mailing_list')}
            </Subtitle>
          </div>
          <MailingListSettings
            domains={domains}
            editMailingListDetail={mailingList}
          />
        </>
      )}
    </>
  );
}
