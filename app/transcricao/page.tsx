'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle, Youtube, Video, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export default function VideoTranscription() {
  const [videoLink, setVideoLink] = useState('')
  const [transcription, setTranscription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleTranscribe = async () => {
    setIsLoading(true)
    setError('')
    setTranscription('')

    try {
      const response = await fetch('https://api.hostbrev.online/webhook/transcrever', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoLink }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch transcription')
      }

      const data = await response.json()
      if (data && data[0] && data[0].output) {
        setTranscription(data[0].output)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      setError('Ocorreu um erro ao transcrever o vídeo. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen pt-4">
      <div className="bg-gray-50 min-h-[calc(100vh-1rem)] rounded-t-[1.5rem]">
        <div className="max-w-[1800px] mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Transcrição de Vídeo</h1>
              <p className="text-gray-600 mt-1">
                Transforme seu conteúdo de vídeo em texto com facilidade
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Cole o link do vídeo aqui..."
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    className="pl-12 h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {videoLink.includes('youtube') ? <Youtube size={24} /> : <Video size={24} />}
                  </div>
                </div>
                <Button
                  onClick={handleTranscribe}
                  disabled={isLoading || !videoLink}
                  className="h-14 px-8 text-lg rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    'Transcrever Vídeo'
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-600 transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Youtube size={36} className="text-blue-600" />
                    <p className="font-medium">YouTube</p>
                    <p className="text-sm text-gray-500">Vídeos longos do YouTube</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-600 transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Video size={36} className="text-blue-600" />
                    <p className="font-medium">YouTube Shorts</p>
                    <p className="text-sm text-gray-500">Vídeos curtos do YouTube</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-600 transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor" className="text-blue-600">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    <p className="font-medium">TikTok</p>
                    <p className="text-sm text-gray-500">Vídeos do TikTok</p>
                  </div>
                </motion.div>
              </div>
            </Card>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {transcription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-0 shadow-sm">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Transcrição</h3>
                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-lg"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 min-h-[250px] max-h-[500px] overflow-y-auto">
                        <p className="text-gray-800 text-lg leading-relaxed">{transcription}</p>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="font-medium">Transcrição concluída com sucesso!</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center p-12"
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-3 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}