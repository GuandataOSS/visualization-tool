import fs from 'fs'

const pluginName = process.argv[2]
if (!pluginName) {
    process.exit(1)
}
const distVisualPluginsPath = `./visual-plugins/${pluginName}`
if (fs.existsSync(distVisualPluginsPath)) {
    console.log('文件夹已存在，不重复创建')
} else {
    const css = `#container {
    width: 100%;
    height: 100%;
    overflow: auto;
    font-size: 12px;
    color: #343d50;
}

#container .vt {
    vertical-align: top;
}

#container table {
    border-collapse: collapse;
    border-color: #E4E7F0;
}

#container table th {
    padding: 4px 0;
}

#container table td {
    min-width: 120px;
    padding: 4px 0;
    text-align: center;
}
`
    const html = `<div id="container"></div>`
    const js = `function renderChart (data, clickFunc, config) {
    /* ------ Custom Code Start ------ */
    function generateTable (singleData, index) {
        if (!singleData || !singleData.length) {
            return ''
        }
        var colors = config.colors
        var len = singleData.length
        var thead = '<thead><th colspan=' + len + '>视图' + (index + 1) + '</th></thead>'
        var rowHead = ''
        var tbody = ''
        for (var i = 0; i < len; i++) {
            var header = '<td>' + singleData[i].name + '</td>'
            rowHead = rowHead + header
        }
        tbody += '<tr>' + rowHead + '</tr>'
        var firstData = singleData[0].data
        var firstDataLen = firstData.length
        for (var j = 0; j < firstDataLen; j++) {
            var dataRow = []
            for (var k = 0; k < len; k++) {
                var color = colors[j % colors.length]
                var row = '<td style="color:' + color + '">' + singleData[k].data[j] + '</td>'
                dataRow.push(row)
            }
            tbody += '<tr>' + dataRow.join('') + '</tr>'
        }
        return '<table border="1">' + thead + '<tbody>' + tbody + '</tbody></table>'
    }
    if (!data) return
    var dataLen = data.length
    var tdTable = ''
    for (var m = 0; m < dataLen; m++) {
        var table = generateTable(data[m], m)
        tdTable += '<td class="vt">' + table + '</td>'
    }
    var allTable = '<table><tr>' + tdTable + '</tr></table>'
    var el = document.getElementById('container')
    el.innerHTML = allTable
    /* ------ Custom Code End ------ */
}
new GDPlugin().init(renderChart)
`
    const json = `{
    "name": "",
    "version": "0.0.1",
    "author": "",
    "description": "",
    "subType": "PLUGIN",
    "libs": []
}
`
    fs.mkdirSync(`./visual-plugins/${pluginName}`)
    const result = {css, html, js, json}
    Object.keys(result).forEach(suffix => {
       fs.writeFileSync(`./visual-plugins/${pluginName}/${pluginName}.${suffix}`, result[suffix])
    })
}
