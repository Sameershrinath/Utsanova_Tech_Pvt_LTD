/**
 * Authentication Module for Utsanova Tech Pvt Ltd
 * Handles signup, login, logout, Google OAuth, password reset, and route protection.
 */

const Auth = {
  
  // ─── SIGNUP ────────────────────────────────────────────────
  async signupWithEmail(name, email, password) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update display name and reload so local user object reflects it
      await user.updateProfile({ displayName: name });
      await user.reload();

      // Store additional user data in Firestore
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        displayName: name,
        email: email,
        photoURL: null,
        provider: 'email',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Send email verification
      await user.sendEmailVerification();

      return { success: true, user, message: 'Account created! Please check your email to verify your account.' };
    } catch (error) {
      return { success: false, message: Auth.getErrorMessage(error.code) };
    }
  },

  // ─── LOGIN ─────────────────────────────────────────────────
  async loginWithEmail(email, password) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, message: Auth.getErrorMessage(error.code) };
    }
  },

  // ─── GOOGLE OAUTH ──────────────────────────────────────────
  async loginWithGoogle() {
    try {
      const result = await auth.signInWithPopup(googleProvider);
      const user = result.user;
      const isNewUser = result.additionalUserInfo?.isNewUser;

      if (isNewUser) {
        // Store user data for new Google sign-ins
        await db.collection('users').doc(user.uid).set({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          provider: 'google',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      return { success: true, user };
    } catch (error) {
      return { success: false, message: Auth.getErrorMessage(error.code) };
    }
  },

  // ─── FORGOT PASSWORD ──────────────────────────────────────
  async sendPasswordReset(email) {
    try {
      await auth.sendPasswordResetEmail(email);
      return { success: true, message: 'Password reset link sent! Check your email inbox.' };
    } catch (error) {
      return { success: false, message: Auth.getErrorMessage(error.code) };
    }
  },

  // ─── LOGOUT ────────────────────────────────────────────────
  async logout() {
    try {
      await auth.signOut();
      window.location.href = 'index.html';
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Logout failed. Please try again.' };
    }
  },

  // ─── UPDATE PROFILE ────────────────────────────────────────
  async updateProfile(data) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user signed in');

      const updates = {};
      if (data.displayName) {
        await user.updateProfile({ displayName: data.displayName });
        updates.displayName = data.displayName;
      }

      updates.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('users').doc(user.uid).update(updates);

      return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ─── RESEND EMAIL VERIFICATION ─────────────────────────────
  async resendVerificationEmail() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user signed in');
      await user.sendEmailVerification();
      return { success: true, message: 'Verification email sent! Check your inbox.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ─── GET CURRENT USER ──────────────────────────────────────
  getCurrentUser() {
    return auth.currentUser;
  },

  // ─── GET USER DATA FROM FIRESTORE ──────────────────────────
  async getUserData(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },

  // ─── AUTH STATE OBSERVER ───────────────────────────────────
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  },

  // ─── ROUTE PROTECTION ──────────────────────────────────────
  // Call on protected pages to redirect unauthenticated users
  requireAuth(redirectTo = 'login.html') {
    return new Promise((resolve) => {
      auth.onAuthStateChanged((user) => {
        if (!user) {
          window.location.href = redirectTo;
        } else {
          resolve(user);
        }
      });
    });
  },

  // Redirect logged-in users away from auth pages (login/signup)
  redirectIfLoggedIn(redirectTo = 'dashboard.html') {
    auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.href = redirectTo;
      }
    });
  },

  // ─── FORM VALIDATION ──────────────────────────────────────
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  validatePassword(password) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('one number');
    return { valid: errors.length === 0, errors };
  },

  // ─── PASSWORD STRENGTH ─────────────────────────────────────
  getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 'weak', color: '#ef4444', width: '33%' };
    if (score <= 4) return { level: 'medium', color: '#f59e0b', width: '66%' };
    return { level: 'strong', color: '#22c55e', width: '100%' };
  },

  // ─── ERROR MESSAGES ────────────────────────────────────────
  getErrorMessage(code) {
    const messages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/requires-recent-login': 'Please log in again to complete this action.'
    };
    return messages[code] || 'An unexpected error occurred. Please try again.';
  }
};
