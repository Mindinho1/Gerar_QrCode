'use client';

import React from 'react';
import Link from 'next/link';
import { QrCode, ShieldCheck, Zap, Heart, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#202C39] text-white border-t border-slate-800 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-700/80">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#99E1D9] text-[#202C39] flex items-center justify-center font-bold shadow-md">
                <QrCode size={22} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                QR & Cartões
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Crie QR codes estáticos profissionais e cartões de visita personalizados em segundos. 100% no navegador, sem taxas ocultas e prontos para impressão.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800/80 text-[#99E1D9] border border-slate-700">
              <ShieldCheck size={14} />
              <span>Privacidade 100% Local</span>
            </div>
          </div>

          {/* Ferramentas */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#99E1D9] mb-4">
              Ferramentas
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/qrcode" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <span>Gerador de QR Avulso</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/cartoes" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <span>Galeria de Modelos</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/cartoes/classic_card" className="hover:text-white transition-colors">
                  Cartão Clássico (Até 3 QR)
                </Link>
              </li>
              <li>
                <Link href="/cartoes/gold_premium" className="hover:text-white transition-colors">
                  Cartão Preto & Dourado
                </Link>
              </li>
              <li>
                <Link href="/cartoes/table_tent" className="hover:text-white transition-colors">
                  Placa de Mesa Vertical
                </Link>
              </li>
            </ul>
          </div>

          {/* Tipos Suportados */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#99E1D9] mb-4">
              QR Suportados
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>WhatsApp com mensagem pronta</li>
              <li>Instagram com @handle</li>
              <li>Link / URL para websites</li>
              <li>Cartão de Contacto (vCard 3.0)</li>
              <li>Rede Wi-Fi com senha rápida</li>
              <li>Telefone, E-mail & Texto Livre</li>
            </ul>
          </div>

          {/* Sobre & Ajuda */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#99E1D9] mb-4">
              Informações
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Sobre a Plataforma
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto & Suporte
                </Link>
              </li>
              <li>Exportação 300 DPI para Gráfica</li>
              <li>Sangria de 3mm com Marcas de Corte</li>
              <li>Sem expiração de códigos</li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} QR & Cartões. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Desenvolvido para máxima qualidade e rapidez de impressão
          </p>
        </div>
      </div>
    </footer>
  );
};
