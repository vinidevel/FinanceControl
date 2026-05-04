"use client"

import { ColumnDef } from "@tanstack/react-table"
import { trans } from '../../../composables/translate';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { PencilLine } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";
import expenses from "@/routes/expenses";

export type Expense = {
    id: number
    description: string | null;
    value: number;
    paymentMethod: string | null;
    expenseType: string | null;
    financial_launch_id: number | null;
    financial_flow_id: number | null;
}


export const columns: ColumnDef<Expense>[] = [
    {
        accessorKey: "description",
        header: () => <div className="text-start text-xs md:text-base">{trans("Description")}</div>,
        cell: ({ row }) => {
            const description = row.getValue("description") as string | null;
            if (!description) return <div className="text-start text-xs md:text-base">—</div>;

            return <div className="text-start text-xs md:text-base">{description}</div>;
        }
    },

    {
        accessorKey: "value",
        header: () => <div className="text-start text-xs md:text-base">{trans("Value")}</div>,
        cell: ({ row }) => {
            const value = row.getValue("value") as number;
            return <div className="text-start text-xs md:text-base">{value}</div>;
        }
    },

     {
        accessorKey: "paymentMethod",
        header: () => <div className="text-start text-xs md:text-base">{trans("Payment Method")}</div>,
        cell: ({ row }) => {
            const paymentMethod = row.getValue("paymentMethod") as string | null;
            if (!paymentMethod) return <div className="text-start text-xs md:text-base">—</div>;

            return <div className="text-start text-xs md:text-base">{paymentMethod}</div>;
        }
    },

    {
        accessorKey: "expenseType",
        header: () => <div className="text-start text-xs md:text-base">{trans("Expense Type")}</div>,
        cell: ({ row }) => {
            const expenseType = row.getValue("expenseType") as string | null;
            if (!expenseType) return <div className="text-start text-xs md:text-base">—</div>;

            return <div className="text-start text-xs md:text-base">{expenseType}</div>;
        }
    },




    {
        accessorKey: "actions",
        header: () => <p className="text-center">Actions</p>,
        cell: ({ row }) => {
            return (
                <div className="flex w-full justify-center gap-2">

                    <Button variant="ghost" type="button" className="p-0 m-0">
                        <Link href={expenses.edit({
                            financial_flow: row.original.financial_flow_id!,
                            financial_launch: row.original.financial_launch_id!,
                            expense: row.original.id
                        }).url}>
                            <span className="hidden md:inline">
                                <PencilLine className="size-4" />
                            </span>
                        </Link>
                    </Button>
                    <DeleteDialog
                        url={expenses.destroy({
                            financial_flow: row.original.financial_flow_id!,
                            financial_launch: row.original.financial_launch_id!,
                            expense: row.original.id
                        }).url}
                        text={trans("Are you sure you want to delete this Expense ?")}
                        successMessage={trans("Expense deleted successfully.")}
                    />
                </div>
            )
        }
    }

]
