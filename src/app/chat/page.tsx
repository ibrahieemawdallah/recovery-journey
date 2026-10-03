'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { Send, Bot, User, Sparkles, Trash2, MessageCircle, Heart, Shield, Wind, Brain } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED_PROMPTS = [
  { text: 'I\'m feeling anxious today', icon: Brain },
  { text: 'Help me with cravings', icon: Shield },
  { text: 'I need motivation', icon: Heart },
  { text: 'Guide me through breathing', icon: Wind },
]

export default function ChatPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)

    // Show welcome message on mount (no history API available)
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI recovery companion. I'm here to support you 24/7. How are you feeling today?",
      timestamp: new Date()
    }])
    setLoading(false)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const sendMessage = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      })
      const data = await res.json()

      if (data.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages([...newMessages, aiResponse])
      } else {
        console.error('Chat API error:', data.error)
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm sorry, I'm having trouble responding right now. Please try again.",
          timestamp: new Date()
        }
        setMessages([...newMessages, errorResponse])
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      }
      setMessages([...newMessages, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    const initialMessage: Message = {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI recovery companion. I'm here to support you 24/7. How are you feeling today?",
      timestamp: new Date()
    }
    setMessages([initialMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t('Loading...', 'جاري التحميل...')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">{t('AI Recovery Coach', 'مدرب التعافي الذكي')}</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                {t('Always here for you', 'دائماً هنا من أجلك')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            <Button variant="ghost" size="sm" onClick={clearChat}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 container mx-auto px-4 py-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className={message.role === 'assistant' ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : 'bg-muted'}>
                  {message.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500">
                  <Bot className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="container mx-auto px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
                onClick={() => sendMessage(prompt.text)}
              >
                <prompt.icon className="w-4 h-4 mr-2" />
                {t(prompt.text, prompt.text)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('Type your message...', 'اكتب رسالتك...')}
              className="flex-1"
            />
            <Button onClick={() => sendMessage()} disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
      <CrisisButton />
    </div>
  )
}
