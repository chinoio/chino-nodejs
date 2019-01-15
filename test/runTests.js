/*                     *\
*        TEST OF        *
*   CHINO NODE JS SDK   *
\*                     */

const path = require("path");
const spawn = require("child_process").spawn;

// if specified, bypass clean warning
if (process.argv.length === 3 &&
    process.argv[2].toLowerCase() === "--no-warning") {
  runTest();
}
else {
  // ask user if want that test run,
  // since it's a destructive action
  console.log(
      `Test will remove everything inside your Chino environment.
      Are you sure to run it? [y|N] `
  );
  // read answer from standard input
  const stdin = process.openStdin();
  let test = false;

  stdin.addListener("data", function (data) {
    // terminate test if is not safe
    // to later delete Chino environment
    if (data.toString().trim().toLowerCase() === "y") {
      test = true;
    }
    else {
      process.exitCode = 1;
    }

    // come back to stdout
    stdin.pause();

    if (test) runTest();
  });
}

var testScriptName = "_test";

function runTest() {
  // use custom config for Windows. "win32" is returned also on 64bit versions of Windows.
  if (process.platform === "win32") {
      testScriptName += "_windows";
  }

  // set up environment
  require("./before").then(() => {


      // execute test
      const test = spawn('npm', ["run", testScriptName]);

      test.stdout.on('data', (data) => {
        console.log(`${data}`);
      });

      test.stderr.on('data', (error) => {
        console.log(`${error}`);
      });

      // after testing clean up the environment
      test.on('close', (code) => {
        require("./after");
      });
    }
  )
}
