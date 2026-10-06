# AI CivicAssist

VORTEX 2K26 | Team Syntax | Theme: AI for Bharat & Public Services

A multilingual (English, Telugu, Hindi), voice-enabled AI assistant that helps citizens find government schemes and services, check eligibility, get a document checklist, and follow step-by-step guidance to the official portal.

## Core flow
Login -> Citizen profile -> AI chat -> Scheme/service detection -> Eligibility -> Document checklist -> Step-by-step guide -> Official application link

## Folder structure
| Folder | Purpose |
|---|---|
| `frontend/` | Next.js app (chat UI, schemes, checklist, language and voice) |
| `backend/` | Spring Boot REST APIs, auth, database |
| `ai-rag/` | LLM, embeddings, RAG and eligibility matching |
| `data/` | Verified government service data (spreadsheet, JSON) |
| `docs/` | Architecture, design, demo script, presentation |

## Rules
- Use only official government sources for service data. Record the source URL and last-verified date.
- Never commit secrets. API keys go in `.env` files, which are git-ignored.
- Work on a branch, open a pull request, and have one teammate review it before merging into `main`.

## Team
| Name | Role |
|---|---|
| NARRA BHANU VENKAT CHOWDARY |  |
| GUTTIKONDA JAGADEESH | |
| RAMINENI NITISH |  |
| ATLURI SASI VARDHAN |  |

## Setup
Instructions will be added as each part is built.
