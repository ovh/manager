export const getFileSystemMountPath = (accessPath) =>
  `sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=3,tcp ${accessPath} /media/nfs01`;

export const saveMountPath = (accessPath) =>
  `${accessPath} /media/nfs01 nfs defaults user _netdev bg`;

export default {
  getFileSystemMountPath,
  saveMountPath,
};
