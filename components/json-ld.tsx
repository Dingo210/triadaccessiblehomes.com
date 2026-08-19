import * as React from 'react';

/**
 * Renders a JSON-LD structured-data <script> tag. Server component so the
 * markup is present in the SSR HTML for search engines.
 */
export function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
