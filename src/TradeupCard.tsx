import {Card, CardPanel} from "@/components/ui/card.tsx";

interface Props {
    tradeupString: string
    tradeups: Tradeup[]
}

export function TradeupCard(props: Props) {
    return (
        <Card className="w-56 h-50">
            <CardPanel>
                {props.tradeupString.split(' x ').map((str, idx) => <p className='whitespace-nowrap overflow-clip' key={idx}>{str}</p>)}
            </CardPanel>
        </Card>
    )
}