import {Card, CardPanel} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectItem, SelectPopup, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowDownIcon, ArrowUpIcon, RotateCcwIcon} from "lucide-react";
import {Tooltip, TooltipPopup, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {type JSX, useRef, useState} from "react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Separator} from "@/components/ui/separator.tsx";

const dataFilters = [
    // { label: "Sort by", value: null },
    {label: "Profit%", value: "profit_percentage"},
    {label: "Profit$", value: "profit_sum"},
    {label: "Price", value: "price"},
    {label: "Availability", value: "availability"},
];

interface Props {
    weaponNameFilter: string;
    setWeaponNameFilter: (value: string) => void;
    sortDecreasingly: boolean;
    setSortDecreasingly: (value: boolean) => void;
    filter: string | null;
    setFilter: (value: string) => void;
    profitableOnly: boolean;
    setProfitableOnly: (value: boolean) => void;
}

export function FilterPanel(props: Props): JSX.Element {
    const [weaponNameDebounceTimer, setWeaponNameDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    const weaponNameFilterRef = useRef<HTMLInputElement | null>(null);

    const resetFilters = () => {
        props.setWeaponNameFilter("");

        if (weaponNameFilterRef.current)
            weaponNameFilterRef.current.value = "";

        props.setFilter('profit_percentage');
        props.setSortDecreasingly(true);
        props.setProfitableOnly(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function onWeaponNameFilterChanged(value: string, _: any) {
        if (weaponNameDebounceTimer)
            clearTimeout(weaponNameDebounceTimer);

        const debounceTimer = setTimeout(() => {
            props.setWeaponNameFilter(value);
            setWeaponNameDebounceTimer(null);
        }, 600);

        setWeaponNameDebounceTimer(debounceTimer);
    }

    return (
        <Card>
            <CardPanel className="p-3 flex gap-3 justify-between">
                <div className="flex gap-3">
                    <Input size="lg" aria-label="Filter skin name" className="bg-background" autoComplete="off"
                           placeholder="Filter skin name" type="text" onValueChange={onWeaponNameFilterChanged}
                           ref={weaponNameFilterRef}/>
                    <Separator orientation="vertical"/>
                    <Select aria-label="Sort by" items={dataFilters} disabled={true}
                            onValueChange={value => props.setFilter(value!)} value={props.filter}>
                        <SelectTrigger className="w-5" size="lg">
                            <SelectValue/>
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
                    <Button size="icon-lg" variant="outline"
                            onClick={() => props.setSortDecreasingly(!props.sortDecreasingly)}>
                        {
                            props.sortDecreasingly ?
                                <ArrowUpIcon/> :
                                <ArrowDownIcon/>
                        }
                    </Button>
                    <Separator orientation="vertical"/>
                    <Label className="whitespace-nowrap">
                        <Checkbox checked={props.profitableOnly}
                                  onCheckedChange={(value) => props.setProfitableOnly(value)} disabled/>
                        Profitable only
                    </Label>
                </div>
                <Tooltip>
                    <TooltipTrigger render={<Button size="icon-lg" variant="outline" onClick={resetFilters}/>}>
                        <RotateCcwIcon/>
                    </TooltipTrigger>
                    <TooltipPopup>
                        Refresh filters
                    </TooltipPopup>
                </Tooltip>
            </CardPanel>
        </Card>
    );
}