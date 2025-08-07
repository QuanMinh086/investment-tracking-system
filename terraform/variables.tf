variable "region" { type = string }

variable "vpc_cidr" { type = string }
variable "vpc_name" { type = string }

variable "igw_name" { type = string }

variable "subnets" {
  type = map(object({
    cidr_block = string
    az         = string
    name       = string
  }))
}

variable "eip_domain" { type = string }
variable "eip_name" { type = string }

variable "nat_gateway_name" { type = string }

variable "security_groups" {
  type = map(object({
    description = string
    ingress_rules = list(object({
      from_port       = number
      to_port         = number
      protocol        = string
      cidr_blocks     = list(string)
      security_groups = optional(list(string), [])
    }))
  }))
}


variable "ami" { type = string }
variable "instance_type" { type = string }
variable "key_name" { type = string }

variable "instances" {
  type = map(object({
    subnet_type  = string
    sg_name      = string
    name         = string
    associate_ip = bool
  }))
}

variable "route_table_cidr" { type = string }

variable "public_rt_name" { type = string }
variable "private_rt_name" { type = string }
