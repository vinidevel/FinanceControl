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
import { dashboard } from '@/routes';


const breadcrumbs = (financialLaunch: FinancialLaunch) => [
    { title: "Dashboard", href: dashboard.url() },
    { title: "Financial Flows", href: financialFlows.index().url },
    { title: "Financial Launches", href: financialLaunchesRoutes.index({financial_flow: financialLaunch.financial_flow_id}).url },
    { title: "Edit Financial Launch", href: `${financialLaunchesRoutes.edit({financial_flow: financialLaunch.financial_flow_id, financial_launch: financialLaunch.id}).url}` },
];
export default function Edit({ financialLaunch }: { financialLaunch: FinancialLaunch }) {



    const { data, setData, put, processing, errors } = useForm({
        month: financialLaunch.month ? financialLaunch.month.slice(0, 7) : new Date().toISOString().slice(0, 7),

    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        put(FinancialLaunchController.update.url({
            financial_flow: financialLaunch.financial_flow_id,
            financial_launch: financialLaunch.id
        }));

    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(financialLaunch)}>
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
