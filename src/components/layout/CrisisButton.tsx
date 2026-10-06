"use client"

import * as React from "react"
import { Phone, X, Heart, Shield, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const emergencyResources = [
  {
    name: "988 Suicide & Crisis Lifeline",
    number: "988",
    description: "Call or text 988 for free, confidential support 24/7",
    icon: Phone,
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "Free 24/7 text-based crisis support",
    icon: Heart,
  },
  {
    name: "SAMHSA National Helpline",
    number: "1-800-662-4357",
    description: "Treatment referral and information service",
    icon: Shield,
  },
  {
    name: "Emergency Services",
    number: "911",
    description: "For immediate life-threatening emergencies",
    icon: Users,
  },
]

const immediateSteps = [
  "Take 5 deep breaths — inhale for 4 counts, hold for 4, exhale for 6",
  "Ground yourself: Name 5 things you can see, 4 you can touch, 3 you can hear",
  "Reach out to your sponsor, a trusted friend, or a crisis line",
  "Remove yourself from triggering environments or substances",
  "Remember: This feeling is temporary. You have survived every urge so far.",
]

export function CrisisButton() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="lg"
          className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg md:bottom-6 md:right-6"
          aria-label="Crisis support"
          data-crisis-button
        >
          <Phone className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive dark:text-destructive">
            <Phone className="h-5 w-5" />
            Crisis Support
          </DialogTitle>
          <DialogDescription>
            You are not alone. Help is available right now.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Emergency Resources */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Emergency Resources
              </h3>
              <div className="space-y-2">
                {emergencyResources.map((resource) => {
                  const Icon = resource.icon
                  return (
                    <div
                      key={resource.name}
                      className="flex items-start gap-3 rounded-lg border bg-card p-3"
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-destructive dark:text-destructive" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{resource.name}</p>
                        <p className="text-sm font-semibold text-destructive dark:text-destructive">
                          {resource.number}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <Separator />

            {/* Immediate Steps */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Immediate Coping Steps
              </h3>
              <ol className="space-y-2">
                {immediateSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-xs font-semibold text-destructive dark:bg-destructive/15 dark:text-destructive">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <Separator />

            {/* Encouragement */}
            <div className="rounded-lg bg-destructive/10 p-4 text-center">
              <p className="text-sm font-medium text-destructive dark:text-destructive">
                You matter. Your recovery matters. This moment will pass.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
