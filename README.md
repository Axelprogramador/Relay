# ⚡ Relay

> 🌐 [Leer en español](README.es.md)

I built Relay to push myself into technologies I hadn't worked with deeply before — Kafka and React. I'm comfortable with Spring, but I wanted to prove I can pick up new tools and build something real with them. This is a working real-time chat app, not a tutorial project.

---

## How it works

Messages don't go directly from one user to another. Every message is published to a Kafka topic first, then consumed and broadcast to the room via WebSocket. That extra step is the whole point — Kafka makes the system resilient and scalable in a way that plain WebSockets aren't.

```
React → WebSocket → Spring Boot → Kafka → Spring Boot → WebSocket → React
```

If the backend crashes mid-delivery, the message stays in the Kafka topic and gets delivered when it comes back up. With direct WebSockets, it's gone.

---

## Stack

**Backend**
- Java 21 + Spring Boot 3.5
- Spring Security 6 + JWT
- Spring WebSocket (STOMP over SockJS)
- Apache Kafka
- Spring Data JPA + PostgreSQL
- Hexagonal Architecture

**Frontend**
- React 19 + Vite
- @stomp/stompjs + SockJS
- React Router v7
- Axios

**Infrastructure**
- Docker Compose — PostgreSQL, Kafka, Zookeeper

---

## Running locally

**Requirements:** Java 21, Docker Desktop, Node.js 18+

```bash
# 1. Clone
git clone https://github.com/axelprogramador/relay.git
cd relay

# 2. Start infrastructure (PostgreSQL, Kafka and Zookeeper — all three are required)
docker-compose up -d

# 3. Start backend
./mvnw spring-boot:run

# 4. Start frontend
cd relay-frontend
npm install
npm run dev
```

Frontend → http://localhost:5173  
Backend → http://localhost:8080

> ⚠️ Both Kafka and Zookeeper need to be running for the backend to start correctly. If you stop and restart Docker, double check with `docker ps` that the `relay_kafka` container is up before starting the backend — Kafka can occasionally fail to start on its own and may need `docker-compose up -d kafka` separately.

---

## Features

- Register and login with JWT
- Create and join chat rooms
- Real-time messaging through Kafka + WebSocket
- Message history on room entry
- Live online user count per room
- Browser notifications for new messages when the tab is inactive
- Unread message indicator on the rooms list
- Protected routes
- Dark mode UI

---

## Project structure

```
relay/
├── src/main/java/com/axel/relay/
│   ├── domain/            # Pure Java — no framework dependencies
│   │   ├── model/
│   │   └── port/
│   │       ├── in/        # Use case interfaces
│   │       └── out/       # Repository and publisher interfaces
│   ├── application/
│   │   └── usecase/       # Business logic
│   └── infrastructure/
│       ├── adapter/
│       │   ├── in/
│       │   │   ├── rest/        # REST controllers
│       │   │   └── websocket/   # WebSocket handler
│       │   └── out/
│       │       ├── persistence/ # JPA adapters
│       │       └── kafka/       # Producer and consumer
│       ├── config/
│       ├── entity/
│       └── security/
└── relay-frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        └── utils/
```

---

## Author

**Axel** — [github.com/axelprogramador](https://github.com/axelprogramador)
