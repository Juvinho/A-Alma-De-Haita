'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { RuneSeparator } from '@/components/RuneSymbol';

export default function SobrePage() {
  return (
    <main className="relative min-h-screen z-10 py-16 px-4 md:px-8">
      <div className="max-w-xl mx-auto">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Link
            href="/"
            className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
          >
            ← início
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl md:text-3xl text-[var(--accent-gold)] tracking-widest uppercase mb-2">
            Sobre
          </h1>
          <p className="font-mono text-xs text-[var(--text-secondary)] tracking-widest opacity-60">
            O que é este lugar
          </p>
        </motion.div>

        <RuneSeparator />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-8"
        >
          {/* About */}
          <div className="p-6 border border-[var(--accent-blood)] bg-[#080404]">
            <h2 className="font-display text-sm text-[var(--accent-crimson)] uppercase tracking-widest mb-4">
              O Artefato
            </h2>
            <p className="font-body text-[var(--text-primary)] text-base leading-relaxed mb-4">
              Este site é um artefato do universo literário{' '}
              <span className="italic text-[var(--accent-gold)]">Fundação Varguelia</span> —
              construído como se alguém dentro da ficção tivesse criado um portal de testes
              ligados à deusa Häita.
            </p>
            <p className="font-body text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
              Häita é uma divindade primordial, feminina e esquecida que afirma ser a criadora de
              toda existência. Ela não é um vilão de fantasia — é a raiva de quem foi abandonado
              por aqueles que criou.
            </p>
            <p className="font-body text-[var(--text-secondary)] text-sm leading-relaxed">
              Os 20 enigmas cobrem lógica, linguística, cifras e mitologia do universo. Cada
              resposta certa rasga um véu — um passo mais fundo no que Häita é.
            </p>
          </div>

          {/* Universe */}
          <div className="p-6 border border-[var(--accent-blood)] bg-[#080408]">
            <h2 className="font-display text-sm text-[var(--accent-crimson)] uppercase tracking-widest mb-4">
              O Universo
            </h2>
            <div className="flex flex-col gap-3 font-body text-sm text-[var(--text-secondary)] leading-relaxed">
              <p>
                <span className="text-[var(--text-primary)]">Catatúnia</span> — Nação insular no
                Pacífico com 7 ilhas e ~2,3 milhões de habitantes. Poupada de uma catástrofe
                global que eliminou 2,5 bilhões de pessoas.
              </p>
              <p>
                <span className="text-[var(--text-primary)]">Varguën</span> — Instituição
                politécnica de elite fundada em Catatúnia. Inauguração prevista: 15 de março de
                2033.
              </p>
              <p>
                <span className="text-[var(--text-primary)]">Os Elos</span> — Sete humanos
                escolhidos como âncoras entre a realidade e os planos superiores. Maya Sayedinne
                é a primeira.
              </p>
              <p>
                <span className="text-[var(--text-primary)]">A Ponte dos Eventos</span> — Não é
                um lugar. É a conexão entre o que chamamos de real e algo que não conseguimos
                nomear.
              </p>
            </div>
          </div>

          {/* Credits */}
          <div className="p-6 border border-[var(--accent-blood)] bg-[#040408]">
            <h2 className="font-display text-sm text-[var(--accent-crimson)] uppercase tracking-widest mb-4">
              Créditos
            </h2>
            <div className="flex flex-col gap-2 font-body text-sm text-[var(--text-secondary)]">
              <p>
                <span className="text-[var(--text-primary)]">Universo criado por</span>{' '}
                <span className="text-[var(--accent-gold)]">JuvinhoDev</span>
              </p>
              <p>
                <span className="text-[var(--text-primary)]">Site construído com</span>{' '}
                Next.js 14, Framer Motion, Tailwind CSS
              </p>
              <div className="flex gap-4 mt-3">
                <a
                  href="#"
                  className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors tracking-widest underline underline-offset-4"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors tracking-widest underline underline-offset-4"
                >
                  Twitter/X
                </a>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="px-4 border-l-2 border-[var(--accent-blood)]">
            <p className="font-body italic text-[var(--text-secondary)] text-sm leading-relaxed opacity-70">
              Häita é uma personagem fictícia. Mas se você sentiu algo ao digitar o nome
              dela... talvez ela discorde.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center justify-between"
        >
          <Link
            href="/"
            className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
          >
            ← início
          </Link>
          <Link
            href="/veus"
            className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
          >
            os véus →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
