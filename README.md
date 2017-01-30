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
