#!/usr/bin/env node

/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
/* globals ls:true, mv:true, mkdir:true, rm:true */
'use strict'

require('shelljs/global')
require('colors')

const path = require('path')
const ora = require('ora')
const inquirer = require('inquirer')
const download = require('download')

const pkg = require('./package.json')
const version = pkg.version

const fog = require('commander')
const info = console.info.bind(console, '~~~ fog >'.grey)

const common = {
    normalize: 'https://necolas.github.io/normalize.css/latest/normalize.css',
    skeleton: {
        grid: 'https://raw.githubusercontent.com/skeleton-framework/skeleton-framework/combo-bones/bones/grid.css'
    },
    milligram: {
        all: '',
        grid: ''
    }
}

const boilerplates = {
    static (dir) {
        let repo = 'https://github.com/enlore/fog-static'
        let url = 'https://github.com/enlore/fog-static/archive/master.zip'

        console.log()
        info('you want to fire up a static site, ok, no prob'.cyan)
        console.log()

        get(url, dir)
            .then(() => {
                info('ok, you\'re good to go. code a website now, pls'.green)
            })
    },

    'vue-rollup' (dir) {
        let repo = 'https://github.com/enlore/fog-vue-rollup'
        let url = `${repo}/archive/master.zip`

        info('\nok, let\'s do a straightforward rig with rollup, pug, and scss/sass\n')

        get(url, dir)
            .then(_ => {
                info('ok, project is ready for you to fetch and build')
                info('thank you for using the fog cli'.cyan)
            })
    },

    'electron-vue-rollup' (dir) {
        let repo = 'https://github.com/enlore/fog-tools-electron-vue-rollup'
        let url = `${repo}/archive/master.zip`

        info('\ndoing an electron boilerplate with vue, rollup, pug, scss/sass\n')

        get(url, dir)
            .then(_ => {
                info('ok, project is ready for you to fetch and build')
                info('thank you for using the fog cli ;D'.cyan)
            })
    }
}

fog.version(version)
    .command('init <project-type> [dir]')
    .description('download boilerplate of given <project-type> into optional [dir], otherwise deploys into current working dir')
    .action((type, dir, opts) => {
        info('oh hey'.cyan)

        if (! boilerplates[type]) {
            console.error(`\nI don't know about a boilerplate of type '${type}'`.red)
            info(`\nI know about these boilerplates:\n  - ${Object.keys(boilerplates).join("\n  - ")}`.cyan)

        } else {
            if (dir === void 0)
                dir = process.cwd()
            else if (typeof dir === 'object') {
                opts = dir
                dir = process.cwd()
            }

            boilerplates[type](dir)
        }
    })

fog.parse(process.argv)

function get (url, dir) {
    let spinner = ora('fetching...')
    spinner.start()

    let tmpDir = path.resolve(dir, '.tmp')
    mkdir('-p', tmpDir)

    return download(url, tmpDir, { extract: true })
        .then(() => {
            spinner.stop()

            info('archive fetched and extracted'.cyan)

            let archiveDirName = ls(tmpDir).pop()
            let archivePath = path.resolve(tmpDir, archiveDirName)

            mv(`${archivePath}/*`, dir)
            rm('-r', tmpDir)

            //info('pick common libs')

            inquirer.prompt([
                {
                    type: 'checkbox',
                    message: 'Pick some useful libs',
                    name: 'libs',
                    choices: [
                        new inquirer.Separator('## Utility libs'),
                        { name: 'normalize css', value: 'normalize', checked: true },

                        new inquirer.Separator('## CSS layout/framework libs'),
                        { name: 'skeleton css (grid only)', value: 'skeleton.grid' },
                        { name: 'milligram css', value: 'millgram.all' },

                        new inquirer.Separator('## JS/behavior libs'),
                        { name: 'vue.js', value: 'vue' },
                        { name: 'jquery', value: 'jquery' }
                    ]
                }
            ]).then(answers => {
                console.log(answers)
            })

            spinner.text = 'fetching normalize'
            spinner.start()

            download(common.normalize, path.join(dir, 'public', 'css'))
            .then(() => {
                spinner.text = 'fetching skeleton grid'
                return download(common.skeleton.grid, path.join(dir, 'public', 'css'))
            })
            .then(() => {
                spinner.stop()

                info('project dir setup complete\n'.cyan)

                info('ok, fix up the package.json file with your project name or whatever'.cyan)

                info('then run'.cyan, 'yarn install'.blue, 'or'.cyan, 'npm install'.blue)
                info('finally run'.cyan, 'yarn run dev'.blue, 'or'.cyan, 'npm run dev\n'.blue)

                info('recommended next steps:'.cyan, 'use the firebase-cli tools to deploy\n'.blue)
            })
        })
        .catch(err => {
            spinner.stop()
            console.error('\nsomething broke!'.red)
            console.error(err)
        })
}
