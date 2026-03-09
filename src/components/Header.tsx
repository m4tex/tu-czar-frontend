import {type JSX, useEffect} from "react";
import {Card, CardPanel} from "@/components/ui/card.tsx";

export function Header(): JSX.Element {

    return (
        <Card>
            <CardPanel className="p-3 flex justify-between items-center gap-4">
                <h1 className="ml-2 text-4xl font-bold">M4xUp</h1>
                {
                    // arrow ?
                    //     <p className='mr-3'>Loaded { arrow.get(0)!.contractCount } contracts</p> :
                    //     null
                }
            </CardPanel>
        </Card>
    )
}