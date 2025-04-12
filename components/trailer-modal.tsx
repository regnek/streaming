"use client"
import { X } from "lucide-react"
import { VideoTrailer } from "@/components/video-trailer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"

interface TrailerModalProps {
  isOpen: boolean
  onClose: () => void
  trailerUrl: string
  posterUrl?: string
}

export function TrailerModal({ isOpen, onClose, trailerUrl, posterUrl }: TrailerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/80" />
      <DialogContent className="sm:max-w-[80vw] max-h-[90vh] p-0 bg-transparent border-none">
        <div className="relative w-full aspect-video">
          <VideoTrailer src={trailerUrl} poster={posterUrl} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 z-50"
        >
          <X className="h-5 w-5 text-white" />
          <span className="sr-only">Close</span>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
