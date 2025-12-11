import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import { StorageClassEnum } from '@datatr-ux/ovhcloud-types/cloud/storage';

function randomFolderName() {
  return Math.random()
    .toString(36)
    .substring(2, 7);
}

// Function used to stress-test the browser component by creating lots of files and subfolders
export function generateTestObjects(
  topFolderCount = 20,
  subFoldersPerLevel = 3,
  depthLevels = 5,
  filesPerFolder = 120,
  withDeepPaths = true,
): StorageObject[] {
  const objects: StorageObject[] = [];
  const now = Date.now();
  let id = 0;

  const addFolder = (parent: string, depth: number) => {
    const prefix = parent;

    for (let f = 0; f < filesPerFolder; f += 1) {
      objects.push({
        key: `${prefix}file-${depth}-${f}.txt`,
        size: Math.floor(Math.random() * 2_000_000),
        lastModified: new Date(now - id * 10_000).toISOString(),
        isLatest: true,
        storageClass: StorageClassEnum.STANDARD,
        etag: '',
      });
      id += 1;
    }

    if (depth === depthLevels) return;

    for (let s = 0; s < subFoldersPerLevel; s += 1) {
      const slashes = '/'.repeat(1 + Math.floor(Math.random() * 3)); // weird prefix handling
      const child = `${prefix}${randomFolderName()}${slashes}`;
      addFolder(child, depth + 1);
    }
  };

  for (let i = 0; i < 200; i += 1) {
    objects.push({
      key: `root-file-${i}.txt`,
      size: Math.floor(Math.random() * 2_000_000),
      lastModified: new Date(now - i * 10_000).toISOString(),
      isLatest: true,
      storageClass: StorageClassEnum.STANDARD,
      etag: '',
    });
    id += 1;
  }

  for (let i = 0; i < topFolderCount; i += 1) {
    addFolder(`folder-${i}/`, 1);
  }

  if (withDeepPaths) {
    for (let i = 0; i < 40; i += 1) {
      objects.push({
        key: `/c/////coucou////wacky-${i}.css`,
        size: 200_000 + i,
        lastModified: new Date(now - id * 10_000).toISOString(),
        isLatest: true,
        storageClass: StorageClassEnum.STANDARD,
        etag: '',
      });
      id += 1;
    }
  }

  return objects;
}
