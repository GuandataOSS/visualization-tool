import data from './data'

function run () {
    const renderFunc = window.renderChart
    if (!renderFunc) return

    const clickFunc = (e) => {
        const { clickedItems } = e || {}
        if (!clickedItems) {
            throw new Error('No \`clickedItems\`.')
        }
        if (!Array.isArray(clickedItems)) {
            throw new Error('\`clickedItems\` is not an Array.')
        }
        console.log(e)
    }
    const config = {
        theme: 'LIGHT',
        colors: [
            '#2f7ed8',
            '#f28f43',
            '#1aadce',
            '#492970',
            '#f28f43',
            '#77a1e5',
            '#c42525',
            '#a6c96a',
        ],
    }

    renderFunc(data, clickFunc, config)

    window.addEventListener('resize', () => {
        renderFunc(data, clickFunc, config)
    })
}

run()
