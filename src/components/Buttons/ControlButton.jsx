"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CreateDocForm from "../docs/CreateDocForm"
import JoinDocForm from "../docs/JoinDocForm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function ControlButton() {
  const [openCreate, setOpenCreate] = useState(false)
  const [openJoin, setOpenJoin] = useState(false)

  return (
    <div className="flex gap-4">
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogTrigger asChild>
          <Button>Create</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create a New Document</DialogTitle>
          </DialogHeader>
          <CreateDocForm onclose={() => setOpenCreate(false)} />
        </DialogContent>
      </Dialog>

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

export default ControlButton