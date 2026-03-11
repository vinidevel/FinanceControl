import Heading from "@/components/heading";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import financialLaunches from "@/routes/financial-launches";
import financialFlows from "@/routes/financial-flows";
import { Button } from "@/components/ui/button";
import { dashboard } from "@/routes";
import { Popover} from "node_modules/@headlessui/react/dist/components/popover/popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, CalendarIcon } from "lucide-react";



const breadcrumbs = (financial_flow_id: number) => [
    { title: "Dashboard", href:  dashboard.url()},
    { title: "Financial Flows", href: financialFlows.index().url },
    { title: "Financial Launches", href: financialLaunches.index({ financial_flow: financial_flow_id }).url },
    { title: "Add Financial Launch", href: "/financial-launches/create" },
];

type FinancialLaunchesItem = {
    id: string
    month: string;
    card_expiration_date: string;
    financial_flow_id: number;
};



export default function Create({ financial_flow_id }: { financial_flow_id?: number }) {

    const { data, setData, post } = useForm({
        month: new Date().toISOString().slice(0, 7),
        card_expiration_date: new Date(),
        items: [] as FinancialLaunchesItem[],
    })



    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(financialLaunches.store.url({financial_flow: financial_flow_id!}))
        toast.success(trans("Financial launch created successfully"));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs(financial_flow_id!)}>
            <Head title={trans("Add financial launch")} />
            <div className="px-4 py-6">
                <Heading title={trans("Add financial launch")} description={trans("Create a new financial launch record")} />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between gap-5">
                                <div className="grid gap-2">
                                    <label htmlFor="date" className="font-medium">{trans("Month")}</label>
                                    <Input
                                        type="month"
                                        name="month"
                                        value={data.month}
                                        placeholder={trans("month")}
                                        className="block flex-1 border rounded px-3 py-2"
                                        onChange={(e) => setData('month', e.target.value)}

                                    />

                                </div>
                            </div>

                             <div className="grid gap-2">
                                    <label htmlFor="card_expiration_date" className="font-medium">{trans("Date")}</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                data-empty={!data.card_expiration_date}
                                                className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                                            >
                                                <CalendarIcon />
                                                {data.card_expiration_date ? format(data.card_expiration_date, "PPP") : <span>{trans("Pick a date")}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[320px] p-0">
                                            <Calendar
                                                className="w-full"
                                                mode="single"
                                                selected={data.card_expiration_date}
                                                onSelect={date => setData(prev => ({ ...prev, card_expiration_date: date || new Date() }))}
                                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                  
                                                
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>


                            <div className="flex items-center justify-center md:justify-end gap-4">
                                <Button type="submit" >{trans("Save")}</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
