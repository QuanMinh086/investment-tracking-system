region   = "us-east-1"
vpc_cidr = "10.0.0.0/16"
vpc_name = "ypfp"
igw_name = "main-igw"

subnets = {
  public = {
    cidr_block = "10.0.0.0/24"
    az         = "us-east-1a"
    name       = "public-subnet"
  }
  private = {
    cidr_block = "10.0.1.0/24"
    az         = "us-east-1a"
    name       = "private-subnet"
  }
}

eip_domain       = "vpc"
eip_name         = "nat-eip"
nat_gateway_name = "nat-gateway"

security_groups = {
  frontend = {
    description = "Frontend Security Group"
    ingress_rules = [
      {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
      },
      {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
      }
    ]
  }

  backend = {
    description = "Backend Security Group"
    ingress_rules = [
      {
        from_port       = 8000
        to_port         = 8000
        protocol        = "tcp"
        cidr_blocks     = []
        security_groups = ["frontend"]
      },
      {
        from_port       = 22
        to_port         = 22
        protocol        = "tcp"
        cidr_blocks     = []
        security_groups = ["frontend"]
      }
    ]
  }
}

ami           = "ami-020cba7c55df1f615"
instance_type = "t2.micro"
key_name      = "vm"

instances = {
  frontend = {
    subnet_type  = "public"
    sg_name      = "frontend"
    name         = "frontend"
    associate_ip = true
  }
  backend = {
    subnet_type  = "private"
    sg_name      = "frontend"
    name         = "backend"
    associate_ip = false
  }
}

route_table_cidr = "0.0.0.0/0"
public_rt_name   = "public-route-table"
private_rt_name  = "private-route-table"
