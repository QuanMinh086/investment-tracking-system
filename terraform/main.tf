# VPC
resource "aws_vpc" "vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = var.vpc_name
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = var.igw_name
  }
}

# Public & Private Subnet
resource "aws_subnet" "subnets" {
  for_each          = var.subnets
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = each.value.cidr_block
  availability_zone = each.value.az

  tags = {
    Name = each.value.name
  }
}

# Elastic IP for NAT
resource "aws_eip" "nat_eip" {
  domain = var.eip_domain

  tags = {
    Name = var.eip_name
  }
}

# NAT Gateway
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.subnets["public"].id

  tags = {
    Name = var.nat_gateway_name
  }
}

# Frontend & Backend Security Group
resource "aws_security_group" "sg" {
  for_each    = var.security_groups
  name        = "${each.key}-security-group"
  description = each.value.description
  vpc_id      = aws_vpc.vpc.id

  dynamic "ingress" {
    for_each = [
      for rule in each.value.ingress_rules : rule
      if length(lookup(rule, "security_groups", [])) == 0
    ]
    content {
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = lookup(ingress.value, "cidr_blocks", [])
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${each.key}-security-group"
  }
}

# Frontend & Backend EC2 Instances
resource "aws_instance" "instance" {
  for_each                    = var.instances
  ami                         = var.ami
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.subnets[each.value.subnet_type].id
  vpc_security_group_ids      = [aws_security_group.sg[each.value.sg_name].id]
  key_name                    = var.key_name
  associate_public_ip_address = each.value.associate_ip

  depends_on = [aws_security_group.sg]

  tags = {
    Name = each.value.name
  }
}

# Public Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = var.route_table_cidr
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = var.public_rt_name
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.subnets["public"].id
  route_table_id = aws_route_table.public_rt.id
}

# Private Route Table
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = var.route_table_cidr
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = var.private_rt_name
  }
}

resource "aws_route_table_association" "private_assoc" {
  subnet_id      = aws_subnet.subnets["private"].id
  route_table_id = aws_route_table.private_rt.id
}
