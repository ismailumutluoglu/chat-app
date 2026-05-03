# Architecture Decision Records (ADR)

## ADR-001: NestJS — Express yerine

- **Tarih:** 03.05.2026
- **Durum:** Kabul Edildi

### Bağlam
Backend framework seçmemiz gerekiyordu. Express.js Node.js'in en yaygın framework'ü ama yapılandırılmamış — her şeyi kendin organize etmek zorunda kalıyorsun. Büyüyen projelerde bu kaosa yol açar.

### Karar
NestJS kullanıyoruz.

### Değerlendirilen Alternatifler
| Alternatif | Neden Reddedildi |
|------------|-----------------|
| Express.js | Yapı yok, büyük projede kaos olur |
| Fastify | Ekosistem daha küçük, NestJS ile de kullanılabilir |
| Hono | Çok yeni, production deneyimi az |

### Sonuçlar
**Artılar:** Dependency Injection, modüler mimari, TypeScript first, OOP prensipleri  
**Eksiler:** Express'e göre daha fazla boilerplate, öğrenme eğrisi

---

## ADR-002: PostgreSQL + MongoDB hibrit

- **Tarih:** 03.05.2026
- **Durum:** Kabul Edildi

### Bağlam
Tek veritabanı yeter miydi? Hayır. İki farklı veri tipimiz var: ilişkisel (kullanıcılar, odalar) ve write-heavy document (mesajlar).

### Karar
İlişkisel veri → PostgreSQL. Mesaj verisi → MongoDB.

### Değerlendirilen Alternatifler
| Alternatif | Neden Reddedildi |
|------------|-----------------|
| Sadece PostgreSQL | Mesajlar için write performansı yetersiz kalır |
| Sadece MongoDB | İlişkisel veri için JOIN sorguları zayıf |

### Sonuçlar
**Artılar:** Her veritabanı kendi işini iyi yapıyor  
**Eksiler:** İki ayrı sistem — operasyonel karmaşıklık artar  
**Akademik bağlantı:** ACID (PostgreSQL) vs BASE (MongoDB), CAP teoremi

---

## ADR-003: Redis — Presence ve Pub/Sub için

- **Tarih:** 03.05.2026
- **Durum:** Kabul Edildi

### Bağlam
Online durum (presence) verisi sürekli değişiyor. Her bağlantı/ayrılmada güncelleniyor. PostgreSQL'e yazmak hem yavaş hem gereksiz.

### Karar
Presence ve pub/sub için Redis kullanıyoruz.

### Değerlendirilen Alternatifler
| Alternatif | Neden Reddedildi |
|------------|-----------------|
| PostgreSQL'de presence kolonu | Her WS event'inde disk yazması — çok yavaş |
| NestJS memory'de | Çok instance'da senkronizasyon sorunu |

### Sonuçlar
**Artılar:** In-memory — microsaniye hız, TTL desteği, pub/sub built-in  
**Eksiler:** Restart'ta veri uçar (zaten istediğimiz bu — ephemeral data)  
**Akademik bağlantı:** Ephemeral data, TTL, pub/sub multicast pattern

---

## ADR-004: Monorepo yapısı

- **Tarih:** 03.05.2026
- **Durum:** Kabul Edildi

### Bağlam
Backend ve frontend'i ayrı repo'larda mı yoksa aynı repo'da mı tutmalıyız?

### Karar
Monorepo — `apps/server` ve `apps/client` aynı repoda.

### Değerlendirilen Alternatifler
| Alternatif | Neden Reddedildi |
|------------|-----------------|
| Ayrı repolar | Küçük ekip için koordinasyon zorlaşır |

### Sonuçlar
**Artılar:** Tek PR'da hem backend hem frontend değişikliği, paylaşılan tipler  
**Eksiler:** Repo büyüdükçe clone süresi uzar