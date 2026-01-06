# Constraints: OneShot

## Technical Constraints

### Technology Stack

| Component | Requirement | Rationale |
|-----------|-------------|-----------|
| **Language** | TypeScript | CID Stack standard |
| **Backend Framework** | Express | CID Stack standard |
| **ORM** | Drizzle | CID Stack standard |
| **Validation** | Zod | CID Stack standard |
| **Testing** | Vitest | CID Stack standard |
| **Frontend** | React | CID Stack standard, responsive design |
| **Database** | PostgreSQL | CID Stack standard |

### Infrastructure

| Component | Requirement | Notes |
|-----------|-------------|-------|
| **Containerization** | Docker with Docker Compose | Single-host deployment |
| **Installation** | Single install script | Interactive prompts for configuration |
| **Default Port** | 5090 | Configurable via ENV |
| **Reverse Proxy** | On by default (Traefik or Caddy) | Auto-SSL with domain |
| **SSL** | Required if reverse proxy enabled | Let's Encrypt via proxy |

### Distribution

| Method | Specification |
|--------|---------------|
| **Container Image** | GitHub-built, pushed to registry |
| **Docker Compose** | ENV-based configuration |
| **Install Script** | Prompts: proxy (default: on), domain (if proxy), port (default: 5090) |

### Storage

| Type | Default | Alternative |
|------|---------|-------------|
| **File Storage** | Local filesystem (`./data`) | S3-compatible (MinIO, AWS, etc.) |
| **Database** | PostgreSQL (containerized) | External PostgreSQL via connection string |

### Voice Pipeline

| Stage | Service | Notes |
|-------|---------|-------|
| **Speech-to-Text** | ElevenLabs STT | User speech → text |
| **AI Processing** | Claude Opus 4.5 (default) | Text → AI response |
| **Text-to-Speech** | ElevenLabs TTS | AI response → audio |
| **Fallback** | ElevenLabs Conversational AI | If primary approach not feasible |

### AI Integration

| Vendor | Status | Notes |
|--------|--------|-------|
| **Anthropic** | Default | Claude Opus 4.5 |
| **OpenAI** | Supported | GPT-4, etc. |
| **Local Models** | Supported | Configurable endpoint URL |

### Real-Time Communication

| Component | Specification |
|-----------|---------------|
| **LiveKit** | Self-hosted, bundled in docker-compose |
| **Scale** | 1-4 concurrent users |
| **Complexity** | Simplest viable configuration |
| **TURN Server** | Likely unnecessary at this scale |

---

## Business Constraints

| Constraint | Specification |
|------------|---------------|
| **Timeline** | No fixed deadline; quality over speed ("done is done") |
| **Licensing** | Sustainable Use License (n8n model / Fair Code) |
| **Monetization** | None for v1; internal tool first |
| **Token Tracking** | Required at three levels: per session, per phase, per project |

### Licensing Details

Based on n8n's Sustainable Use License:
- Free to use and self-host
- Source-available (not open source)
- Restrictions on competing managed services
- No restrictions on internal/private use

---

## Compliance Constraints

| Area | Requirement |
|------|-------------|
| **Regulatory** | None (no HIPAA, GDPR, SOC2 for v1) |
| **Data Sensitivity** | No PHI or regulated data; IP protection is primary concern |
| **Data Residency** | No geographic restrictions |
| **Audit/Retention** | No formal requirements; standard backup practices |

---

## Configuration Defaults

```yaml
# Default configuration values
server:
  port: 5090
  
proxy:
  enabled: true
  provider: "caddy"  # or "traefik"
  domain: ""  # Required if proxy enabled
  
storage:
  type: "local"
  path: "./data"
  # S3 alternative:
  # type: "s3"
  # endpoint: ""
  # bucket: ""
  # access_key: ""
  # secret_key: ""

ai:
  default_vendor: "anthropic"
  anthropic:
    model: "claude-opus-4-5-20250514"
    api_key: ""
  openai:
    model: "gpt-4"
    api_key: ""
  local:
    endpoint: ""
    model: ""

voice:
  provider: "elevenlabs"
  api_key: ""
  voice_id: ""

livekit:
  enabled: false  # v1.1
  api_key: ""
  api_secret: ""
  
smtp:
  host: ""
  port: 587
  user: ""
  password: ""
  from: ""
```

---

*Approved: 2026-01-05*
