import Heading from "@/components/heading";
import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import financialFlows from "@/routes/financial-flows";
import expensesRoutes from "@/routes/expenses";
import { Button } from "@/components/ui/button";
import financialLaunches from "@/routes/financial-launches";
import { dashboard } from "@/routes";
import { fetchWithCsrf } from "@/utils/fetch";
import expense_types from "@/routes/expense_types";
import { ComboboxDemo } from "@/components/global/FindOrCreate";
import { useState } from "react";
import payment_methods from "@/routes/payment_methods";



const breadcrumbs = (financial_launch_id: number, financial_flow_id: number) => [
    { title: "Dashboard", href: dashboard.url() },
    { title: "Financial Flows", href: financialFlows.index().url },
    { title: "Financial Launches", href: financialLaunches.index({ financial_flow: financial_flow_id }).url },
    { title: "Expenses", href: expensesRoutes.index({ financial_flow: financial_flow_id, financial_launch: financial_launch_id }).url },
    { title: "Add Expense", href: "/expenses/create" },
];



type ExpensesItem = {
    id: string
    description: string;
    value: number;
    expense_type_id: number;
    financial_launch_id: number;
    payment_method_id: number;
    date_expense: string;
};


function handleCreateExpenseType(value: string, financial_flow_id: string): Promise<{ data: ExpenseType }> {
    return fetchWithCsrf().post(expense_types.create.fetch({ financial_flow: financial_flow_id }).url, { name: value })
}

function handleCreatePaymentMethod(value: string, financial_flow_id: string): Promise<{ data: PaymentMethod }> {
    return fetchWithCsrf().post(payment_methods.create.fetch({ financial_flow: financial_flow_id }).url, { name: value })
}


export default function Create({ financial_launch_id, expense_types, pay_methods, financial_flow_id }: { financial_launch_id?: number, expense_types?: ExpenseType[], pay_methods?: PaymentMethod[], financial_flow_id?: number }) {
    const { data, setData, post } = useForm({
        description: '',
        value: 0,
        expenseType: '',
        paymentMethod: '',
        date_expense: '',
        items: [] as ExpensesItem[],
    })

       const [expenseTypesState, setExpenseTypesState] = useState<ExpenseType[]>(expense_types ?? []);
       const [paymentMethodsState, setPaymentMethodsState] = useState<PaymentMethod[]>(pay_methods ?? []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(expensesRoutes.store.url({
            financial_flow: financial_flow_id!,
            financial_launch: financial_launch_id!
        }), {

            onError: () => {
                toast.error(trans("An error occurred while creating the revenue."));
            },
            onSuccess: () => {
                toast.success(trans("expense created successfully."));
            }
        })
    }

    return (
        <AppLayout  breadcrumbs={breadcrumbs(financial_launch_id!, financial_flow_id!)}>
            <Head title={trans("Add expense")} />
            <div className="px-4 py-6">
                <Heading title={trans("Add expense")} description={trans("Create a new expense record")} />
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


                                <div className="grid gap-2 ">
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
                                    <label className="font-medium">{trans("Expense Type")}</label>
                                    <ComboboxDemo
                                        placeholder={trans("Select a Expense Type")}
                                        items={[...expenseTypesState.map(expense_types => ({ value: expense_types.id.toString(), label: expense_types.name }))]}
                                        label={data.expenseType}
                                        value={data.expenseType}
                                        setValue={(value) => setData(prev => ({ ...prev, expenseType: value }))}
                                        handleCreate={(value) => {
                                            handleCreateExpenseType(value, financial_flow_id!.toString()).then(response => {
                                                setExpenseTypesState(prev => [...prev, response.data])
                                                setData(prev => ({ ...prev, expenseType: `${response.data.id}` }))
                                                toast.success(trans("Expense Type created successfully"))
                                            }).catch((e) => {
                                                toast.error(e.response.data.message)
                                            })
                                        }} />
                                </div>

                                <div className="grid gap-2">
                                    <label className="font-medium">{trans("Payment Method")}</label>
                                    <ComboboxDemo
                                        placeholder={trans("Select a Payment Method")}
                                        items={[...paymentMethodsState.map(payment_method => ({ value: payment_method.id.toString(), label: payment_method.name }))]}                                        
                                        label={data.paymentMethod}
                                        value={data.paymentMethod}
                                        setValue={(value) => setData(prev => ({ ...prev, paymentMethod: value }))}
                                        handleCreate={(value) => {
                                            handleCreatePaymentMethod(value, financial_flow_id!.toString()).then(response => {
                                                setPaymentMethodsState(prev => [...prev, response.data])
                                                setData(prev => ({ ...prev, paymentMethod: `${response.data.id}` }))
                                                toast.success(trans("Payment Method created successfully"))
                                            }).catch((e) => {
                                                toast.error(e.response.data.message)
                                            })
                                           }} />
                                </div>

                                <div className="grid gap-2">
                                    <label className="font-medium">{trans("Date Expense")}</label>
                                    <input
                                        type="date"
                                        className="block w-full border rounded px-3 py-2"
                                        value={data.date_expense}
                                        onChange={(e) => setData(prev => ({ ...prev, date_expense: e.target.value }))}
                                    />
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
