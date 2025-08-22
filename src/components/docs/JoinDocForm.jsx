"use client"

import { useState } from "react"
import { Label } from "../ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


function JoinDocForm() {
  const [doclink, setdoclink] = useState("")
  const handleSubmit = () => {

  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Label className="text-sm font-medium text-gray-700">DocLink</Label>
        <Input
          className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
          name="doclink"
          placeholder="Enter Link"
          required
        ></Input>
        <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2.5 font-semibold">Join</Button>
      </form>
    </div>
  )
}

export default JoinDocForm
