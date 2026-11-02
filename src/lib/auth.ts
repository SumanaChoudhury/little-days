import { UserProfile } from '../types';

export interface UserAccount extends UserProfile {
  id: string;
  email: string;
  password?: string;
  provider?: 'local' | 'google';
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

  login(usernameOrEmail: string, password?: string): UserAccount {
    const users = this.getAllUsers();
    const cleanIdentifier = usernameOrEmail.trim().toLowerCase();

    const found = users.find(
      u => u.username.toLowerCase() === cleanIdentifier || u.email.toLowerCase() === cleanIdentifier
    );

    if (!found) {
      throw new Error('Account not found. Please sign up or create an account.');
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

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
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
      bio: '',
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanUsername}`,
      createdAt: new Date().toISOString()
    };

    this.saveUserToRegistry(newUser);
    this.setCurrentUser(newUser);
    return newUser;
  },

  loginWithGoogle(googleEmail: string, fullName?: string, avatarUrl?: string): UserAccount {
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail.includes('@') || (!cleanEmail.endsWith('@gmail.com') && !cleanEmail.endsWith('@googlemail.com') && !cleanEmail.includes('.'))) {
      throw new Error('Please enter a valid Google Mail address (e.g. yourname@gmail.com).');
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
      const users = this.getAllUsers().filter(u => u.id !== currentUser.id);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    // Wipe current user's session and all stored content
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('insta_fresh_memories');
    localStorage.removeItem('insta_fresh_stories');
    localStorage.removeItem('insta_fresh_highlights');
    localStorage.removeItem('insta_fresh_archives');
  }
};
