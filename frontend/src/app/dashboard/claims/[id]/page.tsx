import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ClaimDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Claim #{params.id}</h2>
          <p className="text-sm text-slate-500">Damaged Food • Requested Refund: ₹749</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="text-xs h-8">Request Evidence</Button>
          <Button variant="outline" className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
          <Button className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white">Approve Refund</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 pt-2">
        {/* Left Column - Evidence */}
        <div className="col-span-1 space-y-4">
          <Card className="rounded-md border-slate-200 shadow-none">
            <CardHeader className="px-4 py-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-800">Uploaded Evidence</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="aspect-square bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center">
                <span className="text-xs text-slate-400">[ Image Placeholder ]</span>
              </div>
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between"><span>File:</span> <span className="font-mono text-slate-900">IMG_8291.jpg</span></div>
                <div className="flex justify-between"><span>Hash:</span> <span className="font-mono text-slate-900 truncate ml-2">a9b83c...</span></div>
                <div className="flex justify-between"><span>Size:</span> <span className="text-slate-900">1.2 MB</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Verification Engines */}
        <div className="col-span-2 space-y-4">
          
          {/* Risk Engine */}
          <Card className="rounded-md border-red-200 bg-red-50/30 shadow-none">
            <CardHeader className="px-4 py-3 border-b border-red-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-red-900">Risk Assessment</CardTitle>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 shadow-none">87 / 100 HIGH RISK</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-700"><span>Repeated similar claims</span><span className="text-red-700 font-medium">+22</span></div>
                <div className="flex justify-between text-slate-700"><span>Provenance signal detected</span><span className="text-red-700 font-medium">+18</span></div>
                <div className="flex justify-between text-slate-700"><span>Image manipulation indicators</span><span className="text-red-700 font-medium">+17</span></div>
                <div className="flex justify-between text-slate-700"><span>Claim frequency anomaly</span><span className="text-red-700 font-medium">+14</span></div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {/* Provenance */}
            <Card className="rounded-md border-slate-200 shadow-none">
              <CardHeader className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-slate-600">Provenance</CardTitle>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-1">
                <div className="flex justify-between"><span>C2PA</span> <span className="text-amber-600 font-medium">✓ Detected</span></div>
                <div className="flex justify-between"><span>Issuer</span> <span className="text-slate-900">OpenAI</span></div>
                <div className="flex justify-between"><span>SynthID</span> <span className="text-slate-400">Not detected</span></div>
              </CardContent>
            </Card>

            {/* Forensics */}
            <Card className="rounded-md border-slate-200 shadow-none">
              <CardHeader className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-slate-600">Forensics</CardTitle>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-1">
                <div className="flex justify-between"><span>Manipulation</span> <span className="text-amber-600 font-medium">⚠ Possible</span></div>
                <div className="flex justify-between"><span>Metadata</span> <span className="text-green-600">✓ Intact</span></div>
                <div className="flex justify-between"><span>Duplicate</span> <span className="text-red-600 font-medium">92% Match</span></div>
              </CardContent>
            </Card>
          </div>

          {/* AI Evidence Assistant */}
          <Card className="rounded-md border-slate-200 shadow-none mt-4">
            <CardHeader className="px-4 py-2 border-b border-slate-100">
              <CardTitle className="text-xs uppercase tracking-wider font-semibold text-slate-600">Smart Evidence Assistant</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-100">
                <strong>AI Analysis:</strong> This claim has a high similarity score (92%) to a previously refunded claim. The metadata is intact, but the image shows signs of potential manipulation around the edges of the damaged food item.
              </div>
              <div className="text-xs text-slate-700 bg-blue-50/50 p-3 rounded border border-blue-100">
                <strong>Recommended Request:</strong> "Please provide a new, unedited photo of the damaged item with today's date written on a piece of paper visible in the frame."
              </div>
              <div className="flex gap-2 mt-1">
                <Button variant="outline" className="text-xs h-7 text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100">Send Recommendation to User</Button>
                <Button variant="outline" className="text-xs h-7">Regenerate</Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
