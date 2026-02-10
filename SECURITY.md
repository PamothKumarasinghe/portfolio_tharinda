# Security Configuration Guide

This document outlines the security measures implemented in this portfolio application.

## 🔐 **Authentication & Authorization**

### JWT-Based Authentication

- All admin API routes (POST, PUT, DELETE) require JWT authentication
- JWT tokens expire after 24 hours
- Tokens must be included in the `Authorization` header as `Bearer <token>`

### Session Management

- Login generates a JWT token
- Client must store and send token with each authenticated request
- No more insecure sessionStorage authentication

## 🚦 **Rate Limiting**

Different endpoints have different rate limits:

| Endpoint     | Max Requests | Time Window | Purpose                     |
| ------------ | ------------ | ----------- | --------------------------- |
| Login        | 5            | 5 minutes   | Prevent brute force attacks |
| Contact Form | 3            | 1 hour      | Prevent spam                |
| File Upload  | 10           | 1 hour      | Prevent abuse               |
| Admin API    | 100          | 1 minute    | General protection          |
| Public Read  | 200          | 1 minute    | Liberal for visitors        |

## ✅ **Input Validation**

All user inputs are validated using Zod schemas:

- **Login**: Username (3-50 chars), Password (6-100 chars)
- **Contact**: Name, Email, Subject, Message with length limits
- **Projects**: Title, Description, Tags (max 10), URLs validation
- **Experience/Education**: Required fields with proper length limits
- **Skills**: Name, Percentage (0-100), Category limits

## 🛡️ **Security Headers**

The following security headers are automatically added to all responses:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

API routes get additional headers:

```
X-Frame-Options: DENY
Cache-Control: no-store, max-age=0
```

## 🔑 **Environment Variables**

### Required for Production

1. **JWT_SECRET**: Generate a strong secret (minimum 32 characters)

   ```bash
   # Generate using OpenSSL
   openssl rand -base64 32
   ```

2. **MONGODB_URI**: Your MongoDB connection string
   - Use MongoDB Atlas for production
   - Enable IP whitelist
   - Use strong passwords
   - URL-encode special characters

3. **Admin Credentials**: Change default values
   - **ADMIN_USERNAME**: Change from "admin"
   - **ADMIN_PASSWORD**: Use a strong password (minimum 12 characters)
   - Consider using a password manager

4. **API Keys**: Keep these secret
   - RESEND_API_KEY
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET

### Environment Variable Security

- Never commit `.env.local` to version control
- Use `.env.example` as a template
- Rotate API keys periodically
- Use different credentials for development/production

## 📝 **Admin Panel Usage**

### Logging In

1. Navigate to `/admin/login`
2. Enter credentials
3. Receive JWT token
4. Token stored in browser and sent with all admin requests

### Making Authenticated Requests

```typescript
// Store token after login
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
const { data } = await response.json();
localStorage.setItem("token", data.token);

// Use token in subsequent requests
const token = localStorage.getItem("token");
await fetch("/api/projects", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(projectData),
});
```

## 🚀 **Production Deployment Checklist**

### Before Deploying:

- [ ] Change all default credentials in .env
- [ ] Generate secure JWT_SECRET (32+ characters)
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Enable HTTPS/SSL
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Use strong database passwords
- [ ] Rotate all API keys
- [ ] Enable MongoDB encryption at rest
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure CORS if needed
- [ ] Review and test all rate limits
- [ ] Backup database
- [ ] Set up automated backups

### After Deploying:

- [ ] Test login functionality
- [ ] Verify JWT authentication works
- [ ] Check rate limiting is active
- [ ] Verify security headers are present
- [ ] Test contact form with rate limits
- [ ] Monitor error logs
- [ ] Set up alerts for failed login attempts
- [ ] Document recovery procedures

## 🔒 **Additional Recommendations**

### For Production:

1. **Use Redis for Rate Limiting**: Current implementation uses in-memory storage
   - Doesn't work across multiple server instances
   - Recommend Redis or similar for distributed systems

2. **Enable CORS**: Configure allowed origins

   ```typescript
   headers: {
     'Access-Control-Allow-Origin': 'https://yourdomain.com'
   }
   ```

3. **Add CSRF Protection**: For forms and state-changing operations

4. **Implement Logging**:
   - Log all authentication attempts
   - Log failed validations
   - Monitor rate limit violations

5. **Regular Security Audits**:
   - Run `npm audit` regularly
   - Update dependencies
   - Review access logs

6. **Backup Strategy**:
   - Daily automated backups
   - Test restore procedures
   - Store backups securely

## 📞 **Support & Issues**

If you discover a security vulnerability, please email security@yourdomain.com instead of using the issue tracker.

## 📚 **References**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
