# Spell Sprout

A responsive, browser-based Spell Bowl practice app. No account, backend, API key, or build step required.

## Practice

Each set chooses five distinct random words from the current list. The app reads a word twice, waits for the second speech-completion event, then starts a 30-second timer. At zero, it reveals the answer and reads the word, its individual letters, and the word again. Students correct their notebooks and click Next word when ready. Words can recur in later sets.

Use Manage word list to paste words or import plain .txt/.csv text (one word per line or comma-separated, no headers or numbering). Lists are saved in the current browser. The default list contains 1399 entries extracted from Junior Spell Bowl List.pdf (Junior 2026). Original capitalization, spaces, and hyphens are preserved. Blank or omitted numbered entries in the supplied PDF are excluded. Edit words.js to change the shared default list. official-words.txt is included for review.

## Run locally

From this directory run `npm run dev`, then visit http://localhost:5173. Run `npm test` for word-selection, parsing, and timer tests.

## Deploy from GitHub to Vercel

1. Create a GitHub repository and upload the contents of this folder to its root.
2. In Vercel, choose Add New → Project and import that repository.
3. Select framework preset **Other**, leave the build command empty, and set output directory to **.** (the included vercel.json sets this).
4. Deploy. Future pushes to the connected production branch trigger deployments.

No environment variables are needed. If this app is inside a larger repository, select this folder as Vercel's Root Directory.

## Speech and timing

Speech uses the browser's built-in Web Speech API and installed English voices. Choose a voice before starting. Pronunciation quality and offline support depend on the browser and operating system. Audio errors offer a retry and do not start the writing timer. Keep the page visible and sound enabled: browsers can suspend audio in background tabs. Timer calculations use the actual deadline, so delayed callbacks cannot add writing time; a suspended page reveals the answer when it resumes. The app cannot detect muted speakers. No microphone is used.

The app uses Google Fonts for typography with local fallback fonts. Word lists stay in local browser storage; browser or operating-system speech services may process words to generate audio.
