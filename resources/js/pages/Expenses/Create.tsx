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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import credit_cards from "@/routes/credit_cards";



const breadcrumbs = (financial_launch_id: number, financial_flow_id: number) => [
    { title: "Dashboard", href: dashboard.url() },
    { title: "Financial Flows", href: financialFlows.index().url },
    { title: "Financial Launches", href: financialLaunches.index({ financial_flow: financial_flow_id }).url },
    { title: "Expenses", href: expensesRoutes.index({ financial_flow: financial_flow_id, financial_launch: financial_launch_id }).url },
    { title: "Add Expense", href: "/expenses/create" },
];



type CreditCard = { id: number; name: string; expiration_date: string };


function handleCreateExpenseType(value: string, financial_flow_id: string): Promise<{ data: ExpenseType }> {
    return fetchWithCsrf().post(expense_types.create.fetch({ financial_flow: financial_flow_id }).url, { name: value })
}

function handleCreateCreditCard(value: string, financial_flow_id: string, expirationDate: string, invoiceClosingDate: string): Promise<{ data: CreditCard }> {
    return fetchWithCsrf().post(credit_cards.create.fetch({ financial_flow: financial_flow_id }).url, { name: value, expiration_date: expirationDate, invoice_closing_date: invoiceClosingDate })
}

function handleCreatePaymentMethod(value: string, financial_flow_id: string): Promise<{ data: PaymentMethod }> {
    return fetchWithCsrf().post(payment_methods.create.fetch({ financial_flow: financial_flow_id }).url, { name: value })
}


export default function Create({ financial_launch_id, expense_types, pay_methods, financial_flow_id, credit_cards }: { financial_launch_id?: number, expense_types?: ExpenseType[], pay_methods?: PaymentMethod[], financial_flow_id?: number, credit_cards?: CreditCard[] }) {
    const { data, setData, post } = useForm({
        description: '',
        value: 0,
        expenseType: '',
        paymentMethod: '',
        date_expense: '',
        credit_card_id: '',
        installments_quantity: 1,
        items: [] as ExpensesItem[],
    })

    const [expenseTypesState, setExpenseTypesState] = useState<ExpenseType[]>(expense_types ?? []);
    const [paymentMethodsState, setPaymentMethodsState] = useState<PaymentMethod[]>(pay_methods ?? []);
    const [creditCardsState, setCreditCardsState] = useState<CreditCard[]>(credit_cards ?? []);
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState('');
    const [installments, setInstallments] = useState(1);
    const [showCreateCardModal, setShowCreateCardModal] = useState(false);
    const [newCardName, setNewCardName] = useState('');
    const [newCardExpirationDate, setNewCardExpirationDate] = useState('');
    const [newCardInvoiceClosingDate, setNewCardInvoiceClosingDate] = useState('');

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
        <AppLayout breadcrumbs={breadcrumbs(financial_launch_id!, financial_flow_id!)}>
            <Head title={trans("Add expense")} />
            <div className="px-4 py-6">
                <Heading title={trans("Add expense")} description={trans("Create a new expense record")} />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <Dialog open={showCreateCardModal} onOpenChange={(open) => {
                        setShowCreateCardModal(open);
                        if (!open) {
                            setNewCardName('');
                            setNewCardExpirationDate('');
                            setNewCardInvoiceClosingDate('');
                        }
                    }}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{trans("Create Credit Card")}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="font-medium">{trans("Card Name")}</label>
                                    <Input
                                        type="text"
                                        value={newCardName}
                                        placeholder={trans("Card name")}
                                        onChange={(e) => setNewCardName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="font-medium">{trans("Expiration Date")}</label>
                                    <Input
                                        type="date"
                                        value={newCardExpirationDate}
                                        onChange={(e) => setNewCardExpirationDate(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="font-medium">{trans("Invoice Closing Date")}</label>
                                    <Input
                                        type="date"
                                        value={newCardInvoiceClosingDate}
                                        onChange={(e) => setNewCardInvoiceClosingDate(e.target.value)}
                                    />
                                </div>
                                <Button onClick={() => {
                                    if (!newCardName || !newCardExpirationDate || !newCardInvoiceClosingDate) {
                                        toast.error(trans("Please fill in all fields"));
                                        return;
                                    }
                                    handleCreateCreditCard(newCardName, financial_flow_id!.toString(), newCardExpirationDate, newCardInvoiceClosingDate).then(response => {
                                        setCreditCardsState(prev => [...prev, response.data]);
                                        setSelectedCard(response.data.id.toString());
                                        setData(prev => ({ ...prev, credit_card_id: response.data.id.toString() }));
                                        toast.success(trans("Credit Card created successfully"));
                                        setShowCreateCardModal(false);
                                        setShowModal(false);
                                    }).catch((e) => {
                                        toast.error(e.response.data.message);
                                    });
                                }}>{trans("Create")}</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={showModal} onOpenChange={setShowModal}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{trans("Credit Card Details")}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="font-medium">{trans("Select Credit Card")}</label>
                                    <ComboboxDemo
                                        placeholder={trans("Select a Credit Card")}
                                        items={creditCardsState?.map(card => ({ value: card.id.toString(), label: card.name })) || []}
                                        value={selectedCard}
                                        setValue={setSelectedCard}
                                        handleCreate={(value) => {
                                            setNewCardName(value);
                                            setShowCreateCardModal(true);
                                        }} />
                                </div>
                                <div className="grid gap-2">
                                    <label className="font-medium">{trans("Number of Installments")}</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={installments}
                                        onChange={(e) => setInstallments(Number(e.target.value))}
                                    />
                                </div>
                                <Button onClick={() => {
                                    setData('credit_card_id', selectedCard);
                                    setData('installments_quantity', installments);
                                    setShowModal(false);
                                }}>{trans("Confirm")}</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
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
                                        setValue={(value) => {
                                            const selectedMethod = paymentMethodsState.find(pm => pm.id.toString() === value);
                                            if (selectedMethod && selectedMethod.name === 'Cartão de Crédito') {
                                                setShowModal(true);
                                            }
                                            setData(prev => ({ ...prev, paymentMethod: value }))
                                        }}
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
