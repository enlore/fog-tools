/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

const https = require("https")

const ora = require('ora')
require('colors')
const info = console.info.bind(console, '~~~ fog >'.grey)

const fog = require('commander')
fog.option('-v', '--verbose')
fog.parse(process.argv)

info('ok, fetching templates')
let spin = ora('fetching...')
spin.start()

https.request('https://cdn.rawgit.com/enlore/fog-tools-temlpates/75dc84cf/templates.json', res => {
  spin.stop()
  info('Here are the project templates that I know about:')

  let data = ''

  res.on('data', chunk => {
    data += chunk
  })

  res.on('error', err => console.error(err))

  res.on('end', () => {
    const templates = JSON.parse(data)

    let keys = Object.keys(templates)

    keys.sort().forEach(t => {
        info('')
        info(`${t}`.blue)
        info(`${templates[t].description || 'none given'}`)
        info('')
    })
  })
})
  .on('error', err => console.error(err))
  .end()


