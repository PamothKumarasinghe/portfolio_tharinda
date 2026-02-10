import { z } from 'zod';

/**
 * Validation schemas for different API endpoints
 */

// Login validation
export const loginSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must not exceed 100 characters')
    .toLowerCase()
    .trim(),
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must not exceed 200 characters')
    .trim(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters')
    .trim()
});

// Project validation
export const projectSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .trim(),
  tags: z.array(z.string().trim())
    .min(1, 'At least one tag is required')
    .max(10, 'Maximum 10 tags allowed'),
  image: z.string()
    .url('Image must be a valid URL')
    .max(500, 'Image URL must not exceed 500 characters'),
  githubUrl: z.string()
    .trim()
    .max(500, 'GitHub URL must not exceed 500 characters')
    .refine(
      (val) => val === '' || z.string().url().safeParse(val).success,
      { message: 'GitHub URL must be valid' }
    )
    .optional(),
  liveUrl: z.string()
    .trim()
    .max(500, 'Live URL must not exceed 500 characters')
    .refine(
      (val) => val === '' || z.string().url().safeParse(val).success,
      { message: 'Live URL must be valid' }
    )
    .optional(),
  featured: z.boolean().default(false)
});

// Experience validation
export const experienceSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must not exceed 200 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .trim(),
  date: z.string()
    .min(3, 'Date is required')
    .max(100, 'Date must not exceed 100 characters')
    .trim(),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(200, 'Location must not exceed 200 characters')
    .trim(),
  current: z.boolean().default(false)
});

// Education validation
export const educationSchema = z.object({
  degree: z.string()
    .min(3, 'Degree must be at least 3 characters')
    .max(200, 'Degree must not exceed 200 characters')
    .trim(),
  field: z.string()
    .min(3, 'Field must be at least 3 characters')
    .max(200, 'Field must not exceed 200 characters')
    .trim(),
  institution: z.string()
    .min(2, 'Institution name must be at least 2 characters')
    .max(200, 'Institution name must not exceed 200 characters')
    .trim(),
  achievements: z.string()
    .max(1000, 'Achievements must not exceed 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  date: z.string()
    .min(3, 'Date is required')
    .max(100, 'Date must not exceed 100 characters')
    .trim(),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(200, 'Location must not exceed 200 characters')
    .trim(),
  current: z.boolean().default(false)
});

// Skill validation
export const skillSchema = z.object({
  name: z.string()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name must not exceed 100 characters')
    .trim(),
  percentage: z.number()
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage must not exceed 100')
    .int('Percentage must be a whole number')
});

export const skillCategorySchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  icon: z.string()
    .min(1, 'Icon is required')
    .max(50, 'Icon must not exceed 50 characters'),
  skills: z.array(skillSchema)
    .min(1, 'At least one skill is required')
    .max(20, 'Maximum 20 skills per category'),
  order: z.number()
    .min(1, 'Order must be at least 1')
    .int('Order must be a whole number')
});

/**
 * Helper function to validate and sanitize data
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error
      };
    }
    throw error;
  }
}

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
