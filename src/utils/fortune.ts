/**
 * Thuật toán bói tình yêu duy nhất & cố định (deterministic)
 * Dựa trên Cung hoàng đạo, Con giáp (Âm/Dương lịch ước lượng), Số chủ đạo thần số học
 */

export interface FortuneResult {
  score: number; // 0 - 100
  title: string;
  zodiacMatch: string;
  conGiapMatch: string;
  numerologyMatch: string;
  humorousVerdict: string;
  advice: string;
  luckyColor: string;
  luckyActivity: string;
}

// Cung hoàng đạo
interface Zodiac {
  name: string;
  element: 'Lửa' | 'Đất' | 'Khí' | 'Nước';
  symbol: string;
}

export function getZodiac(dateStr: string): Zodiac {
  if (!dateStr) return { name: 'Thiên Bình', element: 'Khí', symbol: '♎' };
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: 'Bạch Dương', element: 'Lửa', symbol: '♈' };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: 'Kim Ngưu', element: 'Đất', symbol: '♉' };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return { name: 'Song Tử', element: 'Khí', symbol: '♊' };
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return { name: 'Cự Giải', element: 'Nước', symbol: '♋' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: 'Sư Tử', element: 'Lửa', symbol: '♌' };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: 'Xử Nữ', element: 'Đất', symbol: '♍' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return { name: 'Thiên Bình', element: 'Khí', symbol: '♎' };
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return { name: 'Bọ Cạp', element: 'Nước', symbol: '♏' };
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return { name: 'Nhân Mã', element: 'Lửa', symbol: '♐' };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: 'Ma Kết', element: 'Đất', symbol: '♑' };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: 'Bảo Bình', element: 'Khí', symbol: '♒' };
  return { name: 'Song Ngư', element: 'Nước', symbol: '♓' };
}

// Con giáp theo năm
const CON_GIAP = [
  'Thân 🐒', 'Dậu 🐓', 'Tuất 🐕', 'Hợi 🐖',
  'Tý 🐭', 'Sửu 🐂', 'Dần 🐅', 'Mão 🐱',
  'Thìn 🐲', 'Tỵ 🐍', 'Ngọ 🐎', 'Mùi 🐐'
];

export function getConGiap(dateStr: string): string {
  if (!dateStr) return 'Tý 🐭';
  const year = new Date(dateStr).getFullYear() || 2000;
  const index = Math.abs(year % 12);
  return CON_GIAP[index] || 'Mão 🐱';
}

// Số chủ đạo theo thần số học (Pitago)
export function getLifePathNumber(dateStr: string): number {
  if (!dateStr) return 7;
  // Xóa ký tự gạch nối và cộng dồn
  const digits = dateStr.replace(/\D/g, '');
  if (!digits) return 7;

  let sum = digits.split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
  while (sum > 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
  }
  return sum;
}

// Hash chuỗi ngày sinh để tạo seed cố định
function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateLoveFortune(birthday1: string, birthday2: string): FortuneResult {
  // Sắp xếp ngày để dù người 1 hay người 2 gọi trước thì thứ tự hash vẫn giống hệt
  const datesSorted = [birthday1 || '2000-01-01', birthday2 || '2000-01-02'].sort();
  const seed = stringHash(datesSorted.join('#'));

  const z1 = getZodiac(birthday1);
  const z2 = getZodiac(birthday2);
  const cg1 = getConGiap(birthday1);
  const cg2 = getConGiap(birthday2);
  const num1 = getLifePathNumber(birthday1);
  const num2 = getLifePathNumber(birthday2);

  // 1. Điểm nguyên tố Cung hoàng đạo (tối đa 40 điểm)
  let elementScore = 30;
  if (z1.element === z2.element) {
    elementScore = 38; // Cùng hệ: thấu hiểu, đồng điệu
  } else if (
    (z1.element === 'Lửa' && z2.element === 'Khí') ||
    (z1.element === 'Khí' && z2.element === 'Lửa') ||
    (z1.element === 'Đất' && z2.element === 'Nước') ||
    (z1.element === 'Nước' && z2.element === 'Đất')
  ) {
    elementScore = 39; // Cặp tương sinh: gió thổi lửa bùng cháy, nước tưới đất tốt tươi
  } else {
    elementScore = 28; // Bù trừ, hút nhau kiểu nam châm trái dấu
  }

  // 2. Điểm Con giáp (tối đa 30 điểm)
  // Tính dựa trên khoảng cách modulo năm
  const y1 = new Date(birthday1 || '2000-01-01').getFullYear();
  const y2 = new Date(birthday2 || '2000-01-02').getFullYear();
  const diff = Math.abs(y1 - y2) % 12;

  let conGiapScore = 25;
  if (diff === 4 || diff === 8) {
    conGiapScore = 30; // Tam Hợp
  } else if (diff === 6) {
    conGiapScore = 26; // Tứ hành xung nhưng yêu nhau thì bù trừ tếu táo
  } else if (diff === 1 || diff === 5) {
    conGiapScore = 29; // Nhị hợp / Lục hợp
  } else {
    conGiapScore = 27; // Bình hòa
  }

  // 3. Điểm Thần số học (tối đa 30 điểm)
  const numDiff = Math.abs(num1 - num2);
  let numScore = 26;
  if (numDiff === 0 || numDiff === 2 || numDiff === 4) {
    numScore = 29;
  } else {
    numScore = 27;
  }

  // Thêm độ dao động nhẹ từ seed để cặp đôi luôn được điểm yêu thương cao (82% - 99%)
  const bonus = (seed % 6);
  let totalScore = elementScore + conGiapScore + numScore + bonus;
  if (totalScore > 99) totalScore = 99;
  if (totalScore < 82) totalScore = 85;

  // Lời bình vui tếu theo điểm
  const funnyTitles = [
    'Trời Sinh Một Cặp - Đố Ai Tách Được! 💘',
    'Cặp Đôi Định Mệnh - Dính Nhau Như Kẹo Kéo! 🍬',
    'Gương Mặt Thân Quen - Kiếp Trước Đã Nợ Nhau! 👩‍❤️‍💋‍👨',
    'Tình Yêu Sét Đánh - Dính Bùa Yêu Trọn Đời! ⚡',
    'Cặp Đôi Bất Bại - Cãi Nhau 5 Phút Lại Ôm Nhau! 🥊',
  ];

  const humorousVerdicts = [
    `Bên nhau như trà sữa với trân châu đường đen: thiếu một thứ là mất ngon liền! Đối phương nhìn qua có vẻ bướng nhưng thực chất dễ dụ, chỉ cần thơm má và mua đồ ăn là ngoan ngay.`,
    `Một người nói nhiều như đài phát thanh, một người giả vờ nghe nhưng trong lòng cưng chiều hết mực. Hai bạn có năng khiếu chọc tức nhau nhưng 10 phút sau lại tìm cớ nhắn tin hỏi "Đang làm gì đấy?".`,
    `Tướng phu thê lộ rõ mồn một! Điểm chung lớn nhất là lúc nào cũng phân vân không biết ăn gì, cuối cùng người này dỗi, người kia phải dắt đi ăn quán quen. Nhưng hứa hẹn sẽ bám lấy nhau cả đời!`,
    `Độ dính nhau đạt mức báo động đỏ! Cứ hễ rời nhau ra nửa ngày là bắt đầu nhớ nhung, mở ảnh nhau ra ngắm rồi cười tủm tỉm một mình. Hai bạn sinh ra là để chịu đựng sự đáng yêu của nhau.`,
    `Cặp đôi chuẩn quy luật bù trừ: một bên hay quên, một bên nhắc nhở; một bên nóng tính, một bên biết làm mặt cún con để xoa dịu. Nhìn chung là duyên trời ban, chạy đâu cho thoát!`,
  ];

  const luckyActivities = [
    'Đi ăn lẩu rồi vừa ăn vừa bóc tôm cho nhau 🍲',
    'Cùng nhau nằm ôm xem phim hoạt hình rồi ngủ quên 🎬',
    'Đi dạo phố hóng gió và tạt vào quán trà sữa quen 🧋',
    'Chụp một tấm hình dìm hàng đối phương để làm kỷ niệm 📸',
    'Rủ nhau đi gắp thú bông và tặng nhau bé gấu cute 🧸',
  ];

  const luckyColors = ['Hồng pastel 🌸', 'Đỏ dâu tây 🍓', 'Tím mộng mơ 💜', 'Xanh bạc hà tươi mát 🍃', 'Vàng nắng ấm áp ☀️'];

  const title = funnyTitles[seed % funnyTitles.length];
  const humorousVerdict = humorousVerdicts[(seed + 2) % humorousVerdicts.length];
  const luckyActivity = luckyActivities[(seed + 3) % luckyActivities.length];
  const luckyColor = luckyColors[seed % luckyColors.length];

  return {
    score: totalScore,
    title,
    zodiacMatch: `${z1.symbol} ${z1.name} (${z1.element}) & ${z2.symbol} ${z2.name} (${z2.element}): Cặp đôi mang năng lượng ${elementScore >= 35 ? 'hòa quyện tuyệt đối' : 'bù trừ kỳ diệu'}, gặp là dính!`,
    conGiapMatch: `Tuổi ${cg1} kết hợp cùng Tuổi ${cg2}: Tương hợp vững bền, vừa là người yêu vừa là bạn thân chí cốt cùng chí hướng.`,
    numerologyMatch: `Số chủ đạo ${num1} & ${num2}: Thấu hiểu tâm lý đối phương, chỉ cần liếc mắt một cái là biết người kia muốn giở trò gì!`,
    humorousVerdict,
    advice: 'Muốn tình yêu luôn trên 100%, hãy nhớ câu thần chú: "Người yêu luôn luôn đúng, nếu người yêu sai hãy xem lại điều 1" nhé! 💕',
    luckyColor,
    luckyActivity,
  };
}
