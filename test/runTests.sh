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
    result=$?

    # clean the environment
    node test/after.js

    return ${result}
}

# check if user is aware of what test
# will do on its Chino environment
if [[ $# -eq 1 && $1 = "--no-warning" ]]
then
    runTests
else
    echo "Test will clean up your Chino environment."
    echo "Run it only when there is nothing inside."
    echo "Do you want to run it anyway? [y|N]"

    read run

    if [[ $run = "y" || $run = "Y" ]]
    then
        # clean up environment before start testing
        node test/after.js
        # start testing
        runTests
    else
        exit 1
    fi
fi