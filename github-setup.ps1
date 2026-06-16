Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   SOFTZONE - GITHUB REPOSITORY SETUP SCRIPT   " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
$gitCheck = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCheck) {
    Write-Host "LỖI: Không tìm thấy Git trên hệ thống!" -ForegroundColor Red
    Write-Host "Vui lòng tải và cài đặt Git từ: https://git-scm.com/" -ForegroundColor Yellow
    Write-Host "Hoặc chạy lệnh sau trong PowerShell để cài đặt:" -ForegroundColor Yellow
    Write-Host "  winget install --id Git.Git -e --source winget" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Nhấn Enter để thoát..."
    exit
}

# Initialize Git
if (-not (Test-Path .git)) {
    Write-Host "[1/4] Đang khởi tạo kho chứa Git..." -ForegroundColor Blue
    git init
} else {
    Write-Host "[1/4] Kho chứa Git đã được khởi tạo từ trước." -ForegroundColor Blue
}

# Add files and commit
Write-Host "[2/4] Đang chuẩn bị các tập tin và tạo commit đầu tiên..." -ForegroundColor Blue
git add .
git commit -m "Initial commit - Website SoftZone Premium"

# Ask for Remote URL
Write-Host ""
Write-Host "----------------------------------------------"
Write-Host "BƯỚC TIẾP THEO: LIÊN KẾT GITHUB REMOTE" -ForegroundColor Green
Write-Host "Hãy tạo một repository trống trên GitHub, sau đó copy địa chỉ HTTPS của nó."
Write-Host "Ví dụ: https://github.com/ten-tai-khoan/SoftZone.git"
Write-Host "----------------------------------------------"
Write-Host ""

$remoteUrl = Read-Host "Dán link HTTPS Repository GitHub của bạn vào đây (để trống nếu muốn bỏ qua)"

if ($remoteUrl -ne "") {
    # Set branch to main
    git branch -M main
    
    # Check if origin already exists, delete it if it does
    $remoteCheck = git remote get-url origin 2>$null
    if ($remoteCheck) {
        git remote remove origin
    }
    
    git remote add origin $remoteUrl
    Write-Host "[3/4] Đã liên kết với repository từ xa: $remoteUrl" -ForegroundColor Blue
    
    Write-Host "[4/4] Đang đẩy code lên GitHub..." -ForegroundColor Blue
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "THÀNH CÔNG! Dự án của bạn đã được đẩy lên GitHub thành công! 🎉" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "CẢNH BÁO: Đẩy code thất bại. Hãy kiểm tra kết nối mạng và tài khoản GitHub của bạn." -ForegroundColor Red
    }
} else {
    Write-Host "Đã bỏ qua liên kết từ xa. Bạn có thể tự chạy lệnh 'git remote add origin <URL>' sau." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Nhấn Enter để hoàn tất..."
