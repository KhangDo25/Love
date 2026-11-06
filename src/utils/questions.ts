/**
 * Bộ câu hỏi, thử thách, thính ngọt ngào và cà khịa cho 2 người yêu nhau
 */

export interface UnderstandingQuestion {
  id: number;
  question: string;
  options: string[];
}

export const UNDERSTANDING_QUESTIONS: UnderstandingQuestion[] = [
  {
    id: 1,
    question: 'Món ăn yêu thích nhất của người ấy là gì?',
    options: ['Trà sữa & đồ ngọt', 'Lẩu / Nướng cay nồng', 'Món cuốn / Healthy thanh đạm', 'Cơm mẹ nấu / Món nhà làm'],
  },
  {
    id: 2,
    question: 'Khi giận dỗi, người ấy muốn bạn làm gì nhất?',
    options: ['Ôm chặt không buông và xin lỗi ngay', 'Mua đồ ăn ngon đến dỗ dành', 'Để yên cho bình tĩnh 1 lúc rồi nhắn', 'Nghe người ấy xả giận hết lòng'],
  },
  {
    id: 3,
    question: 'Địa điểm hẹn hò lý tưởng nhất của người ấy?',
    options: ['Quán cà phê view đẹp ngồi tâm sự', 'Đi du lịch xa, ngắm biển / leo núi', 'Nằm ôm nhau ở phòng xem phim', 'Cùng đi lượn phố đêm hóng gió'],
  },
  {
    id: 4,
    question: 'Thói quen xấu lúc ngủ của người ấy là gì?',
    options: ['Giành hết chăn của đối phương', 'Gác chân nặng như búa tạ', 'Thức khuya lướt điện thoại', 'Ngủ say như cún gọi mãi không dậy'],
  },
  {
    id: 5,
    question: 'Điểm quyến rũ / đáng yêu nhất ở bạn mà người ấy mê?',
    options: ['Nụ cười tỏa nắng siêu đáng yêu', 'Giọng nói ngọt ngào khi nhõng nhẽo', 'Sự chu đáo và biết quan tâm', 'Tính cách tếu táo, hay chọc cười'],
  },
  {
    id: 6,
    question: 'Nếu được tặng một món quà bất ngờ, người ấy thích gì hơn?',
    options: ['Một chuyến đi chơi bí mật cùng nhau', 'Đồ công nghệ hoặc phụ kiện thời trang', 'Thư tay viết nắn nót kèm hoa', 'Đồ ăn thật ngon tự tay người yêu nấu'],
  },
  {
    id: 7,
    question: 'Người ấy sợ con vật / hiện tượng nào nhất?',
    options: ['Gián / Chuột bay liệng', 'Sâu róm / Bò sát', 'Sấm sét / Bóng tối sợ ma', 'Sợ người yêu giận dỗi không nói gì!'],
  },
  {
    id: 8,
    question: 'Thời điểm người ấy cảm thấy yêu bạn nhiều nhất?',
    options: ['Lúc ốm mệt được bạn chăm sóc ân cần', 'Lúc cùng nhau vượt qua khó khăn', 'Lúc vô tình nhìn thấy nụ cười của bạn', 'Lúc bạn bảo: Hôm nay để anh/em bao!'],
  },
  {
    id: 9,
    question: 'Phong cách chi tiêu của người ấy là gì?',
    options: ['Tiết kiệm thông minh, lo cho tương lai', 'Thích gì mua nấy, vui là chính', 'Tiết kiệm cho bản thân nhưng hào phóng với bạn', 'Chuyên gia săn sale lúc nửa đêm'],
  },
  {
    id: 10,
    question: 'Ước mơ lớn nhất của cả 2 trong năm nay là gì?',
    options: ['Có một chuyến đi du lịch xa xôi lãng mạn', 'Cùng nhau tiết kiệm được một khoản tiền lớn', 'Luôn bình yên, khỏe mạnh và yêu nhau nhiều hơn', 'Về chung một nhà (hoặc ra mắt 2 gia đình)'],
  },
];

// ≥40 câu Hỏi xoáy đáp xoay
export const QUICK_QA_QUESTIONS: string[] = [
  'Ai là người "đổ" đối phương trước tiên?',
  'Ai là người hay dỗi hơn và ai dỗ dành chuyên nghiệp hơn?',
  'Ấn tượng đầu tiên lúc mới gặp đối phương là gì?',
  'Lần đầu tiên nắm tay nhau diễn ra ở đâu, cảm giác thế nào?',
  'Kỷ niệm đáng nhớ nhất (hoặc quê nhất) của hai đứa từ lúc yêu?',
  'Ai là người có trí nhớ "não cá vàng" hơn?',
  'Nếu chỉ được mang 1 thứ của người yêu lên hoang đảo, bạn mang gì?',
  'Ai là người chuẩn bị đồ lâu hơn mỗi khi chuẩn bị đi chơi?',
  'Bài hát nào khiến bạn nghe là lập tức nhớ đến người yêu?',
  'Người ấy làm hành động gì khiến tim bạn đập loạn nhịp nhất?',
  'Mùi hương hoặc mùi nước hoa của người ấy làm bạn nhớ tới điều gì?',
  'Ai là người ghen nhiều hơn khi có người khác làm quen đối phương?',
  'Một thói quen kỳ quặc nhưng cực kỳ đáng yêu của người ấy?',
  'Nếu được biến thành một con vật, bạn nghĩ người ấy hợp với con gì?',
  'Điều dũng cảm nhất mà người ấy từng làm vì bạn là gì?',
  'Ai là người chi tiêu hào phóng hơn cho các buổi ăn uống?',
  'Một câu nói của người ấy làm bạn nhớ mãi không bao giờ quên?',
  'Lần gần nhất hai đứa cãi nhau là vì chuyện gì ngớ ngẩn?',
  'Nếu trúng số 10 tỷ, điều đầu tiên bạn làm cho người yêu là gì?',
  'Khi buồn ngủ, người ấy có biểu hiện hài hước gì?',
  'Biệt danh đáng yêu nhất mà bạn muốn đặt riêng cho người ấy?',
  'Ai là người nấu ăn ngon hơn (hoặc ít làm cháy bếp hơn)?',
  'Bộ phim hay nhất hai đứa từng cùng nhau xem và khóc/cười?',
  'Điều gì ở người yêu làm bạn thấy tự hào nhất khi khoe với bạn bè?',
  'Lần đầu tiên hai đứa nói câu "Anh yêu em" / "Em yêu anh" là khi nào?',
  'Nếu được quay lại ngày đầu tiên hẹn hò, bạn muốn thay đổi điều gì?',
  'Người ấy khi say xỉn hoặc thiếu ngủ sẽ trở nên như thế nào?',
  'Ai là người nghiện điện thoại / mạng xã hội nhiều hơn?',
  'Một ước muốn lãng mạn mà bạn chưa dám ngỏ lời với người ấy?',
  'Nếu đổi thân xác cho nhau 24 giờ, việc đầu tiên bạn làm là gì?',
  'Khi giận nhau, câu nào người ấy nói ra là bạn mềm lòng ngay?',
  'Món quà đầu tiên người ấy tặng bạn là gì, bạn còn giữ không?',
  'Bạn chấm cho sự chung thủy và chu đáo của người ấy bao nhiêu trên thang điểm 10?',
  'Ai là người hay làm nũng hơn mỗi khi ở riêng 2 người?',
  'Hành động lãng mạn bất ngờ nhất người ấy từng làm cho bạn?',
  'Hai đứa có điểm chung nào kỳ lạ mà người ngoài nhìn vào thấy buồn cười?',
  'Người ấy mặc trang phục màu gì là bạn thấy đẹp và cuốn hút nhất?',
  'Nếu sau này già đi cùng nhau, bạn muốn hai đứa sẽ như thế nào?',
  'Từ ngữ nào miêu tả chính xác nhất tình yêu của hai bạn hiện tại?',
  'Hãy gửi 1 lời nhắn chân thành nhất đến người yêu lúc này!',
  'Bạn có tin vào định mệnh khi gặp được người ấy không?',
  'Nếu có 1 điều ước về tương lai 5 năm nữa của 2 đứa, bạn ước điều gì?',
];

// ≥40 Thật (Truth)
export const TRUTH_QUESTIONS: string[] = [
  'Lúc mới quen, có khoảnh khắc nào bạn suýt "quay xe" vì một chi tiết ngớ ngẩn không?',
  'Bạn từng lén xem trộm tin nhắn hoặc mạng xã hội của đối phương chưa?',
  'Một lần bạn nói dối vô hại với người yêu mà đến giờ đối phương vẫn chưa biết?',
  'Thành thật mà nói, bạn có từng crush ai khác trong thời gian 2 người hẹn hò không?',
  'Điểm nào trên khuôn mặt của người yêu mà bạn thấy cuốn hút nhất lúc này?',
  'Có món ăn nào người yêu nấu hoặc chọn mà bạn thấy dở tệ nhưng vẫn cố khen ngon?',
  'Lần gần nhất bạn rơi nước mắt vì người yêu là khi nào và vì lý do gì?',
  'Bạn đã từng nghĩ đến việc kết hôn hoặc về chung một nhà với người ấy chưa?',
  'Lần đầu tiên nhìn thấy người yêu không trang điểm / mới ngủ dậy, bạn nghĩ gì?',
  'Bạn có từng so sánh người yêu với bất kỳ ai khác chưa (dù chỉ là 1 giây)?',
  'Điều gì ở đối phương khiến bạn thỉnh thoảng cảm thấy hơi tự ti hoặc áp lực?',
  'Bạn thích nghe người yêu gọi mình bằng xưng hô nào nhất?',
  'Bí mật xấu hổ nhất thời đi học mà bạn chưa từng kể cho đối phương nghe là gì?',
  'Có bao giờ bạn giả vờ giận dỗi chỉ để được người yêu dỗ dành và mua đồ ăn chưa?',
  'Nếu được đổi 1 tính xấu của người yêu lấy 1 tỷ đồng, bạn có đồng ý đổi không?',
  'Lúc hai đứa giận nhau im lặng, bạn đã từng khóc một mình vì nhớ chưa?',
  'Bạn có nhớ chính xác ngày kỷ niệm và sinh nhật của cả gia đình người yêu không?',
  'Bộ đồ nào của người yêu mà bạn thấy "dìm hàng" nhất mỗi khi mặc ra đường?',
  'Khi người yêu ôm hoặc thơm bạn bất ngờ, cảm giác trong bụng bạn ra sao?',
  'Bạn thích người yêu ghen tuông đáng yêu hay thích người yêu lạnh lùng lý trí?',
  'Ai là người bạn cảm thấy chiếm ưu thế hơn trong mối quan hệ này?',
  'Có thói quen nào của bạn khi ở nhà một mình mà bạn giấu người yêu không?',
  'Nụ hôn đầu tiên của hai bạn, trong đầu bạn lúc đó đang nghĩ gì?',
  'Điều người ấy làm khiến bạn cảm thấy an toàn và được bảo bọc nhất là gì?',
  'Nếu người yêu đột nhiên mất trí nhớ, bạn sẽ dùng cách nào để làm người ấy yêu lại?',
  'Bạn có bao giờ stalk người yêu cũ của đối phương để tò mò xem họ ra sao không?',
  'Cảm giác của bạn khi lần đầu tiên ra mắt gia đình hoặc bạn thân của người ấy?',
  'Có lời hứa nào người ấy từng hứa mà đến giờ vẫn chưa thực hiện không?',
  'Bạn thích được khen thông minh, khen đẹp trai/xinh gái hay khen chung thủy?',
  'Lần gần nhất người ấy làm bạn giận phát điên là khi nào?',
  'Bạn đã từng viết nhật ký hoặc lưu giữ một món đồ bí mật về người ấy chưa?',
  'Nếu người yêu lỡ làm mất món quà kỷ niệm quý giá, bạn sẽ phản ứng ra sao?',
  'Khoảnh khắc nào bạn nhận ra mình đã hoàn toàn say đắm người ấy không thể dứt?',
  'Bạn muốn hai đứa sẽ tổ chức đám cưới theo phong cách như thế nào?',
  'Bạn đánh giá khả năng nịnh người yêu của mình được mấy điểm?',
  'Một điều bạn mong muốn người yêu thấu hiểu hơn về công việc / cuộc sống của mình?',
  'Có bức ảnh dìm hàng nào của người yêu mà bạn đang giữ làm bảo bối tống tiền không?',
  'Nếu mai là ngày tận thế, điều cuối cùng bạn muốn nói với người yêu là gì?',
  'Bạn yêu tính cách nào của người yêu nhất mà không một ai khác có được?',
  'Bạn có sẵn sàng nhường miếng đồ ăn ngon cuối cùng cho người yêu không?',
  'Có bao giờ bạn thức đêm ngắm người yêu ngủ và thầm cảm ơn vì đã có nhau chưa?',
];

// ≥40 Thách (Dare)
export const DARE_CHALLENGES: string[] = [
  'Bật camera / micro gửi ngay một đoạn thu âm giọng nhõng nhẽo xin tha mạng!',
  'Thơm vào màn hình điện thoại đúng vào avatar của người yêu 3 cái thật kêu! 💋',
  'Gọi điện thoại hoặc voice chat và hát chay tặng người yêu 4 câu trong bài hát yêu thích!',
  'Chụp ngay một bức ảnh mặt xấu nhất có thể và gửi vào tin nhắn cho đối phương!',
  'Đăng story hoặc trạng thái mạng xã hội: "Tôi thừa nhận tôi là người dại người yêu nhất thế giới!" trong 15 phút!',
  'Nói liên tục 3 câu ngọt ngào sến súa nhất mà bạn từng nghe bằng giọng nghiêm túc!',
  'Làm động tác bắn tim aegyo 3 góc độ khác nhau gửi cho người yêu chấm điểm!',
  'Hứa và làm ngay: Rót một cốc nước mát uống và nhắc người yêu cũng phải uống nước ngay!',
  'Viết tên người yêu lên trán hoặc lên tay bằng bút chì rồi chụp ảnh lại!',
  'Gửi 5 lời khen thật lòng và chi tiết về ngoại hình của đối phương trong 30 giây!',
  'Nhận hình phạt mát-xa vai 10 phút vào lần gặp nhau tiếp theo không được từ chối!',
  'Đổi hình đại diện trên web app này thành emoji con ếch 🐸 hoặc con lợn 🐷 trong 1 vòng chơi!',
  'Tự quay video 5 giây hôn gió gửi sang máy người yêu!',
  'Hát 1 bài thiếu nhi với phong cách cực kỳ lãng mạn và tình cảm!',
  'Đứng dậy nhảy một điệu nhảy ngớ ngẩn trong phòng 15 giây rồi báo cáo!',
  'Chuyển khoản cho người yêu 5.200đ hoặc 13.140đ kèm lời nhắn tình cảm ngọt lịm!',
  'Nói một câu tiếng Anh hoặc tiếng Pháp tỏ tình cực kỳ điệu nghệ!',
  'Nhắm mắt lại và dùng ngón tay chỉ vào mũi 5 lần liên tiếp không được trượt!',
  'Gọi người yêu là "Đại vương vĩ đại" hoặc "Công chúa tối thượng" trong suốt buổi chơi hôm nay!',
  'Kể lại một câu chuyện cười trong 1 phút, nếu người yêu không cười thì bị phạt tiếp!',
  'Chụp ảnh góc nghiêng thần thánh nhất của bạn gửi qua để đối phương làm hình nền!',
  'Tự thú nhận một tật xấu của mình mà đối phương chưa biết và xin hứa sửa đổi!',
  'Làm biểu cảm giận dỗi như mèo con rồi chụp ảnh gửi ngay!',
  'Bấm nút "Thả thính" 3 lần liên tiếp và phải đọc to cả 3 câu cho đối phương nghe!',
  'Hứa sẽ chuẩn bị một món quà bất ngờ nhỏ vào lần gặp mặt tới!',
  'Nói to 3 lần: "Anh/Em là người tuyệt vời nhất trên đời, em/anh yêu người ấy nhất!"',
  'Chụp ảnh đôi bàn chân hoặc đôi tất đang đi gửi cho người yêu xem!',
  'Mô tả tình yêu của bạn dành cho người ấy bằng một loại trái cây và giải thích lý do!',
  'Bắt chước giọng nói của người yêu lúc giận dỗi trong 10 giây!',
  'Tặng người yêu 1 voucher tự chế: "Miễn phí 1 lần làm nũng vô điều kiện"!',
  'Gửi một bức ảnh thời thơ ấu hài hước của bạn cho người yêu ngắm!',
  'Tự đếm từ 1 đến 20 bằng giọng nói nhanh như máy bay phản lực!',
  'Hứa sẽ thức dậy sớm hơn 10 phút vào ngày mai để nhắn tin chúc buổi sáng!',
  'Nói câu: "Em/Anh sai rồi, người yêu là nóc nhà muôn năm!" thật dõng dạc!',
  'Tự véo nhẹ má mình và bảo "Được người yêu cưng sướng ghê"!',
  'Gửi 1 clip ngắn nháy mắt thả thính siêu quyến rũ!',
  'Viết một câu thơ 4 câu tặng đối phương ngay trong khung chat!',
  'Gửi một meme hài hước nhất trong máy bạn để đối phương cười sảng khoái!',
  'Hứa bao người yêu 1 ly trà sữa full topping vào cuối tuần này!',
  'Ôm gối ôm hoặc gấu bông và xem đó là người yêu trong 1 phút!',
  'Nói lời cảm ơn người yêu vì đã luôn kiên nhẫn và ở bên bạn suốt thời gian qua 💕',
];

// Hình phạt Kéo búa bao vui nhẹ
export const RPS_PENALTIES: string[] = [
  'Phạt thơm má đối phương 5 cái kêu to vào lần gặp tới! 💋',
  'Phạt bao đối phương 1 cốc trà sữa full trân châu đường đen 🧋',
  'Phạt mát-xa vai lưng cho đối phương 5 phút không than mỏi 💆',
  'Phạt chụp ảnh selfie xấu xí gửi ngay qua chat làm kỷ niệm 📸',
  'Phạt hát tặng người thắng 1 đoạn điệp khúc bài hát tình ca 🎤',
  'Phạt gọi người thắng là "Nóc nhà vĩ đại" trong 24 giờ tới 👑',
  'Phạt bóc tôm hoặc gỡ xương cá cho người thắng trong bữa ăn tới 🍤',
  'Phạt rửa bát hoặc dọn bàn sau bữa ăn chung lần tới 🍽️',
  'Phạt viết 3 câu khen ngợi người thắng gửi lên trang cá nhân hoặc chat 💌',
  'Phạt gửi voice note chúc ngủ ngon với giọng em bé dễ thương 🌙',
  'Phạt làm mặt cún con xin lỗi vì đã lỡ... thua cuộc 🐶',
  'Phạt mua đồ ăn sáng mang đến tận nơi cho người thắng 🥐',
  'Phạt gắp thú bông tặng người thắng đến khi nào gắp được mới thôi 🧸',
  'Phạt chấp nhận 1 yêu cầu bất kỳ của người thắng trong hôm nay ✨',
];

// Tình huống Tòa Án Tình Yêu mẫu
export const SAMPLE_COURT_CASES = [
  {
    title: 'Vụ án: Hỏi "Ăn gì cũng được" nhưng gợi ý 10 quán đều chê',
    situation: 'Nguyên cáo hỏi bị cáo trưa nay ăn gì, bị cáo bảo "Ăn gì cũng được, tuỳ anh/em". Nhưng gợi ý Phở thì chê nóng, Cơm thì sợ béo, Bún đậu thì sợ hôi, Trà sữa thì bảo giảm cân. Cuối cùng nhịn đói dỗi ngược lại!',
  },
  {
    title: 'Vụ án: Đi ngủ quên chúc ngủ ngon làm nguyên cáo thức trắng đêm',
    situation: 'Bị cáo hứa sẽ nhắn tin tâm sự trước khi ngủ, nhưng mới 10h tối đã lặn mất tăm không một lời từ biệt. Đến sáng hôm sau mới nhắn "Ủa anh/em ngủ quên mất tiêu hihi".',
  },
  {
    title: 'Vụ án: Chụp 100 tấm ảnh cho người yêu nhưng không chọn được tấm nào ra hồn',
    situation: 'Nguyên cáo đã tạo dáng mỏi cả chân, chỉ bảo nhiệt tình góc máy ánh sáng, nhưng bị cáo chụp toàn mờ, mắt nhắm, góc lùn đi một nửa! Tội này có đáng bị xử phạt?',
  },
  {
    title: 'Vụ án: Ăn hết miếng ngon cuối cùng không chừa cho người yêu',
    situation: 'Đĩa đồ ăn còn đúng miếng thịt ngon nhất, nguyên cáo vừa định gắp thì bị cáo đã nhanh tay đưa thẳng vào miệng nhai ngon lành kèm nụ cười đắc thắng!',
  },
];

// Vòng quay hôm nay ăn gì / đi đâu / làm gì
export const WHEEL_PRESETS = {
  food: [
    'Trà sữa 🧋',
    'Bún bò Huế 🍜',
    'Lẩu Haidilao 🍲',
    'Cơm tấm sườn 🍛',
    'Pizza & Gà rán 🍕',
    'Bún đậu mắm tôm 🥢',
    'Đồ nướng BBQ 🥩',
    'Bánh tráng nướng 🫓',
  ],
  date: [
    'Đi dạo phố đêm 🌙',
    'Đi xem phim rạp 🎬',
    'Cà phê sân thượng ☕',
    'Đi siêu thị cùng nhau 🛒',
    'Đi tô tượng / làm gốm 🎨',
    'Lên cầu ngắm hoàng hôn 🌅',
    'Đi ăn vặt vỉa hè 🍡',
    'Ở nhà nấu ăn cùng nhau 🍳',
  ],
  fun: [
    'Nằm ôm nhau xem phim 🛋️',
    'Cùng chơi game đối kháng 🎮',
    'Tâm sự thâu đêm 🌙',
    'Chụp bộ ảnh kỷ niệm 📸',
    'Học nấu món mới cùng nhau 🥘',
    'Đi gắp thú bông 🧸',
    'Đi bơi / đạp vịt 🦢',
    'Đọc sách / nghe podcast chung 🎧',
  ],
};

// Thả thính ngọt ngào & tếu
export const PICKUP_LINES: string[] = [
  'Trái đất tròn mà em/anh trốn đâu trong tim kỹ thế, tìm mãi không ra lối thoát! 💕',
  'Em/Anh có mỏi chân không? Cứ chạy nhảy trong tâm trí anh/em cả ngày trời!',
  'Người ta thích hoàng hôn, còn anh/em chỉ thích được hôn người ta thôi. 💋',
  'Anh/Em không phải là người hoàn hảo, nhưng anh/em hoàn hảo khi ở cạnh em/anh!',
  'Muốn ăn cơm thì phải nấu, muốn có bồ gấu thì phải yêu em/anh! 🐻',
  'Nhà em/anh có bán rượu không, mà nói chuyện với em/anh anh/em say quá chừng!',
  'Trứng rán cần mỡ, bắp cần bơ. Yêu không cần cớ, cần em/anh cơ! 🌽',
  'Trời đổ mưa rồi, sao em/anh chưa đổ vào lòng anh/em nữa? 🌧️',
  'Em/Anh ơi trà sữa anh/em mời, còn cuộc đời em/anh có chịu về chung với anh/em không?',
  'Dạo này anh/em thấy người hơi mệt, chắc tại thiếu vitamin Em/Anh rồi!',
  'Người ta bảo đường ngọt nhất, nhưng người ta chưa thấy nụ cười của em/anh rồi! 🍯',
  'Nếu có 2 sự lựa chọn: một là giàu có, hai là yêu em/anh. Anh/Em chọn yêu em/anh rồi mình cùng nhau làm giàu!',
  'Mặt trời mọc ở hướng Đông, còn người yêu ở trong lòng anh/em chứ đâu! ☀️',
  'Gặp em/anh một lần là duyên, thương em/anh một đời là định mệnh! 🍀',
  'Hôm nay trời đẹp dịu dàng, hay là mình cùng dắt tay nhau đi trọn thanh xuân nha! 🌸',
  'Anh/Em biết bơi không? Sao cứ để em/anh chìm đắm trong ánh mắt em/anh hoài vậy!',
  'Nghe nói em/anh thích đồ ngọt, may quá anh/em lại dẻo miệng cực kỳ! 🍬',
  'Em/Anh có bật định vị không, sao đi đâu anh/em cũng thấy bóng dáng người yêu thế này?',
  'Tim anh/em vốn là đường một chiều, từ ngày em/anh bước vào thì khóa cửa luôn rồi!',
  'Cảm ơn cuộc đời đã đưa một thiên thần như em/anh đến làm người yêu của anh/em! 👼',
];

// Danh sách gợi ý lời hẹn ước (Bucket List)
export const DEFAULT_BUCKET_LIST = [
  'Cùng nhau ngắm hoàng hôn và đón bình minh ở Đà Lạt 🌄',
  'Cùng đi xem concert của thần tượng hai đứa thích 🎶',
  'Tự tay nấu một bàn tiệc kỷ niệm thịnh soạn cho nhau 🍽️',
  'Nuôi chung một bé cún hoặc bé mèo ngoan ngoãn 🐾',
  'Cùng nhau đi du lịch nước ngoài ít nhất một lần ✈️',
  'Đi chụp một bộ ảnh cưới / ảnh đôi thật đẹp làm kỷ niệm 📸',
  'Cùng nhau thức trắng một đêm tâm sự đủ thứ chuyện trên đời 🌙',
  'Mở một tài khoản tiết kiệm chung cho tương lai hai đứa 💰',
  'Nắm tay nhau đi qua mùa đông lạnh giá và cùng đón giao thừa 🎆',
  'Về chung một nhà và sống hạnh phúc đến đầu bạc răng long 💍',
];
