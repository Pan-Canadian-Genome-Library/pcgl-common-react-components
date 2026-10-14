import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup, configure } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';

configure({ testIdAttribute: 'data-test-id' });

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});


