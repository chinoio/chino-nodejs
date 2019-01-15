@ECHO OFF
SETLOCAL

SET mode=%1

IF "%mode%" NEQ "--no-warning" (
    echo Test will clean up everything in your Chino.io account.
    echo Run it only when there is nothing important inside.
    SET /p confirm="Do you want to run it anyway? [y/N] "
) ELSE (
    SET confirm="y"
)

IF "%confirm%" == "y" (
    GOTO :cleanupAndRun
) ELSE IF "%confirm%" == "Y" (
    GOTO :cleanupAndRun
)

ENDLOCAL

GOTO :return 0



:cleanupAndRun
:: clean up environment before start testing
echo Cleanin' up...
node test/after.js

echo Starting tests...

GOTO :runTest



:runTest
:: set up the environment
node test/before.js

:: execute tests
npm run _test

:: clean the environment
node test/after.js

GOTO :return 0



:return
SET retval=%1

EXIT /B %retval%