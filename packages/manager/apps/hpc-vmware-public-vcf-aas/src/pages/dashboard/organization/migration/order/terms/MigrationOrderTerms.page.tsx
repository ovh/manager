import { Suspense } from 'react';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import MigrationOrderTermsModal from './_components/MigrationOrderTermsModal.component';
import { MigrationOrderTermsContext } from '../_components/MigrationOrderContent.component';

/**
 * Contracts/terms step. Without a prepared cart (e.g. a deep-link before a valid
 * CIDR was submitted) it resolves back to the order page.
 */
export default function MigrationOrderTermsPage() {
  const navigate = useNavigate();
  const {
    prepared,
    isSubmitting,
    isError,
    onConfirm,
    clearPrepared,
  } = useOutletContext<MigrationOrderTermsContext>();

  if (!prepared) {
    return <Navigate to=".." replace />;
  }

  const onClose = () => {
    if (isSubmitting) return;
    clearPrepared();
    navigate('..');
  };

  return (
    <Suspense>
      <MigrationOrderTermsModal
        contracts={prepared.contractList}
        isSubmitting={isSubmitting}
        isError={isError}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    </Suspense>
  );
}
