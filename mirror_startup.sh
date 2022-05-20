#!/usr/bin/env bash
npm run serverStart --prefix /home/pi/smart-mirror/server &
npm run feStart --prefix /home/pi/smart-mirror/smart-mirror-react &
npm run electronStart --prefix /home/pi/smart-mirror/smart-mirror-react &
