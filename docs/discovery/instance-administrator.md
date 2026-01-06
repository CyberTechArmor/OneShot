# Persona: The Instance Administrator

## Overview

| Attribute | Value |
|-----------|-------|
| **Role** | The person who installs and maintains the OneShot instance (often the same as the Fractional Consultant initially) |
| **Technical Proficiency** | Moderate to high — comfortable with Docker, environment variables, reverse proxy configuration |
| **Usage Frequency** | Occasional admin tasks; regular usage as a normal user |
| **Primary Device** | Desktop/server terminal for administration |

## Primary Tasks

- Install and configure the OneShot instance (including reverse proxy, ports, SSL)
- Configure AI vendor API keys and ElevenLabs integration
- Configure SMTP settings for magic link authentication
- Manage users (invite, promote to admin, remove)
- Monitor system health and storage

## Information Needs

- Clear installation documentation with prerequisites
- Single source of truth for configuration (ENV file)
- Troubleshooting guides for common issues
- Logs that explain what went wrong

## Context

- May be self-hosting on personal infrastructure (Proxmox, Docker) or cloud VPS
- Needs clear documentation for installation and configuration
- Wants sensible defaults with flexibility to customize
- Time-constrained; doesn't want to spend days on setup

## Pain Points

- Complex installation processes with unclear dependencies
- Configuration scattered across multiple files
- Debugging issues without adequate logging or error messages
- Updates that break existing configuration

## Current Workarounds

- Reading source code to understand configuration options
- Trial and error with environment variables
- Searching GitHub issues for solutions
- Running multiple containers to isolate problems

## Success Definition

> "I had it running in under 30 minutes with the docs provided, and I know where to look when something breaks."

---

*Validated: 2026-01-05*
