#!env sh

# This script updates the version numbers in the source code.
# $1 is the plugin version
# $2 is the optional mermaid version
plugin=$1
mermaid=$2

# version pattern should match digit.digit.digit(-anything)
version_pattern='[0-9]+\.[0-9]+\.[0-9]+(-?[a-zA-Z0-9]+)?'

# set the base directory up a level
pushd $(dirname $0)/.. > /dev/null

if [ -z "$plugin" ]; then
    echo "Usage: $0 <plugin version> [<mermaid version>]"
    exit 1
fi

# Update the plugin versions
# merpress.php

sed_option=""
if [ "$(uname)" == "Darwin" ]; then
    # Do something under Mac OS X platform        
    echo "Macos"
    sed_option="'' -e"
    echo $sed_option
fi
sed -i "${sed_macOS}" "s/Version: .*/Version: $plugin/" merpress.php
sed -Ei "${sed_macOS}" "s/(define\( 'MERMAID_PLUGIN_VERSION', ')$version_pattern(.*)/\1$plugin\3/" merpress.php
# readme.txt
sed -i "${sed_macOS}" "s/Stable tag: .*/Stable tag: $plugin/" README.txt
sed -Ei "${sed_macOS}"  "s/= $version_pattern =/= $plugin =/" README.txt
# package.json
sed -Ei "${sed_macOS}" "s/\"version\": \"($version_pattern)\",/\"version\": \"$plugin\",/" package.json
# src/block.json
sed -Ei "${sed_macOS}" "s/\"version\": \"($version_pattern)\",/\"version\": \"$plugin\",/" src/block.json

if [ -n "$mermaid" ]; then
    # Update the mermaid version
    # merpress.php
    sed -Ei "${sed_macOS}" "s/(define\( 'MERMAID_JS_VERSION', ')$version_pattern(.*)/\1$mermaid\3/" merpress.php
    # readme.txt
    sed -Ei "${sed_macOS}" "s/(Update mermaid to )$version_pattern/\1$mermaid/" README.txt
    sed -Ei "${sed_macOS}" "s/(Mermaid update \()$version_pattern\)/\1$mermaid)/" README.txt
fi


popd > /dev/null
