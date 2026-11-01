import { motion } from 'motion/react';
import Reveal from './Reveal';
import { ExternalIcon } from './Icons';
import { teasers, whatsappLink } from '../data';

/** Low-key note about what is being built: a few hints, no names. */
export default function Pipeline() {
  return (
    <section className="pipeline" id="em-breve" aria-labelledby="pipeline-title">
      <div className="wrap pipeline-grid">
        <Reveal className="pipeline-copy">
          <p className="pipeline-kicker">
            <span className="pulse" aria-hidden="true" /> Em desenvolvimento
          </p>
          <h2 id="pipeline-title" className="pipeline-title">
            O que vem por aí
          </h2>
          <p className="pipeline-text">
            Novas soluções para construtoras já estão em andamento. Ainda não dá para contar tudo, mas todas nascem integradas ao <strong>Sienge via API</strong>.
          </p>
          <a className="pipeline-link" href={whatsappLink('Olá! Minha empresa usa o Sienge e quero saber mais sobre os novos projetos da Rock.')} target="_blank" rel="noopener">
            Usa Sienge? Fale com a gente <ExternalIcon size={14} />
          </a>
        </Reveal>

        <ol className="pipeline-list">
          {teasers.map((t, i) => (
            <motion.li
              key={t.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="pipeline-num">0{i + 1}</span>
              <div>
                <h3>{t.title}</h3>
                <p>{t.hint}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
