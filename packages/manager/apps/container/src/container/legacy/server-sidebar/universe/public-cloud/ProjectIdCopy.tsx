import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import style from './pci-sidebar.module.scss';

type Props = {
  id: string;
  projectId: string;
  altStyle?: boolean;
};

export default function ProjectIdCopy({ id, projectId, altStyle }: Props) {
  const [copyDone, setCopyDone] = useState(false);
  const { t } = useTranslation('pci-sidebar');

  const onCopyProjectId = useCallback(() => {
    navigator.clipboard.writeText(projectId);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 5000);
  }, [projectId]);

  return (
    <>
     <button
        id={id}
        type="button"
        className={`d-flex m-2 ${style.projectId} ${
          altStyle ? style.whiteText : ''
        }`}
        onClick={onCopyProjectId}
        style={{ backgroundColor: 'transparent', border:"none" }}
      >
        <span>{projectId}</span>
        <span className="oui-icon oui-icon-copy px-1 mx-1  ml-auto"></span>
      </button>
      <Tooltip
        anchorId={id}
        content={
          copyDone
            ? t('sidebar_pci_project_id_copied')
            : t('sidebar_pci_project_id_copy')
        }
        place="top"
        style={{
          backgroundColor: 'white',
          color: '#4d5592',
          opacity: 1,
          boxShadow: '0px 0px 1rem rgba(0, 0, 0, 0.25)',
          zIndex: 99999,
        }}
      />
    </>
  );
}
