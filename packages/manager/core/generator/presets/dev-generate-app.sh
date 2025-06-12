#!/bin/bash

# Check if expect is installed
if ! command -v expect >/dev/null 2>&1; then
  echo "Error: 'expect' is not installed."
  echo "This script requires 'expect' to automate interactive CLI prompts."
  echo "You can install it with:"
  echo "  sudo ovh-apt install expect"
  exit 1
fi

clear
# Call the expect script
expect ./presets/preset-app-generator.exp
