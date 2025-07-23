const CACHE_NAME = 'maechu-v2-cache-v1';
const OFFLINE_URL = '/web';

// 캐시할 리소스들
const urlsToCache = [
  '/web',
  '/public/styles.css',
  '/public/script.js',
  '/public/manifest.json',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap'
];

// 서비스 워커 설치
self.addEventListener('install', (event) => {
  console.log('Service Worker 설치 중...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('캐시 열기 성공');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('리소스 캐시 완료');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('캐시 실패:', error);
      })
  );
});

// 서비스 워커 활성화
self.addEventListener('activate', (event) => {
  console.log('Service Worker 활성화 중...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 이전 버전의 캐시 삭제
          if (cacheName !== CACHE_NAME) {
            console.log('이전 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker 활성화 완료');
      return self.clients.claim();
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시에서 반환
        if (response) {
          console.log('캐시에서 반환:', event.request.url);
          return response;
        }

        // 캐시에 없으면 네트워크에서 가져오기
        return fetch(event.request)
          .then((response) => {
            // 유효한 응답인지 확인
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답을 복제 (한 번만 읽을 수 있으므로)
            const responseToCache = response.clone();

            // 정적 리소스만 캐시에 추가
            if (shouldCache(event.request.url)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('새 리소스 캐시:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // 네트워크 실패 시 오프라인 페이지 반환
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
            
            // API 요청 실패 시 기본 오류 응답
            if (event.request.url.includes('/api/')) {
              return new Response(
                JSON.stringify({
                  success: false,
                  message: '오프라인 상태입니다. 인터넷 연결을 확인해주세요.'
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );
            }
          });
      })
  );
});

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('백그라운드 동기화 실행');
    event.waitUntil(doBackgroundSync());
  }
});

// 푸시 알림 (선택사항)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('푸시 알림 수신:', data);
    
    const options = {
      body: data.body || '새로운 점심 메뉴가 업데이트되었습니다!',
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍽️</text></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍽️</text></svg>",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2'
      },
      actions: [
        {
          action: 'explore',
          title: '확인하기',
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👀</text></svg>"
        },
        {
          action: 'close',
          title: '닫기',
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>❌</text></svg>"
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '맛추 v2', options)
    );
  }
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('알림 클릭:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // 앱 열기
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/web');
        }
      })
    );
  }
});

// 유틸리티 함수들
function shouldCache(url) {
  // 캐시할 리소스 패턴 정의
  const cachePatterns = [
    /\/public\//,
    /\/web$/,
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/
  ];
  
  return cachePatterns.some(pattern => pattern.test(url));
}

async function doBackgroundSync() {
  try {
    // 백그라운드에서 실행할 작업
    console.log('백그라운드 동기화 작업 실행');
    
    // 예: 캐시된 데이터 업데이트
    const cache = await caches.open(CACHE_NAME);
    await cache.add('/api/restaurants');
    
    console.log('백그라운드 동기화 완료');
  } catch (error) {
    console.error('백그라운드 동기화 실패:', error);
  }
}

// 메시지 처리 (앱과 서비스 워커 간 통신)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker 로드 완료'); 