import {createContext, useContext, useEffect, useState} from "react";
import {AsyncDuckDBConnection} from "@duckdb/duckdb-wasm";

interface DbContext {
    conn: AsyncDuckDBConnection | null;
    ready: boolean;
}

export const DuckDbContext = createContext<DbContext>({
    conn: null,
    ready: false,
});

export function useDuckDb() {
    return useContext(DuckDbContext);
}

interface QueryState<DataType> {
    data: DataType[] | null,
    error: unknown | null,
    loading: boolean,
}

export function useQuery<DataType>(sql: string) {
    const {conn, ready} = useContext(DuckDbContext);
    const [state, setState] = useState<QueryState<DataType>>({
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
                        data: result.toArray().map(row => row.toJSON()) as DataType[],
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