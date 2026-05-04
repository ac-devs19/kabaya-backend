import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { ReactPortal, useState } from "react";
import { Badge } from "@/components/ui/badge";

type Resident = {
    id: number;
    id_number: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    suffix: string;
    user_verified_at: string;
};

const columns: ColumnDef<Resident>[] = [
    {
        accessorKey: "id_number",
        header: "ID Number",
    },
    {
        accessorKey: "last_name",
        header: "Last Name",
    },
    {
        accessorKey: "first_name",
        header: "First Name",
    },
    {
        accessorKey: "middle_name",
        header: "Middle Name",
        cell: ({ row }) => {
            const resident = row.original;
            return resident.middle_name ?? "N/A";
        },
    },
    {
        accessorKey: "suffix",
        header: "Suffix",
        cell: ({ row }) => {
            const resident = row.original;
            return resident.suffix ?? "N/A";
        },
    },
    {
        accessorKey: "user_verified_at",
        header: "Verification Status",
        cell: ({ row }) => {
            const resident = row.original;
            return (
                <Badge
                    variant={
                        resident.user_verified_at ? "default" : "destructive"
                    }
                >
                    {resident.user_verified_at ? "Verified" : "Not Verified"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const resident = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function Resident() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchResident = async ({ queryKey }: any) => {
        const [_key, page, search] = queryKey;

        const { data } = await axios.get("/api/users/residents", {
            params: {
                page,
                search,
            },
        });

        return data;
    };

    const { data, isLoading } = useQuery({
        queryKey: ["residents", page, search],
        queryFn: fetchResident,
    });

    return (
        <DataTable
            columns={columns}
            data={data?.data ?? []}
            page={page}
            lastPage={data?.last_page ?? 1}
            setPage={setPage}
            search={search}
            setSearch={setSearch}
        />
    );
}

Resident.layout = (page: ReactPortal) => <AppLayout children={page} />;
