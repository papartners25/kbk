"use client"

import { useState, useRef } from "react"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, Download, Copy } from "lucide-react"

export default function QRCodePage() {
  // This would be your deployed application URL
  const [url, setUrl] = useState("https://your-deployed-app-url.com")
  const [size, setSize] = useState(256)
  const qrRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=500,width=500")
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print QR Code</title></head><body>")
      printWindow.document.write(
        '<div style="display: flex; justify-content: center; align-items: center; height: 100%;">',
      )
      printWindow.document.write(qrRef.current?.innerHTML || "")
      printWindow.document.write("</div>")
      printWindow.document.write("</body></html>")
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg")
    if (!svg) return

    // Convert SVG to a data URL
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    // Create a link and trigger download
    const downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = "heritage-complaint-form-qr-code.svg"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err)
      })
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="KBK Enterprises Logo" className="h-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">The Heritage - Complaint Form QR Code</h1>
          <p className="mt-3 text-xl text-gray-500">Generate a QR code for easy access to your complaint form</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Settings</CardTitle>
              <CardDescription>Customize your QR code for the complaint form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Form URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-deployed-app-url.com"
                  />
                  <Button variant="outline" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">QR Code Size</Label>
                <Input
                  id="size"
                  type="number"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  min={128}
                  max={512}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Scan this QR code to access the complaint form</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-6">
              <div ref={qrRef} className="bg-white p-4 rounded-lg">
                <QRCode value={url} size={size} level="H" className="mx-auto" />
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground text-center w-full">
                Place this QR code in common areas for residents to easily access the complaint form
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Back to Complaint Form
          </Button>
        </div>
      </div>
    </div>
  )
}

