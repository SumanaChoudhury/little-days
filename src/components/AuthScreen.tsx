import React, { useState } from 'react';
import { InstagramLogo } from './InstagramIcons';
import { authService, UserAccount } from '../lib/auth';

interface AuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  // Default to Sign Up so new users immediately create their own account
  const [isSignUp, setIsSignUp] = useState(true);

  // Clean empty inputs
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (isSignUp) {
        if (!email.trim() || !fullName.trim() || !username.trim() || !password.trim()) {
          setErrorMsg('Please complete all fields to sign up.');
          return;
        }
        const user = authService.signup(email, fullName, username, password);
        onLoginSuccess(user);
      } else {
        if (!emailOrUsername.trim() || !password.trim()) {
          setErrorMsg('Please enter your username and password.');
          return;
        }
        const user = authService.login(emailOrUsername, password);
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-[#262626] dark:text-[#f5f5f5] flex flex-col justify-between py-8 px-4 select-none">
      <div className="flex-1 flex items-center justify-center">
        {/* Main Box */}
        <div className="w-full max-w-[850px] flex items-center justify-center gap-8">
          {/* Left Phone Frame (Desktop only) */}
          <div className="hidden lg:block relative w-[380px] h-[580px] shrink-0">
            <div className="w-full h-full rounded-[45px] border-[10px] border-neutral-800 bg-neutral-900 p-2 shadow-2xl overflow-hidden relative">
              <div className="w-full h-full bg-gradient-to-br from-purple-900 via-rose-950 to-neutral-950 rounded-[35px] flex flex-col justify-between p-8 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-sm">
                    🔒
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Private Vault
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold leading-snug">
                    Your Personal Instagram.
                  </h3>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    Create your account to start dumping photos and videos safely into your private archive.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Login / Sign Up Card */}
          <div className="w-full max-w-[350px] flex flex-col gap-3">
            <div className="bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] p-8 flex flex-col items-center sm:rounded-sm">
              {/* Instagram Wordmark */}
              <div className="my-6 text-black dark:text-white flex justify-center">
                <InstagramLogo width={175} height={51} />
              </div>

              <p className="text-xs text-neutral-500 font-semibold text-center mb-5 leading-normal">
                {isSignUp
                  ? 'Sign up to create your personal Instagram account.'
                  : 'Log in to your private Instagram archive.'}
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-2 text-xs">
                {isSignUp ? (
                  <>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xs bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500"
                    />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full p-2.5 rounded-xs bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500"
                    />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full p-2.5 rounded-xs bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full p-2.5 rounded-xs bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500"
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Phone number, username, or email"
                      value={emailOrUsername}
                      onChange={e => setEmailOrUsername(e.target.value)}
                      className="w-full p-2.5 rounded-xs bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full p-2.5 rounded-xs bg-[#fafafa] dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#363636] text-black dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-500"
                    />
                  </>
                )}

                {errorMsg && (
                  <p className="text-red-500 text-[11px] text-center pt-1">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2 mt-2 rounded-lg bg-[#0095f6] hover:bg-sky-600 font-semibold text-white transition-colors"
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
