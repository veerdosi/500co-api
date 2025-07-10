# 500.co Portfolio API

An unofficial, read-only API for the 500.co portfolio companies. This project scrapes data from the 500.co website and serves it as a static JSON API, hosted on GitHub Pages.

## API Endpoints

The base URL for the API is `https://<your-github-username>.github.io/500co-api/`.

### Companies

*   **All Companies:** `/companies/all.json`
*   **Active Companies:** `/companies/active.json`
*   **Individual Company:** `/companies/[slug].json` (e.g., `/companies/15five.json`)

### Industries

*   **Companies by Industry:** `/industries/[industry-slug].json` (e.g., `/industries/hr-tech.json`)

## How to Run Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/<your-github-username>/500co-api.git
    cd 500co-api
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the fetcher to generate the JSON files:
    ```bash
    npm start
    ```