import {Card, CardPanel} from "@/components/ui/card.tsx"
import {Separator} from "@/components/ui/separator"

interface Props {
    tradeup: Tradeup
}

const paragraphStyle = 'whitespace-nowrap overflow-clip text-xs text-left'

export function TradeupCard(props: Props) {
    return (
        <Card className="w-56 h-50">
            <CardPanel>
                { <p className={paragraphStyle}>{props.tradeup.skin1count}x {props.tradeup.skin1}</p> }
                {
                    props.tradeup.skin2 ?
                        <p className={paragraphStyle}>{props.tradeup.skin2count}x {props.tradeup.skin2}</p>
                    : null
                }
                <Separator className="mt-2 mb-2" />
                <p className={paragraphStyle}>
                    Avg. Profit: {(props.tradeup.profit * 100).toFixed(0)}%
                </p>

            </CardPanel>
        </Card>
    )
}