# HT-010  Similarity Search

## What is it?
The retrieval service that takes a text query, embeds it, and finds the most semantically similar notes, goals, or tasks stored in Qdrant  the "R" in RAG.

## Problem Statement
Users write notes in their own words. The AI needs to find notes relevant to "what should I do today" even if no note contains those exact words. Keyword search cannot do this  only vector similarity can.

## Why Do We Need It?
- The Context Builder (HT-011) needs to retrieve the most relevant notes and memories before sending context to the LLM
- Semantic search is the mechanism that makes the AI "remember" what the user has written

## Objective / Goal
A retrieval service that accepts a natural language query and returns ranked results from across all Qdrant collections, ready to be used by the Context Builder.

## Scope
### In Scope
- Embedding a query and searching within one collection
- Searching across all three collections and merging results
- Filtering by `user_id` so results are always user-scoped
- A public search API endpoint

### Out of Scope
- Re-ranking beyond score-based ordering (more advanced for a future phase)
- Hybrid keyword + vector search
- Cross-user search

## User Stories
- As the AI planner, I need to retrieve the 5 most relevant notes for "what should I work on today" so I can include them in the planning context
- As a user, I want to search my notes by meaning so I can find related ideas even when I do not remember the exact words I used

## Requirements
- REQ-1: `search_similar_notes(user_id, query, limit=5)`  embed the query, search `notes_embeddings` with a `user_id` filter, return note IDs and scores
- REQ-2: `search_similar_goals(user_id, query, limit=3)`  same pattern against `goals_embeddings`
- REQ-3: `search_all(user_id, query, limit=10)`  searches all three collections, merges results, and sorts by similarity score descending
- REQ-4: Results must always be filtered by `user_id`  a user must never see another user's results
- REQ-5: `GET /api/v1/search?q=<query>`  public endpoint that calls `search_all()` and returns enriched results (full note/goal content, not just IDs)
- REQ-6: If a result's DB record has been deleted but the Qdrant vector still exists, the result must be silently filtered out from the response

## Solution Overview
- Create `backend/services/retrieval_service.py` with three public functions
- Each function embeds the query using the same `embed_text()` from HT-009, then calls Qdrant's search API with a user_id payload filter
- `search_all()` calls the individual functions, merges the returned lists, and sorts by score
- For the API endpoint: after getting point IDs from Qdrant, fetch the full records from SQLite to enrich the response
- Implement the "ghost record" filter: if a Qdrant result's ID does not exist in SQLite, skip it

## Acceptance Criteria
- [ ] Searching for "machine learning" returns notes that discuss ML even if they do not contain that exact phrase
- [ ] Results are always scoped to the current user  cross-user leakage is impossible by design
- [ ] `GET /api/v1/search?q=focus` returns results from notes, goals, and tasks combined
- [ ] A deleted note no longer appears in search results even if its vector remains in Qdrant
- [ ] Searching with an empty or whitespace-only query returns an empty result list, not an error

## Success Metrics
- Search response time under 500ms end-to-end (embed query + Qdrant search + DB fetch)
- Relevant results appear in the top 3 for common queries like "what should I do today" or "machine learning project"

## Risks / Dependencies
- **Dependency:** HT-009 must have embedded content into Qdrant before this can return any results  test with seeded data
- **Dependency:** HT-011 (Context Builder) imports `search_similar_notes()` directly  the function signature must be stable
- **Risk:** If Qdrant is empty (no embeddings yet), search returns empty results  this is correct behaviour; document it
