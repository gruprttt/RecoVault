variable "database_url" {
  description = "PostgreSQL database URL"
  type        = string
  default     = "postgres://your_username:your_password@your_neon_host/your_database"
  sensitive   = true
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.api.dns_name
}

output "ec2_instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.api_server.public_ip
}
