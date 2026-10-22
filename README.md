# AWS CI/CD Learning Lab

A small monorepo for learning the path from a code change to a running AWS deployment:

- `apps/web`: Next.js frontend
- `apps/api`: NestJS API with a PostgreSQL-backed health check
- `compose.yaml`: local and EC2 container setup
- `infra/terraform`: Terraform for one EC2 host and its network rules
- `.github/workflows/ci-cd.yml`: checks pull requests and deploys pushes to `main`

The AWS setup is intentionally small for learning. AWS Free Tier eligibility and pricing depend on your account, region, and current AWS offer. An EC2 instance, public IPv4 address, storage, and data transfer may incur charges. Check the AWS pricing page and set a budget alert before applying Terraform. PostgreSQL runs in Docker on the same EC2 host; this is not a production database setup.

## Run locally

Requirements: Node.js 22+, npm, Docker Desktop with Compose, Git, Terraform 1.5+, and AWS credentials configured for Terraform.

```powershell
docker compose up --build
```

Open the frontend at <http://localhost:3000> and the API health check at <http://localhost:3001/health>. The API connects to the PostgreSQL service defined in Compose.

To stop the containers:

```powershell
docker compose down
```

To also remove the local PostgreSQL data volume:

```powershell
docker compose down --volumes
```

## Deploy to AWS

### 1. Publish this project to GitHub

Create a GitHub repository, commit this project, and push its `main` branch. The deployment job checks out the repository on the EC2 host, so make the repository public for this beginner setup. For a private repository, use a secure deploy credential or switch to an artifact/image-based deployment; do not embed a personal access token in the repo or Terraform state.

### 2. Create an SSH key for the EC2 instance

In PowerShell:

```powershell
ssh-keygen -t ed25519 -f "$HOME\.ssh\cicd-learning-lab" -C "cicd-learning-lab"
```

Keep the private key secret. Terraform needs the public key; GitHub Actions needs the private key.

### 3. Configure and apply Terraform

```powershell
Set-Location infra\terraform
Copy-Item terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your public key and your public IPv4 address in CIDR notation (for example `203.0.113.10/32`). The SSH ingress default allows connections from anywhere so GitHub-hosted runners can reach the instance. Restrict it to your own IP for manual access, or use a self-hosted runner/SSM for a safer deployment path.

This starter uses the account's default VPC and requires it to have at least one subnet. If you deleted the default VPC, recreate it in the selected region or adapt the Terraform networking resources before applying.

```powershell
terraform init
terraform plan
terraform apply
```

Terraform prints the instance IP and web/API URLs. Save the IP for the next step. Terraform creates billable AWS resources and does not create a managed PostgreSQL database.

### 4. Add GitHub Actions secrets

In GitHub, open **Settings → Secrets and variables → Actions** and add:

- `EC2_HOST`: the IP printed by Terraform
- `EC2_SSH_KEY`: the contents of `cicd-learning-lab` (the private key)

Push a commit to `main` or rerun the **CI/CD** workflow. The workflow runs app checks, then SSHes into EC2 and runs `docker compose up --build -d`.

### 5. Clean up AWS resources

When finished, destroy what Terraform created:

```powershell
Set-Location infra\terraform
terraform destroy
```

Terraform state and `terraform.tfvars` can contain infrastructure details. Keep both out of Git; never commit private keys, AWS credentials, or Terraform state.

## Learning path

1. Run the stack locally and change the frontend.
2. Open a pull request and inspect the CI checks.
3. Merge to `main` and observe the deployment workflow.
4. Change the Terraform instance size or ingress rules, then review `terraform plan` before applying.
5. Try an image registry, OIDC-based AWS authentication, a managed database, and HTTPS as follow-up improvements.
