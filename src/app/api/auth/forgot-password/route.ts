import { NextResponse } from 'next/server';
import { ForgotPasswordSchema } from '@/types';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validationResult = ForgotPasswordSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid email provided', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { email } = validationResult.data;
    // Simulate generating a reset token and sending an email
    console.log(`Send password reset email to ${email} with reset link...`);
    
    // You can integrate with an email provider here.
    return NextResponse.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({ error: 'Failed to process forgot password request' }, { status: 500 });
  }
}
