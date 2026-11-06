# GAME CỦA 2 CHÚNG MÌNH 💕

Web app mobile-first bằng React + Vite + Tailwind dành riêng cho 2 người yêu nhau kết nối chơi game, bói tình duyên, thách đố vui nhộn và lưu giữ kỷ niệm trên 2 điện thoại khác nhau qua internet.

## ✨ Điểm nổi bật
- **100% Web tĩnh**: Không dùng Firebase, không database, không backend riêng. Dễ dàng push lên GitHub và deploy lên Vercel chỉ với 1 click (`npm run build`, output: `dist`).
- **Kết nối siêu tốc bằng MQTT over WebSocket**: Sử dụng thư viện `mqtt.js` qua giao thức WebSocket bảo mật (WSS). Không lo bị chặn mạng bởi NAT/tường lửa 4G như WebRTC.
- **Hệ thống Broker dự phòng thông minh (Fallback)**: Tự động thử kết nối lần lượt qua 3 broker công cộng uy tín (HiveMQ, EMQX, Mosquitto) với timeout 6 giây.
- **Phòng riêng tư cho 2 người**: Tiền tố topic bí mật `tycct-9f3a7/{mã-phòng}`. Tối đa 2 người; nếu người thứ 3 vào sẽ nhận thông báo *"Phòng đã đủ 2 người 💕"*.
- **Cơ chế Presence & Last Will**: Host đăng ký presence dạng retained, tự động hủy qua Last Will khi mất mạng đột ngột. Guest xác thực phòng có host trước khi vào.
- **Link mời tức thì**: Dạng `https://your-domain.vercel.app/?room=1234`, người yêu chỉ cần chạm là vào thẳng phòng.
- **Tự động lưu & phục hồi**: Lưu hồ sơ, tin nhắn, sổ tay, điểm số ở `localStorage` của từng máy; khi kết nối lại sẽ tự động hợp nhất (merge) không làm mất dữ liệu.
- **Bói tình yêu định mệnh 💘**: Thuật toán cố định từ Cung hoàng đạo + Con giáp + Thần số học số chủ đạo, ra cùng % và lời bình cho cả 2 máy. Chụp ảnh kết quả lưu về máy với 1 chạm.
- **Chế độ ngọt ngào 💕**: Bao nhiêu hiểu nhau (10 câu trắc nghiệm), Hỏi xoáy đáp xoay (>40 câu hỏi bí mật), Hộp thư tình với hiệu ứng mở phong bì, Lời hẹn ước (Bucket list).
- **Chế độ cà khịa 🔥**: Kéo búa bao realtime + hình phạt vui, Thật hay thách (>40 câu mỗi loại), Tòa án tình yêu (Ai đúng ai sai), Bảng điểm thắng thua.
- **Tính năng dùng chung 💞**: Đếm ngược ngày yêu & sinh nhật, Bảng vẽ đôi realtime trực tiếp, Vòng quay quyết định (Hôm nay ăn gì / Đi đâu / Làm gì) đồng bộ cả 2 máy.

---

## 🌐 Kiến trúc kết nối MQTT over WebSocket

### Danh sách Broker công cộng (Tự động chuyển tiếp nếu lỗi):
1. `wss://broker.hivemq.com:8884/mqtt`
2. `wss://broker.emqx.io:8084/mqtt`
3. `wss://test.mosquitto.org:8081`

### Quy ước Topic:
- `tycct-9f3a7/{mã-phòng}/presence`: Báo hiệu trạng thái phòng (retained message)
- `tycct-9f3a7/{mã-phòng}/host`: Kênh lắng nghe của Host (Guest gửi yêu cầu lên đây)
- `tycct-9f3a7/{mã-phòng}/guest`: Kênh lắng nghe của Guest (Host gửi phản hồi và đồng bộ lên đây)

### Heartbeat & Chống trùng lặp (Deduplication):
- Gửi nhịp tim (Heartbeat ping/pong) định kỳ mỗi 5 giây.
- Nếu quá 15 giây không nhận được tín hiệu từ đối phương, app hiển thị trạng thái *"Người yêu đã mất kết nối. Đang thử nối lại... 🟡"*.
- Khi kết nối lại, Host sẽ tự động re-sync toàn bộ trạng thái phòng.
- Mọi gói tin đều có `seq` và `from` để lọc bỏ tin nhắn trùng lặp.

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
