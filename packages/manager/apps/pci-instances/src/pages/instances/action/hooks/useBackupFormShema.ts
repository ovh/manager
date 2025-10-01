import { useMemo } from 'react';
import { TSchemaInput, useInputSchema } from '@/input-validation';

export const useBackupFormShema = () => {
  const {
    object,
    discriminatedUnion,
    literal,
    string,
    remove,
    nullableRequired,
  } = useInputSchema();

  return useMemo(
    () =>
      discriminatedUnion('distantSnapshot', [
        object({
          snapshotName: string(),
          distantSnapshot: literal(true),
          distantRegion: nullableRequired(string()),
          distantSnapshotName: nullableRequired(string()),
        }),
        object({
          snapshotName: string(),
          distantSnapshot: literal(false),
          distantRegion: remove(string()),
          distantSnapshotName: remove(string()),
        }),
      ]).transform(
        ({
          snapshotName,
          distantSnapshot,
          distantRegion,
          distantSnapshotName,
        }) => ({
          snapshotName,
          distantSnapshot: distantSnapshot
            ? { name: distantSnapshotName, region: distantRegion }
            : undefined,
        }),
      ),
    [object, discriminatedUnion, literal, string, remove, nullableRequired],
  );
};

export type TBackupFormFieldsValues = TSchemaInput<
  ReturnType<typeof useBackupFormShema>
>;
