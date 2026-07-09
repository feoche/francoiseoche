module.exports = {
  // Serve the built output (French at /, English at /en/) so `/` resolves to a
  // real index.html. Run `npm run build` first — the `dev` script does this.
  server: {
    baseDir: './docs'
  },
  files: [
    'docs/**/*'
  ],
  watch: true,
  notify: true,
  open: true,
  ghostMode: false,
  ui: false,
  ignore: ['node_modules']
};

