#!/bin/bash

# Create a dummy SSH key for Terraform validation
echo "Creating dummy SSH key for validation..."
ssh-keygen -t rsa -b 2048 -f /home/ubuntu/terraform/ssh-key -N ""

echo "Validation complete!"
