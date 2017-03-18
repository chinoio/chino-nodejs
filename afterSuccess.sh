#!/usr/bin/env bash

# upload code coverage report
./node_modules/.bin/nyc report --reporter=text-lcov > coverage.lcov && ./node_modules/.bin/codecov

if [ ${TRAVIS_BRANCH} = "master" ] && [ ${TRAVIS_PULL_REQUEST} = "false" ]
then
    set -e
    npm run generate_docs
    git config --global user.email "danibix95@users.noreply.github.com"
    git config --global user.name "travis-ci"
    git clone --quiet --branch=gh-pages https://github.com/danibix95/chino-nodejs.git gh-pages
    if cd gh-pages; then
        # remove files
        rm -rfd --interactive=never chino-nodejs
        # copy just generated files
        cp -r ../docs/*/*/* .
        if [ -z `git diff --exit-code` ]; then
            git add -A
            git commit -m "Documentation updated by Travis CI (build $TRAVIS_BUILD_NUMBER)"
            git push --quiet https://${GH_PAGES}@github.com/danibix95/chino-nodejs.git gh-pages
        else
            echo "No changes to docs on this push."
        fi
        cd ..
    fi
fi