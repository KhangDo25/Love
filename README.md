# GAME CỦA 2 CHÚNG MÌNH 💕

Web app mobile-first bằng React + Vite + Tailwind dành riêng cho 2 người yêu nhau kết nối chơi game, bói tình duyên, thách đố vui nhộn và lưu giữ kỷ niệm trên 2 điện thoại khác nhau qua internet.

## ✨ Điểm nổi bật
- **100% Web tĩnh**: Không dùng Firebase, không database, không backend riêng. Dễ dàng push lên GitHub và deploy lên Vercel chỉ với 1 click (`npm run build`, output: `dist`).
- **Kết nối Peer-to-Peer (WebRTC)**: Sử dụng thư viện `PeerJS` với server signaling công cộng miễn phí. Mã phòng 4 số ngẫu nhiên dạng `tycct-XXXX`.
- **Phòng riêng tư cho 2 người**: Tối đa 2 người; nếu người thứ 3 vào sẽ tự động từ chối.
- **Link mời tức thì**: Dạng `https://your-domain.vercel.app/?room=1234`, người yêu chỉ cần chạm là vào thẳng phòng.
- **Tự động lưu & phục hồi**: Lưu hồ sơ, tin nhắn, sổ tay, điểm số ở `localStorage` của từng máy; khi kết nối lại sẽ tự động hợp nhất (merge) không làm mất dữ liệu.
- **Bói tình yêu định mệnh 💘**: Thuật toán cố định từ Cung hoàng đạo + Con giáp + Thần số học số chủ đạo, ra cùng % và lời bình cho cả 2 máy. Chụp ảnh kết quả lưu về máy với 1 chạm.
- **Chế độ ngọt ngào 💕**: Bao nhiêu hiểu nhau (10 câu trắc nghiệm), Hỏi xoáy đáp xoay (>40 câu hỏi bí mật), Hộp thư tình với hiệu ứng mở phong bì, Lời hẹn ước (Bucket list).
- **Chế độ cà khịa 🔥**: Kéo búa bao realtime + hình phạt vui, Thật hay thách (>40 câu mỗi loại), Tòa án tình yêu (Ai đúng ai sai), Bảng điểm thắng thua.
- **Tính năng dùng chung 💞**: Đếm ngược ngày yêu & sinh nhật, Bảng vẽ đôi realtime trực tiếp, Vòng quay quyết định (Hôm nay ăn gì / Đi đâu / Làm gì) đồng bộ cả 2 máy.

---

## 🌐 Ghi chú quan trọng về kết nối WebRTC (4G / WiFi)

WebRTC là công nghệ kết nối trực tiếp ngang hàng (Peer-to-Peer) giữa 2 trình duyệt mà không cần máy chủ trung gian lưu trữ dữ liệu.

### Khắc phục sự cố kết nối:
1. **Tường lửa mạng (Symmetric NAT)**:
   - Một số mạng 4G/5G hoặc mạng WiFi công ty / trường học có cấu hình tường lửa đặc biệt chặn lưu lượng P2P giữa 2 thiết bị.
   - **Cách xử lý nhanh**: Nếu bị kẹt ở trạng thái *"Đang kết nối lại..."*, hãy thử một trong các cách sau:
     - Cả 2 cùng kết nối chung một mạng WiFi gia đình.
     - Hoặc một bên mở Điểm phát sóng di động (Hotspot) cho bên kia kết nối.
     - Hoặc một trong 2 người chuyển từ 4G sang WiFi (hoặc ngược lại).
2. **Cấu hình thêm TURN Server miễn phí (Tùy chọn)**:
   - Mặc định ứng dụng sử dụng các máy chủ Google STUN công cộng (`stun:stun.l.google.com:19302`).
   - Nếu bạn muốn kết nối xuyên qua 100% mọi loại tường lửa 4G ngặt nghèo nhất, bạn có thể đăng ký tài khoản miễn phí tại **Metered.ca** hoặc **Xirsys** để lấy thông tin TURN server (username, credential) và bổ sung vào mảng `ICE_SERVERS` trong file `src/utils/webrtc.ts`.

---

## 🚀 Hướng dẫn Cài đặt & Triển khai (Deploy Vercel)

### Chạy ở môi trường nội bộ:
```bash
npm install
npm run dev
```

### Triển khai lên Vercel:
1. Đẩy code lên kho lưu trữ GitHub của bạn.
2. Truy cập [Vercel](https://vercel.com) và chọn **Add New Project** -> Chọn repo GitHub vừa tạo.
3. Cấu hình mặc định:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Bấm **Deploy** và copy link gửi cho người yêu chơi cùng ngay!
