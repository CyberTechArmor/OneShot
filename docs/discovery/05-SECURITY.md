# OneShot: Collaborative Intelligence Development Platform

## CID Framework - Phase 5: Security

---

## 5.1 Security Overview

OneShot handles sensitive project information, voice data, and real-time communications. This document outlines the security measures, compliance requirements, and best practices to protect user data and ensure platform integrity.

### Security Principles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY PRINCIPLES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. DEFENSE IN DEPTH                                                        │
│     └─ Multiple layers of security controls                                 │
│                                                                             │
│  2. LEAST PRIVILEGE                                                         │
│     └─ Minimum necessary permissions for all access                         │
│                                                                             │
│  3. ZERO TRUST                                                              │
│     └─ Verify every request, trust no one by default                        │
│                                                                             │
│  4. ENCRYPTION EVERYWHERE                                                   │
│     └─ Data encrypted at rest and in transit                                │
│                                                                             │
│  5. PRIVACY BY DESIGN                                                       │
│     └─ Privacy considerations built into architecture                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.2 Authentication & Authorization

### 5.2.1 Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   User                    OneShot                    OAuth Provider         │
│    │                         │                            │                 │
│    │─── Login Request ──────▶│                            │                 │
│    │                         │─── OAuth Redirect ────────▶│                 │
│    │                         │                            │                 │
│    │◀────────────────────────│◀── Auth Code ─────────────│                 │
│    │                         │                            │                 │
│    │                         │─── Token Exchange ────────▶│                 │
│    │                         │◀── Access Token ──────────│                 │
│    │                         │                            │                 │
│    │                         │─── Verify & Create ───────│                 │
│    │                         │    Session/JWT             │                 │
│    │◀── Session Cookie ──────│                            │                 │
│    │                         │                            │                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2.2 NextAuth.js Configuration

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // Magic link valid for 10 minutes
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Additional sign-in validation
      if (!user.email) return false;

      // Check for blocked domains (optional)
      const blockedDomains = process.env.BLOCKED_EMAIL_DOMAINS?.split(",") || [];
      const domain = user.email.split("@")[1];
      if (blockedDomains.includes(domain)) {
        return false;
      }

      return true;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },

  events: {
    async signIn({ user, isNewUser }) {
      // Log sign-in events for audit
      console.log(`User signed in: ${user.email}, New: ${isNewUser}`);
    },
  },
};
```

### 5.2.3 Authorization Middleware

```typescript
// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    const isPublicApi = req.nextUrl.pathname.startsWith("/api/public");

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Protect API routes (except public ones)
    if (isApiRoute && !isPublicApi && !isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public routes
        const publicPaths = ["/", "/auth", "/api/public", "/join"];
        const isPublic = publicPaths.some((path) =>
          req.nextUrl.pathname.startsWith(path)
        );

        return isPublic || !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### 5.2.4 Role-Based Access Control (RBAC)

```typescript
// src/lib/permissions.ts
export enum Permission {
  // Project permissions
  PROJECT_VIEW = "project:view",
  PROJECT_EDIT = "project:edit",
  PROJECT_DELETE = "project:delete",
  PROJECT_MANAGE_MEMBERS = "project:manage_members",

  // Conversation permissions
  CONVERSATION_VIEW = "conversation:view",
  CONVERSATION_CREATE = "conversation:create",
  CONVERSATION_DELETE = "conversation:delete",

  // Session permissions
  SESSION_HOST = "session:host",
  SESSION_JOIN = "session:join",
  SESSION_RECORD = "session:record",

  // File permissions
  FILE_VIEW = "file:view",
  FILE_UPLOAD = "file:upload",
  FILE_DELETE = "file:delete",
}

export const RolePermissions: Record<MemberRole, Permission[]> = {
  OWNER: Object.values(Permission), // All permissions

  ADMIN: [
    Permission.PROJECT_VIEW,
    Permission.PROJECT_EDIT,
    Permission.PROJECT_MANAGE_MEMBERS,
    Permission.CONVERSATION_VIEW,
    Permission.CONVERSATION_CREATE,
    Permission.CONVERSATION_DELETE,
    Permission.SESSION_HOST,
    Permission.SESSION_JOIN,
    Permission.SESSION_RECORD,
    Permission.FILE_VIEW,
    Permission.FILE_UPLOAD,
    Permission.FILE_DELETE,
  ],

  MEMBER: [
    Permission.PROJECT_VIEW,
    Permission.CONVERSATION_VIEW,
    Permission.CONVERSATION_CREATE,
    Permission.SESSION_JOIN,
    Permission.FILE_VIEW,
    Permission.FILE_UPLOAD,
  ],

  VIEWER: [
    Permission.PROJECT_VIEW,
    Permission.CONVERSATION_VIEW,
    Permission.SESSION_JOIN,
    Permission.FILE_VIEW,
  ],
};

// Permission check utility
export async function hasPermission(
  userId: string,
  projectId: string,
  permission: Permission
): Promise<boolean> {
  const member = await db.projectMember.findUnique({
    where: {
      projectId_userId: { projectId, userId },
    },
  });

  if (!member) return false;

  return RolePermissions[member.role].includes(permission);
}

// Middleware wrapper for tRPC
export function requirePermission(permission: Permission) {
  return async (opts: { ctx: Context; input: { projectId: string } }) => {
    const allowed = await hasPermission(
      opts.ctx.session.user.id,
      opts.input.projectId,
      permission
    );

    if (!allowed) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
  };
}
```

---

## 5.3 Data Protection

### 5.3.1 Encryption Standards

| Data Type | At Rest | In Transit | Key Management |
|-----------|---------|------------|----------------|
| User credentials | bcrypt hash (N/A for OAuth) | TLS 1.3 | N/A |
| Session tokens | JWT (HS256) | TLS 1.3 | env NEXTAUTH_SECRET |
| Database | Neon encryption (AES-256) | TLS 1.3 | Managed by Neon |
| Object storage | R2 encryption (AES-256) | TLS 1.3 | Managed by Cloudflare |
| Voice recordings | R2 encryption (AES-256) | TLS 1.3 (LiveKit) | Managed by Cloudflare |
| AI conversations | Provider encryption | TLS 1.3 | Provider managed |

### 5.3.2 Sensitive Data Handling

```typescript
// src/lib/security/data-protection.ts

// Fields to redact from logs
const SENSITIVE_FIELDS = [
  "password",
  "token",
  "secret",
  "apiKey",
  "authorization",
  "cookie",
  "creditCard",
  "ssn",
];

// Redact sensitive data from objects
export function redactSensitive(obj: Record<string, any>): Record<string, any> {
  const redacted = { ...obj };

  for (const key of Object.keys(redacted)) {
    if (SENSITIVE_FIELDS.some((f) => key.toLowerCase().includes(f))) {
      redacted[key] = "[REDACTED]";
    } else if (typeof redacted[key] === "object" && redacted[key] !== null) {
      redacted[key] = redactSensitive(redacted[key]);
    }
  }

  return redacted;
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove JS protocol
    .trim();
}

// Validate and sanitize file uploads
export async function validateFileUpload(
  file: File,
  options: {
    maxSize: number;
    allowedTypes: string[];
  }
): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size > options.maxSize) {
    return { valid: false, error: "File too large" };
  }

  // Check MIME type
  if (!options.allowedTypes.includes(file.type)) {
    return { valid: false, error: "File type not allowed" };
  }

  // Verify magic bytes match MIME type (basic check)
  const buffer = await file.slice(0, 4).arrayBuffer();
  const header = new Uint8Array(buffer);

  // Add magic byte validation as needed
  // ...

  return { valid: true };
}
```

### 5.3.3 Data Retention Policy

```typescript
// src/lib/security/data-retention.ts

export const DataRetentionPolicy = {
  // User data
  user: {
    active: "indefinite",
    deleted: "30 days", // After account deletion
  },

  // Project data
  project: {
    active: "indefinite",
    archived: "1 year",
    deleted: "30 days",
  },

  // Conversations
  conversation: {
    active: "indefinite",
    completed: "1 year",
  },

  // Recordings
  recording: {
    default: "90 days",
    premium: "1 year",
  },

  // Session logs
  sessionLogs: {
    default: "30 days",
  },

  // Audit logs
  auditLogs: {
    default: "2 years",
  },
};

// Cleanup job (run daily via cron)
export async function cleanupExpiredData() {
  const now = new Date();

  // Delete soft-deleted users after retention period
  await db.user.deleteMany({
    where: {
      deletedAt: {
        lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  // Archive old completed conversations
  // ...

  // Delete expired recordings
  // ...
}
```

---

## 5.4 API Security

### 5.4.1 Rate Limiting

```typescript
// src/lib/security/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different rate limiters for different endpoints
export const rateLimiters = {
  // General API: 100 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "ratelimit:api",
  }),

  // Auth endpoints: 5 requests per minute
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "ratelimit:auth",
  }),

  // AI endpoints: 20 requests per minute
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
    prefix: "ratelimit:ai",
  }),

  // Voice synthesis: 30 requests per minute
  voice: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    analytics: true,
    prefix: "ratelimit:voice",
  }),

  // File uploads: 10 requests per minute
  upload: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:upload",
  }),
};

// Rate limit middleware
export async function rateLimit(
  identifier: string,
  limiter: keyof typeof rateLimiters = "api"
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const { success, limit, remaining, reset } = await rateLimiters[limiter].limit(
    identifier
  );

  return { success, limit, remaining, reset };
}

// Usage in API route
export async function withRateLimit(
  req: NextRequest,
  limiterType: keyof typeof rateLimiters = "api"
) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "anonymous";
  const result = await rateLimit(ip, limiterType);

  if (!result.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toString(),
          "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null; // Continue with request
}
```

### 5.4.2 Input Validation

```typescript
// src/lib/security/validation.ts
import { z } from "zod";

// Shared validation schemas
export const schemas = {
  // User input
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain uppercase, lowercase, and number",
    }),
  name: z.string().min(1).max(100).trim(),

  // Project input
  projectName: z
    .string()
    .min(1)
    .max(100)
    .trim()
    .regex(/^[a-zA-Z0-9\s\-_]+$/, {
      message: "Project name contains invalid characters",
    }),
  projectDescription: z.string().max(500).trim().optional(),

  // Message input
  messageContent: z
    .string()
    .min(1)
    .max(10000)
    .transform((s) => s.trim()),

  // File upload
  fileName: z
    .string()
    .max(255)
    .regex(/^[a-zA-Z0-9\-_\.]+$/, {
      message: "Invalid file name",
    }),

  // UUID
  uuid: z.string().uuid(),

  // Invite token
  inviteToken: z.string().length(25).regex(/^[a-zA-Z0-9]+$/),
};

// Validation error formatter
export function formatValidationError(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }
  return errors;
}
```

### 5.4.3 CORS Configuration

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ];
  },
};
```

### 5.4.4 Security Headers

```typescript
// src/middleware.ts (additional headers)
const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-XSS-Protection": "1; mode=block",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=()",
  "Content-Security-Policy": `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    connect-src 'self' https://*.livekit.cloud wss://*.livekit.cloud https://api.elevenlabs.io https://api.anthropic.com https://api.deepgram.com;
    media-src 'self' blob: https://*.r2.cloudflarestorage.com;
    frame-ancestors 'none';
  `.replace(/\s+/g, " ").trim(),
};
```

---

## 5.5 Real-time Security (LiveKit)

### 5.5.1 Token Security

```typescript
// src/lib/livekit/token.ts
import { AccessToken } from "livekit-server-sdk";

export async function generateSecureToken(
  roomName: string,
  participantIdentity: string,
  participantName: string,
  options: {
    isHost: boolean;
    metadata?: Record<string, any>;
  }
): Promise<string> {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: participantIdentity,
      name: participantName,
      ttl: "4h", // Token expires in 4 hours
      metadata: JSON.stringify({
        ...options.metadata,
        issuedAt: Date.now(),
      }),
    }
  );

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    // Host-only permissions
    roomAdmin: options.isHost,
    roomRecord: options.isHost,
  });

  return at.toJwt();
}

// Validate invite token before generating LiveKit token
export async function validateInviteToken(
  token: string,
  sessionId: string
): Promise<boolean> {
  const session = await db.liveSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.inviteToken !== token) {
    return false;
  }

  if (session.status === "ENDED") {
    return false;
  }

  return true;
}
```

### 5.5.2 Room Security

```typescript
// src/lib/livekit/room-security.ts

// Webhook signature verification
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.LIVEKIT_API_SECRET!)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Room name generation (include project ID for isolation)
export function generateSecureRoomName(projectId: string): string {
  const crypto = require("crypto");
  const randomPart = crypto.randomBytes(8).toString("hex");
  return `${projectId}-${randomPart}`;
}
```

---

## 5.6 Voice & AI Security

### 5.6.1 Voice Data Protection

```typescript
// src/lib/voice/security.ts

// Voice data handling policies
export const VoiceSecurityPolicy = {
  // Audio processing
  processing: {
    // Don't store raw audio longer than necessary
    rawAudioRetention: "session_only",
    // Transcripts can be stored
    transcriptRetention: "project_lifetime",
  },

  // Consent requirements
  consent: {
    recordingNotification: true,
    explicitConsentRequired: true,
    consentRecordKeeping: true,
  },

  // Data minimization
  minimization: {
    stripMetadata: true,
    anonymizeIfPossible: false, // Needed for speaker identification
  },
};

// Recording consent check
export async function checkRecordingConsent(
  sessionId: string,
  userId: string
): Promise<boolean> {
  const consent = await db.recordingConsent.findUnique({
    where: {
      sessionId_userId: { sessionId, userId },
    },
  });

  return consent?.granted ?? false;
}

// Record consent
export async function recordConsent(
  sessionId: string,
  userId: string,
  granted: boolean
): Promise<void> {
  await db.recordingConsent.upsert({
    where: {
      sessionId_userId: { sessionId, userId },
    },
    create: {
      sessionId,
      userId,
      granted,
      grantedAt: granted ? new Date() : null,
    },
    update: {
      granted,
      grantedAt: granted ? new Date() : null,
    },
  });
}
```

### 5.6.2 AI Data Security

```typescript
// src/lib/ai/security.ts

// AI request sanitization
export function sanitizeAIInput(messages: Message[]): Message[] {
  return messages.map((m) => ({
    ...m,
    content: m.content
      // Remove potential PII patterns
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN_REDACTED]")
      .replace(/\b\d{16}\b/g, "[CC_REDACTED]")
      .replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        "[EMAIL_REDACTED]"
      )
      // Keep other content as-is (user's project info)
      .trim(),
  }));
}

// AI response validation
export function validateAIResponse(response: string): {
  valid: boolean;
  sanitized: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  let sanitized = response;

  // Check for potentially harmful content
  const harmfulPatterns = [
    /\bpassword\s*[:=]\s*\S+/gi,
    /\bapi[_-]?key\s*[:=]\s*\S+/gi,
    /\bsecret\s*[:=]\s*\S+/gi,
  ];

  for (const pattern of harmfulPatterns) {
    if (pattern.test(sanitized)) {
      warnings.push(`Potential sensitive data detected: ${pattern.source}`);
      sanitized = sanitized.replace(pattern, "[REDACTED]");
    }
  }

  return {
    valid: warnings.length === 0,
    sanitized,
    warnings,
  };
}
```

---

## 5.7 Audit Logging

### 5.7.1 Audit Log Schema

```prisma
// Add to prisma/schema.prisma

model AuditLog {
  id          String   @id @default(cuid())
  timestamp   DateTime @default(now())

  // Actor
  userId      String?
  userEmail   String?
  ipAddress   String?
  userAgent   String?

  // Action
  action      AuditAction
  resource    String       // e.g., "project", "conversation", "session"
  resourceId  String?

  // Context
  metadata    Json         @default("{}")
  status      AuditStatus  @default(SUCCESS)

  @@index([userId])
  @@index([action])
  @@index([resource])
  @@index([timestamp])
}

enum AuditAction {
  // Auth
  SIGN_IN
  SIGN_OUT
  SIGN_UP
  PASSWORD_RESET

  // Project
  PROJECT_CREATE
  PROJECT_UPDATE
  PROJECT_DELETE
  PROJECT_MEMBER_ADD
  PROJECT_MEMBER_REMOVE

  // Conversation
  CONVERSATION_START
  CONVERSATION_END
  MESSAGE_SEND

  // Session
  SESSION_CREATE
  SESSION_JOIN
  SESSION_LEAVE
  RECORDING_START
  RECORDING_STOP

  // File
  FILE_UPLOAD
  FILE_DOWNLOAD
  FILE_DELETE

  // Admin
  USER_SUSPEND
  USER_DELETE
  SETTINGS_CHANGE
}

enum AuditStatus {
  SUCCESS
  FAILURE
  BLOCKED
}
```

### 5.7.2 Audit Logger Service

```typescript
// src/lib/security/audit.ts
import { db } from "@/lib/db";
import { AuditAction, AuditStatus } from "@prisma/client";

interface AuditLogEntry {
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  status?: AuditStatus;
}

export async function auditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: entry.userId,
        userEmail: entry.userEmail,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        metadata: entry.metadata ?? {},
        status: entry.status ?? "SUCCESS",
      },
    });
  } catch (error) {
    // Don't fail the main operation if audit logging fails
    console.error("Audit log error:", error);
  }
}

// Helper to extract request context
export function getRequestContext(req: NextRequest): {
  ipAddress: string;
  userAgent: string;
} {
  return {
    ipAddress: req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown",
    userAgent: req.headers.get("user-agent") ?? "unknown",
  };
}

// Usage example
export async function logProjectCreation(
  userId: string,
  userEmail: string,
  projectId: string,
  projectName: string,
  req: NextRequest
) {
  const context = getRequestContext(req);

  await auditLog({
    userId,
    userEmail,
    ...context,
    action: "PROJECT_CREATE",
    resource: "project",
    resourceId: projectId,
    metadata: { projectName },
  });
}
```

---

## 5.8 Compliance Requirements

### 5.8.1 GDPR Compliance

| Requirement | Implementation |
|-------------|----------------|
| Right to access | User data export endpoint |
| Right to rectification | Profile edit functionality |
| Right to erasure | Account deletion with cascade |
| Data portability | Export in JSON/CSV format |
| Consent management | Explicit opt-in for features |
| Privacy by design | Data minimization, encryption |
| Breach notification | Incident response plan + logging |

### 5.8.2 User Data Export

```typescript
// src/lib/gdpr/export.ts

export async function exportUserData(userId: string): Promise<UserDataExport> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      ownedProjects: {
        include: {
          conversations: {
            include: { messages: true },
          },
          files: true,
        },
      },
      memberships: {
        include: { project: true },
      },
    },
  });

  if (!user) throw new Error("User not found");

  return {
    exportedAt: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      preferences: user.preferences,
    },
    projects: user.ownedProjects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      createdAt: p.createdAt,
      conversations: p.conversations.map((c) => ({
        id: c.id,
        type: c.type,
        messages: c.messages.map((m) => ({
          id: m.id,
          content: m.content,
          senderType: m.senderType,
          createdAt: m.createdAt,
        })),
      })),
    })),
    memberships: user.memberships.map((m) => ({
      projectId: m.projectId,
      projectName: m.project.name,
      role: m.role,
      joinedAt: m.joinedAt,
    })),
  };
}
```

### 5.8.3 Account Deletion

```typescript
// src/lib/gdpr/deletion.ts

export async function deleteUserAccount(userId: string): Promise<void> {
  // Soft delete first (for retention period)
  await db.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      email: `deleted_${userId}@deleted.local`,
      name: "Deleted User",
      preferences: {},
    },
  });

  // Anonymize owned content
  await db.message.updateMany({
    where: { senderId: userId },
    data: { senderId: null },
  });

  // Transfer project ownership or delete
  const ownedProjects = await db.project.findMany({
    where: { ownerId: userId },
    include: {
      members: {
        where: { role: "ADMIN" },
        take: 1,
      },
    },
  });

  for (const project of ownedProjects) {
    if (project.members.length > 0) {
      // Transfer to admin
      await db.project.update({
        where: { id: project.id },
        data: { ownerId: project.members[0].userId },
      });
    } else {
      // Soft delete project
      await db.project.update({
        where: { id: project.id },
        data: { status: "ARCHIVED", deletedAt: new Date() },
      });
    }
  }

  // Log deletion
  await auditLog({
    userId,
    action: "USER_DELETE",
    resource: "user",
    resourceId: userId,
    metadata: { deletionType: "user_requested" },
  });
}
```

---

## 5.9 Security Checklist

### 5.9.1 Pre-Launch Security Checklist

```
Authentication & Authorization
□ OAuth providers configured securely
□ JWT secrets rotated and strong
□ Session expiration configured
□ RBAC implemented and tested
□ Password requirements enforced (if applicable)

Data Protection
□ All data encrypted at rest
□ TLS 1.3 enforced
□ Sensitive data redacted from logs
□ Input validation on all endpoints
□ Output encoding implemented

API Security
□ Rate limiting configured
□ CORS properly restricted
□ Security headers set
□ API versioning implemented
□ Error messages don't leak info

Infrastructure
□ Environment variables secured
□ Secrets not in code/repos
□ Database access restricted
□ Backup encryption enabled
□ Monitoring and alerting set up

Compliance
□ Privacy policy published
□ Cookie consent implemented
□ Data export functionality
□ Account deletion functionality
□ Audit logging enabled

Testing
□ Security unit tests passing
□ Penetration testing completed
□ Dependency vulnerabilities scanned
□ OWASP Top 10 addressed
□ Incident response plan documented
```

---

## 5.10 Incident Response

### 5.10.1 Response Plan

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INCIDENT RESPONSE PLAN                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SEVERITY LEVELS                                                            │
│  ───────────────                                                            │
│  P0 - Critical: Data breach, service compromise                             │
│  P1 - High: Significant vulnerability, partial outage                       │
│  P2 - Medium: Minor vulnerability, degraded service                         │
│  P3 - Low: Informational, cosmetic issues                                   │
│                                                                             │
│  RESPONSE TIMELINE                                                          │
│  ─────────────────                                                          │
│  P0: Immediate response, all hands                                          │
│  P1: Response within 1 hour                                                 │
│  P2: Response within 24 hours                                               │
│  P3: Response within 1 week                                                 │
│                                                                             │
│  RESPONSE STEPS                                                             │
│  ──────────────                                                             │
│  1. IDENTIFY: Detect and confirm incident                                   │
│  2. CONTAIN: Limit damage and prevent spread                                │
│  3. ERADICATE: Remove threat and fix vulnerability                          │
│  4. RECOVER: Restore services and verify                                    │
│  5. LEARN: Post-mortem and improve                                          │
│                                                                             │
│  COMMUNICATION                                                              │
│  ─────────────                                                              │
│  - Internal: Slack #security-incidents                                      │
│  - External: status.oneshot.app                                             │
│  - Users: Email notification within 72h (GDPR)                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

*Document Version: 1.0*
*Created: January 2026*
*Status: Security Phase Complete*
