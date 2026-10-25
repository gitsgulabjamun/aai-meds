# Aai Medicines (PWA)

A local first PWA for Aai's post operative medicines, built the same way as Health Stack.
Transcribed from the discharge summary. The paper and the doctor are the source of truth.

## Tabs

- **Today**: doses grouped into Morning, Afternoon and Night. Tap a card to mark it given.
  Each card shows the course day (for example Day 4 of 15), who gave it and when.
  Arrows move to earlier or later days, so a missed tick from yesterday can still be fixed.
  A red badge shows doses that are past their time.
- **As needed**: once a course ends (Lanol ER, Tapal ER, Enzoflam, Pan 40, Emeset, Cremaffin),
  the medicine moves here with a Give dose button. Each dose is logged with the time and
  the screen shows how long ago the last one was given.
- **Course**: progress and end date for every medicine, plus a short list of things to watch.
- **Settings**: discharge date, dose times, Bon DK weekday, your name, regular medicines
  (the sheet says to continue earlier medicines as before), and Google Sheet sync.

## Step 1: set the discharge date

Open Settings and set the actual discharge date. Every course counts from that day.

## Step 2 (optional): family sync through a Google Sheet

1. Create a new Google Sheet, then Extensions > Apps Script.
2. Paste `Code.gs`, save.
3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
4. Copy the `/exec` URL into Settings on every phone that will use the app.

Each tick lands as a row in the `DoseLog` tab. Rows carry an id, so re-syncing never
duplicates. When the app is opened it pulls the latest rows, so if your wife gives the
afternoon dose on her phone, yours shows it ticked too.

## Step 3: host

Copy the folder to your droplet under any HTTPS path, for example `/var/www/suniljadhav.in/aai/`.
HTTPS is required for install and offline mode.

## Known limits

- Reminders only show while the app is open. Real push reminders need the Telegram bot route
  on the droplet, like the one planned for your own tracker.
- Reading from the sheet can be blocked by the browser on some setups. Writing still works.
