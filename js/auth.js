// ─── Password Hashing (SHA-256) ────────────────────────────────────────────
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Show / Hide Alert Helpers ─────────────────────────────────────────────
function showError(msgId, text) {
    const el = document.getElementById(msgId);
    if (!el) return;
    el.textContent = text;
    el.classList.remove('hidden');
}

function hideMessage(msgId) {
    const el = document.getElementById(msgId);
    if (el) el.classList.add('hidden');
}

function showSuccess(msgId, text) {
    const el = document.getElementById(msgId);
    if (!el) return;
    el.textContent = text;
    el.classList.remove('hidden');
}

// ─── REGISTER ──────────────────────────────────────────────────────────────
async function handleRegister() {
    const email    = document.getElementById('registerEmail').value.trim();
    const pass     = document.getElementById('registerPassword').value;
    const confirm  = document.getElementById('registerConfirmPassword').value;
    const role     = document.getElementById('registerRole').value;
    const errorEl  = 'registerError';
    const successEl = 'registerSuccess';

    hideMessage(errorEl);
    hideMessage(successEl);

    if (!email || !pass || !confirm || !role) {
        return showError(errorEl, 'All fields are required.');
    }
    if (role === 'student') {
        if (!email.endsWith('@adab.umpsa.edu.my')) {
            return showError(errorEl, 'Student registration requires an @adab.umpsa.edu.my email address.');
        }
    } else if (role === 'staff') {
        if (!email.endsWith('@umpsa.edu.my') || email.endsWith('@adab.umpsa.edu.my')) {
            return showError(errorEl, 'Staff registration requires an @umpsa.edu.my email address.');
        }
    } else {
        return showError(errorEl, 'Invalid role selected.');
    }
    if (pass.length < 8) {
        return showError(errorEl, 'Password must be at least 8 characters.');
    }
    if (pass !== confirm) {
        return showError(errorEl, 'Passwords do not match.');
    }

    // Check if email already registered
    const { data: existing, error: checkError } = await db
        .from('User')
        .select('user_id')
        .eq('email', email)
        .maybeSingle();

    if (checkError) return showError(errorEl, 'Error checking email. Please try again.');
    if (existing)  return showError(errorEl, 'This email is already registered.');

    const hashedPass = await hashPassword(pass);

    const { error: insertError } = await db
        .from('User')
        .insert([{ email, password: hashedPass, role }]);

    if (insertError) return showError(errorEl, 'Registration failed. Please try again.');

    showSuccess(successEl, 'Account created successfully!');
    setTimeout(() => { window.location.href = '../LogInPage/LogInPage.html'; }, 2000);
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────
async function handleLogin() {
    const email   = document.getElementById('loginEmail').value.trim();
    const pass    = document.getElementById('loginPassword').value;
    const role    = document.getElementById('roleSelect').value;
    const errorEl = 'loginError';
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    const store = rememberMe ? localStorage : sessionStorage;

    hideMessage(errorEl);

    if (!email || !pass || !role) {
        return showError(errorEl, 'All fields are required.');
    }

    const hashedPass = await hashPassword(pass);

    // ── Admin Login ─────────────────────────────────────────────────────────
    if (role === 'superadmin') {
        const { data: admin, error } = await db
            .from('Admin')
            .select('admin_id, email, role')
            .eq('email', email)
            .eq('password', hashedPass)
            .eq('role', 'superadmin')
            .maybeSingle();

        if (error || !admin) {
            return showError(errorEl, 'Invalid admin credentials.');
        }

        store.setItem('admin_id',    admin.admin_id);
        store.setItem('admin_email', admin.email);
        store.setItem('admin_role',  admin.role);

        window.location.href = '../AdminDashboard/AdminDashboard.html';
        return;
    }

    // ── Student / Staff Login ───────────────────────────────────────────────
    const { data: user, error } = await db
        .from('User')
        .select('user_id, email, role')
        .eq('email', email)
        .eq('password', hashedPass)
        .eq('role', role)
        .maybeSingle();

    if (error || !user) {
        return showError(errorEl, 'Invalid email, password, or role.');
    }

    store.setItem('user_id',    user.user_id);
    store.setItem('user_email', user.email);
    store.setItem('user_role',  user.role);

    window.location.href = '../UserDashboard/UserDashboard.html';
}

// ─── FORGOT PASSWORD (send email link) ───────────────────────────────────────
async function handleForgotPassword() {
    const email   = document.getElementById('forgotEmail').value.trim();
    const errorEl = 'forgotError';
    const successEl = 'forgotSuccess';

    hideMessage(errorEl);
    hideMessage(successEl);

    if (!email) return showError(errorEl, 'Please enter your email address.');

    // 1. Check if user exists in User or Admin table
    let table = 'User';
    let { data: account, error } = await db.from('User').select('user_id').eq('email', email).maybeSingle();
    
    if (error || !account) {
        // Try Admin table
        table = 'Admin';
        const { data: admin, adminError } = await db.from('Admin').select('admin_id').eq('email', email).maybeSingle();
        if (adminError || !admin) {
            return showError(errorEl, 'No account found with that email address.');
        }
        account = admin;
    }

    // 2. Generate secure token & expiry (15 mins)
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();

    // 3. Save to database
    const { error: updateError } = await db.from(table)
        .update({ reset_token: token, reset_token_expires: expiresAt })
        .eq('email', email);

    if (updateError) return showError(errorEl, 'System error setting up reset. Please try again.');

    // 4. Generate the reset link (based on current URL path)
    const baseUrl = window.location.href.split('?')[0].replace(/NewPasswordPage/g, 'ResetPasswordPage');
    const resetLink = `${baseUrl}?token=${token}&email=${encodeURIComponent(email)}&type=${table}`;

    // 5. Send Email via Edge Function
    const { data: edgeData, error: edgeError } = await db.functions.invoke('send-reset-email', {
        body: { email, resetLink }
    });

    if (edgeError || !edgeData?.success) {
        console.error('Edge Function Error:', edgeError || edgeData);
        const detailedError = edgeData?.details?.message || edgeData?.error || (edgeError && edgeError.message) || 'Unknown error';
        return showError(errorEl, `Failed to send email: ${detailedError}`);
    }

    showSuccess(successEl, 'Reset link sent successfully!');
}

// ─── RESET PASSWORD ────────────────────────────────────────────────────────
async function handleResetPassword() {
    const newPass     = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmNewPassword').value;
    const errorEl     = 'resetError';
    const successEl   = 'resetSuccess';
    
    // Read from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const token = urlParams.get('token');
    const table = urlParams.get('type'); // 'User' or 'Admin'

    hideMessage(errorEl);
    hideMessage(successEl);

    if (!email || !token || !table) {
        return showError(errorEl, 'Invalid or broken reset link. Please request a new one.');
    }
    if (table !== 'User' && table !== 'Admin') {
        return showError(errorEl, 'Invalid account type.');
    }
    if (!newPass || !confirmPass) {
        return showError(errorEl, 'All fields are required.');
    }
    if (newPass.length < 8) {
        return showError(errorEl, 'Password must be at least 8 characters.');
    }
    if (newPass !== confirmPass) {
        return showError(errorEl, 'Passwords do not match.');
    }

    // 1. Verify token & expiration
    const { data: userData, error: fetchError } = await db.from(table)
        .select('reset_token, reset_token_expires')
        .eq('email', email)
        .maybeSingle();

    if (fetchError || !userData) {
        return showError(errorEl, 'Account not found.');
    }

    if (userData.reset_token !== token) {
        return showError(errorEl, 'Invalid reset token. Please request a new link.');
    }

    if (new Date(userData.reset_token_expires) < new Date()) {
        return showError(errorEl, 'Reset link has expired. Please request a new one.');
    }

    // 2. Hash new password & update
    const hashedPass = await hashPassword(newPass);

    const { error: updateError } = await db.from(table)
        .update({ 
            password: hashedPass,
            reset_token: null,          // Clear the token
            reset_token_expires: null 
        })
        .eq('email', email);

    if (updateError) return showError(errorEl, 'Failed to reset password. Please try again.');

    showSuccess(successEl, 'Password reset successfully!');
    setTimeout(() => { window.location.href = '../LogInPage/LogInPage.html'; }, 2000);
}
