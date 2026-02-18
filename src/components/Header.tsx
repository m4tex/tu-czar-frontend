import {Input} from "@/components/ui/input.tsx";
import {Card, CardPanel} from "@/components/ui/card.tsx";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {type ChangeEvent, JSX} from "react";

interface Props {
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Header(props: Props): JSX.Element {
    return (
        <Card className="mb-5">
            <CardPanel className="p-3 flex justify-between items-center gap-4">
                <h1 className="ml-2 text-4xl font-bold">M4xUp</h1>
                <Field className="">
                    <FieldLabel>Tradeup Data</FieldLabel>
                    <Input type="file" accept=".json" placeholder="Select tradeup data file" onChange={props.onFileChange}></Input>
                </Field>
            </CardPanel>
        </Card>
    )
}