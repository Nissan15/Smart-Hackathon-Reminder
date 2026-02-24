import { z } from 'zod';
import { insertHackathonSchema } from './schema';

export const errorSchemas = {
  unauthorized: z.object({ message: z.string() }),
  forbidden: z.object({ message: z.string() }),
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  hackathons: {
    list: {
      method: 'GET' as const,
      path: '/api/hackathons' as const,
      responses: {
        200: z.array(z.any()), // Array of HackathonWithCounts
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/hackathons/:id' as const,
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/hackathons' as const,
      input: insertHackathonSchema,
      responses: {
        201: z.any(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/hackathons/:id' as const,
      input: insertHackathonSchema.partial(),
      responses: {
        200: z.any(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/hackathons/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    },
    registrations: {
      method: 'GET' as const,
      path: '/api/hackathons/:id/registrations' as const,
      responses: {
        200: z.array(z.any()), // array of students registered
      }
    }
  },
  registrations: {
    list: {
      method: 'GET' as const,
      path: '/api/registrations' as const,
      responses: {
        200: z.array(z.any()), // array of hackathons the user registered for
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/registrations' as const,
      input: z.object({ hackathonId: z.number() }),
      responses: {
        201: z.any(),
        400: errorSchemas.validation,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/registrations/:hackathonId' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    }
  },
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications' as const,
      responses: {
        200: z.array(z.any()),
      }
    }
  },
  stats: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.any(),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}