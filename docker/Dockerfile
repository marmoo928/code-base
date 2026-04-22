FROM alpine:3.19

# Install Node.js and GCC (build-base includes gcc, g++, make, etc.)
RUN apk add --no-cache nodejs build-base

# Create a directory for the workspace
WORKDIR /workspace

# Copy the runner script
COPY runner.sh /runner.sh
RUN chmod +x /runner.sh

ENTRYPOINT ["/runner.sh"]
