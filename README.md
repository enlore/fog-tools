# fog.haus CLI tools

Use this to crap out a boilerplate project structure.

## CLI

    # summons the help info

    fog --help

    # type is the name of the boilerplate template
    # (currently only supports 'static')
    # optional dir will be created

    fog init <type> [dir]

    # examples

    # outputs the files and folders into the current working dir
    fog init static

    # makes a new dir called my-website and plops the files into it
    fog init static my-website

## Supported boilerplates

### `static`

Normalize, skeleton's grid system (and only that), scss, pug. Simple dir
structure expects the user to make directories in the `src/pages` dir with
`index.pug` files to add new pages. So adding a new page to the site like
`example.com/about-us` would look like `src/pages/about-us/index.pug`.

_Note_: the build proc doesn't notice when you add new pug files. You'll need
to restart it when you do the above to add a new page.
