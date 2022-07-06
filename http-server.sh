#!/usr/bin/env bash

set -u

PUBLIC_PATH="$1"
shift
SERVER_OPTS="$@"

http-server $PUBLIC_PATH -p 9002 -S true -C /var/serving-cert/tls.crt -K /var/serving-cert/tls.key -c-1 --cors $SERVER_OPTS
