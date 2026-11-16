import type { Announcement } from './banner';

export const defaultAnnouncements = {
  info: {
    id: `info-${crypto.randomUUID()}`,
    type: 'info',
    defaultLocale: 'en',
    translations: {
      en: { title: 'Information', description: 'We have an update to share with you.' },
      fr: { title: 'Information', description: 'Nous avons une mise à jour à vous communiquer.' },
    },
  },
  resolved: {
    id: `success-${crypto.randomUUID()}`,
    type: 'success',
    defaultLocale: 'en',
    translations: {
      en: {
        title: 'All systems operational',
        description: 'The issue has been resolved and all services are running normally.',
      },
      fr: {
        title: 'Tous les systèmes sont opérationnels',
        description: 'Le problème a été résolu et tous les services fonctionnent normalement.',
      },
    },
  },
  disruption: {
    id: `warning-${crypto.randomUUID()}`,
    type: 'warning',
    defaultLocale: 'en',
    translations: {
      en: {
        title: 'Service disruption',
        description:
          'We are experiencing some issues. Some services may be slow or temporarily unavailable.',
      },
      fr: {
        title: 'Perturbation du service',
        description:
          'Nous rencontrons actuellement des problèmes. Certains services peuvent être lents ou temporairement indisponibles.',
      },
    },
  },
  outage: {
    id: `error-${crypto.randomUUID()}`,
    type: 'error',
    defaultLocale: 'en',
    translations: {
      en: {
        title: 'Service outage',
        description:
          'Some services are currently unavailable. We are working to restore them as quickly as possible.',
      },
      fr: {
        title: 'Panne de service',
        description:
          'Certains services sont actuellement indisponibles. Nous travaillons à les rétablir le plus rapidement possible.',
      },
    },
  },
  maintenance: {
    id: `warning-${crypto.randomUUID()}`,
    type: 'warning',
    defaultLocale: 'en',
    translations: {
      en: {
        title: 'Scheduled maintenance',
        description:
          'We are performing scheduled maintenance. Some services may be unavailable during this time.',
      },
      fr: {
        title: 'Maintenance planifiée',
        description:
          'Nous effectuons une maintenance planifiée. Certains services peuvent être indisponibles pendant cette période.',
      },
    },
  },
} as const satisfies Record<string, Announcement>;
