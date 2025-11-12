#!/bin/bash
cd /home/kavia/workspace/code-generation/task-organizer-223578-223589/todo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

