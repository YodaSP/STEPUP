variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "kaam"
}

variable "frontend_cpu" {
  description = "Frontend container CPU units"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Frontend container memory"
  type        = number
  default     = 512
}

variable "backend_cpu" {
  description = "Backend container CPU units"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Backend container memory"
  type        = number
  default     = 1024
}

variable "min_capacity" {
  description = "Minimum number of tasks"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of tasks"
  type        = number
  default     = 10
}

variable "desired_capacity" {
  description = "Desired number of tasks"
  type        = number
  default     = 2
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "SSL certificate ARN"
  type        = string
  default     = ""
}
