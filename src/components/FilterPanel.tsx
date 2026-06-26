import {Card, CardPanel} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectItem, SelectPopup, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowDownIcon, ArrowUpIcon, ChevronDown, ChevronUp, RotateCcwIcon} from "lucide-react";
import {Tooltip, TooltipPopup, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {type Dispatch, type JSX, type SetStateAction, useEffect, useRef, useState} from "react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {clsx} from "clsx";

const dataFilters = [
    // { label: "Sort by", value: null },
    {label: "Profit%", value: "profit_percentage"},
    {label: "Profit$", value: "profit_sum"},
    {label: "Price", value: "price"},
    {label: "Availability", value: "availability"},
];

interface Props {
    filters: TradeupFilters,
    setFilters: Dispatch<SetStateAction<TradeupFilters>>,
}

export function FilterPanel(props: Props): JSX.Element {
    const [weaponNameDebounceTimer, setWeaponNameDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    const weaponNameFilterRef = useRef<HTMLInputElement | null>(null);

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const [stuck, setStuck] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<boolean>(false);

    // Set up sentinel (detects when the filter panel sticks to the screen)
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setStuck(!entry.isIntersecting);
        });

        if (sentinelRef.current) observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, []);

    const resetFilters = () => {
        props.setFilters(prev => ({
            ...prev,
            weaponName: "",
            sortCriteria: "profit_percentage",
            sortDecreasingly: true,
            profitableOnly: true,
            collapseByWeapon: true,
        }));

        if (weaponNameFilterRef.current)
            weaponNameFilterRef.current.value = "";
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function onWeaponNameFilterChanged(value: string, _: any) {
        if (weaponNameDebounceTimer)
            clearTimeout(weaponNameDebounceTimer);

        const debounceTimer = setTimeout(() => {
            props.setFilters(prevState => ({
                ...prevState,
                weaponName: value,
            }));
            setWeaponNameDebounceTimer(null);
        }, 600);

        setWeaponNameDebounceTimer(debounceTimer);
    }

    const stuckStyle = 'bg-background/30 backdrop-blur-sm shadow-[0px_0px_25px_rgba(0,0,0,0.5)]';

    return (
        <>
            <div ref={sentinelRef} className="absolute h-px"/>
            <div className="sticky top-10 z-20">
                <Card className={clsx('transition-all', stuck && stuckStyle)}>
                    <CardPanel className="p-3">
                        <div className="flex justify-between">
                            <div className="flex gap-3 items-center">
                                <Input size="lg" aria-label="Filter skin name" className="bg-background" autoComplete="off"
                                       placeholder="Filter skin name" type="text" onValueChange={onWeaponNameFilterChanged}
                                       ref={weaponNameFilterRef}/>
                                <Separator orientation="vertical"/>
                                <Select aria-label="Sort by" items={dataFilters} disabled={true}
                                        onValueChange={
                                            value => props.setFilters(prev => ({...prev, sortCriteria: value!}))
                                        }
                                        value={props.filters.sortCriteria}>
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
                                        onClick={() => props.setFilters(prev => ({...prev, sortDecreasingly: !props.filters.sortDecreasingly}))}>
                                    {
                                        props.filters.sortDecreasingly ?
                                            <ArrowDownIcon/> :
                                            <ArrowUpIcon/>
                                    }
                                </Button>
                                <Separator orientation="vertical"/>
                                <Label className="whitespace-nowrap">
                                    <Checkbox checked={props.filters.profitableOnly}
                                              onCheckedChange={
                                                  value => props.setFilters(prev => ({...prev, profitableOnly: value}))
                                              } disabled/>
                                    Profitable only
                                </Label>
                                <Separator orientation="vertical"/>
                                <Button variant="ghost" className="h-full" onClick={() => setExpanded(prev => !prev)}>
                                    {
                                        expanded ?
                                            <ChevronUp/> :
                                            <ChevronDown/>
                                    }
                                </Button>
                            </div>
                            <Tooltip>
                                <TooltipTrigger render={<Button size="icon-lg" variant="outline" onClick={resetFilters}/>}>
                                    <RotateCcwIcon/>
                                </TooltipTrigger>
                                <TooltipPopup>
                                    Clear filters
                                </TooltipPopup>
                            </Tooltip>
                        </div>
                        <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden">

                            </div>
                        </div>
                    </CardPanel>

                </Card>
                {
                    stuck &&
                        <Button className={`mt-3 bg-background/30 backdrop-blur-sm rounded-full before:shadow-none! ${stuck ? 'opacity-100' : 'opacity-0'}`} variant='outline' onClick={() => window.scrollTo(0,0)}>
                            <ArrowUpIcon />
                        </Button>
                }
            </div>
        </>
    );
}