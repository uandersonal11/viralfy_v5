'use client';

import { Crown, Sparkles } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="flex flex-col items-start space-y-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Velaris</h1>
        <Crown className="w-6 h-6 text-yellow-500" />
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          IA
        </span>
      </div>
      <p className="text-gray-600">
        Receba ajuda personalizada e acelere sua criação de conteúdo com IA.
      </p>
    </div>
  );
}