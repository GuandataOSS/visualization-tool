import fs from 'fs'
import path from 'path'
import {minify} from 'html-minifier'
import {minify as jsminify} from 'terser'
import less from 'less'

import {resultFieldTransform, imagePrefixMap, defaultConfigs} from './constant'

const argvs = process.argv
const visualPluginsPath = path.resolve(path.join(__dirname,'../'), 'visual-plugins')
const allPluginNames = fs.readdirSync(visualPluginsPath)

let pluginNames = []
if (argvs.length === 2 || argvs[2] === 'all') {
    pluginNames = allPluginNames
} else {
    const targetPluginPath = allPluginNames.find(n => n === argvs[2])
    if (targetPluginPath) pluginNames = [targetPluginPath]
}

if (pluginNames.length === 0) {
    console.error('There are no plug-ins to load')
    process.exit(1)
}

function loadSingleFile({entirefileName, pluginPath}) {
    const entireFilePath = path.resolve(pluginPath, entirefileName)
    const extension = path.extname(entireFilePath).slice(1)
    const content = fs.readFileSync(entireFilePath)

    const keyName = resultFieldTransform[extension] || extension
    const contentString = content.toString()

    return new Promise((resolve, reject) => {
        switch (extension) {
            case 'js':
                jsminify(contentString)
                    .then(res => resolve({[keyName]: res.code}))
                    .catch((e) => reject(e))
                break
            case 'css':
                less.render(contentString, {compress: true})
                    .then((res) => resolve({[keyName]: res.css}))
                    .catch((e) => reject(e))
            case 'html':
                resolve({[keyName]: minify(contentString, {removeComments: true, collapseWhitespace: true, minifyJS:true, minifyCSS:true})})
            case 'json':
                const jsonObject = Object.assign(defaultConfigs, JSON.parse(contentString))
                resolve({[keyName]: JSON.stringify(jsonObject)})
                break
            case 'png':
            case 'jpeg':
                resolve({[keyName]: `${imagePrefixMap[extension]}${new Buffer.from(content).toString('base64')}`})
                break
        }
    })
}

function loadVisualPlugin(pluginName) {
    const pluginPath = path.resolve(visualPluginsPath, pluginName)
    const entirefileNames = fs.readdirSync(pluginPath)

    return new Promise((resolve, reject) => {
        const tasks = entirefileNames.map((entirefileName) => loadSingleFile({entirefileName, pluginPath}))
        Promise.all(tasks)
        .then((result) => {
            const jsonConfig = result.find((r) => r.json) || {json: {}}
            const resultObj = result.reduce((r, v) => Object.assign(r, v))
            const content = Object.keys(resultObj)
                .filter((k) => k !== 'json')
                .reduce((r, v) => {
                    r[v] = resultObj[v]
                    return r
                }, JSON.parse(jsonConfig.json))
            resolve({pluginName, content})
        })
        .catch((e) => {
            reject(e)
        })
    })
}

function load(pluginNames) {
    const tasks = pluginNames.map(loadVisualPlugin)
    Promise.all(tasks)
    .then((res) => {
        return res.map(({pluginName, content}) => {
            if (!fs.existsSync('./dist-visual-plugins')) {
                fs.mkdirSync('./dist-visual-plugins')
            }
            // 重复生成暂时覆盖
            fs.writeFileSync(`./dist-visual-plugins/${pluginName}.json`, JSON.stringify(content))
            return pluginName
        })
    })
    .then((names) => {
        names.forEach(name => console.info(`====> build ${name} success`))
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })

}

load(pluginNames)