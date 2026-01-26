# Clippy's Clutch Converter

*A product of the 2026 DDS Hackathon*

![](app/public/10%20-%20dds%20hackathon%20clippy.png)

Dispatch logs can contain automated messages or dispatcher-entered free text. The free text isn't particularly accessible without manual compilation.

Clippy's Clutch Converter (CCC) makes this data machine-accessible with minimal manual data entry, by doing the following using a LLM:
* Generate clarifying questions, to be answered by a subject matter expert (in this case, a dispatcher)
* Generate an appropriate schema, based on the subject matter expert's responses
* Populate the schema for each corresponding entry

While CCC is aimed at dispatch logs, there could be other applications involving large amounts of potentially valuable (but unstructured) data.

## Tech stack
* React + TypeScript
* Vite
* Azure OpenAI (GPT-4o)

There is no backend API; for hackathon purposes, Azure OpenAI API calls are made directly from the frontend.

A production-quality product would require a backend API to protect API keys and LLM prompts.


## Setup

Create a `.env` file under `app/` with the following:

```
VITE_AZURE_OPENAI_ENDPOINT=<Azure OpenAI endpoint>
VITE_AZURE_OPENAI_API_KEY=<Azure OpenAI API key>
```

To setup:

```sh
cd app
npm install
```

To run:

```sh
npm run dev
```

CCC can then be accessed at http://localhost:5174.
