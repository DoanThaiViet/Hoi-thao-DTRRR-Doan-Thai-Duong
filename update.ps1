$file = "c:\Users\vietdt\OneDrive - PetroVietnam Exploration Production Corporation (PVEP)\Desktop\Nước ngoài\Slide\Tham_luan_DTRNN_2026_2030.html"
$content = Get-Content -Path $file -Raw -Encoding UTF8

$content = $content.Replace('data-text="Lộ trình phối hợp Petrovietnam – PVEP · từ cơ chế đến dòng tiền"', 'data-text="Lộ trình phối hợp Petrovietnam – PVEP"')
$content = $content.Replace('THAM LUẬN HĐTV PETROVIETNAM · 2026', 'THAM LUẬN PETROVIETNAM · 2026')
$content = $content.Replace('Đối tượng: HĐTV · Ban Điều hành Petrovietnam', 'Hội thảo công tác Phát triển dự án mới ở nước ngoài')
$content = $content.Replace('<h4>Dashboard ĐTRNN</h4>', '<h4>Hệ thống báo cáo điều hành ĐTRNN</h4>')
$content = $content.Replace('<li>Single point of accountability.</li>', '<li>Một đầu mối chịu trách nhiệm duy nhất.</li>')
$content = $content.Replace('<h2 class="end__big flash ac-reveal" style="--i:3">PVN ĐẦU MỐI CHÍNH SÁCH · PVEP ĐẦU MỐI TRIỂN KHAI</h2>', '<h2 class="end__big flash ac-reveal" style="--i:3; font-size:clamp(1.5rem,4.5vw,3.2rem); line-height: 1.4;">Petrovietnam: Đầu mối chính sách<br>PVEP: Đầu mối triển khai</h2>')

$content = [regex]::Replace($content, '\bPVN\b', 'Petrovietnam')

Set-Content -Path $file -Value $content -Encoding UTF8
Write-Host "Replaced successfully!"
