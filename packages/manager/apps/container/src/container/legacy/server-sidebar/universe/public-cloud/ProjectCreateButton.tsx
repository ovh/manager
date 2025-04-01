import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import style from './pci-sidebar.module.scss';

type Props = {
  onClick: CallableFunction;
  altStyle?: boolean;
};

export default function ProjectCreateButton({ onClick, altStyle }: Props) {
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');
  const { t } = useTranslation('pci-sidebar');
  const onClickCallback = useCallback(() => onClick(), [onClick]);

  return (
    <a
      className={`oui-button oui-button_primary m-2 d-block ${
        style.projectCreate
      } ${altStyle ? style.whiteButtonPrimary : ''}`}
      href={navigation.getURL('public-cloud', '#/pci/projects/new')}
      onClick={onClickCallback}
    >
      <span className="oui-icon oui-icon-add mr-2"></span>
      <span>{t('sidebar_pci_project_create')}</span>
    </a>
  );
}
