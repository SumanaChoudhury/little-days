import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, Shield, Mail } from 'lucide-react';
import { InstagramLogo } from './InstagramIcons';
import { authService, UserAccount, validatePasswordFormat } from '../lib/auth';

interface AuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  // Default to Sign Up so new users immediately create their own account
  const [isSignUp, setIsSignUp] = useState(true);

  // Form Fields
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility State (Password Eye)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Google Sign-In Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleError, setGoogleError] = useState('');

  // General Error message
  const [errorMsg, setErrorMsg] = useState('');

  // Live password validation
  const passwordValidation = validatePasswordFormat(password);

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
      case 2:
      case 3:
        return { label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-500' };
      case 4:
        return { label: 'Good', color: 'bg-sky-500', text: 'text-sky-500' };
      case 5:
        return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
      default:
        return { label: 'Weak', color: 'bg-neutral-300', text: 'text-neutral-400' };
    }
  };

  const strength = getStrengthLabel(passwordValidation.score);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (isSignUp) {
        if (!email.trim() || !fullName.trim() || !username.trim() || !password.trim()) {
          setErrorMsg('Please complete all required fields to sign up.');
          return;
        }

        if (!passwordValidation.isValid) {
          setErrorMsg(`Password does not meet required format: ${passwordValidation.errors.join(', ')}`);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match. Please verify.');
          return;
        }

        const user = authService.signup(email, fullName, username, password);
        onLoginSuccess(user);
      } else {
        if (!emailOrUsername.trim() || !password.trim()) {
          setErrorMsg('Please enter your username/email and password.');
          return;
        }
        const user = authService.login(emailOrUsername, password);
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    }
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError('');

    if (!googleEmail.trim()) {
      setGoogleError('Please enter your Google Mail address.');
      return;
    }

    try {
      const user = authService.loginWithGoogle(googleEmail, googleName);
      setIsGoogleModalOpen(false);
      onLoginSuccess(user);
    } catch (err: any) {
      setGoogleError(err.message || 'Failed to authenticate with Google Mail.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-[#262626] dark:text-[#f5f5f5] flex flex-col justify-between py-8 px-4 select-none">
      <div className="flex-1 flex items-center justify-center">
        {/* Main Box */}
        <div className="w-full max-w-[860px] flex items-center justify-center gap-8">
          {/* Left Phone Frame (Desktop only) */}
          <div className="hidden lg:block relative w-[380px] h-[600px] shrink-0">
            <div className="w-full h-full rounded-[45px] border-[10px] border-neutral-800 bg-neutral-900 p-2 shadow-2xl overflow-hidden relative">
              <div className="w-full h-full bg-gradient-to-br from-purple-900 via-rose-950 to-neutral-950 rounded-[35px] flex flex-col justify-between p-8 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-sm">
                    🔒
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Private Memory Archive
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold leading-snug">
                    Your Life in Pictures.
                  </h3>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    Zero algorithms, zero followers, zero public noise. Document your days in a familiar Instagram experience that is completely private to you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Login / Sign Up Card */}
          <div className="w-full max-w-[360px] flex flex-col gap-3">
            <div className="bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] p-7 flex flex-col items-center sm:rounded-sm shadow-xs">
              {/* Instagram Wordmark */}
              <div className="my-5 text-black dark:text-white flex justify-center">
                <InstagramLogo width={175} height={51} />
              </div>

              <p className="text-xs text-neutral-500 font-medium text-center mb-5 leading-normal">
                {isSignUp
                  ? 'Sign up to build your private Instagram memory vault.'
                  : 'Log in to your private Instagram archive.'}
              </p>

              {/* Continue with Google Mail Button */}
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-lg border border-[#dbdbdb] dark:border-[#363636] bg-white dark:bg-[#121212] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:shadow-xs active:scale-[0.99]"
              >
                {/* Official Google G Logo */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Mail</span>
              </button>

              {/* Instagram Standard "OR" Divider */}
              <div className="flex items-center my-4 w-full">
                <div className="flex-1 h-[1px] bg-[#dbdbdb] dark:bg-[#262626]" />
                <span className="px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  OR
                </span>
                <div className="flex-1 h-[1px] bg-[#dbdbdb] dark:bg-[#262626]" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-2 text-xs">
                {isSignUp ? (
                  <>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-sm bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500"
                    />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full p-2.5 rounded-sm bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500"
                    />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full p-2.5 rounded-sm bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500"
                    />

                    {/* Password Input with Eye */}
                    <div className="relative w-full">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-2.5 pr-9 rounded-sm bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500 font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white p-0.5 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Live Password Format Validation Card */}
                    {password.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 animate-fade-in text-[11px]">
                        {/* Strength Indicator Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                              Password Strength
                            </span>
                            <span className={`text-[10px] font-bold ${strength.text}`}>
                              {strength.label}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                            <div
                              className={`h-full transition-all duration-300 ${strength.color}`}
                              style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center gap-1.5 text-[10.5px]">
                            {passwordValidation.hasMinLength ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0" />
                            )}
                            <span className={passwordValidation.hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-neutral-400'}>
                              At least 8 characters
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10.5px]">
                            {passwordValidation.hasUppercase ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0" />
                            )}
                            <span className={passwordValidation.hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-neutral-400'}>
                              One uppercase letter (A-Z)
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10.5px]">
                            {passwordValidation.hasLowercase ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0" />
                            )}
                            <span className={passwordValidation.hasLowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-neutral-400'}>
                              One lowercase letter (a-z)
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10.5px]">
                            {passwordValidation.hasNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0" />
                            )}
                            <span className={passwordValidation.hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-neutral-400'}>
                              One number (0-9)
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10.5px]">
                            {passwordValidation.hasSpecial ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0" />
                            )}
                            <span className={passwordValidation.hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-neutral-400'}>
                              One special character (!@#$%^&*...)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Confirm Password Input with Eye */}
                    <div className="relative w-full">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full p-2.5 pr-9 rounded-sm bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500 font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white p-0.5 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {confirmPassword.length > 0 && (
                      <p className={`text-[10.5px] px-1 ${
                        password === confirmPassword ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {password === confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Username or email"
                      value={emailOrUsername}
                      onChange={e => setEmailOrUsername(e.target.value)}
                      className="w-full p-2.5 rounded-sm bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500"
                    />

                    {/* Password Input with Eye */}
                    <div className="relative w-full">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-2.5 pr-9 rounded-sm bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500 font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white p-0.5 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </>
                )}

                {errorMsg && (
                  <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-[11px] text-center">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] active:scale-[0.99] font-semibold text-white transition-all shadow-xs"
                >
                  {isSignUp ? 'Sign up' : 'Log in'}
                </button>
              </form>
            </div>

            {/* Toggle Sign Up / Log In */}
            <div className="bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] p-5 text-center text-xs sm:rounded-sm">
              {isSignUp ? (
                <p>
                  Have an account?{' '}
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMsg('');
                    }}
                    className="font-semibold text-[#0095f6] hover:underline"
                  >
                    Log in
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setErrorMsg('');
                    }}
                    className="font-semibold text-[#0095f6] hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Google Mail Sign-In Interactive Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-sm border border-[#dbdbdb] dark:border-[#383838] shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-bold text-sm text-black dark:text-white">
                  Sign in with Google
                </span>
              </div>
              <button
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-normal">
              Connect your Google Mail account to access your private Instagram memory archive safely.
            </p>

            <form onSubmit={handleGoogleSubmit} className="space-y-3">
              <div>
                <label className="text-[10.5px] font-semibold text-neutral-500 uppercase block mb-1">
                  Google Mail Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={e => setGoogleEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    autoFocus
                    className="w-full p-2.5 pl-8 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-black dark:text-white outline-none focus:border-blue-500"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-semibold text-neutral-500 uppercase block mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={e => setGoogleName(e.target.value)}
                  placeholder="Sumana Choudhury"
                  className="w-full p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-black dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              {googleError && (
                <p className="text-rose-500 text-[11px]">{googleError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold hover:bg-neutral-200 text-black dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-[11px] text-neutral-400 space-y-2 mt-8">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <span>Meta</span>
          <span>About</span>
          <span>Blog</span>
          <span>Jobs</span>
          <span>Help</span>
          <span>API</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Locations</span>
          <span>Instagram Lite</span>
          <span>Threads</span>
        </div>
        <p className="text-[10px] uppercase font-medium">
          © 2026 INSTAGRAM • YOUR PRIVATE MEMORY ARCHIVE
        </p>
      </footer>
    </div>
  );
};
