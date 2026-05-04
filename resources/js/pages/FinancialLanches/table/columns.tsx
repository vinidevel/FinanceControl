"use client"

import { ColumnDef } from "@tanstack/react-table"
import { trans } from '../../../composables/translate';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import financialLaunches from '@/routes/financial-launches';
import { PencilLine } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";
import revenues from "@/routes/revenues";
import expenses from "@/routes/expenses";



export const columns: ColumnDef<FinancialLaunch>[] = [
    {
        accessorKey: "month",
        header: () => <div className="text-start text-xs md:text-base">{trans("Month")}</div>,
        cell: ({ row }) => {
            const dateStr = row.getValue("month") as string | null;
            if (!dateStr) return <div className="text-start text-xs md:text-base">—</div>;

            // evita problemas de fuso se a string for 'YYYY-MM-DD'
            const date = new Date(dateStr.length === 10 ? dateStr + "T00:00:00" : dateStr);
            const monthName = date.toLocaleString("pt-BR", { month: "long" }); // "agosto"
            return <div className="text-start text-xs md:text-base">{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</div>;
        }
    },

    {
        accessorKey: "net_worth",
        header: () => <div className="text-start text-xs md:text-base">{trans("Saldo Conta Corrente")}</div>,
        cell: ({ row }) => {
            const net_worth = row.getValue("net_worth") as string | null;
            if (!net_worth) return <div className="text-start text-xs md:text-base">—</div>;

            const formatted = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(Number(net_worth));

            return <div className="text-start text-xs md:text-base">{formatted}</div>;
        }
    },


    {
        accessorKey: "totalRevenues",
        header: () => <div className="text-start text-xs md:text-base">{trans("Total Revenues")}</div>,
        size: 200,
        cell: ({ row }) => {
            const totalRevenues = row.original.totalRevenues;
            if (totalRevenues === null) return <div className="text-start text-xs md:text-base">—</div>;


            const formatted = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(totalRevenues ?? 0);

            return <div className="text-start text-xs md:text-base">{formatted}</div>;
        }
    },

    {
        accessorKey: "totalExpenses",
        header: () => <div className="text-start text-xs md:text-base">{trans("Total Expenses")}</div>,
        size: 200,
        cell: ({ row }) => {
            const totalExpenses = row.original.totalExpenses;
            if (totalExpenses === null) return <div className="text-start text-xs md:text-base">—</div>;


            const formatted = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(totalExpenses ?? 0);

            return <div className="text-start text-xs md:text-base">{formatted}</div>;
        }
    },

    {
        accessorKey: "month_net",
        header: () => <div className="text-start text-xs md:text-base">{trans("Net Worth (Revenues - Expenses)")}</div>,
        size: 200,
        cell: ({ row }) => {
            const monthNet = row.original.month_net;
            if (monthNet === null || monthNet === undefined) return <div className="text-start text-xs md:text-base">—</div>;

            const formatted = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(monthNet ?? 0);

            return <div className="text-start text-xs md:text-base">{formatted}</div>;
        }
    },


    {
        accessorKey: "Launches",
        header: () => <p className="text-center">Launches</p>,
        cell: ({ row }) => {

            return (
                <div className="flex w-full justify-center gap-2">
                    <Button className="justify-center">
                        <Link href={revenues.index({ financial_flow: row.original.financial_flow_id, financial_launch: row.original.id }).url} className="flex justify-center">
                            Entradas
                        </Link>
                    </Button>

                    <Button className="justify-center">
                        <Link href={expenses.index({ financial_flow: row.original.financial_flow_id, financial_launch: row.original.id }).url} className="flex justify-center">
                            Saídas
                        </Link>
                    </Button>

                </div>
            )
        }
    },



    {
        accessorKey: "actions",
        header: () => <p className="text-center">Actions</p>,
        cell: ({ row }) => {
            return (
                <div className="flex w-full justify-center gap-2">
                    {/* <Button variant="ghost" type="button" className="p-0 m-0">
                        <Link href={financialFlows.show(row.original.id).url}>
                            <span className="hidden md:inline">
                                <Eye className="size-4" />
                            </span>
                        </Link>
                    </Button> */}
                    <Button variant="ghost" type="button" className="p-0 m-0">
                        <Link href={financialLaunches.edit({
                            financial_flow: row.original.financial_flow_id,
                            financial_launch: row.original.id
                        }).url}>
                            <span className="hidden md:inline">
                                <PencilLine className="size-4" />
                            </span>
                        </Link>
                    </Button>
                    <DeleteDialog
                        url={financialLaunches.destroy({
                            financial_flow: row.original.financial_flow_id,
                            financial_launch: row.original.id
                        }).url}
                        text={trans("Are you sure you want to delete this Financial Launch?")}
                        successMessage={trans("Financial Launch deleted successfully.")}
                    />
                </div>
            )
        }
    }

]
