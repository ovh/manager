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
    // TODO: fix token fetching from specific api
    authorization:
      'Bearer eyJhbGciOiJFZERTQSIsImtpZCI6IkVGNThFMkUxMTFBODNCREFEMDE4OUUzMzZERTk3MDhFNjRDMDA4MDEiLCJraW5kIjoib2F1dGgyIiwidHlwIjoiSldUIn0.eyJBY2Nlc3NUb2tlbiI6ImVhZWYxODRlMTQ5NjYxYjY3NGE5MThjMWNkNGMwMjM2NGQxMzhlY2E0NmU2NjA0OGI0ZTU3MDI4NDc0ZDA5NjciLCJpYXQiOjE3NjU0NjMzNDV9.8iXVuankanWjcqcbUPctpgPDc19Kkr_3-IIWM11dLlkPtaRSc6cZvGAjgd28fg7bIQifIWMJC20slRxTy7YxBA',
  },
};
