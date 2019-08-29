export default () => {
  const internationalBase = 1000;
  const binaryBase = 1024;

  return {
    international: {
      base: internationalBase,
      units: [
        {
          val: 1,
          unit: 'B',
        },
        {
          val: internationalBase,
          unit: 'KB',
        },
        {
          val: internationalBase ** 2,
          unit: 'MB',
        },
        {
          val: internationalBase ** 3,
          unit: 'GB',
        },
        {
          val: internationalBase ** 4,
          unit: 'TB',
        },
        {
          val: internationalBase ** 5,
          unit: 'PB',
        },
        {
          val: internationalBase ** 6,
          unit: 'EB',
        },
        {
          val: internationalBase ** 7,
          unit: 'ZB',
        },
        {
          val: internationalBase ** 8,
          unit: 'YB',
        },
      ],
    },
    binary: {
      base: binaryBase,
      units: [
        {
          val: 1,
          unit: 'B',
        },
        {
          val: binaryBase,
          unit: 'KiB',
        },
        {
          val: binaryBase ** 2,
          unit: 'MiB',
        },
        {
          val: binaryBase ** 3,
          unit: 'GiB',
        },
        {
          val: binaryBase ** 4,
          unit: 'TiB',
        },
        {
          val: binaryBase ** 5,
          unit: 'PiB',
        },
        {
          val: binaryBase ** 6,
          unit: 'EiB',
        },
        {
          val: binaryBase ** 7,
          unit: 'ZiB',
        },
        {
          val: binaryBase ** 8,
          unit: 'YiB',
        },
      ],
    },
  };
};
