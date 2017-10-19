#!/bin/bash
# 
appPath=`pwd`
scriptPath="${appPath}/scripts"
skip_npm=$1
if [ "$skip_npm" != "skip_npm" ];then
    npm install
fi
cross-env NODE_ENV=production webpack --colors --display-error-details  --config ${appPath}/webpack/prod.js