module.exports = {
  server: {
    baseDir: './'
  },
  files: [
    'index.html',
    'styles.css',
    '*.js'
  ],
  watch: true,
  notify: true,
  open: true,
  ghostMode: false,
  ui: false,
  ignore: ['node_modules']
};

