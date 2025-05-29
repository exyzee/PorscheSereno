#!/bin/bash

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $1 is in use. Attempting to kill the process..."
        lsof -ti :$1 | xargs kill -9
        sleep 2
    fi
}

# Function to clean up old log files
clean_logs() {
    echo "Cleaning up old log files..."
    rm -f api/traffic_log.txt
    rm -f api/breathing_log.txt
    touch api/traffic_log.txt
    touch api/breathing_log.txt
}

# Clean up old processes and logs
check_port 8000
check_port 5173
clean_logs

# Start PHP server in the background
echo "Starting PHP server..."
cd api
php -S localhost:8000 -t ../ &
PHP_PID=$!

# Start React app
echo "Starting React app..."
cd ..
npm run dev

# When React app is stopped, also stop PHP server
trap "kill $PHP_PID" EXIT 