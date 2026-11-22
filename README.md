# Môj TODO List (WEBTE1 Zadanie 3)

Autor: Samuel Piteľ
Link: https://webte1.fei.stuba.sk/~xpitels/Z3_Piteľ/

## O projekte
Aplikácia „Môj TODO List“ slúži na správu osobných úloh. Používateľ môže úlohy vytvárať, upravovať, označovať ako dokončené, znovu otvárať a odstraňovať. Úlohy sa ukladajú na serveri a aplikácia s nimi pracuje cez pripravené REST API (`https://wt1zadanie.iolab.sk`), každý používateľ má vlastný zoznam podľa zadaného identifikátora.

Súčasťou aplikácie je kalendár s mesačným, týždenným a denným zobrazením, v ktorom sa úlohy zobrazujú podľa dátumu a času začiatku a ukončenia (aj viacdňové). Dokončené a nedokončené úlohy a úlohy po termíne sú farebne odlíšené. Novú úlohu možno vytvoriť aj priamo výberom dňa alebo časového úseku v kalendári. Okrem kalendára aplikácia ponúka klasický zoznam úloh s filtrovaním podľa stavu, vyhľadávaním podľa názvu a zoradením podľa začiatku alebo ukončenia. Kalendár a zoznam pracujú s jedným spoločným stavom, takže zmena v jednej časti sa hneď prejaví v druhej. Aplikácia ďalej obsahuje obnovenie ukážkových dát (s potvrdením), validáciu formulára, indikátory načítavania, spätnú väzbu po operáciách a ošetrenie chýb siete a servera. Rozhranie je responzívne.

## Použité technológie
- HTML, CSS, JavaScript
- Vue 3 (UI framework, komponenty a správa stavu), načítaný z CDN bez build kroku
- FullCalendar 6.1.15 (knižnica kalendára)
- Bootstrap 5.3.3 (štýlovanie a responzívny dizajn)
- Fetch API (komunikácia s REST API)

## Štruktúra projektu
- `index.html` – vstupná stránka
- `css/style.css` – vlastné štýly
- `js/api.js` – servisná vrstva pre komunikáciu s REST API (oddelená od UI)
- `js/utils.js` – pomocné funkcie pre dátumy a časy
- `js/components/` – komponenty: hlavička s navigáciou, formulár úlohy, zoznam úloh, kalendár, dialógy (detail, potvrdenie)
- `js/app.js` – hlavná aplikácia, stav a logika operácií


## Použitie umelej inteligencie
Pri vypracovaní zadania som využil AI nástroj **Claude (Anthropic)**. Použil som ho na:
- návrh štruktúry projektu a rozdelenie na komponenty (hlavička, formulár, zoznam, kalendár, dialógy, servis pre API),
- vygenerovanie základného kódu aplikácie (Vue komponenty, servisná vrstva pre REST API, integrácia FullCalendar, validácia formulára, ošetrenie chýb),
- postupné úpravy podľa mojich pripomienok (hlavička s odkazom „O projekte“ aj na prihlasovacej obrazovke, pätička na spodku stránky, limity dĺžky názvu a popisu podľa zadania),
- napísanie textu tohto README.
