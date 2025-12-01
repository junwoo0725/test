// 1. 전역 상태 관리 변수
let cart = []; // 장바구니 항목을 저장할 배열
const totalPriceElement = document.getElementById('total-price');
const itemCountElement = document.getElementById('item-count');
const nextStepButton = document.getElementById('next-step-btn');
const menuListContainer = document.getElementById('menu-list-container');
const categoryButtons = document.querySelectorAll('.category-btn');

// 2. 장바구니 업데이트 및 UI 갱신 함수
function updateCartSummary() {
    // 총 항목 개수 계산
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    // 총 가격 계산
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // UI 업데이트
    itemCountElement.textContent = totalItems;
    totalPriceElement.textContent = totalPrice.toLocaleString('ko-KR'); // 천 단위 구분 기호 적용

    // 총 항목 개수가 0을 초과하면 버튼 활성화
    if (totalItems > 0) {
        nextStepButton.disabled = false;
    } else {
        nextStepButton.disabled = true;
    }
}

// 3. 메뉴 담기 버튼 클릭 이벤트 핸들러
function handleAddToCart(event) {
    // 버튼을 클릭한 메뉴 항목(menu-item)의 데이터를 가져옵니다.
    const menuItem = event.target.closest('.menu-item');
    if (!menuItem) return;

    const id = menuItem.dataset.id;
    const name = menuItem.querySelector('.menu-name').textContent;
    const price = parseInt(menuItem.dataset.price);

    // 장바구니에 이미 있는 항목인지 확인
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        // 이미 있으면 수량만 증가
        existingItem.quantity += 1;
    } else {
        // 없으면 새 항목 추가
        cart.push({ id, name, price, quantity: 1 });
    }

    // 장바구니 업데이트
    updateCartSummary();

    // 사용자에게 항목이 추가되었음을 시각적으로 알림 (예: 버튼 색상 변경 후 복구)
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✔️ 추가됨';
    button.style.backgroundColor = '#5cb85c'; // 성공 색상으로 변경

    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#ffb347';
    }, 500);
}

// 4. 카테고리 필터링 함수
function filterMenuItems(category) {
    const items = menuListContainer.querySelectorAll('.menu-item');
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'flex'; // 표시
        } else {
            item.style.display = 'none'; // 숨김
        }
    });
}

// 5. 초기 설정 및 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    // 모든 '담기' 버튼에 이벤트 리스너 등록
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // 카테고리 버튼에 이벤트 리스너 등록
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // CSS 활성화/비활성화
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 메뉴 필터링 실행
            filterMenuItems(category);
        });
    });

    // '장바구니 확인' 버튼 클릭 시 (프로토타입이므로 alert만 띄움)
    nextStepButton.addEventListener('click', () => {
        const orderList = cart.map(item => `${item.name} x ${item.quantity}`).join('\n');
        alert(`🛒 주문 내역 확인:\n\n${orderList}\n\n총액: ${totalPriceElement.textContent}원\n\n(다음 단계: 주문 완료 페이지로 이동)`);
        
        // 실제 구현에서는 주문 완료 페이지로 화면 전환 로직이 들어갑니다.
    });
    
    // 페이지 로드 시 장바구니 요약 초기화
    updateCartSummary();
});