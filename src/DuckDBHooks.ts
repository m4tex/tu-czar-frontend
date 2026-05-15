import {createContext, useContext, useEffect, useState} from "react";
import {AsyncDuckDBConnection} from "@duckdb/duckdb-wasm";

interface DbContext {
    conn: AsyncDuckDBConnection | null;
    ready: boolean
}

export const DuckDbContext = createContext<DbContext>({
    conn: null,
    ready: false,
})

export function useDuckDb() {
    return useContext(DuckDbContext);
}

interface QueryState {
    data: any[] | null,
    error: unknown | null,
    loading: boolean,
}

export function useQuery(sql: string) {
    const { conn, ready } = useContext(DuckDbContext);
    const [state, setState] = useState<QueryState>({
        data: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!ready || !conn) return;

        let cancelled = false;

        (async () => {
            try {
                const result = await conn.query(sql);
                if (!cancelled) {
                    setState({
                        data: result.toArray().map(row => row.toJSON()),
                        error: null,
                        loading: false,
                    });
                }
            } catch (e) {
                if (!cancelled) {
                    setState({
                        data: null,
                        error: e,
                        loading: false,
                    });
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [sql, ready, conn]);

    return state;
}