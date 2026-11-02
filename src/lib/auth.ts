import { UserProfile } from '../types';

export interface UserAccount extends UserProfile {
  id: string;
  email: string;
  password?: string;
  provider?: 'local' | 'google';
  isEmailVerified?: boolean;
  createdAt: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  score: number; // 0 to 5
  errors: string[];
}

export function validatePasswordFormat(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const errors: string[] = [];
  if (!hasMinLength) errors.push('At least 8 characters');
  if (!hasUppercase) errors.push('One uppercase letter (A-Z)');
  if (!hasLowercase) errors.push('One lowercase letter (a-z)');
  if (!hasNumber) errors.push('One number (0-9)');
  if (!hasSpecial) errors.push('One special character (!@#$%^&*...)');

  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  return {
    isValid: errors.length === 0,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    score,
    errors
  };
}

const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'mailinator.com', '10minutemail.com', 'guerrillamail.com',
  'throwawaymail.com', 'yopmail.com', 'fakeinbox.com', 'sharklasers.com',
  'trashmail.com', 'dispostable.com', 'temp-mail.org', 'tempail.com',
  'burnermail.io', 'getairmail.com', 'mohmal.com'
]);

const DOMAIN_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'iclud.com': 'icloud.com'
};

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

export function validateEmailFormat(email: string): EmailValidationResult {
  const clean = email.trim().toLowerCase();
  if (!clean) {
    return { isValid: false, error: 'Email address is required.' };
  }

  // RFC standard email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@gmail.com).' };
  }

  const parts = clean.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid email address.' };
  }

  const [localPart, domain] = parts;

  // Local part checks
  if (localPart.length < 1 || localPart.length > 64) {
    return { isValid: false, error: 'Email username must be between 1 and 64 characters.' };
  }

  // Domain checks
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { isValid: false, error: 'Email must contain a valid domain extension (e.g. .com, .edu).' };
  }

  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { isValid: false, error: 'Invalid domain extension (e.g. .com, .in, .org).' };
  }

  // Check disposable domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { isValid: false, error: 'Disposable or temporary email addresses are not allowed.' };
  }

  // Check common typos
  if (DOMAIN_TYPOS[domain]) {
    const suggested = `${localPart}@${DOMAIN_TYPOS[domain]}`;
    return {
      isValid: false,
      error: `Did you mean ${suggested}?`,
      suggestion: suggested
    };
  }

  return { isValid: true };
}

const AUTH_STORAGE_KEY = 'insta_fresh_auth_user';
const USERS_STORAGE_KEY = 'insta_fresh_registered_users';

export const authService = {
  getCurrentUser(): UserAccount | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserAccount | null): void {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  getAllUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUserToRegistry(user: UserAccount): void {
    const users = this.getAllUsers();
    const existingIndex = users.findIndex(
      u => u.username.toLowerCase() === user.username.toLowerCase() || u.email.toLowerCase() === user.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  // Generate 6-digit confirmation code
  generateVerificationCode(email: string): string {
    const cleanEmail = email.trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      sessionStorage.setItem(`otp_${cleanEmail}`, JSON.stringify({
        code,
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
      }));
    } catch {
      // ignore
    }
    return code;
  },

  verifyCode(email: string, inputCode: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const stored = sessionStorage.getItem(`otp_${cleanEmail}`);
      if (!stored) return false;
      const parsed = JSON.parse(stored);
      if (Date.now() > parsed.expiresAt) return false;
      return parsed.code === inputCode.trim();
    } catch {
      return false;
    }
  },

  login(usernameOrEmail: string, password?: string): UserAccount {
    const users = this.getAllUsers();
    const cleanIdentifier = usernameOrEmail.trim().toLowerCase();

    const found = users.find(
      u => u.username.toLowerCase() === cleanIdentifier || u.email.toLowerCase() === cleanIdentifier
    );

    if (!found) {
      throw new Error('Account not found. Please verify your username/email or sign up.');
    }

    if (found.provider === 'google' && !found.password) {
      // User registered via Google
      this.setCurrentUser(found);
      return found;
    }

    if (found.password && password && found.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    this.setCurrentUser(found);
    return found;
  },

  signup(email: string, fullName: string, username: string, password?: string): UserAccount {
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Strict Email Validation
    const emailVal = validateEmailFormat(cleanEmail);
    if (!emailVal.isValid) {
      throw new Error(emailVal.error || 'Invalid email address.');
    }

    // Validate username format
    if (!/^[a-zA-Z0-9._]{3,30}$/.test(cleanUsername)) {
      throw new Error('Username must be 3-30 characters and can only contain letters, numbers, periods, and underscores.');
    }

    // Strict Password format validation
    if (password) {
      const val = validatePasswordFormat(password);
      if (!val.isValid) {
        throw new Error(`Password does not meet required format: ${val.errors.join(', ')}`);
      }
    } else {
      throw new Error('Password is required.');
    }

    const users = this.getAllUsers();
    const exists = users.some(
      u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      throw new Error('An account with this username or email already exists. Please log in.');
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      fullName: fullName.trim(),
      email: cleanEmail,
      password: password || '',
      provider: 'local',
      isEmailVerified: true,
      bio: '',
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanUsername}`,
      createdAt: new Date().toISOString()
    };

    this.saveUserToRegistry(newUser);
    this.setCurrentUser(newUser);
    return newUser;
  },

  updateEmail(newEmail: string): UserAccount {
    const clean = newEmail.trim().toLowerCase();
    const val = validateEmailFormat(clean);
    if (!val.isValid) {
      throw new Error(val.error || 'Invalid email address.');
    }

    const current = this.getCurrentUser();
    if (!current) throw new Error('No active user session.');

    const users = this.getAllUsers();
    const conflict = users.some(u => u.id !== current.id && u.email.toLowerCase() === clean);
    if (conflict) {
      throw new Error('This email address is already in use by another account.');
    }

    const updated: UserAccount = {
      ...current,
      email: clean,
      isEmailVerified: true
    };

    this.saveUserToRegistry(updated);
    this.setCurrentUser(updated);
    return updated;
  },

  loginWithGoogle(googleEmail: string, fullName?: string, avatarUrl?: string): UserAccount {
    const cleanEmail = googleEmail.trim().toLowerCase();
    const emailVal = validateEmailFormat(cleanEmail);
    if (!emailVal.isValid) {
      throw new Error(emailVal.error || 'Please enter a valid Google Mail address.');
    }

    const users = this.getAllUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      this.setCurrentUser(existing);
      return existing;
    }

    // Generate valid username from email
    let baseHandle = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();
    if (baseHandle.length < 3) baseHandle = `user_${baseHandle || 'google'}`;
    let finalUsername = baseHandle;
    let counter = 1;
    while (users.some(u => u.username.toLowerCase() === finalUsername)) {
      finalUsername = `${baseHandle}${counter++}`;
    }

    const displayName = fullName?.trim() || baseHandle.charAt(0).toUpperCase() + baseHandle.slice(1);

    const newUser: UserAccount = {
      id: `google-${Date.now()}`,
      username: finalUsername,
      fullName: displayName,
      email: cleanEmail,
      provider: 'google',
      isEmailVerified: true,
      bio: '✨ Documenting my private memories via Google Mail',
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${finalUsername}`,
      createdAt: new Date().toISOString()
    };

    this.saveUserToRegistry(newUser);
    this.setCurrentUser(newUser);
    return newUser;
  },

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  deleteAccount(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const users = this.getAllUsers().filter(u => u.id !== currentUser.id && u.username.toLowerCase() !== currentUser.username.toLowerCase());
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    // Wipe current user's session and all stored content completely
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('insta_fresh_memories');
    localStorage.removeItem('insta_fresh_stories');
    localStorage.removeItem('insta_fresh_highlights');
    localStorage.removeItem('insta_fresh_archives');
    localStorage.removeItem('insta_fresh_journals');
    localStorage.removeItem('insta_fresh_moods');
    localStorage.removeItem('insta_fresh_capsules');
    localStorage.removeItem('insta_fresh_letters');
    localStorage.removeItem('insta_fresh_moodboards');
    localStorage.removeItem('insta_fresh_profile');
    localStorage.removeItem('insta_fresh_dms');
  },

  purgeAutoCreatedAccount(): void {
    try {
      const current = this.getCurrentUser();
      // If current user is the old mock or has the dummy unsplash avatar
      if (current && (current.avatarUrl?.includes('unsplash') || current.avatarUrl?.includes('1534528741775-53994a69daeb') || current.id === 'user-sumana-mock')) {
        this.deleteAccount();
      }

      // Filter out any mock users from registry
      const users = this.getAllUsers();
      const filtered = users.filter(u => 
        !u.avatarUrl?.includes('1534528741775-53994a69daeb') && 
        !u.avatarUrl?.includes('unsplash') &&
        u.id !== 'user-sumana-mock'
      );
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));

      // Remove any mock stories with unsplash
      const storiesRaw = localStorage.getItem('insta_fresh_stories');
      if (storiesRaw) {
        const stories = JSON.parse(storiesRaw);
        const filteredStories = stories.filter((s: any) => 
          !s.mediaUrl?.includes('unsplash') && 
          !s.user?.avatar?.includes('1534528741775-53994a69daeb')
        );
        localStorage.setItem('insta_fresh_stories', JSON.stringify(filteredStories));
      }

      // Remove any mock highlights with unsplash
      const hlRaw = localStorage.getItem('insta_fresh_highlights');
      if (hlRaw) {
        const hls = JSON.parse(hlRaw);
        const filteredHls = hls.filter((h: any) => !h.coverUrl?.includes('unsplash'));
        localStorage.setItem('insta_fresh_highlights', JSON.stringify(filteredHls));
      }

      // Remove any legacy mock keys
      const legacyKeys = ['little_days_memories', 'little_days_stories', 'little_days_highlights', 'little_days_profile', 'insta_memories', 'insta_stories'];
      legacyKeys.forEach(k => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }
};

// Automatically run on load to purge any stale mock account
authService.purgeAutoCreatedAccount();
