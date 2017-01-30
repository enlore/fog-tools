#!/usr/bin/env node

/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

require('colors')

const ora = require('ora')
const download = require('download')
const unzip = require('extract-zip')

const pkg = require('./package.json')
const version = pkg.version

const fog = require('commander')

const boilerplates = {
    static () {
        let repo = 'https://github.com/enlore/fog-static'
        let url = 'https://github.com/enlore/fog-static/archive/master.zip'

        let spinner = ora('fetching...')

        spinner.start()

        download(url)
            .then(zip => {
                //spinner.stop()
                spinner.text = 'extracting...'

                unzip(zip, (err) => {
                    if (err) throw err
                    else {
                        spinner.stop()
                        console.info('done extracting')
                    }
                })
            })
            .catch(err => {
                console.error(err)
                spinner.stop()
            })
    }
}

fog.version(version.slice(1))
    .command('init [project-type]')
    .description('create boilerplate project structure of given [project-type]')
    .action((type, opts) => {

        if (! boilerplates[type]) {
            console.error(`\nI don't know about a boilerplate of type '${type}'`.red)
            console.info(`\nI know about these boilerplates:\n  - ${Object.keys(boilerplates).join("\n  - ")}`.cyan)
        } else {
            boilerplates[type]()
        }
    })


fog.parse(process.argv)
