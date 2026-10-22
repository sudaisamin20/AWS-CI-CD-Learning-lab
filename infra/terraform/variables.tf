variable "aws_region" {
  description = "AWS region for the learning lab."
  type        = string
  default     = "eu-north-1"
}

variable "project_name" {
  description = "Short name used for AWS resource names."
  type        = string
  default     = "cicd-learning-lab"
}

variable "instance_type" {
  description = "Small EC2 instance type; verify current Free Tier eligibility for your account."
  type        = string
  default     = "t3.micro"
}

variable "ssh_public_key" {
  description = "Contents of the SSH public key authorized to connect to EC2."
  type        = string
  sensitive   = true
}

variable "ssh_ingress_cidr" {
  description = "CIDR allowed to reach SSH; GitHub-hosted runner IPs are not static."
  type        = string
  default     = "0.0.0.0/0"

  validation {
    condition     = can(cidrnetmask(var.ssh_ingress_cidr))
    error_message = "ssh_ingress_cidr must be a valid IPv4 CIDR block."
  }
}
