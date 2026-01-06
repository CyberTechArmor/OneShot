# OneShot - Security Requirements

## CID Framework Phase 5: Security

---

## 1. Security Overview

### 1.1 Security Principles
```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DEFENSE IN DEPTH                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PERIMETER SECURITY                            │   │
│  │  • WAF (Vercel Edge)  • Rate Limiting  • DDoS Protection        │   │
│  │                                                                  │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │                 APPLICATION SECURITY                       │  │   │
│  │  │  • Input Validation  • Output Encoding  • CSRF Protection │  │   │
│  │  │                                                            │  │   │
│  │  │  ┌─────────────────────────────────────────────────────┐  │  │   │
│  │  │  │              AUTHENTICATION & AUTHORIZATION          │  │  │   │
│  │  │  │  • Supabase Auth  • JWT  • RLS Policies             │  │  │   │
│  │  │  │                                                      │  │  │   │
│  │  │  │  ┌───────────────────────────────────────────────┐  │  │  │   │
│  │  │  │  │                DATA SECURITY                   │  │  │  │   │
│  │  │  │  │  • Encryption at Rest  • Encryption in Transit │  │  │  │   │
│  │  │  │  │  • Key Management  • Data Minimization         │  │  │  │   │
│  │  │  │  └───────────────────────────────────────────────┘  │  │  │   │
│  │  │  └─────────────────────────────────────────────────────┘  │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Security Goals
| Goal | Description | Implementation |
|------|-------------|----------------|
| **Confidentiality** | Protect user data from unauthorized access | Encryption, access controls, RLS |
| **Integrity** | Ensure data isn't tampered with | Input validation, checksums, audit logs |
| **Availability** | Maintain service uptime | Rate limiting, DDoS protection, redundancy |
| **Non-repudiation** | Track user actions | Audit logging, timestamps |

---

## 2. Authentication Security

### 2.1 Authentication Flow
```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │───▶│  Verify  │───▶│  Issue   │───▶│  Store   │
│  Submit  │    │  Creds   │    │  Tokens  │    │  Session │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │
                     ▼
              ┌──────────────┐
              │ Supabase Auth │
              │  • bcrypt     │
              │  • JWT        │
              │  • Refresh    │
              └──────────────┘
```

### 2.2 Authentication Requirements

| Requirement | Implementation | Notes |
|-------------|----------------|-------|
| Password Hashing | bcrypt (via Supabase) | Work factor: 10 |
| Password Policy | Min 8 chars, complexity | Zod validation |
| MFA (Future) | TOTP via Supabase | Optional for users |
| Session Management | HTTP-only cookies | SameSite=Lax |
| Token Refresh | Automatic refresh | 1 hour access, 7 day refresh |
| OAuth Providers | Google, GitHub | Supabase OAuth |
| Account Lockout | 5 failed attempts | 15-minute lockout |
| Password Reset | Email token (1 hour) | Single use |

### 2.3 Session Security
```typescript
// Supabase SSR cookie configuration
const cookieOptions = {
  name: 'sb-auth-token',
  lifetime: 60 * 60 * 24 * 7, // 7 days
  domain: '',
  path: '/',
  sameSite: 'lax',
  secure: true, // HTTPS only in production
  httpOnly: true,
};
```

### 2.4 JWT Configuration
```typescript
// Access Token Claims
{
  "aud": "authenticated",
  "exp": 1234567890, // 1 hour
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "app_metadata": {
    "provider": "email"
  },
  "user_metadata": {
    "full_name": "User Name"
  }
}
```

---

## 3. Authorization Security

### 3.1 Authorization Model
```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AUTHORIZATION LAYERS                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Layer 1: API Route Guards                                               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  • Verify JWT on every request                                     │  │
│  │  • Extract user context                                            │  │
│  │  • Reject unauthenticated requests                                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Layer 2: Business Logic Authorization                                   │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  • Verify user owns/has access to resource                         │  │
│  │  • Check role permissions (owner, admin, member, viewer)           │  │
│  │  • Validate action is permitted for role                           │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Layer 3: Row-Level Security (RLS)                                       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  • Database-enforced access control                                │  │
│  │  • Automatic filtering based on user context                       │  │
│  │  • Defense in depth against authorization bugs                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Role Permissions Matrix

| Permission | Owner | Admin | Member | Viewer |
|------------|-------|-------|--------|--------|
| View Project | ✅ | ✅ | ✅ | ✅ |
| Edit Project Settings | ✅ | ✅ | ❌ | ❌ |
| Delete Project | ✅ | ❌ | ❌ | ❌ |
| Start Discovery Session | ✅ | ✅ | ✅ | ❌ |
| Invite Members | ✅ | ✅ | ❌ | ❌ |
| Remove Members | ✅ | ✅ | ❌ | ❌ |
| Generate Documents | ✅ | ✅ | ✅ | ❌ |
| View Recordings | ✅ | ✅ | ✅ | ✅ |
| Delete Recordings | ✅ | ✅ | ❌ | ❌ |

### 3.3 RLS Policy Examples
```sql
-- Projects: Users can only access their own projects or projects they're members of
CREATE POLICY "project_access_policy" ON projects
FOR ALL USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = projects.id
    AND user_id = auth.uid()
  )
);

-- Discovery Messages: Only visible to project members
CREATE POLICY "message_access_policy" ON discovery_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM discovery_sessions ds
    JOIN project_members pm ON ds.project_id = pm.project_id
    WHERE ds.id = discovery_messages.session_id
    AND pm.user_id = auth.uid()
  )
);
```

---

## 4. Data Security

### 4.1 Encryption Standards

| Data State | Method | Details |
|------------|--------|---------|
| **At Rest** | AES-256 | Supabase default encryption |
| **In Transit** | TLS 1.3 | Vercel + Supabase enforce HTTPS |
| **Backups** | AES-256 | Supabase encrypted backups |
| **File Storage** | AES-256 | Supabase Storage encryption |

### 4.2 Sensitive Data Handling

| Data Type | Classification | Handling |
|-----------|---------------|----------|
| Passwords | Critical | Never stored (Supabase Auth handles) |
| API Keys | Critical | Environment variables, never logged |
| Email | PII | Encrypted at rest, access logged |
| User Content | Confidential | RLS protected, encrypted storage |
| Recordings | Confidential | Encrypted storage, access controlled |
| Payment Info | Critical | Never stored (use Stripe) |

### 4.3 Data Retention Policy
```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA RETENTION                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Active Data:                                                            │
│  • Projects, Sessions, Documents: Retained while account active          │
│  • Audit Logs: 90 days rolling                                           │
│                                                                          │
│  Deleted Data:                                                           │
│  • Soft delete: 30 days recovery window                                  │
│  • Hard delete: Permanent after recovery window                          │
│                                                                          │
│  Account Deletion:                                                       │
│  • User requests deletion                                                │
│  • 14-day grace period                                                   │
│  • All user data permanently removed                                     │
│  • Audit logs retained for 90 days (anonymized)                          │
│                                                                          │
│  Meeting Recordings:                                                     │
│  • Default: 90 days retention                                            │
│  • User can delete earlier                                               │
│  • Download option before deletion                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Application Security

### 5.1 Input Validation
```typescript
// Zod schemas for all user input
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Invalid characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
});

export const messageSchema = z.object({
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message too long'),
  sessionId: z.string().uuid(),
});
```

### 5.2 Output Encoding
```typescript
// React automatically escapes JSX content
// Additional sanitization for user-generated HTML (if needed)
import DOMPurify from 'dompurify';

function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
}
```

### 5.3 CSRF Protection
```typescript
// Next.js App Router with Server Actions
// CSRF protection is automatic with Server Actions

// For API routes, verify origin
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'https://oneshot.app',
  ];

  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }
  // Continue processing...
}
```

### 5.4 Content Security Policy
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Required for Next.js
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co wss://*.livekit.cloud https://api.elevenlabs.io",
      "media-src 'self' blob:",
      "frame-src 'self'",
    ].join('; '),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(self), geolocation=()',
  },
];
```

### 5.5 Rate Limiting
```typescript
// API Rate Limits (using Upstash Redis + Vercel Edge)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
});

// Endpoint-specific limits
const limits = {
  'auth/login': { requests: 5, window: '15 m' },      // Prevent brute force
  'auth/signup': { requests: 3, window: '1 h' },       // Prevent spam
  'discovery/message': { requests: 60, window: '1 m' }, // Allow active conversations
  'voice/transcribe': { requests: 20, window: '1 m' }, // Cost control
  'meetings/create': { requests: 10, window: '1 h' },   // Prevent abuse
};
```

---

## 6. Third-Party Security

### 6.1 API Key Management
```
┌─────────────────────────────────────────────────────────────────────────┐
│                      API KEY SECURITY                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Storage:                                                                │
│  • All API keys stored in Vercel Environment Variables                   │
│  • Never committed to version control                                    │
│  • Separate keys for dev/staging/production                              │
│                                                                          │
│  Access:                                                                 │
│  • Server-side only (never exposed to client)                            │
│  • Accessed via process.env                                              │
│  • Logged access for audit purposes                                      │
│                                                                          │
│  Rotation:                                                               │
│  • Rotate every 90 days minimum                                          │
│  • Immediate rotation if exposed                                         │
│  • Zero-downtime rotation process                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Third-Party Risk Assessment

| Service | Data Shared | Security Measures | Risk Level |
|---------|-------------|-------------------|------------|
| **Supabase** | All user data | SOC2, encryption, RLS | Medium |
| **Vercel** | Application code | SOC2, encrypted | Low |
| **ElevenLabs** | Voice audio | Processing only, no storage | Medium |
| **LiveKit** | Meeting streams | E2E encryption option | Medium |
| **Anthropic/OpenAI** | Conversation text | API agreements, no training | Medium |
| **Resend** | Email addresses | SOC2, minimal data | Low |

### 6.3 Vendor Security Requirements
- [ ] SOC 2 Type II certification (or equivalent)
- [ ] GDPR compliance
- [ ] Data processing agreements (DPA) in place
- [ ] Incident notification procedures
- [ ] Regular security assessments

---

## 7. LiveKit & Meeting Security

### 7.1 Meeting Security Features
```
┌─────────────────────────────────────────────────────────────────────────┐
│                      MEETING SECURITY                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Room Access:                                                            │
│  • Token-based authentication (short-lived JWTs)                         │
│  • Unique room names (UUIDs)                                             │
│  • Invite codes with expiration                                          │
│                                                                          │
│  Participant Control:                                                    │
│  • Host can remove participants                                          │
│  • Waiting room option (future)                                          │
│  • Participant limits per room                                           │
│                                                                          │
│  Data Protection:                                                        │
│  • DTLS-SRTP encryption for media                                        │
│  • E2E encryption option for sensitive meetings                          │
│  • Recording access restricted to project members                        │
│                                                                          │
│  Recording Security:                                                     │
│  • Recordings encrypted at rest                                          │
│  • Automatic deletion after retention period                             │
│  • Download requires authentication                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 LiveKit Token Generation
```typescript
import { AccessToken } from 'livekit-server-sdk';

export async function generateMeetingToken(
  userId: string,
  roomName: string,
  isHost: boolean
): Promise<string> {
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: userId,
      ttl: '2h', // Token expires in 2 hours
    }
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    // Host-only permissions
    roomAdmin: isHost,
    roomRecord: isHost,
  });

  return token.toJwt();
}
```

---

## 8. Voice Integration Security

### 8.1 Audio Data Handling
```
┌─────────────────────────────────────────────────────────────────────────┐
│                      AUDIO SECURITY                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Browser → Server:                                                       │
│  • WebSocket over TLS (wss://)                                           │
│  • Audio chunks streamed, not stored in memory                           │
│  • Connection authenticated with session token                           │
│                                                                          │
│  Server → ElevenLabs:                                                    │
│  • HTTPS API calls only                                                  │
│  • API key never exposed to client                                       │
│  • Audio processed, not stored by ElevenLabs (per terms)                 │
│                                                                          │
│  Transcription Storage:                                                  │
│  • Converted text stored, raw audio discarded                            │
│  • Associated with user and session                                      │
│  • Subject to RLS policies                                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Voice Permission Handling
```typescript
// Request microphone permission explicitly
async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks immediately after permission check
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone permission denied');
    return false;
  }
}

// Clear indicator when recording
function VoiceRecordingIndicator({ isRecording }: { isRecording: boolean }) {
  if (!isRecording) return null;
  return (
    <div className="recording-indicator" aria-live="polite">
      🔴 Recording in progress
    </div>
  );
}
```

---

## 9. Incident Response

### 9.1 Security Incident Categories

| Severity | Definition | Response Time | Examples |
|----------|------------|---------------|----------|
| **Critical** | Active exploit, data breach | < 1 hour | Data leak, account takeover |
| **High** | Vulnerability with exploit potential | < 4 hours | Auth bypass, SQL injection |
| **Medium** | Security weakness | < 24 hours | Missing rate limit, XSS |
| **Low** | Minor security improvement | < 1 week | Header misconfiguration |

### 9.2 Response Procedure
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    INCIDENT RESPONSE FLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. DETECT                                                               │
│     • Automated alerts (Sentry, monitoring)                              │
│     • User reports                                                       │
│     • Security scanning                                                  │
│                                                                          │
│  2. CONTAIN                                                              │
│     • Isolate affected systems                                           │
│     • Revoke compromised credentials                                     │
│     • Block malicious IPs/users                                          │
│                                                                          │
│  3. INVESTIGATE                                                          │
│     • Analyze logs and audit trails                                      │
│     • Determine scope and impact                                         │
│     • Identify root cause                                                │
│                                                                          │
│  4. REMEDIATE                                                            │
│     • Fix vulnerability                                                  │
│     • Deploy patches                                                     │
│     • Verify fix effectiveness                                           │
│                                                                          │
│  5. COMMUNICATE                                                          │
│     • Notify affected users (if required)                                │
│     • Update status page                                                 │
│     • Report to authorities (if required)                                │
│                                                                          │
│  6. REVIEW                                                               │
│     • Post-mortem analysis                                               │
│     • Update procedures                                                  │
│     • Implement preventive measures                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Compliance Considerations

### 10.1 GDPR Requirements
| Requirement | Implementation |
|-------------|----------------|
| Lawful basis | Consent + contract |
| Data minimization | Only collect necessary data |
| Right to access | Export functionality |
| Right to erasure | Account deletion |
| Data portability | JSON export |
| Privacy by design | RLS, encryption, minimal logging |

### 10.2 Security Checklist (Pre-Launch)
- [ ] All API keys rotated from development
- [ ] Production database separate from staging
- [ ] RLS policies tested and verified
- [ ] Rate limiting configured and tested
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't contain sensitive data
- [ ] CSP headers configured
- [ ] SSL/TLS certificates valid
- [ ] Backup procedures tested
- [ ] Incident response plan documented
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent implemented
- [ ] Data processing agreements signed

---

## 11. Security Monitoring

### 11.1 Monitoring Stack
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SECURITY MONITORING                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Sentry    │  │   Axiom     │  │  Supabase   │  │   Vercel    │    │
│  │   Errors    │  │    Logs     │  │   Audit     │  │  Analytics  │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │                │            │
│         └────────────────┴────────────────┴────────────────┘            │
│                                    │                                     │
│                                    ▼                                     │
│                          ┌─────────────────┐                            │
│                          │     Alerts      │                            │
│                          │  (Slack/Email)  │                            │
│                          └─────────────────┘                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Alert Triggers
| Event | Action | Channel |
|-------|--------|---------|
| Failed login attempts > 5 | Alert + temporary lock | Slack |
| Unusual API usage patterns | Alert + investigate | Slack |
| Error rate spike | Alert + on-call | PagerDuty |
| Database connection issues | Alert + failover | PagerDuty |
| Certificate expiration (30 days) | Alert | Email |
| Dependency vulnerability | Alert + PR | GitHub |

---

*Document Version: 1.0*
*Created: 2026-01-06*
*Status: Draft - Pending Review*
