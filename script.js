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

// 从localStorage加载预约状态
let bookings = JSON.parse(localStorage.getItem('bookings')) || {};

// 初始化预约表格
function initScheduleTable() {
    const table = document.getElementById('scheduleTable');

    // 添加时间段标题
    timeSlots.forEach(slot => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = slot.time;
        table.appendChild(timeSlot);
    });

    // 添加直播间和预约按钮
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
            button.className = `booking-button ${bookings[`${room.id}-${slot.id}`] ? 'booked' : ''}`;
            button.textContent = bookings[`${room.id}-${slot.id}`] ? '取消预约' : '预约';
            button.onclick = () => toggleBooking(room.id, slot.id);
            roomDiv.appendChild(button);
        });

        table.appendChild(roomDiv);
    });
}

// 切换预约状态
function toggleBooking(roomId, slotId) {
    const key = `${roomId}-${slotId}`;
    const button = document.querySelector(`button[onclick="toggleBooking(${roomId}, ${slotId})"]`);

    if (bookings[key]) {
        delete bookings[key];
        button.textContent = '预约';
        button.classList.remove('booked');
    } else {
        bookings[key] = true;
        button.textContent = '取消预约';
        button.classList.add('booked');
    }

    // 保存到localStorage
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

// 初始化
initScheduleTable();