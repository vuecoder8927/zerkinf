# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React Native **Expo SDK 51** app (managed workflow, plain JavaScript). Pinned versions: `expo@51.0.38`, `react-native@0.74.5`, `react@18.2.0`. Do not upgrade these without explicit instruction — they are intentionally pinned.

## Commands

```bash
npm start                        # start Metro bundler (Expo Go compatible)
npx expo start --dev-client      # start for a custom dev build (requires expo-dev-client)
npm run android                  # open on Android emulator / device
npm run ios                      # open on iOS simulator (Mac only)
npm run web                      # open in browser

npm install <pkg> --legacy-peer-deps   # required flag when adding packages (peer dep conflicts from pinned versions)
```

## Architecture

- **Entry point**: `index.js` → registers `App.js` via `registerRootComponent`
- **App shell**: `App.js` is the root component — all screens/navigation hang off here
- **Managed workflow**: no `ios/` or `android/` directories. Native config lives in `app.json` under the `expo` key. Run `npx expo prebuild` only if ejecting to bare workflow.
- **Assets**: `assets/` holds icon, splash, and adaptive icon images referenced by `app.json`

## Key constraints

- Always pass `--legacy-peer-deps` when running `npm install` — the pinned RN 0.74.5 / Expo 51 versions cause peer-dep resolution conflicts with newer transitive packages.
- `expo-dev-client` requires a custom native build on the device; Expo Go will not work with it. Use `npm start` (without `--dev-client`) to test with Expo Go.
- Port 8081 may already be in use (Metro from another session). Use `--port 8082` or kill the existing process.
