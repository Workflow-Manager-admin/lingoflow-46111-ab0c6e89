#!/bin/bash
cd /home/kavia/workspace/code-generation/lingoflow-46111-ab0c6e89/lingoflow
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

