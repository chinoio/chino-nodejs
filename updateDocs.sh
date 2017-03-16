#!/usr/bin/env bash

if [ ${TRAVIS_BRANCH} = "master" ] && [ ${TRAVIS_PULL_REQUEST} = "false" ]
then
    npm run generate_docs
    git config --global user.email "danibix95@users.noreply.github.com"
    git config --global user.name "travis-ci"
    git clone --quiet --branch=gh-pages https://${GH_TOKEN}@https://github.com/danibix95/chino-nodejs.git gh-pages
    cd gh-pages
    git rm -rf .
    cp -r ../docs/*/* .
    git add -A
    git commit -m "Documentation updated by Travis CI (build $TRAVIS_BUILD_NUMBER)"
    git push --quiet https://${GH_TOKEN}@github.com/danibix95/chino-nodejs.git gh-pages
    cd ..
fi