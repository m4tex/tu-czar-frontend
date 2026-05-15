import {type PropsWithChildren, useEffect, useState} from "react";
import {AsyncDuckDBConnection} from "@duckdb/duckdb-wasm";
import {initializeDuckDb} from "duckdb-wasm-kit";
import {DuckDbContext} from "../DuckDBHooks.ts";

export function DuckDBProvider(props: PropsWithChildren) {
    const [conn, setConn] = useState<AsyncDuckDBConnection | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            const db = await initializeDuckDb({ debug: true })
            const conn = await db.connect()

            const res = await fetch('/tradeups.duckdb')
            const buffer = await res.arrayBuffer()
            await conn.bindings.registerFileBuffer("tradeups", new Uint8Array(buffer))
            await conn.query(`ATTACH 'tradeups' AS tradeups;`)
            await conn.query('CREATE OR REPLACE TABLE catalog AS SELECT * FROM tradeups.contracts WHERE FALSE');
            await conn.query('CREATE OR REPLACE TABLE filteredCatalog AS SELECT * FROM tradeups.contracts WHERE FALSE');
            setConn(conn);
            setReady(true);
        })()
    }, []);

    return (
        <DuckDbContext.Provider value={{conn, ready}}>
            {props.children}
        </DuckDbContext.Provider>
    );
}