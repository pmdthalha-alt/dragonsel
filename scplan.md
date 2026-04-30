# Comprehensive Project Fix Plan

## Issues Found

### 1. Error -505 (Network/Timeout Error)
- **Root Cause**: API `/api/generate` doesn't exist in Vite server - returns 404
- **File**: `app.js` tries `fetch("/api/generate")` which fails
- **Timeout**: Already increased to 8500ms but still fails

### 2. Package.json Issues
- `"type": "commonjs"` conflicts with module patterns

### 3. Duplicate/Archive Files
- `_archive/` contains old duplicates (acceptable)

### 4. UI Polish Needed
- No loading states
- Poor error messages

## Fix Plan

### Step 1: Fix Error-505 by removing API calls (Local-only mode)
Edit `app.js` to always use local mode:
```javascript
async function makePayloadWithApi(tool) {
  return makePayload(tool); // Always local
}
```

### Step 2: Fix initCanvas with better error handling
Add retry logic for Fabric.js loading

### Step 3: Add loading states
Show "Generating..." during payload create

### Step 4: Clean up package.json
Remove `"type": "commonjs"` or keep consistent

## Implementation

Would you like me to proceed with fixing these issues?
