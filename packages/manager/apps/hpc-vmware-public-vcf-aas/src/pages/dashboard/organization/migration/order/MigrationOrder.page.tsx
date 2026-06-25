import VcdaFeatureGuard from '@/components/vcda/VcdaFeatureGuard.component';
import MigrationOrderContent from './_components/MigrationOrderContent.component';

export default function MigrationOrderPage() {
  return (
    <VcdaFeatureGuard>
      <MigrationOrderContent />
    </VcdaFeatureGuard>
  );
}
