"use client"

import { ColumnDef } from "@tanstack/react-table"
import { trans } from '../../../composables/translate';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import financialLaunches from '@/routes/financial-launches';
import { PencilLine } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";
import financialFlows from "@/routes/financial-flows";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<FinancialFlow>[] = [
    {
        accessorKey: "year",
        header: () => <div className="text-start text-xs md:text-base">{trans("Year")}</div>,
        cell: ({ row }) => {
            const year = row.getValue("year") as number;
            return <div className="text-start text-xs md:text-base">{year}</div>
        }
    },

    {
        accessorKey: "financialLaunches",
        header: () => <div className="text-center text-xs md:text-base">{trans("Financial Lanches")}</div>,
        size: 200,
        cell: ({ row }) => {
            return (
                <div className="flex justify-center">

                    <Button className="justify-center">
                        <Link href={`${financialLaunches.index({ financial_flow: row.original.id }).url}`} className="flex justify-center">
                            Acessar lançamentos
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
                        <Link href={financialFlows.edit(row.original.id).url}>
                            <span className="hidden md:inline">
                                <PencilLine className="size-4" />
                            </span>
                        </Link>
                    </Button>
                    <DeleteDialog
                        url={financialFlows.destroy(row.original.id).url}
                        text={trans("Are you sure you want to delete this Financial Flow?")}
                        successMessage={trans("Financial Flow deleted successfully.")}
                    />
                </div>
            )
        }
    }

]
