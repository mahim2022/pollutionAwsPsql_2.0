This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


-------------------------------------------------------------------------

deploying on ec2 instance:

Here’s a step-by-step guide for deploying your Next.js + PostgreSQL webapp to EC2 (take your time, you’ll be doing these steps in the AWS console and terminal):

🛠 Step 1: Launch an EC2 instance

Go to EC2 Console → Launch Instance.

Name: water-pollution-app.

AMI: choose Amazon Linux 2023 or Ubuntu 22.04 (either works, Ubuntu has simpler Node.js setup).

Instance type: t2.micro (free tier).

Key pair: select/create a new key pair → download .pem file.

Security group:

Allow SSH (22) from your IP.

Allow HTTP (80) for public web access.

Allow HTTPS (443) if you want SSL later.

Launch.

🛠 Step 2: Connect to the EC2 instance

On your local terminal:

chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

🛠 Step 3: Install dependencies

Inside your EC2:

# Update
sudo apt update && sudo apt upgrade -y

# Install Node.js (LTS) + npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL client (to test connection to RDS)
sudo apt install -y postgresql-client

# Install PM2 (for running Node apps in background)
sudo apt install npm

Check versions:

node -v
npm -v

🛠 Step 4: Get your project on the server

Option A – clone from GitHub:

git clone https://github.com/<your-repo>.git
cd <your-repo>



🛠 Step 5: Configure environment variables

Create a .env file with your RDS PostgreSQL credentials:

nano .env

DATABASE_URL=postgresql://<username>:<password>@<rds-endpoint>:5432/<dbname>

🛠 Step 6: Build & start the Next.js app
npm install
npm run build
npm start


If you want it running permanently in background:

pm2 start npm --name "pollution-app" -- start
pm2 save
pm2 startup

🛠 Step 7: Access your app

Open browser → http://<EC2_PUBLIC_IP>:3000 (default Next.js port).

If you want it on port 80, you can either:

Run with PORT=80 npm start

Or use NGINX reverse proxy to route traffic → Next.js.

✅ At this point, your app is live on EC2, connected to RDS PostgreSQL.
If you stop the EC2 instance, PM2 ensures the app auto-restarts when the server reboots.



⚠️ Important: (try on launch-wizard-1)
Right now, security groups need to allow inbound traffic on port 3000 (Next.js default). If you didn’t add that yet, go to your EC2 Security Group → Inbound rules → Add rule → Custom TCP → Port 3000 → Source: 0.0.0.0/0 → Save.


From your instance summary:

👉 Public IPv4 address: 54.196.80.107
👉 Public DNS: ec2-54-196-80-107.compute-1.amazonaws.com

You can reach your app with either one:

http://54.196.80.107:3000

http://ec2-54-196-80-107.compute-1.amazonaws.com:3000



If you want it running permanently in background:

pm2 start npm --name "pollution-app" -- start
pm2 save
pm2 startup



👍 You have two main options to sync your latest repo changes with your EC2 instance:

🔹 Option 1: Pull directly from GitHub (recommended if repo is private/public and EC2 has access)

SSH into your EC2:

ssh -i pollution.pem ubuntu@54.196.80.107


Go to your app folder (where you cloned the repo earlier):

cd ~/pollution   # or wherever you cloned it


Fetch the latest changes:

git pull origin main


(replace main with your branch if different)

Reinstall dependencies if package.json changed:

npm install


Rebuild:

npm run build


Restart your pm2 process:

pm2 restart all



---------------------------------------------------
connecting rds psql through ec2 instance though ssh

chmod 400 key.pem
ssh -i path/to/key.pem -L 5432:<RDS_ENDPOINT>:5432 ec2-user@<EC2_PUBLIC_IP>

now this will be connected to the localmachine 5432 port can we can access the db from local machine

In .env.local:
PGHOST=localhost
PGPORT=5432
PGUSER=<DB_USERNAME>
PGPASSWORD=<DB_PASSWORD>
PGDATABASE=<DB_NAME>