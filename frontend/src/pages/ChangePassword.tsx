import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { usersService } from '../services/users.service';
import { useState } from 'react';

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Min 8 characters')
    .max(16, 'Max 16 characters')
    .regex(/[A-Z]/, 'Must contain one uppercase letter')
    .regex(/[a-z]/, 'Must contain one lowercase letter')
    .regex(/[0-9]|[^A-Za-z0-9]/, 'Must contain one number or special char'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof passwordSchema>;

export default function ChangePassword() {
  const { user } = useAuth();
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    try {
      setMsg({ type: '', text: '' });
      await usersService.update(user.id, { password: data.password });
      setMsg({ type: 'success', text: 'Password updated successfully.' });
      reset();
    } catch (error) {
      setMsg({ type: 'error', text: 'Failed to update password.' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      
      {msg.text && (
        <div className={`p-3 rounded mb-4 ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input type="password" {...register('password')} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input type="password" {...register('confirmPassword')} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}