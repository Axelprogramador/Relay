# ⚡ Relay

Hice este proyecto para meterme de lleno en tecnologías que no había trabajado en profundidad — Kafka y React. Con Spring me siento cómodo, pero quería demostrar que puedo aprender herramientas nuevas y construir algo funcional con ellas. Esto no es un proyecto de tutorial, es una aplicación de chat real.

---

## Cómo funciona

Los mensajes no van directamente de un usuario a otro. Cada mensaje se publica primero en un topic de Kafka, luego es consumido y enviado a la sala vía WebSocket. Ese paso extra es el punto clave — Kafka hace el sistema resiliente y escalable de una forma que los WebSockets directos no pueden.

```
React → WebSocket → Spring Boot → Kafka → Spring Boot → WebSocket → React
```

Si el backend cae a mitad de una entrega, el mensaje permanece en el topic de Kafka y se entrega cuando vuelve. Con WebSockets directos, se pierde.

---

## Stack

**Backend**
- Java 21 + Spring Boot 3.5
- Spring Security 6 + JWT
- Spring WebSocket (STOMP sobre SockJS)
- Apache Kafka
- Spring Data JPA + PostgreSQL
- Arquitectura Hexagonal

**Frontend**
- React 19 + Vite
- @stomp/stompjs + SockJS
- React Router v7
- Axios

**Infraestructura**
- Docker Compose — PostgreSQL, Kafka, Zookeeper

---

## Ejecución en local

**Requisitos:** Java 21, Docker Desktop, Node.js 18+

```bash
# 1. Clonar
git clone https://github.com/axelprogramador/relay.git
cd relay

# 2. Iniciar infraestructura
docker-compose up -d

# 3. Iniciar backend
./mvnw spring-boot:run

# 4. Iniciar frontend
cd relay-frontend
npm install
npm run dev
```

Frontend → http://localhost:5173  
Backend → http://localhost:8080

---

## Funcionalidades

- Registro e inicio de sesión con JWT
- Crear y unirse a salas de chat
- Mensajería en tiempo real a través de Kafka + WebSocket
- Historial de mensajes al entrar a una sala
- Rutas protegidas
- Interfaz en modo oscuro

---

## Estructura del proyecto

```
relay/
├── src/main/java/com/axel/relay/
│   ├── domain/            # Java puro — sin dependencias de framework
│   │   ├── model/
│   │   └── port/
│   │       ├── in/        # Interfaces de casos de uso
│   │       └── out/       # Interfaces de repositorios y publicadores
│   ├── application/
│   │   └── usecase/       # Lógica de negocio
│   └── infrastructure/
│       ├── adapter/
│       │   ├── in/
│       │   │   ├── rest/        # Controladores REST
│       │   │   └── websocket/   # Handler WebSocket
│       │   └── out/
│       │       ├── persistence/ # Adaptadores JPA
│       │       └── kafka/       # Producer y Consumer
│       ├── config/
│       ├── entity/
│       └── security/
└── relay-frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── hooks/
        └── pages/
```

---

## Autor

**Axel** — [github.com/axelprogramador](https://github.com/axelprogramador)
