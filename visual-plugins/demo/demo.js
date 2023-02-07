const themeEl = document.querySelector('#themeColors')
const optionEl = document.querySelector('#customOptions')

function renderChart (data, clickFunc, config) {
    /* ------ Custom Code Start ------ */
    if (config) {
        const { colors, customOptions = {} } = config
        if (colors.length > 0) {
            const colorsHTML = colors.map(c => `<div class="colorRect" style="background: ${c}"></div>`).join('\n')
            themeEl.innerHTML = colorsHTML
        } else {
            themeEl.innerHTML = '图表属性中的colors为空'
        }
        const jsonStr = JSON.stringify(customOptions, null, '    ')
        const lineNum = jsonStr.split('\n').length
        optionEl.innerHTML = jsonStr
        optionEl.style.height = `${lineNum * 16}px`
    }
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