import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Context from '@/context';
import { Guide } from '@/constants';

import './guide-card.styles.scss';

const GuideCard = ({ id, link }: Guide) => {
  const { t } = useTranslation('restricted');
  const { locale } = useContext(Context);
  const translationPrefix = `restricted_guide_card_${id}`;
  return (
    <a
      className="guide-card py-2 oui-tile d-flex flex-column align-items-start p-3"
      target="_blank"
      rel="noreferrer noopener"
      href={link[locale] ?? link.default}
    >
      <h5 className="guide-title">{t('restricted_guide_card_title')}</h5>
      <h3 className="font-weight-bold">{t(`${translationPrefix}_title`)}</h3>
      <div className="oui-tile__body mt-3">
        <p className="oui-tile__description font-weight-normal">
          {t(`${translationPrefix}_description`)}
        </p>
        <span className="oui-link oui-link_icon">
          <span>{t('restricted_guide_card_more')}</span>
          <span
            className="oui-icon oui-icon-external-link oui-color-p-600"
            aria-hidden="true"
          ></span>
        </span>
      </div>
    </a>
  );
};

export default GuideCard;
