# node-pdf-parser

Lightweight PDF parsing API built with Express and TypeScript. Upload a PDF and the server will return extracted text and basic PDF info using pdf-parse.

## What it is

- Small HTTP API that accepts a single PDF file upload and returns parsed text and metadata.
- Useful as a quick local service for extracting searchable text from PDFs or for prototyping document-processing pipelines.

## Features

- POST /upload: accept a PDF (multipart/form-data) and return extracted text and page count.
- GET /: health check endpoint.
- Built with Express, express-fileupload, pdf-parse and CORS.

## Requirements

- Node.js (v14+ recommended)
- npm or yarn
- This project uses TypeScript. The repository contains `src/server.ts`.

## Quick start

1. Install dependencies

```powershell
npm install
```

1. Run the server (options)

- If you have a development script (for example `npm run dev`) run that. If not you can run the TypeScript file directly using `ts-node` or compile with `tsc`:

```powershell
# run with ts-node (if installed)
npx ts-node src/server.ts

# or compile and run (if you prefer to build)
npx tsc
node dist/server.js
```

1. By default the server listens on port 8080. You can override with the `PORT` environment variable:

```powershell
$env:PORT = 3000; npx ts-node src/server.ts
```

## API

GET /

- Health check. Returns JSON:

```json
{ "message": "PDF Parser API is running" }
```

POST /upload

- Accepts a multipart/form-data request with a single field named `file` containing the PDF.
- Returns JSON containing parsed text, PDF info and page count.

Successful response example:

```json
{
    "result": {
        "text": "...extracted text...",
        "info": { /* pdf-parse getInfo() output */ },
        "numpages": 12
    },
    "success": true
}
```

Error cases

- 400: when no file was provided (body missing `file`).
- 500: internal errors during parsing (e.g. corrupted PDF or parse failures).

## Example requests

Using curl (POSIX/curl):

```bash
curl -X POST "http://localhost:8080/upload" -F "file=@/path/to/file.pdf"
```

PowerShell (Invoke-RestMethod) example:

```powershell
$FilePath = 'C:\path\to\file.pdf'
$Form = @{
		file = Get-Item $FilePath
}
Invoke-RestMethod -Uri http://localhost:8080/upload -Method Post -Form $Form
```

Notes: the server expects the form field name to be `file` (matching the code in `src/server.ts`).

## Configuration

- PORT — optional environment variable to change listening port (defaults to 8080).

## Development notes & assumptions

- `src/server.ts` is a TypeScript Express app. I assume this project has a `package.json` and the standard TypeScript setup (if not, install `typescript` and `ts-node` or add `tsconfig.json`).
- The README provides both `ts-node` and compiled (`tsc`) run options so you can use whatever workflow you prefer.

## Possible next improvements

- Add unit/integration tests (jest, supertest) for happy path and error cases.
- Add a Dockerfile for easy deployment.
- Add stream/large-file handling to avoid loading entire files into memory for very large PDFs.
- Expose options to control parsing behavior (page ranges, text normalization).

## Contributing

Contributions are welcome. Open an issue or a PR with a short description of the change.

## License

Add a LICENSE file if you plan to publish this project. For personal/portfolio projects, MIT is a common choice.

----

If you want, I can also:

- add example npm scripts to `package.json` (dev, build, start),
- add a Dockerfile,
- or add a small integration test that uploads a sample PDF and asserts parsed output.

Tell me which of those you'd like and I'll add it.

