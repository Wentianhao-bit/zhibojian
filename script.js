// 初始化 Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJg9clXyEOl3UY1fGavgwxwbSK8IAz7_Q",
  authDomain: "lszbj-87e83.firebaseapp.com",
  databaseURL: "https://lszbj-87e83-default-rtdb.firebaseio.com",
  projectId: "lszbj-87e83",
  storageBucket: "lszbj-87e83.appspot.com",
  messagingSenderId: "877584718053",
  appId: "1:877584718053:web:acd93008281742808f5c0c",
  measurementId: "G-SBR4LL2JHY"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 直播间数据
const liveRooms = [
    { id: 1, title: 'B606' },
    { id: 2, title: 'B610' },
    { id: 3, title: 'B612' },
    { id: 4, title: 'B304' },
    { id: 5, title: 'B308' }
];

// 时间段数据
const timeSlots = [
    { id: 1, time: '10:00 - 12:00' },
    { id: 2, time: '12:00 - 14:00' },
    { id: 3, time: '14:00 - 16:00' },
    { id: 4, time: '16:00 - 18:00' },
    { id: 5, time: '18:00 - 20:00' },
    { id: 6, time: '20:00 - 22:00' }
];

// 获取当前日期
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 初始化预约表格
async function initScheduleTable(selectedDate) {
    const table = document.getElementById('scheduleTable');
    
    // 清空现有内容
    table.innerHTML = '';

    // 从 Firebase 加载预约数据
    const snapshot = await database.ref('bookings').once('value');
    const bookings = snapshot.val() || {};

    // 添加时间段标题
    timeSlots.forEach(slot => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = slot.time;
        table.appendChild(timeSlot);
    });

    // 添加直播间和按钮
    liveRooms.forEach(room => {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';

        // 添加直播间标题
        const roomTitle = document.createElement('div');
        roomTitle.className = 'room-title';
        roomTitle.textContent = room.title;
        roomDiv.appendChild(roomTitle);

        // 添加每个时间段的预约按钮
        timeSlots.forEach(slot => {
            const button = document.createElement('button');
            const key = `${selectedDate}-${room.id}-${slot.id}`; // 使用选择的日期作为键的一部分
            
            // 从 Firebase 获取当前状态
            const isBooked = !!bookings[key];
            
            button.className = `booking-button ${isBooked ? 'booked' : ''}`;
            button.textContent = slot.time; // 直接在按钮上显示时间段
            button.onclick = () => toggleBooking(selectedDate, room.id, slot.id, button);
            roomDiv.appendChild(button);
        });

        table.appendChild(roomDiv);
    });
}

// 切换预约状态
async function toggleBooking(selectedDate, roomId, slotId, button) {
    const key = `${selectedDate}-${roomId}-${slotId}`;
    
    // 获取当前状态
    const snapshot = await database.ref(`bookings/${key}`).once('value');
    const isBooked = snapshot.exists();

    if (isBooked) {
        // 取消预约
        await database.ref(`bookings/${key}`).remove();
        button.classList.remove('booked');
        button.style.backgroundColor = 'green'; // 未预约时显示绿色
    } else {
        // 新增预约
        await database.ref(`bookings/${key}`).set(true);
        button.classList.add('booked');
        button.style.backgroundColor = 'red'; // 预约后显示红色
    }
}

// 初始化日期选择器
function initDatePicker() {
    const datePicker = document.createElement('input');
    datePicker.type = 'date';
    datePicker.value = getCurrentDate(); // 默认选择当前日期
    datePicker.onchange = (event) => {
        const selectedDate = event.target.value;
        initScheduleTable(selectedDate); // 根据选择的日期重新加载表格
    };

    // 将日期选择器添加到页面
    const container = document.getElementById('datePickerContainer');
    container.innerHTML = ''; // 清空现有内容
    container.appendChild(datePicker);
}

// 初始化
initDatePicker(); // 初始化日期选择器
initScheduleTable(getCurrentDate()); // 初始化表格，默认使用当前日期
