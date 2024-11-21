'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Check, Loader2, AlertCircle, Copy, CheckCircle2, FileText } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const toneOptions = [
  { label: "Neutro", value: "neutral" },
  { label: "Formal", value: "formal" },
  { label: "Informal", value: "informal" },
  { label: "Humorístico", value: "humorous" },
  { label: "Sério", value: "serious" },
  { label: "Inspirador", value: "inspiring" },
]

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds} segundos`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export default function RoteiroGenerator() {
  const [text, setText] = useState('')
  const [duration, setDuration] = useState(60)
  const [loading, setLoading] = useState(false)
  const [generatedScript, setGeneratedScript] = useState('')
  const [error, setError] = useState('')
  const [tones, setTones] = useState<string[]>([])
  const [targetAudience, setTargetAudience] = useState('')
  const [callToAction, setCallToAction] = useState('')
  const [copied, setCopied] = useState(false)
  const scriptRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedScript('')
    setError('')

    try {
      const response = await fetch('https://api.hostbrev.online/webhook/roteiro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, duration, tones, targetAudience, callToAction }),
      })

      if (!response.ok) {
        throw new Error('Falha na geração do roteiro')
      }

      const data = await response.json()
      setGeneratedScript(data[0].output)
    } catch (error) {
      console.error('Erro:', error)
      setError('Ocorreu um erro ao gerar o roteiro. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (scriptRef.current) {
      navigator.clipboard.writeText(scriptRef.current.innerText).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="min-h-screen pt-4">
      <div className="bg-gray-50 min-h-[calc(100vh-1rem)] rounded-t-[1.5rem]">
        <div className="max-w-[1800px] mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Roteiros IA</h1>
              <p className="text-gray-600 mt-1">
                Crie roteiros personalizados e impactantes para suas redes sociais
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            <Card className="border-0 shadow-sm">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Texto, roteiro ou tema
                  </label>
                  <Textarea
                    placeholder="Insira seu texto, roteiro ou tema aqui..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[200px] resize-none rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Duração do vídeo: {formatDuration(duration)}
                  </label>
                  <Slider
                    min={15}
                    max={120}
                    step={1}
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tom do roteiro
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {toneOptions.map((tone) => (
                      <button
                        key={tone.value}
                        type="button"
                        onClick={() => {
                          setTones(prev => 
                            prev.includes(tone.value)
                              ? prev.filter(t => t !== tone.value)
                              : [...prev, tone.value]
                          )
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          tones.includes(tone.value)
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{tone.label}</span>
                          {tones.includes(tone.value) && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Público-alvo
                  </label>
                  <Input
                    placeholder="Ex: Jovens adultos interessados em tecnologia"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="h-14 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Chamada para ação (CTA)
                  </label>
                  <Input
                    placeholder="Ex: Inscreva-se no canal"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    className="h-14 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Gerando roteiro...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-5 w-5" />
                      Gerar Roteiro
                    </>
                  )}
                </Button>
              </form>
            </Card>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {generatedScript && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-0 shadow-sm">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Roteiro Gerado</h3>
                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-lg"
                        >
                          {copied ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div 
                        ref={scriptRef}
                        className="bg-white rounded-xl border-2 border-gray-200 p-6 min-h-[250px] max-h-[500px] overflow-y-auto"
                      >
                        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                          {generatedScript}
                        </p>
                      </div>

                      {copied && (
                        <div className="mt-4 flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <p className="font-medium">Roteiro copiado com sucesso!</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}