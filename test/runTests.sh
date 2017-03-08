#! /bin/bash
# =================== #
#       TEST OF       #
#  CHINO NODE JS SDK  #
# =================== #

function runTests {
    # set up the environment
    node test/before.js

    # execute tests
    npm run _test

    # clean the environment
    node test/after.js
}

# check if user is aware of what test
# will do on its Chino environment
if [[ $# -eq 1 && $1 = "--no-warning" ]]
then
    runTests
else
    echo "Test will remove everything inside your Chino environment."
    echo "Do you want to run it anyway? [y|N]"

    read run

    if [[ $run = "y" || $run = "Y" ]]
    then
        runTests
    else
        exit 1
    fi
fi