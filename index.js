#!/usr/bin/env node

/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

require('shelljs/global')
require('colors')

const path = require('path')
const ora = require('ora')
const download = require('download')

const pkg = require('./package.json')
const version = pkg.version

const fog = require('commander')

const boilerplates = {
    static () {
        let repo = 'https://github.com/enlore/fog-static'
        let url = 'https://github.com/enlore/fog-static/archive/master.zip'

        let spinner = ora('fetching...')

        spinner.start()
        mkdir('.tmp')

        // mkdir .tmp
        // download and extract into .tmp
        // cp -r .tmp/fog-static-master/* ./
        download(url, path.resolve(process.cwd(), '.tmp'), { extract: true })
            .then(() => {
                spinner.text = 'setting things up...'
                mv('.tmp/fog-static-master/*', './')
                rm('-r', '.tmp')
                spinner.stop()
                console.info('\nOk, fix up the package.json file with your project name and run'.cyan)
                console.info('\n\t yarn|npm install')
                console.info('\n and you\'ll be good to go')
                console.info('\ndone!'.green)
            })
            .catch(err => {
                spinner.stop()
                console.error('\nsomething broke!'.red)
                console.error(err)
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
