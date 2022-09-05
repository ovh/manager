import moment from 'moment';
import { get, mapValues, keyBy, startCase } from 'lodash';
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
  isJobRunning,
  getClassFromStatus,
  datagridToIcebergFilter,
  getDataProcessingUiUrl,
};
