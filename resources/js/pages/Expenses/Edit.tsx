import Heading from "@/components/heading";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";
import { Button } from '@/components/ui/button';
import financialLaunches from "@/routes/financial-launches";
import ExpenseController from "@/actions/App/Http/Controllers/ExpenseController";
import { dashboard } from "@/routes";
import financialFlows from "@/routes/financial-flows";
import expensesRoutes from "@/routes/expenses";




interface Props {
    expense: Expense;
    expense_types?: { id: number; name: string }[];
    financial_flow_id: number;
    financial_launch_id: number;
    payment_methods?: { id: number; name: string }[];
}


const breadcrumbs = (financial_launch_id: number, financial_flow_id: number) => [
    { title: "Dashboard", href: dashboard.url() },
    { title: "Financial Flows", href: financialFlows.index().url },
    { title: "Financial Launches", href: financialLaunches.index({ financial_flow: financial_flow_id }).url },
    { title: "Expenses", href: expensesRoutes.index({ financial_flow: financial_flow_id, financial_launch: financial_launch_id }).url },
    { title: "Edit Expense", href: "/expenses/edit" },
];


export default function Edit({ expense, expense_types, payment_methods, financial_flow_id, financial_launch_id }: Props) {


    const { data, setData, put, processing, errors } = useForm({
        description: expense.description ?? '',
        value: expense.value ?? 0,
        expense_type_id: expense.expense_type_id ?? 0,
        payment_method_id: expense.payment_method_id ?? 0,


    })



    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(ExpenseController.update.url({
            financial_flow: financial_flow_id!,
            financial_launch: financial_launch_id!,
            expense: expense.id
        }));
        toast.success(trans("Expense updated successfully."));


    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(financial_launch_id!, financial_flow_id!)}>
            <Head title={trans("Edit expense")} />
            <div className="px-4 py-6">
                <Heading title={trans("Edit expense")} description={trans("Edit an existing expense record")} />
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
                                    <label htmlFor="expense_type_id" className="font-medium">{trans("Expense Type")}</label>

                                    <select
                                        name="expense_type_id"
                                        value={String(data.expense_type_id)}
                                        onChange={(e) => setData('expense_type_id', Number(e.target.value))}
                                        className="block flex-1 border rounded px-3 py-2 "
                                    >
                                        <option value="0">{trans("Select Expense Type")}</option>
                                        {(expense_types ?? []).map((rt: ExpenseType) => (
                                            <option className="text-black" key={rt.id} value={rt.id}>{rt.name}</option>
                                        ))}
                                    </select>

                                    {errors.expense_type_id && <div className="text-red-500 text-sm">{errors.expense_type_id}</div>}
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="payment_method_id" className="font-medium">{trans("Payment Method")}</label>

                                    <select
                                        name="payment_method_id"
                                        value={String(data.payment_method_id)}
                                        onChange={(e) => setData('payment_method_id', Number(e.target.value))}
                                        className="block flex-1 border rounded px-3 py-2 "
                                    >
                                        <option value="0">{trans("Select Payment Method")}</option>
                                        {(payment_methods ?? []).map((rt: PaymentMethod) => (
                                            <option className="text-black" key={rt.id} value={rt.id}>{rt.name}</option>
                                        ))}
                                    </select>

                                    {errors.payment_method_id && <div className="text-red-500 text-sm">{errors.payment_method_id}</div>}
                                </div>
                                     

                               
                            </div>



                        </div>




                        <Button className='mt-4' type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Revenue'}
                        </Button>


                    </form>
                </div>
            </div >
        </AppLayout >
    );
}
