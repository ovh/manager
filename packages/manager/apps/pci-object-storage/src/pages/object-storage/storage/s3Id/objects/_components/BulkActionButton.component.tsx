import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@datatr-ux/uxlib';
import { Trash } from 'lucide-react';
import { useObjectSelection } from '../_contexts/ObjectSelection.context';

interface BulkActionButtonProps {
  className?: string;
}

export function BulkActionButton({ className }: BulkActionButtonProps) {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCount } = useObjectSelection();

  const handleBulkDelete = () => {
    navigate(`./bulk-delete${location.search}`);
  };

  if (selectedCount === 0) return null;

  return (
    <Button
      data-testid="bulk-delete-button"
      mode="outline"
      variant="critical"
      className={className}
      onClick={handleBulkDelete}
    >
      <Trash className="size-6" />
      {t('bulkDeleteButtonConfirm', { count: selectedCount })}
    </Button>
  );
}
