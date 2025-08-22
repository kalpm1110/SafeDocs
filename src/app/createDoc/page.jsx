"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"

export default function CreateDocForm() {
    const { user, isAuthenticated, isLoading } = useKindeAuth();

    const [allowedEmails, setAllowedEmails] = useState("")
    const [publicAccess, setPublicAccess] = useState(false)
    const [expiry, setExpiry] = useState(null)
    const [accessType, setAccessType] = useState("view")
  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) {
    return <p>You are not logged in</p>;
  }

  console.log(user);


  const resetForm = (e) => {
    e.target.reset();
    setAllowedEmails('');
    setPublicAccess(false);
    setExpiry(null);
    setAccessType('view');
  };

  const handleSubmit = async (e) => {
    console.log(e)
    e.preventDefault()

    try {
      const docData = {
        ownerId: user?.id,
        title: e.target.title.value,
        content: e.target.content.value,
        allowedEmails: allowedEmails.split(",").map((email) => email.trim()),
        publicAccess,
        expiry: expiry ? expiry.toISOString() : null,
        accessType
      }
      console.log("New Doc:", docData)
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData),
      })

      if (!res.ok) throw new Error(await res.json()).error || "Failed";
      const result = await res.json();
      alert("Doc Created !",result.id);
      resetForm(e);
    } catch (error) {
      console.log(error);
    }


  }

  return (
    <div className="bg-gray-100">
      <ArrowLeft className="h-6 w-6 ml-3 text-gray-600"  ></ArrowLeft>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

        <Card className="w-full max-w-3xl bg-white shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Create New Document</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">Title</Label>
                <Input
                  name="title"
                  placeholder="Document title"
                  required
                  className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Content</Label>
                <Textarea
                  name="content"
                  placeholder="Write your document..."
                  className="mt-1.5 h-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                />
              </div>


              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Public Access (anyone with link)</Label>
                <Switch checked={publicAccess} onCheckedChange={setPublicAccess} />
              </div>
              <div>
                {!publicAccess ? (
                  <>
                    <Label className="text-sm font-medium text-gray-700">Allowed Emails</Label>
                    <Input
                      value={allowedEmails}
                      onChange={(e) => setAllowedEmails(e.target.value)}
                      placeholder="email1@example.com, email2@example.com"
                      className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                    />
                  </>) : null}

              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Expiry Date</Label>
                <div className="mt-1.5">
                  <Calendar
                    mode="single"
                    selected={expiry}
                    onSelect={setExpiry}
                    className="border rounded-md border-gray-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Permissions</Label>
                <RadioGroup
                  value={accessType}
                  onValueChange={setAccessType}
                  className="mt-2 space-y-2"
                >
                  {["view", "edit"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="text-sm capitalize text-gray-700">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2.5 font-semibold"
              >
                Create Document
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}