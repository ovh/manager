angular.module('App').constant('HOSTING_MODULE', {
  database: {
    password: {
      minLength: 8,
      maxLength: 31,
    },
  },
  admin: {
    password: {
      minLength: 8,
      maxLength: 30,
    },
  },
});
