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
      legend: {
        position: 'bottom',
        display: true,
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      tooltips: {
        mode: 'label',
        intersect: false,
      },
      scales: {
        yAxes: [
          {
            display: true,
            position: 'left',
            scaleLabel: {
              display: true,
            },
            gridLines: {
              drawBorder: true,
              display: false,
            },
          },
        ],
        xAxes: [
          {
            type: 'time',
            position: 'bottom',
            gridLines: {
              drawBorder: true,
              display: false,
            },
          },
        ],
      },
    },
  },
};

export const NODES_PER_ROW = 4;
export const MAX_IPS_DISPLAY = 3;
export const CERTIFICATE_FILENAME = 'ca.pem';

export default {
  DATABASE_TYPES,
  SHELL_NAMES,
  METRICS_TIME_RANGES,
  CHART_METRICS_OPTIONS,
  NODES_PER_ROW,
  SECRET_TYPE,
  ENGINE_LOGOS,
  CERTIFICATE_FILENAME,
};
