# 📁 File Processing Microservice – Real-Time Log Analysis with BullMQ, Next.js, Supabase, and Docker

A full-stack real-time log file processing microservice built using **Node.js 20.x**, **BullMQ**, **Next.js 15.x**, **React 18.x**, **Supabase**, and **Docker**. This project allows asynchronous processing of large log files and displays real-time analytics in a secure, interactive dashboard.

---

## 📌 Project Objective

Build a microservice-based solution that:
- Accepts log file uploads via API
- Processes them asynchronously using BullMQ
- Extracts important log statistics such as errors, keywords, and IP addresses
- Stores the data in Supabase (PostgreSQL + Storage)
- Shows real-time updates using WebSockets on a protected frontend dashboard

---

## ⚙ Tech Stack

- **Backend:** Node.js 20.x, BullMQ, Redis
- **Frontend:** Next.js 15.x, React 18.x
- **Authentication & DB:** Supabase (Auth + PostgreSQL + Storage)
- **Real-Time:** WebSockets via Next.js API route
- **Containerization:** Docker, Docker Compose
- **Testing:** Jest, Supertest, Postman

---

## ✅ Features Implemented

- Log file upload via `/api/upload-logs`
- Asynchronous job processing using BullMQ
- Stream-based log parsing: timestamp, level, message, JSON payload
- Stats extraction: Errors, IPs, Keywords (configurable via `.env`)
- Results stored in `log_stats` table in Supabase
- Supabase Auth integration (email login + OAuth support)
- Queue monitoring via `/api/queue-status`
- Aggregated Stats APIs:
  - `/api/stats`
  - `/api/stats/[jobId]`
- Real-time dashboard updates via `/api/live-stats` (WebSockets)
- Dockerized setup for production use
- Sample log file (`sample.log`) provided
- Unit and Integration tests included in `tests/`

---

## 📂 Project Structure

```
├── src/
│   ├── components/          # React components (Uploader, QueueStatus, StatsTable, etc.)
│   ├── lib/                 # Redis, Supabase, BullMQ utilities
│   ├── pages/
│   │   ├── api/             # API routes (upload-logs, queue-status, stats, live-stats)
│   │   └── dashboard.tsx    # Protected dashboard
│   └── workers/             # BullMQ Worker scripts
├── tests/                   # Unit & integration test cases
├── sample.log               # Sample log file for testing
├── Dockerfile               # Docker config for app
├── docker-compose.yml       # Compose file for app + Redis
├── .env.local               # Environment variables
├── README.md                # Project documentation
```

---

## 🔐 Environment Variables (`.env.local`)

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
REDIS_HOST=localhost
REDIS_PORT=6379
KEYWORDS=error,fail,timeout,crash
```

---

## 🐳 Docker Setup

```bash
# Build and start containers
docker-compose up --build

# App will be available at:
http://localhost:3000
```

---

## 🧪 Run Tests

```bash
npm install
npm run test
```

---

## 📎 Sample Log Format

```
[2025-03-12T12:00:00Z] ERROR Database timeout {"userId": 123, "ip": "192.168.1.1"}
[2025-03-12T12:01:00Z] INFO User login success {"userId": 234, "ip": "192.168.1.2"}
```

---

## 🧪 Postman Test Cases

1. **Upload Log File:**
   - Method: `POST`
   - URL: `http://localhost:3000/api/upload-logs`
   - Body: `form-data`
     - `file`: Select `.log` file
   - Response:
```json
{
  "message": "File uploaded successfully",
  "jobId": "abc123xyz"
}
```

2. **Fetch All Stats:**
   - Method: `GET`
   - URL: `http://localhost:3000/api/stats`
   - Response:
```json
{
  "stats": [
    { "error": "Database timeout", "count": 5 },
    { "keyword": "fail", "count": 8 },
    { "ip": "192.168.1.1", "count": 3 }
  ]
}
```

3. **Fetch Stats by Job ID:**
   - Method: `GET`
   - URL: `http://localhost:3000/api/stats/<jobId>`
   - Response:
```json
{
  "jobId": "abc123xyz",
  "details": [
    { "timestamp": "2025-03-12T12:00:00Z", "error": "Database timeout" }
  ]
}
```

4. **Check Queue Status:**
   - Method: `GET`
   - URL: `http://localhost:3000/api/queue-status`
   - Response:
```json
{
  "waiting": 2,
  "active": 1,
  "completed": 5,
  "failed": 0,
  "delayed": 0,
  "prioritized": 0,
  "waiting-children": 0
}
```

5. **WebSocket Connection:**
   - Endpoint: `/api/live-stats`
   - Frontend listens and updates dashboard with:
```json
{
  "event": "job-progress",
  "data": { "jobId": "abc123xyz", "progress": 85 }
}
```

---

## 🏗 Architecture Overview

```
              +---------------------------+
              |  Frontend (Next.js/React) |
              +------------+--------------+
                           |
                 (WebSocket/API Calls)
                           |
+-------------> /api/upload-logs
|                          |
|                 +--------v---------+
|                 |  BullMQ Producer |
|                 +--------+---------+
|                          |
|                    (Redis Queue)
|                          |
|                 +--------v--------+
|                 | BullMQ Worker   |
|                 |  (Stream Parser)|
|                 +--------+--------+
|                          |
|        +-----------------v----------------+
|        |    Supabase DB (log_stats table) |
|        +----------------------------------+
|                          |
+--------------------------+<-- Supabase Auth
```

---

## 📸 Submission Links

- GitHub Repo:
- Loom Video:
---

## 💡 Future Enhancements

- Add retry tracking and exponential backoff
- Implement pagination/filtering in stats API
- Charts/graphs visualization (Recharts or Chart.js)
- AI-based log anomaly detection
- Role-based access (admin/user dashboard views)

---

## 🤖 AI Tools Used

- **ChatGPT:** Code snippets, architecture design, documentation
- **GitHub Copilot:** Component scaffolds and test generation

---

## 🙏 Acknowledgement

Thanks to **CyberSapient Technologies** for this opportunity to demonstrate my full-stack skills.

---


