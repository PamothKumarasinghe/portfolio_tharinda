# Production Setup Guide

This guide provides detailed steps for preparing your portfolio application for production deployment.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or MongoDB server)
- Cloudinary account
- Email service (Resend) account

## Step 1: Environment Variables

1. **Copy the example environment file:**

   ```bash
   cp .env.example .env.local
   ```

2. **Update the following variables in `.env.local`:**

### Required Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Secret (Generate a strong random string)
JWT_SECRET=<generate-using-command-below>

# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=admin
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=<create-a-strong-password>

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# NextAuth Configuration (for production)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<same-as-jwt-secret-or-another-random-string>
```

### Generate JWT_SECRET

Run one of these commands to generate a secure random JWT secret:

**Using Node.js:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using OpenSSL:**

```bash
openssl rand -hex 32
```

## Step 2: Update Admin Password

1. **Create a new admin user with a strong password:**

   ```bash
   node scripts/create-admin.js
   ```

2. **Or update the password in MongoDB directly:**
   - Use a password generator to create a strong password (minimum 16 characters)
   - Hash it using the `bcryptjs` library
   - Update the admin document in MongoDB

## Step 3: Security Checklist

Before deploying to production, verify:

- [ ] JWT_SECRET is a strong random string (at least 32 characters)
- [ ] ADMIN_PASSWORD is strong and unique
- [ ] MongoDB credentials are not exposed in version control
- [ ] All API keys are stored in environment variables
- [ ] .env.local is listed in .gitignore
- [ ] NEXTAUTH_URL is set to your production domain
- [ ] CORS settings are configured for your domain (if needed)
- [ ] Rate limiting is enabled (already configured)
- [ ] Input validation is active (already configured)
- [ ] Security headers are set (already configured)

## Step 4: Build and Test

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build the application:**

   ```bash
   npm run build
   ```

3. **Test the production build locally:**

   ```bash
   npm start
   ```

4. **Verify:**
   - Admin login works with new credentials
   - JWT authentication is functional
   - All CRUD operations require authentication
   - Rate limiting is working
   - No console errors or warnings

## Step 5: Database Setup

1. **Ensure MongoDB indexes are created:**

   ```javascript
   // Run this in MongoDB shell or use a migration script
   db.admins.createIndex({ username: 1 }, { unique: true });
   db.admins.createIndex({ email: 1 }, { unique: true });
   db.projects.createIndex({ createdAt: -1 });
   db.experiences.createIndex({ createdAt: -1 });
   db.education.createIndex({ createdAt: -1 });
   db.skills.createIndex({ order: 1 });
   ```

2. **Create initial admin user if not exists:**
   ```bash
   node scripts/create-admin.js
   ```

## Step 6: Deployment Options

### Option A: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Deploy:**

   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - Go to Project Settings > Environment Variables
   - Add all variables from `.env.local`
   - Ensure they're set for Production environment

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Option B: Docker

1. **Create Dockerfile:**

   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run:**
   ```bash
   docker build -t portfolio .
   docker run -p 3000:3000 --env-file .env.local portfolio
   ```

### Option C: Traditional Hosting (VPS/Cloud)

1. **SSH into your server**

2. **Install Node.js and PM2:**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Clone repository and setup:**

   ```bash
   git clone <your-repo>
   cd portfolio
   npm install
   npm run build
   ```

4. **Start with PM2:**
   ```bash
   pm2 start npm --name "portfolio" -- start
   pm2 save
   pm2 startup
   ```

## Step 7: Post-Deployment Verification

1. **Test authentication:**
   - Try logging in to admin panel
   - Verify JWT token is stored in localStorage
   - Check that token expires after 24 hours

2. **Test rate limiting:**
   - Try multiple rapid requests
   - Verify 429 responses are returned

3. **Test CRUD operations:**
   - Create, update, delete projects
   - Verify data persists in MongoDB
   - Check that unauthenticated requests fail

4. **Monitor logs:**
   - Check for any errors
   - Verify no sensitive data is logged
   - Monitor performance metrics

## Step 8: Ongoing Maintenance

1. **Regular security updates:**

   ```bash
   npm audit
   npm audit fix
   ```

2. **Monitor rate limiting:**
   - Adjust limits in `src/lib/rateLimit.ts` if needed
   - Consider implementing Redis for distributed rate limiting

3. **Backup database:**
   - Set up automatic MongoDB Atlas backups
   - Or configure manual backup scripts

4. **Update admin password periodically:**
   - Change admin password every 90 days
   - Update JWT_SECRET if compromised

## Troubleshooting

### Authentication Issues

**Problem:** "Not authenticated" errors

- Verify JWT_SECRET is set correctly in environment variables
- Check that localStorage is enabled in browser
- Ensure token hasn't expired (24-hour lifetime)

**Problem:** Login fails with correct credentials

- Verify ADMIN_USERNAME and ADMIN_PASSWORD in .env.local
- Check that bcrypt hashing is working correctly
- Review MongoDB connection and admin collection

### Rate Limiting Issues

**Problem:** Getting 429 errors too frequently

- Adjust rate limits in `src/lib/rateLimit.ts`
- Consider implementing IP whitelisting for legitimate traffic
- For distributed systems, migrate to Redis-based rate limiting

### Database Connection Issues

**Problem:** Cannot connect to MongoDB

- Verify MONGODB_URI format is correct
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for cloud deployments)
- Ensure database user has proper permissions

## Security Best Practices

1. **Never commit sensitive data:**
   - Always use .gitignore for .env files
   - Use environment variables for all secrets
   - Rotate credentials regularly

2. **Monitor for vulnerabilities:**
   - Run `npm audit` regularly
   - Subscribe to security advisories
   - Keep dependencies updated

3. **Implement additional security layers:**
   - Consider adding 2FA for admin accounts
   - Implement CAPTCHA on login page
   - Add webhook for suspicious activity alerts

4. **Regular backups:**
   - Set up automated MongoDB backups
   - Store backups in secure, separate location
   - Test restore procedures regularly

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Security](https://docs.atlas.mongodb.com/security/)
- [Cloudinary Best Practices](https://cloudinary.com/documentation/security_best_practices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Support

If you encounter issues not covered in this guide:

1. Check the main [SECURITY.md](./SECURITY.md) file
2. Review the [README.md](./README.md) for general setup
3. Check application logs for specific error messages
