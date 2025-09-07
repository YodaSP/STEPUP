# AWS Production Deployment Guide

## 🏗️ Recommended AWS Architecture

### 1. **Container Orchestration: Amazon ECS with Fargate**
- **Why**: Serverless containers, no server management
- **Benefits**: Auto-scaling, high availability, cost-effective
- **Setup**: Use ECS Task Definitions with your Docker images

### 2. **Load Balancing: Application Load Balancer (ALB)**
- **Purpose**: Distribute traffic, SSL termination, health checks
- **Configuration**: 
  - Target groups for frontend (port 80) and backend (port 5000)
  - Health check paths: `/health` (frontend), `/api/test` (backend)
  - SSL certificate from AWS Certificate Manager

### 3. **Database: Amazon DocumentDB or MongoDB Atlas**
- **DocumentDB**: AWS-managed MongoDB-compatible database
- **Benefits**: Automatic backups, scaling, security
- **Alternative**: MongoDB Atlas with VPC peering

### 4. **File Storage: Amazon S3**
- **Purpose**: Store uploaded files (resumes, logos)
- **Benefits**: Scalable, durable, cost-effective
- **Integration**: Replace local file uploads with S3

### 5. **Secrets Management: AWS Secrets Manager**
- **Store**: JWT secrets, database credentials, OAuth keys
- **Benefits**: Automatic rotation, encryption, audit logging

### 6. **CDN: Amazon CloudFront**
- **Purpose**: Cache static assets globally
- **Benefits**: Faster loading, reduced server load

### 7. **Monitoring: CloudWatch + X-Ray**
- **CloudWatch**: Logs, metrics, alarms
- **X-Ray**: Distributed tracing for debugging

## 🔧 Step-by-Step Deployment

### Phase 1: Infrastructure Setup

1. **Create VPC and Subnets**
   ```bash
   # Create VPC
   aws ec2 create-vpc --cidr-block 10.0.0.0/16
   
   # Create public and private subnets across AZs
   aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24
   aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24
   ```

2. **Set up DocumentDB Cluster**
   ```bash
   aws docdb create-db-cluster \
     --db-cluster-identifier kaam-db-cluster \
     --engine docdb \
     --master-username admin \
     --master-user-password YourSecurePassword123! \
     --vpc-security-group-ids sg-xxx
   ```

3. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name kaam-cluster
   ```

### Phase 2: Container Registry

1. **Create ECR Repositories**
   ```bash
   aws ecr create-repository --repository-name kaam-frontend
   aws ecr create-repository --repository-name kaam-backend
   ```

2. **Build and Push Images**
   ```bash
   # Frontend
   docker build -f kaam_webapp/Dockerfile.production -t kaam-frontend .
   docker tag kaam-frontend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/kaam-frontend:latest
   docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/kaam-frontend:latest
   
   # Backend
   docker build -f kaam-backend/Dockerfile.production -t kaam-backend .
   docker tag kaam-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/kaam-backend:latest
   docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/kaam-backend:latest
   ```

### Phase 3: Secrets Management

1. **Store Secrets in AWS Secrets Manager**
   ```bash
   # Database credentials
   aws secretsmanager create-secret \
     --name "kaam-backend/database" \
     --secret-string '{"MONGODB_URI":"mongodb://admin:password@docdb-cluster:27017/kaam"}'
   
   # JWT Secret
   aws secretsmanager create-secret \
     --name "kaam-backend/jwt" \
     --secret-string '{"JWT_SECRET":"your-super-secure-jwt-secret-here"}'
   
   # Google OAuth
   aws secretsmanager create-secret \
     --name "kaam-backend/google-oauth" \
     --secret-string '{"GOOGLE_CLIENT_ID":"your-client-id","GOOGLE_CLIENT_SECRET":"your-client-secret"}'
   ```

### Phase 4: ECS Task Definitions

1. **Frontend Task Definition**
   ```json
   {
     "family": "kaam-frontend",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
     "containerDefinitions": [
       {
         "name": "frontend",
         "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/kaam-frontend:latest",
         "portMappings": [
           {
             "containerPort": 80,
             "protocol": "tcp"
           }
         ],
         "healthCheck": {
           "command": ["CMD-SHELL", "curl -f http://localhost/health || exit 1"],
           "interval": 30,
           "timeout": 5,
           "retries": 3
         }
       }
     ]
   }
   ```

2. **Backend Task Definition**
   ```json
   {
     "family": "kaam-backend",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "512",
     "memory": "1024",
     "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
     "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
     "containerDefinitions": [
       {
         "name": "backend",
         "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/kaam-backend:latest",
         "portMappings": [
           {
             "containerPort": 5000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           }
         ],
         "secrets": [
           {
             "name": "MONGODB_URI",
             "valueFrom": "arn:aws:secretsmanager:region:account:secret:kaam-backend/database:MONGODB_URI::"
           },
           {
             "name": "JWT_SECRET",
             "valueFrom": "arn:aws:secretsmanager:region:account:secret:kaam-backend/jwt:JWT_SECRET::"
           }
         ],
         "healthCheck": {
           "command": ["CMD-SHELL", "node -e \"require('http').get('http://localhost:5000/api/test', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })\""],
           "interval": 30,
           "timeout": 5,
           "retries": 3
         }
       }
     ]
   }
   ```

### Phase 5: Auto Scaling

1. **Create Auto Scaling Groups**
   - Frontend: 2-10 instances based on CPU/memory
   - Backend: 2-8 instances based on CPU/memory
   - Target tracking policies for CPU and memory utilization

2. **CloudWatch Alarms**
   - High CPU utilization (>70%)
   - High memory utilization (>80%)
   - Error rate monitoring
   - Response time monitoring

## 🔒 Security Best Practices

### 1. **Network Security**
- Use private subnets for backend services
- Security groups with minimal required access
- WAF (Web Application Firewall) for additional protection

### 2. **IAM Roles**
- Least privilege principle
- Separate roles for ECS tasks and execution
- No hardcoded credentials

### 3. **Encryption**
- Data at rest: EBS encryption, S3 encryption
- Data in transit: TLS/SSL everywhere
- Secrets encryption in Secrets Manager

### 4. **Monitoring & Logging**
- CloudTrail for API calls
- CloudWatch Logs for application logs
- X-Ray for distributed tracing

## 💰 Cost Optimization

### 1. **Right-sizing**
- Start with smaller instance types
- Monitor and adjust based on actual usage
- Use Spot instances for non-critical workloads

### 2. **Reserved Instances**
- For predictable workloads
- 1-3 year commitments for cost savings

### 3. **Auto Scaling**
- Scale down during low usage periods
- Use scheduled scaling for predictable patterns

## 📊 Monitoring & Alerting

### 1. **Key Metrics to Monitor**
- Response time (p95, p99)
- Error rate (4xx, 5xx)
- CPU and memory utilization
- Database connections
- Request throughput

### 2. **Alerting Thresholds**
- Error rate > 5%
- Response time > 2 seconds
- CPU utilization > 80%
- Memory utilization > 85%

### 3. **Log Management**
- Centralized logging with CloudWatch
- Log retention policies
- Log analysis and alerting

## 🚀 Deployment Pipeline

### 1. **CI/CD with GitHub Actions**
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Build and push images
        run: |
          # Build and push Docker images
      - name: Update ECS service
        run: |
          aws ecs update-service --cluster kaam-cluster --service kaam-service --force-new-deployment
```

### 2. **Blue-Green Deployment**
- Use ECS service with blue/green deployment
- Zero-downtime deployments
- Automatic rollback on failure

## 🔧 Environment-Specific Configurations

### Development
- Single instance deployment
- Local MongoDB
- Basic monitoring

### Staging
- Production-like setup
- Separate database
- Full monitoring

### Production
- Multi-AZ deployment
- High availability
- Comprehensive monitoring and alerting
- Disaster recovery plan

## 📋 Pre-Deployment Checklist

- [ ] All secrets moved to AWS Secrets Manager
- [ ] Database credentials secured
- [ ] SSL certificates configured
- [ ] CORS settings updated for production domain
- [ ] Health check endpoints working
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Security groups properly configured
- [ ] Load balancer health checks passing
- [ ] Auto scaling policies configured
- [ ] Log aggregation working
- [ ] Error tracking implemented
