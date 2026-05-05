import { z } from 'zod';
import type { ApolloClient } from '../lib/apollo.js';

export const searchPeopleInputSchema = z.object({
  q_keywords: z.string().optional().describe('Keyword search across name, title, company, etc.'),
  person_titles: z.array(z.string()).optional().describe('Filter by job titles, e.g. ["CEO", "VP of Engineering"]'),
  person_locations: z.array(z.string()).optional().describe('Filter by person location, e.g. ["San Francisco, CA", "New York, United States"]'),
  person_seniorities: z.array(z.string()).optional().describe('Filter by seniority, e.g. ["vp", "director", "manager", "c_suite"]'),
  organization_names: z.array(z.string()).optional().describe('Filter by company name, e.g. ["Stripe", "Airbnb"]'),
  organization_domains: z.array(z.string()).optional().describe('Filter by company domain, e.g. ["stripe.com"]'),
  contact_email_status: z.array(z.string()).optional().describe('Filter by email status, e.g. ["verified", "likely to engage"]'),
  page: z.number().int().min(1).optional().default(1).describe('Page number (default 1)'),
  per_page: z.number().int().min(1).max(100).optional().default(10).describe('Results per page, max 100 (default 10)'),
});

export type SearchPeopleArgs = z.infer<typeof searchPeopleInputSchema>;

export async function search_people(args: SearchPeopleArgs, deps: { apollo: ApolloClient }) {
  const result = await deps.apollo.searchPeople(args);

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
    structuredContent: result,
  };
}
