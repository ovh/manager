import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NameSection } from '@/components/create/NameSection.component';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';

export const ClusterNameSection: FC = () => {
  const { t } = useTranslation('add');

  const nameHelpers = useMemo(
    () => [
      t('kubernetes_add_cluster_name_input_helper.introduction'),
      `- ${t('kubernetes_add_cluster_name_input_helper.char_number')}`,
      `- ${t('kubernetes_add_cluster_name_input_helper.char_whitelist')}`,
      `- ${t('kubernetes_add_cluster_name_input_helper.first_char')}`,
      `- ${t('kubernetes_add_cluster_name_input_helper.last_char')}`,
    ],
    [t],
  );

  return <NameSection<TCreateClusterSchema> fieldName="name" helperEntries={nameHelpers} />;
};
