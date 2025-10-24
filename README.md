# Spedicija Demo - Dashboard Uputstvo

Ovaj dokument služi kao vodič za korišćenje demo verzije aplikacije za upravljanje spedicijom, unos podataka i upravljanje korisnicima.

---

## 📋 Sadržaj
1. [Pokretanje aplikacije](#1-pokretanje-aplikacije)
2. [Prijava i autentifikacija](#2-prijava-i-autentifikacija)
3. [Unos podataka kroz aplikaciju](#3-unos-podataka-kroz-aplikaciju)
4. [Pretraga i filtriranje](#4-pretraga-i-filtriranje)
5. [Export podataka](#5-export-podataka)
6. [Dodavanje korisnika](#6-dodavanje-korisnika)
7. [Bezbednost](#7-bezbednost)
8. [Tamna tema](#8-tamna-tema)

---

## 1. Pokretanje aplikacije

### Instalacija
```sh
npm install
# ili
bun install
```

### Razvojni server
```sh
npm run dev
# ili
bun run dev
```

Aplikacija će biti dostupna na: [http://localhost:5173](http://localhost:5173)

### Build za produkciju
```sh
npm run build
# ili
bun run build
```

---

## 2. Prijava i autentifikacija

### Podrazumevani nalog
- **Korisničko ime:** `admin`
- **Lozinka:** `admin123`

### Bezbednost prilikom prijave
- Sistem ima **rate limiting** - dozvoljeno je **5 pokušaja prijave u 15 minuta**
- Nakon neuspešnih pokušaja, morate sačekati da prođe period
- Sve lozinke su zaštićene **SHA-256 hash algoritmom**

---

## 3. Unos podataka kroz aplikaciju

**VAŽNO:** Podaci se ne unose više kroz kod! Svi podaci se unose direktno kroz interfejs aplikacije.

### Finansije (Prihodi i Rashodi)

1. Idite na stranicu **Finansije**
2. Kliknite na **+ dugme** (Floating Action Button) u donjem desnom uglu
3. Popunite formu:
   - **Datum** - Datum transakcije
   - **Tip** - Prihod ili Rashod
   - **Opis** - Kratak opis transakcije
   - **Iznos** - Novčani iznos (RSD)
   - **Kategorija** - Odaberite kategoriju (gorivo, popravke, plate, itd.)
   - **Vozilo** - Povezano vozilo (opciono)
4. Kliknite **Dodaj**

**Funkcionalnosti:**
- ✅ Dodavanje transakcija
- ✅ Brisanje transakcija (sa potvrdom)
- ✅ Pretraga po opisu, kategoriji, vozilu
- ✅ Filtriranje po tipu i kategoriji
- ✅ Sortiranje po datumu ili iznosu
- ✅ Export u JSON, CSV ili PDF
- 📊 Grafikon sa prihodima i rashodima (zadnjih 6 meseci)

### Materijal (Dovoz i Odvoz)

1. Idite na stranicu **Materijal**
2. Kliknite na **+ dugme** u donjem desnom uglu
3. Popunite formu:
   - **Datum** - Datum transakcije
   - **Tip materijala** - Šljunak, pesak, zemlja, itd.
   - **Količina** - U kubicima (m³)
   - **Smer** - Dovoz ili Odvoz
   - **Lokacija** - Adresa ili naziv lokacije
   - **Vozač** - Ime vozača
   - **Vozilo** - Povezano vozilo
4. Kliknite **Dodaj**

**Funkcionalnosti:**
- ✅ Dodavanje unosa
- ✅ Brisanje unosa (sa potvrdom)
- ✅ Pretraga po tipu, lokaciji, vozaču, vozilu
- ✅ Filtriranje po smeru i tipu
- ✅ Sortiranje po datumu ili količini
- ✅ Export u JSON, CSV ili PDF
- 📊 Grafikon sa dovozom i odvozom (zadnjih 6 meseci)

### Vozila (Vozni park)

1. Idite na stranicu **Vozila**
2. Kliknite na **+ dugme** u donjem desnom uglu
3. Popunite formu sa SVIM informacijama:
   - **Osnovni podaci**: Naziv, registracija, tip vozila, godina proizvodnje
   - **Gorivo i potrošnja**: Tip goriva, prosečna potrošnja (L/100km)
   - **Status i vrednost**: Status (aktivan/neaktivan), nabavna cena, trenutna vrednost
   - **Servisiranje**: Datum poslednjeg servisa, sledećeg servisa
   - **Osiguranje**: Broj polise, datum isteka, cena osiguranja
   - **Registracija**: Datum sledećeg registrovanja
   - **Gorivo**: Datum sledeće revizije goriva
   - **Statistika**: Pređeni kilometri
4. Kliknite **Dodaj vozilo**

**Funkcionalnosti:**
- ✅ Dodavanje vozila
- ✅ Izmena vozila (kliknite na "Izmeni" u kartici vozila)
- ✅ Brisanje vozila (sa potvrdom)
- ✅ Pretraga po nazivu, registraciji, tipu
- ✅ Filtriranje po tipu i statusu
- ✅ Sortiranje po datumu, godini ili vrednosti
- ✅ Export u JSON, CSV ili PDF
- 📊 Profitabilnost vozila (prihodi vs troškovi)
- 🔔 Upozorenja za servisiranje i registraciju

---

## 4. Pretraga i filtriranje

Sve stranice (Finansije, Materijal, Vozila) imaju napredne mogućnosti pretrage:

### Pretraga
- Kucajte u polje za pretragu na vrhu stranice
- Pretraga radi u **realnom vremenu** (bez klika na dugme)
- Pretražuje se kroz **sve relevantne kolone**

### Filteri
- **Tip** - Filtrirajte po tipu transakcije/materijala/vozila
- **Kategorija** - Dodatni filter specifičan za stranicu
- **Sortiranje** - Sortirajte po datumu, iznosu, količini, godini...

### Primeri
- "Mercedes" - pronalazi sve unose sa Mercedesom
- Filter "Prihod" + Sortiranje "Najveći iznos" = top prihodi

---

## 5. Export podataka

Svaka stranica ima **Export** dugme sa 3 opcije:

### 1. JSON Export
- Strukturisani podaci u JSON formatu
- Idealno za backup ili migraciju podataka
- Čuva sve detalje uključujući IDs

### 2. CSV Export
- Tabela u CSV formatu
- Kompatibilno sa Excel-om, Google Sheets
- Lako za analizu u drugim alatima

### 3. PDF Export
- Profesionalni izveštaj u PDF formatu
- Uključuje datum kreiranja
- Spremno za štampanje ili slanje

**Kako koristiti:**
1. Opciono: Filtrirajte podatke koje želite da exportujete
2. Kliknite na **Export**
3. Odaberite format (JSON, CSV ili PDF)
4. Fajl će biti automatski preuzet

---

## 6. Dodavanje korisnika

### Kroz aplikaciju (Preporučeno)

1. Prijavite se kao administrator
2. Idite na **Podešavanja**
3. Pronađite sekciju **"Upravljanje korisnicima"**
4. Kliknite na **"Dodaj korisnika"**
5. Popunite formu:
   - **Korisničko ime** - Jedinstveno ime (min 3 karaktera)
   - **Lozinka** - Jaka lozinka (više o tome u sekciji Bezbednost)
   - **Ime i prezime** - Puno ime korisnika
   - **Email** - Email adresa
   - **Uloga** - Admin ili User
6. Kliknite **"Dodaj"**

### Zahtevi za lozinku
- **Minimum 8 karaktera**
- Bar jedno **veliko slovo** (A-Z)
- Bar jedno **malo slovo** (a-z)
- Bar jedna **cifra** (0-9)
- Bar jedan **specijalni karakter** (!@#$%^&* itd.)

**Primeri jakih lozinki:**
- `Marko123!`
- `SecurePass#2024`
- `Admin@Kop99`

---

## 7. Bezbednost

Aplikacija ima višeslojnu bezbednost bez dodatnih troškova:

### 🔐 Aktivne bezbednosne mere

1. **SHA-256 Hash lozinke**
   - Lozinke se NIKADA ne čuvaju u običnom tekstu
   - Koristi se Web Crypto API za hash-ovanje
   - Čak i administratori ne mogu videti lozinke

2. **XSS zaštita (DOMPurify)**
   - Automatsko uklanjanje malicioznog JavaScript-a
   - Sanitizacija svih korisničkih unosa
   - Sprečava injection napade

3. **Rate Limiting**
   - **5 pokušaja prijave u 15 minuta**
   - Sprečava brute-force napade
   - Automatsko resetovanje posle 15 min

4. **Validacija jake lozinke**
   - Obavezno 8+ karaktera
   - Mešavina velikih/malih slova, cifara, simbola
   - Provera u realnom vremenu prilikom kreiranja

5. **Input sanitizacija**
   - Svi korisnički unosi se proveravaju
   - Automatsko uklanjanje potencijalno opasnog sadržaja
   - Zaštita od SQL injection i XSS napada

### 🛡️ HTTP Security Headers

Aplikacija koristi sledeće sigurnosne header-e:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### 📊 Provera statusa bezbednosti

Status svih bezbednosnih mera možete videti u **Podešavanja > Status bezbednosti**

---

## 8. Tamna tema

Aplikacija podržava **Light** i **Dark** mode.

### Kako promeniti temu?

1. Idite na **Podešavanja**
2. Pronađite sekciju **"Izgled"**
3. Preklopite **Switch** za "Tamna tema"
4. Tema se automatski primenjuje

### Karakteristike
- ✅ Čuva se između sesija (LocalStorage)
- ✅ Automatski se detektuje sistemska preferenca
- ✅ Sve stranice i komponente su prilagođene
- ✅ Grafikoni i tabele se prilagođavaju temi

---

## 📊 Grafikoni i statistike

Aplikacija automatski generiše grafikone na osnovu unetih podataka:

### Dashboard
- **Finansije** - Pita grafikon sa raspodelom prihoda/rashoda
- **Materijal** - Pita grafikon sa raspodelom dovoza/odvoza
- **Vozila** - Pita grafikon sa statusom vozila
- **Mesečni trendovi** - Line i bar chart za 6 meseci

### Finansije stranica
- **Area Chart** - Trend prihoda i rashoda kroz vreme
- **Prikaz razlike** - Da li ste u plusu ili minusu

### Materijal stranica
- **Bar Chart** - Uporedni prikaz dovoza i odvoza po mesecima

### Vozila stranica
- **Profitabilnost** - Individualna profitabilnost svakog vozila

---

## 🆘 Česta pitanja (FAQ)

### Gde se čuvaju podaci?
Svi podaci se čuvaju u **LocalStorage** browsera. To znači:
- ✅ Besplatno hosting
- ✅ Brz pristup
- ✅ Ne treba server
- ⚠️ Podaci su vezani za browser (preporučujemo redovne backup-e kroz Export)

### Šta ako zaboravim lozinku?
Trenutno nema "reset password" funkcionalnosti. Možete:
1. Kontaktirati administratora da vam promeni lozinku
2. Ili pristupiti LocalStorage i ručno promeniti (zahteva tehničko znanje)

### Da li mogu koristiti na telefonu?
DA! Aplikacija je potpuno **responsivna** i radi na:
- 📱 Mobilnim telefonima
- 📱 Tabletima
- 💻 Desktop računarima

### Kako napraviti backup podataka?
1. Idite na svaku stranicu (Finansije, Materijal, Vozila)
2. Kliknite **Export > JSON**
3. Čuvajte fajlove na sigurnom mestu
4. Preporučujemo mesečne backup-e

---

## 🚀 Tehnologije

Aplikacija je izgrađena sa:
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** + **shadcn/ui**
- **Recharts** (grafikoni)
- **jsPDF** (PDF export)
- **DOMPurify** (XSS zaštita)
- **Web Crypto API** (hash lozinki)
- **Framer Motion** (animacije)

---

## 📝 Licenca

Privatni projekat - Marković Kop © 2024

---

