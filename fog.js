#!/usr/bin/env node

/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
/* globals ls:true, mv:true, mkdir:true, rm:true */
'use strict'

const pkg = require('./package.json')
const version = pkg.version

const fog = require('commander')
const info = console.info.bind(console, '~~~ fog >'.grey)

fog.version(version)
    .command('init <template> [dir]', 'download boilerplate of given <template> into optional [dir], otherwise deploys into current working dir. regardless, dir must be empty.')
    .command('list', 'List known templates')

fog.parse(process.argv)
