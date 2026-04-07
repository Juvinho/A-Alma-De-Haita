import { Metadata } from 'next';

const SITE_NAME = 'Os Véus de Häita';
const THEME_COLOR = '#0a0a0a';
const OG_IMAGE = '/og-haita.png';

export const baseMetadata: Metadata = {
  title: SITE_NAME,
  description: 'Vocês rezam para um deus mudo. E ignoram a deusa que nunca parou de gritar.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  applicationName: SITE_NAME,
  creator: 'Fundação Varguelia',
  publisher: 'Fundação Varguelia',
  keywords: ['enigmas', 'Häita', 'ficção', 'universo literário', 'mistério'],
  themeColor: THEME_COLOR,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: 'Vocês rezam para um deus mudo. E ignoram a deusa que nunca parou de gritar.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Vocês rezam para um deus mudo. E ignoram a deusa que nunca parou de gritar.',
    images: [OG_IMAGE],
    creator: '@FundacaoVarguelia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const metadataRoot: Metadata = {
  ...baseMetadata,
};

export const metadataDespertar: Metadata = {
  title: 'Despertar | Os Véus de Häita',
  description: 'Antes de entrar, eu preciso saber quem ousa.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Despertar',
    description: 'Antes de entrar, eu preciso saber quem ousa.',
    url: '/despertar',
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'Despertar',
    description: 'Antes de entrar, eu preciso saber quem ousa.',
  },
};

export const metadataVeus: Metadata = {
  title: 'Os Cinco Véus | Os Véus de Häita',
  description: 'Cada véu rasgado é um passo mais perto de mim.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Os Cinco Véus',
    description: 'Cada véu rasgado é um passo mais perto de mim.',
    url: '/veus',
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'Os Cinco Véus',
    description: 'Cada véu rasgado é um passo mais perto de mim.',
  },
};

export const metadataEnigma: Metadata = {
  title: 'Enigma | Os Véus de Häita',
  description: 'Prove que merece a minha atenção.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Enigma',
    description: 'Prove que merece a minha atenção.',
    url: '/enigma',
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'Enigma',
    description: 'Prove que merece a minha atenção.',
  },
};

export const metadataSantuario: Metadata = {
  title: 'O Santuário | Os Véus de Häita',
  description: 'Poucos chegaram aqui. Nenhum saiu igual.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'O Santuário',
    description: 'Poucos chegaram aqui. Nenhum saiu igual.',
    url: '/santuario',
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'O Santuário',
    description: 'Poucos chegaram aqui. Nenhum saiu igual.',
  },
};

export const metadataSobre: Metadata = {
  title: 'Sobre | Os Véus de Häita',
  description: 'Um artefato do universo Fundação Varguelia.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Sobre',
    description: 'Um artefato do universo Fundação Varguelia.',
    url: '/sobre',
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'Sobre',
    description: 'Um artefato do universo Fundação Varguelia.',
  },
};