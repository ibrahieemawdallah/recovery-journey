'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Plus, Trash2, ListChecks, MessageSquareQuote, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

type Lang = 'en' | 'ar'

export type StepTask = {
  id: string
  taskIndex: number
  title: string
  done: boolean
  doneAt: string | null
  note: string | null
}

export type StepReflection = {
  id: string
  body: string
  clarity: number | null
  createdAt: string
}

const t = (lang: Lang, en: string, ar: string) => (lang === 'en' ? en : ar)

/* ================================================================== *
 * Tasks — the concrete actions that constitute working the step
 * ================================================================== */
export function StepTasks({
  stepNumber,
  language,
  tasks,
  onChange,
}: {
  stepNumber: number
  language: Lang
  tasks: StepTask[]
  onChange: (next: StepTask[]) => void
}) {
  const [newTitle, setNewTitle] = useState('')
  const [busy, setBusy] = useState<number | null>(null)
  const [openNote, setOpenNote] = useState<number | null>(null)

  const done = tasks.filter((x) => x.done).length
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0

  const post = async (payload: Record<string, unknown>) => {
    const res = await fetch('/api/steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepNumber, ...payload }),
    })
    return res.ok ? res.json() : null
  }

  const toggle = async (task: StepTask) => {
    setBusy(task.taskIndex)
    const optimistic = tasks.map((x) => (x.taskIndex === task.taskIndex ? { ...x, done: !x.done } : x))
    onChange(optimistic)
    const r = await post({ action: 'toggleTask', taskIndex: task.taskIndex })
    if (r?.progress?.tasks) onChange(r.progress.tasks)
    setBusy(null)
  }

  const saveNote = async (task: StepTask, note: string) => {
    if ((task.note ?? '') === note) return
    const r = await post({ action: 'taskNote', taskIndex: task.taskIndex, note })
    if (r?.progress?.tasks) onChange(r.progress.tasks)
  }

  const add = async () => {
    if (!newTitle.trim()) return
    const r = await post({ action: 'addTask', title: newTitle.trim() })
    if (r?.progress?.tasks) onChange(r.progress.tasks)
    setNewTitle('')
  }

  const remove = async (task: StepTask) => {
    onChange(tasks.filter((x) => x.taskIndex !== task.taskIndex))
    const r = await post({ action: 'deleteTask', taskIndex: task.taskIndex })
    if (r?.progress?.tasks) onChange(r.progress.tasks)
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h4 className="flex items-center gap-2 font-semibold text-sm">
          <ListChecks className="w-4 h-4 text-primary" />
          {t(language, 'What to actually do', 'ما يجب فعله فعلاً')}
        </h4>
        <Badge variant="secondary">
          {done}/{tasks.length}
        </Badge>
      </div>

      <Progress value={pct} className="h-1.5" />

      <ul className="space-y-1.5">
        {tasks.map((task) => (
          <li key={task.id} className="rounded-lg border border-border/60 p-3">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.done}
                onCheckedChange={() => void toggle(task)}
                disabled={busy === task.taskIndex}
                className="mt-0.5"
                aria-label={task.title}
              />
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm leading-relaxed ${
                    task.done ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </span>

                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    onClick={() => setOpenNote(openNote === task.taskIndex ? null : task.taskIndex)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <MessageSquareQuote className="w-3 h-3" />
                    {task.note
                      ? t(language, 'Your note', 'ملاحظتك')
                      : t(language, 'Add a note', 'أضف ملاحظة')}
                    {openNote === task.taskIndex ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {openNote === task.taskIndex && (
                  <Textarea
                    defaultValue={task.note ?? ''}
                    onBlur={(e) => void saveNote(task, e.target.value)}
                    placeholder={t(language, 'What you found, wrote, or did…', 'ما وجدته أو كتبته أو فعلته…')}
                    rows={2}
                    className="mt-2 text-sm"
                  />
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 shrink-0"
                onClick={() => void remove(task)}
                aria-label={t(language, 'Delete task', 'حذف المهمة')}
              >
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void add()
          }}
          placeholder={t(language, 'Add your own action for this step…', 'أضف مهمتك الخاصة لهذه الخطوة…')}
          className="text-sm"
        />
        <Button variant="outline" size="sm" onClick={() => void add()} disabled={!newTitle.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </section>
  )
}

/* ================================================================== *
 * Reflections — a dated journal, not one notes blob
 * ================================================================== */
export function StepReflections({
  stepNumber,
  language,
  reflections,
  onChange,
}: {
  stepNumber: number
  language: Lang
  reflections: StepReflection[]
  onChange: (next: StepReflection[]) => void
}) {
  const [body, setBody] = useState('')
  const [clarity, setClarity] = useState<number>(0)
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!body.trim()) return
    setSaving(true)
    const res = await fetch('/api/steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addReflection',
        stepNumber,
        body: body.trim(),
        clarity: clarity || undefined,
      }),
    })
    if (res.ok) {
      const r = await res.json()
      if (r?.progress?.reflections) onChange(r.progress.reflections)
      setBody('')
      setClarity(0)
    }
    setSaving(false)
  }

  const remove = async (id: string) => {
    onChange(reflections.filter((r) => r.id !== id))
    await fetch('/api/steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteReflection', stepNumber, reflectionId: id }),
    })
  }

  return (
    <section className="space-y-3">
      <h4 className="flex items-center gap-2 font-semibold text-sm">
        <MessageSquareQuote className="w-4 h-4 text-accent-foreground" />
        {t(language, 'Your reflections', 'تأملاتك')}
        {reflections.length > 0 && (
          <Badge variant="secondary" className="ms-1">
            {reflections.length}
          </Badge>
        )}
      </h4>

      <div className="space-y-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t(
            language,
            'Write what you actually did on this step, what you found, and where you got stuck…',
            'اكتب ما فعلته فعلاً في هذه الخطوة، وما وجدته، وأين تعثرت…'
          )}
          rows={3}
          className="text-sm"
        />

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">
              {t(language, 'Clarity:', 'الوضوح:')}
            </Label>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setClarity(clarity === n ? 0 : n)}
                aria-label={t(language, `Clarity ${n}`, `وضوح ${n}`)}
                className={`w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                  clarity === n
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <Button size="sm" onClick={() => void submit()} disabled={!body.trim() || saving}>
            {saving && <Loader2 className="w-3.5 h-3.5 me-1 animate-spin" />}
            {t(language, 'Add reflection', 'أضف تأملاً')}
          </Button>
        </div>
      </div>

      {reflections.length > 0 && (
        <ul className="space-y-2 pt-1">
          {reflections.map((r) => (
            <li key={r.id} className="rounded-lg bg-muted/40 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {r.clarity ? (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {t(language, 'clarity', 'وضوح')} {r.clarity}/5
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.body}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 shrink-0"
                  onClick={() => void remove(r.id)}
                  aria-label={t(language, 'Delete reflection', 'حذف التأمل')}
                >
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
