#!/bin/bash

# Validate Terraform configuration
cd /home/ubuntu/terraform

echo "Validating Terraform configuration..."
terraform init -backend=false
terraform validate

# Check for required resources
echo -e "\nChecking for required resources..."
echo "VPC configuration: $(grep -c "aws_vpc" *.tf) resources found"
echo "Subnet configuration: $(grep -c "aws_subnet" *.tf) resources found"
echo "Internet Gateway: $(grep -c "aws_internet_gateway" *.tf) resources found"
echo "Route Tables: $(grep -c "aws_route_table" *.tf) resources found"
echo "Security Groups: $(grep -c "aws_security_group" *.tf) resources found"
echo "EC2 Instance: $(grep -c "aws_instance" *.tf) resources found"
echo "Load Balancer: $(grep -c "aws_lb" *.tf) resources found"
echo "Target Group: $(grep -c "aws_lb_target_group" *.tf) resources found"

# Check for security best practices
echo -e "\nChecking security best practices..."
echo "Security group ingress rules: $(grep -c "ingress" *.tf) rules found"
echo "Security group egress rules: $(grep -c "egress" *.tf) rules found"

echo -e "\nTerraform validation completed!"
