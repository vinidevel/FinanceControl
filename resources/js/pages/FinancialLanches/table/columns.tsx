"use client"

import { ColumnDef } from "@tanstack/react-table"
import { trans } from '../../../composables/translate';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import financialLaunches from '@/routes/financial-launches';
import { PencilLine } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";
import revenues from "@/routes/revenues";



export const columns: ColumnDef<FinancialLaunch>[] = [
    {
        accessorKey: "month",
        header: () => <div className="text-start text-xs md:text-base">{trans("Month")}</div>,
        cell: ({ row }) => {    const dateStr = row.getValue("month") as string | null;
    if (!dateStr) return <div className="text-start text-xs md:text-base">—</div>;

    // evita problemas de fuso se a string for 'YYYY-MM-DD'
    const date = new Date(dateStr.length === 10 ? dateStr + "T00:00:00" : dateStr);
    const monthName = date.toLocaleString("pt-BR", { month: "long" }); // "agosto"
    return <div className="text-start text-xs md:text-base">{monthName.charAt(0).toUpperCase() + monthName.slice(1) }</div>;
        }
    },

    
    {
        accessorKey: "revenues",
        header: () => <div className="text-center text-xs md:text-base">{trans("Revenues")}</div>,
        size: 200,
        cell: ({ row }) => {
            return (
                <div className="flex justify-center">

                    <Button className="justify-center">
                        <Link href={`${revenues.index().url}?financial_launch_id=${encodeURIComponent(String(row.original.id))}`} className="flex justify-center">
                            Entradas
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
                        <Link href={financialLaunches.edit(row.original.id).url}>
                            <span className="hidden md:inline">
                                <PencilLine className="size-4" />
                            </span>
                        </Link>
                    </Button>
                    <DeleteDialog
                        url={financialLaunches.destroy(row.original.id).url}
                        text={trans("Are you sure you want to delete this Financial Launch?")}
                        successMessage={trans("Financial Launch deleted successfully.")}
                    />
                </div>
            )
        }
    }

]
