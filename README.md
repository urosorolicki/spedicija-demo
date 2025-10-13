# Marković Kop - Dashboard Uputstvo

Ovaj dokument služi kao vodič za unos podataka i upravljanje korisnicima u aplikaciji.

---

## 1. Unos podataka

Podaci se nalaze u JSON fajlovima u `src/data/` direktorijumu:

- `finansije.json` – finansijski podaci
- `materijal.json` – podaci o materijalu
- `mesecniPodaci.json` – mesečni izveštaji
- `vozila.json` – podaci o voznom parku

### Kako uneti podatke?

1. Otvorite odgovarajući JSON fajl u `src/data/`.
2. Dodajte novi unos u skladu sa postojećom strukturom.
3. Sačuvajte fajl – podaci će automatski biti prikazani u dashboardu.

**Primer unosa u `vozila.json`:**
```json
[
  {
    "id": 1,
    "naziv": "Kamion Mercedes",
    "godina": 2020,
    "status": "aktivan"
  }
]
```

---

## 2. Dodavanje korisnika

Korisnici se dodaju kroz deo aplikacije za autentifikaciju. 

1. Prijavite se kao administrator.
2. Idite na stranicu za podešavanja (`Podesavanja`).
3. Kliknite na "Dodaj korisnika".
4. Unesite podatke (ime, email, lozinka, uloga).
5. Sačuvajte korisnika.

> **Napomena:** Ako aplikacija koristi eksterni servis za korisnike (npr. Firebase, Auth0), dodavanje korisnika se vrši kroz taj servis.

---

## 3. Pokretanje aplikacije

1. Instalirajte zavisnosti:
   ```sh
   npm install
   ```
2. Pokrenite razvojni server:
   ```sh
   npm run dev
   ```
3. Otvorite aplikaciju u browseru na adresi [http://localhost:8080](http://localhost:8080).

---

