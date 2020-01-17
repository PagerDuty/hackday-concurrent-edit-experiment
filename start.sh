#!/usr/bin/env sh
cd ./backend/
yarn install
npm start &
cd ../frontend
yarn install
exec npm start
