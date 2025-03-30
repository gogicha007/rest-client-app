import { z } from 'zod';

export const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters' })
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
      {
        message:
          'Password to contain: 1 number, 1 uppercased letter, 1 lowercased letter, 1 special character',
      }
    ),
});

export type FormFields = z.infer<typeof schema>;
