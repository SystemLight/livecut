const webpack5RecommendConfig = require('@systemlight/webpack-config')

module.exports = (env, argv) => webpack5RecommendConfig
  .newLibrary(env, argv, 'LiveCut', (options) => {
    options[0].enableResolveCss = false
    options[0].enableResolveAsset = false
  })
  .build()
  .toConfig()
