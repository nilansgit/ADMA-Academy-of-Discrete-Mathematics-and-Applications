export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'http://10.17.0.140/cms',
  app: {
    keys: env.array('APP_KEYS'),
  },
});
