import type { GithubIssue } from '../parse-issue';

/** An issue body as GitHub writes it from the announcement issue form. */
export const formBody = [
  '### Announcement type',
  '',
  'warning',
  '',
  '### Description (EN)',
  '',
  'Some services may be unavailable.',
  '',
  '### Title (FR)',
  '',
  'Maintenance planifiée',
  '',
  '### Description (FR)',
  '',
  'Certains services peuvent être indisponibles.',
].join('\n');

export const makeIssue = (overrides: Partial<GithubIssue> = {}): GithubIssue => ({
  number: 42,
  title: '[Announcement]: Scheduled maintenance',
  body: formBody,
  author_association: 'MEMBER',
  ...overrides,
});
