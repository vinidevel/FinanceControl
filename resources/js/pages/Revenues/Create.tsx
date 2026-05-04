import Heading from "@/components/heading";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import financialFlows from "@/routes/financial-flows";
import revenueRoutes from "@/routes/revenues";
import { Button } from "@/components/ui/button";
import financialLaunches from "@/routes/financial-launches";
import { dashboard } from "@/routes";

import { fetchWithCsrf } from "@/utils/fetch";
import { ComboboxDemo } from "@/components/global/FindOrCreate";
import { useState } from "react";
import revenue_types from "@/routes/revenue_types";





const breadcrumbs = (financial_launch_id: number, financial_flow_id: number) => [
    { title: "Dashboard", href:  dashboard.url()},
    { title: trans("Financial Flows"), href: financialFlows.index().url },
    { title: trans("Financial Launches"), href: financialLaunches.index({ financial_flow: financial_flow_id }).url },
    { title: trans("Revenues"), href: revenueRoutes.index({ financial_flow: financial_flow_id, financial_launch: financial_launch_id }).url },
    { title: trans("Add Revenue"), href: "/revenues/create" },

];


type RevenuesItem = {
    id: string
    description: string;
    value: number;
    revenue_type_id: number;
    financial_launch_id: number;
};


function handleCreateRevenueType(value: string, financial_flow_id: string): Promise<{ data: RevenueType }> {
    return fetchWithCsrf().post(revenue_types.create.fetch({financial_flow: financial_flow_id}).url, { name: value })
}



export default function Create({ financial_launch_id, revenue_types, financial_flow_id }: { financial_launch_id?: number, revenue_types?: RevenueType[], financial_flow_id?: number }) {
    const { data, setData, post } = useForm({
        description: '',
        value: 0,
        revenueType: '',
        items: [] as RevenuesItem[],
    })

    const [revenueTypesState, setRevenueTypesState] = useState<RevenueType[]>(revenue_types ?? []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(revenueRoutes.store.url({
            financial_flow: financial_flow_id!,
            financial_launch: financial_launch_id!
        }), {

            onError: () => {
                toast.error(trans("An error occurred while creating the revenue."));
            },
            onSuccess: () => {
                toast.success(trans("revenue created successfully."));
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs(financial_launch_id!, financial_flow_id!)}>
            <Head title={trans("Add revenue")} />
            <div className="px-4 py-6">
                <Heading title={trans("Add revenue")} description={trans("Create a new revenue record")} />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between gap-5">
                                <div className="grid gap-2 flex-1">
                                    <label htmlFor="description" className="font-medium">{trans("Description")}</label>
                                    <Input
                                        type="text"
                                        name="description"
                                        value={data.description}
                                        placeholder={trans("description")}
                                        className="w-full"
                                        onChange={(e) => setData('description', e.target.value)}

                                    />

                                </div>


                                <div className="grid gap-2">
                                    <label htmlFor="value" className="font-medium">{trans("value")}</label>
                                    <Input
                                        type="number"
                                        name="value"
                                        value={data.value}
                                        placeholder={trans("Value")}
                                        className="block flex-1 border rounded px-3 py-2"
                                        onChange={(e) => setData('value', Number(e.target.value))}

                                    />

                                </div>



                                <div className="grid gap-2">
                                    <label className="font-medium">{trans("Revenue Type")}</label>
                                    <ComboboxDemo
                                        placeholder={trans("Select a Revenue Type")}
                                        items={[...revenueTypesState.map(revenue_types => ({ value: revenue_types.id.toString(), label: revenue_types.name }))]}
                                        label={data.revenueType}
                                        value={data.revenueType}
                                        setValue={(value) => setData(prev => ({ ...prev, revenueType: value }))}
                                        handleCreate={(value) => {
                                            handleCreateRevenueType(value, financial_flow_id!.toString()).then(response => {
                                                setRevenueTypesState(prev => [...prev, response.data])
                                                setData(prev => ({ ...prev, revenueType: `${response.data.id}` }))
                                                toast.success(trans("Revenue Type created successfully"))
                                            }).catch((e) => {
                                                toast.error(e.response.data.message)
                                            })
                                        }} />
                                </div>


                            </div>


                            <div className="flex items-center justify-center md:justify-end gap-4">
                                <Button type="submit">{trans("Save")}</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
