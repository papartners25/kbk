import ComplaintForm from "@/components/complaint-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="KBK Enterprises Logo" className="h-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">The Heritage - Community Complaint Form</h1>
          <p className="mt-3 text-xl text-gray-500">Report issues or concerns about our community</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/qr-code">Generate QR Code</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        </div>
        <ComplaintForm />
      </div>
    </main>
  )
}

