# Tuần 6: Authentication, TanStack Query và kiến trúc

Ứng dụng React + TypeScript minh họa đăng nhập, phân quyền theo role, CRUD sản phẩm, cache server state và giỏ hàng dùng Zustand.

## Chạy ứng dụng

Yêu cầu Node.js 20.19+ hoặc 22.12+.

1. Cài dependencies: npm install
2. (Tùy chọn) Tạo .env từ .env.example nếu cần thay URL API.
3. Mở terminal thứ nhất, chạy API và backend xác thực: npm run api
4. Mở terminal thứ hai, chạy giao diện: npm run dev

Tài khoản demo:

- Admin: adrian / adrian05
- Moderator: moderator / moderator05
- User: viewer / viewer05

API và đăng nhập chạy tại http://localhost:3001. Phiên hết hạn sau 60 phút hoặc khi khởi động lại API.

## Chức năng và quyền

- Đăng nhập cục bộ, lưu token trong sessionStorage và xác minh phiên bằng /auth/me.
- Backend bảo vệ endpoint sản phẩm: admin được thêm/sửa/xóa; moderator được sửa; user chỉ được xem.
- Đăng xuất hoặc token bị từ chối sẽ xóa phiên, cache TanStack Query và giỏ hàng.
- Query sản phẩm được invalidate sau khi thêm, sửa hoặc xóa.
- Zustand persist lưu giỏ hàng giữa các lần tải trang.

## Kiến trúc và chất lượng mã

Mã nguồn chia theo feature trong src/features (auth, products, cart); phần dùng chung nằm trong src/shared. Phân quyền ở src/shared/permissions.ts, kết hợp ProtectedRoute, RoleGuard và HOC withPermission. Modal xác nhận xóa dùng Compound Component (Modal.Trigger, Modal.Content, Modal.Close).

ESLint, Prettier và Husky/lint-staged được cấu hình để tự kiểm tra, định dạng các tệp đã stage trước commit. Có thể chạy thủ công bằng npm run lint và npm run format.

Tài khoản backend trong source chỉ dành cho môi trường thực hành trên máy cá nhân. Trước khi triển khai thật, hãy thay bằng hệ thống xác thực, lưu trữ mật khẩu và quản lý session phù hợp.
