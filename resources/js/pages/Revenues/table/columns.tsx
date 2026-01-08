"use client"

import { ColumnDef } from "@tanstack/react-table"
import { trans } from '../../../composables/translate';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { PencilLine } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";
import revenues from "@/routes/revenues";



export const columns: ColumnDef<Revenue>[] = [
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
        accessorKey: "actions",
        header: () => <p className="text-center">Actions</p>,
        cell: ({ row }) => {
            return (
                <div className="flex w-full justify-center gap-2">

                    <Button variant="ghost" type="button" className="p-0 m-0">
                        <Link href={revenues.edit({
                            financial_flow: row.original.financial_flow_id!,
                            financial_launch: row.original.financial_launch_id!,
                            revenue: row.original.id
                        }).url}>
                            <span className="hidden md:inline">
                                <PencilLine className="size-4" />
                            </span>
                        </Link>
                    </Button>
                    <DeleteDialog
                        url={revenues.destroy({
                            financial_flow: row.original.financial_flow_id!,
                            financial_launch: row.original.financial_launch_id!,
                            revenue: row.original.id
                        }).url}
                        text={trans("Are you sure you want to delete this Revenue ?")}
                        successMessage={trans("Revenue  deleted successfully.")}
                    />
                </div>
            )
        }
    }

]
