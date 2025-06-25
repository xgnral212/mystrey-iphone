document.addEventListener('DOMContentLoaded', () => {
    // --- عناصر الواجهة ---
    const lockScreen = document.getElementById('lock-screen');
    const authScreen = document.getElementById('auth-screen');
    const homeScreen = document.getElementById('home-screen');
    const twetaApp = document.getElementById('tweta-app');
    const clubchatApp = document.getElementById('clubchat-app');
    const privateChatApp = document.getElementById('private-chat-app');
    const statusBar = document.getElementById('status-bar');

    // شاشة القفل
    const lockTimeElement = document.getElementById('lock-time');
    const lockDateElement = document.getElementById('lock-date');
    const notificationArea = document.getElementById('notification-area');

    // المصادقة (Auth)
    const authUsernameInput = document.getElementById('auth-username');
    const authPasswordInput = document.getElementById('auth-password');
    const authLoginBtn = document.getElementById('auth-login-btn');
    const authRegisterBtn = document.getElementById('auth-register-btn');
    const authMessage = document.getElementById('auth-message');

    // أزرار العودة
    const backToHomeButtons = document.querySelectorAll('.back-to-home');
    const backToClubChatListBtn = document.querySelector('.back-to-clubchat-list');

    // Tweta
    const twetaHeaderTitle = document.getElementById('tweta-header-title');
    const twetaContentHome = document.getElementById('tweta-content-home');
    const twetaContentSearch = document.getElementById('tweta-content-search');
    const postTwetaBtn = document.getElementById('post-tweta-btn');
    const twetaPostInput = document.getElementById('tweta-post-input');
    const twetaFeed = document.getElementById('tweta-feed');
    const twetaSearchInput = document.getElementById('tweta-search-input');
    const twetaSearchBtn = document.getElementById('tweta-search-btn');
    const twetaSearchResults = document.getElementById('tweta-search-results');
    const twetaNavItems = document.querySelectorAll('#tweta-app .app-navbar .nav-item');

    // ClubChat
    const clubchatHeaderTitle = document.getElementById('clubchat-header-title');
    const clubchatContentHome = document.getElementById('clubchat-content-home');
    const clubchatContentFriends = document.getElementById('clubchat-content-friends');
    const clubchatChatsList = document.getElementById('clubchat-chats-list');
    const clubchatSearchInput = document.getElementById('clubchat-search-input');
    const clubchatSearchBtn = document.getElementById('clubchat-search-btn');
    const clubchatSearchResults = document.getElementById('clubchat-search-results');
    const clubchatNavItems = document.querySelectorAll('#clubchat-app .app-navbar .nav-item');


    // الدردشة الخاصة
    const privateChatHeaderName = document.getElementById('private-chat-header-name');
    const privateChatMessagesContainer = document.getElementById('private-chat-messages');
    const privateChatMessageInput = document.getElementById('private-chat-message-input');
    const sendPrivateChatMessageBtn = document.getElementById('send-private-chat-message-btn');

    // --- بيانات وهمية (تُحفظ في localStorage) ---
    // المستخدمون المسجلون
    let users = JSON.parse(localStorage.getItem('mockUsers')) || {
        'صديق_الافتراضي1': { id: 'user1', password: '123', username: 'صديق_الافتراضي1', avatar: 'https://source.unsplash.com/random/40x40/?portrait&10' },
        'صديق_الافتراضي2': { id: 'user2', password: '123', username: 'صديق_الافتراضي2', avatar: 'https://source.unsplash.com/random/40x40/?portrait&11' },
        'صديق_الافتراضي3': { id: 'user3', password: '123', username: 'صديق_الافتراضي3', avatar: 'https://source.unsplash.com/random/40x40/?portrait&12' }
    };

    // المستخدم الحالي المسجل دخوله
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    // قائمة أصدقاء المستخدم الحالي (بواسطة ID المستخدم المسجل دخوله)
    let userFriends = JSON.parse(localStorage.getItem('userFriends')) || {};
    // تهيئة قائمة الأصدقاء للمستخدمين الافتراضيين الجدد
    if (!userFriends['user1']) userFriends['user1'] = ['user2', 'user3'];
    if (!userFriends['user2']) userFriends['user2'] = ['user1', 'user3'];
    if (!userFriends['user3']) userFriends['user3'] = ['user1', 'user2'];
    localStorage.setItem('userFriends', JSON.stringify(userFriends));


    // محاكاة للدردشات الخاصة (تُحفظ في localStorage)
    // الهيكل: privateChats[currentUserId][recipientId] = [messages...]
    let privateChats = JSON.parse(localStorage.getItem('mockPrivateChats')) || {};
    let currentChatRecipientId = null; // ID المستخدم الذي تدردش معه حالياً

    // إضافة بعض الرسائل الافتراضية للدردشات للمستخدمين الافتراضيين
    function initializeDefaultChats() {
        if (!privateChats['user1']) privateChats['user1'] = {};
        if (!privateChats['user2']) privateChats['user2'] = {};

        if (!privateChats['user1']['user2']) {
            privateChats['user1']['user2'] = [
                { sender: 'user2', content: 'مرحباً، كيف حالك؟', time: '10:00 ص' },
                { sender: 'user1', content: 'أهلاً! أنا بخير، ماذا عنك؟', time: '10:01 ص' }
            ];
            // وللطرف الآخر (المستخدم 2) يجب أن تكون الرسائل مقلوبة المنظور
            if (!privateChats['user2']['user1']) {
                privateChats['user2']['user1'] = [
                    { sender: 'user1', content: 'مرحباً، كيف حالك؟', time: '10:00 ص' },
                    { sender: 'user2', content: 'أهلاً! أنا بخير، ماذا عنك؟', time: '10:01 ص' }
                ];
            }
        }
        localStorage.setItem('mockPrivateChats', JSON.stringify(privateChats));
    }
    initializeDefaultChats();


    // --- وظائف عامة لعرض الشاشات ---
    function showScreen(screenToShow) {
        const screens = [lockScreen, authScreen, homeScreen, twetaApp, clubchatApp, privateChatApp];
        screens.forEach(screen => {
            if (screen === screenToShow) {
                screen.classList.remove('hidden');
                screen.classList.add('active');
            } else {
                screen.classList.add('hidden');
                screen.classList.remove('active');
            }
        });

        // تحديث لون شريط الحالة
        if (screenToShow === lockScreen) {
            statusBar.style.color = 'white';
            statusBar.querySelectorAll('.status-icons img').forEach(img => img.style.filter = 'invert(100%)');
        } else {
            statusBar.style.color = 'black';
            statusBar.querySelectorAll('.status-icons img').forEach(img => img.style.filter = 'none');
        }
    }

    // --- منطق شاشة القفل ---
    lockScreen.addEventListener('click', () => {
        if (currentUser) {
            showScreen(homeScreen);
        } else {
            showScreen(authScreen);
        }
    });

    function updateDateTime() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };

        const currentTime = now.toLocaleTimeString('en-US', timeOptions);
        const currentDate = now.toLocaleDateString('ar-DZ', dateOptions);

        lockTimeElement.textContent = currentTime;
        document.querySelector('.status-bar .time').textContent = currentTime;
        lockDateElement.textContent = currentDate; // Added from previous version for date
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    // --- منطق المصادقة (Auth Screen) ---
    authLoginBtn.addEventListener('click', () => {
        const username = authUsernameInput.value.trim();
        const password = authPasswordInput.value.trim();

        if (users[username] && users[username].password === password) {
            currentUser = { username: username, id: users[username].id, avatar: users[username].avatar };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            if (!userFriends[currentUser.id]) { // تهيئة قائمة الأصدقاء للمستخدم الجديد إذا لم تكن موجودة
                userFriends[currentUser.id] = [];
                localStorage.setItem('userFriends', JSON.stringify(userFriends));
            }
            displayAuthMessage('تم تسجيل الدخول بنجاح!', 'success');
            setTimeout(() => {
                showScreen(homeScreen);
                clearAuthForm();
            }, 1000);
        } else {
            displayAuthMessage('اسم المستخدم أو كلمة المرور غير صحيحة.', 'error');
        }
    });

    authRegisterBtn.addEventListener('click', () => {
        const username = authUsernameInput.value.trim();
        const password = authPasswordInput.value.trim();

        if (username.length < 3 || password.length < 3) {
            displayAuthMessage('اسم المستخدم وكلمة المرور يجب أن تكون 3 أحرف على الأقل.', 'error');
            return;
        }

        if (users[username]) {
            displayAuthMessage('اسم المستخدم موجود بالفعل.', 'error');
        } else {
            // توليد معرف فريد للمستخدم (بسيط لأغراض المحاكاة)
            const newUserId = `user${Object.keys(users).length + 1}`;
            const newAvatar = `https://source.unsplash.com/random/40x40/?portrait&${Math.floor(Math.random() * 1000)}`;

            users[username] = { id: newUserId, password: password, username: username, avatar: newAvatar };
            localStorage.setItem('mockUsers', JSON.stringify(users));
            displayAuthMessage('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.', 'success');
            clearAuthForm();
        }
    });

    function displayAuthMessage(message, type) {
        authMessage.textContent = message;
        authMessage.className = `message ${type}`;
    }

    function clearAuthForm() {
        authUsernameInput.value = '';
        authPasswordInput.value = '';
        authMessage.textContent = '';
        authMessage.className = 'message';
    }

    // --- منطق الشاشة الرئيسية والتطبيقات ---
    document.getElementById('tweta-icon').addEventListener('click', () => {
        if (currentUser) {
            showScreen(twetaApp);
            showTwetaContent('tweta-content-home'); // عرض الرئيسية افتراضيا
        } else {
            showScreen(authScreen);
        }
    });

    document.getElementById('clubchat-icon').addEventListener('click', () => {
        if (currentUser) {
            showScreen(clubchatApp);
            showClubChatContent('clubchat-content-home'); // عرض الرئيسية افتراضيا
            renderClubChatList(); // تحديث قائمة الدردشات عند الدخول
        } else {
            showScreen(authScreen);
        }
    });

    backToHomeButtons.forEach(button => {
        button.addEventListener('click', () => {
            showScreen(homeScreen);
        });
    });

    // --- منطق Tweta ---
    postTwetaBtn.addEventListener('click', () => {
        if (!currentUser) return;
        const postText = twetaPostInput.value.trim();
        if (postText) {
            const newPostElement = document.createElement('div');
            newPostElement.classList.add('tweta-post');
            const timeAgo = "الآن";

            newPostElement.innerHTML = `
                <img src="${currentUser.avatar}" alt="User Avatar" class="user-avatar">
                <div class="post-content">
                    <div class="post-meta">
                        <strong>${currentUser.username}</strong> <span class="username">@${currentUser.username.replace(/\s/g, '_')}</span> <span class="time-ago">· ${timeAgo}</span>
                    </div>
                    <p>${postText}</p>
                    <div class="post-actions">
                        <span><img src="https://img.icons8.com/sf-regular/18/66757f/speech-bubble.png" alt="Reply"> 0</span>
                        <span><img src="https://img.icons8.com/sf-regular/18/66757f/retweet.png" alt="Retweet"> 0</span>
                        <span><img src="https://img.icons8.com/sf-regular/18/66757f/heart.png" alt="Like"> 0</span>
                    </div>
                </div>
            `;
            twetaFeed.prepend(newPostElement);
            twetaPostInput.value = '';
        }
    });

    // تبديل محتوى Tweta (الرئيسية/البحث/الخ..)
    function showTwetaContent(targetId) {
        twetaContentHome.classList.add('hidden');
        twetaContentSearch.classList.add('hidden');
        // أضف المزيد هنا إذا كان هناك محتوى آخر

        document.getElementById(targetId).classList.remove('hidden');

        // تحديث عنوان الهيدر
        if (targetId === 'tweta-content-home') {
            twetaHeaderTitle.textContent = 'الرئيسية';
        } else if (targetId === 'tweta-content-search') {
            twetaHeaderTitle.textContent = 'بحث';
        }
    }

    // التنقل في Tweta
    twetaNavItems.forEach(item => {
        item.addEventListener('click', () => {
            twetaNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const target = item.dataset.navTarget;
            if (target) {
                showTwetaContent(target);
            }
        });
    });

    // منطق البحث عن الأصدقاء في Tweta
    twetaSearchBtn.addEventListener('click', () => {
        const query = twetaSearchInput.value.trim().toLowerCase();
        twetaSearchResults.innerHTML = '';

        if (!query) {
            twetaSearchResults.innerHTML = '<p class="no-results">الرجاء إدخال اسم للبحث عنه.</p>';
            return;
        }

        const allUsers = Object.values(users);
        const results = allUsers.filter(user =>
            user.username.toLowerCase().includes(query) && user.id !== currentUser.id
        );

        if (results.length === 0) {
            twetaSearchResults.innerHTML = '<p class="no-results">لا توجد نتائج مطابقة.</p>';
            return;
        }

        results.forEach(user => {
            const isFriend = currentUser && userFriends[currentUser.id] && userFriends[currentUser.id].includes(user.id);
            const userItem = document.createElement('div');
            userItem.classList.add('user-item');
            userItem.innerHTML = `
                <img src="${user.avatar}" alt="User Avatar" class="user-avatar">
                <div class="user-info">
                    <span class="user-name">${user.username}</span>
                    <span class="user-username">@${user.username.replace(/\s/g, '_')}</span>
                </div>
                <button class="add-friend-btn ${isFriend ? 'added' : ''}" data-user-id="${user.id}">
                    ${isFriend ? 'صديق' : 'إضافة صديق'}
                </button>
            `;
            twetaSearchResults.appendChild(userItem);
        });
    });

    // إضافة صديق من نتائج البحث (Tweta)
    twetaSearchResults.addEventListener('click', (event) => {
        const btn = event.target.closest('.add-friend-btn');
        if (btn && !btn.classList.contains('added')) {
            const userIdToAdd = btn.dataset.userId;
            if (currentUser && userFriends[currentUser.id]) {
                userFriends[currentUser.id].push(userIdToAdd);
                localStorage.setItem('userFriends', JSON.stringify(userFriends));
                btn.textContent = 'صديق';
                btn.classList.add('added');
                const addedUser = Object.values(users).find(key => users[key].id === userIdToAdd);
                if (addedUser) {
                    alert(`تمت إضافة ${addedUser.username} كصديق!`);
                }
                renderClubChatList(); // تحديث قائمة دردشات ClubChat
            }
        }
    });

    // --- منطق ClubChat ---
    function showClubChatContent(targetId) {
        clubchatContentHome.classList.add('hidden');
        clubchatContentFriends.classList.add('hidden');
        // أضف المزيد هنا

        document.getElementById(targetId).classList.remove('hidden');

        // تحديث عنوان الهيدر
        if (targetId === 'clubchat-content-home') {
            clubchatHeaderTitle.textContent = 'الدردشات';
        } else if (targetId === 'clubchat-content-friends') {
            clubchatHeaderTitle.textContent = 'الأصدقاء';
        }
    }

    // التنقل في ClubChat
    clubchatNavItems.forEach(item => {
        item.addEventListener('click', () => {
            clubchatNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const target = item.dataset.navTarget;
            if (target) {
                showClubChatContent(target);
                if (target === 'clubchat-content-friends') {
                    // إذا ذهبنا لصفحة الأصدقاء، أظهر قائمة الأصدقاء الحاليين
                    renderFriendsList(clubchatSearchResults); // استخدام نفس دالة العرض
                    clubchatSearchInput.value = ''; // مسح حقل البحث
                } else if (target === 'clubchat-content-home') {
                    renderClubChatList(); // إعادة عرض قائمة الدردشات
                }
            }
        });
    });

    function renderClubChatList() {
        clubchatChatsList.innerHTML = '';

        if (!currentUser || !userFriends[currentUser.id]) {
            clubchatChatsList.innerHTML = '<p class="no-results">يرجى تسجيل الدخول لعرض دردشاتك.</p>';
            return;
        }

        const friendsIds = userFriends[currentUser.id] || [];

        if (friendsIds.length === 0) {
            clubchatChatsList.innerHTML = '<p class="no-results">ليس لديك أي دردشات بعد. ابحث عن أصدقاء لإضافتهم!</p>';
            return;
        }

        friendsIds.forEach(friendId => {
            const friend = Object.values(users).find(u => u.id === friendId);
            if (!friend) return; // تأكد من وجود الصديق

            const chatItem = document.createElement('div');
            chatItem.classList.add('chat-item');
            chatItem.dataset.chatId = friend.id; // معرف هذا المستخدم/الدردشة
            // الحصول على آخر رسالة
            const userChatHistory = privateChats[currentUser.id] && privateChats[currentUser.id][friend.id] ? privateChats[currentUser.id][friend.id] : [];
            const lastMessage = userChatHistory.length > 0 ? userChatHistory[userChatHistory.length - 1] : { content: 'ابدأ دردشة جديدة!', time: '' };
            const lastMessageText = lastMessage.content.length > 30 ? lastMessage.content.substring(0, 30) + '...' : lastMessage.content;
            const messageTime = lastMessage.time;


            chatItem.innerHTML = `
                <img src="${friend.avatar}" alt="Chat User" class="user-avatar">
                <div class="chat-info">
                    <span class="chat-name">${friend.username}</span>
                    <p class="last-message">${lastMessageText} <span class="message-time">${messageTime}</span></p>
                </div>
                <span class="new-snap-indicator hidden"></span>
            `;
            clubchatChatsList.appendChild(chatItem);
        });
    }

    // منطق البحث عن الأصدقاء في ClubChat (يعمل بشكل مشابه لـ Tweta)
    clubchatSearchBtn.addEventListener('click', () => {
        const query = clubchatSearchInput.value.trim().toLowerCase();
        clubchatSearchResults.innerHTML = '';

        if (!query) {
            renderFriendsList(clubchatSearchResults); // إذا كان البحث فارغًا، أظهر قائمة الأصدقاء الحالية
            return;
        }

        const allUsers = Object.values(users);
        const results = allUsers.filter(user =>
            user.username.toLowerCase().includes(query) && user.id !== currentUser.id
        );

        if (results.length === 0) {
            clubchatSearchResults.innerHTML = '<p class="no-results">لا توجد نتائج مطابقة.</p>';
            return;
        }

        results.forEach(user => {
            const isFriend = currentUser && userFriends[currentUser.id] && userFriends[currentUser.id].includes(user.id);
            const userItem = document.createElement('div');
            userItem.classList.add('user-item');
            userItem.innerHTML = `
                <img src="${user.avatar}" alt="User Avatar" class="user-avatar">
                <div class="user-info">
                    <span class="user-name">${user.username}</span>
                    <span class="user-username">@${user.username.replace(/\s/g, '_')}</span>
                </div>
                <button class="add-friend-btn ${isFriend ? 'added' : ''}" data-user-id="${user.id}">
                    ${isFriend ? 'صديق' : 'إضافة صديق'}
                </button>
            `;
            clubchatSearchResults.appendChild(userItem);
        });
    });

    // دالة مساعدة لعرض قائمة الأصدقاء (تُستخدم في ClubChat Search Results كقائمة الأصدقاء الحالية)
    function renderFriendsList(containerElement) {
        containerElement.innerHTML = '';
        if (!currentUser || !userFriends[currentUser.id]) {
            containerElement.innerHTML = '<p class="no-results">يرجى تسجيل الدخول لعرض أصدقائك.</p>';
            return;
        }

        const friendsIds = userFriends[currentUser.id] || [];

        if (friendsIds.length === 0) {
            containerElement.innerHTML = '<p class="no-results">لا يوجد لديك أصدقاء بعد. ابحث عنهم لإضافتهم!</p>';
            return;
        }

        friendsIds.forEach(friendId => {
            const friend = Object.values(users).find(u => u.id === friendId);
            if (!friend) return; // تأكد من وجود الصديق

            const userItem = document.createElement('div');
            userItem.classList.add('user-item');
            userItem.innerHTML = `
                <img src="${friend.avatar}" alt="User Avatar" class="user-avatar">
                <div class="user-info">
                    <span class="user-name">${friend.username}</span>
                    <span class="user-username">@${friend.username.replace(/\s/g, '_')}</span>
                </div>
                <button class="add-friend-btn added" data-user-id="${friend.id}">صديق</button>
            `;
            containerElement.appendChild(userItem);
        });
    }

    // إضافة صديق من نتائج البحث (ClubChat)
    clubchatSearchResults.addEventListener('click', (event) => {
        const btn = event.target.closest('.add-friend-btn');
        if (btn && !btn.classList.contains('added')) {
            const userIdToAdd = btn.dataset.userId;
            if (currentUser && userFriends[currentUser.id]) {
                userFriends[currentUser.id].push(userIdToAdd);
                localStorage.setItem('userFriends', JSON.stringify(userFriends));
                btn.textContent = 'صديق';
                btn.classList.add('added');
                const addedUser = Object.values(users).find(key => users[key].id === userIdToAdd);
                if (addedUser) {
                    alert(`تمت إضافة ${addedUser.username} كصديق!`);
                }
                renderClubChatList(); // تحديث قائمة دردشات ClubChat
                renderFriendsList(clubchatSearchResults); // تحديث قائمة الأصدقاء المعروضة
            }
        }
    });

    // فتح الدردشة الخاصة عند النقر على عنصر دردشة
    clubchatChatsList.addEventListener('click', (event) => {
        const chatItem = event.target.closest('.chat-item');
        if (chatItem) {
            currentChatRecipientId = chatItem.dataset.chatId;
            const recipient = Object.values(users).find(u => u.id === currentChatRecipientId);
            if (recipient) {
                privateChatHeaderName.textContent = recipient.username;
                showScreen(privateChatApp);
                renderPrivateChatMessages();
            }
        }
    });

    // العودة من الدردشة الخاصة إلى قائمة ClubChat
    backToClubChatListBtn.addEventListener('click', () => {
        showScreen(clubchatApp);
        showClubChatContent('clubchat-content-home'); // العودة لتبويبة الدردشات
        currentChatRecipientId = null;
        renderClubChatList(); // تحديث القائمة لضمان عرض آخر رسالة
    });

    // --- منطق واجهة الدردشة الخاصة (Private Chat) ---
    function renderPrivateChatMessages() {
        privateChatMessagesContainer.innerHTML = '';

        // تهيئة سجل الدردشة إذا لم يكن موجودًا للمستخدم الحالي مع هذا الطرف
        if (!privateChats[currentUser.id]) {
            privateChats[currentUser.id] = {};
        }
        if (!privateChats[currentUser.id][currentChatRecipientId]) {
            privateChats[currentUser.id][currentChatRecipientId] = [];
        }

        const messages = privateChats[currentUser.id][currentChatRecipientId];

        messages.forEach(msg => {
            const messageBubble = document.createElement('div');
            messageBubble.classList.add('chat-bubble');
            // إذا كان المرسل هو المستخدم الحالي، فهو 'sent'، وإلا فهو 'received'
            messageBubble.classList.add(msg.sender === currentUser.id ? 'sent' : 'received');
            messageBubble.textContent = msg.content;
            privateChatMessagesContainer.appendChild(messageBubble);
        });

        privateChatMessagesContainer.scrollTop = privateChatMessagesContainer.scrollHeight;
    }

    sendPrivateChatMessageBtn.addEventListener('click', () => {
        const messageText = privateChatMessageInput.value.trim();
        if (messageText && currentChatRecipientId && currentUser) {
            const now = new Date();
            const messageTime = now.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

            const newMessage = { sender: currentUser.id, content: messageText, time: messageTime };

            // حفظ الرسالة في سجل الدردشة للمستخدم الحالي والطرف الآخر
            // سجل المستخدم الحالي
            if (!privateChats[currentUser.id]) {
                privateChats[currentUser.id] = {};
            }
            if (!privateChats[currentUser.id][currentChatRecipientId]) {
                privateChats[currentUser.id][currentChatRecipientId] = [];
            }
            privateChats[currentUser.id][currentChatRecipientId].push(newMessage);

            // سجل الطرف الآخر (لمحاكاة استلامه للرسالة)
            if (!privateChats[currentChatRecipientId]) {
                privateChats[currentChatRecipientId] = {};
            }
            if (!privateChats[currentChatRecipientId][currentUser.id]) {
                privateChats[currentChatRecipientId][currentUser.id] = [];
            }
            // الرسالة للطرف الآخر تكون "مستلمة" من المستخدم الحالي
            privateChats[currentChatRecipientId][currentUser.id].push({
                sender: currentUser.id,
                content: messageText,
                time: messageTime
            });

            localStorage.setItem('mockPrivateChats', JSON.stringify(privateChats));

            // إضافة الفقاعة الجديدة مباشرة
            const messageBubble = document.createElement('div');
            messageBubble.classList.add('chat-bubble', 'sent');
            messageBubble.textContent = messageText;
            privateChatMessagesContainer.appendChild(messageBubble);

            privateChatMessageInput.value = '';
            privateChatMessagesContainer.scrollTop = privateChatMessagesContainer.scrollHeight;
            renderClubChatList(); // تحديث قائمة الدردشات الرئيسية بعد إرسال رسالة
        }
    });

    // --- وظائف التهيئة عند التحميل ---
    if (currentUser) {
        showScreen(lockScreen);
    } else {
        showScreen(authScreen);
    }
});
