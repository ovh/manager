import ASSET_APPS_DATASCIENCE from './assets/apps/datascience.png';
import ASSET_APPS_DATAIKU from './assets/apps/dataiku.png';
import ASSET_APPS_DOCKER from './assets/apps/docker.png';
import ASSET_APPS_GITLAB from './assets/apps/gitlab.png';
import ASSET_APPS_MARIADB from './assets/apps/mariadb.png';
import ASSET_APPS_MINIKUBE from './assets/apps/minikube.png';
import ASSET_APPS_NVIDIA_NGC from './assets/apps/nvidia_ngc.png';
import ASSET_APPS_OPENVPN from './assets/apps/openvpn.png';
import ASSET_APPS_PLESK from './assets/apps/plesk.png';
import ASSET_APPS_RSTUDIO from './assets/apps/rstudio.png';
import ASSET_APPS_UNKNOWN from './assets/apps/unknown.png';
import ASSET_APPS_VESTACP from './assets/apps/vestacp.png';
import ASSET_APPS_VIRTUALMIN from './assets/apps/virtualmin.png';
import ASSET_APPS_WORDPRESS from './assets/apps/wordpress.png';

import ASSET_OS_CENTOS from './assets/os/centos.png';
import ASSET_OS_COREOS from './assets/os/coreos.png';
import ASSET_OS_DEBIAN from './assets/os/debian.png';
import ASSET_OS_DOKKU from './assets/os/dokku.png';
import ASSET_OS_FEDORA from './assets/os/fedora.png';
import ASSET_OS_FREEBSD from './assets/os/freebsd.png';
import ASSET_OS_LINUX_OTHER from './assets/os/linux_other.png';
import ASSET_OS_UBUNTU from './assets/os/ubuntu.png';
import ASSET_OS_WINDOWS_OTHER from './assets/os/windows_other.png';
import ASSET_OS_WINDOWS_SERVER_2012 from './assets/os/windows_server_2012.png';
import ASSET_OS_WINDOWS_SERVER_2016 from './assets/os/windows_server_2016.png';

export const IMAGES_REGEX = {
  linux: [
    {
      name: 'ubuntu',
      regex: /^Ubuntu/i,
    },
    {
      name: 'freebsd',
      regex: /^FreeBSD/i,
    },
    {
      name: 'coreos',
      regex: /^CoreOS/i,
    },
    {
      name: 'debian',
      regex: /^Debian/i,
    },
    {
      name: 'centos',
      regex: /^Cent[\s-]?OS/i,
    },
    {
      name: 'fedora',
      regex: /^Fedora/i,
    },
    {
      name: 'dokku',
      regex: /^Dokku/i,
    },
    {
      name: 'linux',
      regex: /^(Alma|Rocky)/i,
    },
  ],
  windows: [
    {
      name: 'windows_server_2012',
      regex: /^Win[a-zA-Z\s-]+2012/i,
    },
    {
      name: 'windows_server_2016',
      regex: /^Win[a-zA-Z\s-]+2016/i,
    },
  ],
};

export const ACTIVE_STATUS = ['active'];

export const APPLICATION_TAG = 'application';

export const APPLICATION_LIST = [
  'docker',
  'plesk',
  'kubernetes',
  'swarm',
  'cozycloud',
  'wordpress',
  'prestashop',
  'lamp',
  'cassandra',
  'hadoop',
  'mongodb',
  'elasticsearch',
  'gitlab',
  'cpanel',
  'spark',
  'postgre',
  'owncloud',
  'sqlserver',
  'ansible',
  'rancheros',
  'routeros',
  'joomla',
  'drupal',
  'mariadb',
  'kafka',
  'hbase',
  'marathon',
  'mesos',
  'pfsense',
  'opensuse',
  'dcos',
  'openvpn',
  'vestacp',
  'virtualmin',
  'datascience',
  'dataiku',
  'deeplearning',
  'rstudio',
  'minikube',
  'nvidia_ngc',
];

export const IMAGE_ASSETS = {
  apps: {
    docker: ASSET_APPS_DOCKER,
    plesk: ASSET_APPS_PLESK,
    kubernetes: ASSET_APPS_UNKNOWN,
    swarm: ASSET_APPS_UNKNOWN,
    cozycloud: ASSET_APPS_UNKNOWN,
    wordpress: ASSET_APPS_WORDPRESS,
    prestashop: ASSET_APPS_UNKNOWN,
    lamp: ASSET_APPS_UNKNOWN,
    cassandra: ASSET_APPS_UNKNOWN,
    hadoop: ASSET_APPS_UNKNOWN,
    mongodb: ASSET_APPS_UNKNOWN,
    elasticsearch: ASSET_APPS_UNKNOWN,
    gitlab: ASSET_APPS_GITLAB,
    cpanel: ASSET_APPS_UNKNOWN,
    spark: ASSET_APPS_UNKNOWN,
    postgre: ASSET_APPS_UNKNOWN,
    owncloud: ASSET_APPS_UNKNOWN,
    sqlserver: ASSET_APPS_UNKNOWN,
    ansible: ASSET_APPS_UNKNOWN,
    rancheros: ASSET_APPS_UNKNOWN,
    routeros: ASSET_APPS_UNKNOWN,
    joomla: ASSET_APPS_UNKNOWN,
    drupal: ASSET_APPS_UNKNOWN,
    mariadb: ASSET_APPS_MARIADB,
    kafka: ASSET_APPS_UNKNOWN,
    hbase: ASSET_APPS_UNKNOWN,
    marathon: ASSET_APPS_UNKNOWN,
    mesos: ASSET_APPS_UNKNOWN,
    pfsense: ASSET_APPS_UNKNOWN,
    opensuse: ASSET_APPS_UNKNOWN,
    dcos: ASSET_APPS_UNKNOWN,
    openvpn: ASSET_APPS_OPENVPN,
    vestacp: ASSET_APPS_VESTACP,
    virtualmin: ASSET_APPS_VIRTUALMIN,
    datascience: ASSET_APPS_DATASCIENCE,
    dataiku: ASSET_APPS_DATAIKU,
    deeplearning: ASSET_APPS_UNKNOWN,
    rstudio: ASSET_APPS_RSTUDIO,
    minikube: ASSET_APPS_MINIKUBE,
    nvidia_ngc: ASSET_APPS_NVIDIA_NGC,
  },
  os: {
    centos: ASSET_OS_CENTOS,
    coreos: ASSET_OS_COREOS,
    debian: ASSET_OS_DEBIAN,
    dokku: ASSET_OS_DOKKU,
    fedora: ASSET_OS_FEDORA,
    freebsd: ASSET_OS_FREEBSD,
    linux: ASSET_OS_LINUX_OTHER,
    linux_other: ASSET_OS_LINUX_OTHER,
    ubuntu: ASSET_OS_UBUNTU,
    windows_other: ASSET_OS_WINDOWS_OTHER,
    windows_server_2012: ASSET_OS_WINDOWS_SERVER_2012,
    windows_server_2016: ASSET_OS_WINDOWS_SERVER_2016,
  },
};

export default {
  ACTIVE_STATUS,
  APPLICATION_TAG,
  APPLICATION_LIST,
  IMAGE_ASSETS,
  IMAGES_REGEX,
};
