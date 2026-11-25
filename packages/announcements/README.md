# Announcement implementation

`@repo/announcements` reads these issues. It finds the `### <label>` headings GitHub writes into the
issue body, so keep the labels below in sync with `fields` in packages/announcements/src/parse-issue.ts.

> The issue template is in `/.github/ISSUE_TEMPLATE/banner.yml`

## AnnouncementBanner

> It's in packages/announcements/src/announcement-banner.tsx

It shows the newest open announcement issue from a public GitHub repository as a Banner.
Renders nothing while loading, on error, or when no announcement is open.

## Caveats

**Unauthenticated GitHub API**

> Calls are limited to 60 per hour per visitor IP, so the result is
> kept in sessionStorage for a short time. Closing an issue hides its banner once this expires.

**Private org members:**

> in `packages/announcements/src/parse-issue.ts`

GitHub reports private organization members as `MEMBER` when the request has no token. They may show up as `CONTRIBUTOR` or `NONE`, which would hide their banners.
Test: run the curl from earlier and check author_association.

```sh
curl -s -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/Pan-Canadian-Genome-Library/pcgl-common-react-components/issues?labels=banner&state=open&sort=created&direction=desc&per_page=5"
```

e.g.

```json
    "author_association": "COLLABORATOR",
```

If it isn't one of the three accepted values, make your org membership public or add yourself as a collaborator on the repo.
