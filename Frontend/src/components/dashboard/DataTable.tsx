import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReplacementRecord, getUniqueValues } from "@/lib/parseData";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, X } from "lucide-react";

interface DataTableProps {
  data: ReplacementRecord[];
}

type SortDirection = "asc" | "desc" | null;
type SortField = keyof ReplacementRecord | null;

export function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [engineerFilter, setEngineerFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const ratings = useMemo(() => getUniqueValues(data, "rating"), [data]);
  const engineers = useMemo(() => getUniqueValues(data, "engineer"), [data]);
  const [stateFilter, setStateFilter] = useState<string>("all");

  const states = useMemo(() => getUniqueValues(data, "state"), [data]);


//   const filteredAndSortedData = useMemo(() => {
//     let result = [...data];

//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(
//         (record) =>
//           record.serialNumber.toLowerCase().includes(term) ||
//           record.issue.toLowerCase().includes(term) ||
//           record.customer.toLowerCase().includes(term) ||
//           record.engineer.toLowerCase().includes(term)
//       );
//     }


//     if (stateFilter && stateFilter !== "all") {
//   result = result.filter((record) =>
//     record.state.toLowerCase().includes(stateFilter.toLowerCase())
//   );
// }


//     // Apply rating filter
//     if (ratingFilter && ratingFilter !== "all") {
//       result = result.filter((record) => record.rating === ratingFilter);
//     }

//     // Apply engineer filter
//     if (engineerFilter && engineerFilter !== "all") {
//       result = result.filter((record) =>
//         record.engineer.toLowerCase().includes(engineerFilter.toLowerCase())
//       );
//     }

//     // Apply sorting
//     if (sortField && sortDirection) {
//       result.sort((a, b) => {
//         const aVal = a[sortField];
//         const bVal = b[sortField];
//         if (typeof aVal === "string" && typeof bVal === "string") {
//           return sortDirection === "asc"
//             ? aVal.localeCompare(bVal)
//             : bVal.localeCompare(aVal);
//         }
//         return 0;
//       });
//     }

//     return result;
//   }, [data, searchTerm, ratingFilter, engineerFilter, sortField, sortDirection]);


const filteredAndSortedData = useMemo(() => {
  let result = [...data];

  // 1️⃣ Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      (record) =>
        record.serialNumber.toLowerCase().includes(term) ||
        record.issue.toLowerCase().includes(term) ||
        record.customer.toLowerCase().includes(term) ||
        record.engineer.toLowerCase().includes(term)
    );
  }

  // 2️⃣ Apply state filter
  if (stateFilter && stateFilter !== "all") {
    result = result.filter((record) =>
      record.state.toLowerCase().includes(stateFilter.toLowerCase())
    );
  }

  // 3️⃣ Apply rating filter
  if (ratingFilter && ratingFilter !== "all") {
    result = result.filter((record) => record.rating === ratingFilter);
  }

  // 4️⃣ Apply engineer filter
  if (engineerFilter && engineerFilter !== "all") {
    result = result.filter((record) =>
      record.engineer.toLowerCase().includes(engineerFilter.toLowerCase())
    );
  }

  // 5️⃣ Build state order map (to preserve original CSV order)
  const stateOrder: Record<string, number> = {};
  data.forEach((r, idx) => {
    if (r.state && !(r.state in stateOrder)) stateOrder[r.state] = idx;
  });

  // 6️⃣ Apply sorting
  if (sortField && sortDirection) {
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (sortField === "state") {
        const aIdx = stateOrder[a.state] ?? 0;
        const bIdx = stateOrder[b.state] ?? 0;
        return sortDirection === "asc" ? aIdx - bIdx : bIdx - aIdx;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
  }

  return result;
}, [data, searchTerm, ratingFilter, engineerFilter, stateFilter, sortField, sortDirection]);



  const handleSort = (field: keyof ReplacementRecord) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof ReplacementRecord) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    if (sortDirection === "asc") return <ArrowUp className="ml-2 h-4 w-4 text-primary" />;
    return <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRatingFilter("all");
    setEngineerFilter("all");
    setSortField(null);
    setSortDirection(null);
  };

  const hasActiveFilters = searchTerm || ratingFilter !== "all" || engineerFilter !== "all";

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-semibold">
            Replacement Records
            <Badge variant="secondary" className="ml-3">
              {filteredAndSortedData.length} of {data.length}
            </Badge>
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        <Select value={stateFilter} onValueChange={setStateFilter}>
        <SelectTrigger className="w-[140px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="State" />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          <SelectItem value="all">All States</SelectItem>
          {states.map((state) => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

        <div className="flex flex-col gap-3 pt-2 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by serial, issue, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Ratings</SelectItem>
                {ratings.map((rating) => (
                  <SelectItem key={rating} value={rating}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={engineerFilter} onValueChange={setEngineerFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Engineer" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Engineers</SelectItem>
                {engineers.map((engineer) => (
                  <SelectItem key={engineer} value={engineer}>
                    {engineer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
                <Table>
  <TableHeader>
    <TableRow className="bg-[#f3f8ff] border-b border-blue-200">
      <TableHead
        className="cursor-pointer select-none hover:bg-blue-50 text-blue-700 font-semibold"
        onClick={() => handleSort("date")}
      >
        <div className="flex items-center gap-1">
          Date
          {getSortIcon("date")}
        </div>
      </TableHead>

      <TableHead
        className="cursor-pointer select-none hover:bg-blue-50 text-blue-700 font-semibold"
        onClick={() => handleSort("rating")}
      >
        <div className="flex items-center gap-1">
          Rating
          {getSortIcon("rating")}
        </div>
      </TableHead>

      <TableHead
        className="cursor-pointer select-none hover:bg-blue-50 text-blue-700 font-semibold"
        onClick={() => handleSort("serialNumber")}
      >
        <div className="flex items-center gap-1">
          Serial No
          {getSortIcon("serialNumber")}
        </div>
      </TableHead>

      <TableHead className="text-blue-700 font-semibold">Issue</TableHead>

      <TableHead
        className="cursor-pointer select-none hover:bg-blue-50 text-blue-700 font-semibold"
        onClick={() => handleSort("customer")}
      >
        <div className="flex items-center gap-1">
          Customer
          {getSortIcon("customer")}
        </div>
      </TableHead>

      <TableHead
        className="cursor-pointer select-none hover:bg-blue-50 text-blue-700 font-semibold"
        onClick={() => handleSort("engineer")}
      >
        <div className="flex items-center gap-1">
          Engineer
          {getSortIcon("engineer")}
        </div>
      </TableHead>

      <TableHead className="text-blue-700 font-semibold">Status</TableHead>
    </TableRow>


    <TableHead
  className="cursor-pointer select-none hover:bg-blue-50 text-blue-700 font-semibold"
  onClick={() => handleSort("state")}
>
  <div className="flex items-center gap-1">
    State
    {getSortIcon("state")}
  </div>
</TableHead>

  </TableHeader>

  <TableBody>
    {filteredAndSortedData.slice(0, 50).map((record, index) => (
      <TableRow
        key={record.id}
        className={`
          hover:bg-blue-50 transition-colors
          ${index % 2 === 0 ? "bg-white" : "bg-[#f9fbff]"}
        `}
      >
        <TableCell className="font-medium text-gray-700">{record.date}</TableCell>

        <TableCell>
          <Badge
            variant="outline"
            className="font-mono text-xs border-blue-300 text-blue-700"
          >
            {record.rating}
          </Badge>
        </TableCell>

        <TableCell className="font-mono text-sm text-gray-700">
          {record.serialNumber}
        </TableCell>

        <TableCell
          className="max-w-[250px] truncate text-sm text-gray-700"
          title={record.issue}
        >
          {record.issue}
        </TableCell>

        <TableCell
          className="max-w-[180px] truncate text-sm text-gray-700"
          title={record.customer}
        >
          {record.customer}
        </TableCell>

        <TableCell className="text-sm text-gray-700 font-semibold">
          {record.engineer}
        </TableCell>

        <TableCell>
          {record.status && (
            <Badge
              className={`
                text-xs px-2 py-1 border
                ${
                  record.status.toLowerCase().includes("done")
                    ? "bg-blue-600 text-white border-blue-700"
                    : record.status.toLowerCase().includes("pending")
                    ? "bg-yellow-200 text-yellow-800 border-yellow-300"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }
              `}
            >
              {record.status.slice(0, 20)}
              {record.status.length > 20 ? "..." : ""}
            </Badge>
          )}
        </TableCell>

        <TableCell className="text-sm text-gray-700 font-semibold">
          {record.state}
        </TableCell>

      </TableRow>
    ))}
  </TableBody>
</Table>

        </div>
        {filteredAndSortedData.length > 50 && (
          <div className="border-t px-6 py-3 text-center text-sm text-muted-foreground">
            Showing first 50 of {filteredAndSortedData.length} records
          </div>
        )}
      </CardContent>
    </Card>
  );
}
