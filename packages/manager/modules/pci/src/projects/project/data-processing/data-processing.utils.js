import moment from 'moment';
import { get, random, mapValues, keyBy, startCase } from 'lodash';
import {
  DATA_PROCESSING_STATUS_TO_CLASS,
  DATA_PROCESSING_STATUSES,
} from './data-processing.constants';

const memoryConversions = {
  Ki: 1024 ** -1,
  Mi: 1,
  Gi: 1024,
  Ti: 1024 ** 2,
  Pi: 1024 ** 3,
  Ei: 1024 ** 4,
};

/**
 * Format a given duration in milliseconds to a hh:mm:ss string
 * @param value Duration in ms
 * @return {string} formatted string
 */
export const formatDuration = (value) => {
  const duration = moment.duration(value);
  return (
    Math.floor(duration.asHours()) +
    moment.utc(duration.asMilliseconds()).format(':mm:ss')
  );
};

/**
 * Convert Kubernetes-style memory from one unit to another
 * @param valueInMebiByte Memory to convert in MebiByte (MiB) long
 * @param unit Kubernetes-style unit to convert to (limited to biBytes units)
 * @return {string} Kubernetes-style converted value
 */
export const convertMemory = (valueInMebiByte, unit) => {
  return (valueInMebiByte / memoryConversions[unit]).toFixed(2) + unit;
};

/**
 * Build a UI friendly job object from API response
 * @param job A job object from APIv6
 * @return {{duration: number, engineParameters: {},
 *  type: string, vcores: number, ram: string, status: string}}
 */
export const summarizeSparkJob = (job) => {
  const engineParameters = mapValues(
    keyBy(job.engineParameters, 'name'),
    'value',
  );
  engineParameters.arguments = Object.prototype.hasOwnProperty.call(
    engineParameters,
    'arguments',
  )
    ? engineParameters.arguments.split(',')
    : [];
  const sparkJob = {
    ...job,
    vcores:
      parseInt(engineParameters.driver_cores, 10) +
      parseInt(engineParameters.executor_cores, 10) *
        parseInt(engineParameters.executor_num, 10),
    ram: convertMemory(
      parseInt(engineParameters.driver_memory, 10) +
        parseInt(engineParameters.executor_memory, 10) *
          parseInt(engineParameters.executor_num, 10),
      'Gi',
    ),
    type: 'Spark',
    status: startCase(job.status.toLowerCase()),
    duration: job.endDate
      ? (moment(job.endDate) - moment(job.creationDate)).valueOf()
      : 0,
    engineParameters,
  };
  return sparkJob;
};

export const summarizeJob = (job) => {
  switch (job.engine) {
    case 'spark':
      return summarizeSparkJob(job);
    default:
      return job;
  }
};

export const nameGenerator = () => {
  const adjectives = [
    'charming',
    'young',
    'left',
    'short',
    'scarce',
    'quixotic',
    'halting',
    'silly',
    'laughable',
    'severe',
    'talented',
    'wrathful',
    'striped',
    'narrow',
    'quick',
    'dramatic',
    'overjoyed',
    'distinct',
    'impolite',
    'acid',
    'practical',
    'fretful',
    'savory',
    'cloudy',
    'fuzzy',
    'fresh',
    'informal',
    'yummy',
    'familiar',
    'breezy',
    'nine',
    'steady',
    'rich',
    'curved',
    'momentous',
    'calm',
    'nimble',
    'healthy',
    'wandering',
    'eatable',
    'nappy',
    'grubby',
    'tedious',
    'pumped',
    'cute',
    'splendid',
    'natural',
    'gainful',
    'curly',
    'decorous',
    'clear',
    'placid',
    'ambitious',
    'sincere',
    'majestic',
    'cautious',
    'fragile',
    'fast',
    'telling',
    'marked',
    'adorable',
    'shocking',
    'hulking',
    'lucky',
    'gleaming',
    'public',
    'tan',
  ];
  const names = [
    'peebles',
    'mayor',
    'queloz',
    'ashkin',
    'mourou',
    'strickland',
    'weiss',
    'barish',
    'thorne',
    'thouless',
    'haldane',
    'kosterlitz',
    'kajita',
    'mcdonald',
    'akasaki',
    'amano',
    'nakamura',
    'englert',
    'higgs',
    'haroche',
    'wineland',
    'perlmutter',
    'schmidt',
    'riess',
    'geim',
    'novoselov',
    'kao',
    'boyle',
    'smith',
    'nambu',
    'kobayashi',
    'maskawa',
    'fert',
    'grunberg',
    'mather',
    'smoot',
    'glauber',
    'hall',
    'hansch',
    'gross',
    'politzer',
    'wilczek',
    'abrikosov',
    'ginzburg',
    'leggett',
    'davis-jr',
    'koshiba',
    'giacconi',
    'cornell',
    'ketterle',
    'wieman',
    'alferov',
    'kroemer',
    'kilby',
    't-hooft',
    'veltman',
    'laughlin',
    'störmer',
    'tsui',
    'chu',
    'cohen-tannoudji',
    'phillips',
    'lee',
    'osheroff',
    'richardson',
    'perl',
    'reines',
    'brockhouse',
    'shull',
    'hulse',
    'taylor-jr',
    'charpak',
    'de-gennes',
    'friedman',
    'kendall',
    'taylor',
    'ramsey',
    'dehmelt',
    'paul',
    'lederman',
    'schwartz',
    'steinberger',
    'bednorz',
    'muller',
    'ruska',
    'binnig',
    'rohrer',
    'von-klitzing',
    'rubbia',
    'van-der-meer',
    'chandrasekhar',
    'fowler',
    'wilson',
    'bloembergen',
    'schawlow',
    'siegbahn',
    'cronin',
    'fitch',
    'glashow',
    'salam',
    'weinberg',
    'kapitsa',
    'penzias',
    'wilson',
    'anderson',
    'mott',
    'van-vleck',
    'richter',
    'ting',
    'bohr',
    'mottelson',
    'rainwater',
    'ryle',
    'klaba',
    'hewish',
    'esaki',
    'giaever',
    'josephson',
    'bardeen',
    'cooper',
    'schrieffer',
    'gabor',
    'alfven',
    'neel',
    'gell-mann',
    'alvarez',
    'bethe',
    'kastler',
    'tomonaga',
    'schwinger',
    'feynman',
    'townes',
    'basov',
    'prokhorov',
    'wigner',
    'goeppert-mayer',
    'jensen',
    'landau',
    'hofstadter',
    'mossbauer',
    'glaser',
    'segre',
    'chamberlain',
    'cherenkov',
    'tamm',
    'frank',
    'yang',
    'lee',
    'shockley',
    'bardeen',
    'brattain',
    'lamb',
    'kusch',
    'born',
    'bothe',
    'zernike',
    'bloch',
    'purcell',
    'cockcroft',
    'walton',
    'powell',
    'yukawa',
    'blackett',
    'appleton',
    'bridgman',
    'pauli',
    'rabi',
    'stern',
    'lawrence',
    'fermi',
    'davisson',
    'thomson',
    'hess',
    'anderson',
    'chadwick',
    'schrodinger',
    'dirac',
    'heisenberg',
    'raman',
    'de-broglie',
    'richardson',
    'compton',
    'wilson',
    'perrin',
    'franck',
    'hertz',
    'siegbahn',
    'millikan',
    'bohr',
    'einstein',
    'guillaume',
    'stark',
    'planck',
    'barkla',
    'bragg',
    'von-laue',
    'kamerlingh-onnes',
    'dalen',
    'wien',
    'van-der-waals',
    'marconi',
    'braun',
    'lippmann',
    'michelson',
    'thomson',
    'lenard',
    'rayleigh',
    'becquerel',
    'curie',
    'lorentz',
    'zeeman',
    'rontgen',
    'alexander',
    'blagg',
    'burbidge',
    'burnell',
    'cannon',
    'connes',
    'cook',
    'couper',
    'crisp',
    'crooker',
    'faber',
    'feynman',
    'gay',
    'gaze',
    'hansen',
    'haynes',
    'kaltenegger',
    'klumpke',
    'leavitt',
    'leland',
    'natarajan',
    'porco',
    'rubin',
    'sitterly',
    'tarter',
    'tinsley',
    'ayrton',
    'borg',
    'cartwright',
    'chessell',
    'daubechies',
    'estrin',
    'faddeeva',
    'goldwasser',
    'boyd',
    'camero',
    'grosz',
    'koss',
    'kra',
    'hamilton',
    'hardcastle',
    'hirschberg',
    'holberton',
    'hopper',
    'kahn',
    'keldysh',
    'kwiatkowska',
    'lehr',
    'lemone',
    'liskov',
    'millington',
    'narlikar',
    'northcutt',
    'peter',
    'jones',
    'vaughan',
    'wrinch',
    'wing',
    'mirzakhani',
    'uhlenbeck',
  ];
  const left = adjectives[random(adjectives.length - 1)];
  const right = names[random(names.length - 1)];
  return `${left}-${right}`;
};

/**
 * Determine whether job is in a running state (opposed to a final state)
 * @param job {*} Job to check
 * @return {boolean} true if job is in a running state
 */
export const isJobRunning = (job) =>
  [
    DATA_PROCESSING_STATUSES.PENDING,
    DATA_PROCESSING_STATUSES.RUNNING,
    DATA_PROCESSING_STATUSES.SUBMITTED,
  ].includes(job.status);

/**
 * Determine whether notebook is in a running state (opposed to a final state)
 * @param notebook {*} Job to check
 * @return {boolean} true if notebook is in a running state
 */
export const isNotebookRunning = (notebook) =>
  [
    DATA_PROCESSING_STATUSES.PENDING,
    DATA_PROCESSING_STATUSES.RUNNING,
    DATA_PROCESSING_STATUSES.SUBMITTED,
  ].includes(notebook.status);

/**
 * Get a CSS class name from a given job status
 * @param status
 * @return {string|any}
 */
export const getClassFromStatus = (status) => {
  const normalizedStatus = status.toUpperCase();
  return get(DATA_PROCESSING_STATUS_TO_CLASS, normalizedStatus, 'error');
};

/**
 * Converts a Datagrid criteria list to Iceberg filter predicates
 * @param name
 * @param operator
 * @param value
 * @return {{name: string, value: string, operator: string}|{name: string, value: string, operator: string}}
 */
export const datagridToIcebergFilter = (name, operator, value) => {
  switch (operator) {
    case 'containsNot':
      return {
        name,
        operator: 'nlike',
        value: `*${value}*`,
      };
    case 'startsWith':
      return {
        name,
        operator: 'like',
        value: `${value}*`,
      };
    case 'endsWith':
      return {
        name,
        operator: 'like',
        value: `*${value}`,
      };
    case 'is':
      return {
        name,
        operator: 'eq',
        value,
      };
    case 'isNot':
      return {
        name,
        operator: 'neq',
        value,
      };
    default:
      return {
        name,
        operator: 'like',
        value: `*${value}*`,
      };
  }
};

/**
 * Build URL to access data processing job depending on region
 * @param region string Public cloud region
 * @param id string Id of job to retrieve UI for
 * @return {string} URL to job UI
 */
export const getDataProcessingUiUrl = (region, id) => {
  return `https://adc.${region.toLowerCase()}.dataconvergence.ovh.com/${id}`;
};

export default {
  formatDuration,
  convertMemory,
  summarizeSparkJob,
  nameGenerator,
  isJobRunning,
  getClassFromStatus,
  datagridToIcebergFilter,
  getDataProcessingUiUrl,
};
