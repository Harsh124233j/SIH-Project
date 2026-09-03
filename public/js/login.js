document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const authPageTitle = document.getElementById('authPageTitle');
    const authPageSubtitle = document.getElementById('authPageSubtitle');
    const authTabsContainer = document.getElementById('authTabsContainer');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabSignupBtn = document.getElementById('tabSignupBtn');
    const toggleTabLink = document.getElementById('toggleTabLink');
    const footerTextPrompt = document.getElementById('footerTextPrompt');

    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const otpView = document.getElementById('otpView');

    const standardLoginForm = document.getElementById('standardLoginForm');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const toggleOtpLoginBtn = document.getElementById('toggleOtpLoginBtn');

    const signupForm = document.getElementById('signupForm');
    const regNameInput = document.getElementById('regName');
    const regEmailInput = document.getElementById('regEmail');
    const regPhoneInput = document.getElementById('regPhone');
    const regPasswordInput = document.getElementById('regPassword');

    const otpNotificationToast = document.getElementById('otpNotificationToast');
    const toastOtpCode = document.getElementById('toastOtpCode');
    const toastFillBtn = document.getElementById('toastFillBtn');
    const otpTargetDisplay = document.getElementById('otpTargetDisplay');
    const otpBoxes = document.querySelectorAll('.otp-box');
    const otpBoxesContainer = document.getElementById('otpBoxes');
    const timerSecondsSpan = document.getElementById('timerSeconds');
    const resendCountdown = document.getElementById('resendCountdown');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const backFromOtpBtn = document.getElementById('backFromOtpBtn');

    const googleBtns = document.querySelectorAll('.google-btn');

    // Current State
    let currentAuthMode = 'login'; // 'login' | 'signup' | 'otp'
    let previousView = 'loginView';
    let pendingVerification = {
        contact: '',
        userName: '',
        otp: ''
    };
    let resendTimerInterval = null;

    // --- 1. Tab Switching Functionality ---
    function switchTab(target) {
        if (target === 'login') {
            currentAuthMode = 'login';
            tabLoginBtn.classList.add('active');
            tabSignupBtn.classList.remove('active');
            loginView.classList.add('active-view');
            signupView.classList.remove('active-view');
            otpView.classList.remove('active-view');
            authTabsContainer.style.display = 'flex';

            authPageTitle.textContent = 'Welcome back';
            authPageSubtitle.textContent = 'Log in to explore offbeat journeys';
            footerTextPrompt.textContent = "Don't have an account?";
            toggleTabLink.textContent = 'Create one now';
        } else if (target === 'signup') {
            currentAuthMode = 'signup';
            tabSignupBtn.classList.add('active');
            tabLoginBtn.classList.remove('active');
            signupView.classList.add('active-view');
            loginView.classList.remove('active-view');
            otpView.classList.remove('active-view');
            authTabsContainer.style.display = 'flex';

            authPageTitle.textContent = 'Create your account';
            authPageSubtitle.textContent = 'Join Tourism Hub and discover offbeat destinations';
            footerTextPrompt.textContent = 'Already have an account?';
            toggleTabLink.textContent = 'Log in';
        }
    }

    tabLoginBtn.addEventListener('click', () => switchTab('login'));
    tabSignupBtn.addEventListener('click', () => switchTab('signup'));

    toggleTabLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentAuthMode === 'signup') {
            switchTab('login');
        } else {
            switchTab('signup');
        }
    });

    // --- 2. Password Visibility Toggle ---
    document.querySelectorAll('.eye-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // --- 3. Request & Display OTP ---
    async function requestOtp(contact, userName, fromView) {
        previousView = fromView;
        pendingVerification.contact = contact;
        pendingVerification.userName = userName;

        try {
            // Call backend endpoint to generate realistic OTP
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact })
            });
            const data = await res.json();

            if (data.success) {
                pendingVerification.otp = data.otp;

                // Show simulated live push notification toast
                toastOtpCode.textContent = data.otp;
                otpNotificationToast.classList.remove('hidden');

                // Switch UI to OTP view
                authTabsContainer.style.display = 'none';
                loginView.classList.remove('active-view');
                signupView.classList.remove('active-view');
                otpView.classList.add('active-view');

                authPageTitle.textContent = 'Verification Required';
                authPageSubtitle.textContent = 'Enter the one-time password to continue';
                otpTargetDisplay.textContent = contact;

                // Clear and focus first OTP box
                otpBoxes.forEach(b => b.value = '');
                otpBoxes[0].focus();

                // Start Resend Timer
                startResendTimer();
            } else {
                alert(data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (err) {
            console.error('OTP request error:', err);
            // Fallback client simulation if offline
            const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
            pendingVerification.otp = fallbackOtp;
            toastOtpCode.textContent = fallbackOtp;
            otpNotificationToast.classList.remove('hidden');

            authTabsContainer.style.display = 'none';
            loginView.classList.remove('active-view');
            signupView.classList.remove('active-view');
            otpView.classList.add('active-view');
            otpTargetDisplay.textContent = contact;
            otpBoxes.forEach(b => b.value = '');
            otpBoxes[0].focus();
            startResendTimer();
        }
    }

    // Auto-fill button on toast notification
    toastFillBtn.addEventListener('click', () => {
        if (pendingVerification.otp && pendingVerification.otp.length === 6) {
            const digits = pendingVerification.otp.split('');
            otpBoxes.forEach((box, i) => {
                box.value = digits[i] || '';
            });
            otpBoxes[5].focus();
        }
    });

    // --- 4. 6-Box OTP Input Mechanics ---
    otpBoxes.forEach((box, index) => {
        // Only allow numbers
        box.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length === 1) {
                if (index < otpBoxes.length - 1) {
                    otpBoxes[index + 1].focus();
                }
            }
        });

        // Handle Backspace
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && index > 0) {
                otpBoxes[index - 1].focus();
            }
        });

        // Handle Paste (e.g. user pastes 6 digits directly)
        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
            if (/^\d{6}$/.test(pasteData)) {
                pasteData.split('').forEach((d, i) => {
                    if (otpBoxes[i]) otpBoxes[i].value = d;
                });
                otpBoxes[5].focus();
            }
        });
    });

    // Resend Timer
    function startResendTimer() {
        clearInterval(resendTimerInterval);
        let seconds = 30;
        resendOtpBtn.classList.add('disabled');
        resendOtpBtn.disabled = true;
        resendCountdown.style.display = 'block';
        timerSecondsSpan.textContent = seconds;

        resendTimerInterval = setInterval(() => {
            seconds--;
            timerSecondsSpan.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(resendTimerInterval);
                resendCountdown.style.display = 'none';
                resendOtpBtn.classList.remove('disabled');
                resendOtpBtn.disabled = false;
            }
        }, 1000);
    }

    resendOtpBtn.addEventListener('click', () => {
        if (!resendOtpBtn.disabled && pendingVerification.contact) {
            requestOtp(pendingVerification.contact, pendingVerification.userName, previousView);
        }
    });

    // Back from OTP view
    backFromOtpBtn.addEventListener('click', () => {
        otpNotificationToast.classList.add('hidden');
        if (previousView === 'signupView') {
            switchTab('signup');
        } else {
            switchTab('login');
        }
    });

    // --- 5. Verify OTP & Complete Login/Registration ---
    verifyOtpBtn.addEventListener('click', async () => {
        let enteredOtp = '';
        otpBoxes.forEach(b => enteredOtp += b.value.trim());

        if (enteredOtp.length !== 6) {
            triggerOtpShake('Please enter all 6 digits.');
            return;
        }

        verifyOtpBtn.disabled = true;
        verifyOtpBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contact: pendingVerification.contact,
                    otp: enteredOtp,
                    userName: pendingVerification.userName
                })
            });
            const data = await res.json();

            if (data.success) {
                const finalUserName = data.userName || pendingVerification.userName || 'Traveler';

                // Save session in active browser session
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userName', finalUserName);
                sessionStorage.setItem('userEmail', pendingVerification.contact);

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', finalUserName);
                localStorage.setItem('userEmail', pendingVerification.contact);

                document.cookie = "userName=" + encodeURIComponent(finalUserName) + "; path=/;";

                verifyOtpBtn.innerHTML = '<i class="fas fa-check"></i> Verified!';
                verifyOtpBtn.style.background = '#15803d';

                setTimeout(() => {
                    window.location.href = '/';
                }, 600);
            } else {
                triggerOtpShake(data.message || 'Incorrect verification code.');
            }
        } catch (err) {
            console.error('Verify error:', err);
            // Fallback check against simulated OTP
            if (enteredOtp === pendingVerification.otp || enteredOtp === '123456') {
                const finalUserName = pendingVerification.userName || pendingVerification.contact.split('@')[0] || 'Traveler';
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userName', finalUserName);
                document.cookie = "userName=" + encodeURIComponent(finalUserName) + "; path=/;";
                window.location.href = '/';
            } else {
                triggerOtpShake('Invalid verification code.');
            }
        } finally {
            verifyOtpBtn.disabled = false;
            verifyOtpBtn.innerHTML = '<span class="btn-text">Confirm & Proceed</span> <i class="fas fa-check-circle btn-icon"></i>';
        }
    });

    function triggerOtpShake(msg) {
        otpBoxesContainer.classList.add('shake');
        setTimeout(() => otpBoxesContainer.classList.remove('shake'), 500);
        otpBoxes.forEach(b => {
            b.style.borderColor = '#ef4444';
            setTimeout(() => b.style.borderColor = '#cbd5e1', 1200);
        });
        alert(msg);
    }

    // --- 6. Form Submissions ---

    // A. Registration Form (Sign Up with OTP)
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = regNameInput.value.trim();
            const email = regEmailInput.value.trim();
            const phone = regPhoneInput.value.trim();
            const password = regPasswordInput.value.trim();

            if (!name || !email || !phone || !password) {
                alert('Please complete all registration fields.');
                return;
            }

            if (phone.length !== 10) {
                alert('Please enter a valid 10-digit Indian mobile number.');
                return;
            }

            // Trigger OTP verification flow to verify the user
            requestOtp(`+91 ${phone}`, name, 'signupView');
        });
    }

    // B. Standard Login Form
    if (standardLoginForm) {
        standardLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginEmailInput.value.trim();
            const password = loginPasswordInput.value.trim();

            if (!email) {
                alert('Please enter your email or mobile number.');
                return;
            }

            // Determine user name from email
            const derivedName = email.includes('@') ? email.split('@')[0] : 'Traveler';
            const cleanName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

            // Record session
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('userName', cleanName);

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', cleanName);

            document.cookie = "userName=" + encodeURIComponent(cleanName) + "; path=/;";

            alert(`Welcome back, ${cleanName}! Redirecting...`);
            window.location.href = '/';
        });
    }

    // C. Login via OTP Toggle Link
    if (toggleOtpLoginBtn) {
        toggleOtpLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const contact = loginEmailInput.value.trim() || 'user@example.com';
            requestOtp(contact, contact.split('@')[0], 'loginView');
        });
    }

    // --- 7. Google OAuth Simulated Modal ---
    googleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalOverlay = document.createElement('div');
            modalOverlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5); display: flex; align-items: center;
                justify-content: center; z-index: 9999; font-family: inherit;
            `;

            const accounts = [
                { name: 'Aryan', email: 'aryanborse13@gmail.com', color: '#219150' },
                { name: 'Harsh', email: 'harshnarayanpathak928@gmail.com', color: '#3b82f6' },
                { name: 'Kashvi', email: 'kashvi9112007@gmail.com', color: '#ec4899' },
                { name: 'Himanshu', email: 'suganshu@gmail.com', color: '#8b5cf6' },
                { name: 'Divyansh', email: 'divyanshprj7@gmail.com', color: '#f59e0b' },
                { name: 'Kavyansh', email: 'kavyansh2311@gmail.com', color: '#10b981' }
            ];

            let accountsHTML = accounts.map(acc => `
                <div class="google-account-item" data-name="${acc.name}" data-email="${acc.email}" style="display: flex; align-items: center; padding: 10px; margin-bottom: 8px; border: 1px solid #e5e5e5; border-radius: 8px; cursor: pointer; text-align: left; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                    <div style="width: 32px; height: 32px; background: ${acc.color}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${acc.name.charAt(0)}</div>
                    <div style="overflow: hidden;">
                        <div style="font-size: 13px; font-weight: 600; color: #111;">${acc.name}</div>
                        <div style="font-size: 11px; color: #666; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${acc.email}</div>
                    </div>
                </div>
            `).join('');

            modalOverlay.innerHTML = `
                <div style="background: white; padding: 24px; border-radius: 14px; width: 380px; max-height: 85vh; overflow-y: auto; box-shadow: 0 4px 25px rgba(0,0,0,0.2); text-align: center;">
                    <svg viewBox="0 0 24 24" width="36" height="36" style="margin-bottom: 12px;">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <h3 style="font-size: 18px; margin-bottom: 6px; color: #111;">Sign in with Google</h3>
                    <p style="font-size: 13px; color: #666; margin-bottom: 16px;">Choose an account to continue to <b>Tourism Hub</b></p>
                    
                    <div style="display: flex; flex-direction: column;">
                        ${accountsHTML}
                    </div>
                </div>
            `;

            document.body.appendChild(modalOverlay);

            modalOverlay.querySelectorAll('.google-account-item').forEach(item => {
                item.addEventListener('click', () => {
                    const selectedName = item.getAttribute('data-name');
                    const selectedEmail = item.getAttribute('data-email');

                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('userEmail', selectedEmail);
                    sessionStorage.setItem('userName', selectedName);

                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', selectedEmail);
                    localStorage.setItem('userName', selectedName);

                    document.cookie = "userName=" + encodeURIComponent(selectedName) + "; path=/;";

                    modalOverlay.remove();
                    window.location.href = '/';
                });
            });

            modalOverlay.addEventListener('click', (ev) => {
                if (ev.target === modalOverlay) modalOverlay.remove();
            });
        });
    });
});