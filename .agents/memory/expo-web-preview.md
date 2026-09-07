---
name: Expo web preview gate
description: Expo web previews can stay blank when the scaffold blocks the root render on font/splash readiness.
---

When the Expo bundle starts successfully but the web preview is blank with no browser exception, check the root layout’s font/splash render gate before investigating screen code.

**Why:** The mobile scaffold can hold the first render while waiting for native-oriented asset readiness, even though Metro and the browser bundle are healthy.

**How to apply:** Keep font loading for native, but let the root navigator render while fonts resolve so the web preview has a visible first frame.