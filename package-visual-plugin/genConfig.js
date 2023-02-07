import fs from 'fs'

const pluginName = process.argv[2]
if (!pluginName) {
    process.exit(1)
}

const distVisualPluginsPath = `./old-visual-plugins/${pluginName}.json`

fs.access(distVisualPluginsPath, (err) => {
  if (!err) {
     const distPlugin = fs.readFileSync(distVisualPluginsPath).toString()
     const distPluginObj = JSON.parse(distPlugin)
     const config = JSON.parse(distPluginObj.config)
     const suffixConfig = {
         'script': 'js'
     }
     const dirPath =   `./visual-plugins/${pluginName}`
     if (!fs.existsSync(dirPath)) {
        console.info(`====> visual-plugins 目录中不存在 ${pluginName}, 将进行创建`)
        fs.mkdirSync(dirPath)
     }
     // 单独生成文件系列
     Object.keys(config).filter(key => ['script', 'css', 'html', 'logo'].includes(key)).forEach((key) => {
         const suffix = suffixConfig[key] || key
         switch (key) {
             case 'script':
             case 'css':
             case 'html':
                 fs.writeFileSync(`./visual-plugins/${pluginName}/${pluginName}.${suffix}`, config[key])
                 break
             case 'logo':
                 const names = config[key].split(';')[0].split('/')
                 const base64Data = config[key].replace(/^data:image\/\w+;base64,/, "")
                 const dataBuffer = Buffer.from(base64Data, 'base64')
                 fs.writeFileSync(`./visual-plugins/${pluginName}/logo.${names[1]}`, dataBuffer)
                 break
             default:
                 break
         }
     })
     // config文件
     const commonConfig = Object.keys(config).filter(key => !['script', 'css', 'html', 'logo'].includes(key)).reduce((r, v) => {
         r[v] = config[v]
         return r;
     }, {}) 
     fs.writeFileSync(`./visual-plugins/${pluginName}/${pluginName}.json`, JSON.stringify(commonConfig))
     console.info('generate success')
  } else {
      console.error(err)
  }
})

