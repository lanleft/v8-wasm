#!/bin/bash

# Define the directory to search
directory="./test"

# Print the directory being searched
echo "Searching in directory: $directory"

# Use find command to list all files matching the pattern
find "$directory" -type f -name "regress*"
