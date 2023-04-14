#!/bin/bash

git checkout deploy
git fetch

# 2. 判断分支是否落后于远程分支
if [[ $(git rev-list HEAD...origin/deploy --count) != 0 ]]; then
  echo "Local branch is behind remote branch, need to update"
  git pull

  # 4. 执行构建
  npm run build

  # 5. 重启 PM2 进程
  pm2 restart 0
else
  echo "Local branch is up to date"
fi