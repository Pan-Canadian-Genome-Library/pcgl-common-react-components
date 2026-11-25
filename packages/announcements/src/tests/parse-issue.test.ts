import { describe, expect, it } from 'vitest';
import { issueToAnnouncement } from '../parse-issue';
import { formBody, makeIssue } from './fixtures';

describe('issueToAnnouncement', () => {
  it('maps an issue form issue to an Announcement', () => {
    expect(issueToAnnouncement(makeIssue())).toEqual({
      id: '42',
      type: 'warning',
      defaultLocale: 'en',
      translations: {
        en: { title: 'Scheduled maintenance', description: 'Some services may be unavailable.' },
        fr: {
          title: 'Maintenance planifiée',
          description: 'Certains services peuvent être indisponibles.',
        },
      },
    });
  });

  it('reads bodies with Windows line endings', () => {
    const issue = makeIssue({ body: formBody.replace(/\n/g, '\r\n') });
    expect(issueToAnnouncement(issue)?.type).toBe('warning');
  });

  it('keeps multi-line descriptions', () => {
    const body = formBody.replace('Some services may be unavailable.', 'Line one.\n\nLine two.');
    expect(issueToAnnouncement(makeIssue({ body }))?.translations.en?.description).toBe(
      'Line one.\n\nLine two.',
    );
  });

  it('leaves French out when the French fields are empty', () => {
    const body = formBody
      .replace('Maintenance planifiée', '_No response_')
      .replace('Certains services peuvent être indisponibles.', '_No response_');
    expect(issueToAnnouncement(makeIssue({ body }))?.translations).not.toHaveProperty('fr');
  });

  it.each(['OWNER', 'MEMBER', 'COLLABORATOR'])('accepts issues by %s', (association) => {
    expect(issueToAnnouncement(makeIssue({ author_association: association }))).not.toBeNull();
  });

  it.each(['NONE', 'CONTRIBUTOR', 'FIRST_TIME_CONTRIBUTOR'])(
    'rejects issues by %s',
    (association) => {
      expect(issueToAnnouncement(makeIssue({ author_association: association }))).toBeNull();
    },
  );

  it('rejects pull requests', () => {
    expect(issueToAnnouncement(makeIssue({ pull_request: {} }))).toBeNull();
  });

  it('rejects an unknown announcement type', () => {
    const body = formBody.replace('\nwarning\n', '\ncritical\n');
    expect(issueToAnnouncement(makeIssue({ body }))).toBeNull();
  });

  it('rejects an issue with an empty title or English description', () => {
    expect(issueToAnnouncement(makeIssue({ title: '[Announcement]: ' }))).toBeNull();
    expect(issueToAnnouncement(makeIssue({ body: null }))).toBeNull();
  });
});
