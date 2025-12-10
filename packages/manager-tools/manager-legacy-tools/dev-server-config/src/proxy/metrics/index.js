const TARGET = 'https://metrics-for-manager.gra.technicalapis.ovh.net';

module.exports = {
  target: TARGET,
  context: ['/api/metrics'],
  changeOrigin: true,
  pathRewrite: {
    '^/api/metrics': '/m4m-single-endpoint-proxy/api/v1',
  },
  secure: false,
  logLevel: 'debug',
  cookieRewrite: true,
  headers: {
    authorization:
      'Bearer eyJhbGciOiJFZERTQSIsImtpZCI6IkVGNThFMkUxMTFBODNCREFEMDE4OUUzMzZERTk3MDhFNjRDMDA4MDEiLCJraW5kIjoib2F1dGgyIiwidHlwIjoiSldUIn0.eyJBY2Nlc3NUb2tlbiI6IjBlMGQ5NTVmZTI3YzljZDY2YTQ3YTZkYTkwMmEyYTA4ODUxZmM2ZWZmNmZjYTRiNjIyNTBkMDhmZTJmNGMzZTIiLCJpYXQiOjE3NjU0MDQwNDV9.Rs2RPEujya5pKqX2kOOigl5ykddJ4t04rWMk9SCANMy7nIGhTB_Qnw7gLzx58-WEpZjX7mf7WohpSfUkl_ObAg',
  },
};
