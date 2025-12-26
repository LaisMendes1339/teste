document.addEventListener('DOMContentLoaded', () => {
  // Estado
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;

  // Elementos
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const monthYearEl = document.getElementById('current-month-year');
  const calendarDatesEl = document.getElementById('calendar-dates');
  const confirmBtn = document.getElementById('confirm-booking');

  // Nomes dos meses
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Renderiza o calendário
  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0 = Jan

    // Atualiza título
    monthYearEl.textContent = `${monthNames[month]} ${year}`;

    // Limpa dias antigos
    calendarDatesEl.innerHTML = '';

    // Primeiro dia do mês (0 = Dom, 1 = Seg, ...)
    const firstDay = new Date(year, month, 1).getDay();

    // Último dia do mês
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Dias do mês anterior (preenche início)
    const prevLast = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayEl = document.createElement('div');
      dayEl.classList.add('day', 'disabled');
      dayEl.textContent = prevLast - i;
      calendarDatesEl.appendChild(dayEl);
    }

    // Hoje (para desativar dias passados)
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // Dias do mês atual
    for (let i = 1; i <= lastDate; i++) {
      const dayEl = document.createElement('div');
      dayEl.classList.add('day');
      dayEl.textContent = i;

      // Desativar dias passados
      if (
        year < todayYear ||
        (year === todayYear && month < todayMonth) ||
        (year === todayYear && month === todayMonth && i < todayDate)
      ) {
        dayEl.classList.add('disabled');
      } else {
        dayEl.addEventListener('click', () => {
          // Remover seleção anterior
          document.querySelectorAll('.day.selected').forEach(el => el.classList.remove('selected'));
          // Selecionar novo
          dayEl.classList.add('selected');
          selectedDate = {
            day: i,
            month: month + 1, // meses humanos (1–12)
            year: year
          };
        });
      }

      calendarDatesEl.appendChild(dayEl);
    }

    // Dias do próximo mês (preenche final)
    const totalCells = 42; // 6 semanas x 7 dias
    const usedCells = firstDay + lastDate;
    const nextDays = totalCells - usedCells;
    for (let i = 1; i <= nextDays; i++) {
      const dayEl = document.createElement('div');
      dayEl.classList.add('day', 'disabled');
      dayEl.textContent = i;
      calendarDatesEl.appendChild(dayEl);
    }
  }

  // Eventos de navegação
  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  // Inicializa com o mês atual
  renderCalendar(currentDate);

  // Seleção de horário
  const timeSlots = document.querySelectorAll('.time-slots-right .slot');
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      selectedTime = slot.textContent.split(' ')[0]; // "08:00"
    });
  });

  // Confirmação de agendamento
  if (confirmBtn) {
    confirmBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (!selectedDate || !selectedTime) {
        alert('⚠️ Por favor, selecione uma data e um horário.');
        return;
      }

      const { day, month, year } = selectedDate;
      const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
      const message = `Olá! Gostaria de agendar um banho e tosa para meu pet no dia ${formattedDate} às ${selectedTime}.`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/55859998421339?text=${encodedMessage}`;

      alert(`✅ Você será redirecionado ao WhatsApp para confirmar:\n\n📅 ${formattedDate}\n⏰ ${selectedTime}\n\n⚠️ Seu horário só será reservado após nossa confirmação no WhatsApp.`);
      window.open(whatsappUrl, '_blank');
    });
  }

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});