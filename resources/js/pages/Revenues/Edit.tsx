import Heading from "@/components/heading";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import financialFlows from "@/routes/financial-flows";
import revenueRoutes from "@/routes/revenues";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";
import { Button } from '@/components/ui/button';
import RevenueController from "@/actions/App/Http/Controllers/RevenueController";





interface Revenue {
    id: number;
    description: string;
    value: number;
    revenue_type_id: number;
    financial_launch_id: number;

}

interface Props {
    revenue: Revenue;
    revenue_types?: { id: number; name: string }[];
}



export default function Edit({ revenue, revenue_types }: Props) {

    const breadcrumbs = [
        { title: "Dashboard", href: "/" },
        { title: "Financial Flows", href: financialFlows.index().url },
        { title: "Financial Launches", href: "/financial-launches" },
        { title: "Revenues", href: revenueRoutes.index().url },
        { title: "Edit Revenue", href: revenueRoutes.edit(revenue.id).url },
    ];

    const { data, setData, put, processing, errors } = useForm({
        description: revenue.description ?? '',
        value: revenue.value ?? 0,
        revenue_type_id: revenue.revenue_type_id ?? 0,
        financial_launch_id: revenue.financial_launch_id ?? null,

    })



    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
             put(RevenueController.update.url(revenue.id));
        toast.success(trans("Revenue updated successfully."));
        

    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans("Edit revenue")} />
            <div className="px-4 py-6">
                <Heading title={trans("Edit revenue")} description={trans("Edit an existing revenue record")} />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <form onSubmit={handleUpdate}>

                        {/* Display errors */}
                        {Object.keys(errors).length > 0 && (
                            <Alert>
                                <CircleAlert className='h-4 w-4' />
                                <AlertTitle>Errors!</AlertTitle>
                                <AlertDescription>
                                    <ul>
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key}>{message as string}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>

                        )}
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
                                    {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
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
                                    {errors.value && <div className="text-red-500 text-sm">{errors.value}</div>}

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

                                    {errors.revenue_type_id && <div className="text-red-500 text-sm">{errors.revenue_type_id}</div>}
                                </div>

                            </div>




                            <Button className='mt-4' type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Update Revenue'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
