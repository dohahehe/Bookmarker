// ================== DOM Elements ==================

const bookmarkForm = document.getElementById('bookmarkForm');
const siteNameInput = document.getElementById('siteName');
const siteUrlInput = document.getElementById('siteUrl');
const bookmarksList = document.getElementById('bookmarksList');
const toast = document.getElementById('toast');
const themeButtons = document.querySelectorAll('.theme-btn');

// =================== Initialize ===================

document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    displayBookmarks();
});

// ================== Theme switching ==================

themeButtons.forEach(button => {
    button.addEventListener('click', function(){
        const theme = this.dataset.theme;

        themeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        document.body.className = '';
        if(theme !== 'light'){
            document.body.classList.add(`theme-${theme}`);
        }

        localStorage.setItem('theme', theme);
    })
});

// ============ Load theme from local storage ============

function loadTheme(){
    const savedTheme = localStorage.getItem('theme');
    const themeButton = document.querySelector(`[data-theme="${savedTheme}"]`);

    if(themeButton){
        themeButton.click();
    }
}

// ================= add bookmark ==================

bookmarkForm.addEventListener('submit', function(e){
    e.preventDefault();

    const siteName = siteNameInput.value.trim();
    const siteUrl = siteUrlInput.value.trim();

    if (!validateForm(siteName, siteUrl)) {
        return;
    }

    const bookmark = {
        name: siteName,
        url: formatUrl(siteUrl),
        id: Date.now().toString()
    };

    saveBookmark(bookmark);
    displayBookmarks();
    showToast('Bookmark added successfully!');
    
    bookmarkForm.reset();
    siteNameInput.focus();
})

// ================== Form validation ==================

function validateForm(name, url){
    if(!name || !url){
        showError('Please fill in both fields');
        return false;   
    }

    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if(!urlRegex.test(url)){
        showError('Please enter a valid URL');
        return false;
    }
    return true;
}

// ===================== Format URL ====================

function formatUrl(url){
    if(!url.startsWith('http://') && !url.startsWith('https://')){
        return 'https://' + url;
    }
    return url;
}

// ============ Save bookmark to local storage ==========

function saveBookmark(bookmark){
    const bookmarks = getBookmarks();
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

}

// =========== Get bookmarks from local storage ==========

function getBookmarks(){
    return JSON.parse(localStorage.getItem('bookmarks')) || [];
}

// ================= Display bookmarks ==================

function displayBookmarks(){
    const bookmarks = getBookmarks();

    if(bookmarks.length === 0){
        bookmarksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bookmark"></i>
                <h3>No bookmarks yet</h3>
                <p>Add your first bookmark to get started</p>
            </div>
        `;
        return;
    }

    bookmarksList.innerHTML = '';
    bookmarks.forEach((bookmark, index) => {
        const bookmarkElement = document.createElement('div');
        bookmarkElement.className = 'bookmark-item';
        bookmarkElement.style.animationDelay = `${index * 0.1}s`;
        bookmarkElement.innerHTML = `
            <div class="bookmark-content">
                <div class="bookmark-name">${bookmark.name}</div>
                <div class="bookmark-url">${bookmark.url}</div>
            </div>
            <div class="bookmark-actions">
                <a href="${bookmark.url}" target="_blank" class="action-btn btn-visit" title="Visit">
                    <i class="fas fa-external-link-alt"></i>
                </a>
                <button class="action-btn btn-delete" onclick="deleteBookmark('${bookmark.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        bookmarksList.appendChild(bookmarkElement);
    });
}

// ================== Delete bookmark ==================

function deleteBookmark(id) {
    if (confirm('Are you sure you want to delete this bookmark?')) {
        let bookmarks = getBookmarks();
        bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        displayBookmarks();
        showToast('Bookmark deleted');
    }
}

// ================== Error and toast ==================

function showError(message) {
    // Create temporary error styling
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.style.borderColor = '#ef4444';
        
        setTimeout(() => {
            input.style.borderColor = '';
        }, 2000);
    });
    
    showToast(message, 'error');
}

// =============== Show toast notification ==============

function showToast(message, type = 'success') {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    
    if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle toast-icon';
        toastIcon.style.color = '#ef4444';
    } else {
        toastIcon.className = 'fas fa-check-circle toast-icon';
        toastIcon.style.color = '#10b981';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}