// Import/initialize and instantiate duckdb instance
import * as duckdb from "@duckdb/duckdb-wasm"

// Vite-specific imports for WASM + workers
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url"
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url"
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url"
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url"

import * as arrow from 'apache-arrow'

// Manual bundle definitions
const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: { mainModule: duckdb_wasm, mainWorker: mvp_worker },
    eh: { mainModule: duckdb_wasm_eh, mainWorker: eh_worker },
}

// Singleton instance
let dbInstance: duckdb.AsyncDuckDB | null = null
let dbInitialized = false

async function instantiateDB(): Promise<duckdb.AsyncDuckDB> {
    if (dbInstance) return dbInstance

    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES)
    const worker = new Worker(bundle.mainWorker!)
    const logger = new duckdb.ConsoleLogger()

    const asyncDb = new duckdb.AsyncDuckDB(logger, worker)
    await asyncDb.instantiate(bundle.mainModule, bundle.pthreadWorker)

    dbInstance = asyncDb
    return dbInstance
}

async function InitDB(
    conn: duckdb.AsyncDuckDBConnection,
) {
    const res = await fetch('/tradeups.duckdb')
    const buffer = await res.arrayBuffer()
    await conn.bindings.registerFileBuffer("tradeups", new Uint8Array(buffer))
    await conn.query(`ATTACH 'tradeups' AS tradeups;`)
    await conn.query('CREATE OR REPLACE TABLE catalog (tradeupID UINTEGER)');
    await conn.query('INSERT INTO catalog SELECT id FROM tradeups.contracts QUALIFY ROW_NUMBER() OVER (PARTITION BY skin1,skin2 ORDER BY profit DESC NULLS LAST) = 1 ORDER BY profit DESC NULLS LAST')

    dbInitialized = true
}

// Interface

export async function getConnection(): Promise<duckdb.AsyncDuckDBConnection> {
    const db = await instantiateDB()
    const conn =  await db.connect()

    if (!dbInitialized) await InitDB(conn)

    return conn
}

import { useEffect, useState } from "react"

// Main react hook for working with duckdb, returns [data, loading]
export function useQuery(sql: string) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<arrow.Table | null>(null)

    useEffect(() => {
        (async () => {
            const conn = await getConnection()
            const res = await conn.query(sql)
            setData(res)
            setLoading(false)
        })()

        return () => {
            setLoading(true)
            setData(null)
        }
    }, [sql]);

    return [data, loading]
}