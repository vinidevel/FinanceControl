import Heading from "@/components/heading";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import financialLaunches from "@/routes/financial-launches";
import financialFlows from "@/routes/financial-flows";



const breadcrumbs = [
    { title: "Dashboard", href: "/" },
    { title: "Financial Flows", href: financialFlows.index().url },
    { title: "Financial Launches", href: "/financial-launches" },
    { title: "Add Financial Launch", href: "/financial-launches/create" },
];

type FinancialLaunchesItem = {
    id: string
    month: string;
    financial_flow_id: number;
};





export default function Create({ financial_flow_id }: { financial_flow_id?: number }) {
    const { data, setData, post } = useForm({
        month: new Date().toISOString().slice(0, 7),
        financial_flow_id: financial_flow_id ?? null,
        items: [] as FinancialLaunchesItem[],
    })

    useEffect(() => {
        if (financial_flow_id) {
            setData('financial_flow_id', financial_flow_id);
        }
    }, [financial_flow_id]);




    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(financialLaunches.store.url(), {

            onError: () => {
                toast.error(trans("An error occurred while creating the financial launch."));
            },
            onSuccess: () => {
                toast.success(trans("Financial launch created successfully."));
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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

                            <input type="hidden" name="financial_flow_id" value={data.financial_flow_id ?? ''} />

                            <div className="flex items-center justify-center md:justify-end gap-4">
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded w-full md:w-fit md:min-w-24">{trans("Save")}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
