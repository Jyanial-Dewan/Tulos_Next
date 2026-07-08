import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ReactNode } from "react"

interface Itemtypes {
    value: string,
    trigger: string,
    content: ReactNode
}

interface AccordionItemTypes {
    items: Itemtypes[]
}

function FilterProduct({ items }: AccordionItemTypes) {
    return (
        <Accordion
            className="max-w-lg"
            defaultValue={["billing"]}
            type="multiple"
        >
            {items.map((item, i) => (
                <AccordionItem
                    key={i}
                    value={item.value}
                    className="border-b px-0 last:border-b-0 "
                >
                    <AccordionTrigger className="cursor-pointer">{item.trigger}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
export default FilterProduct