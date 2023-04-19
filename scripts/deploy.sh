#!/bin/bash

git checkout deploy
git fetch

if [[ $(git rev-list HEAD...origin/deploy --count) != 0 ]]; then
  echo "Local branch is behind remote branch, need to update"
  git pull

  yarn build && yarn start

else
  echo "Local branch is up to date"
fi