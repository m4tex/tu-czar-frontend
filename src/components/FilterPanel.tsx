import {Card, CardPanel} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectItem, SelectPopup, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowDownIcon, ArrowUpIcon, RotateCcwIcon} from "lucide-react";
import {Tooltip, TooltipPopup, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {JSX} from "react";

const dataFilters = [
    { label: "Sort by", value: null },
    { label: "Profit%", value: "profit_percentage" },
    { label: "Profit$", value: "profit_sum" },
    { label: "Price", value: "price" },
    { label: "Availability", value: "availability" },
]

interface Props {
    weaponNameFilter: string
    setWeaponNameFilter: (value: string) => void
    sortIncreasingly: boolean
    setSortIncreasingly: (value: boolean) => void
    filter: string | null
    setFilter: (value: string | null) => void
}

export function FilterPanel(props: Props): JSX.Element {
    const refreshFilters = () => {
        console.log('refresh filters')
    }

    return (
        <Card className="mb-5">
            <CardPanel className="p-3 flex gap-3 justify-between">
                <div className="flex gap-3">
                    <Input size="lg" aria-label="Filter skin name" placeholder="Filter skin name" type="text" value={props.weaponNameFilter}
                           onChange={(value) => props.setWeaponNameFilter(value.target.value)} />
                    <Select aria-label="Sort by" items={dataFilters}
                            onValueChange={value => props.setFilter(value) } value={props.filter}>
                        <SelectTrigger className="w-5" size="lg">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectPopup>
                            {
                                dataFilters.map(({label, value}) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))
                            }
                        </SelectPopup>
                    </Select>
                    <Button size="icon-lg" variant="outline" onClick={() => props.setSortIncreasingly(!props.sortIncreasingly)}>
                        {
                            props.sortIncreasingly ?
                                <ArrowUpIcon /> :
                                <ArrowDownIcon />
                        }
                    </Button>
                </div>
                <Tooltip>
                    <TooltipTrigger render={<Button size="icon-lg" variant="outline" onClick={refreshFilters} />}>
                        <RotateCcwIcon />
                    </TooltipTrigger>
                    <TooltipPopup>
                        Refresh filters
                    </TooltipPopup>
                </Tooltip>
            </CardPanel>
        </Card>
    )
}