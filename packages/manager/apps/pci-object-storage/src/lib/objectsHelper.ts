import { ObjectsWithDate } from '@/pages/object-storage/storage/swiftId/objects/_components/SwiftObjectListTable.component';
import storages from '@/types/Storages';

export function createObjectWithDate(objects: storages.ContainerObject[]) {
  const objectsWithDate: ObjectsWithDate[] = objects.map((object) => ({
    ...object,
    lastModifiedDate: new Date(object.lastModified),
  }));
  return objectsWithDate;
}
