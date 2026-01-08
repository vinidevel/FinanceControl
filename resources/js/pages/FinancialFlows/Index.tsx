import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { DataTable } from "../../components/Table/data-table";
import { columns } from "./table/columns";
import financialFlows from "@/routes/financial-flows";
import { dashboard } from "@/routes";

const breadcrumbs = [
    { title: "Dashboard", href:  dashboard.url()},
    { title: "Financial Flows", href: financialFlows.index().url },
];


export default function FinancialFlowsIndex({ financialFlows }: { financialFlows?: Paginated<FinancialFlow> }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans("Financial Flows")} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl px-1 md:p-4">
                <h1>{trans("Financial Flows")}</h1>

                <DataTable columns={columns}
                    data={financialFlows?.data ?? []}
                    paginated={financialFlows}
                />
            </div>


        </AppLayout>
    );
}
