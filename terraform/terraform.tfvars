region = "us-east-1"
vpc_cidr = "10.0.0.0/16"
vpc_name = "ypfp"
igw_name = "main-igw"

public_subnet_cidr = "10.0.0.0/24"
private_subnet_cidr = "10.0.1.0/24"
az = "us-east-1a"
public_subnet_name = "public-subnet"
private_subnet_name = "private-subnet"

eip_domain = "vpc"
eip_name = "nat-eip"
nat_gateway_name = "nat-gateway"

frontend_security_group = "frontend-security-group"
frontend_security_group_description = "Frontend Security Group"
frontend_security_group_name = "frontend-sg"

backend_security_group = "backend-security-group"
backend_security_group_description = "Backend Security Group"
backend_security_group_name = "backend-sg"

ami = "ami-020cba7c55df1f615"
instance_type = "t2.micro"
key_name = "vm"
frontend_name = "frontend"
backend_name = "backend"

route_table_cidr = "0.0.0.0/0"
public_rt_name = "public-route-table"
private_rt_name = "private-route-table"