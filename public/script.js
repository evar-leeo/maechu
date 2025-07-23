// DOM 요소들
const initialState = document.getElementById('initial-state');
const loadingState = document.getElementById('loading');
const resultState = document.getElementById('result-state');
const listState = document.getElementById('list-state');
const errorState = document.getElementById('error-state');

const recommendBtn = document.getElementById('recommend-btn');
const showAllBtn = document.getElementById('show-all-btn');
const retryBtn = document.getElementById('retry-btn');
const backBtn = document.getElementById('back-btn');
const backToMainBtn = document.getElementById('back-to-main-btn');
const errorRetryBtn = document.getElementById('error-retry-btn');

const restaurantName = document.getElementById('restaurant-name');
const restaurantAddress = document.getElementById('restaurant-address');
const mapLink = document.getElementById('map-link');
const listLink = document.getElementById('list-link');
const errorMessage = document.getElementById('error-message');
const restaurantsContainer = document.getElementById('restaurants-container');

// 상태 관리
let currentState = 'initial';

// 상태 전환 함수
function showState(state) {
    // 모든 상태 숨기기
    [initialState, loadingState, resultState, listState, errorState].forEach(el => {
        el.classList.add('hidden');
    });
    
    // 선택된 상태 보이기
    switch(state) {
        case 'initial':
            initialState.classList.remove('hidden');
            break;
        case 'loading':
            loadingState.classList.remove('hidden');
            break;
        case 'result':
            resultState.classList.remove('hidden');
            break;
        case 'list':
            listState.classList.remove('hidden');
            break;
        case 'error':
            errorState.classList.remove('hidden');
            break;
    }
    
    currentState = state;
}

// API 호출 함수
async function fetchLunchRecommendation() {
    try {
        const response = await fetch('/api/lunch');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('점심 추천 API 호출 실패:', error);
        throw error;
    }
}

async function fetchRestaurantsList() {
    try {
        const response = await fetch('/api/restaurants');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('식당 목록 API 호출 실패:', error);
        throw error;
    }
}

// 점심 추천 처리
async function handleLunchRecommendation() {
    showState('loading');
    
    try {
        // 최소 1초 로딩 시간 보장 (UX 개선)
        const [data] = await Promise.all([
            fetchLunchRecommendation(),
            new Promise(resolve => setTimeout(resolve, 1000))
        ]);
        
        if (data.success && data.restaurant) {
            // 성공적으로 추천 받음
            displayRecommendation(data.restaurant);
            showState('result');
        } else {
            // 추천 실패
            showError(data.message || '메뉴 추천에 실패했습니다.');
        }
    } catch (error) {
        showError('서버 연결에 실패했습니다. 네트워크를 확인해주세요.');
    }
}

// 추천 결과 표시
function displayRecommendation(restaurant) {
    restaurantName.textContent = restaurant.name;
    restaurantAddress.textContent = restaurant.address;
    mapLink.href = restaurant.mapUrl;
    listLink.href = restaurant.listUrl;
    
    // 링크가 유효한지 확인
    if (!restaurant.mapUrl || restaurant.mapUrl === '#') {
        mapLink.style.display = 'none';
    } else {
        mapLink.style.display = 'inline-block';
    }
    
    if (!restaurant.listUrl || restaurant.listUrl === '#') {
        listLink.style.display = 'none';
    } else {
        listLink.style.display = 'inline-block';
    }
}

// 전체 식당 목록 처리
async function handleShowAllRestaurants() {
    showState('loading');
    
    try {
        const data = await fetchRestaurantsList();
        
        if (data.success && data.restaurants) {
            displayRestaurantsList(data.restaurants, data.folder);
            showState('list');
        } else {
            showError(data.message || '식당 목록을 불러오는데 실패했습니다.');
        }
    } catch (error) {
        showError('서버 연결에 실패했습니다. 네트워크를 확인해주세요.');
    }
}

// 식당 목록 표시
function displayRestaurantsList(restaurants, folder) {
    restaurantsContainer.innerHTML = '';
    
    if (!restaurants || restaurants.length === 0) {
        restaurantsContainer.innerHTML = `
            <div class="restaurant-item">
                <h3>등록된 식당이 없습니다</h3>
                <p>네이버 지도에 맛집을 저장해보세요!</p>
            </div>
        `;
        return;
    }
    
    restaurants.forEach(restaurant => {
        const item = document.createElement('div');
        item.className = `restaurant-item ${restaurant.available === false ? 'unavailable' : ''}`;
        
        item.innerHTML = `
            <h3>${restaurant.name || '이름 없음'}</h3>
            <p>${restaurant.address || '주소 정보 없음'}</p>
        `;
        
        // 클릭 이벤트 (사용 가능한 식당만)
        if (restaurant.available !== false && restaurant.sid) {
            item.addEventListener('click', () => {
                const mapUrl = `https://map.naver.com/p/entry/place/${restaurant.sid}`;
                window.open(mapUrl, '_blank');
            });
        }
        
        restaurantsContainer.appendChild(item);
    });
}

// 에러 표시
function showError(message) {
    errorMessage.textContent = message;
    showState('error');
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    // 점심 추천 버튼
    recommendBtn.addEventListener('click', handleLunchRecommendation);
    
    // 전체 식당 목록 보기 버튼
    showAllBtn.addEventListener('click', handleShowAllRestaurants);
    
    // 다시 뽑기 버튼
    retryBtn.addEventListener('click', handleLunchRecommendation);
    
    // 뒤로가기 버튼들
    backBtn.addEventListener('click', () => showState('initial'));
    backToMainBtn.addEventListener('click', () => showState('initial'));
    errorRetryBtn.addEventListener('click', () => showState('initial'));
    
    // 키보드 이벤트
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'Escape':
                if (currentState !== 'initial') {
                    showState('initial');
                }
                break;
            case 'Enter':
                if (currentState === 'initial') {
                    handleLunchRecommendation();
                } else if (currentState === 'result') {
                    handleLunchRecommendation(); // 다시 뽑기
                }
                break;
            case ' ': // 스페이스바
                if (currentState === 'initial') {
                    event.preventDefault();
                    handleLunchRecommendation();
                }
                break;
        }
    });
    
    // 터치 스와이프 지원 (모바일)
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (event) => {
        touchStartY = event.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (event) => {
        touchEndY = event.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 위로 스와이프 - 추천받기
                if (currentState === 'initial') {
                    handleLunchRecommendation();
                }
            } else {
                // 아래로 스와이프 - 뒤로가기
                if (currentState !== 'initial') {
                    showState('initial');
                }
            }
        }
    }
    
    // PWA 설치 지원
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredPrompt = event;
        
        // 설치 안내 표시 (선택사항)
        console.log('앱을 홈 화면에 추가할 수 있습니다!');
    });
    
    // 초기 상태로 설정
    showState('initial');
    
    // 페이지 로드 완료 알림
    console.log('🍽️ 맛추 v2 웹앱이 준비되었습니다!');
    console.log('키보드 단축키:');
    console.log('- Enter: 점심 추천받기');
    console.log('- Escape: 메인으로 돌아가기');
    console.log('- Space: 점심 추천받기');
});

// 서비스 워커 등록 (PWA 지원)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/public/sw.js')
            .then((registration) => {
                console.log('Service Worker 등록 성공:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker 등록 실패:', error);
            });
    });
}

// 온라인/오프라인 상태 감지
window.addEventListener('online', () => {
    console.log('인터넷에 연결되었습니다.');
});

window.addEventListener('offline', () => {
    console.log('인터넷 연결이 끊어졌습니다.');
    if (currentState === 'loading') {
        showError('인터넷 연결을 확인해주세요.');
    }
});

// 앱 내에서 새로고침 지원
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && currentState === 'error') {
        // 앱이 다시 포커스를 받았을 때 에러 상태라면 초기 상태로
        setTimeout(() => {
            if (currentState === 'error') {
                showState('initial');
            }
        }, 1000);
    }
}); 