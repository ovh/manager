#!/bin/bash

CLEAN=0
TYPE="patch"
TMP_RELEASE_FILE="tmpReleaseFile.txt"
REGEX='^.*Version bumped to ([0-9]+\.[0-9]+\.[0-9]+).*$'


parseArguments()
{
    while [ $# -gt 0 ]
    do
        case $1 in
        --clean)
            CLEAN=1
            ;;
        --type)
            shift
            TYPE="$1"
            ;;
        *)
            echo "Error unknown parameter $1. Exiting."
            exit 1
            ;;
        esac
        shift
    done
}

clean()
{
    if [ $CLEAN -eq 1 ]
    then
        rm -rf ./node_modules/
    fi

    # Clean bower components because it always need to be updated
    rm -rf ./components/ bower_components/
}

main()
{
    parseArguments $@
    clean

    npm install
    ./node_modules/bower/bin/bower install

    grunt --no-color release --type=$TYPE > $TMP_RELEASE_FILE
    cat $TMP_RELEASE_FILE
    TAG=$( cat $TMP_RELEASE_FILE | grep -E "$REGEX" | head -n1 | sed -r 's/'"$REGEX"'/\1/' )
    rm $TMP_RELEASE_FILE
}


main $@
