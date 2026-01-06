import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import FinancialLaunchController from '@/actions/App/Http/Controllers/FinancialLaunchController';
import financialFlows from '@/routes/financial-flows';
import financialLaunchesRoutes from '@/routes/financial-launches';





interface FinancialLaunch {
    id: number;
    month: string;
    financial_flow_id?: number;

}

interface Props {
    financialLaunch: FinancialLaunch;
}

export default function Edit({ financialLaunch }: Props) {

    const breadcrumbs = [
        { title: "Dashboard", href: "/" },
        { title: "Financial Flows", href: financialFlows.index().url },
        { title: "Financial Launches", href: financialLaunch.financial_flow_id ? `${financialLaunchesRoutes.index().url}?financial_flow_id=${encodeURIComponent(String(financialLaunch.financial_flow_id))}` : financialLaunchesRoutes.index().url },
        { title: "Edit Financial Launch", href: `${financialLaunchesRoutes.edit(financialLaunch.id).url}` },
    ];


    const { data, setData, put, processing, errors } = useForm({
        month: financialLaunch.month ? financialLaunch.month.slice(0, 7) : new Date().toISOString().slice(0, 7),

    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data);
        put(FinancialLaunchController.update.url(financialLaunch.id));

    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Financial Launch" />
            <div className='w-8/12 p-4'>
                <form onSubmit={handleUpdate} className='space-y-4'>

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

                    <div className="grid gap-2">
                        <Label htmlFor="month">Month</Label>
                        <Input

                            type="month"
                            name="month"
                            value={data.month}
                            onChange={(e) => setData('month', e.target.value)}
                            className="block flex-1 border rounded px-3 py-2"
                        />
                        {errors.month && <div className="text-red-500 text-sm">{errors.month}</div>}
                    </div>



                    <Button className='mt-4' type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Edit Financial Launch'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
