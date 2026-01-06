import Heading from "@/components/heading";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import financialFlows from "@/routes/financial-flows";
import revenueRoutes from "@/routes/revenues";



const breadcrumbs = [
    { title: "Dashboard", href: "/" },
    { title: "Financial Flows", href: financialFlows.index().url },
    { title: "Financial Launches", href: "/financial-launches" },
    { title: "Revenues", href: revenueRoutes.index().url },
    { title: "Add Revenue", href: "/revenues/create" },
];

type RevenuesItem = {
    id: string
    description: string;
    value: number;
    revenue_type_id: number;
    financial_launch_id: number;
};





export default function Create({ financial_launch_id, revenue_types }: { financial_launch_id?: number, revenue_types?: RevenueType[] }) {
    const { data, setData, post } = useForm({
        description: '',
        value: 0,
        revenue_type_id: 0,
        financial_launch_id: financial_launch_id ?? null,
        items: [] as RevenuesItem[],
    })

    useEffect(() => {
        if (financial_launch_id) {
            setData('financial_launch_id', financial_launch_id);
        }
    }, [financial_launch_id]);




    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(revenueRoutes.store.url(), {

            onError: () => {
                toast.error(trans("An error occurred while creating the revenue."));
            },
            onSuccess: () => {
                toast.success(trans("revenue created successfully."));
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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
                                    <label htmlFor="value" className="font-medium
">{trans("value")}</label>
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
                                    <label htmlFor="revenue_type_id" className="font-medium">{trans("Revenue Type")}</label>

                                    <select
                                        name="revenue_type_id"
                                        value={String(data.revenue_type_id)}
                                        onChange={(e) => setData('revenue_type_id', Number(e.target.value))}
                                        className="block flex-1 border rounded px-3 py-2 "
                                    >
                                        <option value="0">{trans("Select Revenue Type")}</option>
                                        {(revenue_types ?? []).map((rt: any) => (
                                            <option className="text-black" key={rt.id} value={rt.id}>{rt.name}</option>
                                        ))}
                                    </select>

                                </div>
                            </div>

                        
                         


                            <input type="hidden" name="financial_launch_id" value={data.financial_launch_id ?? ''} />

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
