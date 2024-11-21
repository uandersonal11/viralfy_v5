'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Send, AlertCircle, RefreshCw, Bot, User, Sparkles, Image as ImageIcon, Hash, FileText, Trash } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { ChatHeader } from "@/components/chat-header"

type Message = {
  role: 'user' | 'assistant' | 'error' | 'system'
  content: string
  timestamp: Date
}

const suggestions = [
  { icon: FileText, text: "Criar um roteiro para vídeo viral" },
  { icon: Sparkles, text: "Gerar ideias de conteúdo" },
  { icon: ImageIcon, text: "Sugerir thumbnails chamativas" },
  { icon: Hash, text: "Recomendar hashtags populares" },
]

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    }
    setMessages(prevMessages => [...prevMessages, userMessage])
    setInput('')
    setIsTyping(true)
    setError(null)

    try {
      const response = await fetch('https://api.hostbrev.online/webhook/agent_tiktok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`)
      }

      const data = await response.json()
      let assistantMessage = ''
      
      if (Array.isArray(data) && data.length > 0) {
        assistantMessage = data[0].saída || data[0].output || JSON.stringify(data[0])
      } else if (typeof data === 'object' && data !== null) {
        assistantMessage = data.saída || data.output || JSON.stringify(data)
      } else {
        assistantMessage = JSON.stringify(data)
      }

      if (!assistantMessage) {
        throw new Error('Resposta vazia do servidor')
      }

      setMessages(prevMessages => [...prevMessages, { 
        role: 'assistant', 
        content: assistantMessage,
        timestamp: new Date()
      }])
      setRetryCount(0)
    } catch (error) {
      console.error('Erro:', error)
      setError(`Ocorreu um erro ao processar sua solicitação. (Tentativa ${retryCount + 1})`)
      const errorMessage: Message = { 
        role: 'error', 
        content: `Desculpe, houve um erro ao processar sua solicitação. Detalhes do erro: ${error.message}`,
        timestamp: new Date()
      }
      setMessages(prevMessages => [...prevMessages, errorMessage])
      setRetryCount(prevCount => prevCount + 1)
    } finally {
      setIsTyping(false)
    }
  }

  const handleRetry = () => {
    const lastUserMessage = messages.findLast(msg => msg.role === 'user')
    if (lastUserMessage) {
      setInput(lastUserMessage.content)
      handleSubmit(new Event('submit') as any)
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setInput('')
    setError(null)
    setRetryCount(0)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="min-h-screen pt-4">
      <div className="bg-gray-50 min-h-[calc(100vh-1rem)] rounded-t-[1.5rem]">
        <div className="max-w-[1800px] mx-auto p-8">
          <ChatHeader />
          
          <div className="mt-8">
            <Card className="border-0 shadow-none bg-transparent">
              <div className="relative flex-grow overflow-hidden p-6 h-[calc(100vh-15rem)]">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                  <AnimatePresence>
                    {messages.length === 0 && (
                      <div className="space-y-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-center items-center"
                        >
                          <div className="text-center space-y-4">
                            <Bot className="w-16 h-16 mx-auto text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Como posso ajudar você hoje?</h2>
                            <p className="text-gray-500 max-w-md mx-auto">
                              Estou aqui para ajudar você a criar conteúdo viral e envolvente para suas redes sociais.
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="grid grid-cols-2 gap-4 max-w-2xl mx-auto"
                        >
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion.text)}
                              className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 group text-left"
                            >
                              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <suggestion.icon className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                {suggestion.text}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      </div>
                    )}
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        className={`mb-6 flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`flex items-end space-x-2 max-w-[80%] ${
                            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                          }`}
                        >
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === 'user' ? 'bg-blue-600' : 'bg-white border-2 border-blue-600'
                            }`}
                          >
                            {message.role === 'user' ? 
                              <User size={16} className="text-white" /> : 
                              <Bot size={16} className="text-blue-600" />
                            }
                          </div>
                          <div className="space-y-1">
                            <div
                              className={`p-4 rounded-2xl ${
                                message.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : message.role === 'error'
                                  ? 'bg-red-50 text-red-900 border border-red-200'
                                  : message.role === 'system'
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'bg-white border border-gray-200 text-gray-900'
                              }`}
                            >
                              {message.content}
                            </div>
                            <div 
                              className={`text-xs ${
                                message.role === 'user' ? 'text-right' : 'text-left'
                              } text-gray-500`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      className="flex justify-start mb-4"
                    >
                      <div className="flex items-end space-x-2">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                          <Bot size={16} className="text-blue-600" />
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-2xl">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </ScrollArea>
              </div>
              <div className="p-6 bg-white border-t border-gray-100 rounded-b-xl">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription className="flex flex-col gap-2">
                      {error}
                      <Button variant="outline" size="sm" onClick={handleRetry} className="w-fit">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Tentar novamente
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-grow rounded-full border-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-6 px-6"
                    aria-label="Mensagem"
                  />
                  <Button 
                    type="submit" 
                    disabled={isTyping || !input.trim()} 
                    className={`rounded-full px-6 py-6 transition-all duration-300 ${
                      input.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isTyping ? 
                      <Loader2 className="h-5 w-5 animate-spin" /> : 
                      <Send className="h-5 w-5" />
                    }
                  </Button>
                  <Button
                    type="button"
                    onClick={handleClearChat}
                    variant="outline"
                    className="rounded-full px-6 py-6 border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all duration-300"
                    title="Limpar conversa"
                  >
                    <Trash className="h-5 w-5 text-gray-500 hover:text-red-500" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}