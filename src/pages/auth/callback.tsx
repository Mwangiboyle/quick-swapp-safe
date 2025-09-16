// src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the hash from the URL which contains the confirmation tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (type === 'signup' && accessToken) {
          // Set the session with the tokens from the email link
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken!,
          });

          if (error) {
            console.error('Error confirming email:', error);
            setStatus('error');
            setMessage('Failed to confirm email. Please try again.');
            return;
          }

          if (data.user) {
            setStatus('success');
            setMessage('Email confirmed successfully! Welcome to Quick Swapp.');
            
            // Redirect to dashboard or home after a delay
            setTimeout(() => {
              navigate('/dashboard'); // or wherever you want to redirect
            }, 3000);
          }
        } else {
          setStatus('error');
          setMessage('Invalid confirmation link.');
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('An error occurred during confirmation.');
      }
    };

    // Run the email confirmation handler
    handleEmailConfirmation();
  }, [navigate]);

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleGoToSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <CardTitle>Confirming your email...</CardTitle>
              <CardDescription>Please wait while we verify your account.</CardDescription>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Email Confirmed!</CardTitle>
              <CardDescription>Your account has been successfully verified.</CardDescription>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <CardTitle>Confirmation Failed</CardTitle>
              <CardDescription>There was an issue confirming your email.</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          
          {status === 'success' && (
            <div className="space-y-2">
              <p className="text-sm">Redirecting you to the dashboard...</p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-2">
              <Button onClick={handleGoToSignIn} className="w-full">
                Go to Sign In
              </Button>
              <Button onClick={handleReturnHome} variant="outline" className="w-full">
                Return to Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
