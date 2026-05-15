const isLoginPage = Boolean(document.getElementById('login-form'));
let csrfToken = '';
let projects = [];
let messages = [];

function setStatus(element, message, level = '') {
    if (!element) return;
    element.textContent = message;
    element.className = `status-text ${level}`.trim();
}

async function api(path, options = {}) {
    const response = await fetch(`../api/${path}`, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
            ...(options.headers || {}),
        },
        ...options,
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
        throw new Error(payload.message || 'İşlem başarısız.');
    }
    if (payload.csrf_token) {
        csrfToken = payload.csrf_token;
    }
    return payload;
}

if (isLoginPage) {
    const loginForm = document.getElementById('login-form');
    const loginStatus = document.getElementById('login-status');

    api('admin/login.php')
        .then(payload => {
            if (payload.authenticated) {
                window.location.href = 'index.html';
            }
        })
        .catch(() => {});

    loginForm.addEventListener('submit', async event => {
        event.preventDefault();
        setStatus(loginStatus, 'Giriş yapılıyor...');
        const formData = new FormData(loginForm);
        try {
            await api('admin/login.php', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData.entries())),
            });
            window.location.href = 'index.html';
        } catch (error) {
            setStatus(loginStatus, error.message, 'error');
        }
    });
} else {
    initDashboard();
}

async function initDashboard() {
    try {
        await loadProjects();
        await loadMessages();
    } catch (error) {
        if (error.message === 'Unauthorized') {
            window.location.href = 'login.html';
            return;
        }
        console.error(error);
    }

    document.getElementById('project-form')?.addEventListener('submit', saveProject);
    document.getElementById('reset-project-form')?.addEventListener('click', resetProjectForm);
    document.getElementById('new-project-button')?.addEventListener('click', resetProjectForm);
    document.getElementById('logout-button')?.addEventListener('click', async () => {
        await api('admin/logout.php');
        window.location.href = 'login.html';
    });
}

async function loadProjects() {
    const payload = await api('admin/projects.php');
    projects = payload.projects || [];
    renderProjects();
}

async function loadMessages() {
    const payload = await api('admin/messages.php');
    messages = payload.messages || [];
    renderMessages();
}

function renderProjects() {
    const list = document.getElementById('projects-list');
    if (!list) return;
    list.innerHTML = projects.map(project => `
        <article class="admin-list-item">
            <strong>${escapeHtml(project.title)}</strong>
            <p class="item-meta">${escapeHtml(project.type)} · ${project.is_visible ? 'Yayında' : 'Gizli'} · ${project.is_featured ? 'Öne çıkan' : 'Repo paneli'}</p>
            <p>${escapeHtml(project.description)}</p>
            <p class="item-meta">${escapeHtml((project.technologies || []).join(', '))}</p>
            <div class="item-actions">
                <button type="button" onclick="editProject(${project.id})">Düzenle</button>
                <button type="button" class="danger" onclick="deleteProject(${project.id})">Sil</button>
            </div>
        </article>
    `).join('');
}

function renderMessages() {
    const list = document.getElementById('messages-list');
    if (!list) return;
    if (messages.length === 0) {
        list.innerHTML = '<p class="item-meta">Henüz mesaj yok.</p>';
        return;
    }

    list.innerHTML = messages.map(message => `
        <article class="admin-list-item">
            <strong>${escapeHtml(message.subject)}</strong>
            <p class="item-meta">${escapeHtml(message.name)} · ${escapeHtml(message.email)} · ${escapeHtml(message.created_at || '')}</p>
            <p>${escapeHtml(message.message)}</p>
            ${message.phone ? `<p class="item-meta">Telefon: ${escapeHtml(message.phone)}</p>` : ''}
            <div class="item-actions">
                <button type="button" onclick="toggleMessageRead(${message.id}, ${message.is_read ? 0 : 1})">
                    ${message.is_read ? 'Okunmadı Yap' : 'Okundu Yap'}
                </button>
                <button type="button" class="danger" onclick="deleteMessage(${message.id})">Sil</button>
            </div>
        </article>
    `).join('');
}

async function saveProject(event) {
    event.preventDefault();
    const status = document.getElementById('project-status');
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.is_featured = formData.has('is_featured');
    payload.is_visible = formData.has('is_visible');
    payload.csrf_token = csrfToken;

    const isUpdate = Boolean(payload.id);
    try {
        await api('admin/projects.php', {
            method: isUpdate ? 'PUT' : 'POST',
            body: JSON.stringify(payload),
        });
        setStatus(status, isUpdate ? 'Proje güncellendi.' : 'Proje eklendi.', 'success');
        resetProjectForm();
        await loadProjects();
    } catch (error) {
        setStatus(status, error.message, 'error');
    }
}

function editProject(id) {
    const project = projects.find(item => item.id === id);
    const form = document.getElementById('project-form');
    if (!project || !form) return;

    form.elements.id.value = project.id;
    form.elements.title.value = project.title;
    form.elements.type.value = project.type;
    form.elements.description.value = project.description;
    form.elements.technologies.value = (project.technologies || []).join(', ');
    form.elements.github_url.value = project.github_url;
    form.elements.sort_order.value = project.sort_order;
    form.elements.is_featured.checked = project.is_featured;
    form.elements.is_visible.checked = project.is_visible;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function deleteProject(id) {
    if (!window.confirm('Bu proje silinsin mi?')) return;
    await api('admin/projects.php', {
        method: 'DELETE',
        body: JSON.stringify({ id, csrf_token: csrfToken }),
    });
    await loadProjects();
}

function resetProjectForm() {
    const form = document.getElementById('project-form');
    if (!form) return;
    form.reset();
    form.elements.id.value = '';
    form.elements.is_featured.checked = true;
    form.elements.is_visible.checked = true;
    setStatus(document.getElementById('project-status'), '');
}

async function toggleMessageRead(id, isRead) {
    await api('admin/messages.php', {
        method: 'PUT',
        body: JSON.stringify({ id, is_read: Boolean(isRead), csrf_token: csrfToken }),
    });
    await loadMessages();
}

async function deleteMessage(id) {
    if (!window.confirm('Bu mesaj silinsin mi?')) return;
    await api('admin/messages.php', {
        method: 'DELETE',
        body: JSON.stringify({ id, csrf_token: csrfToken }),
    });
    await loadMessages();
}

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value ?? '';
    return div.innerHTML;
}
