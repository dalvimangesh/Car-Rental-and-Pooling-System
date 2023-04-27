#!/bin/bash

# Find all processes listening on port 5000
lsof -i :5000 | awk '{print $2}' | tail -n +2 | while read PID
do
    # Terminate the process
    kill -9 "$PID"
done
