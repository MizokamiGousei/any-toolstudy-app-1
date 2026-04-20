import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { COOKIE_NAME } from '@/lib/constants';
import type { AuthCookie } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (authError) {
      const message = authError.message.toLowerCase();
      if (message.includes('email not confirmed') || message.includes('not confirmed')) {
        return NextResponse.json(
          { error: 'メール認証が完了していません。受信メールの確認リンクを開いてください。' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // Find user by email in our users table
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', trimmedEmail)
      .single();

    // Backfill users record when Auth user exists but users table row is missing
    if (userError || !user) {
      const fallbackNickname = trimmedEmail.split('@')[0] || 'ユーザー';
      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .insert({
          nickname: fallbackNickname,
          email: trimmedEmail,
          auth_id: authData.user?.id || null,
          role: null,
          last_active_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        // If row already exists due to race condition, re-fetch
        const { data: existingUser, error: refetchError } = await supabase
          .from('users')
          .select('*')
          .eq('email', trimmedEmail)
          .single();

        if (refetchError || !existingUser) {
          console.error('[EmailLogin] users upsert failed:', createError);
          return NextResponse.json(
            { error: 'ユーザー情報の取得に失敗しました' },
            { status: 500 }
          );
        }

        user = existingUser;
      } else {
        user = createdUser;
      }
    }

    // Keep auth_id in sync if missing
    if (!user.auth_id && authData.user?.id) {
      await supabase
        .from('users')
        .update({ auth_id: authData.user.id })
        .eq('id', user.id);
    }

    // Update last_active_at
    await supabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', user.id);

    // Set auth cookie
    const cookieData: AuthCookie = {
      userId: user.id,
      nickname: user.nickname,
    };
    const encodedCookie = Buffer.from(JSON.stringify(cookieData)).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nickname: user.nickname,
        role: user.role,
      },
    });

    response.cookies.set(COOKIE_NAME, encodedCookie, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[EmailLogin] Error:', error);
    return NextResponse.json(
      { error: 'ログインに失敗しました' },
      { status: 500 }
    );
  }
}
