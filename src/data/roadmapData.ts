export type TaskStatus = 'done' | 'active' | 'todo' | 'milestone' | 'important';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  startDate: string;
  endDate?: string;
  status: TaskStatus;
  group: string;
}

export const roadmapData: Task[] = [
  // Дизайн та Доки
  {
    id: 'des1',
    title: 'Затвердити дизайн Enrollments',
    description: 'Отримати та затвердити дизайн. Написати шаблон документа, відправити Павлу.',
    assignee: '@yevhen.shaforostov',
    startDate: '2026-06-15',
    endDate: '2026-06-15',
    status: 'done',
    group: 'Дизайн та Доки'
  },
  {
    id: 'des2',
    title: 'UI/UX: Listeners with Enrollments',
    description: 'Описати епік, створити задачу на дизайнера. Створити UI/UX документ, відправити Павлу на затвердження.',
    assignee: '@yevhen.shaforostov',
    startDate: '2026-06-16',
    endDate: '2026-06-16',
    status: 'active',
    group: 'Дизайн та Доки'
  },
  {
    id: 'des3',
    title: 'UI/UX: Template',
    description: 'Створити UI/UX документ по дизайну Приклад. Після описаного документу відправити Павлу на затвердження.',
    assignee: '@yevhen.shaforostov',
    startDate: '2026-06-16',
    endDate: '2026-06-18',
    status: 'todo',
    group: 'Дизайн та Доки'
  },
  {
    id: 'des4',
    title: 'Дизайн: Universal Project Editing',
    description: 'Створити задачі на дизайнера.',
    assignee: '@yevhen.shaforostov',
    startDate: '2026-06-18',
    endDate: '2026-06-18',
    status: 'todo',
    group: 'Дизайн та Доки'
  },
  {
    id: 'des5',
    title: 'Дизайн: Import Контенту',
    description: 'Створити задачі на дизайнера.',
    assignee: '@yevhen.shaforostov',
    startDate: '2026-06-18',
    endDate: '2026-06-18',
    status: 'todo',
    group: 'Дизайн та Доки'
  },

  // Зустрічі
  {
    id: 'm1',
    title: 'Мітинг: Webhook + AI-avatar',
    description: 'Webhook + AI-аватар для інтерактивного управління віджетом та інтерфейсом. Запросити команду.',
    assignee: '@yevhen.shaforostov',
    startDate: '2026-06-17',
    status: 'milestone',
    group: 'Зустрічі'
  },
  {
    id: 'm2',
    title: 'Мітинг: Coach Role',
    description: 'Запросити команду на обговорення ролі коуча.',
    assignee: '@yevhen.shaforostov',
    startDate: '2026-06-18',
    status: 'milestone',
    group: 'Зустрічі'
  },
  {
    id: 'm3',
    title: 'Мітинг: Нові фічі',
    description: 'Universal Project Editing with Menu Items, Import контенту. Стек PHP та Front.',
    assignee: '@yevhen.shaforostov',
    startDate: '2026-06-19',
    status: 'milestone',
    group: 'Зустрічі'
  },
  {
    id: 'm4',
    title: 'Загальна презентація фіч',
    description: 'Зустріч для всієї компанії, презентація нових фіч.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-29',
    status: 'milestone',
    group: 'Зустрічі'
  },

  // Розробка та QA
  {
    id: 'dev1',
    title: 'Listeners CRUD: На DEV + Тести',
    description: 'Залити на дев Listeners CRUD. Почати тестування.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-15',
    endDate: '2026-06-16',
    status: 'active',
    group: 'Розробка та QA'
  },
  {
    id: 'dev2',
    title: 'Розробка Front: Enrollments',
    description: 'Створити задачі на фронта (Олексій 49год. Артем 36). Початок 16 числа. Реліз 9 липня.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-16',
    endDate: '2026-07-09',
    status: 'todo',
    group: 'Розробка та QA'
  },
  {
    id: 'dev3',
    title: 'Research: Чернобай (Listeners)',
    description: 'Listeners with Enrollments Setting, Control, Billing. Ресьорч на Чернобая, готовий техдизайн.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-17',
    endDate: '2026-06-18',
    status: 'todo',
    group: 'Розробка та QA'
  },
  {
    id: 'dev4',
    title: 'Dev: Чернобай (Listeners)',
    description: 'Задачі з техдизайна (28 год). Початок з 22.06.2026',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-22',
    endDate: '2026-07-09',
    status: 'todo',
    group: 'Розробка та QA'
  },
  {
    id: 'dev5',
    title: 'Dev: Задачі на фронт по Listeners',
    description: 'Задачі на фронт по затвердженому дизайну.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-19',
    endDate: '2026-06-19',
    status: 'todo',
    group: 'Розробка та QA'
  },

  // Реліз v1.123
  {
    id: 'rel1',
    title: 'Всі Code Review задачі на DEV',
    description: 'Звернутися до тімлідів відповідного стеку та повідомити про негайне оновлення на дев.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-15',
    endDate: '2026-06-16',
    status: 'active',
    group: 'Реліз v1.123'
  },
  {
    id: 'rel2',
    title: 'Listeners CRUD на DEV',
    description: 'Лістенер круд має бути злитий на дев.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-16',
    endDate: '2026-06-16',
    status: 'active',
    group: 'Реліз v1.123'
  },
  {
    id: 'rel3',
    title: 'Окрема сторінка на DEV + Тести',
    description: 'Окрема сторінка має залитися на дев та почати негайне тестування.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-19',
    endDate: '2026-06-19',
    status: 'todo',
    group: 'Реліз v1.123'
  },
  {
    id: 'rel4',
    title: 'ASAP задачі на DEV',
    description: 'Задачі асап чи звичайні задачі в гілці мають бути злиті до 19-22 числа.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-19',
    endDate: '2026-06-22',
    status: 'todo',
    group: 'Реліз v1.123'
  },
  {
    id: 'rel5',
    title: 'Заливка на Stage + QA Регрес',
    description: 'Задачі мають залитися на стейдж та проходити мануальне та регресійне тестування.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-23',
    endDate: '2026-06-24',
    status: 'todo',
    group: 'Реліз v1.123'
  },
  {
    id: 'm5',
    title: 'Оновлення ПРОДу (v1.123)',
    description: 'Оновлюємо прод новими задачами з гілки 123. Написати в general.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-25',
    status: 'milestone',
    group: 'Реліз v1.123'
  },

  // Менеджмент
  {
    id: 'man1',
    title: 'Виправлення доку Listeners CRUD',
    description: 'Виправити в документі, прибрати множинний варіант, відправити повторно Павлу.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-15',
    endDate: '2026-06-15',
    status: 'done',
    group: 'Менеджмент'
  },
  {
    id: 'man2',
    title: 'Звіт по багах за півріччя',
    description: 'Порівняти баги за минуле півріччя та за цей період. Відправити Павлу лист.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-18',
    endDate: '2026-06-18',
    status: 'todo',
    group: 'Менеджмент'
  },
  {
    id: 'man3',
    title: 'Планування Спринту 7/1',
    description: 'Врахувати відпустки та чергування. Має бути готові як мінімум дві фічі.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-22',
    endDate: '2026-06-23',
    status: 'todo',
    group: 'Менеджмент'
  },
  {
    id: 'man4',
    title: 'Анонс релізу та відео-огляди',
    description: 'Записати окремі короткі відео про фічу, завантажити на Google Drive, написати в general.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-25',
    endDate: '2026-06-25',
    status: 'todo',
    group: 'Менеджмент'
  },

  // Важливе
  {
    id: 'imp1',
    title: 'Кешування Intro message (GO)',
    description: 'Зменшити час очікування. Задачу поставити на Медніса, переасайнити з Трофимова.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-15',
    status: 'important',
    group: 'Важливе (Поточний спринт)'
  },
  {
    id: 'imp2',
    title: 'RAG Тестування (Claude)',
    description: 'Юля провела тестування за допомогою Клод. Відписати Павлу про успішне тестування.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-15',
    status: 'important',
    group: 'Важливе (Поточний спринт)'
  },
  {
    id: 'imp3',
    title: 'Баг: Переключення мов',
    description: 'Переключення мов не працює в плеєрі нормально. Провести дослідження та усунути.',
    assignee: '@Oleksandr Abramov',
    startDate: '2026-06-15',
    status: 'important',
    group: 'Важливе (Поточний спринт)'
  }
];
