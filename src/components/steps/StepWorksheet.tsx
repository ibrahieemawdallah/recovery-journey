'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Table2, Loader2 } from 'lucide-react'
import type { WorksheetDef } from '@/lib/step-worksheets'

type Lang = 'en' | 'ar'
type Row = Record<string, string>

/**
 * A structured worksheet: a real table for steps that produce lists
 * (4 = inventory, 8 = amends list) rather than a single textarea.
 *
 * Rows are stored as JSON on the server; this component owns the local edit
 * state and saves on blur / row add / row delete.
 */
export function StepWorksheet({
  def,
  stepNumber,
  language,
  initialRows,
}: {
  def: WorksheetDef
  stepNumber: number
  language: Lang
  initialRows: Row[]
}) {
  const [rows, setRows] = useState<Row[]>(
    initialRows.length > 0 ? initialRows : [{ ...def.blankRow }]
  )
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  const t = (en: string, ar: string) => (language === 'en' ? en : ar)

  useEffect(() => {
    setRows(initialRows.length > 0 ? initialRows : [{ ...def.blankRow }])
  }, [initialRows, def.blankRow])

  const save = useCallback(
    async (next: Row[]) => {
      setSaving(true)
      try {
        await fetch('/api/steps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'saveWorksheet', stepNumber, kind: def.kind, rows: next }),
        })
        setSavedAt(new Date())
      } catch {
        // keep the local edit; the next blur retries
      } finally {
        setSaving(false)
      }
    },
    [stepNumber, def.kind]
  )

  const updateCell = (rowIdx: number, key: string, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === rowIdx ? { ...r, [key]: value } : r)))
  }

  const addRow = () => {
    const next = [...rows, { ...def.blankRow }]
    setRows(next)
    void save(next)
  }

  const removeRow = (rowIdx: number) => {
    const next = rows.filter((_, i) => i !== rowIdx)
    const safe = next.length > 0 ? next : [{ ...def.blankRow }]
    setRows(safe)
    void save(safe)
  }

  /** A row counts as filled if any non-select column has content. */
  const filledCount = rows.filter((r) =>
    def.columns.some((c) => c.type !== 'select' && (r[c.key] ?? '').trim().length > 0)
  ).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Table2 className="w-4 h-4 text-primary" />
              {def.title[language]}
            </CardTitle>
            <CardDescription className="mt-2 leading-relaxed">{def.intro[language]}</CardDescription>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold">{filledCount}</div>
            <div className="text-xs text-muted-foreground">{t('entries', 'مدخل')}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Column headings — desktop only; mobile stacks per row */}
        <div className="hidden md:grid gap-2" style={{ gridTemplateColumns: def.columns.map((c) => c.width ?? '1fr').join(' ') }}>
          {def.columns.map((c) => (
            <div key={c.key} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {c.label[language]}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="grid gap-2 md:gap-2 rounded-lg border border-border/60 p-2 md:border-0 md:p-0"
              style={{ gridTemplateColumns: undefined }}
            >
              <div
                className="grid gap-2 md:gap-2 items-start"
                style={{ gridTemplateColumns: '1fr' }}
              >
                {def.columns.map((c) => (
                  <div key={c.key} className="min-w-0">
                    <div className="md:hidden text-xs font-semibold text-muted-foreground mb-1">
                      {c.label[language]}
                    </div>
                    {c.type === 'long' ? (
                      <Textarea
                        value={row[c.key] ?? ''}
                        placeholder={c.hint?.[language] ?? ''}
                        onChange={(e) => updateCell(rowIdx, c.key, e.target.value)}
                        onBlur={() => void save(rows)}
                        rows={2}
                        className="text-sm resize-y"
                      />
                    ) : c.type === 'select' ? (
                      <select
                        value={row[c.key] ?? ''}
                        onChange={(e) => {
                          updateCell(rowIdx, c.key, e.target.value)
                          void save(rows.map((r, i) => (i === rowIdx ? { ...r, [c.key]: e.target.value } : r)))
                        }}
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      >
                        <option value="">{t('—', '—')}</option>
                        {c.options?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label[language]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        value={row[c.key] ?? ''}
                        placeholder={c.hint?.[language] ?? ''}
                        onChange={(e) => updateCell(rowIdx, c.key, e.target.value)}
                        onBlur={() => void save(rows)}
                        className="text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end md:hidden">
                <Button variant="ghost" size="sm" onClick={() => removeRow(rowIdx)} aria-label={t('Remove row', 'حذف السطر')}>
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>

              {/* desktop remove button, aligned to the right edge */}
              <div className="hidden md:flex justify-end -mt-10 relative z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRow(rowIdx)}
                  aria-label={t('Remove row', 'حذف السطر')}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="w-4 h-4 me-1" />
            {t('Add row', 'إضافة سطر')}
          </Button>
          {saving && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              {t('Saving…', 'جاري الحفظ…')}
            </span>
          )}
          {!saving && savedAt && (
            <span className="text-xs text-muted-foreground">{t('Saved', 'تم الحفظ')}</span>
          )}
        </div>

        {def.footnote && (
          <p className="text-xs text-muted-foreground border-s-2 border-primary/30 ps-3 leading-relaxed">
            {def.footnote[language]}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
