# Terraform AWS Infrastructure

This directory contains Terraform configuration files to deploy the recommendation collection API to AWS infrastructure.

## Main Components
- VPC with public and private subnets
- EC2 instance for hosting the API
- Application Load Balancer
- Security Groups
- Networking components (route tables, internet gateway, etc.)

## Prerequisites
- Terraform installed
- AWS CLI configured with appropriate credentials
- The backend API code ready for deployment

## Usage
1. Initialize Terraform:
```
terraform init
```

2. Review the execution plan:
```
terraform plan
```

3. Apply the configuration:
```
terraform apply
```

4. To destroy the infrastructure:
```
terraform destroy
```
