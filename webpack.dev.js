const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const insertStringAfter = require('insert-string-after')

let pluginName = process.env.PLUGIN

if (!pluginName) {
    process.exit(1)
}

const [ htmlPath, cssPath, jsPath, jsonPath ] = [
    path.resolve(__dirname, `./visual-plugins/${pluginName}/${pluginName}.html`),
    `./${pluginName}/${pluginName}.css`,
    `./${pluginName}/${pluginName}.js`,
    path.resolve(__dirname, `./visual-plugins/${pluginName}/${pluginName}.json`),
]

function getHtmlContet () {
    return fs.readFileSync(htmlPath, { encoding: 'utf-8' })
}

function getExtraLibs () {
    const configJson = fs.readFileSync(jsonPath, { encoding: 'utf-8' })
    const { libs } = JSON.parse(configJson)
    return libs
}

let isAdd = true
const flag = '\n'
function triggerHTMLUpdate () {
    const targetHtml = path.resolve(__dirname, './visual-plugins/index.html')
    let content = fs.readFileSync(targetHtml, { encoding: 'utf-8' })
    if (isAdd) {
        content += flag
        isAdd = false
    } else {
        content = content.replace(flag, '')
        isAdd = true
    }
    fs.writeFileSync(targetHtml, content, { encoding: 'utf-8' })
}

function watchFile (path) {
    fs.watch(path, (_, fileName) => {
        if (fileName) {
            triggerHTMLUpdate()
        }
    })
}

watchFile(htmlPath)
watchFile(jsonPath)

const INJECT_HOOKS = '__inject_hooks__'

class InjectHtmlContent {
    constructor (getHtmlContet) {
        this.getHtmlContet = getHtmlContet
    }

    apply (compiler) {
        compiler.hooks.compilation.tap(INJECT_HOOKS, (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(INJECT_HOOKS, (data) => {
                // 动态插入 html 和 js
                const scripts = getExtraLibs().map(lib => `<script src="${lib}"></script>`).join('')
                data.html = insertStringAfter.default(data.html, '<body>', this.getHtmlContet() + scripts)
            })
        })
    }
}

module.exports = {
    entry: [ './visual-plugins/index.js' ],

    mode: 'development',

    plugins: [
        new HtmlWebpackPlugin({
            title: pluginName,
            plugin: pluginName,
            template: './visual-plugins/index.html',
            css: cssPath,
            js: jsPath,
            inject: true,
        }),
        new InjectHtmlContent(getHtmlContet),
    ],

    devServer: {
        host: '127.0.0.1',
        port: 3667,
        historyApiFallback: true,
        client: {
            logging: 'none',
            overlay: {
                warnings: false,
                errors: true,
            },
            progress: true,
        },
        hot: true,
        watchFiles: [ './visual-plugins/**/*' ],
        static: {
            directory: './visual-plugins',
        },
    },
}
