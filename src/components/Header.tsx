import {type JSX} from "react";
import {Card, CardPanel} from "@/components/ui/card.tsx";
import { useQuery } from "@/duckdb.ts";

export function Header(): JSX.Element {
    const [data, loading] = useQuery(`SELECT COUNT(*) AS count FROM tradeups.contracts`)

    return (
        <Card>
            <CardPanel className="p-3 flex justify-between items-center gap-4">
                <h1 className="ml-2 text-4xl font-bold">M4xUp</h1>
                {
                    loading ?
                        <p className='mr-3'>Loading contracts...</p>
                            :
                        <p className='mr-3'>Loaded { data!.get(0).count.toLocaleString() } contracts</p>
                }
            </CardPanel>
        </Card>
    )
}