import { Component } from '@angular/core';

declare var FullCalendar: any;
declare const window: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dateCalendario = {
    "month": "2024-08",
    "primeDates": [
      "2024-07-02",
      "2024-07-03",
      "2024-07-04",
      "2024-07-05",
      "2024-07-06",
      "2024-07-07",
      "2024-07-17",
      "2024-07-19",
      "2024-07-23",
      "2024-07-29",
      "2024-07-31"
    ]
  }
  selectedDate?: string;
  calendar:any;
  ngAfterViewInit() {
    const calendarEl = document.getElementById('calendar');

    // Asegúrate de que FullCalendar esté cargado
    if (!window.FullCalendar) {
      console.error('FullCalendar no está disponible en el entorno global.');
      return;
    }

    this.calendar = new window.FullCalendar.Calendar(calendarEl!, {
      initialView: 'dayGridMonth',
      firstDay: 1,
      locale: 'es',
      events: [
        { title: 'Event 1', date: '2024-08-15' },
        { title: 'Event 2', date: '2024-08-16' }
      ],
      headerToolbar: { // Configuración de la barra de herramientas
        //left: '', // Botones en el lado izquierdo (vacío para ocultar)
        center: '', // Botones en el centro (vacío para ocultar)
        right: '' // Botones en el lado derecho (vacío para ocultar)
      },
      dayCellDidMount: (info: any) => {
        const dateStr = this.formatDate(info.date);
        const isCurrentMonth = info.date.getMonth() === this.calendar.view.currentStart.getMonth();

        if (isCurrentMonth) {
          if (this.dateCalendario.primeDates.includes(dateStr)) {
            info.el.style.backgroundColor = 'yellow';
          } else {
            info.el.style.backgroundColor = 'lightgray'; // Color para fechas no marcadas
          }
        } else {
          // Estilo para fechas que no son del mes actual
          info.el.style.backgroundColor = 'transparent';
          info.el.style.pointerEvents = 'none'; // Desactiva la interacción
        }
      },
      dateClick: (info: any) => {
        // Solo imprimir la fecha clickeada en la consola
        console.log('Fecha clickeada:', info.dateStr);
        this.selectedDate = info.dateStr;
      }
    });

    this.calendar.render();

    // Controladores de eventos para los botones de navegación
    document.getElementById('updateCalendar')?.addEventListener('click', () => {
      const input = (document.getElementById('monthYear') as HTMLInputElement).value;
      const [year, month] = input.split('-').map(Number);
      
      if (year && month >= 1 && month <= 12) {
        this.updateCalendarDate(year, month);
      } else {
        alert('Por favor, ingrese una fecha válida en formato YYYY-MM.');
      }
    });
  }

  private updateCalendarDate(year: number, month: number) {
    const dateStr = `${year}-${this.padZero(month)}`;
    this.calendar.gotoDate(dateStr + '-01'); // Establece el primer día del mes para la vista

    // Log para ver la fecha actual del calendario
    console.log(`Mes actualizado a: ${year}-${this.padZero(month)}`);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
