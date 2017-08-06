/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */

require('shelljs/global')
require('colors')

const path = require('path')
const download = require('download')
const inq = require('inquirer')
const ora = require('ora')

const info = console.info.bind(console, '~~~ fog >'.grey)
const warn = console.warn.bind(console, '~~~ fog x'.red)

const templates = require('./templates.json')

const fog = require('commander')
fog.parse(process.argv)

let tmpDir = path.resolve('/tmp/.fog-cli-workspace')

let outputDir = path.resolve(fog.args[1] || '.')
let outputDirContents = ls('-lA', outputDir)

if (outputDir === path.resolve(__dirname)) {
    info('using current working directory')

    if (outputDirContents.length > 0) {
        warn('current working directory not empty. blarg.')
        exit(1)
    }
} else {
    info(`attempting to output project into ${outputDir}`)

    if (outputDirContents.length > 0) {
        warn('output dir not empty. blarg.')
        exit(1)
    }
}

info('tmpDir:', tmpDir)
info('outputDir: ', outputDir)
info('options', fog.opts())

// pick from list
let template = pick(fog.args[0])

let spin

 // set up addons
spin = ora('fetching template')
spin.start()

fetch(template.repo)
    .then(() => {
        info(`fetched down ${fog.args[0]}`)
        info(`mv-ing files into ${outputDir}`)

        spin.text = 'zug zug'
        spin.start()

        mv(`${tmpDir}/*/*`, outputDir)

        spin.stop()

        spin.stop()

        return true
    })

    .then(askAddons)
    .then(addons => {
        info('selected these addons', addons)
        return
    })

    .then(() => {
        info('cleaning downloaded garbage')

        spin.text = 'zug zug'
        spin.start()

        clean(tmpDir)

        spin.stop()
    })
    .catch(err => {
        if (spin !== undefined) spin.stop()
        warn('something has gone terribly wrong')
        console.error(err)
        warn('and so i die')
        exit(1)
    })

function pick (name) {
    let t = templates[name]
    if (!t) {
        info(`No template by that name: ${name}`)
        exit(1)
    }
    else
        return t
}

function fetch (repo) {
    let url = `${repo}/archive/master.zip`

    clean(tmpDir)
    mkdir('-p', tmpDir)

    return download(url, tmpDir, { extract: true })
}

function askAddons () {
    return inq.prompt([
        {
            type: 'checkbox',
            message: 'Select addons',
            name: 'addons',
            choices: [
                { name: 'normalize.css', value: 'normalize' },
                { name: 'bulma.css', value: 'bulma' },
                { name: 'vue', value: 'vue' },
                { name: 'jquery', value: 'jquery' },
                { name: 'leaflet', value: 'leaflet' },
                { name: 'skeleton', value: 'skeleton' },
                { name: 'react', value: 'react' }
            ]
        }
    ])
}

function clean (dir) {
    rm('-rf', dir)
}

function renderTemplate () {

}

function outputTemplate () {

}
