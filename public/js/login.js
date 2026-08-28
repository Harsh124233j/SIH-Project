document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const googleBtn = document.querySelector('.google-btn');

    // 1. Handle standard email/password Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                alert('Please fill in both email and password fields.');
                return;
            }

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', email.split('@')[0]);

            // Set cookie so Express can read it
            document.cookie = "userName=" + encodeURIComponent(email.split('@')[0]) + "; path=/;";

            alert('Login successful! Redirecting to Tourism Hub...');
            window.location.href = '/';
        });
    }

    // 2. Simulated Google OAuth API Popup with Multiple Accounts List
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            const modalOverlay = document.createElement('div');
            modalOverlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5); display: flex; align-items: center;
                justify-content: center; z-index: 9999; font-family: inherit;
            `;

            // List of accounts from your screenshot
            const accounts = [
                { name: 'Aryan ', email: 'aryanborse13@gmail.com', color: '#219150' },
                { name: 'Harsh', email: 'harshnarayanpathak928@gmail.com', color: '#3b82f6' },
                { name: 'Kashvi ', email: 'kashvi9112007@gmail.com', color: '#ec4899' },
                { name: 'Himanshu', email: 'suganshu@gmail.com', color: '#8b5cf6' },
                { name: 'Divyansh', email: 'divyanshprj7@gmail.com', color: '#f59e0b' },
                { name: 'Kavyansh ', email: 'kavyansh2311@gmail.com', color: '#10b981' }
            ];

            let accountsHTML = accounts.map(acc => `
                <div class="google-account-item" data-name="${acc.name}" data-email="${acc.email}" style="display: flex; align-items: center; padding: 10px; margin-bottom: 8px; border: 1px solid #e5e5e5; border-radius: 8px; cursor: pointer; text-align: left; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                    <div style="width: 32px; height: 32px; background: ${acc.color}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${acc.name.charAt(0)}</div>
                    <div style="overflow: hidden;">
                        <div style="font-size: 13px; font-weight: 500; color: #111;">${acc.name}</div>
                        <div style="font-size: 11px; color: #666; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${acc.email}</div>
                    </div>
                </div>
            `).join('');

            modalOverlay.innerHTML = `
                <div style="background: white; padding: 24px; border-radius: 12px; width: 380px; max-height: 85vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15); text-align: center;">
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

            // Add click event to each account selection row
            modalOverlay.querySelectorAll('.google-account-item').forEach(item => {
                item.addEventListener('click', () => {
                    const selectedName = item.getAttribute('data-name');
                    const selectedEmail = item.getAttribute('data-email');

                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', selectedEmail);
                    localStorage.setItem('userName', selectedName);

                    // Set cookie so Express can read it
                    document.cookie = "userName=" + encodeURIComponent(selectedName) + "; path=/;";

                    modalOverlay.remove();
                    window.location.href = '/';
                });
            });

            // Close modal if clicking outside the white box
            modalOverlay.addEventListener('click', (ev) => {
                if (ev.target === modalOverlay) {
                    modalOverlay.remove();
                }
            });
        });
    }
});