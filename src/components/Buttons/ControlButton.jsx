"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

import JoinDocForm from "../docs/JoinDocForm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

function ControlButton() {
  const router=useRouter()
  const [openCreate, setOpenCreate] = useState(false)
  const [openJoin, setOpenJoin] = useState(false)

  return (
    <div className="flex gap-4">

      <Button onClick={()=>router.push("/createDoc")}>Create</Button>

      <Dialog open={openJoin} onOpenChange={setOpenJoin}>
        <DialogTrigger asChild>
          <Button>Join</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Join New Document</DialogTitle>
          </DialogHeader>
          <JoinDocForm onclose={() => setOpenJoin(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ControlButton;