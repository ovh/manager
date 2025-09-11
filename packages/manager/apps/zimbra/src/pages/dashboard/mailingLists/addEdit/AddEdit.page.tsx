import React from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';

import { IconLinkAlignmentType, LinkType, Links, Subtitle } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useGenerateUrl } from '@/hooks';
import { ADD_MAILING_LIST, BACK_PREVIOUS_PAGE, EDIT_MAILING_LIST } from '@/tracking.constants';

import MailingListForm from '../MailingListForm.component';

export const AddEditMailingList = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['mailing-lists/form', 'common']);
  const { mailingListId } = useParams();
  const goBackUrl = useGenerateUrl(mailingListId ? '../..' : '..', 'href');

  return (
    <>
      <div className="flex flex-col items-start space-y-4 mb-5" data-testid="page-title">
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
              actions: [mailingListId ? EDIT_MAILING_LIST : ADD_MAILING_LIST, BACK_PREVIOUS_PAGE],
            });
          }}
          color={ODS_LINK_COLOR.primary}
          label={t('zimbra_mailinglist_add_cta_back')}
        />
        <Subtitle>
          {mailingListId ? t('common:edit_mailing_list') : t('common:add_mailing_list')}
        </Subtitle>
      </div>
      <MailingListForm />
    </>
  );
};

export default AddEditMailingList;
