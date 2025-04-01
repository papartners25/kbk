import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Link from "next/link"
import { createComplaintsTable } from "./actions"

export const revalidate = 0 // Disable caching for this page

export default async function AdminPage() {
  let complaints = []
  let error = null
  let tableExists = true

  try {
    const { data, error: fetchError } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      // Check if the error is about the missing table
      if (fetchError.message.includes("does not exist") || fetchError.code === "42P01") {
        tableExists = false
      } else {
        error = fetchError
      }
    } else {
      complaints = data || []
    }
  } catch (err) {
    error = err instanceof Error ? err : new Error("Unknown error occurred")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-500 hover:bg-red-600"
      case "urgent":
        return "bg-orange-500 hover:bg-orange-600"
      case "standard":
        return "bg-blue-500 hover:bg-blue-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="KBK Enterprises Logo" className="h-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">The Heritage - Complaint Management</h1>
          <p className="mt-3 text-xl text-gray-500">View and manage submitted complaints</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">Back to Form</Link>
            </Button>
            <form action={createComplaintsTable}>
              <Button variant="outline" type="submit">
                Reset Database Table
              </Button>
            </form>
          </div>
        </div>

        {!tableExists ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Database Setup Required</CardTitle>
              <CardDescription>The complaints table doesn't exist yet in your database.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Before you can start collecting complaints, you need to create the database table. Click the button
                below to set up your database automatically.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                If automatic setup fails, you need to create the table manually in the Supabase dashboard. Follow these
                steps:
              </p>
              <ol className="text-sm text-gray-500 mt-2 list-decimal pl-5 space-y-1">
                <li>Go to your Supabase project dashboard</li>
                <li>Click on "SQL Editor" in the left sidebar</li>
                <li>Click "New Query"</li>
                <li>Paste the following SQL code:</li>
              </ol>
              <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-auto rounded">
                {`CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  unit TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  priority TEXT NOT NULL,
  date_noticed TEXT,
  description TEXT NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
              </pre>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Note:</strong> We've made the date_noticed column optional to avoid issues.
              </p>
            </CardContent>
            <CardFooter>
              <form action={createComplaintsTable}>
                <Button type="submit">Create Complaints Table</Button>
              </form>
            </CardFooter>
          </Card>
        ) : error ? (
          <Card className="max-w-md mx-auto bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error.message}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/">Back to Form</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <Card key={complaint.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          {complaint.first_name} {complaint.last_name}
                        </CardTitle>
                        <CardDescription>
                          {complaint.email} | {complaint.phone}
                        </CardDescription>
                      </div>
                      <Badge className={`${getPriorityColor(complaint.priority)} text-white`}>
                        {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p>
                          {complaint.street} - Unit {complaint.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Issue Type</p>
                        <p>{complaint.issue_type.charAt(0).toUpperCase() + complaint.issue_type.slice(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date Noticed</p>
                        <p>
                          {complaint.date_noticed ? format(new Date(complaint.date_noticed), "PPP") : "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Permission to Enter</p>
                        <p>{complaint.permission === "yes" ? "Yes" : "No, resident wants to be present"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                      <p className="whitespace-pre-wrap">{complaint.description}</p>
                    </div>
                    <div className="mt-4 text-right text-sm text-gray-500">
                      Submitted:{" "}
                      {complaint.created_at ? format(new Date(complaint.created_at), "PPP p") : "Date not recorded"}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No complaints have been submitted yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

