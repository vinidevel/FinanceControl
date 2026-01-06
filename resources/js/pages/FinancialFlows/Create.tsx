import Heading from "@/components/heading";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

import { toast } from "sonner";
import financialFlows from "@/routes/financial-flows";
import { Input } from "@/components/ui/input";



const breadcrumbs = [
    { title: "Dashboard", href: "/" },
    { title: "Financial Flows", href: "/financial-flows" },
    { title: "Add Financial Flow", href: "/financial-flows/create" },
];

type FinancialFlowsItem = {
    id: string
    year: string;
};





export default function Create() {
    const { data, setData, post } = useForm({
        year: new Date().getFullYear(), 
        items: [] as FinancialFlowsItem[],
    })


    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(financialFlows.store.url(), {

            onError: () => {
                toast.error(trans("An error occurred while creating the financial flow."));
            },
            onSuccess: () => {
                toast.success(trans("Financial flow created successfully."));
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans("Add financial flow")} />
            <div className="px-4 py-6">
                <Heading title={trans("Add financial flow")} description={trans("Create a new financial flow record")} />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between gap-5">
                                <div className="grid gap-2">
                                    <label htmlFor="date" className="font-medium">{trans("Ano")}</label>
                                    <Input
                                        type="text"
                                        name="year"
                                        value={data.year}
                                        placeholder={trans("year")}
                                        className="block flex-1 border rounded px-3 py-2"
                                        onChange={(e) => setData("year",  Number(e.target.value))}

                                    />

                                </div>
                            </div>






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
