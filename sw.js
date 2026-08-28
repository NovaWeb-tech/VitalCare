const CACHE_NAME = 'vital-care-v1';
const assetsToCache = [
    './VitaCare.html',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap'
];

// تثبيت الـ Service Worker وتخزين الملفات الأساسية مؤقتاً
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(assetsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// تفعيل الـ Service Worker وتطهير الكاش القديم
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// التعامل مع طلبات الشبكة (Fetch) لضمان العمل بدون إنترنت
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                // يمكن توفير صفحة بديلة هنا في حال انقطاع الإنترنت تماماً وعدم توفر الملف في الكاش
            })
    );
});
