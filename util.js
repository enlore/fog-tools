/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

require('colors')

module.exports = {
    info: console.info.bind(console, '~~~ fog >'.grey),
    warn: console.warn.bind(console, '~~~ fog x'.red),
    lnfd: console.warn.bind(console, '~~~ fog -'.grey)
}
