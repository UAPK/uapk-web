import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'UAPK Gateway',
  tagline: 'Universal AI Processing Key - Policy enforcement and audit logging for AI agents',
  favicon: 'img/favicon.ico',

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400;1,600&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    },
    // ── Measurement stack, added 2026-08-11 ──────────────────────────
    // Plausible: self-hosted, cookieless, no identifier — ungated by design,
    // so it keeps working for visitors who decline.
    {
      tagName: 'script',
      attributes: {
        defer: 'true',
        'data-domain': 'uapk.info',
        src: 'https://analytics.david-sanker.com/js/script.tagged-events.js',
      },
    },
    // Google Ads + LinkedIn: type="text/plain" is inert. The browser will not
    // execute these, and no cookie is set, until consent.js rewrites them on
    // accept. The previous tag here was AW-672519410 — a deactivated account,
    // which is why it recorded nothing for months. This is the live one.
    {
      tagName: 'script',
      attributes: {
        type: 'text/plain',
        'data-consent': 'marketing',
        'data-src': 'https://www.googletagmanager.com/gtag/js?id=AW-18061865118',
      },
    },
    {
      tagName: 'script',
      attributes: { type: 'text/plain', 'data-consent': 'marketing' },
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-18061865118');
      `,
    },
    {
      tagName: 'script',
      attributes: { type: 'text/plain', 'data-consent': 'marketing' },
      innerHTML: `
        _linkedin_partner_id = "520105121";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        (function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
        var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");
        b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
        s.parentNode.insertBefore(b,s);})(window.lintrk);
      `,
    },
    // No <noscript> LinkedIn pixel: it fires without JS and cannot be gated.
    {
      tagName: 'link',
      attributes: { rel: 'stylesheet', href: '/shared/consent/consent.css' },
    },
    {
      tagName: 'script',
      attributes: { src: '/shared/consent/consent.js', defer: 'true' },
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://uapk.info',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For custom domain, use root path
  baseUrl: '/',

  // Use trailing slash for cleaner URLs
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'UAPK', // Usually your GitHub org/user name.
  projectName: 'gateway', // The repo that serves uapk.info (UAPK/core does not exist).

  // 'throw', not 'warn'. 'warn' is why 219 mis-resolving internal links shipped
  // to uapk.info and stayed live — including the pilot page's own pricing and
  // support links. All links and anchors are clean as of 2026-08-10, so this
  // costs nothing today and makes the whole class of bug un-shippable.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/UAPK/gateway/tree/main/website/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/UAPK/gateway/tree/main/website/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        // gtag removed 2026-08-11: AW-672519410 is the tag of a
        // DEACTIVATED Google Ads account. The 2026-08-09 cleanup covered
        // only the Projects VM sites, so uapk.info kept loading it,
        // ungated, for months. Nothing replaces it — no campaign points
        // at this domain. Re-add gated, on the live account, if one does.
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    metadata: [
      {name: 'keywords', content: 'AI agents, policy enforcement, audit logging, governance, compliance, UAPK'},
    ],
    navbar: {
      title: '',
      logo: {
        alt: 'UAPK',
        src: 'img/UAPK_logo_blue.png',
        srcDark: 'img/UAPK_logo_white.png',
        width: 120,
        height: 40,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/quickstart',
          label: 'Quickstart',
          position: 'left'
        },
        {
          to: '/docs/business/pilot',
          label: 'Enterprise',
          position: 'left'
        },
        {
          label: 'Integrations',
          position: 'left',
          type: 'dropdown',
          items: [
            {label: 'Zapier', to: '/docs/integrations/zapier'},
            {label: 'Make.com', to: '/docs/integrations/make'},
            {label: 'n8n', to: '/docs/integrations/n8n'},
            {label: 'Langflow', to: '/docs/integrations/langflow'},
            {label: 'Python SDK', to: '/docs/guides/agent-integration'},
          ],
        },
        {to: '/about', label: 'About', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/Amakua',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'UAPK',
        src: 'img/UAPK_icon_white.png',
        href: 'https://uapk.info',
        width: 48,
        height: 48,
      },
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Quickstart',
              to: '/docs/quickstart',
            },
            {
              label: 'Concepts',
              to: '/docs/concepts',
            },
            {
              label: 'API Reference',
              to: '/docs/api',
            },
          ],
        },
        {
          title: 'Integrations',
          items: [
            {label: 'Zapier', to: '/docs/integrations/zapier'},
            {label: 'Make.com', to: '/docs/integrations/make'},
            {label: 'n8n', to: '/docs/integrations/n8n'},
            {label: 'Langflow', to: '/docs/integrations/langflow'},
          ],
        },
        {
          title: 'Enterprise',
          items: [
            {
              label: 'Pilot Program',
              to: '/docs/business/pilot',
            },
            {
              label: 'Pricing',
              to: '/docs/business/pricing',
            },
            {
              label: 'Contact',
              href: 'mailto:mail@uapk.info',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'About',
              to: '/about',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Amakua',
            },
            {
              label: 'Security',
              to: '/docs/security',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Privacy Policy',
              to: '/privacy',
            },
            {
              label: 'Imprint',
              to: '/imprint',
            },
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {
              label: 'Lawkraft — AI Consulting',
              href: 'https://lawkraft.com',
            },
            {
              label: 'Morpheus Mark — IP Enforcement',
              href: 'https://morpheusmark.com',
            },
            {
              label: 'OpsPilotOS — Autonomous SaaS',
              href: 'https://mother-os.info',
            },
            {
              label: 'Hucke & Sanker — Law Firm',
              href: 'https://huckesanker.com',
            },
            {
              label: 'LinkedIn',
              href: 'https://de.linkedin.com/in/sankerlaw',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} UAPK — Universal AI Processing Key. Apache 2.0 License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
