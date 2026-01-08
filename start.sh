#!/bin/bash
# Start Backend and Frontend concurrently

cd Backend && npm install && npm run build &
cd ../Frontend && npm install && npm run build &
wait

echo "Build complete. To run servers, use npm start in each directory or add run scripts here."
