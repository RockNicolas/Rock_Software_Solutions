import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Reveal, { SplitHeading } from './Reveal';
import Magnetic from './Magnetic';
import { ChatIcon, CheckIcon, InstagramIcon, MailIcon } from './Icons';
import { EMAIL, INSTAGRAM, WHATSAPP_DISPLAY, WHATSAPP_NUMBER, needs, whatsappLink } from '../data';

function compose(name: string, company: string, picked: string[], idea: string) {
  const who = name.trim() ? `Olá! Sou ${name.trim()}${company.trim() ? `, da ${company.trim()}` : ''}.` : 'Olá!';
  const what = picked.length ? ` Tenho interesse em: ${picked.join(', ')}.` : ' Quero conversar sobre um projeto.';
  const about = idea.trim() ? `\n\n${idea.trim()}` : '';
  return `${who}${what}${about}`;
}

export default function Contact() {
  const [picked, setPicked] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [idea, setIdea] = useState('');
  const message = useMemo(() => compose(name, company, picked, idea), [name, company, picked, idea]);

  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsappLink(message), '_blank', 'noopener');
  };

  const channels = [
    { href: `https://wa.me/${WHATSAPP_NUMBER}`, label: 'WhatsApp', value: WHATSAPP_DISPLAY, icon: <ChatIcon size={22} />, external: true },
    { href: `mailto:${EMAIL}`, label: 'E-mail', value: EMAIL, icon: <MailIcon />, external: false },
    { href: `https://instagram.com/${INSTAGRAM}`, label: 'Instagram', value: `@${INSTAGRAM}`, icon: <InstagramIcon />, external: true },
  ];

  return (
    <section className="section contact" id="contato">
      <div className="wrap">
        <SplitHeading text="Tire sua ideia do papel." className="contact-title" />

        <div className="contact-grid">
          <div className="contact-side">
            <Reveal>
              <p className="lead">Conte o que você precisa. Respondemos pelo WhatsApp e a primeira conversa é sem compromisso.</p>
            </Reveal>
            <ul className="channels">
              {channels.map((c, i) => (
                <motion.li
                  key={c.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <a href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noopener' : undefined}>
                    <span className="channel-icon">{c.icon}</span>
                    <span>
                      <small>{c.label}</small>
                      {c.value}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1}>
            <form className="brief" onSubmit={submit}>
              <fieldset>
                <legend>O que você precisa?</legend>
                <div className="chips">
                  {needs.map((n) => {
                    const on = picked.includes(n);
                    return (
                      <motion.button key={n} type="button" layout className={`chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggle(n)} whileTap={{ scale: 0.95 }}>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="chip-check">
                              <CheckIcon size={14} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {n}
                      </motion.button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="fields">
                <label>
                  <span>Seu nome</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Nome e sobrenome" />
                </label>
                <label>
                  <span>Empresa (opcional)</span>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" placeholder="Nome da empresa" />
                </label>
                <label className="full">
                  <span>Sua ideia em poucas linhas</span>
                  <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={3} placeholder="Ex.: controlar os pedidos da loja e notificar o cliente pelo WhatsApp" />
                </label>
              </div>

              <div className="preview" aria-live="polite">
                <span className="preview-label">Prévia da mensagem</span>
                <motion.p layout className="bubble">
                  {message}
                </motion.p>
              </div>

              <div className="brief-actions">
                <Magnetic>
                  <button className="btn btn-primary btn-lg" type="submit">
                    <ChatIcon /> Enviar pelo WhatsApp
                  </button>
                </Magnetic>
                <p className="brief-note">Abre o WhatsApp com a mensagem pronta. Nada é enviado sem a sua confirmação.</p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
