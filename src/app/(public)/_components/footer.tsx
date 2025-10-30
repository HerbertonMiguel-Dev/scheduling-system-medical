'use client'

import Link from 'next/link';
import React from 'react';

import {
  GlobeIcon,
  FacebookLogoIcon,
  TwitchLogoIcon,
  InstagramLogoIcon,
  YoutubeLogoIcon,
  LinkedinLogoIcon,
  PhoneIcon,
  LifebuoyIcon,
  BriefcaseIcon,
  IconProps
} from '@phosphor-icons/react';

const ICON_SIZE = 16;

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialIcons: Record<string, React.ElementType<IconProps>> = {
    facebook: FacebookLogoIcon,
    twitter: TwitchLogoIcon,
    instagram: InstagramLogoIcon,
    youtube: YoutubeLogoIcon,
    linkedin: LinkedinLogoIcon,
  };

  return (
    <footer className="bg-gray-200 text-black py-12 md:py-16">
      <div className="container mx-auto px-4 2xl:max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6">

          <div className="lg:col-span-1 md:col-span-1">
            <h4 className="text-orange-500 font-bold mb-4 text-sm uppercase flex items-center">
              <PhoneIcon size={ICON_SIZE} weight="regular" className="mr-2" /> Central de Marcação
            </h4>
            <ul className="space-y-2 text-sm">
              <li>(84) 4009-5600</li>
              <li>(84) 4009-5601</li>
            </ul>

            <h4 className="text-orange-500 font-bold mt-8 mb-4 text-sm uppercase flex items-center">
              <LifebuoyIcon size={ICON_SIZE} weight="regular" className="mr-2" /> Ajude a Liga
            </h4>
            <ul className="space-y-2 text-sm">
              <li>(84) 4009-5578</li>
              <li>(84) 98827-1781</li>
            </ul>
          </div>

          <div className="lg:col-span-1 md:col-span-1">
            <h4 className="text-orange-500 font-bold mb-4 text-sm uppercase">Sobre a Liga</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/diretoria" className="hover:text-orange-400 transition-colors">Diretoria</Link></li>
              <li><Link href="/licitacoes" className="hover:text-orange-400 transition-colors">Licitações e Tomadas de</Link></li>
              <li><Link href="/precos" className="hover:text-orange-400 transition-colors">Preços</Link></li>
              <li><Link href="/parceiros" className="hover:text-orange-400 transition-colors">Parceiros</Link></li>
              <li><Link href="/publicacoes" className="hover:text-orange-400 transition-colors">Publicações</Link></li>
              <li><Link href="/registro-hospitalar" className="hover:text-orange-400 transition-colors">Registro Hospitalar de</Link></li>
              <li><Link href="/cancer" className="hover:text-orange-400 transition-colors">Câncer</Link></li>
              <li><Link href="/unidades" className="hover:text-orange-400 transition-colors">Unidades</Link></li>
              <li><Link href="/voluntariado" className="hover:text-orange-400 transition-colors">Voluntariado</Link></li>
              <li><Link href="/lgpd" className="hover:text-orange-400 transition-colors">LGPD</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-1 md:col-span-1">
            <h4 className="text-orange-500 font-bold mb-4 text-sm uppercase">Especialidade Médica</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/especialidade/cirurgia-oncologica" className="hover:text-orange-400 transition-colors">Cirurgia Oncológica</Link></li>
              <li><Link href="/especialidade/mastologia" className="hover:text-orange-400 transition-colors">Mastologia</Link></li>
              <li><Link href="/especialidade/medicina-nuclear" className="hover:text-orange-400 transition-colors">Medicina Nuclear</Link></li>
              <li>Neurocirurgia</li>
              <li>Oncologia Clínica</li>
              <li>Ortopedia</li>
              <li>Otorrinolaringologia</li>
              <li>Proctologia</li>
              <li>Radioterapia</li>
              <li>Urologia</li>
              <li><Link href="/especialidades" className="hover:text-orange-400 transition-colors font-semibold mt-2 block">Todas as Especialidades</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-1 md:col-span-1">
            <h4 className="text-orange-500 font-bold mb-4 text-sm uppercase">Exames e Resultados</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/consultar-laudo" className="hover:text-orange-400 transition-colors">Consulte seu Laudo</Link></li>
              <li><Link href="/webmail" className="hover:text-orange-400 transition-colors">Webmail</Link></li>
            </ul>

            <h4 className="text-orange-500 font-bold mt-8 mb-4 text-sm uppercase">Ensino, Pesquisa e Inovação</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cursos" className="hover:text-orange-400 transition-colors">Cursos</Link></li>
              <li><Link href="/eventos" className="hover:text-orange-400 transition-colors">Eventos</Link></li>
              <li><Link href="/pesquisa-cientifica" className="hover:text-orange-400 transition-colors">Pesquisa Científica</Link></li>
              <li><Link href="/instituto" className="hover:text-orange-400 transition-colors">Instituto</Link></li>
            </ul>

            <h4 className="text-orange-500 font-bold mt-8 mb-4 text-sm uppercase flex items-center">
              <BriefcaseIcon size={ICON_SIZE} weight="regular" className="mr-2" /> Data Protection Officer (DPO)
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Najara Mara Nascimento de Paula</li>
              <li><a href="mailto:dpo@liga.org.br" className="hover:text-orange-400 transition-colors">dpo@liga.org.br</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1 xl:col-span-2 md:col-span-2">
            <h4 className="text-orange-500 font-bold mb-4 text-sm uppercase">Siga-nos nas Redes</h4>
            <ul className="space-y-3 text-sm">
              {Object.entries(socialIcons).map(([key, IconComponent]) => (
                <li key={key}>
                  <a href={`https://${key}.com`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-orange-400 transition-colors capitalize">
                    <IconComponent size={20} weight="regular" className="mr-3 text-orange-500" /> {key}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-4 text-center lg:col-start-2 lg:col-span-1">
          <p className="">
            Todos direitos reservados © {new Date().getFullYear()} - <span className="hover:text-blue-800 duration-300">Herberton Miguel</span>
          </p>
        </div>

      </div>
    </footer>
  );
}