# Cloudflare Access Configuration

> This document describes how to configure Cloudflare Access to protect the vibe-engineering web application with email OTP authentication.

## Prerequisites

Before starting, ensure you have:

- [ ] A Cloudflare account
- [ ] Zero Trust enabled on your account (free tier available)
- [ ] The worker deployed and accessible at `vibe-engineering.{subdomain}.workers.dev`

## Overview

Cloudflare Access sits in front of your worker and requires authentication before allowing access. We're using email OTP (One-time PIN) which:

- Requires no OAuth provider setup
- Works with any email address
- Sends a 6-digit code to verify identity

```
[User Request] -> [Cloudflare Access] -> [OTP Check] -> [Worker] -> [Response]
```

## Step 1: Access the Zero Trust Dashboard

1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Select your account if prompted
3. You should see the Zero Trust overview page

## Step 2: Create an Access Application

1. Navigate to: **Access** -> **Applications** in the left sidebar
2. Click **"Add an application"**
3. Select **"Self-hosted"** as the application type

### Application Configuration

| Field | Value | Notes |
|-------|-------|-------|
| Application name | `vibe-engineering` | Display name in dashboard |
| Session duration | `24 hours` | How long before re-auth (adjust as needed) |
| Application domain | `vibe-engineering.{your-subdomain}.workers.dev` | Your worker URL |

4. Click **"Next"** to proceed to policy configuration

## Step 3: Create an Access Policy

### Policy Settings

| Field | Value |
|-------|-------|
| Policy name | `Email OTP Access` |
| Action | `Allow` |

### Include Rules

Choose ONE of these approaches:

**Option A: Specific Emails (Recommended for personal projects)**

| Selector | Value |
|----------|-------|
| Emails | `your-email@example.com` |

Add additional emails as needed.

**Option B: Email Domain (For team access)**

| Selector | Value |
|----------|-------|
| Emails ending in | `@yourdomain.com` |

This allows anyone with an email at your domain.

5. Click **"Next"** to review
6. Click **"Add application"** to save

## Step 4: Configure Authentication Methods

1. Navigate to: **Settings** -> **Authentication** in the left sidebar
2. Under **Login methods**, ensure **"One-time PIN"** is enabled
3. This is usually enabled by default, but verify it's active

## Step 5: Test the Configuration

1. Open an **incognito/private browser window** (to avoid existing sessions)
2. Navigate to your worker URL: `https://vibe-engineering.{subdomain}.workers.dev`
3. You should see the Cloudflare Access login page
4. Enter your email address
5. Check your email for a 6-digit code
6. Enter the code
7. You should now see your application

### Expected Behavior

```
1. Visit URL -> See Cloudflare Access login
2. Enter email -> "Check your email" message
3. Enter OTP -> Redirected to application
4. Future visits -> Automatic (until session expires)
```

## Troubleshooting

### "Access Denied" after entering OTP

- Verify your email is in the allowed list
- Check that the policy action is "Allow" not "Block"
- Ensure the application domain matches exactly

### Not seeing the Cloudflare Access page

- The worker might not be deployed yet
- Access application domain might not match worker URL
- Try clearing browser cache and cookies

### OTP email not arriving

- Check spam folder
- Verify email address is correct
- Try a different email provider

### Session expires too quickly

- Increase the session duration in application settings
- Default is 24 hours, can extend to 30 days for low-risk apps

## Security Considerations

- **Email enumeration**: Access doesn't reveal if an email is valid, helping prevent enumeration
- **Rate limiting**: Cloudflare applies rate limits to prevent brute force
- **Session tokens**: Stored as HTTP-only cookies, not accessible via JavaScript
- **JWT claims**: Available in request headers for app-level authorization (future enhancement)

## Future Enhancements

These are not configured in this guide but can be added later:

1. **Custom domain**: Add a custom domain like `app.yourdomain.com`
2. **Multiple applications**: Protect multiple workers with different policies
3. **Groups**: Create user groups for easier policy management
4. **Device posture**: Require specific device configurations
5. **Geo-blocking**: Restrict access by country

## References

- [Cloudflare Access Documentation](https://developers.cloudflare.com/cloudflare-one/policies/access/)
- [One-time PIN Setup](https://developers.cloudflare.com/cloudflare-one/identity/one-time-pin/)
- [Zero Trust Getting Started](https://developers.cloudflare.com/cloudflare-one/setup/)
