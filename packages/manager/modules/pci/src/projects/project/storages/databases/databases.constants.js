import ASSET_MONGO_DB from './assets/mongodb.png';
import ASSET_KAFKA from './assets/kafka.png';
import ASSET_MYSQL from './assets/mysql.png';
import ASSET_POSTGRE_SQL from './assets/postgresql.png';
import ASSET_REDIS from './assets/redis.png';
import ASSET_OPEN_SEARCH from './assets/opensearch.png';
import ASSET_KAFKA_MIRROR_MAKER from './assets/Kafka_MirrorMaker.png';
import ASSET_KAFKA_CONNECT from './assets/Kafka_Connect.png';
import ASSET_M3DB from './assets/m3.png';
import ASSET_CASSANDRA from './assets/Cassandra.png';
import ASSET_GRAFANA from './assets/grafana.png';
import ASSET_M3AGGREGATOR from './assets/m3aggregator.png';

export const ENGINE_LOGOS = {
  mongodb: ASSET_MONGO_DB,
  kafka: ASSET_KAFKA,
  mysql: ASSET_MYSQL,
  postgresql: ASSET_POSTGRE_SQL,
  redis: ASSET_REDIS,
  opensearch: ASSET_OPEN_SEARCH,
  kafkaMirrorMaker: ASSET_KAFKA_MIRROR_MAKER,
  kafkaConnect: ASSET_KAFKA_CONNECT,
  m3db: ASSET_M3DB,
  cassandra: ASSET_CASSANDRA,
  grafana: ASSET_GRAFANA,
  m3aggregator: ASSET_M3AGGREGATOR,
};

export const DATABASE_TYPES = {
  MONGO_DB: 'mongodb',
  MYSQL: 'mysql',
  POSTGRESQL: 'postgresql',
  REDIS: 'redis',
  KAFKA: 'kafka',
  OPEN_SEARCH: 'opensearch',
  KAFKA_MIRROR_MAKER: 'kafkaMirrorMaker',
  KAFKA_CONNECT: 'kafkaConnect',
  M3DB: 'm3db',
  CASSANDRA: 'cassandra',
  GRAFANA: 'grafana',
  M3AGGEGATOR: 'm3aggregator',
};

export const SHELL_NAMES = {
  mongodb: 'mongo',
  mysql: 'mysql',
  postgresql: 'postgresql',
  redis: 'redis',
  kafka: 'kafka',
  opensearch: 'opensearch',
  kafkaMirrorMaker: 'kafkaMirrorMaker',
  kafkaConnect: 'kafkaConnect',
  m3db: 'm3db',
  cassandra: 'cassandra',
  grafana: 'grafana',
  m3aggregator: 'm3aggregator',
};

export const SECRET_TYPE = {
  cert: {
    label: 'cert',
    filename: 'service.cert',
  },
  key: {
    label: 'key',
    filename: 'service.key',
  },
};

export const METRICS_TIME_RANGES = [
  { label_key: '1H', value: 'lastHour' },
  { label_key: '1D', value: 'lastDay' },
  { label_key: '1W', value: 'lastWeek' },
  { label_key: '1M', value: 'lastMonth' },
  { label_key: '1Y', value: 'lastYear' },
];

export const CHART_METRICS_REFRESH_INTERVAL = 60000;
export const LOGS_REFRESH_INTERVAL = 30000;
export const CURRENT_QUERIES_INTERVAL = 20000;

export const CHART_METRICS_OPTIONS = {
  chart: {
    type: 'line',
    data: {
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          display: true,
        },
        title: {
          display: true,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      elements: {
        line: {
          tension: 0.5,
        },
        point: {
          radius: 0,
        },
      },
      scales: {
        y: {
          display: true,
          position: 'left',
          title: {
            display: true,
          },
          grid: {
            drawBorder: true,
            display: false,
          },
        },
        x: {
          type: 'time',
          position: 'bottom',
          displayFormats: {
            hour: 'Pp',
          },
          grid: {
            drawBorder: true,
            display: false,
          },
        },
      },
    },
  },
};

export const NODES_PER_ROW = 4;
export const MAX_IPS_DISPLAY = 3;
export const CERTIFICATE_FILENAME = 'ca.pem';

export const SSL_MODE_REQUIRED = ['require', 'required', 'REQUIRED'];
export const SSL_MODE_NA = ['n/a'];
export const SSL_MODE_SSL_TLS = ['TLS/SSL'];

export const ENGINES_TYPES = {
  databases: {
    label: 'databases',
    engines: [
      DATABASE_TYPES.MONGO_DB,
      DATABASE_TYPES.POSTGRESQL,
      DATABASE_TYPES.MYSQL,
      DATABASE_TYPES.REDIS,
      DATABASE_TYPES.CASSANDRA,
      DATABASE_TYPES.M3DB,
      DATABASE_TYPES.M3AGGEGATOR,
    ],
  },
  'data-streaming': {
    label: 'data-streaming',
    engines: [
      DATABASE_TYPES.KAFKA,
      DATABASE_TYPES.KAFKA_CONNECT,
      DATABASE_TYPES.KAFKA_MIRROR_MAKER,
    ],
  },
  'data-analysis': {
    label: 'data-analysis',
    engines: [DATABASE_TYPES.OPEN_SEARCH, DATABASE_TYPES.GRAFANA],
  },
  all: {
    label: 'all',
    engines: [
      DATABASE_TYPES.MONGO_DB,
      DATABASE_TYPES.POSTGRESQL,
      DATABASE_TYPES.MYSQL,
      DATABASE_TYPES.REDIS,
      DATABASE_TYPES.CASSANDRA,
      DATABASE_TYPES.M3DB,
      DATABASE_TYPES.M3AGGEGATOR,
      DATABASE_TYPES.KAFKA,
      DATABASE_TYPES.KAFKA_CONNECT,
      DATABASE_TYPES.KAFKA_MIRROR_MAKER,
      DATABASE_TYPES.OPEN_SEARCH,
      DATABASE_TYPES.GRAFANA,
    ],
  },
};

export default {
  DATABASE_TYPES,
  SHELL_NAMES,
  METRICS_TIME_RANGES,
  CHART_METRICS_OPTIONS,
  NODES_PER_ROW,
  SECRET_TYPE,
  ENGINE_LOGOS,
  CERTIFICATE_FILENAME,
  SSL_MODE_REQUIRED,
  SSL_MODE_NA,
  SSL_MODE_SSL_TLS,
};
