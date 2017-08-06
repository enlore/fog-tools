/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

require('colors')

const info = console.info.bind(console, '~~~ fog >'.grey)
const templates = require('./templates.json')

const fog = require('commander')
fog.option('-v', '--verbose')
fog.parse(process.argv)

info('Here are the project templates that I know about:')

let keys = Object.keys(templates)

keys.sort().forEach(t => {
    info('')
    info(`${t}`.blue)
    info(`${templates[t].description || 'none given'}`)
    info('')
})
