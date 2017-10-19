#!/bin/bash
# 
appPath=`pwd`
scriptPath="${appPath}/scripts"

cross-env NODE_ENV=development node ${appPath}/server/app