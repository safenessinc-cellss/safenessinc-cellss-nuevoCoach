# Coach ISO

React + Vite dashboard with Firebase Authentication, Firestore and Firebase Hosting. The public chat and AI-assisted curriculum tools call a server-side Firebase Function; Gemini credentials must never be placed in a Vite variable or bundled into browser code.

## Local development

Prerequisites: Node.js 22, Firebase CLI and access to the `coach-iso-f6877` Firebase project.

1. Install the frontend dependencies: `npm ci`.
2. Start the Functions emulator in a separate terminal:
   `cd functions && npm install && npm run build && cd .. && firebase emulators:start --only functions --project coach-iso-f6877`.
3. Set the local Functions secret for emulator use through the Firebase CLI or an untracked local environment file. Never put it in `.env.local` as a `VITE_*` variable.
4. Run the frontend: `npm run dev`. The Vite `/api` proxy targets the Functions emulator.
5. Validate with `npm run lint`, `npm run build`, and `cd functions && npm run build`.

## Configure the Gemini secret for deployment

Rotate any key that has ever been pasted into a terminal transcript, chat, repository, or frontend bundle. In Google AI Studio, revoke the old key and create a new one. Then configure the Firebase Functions secret:

```bash
firebase use coach-iso-f6877
firebase functions:secrets:set GEMINI_API_KEY
```

Enter the new key only at the secure prompt. The backend exposes `POST /api/chat` (public chat with basic rate limiting), `POST /api/analyze-certificate` and `POST /api/rewrite-curriculum` (Firebase ID token plus active staff role required).

The certificate importer saves drafts as **not verified**. AI extraction is not proof that a credential is authentic; verify it with the issuer before representing it as official.

## Deploy safeguards

- Review the working tree and diffs before staging.
- Run the frontend and Functions TypeScript checks and build.
- Deploy Firestore rules before Hosting; deploy Functions after the Gemini secret is configured.
- Do not deploy production while CI is failing.
- Never commit `.env.local`, service account keys, backup files, `.firebase/`, `dist/`, or `node_modules/`.

`npm run lint` runs TypeScript checking for the frontend. Firebase Functions are compiled separately from `functions/`.
