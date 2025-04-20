# EC2 Instance
resource "aws_instance" "api_server" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  key_name               = aws_key_pair.deployer.key_name

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              curl -sL https://rpm.nodesource.com/setup_14.x | bash -
              yum install -y nodejs
              mkdir -p /home/ec2-user/app
              echo 'export DATABASE_URL=${var.database_url}' >> /home/ec2-user/.bashrc
              echo 'export PORT=${var.app_port}' >> /home/ec2-user/.bashrc
              EOF

  tags = {
    Name = "recommendation-api-server"
  }
}

# Latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# SSH Key Pair
resource "aws_key_pair" "deployer" {
  key_name   = "recommendation-api-deployer-key"
  public_key = file("${path.module}/ssh-key.pub")
}
