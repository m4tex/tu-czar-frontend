// src/duckdbClient.ts
import * as duckdb from "@duckdb/duckdb-wasm";

// Vite-specific imports for WASM + workers
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";

// Manual bundle definitions
const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: { mainModule: duckdb_wasm, mainWorker: mvp_worker },
    eh: { mainModule: duckdb_wasm_eh, mainWorker: eh_worker },
};

// Singleton instance
let dbInstance: duckdb.AsyncDuckDB | null = null;

/**
 * Initialize DuckDB-WASM singleton
 */
export async function instantiateDB(): Promise<duckdb.AsyncDuckDB> {
    if (dbInstance) return dbInstance;

    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();

    const asyncDb = new duckdb.AsyncDuckDB(logger, worker);
    await asyncDb.instantiate(bundle.mainModule, bundle.pthreadWorker);

    dbInstance = asyncDb;
    return dbInstance;
}

/**
 * Get a connection to the singleton DB
 */
export async function getConnection(): Promise<duckdb.AsyncDuckDBConnection> {
    const db = await instantiateDB();
    return await db.connect();
}

/**
 * Attach a local .duckdb file from /public
 */
export async function InitDB(
    conn: duckdb.AsyncDuckDBConnection,
) {
    const res = await fetch('/tradeups.duckdb');
    const buffer = await res.arrayBuffer();
    await conn.bindings.registerFileBuffer("tradeups", new Uint8Array(buffer));
    await conn.query(`ATTACH 'tradeups' AS tradeups;`);
}