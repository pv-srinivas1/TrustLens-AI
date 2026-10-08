import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverview() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-5 gap-3">
        <Card className="rounded-md border-slate-200 shadow-none">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Total Claims</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-medium text-slate-900">24,821</div>
          </CardContent>
        </Card>
        <Card className="rounded-md border-slate-200 shadow-none">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Low Risk</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-medium text-slate-900">18,402</div>
          </CardContent>
        </Card>
        <Card className="rounded-md border-slate-200 shadow-none">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-medium text-slate-900">4,891</div>
          </CardContent>
        </Card>
        <Card className="rounded-md border-slate-200 shadow-none">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">High Risk</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-medium text-slate-900">1,214</div>
          </CardContent>
        </Card>
        <Card className="rounded-md border-slate-200 shadow-none">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Critical</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-medium text-slate-900">314</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="col-span-2">
          <Card className="rounded-md border-slate-200 shadow-none">
            <CardHeader className="px-4 py-3 border-b border-slate-100">
              <CardTitle className="text-sm font-medium text-slate-800">Review Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px] text-xs">Claim ID</TableHead>
                    <TableHead className="text-xs">Category</TableHead>
                    <TableHead className="text-xs">Risk Score</TableHead>
                    <TableHead className="text-xs text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-xs">CLM-10291</TableCell>
                    <TableCell className="text-xs">Damaged Food</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 hover:bg-red-50">87 (HIGH)</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs">₹749</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs">CLM-10292</TableCell>
                    <TableCell className="text-xs">Missing Item</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-50">65 (MEDIUM)</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs">₹250</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs">CLM-10293</TableCell>
                    <TableCell className="text-xs">Spoiled Food</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 hover:bg-red-50">92 (CRITICAL)</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs">₹1200</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1">
          <Card className="rounded-md border-slate-200 shadow-none">
            <CardHeader className="px-4 py-3 border-b border-slate-100">
              <CardTitle className="text-sm font-medium text-slate-800">Loss Prevented</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-4">
              <div className="text-2xl font-semibold text-slate-900 tracking-tight">₹4,82,500</div>
              <p className="text-xs text-slate-500 mt-1">Estimated value of flagged suspicious claims</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
