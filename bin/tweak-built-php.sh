#!/bin/sh

# set the current directory to the directory of this file
pushd "$(dirname "$0")" >> /dev/null

../vendor/bin/phpcbf -q >> /dev/null

# Create an array of files to check (relative to this file)
files=(
	../build/mermaid.asset.php \
	../build/mermaid-init.asset.php \
	../build/index.asset.php
)

function is_gnu_sed(){
  sed --version >/dev/null 2>&1
}

function sed_i_wrapper(){
  if is_gnu_sed; then
    $(which sed) "$@"
  else
    a=()
    for b in "$@"; do
      [[ $b == '-i' ]] && a=("${a[@]}" "$b" "") || a=("${a[@]}" "$b")
    done
    $(which sed) "${a[@]}"
  fi
}

# Loop through the array of files and set `declare(strict_types=1);` at the top of each file
for file in "${files[@]}"
do
	# Check if the file exists
	if [ -f $file ]; then
		# Prepend the file with `declare(strict_types=1);`
		sed_i_wrapper -i '1s/^/<?php declare( strict_types=1 );\n/' "$file"
		# remove other '<?php' tags and any whitespace after them
		sed_i_wrapper -i '2s/^<?php[[:space:]]*//' "$file"
	else
		# If the file does not exist, output an error message
		echo "File not found: $file"
	fi
done

popd >> /dev/null
