'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Mail, 
  Send, 
  Check, 
  HelpCircle, 
  Printer, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
  };

  const faqs = [
    {
      q: 'O que é a opção "com sangria (3mm)"?',
      a: 'Sangria é a margem de segurança necessária quando o material vai para o corte na guilhotina da gráfica. Ao activar a sangria, geramos 3mm adicionais em cada borda com marcas de corte profissionais.',
    },
    {
      q: 'Os QR codes expiram com o tempo?',
      a: 'Não! Todos os códigos gerados aqui são 100% estáticos. O conteúdo é codificado directamente no padrão de pontos do QR, sem passar por redirecionadores intermediários.',
    },
    {
      q: 'Qual o papel recomendado para imprimir os cartões?',
      a: 'Para cartões de visita, recomendamos papel Couché 350g com laminação fosca (Soft Touch) ou Papel Kraft/Reciclado 300g para um acabamento tátil premium.',
    },
    {
      q: 'Porque é que o logótipo central é bloqueado no WhatsApp e Instagram?',
      a: 'Para redes sociais com ícones oficiais, aplicamos o badge verificado com correção de erro nível H para assegurar que qualquer câmara reconhece o código à primeira tentativa.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFFFF]">
      <Header />

      <main className="flex-1 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e] bg-[#99E1D9]/25 px-3 py-1 rounded-full">
              Contacto & Suporte
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#202C39] tracking-tight">
              Como podemos ajudar?
            </h1>
            <p className="text-base text-slate-600 max-w-xl mx-auto">
              Tem dúvidas sobre impressão, formatos de ficheiro ou sugestões para novos modelos de cartão? Fale connosco.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Contact Form - 7 Colunas */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#202C39]">
                Envie a sua mensagem
              </h3>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900">Mensagem Enviada!</h4>
                  <p className="text-xs text-emerald-700">
                    Obrigado pelo seu contacto. Responderemos assim que possível.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs"
                  >
                    Enviar outra mensagem
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="O seu Nome"
                      placeholder="David Montoya"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                    <Input
                      label="O seu E-mail"
                      type="email"
                      placeholder="contacto@exemplo.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Assunto"
                    placeholder="Dúvida sobre impressão / Sugestão de modelo"
                    required
                    value={formData.assunto}
                    onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                  />

                  <div>
                    <label className="text-xs font-semibold text-slate-700 tracking-wide block mb-1.5">
                      Mensagem
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Escreva aqui a sua dúvida ou mensagem..."
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-[#99E1D9] focus:ring-2 focus:ring-[#99E1D9]/30 transition-all placeholder:text-slate-400 placeholder:text-xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={Send}
                    className="w-full bg-[#202C39] hover:bg-[#18222D]"
                  >
                    Enviar Mensagem
                  </Button>
                </form>
              )}
            </div>

            {/* Quick Print FAQ - 5 Colunas */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-bold text-[#202C39] flex items-center gap-2">
                <HelpCircle size={18} className="text-[#0f766e]" />
                Perguntas Frequentes
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1.5"
                  >
                    <h4 className="text-xs font-bold text-[#202C39]">{faq.q}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
