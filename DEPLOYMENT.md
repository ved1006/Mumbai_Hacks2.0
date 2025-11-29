# Deployment Guide for HealthHIVE

This guide explains how to deploy the HealthHIVE application (Backend + Frontend) to **Render.com** using the included `render.yaml` configuration.

## Prerequisites

1.  **GitHub Account**: Ensure this project is pushed to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com).

## Deployment Steps

1.  **Push to GitHub**:
    Make sure your latest changes (including `render.yaml`) are committed and pushed to your GitHub repository.

2.  **Create a New Blueprint on Render**:
    - Go to your [Render Dashboard](https://dashboard.render.com/).
    - Click **"New +"** and select **"Blueprint"**.
    - Connect your GitHub account if you haven't already.
    - Select the **HealthHIVE** repository from the list.

3.  **Deploy**:
    - Render will automatically detect the `render.yaml` file.
    - It will show you the two services it's about to create: `healthhive-backend` and `healthhive-frontend`.
    - Click **"Apply"** or **"Create Blueprint"**.

4.  **Wait for Build**:
    - Render will start building both services.
    - You can watch the logs for progress.
    - Once finished, you will see a green "Live" status.

5.  **Access Your App**:
    - Click on the `healthhive-frontend` service.
    - Click the URL (e.g., `https://healthhive-frontend.onrender.com`) to open your deployed application.

## Important Notes

-   **Ephemeral Filesystem**: On Render's free tier, the filesystem is ephemeral. This means any files created during runtime (like generated plans in `backend/plans` or the SQLite database `hospital.db` if it's written to) will be **lost** if the service restarts.
    -   *Recommendation*: For a production app, use a managed database (like Render's PostgreSQL) and cloud storage (like AWS S3) for files.
-   **Environment Variables**: The `render.yaml` automatically sets `VITE_API_URL` for the frontend to point to the backend. You don't need to configure this manually.
