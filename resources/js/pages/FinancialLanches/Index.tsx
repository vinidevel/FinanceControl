import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "../../components/Table/data-table";
import { columns } from "./table/columns";
import financialFlows from "@/routes/financial-flows";
import { Button } from "@/components/ui/button";
import financialLaunchesRoutes from '@/routes/financial-launches';
import { dashboard } from "@/routes";



const breadcrumbs = (financial_flow: number) => [
    { title: "Dashboard", href:  dashboard.url()},
    { title: "Financial Flows", href: financialFlows.index().url },
    { title: "Financial Launches", href: financialLaunchesRoutes.index({ financial_flow }).url },
];


export default function FinancialLaunchesIndex({ financialLaunches, financial_flow_id }: { financialLaunches?: Paginated<FinancialLaunch>, financial_flow_id?: number }) {
    const createHref = financial_flow_id ? `${financialLaunchesRoutes.create({ financial_flow: financial_flow_id }).url}` : "#";

    return (
        <AppLayout breadcrumbs={breadcrumbs(financial_flow_id ?? 0)}>

            <Head title={trans("Financial Launches")} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl px-1 md:p-4">
                <aside className="flex items-center justify-end">
                    <Link href={createHref} className="flex justify-center">
                        <Button className="justify-center">
                            Criar Lançamento
                        </Button>
                    </Link>
                </aside>
                <h1>{trans("Financial Launches")}</h1>

                <DataTable columns={columns}
                    data={financialLaunches?.data ?? []}
                    paginated={financialLaunches}
                />
            </div>


        </AppLayout>
    );
}
