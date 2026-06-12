const fs = require('fs');

const file = 'c:\\Users\\vietdt\\OneDrive - PetroVietnam Exploration Production Corporation (PVEP)\\Desktop\\Nước ngoài\\Slide\\Tham_luan_DTRNN_2026_2030.html';

let content = fs.readFileSync(file, 'utf8');

content = content.replace('data-text="Lộ trình phối hợp Petrovietnam – PVEP · từ cơ chế đến dòng tiền"', 'data-text="Lộ trình phối hợp Petrovietnam – PVEP"');
content = content.replace('THAM LUẬN HĐTV PETROVIETNAM · 2026', 'THAM LUẬN PETROVIETNAM · 2026');
content = content.replace('Đối tượng: HĐTV · Ban Điều hành Petrovietnam', 'Hội thảo công tác Phát triển dự án mới ở nước ngoài');
content = content.replace('<h4>Dashboard ĐTRNN</h4>', '<h4>Hệ thống báo cáo điều hành ĐTRNN</h4>');
content = content.replace('<li>Single point of accountability.</li>', '<li>Một đầu mối chịu trách nhiệm duy nhất.</li>');
content = content.replace('<h2 class="end__big flash ac-reveal" style="--i:3">PVN ĐẦU MỐI CHÍNH SÁCH · PVEP ĐẦU MỐI TRIỂN KHAI</h2>', '<h2 class="end__big flash ac-reveal" style="--i:3; font-size:clamp(1.5rem,4.5vw,3.2rem); line-height: 1.4;">Petrovietnam: Đầu mối chính sách<br>PVEP: Đầu mối triển khai</h2>');

// global replace of whole word PVN
content = content.replace(/\bPVN\b/g, 'Petrovietnam');

fs.writeFileSync(file, content, 'utf8');
console.log('Update successful!');
