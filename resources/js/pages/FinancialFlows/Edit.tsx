import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import FinancialFlowController from '@/actions/App/Http/Controllers/FinancialFlowController';



interface FinancialFlow {
    id: number;
    year: string;
}

interface Props {
    financialFlow: FinancialFlow;
}

export default function Edit({financialFlow}: Props) {


    const { data, setData, put, processing, errors } = useForm({
        year: financialFlow.year,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data);
        put(FinancialFlowController.update.url(financialFlow.id));

    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Edit Product', href: `/financialFlows/${financialFlow.id}/edit` }]}>
            <Head title="Create a New Financial Flow" />
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

                    <div className='gap-1.5'>
                        <Label htmlFor="name">Year</Label>
                        <Input
                            id="number"
                            type="number"
                            placeholder="Financial Flow Year"
                            value={data.year}
                            onChange={e => setData('year', e.target.value)}
                        />
                        {errors.year && <div className="text-red-500 text-sm">{errors.year}</div>}
                    </div>

                   

                    <Button className='mt-4' type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Edit Financial Flow'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
