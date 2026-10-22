"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type HealthResponse = {
  status: string;
  database: string;
};

export default function Home() {
  const [databaseStatus, setDatabaseStatus] = useState("Checking connection...");

  useEffect(() => {
    const apiUrl = `${window.location.protocol}//${window.location.hostname}:3001/health`;

    fetch(apiUrl)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const health: HealthResponse = await response.json();
        setDatabaseStatus(`${health.status}: database ${health.database}`);
      })
      .catch(() => setDatabaseStatus("API/database unavailable"));
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p className={styles.eyebrow}>YOUR FIRST DELIVERY PIPELINE</p>
        <h1>AWS CI/CD Learning Lab</h1>
        <p className={styles.description}>
          A small app to practice shipping code with Next.js, NestJS,
          PostgreSQL, Docker, Terraform, and GitHub Actions.
        </p>

        <section className={styles.status} aria-live="polite">
          <span className={styles.statusLabel}>Database check</span>
          <strong>{databaseStatus}</strong>
        </section>

        <div className={styles.stack}>
          <span>Next.js</span>
          <span>NestJS</span>
          <span>PostgreSQL</span>
          <span>Docker</span>
          <span>Terraform + AWS</span>
        </div>
        <p className={styles.hint}>
          API health endpoint: <code>http://&lt;host&gt;:3001/health</code>
        </p>
      </main>
    </div>
  );
}
