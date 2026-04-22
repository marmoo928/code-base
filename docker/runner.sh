#!/bin/sh

# Usage: /runner.sh <language>
# Expects source code in /workspace/source.<ext>
# Expects input in /workspace/input.txt (optional)

LANGUAGE=$1

if [ "$LANGUAGE" = "c" ]; then
    # Compile C
    gcc /workspace/source.c -o /workspace/program
    if [ $? -ne 0 ]; then
        exit 1 # Compilation failed
    fi
    
    # Run
    if [ -f /workspace/input.txt ]; then
        /workspace/program < /workspace/input.txt
    else
        /workspace/program
    fi

elif [ "$LANGUAGE" = "javascript" ]; then
    # Run Node.js
    if [ -f /workspace/input.txt ]; then
        node /workspace/source.js < /workspace/input.txt
    else
        node /workspace/source.js
    fi

else
    echo "Unsupported language: $LANGUAGE"
    exit 1
fi
