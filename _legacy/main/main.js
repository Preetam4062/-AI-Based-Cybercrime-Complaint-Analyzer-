// Global State
        const AppState = {
            isAuthenticated: false,
            currentTheme: 'dark',
            glassMode: false,
            activePage: 'page-analyze',
            cases: [
                { id: 'CY-2026-14892', type: 'Financial Fraud', severity: 'CRITICAL', status: 'Resolved', date: '2026-05-08', loss: 45000 },
                { id: 'CY-2026-14891', type: 'Phishing', severity: 'HIGH RISK', status: 'Under Review', date: '2026-05-08', loss: 0 },
                { id: 'CY-2026-14890', type: 'Account Hack', severity: 'HIGH RISK', status: 'Investigating', date: '2026-05-07', loss: 0 },
                { id: 'CY-2026-14889', type: 'Malware', severity: 'CRITICAL', status: 'Resolved', date: '2026-05-06', loss: 1200000 }
            ],
            chatHistory: [],
            wizardStep: 1,
            selectedCrimeType: 'Phishing',
            uploadedFiles: [],
            lastCaseId: null,
            stats: { today: 342, review: 89, resolved: 1204, accuracy: 98.4 }
        };

        // AI Mapping (mock threat intelligence)
        const AIMapping = {
            'Phishing': { score: 82, level: 'HIGH RISK', steps: ['Call 1930 immediately', 'Report on cybercrime.gov.in', 'Change bank PIN & passwords'] },
            'Account Hack': { score: 75, level: 'HIGH RISK', steps: ['Enable 2FA on all accounts', 'Logout all sessions', 'Monitor your email for alerts'] },
            'Financial Fraud': { score: 91, level: 'CRITICAL', steps: ['Call 1930 immediately', 'Freeze your bank account', 'Report to RBI Ombudsman'] },
            'Malware': { score: 88, level: 'CRITICAL', steps: ['Disconnect from internet now', 'Report to CERT-In (cert-in.org.in)', 'Do not pay any ransom'] },
            'Harassment': { score: 55, level: 'MEDIUM', steps: ['Block the contact immediately', 'Save all screenshots as evidence', 'Report to local cyber police'] },
            'Identity Theft': { score: 79, level: 'HIGH RISK', steps: ['Lock Aadhaar via UIDAI portal', 'Check CIBIL credit score', 'File FIR at nearest police station'] }
        };
    

        // Utils
        const $ = id => document.getElementById(id);
        const $$ = sel => document.querySelectorAll(sel);

        // Toast System
        function showToast(msg, type = 'info') {
            const container = $('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `<div style="font-weight:700; font-size:0.9rem;">${msg}</div><div class="toast-progress"></div>`;
            container.appendChild(toast);
            setTimeout(() => { toast.style.opacity = 0; setTimeout(() => toast.remove(), 300); }, 4000);
        }

        // Theming
        function toggleTheme() {
            AppState.currentTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', AppState.currentTheme);
            $('theme-toggle').innerHTML = AppState.currentTheme === 'dark' ? '<i class="ti ti-moon"></i>' : '<i class="ti ti-sun"></i>';
        }
        function toggleGlass() {
            AppState.glassMode = !AppState.glassMode;
            document.body.classList.toggle('glass-mode', AppState.glassMode);
            $('glass-toggle').style.color = AppState.glassMode ? 'var(--accent-primary)' : 'var(--text-muted)';
        }

        // Routing
        function switchPage(pageId) {
            $$('.page').forEach(p => p.classList.remove('active'));
            $$('.nav-pill, .nav-item').forEach(n => n.classList.remove('active'));
            $(pageId).classList.add('active');
            $$(`[data-target="${pageId}"]`).forEach(n => n.classList.add('active'));
            AppState.activePage = pageId;
            if (pageId === 'page-cases') renderCasesTable();
            if (pageId === 'page-insights') initCharts();
        }

        // Stats Animation
        function animateValue(obj, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                obj.innerHTML = Math.floor(progress * (end - start) + start) + (obj.dataset.suffix || '');
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        }

        // Render stats from AppState
        function renderGlobalStats() {
            const grid = $('global-stats');
            grid.innerHTML = `
                <div class="stat-card accent-primary"><div class="stat-label">Cases Today</div><div class="stat-value counter" data-val="${AppState.stats.today}">0</div></div>
                <div class="stat-card accent-warning"><div class="stat-label">Under Review</div><div class="stat-value counter" data-val="${AppState.stats.review}">0</div></div>
                <div class="stat-card accent-info"><div class="stat-label">Resolved</div><div class="stat-value counter" data-val="${AppState.stats.resolved}">0</div></div>
                <div class="stat-card accent-secondary"><div class="stat-label">AI Accuracy</div><div class="stat-value counter" data-val="${AppState.stats.accuracy}" data-suffix="%">0%</div></div>
            `;
            $$('.counter').forEach(el => animateValue(el, 0, parseFloat(el.dataset.val), 1500));
        }
    

        // Global UI events
        $('theme-toggle').addEventListener('click', toggleTheme);
        $('glass-toggle').addEventListener('click', toggleGlass);
        $$('.nav-pill, .nav-item').forEach(el => {
            el.addEventListener('click', () => switchPage(el.dataset.target));
        });

        // Scroll to top
        window.addEventListener('scroll', () => {
            $('scroll-top').classList.toggle('visible', window.scrollY > 300);
        });
        $('scroll-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Accordion
        $$('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                item.classList.toggle('active');
            });
        });

        // Map Tooltips
        $$('.map-hotspot').forEach(spot => {
            spot.addEventListener('mouseenter', e => {
                const tooltip = $('map-tooltip');
                tooltip.textContent = `${spot.dataset.city}: ${spot.dataset.cases} Cases`;
                tooltip.style.opacity = 1;
                tooltip.style.left = (e.pageX + 15) + 'px';
                tooltip.style.top = (e.pageY + 15) + 'px';
            });
            spot.addEventListener('mouseleave', () => { $('map-tooltip').style.opacity = 0; });
        });

        // Haptics (simulated/real if supported)
        function triggerHaptic(pattern = 50) {
            if (navigator.vibrate) navigator.vibrate(pattern);
        }

        // Auth Logic
        window.toggleAuthForm = function (formType) {
            $('login-form').style.display = 'none';
            $('signup-form').style.display = 'none';
            $('forgot-form').style.display = 'none';

            $('tab-login').style.borderColor = 'var(--border)';
            $('tab-login').style.color = 'var(--text-main)';
            $('tab-signup').style.borderColor = 'var(--border)';
            $('tab-signup').style.color = 'var(--text-main)';
            $('tab-forgot').style.borderColor = 'var(--border)';
            $('tab-forgot').style.color = 'var(--text-main)';

            const activeForm = $(`${formType}-form`);
            const activeTab = $(`tab-${formType}`);

            activeForm.style.display = 'block';
            activeTab.style.borderColor = 'var(--accent-primary)';
            activeTab.style.color = 'var(--accent-primary)';

            // Animation effect
            activeForm.style.opacity = 0;
            activeForm.style.transform = 'translateY(10px)';
            activeForm.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                activeForm.style.opacity = 1;
                activeForm.style.transform = 'translateY(0)';
            }, 10);
        };

        function login(e) {
            e.preventDefault();
            const btn = $('login-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ti ti-loader ti-spin"></i> Authenticating...';
            btn.disabled = true;
            setTimeout(() => {
                AppState.isAuthenticated = true;
                AppState.stats = { today: 342, review: 89, resolved: 1204, accuracy: 98.4 };
                document.body.classList.remove('layout-login');
                $('logout-btn').style.display = 'inline-flex';
                btn.innerHTML = originalText;
                btn.disabled = false;
                switchPage('page-analyze');
                renderGlobalStats();
                $$('.stat-card').forEach((card, i) => {
                    card.style.opacity = 0;
                    card.style.animation = `slideUp 0.5s ease ${i * 0.1}s forwards`;
                });
                showToast('Authentication successful. Welcome, Agent.', 'success');
                triggerHaptic([100, 50, 100]);
            }, 1200);
        }

        function signup(e) {
            e.preventDefault();
            const btn = $('signup-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ti ti-loader ti-spin"></i> Registering...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                toggleAuthForm('login');
                showToast('Registration successful! Please sign in.', 'success');
                $('login-email').value = $('signup-email').value;
                $('login-pwd').value = $('signup-pwd').value;
            }, 1500);
        }

        function forgotPassword(e) {
            e.preventDefault();
            const btn = $('forgot-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ti ti-loader ti-spin"></i> Sending...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                toggleAuthForm('login');
                showToast('Password reset link sent to your email.', 'info');
            }, 1500);
        }

        function logout() {
            AppState.isAuthenticated = false;
            document.body.classList.add('layout-login');
            $('logout-btn').style.display = 'none';
            toggleAuthForm('login');
            switchPage('page-login');
            showToast('Securely logged out.', 'info');
        }

        $('login-form').addEventListener('submit', login);
        $('signup-form').addEventListener('submit', signup);
        $('forgot-form').addEventListener('submit', forgotPassword);
        $('logout-btn').addEventListener('click', logout);
    

        // Wizard Logic
        function updateWizardUI() {
            $$('.wizard-step').forEach((el, i) => {
                el.classList.toggle('active', i + 1 === AppState.wizardStep);
            });
            $$('.step-indicator').forEach((el, i) => {
                el.classList.toggle('active', i + 1 === AppState.wizardStep);
                el.classList.toggle('completed', i + 1 < AppState.wizardStep);
            });
            $('wizard-bar').style.width = ((AppState.wizardStep - 1) / 3) * 100 + '%';
            $('prev-btn').style.display = AppState.wizardStep === 1 ? 'none' : 'inline-flex';
            $('next-btn').style.display = AppState.wizardStep === 4 ? 'none' : 'inline-flex';
            $('submit-btn').style.display = AppState.wizardStep === 4 ? 'inline-flex' : 'none';
        }

        $('next-btn').addEventListener('click', () => {
            if (validateStep(AppState.wizardStep)) {
                AppState.wizardStep++;
                updateWizardUI();
                if (AppState.wizardStep === 4) generateReview();
            } else {
                triggerHaptic([50, 50, 50]);
                const stepEl = $(`step-${AppState.wizardStep}`);
                stepEl.classList.add('shake');
                setTimeout(() => stepEl.classList.remove('shake'), 400);
            }
        });

        $('prev-btn').addEventListener('click', () => {
            AppState.wizardStep--;
            updateWizardUI();
        });

        // Validation
        function validateStep(step) {
            let isValid = true;
            if (step === 1) {
                // Crime chips always have one selected
            } else if (step === 2) {
                const isAnon = $('anon-toggle').checked;
                if (!isAnon) {
                    if (!$('fullName').value) { $('fullName').parentElement.classList.add('has-error'); isValid = false; } else { $('fullName').parentElement.classList.remove('has-error'); }
                    if (!$('email').value || !$('email').checkValidity()) { $('email').parentElement.classList.add('has-error'); isValid = false; } else { $('email').parentElement.classList.remove('has-error'); }
                }
                if (!$('platform').value) { $('platform').parentElement.classList.add('has-error'); isValid = false; } else { $('platform').parentElement.classList.remove('has-error'); }
                if ($('description').value.length < 50) { $('description').parentElement.classList.add('has-error'); isValid = false; } else { $('description').parentElement.classList.remove('has-error'); }
            }
            return isValid;
        }

        // Crime Chips
        $$('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                $$('.chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                AppState.selectedCrimeType = chip.dataset.type;
                updatePredictiveText();
            });
        });

        // Character Counter
        $('description').addEventListener('input', (e) => {
            const len = e.target.value.length;
            const counter = $('desc-counter');
            counter.textContent = `${len} / 500`;
            counter.className = 'char-counter ' + (len > 400 ? 'amber' : (len >= 500 ? 'red' : ''));
            if (len >= 50) $('description').parentElement.classList.remove('has-error');
        });

        // Anonymous Toggle
        $('anon-toggle').addEventListener('change', (e) => {
            $('personal-info').style.display = e.target.checked ? 'none' : 'grid';
            if (e.target.checked) {
                $('fullName').value = '';
                $('email').value = '';
            }
        });

        // Predictive Text
        function updatePredictiveText() {
            const hints = {
                'Phishing': "Tip: Mention the exact email or SMS sender details and the fake link.",
                'Account Hack': "Tip: Mention when you lost access and if 2FA was enabled.",
                'Financial Fraud': "Tip: Include the exact transaction amount, date, and destination account.",
                'Malware': "Tip: Note any ransom demands or strange file extensions.",
                'Harassment': "Tip: Mention the platform and frequency of messages.",
                'Identity Theft': "Tip: List what documents were compromised."
            };
            $('predictive-text').textContent = hints[AppState.selectedCrimeType] || '';
        }
        updatePredictiveText();

        // Voice Input (Web Speech API)
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            $('voice-btn').addEventListener('click', () => {
                $('voice-btn').style.color = 'var(--danger)';
                showToast('Listening...', 'info');
                recognition.start();
            });
            recognition.onresult = (e) => {
                const text = e.results[0][0].transcript;
                $('description').value += ($('description').value ? ' ' : '') + text;
                $('description').dispatchEvent(new Event('input'));
            };
            recognition.onend = () => {
                $('voice-btn').style.color = '';
            };
        } else {
            $('voice-btn').style.display = 'none';
        }

        // File Upload
        const dropzone = $('dropzone');
        const fileInput = $('file-input');
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault(); dropzone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', () => handleFiles(fileInput.files));

        function handleFiles(files) {
            Array.from(files).forEach(file => {
                if (AppState.uploadedFiles.length >= 5) return showToast('Max 5 files allowed', 'error');
                if (file.size > 10 * 1024 * 1024) return showToast('File too large (Max 10MB)', 'error');
                AppState.uploadedFiles.push(file);
            });
            renderFileList();
        }

        function renderFileList() {
            $('file-list').innerHTML = AppState.uploadedFiles.map((file, idx) => `
                <div class="file-item">
                    <span><i class="ti ti-file"></i> ${file.name}</span>
                    <button type="button" class="icon-btn" style="width:24px; height:24px; border:none;" onclick="removeFile(${idx})"><i class="ti ti-x"></i></button>
                </div>
            `).join('');
        }
        window.removeFile = (idx) => { AppState.uploadedFiles.splice(idx, 1); renderFileList(); };

        // Review Step
        function generateReview() {
            const isAnon = $('anon-toggle').checked;
            $('review-content').innerHTML = `
                <strong>Crime Type:</strong> ${AppState.selectedCrimeType}<br>
                <strong>Reporter:</strong> ${isAnon ? 'Anonymous' : $('fullName').value}<br>
                <strong>Platform:</strong> ${$('platform').value}<br>
                <strong>Loss:</strong> ₹${$('loss').value || '0'}<br>
                <strong>Description:</strong> ${$('description').value}<br>
                <strong>Evidence:</strong> ${AppState.uploadedFiles.length} file(s) attached
            `;
        }

        // Submission
        $('complaint-form').addEventListener('submit', (e) => {
            e.preventDefault();
            if (!$('consent').checked) {
                $('consent-error').style.display = 'block';
                return;
            }
            $('consent-error').style.display = 'none';
            analyzeComplaint();
        });

        // Typewriter Effect
        function typeWriter(element, texts, cb) {
            let i = 0, j = 0;
            element.innerHTML = '';
            function type() {
                if (j < texts[i].length) {
                    element.innerHTML += texts[i].charAt(j);
                    j++;
                    setTimeout(type, 30);
                } else {
                    setTimeout(() => {
                        element.innerHTML = '';
                        j = 0;
                        i++;
                        if (i < texts.length) type();
                        else if (cb) cb();
                    }, 800);
                }
            }
            type();
        }

        function analyzeComplaint() {
            $('submit-btn').disabled = true;
            $('status-badge').className = 'badge yellow';
            $('status-badge').textContent = 'ANALYZING';
            $('state-default').style.display = 'none';
            $('state-result').style.display = 'none';
            $('state-loading').style.display = 'flex';

            const messages = [
                "Analyzing complaint patterns...",
                "Cross-referencing 2.4M case database...",
                "Identifying threat vectors..."
            ];

            typeWriter($('loading-typewriter'), messages, () => {
                const mock = AIMapping[AppState.selectedCrimeType];
                const caseId = 'CY-2026-' + Math.floor(10000 + Math.random() * 90000);
                AppState.lastCaseId = caseId;
                AppState.cases.unshift({
                    id: caseId, type: AppState.selectedCrimeType,
                    severity: mock.level, status: 'Under Review',
                    date: new Date().toISOString().split('T')[0],
                    loss: $('loss').value || 0
                });
                AppState.stats.today++;
                AppState.stats.review++;
                showResult({ caseId, level: mock.level, score: mock.score, steps: mock.steps });
                renderGlobalStats();
                triggerHaptic([100, 50, 100]);
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#63c740', '#1d9e75', '#ffffff'], disableForReducedMotion: true });
                showToast('Complaint analyzed successfully!', 'success');
            });
        }

        function showResult(data) {
            const level = data.level || 'MEDIUM';
            const score = data.score || 50;
            const steps = data.steps || [];
            const caseId = data.caseId || AppState.lastCaseId || 'CY-UNKNOWN';
            const clr = level === 'CRITICAL' ? 'var(--danger)' : (level.includes('HIGH') ? 'var(--warning)' : 'var(--accent-primary)');
            const badgeCls = level === 'CRITICAL' ? 'badge red' : (level.includes('HIGH') ? 'badge yellow' : 'badge green');

            $('state-loading').style.display = 'none';
            $('state-result').style.display = 'block';
            $('state-result').innerHTML = `
                <div style="margin-bottom:1.5rem;">
                    <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem;">THREAT ASSESSMENT${data.fromApi ? ' — AI VERIFIED ✓' : ''}</div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                        <div style="font-size:1.5rem;font-weight:800;color:${clr}">${level}</div>
                        <div style="font-family:var(--font-mono);font-size:1.25rem;font-weight:700;">${score}/100</div>
                    </div>
                    <div style="height:8px;background:rgba(255,255,255,0.05);border-radius:4px;margin:0.5rem 0;position:relative;overflow:hidden;">
                        <div style="height:100%;width:0%;border-radius:4px;transition:width 1s ease;background:${clr}" id="threat-meter"></div>
                    </div>
                </div>
                <div style="margin-bottom:1.5rem;">
                    <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem;">RECOMMENDED ACTIONS</div>
                    <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:0.5rem;font-size:0.9rem;">
                        ${steps.map((s, i) => `<li style="display:flex;gap:8px;"><div style="width:20px;height:20px;border-radius:50%;background:rgba(99,199,64,0.15);color:var(--accent-primary);display:flex;align-items:center;justify-content:center;font-size:0.7rem;flex-shrink:0;">${i + 1}</div>${s}</li>`).join('')}
                    </ul>
                </div>
                <div style="border-top:1px solid rgba(255,255,255,0.05);padding-top:1rem;">
                    <div style="font-size:1.2rem;font-weight:800;color:var(--accent-primary);">Case ID: ${caseId}</div>
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.5rem;">Track this ID in the Tracker page.</p>
                </div>
            `;
            setTimeout(() => { const m = $('threat-meter'); if (m) m.style.width = score + '%'; }, 100);
            $('status-badge').className = badgeCls;
            $('status-badge').textContent = 'COMPLETE';
            $('submit-btn').innerHTML = '<i class="ti ti-check"></i> Submitted';
        }
    

        // Tracker Logic
        $('track-btn').addEventListener('click', () => {
            const id = $('track-id').value.trim();
            if (!id) return showToast('Please enter a Case ID', 'error');
            const c = AppState.cases.find(x => x.id === id);
            if (!c) return showToast('Case not found. Submit a complaint first.', 'error');

            $('track-result-id').textContent = `Status for ${c.id}`;
            $('tl-date-1').textContent = c.date;
            const steps = $$('.timeline-step');
            steps.forEach(s => s.classList.remove('completed', 'current'));
            steps[0].classList.add('completed');
            const st = (c.status || '').toLowerCase();
            if (st.includes('review')) { steps[1].classList.add('current'); }
            else if (st.includes('invest')) { steps[1].classList.add('completed'); steps[2].classList.add('current'); }
            else if (st.includes('resolv')) { steps[1].classList.add('completed'); steps[2].classList.add('completed'); steps[3].classList.add('completed'); }
            $('tracker-result').style.display = 'block';
        });

        // \u2500\u2500 Case Files Table \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
        let sortCol = 'date', sortAsc = false;

        async function loadCases() {
            if (!AppState.apiOnline) return renderCasesTable();
            try {
                const res = await API.get('/complaints?limit=50&sortBy=createdAt&sortOrder=desc');
                const items = res.data?.complaints || res.data?.items || res.data || [];
                AppState.cases = items.map(d => ({
                    id: d.caseId || d.id,
                    type: d.crimeType ? (Object.keys(CRIME_TYPE_MAP).find(k => CRIME_TYPE_MAP[k] === d.crimeType) || d.crimeType) : 'Unknown',
                    severity: d.riskLevel || d.priority || 'MEDIUM',
                    status: d.status || 'Under Review',
                    date: d.createdAt ? d.createdAt.split('T')[0] : '-',
                    loss: d.financialLoss || 0
                }));
            } catch (e) { /* use local */ }
            renderCasesTable();
        }

        function renderCasesTable() {
            const search = $('case-search').value.toLowerCase();
            const fType = $('case-filter-type').value;
            const fStatus = $('case-filter-status').value;
            let filtered = AppState.cases.filter(c => {
                const matchSearch = (c.id + c.type).toLowerCase().includes(search);
                return matchSearch && (fType ? c.type === fType : true) && (fStatus ? c.status === fStatus : true);
            });
            filtered.sort((a, b) => {
                let va = a[sortCol], vb = b[sortCol];
                if (sortCol === 'loss') { va = Number(va); vb = Number(vb); }
                return sortAsc ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
            });
            $('cases-tbody').innerHTML = filtered.length ? filtered.map(c => `
                <tr>
                    <td style="font-family:var(--font-mono);color:var(--accent-primary);">${c.id}</td>
                    <td>${c.type}</td>
                    <td><span class="badge ${c.severity === 'CRITICAL' ? 'red' : (c.severity.includes('HIGH') ? 'yellow' : 'blue')}">${c.severity}</span></td>
                    <td>${c.status}</td>
                    <td>${c.date}</td>
                    <td>₹${Number(c.loss || 0).toLocaleString('en-IN')}</td>
                    <td><button class="icon-btn" style="width:28px;height:28px;"><i class="ti ti-eye"></i></button></td>
                </tr>`).join('') :
                '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem;">No cases found</td></tr>';
        }

        $('case-search').addEventListener('input', renderCasesTable);
        $('case-filter-type').addEventListener('change', renderCasesTable);
        $('case-filter-status').addEventListener('change', renderCasesTable);
        $$('th[data-sort]').forEach(th => th.addEventListener('click', () => {
            const col = th.dataset.sort;
            sortAsc = sortCol === col ? !sortAsc : true;
            sortCol = col;
            renderCasesTable();
        }));

        // Export CSV
        $('export-csv-btn').addEventListener('click', () => {
            const csv = Papa.unparse(AppState.cases);
            const a = Object.assign(document.createElement('a'), {
                href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
                download: 'cybersense_cases.csv'
            });
            a.click();
            showToast('Export downloaded successfully', 'success');
        });

        // \u2500\u2500 Insights Charts \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
        let lineChartInstance = null, donutChartInstance = null;

        async function initCharts() {
            Chart.defaults.color = '#7a7f99';
            Chart.defaults.font.family = "'Syne', sans-serif";

            // Fetch daily data from API
            let dailyLabels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
            let dailyData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 10);
            let donutData = [1204, 89, 45];

            if (AppState.apiOnline) {
                try {
                    const [dRes, oRes] = await Promise.all([
                        API.get('/analytics/daily?days=30'),
                        API.get('/analytics/overview')
                    ]);
                    if (dRes.data?.length) {
                        dailyLabels = dRes.data.map(d => d.date || d.label);
                        dailyData = dRes.data.map(d => d.count || d.total || 0);
                    }
                    const o = oRes.data || {};
                    donutData = [o.resolved || 0, o.underReview || 0, o.investigating || 0];
                } catch (e) { /* use fallback data */ }
            }

            if (lineChartInstance) { lineChartInstance.destroy(); lineChartInstance = null; }
            if (donutChartInstance) { donutChartInstance.destroy(); donutChartInstance = null; }

            lineChartInstance = new Chart($('lineChart').getContext('2d'), {
                type: 'line',
                data: {
                    labels: dailyLabels,
                    datasets: [{ label: 'Complaints', data: dailyData, borderColor: '#63c740', backgroundColor: 'rgba(99,199,64,0.1)', tension: 0.4, fill: true }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }
            });

            donutChartInstance = new Chart($('donutChart').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Resolved', 'Under Review', 'Investigating'],
                    datasets: [{ data: donutData, backgroundColor: ['#63c740', '#EF9F27', '#378ADD'], borderWidth: 0 }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom' } } }
            
        

                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }
            });
        }
    

        // Chat UI
        const chatSidebar = $('chat-sidebar');
        chatSidebar.innerHTML = `
            <div class="chat-header">
                <div style="font-weight:800; display:flex; align-items:center; gap:8px;"><i class="ti ti-messages"></i> Assistant</div>
                <button class="icon-btn" id="close-chat" style="border:none;"><i class="ti ti-x"></i></button>
            </div>
            <div class="chat-messages" id="chat-msgs"></div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Ask about your case..." style="flex:1;">
                <button class="btn" id="chat-send" style="width:auto; padding:0 16px;"><i class="ti ti-send"></i></button>
            </div>
        `;
        $('close-chat').addEventListener('click', () => { chatSidebar.classList.remove('open'); });
        const chatMsgs = $('chat-msgs');
        const chatInput = $('chat-input');
        const chatSend = $('chat-send');
        function appendMsg(sender, text) {
            const div = document.createElement('div');
            div.className = `msg ${sender}`;
            div.textContent = text;
            chatMsgs.appendChild(div);
            chatMsgs.scrollTop = chatMsgs.scrollHeight;
        }
        async function sendChat() {
            const txt = chatInput.value.trim();
            if (!txt) return;
            appendMsg('user', txt);
            chatInput.value = '';
            if (AppState.apiOnline && AppState.lastCaseId) {
                const aiDiv = document.createElement('div');
                aiDiv.className = 'msg ai';
                aiDiv.textContent = '...';
                chatMsgs.appendChild(aiDiv);
                try {
                    const res = await API.post(`/ai/chat`, {
                        message: txt,
                        caseId: AppState.lastCaseId,
                        history: AppState.chatHistory.slice(-6)
                    });
                    const reply = res.data?.reply || res.data?.message || 'No response.';
                    AppState.chatHistory.push({ role: 'user', content: txt }, { role: 'assistant', content: reply });
                    aiDiv.textContent = '';
                    typeWriter(aiDiv, [reply]);
                } catch (e) {
                    aiDiv.textContent = 'Sorry, AI assistant is unavailable. Call 1930 for emergencies.';
                }
            } else {
                setTimeout(() => {
                    const aiDiv = document.createElement('div');
                    aiDiv.className = 'msg ai';
                    chatMsgs.appendChild(aiDiv);
                    typeWriter(aiDiv, [`Based on your ${AppState.selectedCrimeType} case, I recommend calling 1930 immediately.`]);
                }, 500);
            }
        }
        chatSend.addEventListener('click', sendChat);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChat(); });
        window.openChat = () => {
            chatSidebar.classList.add('open');
            if (chatMsgs.children.length === 0) appendMsg('ai', `Hello! I'm CyberSense Assistant. How can I help with your ${AppState.selectedCrimeType} case?`);
        };
    

        window.addEventListener('DOMContentLoaded', async () => {
            // PTR indicator style
            const ptr = $('ptr-indicator');
            ptr.style.cssText = 'position:fixed;top:-50px;left:50%;transform:translateX(-50%);background:var(--surface);border:1px solid var(--border);padding:8px 16px;border-radius:20px;z-index:1000;display:flex;align-items:center;gap:8px;font-size:0.8rem;font-weight:700;transition:top 0.3s;box-shadow:0 4px 12px rgba(0,0,0,0.3);';

            // Loader
            setTimeout(() => {
                $('initial-loader').style.opacity = 0;
                setTimeout(() => $('initial-loader').remove(), 500);
                if (!AppState.isAuthenticated) {
                    document.body.classList.add('layout-login');
                    switchPage('page-login');
                } else {
                    $$('.stat-card').forEach((card, i) => {
                        card.style.opacity = 0;
                        card.style.animation = `slideUp 0.5s ease ${i * 0.1}s forwards`;
                    });
                    renderGlobalStats();
                }
            }, 800);

            // Scroll to top
            window.addEventListener('scroll', () => {
                $('scroll-top').classList.toggle('visible', window.scrollY > 300);
            });
            $('scroll-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter' && AppState.activePage === 'page-analyze') $('submit-btn').click();
                if (e.key === 'Escape') chatSidebar.classList.remove('open');
            });

            // Pull-to-refresh (mobile)
            let startY = 0;
            document.addEventListener('touchstart', e => startY = e.touches[0].clientY);
            document.addEventListener('touchend', e => {
                if (window.scrollY === 0 && e.changedTouches[0].clientY - startY > 100) {
                    ptr.style.top = '20px';
                    setTimeout(() => {
                        AppState.stats.today += Math.floor(Math.random() * 3) + 1;
                        renderGlobalStats();
                        triggerHaptic([50, 50]);
                        ptr.style.top = '-50px';
                        showToast('Stats updated', 'success');
                    }, 1000);
                }
            });

            // Live stat tick (every 30s)
            setInterval(() => {
                if (AppState.isAuthenticated && Math.random() > 0.6) {
                    AppState.stats.today++;
                    if (AppState.activePage === 'page-analyze') renderGlobalStats();
                }
            }, 30000);

            // Intercept showResult to add chat button
            const origShowResult = showResult;
            showResult = (data) => {
                origShowResult(data);
                $('state-result').innerHTML += `
                    <button class="btn btn-outline" style="margin-top:1rem;width:100%;border-color:var(--accent-primary);color:var(--accent-primary);" onclick="openChat()">
                        <i class="ti ti-messages"></i> Ask Follow-up Questions
                    </button>
                `;
            };
        });

window.logout = function() {
    localStorage.setItem('isAuthenticated', 'false');
    window.location.href = '../login/index.html';
};
if($('logout-btn')) {
    $('logout-btn').addEventListener('click', window.logout);
    $('logout-btn').style.display = 'inline-flex';
}
// check auth on main
if(localStorage.getItem('isAuthenticated') !== 'true') {
    window.location.href = '../login/index.html';
} else {
    document.body.classList.remove('layout-login');
}
