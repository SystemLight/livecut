const path = require('path')
const fs = require('fs')

class EslintRecommendConfig {
  /**
   * https://eslint.org/docs/user-guide/configuring/
   * @param {any?} options
   */
  constructor(options) {
    let cwd = process.cwd()

    let _options = {
      cwd: cwd,
      packageJSON: require(path.join(cwd, 'package.json')),

      isTsProject: fs.existsSync(path.resolve(cwd, 'tsconfig.json'))
    }
    Object.assign(_options, options)

    this.cwd = _options.cwd

    this.isTsProject = _options.isTsProject
    this.packageJSON = _options.packageJSON
    this.dependencies = Object.keys({ // 项目依赖库数组，用于判定包含什么框架
      ...this.packageJSON['devDependencies'],
      ...this.packageJSON['dependencies']
    })

    this._config = {}
  }

  build() {
    this.buildBasic()
    this.buildParser()
    this.buildFormatter()
    this.buildPlugin()
    this.buildRules()

    return this
  }

  buildBasic() {
    this._config.root = true
    this._config.env = {
      browser: true,
      es2022: true,
      node: true
    }
    this._config.settings = {}
    this._config.extends = [
      'eslint:recommended'
    ]

    if (this.isTsProject) {
      this._config.extends.push(
        'plugin:@typescript-eslint/recommended' // @typescript-eslint/eslint-plugin
      )
    }

    if (this.isInclude('react')) {
      this._config.settings.react = {
        version: 'detect'
      }

      this._config.extends.push(
        'plugin:react/recommended', // eslint-plugin-react
        'plugin:react-hooks/recommended' // eslint-plugin-react-hooks
      )
    }

    return this
  }

  buildParser() {
    // ts解析器：https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser
    // js解析器：https://www.npmjs.com/package/@babel/eslint-parser
    if (this.isTsProject) {
      this._config.parser = '@typescript-eslint/parser'
      this._config.parserOptions = {}
    } else {
      this._config.parser = '@babel/eslint-parser'
      let presets = ['@babel/preset-env']
      let plugins = []
      if (this.isInclude('react')) {
        presets.push('@babel/preset-react')
      }
      if (this.dependencies.includes('@babel/plugin-proposal-decorators')) {
        plugins.push(
          // 装饰器属性，https://babel.dev/docs/en/babel-plugin-proposal-decorators
          [
            '@babel/plugin-proposal-decorators',
            {
              legacy: true
            }
          ]
        )
      }
      this._config.parserOptions = {
        requireConfigFile: false,
        babelOptions: {
          presets: presets,
          plugins: plugins
        }
      }
    }

    Object.assign(this._config.parserOptions, {
      sourceType: 'module',
      ecmaVersion: 2022
    })

    return this
  }

  buildFormatter() {
    return this
  }

  buildPlugin() {
    return this
  }

  buildRules() {
    this._config.rules = {}

    const commonRule = {
      'require-jsdoc': 'off',
      'no-control-regex': 'off',
      'no-invalid-this': 'off',
      'linebreak-style': 'off',
      'max-len': 'off',
      'no-unused-vars': 'off',
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'never'
      ],
      'arrow-parens': [
        'error',
        'always'
      ],
      'comma-dangle': [
        'error',
        {
          'arrays': 'never',
          'objects': 'never',
          'imports': 'never',
          'exports': 'never',
          'functions': 'never'
        }
      ],
      'indent': [
        'error',
        2,
        {
          'SwitchCase': 1
        }
      ],
      'padded-blocks': [
        'error',
        'never'
      ],
      'space-before-function-paren': [
        'error',
        {
          'asyncArrow': 'always',
          'anonymous': 'always',
          'named': 'never'
        }
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          'max': 1
        }
      ]
    }
    Object.assign(this._config.rules, commonRule)

    if (this.isTsProject) {
      const typescriptRule = {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
      Object.assign(this._config.rules, typescriptRule)
    }
    return this
  }

  isInclude(libraryName) {
    return this.dependencies.includes(libraryName)
  }

  toConfig(debug) {
    if (debug) {
      console.log(this._config)
    }
    return this._config
  }
}

module.exports = new EslintRecommendConfig().build().toConfig()
