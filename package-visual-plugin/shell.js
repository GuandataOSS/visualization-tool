const shell = require('shelljs')

let pluginName = process.argv[2]

if (!pluginName) {
    process.exit(1)
}

shell.exec(`yarn vis-init ${pluginName} && PLUGIN=${pluginName} webpack serve --config webpack.dev.js`)
