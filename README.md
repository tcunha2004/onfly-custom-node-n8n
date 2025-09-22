![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# Random (True Random Number Generator) - n8n

<div align="center">

![n8n](https://img.shields.io/badge/n8n-community%20node-28a9ff?logo=n8n&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22%20LTS-339933?logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

</div>

---

Node customizado para n8n que chama a API do Random.org a fim de se gerar um número inteiro aleatório entre Min e Max.

Node: Random

Operation: True Random Number Generator

Inputs: Min (integer), Max (integer)

Provedor: random.org

## Requisitos

- [Docker Desktop](https://docs.docker.com/get-started/get-docker/)
- [Node.js 22 + npm](https://nodejs.org/en/download)
- Acesso à Internet para o container do n8n (consumir random.org)

## Estrutura do repositório

.
├─ nodes/
│ └─ RandomInt/
│ ├─ RandomInt.node.ts # Lógica + UI do node
│ ├─ RandomInt.node.json # Metadados (codex)
│ └─ random.svg # Ícone do node
├─ dist/ # (gerado após build)
│ └─ nodes/RandomInt/...
├─ docker-compose.yml # n8n + Postgres
├─ .env # variáveis do compose
├─ package.json # metadados do pacote n8n
├─ tsconfig.json # TypeScript (gera CommonJS)
└─ README.md

## Configuração (Docker Compose + PostgreSQL)

1. .env (exemplo)

Crie um arquivo .env na mesma pasta do docker-compose.yml:

```
GENERIC_TIMEZONE=America/Sao_Paulo
TZ=America/Sao_Paulo

POSTGRES_USER=n8n
POSTGRES_PASSWORD=n8n123!
POSTGRES_DB=n8n
POSTGRES_PORT=5432

DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=db
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=n8n123!
DB_POSTGRESDB_SCHEMA=public
```

### Importante: o arquivo deve se chamar exatamente .env.

2. docker-compose.yml

```
services:
  db:
    image: postgres:16
    container_name: n8n_db
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    # Exponha a porta do Postgres só se precisar acessar de fora
    # ports:
    #   - "${POSTGRES_PORT}:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 10

  n8n:
    image: docker.n8n.io/n8nio/n8n
    container_name: n8n
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "5678:5678"
    environment:
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - TZ=${TZ}
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_RUNNERS_ENABLED=true
      - DB_TYPE=${DB_TYPE}
      - DB_POSTGRESDB_HOST=${DB_POSTGRESDB_HOST}
      - DB_POSTGRESDB_PORT=${DB_POSTGRESDB_PORT}
      - DB_POSTGRESDB_DATABASE=${DB_POSTGRESDB_DATABASE}
      - DB_POSTGRESDB_USER=${DB_POSTGRESDB_USER}
      - DB_POSTGRESDB_PASSWORD=${DB_POSTGRESDB_PASSWORD}
      - DB_POSTGRESDB_SCHEMA=${DB_POSTGRESDB_SCHEMA}
      # - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
    volumes:
      - n8n_data:/home/node/.n8n
      # a linha para montar o node será adicionada após o build

volumes:
  n8n_data:
  pg_data:
```

3. Subir a stack

```
docker compose up -d
```

Acesse: http://localhost:5678
Na primeira vez, crie o usuário administrador.

## Build do custom node

Instale dependências e gere o build:

```
npm i
npm run build
```

## Montagem do node no n8n (compose)

Adicione esta linha aos volumes do serviço n8n no docker-compose.yml, usando caminho absoluto do Windows (entre aspas se houver espaços):

```
    volumes:
      - n8n_data:/home/node/.n8n
      - "C:/Users/SEU_USUARIO/SEU/CAMINHO/ATÉ/o-projeto/dist:/home/node/.n8n/custom/n8n-nodes-random-int"
```

Recarregue:

```
docker compose up -d
docker compose restart n8n
```

# Utilize no n8n

1- Abra o n8n no http://localhost:5678
2- Crie um novo workflow
3- Adicione o node 'Random'
4- Execute o Worflow

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
