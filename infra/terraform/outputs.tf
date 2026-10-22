output "instance_public_ip" {
  description = "Public IPv4 address for the EC2 instance."
  value       = aws_instance.app.public_ip
}

output "frontend_url" {
  description = "URL for the Next.js frontend."
  value       = "http://${aws_instance.app.public_ip}:3000"
}

output "api_health_url" {
  description = "URL for the NestJS health endpoint."
  value       = "http://${aws_instance.app.public_ip}:3001/health"
}
