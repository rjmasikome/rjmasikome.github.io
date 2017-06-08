// bundle.config.js
module.exports = {
  bundle: {
    main: {
      scripts: './docs/*.js',
      styles: ['./docs/*.css']
    },
    vendor: {
      scripts: './vendor/jquery/*.js'
    }
  },
  copy: ['./img/*.{png,svg}','./fragments/*.html','./vendor/{bootstrap,font-awesome}/**/*', 'index.html', 'bundle.result.json']
};
