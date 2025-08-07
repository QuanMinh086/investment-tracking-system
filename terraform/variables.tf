variable "region" {
  type = string
}

variable "vpc_cidr" {
  type = string
}

variable "vpc_name" {
  type = string
}

variable "igw_name" {
  type = string
}

variable "public_subnet_cidr" {
  type = string
}

variable "private_subnet_cidr" {
  type = string
}

variable "az" {
  type = string
}

variable "public_subnet_name" {
  type = string
}

variable "private_subnet_name" {
  type = string
}

variable "eip_domain" {
  type = string
}

variable "eip_name" {
  type = string
}

variable "nat_gateway_name" {
  type = string
}

variable "frontend_security_group" {
  type = string
}

variable "frontend_security_group_description" {
  type = string
}

variable "frontend_security_group_name" {
  type = string
}

variable "backend_security_group" {
  type = string
}

variable "backend_security_group_description" {
  type = string
}

variable "backend_security_group_name" {
  type = string
}

variable "ami" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "key_name" {
  type = string
}

variable "frontend_name" {
  type = string
}

variable "backend_name" {
  type = string
}

variable "route_table_cidr" {
  type = string
}

variable "public_rt_name" {
  type = string
}

variable "private_rt_name" {
  type = string
}