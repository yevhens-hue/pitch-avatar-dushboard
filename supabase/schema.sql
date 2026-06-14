-- Створення таблиці tasks
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL,
  task_group TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Налаштування RLS (Row Level Security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Дозволити публічний доступ до читання (тимчасово для дашборду, якщо немає авторизації)
CREATE POLICY "Allow public read access"
  ON tasks FOR SELECT
  USING (true);

-- Дозволити публічний доступ до запису/зміни (тимчасово)
CREATE POLICY "Allow public insert access"
  ON tasks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON tasks FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access"
  ON tasks FOR DELETE
  USING (true);

-- Можна додати початкові дані (опціонально)
