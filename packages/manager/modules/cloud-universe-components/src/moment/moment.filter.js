import moment from 'moment';

export default () => (value, format) => moment(value).format(format);
