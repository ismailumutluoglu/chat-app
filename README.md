# ChatApp 💬

Gerçek zamanlı, full-stack sohbet uygulaması. WebSocket tabanlı anlık mesajlaşma,
grup sohbetleri, dosya paylaşımı ve online durum takibi.

## Özellikler

- Anlık mesajlaşma (WebSocket)
- Birebir (DM) ve grup sohbetleri
- Online/offline durum takibi
- Yazıyor... bildirimi
- Okundu bilgisi
- Dosya ve resim paylaşımı
- Mesaj arama

## Teknoloji Stack'i

| Katman | Teknoloji | Neden |
|--------|-----------|-------|
| Backend | NestJS + TypeScript | Modüler mimari, Dependency Injection |
| İlişkisel DB | PostgreSQL 16 | ACID garantisi, kullanıcı ve oda verisi |
| Doküman DB | MongoDB 7 | Write-heavy mesaj verisi, esnek schema |
| Cache / Pub-Sub | Redis 7 | Online durum, WebSocket dağıtımı |
| Gerçek zamanlı | Socket.io | WebSocket + fallback desteği |
| Frontend | React + TypeScript | Component tabanlı UI |
| Altyapı | Docker + Nginx | Taşınabilir ortam, reverse proxy |

## Mimari

```
Client (React)
    │
    ├── HTTP/REST ──────► NestJS API Gateway
    └── WebSocket ───────►     │
                               ├── Auth Service
                               ├── Message Service ──► MongoDB
                               ├── Room Service ────► PostgreSQL
                               └── Presence Service ► Redis
```

## Kurulum

### Gereksinimler

```bash
Node.js    >= 20.x
Docker     >= 24.x
NestJS CLI >= 10.x   # npm i -g @nestjs/cli
```

### 1. Repoyu klonla

```bash
git clone <repo-url>
cd chatapp
```

### 2. Docker servislerini başlat

```bash
docker-compose up -d
docker ps   # 3 container "Up" görünmeli
```

### 3. Backend ortam değişkenlerini ayarla

```bash
cd apps/server
cp .env.example .env
```

### 4. Backend'i başlat

```bash
npm install
npm run start:dev
```

### 5. Frontend'i başlat (Issue #3 sonrası)

```bash
cd apps/client
npm install
npm run dev
```

## Proje Yapısı

```
chatapp/
├── apps/
│   ├── server/                  ← NestJS backend
│   │   ├── src/
│   │   │   ├── config/          ← Ortam değişkenleri
│   │   │   └── database/
│   │   │       └── migrations/  ← SQL migration dosyaları
│   │   └── .env.example
│   └── client/                  ← React frontend (Issue #3)
├── docker-compose.yml
├── ADR.md                       ← Teknoloji kararları
└── README.md
```

## Geliştirme Süreci

Bu proje kurumsal Git iş akışı ile geliştirilmektedir.

```
main
 └── feature/project-foundation   # Her issue için ayrı branch
```

- Her issue için `feature/issue-adi` branch'i açılır
- Kod tamamlanınca PR açılır
- Tech Lead review yapar, onaylarsa `main`'e merge edilir
- Commit mesajları Conventional Commits standardına uyar

### Commit formatı

```
feat(auth): add jwt login endpoint
fix(rooms): prevent duplicate dm creation
chore(docker): add redis service
docs(readme): update setup instructions
```

## Yol Haritası

| Faz | Konu | Durum |
|-----|------|-------|
| 1 | Project Foundation | ✅ Tamamlandı |
| 2 | Authentication | ⬜ Bekliyor |
| 3 | Users & Rooms API | ⬜ Bekliyor |
| 4 | Real-time Core | ⬜ Bekliyor |
| 5 | Presence | ⬜ Bekliyor |
| 6 | Media | ⬜ Bekliyor |
| 7 | Search | ⬜ Bekliyor |
| 8 | Production | ⬜ Bekliyor |