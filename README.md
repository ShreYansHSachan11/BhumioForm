# Eventually Consistent Form

A simple web application demonstrating eventual consistency patterns with automatic retry logic and duplicate prevention.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## State Transitions

The form goes through four distinct states:

1. **idle** - Initial state, form is ready for input
2. **pending** - Submission in progress, form is disabled, spinner visible
3. **success** - Submission completed successfully, success message shown
4. **error** - All retry attempts failed, error message shown

State flow:
```
idle → pending → success
              ↓
            error
```

From success or error states, user can reset back to idle.

## Retry Logic

When a submission fails:

- Automatically retries up to 3 times
- Uses exponential backoff (1s, 2s, 3s delays)
- Only retries on temporary failures (503 errors)
- After 3 failed attempts, shows error to user

The retry mechanism is transparent to the user - they only see the pending state while retries happen in the background.

## Duplicate Prevention

Three mechanisms prevent duplicate submissions:

1. **Submission ID tracking** - Each submission gets a unique ID based on email, amount, and timestamp
2. **Pending state lock** - While a submission is pending, the form is disabled and new submissions are blocked
3. **Reference check** - Before starting a new submission, checks if another is already in progress

This ensures:
- No duplicate API calls for the same form data
- User cannot accidentally submit twice by clicking multiple times
- Retries don't create duplicate records (same submission ID is reused)

## Mock API Behavior

The API randomly responds with:
- 30% chance: Temporary failure (triggers retry)
- 30% chance: Delayed success (5-10 seconds)
- 40% chance: Quick success (0.5-1.5 seconds)

## Architecture

- `App.tsx` - Main component with form UI
- `useSubmission.ts` - Custom hook managing submission state and retry logic
- `api.ts` - Mock API implementation

The separation keeps business logic (retry, deduplication) isolated from UI concerns.
